"use client"

import { useEffect, useRef } from "react"
import { Section } from "@/components/section"
import { useSiteConfig } from "@/hooks/use-site-config"
import { useAudio } from "@/contexts/audio-context"
import { Cinzel } from "next/font/google"
import { ExternalLink, Music } from "lucide-react"
import Image from "next/image"

interface SpotifyPlaybackUpdate {
  playingURI: string
  isPaused: boolean
  isBuffering: boolean
  duration: number
  position: number
}

interface SpotifyEmbedController {
  addListener: (
    event: "playback_update" | "playback_started" | "ready",
    callback: (event: { data: SpotifyPlaybackUpdate }) => void
  ) => void
  removeListener: (
    event: "playback_update" | "playback_started" | "ready",
    callback: (event: { data: SpotifyPlaybackUpdate }) => void
  ) => void
  destroy: () => void
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string; height?: string },
    callback: (controller: SpotifyEmbedController) => void
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: SpotifyIframeApi) => void
  }
}

let cachedSpotifyIframeApi: SpotifyIframeApi | null = null
const spotifyApiReadyQueue: Array<(api: SpotifyIframeApi) => void> = []

function getSpotifyUri(url: string): string {
  const match = url.match(
    /open\.spotify\.com\/(?:embed\/)?(playlist|album|track|episode)\/([^/?&#]+)/
  )
  if (!match) return url
  return `spotify:${match[1]}:${match[2]}`
}

function getSpotifyOpenUrl(url: string): string {
  const uri = getSpotifyUri(url)
  const match = uri.match(/^spotify:(playlist|album|track|episode):(.+)$/)
  if (!match) return url
  return `https://open.spotify.com/${match[1]}/${match[2]}`
}

function loadSpotifyIframeApi(onReady: (api: SpotifyIframeApi) => void) {
  if (cachedSpotifyIframeApi) {
    onReady(cachedSpotifyIframeApi)
    return
  }

  spotifyApiReadyQueue.push(onReady)

  if (spotifyApiReadyQueue.length > 1) return

  const previousReady = window.onSpotifyIframeApiReady
  window.onSpotifyIframeApiReady = (IFrameAPI) => {
    cachedSpotifyIframeApi = IFrameAPI
    previousReady?.(IFrameAPI)
    spotifyApiReadyQueue.splice(0).forEach((callback) => callback(IFrameAPI))
  }

  const existingScript = document.querySelector(
    'script[src="https://open.spotify.com/embed/iframe-api/v1"]'
  )
  if (!existingScript) {
    const script = document.createElement("script")
    script.src = "https://open.spotify.com/embed/iframe-api/v1"
    script.async = true
    document.body.appendChild(script)
  }
}

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const palette = {
  body: "#2a2520",
  heading: "#1a1a1a",
  label: "var(--color-motif-medium)",
  accent: "var(--color-motif-accent)",
  deep: "var(--color-motif-deep)",
} as const

const bodyFont: React.CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
}

const ct = {
  label: "text-[11px] sm:text-xs md:text-sm",
  body: "text-xs sm:text-sm md:text-base lg:text-lg",
  btn: "text-xs sm:text-sm md:text-base",
} as const

export function WeddingPlaylist() {
  const siteConfig = useSiteConfig()
  const { title, subtitle, playlistName, spotifyUrl, embedUrl } = siteConfig.playlist
  const spotifyUri = getSpotifyUri(spotifyUrl)
  const spotifyOpenUrl = getSpotifyOpenUrl(spotifyUrl)
  const embedContainerRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const playbackStateRef = useRef<"playing" | "paused">("paused")
  const { pauseMusic, resumeMusic } = useAudio()

  useEffect(() => {
    const container = embedContainerRef.current
    if (!container) return

    let mounted = true

    const handlePlaybackStateChange = (isPlaying: boolean) => {
      if (isPlaying && playbackStateRef.current !== "playing") {
        playbackStateRef.current = "playing"
        pauseMusic()
      } else if (!isPlaying && playbackStateRef.current === "playing") {
        playbackStateRef.current = "paused"
        resumeMusic()
      }
    }

    const initController = (IFrameAPI: SpotifyIframeApi) => {
      if (!mounted || !embedContainerRef.current) return

      IFrameAPI.createController(
        embedContainerRef.current,
        {
          uri: spotifyUri,
          width: "100%",
          height: "352",
        },
        (EmbedController) => {
          if (!mounted) return

          controllerRef.current = EmbedController

          const handlePlaybackUpdate = (event: { data: SpotifyPlaybackUpdate }) => {
            handlePlaybackStateChange(!event.data.isPaused)
          }

          const handlePlaybackStarted = () => {
            handlePlaybackStateChange(true)
          }

          EmbedController.addListener("playback_update", handlePlaybackUpdate)
          EmbedController.addListener("playback_started", handlePlaybackStarted)
        }
      )
    }

    loadSpotifyIframeApi(initController)

    const fallbackTimeout = window.setTimeout(() => {
      const el = embedContainerRef.current
      if (!mounted || !el || el.querySelector("iframe")) return

      const iframe = document.createElement("iframe")
      iframe.src = embedUrl
      iframe.title = `${playlistName} — Spotify playlist`
      iframe.width = "100%"
      iframe.height = "352"
      iframe.allow =
        "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      iframe.loading = "lazy"
      iframe.className = "border-0"
      el.appendChild(iframe)
    }, 3000)

    return () => {
      window.clearTimeout(fallbackTimeout)
      mounted = false
      if (playbackStateRef.current === "playing") {
        resumeMusic()
      }
      playbackStateRef.current = "paused"
      controllerRef.current?.destroy()
      controllerRef.current = null
    }
  }, [embedUrl, pauseMusic, playlistName, resumeMusic, spotifyUri])

  return (
    <Section id="playlist" className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20">
      {/* Corner floral decorations */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60 scale-y-[-1]"
          priority={false}
        />
      </div>
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60 scale-x-[-1] scale-y-[-1]"
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-motif-accent/30 bg-motif-cream shadow-[0_16px_60px_rgba(91,102,85,0.12)] px-4 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">
          {/* Subtle accent overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80"
              style={{
                background:
                  "radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 6%, transparent), transparent 60%)",
              }}
            />
            <div className="absolute inset-[1px] rounded-[inherit] border border-motif-accent/10" />
          </div>

          <div className="relative text-center space-y-5 sm:space-y-6 md:space-y-7">
            {/* Header */}
            <div className="space-y-2 sm:space-y-2.5">
              <p
                className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] sm:tracking-[0.24em]`}
                style={{ color: palette.label }}
              >
                {playlistName}
              </p>
              <h2
                className="leading-none"
                style={{
                  fontFamily: "var(--font-brittany), cursive",
                  fontSize: "clamp(1.85rem, 8vw, 4rem)",
                  color: palette.accent,
                  letterSpacing: "0.01em",
                }}
              >
                {title}
              </h2>
              <p className={`${ct.body} max-w-lg mx-auto leading-relaxed`} style={{ ...bodyFont, color: palette.body }}>
                {subtitle}
              </p>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
                <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: palette.accent }} />
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              </div>
            </div>

            {/* Spotify embed */}
            <div
              ref={embedContainerRef}
              title={`${playlistName} — Spotify playlist`}
              className="w-full min-h-[232px] md:min-h-[352px] rounded-xl overflow-hidden border border-motif-deep/15 shadow-sm [&_iframe]:border-0"
            />

            {/* Open in Spotify */}
            <a
              href={spotifyOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full ${ct.btn} shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`}
              style={{
                backgroundColor: palette.deep,
                color: "var(--color-motif-cream)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = palette.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = palette.deep
              }}
            >
              <span className={`${cinzel.className} uppercase tracking-[0.12em] font-semibold`}>
                Open in Spotify
              </span>
              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}

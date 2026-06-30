"use client"

import { ExternalLink, Video } from "lucide-react"
import { Section } from "@/components/section"
import Image from "next/image"
import { Cinzel } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const DRIVE_URL =
  "https://drive.google.com/drive/folders/1ToXLXDOEnif_ZGdRbSf6KrIhBAC7S5hM?usp=sharing"

const text = {
  body: "#2a2520",
  heading: "#1a1a1a",
  label: "var(--color-motif-medium)",
  accent: "var(--color-motif-accent)",
} as const

const bodyFont: React.CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
}

const ct = {
  label: "text-[11px] sm:text-xs md:text-sm",
  body: "text-xs sm:text-sm md:text-base lg:text-lg",
  btn: "text-xs sm:text-sm md:text-base",
} as const

export function VideoMessage() {
  return (
    <Section
      id="video-message"
      className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20"
    >
      {/* Corner floral decorations — same as Welcome section */}
      <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/decoration/left-bottom-decoration-new.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-y-[-1]"
          priority={false}
        />
      </div>
      <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/decoration/left-bottom-decoration-new.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] opacity-60 scale-x-[-1] scale-y-[-1]"
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border border-motif-accent/30 bg-motif-cream shadow-[0_16px_60px_rgba(91,102,85,0.12)] px-4 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 lg:py-12">

          {/* Subtle accent overlay — same as Welcome */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80"
              style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 6%, transparent), transparent 60%)" }}
            />
            <div
              className="absolute bottom-[-6rem] right-[-2rem] w-64 h-64"
              style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--color-motif-accent) 5%, transparent), transparent 60%)" }}
            />
            <div className="absolute inset-[1px] rounded-[inherit] border border-motif-accent/10" />
          </div>

          <div className="relative text-center space-y-4 sm:space-y-6 md:space-y-7 lg:space-y-8">

            {/* Eyebrow label */}
            <div className="space-y-1 sm:space-y-1.5 md:space-y-2.5">
              <p
                className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] sm:tracking-[0.24em]`}
                style={{ color: text.label }}
              >
                A Message We Will Treasure
              </p>

              {/* Script heading */}
              <h2
                className="leading-none"
                style={{
                  fontFamily: "var(--font-brittany), cursive",
                  fontSize: "clamp(1.85rem, 8vw, 4.5rem)",
                  color: text.accent,
                  letterSpacing: "0.01em",
                }}
              >
                Send us a video message
              </h2>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
                <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              </div>
            </div>

            {/* Body copy */}
            <div
              className={`${ct.body} leading-relaxed space-y-2.5 sm:space-y-3 md:space-y-4`}
              style={{ ...bodyFont, color: text.body }}
            >
              <p>
                As we begin this new chapter under the Lord&apos;s guidance, we are
                deeply grateful for everyone He has placed in our lives.
              </p>
              <p className="italic" style={{ color: text.label }}>
                You are a blessing we hold close to our hearts.
              </p>
              <p>
                We would love to receive a short video message from you—something we
                can keep and look back on through the years ahead.
              </p>
              <p>
                Your words will make our wedding day, and our life together, even more
                meaningful. Thank you for your love and support.
              </p>
            </div>

            {/* Second divider */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-motif-accent" />
              <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
            </div>

            {/* Upload prompt + CTA */}
            <div className="space-y-3 sm:space-y-4">
              <p
                className={ct.body}
                style={{ ...bodyFont, color: text.heading }}
              >
                Upload your video message here:
              </p>

              <a
                href={DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-full ${ct.btn} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95`}
                style={{
                  backgroundColor: "var(--color-motif-deep)",
                  color: "var(--color-motif-cream)",
                }}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span
                  className={`${cinzel.className} uppercase tracking-[0.12em] font-semibold`}
                >
                  Upload Video Message
                </span>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </Section>
  )
}

"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check, Camera } from "lucide-react"
import { Section } from "@/components/section"
import { QRCodeCanvas } from "qrcode.react"
import { useSiteConfig } from "@/hooks/use-site-config"
import Image from "next/image"
import { Cinzel } from "next/font/google"

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
  cream: "var(--color-motif-cream)",
} as const

const bodyFont: React.CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
}

const ct = {
  label: "text-[11px] sm:text-xs md:text-sm",
  body: "text-xs sm:text-sm md:text-base",
  bodyLg: "text-sm sm:text-base md:text-lg",
  cardTitle: "text-sm sm:text-base md:text-lg lg:text-xl",
  btn: "text-xs sm:text-sm md:text-base",
} as const

const DECO_FILTER = "brightness(0) invert(1)"
const QR_FG = "#1a1a1a"

const cardClass =
  "relative w-full min-w-0 rounded-2xl border-2 border-motif-deep/30 bg-motif-cream p-4 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4"
const cardShadow = { boxShadow: "0 12px 30px color-mix(in srgb, var(--color-motif-deep) 12%, transparent)" }

function CardShell({
  children,
  className = "",
  padding = "",
}: {
  children: ReactNode
  className?: string
  padding?: string
}) {
  return (
    <div className={`${cardClass} ${padding} ${className}`} style={cardShadow}>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-motif-accent/[0.06] via-transparent to-transparent" aria-hidden />
      <div className="relative z-[1] flex flex-col gap-3 sm:gap-4 min-w-0">{children}</div>
    </div>
  )
}

export function SnapShare() {
  const siteConfig = useSiteConfig()
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags] = useState(false)
  const [copiedDriveLink, setCopiedDriveLink] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { groomNickname, brideNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`
  const websiteUrl = typeof window !== "undefined" ? window.location.href : "https://example.com"
  const uploadLink = siteConfig.snapShare.googleDriveLink
  const hashtags = siteConfig.snapShare.hashtag
  const allHashtagsText = hashtags.join(" ")
  const sanitizedGroomName = groomNickname.replace(/\s+/g, "")
  const sanitizedBrideName = brideNickname.replace(/\s+/g, "")

  const shareText = `Celebrate ${coupleDisplayName}'s wedding! Explore the details and share your special memories: ${websiteUrl} ${allHashtagsText}`

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const encodedUrl = encodeURIComponent(websiteUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<string, string> = {
      instagram: "https://www.instagram.com/",
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      tiktok: "https://www.tiktok.com/",
    }

    const target = urls[platform]
    if (target) window.open(target, "_blank", "width=600,height=400")
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("snapshare-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroomName.toLowerCase()}-${sanitizedBrideName.toLowerCase()}-wedding-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadAlbumQRCode = () => {
    const canvas = document.getElementById("album-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "album-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtagsText)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const copyUploadLink = async () => {
    if (!uploadLink) return
    try {
      await navigator.clipboard.writeText(uploadLink)
      setCopiedDriveLink(true)
      setTimeout(() => setCopiedDriveLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.15 } },
  }

  const primaryBtnClass = `${cinzel.className} ${ct.btn} font-semibold uppercase tracking-[0.1em] sm:tracking-[0.12em] inline-flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-motif-cream border border-motif-deep/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`

  return (
    <Section id="snap-share" className="relative py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Corner florals — white on pink silk */}
      {/* <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-50 scale-y-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}
      {/* <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-50 scale-x-[-1] scale-y-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-50"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}
      {/* <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-50 scale-x-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 min-w-0">
        {/* Header — cream on silk */}
        <motion.div
          className="text-center mb-6 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p
            className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] sm:tracking-[0.24em] mb-2`}
            style={{ color: palette.cream }}
          >
            Share Your Memories
          </p>
          <h2
            className="leading-none mb-2 sm:mb-3"
            style={{
              fontFamily: "var(--font-brittany), cursive",
              fontSize: "clamp(1.85rem, 8vw, 4.5rem)",
              color: palette.cream,
              letterSpacing: "0.01em",
            }}
          >
            Snap &amp; Share
          </h2>
          <p
            className={`${ct.bodyLg} max-w-2xl mx-auto leading-relaxed px-2`}
            style={{ ...bodyFont, color: palette.cream }}
          >
            Help us remember the little moments of {coupleDisplayName}&apos;s day — every smile, embrace, and candid laugh. Your photos and clips complete our love story.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-3">
            <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-cream/40" />
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-motif-cream" />
            <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-cream/40" />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-start"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {/* Photo collage */}
          <motion.div className="w-full min-w-0 lg:order-1" variants={fadeInUp}>
            <CardShell>
              <h4
                className={`${cinzel.className} ${ct.cardTitle} font-semibold text-center uppercase tracking-[0.08em]`}
                style={{ color: palette.heading }}
              >
                Our Favorite Moments
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-motif-deep/20 shadow-sm">
                  <Image src="/mobile-background/couple (8).png" alt="Wedding moment 1" fill className="object-cover" style={{ imageOrientation: "from-image" }} />
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-motif-deep/20 shadow-sm">
                  <Image src="/mobile-background/couple (3).png" alt="Wedding moment 2" fill className="object-cover" style={{ imageOrientation: "from-image" }} />
                </div>
                <div className="relative col-span-2 aspect-[3/2] rounded-xl overflow-hidden border-2 border-motif-deep/20 shadow-sm">
                  <Image src="/desktop-background/couple (1).png" alt="Wedding moment 3" fill className="object-cover" />
                </div>
              </div>
              <p className={`${ct.body} text-center leading-relaxed`} style={{ ...bodyFont, color: palette.body }}>
                Share your snapshots to be featured in our keepsake gallery.
              </p>
            </CardShell>
          </motion.div>

          {/* Right column */}
          <motion.div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:order-2" variants={fadeInUp}>
            {/* Website QR */}
            <CardShell>
              <h4
                className={`${cinzel.className} ${ct.cardTitle} font-semibold text-center uppercase tracking-[0.08em]`}
                style={{ color: palette.heading }}
              >
                Share Our Wedding Website
              </h4>
              <p className={`${ct.body} leading-relaxed text-center`} style={{ ...bodyFont, color: palette.body }}>
                Spread the word about {coupleDisplayName}&apos;s celebration. Share this QR code so friends and family can join us.
              </p>
              <div className="mx-auto w-full max-w-[240px] flex flex-col items-center bg-white p-3 sm:p-4 rounded-xl border border-motif-deep/15 shadow-sm">
                <div className="w-full max-w-full overflow-visible flex justify-center">
                  <QRCodeCanvas
                    id="snapshare-qr"
                    value={websiteUrl}
                    size={isMobile ? 160 : 200}
                    includeMargin
                    className="max-w-full h-auto bg-white"
                    fgColor={QR_FG}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={downloadQRCode}
                  className={primaryBtnClass}
                  style={{ backgroundColor: palette.deep }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = palette.accent }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.deep }}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  Download QR
                </button>
              </div>
              <p className={`${ct.body} text-center leading-relaxed`} style={{ ...bodyFont, color: palette.body }}>
                Scan with any camera app to open the full invitation and schedule.
              </p>
            </CardShell>

            {/* Hashtags */}
            <CardShell padding="!p-4 sm:!p-5">
              <h5
                className={`${cinzel.className} ${ct.body} font-semibold text-center uppercase tracking-[0.1em]`}
                style={{ color: palette.heading }}
              >
                Wedding Hashtags
              </h5>
              <div className="space-y-2 w-full min-w-0">
                {hashtags.map((hashtag, index) => (
                  <motion.button
                    key={index}
                    onClick={() => copyHashtag(hashtag, index)}
                    className={`w-full min-w-0 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                      copiedHashtagIndex === index
                        ? "bg-motif-accent/10 border-motif-accent"
                        : "bg-white border-motif-deep/20 hover:border-motif-accent/40 hover:bg-white/90"
                    }`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <span
                      className={`${ct.body} font-semibold text-left break-all flex-1 min-w-0`}
                      style={{ ...bodyFont, color: copiedHashtagIndex === index ? palette.accent : palette.body }}
                    >
                      {hashtag}
                    </span>
                    <span
                      className={`${cinzel.className} flex items-center gap-1 flex-shrink-0 text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap`}
                      style={{ color: copiedHashtagIndex === index ? palette.accent : palette.label }}
                    >
                      {copiedHashtagIndex === index ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={copyAllHashtags}
                className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98] ${
                  copiedAllHashtags
                    ? "bg-motif-accent/10 border-motif-accent text-motif-accent"
                    : "bg-motif-deep/5 border-motif-deep/30 hover:bg-motif-deep hover:text-motif-cream hover:border-motif-deep"
                }`}
              >
                {copiedAllHashtags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span className={`${cinzel.className} ${ct.btn} font-semibold uppercase tracking-[0.1em]`}>
                  {copiedAllHashtags ? "All Copied!" : "Copy All"}
                </span>
              </button>
            </CardShell>

            {/* Social share */}
            <CardShell>
              <h5
                className={`${cinzel.className} ${ct.cardTitle} font-semibold text-center uppercase tracking-[0.08em]`}
                style={{ color: palette.heading }}
              >
                Share on Social Media
              </h5>
              <p className={`${ct.body} text-center leading-relaxed`} style={{ ...bodyFont, color: palette.body }}>
                Help spread the word about {coupleDisplayName}&apos;s wedding across your favorite platforms.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
                {(
                  [
                    { platform: "instagram" as const, Icon: Instagram, label: "Instagram" },
                    { platform: "facebook" as const, Icon: Facebook, label: "Facebook" },
                    { platform: "tiktok" as const, Icon: Share2, label: "TikTok" },
                    { platform: "twitter" as const, Icon: Twitter, label: "Twitter" },
                  ] as const
                ).map(({ platform, Icon, label }) => (
                  <button
                    key={platform}
                    onClick={() => shareOnSocial(platform)}
                    className="group w-full min-w-0 flex items-center justify-center gap-2 bg-white border border-motif-deep/25 px-3 py-3 rounded-lg hover:border-motif-accent/50 hover:bg-motif-accent/5 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: palette.accent }} />
                    <span className={`${cinzel.className} ${ct.btn} font-semibold uppercase tracking-[0.08em] truncate`} style={{ color: palette.heading }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </CardShell>

            {/* Upload photos */}
            {uploadLink && (
              <CardShell>
                <p
                  className={`${cinzel.className} ${ct.label} w-full text-center rounded-full border border-motif-deep/30 bg-motif-deep/10 px-3 py-1.5 uppercase tracking-[0.14em] sm:tracking-[0.18em] leading-snug break-words`}
                  style={{ color: palette.label }}
                >
                  Upload Your Photos &amp; Videos
                </p>
                <p className={`${ct.body} leading-relaxed text-center break-words`} style={{ ...bodyFont, color: palette.body }}>
                  {siteConfig.snapShare.instructions}
                </p>
                <div className="mx-auto w-full max-w-[240px] flex flex-col items-center bg-white p-3 sm:p-4 rounded-xl border border-motif-deep/15 shadow-sm">
                  <div className="w-full max-w-full overflow-visible flex justify-center">
                    <QRCodeCanvas
                      id="album-qr"
                      value={uploadLink}
                      size={isMobile ? 160 : 200}
                      level="H"
                      includeMargin
                      className="max-w-full h-auto bg-white"
                      fgColor={QR_FG}
                    />
                  </div>
                  <p className={`${ct.body} mt-2 sm:mt-3 text-center`} style={{ ...bodyFont, color: palette.label }}>
                    Scan with your camera app
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3 w-full">
                  <button
                    onClick={copyUploadLink}
                    className={`${primaryBtnClass} sm:min-w-[9.5rem] ${copiedDriveLink ? "!bg-motif-accent !border-motif-accent" : ""}`}
                    style={{ backgroundColor: copiedDriveLink ? palette.accent : palette.deep }}
                    onMouseEnter={(e) => { if (!copiedDriveLink) e.currentTarget.style.backgroundColor = palette.accent }}
                    onMouseLeave={(e) => { if (!copiedDriveLink) e.currentTarget.style.backgroundColor = palette.deep }}
                  >
                    {copiedDriveLink ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                    {copiedDriveLink ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={downloadAlbumQRCode}
                    className={`${primaryBtnClass} sm:min-w-[9.5rem]`}
                    style={{ backgroundColor: palette.deep }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = palette.accent }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = palette.deep }}
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    Download QR
                  </button>
                  <a
                    href={uploadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${primaryBtnClass} sm:min-w-[9.5rem] !text-motif-deep border-motif-deep/30 hover:!bg-motif-accent/5`}
                    style={{ backgroundColor: "white", color: palette.heading }}
                  >
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    Upload Photos
                  </a>
                </div>
              </CardShell>
            )}
          </motion.div>
        </motion.div>

        {/* Thank you */}
        <motion.div className="text-center mt-6 sm:mt-10 md:mt-12 w-full min-w-0" variants={fadeInUp}>
          <CardShell className="max-w-3xl mx-auto" padding="!p-4 sm:!p-6">
            <p className={`${ct.bodyLg} leading-relaxed break-words`} style={{ ...bodyFont, color: palette.body }}>
              Thank you for helping make {coupleDisplayName}&apos;s wedding celebration memorable. Your photos and messages create beautiful memories we will treasure for a lifetime.
            </p>
            <p
              className={`${cinzel.className} ${ct.label} uppercase tracking-[0.18em] sm:tracking-[0.2em]`}
              style={{ color: palette.accent }}
            >
              Thank you for sharing the joy
            </p>
          </CardShell>
        </motion.div>
      </div>
    </Section>
  )
}

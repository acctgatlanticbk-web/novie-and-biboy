"use client"

import { useState, useEffect, useMemo, type ReactNode } from "react"
import { motion } from "motion/react"
import { Instagram, Twitter, Facebook, MapPin, Calendar, Clock, Heart, Music2 } from "lucide-react"
import { useSiteConfig } from "@/hooks/use-site-config"
import { Cinzel } from "next/font/google"
import Image from "next/image"

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
  silver: "var(--color-motif-silver)",
} as const

const bodyFont: React.CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
}

const ct = {
  label: "text-[11px] sm:text-xs md:text-sm",
  body: "text-xs sm:text-sm md:text-base",
  bodyLg: "text-sm sm:text-base md:text-lg",
  title: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
  cardTitle: "text-sm sm:text-base md:text-lg",
} as const

const FOOTER_QUOTES = [
  `"I have found the one whom my soul loves." – Song of Solomon 3:4`,
  "Welcome to our wedding website! We've found a love that's a true blessing, and we give thanks to God for writing the beautiful story of our journey together.",
  "Thank you for your love, prayers, and support. We can't wait to celebrate this joyful day together!",
] as const

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

const cardStyle = {
  backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 94%, white)",
  boxShadow: "0 12px 30px color-mix(in srgb, var(--color-motif-deep) 10%, transparent)",
} as const

function FooterCard({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative w-full min-w-0 rounded-2xl border-2 border-motif-deep/25 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:border-motif-deep/40 hover:shadow-lg ${className}`}
      style={cardStyle}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-motif-accent/[0.05] via-transparent to-transparent" aria-hidden />
      <div className="relative z-[1] min-w-0">{children}</div>
    </div>
  )
}

export function Footer() {
  const siteConfig = useSiteConfig()
  const year = new Date().getFullYear()
  const ceremonyDate = siteConfig.ceremony.date
  const ceremonyTime = siteConfig.ceremony.time
  const receptionTime = siteConfig.reception.time
  const ceremonyVenue = siteConfig.ceremony.location
  const receptionVenue = siteConfig.reception.location
  const isSameVenue = ceremonyVenue === receptionVenue
  const combinedVenue = isSameVenue ? ceremonyVenue : null

  const brideNickname = siteConfig.couple.brideNickname
  const groomNickname = siteConfig.couple.groomNickname
  const coupleDisplayName = `${brideNickname} & ${groomNickname}`

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => setIsPaused(false), 3000)
      return () => clearTimeout(pauseTimeout)
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        const deleteTimeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
        return () => clearTimeout(deleteTimeout)
      }
      setIsDeleting(false)
      setCurrentQuoteIndex((prev) => (prev + 1) % FOOTER_QUOTES.length)
      return
    }

    const currentQuote = FOOTER_QUOTES[currentQuoteIndex]
    if (displayedText.length < currentQuote.length) {
      const typeTimeout = setTimeout(() => {
        setDisplayedText(currentQuote.slice(0, displayedText.length + 1))
      }, 50)
      return () => clearTimeout(typeTimeout)
    }

    setIsPaused(true)
    setIsDeleting(true)
  }, [displayedText, isDeleting, isPaused, currentQuoteIndex])

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  }

  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.15 } },
  }

  const nav = useMemo(
    () =>
      [
        { label: "Home", href: "#home" },
        { label: "Events", href: "#details" },
        { label: "RSVP", href: "#guest-list" },
        { label: "Messages", href: "#messages" },
      ] as const,
    []
  )

  return (
    <div className="relative w-full" style={{ backgroundColor: palette.cream }}>
      {/* Full-bleed layered background — retained */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            background:
              "linear-gradient(165deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 13%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 15%, var(--color-motif-silver) 0%, transparent 55%)",
          }}
        />
      </div>

      <footer className="relative z-10 mt-12 sm:mt-16">
        {/* Corner decorations */}
        <div className="absolute left-0 top-0 z-0 pointer-events-none opacity-25">
          <Image src="/decoration/decoration/left-bottom-decoration-new.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] scale-y-[-1]" priority={false} />
        </div>
        <div className="absolute right-0 top-0 z-0 pointer-events-none opacity-25">
          <Image src="/decoration/decoration/left-bottom-decoration-new.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] scale-x-[-1] scale-y-[-1]" priority={false} />
        </div>
        <div className="absolute left-0 bottom-0 z-0 pointer-events-none opacity-25">
          <Image src="/decoration/decoration/left-bottom-decoration-new.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px]" priority={false} />
        </div>
        <div className="absolute right-0 bottom-0 z-0 pointer-events-none opacity-25">
          <Image src="/decoration/decoration/left-bottom-decoration-new.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] scale-x-[-1]" priority={false} />
        </div>

        {/* Monogram */}
        <div className="relative z-10 flex flex-col items-center pt-6 sm:pt-8 md:pt-10 mb-6 sm:mb-8 px-3">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <Image
                src={siteConfig.couple.monogram}
                alt={`${coupleDisplayName} monogram`}
                fill
                className="object-contain"
                priority={false}
              />
            </div>
          </motion.div>

          <div className="mt-3 sm:mt-4 text-center">
            <h2
              className="leading-none mb-1.5 sm:mb-2"
              style={{
                fontFamily: "var(--font-brittany), cursive",
                fontSize: "clamp(1.75rem, 7vw, 3.25rem)",
                color: palette.medium,
                letterSpacing: "0.01em",
              }}
            >
              {coupleDisplayName}
            </h2>
            <p className={`${cinzel.className} ${ct.bodyLg} tracking-[0.12em] uppercase`} style={{ color: palette.label }}>
              {ceremonyDate}
            </p>
            <p className={`${ct.body} mt-1.5 sm:mt-2`} style={{ ...bodyFont, color: palette.body }}>
              {combinedVenue ?? ceremonyVenue}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-3 sm:pt-4">
            <span className="h-px w-10 sm:w-16 bg-motif-accent/35" />
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: palette.accent }} fill={palette.accent} />
            <span className="h-px w-10 sm:w-16 bg-motif-accent/35" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-8 pb-8 sm:pb-10 min-w-0">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-8 sm:mb-10 items-start"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {/* Couple info + quote */}
            <motion.div className="lg:col-span-2 min-w-0" variants={fadeInUp}>
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 14%, transparent)" }}
                  >
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: palette.accent }} fill={palette.accent} />
                  </div>
                  <h3 className={`${cinzel.className} ${ct.title} font-semibold leading-tight`} style={{ color: palette.heading }}>
                    {coupleDisplayName}
                  </h3>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: palette.accent }} />
                    <span className={ct.bodyLg} style={{ ...bodyFont, color: palette.body }}>{ceremonyDate}</span>
                  </div>
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: palette.accent }} />
                    <span className={`${ct.body} leading-relaxed`} style={{ ...bodyFont, color: palette.body }}>
                      {toTitleCase(ceremonyVenue)}
                    </span>
                  </div>
                </div>
              </div>

              <FooterCard>
                <blockquote className={`${ct.bodyLg} italic leading-relaxed min-h-[4.5rem] sm:min-h-[5rem]`} style={{ ...bodyFont, color: palette.body }}>
                  &ldquo;{displayedText}
                  <span className="inline-block w-0.5 h-4 sm:h-5 ml-1 animate-pulse align-middle" style={{ backgroundColor: palette.accent }} />
                  &rdquo;
                </blockquote>
                <div className="flex items-center gap-1.5 mt-3 sm:mt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{ backgroundColor: palette.accent, opacity: i === 1 ? 0.5 : 1 }}
                    />
                  ))}
                </div>
              </FooterCard>
            </motion.div>

            {/* Event details */}
            <motion.div className="space-y-4 sm:space-y-5 min-w-0" variants={fadeInUp}>
              {isSameVenue ? (
                <FooterCard>
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: palette.deep }}>
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-motif-cream" />
                    </div>
                    <h4 className={`${cinzel.className} ${ct.cardTitle} font-semibold`} style={{ color: palette.heading }}>
                      Ceremony &amp; Reception
                    </h4>
                  </div>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: palette.label }} />
                      <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>
                        {toTitleCase(combinedVenue ?? ceremonyVenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: palette.label }} />
                      <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>
                        Ceremony {ceremonyTime} · Reception {receptionTime}
                      </span>
                    </div>
                  </div>
                </FooterCard>
              ) : (
                <>
                  <FooterCard>
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 14%, transparent)" }}>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: palette.accent }} />
                      </div>
                      <h4 className={`${cinzel.className} ${ct.cardTitle} font-semibold`} style={{ color: palette.heading }}>Ceremony</h4>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: palette.label }} />
                        <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>{toTitleCase(ceremonyVenue)}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: palette.label }} />
                        <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>{ceremonyTime}</span>
                      </div>
                    </div>
                  </FooterCard>
                  <FooterCard>
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 14%, transparent)" }}>
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: palette.accent }} fill={palette.accent} />
                      </div>
                      <h4 className={`${cinzel.className} ${ct.cardTitle} font-semibold`} style={{ color: palette.heading }}>Reception</h4>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: palette.label }} />
                        <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>{toTitleCase(receptionVenue)}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 flex-shrink-0" style={{ color: palette.label }} />
                        <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>{receptionTime}</span>
                      </div>
                    </div>
                  </FooterCard>
                </>
              )}

              <FooterCard>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: palette.deep }}>
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-motif-cream" />
                  </div>
                  <h4 className={`${cinzel.className} ${ct.cardTitle} font-semibold`} style={{ color: palette.heading }}>
                    RSVP Deadline
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 flex-shrink-0" style={{ color: palette.label }} />
                    <span className={ct.body} style={{ ...bodyFont, color: palette.body }}>{siteConfig.details.rsvp.deadline}</span>
                  </div>
                  <p className={`${ct.body} leading-relaxed pl-6 sm:pl-7`} style={{ ...bodyFont, color: palette.body, opacity: 0.9 }}>
                    Please confirm your attendance by this date.
                  </p>
                </div>
              </FooterCard>
            </motion.div>

            {/* Social + links */}
            <motion.div className="space-y-5 sm:space-y-6 min-w-0" variants={fadeInUp}>
              <div>
                <h4 className={`${cinzel.className} ${ct.cardTitle} font-semibold mb-3 sm:mb-4 flex items-center gap-2`} style={{ color: palette.heading }}>
                  <span className="w-1.5 h-6 sm:h-7 rounded-full flex-shrink-0" style={{ backgroundColor: palette.accent }} />
                  Follow Us
                </h4>
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  {(
                    [
                      { href: "https://www.facebook.com", Icon: Facebook, label: "Facebook" },
                      { href: "https://www.instagram.com/", Icon: Instagram, label: "Instagram" },
                      { href: "https://www.youtube.com", Icon: Music2, label: "YouTube" },
                      { href: "https://x.com/", Icon: Twitter, label: "Twitter" },
                    ] as const
                  ).map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-motif-deep/15 transition-all duration-200 hover:scale-110 hover:border-motif-accent/40 hover:bg-motif-accent/10"
                      style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 90%, white)", color: palette.accent }}
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h5 className={`${cinzel.className} ${ct.body} font-semibold mb-2.5 sm:mb-3 uppercase tracking-[0.1em]`} style={{ color: palette.label }}>
                  Quick Links
                </h5>
                <div className="space-y-1.5 sm:space-y-2">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block ${ct.body} leading-relaxed transition-colors duration-200 hover:opacity-80`}
                      style={{ ...bodyFont, color: palette.body }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom bar */}
          <motion.div className="pt-6 sm:pt-8 border-t border-motif-deep/15" variants={fadeInUp}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="text-center md:text-left min-w-0">
                <p className={`${ct.body} leading-relaxed`} style={{ ...bodyFont, color: palette.body }}>
                  © {year} {coupleDisplayName} — crafted with love, prayers, and gratitude.
                </p>
                <p className={`${ct.body} mt-1 leading-relaxed opacity-90`} style={{ ...bodyFont, color: palette.body }}>
                  This celebration site was designed to share our story and joy with you.
                </p>
              </div>
              <div className="text-center md:text-right space-y-1 min-w-0">
                <p className={ct.body} style={{ ...bodyFont, color: palette.body, opacity: 0.9 }}>
                  Developed by{" "}
                  <a
                    href="https://lance28-beep.github.io/portfolio-website/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold transition-colors hover:opacity-80"
                    style={{ color: palette.accent }}
                  >
                    Lance Valle
                  </a>
                </p>
                <p className={ct.body} style={{ ...bodyFont, color: palette.body, opacity: 0.9 }}>
                  Want a website like this? Visit{" "}
                  <a
                    href="https://www.facebook.com/WeddingInvitationNaga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold transition-colors hover:opacity-80"
                    style={{ color: palette.accent }}
                  >
                    Wedding Invitation Naga
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

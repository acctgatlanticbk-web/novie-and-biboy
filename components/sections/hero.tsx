"use client"

import { useEffect, useState, useMemo, type CSSProperties } from "react"
import { siteConfig as defaultSiteConfig } from "@/content/site"
import { useSiteConfig } from "@/hooks/use-site-config"
import { parseWeddingDate } from "@/lib/wedding-date"

const WHITE = "#FFFFFF"
const WHITE_SOFT = "rgba(255, 255, 255, 0.88)"
const WHITE_MUTED = "rgba(255, 255, 255, 0.45)"

const CONTENT_DELAY_MS = 1700
const COUPLE_NAME_IMAGE = "/Details/coupleName.png"

const NIGHT_SKY_GRADIENT = `linear-gradient(
  180deg,
  #050c18 0%,
  var(--color-motif-deep) 22%,
  #152d52 48%,
  var(--color-motif-medium) 72%,
  var(--color-motif-deep) 100%
)`

const smg: CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
  fontStyle: "normal",
}
const hps: CSSProperties = {
  fontFamily: "'HelloParisSans', serif",
}

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleDuration: number
  delay: number
  bright: boolean
}

function createStars(count: number): Star[] {
  return Array.from({ length: count }, (_, id) => {
    const bright = Math.random() < 0.12
    return {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: bright ? 2.2 + Math.random() * 2.2 : 0.8 + Math.random() * 1.8,
      opacity: bright ? 0.55 + Math.random() * 0.35 : 0.2 + Math.random() * 0.55,
      twinkleDuration: 2.5 + Math.random() * 5,
      delay: Math.random() * 8,
      bright,
    }
  })
}

function DottedRule({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "w-[3.25rem] border-t border-dotted md:w-[4rem]"
          : "flex-1 border-t border-dotted"
      }
      style={{ borderColor: WHITE_MUTED }}
    />
  )
}

interface HeroProps {
  visible?: boolean
}

export function Hero({ visible = false }: HeroProps) {
  const siteConfig = useSiteConfig()
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (!visible) {
      setContentVisible(false)
      return
    }

    const showTimer = setTimeout(() => setContentVisible(true), CONTENT_DELAY_MS)
    return () => clearTimeout(showTimer)
  }, [visible])

  const fade = (delay: number): CSSProperties => ({
    transition: `opacity 0.85s ease ${delay}ms, transform 0.85s ease ${delay}ms`,
    opacity: contentVisible ? 1 : 0,
    transform: contentVisible ? "translateY(0)" : "translateY(16px)",
  })

  const groomNickname = siteConfig.couple.groomNickname || siteConfig.couple.groom
  const brideNickname = siteConfig.couple.brideNickname || siteConfig.couple.bride

  const ceremonyDate =
    siteConfig.ceremony.date ?? siteConfig.wedding.date ?? defaultSiteConfig.ceremony.date
  const parsedDate = useMemo(
    () =>
      parseWeddingDate(ceremonyDate, parseWeddingDate(defaultSiteConfig.ceremony.date)),
    [ceremonyDate],
  )
  const ceremonyDay = (
    siteConfig.ceremony.day ?? parsedDate.dayOfWeek ?? defaultSiteConfig.ceremony.day
  ).toUpperCase()
  const ceremonyTime =
    siteConfig.ceremony.time ??
    siteConfig.wedding.time ??
    defaultSiteConfig.ceremony.time
  const { month, day: dateNum, year } = parsedDate
  const stars = useMemo(() => createStars(96), [])

  return (
    <section
      id="home"
      className="relative isolate min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--color-motif-deep)" }}
    >
      {/* Starry night sky */}
      <div
        className="night-sky pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{ background: NIGHT_SKY_GRADIENT }}
      >
        <div className="celestial-glow" />
        {stars.map((star) => (
          <span
            key={`star-${star.id}`}
            className={star.bright ? "star star-bright" : "star"}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: `${star.twinkleDuration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full container mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div
          className="w-full max-w-[310px] md:max-w-[520px] flex flex-col items-center text-center"
          style={{
            color: WHITE,
            WebkitFontSmoothing: "antialiased",
            visibility: contentVisible ? "visible" : "hidden",
          }}
        >
          {/* SAVE THE DATE — arch */}
          <div style={{ ...fade(0) }} className="mb-1 w-full">
            <div className="-translate-y-2 md:-translate-y-3">
              <svg
                viewBox="0 0 300 100"
                className="mx-auto h-[66px] w-full md:hidden"
                aria-hidden
                overflow="visible"
              >
                <defs>
                  <path id="heroArcMob" d="M 6 80 A 178 178 0 0 1 294 80" fill="none" />
                </defs>
                <text fill={WHITE} style={{ ...smg, fontSize: "24px", letterSpacing: "0.32em" }}>
                  <textPath href="#heroArcMob" startOffset="50%" textAnchor="middle">
                    SAVE THE DATE
                  </textPath>
                </text>
              </svg>

              <svg
                viewBox="0 0 480 130"
                className="mx-auto hidden h-[90px] w-full md:block"
                aria-hidden
                overflow="visible"
              >
                <defs>
                  <path id="heroArcDsk" d="M 10 104 A 280 280 0 0 1 470 104" fill="none" />
                </defs>
                <text fill={WHITE} style={{ ...smg, fontSize: "36px", letterSpacing: "0.3em" }}>
                  <textPath href="#heroArcDsk" startOffset="50%" textAnchor="middle">
                    SAVE THE DATE
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* Invitation copy */}
          <div style={{ ...fade(100) }} className="mt-2 flex w-full flex-col items-center gap-2 md:mt-3 md:gap-2.5">
            <div className="flex w-full max-w-[280px] items-center justify-center gap-2 md:max-w-[320px]">
              <DottedRule compact />
              <p
                className="shrink-0 text-[10px] tracking-[0.32em] uppercase md:text-[12px]"
                style={{ ...smg, color: WHITE_SOFT, opacity: 0.88 }}
              >
                With joy in our hearts
              </p>
              <DottedRule compact />
            </div>
            <p
              className="max-w-[280px] text-[13px] leading-[1.55] md:max-w-none md:text-[17px] md:leading-[1.6]"
              style={{ ...smg, color: WHITE_SOFT, fontStyle: "italic" }}
            >
              we invite you to witness
              <br className="md:hidden" />
              {" "}the wedding of
            </p>
          </div>

          {/* Couple names */}
          <div style={{ ...fade(220) }} className="mt-4 w-full md:mt-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={encodeURI(COUPLE_NAME_IMAGE)}
              alt={`${groomNickname} and ${brideNickname}`}
              className="mx-auto h-auto w-full max-w-[200px] brightness-0 invert md:max-w-[270px]"
            />
          </div>

          {/* Together with their families */}
          <div style={{ ...fade(520) }} className="mt-4 w-full md:mt-5">
            <p
              className="w-full text-[12px] leading-[1.65] md:text-[14px] md:leading-[1.75]"
              style={{ ...smg, color: WHITE_SOFT }}
            >
              Together with their families
              <br />
              invite you to their wedding celebration
            </p>
          </div>

          {/* Date block */}
          <div style={{ ...fade(620) }} className="mt-4 w-full md:mt-5">
            <div
              className="mx-auto grid w-full max-w-[260px] gap-y-0 md:max-w-[340px]"
              style={{
                gridTemplateColumns: "1fr auto 1fr",
                gridTemplateRows: "auto auto auto",
              }}
            >
              <div
                className="col-start-2 row-start-1 border-x border-t border-dotted px-1.5 pb-0 pt-0.5 text-center md:px-2"
                style={{ borderColor: WHITE_MUTED }}
              >
                <span
                  className="text-[10px] font-bold tracking-[0.18em] uppercase md:text-[12px]"
                  style={{ ...smg, color: WHITE }}
                >
                  {month}
                </span>
              </div>

              <div className="col-start-1 row-start-2 flex flex-col justify-center gap-[2px] px-0.5 md:px-1">
                <div className="border-t border-dotted" style={{ borderColor: WHITE_MUTED }} />
                <span
                  className="text-center text-[10px] tracking-[0.14em] uppercase md:text-[12px]"
                  style={{ ...smg, color: WHITE_SOFT }}
                >
                  {ceremonyDay}
                </span>
                <div className="border-t border-dotted" style={{ borderColor: WHITE_MUTED }} />
              </div>

              <div
                className="col-start-2 row-start-2 flex items-center justify-center border-x border-dotted px-1 pb-0 pt-0 md:px-1.5"
                style={{ borderColor: WHITE_MUTED }}
              >
                <span
                  className="leading-[0.85]"
                  style={{
                    ...hps,
                    fontSize: "clamp(52px, 14vw, 68px)",
                    color: WHITE,
                  }}
                >
                  {dateNum}
                </span>
              </div>

              <div className="col-start-3 row-start-2 flex flex-col justify-center gap-[2px] px-0.5 md:px-1">
                <div className="border-t border-dotted" style={{ borderColor: WHITE_MUTED }} />
                <span
                  className="whitespace-nowrap text-center text-[10px] tracking-[0.12em] uppercase md:text-[12px]"
                  style={{ ...smg, color: WHITE_SOFT }}
                >
                  At {ceremonyTime}
                </span>
                <div className="border-t border-dotted" style={{ borderColor: WHITE_MUTED }} />
              </div>

              <div
                className="col-start-2 row-start-3 border-x border-b border-dotted px-1.5 pb-0.5 pt-0 text-center md:px-2"
                style={{ borderColor: WHITE_MUTED }}
              >
                <span
                  className="text-[14px] font-bold leading-none tracking-[0.12em] md:text-[18px]"
                  style={{ ...smg, color: WHITE, fontWeight: 700 }}
                >
                  {year}
                </span>
              </div>
            </div>
          </div>

          {/* at / venue */}
          <div style={{ ...fade(720) }} className="mt-4 flex w-full flex-col items-center md:mt-5">
            <div className="flex items-center justify-center gap-1.5 md:gap-2">
              <DottedRule compact />
              <span className="text-[13px] md:text-[15px]" style={{ ...smg, color: WHITE_SOFT }}>
                at
              </span>
              <DottedRule compact />
            </div>
            <p
              className="mt-2 text-[13px] leading-snug md:mt-2.5 md:text-[15px]"
              style={{ ...smg, color: WHITE_SOFT }}
            >
              {siteConfig.ceremony.location}
            </p>
          </div>

          {/* Call-to-action */}
          <div style={{ ...fade(840) }} className="mt-7 flex w-full flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 md:mt-8">
            <p
              className="text-[12px] leading-relaxed md:text-[14px]"
              style={{ ...smg, color: WHITE_SOFT }}
            >
              Your presence, prayers, and love will mean the world to us.
            </p>

            <a
              href="#guest-list"
              className="group relative w-full sm:min-w-[200px] md:min-w-[220px] rounded-lg overflow-hidden border transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.45)",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.18)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.75)"
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.28)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.45)"
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.2)"
              }}
            >
              <span
                className="relative z-10 inline-flex h-full min-h-[3rem] sm:min-h-[3.25rem] w-full items-center justify-center px-6 sm:px-8 text-[0.65rem] sm:text-[0.7rem] md:text-xs uppercase tracking-[0.28em] sm:tracking-[0.32em] font-semibold transition-all duration-300"
                style={{ ...smg, fontWeight: 600, color: WHITE }}
              >
                Confirm Attendance
              </span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .night-sky {
          opacity: 1;
        }

        .celestial-glow {
          position: absolute;
          inset: -15%;
          background:
            radial-gradient(circle at 50% 12%, rgba(120, 160, 220, 0.14) 0%, transparent 42%),
            radial-gradient(circle at 18% 28%, rgba(180, 200, 255, 0.06) 0%, transparent 35%),
            radial-gradient(circle at 82% 22%, rgba(140, 175, 230, 0.08) 0%, transparent 32%),
            radial-gradient(ellipse at 50% 105%, rgba(70, 110, 170, 0.18) 0%, transparent 55%);
          animation: skyBreath 24s ease-in-out infinite alternate;
        }

        .star {
          position: absolute;
          border-radius: 9999px;
          background: #fff;
          transform: translate3d(-50%, -50%, 0);
          will-change: opacity;
          animation-name: starTwinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .star-bright {
          box-shadow:
            0 0 4px rgba(255, 255, 255, 0.9),
            0 0 10px rgba(200, 220, 255, 0.45);
        }

        .star-bright::before,
        .star-bright::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          background: rgba(255, 255, 255, 0.85);
          transform: translate(-50%, -50%);
          border-radius: 1px;
        }

        .star-bright::before {
          width: calc(var(--star-arm, 8px));
          height: 1px;
        }

        .star-bright::after {
          width: 1px;
          height: calc(var(--star-arm, 8px));
        }

        @keyframes starTwinkle {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes skyBreath {
          0% {
            transform: scale(1) translate3d(0, 0, 0);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.04) translate3d(0, -1%, 0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .celestial-glow,
          .star {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Users, MapPin, Calendar, Crown } from "lucide-react"
import { Cinzel } from "next/font/google"
import { useSiteConfig } from "@/hooks/use-site-config"

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
  stat: "text-2xl sm:text-3xl md:text-4xl",
  guestName: "text-sm sm:text-base md:text-lg",
  meta: "text-[10px] sm:text-xs md:text-sm",
} as const

const glassCardStyle = {
  backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 68%, transparent)",
  boxShadow:
    "0 18px 40px color-mix(in srgb, var(--color-motif-deep) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 60%, transparent)",
} as const

interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: 'pending' | 'confirmed' | 'declined' | 'request'
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

const CARDS_PER_VIEW = 4

export function BookOfGuests() {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const [totalGuests, setTotalGuests] = useState(0)
  const [rsvpCount, setRsvpCount] = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [previousTotal, setPreviousTotal] = useState(0)
  const [showIncrease, setShowIncrease] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered] = useState(false)

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Helper function to format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    
    try {
      // Fetch from local API route which connects to Google Sheets
      const response = await fetch("/api/guests", {
        cache: "no-store"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch guest list")
      }

      const data: Guest[] = await response.json()

      // Filter only confirmed/attending guests
      const attendingGuests = data.filter((guest) => guest.status === "confirmed")
      
      // Sort guests: VIPs first, then by updatedAt (most recent first)
      const sortedGuests = attendingGuests.sort((a, b) => {
        // VIPs come first
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        
        // Then sort by most recent update
        const dateA = new Date(a.updatedAt || 0).getTime()
        const dateB = new Date(b.updatedAt || 0).getTime()
        return dateB - dateA
      })
      
      // Calculate total guests by summing allowedGuests for each confirmed guest
      const totalGuestCount = attendingGuests.reduce((sum, guest) => {
        return sum + (guest.allowedGuests || 1)
      }, 0)
      
      // Show increase animation if count went up
      if (totalGuestCount > totalGuests && totalGuests > 0) {
        setPreviousTotal(totalGuests)
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      
      setTotalGuests(totalGuestCount)
      setRsvpCount(attendingGuests.length)
      setConfirmedGuests(sortedGuests)
      setLastUpdate(new Date())
    } catch (error: any) {
      console.error("Failed to load guests:", error)
    } finally {
      if (showLoading) {
        setTimeout(() => setIsRefreshing(false), 500)
      }
    }
  }

  // Get visible guests (max 4 cards) for carousel
  const getVisibleGuests = () => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return confirmedGuests
    const visible: Guest[] = []
    for (let i = 0; i < CARDS_PER_VIEW; i++) {
      const index = (currentIndex + i) % confirmedGuests.length
      visible.push(confirmedGuests[index])
    }
    return visible
  }

  useEffect(() => {
    // Initial fetch
    fetchGuests()

    // Set up automatic polling every 30 seconds for real-time updates
    const pollInterval = setInterval(() => {
      fetchGuests()
    }, 30000) // 30 seconds

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      // Add a small delay to allow Google Sheets to update
      setTimeout(() => {
        fetchGuests(true)
      }, 2000)
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      clearInterval(pollInterval)
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [totalGuests])

  // Auto-rotate carousel every 5 seconds when more than 4 guests
  useEffect(() => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + CARDS_PER_VIEW
          return next >= confirmedGuests.length ? 0 : next
        })
        setIsTransitioning(false)
        setJustEntered(true)
        setTimeout(() => setJustEntered(false), 1100)
      }, 600)
    }, 5000)
    return () => clearInterval(interval)
  }, [confirmedGuests.length])

  return (
    <div
      id="guests"
      className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 isolate"
      style={{ backgroundColor: palette.cream }}
    >
      {/* Layered background — same as entourage/footer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            background:
              "linear-gradient(165deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 15%, var(--color-motif-silver) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Corner florals — behind content */}
      <div className="decor-corner decor-top-left decor-visible pointer-events-none absolute left-0 top-0 z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/decoration/left-top-decoration-new.png" alt="" className="block h-auto w-auto max-w-[130px] sm:max-w-[160px] md:max-w-[210px] lg:max-w-[260px]" />
      </div>
      <div className="decor-corner decor-top-right decor-visible pointer-events-none absolute right-0 top-0 z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/decoration/right-top-decoration-new.png" alt="" className="block h-auto w-auto max-w-[130px] sm:max-w-[160px] md:max-w-[210px] lg:max-w-[260px]" />
      </div>
      <div className="decor-corner decor-bottom-left decor-visible pointer-events-none absolute bottom-0 left-0 z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/decoration/left-bottom-decoration-new.png" alt="" className="block h-auto w-auto max-w-[130px] sm:max-w-[160px] md:max-w-[210px] lg:max-w-[260px]" />
      </div>
      <div className="decor-corner decor-bottom-right decor-visible pointer-events-none absolute bottom-0 right-0 z-[1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/decoration/right-bottom-decoration-new.png" alt="" className="block h-auto w-auto max-w-[130px] sm:max-w-[160px] md:max-w-[210px] lg:max-w-[260px]" />
      </div>
      <div className="decor-bottom decor-visible pointer-events-none absolute bottom-0 left-0 right-0 z-[1] md:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/decoration/decoration/bottom-center-decoration-new.png" alt="" className="block h-auto w-full" />
      </div>

      {/* Section Header */}
      <div className="relative z-20 text-center mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-6 sm:mb-8 md:mb-10 px-6 sm:px-10 md:px-12">
        <p
          className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] sm:tracking-[0.24em] mb-2`}
          style={{ color: palette.label }}
        >
          Celebrating With {coupleDisplayName}
        </p>
        <h2
          className="leading-none mb-2 sm:mb-3"
          style={{
            fontFamily: "var(--font-brittany), cursive",
            fontSize: "clamp(1.85rem, 8vw, 4.5rem)",
            color: palette.accent,
            letterSpacing: "0.01em",
          }}
        >
          Book of Guests
        </h2>
        <p
          className={`${ct.bodyLg} max-w-2xl mx-auto leading-relaxed px-2`}
          style={{ ...bodyFont, color: palette.body }}
        >
          Meet the cherished souls joining us in celebration — your presence makes our day truly special.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2 sm:pt-3">
          <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: palette.accent }} />
          <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
        </div>
      </div>

      {/* Guests content */}
      <div className="relative z-20 my-6 sm:my-8 md:my-10 mb-12 sm:mb-16 md:mb-20 px-6 sm:px-10 md:px-12">
        {/* Stats card */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="relative max-w-3xl mx-auto z-20">
            <div
              className="relative z-20 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-6 border border-white/50 transition-all duration-300 overflow-hidden"
              style={glassCardStyle}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-motif-accent/[0.04]" aria-hidden />
              <div className="relative z-[1]">
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-300 disabled:opacity-50 group z-10 hover:scale-110"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 12%, transparent)" }}
                title="Refresh counts"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
                  style={{ color: palette.accent }}
                />
              </button>

              <div className="mb-2 sm:mb-3">
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
                  <h3
                    className={`${cinzel.className} ${ct.stat} font-semibold transition-all duration-500 ${showIncrease ? "scale-110" : ""}`}
                    style={{ color: palette.accent }}
                  >
                    {totalGuests}
                  </h3>
                  {showIncrease && (
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" style={{ color: palette.accent }} />
                  )}
                  <p className={`${cinzel.className} ${ct.bodyLg} font-medium leading-tight`} style={{ color: palette.heading }}>
                    {totalGuests === 1 ? "Guest" : "Guests"} Celebrating With Us
                  </p>
                </div>
              </div>

              <p className={`${ct.body} mb-2 sm:mb-3`} style={{ ...bodyFont, color: palette.body }}>
                {rsvpCount} confirmed {rsvpCount === 1 ? "RSVP" : "RSVPs"}
              </p>
              <p className={`${ct.body} leading-relaxed`} style={{ ...bodyFont, color: palette.body, opacity: 0.9 }}>
                Thank you for confirming your RSVP — your presence means the world to us.
              </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guest List Display - 4 cards with carousel */}
        {confirmedGuests.length > 0 && (
          <div className="relative z-20 max-w-5xl mx-auto">
            <div
              className="relative overflow-hidden"
              style={{
                perspective: "1200px",
                perspectiveOrigin: "center 85%",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={`space-y-2 sm:space-y-3 md:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {getVisibleGuests().map((guest, index) => (
                  <div
                    key={`${guest.id}-${currentIndex}-${index}`}
                    className={`relative z-20 group rounded-2xl p-3 sm:p-4 md:p-5 transition-all duration-300 border border-white/50 backdrop-blur-xl hover:border-white/70 hover:shadow-lg overflow-hidden ${justEntered ? "animate-guest-roll-in" : ""}`}
                    style={{
                      ...glassCardStyle,
                      ...(justEntered
                        ? {
                            animationDelay: `${index * 120}ms`,
                            backfaceVisibility: "hidden",
                          }
                        : {}),
                    }}
                  >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-motif-accent/[0.03]" aria-hidden />
                  <div className="relative z-[1] flex items-start gap-2.5 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/70"
                        style={{ backgroundColor: palette.accent }}
                      >
                        <span className={`${cinzel.className} text-white font-semibold text-xs sm:text-sm md:text-base`}>
                          {getInitials(guest.name)}
                        </span>
                      </div>
                      {guest.isVip && (
                        <div className="absolute -top-0.5 -right-0.5">
                          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-md border-2 border-white">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3.5 md:w-3.5 text-white fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 sm:mb-2">
                        <h3
                          className={`${ct.guestName} font-semibold leading-tight mb-0.5`}
                          style={{ ...bodyFont, color: palette.heading }}
                        >
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p
                            className={`${cinzel.className} ${ct.meta} font-medium uppercase tracking-wide`}
                            style={{ color: palette.label }}
                          >
                            {guest.role}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <div
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-motif-deep/20"
                          style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 8%, transparent)" }}
                        >
                          <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" style={{ color: palette.accent }} />
                          <span className={`${ct.meta} font-medium`} style={{ ...bodyFont, color: palette.body }}>
                            {guest.allowedGuests} {guest.allowedGuests === 1 ? "Guest" : "Guests"}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-motif-deep/20"
                          style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-medium) 8%, transparent)" }}
                        >
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" style={{ color: palette.label }} />
                          <span className={`${ct.meta} font-medium`} style={{ ...bodyFont, color: palette.body }}>
                            {guest.tableNumber && guest.tableNumber.trim() !== "" ? (
                              <>Table {guest.tableNumber}</>
                            ) : (
                              <span className="opacity-65">Not Assigned</span>
                            )}
                          </span>
                        </div>
                      </div>

                      {guest.companions && guest.companions.length > 0 && (
                        <div className="pt-2 sm:pt-2.5 border-t border-motif-deep/15">
                          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: palette.accent }} />
                            <span className={`${cinzel.className} ${ct.meta} font-semibold uppercase tracking-wide`} style={{ color: palette.label }}>
                              Companions
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {guest.companions.map((companion, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-motif-deep/20 transition-colors hover:border-motif-deep/35"
                                style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 85%, white)" }}
                              >
                                <span className={`${ct.meta} font-medium whitespace-nowrap`} style={{ ...bodyFont, color: palette.body }}>
                                  {companion.name}
                                </span>
                                {companion.relationship && companion.relationship.trim() !== "" && (
                                  <span
                                    className={`${cinzel.className} text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full border border-motif-deep/15 whitespace-nowrap`}
                                    style={{ color: palette.label, backgroundColor: "color-mix(in srgb, var(--color-motif-medium) 10%, transparent)" }}
                                  >
                                    {companion.relationship}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 pt-2 sm:pt-2.5 mt-2 border-t border-motif-deep/12">
                        <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-75" style={{ color: palette.label }} />
                        <span className={ct.meta} style={{ ...bodyFont, color: palette.body, opacity: 0.85 }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Carousel indicators — warm brown */}
              {confirmedGuests.length > CARDS_PER_VIEW && (
                <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                  {Array.from({ length: Math.ceil(confirmedGuests.length / CARDS_PER_VIEW) }).map((_, idx) => {
                    const pageIndex = Math.floor(currentIndex / CARDS_PER_VIEW)
                    const isActive = pageIndex === idx
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIsTransitioning(true)
                          setTimeout(() => {
                            setCurrentIndex(idx * CARDS_PER_VIEW)
                            setIsTransitioning(false)
                            setJustEntered(true)
                            setTimeout(() => setJustEntered(false), 1100)
                          }, 600)
                        }}
                        className="h-2 rounded-full transition-all duration-300 hover:opacity-90"
                        style={{
                          width: isActive ? "1.75rem" : "0.5rem",
                          backgroundColor: isActive ? palette.accent : "color-mix(in srgb, var(--color-motif-deep) 31%, transparent)",
                        }}
                        aria-label={`Go to page ${idx + 1}`}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
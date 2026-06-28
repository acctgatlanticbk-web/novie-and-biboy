"use client"

import { useMemo, useState, type ReactNode } from "react"
import type { SiteConfig } from "@/lib/site-config"
import { ChevronDown, HelpCircle } from "lucide-react"
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
  question: "text-xs sm:text-sm md:text-base",
} as const

const linkClass =
  "underline font-semibold transition-colors hover:opacity-80"

const glassCardStyle = {
  backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 68%, transparent)",
  boxShadow:
    "0 18px 40px color-mix(in srgb, var(--color-motif-deep) 10%, transparent), inset 0 1px 0 color-mix(in srgb, white 60%, transparent)",
} as const

interface FAQItem {
  question: string
  answer: string | ReactNode
}

function getFaqItems(siteConfig: SiteConfig): FAQItem[] {
  return [
    {
      question: "When is the wedding?",
      answer: `Our wedding will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day})`,
    },
    {
      question: "What time should I arrive for the ceremony?",
      answer: `Our ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes earlier to allow enough time for parking, walking to the ceremony area, and finding your seats so we can begin on time.`,
    },
    {
      question: "Where will the ceremony and reception take place?",
      answer: `The ceremony and reception will be held at ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}. You can find detailed directions, addresses, and maps in the Details section above.`,
    },
    {
      question: "How do I RSVP?",
      answer: (
        <>
          Please RSVP using the{" "}
          <a
            href="#guest-list"
            className={linkClass}
            style={{ color: palette.accent }}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            guest list
          </a>{" "}
          on this invitation: search for your name and confirm your attendance.
          {"\n"}
          Please respond by{" "}
          {siteConfig.details.rsvp.deadline.replace(/\.\s*$/, "")}.
          {"\n"}
          If you have questions, message{" "}
          <a
            href="https://www.facebook.com/elyzha.david"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ color: palette.accent }}
          >
            {siteConfig.details.rsvp.contact}
          </a>{" "}
          or{" "}
          <a
            href="https://www.facebook.com/KennethJunCajayon"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ color: palette.accent }}
          >
            {siteConfig.couple.groom}
          </a>{" "}
          on Messenger.
        </>
      ),
    },
    {
      question: "Can I sit anywhere at the reception?",
      answer:
        "Please don't. We kindly ask our guests to follow the seating arrangement prepared for the reception.\n\nA great deal of thought and care went into planning the seating so that everyone will feel comfortable and be seated with friends, family, or guests who share similar connections. Each seat was thoughtfully arranged with every guest in mind. Our reception team will gladly assist you in finding your assigned table.",
    },
    {
      question: "Is there parking available?",
      answer:
        "Yes, parking is available at the venue, and parking attendants, along with our coordinators, will assist you on the day.",
    },
    {
      question: "Will there be a wedding gift registry?",
      answer:
        "With all that we have, we are truly blessed. Your presence and prayers are what we request most. However, if you desire to give nonetheless, a monetary gift to help us begin our new life together would be humbly appreciated. You can find our gift registry information in the Gift Guide section.",
    },
    {
      question: "Unplugged Ceremony",
      answer:
        "EYES UP, PHONES DOWN, HEARTS OPEN.\n\nThe greatest gift you can give us during our ceremony is your presence. We respectfully request that guests refrain from taking photos or videos during the ceremony so our official photographers can capture every moment without distraction. We promise to share the beautiful photos with you afterward!\n\nOur professional photographers will be capturing every beautiful memory, and we promise to share the photos with everyone afterwards.",
    },
    {
      question: "Can I take photos or videos during the reception?",
      answer:
        "Yes! While our I DO's will be unplugged, our reception will not be. As a couple who loves photos and memories, we would love for you to capture the fun moments throughout the evening. We prepared this celebration wholeheartedly and we want everyone to enjoy it fully.",
    },
    {
      question: "What should I do if I can't make it?",
      answer:
        "Your presence will truly be missed, but we completely understand.\n\nPlease kindly let us know through RSVP as soon as possible so we may adjust arrangements accordingly.",
    },
    {
      question: 'I said "No" to RSVP but my plans changed. Can I still attend?',
      answer:
        "Please check with us first before making arrangements. Due to limited seating and a carefully planned guest list, attendance cannot be guaranteed without prior confirmation.",
    },
    {
      question: "When is the appropriate time to leave?",
      answer:
        "It took us some time to plan for a heartfelt wedding that everyone would hopefully enjoy. We humbly request that you celebrate with us until the program ends. Please don't eat and run! Let's laugh, take pictures, sing, and have fun!",
    },
    {
      question: "Can I bring my children to the wedding?",
      answer:
        "We adore your little ones — truly. However, we have lovingly planned this as an adults-only celebration so that every guest, including you, can fully relax, enjoy the program, and be present in the moment.\n\nWe kindly ask that you make childcare arrangements for the day. We hope you understand, and we are so grateful that you are celebrating this milestone with us.",
    },
    {
      question: "What if I have dietary restrictions or allergies?",
      answer:
        "Please let us know about any dietary restrictions or allergies when you RSVP. We want to ensure everyone can enjoy the celebration comfortably.",
    },
    {
      question: "How can I help the couple have a great time during their wedding?",
      answer:
        "• Pray with us for favorable weather and the continuous blessings of our Lord as we enter this new chapter of our lives as husband and wife.\n\n• RSVP as soon as your schedule is cleared.\n\n• Dress appropriately and follow our wedding motif.\n\n• Be on time.\n\n• Follow the seating arrangement in the reception.\n\n• Stay until the end of the program.\n\n• Join the activities and enjoy!",
    },
  ]
}

function FaqAnswer({ answer }: { answer: string | ReactNode }) {
  if (typeof answer !== "string") {
    return (
      <div
        className={`${ct.body} leading-relaxed whitespace-pre-line`}
        style={{ ...bodyFont, color: palette.body }}
      >
        {answer}
      </div>
    )
  }

  if (answer.includes("[RSVP_LINK]")) {
    return (
      <p
        className={`${ct.body} leading-relaxed whitespace-pre-line`}
        style={{ ...bodyFont, color: palette.body }}
      >
        {answer.split("[RSVP_LINK]")[0]}
        <a
          href="#guest-list"
          className={linkClass}
          style={{ color: palette.accent }}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("guest-list")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          {answer.match(/\[RSVP_LINK\](.*?)\[\/RSVP_LINK\]/)?.[1]}
        </a>
        {answer.split("[/RSVP_LINK]")[1]}
      </p>
    )
  }

  return (
    <p
      className={`${ct.body} leading-relaxed whitespace-pre-line`}
      style={{ ...bodyFont, color: palette.body }}
    >
      {answer}
    </p>
  )
}

export function FAQ() {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`
  const faqItems = useMemo(() => getFaqItems(siteConfig), [siteConfig])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className="relative z-10 py-8 sm:py-12 md:py-16 lg:py-20 isolate"
      style={{ backgroundColor: palette.cream }}
    >
      {/* Layered background */}
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

      {/* Header */}
      <div className="relative z-20 text-center mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-6 sm:mb-8 md:mb-10 px-6 sm:px-10 md:px-12">
          <p
            className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] sm:tracking-[0.24em] mb-2`}
            style={{ color: palette.label }}
          >
            For {coupleDisplayName}
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
            Frequently Asked Questions
          </h2>
          <p
            className={`${ct.bodyLg} max-w-2xl mx-auto leading-relaxed px-2`}
            style={{ ...bodyFont, color: palette.body }}
          >
            Helpful notes so you can simply arrive, celebrate, and enjoy this new chapter with us.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2 sm:pt-3">
            <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: palette.accent }} />
            <span className="h-px w-10 sm:w-16 md:w-20 bg-motif-accent/40" />
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="relative z-20 max-w-3xl mx-auto px-6 sm:px-10 md:px-12 my-6 sm:my-8 md:my-10 mb-12 sm:mb-16 md:mb-20">
          <div
            className="relative z-20 rounded-2xl border border-white/50 backdrop-blur-xl overflow-hidden"
            style={glassCardStyle}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-motif-accent/[0.04]" aria-hidden />

            <div className="relative z-20 p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5">
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index
                const contentId = `faq-item-${index}`
                return (
                  <div
                    key={index}
                    className={`relative z-20 rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? "border-motif-accent/35 shadow-sm"
                        : "border-motif-deep/15 hover:border-motif-deep/30"
                    }`}
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-cream) 80%, white)" }}
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="group w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-motif-accent transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                    >
                      <span
                        className={`${cinzel.className} ${ct.question} font-semibold pr-3 leading-snug transition-colors duration-200`}
                        style={{ color: isOpen ? palette.accent : palette.heading }}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        style={{ color: isOpen ? palette.accent : palette.label }}
                        aria-hidden
                      />
                    </button>

                    <div
                      id={contentId}
                      role="region"
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 pt-0 border-t border-motif-deep/12">
                          <FaqAnswer answer={item.answer} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
    </section>
  )
}

"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { Section } from "@/components/section"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
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
  formTitle: "text-sm sm:text-base md:text-lg",
  btn: "text-xs sm:text-sm md:text-base",
} as const

const DECO_FILTER = "brightness(0) invert(1)"

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const message = formData.get("message") as string

    const googleFormData = new FormData()
    googleFormData.append("entry.405401269", name)
    googleFormData.append("entry.893740636", message)

    try {
      await fetch(siteConfig.googleAPI.messageForm, {
        method: "POST",
        mode: "no-cors",
        body: googleFormData,
      })

      toast({
        title: "Message sent",
        description: "Thank you for your kind words.",
        duration: 3000,
      })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()

      setTimeout(() => setIsSubmitted(false), 1000)

      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch {
      toast({
        title: "Unable to send message",
        description: "Please try again in a moment.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field: string) =>
    `message-form-input w-full border-2 rounded-xl py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 ${ct.body} placeholder:italic transition-all duration-300 bg-white shadow-sm hover:shadow-md focus:shadow-lg ${
      focusedField === field
        ? "border-motif-deep focus:border-motif-deep focus:ring-4 focus:ring-motif-deep/20 shadow-lg"
        : "border-motif-deep/30 hover:border-motif-deep/45"
    }`

  return (
    <div className="relative w-full max-w-md mx-auto px-3 sm:px-0">
      <style>{`
        .message-form-input::placeholder,
        .message-form-textarea::placeholder {
          color: #9CA3AF !important;
          opacity: 1 !important;
        }
      `}</style>

      <div className="absolute -top-3 -left-3 w-8 h-8 bg-motif-accent/20 rounded-full blur-sm animate-pulse-slow" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-motif-accent/20 rounded-full blur-md animate-pulse-slow" />

      <Card
        className={`relative w-full border-2 border-motif-deep/30 bg-motif-cream backdrop-blur-md transition-all duration-500 overflow-hidden rounded-2xl ${
          isFocused ? "scale-[1.01] border-motif-deep/60" : "hover:border-motif-deep/45"
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={{ boxShadow: "0 12px 30px color-mix(in srgb, var(--color-motif-deep) 12%, transparent)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-motif-accent/5 via-transparent to-transparent pointer-events-none" />

        {isSubmitted && (
          <div className="absolute inset-0 bg-motif-cream/90 flex items-center justify-center z-20 pointer-events-none">
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: palette.accent }}
              >
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <p className={`${cinzel.className} font-semibold ${ct.formTitle}`} style={{ color: palette.accent }}>
                Sent!
              </p>
            </div>
          </div>
        )}

        <CardContent className="relative p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-5 md:mb-6">
            <div className="relative inline-block mb-3">
              <div className="absolute inset-0 bg-motif-accent/25 rounded-full blur-lg scale-150" />
              <div
                className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: palette.accent }}
              >
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              </div>
            </div>
            <h3 className={`${cinzel.className} ${ct.formTitle} font-semibold mb-1.5`} style={{ color: palette.heading }}>
              Share Your Love
            </h3>
            <p className={ct.body} style={{ ...bodyFont, color: palette.body }}>
              Leave a note for {coupleDisplayName} to read and keep.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 md:space-y-5"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div className="space-y-1.5 sm:space-y-2">
              <label
                className={`${cinzel.className} ${ct.body} font-medium flex items-center gap-2`}
                style={{ color: palette.label }}
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${focusedField === "name" ? "scale-110" : ""}`}
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 12%, transparent)" }}
                >
                  <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: palette.accent }} />
                </div>
                Your Name
              </label>
              <Input
                name="name"
                required
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Full name"
                className={inputClass("name")}
                style={{ color: palette.body, fontFamily: bodyFont.fontFamily }}
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  className={`${cinzel.className} ${ct.body} font-medium flex items-center gap-2`}
                  style={{ color: palette.label }}
                >
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 ${focusedField === "message" ? "scale-110" : ""}`}
                    style={{ backgroundColor: "color-mix(in srgb, var(--color-motif-accent) 12%, transparent)" }}
                  >
                    <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: palette.accent }} />
                  </div>
                  Your Message
                </label>
                {messageValue && (
                  <span
                    className={`${ct.label} ${messageValue.length > 500 ? "text-red-500" : ""}`}
                    style={messageValue.length <= 500 ? { color: palette.label } : undefined}
                  >
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <Textarea
                name="message"
                required
                value={messageValue}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setMessageValue(e.target.value)
                  }
                }}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder={`Write your wishes, prayer, or kind words for ${coupleDisplayName}...`}
                className={`message-form-textarea ${inputClass("message")} min-h-[90px] sm:min-h-[110px] md:min-h-[130px] resize-none placeholder:leading-relaxed`}
                style={{ color: palette.body, fontFamily: bodyFont.fontFamily }}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className={`${cinzel.className} w-full text-motif-cream py-2.5 sm:py-3 px-5 rounded-xl ${ct.btn} font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none border border-motif-deep/80`}
              style={{
                backgroundColor: palette.deep,
                boxShadow: "0 6px 20px color-mix(in srgb, var(--color-motif-deep) 25%, transparent)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = palette.accent
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = palette.deep
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function Messages() {
  const siteConfig = useSiteConfig()
  const { brideNickname, groomNickname } = siteConfig.couple
  const coupleDisplayName = `${groomNickname} & ${brideNickname}`

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setMessages([])
          setLoading(false)
          return
        }
        const parsed = data.filter((m) => m.name || m.message || m.timestamp).reverse()
        setMessages(parsed)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch messages:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  return (
    <Section id="messages" className="relative overflow-hidden">
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image
          src="/decoration/flower-decoration-left-bottom-corner2.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60"
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
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-60 scale-x-[-1]"
          priority={false}
          style={{ filter: DECO_FILTER }}
        />
      </div> */}

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <p
            className={`${cinzel.className} ${ct.label} uppercase tracking-[0.2em] sm:tracking-[0.24em] mb-2`}
            style={{ color: palette.cream }}
          >
            For {coupleDisplayName}
          </p>
          <h2
            className="leading-none mb-3"
            style={{
              fontFamily: "var(--font-brittany), cursive",
              fontSize: "clamp(1.85rem, 8vw, 4.5rem)",
              color: palette.cream,
              letterSpacing: "0.01em",
            }}
          >
            Love Notes &amp; Prayers
          </h2>
          <p
            className={`${ct.bodyLg} max-w-2xl mx-auto leading-relaxed px-2`}
            style={{ ...bodyFont, color: palette.cream }}
          >
            Share a short note, wish, or prayer for {coupleDisplayName}. Every message becomes part of their story.
          </p>
        </div>

        {/* Form */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
          <div className="relative max-w-xl w-full">
            <MessageForm onMessageSent={fetchMessages} />
          </div>
        </div>

        {/* Message wall */}
        <div className="relative max-w-4xl mx-auto details-container-inner">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative inline-block mb-3 sm:mb-4">
              <div
                className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto shadow-lg"
                style={{ backgroundColor: palette.accent }}
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <h3
              className={`${cinzel.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1.5 sm:mb-2`}
              style={{ color: palette.cream }}
            >
              Messages from Loved Ones
            </h3>
            <p className={ct.body} style={{ ...bodyFont, color: palette.cream, opacity: 0.92 }}>
              Warm words from family and friends
            </p>
          </div>

          <MessageWallDisplay messages={messages} loading={loading} />
        </div>
      </div>
    </Section>
  )
}

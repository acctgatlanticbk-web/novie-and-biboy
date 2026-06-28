import type { CSSProperties } from "react"

/** Coastal sunset palette — peach, dusty rose, muted teal, blue-gray, lavender-blue */
export const coastalPalette = {
  peach: "#F5D5C8",
  lavenderBlue: "#E8EEF2",
  blueGray: "#B8C9D0",
  dustyRose: "#C4A4A0",
  teal: "#6B8F91",
  body: "#4A5F65",
  title: "#6A8F93",
  deep: "#5A7478",
  cream: "#FFFCF8",
} as const

export const displayScript: CSSProperties = {
  fontFamily: "'Brightwall', cursive",
  fontWeight: 400,
}

export const coastalLightBg = coastalPalette.lavenderBlue
export const coastalDarkBg = coastalPalette.teal

export const coastalLightGradient = coastalLightBg
export const coastalDarkGradient = coastalDarkBg

export const coastalCardShadow = `0 16px 48px color-mix(in srgb, ${coastalPalette.teal} 14%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.72)`

export const coastalTitleShadow =
  "0 2px 4px rgba(255, 255, 255, 0.85), 0 0 16px rgba(184, 201, 208, 0.45)"

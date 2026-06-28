"use client"

import React from 'react';
import Link from 'next/link';
import { StorySection } from '@/components/StorySection';
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "400",
})

const coupleFont: React.CSSProperties = {
  fontFamily: "'HelloParisSans', serif",
}

const bodyFont: React.CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
}

// Palette lives in globals.css → @theme inline → --color-motif-*
// Edit there once to update every component.

export function LoveStory() {
  return (
    <div className="min-h-screen bg-motif-cream overflow-x-hidden">


      <div className="text-center z-0 relative px-4 pt-6 sm:pt-8">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <h1
           className="leading-none"
           style={{
            fontFamily: "var(--font-brittany), cursive",
             fontSize: "clamp(2.15rem, 9vw, 4.75rem)",
             color: 'var(--color-motif-deep)',
             letterSpacing: "0.04em",
           }}
          >
          A Letter to Our Loved Ones
          </h1>

        <p
          className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-[0.14em] sm:tracking-[0.18em] font-normal leading-snug mb-1 text-black max-w-4xl mx-auto mt-4"
          style={bodyFont}
        >
        With grateful hearts, we warmly invite you to share in one of the most meaningful and unforgettable days of our lives as we celebrate our wedding on December 5, 2026.
        </p>
      </div>

      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        title="Our Love Story"
        imageSrc="/mobile-background/couple (8).png"
        text={
          <>
            <p>
            Every love story is beautifully unique, and ours has been a journey filled with countless moments that have shaped who we are today. Through seasons of joy and challenges, laughter and tears, growth and understanding, we have learned that love is not simply found—it is nurtured through trust, patience, forgiveness, and the daily choice to stand beside one another.
            </p>
          </>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        title="Our Faith"
        imageSrc="/mobile-background/couple (11).png"
        text={
          <>
            <p>
            As we prepare to begin this new chapter, we place our future in God's loving hands. His grace has guided us through every season, teaching us the value of compassion, humility, and unconditional love. We pray that our marriage will always be rooted in faith, strengthened by hope, and sustained by His endless blessings.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        title="Our Promise"
        imageSrc="/mobile-background/couple (13).png"
        text={
          <>
            <p>
            Marriage is more than a celebration—it is a lifelong promise. It is choosing each other every day, embracing life's joys and challenges together, and building a home filled with love, respect, kindness, and unwavering commitment.
            </p>
          </>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        title="Our Gratitude"
        imageSrc="/mobile-background/couple (9).png"
        text={
          <>
            <p>
            To our beloved family and dear friends, thank you for being part of our journey. Your love, encouragement, prayers, and presence have helped shape the people we are today. Having you celebrate this special day with us is one of the greatest gifts we could ever receive.
            </p>
          </>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        isLast={true}
        title="Our Celebration"
        imageSrc="/mobile-background/couple (3).png"
        text={
          <>
            <p className="mb-4">
            Today is more than the beginning of our married life. It is a celebration of love that has grown stronger with time, of dreams becoming reality, and of a future we look forward to sharing together.
            </p>
            <p className="mb-4">
            As we say "I do," we humbly ask for your prayers, your blessings, and your continued support as we begin this beautiful journey as husband and wife. May our home always be filled with faith, hope, laughter, and a love that grows deeper with each passing day.
            </p>
            <p>
            With all our love and heartfelt gratitude,
            Novie &amp; Biboy
            </p>
          </>
        }
      />
      
      {/* Footer Decoration */}
      <div className="bg-motif-cream pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 text-center text-motif-deep z-0 relative px-4">
        <div className="w-12 sm:w-16 h-[1px] bg-motif-silver mx-auto mb-4 sm:mb-6 opacity-60"></div>
        <Link 
          href="#guest-list"
          className={`${cinzel.className} group relative inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-[0.7rem] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-normal text-motif-cream bg-motif-deep rounded-sm border border-motif-deep transition-all duration-300 hover:bg-motif-accent hover:border-motif-accent hover:text-motif-cream hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-motif-soft/50 focus-visible:ring-offset-2 focus-visible:ring-offset-motif-cream`}
        >
          <span className="relative z-10">Join us</span>
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-sm bg-motif-soft opacity-0 group-hover:opacity-25 blur-md transition-opacity duration-300 -z-0"></div>
        </Link>
      </div>
    </div>
  );
}

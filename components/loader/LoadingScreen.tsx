'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/content/site';

interface LoadingScreenProps {
  onComplete: () => void;
}

const WHITE = '#FFFFFF';
const WHITE_SOFT = 'rgba(255, 255, 255, 0.88)';
const WHITE_MUTED = 'rgba(255, 255, 255, 0.45)';
const TOTAL_DURATION_MS = 15000;

const COUPLE_NAME_IMAGE = '/Details/coupleName.png';

const NIGHT_SKY_GRADIENT = `linear-gradient(
  180deg,
  #050c18 0%,
  var(--color-motif-deep) 22%,
  #152d52 48%,
  var(--color-motif-medium) 72%,
  var(--color-motif-deep) 100%
)`;

const smg: React.CSSProperties = {
  fontFamily: "'SortsMillGoudy', Georgia, serif",
  fontStyle: 'normal',
};
const hps: React.CSSProperties = {
  fontFamily: "'HelloParisSans', serif",
};

function parseCeremonyDate(dateStr: string) {
  const match = dateStr.match(/(\w+)\s+(\d{1,2}),\s+(\d{4})/);
  return {
    month: match?.[1]?.toUpperCase() ?? 'OCTOBER',
    day: match?.[2] ?? '18',
    year: match?.[3] ?? '2026',
  };
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
  delay: number;
  bright: boolean;
}

function createStars(count: number): Star[] {
  return Array.from({ length: count }, (_, id) => {
    const bright = Math.random() < 0.12;
    return {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: bright ? 2.2 + Math.random() * 2.2 : 0.8 + Math.random() * 1.8,
      opacity: bright ? 0.55 + Math.random() * 0.35 : 0.2 + Math.random() * 0.55,
      twinkleDuration: 2.5 + Math.random() * 5,
      delay: Math.random() * 8,
      bright,
    };
  });
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [loadPercent, setLoadPercent] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.src = COUPLE_NAME_IMAGE;
  }, []);

  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;
    let completed = false;

    const finish = () => {
      if (completed) return;
      completed = true;
      onComplete();
    };

    const hardCapTimer = setTimeout(finish, TOTAL_DURATION_MS);

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const next = Math.min(100, Math.round((elapsed / TOTAL_DURATION_MS) * 100));
      setLoadPercent(next);
      if (next < 100) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(hardCapTimer);
      cancelAnimationFrame(frameId);
    };
  }, [onComplete]);

  const day = siteConfig.ceremony.day?.toUpperCase() ?? 'SATURDAY';
  const time = siteConfig.ceremony.time ?? '3:30 PM';
  const venue = siteConfig.ceremony.location;
  const { month, day: dateNum, year } = useMemo(
    () => parseCeremonyDate(siteConfig.ceremony.date ?? 'October 18, 2026'),
    [],
  );
  const stars = useMemo(() => createStars(96), []);

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--color-motif-deep)' }}
    >
      {/* ── Starry night sky ── */}
      <div
        className="night-sky pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{ background: NIGHT_SKY_GRADIENT }}
      >
        <div className="celestial-glow" />
        {stars.map((star) => (
          <span
            key={`star-${star.id}`}
            className={star.bright ? 'star star-bright' : 'star'}
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

      {/* ── Card content ── */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-[310px] flex-col items-center text-center md:max-w-[520px]"
        style={{
          color: WHITE,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* SAVE THE DATE — arch */}
        <div className="mb-1 w-full">
          <svg
            viewBox="0 0 300 100"
            className="mx-auto h-[66px] w-full md:hidden"
            aria-hidden
            overflow="visible"
          >
            <defs>
              <path id="stdArcMob" d="M 6 86 A 178 178 0 0 1 294 86" fill="none" />
            </defs>
            <text fill={WHITE} style={{ ...smg, fontSize: '24px', letterSpacing: '0.32em' }}>
              <textPath href="#stdArcMob" startOffset="50%" textAnchor="middle">
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
              <path id="stdArcDsk" d="M 10 112 A 280 280 0 0 1 470 112" fill="none" />
            </defs>
            <text fill={WHITE} style={{ ...smg, fontSize: '36px', letterSpacing: '0.3em' }}>
              <textPath href="#stdArcDsk" startOffset="50%" textAnchor="middle">
                SAVE THE DATE
              </textPath>
            </text>
          </svg>
        </div>

        <div className="mt-1">
          <p className="text-[14px] md:text-[18px]" style={{ ...smg, color: WHITE_SOFT }}>
            for the wedding of
          </p>
        </div>

        <div className="mt-4 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={encodeURI(COUPLE_NAME_IMAGE)}
            alt={`${siteConfig.couple.groomNickname} and ${siteConfig.couple.brideNickname}`}
            className="mx-auto h-auto w-full max-w-[200px] brightness-0 invert md:max-w-[270px]"
          />
        </div>

        <div className="mt-4 w-[115%] md:mt-5 md:w-full">
          <p
            className="whitespace-nowrap text-[12px] leading-[1.65] md:whitespace-normal md:text-[14px] md:leading-[1.75]"
            style={{ ...smg, color: WHITE_SOFT }}
          >
            Together with their families
            <br />
            invite you to their wedding celebration
          </p>
        </div>

        {/* Date block */}
        <div className="mt-4 w-full md:mt-5">
          <div
            className="mx-auto grid w-full max-w-[260px] gap-y-0 md:max-w-[340px]"
            style={{
              gridTemplateColumns: '1fr auto 1fr',
              gridTemplateRows: 'auto auto auto',
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
                {day}
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
                  fontSize: 'clamp(52px, 14vw, 68px)',
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
                At {time}
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

        <div className="mt-4 flex w-full flex-col items-center md:mt-5">
          <div className="flex items-center justify-center gap-1.5 md:gap-2">
            <div
              className="w-[3.25rem] border-t border-dotted md:w-[4rem]"
              style={{ borderColor: WHITE_MUTED }}
            />
            <span className="text-[13px] md:text-[15px]" style={{ ...smg, color: WHITE_SOFT }}>
              at
            </span>
            <div
              className="w-[3.25rem] border-t border-dotted md:w-[4rem]"
              style={{ borderColor: WHITE_MUTED }}
            />
          </div>
          <p
            className="mt-2 text-[13px] leading-snug md:mt-2.5 md:text-[15px]"
            style={{ ...smg, color: WHITE_SOFT }}
          >
            {venue}
          </p>
        </div>

        <div className="mt-7 w-full max-w-[220px] pb-2 md:max-w-[320px]">
          <p
            className="loading-dots-text text-[11px] tracking-[0.28em] uppercase md:text-[12px]"
            style={{ ...smg, color: WHITE_SOFT }}
            aria-live="polite"
          >
            Loading {loadPercent}%
          </p>
          <div
            className="mt-2 h-[3px] w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-150 ease-out"
              style={{
                width: `${loadPercent}%`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.95), rgba(255,255,255,0.7))',
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-dots-text {
          animation: loadingPulse 2s ease-in-out infinite;
        }

        @keyframes loadingPulse {
          0%, 100% { opacity: 0.65; }
          50%       { opacity: 1; }
        }

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
          content: '';
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
          0%, 100% {
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
    </div>
  );
};

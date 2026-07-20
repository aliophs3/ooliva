import { useEffect, useRef, useState } from 'react'

// ── Config (easy to edit) ────────────────────────────────────────────────────
const WHATSAPP_PHONE = '961XXXXXXXX'
const WHATSAPP_MESSAGE = 'Hello, I would like to ask about booking a padel court.'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const HERO_IMAGE = '/1000013222.jpg'
const SIGN_LOGO = '/Screenshot_20260720_033202_Drive.jpg'

// Approved homepage palette
const C = {
  oliveDark: '#4D6437',
  olive: '#556B2F',
  frame: '#3F4638',
  espresso: '#2F2C28',
  brown: '#4A3426',
  gold: '#CCA478',
  cream: '#DCCFB6',
  paper: '#FAF9F6',
}

interface Props {
  onViewMenu: () => void
  onBook: () => void
  introDone: boolean
}

export default function NightOliveHero({ onViewMenu, onBook, introDone }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const signRef = useRef<HTMLDivElement>(null)
  const signWrapRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  // Scroll parallax for the hanging sign (light, transform-only)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const hero = heroRef.current
        const wrap = signWrapRef.current
        const sign = signRef.current
        if (!hero || !wrap || !sign) return
        const rect = hero.getBoundingClientRect()
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1)
        setScrolled(progress > 0.05)
        // Move sign up slower than scroll: max ~30px, rotate -1.5deg, exit right
        const ty = -progress * 30
        const rot = -progress * 1.5
        const tx = progress * 18
        const scale = 1 - progress * 0.06
        const lum = 1 - progress * 0.35
        wrap.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`
        sign.style.setProperty('--lum', String(lum))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Magnetic hover for buttons (desktop, max 3-4px)
  const magnetic = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 1024px)').matches) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const mx = ((e.clientX - r.left) / r.width) * 100
    const my = ((e.clientY - r.top) / r.height) * 100
    el.style.setProperty('--mx', `${mx}%`)
    el.style.setProperty('--my', `${my}%`)
    const dx = (mx - 50) / 50
    const dy = (my - 50) / 50
    el.style.transform = `translate(${dx * 3}px, ${dy * 3}px) translateY(-2px)`
  }
  const magneticReset = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  }

  const scrollToVideoSection = () => {
    document.getElementById('oliva-video-section')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToNext = () => {
    // Scroll to the section after the video section (CatchABreak)
    const vid = document.getElementById('oliva-video-section')
    if (vid) {
      const next = vid.nextElementSibling
      next?.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById('catch-a-break')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Entrance delays start after intro finishes
  const d = (n: number) => (introDone ? `${n}ms` : '9999ms')

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden noh-overflow-guard"
      style={{ background: C.espresso }}
    >
      {/* ── Hero background image ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Oliva padel café atmosphere"
          className="noh-hero-img absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center 30%',
            opacity: introDone ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
          draggable={false}
        />
        {/* Dark gradient overlay — darker where text/controls appear (left/bottom) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(47,44,40,0.78) 0%, rgba(47,44,40,0.35) 45%, rgba(47,44,40,0.15) 70%, rgba(47,44,40,0.55) 100%), linear-gradient(180deg, transparent 60%, rgba(47,44,40,0.85) 100%)',
          }}
        />
        {/* Subtle court lines (behind content) */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          style={{ opacity: 0.04, pointerEvents: 'none' }}
        >
          <rect x="20" y="10" width="60" height="80" fill="none" stroke={C.cream} strokeWidth="0.3" />
          <line x1="50" y1="10" x2="50" y2="90" stroke={C.cream} strokeWidth="0.2" />
          <line x1="20" y1="50" x2="80" y2="50" stroke={C.cream} strokeWidth="0.2" />
        </svg>
        {/* Steam line */}
        <div
          className="noh-steam absolute"
          style={{
            left: '22%',
            bottom: '28%',
            width: '2px',
            height: '80px',
            background: `linear-gradient(to top, transparent, ${C.cream})`,
            opacity: 0.12,
            borderRadius: '2px',
          }}
        />
        {/* Cinematic grain */}
        <div className="noh-grain absolute inset-0" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(47,44,40,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Top-left content: label + status pill ──────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-24 pb-32">
        {/* Premium label */}
        <p
          className="noh-fade-up"
          style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(11px, 1.4vw, 15px)',
            fontWeight: 600,
            letterSpacing: '0.42em',
            color: C.gold,
            textTransform: 'uppercase',
            animationDelay: d(300),
            marginBottom: '18px',
          }}
        >
          Padel · Café · Fun
        </p>

        {/* Opening status pill */}
        <div
          className="noh-fade-up inline-flex items-center gap-2.5 self-start"
          style={{
            background: 'rgba(47,44,40,0.6)',
            border: `1px solid ${C.cream}55`,
            borderRadius: '999px',
            padding: '7px 16px',
            animationDelay: d(550),
            backdropFilter: 'blur(6px)',
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: C.olive, boxShadow: `0 0 8px ${C.olive}` }}
          />
          <span
            style={{
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: C.paper,
              textTransform: 'uppercase',
            }}
          >
            Open Today · 9:00 AM — 11:30 PM
          </span>
        </div>
      </div>

      {/* ── Hanging Oliva sign (right side, below hamburger) ───────────────── */}
      <div
        ref={signWrapRef}
        className="absolute z-20 will-change-transform"
        style={{
          top: 'clamp(80px, 12vh, 130px)',
          right: 'clamp(20px, 6vw, 90px)',
          opacity: introDone ? undefined : 0,
          transition: introDone ? 'opacity 0.8s ease 0.2s' : 'none',
        }}
      >
        <div
          className="noh-sign-swing relative"
          style={{ transformOrigin: 'top center' }}
        >
          {/* Metal support arm — attached to top/right */}
          <div
            style={{
              position: 'absolute',
              top: '-46px',
              right: '50%',
              width: '6px',
              height: '52px',
              background: `linear-gradient(to right, ${C.frame}, #5a6450, ${C.frame})`,
              borderRadius: '3px 3px 0 0',
              transform: 'translateX(50%) rotate(8deg)',
              transformOrigin: 'top center',
              boxShadow: '2px 2px 6px rgba(0,0,0,0.4)',
            }}
          />
          {/* Bracket cap */}
          <div
            style={{
              position: 'absolute',
              top: '-52px',
              right: '50%',
              width: '18px',
              height: '10px',
              background: C.frame,
              borderRadius: '4px',
              transform: 'translateX(50%) rotate(8deg)',
              transformOrigin: 'top center',
              boxShadow: '1px 2px 4px rgba(0,0,0,0.35)',
            }}
          />

          {/* Sign body — circular, with depth via layered shadows */}
          <div
            ref={signRef}
            className="noh-sign-light"
            style={{
              '--lum': 1,
              width: 'clamp(120px, 16vw, 180px)',
              height: 'clamp(120px, 16vw, 180px)',
              borderRadius: '50%',
              background: C.paper,
              border: `3px solid ${C.espresso}`,
              boxShadow: `
                0 0 0 4px ${C.frame},
                0 12px 30px rgba(0,0,0,0.45),
                0 4px 10px rgba(0,0,0,0.3),
                inset 0 0 22px rgba(204,164,120, calc(0.25 * var(--lum)))
              `,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              position: 'relative',
              filter: `brightness(var(--lum))`,
            } as React.CSSProperties}
          >
            {/* Logo (background-removed reference image) */}
            <img
              src={SIGN_LOGO}
              alt="Oliva sign"
              style={{
                maxWidth: '72%',
                maxHeight: '60%',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
              }}
              draggable={false}
            />
            <p
              style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(9px, 1.1vw, 13px)',
                fontWeight: 800,
                letterSpacing: '0.22em',
                color: C.espresso,
                margin: '4px 0 0',
              }}
            >
              OLIVA
            </p>
            <p
              style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                fontSize: 'clamp(5px, 0.6vw, 7px)',
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: C.brown,
                margin: '2px 0 0',
                textTransform: 'uppercase',
              }}
            >
              From Court to Cup
            </p>
          </div>
        </div>

        {/* Explore Oliva button — connected to the sign */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={scrollToVideoSection}
            onMouseMove={magnetic}
            onMouseLeave={magneticReset}
            className="noh-btn noh-fade-up"
            style={{
              background: C.cream,
              color: C.espresso,
              border: 'none',
              borderRadius: '999px',
              padding: '8px 18px',
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              animationDelay: d(1100),
              cursor: 'pointer',
            }}
          >
            Explore Oliva
          </button>
        </div>
      </div>

      {/* ── Bottom: Scroll for More (hint, not the main one) ───────────────── */}
      <div
        className="noh-fade absolute z-10 left-1/2 -translate-x-1/2"
        style={{ bottom: '26px', animationDelay: d(1300) }}
      >
        <button
          onClick={scrollToVideoSection}
          className="inline-flex flex-col items-center gap-1"
          style={{
            background: 'transparent',
            border: `1px solid ${C.cream}55`,
            borderRadius: '999px',
            padding: '8px 16px 6px',
            color: C.paper,
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <span>Scroll for More</span>
          <svg
            className="noh-arrow"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

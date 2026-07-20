import { useEffect, useRef, useState } from 'react'

// ── Editable config ──────────────────────────────────────────────────────────
const WHATSAPP_PHONE = '961XXXXXXXX'
const WHATSAPP_MESSAGE = 'Hello, I would like to ask about booking a padel court.'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const VIDEO_SRC_DESKTOP = '/oliva-hero-720.mp4'
const VIDEO_SRC_MOBILE = '/oliva-hero-480.mp4'
const VIDEO_POSTER = '/1000013222.jpg'
const VIDEO_DURATION = 6 // seconds — slow-motion slice

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
  waGreen: '#25D366',
  waGreenDark: '#128C7E',
}

interface Props {
  onViewMenu: () => void
  onBook: () => void
  introDone: boolean
}

export default function NightOliveHero({ onViewMenu, introDone }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [waHover, setWaHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const update = () => setReduced(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Scroll-controlled video: map hero scroll progress 0→1 to video time 0→3s
  useEffect(() => {
    if (reduced) return
    const video = videoRef.current
    const hero = heroRef.current
    if (!video || !hero) return

    let raf = 0
    let targetTime = 0
    let lastTime = 0

    const tick = (now: number) => {
      // Throttle to ~30fps max for seeking to reduce overhead
      if (now - lastTime < 33) {
        raf = requestAnimationFrame(tick)
        return
      }
      lastTime = now
      if (video.duration) {
        const cur = video.currentTime
        const diff = targetTime - cur
        // Gentle smoothing — catches up smoothly without lag or judder
        if (Math.abs(diff) > 0.015) {
          const next = cur + diff * 0.12
          try { video.currentTime = next } catch { /* not seekable yet */ }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const rect = hero.getBoundingClientRect()
      const viewportH = window.innerHeight
      // Progress: 0 when hero top is at viewport top, 1 when hero bottom is at viewport bottom
      const scrolled = -rect.top
      const total = rect.height - viewportH
      const progress = Math.min(Math.max(scrolled / total, 0), 1)
      targetTime = progress * VIDEO_DURATION
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Preload video during intro; reveal when first frame is ready
  const onLoadedData = () => setVideoReady(true)

  // Magnetic hover (desktop only, max 3px)
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

  const scrollToNext = () => {
    const hero = heroRef.current
    if (hero) {
      const next = hero.nextElementSibling
      next?.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById('catch-a-break')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Entrance delays (start after intro)
  const d = (n: number) => (introDone ? `${n}ms` : '9999ms')

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full overflow-hidden noh-overflow-guard"
      style={{ height: '100vh', minHeight: '600px', background: C.espresso }}
    >
      {/* ── Video background (3-second scroll-controlled) ──────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Poster shown until video first frame is ready */}
        {!videoReady && (
          <img
            src={VIDEO_POSTER}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
            draggable={false}
          />
        )}
        <video
          ref={videoRef}
          className="noh-hero-img absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center center',
            opacity: introDone && videoReady ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
          poster={VIDEO_POSTER}
          muted
          playsInline
          preload="auto"
          onLoadedData={onLoadedData}
          onCanPlay={onLoadedData}
          // No autoPlay, no loop — scroll drives currentTime
        >
          <source src={VIDEO_SRC_DESKTOP} type="video/mp4" media="(min-width: 768px)" />
          <source src={VIDEO_SRC_MOBILE} type="video/mp4" />
        </video>
        {/* Overlay: soft gradient from espresso → transparent → frame, keeps buttons clear */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(47,44,40,0.7) 0%, rgba(47,44,40,0.25) 30%, rgba(63,70,56,0.3) 60%, rgba(47,44,40,0.85) 100%)',
          }}
        />
        {/* Subtle court lines (3-4% opacity) */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          style={{ opacity: 0.035, pointerEvents: 'none' }}
        >
          <rect x="20" y="10" width="60" height="80" fill="none" stroke={C.cream} strokeWidth="0.3" />
          <line x1="50" y1="10" x2="50" y2="90" stroke={C.cream} strokeWidth="0.2" />
          <line x1="20" y1="50" x2="80" y2="50" stroke={C.cream} strokeWidth="0.2" />
        </svg>
        {/* One soft steam line */}
        <div
          className="noh-steam absolute"
          style={{
            left: '24%',
            bottom: '30%',
            width: '2px',
            height: '70px',
            background: `linear-gradient(to top, transparent, ${C.cream})`,
            opacity: 0.1,
            borderRadius: '2px',
          }}
        />
        {/* Cinematic grain (2%) */}
        <div className="noh-grain absolute inset-0" />
        {/* Soft edge vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(47,44,40,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Content: label, status pill, three buttons ─────────────────────── */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-24">
        {/* Premium label */}
        <p
          className="noh-fade-up text-center"
          style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(11px, 1.4vw, 15px)',
            fontWeight: 600,
            letterSpacing: '0.42em',
            color: C.gold,
            textTransform: 'uppercase',
            animationDelay: d(200),
            marginBottom: '14px',
          }}
        >
          Padel · Café · Fun
        </p>

        {/* Opening status pill */}
        <div
          className="noh-fade-up inline-flex items-center gap-2.5 mb-10"
          style={{
            background: 'rgba(47,44,40,0.6)',
            border: `1px solid ${C.cream}55`,
            borderRadius: '999px',
            padding: '7px 16px',
            animationDelay: d(450),
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

        {/* 1. VIEW MENU — main button */}
        <button
          onClick={onViewMenu}
          onMouseMove={magnetic}
          onMouseLeave={magneticReset}
          className="noh-btn noh-fade-up inline-flex items-center gap-3 mb-4"
          style={{
            background: C.oliveDark,
            color: C.paper,
            border: `1px solid ${C.cream}66`,
            borderRadius: '999px',
            padding: '16px 44px',
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 'clamp(15px, 2vw, 19px)',
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            animationDelay: d(650),
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = C.olive)}
          onMouseOut={(e) => (e.currentTarget.style.background = C.oliveDark)}
        >
          <span>View Menu</span>
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.25s ease' }}
            className="group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* 2. Combined PADEL + WHATSAPP split button */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={magnetic}
          onMouseEnter={() => setWaHover(true)}
          onMouseLeave={(e) => { magneticReset(e); setWaHover(false) }}
          className="noh-btn noh-fade-up inline-flex items-stretch mb-4"
          style={{
            borderRadius: '999px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            textDecoration: 'none',
            border: `1px solid ${C.cream}33`,
            animationDelay: d(850),
          }}
        >
          {/* Left — Padel side */}
          <span
            className="inline-flex items-center gap-2.5"
            style={{
              background: C.frame,
              color: C.paper,
              padding: '15px 22px',
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              transition: 'padding 0.3s ease',
              paddingRight: waHover ? '18px' : '22px',
            }}
          >
            {/* Padel racket icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="10" cy="10" rx="7" ry="8" transform="rotate(-30 10 10)" />
              <line x1="14" y1="14" x2="20" y2="20" />
            </svg>
            <span className="flex flex-col leading-tight">
              <span style={{ fontSize: '9px', opacity: 0.7, letterSpacing: '0.18em' }}>PADEL</span>
              <span>BOOK A COURT</span>
            </span>
          </span>
          {/* Divider */}
          <span style={{ width: '1px', background: `${C.cream}33` }} />
          {/* Right — WhatsApp side */}
          <span
            className="inline-flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${C.waGreen}, ${C.waGreenDark})`,
              color: '#fff',
              padding: '15px 22px',
              fontFamily: "'Manrope', system-ui, sans-serif",
              fontSize: 'clamp(13px, 1.6vw, 16px)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              transition: 'padding 0.3s ease',
              paddingLeft: waHover ? '28px' : '22px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </a>

        {/* 3. SCROLL FOR MORE — transparent capsule */}
        <button
          onClick={scrollToNext}
          onMouseMove={magnetic}
          onMouseLeave={magneticReset}
          className="noh-btn noh-fade-up inline-flex items-center gap-2"
          style={{
            background: 'rgba(47,44,40,0.4)',
            border: `1px solid ${C.cream}55`,
            borderRadius: '999px',
            padding: '10px 20px',
            color: C.paper,
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            animationDelay: d(1050),
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

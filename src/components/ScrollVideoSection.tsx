import { useEffect, useRef, useState } from 'react'

// ── Config (easy to edit) ────────────────────────────────────────────────────
const WHATSAPP_PHONE = '961XXXXXXXX'
const WHATSAPP_MESSAGE = 'Hello, I would like to ask about booking a padel court.'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const VIDEO_SRC = '/6e7154.mp4'
const VIDEO_POSTER = '/1000013222.jpg'

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
}

export default function ScrollVideoSection({ onViewMenu }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const update = () => setReduced(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Scroll-controlled video playback
  useEffect(() => {
    if (reduced) return
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    let raf = 0
    const updateProgress = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect()
        const sectionH = rect.height
        const viewportH = window.innerHeight
        // Progress: 0 when section top hits viewport top, 1 when section bottom hits viewport bottom
        const scrolled = -rect.top
        const total = sectionH - viewportH
        const progress = Math.min(Math.max(scrolled / total, 0), 1)
        if (video.duration) {
          const targetTime = progress * video.duration
          // Smooth seek to avoid jank
          if (Math.abs(video.currentTime - targetTime) > 0.05) {
            try { video.currentTime = targetTime } catch { /* seek may throw while not ready */ }
          }
        }
      })
    }

    const onScroll = () => updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Initialize at first frame
    video.pause()
    updateProgress()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Magnetic hover for buttons
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
    const sec = sectionRef.current
    if (sec) {
      const next = sec.nextElementSibling
      next?.scrollIntoView({ behavior: 'smooth' })
    } else {
      document.getElementById('catch-a-break')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const [waHover, setWaHover] = useState(false)

  return (
    <section
      id="oliva-video-section"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '160vh', background: C.espresso }}
    >
      {/* Sticky video container — stays pinned while scrolling through the section */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: C.espresso,
        }}
      >
        {/* Video background — starts at first frame, controlled by scroll */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          muted
          playsInline
          preload="auto"
          // No autoPlay, no loop — scroll controls it
        />
        {/* Dark gradient overlay for readability + blend from hero */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(47,44,40,0.85) 0%, rgba(47,44,40,0.35) 25%, rgba(47,44,40,0.4) 75%, rgba(47,44,40,0.8) 100%)',
          }}
        />

        {/* Buttons — vertical layout, centered, behind nothing */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-4">
          {/* 1. VIEW MENU — main, strongest */}
          <button
            onClick={onViewMenu}
            onMouseMove={magnetic}
            onMouseLeave={magneticReset}
            className="noh-btn noh-fade-up inline-flex items-center gap-3"
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
              animationDelay: '200ms',
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
            className="noh-btn noh-fade-up inline-flex items-stretch"
            style={{
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              textDecoration: 'none',
              border: `1px solid ${C.cream}33`,
              animationDelay: '400ms',
            }}
          >
            {/* Left — Padel side */}
            <span
              className="inline-flex items-center gap-2.5"
              style={{
                background: C.frame,
                color: C.cream,
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
              animationDelay: '600ms',
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

        {/* Bottom blend into next section */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '120px',
            background: 'linear-gradient(to bottom, transparent, rgba(47,44,40,0.95))',
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  )
}

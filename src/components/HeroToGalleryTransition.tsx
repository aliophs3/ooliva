import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  hero: ReactNode
  gallery: ReactNode
}

/**
 * Circular reveal transition from Hero → Gallery.
 *
 * Structure:
 *   <section> height ~160svh
 *     <div sticky 100svh>
 *       Gallery layer (real gallery, always rendered, revealed through circle mask)
 *       Hero layer (green bg + video + buttons + text + logo circle)
 *
 * Scroll progress 0→1 drives via CSS variable --p:
 *   - circle clip-path radius: small → fullscreen
 *   - hero content (buttons/text) opacity: 1 → 0 (fades in first 35%)
 *   - logo circle photo opacity: 1 → 0 (fades in first 25%)
 *   - hero green bg opacity: 1 → 0 (fades from 60% to 100%)
 *   - circle border/shadow opacity: 1 → 0 (fades from 70% to 95%)
 */
export default function HeroToGalleryTransition({ hero, gallery }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const galleryLayerRef = useRef<HTMLDivElement>(null)
  const heroLayerRef = useRef<HTMLDivElement>(null)
  const logoCircleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const galleryLayer = galleryLayerRef.current
    const heroLayer = heroLayerRef.current
    const logoCircle = logoCircleRef.current
    if (!section || !galleryLayer || !heroLayer || !logoCircle) return

    let raf = 0
    let heroContent: HTMLDivElement | null = null

    const update = () => {
      raf = requestAnimationFrame(update)
      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight
      const scrolled = -rect.top
      const total = rect.height - viewportH
      const progress = Math.min(Math.max(scrolled / total, 0), 1)

      section.style.setProperty('--p', progress.toFixed(4))

      // Circle radius: starts small, grows to cover full screen
      const vw = window.innerWidth
      const vh = window.innerHeight
      const diag = Math.sqrt(vw * vw + vh * vh)
      const baseR = vw < 768 ? 50 : 65
      const fullR = diag * 0.6
      const r = baseR + (fullR - baseR) * easeInOut(progress)

      // Circle center: top-left, just below navbar
      const cx = vw < 768 ? 50 : 65
      const cy = 64 + (vw < 768 ? 50 : 65)

      const clip = `circle(${r}px at ${cx}px ${cy}px)`
      galleryLayer.style.clipPath = clip
      galleryLayer.style.setProperty('-webkit-clip-path', clip)

      // Hero content (buttons/text): fade out in first 35%
      const heroOpacity = Math.max(0, 1 - progress / 0.35)
      const heroY = progress * 30
      const hc = heroContent
      if (hc) {
        hc.style.opacity = heroOpacity.toFixed(3)
        hc.style.transform = `translateY(${heroY.toFixed(1)}px)`
      }

      // Logo circle photo: fade out in first 25%
      const logoOpacity = Math.max(0, 1 - progress / 0.25)
      logoCircle.style.opacity = logoOpacity.toFixed(3)

      // Hero green bg: fade out from 60% to 100%
      const heroBgOpacity = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.4)
      heroLayer.style.opacity = heroBgOpacity.toFixed(3)

      // Circle border/shadow: fade out from 70% to 95%
      const borderOpacity = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.25)
      galleryLayer.style.setProperty('--border-opacity', borderOpacity.toFixed(3))
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    raf = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full noh-transition"
      style={{
        height: '160svh',
        // @ts-expect-error CSS custom property
        '--p': '0',
        '--logo-size': 'clamp(100px, 13vw, 130px)',
      }}
    >
      {/* Sticky viewport — holds both layers */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* ── Gallery layer (real gallery, revealed through circle mask) ── */}
        <div
          ref={galleryLayerRef}
          className="absolute inset-0 z-10 noh-gallery-reveal"
          style={{
            // @ts-expect-error CSS custom property
            '--border-opacity': '1',
          }}
        >
          {gallery}
        </div>

        {/* ── Hero layer (green bg + video) ──────────────────────────────── */}
        <div
          ref={heroLayerRef}
          className="absolute inset-0 z-20"
          style={{ opacity: 1 }}
        >
          {hero}
        </div>

        {/* ── Small circular logo window (top-left, below navbar) ─────────── */}
        <div
          ref={logoCircleRef}
          className="absolute z-40 noh-logo-circle"
          style={{
            top: '64px',
            left: '0px',
            width: 'var(--logo-size)',
            height: 'var(--logo-size)',
            opacity: 1,
          }}
        >
          <img
            src="/oliva-logo.png"
            alt="Oliva sign"
            className="w-full h-full object-cover"
            style={{
              objectPosition: 'center 30%',
              transform: 'scale(1.6)',
            }}
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

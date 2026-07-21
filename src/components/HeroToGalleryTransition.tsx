import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  hero: ReactNode
}

/**
 * Circular reveal transition from Hero → Gallery.
 *
 * A logo-filled circle starts large in the hero center, travels to the
 * navbar logo position (top-left) as the user scrolls, shrinking and
 * landing slightly bigger than the navbar logo. The circle clip-path
 * reveals the light-green gallery behind. When the scroll completes,
 * the circle fades out and the navbar logo takes over — no logo remains
 * frozen on screen.
 */
export default function HeroToGalleryTransition({ hero }: Props) {
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
      const vw = window.innerWidth
      const vh = window.innerHeight
      const scrolled = -rect.top
      const total = rect.height - vh
      const progress = Math.min(Math.max(scrolled / total, 0), 1)

      section.style.setProperty('--p', progress.toFixed(4))

      // ── Logo circle: hero center → navbar logo position (top-left) ──
      // Navbar logo is ~48px tall at left ~24px, top ~8px (inside 64px navbar)
  // We land at ~58px — slightly bigger than navbar logo
      const startSize = vw < 768 ? 160 : 200
      const endSize = vw < 768 ? 52 : 58
      const logoSize = startSize + (endSize - startSize) * easeInOut(progress)

      // Start: center of hero
      const startX = (vw - startSize) / 2
      const startY = (vh - startSize) / 2
      // End: navbar logo position (left padding ~24px, vertically centered in 64px navbar)
      const endX = vw < 768 ? 12 : 24
      const endY = (64 - endSize) / 2

      const logoX = startX + (endX - startX) * easeInOut(progress)
      const logoY = startY + (endY - startY) * easeInOut(progress)

      logoCircle.style.width = `${logoSize}px`
      logoCircle.style.height = `${logoSize}px`
      logoCircle.style.left = `${logoX}px`
      logoCircle.style.top = `${logoY}px`

      // Circle center = center of logo
      const cx = logoX + logoSize / 2
      const cy = logoY + logoSize / 2

      // Circle radius: starts at ~60% of logo size, grows to cover screen
      const diag = Math.sqrt(vw * vw + vh * vh)
      const baseR = logoSize * 0.62
      const fullR = diag * 0.62
      const r = baseR + (fullR - baseR) * easeInOut(progress)

      const clip = `circle(${r}px at ${cx}px ${cy}px)`
      galleryLayer.style.clipPath = clip
      galleryLayer.style.setProperty('-webkit-clip-path', clip)

      // Hero content fade: fade out in first 30%
      if (!heroContent) {
        heroContent = heroLayer.querySelector('.noh-hero-content') as HTMLDivElement | null
      }
      const hc = heroContent
      if (hc) {
        hc.style.opacity = Math.max(0, 1 - progress / 0.3).toFixed(3)
        hc.style.transform = `translateY(${(progress * 25).toFixed(1)}px)`
      }

      // Hero layer fade: fade out from 65% to 100%
      const heroBgOpacity = progress < 0.65 ? 1 : Math.max(0, 1 - (progress - 0.65) / 0.35)
      heroLayer.style.opacity = heroBgOpacity.toFixed(3)

      // Logo circle fade: fade out from 88% to 100% (navbar logo takes over)
      const circleOpacity = progress < 0.88 ? 1 : Math.max(0, 1 - (progress - 0.88) / 0.12)
      logoCircle.style.opacity = circleOpacity.toFixed(3)

      // Circle border/shadow fade
      const borderOpacity = progress < 0.75 ? 1 : Math.max(0, 1 - (progress - 0.75) / 0.25)
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
      }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* ── Gallery preview layer (light green bg, revealed through circle) ── */}
        <div
          ref={galleryLayerRef}
          className="absolute inset-0 z-10 noh-gallery-reveal"
          style={{
            background: '#E8EFE0',
            // @ts-expect-error CSS custom property
            '--border-opacity': '1',
          }}
        />

        {/* ── Hero layer (dark green bg + video) ── */}
        <div
          ref={heroLayerRef}
          className="absolute inset-0 z-20"
          style={{ opacity: 1 }}
        >
          {hero}
        </div>

        {/* ── Logo circle — travels from hero center to navbar logo position ── */}
        <div
          ref={logoCircleRef}
          className="absolute z-40 noh-logo-circle"
          style={{
            top: '50%',
            left: '50%',
            width: '200px',
            height: '200px',
            opacity: 1,
          }}
        >
          <img
            src="/oliva-logo.jpg"
            alt="Oliva logo"
            className="w-full h-full object-cover"
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

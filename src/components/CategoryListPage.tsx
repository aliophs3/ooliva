import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import OlivaLogo from './OlivaLogo'

export interface CategoryProduct {
  id: string
  name: string
  description: string
  price: string
  image: string | null
  themeColor: string
}

export interface CategoryTheme {
  bgGradient: string
  cardBg: string
  cardBorder: string
  text: string
  subtext: string
  price: string
  accent: string
}

type NavRoute = 'home' | 'menu' | 'cold-drinks-list' | 'hot-drinks-list' | 'desserts-list' | 'shisha-list'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Placeholder({ theme }: { theme: CategoryTheme }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 8, color: theme.subtext,
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>
        Image Added Later
      </p>
    </div>
  )
}

export default function CategoryListPage({
  title, subtitle, theme, products, navigate, onBack, onProduct,
}: {
  title: string
  subtitle: string
  theme: CategoryTheme
  products: CategoryProduct[]
  navigate: (to: NavRoute) => void
  onBack: () => void
  onProduct: (slug: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('categoryScroll:' + title)
    if (saved && scrollRef.current) scrollRef.current.scrollTop = parseInt(saved, 10)
    return () => {
      if (scrollRef.current) sessionStorage.setItem('categoryScroll:' + title, String(scrollRef.current.scrollTop))
    }
  }, [title])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: theme.bgGradient }}>
      {/* Nav */}
      <nav style={{
        position: 'relative', zIndex: 10, height: 64, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,40px)',
      }}>
        <button onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: theme.cardBg, backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.cardBorder}`, borderRadius: 999,
            padding: '8px 18px', cursor: 'pointer',
            color: theme.text, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          BACK
        </button>
        <button onClick={() => navigate('home')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}>
          <OlivaLogo size={34} showText={false} />
          <span style={{ color: theme.text, fontWeight: 800, fontSize: 15, letterSpacing: '0.06em' }}>OLIVA</span>
        </button>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ textAlign: 'center', padding: 'clamp(8px,1.6vh,16px) clamp(16px,4vw,40px) 0', flexShrink: 0 }}
      >
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.32em', color: theme.subtext, textTransform: 'uppercase' }}>{subtitle}</p>
        <h1 style={{ margin: '6px 0 0', fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em' }}>{title}</h1>
      </motion.div>

      {/* Scrollable list */}
      <div ref={scrollRef} className="clp-scroll" style={{
        flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
        padding: 'clamp(8px,1.6vh,16px) clamp(16px,4vw,40px) clamp(16px,3vh,32px)',
        display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2.4vh,24px)',
        maxWidth: 920, margin: '0 auto', width: '100%',
      }}>
        {products.map((p, i) => {
          const slug = slugify(p.id || p.name)
          const imageLeft = i % 2 === 0
          return (
            <motion.button
              key={p.id || p.name}
              onClick={() => onProduct(slug)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: EASE, delay: Math.min(i * 0.07, 0.4) }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              whileTap={{ scale: 0.985, transition: { duration: 0.12 } }}
              style={{
                display: 'flex', flexDirection: imageLeft ? 'row' : 'row-reverse',
                alignItems: 'stretch', gap: 'clamp(14px,2.4vw,28px)',
                background: theme.cardBg, backdropFilter: 'blur(14px) saturate(1.3)',
                border: `1px solid ${theme.cardBorder}`, borderRadius: 22,
                padding: 'clamp(14px,2vh,22px)', cursor: 'pointer',
                boxShadow: '0 10px 36px rgba(0,0,0,0.22)',
                textAlign: 'left', width: '100%',
              }}
            >
              {/* Image */}
              <div style={{
                flex: '0 0 clamp(110px,26%,180px)',
                borderRadius: 16, overflow: 'hidden',
                background: `linear-gradient(135deg, ${p.themeColor}22, ${p.themeColor}11)`,
                border: `1px solid ${theme.cardBorder}`,
                minHeight: 'clamp(110px,18vh,160px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} loading="lazy" draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Placeholder theme={theme} />
                )}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: 'clamp(18px,2.2vw,26px)', fontWeight: 800, color: theme.text, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{p.name}</h3>
                <p style={{ margin: 0, fontSize: 'clamp(13px,1.2vw,15px)', color: theme.subtext, lineHeight: 1.5 }}>{p.description}</p>
                <p style={{ margin: '4px 0 0', fontSize: 'clamp(20px,2.4vw,28px)', fontWeight: 800, color: theme.price, letterSpacing: '-0.01em' }}>{p.price}</p>
              </div>
            </motion.button>
          )
        })}
        <div style={{ height: 8, flexShrink: 0 }} />
      </div>

      <style>{`
        .clp-scroll::-webkit-scrollbar { display: none; }
        .clp-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        @media (max-width: 640px) {
          .clp-scroll > button { flex-direction: column !important; }
          .clp-scroll > button > div:first-child { flex: 0 0 auto !important; width: 100% !important; min-height: 140px !important; }
        }
      `}</style>
    </div>
  )
}

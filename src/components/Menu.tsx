import { useState } from 'react'
import { motion } from 'framer-motion'

type SectionId = 'hot' | 'cold' | 'dessert' | 'shisha'

interface MenuItem {
  name: string
  price: string
  desc: string
}

interface Section {
  id: SectionId
  label: string
  icon: string
  gradient: string
  border: string
  textColor: string
  glowColor: string
  items: MenuItem[]
  parts: { ch: string; c: string; x: string; y: string }[]
}

const SECTIONS: Section[] = [
  {
    id: 'hot',
    label: 'Hot Drinks',
    icon: '☕',
    gradient: 'linear-gradient(135deg,#dc2626,#f97316)',
    border: '#991b1b',
    textColor: '#b91c1c',
    glowColor: 'rgba(220,38,38,0.4)',
    items: [
      { name: 'Espresso', price: '$3', desc: 'Rich single-origin shot' },
      { name: 'Cappuccino', price: '$4.5', desc: 'Velvety foam over espresso' },
      { name: 'Latte', price: '$4.5', desc: 'Smooth espresso with steamed milk' },
      { name: 'Turkish Coffee', price: '$3.5', desc: 'Traditional, bold & aromatic' },
    ],
    parts: [],
  },
  {
    id: 'cold',
    label: 'Cold Drinks',
    icon: '🥤',
    gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
    border: '#1d4ed8',
    textColor: '#2563eb',
    glowColor: 'rgba(59,130,246,0.4)',
    items: [
      { name: 'Iced Latte', price: '$5', desc: 'Chilled espresso with milk' },
      { name: 'Fresh Orange Juice', price: '$4', desc: 'Hand-squeezed daily' },
      { name: 'Mango Smoothie', price: '$5.5', desc: 'Fresh mango, yogurt, honey' },
      { name: 'Iced Tea', price: '$3.5', desc: 'Lemon or peach, refreshing' },
    ],
    parts: [],
  },
  {
    id: 'dessert',
    label: 'Dessert',
    icon: '🍰',
    gradient: 'linear-gradient(135deg,#3e2723,#5d4037)',
    border: '#3e2723',
    textColor: '#5d4037',
    glowColor: 'rgba(93,64,55,0.4)',
    items: [
      { name: 'Chocolate Lava Cake', price: '$6', desc: 'Warm center, vanilla ice cream' },
      { name: 'Tiramisu', price: '$5.5', desc: 'Coffee-soaked layers, mascarpone' },
      { name: 'Cheesecake', price: '$5', desc: 'New York style, berry compote' },
      { name: 'Milk Pudding', price: '$4', desc: 'Silky smooth, caramel topping' },
    ],
    parts: [],
  },
  {
    id: 'shisha',
    label: '2aragile',
    icon: '💨',
    gradient: 'linear-gradient(135deg,#facc15,#eab308)',
    border: '#a16207',
    textColor: '#ca8a04',
    glowColor: 'rgba(250,204,21,0.4)',
    items: [
      { name: 'Mint Breeze', price: '$12', desc: 'Cool refreshing mint' },
      { name: 'Double Apple', price: '$12', desc: 'Classic sweet apple blend' },
      { name: 'Blue Mist', price: '$13', desc: 'Blueberry with a icy finish' },
      { name: 'Watermelon Wave', price: '$13', desc: 'Juicy watermelon, light & sweet' },
    ],
    parts: [],
  },
]

export default function Menu({ onBack, onHotDrinks, onColdDrinks, onDesserts, onShisha }: { onBack?: () => void; onHotDrinks?: () => void; onColdDrinks?: () => void; onDesserts?: () => void; onShisha?: () => void }) {
  const [hovered, setHovered] = useState<SectionId | null>(null)

  const scrollToSection = (id: SectionId) => {
    if (id === 'hot' && onHotDrinks)    { onHotDrinks(); return }
    if (id === 'cold' && onColdDrinks)  { onColdDrinks(); return }
    if (id === 'dessert' && onDesserts) { onDesserts(); return }
    if (id === 'shisha' && onShisha)    { onShisha(); return }
  }

  return (
    <section id="menu" className="py-24 bg-stone-50 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-olive-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        )}

        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-olive-600 text-sm font-semibold tracking-[0.3em] uppercase mb-3">Café & Kitchen</p>
          <h2 className="text-4xl font-bold text-stone-800">Our Menu</h2>
          <div className="w-16 h-1 bg-olive-600 rounded-full mx-auto mt-4" />
        </div>

        {/* Shortcut buttons — compact rectangular category cards */}
        <div className="flex flex-wrap items-stretch justify-center gap-3 mb-16">
          {SECTIONS.map((sec) => (
            <motion.button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              onMouseEnter={() => setHovered(sec.id)}
              onMouseLeave={() => setHovered(null)}
              className={hovered === sec.id ? 'aglow' : ''}
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: sec.gradient,
                border: `2px solid ${sec.border}`,
                borderRadius: '14px',
                padding: '14px 20px',
                minHeight: '72px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                flex: '1 1 130px',
                maxWidth: '180px',
                boxShadow: hovered === sec.id
                  ? `0 0 30px ${sec.glowColor}, 0 8px 30px rgba(0,0,0,.55)`
                  : '0 4px 22px rgba(0,0,0,.45)',
                '--gc': sec.glowColor,
              } as React.CSSProperties}
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {sec.parts.map((p, i) => (
                <span key={i} className={p.c} style={{ left: p.x, bottom: p.y }}>
                  {p.ch}
                </span>
              ))}
              {sec.id === 'shisha' && (
                <span className="smoke-container" aria-hidden="true">
                  <span className="smoke s1" />
                  <span className="smoke s2" />
                  <span className="smoke s3" />
                  <span className="smoke s4" />
                  <span className="smoke s5" />
                </span>
              )}
              {sec.id === 'hot' && (
                <span className="espresso-machine" aria-hidden="true">
                  <span className="em-machine">
                    <span className="em-body" />
                    <span className="em-top" />
                    <span className="em-spout" />
                    <span className="em-stream" />
                    <span className="em-cup" />
                    <span className="em-steam st-1" />
                    <span className="em-steam st-2" />
                    <span className="em-steam st-3" />
                  </span>
                </span>
              )}
              <span style={{
                fontSize: '1.8rem',
                lineHeight: 1,
                filter: `drop-shadow(0 0 10px ${sec.glowColor})`,
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {sec.id === 'cold' ? (
                  <img
                    src="/cold-drinks.png"
                    alt="Cold Drinks"
                    style={{ width: '30px', height: '46px', objectFit: 'contain' }}
                  />
                ) : sec.id === 'dessert' ? (
                  <img
                    src="/dessert.png"
                    alt="Dessert"
                    style={{ width: '46px', height: '46px', objectFit: 'contain' }}
                  />
                ) : sec.id === 'hot' ? (
                  <img
                    src="/hot-drinks.png"
                    alt="Hot Drinks"
                    style={{ width: '46px', height: '46px', objectFit: 'contain' }}
                  />
                ) : sec.id === 'shisha' ? (
                  <img
                    src="/aragile.png"
                    alt="2aragile"
                    style={{ width: '46px', height: '46px', objectFit: 'contain' }}
                  />
                ) : (
                  sec.icon
                )}
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#fff',
                letterSpacing: '1px',
                textShadow: `0 0 14px ${sec.glowColor}`,
                position: 'relative',
                zIndex: 3,
                whiteSpace: 'nowrap',
              }}>
                {sec.label}
              </span>
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  )
}

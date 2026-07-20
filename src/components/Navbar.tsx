import { useState, useEffect } from 'react';

type Route = 'home' | 'menu';

const LOGO_IMAGE = '/oliva-logo.png';

export default function Navbar({ navigate, route }: { navigate: (to: Route) => void; route: Route }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (to: Route) => {
    setMenuOpen(false);
    navigate(to);
  };

  const links: { to: Route; label: string }[] = [
    { to: 'home', label: 'Home' },
    { to: 'menu', label: 'Menu' },
    { to: 'home', label: 'Contact' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(47,44,40,0.88)' : 'rgba(47,44,40,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(220,207,182,0.18)' : '1px solid rgba(220,207,182,0.08)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between" style={{ height: '64px' }}>
        {/* Oliva logo — background-removed, original branding preserved */}
        <button
          onClick={() => go('home')}
          className="flex items-center transition-opacity hover:opacity-90"
          style={{ height: '48px' }}
          aria-label="Oliva — From Court to Cup"
        >
          <img
            src={LOGO_IMAGE}
            alt="Oliva — From Court to Cup"
            className="h-full w-auto object-contain"
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
            draggable={false}
          />
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <button
              key={`${l.to}-${i}`}
              onClick={() => go(l.to)}
              className="text-sm font-medium transition-colors"
              style={{
                color: route === l.to && l.label !== 'Contact' ? '#DCCFB6' : '#FAF9F6',
                fontFamily: "'Manrope', system-ui, sans-serif",
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#CCA478')}
              onMouseLeave={(e) => (e.currentTarget.style.color = route === l.to && l.label !== 'Contact' ? '#DCCFB6' : '#FAF9F6')}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Olive-shaped hamburger */}
        <button
          className="md:hidden noh-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            width: '52px',
            height: '38px',
            padding: '0',
            flexShrink: 0,
          }}
        >
          <span
            className="noh-burger-line"
            style={{
              width: '22px',
              height: '2px',
              background: '#FAF9F6',
              borderRadius: '2px',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="noh-burger-line"
            style={{
              width: '22px',
              height: '2px',
              background: '#FAF9F6',
              borderRadius: '2px',
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="noh-burger-line"
            style={{
              width: '22px',
              height: '2px',
              background: '#FAF9F6',
              borderRadius: '2px',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'rgba(47,44,40,0.96)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(220,207,182,0.15)',
          }}
        >
          <div className="px-4 py-3 space-y-2">
            {links.map((l, i) => (
              <button
                key={`${l.to}-${i}`}
                onClick={() => go(l.to)}
                className="block w-full text-left py-2.5 text-sm font-medium transition-colors"
                style={{
                  color: '#FAF9F6',
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#CCA478')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#FAF9F6')}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

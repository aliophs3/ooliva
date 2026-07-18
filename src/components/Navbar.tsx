import { useState, useEffect } from 'react';
import OlivaLogo from './OlivaLogo';

type Route = 'home' | 'menu';

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => go('home')} className="flex items-center hover:opacity-80 transition-opacity">
          <OlivaLogo size={48} showText={false} />
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <button
              key={`${l.to}-${i}`}
              onClick={() => go(l.to)}
              className={`text-sm font-medium transition-colors ${route === l.to && l.label !== 'Contact' ? 'text-olive-600' : 'text-stone-600 hover:text-olive-600'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-stone-100">
          <div className="px-4 py-3 space-y-2">
            {links.map((l, i) => (
              <button key={`${l.to}-${i}`} onClick={() => go(l.to)} className="block w-full text-left py-2 text-sm font-medium text-stone-600 hover:text-olive-600">{l.label}</button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

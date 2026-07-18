import { useEffect, useState } from 'react';
import OlivaLogo from './OlivaLogo';

interface LoadingIntroProps {
  onComplete: () => void;
}

export default function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const [phase, setPhase] = useState<'loading' | 'fadeout'>('loading');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fadeout'), 1800);
    const t2 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-600 ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: '600ms' }}
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning green arc */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="absolute"
          style={{ animation: 'spin-arc 1.4s ease-in-out forwards' }}
        >
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="#e8f0e7"
            strokeWidth="4"
          />
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="#4a6741"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="515"
            strokeDashoffset="515"
            style={{
              transformOrigin: '90px 90px',
              transform: 'rotate(-90deg)',
              animation: 'draw-circle 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
        </svg>

        {/* Logo fades in */}
        <div
          style={{
            animation: 'fade-in-logo 0.6s ease-out 0.5s both',
          }}
        >
          <OlivaLogo size={120} />
        </div>
      </div>
    </div>
  );
}

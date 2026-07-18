import { motion } from 'framer-motion';

export default function GlassyMenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="afloat"
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg,#1b5e20,#2e7d32,#0f3d13)',
        color: '#fff',
        border: '2px solid rgba(201,229,155,0.55)',
        borderRadius: '50px',
        padding: '26px 64px',
        fontSize: '30px',
        fontWeight: 800,
        fontFamily: 'system-ui,-apple-system,sans-serif',
        letterSpacing: '2px',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: '0 10px 35px rgba(15,61,19,.65)',
        textShadow: '0 1px 3px rgba(0,0,0,.35)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        '--gc': 'rgba(20,83,32,.75)',
      } as React.CSSProperties}
      whileHover={{
        scale: 1.07,
        rotate: 2,
        y: -4,
        boxShadow: '0 10px 35px rgba(76,102,35,.65)',
      }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 360, damping: 14 }}
    >
      <span className="shine-bar" />
      <span className="ej" style={{ fontSize: '1.4rem', lineHeight: 1 }}>🍵</span>
      <span style={{ position: 'relative', zIndex: 3 }}>view menu</span>
    </motion.button>
  );
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: { 50:'#f5f7f0',100:'#e8ecd9',200:'#d1dab4',300:'#b5c49a',400:'#8fa672',500:'#6b8950',600:'#4a6741',700:'#3a5232',800:'#2d3f26',900:'#1f2b18' },
        sand: { 50:'#fdfbf7',100:'#f9f3e8',200:'#f0e6d0',300:'#e4d4b0',400:'#d4be8e',500:'#c2a76d' },
        terracotta: { 400:'#d4926a',500:'#c47a4f',600:'#a8623a' },
        cream: '#f6f1e7',
      },
      animation: { 'fade-up': 'fadeUp 0.8s ease-out forwards', float: 'float 6s ease-in-out infinite' },
      keyframes: {
        fadeUp: { '0%': { opacity:'0', transform:'translateY(30px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
      },
    },
  }, plugins: [],
};

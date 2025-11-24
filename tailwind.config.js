/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          dark: '#0c0c0f',
          darker: '#1a1a1f',
          card: '#2b2d31',
          hover: '#404249',
          purple: '#6a0dad',
          blue: '#5865F2',
          neon: '#00d4ff',
        },
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(106, 13, 173, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow': '0 0 30px rgba(106, 13, 173, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #0c0c0f 0%, #1a1a1f 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(106, 13, 173, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(106, 13, 173, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}

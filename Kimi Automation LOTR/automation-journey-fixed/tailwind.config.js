/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F4E8D8',
          dark: '#E8D5B7',
          darker: '#D9C4A5'
        },
        ink: {
          DEFAULT: '#2C1810',
          light: '#4A3426'
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#EDD190',
          dark: '#B8941F'
        },
        ember: {
          DEFAULT: '#C85A35',
          light: '#E67E5C',
          dark: '#A23D1F'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}

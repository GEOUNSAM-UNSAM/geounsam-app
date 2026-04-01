/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Principals
        identity: '#00205B',
        base:     '#EFEFEF',
        action:   '#00BCD4',
        error:    '#E02828',

        // Neutrals
        neutral: {
          'extra-dark': '#111827',
          dark:         '#808285',
          main:         '#A7A9AC',
          light:        '#E1E2E1',
          white:        '#FDFFFF',
        },

        // Status
        status: {
          red:    '#E02828',
          green:  '#7FD9AE',
          yellow: '#FFD98A',
          blue:   '#B2E0FF',
        },

        // State
        state: {
          neutral: '#F2F2F2',
          green:   '#E4F9EF',
          yellow:  '#FFF3D6',
          red:     '#FFE5E5',
          blue:    '#E6F3FD',
          purple:  '#DFD4FF',
          dark:    '#00036A',
        },

        // Data palettes
        'data-blue': {
          50:  '#F4F9FF',
          100: '#E8F0F7',
          200: '#E6F3FD',
          300: '#D6DDF6',
          500: '#4380B8',
        },
        'data-orange': {
          50:  '#FFF6E8',
          100: '#FFE6B8',
          500: '#FFAD66',
          700: '#AD7100',
          900: '#5C3C00',
        },
        'data-yellow': {
          200: '#FFF9C4',
        },
        'data-green': {
          50:  '#E4F9EF',
          200: '#C8F5DB',
          800: '#04724D',
        },
        'data-red': {
          50:  '#FFE5E5',
          300: '#FF9F9F',
          600: '#CC5A5A',
          900: '#5B0606',
        },
        'data-purple': {
          100: '#DFD4FF',
          500: '#C1ABFE',
          900: '#00036A',
        },
        'data-pink': {
          400: '#F8BBD0',
        },
      },
      fontFamily: {
        saira:    ['Saira', 'sans-serif'],
        faustina: ['Faustina', 'serif'],
      },
    },
  },
  plugins: [
    function({ addComponents, theme }) {
        const getFontFamily = (key) => {
            const value = theme(key)
            return Array.isArray(value) ? value.join(', ') : value
        }

        const saira = getFontFamily('fontFamily.saira')
        const faustina = getFontFamily('fontFamily.faustina')

        addComponents({
            '.text-heading-xl':    { fontSize: '1.75rem', lineHeight: '2.5rem',   fontFamily: saira },
            '.text-heading-l':     { fontSize: '1.375rem', lineHeight: '2rem',    fontFamily: saira },
            '.text-title-m':       { fontSize: '1.125rem', lineHeight: '2rem',    fontFamily: saira },
            '.text-body-m':        { fontSize: '1rem',     lineHeight: '1.5rem',  fontFamily: saira },
            '.text-body-m-serif':  { fontSize: '1rem',     lineHeight: '1.5rem',  fontFamily: faustina },
            '.text-body-s':        { fontSize: '0.875rem', lineHeight: '1rem',    fontFamily: saira },
            '.text-label-caption': { fontSize: '0.75rem',  lineHeight: '0.75rem', fontFamily: saira },
        })
    },
  ],
}

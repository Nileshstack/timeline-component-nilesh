/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          700: '#3f3f46',
          900: '#18181b',
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        xl: '0.75rem',
      },
      boxShadow: {
        card: '0 6px 14px rgba(15, 23, 42, 0.06)',
        'card-strong': '0 12px 30px rgba(15, 23, 42, 0.08)',
        modal: '0 20px 40px rgba(2,6,23,0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(14,165,233,0.18)',
          borderRadius: '0.5rem',
        },
      })
    }
  ],
};

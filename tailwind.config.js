/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'Georgia', 'Baskerville', 'serif'],
        display: ['"Times New Roman"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      colors: {
        navy: {
          50: '#F4F7FB',
          100: '#E6EDF6',
          200: '#C7D7EC',
          300: '#9AB9DC',
          400: '#6494C7',
          500: '#3D73B2',
          600: '#2C5A93',
          700: '#1F4372',
          800: '#132B4C',
          900: '#0B172A',
          950: '#060D18',
        },
        brand: {
          primary: '#0B172A',     // Deep Enterprise Navy
          secondary: '#1E293B',   // Deep Slate Navy
          sapphire: '#1D4ED8',    // International Enterprise Blue
          electric: '#2563EB',    // Vibrant Royal Blue
          indigo: '#4F46E5',      // Royal Indigo
          purple: '#7C3AED',      // Sovereign Purple Accent
          violet: '#8B5CF6',      // Elegant Purple Glow
          teal: '#0D9488',        // Secure Verification Teal
          border: '#E2E8F0',      // Crisp Institutional Border
          surface: '#F8FAFC',     // Light Premium Background
        }
      },
      backgroundImage: {
        'enterprise-gradient': 'linear-gradient(135deg, #0B172A 0%, #172554 50%, #1E1B4B 100%)',
        'subtle-pattern': 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.04) 0%, transparent 60%)',
        'hero-glow': 'radial-gradient(800px circle at 50% 20%, rgba(37, 99, 235, 0.08), transparent 40%)',
      },
      boxShadow: {
        'enterprise': '0 4px 20px -2px rgba(11, 23, 42, 0.06), 0 2px 6px -1px rgba(11, 23, 42, 0.04)',
        'enterprise-lg': '0 20px 40px -15px rgba(11, 23, 42, 0.1), 0 0 0 1px rgba(11, 23, 42, 0.05)',
        'enterprise-xl': '0 25px 60px -15px rgba(11, 23, 42, 0.18)',
        'glow-purple': '0 0 30px -5px rgba(124, 58, 237, 0.25)',
        'glow-sapphire': '0 0 30px -5px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Awaaj Brand Colors - Voice of the People Theme
        awaaj: {
          primary: '#FF6B35',      // Vibrant Orange - Voice & Energy
          secondary: '#004E89',    // Deep Blue - Trust & Authority
          accent: '#F7931E',       // Warm Gold - Hope & Change
          success: '#10B981',      // Green - Progress
          danger: '#EF4444',       // Red - Urgency
          warning: '#F59E0B',      // Amber - Attention
          dark: '#1A1F2E',         // Deep Navy - Depth
          light: '#F8FAFC',        // Soft White - Clarity
          muted: '#64748B',        // Gray - Balance
        },
        background: '#FAFBFC',
        'dark-background': '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 53, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.8)' },
        },
      },
      boxShadow: {
        'awaaj': '0 10px 40px rgba(255, 107, 53, 0.15)',
        'awaaj-lg': '0 20px 60px rgba(255, 107, 53, 0.25)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 107, 53, 0.1)',
      },
      backgroundImage: {
        'gradient-awaaj': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
        'gradient-trust': 'linear-gradient(135deg, #004E89 0%, #1A8FE3 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    }
  },
  plugins: [],
}


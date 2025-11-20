/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      boxShadow: {
        brand: '0 10px 50px rgba(79, 70, 229, 0.25)'
      },
      colors: {
        brand: '#6366f1',
        midnight: '#0f172a'
      },
      backgroundImage: {
        'grid-light': 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0)' ,
        'grid-dark': 'radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.25) 1px, transparent 0)' 
      }
    }
  },
  plugins: [],
};

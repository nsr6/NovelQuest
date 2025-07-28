import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#fefbf1',
        'leather-brown': '#8c5a3a',
        'dark-wood': '#4a3f35',
        'gold-leaf': '#d4af37',
        'aged-paper': '#e8e0c4',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'bookshelf': "url('/bookshelf-bg.jpg')",
      },
    },
  },
  plugins: [],
};

export default config; 
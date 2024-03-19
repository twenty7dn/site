import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'sans': ['Lato', 'system-ui', 'sans-serif'],
      'serif': ['Poly', 'Georgia', 'serif'],
    },
    extend: {
      screens: {
        '1.5xl': '1152px',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.stone.950'),
            a: {
              color: theme('colors.stone.950'),
              '&:hover': {
                color: theme('colors.stone.950'),
              },
            },
            h1: {
              color: theme('colors.stone.950'),
            },
            h2: {
              color: theme('colors.stone.950'),
            },
            h3: {
              color: theme('colors.stone.950'),
            },
            h4: {
              color: theme('colors.stone.950'),
            },
            h5: {
              color: theme('colors.stone.950'),
            },
            h6: {
              color: theme('colors.stone.950'),
            },
          },
        },
      }),
      aspectRatio: {
        'none': 'unset',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'bright-sun': {
          '50': '#fffdeb',
          '100': '#fdf7c8',
          '200': '#fcee8b',
          '300': '#fae04f',
          '400': '#f9d236',
          '500': '#f2af0e',
          '600': '#d78708',
          '700': '#b2600b',
          '800': '#904a10',
          '900': '#773d10',
          '950': '#441f04',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
}
export default config

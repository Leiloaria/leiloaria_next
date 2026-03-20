/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#635EF2', // color-theme_undraw_money-received_eg1c-2
        secondary: '#F2A2A9', // color-theme_undraw_money-received_eg1c-1
        dark: '#05050D', // color-theme_undraw_money-received_eg1c-3
        accent: '#414059', // color-theme_undraw_money-received_eg1c-4
        light: '#F2F2F2', // color-theme_undraw_money-received_eg1c-5
      },
    },
  },
  plugins: [],
};

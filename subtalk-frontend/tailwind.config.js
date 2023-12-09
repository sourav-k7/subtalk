/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor:{
        'body':'#3E505B',
        'body-light':'#696E76',
      },
      colors:{
        'primary':'#0B4F6C',
        'primary-medium':'#434A54',
        'primary-light':'#ECF8FD',
        'seconday':'#26A96C',
        'warning-dark':'#FF5D05',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}


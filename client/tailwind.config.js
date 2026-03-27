/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        Primary : "#7037AD",
        Secondary : "#5904B4"
      },
      fontFamily : {
      poppins : ["Poppins", "sans-serif"],
      dmSerif : ["DM Serif", 'serif']
      },
      screens : {
        "card-fix" : "640px",
        "xs" : "480px",
        "xss" : "425px",
        "xsss" : "370px"
      },
    },
  },
  plugins: [daisyui],
  daisyui : {
     themes: [
      "light",
      "dark",
      "cupcake",
      "retro",
      "coffee",
      "forest"
    ]
  }
}


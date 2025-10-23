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
      
      },
      screens : {
        "card-fix" : "690px",
        "xs" : "480px",
        "xss" : "425px"
      },
    },
  },
  plugins: [daisyui],
  daisyui : {
     themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      
    ],
  }
}


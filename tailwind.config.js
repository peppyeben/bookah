/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/*.html",
    "./src/*.js",
    "./src/*.vue",
    "./src/components/*.vue",
    "./src/views/*.vue",
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {},
    screens: {
      sm: "400px",
      md: "700px",
      lg: "960px",
    }
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}

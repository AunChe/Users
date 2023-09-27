const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
   specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
  //  baseUrl:"http://intproj22.sit.kmutt.ac.th/sj3/",
  baseUrl:"http://127.0.0.1:5173",
   experimentalSessionAndOrigin: true
  },
});


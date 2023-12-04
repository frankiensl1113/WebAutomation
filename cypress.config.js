const { defineConfig } = require("cypress");

module.exports = defineConfig({
   chromeWebSecurity: false,

  e2e: {
    experimentalSkipDomainInjection: [
      '*.amazon.com',
      '*.ebay.com',
      '*.google.com',
    ],
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
              log(message) {
                console.log(message)

                return null
              },
              testIsolation: false,
            })
    },
  },
});

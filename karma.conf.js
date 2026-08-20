// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    // kjhtml renders results into the page DOM, which only exists for interactive/watch runs;
    // it throws in headless/CI single-run mode where there is no live page to attach to.
    reporters: process.env.CI ? ['progress'] : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      // imagesEnabled=false: components render real <img src="assets/..."> elements in tests.
      // The old webpack-dev-middleware bundled with this Angular CLI version crashes on the
      // Range headers modern headless Chrome sends for image loads, so image loading is
      // disabled outright rather than served.
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--blink-settings=imagesEnabled=false'
        ]
      }
    },
    browsers: ['Chrome'],
    singleRun: false
  });
};

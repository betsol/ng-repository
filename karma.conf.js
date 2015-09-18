module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'expect'],
    files: [
      // Third-party dependencies
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/betsol-ng-networking/dist/betsol-ng-networking.js',

      // Module files
      'dist/betsol-ng-repository.js',

      // Tests
      'test/**/test-*.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox'],
    singleRun: true
  });
};

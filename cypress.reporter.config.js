module.exports = {
  reporterEnabled: "spec,junit",
  specReporterOptions: {
    showPassed: true,
  },
  junitReporterOptions: {
    mochaFile: "docs/cypress/junit/results-[hash].xml",
    toConsole: false,
  },
};

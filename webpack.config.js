module.exports = {
  devtool: "(none)",
  mode: "development",
  watch: true,
  entry: {
    debug: "./debug/index.js"
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js"
  }
};

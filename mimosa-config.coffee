exports.config =
  modules: ["jshint"]
  watch:
    sourceDir: "src"
    compiledDir: "lib"
    javascriptDir: null
    exclude: [/[/\\](\.|~)[^/\\]+$/, /\/resources\//]
  jshint:
    rules:
      node: true
      laxcomma: true
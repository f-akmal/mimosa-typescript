exports.config =
  modules: ["jshint", "copy"]
  watch:
    sourceDir: "src"
    compiledDir: "lib"
    javascriptDir: null
    exclude: [/[/\\](\.|~)[^/\\]+$/, /\/resources\//]
  jshint:
    rules:
      node: true
      laxcomma: true
mimosa-typescript
===========

## Overview

This is a Typescript compiler for the Mimosa build tool.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'typescript'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile Typescript files during `mimosa watch` and `mimosa build`.

## Default Config

```javascript
typescript: {
  extensions: ["ts"],
  compileVendorDefinitionFiles: false,
  sourceMapDynamic: true,
  sourceMapExclude: [/\/specs?\//, /_spec.js$/],
  sourceMapConditional: false,
  options: {
    codeGenTarget: 1,
    moduleGenTarget: 2,
    mapSourceFiles: true
  }
}
```

* `extensions` an array of strings, the extensions of your Tyepscript files.
* `compileVendorDefinitionFiles`: a boolean, whether or not you want the typescript compiler to compile vendor `.d.ts` files.  Uses `vendor` configuration and the `.d.ts` extension to make determination if file is vendor file. Not compiling vendor definition files can save quite a bit of compile time.  NOTE: To use this feature you need to have Mimosa `2.3.8+` installed.
* `sourceMapDynamic`: a boolean, whether or not to use [Dynamic source maps](http://fitzgeraldnick.com/weblog/46/). Dynamic source maps require no extra network hops to retrieve the original source or the map files.  They are also a necessity for tools like browserify.
* `sourceMapExclude`: an array of strings and regexes. A list of files or patterns matching files to exclude from source map generation. Strings are paths and can be either absolute or relative to `config.watch.javascriptDir`.
* `sourceMapConditional`: a boolean, whether or not to use conditional source maps. See [this thread](https://groups.google.com/d/topic/mozilla.dev.js-sourcemap/4uo7Z5nTfUY/discussion) for details.
* `options.codeGenTarget`: a number, ECMAScript version code is compiled to: 0 = ES3, 1 = ES5
* `options.moduleGenTarget`: a number, How the compiled output is wrapped: 0 = None, 1 = commonjs, 2 = AMD
* `options.mapSourceFiles`: a boolean, whether or not to generate source maps. Source maps are automatically disabled for `mimosa build`.

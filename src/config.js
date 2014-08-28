"use strict";

exports.defaults = function() {
  return {
    typescript: {
      compileVendorDefinitionFiles: false,
      extensions: ["ts"],
      sourceMapDynamic: true,
      sourceMapExclude: [/\/specs?\//, /_spec.js$/],
      sourceMapConditional: false,
      options: {
        codeGenTarget: 1, // EcmaScript 5
        moduleGenTarget: 2, // amd
        mapSourceFiles: true
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  typescript:                    # config settings for the TypeScript compiler module\n" +
         "    compileVendorDefinitionFiles: # whether or not to compile vendor .d.ts files\n" +
         "                                 # requires v2.3.8 of mimosa to work\n" +
         "    extensions: [\"ts\"]         # default extensions for TypeScript files\n" +
         "    sourceMapDynamic: true       # whether or not to inline the source maps in the compiled JavaScript\n" +
         "    sourceMapExclude: [/\\/specs?\\//, /_spec.js$/] # files to exclude from source map generation\n" +
         "    sourceMapConditional: false  # whether or not to use conditional source maps\n" +
         "    options:                     # options for the typescript compiler\n" +
         "      codeGenTarget: 1           # ECMAScript version code is compiled to\n" +
         "                                 # 0 = ES3, 1 = ES5\n" +
         "      moduleGenTarget: 2         # How the compiled output is wrapped\n" +
         "                                 # 0 = None, 1 = commonjs, 2 = AMD\n" +
         "      mapSourceFiles: true       # whether or not to generate source maps\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.isObject( errors, "typescript config", config.typescript ) ) {

    if ( validators.isArrayOfStringsMustExist( errors, "typescript.extensions", config.typescript.extensions ) ) {
      if (config.typescript.extensions.length === 0) {
        errors.push( "typescript.extensions cannot be an empty array");
      }
    }

    validators.ifExistsIsBoolean( errors, "typescript.compileVendorDefinitionFiles", config.typescript.compileVendorDefinitionFiles );

    if ( validators.isObject( errors, "typescript config", config.typescript.options ) ) {
      var opts = config.typescript.options;
      if ( validators.isNumber( errors, "typescript.options.codeGenTarget", opts.codeGenTarget ) ) {
        if ( [0,1].indexOf( opts.codeGenTarget ) === -1 ) {
          errors.push( "typescript.options.codeGenTarget must be 0 (ES3) or 1 (ES5)" );
        }
      }
      if ( validators.isNumber( errors, "typescript.options.moduleGenTarget", opts.moduleGenTarget ) ) {
        if ( [0,1,2].indexOf( opts.moduleGenTarget ) === -1 ) {
          errors.push( "typescript.options.moduleGenTarget must be 0 (No Modules), 1 (CommonJS) or 2 (AMD)" );
        }
      }

      validators.ifExistsIsBoolean( errors, "typescript.options.mapSourceFiles", opts.mapSourceFiles );

    if ( config.isBuild ) {
      config.typescript.options.mapSourceFiles = false;
    } else {
      validators.ifExistsIsBoolean( errors, "typescript.sourceMapConditional", config.typescript.sourceMapConditional );

      if ( validators.ifExistsIsBoolean( errors, "typescript.sourceMapDynamic", config.typescript.sourceMapDynamic ) ) {
        if (config.isWatch && config.isMinify && config.typescript.sourceMapDynamic ) {
          config.typescript.sourceMapDynamic = false;
          config.log.debug( "mimosa watch called with minify, setting typescript.sourceMapDynamic to false to preserve source maps." );
        }
      }

      validators.ifExistsFileExcludeWithRegexAndStringWithField(
        errors,
        "typescript.sourceMapExclude",
        config.typescript,
        "sourceMapExclude",
        config.watch.javascriptDir );
      }
    }

  }



  return errors;
};

"use strict";

exports.defaults = function() {
  return {
    typescript: {
      extensions: ["ts"],
      options: {
        codeGenTarget: 1, // EcmaScript 5
        moduleGenTarget: 2 // amd
      }
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n" +
         "  typescript:                  # config settings for the TypeScript compiler module\n" +
         "    extensions: [\"ts\"]         # default extensions for TypeScript files\n" +
         "    options:                   # options for the typescript compiler\n" +
         "      codeGenTarget: 1         # ECMAScript version code is compiled to\n" +
         "                               # 0 = ES3, 1 = ES5\n" +
         "      moduleGenTarget: 2       # How the compiled output is wrapped\n" +
         "                               # 0 = None, 1 = commonjs, 2 = AMD\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.isObject( errors, "typescript config", config.typescript ) ) {

    if ( validators.isArrayOfStringsMustExist( errors, "typescript.extensions", config.typescript.extensions ) ) {
      if (config.typescript.extensions.length === 0) {
        errors.push( "typescript.extensions cannot be an empty array");
      }
    }

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

    }

  }

  return errors;
};

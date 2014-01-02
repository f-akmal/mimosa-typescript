"use strict";

exports.defaults = function() {
  return {
    typescript: {
      extensions: ["ts"],
      module: null
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n"+
         "  # typescript:              # config settings for the TypeScript compiler module\n" +
         "    # extensions: [\"ts\"]     # default extensions for TypeScript files\n" +
         "    # module: null           # how compiled tyepscript is wrapped, defaults to no wrapping,\n" +
         "                             # can be \"amd\" or \"commonjs\"\n";
};

exports.validate = function( config, validators ) {
  var errors = [];

  if ( validators.ifExistsIsObject( errors, "typescript config", config.typescript ) ) {

    validators.ifExistsIsString( errors, "typescript.module", config.typescript.module );

    if ( validators.isArrayOfStringsMustExist( errors, "typescript.extensions", config.typescript.extensions ) ) {
      if (config.typescript.extensions.length === 0) {
        errors.push( "typescript.extensions cannot be an empty array");
      }
    }

  }

  return errors;
};

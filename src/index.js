"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , config = require( "./config" )
  , ts
  , libSnapshot
  , lib
  , settings
  , scriptDetect
  , getExtensions = function ( mimosaConfig ) {
    return mimosaConfig.typescript.extensions;
  };

var _tsSettings = function( tsOptions ) {
  var st = new ts.CompilationSettings();

  st.codeGenTarget = tsOptions.codeGenTarget;
  st.moduleGenTarget = tsOptions.moduleGenTarget;
  st.gatherDiagnostics = true;
  return ts.ImmutableCompilationSettings.fromCompilationSettings( st );
};

var _setup = function( tsOptions ) {
  ts = require( "typescript-api" );
  scriptDetect = new RegExp( ts.tripleSlashReferenceRegExp.source, "gm" );
  settings = _tsSettings( tsOptions );
  lib = path.resolve( require.resolve( "typescript" ), "../lib.d.ts" );
  libSnapshot = ts.ScriptSnapshot.fromString( fs.readFileSync( lib, "utf-8" ) );
};

var _compileTs = function ( file, data ) {
  var compiler = new ts.TypeScriptCompiler( new ts.NullLogger(), settings );
  compiler.addFile( lib, libSnapshot );

  data.replace( scriptDetect, function(match, p1, p2, filename) {
    var fullFilePath = path.join( path.dirname( file) , filename );
    var text = fs.readFileSync( fullFilePath ).toString();
    var importSnap = ts.ScriptSnapshot.fromString( text );
    compiler.addFile( filename, importSnap );
  });

  var snapshot = ts.ScriptSnapshot.fromString( data );
  compiler.addFile( file, snapshot );

  var it = compiler.compile()
    , result
    , current
    , error
    , output;

  while (it.moveNext()) {
    result = it.current();

    for (var i = 0; i < result.diagnostics.length; i++) {
      var diagnostic = result.diagnostics[i];
      if ( !error ) {
        error = "";
      }
      error += diagnostic.fileName() + ": " + diagnostic.line() + ": " + diagnostic.character() + ": " + diagnostic.message();
      var badLine = data.split( "\n" )[diagnostic.line()];
      error += "\n" + badLine + "\n";
      error += new Array( diagnostic.character() + 1 ).join( " " ) + "^\n\n";
    }

    for (var k = 0; k < result.outputFiles.length; k++) {
      current = result.outputFiles[k];
      if (!current) {
        continue;
      }
      if ( !output ) {
        output = "";
      }
      output += current.text;
    }
  }

  return {
    error: error,
    text: output
  };
};

var compile = function ( mimosaConfig, file, cb ) {
  if ( !ts ) {
    _setup( mimosaConfig.typescript.options );
  }

  var result = _compileTs( file.inputFileName, file.inputFileText );
  cb( result.error, result.text );
};

module.exports = {
  name: "typescript",
  compilerType: "javascript",
  compile: compile,
  extensions: getExtensions,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};

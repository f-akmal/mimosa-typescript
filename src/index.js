"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , logger = require( "logmimosa" )
  , config = require( './config' )
  , io = null
  , TypeScript = null
  , compilationSettings = null
  , defaultLibPath = null
  , getExtensions = function ( mimosaConfig ) {
    return mimosaConfig.typescript.extensions;
  };

var _setupTypeScript = function ( mimosaConfig ) {
  io = require( "./resources/io" );
  TypeScript = require( "./resources/typescript" );
  defaultLibPath = path.join( __dirname, "resources", "lib.d.ts" );

  compilationSettings = new TypeScript.CompilationSettings();
  compilationSettings.codeGenTarget = TypeScript.CodeGenTarget.ES5;
  compilationSettings.errorRecovery = true;

  if ( mimosaConfig.typescript && mimosaConfig.typescript.module ) {
    if ( mimosaConfig.typescript.module === "commonjs" ) {
      TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Synchronous;
    } else {
      if ( mimosaConfig.typescript.module === "amd" ) {
        TypeScript.moduleGenTarget = TypeScript.ModuleGenTarget.Asynchronous;
      }
    }
  }
};

var compile = function ( mimosaConfig, file, cb ) {
  var error
    , outText = ""
    , errorMessage = ""
    , resolvedPaths = {};

  if (!TypeScript) {
    _setupTypeScript( mimosaConfig );
  }

  var targetJsFile = file.outputFileName.replace( mimosaConfig.watch.compiledDir, mimosaConfig.watch.sourceDir );
  targetJsFile = io.resolvePath( targetJsFile );
  targetJsFile = TypeScript.switchToForwardSlashes( targetJsFile );

  var emitterIOHost = {
    createFile: function ( fileName, useUTF8 ) {
      if ( fileName === targetJsFile ) {
        return {
          Write: function (str) {
            outText += str;
          },
          WriteLine: function (str) {
            outText += str + '\r\n';
          } ,
          Close: function(){}
        };
      } else {
        return {
          Write: function ( str ) {},
          WriteLine: function ( str ) {},
          Close: function () {}
        };
      }
    },
    directoryExists: io.directoryExists,
    fileExists: io.fileExists,
    resolvePath: io.resolvePath
  };

  var stderr = {
    Write: function ( str ) { errorMessage += str; },
    WriteLine: function ( str ) { errorMessage += str + '\r\n'; },
    Close: function ( str ) {}
  };

  var preEnv = new TypeScript.CompilationEnvironment( compilationSettings, io );
  var resolver = new TypeScript.CodeResolver( preEnv );
  var resolvedEnv = new TypeScript.CompilationEnvironment( compilationSettings, io );
  var compiler = new TypeScript.TypeScriptCompiler( stderr, new TypeScript.NullLogger(), compilationSettings );
  compiler.setErrorOutput( stderr );

  if ( compilationSettings.errorRecovery ) {
    compiler.parser.setErrorRecovery( stderr );
  }

  var resolutionDispatcher = {
    postResolutionError: function ( errorFile, line, col, errorMessage ) {
      stderr.WriteLine( errorFile + "(" + line + "," + col + ") " + ( errorMessage === "" ? "" : ": " + errorMessage ) );
    },
    postResolution: function ( path, code ) {
      if ( !resolvedPaths[path] ) {
        resolvedEnv.code.push( code );
        resolvedPaths[path] = true;
      }
    }
  };

  preEnv.code.push( new TypeScript.SourceUnit( defaultLibPath, null ) );
  preEnv.code.push( new TypeScript.SourceUnit( file.inputFileName, null ) );
  preEnv.code.forEach( function ( code ) {
    var path = TypeScript.switchToForwardSlashes( io.resolvePath( code.path ) );
    resolver.resolveCode( path, "", false, resolutionDispatcher );
  });

  resolvedEnv.code.forEach( function ( code ) {
    if (code.content !== null) {
      compiler.addUnit( code.content, code.path, false, code.referencedFiles );
    }
  });

  try {
    compiler.typeCheck();
    compiler.emit( emitterIOHost, function ( unitIndex, outFile ) {
      preEnv.inputOutputMap[unitIndex] = outFile;
    });
  } catch ( err ) {
    compiler.errorReporter.hasErrors = true;
  }

  if ( errorMessage.length > 0 ) {
    error = new Error( errorMessage );
  } else {
    error = null;
  }

  if ( /.d.ts$/.test( file.inputFileName ) && outText === "" ) {
    outText = undefined;
    if ( !error ) {
      logger.success( "Compiled [[ " + file.inputFileName + " ]]" );
    }
  }

  cb( error, outText );
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
/// <reference path="../typings/typescript/typescript.d.ts" />
/// <reference path="../typings/node/node.d.ts" />

"use strict";

var fs = require( "fs" )
  , path = require( "path" )
  , config = require( "./config" )
  , getExtensions = function ( mimosaConfig ) {
    return mimosaConfig.typescript.extensions;
  };

var compile = function(mimosaConfig, file, cb){
	if (file.isVendor){return cb();}
	
	var ts = require('typescript');
	var outputs = {};
	var options = mimosaConfig.typescript.options;
	
	var compilerOptions = { 
		noEmitOnError: true,
		noImplicitAny: true,
		target: options.codeGenTarget,
		module: options.moduleGenTarget,
	};
	
	var host = ts.createCompilerHost(compilerOptions);
	host.writeFile = function (name, text, writeByteOrderMark) {
    outputs = text;
  	};
	
	var program = ts.createProgram([file.inputFileName], compilerOptions, host);
	var emitResult = program.emit();
	
	var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
	
	var errors = allDiagnostics.map(function(diagnostic){
		var lineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
		var line = lineAndCharacter.line + 1;
		var character = lineAndCharacter.character + 1;
//		var fName = path.basename(file.inputFileName);
		return '(' + line + ',' + character + '): TS' + diagnostic.code + ': ' + diagnostic.messageText + '\n';
//		return diagnostic.messageText + '\n';
	});
	
	if (errors.length) {
		cb(errors);
	} else {
		cb(undefined, outputs);
	}
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

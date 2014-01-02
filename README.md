mimosa-typescript
===========

## Overview

This is a Typescript compiler for the Mimosa build tool. This module is for use with Mimosa `2.0+`.  This replicates the functionality of the Typescript compiler that was built into Mimosa before `2.0`.

For more information regarding Mimosa, see http://mimosa.io

## Usage

Add `'typescript'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

This module will compile Typescript files during `mimosa watch` and `mimosa build`.  It provides the ability to choose your wrapper type, for instance, commonjs or AMD.

## Default Config

```coffeescript
typescript:
  extensions: ["ts"]
  module: null
```

* `extensions`: an array of strings, the extensions of your Tyepscript files.
* `module`: a string, how compiled Tyepscript is wrapped, defaults to no wrapping, can be `amd` or `commonjs`.
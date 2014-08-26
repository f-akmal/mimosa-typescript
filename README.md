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

```coffeescript
typescript:
  extensions: ["ts"]
```

* `extensions`: an array of strings, the extensions of your Tyepscript files.

# overscore
Underscore lightweight replacement (not all functions, BTW).

[![Build Status](https://travis-ci.org/jesusr/overscore.svg?branch=master)](https://travis-ci.org/jesusr/overscore)

## Getting Started

Hands on, run: 

```bash
npm run compile:minimal
```

or 

```bash
npm run compile:complete
```

The compilation is driven by npm scripts, so **npm run compile:minimal** will generate a ~7KB file named _overscore.es5.minimal.js_ with its respective sourcemap. This version is trully minified and with jQuery like external library in order to minify the weight of the library. You should choose this option if you have jQuery like global variable in your project.

In the other hand, you have **npm run compile:complete** that will generate a ~288KB file name _overscore.es5.complete.js_ that includes the library and the jQuery dependency inside (~250KB for jQuery weight).

By default, the load of the module will get the complete version, but this is configurable in your compiler, requiring the file instead the complete module.

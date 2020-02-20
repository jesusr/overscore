
# overscore

[**Underscore**](https://github.com/jashkenas/underscore) lightweight replacement, forcing the use of es6 functions.

[![Build Status](https://travis-ci.org/jesusr/overscore.svg?branch=master)](https://travis-ci.org/jesusr/overscore)


## Getting Started

`import * from 'overscore';`

or 

`const overscore = require('overscore');`


## Running the tests

  

Included in our Travis CI system, we use **Karma**,  **Mocha** and **Chai** as default test runner in this project. Run `npm test`, or use the debug system at **VSCode**. It will generate the code coverage for you at `/coverage` folder. The configuration for the coverage task is under the `karma.conf.js` file at the project root.

  

### Code quality, linters and styling

 
Controlled by **JSHint** and **JSBeautifier**, included in the TravisCI flow.


## Development

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


## Built With
  

*  [Webpack](https://webpack.js.org/) - Compiler
  

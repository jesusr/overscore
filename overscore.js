/*jshint -W116 */
import $ from 'jquery';
let getLength, property, createAssigner, collectNonEnumProps, createEscaper;
const MAXthisARRAYthisINDEX = Math.pow(2, 53) - 1;

/** Class Overscore, replacement for Underscore. */
class Overscore {
  /**
   * @lends Overscore */

  /**
   * Returns true if the argument is an object, false if not an object.
   * @param {} obj - variable to be tested.
   * @return {Boolean} True of false.
   */
  static isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  /**
   * Returns true if the argument is null, false if not null.
   * @param {} o - variable to be tested.
   * @return {Boolean} True of false.
   */
  static isNull(o) {
    return o === null;
  }

  /**
   * Returns true if the argument is a function, false if not.
   * @param {} obj - variable to be tested.
   * @return {Boolean} True of false.
   */
  static isFunction(obj) {
    return typeof obj === 'function' || false;
  }

  /**
   * Returns true if the argument is undefined, false if not.
   * @param {} obj - variable to be tested.
   * @return {Boolean} True of false.
   */
  static isUndefined(obj) {
    return obj === void 0;
  }

  /**
   * Returns true if the argument is an array, false if not.
   * @param {} o - variable to be tested.
   * @return {Boolean} True of false.
   */
  static isArray(o) {
    return Array.isArray(o);
  }

  /**
   * Returns true if the object has a property 'key', false if not.
   * @param {} obj - Object to be tested.
   * @param {} key - Propery name to be test.
   * @return {Boolean} True of false.
   */
  static has(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
  }

  /**
   * Returns array result of the map 'iterator' with the function 'func' over the array 'arr'.
   * @param {Object[]} arr - Array of objects.
   * @param {} func - Function to be called with every element in the map 'iterator'.
   * @return {Object[]} Array of objects mapped results.
   */
  static map(arr, func) {
    return arr.map(func);
  }

  /**
   * Extend the prototype and the properties of the objects that are in arguments array.
   * @param {...Object} arguments - Object to be extended over the first element.
   * @return {Object} Object result.
   */
  static extend() {
    return $.extend.apply(this, arguments);
  }

  /**
   * Returns array result of the iterator with the function 'i' over the array 'arr'.
   * @param {Object[]} arr - Object to be tested.
   * @param {} i - Function to be called with every element in the map 'iterator'.
   * @return {Object[]} Array of objects result.
   */
  static each(arr, i) {
    return arr.forEach(i);
  }

  /**
   * Returns array of slices of a specified size.
   * @param {Object[]} arr - Object to be tested.
   * @param {Number} size - Size for the slices.
   * @return {Array[]} Array of Array results.
   */
  static chunk(array, size) {
    return array.reduce(function(res, item, index) {
      if (index % size === 0) { res.push([]); }
      res[res.length - 1].push(item);
      return res;
    }, []);
  }

  /**
   * Create an object with prototype and properties from two objects.
   * @param {Object} prototype - Prototype object.
   * @param {Object} props - Properties object.
   * @return {Object} Object result.
   */
  static create(prototype, props) {
    let _this = this,
      Ctor = function() {};

    function baseCreate(prototype) {
      if (!_this.isObject(prototype)) { return {}; }
      if (Object.create) { return Object.create(prototype); }
      Ctor.prototype = prototype;
      let result = new Ctor();
      Ctor.prototype = null;
      return result;
    }
    let result = baseCreate(prototype);
    if (props) { this.extendOwn(result, props); }
    return result;
  }

  /**
   * Extend only the properties of the objects that are in arguments array.
   * @param {...Object} arguments - Object to be extended over the first element.
   * @return {Object} Object result.
   */
  static extendOwn() {
    createAssigner(this.keys.bind(this)).apply(this, arguments);
  }

  /**
   * Get the keys array from an object. 
   * @param {Object} obj - Object.
   * @return {String[]} Array of the keys found.
   */
  static keys(obj) {
    let hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
      keys = [];
    if (!this.isObject(obj)) { return []; }
    if (Object.keys) { return Object.keys(obj); }
    for (var key in obj) { if (this.has(obj, key)) { keys.push(key); } }
    if (hasEnumBug) { collectNonEnumProps.call(this, obj, keys); }
    return keys;
  }

  /**
   * Boils down a list of values into a single value.
   * @param {Array} obj - Array object.
   * @param {} iteratee - Function to do in the reduction.
   * @param {number} memo - Initial state of the reduction.
   * @param {Object} context 
   * @return {} Result of the reduce.
   */
  static reduce(obj, iteratee, memo, context) {
    var keys = !this.isArrayLike(obj) && this.keys(obj),
      length = (keys || obj).length,
      index = 0;
    iteratee = this.optimizeCb(iteratee, context, 4);

    if (arguments.length < 3) {
      memo = obj[keys ? keys[index] : index];
      index += 1;
    }
    return this.iterator(obj, iteratee, memo, keys, index, length);
  }

  /**
   * Returns a (stably) sorted copy of list, ranked in ascending order by the results of running each value through iteratee. 
   * iteratee may also be the string name of the property to sort by.
   * @param {Array} obj - Array object.
   * @param {} iteratee - Function to sort by, or any field to sort by.
   * @param {Object} context 
   * @return {Array}
   */
  static sortBy(obj, iteratee, context) {
    iteratee = this.cb(iteratee, context);
    return this.pluck(this.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) { return 1; }
        if (a < b || b === void 0) { return -1; }
      }
      return left.index - right.index;
    }), 'value');
  }

  static uniqBy(arr, iteratee) {
    if (typeof iteratee === 'string') {
      let f = [];
      return arr.filter(function(n) {
        return f.indexOf(n[iteratee]) == -1 && f.push(n[iteratee]);
      });
    }
    if (typeof iteratee === 'function') {
      let f = [];
      return arr.filter(function(n) {
        return f.indexOf(iteratee(n)) == -1 && f.push(iteratee(n));
      });
    }
    return arr.filter((v, i, a) => a.indexOf(v) == i);
  }

  /**
   * A convenient version of what is perhaps the most common use-case for map: extracting a list of property values.
   * @param {Array} obj - Array object.
   * @param {string} key 
   * @return {Array}
   */
  static pluck(obj, key) {
    return this.map(obj, property(key));
  }

  static iterator(obj, iteratee, memo, keys, index, length) {
    for (; index >= 0 && index < length; index += 1) {
      var currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  }

  static optimizeCb(func, context, argCount) {
    if (context === void 0) { return func; }
    switch (argCount === null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      case 2:
        return function(value, other) {
          return func.call(context, value, other);
        };
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  static isArrayLike(collection) {
    var length = getLength(collection);
    return typeof length === 'number' && length >= 0 && length <= MAXthisARRAYthisINDEX;
  }

  static cb(value, context, argCount) {
    if (value === null) { return this.identity; }
    if (this.isFunction(value)) { return this.optimizeCb(value, context, argCount); }
    if (this.isObject(value)) { return this.matcher(value); }
    return property(value);
  }

  static template(text, settings) {
    if (!this.templateSettings) this.templateSettings = { interpolate: /\{\{(.+?)\}\}/g };
    settings = this.defaults({}, settings, this.templateSettings);
    let template, argument, escapes = {
        '\'': '\'',
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
      },
      matcher = RegExp([
        (settings.escape || /(.)^/).source,
        (settings.interpolate || /(.)^/).source,
        (settings.evaluate || /(.)^/).source
      ].join('|') + '|$', 'g'),
      index = 0,
      source = '__p+=\'';
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(/\\|'|\r|\n|\u2028|\u2029/g, function(match) {
        return '\\' + escapes[match];
      });
      index = offset + match.length;
      if (escape) {
        source += '\'+\n((__t=(' + escape + '))==null?\'\':this.escape(__t))+\n\'';
      } else if (interpolate) {
        source += '\'+\n((__t=(' + interpolate + '))==null?\'\':__t)+\n\'';
      } else if (evaluate) {
        source += '\';\n' + evaluate + '\n__p+=\'';
      }
      return match;
    });
    source += '\';\n';
    if (!settings.variable) { source = 'with(obj||{}){\n' + source + '}\n'; }
    source = 'var __t,__p=\'\',__j=Array.prototype.join,' +
      'print=function(){__p+=__j.call(arguments,"");};\n' +
      source + 'return __p;\n';
    try {
      var render = new Function(settings.variable || 'obj', source); // jshint ignore:line
    } catch (e) {
      e.source = source;
      throw e;
    }
    template = function(data) {
      return render.call(this, data);
    };
    argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';
    return template;
  }
  static defaults() {
    return createAssigner(this.allKeys.bind(this), true).apply(this, arguments);
  }
  static allKeys(obj) {
    let key, keys = [],
      hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
    if (!this.isObject(obj)) { return []; }
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    if (hasEnumBug) { collectNonEnumProps.call(this, obj, keys); }
    return keys;
  }
  static escape() {
    return createEscaper.call(this, {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '`': '&#x60;'
    }).apply(this, arguments);
  }
  static unescape() {
    return createEscaper.call(this, {
      '&#x27;': '\'',
      '&#x60;': '`',
      '&amp;': '&',
      '&gt;': '>',
      '&lt;': '<',
      '&quot;': '"',
    }).apply(this, arguments);
  }
  static result(object, property, fallback) {
    return !object ? fallback || null :
      _.isFunction(object[property]) ? object[property].call(object) : object[property];
  }
}

property = function(key) {
  return function(obj) {
    return obj === null ? void 0 : obj[key];
  };
};

createAssigner = function(keysFunc, undefinedOnly) {
  return function(obj) {
    var length = arguments.length;
    if (length < 2 || obj === null) { return obj; }
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
        keys = keysFunc(source),
        l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!undefinedOnly || obj[key] === void 0) { obj[key] = source[key]; }
      }
    }
    return obj;
  };
};

collectNonEnumProps = function(obj, keys) {
  let nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'
    ],
    nonEnumIdx = nonEnumerableProps.length,
    constructor = obj.constructor,
    proto = (this.isFunction(constructor) && constructor.prototype) || Object.prototype,
    prop = 'constructor';
  if (this.has(obj, prop) && !this.contains(keys, prop)) { keys.push(prop); }
  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !this.contains(keys, prop)) {
      keys.push(prop);
    }
  }
};

createEscaper = function(map) {
  var escaper = function(match) {
    return map[match];
  };
  var source = '(?:' + this.keys(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string === null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
};

getLength = property('length');

export default Overscore;

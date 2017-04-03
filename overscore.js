let getLength, property, createAssigner;
const MAXthisARRAYthisINDEX = Math.pow(2, 53) - 1;

export default class Overscore {

    static isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }

    static isNull(o) {
        return o === null;
    }

    static isFunction(obj) {
        return typeof obj === 'function' || false;
    }

    static isUndefined(obj) {
        return obj === void 0;
    }

    static has(obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    }

    static map(arr, func) {
        return arr.map(func);
    }

    static extend(obj1, obj2) {
        var keys = Object.keys(obj2);
        for (var i = 0; i < keys.length; i += 1) {
            var val = obj2[keys[i]];
            obj1[keys[i]] = ['string', 'number', 'array', 'boolean'].indexOf(typeof val) === -1 ? 
                this.extend(obj1[keys[i]] || {}, val) : val;
        }
        return obj1;
    }

    static each(arr, i) {
        return arr.forEach(i);
    }

    static create(prototype, props) {
        var _this = this, Ctor = function () { };
        function baseCreate(prototype) {
            if (!_this.isObject(prototype)) { return {}; }
            if (Object.create) { return Object.create(prototype); }
            Ctor.prototype = prototype;
            var result = new Ctor();
            Ctor.prototype = null;
            return result;
        }
        var result = baseCreate(prototype);
        if (props) { this.extendOwn(result, props); }
        return result;
    }

    static isArray(o) {
        return Array.isArray(o);
    }

    static extendOwn() {
        createAssigner(this.keys.bind(this)).apply(this, arguments);
    }

    static keys(obj) {
        let _this = this;
        function collectNonEnumProps(obj, keys) {
            let nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'],
                nonEnumIdx = nonEnumerableProps.length,
                constructor = obj.constructor,
                proto = (_this.isFunction(constructor) && constructor.prototype) || Object.prototype,
                prop = 'constructor';
            if (_this.has(obj, prop) && !_this.contains(keys, prop)) { keys.push(prop); }
            while (nonEnumIdx--) {
                prop = nonEnumerableProps[nonEnumIdx];
                if (prop in obj && obj[prop] !== proto[prop] && !_this.contains(keys, prop)) {
                    keys.push(prop);
                }
            }
        }
        let hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
            keys = [];
        if (!this.isObject(obj)) { return []; }
        if (Object.keys) { return Object.keys(obj); }
        for (var key in obj) { if (this.has(obj, key)) { keys.push(key); } }
        if (hasEnumBug) { collectNonEnumProps(obj, keys); }
        return keys;
    }

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

    static sortBy(obj, iteratee, context) {
        iteratee = this.cb(iteratee, context);
        return this.pluck(this.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) { return 1; }
                if (a < b || b === void 0) { return -1; }
            }
            return left.index - right.index;
        }), 'value');
    }

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
            case 1: return function (value) {
                return func.call(context, value);
            };
            case 2: return function (value, other) {
                return func.call(context, value, other);
            };
            case 3: return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
            case 4: return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
        }
        return function () {
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

}

property = function (key) {
    return function (obj) {
        return obj === null ? void 0 : obj[key];
    };
};

createAssigner = function (keysFunc, undefinedOnly) {
    return function (obj) {
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

getLength = property('length');

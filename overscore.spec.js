let chai = require('chai'),
    should, expect;
import _ from './overscore';

describe('OverScore helper', () => {
    should = chai.should();
    expect = chai.expect;
    describe('Methods', () => {
        describe('isObject', () => {
            it('Non objects has to return false', () => {
                _.isObject('string').should.be.false;
            });
            it('Objects has to return true', () => {
                _.isObject({ foo: 'bar' }).should.be.true;
            });
        });
        describe('isArray', () => {
            it('Non Array has to return false', () => {
                _.isArray('string').should.be.false;
            });
            it('Array has to return true', () => {
                _.isArray(['a', { a: 'b' }]).should.be.true;
            });
        });
        describe('isNull', () => {
            it('Not null values has to return false', () => {
                _.isNull('string').should.be.false;
            });
            it('Null values has to return true', () => {
                _.isNull(null).should.be.true;
            });
        });

        describe('isUndefined', () => {
            it('Defined values has to return false', () => {
                _.isUndefined('string').should.be.false;
            });
            it('Undefined values has to return true', () => {
                _.isUndefined().should.be.true;
            });
        });
        describe('has', () => {
            it('Object with property has to return true', () => {
                _.has({ foo: 'bar' }, 'foo').should.be.true;
            });
            it('Object without property has to return false', () => {
                _.has({ foo: 'bar' }, 'bar').should.be.false;
            });
        });
        describe('map', () => {
            var spy;
            beforeEach(() => {
                spy = sinon.spy();
            });
            it('The func passed has to be executed "n" times with "n" array length', () => {
                _.map([0, 1, 2, 3, 4], spy);
                spy.callCount.should.be.equal(5);
            });
        });
        describe('extend', () => {
            it('Extend an object with another object should return a merge of both', () => {
                _.extend({}, { foo: 'bar' }, { bar: 'foo' }).should.be.deep.equal({
                    foo: 'bar',
                    bar: 'foo'
                });
            });
        });
        describe('each', () => {
            var spy;
            beforeEach(() => {
                spy = sinon.spy();
            });
            it('The func passed has to be executed "n" times with "n" array length', () => {
                _.each([0, 1, 2, 3, 4], spy);
                spy.callCount.should.be.equal(5);
            });
        });
        describe('create', () => {
            it('Create an object with props', () => {
                var obj = _.create({ a: 'a', b: 'b' }, { foo: 'bar' });
                obj.should.be.deep.equal({ foo: 'bar', a: 'a', b: 'b' });
            });
        });
        describe('keys', () => {
            it('The object has to return an array with the keys', () => {
                var obj = {
                    a: 'a',
                    b: 'b',
                    c: 'c'
                };
                _.keys(obj).should.be.deep.equal(['a', 'b', 'c']);
            });
            it('If not an object should return clean array', () => {
                var obj = 'a';
                _.keys(obj).should.be.deep.equal([]);
            });
        });
        describe('reduce', () => {
            it('The function passed makes a simple summatory, so sum should return the total',
                () => {
                    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        sum = _.reduce(values, (memoizer, number) => {
                            return memoizer + number;
                        });
                    sum.should.be.equal(55);
                });
        });
        describe('chunk', () => {
            it('chunk reduces an array to chunks', () => {
                var chunked = _.chunk(['a', 'a', 'b', 'b', 'c'], 2);
                chunked[0].should.be.deep.equal(['a', 'a']);
                chunked[2].should.be.deep.equal(['c']);
            });
        });
        describe('create', () => {
            it('should return empty object when a non-object is provided', () => {
                let Parent = () => {};
                Parent.prototype = { foo: () => {}, bar: 2 };
                _.each(['foo', null, void 0, 1], (val) => {
                    _.create(val).should.be.deep.equal({});
                });
            });
            it('should return new instance of array when array is provided', () => {
                expect(_.create([]) instanceof Array).to.be.true;
            });

            it('object should inherit prototype', () => {
                let Parent = () => {};
                Parent.prototype = { foo: () => {}, bar: 2 };
                let Child = () => {};
                Child.prototype = _.create(Parent.prototype);
                expect(new Child() instanceof Parent).to.be.true;
            });

            it('properties should be added to object', () => {
                let Parent = () => {};
                Parent.prototype = { foo: () => {}, bar: 2 };
                let func = () => {};
                let Child = () => {};
                Child.prototype = _.create(Parent.prototype);
                Child.prototype = _.create(Parent.prototype, { func: func });
                Child.prototype.func.should.be.equal(func);
            });
        });
        describe('sortBy', () => {
            it('Should return the array ordered by function', () => {
                let values = [1, 2, 3, 4, 5, 6],
                    ret = _.sortBy(values, (num) => { return Math.sin(num); });
                ret.should.be.deep.equal([5, 4, 6, 3, 1, 2]);
            });
            it('Should return the array ordered by property name', () => {
                let stooges = [{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, {
                        name: 'curly',
                        age: 60
                    }],
                    ret = _.sortBy(stooges, 'name');
                ret.should.be.deep.equal([{ name: 'curly', age: 60 }, {
                    name: 'larry',
                    age: 50
                }, { name: 'moe', age: 40 }]);
            });
        });
        describe('uniqBy', () => {
            it('Should return the array uniq filtered by function', () => {
                _.uniqBy([2.1, 1.2, 2.3], Math.floor).should.be.deep.equal([2.1, 1.2]);
            });
            it('Should return the array uniq filtered by property name', () => {
                _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x').should.be.deep
                    .equal([{ 'x': 1 }, { 'x': 2 }]);
            });
            it('Should return the array uniq filtered by simple value', () => {
                _.uniqBy([1, 3, 4, 5, 5, 5, 2, 1, 1, 2]).should.be.deep
                    .equal([1, 3, 4, 5, 2]);
            });
        });
        describe('allKeys', () => {
            it('can extract the allKeys from an object', () => {
                _.allKeys({ one: 1, two: 2 }).should.be.deep.equal(['one', 'two']);
            });
            it('is not fooled by sparse arrays with additional properties', () => {
                let a = [];
                a[1] = 1;
                a.a = a;
                _.allKeys(a).should.be.deep.equal(['1', 'a']);
            });
        });
        describe('escape & unescape', () => {
            let escapeCharacters = ['<', '>', '"', '\'', '`'];
            _.each(escapeCharacters, (escapeChar) => {
                it(escapeChar + ' is escaped', () => {
                    let s = 'a ' + escapeChar + ' string escaped';
                    let e = _.escape(s);
                    expect(e).to.not.be.undefined;
                    s.should.not.be.equal(e);
                });
                it(escapeChar + ' is unescaped', () => {
                    let s = 'a ' + escapeChar + ' string escaped';
                    let e = _.escape(s);
                    s.should.be.equal(_.unescape(e));
                });
            });
        });
    });
});

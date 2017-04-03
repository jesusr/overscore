var chai = require('chai'), should, expect;
import _ from './overscore';

describe('OverScore helper', function () {
    should = chai.should();
    expect = chai.expect;
    describe('Methods', function () {
        describe('isObject', function () {
            it('Non objects has to return false', function () {
                _.isObject('string').should.be.false;
            });
            it('Objects has to return true', function () {
                _.isObject({ foo: 'bar' }).should.be.true;
            });
        });
        describe('isArray', function () {
            it('Non Array has to return false', function () {
                _.isArray('string').should.be.false;
            });
            it('Array has to return true', function () {
                _.isArray(['a', { a: 'b' }]).should.be.true;
            });
        });
        describe('isNull', function () {
            it('Not null values has to return false', function () {
                _.isNull('string').should.be.false;
            });
            it('Null values has to return true', function () {
                _.isNull(null).should.be.true;
            });
        });

        describe('isUndefined', function () {
            it('Defined values has to return false', function () {
                _.isUndefined('string').should.be.false;
            });
            it('Undefined values has to return true', function () {
                _.isUndefined().should.be.true;
            });
        });
        describe('has', function () {
            it('Object with property has to return true', function () {
                _.has({ foo: 'bar' }, 'foo').should.be.true;
            });
            it('Object without property has to return false', function () {
                _.has({ foo: 'bar' }, 'bar').should.be.false;
            });
        });
        describe('map', function () {
            var spy;
            beforeEach(function () {
                spy = sinon.spy();
            });
            it('The func passed has to be executed "n" times with "n" array length', function () {
                _.map([0, 1, 2, 3, 4], spy);
                spy.callCount.should.be.equal(5);
            });
        });
        describe('extend', function () {
            it('Extend an object with another object should return a merge of both', function () {
                _.extend({}, { foo: 'bar' }, { bar: 'foo' }).should.be.deep.equal({ foo: 'bar', bar: 'foo' });
            });
        });
        describe('each', function () {
            var spy;
            beforeEach(function () {
                spy = sinon.spy();
            });
            it('The func passed has to be executed "n" times with "n" array length', function () {
                _.each([0, 1, 2, 3, 4], spy);
                spy.callCount.should.be.equal(5);
            });
        });
        describe('create', function () {
            it('Create an object with props', function () {
                var obj = _.create({ a: 'a', b: 'b' }, { foo: 'bar' });
                obj.should.be.deep.equal({ foo: 'bar', a: 'a', b: 'b' });
            });
        });
        describe('keys', function () {
            it('The object has to return an array with the keys', function () {
                var obj = {
                    a: 'a',
                    b: 'b',
                    c: 'c'
                };
                _.keys(obj).should.be.deep.equal(['a', 'b', 'c']);
            });
            it('If not an object should return clean array', function () {
                var obj = 'a';
                _.keys(obj).should.be.deep.equal([]);
            });
        });
        describe('reduce', function () {
            it('The function passed makes a simple summatory, so sum should return the total', function () {
                let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    sum = _.reduce(values, function (memoizer, number) {
                        return memoizer + number;
                    });
                sum.should.be.equal(55);
            });
        });
        describe('sortBy', function () {
            it('Should return the array ordered by function', function () {
                let values = [1, 2, 3, 4, 5, 6],
                    ret = _.sortBy(values, function (num) { return Math.sin(num); });
                ret.should.be.deep.equal([5, 4, 6, 3, 1, 2]);
            });
            it('Should return the array ordered by property name', function () {
                let stooges = [{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }],
                    ret = _.sortBy(stooges, 'name');
                ret.should.be.deep.equal([{name: 'curly', age: 60}, {name: 'larry', age: 50}, {name: 'moe', age: 40}]);
            });
        });
    });
});
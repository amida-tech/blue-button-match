var expect = require('chai').expect;
var assert = require('chai').assert;

var utils = require('../lib/utils.js');

var d1 = [{"date": "2000-05-23T14:30:00.000Z"}];
var d1same = [{"date": "2000-05-23T14:30:00.000Z"}];

var d2 = [{"date": "1980-03-23T14:30:00.000Z"}];

var d3 = [{"date": "1980-02-23T14:30:00.000Z"}];

var r1 = [{"date": "2000-03-23T14:30:00.000Z"},{"date": "2000-06-23T14:30:00.000Z"}];
var r2 = [{"date": "1980-03-23T14:30:00.000Z"},{"date": "1980-06-23T14:30:00.000Z"}];

var r3 = [{"date": "1980-02-23T14:30:00.000Z"},{"date": "1980-05-23T14:30:00.000Z"}];

describe('utils.js test', function () {
    it('test dateMatch', function () {
        expect(utils.dateMatch(d1,d1same)).to.equal(true);
        expect(utils.dateMatch(d1,d2)).to.equal(false);

        expect(utils.dateMatch(r1,r1)).to.equal(true);
        expect(utils.dateMatch(r1,r2)).to.equal(false);
    });

    it('test dateFuzzyMatch 1-1', function () {
        expect(utils.dateFuzzyMatch(d1,d1same)).to.equal(true);
        expect(utils.dateFuzzyMatch(d1,d2)).to.equal(false);
    });


    it('test dateFuzzyMatch 2-2', function () {
        expect(utils.dateFuzzyMatch(r1,r1)).to.equal(true);

        expect(utils.dateFuzzyMatch(r1,r2)).to.equal(false);
        expect(utils.dateFuzzyMatch(r2,r1)).to.equal(false);

        expect(utils.dateFuzzyMatch(r2,r3)).to.equal(true);
        expect(utils.dateFuzzyMatch(r3,r2)).to.equal(true);
    });


    it('test dateFuzzyMatch 1-2 and 2-1', function () {
        expect(utils.dateFuzzyMatch(d1,r1)).to.equal(true);
        expect(utils.dateFuzzyMatch(r1,d1)).to.equal(true);

        expect(utils.dateFuzzyMatch(d1,r3)).to.equal(false);
        expect(utils.dateFuzzyMatch(r3,d1)).to.equal(false);

        expect(utils.dateFuzzyMatch(d3,r3)).to.equal(true);
        expect(utils.dateFuzzyMatch(r3,d3)).to.equal(true);

    });


});



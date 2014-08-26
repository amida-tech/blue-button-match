/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var matchSingles = require("../../lib/match-single.js").compare;

var js, js2, js3a, js3b, js4a, js4b;

before(function (done) {
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/demographics.json', 'utf-8').toString());

    //same demographics with some attributes changed (e.g. name, family status, languages)
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/demographics2.json', 'utf-8').toString());

    //console.log(js);
    done();
});

describe('Demographics partial matching library (demographics.js) tests', function () {

    it('compare demographics sections in edge cases', function () {
        var m = [matchSingles({}, {}, 'demographics')];

        expect(m.length).to.equal(1);

        expect(m[0].match).to.equal("duplicate");
        //console.log(m);

        var m = [matchSingles({}, js, 'demographics')];

        expect(m.length).to.equal(1);

        expect(m[0].match).to.equal("partial");
        //console.log(m);

        var m = [matchSingles(js, {}, 'demographics')];

        expect(m.length).to.equal(1);

        expect(m[0].match).to.equal("new");
        //console.log(m);

    });

    it('compare demographics sections with itself', function () {
        var m = [matchSingles(js, js, 'demographics')];

        //console.log(m);

        expect(m.length).to.equal(1);

        expect(m[0].match).to.equal("duplicate");

    });

    it('compare two different demographics sections that will have all partial match', function () {
        var m = [matchSingles(js, js2, 'demographics')];

        //console.log(m);

        expect(m.length).to.equal(1);

        expect(m[0].match).to.equal("partial");

    });

});

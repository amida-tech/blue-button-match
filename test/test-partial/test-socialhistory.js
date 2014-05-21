/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var comparePartial = require('../../lib/sections/single/socialhistory.js').compare;
var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3;

before(function(done) {
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory.json', 'utf-8').toString());

    //same socialhistory with some attributes changed (e.g. date range with diff precision)
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory2.json', 'utf-8').toString());

    //non matching social history to above
    js3 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory3.json', 'utf-8').toString());

    //console.log(js);
    done();
});


describe('Social History partial matching library (socialhistory.js) tests', function() {

        it('compare Social History sections with itself', function() {
            var m = [comparePartial(js, js)];

            //console.log(m);

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("duplicate");

        });


        it('compare two different Social History sections that will have all partial match', function() {
            var m = [comparePartial(js, js2)];

            //console.log(m);

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("diff");

            console.log(m);

        });

        it('compare two different Social History sections that will have no match', function() {
            var m = [comparePartial(js, js3)];

            //console.log(m);

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("diff");

            //console.log(m);

        });


        xit('compare two different Social History sections that will have some partial match, some dups and some new', function() {
            var result = ["partial", "new", "duplicate"].sort();

            var m = matchSections(js4a, js4b, comparePartial);
            //console.log(m);

            expect(m.length).to.equal(3);
            var m_result=[m[0].match,m[1].match,m[2].match].sort();

            expect(m_result).to.deep.equal(result);

            //and now do the same but backwards
            var m = matchSections(js4a, js4b.slice().reverse(), comparePartial);

            expect(m.length).to.equal(3);
            var m_result=[m[0].match,m[1].match,m[2].match].sort();

            expect(m_result).to.deep.equal(result);

        });

});

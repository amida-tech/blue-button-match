/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var comparePartial = require('../../lib/sections/single/demographics.js').compare;
var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3a, js3b, js4a,js4b;

before(function(done) {
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/demographics.json', 'utf-8').toString());

    //same demographics with some attributes changed (e.g. name, family status, languages)
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/demographics2.json', 'utf-8').toString());

    //console.log(js);
    done();
});


describe('Demographics partial matching library (demographics.js) tests', function() {


        it('compare demographics sections in edge cases', function() {
            var m = [comparePartial({}, {})];

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("duplicate");

            //console.log(m);

            var m = [comparePartial({}, js)];

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("diff");

            //console.log(m);

            var m = [comparePartial(js, {})];

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("new");
            //console.log(m);

        });

        it('compare demographics sections with itself', function() {
            var m = [comparePartial(js, js)];

            //console.log(m);

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("duplicate");

        });


        it('compare two different vitals sections that will have all partial match', function() {
            var m = [comparePartial(js, js2)];

            //console.log(m);

            expect(m.length).to.equal(1);

            expect(m[0].match).to.equal("diff");

            //console.log(m);

        });


        xit('compare two different vitals sections that will have some partial match, some dups and some new', function() {
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

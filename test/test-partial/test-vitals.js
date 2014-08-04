/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var comparePartial = require('../../lib/sections/flat/vitals.js').compare;
var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3a, js3b, js4a,js4b;

before(function(done) {
    // vitals and vitals2 have non-intersecting set of values (e.g. all should be new)
    // each has 6 results
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/vitals.json', 'utf-8').toString());
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/vitals2.json', 'utf-8').toString());

    // vitals3a and vitals3b are the same, except 3b has hours added to date
    // (so it's partial match on fuzzy date)
    // each has 3 results
    js3a = JSON.parse(fs.readFileSync('test/test-partial/fixtures/vitals3a.json', 'utf-8').toString());
    js3b = JSON.parse(fs.readFileSync('test/test-partial/fixtures/vitals3b.json', 'utf-8').toString());

    // has 1 dup element, 1 partial match (hours added to date) and 1 new element
    // 4a has 3 elements, 4b has 2 elements
    js4a = JSON.parse(fs.readFileSync('test/test-partial/fixtures/vitals4a.json', 'utf-8').toString());
    js4b = JSON.parse(fs.readFileSync('test/test-partial/fixtures/vitals4b.json', 'utf-8').toString());

    //console.log(bb);
    done();
});


describe('Vitals partial matching library (vitals.js) tests', function() {



        it('compare two different vitals sections', function() {
            var m = matchSections(js, js2, comparePartial);

            //console.log(js.length);
            //console.log(js2.length);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("new");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.not.have.property('dest_id');
            }

        });


        it('compare vitals sections with itself', function() {
            var m = matchSections(js, js, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }

            var m = matchSections(js2, js2, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }

        });


        it('compare vitals sections with itself (but elements in different order)', function() {
            var js_reversed=js.slice().reverse(); //wow .slice() does clone array by value... TIL
            var m = matchSections(js, js_reversed, comparePartial);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });


        it('compare two different vitals sections that will have all partial match', function() {
            var m = matchSections(js3a, js3b, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                //expect(m[item]).to.have.property('src_id');
                //expect(m[item]).to.not.have.property('dest_id');
            }

            //and now do the same but backwards
            var m = matchSections(js3a, js3b.slice().reverse(), comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                //expect(m[item]).to.have.property('src_id');
                //expect(m[item]).to.not.have.property('dest_id');
            }

        });


        it('compare two different vitals sections that will have some partial match, some dups and some new', function() {
            var result = ["partial", "new", "duplicate"].sort();

            var m = matchSections(js4a, js4b, comparePartial);
            //console.log('obj1');
            //console.log(js4a);
            //console.log('obj2');
            //console.log(js4b);
            //console.log('end');
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

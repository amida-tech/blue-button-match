/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var comparePartial = require('../../lib/sections/flat/medications.js').compare;
var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3, js4;

before(function(done) {
    // medications and medications have same 1 med with rearranged translation
    // each has 1 med
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/medications.json', 'utf-8').toString());
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/medications2.json', 'utf-8').toString());

    // medications3 has same med as medication but with same date range with different precision
    // has 1 med
    js3 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/medications3.json', 'utf-8').toString());

    // has a bunch of meds different from all of the above
    // has 17 meds (all status=prescribed)
    // NOTE: actually really bad sample, since meds have UNKNOWN codes
    js4 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/medications4.json', 'utf-8').toString());

    //console.log(bb);
    done();
});


describe('Medications partial matching library (medications.js) tests', function() {



        it('compare two different medications sections', function() {
            var m = matchSections(js, js4, comparePartial);

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


        it('compare medications sections with itself', function() {
            var m = matchSections(js, js, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }

            var m = matchSections(js4, js4, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }

        });


        it('compare medications sections with itself (but translations in different order)', function() {
            var m = matchSections(js, js2, comparePartial);

            //console.log(js,js2,m)

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        it('compare medications sections with itself (but ranges of differnt precision)', function() {
            //console.log(JSON.stringify(js),JSON.stringify(js3));

            var m = matchSections(js, js3, comparePartial);

            //console.log(js,js3,m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });


        xit('compare two different medications sections that will have all partial match', function() {
            var m = matchSections(js3, js3, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                //expect(m[item]).to.have.property('src_id');
                //expect(m[item]).to.not.have.property('dest_id');
            }

            //and now do the same but backwards
            var m = matchSections(js3, js3.slice().reverse(), comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                //expect(m[item]).to.have.property('src_id');
                //expect(m[item]).to.not.have.property('dest_id');
            }

        });


        xit('compare two different vitals sections that will have some partial match, some dups and some new', function() {
            var result = ["partial", "new", "duplicate"].sort();

            var m = matchSections(js4, js4, comparePartial);
            //console.log(m);

            expect(m.length).to.equal(3);
            var m_result=[m[0].match,m[1].match,m[2].match].sort();

            expect(m_result).to.deep.equal(result);

            //and now do the same but backwards
            var m = matchSections(js4, js4.slice().reverse(), comparePartial);

            expect(m.length).to.equal(3);
            var m_result=[m[0].match,m[1].match,m[2].match].sort();

            expect(m_result).to.deep.equal(result);

        });

});

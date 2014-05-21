/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var comparePartial = require('../../lib/sections/flat/problems.js').compare;
var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3, js4;

before(function(done) {
    // 2 sample problems
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems.json', 'utf-8').toString());

    //same as above but rearranged to be partial match
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems2.json', 'utf-8').toString());

    // has a bunch of problems different from all of the above
    js3 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems3.json', 'utf-8').toString());

    //console.log(bb);
    done();
});


describe('Problems partial matching library (problems.js) tests', function() {



        it('compare two different problems sections', function() {
            var m = matchSections(js, js3, comparePartial);

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

            var m = matchSections(js3, js3, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }

        });


        it('compare two different medications sections that will have all partial match', function() {
            var m = matchSections(js, js2, comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                //expect(m[item]).to.have.property('src_id');
                //expect(m[item]).to.not.have.property('dest_id');
            }

            //and now do the same but backwards
            var m = matchSections(js, js2.slice().reverse(), comparePartial);

            //console.log(m);

            for (var item in m) {
                //console.log(m[item].match);
                expect(m[item].match).to.equal("partial");
                //expect(m[item]).to.have.property('src_id');
                //expect(m[item]).to.not.have.property('dest_id');
            }

        });


        xit('compare two different medications sections that will have some partial match, some dups and some new', function() {
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

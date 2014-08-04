/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
//var bbjs = require('blue-button');

var comparePartial = require('../../../lib/sections/subarray/allergies.js').compare;
var matchSections = require("../../../lib/match-sections.js").matchSections;

var js, js2, js3, js4;

before(function(done) {
    // 2 sample allergies
    js = JSON.parse(fs.readFileSync('test/cms/test-partial/fixtures/allergies.json', 'utf-8').toString());

    //same as above but rearranged to be partial match(all)
    js2 = JSON.parse(fs.readFileSync('test/cms/test-partial/fixtures/allergies2.json', 'utf-8').toString());

    // has a bunch of 3 allergies, 2 different 1 same
    js3 = JSON.parse(fs.readFileSync('test/cms/test-partial/fixtures/allergies3.json', 'utf-8').toString());

    //console.log(bb);
    done();
});


describe('CMS: Allergies partial matching tests', function() {

        it('compare two different allergies sections that will have all partial matches ', function() {
            var m = matchSections(js, js2, comparePartial);

            //console.log(JSON.stringify(m,null,4));

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


        it('compare two different allergies sections that will have 2 partial 1 duplicate ', function() {
            var m = matchSections(js, js3, comparePartial);

            //console.log(JSON.stringify(m,null,4));
            var partialCount = 0;
            var dupCount = 0;
            for (var item in m) {
                //console.log(m[item].match);
                if(m[item].match === 'partial'){
                    partialCount++;
                }
                else if(m[item].match === 'duplicate'){
                    dupCount++;
                }
            }
            expect(partialCount).to.equal(2);
            expect(dupCount).to.equal(1);


            partialCount = 0;
            dupCount = 0;

            //and now do the same but backwards
            var m = matchSections(js, js3.slice().reverse(), comparePartial);

            //console.log(m);
            for (var item in m) {
                if(m[item].match === 'partial'){
                    partialCount++;
                }
                else if(m[item].match === 'duplicate'){
                    dupCount++;
                }
            }

            expect(partialCount).to.equal(2);
            expect(dupCount).to.equal(1);

        });
});



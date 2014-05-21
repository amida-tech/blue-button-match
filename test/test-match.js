/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var expect = require('chai').expect;

var fs = require('fs');
var bbjs = require('blue-button');

var match = require('../lib/match.js');
var compare = require('../lib/compare-partial.js').compare;
var lookups = require('../lib/lookups.js');
var equal = require('deep-equal');

var matchSections = require("../lib/match-sections.js");

var bb;
var bb2, bb3, bb4;

before(function(done) {
    var xml = fs.readFileSync('test/records/ccda/CCD_demo1.xml', 'utf-8');
    bb = bbjs.parseString(xml);
    var xml2 = fs.readFileSync('test/records/ccda/CCD_demo2.xml', 'utf-8');
    bb2 = bbjs.parseString(xml2);
    var xml3 = fs.readFileSync('test/records/ccda/CCD_demo3.xml', 'utf-8');
    bb3 = bbjs.parseString(xml3);

    //var xml4 = fs.readFileSync('test/records/ccda/kinsights-sample-timmy.xml', 'utf-8');
    //bb4 = bbjs.parseString(xml4).data;

    //console.log(bb);
    done();
});


describe('Matching library (match.js) tests', function() {




    describe('Header level tests', function() {

        xit('some sophisticated header tests will be added there later', function() {});
    });

    describe('Document level tests', function() {

        it('full record comparison of same document', function() {

            var m = match.match(bb.data, bb.data);

            //console.log(JSON.stringify(m,null,4));

            expect(m).to.be.ok;
            expect(m).to.have.property("match");

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {

                    expect(m["match"]).to.have.property(name);

                    for (var item in m["match"][name]) {
                        expect(m["match"][name][item].match).to.equal("duplicate");
                        expect(m["match"][name][item]).to.have.property('src_id');
                        expect(m["match"][name][item]).to.have.property('dest_id');
                    }
                }
            }

        });


        it('full record comparison of two different documents', function() {
            var m = match.match(bb.data, bb3.data);


            //console.log(JSON.stringify(m,null,4));

            //var m2 = match.match(bb2,bb3);
            //var m3 = match.match(bb,bb3);

            //console.log(m["match"]["allergies"]);
            //console.log(m2["match"]["allergies"]);
            //console.log(m3["match"]["allergies"]);

            expect(m).to.be.ok;
            expect(m).to.have.property("match");

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {

                    expect(m["match"]).to.have.property(name);

                    for (var item in m["match"][name]) {
                        expect(m["match"][name][item].match).to.equal("new");
                        expect(m["match"][name][item]).to.have.property('src_id');
                        expect(m["match"][name][item]).to.have.not.property('dest_id');
                    }
                }
            }
        });


    });


});

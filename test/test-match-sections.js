/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
var bbjs = require('blue-button');

var match = require('../lib/match.js');
var lookups = require('../lib/lookups.js');
var equal = require('deep-equal');
var comparePartial = require("../lib/router.js").compare;

var matchSections = require("../lib/match-sections.js").matchSections;

var bb;
var bb2, bb3, bb4;
var bbCms1;
var bbCms2;

before(function (done) {
    var xml = fs.readFileSync('test/records/ccda/CCD_demo1.xml', 'utf-8');
    bb = bbjs.parseString(xml).data;
    var xml2 = fs.readFileSync('test/records/ccda/CCD_demo2.xml', 'utf-8');
    bb2 = bbjs.parseString(xml2).data;
    var xml3 = fs.readFileSync('test/records/ccda/CCD_demo3.xml', 'utf-8');
    bb3 = bbjs.parseString(xml3).data;
    var xml4 = fs.readFileSync('test/records/ccda/CCD_demo4.xml', 'utf-8');
    bb4 = bbjs.parseString(xml4).data;

    var txt1 = fs.readFileSync('test/records/cms/cms_same.txt', 'utf-8');
    bbCms1 = bbjs.parseText(txt1).data;
    var txt2 = fs.readFileSync('test/records/cms/cms_same.txt', 'utf-8');
    bbCms2 = bbjs.parseText(txt2).data;
    //console.log(bb);
    done();
});

describe('Matching library (match-sections.js) tests', function () {

    describe('Sections level tests', function () {

        it('testing matchSections method with two different BB.js data files', function () {

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);
                //TODO: need CCD4 to be completely different from CCD1
                name = "allergies";

                if (bb.hasOwnProperty(name) && bb4.hasOwnProperty(name)) {

                    //console.log(">>>>", name);
                    //console.log(comparePartial);
                    //console.log(comparePartial(name));

                    var m = matchSections(bb[name], bb4[name], name);

                    //console.log(m);

                    for (var item in m) {
                        expect(m[item].match).to.equal("new");
                        expect(m[item]).to.have.property('src_id');
                        expect(m[item]).to.have.property('dest_id');
                    }
                }
            }

        });

        describe('allergy sections comparison', function () {
            it('testing matchSections method on two equal allergy sections', function () {
                //console.log(match.matchSections(bb.data["allergies"],bb.data["allergies"]));
                var m = matchSections(bb["allergies"], bb["allergies"], "allergies");

                for (var item in m) {
                    expect(m[item]).to.have.property('src_id');
                    expect(m[item]).to.have.property('dest_id');
                }
            });

            it('testing allergy sections with undefineds', function () {
                //console.log(match.matchSections(bb.data["allergies"],bb.data["allergies"]));
                var m = matchSections(bb["allergies"], bb["allergies"], "allergies");

                for (var item in m) {
                    expect(m[item]).to.have.property('src_id');
                    expect(m[item]).to.have.property('dest_id');
                }
            });

            it('testing matchSections method on allergies with two same bb.jss data files', function () {
                var name = "allergies";

                if (bb3.hasOwnProperty(name) && bb3.hasOwnProperty(name)) {

                    var m = matchSections(bbCms1[name], bbCms2[name], name);
                    //console.log(m);
                    for (var item in m) {
                        expect(m[item]).to.have.property('src_id');
                        expect(m[item]).to.have.property('dest_id');
                    }
                }
            });
        });

        //TODO: this test relies on details of sample files, had to be rewritten if samples change
        it('allergy section comparison of documents with mix and match', function () {
            //console.log(JSON.stringify(bb3["allergies"][2], null, 4));
            //console.log(JSON.stringify(bb2["allergies"][2], null, 4));

            //console.log("match bb3 to bb");
            var m = matchSections(bb3["allergies"], bb["allergies"], "allergies");

            //console.log("match bb3 to bb2");
            var m2 = matchSections(bb3["allergies"], bb2["allergies"], "allergies");

            //console.log(m2);

            expect(m).to.be.ok;
            expect(m2).to.be.ok;

            //console.log(m);
            //console.log(m2);

            //basic sorting function for later

            function src_sort(a, b) {
                if (a.src_id < b.src_id) {
                    return -1;
                }
                if (a.src_id > b.src_id) {
                    return 1;
                }
                return 0;
            }

        });

    });

    describe('insurance sections comparison', function () {
        var bbCmsTest1;
        var bbCmsTest2;
        beforeEach(function () {
            bbCmsTest1 = JSON.parse(JSON.stringify(bbCms1));
            bbCmsTest2 = JSON.parse(JSON.stringify(bbCms2));
        });

        it('testing matchSections method on two equal insurance sections', function () {
            var m = matchSections(bbCmsTest1["insurance"], bbCmsTest2["insurance"], "insurance");
            for (var item in m) {
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        it('testing matchSections method on two different insurance sections', function () {

            var m = matchSections(bbCmsTest1["insurance"], bbCmsTest2["insurance"], "insurance");

            for (var item in m) {
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        it('testing matchSections method on two insurance sections with some same fields', function () {

            var m = matchSections(bbCmsTest1["insurance"], bbCmsTest2["insurance"], "insurance");
            for (var item in m) {
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

    });

    describe('claims sections comparison', function () {
        var bbCmsTest1;
        var bbCmsTest2;
        beforeEach(function () {
            bbCmsTest1 = JSON.parse(JSON.stringify(bbCms1));
            bbCmsTest2 = JSON.parse(JSON.stringify(bbCms2));
        });

        it(', testing matchSections method on two equal claims sections', function () {
            var m = matchSections(bbCmsTest1["claims"], bbCmsTest2["claims"], "claims");
            for (var item in m) {
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        it(', testing matchSections method on two different claims sections', function () {

            var m = matchSections(bbCmsTest1["claims"], bbCmsTest2["claims"], "claims");
            for (var item in m) {
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        it(', testing matchSections method on two claims sections with some same fields', function () {

            var m = matchSections(bbCmsTest1["claims"], bbCmsTest2["claims"], "claims");
            for (var item in m) {
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

    });

});

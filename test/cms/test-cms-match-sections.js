/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
var bbjs = require('blue-button');

var match = require('../../lib/match.js');
var lookups = require('../../lib/lookups.js');
var equal = require('deep-equal');
var comparePartial = require("../../lib/router.js").compare;

var matchSections = require("../../lib/match-sections.js").matchSections;

var bbCms1;
var bbCms2;

before(function (done) {

    var txt1 = fs.readFileSync('test/records/cms/cms_same.txt', 'utf-8');
    bbCms1 = bbjs.parseText(txt1).data;
    var txt2 = fs.readFileSync('test/records/cms/cms_same.txt', 'utf-8');
    bbCms2 = bbjs.parseText(txt2).data;
    //console.log(bb);
    done();
});

describe('Matching library (match-sections.js) CMS text tests', function () {

    describe('insurance sections comparison', function () {
        var bbCmsTest1;
        var bbCmsTest2;
        beforeEach(function () {
            bbCmsTest1 = JSON.parse(JSON.stringify(bbCms1));
            bbCmsTest2 = JSON.parse(JSON.stringify(bbCms2));
        });

        it('testing matchSections method on two equal insurance sections', function () {

            //console.log(JSON.stringify(bbCmsTest1, null, 10));




            var m = matchSections(bbCmsTest1["insurance"], bbCmsTest2["insurance"],"insurance");


            console.log(m);
            for (var item in m) {
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        xit('testing matchSections method on two different insurance sections', function () {
            var number = 0;
            for (var key in bbCmsTest1["insurance"]) {
                var insuranceObj = bbCmsTest1["insurance"][key];
                for (var fieldKey in insuranceObj) {
                    insuranceObj[fieldKey] = number;
                    number++;
                }
            }
            var m = matchSections(bbCmsTest1["insurance"], bbCmsTest2["insurance"], comparePartial("insurance"));

            for (var item in m) {
                expect(m[item].match).to.equal("new");
                expect(m[item]).to.have.property('src_id');
            }
        });

        xit('testing matchSections method on two insurance sections with some same fields', function () {
            var number = 0;
            for (var key in bbCmsTest1["insurance"]) {
                var insuranceObj = bbCmsTest1["insurance"][key];
                insuranceObj['addresses'] = number++;
                insuranceObj['date'] = number++;
            }
            var m = matchSections(bbCmsTest1["insurance"], bbCmsTest2["insurance"], comparePartial("insurance"));
            for (var item in m) {
                expect(m[item].match).to.equal("partial");
            }
        });

    });

    xdescribe('claims sections comparison', function () {
        var bbCmsTest1;
        var bbCmsTest2;
        beforeEach(function () {
            bbCmsTest1 = JSON.parse(JSON.stringify(bbCms1));
            bbCmsTest2 = JSON.parse(JSON.stringify(bbCms2));
        });

        it(',testing matchSections method on two equal claims sections', function () {
            var m = matchSections(bbCmsTest1["claims"], bbCmsTest2["claims"], comparePartial("claims"));
            console.log(m);
            for (var item in m) {
                expect(m[item].match).to.equal("duplicate");
                expect(m[item]).to.have.property('src_id');
                expect(m[item]).to.have.property('dest_id');
            }
        });

        it(', testing matchSections method on two different claims sections', function () {
            var number = 0;
            for (var key in bbCmsTest1["claims"]) {
                var claimsObj = bbCmsTest1["claims"][key];
                for (var fieldKey in claimsObj) {
                    claimsObj[fieldKey] = number;
                    number++;
                }
            }

            var m = matchSections(bbCmsTest1["claims"], bbCmsTest2["claims"], comparePartial("claims"));
            for (var item in m) {
                expect(m[item].match).to.equal("new");
                expect(m[item]).to.have.property('src_id');
            }
        });

        it(', testing matchSections method on two claims sections with some same fields', function () {
            var number = 0;
            for (var key in bbCmsTest1["claims"]) {
                var insuranceObj = bbCmsTest1["claims"][key];
                insuranceObj['addresses'] = number++;
                insuranceObj['date'] = number++;
            }
            var m = matchSections(bbCmsTest1["claims"], bbCmsTest2["claims"], comparePartial("claims"));
            for (var item in m) {
                expect(m[item].match).to.equal("partial");
            }
        });

    });

});

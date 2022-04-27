/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var fs = require('fs');
var bbjs = require('@amida-tech/blue-button');

var match = require('../lib/match.js');
var lookups = require('../lib/lookups.js');
var equal = require('deep-equal');

var matchSections = require("../lib/match-sections.js");
var path = require("path");

var bb;
var bb2, bb3, bb4;

beforeAll(function (done) {
  var xml = fs.readFileSync(path.join(__dirname, 'records/ccda/CCD_demo1.xml'), 'utf-8');
  bb = bbjs.parseString(xml);
  var xml2 = fs.readFileSync(path.join(__dirname, 'records/ccda/CCD_demo2.xml'), 'utf-8');
  bb2 = bbjs.parseString(xml2);
  var xml3 = fs.readFileSync(path.join(__dirname, 'records/ccda/CCD_demo3.xml'), 'utf-8');
  bb3 = bbjs.parseString(xml3);
  //cms
  var txt1 = fs.readFileSync(path.join(__dirname, 'records/cms/cms_same.txt'), 'utf-8');
  bb4 = bbjs.parseText(txt1);

  //var xml4 = fs.readFileSync('test/records/ccda/kinsights-sample-timmy.xml', 'utf-8');
  //bb4 = bbjs.parseString(xml4).data;

  //console.log(bb);
  done();
});

describe('Matching library (match.js) tests', function () {

  describe('Header level tests', function () {

    xit('some sophisticated header tests will be added there later', function () { });
  });

  describe('Document level tests', function () {

    it('full record comparison of same document', function () {

      var m = match.match(bb.data, bb.data);

      //console.log(JSON.stringify(m,null,4));

      expect(m).toBeTruthy();
      expect(m).toHaveProperty("match");

      for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        if (bb.hasOwnProperty(name)) {

          expect(m["match"]).toHaveProperty(name);

          for (var item in m["match"][name]) {
            expect(m["match"][name][item].match).toBe("duplicate");
            expect(m["match"][name][item]).toHaveProperty('src_id');
            expect(m["match"][name][item]).toHaveProperty('dest_id');
          }
        }
      }

    });

    it('full record comparison of same cms document', function () {
      var m = match.match(bb4.data, bb4.data);

      expect(m).toBeTruthy();
      expect(m).toHaveProperty("match");

      for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        if (bb.hasOwnProperty(name)) {

          expect(m["match"]).toHaveProperty(name);

          for (var item in m["match"][name]) {
            expect(m["match"][name][item].match).toBe("duplicate");
            expect(m["match"][name][item]).toHaveProperty('src_id');
            expect(m["match"][name][item]).toHaveProperty('dest_id');
          }
        }
      }

    });

    it('full record comparison of two different documents', function () {
      var m = match.match(bb.data, bb3.data);

      //console.log(JSON.stringify(m,null,4));

      //var m2 = match.match(bb2,bb3);
      //var m3 = match.match(bb,bb3);

      //console.log(m["match"]["allergies"]);
      //console.log(m2["match"]["allergies"]);
      //console.log(m3["match"]["allergies"]);

      expect(m).toBeTruthy();
      expect(m).toHaveProperty("match");

      for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        if (bb.hasOwnProperty(name)) {

          expect(m["match"]).toHaveProperty(name);

          for (var item in m["match"][name]) {
            expect(m["match"][name][item].match).toBe("new");
            expect(m["match"][name][item]).toHaveProperty('src_id');
            expect(m["match"][name][item]).not.toHaveProperty('dest_id');
          }
        }
      }
    });

  });

});

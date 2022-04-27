/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var fs = require('fs');
var bbjs = require('@amida-tech/blue-button');
//var match = require("@amida-tech/blue-button-match");
var match = require('../index.js');
var _ = require('underscore');
var lookups = require('../lib/lookups.js');

//var match = require('../lib/match.js');
//var compare = require('../lib/compare-partial.js').compare;
//var lookups = require('../lib/lookups.js');
//var equal = require('deep-equal');

var js, js2, js3, js4;

var lookup = lookups.sections;

beforeAll(function (done) {
  /*
      01 - original record (with all sections populated)
      02 - duplicate
      03 - all sections updated (e.g. only dups (old) and new (new) matches triggered)
      04 - all sections updated with data that triggers partial matching (scenario: record comes from different doctor)
  */
  var xml = fs.readFileSync('test/demo-r1.0/bluebutton-01-original.xml').toString();
  var xml2 = fs.readFileSync('test/demo-r1.0/bluebutton-02-duplicate.xml').toString();
  var xml3 = fs.readFileSync('test/demo-r1.0/bluebutton-03-updated.xml').toString();
  var xml4 = fs.readFileSync('test/demo-r1.0/bluebutton-04-diff-source-partial-matches.xml').toString();
  var bb = fs.readFileSync('test/demo-r1.0/bluebutton-05-cms.txt').toString();

  js = bbjs.parseString(xml).data;
  js2 = bbjs.parseString(xml2).data;
  js3 = bbjs.parseString(xml3).data;
  js4 = bbjs.parseString(xml4).data;
  js5 = bbjs.parseText(bb).data;

  //save JSON into artifacts folder (just for reference and manual inspection)
  fs.writeFileSync('test/demo-r1.0/json/bluebutton-01-original.json', JSON.stringify(js, null, 4));
  fs.writeFileSync('test/demo-r1.0/json/bluebutton-02-duplicate.json', JSON.stringify(js2, null, 4));
  fs.writeFileSync('test/demo-r1.0/json/bluebutton-03-updated.json', JSON.stringify(js3, null, 4));
  fs.writeFileSync('test/demo-r1.0/json/bluebutton-04-diff-source-partial-matches.json', JSON.stringify(js4, null, 4));
  fs.writeFileSync('test/demo-r1.0/json/bluebutton-05-cms.json', JSON.stringify(js5, null, 4));

  //bb4 = bbjs.parseString(xml4).data;

  //console.log(js);
  done();
});

describe('Verifying demo R1.0 sample xml files', function () {

  it('checking for all sections present in each demo file', function () {

    //Reduce supported sections to XML elements only.
    var ccdFilter = _.filter(lookup, function (entry) {
      var isKept = true;

      switch (entry) {
        case 'insurance':
        case 'claims':
        case 'providers':
        case 'organizations':
        case 'reason_for_referral':
        case 'hospital_discharge_instructions':
          isKept = false;
          break;
        default:
          isKept = true;
      }

      return isKept;
    });

    for (var section in ccdFilter) {
      //console.log(ccdFilter[section], js[ccdFilter[section]]);
      //console.log(" >js");
      expect(js[ccdFilter[section]]).toBeDefined();
      //console.log(" >js2");
      expect(js2[ccdFilter[section]]).toBeDefined();
      //console.log(" >js3");
      expect(js3[ccdFilter[section]]).toBeDefined();
      //console.log(" >js4");
      expect(js4[ccdFilter[section]]).toBeDefined();
    }

  });

  it('checking that JSON #1 against empty master record', function () {
    //console.log(js);
    var m0 = match.match(js, {});

    //console.log(JSON.stringify(m0,null,4));

    //console.log(JSON.stringify(m0, null, 10));

    //All files matched against dest should be 'new'
    for (var section in lookup) {
      for (var el in m0.match[lookup[section]]) {
        //console.log(m0.match[lookup[section]][el])
        if (lookup[section] !== 'demographics') {
          if (m0.match[lookup[section]][el].match.dest === 'dest') {
            expect(m0.match[lookup[section]][el].match).toBe("new");
          }
        }
        if (lookup[section] === 'demographics') {
          expect(m0.match[lookup[section]].match).toBe('new');
        }
      }
    }

  });

  it('checking that JSON #1 and #2 are duplicates', function () {
    //console.log(js);
    var m_match = match.match(js, js2);
    //console.log(m_match);

    fs.writeFileSync('test/demo-r1.0/matches/02-in-01.json', JSON.stringify(m_match, null, 4));

    var src_obj_array;

    //Should just result in one duplicate per each entry.
    for (var section in lookup) {

      //console.log(lookup[section]);

      if (lookup[section] === 'demographics') {
        var m1 = m_match.match[lookup[section]];
        expect(m1.match).toBe('duplicate');
      }

      if (lookup[section] !== 'demographics') {
        var m = m_match.match[lookup[section]];

        //console.log(m);
        //Group arrays by source.
        var src_array = [];
        for (var item in m) {
          src_array.push(m[item].src_id);
        }

        src_array = _.uniq(src_array);
        src_obj_array = [];

        for (var i in src_array) {
          src_obj_array.push([]);
        }

        for (var itemd in m) {
          for (var iter in src_array) {
            if (m[itemd].src_id === src_array[iter]) {

              src_obj_array[src_array[iter]].push(m[itemd]);

            }

          }
        }

      }

      for (var objArrayd in src_obj_array) {
        //console.log(_.where(src_obj_array[objArray], {dest: 'dest', match: 'duplicate'}));
        expect(_.where(src_obj_array[objArrayd], {
          dest: 'dest',
          match: 'duplicate'
        }).length).toBe(1);
      }

    }

  });

  it('checking that matches between JSON #3 and #1 are just new or duplicates entries', function () {
    var m2 = match.match(js3, js);

    //console.log(JSON.stringify(m2, null, 10));

    fs.writeFileSync('test/demo-r1.0/matches/03-in-01.json', JSON.stringify(m2, null, 4));

    var src_obj_array;

    for (var section in lookup) {
      //console.log(lookup[section]);

      if (lookup[section] === 'demographics') {
        var mndd = m2.match[lookup[section]];
        expect(mndd.match).toBe('duplicate');
      }

      if (lookup[section] !== 'demographics') {
        var mnd = m2.match[lookup[section]];

        //console.log(m);
        //Group arrays by source.
        var src_array = [];
        for (var item in mnd) {
          src_array.push(mnd[item].src_id);
        }

        src_array = _.uniq(src_array);
        src_obj_array = [];

        for (var i in src_array) {
          src_obj_array.push([]);
        }

        for (var itemnd in mnd) {
          for (var iter in src_array) {
            if (mnd[itemnd].src_id === src_array[iter]) {

              src_obj_array[src_array[iter]].push(mnd[itemnd]);

            }

          }
        }

      }

      for (var objArray in src_obj_array) {
        //console.log(_.where(src_obj_array[objArray], {dest: 'dest', match: 'duplicate'}));
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'duplicate'
        })).toBeDefined();
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'new'
        })).toBeDefined();
      }

    }

  });

  it('checking that matches between JSON #4 and #3 has partial or diff entries', function () {
    var m3 = match.match(js4, js3);

    var src_obj_array;

    for (var section in lookup) {
      //console.log(lookup[section]);

      if (lookup[section] === 'demographics') {
        var m = m3.match[lookup[section]];
        expect(m.match).toBe('partial');
      }

      if (lookup[section] !== 'demographics') {
        var mpar = m3.match[lookup[section]];

        //console.log(m);
        //Group arrays by source.
        var src_array = [];
        for (var item in mpar) {
          src_array.push(mpar[item].src_id);
        }

        src_array = _.uniq(src_array);
        src_obj_array = [];

        for (var i in src_array) {
          src_obj_array.push([]);
        }

        for (var itempar in mpar) {
          for (var iter in src_array) {
            if (mpar[itempar].src_id === src_array[iter]) {

              src_obj_array[src_array[iter]].push(mpar[itempar]);

            }

          }
        }

      }

      for (var objArray in src_obj_array) {
        //console.log(_.where(src_obj_array[objArray], {dest: 'dest', match: 'duplicate'}));
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'duplicate'
        })).toBeDefined();
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'new'
        })).toBeDefined();
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'partial'
        })).toBeDefined();
      }

    }

  });

});

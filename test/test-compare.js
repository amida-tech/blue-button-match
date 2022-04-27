/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var fs = require('fs');
var bbjs = require('@amida-tech/blue-button');
var path = require('path');

var compare = require('../lib/compare.js').compare;
var lookups = require('../lib/lookups.js');

var bb;
var bb2, bb3, bb4;

beforeAll(function (done) {
  var xml = fs.readFileSync(path.join(__dirname, 'records/ccda/CCD_demo1.xml'), 'utf-8');
  bb = bbjs.parseString(xml);

  //var xml2 = fs.readFileSync('test/records/ccda/CCD_demo2.xml', 'utf-8');
  //bb2 = bbjs.parseString(xml2);
  //var xml3 = fs.readFileSync('test/records/ccda/CCD_demo3.xml', 'utf-8');
  //bb3 = bbjs.parseString(xml3);

  var xml4 = fs.readFileSync(path.join(__dirname, 'records/ccda/kinsights-sample-timmy.xml'), 'utf-8');
  bb4 = bbjs.parseString(xml4).data;

  //console.log(bb);
  done();
});

describe('Matching library (compare.js) tests', function () {

  describe('Exceptions test', function () {
    it('testing exceptions', function () {
      var fn = function () {
        compare({
          "a": 1
        }, {
          "a": 1
        }, {
          "a": 1
        });
      };
      expect(fn).toThrowError('two arguments are required for compare function');

      fn = function () {
        compare({
          "a": 1
        });
      };
      expect(fn).toThrowError('two arguments are required for compare function');

      fn = function () {
        compare();
      };
      expect(fn).toThrowError('two arguments are required for compare function');

    });
  });

  describe('Entries level tests', function () {
    it('testing compare method', function () {
      //expect(true).to.equal(true);
      expect(compare({
        "a": 1
      }, {
        "a": 1
      })).toHaveProperty("match", "duplicate");
      expect(compare({
        "a": 1
      }, {
        "a": 2
      })).toHaveProperty("match", "new");

      //check that order doesnt matter
      expect(compare({
        "a": 1,
        "b": 2
      }, {
        "b": 2,
        "a": 1
      })).toHaveProperty("match", "duplicate");

    });

    it('testing compare method with BB.js data', function () {
      //expect(true).to.equal(true);

      for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        if (bb.hasOwnProperty(name)) {
          for (var entry in bb.data[name]) {
            //console.log(bb.data[name][entry]);

            expect(compare(bb.data[name][entry], bb.data[name][entry])).toHaveProperty("match", "duplicate");
          }
        }
      }

    });

    it('testing compare method with BB.js data (Kinsights)', function () {
      //expect(true).to.equal(true);

      for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> "+name);

        if (bb4.hasOwnProperty(name)) {
          for (var entry in bb4[name]) {
            //console.log(bb2.data[name][entry]);

            expect(compare(bb4[name][entry], bb4[name][entry])).toHaveProperty("match", "duplicate");
          }
        }
      }

    });

  });

});

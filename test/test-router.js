/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var expect = require('chai').expect;

var fs = require('fs');
var bbjs = require('blue-button');

var compare = require('../lib/router.js').compare;
var lookups = require('../lib/lookups.js');

var bb;
var bb2;

before(function(done) {
    var xml = fs.readFileSync('test/records/ccda/CCD_demo1.xml', 'utf-8');
    bb = bbjs.parseString(xml).data;
    var xml2 = fs.readFileSync('test/records/ccda/CCD_demo2.xml', 'utf-8');
    bb2 = bbjs.parseString(xml2).data;
    var xml3 = fs.readFileSync('test/records/ccda/CCD_demo3.xml', 'utf-8');
    bb3 = bbjs.parseString(xml3).data;

    var xml4 = fs.readFileSync('test/records/ccda/kinsights-sample-timmy.xml', 'utf-8');
    bb4 = bbjs.parseString(xml4).data;

    //console.log(bb.data);
    done();
});


describe('Matching library (compare-partial.js) tests', function() {

    describe('Exceptions test', function() {
        it('testing exceptions', function() {
            var fn = function() {
                compare({
                    "a": 1
                }, {
                    "a": 1
                });
            };
            expect(fn).to.
            throw ('one argument is required for compare function');
        });
    });

    describe('Entries level tests', function() {

        it('testing compare method with BB.js data', function() {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {
                    for (var entry in bb[name]) {
                        //console.log(bb.data[name][entry]);
                        if (name !== 'demographics') {
                            expect(compare(bb[name][entry], bb[name][entry], name)).to.have.property("match", "duplicate");
                        }
                    }
                }
            }

        });
        it('testing compare method with BB.js data', function() {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {
                    for (var entry in bb2[name]) {
                        //console.log(bb.data[name][entry]);
                        if (name !== 'demographics') {
                            expect(compare(bb2[name][entry], bb2[name][entry], name)).to.have.property("match", "duplicate");
                        }
                    }
                }
            }

        });
        it('testing compare method with BB.js data', function() {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb.hasOwnProperty(name)) {
                    for (var entry in bb3[name]) {
                        //console.log(bb.data[name][entry]);
                        if (name !== 'demographics') {
                            expect(compare(bb3[name][entry], bb3[name][entry], name)).to.have.property("match", "duplicate");
                        }
                    }
                }
            }

        });

        it('testing compare method with BB.js data (Kinsights)', function() {
            //expect(true).to.equal(true);

            for (var section in lookups.sections) {
                var name = lookups.sections[section];
                //console.log(">>> "+name);

                if (bb4.hasOwnProperty(name)) {
                    for (var entry in bb4[name]) {
                        //console.log(bb2.data[name][entry]);
                        if (name !== 'demographics') {
                            expect(compare(bb4[name][entry], bb4[name][entry], name)).to.have.property("match", "duplicate");
                        }
                    }
                }
            }

        });



    });

});

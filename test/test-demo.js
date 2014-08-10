/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

var expect = require('chai').expect;
var assert = require('chai').assert;

var fs = require('fs');
var bbjs = require('blue-button');
//var match = require("blue-button-match");
var match = require('../index.js');
var _ = require('underscore');

//var match = require('../lib/match.js');
//var compare = require('../lib/compare-partial.js').compare;
//var lookups = require('../lib/lookups.js');
//var equal = require('deep-equal');

var js, js2, js3, js4;

var lookup = [
    'allergies',
    'encounters',
    'immunizations',
    'results',
    'medications',
    'problems',
    'procedures',
    'vitals',
    'demographics',
    'social_history',
];


before(function(done) {
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

    js = bbjs.parseString(xml).data;
    js2 = bbjs.parseString(xml2).data;
    js3 = bbjs.parseString(xml3).data;
    js4 = bbjs.parseString(xml4).data;

    //save JSON into artifacts folder (just for reference and manual inspection)
    fs.writeFileSync('test/demo-r1.0/json/bluebutton-01-original.json', JSON.stringify(js, null, 4));
    fs.writeFileSync('test/demo-r1.0/json/bluebutton-02-duplicate.json', JSON.stringify(js2, null, 4));
    fs.writeFileSync('test/demo-r1.0/json/bluebutton-03-updated.json', JSON.stringify(js3, null, 4));
    fs.writeFileSync('test/demo-r1.0/json/bluebutton-04-diff-source-partial-matches.json', JSON.stringify(js4, null, 4));

    //bb4 = bbjs.parseString(xml4).data;

    //console.log(js);
    done();
});


describe('Verifying demo R1.0 sample xml files', function() {


    it('checking for all sections present in each demo file', function() {

        for (var section in lookup) {
            //console.log(lookup[section]);
            //console.log(" >js");
            expect(js[lookup[section]]).to.exist;
            //console.log(" >js2");
            expect(js2[lookup[section]]).to.exist;
            //console.log(" >js3");
            expect(js3[lookup[section]]).to.exist;
            //console.log(" >js4");
            expect(js4[lookup[section]]).to.exist;
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
                        expect(m0.match[lookup[section]][el].match).to.equal("new");
                    }
                }
                if (lookup[section] === 'demographics') {
                    expect(m0.match[lookup[section]].match).to.equal('new');
                }
            }
        }

    });


    it('checking that JSON #1 and #2 are duplicates', function() {
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
                expect(m1.match).to.equal('duplicate');
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
                expect(_.where(src_obj_array[objArrayd], {dest: 'dest', match: 'duplicate'}).length).to.equal(1);
            }
            
        }

    });


    it('checking that matches between JSON #3 and #1 are just new or duplicates entries', function() {
        var m2 = match.match(js3, js);

        //console.log(JSON.stringify(m2, null, 10));

        fs.writeFileSync('test/demo-r1.0/matches/03-in-01.json', JSON.stringify(m2, null, 4));

        var src_obj_array;

        for (var section in lookup) {
            //console.log(lookup[section]);

            if (lookup[section] === 'demographics') {
                var mndd = m2.match[lookup[section]];
                expect(mndd.match).to.equal('duplicate');
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
                expect(_.where(src_obj_array[objArray], {dest: 'dest', match: 'duplicate'})).to.exist;
                expect(_.where(src_obj_array[objArray], {dest: 'dest', match: 'new'})).to.exist;
            }
            
        }

    });

    it('checking that matches between JSON #4 and #3 has partial or diff entries', function() {
        var m3 = match.match(js4, js3);

        var src_obj_array;

        for (var section in lookup) {
            //console.log(lookup[section]);

            if (lookup[section] === 'demographics') {
                var m = m3.match[lookup[section]];
                expect(m.match).to.equal('diff');
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
                expect(_.where(src_obj_array[objArray], {dest: 'dest', match: 'duplicate'})).to.exist;
                expect(_.where(src_obj_array[objArray], {dest: 'dest', match: 'new'})).to.exist;
                expect(_.where(src_obj_array[objArray], {dest: 'dest', match: 'partial'})).to.exist;
            }
            
        }

    });


});

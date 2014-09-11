/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
var path = require('path');

var _ = require('underscore');

var matchSections = require(path.join(__dirname, "../../lib/match-sections.js")).matchSections;

var js, js2, js3, js4;

before(function (done) {
    // 1 panel with 3 subresults
    js = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/results.json'), 'utf-8').toString());

    //same as above but rearranged to be partial match
    js2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/results2.json'), 'utf-8').toString());

    // another panel with bunch of subresults different from all of the above
    js3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/results3.json'), 'utf-8').toString());

    js4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/results4.json'), 'utf-8').toString());

    //console.log(bb);
    done();
});

describe('Results partial matching library (results.js) tests', function () {

    it('compare two different results sections', function () {
        var m = matchSections(js, js3, 'results');

        expect(m.length).to.equal(1);
        expect(_.where(m, {
            dest: 'dest'
        }).length).to.equal(1);
        expect(_.where(m, {
            dest: 'src'
        }).length).to.equal(0);

        //console.log(JSON.stringify(m, null, 10));

        for (var item in m) {
            expect(m[item].match).to.equal("new");
            expect(m[item]).to.have.property('src_id');
            expect(m[item]).to.have.property('dest_id');
        }

    });

    it('compare results section with itself', function () {
        var m = matchSections(js, js, 'results');

        //console.log(m);

        for (var item in m) {
            //console.log(m[item].match);
            expect(m[item].match).to.equal("duplicate");
            expect(m[item]).to.have.property('src_id');
            expect(m[item]).to.have.property('dest_id');
        }

        var m = matchSections(js3, js3, 'results');

        //console.log(m);

        for (var item in m) {
            //console.log(m[item].match);
            expect(m[item].match).to.equal("duplicate");
            expect(m[item]).to.have.property('src_id');
            expect(m[item]).to.have.property('dest_id');
        }

    });

    it('compare two different results sections that will have all partial match', function () {

        //console.log(JSON.stringify(js, null, 10));
        //console.log(JSON.stringify(js2, null, 10));

        var m = matchSections(js, js2, 'results');

        //console.log(JSON.stringify(m,null,4));

        //Group arrays by source.
        var src_array = [];
        for (var item in m) {
            src_array.push(m[item].src_id);
        }

        src_array = _.uniq(src_array);
        var src_obj_array = [];

        for (var i in src_array) {
            src_obj_array.push([]);
        }

        for (var item in m) {
            for (var iter in src_array) {
                if (m[item].src_id === src_array[iter]) {
                    src_obj_array[src_array[iter]].push(m[item]);
                }

            }
        }

        for (var objArray in src_obj_array) {
            //console.log(src_obj_array[objArray]);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(0);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(75);
                expect(partial_array[i].diff).to.exist;
                expect(partial_array[i].subelements).to.exist;
                expect(partial_array[i].subelements.results).to.exist;
                expect(partial_array[i].subelements.results.length).to.equal(15);
            }

        }

        //and now do the same but backwards
        var m = matchSections(js, js2.slice().reverse(), 'results');

        //Group arrays by source.
        var src_array = [];
        for (var item in m) {
            src_array.push(m[item].src_id);
        }

        src_array = _.uniq(src_array);
        var src_obj_array = [];

        for (var i in src_array) {
            src_obj_array.push([]);
        }

        for (var item in m) {
            for (var iter in src_array) {
                if (m[item].src_id === src_array[iter]) {
                    src_obj_array[src_array[iter]].push(m[item]);
                }

            }
        }

        for (var objArray in src_obj_array) {
            //console.log(src_obj_array[objArray]);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(0);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(75);
                expect(partial_array[i].diff).to.exist;
                expect(partial_array[i].subelements).to.exist;
                expect(partial_array[i].subelements.results).to.exist;
                expect(partial_array[i].subelements.results.length).to.equal(15);
            }

        }

    });

    it('compare two different results sections that will have some partial match, some dups and some new', function () {

        var m = matchSections(js, js4, 'results');
        //console.log(m);

        //Group arrays by source.
        var src_array = [];
        for (var item in m) {
            src_array.push(m[item].src_id);
        }

        src_array = _.uniq(src_array);
        var src_obj_array = [];

        for (var i in src_array) {
            src_obj_array.push([]);
        }

        for (var item in m) {
            for (var iter in src_array) {
                if (m[item].src_id === src_array[iter]) {
                    src_obj_array[src_array[iter]].push(m[item]);
                }

            }
        }

        //Match One.
        expect(_.where(src_obj_array[0], {
            dest: 'dest'
        }).length).to.equal(3);
        expect(_.where(src_obj_array[0], {
            dest: 'src'
        }).length).to.equal(0);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[0], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(0);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'partial'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'duplicate'
        }).length).to.equal(1);

    });

});

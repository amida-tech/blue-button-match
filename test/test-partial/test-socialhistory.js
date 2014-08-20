/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;

var fs = require('fs');
var _ = require('underscore');
//var bbjs = require('blue-button');

var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3, js4;

before(function (done) {
    // vitals and vitals2 have non-intersecting set of values (e.g. all should be new)
    // each has 6 results
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory.json', 'utf-8').toString());
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory2.json', 'utf-8').toString());

    // vitals3a and vitals3b are the same, except 3b has hours added to date
    // (so it's partial match on fuzzy date)
    // each has 3 results
    js3 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory3.json', 'utf-8').toString());

    // has 1 dup element, 1 partial match (hours added to date) and 1 new element
    // 4a has 3 elements, 4b has 2 elements
    js4 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/socialhistory4.json', 'utf-8').toString());

    //console.log(bb);
    done();
});

describe('Social partial matching library tests', function () {

    it('compare two different social sections', function () {
        var m = matchSections(js, js2, 'social_history');

        //console.log(JSON.stringify(js3, null, 10));
        //console.log(JSON.stringify(js, null, 10));
        //console.log(m);

        expect(m.length).to.equal(28);
        expect(_.where(m, {
            dest: 'dest'
        }).length).to.equal(16);
        expect(_.where(m, {
            dest: 'src'
        }).length).to.equal(12);

        for (var item in m) {
            expect(m[item].match).to.equal("new");
            expect(m[item]).to.have.property('src_id');
            expect(m[item]).to.have.property('dest_id');
        }

    });

    it('compare social sections with itself', function () {
        var m = matchSections(js, js, 'social_history');

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

        for (var objArray in src_obj_array) {
            //console.log(src_obj_array[objArray]);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest'
            }).length).to.equal(4);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'duplicate'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'duplicate'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(3);
        }

    });

    it('compare two different social sections that will have all partial match', function () {
        var m = matchSections(js, js3, 'social_history');

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
            }).length).to.equal(4);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(3);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(25);
                expect(partial_array[i].diff).to.exist;
            }

        }

        //and now do the same but backwards
        var m = matchSections(js, js3.slice().reverse(), 'social_history');

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
            }).length).to.equal(4);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(3);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(25);
                expect(partial_array[i].diff).to.exist;
            }

        }

    });

    it('compare two different social sections that will have some partial match, some dups and some new', function () {
        var m = matchSections(js, js4, 'social_history');
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
        }).length).to.equal(3);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[0], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(3);
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

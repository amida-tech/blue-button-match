/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;
var _ = require('underscore');

var fs = require('fs');
//var bbjs = require('blue-button');

var matchSections = require("../../lib/match-sections.js").matchSections;

var js, js2, js3, js4;

before(function (done) {
    // 2 sample problems
    js = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems.json', 'utf-8').toString());

    //same as above but rearranged to be partial match
    js2 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems2.json', 'utf-8').toString());

    // has a bunch of problems different from all of the above
    js3 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems3.json', 'utf-8').toString());

    js4 = JSON.parse(fs.readFileSync('test/test-partial/fixtures/problems4.json', 'utf-8').toString());

    //console.log(bb);
    done();
});

describe('Problems partial matching library (problems.js) tests', function () {

    it('compare two different problems sections', function () {
        var m = matchSections(js, js3, 'problems');

        //console.log(JSON.stringify(js3, null, 10));
        //console.log(JSON.stringify(js, null, 10));
        //console.log(m);

        expect(m.length).to.equal(6);
        expect(_.where(m, {
            dest: 'dest'
        }).length).to.equal(4);
        expect(_.where(m, {
            dest: 'src'
        }).length).to.equal(2);

        for (var item in m) {
            expect(m[item].match).to.equal("new");
            expect(m[item]).to.have.property('src_id');
            expect(m[item]).to.have.property('dest_id');
        }

    });

    it('compare problems sections with itself', function () {
        var m = matchSections(js, js, 'problems');

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
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'duplicate'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'duplicate'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(1);
        }

    });

    it('compare two different problems sections that will have all partial match', function () {
        var m = matchSections(js, js2, 'problems');

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
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(1);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(95);
                expect(partial_array[i].diff).to.exist;
            }

        }

        //and now do the same but backwards
        var m = matchSections(js, js2.slice().reverse(), 'problems');

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
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(1);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(95);
                expect(partial_array[i].diff).to.exist;
            }

        }

    });

    it('compare two different problems sections that will have some partial match, some dups and some new', function () {
        var m = matchSections(js, js4, 'problems');
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
        }).length).to.equal(4);
        expect(_.where(src_obj_array[0], {
            dest: 'src'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[0], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'partial'
        }).length).to.equal(0);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'duplicate'
        }).length).to.equal(2);

        //Match Two.
        expect(_.where(src_obj_array[1], {
            dest: 'dest'
        }).length).to.equal(4);
        expect(_.where(src_obj_array[1], {
            dest: 'src'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(3);
        expect(_.where(src_obj_array[1], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'partial'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'duplicate'
        }).length).to.equal(0);

    });

});

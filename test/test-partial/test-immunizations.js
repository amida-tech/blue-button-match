/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var _ = require('underscore');

var fs = require('fs');
var path = require('path');

var matchSections = require(path.join(__dirname, "../../lib/match-sections.js")).matchSections;

var js, js2, js3, js4;

beforeAll(function (done) {
    // X sample immunizations
    js = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/immunizations.json'), 'utf-8').toString());

    //same as above but rearranged to be partial match
    js2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/immunizations2.json'), 'utf-8').toString());

    // has a bunch of immunizations different from all of the above
    js3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/immunizations3.json'), 'utf-8').toString());

    js4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/immunizations4.json'), 'utf-8').toString());

    //console.log(bb);
    done();
});

describe('Immunizations partial matching library (immunizations.js) tests', function () {

    it('compare two different immunizations sections', function () {
        var m = matchSections(js, js3, 'immunizations');

        //console.log(JSON.stringify(js3, null, 10));
        //console.log(JSON.stringify(js, null, 10));
        //console.log(m);

        expect(m.length).toBe(20);
        expect(_.where(m, {
            dest: 'dest'
        }).length).toBe(8);
        expect(_.where(m, {
            dest: 'src'
        }).length).toBe(12);

        for (var item in m) {
            expect(m[item].match).toBe("new");
            expect(m[item]).toHaveProperty('src_id');
            expect(m[item]).toHaveProperty('dest_id');
        }

    });

    it('compare immunizations sections with itself', function () {
        var m = matchSections(js, js, 'immunizations');

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
            }).length).toBe(4);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).toBe(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'duplicate'
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).toBe(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'duplicate'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).toBe(3);
        }

    });

    it('compare two different immunizations sections that will have all partial match', function () {
        var m = matchSections(js, js2, 'immunizations');

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
            }).length).toBe(4);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).toBe(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).toBe(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).toBe(3);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).toBe(50);
                expect(partial_array[i].diff).toBeDefined();
            }

        }

        //and now do the same but backwards
        var m = matchSections(js, js2.slice().reverse(), 'immunizations');

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
            }).length).toBe(4);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).toBe(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).toBe(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).toBe(3);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).toBe(50);
                expect(partial_array[i].diff).toBeDefined();
            }

        }

    });

    it('compare two different immunizations sections that will have some partial match, some dups and some new', function () {
        var m = matchSections(js, js4, 'immunizations');
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
        }).length).toBe(3);
        expect(_.where(src_obj_array[0], {
            dest: 'src'
        }).length).toBe(3);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'new'
        }).length).toBe(2);
        expect(_.where(src_obj_array[0], {
            dest: 'src',
            match: 'new'
        }).length).toBe(3);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'partial'
        }).length).toBe(1);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'duplicate'
        }).length).toBe(0);

        //Match Two.
        expect(_.where(src_obj_array[1], {
            dest: 'dest'
        }).length).toBe(3);
        expect(_.where(src_obj_array[1], {
            dest: 'src'
        }).length).toBe(3);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'new'
        }).length).toBe(3);
        expect(_.where(src_obj_array[1], {
            dest: 'src',
            match: 'new'
        }).length).toBe(3);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'partial'
        }).length).toBe(0);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'duplicate'
        }).length).toBe(0);

        //Match Three.
        expect(_.where(src_obj_array[3], {
            dest: 'dest'
        }).length).toBe(3);
        expect(_.where(src_obj_array[3], {
            dest: 'src'
        }).length).toBe(3);
        expect(_.where(src_obj_array[3], {
            dest: 'dest',
            match: 'new'
        }).length).toBe(2);
        expect(_.where(src_obj_array[3], {
            dest: 'src',
            match: 'new'
        }).length).toBe(3);
        expect(_.where(src_obj_array[3], {
            dest: 'dest',
            match: 'partial'
        }).length).toBe(0);
        expect(_.where(src_obj_array[3], {
            dest: 'dest',
            match: 'duplicate'
        }).length).toBe(1);

    });

});

/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var fs = require('fs');
var path = require('path');

var _ = require('underscore');

var matchSections = require(path.join(__dirname, "../../lib/match-sections.js")).matchSections;

var js, js2, js3, js4;
var js_f, js2_f;

beforeAll(function (done) {
    // 1 sample encounter
    js = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/encounters.json'), 'utf-8').toString());

    //same as above but rearranged to be partial match
    js2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/encounters2.json'), 'utf-8').toString());

    // has another encounter different from all of the above
    js3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/encounters3.json'), 'utf-8').toString());

    js4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/encounters4.json'), 'utf-8').toString());

    // 1 sample encounter but no findings
    js_f = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/encounters_f.json'), 'utf-8').toString());

    //same as above but rearranged to be partial match and no findings
    js2_f = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/encounters2_f.json'), 'utf-8').toString());

    //console.log(bb);
    done();
});

describe('Encounter partial matching library (encounters.js) tests', function () {

    it('compare two different encounters sections', function () {
        var m = matchSections(js, js3, 'encounters');

        //console.log(JSON.stringify(js2, null, 10));
        //console.log(JSON.stringify(js, null, 10));
        //console.log(m);

        expect(m.length).toBe(1);
        expect(_.where(m, {
            dest: 'dest'
        }).length).toBe(1);
        expect(_.where(m, {
            dest: 'src'
        }).length).toBe(0);

        for (var item in m) {
            expect(m[item].match).toBe("new");
            expect(m[item]).toHaveProperty('src_id');
            expect(m[item]).toHaveProperty('dest_id');
        }

    });

    it('compare encounters sections with itself', function () {
        var m = matchSections(js, js, 'encounters');

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
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'duplicate'
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'duplicate'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).toBe(0);
        }

    });

    it('compare two different encounters sections that will have all partial match', function () {
        var m = matchSections(js, js2, 'encounters');

        //console.log(JSON.stringify(js, null, 10));
        //console.log(JSON.stringify(js2, null, 10));
        //console.log(JSON.stringify(m, null, 10));

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
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).toBe(0);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).toBe(55);
                expect(partial_array[i].diff).toBeDefined();
                expect(partial_array[i].subelements).toBeDefined();
                expect(partial_array[i].subelements.findings).toBeDefined();
            }

        }

        //and now do the same but backwards
        var m = matchSections(js, js2.slice().reverse(), 'encounters');

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
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).toBe(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).toBe(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).toBe(0);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).toBe(55);
                expect(partial_array[i].diff).toBeDefined();
                expect(partial_array[i].subelements).toBeDefined();
                expect(partial_array[i].subelements.findings).toBeDefined();
            }

        }

    });

    it('compare two different encounters sections that will have all partial match (and empty findings)', function () {
        //console.log(JSON.stringify(js_f, null, 10));
        //console.log(JSON.stringify(js2_f, null, 10));

        var m = matchSections(js_f, js2_f, 'encounters');
        //console.log(JSON.stringify(m,null,4));

        for (var item in m) {
            expect(m[item].match).toBe("partial");
        }

        for (var item in m) {
            expect(m[item].match).toBe("partial");
        }

    });

    it('compare two different encounters sections that will have some partial match, some dups and some new', function () {

        var m = matchSections(js, js4, 'encounters');
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

        //console.log(src_obj_array[0]);

        //Match One.
        expect(_.where(src_obj_array[0], {
            dest: 'dest'
        }).length).toBe(3);
        expect(_.where(src_obj_array[0], {
            dest: 'src'
        }).length).toBe(0);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'new'
        }).length).toBe(1);
        expect(_.where(src_obj_array[0], {
            dest: 'src',
            match: 'new'
        }).length).toBe(0);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'partial'
        }).length).toBe(1);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'duplicate'
        }).length).toBe(1);

    });

});

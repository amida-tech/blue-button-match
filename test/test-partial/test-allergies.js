/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var expect = require('chai').expect;
var fs = require('fs');
var _ = require('underscore');
var path = require('path');

var matchSections = require(path.join(__dirname, "../../lib/match-sections.js")).matchSections;

var js, js2, js3, js4;

before(function (done) {
    // 2 sample allergies
    js = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/allergies.json'), 'utf-8').toString());

    //same as above but rearranged to be partial match
    js2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/allergies2.json'), 'utf-8').toString());

    // has a bunch of allergies different from all of the above
    js3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/allergies3.json'), 'utf-8').toString());

    // 1 of each from file 1.
    js4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/allergies4.json'), 'utf-8').toString());

    done();
});

//CCDA ONLY
describe('CCDA: Allergies partial matching library (allergies.js) tests', function () {

    it('compare two completely different allergies sections', function () {
        var m = matchSections(js, js3, 'allergies');

        //console.log(JSON.stringify(js2, null, 10));
        //console.log(JSON.stringify(js, null, 10));
        //console.log(m);

        expect(m.length).to.equal(9);
        expect(_.where(m, {
            dest: 'dest'
        }).length).to.equal(3);
        expect(_.where(m, {
            dest: 'src'
        }).length).to.equal(6);

        for (var item in m) {
            expect(m[item].match).to.equal("new");
            expect(m[item]).to.have.property('src_id');
            expect(m[item]).to.have.property('dest_id');
        }

    });

    it('compare allergies sections with itself', function () {
        var m = matchSections(js, js, 'allergies');

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
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'duplicate'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'duplicate'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(2);
        }

    });

    it('compare two different allergies sections that will have all partial match', function () {
        var m = matchSections(js, js2, 'allergies');

        //console.log(JSON.stringify(m, null, 4));

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
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(2);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(50);
                expect(partial_array[i].diff).to.exist;
                expect(partial_array[i].subelements).to.exist;
                expect(partial_array[i].subelements["observation"]["reactions"]).to.exist;
            }

        }

        //and now do the same but backwards
        var m = matchSections(js, js2.slice().reverse(), 'allergies');

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
            }).length).to.equal(3);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src'
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            }).length).to.equal(1);
            expect(_.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'new'
            }).length).to.equal(2);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'partial'
            }).length).to.equal(0);
            expect(_.where(src_obj_array[objArray], {
                dest: 'src',
                match: 'new'
            }).length).to.equal(2);

            var partial_array = _.where(src_obj_array[objArray], {
                dest: 'dest',
                match: 'partial'
            });

            for (var i in partial_array) {
                //console.log(partial_array[i]);
                expect(partial_array[i].percent).to.equal(50);
                expect(partial_array[i].diff).to.exist;
                expect(partial_array[i].subelements).to.exist;
                expect(partial_array[i].subelements["observation"]["reactions"]).to.exist;
            }

        }

    });

    it('compare two different allergies sections that will have a partial match, a dupe and a new', function () {

        var m = matchSections(js, js4, 'allergies');
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
        }).length).to.equal(2);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(3);
        expect(_.where(src_obj_array[0], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'partial'
        }).length).to.equal(0);
        expect(_.where(src_obj_array[0], {
            dest: 'dest',
            match: 'duplicate'
        }).length).to.equal(0);

        //Match Two.
        expect(_.where(src_obj_array[1], {
            dest: 'dest'
        }).length).to.equal(3);
        expect(_.where(src_obj_array[1], {
            dest: 'src'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[1], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'partial'
        }).length).to.equal(0);
        expect(_.where(src_obj_array[1], {
            dest: 'dest',
            match: 'duplicate'
        }).length).to.equal(1);

        //Match Three.
        expect(_.where(src_obj_array[2], {
            dest: 'dest'
        }).length).to.equal(3);
        expect(_.where(src_obj_array[2], {
            dest: 'src'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[2], {
            dest: 'dest',
            match: 'new'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[2], {
            dest: 'src',
            match: 'new'
        }).length).to.equal(2);
        expect(_.where(src_obj_array[2], {
            dest: 'dest',
            match: 'partial'
        }).length).to.equal(1);
        expect(_.where(src_obj_array[2], {
            dest: 'dest',
            match: 'duplicate'
        }).length).to.equal(0);

    });

});

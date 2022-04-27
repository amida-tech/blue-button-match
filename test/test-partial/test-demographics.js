/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var fs = require('fs');
var path = require('path');

var matchSingles = require(path.join(__dirname, "../../lib/match-single.js")).compare;

var js, js2, js3a, js3b, js4a, js4b;

beforeAll(function (done) {
    js = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/demographics.json'), 'utf-8').toString());

    //same demographics with some attributes changed (e.g. name, family status, languages)
    js2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/demographics2.json'), 'utf-8').toString());

    //console.log(js);
    done();
});

describe('Demographics partial matching library (demographics.js) tests', function () {

    it('compare demographics sections in edge cases', function () {
        var m = [matchSingles({}, {}, 'demographics')];

        expect(m.length).toBe(1);

        expect(m[0].match).toBe("duplicate");
        //console.log(m);

        var m = [matchSingles({}, js, 'demographics')];

        expect(m.length).toBe(1);

        expect(m[0].match).toBe("partial");
        //console.log(m);

        var m = [matchSingles(js, {}, 'demographics')];

        expect(m.length).toBe(1);

        expect(m[0].match).toBe("new");
        //console.log(m);

    });

    it('compare demographics sections with itself', function () {
        var m = [matchSingles(js, js, 'demographics')];

        //console.log(m);

        expect(m.length).toBe(1);

        expect(m[0].match).toBe("duplicate");

    });

    it('compare two different demographics sections that will have all partial match', function () {
        var m = [matchSingles(js, js2, 'demographics')];

        //console.log(m);

        expect(m.length).toBe(1);

        expect(m[0].match).toBe("partial");

    });

});

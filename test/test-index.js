var expect = require('chai').expect;
var assert = require('chai').assert;

var match = require('../index.js').match;

describe('index.js test', function () {

    it('compare two empty {}', function () {
        //expect(true).to.equal(true);
        var m = match({}, {});
        expect(m).to.be.ok;
    });

});

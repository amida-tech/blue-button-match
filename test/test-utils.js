var expect = require('chai').expect;
var assert = require('chai').assert;

var utils = require('../lib/utils.js');

//--------Test Data -----------//

//Base point date.
var date_one = {
    "point": {
        "date": "2007-01-03T00:00:00Z",
        "precision": "day"
    }
};

//Offset by greater than fuzzy range.
var date_one_diff = {
    "point": {
        "date": "2012-01-03T00:00:00Z",
        "precision": "day"
    }
};

//Offset by greater than fuzzy range.
var date_one_diff_negative = {
    "point": {
        "date": "1975-01-03T00:00:00Z",
        "precision": "day"
    }
};

//Base offset by a few hours.
var date_one_fuzzy = {
    "point": {
        "date": "2007-01-03T04:00:00Z",
        "precision": "day"
    }
};

//Base offset by a few hours.
var date_one_fuzzy_negative = {
    "point": {
        "date": "2007-01-02T04:00:00Z",
        "precision": "day"
    }
};

var date_two = {
    "low": {
        "date": "2007-01-03T00:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2012-05-15T00:00:00Z",
        "precision": "day"
    }
};

var date_two_diff_low = {
    "low": {
        "date": "2006-01-03T00:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2012-05-15T00:00:00Z",
        "precision": "day"
    }
};

var date_two_diff_high = {
    "low": {
        "date": "2007-01-03T00:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2013-05-15T00:00:00Z",
        "precision": "day"
    }
};

var date_two_diff_high_low = {
    "low": {
        "date": "2004-01-03T00:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2013-05-15T00:00:00Z",
        "precision": "day"
    }
};

var date_two_fuzzy_low = {
    "low": {
        "date": "2007-01-03T04:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2012-05-15T00:00:00Z",
        "precision": "day"
    }
};

var date_two_fuzzy_high = {
    "low": {
        "date": "2007-01-03T00:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2012-05-15T04:00:00Z",
        "precision": "day"
    }
};

var date_two_fuzzy_high_low = {
    "low": {
        "date": "2007-01-03T04:00:00Z",
        "precision": "day"
    },
    "high": {
        "date": "2012-05-15T04:00:00Z",
        "precision": "day"
    }
};

//--------Test Data -----------//

//utils:  diff, isDefined, dateMatch, resultTimeMatch, dateFuzzyMatch, rawPercentageMatch, lowerTrim, stringMatch, 
//booleanMatch, codedMatch,
//codematch and codematchwithTranslation should be dead.

describe('utils.js test', function () {

    it('test dateMatch', function () {
        expect(utils.dateMatch(date_one, date_one)).to.equal(true);
        expect(utils.dateMatch(date_one, date_one_diff)).to.equal(false);
        expect(utils.dateMatch(date_two, date_two)).to.equal(true);
        expect(utils.dateMatch(date_two, date_two_diff_low)).to.equal(false);
    });

    it('test dateFuzzyMatch 1-1', function () {
        expect(utils.dateFuzzyMatch(date_one, date_one)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one, date_one_fuzzy)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one, date_one_fuzzy_negative)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one, date_one_diff_negative)).to.equal(false);
        expect(utils.dateFuzzyMatch(date_one, date_one_diff)).to.equal(false);
    });

    it('test dateFuzzyMatch 2-2', function () {
        expect(utils.dateFuzzyMatch(date_two, date_two)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_two, date_two_diff_low)).to.equal(false);
        expect(utils.dateFuzzyMatch(date_two, date_two_diff_high)).to.equal(false);
        expect(utils.dateFuzzyMatch(date_two, date_two_fuzzy_low)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_two, date_two_fuzzy_high)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_two, date_two_fuzzy_high_low)).to.equal(true);
    });

    it('test dateFuzzyMatch 1-2 and 2-1', function () {
        expect(utils.dateFuzzyMatch(date_one, date_two)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_two, date_one)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one_fuzzy, date_two)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one, date_two_fuzzy_low)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one, date_two_fuzzy_high)).to.equal(true);
        expect(utils.dateFuzzyMatch(date_one, date_two_diff_high_low)).to.equal(false);
        expect(utils.dateFuzzyMatch(date_one_diff, date_two)).to.equal(false);
    });

    it('test diff', function () {
        var a = {
            "a": "a",
            "b": "b",
            "c": "c"
        };
        var b = {
            "a": "not a",
            "b": "not b",
            "c": "not c"
        };
        var c = {
            "d": "d"
        };
        var d = {
            "a": "not a",
            "b": "b"
        };

        var el;
        var diff;

        diff = utils.diff(a, a);
        for (el in diff) {
            expect(diff[el]).to.equal("duplicate");
        }

        diff = utils.diff(a, b);
        for (el in diff) {
            expect(diff[el]).to.equal("new");
        }

        diff = utils.diff(a, c);
        for (el in diff) {
            expect(diff[el]).to.equal("new");
        }

        diff = utils.diff(a, d);
        expect(diff["a"]).to.equal("new");
        expect(diff["b"]).to.equal("duplicate");

    });

});

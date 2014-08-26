"use strict";

var equal = require('deep-equal');
var utils = require('./utils.js');
var _ = require('underscore');

//Full comparison of two demographics JSON elements for equality and/or diff
exports.compare = function compare(a, b, section) {

    //excellent code here
    if (equal(a, {}) && equal(b, {})) {
        return {
            "match": "duplicate",
            "percent": 100,
            "src_id": 0,
            "dest_id": 0
        };

        //comparing non-empty demographics section with empty master record
    } else if (equal(b, {})) {
        return {
            "match": "new",
            "percent": 0,
            "src_id": 0,
            "dest_id": 0
        };
    } else if (equal(a, b)) {
        return {
            "match": "duplicate",
            "percent": 100,
            "src_id": 0,
            "dest_id": 0
        };
    } else {

        var diff = utils.diff(a, b);

        var pctOutput = 0;
        var pctTotal = _.values(diff);
        var pctDiff = _.groupBy(pctTotal, function (num) {
            return num;
        });

        if (_.isObject(pctDiff.duplicate)) {
            pctOutput = Math.round((pctDiff.duplicate.length / pctTotal.length) * 100);
        }

        return {
            "match": "partial",
            "percent": pctOutput,
            "diff": diff,
            "src_id": 0,
            "dest_id": 0
        };
    }
};

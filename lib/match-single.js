"use strict";

var equal = require('deep-equal');

var utils = require('./utils.js');

//Full comparison of two demographics JSON elements for equality and/or diff
exports.compare = function compare(a, b, section) {
    //console.log(a);
    //console.log(b);
    //excellent code here
    if (equal(a, {}) && equal(b, {})) {
        return {
            "match": "duplicate",
            "src_id": 0,
            "dest_id": 0
        };
        //comparing non-empty demographics section with empty master record
    } else if (equal(b, {})) {
        return {
            "match": "new",
            "src_id": 0,
            "dest_id": 0
        };
    } else if (equal(a, b)) {
        return {
            "match": "duplicate",
            "src_id": 0,
            "dest_id": 0
        };
    } else {

        var diff = utils.diff(a[section], b[section]);

        return {
            "match": "diff",
            "diff": diff,
            "src_id": 0,
            "dest_id": 0
        };
    }
};

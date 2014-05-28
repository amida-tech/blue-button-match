"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two socialHistory JSON elements for equality and/or diff
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a,{}) && equal(b,{})) {
        return {
            "match": "duplicate"
        };
    //comparing non-empty social history section with empty master record
    } else if (equal(b,{})) {
        return {
            "match": "new"
        };
    } else if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {

        var diff = utils.diff(a,b);
        
        return {
            "match": "diff",
            "diff": diff
        };
    }
};

"use strict";

var equal = require("deep-equal");

// Compare two elements
// returning {"match": "duplicate/new"} result
// Wrapping simple deep comparison of JSON objects

exports.compare = function compare(a, b) {
    if (arguments.length !== 2) {
        throw "two arguments are required for compare function";
    }

    //console.log("a "+a);
    //console.log("b "+b);
    //console.log(a);
    //console.log(b);
    //console.log(equal(a,b));

    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        return {
            "match": "new"
        };
    }
};

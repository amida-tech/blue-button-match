"use strict";

var equal = require('deep-equal');

//Full comparison of two encounter.findings JSON sub-elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("encounter specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        var code_undefined = (a.code === undefined && b.code === undefined);
        var code_system_undefined = (a.code_system_name === undefined && b.code_system_name=== undefined);


        // same finding +50%
        if (a.code === b.code && a.code_system_name === b.code_system_name && !code_undefined && !code_system_undefined) {
            pct = pct + 95;

        }

        //console.log({"match": "partial", "percent" : pct});
        if (pct === 0)
            return {
                "match": "new"
            };

        return {
            "match": "partial",
            "percent": pct
        };
    }

    return {
        "match": "new"
    };
};

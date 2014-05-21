"use strict";

var equal = require('deep-equal');

//Full comparison of two allergies.reactions JSON sub-elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("allergy specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same allergen +50%
        if (a.code === b.code && a.code_system_name === b.code_system_name) {
            pct = pct + 50;

            // same severity +25%
            if (a.severity === b.severity) {
                pct = pct + 25;
            }
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

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
        var code_undefined = (a.code === undefined && b.code === undefined);
        var code_system_undefined = (a.code_system_name === undefined && b.code_system_name=== undefined);

        // same allergen +50%
        if (a.code === b.code && a.code_system_name === b.code_system_name && !code_undefined && !code_system_undefined) {
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

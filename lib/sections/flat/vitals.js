"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two vitals JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("vitals specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same vital sign +50%
        if (a.code === b.code && a.code_system_name === b.code_system_name) {
            pct = pct + 50;

            // same date +45%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 45;
            }
            // similar date +25%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 25;
            }
            //if dates don't match at all, vitals are not partially matched
            else {
                pct = 0;
            }

        }

        var diff = utils.diff(a,b);

        //console.log({"match": "partial", "percent" : pct});
        if (pct === 0)
            return {
                "match": "new"
            };

        return {
            "match": "partial",
            "percent": pct,
            "diff": diff
        };
    }

    return {
        "match": "new"
    };
};

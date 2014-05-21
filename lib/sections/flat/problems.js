"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two problems JSON elements for equality and partial match
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


            // same status +10%
            if (a.status===b.status) {
                pct = pct + 10;
            }

            // same negation indicator +10%
            if (a.negation_indicator===b.negation_indicator) {
                pct = pct + 10;
            }

            // same date +25%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 25;
            }
            // similar date +15%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 15;
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

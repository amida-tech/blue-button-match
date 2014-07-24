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

         if (a.problem === undefined) {
            a.problem = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

         if (b.problem === undefined) {
            b.problem = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }
        var code_undefined = (a.problem.code === undefined && b.problem.code === undefined);
        var code_system_undefined = (a.problem.code_system_name === undefined && b.problem.code_system_name=== undefined);

        // same vital sign +50%
        if (a.problem.code === b.problem.code && a.problem.code_system_name === b.problem.code_system_name && !code_undefined && !code_system_undefined) {
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

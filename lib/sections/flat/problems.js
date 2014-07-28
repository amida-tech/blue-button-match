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

        // same vital sign +50%
        if (utils.codeMatch(a.problem.code, b.problem.code, a.problem.code_system_name, b.problem.code_system_name) ) {
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

        else if (a.problem.code !== b.problem.code || a.problem.code_system_name !== b.problem.code_system_name){
            pct = 0;
        }

        //this is a very rough edged version. Else part here is for cms.
        //Otherwise, divide up the larger of the two
        else {

            //creating temps so it doesn't affect diff
            pct = utils.rawPercentageMatch(pct, a, b);
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

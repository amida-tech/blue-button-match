"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two sub-results JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("results specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        if (a.result === undefined) {
            a.result = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        if (b.result === undefined) {
            b.result = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        var code_undefined = (a.result.code === undefined && b.result.code === undefined);
        var code_system_undefined = (a.result.code_system_name === undefined && b.result.code_system_name=== undefined);
        // same result code +50%
        if (a.result.code === b.result.code && a.result.code_system_name === b.result.code_system_name && !code_undefined && !code_system_undefined ){
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

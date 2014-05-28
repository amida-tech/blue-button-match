"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two medication JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("medications specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same medication code (including translations) sign +50%
        if (utils.codeMatchWithTranslation(a.product.code, a.product.code_system_name, a.product.translations,
            b.product.code, b.product.code_system_name, b.product.translations
        )) {

            pct = pct + 50;

            // same status +20%
            if (a.status === b.status) {
                pct = pct + 20;
            }

            // same date +20%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 20;
            }
            // similar date +10%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 10;
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

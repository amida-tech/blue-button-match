"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two immunizations JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("immunization specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same medication code (including translations) sign +50%
        if (utils.codeMatchWithTranslation(a.product.code, a.product.code_system_name, a.product.translations,
            b.product.code, b.product.code_system_name, b.product.translations
        )) {

            pct = pct + 50;

            // same date +25%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 25;
            }
            // similar date +15%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 15;
            }

        }

        // if not same status =0% (must match)
        if (a.status !== b.status) {
            pct = 0;
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

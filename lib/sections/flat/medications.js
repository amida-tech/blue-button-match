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


         if (a.product === undefined) {
            a.product = {};
            a.product.product = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

         if (b.product === undefined) {
            b.product = {};
            b.product.product = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        if (a.product.product === undefined) {
            a.product.product = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        if (b.product.product === undefined) {
            b.product.product = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        var code_undefined = (a.product.product.code === undefined || a.product.product.code === undefined);
        var code_system_undefined = (a.product.product.code_system_name === undefined ||  a.product.product.code_system_name=== undefined);

        // same medication code (including translations) sign +50%
        if (utils.codeMatchWithTranslation(a.product.product.code, a.product.product.code_system_name, a.product.product.translations,
            b.product.product.code, b.product.product.code_system_name, b.product.product.translations
        ) && !code_undefined && !code_system_undefined ) {

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

        pct = Math.round(pct * 100) / 100;

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

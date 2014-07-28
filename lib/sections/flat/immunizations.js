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
        /*
        console.log("immunization specific comparison");
        console.log(JSON.stringify(a, null, 4));
        console.log('--------------');
        console.log(JSON.stringify(b, null, 4));
        */
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
        ) && !code_undefined && !code_system_undefined) {

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

        else if (a.product.product.code !== b.product.product.code || a.product.product.code_system_name !== b.product.product.code_system_name){
            pct = 0;
        }

        //this is a very rough edged version. Else part here is for cms.
        //Otherwise, divide up the larger of the two
        else {

            //creating temps so it doesn't affect diff
            pct = utils.rawPercentageMatch(pct, a, b);
        }

        // if not same status =0% (must match)
        if (a.status !== b.status) {
            pct = 0;
        }





        var diff = utils.diff(a, b);

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

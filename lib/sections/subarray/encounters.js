"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

var matchSubarrays = require('../../match-subarrays.js').matchSubarrays;
var compareFindings = require('./encounters-finding.js').compare;

//TODO: Not done yet!

//Full comparison of two allergies JSON elements for equality and partial match
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
        var subarray = [];

        //TODO: relies on normalization of code attribute in parser

        if (a.encounter === undefined) {
            a.encounter = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        if (b.encounter === undefined) {
            b.encounter = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        // same allergen +50%
        if (utils.codeMatchWithTranslation(a.encounter.code, a.encounter.code_system_name, a.encounter.translations,
            b.encounter.code, b.encounter.code_system_name, b.encounter.translations
        )) {
            pct = pct + 50;

            // same date +45%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 45;
            }
            // similar date +25%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 25;
            }
            //if dates don't match, it is different encounter
            else {
                pct=0;
            }

            //if subarrays are missing, replace them with empty ones
            if (typeof a.findings==="undefined") a.findings=[];
            if (typeof b.findings==="undefined") b.findings=[];

            subarray = matchSubarrays(a.findings, b.findings, compareFindings);
            //console.log("sub:",subarray);
            //console.log(subarray.length);
        }

        var diff = utils.diff(a,b);

        //console.log({"match": "partial", "percent" : pct});
        if (pct === 0)
            return {
                "match": "new"
            };

        if (subarray.length > 0) {
            return {
                "match": "partial",
                "percent": pct,
                "subelements": subarray,
                "diff": diff

            };
        } else {
            return {
                "match": "partial",
                "percent": pct,
                "diff": diff
            };
        }
    }

    return {
        "match": "new"
    };
};

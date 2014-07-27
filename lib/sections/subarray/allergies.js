"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

var matchSubarrays = require('../../match-subarrays.js').matchSubarrays;
var compareReactions = require('./allergies-reaction.js').compare;

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
        //console.log(JSON.stringify(a, null, 4));
        //console.log('--------------');
        //console.log(JSON.stringify(b, null, 4));
        var pct = 0;
        var subarray = [];
        console.log('---------------');

        //TODO: relies on normalization of code attribute in parser

        //temporary, we must be something about undefined fields since they evaluate to true...
        var code_undefined = (a.allergen.code === undefined && b.allergen.code === undefined);
        var code_system_undefined = (a.allergen.code_system_name === undefined && b.allergen.code_system_name === undefined);

        // same allergen +50%
        if (a.allergen.code === b.allergen.code && a.allergen.code_system_name === b.allergen.code_system_name && !code_undefined && !code_system_undefined) {
            pct = pct + 50;
            // same date +45%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 45;
            }
            // similar date +25%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 25;
            }

            //if subarrays are missing, replace them with empty ones
            if (typeof a.reaction === "undefined") a.reaction = [];
            if (typeof b.reaction === "undefined") b.reaction = [];

            subarray = matchSubarrays(a.reaction, b.reaction, compareReactions);
            //console.log("sub:",subarray);
            //console.log(subarray.length);
        }



        else if (a.allergen.code !== b.allergen.code || a.allergen.code_system_name !== b.allergen.code_system_name){
            pct = 0;
        }

        //this is a very rough edged version. Else part here is for cms.
        //Otherwise, divide up the larger of the two
        else {

            //creating temps so it doesn't affect diff
            var a2 = JSON.parse(JSON.stringify(a));
            var b2 = JSON.parse(JSON.stringify(b));

            var pctRemaining = 100 - pct;
            var aLength = Object.keys(a2).length;
            var bLength = Object.keys(b2).length;
            var comparisonLength = 0;
            comparisonLength = (aLength > bLength) ? aLength : bLength;
            if (aLength > bLength) {

            }

            var pctPerField = pctRemaining / comparisonLength;
            for (var key in a2) {
                if (key in b2) {
                    var aVal = a2[key];
                    var bVal = b2[key];
                    if (equal(aVal, bVal)) {
                        pct = pct + pctPerField;
                    }
                }
            }
        }

        var diff = utils.diff(a, b);

        pct = Math.round(pct * 100) / 100;

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

"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

var matchSubarrays = require('../../match-subarrays.js').matchSubarrays;
var compareResults = require('./results-subresults.js').compare;

//Full comparison of two allergies JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here

    //console.log(a,b);

    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("results specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;
        var subarray = [];

        //TODO: relies on normalization of code attribute in parser

        // same panel +95%
        if (a.code === b.code && a.code_system_name === b.code_system_name) {
            pct = pct + 95;

            var a_range=a.results.map(function(x){return x.date}).reduce(function(previousValue, currentValue, index, array){return previousValue.concat(currentValue)});
            var b_range=b.results.map(function(x){return x.date}).reduce(function(previousValue, currentValue, index, array){return previousValue.concat(currentValue)});

            var a_min, a_max, b_min, b_max

            var minDate=function(prev, curr){
                return prev.date>curr.date? curr:prev
            };

            var maxDate=function(prev, curr){
                return prev.date<curr.date? curr:prev
            };

            a_min=a_range.reduce(minDate);
            a_max=a_range.reduce(maxDate);
            a_range=[a_min,a_max];

            b_min=b_range.reduce(minDate);
            b_max=b_range.reduce(maxDate);
            b_range=[b_min,b_max];

            //console.log(a_range);
            //console.log(b_range);

            // not similar date range, different panel
            if (!utils.dateFuzzyMatch(a_range, b_range)) {
                pct=0;
            }

            subarray = matchSubarrays(a.results, b.results, compareResults);
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

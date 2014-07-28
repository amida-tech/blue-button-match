"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two vitals JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        /*
        console.log(JSON.stringify(a, null, 4));
        if(a.date){
            console.log((a.date)[0].date);
        }
        console.log('--------------');
        console.log(JSON.stringify(b, null, 4));
        if(a.date){
            console.log((a.date)[0].date);
        }
        */
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        if (a.vital === undefined) {
            a.vital = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        if (b.vital === undefined) {
            b.vital = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }




        // same vital sign +50%
        if (utils.codeMatch(a.vital.code, a.vital.code_system_name, b.vital.code, b.vital.code_system_name)) {
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

        else if ((a.vital.code !== b.vital.code || a.vital.code_system_name !== b.vital.code_system_name)
         && utils.isDefined(a.vital.code, b.vital.code, a.vital.code_system_name, b.vital.code_system_name)){
            pct = 0;
        }

        else if(a.vital.name ==== b.vital.name && a.vital.name !== undefined && b.vital.name !== undefined){
            pct = pct + 50;
        }


        else {
            //creating temps so it doesn't affect diff
            pct = utils.rawPercentageMatch(pct, a, b);
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

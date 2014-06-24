"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two procedures JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //console.log("procedures specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        
         if (a.procedure === undefined) {
            a.procedure = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

         if (b.procedure === undefined) {
            b.procedure = {
                code: null,
                code_system_name: null,
                translations: []
            };
        }

        // same vital sign +50%
        if (a.procedure.code === b.procedure.code && a.procedure.code_system_name === b.procedure.code_system_name) {
            pct = pct + 50;


            //TODO: do eval of array of bodysites
            // same bodysite +10%
            //if (a.bodysite.code === b.bodysite.code && a.bodysite.code_system_name === b.bodysite.code_system_name) {
            //    pct = pct + 10;
            //}

            // same date +25%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 25;
            }
            // similar date +15%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 15;
            }


        }

        //status must be the same
        if (a.status!==b.status)
        {
            pct=0;
        }

        //procedure type must be the same
        if (a.procedure_type!==b.procedure_type)
        {
            pct=0;
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

"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

//Full comparison of two insurance JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {
        //logical make the most important stuff 60%.

        //TODO: defining new entries should be moved to utils later.
        var policy_numbers_undefined = (a.policy_number === undefined && b.policy_number === undefined);
        var plan_ids_undefined = (a.plan_id === undefined && b.plan_id === undefined);
        var payer_ids_undefined = (a.payer_id === undefined && b.payer_id === undefined);

        var pct = 0;
        if(a.plan_id === undefined && plan_ids_undefined){
            a.plan_id = {};
        }
        if(b.plan_id === undefined && plan_ids_undefined){
            b.plan_id = {};
        }
        if(a.policy_number === undefined && policy_numbers_undefined){
            a.policy_number = "";
        }
        if(b.policy_number === undefined && policy_numbers_undefined){
            b.policy_number = "";
        }
        if(a.payer_id === undefined && payer_ids_undefined){
            a.payer_id = {};
        }
        if(b.payer_id === undefined && payer_ids_undefined){
            b.payer_id = {};
        }


        if(equal(a.policy_number, b.policy_number) && !policy_numbers_undefined) {
            pct = pct + 20;
        }
        if(equal(a.plan_id, b.plan_id) && !plan_ids_undefined){
            pct = pct + 10;
        }
        if(equal(a.payer_id, b.payer_id) && !payer_ids_undefined){
            pct = pct + 10;
        }

        //calculating percentages based off object a.


        var a2 = JSON.parse(JSON.stringify(a));
        var b2 = JSON.parse(JSON.stringify(b));

        //delete already compared entries

        delete a2.policy_number;
        delete a2.plan_id;
        delete a2.payer_id;

        delete b2.policy_number;
        delete b2.plan_id;
        delete b2.payer_id;

        /*find the remaining percentage left after heavily weighted entries are
        compared */

        var pctRemaining = 100 - pct;
        var pctPerField = pctRemaining/Object.keys(a2).length;
        for(var key in a2){
            if(key in b2 ){
                var aVal = a2[key];
                var bVal = b2[key];
                if(equal(aVal, bVal)){
                    pct = pct + pctPerField;
                }
            }
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

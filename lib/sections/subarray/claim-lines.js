"use strict";

var equal = require('deep-equal');

//Full comparison of two claim lines.reactions JSON sub-elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {


        var pct = 0;

        //TODO: relies on normalization of code attribute in parser

        // same claim-charges +50%
        if(equal(a.charges, b.charges)){
            pct = pct + 50;
        }

        delete a.charges;
        delete b.charges;

        var pctRemaining = 100 - pct;
        var pctPerField = pctRemaining/Object.keys(a2).length;
        for(var key in a){
            if(key in b ){
                var aVal = a[key];
                var bVal = b[key];
                if(equal(aVal, bVal)){
                    pct = pct + pctPerField;
                }
            }
        }

        if(pct >=100){
            return {
                "match": "duplicate"
            };
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

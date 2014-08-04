"use strict";

var equal = require('deep-equal');
var utils = require('../../utils.js');

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

        //dereferencing the original passed down object
        a = JSON.parse(JSON.stringify(a));
        b = JSON.parser(JSON.stringify(b));

        delete a.charges;
        delete b.charges;

        pct = utils.rawPercentageMatch(pct, a, b);




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

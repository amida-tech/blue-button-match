"use strict";

var equal = require('deep-equal');

var utils = require('../../utils.js');

var matchSubarrays = require('../../match-subarrays.js').matchSubarrays;
var compareLines = require('./allergies-reaction.js').compare;

//TODO: Not done yet!

//Full comparison of two claims JSON elements for equality and partial match
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    }

    else {
        //console.log("allergy specific comparison");
        //console.log(a);
        //console.log(b);
        var pct = 0;
        var subarray = [];

        //TODO: relies on normalization of code attribute in parser

        //implement better matching logic here.
        var lines_undefined = (a.lines === undefined && b.lines === undefined);
        var name_undefined = (a.name === undefined && b.name === undefined);
        var payer_undefined = (a.payer === undefined && b.payer === undefined);
        var number_undefined = (a.number === undefined && b.number === undefined);
        var service_undefined = (a.service=== undefined && b.service === undefined);

        if( equal(a.lines, b.lines) && !lines_undefined){
            pct += 50;
        }

        if(equal(a.name, b.name) && !name_undefined){
            pct += 5;
        }
        if(equal(a.number, b.number) && !number_undefined){
            pct += 5;
        }
        if(equal(a.payer, b.payer) && !payer_undefined){
            pct += 5;

        }
        if(equal(a.service, b.service) && !service_undefined){
            pct += 5;
        }


        var a2 = JSON.parse(JSON.stringify(a));
        var b2 = JSON.parse(JSON.stringify(b));

        delete a2.name
        delete a2.number;
        delete a2.payer;
        delete a2.service;
        delete a2.lines;

        delete b2.name;
        delete b2.number;
        delete b2.payer;
        delete b2.service;
        delete b2.lines;

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

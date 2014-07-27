"use strict";

var equal = require('deep-equal');
var XDate = require("xdate");

//compares two BB JSON entries (for any section) and provides high level diff
exports.diff = function(a, b) {
    var diff={};

    //need special handling for dates, subarrays, etc
    for (var key in a) {
        //master has same property already
        if (b[key]) {
            if (equal(a[key], b[key])) {
                diff[key] = "duplicate";
            } else {
                diff[key] = "new";
            }

        }
        //master doesn't have this property
        else {
            diff[key] = "new";
        }

    }

    return diff;
};


//compares two dates objects for precise equality
exports.dateMatch = function(date1, date2) {
    return equal(date1, date2);
};


//compares two dates objects fuzzily (e.g. are they intersecting)
exports.dateFuzzyMatch = function(date1, date2) {
    var d1, d2, d1end, d2end, diff, diff2;

    if (!date1 || !date2) {
        return false;
    }

    //1-1
    if (date1.length === 1 && date2.length === 1) {
        d1 = new XDate(date1[0].date);
        d2 = new XDate(date2[0].date);

        diff = d1.diffDays(d2);

        //if dates ~1 day apart, treat them the same
        return (diff <= 1 && diff >= -1);
    }

    //1-2
    if (date1.length === 1 && date2.length === 2) {
        d1 = new XDate(date1[0].date);
        d2 = new XDate(date2[0].date);
        d2end = new XDate(date2[1].date);

        diff = d1.diffDays(d2);
        diff2 = d1.diffDays(d2end);

        //id date1 in range of date2
        return (diff <= 0 && diff2 >= 0);
    }

    //2-1
    if (date1.length === 2 && date2.length === 1) {
        d1 = new XDate(date1[0].date);
        d1end = new XDate(date1[1].date);
        d2 = new XDate(date2[0].date);

        diff = d2.diffDays(d1);
        diff2 = d2.diffDays(d1end);

        //id date1 in range of date2
        return (diff <= 0 && diff2 >= 0);
    }

    //2-2
    if (date1.length === 2 && date2.length === 2) {
        d1 = new XDate(date1[0].date);
        d1end = new XDate(date1[1].date);
        d2 = new XDate(date2[0].date);
        d2end = new XDate(date2[1].date);

        diff = d1.diffDays(d2end);
        diff2 = d1end.diffDays(d2);

        //return true if overlap e.g. (StartA <= EndB)  and  (EndA >= StartB)
        return ((diff >= 0) && (diff2 <= 0));
    }

    return false;
};


//abstracted code match, takes into account undefineds.
exports.codeMatch = function(a_code,a_code_system_name,  b_code, b_code_system_name){

    var code_undefined = (a_code === undefined && b_code === undefined);
    var code_system_undefined = (a_code_system_name === undefined && b_code_system_name === undefined);
    if(code_undefined || code_system_undefined){
        return false;
    }

    else if (a_code === b_code && a_code_system_name === b_code_system_name && !code_undefined && !code_system_undefined) {
        return true;
    }
    else{
        return false;
    }
};




//compares two elements codes including translations, and returns true if there is a match
exports.codeMatchWithTranslation = function(a_code, a_code_system_name, a_translations,
    b_code, b_code_system_name, b_translations) {

    var a;
    if (a_translations) {
        a = a_translations.slice();
    } else {
        a = [];
    }
    var b;
    if (b_translations) {
        b = b_translations.slice();
    } else {
        b = [];
    }

    a.push({
        "code": a_code,
        "code_system_name": a_code_system_name
    });
    b.push({
        "code": b_code,
        "code_system_name": b_code_system_name
    });

	//console.log(a,b);


    for (var i in a) {
        for (var j in b) {
            if (a[i].code === b[j].code && a[i].code_system_name === b[j].code_system_name) {
                return true;
            }
        }
    }


    return false;
};

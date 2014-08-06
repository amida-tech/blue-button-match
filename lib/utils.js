"use strict";

var equal = require('deep-equal');
var XDate = require("xdate");
var _ = require('underscore');

//compares two BB JSON entries (for any section) and provides high level diff
exports.diff = function (a, b) {
    var diff = {};

    //need special handling for dates, subarrays, etc
    for (var key in a) {
        //master has same property already
        if (b[key]) {
            if (equal(a[key], b[key])) {
                diff[key] = "duplicate";
            }
            else {
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
exports.isDefined = function(){
     for (var i = 0; i < arguments.length; i++){
        if(arguments[i] === undefined){
            return false;
        }
    }
        return true;
};


exports.dateMatch = function (date1, date2) {

    if ( _.isUndefined(date1) || _.isUndefined(date2)) {
        return false;
    }

    return equal(date1, date2);
};

//compares two dates objects fuzzily (e.g. are they intersecting)
exports.dateFuzzyMatch = function (date1, date2) {
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

//function compares ALL top level keys, assigns equal weight to ALL fields
exports.rawPercentageMatch = function (pct, a, b) {

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

    return pct;

};

function lowerTrim (inputString) {
    return inputString.trim().toLowerCase();
}

exports.stringMatch = function (a_string_entry, b_string_entry) {

    if (a_string_entry && b_string_entry) {
        if (lowerTrim(a_string_entry) === lowerTrim(b_string_entry)) {
            return true;
        }
    }

}

//new match by mm, designed to handle any coded object and match consistently.
exports.codedMatch = function (a_coded_entry, b_coded_entry) {

    //If either object is undefined, it doesn't exist in the object, and should be returned as a non-match.
    if (_.isUndefined(a_coded_entry) || _.isUndefined(b_coded_entry)) {
        return false;
    }

    var a_array = [a_coded_entry];
    var b_array = [b_coded_entry];

    if (a_coded_entry.translations) {
        for (var i in a_coded_entry.translations) {
            a_array.push(a_coded_entry.translations[i]);
        }
    }

    if (b_coded_entry.translations) {
        for (var i in b_coded_entry.translations) {
            b_array.push(b_coded_entry.translations[i]);
        }
    }

    for (var a in a_array) {
        for (var b in b_array) {

            //console.log(a_array[a]);

            if (a_array[a].name && b_array[b].name) {
                if (lowerTrim(a_array[a].name) === lowerTrim(b_array[b].name)) {
                    return true;
                }
            }

            if (a_array[a].code && a_array[a].code_system_name && b_array[b].code && b_array[b].code_system_name) {
                if ( (lowerTrim(a_array[a].code) === lowerTrim(b_array[b].code)) && (lowerTrim(a_array[a].code_system_name) === lowerTrim(b_array[b].code_system_name)) ) {
                    return true;
                }
            }

        }
    }



    if (a_coded_entry.name && b_coded_entry.name) {
        if (lowerTrim(a_coded_entry.name) === lowerTrim(b_coded_entry.name)) {
            return true;
        }
    }

    //If the code systems match, match them.
    if (a_coded_entry.code && a_coded_entry.code_system_name && b_coded_entry.code && b_coded_entry.code_system_name) {
        if ( (lowerTrim(a_coded_entry.code) === lowerTrim(b_coded_entry.code)) && (lowerTrim(a_coded_entry.code_system_name) === lowerTrim(b_coded_entry.code_system_name)) ) {
            return true;
        }
    }

    //TODO:  Add in translation object evaluation, by pushing to sub function and re-running over loop objects.

    return false;

};

//abstracted code match, takes into account undefineds.
exports.codeMatch = function (a_code, a_code_system_name, b_code, b_code_system_name) {

    var code_undefined = (a_code === undefined || b_code === undefined);
    var code_system_undefined = (a_code_system_name === undefined || b_code_system_name === undefined);
    if (code_undefined || code_system_undefined) {
        return false;
    } else if (a_code === b_code && a_code_system_name === b_code_system_name && !code_undefined && !code_system_undefined) {
        return true;
    } else {
        return false;
    }
};

//compares two elements codes including translations, and returns true if there is a match
exports.codeMatchWithTranslation = function (a_code, a_code_system_name, a_translations,
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

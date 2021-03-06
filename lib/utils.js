"use strict";

var equal = require('deep-equal');
var _ = require('underscore');

var moment = require('moment');

//compares two BB JSON entries (for any section) and provides high level diff
exports.diff = function (a, b) {
    var diff = {};

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
exports.isDefined = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] === undefined) {
            return false;
        }
    }
    return true;
};

exports.resultTimeMatch = function (resultObject1, resultObject2) {

    //Note:  Only currently supports point.  Should be expanded here.
    var resultArray1 = [];
    var resultArray2 = [];

    //Build arrays of all dates in each object.
    for (var i in resultObject1) {
        resultArray1.push(moment(resultObject1[i].date_time.point.date));
    }

    for (var ii in resultObject2) {
        resultArray2.push(moment(resultObject2[ii].date_time.point.date));
    }

    var maxMomA = moment.max(resultArray1);
    var minMomA = moment.min(resultArray1);
    var maxMomB = moment.max(resultArray2);
    var minMomB = moment.min(resultArray2);

    var maxDiff = Math.abs(maxMomA.diff(maxMomB, 'hours'));
    var minDiff = Math.abs(minMomA.diff(minMomB, 'hours'));

    //console.log(maxDiff);
    //console.log(minDiff);

    if (maxDiff < 24) {
        return true;
    }

    if (minDiff < 24) {
        return true;
    }

    return false;
};

exports.dateMatch = function (date1, date2) {

    if (_.isUndefined(date1) || _.isUndefined(date2)) {
        return false;
    }

    return equal(date1, date2);
};

//compares two dates objects fuzzily (e.g. are they intersecting)
exports.dateFuzzyMatch = function (date1, date2) {
    //var d1, d2, d1end, d2end, diff, diff2;

    if (_.isUndefined(date1) || _.isUndefined(date2)) {
        return false;
    }

    //Pushing to array, in event either low or high are only present, will still do 1:1.
    var dateArr1 = [];
    var dateArr2 = [];

    if (date1.center) {
        dateArr1.push(date1.center.date);
    }

    if (date2.center) {
        dateArr2.push(date2.center.date);
    }

    if (date1.point) {
        dateArr1.push(date1.point.date);
    }

    if (date2.point) {
        dateArr2.push(date2.point.date);
    }

    if (date1.low) {
        dateArr1.push(date1.low.date);
    }

    if (date2.low) {
        dateArr2.push(date2.low.date);
    }

    if (date1.high) {
        dateArr1.push(date1.high.date);
    }

    if (date2.high) {
        dateArr2.push(date2.high.date);
    }

    //console.log(dateArr1);
    //console.log(dateArr2);

    //Match 1 to 1.
    if (dateArr1.length === 1 && dateArr2.length === 1) {
        for (var i in dateArr1) {
            for (var ii in dateArr2) {
                var d1 = moment(dateArr1[i]);
                var d2 = moment(dateArr2[ii]);
                var diff = Math.abs(d1.diff(d2, 'hours'));
                if (diff < 24) {
                    return true;
                }
            }
        }
    }

    //Match 2 to 2.  Only match low/high, ignore point.
    if (date1.high && date1.low && date2.high && date2.low) {
        if (!date1.point && !date2.point) {
            var d1_low = moment(dateArr1[0]);
            var d2_low = moment(dateArr2[0]);
            var d1_high = moment(dateArr1[1]);
            var d2_high = moment(dateArr2[1]);
            var diff_low = Math.abs(d1_low.diff(d2_low, 'hours'));
            var diff_high = Math.abs(d1_high.diff(d2_high, 'hours'));
            if (diff_low < 24 && diff_high < 24) {
                return true;
            }
        }
    }

    //Match 1 to 2/2 to 1.  Source doesn't matter.
    if (dateArr1.length === 1 || dateArr2.length === 1) {
        for (var ida in dateArr1) {
            for (var ida2 in dateArr2) {
                var d1d = moment(dateArr1[ida]);
                var d2d = moment(dateArr2[ida2]);
                var difftwo = Math.abs(d1d.diff(d2d, 'hours'));
                if (difftwo < 24) {
                    return true;
                }
            }
        }
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

function lowerTrim(inputString) {
    return inputString.trim().toLowerCase();
}

exports.stringMatch = function (a_string_entry, b_string_entry) {

    if (a_string_entry && b_string_entry) {
        if (lowerTrim(a_string_entry) === lowerTrim(b_string_entry)) {
            return true;
        }
    }

};

exports.booleanMatch = function (a_boolean_entry, b_boolean_entry) {

    //Filter undefined.
    if (_.isUndefined(a_boolean_entry) === false) {
        if (_.isUndefined(b_boolean_entry) === false) {
            if (a_boolean_entry === b_boolean_entry) {
                return true;
            } else {
                return false;
            }
        }
    }

};

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
        for (var itran in b_coded_entry.translations) {
            b_array.push(b_coded_entry.translations[itran]);
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
                if ((lowerTrim(a_array[a].code) === lowerTrim(b_array[b].code)) && (lowerTrim(a_array[a].code_system_name) === lowerTrim(b_array[b].code_system_name))) {
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
        if ((lowerTrim(a_coded_entry.code) === lowerTrim(b_coded_entry.code)) && (lowerTrim(a_coded_entry.code_system_name) === lowerTrim(b_coded_entry.code_system_name))) {
            return true;
        }
    }

    return false;

};

exports.objectMatch = function (a_object, b_object) {

    if (_.isUndefined(a_object) || _.isUndefined(b_object)) {
        return false;
    }
    return equal(a_object, b_object);

};

"use strict";

var compareSimple = require('./compare.js').compare;

// Returns custom partial comparison functions for each section

var vitals = require('./sections/flat/vitals.js');


var allergies = require('./sections/subarray/allergies.js');

// This function return different compare functions for different sections
// eseentially it is a router

exports.compare = function comparePartial(section) {
    if (arguments.length !== 1) {
        throw "one argument is required for compare function";
    }

    switch (section) {
		//newly implemented partial matching
        case "vitals":
            return vitals.compare;

        case "allergies":
            return allergies.compare;
        default:
            return compareSimple;
    }

};

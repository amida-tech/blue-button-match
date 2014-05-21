"use strict";

var compareSimple = require('./compare.js').compare;

// Returns custom partial comparison functions for each section

var vitals = require('./sections/flat/vitals.js');
var medications = require('./sections/flat/medications.js');
var problems = require('./sections/flat/problems.js');
var immunizations = require('./sections/flat/immunizations.js');
var procedures = require('./sections/flat/procedures.js');

var demographics = require('./sections/single/demographics.js');
var socialhistory = require('./sections/single/socialhistory.js');


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
        case "demographics":
            return demographics.compare;
        case "medications":
            return medications.compare;
        case "problems":
            return problems.compare;
        case "procedures":
            return procedures.compare;
        case "socialHistory":
            return socialhistory.compare;


        case "allergies":
            return allergies.compare;
        default:
            return compareSimple;
    }

};

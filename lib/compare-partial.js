"use strict";

var compareSimple = require('./compare.js').compare;

//custom comparison functions for each section
var allergies = require('./sections/allergies.js');

// This function return different compare functions for different sections
// eseentially it is a router

exports.compare = function comparePartial(section) {
    if (arguments.length !== 1) {
        throw "one argument is required for compare function";
    }

    switch (section) {
        case "allergies":
            return allergies.compare;
        default:
            return compareSimple;
    }

};

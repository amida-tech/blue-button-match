"use strict";

var lookups = require("./lookups.js");
var matchSections = require("./match-sections.js").matchSections;
var matchSingles = require("./match-single.js").compare;
var version = require("../package.json").version;
var winston = require("winston");

var compare = require('./router.js').compare;

//Matching Library.
//This takes the standardized data elements and flags probable duplicates values.

//Toggle between info and debug for debugging.
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: 'info' })
  ]
});

var match = function match(new_record, master) {

    logger.debug('New Record:', JSON.stringify(new_record, null, 10));
    logger.debug('Base Record:', JSON.stringify(master, null, 10));

    var result = {
        "match": {},
        "meta": {
            "version": version
        },
        "errors": []
    };

    for (var section in lookups.sections) {
        var name = lookups.sections[section];
        var new_section;
        var master_section = [];
        if (master.hasOwnProperty(name)) {
            master_section = master[name];
        }

        if (new_record.hasOwnProperty(name)) {
            new_section = new_record[name];

            //Note:  Social History is an array now, so demographics is the only single.
            if (name === "demographics") {
                result.match[name] = matchSingles(new_section, master_section, name);
            } else {
                result.match[name] = matchSections(new_section, master_section, name);
            }
        }
    }

    logger.debug('Match Result:', JSON.stringify(result, null, 10));
    return result;
};

//Exports as Constructor - http://bites.goodeggs.com/posts/export-this/#constructor
module.exports.match = match;
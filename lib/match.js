"use strict";

var matchSections = require("./match-sections.js").matchSections;
var matchSingles = require("./match-single.js").compare;
var version = require("../package.json").version;
var winston = require("winston");
var _ = require("underscore");
var lookups = require("./lookups.js");

//Toggle between info and debug for debugging messages.
var logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info'
    })
  ]
});

//Takes the standardized data elements and flags match dispositions.
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

      if (name === "demographics") {
        if (master_section instanceof Array && master_section.length === 0) {
          master_section = {};
        }
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

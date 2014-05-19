"use strict";

var lookups = require("./lookups.js");
var matchSections = require("./match-sections.js").matchSections;

var comparePartial = require("./compare-partial.js").compare;


var version = require("../package.json").version;

//Matching Library.
//---------
//This takes the standardized data elements and flags probable duplicates values.

var match = function match(new_record, master) {
    new_record = new_record.data;
    master = master.data;

    //console.log(master, new_record);

    var result = {
        "match": {},
        "meta": {
            "version": version
        },
        "errors": []
    };

    for (var section in lookups.sections) {
        var name = lookups.sections[section];
        //console.log(">>> " + name);

        var new_section;
        var master_section = [];
        if (master.hasOwnProperty(name)) {
            master_section = master[name];
        }

        if (new_record.hasOwnProperty(name)) {
            new_section = new_record[name];

            //console.log(new_section);
            //console.log(master_section);
            //console.log(matchSections(new_section, master_section, comparePartial(name)));
            result.match[name] = matchSections(new_section, master_section, comparePartial(name));
        }
    }

    //console.log("full match");
    //console.log(JSON.stringify(result,4));
    return result;
};

//Exports as Constructor - http://bites.goodeggs.com/posts/export-this/#constructor
module.exports.match = match;

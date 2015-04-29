"use strict";

// This function is essentially comparing two arrays
// using custom comparison function provided as 3rd parameter

var equal = require('deep-equal');
var compare = require('./router.js').compare;

// if (el in setObj.elements) ...
var createSet = function () {
    var set = Object.create(null);

    return {
        elements: function () {
            return set;
        },
        add: function (el) {
            set[el] = true;
        },
        delete: function (el) {
            delete set[el];
        }
    };
};

//Support method similar to Python's range

function range(len) {
    var rangeSet = createSet();
    for (var i = 0; i < len; i++) {
        rangeSet.add(i);
    }

    return rangeSet;
}

//Generic match of two arrays of entries, using generic compare method
exports.matchSections = function matchSections(new_record, master, compare_field) {

    var result = [];

    var new_entries = range(new_record.length);
    var master_entries = range(master.length);

    //Match against target.
    for (var i in new_entries.elements()) {
        for (var j in master_entries.elements()) {
            var c = compare(new_record[i], master[j], compare_field);
            if (compare_field === "organizations") {
                //console.log("match against target A: ",JSON.stringify(new_record[i],null,2));
                //console.log("match against target B: ",JSON.stringify(master[j],null,2));
                //console.log("result of match: ",c.match);
            }
            c.src_id = i;
            c.dest_id = j;
            c.dest = 'dest';
            result.push(c);
        }
    }

    //Match against source.
    for (var ii in new_entries.elements()) {
        for (var jj in new_entries.elements()) {
            if (ii !== jj) {
                var d = compare(new_record[ii], new_record[jj], compare_field);
                if (compare_field === "organizations") {
                    //console.log("match against source A: ",JSON.stringify(new_record[ii],null,2));
                    //console.log("match against source B: ",JSON.stringify(new_record[jj],null,2));
                    //console.log("result of match: ",d.match);
                }
                d.src_id = ii;
                d.dest_id = jj;
                d.dest = 'src';
                result.push(d);
            }

        }
    }

    return result;

};

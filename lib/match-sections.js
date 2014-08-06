"use strict";

// This function is essentially comparing two arrays
// using custom comparison function provided as 3rd parameter

var equal = require('deep-equal');
var compare = require('./router.js').compare;

// if (el in setObj.elements) ...
var createSet = function() {
    var set = Object.create(null);

    return {
        elements: function() {
            return set;
        },
        add: function(el) {
            set[el] = true;
        },
        delete: function(el) {
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
    //console.log(">>> matchSections call");
    //console.log(new_record);
    //console.log(master);
    //console.log(compare);

    var result = [];

    var new_entries = range(new_record.length);
    var master_entries = range(master.length);

    //Match against target.
    for (var i in new_entries.elements()) {
        for (var j in master_entries.elements()) {
             var c = compare(new_record[i], master[j], compare_field);
             c.src_id = i;
             c.dest_id = j;
             c.dest = 'dest';
             result.push(c);
        }
    }

    //Match against source.
    for (var i in new_entries.elements()) {
        for (var j in new_entries.elements()) {
            if (i !== j) {
                var c = compare(new_record[i], new_record[j], compare_field);
                c.src_id = i;
                c.dest_id = j;
                c.dest = 'src';
                result.push(c);
            }
             
        }
    }

    return result;

    /*
    //console.log("all new entries");
    //console.log(new_entries.elements());

    //console.log("all master entries");
    //console.log(master_entries.elements());



    for (var i in new_entries.elements()) {
            

            var highestPct = 0;
            var bestMatch = null;
            var dupFound = false;

        //console.log("all new entries");
        //console.log(new_entries.elements());

        //console.log("all master entries");
        //console.log(master_entries.elements());



        for (var j in master_entries.elements()) {

            //console.log(i);
            //console.log(j);

            //console.log(new_record[i]);
            //console.log(master[j]);
            //console.log(compare);

            //console.log(i+" - "+j);
            var c = compare(new_record[i], master[j]);
            if (c.match === "duplicate") {
                //assume that new record as well as master record doesn't have duplicates (in itself)
                new_entries.delete(i);
                master_entries.delete(j);
                bestMatch = {
                    "match": "duplicate",
                    "src_id": i,
                    "dest_id": j
                };
                highestPct = 100;
                break;
            }
            else if (c.match === "partial") {
                //assume that new record as well as master record doesn't have duplicates (in itself)
                //new_entries.delete(i);
                //master_entries.delete(j);

                c["src_id"]=i;
                c["dest_id"]=j;
                if(highestPct < c.percent){
                    bestMatch = c;
                    highestPct = c.percent;
                }
                //result.push(c);
                //break;
            }
        }
        if(bestMatch){
                new_entries.delete(bestMatch.src_id);
                master_entries.delete(bestMatch.dest_id);
                result.push(bestMatch);
        }
    }

    for (var k in new_entries.elements()) {
        result.push({
            "match": "new",
            "src_id": k
        });
    }*/


    //console.log("new entries");
    //console.log(new_entries.elements());

    //console.log("dup master entries");
    //console.log(master_entries.elements());

    //console.log("result");
    //console.log(result);


    //return result;
};

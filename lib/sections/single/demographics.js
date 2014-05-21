"use strict";

var equal = require('deep-equal');

//var utils = require('../../utils.js');

//Full comparison of two demographics JSON elements for equality and/or diff
exports.compare = function compare(a, b) {
    //excellent code here
    if (equal(a, b)) {
        return {
            "match": "duplicate"
        };
    } else {

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
        /*
  "name": {cda_name},
  "dob": [{cda_date}],
  "gender": {type:string, required: true},
  "identifiers": [{cda_id}],
  "marital_status": {type: string, required: false},
  "address": [{cda_usr_address}],
  "phone": [],
  "email": [],
  "race_ethnicity": {type:string, required: false},
  "religion": {type:string, required: false},
  "languages": [
  "birthplace": 
  "guardians": []
*/
        return {
            "match": "diff",
            "diff": diff
        };
    }
};

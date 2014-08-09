"use strict";

var equal = require('deep-equal');
var _ = require('underscore');
var utils = require('./utils.js');

//Full comparison of two JSON elements for equality and partial match.
exports.compare = function compare(a, b, section) {

    if (!section) {
        throw('one argument is required for compare function');
    }


    //Contingent on inherited name accuracy.
    var logic = require('./sections/' + section + '.json');

    if (equal(a, b)) {
        return {
            "match": "duplicate",
            "percent": "100"
        };
    } else {
        var pct = 0;
        var subarray = [];

        var newPct = 0;

        var calculateMatch = function (primaryEntries, secondaryEntries, object_a, object_b) {

            //console.log(object_a);
            //console.log(object_b);

            var matchPercent = 0;
            //Extract primary matching logic from schema.
            var primaryCodedEntries = _.where(primaryEntries, {
                type: 'codedEntry'
            });
            var secondaryCodedEntries = _.where(secondaryEntries, {
                type: 'codedEntry'
            });
            var primaryDateEntries = _.where(primaryEntries, {
                type: 'dateTime'
            });
            var secondaryDateEntries = _.where(secondaryEntries, {
                type: 'dateTime'
            });
            var primaryStringEntries = _.where(primaryEntries, {
                type: 'string'
            });
            var secondaryStringEntries = _.where(secondaryEntries, {
                type: 'string'
            });
            var primaryResultDateEntries = _.where(primaryEntries, {
                type: 'resultTime'
            });
            var secondaryBooleanEntries = _.where(secondaryEntries, {
                type: 'boolean'
            });


            for (var i in primaryResultDateEntries) {

                if (utils.resultTimeMatch(object_a['results'], object_b['results'])) {
                    matchPercent = matchPercent + primaryResultDateEntries[i].percent;
                }

            }

            for (var i in primaryStringEntries) {
                    if (utils.stringMatch(object_a[primaryStringEntries[i].path], object_b[primaryStringEntries[i].path])) {
                        matchPercent = matchPercent + primaryStringEntries[i].percent;
                    };
            }

            for (var i in primaryCodedEntries) {

                //If path is missing, just take the main object.
                if (primaryCodedEntries[i].path === undefined) {
                    if (utils.codedMatch(object_a, object_b)) {
                        matchPercent = matchPercent + primaryCodedEntries[i].percent;
                    };
                } else {

                    var inputObjectA = object_a;
                    var inputObjectB = object_b;

                    //Handle dot notation.
                    if (primaryCodedEntries[i].path.indexOf(".") > -1) {
                        var strSplit = primaryCodedEntries[i].path.split(".");
                        for (var splitEntry in strSplit) {
                            inputObjectA = inputObjectA[strSplit[splitEntry]];
                            inputObjectB = inputObjectB[strSplit[splitEntry]];
                        }
                    } else {
                        inputObjectA = object_a[primaryCodedEntries[i].path];
                        inputObjectB = object_b[primaryCodedEntries[i].path];
                    }

                    //console.log(inputObjectA);

                    if (utils.codedMatch(inputObjectA, inputObjectB)) {
                        matchPercent = matchPercent + primaryCodedEntries[i].percent;
                    };
                }

            }

            for (var i in primaryDateEntries) {

                    if (utils.dateMatch(object_a[primaryDateEntries[i].path], object_b[primaryDateEntries[i].path])) {
                        matchPercent = matchPercent + primaryDateEntries[i].percent;
                    } else if (utils.dateFuzzyMatch(object_a[primaryDateEntries[i].path], object_b[primaryDateEntries[i].path])) {
                        //TODO:  Hardcoded for now, but should be a division.
                        matchPercent = matchPercent + primaryDateEntries[i].percent - 20;
                    }

            }

            //If primary entries match, add in secondary match.
            if (matchPercent > 0) {
                for (var i in secondaryCodedEntries) {

                    //If path is missing, just take the main object.
                    if (secondaryCodedEntries[i].path === undefined) {
                        if (utils.codedMatch(object_a, object_b)) {
                            matchPercent = matchPercent + secondaryCodedEntries[i].percent;
                        };
                    } else {
                        if (utils.codedMatch(object_a[secondaryCodedEntries[i].path], object_b[secondaryCodedEntries[i].path])) {
                            matchPercent = matchPercent + secondaryCodedEntries[i].percent;
                        };
                    }
                }

                for (var i in secondaryDateEntries) {

                    if (utils.dateMatch(object_a[secondaryDateEntries[i].path], object_b[secondaryDateEntries[i].path])) {
                        matchPercent = matchPercent + secondaryDateEntries[i].percent;
                    } else if (utils.dateFuzzyMatch(object_a[secondaryDateEntries[i].path], object_b[secondaryDateEntries[i].path])) {
                        //TODO:  Hardcoded for now, but should be a division.
                        matchPercent = matchPercent + secondaryDateEntries[i].percent - 20;
                    }
                }

                for (var i in secondaryStringEntries) {
                    if (utils.stringMatch(object_a[secondaryStringEntries[i].path], object_b[secondaryStringEntries[i].path])) {
                        matchPercent = matchPercent + secondaryStringEntries[i].percent;
                    };
                }

                for (var i in secondaryBooleanEntries) {
                    if (utils.booleanMatch(object_a[secondaryBooleanEntries[i].path], object_b[secondaryBooleanEntries[i].path])) {
                        matchPercent = matchPercent + secondaryBooleanEntries[i].percent;
                    };
                }


            }

            matchPercent = Math.round(matchPercent * 100) / 100;

            //Will need to shim in CMS fix here.

            return matchPercent;

        }

        var calculateSubMatch = function (primaryEntries, secondaryEntries, object_a, object_b) {

            //console.log(object_a);
            //console.log(object_b);

            if (_.isUndefined(secondaryEntries)) {
                secondaryEntries = [];
            }


            if (equal(object_a, object_b)) {
                return {
                    "match": "duplicate",
                    "percent": 100
                };
            } else {
                var subMatchPercent = calculateMatch(primaryEntries, secondaryEntries, object_a, object_b);

                if (subMatchPercent === 0) {
                    return {
                        "match": "new",
                        "percent": 0
                    }
                } else {
                    return {
                        "match": "partial",
                        "percent": subMatchPercent
                    }
                }

            }

        }

        //Process first object.
        newPct = newPct + calculateMatch(logic.primary, logic.secondary, a, b);

        //console.log(newPct);

        //if newPct = 0, return 'new', otherwise, run subarrays.
        if (newPct === 0) {
            return {
                "match": "new",
                "percent": newPct
            };
        } else {

            var aMatches = {};

            //Loop sub arrays.
            for (var i in logic.subArrays) {
                for (var ii in logic.subArrays[i]) {

                    if (_.isUndefined(a[ii])) {
                        a[ii] = [];
                    }

                    if (_.isUndefined(b[ii])) {
                        b[ii] = [];
                    }

                    for (var aObj in a[ii]) {

                        //Match Target.
                        for (var bObj in b[ii]) {

                            //console.log(logic.subArrays[i][ii].primary);
                            //console.log(a[ii][aObj]);
                            //console.log(b[ii][bObj]);

                            //src_id = aObj, dest_id = bObj.
                            var subObjectResults = calculateSubMatch(logic.subArrays[i][ii].primary, logic.subArrays[i][ii].secondary, a[ii][aObj], b[ii][bObj]);

                            //console.log([ii])

                            if (aMatches[ii] === undefined) {
                                aMatches[ii] = [];
                                //aMatches.push({ii: []});
                            }

                            //Graph against all dest target objects.
                            aMatches[ii].push({
                                "match": subObjectResults.match,
                                "percent": subObjectResults.percent,
                                "src_id": aObj,
                                "dest_id": bObj,
                                "dest": "dest"
                            });
                        }

                        //Match Source.
                        for (var cObj in a[ii]) {

                            //Filter out self Reference.
                            if (aObj !== cObj) {
                                //src_id = aObj, dest_id = cObj.
                                var subObjectResults = calculateSubMatch(logic.subArrays[i][ii].primary, logic.subArrays[i][ii].secondary, a[ii][aObj], a[ii][cObj]);

                                if (aMatches[ii] === undefined) {
                                    aMatches[ii] = [];
                                    //aMatches.push({ii: []});
                                }

                                //Graph against all dest target objects.
                                aMatches[ii].push({
                                    "match": subObjectResults.match,
                                    "percent": subObjectResults.percent,
                                    "src_id": aObj,
                                    "dest_id": cObj,
                                    "dest": "src"
                                });
                            }

                        }
                    }

                }

            }

        }

        var diff = utils.diff(a, b);

        if (!_.isEmpty(aMatches)) {
            return {
                "match": "partial",
                "percent": newPct,
                "subelements": aMatches,
                "diff": diff

            };
        } else {
            return {
                "match": "partial",
                "percent": newPct,
                "diff": diff
            };
        }

    }

};
//All old code below here:

/*
        //console.log(newPct);

        //console.log("allergy specific comparison");
        //console.log(JSON.stringify(a, null, 4));
        //console.log('--------------');
        //console.log(JSON.stringify(b, null, 4));

        //console.log('---------------');

        //TODO: relies on normalization of code attribute in parser

        //temporary, we must be something about undefined fields since they evaluate to true...

        // same allergen +50%
        if (utils.codeMatch(a.allergen.code, a.allergen.code_system_name, b.allergen.code, b.allergen.code_system_name)) {

            // same date +45%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 45;
            }
            // similar date +25%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 25;
            }

            //if subarrays are missing, replace them with empty ones
            if (typeof a.reaction === "undefined") a.reaction = [];
            if (typeof b.reaction === "undefined") b.reaction = [];

            subarray = matchSubarrays(a.reaction, b.reaction, compareReactions);

        }
        if (a.allergen.name === b.allergen.name) {
            pct = pct + 50;
            // same date +45%
            if (utils.dateMatch(a.date, b.date)) {
                pct = pct + 45;
            }
            // similar date +25%
            else if (utils.dateFuzzyMatch(a.date, b.date)) {
                pct = pct + 25;
            }

            //if subarrays are missing, replace them with empty ones
            if (typeof a.reaction === "undefined") a.reaction = [];
            if (typeof b.reaction === "undefined") b.reaction = [];

            subarray = matchSubarrays(a.reaction, b.reaction, compareReactions);
            //console.log("sub:",subarray);
            //console.log(subarray.length);
        } else if ((a.allergen.code !== b.allergen.code || a.allergen.code_system_name !== b.allergen.code_system_name) && utils.isDefined(a.allergen.code, b.allergen.code, a.allergen.code_system_name, b.allergen.code_system_name)) {
            pct = 0;
        }

        //this is a very rough edged version. Else part here is for cms.
        //Otherwise, divide up the larger of the two
        else {

            //creating temps so it doesn't affect diff
            pct = utils.rawPercentageMatch(pct, a, b);
            subarray = matchSubarrays(a.reaction, b.reaction, compareReactions);
        }

        //console.log('new pct:' + newPct);
        //console.log('old pct:' + pct);

        var diff = utils.diff(a, b);

        pct = Math.round(pct * 100) / 100;

        //console.log({"match": "partial", "percent" : pct});
        if (pct === 0)
            return {
                "match": "new"
            };

        //console.log(diff);
        //console.log(subarray);

        if (subarray.length > 0) {
            return {
                "match": "partial",
                "percent": pct,
                "subelements": subarray,
                "diff": diff

            };
        } else {
            return {
                "match": "partial",
                "percent": pct,
                "diff": diff
            };
        }
    }

    return {
        "match": "new"
    };
};*/
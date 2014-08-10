"use strict";

var equal = require('deep-equal');
var _ = require('underscore');
var utils = require('./utils.js');

//Full comparison of two JSON elements for equality and partial match.
exports.compare = function compare(a, b, section) {

    if (!section) {
        throw ('one argument is required for compare function');
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
            var primaryStringArrayEntries = _.where(primaryEntries, {
                type: 'stringArray'
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
            var primaryObjectEntries = _.where(primaryEntries, {
                type: 'object'
            });

            for (var iprde in primaryResultDateEntries) {

                if (utils.resultTimeMatch(object_a['results'], object_b['results'])) {
                    matchPercent = matchPercent + primaryResultDateEntries[iprde].percent;
                }

            }

            for (var ipsae in primaryStringArrayEntries) {

                var matchedArrays = false;
                
                var inputObjectA = object_a[primaryStringArrayEntries[ipsae].path];
                var inputObjectB = object_b[primaryStringArrayEntries[ipsae].path];


                for (var ia in inputObjectA) {
                    for (var ib in inputObjectB) {

                        if (utils.stringMatch(inputObjectA[ia], inputObjectB[ib])) {
                            matchedArrays = true;
                        }

                    }
                }

                if (matchedArrays) {
                    matchPercent = matchPercent + primaryStringArrayEntries[ipsae].percent;
                }

            }

            //console.log(primaryStringEntries);

            for (var i in primaryStringEntries) {

                var inputObjectAPSE = object_a;
                var inputObjectBPSE = object_b;

                if (primaryStringEntries[i].path.indexOf(".") > -1) {
                    var strSplit = primaryStringEntries[i].path.split(".");
                    for (var splitEntry in strSplit) {
                        if (inputObjectAPSE[strSplit[splitEntry]] !== undefined && inputObjectBPSE[strSplit[splitEntry]] !== undefined) {
                            inputObjectAPSE = inputObjectAPSE[strSplit[splitEntry]];
                            inputObjectBPSE = inputObjectBPSE[strSplit[splitEntry]];
                        } else {
                            inputObjectAPSE = '';
                            inputObjectBPSE = '';
                        }
                    }
                } else {
                    inputObjectAPSE = object_a[primaryStringEntries[i].path];
                    inputObjectBPSE = object_b[primaryStringEntries[i].path];
                }


                //console.log(inputObjectA);
                //console.log(inputObjectB);

                //console.log(primaryStringEntries[i].path);
                if (utils.stringMatch(inputObjectAPSE, inputObjectBPSE)) {
                    matchPercent = matchPercent + primaryStringEntries[i].percent;
                    //console.log(matchPercent);
                }
            }

            for (var ipce in primaryCodedEntries) {

                //If path is missing, just take the main object.
                if (primaryCodedEntries[ipce].path === undefined) {
                    if (utils.codedMatch(object_a, object_b)) {
                        matchPercent = matchPercent + primaryCodedEntries[ipce].percent;
                    }
                } else {

                    var inputObjectAPCE = object_a;
                    var inputObjectBPCE = object_b;

                    //Handle dot notation.
                    if (primaryCodedEntries[ipce].path.indexOf(".") > -1) {
                        var strSplitPCE = primaryCodedEntries[ipce].path.split(".");
                        for (var splitEntryPCE in strSplitPCE) {
                            inputObjectAPCE = inputObjectAPCE[strSplitPCE[splitEntryPCE]];
                            inputObjectBPCE = inputObjectBPCE[strSplitPCE[splitEntryPCE]];
                        }
                    } else {
                        inputObjectAPCE = object_a[primaryCodedEntries[ipce].path];
                        inputObjectBPCE = object_b[primaryCodedEntries[ipce].path];
                    }

                    //console.log(inputObjectA);

                    if (utils.codedMatch(inputObjectAPCE, inputObjectBPCE)) {
                        matchPercent = matchPercent + primaryCodedEntries[ipce].percent;
                    }
                }

            }

            for (var ipoe in primaryObjectEntries) {

                if (utils.objectMatch(object_a[primaryObjectEntries[ipoe].path], object_b[primaryObjectEntries[ipoe].path])) {
                    //console.log(matchPercent);
                    matchPercent = matchPercent + primaryObjectEntries[ipoe].percent;
                }

            }

            for (var ipde in primaryDateEntries) {

                if (utils.dateMatch(object_a[primaryDateEntries[ipde].path], object_b[primaryDateEntries[ipde].path])) {
                    matchPercent = matchPercent + primaryDateEntries[ipde].percent;
                } else if (utils.dateFuzzyMatch(object_a[primaryDateEntries[ipde].path], object_b[primaryDateEntries[ipde].path])) {
                    //TODO:  Hardcoded for now, but should be a division.
                    matchPercent = matchPercent + primaryDateEntries[ipde].percent - 20;
                }

            }

            //If primary entries match, add in secondary match.
            if (matchPercent > 0) {
                for (var isce in secondaryCodedEntries) {

                    //If path is missing, just take the main object.
                    if (secondaryCodedEntries[isce].path === undefined) {
                        if (utils.codedMatch(object_a, object_b)) {
                            matchPercent = matchPercent + secondaryCodedEntries[isce].percent;
                        }
                    } else {
                        if (utils.codedMatch(object_a[secondaryCodedEntries[isce].path], object_b[secondaryCodedEntries[isce].path])) {
                            matchPercent = matchPercent + secondaryCodedEntries[isce].percent;
                        }
                    }
                }

                for (var isde in secondaryDateEntries) {

                    if (utils.dateMatch(object_a[secondaryDateEntries[isde].path], object_b[secondaryDateEntries[isde].path])) {
                        matchPercent = matchPercent + secondaryDateEntries[isde].percent;
                    } else if (utils.dateFuzzyMatch(object_a[secondaryDateEntries[isde].path], object_b[secondaryDateEntries[isde].path])) {
                        //TODO:  Hardcoded for now, but should be a division.
                        matchPercent = matchPercent + secondaryDateEntries[isde].percent - 20;
                    }
                }

                for (var isse in secondaryStringEntries) {
                    if (utils.stringMatch(object_a[secondaryStringEntries[isse].path], object_b[secondaryStringEntries[isse].path])) {
                        matchPercent = matchPercent + secondaryStringEntries[isse].percent;
                    }
                }

                for (var isbe in secondaryBooleanEntries) {
                    if (utils.booleanMatch(object_a[secondaryBooleanEntries[isbe].path], object_b[secondaryBooleanEntries[isbe].path])) {
                        matchPercent = matchPercent + secondaryBooleanEntries[isbe].percent;
                    }
                }

            }

            matchPercent = Math.round(matchPercent * 100) / 100;

            //Will need to shim in CMS fix here.

            return matchPercent;

        };

        var calculateSubMatch = function (primaryEntries, secondaryEntries, object_a, object_b) {

            //console.log(object_a);
            //console.log(object_b);

            if (_.isUndefined(secondaryEntries)) {
                secondaryEntries = [];
            }

            //console.log(object_a);
            //console.log(object_b);

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
                    };
                } else {
                    return {
                        "match": "partial",
                        "percent": subMatchPercent
                    };
                }

            }

        };

        //Process first object.
        newPct = newPct + calculateMatch(logic.primary, logic.secondary, a, b);

        //console.log(newPct);

        //if newPct = 0, return 'new', otherwise, run subarrays.

        var aMatches;
        
        if (newPct === 0) {
            return {
                "match": "new",
                "percent": newPct
            };
        } else {

            aMatches = {};

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
                                var subObjectResultsTwo = calculateSubMatch(logic.subArrays[i][ii].primary, logic.subArrays[i][ii].secondary, a[ii][aObj], a[ii][cObj]);

                                if (aMatches[ii] === undefined) {
                                    aMatches[ii] = [];
                                    //aMatches.push({ii: []});
                                }

                                //Graph against all dest target objects.
                                aMatches[ii].push({
                                    "match": subObjectResultsTwo.match,
                                    "percent": subObjectResultsTwo.percent,
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
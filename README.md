blue-button-match
=================

Automatic matching of Blue Button JSON data (detection of new, duplicate and partial match entries)

[![NPM](https://nodei.co/npm/blue-button-match.png)](https://nodei.co/npm/blue-button-match/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button-match.svg)](https://travis-ci.org/amida-tech/blue-button-match)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button-match/badge.png)](https://coveralls.io/r/amida-tech/blue-button-match)

## Library interfaces/APIs

This library exposes methods for matching entire health records as well as lower level methods for matching sections of health records.

This library provides following functionality

- Match two health records in blue-button JSON format
- Match individual sections of above

### Usage example

Require blue-button-match module

``` javascript
var match = require("./index.js") 
var bb = require("blue-button");

var recordA = bb.parseString("record A");
var recordB = bb.parseString("record B");

var result = match.match(recordA.data, recordB.data);

console.log(result);

```

This will produce match object looking like this:

```javascript
{
    "match":
    {
        "allergies" : [
            { "src_id" : 0, "dest_id" : 0, "match":"duplicate" },
            { "src_id" : 1, "dest_id" : 1, "match":"duplicate" },
            { "src_id" : 2, "dest_id" : 2, "match":"duplicate" },
            ...
            }
        ],
        "medications" : [...],
        "demographics" : [...]
        ...
    },
    "meta":
    {
    	"version" : "0.0.1"
	},
	"errors": []
}
```

#### Matching record explanation

Match element can be `{"match" : "duplicate"}`, `{"match" : "new"}` or `{"match" : "partial", "percent": 50}`, partial match is expressed in percents and can range from `1` to `99`. Element attribute `dest_id` refers to element position (index) in related section's array of master health record. Element attribute `src_id` refers to element position (index) in related array of document being merged (new record).

```javascript
{
    "match":
    {
        "allergies" : [
            { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
            { "match" : "new", "src_id" :1 },
            { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
            ...
            }
        ],
        "medications" : [...],
        "demographics" : [...]
        ...
    }
}
```

### Matching results JSON structures (by record type)

#### Flat

_Applied to : Vital Signs, Medications, Problems, Immunizations, Procedures_


``` javascript
[
    { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
    { "match" : "new", "src_id" :1 },
    { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
    ...
    }
]
```

#### Containing subarrays

_Applied to: Results, Allergies, Encounters_

``` javascript
[
    { "match" : "new", "src_id" :1 }, //completely new element
    { "match" : "duplicate", "src_id" : 0, "dest_id": 2 }, //completely duplicate element

    { "match" : "duplicate_new_subelements", "src_id" : 0, "dest_id": 2 
        "subelements": [
            { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
            { "match" : "new", "src_id" :1 },
            { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
            ...
            }
        ]

    }, //completely duplicate element but difference in subelements exists

    { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5
        "subelements": [
            { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
            { "match" : "new", "src_id" :1 },
            { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
            ...
            }
        ]
    }, 
    ...
    } //partial match
]
````

#### Single facts

_Applied to: Demographics, Social History_


``` javascript
//only one match element present
[
    { "match" : "duplicate"}, //record is complete duplicate
]
```

``` javascript
//only one match element present
[
    { "match" : "diff", 
        "diff": {
            "element_name_1":"duplicate", //element is the same
            "element_name_2":"new", //element has new value
        }},
]
```

Edge cases for single facts:

Both objects are empty e.g. comparePartial({}, {})

```javascript
[ { match: 'duplicate' } ]
```

Comparing empty object e.g. {} with non-empty (master record)

```javascript
[ { match: 'diff', diff: {} } ]
```

Comparing non empty object with empty master record {}
```javascript
[ { match: 'new' } ]
```

## Matching Rules

#### Common matching rules

Fuzzy date match - dates match with margin of errors; in case of date ranges, checked for overlap; margin of error is 24 hrs.

Code (Code System match) - code and code_system_name must match.

Code match with translations - codes (and code_system_names) between two entries should have at least one match.

###Allergies

Code match on Allergen is required.

Date and Fuzzy date match.

###Medications

Code match with translation on Medication.

Status match.

Date and Fuzzy date match.

###Problems

Code match with translation on Medication is required.

Status match.

Negation indicator match.

Date and Fuzzy date match.

###Results

Code match on Result is required.

Since Result doesn't have a date. Dates from sub results are collected for both entries. Fuzzy date match is used.

###Demographics

All subelements are compared.

###Procedures

Code match with translation on Procedure is required.

Status dismatch results in 0% match.

Date and Fuzzy date match.

###Encounters

Code match with translation on Encounter is required.

Date and Fuzzy date match.

###Immunizations

Code match with translation on Immunization is required.

Status dismatch results in 0% match.

Date and Fuzzy date match.

###Vitals model

Code match with translation on Vital Sign is required.

Date and Fuzzy date match.

###Social History

All subelements are compared.

## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/blue-button-match/issues

## Release Notes

See release notes [here] (./RELEASENOTES.md)

## License

Licensed under [Apache 2.0](./LICENSE)
blue-button-match
=================

Automatic matching of Blue Button JSON data (detection of new, duplicate and partial match entries)

[![NPM](https://nodei.co/npm/@amida-tech/blue-button-match.png)](https://nodei.co/npm/@amida-tech/blue-button-match/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button-match.svg)](https://travis-ci.org/amida-tech/blue-button-match)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button-match/badge.png)](https://coveralls.io/r/amida-tech/blue-button-match)
[![Dependency Status](https://david-dm.org/amida-tech/blue-button-match.svg)](https://david-dm.org/amida-tech/blue-button-match)

## Library interfaces/APIs

This library exposes methods for matching entire health records as well as lower level methods for matching sections of health records.

This library provides the following functionality

- Match two health records in blue-button JSON format
- Match individual sections of above

## Quick up and running guide

### Prerequisites

- Node.js (v14.19+) and NPM
- Grunt.js

```sh
# Install dependencies
npm i

# Install grunt
npm i -g grunt

# Test
grunt
```

### Usage example

Require blue-button-match module

```javascript
var match = require("./index.js") 
var bb = require("@amida-tech/blue-button");

var recordA = bb.parseString("record A");
var recordB = bb.parseString("record B");

var result = match.match(recordA.data, recordB.data);

console.log(result);

````

This will produce a match object looking like this:

```json
{
  "match": {
    "allergies" : [
      {
        "match": "new",
        "percent": 0,
        "src_id": "0",
        "dest_id": "0",
        "dest": "dest"
      },
      {
        "match": "new",
        "percent": 0,
        "src_id": "1",
        "dest_id": "0",
        "dest": "dest"
      },
      {
        "match": "new",
        "percent": 0,
        "src_id": "2",
        "dest_id": "0",
        "dest": "dest"
      },
      {
        "match": "new",
        "percent": 0,
        "src_id": "0",
        "dest_id": "1",
        "dest": "src"
      },
        ...
      }
    ],
    "medications" : [...],
    "demographics" : [...]
    ...
  },
  "meta": {
    "version" : "0.0.1"
	},
	"errors": []
}
```

### Matching record explanation

Match element can be `{"match" : "duplicate", "percent": 100}`, `{"match" : "new", "percent: 0"}` or `{"match" : "partial", "percent": 50}`.

Partial match is expressed in percent and can range from `1` to `99`.  Percent is included in the duplicate and new objects as well for range based calculations, but will always equal `100` or `0` respectively.


Element attribute `dest_id` refers to the element position (index) in the related section's array of the Master Health Record. Element attribute `src_id` refers to the element position (index) in the related array of the new document being merged (new record).  This is modulated by the 'dest' field. When `{dest:'dest'}` is present the `dest_id` references the index of the record matched against a new entry.  When `{dest: 'src'}` is present, the `dest_id` references the index of the record contained within the same record as the `src_id`.

```json
{
  "match":
  {
    "allergies" : [
      { "match" : "duplicate", "src_id" : 0, "dest_id": 2 },
      { "match" : "new", "src_id" :1 },
      { "match" : "partial", "percent" : 50, "src_id" : 2, "dest_id" : 5},
      ...
    ],
    "medications" : [...],
    "demographics" : [...]
    ...
  }
}
```

### Matching results JSON structures (by record type)



#### Multiple facts

_Applied to: All sections excluding Demographics_


New match entry (dest):

```json
{
  "match": "new",
  "percent": 0,
  "src_id": "1",
  "dest_id": "2",
  "dest": "dest"
}
````
Duplicate match entry (dest):

```json
 {
    "match": "duplicate",
    "percent": "100",
    "src_id": "1",
    "dest_id": "1",
    "dest": "dest"
 }
````

Partial match entry (dest):

```json
{
  "match": "partial",
  "percent": 50,
  "subelements": {
    "reaction": [{
      "match": "new",
      "percent": 0,
      "src_id": "0",
      "dest_id": "0",
      "dest": "dest"
    }]
  },
  "diff": {
    "date_time": "duplicate",
    "identifiers": "duplicate",
    "allergen": "duplicate",
    "severity": "duplicate",
    "status": "duplicate",
    "reaction": "new"
  },
  "src_id": "2",
  "dest_id": "2",
  "dest": "dest"
}
````


#### Single facts

_Applied to: Demographics_


Record is a duplicate:

```javascript
[ { match: 'duplicate', src_id: 0, dest_id: 0 } ]
```

Record is a partial match:

```javascript
[ 
  { 
    match: 'diff',
    diff: 
    { 
       name: 'duplicate',
       dob: 'new',
       gender: 'duplicate',
       identifiers: 'duplicate',
       marital_status: 'duplicate',
       addresses: 'new',
       phone: 'duplicate',
       race_ethnicity: 'duplicate',
       languages: 'duplicate',
       religion: 'duplicate',
       birthplace: 'duplicate',
       guardians: 'new' 
    },
    src_id: 0,
    dest_id: 0 
  } 
]
````

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

### Common matching rules

_Date/time match_ - Hard match on dates, After initial date mismatch, fuzzy date match performed.  Will check for overlap of dates if they don't hard match.

_Code match (Code System match)_ - Either names must match, or code/code system must match.  Translations are supported:  Translated objects may be matched against an object and follow the same rules.

_String match_ - Case insensitive/trimmed match of string values.

_String array match_ - Case insensitive/trimmed match of arrays for equality.

_Boolean match_ - Simple true/false equality comparison.

Each sections logic is contained in a .json file corresponding to the section name.  It is divided into primary and secondary logic.  Secondary logic only executes only if primary logic resulted in a successful match, and can bolster match percentages.   Each section contains an array of match data.

Each element of match data has 3 components, a path, the location of the element, the type, or what common utility should handle it, and the percentage, which is a resulting increase if a match is made successfully.

Additionally, elements may have 'subarrays', which is used to populate sub-arrays from the match and provides corresponding diffs.  Their structure is the same as match entries.

Note:  Currently, the logic is designed so a match over 50% is considered actionable.

### Allergies

Primary:  Allergen Coded Match.

Secondary:  Date/time.

### Claims

Primary:  Payer String Match, Number String Match, and type String Array match.

### Demographics

All subelements are compared.

### Encounters

Primary:  Encounter Coded Match, Date/time.

### Immunizations

Primary:  Product Coded Match, Date/time.

### Insurance

Primary:  Plan Identifier String Match, Policy Number String Match, and Payer Name String match.

Note:  Any combination of two matches will be over 50%.

### Medications

Primary:  Product Coded Entry.

Secondary:  Date/time.

### Payers

Primary:  Policy Insurance Object.

### Plan of Care

Primary:  Plan Coded Entry, Date/time.

### Problems

Primary:  Problem Coded Entry.

Secondary:  Date/time, Status string match, Negation Indicator boolean match.

### Procedures

Primary:  Procedure Coded Entry Match.

Secondary:  Date/time.

### Providers

Primary:  Provider Type String Match.

Secondary:  Person Object, and Name String.

### Results

Primary:  Result set Coded Entry, and Result set Date/time.

Note:  Date/time calculated as most recent value from results array.

### Social History

Primary:  Value String entry.

Secondary:  Date/time.

### Vitals model

Primary:  Vital Coded entry.

Secondary:  Date/time.


## Contributing

Contributors are welcome. See [issues](https://github.com/amida-tech/blue-button-match/issues)

## Release Notes

See release notes [here](./RELEASENOTES.md)

## License

Licensed under [Apache 2.0](./LICENSE)
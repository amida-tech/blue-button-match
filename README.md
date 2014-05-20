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

var result = match.match(recordA, recordB);

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

Applied to : Vital Signs, Medications, Problems, Immunizations, Procedures


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

Applied to: Results, Allergies, Encounters

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

Applied to: Demographics, Social History

//only one match element present

``` javascript
[
    { "match" : "duplicate"}, //record is complete duplicate
]
```

``` javascript
[
    { "match" : "diff", 
        "diff": {
            "element_name_1":"duplicate", //element is the same
            "element_name_2":"new", //element has new value
        }},
]
```

## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/blue-button-match/issues

## License

Licensed under [Apache 2.0](./LICENSE)
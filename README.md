blue-button-match
=================

Automatic matching of Blue Button JSON data (detection of new, duplicate and partial match entries)


Matching Library
----------------
match.js

This library exposes methods for matching entire health records as well as lower level methods for matching sections of health records.

Document matching method

```
//Loading libraries
var compare = require('../lib/match/compare-partial.js').compare;
var Match = require('../lib/match.js');

//Create matching object
var match = new Match(compare);

// Use matching object for comparing two BB JSON documents (only data portion of it!)
var m = match.match(bb_new_record.data, bb_master_health_record.data);


```

Example of matching entire records.

```
var fs = require('fs');
var BlueButton = require('./lib/bluebutton.min.js');
var Match = require('../lib/match.js');
var compare = require('../lib/match/compare-partial.js').compare;

var xml = fs.readFileSync('test/records/ccda/CCD.sample.xml', 'utf-8');
var src_bb = dest_bb = new BlueButton(xml);

//Create matching object, initialized with comparison library (supporting partial match)
var match = new Match(compare);

//compare record to itself (should be perfect match)
var m = match.match(src_bb.data, dest_bb.data);

```

This will produce following match object:
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
    }
}
```


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



## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/blue-button-match/issues

## License

Licensed under [Apache 2.0](./LICENSE)
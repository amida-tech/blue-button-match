/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var _ = require('underscore');
var path = require('path');

var fs = require('fs');
//var bbjs = require('@amida-tech/blue-button');

var matchSections = require(path.join(__dirname, "../../lib/match-sections.js")).matchSections;

var js, js2, js3, js4;

beforeAll(function (done) {
  // 2 sample payers
  js = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/payers.json'), 'utf-8').toString());

  //same as above but rearranged to be partial match
  js2 = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/payers2.json'), 'utf-8').toString());

  // has a bunch of plans different from all of the above
  js3 = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/payers3.json'), 'utf-8').toString());

  js4 = JSON.parse(fs.readFileSync(path.join(__dirname, '/fixtures/payers4.json'), 'utf-8').toString());

  //console.log(bb);
  done();
});

describe('Payers partial matching library (payers.js) tests', function () {

  it('compare two different payers sections', function () {
    var m = matchSections(js, js3, 'payers');

    //console.log(JSON.stringify(js3, null, 10));
    //console.log(JSON.stringify(js, null, 10));
    //console.log(m);

    expect(m.length).toBe(1);
    expect(_.where(m, {
      dest: 'dest'
    }).length).toBe(1);
    expect(_.where(m, {
      dest: 'src'
    }).length).toBe(0);

    for (var item in m) {
      expect(m[item].match).toBe("new");
      expect(m[item]).toHaveProperty('src_id');
      expect(m[item]).toHaveProperty('dest_id');
    }

  });

  it('compare payer sections with itself', function () {
    var m = matchSections(js, js, 'payers');

    //console.log(m);

    //Group arrays by source.
    var src_array = [];
    for (var item in m) {
      src_array.push(m[item].src_id);
    }

    src_array = _.uniq(src_array);
    var src_obj_array = [];

    for (var i in src_array) {
      src_obj_array.push([]);
    }

    for (var item in m) {
      for (var iter in src_array) {
        if (m[item].src_id === src_array[iter]) {
          src_obj_array[src_array[iter]].push(m[item]);
        }

      }
    }

    for (var objArray in src_obj_array) {
      //console.log(src_obj_array[objArray]);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'duplicate'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'new'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'duplicate'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'new'
      }).length).toBe(0);
    }

  });

  it('compare two different payer sections that will have all partial match', function () {
    var m = matchSections(js, js2, 'payers');

    //Group arrays by source.
    var src_array = [];
    for (var item in m) {
      src_array.push(m[item].src_id);
    }

    src_array = _.uniq(src_array);
    var src_obj_array = [];

    for (var i in src_array) {
      src_obj_array.push([]);
    }

    for (var item in m) {
      for (var iter in src_array) {
        if (m[item].src_id === src_array[iter]) {
          src_obj_array[src_array[iter]].push(m[item]);
        }

      }
    }

    for (var objArray in src_obj_array) {
      //console.log(src_obj_array[objArray]);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'partial'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'new'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'partial'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'new'
      }).length).toBe(0);

      var partial_array = _.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'partial'
      });

      for (var i in partial_array) {
        //console.log(partial_array[i]);
        expect(partial_array[i].percent).toBe(50);
        expect(partial_array[i].diff).toBeDefined();
      }

    }

    //and now do the same but backwards
    var m = matchSections(js, js2.slice().reverse(), 'payers');

    //Group arrays by source.
    var src_array = [];
    for (var item in m) {
      src_array.push(m[item].src_id);
    }

    src_array = _.uniq(src_array);
    var src_obj_array = [];

    for (var i in src_array) {
      src_obj_array.push([]);
    }

    for (var item in m) {
      for (var iter in src_array) {
        if (m[item].src_id === src_array[iter]) {
          src_obj_array[src_array[iter]].push(m[item]);
        }

      }
    }

    for (var objArray in src_obj_array) {
      //console.log(src_obj_array[objArray]);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'partial'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'new'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'partial'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'new'
      }).length).toBe(0);

      var partial_array = _.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'partial'
      });

      for (var i in partial_array) {
        //console.log(partial_array[i]);
        expect(partial_array[i].percent).toBe(50);
        expect(partial_array[i].diff).toBeDefined();
      }

    }

  });

  it('compare two different plan sections that will have some partial match, some dups and some new', function () {
    var m = matchSections(js, js4, 'payers');
    //console.log(m);

    //Group arrays by source.
    var src_array = [];
    for (var item in m) {
      src_array.push(m[item].src_id);
    }

    src_array = _.uniq(src_array);
    var src_obj_array = [];

    for (var i in src_array) {
      src_obj_array.push([]);
    }

    for (var item in m) {
      for (var iter in src_array) {
        if (m[item].src_id === src_array[iter]) {
          src_obj_array[src_array[iter]].push(m[item]);
        }

      }
    }

    //Match One.
    expect(_.where(src_obj_array[0], {
      dest: 'dest'
    }).length).toBe(3);
    expect(_.where(src_obj_array[0], {
      dest: 'src'
    }).length).toBe(0);
    expect(_.where(src_obj_array[0], {
      dest: 'dest',
      match: 'new'
    }).length).toBe(1);
    expect(_.where(src_obj_array[0], {
      dest: 'src',
      match: 'new'
    }).length).toBe(0);
    expect(_.where(src_obj_array[0], {
      dest: 'dest',
      match: 'partial'
    }).length).toBe(1);
    expect(_.where(src_obj_array[0], {
      dest: 'dest',
      match: 'duplicate'
    }).length).toBe(1);

  });

});

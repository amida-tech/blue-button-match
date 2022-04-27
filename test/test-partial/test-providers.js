/*jshint -W117 */
// relaxed JSHint to allow use of xit and xdescribe to disable some test cases (make them pending)

"use strict";

var _ = require('underscore');
var path = require("path");
var fs = require('fs');
//var bbjs = require('@amida-tech/blue-button');

var matchSections = require(path.join(__dirname, "../../lib/match-sections.js")).matchSections;

var js, js2, js3, js4;

beforeAll(function (done) {
  // 2 sample poc
  js = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/providers.json'), 'utf-8').toString());

  //same as above but rearranged to be partial match
  js2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/providers2.json'), 'utf-8').toString());

  // has a bunch of plans different from all of the above
  js3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/providers3.json'), 'utf-8').toString());

  js4 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/providers4.json'), 'utf-8').toString());

  //console.log(bb);
  done();
});

describe('Provider partial matching library tests', function () {

  it('compare two different provider sections', function () {
    var m = matchSections(js, js3, 'providers');

    //console.log(JSON.stringify(js3, null, 10));
    //console.log(JSON.stringify(js, null, 10));
    //console.log(m);

    expect(m.length).toBe(6);
    expect(_.where(m, {
      dest: 'dest'
    }).length).toBe(4);
    expect(_.where(m, {
      dest: 'src'
    }).length).toBe(2);

    for (var item in m) {
      expect(m[item].match).toBe("new");
      expect(m[item]).toHaveProperty('src_id');
      expect(m[item]).toHaveProperty('dest_id');
    }

  });

  it('compare provider sections with itself', function () {
    var m = matchSections(js, js, 'providers');

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
      }).length).toBe(2);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'duplicate'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'new'
      }).length).toBe(1);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'duplicate'
      }).length).toBe(0);
      expect(_.where(src_obj_array[objArray], {
        dest: 'src',
        match: 'new'
      }).length).toBe(1);
    }

  });

  it('compare two different provider sections that will have all partial match', function () {
    var m = matchSections(js, js2, 'providers');

    //console.log(JSON.stringify(m, null, 4));

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

      //Partials only valid on one of the objects.
      if (src_obj_array[objArray][0].src_id === "1") {

        expect(_.where(src_obj_array[objArray], {
          dest: 'dest'
        }).length).toBe(2);
        expect(_.where(src_obj_array[objArray], {
          dest: 'src'
        }).length).toBe(1);
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'partial'
        }).length).toBe(2);
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
        }).length).toBe(1);

      }

      var partial_array = _.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'partial'
      });

      for (var i in partial_array) {
        //console.log(partial_array[i]);
        expect(partial_array[i].percent).toBe(25);
        expect(partial_array[i].diff).toBeDefined();
      }

    }

    //and now do the same but backwards
    var m = matchSections(js, js2.slice().reverse(), 'providers');

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

      //Partials only valid on one of the objects.
      if (src_obj_array[objArray][0].src_id === "1") {

        expect(_.where(src_obj_array[objArray], {
          dest: 'dest'
        }).length).toBe(2);
        expect(_.where(src_obj_array[objArray], {
          dest: 'src'
        }).length).toBe(1);
        expect(_.where(src_obj_array[objArray], {
          dest: 'dest',
          match: 'partial'
        }).length).toBe(2);
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
        }).length).toBe(1);

      }

      var partial_array = _.where(src_obj_array[objArray], {
        dest: 'dest',
        match: 'partial'
      });

      for (var i in partial_array) {
        //console.log(partial_array[i]);
        expect(partial_array[i].percent).toBe(25);
        expect(partial_array[i].diff).toBeDefined();
      }

    }

  });

  it('compare two different provider sections that will have some partial match, some dups and some new', function () {
    var m = matchSections(js, js4, 'providers');
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
    }).length).toBe(1);
    expect(_.where(src_obj_array[0], {
      dest: 'dest',
      match: 'new'
    }).length).toBe(2);
    expect(_.where(src_obj_array[0], {
      dest: 'src',
      match: 'new'
    }).length).toBe(1);
    expect(_.where(src_obj_array[0], {
      dest: 'dest',
      match: 'partial'
    }).length).toBe(0);
    expect(_.where(src_obj_array[0], {
      dest: 'dest',
      match: 'duplicate'
    }).length).toBe(1);

    //Match Two.
    expect(_.where(src_obj_array[1], {
      dest: 'dest'
    }).length).toBe(3);
    expect(_.where(src_obj_array[1], {
      dest: 'src'
    }).length).toBe(1);
    expect(_.where(src_obj_array[1], {
      dest: 'dest',
      match: 'new'
    }).length).toBe(1);
    expect(_.where(src_obj_array[1], {
      dest: 'src',
      match: 'new'
    }).length).toBe(1);
    expect(_.where(src_obj_array[1], {
      dest: 'dest',
      match: 'partial'
    }).length).toBe(1);
    expect(_.where(src_obj_array[1], {
      dest: 'dest',
      match: 'duplicate'
    }).length).toBe(1);

  });

});

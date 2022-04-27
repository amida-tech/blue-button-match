var lookups = require('../lib/lookups.js');

describe('lookups.js test', function () {
  it('check sections lookup', function () {
    //expect(true).to.equal(true);
    expect(lookups.sections).toBeTruthy();
  });

  it('check sections lookup to be array', function () {
    //expect(true).to.equal(true);
    expect(Array.isArray(lookups.sections)).toBe(true);
  });

  it('check sections lookup to have appropriate elements', function () {
    //expect(true).to.equal(true);

    expect(lookups.sections.length).toBe(18);
  });

});

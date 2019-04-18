const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const filter = require('../src/helpers/filter');

describe('Filter Tests', function() {
  describe('filter EQUALS', function() {
    it('should filter properly', function(done) {
      const string = 'foo=bar';
      const badString = 'foo~bar';
      expect(filter.equals(string)).to.deep.equal({foo: 'bar'});
      expect(filter.equals(badString)).to.deep.equal({});
      done();
    });
  });
})
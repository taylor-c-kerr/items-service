const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const filter = require('../src/helpers/filter');

describe('Filter Tests', function() {
  describe('EQUALS logic', function() {
    it('should match equals logic correctly', function(done) {
      const regex = new RegExp(`^jones$`, 'gi');
      const match1 = 'jones'.match(regex)
      const match2 = 'joNes'.match(regex)
      const match3 = 'JONES'.match(regex)

      expect(match1).to.deep.equal(['jones']);
      expect(match2).to.deep.equal(['joNes']);
      expect(match3).to.deep.equal(['JONES']);
      done();
    });
  });
  describe('CONTAINS logic', function() {
    it('should match contains logic correctly', function(done) {
      const regex = new RegExp(`.*on.*`, 'gi');
      const match1 = 'ONly'.match(regex)
      const match2 = 'beyONd'.match(regex)
      const match3 = 'surgeON'.match(regex)

      expect(match1).to.deep.equal(['ONly']);
      expect(match2).to.deep.equal(['beyONd']);
      expect(match3).to.deep.equal(['surgeON']);
      done();
    });
  });
  xdescribe('handle filter string', function() {
    it('should split the query string out correctly', function(done) {
      const string = 'foo=bar%20AND%20bar~foo';
      // const badString = 'foo~bar';
      // const longString = 'foo=bar&bar~foo';
      expect(filter.handleQueryString(string)).to.deep.equal(['foo=bar', 'bar~foo']);
      done();
    });
  });
  xdescribe('filter EQUALS', function() {
    it('should filter properly', function(done) {
      const string = 'foo=bar';
      const badString = 'foo~bar';
      const longString = 'foo=bar&bar~foo';
      expect(filter.equals(string)).to.deep.equal({foo: 'bar'});
      expect(filter.equals(badString)).to.deep.equal({});
      done();
    });
  });
  xdescribe('filter CONTAINS', function() {
    it('should filter properly', function(done) {
      const string = 'foo~bar';
      const badString = 'foo=bar';
      expect(filter.equals(string)).to.deep.equal({foo: 'bar'});
      expect(filter.equals(badString)).to.deep.equal({});
      done();
    });
  });
})
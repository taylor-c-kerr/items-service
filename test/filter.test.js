const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const filter = require('../src/helpers/filter');
const error = new Error('Invalid query');

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
  describe('filter EQUALS', function() {
    it('should filter properly', function(done) {
      const string = 'foo=%27bar%27';
      const badString = 'foo=bar';
      // const badFunc = () => filter(badString);
      expect(filter(string)).to.deep.equal({foo: /^bar$/gi});
      // expect(() => filter(badString)).to.throw(TypeError);
      expect(() => filter(badString)).to.throw(TypeError);
      done();
    });
  });
  describe('filter CONTAINS', function() {
    it('should filter properly', function(done) {
      const string = 'foo~%27bar%27';
      const badString = 'foo~bar';
      expect(filter(string)).to.deep.equal({foo: /.*bar.*/gi});
      expect(() => filter(badString)).to.throw(TypeError);
      done();
    });
  });
  describe('handle filter string', function() {
    it('should split the query string out correctly', function(done) {
      const andString = 'foo=%27bar%27%20AND%20bar~%27foo%27';
      const orString = 'foo=%27bar%27%20OR%20bar~%27foo%27';
      const longString = 'foo=%27bar%27%20AND%20bar~%27foo%27%20AND%20fizz~%27buzz%27'
      expect(filter(andString)).to.deep.equal({'$and': [{foo: /^bar$/gi}, {bar: /.*foo.*/gi}]});
      expect(filter(orString)).to.deep.equal({'$or': [{foo: /^bar$/gi}, {bar: /.*foo.*/gi}]});
      expect(() => filter(longString)).to.throw(TypeError);
      done();
    });
  });
})
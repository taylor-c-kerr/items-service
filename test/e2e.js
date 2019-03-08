var chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const app = require('../app')

// https://www.chaijs.com/api/bdd/

//TODO connect to test db
chai.use(chaiHttp);

describe('E2E Tests', function() {
  describe('GET /words', function() {
    it('should blah', function(done) {
      chai.request(app)
        .get('/api/words')
        .end( (err, res) => {
          // console.log(res.body)
          expect(42).to.equal(42)
          expect(res.body.count).to.be.a('number');
          expect(res.body.count).to.be.greaterThan(-1);
          expect(res.body.words).to.exist;
          expect(res.body.words).to.be.an('array');
          expect(res.body.words).to.have.lengthOf.above(-1);
          done()
        })
    });
  });
  /*describe('POST /word', function() {
    it('should blah', function() {
      // blah
    });
  });
  describe('GET /word', function() {
    it('should blah', function() {
      // blah
    });
  });
  describe('UPDATE /word', function() {
    it('should blah', function() {
      // blah
    });
  });
  describe('DELETE /word', function() {
    it('should blah', function() {
      // blah
    });
  });
  describe('GET /words', function() {
    it('should blah', function() {
      // blah
    });
  });
  describe('GET /words', function() {
    it('should blah', function() {
      // blah
    });
  });*/
});

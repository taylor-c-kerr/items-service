var chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const app = require('../app')

// https://www.chaijs.com/api/bdd/

//TODO connect to test db
chai.use(chaiHttp);

xdescribe('E2E Tests', function() {
  describe('GET /words', function() {
    it('should get all words', function(done) {
      chai.request(app)
        .get('/api/words')
        .end( (err, res) => {
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
  });*/

  describe('GET /word', function() {
    it('should get a single word', function(done) {
      chai.request(app)
        .get('/api/words/5c33ffe9ac8e06d6b6e1778a')
        .end( (err, res) => {
          expect(res.body._id).to.not.be.undefined;
          expect(res.body.name).to.not.be.undefined;
          expect(res.body.category).to.not.be.undefined;
          expect(res.body.inflections).to.be.an('array');
          expect(res.body.inflections).to.have.lengthOf.above(-1);
          expect(res.body.definition).to.be.an('array');
          expect(res.body.definition).to.have.lengthOf.above(-1);
          done()
        })
    });
  });
  /*describe('UPDATE /word', function() {
    it('should blah', function() {
      // blah
    });
  });*/
  /*describe('DELETE /word', function() {
    it('should blah', function() {
      // blah
    });
  });*/
});

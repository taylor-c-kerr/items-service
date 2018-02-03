var mongoose = require('mongoose');
var keys = require('../config/keys');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();
var Item = require('../models/item');


chai.use(chaiHttp);

describe('Items', function() {

	describe('GET all Items', function() {
	  it('should list ALL items with authorization', function(done) {
	  	chai.request('http://localhost:3000')
	  		.get('/api/items')
	  		.set('apikey', keys.api.key)
	  		.send()
	  		.end(function(err, res) {
	  			res.status.should.equal(200);
	  			res.body.count.should.equal(1159);
	  			res.body.types.should.be.a('array');
	  			res.body.types.should.deep.equal([
		        "animal",
		        "apparel",
		        "food",
		        "furniture",
		        "item",
		        "large item",
		        "place",
		        "plant",
		        "vehicle",
		        "weapon"
		    	]);
	  			res.body.items[0].name.should.equal('8 BALL');
	  			res.body.items[0].type.should.equal('item');
	  			res.body.items[0]._id.should.equal('5a5a2ff7e043ea213a95f08a');
	  			res.body.items[0].request.should.deep.equal({
	  				type: "GET", 
	  				url: "http://localhost:3000/api/items/5a5a2ff7e043ea213a95f08a"
	  			});
	  			done();
	  		})
	  });

	  it('should not list ALL items if authorization is not sent', (done) => {
	  	chai.request('http://localhost:3000')
	  		.get('/api/items')
	  		.send()
	  		.end((err, res) => {
	  			res.status.should.equal(401);
	  			res.body.error.should.equal("Not authorized");
	  			done();
	  		})
	  });
	});

  describe('GET one item', function() {
	  it('should list a SINGLE item with authorization', (done) => {
	  	chai.request('http://localhost:3000')
	  		.get('/api/items/5a5a2ff7e043ea213a95f097')
	  		.set('apikey', keys.api.key)
	  		.send()
	  		.end((err, res) => {
	  			res.status.should.equal(200);
	  			res.body.item.name.should.equal('APPLE');
	  			res.body.item.type.should.equal('food');
	  			res.body.item._id.should.equal('5a5a2ff7e043ea213a95f097');
	  			done();
	  		});
	  });

	  it('should not list one item if authorization is not sent', (done) => {
	  	chai.request('http://localhost:3000')
	  		.get('/api/items/5a5a2ff7e043ea213a95f097')
	  		.send()
	  		.end((err, res) => {
	  			res.status.should.equal(401);
	  			res.body.error.should.deep.equal("Not authorized");
	  			done();
	  		})
	  });
	});

	describe('POST one item', function() {
		it('should return a 401 if authorization is not sent', (done) => {
			chai.request('http://localhost:3000')
				.post('/api/items')
				.send({name : 'TEST ITEM', type : 'new type'})
				.end((err,res) => {
	  			res.status.should.equal(401);
	  			res.body.error.should.equal("Not authorized");
	  			done();
				})
		});


		it('should add a SINGLE item with authorization', (done) => {
			chai.request('http://localhost:3000')
				.post('/api/items')
	  		.set('apikey', keys.api.key)
				.send({name : 'TEST ITEM', type : 'new type'})
				.end((err, res) => {
					res.status.should.equal(201);
					res.body.message.should.equal('Item created');
					res.body.data.name.should.equal('TEST ITEM');
					res.body.data.type.should.equal('new type');
	  			done();
				});
		})
	});


	describe('UPDATE one item', function() {
/*		beforeEach(function() {
			chai.request('http://localhost:3000')
				.post('/api/items')
	  		.set('apikey', keys.api.key)
				.send({name : 'SQUASH', type : 'food'})
				.end((err,res) => {
	  			// res.status.should.equal(401);
	  			// res.body.error.should.equal("Not authorized");
	  			// done();
				})
		});

		afterEach(function() {
			chai.request('http://localhost:3000')
	  		.get('/api/items/')
	  		.set('apikey', keys.api.key)
	  		.send()
	  		.end((err, res) => {
	  			chai.request('http://localhost:3000')
	  				.delete('/api/items/' + res.body.items[res.body.items.length - 1]._id)
			  		.set('apikey', keys.api.key)
	  				.send()
	  				.end((error, response) => {
	  					// response.status.should.equal(200);
	  					// response.body.message.should.equal('Item deleted successfully');
	  					// done();
	  				})	  			
	  		})
		});*/

	  it('should not patch a SINGLE item without authorization', (done) => {
	  	chai.request('http://localhost:3000')
	  		.get('/api/items/')
	  		.send()
	  		.end((err, res) => {
	  			chai.request('http://localhost:3000')
  				.patch('/api/items/5a5a2ff7e043ea213a95f097')
  				.send()
  				.end((error, response) => {
  					response.status.should.equal(401);
  					console.log(response.body.message)
  					response.body.error.should.equal('Not authorized');
  					done();	  
  				});
				});
		});

	  it('should update a SINGLE item on /items/<id> PUT', (done) => {
			chai.request('http://localhost:3000')
  		.get('/api/items/')
  		.set('apikey', keys.api.key)
  		.send()
  		.end((err, res) => {
  			chai.request('http://localhost:3000')
				.patch('/api/items/' + res.body.items[res.body.items.length - 1]._id)
	  		.set('apikey', keys.api.key)
				.send({type : "thisIsATest"})
				.end((error, response) => {
					response.status.should.equal(200);
					response.body.message.should.equal('Item updated');
					done();	  
				});
		  });
		});
	});
	

	describe('DELETE one item', function() {
	  it('should not delete an item if authorization is not sent', (done) => {
			
			chai.request('http://localhost:3000')

	  		.delete('/api/items/' + '12345')
	  		.send()
	  		.end((err, res) => {
	  			res.status.should.equal(401);
	  			res.body.error.should.equal('Not authorized');
	  			done();
	  		})
	  });

	  it('should delete a SINGLE item with authorization', (done) => {
			

	  	chai.request('http://localhost:3000')
	  		.get('/api/items/')
	  		.set('apikey', keys.api.key)
	  		.send()
	  		.end((err, res) => {
	  			chai.request('http://localhost:3000')
	  				.delete('/api/items/' + res.body.items[res.body.items.length - 1]._id)
			  		.set('apikey', keys.api.key)
	  				.send()
	  				.end((error, response) => {
	  					response.status.should.equal(200);
	  					response.body.message.should.equal('Item deleted successfully');
	  					done();
	  				})	  			
	  		})
	  });
	});
});



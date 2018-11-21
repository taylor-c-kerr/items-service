var helpers = require('./helpers');
var mongoose = require('mongoose');
var Noun = require('./models/noun');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');


function postNoun(req, res, next) {
	console.log(req.body);
	const noun = new Noun({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		category : req.body.category
	});

	noun.save()
	.then(result => {
		res.status(201).json({
			message: "Noun created",
			data: {
				_id: result._id,
				name: result.name,
				category: result.category,
				request: {
					type: 'GET',
					url: `http://localhost:8080/api/nouns/${result._id}`
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json({error: err})
	});
}

function getAllNouns(req, res, next) {
	console.log(req.query)
	Noun.find(req.query)
	// Filter what fields I want to GET
	// .select('name _id')
	.exec()
	.then(docs => {
		console.log(docs);
		// var types = Array.from(new Set(docs.map(x => x.type))).sort();
		var response = {
			count: docs.length,
			nouns: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					category: doc.category,
					request: {
						type: 'GET',
						url: `http://localhost:8080/api/nouns/${doc._id}`
					}
				}
			})
		}
		res.status(200).json(response);
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
}

function getNoun (req, res, next) {
	var id = req.params.id;

	Noun.findById(id)
	// .select('name _id')
	.exec()
	.then(doc => {
		console.log(doc);
		if (doc) {
			res.status(200).json({
				_id: doc._id,
				name: doc.name,
				category: doc.category
			});
		} else {
			res.status(404).json({message: 'No valid entry found for provided ID'});
		}
	})
	.catch(err => {
			res.status(500).json({error: err,})
		});
}

function updateNoun(req, res, next) {
	var id = req.params.id;
	var updateObject = req.body;
	Noun.update({_id : id}, { $set : updateObject })
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Noun updated",
			request: {
				type: 'GET',
				url: 'http://localhost:8080/api/nouns/' + id
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

function deleteNoun(req, res, next) {
	var id = req.params.id;
	Noun.remove({_id : id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Noun deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json(err);
	})
}

module.exports = {
	postNoun: postNoun,
	getAllNouns: getAllNouns,
	getNoun: getNoun,
	updateNoun: updateNoun,
	deleteNoun: deleteNoun/*,
	handleToken: handleToken*/
}
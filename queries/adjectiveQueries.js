const mongoose = require('mongoose');
const Adjective = require('../models/adjective');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const postAdjective = (req, res, next) => {
	const adjective = new Adjective({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		category : req.body.category
	});

	adjective.save()
	.then(result => {
		res.status(201).json({
			message: "Adjective created",
			data: {
				_id: result._id,
				name: result.name,
				category: result.category,
				request: {
					type: 'GET',
					url: `http://localhost:8080/api/adjectives/${result._id}`
				}
			}
		})
	})
	.catch(error => {
		res.status(500).json({
			error: error
		})
	})
}

const getAllAdjectives = (req, res, next) => {
	Adjective.find()
	.exec()
	.then(docs => {
		let response = {
			count: docs.length,
			adjectives: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					category: doc.category,
					request: {
						type: 'GET',
						url: `http://localhost:8080/api/adjectives/${doc._id}`
					}
				}
			})
		}
		res.status(200).json(response);
	})
	.catch(error => {
		error: error
	})
}

const getAdjective =  (req, res, next) => {
	let id = req.params.id;
	Adjective.findById(id)
	.exec()
	.then(doc => {
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
	.catch(error => {
		res.status(500).json({error: error})
	})
}

const getRandomAdjective = (req, res, next) => {

}

const updateAdjective = (req, res, next) => {
	let id = req.params.id;
	let updateObject = req.body;
	Adjective.update( { _id : id }, { $set : updateObject } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Adjective updated",
			request: {
				type: 'GET',
				url: `http://localhost:8080/api/adjectives/${id}`
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

const deleteAdjective = (req, res, next) => {
	let id = req.params.id;
	Adjective.remove( { _id : id } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Adjective deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json(err);
	})
}

module.exports = {
	postAdjective,
	getAllAdjectives,
	getAdjective,
	getRandomAdjective,
	updateAdjective,
	deleteAdjective
}
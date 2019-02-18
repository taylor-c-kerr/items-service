const mongoose = require('mongoose');
const Verb = require('../models/verb');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const postVerb = (req, res, next) => {
	const verb = new Verb({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		category: req.body.category
	});

	verb.save()
	.then(result => {
		res.status(201).json({
			message: "Verb created",
			data: {
				_id: result._id,
				name: result.name,
				category: result.category,
				request: {
					type: 'GET',
					url: `http://localhost:8080/api/verbs/${result._id}`
				}
			}
		})
	})
}

const getAllVerbs = (req, res, next) => {
	Verb.find()
	.exec()
	.then(docs => {
		let response = {
			count: docs.length,
			verbs: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					category: doc.category,
					request: {
						type: 'GET',
						url: `http://localhost:8080/api/verbs/${doc._id}`
					}
				}
			})
		};
		res.status(200).json(response);
	})
	.catch(error => {
		res.status(500).json({
			error: error
		});
	});
}

const getVerb =  (req, res, next) => {
	let id = req.params.id;

	Verb.findById(id)
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
	.catch(err => {
		res.status(500).json({
			error: err
		})
	});
}

const getRandomVerb = (req, res, next) => {

}

const updateVerb = (req, res, next) => {
	let id = req.params.id;
	let updateObject = req.body;

	Verb.update( { _id : _id }, { $set : updateObject } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Verb updated",
			request: {
				type: 'GET',
				url: `http://localhost:8080/api/verbs/${id}`
			}
		})
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

const deleteVerb = (req, res, next) => {
	let id = req.params.id;
	Verb.remove( { _id : id } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Verb deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

module.exports = {
	postVerb,
	getAllVerbs,
	getVerb,
	getRandomVerb,
	updateVerb,
	deleteVerb
}
const mongoose = require('mongoose');
const Adverb = require('../models/adverb');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const postAdverb = (req, res, next) => {
	const adverb = new Adverb({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		category : req.body.category
	});

	adverb.save()
	.then(result => {
		res.status(201).json({
			message: "Adverb created",
			data: {
				_id: result._id,
				name: result.name,
				category: result.category,
				request: {
					type: 'GET',
					url: `http://localhost:8080/api/adverbs/${result._id}`
				}
			}
		})
	})
}

const getAllAdverbs = (req, res, next) => {
	Adverb.find()
	.exec()
	.then(docs => {
		// let types = Array.from(new Set(docs.map(x => x.type))).sort();
		let response = {
			count: docs.length,
			adverbs: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					category: doc.category,
					request: {
						type: 'GET',
						url: `http://localhost:8080/api/adverbs/${doc._id}`
					}
				}
			})
		}
		res.status(200).json(response);
	})
	.catch(error => {
		res.status(500).json({
			error: error
		});
	});
}

const getAdverb =  (req, res, next) => {
	let id = req.params.id;

	Adverb.findById(id)
	// .select('name _id')
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
		}
	);
}

const getRandomAdverb = (req, res, next) => {

}

const updateAdverb = (req, res, next) => {
	let id = req.params.id;
	let updateObject = req.body;
	Adverb.update( { _id : id }, { $set : updateObject } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Adverb updated",
			request: {
				type: 'GET',
				url: `http://localhost:8080/api/adverbs/${id}`
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

const deleteAdverb = (req, res, next) => {
	let id = req.params.id;
	Adverb.remove( { _id : id } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Adverb deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json(err);
	})
}

module.exports = {
	postAdverb,
	getAllAdverbs,
	getAdverb,
	getRandomAdverb,
	updateAdverb,
	deleteAdverb
}
var mongoose = require('mongoose');
var Word = require('../models/word');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

const postWord = (req, res, next) => {
	const word = new Word({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		category: req.body.category
	});

	word.save()
	.then(result => {
		res.status(201).json({
			message: "Word created",
			data: {
				_id: result._id,
				name: result.name,
				category: result.category,
				request: {
					type: 'GET',
					url: `http://localhost:8080/api/words/${result._id}`
				}
			}
		})
	})
}

const getAllWords = (req, res, next) => {
	if (req.query.random === 'true') {
		return getRandomWord(req, res, next);	
	}
	Word.find()
	.exec()
	.then(docs => {
		let response = {
			count: docs.length,
			words: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					category: doc.category,
					request: {
						type: 'GET',
						url: `http://localhost:8080/api/words/${doc._id}`
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

const getWord =  (req, res, next) => {
	let id = req.params.id;

	Word.findById(id)
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

const getRandomWord = (req, res, next) => {
	Word.aggregate( { $sample : { size : 1 } } )
	.exec()
	.then(doc => {
		let d = doc[0];
		res.status(200).json({
			name: d.name,
			category: d.category,
			request : {
				type: 'GET',
				url: `http://localhost:8080/api/words/${d._id}`
			}
		})
	})
	.catch(err => {
		res.status(500).json({
			error: err
		});
	});
}

const updateWord = (req, res, next) => {
	let id = req.params.id;
	let updateObject = req.body;

	Word.update( { _id : id }, { $set : updateObject } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Word updated",
			request: {
				type: 'GET',
				url: `http://localhost:8080/api/words/${id}`
			}
		})
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

const deleteWord = (req, res, next) => {
	let id = req.params.id;
	Word.remove( { _id : id } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Word deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

module.exports = {
	postWord,
	getAllWords,
	getWord,
	getRandomWord,
	updateWord,
	deleteWord
}
const mongoose = require('mongoose');
const Name = require('../models/name');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const postName = (req, res, next) => {
	console.log(req.body);
	const name = new Name({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		category : req.body.category
	});

	name.save()
	.then(result => {
		res.status(201).json({
			message: "Name created",
			data: {
				_id: result._id,
				name: result.name,
				category: result.category,
				request: {
					type: 'GET',
					url: `http://localhost:8080/api/names/${result._id}`
				}
			}
		});
	})
	.catch(error => {
		res.status(500).json({
			error: error
		})
	});
}
const getAllNames = (req, res, next) => {
	Name.find()
	// Filter what fields I want to GET
	// .select('name _id')
	.exec()
	.then(docs => {
		// let types = Array.from(new Set(docs.map(x => x.type))).sort();
		let response = {
			count: docs.length,
			names: docs.map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					category: doc.category,
					request: {
						type: 'GET',
						url: `http://localhost:8080/api/names/${doc._id}`
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

const getName =  (req, res, next) => {
	let id = req.params.id;

	Name.findById(id)
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

const getRandomName = (req, res, next) => {

}

const updateName = (req, res, next) => {
	let id = req.params.id;
	let updateObject = req.body;
	Name.update( { _id : id }, { $set : updateObject } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Name updated",
			request: {
				type: 'GET',
				url: `http://localhost:8080/api/names/${id}`
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

const deleteName = (req, res, next) => {
	let id = req.params.id;
	Name.remove( { _id : id } )
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Name deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json(err);
	})
}

module.exports = {
	postName,
	getAllNames,
	getName,
	getRandomName,
	updateName,
	deleteName
}
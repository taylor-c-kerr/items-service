var helpers = require('./helpers');
var mongoose = require('mongoose');
var Item = require('./models/item');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');


function postItem(req, res, next) {
	console.log(req.body);
	const item = new Item({
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		type : req.body.type
	});

	console.log('queries before being savd.  item: ' + item);
	item.save()
	.then(result => {
		console.log('promise after being saved.  item/result: ' + result)
		res.status(201).json({
			message: "Item created",
			data: {
				name: result.name,
				type: result.type,
				_id: result._id,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/api/items/' + result._id
				}
			}
		});
	})
	.catch(err => {
		res.status(500).json({error: err})
	});
}

function getAllItems(req, res, next) {
	Item.find()
	// Filter what fields I want to GET
	.select('name type _id')
	.exec()
	.then(docs => {
		var types = Array.from(new Set(docs.map(x => x.type))).sort();
		var response = {
			count: docs.length,
			types: types,
			items: docs.map(doc => {
				return {
					name: doc.name,
					type: doc.type,
					_id: doc._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/api/items/' + doc._id
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

function getItem (req, res, next) {
	var id = req.params.id;

	Item.findById(id)
	.select('name type _id')
	.exec()
	.then(doc => {
			if (doc) {
				res.status(200).json({
					item: doc
				});
			} else {
				res.status(404).json({message: 'No valid entry found for provided ID'});
			}
		})
	.catch(err => {
			res.status(500).json({error: err,})
		});
}

function updateItem(req, res, next) {
	var id = req.params.id;
	var updateObject = req.body;
	Item.update({_id : id}, { $set : updateObject })
	.exec()
	.then(result => {
		res.status(200).json({
			message: "Item updated",
			request: {
				type: 'GET',
				url: 'http://localhost:3000/api/items/' + id
			}
		});
	})
	.catch(err => {
		res.status(500).json({ error : err });
	})
}

function deleteItem(req, res, next) {
	var id = req.params.id;
	Item.remove({_id : id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Item deleted successfully'
		});
	})
	.catch(err => {
		res.status(500).json(err);
	})
}

/*function handleToken(req, res, next) {
	helpers.verifyAuth(req.headers.authorization, (error, result) => {
		if (error) {
			console.log(error);
		}
		else {
			res.cookie('itemCookie', 'itemCookieValue');
			res.status(200).json({
				message: 'Token received',
				params: req.params,
				body: req.body,
				headers: req.headers
			})
		}
	});
}*/

module.exports = {
	postItem: postItem,
	getAllItems: getAllItems,
	getItem: getItem,
	updateItem: updateItem,
	deleteItem: deleteItem/*,
	handleToken: handleToken*/
}
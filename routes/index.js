var express = require('express');
var router = express.Router();
var db = require('../queries')

function isAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	} else {
		res.send('Not authorized to see this!');
	}
}


router.post('/api/items', isAuthenticated, db.postItem);
router.get('/api/items', db.getAllItems);
router.get('/api/items/:id', db.getItem);
router.patch('/api/items/:id', db.updateItem);
router.delete('/api/items/:id', db.deleteItem);

module.exports = router;

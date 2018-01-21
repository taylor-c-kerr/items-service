var express = require('express');
var router = express.Router();
var db = require('../queries')

function isAuthenticated(req, res, next) {
	console.log(req.user);
	if (req.user) {
		res.redirect('http://localhost:8000/index.html');
		return next();
	} else {
		res.status(401).json({
			message: "Not authorized"
		});
	}
}


router.post('/api/items', isAuthenticated, db.postItem);
router.get('/api/items', isAuthenticated, db.getAllItems);
router.get('/api/items/:id', isAuthenticated, db.getItem);
router.patch('/api/items/:id', isAuthenticated, db.updateItem);
router.delete('/api/items/:id', isAuthenticated, db.deleteItem);

module.exports = router;

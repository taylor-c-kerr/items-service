var express = require('express');
var router = express.Router();
var db = require('../queries')


router.post('/api/items', db.postItem);
router.get('/api/items', db.getAllItems);
router.get('/api/items/:id', db.getItem);
router.patch('/api/items/:id', db.updateItem);
router.delete('/api/items/:id', db.deleteItem);

module.exports = router;

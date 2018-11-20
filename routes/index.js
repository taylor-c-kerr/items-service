var express = require('express');
var router = express.Router();
var db = require('../queries');


router.post('/api/nouns', db.postNoun);
router.get('/api/nouns', db.getAllNouns);
router.get('/api/nouns/:id', db.getNoun);
router.patch('/api/nouns/:id', db.updateNoun);
router.delete('/api/nouns/:id', db.deleteNoun);

module.exports = router;
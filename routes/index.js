var express = require('express');
var router = express.Router();
var noun = require('../queries/nounQueries');


router.post('/api/nouns', noun.postNoun); // curl -X POST http://localhost:8080/api/nouns -H 'Content-Type: application/json' -d '{"name":"pretzel","category":["food","test"]}'
router.get('/api/nouns', noun.getAllNouns);
router.get('/api/nouns/:id', noun.getNoun);
router.get('/api/noun', noun.getRandomNoun);
router.patch('/api/nouns/:id', noun.updateNoun);
router.delete('/api/nouns/:id', noun.deleteNoun);

router.get('/ping', (req, res, next) => {
	res.status(200).send('pong');
})

module.exports = router;
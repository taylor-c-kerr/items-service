const express = require('express');
const router = express.Router();
const noun = require('../queries/nounQueries');
const verb = require('../queries/verbQueries');
const adjective = require('../queries/adjectiveQueries');
const adverb = require('../queries/adverbQueries');
const word = require('../queries/wordQueries');
const name = require('../queries/nameQueries');


router.post('/api/nouns', noun.postNoun); // curl -X POST http://localhost:8080/api/nouns -H 'Content-Type: application/json' -d '{"name":"pretzel","category":["food","test"]}'
router.get('/api/nouns', noun.getAllNouns);
router.get('/api/nouns/:id', noun.getNoun);
router.get('/api/noun', noun.getRandomNoun);
router.patch('/api/nouns/:id', noun.updateNoun);
router.delete('/api/nouns/:id', noun.deleteNoun);

router.post('/api/verbs', verb.postVerb); // curl -X POST http://localhost:8080/api/verbs -H 'Content-Type: application/json' -d '{"name":"queef","category":["action","test"]}'
router.get('/api/verbs', verb.getAllVerbs);
router.get('/api/verbs/:id', verb.getVerb);
router.get('/api/verb', verb.getRandomVerb);
router.patch('/api/verbs/:id', verb.updateVerb);
router.delete('/api/verbs/:id', verb.deleteVerb);

router.post('/api/adjectives', adjective.postAdjective); // curl -X POST http://localhost:8080/api/adjectives -H 'Content-Type: application/json' -d '{"name":"queef","category":["action","test"]}'
router.get('/api/adjectives', adjective.getAllAdjectives);
router.get('/api/adjectives/:id', adjective.getAdjective);
router.get('/api/adjective', adjective.getRandomAdjective);
router.patch('/api/adjectives/:id', adjective.updateAdjective);
router.delete('/api/adjectives/:id', adjective.deleteAdjective);

router.post('/api/adverbs', adverb.postAdverb); // curl -X POST http://localhost:8080/api/adverbs -H 'Content-Type: application/json' -d '{"name":"queef","category":["action","test"]}'
router.get('/api/adverbs', adverb.getAllAdverbs);
router.get('/api/adverbs/:id', adverb.getAdverb);
router.get('/api/adverb', adverb.getRandomAdverb);
router.patch('/api/adverbs/:id', adverb.updateAdverb);
router.delete('/api/adverbs/:id', adverb.deleteAdverb);

router.post('/api/names', name.postName); // curl -X POST http://localhost:8080/api/names -H 'Content-Type: application/json' -d '{"name":"queef","category":["action","test"]}'
router.get('/api/names', name.getAllNames);
router.get('/api/names/:id', name.getName);
router.get('/api/name', name.getRandomName);
router.patch('/api/names/:id', name.updateName);
router.delete('/api/names/:id', name.deleteName);

router.post('/api/words', word.postWord); // curl -X POST http://localhost:8080/api/words -H 'Content-Type: application/json' -d '{"word":"queef","category":["action","test"]}'
router.get('/api/words', word.getAllWords);
router.get('/api/words/:id', word.getWord);
router.get('/api/word', word.getRandomWord);
router.patch('/api/words/:id', word.updateWord);
router.delete('/api/words/:id', word.deleteWord);

router.get('/liveops/ping', (req, res, next) => {
	res.status(200).send('pong\n');
})

module.exports = router;
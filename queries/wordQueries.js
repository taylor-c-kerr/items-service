const mongoose = require('mongoose');
const Word = require('../models/word');
const oxford = require('../services/oxford-dictionary-service');

const postWord = (req, res, next) => {
  const word = new Word({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    category: req.body.category,
    inflections : [],
    definition: []
  });

  Word.findOne({name: req.body.name})
  .exec()
  .then(response => {
    if (response) {
      return res.status(401).json({
        message: 'this word already exists'
      })
    }
    else {
      return oxford.getDefinitionAndInflection(word.name)
        .then(result => {
          // setting the word to what we got from oxford
          word.name = result.name;
          word.inflections = result.inflections;
          word.definition = result.definition;
          console.log(word)
        })
        .then(() => {
          word.save()
            .then((result) => {
              res.status(201).json({
                message: 'Word created',
                data: {
                  _id: result._id,
                  name: result.name,
                  category: result.category,
                  definition: result.definition,
                  request: {
                    type: 'GET',
                    url: `http://localhost:8080/api/words/${result._id}`
                  }
                }
              });
            })
        })
        .catch(error => {
          error.name === 'ValidationError' ? res.status(500).json({error: "One or more missing fields"}) : res.status(500).json({error: `Unknown Error: ${error.name}`})
        });
    }
  })
};

const getAllWords = (req, res, next) => {
  if (req.query.random === 'true') {
    return getRandomWord(req, res, next);
  }
  if (req.query.name) {
    return getWordByName(req, res, next);
  }

  Word.find({}, '_id name')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        words: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            request: {
              type: 'GET',
              url: `http://localhost:8080/api/words/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

const getWord = (req, res, next) => {
  const id = req.params.id;

  Word.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          name: doc.name,
          category: doc.category,
          inflections: doc.inflections,
          definition: doc.definition
        });
      } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

const updateWord = (req, res, next) => {
  const id = req.params.id;
  const updateObject = req.body;

  Word.update( {_id: id}, {$set: updateObject} )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Word updated',
        request: {
          type: 'GET',
          url: `http://localhost:8080/api/words/${id}`
        }
      });
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
};

const deleteWord = (req, res, next) => {
  const id = req.params.id;
  Word.remove( {_id: id} )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Word deleted successfully'
      });
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
};

const getWordsWithoutDefinitions = (req, res, next) => {
  Word.find({
    definition: {$size: 0},
    category: {$in: ['adjective', 'adverb', 'noun', 'verb']}
  })
    .exec()
    .then((docs) => {
      const response = {
        words: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

const getRandomWord = (req, res, next) => {
  Word.aggregate( {$sample: {size: 1}} )
    .exec()
    .then((doc) => {
      const d = doc[0];
      res.status(200).json({
        name: d.name,
        category: d.category,
        definition: doc.definition,
        inflections: doc.inflections,
        request: {
          type: 'GET',
          url: `http://localhost:8080/api/words/${d._id}`
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

const getWordByName = (req, res, next) => {
  const name = req.query.name;

  Word.findOne({"name": name})
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc)
      }
      else {
        res.status(404).json({message: 'Word does not exist in db'});
      }
    })
}

module.exports = {
  postWord,
  getAllWords,
  getWord,
  getRandomWord,
  getWordsWithoutDefinitions,
  updateWord,
  deleteWord
};

const mongoose = require('mongoose');
const Word = require('../models/word');
const oxford = require('../services/oxford-dictionary-service');
const response  = require('../helpers/responseHelpers');

const postWord = (req, res) => {
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
        })
        .then(() => {
          word.save()
            .then((result) => {
              res.status(201).json({
                message: 'Word created',
                data: response.getOne(result)
              });
            })
        })
        .catch(error => {
          error.name === 'ValidationError' ? res.status(500).json({error: "One or more missing fields"}) : res.status(500).json({error: `Unknown Error: ${error.name}`})
        });
    }
  })
};

const getAllWords = (req, res) => {
  if (req.query.random === 'true') {
    return getRandomWord(req, res);
  }
  if (req.query.name) {
    return getWordByName(req, res);
  }

  Word.find({}, '_id name')
    .exec()
    .then((docs) => {
      res.status(200).json(response.getMany(docs));
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

const getWord = (req, res) => {
  const id = req.params.id;

  Word.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(response.getOne(doc))
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

// TODO: fix response
const updateWord = (req, res) => {
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

// TODO: fix response
const deleteWord = (req, res) => {
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

const getWordsWithoutDefinitions = (req, res) => {
  Word.find({
    definition: {$size: 0},
    category: {$in: ['adjective', 'adverb', 'noun', 'verb']}
  })
    .exec()
    .then((docs) => {
      res.status(200).json(response.getMany(docs));
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};

const getWordsWithOldDefinition = (req, res) => {
  Word.find({
    // definition: { results : {$gt: 0} }
    "definition.results" : {$size: 1}
  })
  .exec()
    .then((docs) => {
      res.status(200).json(response.getMany(docs));
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
}

const getRandomWord = (req, res) => {
  console.log('random')
  Word.aggregate( {$sample: {size: 1}} )
    .exec()
    .then((doc) => {
      // console.log(doc)
      const d = doc[0];
      res.status(200).json(response.getOne(d));
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

const getWordByName = (req, res) => {
  const name = req.query.name;

  Word.findOne({"name": name})
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(response.getOne(doc))
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
  getWordsWithOldDefinition,
  updateWord,
  deleteWord
};

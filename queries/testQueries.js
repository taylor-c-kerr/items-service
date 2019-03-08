const mongoose = require('mongoose');
const Test = require('../models/test');
const oxford = require('../services/oxford-dictionary-service');

const postTest = (req, res, next) => {
  const test = new Test({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    category: req.body.category,
    inflections : [],
    definition: []
  });

  Test.findOne({name: req.body.name})
  .exec()
  .then(response => {
    if (response) {
      return res.status(401).json({
        message: 'this test already exists'
      })
    }
    else {
      return oxford.getDefinitionAndInflection(test.name)
        .then(result => {
          // setting the test to what we got from oxford
          test.name = result.name;
          test.inflections = result.inflections;
          test.definition = result.definition;
          console.log(test)
        })
        .then(() => {
          test.save()
            .then((result) => {
              res.status(201).json({
                message: 'Test created',
                data: {
                  _id: result._id,
                  name: result.name,
                  category: result.category,
                  definition: result.definition,
                  request: {
                    type: 'GET',
                    url: `http://localhost:8080/api/tests/${result._id}`
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

const getAllTests = (req, res, next) => {
  if (req.query.random === 'true') {
    return getRandomTest(req, res, next);
  }
  if (req.query.name) {
    return getTestByName(req, res, next);
  }

  Test.find({}, '_id name')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        tests: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            request: {
              type: 'GET',
              url: `http://localhost:8080/api/tests/${doc._id}`
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

const getTest = (req, res, next) => {
  const id = req.params.id;

  Test.findById(id)
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

const updateTest = (req, res, next) => {
  const id = req.params.id;
  const updateObject = req.body;

  Test.update( {_id: id}, {$set: updateObject} )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Test updated',
        request: {
          type: 'GET',
          url: `http://localhost:8080/api/tests/${id}`
        }
      });
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
};

const deleteTest = (req, res, next) => {
  const id = req.params.id;
  Test.remove( {_id: id} )
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Test deleted successfully'
      });
    })
    .catch((err) => {
      res.status(500).json({error: err});
    });
};

const getTestsWithoutDefinitions = (req, res, next) => {
  Test.find({
    definition: {$size: 0},
    category: {$in: ['adjective', 'adverb', 'noun', 'verb']}
  })
    .exec()
    .then((docs) => {
      const response = {
        tests: docs.map((doc) => {
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

const getRandomTest = (req, res, next) => {
  Test.aggregate( {$sample: {size: 1}} )
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
          url: `http://localhost:8080/api/tests/${d._id}`
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

const getTestByName = (req, res, next) => {
  const name = req.query.name;

  Test.findOne({"name": name})
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json(doc)
      }
      else {
        res.status(404).json({message: 'Test does not exist in db'});
      }
    })
}

module.exports = {
  postTest,
  getAllTests,
  getTest,
  getRandomTest,
  getTestsWithoutDefinitions,
  updateTest,
  deleteTest
};

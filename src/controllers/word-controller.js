const mongoose = require('mongoose');
const Word = require('../models/word');
const oxford = require('../services/oxford-dictionary-service');
const responseHelper = require('../helpers/responseHelpers');
const newDefinition = require('../helpers/definition');
const f = require('../helpers/find');
const filter = require('../helpers/filter');
const allowed = require('../constants/allowed');

const postWord = async (req, res) => {

  if (!req.body.name) {
    return res.status(500).json({
      error: 'Invalid request'
    })
  }

  const word = new Word({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    category: [],
    inflections: [],
    definition: []
  });

  const alreadyInDb = await f.findOne(Word, {name: word.name});
  if (alreadyInDb) {
    return res.status(500).json({error: 'Word already exists'});
  }

  try {
    const properDefinition = await oxford.getDefinitionAndInflection(word.name);
    word.name = properDefinition.name;
    word.inflections = properDefinition.inflections;

    word.definition = await newDefinition(properDefinition.definition[0].results);

    word.save()
      .then((result) => {
        res.status(201).json({
          message: 'Word created',
          data: responseHelper.getOne(word)
        });
      });
  } catch (error) {
    return res.status(500).json({error: `Invalid word: ${word.name}`});
  }
};

const getAllWords = async (req, res) => {
  const sortField = req.query.sort;
  const orderBy = req.query.orderBy;
  if (req.query.random === 'true') {
    return getRandomWord(req, res);
  }

  let criteria = {};

  if (req.query.filter) {
    try {
      criteria = filter(req.query.filter);
    }
    catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  }

  let sort = {};

  // both sort and orderBy, AND both are allowed, pass both
  if (sortField && orderBy && allowed.sortableFields.indexOf(sortField) > -1 && allowed.orderableFields.indexOf(orderBy) > -1) {
    sort[sortField] = orderBy;
  }
  // sort but not orderBy, AND sort is allowed, pass sort and 'asc'
  else if (sortField && !orderBy && allowed.sortableFields.indexOf(sortField) > -1) {
    sort[sortField] = 'asc';
  }
  // pass undefined and use the default sort
  else {
    sort = undefined;
  }

  try {
    const words = await f.findMany(Word, criteria, '_id name', sort);
    return res.status(200).json(responseHelper.getMany(words, req.query.limit, req.query.offset));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error
    });
  }
};

const getWord = async (req, res) => {
  const id = req.params.id;
  try {
    const word = await f.findById(Word, id);
    if (word) {
      return res.status(200).json(responseHelper.getOne(word));
    } else {
      return res.status(404).json({error: 'word does not exist'});
    }
  } catch (error) {
    return res.status(500).json({
      error: error
    });
  }
};

const updateWord = async (req, res) => {
  const id = req.params.id;
  const updateObject = req.body;

  try {
    const word = await f.findById(Word, id);
    if (!word) {
      return res.status(404).json({error: 'Word does not exist'});
    }
  } catch (error) {
    return res.status(500).json({error: error});
  }

  try {
    const updated = await Word.update( {_id: id}, {$set: updateObject} ).exec();
    word = await f.findById(Word, id);
    return res.status(200).json(responseHelper.getOne(word));
  } catch (error) {
    return res.status(500).json({error: error});
  }
};

const deleteWord = async (req, res) => {
  const id = req.params.id;
  try {
    const word = await f.findById(Word, id);
    await Word.remove( {_id: id} ).exec();
    return res.status(200).json({name: word.name, message: 'Word deleted successfully'});
  } catch (error) {
    return res.status(500).json({error: error});
  }
};

const getWordsWithoutDefinitions = async (req, res) => {
  const criteria = {
    definition: {$size: 0},
    category: {$nin: ['name']}
  };

  try {
    const words = await f.findMany(Word, criteria, '_id name');
    return res.status(200).json(responseHelper.getMany(words, req.query.limit, req.query.offset));
  } catch (error) {
    return res.status(500).json({
      error: error
    });
  }
};

const getWordsWithOldDefinition = async (req, res) => {
  const criteria = {
    // definition: { results : {$gt: 0} }
    'definition.results': {$size: 1}
  };

  try {
    const words = await f.findMany(Word, criteria, '_id name');
    return res.status(200).json(responseHelper.getMany(words, req.query.limit, req.query.offset));
  } catch (error) {
    return res.status(500).json({
      error: error
    });
  }
};

const getRandomWord = async (req, res) => {
  try {
    const word = await f.findRandom(Word);
    return res.status(200).json(responseHelper.getOne(word[0]));
  } catch (error) {
    return res.status(500).json({
      error: error
    });
  }
};

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

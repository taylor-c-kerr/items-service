const mongoose = require('mongoose');

/*
  ** @param {object} model
  ** @param {object} criteria
*/
const findOne = async (model, criteria) => {
	return model.findOne(criteria).exec();
}

const findById = async (model, id) => {
	return model.findById(id).exec();
}

const findMany = async (model, criteria, fields) => {
	return model.find(criteria, fields).exec();
}

const findRandom = async (model) => {
	return model.aggregate({$sample: {size: 1}}).exec();
}

module.exports = {
	findOne,
	findById,
	findMany,
	findRandom
};
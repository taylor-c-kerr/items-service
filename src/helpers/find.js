const mongoose = require('mongoose');

/*
  ** @param {object} model
  ** @param {object} criteria
*/
const one = async (model, criteria) => {
	return model.findOne(criteria).exec();
}

/*
  ** @param {object} model
  ** @param {object} criteria
*/
const byId = async (model, id) => {
	return model.findById(id).exec();
}

/*
  ** @param {object} model
  ** @param {object} criteria
  ** @param {object} fields
  ** @param {object} sort
*/
const many = async (model, criteria, fields, sort={name: 'asc'}) => {
	return model.find(criteria, fields).sort(sort).exec();
}

/*
  ** @param {object} model
*/
const random = async (model) => {
	return model.aggregate({$sample: {size: 1}}).exec();
}

module.exports = {
	one,
	byId,
	many,
	random
};
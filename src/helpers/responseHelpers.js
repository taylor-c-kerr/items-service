/*
** @param {object} doc A single document returned from the db
** @returns {object}
*/
const getOne = (doc) => {
	return {
		_id: doc._id,
		name: doc.name,
		category: doc.category,
		definition: doc.definition,
		url: `/api/words/${doc._id}`
	}
}

/*
** @param {array} docs An array of single documents returned from the db
** @returns {object}
*/
const getMany = (docs) => {
	return {
	  count: docs.length,
	  words: docs.map((doc) => {
	    return {
	      _id: doc._id,
	      name: doc.name,
	      url: `/api/words/${doc._id}`
	    };
	  })
	};
}


module.exports = {
	getOne,
	getMany
}
/*
** @param {object} doc A single record returned from the db
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
** @param {integer} limit The number of records to return on a GET call
** @param {integer} offset The offset or page number of the responses
** @returns {object}
*/
const getMany = (docs, limit=25000, offset=0) => {
	const total = docs.length;
	offset = Math.ceil(parseInt(offset));
	limit = Math.ceil(parseInt(limit));

	// capping the number of records to limit
	limit = limit < 501 ? Math.ceil(limit) : 500;

	if (offset > total) {
		offset = (total - offset);
	}

	const filtered = docs.slice(offset, offset + limit);

	return {
	  totalCount: total,
	  countOnPage: filtered.length,
	  words: filtered.map((doc) => {
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
const axios = require('axios');
const oxford = require('../config').oxford;

const getDefinition = (word) => {
	return axios({
		method: 'get',
		url: `${oxford.url}/entries/en/${word}`,
		headers: {
			app_id: oxford.app_id,
			app_key: oxford.app_key
		}
	})
	.then(response => {
		return response.data
	})
}

const getInflection = (word) => {
	return axios({
		method: 'get',
		url: `${oxford.url}/inflections/en/${word}`,
		headers: {
			app_id: oxford.app_id,
			app_key: oxford.app_key
		}
	})
	.then(response => {
		return response.data.results
	})
}

module.exports = {
	getDefinition,
	getInflection
}
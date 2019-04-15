const axios = require('axios');
const oxford = require('../../config').oxford;

/*
	** @param {string} word
	** @returns {}
*/
const getDefinition = async (word) => {
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

/*
	** @param {string} word
	** @returns {}
*/
const getInflection = async (word) => {
	return axios({
		method: 'get',
		url: `${oxford.url}/inflections/en/${word}`,
		headers: {
			app_id: oxford.app_id,
			app_key: oxford.app_key
		}
	})
	.then(response => {
		return response.data.results[0].lexicalEntries[0].inflectionOf[0].id;
	})
}

/*
	** @param {string} word
	** @returns {}
*/
const getDefinitionAndInflection = async (word) => {
	let res = {
		name: word,
		inflections: [],
		definition: []
	};
	return getDefinition(word)
		.then(response => {
			res.definition.push(response);
			// console.log(res)
			return res
		})
		.catch(error => {
			let res = {};
			res.inflections = [word]
			return getInflection(word)
				.then(response => res.name = response)
				.then(() => {
					return getDefinition(res.name)
						.then(response => {
							res.definition = [response];
							// console.log(res)
							return res
						})
				})
		})
}

module.exports = {
	getDefinitionAndInflection
}
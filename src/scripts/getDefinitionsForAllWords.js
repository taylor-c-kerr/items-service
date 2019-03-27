const axios = require('axios');
const getDefinition = require('./getDefinition');
const express = require('express');
const router = express.Router();
const word = require('../controllers/word-controller');
const url = 'http://localhost:8080/api/words'

const delay = () => {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

const go = async () => {
	let allWords = await axios.get('http://localhost:8080/api/dev/words/oldDefinition');
	allWords = allWords.data.words;

	for (const word of allWords) {
		// get the word
		const w = await axios.get(`${url}/${word._id}`);
		// if it is not a name
		if (w.data.category.indexOf('name') === -1) {
			// console.log(w.data)
			console.log(w.data.name)
			// console.log(w.data.definition)
			
			// w.data.definition.length > 1 ?  : console.log()
			
			if (w.data.definition.length === 1 && w.data.definition[0].results) {
				const newDef = await getDefinition(w.data.definition[0].results);
				// console.log(newDef)
				await axios({
					method: 'patch',
					url: `http://localhost:8080/api/words/${w.data._id}`,
					data: {
						definition: newDef
					}
				})
					.then(response => console.log(response.data))
			}
			else {
				console.log(`Unexpected error for ${w.data.name}. Check the definition and try again`);
			}
			// w.data.definition.length ? console.log(w.data.definition) : console.log(`${w.data.name} does not have a definition`)
		}

		await delay()
	}
}

go();
// const word = require('./bow');
// const word = require('./boastfully');
// const definitions = word.definition[0].results;

/*
** @param {array} allDefinitions List of definitions from Oxford that needs to be cleaned up
*/
const getDefinition = (allDefinitions) => {
	for (const definition of allDefinitions) {
		let result = [];
		const partsOfSpeech = definition.lexicalEntries;

		for (const part of partsOfSpeech) {
			let pos = {partOfSpeech: '', entries: []};
			pos.partOfSpeech = part.lexicalCategory;
			const entries = part.entries;

			for (const entry of entries) {
				let en = {definitions: []};
				const senses = entry.senses;

				if (!entry.senses) {
					pos.entries.push(`see ${part.derivativeOf[0].id}`);
					// console.log(`see ${part.derivativeOf[0].id}`);
					break;
				}
				for (const sense of senses) {
					const defs = sense.definitions ? sense.definitions : null;
					if (defs) {

						for (const def of defs) {
							pos.entries.push(def);
						}
					}
					if (sense.subsenses) {
						for (const subsense of sense.subsenses) {
							if (subsense.definitions) {
								for (const subDef of subsense.definitions) {
									pos.entries.push(subDef);
								}
							}
						}
					}
				}
			}
			result.push(pos);
		}
		// console.log(JSON.stringify(result, null, 2));

		return Promise.resolve(result);
		// return result;
	}
}

module.exports = getDefinition;

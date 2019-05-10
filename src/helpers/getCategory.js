const getCategoryFromDefinition = async (definition) => {
  let categories = [];
  for (const def of definition) {
    await categories.push(def.partOfSpeech.toLowerCase())
  }
  return categories;
}

module.exports = getCategoryFromDefinition;
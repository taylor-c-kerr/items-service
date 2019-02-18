const mongoose = require('mongoose');

const adverbSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : String,
	category : Array
});


module.exports = mongoose.model('Adverb', adverbSchema);
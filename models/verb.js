const mongoose = require('mongoose');

const verbSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : String,
	category : Array
});


module.exports = mongoose.model('Verb', verbSchema);
const mongoose = require('mongoose');

const adjectiveSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : String,
	category : Array
});


module.exports = mongoose.model('Adjective', adjectiveSchema);
const mongoose = require('mongoose');

const wordSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : String,
	category : Array,
	defintion : Array
});


module.exports = mongoose.model('Word', wordSchema);
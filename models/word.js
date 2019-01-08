var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : String,
	category : Array
});


module.exports = mongoose.model('Word', wordSchema);
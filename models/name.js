const mongoose = require('mongoose');

const nameSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : String,
	category : Array
});


module.exports = mongoose.model('Name', nameSchema);
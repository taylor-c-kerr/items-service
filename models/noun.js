var mongoose = require('mongoose');

var nounSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	// name : {type: String, required: true}
	name : String,
	category : Array
});


module.exports = mongoose.model('Noun', nounSchema);
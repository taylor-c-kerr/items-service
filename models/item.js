var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	name : {type: String, required: true},
	type : {type: String, required: true}
});


module.exports = mongoose.model('Item', itemSchema);
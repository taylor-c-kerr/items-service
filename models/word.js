const mongoose = require('mongoose');

const wordSchema = mongoose.Schema({
	_id : {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	name : {
		type: String,
		required: true
	},
	category : {
		type: Array,
		required: true
	},
	inflections : {
		type: Array,
		required: true
	},
	definition : {
		type: Array,
		required: true
	}
});


module.exports = mongoose.model('Word', wordSchema);
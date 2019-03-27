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
		required: false
	},
	inflections : {
		type: Array,
		required: false
	},
	definition : {
		type: Array,
		required: false
	}
});


module.exports = mongoose.model('Word', wordSchema);
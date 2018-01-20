var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id : mongoose.Schema.Types.ObjectId,
	googleId: String,
	email: String,
	role: String
});

var User = mongoose.model('user', userSchema);

module.exports = User;
const keys = require('./config/keys');

function verifyAuth(token, callback) {
	if (token === keys.api.key) {
		callback(null, true);
	}
	else {
		callback('Error', false);
	}
}

module.exports = {
	verifyAuth
}
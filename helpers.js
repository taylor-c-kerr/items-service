const keys = require('./config/keys');
const request = require('request');

function verifyAuth(token, callback) {
	var url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token;
	request.get(url, (error, response, body) => {
		var res = JSON.parse(response.body);
		if (res.email === keys.user.email && res.iss === 'accounts.google.com') {
			callback(null, true);
		}
		else{
			callback('error', false);
		}
		
	})
}


module.exports = {
	verifyAuth
}
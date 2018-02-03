const keys = require('./config/keys');
const request = require('request');

function verifyAuth(token, callback) {
	var url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token;
	// console.log(url);
	request.get(url, (error, response, body) => {
		var res = JSON.parse(response.body);
		if (res.email === 'tckerr14@gmail.com' && res.iss === 'accounts.google.com') {
			callback(null, true);
		}
		else{
			callback('error', false);
		}
		
	})
}

// verifyAuth('eyJhbGciOiJSUzI1NiIsImtpZCI6IjI2YzAxOGIyMzNmZTJlZWY0N2ZlZGJiZGQ5Mzk4MTcwZmM5YjI5ZDgifQ.eyJhenAiOiIxMDQwOTUzODcyMTM2LWhsaGltaTUzNGtxYXR0NzUwYWltanUwazU3MG1rdmc3LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTA0MDk1Mzg3MjEzNi1obGhpbWk1MzRrcWF0dDc1MGFpbWp1MGs1NzBta3ZnNy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMDU3MzE5NTE1MjI0NzU3NzY1NCIsImVtYWlsIjoidGNrZXJyMTRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJURGFlOW5DZzdleEYxNk90QUVuRjZBIiwiZXhwIjoxNTE3MjgxOTU3LCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiYjUzZmM2MjFhYTk4OGRmMTBiNGY5NzE1Y2JhMmFkMDgxMTAwODgxZiIsImlhdCI6MTUxNzI3ODM1NywibmFtZSI6IlRheWxvciBLZXJyIiwicGljdHVyZSI6Imh0dHBzOi8vbGg1Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tbUV0WXJxanA1dWsvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUE2WlBUNVZwODNqY3JhVFJFNzFKSGJZVUVkN29rNDh2US9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiVGF5bG9yIiwiZmFtaWx5X25hbWUiOiJLZXJyIn0.IO9vrJsl5DBXl4O0oGE1VZM_5NlruN47aomhmf2NlOuU9yedVirSCH095QPKvH6ChMrdyNV4Aju_YQI20OetdRB4Y5nCGuDq2em41gQhAitznlPqrn83MSfIIVld9Vj69CCDpXjAygQa5YUS6K7Xb_NwNEL48n7jq42HN0-3FowLADt4mghlmnjmxvp90MEwVcAa7gXRJisOONkAxMQZiAqDp1a77bqVi_8AXkwd8xwENcEyS9k3poRJAbtrdC99K6zPqEMnIM_11iPYMom4--LPd3m4yxU6QkznIuzn0HXAoOF85qVuTEM6VT8UymUurxVQFVrpRaWk2-h6vLcISw');

module.exports = {
	verifyAuth
}
// I probably need to take this out beause I only want the express app to be the API
// Logging in needs to be done on the client and the API will send responses depending on the role in the db
// 
// 

var router = require('express').Router();

var authCheck = (req, res, next) => {
	if (!req.user) {
		// user not lgged in.
		res.redirect('/auth/login');
	} else {
		// user logged in. go on to the next part of middleware
		next();
	}
}

router.get('/', authCheck, (req, res) => {
	res.send("You are logged in.  This is your profile - " + req.user.email);
});

module.exports = router;
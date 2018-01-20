var router = require('express').Router();

var authCheck = (req, res, next) => {

}

router.get('/', authCheck, (req, res) => {
	res.send("You are logged in.  This is your profile - " + req.user.email);
});

module.exports = router;
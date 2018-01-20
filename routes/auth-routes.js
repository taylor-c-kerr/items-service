var router = require('express').Router();
var passport = require('passport');

// auth login
router.get('/login', (req, res) => {
	res.send('login');
});

// auth logout
router.get('/logout', (req, res) => {
	// handle with passport
	res.send('logging out');
})

// auth with google
router.get('/google', passport.authenticate('google', {
	// comma separate things in the scope
	// scope: ['profile']
	scope: ['email']
	// scope: ['https://www.googleapis.com/auth/plus.profile.emails.read']
}));

// callback route for google to redirct to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	// handling the code in the redirect url
	// res.send('you reached the redirect URI');
	// res.send(req.user);
	res.redirect('/profile/');
});

module.exports = router;
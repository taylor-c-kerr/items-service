var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
var keys = require('./keys');
var User = require('../models/user');
var mongoose = require('mongoose');


// when done method is called in the passport callback below, 
// we pass the user to this serializeUser which takes the user 
// and performs some action on it.  
// All we are going to send to the next stage is 
// the id to put in the cookie
passport.serializeUser((user,done) => {
	// going to put the id into a cookie
	done(null, user.id);
});

passport.deserializeUser((id,done) => {
	// going to put the id into a cookie
	// who does the id belong to
	User.findById(id).then(user => {
		done(null, user);
	})
	
});

passport.use(
	new GoogleStrategy({
		// options for the strategy
		callbackURL: '/auth/google/redirect',
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret
	}, (accessToken, refreshToken, profile, done) => {
		// accessToken: we receive from Google to access the profile
		// refreshToken: refresh the access token becasue it expires after time
		// profile: information passport gets with the code in the redirect
		// done: need to call when done with callback
		
		// check if user already exists in db
		User.findOne({googleId: profile.id})
		.then(currentUser => {
			if(currentUser) {
				// user exists
				console.log('user is:', currentUser);
				done(null, currentUser);
			} else {
				// create new user
				new User({
					_id: new mongoose.Types.ObjectId(),
					googleId: profile.id,
					email: profile.emails[0].value
				})
				.save()
				.then((newUser) => {
					// console.log('New user created: ' + newUser);
					done(null, newUser);
				});

			}
		})





	})
);
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

var User = require('./schemas/user');

passport.use(new LocalStrategy(
	function(username, password, done) {
        User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return done(err); }

                // Password did not match
                if (!isMatch) { return done(null, false); }

                // Success
                return done(null, user);
            });
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, {username: username});
});

module.exports = passport;
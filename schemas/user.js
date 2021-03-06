var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var User = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password:{ type: String, required: true },
    email: String,
    role: String,
    friends: [ String ]
});

User.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

User.methods.isFriendOf = function( friend ) {
    return ( this.friends.indexOf(friend) != -1 );
};

User.methods.getID= function() {
    return (this._id);
};
User.methods.getFriends= function() {
    return (this.friends);
};

//Here is the code for encriptiong the users password upon creation
User.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

User.methods.verifyPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', User);

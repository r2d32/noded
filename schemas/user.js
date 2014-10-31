var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username: String,
    password:String,
    email: String,
    role: String,
    friends: [ mongoose.Schema.Types.ObjectId ]
});

User.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

User.methods.getID= function() {
    return (this._id);
};

module.exports = mongoose.model('User', User);
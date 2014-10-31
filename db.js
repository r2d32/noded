var mongoose = require('mongoose');

mongoose.connect('mongodb://r2d32:cRKpAPtsJoVkSqv8@ds047930.mongolab.com:47930/tshare');

module.exports = mongoose.connection;
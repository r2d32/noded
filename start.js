var port = process.env.PORT || 5000;

var http = require('http'),
    tasks = require('./data'),
    db = require('./db'),
    app = require('./app')(tasks, db);

app.listen(port)
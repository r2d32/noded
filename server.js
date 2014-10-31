var http = require('http'),
	tasks = require('./data'),
	db = require('./db'),
	app = require('./app')(tasks, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
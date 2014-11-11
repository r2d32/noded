
/**
 * Module dependencies.
 */

module.exports = function (tasks, db) {
	var express = require('express');
	var MongoStore = require('connect-mongo')(express);
	var passport = require('./auth');
	var routes = require('./routes')(tasks);
	var path = require('path');	
	var app = express();

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
    app.use(express.session({
    	secret: 'keyboard cat',
    	store: new MongoStore({mongoose_connection: db})
    }))
    app.use(passport.initialize());
    app.use(passport.session());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(function (req, res, next) {
		res.set('X-Powered-By', 'TShare');
		next();
	});
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	app.get('/task/:id', routes.task);
	app.get('/task/:id/delete', routes.deleteTask);
	app.put('/task/:id/dateTask', routes.dateTask);
	app.get('/list', routes.list);
	app.get('/tasks', routes.tasks);
	app.get('/userTasks', routes.userTasks);
	app.get('/friendTasks', routes.friendTasks);
	app.delete('/userTasks', routes.deleteTask);
	app.delete('/:username/deleteUser', routes.deleteUser);
	app.get('/search_member', routes.searchUsers);
	app.get('/users', routes.users);
	app.post('/task/:name/:description/:date/createTask', routes.createTask);
	app.post('/task/:username/:email/:password/createUser', routes.createUser);
	
	app.get('/login', routes.login);
	app.post('/login', passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/user'
	}));

	app.get('/newTask', routes.newTask);
	app.post('/newTask',routes.createTask);


    app.post('/createFriendRequest', routes.createFriendRequest);
    app.get('/userFriendRequests', routes.userFriendRequests);
    app.get('/deleteFriend/:friendName', routes.deleteFriend);
	app.get('/user', routes.user);
	app.get('/request/:friendID/accept', routes.addFriend);
	app.get('/friends', routes.friends);
	app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
    });

	return app;
}



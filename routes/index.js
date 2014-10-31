
/*
 * GET home page.
 */

var TaskSchema = require('../schemas/task');
var UserSchema = require('../schemas/user');


module.exports = function (tasks) {
    var task = require('../task');

    for(var id in tasks) {
        tasks[id] = task(tasks[id]);
    }

    var functions = {};

    functions.task = function(req, res){
        var id = req.param('id');

        if (typeof tasks[id] === 'undefined') {
            res.status(404).json({status: 'error'});
        } else {
            res.json(tasks[id].getInformation());
        }
    };

    functions.dateTask = function (req, res) {

        var id = req.param('id');

        TaskSchema.update({ _id: id }, 
            { $set: { name: 'large', date:Date.now() }}, 
            function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({status: 'failure'});
                } else {
                    res.json({status: 'success'});
                }
            }
        );
            
    };

    functions.list = function (req, res) {
        res.render('list', {
            title: 'All Tasks', 
            tasks: tasks});
    };

    functions.tasks = function(req, res) {
        if (req.session.passport.user === undefined) {
            res.redirect('/login');
        } else {

            TaskSchema.find()
            .setOptions({sort: 'id'})
            .exec(function(err, tasks) {
                if (err) {
                    res.status(500).json({status: 'failure'});
                } else {
                    res.render('tasks', {
                        title: 'See Whats up',
                        tasks: tasks,
                        user: req.user
                    });
                }
            });
        }
    };

    functions.userTasks = function(req, res) {

        if (req.session.passport.user === undefined) {
            res.redirect('/login');
        } else {

            UserSchema.findOne({ username: req.session.passport.user }, function(err, user) {
                if (err) {
                    console.log(err);
                    res.status(404).json({status: err})
                }
                if (user) {
                    TaskSchema.find({author: user.getID()})
                    .setOptions({sort: 'id'})
                    .exec(function(err, tasks) {
                        if (err) {
                            res.status(500).json({status: 'failure'});
                        } else {
                            res.render('tasks', {
                                title: 'See Whats up',
                                tasks: tasks,
                                user: req.user
                            });
                        }
                    });
                }
            });

        }
    };

    functions.users = function(req, res) {
        if (req.session.passport.user === undefined) {
            res.redirect('/login');
        } else {

            UserSchema.find()
            .setOptions({sort: 'username'})
            .exec(function(err, users) {
                if (err) {
                    res.status(500).json({status: 'failure'});
                } else {
                    res.render('users', {
                        title: 'See Whats up',
                        users: users,
                        user: req.user
                    });
                }
            });
        }
    };

    functions.createTask = function(req, res){
        var author; 
        var name = req.param('name');
        var description = req.param('description');
        var date = req.param('date');
        
        UserSchema.findOne({ username: req.session.passport.user }, function(err, user) {
            if (err) {
                console.log(err);
                res.status(404).json({status: err})
            }
            if (user) {
                author = user.getID();
                console.log(author);

                var record = new TaskSchema({
                    name: name,
                    description: description,
                    date:date,
                    author:author
                });

                record.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({status: err});
                    } else {
                        res.redirect('/userTasks');
                    }
                });
            }
        });
    };
    functions.createUser = function(req, res){
        
        var username = req.param('username');
        var email = req.param('email');
        var password = req.param('password');
        var record = new UserSchema(
            {
                username: username,
                email: email,
                password:password
            }
        );

        record.save(function(err) {
            if (err) {
                console.log(err);
                res.status(500).json({status: err});
            } else {
                res.json({status: 'success'});
            }
        });
    };

    functions.deleteTask = function(req, res){
        var id = req.param('id');
        TaskSchema.remove({ _id: id }, function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({status: 'failure'});
            } else {
                res.redirect('/userTasks');
            }
        });
    };
    
    functions.login = function(req, res){
        res.render('login', {title: 'Log in'});
    };

    functions.newTask = function(req, res){
        res.render('newTask', {title: 'Task Creation'});
    };

    functions.user = function(req, res) {
        if (req.session.passport.user === undefined) {
            res.redirect('/login');
        } else {
            res.render('user', {title: 'Welcome!',
                user: req.user
            })
        }
    };

    return functions;
};












/*
 * GET home page.
 */

var TaskSchema = require('../schemas/task');
var UserSchema = require('../schemas/user');
var RequestSchema = require('../schemas/friendRequest');



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

    functions.friendTasks = function(req, res) {

        if (req.session.passport.user === undefined) {
            res.redirect('/login');
        } else {

            UserSchema.findOne({ username: req.session.passport.user }, function(err, user) {
                if (err) {
                    console.log(err);
                    res.status(404).json({status: err})
                }
                if (user) {
                    
                    UserSchema.find({ username: { $in: user.friends}}, function(err, friends){

                        TaskSchema.find({ author: {$in: friends}}).exec(function(err, tasks){
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
                    author:author,
                    authorName: req.session.passport.user
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
        var friends = [];
        var role = '';
        var record = new UserSchema(
            {
                username: username,
                email: email,
                password:password,
                friends: friends,
                role: role
            }
        );

        record.save(function(err) {
            if (err)
            res.send(err);

            res.redirect('/userFriendResquests');
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

    functions.deleteUser = function(req, res){
        var username = req.param('username');
        UserSchema.remove({ username: username }, function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({status: 'failure'});
            } else {
                res.redirect('/users');
            }
        });
    };

    functions.deleteFriend = function(req, res){
        var friendName = req.param('friendName');
        
        UserSchema.findOne({ username: req.session.passport.user }, function(err, user) {
            var newFriends = (user.friends.lenght > 1)? user.friends.splice(user.friends.indexOf(friendName), 1) : [];
            UserSchema.update({username: req.session.passport.user}, { $set: { friends: newFriends }}, {} , function(err) {
                if (err)
                res.send(err);

                UserSchema.findOne({ username: friendName }, function(err, friend) {
                    var newFriendsOfFriend = (friend.friends.lenght > 1)? friend.friends.splice(friend.friends.indexOf(req.session.passport.user), 1) : [];
                    UserSchema.update({username: friendName}, { $set: { friends: newFriendsOfFriend }}, {} , function(err) {
                        if (err)
                        res.send(err);
                    });
                });
                res.redirect('/friends');
            });
        });
    }
    
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

    functions.createFriendRequest = function(req, res){
        var sender = req.session.passport.user;
        var recipient = req.param('recipient');
        var Request = new RequestSchema(
            {
                sender: sender,
                recipient: recipient,
                status: 'Pending'
            }
        );

        Request.save(function(err) {
            if (err)
            res.send(err);

            res.json({ message: 'New Request added from ' +req.user });
        });
    };

    functions.userFriendRequests = function(req, res){
        RequestSchema.find({recipient: req.session.passport.user})
        .setOptions({sort: 'id'})
        .exec(function(err, friendRequests) {
            if (err) {
                res.status(500).json({status: 'failure'});
            } else {
                res.render('friendRequests', {
                    title: 'See Your Requests',
                    friendRequests: friendRequests,
                    user: req.user
                });
            }
        });
    };

    functions.searchUsers = function(req, res) {
        var buildResultSet = function(docs) {
            var result = [];
            for(var object in docs){
                result.push(docs[object]);
            }
            return result;
        };
        var regex = new RegExp(req.query["term"], 'i');
        var query = UserSchema.find({username: regex}, { 'username': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
            
          // Execute query in a callback and return users list
        query.exec(function(err, users) {
            if (!err) {
                // Method to construct the json result set
                var result = buildResultSet(users); 
                res.send(result, {
                    'Content-Type': 'application/json'
                }, 200);
            } else {
                res.send(JSON.stringify(err), {
                    'Content-Type': 'application/json'
                }, 404);
            }
        });
    };

    functions.addFriend = function(req, res){
        var friendID = req.param('friendID');

        UserSchema.update({username: req.session.passport.user}, {$push: {friends:[friendID]}}, {} , function(err) {
            if (err)
            res.send(err);

            UserSchema.update({username: friendID}, {$push: {friends:[req.session.passport.user]}}, {} , function(err) {
                if (err)
                res.send(err);
            });
            RequestSchema.remove({ sender: friendID }, function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({status: 'failure'});
                }
            });

            res.redirect('/friends');
        });
    };

    functions.friends = function(req, res){
        UserSchema.find({username: req.session.passport.user})
        .setOptions({sort: 'id'})
        .exec(function(err, thisUser) {
            if (err) {
                res.status(500).json({status: 'failure'});
            } else {
                res.render('friends', {
                    title: 'See Your Friends',
                    thisUser: thisUser,
                    user: req.user
                });
            }
        });

    };


    return functions;
};











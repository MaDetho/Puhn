//Require Variables
var https = require('https'),
    fs = require('fs'),
    config = require('./config'),
    mongo = require('./mongo'),
    crypto = require("crypto-js"),
    Channel = require('./channel.js'),
    _ = require('underscore'),
    uuid = require('node-uuid');

//SSL
var options = {
    key: fs.readFileSync(config.ssl.keyLocation),
    cert: fs.readFileSync(config.ssl.certLocation)
};

//Redirect to Puhn.net
var app = https.createServer(options, function (req, res) {
    res.writeHead(302, {
        'Location': 'http://puhn.net'
    });
    res.end();
});
var io = require('socket.io').listen(app);

app.listen(config.https.port);

//Chat Variables
var users = {};
var channels = {};
var sockets = [];


io.sockets.on('connection', function (socket) {
    socket.on('sign in', function (userdata, callback) {
        mongo.userAuthenticate(userdata.username, userdata.password, function (isValid) {
            if (isValid) {
                mongo.getFullUserByUsername(userdata.username, function (user) {
                    users[socket.id] = user;
                    sockets[user._id] = socket;
                    socket.channels = [];
                    callback(user);
                });
            } else {
                callback(false);
            }
        });
    });
    
    socket.on('open convo', function (friend, callback) {
        mongo.getFriendlistIds(users[socket.id].usr, function (friendList) {
            mongo.exGetObjectIdbyUsername(friend, function (friendId) {
                //If friend is really in friendlist
                if (friendList.friends.indexOf(friendId) > -1) {
                    //If socket of friend is available (is online)
                    console.log(friend + " is friend");
                    if (typeof sockets[friendId] !== "undefined") {
                        console.log(friend + " has socket");
                        var id = uuid.v4();
                        var channel = new Channel(id, socket.id);
                        channel.addPerson(users[socket.id]._id);
                        channel.addPerson(friendId);
                        channels[id] = channel;
                        socket.channels.push(id);
                        sockets[friendId].channels.push(id);
                        socket.join(id);
                        sockets[friendId].join(id);
                        callback("YOU:" + users[socket.id]._id + " FRIEND:" + friendId + " joined Channel:" + id);
                    } else {
                        //no socket found - hes offline?   
                        console.log(friend + " has NO socket");
                    }
                } else {
                    //Is not a friend
                    console.log(friend + " is NO friend");
                }
            });
        });
    });
    
});
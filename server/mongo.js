var config = require('./config'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

//MongoDB Connection
mongoose.connect(config.mongodb.uri, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to MongoDB');
    }
});

//User Collection Schema
var userSchema = mongoose.Schema({
    usr: String,
    pwd: String,
    email: String,
    firstname: String,
    lastname: String,
    avatar: String,
    status: String,
    lastseen: Date,
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    emoticons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emoticons'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

//Message Collection Schema
var chatMessageSchema = mongoose.Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    msg: String,
    time: String,
    created: {
        type: Date,
        default: Date.now
    }
});

//Emoticons Collection Schema
var emoticonsSchema = mongoose.Schema({
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    link: String,
    shortcut: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var mongoMessage = mongoose.model('Message', chatMessageSchema);
var mongoUser = mongoose.model('User', userSchema);
var mongoEmoticon = mongoose.model('Emoticon', emoticonsSchema);

/**
 * Create New User
 * @method createNewChatUser
 * @param {} username
 * @param {} password
 * @param {} firstname
 * @param {} lastname
 * @param {} email
 * @param {} avatar
 * @param {} callback
 * @return
 */
function createNewChatUser(username, password, firstname, lastname, email, avatar, callback) {
    var newUser = new mongoUser({
        usr: username,
        pwd: password,
        firstname: firstname,
        lastname: lastname,
        email: email,
        avatar: avatar,
        status: "online",
        lastseen: Date()
    });
    //Save user
    newUser.save(function (err, user) {
        if (err) return handleError(err);
        callback(true);
    });
}

/**
 * Get objectId for user
 * @method getObjectIdbyUsername
 * @param {} username
 * @param {} callback
 * @return
 */
function getObjectIdbyUsername(username, callback) {
    mongoUser.findOne({
        usr: username
    })
        .select('_id')
        .exec(function (err, user) {
            if (err) return handleError(err);
            callback(user._id);
        });
}

/**
 * Check if User Exists
 * @method usernameExists
 * @param {} username
 * @param {} callback
 * @return
 */
function usernameExists(username, callback) {
    mongoUser.count({
        usr: username
    }, function (err, count) {
        if (err) return handleError(err);
        if (count > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

/**
 * Add friend
 * @method addFriend
 * @param {} username
 * @param {} friendId
 * @param {} callback
 * @return
 */
function addFriend(username, friendId, callback) {
    mongoUser.findOneAndUpdate({
            usr: username
        }, //Username
        {
            $addToSet: {
                friends: friendId
            }
        }, // User _id of friend
        {
            safe: true,
            upsert: true
        },
        function (err) {
            if (err) return handleError(err);
            callback(true);
        }
    );
}

/**
 * remove friend
 * @method removeFriend
 * @param {} username
 * @param {} friendId
 * @param {boolean} callback
 * @return
 */
function removeFriend(username, friendId, callback) {
    mongoUser.findOneAndUpdate({
            usr: username
        }, //Username
        {
            $pull: {
                friends: friendId
            }
        }, // User _id of friend
        {
            safe: true,
            upsert: true
        },
        function (err, model) {
            if (err) return handleError(err);
            callback(true);
        });
}

/**
 * get user with friends
 * @method getFullUserByUsername
 * @param {} username
 * @param {user} callback
 * @return
 */
exports.getFullUserByUsername = function (username, callback) {
    mongoUser.findOne({
        usr: username
    })
        .select('-pwd -created')
        .populate('friends', '-pwd -created')
        .exec(function (err, user) {
            if (err) return handleError(err);
            callback(user);
        });
}

/**
 * Authenticate User
 * @method userAuthenticate
 * @param {} username
 * @param {} password
 * @param {boolean} callback
 * @return
 */
exports.userAuthenticate = function (username, password, callback) {
    mongoUser.findOne({
        usr: username
    })
        .exec(function (err, user) {
            if (err) return handleError(err);
            if (!user) return callback(false);
            bcrypt.compare(password, user.pwd, function (err, res) {
                callback(res);
            });
        });
}

/**
 * Add Friend Prozess
 * @method addFriendProcess
 * @param {} username
 * @param {} friendusername
 * @param {boolean} callback
 * @return
 */
exports.addFriendProcess = function (username, friendusername, callback) {
    usernameExists(friendusername, function (exists) {
        if (exists) {
            getObjectIdbyUsername(friendusername, function (friendId) {
                addFriend(username, friendId, function (done) {
                    callback(done);
                });
            });
        } else {
            callback(false);
        }
    });
}

/**
 * Remove Friend Prozess
 * @method addFriendProcess
 * @param {} username
 * @param {} friendusername
 * @param {} callback
 * @return
 */
exports.removeFriendProcess = function (username, friendusername, callback) {
    usernameExists(friendusername, function (exists) {
        if (exists) {
            getObjectIdbyUsername(friendusername, function (friendId) {
                removeFriend(username, friendId, function (done) {
                    callback(done);
                });
            });
        } else {
            callback(false);
        }
    });
}

/**
 * Register new User prozess
 * @method registerUserProzess
 * @param {} username
 * @param {} password
 * @param {} firstname
 * @param {} lastname
 * @param {} email
 * @param {} avatar
 * @param {boolean} callback
 * @return
 */
exports.registerUserProzess = function (username, password, firstname, lastname, email, avatar, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            usernameExists(username, function (exists) {
                if (!exists) {
                    createNewChatUser(username, hash, firstname, lastname, email, avatar, function (done) {
                        callback(done);
                    });
                } else {
                    callback(false);
                }
            });
        });
    });
}


/**
 * Error Handler
 * @method handleError
 * @param {} error
 * @return
 */
function handleError(error) {
    console.log(error);
}
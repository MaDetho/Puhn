var config 		= require('./config');
var mongoose 	= require('mongoose');

//MongoDB Connection
mongoose.connect(config.mongodb.uri, function(err){
	if(err) {
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
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	emoticons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Emoticons' }],
	created: {type: Date, default: Date.now}
});

//Message Collection Schema
var chatMessageSchema = mongoose.Schema({
	_creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	msg: String,
	time: String,
	created: {type: Date, default: Date.now}
});

//Emoticons Collection Schema
var emoticonsSchema = mongoose.Schema({
	_creator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	link: String,
	shortcut: String,
	created: {type: Date, default: Date.now}
});

var mongoMessage = mongoose.model('Message', chatMessageSchema);
var mongoUser = mongoose.model('User', userSchema);
var mongoEmoticon = mongoose.model('Emoticon', emoticonsSchema);

//Create New User
exports.createNewChatUser = function(username, password, firstname, lastname, email, avatar, callback) {
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
	newUser.save(function(err, user){
		if(err) return handleError(err);
		callback(true);
	});
}



// Add friend
function addFriend(username, friendId, callback) {
	mongoUser.findOneAndUpdate(
		{usr: username}, //Username
		{$addToSet: {friends: friendId}}, // User _id of friend
		{safe: true, upsert: true},
		function(err) {
			if (err) return handleError(err);
			callback(true);
		}
	);
}

// remove friend
function removeFriend(username, friendId, callback) {
	mongoUser.findOneAndUpdate(
		{usr: username}, //Username
		{$pull: {friends: friendId}}, // User _id of friend
		{safe: true, upsert: true},
		function(err, model) {
			if (err) return handleError(err);
			callback(true);
		});
}


// get user with friends
function getFullUserByUsername(username, callback) {
	mongoUser.findOne({usr: username})
	.select('-pwd -created')
	.populate('friends', '-pwd -created')
	.exec(function (err, user) {
	  if (err) return handleError(err);
	  callback(user);
	});
}

// get objectId user
function getObjectIdbyUsername(username, callback) {
	mongoUser.findOne({usr: username})
	.select('_id')
	.exec(function (err, user) {
	  if (err) return handleError(err);
	  callback(user._id);
	});
}

// Check if User Exists
function usernameExists(username, callback) {
	mongoUser.count({ usr: username }, function (err, count) {
		if (err) return handleError(err);
		if(count > 0){
			callback(true);
		} else {
			callback(false);
		}
	});
}

// Authenticate User
function userAuthenticate(username, password, callback) {
	mongoUser.count({ usr: username, pwd: password }, function (err, count) {
		if (err) return handleError(err);
		if(count > 0){
			callback(true);
		} else {
			callback(false);
		}
	});
}

//Add Friend Prozess
function addFriendProcess(username, friendusername, callback) {
	usernameExists(friendusername, function(exists) {
		if(exists) {
			getObjectIdbyUsername(friendusername, function(friendId) {
				addFriend(username, friendId, function(done) {
					callback(done);
				}
			}
		} else {
			callback(false);
		}
	}
}

//Remove Friend Prozess
function addFriendProcess(username, friendusername, callback) {
	usernameExists(friendusername, function(exists) {
		if(exists) {
			getObjectIdbyUsername(friendusername, function(friendId) {
				removeFriend(username, friendId, function(done) {
					callback(done);
				}
			}
		} else {
			callback(false);
		}
	}
}

//Register new User prozess
function registerUserProzess(username, password, firstname, lastname, email, avatar, callback) {
	usernameExists(username, function(exists) {
		if(!exists) {
			createNewChatUser(username, password, firstname, lastname, email, avatar, function(done) {
				callback(done);
			}
		} else {
			callback(false);
		}
	}
}


function handleError(error){
	console.log(error);
}
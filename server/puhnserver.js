//Variables
var https       = require('https'),
    fs          = require('fs'),
    config      = require('./config'),
    mongo       = require('./mongo'),
    crypto      = require("crypto-js");

//SSL
var options = {
    key: fs.readFileSync(config.ssl.keyLocation),
    cert: fs.readFileSync(config.ssl.certLocation)
};

//Redirect to Puhn.net
var app = https.createServer(options, function (req, res) {
    res.writeHead(302, {'Location': 'http://puhn.net'});
    res.end();
});
var io = require('socket.io').listen(app);
	
app.listen(config.https.port);

io.sockets.on('connection', function (socket) {
    console.log("Connected");
});


//Variables
var https 		= require('https'),
	fs 			= require('fs'),
	config 		= require('./config'),
	mongo	 	= require('./mongo'),
	crypto 		= require("crypto");

//SSL
var options = {
    key: fs.readFileSync('ssl/puhn-key.pem'),
    cert: fs.readFileSync('ssl/puhn-cert.pem')
};

//Redirect to Puhn.net
var app = https.createServer(options, function (req, res) {
    res.writeHead(302, {'Location': 'http://puhn.net'});
    res.end();
}),
    io = require('socket.io').listen(app);
	
app.listen(9001);

io.sockets.on('connection', function (socket) {
    console.log("Connected");
});


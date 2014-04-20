var config = {};


config.socket = {};
config.links = {};
config.views = {};
config.views.signin = {};
config.views.chat = {};

config.socket.host = 'https://puhn.net:9001';
config.socket.port = '9001';
config.socket.url  = config.socket.url + ':' + config.socket.port;

config.views.signin.filename = 'signin.html';
config.views.chat.filename = 'application.html';

config.links.signup = 'http://puhn.net/signup/';
config.links.recover = 'http://puhn.net/recover/';

module.exports = config;
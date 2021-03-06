//////////////////////////////////////////////////////////////////////////////////////
//Enable HTTPS Auth
require('https').globalAgent.options.rejectUnauthorized = false; 

// Variables
var gui                 = require('nw.gui');
var io                  = require('socket.io-client');
var viewUtil            = require('../js/ViewUtil.js');
var config              = require('../js/PuhnConfig.js');
var socket              = io.connect(config.socket.url, {secure: true}); // Secure Socket.IO SSL Connection
var menubar             = new gui.Menu({type:'menubar'});
var file                = new gui.Menu();
var help                = new gui.Menu();
var optionMenu          = new gui.Menu();
var win                 = gui.Window.get();
var screenWidth         = window.screen.availWidth;
var screenHeight        = window.screen.availHeight;
var retina              = window.devicePixelRatio > 1;
var openedConvos        = {};

//////////////////////////////////////////////////////////////////////////////////////
// Remember me

// Get the localStorage items needed for sign in
var rememberMeValue     = localStorage.getItem('rememberMe');
var usernameVal         = localStorage.getItem('signInUsername');
var passwordVal         = localStorage.getItem('signInPassword');

// When the checkbox is ticked
$('#rememberMe').change(function(){
    if($(this).is(':checked')) {
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.setItem('rememberMe', 'false');
    }
});

// Tick the checkbox if localStorage is 'true'
if(rememberMeValue == 'true') {
    $('#rememberMe').prop('checked', true);
    $('#signInUsername').val(usernameVal);
    $('#signInPassword').val(passwordVal);
} else if(rememberMeValue == null) {
    $('#signInUsername').focus();
} else {
    $('#signInUsername').val(usernameVal);
    $('#rememberMe').prop('checked', false);
    $('#signInPassword').focus();
}

//////////////////////////////////////////////////////////////////////////////////////
// Menu bar
menubar.append(new gui.MenuItem({label:'File',submenu:file}));
menubar.append(new gui.MenuItem({label:'Help',submenu:help}));
menubar.items[0].submenu.append(new gui.MenuItem({
    label: 'Show Dev Tools',
    click: function() {
        win.showDevTools();
    }
}));
win.menu = menubar;

//////////////////////////////////////////////////////////////////////////////////////
// Options Context Menu
optionMenu.append(new gui.MenuItem({
    label: 'Profile settings',
    click: function() {
        $('#profileSettings').fadeIn(200);
        $('#settingsButton').click(function() {
            $('#profileSettings').fadeOut(200);
        });
    }
}));
optionMenu.append(new gui.MenuItem({ label: 'Manage friends' }));
optionMenu.append(new gui.MenuItem({ label: 'How-to guide' }));
optionMenu.append(new gui.MenuItem({ type: 'separator' }));
optionMenu.append(new gui.MenuItem({
    type: 'checkbox',
    label: 'Online',
    checked: true,
    click: function() {
        this.checked = true;
    }
}));
optionMenu.append(new gui.MenuItem({
    type: 'checkbox',
    label: 'Away',
    checked: false,
    click: function() {
        this.checked = true;
    }
}));
optionMenu.append(new gui.MenuItem({
    type: 'checkbox',
    label: 'Busy',
    checked: false,
    click: function() {
        this.checked = true;
    }
}));
optionMenu.append(new gui.MenuItem({ type: 'separator' }));
optionMenu.append(new gui.MenuItem({ label: 'Sign out' }));

//////////////////////////////////////////////////////////////////////////////////////
// Window bar
$('.windowBar .close').click(function() {
	socket.disconnect();
    win.close();
});
$('.windowBar .minimize').click(function() {
    win.minimize();
});
$('.windowBar .maximize').click(function() {
    win.maximize();
});

//////////////////////////////////////////////////////////////////////////////////////
// Sign in
$('#signInForm').submit(function () {
    event.preventDefault();

    // Set the username and password in localStorage
    var usernameVal = $('#signInUsername').val();
    var passwordVal = $('#signInPassword').val();
    localStorage.setItem('signInUsername', usernameVal);
    localStorage.setItem('signInPassword', passwordVal);

    //Authentication
    socket.emit('sign in', {
        username: usernameVal,
        password: passwordVal
    }, function (user) {
        if (user) {
            //Global User Object
            global.user = user;
            // Close sign in window, open the application window and maximize it
            win.close();
            gui.Window.open(config.views.chat.filename, {
                toolbar: false,
                frame: false,
                focus: true,
                width: screenWidth,
                height: screenHeight,
                min_width: 600,
                min_height: 460,
                position: 'center'
            });
        } else {
            alert("wrong data");
        }
    });

});

//Window loaded
win.on("loaded", function () {
    viewUtil.getCurrentWindowFilename(window.location.pathname, function (filename) {
        //Chat window loaded
        if (filename == config.views.chat.filename) {
            //Fix for win8 Fullscreen bug; https://github.com/rogerwang/node-webkit/issues/1021
            if (process.platform === 'win32' && parseFloat(require('os').release(), 10) > 6.1) {
                gui.Window.get().setMaximumSize(screenWidth + 15, screen.availHeight + 15);
            }
            
            //Add Profile and Friendlist HTML
            $('#sidebar .profile').html(viewUtil.getProfileContentHTMLbyUser(global.user));
            $('#sidebar .friends').html(viewUtil.getFriendlistContentHTMLbyUser(global.user));
        }
    });
});

// Open recover page in default browser
$('#signInTrouble').click(function() {
    gui.Shell.openExternal(config.links.recover);
});

// Open sign up page in default browser
$('#createAnAccount').click(function() {
    gui.Shell.openExternal(config.links.signup);
});

// Open options context menu at mouse position
$('#sidebar .profile').on('click', '#optionsButton', function(e) {
	optionMenu.popup(e.pageX, e.pageY);
});

// Alert the username on click
$('#sidebar .friends').on('click', 'li', function() {
    var friendUsername = $(this).data('username');
    //Check if Convo is opened
    if (typeof openedConvos[friendUsername] == "undefined") {
        socket.emit('open convo', friendUsername, "ID", function(channelId){
            openedConvos[friendUsername] = channelId;
            alert("CC Opene new tab with convo here :) ChannelId=" + channelId);
        });
    } else {
        alert("Convo allready opened");   
    }
});

//////////////////////////////////////////////////////////////////////////////////////
//Socket.IO events

//Socket.IO: On error
socket.on('error', function() {
    if (!socket.socket.connected) {
        //alert("Could not connect to Server" + config.socket.url);
    }
});

//Socket.IO: On connect
socket.on('connect', function() {
   //alert("Connected to Server" + config.socket.url);
});
//////////////////////////////////////////////////////////////////////////////////////
// Variables
var gui                 = require('nw.gui');
var menubar             = new gui.Menu({type:'menubar'});
var file                = new gui.Menu();
var help                = new gui.Menu();
var win                 = gui.Window.get();
var maxheight           = window.screen.availHeight;
var maxwidth            = window.screen.availWidth;

//////////////////////////////////////////////////////////////////////////////////////
// Auto sign in

// Get the localStorage items needed for sign in
var autoSignInValue     = localStorage.getItem('autoSignIn');
var usernameVal         = localStorage.getItem('signInUsername');
var passwordVal         = localStorage.getItem('signInPassword');

// When the checkbox is ticked
$('#autoSignIn').change(function(){
    if($(this).is(':checked')) {
        localStorage.setItem('autoSignIn', 'true');
    } else {
        localStorage.setItem('autoSignIn', 'false');
    }
});

// Tick the checkbox if localStorage is 'true'
if(autoSignInValue == 'true') {
    $('#autoSignIn').prop('checked', true);
    $('#signInUsername').val(usernameVal);
    $('#signInPassword').val(passwordVal);
} else {
    $('#signInUsername').val(usernameVal);
    $('#autoSignIn').prop('checked', false);
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
// Window bar
$('.windowBar .close').click(function() {
    win.close();
});
$('.windowBar .minimize').click(function() {
    win.minimize();
});
$('.windowBar .maximize').click(function() {
    win.maximize();
});
$('.windowBar .expand, .windowBar .compress').click(function() {
    win.toggleFullscreen();
    $(this).toggleClass("expand").toggleClass("compress");
});

//////////////////////////////////////////////////////////////////////////////////////
// Sign in
$('#signInForm').submit(function() {
    event.preventDefault();
    
    // Set the username and password in localStorage
    var usernameVal = $('#signInUsername').val();
    var passwordVal = $('#signInPassword').val();
    localStorage.setItem('signInUsername', usernameVal);
    localStorage.setItem('signInPassword', passwordVal);
    
    // Close sign in window, open the application window and maximize it
    win.close();
    var winApplication = gui.Window.open('application.html', {
        toolbar: false,
        frame: false,
        min_width: 800,
        min_height: 460,
        position: 'center'
    });
    winApplication.maximize();
});

// Open recover page in default browser
$('#forgotPassword').click(function() {
    gui.Shell.openExternal('http://puhn.net/recover/');
});

// Open sign up page in default browser
$('#signUpButton').click(function() {
    gui.Shell.openExternal('http://puhn.net/signup/');
});
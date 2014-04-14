//////////////////////////////////////////////////////////////////////////////////////
// Variables
var gui                 = require('nw.gui');
var menubar             = new gui.Menu({type:'menubar'});
var file                = new gui.Menu();
var help                = new gui.Menu();
var optionMenu          = new gui.Menu();
var win                 = gui.Window.get();
var screenWidth         = window.screen.availWidth;
var screenHeight        = window.screen.availHeight;

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
optionMenu.append(new gui.MenuItem({ label: 'Profile settings' }));
optionMenu.append(new gui.MenuItem({ label: 'Manage friends' }));
optionMenu.append(new gui.MenuItem({ label: 'How-to guide' }));
optionMenu.append(new gui.MenuItem({ type: 'separator' }));
optionMenu.append(new gui.MenuItem({ type: 'checkbox', label: 'Online', icon: "img/status-online.png", checked: true }));
optionMenu.append(new gui.MenuItem({ type: 'checkbox', label: 'Away', icon: "img/status-away.png", checked: false }));
optionMenu.append(new gui.MenuItem({ type: 'checkbox', label: 'Busy', icon: "img/status-busy.png", checked: false }));
optionMenu.append(new gui.MenuItem({ type: 'separator' }));
optionMenu.append(new gui.MenuItem({ label: 'Sign out' }));

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
    gui.Window.open('application.html', {
        toolbar: false,
        frame: false,
        width: screenWidth,
        height: screenHeight,
        min_width: 600,
        min_height: 460,
        position: 'center'
    });
});

// Open recover page in default browser
$('#signInTrouble').click(function() {
    gui.Shell.openExternal('http://puhn.net/recover/');
});

// Open sign up page in default browser
$('#signUpButton').click(function() {
    gui.Shell.openExternal('http://puhn.net/signup/');
});

// Open options context menu at mouse position
$('#optionsButton').click(function(e) {
	optionMenu.popup(e.pageX, e.pageY);
});

// Create tab when friend is clicked
$('.friends ul li').click(function() {
    var firstName = $(this).attr('data-firstname');
    var username = $(this).attr('data-username');
    $('.tabs ul').append('<li data-username="' + username + '">' + firstName + '<i></i></li>');
});

// Close tab when 'X' icon is clicked
$('.tabs ul li i').click(function() {
    $(this).closest('li').remove();
});


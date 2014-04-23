/**
 * View utility
 */
var _ = require('underscore');

/**
 * Callbacks the current filename of window
 * @param urlPath
 */
function getCurrentWindowFilename(url, callback) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    callback(filename);
}

/**
 * Returns HTML for Main Profile
 * @param user Object
 */
function getProfileContentHTMLbyUser(user) {
    return '<div class="avatar" data-status="' + user.status + '"><img src="' + user.avatar + '" class="rounded"></div><h4>' + user.firstname + '</h4><h6>@' + user.usr + '</h6><button id="optionsButton" class="rounded">...</button>';
}

/**
 * Returns HTML Friendlist by User
 * @param user Object
 */
function getFriendlistContentHTMLbyUser(user) {
    var html = '<ul>';
    _.each(user.friends, function (friend) {
        html += '<li data-username="' + friend.usr + '"><div class="avatar" data-status="' + friend.status + '"><img src="' + friend.avatar + '" class="rounded"></div><h6>' + friend.firstname + ' <small>@' + friend.usr + '</small></h6></li>';
    });
    html += '</ul>';
    return html;
}

exports.getCurrentWindowFilename = getCurrentWindowFilename;
exports.getProfileContentHTMLbyUser = getProfileContentHTMLbyUser;
exports.getFriendlistContentHTMLbyUser = getFriendlistContentHTMLbyUser;
/**
 * View utility
 */

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
    //TODO: get underscore.js, iterate throu user.friends
    return '<ul><li class="active"><div class="avatar" data-status="online"><img src="../img/default_small.png" class="rounded"></div><h6>Martin <small>@MaDetho</small></h6></li><li><div class="avatar" data-status="busy"><img src="../img/default_small.png" class="rounded"></div><h6>Daniel <small>@loe</small></h6></li></ul>';
}

exports.getCurrentWindowFilename = getCurrentWindowFilename;
exports.getProfileContentHTMLbyUser = getProfileContentHTMLbyUser;
exports.getFriendlistContentHTMLbyUser = getFriendlistContentHTMLbyUser;
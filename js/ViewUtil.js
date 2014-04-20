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

exports.getCurrentWindowFilename = getCurrentWindowFilename;
// ==UserScript==
// @name         Twitter Image :orig Promoter
// @version      0.6
// @description  Automatically promotes twitter image links to :orig, such as from :large.
// @author       Cro
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @namespace    https://greasyfork.org/users/10865
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/9510/Twitter%20Image%20%3Aorig%20Promoter.user.js
// @updateURL https://update.greasyfork.org/scripts/9510/Twitter%20Image%20%3Aorig%20Promoter.meta.js
// ==/UserScript==
(function () {
    "use strict";
    var queryVars = function(str) {
        return str.replace(/^\?/, '').split('&').map(x => x.split('=')).reduce((a, [k, v]) => { a[k] = v; return a; }, {});
    };
    // Check if this page contains a single image whose source is also the location.
    var image = document.getElementsByTagName('img')[0];
    if (image && image.getAttribute('src') == location.href) {
        var pathname = location.pathname;
        // Check if we already have the orig modifier
        if (!pathname.match(/:orig$/)) {
            // Trim modifiers.
            var idx = pathname.lastIndexOf(':');
            if (idx >= 0)
            {
                pathname = pathname.substr(0, idx);
            }
            // Check if we need to append the file type.
            var format = queryVars(location.search).format;
            if (format && !location.pathname.endsWith(format))
            {
                pathname += '.' + format;
            }
            // Add the modifier.
            pathname += ':orig';
            window.location = pathname;
        }
    }
})();
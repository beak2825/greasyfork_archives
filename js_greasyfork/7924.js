// ==UserScript==
// @name         Youtube Auto Quick Buffer
// @namespace    https://greasyfork.org/en/users/8935-daniel-jochem?sort=ratings
// @description  Quickens the bufferer on all Youtube videos
// @include      https://www.youtube.com/watch?*
// @grant        none
// @run-at       document-end
// @version      1.4
// @downloadURL https://update.greasyfork.org/scripts/7924/Youtube%20Auto%20Quick%20Buffer.user.js
// @updateURL https://update.greasyfork.org/scripts/7924/Youtube%20Auto%20Quick%20Buffer.meta.js
// ==/UserScript==

// reload script on page change using spf events (normal youtube)
window.addEventListener("spfdone", function() {
    main();
});

// reload script on page change using youtube polymer fire events (material youtube)
window.addEventListener("yt-page-data-updated", function() {
    main();
});

main();

function main() {
    if (isPlayerAvailable()) {
        if (document.URL.indexOf("&gl=CA") === -1) {
            window.location = document.URL + "&gl=CA";
        }
    }
}

function isPlayerAvailable() { // true if a youtube video is available ( false if live video)
    return /https:\/\/www\.youtube\.com\/watch\?v=.*/.test(document.location.href) && document.getElementById('live-chat-iframe') === null;
}
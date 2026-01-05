// ==UserScript==
// @name         Youtube Unblocker
// @namespace    YTUB
// @version      6.6
// @description  Automatically forwards country-blocked YouTube videos to youtubeunblocked.live - then press 'Go!'
// @author       drhouse
// @match        https://www.youtube.com/watch*
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/9062/Youtube%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/9062/Youtube%20Unblocker.meta.js
// ==/UserScript==

(function() {
    const configDesc = {
        someAction: {
            name: "use this YouTube video with youtubeunblocked",
            type: "action"
        }
    };
    const config = new GM_config(configDesc, { immediate: true, debug: true });

    config.addEventListener("get", (e) => {
        if (e.detail.prop === "someAction") {
            GM_setValue("ytube", window.location.href);
            window.location.href = "https://www.youtubeunblocked.live/"
            if (location.href == "https://www.youtubeunblocked.live/") {
                document.getElementById('url').value = GM_getValue("ytube");
            }
        }
    });

    setTimeout(function() {
        var subreasonElem = document.getElementById('subreason');
        if (subreasonElem && subreasonElem.textContent === 'The uploader has not made this video available in your country') {
            GM_setValue("ytube", window.location.href);
            window.location.href = "https://www.youtubeunblocked.live/"
        }
    }, 1000);

    setTimeout(function() {
        if (location.href == "https://www.youtubeunblocked.live/") {
            document.getElementById('url').value = GM_getValue("ytube");
        }
    }, 1000);

})();

// ==UserScript==
// @name         Nitter Preference Tweaks: Infinite Scroll + HLS + mp4 + Non-sticky Profile
// @description  Keeps all default settings; enables infinite scrolling, HLS, mp4 playback; disables sticky profile on Nitter and Xcancel
// @match        https://nitter.net/*
// @match        https://nitter.privacyredirect.com/*
// @match        https://xcancel.com/*
// @match        https://nitter.space/*
// @match        https://nitter.tiekoetter.com/*
// @version 0.0.1.20250904154127
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/548367/Nitter%20Preference%20Tweaks%3A%20Infinite%20Scroll%20%2B%20HLS%20%2B%20mp4%20%2B%20Non-sticky%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/548367/Nitter%20Preference%20Tweaks%3A%20Infinite%20Scroll%20%2B%20HLS%20%2B%20mp4%20%2B%20Non-sticky%20Profile.meta.js
// ==/UserScript==

(function() {
    // Prevent applying preferences more than once per session
    if (sessionStorage.getItem('prefsSet')) return;

    // Build preferences payload
    const prefs = new URLSearchParams({
        referer: '/',
        theme: 'Nitter',
        infiniteScroll: 'on',
        stickyProfile: '',      // unchecked
        bidiSupport: '',
        hideTweetStats: '',
        hideBanner: '',
        hidePins: '',
        hideReplies: '',
        squareAvatars: '',
        mp4Playback: 'on',
        hlsPlayback: 'on',
        proxyVideos: 'on',
        muteVideos: '',
        autoplayGifs: 'on',
        replaceTwitter: 'nitter.net',
        replaceYouTube: '',
        replaceReddit: 'teddit.net'
    });

    // Determine saveprefs endpoint based on current host
    const host = location.host;
    const saveUrl = `https://${host}/saveprefs`;

    // Send preferences
    fetch(saveUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: prefs
    }).then(() => {
        sessionStorage.setItem('prefsSet', 'true');
    }).catch(console.error);
})();
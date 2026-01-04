// ==UserScript==
// @name         Plex Video URL Extractor
// @namespace    https://github.com/neura-neura/userscripts
// @version      2025.11.24
// @description  Extracts and handles the URL of the currently playing video in Plex.
// @author       neura-neura
// @match        http://192.168.196.65:32400/web/index.html*
// @match        http://192.168.3.130:32400/web/index.html*
// @match        http://your.plex.server.ip:32400/web/index.html*
// @match        https://app.plex.tv/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556809/Plex%20Video%20URL%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/556809/Plex%20Video%20URL%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the current video URL
    function getVideoUrl() {
        const videoElement = document.querySelector('video[src]');
        if (videoElement) {
            const src = videoElement.src;
            if (src.includes('file.mp4')) {
                return src;
            }
        }
        return null;
    }

    // Menu command: Test
    GM_registerMenuCommand('Test URL', function() {
        const url = getVideoUrl();
        if (!url) {
            alert('No video detected in playback with "file.mp4" in the URL.');
            return;
        }

        GM_xmlhttpRequest({
            method: 'HEAD',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    alert('The URL works correctly (response 200 OK).');
                } else {
                    alert('The URL does not work (status code: ' + response.status + ').');
                }
            },
            onerror: function() {
                alert('Error testing the URL.');
            }
        });
    });

    // Menu command: Copy
    GM_registerMenuCommand('Copy URL', function() {
        const url = getVideoUrl();
        if (!url) {
            alert('No video detected in playback with "file.mp4" in the URL.');
            return;
        }

        GM_setClipboard(url);
        alert('URL copied to clipboard: ' + url);
    });

})();
// ==UserScript==
// @name         Add Delight-VR Video and Script
// @version      1.3
// @description  Adds dl8-video element and Delight-VR script to the page
// @author       Guzmazow
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1514505
// @downloadURL https://update.greasyfork.org/scripts/549382/Add%20Delight-VR%20Video%20and%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/549382/Add%20Delight-VR%20Video%20and%20Script.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Inject button at the start of body
    function injectButton() {
        var btn = document.createElement('button');
        btn.textContent = 'Add Delight-VR Video';
        btn.style.margin = '16px';
        btn.id = 'delight-vr-btn';
        document.body.insertBefore(btn, document.body.firstChild);
        btn.addEventListener('click', runScriptAction);
    }

    // Script action to add video and script
    function runScriptAction() {
        // Prevent multiple insertions
        if (document.getElementById('dl8-video-injected')) return;

        // Find the currently playing <video> tag, or fallback to the first
        var videos = document.querySelectorAll('video');
        var videoTag = null;
        for (var i = 0; i < videos.length; i++) {
            if (!videos[i].paused && videos[i].currentTime > 0) {
                videoTag = videos[i];
                break;
            }
        }
        if (!videoTag && videos.length > 0) {
            videoTag = videos[0];
        }
        var videoSrc = '';
        if (videoTag) {
            if (videoTag.src) {
                videoSrc = videoTag.src;
            } else {
                var videoSource = videoTag.querySelector('source');
                if (videoSource && videoSource.src) {
                    videoSrc = videoSource.src;
                }
            }
        }
        if (!videoSrc) {
            alert('No <video> tag with a valid src found!');
            return;
        }

    // Create wrapper div with selected style
    var wrapper = document.createElement('div');
    wrapper.setAttribute('style', 'width: 500px; height: 300px; position: fixed; top: 100px; left: 0; z-index: 9999; background: #000;');
    wrapper.id = 'dl8-video-wrapper';

    var dl8Video = document.createElement('dl8-video');
    dl8Video.setAttribute('title', 'Example Video');
    dl8Video.setAttribute('format', 'STEREO_180_LR');
    dl8Video.setAttribute('display-mode', 'inline');
    dl8Video.setAttribute('loop', '');
    dl8Video.id = 'dl8-video-injected';

    var source = document.createElement('source');
    source.src = videoSrc;
    source.type = "video/mp4";
    dl8Video.appendChild(source);

    wrapper.appendChild(dl8Video);
    document.body.appendChild(wrapper);

        // Add 'Enter VR' button after loading
        var vrBtn = document.createElement('button');
        vrBtn.textContent = 'Enter VR';
        vrBtn.style.margin = '8px';
        vrBtn.id = 'enter-vr-btn';
        wrapper.appendChild(vrBtn);

        vrBtn.addEventListener('click', function() {
            var element = document.querySelector('dl8-video');
            if (element && typeof element.start === 'function') {
                element.start();
            }
        });

        if (!document.querySelector('script[src*="delight-vr.com"]')) {
            var script = document.createElement('script');
            script.src = "https://cdn.delight-vr.com/latest/dl8-dac884cdc04ea921934408999668b16b33b8334a.js";
            script.async = true;
            document.head.appendChild(script);
        }
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButton);
    } else {
        injectButton();
    }
})();
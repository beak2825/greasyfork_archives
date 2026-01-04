// ==UserScript==
// @name         YouTube Repeat Button
// @namespace    https://greasyfork.org/fr/users/1528785
// @version      1.0
// @description  Adding YouTube Repeat Button
// @author       rommar31
// @match        https://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/32/1384/1384060.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553216/YouTube%20Repeat%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553216/YouTube%20Repeat%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let repeatEnabled = false;
    let currentVideo = null;
    let endedHandler = null;

    function logError(context, error) {
        console.warn(`[YouTube Repeat Button] ${context}:`, error);
    }

    function createRepeatIcon() {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "28");
        svg.setAttribute("height", "28");
        svg.setAttribute("fill", "white");

        const path1 = document.createElementNS(ns, "path");
        path1.setAttribute("d", "M0 0h24v24H0V0z");
        path1.setAttribute("fill", "none");

        const path2 = document.createElementNS(ns, "path");
        path2.setAttribute("d", "M7 7h10v3l4-4-4-4v3H6c-1.1 0-2 .9-2 2v5h2V7zm10 10H7v-3l-4 4 4 4v-3h11c1.1 0 2-.9 2-2v-5h-2v5z");

        svg.appendChild(path1);
        svg.appendChild(path2);
        return svg;
    }

    function createCheckIcon() {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("fill", "limegreen");
        svg.style.position = "absolute";
        svg.style.top = "2px";
        svg.style.right = "0px";

        const path1 = document.createElementNS(ns, "path");
        path1.setAttribute("d", "M0 0h24v24H0z");
        path1.setAttribute("fill", "none");

        const path2 = document.createElementNS(ns, "path");
        path2.setAttribute("d", "M9 16.17l-3.59-3.58L4 14l5 5 12-12-1.41-1.42z");

        svg.appendChild(path1);
        svg.appendChild(path2);
        return svg;
    }

function detachFromCurrentVideo() {
        if (!currentVideo) return;
        try {
            currentVideo.loop = false;
            if (endedHandler) currentVideo.removeEventListener('ended', endedHandler);
        } catch (err) {
            logError("detachFromCurrentVideo", err);
        } finally {
            currentVideo = null;
            endedHandler = null;
        }
        currentVideo = null;
        endedHandler = null;
    }

    function attachToVideo(videoEl) {
        if (!videoEl || currentVideo === videoEl) return;

        detachFromCurrentVideo();
        currentVideo = videoEl;

        try {
            currentVideo.loop = repeatEnabled;
        } catch (err) {
            logError("set video.loop", err);
        }

        endedHandler = function() {
            if (!repeatEnabled) return;
            try {
                currentVideo.currentTime = 0;
                const p = currentVideo.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(err => logError("video.play()", err));
                }
            } catch (err) {
                logError("endedHandler", err);
            }
        };

        try {
            currentVideo.addEventListener('ended', endedHandler);
        } catch (err) {
            logError("addEventListener(ended)", err);
        }
     }


    function addRepeatButton() {
        if (document.querySelector('.ytp-repeat-button')) return;

        const button = document.createElement('button');
        button.className = 'ytp-button ytp-repeat-button';
        button.title = 'Repeat';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.background = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.position = 'relative';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.padding = '0';

        const repeatIcon = createRepeatIcon();
        const checkIcon = createCheckIcon();
        checkIcon.style.display = repeatEnabled ? 'block' : 'none';

        button.appendChild(repeatIcon);
        button.appendChild(checkIcon);

        button.addEventListener('click', () => {
            repeatEnabled = !repeatEnabled;
            checkIcon.style.display = repeatEnabled ? 'block' : 'none';

            const v = document.querySelector('video');
            if (v) {
                try {
                    v.loop = !!repeatEnabled;
                } catch (e) {}
                attachToVideo(v);
            }
        });

        const controls = document.querySelector('.ytp-right-controls');
        if (controls) {
            controls.insertBefore(button, controls.firstChild);
        }
    }

    const globalObserver = new MutationObserver((mutations) => {
        addRepeatButton();

        const v = document.querySelector('video');
        if (v) attachToVideo(v);
    });
    globalObserver.observe(document.body, { childList: true, subtree: true });

    addRepeatButton();
    const initialVideo = document.querySelector('video');
    if (initialVideo) attachToVideo(initialVideo);

    setInterval(() => {
        const v = document.querySelector('video');
        if (v && v !== currentVideo) attachToVideo(v);
    }, 800);

    window.addEventListener('beforeunload', () => detachFromCurrentVideo());
})();

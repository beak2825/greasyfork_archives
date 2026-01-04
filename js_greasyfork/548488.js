// ==UserScript==
// @name        Mojira.dev Redirect
// @namespace   tschipcraft
// @description Redirect Minecraft bug tracker issues to mojira.dev after 3s unless aborted by user click
// @icon        https://raw.githubusercontent.com/misode/mojira.dev/7ebd18d3f7b0de841376ef2f9120dd30c54eda63/static/favicon.png
// @author      Tschipcraft
// @version     1.1
// @license     MIT
// @match       https://bugs.mojang.com/browse/*/issues/*
// @match       https://bugs.mojang.com/browse/MC-*
// @match       https://bugs.mojang.com/browse/MCPE-*
// @match       https://bugs.mojang.com/browse/REALMS-*
// @match       https://bugs.mojang.com/browse/MCL-*
// @match       https://bugs.mojang.com/browse/BDS-*
// @match       https://bugs.mojang.com/browse/WEB-*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/548488/Mojiradev%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/548488/Mojiradev%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Extract the issue ID from the URL (last path segment)
    const parts = window.location.pathname.split('/');
    const issueId = parts[parts.length - 1];
    if (!issueId) return;

    let countdown = 3;
    let aborted = false;
    let intervalId;

    // Create notice
    const notice = document.createElement('div');
    notice.style.position = 'fixed';
    notice.style.top = '12px';
    notice.style.left = '50%';
    notice.style.transform = 'translate(-50%, 0)';
    notice.style.padding = '10px 15px';
    notice.style.background = 'rgba(0, 0, 0, 0.8)';
    notice.style.color = '#fff';
    notice.style.fontSize = '14px';
    notice.style.fontFamily = 'sans-serif';
    notice.style.borderRadius = '8px';
    notice.style.zIndex = '999999';
    notice.textContent = `I will redirect you to mojira.dev after ${countdown} seconds. Click anywhere on the screen to abort.`;
    document.body.appendChild(notice);

    // Abort on any click
    const abortHandler = () => {
        aborted = true;
        clearInterval(intervalId);
        notice.textContent = "Redirection aborted.";
        setTimeout(() => notice.remove(), 2000);
        window.removeEventListener('click', abortHandler);
    };
    window.addEventListener('click', abortHandler);

    // Countdown logic
    intervalId = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            notice.textContent = `I will redirect you to mojira.dev after ${countdown} seconds. Click anywhere on the screen to abort.`;
        } else {
            clearInterval(intervalId);
            if (!aborted) {
                window.location.href = `https://mojira.dev/${issueId}`;
            }
        }
    }, 1000);
})();

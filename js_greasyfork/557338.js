// ==UserScript==
// @name         AnySex Upload Date
// @namespace    AnySexUploadDate@nereids
// @version      1.1.0
// @description  Displays the video upload date
// @author       nereids
// @license      MIT
// @icon         https://icons.duckduckgo.com/ip3/anysex.com.ico
// @match        https://anysex.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557338/AnySex%20Upload%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/557338/AnySex%20Upload%20Date.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const poll = setInterval(() => {
        const pageTitle = document.querySelector('.page-title');
        const jsonScript = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
            .find(s => s.textContent.includes('"uploadDate"'));

        if (pageTitle && jsonScript) {
            clearInterval(poll);
            insertUploadDateBadge(pageTitle, jsonScript);
        }
    }, 250);

    function insertUploadDateBadge(container, scriptEl) {
        let data;
        try {
            data = JSON.parse(scriptEl.textContent);
        } catch (e) {
            console.error('AnySex uploadDate: JSON parse error');
            return;
        }

        const isoDate = data.uploadDate || data.datePublished;
        if (!isoDate) return;

        const date = new Date(isoDate);
        if (isNaN(date)) return;

        // Format: 22 Mar 2013  OR  Mar 2013  if you prefer shorter
        const formatted = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(/,/g, '');

        const durationBadge = container.querySelector('.badge.duration');
        if (!durationBadge) return;

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = formatted;
        badge.title = 'Upload date';
        badge.style.marginLeft = '5px'; // slight extra spacing after duration

        durationBadge.after(badge);
    }
})();
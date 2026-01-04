// ==UserScript==
// @name         4chan Vim Navigation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Navigate 4chan threads with vim-style keybindings
// @match        *://boards.4chan.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551026/4chan%20Vim%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/551026/4chan%20Vim%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const threads = Array.from(document.querySelectorAll('.thread'));
    let index = 0;
    let buffer = ''; // For capturing gg

    if (threads.length === 0) return;

    function highlightThread(i) {
        threads.forEach(t => t.style.outline = '');
        const thread = threads[i];
        if (thread) {
            thread.scrollIntoView({behavior: "smooth", block: "center"});
            thread.style.outline = '3px solid #4cafef';
        }
    }

    highlightThread(index);

    document.addEventListener('keydown', (e) => {
        // Ignore when typing in inputs/textareas
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        if (e.key === 'j') {
            index = Math.min(index + 1, threads.length - 1);
            highlightThread(index);
            buffer = '';
        } else if (e.key === 'k') {
            index = Math.max(index - 1, 0);
            highlightThread(index);
            buffer = '';
        } else if (e.key === 'o') {
            const link = threads[index].querySelector('a[href*="/thread/"]');
            if (link) window.location.href = link.href;
            buffer = '';
        } else if (e.key === 'O') {
            const link = threads[index].querySelector('a[href*="/thread/"]');
            if (link) window.open(link.href, '_blank');
            buffer = '';
        } else if (e.key === 'g') {
            if (buffer === 'g') {
                index = 0;
                highlightThread(index);
                buffer = '';
            } else {
                buffer = 'g';
                setTimeout(() => buffer = '', 500); // reset if not pressed quickly
            }
        } else if (e.key === 'G') {
            index = threads.length - 1;
            highlightThread(index);
            buffer = '';
        }
    });
})();

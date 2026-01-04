// ==UserScript==
// @name Hide Twitch chats whose username or content matches your filters (Live + VOD)
// @description You can block chats that match a text, number, special character (e.g., '_', '%') or Unicode emoji 🗑️ with optional spaces around it e.g., 'a ', 'a b'
// @match *://*.twitch.tv/*
// @version 1
// @namespace x.com/_Liam____
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555301/Hide%20Twitch%20chats%20whose%20username%20or%20content%20matches%20your%20filters%20%28Live%20%2B%20VOD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555301/Hide%20Twitch%20chats%20whose%20username%20or%20content%20matches%20your%20filters%20%28Live%20%2B%20VOD%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const FILTERS = [
        //LIVE chat, case insensitive
        { selector: '.tw-relative', regex: /regex 1|regex 2|....../i },
        //sensitive
        { selector: '.tw-relative', regex: /```/ },
        //VOD chat, case insensitive
        { selector: 'li', regex: /```/i },
        //sensitive
        { selector: '.tw-c-text-base', regex: /```/, upward: 'li' }];
        //to block '?' and '+', use '\?' and '\+' e.g: regex: /\?|\+|...
    function hideElement(el) {
        if (!el || el.dataset.filtered) return;
        el.style.display = 'none';
        el.dataset.filtered = '1';
    }function processNode(node) {
        if (!node) return;
        FILTERS.forEach(f => {
            if (!node.matches) return;
            if (node.matches(f.selector)) {
                if (f.regex.test(node.textContent)) {
                    if (f.upward) {
                        const ancestor = node.closest(f.upward);
                        hideElement(ancestor);
                    } else {hideElement(node);
                    }}}});
        node.querySelectorAll && node.querySelectorAll(FILTERS.map(f => f.selector).join(',')).forEach(processNode);
    }
    document.querySelectorAll(FILTERS.map(f => f.selector).join(',')).forEach(processNode);
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(processNode);
            processNode(m.target);
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
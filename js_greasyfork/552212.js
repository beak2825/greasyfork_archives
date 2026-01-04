// ==UserScript==
// @name         Star Trek Timelines Auto Fetch & Paste Player Data
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Fetch player data, copy to clipboard, and trigger onPaste handler in textarea
// @author       Kelly Stuard
// @license      MIT
// @match        https://beta.datacore.app/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      datacore.app
// @connect      app.startrektimelines.com
// @downloadURL https://update.greasyfork.org/scripts/552212/Star%20Trek%20Timelines%20Auto%20Fetch%20%20Paste%20Player%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/552212/Star%20Trek%20Timelines%20Auto%20Fetch%20%20Paste%20Player%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_DOMAIN = "https://app.startrektimelines.com/";
    const handle = {
        "A": handleLink,
        "FORM": handleForm,
    };

    function triggerPaste(textarea, value) {
        // Create a fake clipboardData object
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', value);

        // Create and dispatch a paste event
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: clipboardData
        });

        // Some browsers require clipboardData to be manually assigned
        Object.defineProperty(pasteEvent, 'clipboardData', {
            get: () => clipboardData
        });

        textarea.focus();
        textarea.dispatchEvent(pasteEvent);
    }

    function handleLink(link) {
        if (!link.text?.endsWith('data')) {
            return null;
        }

        return {
            method: 'GET',
            url: link.href,
        };
    }

    function handleForm(form) {
        return {
            method: 'POST',
            url: form.action,
            data: new URLSearchParams(new FormData(form)).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
    }

    function handleTextarea(node, options) {
        if (!options) {
            return;
        }

        const textarea = node.closest('div.content')?.querySelector('textarea');
        if (!textarea) {
            return;
        }

        const defaults = {
            onload: function(response) {
                if (response.status === 200) {
                    const data = response.responseText;
                    GM_setClipboard(data);
                    triggerPaste(textarea, data);

                    textarea.value = '✅ Data loaded';
                } else {
                    textarea.value = '❌ Failed to fetch data';
                }
            },
        };

        textarea.value = `⏳ Please wait. 🙈 Tampermonkey is ${options.method} the requested data from ${options.url} ...`;
        GM_xmlhttpRequest({
            ...defaults,
            ...options,
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                // if (typeof node.querySelectorAll === 'function') {
                //     const links = node.querySelectorAll?.('a') || (node.tagName === 'A' ? [node] : []);
                //     links.forEach(handleLink);
                // }
                const matches = node.querySelectorAll?.(`a[href^="${API_DOMAIN}"], form[action^="${API_DOMAIN}"]`);
                matches?.length && matches.forEach(match => handleTextarea(match, handle[match.nodeName](match)));
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

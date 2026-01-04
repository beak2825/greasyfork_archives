// ==UserScript==
// @name         IG Anon
// @version      1.1
// @description  Allows you to view Instagram stories anonymously
// @author       SilentArt
// @match        https://www.instagram.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsbGVkYnk9InRpdGxlIGRlc2MiPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJpbnN0R3JhZCIgeDE9IjAiIHgyPSIxIiB5MT0iMCIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZWRhNzUiPjwvc3RvcD4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjI1IiBzdG9wLWNvbG9yPSIjZmE3ZTFlIj48L3N0b3A+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjZDYyOTc2Ij48L3N0b3A+CiAgICAgIDxzdG9wIG9mZnNldD0iMC43NSIgc3RvcC1jb2xvcj0iIzk2MmZiZiI+PC9zdG9wPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0ZjViZDUiPjwvc3RvcD4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImdsYXNzIiBjeD0iMzAlIiBjeT0iMjUlIiByPSI3NSUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMC4xOCI+PC9zdG9wPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICAgIDxmaWx0ZXIgaWQ9InNoYWRvdyIgeD0iLTUwJSIgeT0iLTUwJSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSI+CiAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjQiIHJlc3VsdD0ib2ZmIj48L2ZlT2Zmc2V0PgogICAgICA8ZmVHYXVzc2lhbkJsdXIgaW49Im9mZiIgc3RkRGV2aWF0aW9uPSI2IiByZXN1bHQ9ImJsdXIiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJibHVyIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwICAwIDAgMCAwIDAgIDAgMCAwIDAgMCAgMCAwIDAgMC4xOCAwIiByZXN1bHQ9InNoYWRvdyI+PC9mZUNvbG9yTWF0cml4PgogICAgICA8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJzaGFkb3ciIG1vZGU9Im5vcm1hbCI+PC9mZUJsZW5kPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbHRlcj0idXJsKCNzaGFkb3cpIj4KICAgIDxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSIxMTIiIGhlaWdodD0iMTEyIiByeD0iMjYiIHJ5PSIyNiIgZmlsbD0idXJsKCNpbnN0R3JhZCkiPjwvcmVjdD4KICAgIDxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSIxMTIiIGhlaWdodD0iMTEyIiByeD0iMjYiIHJ5PSIyNiIgZmlsbD0idXJsKCNnbGFzcykiPjwvcmVjdD4KICA8L2c+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwyKSI+CiAgICA8cGF0aCBkPSJNMzIgNjRjMTAtMTMgMjAtMTggMzItMThzMjIgNSAzMiAxOGMtMTAgMTMtMjAgMTgtMzIgMThTNDIgNzcgMzIgNjR6IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIwLjk1Ij48L3BhdGg+CiAgICA8Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSIxMCIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC45NSI+PC9jaXJjbGU+CiAgICA8Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSI0IiBmaWxsPSJyZ2JhKDAsMCwwLDAuOSkiPjwvY2lyY2xlPgogIDwvZz4KICA8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMTEyIiBoZWlnaHQ9IjExMiIgcng9IjI2IiByeT0iMjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDYiIHN0cm9rZS13aWR0aD0iMSI+PC9yZWN0Pgo8L3N2Zz4K
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1521018
// @downloadURL https://update.greasyfork.org/scripts/551145/IG%20Anon.user.js
// @updateURL https://update.greasyfork.org/scripts/551145/IG%20Anon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const URL_BLOCK_PATTERNS = [
        'viewSeenAt',
        '/reel/seen',
        'story_media_viewer',
        'reel_media_viewer',
        'story_seen',
        'reel_media_seen'
    ];

    function shouldBlockUrl(url) {
        if (!url) return false;
        try {
            const u = String(url);
            for (const p of URL_BLOCK_PATTERNS) {
                if (u.indexOf(p) !== -1) return true;
            }
            if (u.includes('story') && u.includes('seen')) return true;
            if (u.includes('reel') && u.includes('seen')) return true;
        } catch (e) {}
        return false;
    }

    function bodyContainsViewSeen(body) {
        if (!body) return false;
        try {
            if (typeof body === 'string') {
                return body.indexOf('viewSeenAt') !== -1;
            }
            if (body instanceof FormData) {
                for (const pair of body.entries()) {
                    try {
                        if (String(pair[1]).indexOf('viewSeenAt') !== -1) return true;
                    } catch (e) {}
                }
            }
            return String(body).indexOf('viewSeenAt') !== -1;
        } catch (e) { return false; }
    }

    (function patchFetch() {
        if (!window.fetch) return;
        const origFetch = window.fetch.bind(window);
        window.fetch = async function (input, init) {
            try {
                let url = '';
                let bodyText = '';

                if (typeof input === 'string') {
                    url = input;
                } else if (input instanceof Request) {
                    url = input.url;
                    try {
                        bodyText = await input.clone().text().catch(() => '');
                    } catch (e) {
                        bodyText = '';
                    }
                }

                if (init && init.body) {
                    if (typeof init.body === 'string') bodyText = init.body;
                    else if (init.body instanceof FormData) {
                        for (const pair of init.body.entries()) {
                            if (String(pair[1]).includes('viewSeenAt')) {
                                bodyText = String(pair[1]);
                                break;
                            }
                        }
                    } else {
                        try { bodyText = String(init.body); } catch (e) { bodyText = ''; }
                    }
                }

                if (shouldBlockUrl(url) || (bodyText && bodyText.includes('viewSeenAt'))) {
                    console.info('[IG anon] blocked fetch ->', url || '(Request object)', bodyText ? 'body contains viewSeenAt' : '');
                    return Promise.resolve(new Response(null, {
                        status: 204,
                        statusText: 'No Content (blocked by userscript)'
                    }));
                }
            } catch (e) {
            }
            return origFetch(input, init);
        };
    })();

    (function patchXHR() {
        const OriginalXHR = window.XMLHttpRequest;
        if (!OriginalXHR) return;

        function PatchedXHR() {
            const xhr = new OriginalXHR();

            const origOpen = xhr.open;
            const origSend = xhr.send;

            xhr.__user_url = null;
            xhr.__shouldBlockByUserscript = false;

            xhr.open = function (method, url) {
                try {
                    xhr.__user_url = url;
                    if (shouldBlockUrl(url)) {
                        xhr.__shouldBlockByUserscript = true;
                    }
                } catch (e) {}
                return origOpen.apply(this, arguments);
            };

            xhr.send = function (body) {
                try {
                    if (xhr.__shouldBlockByUserscript || bodyContainsViewSeen(body)) {
                        console.info('[IG anon] blocked XHR ->', xhr.__user_url || '(unknown)', bodyContainsViewSeen(body) ? 'body contains viewSeenAt' : '');
                        setTimeout(() => {
                            try {
                                try { xhr.readyState = 4; } catch (e) {}
                                try { Object.defineProperty(xhr, 'status', { value: 204, configurable: true }); } catch (e) {}
                                try { Object.defineProperty(xhr, 'responseText', { value: '', configurable: true }); } catch (e) {}
                                if (typeof xhr.onreadystatechange === 'function') {
                                    try { xhr.onreadystatechange(); } catch (e) {}
                                }
                                try { xhr.dispatchEvent(new Event('load')); } catch (e) {}
                            } catch (e) {}
                        }, 0);
                        return; 
                    }
                } catch (e) {
                }
                return origSend.apply(this, arguments);
            };

            return xhr;
        }

        PatchedXHR.prototype = OriginalXHR.prototype;
        window.XMLHttpRequest = PatchedXHR;
    })();

    console.info('Script active - watching for viewSeenAt patterns');
})();

// ==UserScript==
// @name         Universal Paste Content Copier
// @namespace    KazumaApexScripts
// @version      3.0
// @description  Adds a helper panel to 8+ popular paste sites to copy the raw content to the clipboard with one click.
// @author       Kazuma | Apex
// @match        *://pastebin.com/*
// @match        *://gist.github.com/*
// @match        *://hastebin.com/*
// @match        *://haste.toptal.com/*
// @match        *://rentry.co/*
// @match        *://paste.ee/*
// @match        *://justpaste.it/*
// @match        *://controlc.com/*
// @match        *://ghostbin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      pastebin.com
// @connect      gist.githubusercontent.com
// @connect      hastebin.com
// @connect      haste.toptal.com
// @connect      rentry.co
// @connect      paste.ee
// @connect      controlc.com
// @connect      ghostbin.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548338/Universal%20Paste%20Content%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/548338/Universal%20Paste%20Content%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Themed UI Styling (Consistent Across All Sites) ---
    GM_addStyle(`
        #kazuma-universal-helper {
            position: fixed; top: 20px; left: 20px; background-color: #1a1a1a;
            color: #ffffff; border: 2px solid #ff0000; border-radius: 10px; padding: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; z-index: 99999;
            box-shadow: 0 5px 20px rgba(0,0,0,0.7); min-width: 250px; text-align: center;
        }
        #kazuma-universal-helper h3 {
            margin: 0 0 10px 0; color: #ff0000; font-size: 16px;
            border-bottom: 1px solid #444; padding-bottom: 10px; text-transform: uppercase;
        }
        #kazuma-universal-copy-button {
            background: linear-gradient(145deg, #e60000, #b30000); color: #ffffff; border: none;
            padding: 10px 15px; border-radius: 8px; font-size: 16px; font-weight: bold;
            cursor: pointer; transition: all 0.2s ease-in-out; width: 100%; margin-top: 5px;
            box-shadow: 0 4px 10px rgba(255, 0, 0, 0.3);
        }
        #kazuma-universal-copy-button:hover {
            transform: translateY(-2px); box-shadow: 0 6px 15px rgba(255, 0, 0, 0.5);
        }
        #kazuma-universal-copy-button:disabled {
            background: #555; cursor: not-allowed; transform: none; box-shadow: none;
        }
        #kazuma-universal-copy-button.success {
            background: #006400; box-shadow: 0 4px 10px rgba(0, 255, 0, 0.3);
        }
    `);

    // --- Site-Specific Logic Handlers ---
    const siteHandlers = [
        {
            hostname: 'pastebin.com',
            isPastePage: (pathname) => pathname.length > 1 && !['/pro', '/api', '/doc'].some(p => pathname.startsWith(p)) && !pathname.startsWith('/u/'),
            getRawContent: (doc, loc) => new Promise((resolve, reject) => {
                const pasteId = loc.pathname.substring(1);
                GM_xmlhttpRequest({ method: "GET", url: `https://pastebin.com/raw/${pasteId}`, onload: res => resolve(res.responseText), onerror: reject });
            })
        },
        {
            hostname: 'gist.github.com',
            isPastePage: (pathname) => pathname.split('/').length > 2,
            getRawContent: (doc) => new Promise((resolve, reject) => {
                const rawButton = doc.querySelector('.file-actions a[href*="/raw/"]');
                if (!rawButton) return reject('Could not find Raw button on Gist page.');
                GM_xmlhttpRequest({ method: "GET", url: rawButton.href, onload: res => resolve(res.responseText), onerror: reject });
            })
        },
        {
            hostname: ['hastebin.com', 'haste.toptal.com'],
            isPastePage: (pathname) => pathname.length > 1,
            getRawContent: (doc, loc) => new Promise((resolve, reject) => {
                const pasteId = loc.pathname.substring(1);
                GM_xmlhttpRequest({ method: "GET", url: `${loc.origin}/raw/${pasteId}`, onload: res => resolve(res.responseText), onerror: reject });
            })
        },
        {
            hostname: 'rentry.co',
            isPastePage: (pathname) => pathname.length > 1 && !pathname.includes('.') && pathname !== '/new',
            getRawContent: (doc, loc) => new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url: `${loc.origin}/raw${loc.pathname}`, onload: res => resolve(res.responseText), onerror: reject });
            })
        },
        {
            hostname: 'paste.ee',
            isPastePage: (pathname) => pathname.startsWith('/p/'),
            getRawContent: (doc, loc) => new Promise((resolve, reject) => {
                const pasteId = loc.pathname.split('/')[2];
                GM_xmlhttpRequest({ method: "GET", url: `https://paste.ee/r/${pasteId}`, onload: res => resolve(res.responseText), onerror: reject });
            })
        },
        {
            hostname: 'justpaste.it',
            isPastePage: (pathname) => pathname.length > 1,
            getRawContent: (doc) => new Promise((resolve, reject) => {
                const contentArea = doc.querySelector('article.article-content');
                if (!contentArea) return reject('Could not find content area.');
                resolve(contentArea.innerText);
            })
        },
        {
            hostname: 'controlc.com',
            isPastePage: (pathname) => pathname.length > 1,
            getRawContent: (doc, loc) => new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url: `${loc.origin}${loc.pathname}/raw`, onload: res => resolve(res.responseText), onerror: reject });
            })
        },
        {
            hostname: 'ghostbin.com',
            isPastePage: (pathname) => pathname.startsWith('/paste/'),
            getRawContent: (doc, loc) => new Promise((resolve, reject) => {
                const pasteId = loc.pathname.split('/')[2];
                GM_xmlhttpRequest({ method: "GET", url: `https://ghostbin.com/paste/${pasteId}/raw`, onload: res => resolve(res.responseText), onerror: reject });
            })
        }
    ];

    // --- Main Script Logic ---
    function initialize() {
        const currentHostname = window.location.hostname.replace('www.', '');
        const handler = siteHandlers.find(h => Array.isArray(h.hostname) ? h.hostname.includes(currentHostname) : h.hostname === currentHostname);

        if (handler && handler.isPastePage(window.location.pathname)) {
            createHelperPanel(handler);
        }
    }

    function createHelperPanel(handler) {
        const panel = document.createElement('div');
        panel.id = 'kazuma-universal-helper';
        panel.innerHTML = `
            <h3>${handler.hostname} Helper</h3>
            <button id="kazuma-universal-copy-button">Copy Raw Content</button>
        `;
        document.body.appendChild(panel);

        const copyButton = document.getElementById('kazuma-universal-copy-button');
        copyButton.addEventListener('click', () => {
            copyButton.textContent = 'Copying...';
            copyButton.disabled = true;

            handler.getRawContent(document, window.location)
                .then(rawContent => {
                    navigator.clipboard.writeText(rawContent).then(() => {
                        copyButton.textContent = '✅ Copied!';
                        copyButton.classList.add('success');
                        setTimeout(() => {
                            copyButton.textContent = 'Copy Raw Content';
                            copyButton.disabled = false;
                            copyButton.classList.remove('success');
                        }, 2500);
                    }).catch(err => {
                        throw new Error('Failed to copy to clipboard.');
                    });
                })
                .catch(error => {
                    console.error('[Universal Copier] Error:', error);
                    copyButton.textContent = '❌ Failed!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy Raw Content';
                        copyButton.disabled = false;
                    }, 3000);
                });
        });
    }

    initialize();
})();
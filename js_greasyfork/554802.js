// ==UserScript==
// @name         Comick Docs Fix
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Replaces all instances of api.comick.fun with api.comick.dev and intercepts API calls
// @author       GooglyBlox
// @match        https://api.comick.dev/docs*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554802/Comick%20Docs%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/554802/Comick%20Docs%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        if (args[0] && typeof args[0] === 'string') {
            args[0] = args[0].replace(/api\.comick\.fun/g, 'api.comick.dev');
        } else if (args[0] && args[0].url) {
            args[0].url = args[0].url.replace(/api\.comick\.fun/g, 'api.comick.dev');
        }
        return originalFetch.apply(this, args);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (typeof url === 'string') {
            url = url.replace(/api\.comick\.fun/g, 'api.comick.dev');
        }
        return originalOpen.call(this, method, url, ...rest);
    };

    function replaceURLs(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const originalText = node.textContent;
            const replacedText = originalText
                .replace(/https:\/\/api\.comick\.fun/g, 'https://api.comick.dev')
                .replace(/api\.comick\.fun/g, 'api.comick.dev');
            if (originalText !== replacedText) {
                node.textContent = replacedText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                for (let child of node.childNodes) {
                    replaceURLs(child);
                }
            }

            if (node.hasAttribute('href')) {
                const href = node.getAttribute('href');
                if (href.includes('api.comick.fun')) {
                    node.setAttribute('href', href.replace(/api\.comick\.fun/g, 'api.comick.dev'));
                }
            }

            if (node.hasAttribute('src')) {
                const src = node.getAttribute('src');
                if (src.includes('api.comick.fun')) {
                    node.setAttribute('src', src.replace(/api\.comick\.fun/g, 'api.comick.dev'));
                }
            }
        }
    }

    function processPage() {
        replaceURLs(document.body);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processPage);
    } else {
        processPage();
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    replaceURLs(node);
                }
            });
        });
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();
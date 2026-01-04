// ==UserScript==
// @name         ChatGPT UTM Remover
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Removes utm_source=chatgpt.com from link URLs
// @author       GooglyBlox
// @match        https://chatgpt.com/c/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560593/ChatGPT%20UTM%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/560593/ChatGPT%20UTM%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cleanUrl(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.searchParams.get('utm_source') === 'chatgpt.com') {
                urlObj.searchParams.delete('utm_source');
                return urlObj.toString();
            }
            return null;
        } catch {
            return null;
        }
    }

    function cleanLink(link) {
        const cleanedUrl = cleanUrl(link.href);
        if (cleanedUrl) {
            link.href = cleanedUrl;
            if (link.hasAttribute('alt')) {
                const cleanedAlt = cleanUrl(link.alt);
                if (cleanedAlt) {
                    link.alt = cleanedAlt;
                }
            }
        }
    }

    function cleanLinks(root = document) {
        const links = root.querySelectorAll('a[href]');
        links.forEach(cleanLink);
    }

    cleanLinks();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
                const target = mutation.target;
                if (target.tagName === 'A' && target.href) {
                    cleanLink(target);
                }
            } else if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'A' && node.href) {
                            cleanLink(node);
                        }
                        cleanLinks(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'alt']
    });
})();
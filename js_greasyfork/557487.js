// ==UserScript==
// @name         Block CSDN in Search Results
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  在主流搜索引擎结果中屏蔽 CSDN 链接
// @author       zybin
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.bing.com/search*
// @match        *://cn.bing.com/search*
// @match        *://www.baidu.com/s*
// @match        *://duckduckgo.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557487/Block%20CSDN%20in%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/557487/Block%20CSDN%20in%20Search%20Results.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const blockedDomains = [
        "csdn.net"
    ];

    const providerConfig = [
        {
            hostPattern: /google\./,
            resultSelectors: [
                "div.g",
                "div.MjjYud",
                "div[data-sokoban-container]"
            ]
        },
        {
            hostPattern: /bing\.com/,
            resultSelectors: [
                "li.b_algo"
            ]
        },
        {
            hostPattern: /baidu\.com/,
            resultSelectors: [
                "div.result",
                "div.c-container"
            ]
        },
        {
            hostPattern: /duckduckgo\.com/,
            resultSelectors: [
                "div.result"
            ]
        }
    ];

    function isBlockedLink(anchor) {
        const href = anchor && anchor.getAttribute("href");
        if (!href) {
            return false;
        }

        return blockedDomains.some(domain => href.includes(domain));
    }

    function getCurrentProviderConfig() {
        const host = window.location.host;

        for (const provider of providerConfig) {
            if (provider.hostPattern.test(host)) {
                return provider;
            }
        }

        return null;
    }

    function findResultContainer(anchor, config) {
        if (!anchor || !config) {
            return null;
        }

        let node = anchor;
        const maxDepth = 8;

        for (let depth = 0; depth < maxDepth && node; depth++) {
            for (const selector of config.resultSelectors) {
                if (node.matches && node.matches(selector)) {
                    return node;
                }
            }

            node = node.parentElement;
        }

        return null;
    }

    function hideNode(node) {
        if (!node) {
            return;
        }

        if (node.dataset && node.dataset.blockedByUserscript === "1") {
            return;
        }

        node.style.display = "none";
        if (node.dataset) {
            node.dataset.blockedByUserscript = "1";
        }
    }

    function applyFilter() {
        const config = getCurrentProviderConfig();
        if (!config) {
            return;
        }

        const selector = blockedDomains
            .map(domain => `a[href*="${domain}"]`)
            .join(",");

        const anchors = document.querySelectorAll(selector);

        anchors.forEach(anchor => {
            if (!isBlockedLink(anchor)) {
                return;
            }

            const container = findResultContainer(anchor, config) || anchor.parentElement;
            hideNode(container);
        });
    }

    function observeDomChanges() {
        const observer = new MutationObserver(() => {
            applyFilter();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function main() {
        applyFilter();
        observeDomChanges();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }
})();

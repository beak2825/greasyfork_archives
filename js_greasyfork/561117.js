// ==UserScript==
// @name         百度 & 必应 → Google 重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在百度或必应输入以「``」或「··」开头的查询时，自动跳转到 Google（修复搜索框+地址栏）
// @author       wze (改进版)
// @match        *://www.baidu.com/*
// @match        *://*.bing.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561117/%E7%99%BE%E5%BA%A6%20%20%E5%BF%85%E5%BA%94%20%E2%86%92%20Google%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/561117/%E7%99%BE%E5%BA%A6%20%20%E5%BF%85%E5%BA%94%20%E2%86%92%20Google%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PREFIXES = ['``', '··'];

    function shouldRedirect(query) {
        if (!query) return false;
        const q = query.trim();
        for (const prefix of PREFIXES) {
            if (q.startsWith(prefix)) {
                const realQuery = q.substring(prefix.length).trim();
                const url = realQuery
                    ? `https://www.google.com/search?q=${encodeURIComponent(realQuery)}`
                    : 'https://www.google.com/';
                window.location.replace(url);
                return true;
            }
        }
        return false;
    }

    (function checkUrl() {
        const params = new URLSearchParams(window.location.search + '&' + (window.location.hash || '#').slice(1));
        const possibleKeys = ['wd', 'word', 'oq', 'q', 'query'];
        for (const key of possibleKeys) {
            const val = params.get(key);
            if (val && shouldRedirect(val)) return true;
        }
        return false;
    })();

    function isRedirectInput(input) {
        return input && (input.type === 'text' || input.type === 'search') &&
               (input.name === 'wd' || input.name === 'q' ||
                input.id?.includes('kw') || input.id?.includes('sb_form_q') ||
                input.className?.includes('search') || input.getAttribute('autocomplete') === 'off');
    }

    function tryBindInput(input) {
        if (!input || input.dataset.redirectBound) return;

        input.dataset.redirectBound = '1';

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.defaultPrevented) {
                if (shouldRedirect(input.value)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, { capture: true });

        const form = input.closest('form');
        if (form && !form.dataset.redirectBound) {
            form.dataset.redirectBound = '1';
            form.addEventListener('submit', function(e) {
                if (shouldRedirect(input.value)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, { capture: true });
        }
    }

    let foundInput = false;

    const tryBindAll = () => {
        let hasNew = false;
        document.querySelectorAll('input[type="text"], input[type="search"]').forEach(el => {
            if (isRedirectInput(el) && !el.dataset.redirectBound) {
                tryBindInput(el);
                hasNew = true;
            }
        });
        return hasNew;
    };

    if (tryBindAll()) foundInput = true;

    setTimeout(() => {
        if (tryBindAll()) foundInput = true;

        setTimeout(() => {
            if (tryBindAll()) foundInput = true;
        }, 1200);
    }, 400);

    const observer = new MutationObserver(() => {
        if (foundInput) {
            observer.disconnect();
            return;
        }
        if (tryBindAll()) {
            foundInput = true;
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

})();
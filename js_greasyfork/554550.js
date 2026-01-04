// ==UserScript==
// @name         B站首页防刷视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  注意力工具，屏蔽bilibili首页，防刷视频。
// @author       paradox661
// @match        https://www.bilibili.com/
// @run-at       document-start
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554550/B%E7%AB%99%E9%A6%96%E9%A1%B5%E9%98%B2%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/554550/B%E7%AB%99%E9%A6%96%E9%A1%B5%E9%98%B2%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitFor(cond, onOk, {
        root = document,
        timeout = 15000,
        once = true,
        checkNow = true
    } = {}) {
        const tryRun = () => {
            try {
                const hit = !!cond();
                if (hit) {
                    onOk();
                    return true;
                }
            } catch (e) {}
            return false;
        };

        if (checkNow && tryRun() && once) return;

        const target = root.documentElement || root.body || root;
        const observer = new MutationObserver(() => {
            const ran = tryRun();
            if (ran && once) observer.disconnect();
        });

        observer.observe(target, { childList: true, subtree: true });
        if (timeout > 0) setTimeout(() => observer.disconnect(), timeout);
    }

    function addCss(cssText) {
        const s = document.createElement('style');
        s.textContent = cssText;
        const root = document.documentElement;
        if (root.firstChild) {
            root.insertBefore(s, root.firstChild);
        } else {
            root.appendChild(s);
        }
    }

    addCss(`
    html body main,
    html body div.bili-header__channel,
    html body div.bili-header__banner,
    html body div.header-channel,
    html body div.palette-button-outer {
      display: none !important;
      visibility: hidden !important;
    }
    html body div.bili-header__bar {
      background: #C0C0C0 !important;
    }
  `);

    function removeForever(selector) {
        waitFor(
            () => document.querySelector(selector),
            () => {
                document.querySelectorAll(selector).forEach(n => n.remove());
            },
            { once: false }
        );
    }

    removeForever('main');
    removeForever('div.bili-header__channel');
    removeForever('div.bili-header__banner');
    removeForever('div.header-channel');
    //removeForever('div.center-search__bar');
    //removeForever('div.center-search-container');
    removeForever('div.palette-button-outer');
})();
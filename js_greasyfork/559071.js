// ==UserScript==
// @name         Twitter Home Lock Following
// @namespace    http://tampermonkey.net/
// @version      0.9.5
// @description  Xのホームを常に「フォロー中」に固定し、おすすめ(For You)を実質的に無効化する
// @match        https://x.com/*
// @match        https://twitter.com/*
// @license        MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559071/Twitter%20Home%20Lock%20Following.user.js
// @updateURL https://update.greasyfork.org/scripts/559071/Twitter%20Home%20Lock%20Following.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /**********************************************************
     * 定数
     **********************************************************/
    const HOME_PATH = '/home';
    const STYLE_ID = '__x_home_hide_for_you';

    /**********************************************************
     * fetch フック（HomeTimeline のみ）
     **********************************************************/
    const originalFetch = window.fetch;

    window.fetch = async function (input, init) {

        const isHomeTimelinePage =
            location.pathname === HOME_PATH &&
            document.body?.classList.contains('HomeTimeline');

        if (!isHomeTimelinePage) {
            return originalFetch.apply(this, arguments);
        }

        try {
            const url =
                typeof input === 'string'
                    ? input
                    : input?.url || '';

            if (!url.includes('HomeTimeline')) {
                return originalFetch.apply(this, arguments);
            }

            const isForYou =
                /for.?you|recommended|home_recommended/i.test(url);

            if (isForYou) {
                console.log('[X-Following] block ForYou HomeTimeline');

                return new Response(
                    JSON.stringify({
                        data: {
                            home_timeline_urt: {
                                instructions: []
                            }
                        }
                    }),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        } catch (e) {
            console.warn('[X-Following][fetch error]', e);
        }

        return originalFetch.apply(this, arguments);
    };

    /**********************************************************
     * CSS（For You タブを視覚的に排除）
     **********************************************************/
    const ensureHomeCSS = () => {
        const exists = document.getElementById(STYLE_ID);

        if (location.pathname === HOME_PATH) {
            if (exists) return;

            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                body.HomeTimeline nav div[role="tablist"] > div:first-child {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            exists?.remove();
        }
    };

    /**********************************************************
     * Following タブ強制クリック（HomeTimeline 限定）
     * ※ Twitter for コントロールパネルの修正を踏襲
     **********************************************************/
    const enforceFollowingTab = () => {
        if (
            location.pathname !== HOME_PATH ||
            !document.body?.classList.contains('HomeTimeline')
        ) return;

        const tablist = document.querySelector(
            'nav div[role="tablist"]'
        );
        if (!tablist) return;

        // For You（1番目）
        const forYouTab = tablist.querySelector(
            'div:nth-child(1) > [role="tab"]'
        );

        // Following（2番目）※ Sort（人気 / 最新）導入後もここは不変
        const followingTab = tablist.querySelector(
            'div:nth-child(2) > [role="tab"]'
        );

        if (
            forYouTab?.getAttribute('aria-selected') === 'true' &&
            followingTab
        ) {
            console.log('[X-Following] switch to Following tab');
            followingTab.click();
        }
    };

    /**********************************************************
     * 実行制御
     **********************************************************/
    let lastPath = '';

    const tick = () => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
        }
        ensureHomeCSS();
        enforceFollowingTab();
    };

    const observer = new MutationObserver(tick);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', tick);
})();

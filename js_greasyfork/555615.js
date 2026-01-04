// ==UserScript==
// @name               Medium Upsell Blocker
// @name:zh-TW         Medium 推銷遮罩阻擋器
// @namespace          wellstsai.com
// @version            v20251112
// @license            MIT
// @description        Prevent Medium subscription/upsell modals by setting lo-non-moc-upsell-v2|displayed-at in localStorage
// @description:zh-TW  透過在 localStorage 中設定 lo-non-moc-upsell-v2|displayed-at，防止 Medium 顯示訂閱或推銷彈出視窗
// @author             WellsTsai
// @match              *://*.medium.com/*
// @match              *://*/*
// @run-at             document-start
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/555615/Medium%20Upsell%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/555615/Medium%20Upsell%20Blocker.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const K = 'lo-non-moc-upsell-v2|displayed-at';
    const set = () => { try { localStorage.setItem(K, `"${new Date().toISOString()}"`); } catch (_) {} };
    const isMediumHost = /(^|\.)medium\.com$/.test(location.hostname);
    const isMediumLike = () => {
        const nodes = document.querySelectorAll('meta[name],meta[property],link[href]');
        for (const el of nodes) {
            const s = `${el.content||''}${el.getAttribute('name')||''}${el.getAttribute('property')||''}${el.href||''}`.toLowerCase();
            if (s.includes('medium') || s.includes('com.medium.reader') || s.includes('miro.medium.com') || s.includes('glyph.medium.com')) return true;
        }
        return false;
    };

    if (isMediumHost) {
        set();
        window.addEventListener('DOMContentLoaded', set, { once: true });
    } else {
        const run = () => { if (isMediumLike()) set(); };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
        else run();
    }
})();

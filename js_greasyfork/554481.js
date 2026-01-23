// ==UserScript==
// @name         おんJ広告削除
// @namespace    https://open2ch.net/
// @version      2.2
// @description  おんJの広告を自動で削除しやす
// @license	     CC0-1.0
// @match        *://*.open2ch.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554481/%E3%81%8A%E3%82%93J%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/554481/%E3%81%8A%E3%82%93J%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const removeAds = () => {
        const targets = [
            '.kokoku',
            '#adspotdiv.adspot_img',
            'iframe[src*="test/ad.cgi"]',
            'iframe[src*="i-mobile.co.jp"]'
        ];

        targets.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.remove();
            });
        });
        document.querySelectorAll('script').forEach(script => {
            const txt = script.textContent || '';
            if (/i-mobile\.co\.jp|InformationIcon/.test(txt)) {
                script.remove();
            }
        });
        document.querySelectorAll('div#adspotdiv.adspot_img').forEach(el => el.remove());
    };
    removeAds();
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(removeAds, 5000);
})();

// さとる万歳
// こっそり使えよ
// さとるに献金もしろよ
// 分かったか?
// 40からの文消してええで
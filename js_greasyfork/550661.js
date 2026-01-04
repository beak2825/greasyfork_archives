// ==UserScript==
// @name         紳士漫畫 - 添加本地下載按鈕
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  在閱讀頁面的「下載漫畫」按鈕下方自動添加「本地下載一」和「本地下載二」按鈕，可以少點一個階層
// @author       shanlan(grok-code-fast-1)
// @match        http*://*.wnacg.com/photos-index-page-*.html
// @match        http*://*.wnacg.org/photos-index-page-*.html
// @match        http*://*.wnacg.com/photos-index-aid-*.html
// @match        http*://*.wnacg.org/photos-index-aid-*.html
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550661/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%20-%20%E6%B7%BB%E5%8A%A0%E6%9C%AC%E5%9C%B0%E4%B8%8B%E8%BC%89%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550661/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%20-%20%E6%B7%BB%E5%8A%A0%E6%9C%AC%E5%9C%B0%E4%B8%8B%E8%BC%89%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof jQuery === 'undefined') return;

    const container = jQuery('#ads.download_btns');
    if (!container.length) return;

    const href = container.find('a.btn').attr('href');
    if (!href) return;

    const aidMatch = href.match(/aid-(\d+)/);
    if (!aidMatch) return;
    const url = `https://www.wnacg.com${href}`;

    const indicator = jQuery(`
        <div style="margin-top:10px;text-align:center;font-size:14px;color:#666;display:flex;align-items:center;justify-content:center;">
            <div style="border:4px solid #f3f3f3;border-top:4px solid #3498db;border-radius:50%;width:20px;height:20px;animation:spin 1s linear infinite;margin-right:10px;"></div>
            正在讀取連結中...
            <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
        </div>
    `);
    container.after(indicator);

    function fetchPage(u, retry = 0) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: u,
                timeout: 20000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': window.location.href,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                onload: (r) => r.status === 200 ? resolve(r.responseText) : retry < 2 ? setTimeout(() => fetchPage(u, retry + 1).then(resolve).catch(reject), 2000) : reject(new Error('狀態碼:' + r.status)),
                onerror: () => retry < 2 ? setTimeout(() => fetchPage(u, retry + 1).then(resolve).catch(reject), 2000) : reject(new Error('請求失敗')),
                ontimeout: () => retry < 2 ? setTimeout(() => fetchPage(u, retry + 1).then(resolve).catch(reject), 2000) : reject(new Error('超時'))
            });
        });
    }

    fetchPage(url).then((html) => {
        indicator.remove();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a.down_btn.ads');
        if (links.length < 2) return;

        const u1 = links[0].href, u2 = links[1].href;
        const f1 = (u1.match(/n=([^&]+)/) ? decodeURIComponent(RegExp.$1) : '檔案') + '.zip';
        const f2 = (u2.match(/n=([^&]+)/) ? decodeURIComponent(RegExp.$1) : '檔案') + '.zip';

        const btns = `
            <div style="margin-top:10px;">
                <a class="btn" style="width:130px;" href="${u1}" download="${f1}" onclick="return forceDownload('${u1}','${f1}');">本地下載一</a>
                <a class="btn" style="width:130px;" href="${u2}" download="${f2}" onclick="return forceDownload('${u2}','${f2}');">本地下載二</a>
            </div>
        `;
        container.after(btns);
    }).catch((e) => {
        indicator.remove();
        container.after(`<div style="margin-top:10px;color:red;text-align:center;padding:10px;border:1px solid #ccc;background:#ffe6e6;">
            讀取連結失敗：${e.message}<br>建議：直接點擊「下載漫畫」連結手動下載，或稍後重試。
        </div>`);
    });

    function forceDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        if (filename) a.download = decodeURIComponent(filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return false;
    }
})();
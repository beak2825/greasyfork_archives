// ==UserScript==
// @name         Force QR Used Badge
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给未使用的二维码加上Used标识，和官方样式一致
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563895/Force%20QR%20Used%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/563895/Force%20QR%20Used%20Badge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addUsedBadgeToStaticQR() {
        // 静态页面二维码容器
        const staticQR = document.querySelector('.ticket-detail_ticketInfoQr__4B2EU');
        if(staticQR && !staticQR.querySelector('.ticket-detail_qrUsageBadge___5dy3')) {
            const badge = document.createElement('div');
            badge.className = 'ticket-detail_qrUsageBadge___5dy3';
            badge.textContent = 'Used';
            // 插入在二维码上方（SVG前面）
            const qrCodeDiv = staticQR.querySelector('.ticket-detail_qrCode__QBFHr');
            if(qrCodeDiv){
                staticQR.insertBefore(badge, qrCodeDiv);
            }
        }
    }

    function addUsedBadgeToPopupQR() {
        // 弹窗二维码容器
        const popupQR = document.querySelector('.page_expandQrCode__gZuLC');
        if(popupQR && !popupQR.querySelector('.page_qrUsageBadge__jRB8G')) {
            const badge = document.createElement('div');
            badge.className = 'page_qrUsageBadge__jRB8G';
            badge.textContent = 'Used';
            const qrWrap = popupQR.querySelector('.page_qrWrap__ZTL7M');
            if(qrWrap){
                popupQR.insertBefore(badge, qrWrap);
            }
        }
    }

    // 页面初次加载加一次
    addUsedBadgeToStaticQR();
    addUsedBadgeToPopupQR();

    // 监听 DOM 变化，弹窗动态出现也能加上
    const observer = new MutationObserver(() => {
        addUsedBadgeToStaticQR();
        addUsedBadgeToPopupQR();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         PlatinMods - Auto Like & Scroll (ONCE ONLY + Random 1.5-2s + Toast)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hanya jalan sekali kalau belum di-Like → scroll + toast + random jeda + klik Like
// @author       LGJA + Grok
// @match        https://platinmods.com/threads/*
// @match        https://www.platinmods.com/threads/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557252/PlatinMods%20-%20Auto%20Like%20%20Scroll%20%28ONCE%20ONLY%20%2B%20Random%2015-2s%20%2B%20Toast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557252/PlatinMods%20-%20Auto%20Like%20%20Scroll%20%28ONCE%20ONLY%20%2B%20Random%2015-2s%20%2B%20Toast%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CEK APAKAH SUDAH DI-LIKE → KALAU SUDAH, LANGSUNG STOP 100%
    const alreadyLiked = document.querySelector('a.reaction--1.is-liked, a[data-reaction-id="1"].is-liked, .has-reaction, .reaction--1.has-reaction');
    if (alreadyLiked) {
        console.log('PlatinMods AutoLike: Sudah di-Like sebelumnya → script stop.');
        return; // ← langsung keluar, ga jalan apa-apa
    }

    // Toast kecil pojok kiri bawah (putih + hitam)
    function showToast(msg) {
        const old = document.getElementById('pm-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.id = 'pm-toast';
        toast.textContent = msg;
        toast.style.cssText = `
            position:fixed !important;
            bottom:20px !important;left:20px !important;
            background:white !important;color:black !important;
            font-size:12px !important;padding:8px 14px !important;
            border-radius:6px !important;box-shadow:0 4px 12px rgba(0,0,0,0.15) !important;
            z-index:999999 !important;opacity:0;transition:opacity 0.3s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 50);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 2000);
    }

    // Simulasi klik real (bypass confirm)
    function clickReal(el) {
        if (!el) return false;
        ['mousedown','mouseup','click'].forEach(ev => {
            el.dispatchEvent(new MouseEvent(ev, {bubbles:true, cancelable:true, view:window}));
        });
        return true;
    }

    // Cari hidden area
    const hiddenArea = document.querySelector('.bbCodeBlock--hide, .hideBlock--hidden') ||
                       Array.from(document.querySelectorAll('.message-body *')).find(e =>
                           e.textContent.includes('! Hidden Content !') || e.textContent.includes('Free Download'));

    if (!hiddenArea) {
        showToast('Hidden area tidak ditemukan');
        return;
    }

    // Scroll ke hidden area
    hiddenArea.scrollIntoView({behavior:'smooth', block:'center'});
    showToast('Scroll To Download Area...');

    // Jeda RANDOM 1.5 – 2 detik
    const delay = 1500 + Math.floor(Math.random() * 501); // 1500-2000ms

    setTimeout(() => {
        showToast('Click Like...');

        const likeBtn = document.querySelector('a.reaction--1, a[data-reaction-id="1"], a[href*="react?reaction_id=1"]');

        if (!likeBtn) {
            showToast('Like Button Not Found!');
            return;
        }

        if (clickReal(likeBtn)) {
            // Auto confirm kalau muncul dialog
            setTimeout(() => {
                const confirm = document.querySelector('button.js-confirm, button.confirm, [data-xf-click="confirm"]');
                if (confirm) confirm.click();
            }, 100);

            // Reload sekali saja
            setTimeout(() => location.reload(), 900);
        }
    }, delay);

})();
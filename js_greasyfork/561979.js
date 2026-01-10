// ==UserScript==
// @name         Yeni Konular Parlasın
// @namespace    ---
// @version      1.1
// @description  Technopat + DonanımArşivi + Techolay için yeni konuları vurgulama
// @author		 XanthiN
// @match        https://forum.donanimarsivi.com/forumlar/*
// @match        https://www.technopat.net/sosyal/bolum/*
// @match        https://techolay.net/sosyal/bolum/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561979/Yeni%20Konular%20Parlas%C4%B1n.user.js
// @updateURL https://update.greasyfork.org/scripts/561979/Yeni%20Konular%20Parlas%C4%B1n.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const a = 4 * 60 * 60;
    const b = 24 * 60 * 60;
    const c = 48 * 60 * 60;
    const now = Math.floor(Date.now() / 1000);
    const host = location.hostname;

    function getTimestamp(timeEl) {
        if (host.includes('technopat.net')) {
            return parseInt(timeEl.getAttribute('data-time'), 10);
        }
        return parseInt(timeEl.getAttribute('data-timestamp'), 10);
    }

    document.querySelectorAll('.structItem.structItem--thread').forEach(item => {

        // eski stil varsa temizle
        item.style.boxShadow = '';

        // sabitlenmiş konuları atla
        if (item.classList.contains('structItem--sticky')) return;

        const timeEl = item.querySelector('.structItem-startDate time.u-dt');
        if (!timeEl) return;

        const timestamp = getTimestamp(timeEl);
        if (!timestamp) return;

        // tarihi şimdiki zamandan ileriyse atla
        if (timestamp > now) return;

        const tarih = now - timestamp;

        if (tarih <= a) {
            item.style.boxShadow =
                'inset 0 0 0 9999px rgba(0, 255, 0, 0.3)';
        }
        else if (tarih <= b) {
            item.style.boxShadow =
                'inset 0 0 0 9999px rgba(0, 255, 0, 0.15)';
        }
        else if (tarih <= c) {
            item.style.boxShadow =
                'inset 0 0 0 9999px rgba(0, 255, 0, 0.075)';
        }
    });

})();
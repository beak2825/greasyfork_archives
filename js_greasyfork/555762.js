// ==UserScript==
// @name         ÖBA Arka Plan + Otomatik Geçiş (2025 GÜNCEL)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  ÖBA videolarını arka planda oynatır, odak kaybını engeller, otomatik ilerler.
// @author       Grok
// @match        https://www.oba.gov.tr/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555762/%C3%96BA%20Arka%20Plan%20%2B%20Otomatik%20Ge%C3%A7i%C5%9F%20%282025%20G%C3%9CNCEL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555762/%C3%96BA%20Arka%20Plan%20%2B%20Otomatik%20Ge%C3%A7i%C5%9F%20%282025%20G%C3%9CNCEL%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Kullanıcı Etkileşimi Simülasyonu (Otomatik Oynatma için şart)
    function simulateUserInteraction() {
        document.dispatchEvent(new Event('mousemove'));
        document.dispatchEvent(new Event('click'));
        document.dispatchEvent(new Event('keydown'));
    }

    // 2. Visibility API'yi Zorla "visible" Yap
    try {
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        Object.defineProperty(document, 'hasFocus', { value: true, writable: false });

        // visibilitychange engelle
        const originalAdd = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, ...args) {
            if (type === 'visibilitychange' || type === 'blur' || type === 'focusout') return;
            return originalAdd.apply(this, [type, ...args]);
        };
    } catch (e) { console.warn('API override hatası:', e); }

    // 3. WebSocket ile "pause" komutlarını engelle
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const ws = new originalWebSocket(...args);
        const originalSend = ws.send;
        ws.send = function (data) {
            try {
                const msg = JSON.parse(data);
                if (msg.type === 'pause' || msg.action === 'pause' || msg.command === 'stop') {
                    console.log('Sunucu pause komutu ENGELLENDİ:', msg);
                    return;
                }
            } catch {}
            return originalSend.apply(this, arguments);
        };
        return ws;
    };

    // 4. DOM yüklendikten sonra
    $(document).ready(function () {
        setTimeout(mainLoop, 3000); // iframe yüklenmesi için bekle
    });

    function mainLoop() {
        // Video iframe'ini bul
        const iframe = document.querySelector('iframe[src*="player"]');
        if (!iframe || !iframe.contentDocument) {
            setTimeout(mainLoop, 2000);
            return;
        }

        const doc = iframe.contentDocument;
        const video = doc.querySelector('video');

        if (!video) {
            setTimeout(mainLoop, 2000);
            return;
        }

        console.log('Video bulundu, arka plan oynatma aktif.');

        // Otomatik oynat
        const playVideo = () => {
            simulateUserInteraction();
            video.play().catch(() => {});
        };

        // Sürekli oynat
        setInterval(() => {
            if (video.paused) {
                playVideo();
            }
            // Ses açık mı?
            if (video.muted) video.muted = false;
            if (video.volume < 0.1) video.volume = 0.3;
        }, 1000);

        // Otomatik ilerleme
        setInterval(() => {
            const nextBtn = document.querySelector('a[href*="course-player-object-item"]:not(.isDisabled)');
            if (nextBtn && nextBtn.href !== window.location.href) {
                console.log('Sonraki videoya geçiliyor:', nextBtn.href);
                window.location.href = nextBtn.href;
            }
        }, 5000);

        // İlk oynatma
        playVideo();
    }

    // Sekme değişse bile devam et
    window.onblur = window.onfocusout = null;
})();
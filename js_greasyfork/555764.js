// ==UserScript==
// @name         Yunus2026 - ÖBA ULTIMATE (Arka Plan + Otomatik Geçiş + Tamamla)
// @namespace    https://www.oba.gov.tr/
// @version      1.0
// @description  ÖBA videolarını arka planda oynatır, otomatik bir sonraki videoya geçer ve "Tamamla" butonuna tıklar.
// @author       Yunus2026 & Grok
// @match        https://www.oba.gov.tr/*
// @icon         https://www.webbull.net/assets/img/logo.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555764/Yunus2026%20-%20%C3%96BA%20ULTIMATE%20%28Arka%20Plan%20%2B%20Otomatik%20Ge%C3%A7i%C5%9F%20%2B%20Tamamla%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555764/Yunus2026%20-%20%C3%96BA%20ULTIMATE%20%28Arka%20Plan%20%2B%20Otomatik%20Ge%C3%A7i%C5%9F%20%2B%20Tamamla%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('%c Yunus2026 ULTIMATE v1.0 BAŞLATILDI', 'color: #00ff00; font-weight: bold;');

    // 1. Kullanıcı Etkileşimi Simülasyonu (Otomatik oynatma izni)
    function simulateClick() {
        ['mousemove', 'click', 'keydown'].forEach(event => {
            document.dispatchEvent(new Event(event, { bubbles: true }));
        });
    }

    // 2. Tarayıcı Odak & Görünürlük API'lerini Devre Dışı Bırak
    try {
        Object.defineProperties(document, {
            hidden: { value: false, writable: false },
            visibilityState: { value: 'visible', writable: false },
            hasFocus: { value: true, writable: false }
        });

        const blockEvents = ['visibilitychange', 'blur', 'focusout', 'pagehide'];
        const originalAdd = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, ...args) {
            if (blockEvents.includes(type)) return;
            return originalAdd.apply(this, [type, ...args]);
        };
    } catch (e) { console.warn('API override hatası:', e); }

    // 3. WebSocket ile gelen "pause" komutlarını ENGELLE
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (...args) {
        const ws = new OriginalWebSocket(...args);
        const originalSend = ws.send;
        ws.send = function (data) {
            try {
                const msg = typeof data === 'string' ? JSON.parse(data) : data;
                const block = ['pause', 'stop', 'suspend', 'focus_lost'].some(cmd =>
                    JSON.stringify(msg).toLowerCase().includes(cmd)
                );
                if (block) {
                    console.log('%c PAUSE KOMUTU ENGELLENDİ', 'color: orange;', msg);
                    return;
                }
            } catch {}
            return originalSend.apply(this, arguments);
        };
        return ws;
    };

    // 4. Ana Döngü (iframe + video bul → oynat → tamamla → geç)
    function startEngine() {
        const iframe = document.querySelector('iframe[src*="player"], iframe[src*="video"]');
        if (!iframe || !iframe.contentDocument) {
            setTimeout(startEngine, 2000);
            return;
        }

        const doc = iframe.contentDocument;
        const video = doc.querySelector('video');
        if (!video) {
            setTimeout(startEngine, 2000);
            return;
        }

        console.log('%c Video bulundu, motor çalışıyor!', 'color: cyan;');

        // Video sürekli oynasın
        const keepPlaying = () => {
            if (video.paused || video.ended) {
                simulateClick();
                video.play().catch(() => {});
            }
            video.muted = false;
            video.volume = Math.max(video.volume, 0.3);
        };
        setInterval(keepPlaying, 1500);
        keepPlaying();

        // Otomatik "Tamamla" butonuna tıkla
        setInterval(() => {
            const selectors = [
                'button:contains("Tamamla")',
                'button:contains("Tamamlandı")',
                '.complete-button',
                '[data-action="complete"]',
                'a[href*="complete"]',
                '.vjs-control-bar button[title*="Tamamla"]'
            ];
            for (const sel of selectors) {
                const btn = document.querySelector(sel) || iframe.contentDocument.querySelector(sel);
                if (btn && !btn.disabled && btn.offsetParent !== null) {
                    console.log('%c TAMAMLA BUTONUNA TIKLANDI', 'color: gold;', btn.textContent);
                    btn.click();
                    break;
                }
            }
        }, 8000);

        // Bir sonraki videoya geç (%92 izlenince)
        setInterval(() => {
            if (video.currentTime > 0 && video.duration > 0 && (video.currentTime / video.duration) > 0.92) {
                const nextLink = document.querySelector('a.course-player-object-item:not(.isDisabled)');
                if (nextLink && nextLink.href && nextLink.href !== window.location.href) {
                    console.log('%c SONRAKİ VİDEOYA GEÇİLİYOR', 'color: lime;', nextLink.href);
                    setTimeout(() => { window.location.href = nextLink.href; }, 2000);
                }
            }
        }, 5000);

    }

    // 5. Başlat
    $(document).ready(() => setTimeout(startEngine, 4000));
    window.addEventListener('load', () => setTimeout(startEngine, 5000));

    // Sekme değişse bile devam
    window.onblur = window.onfocusout = () => {
        document.title = 'Yunus2026 ULTIMATE ÇALIŞIYOR ;)';
    };

})();
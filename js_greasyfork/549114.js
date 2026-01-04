// ==UserScript==
// @name         Chzzk All-in-One Script (20250911)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  GRID Bypass, Auto 1080p, Ad Block Popup Clear
// @author       LESSERAFIM
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @grant        none
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @run-at       document-start
// @license      르세라핌 사쿠라
// @downloadURL https://update.greasyfork.org/scripts/549114/Chzzk%20All-in-One%20Script%20%2820250911%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549114/Chzzk%20All-in-One%20Script%20%2820250911%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Chzzk All-in-One] 그리드 우회 모듈 초기화.");
    xhook.after(function(req, res) {
        if (req.url.includes("live-detail")) {
            try {
                let data = JSON.parse(res.text);
                if (data.content && data.content.p2pQuality) {
                    data.content.p2pQuality = [];
                    Object.defineProperty(data.content, "p2pQuality", {
                        configurable: false,
                        writable: false
                    });
                }
                if (data.content && data.content.livePlaybackJson) {
                    let playback = JSON.parse(data.content.livePlaybackJson);
                    if (playback.meta && playback.meta.p2p) {
                        playback.meta.p2p = false;
                    }
                    if (Array.isArray(playback.media)) {
                        playback.media.forEach(m => {
                            if (Array.isArray(m.encodingTrack)) {
                                m.encodingTrack.forEach(track => {
                                    if (track.p2pPath) delete track.p2pPath;
                                    if (track.p2pPathUrlEncoding) delete track.p2pPathUrlEncoding;
                                });
                            }
                        });
                    }
                    data.content.livePlaybackJson = JSON.stringify(playback);
                }
                res.text = JSON.stringify(data);
            } catch (err) {
                console.error("[Chzzk All-in-One] 그리드 우회 처리 중 오류:", err);
            }
        }
    });

    window.addEventListener('load', function() {
        console.log('[Chzzk All-in-One] UI 편의기능 모듈 초기화.');

        // --- 광고 팝업 차단 코드 (제공된 원본) ---
        (function () {
            function removeAdBlockPopup() {
                const popups = document.querySelectorAll('div[class*="popup"], div[class*="modal"]');
                popups.forEach(popup => {
                    if (popup.textContent.includes('광고 차단')) {
                        popup.remove();
                    }
                });
            }
            const adBlockObserver = new MutationObserver(removeAdBlockPopup);
            adBlockObserver.observe(document.body, { childList: true, subtree: true });
            removeAdBlockPopup();
        })();

        (function () {
            let firstRun = true;
            function triggerClick(element) {
                if (element) {
                    element.click();
                    let event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    element.dispatchEvent(event);
                    let enterEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter' });
                    element.dispatchEvent(enterEvent);
                }
            }
            function selectBestAvailableQuality() {
                let settingButton = document.querySelector('.pzp-setting-button');
                if (!settingButton) return;
                triggerClick(settingButton);
                setTimeout(() => {
                    let qualityButton = document.querySelector('.pzp-setting-intro-quality');
                    if (!qualityButton) return;
                    triggerClick(qualityButton);
                    setTimeout(() => {
                        let qualityItems = document.querySelectorAll('.pzp-ui-setting-quality-item.pzp-ui-setting-pane-item');
                        if (qualityItems.length === 0) return;
                        let targetQuality = Array.from(qualityItems).find(item => item.textContent.trim().startsWith("1080p"));
                        if (!targetQuality) {
                            targetQuality = Array.from(qualityItems).find(item => item.textContent.trim().startsWith("720p"));
                        }
                        if (targetQuality) {
                            triggerClick(targetQuality);
                            let innerButton = targetQuality.querySelector("div") || targetQuality.querySelector("span");
                            if (innerButton) triggerClick(innerButton);
                        }
                    }, 0);
                }, 0);
            }
            function initAutoQualitySelection() {
                let delay = firstRun ? 3000 : 700;
                firstRun = false;
                setTimeout(() => {
                    let settingButton = document.querySelector('.pzp-setting-button');
                    if (settingButton) {
                        selectBestAvailableQuality();
                    } else {
                        let observer = new MutationObserver((mutations, obs) => {
                            let settingButton = document.querySelector('.pzp-setting-button');
                            if (settingButton) {
                                selectBestAvailableQuality();
                                obs.disconnect();
                            }
                        });
                        observer.observe(document.body, { childList: true, subtree: true });
                    }
                }, delay);
                const style = document.createElement('style');
                style.innerHTML = `
                    .pzp-setting-pane, .pzp-setting-quality-pane, .pzp-settings { display: none !important; }
                `;
                document.head.appendChild(style);
                setTimeout(() => {
                    document.head.removeChild(style);
                }, 1000);
            }
            function observeUrlChange(callback) {
                let lastUrl = location.href;
                new MutationObserver(() => {
                    const currentUrl = location.href;
                    if (currentUrl !== lastUrl) {
                        lastUrl = currentUrl;
                        if (currentUrl.includes('/live/')) {
                            callback();
                        }
                    }
                }).observe(document, { childList: true, subtree: true });
                window.addEventListener('popstate', () => {
                    const currentUrl = location.href;
                    if (currentUrl !== lastUrl) {
                        lastUrl = currentUrl;
                        if (currentUrl.includes('/live/')) {
                            callback();
                        }
                    }
                });
            }
            if (location.href.includes('/live/')) {
                initAutoQualitySelection();
            }
            observeUrlChange(initAutoQualitySelection);
        })();
    });
})();
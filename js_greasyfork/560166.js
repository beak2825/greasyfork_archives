// ==UserScript==
// @name         91Porna Ultimate Player (ArtPlayer) + Smart AdBlock
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Ultimate ArtPlayer replacement, smart m3u8 detection, ultra-low CPU ad blocker
// @author       Antigravity
// @license      MIT
// @match        https://91porna.com/*
// @match        https://www.91porna.com/*
// @match        https://*.91porna.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @run-at       document-start
// jshint        esversion: 8
// @downloadURL https://update.greasyfork.org/scripts/560166/91Porna%20Ultimate%20Player%20%28ArtPlayer%29%20%2B%20Smart%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/560166/91Porna%20Ultimate%20Player%20%28ArtPlayer%29%20%2B%20Smart%20AdBlock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ================= 工具 ================= */
    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (res) {
                    try {
                        (0, eval)(res.responseText);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    var depsReady = loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js')
        .then(function () {
            return loadScript('https://cdn.jsdelivr.net/npm/artplayer@5.1.3/dist/artplayer.js');
        });

    /* ================= 广告拦截 ================= */
    GM_addStyle(
        '.modal,.modal-backdrop,.dx-modal,.ad-dialog,[class*="modal"],[class*="ad-dialog"],' +
        '.aspect-w-10.aspect-h-2,a.checkNum,div[id^="ad-"],iframe[src*="http"]{' +
        'display:none!important;visibility:hidden!important;opacity:0!important;' +
        'pointer-events:none!important;position:absolute!important;left:-9999px!important;}'
    );

    var adTexts = ['澳门博彩', '更多色站', 'APP下载', '吃瓜爆料'];
    function removeAds() {
        document.querySelectorAll('a').forEach(function (a) {
            if (adTexts.some(function (t) { return a.textContent.indexOf(t) !== -1; })) {
                a.remove();
            }
        });
        if (document.body) {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = 'auto';
        }
    }

    window.open = function () { return null; };

    var fastAdTimer = setInterval(removeAds, 200);
    setTimeout(function () {
        clearInterval(fastAdTimer);
        setInterval(removeAds, 3000);
    }, 5000);

    /* ================= m3u8 探测 ================= */
    function findM3U8() {
        return new Promise(function (resolve, reject) {
            var count = 0;
            function check() {
                count += 1;
                var mse = document.getElementById('mse');
                if (mse && mse.dataset.url && mse.dataset.url.indexOf('.m3u8') !== -1) {
                    resolve(mse.dataset.url.replace(/&amp;/g, '&'));
                    return;
                }
                var v = document.querySelector('video[src*=".m3u8"]');
                if (v && v.src) {
                    resolve(v.src);
                    return;
                }
                if (count < 60) {
                    setTimeout(check, 100);
                } else {
                    reject(new Error('m3u8 not found'));
                }
            }
            check();
        });
    }

    /* ================= 播放器 ================= */
    var inited = false;
    function initPlayer(original) {
        if (inited) {
            return;
        }
        inited = true;

        depsReady.then(function () {
            return findM3U8();
        }).then(function (url) {
            var wrap = original.parentElement;
            wrap.innerHTML = '';

            var box = document.createElement('div');
            box.id = 'artplayer-container';
            box.style.width = '100%';
            box.style.height = '450px';
            wrap.appendChild(box);

            new window.Artplayer({
                container: box,
                url: url,
                type: 'm3u8',
                autoplay: true,
                pip: true,
                fullscreen: true,
                fullscreenWeb: true,
                playbackRate: true,
                setting: true,
                hotkey: true,
                customType: {
                    m3u8: function (video, u) {
                        if (window.Hls && window.Hls.isSupported()) {
                            var hls = new window.Hls({ enableWorker: true });
                            hls.loadSource(u);
                            hls.attachMedia(video);
                        } else {
                            video.src = u;
                        }
                    }
                }
            });
        }).catch(function (e) {
            console.error('[UltimatePlayer]', e);
            inited = false;
        });
    }

    /* ================= 观察器（自动断开） ================= */
    var observer = new MutationObserver(function () {
        if (location.href.indexOf('/detail') === -1) {
            return;
        }
        var target = document.getElementById('mse') || document.querySelector('.xgplayer');
        if (target && target.getBoundingClientRect().width > 0) {
            observer.disconnect();
            initPlayer(target);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();

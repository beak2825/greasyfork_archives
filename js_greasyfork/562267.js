// ==UserScript==
// ✅ Stable & tested version (Jan 11, 2026)
// @name         Patreon Video Unmute + Caption Helper
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically unmutes Patreon videos and enables captions with a built-in stability safeguard for consistent playback.
// @author       Sethi
// @match        *://*.patreon.com/*
// @license      MIT
// License: Open and free for anyone to use, modify, and share
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562267/Patreon%20Video%20Unmute%20%2B%20Caption%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562267/Patreon%20Video%20Unmute%20%2B%20Caption%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Maintained by Sethi
    var RELOAD_FLAG = 'patreon_cc_reload_done';

    /* ---------- SUCCESS BANNER + LOG ---------- */
    function showInitMessage() {
        console.log('Patreon Fix: Initialization complete');

        var banner = document.createElement('div');
        banner.textContent = '✅ Patreon Fix active';
        banner.style.position = 'fixed';
        banner.style.top = '10px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = '#1db954';
        banner.style.color = '#fff';
        banner.style.padding = '8px 14px';
        banner.style.borderRadius = '6px';
        banner.style.fontSize = '13px';
        banner.style.zIndex = '999999';
        banner.style.opacity = '0';
        banner.style.transition = 'opacity 0.4s ease';

        document.body.appendChild(banner);

        setTimeout(function () {
            banner.style.opacity = '1';
        }, 50);

        setTimeout(function () {
            banner.style.opacity = '0';
            setTimeout(function () {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 400);
        }, 2000);
    }

    /* ---------- RELOAD HINT ---------- */
    function showReloadHint() {
        var hint = document.createElement('div');
        hint.textContent = 'Reloading once to ensure captions stay enabled…';
        hint.style.position = 'fixed';
        hint.style.bottom = '20px';
        hint.style.right = '20px';
        hint.style.background = 'rgba(0,0,0,0.75)';
        hint.style.color = '#fff';
        hint.style.padding = '10px 14px';
        hint.style.borderRadius = '8px';
        hint.style.fontSize = '13px';
        hint.style.zIndex = '999999';
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.4s ease';

        document.body.appendChild(hint);

        setTimeout(function () {
            hint.style.opacity = '1';
        }, 50);

        setTimeout(function () {
            if (hint.parentNode) {
                hint.parentNode.removeChild(hint);
            }
        }, 2500);
    }

    /* ---------- UNMUTE ---------- */
    function forceUnmute(video) {
        if (video.muted || video.volume === 0) {
            video.muted = false;
            video.volume = 0.75;
            console.log('Patreon Fix: Video unmuted');
        }
    }

    /* ---------- CAPTION ENABLE ---------- */
    function enableCaptions(video) {
        if (!video.textTracks || video.textTracks.length === 0) return;

        for (var i = 0; i < video.textTracks.length; i++) {
            var track = video.textTracks[i];
            if (track.kind === 'subtitles' || track.kind === 'captions') {
                track.mode = 'showing';
                console.log(
                    'Patreon Fix: Captions enabled (' +
                    (track.language || 'unknown') + ')'
                );
                return;
            }
        }
    }

    /* ---------- ONE-TIME RELOAD (STABILITY SAFEGUARD) ---------- */
    function maybeReload() {
        if (!sessionStorage.getItem(RELOAD_FLAG)) {
            sessionStorage.setItem(RELOAD_FLAG, '1');
            showReloadHint();
            console.log('Patreon Fix: One-time reload for stability');

            setTimeout(function () {
                location.reload();
            }, 1200);
        }
    }

    function applyFix(video) {
        forceUnmute(video);

        enableCaptions(video);
        setTimeout(function () { enableCaptions(video); }, 600);
        setTimeout(function () { enableCaptions(video); }, 1400);

        setTimeout(maybeReload, 1800);
    }

    /* ---------- OBSERVER ---------- */
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];
                if (node.nodeType === 1) {
                    var videos = [];

                    if (node.tagName === 'VIDEO') {
                        videos = [node];
                    } else {
                        videos = node.getElementsByTagName('video');
                    }

                    for (var j = 0; j < videos.length; j++) {
                        (function (video) {
                            video.addEventListener(
                                'play',
                                function () {
                                    applyFix(video);
                                },
                                { once: true }
                            );
                        })(videos[j]);
                    }
                }
            }
        });
    });

    /* ---------- WAIT FOR BODY ---------- */
    var waitForBody = setInterval(function () {
        if (document.body) {
            showInitMessage();

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            clearInterval(waitForBody);
        }
    }, 50);

})();

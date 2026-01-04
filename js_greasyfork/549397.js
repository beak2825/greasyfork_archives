// ==UserScript==
// @name         在未登录B站的情况下自动续播被暂停的视频 (Bilibili: Continue playing paused video without logging-in)
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  处理哔哩哔哩（B站）未登录状态下视频播放中断并强制显示登录弹窗的困扰 / Address the issue of Bilibili videos halting playback and prompting for login due to guest access.
// @author       NekoBytes
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549397/%E5%9C%A8%E6%9C%AA%E7%99%BB%E5%BD%95B%E7%AB%99%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E8%A2%AB%E6%9A%82%E5%81%9C%E7%9A%84%E8%A7%86%E9%A2%91%20%28Bilibili%3A%20Continue%20playing%20paused%20video%20without%20logging-in%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549397/%E5%9C%A8%E6%9C%AA%E7%99%BB%E5%BD%95B%E7%AB%99%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E8%A2%AB%E6%9A%82%E5%81%9C%E7%9A%84%E8%A7%86%E9%A2%91%20%28Bilibili%3A%20Continue%20playing%20paused%20video%20without%20logging-in%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function bindVideoWatchTimer(video) {
        if (!video) return null;

        let watchTime = 0;
        let lastStart = null;

        function getWatchTime() {
            let total = watchTime;
            if (!video.paused && lastStart !== null) {
                total += (Date.now() - lastStart) / 1000;
            }
            return total;
        }

        video.addEventListener('play', () => {
            lastStart = Date.now();
        });

        video.addEventListener('pause', () => {
            if (lastStart !== null) {
                watchTime += (Date.now() - lastStart) / 1000;
                lastStart = null;
            }
        });

        video.addEventListener('ended', () => {
            if (lastStart !== null) {
                watchTime += (Date.now() - lastStart) / 1000;
                lastStart = null;
            }
        });

        return { getWatchTime };
    }

    function logicB(video) {
        var target = document.getElementsByClassName("bpx-player-row-dm-wrap")[0];
        var success = 0;
        if (document.querySelector('.bili-mini-mask')) {
            document.getElementsByClassName("bili-mini-close-icon")[0].click();
            if (video && video.paused) {
                console.log("mask paused detected");
                document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-play")[0].click();
                success = 1;
            }
            return success;
        }
    }

    function startScheduler(video) {
        const timer = bindVideoWatchTimer(video);
        if (!timer) return;

        video.addEventListener('play', () => {

            const checkInterval = setInterval(() => {
                const t = timer.getWatchTime();

                if (t >= 55) {
                    clearInterval(checkInterval);

                    let interval1 = setInterval(() => {
                        const t2 = timer.getWatchTime();

                        if (t2 >= 59.3 && t2 <= 60.5) {
                            clearInterval(interval1);

                            let interval2 = setInterval(() => {
                                if (logicB(video)) {
                                    clearInterval(interval2);
                                } else if (timer.getWatchTime() > 60.5) {
                                    clearInterval(interval2);

                                    let interval3 = setInterval(() => {
                                        if (logicB(video)) {
                                            clearInterval(interval3);
                                        } else if (timer.getWatchTime() > 65) {
                                            clearInterval(interval3);
                                        }
                                    }, 500);
                                }
                            }, 50);
                        }
                    }, 500);
                }
            }, 200);
        }, { once: true });
    }

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            startScheduler(video);
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
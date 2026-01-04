// ==UserScript==
// @name         B站分P时长统计
// @namespace    http://tampermonkey.net/
// @version      0.83
// @description  监听URL变化并计算分P总时长/已播放/剩余（右下角 box 背景进度 + 分P卡片背景进度）
// @author       kirari
// @match        *://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openuserjs.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547971/B%E7%AB%99%E5%88%86P%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/547971/B%E7%AB%99%E5%88%86P%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
(function () {
    'use strict';




    /** ---------------- 工具函数 ---------------- */
    function onUrlChange(callback) {
        let last = location.href;
        const fire = () => {
            const now = location.href;
            if (now !== last) {
                last = now;
                callback(now);
            }
        };
        const wrap = name => {
            const orig = history[name];
            return function () {
                const ret = orig.apply(this, arguments);
                fire();
                return ret;
            };
        };
        history.pushState = wrap('pushState');
        history.replaceState = wrap('replaceState');
        window.addEventListener('popstate', fire);
        window.addEventListener('hashchange', fire);
        setInterval(fire, 500);
        callback(last);
    }

    function waitFor(selector, root = document, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const found = root.querySelector(selector);
            if (found) return resolve(found);
            const obs = new MutationObserver(() => {
                const el = root.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => {
                obs.disconnect();
                reject(new Error('waitFor timeout: ' + selector));
            }, timeout);
        });
    }

    function parseDuration(str) {
        if (!str) return 0;
        const parts = str.split(':').map(s => parseInt(s, 10) || 0);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return parts[0] || 0;
    }

    function secondsToHMS(sec) {
        sec = Math.max(0, Math.floor(sec || 0));
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    /** ---------------- UI: 右下角 box ---------------- */
    function ensureBox() {
        const id = 'bili-total-hours-badge';
        let box = document.getElementById(id);
        if (!box) {
            box = document.createElement('div');
            box.id = id;
            Object.assign(box.style, {
                position: 'fixed',
                right: '14px',
                bottom: '14px',
                zIndex: '999999',
                padding: '10px 12px',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,.2)',
                color: '#fff',
                fontSize: '12px',
                lineHeight: '1.6',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                userSelect: 'text',
                backgroundColor: 'rgba(0,0,0,0.45)',
                overflow: 'hidden',
                // minWidth: '150px'
            });
            const inner = document.createElement('div');
            inner.id = 'bili-total-hours-badge-inner';
            inner.style.position = 'relative';
            inner.style.zIndex = '2';
            box.appendChild(inner);

            const progressLayer = document.createElement('div');
            progressLayer.id = 'bili-total-hours-progress-layer';
            Object.assign(progressLayer.style, {
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '0%',
                zIndex: '1',
                pointerEvents: 'none'
            });
            box.appendChild(progressLayer);

            document.body.appendChild(box);
        }
        return box;
    }

    function showBadge({ total, played, remain }) {
        const box = ensureBox();
        const inner = document.getElementById('bili-total-hours-badge-inner');
        const progressLayer = document.getElementById('bili-total-hours-progress-layer');

        if (!total || total <= 0) {
            box.style.display = 'none';
            return;
        } else {
            box.style.display = 'block';
        }

        const ratio = Math.max(0, Math.min(1, (played || 0) / total));
        const percent = (ratio * 100).toFixed(2) + '%';

        progressLayer.style.width = percent;
        progressLayer.style.background = 'linear-gradient(90deg, rgba(76,175,80,0.9), rgba(76,175,80,0.7))';

        inner.innerHTML = `
            <div>⏱ 总时长：${secondsToHMS(total)}</div>
            <div>▶ 已播放：${secondsToHMS(played)}</div>
            <div>⏭ 剩余：${secondsToHMS(remain)}</div>
        `;
    }

    /** ---------------- 卡片背景进度 ---------------- */
    let lastCard = null;
//     function updateCardProgress(video) {
//         const card = document.querySelector('.simple-base-item.page-item.active.sub,.video-pod__item.active,.simple-base-item.active');
//         if (!card || !video.duration) return;

//         if (lastCard && lastCard !== card) {
//             lastCard.style.background = '';
//         }
//         lastCard = card;

//         const percent = (video.currentTime / video.duration) * 100;
//         card.style.background = `linear-gradient(
//             to right,
//             rgba(76, 175, 80, 0.4) ${percent}%,
//             transparent ${percent}%
//         )`;


//     }


      function updateCardProgress({ total, played, remain }) {

      // function updateCardProgress(video) {

        // if (!video || !video.duration) return;

        // 优先匹配最精确的 active 分P

        const ratio = Math.max(0, Math.min(1, (played || 0) / total));
        const percent = (ratio * 100).toFixed(2) ;
        // const percent = Math.floor(ratio * 100) + '%';
        // const percent = played/total* 100;

        const card = document.querySelector('.video-pod.video-pod') ||
              document.querySelector('.simple-base-item.page-item.active.sub') ||
                     document.querySelector('.simple-base-item.active') ||
                     document.querySelector('.video-pod__item.active');
        const active = document.querySelector('.simple-base-item.page-item.active.sub') ||
                     document.querySelector('.simple-base-item.active') ||
                     document.querySelector('.video-pod__item.active');

        // if (!card) return;

        // 如果上一次记录的卡片和当前不同，清除上一个背景
        if (lastCard && lastCard !== active) {
            lastCard.style.border = '';
        }
        lastCard = active;

        // const percent = (video.currentTime / video.duration) * 100;


        card.style.background = `linear-gradient(
            to right,
            rgba(76, 175, 80, 0.4) ${percent}%,
            transparent ${percent}%
        )`;
        card.style.border=`solid 1px black`;
        active.style.border=`solid 1px black`;
    }
   // rgba(76, 175, 80, 0.4) ${percent}%,transparent 100%
    /** ---------------- 全局状态 ---------------- */
    let totalSeconds = 0;
    let basePlayed = 0;
    let videoElement = null;

    function getCurrentVideoProgress() {
        return videoElement ? Math.floor(videoElement.currentTime || 0) : 0;
    }

    /** ---------------- 核心逻辑 ---------------- */
    async function recalcSegments() {
        try {
            await waitFor('.simple-base-item .duration').catch(() => waitFor('.video-pod__item .duration'));
            let items = Array.from(document.querySelectorAll('.simple-base-item'));
            if (items.length === 0) {
                items = Array.from(document.querySelectorAll('.video-pod__item'));
            }
            if (items.length === 0) {
                const b = document.getElementById('bili-total-hours-badge');
                if (b) b.style.display = 'none';
                return;
            }

            totalSeconds = 0;
            basePlayed = 0;
            let passedActive = false;
            let hasActive = false;

            for (const item of items) {
                const tEl = item.querySelector('.duration');
                if (!tEl) continue;
                const sec = parseDuration(tEl.textContent.trim());
                totalSeconds += sec;

                if (item.classList.contains('active')) {
                    hasActive = true;
                    passedActive = true;
                }
                if (!passedActive) basePlayed += sec;
            }
            if (!hasActive) basePlayed = 0;

            bindVideoListener();
            updateProgress();
        } catch (e) {
            console.warn('统计失败：', e);
        }
    }

    function updateProgress() {
        const current = getCurrentVideoProgress();
        const played = basePlayed + current;
        const remain = Math.max(0, totalSeconds - played);

        showBadge({ total: totalSeconds, played, remain });
        if (videoElement) {
            // updateCardProgress(videoElement);
           updateCardProgress({ total: totalSeconds, played, remain });
        }
    }

    function bindVideoListener() {
        const v = document.querySelector('video');
        if (!v) return;
        if (videoElement !== v) {
            if (videoElement) {
                videoElement.removeEventListener('timeupdate', updateProgress);
            }
            videoElement = v;
            videoElement.addEventListener('timeupdate', updateProgress);
        }
    }

    /** ---------------- 启动 ---------------- */
    window.addEventListener('load', () => setTimeout(recalcSegments, 1500));
    onUrlChange(href => {
        if (/^https?:\/\/(www\.)?bilibili\.com\/video\//.test(href)) {
            setTimeout(recalcSegments, 400);
        }
    });
})();

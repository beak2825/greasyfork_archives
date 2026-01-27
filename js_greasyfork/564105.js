// ==UserScript==
// @name         超慧刷
// @namespace    http://tampermonkey.net/
// @version      3.4.0
// @description  Observer + 时间门控 + 自动播放下一课 + 成功次数统计
// @match        https://h5.zkpingtai.com/*
// @grant        none
// @run-at       document-ready
// @license      MIT  // 新增：声明MIT许可证，允许自由修改/分发
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/564105/%E8%B6%85%E6%85%A7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/564105/%E8%B6%85%E6%85%A7%E5%88%B7.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ================= 配置 ================= */
    const CONFIG = {
        delay: [6000, 8000],
        minFacePopupWait: 15000,

        faceInterval: 13 * 60 * 1000, // ⭐ 每X分钟允许刷一次
        autoPlayNext: true,           // ⭐ 课程结束自动播放下一节

        SELECTOR: {
            face: '.face-btn',
            photo: '.getPhoto',
            upload: '.result-btn-upload',
            confirm: '.dialog-modal-btn > button',

            currentTime: '.prism-time-display .current-time',
            duration: '.prism-time-display .duration',

            videoArea: '.prism-player, video' // ⭐ 视频区域
        }
    };

    /* ================= 工具 ================= */
    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function parseTimeToSeconds(str) {
        if (!str) return 0;
        const p = str.split(':').map(Number);
        return p.length === 2 ? p[0] * 60 + p[1] : 0;
    }

    function isElementVisible(el) {
        if (!el) return false;
        const s = getComputedStyle(el);
        return (
            el.offsetParent !== null &&
            s.display !== 'none' &&
            s.visibility !== 'hidden' &&
            parseFloat(s.opacity) > 0 &&
            el.getClientRects().length > 0
        );
    }

    function click(el) {
        if (!el) return false;
        ['mousedown','mouseup','click'].forEach(e =>
            el.dispatchEvent(new MouseEvent(e, { bubbles:true, cancelable:true }))
        );
        return true;
    }

    /* ================= 状态 ================= */
    let active = true;
    let state = 'IDLE';

    let lastFaceTime = 0;
    let faceCount = 0;
    let courseEndedHandled = false;

    let observer = null;
    let courseTimer = null;

    /* ================= UI ================= */
    function createPanel() {
        const d = document.createElement('div');
        d.style.cssText = `
            position:fixed;top:20px;right:20px;
            background:#fff;padding:10px;
            border:1px solid #ccc;border-radius:8px;
            z-index:999999;font-size:12px;
        `;
        d.innerHTML = `
            <label><input type="checkbox" checked> 启用脚本</label>
            <div id="st" style="margin-top:6px;">等待课程</div>
            <div>✅ 成功识别：<b id="cnt">0</b> 次</div>
        `;
        d.querySelector('input').onchange = e => {
            active = e.target.checked;
            active ? start() : stop();
        };
        document.body.appendChild(d);
    }

    const setStatus = t => document.getElementById('st').textContent = t;
    const setCount  = n => document.getElementById('cnt').textContent = n;

    /* ================= 刷脸流程 ================= */
    async function runFaceFlow() {
        if (!active || state !== 'IDLE') return;

        state = 'FACE';
        setStatus('📸 刷脸中');

        await sleep(rand(...CONFIG.delay));
        if (!click(document.querySelector(CONFIG.SELECTOR.face))) {
            state = 'IDLE';
            return;
        }

        await sleep(CONFIG.minFacePopupWait);
        await sleep(rand(...CONFIG.delay));
        click(document.querySelector(CONFIG.SELECTOR.photo));
        await sleep(rand(...CONFIG.delay));
        click(document.querySelector(CONFIG.SELECTOR.upload));
        await sleep(rand(...CONFIG.delay));
        click(document.querySelector(CONFIG.SELECTOR.confirm));

        faceCount++;
        setCount(faceCount);
        setStatus('✅ 刷脸成功');

        state = 'IDLE';
    }

    /* ================= Observer：刷脸弹窗 ================= */
    function startObserver() {
        stopObserver();
        observer = new MutationObserver(() => {
            if (state !== 'IDLE') return;

            const now = Date.now();
            if (lastFaceTime && now - lastFaceTime < CONFIG.faceInterval) return;

            const btn = document.querySelector(CONFIG.SELECTOR.face);
            if (btn && isElementVisible(btn)) {
                lastFaceTime = now;
                runFaceFlow();
            }
        });
        observer.observe(document.body, { childList:true, subtree:true });
    }

    function stopObserver() {
        observer && observer.disconnect();
        observer = null;
    }

    /* ================= 课程时间监控（含自动下一节） ================= */
    function startCourseMonitor() {
        stopCourseMonitor();

        courseTimer = setInterval(() => {
            const cur = document.querySelector(CONFIG.SELECTOR.currentTime);
            const dur = document.querySelector(CONFIG.SELECTOR.duration);
            if (!cur || !dur) return;

            const c = parseTimeToSeconds(cur.textContent);
            const d = parseTimeToSeconds(dur.textContent);

            // 新课程开始（时间回退）
            if (c > 3) {
                courseEndedHandled = false;
            }

            // 课程结束
            if (c >= d - 3 && !courseEndedHandled) {
                courseEndedHandled = true;
                lastFaceTime = 0;
                setStatus('📘 课程结束');

                if (CONFIG.autoPlayNext) {
                    setTimeout(() => {
                        const video = document.querySelector(CONFIG.SELECTOR.videoArea);
                        if (video) {
                            click(video);
                            setStatus('▶️ 播放下一节课程');
                        }
                    }, 3000);
                }
            }
        }, 4000);
    }

    function stopCourseMonitor() {
        courseTimer && clearInterval(courseTimer);
        courseTimer = null;
    }

    /* ================= 控制 ================= */
    function start() {
        state = 'IDLE';
        lastFaceTime = 0;
        faceCount = 0;
        setCount(0);
        courseEndedHandled = false;

        setStatus('👀 等待刷脸弹窗');
        startObserver();
        startCourseMonitor();
    }

    function stop() {
        stopObserver();
        stopCourseMonitor();
        state = 'STOP';
        setStatus('❌ 已停用');
    }

    /* ================= 启动 ================= */
    setTimeout(() => {
        createPanel();
        start();
        console.log('✅ 刷脸 + 自动下一节 3.4 已启动');
    }, rand(...CONFIG.delay));
})();

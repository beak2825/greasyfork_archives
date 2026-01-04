// ==UserScript==
// @name         集美大学继续教育学院自动播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动完成网页视频观看（skip 或 simulate 模式），调用页面 studyjieshu 保存进度并自动跳转下一节。慎用。Requires site to have video1...videon elements and existing studyjieshu()/daojishi() functions.
// @author       JavaWeh
// @match        https://jxjyjx.jmu.edu.cn/main/study/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/552229/%E9%9B%86%E7%BE%8E%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/552229/%E9%9B%86%E7%BE%8E%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ====== 配置（UI 可调） ====== */
    let CONFIG = {
        mode: 'skip', // 'skip' | 'simulate'
        simulateRate: 8, // playbackRate for simulate mode (>=1). Higher = faster.
        betweenDelay: 800, // ms delay between videos when skipping
        waitMetadataTimeout: 5000 // ms
    };

    /* ====== 状态变量 ====== */
    let controller = {
        running: false,
        current: 1,
        sp_count: null,
        stopRequested: false
    };

    /* ====== 小工具 ====== */
    function log(...args) { console.log('[AutoWatcher]', ...args); }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    /* 等待元素出现（简单实现） */
    function waitFor(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const obs = new MutationObserver(() => {
                const e = document.querySelector(selector);
                if (e) {
                    obs.disconnect();
                    resolve(e);
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => {
                obs.disconnect();
                reject(new Error('timeout waiting for ' + selector));
            }, timeout);
        });
    }

    /* ====== 页面方法适配器 ======
       我直接调用页面已有的 studyjieshu/isok/num/daojishi，以减少重复实现。
       如果页面没有这些函数，脚本会尝试直接触发视频 ended 事件或手动提交。
    */
    function safeCallStudyjieshu(isok) {
        try {
            if (typeof window.studyjieshu === 'function') {
                // 保证全局 num 与页面一致
                if (typeof window.num === 'undefined') window.num = controller.current;
                window.studyjieshu(isok);
                log('called studyjieshu(' + isok + ') for num=' + window.num);
                return true;
            }
        } catch (e) {
            console.warn('studyjieshu call failed', e);
        }
        return false;
    }

    /* ====== 单个视频处理函数 ====== */
    async function handleVideo(index) {
        if (controller.stopRequested) return false;
        controller.current = index;

        const videoId = 'video' + index;
        let video = document.getElementById(videoId);
        if (!video) {
            // 可能还未加载，等待
            try {
                video = await waitFor(`#${videoId}`, CONFIG.waitMetadataTimeout);
            } catch (e) {
                log(`video ${videoId} not found, skipping`);
                return true;
            }
        }

        // 等待 metadata ready（duration 可用）
        if (isNaN(video.duration) || video.duration === 0) {
            await new Promise((res) => {
                const onMeta = () => {
                    video.removeEventListener('loadedmetadata', onMeta);
                    res();
                };
                video.addEventListener('loadedmetadata', onMeta);
                setTimeout(res, CONFIG.waitMetadataTimeout);
            });
        }

        log('processing', videoId, 'duration', video.duration);

        if (CONFIG.mode === 'skip') {
            // 跳到接近末尾，再调用 studyjieshu(1)
            try {
                // 如果视频是跨域受限，直接调用 studyjieshu
                if (!isFinite(video.duration) || video.duration === 0) {
                    log('duration not available, directly calling studyjieshu(1)');
                    safeCallStudyjieshu(1);
                    await sleep(CONFIG.betweenDelay);
                    return true;
                }
                // 将 currentTime 设为 duration - 1s（避免某些播放器禁止直接设置到 duration）
                const target = Math.max(0, video.duration - 1);
                video.currentTime = target;
                // 少数播放器不会触发 ended，即使 currentTime=duration-1，故手动触发保存
                await sleep(300); // 给浏览器一点时间去触发任何内置事件
                // 标记为已完成并提交（页面的 studyjieshu 会检查并提交）
                if (!safeCallStudyjieshu(1)) {
                    // fallback: 触发 ended 事件 套用页面 onended 逻辑
                    const ev = new Event('ended');
                    video.dispatchEvent(ev);
                }
                await sleep(CONFIG.betweenDelay);
                return true;
            } catch (e) {
                console.error('skip-mode error', e);
                return false;
            }
        } else { // simulate 模式
            try {
                // 尝试设置播放速率并播放
                video.playbackRate = CONFIG.simulateRate;
                if (video.paused) {
                    try { await video.play(); } catch (e) { /* some players block play without user gesture */ }
                }
                // 每隔 50ms 检查是否到达末尾
                return await new Promise((resolve) => {
                    const check = async () => {
                        if (controller.stopRequested) {
                            try { video.pause(); } catch (e) {}
                            return resolve(false);
                        }
                        // 如果 playbackRate 没有效果，可以手动推进 currentTime
                        if (!isFinite(video.duration) || video.duration === 0) {
                            // duration 不可用，直接保存并结束
                            safeCallStudyjieshu(1);
                            return resolve(true);
                        }
                        // 当剩余时间小于 1s 时，提交并结束
                        const remaining = (video.duration - video.currentTime);
                        if (remaining <= 1.2) {
                            try { video.currentTime = video.duration; } catch (e) {}
                            safeCallStudyjieshu(1);
                            await sleep(200);
                            return resolve(true);
                        }
                        // 每隔大约 1 秒调用一次页面保存（页面 daojishi 每 60s 保存一次，
                        // 这里我们用更频繁的保存以提高稳定性）
                        if (!controller._lastSave || (Date.now() - controller._lastSave) > 30000) {
                            controller._lastSave = Date.now();
                            safeCallStudyjieshu(0);
                        }
                        setTimeout(check, 500);
                    };
                    // 绑定 onended 也可以直接跳到下一个
                    video.addEventListener('ended', function onEnd() {
                        video.removeEventListener('ended', onEnd);
                        resolve(true);
                    });
                    check();
                });
            } catch (e) {
                console.error('simulate-mode error', e);
                return false;
            }
        }
    }

    /* ====== 主流程 ====== */
    async function runAll() {
        if (controller.running) return;
        controller.running = true;
        controller.stopRequested = false;
        controller._lastSave = 0;

        // 读取页面的 sp_count（总视频数）
        try {
            const sc = document.getElementById('sp_count');
            if (sc) controller.sp_count = parseInt(sc.value || sc.innerText || sc.textContent) || null;
        } catch (e) { controller.sp_count = null; }

        // 如果没拿到 sp_count，尽量从 DOM 推断 video 元素个数
        if (!controller.sp_count) {
            const vids = Array.from(document.querySelectorAll('video[id^="video"]'));
            if (vids.length) {
                controller.sp_count = vids.length;
            }
        }

        if (!controller.sp_count) {
            log('无法确定视频数量 (sp_count)，请确保页面有 sp_count 元素或 video1..videoN 元素。脚本退出。');
            controller.running = false;
            return;
        }

        log('开始自动观看，共', controller.sp_count, '个视频。模式:', CONFIG.mode, '速率:', CONFIG.simulateRate);

        for (let i = 1; i <= controller.sp_count; i++) {
            if (controller.stopRequested) break;
            log('处理第', i, '个视频');
            // 如果页面当前视频索引与目标不同，切换显示（若页面有 hide/show 逻辑）
            try {
                // 隐藏/显示逻辑：调用页面变量 num
                if (typeof window.num !== 'undefined') window.num = i;
                // 尝试触发切换 DOM（如果页面用 #videoN 隐藏/显示）
                const prevs = document.querySelectorAll('[id^="video"]:not(#video'+i+')');
                prevs.forEach(v => { try { v.style.display = 'none'; } catch(e){} });
                const cur = document.getElementById('video' + i);
                if (cur) { try { cur.style.display = ''; } catch(e){} }
            } catch (e) {}

            const ok = await handleVideo(i);
            if (!ok) {
                log('处理视频', i, '返回失败或中断，继续下一个');
            }
            // 小间隔，防止接口限流
            await sleep(300);
        }

        controller.running = false;
        if (!controller.stopRequested) {
            log('所有视频处理完成。');
            alert('AutoWatcher: 已处理完所有视频（或到达脚本检测的总数）。');
        } else {
            log('已停止（用户请求）。');
        }
    }

    /* ====== UI 面板（简易） ====== */
    function createPanel() {
        if (document.getElementById('autowatch-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'autowatch-panel';
        Object.assign(panel.style, {
            position: 'fixed', right: '12px', top: '80px', zIndex: 999999,
            background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '10px', borderRadius: '8px',
            fontSize: '13px', minWidth: '210px', fontFamily: 'Arial, sans-serif'
        });
        panel.innerHTML = `
            <div style="margin-bottom:6px;font-weight:600">AutoWatcher</div>
            <div style="margin-bottom:6px">
                <label>模式:
                    <select id="aw-mode">
                        <option value="skip">skip（跳到结尾）</option>
                        <option value="simulate">simulate（模拟+加速）</option>
                    </select>
                </label>
            </div>
            <div style="margin-bottom:6px">
                <label>加速倍数:
                    <input id="aw-rate" type="number" min="1" value="${CONFIG.simulateRate}" style="width:50px"/>
                </label>
            </div>
            <div style="display:flex;gap:6px">
                <button id="aw-start">开始</button>
                <button id="aw-stop">停止</button>
            </div>
            <div style="margin-top:8px;font-size:12px;color:#ddd">
                当前视频: <span id="aw-cur">-</span><br/>
                总视频数: <span id="aw-total">-</span>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('aw-start').addEventListener('click', () => {
            const m = document.getElementById('aw-mode').value;
            const r = parseFloat(document.getElementById('aw-rate').value) || 1;
            CONFIG.mode = m;
            CONFIG.simulateRate = r;
            document.getElementById('aw-cur').innerText = '-';
            const sc = document.getElementById('sp_count');
            if (sc) document.getElementById('aw-total').innerText = sc.value || sc.textContent || '-';
            runAll();
        });
        document.getElementById('aw-stop').addEventListener('click', () => {
            controller.stopRequested = true;
            controller.running = false;
            document.getElementById('aw-cur').innerText = '停止';
        });

        // 更新面板显示循环
        setInterval(() => {
            if (controller.running) {
                document.getElementById('aw-cur').innerText = controller.current;
            }
            const sc = document.getElementById('sp_count');
            if (sc) document.getElementById('aw-total').innerText = sc.value || sc.textContent || '-';
        }, 600);
    }

    /* ====== 启动 UI ====== */
    try {
        createPanel();
        log('AutoWatcher 已就绪。打开面板选择模式并点击开始。');
    } catch (e) {
        console.error('AutoWatcher 初始化失败', e);
    }

})();

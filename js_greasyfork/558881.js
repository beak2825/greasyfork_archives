// ==UserScript==
// @name         小鹅通-中医健康管理技术刷课（连播修改版）
// @namespace    http://tampermonkey.net/
// @version      2.1.2
// @description  中医健康管理技术刷课：自定义倍速、静音、连续播放
// @author       Rydon & mike-unk feat. Gemini
// @match        *://xjn.ethrss.cn/p/t_pc/course_pc_detail/video/*
// @match        *://xjn.ethrss.cn/p/t_pc/course_pc_detail/camp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ethrss.cn
// @grant        unsafeWindow
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558881/%E5%B0%8F%E9%B9%85%E9%80%9A-%E4%B8%AD%E5%8C%BB%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E6%8A%80%E6%9C%AF%E5%88%B7%E8%AF%BE%EF%BC%88%E8%BF%9E%E6%92%AD%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558881/%E5%B0%8F%E9%B9%85%E9%80%9A-%E4%B8%AD%E5%8C%BB%E5%81%A5%E5%BA%B7%E7%AE%A1%E7%90%86%E6%8A%80%E6%9C%AF%E5%88%B7%E8%AF%BE%EF%BC%88%E8%BF%9E%E6%92%AD%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= CONFIG =================
    const DEFAULT_SPEED = 7.3;
    const STORAGE_KEY_INDEX = 'ethrss_last_chapter_index';
    const STORAGE_KEY_SPEED = 'ethrss_user_speed';
    // ==========================================

    let savedSpeed = parseFloat(localStorage.getItem(STORAGE_KEY_SPEED));
    let currentSpeed = isNaN(savedSpeed) ? DEFAULT_SPEED : savedSpeed;
    const currentURL = window.location.href;

    // =========================================================
    // 🛡️ 核心破解 1：强力拦截 window.open (防止JS弹窗)
    // =========================================================
    try {
        // 保存原始方法，以备不时之需（本脚本逻辑中暂不需要）
        const originalOpen = unsafeWindow.open;

        // 覆盖网页原本的 open 方法
        unsafeWindow.open = function(url, target, features) {
            console.log("【刷课脚本】检测到网页试图打开新窗口，已拦截并强制在本页跳转:", url);

            // 如果 url 存在，直接在本页跳转
            if (url) {
                window.location.href = url;
            }
            // 返回 null，欺骗网页窗口已打开（如果有后续逻辑依赖的话）
            return null;
        };
        console.log("【刷课脚本】Window.open 拦截器已启动。");
    } catch (e) {
        console.error("【刷课脚本】拦截器注入失败:", e);
    }

    // =========================================================
    // 🛡️ 核心破解 2：伪装成永远在前台 (防掉线)
    // =========================================================
    try {
        Object.defineProperty(document, 'hidden', { value: false, writable: false });
        Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });
        window.addEventListener('visibilitychange', evt => evt.stopImmediatePropagation(), true);
        window.addEventListener('blur', evt => evt.stopImmediatePropagation(), true);
    } catch (e) {}

    // =========================================================
    // 🎨 UI：悬浮控制面板
    // =========================================================
    function createPanel() {
        if (document.getElementById('rydon-panel')) return;
        const scriptVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '2.1.3';

        const div = document.createElement('div');
        div.id = 'rydon-panel';
        div.style.cssText = `
            position: fixed; top: 80px; right: 20px; z-index: 99999;
            background: rgba(0,0,0,0.85); color: #fff; padding: 12px;
            border-radius: 8px; font-family: sans-serif; font-size: 14px;
            box-shadow: 0 0 15px rgba(0,0,0,0.6); text-align: center;
            backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1);
        `;

        div.innerHTML = `
            <div style="margin-bottom:8px;font-weight:bold;color:#409eff;font-size:16px;">🚀 极速刷课 v${scriptVersion}</div>
            <div style="margin-bottom:5px;">当前倍速: <span id="disp-speed" style="color:#ffcc00;font-weight:bold;font-size:18px;">${currentSpeed.toFixed(1)}</span>x</div>
            <div style="margin:10px 0;display:flex;justify-content:center;gap:5px;">
                <button id="btn-dec" style="cursor:pointer;padding:5px 10px;font-weight:bold;background:#555;color:white;border:none;border-radius:4px;">-</button>
                <input id="input-speed" type="number" step="0.1" value="${currentSpeed}" style="width:60px;text-align:center;color:black;border-radius:4px;border:none;">
                <button id="btn-inc" style="cursor:pointer;padding:5px 10px;font-weight:bold;background:#555;color:white;border:none;border-radius:4px;">+</button>
            </div>
            <button id="btn-apply" style="cursor:pointer;background:#409eff;color:white;border:none;padding:6px 15px;border-radius:4px;width:100%;">⚡ 应用并保存</button>
        `;
        document.body.appendChild(div);

        const updateDisp = () => {
            document.getElementById('disp-speed').innerText = parseFloat(currentSpeed).toFixed(1);
            document.getElementById('input-speed').value = parseFloat(currentSpeed).toFixed(1);
            localStorage.setItem(STORAGE_KEY_SPEED, currentSpeed);
        };

        document.getElementById('btn-dec').onclick = () => {
            currentSpeed = Math.max(1.0, (parseFloat(currentSpeed) - 0.1).toFixed(1));
            updateDisp();
            applySpeed();
        };
        document.getElementById('btn-inc').onclick = () => {
            currentSpeed = (parseFloat(currentSpeed) + 0.1).toFixed(1);
            updateDisp();
            applySpeed();
        };
        document.getElementById('btn-apply').onclick = () => {
            const val = parseFloat(document.getElementById('input-speed').value);
            if (val > 0) {
                currentSpeed = val;
                updateDisp();
                applySpeed();
            }
        };
    }

    function applySpeed() {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = parseFloat(currentSpeed);
        }
    }

    // =========================================================
    // 场景一：目录页 (连播逻辑)
    // =========================================================
    if (currentURL.includes('/camp/')) {
        let savedIndex = parseInt(localStorage.getItem(STORAGE_KEY_INDEX)) || 0;
        let checkIndex = savedIndex;
        let hasJumped = false;

        localStorage.setItem('course_catalog_url', currentURL);
        setTimeout(createPanel, 800);

        const memoryScan = () => {
            if (hasJumped) return;
            const collapseItems = document.querySelectorAll('.el-collapse-item');
            if (collapseItems.length === 0) return;

            if (checkIndex >= collapseItems.length) {
                checkIndex = 0;
                localStorage.setItem(STORAGE_KEY_INDEX, 0);
            }

            const section = collapseItems[checkIndex];
            const header = section.querySelector('.el-collapse-item__header');
            const isActive = section.classList.contains('is-active');

            if (!isActive && header) { header.click(); return; }

            const contentItems = section.querySelectorAll('.content_item');
            if (contentItems.length > 0 || isActive) {
                for (const item of contentItems) {
                    if (item.querySelector('.lock_img')) continue;
                    const rightDiv = item.querySelector('.content_right');
                    if (rightDiv && rightDiv.innerText.trim() === '100%') continue;
                    if (item.offsetParent === null) return;

                    const titleEl = item.querySelector('.content_title_text');
                    const title = titleEl ? titleEl.innerText : '未知视频';
                    console.log(`【刷课脚本】🎯 命中：[${title}]，正在本页跳转...`);

                    localStorage.setItem(STORAGE_KEY_INDEX, checkIndex);
                    hasJumped = true;
                    clearInterval(scannerTimer);

                    // =================================================
                    // 核心修改 3：暴力移除 target 属性并点击
                    // =================================================

                    // 1. 如果本身是链接
                    if (item.tagName === 'A') {
                        item.removeAttribute('target');
                    }
                    // 2. 如果包含链接
                    const innerLinks = item.querySelectorAll('a');
                    innerLinks.forEach(link => link.removeAttribute('target'));

                    // 3. 点击 (现在 JS 的 open 也被 unsafeWindow 拦截了，HTML 的 target 也被删了)
                    item.click();

                    return;
                }

                if (header) header.click();
                checkIndex++;
                localStorage.setItem(STORAGE_KEY_INDEX, checkIndex);
            }
        };
        const scannerTimer = setInterval(memoryScan, 1500);
    }

    // =========================================================
    // 场景二：视频页 (播放逻辑)
    // =========================================================
    else if (currentURL.includes('/video/')) {
        setTimeout(createPanel, 1000);

        const initVideoPlayer = () => {
            let video = document.querySelector('video');
            if (video) {
                video.muted = true;
                applySpeed();

                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => { video.muted = true; video.play(); });
                }

                video.addEventListener('ratechange', () => {
                    if(Math.abs(video.playbackRate - currentSpeed) > 0.1) {
                        video.playbackRate = currentSpeed;
                    }
                });

                video.addEventListener('pause', () => {
                    if (!video.ended) video.play();
                });

                video.addEventListener('ended', () => {
                    console.log("【刷课脚本】播放结束，返回目录...");
                    const catalogUrl = localStorage.getItem('course_catalog_url') || "https://xjn.ethrss.cn/p/t_pc/course_pc_detail/camp/term_68955d1dc81db_AAnamu";

                    // 强制在本页跳转回目录
                    window.location.href = catalogUrl;
                });
                return true;
            }
            return false;
        };
        const observer = new MutationObserver(() => {
            if (initVideoPlayer()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
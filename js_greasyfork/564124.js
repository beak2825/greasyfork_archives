// ==UserScript==
// @name         雨课堂视频续播
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动开始，精准标题识别，下一单元后自动刷新
// @author       FTP
// @match        *://*.yuketang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564124/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E7%BB%AD%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/564124/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E7%BB%AD%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        INITIAL_DELAY: 10000,      // 页面加载后10秒自动开始
        CHECK_INTERVAL: 30000,   // 每2分钟检查一次
        TARGET_SPEED: 2,
        HUMAN_DELAY: 500,
        NEXT_UNIT_REFRESH_DELAY: 2000  // 下一单元后2秒刷新
    };

    let state = {
        isRunning: false,
        checkTimer: null,
        initialTimer: null,
        isSettingSpeed: false
    };

    function log(msg, type = 'info') {
        const time = new Date().toLocaleTimeString();
        console.log(`[雨课堂V9][${time}] ${msg}`);
        const logArea = document.getElementById('log-area');
        if (logArea) {
            const color = type === 'error' ? '#ff6b6b' : (type === 'success' ? '#51cf66' : '#fff');
            logArea.innerHTML += `<div style="color:${color};font-size:9px;margin:1px 0;line-height:1.2;">${msg}</div>`;
            logArea.scrollTop = logArea.scrollHeight;
        }
    }

    // 模拟人类操作序列
    async function humanLikeClick(element, needMove = false) {
        if (!element) return false;
        try {
            element.scrollIntoView({ behavior: 'instant', block: 'center' });
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2 + (Math.random() * 4 - 2);
            const y = rect.top + rect.height / 2 + (Math.random() * 4 - 2);

            if (needMove) {
                element.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true, cancelable: true, view: window,
                    clientX: x, clientY: y, screenX: x + window.screenX, screenY: y + window.screenY,
                    movementX: Math.random() * 2, movementY: Math.random() * 2
                }));
                await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
            }

            element.dispatchEvent(new MouseEvent('mouseover', {
                bubbles: true, cancelable: true, view: window,
                clientX: x, clientY: y, relatedTarget: element.parentElement
            }));
            await new Promise(r => setTimeout(r, 50));
            element.focus();
            element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            element.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true, cancelable: true, view: window,
                clientX: x, clientY: y, button: 0, buttons: 1, detail: 1
            }));
            await new Promise(r => setTimeout(r, 80 + Math.random() * 50));
            element.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true, cancelable: true, view: window,
                clientX: x, clientY: y, button: 0, buttons: 0, detail: 1
            }));
            element.dispatchEvent(new MouseEvent('click', {
                bubbles: true, cancelable: true, view: window,
                clientX: x, clientY: y, button: 0, buttons: 0, detail: 1
            }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(r => setTimeout(r, 100));
            element.blur();
            element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
            return true;
        } catch (e) {
            log(`点击失败: ${e.message}`, 'error');
            return false;
        }
    }

    // 设置倍速
    async function setSpeed() {
        if (state.isSettingSpeed) return false;
        state.isSettingSpeed = true;
        const targetSpeed = CONFIG.TARGET_SPEED;
        log(`设置倍速 ${targetSpeed}.00X...`);

        try {
            const speedValue = document.querySelector('xt-speedvalue');
            if (speedValue && speedValue.textContent.trim() === `${targetSpeed}.00X`) {
                state.isSettingSpeed = false;
                return true;
            }

            const video = document.querySelector('video');
            if (video && video.paused) {
                await video.play();
                await new Promise(r => setTimeout(r, 500));
            }

            const speedBtn = document.querySelector('xt-speedbutton') || document.querySelector('xt-speedvalue');
            if (!speedBtn) {
                state.isSettingSpeed = false;
                return false;
            }

            await humanLikeClick(speedBtn, true);
            await new Promise(r => setTimeout(r, 800));

            const targetOption = document.querySelector(`li[data-speed="${targetSpeed}"]`);
            if (!targetOption) {
                state.isSettingSpeed = false;
                return false;
            }

            await humanLikeClick(targetOption, false);
            if (video) video.playbackRate = targetSpeed;

            await new Promise(r => setTimeout(r, 500));
            state.isSettingSpeed = false;
            return true;
        } catch (e) {
            log(`设置失败: ${e.message}`, 'error');
            state.isSettingSpeed = false;
            return false;
        }
    }

    async function setSpeedWithRetry(maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            if (await setSpeed()) return true;
            if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 500));
        }
        return false;
    }

    async function playVideo() {
        const video = document.querySelector('video');
        if (video && video.paused) {
            try {
                await video.play();
                return true;
            } catch (e) {
                const playBtn = document.querySelector('.xt_video_bit_play_btn, .xt_video_player_play_btn');
                if (playBtn) await humanLikeClick(playBtn, true);
            }
        }
        return video && !video.paused;
    }

    function checkCompletion() {
        const text = document.body.innerText;
        const match = text.match(/完成度[：:]?\s*(\d+)%/);
        return match ? parseInt(match[1]) : 0;
    }

    // 修改：更精准的标题识别
    function checkTitle() {
        // 方法1：通过iconfont图标识别（最可靠）
        if (document.querySelector('.icon--zuoye')) {
            log('检测到作业图标');
            return true;
        }

        // 方法2：通过标题文本识别
        const titleSpan = document.querySelector('.title .text-ellipsis');
        if (titleSpan) {
            const text = titleSpan.textContent.trim();
            if (text.includes('作业') || text.includes('习题') || text.includes('讨论') || text.includes('推荐资料')) {
                log(`检测到: ${text}`);
                return true;
            }
        }

        return false;
    }

    // 修改：下一单元后2秒刷新页面
    function nextUnit() {
        const btn = Array.from(document.querySelectorAll('span')).find(el =>
            el.textContent.trim() === '下一单元'
        );
        if (btn && btn.offsetParent !== null) {
            humanLikeClick(btn, true);
            log('切换下一单元，2秒后刷新...');

            // 关键修改：2秒后刷新页面
            setTimeout(() => {
                window.location.reload();
            }, CONFIG.NEXT_UNIT_REFRESH_DELAY);
            return true;
        }
        stopScript();
        return false;
    }

    async function mainLogic() {
        if (!state.isRunning) return;

        try {
            if (checkTitle()) {
                nextUnit();
                return;
            }

            const completion = checkCompletion();
            if (completion >= 100) {
                nextUnit();
                return;
            }

            await playVideo();
            await setSpeedWithRetry(3);

            state.checkTimer = setTimeout(mainLogic, CONFIG.CHECK_INTERVAL);
        } catch (e) {
            log(`错误: ${e.message}`, 'error');
            state.checkTimer = setTimeout(mainLogic, CONFIG.CHECK_INTERVAL);
        }
    }

    // 修改：控制面板尺寸限制 5cm x 7cm
    function createPanel() {
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="position:fixed;left:10px;top:50%;transform:translateY(-50%);width:5cm;max-height:7cm;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:8px;padding:8px;z-index:999999;color:white;font-family:Arial;font-size:11px;box-sizing:border-box;overflow:hidden;">
                <div style="font-weight:bold;text-align:center;margin-bottom:4px;">📚 雨课堂助手</div>
                <div id="status-label" style="background:rgba(255,255,255,0.2);padding:5px;border-radius:12px;text-align:center;margin-bottom:6px;font-size:11px;">状态: 等待中</div>
                <div style="display:flex;gap:5px;margin-bottom:6px;">
                    <button id="start-btn" style="flex:1;padding:5px;background:#4CAF50;border:none;border-radius:4px;color:white;cursor:pointer;font-size:10px;">▶ 开始</button>
                    <button id="stop-btn" style="flex:1;padding:5px;background:#f44336;border:none;border-radius:4px;color:white;cursor:pointer;font-size:10px;">⏹ 停止</button>
                </div>
                <div id="log-area" style="height:50px;background:rgba(0,0,0,0.3);border-radius:4px;padding:3px;font-size:9px;overflow-y:auto;"></div>
            </div>
        `;
        document.body.appendChild(div);

        document.getElementById('start-btn').onclick = startScript;
        document.getElementById('stop-btn').onclick = stopScript;
    }

    function startScript() {
        if (state.isRunning) return;
        state.isRunning = true;
        document.getElementById('status-label').textContent = '状态: 运行中';
        document.getElementById('status-label').style.background = 'rgba(76,175,80,0.6)';
        log('脚本已启动');
        mainLogic();
    }

    function stopScript() {
        state.isRunning = false;
        if (state.checkTimer) clearTimeout(state.checkTimer);
        if (state.initialTimer) clearTimeout(state.initialTimer);
        document.getElementById('status-label').textContent = '状态: 已停止';
        document.getElementById('status-label').style.background = 'rgba(255,255,255,0.2)';
        log('脚本已停止');
    }

    // 修改：页面加载后自动开始
    function init() {
        createPanel();
        log('10秒后自动开始...');
        state.initialTimer = setTimeout(startScript, CONFIG.INITIAL_DELAY);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
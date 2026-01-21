// ==UserScript==
// @name         ZNDS 自动摸鱼助手
// @namespace    https://github.com/li5bo5
// @version      1.0
// @description  自动获取摸鱼经验
// @author       li5bo5 & Gemini3.0
// @match        https://www.znds.com/plugin.php?id=muanyun_053*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563425/ZNDS%20%E8%87%AA%E5%8A%A8%E6%91%B8%E9%B1%BC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563425/ZNDS%20%E8%87%AA%E5%8A%A8%E6%91%B8%E9%B1%BC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置参数 ---
    const CONFIG = {
        minSec: 545, // 9分05秒
        maxSec: 570, // 9分30秒
        checkInterval: 3000, // 3秒检查一次
        maxLogCount: 20 // 记录最近 20 条执行记录
    };

    // --- 2. 状态管理 ---
    let state = {
        startTime: sessionStorage.getItem('realStartTime') || null,
        targetSec: sessionStorage.getItem('targetSeconds') || null,
        logs: JSON.parse(sessionStorage.getItem('moYuLogs')) || ["脚本已就绪：9分钟随机结算模式"]
    };

    // 添加日志逻辑
    function addLog(msg) {
        const now = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        state.logs.unshift(`[${now}] ${msg}`);
        // 限制记录条数为 20 条
        if (state.logs.length > CONFIG.maxLogCount) state.logs.pop();
        sessionStorage.setItem('moYuLogs', JSON.stringify(state.logs));
        updateUI();
    }

    // 生成随机目标结算时间
    function generateRandomTarget() {
        const target = Math.floor(Math.random() * (CONFIG.maxSec - CONFIG.minSec + 1)) + CONFIG.minSec;
        sessionStorage.setItem('targetSeconds', target);
        state.targetSec = target;
        return target;
    }

    // --- 3. UI 界面构建 ---
    function createUI() {
        if (document.getElementById('mo-yu-dashboard')) return;
        const div = document.createElement('div');
        div.id = 'mo-yu-dashboard';
        // 悬浮窗样式
        div.style = `position:fixed;top:80px;right:20px;width:240px;background:#fff;border:1px solid #dcdfe6;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10001;font-family:sans-serif;`;
        div.innerHTML = `
            <div style="background:#409eff;color:#fff;padding:8px 12px;font-size:14px;font-weight:bold;border-radius:8px 8px 0 0;text-align:center;">
                ZNDS 自动摸鱼助手
            </div>
            <div style="padding:12px;">
                <div style="text-align:center;margin-bottom:10px;">
                    <div id="mo-yu-timer" style="font-size:24px;font-weight:bold;color:#409eff;">--:--</div>
                    <div id="mo-yu-target-hint" style="font-size:11px;color:#909399;">正在计算目标时间...</div>
                </div>
                <div id="mo-yu-logs" style="font-size:11px;color:#606266;line-height:1.5;border-top:1px solid #eee;padding-top:8px;max-height:360px;overflow-y:auto;">
                </div>
            </div>`;
        document.documentElement.appendChild(div);
    }

    function updateUI() {
        const logEl = document.getElementById('mo-yu-logs');
        if (logEl) {
            logEl.innerHTML = state.logs.map(l => `<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-bottom:1px dashed #eee;padding:2px 0;">${l}</div>`).join('');
        }

        const hintEl = document.getElementById('mo-yu-target-hint');
        if (hintEl && state.targetSec) {
            hintEl.innerText = `随机目标：${Math.floor(state.targetSec/60)}分${state.targetSec%60}秒结算`;
        }
    }

    // --- 4. 核心自动化逻辑 ---
    function checkLogic() {
        // 查找按钮元素
        const startBtn = document.querySelector('.muanyun-053-btn-primary') ||
                        Array.from(document.querySelectorAll('.muanyun-053-btn')).find(el => el.innerText.includes('开始摸鱼'));
        const stopBtn = document.querySelector('.muanyun-053-btn-warning') ||
                       Array.from(document.querySelectorAll('.muanyun-053-btn')).find(el => el.innerText.includes('停止摸鱼'));
        const isFishing = document.body.innerText.includes("正在摸鱼中");

        // 同步逻辑：解决中途进入或刷新页面的计时同步
        if (isFishing && !state.startTime) {
            const timerDisplay = document.getElementById('fishing-timer');
            if (timerDisplay) {
                const text = timerDisplay.innerText.split(':');
                const elapsedSeconds = (parseInt(text[0]) * 60) + (parseInt(text[1]) || 0);
                // 使用 Date.now() 确保后台运行不卡死
                state.startTime = (Date.now() - (elapsedSeconds * 1000)).toString();
                sessionStorage.setItem('realStartTime', state.startTime);
                if (!state.targetSec) generateRandomTarget();
                addLog("已与系统时钟同步计时");
            }
        }

        // 判定结算：达到随机设定的 9 分多钟时间点
        if (state.startTime && isFishing) {
            const elapsed = Math.floor((Date.now() - parseInt(state.startTime)) / 1000);
            const currentTarget = parseInt(state.targetSec) || generateRandomTarget();

            // 更新 UI 倒计时
            const m = Math.floor(elapsed / 60);
            const s = elapsed % 60;
            const timerEl = document.getElementById('mo-yu-timer');
            if (timerEl) timerEl.innerText = `${m}:${s < 10 ? '0' + s : s}`;

            // 执行结算动作
            if (elapsed >= currentTarget && stopBtn) {
                addLog(`已达随机目标 (${currentTarget}s)，正在结算奖励...`);
                sessionStorage.removeItem('realStartTime');
                sessionStorage.removeItem('targetSeconds');
                stopBtn.closest('form')?.submit() || stopBtn.click();
                return;
            }

            // 安全机制：防止标签页因某些原因长时间卡住不结算
            if (elapsed > 720) {
                addLog("检测到逻辑超时，执行页面刷新...");
                location.reload();
            }
        }

        // 判定开始：页面出现开始按钮且未在摸鱼中
        if (startBtn && !isFishing) {
            addLog(">> 开启新一轮摸鱼任务");
            state.startTime = Date.now().toString();
            sessionStorage.setItem('realStartTime', state.startTime);
            generateRandomTarget();
            startBtn.click();
        }
    }

    // --- 5. 启动 ---
    window.addEventListener('load', () => {
        createUI();
        updateUI();
        // 设置循环检查
        setInterval(checkLogic, CONFIG.checkInterval);
    });

    // 冗余保护：拦截 10 分钟到期的原始弹窗
    window.alert = function() { return true; };

})();
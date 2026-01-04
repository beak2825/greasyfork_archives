// ==UserScript==
// @name         中国版权保护中心 自动提交（防封版）
// @namespace    https://ccopyright.com.cn/
// @version      1.0.0
// @description  自动提交软著盖章材料，带随机间隔和失败退避，尽量降低封IP风险
// @author       weimin
// @match        *://*.ccopyright.com.cn/*
// @match        *://ccopyright.com.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557050/%E4%B8%AD%E5%9B%BD%E7%89%88%E6%9D%83%E4%BF%9D%E6%8A%A4%E4%B8%AD%E5%BF%83%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%EF%BC%88%E9%98%B2%E5%B0%81%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557050/%E4%B8%AD%E5%9B%BD%E7%89%88%E6%9D%83%E4%BF%9D%E6%8A%A4%E4%B8%AD%E5%BF%83%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%EF%BC%88%E9%98%B2%E5%B0%81%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 基础间隔 & 随机(防封)
    const BASE_INTERVAL_MS = 5000;      // 基准 5 秒
    const RANDOM_EXTRA_MS = 5000;       // 额外 0~5 秒 → 总体 5~10 秒之间
    const MAX_ATTEMPTS = 999;           // 最大尝试次数，防止忘记关

    let intervalTimer = null;
    let attemptCount = 0;
    let stopped = true;

    const nowStr = () => new Date().toLocaleTimeString();
    const log = (...a) => console.log('[软著自动提交]', `[${nowStr()}]`, ...a);
    const err = (...a) => console.error('[软著自动提交]', `[${nowStr()}]`, ...a);

    function getWebUserInfo() {
        try {
            const str = localStorage.getItem('webUserInfo');
            if (!str) return null;
            return JSON.parse(str);
        } catch (e) {
            err('解析 webUserInfo 失败:', e);
            return null;
        }
    }

    // 单次尝试
    async function trySubmit(config) {
        if (stopped) {
            log('已停止，不再提交。');
            return;
        }
        if (attemptCount >= MAX_ATTEMPTS) {
            log(`达到最大尝试次数 ${MAX_ATTEMPTS}，自动停止。`);
            stopAuto();
            return;
        }

        attemptCount++;
        const { url, headers, requestData } = config;
        const statusEl = document.getElementById('soft-auto-submit-status');

        log(`第 ${attemptCount} 次尝试提交...`);
        if (statusEl) {
            statusEl.textContent = `状态：第 ${attemptCount} 次尝试提交...`;
        }

        try {
            const resp = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(requestData)
            });

            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status}`);
            }

            const data = await resp.json().catch(() => ({}));
            const msg = data.message || data.msg || '';
            const code = data.returnCode || data.code || '';

            log(`第 ${attemptCount} 次返回: msg="${msg}" returnCode="${code}"`);
            if (statusEl) {
                statusEl.textContent = `状态：第 ${attemptCount} 次返回：${msg || '无'} (code=${code || '-'})`;
            }


            if (code && code !== 'FAILED') {
                log('✅ 提交成功！停止轮询。返回数据:', data);
                if (statusEl) statusEl.textContent = '状态：成功！已停止';
                stopAuto();
                return;
            }

            // 针对 authorization_token 的报错，直接提示并停掉
            if (msg.toLowerCase().includes('authorization_token is change'.toLowerCase())) {
                if (statusEl) {
                    statusEl.textContent = '状态：token 已变更或多设备登录，需在本机重新登录后再试（已停止）。';
                }
                log('检测到 authorization_token 相关错误，自动停止。');
                stopAuto();
                return;
            }

        } catch (e) {
            err(`第 ${attemptCount} 次请求异常:`, e);
            if (statusEl) {
                statusEl.textContent = `状态：第 ${attemptCount} 次请求异常：${e}`;
            }
        }
    }

    function startAuto(inputCode) {
        const webUserInfo = getWebUserInfo();
        if (!webUserInfo) {
            alert('未找到 webUserInfo，请先在官网正常登录一次。');
            err('未找到 webUserInfo');
            return;
        }

        const userId = webUserInfo.id;
        if (!userId) {
            alert('webUserInfo 中无 id 字段，确认是否已正确登录。');
            err('未找到用户ID');
            return;
        }

        if (!inputCode) {
            alert('请先填写登记编号');
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            'authorization': webUserInfo.authorization_token,
            'authorization_key': webUserInfo.authorization_key,
            'authorization_token': webUserInfo.authorization_token,
            'device': 'pc'
        };

        const url = `https://gateway.ccopyright.com.cn/registerQuerySoftServer/userCenter/submitSealMaterial/${userId}/${inputCode}`;
        const requestData = {};

        // 清理旧的
        stopAuto();
        attemptCount = 0;
        stopped = false;

        log('开始自动提交，编号:', inputCode);
        log('轮询间隔：5~10 秒随机');

        const statusEl = document.getElementById('soft-auto-submit-status');
        if (statusEl) statusEl.textContent = '状态：运行中…';

        // 用 setInterval + 每次随机延迟的 trick：每轮内再包一层 setTimeout
        intervalTimer = setInterval(() => {
            const randomDelay = Math.random() * RANDOM_EXTRA_MS; // 0~5000
            setTimeout(() => {
                if (!stopped) {
                    trySubmit({ url, headers, requestData });
                }
            }, randomDelay);
        }, BASE_INTERVAL_MS);
    }

    function stopAuto() {
        stopped = true;
        if (intervalTimer) {
            clearInterval(intervalTimer);
            intervalTimer = null;
        }
        const statusEl = document.getElementById('soft-auto-submit-status');
        if (statusEl && !statusEl.textContent.includes('成功')) {
            statusEl.textContent = '状态：已停止';
        }
        log('已停止自动提交。');
    }

    // ---- UI 面板 ----
    function createPanel() {
        if (document.getElementById('soft-auto-submit-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'soft-auto-submit-panel';
        panel.style.position = 'fixed';
        panel.style.right = '10px';
        panel.style.bottom = '10px';
        panel.style.zIndex = '999999';
        panel.style.background = 'rgba(0,0,0,0.75)';
        panel.style.color = '#fff';
        panel.style.padding = '8px 10px';
        panel.style.borderRadius = '6px';
        panel.style.fontSize = '12px';
        panel.style.fontFamily = 'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.35)';
        panel.style.minWidth = '220px';

        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:4px;">软著自动提交（防封）</div>
            <div style="margin-bottom:4px;">
                <label>
                    登记编号：
                    <input id="soft-auto-submit-code" type="text"
                           style="width:150px;font-size:12px;padding:2px 4px;border-radius:3px;border:1px solid #ccc;">
                </label>
            </div>
            <div style="margin-bottom:4px;">
                <button id="soft-auto-submit-start" style="font-size:12px;padding:2px 6px;margin-right:4px;cursor:pointer;">开始</button>
                <button id="soft-auto-submit-stop" style="font-size:12px;padding:2px 6px;cursor:pointer;">停止</button>
            </div>
            <div id="soft-auto-submit-status" style="font-size:11px;color:#ddd;">状态：未启动</div>
        `;
        document.body.appendChild(panel);

        const input = document.getElementById('soft-auto-submit-code');
        const btnStart = document.getElementById('soft-auto-submit-start');
        const btnStop = document.getElementById('soft-auto-submit-stop');
        const status = document.getElementById('soft-auto-submit-status');

        btnStart.addEventListener('click', () => {
            const code = input.value.trim();
            if (!code) {
                alert('请先在输入框中填写登记编号');
                return;
            }
            status.textContent = '状态：运行中…';
            startAuto(code);
        });

        btnStop.addEventListener('click', () => {
            stopAuto();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') btnStart.click();
        });

        log('控制面板已注入');
    }

    function init() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createPanel();
        } else {
            window.addEventListener('DOMContentLoaded', createPanel);
        }

        // 暴露给控制台手动调试
        window.softSubmit = {
            start: startAuto,
            stop: stopAuto
        };

        log('脚本已加载，当前页面：', location.href);
    }

    init();
})();

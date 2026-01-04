// ==UserScript==
// @name         刷问卷星脚本（信效度版）
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  自动解析问卷，支持设置选项百分比，一键随机填写，QQ群：1029241274
// @author       NewB666
// @match        *://www.wjx.cn/*
// @match        *://v.wjx.cn/*
// @match        *://ks.wjx.top/*
// @match        *://*.wjx.cn/*
// @match        *://*.wjx.top/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559684/%E5%88%B7%E9%97%AE%E5%8D%B7%E6%98%9F%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BF%A1%E6%95%88%E5%BA%A6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559684/%E5%88%B7%E9%97%AE%E5%8D%B7%E6%98%9F%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BF%A1%E6%95%88%E5%BA%A6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[星球问卷助手] 脚本开始加载...');

    let helperSettings;

    function isInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    async function fillSurveyByMode() {
        const mode = (helperSettings && helperSettings.answerMode) ? helperSettings.answerMode : 'human';
        if (mode === 'instant') {
            fillSurveyInstantAll();
            return;
        }
        await fillSurveyHuman();
    }

    function getPrefillWaitSec() {
        const mode = (helperSettings && helperSettings.answerMode) ? helperSettings.answerMode : 'human';
        if (mode === 'instant') {
            return randomIntInclusive(1, 2);
        }
        const min = Number(helperSettings && helperSettings.timeMinSec) || 0;
        const max = Number(helperSettings && helperSettings.timeMaxSec) || 0;
        const a = Math.min(min, max);
        const b = Math.max(min, max);
        return (b <= 0) ? 0 : randomIntInclusive(a, b);
    }

    // ========== 计数与自动循环模块 ==========
    const COUNT_KEY = 'wjx_submit_count';
    const AUTO_MODE_KEY = 'wjx_auto_mode';
    const TARGET_URL_KEY = 'wjx_target_url';
    const TARGET_COUNT_KEY = 'wjx_target_count';
    const UNLOCKED_KEY = 'wjx_auto_loop_unlocked';
    const DEVICE_ID_KEY = 'wjx_auto_loop_device_id';

    const AUTO_LOOP_LIMIT_WHEN_LOCKED = parseInt(atob('MjA='), 10);
    const AUTO_LOOP_UNLOCK_KEY = atob('bml1Ymk2NjY=');

    // GM存储兼容层（如果GM API不可用则降级到localStorage）
    const storage = {
        get: (key, def) => {
            // 优先读 localStorage（同步且无缓存），再 fallback 到 GM
            try {
                const v = localStorage.getItem(key);
                if (v !== null) return JSON.parse(v);
            } catch (e) {}
            try {
                if (typeof GM_getValue === 'function') return GM_getValue(key, def);
            } catch (e) {}
            return def;
        },
        set: (key, val) => {
            // 双写：localStorage + GM
            try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
            try {
                if (typeof GM_setValue === 'function') { GM_setValue(key, val); }
            } catch (e) {}
        },
        del: (key) => {
            // 双删：localStorage + GM
            try { localStorage.removeItem(key); } catch (e) {}
            try {
                if (typeof GM_deleteValue === 'function') { GM_deleteValue(key); }
            } catch (e) {}
        }
    };

    function getSubmitCount() { return storage.get(COUNT_KEY, 0); }
    function setSubmitCount(n) { storage.set(COUNT_KEY, n); }
    function incrementCount() { const c = getSubmitCount() + 1; setSubmitCount(c); return c; }
    function resetCount() { storage.del(COUNT_KEY); setSubmitCount(0); }

    function isAutoMode() { return !!storage.get(AUTO_MODE_KEY, false); }
    function setAutoMode(on) { storage.set(AUTO_MODE_KEY, !!on); }

    function getTargetUrl() { return storage.get(TARGET_URL_KEY, ''); }
    function setTargetUrl(url) { storage.set(TARGET_URL_KEY, url); }

    function getTargetCount() { return storage.get(TARGET_COUNT_KEY, 0); }
    function setTargetCount(n) { storage.set(TARGET_COUNT_KEY, n); }

    function isAutoLoopUnlocked() { return !!storage.get(UNLOCKED_KEY, false); }
    function setAutoLoopUnlocked(on) { storage.set(UNLOCKED_KEY, !!on); }

    function getOrCreateAutoLoopDeviceId() {
        let id = '';
        try { id = String(storage.get(DEVICE_ID_KEY, '') || ''); } catch (e) { id = ''; }
        if (id) return id;
        const rnd = () => Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0');
        id = `${rnd()}${rnd()}`;
        storage.set(DEVICE_ID_KEY, id);
        return id;
    }

    function getExpectedAutoLoopKey(deviceId) {
        return normalizeKeyInput(AUTO_LOOP_UNLOCK_KEY);
    }

    function normalizeKeyInput(s) {
        return String(s || '').trim().replace(/\s+/g, '').toUpperCase();
    }

    // 检测是否在成功页（提交成功后的页面）
    function isSuccessPage() {
        const url = location.href.toLowerCase();
        const successUrlPatterns = ['/vm/', '/complete', 'completemobile', 'finish', 'success'];
        const urlMatch = successUrlPatterns.some(p => url.includes(p));

        const bodyText = document.body ? document.body.innerText : '';
        const successTextPatterns = ['感谢', '提交成功', '答题完成', '问卷已提交', '提交完成', '谢谢参与', '感谢您的参与', '已成功提交'];
        const textMatch = successTextPatterns.some(p => bodyText.includes(p));

        // 提交后“领取/福利”落地页（常见：提交表单 → 提取福利/去领取）
        const rewardTextPatterns = ['提交表单', '提取福利', '去领取', '领取福利', '抽奖', '领取', '小礼物', '为您准备了'];
        const rewardTextMatch = rewardTextPatterns.some(p => bodyText.includes(p));

        const stepLike = !!document.querySelector('.step, .steps, .step-item, [class*="step"], [class*="Steps"], [class*="steps"]');
        const rewardBtn = Array.from(document.querySelectorAll('a, button, div')).some(el => {
            const t = (el.textContent || '').trim();
            return t === '去领取' || t === '领取' || t.includes('领取') || t.includes('抽奖');
        });

        const hasSuccessIcon = !!document.querySelector('.icon-success, .success-icon, .complete-icon, .finish-icon, [class*="success"], [class*="complete"]');

        const rewardLandingMatch = rewardTextMatch && (stepLike || rewardBtn);

        return (urlMatch && textMatch) || (textMatch && hasSuccessIcon) || (urlMatch && hasSuccessIcon) || rewardLandingMatch;
    }

    // 检测并自动点击阿里云验证码
    let captchaToastAt = 0;
    let captchaManualHintAt = 0;
    let captchaFailHintAt = 0;

    function isCaptchaFailedState() {
        const popup = document.querySelector('#aliyunCaptcha-window-popup.window-show');
        if (!popup) return false;
        const t = (popup.textContent || '').trim();
        return t.includes('验证失败') && (t.includes('刷新') || t.includes('重试'));
    }

    function isCaptchaVisible() {
        const popup = document.querySelector('#aliyunCaptcha-window-popup.window-show');
        const mask = document.querySelector('#aliyunCaptcha-mask.mask-show');
        if (!popup && !mask) return false;

        const isShown = (el) => {
            if (!el) return false;
            const style = el.style || {};
            if (style.display && style.display.toLowerCase() === 'none') return false;
            return true;
        };

        return isShown(popup) || isShown(mask);
    }

    let captchaClicking = false;

    function scheduleHumanClick(el) {
        if (!el) return;
        if (captchaClicking) return;
        captchaClicking = true;
        (async () => {
            try {
                await humanClick(el);
            } finally {
                captchaClicking = false;
            }
        })();
    }

    function checkAndClickCaptcha() {
        // 检测阿里云验证码弹窗
        const captchaPopup = document.querySelector('#aliyunCaptcha-window-popup.window-show');
        const captchaMask = document.querySelector('#aliyunCaptcha-mask.mask-show');
        if ((!captchaPopup || captchaPopup.style.display === 'none') && (!captchaMask || captchaMask.style.display === 'none')) return false;

        if (isCaptchaFailedState()) {
            const now = Date.now();
            if (now - captchaFailHintAt > 6000) {
                captchaFailHintAt = now;
                showToastGlobal('❌ 验证码提示“验证失败，请刷新重试”。请手动刷新页面后再继续。');
            }
            return true;
        }

        const now = Date.now();
        if (now - captchaToastAt > 3500) {
            captchaToastAt = now;
            showToastGlobal('⚠️ 检测到验证码，正在尝试自动点击验证...');
        }

        // 查找验证码点击区域（尽量点击“开始智能验证”的可交互区域）
        const captchaIcon = document.querySelector('#aliyunCaptcha-checkbox-icon');
        const captchaBody = document.querySelector('#aliyunCaptcha-checkbox-body');
        const captchaLeft = document.querySelector('#aliyunCaptcha-checkbox-left');
        const captchaWrapper = document.querySelector('#aliyunCaptcha-checkbox-wrapper');

        const clickTarget = captchaIcon || captchaLeft || captchaBody || captchaWrapper;
        if (clickTarget && clickTarget.offsetParent !== null) {
            console.log('[星球问卷助手] 检测到阿里云验证码，自动点击...');
            
            // 模拟真实鼠标点击
            const rect = clickTarget.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            scheduleHumanClick(clickTarget);

            return true;
        }
        return true;
    }

    async function waitForCaptchaClear(maxWaitMs) {
        const startedAt = Date.now();
        const limit = typeof maxWaitMs === 'number' ? maxWaitMs : 20000;

        if (isCaptchaFailedState()) {
            showToastGlobal('❌ 验证码验证失败：请先手动刷新页面后重试（脚本无法模拟可信手势绕过）。');
            return false;
        }

        // A类：通常需要真人点一次“开始智能验证”，脚本事件可能不被接受
        if (isCaptchaVisible()) {
            const now = Date.now();
            if (now - captchaManualHintAt > 6000) {
                captchaManualHintAt = now;
                showToastGlobal('🧩 检测到验证码：需要你用鼠标手动点击一次验证码里的“开始智能验证”，通过后脚本会继续…');
            }
        }
        while (Date.now() - startedAt < limit) {
            if (!isCaptchaVisible()) return true;

            if (isCaptchaFailedState()) {
                showToastGlobal('❌ 验证码验证失败：请手动刷新页面后重试。');
                return false;
            }

            checkAndClickCaptcha();
            await new Promise(r => setTimeout(r, 500));
        }
        if (isCaptchaVisible()) {
            showToastGlobal('🧩 验证码还未通过：请先手动点一次“开始智能验证”。');
            return false;
        }
        return true;
    }

    // 定时检测验证码（每秒检查一次）
    function startCaptchaWatcher() {
        setInterval(() => {
            checkAndClickCaptcha();
        }, 1000);
    }

    let securityResubmitAttempts = 0;

    function isVisible(el) {
        if (!el) return false;
        return el.offsetParent !== null;
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function getElementCenter(el) {
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function dispatchMouseMove(x, y) {
        try {
            const ev = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
            document.dispatchEvent(ev);
        } catch (e) {}
        try {
            if (typeof PointerEvent === 'function') {
                const pev = new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'mouse' });
                document.dispatchEvent(pev);
            }
        } catch (e) {}
    }

    async function humanMoveTo(el) {
        if (!el) return;
        let target;
        try {
            el.scrollIntoView({ block: 'center', inline: 'center' });
            await sleep(80 + Math.random() * 120);
            target = getElementCenter(el);
        } catch (e) {
            return;
        }

        const startX = target.x + (Math.random() * 30 - 15);
        const startY = target.y + (Math.random() * 30 - 15);
        const endX = target.x + (Math.random() * 10 - 5);
        const endY = target.y + (Math.random() * 10 - 5);

        const steps = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = startX + (endX - startX) * t + Math.sin(t * Math.PI) * (Math.random() * 6 - 3);
            const y = startY + (endY - startY) * t + Math.cos(t * Math.PI) * (Math.random() * 6 - 3);
            dispatchMouseMove(x, y);
            await sleep(18 + Math.random() * 35);
        }
    }

    async function humanClick(el) {
        if (!el) return false;
        await humanMoveTo(el);
        const { x, y } = getElementCenter(el);

        const mkMouse = (type) => {
            try { return new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }); } catch (e) { return null; }
        };
        const md = mkMouse('mousedown');
        const mu = mkMouse('mouseup');
        const ck = mkMouse('click');

        try { el.focus && el.focus(); } catch (e) {}
        try { if (md) el.dispatchEvent(md); } catch (e) {}
        await sleep(40 + Math.random() * 90);
        try { if (mu) el.dispatchEvent(mu); } catch (e) {}
        try { if (ck) el.dispatchEvent(ck); } catch (e) {}
        try { el.click(); } catch (e) {}
        return true;
    }

    function clickPrimarySubmitButton() {
        // 以用户提供的真实提交按钮为准，优先点击 #SubmitBtnGroup #ctlNext
        const btn = document.querySelector('#SubmitBtnGroup #ctlNext') || document.querySelector('#ctlNext');
        if (btn && isVisible(btn)) {
            console.log('[星球问卷助手] 点击提交按钮(#ctlNext)');
            btn.click();
            return true;
        }
        return false;
    }

    function startSecurityDialogWatcher() {
        const startedAt = Date.now();
        const timer = setInterval(() => {
            if (Date.now() - startedAt > 15000) {
                clearInterval(timer);
                return;
            }

            const dialog = document.querySelector('.layui-layer.layui-layer-dialog');
            if (!dialog || dialog.style.display === 'none') return;

            const content = dialog.querySelector('.layui-layer-content');
            const text = content ? (content.textContent || '') : '';
            if (!text.includes('需要安全校验') && !text.includes('重新提交')) return;

            if (securityResubmitAttempts >= 3) {
                clearInterval(timer);
                return;
            }

            securityResubmitAttempts += 1;
            console.log('[星球问卷助手] 检测到安全校验弹窗，自动确认并重提，第', securityResubmitAttempts, '次');

            const okBtn = dialog.querySelector('.layui-layer-btn0');
            if (okBtn && isVisible(okBtn)) {
                okBtn.click();
            }

            clearInterval(timer);

            const delay = 600 + Math.random() * 600;
            setTimeout(() => {
                const clicked = clickPrimarySubmitButton();
                if (clicked) {
                    // 继续监听，避免再次弹出
                    startSecurityDialogWatcher();
                }
            }, delay);
        }, 400);
    }

    function startResumeAnswerDialogWatcher() {
        const startedAt = Date.now();
        const timer = setInterval(() => {
            if (Date.now() - startedAt > 12000) {
                clearInterval(timer);
                return;
            }

            const dialog = document.querySelector('.layui-layer.layui-layer-dialog');
            if (!dialog || dialog.style.display === 'none') return;

            const content = dialog.querySelector('.layui-layer-content');
            const text = content ? (content.textContent || '') : '';
            if (!text.includes('已经回答了部分题目') || !text.includes('是否继续')) return;

            const cancelBtn = dialog.querySelector('.layui-layer-btn1');
            if (cancelBtn && isVisible(cancelBtn)) {
                console.log('[星球问卷助手] 检测到继续上次回答提示，自动取消');
                humanClick(cancelBtn).catch(() => {
                    try { cancelBtn.click(); } catch (e) {}
                });
                clearInterval(timer);
            }
        }, 400);
    }

    const IFRAME_ACTION_TYPE = 'WJX_HELPER_ACTION';
    const IFRAME_SUCCESS_TYPE = 'WJX_HELPER_SUCCESS';
    const IFRAME_READY_TYPE = 'WJX_HELPER_READY';

    async function runOnceFillAndMaybeSubmit(opts) {
        if (!isSurveyQuestionPage()) return;
        startResumeAnswerDialogWatcher();

        const waitSec = getPrefillWaitSec();
        if (waitSec > 0) {
            try { showToastGlobal(`⏳ ${waitSec}s 后开始填写...`); } catch (e) {}
            await new Promise(r => setTimeout(r, waitSec * 1000));
        }

        const captchaOk = await waitForCaptchaClear(25000);
        if (!captchaOk) return;
        parseSurvey();
        await fillSurveyByMode();
        if (opts && opts.submit) {
            const submitDelay = 900 + Math.random() * 900;
            setTimeout(() => {
                autoSubmit();
            }, submitDelay);
        }
    }

    function setupIframeMessageListener() {
        window.addEventListener('message', (evt) => {
            const data = evt && evt.data;
            if (!data || typeof data !== 'object') return;
            if (data.type === IFRAME_ACTION_TYPE) {
                const action = data.action;
                if (action === 'RUN_ONCE') {
                    runOnceFillAndMaybeSubmit(data.options || {}).catch(() => {});
                }
            }
        });

        if (isInIframe()) {
            try {
                window.parent && window.parent.postMessage({ type: IFRAME_READY_TYPE }, '*');
            } catch (e) {}
        }
    }

    function openSurveyModal(url, options) {
        const existing = document.getElementById('wjx-survey-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'wjx-survey-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            pointer-events: none;
        `;

        const modal = document.createElement('div');
        modal.id = 'wjx-survey-modal';
        modal.style.cssText = `
            width: min(960px, 96vw);
            height: min(88vh, 900px);
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(0,0,0,0.28);
            display: flex;
            flex-direction: column;
            pointer-events: auto;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
        `;
        header.innerHTML = `<span>星球问卷助手 - 弹窗填写</span>`;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: #fff;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
            opacity: 0.9;
        `;
        let sendTimer = null;

        const cleanup = () => {
            try { if (sendTimer) clearInterval(sendTimer); } catch (e) {}
            try { window.removeEventListener('message', onMsg); } catch (e) {}
            try { overlay.remove(); } catch (e) {}
        };
        closeBtn.onclick = cleanup;
        header.appendChild(closeBtn);

        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: #fff;
        `;
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.src = url;

        const hint = document.createElement('div');
        hint.style.cssText = `
            padding: 8px 12px;
            background: #fff3cd;
            color: #856404;
            font-size: 12px;
            border-bottom: 1px solid rgba(0,0,0,0.06);
        `;
        hint.textContent = '如果弹窗里显示空白/被拦截，说明该问卷站点禁止被iframe嵌入（CSP/X-Frame-Options限制）。';

        modal.appendChild(header);
        modal.appendChild(hint);
        modal.appendChild(iframe);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const opts = options || {};
        const modalUrl = url;
        const delayMs = Number(opts.delayMs) || 0;
        const startAt = Date.now() + Math.max(0, delayMs);

        const trySendAction = () => {
            try {
                if (Date.now() < startAt) return false;
                if (!iframe.contentWindow) return false;
                iframe.contentWindow.postMessage({
                    type: IFRAME_ACTION_TYPE,
                    action: 'RUN_ONCE',
                    options: { submit: !!opts.submit }
                }, '*');
                return true;
            } catch (e) {
                return false;
            }
        };

        let attempts = 0;
        sendTimer = setInterval(() => {
            attempts += 1;
            trySendAction();
            if (attempts >= 12) clearInterval(sendTimer);
        }, 500);

        iframe.addEventListener('load', () => {
            attempts = 0;
        });

        function onMsg(evt) {
            const data = evt && evt.data;
            if (!data || typeof data !== 'object') return;
            if (data.type === IFRAME_SUCCESS_TYPE) {
                const countDisplay = document.getElementById('wjx-count-display');
                if (countDisplay) countDisplay.textContent = String(getSubmitCount());

                if (opts.autoCloseOnSuccess) {
                    cleanup();
                }
            }
        }

        window.addEventListener('message', onMsg);

        closeBtn.onclick = () => {
            cleanup();
        };
    }

    // 自动点击提交按钮
    function autoSubmit() {
        // 提交前同步一次（解决 UI 勾选但校验认为未选）
        syncWjxCheckboxUiToInput();

        const submitSelectors = [
            '#SubmitBtnGroup #ctlNext',
            '#submit_button',
            '#ctlNext',
            '.submitbtn',
            'a.submitbtn',
            'input[type="submit"]',
            'button[type="submit"]',
            '.btn-submit',
            '#btnNext',
            '.button-submit',
            'a[onclick*="submit"]',
            'a[onclick*="Submit"]',
            '.mainbtn',
            '#divSubmit a',
            '#divSubmit input'
        ];

        for (const sel of submitSelectors) {
            const btn = document.querySelector(sel);
            if (btn && isVisible(btn)) {
                console.log('[星球问卷助手] 找到提交按钮，点击提交...');
                humanClick(btn).then(() => {
                    startSecurityDialogWatcher();
                }).catch(() => {
                    try { btn.click(); } catch (e) {}
                    startSecurityDialogWatcher();
                });
                return true;
            }
        }

        const allBtns = document.querySelectorAll('a, button, input[type="button"], input[type="submit"]');
        for (const btn of allBtns) {
            const text = btn.textContent || btn.value || '';
            if (text.includes('提交') && btn.offsetParent !== null) {
                console.log('[星球问卷助手] 找到提交按钮（文字匹配），点击提交...');
                humanClick(btn).then(() => {
                    startSecurityDialogWatcher();
                }).catch(() => {
                    try { btn.click(); } catch (e) {}
                    startSecurityDialogWatcher();
                });
                return true;
            }
        }

        console.warn('[星球问卷助手] 未找到提交按钮');
        return false;
    }

    // 自动循环：成功页处理
    function handleSuccessPage() {
        if (!isAutoMode()) return;
        const targetUrl = getTargetUrl();
        const targetCount = getTargetCount();
        const currentCount = incrementCount();

        console.log(`[星球问卷助手] 检测到成功页，已完成 ${currentCount} 份`);
        showToastGlobal(`✅ 第 ${currentCount} 份提交成功！`);

        if (targetCount > 0 && currentCount >= targetCount) {
            setAutoMode(false);
            showToastGlobal(`🎉 已完成目标 ${targetCount} 份！自动模式已停止`);
            return;
        }

        if (targetUrl) {
            const delay = 2000 + Math.random() * 2000;
            setTimeout(() => {
                console.log('[星球问卷助手] 自动打开下一份问卷...');
                location.href = targetUrl;
            }, delay);
        }
    }

    // 简易toast（在成功页也能用，不依赖面板）
    function showToastGlobal(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    const nameList = `梁金
褚满兴
刘微
田水梅
石月
李阳成
郭小小
赵立敏
潘艺心
程明
林萌
刘圣斌
汪大妍
徐士龙
吴小燕
祝玉华
郑海英
杨芯
程瑞
徐玉茹
丁咕噜
郭丹
董育灵
杜玲
赵垚屹
王乐乐
高璐
李允记
吴龙山
杨明军
张娟娟
梁小清
宋子翔
陈伊伊
郭雪丽
王霏霏
张慧
张琳
迟晓燕
孔超
向峙臻
程小姐
罗曦
张玉梅
蒋冰冰
黄淇淇
石冬冬
于微
王旭升
李怡蓉
王佳乐
哈生
马女士
姜雨旋
马婧
金忠强
康康
胡霖
吴佳
焦焦
单璐
陈晓星
陈盼
邹承娟
马梦珊
吴丽丽
张明亮
连云开
谢玲玲
顾顾
杨苗苗
丁亮
孙婕
杨朵朵
王静思
王小青
曹豆豆
王亚娟
戚鑫
沈兰
杨扬
任静
刘小兔
卓小洁
刘翠梅
于浩洋
董帅芝
朱丽丽
罗懿
孙天宇
陈麟
黄生
杨信红
俞志峰
王劲
蔡秀英
刘新杰
涂梅琴
郭小香
蒋朵朵
陈学艳
木易杨
叶海英
冯卫平
郭清清
叶丹
张丹丽
田丽
杨璃儿
韩娟
朱红娟
郭思蔓
王秀兰
柳颖
马宁
余霞
曹丽娜
吴志红
丁清霞
冷家君
周娜
陈苗苗
李亚雄
张留建
郑佩华
黄新萍
吕赛赛
张芳楼
龚婷
金玫
陈爱军
胡小英
臧雪琳
鲁丹
李晶辉
董佳慧
宗文娟
邱女士
樊媛
杜清
叶春来
郑燕
纪雯
徐女士
史绘霞
沈伟琴
张玮
曹兵
蒙秋梅
舒瓜
史晓娟
丁女士
罗琼
单粉芳
古海伦
贾霞
许莉
郭美丽
胡利娅
叶先生
周文博
韩懿
张霆
李国强
叶群
吴心如
赵然
李兰
王乃玉
余伟锋
杨桃平
孟姣
杨春
凌小姐
吴成斌
陈思佳
张欢
钟家才
苏英歌
徐林华
黄捷
张露
钟小东
吴敏玉
刘薇
程娟娟
李鹏
胡馨誉
刘茜
詹美双
黄忠梅
曹诚贤
陈亚君
吴旭东
王杉杉
郭倩倩
黄成
李莉
琴姐
林麟
金蕊
易先生
林龙英
顾丽
郑婉娟
吴梅霞
张桂婷
罗曼姗
郑粉兰
刘波波
吴传捷
袁德辉
和东琴
李海润
张素霞
宋平
陆平
刘蕊
吴宁莉
张海梅
周玲芳
陈兰
袁新菊
蔡女士
刘则君
仉女士
徐会玲
刘宏珍
吕小凡
严中爱
堵雄风
花朵
闫玉兰
雷雷
蒋琳
郝婧
王俊棋
李银花
王凤云
金茗
李点
许女士
程颖
王天
赵文华
张根鱼
胡桂梅
杨岭
徐琳琳
王兰霞
陈美玉
杨波
吴艳
王强
胡颖
周晓敏
范福珍
岳秀云
李若唯
张明玉
李军超
黄海霞
向锦华
吴丽娜
张雅妮
段平凤
宋倩楠
娄伟波
楚翎
张卫
符湘莲
吴桂英
苏莉
寇秀梅
王闽立
李佳麟
秦依依
吕瑞兰
耿惠
陆淑光
龙梅芳
李科慧
王俊萍
王琛
石永凤
贾蕊
马苗英
王铁利
杨中华
田玉星
国影
倪玉如
张翠萍
曹圣燕
蒋丽芸
贾民丽
文武
张利男
向阳花
黄宏玉
周玉稳
石头
王艺红
李晓娟
陈亚茹
郑晓春
庄小芳
谢蕴韬
李丽萍
余红
王素菊
王立新
金卫红
李万鹏
郭秀芬
巫建韫
罗文霞
杨曼玉
徐丽
吴小建
郑勤勤
胡彩玉
王明艳
张思思
江华
花小c
李珂
杨保青
曹海林
汪艾林
霍贝贝
韩艳萍
黄丽
韩静
李亚云
王志静
廖雅姿
宗娟
王梅
陈昱静
李铁辛
宋瑞平
从涛
蔡苏银
高克梅
吴秀红
郑敏杰
高小利
高艳
黄哲涵
罗源华
赵鑫华
鱼儿
王珍珠
徐爱枝
熊军侠
王守滨
苏育玲
刘春丽
张丽仙
马庆
王毅
姚小慧
叶小新
李桂玲
徐玲玲
陈腾飞
李毓晨
杜春妹
张宇翔
卢艳丽
周慧利
马小抖
高振龙
王明烨
尹彩云
王超
高芳云
朱艳
田春琴
王美玲
米成荣
郑夏梅
关俊峰
卢静
刘耿龙
吴春城
王尔俊
徐海敏
李微
周杰
罗红霞
王春晴
岳琳琳
邢添慈
彭玉红
韩燕妮
李春辉
王均玲
王亚琳
罗林燕
毕灿
张彦芬
胡楠
汤晓青
罗大大
曾云龙
崔华
杨卫
常艳
郑伟
郑乾鹏
姜倩
高源泽
方婷婷
赖丽君
王红琴
丁健
钟琪
吴庆花
齐文雅
颜珍馨
周玉梅
温雅
崔海鹏
梁靖译
邢雅楠
刘远
郭素珍
季小平
丁云飞
许雪兆
于丽敏
王成
任进玉
`;

    const namePool = nameList.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

    // 存储解析后的问卷数据
    let surveyData = {
        questions: []
    };

    const STORAGE_PREFIX = 'wjx_helper_v1:';
    const DEFAULT_SETTINGS = {
        fixedUrl: '',
        timeMinSec: 8,
        timeMaxSec: 20,
        answerMode: 'human'
    };

    const PSYCHO_FIXED = {
        alpha: 0.8,
        validityR: 0.5,
        criterionQ: 13
    };

    const PSYCHO_BIAS = {
        left: 0,
        right: 0
    };

    helperSettings = loadSettings();

    function getSurveyKey() {
        const base = (location.origin || '') + (location.pathname || '');
        const qs = location.search || '';
        return base + qs;
    }

    function getRatioStorageKey() {
        return STORAGE_PREFIX + 'ratio:' + getSurveyKey();
    }

    function getSettingsStorageKey() {
        return STORAGE_PREFIX + 'settings';
    }

    function getPendingParseKey() {
        return STORAGE_PREFIX + 'pending_parse';
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(getSettingsStorageKey());
            if (!raw) return { ...DEFAULT_SETTINGS };
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_SETTINGS, ...(parsed || {}) };
        } catch (e) {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings(next) {
        helperSettings = { ...helperSettings, ...(next || {}) };
        try {
            localStorage.setItem(getSettingsStorageKey(), JSON.stringify(helperSettings));
        } catch (e) {
        }
    }

    function normalRandom() {
        let u = 0;
        let v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    function normalInv(p) {
        const _c = JSON.parse(atob('eyJhIjpbLTM5LjY5NjgzMDI4NjY1Mzc2LDIyMC45NDYwOTg0MjQ1MjA1LC0yNzUuOTI4NTEwNDQ2OTY4NywxMzguMzU3NzUxODY3MjY5MCwtMzAuNjY0Nzk4MDY2MTQ3MTYsMi41MDY2MjgyNzc0NTkyMzldLCJiIjpbLTU0LjQ3NjA5ODc5ODIyNDA2LDE2MS41ODU4MzY4NTgwNDA5LC0xNTUuNjk4OTc5ODU5ODg2Niw2Ni44MDEzMTE4ODc3MTk3MiwtMTMuMjgwNjgxNTUyODg1NzJdLCJjIjpbLTAuMDA3Nzg0ODk0MDAyNDMwMjkzLC0wLjMyMjM5NjQ1ODA0MTEzNjUsLTIuNDAwNzU4Mjc3MTYxODM4LC0yLjU0OTczMjUzOTM0MzczNCw0LjM3NDY2NDE0MTQ2NDk2OCwyLjkzODE2Mzk4MjY5ODc4M10sImQiOlswLjAwNzc4NDY5NTcwOTA0MTQ2MiwwLjMyMjQ2NzEyOTA3MDAzOTgsMi40NDUxMzQxMzcxNDI5OTYsMy43NTQ0MDg2NjE5MDc0MTZdfQ=='));
        if (p <= 0) return -Infinity;
        if (p >= 1) return Infinity;
        const plow = 0.02425, phigh = 1 - plow;
        let q, r;
        if (p < plow) {
            q = Math.sqrt(-2 * Math.log(p));
            const [c1, c2, c3, c4, c5, c6] = _c.c;
            const [d1, d2, d3, d4] = _c.d;
            return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }
        if (phigh < p) {
            q = Math.sqrt(-2 * Math.log(1 - p));
            const [c1, c2, c3, c4, c5, c6] = _c.c;
            const [d1, d2, d3, d4] = _c.d;
            return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }
        q = p - 0.5; r = q * q;
        const [a1, a2, a3, a4, a5, a6] = _c.a;
        const [b1, b2, b3, b4, b5] = _c.b;
        return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    }

    function zToCategoryIndex(z, m) {
        const mm = Math.max(2, Math.min(50, Math.floor(m || 5)));
        for (let j = 1; j < mm; j++) {
            const t = normalInv(j / mm);
            if (z <= t) return j - 1;
        }
        return mm - 1;
    }

    function computeRhoFromAlpha(alpha, k) {
        if (!(alpha > 0 && alpha < 1)) return 0.2;
        if (!(k >= 2)) return 0.2;
        const denom = (k - alpha * (k - 1));
        if (denom <= 0) return 0.2;
        const rho = alpha / denom;
        return Math.max(1e-6, Math.min(0.999999, rho));
    }

    function variance(xs) {
        if (!Array.isArray(xs) || xs.length < 2) return 0;
        const m = xs.reduce((a, b) => a + b, 0) / xs.length;
        return xs.reduce((s, x) => s + (x - m) * (x - m), 0) / (xs.length - 1);
    }

    function cronbachAlpha(matrix) {
        if (!Array.isArray(matrix) || matrix.length === 0) return 0;
        const k = matrix[0].length;
        if (k < 2) return 0;
        const varTotal = variance(matrix.map(r => r.reduce((a, b) => a + b, 0)));
        if (varTotal === 0) return 0;
        let sumItemVar = 0;
        for (let j = 0; j < k; j++) sumItemVar += variance(matrix.map(r => r[j]));
        return (k / (k - 1)) * (1 - (sumItemVar / varTotal));
    }

    function correlation(xs, ys) {
        if (!Array.isArray(xs) || !Array.isArray(ys) || xs.length !== ys.length || xs.length < 2) return 0;
        const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
        let num = 0, dx = 0, dy = 0;
        for (let i = 0; i < xs.length; i++) {
            const a = xs[i] - mx, b = ys[i] - my;
            num += a * b; dx += a * a; dy += b * b;
        }
        const den = Math.sqrt(dx * dy);
        return den === 0 ? 0 : num / den;
    }

    function buildPsychometricPlan(questions) {
        const enabled = (questions || []).some(q => q && q.psycho);
        if (!enabled) return null;

        const targetAlpha = Number(PSYCHO_FIXED.alpha);
        const validityR = Math.max(0, Math.min(0.999, Number(PSYCHO_FIXED.validityR)));
        const criterionQInput = parseInt(PSYCHO_FIXED.criterionQ, 10) || 0;
        let criterionQ = criterionQInput > 0 ? (criterionQInput - 1) : -1;
        if (criterionQ >= 0) {
            const cq = (questions || [])[criterionQ];
            if (!cq || !cq.psycho) criterionQ = -1;
        }

        const items = [];
        const itemBias = new Map();
        (questions || []).forEach(q => {
            if (!q || !q.psycho) return;
            if ((q.type === 'radio' || q.type === 'scale' || q.type === 'select') && Array.isArray(q.options) && q.options.length >= 2) {
                items.push({ kind: 'q', qIndex: q.index, m: q.options.length });
                itemBias.set(`q:${q.index}`, q.bias);
            } else if (q.type === 'matrix' && Array.isArray(q.matrixRows)) {
                (q.matrixRows || []).forEach((row, rIdx) => {
                    if (row && Array.isArray(row.options) && row.options.length >= 2) {
                        items.push({ kind: 'm', qIndex: q.index, rIndex: rIdx, m: row.options.length });
                        itemBias.set(`m:${q.index}:${rIdx}`, q.bias);
                    }
                });
            }
        });

        const k = items.length;
        if (k < 2) return null;

        const rho = computeRhoFromAlpha(targetAlpha, k);
        const sigmaE = Math.sqrt((1 / rho) - 1);
        const theta = normalRandom();
        const eta = validityR > 0 ? (validityR * theta + Math.sqrt(1 - validityR * validityR) * normalRandom()) : theta;

        const choices = new Map();
        const criterionValues = [];
        const totalValues = [];

        for (const item of items) {
            const useEta = (criterionQ >= 0) && (item.kind === 'q') && (item.qIndex === criterionQ);
            const base = useEta ? eta : theta;
            const key = item.kind === 'q' ? `q:${item.qIndex}` : `m:${item.qIndex}:${item.rIndex}`;
            const bias = itemBias.get(key);
            const biasShift = (bias === 'left') ? -1.0 : (bias === 'right') ? 1.0 : 0;
            const z = base + biasShift + sigmaE * normalRandom();
            const idx = zToCategoryIndex(z, item.m);
            choices.set(key, idx);
        }

        try {
            const nSim = 40;
            const simMatrix = [];
            for (let i = 0; i < nSim; i++) {
                const th = normalRandom();
                const et = validityR > 0 ? (validityR * th + Math.sqrt(1 - validityR * validityR) * normalRandom()) : th;
                const rowVals = [];
                let total = 0;
                let crit = null;
                for (const item of items) {
                    const useEta = (criterionQ >= 0) && (item.kind === 'q') && (item.qIndex === criterionQ);
                    const base = useEta ? et : th;
                    const key = item.kind === 'q' ? `q:${item.qIndex}` : `m:${item.qIndex}:${item.rIndex}`;
                    const bias = itemBias.get(key);
                    const biasShift = (bias === 'left') ? -1.0 : (bias === 'right') ? 1.0 : 0;
                    const z = base + biasShift + sigmaE * normalRandom();
                    const idx = zToCategoryIndex(z, item.m);
                    const v = idx + 1;
                    rowVals.push(v);
                    if (useEta) crit = v;
                    else total += v;
                }
                simMatrix.push(rowVals);
                if (crit != null) {
                    totalValues.push(total);
                    criterionValues.push(crit);
                }
            }

            const approxAlpha = cronbachAlpha(simMatrix);
            const approxR = (criterionQ >= 0 && totalValues.length > 2) ? correlation(totalValues, criterionValues) : 0;
            console.log('[星球问卷助手] 信效度模式启用 | 目标α=', targetAlpha, '题数=', k, '估计α≈', approxAlpha.toFixed(3), '目标r=', validityR, '估计r≈', approxR.toFixed(3));
        } catch (e) {
        }

        return { choices };
    }

    function loadRatioConfig() {
        try {
            const raw = localStorage.getItem(getRatioStorageKey());
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function saveRatioConfig() {
        const payload = {
            version: 1,
            savedAt: Date.now(),
            surveyKey: getSurveyKey(),
            questions: (surveyData.questions || []).map(q => {
                const base = {
                    type: q.type,
                    fillText: q.fillText,
                    psycho: q.psycho,
                    bias: q.bias,
                    isNumeric: q.isNumeric,
                    minNum: q.minNum,
                    maxNum: q.maxNum
                };
                if (q.type === 'radio' || q.type === 'checkbox' || q.type === 'select' || q.type === 'scale') {
                    base.options = (q.options || []).map(o => ({ percent: o.percent }));
                }
                if (q.type === 'matrix') {
                    base.matrixRows = (q.matrixRows || []).map(r => ({
                        options: (r.options || []).map(o => ({ percent: o.percent }))
                    }));
                }
                return base;
            })
        };
        try {
            localStorage.setItem(getRatioStorageKey(), JSON.stringify(payload));
        } catch (e) {
        }
    }

    function applyRatioConfigToSurveyData() {
        const cfg = loadRatioConfig();
        if (!cfg || !Array.isArray(cfg.questions)) return;

        const qs = cfg.questions;
        (surveyData.questions || []).forEach((q, i) => {
            const saved = qs[i];
            if (!saved || saved.type !== q.type) return;

            if (typeof saved.fillText === 'string') q.fillText = saved.fillText;
            if (typeof saved.psycho === 'boolean') q.psycho = saved.psycho;
            if (typeof saved.bias === 'string') q.bias = saved.bias;
            if (typeof saved.isNumeric === 'boolean') q.isNumeric = saved.isNumeric;
            if (typeof saved.minNum === 'number') q.minNum = saved.minNum;
            if (typeof saved.maxNum === 'number') q.maxNum = saved.maxNum;

            if ((q.type === 'radio' || q.type === 'checkbox' || q.type === 'select' || q.type === 'scale') && Array.isArray(saved.options) && Array.isArray(q.options) && saved.options.length === q.options.length) {
                q.options.forEach((opt, idx) => {
                    const v = saved.options[idx] && saved.options[idx].percent;
                    if (typeof v === 'number' && v >= 0 && v <= 100) opt.percent = v;
                });
            }

            if (q.type === 'matrix' && Array.isArray(saved.matrixRows) && Array.isArray(q.matrixRows) && saved.matrixRows.length === q.matrixRows.length) {
                q.matrixRows.forEach((row, rIdx) => {
                    const savedRow = saved.matrixRows[rIdx];
                    if (!savedRow || !Array.isArray(savedRow.options) || !Array.isArray(row.options) || savedRow.options.length !== row.options.length) return;
                    row.options.forEach((opt, oIdx) => {
                        const v = savedRow.options[oIdx] && savedRow.options[oIdx].percent;
                        if (typeof v === 'number' && v >= 0 && v <= 100) opt.percent = v;
                    });
                });
            }
        });
    }

    // 添加样式 - 使用原生方式
    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    addStyle(`
        #wjx-helper-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 400px;
            max-height: 80vh;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden;
        }
        #wjx-helper-header {
            background: #1677ff;
            color: #fff;
            padding: 12px 15px;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        #wjx-helper-header .close-btn {
            cursor: pointer;
            font-size: 20px;
            opacity: 0.8;
        }
        #wjx-helper-header .close-btn:hover {
            opacity: 1;
        }
        #wjx-helper-body {
            padding: 15px;
            max-height: calc(80vh - 120px);
            overflow-y: auto;
        }
        #wjx-helper-footer {
            padding: 10px 15px;
            background: #f8f9fa;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        }
        .wjx-btn {
            flex: 1;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }
        .wjx-btn-primary {
            background: #1677ff;
            color: white;
        }
        .wjx-btn-primary:hover {
            background: #4096ff;
        }
        .wjx-btn-secondary {
            background: #e9ecef;
            color: #495057;
        }
        .wjx-btn-secondary:hover {
            background: #dee2e6;
        }
        .wjx-question-item {
            margin-bottom: 15px;
            padding: 12px;
            background: #fafafa;
            border-radius: 6px;
            border-left: 3px solid #1677ff;
        }
        .wjx-question-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
            font-size: 13px;
        }
        .wjx-question-type {
            display: inline-block;
            padding: 2px 8px;
            background: #1677ff;
            color: white;
            border-radius: 4px;
            font-size: 11px;
            margin-left: 8px;
        }
        .wjx-psy-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: 8px;
            padding: 4px 10px;
            background: #f1f5f9;
            color: #64748b;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid transparent;
        }
        .wjx-psy-chip:hover {
            background: #e2e8f0;
            color: #475569;
        }
        .wjx-psy-chip.active {
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: #fff;
            box-shadow: 0 2px 4px rgba(109, 40, 217, 0.2);
        }
        .wjx-psy-chip input {
            display: none;
        }
        .wjx-psy-mark {
            display: none;
            font-size: 12px;
        }
        .wjx-psy-chip.active .wjx-psy-mark {
            display: inline-block;
        }
        .wjx-bias-group {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 8px;
            background: #f1f5f9;
            padding: 4px;
            border-radius: 8px;
        }
        .wjx-bias-btn {
            flex: 1;
            padding: 6px 0;
            border-radius: 6px;
            border: none;
            background: transparent;
            color: #64748b;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wjx-bias-btn:hover:not(.active) {
            background: rgba(0,0,0,0.04);
            color: #475569;
        }
        .wjx-bias-btn.active {
            background: #ffffff;
            color: #1677ff;
            font-weight: 600;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
        }
        .wjx-option-item {
            display: flex;
            align-items: center;
            margin: 8px 0;
            padding: 6px 10px;
            background: white;
            border-radius: 4px;
        }
        .wjx-option-label {
            flex: 1;
            font-size: 12px;
            color: #555;
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .wjx-option-input {
            width: 60px;
            padding: 4px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
        }
        .wjx-option-input:focus {
            outline: none;
            border-color: #1677ff;
        }
        .wjx-percent-label {
            font-size: 12px;
            color: #888;
            margin-left: 4px;
        }
        .wjx-fill-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 8px;
        }
        .wjx-toggle-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1677ff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .wjx-toggle-btn:hover {
            transform: scale(1.1);
        }
        .wjx-stats {
            padding: 10px;
            background: #e8f4fd;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 13px;
            color: #0066cc;
        }
        .wjx-randomize-btn {
            padding: 4px 10px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 10px;
        }
        .wjx-tabs {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #eee;
            background: #fff;
        }
        .wjx-tab {
            flex: 1;
            text-align: center;
            padding: 12px 0;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #666;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
        }
        .wjx-tab:hover {
            color: #1677ff;
        }
        .wjx-tab.active {
            color: #1677ff;
            border-bottom-color: #1677ff;
        }
        .wjx-tab-content {
            display: none;
            max-height: calc(80vh - 180px);
            overflow-y: auto;
        }
        .wjx-tab-content.active {
            display: block;
        }
        .wjx-settings-group {
            margin-bottom: 15px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        .wjx-settings-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .wjx-settings-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            box-sizing: border-box;
        }
        .wjx-settings-input:focus {
            outline: none;
            border-color: #1677ff;
        }
        .wjx-settings-row {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .wjx-settings-row .wjx-settings-input {
            flex: 1;
        }
        .wjx-settings-hint {
            font-size: 11px;
            color: #888;
            margin-top: 4px;
        }
        .wjx-batch-info {
            padding: 10px;
            background: #e8f4fd;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 13px;
            color: #0066cc;
        }
        .wjx-batch-progress {
            margin-top: 10px;
            padding: 10px;
            background: #fff3cd;
            border-radius: 6px;
            font-size: 13px;
            color: #856404;
            display: none;
        }
        .wjx-batch-progress.active {
            display: block;
        }
    `);

    // 解析问卷 - 针对问卷星的DOM结构
    function parseSurvey() {
        surveyData.questions = [];
        
        // 问卷星移动端页面：题目容器就是 #divQuestion 内的 .field
        // 之前用 fieldset/div[id^=q] 会把很多无关节点也当题目，导致解析结果“乱”
        const questionDivs = document.querySelectorAll('#divQuestion .field.ui-field-contain, #divQuestion .field');
        
        let questionIndex = 0;
        questionDivs.forEach((div) => {
            const question = parseQuestion(div, questionIndex);
            if (question) {
                surveyData.questions.push(question);
                questionIndex++;
            }
        });

        console.log('[星球问卷助手] 解析到', surveyData.questions.length, '道题目');
        applyRatioConfigToSurveyData();
        return surveyData;
    }

    function isSurveyQuestionPage() {
        return !!document.querySelector('#divQuestion');
    }

    function normalizeUrl(u) {
        try {
            const url = new URL(u, location.href);
            url.hash = '';
            return url.toString();
        } catch (e) {
            return (u || '').trim();
        }
    }

    function consumePendingParseIfMatch() {
        try {
            const raw = sessionStorage.getItem(getPendingParseKey());
            if (!raw) return false;
            const payload = JSON.parse(raw);
            const target = payload && payload.url ? normalizeUrl(payload.url) : '';
            const current = normalizeUrl(location.href);
            if (!target || target !== current) return false;
            if (!isSurveyQuestionPage()) return false;

            parseSurvey();
            renderQuestions();
            const stat = document.querySelector('.wjx-stats strong');
            if (stat) stat.textContent = surveyData.questions.length;
            saveRatioConfig();
            sessionStorage.removeItem(getPendingParseKey());
            showToast('✅ 解析完成并已保存配比');
            return true;
        } catch (e) {
            try { sessionStorage.removeItem(getPendingParseKey()); } catch (e2) {}
            return false;
        }
    }

    // 解析单个题目
    function parseQuestion(div, index) {
        // 问卷星移动端：标题在 .field-label > .topichtml
        // 示例：<div class="field-label"><div class="topicnumber">1.</div><div class="topichtml">您的性别</div></div>
        const titleEl = div.querySelector('.field-label .topichtml, .topichtml, .div_title_question, legend');
        if (!titleEl) return null;

        let title = titleEl.textContent.trim();
        
        // 清理标题，去除多余空格
        title = title.replace(/\s+/g, ' ').trim();
        if (!title || title.length < 2) return null;

        // 判断题型 - 问卷星移动端选项文本在 div.label[for="qX_Y"]
        const radioInputs = div.querySelectorAll('input[type="radio"]');
        const checkboxInputs = div.querySelectorAll('input[type="checkbox"]');
        const sliderInput = div.querySelector('input.ui-slider-input');
        const textInputs = div.querySelectorAll('textarea:not([readonly]), input[type="text"]:not([readonly]):not(.ui-slider-input), input[type="tel"]:not([readonly]):not(.ui-slider-input), input[type="number"]:not([readonly]):not(.ui-slider-input)');
        const selectEl = div.querySelector('select');

        // 检测量表题和矩阵题
        const scaleDiv = div.querySelector('.scale-div');
        const matrixTable = div.querySelector('table.matrix-rating');
        
        // 检测排序题 (type=11) - ul.ui-listview 包含 li.ui-li-static[serial]
        const sortList = div.querySelector('ul.ui-listview, ul.ui-controlgroup');
        const isSortQuestion = sortList && 
            sortList.querySelectorAll('li.ui-li-static[serial]').length > 0 &&
            !radioInputs.length && !checkboxInputs.length;

        let question = {
            index: index,
            element: div,
            title: title.substring(0, 50) + (title.length > 50 ? '...' : ''),
            fullTitle: title,
            type: null,
            options: [],
            fillText: '',
            psycho: false,
            bias: undefined,
            required: div.getAttribute('req') === '1' || !!div.querySelector('.field-label .req')
        };

        if (isSortQuestion) {
            // 排序题 (type=11) - ul.ui-listview li.ui-li-static[serial]
            question.type = 'sort';
            question.sortItems = [];
            const sortItems = sortList.querySelectorAll('li.ui-li-static[serial]');
            sortItems.forEach((li, i) => {
                const serial = li.getAttribute('serial');
                const textSpan = li.querySelector('span:not(.sortnum)');
                const optionText = textSpan ? textSpan.textContent.trim() : `选项${i + 1}`;
                question.sortItems.push({
                    element: li,
                    serial: serial,
                    text: optionText.substring(0, 30) + (optionText.length > 30 ? '...' : ''),
                    fullText: optionText
                });
            });
            question.listElement = sortList;
        } else if (radioInputs.length > 0) {
            // 单选题 - 问卷星的radio是隐藏的，实际点击 a.jqradio
            question.type = 'radio';
            radioInputs.forEach((input, i) => {
                let optionText = '';
                const labelDiv = input.id ? div.querySelector(`.label[for="${input.id}"]`) : null;
                if (labelDiv) {
                    optionText = labelDiv.textContent.trim();
                }
                if (!optionText) {
                    const uiRadio = input.closest('.ui-radio');
                    optionText = uiRadio ? uiRadio.textContent.trim() : '';
                }
                optionText = optionText.replace(/\s+/g, ' ').trim();
                if (!optionText) optionText = `选项${i + 1}`;
                
                // 找到实际可点击的 a.jqradio 元素
                const wrapper = input.closest('.jqradiowrapper, .ui-radio');
                const clickTarget = wrapper ? wrapper.querySelector('a.jqradio') : null;
                
                question.options.push({
                    element: clickTarget || input,
                    inputElement: input,
                    text: optionText.substring(0, 30) + (optionText.length > 30 ? '...' : ''),
                    percent: Math.floor(100 / radioInputs.length)
                });
            });
            if (question.options.length > 0) {
                const remainder = 100 - question.options.reduce((sum, o) => sum + o.percent, 0);
                question.options[0].percent += remainder;
            }
        } else if (checkboxInputs.length > 0) {
            // 多选题 - 问卷星的checkbox是隐藏的，实际点击 a.jqcheck
            question.type = 'checkbox';
            checkboxInputs.forEach((input, i) => {
                let optionText = '';
                const labelDiv = input.id ? div.querySelector(`.label[for="${input.id}"]`) : null;
                if (labelDiv) {
                    optionText = labelDiv.textContent.trim();
                }
                if (!optionText) {
                    const uiCheckbox = input.closest('.ui-checkbox');
                    optionText = uiCheckbox ? uiCheckbox.textContent.trim() : '';
                }
                optionText = optionText.replace(/\s+/g, ' ').trim();
                if (!optionText) optionText = `选项${i + 1}`;
                
                // 找到实际可点击的 a.jqcheck 元素
                const wrapper = input.closest('.jqcheckwrapper, .ui-checkbox');
                const clickTarget = wrapper ? wrapper.querySelector('a.jqcheck') : null;

                let otherTextEl = null;
                try {
                    const relId = input.getAttribute('rel');
                    if (relId) {
                        otherTextEl = div.querySelector('#' + relId) || document.getElementById(relId);
                    }
                } catch (e) {}
                if (!otherTextEl && input.id) {
                    try {
                        otherTextEl = div.querySelector(`input.OtherText[rel="${input.id}"], textarea[rel="${input.id}"], input[type="text"][rel="${input.id}"]`);
                    } catch (e) {}
                }
                
                question.options.push({
                    element: clickTarget || labelDiv || input,
                    inputElement: input,
                    otherTextElement: otherTextEl,
                    text: optionText.substring(0, 30) + (optionText.length > 30 ? '...' : ''),
                    percent: 50
                });
            });
        } else if (selectEl) {
            // 下拉选择题
            question.type = 'select';
            question.selectElement = selectEl;
            const options = selectEl.querySelectorAll('option');
            options.forEach((opt, i) => {
                if (opt.value) {
                    question.options.push({
                        element: opt,
                        text: opt.textContent.trim().substring(0, 30),
                        value: opt.value,
                        percent: Math.floor(100 / (options.length - 1)) // 排除空选项
                    });
                }
            });
        } else if (scaleDiv) {
            // 量表题 (type=5) - .scale-div ul li a[val]
            question.type = 'scale';
            const scaleOptions = scaleDiv.querySelectorAll('ul li a[val]');
            scaleOptions.forEach((a, i) => {
                const val = a.getAttribute('val');
                const titleAttr = a.getAttribute('title') || val;
                question.options.push({
                    element: a,
                    text: titleAttr.substring(0, 20),
                    value: val,
                    percent: Math.floor(100 / scaleOptions.length)
                });
            });
            if (question.options.length > 0) {
                const remainder = 100 - question.options.reduce((sum, o) => sum + o.percent, 0);
                question.options[0].percent += remainder;
            }
        } else if (matrixTable) {
            // 矩阵量表题 (type=6) - table.matrix-rating tr[tp="d"]
            question.type = 'matrix';
            question.matrixRows = [];
            const rows = matrixTable.querySelectorAll('tr[tp="d"]');
            rows.forEach((row, rowIdx) => {
                const rowTitle = row.querySelector('.rowtitlediv, .itemTitleSpan');
                const rowTitleText = rowTitle ? rowTitle.textContent.trim().substring(0, 30) : `行${rowIdx + 1}`;
                const cells = row.querySelectorAll('a[dval]');
                const cellOptions = [];
                cells.forEach((a, i) => {
                    cellOptions.push({
                        element: a,
                        value: a.getAttribute('dval'),
                        percent: Math.floor(100 / cells.length)
                    });
                });
                if (cellOptions.length > 0) {
                    const remainder = 100 - cellOptions.reduce((sum, o) => sum + o.percent, 0);
                    cellOptions[0].percent += remainder;
                }
                question.matrixRows.push({
                    title: rowTitleText,
                    options: cellOptions
                });
            });
        } else if (sliderInput) {
            // 滑块题（0-100）本质是 input[type=text].ui-slider-input
            question.type = 'slider';
            question.textElement = sliderInput;
            question.fillText = String(Math.floor(Math.random() * 101));
        } else if (textInputs.length > 0) {
            // 填空题 - 过滤掉隐藏的 input (矩阵题的隐藏字段)
            const visibleTextInputs = Array.from(textInputs).filter(inp => {
                return inp.style.display !== 'none' && !inp.closest('[style*="display:none"]') && !inp.closest('[style*="display: none"]');
            });
            if (visibleTextInputs.length === 0) return null;
            question.type = 'text';
            question.textElement = visibleTextInputs[0];
            question.fillText = '这是一个自动填写的回答';
            // 支持随机数字模式
            const el = question.textElement;
            const verify = (el && el.getAttribute) ? (el.getAttribute('verify') || '') : '';
            const inputMode = (el && el.getAttribute) ? (el.getAttribute('inputmode') || '') : '';
            const typeAttr = (el && el.getAttribute) ? (el.getAttribute('type') || '') : '';
            const minword = (el && el.getAttribute) ? (el.getAttribute('minword') || '') : '';
            const maxword = (el && el.getAttribute) ? (el.getAttribute('maxword') || '') : '';

            let minNum = parseInt(minword, 10);
            let maxNum = parseInt(maxword, 10);

            if (Number.isNaN(minNum) || Number.isNaN(maxNum)) {
                const m1 = title.match(/从\s*(\d+)\s*到\s*(\d+)/);
                const m2 = title.match(/(\d+)\s*[-~～]\s*(\d+)/);
                const m = m1 || m2;
                if (m) {
                    minNum = parseInt(m[1], 10);
                    maxNum = parseInt(m[2], 10);
                }
            }

            const numericByAttr = /数字|number/i.test(verify) || /numeric/i.test(inputMode) || /^(tel|number)$/i.test(typeAttr);
            const numericByRange = !Number.isNaN(minNum) && !Number.isNaN(maxNum);
            question.isNumeric = numericByAttr || numericByRange;
            if (question.isNumeric) {
                question.minNum = Number.isNaN(minNum) ? 0 : minNum;
                question.maxNum = Number.isNaN(maxNum) ? question.minNum : maxNum;
            } else {
                question.minNum = 18;
                question.maxNum = 60;
            }
        } else {
            return null;
        }

        return question;
    }

    // 创建控制面板
    function createPanel() {
        // 先移除已存在的面板
        const existingPanel = document.getElementById('wjx-helper-panel');
        if (existingPanel) existingPanel.remove();
        const existingBtn = document.getElementById('wjx-toggle-btn');
        if (existingBtn) existingBtn.remove();

        // 不再基于页面自动解析（仅允许手动输入触发解析）
        surveyData.questions = [];

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'wjx-helper-panel';
        panel.innerHTML = `
            <div id="wjx-helper-header">
                <span>📝 星球问卷助手</span>
                <span class="close-btn" id="wjx-close-btn">×</span>
            </div>
            <div id="wjx-helper-body">
                <div class="wjx-tabs">
                    <div class="wjx-tab ${isAutoMode() ? '' : 'active'}" data-tab="parse">解析</div>
                    <div class="wjx-tab" data-tab="ratio">配比</div>
                    <div class="wjx-tab ${isAutoMode() ? 'active' : ''}" data-tab="settings">设置</div>
                    <div class="wjx-tab" data-tab="help">帮助</div>
                </div>

                <div class="wjx-tab-content ${isAutoMode() ? '' : 'active'}" id="wjx-tab-parse">
                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">问卷链接（手动输入）</label>
                        <input type="text" class="wjx-settings-input" id="wjx-parse-url" placeholder="粘贴问卷星链接后点击解析" value="">
                        <div class="wjx-settings-hint">只允许通过这里解析；解析完成会自动保存配比配置。</div>
                        <div style="margin-top:10px;display:flex;gap:10px;">
                            <button class="wjx-btn wjx-btn-primary" id="wjx-parse-go" style="flex:1;">解析</button>
                            <button class="wjx-btn wjx-btn-secondary" id="wjx-parse-open" style="flex:1;">打开链接</button>
                        </div>
                        <div class="wjx-batch-progress" id="wjx-parse-progress"></div>
                    </div>
                </div>

                <div class="wjx-tab-content" id="wjx-tab-ratio">
                    <div class="wjx-stats">
                        📊 已解析 <strong>${surveyData.questions.length}</strong> 道题目
                        <button class="wjx-randomize-btn" id="wjx-randomize-all">🎲 随机所有百分比</button>
                    </div>
                    <div id="wjx-questions-container"></div>
                    <div style="margin-top:12px;">
                        <button class="wjx-btn wjx-btn-primary" id="wjx-save-ratio-btn" style="width:100%;">💾 保存配比</button>
                    </div>
                </div>

                <div class="wjx-tab-content ${isAutoMode() ? 'active' : ''}" id="wjx-tab-settings">
                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">每份答题时间（秒）</label>
                        <div class="wjx-settings-row">
                            <input type="number" class="wjx-settings-input" id="wjx-time-min" min="0" value="${Number(helperSettings.timeMinSec) || 0}" placeholder="最小">
                            <input type="number" class="wjx-settings-input" id="wjx-time-max" min="0" value="${Number(helperSettings.timeMaxSec) || 0}" placeholder="最大">
                        </div>
                        <div class="wjx-settings-hint">点击“一键填写”前会随机等待这个区间的秒数，再开始填写。</div>
                    </div>

                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">作答模式</label>
                        <select class="wjx-settings-input" id="wjx-answer-mode">
                            <option value="human" ${((helperSettings.answerMode || 'human') === 'human') ? 'selected' : ''}>逐题作答（拟人化）</option>
                            <option value="instant" ${((helperSettings.answerMode || 'human') === 'instant') ? 'selected' : ''}>瞬时秒刷（瞬间完成）</option>
                        </select>
                        <div class="wjx-settings-hint">逐题作答会逐题移动并停顿；瞬时秒刷会快速一次性完成整份问卷（多选题按配比随机）。</div>
                    </div>

                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">清空配置</label>
                        <div class="wjx-settings-row" style="margin-top:10px;gap:8px;">
                            <button class="wjx-btn wjx-btn-secondary" id="wjx-clear-config" style="flex:1;background:#6c757d;color:#fff;padding:8px 10px;font-size:12px;">清空配置</button>
                            <button class="wjx-btn wjx-btn-secondary" id="wjx-clear-ratio" style="flex:1;background:#6c757d;color:#fff;padding:8px 10px;font-size:12px;">清空配比</button>
                        </div>
                        <div class="wjx-settings-hint">会清空固定链接、答题时间、目标份数，并停止自动循环。</div>
                    </div>

                    <div class="wjx-settings-group" style="border-left:3px solid #28a745;">
                        <label class="wjx-settings-label">🔄 自动循环模式</label>
                        <div class="wjx-stats" style="background:#d4edda;color:#155724;margin-bottom:10px;">
                            📊 已完成 <strong id="wjx-count-display">${getSubmitCount()}</strong> 份
                            <button class="wjx-randomize-btn" id="wjx-reset-count" style="background:#dc3545;">重置</button>
                        </div>
                        <div class="wjx-settings-row" style="margin-bottom:8px;">
                            <label style="font-size:12px;color:#555;flex:0 0 80px;">目标份数</label>
                            <input type="number" class="wjx-settings-input" id="wjx-target-count" min="0" value="${getTargetCount() || ''}" placeholder="0=无限">
                        </div>
                        <div class="wjx-settings-hint" style="margin-bottom:10px;">设为0或留空表示无限循环，直到手动停止。</div>
                        <div class="wjx-settings-row" style="margin-bottom:8px;gap:8px;">
                            <div style="font-size:12px;color:#555;flex:1;">状态：<strong id="wjx-auto-unlock-status">${isAutoLoopUnlocked() ? '已解锁（不限）' : '未解锁（最多20份）'}</strong></div>
                        </div>
                        <div id="wjx-unlock-section" style="display:${isAutoLoopUnlocked() ? 'none' : 'block'};background:#fff3cd;border:2px solid #ffc107;border-radius:8px;padding:12px;margin:10px 0;">
                            <div style="font-size:13px;font-weight:bold;color:#856404;margin-bottom:10px;">🔒 功能未解锁</div>
                            <div class="wjx-settings-row" style="margin-bottom:8px;">
                                <label style="font-size:12px;color:#856404;flex:0 0 60px;">卡密</label>
                                <input class="wjx-settings-input" id="wjx-unlock-key" placeholder="加群免费领卡密" style="border-color:#ffc107;">
                            </div>
                            <div class="wjx-settings-row" style="margin-bottom:8px;gap:8px;">
                                <button class="wjx-btn wjx-btn-primary" id="wjx-unlock-btn" style="flex:1;background:linear-gradient(135deg, #ffc107 0%, #ff9800 100%);color:#333;font-weight:bold;">🔓 解锁</button>
                            </div>
                            <div style="font-size:11px;color:#856404;line-height:1.4;">未解锁最多只能填写20份<br>加群 <strong>1029241274</strong> 免费获取卡密解锁</div>
                        </div>
                        <div class="wjx-settings-row">
                            <button class="wjx-btn wjx-btn-primary" id="wjx-start-auto" style="flex:1;background:linear-gradient(135deg, #28a745 0%, #20c997 100%);">🚀 开始自动循环</button>
                            <button class="wjx-btn wjx-btn-secondary" id="wjx-stop-auto" style="flex:1;background:#dc3545;color:white;">⏹ 停止</button>
                        </div>
                        <div class="wjx-batch-progress ${isAutoMode() ? 'active' : ''}" id="wjx-auto-progress" style="${isAutoMode() ? 'background:#d4edda;color:#155724;' : ''}">${isAutoMode() ? '🔄 自动模式运行中...' : ''}</div>
                        <div class="wjx-settings-hint" style="margin-top:8px;">自动循环：填写→提交→识别成功页→计数+1→打开下一份→重复</div>
                    </div>
                    </div>
                </div>

                <div class="wjx-tab-content" id="wjx-tab-help">
                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">🌟 功能说明</label>
                        <div style="font-size:12px;color:#555;line-height:1.6;margin-top:8px;">
                            <p><strong>重要：</strong> 脚本只支持Edge浏览器和谷歌浏览器，其他浏览器一律禁用</p>
                            <p><strong>1. 解析：</strong> 输入问卷链接，点击解析以加载题目。</p>
                            <p><strong>2. 配比：</strong> 设置每题的选项比例。勾选 <span style="background:#f3e8ff;color:#5b21b6;padding:0 4px;border-radius:4px;">✨ 信效度</span> 后，该题将按算法自动生成，忽略百分比。</p>
                            <p><strong>3. 设置：</strong> 配置自动循环、答题速度等全局参数。</p>
                            <p><strong>4. 填空：</strong> 在“配比”里找到填空题，支持一次输入多个候选答案，用 <strong>；</strong>（或 <strong>;</strong>）分隔；自动填写时会随机取其中一个填入。若勾选了“随机数字”，则优先按数字范围随机。</p>
                        </div>
                    </div>
                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">✨ 信效度模式</label>
                        <div style="font-size:12px;color:#555;line-height:1.6;margin-top:8px;">
                            <p>勾选信效度后，可设置偏向：</p>
                            <ul style="padding-left:16px;margin:4px 0;">
                                <li><strong>👈 倾向左侧：</strong> 答案倾向于选 1-3 分（低分）</li>
                                <li><strong>中立：</strong> 答案呈正态分布</li>
                                <li><strong>倾向右侧 👉：</strong> 答案倾向于选 3-5 分（高分）</li>
                            </ul>
                            <p style="color:#888;margin-top:4px;">* 适用于量表题、单选题等。</p>
                        </div>
                    </div>
                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">🤖 AI生成填空答案</label>
                        <div style="font-size:12px;color:#555;line-height:1.6;margin-top:8px;">
                            <p>填空题可以用 <strong>Kimi AI</strong> 批量生成多个候选答案：</p>
                            <ol style="padding-left:16px;margin:6px 0;">
                                <li>打开 <a href="https://www.kimi.com/" target="_blank" style="color:#007bff;">www.kimi.com</a></li>
                                <li>点击<strong>左上角的卡片图标</strong>（新建会话旁边的方块图标）</li>
                                <li>选择或搜索"<strong>问卷填空生成</strong>"相关卡片</li>
                                <li>让 Kimi 生成多个答案，例如：<br><span style="color:#888;">"帮我生成20个不同的人名，用分号分隔"</span></li>
                                <li>复制生成的内容，粘贴到本脚本填空题输入框</li>
                            </ol>
                            <p style="color:#888;">提示：答案之间用 <strong>；</strong> 或 <strong>;</strong> 分隔，自动填写时会随机选一个。</p>
                        </div>
                    </div>
                    <div class="wjx-settings-group">
                        <label class="wjx-settings-label">💡 常见问题</label>
                        <div style="font-size:12px;color:#555;line-height:1.6;margin-top:8px;">
                            <p>Q: 怎么自动提交？<br>A: 在"设置"里开启"自动循环模式"，设置目标份数即可。</p>
                            <p>Q: 为什么信效度没效果？<br>A: 确保已勾选题目上的"信效度"开关。</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="wjx-helper-footer">
                <span style="font-size:12px;color:#888;">QQ群：1029241274</span>
            </div>
        `;

        document.body.appendChild(panel);

        // 渲染题目列表
        renderQuestions();

        // 绑定事件
        document.getElementById('wjx-close-btn').onclick = () => {
            panel.style.display = 'none';
            showToggleButton();
        };

        const saveBtn = document.getElementById('wjx-save-ratio-btn');
        if (saveBtn) saveBtn.onclick = () => {
            saveRatioConfig();
            showToast('✅ 已保存配比');
            const settingsTab = panel.querySelector('.wjx-tab[data-tab="settings"]');
            if (settingsTab) settingsTab.click();
        };

        document.getElementById('wjx-randomize-all').onclick = randomizeAllPercents;

        const tabs = panel.querySelectorAll('.wjx-tab');
        tabs.forEach(t => {
            t.onclick = () => {
                if (isAutoMode() && t.dataset.tab !== 'settings') {
                    const settingsTab = panel.querySelector('.wjx-tab[data-tab="settings"]');
                    if (settingsTab) settingsTab.classList.add('active');
                    const settingsEl = document.getElementById('wjx-tab-settings');
                    const parseEl = document.getElementById('wjx-tab-parse');
                    const ratioEl = document.getElementById('wjx-tab-ratio');
                    const helpEl = document.getElementById('wjx-tab-help');
                    const allTabs = panel.querySelectorAll('.wjx-tab');
                    allTabs.forEach(x => x.classList.remove('active'));
                    if (settingsTab) settingsTab.classList.add('active');
                    [parseEl, ratioEl, settingsEl, helpEl].forEach(el => el && el.classList.remove('active'));
                    settingsEl && settingsEl.classList.add('active');
                    return;
                }
                tabs.forEach(x => x.classList.remove('active'));
                t.classList.add('active');
                const tab = t.dataset.tab;
                const parseEl = document.getElementById('wjx-tab-parse');
                const ratioEl = document.getElementById('wjx-tab-ratio');
                const settingsEl = document.getElementById('wjx-tab-settings');
                const helpEl = document.getElementById('wjx-tab-help');
                [parseEl, ratioEl, settingsEl, helpEl].forEach(el => el && el.classList.remove('active'));
                
                if (tab === 'settings') settingsEl && settingsEl.classList.add('active');
                else if (tab === 'ratio') ratioEl && ratioEl.classList.add('active');
                else if (tab === 'help') helpEl && helpEl.classList.add('active');
                else parseEl && parseEl.classList.add('active');
            };
        });

        // 自动模式下始终显示设置Tab
        if (isAutoMode()) {
            const settingsTab = panel.querySelector('.wjx-tab[data-tab="settings"]');
            if (settingsTab) settingsTab.click();
        }

        const parseUrlEl = document.getElementById('wjx-parse-url');
        const parseGoBtn = document.getElementById('wjx-parse-go');
        const parseOpenBtn = document.getElementById('wjx-parse-open');
        const parseProgress = document.getElementById('wjx-parse-progress');

        const fixedUrlEl = document.getElementById('wjx-fixed-url');
        const timeMinEl = document.getElementById('wjx-time-min');
        const timeMaxEl = document.getElementById('wjx-time-max');
        const answerModeEl = document.getElementById('wjx-answer-mode');
        const openFixedBtn = document.getElementById('wjx-open-fixed');
        const clearConfigBtn = document.getElementById('wjx-clear-config');
        const clearRatioBtn = document.getElementById('wjx-clear-ratio');

        try {
            if ((helperSettings.answerMode || 'human') === 'instant') {
                if (timeMinEl) timeMinEl.value = '1';
                if (timeMaxEl) timeMaxEl.value = '2';
            }
        } catch (e) {}

        const persistSettings = () => {
            const inputFixedUrl = ((fixedUrlEl && fixedUrlEl.value) || '').trim();
            const inputParseUrl = ((parseUrlEl && parseUrlEl.value) || '').trim();
            const nextFixedUrl = inputFixedUrl || inputParseUrl || (helperSettings.fixedUrl || '').trim();
            saveSettings({
                fixedUrl: nextFixedUrl,
                timeMinSec: Number(timeMinEl && timeMinEl.value) || 0,
                timeMaxSec: Number(timeMaxEl && timeMaxEl.value) || 0,
                answerMode: ((answerModeEl && answerModeEl.value) || (helperSettings.answerMode) || 'human')
            });
        };

        if (fixedUrlEl) fixedUrlEl.onchange = persistSettings;
        if (timeMinEl) timeMinEl.onchange = persistSettings;
        if (timeMaxEl) timeMaxEl.onchange = persistSettings;
        if (answerModeEl) {
            answerModeEl.onchange = () => {
                try {
                    if (answerModeEl.value === 'instant') {
                        if (timeMinEl) timeMinEl.value = '1';
                        if (timeMaxEl) timeMaxEl.value = '2';
                    }
                } catch (e) {}
                persistSettings();
            };
        }

        if (openFixedBtn) {
            openFixedBtn.onclick = () => {
                persistSettings();
                const url = (helperSettings.fixedUrl || '').trim();
                if (!url) {
                    showToast('⚠️ 请先填写固定问卷链接');
                    return;
                }
                window.open(url, '_blank');
            };
        }

        if (clearConfigBtn) {
            clearConfigBtn.onclick = () => {
                try {
                    if (fixedUrlEl) fixedUrlEl.value = '';
                    if (timeMinEl) timeMinEl.value = '0';
                    if (timeMaxEl) timeMaxEl.value = '0';
                    if (parseUrlEl) parseUrlEl.value = '';

                    saveSettings({ fixedUrl: '', timeMinSec: 0, timeMaxSec: 0, answerMode: 'human' });
                    setAutoMode(false);
                    setTargetUrl('');
                    setTargetCount(0);

                    const autoProgress = document.getElementById('wjx-auto-progress');
                    if (autoProgress) {
                        autoProgress.classList.remove('active');
                        autoProgress.textContent = '';
                        autoProgress.style.cssText = '';
                    }
                } catch (e) {}
                showToast('✅ 已清空配置');
            };
        }

        if (clearRatioBtn) {
            clearRatioBtn.onclick = () => {
                try {
                    localStorage.removeItem(getRatioStorageKey());
                } catch (e) {}

                try {
                    surveyData.questions = [];
                } catch (e) {}

                try {
                    renderQuestions();
                    const stat = document.querySelector('.wjx-stats strong');
                    if (stat) stat.textContent = '0';
                } catch (e) {}

                showToast('✅ 已清空配比/解析缓存');
            };
        }

        const persistParseUrl = () => {
            if (!parseUrlEl) return;
            saveSettings({ fixedUrl: (parseUrlEl.value || '').trim() });
        };
        if (parseUrlEl) parseUrlEl.onchange = persistParseUrl;

        const startParseFlow = (openInNewTab) => {
            persistParseUrl();
            const url = (helperSettings.fixedUrl || '').trim();
            if (!url) {
                showToast('⚠️ 请先输入问卷链接');
                return;
            }
            const target = normalizeUrl(url);
            const current = normalizeUrl(location.href);
            sessionStorage.setItem(getPendingParseKey(), JSON.stringify({ url: target, ts: Date.now() }));
            if (parseProgress) {
                parseProgress.classList.add('active');
                parseProgress.textContent = '正在打开问卷并准备解析...';
            }
            if (target === current) {
                // 当前就是目标页，直接解析
                if (!isSurveyQuestionPage()) {
                    showToast('⚠️ 当前页面不是题目页，无法解析');
                    return;
                }
                parseSurvey();
                renderQuestions();
                const stat = document.querySelector('.wjx-stats strong');
                if (stat) stat.textContent = surveyData.questions.length;
                saveRatioConfig();
                sessionStorage.removeItem(getPendingParseKey());
                showToast('✅ 解析完成并已保存配比');
                // 切到配比Tab
                const ratioTab = panel.querySelector('.wjx-tab[data-tab="ratio"]');
                if (ratioTab) ratioTab.click();
                return;
            }
            if (openInNewTab) window.open(target, '_blank');
            else location.href = target;
        };

        if (parseGoBtn) parseGoBtn.onclick = () => startParseFlow(false);
        if (parseOpenBtn) parseOpenBtn.onclick = () => startParseFlow(true);

        // 自动循环模式按钮事件
        const resetCountBtn = document.getElementById('wjx-reset-count');
        const targetCountEl = document.getElementById('wjx-target-count');
        const startAutoBtn = document.getElementById('wjx-start-auto');
        const stopAutoBtn = document.getElementById('wjx-stop-auto');
        const autoProgress = document.getElementById('wjx-auto-progress');
        const countDisplay = document.getElementById('wjx-count-display');
        const unlockStatusEl = document.getElementById('wjx-auto-unlock-status');
        const unlockKeyEl = document.getElementById('wjx-unlock-key');
        const unlockBtn = document.getElementById('wjx-unlock-btn');
        const lockBtn = document.getElementById('wjx-lock-btn');

        const refreshAutoLoopUi = () => {
            const unlocked = isAutoLoopUnlocked();
            if (unlockStatusEl) unlockStatusEl.textContent = unlocked ? '已解锁（不限）' : '未解锁（最多20份）';
            const unlockSection = document.getElementById('wjx-unlock-section');
            if (unlockSection) {
                unlockSection.style.display = unlocked ? 'none' : 'block';
            }
            if (targetCountEl) {
                if (!unlocked) {
                    targetCountEl.disabled = true;
                    targetCountEl.max = String(AUTO_LOOP_LIMIT_WHEN_LOCKED);
                    const n = parseInt(targetCountEl.value, 10);
                    if (!Number.isNaN(n) && n > AUTO_LOOP_LIMIT_WHEN_LOCKED) {
                        targetCountEl.value = String(AUTO_LOOP_LIMIT_WHEN_LOCKED);
                        setTargetCount(AUTO_LOOP_LIMIT_WHEN_LOCKED);
                    }
                } else {
                    targetCountEl.disabled = false;
                    targetCountEl.removeAttribute('max');
                }
            }
        };

        refreshAutoLoopUi();

        if (unlockBtn) {
            unlockBtn.onclick = () => {
                const input = normalizeKeyInput(unlockKeyEl && unlockKeyEl.value);
                const expected = getExpectedAutoLoopKey('');
                if (!input) {
                    showToast('⚠️ 请输入卡密');
                    return;
                }
                if (input !== expected) {
                    showToast('❌ 卡密错误');
                    return;
                }
                setAutoLoopUnlocked(true);
                refreshAutoLoopUi();
                showToast('✅ 已解锁：目标份数不再限制');
            };
        }

        if (lockBtn) {
            lockBtn.onclick = () => {
                setAutoLoopUnlocked(false);
                refreshAutoLoopUi();
                showToast('✅ 已恢复限制');
            };
        }

        if (resetCountBtn) {
            resetCountBtn.onclick = () => {
                resetCount();
                setAutoMode(false);
                setTargetUrl('');
                setTargetCount(0);

                if (countDisplay) countDisplay.textContent = '0';
                if (targetCountEl) targetCountEl.value = '';
                if (autoProgress) {
                    autoProgress.classList.remove('active');
                    autoProgress.textContent = '';
                }
                showToast('✅ 已重置自动循环');
            };
        }

        if (targetCountEl) {
            targetCountEl.onchange = () => {
                let val = parseInt(targetCountEl.value, 10);
                if (Number.isNaN(val)) val = 0;
                if (!isAutoLoopUnlocked()) {
                    if (val <= 0) {
                        showToast('⚠️ 未解锁仅支持 1-20 份；0=无限需解锁');
                        val = AUTO_LOOP_LIMIT_WHEN_LOCKED;
                        targetCountEl.value = String(val);
                    }
                    if (val > AUTO_LOOP_LIMIT_WHEN_LOCKED) {
                        showToast(`⚠️ 未解锁最多只能填写 ${AUTO_LOOP_LIMIT_WHEN_LOCKED} 份`);
                        val = AUTO_LOOP_LIMIT_WHEN_LOCKED;
                        targetCountEl.value = String(val);
                    }
                }
                setTargetCount(val || 0);
                refreshAutoLoopUi();
            };
        }

        if (startAutoBtn) {
            startAutoBtn.onclick = () => {
                persistSettings();
                const url = (helperSettings.fixedUrl || '').trim();
                if (!url) {
                    showToast('⚠️ 请先在上方填写固定问卷链接');
                    return;
                }
                let targetCount = parseInt(targetCountEl?.value, 10);
                if (Number.isNaN(targetCount)) targetCount = 0;
                if (!isAutoLoopUnlocked()) {
                    if (targetCount <= 0) {
                        showToast(`⚠️ 未解锁仅支持 1-${AUTO_LOOP_LIMIT_WHEN_LOCKED} 份；0=无限需解锁`);
                        return;
                    }
                    if (targetCount > AUTO_LOOP_LIMIT_WHEN_LOCKED) {
                        showToast(`⚠️ 未解锁最多只能填写 ${AUTO_LOOP_LIMIT_WHEN_LOCKED} 份`);
                        return;
                    }
                }
                setTargetCount(targetCount);
                setTargetUrl(url);
                setAutoMode(true);

                const panel = document.getElementById('wjx-helper-panel');
                if (panel) {
                    const settingsTab = panel.querySelector('.wjx-tab[data-tab="settings"]');
                    if (settingsTab) settingsTab.click();
                }

                if (autoProgress) {
                    autoProgress.classList.add('active');
                    autoProgress.style.background = '#d4edda';
                    autoProgress.style.color = '#155724';
                    autoProgress.textContent = '🔄 自动模式已启动，正在准备...';
                }
                showToast('🚀 自动循环模式已启动');

                // 如果当前是问卷页，立即开始填写
                if (isSurveyQuestionPage()) {
                    handleAutoFillAndSubmit();
                } else {
                    // 否则跳转到问卷页
                    location.href = url;
                }
            };
        }

        if (stopAutoBtn) {
            stopAutoBtn.onclick = () => {
                setAutoMode(false);
                if (autoProgress) {
                    autoProgress.classList.remove('active');
                    autoProgress.textContent = '';
                }

                const panel = document.getElementById('wjx-helper-panel');
                if (panel) {
                    const parseTab = panel.querySelector('.wjx-tab[data-tab="parse"]');
                    if (parseTab) parseTab.click();
                }
                showToast('⏹ 自动循环模式已停止');
            };
        }

        // 拖拽功能
        makeDraggable(panel, document.getElementById('wjx-helper-header'));
    }

    // 自动循环：问卷页处理（自动填写+提交）
    async function handleAutoFillAndSubmit() {
        if (!isAutoMode()) return;
        if (!isSurveyQuestionPage()) return;

        startResumeAnswerDialogWatcher();

        const waitSec = getPrefillWaitSec();

        console.log(`[星球问卷助手] 自动模式：等待 ${waitSec}s 后开始填写...`);
        showToastGlobal(`⏳ 自动模式：${waitSec}s 后开始填写...`);

        if (waitSec > 0) {
            await new Promise(r => setTimeout(r, waitSec * 1000));
        }

        if (!isAutoMode()) return; // 检查是否被停止

        const captchaOk = await waitForCaptchaClear(25000);
        if (!captchaOk) return;

        // 解析并填写
        parseSurvey();
        await fillSurveyByMode();

        // 延迟后自动提交
        const submitDelay = 1000 + Math.random() * 1000;
        setTimeout(() => {
            if (!isAutoMode()) return;
            autoSubmit();
        }, submitDelay);
    }

    // 处理偏向单选按钮变化（事件委托）
    function handleBiasRadioChange(e) {
        if (!e.target.classList.contains('wjx-bias-radio')) return;
        const qIndex = parseInt(e.target.dataset.q);
        const bias = e.target.dataset.bias;
        if (bias === 'center') {
            surveyData.questions[qIndex].bias = undefined;
        } else {
            surveyData.questions[qIndex].bias = bias;
        }
        console.log('[星球问卷助手] 设置偏向:', qIndex, bias);
        try { saveRatioConfig(); } catch (err) {}
    }

    // 渲染题目列表
    function renderQuestions() {
        const container = document.getElementById('wjx-questions-container');
        container.innerHTML = '';

        surveyData.questions.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'wjx-question-item';

            const typeLabels = {
                'radio': '单选',
                'checkbox': '多选',
                'select': '下拉',
                'text': '填空',
                'slider': '滑块',
                'scale': '量表',
                'matrix': '矩阵',
                'sort': '排序'
            };

            let optionsHtml = '';

            const supportsPsycho = (q.type === 'radio' || q.type === 'select' || q.type === 'scale' || q.type === 'matrix');
            const psychoHtml = supportsPsycho ? `
                    <label class="wjx-psy-chip ${q.psycho ? 'active' : ''}" title="勾选后该题按信效度算法生成（不勾按百分比随机）">
                        <input type="checkbox" class="wjx-psy-toggle" data-q="${qIndex}" ${q.psycho ? 'checked' : ''}>
                        <span class="wjx-psy-icon">✨</span>
                        信效度
                        <span class="wjx-psy-mark">✓</span>
                    </label>
                ` : '';

            const biasHtml = (supportsPsycho && q.psycho) ? `
                    <div class="wjx-bias-group">
                        <button type="button" class="wjx-bias-btn ${(q.bias === 'left') ? 'active' : ''}" data-q="${qIndex}" data-bias="left">👈 倾向左侧</button>
                        <button type="button" class="wjx-bias-btn ${(q.bias !== 'left' && q.bias !== 'right') ? 'active' : ''}" data-q="${qIndex}" data-bias="center">中立</button>
                        <button type="button" class="wjx-bias-btn ${(q.bias === 'right') ? 'active' : ''}" data-q="${qIndex}" data-bias="right">倾向右侧 👉</button>
                    </div>
                ` : '';

            if (q.type === 'radio' || q.type === 'checkbox' || q.type === 'select' || q.type === 'scale') {
                if (!q.psycho) {
                    q.options.forEach((opt, optIndex) => {
                        optionsHtml += `
                            <div class="wjx-option-item">
                                <span class="wjx-option-label" title="${opt.text}">${opt.text}</span>
                                <input type="number" class="wjx-option-input" 
                                    data-q="${qIndex}" data-opt="${optIndex}"
                                    value="${opt.percent}" min="0" max="100">
                                <span class="wjx-percent-label">%</span>
                            </div>
                        `;
                    });
                }
            } else if (q.type === 'matrix') {
                if (!q.psycho) {
                    optionsHtml = `<div style="font-size:12px;color:#666;padding:5px 0;">
                        共 ${q.matrixRows.length} 行，每行随机选择一个选项
                    </div>`;
                }
            } else if (q.type === 'slider') {
                optionsHtml = `
                    <input type="text" class="wjx-fill-input" 
                        data-q="${qIndex}" 
                        value="${q.fillText}" 
                        placeholder="0-100">
                `;
            } else if (q.type === 'text') {
                optionsHtml = `
                    <input type="text" class="wjx-fill-input" 
                        data-q="${qIndex}" 
                        value="${q.fillText}" 
                        placeholder="请输入要填写的内容">
                    <div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
                        <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#555;flex:1;">
                            <input type="checkbox" class="wjx-num-toggle" data-q="${qIndex}" ${q.isNumeric ? 'checked' : ''}>
                            随机数字
                        </label>
                        <input type="number" class="wjx-min-input" data-q="${qIndex}" value="${q.minNum ?? ''}" style="width:72px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px;" placeholder="最小">
                        <input type="number" class="wjx-max-input" data-q="${qIndex}" value="${q.maxNum ?? ''}" style="width:72px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px;" placeholder="最大">
                        <button type="button" class="wjx-randomize-btn wjx-gen-num-btn" data-q="${qIndex}" style="margin-left:0;">生成</button>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
                        <button type="button" class="wjx-randomize-btn wjx-gen-name-btn" data-q="${qIndex}" style="margin-left:0;">随机姓名</button>
                        <button type="button" class="wjx-randomize-btn wjx-ai-btn" data-q="${qIndex}" style="margin-left:0;background:#0d6efd;">AI回答</button>
                    </div>
                `;
            } else if (q.type === 'sort') {
                // 排序题：显示选项列表
                const itemsText = q.sortItems.map((item, i) => `${i + 1}. ${item.text}`).join('、');
                optionsHtml = `<div style="font-size:12px;color:#666;padding:5px 0;">
                    共 ${q.sortItems.length} 个选项，将随机排序<br>
                    <span style="color:#888;">${itemsText}</span>
                </div>`;
            }

            qDiv.innerHTML = `
                <div class="wjx-question-title">
                    ${qIndex + 1}. ${q.title}
                    <span class="wjx-question-type">${typeLabels[q.type]}</span>
                    ${psychoHtml}
                </div>
                ${biasHtml}
                ${optionsHtml}
            `;

            container.appendChild(qDiv);
        });

        // 绑定输入事件
        container.querySelectorAll('.wjx-option-input').forEach(input => {
            input.onchange = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const optIndex = parseInt(e.target.dataset.opt);
                surveyData.questions[qIndex].options[optIndex].percent = parseInt(e.target.value) || 0;
            };
        });

        container.querySelectorAll('.wjx-fill-input').forEach(input => {
            input.onchange = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                surveyData.questions[qIndex].fillText = e.target.value;
            };
        });

        container.querySelectorAll('.wjx-num-toggle').forEach(chk => {
            chk.onchange = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                surveyData.questions[qIndex].isNumeric = !!e.target.checked;
            };
        });

        container.querySelectorAll('.wjx-psy-toggle').forEach(chk => {
            chk.onchange = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                surveyData.questions[qIndex].psycho = !!e.target.checked;
                const label = e.target.closest('.wjx-psy-chip');
                if (label) label.classList.toggle('active', !!e.target.checked);
                renderQuestions();
                try { saveRatioConfig(); } catch (err) {}
            };
        });

        // 绑定偏向按钮事件（不用radio，避免问卷星页面CSS隐藏radio导致无法操作）
        container.querySelectorAll('.wjx-bias-btn').forEach(btn => {
            btn.onclick = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const bias = e.target.dataset.bias;
                if (bias === 'center') {
                    surveyData.questions[qIndex].bias = undefined;
                } else {
                    surveyData.questions[qIndex].bias = bias;
                }
                const group = e.target.closest('.wjx-bias-group');
                if (group) {
                    group.querySelectorAll('.wjx-bias-btn').forEach(b => b.classList.toggle('active', b === e.target));
                }
                try { saveRatioConfig(); } catch (err) {}
            };
        });

        container.querySelectorAll('.wjx-min-input').forEach(inp => {
            inp.onchange = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const v = parseInt(e.target.value, 10);
                surveyData.questions[qIndex].minNum = Number.isNaN(v) ? undefined : v;
            };
        });

        container.querySelectorAll('.wjx-max-input').forEach(inp => {
            inp.onchange = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const v = parseInt(e.target.value, 10);
                surveyData.questions[qIndex].maxNum = Number.isNaN(v) ? undefined : v;
            };
        });

        container.querySelectorAll('.wjx-gen-num-btn').forEach(btn => {
            btn.onclick = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const q = surveyData.questions[qIndex];
                q.isNumeric = true;
                const min = typeof q.minNum === 'number' ? q.minNum : 0;
                const max = typeof q.maxNum === 'number' ? q.maxNum : min;
                const value = String(randomIntInclusive(min, max));
                q.fillText = value;
                const inputEl = container.querySelector(`.wjx-fill-input[data-q="${qIndex}"]`);
                if (inputEl) inputEl.value = value;
                const toggleEl = container.querySelector(`.wjx-num-toggle[data-q="${qIndex}"]`);
                if (toggleEl) toggleEl.checked = true;
            };
        });

        container.querySelectorAll('.wjx-gen-name-btn').forEach(btn => {
            btn.onclick = (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const q = surveyData.questions[qIndex];
                const value = randomFromArray(namePool);
                q.fillText = value;
                const inputEl = container.querySelector(`.wjx-fill-input[data-q="${qIndex}"]`);
                if (inputEl) inputEl.value = value;
            };
        });

        container.querySelectorAll('.wjx-ai-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const qIndex = parseInt(e.target.dataset.q);
                const q = surveyData.questions[qIndex];
                const copyContent = (q && q.fullTitle) ? q.fullTitle : (q && q.title ? q.title : '');
                const prompt = `请根据[复制内容]口语化生成40条内容，每条字数5-15字，不可以重复，不可以带有序号。每一条回复用；间隔\n\n[复制内容]\n${copyContent}`;
                const ok = await copyToClipboard(prompt);
                if (ok) showToast('✅ 已复制提示词，已打开 Kimi');
                else showToast('⚠️ 复制失败，但已打开 Kimi');
                window.open('https://www.kimi.com/', '_blank');
            };
        });
    }

    function randomIntInclusive(min, max) {
        let a = parseInt(min, 10);
        let b = parseInt(max, 10);
        if (Number.isNaN(a)) a = 0;
        if (Number.isNaN(b)) b = a;
        if (a > b) [a, b] = [b, a];
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    function dispatchBubbledEvent(el, type) {
        if (!el) return;
        try {
            el.dispatchEvent(new Event(type, { bubbles: true }));
        } catch (e) {}
    }

    function setInputValueAndTrigger(el, value) {
        if (!el) return;
        try { el.focus(); } catch (e) {}
        try { el.value = value; } catch (e) {}
        dispatchBubbledEvent(el, 'input');
        dispatchBubbledEvent(el, 'change');
        dispatchBubbledEvent(el, 'keyup');
        dispatchBubbledEvent(el, 'blur');
    }

    function ensureOtherTextFilled(option, questionEl) {
        const inputEl = option && option.inputElement;
        if (!inputEl) return;

        let t = option.otherTextElement;
        if (!t) {
            try {
                const relId = inputEl.getAttribute('rel');
                if (relId) {
                    t = (questionEl ? questionEl.querySelector('#' + relId) : null) || document.getElementById(relId);
                }
            } catch (e) {}
        }
        if (!t && inputEl.id && questionEl) {
            try {
                t = questionEl.querySelector(`input.OtherText[rel="${inputEl.id}"], textarea[rel="${inputEl.id}"], input[type="text"][rel="${inputEl.id}"]`);
            } catch (e) {}
        }
        if (!t) return;

        const val = ((t.value == null) ? '' : String(t.value)).trim();
        if (val) return;

        const required = (t.getAttribute && t.getAttribute('required') === 'true') || !!t.required;
        const visible = t.offsetParent !== null;
        if (!required && !visible) return;

        setInputValueAndTrigger(t, '其他');
    }

    function syncWjxCheckboxUiToInput() {
        // 问卷星移动端：checkbox input 可能被隐藏，UI用 a.jqcheck + jqchecked 表示
        // 提交前强制把 UI 的“已选”同步到 input.checked，避免校验提示“未选择”
        try {
            const checkedAnchors = document.querySelectorAll('a.jqcheck.jqchecked');
            checkedAnchors.forEach(a => {
                const wrapper = a.closest('.jqcheckwrapper, .ui-checkbox');
                if (!wrapper) return;
                const input = wrapper.querySelector('input[type="checkbox"]');
                if (!input) return;

                if (!input.checked) {
                    try { input.checked = true; } catch (e) {}
                    dispatchBubbledEvent(input, 'input');
                    dispatchBubbledEvent(input, 'change');
                }

                // 处理“其他”选项：input 可能带 rel 指向文本框 id
                try {
                    const relId = input.getAttribute('rel');
                    if (relId) {
                        const t = document.getElementById(relId) || wrapper.closest('.field')?.querySelector('#' + relId);
                        if (t) {
                            const val = ((t.value == null) ? '' : String(t.value)).trim();
                            const required = (t.getAttribute && t.getAttribute('required') === 'true') || !!t.required;
                            const visible = t.offsetParent !== null;
                            if (!val && (required || visible)) {
                                setInputValueAndTrigger(t, '其他');
                            }
                        }
                    }
                } catch (e) {}
            });
        } catch (e) {}
    }

    function forceCheckboxVisual(inputEl, checked) {
        if (!inputEl) return;
        const wrapper = inputEl.closest('.jqcheckwrapper, .ui-checkbox');
        const a = wrapper ? wrapper.querySelector('a.jqcheck') : null;
        if (a && a.classList) {
            try { a.classList.toggle('jqchecked', !!checked); } catch (e) {}
        }
    }

    function forceCheckboxCheckedSync(option, questionEl) {
        const inputEl = option && option.inputElement;
        if (!inputEl) return false;
        if (inputEl.checked) return true;

        const clickTargets = [];
        if (option.element) clickTargets.push(option.element);
        if (inputEl.id && questionEl) {
            const labelDiv = questionEl.querySelector(`.label[for="${inputEl.id}"]`);
            if (labelDiv) clickTargets.push(labelDiv);
        }
        clickTargets.push(inputEl);

        for (const el of clickTargets) {
            try { el.click(); } catch (e) {}
            if (inputEl.checked) {
                ensureOtherTextFilled(option, questionEl);
                return true;
            }
        }

        try { inputEl.checked = true; } catch (e) {}
        dispatchBubbledEvent(inputEl, 'input');
        dispatchBubbledEvent(inputEl, 'change');
        forceCheckboxVisual(inputEl, true);
        ensureOtherTextFilled(option, questionEl);
        return !!inputEl.checked;
    }

    async function forceCheckboxCheckedHuman(option, questionEl) {
        const inputEl = option && option.inputElement;
        if (!inputEl) return false;
        if (inputEl.checked) return true;

        const clickTargets = [];
        if (option.element) clickTargets.push(option.element);
        if (inputEl.id && questionEl) {
            const labelDiv = questionEl.querySelector(`.label[for="${inputEl.id}"]`);
            if (labelDiv) clickTargets.push(labelDiv);
        }
        clickTargets.push(inputEl);

        for (const el of clickTargets) {
            try {
                await humanClick(el);
                await sleep(80 + Math.random() * 160);
            } catch (e) {
                try { el.click(); } catch (e2) {}
            }
            if (inputEl.checked) {
                ensureOtherTextFilled(option, questionEl);
                return true;
            }
        }

        try { inputEl.checked = true; } catch (e) {}
        dispatchBubbledEvent(inputEl, 'input');
        dispatchBubbledEvent(inputEl, 'change');
        forceCheckboxVisual(inputEl, true);
        ensureOtherTextFilled(option, questionEl);
        return !!inputEl.checked;
    }

    function randomFromArray(arr) {
        if (!arr || arr.length === 0) return '';
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function splitCandidateTexts(text) {
        const raw = (text == null) ? '' : String(text);
        const parts = raw.split(/[；;]+/g).map(s => s.trim()).filter(Boolean);
        return parts;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                ta.style.top = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                const ok = document.execCommand('copy');
                ta.remove();
                return ok;
            } catch (e2) {
                return false;
            }
        }
    }

    // 随机生成所有百分比
    function randomizeAllPercents() {
        surveyData.questions.forEach((q, qIndex) => {
            if (q.type === 'radio' || q.type === 'select' || q.type === 'scale') {
                // 单选/下拉/量表：生成随机百分比，总和为100
                const percents = generateRandomPercents(q.options.length);
                q.options.forEach((opt, i) => {
                    opt.percent = percents[i];
                });
            } else if (q.type === 'checkbox') {
                // 多选：每个选项独立随机
                q.options.forEach(opt => {
                    opt.percent = Math.floor(Math.random() * 101);
                });
            } else if (q.type === 'slider') {
                q.fillText = String(Math.floor(Math.random() * 101));
            }
            // 矩阵题保持默认均匀分布
        });
        renderQuestions();
    }

    // 生成随机百分比数组，总和为100
    function generateRandomPercents(count) {
        if (count === 0) return [];
        if (count === 1) return [100];

        const percents = [];
        let remaining = 100;

        for (let i = 0; i < count - 1; i++) {
            const max = remaining - (count - i - 1);
            const value = Math.floor(Math.random() * (max + 1));
            percents.push(value);
            remaining -= value;
        }
        percents.push(remaining);

        // 打乱顺序
        for (let i = percents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [percents[i], percents[j]] = [percents[j], percents[i]];
        }

        return percents;
    }

    // 根据百分比随机选择
    function selectByPercent(options) {
        const random = Math.random() * 100;
        let cumulative = 0;

        for (let i = 0; i < options.length; i++) {
            cumulative += options[i].percent;
            if (random < cumulative) {
                return i;
            }
        }
        return options.length - 1;
    }

    // 拟人化慢速填写（逐题移动并点击，避免瞬间全选）
    async function fillSurveyHuman() {
        const psychoPlan = buildPsychometricPlan(surveyData.questions || []);
        for (const q of surveyData.questions) {
            try {
                if (isCaptchaVisible()) {
                    const ok = await waitForCaptchaClear(25000);
                    if (!ok) return;
                }

                if (q.type === 'radio') {
                    const key = `q:${q.index}`;
                    const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(q.options);
                    const el = q.options[selectedIndex]?.element;
                    if (el) {
                        await humanClick(el);
                        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
                    }
                } else if (q.type === 'checkbox') {
                    for (const opt of q.options) {
                        const choose = Math.random() * 100 < (Number(opt.percent) || 0);
                        if (!choose) continue;
                        await forceCheckboxCheckedHuman(opt, q.element);
                        await sleep(120 + Math.random() * 260);
                    }

                    const chosenCount = (q.options || []).filter(o => o && o.inputElement && o.inputElement.checked).length;
                    if ((q.required || q.req) && chosenCount === 0 && q.options && q.options.length > 0) {
                        const candidates = q.options.filter(o => !(o.inputElement && o.inputElement.checked));
                        const pickFrom = candidates.length > 0 ? candidates : q.options;
                        const weights = pickFrom.map(o => ({ percent: Math.max(1, Number(o.percent) || 0) }));
                        const idx = selectByPercent(weights);
                        const opt = pickFrom[idx];
                        if (opt) {
                            await forceCheckboxCheckedHuman(opt, q.element);
                            await sleep(120 + Math.random() * 260);
                        }
                    }
                } else if (q.type === 'select') {
                    if (q.selectElement && q.options && q.options.length > 0) {
                        const key = `q:${q.index}`;
                        const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(q.options);
                        const val = q.options[selectedIndex]?.value;
                        try {
                            await humanMoveTo(q.selectElement);
                            await sleep(80 + Math.random() * 160);
                            q.selectElement.value = val;
                            q.selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                        } catch (e) {}
                    }
                } else if (q.type === 'text') {
                    if (q.textElement) {
                        let fillValue = q.fillText;
                        if (q.isNumeric) {
                            const min = typeof q.minNum === 'number' ? q.minNum : 0;
                            const max = typeof q.maxNum === 'number' ? q.maxNum : min;
                            fillValue = String(randomIntInclusive(min, max));
                        } else {
                            const candidates = splitCandidateTexts(q.fillText);
                            if (candidates.length > 0) fillValue = randomFromArray(candidates);
                        }
                        await humanMoveTo(q.textElement);
                        await sleep(120 + Math.random() * 220);
                        try {
                            setInputValueAndTrigger(q.textElement, fillValue);
                        } catch (e) {}
                    }
                } else if (q.type === 'slider') {
                    if (q.textElement) {
                        let v = parseInt(q.fillText, 10);
                        if (Number.isNaN(v)) v = Math.floor(Math.random() * 101);
                        if (v < 0) v = 0;
                        if (v > 100) v = 100;
                        await humanMoveTo(q.textElement);
                        await sleep(100 + Math.random() * 180);
                        try {
                            q.textElement.focus();
                            q.textElement.value = String(v);
                            q.textElement.dispatchEvent(new Event('input', { bubbles: true }));
                            q.textElement.dispatchEvent(new Event('change', { bubbles: true }));
                        } catch (e) {}
                    }
                } else if (q.type === 'scale') {
                    const key = `q:${q.index}`;
                    const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(q.options);
                    const el = q.options[selectedIndex]?.element;
                    if (el) {
                        await humanClick(el);
                    }
                } else if (q.type === 'matrix') {
                    for (const row of (q.matrixRows || [])) {
                        if (!row.options || row.options.length === 0) continue;
                        const rIndex = (q.matrixRows || []).indexOf(row);
                        const key = `m:${q.index}:${rIndex}`;
                        const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(row.options);
                        const el = row.options[selectedIndex]?.element;
                        if (el) {
                            await humanClick(el);
                            await sleep(140 + Math.random() * 260);
                        }
                    }
                } else if (q.type === 'sort') {
                    const items = q.sortItems || [];
                    const indices = items.map((_, i) => i);
                    for (let i = indices.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [indices[i], indices[j]] = [indices[j], indices[i]];
                    }
                    for (let k = 0; k < indices.length; k++) {
                        const el = items[indices[k]]?.element;
                        if (el) {
                            await humanClick(el);
                            await sleep(160 + Math.random() * 260);
                        }
                    }
                }
            } catch (e) {
                console.error('拟人化填写题目出错:', q.title, e);
            }

            await sleep(220 + Math.random() * 520);
        }

        showToast('✅ 填写完成！请检查后提交');
    }

    function fillSurveyInstantAll() {
        // 瞬时模式：一次性快速完成整份问卷
        // - 单选/量表/矩阵/填空等保持原有“非拟人化”逻辑
        // - 多选题按用户需求：默认全选（避免出现“没选中”校验问题）
        try {
            fillSurvey();
        } catch (e) {}
    }

    // 填写问卷
    function fillSurvey() {
        const psychoPlan = buildPsychometricPlan(surveyData.questions || []);
        surveyData.questions.forEach(q => {
            try {
                if (q.type === 'radio') {
                    // 单选题
                    const key = `q:${q.index}`;
                    const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(q.options);
                    const input = q.options[selectedIndex].element;
                    if (input) {
                        input.click();
                        // 触发change事件
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else if (q.type === 'checkbox') {
                    // 多选题 - 点击 a.jqcheck，用 inputElement 检查是否已选中
                    q.options.forEach(opt => {
                        if (Math.random() * 100 < opt.percent) {
                            forceCheckboxCheckedSync(opt, q.element);
                        }
                    });

                    const chosenCount = (q.options || []).filter(o => o && o.inputElement && o.inputElement.checked).length;
                    if ((q.required || q.req) && chosenCount === 0 && q.options && q.options.length > 0) {
                        const candidates = q.options.filter(o => !(o.inputElement && o.inputElement.checked));
                        const pickFrom = candidates.length > 0 ? candidates : q.options;
                        const weights = pickFrom.map(o => ({ percent: Math.max(1, Number(o.percent) || 0) }));
                        const idx = selectByPercent(weights);
                        const opt = pickFrom[idx];
                        if (opt) {
                            forceCheckboxCheckedSync(opt, q.element);
                        }
                    }
                } else if (q.type === 'select') {
                    // 下拉题
                    const key = `q:${q.index}`;
                    const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(q.options);
                    if (q.selectElement && q.options[selectedIndex]) {
                        q.selectElement.value = q.options[selectedIndex].value;
                        q.selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else if (q.type === 'text') {
                    // 填空题
                    if (q.textElement) {
                        let fillValue = q.fillText;
                        if (q.isNumeric) {
                            const min = typeof q.minNum === 'number' ? q.minNum : 0;
                            const max = typeof q.maxNum === 'number' ? q.maxNum : min;
                            fillValue = String(randomIntInclusive(min, max));
                        } else {
                            const candidates = splitCandidateTexts(q.fillText);
                            if (candidates.length > 0) fillValue = randomFromArray(candidates);
                        }
                        setInputValueAndTrigger(q.textElement, fillValue);
                    }
                } else if (q.type === 'slider') {
                    // 滑块题（0-100）
                    if (q.textElement) {
                        let v = parseInt(q.fillText, 10);
                        if (Number.isNaN(v)) v = Math.floor(Math.random() * 101);
                        if (v < 0) v = 0;
                        if (v > 100) v = 100;
                        q.textElement.value = String(v);
                        q.textElement.dispatchEvent(new Event('input', { bubbles: true }));
                        q.textElement.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                } else if (q.type === 'scale') {
                    // 量表题 - 点击 a[val] 元素
                    const key = `q:${q.index}`;
                    const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(q.options);
                    const a = q.options[selectedIndex].element;
                    if (a) {
                        a.click();
                    }
                } else if (q.type === 'matrix') {
                    // 矩阵量表题 - 每行随机点击一个 a[dval]
                    q.matrixRows.forEach(row => {
                        if (row.options.length > 0) {
                            const rIndex = (q.matrixRows || []).indexOf(row);
                            const key = `m:${q.index}:${rIndex}`;
                            const selectedIndex = (psychoPlan && psychoPlan.choices && psychoPlan.choices.has(key)) ? psychoPlan.choices.get(key) : selectByPercent(row.options);
                            const a = row.options[selectedIndex].element;
                            if (a) {
                                a.click();
                            }
                        }
                    });
                } else if (q.type === 'sort') {
                    // 排序题 - 随机打乱顺序后依次点击
                    if (q.sortItems && q.sortItems.length > 0) {
                        // 生成随机排列的索引
                        const indices = q.sortItems.map((_, i) => i);
                        for (let i = indices.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [indices[i], indices[j]] = [indices[j], indices[i]];
                        }
                        // 按随机顺序依次点击每个选项
                        indices.forEach((idx, clickOrder) => {
                            const item = q.sortItems[idx];
                            if (item && item.element) {
                                setTimeout(() => {
                                    item.element.click();
                                }, clickOrder * 100); // 每次点击间隔100ms
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('填写题目出错:', q.title, e);
            }
        });

        // 显示完成提示
        showToast('✅ 填写完成！请检查后提交');
    }

    // 显示提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
            animation: fadeInUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // 显示切换按钮
    function showToggleButton() {
        let btn = document.getElementById('wjx-toggle-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'wjx-toggle-btn';
            btn.className = 'wjx-toggle-btn';
            btn.innerHTML = '📝';
            btn.onclick = () => {
                btn.style.display = 'none';
                const panel = document.getElementById('wjx-helper-panel');
                if (panel) {
                    panel.style.display = 'block';
                } else {
                    createPanel();
                }
            };
            document.body.appendChild(btn);
        }
        btn.style.display = 'flex';
    }

    // 拖拽功能
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 页面加载完成后初始化
    function init() {
        // 启动验证码监控（所有页面都需要）
        startCaptchaWatcher();
        setupIframeMessageListener();
        startResumeAnswerDialogWatcher();

        // 等待页面完全加载
        setTimeout(() => {
            // 检测是否在成功页（自动模式下处理）
            if (isSuccessPage()) {
                console.log('[星球问卷助手] 检测到成功页');

                // iframe内成功页通知父页面（用于弹窗模式刷新计数/自动关闭）
                if (isInIframe()) {
                    try {
                        const currentCount = incrementCount();
                        window.parent && window.parent.postMessage({ type: IFRAME_SUCCESS_TYPE, count: currentCount }, '*');
                    } catch (e) {}

                    // 弹窗模式下，iframe成功页不执行自动循环跳转逻辑
                    return;
                }

                // 顶层页面：自动循环模式才执行跳转；否则也显示面板方便继续打开链接
                if (isAutoMode()) {
                    handleSuccessPage();
                    createPanel();
                    return;
                }

                createPanel();
                showToastGlobal('✅ 检测到提交完成页，可在面板中打开固定链接继续填写');
                return;
            }

            if (!isInIframe()) {
                createPanel();
                consumePendingParseIfMatch();
            }

            // 自动模式：如果是问卷页，自动开始填写
            if (isAutoMode() && isSurveyQuestionPage()) {
                console.log('[问卷星助手] 自动模式：检测到问卷页，准备自动填写...');
                setTimeout(() => {
                    handleAutoFillAndSubmit();
                }, 500);
            }
        }, 1000);
    }

    // 启动
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})();

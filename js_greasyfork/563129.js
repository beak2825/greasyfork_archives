// ==UserScript==
// @name         强密码生成器
// @namespace    https://example.com/
// @version      0.1.0
// @description  在注册/表单页面生成高强度密码并提供复制/注入功能，支持偏好持久化与可选注入确认。
// @author       zskfree
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563129/%E5%BC%BA%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563129/%E5%BC%BA%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置与默认值
    const DEFAULTS = {
        length: 16,
        useUpper: true,
        useLower: true,
        useNumbers: true,
        useSymbols: true,
        excludeSimilar: true,
        autoInject: false,
        showOnAllSites: false,
        showOnPasswordField: true,
        siteWhitelist: '',
        pos: null
    };

    const PREFS_KEY = '强密码生成器.prefs';
    const REGISTER_REGEX = /signup|register|create[-_ ]?account|createaccount|sign[-_ ]?up/i;
    const HOST_ID = 'gm-strong-password-root';
    const DRAG_THRESHOLD = 6;
    const TOAST_DURATION = 1800;
    const OBSERVE_TIMEOUT = 10000;

    let prefs = loadPrefs();
    let lastGenerated = '';

    // ========== 配置管理 ==========
    function loadPrefs() {
        try {
            const stored = GM_getValue(PREFS_KEY);
            if (stored) {
                return Object.assign({}, DEFAULTS, JSON.parse(stored));
            }
        } catch (error) {
            console.warn('加载偏好失败', error);
        }
        return Object.assign({}, DEFAULTS);
    }

    function savePrefs(newPrefs) {
        try {
            GM_setValue(PREFS_KEY, JSON.stringify(newPrefs));
        } catch (error) {
            console.warn('保存偏好失败', error);
        }
    }

    // ========== 站点匹配逻辑 ==========
    function hostMatchesWhitelist() {
        if (!prefs.siteWhitelist) {
            return false;
        }
        const hosts = prefs.siteWhitelist
            .split(',')
            .map(host => host.trim())
            .filter(Boolean);
        return hosts.some(host => {
            try {
                return location.hostname === host || location.hostname.endsWith('.' + host);
            } catch (error) {
                return false;
            }
        });
    }

    function shouldShowUI() {
        try {
            if (prefs.showOnAllSites) {
                return true;
            }
            if (hostMatchesWhitelist()) {
                return true;
            }
            if (prefs.showOnPasswordField && document.querySelector('input[type="password"]')) {
                return true;
            }
            if (REGISTER_REGEX.test(location.pathname + location.href)) {
                return true;
            }
        } catch (error) {
            // 忽略 DOM 查询错误
        }
        return false;
    }

    function observeForPasswordFields(timeout = OBSERVE_TIMEOUT) {
        if (!document.body) {
            return;
        }
        const startTime = Date.now();
        const observer = new MutationObserver(function checkPasswordFields(mutations, obs) {
            if (document.querySelector('input[type="password"]')) {
                ensureUI();
                obs.disconnect();
                return;
            }
            if (Date.now() - startTime > timeout) {
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========== 菜单命令 ==========
    function addMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'function') {
            return;
        }

        function registerCommand(label, callback) {
            try {
                GM_registerMenuCommand(label, callback);
            } catch (error) {
                console.warn('菜单命令注册失败:', error);
            }
        }

        registerCommand(
            `切换：在所有站点显示（当前：${prefs.showOnAllSites ? '是' : '否'}）`,
            function toggleShowAllSites() {
                prefs.showOnAllSites = !prefs.showOnAllSites;
                savePrefs(prefs);
                const status = prefs.showOnAllSites ? '是' : '否';
                alert('设置已更新：在所有站点显示 = ' + status);
            }
        );

        registerCommand(
            '编辑站点白名单',
            function editWhitelist() {
                const current = prefs.siteWhitelist || '';
                const updated = prompt('用逗号分隔主机名（允许后缀匹配），空为清空', current);
                if (updated !== null) {
                    prefs.siteWhitelist = updated;
                    savePrefs(prefs);
                    alert('白名单已保存');
                }
            }
        );

        registerCommand(
            '重置按钮位置',
            function resetButtonPosition() {
                prefs.pos = null;
                savePrefs(prefs);
                const host = document.getElementById(HOST_ID);
                if (host) {
                    host.remove();
                }
                ensureUI();
                alert('按钮位置已重置');
            }
        );

        registerCommand(
            '强密码设置',
            function openSettingsMenu() {
                ensureUI();
                if (typeof window.__gm_sp_openSettings === 'function') {
                    window.__gm_sp_openSettings();
                }
            }
        );
    }

    // ========== 密码生成 ==========
    function randomBytes(length) {
        const arr = new Uint8Array(length);
        crypto.getRandomValues(arr);
        return arr;
    }

    function generatePassword(len = 16, opts = {}) {
        const options = Object.assign({}, prefs, opts);
        const charSets = [];

        if (options.useLower) charSets.push('abcdefghijklmnopqrstuvwxyz');
        if (options.useUpper) charSets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (options.useNumbers) charSets.push('0123456789');
        if (options.useSymbols) charSets.push('!@#$%^&*()-_=+[]{};:,.<>/?');

        const allChars = charSets.join('');
        if (!allChars) {
            return '';
        }

        const similarChars = new Set(['0', 'O', 'o', 'I', 'l', '1']);
        const availableChars = options.excludeSimilar
            ? [...allChars].filter(char => !similarChars.has(char))
            : [...allChars];

        let password = '';
        const randomValues = randomBytes(len);
        for (let i = 0; i < len; i++) {
            password += availableChars[randomValues[i] % availableChars.length];
        }
        return password;
    }

    // ========== 剪贴板与输入框操作 ==========
    async function copyToClipboard(text) {
        // 方法 1: 使用 navigator.clipboard API
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                // 尝试备选方案
            }
        }

        // 方法 2: 使用 Tampermonkey 的 GM_setClipboard
        if (typeof GM_setClipboard === 'function') {
            try {
                GM_setClipboard(text);
                return true;
            } catch (error) {
                console.warn('GM_setClipboard 失败', error);
            }
        }

        // 方法 3: 回退到 textarea + execCommand
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (error) {
            console.warn('复制失败', error);
        }

        return false;
    }

    function injectToField(field, value) {
        if (!field) {
            return false;
        }

        const tagName = field.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
            field.focus();
            field.value = value;
            triggerInput(field);
            return true;
        }

        if (field.isContentEditable) {
            field.focus();
            field.innerText = value;
            triggerInput(field);
            return true;
        }

        return false;
    }

    function triggerInput(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function isInputField(element) {
        const tagName = element.tagName.toLowerCase();
        return tagName === 'input' || tagName === 'textarea' || element.isContentEditable;
    }

    function guessTargets() {
        const selector = 'input[type="password"], input, textarea, [contenteditable="true"]';
        const allTargets = Array.from(document.querySelectorAll(selector));

        const focused = document.activeElement;
        if (focused && isInputField(focused)) {
            const otherTargets = allTargets.filter(target => target !== focused);
            return [focused, ...otherTargets];
        }

        return allTargets;
    }

    function showNotification(message) {
        if (typeof window.__gm_sp_showToast === 'function') {
            window.__gm_sp_showToast(message);
        }
    }

    function attemptAutoInject(password) {
        const targets = guessTargets();
        const passwordField = targets.find(field => field.type === 'password');
        const targetField = passwordField || targets[0];

        if (!targetField) {
            showNotification('未找到可注入的输入框');
            return;
        }

        const success = injectToField(targetField, password);
        showNotification(success ? '已注入密码' : '注入失败');
    }

    // ========== UI 创建 ==========
    function ensureUI() {
        if (document.getElementById(HOST_ID)) {
            return;
        }

        const host = document.createElement('div');
        host.id = HOST_ID;
        host.style.position = 'fixed';
        host.style.right = '0';
        host.style.bottom = '0';
        host.style.zIndex = '2147483647';
        host.style.pointerEvents = 'none';

        const parent = (document.body && getComputedStyle(document.body).transform === 'none')
            ? document.body
            : document.documentElement;
        parent.appendChild(host);
        const shadow = host.attachShadow({ mode: 'closed' });

        // 插入样式
        const style = document.createElement('style');
        style.textContent = getUIStylesheet();
        shadow.appendChild(style);

        // 创建按钮和 toast 元素
        const btn = document.createElement('div');
        btn.className = 'fp-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', '强密码');
        btn.tabIndex = 0;
        btn.textContent = '密';
        btn.style.userSelect = 'none';
        btn.style.webkitTapHighlightColor = 'transparent';
        btn.style.boxSizing = 'border-box';
        btn.style.transform = 'translateZ(0)';
        btn.style.touchAction = 'none';

        const toast = document.createElement('div');
        toast.className = 'fp-toast';

        shadow.appendChild(btn);
        shadow.appendChild(toast);

        // 恢复已保存位置
        if (prefs.pos && typeof prefs.pos.left === 'number' && typeof prefs.pos.top === 'number') {
            btn.style.left = prefs.pos.left + 'px';
            btn.style.top = prefs.pos.top + 'px';
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';
        }

        // Toast 提示函数
        function showToast(message) {
            toast.textContent = message;
            toast.style.display = 'block';
            setTimeout(function hideToast() {
                toast.style.display = 'none';
            }, TOAST_DURATION);
        }
        window.__gm_sp_showToast = showToast;

        // 按钮交互处理
        btn.addEventListener('pointerdown', createPointerDownHandler());
        btn.addEventListener('dblclick', createDoubleClickHandler());

        function createPointerDownHandler() {
            return function handlePointerDown(startEvent) {
                if (startEvent.button !== 0) {
                    return;
                }
                startEvent.preventDefault();
                startEvent.stopPropagation();

                btn.classList.add('dragging');
                btn.style.transform = 'none';
                btn.style.transition = 'none';

                if (btn.setPointerCapture) {
                    btn.setPointerCapture(startEvent.pointerId);
                }

                const startX = startEvent.clientX;
                const startY = startEvent.clientY;
                const rect = btn.getBoundingClientRect();
                const startLeft = rect.left;
                const startTop = rect.top;
                let moved = false;

                function handlePointerMove(moveEvent) {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    const distance = Math.hypot(deltaX, deltaY);

                    if (!moved && distance < DRAG_THRESHOLD) {
                        return;
                    }
                    moved = true;
                    btn.style.left = (startLeft + deltaX) + 'px';
                    btn.style.top = (startTop + deltaY) + 'px';
                    btn.style.right = 'auto';
                    btn.style.bottom = 'auto';
                }

                function handlePointerUp(endEvent) {
                    if (btn.releasePointerCapture) {
                        btn.releasePointerCapture(startEvent.pointerId);
                    }
                    document.removeEventListener('pointermove', handlePointerMove);
                    document.removeEventListener('pointerup', handlePointerUp);

                    btn.classList.remove('dragging');
                    btn.style.transition = '';
                    btn.style.transform = '';

                    if (moved) {
                        const finalRect = btn.getBoundingClientRect();
                        prefs.pos = { left: finalRect.left, top: finalRect.top };
                        savePrefs(prefs);
                    } else {
                        handleButtonClick(endEvent.shiftKey);
                    }
                }

                document.addEventListener('pointermove', handlePointerMove);
                document.addEventListener('pointerup', handlePointerUp);
            };
        }

        async function handleButtonClick(shiftKey) {
            const password = generatePassword(prefs.length, {});
            const success = await copyToClipboard(password);
            lastGenerated = password;

            if (success) {
                showToast('已复制密码');
            } else {
                showToast('复制失败');
            }

            if (shiftKey || prefs.autoInject) {
                attemptAutoInject(password);
            }
        }

        function createDoubleClickHandler() {
            return function handleDoubleClick(event) {
                event.stopPropagation();
                event.preventDefault();
                openSettings();
            };
        }

        window.__gm_sp_openSettings = openSettings;

        function openSettings() {
            const existing = shadow.querySelector('.fp-panel');
            if (existing) {
                existing.remove();
                return;
            }

            const panel = document.createElement('div');
            panel.className = 'fp-panel';
            panel.setAttribute('tabindex', '-1');
            panel.innerHTML = createSettingsPanelHTML();
            shadow.appendChild(panel);

            setTimeout(function focusPanel() {
                panel.focus();
            }, 10);

            panel.querySelector('#sp-close').addEventListener('click', function closePanel() {
                panel.remove();
            });
            panel.querySelector('#sp-save').addEventListener('click', function saveSettings() {
                updatePrefsFromPanel(panel);
                savePrefs(prefs);
                showToast('设置已保存');
                panel.remove();
            });
        }

        function createSettingsPanelHTML() {
            const checked = function (value) { return value ? 'checked' : ''; };
            return `
                <div style="font-weight:600;margin-bottom:8px">强密码设置</div>
                <div style="display:flex;gap:8px;margin-bottom:8px">
                    <label>长度<input type="number" min="4" max="128" value="${prefs.length}" id="sp-length"></label>
                </div>
                <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
                    <label><input type="checkbox" id="sp-lower" ${checked(prefs.useLower)}> 小写</label>
                    <label><input type="checkbox" id="sp-upper" ${checked(prefs.useUpper)}> 大写</label>
                    <label><input type="checkbox" id="sp-num" ${checked(prefs.useNumbers)}> 数字</label>
                    <label><input type="checkbox" id="sp-sym" ${checked(prefs.useSymbols)}> 符号</label>
                </div>
                <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
                    <label><input type="checkbox" id="sp-ex" ${checked(prefs.excludeSimilar)}> 排除相似</label>
                    <label><input type="checkbox" id="sp-auto" ${checked(prefs.autoInject)}> Shift+点击注入</label>
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end">
                    <button id="sp-save">保存</button>
                    <button id="sp-close">关闭</button>
                </div>
            `;
        }

        function updatePrefsFromPanel(panel) {
            const length = Number(panel.querySelector('#sp-length').value);
            prefs.length = Math.max(4, Math.min(128, length || prefs.length));
            prefs.useLower = panel.querySelector('#sp-lower').checked;
            prefs.useUpper = panel.querySelector('#sp-upper').checked;
            prefs.useNumbers = panel.querySelector('#sp-num').checked;
            prefs.useSymbols = panel.querySelector('#sp-sym').checked;
            prefs.excludeSimilar = panel.querySelector('#sp-ex').checked;
            prefs.autoInject = panel.querySelector('#sp-auto').checked;
        }
    }

    function getUIStylesheet() {
        return `
            .fp-btn {
                position: fixed !important;
                right: 12px !important;
                bottom: 12px !important;
                z-index: 2147483648 !important;
                width: 36px;
                height: 36px;
                padding: 0;
                border-radius: 50%;
                background: #1e88e5;
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.06);
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
                opacity: 0.95;
                transition: transform 0.14s ease, opacity 0.14s ease;
                pointer-events: auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .fp-btn:hover {
                transform: translateY(-2px) scale(1.035);
                opacity: 1;
            }
            .fp-btn:focus {
                outline: none;
                box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.12);
            }
            .fp-btn.dragging {
                transform: none !important;
                transition: none !important;
            }
            .fp-toast {
                position: fixed !important;
                right: 12px !important;
                bottom: 56px !important;
                z-index: 2147483648 !important;
                padding: 8px 10px;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                border-radius: 4px;
                font-size: 12px;
                display: none;
                pointer-events: none;
            }
            .fp-panel {
                position: fixed !important;
                right: 12px !important;
                bottom: 56px !important;
                left: auto !important;
                top: auto !important;
                z-index: 2147483649 !important;
                width: 320px;
                padding: 12px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                font-family: system-ui, Segoe UI, Arial;
                margin: 0 !important;
                pointer-events: auto;
            }
        `;
    }

    // ========== 初始化 ==========
    window.addEventListener('load', function initializeScript() {
        addMenuCommands();
        if (shouldShowUI()) {
            ensureUI();
        } else {
            observeForPasswordFields();
        }
    });
})();

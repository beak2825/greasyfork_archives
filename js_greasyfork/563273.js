// ==UserScript==
// @name                Custom Link Jump
// @name:zh-CN          跳转打开自定义链接
// @name:zh-TW          跳轉打開自定義連結
// @namespace           crayonssr-tool
// @description         Quickly jump to the specified link from the current site.
// @description:zh-CN   从当前站点，快速跳转到指定链接
// @description:zh-TW   從當前站點，快速跳轉到指定連結
// @match               *://*/*
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addStyle
// @run-at              document-idle
// @noframes
// @author              crayonssr
// @version             1.0.1
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAq1BMVEX68Yr////884v6+vr+9ov19fb7+/3n5ubIx8X19fjk5OPc1Xbw54P/+Y7v533g2HKoppLQyoX38IO0rVihnHO5t6LJx7efnIfW1t7HwojSymeGg3SHhIPZ13a8tV6oqbqsp3G5tY3GwHa+vLng4ei1sHG3tZfExMqlpKjOyHPh2oDGwY62tKWUko9uaD3Av7WrqabV1NF6eHmEf2appF/LyaqVkWvDu1bX18rqIWkoAAABEUlEQVQokY1S2VaDMBTkZiEhEEpbuoDYVsBqVIRo1f7/l8kWFvXBOXmaOffOTBLL+ifQX1wD1/tJS+kvFr4bLOczcrUON9ttsNtHM0HGN4Latu2w5JZM7MjhCAY7vx9B3ukuTXpWZJDfS4Q64Zw/sJbGmCcUHn3ldcrT8wsGngleMMww2K9l2vmgVUihKmihq2ZOaxb1AeTZASpAv+l2IYiDHIXawOSi714fTJ4o0Iobgelh1YXiTHNmFOej7yIPWGvIxFDy6nYC8jmt8w4moJdm1ydgQWEU+iIW+cpHFtMkNPdlyaTJDzmwuur1Ioerlynfl2UZ8mDD1/H0RYiKlFK+ct0YEWsKUgOh9vz6DHN8Aw8/EmSFjAtmAAAAAElFTkSuQmCC
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/563273/Custom%20Link%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/563273/Custom%20Link%20Jump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 只在名单内的网站开启
    const enableDomains = [
        ...getDefault(),
        // 'example.com',
    ];

    if (enableDomains.every(ed => !location.hostname.includes(ed))) return;

    // --- 1. 多语言配置 ---
    const translations = {
        'zh-CN': {
            title: '链接跳转',
            placeholder: '粘贴或输入链接...',
            paste: '粘贴',
            jump: '跳转',
            jumping: '正在跳转...',
            invalid: '链接格式无效',
            empty: '剪贴板为空',
            clipError: '读取剪贴板失败'
        },
        'zh-TW': {
            title: '連結跳轉',
            placeholder: '粘貼或輸入連結...',
            paste: '粘貼',
            jump: '跳轉',
            jumping: '正在跳轉...',
            invalid: '連結格式無效',
            empty: '剪貼簿為空',
            clipError: '讀取剪貼簿失敗'
        },
        'en': {
            title: 'Link Jump',
            placeholder: 'Paste or enter link...',
            paste: 'Paste',
            jump: 'Jump',
            jumping: 'Jumping...',
            invalid: 'Invalid link format',
            empty: 'Clipboard is empty',
            clipError: 'Failed to read clipboard'
        }
    };

    // 获取默认启用的网站域名。至于默认配置为什么搞成这样，复制出来打印一下内容就知道了
    function getDefault() {
        const bytes = Uint8Array.from(atob('MEcfCgsbBB1XCAZbR0cJChELDgoXRQYWBkdVSQMYBREQCksTG0dVSQcWBBYNEksNBEdVSQIMBhcWCgFXCAoUSUlbBAsVEgMYBRZXCAoUSUlbDQQXGAkARQYWBkdVSQYYBQEfCgsKRQ8JSTg='), c => c.charCodeAt(0));
        const keyBytes = new TextEncoder().encode('key')
        const result = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
        return JSON.parse(new TextDecoder().decode(result));
    }

    // 获取并匹配语言
    function getI18n() {
        const sysLang = navigator.language.toLowerCase();
        if (sysLang.startsWith('zh')) {
            // 区分繁体和简体
            return (sysLang.includes('tw') || sysLang.includes('hk') || sysLang.includes('mo'))
                ? translations['zh-TW']
                : translations['zh-CN'];
        }
        return translations['en'];
    }

    const i18n = getI18n();

    // --- 2. 构造 UI ---
    const container = document.createElement('div');
    container.id = 'tampermonkey-jump-tool';
    container.className = 'tm-jump-container';
    container.innerHTML = `
        <div class="tm-jump-blur-bg"></div>
        <div class="tm-jump-content">
            <div class="tm-jump-header" id="tm-jump-drag-handle">
                <div class="tm-jump-title">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>${i18n.title}</span>
                </div>
                <div class="tm-jump-referer">
                    <span>${location.hostname}</span>
                </div>
            </div>
            <div class="tm-jump-body">
                <input type="text" id="tm-jump-url" class="tm-jump-input" placeholder="${i18n.placeholder}" value="" autocomplete="off">
                <button id="tm-jump-button" class="tm-jump-button">
                    <span class="btn-text">${i18n.paste}</span>
                    <span class="btn-icon">↵</span>
                </button>
            </div>
            <div class="tm-jump-status" id="tm-jump-status"></div>
        </div>
    `;

    GM_addStyle(`
        :root {
            --tm-primary: #6366f1;
            --tm-primary-hover: #4f46e5;
            --tm-paste: #10b981;
            --tm-paste-hover: #059669;
            --tm-danger: #ef4444;
            --tm-bg-light: rgba(255, 255, 255, 0.75);
            --tm-bg-dark: rgba(30, 41, 59, 0.8);
            --tm-border-light: rgba(255, 255, 255, 0.6);
            --tm-border-dark: rgba(255, 255, 255, 0.1);
            --tm-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .tm-jump-container {
            position: fixed; z-index: 9999999; box-sizing: border-box; width: 330px;
            border-radius: 16px; font-family: -apple-system, system-ui, sans-serif;
            overflow: hidden; box-shadow: var(--tm-shadow); backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px); transition: transform 0.1s, box-shadow 0.3s;
            inset: auto 30px 30px auto; background: var(--tm-bg-light) !important;
            border: 1px solid rgba(0,0,0,0.05) !important; color: #0b0e12 !important;
        }
        @media (prefers-color-scheme: dark) {
            .tm-jump-container {
                background: var(--tm-bg-dark) !important; border: 1px solid var(--tm-border-dark) !important;
                color:#f8fafc !important; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
            }
            .tm-jump-title svg { stroke: #cbd5e1 !important; }
            .tm-jump-input { background: rgba(15, 23, 42, 0.6) !important; color: #f8fafc !important; border: 1px solid #475569 !important; }
            .tm-jump-button { color: #f8fafc !important; border-color: #354358 !important; }
        }
        .tm-jump-header { padding: 12px 16px 4px; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; }
        .tm-jump-title { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 6px; opacity: 0.8; }
        .tm-jump-referer { font-size: 13px; font-weight: 600; color: #32d458; padding-right: 5px; }
        .tm-jump-body { padding: 10px 16px 16px; display: flex; gap: 8px; }
        .tm-jump-input { flex: 1; padding: 8px 12px; border-radius: 10px; font-size: 13px; outline: none; transition: all 0.2s; width: 0; }
        .tm-jump-input:focus { border-color: var(--tm-primary); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important; }
        .tm-jump-button { border-radius: 10px; padding: 0 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px; background: transparent; border: 2px solid; }
        .tm-jump-button:hover { transform: translateY(-1px); }
        .tm-jump-status { height: 0; overflow: hidden; font-size: 11px; text-align: center; transition: height 0.3s ease; color: var(--tm-paste); font-weight: 500; }
        .tm-jump-status.show { height: 24px; margin-bottom: 6px; }
        .tm-jump-status.error { color: var(--tm-danger); }
        .tm-jump-container.dragging { cursor: move; opacity: 0.95; }
    `);

    // --- 3. 拖拽逻辑 (核心修复点) ---
    let position = GM_getValue('jumpToolPositionBR', { bottom: 30, right: 30 });

    function applyPosition(pos) {
        // 使用 clientWidth/Height 避开滚动条干扰
        const maxBottom = document.documentElement.clientHeight - 80;
        const maxRight = document.documentElement.clientWidth - 300;

        let safeBottom = Math.max(10, Math.min(pos.bottom, maxBottom));
        let safeRight = Math.max(10, Math.min(pos.right, maxRight));

        container.style.bottom = `${safeBottom}px`;
        container.style.right = `${safeRight}px`;
        container.style.top = 'auto';
        container.style.left = 'auto';
    }

    applyPosition(position);
    document.body.appendChild(container);

    const dragHandle = document.getElementById('tm-jump-drag-handle');
    const urlInput = document.getElementById('tm-jump-url');
    const jumpButton = document.getElementById('tm-jump-button');
    const btnText = jumpButton.querySelector('.btn-text');
    const statusElement = document.getElementById('tm-jump-status');

    let isDragging = false;
    let startX, startY, startRight, startBottom;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.classList.add('dragging');

        startX = e.clientX;
        startY = e.clientY;

        const rect = container.getBoundingClientRect();
        // 关键点：使用 clientWidth 而非 innerWidth，确保计算不包含滚动条
        startRight = document.documentElement.clientWidth - rect.right;
        startBottom = document.documentElement.clientHeight - rect.bottom;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = startX - e.clientX;
        const deltaY = startY - e.clientY;

        let newRight = startRight + deltaX;
        let newBottom = startBottom + deltaY;

        // 边界限制
        newRight = Math.max(10, Math.min(newRight, document.documentElement.clientWidth - 300));
        newBottom = Math.max(10, Math.min(newBottom, document.documentElement.clientHeight - 100));

        container.style.right = `${newRight}px`;
        container.style.bottom = `${newBottom}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.classList.remove('dragging');
            const rect = container.getBoundingClientRect();
            const finalPos = {
                bottom: document.documentElement.clientHeight - rect.bottom,
                right: document.documentElement.clientWidth - rect.right
            };
            GM_setValue('jumpToolPositionBR', finalPos);
        }
    });

    // --- 4. 交互逻辑 ---
    function updateButtonState() {
        btnText.textContent = urlInput.value.trim() ? i18n.jump : i18n.paste;
    }

    urlInput.addEventListener('input', updateButtonState);

    function jumpToUrl(url) {
        if (!url) return;
        try {
            if (!/^https?:\/\//i.test(url) && !/^\//.test(url)) {
                throw new Error();
            }
            url = !/^https?:\/\//i.test(url) ? 'https://' + url : url;
            new URL(url);

            const link = document.createElement('a');
            link.href = url;
            document.body.appendChild(link);
            link.click();

            showStatus(i18n.jumping, 'success');
            setTimeout(() => document.body.removeChild(link), 100);
        } catch (error) {
            showStatus(i18n.invalid, 'error');
        }
    }

    let _tipTimer;
    function showStatus(message, type = 'success') {
        clearTimeout(_tipTimer);
        statusElement.textContent = message;
        statusElement.className = `tm-jump-status show ${type}`;
        _tipTimer = setTimeout(() => statusElement.classList.remove('show'), 2000);
    }

    async function pasteAndJump() {
        try {
            const text = await navigator.clipboard.readText();
            const trimmed = text.trim();
            if (trimmed) {
                urlInput.value = trimmed;
                updateButtonState();
                jumpToUrl(trimmed);
            } else {
                showStatus(i18n.empty, 'error');
            }
        } catch (error) {
            showStatus(i18n.clipError, 'error');
        }
    }

    jumpButton.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        url ? jumpToUrl(url) : await pasteAndJump();
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') jumpToUrl(urlInput.value.trim());
    });

    window.addEventListener('resize', () => {
         applyPosition(GM_getValue('jumpToolPositionBR', { bottom: 30, right: 30 }));
    });

    setTimeout(() => urlInput.focus(), 500);
})();
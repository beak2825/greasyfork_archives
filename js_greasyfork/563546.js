// ==UserScript==
// @name         全能流媒体 ID & 链接提取工具 (Ultimate v4.7)
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  优化 Catchplay 动态映射逻辑，支持悬浮窗位置长久记忆与顺滑 UI。
// @author       Gemini
// @match        https://www.netflix.com/*
// @match        https://www.disneyplus.com/*
// @match        https://hamivideo.hinet.net/*
// @match        https://video.friday.tw/*
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.mgtv.com/*
// @match        https://nowplayer.now.com/*
// @match        https://www.iq.com/*
// @match        https://www.myvideo.net.tw/*
// @match        https://www.mewatch.sg/*
// @match        https://www.viu.com/*
// @match        https://www.linetv.tw/*
// @match        https://www.mytvsuper.com/*
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.tv/*
// @match        https://wetv.vip/*
// @match        https://www.miguvideo.com/*
// @match        https://www.catchplay.com/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v47%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563546/%E5%85%A8%E8%83%BD%E6%B5%81%E5%AA%92%E4%BD%93%20ID%20%20%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7%20%28Ultimate%20v47%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;
    let currentContent = '';
    let lastSeasonText = '';

    // 1. 创建悬浮窗与样式初始化
    const btn = document.createElement('div');
    btn.id = 'media-id-fetcher';

    // 从本地存储读取位置，默认右侧 150px
    const savedTop = GM_getValue('btn_top', '150px');
    const savedLeft = GM_getValue('btn_left', null);

    Object.assign(btn.style, {
        position: 'fixed',
        top: savedTop,
        left: savedLeft,
        right: savedLeft ? 'auto' : '20px',
        zIndex: '2147483647',
        padding: '12px',
        backgroundColor: 'rgba(25, 25, 25, 0.96)',
        color: '#fff',
        cursor: 'grab',
        borderRadius: '14px',
        fontWeight: 'bold',
        boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
        fontSize: '13px',
        border: '1px solid #444',
        userSelect: 'none',
        textAlign: 'center',
        minWidth: '140px',
        backdropFilter: 'blur(10px)',
        transition: 'opacity 0.3s ease, transform 0.2s ease',
        display: 'none',
        opacity: '0'
    });
    document.body.appendChild(btn);

    // 2. 拖拽逻辑 (严谨的位置记忆)
    let isDragging = false;
    let startX, startY, initialX, initialY;

    const startDrag = (e) => {
        if (e.button !== 0) return; // 仅左键点击可拖拽
        isDragging = true;
        btn.style.cursor = 'grabbing';
        btn.style.transform = 'scale(1.05)';
        startX = e.clientX; startY = e.clientY;
        const rect = btn.getBoundingClientRect();
        initialX = rect.left; initialY = rect.top;
        window.addEventListener('pointermove', doDrag, {passive: true});
        window.addEventListener('pointerup', stopDrag);
    };

    const doDrag = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newX = initialX + dx;
        let newY = initialY + dy;
        // 边界限制
        newX = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newY));
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
        btn.style.right = 'auto';
    };

    const stopDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        btn.style.cursor = 'grab';
        btn.style.transform = 'scale(1)';
        GM_setValue('btn_top', btn.style.top);
        GM_setValue('btn_left', btn.style.left);
        window.removeEventListener('pointermove', doDrag);
        window.removeEventListener('pointerup', stopDrag);
        // 如果点击位移很小，视为点击动作触发复制
        if (Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)) < 8) {
            handleCopy();
        }
    };

    btn.addEventListener('pointerdown', startDrag);

    // 3. 数字转换工具
    function parseSeasonNum(text) {
        if (!text) return 1;
        const sMatch = text.match(/S(\d+)/i);
        if (sMatch) return parseInt(sMatch[1]);
        const rMap = {'I':1, 'V':5, 'X':10, 'L':50};
        const rMatch = text.match(/\b([IVXLCDM]+)\b$/i);
        if (rMatch) {
            let roman = rMatch[1].toUpperCase(), num = 0;
            for (let i = 0; i < roman.length; i++) {
                const curr = rMap[roman[i]], next = rMap[roman[i+1]];
                if (next > curr) { num += (next - curr); i++; } else { num += curr; }
            }
            return num;
        }
        return 1;
    }

    // 4. 提取逻辑
    function getIdentifier() {
        const url = new URL(window.location.href);
        const path = url.pathname;

        if (url.hostname.includes('catchplay.com')) {
            const idMatch = path.match(/\/video\/([a-f0-9-]+)/);
            if (idMatch) {
                let uuid = idMatch[1];
                // 增加对 iJaIlm 类的兼容
                const seasonElem = document.querySelector('.sc-3a20c785-2, .iJaIlm');
                if (seasonElem) {
                    const text = seasonElem.innerText.trim();
                    lastSeasonText = text;
                    const currentS = parseSeasonNum(text);
                    // 逻辑：每10季作为一个潜在的起始段落
                    let baseSeason = currentS >= 11 ? Math.floor((currentS - 1) / 10) * 10 + 1 : 1;
                    const offset = currentS - baseSeason;
                    return offset > 0 ? `${uuid}_${offset + 1}` : uuid;
                }
                return uuid;
            }
        }

        // 其他站点逻辑（保持简练）
        if (url.hostname.includes('wetv.vip')) return path.match(/\/play\/([a-z0-9]+)/i)?.[1];
        if (url.hostname.includes('miguvideo.com')) return path.match(/\/detail\/(\d+)/)?.[1];
        if (url.hostname.includes('netflix.com')) return url.searchParams.get('jbv');
        const fullLinks = ['viu.com', 'myvideo.net.tw', 'hamivideo.hinet.net', 'video.friday.tw'];
        if (fullLinks.some(s => url.hostname.includes(s))) return window.location.href;
        return null;
    }

    // 5. UI 逻辑与生命周期
    function refreshUI() {
        const content = getIdentifier();
        if (content) {
            if (content !== currentContent) {
                currentContent = content;
                const isUrl = content.startsWith('http');
                let displayCode = isUrl ? (content.split('?')[0].split('/').filter(Boolean).pop()) : content;
                if (displayCode && displayCode.length > 14) displayCode = displayCode.substring(0, 11) + '...';

                btn.innerHTML = `<div style="margin-bottom:4px; font-size:11px; color:#aaa;">${isUrl ? '复制链接' : '复制 ID'}</div><code style="color:#ffd700; background:#000; padding:2px 6px; border-radius:4px; font-size:10px; display:inline-block; border: 1px solid #333;">${displayCode}</code>`;
                btn.style.display = 'block';
                setTimeout(() => { btn.style.opacity = '1'; }, 10);
            }
        } else {
            btn.style.opacity = '0';
            setTimeout(() => { if (!getIdentifier()) btn.style.display = 'none'; }, 300);
            currentContent = '';
        }
    }

    function handleCopy() {
        if (!currentContent) return;
        GM_setClipboard(currentContent);
        const oldHTML = btn.innerHTML;
        btn.innerHTML = '<div style="color:#00ff88; padding:5px 0;">✨ 已复制 ✨</div>';
        btn.style.border = '1px solid #00ff88';
        setTimeout(() => {
            btn.innerHTML = oldHTML;
            btn.style.border = '1px solid #555';
        }, 1000);
    }

    // 定时监测：URL 变化或季数文本变化
    setInterval(() => {
        const currentSeasonText = document.querySelector('.sc-3a20c785-2, .iJaIlm')?.innerText || "";
        if (lastUrl !== location.href || currentSeasonText !== lastSeasonText) {
            lastUrl = location.href;
            refreshUI();
        }
    }, 800);

    refreshUI();
})();

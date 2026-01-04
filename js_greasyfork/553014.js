// ==UserScript==
// @name         Telegram消息ID复制器（稳定版）
// @namespace    https://greasyfork.org/
// @version      1.1.0
// @description  在Telegram Web中为媒体消息（视频/图片/音频/文档）叠加复制按钮，支持复制完整链接或仅ID
// @author       YourName
// @license MIT
// @match        https://web.telegram.org/*
// @match        https://web.telegram.org/a/*
// @match        https://web.telegram.org/k/*
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553014/Telegram%E6%B6%88%E6%81%AFID%E5%A4%8D%E5%88%B6%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553014/Telegram%E6%B6%88%E6%81%AFID%E5%A4%8D%E5%88%B6%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 复制偏好：'link' | 'id'（持久化）
    const getCopyMode = () => (typeof GM_getValue === 'function' ? GM_getValue('tgCopyMode', 'link') : (window.tgCopyMode || 'link'));
    const setCopyMode = (mode) => {
        const val = mode === 'id' ? 'id' : 'link';
        if (typeof GM_setValue === 'function') GM_setValue('tgCopyMode', val);
        window.tgCopyMode = val;
        showNotification(`复制模式: ${val === 'id' ? '仅ID' : '链接'}`);
    };

    // 剪贴板
    async function copyToClipboard(text) {
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(text);
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                fallbackCopy(text);
            }
            showNotification(`已复制: ${text.length > 60 ? text.slice(0,60) + '…' : text}`);
        } catch (_) {
            fallbackCopy(text);
            showNotification(`已复制: ${text}`);
        }
    }
    function fallbackCopy(text) {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
    }

    // 通知
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.tg-id-notify');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'tg-id-notify';
        div.style.cssText = `
            position: fixed; top: 18px; right: 18px; z-index: 99999;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'}; color:#fff; padding:10px 14px;
            border-radius:8px; font-size:13px; box-shadow:0 6px 18px rgba(0,0,0,.2);
            opacity:0; transition: opacity .25s ease; max-width: 420px; word-break: break-all;
        `;
        div.textContent = message;
        document.body.appendChild(div);
        requestAnimationFrame(() => div.style.opacity = '1');
        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 300);
        }, 2400);
    }

    // 提取聊天ID
    function getChatIdFromUrl() {
        // 优先从 hash 读取（Telegram Web K/A 常用，如 .../k/#-2018426596）
        if (window.location.hash) {
            let slug = window.location.hash.replace(/^#/, '');
            // 截断 query 或子路径
            slug = slug.split(/[/?&]/)[0];
            // 私有群一般是负数，t.me/c 需要正数
            if (/^-?\d+$/.test(slug)) {
                const absId = Math.abs(parseInt(slug, 10));
                return String(absId);
            }
            if (slug) return slug; // 可能是用户名
        }
        // 回退：从路径末段读取（如 .../k/username 或 .../k/-2018426596）
        const url = window.location.href;
        const m = url.match(/\/([^\/\?#]+)(?:[?#].*)?$/);
        if (m) {
            const seg = m[1];
            if (/^-?\d+$/.test(seg)) {
                const absId = Math.abs(parseInt(seg, 10));
                return String(absId);
            }
            return seg;
        }
        return '';
    }
    // 生成复制目标
    function buildCopyTarget(displayId, chatId) {
        const mode = getCopyMode();
        if (mode === 'id' || !chatId) return String(displayId);
        // chatId 可能来自 hash 的负数形式，生成 t.me/c 时需绝对值
        if (/^-?\d+$/.test(chatId)) {
            const absId = Math.abs(parseInt(chatId, 10));
            return `https://t.me/c/${absId}/${displayId}`;
        }
        return `https://t.me/${chatId}/${displayId}`;
    }

    // 查找媒体元素和消息根
    function findFirstMediaElement(scope) {
        if (!scope) return null;
        const selectors = [
            // 原生媒体
            'video', 'img:not(.emoji)', 'audio', 'canvas',
            // 通用类名
            '.media-video', '.media-photo', '.media-audio',
            '.photo', '.video', '.audio', '.voice',
            '[class*="photo"]:not([class*="emoji"])',
            '[class*="video"]', '[class*="audio"]', '[class*="voice"]',
            // 其他可能容器/播放器
            '.document', '.document-ico', '[class*="document"]',
            '.player', '[class*="player"]', '[class*="media"]',
            '.bubble.video', '.message-video', '.video-container', '[class*="video-container"]'
        ];
        for (const sel of selectors) { const el = scope.querySelector(sel); if (el) return el; }
        // 背景图/封面作为媒体的兜底检测
        const bgEl = findBackgroundMediaElement(scope);
        if (bgEl) return bgEl;
        return null;
    }
    function findBackgroundMediaElement(scope) {
        const candidates = Array.from(scope.querySelectorAll('*')).slice(0, 800); // 上限避免性能问题
        for (const el of candidates) {
            const cs = getComputedStyle(el);
            const bg = cs.backgroundImage || '';
            if (bg && bg.includes('url(') && cs.display !== 'inline' && (el.offsetWidth > 32 && el.offsetHeight > 32)) {
                return el;
            }
        }
        return null;
    }
    function isSuitableContainer(node) {
        if (!node || node === document.body) return false;
        const rect = node.getBoundingClientRect();
        if (rect.width < 48 || rect.height < 48) return false;
        const cs = getComputedStyle(node);
        // 一些容器使用 transform/overflow 控制布局，但我们只需要能进行绝对定位
        return (node.offsetWidth > 0 || node.offsetHeight > 0) && cs.display !== 'inline';
    }

    function getOverlayContainer(mediaEl, root) {
        if (!mediaEl) return root || null;
        const tag = (mediaEl.tagName || '').toUpperCase();
        // 基础候选：优先父容器（尤其是 video/img/audio）
        let candidate = ['IMG','VIDEO','AUDIO','CANVAS'].includes(tag) ? (mediaEl.parentElement || mediaEl) : mediaEl;

        // 向上寻找最合适的容器（尺寸足够且非 inline）
        let probe = candidate;
        while (probe && !isSuitableContainer(probe)) {
            probe = probe.parentElement;
            if (probe === root) break;
        }
        const finalContainer = (probe && isSuitableContainer(probe)) ? probe : (isSuitableContainer(root) ? root : (root.parentElement || root));
        return finalContainer;
    }

    function correctPlacement(btn, preferredContainer, root) {
        const MAX_STEPS = 3;
        let container = preferredContainer;
        for (let i = 0; i < MAX_STEPS; i++) {
            if (!container) break;
            const cs = getComputedStyle(container);
            if (cs.position === 'static') container.style.position = 'relative';
            container.appendChild(btn);
            // 等一帧拿到真实位置
            // 由于此函数同步调用，使用同步校验当前容器的可用尺寸
            const rect = container.getBoundingClientRect();
            const ok = rect.width >= 48 && rect.height >= 48 && container.offsetWidth > 0 && container.offsetHeight > 0;
            if (ok) return container;
            // 回退到更高层
            container = container.parentElement;
        }
        // 最终回退：挂在消息根
        const fallback = isSuitableContainer(root) ? root : (root.parentElement || root);
        if (getComputedStyle(fallback).position === 'static') fallback.style.position = 'relative';
        fallback.appendChild(btn);
        return fallback;
    }
    function getMessageRoot(el) {
        return el?.closest('[data-message-id], [data-mid], .message, .Message, .bubble') || el;
    }

    // 提取消息ID并归一化
    function getMessageId(element) {
        if (!element) return null;
        // 1) data-message-id
        let id = element.getAttribute('data-message-id');
        if (id && /^\d+$/.test(id)) return id;
        // 2) 其他属性
        const attrs = ['data-mid','data-msg-id','id','data-message'];
        for (const a of attrs) {
            const v = element.getAttribute(a);
            if (v && /^\d+$/.test(v)) return v;
        }
        // 3) 父元素向上
        let p = element.parentElement, lvl = 0;
        while (p && lvl < 5) {
            id = p.getAttribute('data-message-id');
            if (id && /^\d+$/.test(id)) return id;
            for (const a of attrs) {
                const v = p.getAttribute(a);
                if (v && /^\d+$/.test(v)) return v;
            }
            p = p.parentElement; lvl++;
        }
        // 4) 类名
        const cn = element.className || '';
        const m = String(cn).match(/message[_-]?(\d+)/i);
        if (m) return m[1];
        // 5) 子元素
        const child = element.querySelector('[data-message-id]');
        if (child) return child.getAttribute('data-message-id');
        return null;
    }
    function normalizeDisplayId(rawId) {
        const n = parseInt(rawId, 10);
        if (Number.isNaN(n)) return String(rawId);
        const converted = (n & 0xFFFFFF) >>> 0; // 与调试版一致
        return String(converted > 0 ? converted : n);
    }
    function getCanonicalKey(root) {
        let id = root.getAttribute?.('data-message-id');
        if (id && /^\d+$/.test(id)) return `msg:${id}`;
        const mid = root.getAttribute?.('data-mid');
        if (mid && /^\d+$/.test(mid)) {
            const n = parseInt(mid, 10);
            const c = (n & 0xFFFFFF) >>> 0;
            return `mid:${c}`;
        }
        const found = root.querySelector?.('[data-message-id], [data-mid]');
        const fid = found && (found.getAttribute('data-message-id') || found.getAttribute('data-mid'));
        return fid ? `auto:${fid}` : null;
    }

    // 渲染按钮
    const processed = new Set();
    function addCopyButton(messageEl) {
        const rawId = getMessageId(messageEl);
        if (!rawId) return;
        const root = getMessageRoot(messageEl) || messageEl;
        const key = getCanonicalKey(root) || rawId;
        if (processed.has(key)) return;

        let mediaEl = findFirstMediaElement(root);
        // 如果仍未找到媒体元素，退回到消息根也渲染按钮，以保证可操作性
        const mediaMissing = !mediaEl;
        if (!mediaEl) mediaEl = root;

        // 清理旧按钮
        root.querySelectorAll('.tg-id-btn').forEach(b => b.remove());

        // 创建按钮
        const btn = document.createElement('button');
        const displayIdForLabel = normalizeDisplayId(rawId);
        btn.className = 'tg-id-btn';
        btn.textContent = displayIdForLabel;
        btn.title = `复制消息标识: ${displayIdForLabel}`;
        btn.style.cssText = `
            position: absolute; top: 8px; right: 8px; z-index: 2147483647;
            background: rgba(0,136,204,0.95); color:#fff; border:none; border-radius:8px;
            padding:6px 8px; font-size:12px; cursor:pointer; opacity:.96; min-width:46px;
            transition: all .2s ease; box-shadow:0 4px 12px rgba(0,0,0,.25);
            backdrop-filter: blur(4px);
        `;
        btn.addEventListener('mouseenter', () => { btn.style.opacity = '1'; btn.style.transform = 'scale(1.04)'; });
        btn.addEventListener('mouseleave', () => { btn.style.opacity = '.9'; btn.style.transform = 'scale(1)'; });
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            // 点击时即时提取与计算，避免预先解析
            const latestRoot = getMessageRoot(root) || root;
            const latestRaw = getMessageId(latestRoot) || getMessageId(root) || rawId;
            const displayId = normalizeDisplayId(latestRaw);
            const chatId = getChatIdFromUrl();
            const target = buildCopyTarget(displayId, chatId);
            copyToClipboard(target);
        });

        // 选择并校正容器，确保按钮位于视频右上角而不跑出范围
        const preferred = getOverlayContainer(mediaEl, root);
        const usedContainer = correctPlacement(btn, preferred, root);
        // 最终安全校验：若按钮仍接近视口边缘，重设位置到右上角
        requestAnimationFrame(() => {
            const br = btn.getBoundingClientRect();
            const cr = usedContainer.getBoundingClientRect();
            if (br.left < cr.left - 1 || br.top < cr.top - 1) {
                btn.style.top = '8px';
                btn.style.right = '8px';
            }
        });
        processed.add(key);
    }

    // 扫描与监听
    function processExisting() {
        const candidates = findAllMessages();
        candidates.forEach(el => addCopyButton(el));
    }
    function rescanNow() {
        // 清理已存在的按钮与已处理集合，然后重新渲染
        document.querySelectorAll('.tg-id-btn').forEach(b => b.remove());
        processed.clear();
        // 等一帧，确保虚拟列表在翻页后完成渲染
        requestAnimationFrame(() => processExisting());
    }
    function findAllMessages() {
        const selectors = [
            '[data-message-id]', '[data-mid]', '.message', '.Message', '[class*="message"]', '[class*="Message"]',
            '.media-container', '.grid-item.media-container', '.grid-item', '.video-container', '[class*="video-container"]', '.bubble.video', '[class*="bubble"][class*="video"]',
            '.search-super-item', '.grid-item.search-super-item'
        ];
        let max = 0, best = [];
        for (const s of selectors) {
            const list = Array.from(document.querySelectorAll(s));
            if (list.length > max) { max = list.length; best = list; }
        }
        // 合并遗漏的 data-mid
        document.querySelectorAll('[data-mid]').forEach(el => { if (!best.includes(el)) best.push(el); });
        return best;
    }
    // 移除 DOM 监听：仅在初始化和点击时处理

    // 右侧悬浮“复制模式”切换（极简版）
    function createFloatingToggle() {
        const wrap = document.createElement('div');
        wrap.style.cssText = `
            position: fixed; top: 50%; right: 18px; transform: translateY(-50%);
            z-index: 99999; display: flex; flex-direction: column; gap: 8px;
        `;
        const mkBtn = (text, active) => {
            const b = document.createElement('button');
            b.textContent = text;
            b.style.cssText = `
                background: ${active ? '#00BCD4' : '#6c757d'}; color:#fff; border:none; border-radius:8px;
                padding:6px 10px; cursor:pointer; font-size:11px; box-shadow:0 4px 12px rgba(0,0,0,.15);
            `;
            return b;
        };
        const btnLink = mkBtn('复制: 链接', getCopyMode() !== 'id');
        const btnId = mkBtn('复制: 仅ID', getCopyMode() === 'id');
        const btnScan = mkBtn('显示按钮', false);
        const refresh = () => {
            const isId = getCopyMode() === 'id';
            btnId.style.background = isId ? '#00BCD4' : '#6c757d';
            btnLink.style.background = !isId ? '#00BCD4' : '#6c757d';
        };
        btnLink.onclick = () => { setCopyMode('link'); refresh(); };
        btnId.onclick = () => { setCopyMode('id'); refresh(); };
        btnScan.onclick = () => { rescanNow(); showNotification('已重新显示当前页面媒体的复制按钮'); };
        wrap.appendChild(btnLink); wrap.appendChild(btnId); wrap.appendChild(btnScan);
        document.body.appendChild(wrap);
    }

    function init() {
        // 初次渲染
        processExisting();
        // 复制模式切换器
        createFloatingToggle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();



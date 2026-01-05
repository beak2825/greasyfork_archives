// ==UserScript==
// @name         小红书笔记屏蔽工具 + 纯净悬浮预览 (v1.18 - 极致纯净版)
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  屏蔽指定作者；悬浮预览；【新增】预览窗口隐藏作者信息栏；修复自动播放崩溃问题；静音起步，点击一键开声
// @author       You
// @match        https://www.xiaohongshu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558685/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%20%2B%20%E7%BA%AF%E5%87%80%E6%82%AC%E6%B5%AE%E9%A2%84%E8%A7%88%20%28v118%20-%20%E6%9E%81%E8%87%B4%E7%BA%AF%E5%87%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558685/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%20%2B%20%E7%BA%AF%E5%87%80%E6%82%AC%E6%B5%AE%E9%A2%84%E8%A7%88%20%28v118%20-%20%E6%9E%81%E8%87%B4%E7%BA%AF%E5%87%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 日志辅助函数 ---
    function log(msg, ...args) {
        console.log(`%c[XHS-Preview] ${msg}`, 'color: #ff00ff; font-weight: bold;', ...args);
    }

    // --- 配置与常量 ---
    const STORAGE_KEY = 'xhs_blocked_authors';
    const BTN_BLOCK_CLASS = 'xhs-block-btn';
    const BTN_PREVIEW_CLASS = 'xhs-preview-btn';
    const SELECTOR_NOTE_CARD = 'section.note-item';
    const SELECTOR_COVER = '.cover';
    const SELECTOR_AUTHOR_NAME = '.name';
    const PREVIEW_ID = 'xhs-preview-window';
    
    let showTimer = null;
    let hideTimer = null;
    let isPinned = false; 

    // --- 样式注入 (主页面) ---
    const cssStyles = `
        ${SELECTOR_COVER} { position: relative !important; }
        .${BTN_BLOCK_CLASS}, .${BTN_PREVIEW_CLASS} {
            position: absolute; z-index: 99; color: #fff; padding: 2px 8px;
            border-radius: 10px; font-size: 11px; cursor: pointer; display: none;
            backdrop-filter: blur(2px); border: 1px solid rgba(255,255,255,0.2); user-select: none;
        }
        .${BTN_BLOCK_CLASS} { top: 6px; right: 6px; background: rgba(0,0,0,0.5); }
        .${BTN_BLOCK_CLASS}:hover { background: #ff2e4d; border-color: #ff2e4d; }
        .${BTN_PREVIEW_CLASS} { top: 6px; left: 6px; background: rgba(0,100,0,0.5); }
        .${BTN_PREVIEW_CLASS}:hover { background: #2e8b57; border-color: #2e8b57; }
        ${SELECTOR_COVER}:hover .${BTN_BLOCK_CLASS}, ${SELECTOR_COVER}:hover .${BTN_PREVIEW_CLASS} { display: block !important; }
        #${PREVIEW_ID} {
            position: fixed; width: 880px; height: 550px; max-width: 95vw; max-height: 90vh;
            background: #fff; z-index: 9999999; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border-radius: 12px; overflow: hidden; display: none; flex-direction: column;
            pointer-events: auto; transition: box-shadow 0.2s;
        }
        .xhs-win-header {
            height: 36px; background: #f8f8f8; border-bottom: 1px solid #eee;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 10px; font-size: 13px; color: #666; cursor: move; user-select: none; flex-shrink: 0;
        }
        .xhs-header-left { display: flex; align-items: center; gap: 10px; }
        .xhs-pin-icon { cursor: pointer; font-size: 16px; width: 24px; height: 24px; text-align: center; border-radius: 4px; color: #999; }
        .xhs-pin-icon:hover { background: #e0e0e0; color: #666; }
        .xhs-pin-icon.active { color: #ff8c00; background: rgba(255, 140, 0, 0.1); transform: rotate(-45deg); }
        .xhs-win-close { cursor: pointer; font-size: 18px; color: #999; width: 28px; text-align: center; }
        .xhs-win-close:hover { color: #ff2e4d; background: #eee; }
        #${PREVIEW_ID} iframe { width: 100%; flex: 1; border: none; background: #fff; }
        #xhs-block-manager-modal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 320px; background: white; padding: 20px; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 999999; font-family: sans-serif;
            display: flex; flex-direction: column; max-height: 80vh;
        }
        .xhs-header { font-weight:bold; margin-bottom:10px; display:flex; justify-content:space-between; }
        .xhs-list { overflow-y:auto; flex: 1; }
        .xhs-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 13px; }
        .xhs-del { color: #ff2e4d; cursor: pointer; padding: 0 5px; }
    `;

    function addStyle() {
        const style = document.createElement('style');
        style.innerHTML = cssStyles;
        (document.head || document.documentElement).appendChild(style);
    }

    // --- 注入 CSS (纯净模式 + 隐藏作者栏) ---
    const iframeInjectCss = `
        /* 隐藏顶部导航 */
        header, .header-container, .sticky-header, #global-header, .channel-list { display: none !important; }
        
        /* 隐藏侧边栏 */
        .side-bar, .side-bar-container { display: none !important; }
        
        /* 隐藏作者信息栏 (头像、名字、关注按钮) - 新增 */
        .author-wrapper, .author-container, .info-bar { display: none !important; }
        
        /* 布局修正 */
        #app, .main-container, .note-detail-container { padding-top: 0 !important; margin-top: 0 !important; }
        .tool-bar { display: none !important; }
        .login-container, .login-modal { display: none !important; }
        .note-container { margin: 0 auto !important; width: 100% !important; max-width: 100% !important; }
        .interaction-container { margin-bottom: 50px !important; }
    `;

    // --- 注入 JS (核心修复逻辑) ---
    const iframeInjectJs = `
        (function() {
            const TAG = '[XHS-Preview-Inner]';
            console.log(TAG + ' ✅ 监控脚本已注入');

            // 自动播放阶段严禁操作 AudioContext (音量/静音)，防止 crash
            function safeAutoPlay(video) {
                if (video.dataset.xhsAutoStarted === 'true') return;
                
                // 仅在暂停时操作
                if (video.paused) {
                    // 1. 必须强制静音，这是 iframe 自动播放的铁律
                    video.muted = true;
                    // 2. 尝试播放
                    video.play().then(() => {
                        console.log(TAG + ' 🚀 静音启动成功');
                        video.dataset.xhsAutoStarted = 'true';
                    }).catch(e => {
                        console.warn(TAG + ' ⚠️ 启动被拦截:', e.message);
                        // 失败重试
                        video.muted = true;
                        video.play();
                    });
                }
            }

            // 极速检测循环 (50ms)
            const checkInterval = setInterval(() => {
                const video = document.querySelector('video');
                if (video) {
                    safeAutoPlay(video);
                }
            }, 50);

            // 10秒后停止高频检测
            setTimeout(() => {
                clearInterval(checkInterval);
            }, 10000);

            // --- 交互激活 (一键开声) ---
            // 用户点击窗口任意位置 -> 此时有 User Gesture -> 安全地开启声音
            document.addEventListener('click', () => {
                const video = document.querySelector('video');
                if (video) {
                    console.log(TAG + ' 🖱️ 用户点击 -> 激活声音');
                    video.volume = 1.0;
                    video.muted = false;
                    if (video.paused) video.play();
                }
            }, true);

        })();
    `;

    // --- 预览窗口逻辑 ---
    function initPreviewWindow() {
        if (document.getElementById(PREVIEW_ID)) return;
        const div = document.createElement('div');
        div.id = PREVIEW_ID;
        div.innerHTML = `
            <div class="xhs-win-header">
                <div class="xhs-header-left">
                    <div class="xhs-pin-icon" title="点击固定窗口">📌</div>
                    <span class="xhs-win-status">预览模式</span>
                </div>
                <div class="xhs-win-close" title="关闭">✕</div>
            </div>
            <iframe src="about:blank" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        `;
        document.body.appendChild(div);

        const win = div;
        const pinBtn = div.querySelector('.xhs-pin-icon');
        const closeBtn = div.querySelector('.xhs-win-close');
        const iframe = div.querySelector('iframe');

        iframe.onload = function() {
            if (iframe.src === 'about:blank') return;
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc) return;
                
                const style = doc.createElement('style');
                style.textContent = iframeInjectCss;
                doc.head.appendChild(style);

                const script = doc.createElement('script');
                script.textContent = iframeInjectJs;
                doc.body.appendChild(script);
            } catch (e) {
                console.error('[XHS-Preview] 注入失败:', e);
            }
        };

        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isPinned = !isPinned; 
            updatePreviewStatus();
        });
        win.addEventListener('mouseenter', () => { if(hideTimer) clearTimeout(hideTimer); });
        win.addEventListener('mouseleave', () => {
            if (!isPinned) hideTimer = setTimeout(() => closePreview(false), 300);
        });
        closeBtn.addEventListener('click', () => closePreview(true));
    }

    function updatePreviewStatus() {
        const win = document.getElementById(PREVIEW_ID);
        if(!win) return;
        const pinBtn = win.querySelector('.xhs-pin-icon');
        const statusEl = win.querySelector('.xhs-win-status');
        if (isPinned) {
            pinBtn.classList.add('active'); 
            statusEl.innerText = '已固定';
            statusEl.style.color = '#ff8c00';
            win.style.boxShadow = '0 0 0 2px #ff8c00, 0 10px 40px rgba(0,0,0,0.3)';
        } else {
            pinBtn.classList.remove('active');
            statusEl.innerText = '预览模式 (点击图钉固定)';
            statusEl.style.color = '#999';
            win.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        }
    }

    function showPreview(url, mouseX, mouseY) {
        initPreviewWindow();
        const win = document.getElementById(PREVIEW_ID);
        const iframe = win.querySelector('iframe');

        if (hideTimer) clearTimeout(hideTimer);

        if (!isPinned || win.style.display === 'none') {
            const winWidth = 880; 
            const winHeight = 550;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            let left = mouseX + 20; 
            let top = mouseY + 20;
            if (left + winWidth > screenW) left = mouseX - winWidth - 20;
            if (left < 10) left = 10;
            if (top + winHeight > screenH) top = screenH - winHeight - 10;
            if (top < 10) top = 10;
            win.style.left = left + 'px';
            win.style.top = top + 'px';
        }

        win.style.display = 'flex';
        updatePreviewStatus();

        let newSrc = url;
        if(newSrc.indexOf('?') === -1) newSrc += '?autoplay=true';
        else if(newSrc.indexOf('autoplay') === -1) newSrc += '&autoplay=true';

        if (iframe.getAttribute('src') !== newSrc) {
            log('加载新 URL:', newSrc);
            iframe.src = newSrc;
        }
    }

    function closePreview(force = false) {
        if (force || !isPinned) {
            const win = document.getElementById(PREVIEW_ID);
            if (win) {
                win.style.display = 'none';
                win.querySelector('iframe').src = 'about:blank';
                isPinned = false; 
                updatePreviewStatus();
            }
        }
    }

    // --- 数据管理与 UI ---
    function getBlockedAuthors() { return GM_getValue(STORAGE_KEY, []); }
    function addBlockedAuthor(author) {
        let list = getBlockedAuthors();
        if (!list.includes(author)) {
            list.push(author);
            GM_setValue(STORAGE_KEY, list);
        }
    }
    function removeBlockedAuthor(author) {
        let list = getBlockedAuthors();
        list = list.filter(n => n !== author);
        GM_setValue(STORAGE_KEY, list);
    }
    function hookXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url; return originalOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(data) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 200) {
                    const contentType = this.getResponseHeader('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            const blocked = getBlockedAuthors();
                            if (blocked.length === 0) return;
                            let json = JSON.parse(this.responseText);
                            let modified = false;
                            if (json.data && Array.isArray(json.data.items)) {
                                const originalLength = json.data.items.length;
                                json.data.items = json.data.items.filter(item => {
                                    let authorName = '';
                                    if (item.note_card && item.note_card.user) authorName = item.note_card.user.nickname;
                                    else if (item.user) authorName = item.user.nickname;
                                    return !blocked.includes(authorName);
                                });
                                if (json.data.items.length !== originalLength) modified = true;
                            }
                            if (modified) {
                                Object.defineProperty(this, 'responseText', {
                                    value: JSON.stringify(json), writable: true, configurable: true
                                });
                            }
                        } catch (e) {}
                    }
                }
            });
            return originalSend.apply(this, arguments);
        };
    }
    function processCard(card) {
        if (card.dataset.xhsProcessed) return;
        const authorEl = card.querySelector(SELECTOR_AUTHOR_NAME);
        if (!authorEl) return;
        const authorName = authorEl.innerText.trim();
        card.dataset.authorName = authorName;
        card.dataset.xhsProcessed = 'true';
        const blocked = getBlockedAuthors();
        if (blocked.includes(authorName)) { card.style.display = 'none'; return; }
        const coverEl = card.querySelector(SELECTOR_COVER);
        if (coverEl) {
            if (!coverEl.querySelector(`.${BTN_BLOCK_CLASS}`)) {
                const btn = document.createElement('div');
                btn.className = BTN_BLOCK_CLASS;
                btn.innerText = '屏蔽';
                btn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); e.stopImmediatePropagation(); addBlockedAuthor(authorName); card.style.display = 'none'; };
                coverEl.appendChild(btn);
            }
            if (!coverEl.querySelector(`.${BTN_PREVIEW_CLASS}`)) {
                const pBtn = document.createElement('div');
                pBtn.className = BTN_PREVIEW_CLASS;
                pBtn.innerText = '预览';
                pBtn.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                    if(hideTimer) clearTimeout(hideTimer);
                    const currentX = e.clientX;
                    const currentY = e.clientY;
                    if(showTimer) clearTimeout(showTimer);
                    showTimer = setTimeout(() => {
                        let fullUrl = coverEl.href; 
                        if (!fullUrl) { const linkTag = card.querySelector('a[href*="/explore"]'); if (linkTag) fullUrl = linkTag.href; }
                        if (fullUrl) { showPreview(fullUrl, currentX, currentY); }
                    }, 200); 
                });
                pBtn.addEventListener('mouseleave', (e) => {
                     e.stopPropagation();
                     if(showTimer) clearTimeout(showTimer);
                     if (!isPinned) { hideTimer = setTimeout(() => { closePreview(false); }, 300); }
                });
                pBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); e.preventDefault();
                    if(hideTimer) clearTimeout(hideTimer); if(showTimer) clearTimeout(showTimer);
                    let fullUrl = coverEl.href; 
                    if (!fullUrl) { const linkTag = card.querySelector('a[href*="/explore"]'); if (linkTag) fullUrl = linkTag.href; }
                    if (fullUrl) { showPreview(fullUrl, e.clientX, e.clientY); }
                });
                coverEl.appendChild(pBtn);
            }
        }
    }

    hookXHR();
    window.addEventListener('load', () => {
        addStyle();
        initPreviewWindow();
        GM_registerMenuCommand("管理屏蔽列表", () => {
            const existing = document.getElementById('xhs-block-manager-modal');
            if (existing) existing.remove();
            const list = getBlockedAuthors();
            const div = document.createElement('div');
            div.id = 'xhs-block-manager-modal';
            div.innerHTML = `
                <div class="xhs-header">
                    <span>已屏蔽 (${list.length})</span>
                    <span style="cursor:pointer;color:#999" onclick="this.parentElement.parentElement.remove()">✕</span>
                </div>
                <div class="xhs-list">
                    ${list.map(a => `<div class="xhs-row"><span>${a}</span><span class="xhs-del" data-n="${a}">移除</span></div>`).join('')}
                </div>
            `;
            document.body.appendChild(div);
            div.querySelectorAll('.xhs-del').forEach(btn => btn.onclick = function() {
                removeBlockedAuthor(this.dataset.n);
                this.parentElement.remove();
            });
        });
        const observer = new MutationObserver((mutations) => {
            let found = false; for (let m of mutations) { if(m.addedNodes.length) found = true; }
            if(found) document.querySelectorAll(SELECTOR_NOTE_CARD).forEach(processCard);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => document.querySelectorAll(SELECTOR_NOTE_CARD).forEach(processCard), 1000);
    });

})();
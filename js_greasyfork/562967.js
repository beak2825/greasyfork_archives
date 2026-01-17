// ==UserScript==
// @name         YouTube Music New Releases Auto-Queue (v9.0 Smart Show)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Only shows the button on the "New Releases / Albums" page. Auto-play 1st album & queue the rest.
// @author       Mark
// @license      MIT
// @match        https://music.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562967/YouTube%20Music%20New%20Releases%20Auto-Queue%20%28v90%20Smart%20Show%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562967/YouTube%20Music%20New%20Releases%20Auto-Queue%20%28v90%20Smart%20Show%29.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(function() {
    'use strict';

    const CONFIG = {
        btnId: 'my-auto-queue-btn',
        btnText: '▶ Queue New Releases',
        targetText: 'add to queue',
        defaultCount: 10,
        // 只有网址包含这段文字时，按钮才显示
        targetUrlPart: 'new_releases/albums' 
    };

    // --- 工具函数 ---
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function hoverElement(element) {
        if (!element) return;
        ['pointerover', 'mouseover', 'mouseenter'].forEach(type => {
            element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
        });
    }

    function deepClick(element, name) {
        if (!element) return;
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
        console.log(`[Action] Clicking: ${name}`);
        
        const originalBorder = element.style.border;
        element.style.border = "3px solid #00FF00"; 
        element.click(); 
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup'].forEach(type => {
            element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
        });
        setTimeout(() => { element.style.border = originalBorder; }, 300);
    }

    // --- 按钮创建与显示逻辑 ---
    function createButton() {
        if (document.getElementById(CONFIG.btnId)) return;
        const btn = document.createElement('button');
        btn.id = CONFIG.btnId;
        btn.innerText = CONFIG.btnText;
        Object.assign(btn.style, {
            position: 'fixed', top: '85px', right: '40px', zIndex: '99999',
            padding: '10px 16px', fontSize: '14px',
            backgroundColor: '#FF0000', color: 'white',
            border: '2px solid white', borderRadius: '8px',
            cursor: 'pointer', fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            display: 'none' // 默认先隐藏
        });
        btn.onclick = startProcess;
        document.body.appendChild(btn);
        
        // 创建完立刻检查一次
        checkVisibility();
    }

    // --- 智能显隐控制 ---
    function checkVisibility() {
        const btn = document.getElementById(CONFIG.btnId);
        if (!btn) return;

        // 检查当前网址是否包含目标路径
        if (window.location.href.includes(CONFIG.targetUrlPart)) {
            btn.style.display = 'block'; // 显示
        } else {
            btn.style.display = 'none';  // 隐藏
        }
    }

    // --- 主流程 ---
    async function startProcess() {
        const btn = document.getElementById(CONFIG.btnId);
        
        const albums = document.querySelectorAll('ytmusic-two-row-item-renderer');
        if (albums.length === 0) { 
            alert('No albums found. Please wait for the page to load.'); 
            return; 
        }

        let countStr = prompt(`Found ${albums.length} albums.\nHow many to play/queue?`, CONFIG.defaultCount);
        if (countStr === null) return;
        let count = parseInt(countStr);
        if (isNaN(count) || count < 1) count = CONFIG.defaultCount;
        const finalCount = Math.min(count, albums.length);

        const originalText = btn.innerText;
        btn.disabled = true;
        btn.style.backgroundColor = '#666';

        // Step 1: Play 1st
        btn.innerText = '▶ Playing 1st Album...';
        const firstSuccess = await playFirstAlbumPrecisely(albums[0]);
        
        if (!firstSuccess) {
            console.warn('Fallback to queue mode.');
            await queueAlbum(albums[0], 0); 
        } else {
            await sleep(4000); 
        }

        // Step 2: Queue Rest
        const startIndex = firstSuccess ? 1 : 1; 
        for (let i = startIndex; i < finalCount; i++) {
            btn.innerText = `Queuing: ${i + 1}/${finalCount}`;
            await queueAlbum(albums[i], i);
        }

        btn.innerText = '✅ Done!';
        setTimeout(() => resetBtn(btn, originalText), 3000);
    }

    function resetBtn(btn, text) {
        btn.innerText = text;
        btn.style.backgroundColor = '#FF0000';
        btn.disabled = false;
    }

    async function playFirstAlbumPrecisely(album) {
        hoverElement(album);
        await sleep(200);
        const playRenderer = album.querySelector('ytmusic-play-button-renderer');
        if (playRenderer) {
            const realIcon = playRenderer.querySelector('.icon') || playRenderer;
            deepClick(realIcon, "First Album Play Icon");
            return true;
        } 
        const overlayIcon = album.querySelector('#play-button');
        if (overlayIcon) {
             deepClick(overlayIcon, "Overlay Play Icon");
             return true;
        }
        return false;
    }

    async function queueAlbum(album, index) {
        const menuRenderer = album.querySelector('ytmusic-menu-renderer');
        if (!menuRenderer) return;

        const realBtn = menuRenderer.querySelector('button') || menuRenderer;
        deepClick(realBtn, `Album ${index} Menu`);

        let popup = null;
        for (let t = 0; t < 15; t++) { 
            const popups = document.querySelectorAll('ytmusic-menu-popup-renderer');
            if (popups.length > 0) {
                const lastPopup = popups[popups.length - 1];
                if (lastPopup.offsetWidth > 0) {
                    popup = lastPopup;
                    break;
                }
            }
            await sleep(200);
        }

        if (!popup) {
            document.body.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape', 'bubbles':true}));
            return;
        }

        const items = popup.querySelectorAll('ytmusic-menu-service-item-renderer, ytmusic-menu-navigation-item-renderer');
        let found = false;
        for (const item of items) {
            const text = (item.innerText || "").toLowerCase();
            if (text.includes(CONFIG.targetText)) {
                deepClick(item, "Queue Option");
                found = true;
                break;
            }
        }

        if (!found) {
            document.body.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape', 'bubbles':true}));
        }
        await sleep(1000); 
    }

    // --- 初始化监听 ---
    // 1. 延迟创建按钮
    setTimeout(createButton, 2000);

    // 2. 监听 YouTube Music 的页面跳转事件 (SPA)
    window.addEventListener('yt-navigate-finish', function() {
        setTimeout(checkVisibility, 500); // 跳转完成后检查一次
    });
    
    // 3. 兜底策略：每2秒检查一次网址，确保万无一失
    setInterval(checkVisibility, 2000);

})();
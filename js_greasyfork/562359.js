// ==UserScript==
// @name         YouTubeのサムネイルを取得するツール
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  ショートカット「Q」で全サイズサムネイルを表示。ドラッグ移動・レスポンシブ対応。
// @author       mfiurotofu & Gemini
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562359/YouTube%E3%81%AE%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/562359/YouTube%E3%81%AE%E3%82%B5%E3%83%A0%E3%83%8D%E3%82%A4%E3%83%AB%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ショートカットキーの設定 (ここでは 'q' に設定)
    const TOGGLE_KEY = 'q';

    const THUMB_TYPES = [
        { id: 'maxresdefault.jpg', label: 'Max Res (1280x720)' },
        { id: 'sddefault.jpg', label: 'Standard (640x480)' },
        { id: 'hqdefault.jpg', label: 'High (480x360)' },
        { id: 'mqdefault.jpg', label: 'Medium (320x180)' },
        { id: '1.jpg', label: 'Timeline 1' },
        { id: '2.jpg', label: 'Timeline 2' },
        { id: '3.jpg', label: 'Timeline 3' }
    ];

    function createUI() {
        if (document.getElementById('yt-thumb-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'yt-thumb-overlay';
        overlay.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:10000; background:rgba(0,0,0,0.7); backdrop-filter:blur(2px);';
        
        const panel = document.createElement('div');
        panel.id = 'yt-thumb-panel';
        panel.style.cssText = `
            display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
            background:#1e1e1e; border:1px solid #444; z-index:10001; 
            width:95vw; max-width:900px; border-radius:12px; 
            color:white; font-family:"Roboto",Arial,sans-serif; overflow:hidden; flex-direction:column;
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        `;
        
        const header = document.createElement('div');
        header.id = 'yt-thumb-header';
        header.style.cssText = 'padding:12px 20px; background:#2a2a2a; cursor:move; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333;';
        header.innerHTML = `<span style="font-weight:bold; font-size:14px; opacity:0.8;">Thumbnails (Shortcut: ${TOGGLE_KEY.toUpperCase()})</span><div id="yt-thumb-close" style="cursor:pointer; font-size:24px; line-height:1; color:#888;">&times;</div>`;
        
        const content = document.createElement('div');
        content.id = 'yt-thumb-content';
        content.style.cssText = 'padding:20px; overflow-y:auto; max-height:75vh;';

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        const toggle = () => {
            if (panel.style.display === 'none') { openUI(); } 
            else { panel.style.display = 'none'; overlay.style.display = 'none'; }
        };
        
        document.getElementById('yt-thumb-close').onclick = toggle;
        overlay.onclick = toggle;

        // ドラッグ機能
        let isDragging = false, oX, oY;
        header.onmousedown = (e) => {
            if(e.target.id === 'yt-thumb-close') return;
            isDragging = true;
            const r = panel.getBoundingClientRect();
            oX = e.clientX - r.left; oY = e.clientY - r.top;
            panel.style.transform = 'none';
        };
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - oX) + 'px';
            panel.style.top = (e.clientY - oY) + 'px';
        });
        window.addEventListener('mouseup', () => isDragging = false);

        // ショートカットキー設定
        window.addEventListener('keydown', (e) => {
            // 入力フォームにフォーカスがある時は無効
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            if (e.key.toLowerCase() === TOGGLE_KEY) { toggle(); }
        });
    }

    function openUI() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        const content = document.getElementById('yt-thumb-content');
        content.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:20px;';

        THUMB_TYPES.forEach(type => {
            const url = `https://img.youtube.com/vi/${videoId}/${type.id}`;
            const wrap = document.createElement('div');
            wrap.style.cssText = 'text-align:center; display:flex; flex-direction:column;';
            
            const imgBox = document.createElement('div');
            imgBox.style.cssText = 'background:#000; border-radius:8px; overflow:hidden; border:1px solid #333; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; position:relative;';
            
            const img = document.createElement('img');
            img.src = url;
            img.style.cssText = 'width:100%; height:100%; object-fit:contain; cursor:zoom-in;';
            
            // 404エラーまたはYouTubeの「画像なし用画像(120x90)」を検知
            img.onload = () => {
                if (img.naturalWidth === 120 && img.naturalHeight === 90) {
                    imgBox.innerHTML = '<span style="font-size:12px; color:#555;">Not Available</span>';
                }
            };
            img.onerror = () => {
                imgBox.innerHTML = '<span style="font-size:12px; color:#555;">Not Available</span>';
            };
            img.onclick = () => window.open(url, '_blank');

            const label = document.createElement('div');
            label.innerText = type.label;
            label.style.cssText = 'font-size:11px; color:#777; margin-top:8px;';

            imgBox.appendChild(img);
            wrap.appendChild(imgBox);
            wrap.appendChild(label);
            grid.appendChild(wrap);
        });

        content.appendChild(grid);
        const panel = document.getElementById('yt-thumb-panel');
        const overlay = document.getElementById('yt-thumb-overlay');
        panel.style.display = 'flex';
        overlay.style.display = 'block';
    }

    function injectButton() {
        const bar = document.querySelector('#top-level-buttons-computed');
        if (!bar || document.getElementById('yt-thumb-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'yt-thumb-btn';
        btn.innerText = 'サムネイル';
        btn.style.cssText = 'background:rgba(255,255,255,0.1); border:none; color:#eee; padding:0 15px; margin-left:8px; cursor:pointer; font-size:13px; height:36px; border-radius:18px; font-weight:500; transition: 0.2s; white-space:nowrap;';
        
        btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.2)';
        btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.1)';
        btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openUI(); };

        bar.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        createUI();
        injectButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
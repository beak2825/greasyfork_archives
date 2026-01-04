// ==UserScript==
// @name         Pinterest Ultra Assistant V7.2 (Perfect Aspect Ratio)
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  Fixes image distortion in 2x mode. 100% accurate aspect ratio for Pinterest Originals.
// @author       Pi Xiao
// @match        https://*.pinterest.com/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560387/Pinterest%20Ultra%20Assistant%20V72%20%28Perfect%20Aspect%20Ratio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560387/Pinterest%20Ultra%20Assistant%20V72%20%28Perfect%20Aspect%20Ratio%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BRIDGE_PAGE = "https://meishubiji.cn/ai-processing-center/";

    // --- 1. 颜色与解析逻辑 ---
    function getColorDist(hex1, hex2) {
        const r1 = parseInt(hex1.slice(1,3), 16), g1 = parseInt(hex1.slice(3,5), 16), b1 = parseInt(hex1.slice(5,7), 16);
        const r2 = parseInt(hex2.slice(1,3), 16), g2 = parseInt(hex2.slice(3,5), 16), b2 = parseInt(hex2.slice(5,7), 16);
        return Math.sqrt((r1-r2)**2 * 0.3 + (g1-g2)**2 * 0.59 + (b1-b2)**2 * 0.11);
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function getVividPalette(img) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100; canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            const data = ctx.getImageData(0, 0, 100, 100).data;
            let colorMap = {};
            for (let i = 0; i < data.length; i += 12) {
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                if (a < 128) continue;
                const saturation = Math.max(r, g, b) - Math.min(r, g, b);
                let bias = (saturation > 40) ? 1 : 0.1;
                const hex = rgbToHex(r, g, b);
                colorMap[hex] = (colorMap[hex] || 0) + (Math.pow(saturation, 2) * bias + 1);
            }
            const sorted = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
            const final = [];
            for (const c of sorted) {
                if (final.length >= 6) break;
                if (final.every(ec => getColorDist(ec, c) > 50)) final.push(c);
            }
            return final;
        } catch(e) { return []; }
    }

    const getOriginalUrl = (url) => url.replace(/\/(236x|474x|564x|736x|1200x)\//, '/originals/').replace(/\.webp$/, '.jpg');

    function destroyOverlay() {
        const overlay = document.getElementById('px-ultra-overlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleEsc);
        }
    }

    function handleEsc(e) { if (e.key === "Escape") destroyOverlay(); }

    // --- 2. 预览窗核心逻辑 (修正比例) ---
    async function processAndShow(imgUrl) {
        const originalUrl = getOriginalUrl(imgUrl);
        document.body.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.id = "px-ultra-overlay";
        overlay.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.98);z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;";
        overlay.onclick = (e) => { if(e.target === overlay) destroyOverlay(); };
        
        overlay.innerHTML = `
            <div id="px-loader" style="text-align:center;"><div class="px-spin"></div><p style="margin-top:10px;color:#00ffcc;font-size:12px;">OPTIMIZING RATIO...</p></div>
            <div id="px-close" style="position:fixed;top:25px;right:25px;width:45px;height:45px;background:#E60023;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;cursor:pointer;z-index:2147483647;box-shadow:0 0 15px rgba(0,0,0,0.5);">×</div>
            <style>.px-spin{width:30px;height:30px;border:3px solid rgba(0,255,204,0.1);border-top-color:#00ffcc;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto;}@keyframes spin{to{transform:rotate(360deg)}} #px-view-port::-webkit-scrollbar{width:6px;height:6px;}#px-view-port::-webkit-scrollbar-thumb{background:#333;border-radius:10px;}</style>
        `;
        document.body.appendChild(overlay);
        document.getElementById('px-close').onclick = destroyOverlay;
        document.addEventListener('keydown', handleEsc);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = originalUrl;
        img.onload = function() {
            if(document.getElementById('px-loader')) document.getElementById('px-loader').remove();
            const palette = getVividPalette(img);
            
            const viewPort = document.createElement('div');
            viewPort.id = "px-view-port";
            viewPort.style = "width:92%; height:72vh; overflow:auto; display:flex; align-items:center; justify-content:center; background:#000; border:1px solid #222; border-radius:12px; position:relative;";
            
            const pImg = document.createElement('img');
            pImg.src = originalUrl;
            // 初始 Fit-to-screen 状态：绝对不会变形
            pImg.style = "max-width:98%; max-height:98%; width:auto; height:auto; object-fit:contain; cursor:zoom-in; image-rendering:-webkit-optimize-contrast;";
            
            let isZoomed = false;
            pImg.onclick = () => {
                isZoomed = !isZoomed;
                if (isZoomed) {
                    // 【关键修复】：基于图片原始宽高做 2 倍物理放大，锁定比例
                    pImg.style.maxWidth = "none";
                    pImg.style.maxHeight = "none";
                    pImg.style.width = (img.naturalWidth * 2) + "px";
                    pImg.style.height = "auto"; 
                    pImg.style.cursor = "zoom-out";
                    // 放大后允许靠左上对齐进行滚动
                    viewPort.style.alignItems = "flex-start";
                    viewPort.style.justifyContent = "flex-start";
                } else {
                    pImg.style.maxWidth = "98%";
                    pImg.style.maxHeight = "98%";
                    pImg.style.width = "auto";
                    pImg.style.height = "auto";
                    pImg.style.cursor = "zoom-in";
                    viewPort.style.alignItems = "center";
                    viewPort.style.justifyContent = "center";
                }
            };
            viewPort.appendChild(pImg);

            const bar = document.createElement('div');
            bar.style = "width:100%; padding:20px 0; display:flex; flex-direction:column; align-items:center; gap:15px;";
            
            let palHTML = '<div style="display:flex;gap:10px;align-items:center;"><span style="font-size:10px;color:#444;text-transform:uppercase;letter-spacing:1px;">Soul Palette:</span>';
            palette.forEach(c => { palHTML += `<div class="px-c" style="width:24px;height:24px;background:${c};border-radius:4px;cursor:pointer;border:1px solid #222;" data-hex="${c}"></div>`; });
            palHTML += '</div>';

            bar.innerHTML = palHTML + `<div><button id="px-final-go" style="background:linear-gradient(45deg,#6a11cb 0%,#2575fc 100%);color:white;border:none;padding:12px 55px;border-radius:50px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 10px 30px rgba(37,117,252,0.4);">🚀 LAUNCH AI 8K ENGINE</button></div><p style="color:#333;font-size:11px;">Click Image to Zoom 2X (Aspect Ratio Locked) | ESC to Close</p>`;

            overlay.appendChild(viewPort);
            overlay.appendChild(bar);
            
            overlay.querySelectorAll('.px-c').forEach(el => {
                el.onclick = () => { GM_setClipboard(el.dataset.hex); el.style.borderColor = "#fff"; setTimeout(()=>el.style.borderColor="#222",500); };
            });
            document.getElementById('px-final-go').onclick = () => window.open(`${BRIDGE_PAGE}?url=${encodeURIComponent(originalUrl)}`, '_blank');
        };
        img.onerror = () => { window.open(originalUrl, '_blank'); destroyOverlay(); };
    }

    // --- 3. 注入逻辑 (3按钮回归) ---
    function inject() {
        const images = document.querySelectorAll('img[src*="pinimg.com"]:not(.px-done)');
        images.forEach(img => {
            if (img.width < 150) return;
            img.classList.add('px-done');

            const container = img.closest('[data-test-id="pin-visual-wrapper"]') || 
                              img.closest('[data-test-id="visual-content-container"]') || 
                              img.parentElement;

            if (container) {
                const bar = document.createElement('div');
                bar.className = 'px-helper-bar';
                bar.style = "position:absolute; top:12px; left:12px; z-index:1000; display:flex; gap:4px; opacity:0; transition:opacity 0.2s; pointer-events:auto;";
                
                const btnS = 'color:white; border:none; border-radius:4px; cursor:pointer; padding:4px 10px; font-weight:bold; font-size:10px; box-shadow:0 2px 8px rgba(0,0,0,0.5); white-space:nowrap;';
                
                const b1 = document.createElement('button'); b1.innerHTML = '🪄 2x HD'; b1.style = btnS + 'background:#00BFFF;';
                b1.onclick = (e) => { e.preventDefault(); e.stopPropagation(); processAndShow(img.src); };
                
                const b2 = document.createElement('button'); b2.innerHTML = '🖼️ Originals'; b2.style = btnS + 'background:#E60023;';
                b2.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.open(getOriginalUrl(img.src), '_blank'); };

                const b3 = document.createElement('button'); b3.innerHTML = '🔍 Source'; b3.style = btnS + 'background:#34a853;';
                b3.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.open(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(getOriginalUrl(img.src))}`, '_blank'); };

                bar.append(b1, b2, b3);
                container.appendChild(bar);

                container.addEventListener('mouseenter', () => {
                    if (window.getComputedStyle(container).position === 'static') container.style.position = 'relative';
                    bar.style.opacity = "1";
                });
                container.addEventListener('mouseleave', () => bar.style.opacity = "0");
            }
        });
    }

    setInterval(inject, 2500);
    const obs = new MutationObserver(inject);
    obs.observe(document.body, { childList: true, subtree: true });

})();
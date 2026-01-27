// ==UserScript==
// @name         Ultimate Image Assistant: Pinterest, Lexica, Twitter HD Originals, AI 2x Enhance & Save as JPG
// @namespace    http://tampermonkey.net/
// @version      8.8
// @description  The Most Stable Version: One-Click Originals, AI 2x Sharpen, Source Finder, and Save as JPG.
// @author       Pi Xiao
// @match        https://*.pinterest.com/*
// @match        https://lexica.art/*
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @license      MIT
// @keywords Pinterest, Twitter, Lexica, HD, Download, Originals, AI Enhance, Color Palette, JPG Converter
// @downloadURL https://update.greasyfork.org/scripts/560387/Ultimate%20Image%20Assistant%3A%20Pinterest%2C%20Lexica%2C%20Twitter%20HD%20Originals%2C%20AI%202x%20Enhance%20%20Save%20as%20JPG.user.js
// @updateURL https://update.greasyfork.org/scripts/560387/Ultimate%20Image%20Assistant%3A%20Pinterest%2C%20Lexica%2C%20Twitter%20HD%20Originals%2C%20AI%202x%20Enhance%20%20Save%20as%20JPG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BRIDGE_PAGE = "https://meishubiji.cn/ai-processing-center/";

    // --- 1. 原图解析逻辑 ---
    function getOriginalUrl(src) {
        if(!src) return "";
        const host = location.host;
        if (host.includes('pinterest.com')) return src.replace(/\/(236x|474x|564x|736x|1200x)\//, '/originals/').replace(/\.webp$/, '.jpg');
        if (host.includes('lexica.art')) return src.replace('full_webp', 'full_jpg');
        if (host.includes('twitter.com') || host.includes('x.com')) {
            if (src.includes('pbs.twimg.com')) {
                const base = src.split('?')[0];
                return `${base}?format=jpg&name=orig`;
            }
        }
        return src;
    }

    // --- 2. 颜色与算法逻辑 ---
    function getColorDist(h1, h2) {
        const r1=parseInt(h1.slice(1,3),16), g1=parseInt(h1.slice(3,5),16), b1=parseInt(h1.slice(5,7),16);
        const r2=parseInt(h2.slice(1,3),16), g2=parseInt(h2.slice(3,5),16), b2=parseInt(h2.slice(5,7),16);
        return Math.sqrt((r1-r2)**2 * 0.3 + (g1-g2)**2 * 0.59 + (b1-b2)**2 * 0.11);
    }
    const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

    function getVividPalette(img) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100; canvas.height = 100;
            ctx.drawImage(img, 0, 0, 100, 100);
            const data = ctx.getImageData(0, 0, 100, 100).data;
            let colorMap = {};
            for (let i = 0; i < data.length; i += 12) {
                const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
                if (a < 128) continue;
                const saturation = Math.max(r, g, b) - Math.min(r, g, b);
                let bias = (saturation > 40) ? 1.5 : 0.1;
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

    function destroyOverlay() {
        const overlay = document.getElementById('px-matrix-overlay');
        if (overlay) { overlay.remove(); document.body.style.overflow = 'auto'; }
    }

    // --- 3. 新功能：后台静默 WebP 转 JPG 下载器 ---
    function downloadAsJPG(imgUrl) {
        const originalUrl = getOriginalUrl(imgUrl);
        const img = new Image();
        img.crossOrigin = "Anonymous"; // 必须跨域，否则无法导出
        img.src = originalUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // 转成高质量 JPG
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                // 自动重命名，秒杀原生下载
                a.download = `Designer_HD_${Date.now()}.jpg`; 
                a.click();
                URL.revokeObjectURL(url);
            }, 'image/jpeg', 1.0);
        };

        img.onerror = () => {
            alert("This image is protected. Opening in a new tab instead.");
            window.open(originalUrl, '_blank');
        };
    }


    // --- 4. 智能预览窗 ---
    async function processAndShow(imgUrl) {
        const originalUrl = getOriginalUrl(imgUrl);
        document.body.style.overflow = 'hidden';
        const overlay = document.createElement('div');
        overlay.id = "px-matrix-overlay";
        overlay.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.98);z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;font-family:sans-serif;";
        overlay.onclick = (e) => { if(e.target === overlay) destroyOverlay(); };
        
        overlay.innerHTML = `
            <div id="px-loader" style="text-align:center;"><div class="px-spin"></div><p style="margin-top:10px;color:#00ffcc;font-size:12px;">ENHANCING...</p></div>
            <div id="px-close" style="position:fixed;top:25px;right:25px;width:45px;height:45px;background:#E60023;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:bold;cursor:pointer;z-index:2147483647;">×</div>
            <style>.px-spin{width:30px;height:30px;border:2px solid rgba(0,255,204,0.1);border-top-color:#00ffcc;border-radius:50%;animation:pxspin .8s linear infinite;margin:0 auto;}@keyframes pxspin{to{transform:rotate(360deg)}} #px-scroll-box::-webkit-scrollbar{width:6px;height:6px;}#px-scroll-box::-webkit-scrollbar-thumb{background:#333;border-radius:10px;}</style>
        `;
        document.body.appendChild(overlay);
        document.getElementById('px-close').onclick = destroyOverlay;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = originalUrl;
        img.onload = function() {
            if(document.getElementById('px-loader')) document.getElementById('px-loader').remove();
            const palette = getVividPalette(img);
            const scrollBox = document.createElement('div');
            scrollBox.id = "px-scroll-box";
            scrollBox.style = "width:92%; height:72vh; overflow:auto; display:flex; align-items:center; justify-content:center; background:#000; border:1px solid #222; border-radius:12px;";
            const pImg = document.createElement('img');
            pImg.src = originalUrl;
            pImg.style = "max-width:98%; max-height:98%; object-fit:contain; cursor:zoom-in; image-rendering:-webkit-optimize-contrast;";
            
            let isZoomed = false;
            pImg.onclick = () => {
                isZoomed = !isZoomed;
                if (isZoomed) {
                    pImg.style.maxWidth = "none"; pImg.style.maxHeight = "none";
                    pImg.style.width = (img.naturalWidth * 2) + "px";
                    pImg.style.cursor = "zoom-out";
                    scrollBox.style.alignItems = "flex-start";
                    scrollBox.style.justifyContent = "flex-start";
                } else {
                    pImg.style.maxWidth = "98%"; pImg.style.maxHeight = "98%";
                    pImg.style.width = "auto"; pImg.style.cursor = "zoom-in";
                    scrollBox.style.alignItems = "center";
                    scrollBox.style.justifyContent = "center";
                }
            };
            scrollBox.appendChild(pImg);

            const bar = document.createElement('div');
            bar.style = "width:100%; padding:20px 0; display:flex; flex-direction:column; align-items:center; gap:15px;";
            let palHTML = '<div style="display:flex;gap:10px;align-items:center;"><span style="font-size:10px;color:#444;text-transform:uppercase;letter-spacing:1px;">Soul Palette:</span>';
            palette.forEach(c => { palHTML += `<div class="px-c" style="width:26px;height:26px;background:${c};border-radius:6px;cursor:pointer;border:2px solid #222;" data-hex="${c}"></div>`; });
            palHTML += '</div>';
            bar.innerHTML = palHTML + `<div><button id="px-final-go" style="background:linear-gradient(45deg,#6a11cb 0%,#2575fc 100%);color:white;border:none;padding:12px 50px;border-radius:50px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 10px 30px rgba(37,117,252,0.4);">🚀 LAUNCH AI 8K ENGINE</button></div>`;
            
            overlay.appendChild(scrollBox);
            overlay.appendChild(bar);
            overlay.querySelectorAll('.px-c').forEach(el => { el.onclick = () => { GM_setClipboard(el.dataset.hex); el.style.borderColor="#fff"; setTimeout(()=>el.style.borderColor="#222",500); }; });
            document.getElementById('px-final-go').onclick = () => window.open(`${BRIDGE_PAGE}?url=${encodeURIComponent(originalUrl)}`, '_blank');
        };
        img.onerror = () => { window.open(originalUrl, '_blank'); destroyOverlay(); };
    }

    // --- 5. 四合一注入逻辑 ---
    function inject() {
        const images = document.querySelectorAll('img:not(.px-done)');
        images.forEach(img => {
            const src = img.src;
            if (!src || img.width < 120 || img.closest('.px-helper-bar')) return;
            
            const isTarget = ['pinimg.com', 'lexica.art', 'twimg.com'].some(d => src.includes(d));
            if (!isTarget) return;
            img.classList.add('px-done');

            const container = img.closest('div[role="dialog"]') || 
                              img.closest('[data-test-id="pin-visual-wrapper"]') ||
                              img.closest('article div[data-testid="tweetPhoto"]') ||
                              img.parentElement;

            if (container) {
                if (window.getComputedStyle(container).position === 'static') container.style.position = 'relative';
                const bar = document.createElement('div');
                bar.className = 'px-helper-bar';
                // 稍微增加一点间距以容纳4个按钮
                bar.style = "position:absolute; top:10px; left:10px; z-index:10000; display:flex; gap:3px; opacity:0; transition:0.3s; pointer-events:auto;";
                
                const lockedSrc = src; 
                // 字体微调到 8.5px，防止4个按钮超出图片宽度
                const btnS = 'color:white; border:none; border-radius:4px; cursor:pointer; padding:4px 6px; font-weight:bold; font-size:8.5px; box-shadow:0 2px 5px rgba(0,0,0,0.3); white-space:nowrap;';
                
                const b1 = document.createElement('button'); b1.innerHTML = '🪄 2x HD'; b1.style = btnS + 'background:#00BFFF;';
                b1.onclick = (e) => { e.preventDefault(); e.stopPropagation(); processAndShow(lockedSrc); };
                
                const b2 = document.createElement('button'); b2.innerHTML = '🖼️ View'; b2.style = btnS + 'background:#E60023;';
                b2.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.open(getOriginalUrl(lockedSrc), '_blank'); };

                // 新增：JPG 下载器
                const b3 = document.createElement('button'); b3.innerHTML = '💾 JPG'; b3.style = btnS + 'background:#6a11cb;'; // 魅惑紫
                b3.onclick = (e) => { 
                    e.preventDefault(); e.stopPropagation(); 
                    // 按钮点击后稍微变个色给反馈
                    b3.innerHTML = '⏳ Saving...';
                    b3.style.background = '#888';
                    downloadAsJPG(lockedSrc); 
                    setTimeout(() => { b3.innerHTML = '💾 JPG'; b3.style.background = '#6a11cb'; }, 2000);
                };

                const b4 = document.createElement('button'); b4.innerHTML = '🔍 Src'; b4.style = btnS + 'background:#34a853;';
                b4.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.open(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(getOriginalUrl(lockedSrc))}`, '_blank'); };

                bar.append(b1, b2, b3, b4);
                container.appendChild(bar);
                container.addEventListener('mouseenter', () => bar.style.opacity = "1");
                container.addEventListener('mouseleave', () => bar.style.opacity = "0");
            }
        });
    }

    setInterval(inject, 2000);
    const obs = new MutationObserver(inject);
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('keydown', (e) => { if(e.key === "Escape") destroyOverlay(); });

})();
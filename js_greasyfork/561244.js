// ==UserScript==
// @name         图片查看器（一键打开网页全部图片，全屏单图查看和缩略图模式）
// @namespace    https://greasyfork.org/zh-CN/scripts/561244-%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8-%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%85%A8%E9%83%A8%E5%9B%BE%E7%89%87-%E5%85%A8%E5%B1%8F%E5%8D%95%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%92%8C%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%A8%A1%E5%BC%8F
// @version      1.5
// @description  自动提取网页所有图片，支持全屏沉浸式浏览、多宫格缩略图预览，退出时精准定位该图片位置。
// @author       shao51920
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561244/%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8%EF%BC%88%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%85%A8%E9%83%A8%E5%9B%BE%E7%89%87%EF%BC%8C%E5%85%A8%E5%B1%8F%E5%8D%95%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%92%8C%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%A8%A1%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561244/%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B%E5%99%A8%EF%BC%88%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%E7%BD%91%E9%A1%B5%E5%85%A8%E9%83%A8%E5%9B%BE%E7%89%87%EF%BC%8C%E5%85%A8%E5%B1%8F%E5%8D%95%E5%9B%BE%E6%9F%A5%E7%9C%8B%E5%92%8C%E7%BC%A9%E7%95%A5%E5%9B%BE%E6%A8%A1%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let images = []; 
    let currentIndex = 0;
    let scale = 1;
    let rotation = 0;
    let playTimer = null;
    const MIN_SIZE = 200;

    // --- 1. 定位修复：针对小红书 SPA 框架优化 ---
    async function scrollToOriginal(idx) {
        if (!images[idx]) return;

        // 彻底关闭查看器 UI
        viewer.style.display = 'none';
        if (playTimer) { clearInterval(playTimer); playTimer = null; }
        if (document.fullscreenElement) {
            await document.exitFullscreen().catch(()=>{});
        }

        // 尝试获取最新的 DOM 引用（防止节点被小红书回收）
        let targetEl = images[idx].el;
        
        // 如果原节点失效，尝试通过 URL 重新在页面中寻找
        if (!document.body.contains(targetEl)) {
            const allImgs = document.querySelectorAll('img');
            for (let img of allImgs) {
                if (img.src === images[idx].originalSrc) {
                    targetEl = img;
                    break;
                }
            }
        }

        if (!targetEl) return;

        setTimeout(() => {
            // 使用更兼容的 scrollIntoView 解决小红书内部容器滚动问题
            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });

            // --- 蓝色艺术光圈（强制 CSS 权重） ---
            const highlightColor = '#0078ff'; // 蓝色
            targetEl.style.setProperty('outline', `8px solid ${highlightColor}`, 'important');
            targetEl.style.setProperty('outline-offset', '10px', 'important');
            targetEl.style.setProperty('box-shadow', `0 0 40px ${highlightColor}`, 'important');
            targetEl.style.setProperty('transition', 'all 0.5s ease', 'important');
            
            setTimeout(() => {
                targetEl.style.outline = 'none';
                targetEl.style.boxShadow = 'none';
            }, 2000);
        }, 250); // 增加缓冲时间确保全屏已完全退出
    }

    // --- 2. 高清探测（含小红书参数剥离） ---
    function getHDUrl(img) {
        let src = img.currentSrc || img.src || img.getAttribute('data-src') || "";
        if (!src || src.startsWith('data:')) return null;

        const host = window.location.hostname;

        // 小红书原图剥离逻辑
        if (host.includes('xiaohongshu.com') || host.includes('xhscdn.com')) {
            return src.split('?')[0].split('@')[0].replace(/\/format,\w+/, '');
        }

        // Wallhaven/Emonl 等站点逻辑保持不变
        if (host.includes('wallhaven.cc')) {
            if (src.includes('/small/') || src.includes('/thumb/')) {
                return src.replace('th.wallhaven.cc', 'w.wallhaven.cc').replace(/\/(small|thumb)\//, '/full/').replace(/\/([^\/]+)\.(jpg|png)$/, '/wallhaven-$1.$2');
            }
        }
        if (host.includes('emonl.com') || host.includes('kkc3.com')) {
            return src.replace(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i, '.$1');
        }

        const pA = img.closest('a');
        if (pA && pA.href && pA.href.match(/\.(jpg|jpeg|png|webp|gif|bmp)(\?.*)?$/i)) return pA.href;

        return src;
    }

    // --- 3. UI 构造 ---
    const viewer = document.createElement('div');
    viewer.id = 'gm-viewer-root';
    Object.assign(viewer.style, {
        all: 'initial', display: 'none', position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: '#000', zIndex: '2147483647', overflow: 'hidden'
    });

    const icons = {
        grid: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
        prev: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 18l-6-6 6-6"/></svg>`,
        next: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 18l6-6-6-6"/></svg>`,
        rotate: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
        play: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
        pause: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
        dl: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3"/></svg>`,
        close: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
    };

    viewer.innerHTML = `
        <style>
            .gm-btn { cursor: pointer; padding: 10px; color: rgba(255,255,255,0.4); transition: 0.2s; display: flex; align-items: center; }
            .gm-btn:hover { color: #fff; transform: scale(1.1); background: rgba(255,255,255,0.05); border-radius: 50%; }
            .gm-toolbar { position: fixed; bottom: 20px; right: 20px; display: flex; gap: 5px; align-items: center; z-index: 100; }
            .gm-counter { color: rgba(255,255,255,0.3); font-family: "Segoe UI", sans-serif; font-size: 13px; margin-right: 15px; }
            #gm-img-wrap { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; }
            #gm-active-img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.2s ease-out; cursor: crosshair; }
            #gm-grid-view { display:none; width: 100vw; height: 100vh; overflow-y: auto; padding: 40px; box-sizing: border-box; 
                            display: grid; grid-template-columns: repeat(auto-fill, 180px); grid-auto-rows: 180px; gap: 15px; justify-content: center; align-content: start; background: #000; }
        </style>
        <div id="gm-img-wrap"><img id="gm-active-img" title="双击退出并定位到原图位置"></div>
        <div id="gm-grid-view"></div>
        <div class="gm-toolbar">
            <div class="gm-counter" id="gm-info"></div>
            <div class="gm-btn" id="btn-grid" title="宫格缩略图 [G]">${icons.grid}</div>
            <div class="gm-btn" id="btn-prev" title="上一张 [←]">${icons.prev}</div>
            <div class="gm-btn" id="btn-next" title="下一张 [→]">${icons.next}</div>
            <div class="gm-btn" id="btn-rotate" title="旋转 [R]">${icons.rotate}</div>
            <div class="gm-btn" id="btn-play" title="自动播放 [P]">${icons.play}</div>
            <div class="gm-btn" id="btn-dl" title="查看高清原图 [D]">${icons.dl}</div>
            <div class="gm-btn" id="btn-close" title="退出并定位 [Esc]">${icons.close}</div>
        </div>
    `;

    document.body.appendChild(viewer);
    const mainImg = viewer.querySelector('#gm-active-img');
    const gridView = viewer.querySelector('#gm-grid-view');
    const info = viewer.querySelector('#gm-info');

    function scan() {
        const tempImages = [];
        const urlSet = new Set();
        document.querySelectorAll('img').forEach(img => {
            if (img.width >= MIN_SIZE || img.naturalWidth >= MIN_SIZE || !img.complete) {
                const url = getHDUrl(img);
                if (url && !urlSet.has(url)) {
                    urlSet.add(url);
                    tempImages.push({ url: url, el: img, originalSrc: img.src });
                }
            }
        });
        images = tempImages;
        return images.length > 0;
    }

    function update(idx) {
        if (images.length === 0) return;
        currentIndex = (idx + images.length) % images.length;
        scale = 1; rotation = 0;
        mainImg.style.transform = `scale(1) rotate(0deg)`;
        mainImg.src = images[currentIndex].url;
        info.innerText = `${currentIndex + 1} / ${images.length}`;
    }

    // --- 4. 交互绑定 ---
    window.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        if (e.altKey && k === 'v') {
            if (scan()) {
                viewer.style.display = 'block';
                viewer.querySelector('#gm-img-wrap').style.display = 'flex';
                gridView.style.display = 'none';
                update(0);
                document.documentElement.requestFullscreen().catch(()=>{});
            }
        }
        if (viewer.style.display === 'none') return;
        if (k === 'escape') { e.preventDefault(); scrollToOriginal(currentIndex); }
        if (e.key === 'ArrowRight') update(currentIndex + 1);
        if (e.key === 'ArrowLeft') update(currentIndex - 1);
        if (k === 'r') { rotation += 90; mainImg.style.transform = `scale(${scale}) rotate(${rotation}deg)`; }
        if (k === 'g') {
            const isG = gridView.style.display === 'grid';
            gridView.style.display = isG ? 'none' : 'grid';
            viewer.querySelector('#gm-img-wrap').style.display = isG ? 'flex' : 'none';
            if (!isG) {
                gridView.innerHTML = images.map((imgObj, i) => 
                    `<div style="overflow:hidden;background:#111;border-radius:8px;"><img src="${imgObj.url}" data-idx="${i}" style="width:100%;height:100%;object-fit:cover;cursor:pointer"></div>`
                ).join('');
            }
        }
        if (k === 'p') {
            if (playTimer) { clearInterval(playTimer); playTimer = null; viewer.querySelector('#btn-play').innerHTML = icons.play; }
            else { playTimer = setInterval(() => update(currentIndex + 1), 3000); viewer.querySelector('#btn-play').innerHTML = icons.pause; }
        }
        if (k === 'd') { e.preventDefault(); window.open(images[currentIndex].url, '_blank'); }
    });

    mainImg.ondblclick = () => scrollToOriginal(currentIndex);
    
    gridView.addEventListener('dblclick', (e) => {
        if (e.target.tagName === 'IMG') {
            scrollToOriginal(parseInt(e.target.dataset.idx));
        }
    });

    viewer.querySelector('#btn-close').onclick = () => scrollToOriginal(currentIndex);
    viewer.querySelector('#btn-next').onclick = () => update(currentIndex + 1);
    viewer.querySelector('#btn-prev').onclick = () => update(currentIndex - 1);
    viewer.querySelector('#btn-rotate').onclick = () => { rotation += 90; mainImg.style.transform = `scale(${scale}) rotate(${rotation}deg)`; };
    viewer.querySelector('#btn-dl').onclick = () => window.open(images[currentIndex].url, '_blank');
    viewer.querySelector('#btn-grid').onclick = () => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'g'}));
    viewer.querySelector('#btn-play').onclick = () => window.dispatchEvent(new KeyboardEvent('keydown', {key: 'p'}));
    
    gridView.onclick = e => { 
        if (e.target.tagName === 'IMG') { 
            gridView.style.display='none'; 
            viewer.querySelector('#gm-img-wrap').style.display='flex'; 
            update(parseInt(e.target.dataset.idx)); 
        }
    };

    viewer.addEventListener('wheel', e => {
        if (gridView.style.display === 'grid') return;
        e.preventDefault();
        scale = Math.min(Math.max(0.3, scale + (e.deltaY > 0 ? -0.15 : 0.15)), 10);
        mainImg.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    }, { passive: false });
})();
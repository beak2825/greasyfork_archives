// ==UserScript==
// @name         查看B站缩略图原图
// @description  按住Ctrl键查看B站视频缩略图原图
// @match        https://www.bilibili.com/*
// @grant        none
// @version 0.0.1.20260127172059
// @namespace https://greasyfork.org/users/1565375
// @downloadURL https://update.greasyfork.org/scripts/564260/%E6%9F%A5%E7%9C%8BB%E7%AB%99%E7%BC%A9%E7%95%A5%E5%9B%BE%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/564260/%E6%9F%A5%E7%9C%8BB%E7%AB%99%E7%BC%A9%E7%95%A5%E5%9B%BE%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ctrlPressed = false, previewEl = null, currentUrl = null, timer = null, lastEl = null, mouseInPreview = false;

    function setCursor() {
        document.body.style.cursor = ctrlPressed ? 'crosshair' : '';
    }

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Control' || e.keyCode === 17) && !ctrlPressed) {
            ctrlPressed = true;
            setCursor();
        }
    });

    document.addEventListener('keyup', (e) => {
        if ((e.key === 'Control' || e.keyCode === 17) && ctrlPressed) {
            ctrlPressed = false;
            setCursor();
            hidePreview();
        }
    });

    window.addEventListener('blur', () => {
        if (ctrlPressed) {
            ctrlPressed = false;
            setCursor();
            hidePreview();
        }
    });

function createPreviewEl() {
        if (previewEl) return;
        
        previewEl = document.createElement('div');
        previewEl.style.cssText = `
            position:fixed;top:20px;right:20px;max-width:80vw;max-height:80vh;
            z-index:10000;background:white;border:2px solid #00a1d6;
            border-radius:8px;padding:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);
            display:none;opacity:0;transition:opacity .2s ease-in-out;
        `;
        
        previewEl.addEventListener('mouseenter', () => { mouseInPreview = true; });
        previewEl.addEventListener('mouseleave', () => {
            mouseInPreview = false;
            setTimeout(() => { if (!mouseInPreview && !lastEl) hidePreview(); }, 100);
        });
        
        previewEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const img = previewEl.querySelector('img');
            if (img?.src) {
                navigator.clipboard.writeText(img.src).then(() => {
                    const toast = document.createElement('div');
                    toast.textContent = '原图URL已复制到剪贴板';
                    toast.style.cssText = `
                        position:fixed;top:50px;right:20px;background:#00a1d6;color:white;
                        padding:10px 15px;border-radius:4px;z-index:10001;font-size:14px;
                    `;
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2000);
                });
            }
        });
        
        document.body.appendChild(previewEl);
    }

function showPreview(url, el) {
        if (!ctrlPressed) return;
        if (currentUrl === url && previewEl.style.display === 'block') return;

        createPreviewEl();
        currentUrl = url;
        lastEl = el;
        mouseInPreview = false;
        
        const originalUrl = getOriginalUrl(url);
        previewEl.style.display = 'block';
        previewEl.style.opacity = '0';
        
        const img = new Image();
        img.style.cssText = 'max-width:100%;max-height:70vh;border-radius:4px;display:block;cursor:pointer;';
        img.draggable = true;
        
        img.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/uri-list', originalUrl);
            e.dataTransfer.setData('text/plain', originalUrl);
        });
        
        img.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) window.open(originalUrl, '_blank');
        });
        
        img.onload = () => {
            previewEl.innerHTML = `<div style="margin-bottom:8px;font-size:12px;color:#666;text-align:center;">🖱️ 右键复制 • 拖拽 • Ctrl+点击</div>`;
            previewEl.appendChild(img);
            setTimeout(() => { if (previewEl && currentUrl === url) previewEl.style.opacity = '1'; }, 50);
        };
        
        img.onerror = () => {
            previewEl.innerHTML = `
                <div style="padding:20px;color:#666;text-align:center;">
                    <div style="font-size:16px;margin-bottom:10px;">❌ 图片加载失败</div>
                    <details style="text-align:left;margin-top:10px;">
                        <summary style="cursor:pointer;color:#00a1d6;">查看URL详情</summary>
                        <div style="margin-top:8px;font-size:12px;word-break:break-all;">
                            <strong>原图:</strong><br>${originalUrl}
                        </div>
                    </details>
                </div>
            `;
            setTimeout(() => { if (previewEl && currentUrl === url) previewEl.style.opacity = '1'; }, 50);
        };
        
        img.src = originalUrl;
    }

    function hidePreview() {
        if (previewEl) {
            previewEl.style.opacity = '0';
            setTimeout(() => { if (previewEl) { previewEl.style.display = 'none'; previewEl.innerHTML = ''; } }, 200);
        }
        currentUrl = null;
        lastEl = null;
        mouseInPreview = false;
        if (timer) { clearTimeout(timer); timer = null; }
    }

    function getOriginalUrl(url) {
        if (!url) return '';
        let original = url;
        original = original.replace(/@\d+w_\d+h_1c_!web-[\w-]+-cover\.\w+/g, '');
        original = original.replace(/@\d+w_\d+h_1c_!web-[\w-]+-cover/g, '');
        original = original.replace(/!web-[\w-]+-cover/g, '');
        original = original.replace(/@\d+w_\d+h_1c/g, '');
        original = original.replace(/@\d+w_\d+h/g, '');
        original = original.replace(/_1c/g, '');
        original = original.split('?')[0];
        return original.startsWith('//') ? 'https:' + original : original;
    }

    function findImageEl(el) {
        if (el.tagName === 'IMG') return el;
        
        let current = el;
        while (current && current !== document.body) {
            const img = current.querySelector?.('img');
            if (img) return img;
            
            const picture = current.querySelector?.('picture');
            if (picture) {
                const avif = picture.querySelector('source[type="image/avif"]');
                if (avif?.srcset) return { src: avif.srcset.split(' ')[0] };
                const webp = picture.querySelector('source[type="image/webp"]');
                if (webp?.srcset) return { src: webp.srcset.split(' ')[0] };
                const source = picture.querySelector('source');
                if (source?.srcset) return { src: source.srcset.split(' ')[0] };
            }
            
            for (let child of current.children || []) {
                if (child.tagName === 'IMG') return child;
                const childImg = child.querySelector?.('img');
                if (childImg) return childImg;
            }
            
            current = current.parentElement;
        }
        return null;
    }

    function handleMouseOver(e) {
        if (!ctrlPressed) return;
        const img = findImageEl(e.target);
        if (!img) return;
        const url = img.src || img.srcset;
        if (!url || (!url.includes('hdslb.com') && !url.includes('bilibili.com'))) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => showPreview(url, e.target), 30);
    }

    function handleMouseOut(e) {
        if (previewEl?.contains(e.relatedTarget)) return;
        if (lastEl && !lastEl.contains(e.relatedTarget)) {
            lastEl = null;
            setTimeout(() => { if (!mouseInPreview && !lastEl) hidePreview(); }, 150);
        }
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createPreviewEl);
    } else {
        createPreviewEl();
    }

    new MutationObserver(() => setTimeout(createPreviewEl, 50))
        .observe(document.body, { childList: true, subtree: true });

})();
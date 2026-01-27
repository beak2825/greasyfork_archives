// ==UserScript==
// @name         X(Twitter)图片采集花瓣
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  V15: 将采集按钮移动到图片左下角。保留所有采集与来源填写功能。
// @author       Gemini
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://huaban.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/564063/X%28Twitter%29%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E8%8A%B1%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/564063/X%28Twitter%29%E5%9B%BE%E7%89%87%E9%87%87%E9%9B%86%E8%8A%B1%E7%93%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================
    // ★★★ 个人配置 (不变) ★★★
    // =================================================
    const TARGET_URL = 'https://huaban.com/'; 
    const TAB_NAME = 'Huaban_Collector_Tab';
    // =================================================

    const currentHost = window.location.hostname;

    // -------------------------------------------------
    // 场景一：在 X (Twitter) 上运行
    // -------------------------------------------------
    if (currentHost.includes('twitter.com') || currentHost.includes('x.com')) {
        
        const style = document.createElement('style');
        style.innerHTML = `
            .huaban-v15-btn {
                position: absolute; 
                bottom: 12px; 
                left: 12px; /* ★★★ 修改点：改为左侧 ★★★ */
                z-index: 9999;
                background-color: #c81623; color: white; border: none;
                padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: bold;
                cursor: pointer; font-family: sans-serif; 
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .huaban-v15-btn:hover { background-color: #b0131e; transform: scale(1.05); transition: 0.2s; }
            
            div[data-testid="tweetPhoto"] .huaban-v15-btn, 
            div[aria-label="Image"] .huaban-v15-btn { display: none; }
            div[data-testid="tweetPhoto"]:hover .huaban-v15-btn, 
            div[aria-label="Image"]:hover .huaban-v15-btn { display: block; }
            
            div[data-testid="visual-media-common-container"] .huaban-v15-btn,
            div[aria-label="4 images"], div[aria-label="3 images"], div[aria-label="2 images"] {
                 position: relative !important;
            }
            
            /* 批量按钮样式 */
            .huaban-batch-btn { 
                background-color: #38a1f3; 
                left: 90px; /* ★★★ 修改点：批量按钮在单张按钮的右侧 ★★★ */
            }
            .huaban-batch-btn:hover { background-color: #2b7ac9; }

            .huaban-ready { background-color: #17bf63 !important; animation: pulse 1s infinite; }
            @keyframes pulse { 0% {transform: scale(1);} 50% {transform: scale(1.05);} 100% {transform: scale(1);} }
        `;
        document.head.appendChild(style);

        // --- 批量 URL 复制 ---
        function copyUrlsToClipboard(urls, btn) {
            const urlsText = urls.join('\n');
            navigator.clipboard.writeText(urlsText).then(() => {
                btn.innerText = `✅ ${urls.length} 个链接已复制`;
                setTimeout(() => { btn.innerText = '批量采集 URL'; }, 3000);
            }).catch(err => { alert('无法写入剪贴板。'); });
        }

        function extractBatchUrls(tweetContainer) {
            const urls = [];
            const images = tweetContainer.querySelectorAll('img[src*="format="]');
            images.forEach(img => {
                let url = img.src;
                url = url.includes('name=') ? url.replace(/name=[a-z0-9]+/, 'name=orig') : url;
                if (!urls.includes(url)) urls.push(url);
            });
            return urls;
        }

        function handleBatchCollect(e) {
            e.stopPropagation(); e.preventDefault();
            const btn = e.currentTarget;
            const tweetContainer = btn.closest('article');
            if (!tweetContainer) { alert('未找到推文容器'); return; }
            
            const urls = extractBatchUrls(tweetContainer);
            if (urls.length === 0) return;

            copyUrlsToClipboard(urls, btn);
            setTimeout(() => {
                window.open(TARGET_URL, TAB_NAME);
                alert(`已复制 ${urls.length} 个链接。\n\n⚠️ 注意：批量采集模式【无法】自动填写来源地址。\n请在花瓣使用“添加 URL 采集”功能。`);
            }, 500);
        }
        // -------------------------------

        function convertToPng(blob) {
            return new Promise((resolve) => {
                const img = new Image();
                const url = URL.createObjectURL(blob);
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width; canvas.height = img.height;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    canvas.toBlob(b => resolve(b), 'image/png');
                };
                img.src = url;
            });
        }

        function processImage(imgUrl, btn) {
            btn.innerText = '⏳ 处理中...';
            btn.disabled = true;
            btn.style.backgroundColor = '#666';

            // 获取来源链接
            let sourceUrl = window.location.href;
            const article = btn.closest('article');
            if (article) {
                const timeLink = article.querySelector('time')?.closest('a');
                if (timeLink) sourceUrl = timeLink.href;
            }
            GM_setValue('huaban_x_source', sourceUrl);

            let bestUrl = imgUrl.includes('format=') ? imgUrl.replace(/name=[a-z0-9]+/, 'name=orig') : imgUrl;

            GM_xmlhttpRequest({
                method: "GET", url: bestUrl, responseType: "blob",
                onload: async function(response) {
                    if (response.status === 200) {
                        const pngBlob = await convertToPng(response.response);
                        btn.dataset.blobReady = "true";
                        btn.blobData = pngBlob;
                        btn.disabled = false;
                        btn.innerText = '👉 点我复制';
                        btn.className += ' huaban-ready';
                        btn.onclick = (e) => {
                            e.stopPropagation(); e.preventDefault();
                            writeToClipboard(btn);
                        };
                    }
                }
            });
        }

        function writeToClipboard(btn) {
            const blob = btn.blobData;
            try {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    btn.innerText = '✅ 跳转中...';
                    window.open(TARGET_URL, TAB_NAME);
                    setTimeout(() => {
                        btn.innerText = '采集'; btn.className = 'huaban-v15-btn'; btn.style.backgroundColor = '#c81623';
                        btn.onclick = (e) => { e.stopPropagation(); processImage(btn.dataset.origSrc, btn); };
                    }, 3000);
                });
            } catch (err) { alert('权限不足'); }
        }

        function addButtons() {
            const containers = document.querySelectorAll(
                'div[data-testid="tweetPhoto"], div[aria-label="Image"], div[data-testid="visual-media-common-container"]'
            );
            const batchContainers = document.querySelectorAll(
                'div[aria-label="2 images"], div[aria-label="3 images"], div[aria-label="4 images"]'
            );
            const dialog = document.querySelector('div[role="dialog"]');
            const newContainers = [];
            if (dialog) {
                 const fullScreenImageContainers = dialog.querySelectorAll('div:has(> img[src*="format="])');
                 fullScreenImageContainers.forEach(container => {
                    if (!container.querySelector('.huaban-v15-btn')) newContainers.push(container);
                 });
            }
            const uniqueContainers = Array.from(new Set([...containers, ...newContainers]));

            uniqueContainers.forEach(div => {
                if (div.querySelector('.huaban-v15-btn')) return;
                const img = div.querySelector('img');
                if (!img || !img.src || !img.src.includes('format=')) return; 
                const btn = document.createElement('button');
                btn.className = 'huaban-v15-btn'; btn.innerText = '采集';
                btn.dataset.origSrc = img.src;
                btn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); processImage(img.src, btn); };
                if (getComputedStyle(div).position === 'static') div.style.position = 'relative';
                div.appendChild(btn);
            });
            
            batchContainers.forEach(div => {
                if (div.querySelector('.huaban-batch-btn')) return;
                const existingSingleBtn = div.querySelector('.huaban-v15-btn');
                const btn = document.createElement('button');
                btn.className = 'huaban-v15-btn huaban-batch-btn';
                btn.innerText = '批量采集 URL';
                btn.onclick = handleBatchCollect;
                if (existingSingleBtn) existingSingleBtn.insertAdjacentElement('afterend', btn); // 放在后面
                else {
                    div.appendChild(btn);
                    if (getComputedStyle(div).position === 'static') div.style.position = 'relative';
                }
            });
        }
        setInterval(addButtons, 1500);
    }

    // -------------------------------------------------
    // 场景二：在 花瓣网 (Huaban) 上运行
    // -------------------------------------------------
    if (currentHost.includes('huaban.com')) {
        
        function triggerPasteEvent() {
            if (document.querySelector('[data-type="upload"]')) return;
            const pasteEvent = new KeyboardEvent('keydown', {
                key: 'v', code: 'KeyV', keyCode: 86, ctrlKey: true, bubbles: true, cancelable: true
            });
            setTimeout(() => { document.dispatchEvent(pasteEvent); }, 1500); 
        }
        triggerPasteEvent();

        const toastStyle = document.createElement('style');
        toastStyle.innerHTML = `
            .huaban-source-toast {
                position: fixed; bottom: 20px; right: 20px;
                background: #fff; border-left: 5px solid #17bf63;
                padding: 15px 20px; border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-size: 14px; color: #333; z-index: 999999;
                display: flex; align-items: center; gap: 10px;
                animation: slideIn 0.3s ease-out;
            }
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(toastStyle);

        function showToast(url) {
            const toast = document.createElement('div');
            toast.className = 'huaban-source-toast';
            toast.innerHTML = `<span>✅ 来源已自动填写</span><span style="color:#999;font-size:12px;">(点击单张采集时生效)</span>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
        }

        const observer = new MutationObserver((mutations) => {
            const textarea = document.querySelector('textarea');
            if (textarea && !textarea.dataset.sourceFilled) {
                const sourceUrl = GM_getValue('huaban_x_source');
                
                if (sourceUrl) {
                    const textToFill = `来源: ${sourceUrl}`;
                    textarea.focus();
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                    nativeInputValueSetter.call(textarea, textToFill);
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    textarea.dataset.sourceFilled = "true";
                    textarea.style.backgroundColor = "#f0fff4"; 
                    textarea.style.border = "1px solid #17bf63";
                    
                    console.log('Gemini Script: 来源填写成功 ->', sourceUrl);
                    showToast(sourceUrl);
                    GM_deleteValue('huaban_x_source');
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
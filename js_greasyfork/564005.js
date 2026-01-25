// ==UserScript==
// @name         小红书图片一键下载 (Xiaohongshu Image Downloader)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键下载小红书帖子中的所有图片（无水印），支持详情页和轮播图检测，自动注入下载按钮。
// @author       Antigravity
// @license      MIT
// @match        https://www.xiaohongshu.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      xiaohongshu.com
// @connect      xhscdn.com
// @connect      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564005/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20%28Xiaohongshu%20Image%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564005/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20%28Xiaohongshu%20Image%20Downloader%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log('XHS Downloader: Script started');
    // 配置
    const CONFIG = {
        btnText: '下载全部图片',
        btnId: 'xhs-download-btn-v2',
        btnStyle: `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 2147483647; /* Max Z-Index */
            background-color: #ff2442;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            transition: all 0.3s;
            pointer-events: auto;
        `
    };
    let downloadBtn = null;
    // 初始化
    function init() {
        console.log('XHS Downloader: Initializing...');
        // 1. 立即尝试检查
        checkAndInject();
        // 2. 也是用 MutationObserver 监听 URL 变化和 DOM 变化
        const observer = new MutationObserver(() => {
            checkAndInject();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        // 3. 兜底策略：每秒检查一次，防止 MutationObserver 失效或遗漏
        setInterval(checkAndInject, 1500);
    }
    // 核心检查逻辑
    function checkAndInject() {
        // 只要当前页面 URL 包含 explore 或 discovery，或者页面上有典型的笔记容器，就尝试显示按钮
        // 有些时候是弹窗，URL 可能会变，也可能不会变，所以主要看 URL
        const isPostPage = /xiaohongshu\.com\/(explore|discovery\/item)\//.test(window.location.href);
        // 另外一种判断方法：页面是否有大图轮播结构
        const hasSlides = document.querySelector('.swiper-slide') || document.querySelector('.note-slider-img');
        if (isPostPage || hasSlides) {
            if (!document.getElementById(CONFIG.btnId)) {
                console.log('XHS Downloader: Detected post page, injecting button...');
                addDownloadButton();
            }
        } else {
            // 如果既不是详情页URL，也不包含轮播图，则移除按钮（可选，或者隐藏）
            // 考虑到是单页应用，最好是隐藏而不是移除，或者保持移除逻辑
            // removeDownloadButton(); 
            // 暂时不移除，宁可多显示也不要不显示，除非明确不在详情页
        }
    }
    // 添加下载按钮
    function addDownloadButton() {
        if (document.getElementById(CONFIG.btnId)) return;
        downloadBtn = document.createElement('div');
        downloadBtn.id = CONFIG.btnId;
        downloadBtn.innerText = CONFIG.btnText;
        downloadBtn.style.cssText = CONFIG.btnStyle;
        // Hover 效果
        downloadBtn.onmouseenter = () => {
            downloadBtn.style.backgroundColor = '#e61d37';
            downloadBtn.style.transform = 'scale(1.05)';
        };
        downloadBtn.onmouseleave = () => {
            downloadBtn.style.backgroundColor = '#ff2442';
            downloadBtn.style.transform = 'scale(1)';
        };
        downloadBtn.onclick = extractAndDownload;
        document.body.appendChild(downloadBtn);
        console.log('XHS Downloader: Button added to body');
    }
    // 移除下载按钮
    function removeDownloadButton() {
        const btn = document.getElementById(CONFIG.btnId);
        if (btn) {
            btn.remove();
            console.log('XHS Downloader: Button removed');
        }
    }
    // 提取并下载核心逻辑
    async function extractAndDownload() {
        console.log('XHS Downloader: Clicked download');
        const btn = document.getElementById(CONFIG.btnId);
        const originalText = btn.innerText;
        btn.innerText = '正在分析...';
        btn.style.cursor = 'wait';
        try {
            // 给一点时间让可能存在的 lazy load 图片加载（如果需要滚动的）
            // 这里仅仅是查找
            const imageUrls = await findImages();
            console.log('XHS Downloader: Found images', imageUrls);
            if (imageUrls.length === 0) {
                alert('未找到图片。请确保您在帖子详情页，且图片已加载。');
                resetBtn(btn, originalText);
                return;
            }
            if (!confirm(`找到 ${imageUrls.length} 张图片，确认下载吗？`)) {
                resetBtn(btn, originalText);
                return;
            }
            btn.innerText = `准备下载...`;
            let successCount = 0;
            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                // 文件名: 时间戳_索引.jpg
                const filename = `xhs_${Date.now()}_${i + 1}.jpg`;
                btn.innerText = `下载中 ${i + 1}/${imageUrls.length}`;
                try {
                    await downloadImage(url, filename);
                    successCount++;
                } catch (e) {
                    console.error('Download failed:', url, e);
                }
                await new Promise(r => setTimeout(r, 300)); // 避免并发过高
            }
            btn.innerText = '完成！';
            setTimeout(() => resetBtn(btn, originalText), 2000);
        } catch (error) {
            console.error('Error in extractAndDownload:', error);
            alert('发生错误: ' + error.message);
            resetBtn(btn, originalText);
        }
    }
    function resetBtn(btn, text) {
        if (btn) {
            btn.innerText = text;
            btn.style.cursor = 'pointer';
        }
    }
    // 查找图片逻辑
    async function findImages() {
        const images = new Set();
        // 扩大搜索范围
        // 1. 尝试查找所有通常包含大图的容器
        // .swiper-wrapper 是轮播图容器
        // .note-content 是正文区域（有时有插图）
        // 专门针对详情页大图的 selector
        const candidates = [
            ...document.querySelectorAll('.swiper-slide'), // 轮播图卡片
            ...document.querySelectorAll('.note-slider-img'), // 可能的类名
            ...document.querySelectorAll('.media-container img'),
            ...document.querySelectorAll('.img-container img'), // 搜索结果里的图
            ...document.querySelectorAll('img.note-image') // 正文图
        ];
        candidates.forEach(el => {
            // 1. bg image
            const bg = el.style.backgroundImage;
            if (bg && bg.includes('url(')) {
                let url = bg.match(/url\(['"]?(.*?)['"]?\)/)[1];
                if (url) images.add(cleanUrl(url));
            }
            // 2. img tag
            if (el.tagName === 'IMG' && el.src) {
                // 有些img src是 base64 或者很小的缩略图，过滤掉
                if (el.src.startsWith('http') && !el.src.includes('avatar')) {
                    images.add(cleanUrl(el.src));
                }
            }
            // 3. 子元素 img
            const innerImgs = el.querySelectorAll('img');
            innerImgs.forEach(img => {
                if (img.src && img.src.startsWith('http') && !img.src.includes('avatar')) {
                    images.add(cleanUrl(img.src));
                }
            });
        });
        // 如果上面没找到，尝试在整个 document 找有可能的大图
        // 过滤规则：必须是 xhscdn 或 xiaohongshu.com 域名，且不能是头像
        if (images.size === 0) {
            console.log('XHS Downloader: No images found in specific containers, scanning all images...');
            const allImgs = document.querySelectorAll('img');
            allImgs.forEach(img => {
                const src = img.src;
                if (src && (src.includes('xhscdn') || src.includes('xiaohongshu')) && !src.includes('avatar') && !src.includes('profile')) {
                    // 简单的尺寸过滤，防止下载图标
                    if (img.naturalWidth > 200 || img.width > 200) {
                        images.add(cleanUrl(src));
                    }
                }
            });
        }
        return Array.from(images);
    }
    // 清理和优化 URL
    function cleanUrl(url) {
        if (url.startsWith('//')) {
            url = 'https:' + url;
        }
        // 尝试获取原图
        // 常见模式：http://sns-webpic-qc.xhscdn.com/2024/..../....?imageView2/2/w/1920/format/webp
        // 去掉 ? 后面的参数即可获取原图 (通常是 webp 或 heic，浏览器能下载)
        // 但为了保险，我们只在它是 webp 格式请求时尝试去掉，或者保留原样。
        // 测试发现去掉参数通常能拿到原图。
        try {
            const urlObj = new URL(url);
            // 只要是 xhscdn 的图片，去掉 search 参数试试
            if (urlObj.hostname.includes('xhscdn')) {
                return urlObj.origin + urlObj.pathname;
            }
        } catch (e) {
            // ignore
        }
        return url;
    }
    // 下载单张图片
    function downloadImage(url, name) {
        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: name,
                saveAs: false,
                onload: () => resolve(),
                onerror: (err) => {
                    // 如果 GM_download 失败（跨域或不支持），尝试降级方案
                    console.log('GM_download failed, trying fetch blob...', err);
                    fetch(url)
                        .then(resp => resp.blob())
                        .then(blob => {
                            const a = document.createElement('a');
                            const objectUrl = URL.createObjectURL(blob);
                            a.href = objectUrl;
                            a.download = name;
                            a.click();
                            URL.revokeObjectURL(objectUrl);
                            resolve();
                        })
                        .catch(fetchErr => reject(fetchErr));
                },
                ontimeout: () => reject('Timeout')
            });
        });
    }
    // 启动
    init();
})();
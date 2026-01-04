// ==UserScript==
// @name         Pixiv Batch Downloader Ultimate
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  批量下载Pixiv作品图片，自动重命名（终极版）
// @author       YoTESPRIS
// @match        https://www.pixiv.net/artworks/*
// @match        https://www.pixiv.net/*/artworks/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557639/Pixiv%20Batch%20Downloader%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/557639/Pixiv%20Batch%20Downloader%20Ultimate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #pixiv-downloader-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(45deg, #0096fa, #0066cc);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px 18px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,150,250,0.3);
            transition: all 0.3s ease;
        }
        #pixiv-downloader-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,150,250,0.4);
        }
        #pixiv-downloader-btn:active {
            transform: translateY(0);
        }
        #pixiv-downloader-btn.loading {
            background: #cccccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #pixiv-downloader-progress {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 13px;
            display: none;
            max-width: 320px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .pixiv-downloader-file-info {
            font-size: 12px;
            color: #aaa;
            margin-top: 5px;
            word-break: break-all;
        }
        .pixiv-downloader-success-text {
            color: #4caf50;
        }
        .pixiv-downloader-error-text {
            color: #f44336;
        }
        .pixiv-downloader-warning-text {
            color: #ff9800;
        }
    `);

    // 创建下载按钮
    function createDownloadButton() {
        // 移除可能存在的旧按钮
        const oldBtn = document.getElementById('pixiv-downloader-btn');
        if (oldBtn) oldBtn.remove();

        const oldProgress = document.getElementById('pixiv-downloader-progress');
        if (oldProgress) oldProgress.remove();

        // 创建新按钮
        const btn = document.createElement('button');
        btn.id = 'pixiv-downloader-btn';
        btn.innerHTML = '⚡ 一键下载';
        btn.addEventListener('click', downloadImages);
        document.body.appendChild(btn);

        const progress = document.createElement('div');
        progress.id = 'pixiv-downloader-progress';
        document.body.appendChild(progress);
    }

    // 获取作品信息
    async function getArtworkInfo() {
        const artworkId = window.location.pathname.split('/').pop();

        // 获取标题
        let title = `pixiv_${artworkId}`;
        const titleSelectors = ['h1', '[data-gtm-value]', 'meta[property="og:title"]'];

        for (let selector of titleSelectors) {
            if (selector.startsWith('meta')) {
                const element = document.querySelector(selector);
                if (element) {
                    title = element.getAttribute('content') || title;
                    break;
                }
            } else {
                const element = document.querySelector(selector);
                if (element) {
                    title = element.textContent.trim() || title;
                    break;
                }
            }
        }

        // 清理文件名
        title = title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();
        if (!title) title = `pixiv_${artworkId}`;

        // 获取图片URLs
        let imageUrls = [];

        try {
            // 方法1: 从预加载数据获取
            const preloadData = document.getElementById('meta-preload-data');
            if (preloadData) {
                const content = preloadData.getAttribute('content');
                if (content) {
                    const data = JSON.parse(content);
                    const illustData = data.illust?.[artworkId];
                    if (illustData) {
                        const urls = illustData.urls;
                        if (urls) {
                            if (urls.original) {
                                // 单图
                                imageUrls.push(urls.original);
                            } else {
                                // 多图
                                Object.keys(urls).forEach(key => {
                                    if (urls[key]?.original) {
                                        imageUrls.push(urls[key].original);
                                    } else if (typeof urls[key] === 'string' && urls[key].includes('img-original')) {
                                        imageUrls.push(urls[key]);
                                    }
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log('预加载数据解析失败:', e);
        }

        // 方法2: 从页面JSON数据获取
        if (imageUrls.length === 0) {
            try {
                const scripts = document.querySelectorAll('script:not([src])');
                for (let script of scripts) {
                    const text = script.textContent;
                    if (text && text.includes('illust')) {
                        // 尝试提取JSON
                        const jsonMatch = text.match(/[^\"]*\"illust\"\s*:\s*(\{[^}]+\})/);
                        if (jsonMatch && jsonMatch[1]) {
                            try {
                                const jsonData = JSON.parse(`{${jsonMatch[1]}}`);
                                const illustData = jsonData[artworkId];
                                if (illustData?.urls?.original) {
                                    imageUrls.push(illustData.urls.original);
                                }
                                break;
                            } catch (e) {
                                continue;
                            }
                        }
                    }
                }
            } catch (e) {
                console.log('JSON数据解析失败:', e);
            }
        }

        // 方法3: 从图片元素获取
        if (imageUrls.length === 0) {
            const imgElements = document.querySelectorAll('img[src*="img-original"]');
            imgElements.forEach(img => {
                let url = img.src;
                // 清理URL
                url = url.replace(/\/c\/\d+x\d+.*?\//, '/');
                url = url.replace(/\?.*$/, '');
                if (url.includes('img-original')) {
                    imageUrls.push(url);
                }
            });
        }

        // 方法4: 从meta标签获取
        if (imageUrls.length === 0) {
            const metaTags = document.querySelectorAll('meta[property="og:image"]');
            metaTags.forEach(tag => {
                let url = tag.content;
                if (url && url.includes('img-original')) {
                    url = url.replace(/\/c\/\d+x\d+.*?\//, '/');
                    url = url.replace(/\?.*$/, '');
                    imageUrls.push(url);
                }
            });
        }

        // 去重和验证
        imageUrls = [...new Set(imageUrls)].filter(url =>
            url && typeof url === 'string' && (url.includes('img-original') || url.includes('i.pximg.net'))
        );

        console.log('最终获取到的图片URLs:', imageUrls);
        return { title, imageUrls, artworkId };
    }

    // 获取文件扩展名
    function getFileExtension(url) {
        const match = url.match(/\.(\w+)(?:\?|#|$)/);
        return match ? match[1].toLowerCase() : 'jpg';
    }

    // 使用GM_xmlhttpRequest下载并保存文件
    function downloadImageAsBlob(url, filename) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'Referer': 'https://www.pixiv.net/',
                    'User-Agent': navigator.userAgent
                },
                onload: function(response) {
                    try {
                        const blob = response.response;
                        const blobUrl = URL.createObjectURL(blob);

                        // 创建下载链接
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        // 清理
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

                        console.log(`✅ 下载成功: ${filename}`);
                        resolve(true);
                    } catch (e) {
                        console.error(`❌ Blob下载失败: ${filename}`, e);
                        reject(false);
                    }
                },
                onerror: function(error) {
                    console.error(`❌ 请求失败: ${filename}`, error);
                    reject(false);
                }
            });
        });
    }

    // 备用下载方法
    function fallbackDownload(url, filename) {
        return new Promise((resolve, reject) => {
            try {
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => resolve(true), 500);
            } catch (e) {
                console.error('备用下载方法失败:', e);
                reject(false);
            }
        });
    }

    // 下载图片主函数
    async function downloadImages() {
        const btn = document.getElementById('pixiv-downloader-btn');
        const progress = document.getElementById('pixiv-downloader-progress');

        if (btn.classList.contains('loading')) return;

        btn.classList.add('loading');
        btn.innerHTML = '🔍 分析中...';
        progress.style.display = 'block';
        progress.innerHTML = '正在分析作品信息...';

        try {
            console.log('开始获取作品信息...');
            const { title, imageUrls, artworkId } = await getArtworkInfo();

            console.log('作品信息获取完成:', { title, imageUrls, artworkId });

            if (imageUrls.length === 0) {
                progress.innerHTML = `<span class="pixiv-downloader-error-text">❌ 未找到可下载的图片</span><br><small>请确保已登录Pixiv并刷新页面</small>`;
                setTimeout(() => {
                    progress.style.display = 'none';
                    btn.classList.remove('loading');
                    btn.innerHTML = '⚡ 一键下载';
                }, 4000);
                return;
            }

            progress.innerHTML = `找到 <b>${imageUrls.length}</b> 张图片<br>开始下载...`;

            let successCount = 0;
            let failCount = 0;

            // 逐个下载图片
            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                const fileExtension = getFileExtension(url);
                const filename = imageUrls.length === 1
                    ? `${title}.${fileExtension}`
                    : `${title}-${i + 1}.${fileExtension}`;

                progress.innerHTML = `
                    正在下载 (<b>${i + 1}/${imageUrls.length}</b>)<br>
                    <div class="pixiv-downloader-file-info">${filename}</div>
                `;

                btn.innerHTML = `📥 ${(i + 1)}/${imageUrls.length}`;

                try {
                    console.log(`开始下载第${i + 1}张图片:`, { url, filename });
                    await downloadImageAsBlob(url, filename);
                    successCount++;
                    console.log(`第${i + 1}张图片下载成功`);
                } catch (e) {
                    console.error(`第${i + 1}张图片下载失败，尝试备用方法:`, e);
                    try {
                        await fallbackDownload(url, filename);
                        successCount++;
                        console.log(`第${i + 1}张图片备用方法成功`);
                    } catch (e2) {
                        console.error(`第${i + 1}张图片彻底失败:`, e2);
                        failCount++;
                    }
                }

                // 添加延迟避免请求过快
                if (i < imageUrls.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // 显示最终结果
            if (failCount === 0) {
                progress.innerHTML = `<span class="pixiv-downloader-success-text">✅ 下载完成！</span><br><div class="pixiv-downloader-file-info">${successCount} 张图片已保存至下载目录</div>`;
            } else if (successCount > 0) {
                progress.innerHTML = `<span class="pixiv-downloader-warning-text">⚠️ 下载完成</span><br><div class="pixiv-downloader-file-info">成功: ${successCount} 张 | 失败: ${failCount} 张</div>`;
            } else {
                progress.innerHTML = `<span class="pixiv-downloader-error-text">❌ 下载失败</span><br><div class="pixiv-downloader-file-info">所有图片下载失败，请检查网络连接</div>`;
            }

            setTimeout(() => {
                progress.style.display = 'none';
                btn.classList.remove('loading');
                btn.innerHTML = '⚡ 一键下载';
            }, 4000);

        } catch (error) {
            console.error('下载过程中出现严重错误:', error);
            progress.innerHTML = `<span class="pixiv-downloader-error-text">❌ 程序错误</span><br><small>${error.message || '未知错误'}</small>`;
            setTimeout(() => {
                progress.style.display = 'none';
                btn.classList.remove('loading');
                btn.innerHTML = '⚡ 一键下载';
            }, 4000);
        }
    }

    // 初始化函数
    function init() {
        // 确保DOM完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createDownloadButton, 1000);
            });
        } else {
            setTimeout(createDownloadButton, 1000);
        }
    }

    // 启动脚本
    init();
})();

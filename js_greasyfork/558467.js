// ==UserScript==
// @name        ExHentai Lanraragi Checker
// @namespace   https://github.com/ThreeE999
// @match       https://exhentai.org/*
// @match       https://e-hentai.org/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @version     2.01
// @author      Putarku, ThreeE
// @description Checks if galleries on ExHentai/E-Hentai are already in your Lanraragi library and marks them by inserting a span at the beginning of the title. Adds download button on gallery pages and download link for galleries not found in library. Monitors download progress and clears cache when complete. Supports multiple concurrent downloads.<br><br>检查 ExHentai/E-Hentai 上的图库是否已在您的 Lanraragi 库中，如果已存在，则在标题开头插入一个 span 标签进行标记。在图库页面添加下载按钮，并为库中未找到的图库添加下载链接。监控下载进度，并在完成后清除缓存。支持多个并发下载。
// @downloadURL https://update.greasyfork.org/scripts/558467/ExHentai%20Lanraragi%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/558467/ExHentai%20Lanraragi%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 用户配置开始 ---
    const LRR_SERVER_URL = 'http://127.0.0.1:3000'; // 替换为您的 Lanraragi 服务器地址
    const LRR_API_KEY = btoa(''); // 如果您的 Lanraragi API 需要密钥，请填写，自动转为 base64 编码
    // --- 用户配置结束 ---
    // 常量配置
    const DOWNLOAD_API_PATH = '/api/download_url'; // 下载 API 路径（相对于 LRR_SERVER_URL）
    // const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

    GM_addStyle(`
        .lrr-marker-span {
            font-weight: bold;
            border-radius: 3px;
            padding: 0px 3px;
            margin-right: 4px; /* 与 visied.js 的 ● 标记或标题文本的间距 */
            font-size: 0.9em;
        }

        .lrr-marker-downloaded {
            color: #28a745; /* 绿色 */
            background-color: #49995d;
        }

        .lrr-marker-file {
            color: #356ddc;
            background-color: #071226; /* 紫色 */
        }

        .lrr-marker-error {
            color: #dc3545; /* 红色 */
            background-color: #fbe9ea;
        }

        .lrr-download-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 8px 16px;
            background-color: #ff6b6b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }

        .lrr-download-btn:hover {
            background-color: #ee5a52;
        }

        .lrr-download-btn:active {
            transform: scale(0.98);
        }

        .lrr-download-link {
            display: inline-block;
            margin-right: 4px;
            padding: 2px 6px;
            background-color: #ff6b6b;
            color: white;
            text-decoration: none;
            border-radius: 3px;
            font-size: 0.85em;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .lrr-download-link:hover {
            background-color: #ee5a52;
        }

        .lrr-download-link:active {
            transform: scale(0.98);
        }

        .lrr-download-link.downloading {
            background-color: #ffa500;
            cursor: not-allowed;
        }

        .lrr-download-link.success {
            background-color: #28a745;
        }

        .lrr-download-link.failed {
            background-color: #dc3545;
        }
    `);

    // 下载任务管理器
    const downloadManager = {
        activeJobs: new Map() // 存储活跃的下载任务 {jobId: {url, startTime, statusCallback, finalCallback}}
    };
    // 工具函数：缓存管理
    function getCache(key) {
        const cached = localStorage.getItem(key);
        if (cached) {
            try {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    return data;
                }
            } catch (e) {
                console.error(`[LRR Checker] Error parsing cache for ${key}:`, e);
            }
        }
        return null;
    }

    function setCache(key, data) {
        try {
            const item = {
                timestamp: Date.now(),
                data: data
            };
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.error(`[LRR Checker] Error setting cache for ${key}:`, e);
        }
    }

    // 工具函数：获取 API 请求头
    function getApiHeaders(contentType = 'application/json') {
        const headers = {
            'Content-Type': contentType
        };
        if (LRR_API_KEY) {
            headers['Authorization'] = `Bearer ${LRR_API_KEY}`;
        }
        return headers;
    }

    // 工具函数：创建标记
    function createMarkerSpan(text, className) {
        const markerSpan = document.createElement('span');
        markerSpan.classList.add('lrr-marker-span', className);
        markerSpan.textContent = text;
        return markerSpan;
    }

    // 工具函数：显示错误标记
    function showErrorMarker(titleElement, galleryUrl) {
        if (!titleElement || titleElement.querySelector('.lrr-marker-error')) {
            return;
        }
        const errorSpan = createMarkerSpan('(LRR ❓)', 'lrr-marker-error');
        titleElement.prepend(errorSpan);
        
        // 在错误情况下也添加下载链接
        if (galleryUrl) {
            createDownloadLink(galleryUrl, titleElement);
        }
    }

    // 工具函数：查询下载状态
    function checkDownloadStatus(jobId, statusCallback, maxAttempts = 60) {
        let attempts = 0;
        const statusUrl = `${LRR_SERVER_URL}/api/minion/${jobId}/detail`;
        const headers = getApiHeaders();

        function pollStatus() {
            attempts++;
            GM_xmlhttpRequest({
                method: 'GET',
                url: statusUrl,
                headers: headers,
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const result = JSON.parse(response.responseText);
                            const state = result.state;
                            
                            if (state === 'finished') {
                                console.log(`[LRR Download] Job ${jobId} finished`);
                                if (statusCallback) statusCallback(true, result);
                                return;
                            } else if (state === 'failed' || state === 'revoked') {
                                console.error(`[LRR Download] Job ${jobId} failed or revoked: ${state}`);
                                if (statusCallback) statusCallback(false, result);
                                return;
                            }

                            // 继续轮询
                            if (attempts < maxAttempts) {
                                setTimeout(pollStatus, 2000); // 每2秒查询一次
                                if (statusCallback) statusCallback(null, result); // 传递中间状态
                            } else {
                                console.warn(`[LRR Download] Job ${jobId} timeout after ${maxAttempts} attempts`);
                                if (statusCallback) statusCallback(false, { error: 'Timeout' });
                            }
                        } else {
                            console.error(`[LRR Download] Status check failed with status ${response.status}`);
                            if (statusCallback) statusCallback(false, { error: `HTTP ${response.status}` });
                        }
                    } catch (e) {
                        console.error(`[LRR Download] Error parsing status response:`, e);
                        if (statusCallback) statusCallback(false, { error: e.message });
                    }
                },
                onerror: function(error) {
                    console.error(`[LRR Download] Network error checking status:`, error);
                    if (statusCallback) statusCallback(false, { error: 'Network error' });
                }
            });
        }

        // 延迟500ms后开始第一次查询
        setTimeout(pollStatus, 500);
    }

    // 工具函数：清除缓存（仅在最后一个下载完成时调用）
    function clearCache(callback) {
        const cacheUrl = `${LRR_SERVER_URL}/api/search/cache`;
        const headers = getApiHeaders();

        GM_xmlhttpRequest({
            method: 'DELETE',
            url: cacheUrl,
            headers: headers,
            onload: function(response) {
                try {
                    if (response.status >= 200 && response.status < 300) {
                        const result = JSON.parse(response.responseText);
                        console.log(`[LRR Download] Cache cleared: ${result.success === 1 ? 'success' : 'failed'}`);
                        if (callback) callback(result.success === 1, result);
                    } else {
                        console.error(`[LRR Download] Clear cache failed with status ${response.status}`);
                        if (callback) callback(false, { error: `HTTP ${response.status}` });
                    }
                } catch (e) {
                    console.error(`[LRR Download] Error parsing clear cache response:`, e);
                    if (callback) callback(false, { error: e.message });
                }
            },
            onerror: function(error) {
                console.error(`[LRR Download] Network error clearing cache:`, error);
                if (callback) callback(false, { error: 'Network error' });
            }
        });
    }

    // 工具函数：发送下载请求（支持多个同时下载）
    function sendDownloadRequest(url, statusUpdateCallback, finalCallback) {
        const downloadUrl = `${LRR_SERVER_URL}${DOWNLOAD_API_PATH}`;
        
        // 使用内建的 FormData API
        const formData = new FormData();
        formData.append('url', url);
        
        // FormData 使用时不需要手动设置 Content-Type，GM_xmlhttpRequest 会自动处理
        const headers = {};
        if (LRR_API_KEY) {
            headers['Authorization'] = `Bearer ${LRR_API_KEY}`;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            url: downloadUrl,
            headers: headers,
            data: formData,
            onload: function(response) {
                try {
                    if (response.status >= 200 && response.status < 300) {
                        const result = JSON.parse(response.responseText);
                        if (result.success === 1 && result.job) {
                            const jobId = result.job;
                            console.log(`[LRR Download] Job created: ${jobId} for ${url} (Active jobs: ${downloadManager.activeJobs.size + 1})`);
                            
                            // 记录活跃任务
                            downloadManager.activeJobs.set(jobId, {
                                url: url,
                                startTime: Date.now(),
                                statusUpdateCallback: statusUpdateCallback,
                                finalCallback: finalCallback
                            });
                            
                            // 开始查询下载状态
                            checkDownloadStatus(jobId, function(status, jobResult) {
                                if (status === null) {
                                    // 中间状态，更新UI
                                    const jobInfo = downloadManager.activeJobs.get(jobId);
                                    if (jobInfo && jobInfo.statusUpdateCallback) {
                                        jobInfo.statusUpdateCallback('downloading', jobResult);
                                    }
                                } else if (status === true) {
                                    // 下载完成
                                    const jobInfo = downloadManager.activeJobs.get(jobId);
                                    downloadManager.activeJobs.delete(jobId);
                                    
                                    const remainingJobs = downloadManager.activeJobs.size;
                                    console.log(`[LRR Download] Job ${jobId} completed (Remaining: ${remainingJobs})`);
                                    
                                    // 只有当所有下载任务都完成时，才清除缓存
                                    if (remainingJobs === 0) {
                                        console.log(`[LRR Download] All downloads completed, clearing cache...`);
                                        clearCache(function(cacheSuccess) {
                                            if (jobInfo && jobInfo.finalCallback) {
                                                jobInfo.finalCallback(true, jobResult);
                                            }
                                        });
                                    } else {
                                        // 还有其他任务在进行，不清除缓存
                                        console.log(`[LRR Download] Other downloads still in progress, skipping cache clear`);
                                        if (jobInfo && jobInfo.finalCallback) {
                                            jobInfo.finalCallback(true, jobResult);
                                        }
                                    }
                                } else {
                                    // 下载失败
                                    const jobInfo = downloadManager.activeJobs.get(jobId);
                                    downloadManager.activeJobs.delete(jobId);
                                    
                                    console.error(`[LRR Download] Job ${jobId} failed (Remaining: ${downloadManager.activeJobs.size})`);
                                    
                                    if (jobInfo && jobInfo.finalCallback) {
                                        jobInfo.finalCallback(false, jobResult);
                                    }
                                }
                            });
                        } else {
                            console.error(`[LRR Download] Failed to create job: ${result.error || 'Unknown error'}`);
                            if (finalCallback) finalCallback(false, result);
                        }
                    } else {
                        console.error(`[LRR Download] Failed with status ${response.status}: ${url}`);
                        if (finalCallback) finalCallback(false, { error: `HTTP ${response.status}` });
                    }
                } catch (e) {
                    console.error(`[LRR Download] Error handling response:`, e);
                    if (finalCallback) finalCallback(false, { error: e.message });
                }
            },
            onerror: function(error) {
                console.error(`[LRR Download] Network error:`, error);
                if (finalCallback) finalCallback(false, { error: 'Network error' });
            }
        });
    }

    // 页面检测：是否为画廊页面
    function isGalleryPage() {
        const url = window.location.href;
        return /^https:\/\/(exhentai|e-hentai)\.org\/g\/\d+\/[a-f0-9]+\/?/.test(url);
    }

    // 添加下载按钮（仅在画廊页面）
    function addDownloadButton() {
        if (!isGalleryPage()) {
            return;
        }

        // 检查是否已存在按钮
        if (document.querySelector('.lrr-download-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'lrr-download-btn';
        button.innerHTML = '下载本页';
        button.onclick = function() {
            const currentUrl = window.location.href;
            button.disabled = true;
            button.innerHTML = '发送中...';
            
            sendDownloadRequest(
                currentUrl,
                // 状态更新回调
                function(status, jobResult) {
                    if (status === 'downloading') {
                        button.innerHTML = '下载中...';
                    }
                },
                // 最终回调
                function(success, result) {
                    button.disabled = false;
                    if (success) {
                        button.innerHTML = '✓ 完成';
                    } else {
                        button.disabled = false;
                        button.innerHTML = '✗ 失败/重试';
                    }
                }
            );
        };

        document.body.appendChild(button);
    }

    // 工具函数：检查URL是否为有效的画廊链接
    function isValidGalleryUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        // 匹配格式：https://exhentai.org/g/数字/哈希/ 或 https://e-hentai.org/g/数字/哈希/
        return /^https:\/\/(exhentai|e-hentai)\.org\/g\/\d+\/[a-f0-9]+\/?/.test(url);
    }

    // 工具函数：创建下载按钮/链接
    function createDownloadLink(galleryUrl, titleElement) {
        // 检查是否已存在下载链接
        if (titleElement.querySelector('.lrr-download-link')) {
            return;
        }

        // 检查URL格式
        if (!isValidGalleryUrl(galleryUrl)) {
            return;
        }

        const downloadLink = document.createElement('a');
        downloadLink.className = 'lrr-download-link';
        downloadLink.href = '#';
        downloadLink.textContent = '下载';
        downloadLink.title = '发送到下载服务器';

        downloadLink.onclick = function(event) {
            event.preventDefault();
            event.stopPropagation();

            // 更新状态
            downloadLink.classList.add('downloading');
            downloadLink.textContent = '发送中...';
            downloadLink.style.pointerEvents = 'none';

            sendDownloadRequest(
                galleryUrl,
                // 状态更新回调
                function(status, jobResult) {
                    if (status === 'downloading') {
                        downloadLink.textContent = '下载中...';
                    }
                },
                // 最终回调
                function(success, result) {
                    if (success) {
                        downloadLink.classList.remove('downloading');
                        downloadLink.classList.add('success');
                        downloadLink.textContent = '✓ 完成';
                    } else {
                        downloadLink.style.pointerEvents = 'auto';
                        downloadLink.classList.remove('downloading');
                        downloadLink.classList.add('failed');
                        downloadLink.textContent = '✗ 重试';
                    }
                }
            );
        };

        // 插入到标题元素的最前面
        titleElement.prepend(downloadLink);
    }

    // 检查画廊链接
    function checkGalleryLinks() {
        const galleryLinks = document.querySelectorAll('.itg .gl1t a[href*="/g/"]');

        galleryLinks.forEach(linkElement => {
            const galleryUrl = linkElement.href;
            const titleElement = linkElement.querySelector('.glink');

            if (!galleryUrl || !titleElement) {
                return;
            }

            // 跳过已处理的链接（已有标记或下载链接）
            if (titleElement.querySelector('.lrr-marker-span') || titleElement.querySelector('.lrr-download-link')) {
                return;
            }

            const cacheKey = `lrr-checker-${galleryUrl}`;
            const cachedData = getCache(cacheKey);

            if (cachedData) {
                console.log(`[LRR Checker] Using cached data for: ${galleryUrl}`);
                handleResponse(cachedData, titleElement, galleryUrl);
                return;
            }

            // 发送 API 请求
            const apiUrl = `${LRR_SERVER_URL}/api/plugins/use?plugin=urlfinder&arg=${encodeURIComponent(galleryUrl)}`;
            const headers = getApiHeaders();

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: headers,
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        setCache(cacheKey, result);
                        handleResponse(result, titleElement, galleryUrl);
                    } catch (e) {
                        console.error(`[LRR Checker] Error parsing JSON for ${galleryUrl}:`, e, response.responseText);
                        showErrorMarker(titleElement, galleryUrl);
                    }
                },
                onerror: function(error) {
                    console.error(`[LRR Checker] Network error checking ${galleryUrl}:`, error);
                    showErrorMarker(titleElement, galleryUrl);
                }
            });
        });
    }

    function handleResponse(result, titleElement, galleryUrl) {
        if (result.success === 1) {
            console.log(`[LRR Checker] Found: ${galleryUrl} (ID: ${result.data.id})`);
            const markerSpan = createMarkerSpan('(LRR ✔)', 'lrr-marker-downloaded');
            titleElement.prepend(markerSpan);
        } else {
            console.log(`[LRR Checker] Not found or error: ${galleryUrl} - ${result.error}`);
            
            // 在未找到LRR的条目标记前添加下载按钮
            createDownloadLink(galleryUrl, titleElement);
            
            const fullTitle = titleElement.textContent.trim();
            const authorRegex = /\[((?!汉化|漢化|DL版|中国翻訳)[^\]]+)\]/;
            const authorMatch = fullTitle.match(authorRegex);
            const author = authorMatch ? authorMatch[1] : null;
            if (!author) {
                console.log(`[LRR Checker] Skipping due to missing ${fullTitle}`);
                return;
            }

            const titleRegex = /\]([^\[\]\(\)]+)/;
            const titleMatch = fullTitle.match(titleRegex);
            const title = titleMatch ? titleMatch[1] : null;

            if (author === title || title === null) {
                console.log(`[LRR Checker] Skipping due to missing ${fullTitle}`);
                return;
            }

            const searchQuery = `${author},${title}`;
            console.log(`[LRR Checker] Trying alternative search with: ${searchQuery}`);

            const randomSearchUrl = `${LRR_SERVER_URL}/api/search/random?filter=${encodeURIComponent(searchQuery)}`;
            const headers = getApiHeaders();

            GM_xmlhttpRequest({
                method: 'GET',
                url: randomSearchUrl,
                headers: headers,
                onload: function(randomResponse) {
                    try {
                        const randomResult = JSON.parse(randomResponse.responseText);
                        if (randomResult && randomResult.data && randomResult.data.length > 0) {
                            console.log(`[LRR Checker] Found via alternative search: ${searchQuery}`);
                            const altMarkerSpan = createMarkerSpan('(LRR！)', 'lrr-marker-file');
                            titleElement.prepend(altMarkerSpan);
                        } else {
                            console.log(`[LRR Checker] Not found via alternative search: ${searchQuery}`);
                        }
                    } catch (e) {
                        console.error(`[LRR Checker] Error parsing JSON for alternative search:`, e, randomResponse.responseText);
                    }
                },
                onerror: function(error) {
                    console.error(`[LRR Checker] Network error during alternative search:`, error);
                }
            });
        }
    }

    // 初始化函数
    function init() {
        // 根据页面类型初始化不同功能
        if (isGalleryPage()) {
            // 画廊页面：添加下载按钮
            addDownloadButton();
        } else {
            // 非画廊页面：检查画廊链接
            checkGalleryLinks();
            
            // 监听页面变化（用于动态加载的内容），使用防抖优化性能
            let checkTimeout = null;
            const observer = new MutationObserver(function(mutations) {
                if (checkTimeout) {
                    clearTimeout(checkTimeout);
                }
                checkTimeout = setTimeout(function() {
                    checkGalleryLinks();
                }, 300); // 300ms 防抖延迟
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
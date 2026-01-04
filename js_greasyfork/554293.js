// ==UserScript==
// @name         豆瓣海报转存助手
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  提取豆瓣电影中图海报并上传到图床
// @author       AI编程助手
// @match        https://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      freeimage.host
// @connect      img1.doubanio.com
// @connect      img2.doubanio.com
// @connect      img3.doubanio.com
// @connect      img4.doubanio.com
// @connect      img5.doubanio.com
// @connect      img6.doubanio.com
// @connect      img7.doubanio.com
// @connect      img8.doubanio.com
// @connect      img9.doubanio.com
// @connect      img10.doubanio.com
// @connect      *.douban.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554293/%E8%B1%86%E7%93%A3%E6%B5%B7%E6%8A%A5%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554293/%E8%B1%86%E7%93%A3%E6%B5%B7%E6%8A%A5%E8%BD%AC%E5%AD%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息 - 仅保留中图配置
    const CONFIG = {
        UPLOAD_URL: 'https://freeimage.host/api/1/upload',
        MAX_RETRIES: 6,
        RETRY_DELAY: 2000,
        TIMEOUT: 20000,
        API_KEY_STORAGE_KEY: 'freeimage_host_api_key',
        API_DOC_URL: 'https://freeimage.host/api',
        DOUBAN_IMAGE_DOMAINS: [
            'img1.doubanio.com', 'img2.doubanio.com', 'img3.doubanio.com',
            'img4.doubanio.com', 'img5.doubanio.com', 'img6.doubanio.com',
            'img7.doubanio.com', 'img8.doubanio.com', 'img9.doubanio.com',
            'img10.doubanio.com'
        ],
        // 仅保留中图配置
        POSTER_SIZE: {
            code: 'm',
            name: '中图',
            ratio: 'm_ratio_poster'
        }
    };

    // 错误类型枚举
    const ErrorType = {
        POSTER_EXTRACT: '海报提取错误',
        IMAGE_FETCH: '图片获取错误',
        UPLOAD_FAILED: '上传失败',
        RESPONSE_PARSE: '响应解析错误',
        NETWORK_ERROR: '网络错误',
        API_KEY_MISSING: 'API Key缺失',
        API_KEY_INVALID: 'API Key无效'
    };

    // 日志工具函数
    const Logger = {
        info: (message, ...args) => console.log(`[INFO] ${message}`, ...args),
        warn: (message, ...args) => console.warn(`[WARN] ${message}`, ...args),
        error: (message, ...args) => console.error(`[ERROR] ${message}`, ...args),
        debug: (message, ...args) => console.debug(`[DEBUG] ${message}`, ...args),
        time: (label) => console.time(`[PERF] ${label}`),
        timeEnd: (label) => console.timeEnd(`[PERF] ${label}`)
    };

    // API Key管理类
    class ApiKeyManager {
        constructor() {
            this.cachedApiKey = null;
            this.apiKeyLastFetch = 0;
            this.apiKeyLastValidation = 0;
            this.isApiKeyValid = false;
        }

        // 获取保存的API Key - 带缓存
        getApiKey() {
            const now = Date.now();
            if (this.cachedApiKey && (now - this.apiKeyLastFetch < 30000)) { // 30秒缓存
                Logger.debug('从缓存获取API Key', { timestamp: now });
                return this.cachedApiKey;
            }
            
            const apiKey = GM_getValue(CONFIG.API_KEY_STORAGE_KEY, null);
            this.cachedApiKey = apiKey;
            this.apiKeyLastFetch = now;
            Logger.debug('从存储获取API Key', { hasKey: !!apiKey, timestamp: now });
            return apiKey;
        }

        // 保存API Key - 清除缓存并重置验证状态
        saveApiKey(apiKey) {
            if (apiKey && apiKey.trim()) {
                GM_setValue(CONFIG.API_KEY_STORAGE_KEY, apiKey.trim());
                this.cachedApiKey = apiKey.trim();
                this.apiKeyLastFetch = Date.now();
                this.apiKeyLastValidation = 0; // 重置验证时间
                this.isApiKeyValid = false; // 重置验证状态
                Logger.info('API Key已保存并重置验证状态');
                return true;
            }
            return false;
        }

        // 检查API Key是否已验证
        isKeyValidated() {
            return this.isApiKeyValid;
        }

        // 设置API Key验证状态
        setValidationStatus(isValid) {
            this.isApiKeyValid = isValid;
            this.apiKeyLastValidation = Date.now();
            Logger.debug('API Key验证状态已更新', { isValid, timestamp: this.apiKeyLastValidation });
        }

        // 验证API Key有效性
        validateApiKey(apiKey) {
            return new Promise((resolve, reject) => {
                if (!apiKey || !apiKey.trim()) {
                    Logger.error('API Key不能为空');
                    reject(new Error('API Key不能为空'));
                    return;
                }

                try {
                    const formData = new FormData();
                    const testImageBase64 = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                    const blob = base64ToBlob(testImageBase64);
                    const file = new File([blob], 'test_validate.png', { type: 'image/gif' });
                    
                    formData.append('source', file);
                    formData.append('action', 'upload');
                    formData.append('format', 'json');
                    formData.append('key', apiKey.trim());

                    Logger.debug('开始验证API Key');

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: CONFIG.UPLOAD_URL,
                        data: formData,
                        timeout: CONFIG.TIMEOUT,
                        headers: {
                            'Accept': 'application/json'
                        },
                        onload: function(response) {
                            try {
                                Logger.debug('API Key验证响应', { status: response.status, hasResponse: !!response.responseText });
                                
                                if (!response.responseText) {
                                    Logger.error('验证请求未返回数据');
                                    reject(new Error('验证请求未返回数据'));
                                    return;
                                }
                                
                                const result = JSON.parse(response.responseText);
                                
                                if (result.error && result.error.includes('Invalid API key')) {
                                    Logger.error('无效的API Key');
                                    reject(new Error('无效的API Key，请检查输入'));
                                } else {
                                    Logger.info('API Key验证成功');
                                    resolve(true);
                                }
                            } catch (e) {
                                Logger.error('验证响应解析失败:', e);
                                reject(new Error(`验证响应解析失败: ${e.message}`));
                            }
                        },
                        onerror: function(error) {
                            Logger.error('验证时网络错误:', error);
                            reject(new Error(`验证时网络错误: ${error.message || '未知错误'}`));
                        },
                        ontimeout: function() {
                            Logger.error(`验证请求超时（${CONFIG.TIMEOUT/1000}秒）`);
                            reject(new Error(`验证请求超时（${CONFIG.TIMEOUT/1000}秒）`));
                        }
                    });
                } catch (e) {
                    Logger.error('验证准备失败:', e);
                    reject(new Error(`验证准备失败: ${e.message}`));
                }
            });
        }
    }

    // 创建API Key管理实例
    const apiKeyManager = new ApiKeyManager();

    // 获取保存的API Key
    function getApiKey() {
        return apiKeyManager.getApiKey();
    }

    // 保存API Key
    function saveApiKey(apiKey) {
        return apiKeyManager.saveApiKey(apiKey);
    }

    // 切换图片域名重试
    function getAlternateImageUrl(originalUrl, retryCount) {
        try {
            const urlObj = new URL(originalUrl);
            const currentDomain = urlObj.hostname;
            const currentIndex = CONFIG.DOUBAN_IMAGE_DOMAINS.indexOf(currentDomain);
            let newIndex = (currentIndex + retryCount) % CONFIG.DOUBAN_IMAGE_DOMAINS.length;
            if (newIndex < 0) newIndex = 0;
            const newDomain = CONFIG.DOUBAN_IMAGE_DOMAINS[newIndex];
            urlObj.hostname = newDomain;
            Logger.info(`切换图片域名: ${currentDomain} → ${newDomain}`);
            return urlObj.toString();
        } catch (e) {
            Logger.error('生成备用图片URL失败:', e);
            return originalUrl;
        }
    }

    // 生成中图海报URL
    function getMediumPosterUrl(originalUrl) {
        // 将任意尺寸转换为中图(m_ratio_poster)
        const result = originalUrl.replace(/[sm]_ratio_poster/, CONFIG.POSTER_SIZE.ratio);
        Logger.debug(`海报URL转换: ${originalUrl} → ${result}`);
        return result;
    }

    // Base64转Blob
    function base64ToBlob(base64, mimeType = 'image/gif') {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    // 显示API Key配置对话框
    function showApiKeyConfigDialog(onSuccess, isInvalid = false) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 99999;
            max-width: 90%;
            width: 500px;
        `;

        const errorHtml = isInvalid ? `
            <div style="background: #fee; color: #d32f2f; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 14px;">
                ⚠️ 您的API Key无效，请重新输入
            </div>
        ` : '';

        popup.innerHTML = `
            <h3 style="margin-top: 0; color: #333; display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 20px; height: 20px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                </span>
                配置API Key
            </h3>
            ${errorHtml}
            <p style="color: #666; margin-bottom: 15px;">
                请输入您的freeimage.host API Key，用于图片上传。
            </p>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 6px; font-weight: 500;">API Key:</label>
                <input type="text" id="apiKeyInput" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" placeholder="请输入API Key">
            </div>
            <p style="font-size: 13px; color: #666; margin-bottom: 20px;">
                没有API Key？<a href="${CONFIG.API_DOC_URL}" target="_blank" style="color: #3498db; text-decoration: none;">点击这里获取</a>（将在新窗口打开）
            </p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancelBtn" style="background: #f0f0f0; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">取消</button>
                <button id="saveBtn" style="background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">保存并验证</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        const apiKeyInput = document.getElementById('apiKeyInput');
        const savedKey = getApiKey();
        if (savedKey) {
            apiKeyInput.value = savedKey;
        }

        const saveBtn = document.getElementById('saveBtn');
        saveBtn.addEventListener('click', async function() {
            const apiKey = apiKeyInput.value.trim();
            if (!apiKey) {
                alert('请输入API Key');
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = '验证中...';
            Logger.info('开始验证API Key');

            try {
                await apiKeyManager.validateApiKey(apiKey);
                saveApiKey(apiKey);
                apiKeyManager.setValidationStatus(true); // 设置验证状态为有效
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
                if (onSuccess) {
                    onSuccess();
                }
                alert('API Key配置成功！');
                Logger.info('API Key配置成功');
            } catch (error) {
                saveBtn.disabled = false;
                saveBtn.textContent = '保存并验证';
                alert(`验证失败: ${error.message}`);
                Logger.error('API Key验证失败:', error);
            }
        });

        document.getElementById('cancelBtn').addEventListener('click', function() {
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
            Logger.debug('API Key配置对话框已关闭');
        });

        overlay.addEventListener('click', function() {
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
            Logger.debug('通过遮罩关闭API Key配置对话框');
        });

        apiKeyInput.focus();
    }

    // 提取海报图片URL - 仅提取中图
    function extractPosterUrl() {
        try {
            Logger.time('提取海报URL');
            const posterElement = document.querySelector('#mainpic img');
            
            if (!posterElement) {
                throw new Error('未找到海报元素，请确认页面结构是否正常');
            }
            if (!posterElement.src) {
                throw new Error('海报元素存在，但未设置src属性');
            }
            if (posterElement.src.trim() === '') {
                throw new Error('海报src属性为空值');
            }

            // 生成并返回中图URL
            const mediumUrl = getMediumPosterUrl(posterElement.src);
            
            if (!mediumUrl.startsWith('http')) {
                throw new Error(`转换后的中图URL不合法: ${mediumUrl}`);
            }
            
            Logger.info(`提取到中图海报URL: ${mediumUrl}`);
            Logger.timeEnd('提取海报URL');
            return {
                original: posterElement.src,
                medium: mediumUrl
            };
        } catch (error) {
            Logger.error('海报提取失败:', error);
            error.type = ErrorType.POSTER_EXTRACT;
            throw error;
        }
    }

    // 获取图片并转换为FormData - 仅处理中图
    function getImageFormData(imageUrls, retries = 0) {
        return new Promise((resolve, reject) => {
            try {
                // 始终使用中图URL
                let currentUrl;
                if (retries < CONFIG.MAX_RETRIES / 2) {
                    currentUrl = getAlternateImageUrl(imageUrls.medium, retries);
                } else {
                    // 重试次数较多时切换到原始URL作为备选
                    currentUrl = getAlternateImageUrl(imageUrls.original, retries);
                }
                
                Logger.info(`第${retries + 1}次尝试获取${CONFIG.POSTER_SIZE.name}尺寸图片: ${currentUrl}`);
                
                const urlObj = new URL(currentUrl);
                const imageDomain = urlObj.hostname;
                
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: currentUrl,
                    responseType: 'blob',
                    timeout: CONFIG.TIMEOUT,
                    headers: {
                        'User-Agent': navigator.userAgent,
                        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                        'Referer': 'https://movie.douban.com/',
                        'Connection': 'keep-alive'
                    },
                    
                    onload: function(response) {
                        try {
                            Logger.debug(`图片获取响应: ${response.status}`, { 
                                hasResponse: !!response.response,
                                responseType: response.response?.type 
                            });
                            
                            if (response.status < 200 || response.status >= 300) {
                                if (retries < CONFIG.MAX_RETRIES) {
                                    Logger.warn(`HTTP状态码异常(${response.status})，将重试...`);
                                    setTimeout(() => {
                                        getImageFormData(imageUrls, retries + 1).then(resolve).catch(reject);
                                    }, CONFIG.RETRY_DELAY);
                                    return;
                                }
                                throw new Error(`HTTP状态码异常: ${response.status}`);
                            }
                            
                            if (!response.response) {
                                throw new Error('服务器未返回图片数据');
                            }
                            
                            const fileName = currentUrl.split('/').pop().split('?')[0] || `douban_poster_${Date.now()}.jpg`;
                            const mimeType = response.response.type || 'image/jpeg';
                            
                            if (!mimeType.startsWith('image/')) {
                                throw new Error(`获取的不是图片文件，MIME类型: ${mimeType}`);
                            }
                            
                            const blob = new Blob([response.response], { type: mimeType });
                            const file = new File([blob], fileName, { type: mimeType });
                            
                            const formData = new FormData();
                            formData.append('source', file);
                            formData.append('action', 'upload');
                            formData.append('format', 'json');
                            formData.append('key', getApiKey()); // 直接使用缓存的API Key，无需验证
                        
                            Logger.info('图片数据获取成功，准备上传');
                            resolve(formData);
                        } catch (error) {
                            Logger.error('图片获取失败:', error);
                            error.type = ErrorType.IMAGE_FETCH;
                            reject(error);
                        }
                    },
                    
                    onerror: function(error) {
                        Logger.error(`网络请求失败: ${error.message}`);
                        if (retries < CONFIG.MAX_RETRIES) {
                            Logger.info('将切换域名重试...');
                            setTimeout(() => {
                                getImageFormData(imageUrls, retries + 1).then(resolve).catch(reject);
                            }, CONFIG.RETRY_DELAY);
                        } else {
                            const err = new Error(`网络请求失败: ${error.message || '未知网络错误'}`);
                            err.type = ErrorType.NETWORK_ERROR;
                            err.details = `请求URL: ${currentUrl}\n图片域名: ${imageDomain}\n已尝试${CONFIG.MAX_RETRIES + 1}次`;
                            Logger.error('网络请求失败，已达到最大重试次数:', err);
                            reject(err);
                        }
                    },
                    
                    ontimeout: function() {
                        Logger.warn(`请求超时: ${currentUrl}`);
                        if (retries < CONFIG.MAX_RETRIES) {
                            Logger.info('将切换域名重试...');
                            setTimeout(() => {
                                getImageFormData(imageUrls, retries + 1).then(resolve).catch(reject);
                            }, CONFIG.RETRY_DELAY);
                        } else {
                            const err = new Error(`请求超时(超过${CONFIG.TIMEOUT/1000}秒)`);
                            err.type = ErrorType.NETWORK_ERROR;
                            err.details = `超时URL: ${currentUrl}\n图片域名: ${imageDomain}\n已尝试${CONFIG.MAX_RETRIES + 1}次`;
                            Logger.error('请求超时，已达到最大重试次数:', err);
                            reject(err);
                        }
                    }
                });
            } catch (error) {
                Logger.error('图片获取准备失败:', error);
                error.type = ErrorType.IMAGE_FETCH;
                reject(error);
            }
        });
    }

    // 上传图片到图床
    function uploadToFreeImageHost(formData, retries = 0) {
        return new Promise((resolve, reject) => {
            try {
                Logger.time('上传图片到图床');
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: CONFIG.UPLOAD_URL,
                    data: formData,
                    timeout: CONFIG.TIMEOUT,
                    headers: {
                        'Accept': 'application/json'
                    },
                    
                    onload: function(response) {
                        try {
                            Logger.debug(`上传响应: ${response.status}`, { 
                                hasResponse: !!response.responseText,
                                responseLength: response.responseText?.length 
                            });
                            
                            if (response.status < 200 || response.status >= 300) {
                                throw new Error(`上传接口返回异常状态码: ${response.status}`);
                            }
                            
                            if (!response.responseText) {
                                throw new Error('上传接口未返回任何数据');
                            }
                            
                            let result;
                            try {
                                result = JSON.parse(response.responseText);
                            } catch (parseErr) {
                                throw new Error(`响应格式不是有效的JSON: ${parseErr.message}`);
                            }
                            
                            if (result.error && result.error.includes('Invalid API key')) {
                                apiKeyManager.setValidationStatus(false); // 标记API Key无效
                                const err = new Error('API Key无效，请重新配置');
                                err.type = ErrorType.API_KEY_INVALID;
                                Logger.error('API Key无效:', err);
                                throw err;
                            }
                            
                            if (result.status_code !== 200) {
                                const errorMsg = result.error || `API返回非成功状态码: ${result.status_code}`;
                                const err = new Error(errorMsg);
                                err.apiStatusCode = result.status_code;
                                err.type = ErrorType.UPLOAD_FAILED;
                                
                                if (errorMsg.includes('Missing required')) {
                                    err.solution = '上传参数不完整，请检查脚本是否最新版本';
                                } else if (errorMsg.includes('Invalid source')) {
                                    err.solution = '图片源无效，可能是图片损坏或格式不支持';
                                }
                                
                                Logger.error('上传失败:', err);
                                throw err;
                            }
                            
                            if (!result.image || !result.image.url) {
                                throw new Error('API返回数据不完整，未包含图片URL');
                            }
                            
                            if (!result.image.url.startsWith('http')) {
                                throw new Error(`API返回的图片URL不合法: ${result.image.url}`);
                            }
                            
                            apiKeyManager.setValidationStatus(true); // 上传成功，确认API Key有效
                            Logger.info('图片上传成功:', result.image.url);
                            Logger.timeEnd('上传图片到图床');
                            resolve(result.image.url);
                        } catch (error) {
                            Logger.error('上传处理失败:', error);
                            if (retries < CONFIG.MAX_RETRIES && error.type !== ErrorType.API_KEY_INVALID) {
                                Logger.info(`上传失败，将在${CONFIG.RETRY_DELAY/1000}秒后重试 (${retries + 1}/${CONFIG.MAX_RETRIES})`);
                                setTimeout(() => {
                                    uploadToFreeImageHost(formData, retries + 1)
                                        .then(resolve)
                                        .catch(reject);
                                }, CONFIG.RETRY_DELAY);
                            } else {
                                error.type = error.type || ErrorType.UPLOAD_FAILED;
                                error.details = retries >= CONFIG.MAX_RETRIES ? `已达到最大重试次数(${CONFIG.MAX_RETRIES})` : '';
                                Logger.error('上传失败，已达到最大重试次数:', error);
                                reject(error);
                            }
                        }
                    },
                    
                    onerror: function(error) {
                        Logger.error(`上传请求失败: ${error.message || '未知错误'}`);
                        const err = new Error(`上传请求失败: ${error.message || '未知错误'}`);
                        err.type = ErrorType.NETWORK_ERROR;
                        
                        if (retries < CONFIG.MAX_RETRIES) {
                            Logger.info(`上传失败，将在${CONFIG.RETRY_DELAY/1000}秒后重试 (${retries + 1}/${CONFIG.MAX_RETRIES})`);
                            setTimeout(() => {
                                uploadToFreeImageHost(formData, retries + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, CONFIG.RETRY_DELAY);
                        } else {
                            err.details = `已达到最大重试次数(${CONFIG.MAX_RETRIES})`;
                            Logger.error('上传请求失败，已达到最大重试次数:', err);
                            reject(err);
                        }
                    },
                    
                    ontimeout: function() {
                        Logger.warn(`上传请求超时(超过${CONFIG.TIMEOUT/1000}秒)`);
                        const err = new Error(`上传请求超时(超过${CONFIG.TIMEOUT/1000}秒)`);
                        err.type = ErrorType.NETWORK_ERROR;
                        
                        if (retries < CONFIG.MAX_RETRIES) {
                            Logger.info(`上传超时，将在${CONFIG.RETRY_DELAY/1000}秒后重试 (${retries + 1}/${CONFIG.MAX_RETRIES})`);
                            setTimeout(() => {
                                uploadToFreeImageHost(formData, retries + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, CONFIG.RETRY_DELAY);
                        } else {
                            err.details = `已达到最大重试次数(${CONFIG.MAX_RETRIES})`;
                            Logger.error('上传请求超时，已达到最大重试次数:', err);
                            reject(err);
                        }
                    }
                });
            } catch (error) {
                Logger.error('上传准备失败:', error);
                error.type = ErrorType.UPLOAD_FAILED;
                reject(error);
            }
        });
    }

    // 显示详细错误信息
    function showErrorDialog(error) {
        if (error.type === ErrorType.API_KEY_INVALID) {
            showApiKeyConfigDialog(startUploadProcess, true);
            return;
        }

        let errorHtml = `
            <h3 style="color: #d93025; margin-top: 0;">操作失败 - ${error.type}</h3>
            <p><strong>错误原因:</strong> ${error.message}</p>
        `;
        
        if (error.details) {
            errorHtml += `<p><strong>详细信息:</strong> ${error.details}</p>`;
        }
        
        if (error.type === ErrorType.NETWORK_ERROR) {
            errorHtml += `
                <p><strong>建议解决方法:</strong></p>
                <ul style="margin-top: 5px; padding-left: 20px; color: #666;">
                    <li>检查网络连接是否正常</li>
                    <li>尝试刷新页面后重新操作</li>
                    <li>如使用VPN，请切换节点后重试</li>
                </ul>
            `;
        } else if (error.solution) {
            errorHtml += `<p><strong>建议解决方法:</strong> ${error.solution}</p>`;
        }
        
        errorHtml += `
            <p style="font-size: 0.9em; color: #666;">
                如需进一步排查问题，可以打开浏览器开发者工具(F12)查看控制台日志
            </p>
            <button id="closeErrorBtn" style="background: #d93025; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                关闭
            </button>
        `;
        
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 99999;
            max-width: 90%;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        popup.innerHTML = errorHtml;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
        
        document.getElementById('closeErrorBtn').addEventListener('click', function() {
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
            Logger.debug('错误对话框已关闭');
        });
    }

    // 通用复制函数
    function copyToClipboard(text, copyBtn, successElement, containerElement) {
        // 清除之前的超时
        if (copyBtn.successTimeout) clearTimeout(copyBtn.successTimeout);
        
        try {
            // 执行复制
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        showCopySuccess(copyBtn, successElement, containerElement);
                        Logger.info('文本已通过Clipboard API复制');
                    })
                    .catch(() => {
                        fallbackCopy(text, copyBtn, successElement, containerElement);
                    });
            } else {
                fallbackCopy(text, copyBtn, successElement, containerElement);
            }
        } catch (e) {
            Logger.error('复制失败:', e);
            showCopyFailure(successElement);
        }
    }
    
    // 兼容性复制方案
    function fallbackCopy(text, copyBtn, successElement, containerElement) {
        // 创建临时输入框用于复制
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        if (successful) {
            showCopySuccess(copyBtn, successElement, containerElement);
            Logger.info('文本已通过execCommand复制');
        } else {
            showCopyFailure(successElement);
            Logger.warn('execCommand复制失败');
        }
    }
    
    // 显示复制成功反馈
    function showCopySuccess(copyBtn, successElement, containerElement) {
        // 保存原始状态
        const originalText = copyBtn.textContent;
        const originalBackground = copyBtn.style.background;
        
        // 短暂显示"已复制"状态
        copyBtn.textContent = '已复制';
        copyBtn.style.background = '#4caf50';
        
        // 显示成功提示条（保留不消失）
        successElement.textContent = '✅ 已复制到剪贴板';
        successElement.style.display = 'block';
        successElement.style.opacity = '1';
        successElement.style.color = '#2e7d32';
        
        // 添加复制成功的视觉反馈（容器高亮）
        containerElement.style.border = '1px solid #4caf50';
        containerElement.style.backgroundColor = '#f9fff9';
        
        // 短暂延迟后恢复按钮原始状态，但保留提示信息
        copyBtn.successTimeout = setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = originalBackground;
        }, 1000);
    }
    
    // 显示复制失败反馈
    function showCopyFailure(successElement) {
        successElement.textContent = '❌ 复制失败，请手动复制';
        successElement.style.display = 'block';
        successElement.style.opacity = '1';
        successElement.style.color = '#d32f2f';
    }

    // 显示弹窗 - 仅展示中图链接
    function showBBCodePopup(mediumUrl, uploadedUrl) {
        // 生成中图BBCODE
        const mediumBbcode = `[img]${mediumUrl}[/img]`;
        
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 99999;
            max-width: 90%;
            width: 600px;
        `;
        
        popup.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #1e8e3e;">海报BBCODE链接</h3>
                <button id="closeBtn" style="background: none; border: none; color: #666; cursor: pointer; font-size: 18px; padding: 0 5px; transition: color 0.2s;">×</button>
            </div>
            
            <p style="margin: 0 0 15px 0; color: #666;">以下是转存后链接和豆瓣中图原始链接</p>
            
            <!-- 上传后的BBCODE链接 -->
            <div style="margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 1px dashed #eee;">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #333;">
                    转存后链接 (推荐):
                </label>
                <div id="uploadedContainer" style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="text" value="[img]${uploadedUrl}[/img]" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;" readonly id="uploadedInput">
                        <button id="copyUploadedBtn" style="background: #3498db; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; white-space: nowrap; transition: background 0.2s;">
                            复制链接
                        </button>
                    </div>
                    <div id="uploadedSuccess" style="display: none; font-size: 13px; padding-left: 4px; transition: opacity 0.3s ease;"></div>
                </div>
            </div>
            
            <!-- 中图原始链接 -->
            <div style="margin: 0 0 20px 0;">
                <label style="display: block; margin-bottom: 6px; font-weight: 500; color: #333;">
                    豆瓣中图链接:
                </label>
                <div id="mediumContainer" style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <input type="text" value="${mediumBbcode}" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;" readonly id="mediumInput">
                        <button id="copyMediumBtn" style="background: #3498db; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; white-space: nowrap; transition: background 0.2s;">
                            复制链接
                        </button>
                    </div>
                    <div id="mediumSuccess" style="display: none; font-size: 13px; padding-left: 4px; transition: opacity 0.3s ease;"></div>
                </div>
            </div>
            
            <!-- 底部操作区 -->
            <div style="border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
                <button id="bottomCloseBtn" style="background: #f0f0f0; border: 1px solid #ddd; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s;">
                    关闭
                </button>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(popup);
        
        // 绑定转存链接的复制事件
        const copyUploadedBtn = document.getElementById('copyUploadedBtn');
        const uploadedSuccess = document.getElementById('uploadedSuccess');
        const uploadedContainer = document.getElementById('uploadedContainer');
        
        copyUploadedBtn.addEventListener('click', () => {
            copyToClipboard(`[img]${uploadedUrl}[/img]`, copyUploadedBtn, uploadedSuccess, uploadedContainer);
        });
        
        document.getElementById('uploadedInput').addEventListener('click', () => {
            copyToClipboard(`[img]${uploadedUrl}[/img]`, copyUploadedBtn, uploadedSuccess, uploadedContainer);
        });
        
        // 绑定中图原始链接的复制事件
        const copyMediumBtn = document.getElementById('copyMediumBtn');
        const mediumSuccess = document.getElementById('mediumSuccess');
        const mediumContainer = document.getElementById('mediumContainer');
        
        copyMediumBtn.addEventListener('click', () => {
            copyToClipboard(mediumBbcode, copyMediumBtn, mediumSuccess, mediumContainer);
        });
        
        document.getElementById('mediumInput').addEventListener('click', () => {
            copyToClipboard(mediumBbcode, copyMediumBtn, mediumSuccess, mediumContainer);
        });
        
        // 自动复制上传后的链接一次
        setTimeout(() => {
            copyToClipboard(`[img]${uploadedUrl}[/img]`, copyUploadedBtn, uploadedSuccess, uploadedContainer);
        }, 500);
        
        // 关闭弹窗
        const closeBtns = [
            document.getElementById('closeBtn'),
            document.getElementById('bottomCloseBtn')
        ];
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 清除所有超时
                if (copyUploadedBtn.successTimeout) clearTimeout(copyUploadedBtn.successTimeout);
                if (copyMediumBtn.successTimeout) clearTimeout(copyMediumBtn.successTimeout);
                
                document.body.removeChild(popup);
                document.body.removeChild(overlay);
                Logger.debug('BBCODE弹窗已关闭');
            });
        });
        
        // 按钮悬停效果
        [copyUploadedBtn, copyMediumBtn].forEach(btn => {
            btn.addEventListener('mouseover', function() {
                // 只有在非"已复制"状态才改变背景
                if (this.textContent !== '已复制') {
                    this.style.background = '#2980b9';
                }
            });
            
            btn.addEventListener('mouseout', function() {
                // 只有在非"已复制"状态才恢复背景
                if (this.textContent !== '已复制') {
                    this.style.background = '#3498db';
                }
            });
        });
        
        // 关闭按钮悬停效果
        document.getElementById('closeBtn').addEventListener('mouseover', function() {
            this.style.color = '#d32f2f';
        });
        
        document.getElementById('closeBtn').addEventListener('mouseout', function() {
            this.style.color = '#666';
        });
        
        // 底部关闭按钮悬停效果
        document.getElementById('bottomCloseBtn').addEventListener('mouseover', function() {
            this.style.background = '#e8e8e8';
        });
        
        document.getElementById('bottomCloseBtn').addEventListener('mouseout', function() {
            this.style.background = '#f0f0f0';
        });
    }

    // 更新按钮状态和动画
    function updateButtonStatus(button, stage) {
        button.innerHTML = '';
        
        const statusContainer = document.createElement('div');
        statusContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            white-space: nowrap;
        `;
        
        const textElement = document.createElement('span');
        const animationElement = document.createElement('span');
        animationElement.style.cssText = `
            display: inline-block;
            width: 14px;
            height: 14px;
        `;
        
        switch(stage) {
            case 'idle':
                textElement.textContent = '海报转存';
                animationElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                `;
                button.style.background = 'linear-gradient(135deg, #4a90e2 0%, #3498db 100%)';
                button.style.boxShadow = '0 2px 5px rgba(52, 152, 219, 0.3)';
                break;
                
            case 'extracting':
                textElement.textContent = '提取海报中';
                animationElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1.5s linear infinite;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <style>@keyframes spin {from { transform: rotate(0deg); }to { transform: rotate(360deg); }}</style>
                `;
                button.style.background = '#7f8c8d';
                button.style.boxShadow = 'none';
                break;
                
            case 'fetching':
                textElement.textContent = '获取图片中';
                animationElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <style>@keyframes pulse {0%, 100% { opacity: 1; }50% { opacity: 0.5; }}</style>
                `;
                button.style.background = '#7f8c8d';
                button.style.boxShadow = 'none';
                break;
                
            case 'uploading':
                textElement.textContent = '上传图片中';
                animationElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: bounce 1.5s infinite;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="16 12 12 8 8 12"></polyline>
                        <line x1="12" y1="16" x2="12" y2="8"></line>
                    </svg>
                    <style>@keyframes bounce {0%, 100% { transform: translateY(0); }50% { transform: translateY(-5px); }}</style>
                `;
                button.style.background = '#7f8c8d';
                button.style.boxShadow = 'none';
                break;
        }
        
        statusContainer.appendChild(textElement);
        statusContainer.appendChild(animationElement);
        button.appendChild(statusContainer);
    }

    // 上传流程 - 仅处理中图
    async function startUploadProcess(button) {
        try {
            Logger.info('开始海报转存流程');
            button.disabled = true;
            
            // 检查API Key是否存在，如果不存在则配置
            const apiKey = getApiKey();
            if (!apiKey) {
                throw new Error('API Key未配置');
            }
            
            // 注意：这里不再验证API Key，而是直接使用缓存的API Key
            // 仅在上传报错时才会重新验证API Key
            
            updateButtonStatus(button, 'extracting');
            const imageUrls = extractPosterUrl(); // 仅获取中图URL
            
            updateButtonStatus(button, 'fetching');
            const formData = await getImageFormData(imageUrls); // 仅处理中图
            
            updateButtonStatus(button, 'uploading');
            const uploadedUrl = await uploadToFreeImageHost(formData);
            
            // 显示弹窗时仅传入中图链接
            showBBCodePopup(imageUrls.medium, uploadedUrl);
            Logger.info('海报转存流程完成');
            
        } catch (error) {
            Logger.error(`[${error.type}]`, error);
            showErrorDialog(error);
        } finally {
            button.disabled = false;
            updateButtonStatus(button, 'idle');
        }
    }

    // 创建简化的按钮（无尺寸选择器）
    function createActionButton() {
        const posterContainer = document.querySelector('#mainpic');
        if (!posterContainer) {
            Logger.warn('未找到海报容器，将使用默认位置');
            fallbackButtonPosition();
            return;
        }

        const button = document.createElement('button');
        button.style.cssText = `
            background: linear-gradient(135deg, #4a90e2 0%, #3498db 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            padding: 6px 12px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 8px;
            width: auto;
            min-width: 100px;
        `;

        updateButtonStatus(button, 'idle');

        button.addEventListener('mouseover', () => {
            button.style.background = 'linear-gradient(135deg, #3a80d2 0%, #2980b9 100%)';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.4)';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = 'linear-gradient(135deg, #4a90e2 0%, #3498db 100%)';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 5px rgba(52, 152, 219, 0.3)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px)';
            button.style.boxShadow = '0 1px 3px rgba(52, 152, 219, 0.3)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.4)';
        });

        button.addEventListener('click', async function() {
            const apiKey = getApiKey();
            if (!apiKey) {
                Logger.info('API Key不存在，显示配置对话框');
                showApiKeyConfigDialog(() => startUploadProcess(this));
                return;
            }

            startUploadProcess(this);
        });

        const wrapper = document.createElement('div');
        wrapper.style.textAlign = 'center';
        wrapper.appendChild(button);
        posterContainer.appendChild(wrapper);
        Logger.info('操作按钮已创建');
    }

    // 找不到海报容器时的 fallback 位置
    function fallbackButtonPosition() {
        const button = document.createElement('button');
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4a90e2 0%, #3498db 100%);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            padding: 6px 12px;
            box-shadow: 0 2px 5px rgba(52, 152, 219, 0.3);
            z-index: 9999;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        `;

        button.innerHTML = `
            <span style="display: inline-block; width: 14px; height: 14px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            </span>
            海报转存
        `;

        button.addEventListener('mouseover', () => {
            button.style.background = 'linear-gradient(135deg, #3a80d2 0%, #2980b9 100%)';
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.4)';
        });

        button.addEventListener('mouseout', () => {
            button.style.background = 'linear-gradient(135deg, #4a90e2 0%, #3498db 100%)';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 5px rgba(52, 152, 219, 0.3)';
        });

        button.addEventListener('click', async function() {
            const apiKey = getApiKey();
            if (!apiKey) {
                Logger.info('API Key不存在，显示配置对话框');
                showApiKeyConfigDialog(() => startUploadProcess(this));
                return;
            }

            startUploadProcess(this);
        });

        document.body.appendChild(button);
        Logger.info('备用按钮已创建');
    }

    // 页面加载完成后初始化
    window.addEventListener('load', function() {
        setTimeout(createActionButton, 1000);
        Logger.info('豆瓣海报上传脚本(仅中图版)已初始化完成');
    });
})();

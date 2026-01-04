// ==UserScript==
// @name         豆瓣海报转存pixhost
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  从豆瓣页面提取高清海报并上传到Pixhost，支持多CDN域名轮询下载
// @author       guyuanwind
// @match        https://movie.douban.com/subject/*
// @match        https://book.douban.com/subject/*
// @match        https://music.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @connect      img1.doubanio.com
// @connect      img2.doubanio.com
// @connect      img3.doubanio.com
// @connect      img4.doubanio.com
// @connect      img5.doubanio.com
// @connect      img6.doubanio.com
// @connect      img7.doubanio.com
// @connect      img8.doubanio.com
// @connect      img9.doubanio.com
// @connect      api.pixhost.to
// @connect      dou.img.lithub.cc
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/553427/%E8%B1%86%E7%93%A3%E6%B5%B7%E6%8A%A5%E8%BD%AC%E5%AD%98pixhost.user.js
// @updateURL https://update.greasyfork.org/scripts/553427/%E8%B1%86%E7%93%A3%E6%B5%B7%E6%8A%A5%E8%BD%AC%E5%AD%98pixhost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从URL中提取豆瓣ID
    function getDoubanId() {
        const match = window.location.href.match(/subject\/(\d+)/);
        return match ? match[1] : null;
    }

    // 豆瓣海报提取函数（多域名轮询版）
    function getDoubanPoster() {
        try {
            const posterImg = document.querySelector('#mainpic img');
            if (!posterImg) {
                throw new Error('未找到海报图片');
            }
            
            const originalSrc = posterImg.src;
            console.log('原始图片URL:', originalSrc);
            
            // 提取域名数字和图片ID
            const domainMatch = originalSrc.match(/https:\/\/img(\d+)\.doubanio\.com/);
            const imageIdMatch = originalSrc.match(/(p\d+)/);
            
            if (!domainMatch || !imageIdMatch) {
                throw new Error('无法解析图片URL格式');
            }
            
            const originalDomainNumber = domainMatch[1]; // 提取数字（如 "2"）
            const imageId = imageIdMatch[1];
            
            // 生成候选URL：优先原始域名，然后尝试 img1-img9
            const candidates = [];
            const domainNumbers = [originalDomainNumber]; // 原始域名优先
            
            // 添加其他域名（1-9，排除原始域名）
            for (let i = 1; i <= 9; i++) {
                if (i.toString() !== originalDomainNumber) {
                    domainNumbers.push(i.toString());
                }
            }
            
            // 路径优先级：先高清，后中清（只尝试jpg格式）
            const paths = [
                'view/photo/l_ratio_poster/public',
                'view/photo/m_ratio_poster/public'
            ];
            
            // 生成候选URL矩阵：9个域名 × 2个路径 = 18个候选URL
            domainNumbers.forEach(num => {
                paths.forEach(path => {
                    candidates.push(`https://img${num}.doubanio.com/${path}/${imageId}.jpg`);
                });
            });
            
            console.log(`生成 ${candidates.length} 个候选URL，原始域名: img${originalDomainNumber}`);
            
            return {
                original: originalSrc,
                candidates: candidates,
                imageId: imageId,
                originalDomain: `img${originalDomainNumber}.doubanio.com`
            };
        } catch (e) {
            throw new Error('海报提取失败: ' + e.message);
        }
    }

    // 第三方托管海报URL构造
    function getThirdPartyPosterUrl() {
        const doubanId = getDoubanId();
        if (!doubanId) {
            throw new Error('无法从页面URL提取豆瓣ID');
        }
        return `https://dou.img.lithub.cc/movie/${doubanId}.jpg`;
    }

    // 验证图片URL是否可访问
    function validateImageUrl(imageUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: imageUrl,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://movie.douban.com/'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const contentType = response.responseHeaders.toLowerCase();
                        const contentLength = response.responseHeaders.match(/content-length:\s*(\d+)/i);
                        const fileSize = contentLength ? parseInt(contentLength[1]) : 0;
                        
                        if (contentType.includes('image/') && fileSize > 1024) {
                            resolve({
                                url: imageUrl,
                                size: fileSize,
                                valid: true
                            });
                        } else {
                            reject(new Error('无效的图片文件'));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('URL验证失败'));
                },
                timeout: 10000
            });
        });
    }

    // 将图片URL转换为Blob对象
    function urlToBlob(imageUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'blob',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Referer': 'https://movie.douban.com/'
                },
                onload: function(response) {
                    try {
                        if (response.status !== 200) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        
                        const blob = response.response;
                        
                        // 检查文件大小
                        if (blob.size === 0) {
                            throw new Error('下载的图片文件为空');
                        }
                        
                        if (blob.size > 10 * 1024 * 1024) {
                            throw new Error('图片文件过大 (>10MB)');
                        }
                        
                        resolve(blob);
                    } catch (e) {
                        reject(new Error('图片处理失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('图片下载失败: ' + (error.statusText || '网络错误')));
                },
                ontimeout: function() {
                    reject(new Error('图片下载超时'));
                },
                timeout: 30000 // 30秒超时
            });
        });
    }

    // 上传到Pixhost（基于PixhostUpload.sh逻辑）
    function uploadToPixhost(blob, filename = 'poster.jpg') {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('img', blob, filename);
            formData.append('content_type', '0');
            formData.append('max_th_size', '420');

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.pixhost.to/images',
                headers: {
                    'Accept': 'application/json'
                },
                data: formData,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (!data.show_url) {
                            reject('API未返回有效URL');
                            return;
                        }
                        
                        // 转换为直链URL（基于PixhostUpload.sh的转换逻辑）
                        const directUrl = convertToDirectUrl(data.show_url);
                        if (!directUrl) {
                            reject('URL转换失败');
                            return;
                        }
                        
                        resolve({
                            showUrl: data.show_url,
                            directUrl: directUrl,
                            bbCode: `[img]${directUrl}[/img]`
                        });
                    } catch (e) {
                        reject('解析响应失败: ' + e.message);
                    }
                },
                onerror: function(error) {
                    reject('上传请求失败: ' + error.statusText);
                },
                ontimeout: function() {
                    reject('上传超时');
                },
                timeout: 30000 // 30秒超时
            });
        });
    }

    // URL转换函数（基于PixhostUpload.sh逻辑）
    function convertToDirectUrl(showUrl) {
        try {
            // 方案1: 直接替换域名和路径
            let directUrl = showUrl
                .replace(/https:\/\/pixhost\.to\/show\//, 'https://img1.pixhost.to/images/')
                .replace(/https:\/\/pixhost\.to\/th\//, 'https://img1.pixhost.to/images/')
                .replace(/_..\.jpg$/, '.jpg');

            // 方案2: 正则提取重建URL
            if (!directUrl.startsWith('https://img1.pixhost.to/images/')) {
                const match = showUrl.match(/(\d+)\/([^\/]+\.(jpg|png|gif))/);
                if (match) {
                    directUrl = `https://img1.pixhost.to/images/${match[1]}/${match[2]}`;
                }
            }

            // 最终验证
            if (/^https:\/\/img1\.pixhost\.to\/images\/\d+\/[^\/]+\.(jpg|png|gif)$/.test(directUrl)) {
                return directUrl;
            } else {
                console.error('URL转换失败:', showUrl);
                return null;
            }
        } catch (e) {
            console.error('URL转换异常:', e);
            return null;
        }
    }

    // 创建结果显示弹窗
    function showResult(result, posterUrl, source = 'unknown', sourceInfo = '') {
        const modal = document.createElement('div');
        modal.id = 'poster-upload-result';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 复制到剪贴板的通用函数
        const copyToClipboard = (text, type) => {
            navigator.clipboard.writeText(text).then(() => {
                // 创建简洁的提示
                const toast = document.createElement('div');
                toast.textContent = `${type}已复制到剪贴板`;
                toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 10001;
                    font-size: 14px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }).catch(() => {
                alert('复制失败，请手动复制');
            });
        };

        modal.innerHTML = `
            <div id="modal-content" style="
                background: white;
                padding: 20px;
                border-radius: 12px;
                max-width: 600px;
                width: 85%;
                max-height: 70vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            ">
                <!-- 右上角固定关闭按钮 -->
                <button id="close-btn"
                        style="
                            position: fixed;
                            width: 32px;
                            height: 32px;
                            border: none;
                            background: #f5f5f5;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 18px;
                            color: #666;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.2s ease;
                            z-index: 10002;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                        "
                        onmouseover="this.style.background='#e0e0e0'"
                        onmouseout="this.style.background='#f5f5f5'">×</button>

                <h3 style="margin: 0 30px 20px 0; text-align: center; color: #333; font-size: 18px;">海报上传成功 ✓</h3>
                
                ${sourceInfo ? `<div style="text-align: center; margin-bottom: 15px; padding: 8px; background: #e8f5e8; border-radius: 5px; border: 1px solid #4caf50;">
                    <small style="color: #2e7d32; font-weight: bold;">📸 ${sourceInfo}</small>
                </div>` : ''}
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <label style="font-weight: bold; color: #555; font-size: 14px;">原图链接 (${source}):</label>
                        <button id="copy-douban" data-text="${posterUrl}" data-type="原图链接"
                                style="padding: 4px 8px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">复制</button>
                    </div>
                    <input readonly value="${posterUrl}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; background: #f9f9f9;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <label style="font-weight: bold; color: #555; font-size: 14px;">Pixhost 直链:</label>
                        <button id="copy-direct" data-text="${result.directUrl}" data-type="直链"
                                style="padding: 4px 8px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">复制</button>
                    </div>
                    <input readonly value="${result.directUrl}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; background: #f9f9f9;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <label style="font-weight: bold; color: #555; font-size: 14px;">BBCode 代码:</label>
                        <button id="copy-bbcode" data-text="${result.bbCode}" data-type="BBCode"
                                style="padding: 4px 8px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">复制</button>
                    </div>
                    <input readonly value="${result.bbCode}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; background: #f9f9f9;">
                </div>
                
                <div style="text-align: center; padding-top: 10px; border-top: 1px solid #eee;">
                    <small style="color: #666;">💡 点击对应的复制按钮快速复制链接</small>
                    ${source === 'third-party' ? '<br><small style="color: #ff9800;">⚠️ 使用了第三方图片托管服务</small>' : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 动态定位关闭按钮
        const positionCloseButton = () => {
            const modalContent = document.getElementById('modal-content');
            const closeBtn = document.getElementById('close-btn');
            
            if (modalContent && closeBtn) {
                const rect = modalContent.getBoundingClientRect();
                closeBtn.style.top = (rect.top + 10) + 'px';
                closeBtn.style.left = (rect.right - 42) + 'px';
                closeBtn.style.right = 'auto'; // 清除right定位
            }
        };

        // 初始定位
        setTimeout(positionCloseButton, 10);

        // 窗口大小改变时重新定位
        const resizeHandler = () => positionCloseButton();
        window.addEventListener('resize', resizeHandler);

        // ESC键关闭处理函数
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        // 统一的关闭函数
        const closeModal = () => {
            modal.remove();
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('keydown', handleKeyPress);
        };

        // 关闭按钮事件监听器
        const closeBtn = modal.querySelector('#close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // 添加复制按钮事件监听器
        const copyButtons = ['copy-douban', 'copy-direct', 'copy-bbcode'];
        copyButtons.forEach(buttonId => {
            const button = modal.querySelector('#' + buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    const text = button.getAttribute('data-text');
                    const type = button.getAttribute('data-type');
                    copyToClipboard(text, type);
                });
            }
        });

        // 添加事件监听器
        document.addEventListener('keydown', handleKeyPress);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

    }

    // 智能海报获取函数（双重保障策略）
    async function getSmartPoster() {
        console.log('开始智能海报获取...');
        
        try {
            // 第一优先级：豆瓣官方高清图
            console.log('尝试豆瓣官方高清图...');
            const posterInfo = getDoubanPoster();
            
            // 依次尝试豆瓣候选URL（遍历 img1-img9 × 2个路径）
            for (let i = 0; i < posterInfo.candidates.length; i++) {
                const candidateUrl = posterInfo.candidates[i];
                
                // 提取当前尝试的域名和路径信息
                const domainInfo = candidateUrl.match(/img(\d+)\.doubanio\.com/);
                const pathInfo = candidateUrl.includes('l_ratio_poster') ? '高清' : '中清';
                const domainNum = domainInfo ? domainInfo[1] : '?';
                
                console.log(`测试 [${i + 1}/${posterInfo.candidates.length}] img${domainNum} (${pathInfo}):`, candidateUrl);
                
                try {
                    const validation = await validateImageUrl(candidateUrl);
                    console.log(`✓ 成功！使用 img${domainNum} 域名，文件大小: ${Math.round(validation.size / 1024)}KB`);
                    return {
                        url: candidateUrl,
                        source: 'douban',
                        quality: candidateUrl.includes('l_ratio_poster') ? 'high' : 'medium',
                        size: validation.size
                    };
                } catch (e) {
                    console.log(`✗ img${domainNum} 失败:`, e.message);
                    continue;
                }
            }
            
            // 第二优先级：第三方托管
            console.log('豆瓣官方图片全部失败，尝试第三方托管...');
            const thirdPartyUrl = getThirdPartyPosterUrl();
            console.log('测试第三方URL:', thirdPartyUrl);
            
            try {
                const validation = await validateImageUrl(thirdPartyUrl);
                console.log('✓ 第三方URL验证成功:', validation);
                return {
                    url: thirdPartyUrl,
                    source: 'third-party',
                    quality: 'high',
                    size: validation.size
                };
            } catch (e) {
                console.log('✗ 第三方URL失败:', e.message);
            }
            
            throw new Error('无法获取高质量海报图片，所有方案都失败了');
            
        } catch (e) {
            console.error('智能海报获取失败:', e);
            throw e;
        }
    }

    // 显示错误信息
    function showError(message) {
        alert('错误: ' + message);
        console.error('豆瓣海报上传错误:', message);
    }

    // 显示加载状态
    function showLoading(show = true, message = '正在处理...', detail = '提取海报并上传中，请稍候') {
        let loading = document.getElementById('poster-upload-loading');
        
        if (show) {
            if (!loading) {
                loading = document.createElement('div');
                loading.id = 'poster-upload-loading';
                loading.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.85);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    z-index: 9999;
                    text-align: center;
                    min-width: 300px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                `;
                document.body.appendChild(loading);
            }
            
            loading.innerHTML = `
                <div style="font-size: 16px; margin-bottom: 10px;">
                    <span style="display: inline-block; width: 20px; height: 20px; border: 2px solid #fff; border-radius: 50%; border-top: 2px solid transparent; animation: spin 1s linear infinite; margin-right: 10px;"></span>
                    ${message}
                </div>
                <div style="font-size: 12px; color: #ccc;">${detail}</div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
        } else if (!show && loading) {
            loading.remove();
        }
    }

    // 主处理函数
    async function handlePosterUpload() {
        try {
            console.log('开始豆瓣海报提取上传流程...');

            // 1. 智能海报获取
            showLoading(true, '步骤 1/3', '正在智能识别最佳海报来源...');
            console.log('步骤1: 智能海报获取...');
            const posterResult = await getSmartPoster();
            console.log('✓ 海报获取成功:', posterResult);
            
            // 根据来源显示不同的提示
            let sourceInfo = '';
            switch (posterResult.source) {
                case 'douban':
                    sourceInfo = posterResult.quality === 'high' ? '豆瓣高清海报' : '豆瓣中等清晰度海报';
                    break;
                case 'third-party':
                    sourceInfo = '第三方高质量海报';
                    break;
            }

            // 2. 下载图片
            showLoading(true, '步骤 2/3', `正在下载${sourceInfo}...`);
            console.log(`步骤2: 下载图片 [${posterResult.source}]...`);
            const blob = await urlToBlob(posterResult.url);
            console.log('✓ 图片下载成功, 大小:', Math.round(blob.size / 1024) + 'KB');

            // 3. 上传到Pixhost
            showLoading(true, '步骤 3/3', '正在上传到Pixhost图床...');
            console.log('步骤3: 上传到Pixhost...');
            const result = await uploadToPixhost(blob);
            console.log('✓ 上传成功:', result);

            showLoading(false);
            showResult(result, posterResult.url, posterResult.source, sourceInfo);
            console.log('豆瓣海报提取上传流程完成！');

        } catch (error) {
            showLoading(false);
            console.error('❌ 处理失败:', error);
            showError(error.message || error);
        }
    }

    // 创建上传按钮
    function createUploadButton() {
        // 检查是否已存在按钮
        if (document.getElementById('douban-poster-upload-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'douban-poster-upload-btn';
        button.textContent = '提取并上传海报';
        button.style.cssText = `
            padding: 8px 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            margin: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 鼠标悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', handlePosterUpload);

        // 找个合适的位置插入按钮
        const mainpic = document.querySelector('#mainpic');
        if (mainpic) {
            mainpic.appendChild(button);
        } else {
            // 备选位置
            const info = document.querySelector('#info');
            if (info) {
                info.insertBefore(button, info.firstChild);
            }
        }
    }

    // 页面加载完成后初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 延迟创建按钮，确保页面元素加载完成
        setTimeout(createUploadButton, 1000);
    }

    // 启动脚本
    init();

})();

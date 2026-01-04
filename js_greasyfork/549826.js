// ==UserScript==
// @name         Goofish闲鱼商品图片自动下载器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  简约的goofish商品信息面板
// @author       雷锋haoxp8@qq.com
// @match        https://www.goofish.com/*
// @match        https://goofish.com/*
// @match        https://*.goofish.com/*
// @include      https://www.goofish.com/*
// @include      https://goofish.com/*
// @include      https://*.goofish.com/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @license      BSD-3-Clause
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/549826/Goofish%E9%97%B2%E9%B1%BC%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549826/Goofish%E9%97%B2%E9%B1%BC%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查脚本环境
    if (typeof GM_info !== 'undefined') {
        // Tampermonkey环境
    } else {
        // 非Tampermonkey环境
    }
    
    // 检查页面加载状态
    function checkPageReady() {
        if (document.readyState === 'loading') {
            setTimeout(checkPageReady, 100);
            return;
        }
    }
    checkPageReady();
    
    let itemData = null;
    let imageInfos = [];
    let panel = null;
    
    // 简化的下载设置
    const downloadSettings = {
        format: 'jpg' // 固定使用JPG格式
    };
    
    // 创建迷你面板
    function createMiniPanel() {
        if (panel) panel.remove();
        
        panel = document.createElement('div');
        panel.id = 'goofish-mini-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 340px;
            background: rgba(255, 255, 255, 0.98);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            z-index: 10000;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
            font-size: 14px;
            opacity: 0.15;
            transition: opacity 0.3s ease;
            cursor: move;
            backdrop-filter: blur(12px);
            overflow: hidden;
            will-change: transform;
        `;
        
        // 悬停显示
        panel.addEventListener('mouseenter', () => panel.style.opacity = '1');
        panel.addEventListener('mouseleave', () => panel.style.opacity = '0.15');
        
        // 拖拽功能 - 高性能版本
        let dragging = false;
        let startX, startY, startLeft, startTop;
        
        panel.addEventListener('mousedown', (e) => {
            // 只允许在标题栏拖拽，排除关闭按钮
            if (e.target.closest('[data-drag-handle]') && !e.target.closest('button[onclick*="closest"]')) {
                dragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = panel.offsetLeft;
                startTop = panel.offsetTop;
                panel.style.cursor = 'grabbing';
                
                // 拖拽时禁用所有可能影响性能的CSS效果
                panel.style.transition = 'none';
                panel.style.backdropFilter = 'none';
                panel.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'; // 简化阴影
                
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (dragging) {
                e.preventDefault();
                // 直接设置位置，不使用requestAnimationFrame避免延迟
                const newLeft = startLeft + e.clientX - startX;
                const newTop = startTop + e.clientY - startY;
                
                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
                panel.style.right = 'auto';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (dragging) {
                dragging = false;
                panel.style.cursor = 'move';
                
                // 恢复所有CSS效果
                panel.style.transition = 'opacity 0.3s ease';
                panel.style.backdropFilter = 'blur(12px)';
                panel.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
            }
        });
        
        updatePanel();
        document.body.appendChild(panel);
    }
    
    // 更新面板内容
    function updatePanel() {
        if (!panel) return;
        
        if (!itemData || !imageInfos.length) {
            panel.innerHTML = `
                <div style="padding: 10px; background: #007bff; color: white; border-radius: 8px 8px 0 0; text-align: center; font-weight: bold;">
                    🛍️ Goofish商品信息
                </div>
                <div style="padding: 20px; text-align: center; color: #666;">
                    等待获取商品数据...
                </div>
            `;
            return;
        }
        
        const title = itemData.title || '未知商品';
        const price = itemData.soldPrice || '未知';
        const desc = itemData.desc || '暂无描述';
        
        // 修复图片URL（解决Mixed Content问题）
        function fixImageUrl(url) {
            if (!url) return '';
            
            // 如果是相对路径，添加HTTPS协议
            if (url.startsWith('//')) {
                return 'https:' + url;
            }
            
            // 如果是http，强制改为https（解决Mixed Content问题）
            if (url.startsWith('http://')) {
                const httpsUrl = url.replace('http://', 'https://');
                return httpsUrl;
            }
            
            return url;
        }
        
        // 九宫格图片
        const imageGrid = imageInfos.slice(0, 9).map((img, index) => {
            const fixedUrl = fixImageUrl(img.url);
            
            return `
            <div style="
                aspect-ratio: 1;
                background: #f0f0f0;
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;
                position: relative;
                transition: transform 0.2s ease;
            " 
            onmouseover="this.style.transform='scale(1.1)'"
            onmouseout="this.style.transform='scale(1)'"
            onclick="downloadImage('${img.url}', '${index + 1}')"
            title="点击下载">
                <img src="${fixedUrl}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0; color: #999; font-size: 10px;\\'>图片加载失败</div>'"
                     onload=""
                     loading="lazy">
                <div style="
                    position: absolute;
                    bottom: 1px;
                    right: 1px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 1px 3px;
                    border-radius: 2px;
                    font-size: 8px;
                ">${index + 1}</div>
                <div style="
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: rgba(220,53,69,0.8);
                    color: white;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                " 
                onmouseover="this.style.opacity='1'"
                onmouseout="this.style.opacity='0'"
                onclick="event.stopPropagation(); removeImage(${index})"
                title="删除图片">×</div>
            </div>
        `;
        }).join('');
        
        panel.innerHTML = `
            <!-- Win11风格标题栏 -->
            <div data-drag-handle="true" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background: linear-gradient(135deg, #ffe60f, #ffe60f);
                color: white;
                border-radius: 8px 8px 0 0;
                font-weight: 600;
                font-size: 14px;
                user-select: none;
                cursor: move;
            ">
                <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                    <span style="font-size: 16px;">🛍️</span>
                    <span style="color: #000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${title}">
                        ${title}
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <button onclick="this.closest('#goofish-mini-panel').style.display='none'" 
                            style="
                                width: 20px;
                                height: 20px;
                                background: rgba(255,255,255,0.2);
                                border: none;
                                border-radius: 4px;
                                color: #000;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 12px;
                                transition: background 0.2s ease;
                            "
                            onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                            onmouseout="this.style.background='rgba(255,255,255,0.2)'"
                            title="关闭">
                        ✕
                    </button>
                </div>
            </div>
            
            <div style="padding: 16px;">
                <!-- 商品信息 -->
                <div style="margin-bottom: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px; border: 1px solid rgba(0, 0, 0, 0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: 700; color: #e74c3c; font-size: 20px;">¥${price}</span>
                        <span style="color: #6c757d; font-size: 13px; font-weight: 500;">${imageInfos.length}张</span>
                    </div>
                    <div style="color: #495057; font-size: 13px; line-height: 1.5; max-height: 65px; overflow-y: auto;">
                        ${desc.substring(0, 120)}${desc.length > 120 ? '...' : ''}
                    </div>
                </div>
                
                <!-- 九宫格 -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 16px;">
                    ${imageGrid}
                </div>
                
                <!-- 按钮 -->
                <div style="display: flex; gap: 10px; margin-bottom: 16px;">
                    <button onclick="downloadAll()" style="
                        flex: 1; 
                        padding: 12px 16px; 
                        background: linear-gradient(135deg, #ffe60f, #ffe60f); 
                        color: #000; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-size: 14px; 
                        font-weight: 600;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
                    " 
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(40, 167, 69, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(40, 167, 69, 0.3)'">
                        📥 全部下载
                    </button>
                    <button onclick="copyUrls()" style="
                        flex: 1; 
                        padding: 12px 16px; 
                        background: linear-gradient(135deg, #3b3b3b, #3b3b3b); 
                        color: white; 
                        border: none; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-size: 14px; 
                        font-weight: 600;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
                    "
                    onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(108, 117, 125, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(108, 117, 125, 0.3)'">
                        📋 复制链接
                    </button>
                </div>
                
                <!-- 下载状态 -->
                <div id="downloadStatus" style="
                    display: none; 
                    margin-bottom: 12px; 
                    padding: 10px; 
                    background: linear-gradient(135deg, #d4edda, #c3e6cb); 
                    border: 1px solid #b8dacc; 
                    border-radius: 8px; 
                    font-size: 13px; 
                    color: #155724; 
                    text-align: center;
                    font-weight: 500;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                ">
                    <span id="downloadProgress">准备下载...</span>
                </div>
                
            </div>
        `;
    }
    
    
    // 下载功能 - Tampermonkey兼容版本
    window.downloadImage = async function(url, filename) {
        // 修复Mixed Content问题
        if (url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        
        try {
            // 方法1：尝试使用GM_xmlhttpRequest（Tampermonkey专用）
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        responseType: 'blob',
                        onload: function(response) {
                            try {
                                const blob = response.response;
                                const blobUrl = URL.createObjectURL(blob);
                                
                                const aTag = document.createElement('a');
                                aTag.href = blobUrl;
                                aTag.download = filename.replace(/[<>:"/\\|?*]/g, '_') + '.' + downloadSettings.format;
                                document.body.appendChild(aTag);
                                aTag.click();
                                document.body.removeChild(aTag);
                                URL.revokeObjectURL(blobUrl);
                                
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        },
                        onerror: function(error) {
                            reject(error);
                        }
                    });
                });
            }
            
            // 方法2：使用fetch API（可能被CORS阻止）
            const response = await fetch(url, {
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (!response.ok) {
                throw new Error(`请求失败: ${response.status}`);
            }
            
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const aTag = document.createElement('a');
            aTag.href = blobUrl;
            aTag.download = filename.replace(/[<>:"/\\|?*]/g, '_') + '.' + downloadSettings.format;
            document.body.appendChild(aTag);
            aTag.click();
            document.body.removeChild(aTag);
            URL.revokeObjectURL(blobUrl);
            
        } catch (error) {
            // 方法3：最后的备用方案 - 直接链接下载
            try {
                const aTag = document.createElement('a');
                aTag.href = url;
                aTag.download = filename.replace(/[<>:"/\\|?*]/g, '_') + '.' + downloadSettings.format;
                aTag.target = '_blank';
                document.body.appendChild(aTag);
                aTag.click();
                document.body.removeChild(aTag);
            } catch (fallbackError) {
                throw error;
            }
        }
    };
    
    // 高级图片下载功能 - Tampermonkey兼容版本
    window.downloadImageAdvanced = async function(url, filename) {
        // 修复Mixed Content问题
        if (url.startsWith('http://')) {
            url = url.replace('http://', 'https://');
        }
        
        // 检查是否需要格式转换
        const needsConversion = url.includes('.heic') || 
                               (url.includes('.webp') && downloadSettings.format === 'jpg') ||
                               (url.includes('.png') && downloadSettings.format === 'jpg');
        
        if (needsConversion) {
            try {
                let blob;
                
                // 使用GM_xmlhttpRequest获取图片（Tampermonkey专用）
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    blob = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url,
                            responseType: 'blob',
                            onload: function(response) {
                                resolve(response.response);
                            },
                            onerror: function(error) {
                                reject(error);
                            }
                        });
                    });
                } else {
                    // 使用fetch API
                    const response = await fetch(url, {
                        mode: 'cors',
                        credentials: 'omit'
                    });
                    if (!response.ok) {
                        throw new Error(`请求失败: ${response.status}`);
                    }
                    blob = await response.blob();
                }
                
                // 创建图片元素进行格式转换
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                return new Promise((resolve, reject) => {
                    img.onload = function() {
                        try {
                            // 创建Canvas进行格式转换
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            
                            canvas.width = img.width;
                            canvas.height = img.height;
                            
                            // 绘制图片到Canvas
                            ctx.drawImage(img, 0, 0);
                            
                            // 根据设置选择输出格式
                            const mimeType = downloadSettings.format === 'jpg' ? 'image/jpeg' :
                                           downloadSettings.format === 'png' ? 'image/png' : 'image/webp';
                            const quality = downloadSettings.format === 'jpg' ? 0.9 : 1.0;
                            
                            canvas.toBlob(function(convertedBlob) {
                                if (convertedBlob) {
                                    try {
                                        // 使用转换后的blob下载
                                        const downloadUrl = URL.createObjectURL(convertedBlob);
                                        const aTag = document.createElement('a');
                                        aTag.href = downloadUrl;
                                        aTag.download = filename.replace(/[<>:"/\\|?*]/g, '_') + '.' + downloadSettings.format;
                                        document.body.appendChild(aTag);
                                        aTag.click();
                                        document.body.removeChild(aTag);
                                        URL.revokeObjectURL(downloadUrl);
                                        resolve();
                                    } catch (error) {
                                        reject(error);
                                    }
                                } else {
                                    downloadImage(url, filename).then(resolve).catch(reject);
                                }
                            }, mimeType, quality);
                            
                        } catch (error) {
                            downloadImage(url, filename).then(resolve).catch(reject);
                        }
                    };
                    
                    img.onerror = function() {
                        downloadImage(url, filename).then(resolve).catch(reject);
                    };
                    
                    img.src = URL.createObjectURL(blob);
                });
                
            } catch (error) {
                await downloadImage(url, filename);
            }
        } else {
            // 直接下载
            await downloadImage(url, filename);
        }
    };
    
    window.downloadAll = async function() {
        if (!imageInfos || imageInfos.length === 0) {
            alert('❌ 没有可下载的图片！');
            return;
        }
        
        const total = imageInfos.length;
        let completed = 0;
        
        // 显示下载进度
        const showProgress = () => {
            // 更新面板中的进度显示
            const statusDiv = document.getElementById('downloadStatus');
            const progressSpan = document.getElementById('downloadProgress');
            
            if (statusDiv && progressSpan) {
                statusDiv.style.display = 'block';
                progressSpan.textContent = `下载进度: ${completed}/${total}`;
                
                if (completed === total) {
                    statusDiv.style.background = '#d1ecf1';
                    statusDiv.style.borderColor = '#bee5eb';
                    statusDiv.style.color = '#0c5460';
                    progressSpan.textContent = `✅ 下载完成！共 ${total} 张图片`;
                    
                    // 3秒后隐藏状态
                    setTimeout(() => {
                        statusDiv.style.display = 'none';
                    }, 3000);
                }
            }
        };
        
        // 显示初始状态
        showProgress();
        
        // 顺序下载图片（完全使用1.html方案）
        for (let i = 0; i < imageInfos.length; i++) {
            try {
                const img = imageInfos[i];
                const filename = `${i + 1}`; // 使用数字序号
                
                // 使用1.html的下载方案
                await downloadImage(img.url, filename);
                
                completed++;
                showProgress();
                
                // 延迟避免浏览器限制
                if (i < imageInfos.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
            } catch (error) {
                completed++;
                showProgress();
            }
        }
    };
    
    window.copyUrls = function() {
        const urls = imageInfos.map(img => img.url).join('\n');
        navigator.clipboard.writeText(urls).then(() => {
            alert('图片链接已复制！');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = urls;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('图片链接已复制！');
        });
    };
    
    // 删除图片功能
    window.removeImage = function(index) {
        if (imageInfos && imageInfos.length > index) {
            imageInfos.splice(index, 1)[0];
            
            // 更新面板显示
            updatePanel();
        }
    };
    
    
    // 拦截请求 - 简化版（参考test.js）
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        
        xhr.open = function(method, url, async, user, password) {
            this._method = method;
            this._url = url;
            return originalOpen.apply(this, arguments);
        };
        
        xhr.send = function(data) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 200 && this._url.includes('/h5/mtop.taobao.idle.pc.detai')) {
                    try {
                        const jsonData = JSON.parse(this.responseText);
                        if (jsonData?.data?.itemDO?.imageInfos) {
                            itemData = jsonData.data.itemDO;
                            imageInfos = itemData.imageInfos;
                            
                            if (!panel) createMiniPanel();
                            updatePanel();
                        }
                    } catch (e) {
                        // 解析失败，静默处理
                    }
                }
            });
            return originalSend.apply(this, arguments);
        };
        return xhr;
    };
    
   

    // 自动创建面板（不依赖测试按钮）
    function autoCreatePanel() {
        if (document.body && !panel) {
            createMiniPanel();
            
            // 如果5秒后还没有数据，使用测试数据
            setTimeout(() => {
                if (!itemData || !imageInfos.length) {
                    itemData = {
                        title: '等待获取商品数据...',
                        soldPrice: '--',
                        desc: '正在拦截API请求，请稍候...'
                    };
                    imageInfos = [];
                    updatePanel();
                }
            }, 5000);
        }
    }
    
    // 页面加载完成后自动创建面板
    setTimeout(autoCreatePanel, 1000);
    

    
    // Mixed Content检测和修复功能（内部使用）
    function fixMixedContent(url) {
        if (!url) return url;
        
        // 检测Mixed Content问题
        const isHttpsPage = window.location.protocol === 'https:';
        const isHttpUrl = url.startsWith('http://');
        
        if (isHttpsPage && isHttpUrl) {
            const httpsUrl = url.replace('http://', 'https://');
            return httpsUrl;
        }
        
        return url;
    }
    
    // 专业的开发者信息和功能说明
    console.log('%c🛍️ Goofish闲鱼商品图片自动下载器 v1.1', 'color: #0078d4; font-size: 16px; font-weight: bold;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #0078d4;');
    console.log('%c📋 功能说明:', 'color: #28a745; font-weight: bold;');
    console.log('  • 自动拦截Goofish闲鱼商品API数据');
    console.log('  • 显示商品信息（标题、价格、描述）');
    console.log('  • 九宫格图片预览和下载');
    console.log('  • 支持单张/批量下载（数字序号命名）');
    console.log('  • 图片删除功能');
    console.log('  • Win11风格拖拽面板');
    console.log('  • 自动修复Mixed Content问题');
    console.log('  • 作者Email:雷锋haoxp8@qq.com');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #0078d4;');
    console.log('%c✅ 脚本已启动，等待拦截商品数据...', 'color: #28a745; font-weight: bold;');
})();

// ==UserScript==
// @name         Xfolio图片下载与限制解除
// @namespace    https://greasyfork.org/scripts/554708
// @version      3.7
// @description  下载Xfolio网站上的图片并解除右键保存限制
// @author       Furina-Cute
// @match        https://xfolio.jp/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      xfolio.jp
// @connect      assets.xfolio.jp
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554708/Xfolio%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E4%B8%8E%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/554708/Xfolio%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E4%B8%8E%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // 解除保存限制代码 - 引用自monat151的xfolio解除保存限制脚本（https://greasyfork.org/scripts/474225）
    // =========================================================================

    // 移除图片上的 oncontextmenu 限制
    function enableImageRightClick() {
        document.querySelectorAll('img').forEach((img) => {
            img.oncontextmenu = null;
            img.removeAttribute('oncontextmenu');
            img.style.pointerEvents = 'auto';
        });
    }

    // 移除页面全局禁止右键的事件监听
    function removeGlobalContextMenuBlock() {
        document.oncontextmenu = null;
        window.oncontextmenu = null;

        // 用事件监听器移除方式（事件捕获阶段）
        document.addEventListener(
            'contextmenu',
            function (e) {
                e.stopPropagation(); // 阻止其他监听器
            },
            true
        );
    }

    // 启动解除限制处理
    function initRestrictionsRemoval() {
        removeGlobalContextMenuBlock();
        enableImageRightClick();

        // 监听页面变动（适用于懒加载或异步加载图片）
        const observer = new MutationObserver(() => {
            enableImageRightClick();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // =========================================================================
    // 图片下载功能代码
    // =========================================================================

    // 创建下载按钮
    function createDownloadButton() {
        const existingBtn = document.getElementById('xf-download-btn');
        if (existingBtn) {
            console.log('下载按钮已存在，跳过创建');
            return;
        }

        const button = document.createElement('button');
        button.id = 'xf-download-btn';

        // 根据页面类型设置按钮文本
        if (window.location.href.includes('fullscale_image')) {
            button.innerHTML = '⬇️ 下载大图';
        } else {
            button.innerHTML = '⬇️ 下载预览';
        }

        button.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 10000;
            padding: 12px 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 140px;
            text-align: center;
        `;

        button.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', handleDownload);

        // 确保body元素存在后再添加按钮
        if (document.body) {
            document.body.appendChild(button);
            console.log('下载按钮已创建并添加到页面');
        } else {
            console.error('body元素不存在，无法添加按钮');
        }

        // 检查是否有放大图片选项并显示提示
        checkZoomOption();
    }

    // 检查是否有放大图片选项
    function checkZoomOption() {
        if (window.location.href.includes('fullscale_image')) return;

        const zoomLinks = document.querySelectorAll('a[href*="fullscale_image"], .openIcon');
        if (zoomLinks.length > 0) {
            showZoomTip();
        }
    }

    // 显示放大提示
    function showZoomTip() {
        const existingTip = document.getElementById('xf-zoom-tip');
        if (existingTip) return;

        const tip = document.createElement('div');
        tip.id = 'xf-zoom-tip';
        tip.innerHTML = '💡 提示: 点击图片放大后可下载高清大图';
        tip.style.cssText = `
            position: fixed;
            left: 20px;
            bottom: 70px;
            z-index: 10000;
            padding: 10px 15px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 180px;
            text-align: center;
            line-height: 1.4;
        `;

        if (document.body) {
            document.body.appendChild(tip);

            // 5秒后淡出提示
            setTimeout(() => {
                if (tip.parentNode) {
                    tip.style.opacity = '0';
                    tip.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (tip.parentNode) {
                            tip.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    }

    // 处理下载
    async function handleDownload() {
        const previewImages = findMainPreviewImages();

        if (previewImages.length === 0) {
            showNotification('未找到可下载的图片', 'error');
            return;
        }

        // 更新按钮状态
        const button = document.getElementById('xf-download-btn');
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ 下载中...';
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';

        showNotification(`找到 ${previewImages.length} 张图片，开始下载...`, 'info');

        try {
            // 下载所有主预览图片
            for (let i = 0; i < previewImages.length; i++) {
                await downloadPreviewImage(previewImages[i], i, previewImages.length);
            }

            showNotification('下载完成！', 'success');
        } catch (error) {
            showNotification('下载过程中出现错误', 'error');
        } finally {
            // 恢复按钮状态
            button.innerHTML = originalText;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }

    // 查找主预览图片（精确匹配特定容器）
    function findMainPreviewImages() {
        const previewImages = [];

        // 首先检查是否是全屏图片页面
        if (window.location.href.includes('fullscale_image')) {
            // 全屏图片页面：查找user_asset.php图片
            const fullscreenImgs = document.querySelectorAll('img[src*="user_asset.php"]');
            fullscreenImgs.forEach(img => {
                if (img.src.includes('type=work_image') && !previewImages.some(p => p.url === img.src)) {
                    previewImages.push({
                        url: img.src,
                        element: img
                    });
                }
            });

            // 如果上面没找到，尝试找class为center的图片
            if (previewImages.length === 0) {
                const centerImgs = document.querySelectorAll('img.center');
                centerImgs.forEach(img => {
                    if (img.src && !previewImages.some(p => p.url === img.src)) {
                        previewImages.push({
                            url: img.src,
                            element: img
                        });
                    }
                });
            }

            return previewImages;
        }

        // 普通作品页面的查找逻辑
        // 方法1: 查找article--img__wrap内的图片（最精确）
        const articleImgWraps = document.querySelectorAll('.article--img__wrap');
        articleImgWraps.forEach(wrap => {
            const images = wrap.querySelectorAll('img[src*="assets.xfolio.jp"]');
            images.forEach(img => {
                if (isMainPreviewImage(img.src) && !previewImages.some(p => p.url === img.src)) {
                    previewImages.push({
                        url: img.src,
                        element: img
                    });
                }
            });
        });

        // 方法2: 查找article__wrap_img内的图片
        if (previewImages.length === 0) {
            const articleWrapImgs = document.querySelectorAll('.article__wrap_img');
            articleWrapImgs.forEach(wrap => {
                const images = wrap.querySelectorAll('img[src*="assets.xfolio.jp"]');
                images.forEach(img => {
                    if (isMainPreviewImage(img.src) && !previewImages.some(p => p.url === img.src)) {
                        previewImages.push({
                            url: img.src,
                            element: img
                        });
                    }
                });
            });
        }

        // 方法3: 查找section__inner--sp100-wrap之前的图片
        if (previewImages.length === 0) {
            const sectionWraps = document.querySelectorAll('.section__inner--sp100-wrap');
            sectionWraps.forEach(wrap => {
                // 查找前面的兄弟元素中的图片
                let prevElement = wrap.previousElementSibling;
                while (prevElement) {
                    const images = prevElement.querySelectorAll('img[src*="assets.xfolio.jp"]');
                    images.forEach(img => {
                        if (isMainPreviewImage(img.src) && !previewImages.some(p => p.url === img.src)) {
                            previewImages.push({
                                url: img.src,
                                element: img
                            });
                        }
                    });
                    prevElement = prevElement.previousElementSibling;
                }
            });
        }

        return previewImages;
    }

    // 判断是否为主预览图片
    function isMainPreviewImage(url) {
        return (url.includes('assets.xfolio.jp') || url.includes('user_asset.php')) &&
               (url.includes('/works/') || url.includes('/creator/') || url.includes('/secure/') || url.includes('type=work_image')) &&
               !url.includes('thumbnail') &&
               !url.includes('icon') &&
               !url.includes('avatar');
    }

    // 下载单张预览图片
    function downloadPreviewImage(imageInfo, index, total) {
        return new Promise((resolve) => {
            const { url, element } = imageInfo;

            // 对于user_asset.php图片，使用Canvas方式下载（因为直接请求会404）
            if (url.includes('user_asset.php')) {
                fallbackCanvasDownload(element, index, total).then(resolve);
                return;
            }

            // 尝试直接下载
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'Referer': window.location.href,
                    'User-Agent': navigator.userAgent,
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const filename = generateMainPreviewFilename(url, index);
                        downloadBlob(blob, filename);
                        showNotification(`下载进度: ${index + 1}/${total}`, 'info');
                        resolve();
                    } else {
                        // 如果直接下载失败，尝试Canvas方式
                        fallbackCanvasDownload(element, index, total).then(resolve);
                    }
                },
                onerror: function() {
                    // 如果直接下载失败，尝试Canvas方式
                    fallbackCanvasDownload(element, index, total).then(resolve);
                }
            });
        });
    }

    // Canvas方式下载备用
    function fallbackCanvasDownload(imgElement, index, total) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 设置canvas尺寸
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;

                    // 绘制图片
                    ctx.drawImage(img, 0, 0);

                    // 转换为PNG并下载
                    canvas.toBlob(function(blob) {
                        const filename = generateMainPreviewFilename(imgElement.src, index);
                        downloadBlob(blob, filename);
                        showNotification(`下载进度: ${index + 1}/${total}`, 'info');
                        resolve();
                    }, 'image/png', 0.95);
                } catch (error) {
                    console.error('Canvas下载失败:', error);
                    resolve();
                }
            };

            img.onerror = function() {
                console.error('图片加载失败');
                resolve();
            };

            img.src = imgElement.src + (imgElement.src.includes('?') ? '&' : '?') + 't=' + Date.now();
        });
    }

    // 下载Blob数据
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // 生成主预览图片文件名
    function generateMainPreviewFilename(url, index) {
        try {
            // 从URL参数中提取作品信息
            const urlObj = new URL(url);
            let workId = 'unknown';
            let creatorId = 'unknown';
            let imageId = `main_${index + 1}`;

            // 处理user_asset.php类型的URL
            if (url.includes('user_asset.php')) {
                workId = urlObj.searchParams.get('work_id') || 'unknown';
                imageId = urlObj.searchParams.get('id') || `main_${index + 1}`;
                return `xfolio_fullscreen_${workId}_${imageId}.png`;
            }

            // 处理普通assets.xfolio.jp类型的URL
            const pathParts = urlObj.pathname.split('/');
            for (let i = 0; i < pathParts.length; i++) {
                if (pathParts[i] === 'works' && i + 1 < pathParts.length) {
                    workId = pathParts[i + 1];
                }
                if (pathParts[i] === 'creator' && i + 1 < pathParts.length) {
                    creatorId = pathParts[i + 1];
                }
                if (pathParts[i] === 'works' && i + 2 < pathParts.length &&
                    !isNaN(pathParts[i + 2])) {
                    imageId = pathParts[i + 2];
                }
            }

            // 获取文件扩展名
            let extension = 'webp'; // 默认webp
            if (url.includes('.webp')) extension = 'webp';
            else if (url.includes('.jpg') || url.includes('.jpeg')) extension = 'jpg';
            else if (url.includes('.png')) extension = 'png';

            return `xfolio_main_${creatorId}_${workId}_${imageId}.${extension}`;
        } catch {
            return `xfolio_main_preview_${index + 1}_${Date.now()}.png`;
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const existingNotif = document.getElementById('xf-notification');
        if (existingNotif) {
            existingNotif.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'xf-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 300px;
            word-wrap: break-word;
        `;

        if (document.body) {
            document.body.appendChild(notification);

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100px)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 3000);
        }
    }

    // =========================================================================
    // 初始化函数
    // =========================================================================

    function init() {
        console.log('Xfolio下载脚本开始初始化');

        // 先执行解除限制代码
        initRestrictionsRemoval();

        // 创建下载按钮的函数
        const setupDownloadButton = () => {
            // 等待页面稳定后添加下载按钮
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('DOMContentLoaded 事件触发，准备创建按钮');
                    setTimeout(() => {
                        createDownloadButton();
                    }, 500);
                });
            } else {
                console.log('文档已加载完成，准备创建按钮');
                setTimeout(() => {
                    createDownloadButton();
                }, 500);
            }
        };

        // 立即设置下载按钮
        setupDownloadButton();

        // 监听URL变化（单页应用）
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                console.log('检测到URL变化，重新创建按钮');
                lastUrl = location.href;
                setTimeout(() => {
                    createDownloadButton();
                }, 1000);
            }
        });
        observer.observe(document, { subtree: true, childList: true });

        // 额外检查：如果3秒后按钮仍未创建，尝试再次创建
        setTimeout(() => {
            if (!document.getElementById('xf-download-btn')) {
                console.log('3秒后未检测到按钮，尝试重新创建');
                createDownloadButton();
            }
        }, 3000);
    }

    // 立即执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
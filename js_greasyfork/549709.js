// ==UserScript==
// @name         知乎HDR头像转SDR
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  绕过跨域限制检测HDR头像
// @author       YourName
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @license      gpl
// @downloadURL https://update.greasyfork.org/scripts/549709/%E7%9F%A5%E4%B9%8EHDR%E5%A4%B4%E5%83%8F%E8%BD%ACSDR.user.js
// @updateURL https://update.greasyfork.org/scripts/549709/%E7%9F%A5%E4%B9%8EHDR%E5%A4%B4%E5%83%8F%E8%BD%ACSDR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // HDR检测策略配置
    const HDR_DETECTION = {
        // 策略1: 文件大小检测（HDR图片通常更大）
        sizeThreshold: 50000, // 50KB以上可能是HDR

        // 策略2: URL特征检测
        hdrUrlPatterns: [
            /needBackground=1/, // 知乎HDR头像常有这个参数
            /_xl\.jpg/,         // 超大尺寸头像
            /source=.*&amp;needBackground=1/, // HTML实体编码版本
        ],

        // 策略3: 已知HDR头像特征库
        knownHDRSignatures: new Set([
            'v2-218a7394ec8bb6f3ab194807227ae937', // 示例HDR头像ID
            // 可以继续添加发现的HDR头像ID
        ]),

        // SDR转换参数
        sdrFilter: 'brightness(0.6) contrast(0.8) saturate(0.9)',
        transition: 'filter 0.3s ease'
    };

    // 检测方法1: URL特征检测
    function checkUrlFeatures(img) {
        const src = img.src || img.getAttribute('src') || '';

        // 检查URL模式
        for (let pattern of HDR_DETECTION.hdrUrlPatterns) {
            if (pattern.test(src)) {
                console.log('✓ URL特征匹配HDR:', pattern.toString());
                return true;
            }
        }

        // 检查已知HDR签名
        for (let signature of HDR_DETECTION.knownHDRSignatures) {
            if (src.includes(signature)) {
                console.log('✓ 已知HDR签名匹配:', signature);
                return true;
            }
        }

        return false;
    }

    // 检测方法2: 文件大小检测
    function checkFileSize(img) {
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', img.src, true);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    const contentLength = xhr.getResponseHeader('Content-Length');
                    if (contentLength) {
                        const size = parseInt(contentLength);
                        const isLargeFile = size > HDR_DETECTION.sizeThreshold;
                        console.log(`文件大小: ${(size/1024).toFixed(1)}KB, HDR可能性: ${isLargeFile}`);
                        resolve(isLargeFile);
                    } else {
                        resolve(false);
                    }
                }
            };

            xhr.onerror = () => resolve(false);
            xhr.send();
        });
    }

    // 检测方法3: DOM属性分析
    function checkDOMAttributes(img) {
        // 检查srcset（HDR图片可能有2x标记）
        const srcset = img.getAttribute('srcset') || '';
        if (srcset.includes('2x') && srcset.includes('needBackground=1')) {
            console.log('✓ srcset特征匹配HDR');
            return true;
        }

        // 检查alt文本（某些HDR头像可能有特殊标记）
        const alt = img.alt || '';

        // 检查父元素类名
        const parent = img.parentElement;
        if (parent && parent.className.includes('AuthorInfo')) {
            // 在回答区域的头像，更可能是HDR
            return checkUrlFeatures(img);
        }

        return false;
    }

    // 检测方法4: 视觉启发式（不使用Canvas）
    function checkVisualHeuristics(img) {
        // 创建临时的隐藏img元素测试
        const testImg = document.createElement('img');
        testImg.style.position = 'absolute';
        testImg.style.left = '-9999px';
        testImg.style.width = '32px';
        testImg.style.height = '32px';
        testImg.style.filter = 'brightness(2) contrast(2)'; // 极端滤镜
        testImg.src = img.src;

        document.body.appendChild(testImg);

        setTimeout(() => {
            // 检查极端滤镜下是否仍然可见细节
            // HDR图片即使过度处理也能保持细节
            document.body.removeChild(testImg);
        }, 1000);

        return false; // 这个方法比较复杂，暂时返回false
    }

    // 综合HDR检测
    async function detectHDR(img) {
        const detectionResults = [];

        // 方法1: URL特征（最快最可靠）
        const urlResult = checkUrlFeatures(img);
        detectionResults.push(urlResult);

        // 方法2: DOM属性
        const domResult = checkDOMAttributes(img);
        detectionResults.push(domResult);

        // 方法3: 文件大小（可选，比较慢）
        if (!urlResult && !domResult) {
            try {
                const sizeResult = await checkFileSize(img);
                detectionResults.push(sizeResult);
            } catch (e) {
                detectionResults.push(false);
            }
        }

        // 综合判断：任一方法检测为HDR即认为是HDR
        const isHDR = detectionResults.some(result => result === true);

        console.log(`HDR检测结果: ${detectionResults} -> ${isHDR ? 'HDR' : 'SDR'}`);
        return isHDR;
    }

    // 应用SDR转换
    function applySDRConversion(img) {
        if (img.dataset.sdrApplied) return;

        img.style.filter = HDR_DETECTION.sdrFilter;
        img.style.transition = HDR_DETECTION.transition;
        img.dataset.sdrApplied = 'true';

        // 添加视觉标识（调试用）
        img.style.boxShadow = '0 0 0 2px rgba(0, 255, 0, 0.5)';
        img.title = `${img.title || img.alt || ''} [HDR→SDR已转换]`;

        console.log('🎯 HDR头像已转换为SDR:', img.src);
    }

    // 处理单个图像
    async function processImage(img) {
        if (img.dataset.processed) return;
        img.dataset.processed = 'true';

        try {
            // 只处理头像尺寸的图片
            if (img.naturalWidth < 32 || img.naturalWidth > 300) return;

            const isHDR = await detectHDR(img);

            if (isHDR) {
                applySDRConversion(img);
            }

        } catch (error) {
            console.log('处理图像出错:', error);
        }
    }

    // 查找所有头像
    function processAllAvatars() {
        const selectors = [
            'img.AuthorInfo-avatar',
            'img.Avatar',
            '.UserAvatar img',
            '.ProfileHeader-avatar img',
            'img[class*="avatar" i]',
            'img[src*="zhimg.com"]', // 所有知乎图片
                    // 新增选择器匹配你遇到的结构
        'img.Avatar.AuthorInfo-avatar.css-1hx3fyn',  // 完整类名
        '.AuthorInfo-avatarWrapper img',              // 通过父容器
        '.UserLink-link img',                         // 通过链接容器
        'img[src*="zhimg.com"][srcset*="2x"]',       // 有2x标记的知乎图片

        ];

        let count = 0;
        selectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(img => {
                    // 过滤头像尺寸
                    if (img.width >= 32 && img.width <= 300) {
                        processImage(img);
                        count++;
                    }
                });
            } catch (e) {
                console.log('选择器错误:', selector);
            }
        });

        console.log(`📊 处理了 ${count} 个头像`);
    }

    // 添加新HDR特征到检测库
    function addHDRSignature(signature) {
        HDR_DETECTION.knownHDRSignatures.add(signature);
        console.log('新增HDR特征:', signature);
    }

    // 手动标记HDR头像
    function markAsHDR(imgElement) {
        applySDRConversion(imgElement);

        // 提取特征码添加到库
        const src = imgElement.src;
        const match = src.match(/v2-([a-f0-9]+)/);
        if (match) {
            addHDRSignature(match[0]);
        }
    }

    // 初始化
    function init() {
        console.log('🚀 知乎HDR转SDR脚本启动（无跨域版）');

        // 延迟初始处理
        setTimeout(processAllAvatars, 2000);

        // 监听页面变化
        const observer = new MutationObserver((mutations) => {
            let hasNewImages = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 &&
                        (node.tagName === 'IMG' || node.querySelector('img'))) {
                        hasNewImages = true;
                    }
                });
            });

            if (hasNewImages) {
                setTimeout(processAllAvatars, 500);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 全局调试方法
        window.zhihuHDRTool = {
            processAll: processAllAvatars,
            markAsHDR: markAsHDR,
            addSignature: addHDRSignature,
            config: HDR_DETECTION
        };

        console.log('💡 调试方法: window.zhihuHDRTool');
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

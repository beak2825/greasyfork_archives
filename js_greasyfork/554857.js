// ==UserScript==
// @name         蓝湖产品页面截图工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       DamnCrab
// @description  蓝湖产品页面截图工具，方便给AI
// @match        https://axure-file.lanhuapp.com/*
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554857/%E8%93%9D%E6%B9%96%E4%BA%A7%E5%93%81%E9%A1%B5%E9%9D%A2%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554857/%E8%93%9D%E6%B9%96%E4%BA%A7%E5%93%81%E9%A1%B5%E9%9D%A2%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        maxRetries: 3,
        retryIntervals: [2000, 3000, 4000],
        initialDelay: 3000
    };

    // 日志工具
    const logger = {
        log: (message) => console.log('🎯 [蓝湖iframe截图]', message),
        warn: (message) => console.warn('⚠️ [蓝湖iframe截图]', message),
        error: (message) => console.error('❌ [蓝湖iframe截图]', message),
        success: (message) => console.log('✅ [蓝湖iframe截图]', message)
    };

    // 等待函数
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 验证内容是否非空白
    function verifyContent(canvas) {
        if (!canvas) return false;

        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        const width = canvas.width;
        const height = canvas.height;

        // 检查多个位置的像素
        const checkPoints = [
            { x: Math.floor(width * 0.1), y: Math.floor(height * 0.1) },
            { x: Math.floor(width * 0.5), y: Math.floor(height * 0.1) },
            { x: Math.floor(width * 0.1), y: Math.floor(height * 0.5) },
            { x: Math.floor(width * 0.5), y: Math.floor(height * 0.5) },
            { x: Math.floor(width * 0.9), y: Math.floor(height * 0.9) }
        ];

        let hasContent = false;
        let nonWhitePixels = 0;

        for (const point of checkPoints) {
            try {
                const imageData = ctx.getImageData(point.x, point.y, 1, 1);
                const [r, g, b] = imageData.data;

                // 检查是否不是纯白色
                if (r !== 255 || g !== 255 || b !== 255) {
                    nonWhitePixels++;
                    hasContent = true;
                    logger.log(`检测到内容像素 at (${point.x}, ${point.y}): RGB(${r}, ${g}, ${b})`);
                }
            } catch (e) {
                logger.warn(`无法检查像素 (${point.x}, ${point.y}): ${e.message}`);
            }
        }

        logger.log(`内容验证结果: ${nonWhitePixels}/${checkPoints.length} 个位置检测到非白色像素`);
        return hasContent;
    }

    // 截图函数
    async function takeScreenshot() {
        logger.log('开始截图过程...');

        // 等待初始加载
        logger.log(`等待初始加载 ${CONFIG.initialDelay}ms...`);
        await sleep(CONFIG.initialDelay);

        // 尝试多次截图
        for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
            try {
                logger.log(`尝试截图 ${attempt}/${CONFIG.maxRetries}...`);

                if (attempt > 1) {
                    const waitTime = CONFIG.retryIntervals[attempt - 2];
                    logger.log(`等待 ${waitTime}ms 后重试...`);
                    await sleep(waitTime);
                }

                // 使用html2canvas截图整个文档
                const canvas = await html2canvas(document.body, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                logger.log(`Canvas创建成功: ${canvas.width}x${canvas.height}`);

                // 验证内容
                if (verifyContent(canvas)) {
                    // 转换为数据URL
                    const dataURL = canvas.toDataURL('image/png');

                    if (dataURL && dataURL !== 'data:,') {
                        logger.success('截图成功！');

                        // 下载图片
                        const link = document.createElement('a');
                        link.download = `lanhu-iframe-screenshot-${Date.now()}.png`;
                        link.href = dataURL;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        logger.success('图片已下载');
                        return true;
                    } else {
                        throw new Error('Canvas数据URL无效');
                    }
                } else {
                    throw new Error('Canvas内容验证失败 - 检测到纯白色截图');
                }

            } catch (error) {
                logger.error(`截图尝试 ${attempt} 失败: ${error.message}`);

                if (attempt === CONFIG.maxRetries) {
                    logger.error('所有截图尝试都失败了');
                    return false;
                }
            }
        }

        return false;
    }

    // 初始化脚本
    function initializeScript() {
        logger.log('蓝湖截图工具已就绪');
        logger.log('请点击油猴插件菜单中的 [📸 立即截图] 按钮开始截图');

        // 注册菜单命令
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('📸 立即截图', takeScreenshot);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();
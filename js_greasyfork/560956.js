// ==UserScript==
// @name         超星学习通课件下载
// @namespace    https://Linux.do
// @version      1.0.0
// @description  一键下载超星学习通课件原文件（PPT/PDF/Word等）
// @author       derder在怀里
// @match        *://*.chaoxing.com/*
// @match        *://pan-yz.chaoxing.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560956/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560956/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        DEBUG: false,              // 是否显示调试日志
        SCAN_DELAY: 2000,         // 首次扫描延迟（毫秒）
        SCAN_INTERVAL: 1500,      // 扫描间隔（毫秒）
        MAX_SCAN_ATTEMPTS: 10,    // 最大扫描次数
        MAX_IFRAME_DEPTH: 5       // 最大iframe搜索深度
    };

    // ==================== 工具函数 ====================
    const log = (...args) => CONFIG.DEBUG && console.log('[课件下载]', ...args);

    /**
     * 格式化文件大小
     * @param {number|string} bytes - 字节数
     * @returns {string} 格式化后的大小
     */
    function formatFileSize(bytes) {
        if (!bytes) return '';
        bytes = parseInt(bytes);
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    }

    /**
     * 从URL中提取文件名
     * @param {string} url - 下载链接
     * @returns {string} 文件名
     */
    function extractFilename(url) {
        try {
            const path = url.split('?')[0];
            const encoded = path.split('/').pop();
            return decodeURIComponent(encoded);
        } catch (e) {
            return '未知文件';
        }
    }

    // ==================== 页面检测 ====================
    /**
     * 检测当前页面是否为课程相关页面
     * @returns {boolean}
     */
    function isCourseRelatedPage() {
        const url = window.location.href;
        const patterns = [
            '/mycourse/studentstudy',
            '/mooc-ans/knowledge/cards',
            'pan-yz.chaoxing.com/screen/file_'
        ];
        return patterns.some(pattern => url.includes(pattern));
    }

    // ==================== 核心功能：查找文件信息 ====================
    /**
     * 递归搜索iframe中的fileinfo对象
     * @param {Document} doc - 要搜索的文档
     * @param {number} depth - 当前搜索深度
     * @returns {Object|null} 文件信息对象
     */
    function findFileInfo(doc = document, depth = 0) {
        if (depth > CONFIG.MAX_IFRAME_DEPTH) return null;

        // 检查当前文档的window对象
        try {
            const win = doc.defaultView || window;
            if (win.fileinfo && win.fileinfo.download) {
                log('找到fileinfo (depth=' + depth + '):', win.fileinfo);
                return win.fileinfo;
            }
        } catch (e) {
            log('访问window失败:', e.message);
        }

        // 递归搜索所有iframe
        const iframes = doc.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeWin = iframe.contentWindow;
                const iframeDoc = iframe.contentDocument || iframeWin?.document;

                // 检查iframe的window
                if (iframeWin?.fileinfo?.download) {
                    log('在iframe中找到fileinfo:', iframeWin.fileinfo);
                    return iframeWin.fileinfo;
                }

                // 递归搜索iframe内部
                if (iframeDoc) {
                    const result = findFileInfo(iframeDoc, depth + 1);
                    if (result) return result;
                }
            } catch (e) {
                // 跨域iframe无法访问，静默忽略
            }
        }

        return null;
    }

    // ==================== UI：创建下载按钮 ====================
    /**
     * 创建并显示下载按钮
     * @param {Object} fileInfo - 文件信息对象
     */
    function createDownloadButton(fileInfo) {
        // 移除已有按钮
        document.querySelector('#chaoxing-download-btn')?.remove();

        // 提取文件信息
        const filename = fileInfo.filename || extractFilename(fileInfo.download);
        const size = formatFileSize(fileInfo.filesize);
        const suffix = fileInfo.suffix?.toUpperCase() || '';

        // 创建按钮
        const btn = document.createElement('button');
        btn.id = 'chaoxing-download-btn';
        btn.textContent = `📥 下载 ${suffix}${size ? ' (' + size + ')' : ''}`;
        btn.title = `点击下载: ${filename}`;

        // 按钮样式
        Object.assign(btn.style, {
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: '2147483647',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.5)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transition: 'all 0.3s ease'
        });

        // 悬停效果
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.5)';
        });

        // 点击下载
        btn.addEventListener('click', () => {
            log('开始下载:', fileInfo.download);
            window.open(fileInfo.download, '_blank');
        });

        document.body.appendChild(btn);
        log('下载按钮已创建:', filename);
    }

    // ==================== 扫描逻辑 ====================
    /**
     * 执行一次扫描
     * @returns {boolean} 是否找到文件信息
     */
    function scan() {
        const fileInfo = findFileInfo();
        if (fileInfo) {
            createDownloadButton(fileInfo);
            return true;
        }
        return false;
    }

    /**
     * 启动扫描流程
     */
    function startScanning() {
        let attempts = 0;

        const tryScanning = () => {
            attempts++;
            log(`扫描尝试 ${attempts}/${CONFIG.MAX_SCAN_ATTEMPTS}`);

            if (scan()) {
                log('扫描成功，找到下载链接');
                return;
            }

            if (attempts < CONFIG.MAX_SCAN_ATTEMPTS) {
                setTimeout(tryScanning, CONFIG.SCAN_INTERVAL);
            } else {
                log('扫描完成，未找到下载链接');
            }
        };

        setTimeout(tryScanning, CONFIG.SCAN_DELAY);
    }

    // ==================== 主入口 ====================
    function main() {
        if (!isCourseRelatedPage()) {
            log('非课程页面，脚本不运行');
            return;
        }

        log('检测到课程页面，启动扫描...');
        startScanning();
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();

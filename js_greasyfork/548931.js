// ==UserScript==
// @name         小红书视频链接提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动提取小红书页面中的视频链接，支持.mp4格式
// @author       Trustwin
// @match        *://www.xiaohongshu.com/*
// @match        *://xhslink.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @license      All rights reserved
// @license      Do not copy or modify without permission
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/548931/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548931/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        videoFormats: ['.mp4', '.m3u8', '.ts'],
        checkInterval: 2000, // 检查间隔(毫秒)
        maxVideoLinks: 20,   // 最大保存链接数量
        autoDetect: true     // 是否自动检测
    };

    // 存储视频链接
    let videoLinks = GM_getValue('videoLinks', []);
    let isMonitoring = false;

    // 创建UI界面
    function createUI() {
        // 移除已存在的UI
        $('#xhs-video-extractor').remove();

        const uiHTML = `
            <div id="xhs-video-extractor" style="
                position: fixed;
                top: 100px;
                right: 20px;
                width: 350px;
                background: white;
                border: 2px solid #ff2741;
                border-radius: 10px;
                padding: 15px;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-height: 500px;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #ff2741; font-size: 16px;">
                        📹 小红书视频提取器
                    </h3>
                    <button id="xhs-close-btn" style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #999;
                    ">×</button>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="xhs-auto-detect" ${CONFIG.autoDetect ? 'checked' : ''}>
                        自动检测视频链接
                    </label>
                </div>

                <div id="xhs-controls" style="margin-bottom: 15px;">
                    <button id="xhs-start-btn" style="
                        background: #ff2741;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin-right: 8px;
                        font-size: 14px;
                    ">开始监控</button>
                    <button id="xhs-clear-btn" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">清空记录</button>
                </div>

                <div id="xhs-video-list" style="
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                ">
                    ${videoLinks.length > 0 ?
                        videoLinks.map((link, index) => `
                            <div style="
                                margin-bottom: 10px;
                                padding: 10px;
                                background: #f8f9fa;
                                border-radius: 6px;
                                border-left: 3px solid #ff2741;
                            ">
                                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                                    视频 ${index + 1}
                                </div>
                                <div style="
                                    font-size: 12px;
                                    word-break: break-all;
                                    margin-bottom: 8px;
                                    color: #333;
                                ">${link}</div>
                                <button onclick="copyToClipboard('${link}')" style="
                                    background: #28a745;
                                    color: white;
                                    border: none;
                                    padding: 4px 8px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                ">复制链接</button>
                            </div>
                        `).join('') :
                        '<div style="text-align: center; color: #999; padding: 20px;">暂无视频链接</div>'
                    }
                </div>

                <div id="xhs-status" style="
                    margin-top: 15px;
                    padding: 10px;
                    background: #e9ecef;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #495057;
                    text-align: center;
                ">
                    ${isMonitoring ? '🟢 监控中...' : '⏸️ 监控已停止'}
                </div>
            </div>
        `;

        $('body').append(uiHTML);

        // 添加事件监听
        $('#xhs-close-btn').click(() => {
            $('#xhs-video-extractor').remove();
        });

        $('#xhs-start-btn').click(toggleMonitoring);
        $('#xhs-clear-btn').click(clearVideoLinks);
        $('#xhs-auto-detect').change((e) => {
            CONFIG.autoDetect = e.target.checked;
        });

        // 添加复制功能到全局
        unsafeWindow.copyToClipboard = function(text) {
            navigator.clipboard.writeText(text).then(() => {
                GM_notification({
                    text: '链接已复制到剪贴板',
                    title: '小红书视频提取器',
                    timeout: 2000
                });
            });
        };
    }

    // 切换监控状态
    function toggleMonitoring() {
        isMonitoring = !isMonitoring;
        updateStatus();

        if (isMonitoring) {
            startMonitoring();
            $('#xhs-start-btn').text('停止监控').css('background', '#dc3545');
        } else {
            $('#xhs-start-btn').text('开始监控').css('background', '#ff2741');
        }
    }

    // 更新状态显示
    function updateStatus() {
        $('#xhs-status').text(isMonitoring ? '🟢 监控中...' : '⏸️ 监控已停止');
    }

    // 清空视频链接
    function clearVideoLinks() {
        videoLinks = [];
        GM_setValue('videoLinks', videoLinks);
        refreshVideoList();
        GM_notification({
            text: '已清空所有视频链接',
            title: '小红书视频提取器',
            timeout: 2000
        });
    }

    // 刷新视频列表显示
    function refreshVideoList() {
        $('#xhs-video-list').html(
            videoLinks.length > 0 ?
            videoLinks.map((link, index) => `
                <div style="
                    margin-bottom: 10px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    border-left: 3px solid #ff2741;
                ">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                        视频 ${index + 1}
                    </div>
                    <div style="
                        font-size: 12px;
                        word-break: break-all;
                        margin-bottom: 8px;
                        color: #333;
                    ">${link}</div>
                    <button onclick="copyToClipboard('${link}')" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">复制链接</button>
                </div>
            `).join('') :
            '<div style="text-align: center; color: #999; padding: 20px;">暂无视频链接</div>'
        );
    }

    // 开始监控网络请求
    function startMonitoring() {
        if (!isMonitoring) return;

        // 重写XMLHttpRequest来监控请求
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            if (this._url && isVideoUrl(this._url)) {
                addVideoLink(this._url);
            }
            return originalSend.apply(this, arguments);
        };

        // 重写fetch来监控请求
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;
            if (url && isVideoUrl(url)) {
                addVideoLink(url);
            }
            return originalFetch.apply(this, arguments);
        };

        // 定期检查页面中的视频元素
        setInterval(() => {
            if (CONFIG.autoDetect) {
                detectVideoElements();
            }
        }, CONFIG.checkInterval);
    }

    // 检测页面中的视频元素
    function detectVideoElements() {
        // 查找video标签
        $('video').each(function() {
            const src = $(this).attr('src');
            if (src && isVideoUrl(src)) {
                addVideoLink(src);
            }
        });

        // 查找包含视频链接的meta标签
        $('meta[content*=".mp4"], meta[content*=".m3u8"]').each(function() {
            const content = $(this).attr('content');
            if (content && isVideoUrl(content)) {
                addVideoLink(content);
            }
        });
    }

    // 判断是否为视频URL
    function isVideoUrl(url) {
        return CONFIG.videoFormats.some(format =>
            url.includes(format) &&
            !url.includes('placeholder') &&
            !url.includes('preview')
        );
    }

    // 添加视频链接
    function addVideoLink(url) {
        // 去重处理
        if (!videoLinks.includes(url)) {
            videoLinks.unshift(url);

            // 限制最大数量
            if (videoLinks.length > CONFIG.maxVideoLinks) {
                videoLinks = videoLinks.slice(0, CONFIG.maxVideoLinks);
            }

            GM_setValue('videoLinks', videoLinks);
            refreshVideoList();

            // 显示通知
            GM_notification({
                text: `发现新的视频链接\n${url.substring(0, 50)}...`,
                title: '小红书视频提取器',
                timeout: 3000,
                onclick: () => {
                    // 点击通知时聚焦到UI
                    $('#xhs-video-extractor').css({
                        'z-index': '10000',
                        'box-shadow': '0 4px 30px rgba(255, 39, 65, 0.3)'
                    });
                }
            });
        }
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }

        // 添加键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+V 打开/关闭提取器
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                if ($('#xhs-video-extractor').length) {
                    $('#xhs-video-extractor').remove();
                } else {
                    createUI();
                }
            }
        });

        // 注册菜单命令
        GM_registerMenuCommand('打开视频提取器', createUI);
        GM_registerMenuCommand('开始监控', () => {
            if (!isMonitoring) toggleMonitoring();
        });
        GM_registerMenuCommand('停止监控', () => {
            if (isMonitoring) toggleMonitoring();
        });

        console.log('小红书视频提取器已加载');
    }

    // 启动初始化
    init();

})();

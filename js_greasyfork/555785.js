// ==UserScript==
// @name         App Store 截图下载器
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  一键下载 App Store 应用截图
// @author       MagicKong
// @match        https://apps.apple.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      is1-ssl.mzstatic.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555785/App%20Store%20%E6%88%AA%E5%9B%BE%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555785/App%20Store%20%E6%88%AA%E5%9B%BE%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        // 移除已存在的按钮
        var oldButton = document.getElementById('appStoreDownloaderBtn');
        if (oldButton) oldButton.remove();

        var button = document.createElement('button');
        button.id = 'appStoreDownloaderBtn';
        button.innerHTML = '📸 下载截图';
        button.style.cssText = [
            'position: fixed;',
            'top: 100px;',
            'right: 20px;',
            'z-index: 10000;',
            'padding: 12px 16px;',
            'background: #007AFF;',
            'color: white;',
            'border: none;',
            'border-radius: 8px;',
            'font-size: 14px;',
            'font-weight: bold;',
            'cursor: pointer;',
            'box-shadow: 0 2px 10px rgba(0,0,0,0.2);',
            'transition: all 0.3s ease;',
            'font-family: system-ui;'
        ].join(' ');

        button.addEventListener('mouseenter', function() {
            button.style.background = '#0056CC';
            button.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            button.style.background = '#007AFF';
            button.style.transform = 'translateY(0)';
        });

        button.addEventListener('click', startDownloadProcess);

        document.body.appendChild(button);
    }

    // 提取应用名称
    function getAppName() {
        var title = document.title;
        console.log('原始标题:', title);

        // 多种清理方法
        var appName = title;

        // 方法1: 移除常见的后缀
        appName = appName.replace(/\s*[•\-]\s*App\s*Store$/i, '');
        appName = appName.replace(/\s*on\s+App\s+Store$/i, '');
        appName = appName.replace(/\s*-\s*App\s*Store$/i, '');
        appName = appName.replace(/\s*App\s*Store$/i, '');
        appName = appName.replace(/\s*App$/i, '');

        // 方法2: 移除所有App Store相关文本
        appName = appName.replace(/\s*[•\-]\s*.*$/i, '');

        // 方法3: 如果还有问题，直接从URL提取
        if (appName.indexOf('App') !== -1 || appName.trim() === '') {
            var urlMatch = window.location.href.match(/\/app\/([^\/]+)/);
            if (urlMatch && urlMatch[1]) {
                appName = decodeURIComponent(urlMatch[1]).split('-')[0];
            }
        }

        appName = appName.trim();
        console.log('清理后应用名:', appName);

        return cleanFileName(appName || 'App');
    }

    // 清理文件名
    function cleanFileName(name) {
        // 移除非法字符和多余空格
        name = name.replace(/[<>:"/\\|?*]/g, '');
        name = name.replace(/\s+/g, ' ').trim(); // 合并多个空格为单个空格
        name = name.replace(/^_+|_+$/g, ''); // 移除开头和结尾的下划线
        return name;
    }

    // 提取所有截图URL（排除Features图标）
    function extractScreenshotUrls() {
        var urls = new Set();

        // 从source标签提取
        var sourceElements = document.querySelectorAll('source[srcset]');
        Array.prototype.forEach.call(sourceElements, function(source) {
            var srcset = source.getAttribute('srcset');
            var matches = srcset.match(/https:\/\/is1-ssl\.mzstatic\.com\/image\/thumb\/[^\s]+?\/\d+x\d+bb\.webp/g);
            if (matches) {
                matches.forEach(function(url) {
                    // 排除包含Features的URL（图标图片）
                    if (url.indexOf('/Features') === -1) {
                        // 直接构建PNG格式的高清URL
                        var highResUrl = url.replace(/\/\d+x\d+bb\.webp$/, '/4000x3000bb.png');
                        urls.add(highResUrl);
                    }
                });
            }
        });

        return Array.from(urls);
    }

    // 显示下载面板
    function showDownloadPanel(urls, appName) {
        // 移除已存在的面板
        var oldPanel = document.getElementById('downloadPanel');
        if (oldPanel) oldPanel.remove();

        var panel = document.createElement('div');
        panel.id = 'downloadPanel';
        panel.style.cssText = [
            'position: fixed;',
            'top: 50%;',
            'left: 50%;',
            'transform: translate(-50%, -50%);',
            'z-index: 10001;',
            'background: white;',
            'padding: 20px;',
            'border-radius: 12px;',
            'box-shadow: 0 10px 30px rgba(0,0,0,0.3);',
            'max-width: 500px;',
            'max-height: 80vh;',
            'overflow-y: auto;',
            'font-family: system-ui;'
        ].join(' ');

        // 构建URL列表，每行分开显示
        var urlListHTML = '';
        urls.forEach(function(url, i) {
            urlListHTML += [
                '<div style="margin-bottom: 12px;">',
                '<div style="font-weight: bold; margin-bottom: 4px; color: #333;">' + (i + 1) + '.</div>',
                '<div style="word-break: break-all; background: #f8f9fa; padding: 8px; border-radius: 4px; border: 1px solid #e9ecef; user-select: text; -webkit-user-select: text; -moz-user-select: text; cursor: text;">' + url + '</div>',
                '</div>'
            ].join('');
        });

        panel.innerHTML = [
            '<h3 style="margin: 0 0 15px 0; color: #333;">截图下载</h3>',
            '<div style="margin-bottom: 15px;">',
            '<strong>应用:</strong> ' + appName + '<br>',
            '<strong>找到截图:</strong> ' + urls.length + ' 张',
            '</div>',
            '<div style="margin-bottom: 10px; font-size: 12px; color: #666;">',
            '<label>',
            '<input type="checkbox" id="downloadPng" checked>',
            '下载 PNG 格式 (推荐)',
            '</label>',
            '</div>',
            '<div style="margin-bottom: 10px; font-size: 12px; color: #888;">',
            '提示：滑动预览，确保所有图片被加载完再开始下载！',
            '</div>',
            '<div id="urlList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; font-size: 12px; user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important;">',
            urlListHTML || '<div>未找到可显示的URL</div>',
            '</div>',
            '<div style="display: flex; gap: 10px; justify-content: flex-end;">',
            '<button id="startDownload" style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 6px; cursor: pointer;">开始下载</button>',
            '<button id="cancelDownload" style="padding: 8px 16px; background: #8E8E93; color: white; border: none; border-radius: 6px; cursor: pointer;">取消</button>',
            '</div>',
            '<div id="progress" style="margin-top: 15px; display: none;">',
            '<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">',
            '<span>下载进度:</span>',
            '<span id="progressText">0/' + urls.length + '</span>',
            '</div>',
            '<div style="background: #f0f0f0; border-radius: 10px; height: 6px;">',
            '<div id="progressBar" style="background: #007AFF; height: 100%; width: 0%; border-radius: 10px; transition: width 0.3s;"></div>',
            '</div>',
            '</div>'
        ].join('');

        document.body.appendChild(panel);

        // 强制启用文本选择
        var urlList = document.getElementById('urlList');
        urlList.style.userSelect = 'text';
        urlList.style.webkitUserSelect = 'text';
        urlList.style.mozUserSelect = 'text';

        // 确保所有子元素也可选择
        var urlItems = urlList.querySelectorAll('div');
        Array.prototype.forEach.call(urlItems, function(item) {
            item.style.userSelect = 'text';
            item.style.webkitUserSelect = 'text';
            item.style.mozUserSelect = 'text';
        });

        // 事件监听
        document.getElementById('startDownload').addEventListener('click', function() {
            var downloadPng = document.getElementById('downloadPng').checked;
            startBatchDownload(urls, appName, downloadPng);
        });

        document.getElementById('cancelDownload').addEventListener('click', function() {
            panel.remove();
        });
    }

    // 开始批量下载
    function startBatchDownload(urls, appName, downloadPng) {
        var progress = document.getElementById('progress');
        var progressBar = document.getElementById('progressBar');
        var progressText = document.getElementById('progressText');
        var startBtn = document.getElementById('startDownload');
        var cancelBtn = document.getElementById('cancelDownload');

        // 显示进度条
        progress.style.display = 'block';
        startBtn.disabled = true;
        cancelBtn.textContent = '停止';

        var downloadedCount = 0;
        var stopped = false;

        // 停止下载事件
        var stopHandler = function() {
            stopped = true;
            cancelBtn.textContent = '已停止';
        };
        cancelBtn.addEventListener('click', stopHandler);

        // 创建所有下载任务的Promise数组
        var downloadPromises = urls.map(function(url, i) {
            if (stopped) return Promise.resolve(false);

            var downloadUrl = url;
            var filename = appName + ' ' + (i + 1) + '.png';

            // 如果用户取消PNG格式，使用WebP格式
            if (!downloadPng) {
                downloadUrl = downloadUrl.replace(/\/4000x3000bb\.png$/, '/4000x3000bb.webp');
                filename = appName + ' ' + (i + 1) + '.webp';
            }

            // 使用立即执行函数解决循环变量引用问题
            return (function(currentUrl, currentFilename) {
                return downloadImage(currentUrl, currentFilename).then(function(success) {
                    if (success && !stopped) {
                        downloadedCount++;
                        updateProgress(downloadedCount, urls.length, progressBar, progressText);
                    }
                    return success;
                });
            })(downloadUrl, filename);
        });

        // 等待所有下载完成
        Promise.allSettled(downloadPromises).then(function() {
            // 完成提示
            if (stopped) {
                progressText.innerHTML = '<span style="color: #FF3B30;">已停止 - 下载了 ' + downloadedCount + '/' + urls.length + ' 张</span>';
            } else {
                var formatText = downloadPng ? 'PNG格式' : 'WebP格式';
                progressText.innerHTML = '<span style="color: #34C759;">完成！下载了 ' + downloadedCount + '/' + urls.length + ' 张截图（' + formatText + '）</span>';
            }

            cancelBtn.textContent = '关闭';
            cancelBtn.removeEventListener('click', stopHandler);
            cancelBtn.addEventListener('click', function() {
                var panel = document.getElementById('downloadPanel');
                if (panel) {
                    panel.remove();
                }
            });
        });
    }

    // 下载单个图片
    function downloadImage(url, filename) {
        return new Promise(function(resolve) {
            GM_download({
                url: url,
                name: filename,
                onload: function() {
                    resolve(true);
                },
                onerror: function(error) {
                    console.error('下载失败:', error);
                    resolve(false);
                }
            });
        });
    }

    // 更新进度
    function updateProgress(current, total, progressBar, progressText) {
        var percent = (current / total) * 100;
        progressBar.style.width = percent + '%';
        progressText.textContent = current + '/' + total;
    }

    // 开始下载流程
    function startDownloadProcess() {
        var appName = getAppName();
        var urls = extractScreenshotUrls();

        if (urls.length === 0) {
            alert('未找到任何截图！请确保：\n1. 页面已完全加载\n2. 已滚动查看所有截图\n3. 当前页面是应用详情页');
            return;
        }

        showDownloadPanel(urls, appName);
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createDownloadButton);
        } else {
            createDownloadButton();
        }

        // 监听页面变化
        var lastUrl = location.href;
        new MutationObserver(function() {
            var url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(createDownloadButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 启动脚本
    init();
})();
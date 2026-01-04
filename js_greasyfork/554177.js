// ==UserScript==
// @name         网页实时网速监控
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按 Alt+N 显示/隐藏当前网页的实时上下行速度
// @author       myncdw
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554177/%E7%BD%91%E9%A1%B5%E5%AE%9E%E6%97%B6%E7%BD%91%E9%80%9F%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/554177/%E7%BD%91%E9%A1%B5%E5%AE%9E%E6%97%B6%E7%BD%91%E9%80%9F%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let monitorDiv = null;
    let isMonitoring = false;
    let lastTime = Date.now();
    let lastDownload = 0;
    let lastUpload = 0;

    // 创建显示面板
    function createMonitorPanel() {
        const div = document.createElement('div');
        div.id = 'network-speed-monitor';
        div.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff00;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            min-width: 200px;
            display: none;
        `;
        div.innerHTML = `
            <div style="margin-bottom: 8px; font-weight: bold; color: #fff; border-bottom: 1px solid #444; padding-bottom: 5px;">网速监控</div>
            <div style="margin: 5px 0;">
                <span style="color: #66ccff;">↓ 下载:</span>
                <span id="download-speed" style="margin-left: 10px; font-weight: bold;">0.00 Mbps</span>
            </div>
            <div style="margin: 5px 0;">
                <span style="color: #ff9966;">↑ 上传:</span>
                <span id="upload-speed" style="margin-left: 10px; font-weight: bold;">0.00 Mbps</span>
            </div>
            <div style="margin-top: 8px; padding-top: 5px; border-top: 1px solid #444; font-size: 11px; color: #999;">
                按 Alt+N 关闭
            </div>
        `;
        document.body.appendChild(div);
        return div;
    }

    // 格式化速度显示（仅显示 Mbps）
    function formatSpeed(bytesPerSecond) {
        const mbps = (bytesPerSecond * 8) / (1024 * 1024); // 转换为 Mbps
        return mbps.toFixed(2) + ' Mbps';
    }

    // 更新速度显示
    function updateSpeed() {
        if (!isMonitoring) return;

        const now = Date.now();
        const timeDiff = (now - lastTime) / 1000; // 转换为秒

        if (window.performance && window.performance.getEntries) {
            const entries = window.performance.getEntries();
            let totalDownload = 0;
            let totalUpload = 0;

            entries.forEach(entry => {
                if (entry.transferSize) {
                    totalDownload += entry.transferSize;
                }
                if (entry.encodedBodySize) {
                    totalUpload += entry.encodedBodySize * 0.1; // 估算上传（通常较小）
                }
            });

            const downloadSpeed = (totalDownload - lastDownload) / timeDiff;
            const uploadSpeed = (totalUpload - lastUpload) / timeDiff;

            document.getElementById('download-speed').textContent = formatSpeed(downloadSpeed);
            document.getElementById('upload-speed').textContent = formatSpeed(uploadSpeed);

            lastDownload = totalDownload;
            lastUpload = totalUpload;
        }

        lastTime = now;
    }

    // 切换监控状态
    function toggleMonitor() {
        if (!monitorDiv) {
            monitorDiv = createMonitorPanel();
        }

        isMonitoring = !isMonitoring;

        if (isMonitoring) {
            monitorDiv.style.display = 'block';
            lastTime = Date.now();
            lastDownload = 0;
            lastUpload = 0;

            // 清空性能记录以重新开始计算
            if (window.performance && window.performance.clearResourceTimings) {
                window.performance.clearResourceTimings();
            }

            // 每秒更新一次
            window.monitorInterval = setInterval(updateSpeed, 1000);
        } else {
            monitorDiv.style.display = 'none';
            if (window.monitorInterval) {
                clearInterval(window.monitorInterval);
            }
        }
    }

    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        // Alt + N
        if (e.altKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            toggleMonitor();
        }
    });

    console.log('网速监控脚本已加载，按 Alt+N 开启/关闭监控');
})();
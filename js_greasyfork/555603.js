// ==UserScript==
// @name         qBittorrent Tracker 替换工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  批量替换 qBittorrent 中的 tracker
// @author       江畔
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555603/qBittorrent%20Tracker%20%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555603/qBittorrent%20Tracker%20%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区域 ====================
    // 请在这里配置你的 qBittorrent 信息
    const QB_CONFIG = {
        host: 'http://localhost:8080',  // qBittorrent Web UI 地址
        username: 'admin',               // 用户名
        password: 'adminpass'            // 密码
    };
    // ==================================================

    let qbCookie = null;

    // 创建对话框
    function showDialog() {
        // 如果对话框已存在，先移除
        const existingDialog = document.getElementById('qb-tracker-replacer-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'qb-tracker-replacer-dialog';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999999;
            font-family: Arial, sans-serif;
        `;

        // 创建对话框容器
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            width: 500px;
            max-width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        `;

        // 添加动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        dialog.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px;">
                🔄 批量替换 Tracker
            </h2>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; color: #555; font-weight: bold;">
                    被替换的 Tracker（原 Tracker）:
                </label>
                <input type="text" id="qb-old-tracker" placeholder="例如: http://old-tracker.com:1234/announce" 
                    style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; 
                    font-size: 14px; box-sizing: border-box; transition: border-color 0.3s;">
            </div>
            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; color: #555; font-weight: bold;">
                    要替换成的 Tracker（新 Tracker）:
                </label>
                <input type="text" id="qb-new-tracker" placeholder="例如: http://new-tracker.com:1234/announce" 
                    style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; 
                    font-size: 14px; box-sizing: border-box; transition: border-color 0.3s;">
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="qb-cancel-btn" style="padding: 10px 25px; border: 2px solid #ddd; 
                    background: white; color: #666; border-radius: 6px; cursor: pointer; 
                    font-size: 14px; font-weight: bold; transition: all 0.3s;">
                    取消
                </button>
                <button id="qb-confirm-btn" style="padding: 10px 25px; border: none; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; 
                    border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;
                    transition: all 0.3s;">
                    确定
                </button>
            </div>
            <div id="qb-status" style="margin-top: 15px; padding: 10px; border-radius: 6px; 
                font-size: 13px; display: none;">
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // 输入框焦点效果
        const inputs = dialog.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.borderColor = '#667eea';
            });
            input.addEventListener('blur', function() {
                this.style.borderColor = '#ddd';
            });
        });

        // 按钮悬停效果
        const cancelBtn = document.getElementById('qb-cancel-btn');
        const confirmBtn = document.getElementById('qb-confirm-btn');

        cancelBtn.addEventListener('mouseenter', function() {
            this.style.background = '#f5f5f5';
            this.style.borderColor = '#999';
        });
        cancelBtn.addEventListener('mouseleave', function() {
            this.style.background = 'white';
            this.style.borderColor = '#ddd';
        });

        confirmBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        confirmBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // 绑定事件
        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        confirmBtn.addEventListener('click', async () => {
            const oldTracker = document.getElementById('qb-old-tracker').value.trim();
            const newTracker = document.getElementById('qb-new-tracker').value.trim();

            if (!oldTracker || !newTracker) {
                showStatus('error', '❌ 请填写完整的 Tracker 信息！');
                return;
            }

            if (oldTracker === newTracker) {
                showStatus('error', '❌ 新旧 Tracker 不能相同！');
                return;
            }

            // 禁用按钮
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.6';
            confirmBtn.style.cursor = 'not-allowed';
            confirmBtn.textContent = '处理中...';

            await replaceTrackers(oldTracker, newTracker);

            // 恢复按钮
            setTimeout(() => {
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.textContent = '确定';
            }, 2000);
        });
    }

    // 显示状态信息
    function showStatus(type, message) {
        const statusDiv = document.getElementById('qb-status');
        if (!statusDiv) return;

        statusDiv.style.display = 'block';
        statusDiv.textContent = message;

        if (type === 'success') {
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            statusDiv.style.background = '#f8d7da';
            statusDiv.style.color = '#721c24';
            statusDiv.style.border = '1px solid #f5c6cb';
        } else if (type === 'info') {
            statusDiv.style.background = '#d1ecf1';
            statusDiv.style.color = '#0c5460';
            statusDiv.style.border = '1px solid #bee5eb';
        }
    }

    // qBittorrent API: 登录
    async function qbLogin() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${QB_CONFIG.host}/api/v2/auth/login`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `username=${encodeURIComponent(QB_CONFIG.username)}&password=${encodeURIComponent(QB_CONFIG.password)}`,
                onload: function(response) {
                    if (response.status === 200 && response.responseText === 'Ok.') {
                        // 从响应头中获取 Cookie
                        const cookies = response.responseHeaders.match(/set-cookie: ([^;]+)/gi);
                        if (cookies && cookies.length > 0) {
                            qbCookie = cookies.map(c => c.replace(/set-cookie:\s*/i, '')).join('; ');
                        }
                        resolve(true);
                    } else {
                        reject(new Error('登录失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('登录请求失败: ' + error));
                }
            });
        });
    }

    // qBittorrent API: 获取所有种子
    async function qbGetTorrents() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${QB_CONFIG.host}/api/v2/torrents/info`,
                headers: {
                    'Cookie': qbCookie
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const torrents = JSON.parse(response.responseText);
                            resolve(torrents);
                        } catch (e) {
                            reject(new Error('解析种子列表失败'));
                        }
                    } else {
                        reject(new Error('获取种子列表失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('获取种子列表请求失败'));
                }
            });
        });
    }

    // qBittorrent API: 获取种子的 trackers
    async function qbGetTrackers(hash) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${QB_CONFIG.host}/api/v2/torrents/trackers?hash=${hash}`,
                headers: {
                    'Cookie': qbCookie
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const trackers = JSON.parse(response.responseText);
                            resolve(trackers);
                        } catch (e) {
                            reject(new Error('解析 trackers 失败'));
                        }
                    } else {
                        reject(new Error('获取 trackers 失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('获取 trackers 请求失败'));
                }
            });
        });
    }

    // qBittorrent API: 编辑 tracker
    async function qbEditTracker(hash, oldUrl, newUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${QB_CONFIG.host}/api/v2/torrents/editTracker`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': qbCookie
                },
                data: `hash=${hash}&origUrl=${encodeURIComponent(oldUrl)}&newUrl=${encodeURIComponent(newUrl)}`,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(true);
                    } else {
                        reject(new Error('编辑 tracker 失败'));
                    }
                },
                onerror: function(error) {
                    reject(new Error('编辑 tracker 请求失败'));
                }
            });
        });
    }

    // 主要功能: 替换 trackers
    async function replaceTrackers(oldTracker, newTracker) {
        try {
            showStatus('info', '⏳ 正在登录 qBittorrent...');

            // 登录
            await qbLogin();
            showStatus('info', '⏳ 正在获取种子列表...');

            // 获取所有种子
            const torrents = await qbGetTorrents();
            if (!torrents || torrents.length === 0) {
                showStatus('error', '❌ 没有找到任何种子！');
                return;
            }

            showStatus('info', `⏳ 找到 ${torrents.length} 个种子，正在批量获取 tracker 信息...`);

            // 一次性获取所有种子的 trackers
            const trackersPromises = torrents.map(torrent => 
                qbGetTrackers(torrent.hash)
                    .then(trackers => ({ torrent, trackers }))
                    .catch(error => {
                        console.error(`获取种子 [${torrent.name}] 的 trackers 失败:`, error);
                        return { torrent, trackers: [] };
                    })
            );

            const allTrackersData = await Promise.all(trackersPromises);
            
            showStatus('info', `⏳ 获取完成，正在筛选需要替换的种子...`);

            // 筛选出包含目标 tracker 的种子
            const torrentsToReplace = allTrackersData.filter(data => 
                data.trackers.some(t => t.url === oldTracker)
            );

            if (torrentsToReplace.length === 0) {
                showStatus('error', '❌ 没有找到匹配的 tracker，请检查输入是否正确！');
                return;
            }

            showStatus('info', `⏳ 找到 ${torrentsToReplace.length} 个种子需要替换，正在并发执行替换...`);

            // 并发批量替换 trackers
            const replacePromises = torrentsToReplace.map(({ torrent }) => 
                qbEditTracker(torrent.hash, oldTracker, newTracker)
                    .then(() => {
                        console.log(`✅ 已替换种子 [${torrent.name}] 的 tracker`);
                        return { success: true, torrent };
                    })
                    .catch(error => {
                        console.error(`❌ 替换种子 [${torrent.name}] 时出错:`, error);
                        return { success: false, torrent, error };
                    })
            );

            const results = await Promise.all(replacePromises);
            
            const successCount = results.filter(r => r.success).length;
            const errorCount = results.filter(r => !r.success).length;

            // 显示最终结果
            if (successCount > 0) {
                showStatus('success', `✅ 完成！成功替换 ${successCount} 个种子的 tracker${errorCount > 0 ? `，失败 ${errorCount} 个` : ''}`);
            } else {
                showStatus('error', `❌ 替换失败！共 ${errorCount} 个种子替换失败`);
            }

        } catch (error) {
            console.error('处理失败:', error);
            showStatus('error', `❌ 操作失败: ${error.message}`);
        }
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand('🔄 替换 qBittorrent Tracker', showDialog);

    console.log('🔄 qBittorrent Tracker 替换工具已加载');
})();

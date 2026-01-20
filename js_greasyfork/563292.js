// ==UserScript==
// @name         脚本收藏管理器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Ralph 脚本收藏 - 一键安装/更新管理
// @match        https://greasyfork.org/*
// @author       Ralph
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563292/%E8%84%9A%E6%9C%AC%E6%94%B6%E8%97%8F%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563292/%E8%84%9A%E6%9C%AC%E6%94%B6%E8%97%8F%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 脚本配置
    const CONFIG = {
        installedKey: 'installed_scripts',
        maxRetries: 3,
        retryDelay: 1000
    };
    
    // 脚本列表
    const SCRIPT_LIST = [
        //========== PT ============//
        {
            name: "auto-feed",
            url: "https://update.greasyfork.org/scripts/424132/auto_feed.user.js",
            category: "PT"
        },
        {
            name: "麒麟种审",
            url: "https://update.greasyfork.org/scripts/493232/HDKylin-Torrent-Assistant.user.js",
            category: "PT"
        },
        {
            name: "猫种审",
            url: "https://update.greasyfork.org/scripts/535084/PTerClub%20Torrent%20Checker.user.js",
            category: "PT"
        },
        {
            name: "青蛙种审",
            url: "https://update.greasyfork.org/scripts/490095/qingwa-torrent-assistant.user.js",
            category: "PT"
        },
        {
            name: "春天种审",
            url: "https://update.greasyfork.org/scripts/448012/SpringSunday-Torrent-Assistant.user.js",
            category: "PT"
        },
        {
            name: "思齐钓鱼助手",
            url: "https://update.greasyfork.org/scripts/555499/%E6%80%9D%E9%BD%90%E9%92%93%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js",
            category: "PT"
        },
        {
            name: "hhanclub自动抽奖增强版",
            url: "https://update.greasyfork.org/scripts/545932/hhanclub%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96%E5%A2%9E%E5%BC%BA%E7%89%88.user.js",
            category: "PT"
        },
        //========== 其他 ============//
        {
            name: "观众转种助手",
            url: "https://20201206.xyz:12848/tm/update/audi_tran_script",
            category: "其他"
        },
        {
            name: "115小助手",
            url: "https://update.greasyfork.org/scripts/413142/115%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js",
            category: "其他"
        }
    ];
    
    // 获取已安装脚本列表
    function getInstalledScripts() {
        return GM_getValue(CONFIG.installedKey, {});
    }
    
    // 标记脚本为已安装
    function markScriptAsInstalled(scriptName, scriptUrl) {
        const installed = getInstalledScripts();
        installed[scriptName] = {
            url: scriptUrl,
            installedAt: new Date().toISOString()
        };
        GM_setValue(CONFIG.installedKey, installed);
    }
    
    // 检查脚本是否已安装
    function isScriptInstalled(scriptName) {
        const installed = getInstalledScripts();
        return installed.hasOwnProperty(scriptName);
    }
    
    // 获取脚本的MD5（用于比较更新）
    async function getScriptMD5(scriptUrl) {
        try {
            const response = await fetch(scriptUrl, { method: 'HEAD' });
            const etag = response.headers.get('etag') || response.headers.get('last-modified');
            return etag ? btoa(etag).substring(0, 16) : null;
        } catch (error) {
            console.warn(`获取脚本MD5失败: ${scriptUrl}`, error);
            return null;
        }
    }
    
    // 打开脚本安装页面（支持重试）
    async function openScriptInstallPage(script, retryCount = 0) {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                resolve(false); // 超时
            }, 5000);
            
            const handleTabClose = (closedTabId) => {
                if (closedTabId === tab.id) {
                    clearTimeout(timer);
                    resolve(true); // 标签页被关闭，可能已安装
                }
            };
            
            const tab = GM_openInTab(script.url, {
                active: false,
                insert: true,
                setParent: true
            });
            
            // 监听标签页关闭
            if (typeof tab.onclose !== 'undefined') {
                tab.onclose = () => {
                    clearTimeout(timer);
                    resolve(true);
                };
            }
            
            // 设置超时检查
            setTimeout(() => {
                if (tab && typeof tab.close !== 'undefined') {
                    try {
                        tab.close();
                    } catch (e) {
                        // 忽略关闭错误
                    }
                }
                clearTimeout(timer);
                
                // 重试逻辑
                if (retryCount < CONFIG.maxRetries) {
                    setTimeout(() => {
                        openScriptInstallPage(script, retryCount + 1).then(resolve);
                    }, CONFIG.retryDelay);
                } else {
                    resolve(false);
                }
            }, 3000);
        });
    }
    
    // 显示通知
    function showNotification(title, message, type = 'info') {
        GM_notification({
            title: title,
            text: message,
            timeout: 5000,
            onclick: () => {
                // 点击通知时聚焦到当前标签页
                window.focus();
            }
        });
        
        // 同时在控制台输出
        GM_log(`${type.toUpperCase()}: ${title} - ${message}`);
    }
    
    // 创建UI界面
    function createUI() {
        // 创建容器
        const container = document.createElement('div');
        container.id = 'script-collection-manager';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 15px;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 300px;
            max-width: 400px;
            font-family: Arial, sans-serif;
        `;
        
        // 标题
        const title = document.createElement('h3');
        title.textContent = '📦 脚本收藏管理器';
        title.style.cssText = `
            margin: 0 0 15px 0;
            color: #333;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        `;
        container.appendChild(title);
        
        // 脚本分类展示
        const categories = {};
        SCRIPT_LIST.forEach(script => {
            if (!categories[script.category]) {
                categories[script.category] = [];
            }
            categories[script.category].push(script);
        });
        
        for (const [category, scripts] of Object.entries(categories)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.style.marginBottom = '15px';
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = `📁 ${category}`;
            categoryTitle.style.cssText = `
                margin: 0 0 8px 0;
                color: #666;
                font-size: 14px;
            `;
            categoryDiv.appendChild(categoryTitle);
            
            scripts.forEach(script => {
                const scriptDiv = document.createElement('div');
                scriptDiv.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px 8px;
                    margin: 3px 0;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 12px;
                `;
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = script.name;
                nameSpan.title = script.url;
                
                const statusSpan = document.createElement('span');
                statusSpan.style.fontSize = '10px';
                statusSpan.style.padding = '2px 6px';
                statusSpan.style.borderRadius = '3px';
                
                if (isScriptInstalled(script.name)) {
                    statusSpan.textContent = '✅ 已安装';
                    statusSpan.style.background = '#d4edda';
                    statusSpan.style.color = '#155724';
                } else {
                    statusSpan.textContent = '⏳ 待安装';
                    statusSpan.style.background = '#fff3cd';
                    statusSpan.style.color = '#856404';
                }
                
                scriptDiv.appendChild(nameSpan);
                scriptDiv.appendChild(statusSpan);
                categoryDiv.appendChild(scriptDiv);
            });
            
            container.appendChild(categoryDiv);
        }
        
        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 15px;
            border-top: 1px solid #eee;
            padding-top: 15px;
        `;
        
        // 一键安装按钮
        const installAllBtn = document.createElement('button');
        installAllBtn.textContent = '🚀 一键安装未安装脚本';
        installAllBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        `;
        installAllBtn.onmouseover = () => installAllBtn.style.background = '#45a049';
        installAllBtn.onmouseout = () => installAllBtn.style.background = '#4CAF50';
        
        // 重新安装所有按钮
        const reinstallAllBtn = document.createElement('button');
        reinstallAllBtn.textContent = '🔄 重新安装所有脚本';
        reinstallAllBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #ff9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        `;
        reinstallAllBtn.onmouseover = () => reinstallAllBtn.style.background = '#e68900';
        reinstallAllBtn.onmouseout = () => reinstallAllBtn.style.background = '#ff9800';
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '❌ 关闭';
        closeBtn.style.cssText = `
            padding: 10px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#d32f2f';
        closeBtn.onmouseout = () => closeBtn.style.background = '#f44336';
        closeBtn.onclick = () => container.remove();
        
        buttonContainer.appendChild(installAllBtn);
        buttonContainer.appendChild(reinstallAllBtn);
        buttonContainer.appendChild(closeBtn);
        container.appendChild(buttonContainer);
        
        // 进度显示区域
        const progressArea = document.createElement('div');
        progressArea.id = 'script-progress';
        progressArea.style.cssText = `
            margin-top: 10px;
            font-size: 12px;
            color: #666;
            max-height: 200px;
            overflow-y: auto;
        `;
        container.appendChild(progressArea);
        
        // 添加到页面
        document.body.appendChild(container);
        
        // 可拖动功能
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        title.style.cursor = 'move';
        
        title.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            container.style.left = (e.clientX - dragOffset.x) + 'px';
            container.style.top = (e.clientY - dragOffset.y) + 'px';
            container.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // 一键安装功能
        installAllBtn.onclick = async () => {
            const scriptsToInstall = SCRIPT_LIST.filter(script => !isScriptInstalled(script.name));
            
            if (scriptsToInstall.length === 0) {
                showNotification('提示', '所有脚本都已安装！', 'info');
                return;
            }
            
            installAllBtn.disabled = true;
            installAllBtn.textContent = '安装中...';
            
            progressArea.innerHTML = `<div style="color: #4CAF50;">开始安装 ${scriptsToInstall.length} 个脚本...</div>`;
            
            let installedCount = 0;
            let failedCount = 0;
            
            for (const script of scriptsToInstall) {
                const logItem = document.createElement('div');
                logItem.textContent = `📦 正在安装: ${script.name}...`;
                logItem.style.margin = '5px 0';
                progressArea.appendChild(logItem);
                
                try {
                    const success = await openScriptInstallPage(script);
                    
                    if (success) {
                        markScriptAsInstalled(script.name, script.url);
                        installedCount++;
                        logItem.textContent = `✅ 已安装: ${script.name}`;
                        logItem.style.color = '#4CAF50';
                    } else {
                        failedCount++;
                        logItem.textContent = `❌ 安装失败: ${script.name}`;
                        logItem.style.color = '#f44336';
                    }
                } catch (error) {
                    failedCount++;
                    logItem.textContent = `❌ 安装出错: ${script.name}`;
                    logItem.style.color = '#f44336';
                }
                
                progressArea.scrollTop = progressArea.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 500)); // 间隔500ms
            }
            
            installAllBtn.disabled = false;
            installAllBtn.textContent = '🚀 一键安装未安装脚本';
            
            const summary = document.createElement('div');
            summary.style.cssText = 'margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 4px;';
            summary.innerHTML = `<strong>安装完成！</strong><br>
                                 ✅ 成功: ${installedCount}<br>
                                 ❌ 失败: ${failedCount}<br>
                                 📊 总计: ${scriptsToInstall.length}`;
            
            progressArea.appendChild(summary);
            progressArea.scrollTop = progressArea.scrollHeight;
            
            showNotification('安装完成', `成功安装 ${installedCount} 个脚本，失败 ${failedCount} 个`, 
                           failedCount > 0 ? 'error' : 'info');
        };
        
        // 重新安装所有功能
        reinstallAllBtn.onclick = async () => {
            if (!confirm('确定要重新安装所有脚本吗？已安装的脚本也会被重新安装。')) {
                return;
            }
            
            reinstallAllBtn.disabled = true;
            reinstallAllBtn.textContent = '重新安装中...';
            
            progressArea.innerHTML = `<div style="color: #ff9800;">开始重新安装 ${SCRIPT_LIST.length} 个脚本...</div>`;
            
            // 清空安装记录
            GM_setValue(CONFIG.installedKey, {});
            
            let installedCount = 0;
            let failedCount = 0;
            
            for (const script of SCRIPT_LIST) {
                const logItem = document.createElement('div');
                logItem.textContent = `🔄 正在安装: ${script.name}...`;
                logItem.style.margin = '5px 0';
                progressArea.appendChild(logItem);
                
                try {
                    const success = await openScriptInstallPage(script);
                    
                    if (success) {
                        markScriptAsInstalled(script.name, script.url);
                        installedCount++;
                        logItem.textContent = `✅ 已安装: ${script.name}`;
                        logItem.style.color = '#4CAF50';
                    } else {
                        failedCount++;
                        logItem.textContent = `❌ 安装失败: ${script.name}`;
                        logItem.style.color = '#f44336';
                    }
                } catch (error) {
                    failedCount++;
                    logItem.textContent = `❌ 安装出错: ${script.name}`;
                    logItem.style.color = '#f44336';
                }
                
                progressArea.scrollTop = progressArea.scrollHeight;
                await new Promise(resolve => setTimeout(resolve, 500)); // 间隔500ms
            }
            
            reinstallAllBtn.disabled = false;
            reinstallAllBtn.textContent = '🔄 重新安装所有脚本';
            
            const summary = document.createElement('div');
            summary.style.cssText = 'margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 4px;';
            summary.innerHTML = `<strong>重新安装完成！</strong><br>
                                 ✅ 成功: ${installedCount}<br>
                                 ❌ 失败: ${failedCount}<br>
                                 📊 总计: ${SCRIPT_LIST.length}`;
            
            progressArea.appendChild(summary);
            progressArea.scrollTop = progressArea.scrollHeight;
            
            showNotification('重新安装完成', `成功安装 ${installedCount} 个脚本，失败 ${failedCount} 个`, 
                           failedCount > 0 ? 'error' : 'info');
        };
    }
    
    // 等待页面加载完成后创建UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
    
})();
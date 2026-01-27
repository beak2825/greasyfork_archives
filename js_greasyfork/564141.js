// ==UserScript==
// @name         JAVDB全能助手
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  JAVDB + EMBY 联动脚本：实时同步入库状态、预览图查看、磁力链管理、多站点搜索
// @author       by：潇洒公子
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMGFjZWE7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1MmJlODA7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SkQ8L3RleHQ+PC9zdmc+
// @match        *://javdb.com/*
// @match        *://*.javdb.com/*
// @match        *://*.javdb001.com/*
// @match        *://*.javdb521.com/*
// @match        *://sehuatang.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      *
// @connect      localhost
// @connect      127.0.0.1
// @connect      192.168.0.0/16
// @connect      10.0.0.0/8
// @connect      172.16.0.0/12
// @run-at       document-idle
// @license      MIT
// @homepage     https://github.com/86168057/javdb-all-in-one-assistant
// @downloadURL https://update.greasyfork.org/scripts/564141/JAVDB%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564141/JAVDB%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ⭐ 立即执行的测试日志
    console.log('%c✅ JAVDB全能助手 已加载', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('当前 URL:', window.location.href);
    console.log('当前路径:', window.location.pathname);
    console.log('查询参数:', window.location.search);

    // ========== [新增] 请求限流机制 ==========
    const REQUEST_QUEUE = [];
    const MAX_CONCURRENT_REQUESTS = 1; // 同时最多1个请求（再降低）
    const REQUEST_DELAY = 2000; // 每个请求间隔2000ms（增加至2秒）
    let activeRequests = 0;
    let lastRequestTime = 0;
    
    // 请求队列管理
    function queueRequest(requestFn) {
        return new Promise((resolve, reject) => {
            REQUEST_QUEUE.push({ requestFn, resolve, reject });
            processQueue();
        });
    }
    
    function processQueue() {
        if (activeRequests >= MAX_CONCURRENT_REQUESTS || REQUEST_QUEUE.length === 0) {
            return;
        }
        
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        
        if (timeSinceLastRequest < REQUEST_DELAY) {
            setTimeout(processQueue, REQUEST_DELAY - timeSinceLastRequest);
            return;
        }
        
        const { requestFn, resolve, reject } = REQUEST_QUEUE.shift();
        activeRequests++;
        lastRequestTime = Date.now();
        
        requestFn()
            .then(resolve)
            .catch(reject)
            .finally(() => {
                activeRequests--;
                setTimeout(processQueue, REQUEST_DELAY);
            });
    }

    // ========== [新增] 全局排行榜菜单 ==========
    function addGlobalRankingMenu() {
        try {
            // 防止重复添加
            if (document.querySelector('.global-ranking-menu')) return;
                
            // 创建浮动按钮
            const floatBtn = document.createElement('div');
            floatBtn.className = 'global-ranking-menu';
            floatBtn.innerHTML = '🏆';
            floatBtn.title = '排行榜快捷入口（仅演员榜免费）';
            floatBtn.style.cssText = `
                position: fixed;
                bottom: 150px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                z-index: 99999;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                transition: all 0.3s;
            `;
                
            // 悬停效果
            floatBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            });
            floatBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            });
                
            // 创建弹出菜单
            const menu = document.createElement('div');
            menu.className = 'ranking-popup-menu';
            menu.style.cssText = `
                position: fixed;
                bottom: 210px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 99998;
                display: none;
                min-width: 200px;
            `;
                
            const menuTitle = document.createElement('div');
            menuTitle.textContent = '🏆 JAVDB 排行榜（仅演员免费）';
            menuTitle.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; font-size: 12px;';
            menu.appendChild(menuTitle);
                
            // 排行榜链接列表（修正后的路径）
            const rankings = [
                { name: '💃 演员 TOP250', url: 'https://javdb.com/actors?f=rank', free: true },
                { name: '🎬 影片 TOP250 🔒', url: 'https://javdb.com/search?f=rank&page_type=video', free: false },
                { name: '🏆 有码作品 TOP250 🔒', url: 'https://javdb.com/search?f=rank&vft=2', free: false },
                { name: '✨ 无码作品 TOP250 🔒', url: 'https://javdb.com/search?f=rank&vft=1', free: false },
                { name: '📺 欧美作品 TOP250 🔒', url: 'https://javdb.com/search?f=rank&vft=3', free: false },
                { name: '🌟 2024 TOP250 🔒', url: 'https://javdb.com/search?f=rank&year=2024', free: false },
                { name: '🔥 2023 TOP250 🔒', url: 'https://javdb.com/search?f=rank&year=2023', free: false }
            ];
                
            rankings.forEach(rank => {
                const item = document.createElement('div');
                item.textContent = rank.name;
                item.style.cssText = `padding: 8px 10px; cursor: pointer; border-radius: 4px; transition: all 0.2s; font-size: 13px; color: ${rank.free ? '#28a745' : '#999'}; opacity: ${rank.free ? '1' : '0.6'};`;
                
                if (!rank.free) {
                    item.title = '此排行榜需要VIP会员';
                }
                
                item.addEventListener('mouseenter', function() {
                    this.style.background = '#f0f0f0';
                    this.style.color = rank.free ? '#28a745' : '#667eea';
                });
                item.addEventListener('mouseleave', function() {
                    this.style.background = 'transparent';
                    this.style.color = rank.free ? '#28a745' : '#999';
                });
                item.addEventListener('click', () => {
                    window.open(rank.url, '_blank');
                    menu.style.display = 'none';
                });
                menu.appendChild(item);
            });
                
            // 点击按钮切换菜单
            floatBtn.addEventListener('click', () => {
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });
                
            // 点击页面其他地方关闭菜单
            document.addEventListener('click', (e) => {
                if (!floatBtn.contains(e.target) && !menu.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });
                
            document.body.appendChild(floatBtn);
            document.body.appendChild(menu);
            console.log('EMBY Checker: 全局排行榜菜单已添加');
        } catch(e) {
            console.error('EMBY Checker: 添加全局排行榜菜单失败', e);
        }
    }
    
    // ========== [新增] 98堂自动搜索逻辑 ==========
    if (window.location.host.includes('sehuatang.net')) {
        if (window.location.search.includes('srchtxt=')) {
            const autoProcess = () => {
                // 第一步：检测并自动点击"满18岁"按钮（偶发性出现）
                const ageButton = Array.from(document.querySelectorAll('a, button, div')).find(el => 
                    el.textContent.includes('满18岁') || el.textContent.includes('please click here')
                );
                
                if (ageButton) {
                    console.log('98堂: 检测到年龄确认按钮，自动点击...');
                    ageButton.click();
                    // 点击后延迟执行搜索，确保页面已跳转
                    setTimeout(autoProcess, 800);
                    return;
                }
                
                // 第二步：自动点击搜索按钮（多种选择器兼容）
                const searchBtn = document.querySelector('button.pn') ||           // 优先尝试
                                  document.querySelector('button[type="submit"]') || 
                                  document.querySelector('button[name="searchsubmit"]') ||
                                  document.querySelector('.pn.pnc') ||
                                  document.querySelector('#searchsubmit') ||
                                  Array.from(document.querySelectorAll('button')).find(btn => 
                                      btn.textContent.includes('搜索') || btn.textContent.includes('搜 索')
                                  );
                
                if (searchBtn) {
                    console.log('98堂: 检测到搜索按钮，自动触发搜索...', searchBtn);
                    searchBtn.click();
                    return;
                }
                
                // 第三步：如果上述方法都失败，尝试表单提交
                const searchForm = document.querySelector('form[name="searchform"]') || 
                                   document.querySelector('form[id="search"]') ||
                                   document.querySelector('form');
                if (searchForm) {
                    console.log('98堂: 未找到按钮，尝试直接提交表单...');
                    searchForm.submit();
                    return;
                }
                
                console.warn('98堂: 未能找到搜索触发元素');
            };
            
            // 延迟执行，确保DOM完全加载
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => setTimeout(autoProcess, 300));
            } else {
                setTimeout(autoProcess, 300);
            }
        }
        return;
    }

    console.log('EMBY Checker: 脚本启动');

    // 默认EMBY服务器配置（空列表）
    const DEFAULT_SERVERS = [];

    // 缓存与索引
    let LIBRARY_INDEX = {};
    let SYNC_ERROR = GM_getValue('emby_sync_error', ''); // 从持久化存储加载错误状态
    try {
        LIBRARY_INDEX = JSON.parse(GM_getValue('emby_library_index', '{}'));
    } catch(e) {
        console.error('EMBY Checker: 解析索引失败', e);
        LIBRARY_INDEX = {};
    }
    
    let LAST_SYNC_TIME = GM_getValue('emby_last_sync', 0);
    const SYNC_INTERVAL = 60 * 60 * 1000; // 每1小时自动同步一次

    // 获取服务器配置
    function getServers() {
        try {
            const saved = GM_getValue('emby_servers', null);
            return saved ? JSON.parse(saved) : DEFAULT_SERVERS;
        } catch(e) {
            return DEFAULT_SERVERS;
        }
    }

    // 保存服务器配置
    function saveServers(servers) {
        GM_setValue('emby_servers', JSON.stringify(servers));
        // 触发配置变更事件，通知页面重新检查
        GM_setValue('emby_config_changed', Date.now());
    }

    // 全量同步EMBY库
    async function syncFullLibrary(manual = false) {
        const servers = getServers();
        if (servers.length === 0) {
            SYNC_ERROR = '未添加服务器';
            initCheck();
            return;
        }

        SYNC_ERROR = ''; // 开始同步前重置错误
        console.log('EMBY Checker: 开始同步全量库...');
        const newIndex = {};
        let totalCount = 0;
        let hasSuccess = false;

        for (const server of servers) {
            try {
                const items = await fetchAllEmbyItems(server);
                if (Array.isArray(items)) {
                    hasSuccess = true;
                    server.lastError = false;
                    server.statusMsg = '在线已连接'; // 新增：在线状态
                    items.forEach(item => {
                        const code = extractCodeFromTitle(item.Name) || extractCodeFromTitle(item.Path);
                        if (code) {
                            newIndex[code.toUpperCase()] = {
                                itemId: item.Id,
                                serverId: item.ServerId,
                                serverUrl: server.url,
                                serverName: server.name
                            };
                            totalCount++;
                        }
                    });
                }
            } catch (e) {
                console.error(`EMBY Checker: 同步服务器 ${server.name} 失败:`, e);
                server.lastError = true;
                server.statusMsg = e.toString() || '连接失败'; // 记录具体错误
                SYNC_ERROR = `连接 ${server.name} 失败: ${server.statusMsg}`;
            }
        }

        saveServers(servers); // 保存带有错误状态的服务器列表以便UI显示

        if (hasSuccess) {
            SYNC_ERROR = ''; 
        } else if (servers.length > 0) {
            newIndex = {}; 
            if (!SYNC_ERROR) SYNC_ERROR = '所有服务器连接失败';
        }

        GM_setValue('emby_sync_error', SYNC_ERROR); // 持久化错误状态
        LIBRARY_INDEX = newIndex;
        GM_setValue('emby_library_index', JSON.stringify(LIBRARY_INDEX));
        GM_setValue('emby_last_sync', Date.now());
        
        console.log(`EMBY Checker: 全量同步完成，共计 ${totalCount} 个番号。`);
        
        initCheck();
    }

    // 分页获取EMBY所有项目
    function fetchAllEmbyItems(server) {
        return new Promise((resolve, reject) => {
            const apiUrl = `${server.url}/emby/Items?Recursive=true&IncludeItemTypes=Movie&Fields=Path&api_key=${server.apiKey}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                timeout: 10000, // 缩短超时时间到10秒
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data.Items || []);
                        } catch (e) { reject('数据解析失败'); }
                    } else if (response.status === 401) {
                        reject('API Key 错误');
                    } else {
                        reject(`连接失败 (${response.status})`);
                    }
                },
                onerror: function() { reject('地址错误或无法连接'); },
                ontimeout: function() { reject('连接超时'); }
            });
        });
    }

    // 番号提取正则优化
    function extractCodeFromTitle(text) {
        if (!text) return null;
        text = text.trim();
        
        // 1. 匹配标准番号 (ABC-123, ABC_123, T28-123)
        const standardMatch = text.match(/([A-Z0-9]{2,12}[-_][A-Z0-9]{2,10}|[A-Z]{2,10}\d{3,6})/i);
        if (standardMatch) return standardMatch[1].toUpperCase();

        // 2. 匹配开头的一串字符（处理像 DigitalPlayground 或 012426_01 这种）
        const firstWordMatch = text.match(/^([a-z0-9_-]{3,25})/i);
        if (firstWordMatch) {
            const code = firstWordMatch[1];
            // 排除掉一些太通用的词
            if (!['THE', 'THIS', 'WHAT', 'WITH'].includes(code.toUpperCase())) {
                return code.toUpperCase();
            }
        }

        return null;
    }

    // 检查同步
    if (Date.now() - LAST_SYNC_TIME > SYNC_INTERVAL) {
        syncFullLibrary().catch(e => console.error('自动同步失败', e));
    }

    // 菜单
    GM_registerMenuCommand('🔄 立即同步EMBY库', () => syncFullLibrary(manualSyncCallback));
    GM_registerMenuCommand('⚙️ EMBY服务器设置', showSettingsDialog);

    function manualSyncCallback() {
        syncFullLibrary(true);
    }

    // 设置对话框
    function showSettingsDialog() {
        const servers = getServers();
        const overlay = document.createElement('div');
        overlay.id = 'emby-settings-overlay';
        overlay.style = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:999999;display:flex;align-items:center;justify-content:center;';
        
        let html = `
            <div style="background:white;padding:25px;border-radius:8px;width:700px;max-height:80vh;overflow-y:auto;font-family:sans-serif;color:#333;">
                <h2 style="margin:0 0 20px 0;">设置</h2>
                <div style="margin-bottom:15px;color:#666;font-size:12px;">上次同步时间: ${new Date(LAST_SYNC_TIME).toLocaleString()}</div>
                
                <!-- 使用说明 -->
                <div style="background:#f0f8ff;border-left:3px solid #2196F3;padding:12px;margin-bottom:15px;font-size:13px;line-height:1.6;">
                    <strong>📖 使用说明：</strong><br>
                    1. <strong>添加 emby 服务器</strong>：点击下方绿色按钮，填写服务器名称、地址和 API Key。<br>
                    2. <strong>获取 API Key</strong>：登录 emby 后台 → 设置 → 高级 → API 密钥 → 新建。<br>
                    3. <strong>保存并同步</strong>：点击下方蓝色按钮，脚本将<strong>立即连接</strong>所有已填写的服务器并<strong>全量抓取</strong>番号数据。只有同步成功后，页面才会显示入库状态。<br>
                    4. <strong>EMBY入库检查方式</strong>：脚本会同步 emby 服务器中所有视频的标题并建立本地索引，实现秒级比对。同时脚本具备<strong>实时秒同步</strong>能力，当您在服务器中<strong>增加或删除</strong>媒体视频后，页面状态也会实时感知并同步更新，无需手动干预。
                </div>
                
                <div id="server-list-container">`;
        
        servers.forEach((server, index) => {
            // 判断是否应该默认展开：只有未填写完整的服务器才展开
            const shouldExpand = !server.url || !server.apiKey;
                const arrowIcon = shouldExpand ? '▲' : '▼';
                
                // 获取服务器连接状态显示
                let statusHtml = '';
                if (server.lastError) {
                    statusHtml = `<span style="margin-left:10px;padding:1px 6px;background:#ff9800;color:white;border-radius:3px;font-size:10px;font-weight:normal;">${server.statusMsg || '连接失败'}</span>`;
                } else if (server.statusMsg === '在线已连接') {
                    statusHtml = `<span style="margin-left:10px;padding:1px 6px;background:#4CAF50;color:white;border-radius:3px;font-size:10px;font-weight:normal;">在线已连接</span>`;
                } else {
                    statusHtml = `<span style="margin-left:10px;padding:1px 6px;background:#9e9e9e;color:white;border-radius:3px;font-size:10px;font-weight:normal;">待同步/未连接</span>`;
                }

                html += `
                <div class="server-item" style="border:1px solid #ddd;margin-bottom:10px;border-radius:4px;">
                    <div class="server-header" style="padding:12px 15px;background:#f8f9fa;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="const body = document.getElementById('server-body-${index}'); const arrow = document.getElementById('server-arrow-${index}'); body.style.display = body.style.display === 'none' ? 'block' : 'none'; arrow.textContent = body.style.display === 'none' ? '▼' : '▲';">
                        <div style="display:flex;align-items:center;">
                            <strong style="font-size:14px;">${server.name || 'emby'}</strong>
                            ${statusHtml}
                        </div>
                        <span id="server-arrow-${index}" style="color:#999;font-size:12px;transition:transform 0.2s;">${arrowIcon}</span>
                    </div>
                    <div id="server-body-${index}" style="padding:15px;display:${shouldExpand ? 'block' : 'none'};">
                        <div style="margin-bottom:8px;">
                            <label style="display:inline-block;width:140px;font-weight:bold;">EMBY服务器名称：</label>
                            <input type="text" id="name-${index}" value="${server.name === '新服务器' || !server.name ? 'emby' : server.name}" placeholder="例如：主服务器" style="width:calc(100% - 150px);padding:5px;" />
                        </div>
                        <div style="margin-bottom:8px;">
                            <label style="display:inline-block;width:140px;font-weight:bold;">EMBY服务器地址：</label>
                            <input type="text" id="url-${index}" value="${server.url}" placeholder="例如：http://192.168.1.100:8096" style="width:calc(100% - 150px);padding:5px;" />
                        </div>
                        <div style="margin-bottom:12px;">
                            <label style="display:inline-block;width:140px;font-weight:bold;">EMBY API Key：</label>
                            <input type="text" id="key-${index}" value="${server.apiKey}" placeholder="32位API密钥" style="width:calc(100% - 150px);padding:5px;" />
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button class="connect-server-btn" data-index="${index}" style="background:#2196F3;color:white;border:none;padding:5px 15px;border-radius:3px;cursor:pointer;">连接</button>
                            <button class="remove-server-btn" data-index="${index}" style="background:#f44336;color:white;border:none;padding:5px 15px;border-radius:3px;cursor:pointer;">删除</button>
                        </div>
                    </div>
                </div>`;
        });
        
        html += `
                </div>
                <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
                    <button id="add-server-btn" style="background:#4CAF50;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;">➕ 添加 emby 服务器</button>
                    <button id="save-servers-btn" style="background:#2196F3;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;" title="保存所有服务器配置并立即同步EMBY媒体库">💾 保存并同步</button>
                    <button id="backup-btn" style="background:#FF9800;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;" title="导出当前所有配置为JSON文件">📥 备份配置</button>
                    <button id="restore-btn" style="background:#9C27B0;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;" title="从本地文件恢复配置">📤 恢复配置</button>
                    <button id="close-settings-btn" style="background:#666;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;">关闭</button>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:15px;border-top:1px solid #eee;color:#999;font-size:12px;">
                    <span>JAVDB全能助手 V0.1</span>
                    <span>by: 潇洒公子</span>
                </div>
                <input type="file" id="restore-file-input" accept=".json" style="display:none;">
            </div>`;
        
        overlay.innerHTML = html;
        document.body.appendChild(overlay);

        // 自动保存逻辑 (不再包含未连接成功的服务器)
        const autoSave = () => {
            let changed = false;
            const newServers = [];
            servers.forEach((s, index) => {
                const name = document.getElementById(`name-${index}`)?.value.trim();
                const url = document.getElementById(`url-${index}`)?.value.trim();
                const apiKey = document.getElementById(`key-${index}`)?.value.trim();
                
                if (url && apiKey) {
                    const normalizedUrl = url.replace(/\/$/, '');
                    // 如果地址没变且没有错误，或者它是之前连接成功的，我们保留
                    // 如果地址变了，我们不在此处保存它为“已验证”状态
                    if (normalizedUrl === s.url && apiKey === s.apiKey) {
                        newServers.push({
                            ...s,
                            name: name || 'emby'
                        });
                    }
                }
            });
            saveServers(newServers);
        };

        // 点击背景自动保存并关闭
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                autoSave();
                overlay.remove();
            }
        };
        
        document.getElementById('close-settings-btn').onclick = () => {
            autoSave();
            overlay.remove();
        };
        document.getElementById('add-server-btn').onclick = () => {
            servers.push({ url: '', apiKey: '', name: 'emby' });
            saveServers(servers);
            overlay.remove();
            setTimeout(() => showSettingsDialog(), 100);
        };
        document.getElementById('save-servers-btn').onclick = () => {
            const newServers = [];
            servers.forEach((_, index) => {
                const url = document.getElementById(`url-${index}`)?.value.trim() || '';
                if (url) {
                    newServers.push({
                        url: url.replace(/\/$/, ''),
                        apiKey: document.getElementById(`key-${index}`)?.value.trim() || '',
                        name: document.getElementById(`name-${index}`)?.value.trim() || 'emby'
                    });
                }
            });
            saveServers(newServers);
            overlay.remove();
            syncFullLibrary(true);
        };
        
        // 备份配置
        document.getElementById('backup-btn').onclick = () => {
            const config = {
                servers: getServers(),
                libraryIndex: LIBRARY_INDEX,
                lastSyncTime: LAST_SYNC_TIME,
                backupTime: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `javdb-emby-backup-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };
        
        // 恢复配置
        document.getElementById('restore-btn').onclick = () => {
            document.getElementById('restore-file-input').click();
        };
        
        document.getElementById('restore-file-input').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const config = JSON.parse(event.target.result);
                    if (config.servers) {
                        GM_setValue('emby_servers', JSON.stringify(config.servers));
                    }
                    if (config.libraryIndex) {
                        GM_setValue('emby_library_index', JSON.stringify(config.libraryIndex));
                        LIBRARY_INDEX = config.libraryIndex;
                    }
                    if (config.lastSyncTime) {
                        GM_setValue('emby_last_sync', config.lastSyncTime);
                        LAST_SYNC_TIME = config.lastSyncTime;
                    }
                    overlay.remove();
                    showSettingsDialog();
                } catch (err) {
                    console.error('配置文件格式错误：', err);
                }
            };
            reader.readAsText(file);
        };
        
        overlay.querySelectorAll('.connect-server-btn').forEach(btn => {
            btn.onclick = async function() {
                const index = parseInt(this.getAttribute('data-index'));
                const name = document.getElementById(`name-${index}`)?.value.trim() || 'emby';
                const url = document.getElementById(`url-${index}`)?.value.trim();
                const apiKey = document.getElementById(`key-${index}`)?.value.trim();
                
                if (!url || !apiKey) {
                    console.warn('EMBY Checker: 请填写完整的服务器地址和 API Key');
                    return;
                }

                const originalText = this.textContent;
                this.textContent = '连接中...';
                this.disabled = true;
                this.style.opacity = '0.7';

                const tempServer = { 
                    url: url.replace(/\/$/, ''), 
                    apiKey: apiKey, 
                    name: name 
                };

                try {
                    // 超时时间进一步调短为 3 秒进行连接测试
                    const items = await new Promise((resolve, reject) => {
                        const apiUrl = `${tempServer.url}/emby/Items?Recursive=true&IncludeItemTypes=Movie&Fields=Path&Limit=1&api_key=${tempServer.apiKey}`;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            timeout: 3000, // 连接测试超时调短为 3s
                            onload: function(response) {
                                if (response.status === 200) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        resolve(data.Items || []);
                                    } catch (e) { reject('数据解析失败'); }
                                } else if (response.status === 401) {
                                    reject('Emby API Key 错误');
                                } else {
                                    reject(`连接失败 (${response.status})`);
                                }
                            },
                            onerror: function() { reject('EMBY服务器地址错误或未连接'); },
                            ontimeout: function() { reject('EMBY服务器连接超时'); }
                        });
                    });

                    // 连接成功：更新配置并保存
                    servers[index] = {
                        ...tempServer,
                        lastError: false,
                        statusMsg: '在线已连接'
                    };
                    saveServers(servers);
                    
                    // 同步成功后触发全量库抓取（此处可以保持 30s 抓取全量）
                    syncFullLibrary(false);

                    // 重新刷新对话框以展示绿色标签并自动收起
                    overlay.remove();
                    showSettingsDialog();
                    initCheck();
                } catch (e) {
                    // 连接失败：更新临时状态供 UI 显示，但不允许将其作为“有效配置”保存到持久化存储（除非是为了记录错误状态）
                    // 用户如果刷新页面，这个未连接成功的服务器由于没有 saveServers 将会丢失，或者保持上次的状态
                    servers[index].statusMsg = e.toString();
                    servers[index].lastError = true;
                    
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.opacity = '1';
                    
                    // 刷新 UI 状态显示错误，但不进行 saveServers(servers) 的持久化操作（或者仅持久化错误状态以便下次展示）
                    // 按照用户要求：不允许保存填写的配置信息。我们只在内存中更新状态并刷新 UI
                    const statusTag = document.querySelector(`#server-body-${index}`).previousElementSibling.querySelector('span[id^="server-arrow-"]').previousElementSibling;
                    if (statusTag) {
                        statusTag.innerHTML = `<span style="margin-left:10px;padding:1px 6px;background:#ff9800;color:white;border-radius:3px;font-size:10px;font-weight:normal;">${e.toString()}</span>`;
                    }
                }
            };
        });
        
        overlay.querySelectorAll('.remove-server-btn').forEach(btn => {
            btn.onclick = function() {
                const idx = parseInt(this.getAttribute('data-index'));
                servers.splice(idx, 1);
                saveServers(servers);
                overlay.remove();
                showSettingsDialog();
            };
        });
    }

    // 样式
    const style = document.createElement('style');
    style.textContent = `
        .emby-status {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            vertical-align: middle;
            line-height: 1.5;
        }
        .emby-status.exists {
            background-color: #4CAF50;
            color: white;
            cursor: pointer !important;
        }
        .emby-status.not-exists {
            background-color: #f44336;
            color: white;
        }
        .emby-status.not-added {
            background-color: #9e9e9e;
            color: white;
        }
        .emby-status.error {
            background-color: #ff9800;
            color: white;
        }
        .movie-list .item { position: relative; }
        .movie-list .item .tags .emby-status {
            margin-right: 5px;
            margin-bottom: 5px;
        }
        /* 新增：第二行工具栏容器 */
        .emby-tools-row {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
            width: 100%;
        }
        .emby-tools-row .emby-status, 
        .emby-tools-row .preview-toggle-btn, 
        .emby-tools-row .magnet-toggle-btn,
        .emby-tools-row .actress-name-tag {
            margin: 0 !important;
            padding: 2px 6px !important; /* 缩小内边距 */
            font-size: 11px !important;  /* 稍微缩小字体 */
            height: 22px !important;     /* 统一高度 */
            line-height: 18px !important;
        }
        
        /* 女优名字标签特有样式 */
        .actress-name-tag {
            display: inline-flex;
            align-items: center;
            background: rgba(233, 30, 99, 0.1);
            color: #e91e63;
            border-radius: 3px;
            font-weight: bold;
            cursor: pointer;
            border: 1px solid #e91e63;
            transition: all 0.2s;
            text-decoration: none;
            white-space: nowrap;
        }
        .actress-name-tag:hover {
            background: #e91e63;
            color: white;
            transform: translateY(-1px);
        }
        
        /* 弹窗样式 */
        #emby-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        }
        #emby-modal-window {
            background: white;
            width: 80%;
            max-width: 1000px;
            max-height: 85vh;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            animation: emby-modal-in 0.3s ease-out;
        }
        @keyframes emby-modal-in {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        #emby-modal-header {
            padding: 15px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #emby-modal-title {
            font-weight: bold;
            font-size: 16px;
            color: #333;
        }
        #emby-modal-close {
            cursor: pointer;
            font-size: 24px;
            color: #999;
            line-height: 1;
        }
        #emby-modal-close:hover { color: #333; }
        #emby-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        
        .preview-toggle-btn, .magnet-toggle-btn {
            display: inline-flex;
            align-items: center;
            padding: 2px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
            cursor: pointer;
            line-height: 20px;
            height: 24px;
            transition: all 0.2s;
            position: relative;
        }
        .preview-toggle-btn { background-color: #2196F3; }
        .preview-toggle-btn:hover { background-color: #1976D2; }
        .magnet-toggle-btn { background-color: #E91E63; }
        .magnet-toggle-btn:hover { background-color: #C2185B; }
        
        /* 磁力链按钮角标 */
        .magnet-toggle-btn .badge {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .magnet-toggle-btn .badge.no-magnet {
            background: #9e9e9e;
        }
        
        /* 弹窗内容排版优化 */
        .modal-images-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: flex-start;
            align-items: flex-start;
        }
        .modal-images-grid img {
            height: 120px; /* 固定小图高度 */
            width: auto;
            object-fit: cover;
            border-radius: 4px;
            background: #f0f0f0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: all 0.2s;
        }
        .modal-images-grid img:hover { 
            transform: scale(1.05); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10;
        }
        
        /* 图片查看器 */
        #image-viewer-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.95);
            z-index: 9999999;
            display: none;
            align-items: center;
            justify-content: center;
        }
        #image-viewer-container {
            position: relative;
            max-width: 100vw;
            max-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
        }
        #image-viewer-img {
            display: block;
            transition: transform 0.2s;
            cursor: zoom-in;
        }
        #image-viewer-img.zoomed {
            cursor: zoom-out;
        }
        .viewer-btn {
            position: absolute;
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            z-index: 10;
        }
        .viewer-btn:hover {
            background: white;
            transform: scale(1.1);
        }
        #viewer-close {
            top: 20px;
            right: 20px;
        }
        #viewer-prev {
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
        #viewer-next {
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
        .viewer-controls {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        }
        
        /* 夸克按钮样式 */
        .modal-btn-quark { 
            background: #00CCAB !important; 
            color: white !important;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .modal-btn-quark:hover { background: #00B398 !important; }
        .quark-icon {
            width: 14px;
            height: 14px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="white" d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm0 819.2c-169.7 0-307.2-137.5-307.2-307.2S342.3 204.8 512 204.8s307.2 137.5 307.2 307.2-137.5 307.2-307.2 307.2z"/></svg>');
            background-size: contain;
            display: inline-block;
        }

        .modal-magnet-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .modal-magnet-item {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #eee;
        }
        .modal-magnet-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
            overflow: hidden;
        }
        .modal-magnet-name {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .modal-magnet-meta {
            font-size: 12px;
            color: #666;
            font-family: monospace;
        }
        .modal-magnet-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 2px;
        }
        .modal-tag {
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
        }
        .modal-tag.is-warning { background: #ffdd57; color: rgba(0,0,0,0.7); }
        .modal-tag.is-info { background: #209cee; color: white; }
        .modal-tag.is-success { background: #23d160; color: white; }
        .modal-tag.is-primary { background: #00d1b2; color: white; }
        
        .modal-magnet-btns {
            display: flex;
            gap: 8px;
        }
        .modal-btn {
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            border: none;
            transition: all 0.2s;
        }
        .modal-btn-copy { background: #4CAF50; color: white; }
        .modal-btn-copy:hover { background: #43A047; }
        .modal-btn-dl { background: #E91E63; color: white; }
        .modal-btn-dl:hover { background: #C2185B; }
        
        .preview-loading {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
        #emby-settings-btn {
            position: fixed; bottom: 100px; right: 20px;
            width: 44px; height: 44px; background: #2196F3;
            color: white; border: none; border-radius: 50%;
            font-size: 20px; cursor: pointer; z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        }
        #emby-settings-btn:hover { transform: scale(1.1); }
    `;
    document.head.appendChild(style);

    // 设置按钮
    function addSettingsButton() {
        if (document.getElementById('emby-settings-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'emby-settings-btn';
        btn.innerHTML = '⚙️';
        btn.onclick = (e) => { e.preventDefault(); showSettingsDialog(); };
        document.body.appendChild(btn);
    }

    // 状态显示逻辑
    function addStatusIndicator(container, videoCode, itemEl = null, insertBefore = null) {
        if (!videoCode) return;

        // 移除旧的显示状态（如果存在）
        const oldStatus = container.querySelector('.emby-status');
        if (oldStatus) {
            oldStatus.remove();
        }

        const servers = getServers();
        const statusDiv = document.createElement('span');

        // 优先处理状态异常情况
        if (servers.length === 0) {
            renderStatusMessage(statusDiv, '未添加服务器', 'not-added');
        } else if (SYNC_ERROR) {
            renderStatusMessage(statusDiv, SYNC_ERROR, 'error');
        } else if (Object.keys(LIBRARY_INDEX).length === 0 && LAST_SYNC_TIME === 0) {
            renderStatusMessage(statusDiv, '请点击设置并同步服务器', 'error');
        } else {
            const info = LIBRARY_INDEX[videoCode.toUpperCase()];
            if (info) {
                renderExists(statusDiv, info);
                verifyStatusBackground(statusDiv, videoCode, true);
            } else {
                renderNotExists(statusDiv);
                verifyStatusBackground(statusDiv, videoCode, false);
            }
        }

        // 插入到容器
        if (insertBefore) {
            container.insertBefore(statusDiv, insertBefore);
        } else {
            container.appendChild(statusDiv);
        }
    }

    // 弹窗管理
    function initModal() {
        if (document.getElementById('emby-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'emby-modal-overlay';
        overlay.innerHTML = `
            <div id="emby-modal-window">
                <div id="emby-modal-header">
                    <div id="emby-modal-title"></div>
                    <div id="emby-modal-close">&times;</div>
                </div>
                <div id="emby-modal-body"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) hideModal(); };
        document.getElementById('emby-modal-close').onclick = hideModal;
    }

    function showModal(title, contentHtml) {
        initModal();
        const overlay = document.getElementById('emby-modal-overlay');
        document.getElementById('emby-modal-title').textContent = title;
        document.getElementById('emby-modal-body').innerHTML = contentHtml;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        const overlay = document.getElementById('emby-modal-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // 图片查看器
    function initImageViewer() {
        if (document.getElementById('image-viewer-overlay')) return;
        const viewer = document.createElement('div');
        viewer.id = 'image-viewer-overlay';
        viewer.innerHTML = `
            <button class="viewer-btn" id="viewer-close">&times;</button>
            <button class="viewer-btn" id="viewer-prev">&lt;</button>
            <button class="viewer-btn" id="viewer-next">&gt;</button>
            <div id="image-viewer-container">
                <img id="image-viewer-img" />
            </div>
            <div class="viewer-controls">
                <button class="viewer-btn" id="viewer-zoom-in">+</button>
                <button class="viewer-btn" id="viewer-zoom-out">-</button>
                <button class="viewer-btn" id="viewer-reset">⟲</button>
            </div>
        `;
        document.body.appendChild(viewer);

        let currentImages = [];
        let currentIndex = 0;
        let scale = 1;

        const img = document.getElementById('image-viewer-img');
        const overlay = document.getElementById('image-viewer-overlay');

        function showImage(index) {
            currentIndex = index;
            scale = 1;
            img.src = currentImages[index];
            img.style.transform = `scale(${scale})`;
            img.classList.remove('zoomed');
            // 移除尺寸限制，显示原图大小
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
        }

        // 鼠标滚轮切换图片
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                // 向上滚轮：上一张
                if (currentIndex > 0) showImage(currentIndex - 1);
            } else {
                // 向下滚轮：下一张
                if (currentIndex < currentImages.length - 1) showImage(currentIndex + 1);
            }
        }, { passive: false });

        document.getElementById('viewer-close').onclick = () => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        };

        document.getElementById('viewer-prev').onclick = () => {
            if (currentIndex > 0) showImage(currentIndex - 1);
        };

        document.getElementById('viewer-next').onclick = () => {
            if (currentIndex < currentImages.length - 1) showImage(currentIndex + 1);
        };

        document.getElementById('viewer-zoom-in').onclick = () => {
            scale = Math.min(scale + 0.5, 3);
            img.style.transform = `scale(${scale})`;
        };

        document.getElementById('viewer-zoom-out').onclick = () => {
            scale = Math.max(scale - 0.5, 0.5);
            img.style.transform = `scale(${scale})`;
        };

        document.getElementById('viewer-reset').onclick = () => {
            scale = 1;
            img.style.transform = `scale(${scale})`;
        };

        img.onclick = () => {
            if (scale === 1) {
                scale = 2;
                img.classList.add('zoomed');
            } else {
                scale = 1;
                img.classList.remove('zoomed');
            }
            img.style.transform = `scale(${scale})`;
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        };

        window.openImageViewer = (images, index) => {
            currentImages = images;
            showImage(index);
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
    }

    // 添加预览图切换按钮
    function addPreviewToggle(container, itemEl, videoCode) {
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'preview-toggle-btn';
        toggleBtn.textContent = '🖼️ 预览图';
            
        toggleBtn.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            // 每次点击时实时抓取
            fetchPreviewImages(itemEl, videoCode);
        };
        container.appendChild(toggleBtn);
    }

    // 添加磁力链切换按钮
    function addMagnetToggle(container, itemEl, videoCode) {
        const toggleBtn = document.createElement('span');
        toggleBtn.className = 'magnet-toggle-btn';
        toggleBtn.textContent = '🧲 磁力链'; // 移除角标，纯文字
                
        toggleBtn.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            // 每次点击时实时抓取
            fetchMagnetLinks(itemEl, videoCode);
        };
        container.appendChild(toggleBtn);
    }
    
    // 检查磁力链是否可用
    function checkMagnetAvailability(toggleBtn, itemEl) {
        const detailLink = itemEl.querySelector('a[href^="/v/"]');
        if (!detailLink) return;
            
        GM_xmlhttpRequest({
            method: 'GET',
            url: detailLink.href,
            timeout: 5000,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const magnetItems = doc.querySelectorAll('#magnets-content .item, #magnets-content tr, .magnet-links .item');
                    
                const badge = toggleBtn.querySelector('.badge');
                if (magnetItems.length > 0) {
                    // 有磁力链，显示数量
                    badge.textContent = magnetItems.length > 9 ? '9+' : magnetItems.length;
                    badge.classList.remove('no-magnet');
                } else {
                    // 无磁力链，显示"0"
                    badge.textContent = '0';
                    badge.classList.add('no-magnet');
                }
            },
            onerror: function() {
                // 请求失败，隐藏角标
                const badge = toggleBtn.querySelector('.badge');
                if (badge) badge.style.display = 'none';
            },
            ontimeout: function() {
                const badge = toggleBtn.querySelector('.badge');
                if (badge) badge.style.display = 'none';
            }
        });
    }
        
    // 预加载磁力链数据（后台静默加载 + 请求队列 + 只加载可见区域）
    function preloadMagnetLinks(toggleBtn, itemEl, videoCode, callback) {
        const detailLink = itemEl.querySelector('a[href^="/v/"]');
        if (!detailLink) return;
        
        // 使用 IntersectionObserver 监听可见性
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 元素可见时才预加载
                    observer.unobserve(entry.target); // 只加载一次
                    
                    // 将请求放入队列
                    queueRequest(() => {
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: detailLink.href,
                                timeout: 8000,
                                onload: function(response) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, 'text/html');
                                    const magnetList = parseMagnetItems(doc);
                                        
                                    // 更新角标
                                    const badge = toggleBtn.querySelector('.badge');
                                    if (magnetList.length > 0) {
                                        badge.textContent = magnetList.length > 9 ? '9+' : magnetList.length;
                                        badge.classList.remove('no-magnet');
                                    } else {
                                        badge.textContent = '0';
                                        badge.classList.add('no-magnet');
                                    }
                                        
                                    // 回调缓存数据
                                    callback(magnetList);
                                    resolve();
                                },
                                onerror: function() {
                                    const badge = toggleBtn.querySelector('.badge');
                                    if (badge) badge.style.display = 'none';
                                    callback([]);
                                    resolve();
                                },
                                ontimeout: function() {
                                    const badge = toggleBtn.querySelector('.badge');
                                    if (badge) badge.style.display = 'none';
                                    callback([]);
                                    resolve();
                                }
                            });
                        });
                    });
                }
            });
        }, {
            rootMargin: '200px' // 提前200px开始加载
        });
        
        observer.observe(itemEl);
    }
        
    // 解析磁力链项（提取为独立函数）
    function parseMagnetItems(doc) {
        const magnetItems = doc.querySelectorAll('#magnets-content .item, #magnets-content tr, .magnet-links .item');
        let magnetList = [];
            
        magnetItems.forEach(item => {
            const linkEl = item.querySelector('a[href^="magnet:"]') || (item.tagName === 'A' && item.href.startsWith('magnet:') ? item : null);
            if (linkEl) {
                const magnetUrl = linkEl.href;
                let name = item.querySelector('.name')?.textContent.trim() || 
                           item.querySelector('.magnet-name')?.textContent.trim() ||
                           linkEl.title || 
                           item.textContent.trim().split('\n')[0];
                                        
                let meta = item.querySelector('.meta')?.textContent.trim() || 
                           item.querySelector('.size')?.textContent.trim() || 
                           item.querySelector('.date')?.textContent.trim() || '';
            
                // 提取有效标签（严格过滤）
                let tags = [];
                item.querySelectorAll('.tag').forEach(tag => {
                    const text = tag.textContent.trim();
                    // 白名单机制：只保留真正的资源属性标签
                    const validTags = ['字幕', '高清', '无码', '有码', '中文', '无修正'];
                    if (validTags.some(v => text.includes(v)) && !meta.includes(text)) {
                        let className = 'modal-tag';
                        if (tag.classList.contains('is-warning')) className += ' is-warning';
                        else if (tag.classList.contains('is-info')) className += ' is-info';
                        else if (tag.classList.contains('is-success')) className += ' is-success';
                        else if (tag.classList.contains('is-primary')) className += ' is-primary';
                        tags.push({ text, className });
                    }
                });
                                        
                magnetList.push({
                    name,
                    meta,
                    magnetUrl,
                    tags,
                    hasSub: tags.some(t => t.text.includes('字幕'))
                });
            }
        });
            
        // 排序：有字幕的排在最前面
        magnetList.sort((a, b) => (b.hasSub ? 1 : 0) - (a.hasSub ? 1 : 0));
            
        return magnetList;
    }
        
    // 快速显示磁力链弹窗（使用缓存数据）
    function showMagnetModal(videoCode, magnetList) {
        let html = '<div class="modal-magnet-list">';
        magnetList.forEach(m => {
            let tagsHtml = m.tags.map(t => `<span class="${t.className}">${t.text}</span>`).join('');
            html += `
                <div class="modal-magnet-item">
                    <div class="modal-magnet-info">
                        <div class="modal-magnet-name" title="${m.name}">${m.name}</div>
                        <div class="modal-magnet-meta">${m.meta}</div>
                        <div class="modal-magnet-tags">${tagsHtml}</div>
                    </div>
                    <div class="modal-magnet-btns">
                        <button class="modal-btn modal-btn-copy" onclick="const btn=this; navigator.clipboard.writeText('${m.magnetUrl}').then(() => { const old=btn.textContent; btn.textContent='已复制'; btn.style.background='#2e7d32'; setTimeout(()=>{btn.textContent=old; btn.style.background='';}, 1000); })">复制</button>
                    </div>
                </div>`;
        });
            
        if (magnetList.length === 0) {
            html += '<div class="preview-loading">未找到磁力链接，请确认是否需要登录查看</div>';
        }
        html += '</div>';
            
        showModal(`${videoCode} - 磁力链接`, html);
    }
    
    // 为列表页添加搜索按钮
    function addListPageSearchButtons(container, videoCode) {
        if (!videoCode) return;
        
        // 防止重复添加
        if (container.querySelector('.list-search-panel')) return;
        
        const searchPanel = document.createElement('div');
        searchPanel.className = 'list-search-panel';
        searchPanel.style.cssText = 'display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap; width: 100%;';
        
        const buttonColors = [
            { bg: '#dc3545', hover: '#c82333' },
            { bg: '#007bff', hover: '#0056b3' },
            { bg: '#28a745', hover: '#218838' },
            { bg: '#ffc107', hover: '#e0a800', text: '#000' },
            { bg: '#17a2b8', hover: '#138496' }
        ];
        
        SEARCH_SITES.forEach((site, index) => {
            const btn = document.createElement('button');
            btn.textContent = site.name;
            const color = buttonColors[index] || { bg: '#6c757d', hover: '#5a6268' };
            btn.style.cssText = `padding: 2px 8px; background-color: ${color.bg}; color: ${color.text || 'white'}; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s; white-space: nowrap;`;
            
            btn.addEventListener('mouseenter', function() { this.style.backgroundColor = color.hover; });
            btn.addEventListener('mouseleave', function() { this.style.backgroundColor = color.bg; });
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = site.format === 'path' ? site.url.replace('{code}', videoCode) : site.url.replace('{code}', encodeURIComponent(videoCode));
                window.open(url, '_blank');
            });
            searchPanel.appendChild(btn);
        });
        
        container.appendChild(searchPanel);
    }

    // 获取磁力链并弹窗
    function fetchMagnetLinks(itemEl, videoCode) {
        const detailLink = itemEl.querySelector('a[href^="/v/"]');
        if (!detailLink) return;

        showModal(`${videoCode} - 磁力链接`, '<div class="preview-loading">正在获取磁力链...</div>');

        GM_xmlhttpRequest({
            method: 'GET',
            url: detailLink.href,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                
                // 更加全面的选择器适配
                const magnetItems = doc.querySelectorAll('#magnets-content .item, #magnets-content tr, .magnet-links .item');
                let magnetList = [];
                
                magnetItems.forEach(item => {
                    const linkEl = item.querySelector('a[href^="magnet:"]') || (item.tagName === 'A' && item.href.startsWith('magnet:') ? item : null);
                    if (linkEl) {
                        const magnetUrl = linkEl.href;
                        let name = item.querySelector('.name')?.textContent.trim() || 
                                   item.querySelector('.magnet-name')?.textContent.trim() ||
                                   linkEl.title || 
                                   item.textContent.trim().split('\n')[0];
                                        
                        let meta = item.querySelector('.meta')?.textContent.trim() || 
                                   item.querySelector('.size')?.textContent.trim() || 
                                   item.querySelector('.date')?.textContent.trim() || '';
                
                        // 提取有效标签（严格过滤）
                        let tags = [];
                        item.querySelectorAll('.tag').forEach(tag => {
                            const text = tag.textContent.trim();
                            // 白名单机制：只保留真正的资源属性标签
                            const validTags = ['字幕', '高清', '无码', '有码', '中文', '无修正'];
                            if (validTags.some(v => text.includes(v)) && !meta.includes(text)) {
                                let className = 'modal-tag';
                                if (tag.classList.contains('is-warning')) className += ' is-warning';
                                else if (tag.classList.contains('is-info')) className += ' is-info';
                                else if (tag.classList.contains('is-success')) className += ' is-success';
                                else if (tag.classList.contains('is-primary')) className += ' is-primary';
                                tags.push({ text, className });
                            }
                        });
                                        
                        magnetList.push({
                            name,
                            meta,
                            magnetUrl,
                            tags,
                            hasSub: tags.some(t => t.text.includes('字幕'))
                        });
                    }
                });
                
                // 排序：有字幕的排在最前面
                magnetList.sort((a, b) => (b.hasSub ? 1 : 0) - (a.hasSub ? 1 : 0));
                
                let html = '<div class="modal-magnet-list">';
                magnetList.forEach(m => {
                    let tagsHtml = m.tags.map(t => `<span class="${t.className}">${t.text}</span>`).join('');
                    html += `
                        <div class="modal-magnet-item">
                            <div class="modal-magnet-info">
                                <div class="modal-magnet-name" title="${m.name}">${m.name}</div>
                                <div class="modal-magnet-meta">${m.meta}</div>
                                <div class="modal-magnet-tags">${tagsHtml}</div>
                            </div>
                            <div class="modal-magnet-btns">
                                <button class="modal-btn modal-btn-copy" onclick="const btn=this; navigator.clipboard.writeText('${m.magnetUrl}').then(() => { const old=btn.textContent; btn.textContent='已复制'; btn.style.background='#2e7d32'; setTimeout(()=>{btn.textContent=old; btn.style.background='';}, 1000); })">复制</button>
                            </div>
                        </div>`;
                });
                
                if (magnetList.length === 0) {
                    html += '<div class="preview-loading">未找到磁力链接，请确认是否需要登录查看</div>';
                }
                html += '</div>';
                document.getElementById('emby-modal-body').innerHTML = html;
            }
        });
    }

    // 获取预览图并弹窗
    function fetchPreviewImages(itemEl, videoCode) {
        const detailLink = itemEl.querySelector('a[href^="/v/"]');
        if (!detailLink) return;

        showModal(`${videoCode} - 预览图`, '<div class="preview-loading">正在获取预览图...</div>');

        GM_xmlhttpRequest({
            method: 'GET',
            url: detailLink.href,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const imgList = parsePreviewImages(doc, detailLink.href);
                
                if (imgList.length === 0) {
                    document.getElementById('emby-modal-body').innerHTML = '<div class="preview-loading">未找到预览图</div>';
                } else {
                    showPreviewModal(videoCode, imgList);
                }
            }
        });
    }
    
    // 预加载预览图（后台静默加载 + 请求队列 + 只加载可见区域）
    function preloadPreviewImages(itemEl, callback) {
        const detailLink = itemEl.querySelector('a[href^="/v/"]');
        if (!detailLink) return;
        
        // 使用 IntersectionObserver 监听可见性
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 元素可见时才预加载
                    observer.unobserve(entry.target); // 只加载一次
                    
                    // 将请求放入队列
                    queueRequest(() => {
                        return new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: detailLink.href,
                                timeout: 10000,
                                onload: function(response) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(response.responseText, 'text/html');
                                    const imgList = parsePreviewImages(doc, detailLink.href);
                                    callback(imgList);
                                    resolve();
                                },
                                onerror: function() {
                                    callback([]);
                                    resolve();
                                },
                                ontimeout: function() {
                                    callback([]);
                                    resolve();
                                }
                            });
                        });
                    });
                }
            });
        }, {
            rootMargin: '200px' // 提前200px开始加载
        });
        
        observer.observe(itemEl);
    }
    
    // 添加女优名字显示（按需加载版）
    function addActressName(itemEl, toolsRow) {
        // 防止重复添加
        if (toolsRow.querySelector('.actress-name-tag')) return;
        
        const detailLink = itemEl.querySelector('a[href^="/v/"]');
        if (!detailLink) return;
        
        // 创建“女优名字”按钮
        const showBtn = document.createElement('a');
        showBtn.className = 'actress-name-tag';
        showBtn.textContent = '👩 女优名字';
        showBtn.style.cssText = 'display: inline-flex; white-space: nowrap;';
        showBtn.title = '点击加载女优名字';
        
        // 点击加载或跳转
        showBtn.onclick = (e) => {
            // 如果已经加载成功有了链接，则允许默认跳转行为
            if (showBtn.href && !showBtn.href.endsWith('#')) {
                e.stopPropagation();
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            
            // 显示加载中
            showBtn.textContent = '⏳ 加载中...';
            showBtn.style.pointerEvents = 'none';
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: detailLink.href,
                timeout: 5000,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        
                        let actressName = null;
                        let actressUrl = null;
                        
                        // 查找演员区域（增强型选择器）
                        const panels = doc.querySelectorAll('.panel-block, .movie-panel-info .panel-block');
                        for (let panel of panels) {
                            const strong = panel.querySelector('strong');
                            const label = panel.querySelector('.value');
                            
                            // 检查是否包含“演员”关键字
                            if (strong && (strong.textContent.includes('演員') || strong.textContent.includes('演员'))) {
                                const actorLinks = panel.querySelectorAll('a');
                                
                                // 1. 优先寻找带有 ♀ 符号的名字
                                for (let link of actorLinks) {
                                    const text = link.textContent.trim();
                                    if (text.includes('♀')) {
                                        actressName = text.replace(/♀/g, '').trim();
                                        const href = link.getAttribute('href');
                                        actressUrl = href ? (href.startsWith('http') ? href : new URL(href, 'https://javdb.com').href) : null;
                                        break;
                                    }
                                }
                                
                                // 2. 如果没带 ♀ 符号，但有链接，则取第一个
                                if (!actressName && actorLinks.length > 0) {
                                    actressName = actorLinks[0].textContent.trim();
                                    const href = actorLinks[0].getAttribute('href');
                                    actressUrl = href ? (href.startsWith('http') ? href : new URL(href, 'https://javdb.com').href) : null;
                                }
                                
                                // 3. 如果还是没有，检查 .value 容器
                                if (!actressName && label) {
                                    actressName = label.textContent.trim();
                                }
                                break;
                            }
                        }
                        
                        // 更新按钮
                        if (actressName && actressName.length > 0) {
                            showBtn.textContent = actressName;
                            showBtn.href = actressUrl || '#';
                            if (actressUrl) showBtn.target = '_blank';
                            showBtn.title = `点击查看 ${actressName} 的所有作品`;
                            showBtn.style.pointerEvents = 'auto';
                        } else {
                            showBtn.textContent = '⚠️ 未找到';
                            showBtn.style.opacity = '0.5';
                        }
                    } catch(err) {
                        console.error('EMBY Checker: 解析女优信息失败', err);
                        showBtn.textContent = '❌ 加载失败';
                        showBtn.style.opacity = '0.5';
                    }
                },
                onerror: function(err) {
                    console.error('EMBY Checker: 女优名字请求失败', err);
                    showBtn.textContent = '❌ 请求失败';
                    showBtn.style.opacity = '0.5';
                },
                ontimeout: function() {
                    console.warn('EMBY Checker: 女优名字请求超时');
                    showBtn.textContent = '⏱️ 请求超时';
                    showBtn.style.opacity = '0.5';
                }
            });
        };
        
        // 直接追加到 toolsRow
        toolsRow.appendChild(showBtn);
    }
    
    // 解析预览图（提取为独立函数）
    function parsePreviewImages(doc, baseUrl) {
        const sampleContainer = doc.querySelector('.tile-images, .sample-images');
        const imgList = [];

        if (sampleContainer) {
            // 优先提取 <a> 标签中的大图链接，避免重复抓取缩略图
            sampleContainer.querySelectorAll('a').forEach(el => {
                if (el.href && (el.href.match(/\.(jpg|jpeg|png|webp)$/i) || el.href.includes('img.php'))) {
                    let src = el.href;
                    if (src.startsWith('//')) src = 'https:' + src;
                    else if (src.startsWith('/')) src = new URL(src, baseUrl).href;
                    if (!imgList.includes(src)) {
                        imgList.push(src);
                    }
                }
            });
            
            // 如果没有找到，尝试直接提取 <img> 标签
            if (imgList.length === 0) {
                sampleContainer.querySelectorAll('img').forEach(img => {
                    let src = img.src || img.dataset.src;
                    if (src) {
                        if (src.startsWith('//')) src = 'https:' + src;
                        else if (src.startsWith('/')) src = new URL(src, baseUrl).href;
                        // 过滤掉明显的缩略图
                        if (!src.includes('thumb') && !src.includes('small') && !imgList.includes(src)) {
                            imgList.push(src);
                        }
                    }
                });
            }
        }
        
        return imgList;
    }
    
    // 快速显示预览图弹窗（使用缓存数据）
    function showPreviewModal(videoCode, imgList) {
        initImageViewer();
        let html = '<div class="modal-images-grid">';
        imgList.forEach((src, index) => {
            // 使用数据属性存储图片信息，避免字符串转义问题
            html += `<img src="${src}" data-index="${index}" class="preview-image" style="cursor: pointer;" />`;
        });
        html += '</div>';
        showModal(`${videoCode} - 预览图 (${imgList.length}张)`, html);
        
        // 添加点击事件
        setTimeout(() => {
            document.querySelectorAll('.preview-image').forEach(img => {
                img.onclick = () => {
                    const index = parseInt(img.dataset.index);
                    window.openImageViewer(imgList, index);
                };
            });
        }, 100);
    }

    function renderExists(statusDiv, info) {
        statusDiv.className = 'emby-status exists';
        statusDiv.textContent = 'Emby已入库';
        
        // 动态获取服务器当前最新的URL，防止配置更改后索引中的URL失效
        const servers = getServers();
        const currentServer = servers.find(s => s.name === info.serverName) || { url: info.serverUrl };
        const finalUrl = currentServer.url || info.serverUrl;

        statusDiv.title = `点击打开EMBY\n服务器: ${info.serverName}`;
        statusDiv.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            const url = `${finalUrl}/web/index.html#!/item?id=${info.itemId}&serverId=${info.serverId}`;
            window.open(url, '_blank');
        };
        
        // 添加提示文字（仅详情页）
        if (window.location.pathname.startsWith('/v/')) {
            const hint = document.createElement('div');
            hint.style.cssText = 'font-size: 11px; color: #999; margin-top: 3px; line-height: 1.4;';
            hint.textContent = 'ℹ️ 点击标签可直接跳转到 Emby 服务器中的媒体页面';
            statusDiv.parentElement.appendChild(hint);
        }
    }

    function renderNotExists(statusDiv) {
        statusDiv.className = 'emby-status not-exists';
        statusDiv.textContent = 'Emby未入库';
        statusDiv.title = '未在服务器中找到';
        statusDiv.onclick = null;
    }

    // 新增：渲染状态消息（如未添加服务器、连接失败）
    function renderStatusMessage(statusDiv, message, type) {
        statusDiv.className = `emby-status ${type}`;
        statusDiv.textContent = message;
        statusDiv.title = '点击打开服务器设置';
        statusDiv.style.cursor = 'pointer';
        statusDiv.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            showSettingsDialog();
        };
    }

    // 后台验证状态（实时同步关键）
    function verifyStatusBackground(statusDiv, videoCode, cachedExists) {
        const servers = getServers();
        if (servers.length === 0) return;

        const firstServer = servers[0];
        
        // 如果服务器已经有已知的错误，立即显示，不再等待请求
        if (firstServer.lastError && firstServer.statusMsg) {
            let displayMsg = firstServer.statusMsg;
            if (displayMsg === '连接超时') displayMsg = 'EMBY服务器连接超时';
            renderStatusMessage(statusDiv, displayMsg, 'error');
            return;
        }

        if (!firstServer.url || !firstServer.apiKey) {
            renderStatusMessage(statusDiv, '服务器配置不完整', 'error');
            return;
        }

        const apiUrl = `${firstServer.url}/emby/Items?searchTerm=${encodeURIComponent(videoCode)}&Recursive=true&IncludeItemTypes=Movie&Limit=1&api_key=${firstServer.apiKey}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            timeout: 2000, // 进一步缩短背景校验超时时间到 2s
            onload: function(response) {
                // 如果同步状态本来就是错误，或者已经显示了错误信息，不要再用成功结果覆盖它
                if (SYNC_ERROR && statusDiv.classList.contains('error')) return;

                if (response.status !== 200) {
                    let msg = `连接出错 (${response.status})`;
                    if (response.status === 401) msg = 'Emby API Key 错误';
                    renderStatusMessage(statusDiv, msg, 'error');
                    return;
                }
                try {
                    const data = JSON.parse(response.responseText);
                    const nowExists = data.Items && data.Items.length > 0;
                    
                    if (cachedExists && !nowExists) {
                        delete LIBRARY_INDEX[videoCode.toUpperCase()];
                        GM_setValue('emby_library_index', JSON.stringify(LIBRARY_INDEX));
                        renderNotExists(statusDiv);
                    } else if (!cachedExists && nowExists) {
                        const item = data.Items[0];
                        const newInfo = {
                            itemId: item.Id,
                            serverId: item.ServerId,
                            serverUrl: firstServer.url,
                            serverName: firstServer.name
                        };
                        LIBRARY_INDEX[videoCode.toUpperCase()] = newInfo;
                        GM_setValue('emby_library_index', JSON.stringify(LIBRARY_INDEX));
                        renderExists(statusDiv, newInfo);
                    }
                } catch (e) {
                    renderStatusMessage(statusDiv, 'Emby返回数据异常', 'error');
                }
            },
            onerror: function() {
                renderStatusMessage(statusDiv, 'EMBY服务器地址错误或未连接', 'error');
            },
            ontimeout: function() {
                renderStatusMessage(statusDiv, 'EMBY服务器连接超时', 'error');
            }
        });
    }

    function initCheck() {
        if (document.hidden) return; // 页面隐藏时不执行
        console.log('EMBY Checker: 执行页面扫描');
        
        // 详情页
        if (window.location.pathname.startsWith('/v/')) {
            console.log('EMBY Checker: 检测到详情页，开始查找番号元素');
            
            // 多种方式查找番号元素
            const blocks = document.querySelectorAll('.video-meta-panel .panel-block, .movie-panel-info .panel-block, .panel-block');
            console.log(`EMBY Checker: 找到 ${blocks.length} 个 panel-block`);
            
            let foundCode = false;
            for (let block of blocks) {
                const strongEl = block.querySelector('strong');
                console.log('EMBY Checker: 检查 panel-block, strong 内容:', strongEl?.textContent);
                
                if (strongEl && (strongEl.textContent.includes('番號') || strongEl.textContent.includes('番号'))) {
                    const val = block.querySelector('.value');
                    console.log('EMBY Checker: 找到番号块，value:', val?.textContent);
                    
                    if (val) {
                        foundCode = true;
                        const existingStatus = val.parentElement.querySelector('.emby-status');
                        // 稳定性逻辑：只有在没有标签，或者全局同步错误发生变化时才重绘
                        if (existingStatus) {
                            console.log('EMBY Checker: EMBY标签已存在');
                            if (SYNC_ERROR && existingStatus.textContent !== SYNC_ERROR) {
                                // 将 EMBY 标签插入到番号所在的 panel-block 之前
                                addStatusIndicator(block.parentElement, val.textContent.trim(), null, block);
                            }
                            // 如果已经有标签了，且没有全局错误需要显示，则跳过，交给 verifyStatusBackground 处理后续更新
                        } else {
                            console.log('EMBY Checker: 未找到现有EMBY标签，开始添加');
                            // 将 EMBY 标签插入到番号所在的 panel-block 之前
                            addStatusIndicator(block.parentElement, val.textContent.trim(), null, block);
                        }
                    }
                    break;
                }
            }
            
            if (!foundCode) {
                console.log('EMBY Checker: 未能通过 panel-block 找到番号，尝试其他方法');
            }
        }

        // 列表页
        const listItems = document.querySelectorAll('.movie-list .item');
        console.log('EMBY Checker: 找到列表项数量:', listItems.length);
        
        listItems.forEach((item, index) => {
            console.log(`EMBY Checker: 处理第 ${index + 1} 个列表项`);
            const titleDiv = item.querySelector('.video-title');
            const tags = item.querySelector('.tags');
            if (titleDiv && tags) {
                const code = extractCodeFromTitle(titleDiv.textContent) || titleDiv.textContent.trim().split(/\s+/)[0];
                if (!code || code.length <= 2) return;
                
                // 1. 创建或获取主工具容器（防止换行）
                let toolsContainer = item.querySelector('.emby-tools-container');
                if (!toolsContainer) {
                    toolsContainer = document.createElement('div');
                    toolsContainer.className = 'emby-tools-container';
                    toolsContainer.style.cssText = 'margin-top: 5px; width: 100%; display: block;';
                    tags.after(toolsContainer);
                }

                // 2. 第一行：Emby、女优、预览、磁力
                let toolsRow = toolsContainer.querySelector('.emby-tools-row');
                if (!toolsRow) {
                    toolsRow = document.createElement('div');
                    toolsRow.className = 'emby-tools-row';
                    // 强制水平排列，不换行，缩小间距，确保 4 个按钮在一行
                    toolsRow.style.cssText = 'display: flex; flex-wrap: nowrap; align-items: center; gap: 3px; width: 100%; overflow: visible;';
                    toolsContainer.appendChild(toolsRow);
                    
                    // 按顺序添加
                    addStatusIndicator(toolsRow, code, item);
                    
                    const currentPath = window.location.pathname;
                    const hasPageParam = window.location.search.includes('page=');
                    if (currentPath === '/' || currentPath.startsWith('/page/') || hasPageParam) {
                        addActressName(item, toolsRow);
                    }
                    
                    addPreviewToggle(toolsRow, item, code);
                    addMagnetToggle(toolsRow, item, code);
                }

                // 3. 第二行：搜索按钮（另起一行）
                if (!toolsContainer.querySelector('.list-search-panel')) {
                    addListPageSearchButtons(toolsContainer, code);
                }
            } else {
                console.log(`EMBY Checker: 第 ${index + 1} 项缺少必要元素`, { titleDiv: !!titleDiv, tags: !!tags });
            }
        });
    }

    // 启动
    const start = () => {
        try {
            console.log('EMBY Checker: ========== 脚本启动 ==========');
            console.log('EMBY Checker: 当前URL:', window.location.href);
            console.log('EMBY Checker: 当前路径:', window.location.pathname);
            
            addSettingsButton();
            addGlobalRankingMenu(); // 添加全局排行榜菜单
            initCheck();
            
            // 延迟执行多站点搜索按钮，确保页面元素已加载
            console.log('EMBY Checker: 准备添加搜索按钮...');
            // 立即执行一次
            setTimeout(() => {
                console.log('EMBY Checker: 立即尝试添加搜索按钮');
                addMultiSiteSearchButtons();
            }, 0);
            setTimeout(() => {
                console.log('EMBY Checker: 300ms - 尝试添加搜索按钮');
                addMultiSiteSearchButtons();
            }, 300);
            setTimeout(() => {
                console.log('EMBY Checker: 1000ms - 尝试添加搜索按钮');
                addMultiSiteSearchButtons();
            }, 1000);
        } catch(e) {
            console.error('EMBY Checker: 启动失败', e);
        }
    };

    // ========== [新增] 多站点搜索功能 ==========
    const SEARCH_SITES = [
        { name: '98堂', url: 'https://sehuatang.net/search.php?mod=forum&srchtxt={code}', format: 'query' },
        { name: 'BTSOW', url: 'https://btsow.lol/search/{code}', format: 'path' },
        { name: 'JAVDB', url: 'https://javdb.com/search?q={code}', format: 'query' },
        { name: 'JAVBUS', url: 'https://www.javbus.com/search/{code}', format: 'path' },
        { name: '谷歌搜索', url: 'https://www.google.com/search?q={code}', format: 'query' }
    ];

    function addMultiSiteSearchButtons() {
        try {
            // 只在详情页显示
            if (!window.location.pathname.startsWith('/v/')) {
                console.log('EMBY Checker: 不是详情页，跳过添加搜索按钮');
                return;
            }
            
            // 检测是否被限流（页面显示 "Please take a rest"）
            if (document.body.textContent.includes('Please take a rest')) {
                console.log('EMBY Checker: 检测到限流提示，不添加搜索按钮');
                return;
            }
            
            // 检测页面是否有有效内容
            const hasContent = document.querySelector('.video-meta-panel') || 
                              document.querySelector('.movie-panel-info') ||
                              document.querySelector('.panel-block');
            if (!hasContent) {
                console.log('EMBY Checker: 页面没有有效内容，不添加搜索按钮');
                return;
            }
            
            console.log('EMBY Checker: 开始添加多站点搜索按钮...');
    
            // 防止重复添加（但如果是固定定位的旧按钮，则删除重建）
            const existingPanel = document.querySelector('.javdb-search-panel');
            if (existingPanel) {
                // 检查是否是固定定位的按钮（旧版本）
                const isFixed = existingPanel.parentElement && 
                               existingPanel.parentElement.style.position === 'fixed';
                
                if (isFixed) {
                    console.log('EMBY Checker: 删除旧的固定定位按钮，准备重新插入');
                    existingPanel.parentElement.remove();
                } else {
                    console.log('EMBY Checker: 搜索按钮已存在');
                    return;
                }
            }
    
            // 多种方式查找番号
            let videoCode = '';
            let codeElement = null;
    
            // 方法1：通过 TreeWalker 查找"番号："文本
            try {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while (node = walker.nextNode()) {
                    const text = node.textContent.trim();
                    // 核心改进：支持中英文两种冒号 [:：]，并放宽番号匹配范围
                    const match = text.match(/番[号號][:：][[［\s]*([A-Z0-9\-]+)/i);
                    if (match) {
                        videoCode = match[1];
                        codeElement = node.parentElement;
                        break;
                    }
                }
            } catch(e) {
                console.warn('EMBY Checker: TreeWalker 查找失败', e);
            }
    
            // 方法2：遍历常见元素查找
            if (!videoCode) {
                try {
                    const selectors = ['p', 'div', 'span', 'li', 'td', 'strong', 'b', 'label'];
                    for (let selector of selectors) {
                        const elements = document.querySelectorAll(selector);
                        for (let el of elements) {
                            const text = el.textContent || '';
                            // 核心改进：支持中英文两种冒号 [:：]，并放宽番号匹配范围
                            const match = text.match(/番[号號][:：][[［\s]*([A-Z0-9\-]+)/i);
                            if (match && text.length < 300) {
                                videoCode = match[1];
                                codeElement = el;
                                break;
                            }
                        }
                        if (videoCode) break;
                    }
                } catch(e) {
                    console.warn('EMBY Checker: 元素遍历查找失败', e);
                }
            }
    
            // 方法3：从标题提取
            if (!videoCode) {
                try {
                    const titleMatch = document.title.match(/([A-Z]{2,10}-?\d+)/i);
                    if (titleMatch) videoCode = titleMatch[1];
                } catch(e) {
                    console.warn('EMBY Checker: 标题提取失败', e);
                }
            }
    
            // 方法4：从 URL 提取
            if (!videoCode) {
                try {
                    const urlMatch = window.location.href.match(/\/([A-Z0-9\-]+)$/i);
                    if (urlMatch) videoCode = urlMatch[1];
                } catch(e) {
                    console.warn('EMBY Checker: URL提取失败', e);
                }
            }
    
            if (!videoCode) {
                console.log('EMBY Checker: 未找到番号，尝试使用页面 ID 作为默认值');
                // 如果实在找不到番号，就使用 URL 的最后部分作为番号
                const pathMatch = window.location.pathname.match(/\/v\/([^\/]+)$/);
                if (pathMatch) {
                    videoCode = pathMatch[1];
                    console.log('EMBY Checker: 使用页面 ID 作为番号:', videoCode);
                } else {
                    console.log('EMBY Checker: 无法提取任何标识符，放弃添加按钮');
                    return;
                }
            }
    
            console.log('EMBY Checker: 找到番号:', videoCode);
            
            // 如果通过标题/URL提取到了番号，但codeElement为空，则使用更激进的策略重新在页面上查找
            if (!codeElement && videoCode) {
                console.log('EMBY Checker: 正在执行深度搜索策略...');
                try {
                    // 策略：寻找包含“番号”关键字且文本中含有实际番号的最小容器
                    const allLabels = Array.from(document.querySelectorAll('strong, b, span, label, td'));
                    for (let el of allLabels) {
                        const text = el.textContent;
                        if ((text.includes('番号') || text.includes('番號')) && text.includes(videoCode)) {
                            codeElement = el;
                            console.log('EMBY Checker: 深度搜索成功找到番号所在元素');
                            break;
                        }
                    }
                    
                    // 如果还是没找到，尝试找“番号”标签的兄弟节点
                    if (!codeElement) {
                        const labels = allLabels.filter(el => 
                            (el.textContent === '番号:' || el.textContent === '番號:' || 
                             el.textContent === '番号：' || el.textContent === '番號：')
                        );
                        if (labels.length > 0) {
                            codeElement = labels[0].parentElement;
                            console.log('EMBY Checker: 通过标签关联找到容器');
                        }
                    }
                } catch(e) {
                    console.warn('EMBY Checker: 深度搜索失败', e);
                }
            }

        // 创建按钮容器
        const searchPanel = document.createElement('div');
        searchPanel.className = 'javdb-search-panel';
        // 参考正确代码：使用 inline-flex 和 margin-left
        searchPanel.style.cssText = 'margin-left: 10px; display: inline-flex; align-items: center; gap: 6px; vertical-align: middle; flex-wrap: wrap;';

        const buttonColors = [
            { bg: '#dc3545', hover: '#c82333' },
            { bg: '#007bff', hover: '#0056b3' },
            { bg: '#28a745', hover: '#218838' },
            { bg: '#ffc107', hover: '#e0a800', text: '#000' },
            { bg: '#17a2b8', hover: '#138496' }
        ];

        SEARCH_SITES.forEach((site, index) => {
            const btn = document.createElement('button');
            btn.textContent = site.name;
            const color = buttonColors[index] || { bg: '#6c757d', hover: '#5a6268' };
            btn.style.cssText = `padding: 5px 12px; background-color: ${color.bg}; color: ${color.text || 'white'}; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s; white-space: nowrap; box-shadow: 0 1px 2px rgba(0,0,0,0.1);`;
            
            btn.addEventListener('mouseenter', function() { this.style.backgroundColor = color.hover; this.style.transform = 'translateY(-1px)'; });
            btn.addEventListener('mouseleave', function() { this.style.backgroundColor = color.bg; this.style.transform = 'translateY(0)'; });
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const url = site.format === 'path' ? site.url.replace('{code}', videoCode) : site.url.replace('{code}', encodeURIComponent(videoCode));
                window.open(url, '_blank');
            });
            searchPanel.appendChild(btn);
        });

        // 插入按钮（参考正确代码逻辑：插入到番号元素的后面）
        let inserted = false;
        
        if (codeElement && codeElement.parentNode) {
            try {
                // 正确代码逻辑：直接插入到番号所在元素的后面（同级）
                codeElement.parentNode.insertBefore(searchPanel, codeElement.nextSibling);
                inserted = true;
                console.log('EMBY Checker: 按钮已成功插入到番号元素后面');
            } catch (e) {
                console.error('EMBY Checker: 插入失败', e);
            }
        }

        // 如果插入失败，尝试插入到详情面板顶部
        if (!inserted) {
            console.log('EMBY Checker: 未找到番号元素，尝试插入到面板顶部');
            try {
                // 查找 JAVDB 详情页的主信息面板（使用更广泛的选择器）
                const mainPanel = document.querySelector('.video-meta-panel') || 
                                 document.querySelector('.movie-panel-info') ||
                                 document.querySelector('.column.is-two-thirds') ||
                                 document.querySelector('.video-detail') ||
                                 document.querySelector('.container .columns .column') ||
                                 document.querySelector('main .container');
                
                if (mainPanel) {
                    const container = document.createElement('div');
                    container.style.cssText = 'margin-bottom: 15px; background: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;';
                    container.appendChild(searchPanel);
                    mainPanel.insertBefore(container, mainPanel.firstChild);
                    inserted = true;
                    console.log('EMBY Checker: 按钮已插入到详情面板顶部');
                }
            } catch (e) {
                console.error('EMBY Checker: 插入到面板失败', e);
            }
        }
        
        // 最终兜底：如果所有方法都失败，强制显示在右上角
        if (!inserted) {
            console.log('EMBY Checker: 所有插入方法失败，使用固定定位强制显示');
            try {
                const container = document.createElement('div');
                container.className = 'javdb-search-fixed';
                container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 99999; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); max-width: 300px;';
                
                // 添加拖动功能
                const header = document.createElement('div');
                header.textContent = '🔍 搜索工具';
                header.style.cssText = 'font-weight: bold; margin-bottom: 8px; cursor: move; color: #333; font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 5px;';
                container.appendChild(header);
                container.appendChild(searchPanel);
                
                document.body.appendChild(container);
                inserted = true;
                console.log('EMBY Checker: 按钮已强制固定显示在右上角');
            } catch (e) {
                console.error('EMBY Checker: 强制固定显示也失败', e);
            }
        }
    } catch(e) {
        console.error('EMBY Checker: 添加搜索按钮失败', e);
    }
}

    // 多重启动策略确保兼容性
    function initScript() {
        console.log('EMBY Checker: initScript 被调用, readyState=', document.readyState);
        start();
        
        // 额外的延迟重试（针对动态加载的页面）
        setTimeout(() => {
            console.log('EMBY Checker: 5秒后重新尝试初始化');
            addMultiSiteSearchButtons();
            initCheck();
        }, 5000);
    }
    
    // 多种启动方式确保兼容性
    const startupMethods = [
        () => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('EMBY Checker: DOMContentLoaded 触发');
                    setTimeout(initScript, 100);
                });
            }
        },
        () => {
            if (document.readyState === 'interactive') {
                console.log('EMBY Checker: 页面处于 interactive 状态');
                setTimeout(initScript, 100);
            }
        },
        () => {
            window.addEventListener('load', () => {
                console.log('EMBY Checker: window.load 触发');
                initScript();
            });
        },
        () => {
            if (document.readyState === 'complete') {
                console.log('EMBY Checker: 页面已完全加载');
                initScript();
            }
        },
        () => {
            // 轮询检查，最多 20 次
            let pollCount = 0;
            const pollInterval = setInterval(() => {
                pollCount++;
                console.log(`EMBY Checker: 轮询检查 #${pollCount}`);
                
                if (document.body && document.querySelector('.video-meta-panel, .movie-panel-info')) {
                    console.log('EMBY Checker: 轮询检测到页面元素，开始初始化');
                    clearInterval(pollInterval);
                    initScript();
                } else if (pollCount >= 20) {
                    console.log('EMBY Checker: 轮询达到上限，强制初始化');
                    clearInterval(pollInterval);
                    initScript();
                }
            }, 500);
        }
    ];
    
    // 执行所有启动方法
    console.log('EMBY Checker: 开始执行所有启动方法');
    startupMethods.forEach((method, index) => {
        try {
            method();
        } catch(e) {
            console.error(`EMBY Checker: 启动方法 ${index} 失败`, e);
        }
    });
    
    // 最后的兼容方案：直接延迟执行
    console.log('EMBY Checker: 执行直接延迟启动');
    setTimeout(() => {
        console.log('EMBY Checker: 1秒后直接启动');
        initScript();
    }, 1000);
    setTimeout(() => {
        console.log('EMBY Checker: 3秒后直接启动');
        initScript();
    }, 3000);

    // 变动监听
    let timer;
    let buttonAttempts = 0; // 按钮添加尝试次数
    const MAX_BUTTON_ATTEMPTS = 10; // 最多尝试 10 次
    
    const observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            initCheck();
            
            // 如果按钮还未添加成功，继续尝试
            if (buttonAttempts < MAX_BUTTON_ATTEMPTS) {
                const existingButton = document.querySelector('.javdb-search-panel');
                if (!existingButton) {
                    console.log(`EMBY Checker: 检测到 DOM 变化，第 ${buttonAttempts + 1} 次尝试添加按钮`);
                    addMultiSiteSearchButtons();
                    buttonAttempts++;
                } else {
                    console.log('EMBY Checker: 按钮已存在，停止尝试');
                    buttonAttempts = MAX_BUTTON_ATTEMPTS; // 停止尝试
                }
            }
        }, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 配置变更监听：当设置中添加/修改服务器后，立即重新检查所有标签
    let lastConfigChangeTime = GM_getValue('emby_config_changed', 0);
    setInterval(() => {
        const currentConfigChangeTime = GM_getValue('emby_config_changed', 0);
        if (currentConfigChangeTime > lastConfigChangeTime) {
            console.log('EMBY Checker: 检测到配置变更，重新检查所有标签');
            lastConfigChangeTime = currentConfigChangeTime;
            
            // 重新加载配置和索引
            try {
                LIBRARY_INDEX = JSON.parse(GM_getValue('emby_library_index', '{}'));
            } catch(e) {
                LIBRARY_INDEX = {};
            }
            
            // 重新执行检查
            initCheck();
        }
    }, 1000); // 每秒检查一次配置是否变更

})();

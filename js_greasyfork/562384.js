// ==UserScript==
// @name         B站关注数据分析插件
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  智能追踪并分析B站关注用户数据，记录用户名变更历史，识别已注销账号，支持多维度数据导出与统计分析
// @author       r007b34r
// @match        https://space.bilibili.com/*/relation/follow*
// @match        https://space.bilibili.com/*/fans/follow*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562384/B%E7%AB%99%E5%85%B3%E6%B3%A8%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/562384/B%E7%AB%99%E5%85%B3%E6%B3%A8%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[B站关注数据分析] 插件已启动 v1.2.1');

    // 存储键名
    const STORAGE_KEY = 'bilibili_user_history';
    
    // 获取存储的用户历史数据
    function getUserHistory() {
        const data = GM_getValue(STORAGE_KEY, '{}');
        return JSON.parse(data);
    }
    
    // 保存用户历史数据
    function saveUserHistory(history) {
        GM_setValue(STORAGE_KEY, JSON.stringify(history));
    }
    
    // 迁移旧版本数据到新格式
    function migrateOldData() {
        const history = getUserHistory();
        let migrated = false;
        
        Object.entries(history).forEach(([mid, data]) => {
            // 检测旧格式：只有 uname 和 lastSeen
            if (data.uname && !data.currentName) {
                history[mid] = {
                    mid: mid,
                    currentName: data.uname,
                    firstSeenName: data.uname,
                    firstSeen: data.lastSeen,
                    lastSeen: data.lastSeen,
                    lastChanged: data.lastSeen,
                    seenCount: 1,
                    nameHistory: [],
                    isDeleted: false
                };
                migrated = true;
                console.log(`[数据迁移] UID: ${mid}, 用户名: ${data.uname}`);
            }
        });
        
        if (migrated) {
            saveUserHistory(history);
            console.log('[数据迁移] 完成！已将旧格式数据转换为新格式');
        }
    }
    
    // 启动时执行数据迁移
    migrateOldData();
    
    // 更新用户信息
    function updateUserInfo(mid, uname) {
        if (!mid || !uname || uname === '账号已注销' || uname === '已注销') return;
        
        const history = getUserHistory();
        const now = Date.now();
        
        // 如果用户已存在，保留历史记录
        if (history[mid]) {
            const oldData = history[mid];
            
            // 检查用户名是否变化
            if (oldData.currentName !== uname) {
                // 用户名发生变化，添加到历史记录
                if (!oldData.nameHistory) {
                    oldData.nameHistory = [];
                }
                
                // 如果历史记录中没有当前名称，添加进去
                const lastHistoryName = oldData.nameHistory.length > 0 ? 
                    oldData.nameHistory[oldData.nameHistory.length - 1].name : oldData.firstSeenName;
                
                if (lastHistoryName !== oldData.currentName) {
                    oldData.nameHistory.push({
                        name: oldData.currentName,
                        changedAt: now
                    });
                }
                
                oldData.currentName = uname;
                oldData.lastChanged = now;
            }
            
            oldData.lastSeen = now;
            oldData.seenCount = (oldData.seenCount || 1) + 1;
            
            history[mid] = oldData;
        } else {
            // 新用户
            history[mid] = {
                mid: mid,
                currentName: uname,
                firstSeenName: uname,
                firstSeen: now,
                lastSeen: now,
                lastChanged: now,
                seenCount: 1,
                nameHistory: [],
                isDeleted: false
            };
        }
        
        saveUserHistory(history);
        console.log(`[记录] UID: ${mid}, 用户名: ${uname}`);
    }
    
    // 获取用户历史名称
    function getHistoricalName(mid) {
        const history = getUserHistory();
        if (!history[mid]) return null;
        
        const userData = history[mid];
        // 兼容旧版本数据格式
        return userData.currentName || userData.uname || null;
    }
    
    // 标记用户为已注销
    function markUserAsDeleted(mid) {
        const history = getUserHistory();
        if (history[mid]) {
            history[mid].isDeleted = true;
            history[mid].deletedAt = Date.now();
            saveUserHistory(history);
        }
    }
    
    // 拦截 fetch 请求来获取关注列表数据
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            // 克隆响应以便我们可以读取它
            const clonedResponse = response.clone();
            
            // 检查是否是关注列表API
            if (args[0] && typeof args[0] === 'string' && 
                (args[0].includes('/x/relation/followings') || 
                 args[0].includes('/x/relation/tags'))) {
                
                clonedResponse.json().then(data => {
                    if (data && data.data && data.data.list) {
                        console.log(`[API拦截] 获取到 ${data.data.list.length} 个关注用户`);
                        data.data.list.forEach(user => {
                            if (user.mid && user.uname) {
                                updateUserInfo(user.mid, user.uname);
                            }
                        });
                    }
                }).catch(err => {
                    console.log('[API拦截] 解析失败:', err);
                });
            }
            
            return response;
        });
    };
    
    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalOpen.apply(this, [method, url, ...rest]);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            if (this._url && 
                (this._url.includes('/x/relation/followings') || 
                 this._url.includes('/x/relation/tags'))) {
                try {
                    const data = JSON.parse(this.responseText);
                    if (data && data.data && data.data.list) {
                        console.log(`[XHR拦截] 获取到 ${data.data.list.length} 个关注用户`);
                        data.data.list.forEach(user => {
                            if (user.mid && user.uname) {
                                updateUserInfo(user.mid, user.uname);
                            }
                        });
                    }
                } catch (err) {
                    console.log('[XHR拦截] 解析失败:', err);
                }
            }
        });
        return originalSend.apply(this, args);
    };

    
    // DOM监听 - 处理页面上的已注销用户显示
    function startDOMObserver() {
        // 检测是否为已注销用户的多种方式
        function isDeletedUser(element) {
            const textContent = element.textContent || '';
            return textContent.includes('账号已注销') || 
                   textContent.includes('已注销') ||
                   textContent.includes('注销');
        }
        
        // 从元素中提取用户ID
        function extractMid(element) {
            // 方法1: 从href中提取
            const links = element.querySelectorAll('a[href*="space.bilibili.com"]');
            for (let link of links) {
                const match = link.href.match(/space\.bilibili\.com\/(\d+)/);
                if (match) return match[1];
            }
            
            // 方法2: 从data属性中提取
            const dataAttrs = ['data-mid', 'data-user-id', 'data-uid'];
            for (let attr of dataAttrs) {
                const value = element.getAttribute(attr);
                if (value) return value;
                
                const child = element.querySelector(`[${attr}]`);
                if (child) return child.getAttribute(attr);
            }
            
            return null;
        }
        
        // 处理单个用户卡片
        function processUserCard(card) {
            if (card._processed) return;
            card._processed = true;
            
            const mid = extractMid(card);
            if (!mid) return;
            
            if (isDeletedUser(card)) {
                const historicalName = getHistoricalName(mid);
                if (historicalName) {
                    // 查找用户名元素
                    const selectors = [
                        '.fans-name',
                        '.list-item__name', 
                        '.bili-user-profile__name',
                        '.name',
                        '[class*="name"]'
                    ];
                    
                    for (let selector of selectors) {
                        const nameElement = card.querySelector(selector);
                        if (nameElement && !nameElement.querySelector('.deleted-marker')) {
                            const originalText = nameElement.textContent.trim();
                            if (originalText.includes('已注销')) {
                                // 标记为已注销
                                markUserAsDeleted(mid);
                                
                                nameElement.innerHTML = `
                                    <span style="color: #999; text-decoration: line-through;">${historicalName}</span>
                                    <span class="deleted-marker" style="color: #f25d8e; font-size: 12px; margin-left: 5px;">(已注销)</span>
                                `;
                                nameElement.title = `注销前用户名: ${historicalName}\nUID: ${mid}`;
                                console.log(`[显示] 已注销用户 ${mid} 的历史名称: ${historicalName}`);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        // 查找并处理所有用户卡片
        function scanForUserCards() {
            const selectors = [
                '.fans-item',
                '.list-item',
                '.bili-user-profile',
                '[class*="follow"]',
                '[class*="user-card"]',
                '[class*="user-item"]'
            ];
            
            selectors.forEach(selector => {
                const cards = document.querySelectorAll(selector);
                cards.forEach(card => processUserCard(card));
            });
        }
        
        // 初始扫描
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(scanForUserCards, 1000);
            });
        } else {
            setTimeout(scanForUserCards, 1000);
        }
        
        // 监听DOM变化
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        shouldScan = true;
                    }
                });
            });
            
            if (shouldScan) {
                scanForUserCards();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 定期扫描
        setInterval(scanForUserCards, 3000);
        
        console.log('[DOM监听] 已启动');
    }
    
    // 等待页面加载后启动DOM监听
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startDOMObserver);
    } else {
        startDOMObserver();
    }

    
    // 通过API检查用户是否存在
    function checkUserExists(mid, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.bilibili.com/x/space/acc/info?mid=${mid}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 0 && data.data) {
                        callback(true, data.data.name);
                    } else {
                        callback(false, null);
                    }
                } catch (error) {
                    console.error('[API检查] 失败:', error);
                    callback(null, null);
                }
            },
            onerror: function() {
                callback(null, null);
            }
        });
    }
    
    // 导出数据（增强版）
    function exportData() {
        const history = getUserHistory();
        
        // 转换为更友好的格式
        const exportData = {
            exportTime: new Date().toISOString(),
            exportTimeReadable: new Date().toLocaleString('zh-CN'),
            totalUsers: Object.keys(history).length,
            users: Object.entries(history).map(([mid, data]) => {
                // 兼容旧版本数据格式
                const currentName = data.currentName || data.uname || '未知';
                const firstSeenName = data.firstSeenName || data.uname || currentName;
                const firstSeen = data.firstSeen || data.lastSeen;
                const lastSeen = data.lastSeen;
                const lastChanged = data.lastChanged || firstSeen;
                
                return {
                    uid: mid,
                    currentName: currentName,
                    firstSeenName: firstSeenName,
                    firstSeen: firstSeen ? new Date(firstSeen).toLocaleString('zh-CN') : '未知',
                    lastSeen: lastSeen ? new Date(lastSeen).toLocaleString('zh-CN') : '未知',
                    lastChanged: lastChanged ? new Date(lastChanged).toLocaleString('zh-CN') : null,
                    seenCount: data.seenCount || 1,
                    isDeleted: data.isDeleted || false,
                    deletedAt: data.deletedAt ? new Date(data.deletedAt).toLocaleString('zh-CN') : null,
                    nameHistory: (data.nameHistory || []).map(h => ({
                        name: h.name,
                        changedAt: new Date(h.changedAt).toLocaleString('zh-CN')
                    })),
                    profileUrl: `https://space.bilibili.com/${mid}`
                };
            })
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bilibili_user_history_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert(`数据已导出！\n共 ${exportData.totalUsers} 个用户`);
    }
    
    // 导出为CSV格式
    function exportDataAsCSV() {
        const history = getUserHistory();
        
        // CSV表头
        let csv = '\uFEFF'; // UTF-8 BOM
        csv += 'UID,当前用户名,首次见到的用户名,首次见到时间,最后见到时间,见到次数,是否已注销,注销时间,改名次数,个人空间链接\n';
        
        // 数据行
        Object.entries(history).forEach(([mid, data]) => {
            // 兼容旧版本数据格式
            const currentName = data.currentName || data.uname || '未知';
            const firstSeenName = data.firstSeenName || data.uname || currentName;
            const firstSeen = data.firstSeen || data.lastSeen;
            const lastSeen = data.lastSeen;
            const seenCount = data.seenCount || 1;
            const isDeleted = data.isDeleted ? '是' : '否';
            const deletedAt = data.deletedAt ? new Date(data.deletedAt).toLocaleString('zh-CN') : '';
            const nameChangeCount = (data.nameHistory || []).length;
            
            // 格式化时间
            const firstSeenStr = firstSeen ? new Date(firstSeen).toLocaleString('zh-CN') : '未知';
            const lastSeenStr = lastSeen ? new Date(lastSeen).toLocaleString('zh-CN') : '未知';
            
            csv += `${mid},"${currentName}","${firstSeenName}","${firstSeenStr}","${lastSeenStr}",${seenCount},${isDeleted},"${deletedAt}",${nameChangeCount},https://space.bilibili.com/${mid}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bilibili_user_history_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        alert(`CSV数据已导出！\n可用Excel打开查看`);
    }
    
    // 导出已注销用户列表
    function exportDeletedUsers() {
        const history = getUserHistory();
        const deletedUsers = Object.entries(history)
            .filter(([_, data]) => data.isDeleted)
            .map(([mid, data]) => {
                const firstSeen = data.firstSeen || data.lastSeen;
                return {
                    uid: mid,
                    lastKnownName: data.currentName || data.uname || '未知',
                    deletedAt: data.deletedAt ? new Date(data.deletedAt).toLocaleString('zh-CN') : '未知',
                    firstSeen: firstSeen ? new Date(firstSeen).toLocaleString('zh-CN') : '未知',
                    nameHistory: (data.nameHistory || []).map(h => ({
                        name: h.name,
                        changedAt: new Date(h.changedAt).toLocaleString('zh-CN')
                    }))
                };
            });
        
        if (deletedUsers.length === 0) {
            alert('暂无已注销用户记录');
            return;
        }
        
        const exportData = {
            exportTime: new Date().toLocaleString('zh-CN'),
            totalDeletedUsers: deletedUsers.length,
            deletedUsers: deletedUsers
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bilibili_deleted_users_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert(`已导出 ${deletedUsers.length} 个已注销用户`);
    }

    
    // 导入数据
    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    const currentHistory = getUserHistory();
                    const mergedHistory = { ...currentHistory, ...data };
                    saveUserHistory(mergedHistory);
                    alert(`成功导入 ${Object.keys(data).length} 条用户记录！`);
                    location.reload();
                } catch (error) {
                    alert('导入失败：文件格式错误');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    // 显示统计信息
    function showStats() {
        const history = getUserHistory();
        const users = Object.values(history);
        const count = users.length;
        
        if (count === 0) {
            alert('暂无数据\n\n请访问关注列表页面，脚本会自动记录用户名。\n或使用"手动获取关注列表"功能主动抓取数据。');
            return;
        }
        
        // 统计信息
        const deletedCount = users.filter(u => u.isDeleted).length;
        const nameChangedCount = users.filter(u => (u.nameHistory || []).length > 0).length;
        
        const oldestRecord = users.reduce((oldest, current) => {
            const time = current.firstSeen || current.lastSeen;
            const oldestTime = oldest ? (oldest.firstSeen || oldest.lastSeen) : null;
            return !oldestTime || time < oldestTime ? current : oldest;
        }, null);
        
        const newestRecord = users.reduce((newest, current) => {
            const time = current.lastSeen;
            const newestTime = newest ? newest.lastSeen : null;
            return !newestTime || time > newestTime ? current : newest;
        }, null);
        
        let message = `📊 数据统计\n\n`;
        message += `总用户数: ${count}\n`;
        message += `已注销用户: ${deletedCount}\n`;
        message += `改过名的用户: ${nameChangedCount}\n`;
        message += `存储大小: ${(JSON.stringify(history).length / 1024).toFixed(2)} KB\n\n`;
        
        if (oldestRecord) {
            const oldestTime = oldestRecord.firstSeen || oldestRecord.lastSeen;
            message += `最早记录: ${new Date(oldestTime).toLocaleString('zh-CN')}\n`;
            message += `用户: ${oldestRecord.currentName || oldestRecord.uname}\n\n`;
        }
        
        if (newestRecord) {
            message += `最新记录: ${new Date(newestRecord.lastSeen).toLocaleString('zh-CN')}\n`;
            message += `用户: ${newestRecord.currentName || newestRecord.uname}\n`;
        }
        
        alert(message);
    }
    
    // 查看改名历史
    function viewNameChangeHistory() {
        const history = getUserHistory();
        const changedUsers = Object.entries(history)
            .filter(([_, data]) => (data.nameHistory || []).length > 0)
            .map(([mid, data]) => {
                const changes = data.nameHistory.map(h => 
                    `  ${h.name} (${new Date(h.changedAt).toLocaleString('zh-CN')})`
                ).join('\n');
                return `UID: ${mid}\n当前: ${data.currentName}\n历史:\n${changes}\n`;
            });
        
        if (changedUsers.length === 0) {
            alert('暂无改名记录');
            return;
        }
        
        const message = `改名用户列表 (共${changedUsers.length}个)\n\n` + changedUsers.slice(0, 10).join('\n---\n');
        alert(message + (changedUsers.length > 10 ? '\n\n...(仅显示前10个)' : ''));
    }
    
    // 清除所有数据
    function clearAllData() {
        if (confirm('确定要清除所有已保存的用户名数据吗？此操作不可恢复！')) {
            saveUserHistory({});
            alert('数据已清除！');
            location.reload();
        }
    }
    
    // 手动触发API获取
    function manualFetchFollowings() {
        const match = location.pathname.match(/\/(\d+)\//);
        if (!match) {
            alert('无法获取当前用户ID');
            return;
        }
        
        const vmid = match[1];
        let page = 1;
        let totalFetched = 0;
        
        function fetchPage() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/relation/followings?vmid=${vmid}&pn=${page}&ps=50`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data && data.data.list) {
                            data.data.list.forEach(user => {
                                if (user.mid && user.uname) {
                                    updateUserInfo(user.mid, user.uname);
                                    totalFetched++;
                                }
                            });
                            
                            console.log(`[手动获取] 第${page}页，已获取 ${totalFetched} 个用户`);
                            
                            // 如果还有更多数据，继续获取
                            if (data.data.list.length === 50) {
                                page++;
                                setTimeout(fetchPage, 500); // 延迟避免请求过快
                            } else {
                                alert(`获取完成！共记录 ${totalFetched} 个用户`);
                            }
                        } else {
                            alert('获取失败：' + (data.message || '未知错误'));
                        }
                    } catch (error) {
                        alert('获取失败：' + error.message);
                        console.error(error);
                    }
                },
                onerror: function() {
                    alert('网络请求失败');
                }
            });
        }
        
        if (confirm('将主动获取当前页面用户的所有关注列表，可能需要一些时间。是否继续？')) {
            fetchPage();
        }
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('📊 查看统计信息', showStats);
    GM_registerMenuCommand('📜 查看改名历史', viewNameChangeHistory);
    GM_registerMenuCommand('🔄 手动获取关注列表', manualFetchFollowings);
    GM_registerMenuCommand('📤 导出数据(JSON)', exportData);
    GM_registerMenuCommand('📊 导出数据(CSV)', exportDataAsCSV);
    GM_registerMenuCommand('🗑️ 导出已注销用户', exportDeletedUsers);
    GM_registerMenuCommand('📥 导入数据', importData);
    GM_registerMenuCommand('🗑️ 清除所有数据', clearAllData);
    
})();

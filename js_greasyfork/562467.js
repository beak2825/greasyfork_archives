// ==UserScript==
// @name         V2EX Node Helper
// @name:zh-CN   V2EX 节点辅助器
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  V2EX node helper with coin display, reply tracking, topic ignore/note features
// @description:zh-CN  V2EX 节点辅助器：显示钻石打赏、回复标识、主题忽略/备注等功能
// @author       timespy
// @license      MIT
// @match        https://www.v2ex.com/
// @match        https://www.v2ex.com/?tab=*
// @match        https://www.v2ex.com/go/*
// @match        https://www.v2ex.com/t/*
// @match        https://v2ex.com/
// @match        https://v2ex.com/?tab=*
// @match        https://v2ex.com/go/*
// @match        https://v2ex.com/t/*
// @match        https://cn.v2ex.com/
// @match        https://cn.v2ex.com/?tab=*
// @match        https://cn.v2ex.com/go/*
// @match        https://cn.v2ex.com/t/*
// @match        https://fast.v2ex.com/
// @match        https://fast.v2ex.com/?tab=*
// @match        https://fast.v2ex.com/go/*
// @match        https://fast.v2ex.com/t/*
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?tab=*
// @match        https://*.v2ex.com/go/*
// @match        https://*.v2ex.com/t/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      v2ex.com
// @connect      *.v2ex.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562467/V2EX%20Node%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562467/V2EX%20Node%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置和缓存管理 ==========
    
    // 默认配置
    const DEFAULT_CONFIG = {
        cacheTime: 5 // 缓存时间（分钟）
    };
    
    // 获取配置
    function getConfig() {
        const config = GM_getValue('v2ex_coin_config', DEFAULT_CONFIG);
        return Object.assign({}, DEFAULT_CONFIG, config);
    }
    
    // 保存配置
    function saveConfig(config) {
        GM_setValue('v2ex_coin_config', config);
    }
    
    // 获取当前登录用户名
    function getCurrentUsername() {
        const cached = GM_getValue('v2ex_current_username', null);
        if (cached) return cached;
        
        // 从页面右侧栏提取用户名
        const rightbar = document.getElementById('Rightbar');
        if (rightbar) {
            const userLink = rightbar.querySelector('.bigger a[href^="/member/"]');
            if (userLink) {
                const username = userLink.textContent.trim();
                // 保存到永久缓存
                GM_setValue('v2ex_current_username', username);
                console.log(`✓ 检测到当前用户: ${username}`);
                return username;
            }
        }
        return null;
    }
    
    // 获取缓存
    function getCache() {
        return GM_getValue('v2ex_coin_cache', {});
    }
    
    // 保存缓存
    function saveCache(cache) {
        GM_setValue('v2ex_coin_cache', cache);
    }
    
    // ========== 忽略和备注管理 ==========
    
    // 获取忽略的主题列表
    function getIgnoredTopics() {
        return GM_getValue('v2ex_ignored_topics', {});
    }
    
    // 保存忽略的主题列表
    function saveIgnoredTopics(ignored) {
        GM_setValue('v2ex_ignored_topics', ignored);
    }
    
    // 忽略主题
    function ignoreTopic(topicId) {
        const ignored = getIgnoredTopics();
        ignored[topicId] = Date.now();
        saveIgnoredTopics(ignored);
    }
    
    // 取消忽略主题
    function unignoreTopic(topicId) {
        const ignored = getIgnoredTopics();
        delete ignored[topicId];
        saveIgnoredTopics(ignored);
    }
    
    // 检查主题是否被忽略
    function isTopicIgnored(topicId) {
        const ignored = getIgnoredTopics();
        return !!ignored[topicId];
    }
    
    // 获取主题备注
    function getTopicNotes() {
        return GM_getValue('v2ex_topic_notes', {});
    }
    
    // 保存主题备注
    function saveTopicNotes(notes) {
        GM_setValue('v2ex_topic_notes', notes);
    }
    
    // 设置主题备注
    function setTopicNote(topicId, note) {
        const notes = getTopicNotes();
        if (note && note.trim()) {
            notes[topicId] = {
                content: note.trim(),
                timestamp: Date.now()
            };
        } else {
            delete notes[topicId];
        }
        saveTopicNotes(notes);
    }
    
    // 获取主题备注
    function getTopicNote(topicId) {
        const notes = getTopicNotes();
        return notes[topicId];
    }
    
    // 从缓存获取数据
    function getCachedData(topicId, includeExpired = false) {
        const cache = getCache();
        const config = getConfig();
        const cached = cache[topicId];
        
        if (!cached) return null;
        
        const now = Date.now();
        const cacheAge = (now - cached.timestamp) / 1000 / 60; // 分钟
        
        if (cacheAge > config.cacheTime) {
            // 缓存过期
            if (includeExpired) {
                return { data: cached.data, expired: true };
            }
            return null;
        }
        
        return { data: cached.data, expired: false };
    }
    
    // 保存数据到缓存
    function setCachedData(topicId, data) {
        const cache = getCache();
        cache[topicId] = {
            data: data,
            timestamp: Date.now()
        };
        saveCache(cache);
    }
    
    // 清除所有缓存
    function clearAllCache() {
        GM_setValue('v2ex_coin_cache', {});
        console.log('缓存已清除');
        alert('缓存已清除！刷新页面后将重新获取数据。');
    }
    
    // 清除过期缓存
    function clearExpiredCache() {
        const cache = getCache();
        const config = getConfig();
        const now = Date.now();
        const newCache = {};
        let clearedCount = 0;
        
        for (const [topicId, item] of Object.entries(cache)) {
            const cacheAge = (now - item.timestamp) / 1000 / 60;
            if (cacheAge <= config.cacheTime) {
                newCache[topicId] = item;
            } else {
                clearedCount++;
            }
        }
        
        saveCache(newCache);
        return clearedCount;
    }
    
    // 显示配置对话框
    function showConfigDialog() {
        const config = getConfig();
        const newTime = prompt(
            '请输入缓存时间（分钟）：\n' +
            '设置后，在此时间内不会重复获取同一主题的数据。\n\n' +
            '当前设置: ' + config.cacheTime + ' 分钟',
            config.cacheTime
        );
        
        if (newTime !== null) {
            const time = parseInt(newTime);
            if (isNaN(time) || time < 0) {
                alert('请输入有效的数字！');
                return;
            }
            
            config.cacheTime = time;
            saveConfig(config);
            alert('配置已保存！缓存时间设置为 ' + time + ' 分钟。');
        }
    }
    
    // 显示缓存统计
    function showCacheStats() {
        const cache = getCache();
        const config = getConfig();
        const now = Date.now();
        let validCount = 0;
        let expiredCount = 0;
        
        for (const item of Object.values(cache)) {
            const cacheAge = (now - item.timestamp) / 1000 / 60;
            if (cacheAge <= config.cacheTime) {
                validCount++;
            } else {
                expiredCount++;
            }
        }
        
        alert(
            '缓存统计信息：\n\n' +
            '有效缓存: ' + validCount + ' 条\n' +
            '过期缓存: ' + expiredCount + ' 条\n' +
            '总缓存: ' + Object.keys(cache).length + ' 条\n\n' +
            '当前缓存时间: ' + config.cacheTime + ' 分钟'
        );
    }
    
    // 管理忽略的主题
    function manageIgnoredTopics() {
        const ignored = getIgnoredTopics();
        const count = Object.keys(ignored).length;
        
        if (count === 0) {
            alert('没有忽略的主题');
            return;
        }
        
        const topicIds = Object.keys(ignored).join(', ');
        const message = `当前忽略了 ${count} 个主题：\n\n${topicIds}\n\n是否清除所有忽略？`;
        
        if (confirm(message)) {
            GM_setValue('v2ex_ignored_topics', {});
            alert('已清除所有忽略的主题！刷新页面生效。');
            location.reload();
        }
    }
    
    // 管理主题备注
    function manageTopicNotes() {
        const notes = getTopicNotes();
        const count = Object.keys(notes).length;
        
        if (count === 0) {
            alert('没有主题备注');
            return;
        }
        
        let message = `当前有 ${count} 个主题备注：\n\n`;
        for (const [topicId, noteData] of Object.entries(notes)) {
            message += `主题 ${topicId}: ${noteData.content}\n`;
        }
        message += '\n是否清除所有备注？';
        
        if (confirm(message)) {
            GM_setValue('v2ex_topic_notes', {});
            alert('已清除所有主题备注！刷新页面生效。');
            location.reload();
        }
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('⚙️ 设置缓存时间', showConfigDialog);
    GM_registerMenuCommand('🗑️ 清除所有缓存', clearAllCache);
    GM_registerMenuCommand('📊 查看缓存统计', showCacheStats);
    GM_registerMenuCommand('🚫 管理忽略的主题', manageIgnoredTopics);
    GM_registerMenuCommand('📝 管理主题备注', manageTopicNotes);
    
    // 页面加载时清理过期缓存
    const clearedCount = clearExpiredCache();
    if (clearedCount > 0) {
        console.log(`已清理 ${clearedCount} 条过期缓存`);
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .v2ex-coin-info {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-left: 10px;
            font-size: 12px;
        }
        .v2ex-coin-diamond {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            color: #4a90e2;
            background: rgba(74, 144, 226, 0.1);
            padding: 2px 6px;
            border-radius: 3px;
        }
        .v2ex-coin-tip {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            color: #f39c12;
            background: rgba(243, 156, 18, 0.1);
            padding: 2px 6px;
            border-radius: 3px;
        }
        .v2ex-replied-badge {
            display: inline;
            color: #27ae60;
            font-weight: bold;
            margin-left: 4px;
            cursor: help;
        }
        .v2ex-topic-actions {
            display: inline-flex;
            gap: 5px;
            margin-left: 8px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .cell:hover .v2ex-topic-actions {
            opacity: 1;
        }
        .v2ex-action-btn {
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            color: #666;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            transition: all 0.2s;
        }
        .v2ex-action-btn:hover {
            background: rgba(0, 0, 0, 0.1);
            color: #333;
        }
        .v2ex-topic-note {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 8px;
            background: #fff3cd;
            color: #856404;
            border-radius: 3px;
            font-size: 12px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .v2ex-topic-ignored {
            opacity: 0.3;
        }
        .v2ex-coin-cached {
            opacity: 0.8;
        }
        .v2ex-coin-updating {
            animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.5; }
        }
        .v2ex-coin-loading {
            color: #999;
            font-size: 11px;
        }
        .v2ex-coin-error {
            color: #e74c3c;
            font-size: 11px;
        }
    `;
    document.head.appendChild(style);

    // 提取钻石数据的函数
    function parseCoinData(html, topicId) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取钻石数（没有找到则为 null）
        let diamond = null;
        const coinWidget = doc.querySelector('.coin-widget-amount');
        if (coinWidget) {
            diamond = coinWidget.textContent.trim();
        }
        
        // 检查当前用户是否回复过，并统计回复数量
        let hasReplied = false;
        let replyCount = 0;
        const currentUsername = getCurrentUsername();
        if (currentUsername) {
            // 查找所有回复框中的用户链接（回复的 ID 格式为 r_数字）
            const replyCells = doc.querySelectorAll('#Main .cell[id^="r_"]');
            for (const replyCell of replyCells) {
                // 在每个回复中查找用户链接
                const userLink = replyCell.querySelector('a[href^="/member/"].dark');
                if (userLink) {
                    const username = userLink.getAttribute('href').replace('/member/', '');
                    if (username === currentUsername) {
                        hasReplied = true;
                        replyCount++;
                    }
                }
            }
            if (hasReplied) {
                console.log(`✓ 找到 ${replyCount} 条回复`);
            } else {
                console.log(`⚠️ 未在回复中找到用户 ${currentUsername}`);
            }
        }
        
        // 提取打赏数据
        let tipAmount = '0';
        let tipCount = 0;
        
        // 方法1: 从 tip-summary 提取
        const tipSummary = doc.querySelector('.tip-summary');
        if (tipSummary) {
            const text = tipSummary.textContent;
            // 匹配 "打赏了 XX $V2EX" 或类似格式
            const match = text.match(/(\d+)\s*\$V2EX/);
            if (match) {
                tipAmount = match[1];
                tipCount = 1;
            }
        }
        
        // 方法2: 查找所有打赏记录
        const patronage = doc.querySelectorAll('.patronage a');
        if (patronage.length > 0) {
            tipCount = patronage.length;
        }
        
        // 方法3: 尝试从 inner 容器获取总打赏
        const innerDivs = doc.querySelectorAll('#topic-tip-box .inner');
        if (innerDivs.length > 0) {
            innerDivs.forEach(div => {
                const text = div.textContent;
                const totalMatch = text.match(/(\d+)\s*\$V2EX/g);
                if (totalMatch && totalMatch.length > 0) {
                    // 提取所有数字并求和
                    let sum = 0;
                    totalMatch.forEach(m => {
                        const num = m.match(/(\d+)/);
                        if (num) sum += parseInt(num[1]);
                    });
                    if (sum > 0) tipAmount = sum.toString();
                }
            });
        }
        
        return {
            diamond: diamond,
            tipAmount: tipAmount,
            tipCount: tipCount,
            hasReplied: hasReplied,
            replyCount: replyCount
        };
    }

    // 获取主题详情数据
    function fetchTopicData(topicId, topicLink) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: topicLink,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = parseCoinData(response.responseText, topicId);
                        resolve(data);
                    } else {
                        reject(new Error('请求失败'));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 创建显示元素（钻石和打赏）
    function createCoinInfoElement(data) {
        const container = document.createElement('span');
        container.className = 'v2ex-coin-info';
        
        // 钻石信息（只有当有数据时才显示）
        if (data.diamond !== null && data.diamond !== undefined && data.diamond !== '') {
            const diamondSpan = document.createElement('span');
            diamondSpan.className = 'v2ex-coin-diamond';
            diamondSpan.innerHTML = `💎 ${data.diamond}`;
            diamondSpan.title = `楼主钻石: ${data.diamond}`;
            container.appendChild(diamondSpan);
        }
        
        // 打赏信息（如果有的话）
        if (data.tipAmount && parseFloat(data.tipAmount) > 0) {
            const tipSpan = document.createElement('span');
            tipSpan.className = 'v2ex-coin-tip';
            tipSpan.innerHTML = `🎁 ${data.tipAmount}`;
            tipSpan.title = `被打赏: ${data.tipAmount} $V2EX`;
            container.appendChild(tipSpan);
        }
        
        return container;
    }
    
    // 初始化 tippy
    function initTippy(element) {
        try {
            // 尝试使用 V2EX 的 tippy 实例
            if (typeof tippy !== 'undefined') {
                tippy(element, {
                    content: element.getAttribute('data-original-title'),
                    theme: 'light',
                    arrow: true
                });
                console.log('✓ Tippy 初始化成功');
            }
        } catch (e) {
            console.log('⚠️ Tippy 初始化失败:', e);
        }
    }
    
    // 创建已回复标识元素
    function createRepliedBadge(replyCount) {
        const badge = document.createElement('span');
        badge.className = 'v2ex-replied-badge';
        badge.innerHTML = ` ✓`;
        
        // 确保 replyCount 是有效数字
        const count = parseInt(replyCount) || 0;
        
        const titleText = count > 0 ? `你已回复 ${count} 条` : `你已回复过此主题`;
        
        // 设置 V2EX tippy 需要的属性
        badge.setAttribute('data-original-title', titleText);
        badge.setAttribute('data-tippy', '');
        badge.title = titleText; // 备用
        
        console.log(`🔖 创建回复标识，回复数: ${count}, title: ${titleText}`);
        return badge;
    }

    // 处理单个主题
    async function processTopicCell(cell) {
        // 获取主题链接
        const topicLinkElement = cell.querySelector('.topic-link');
        if (!topicLinkElement) return;
        
        const href = topicLinkElement.getAttribute('href').split('#')[0];
        // 检查是否已经是完整 URL，如果不是则使用当前域名
        const topicLink = href.startsWith('http') ? href : window.location.origin + href;
        const topicId = topicLinkElement.id.replace('topic-link-', '');
        
        // 检查是否被忽略
        if (isTopicIgnored(topicId)) {
            cell.style.display = 'none';
            return;
        }
        
        // 找到 topic_info 和主题作者
        const topicInfo = cell.querySelector('.topic_info');
        if (!topicInfo) return;
        
        // 检查是否已经添加过
        if (topicInfo.querySelector('.v2ex-coin-info, .v2ex-coin-loading')) return;
        
        // 找到主题标题容器（用于插入已回复标识和操作按钮）
        const itemTitle = cell.querySelector('.item_title');
        
        // 先显示备注（如果有），确保备注在最前面
        const noteData = getTopicNote(topicId);
        if (noteData && itemTitle && !itemTitle.querySelector('.v2ex-topic-note')) {
            const noteSpan = document.createElement('span');
            noteSpan.className = 'v2ex-topic-note';
            noteSpan.textContent = noteData.content;
            noteSpan.title = `备注: ${noteData.content}`;
            itemTitle.appendChild(noteSpan);
        }
        
        // 找到主题作者链接（第一个 strong > a）
        const authorLink = topicInfo.querySelector('strong a');
        if (!authorLink) return;
        
        const authorStrong = authorLink.parentElement;
        
        // 添加操作按钮（在所有情况下都需要显示）
        if (itemTitle && !itemTitle.querySelector('.v2ex-topic-actions')) {
            const actionsContainer = document.createElement('span');
            actionsContainer.className = 'v2ex-topic-actions';
            
            // 忽略按钮
            const ignoreBtn = document.createElement('button');
            ignoreBtn.className = 'v2ex-action-btn';
            ignoreBtn.textContent = '🚫';
            ignoreBtn.title = '忽略此主题';
            ignoreBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('确定要忽略这个主题吗？')) {
                    ignoreTopic(topicId);
                    cell.style.display = 'none';
                }
            };
            
            // 备注按钮
            const noteBtn = document.createElement('button');
            noteBtn.className = 'v2ex-action-btn';
            noteBtn.textContent = '📝';
            noteBtn.title = '添加备注';
            noteBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const existingNote = getTopicNote(topicId);
                const note = prompt('请输入备注（留空则删除）:', existingNote ? existingNote.content : '');
                if (note !== null) {
                    setTopicNote(topicId, note);
                    location.reload();
                }
            };
            
            actionsContainer.appendChild(ignoreBtn);
            actionsContainer.appendChild(noteBtn);
            itemTitle.appendChild(actionsContainer);
        }
        
        // 先检查缓存（包括过期的）
        const cacheResult = getCachedData(topicId, true);
        let displayedCoinInfo = null;
        
        if (cacheResult && !cacheResult.expired) {
            // 有效缓存，直接显示并返回
            
            // 插入已回复标识到标题后面（在操作按钮之前）
            if (cacheResult.data.hasReplied && itemTitle && !itemTitle.querySelector('.v2ex-replied-badge')) {
                const repliedBadge = createRepliedBadge(cacheResult.data.replyCount);
                const originalTitle = repliedBadge.getAttribute('data-original-title');
                const newTitle = originalTitle + ' (来自缓存)';
                repliedBadge.setAttribute('data-original-title', newTitle);
                repliedBadge.title = newTitle;
                
                // 插入到操作按钮之前
                const actionsContainer = itemTitle.querySelector('.v2ex-topic-actions');
                if (actionsContainer) {
                    itemTitle.insertBefore(repliedBadge, actionsContainer);
                } else {
                    itemTitle.appendChild(repliedBadge);
                }
                console.log(`✅ 显示缓存的回复标识: ${newTitle}`);
                
                // 初始化 tippy
                setTimeout(() => initTippy(repliedBadge), 100);
            }
            
            // 插入钻石/打赏信息到作者后面
            const coinInfo = createCoinInfoElement(cacheResult.data);
            if (coinInfo.children.length > 0) {
                coinInfo.classList.add('v2ex-coin-cached');
                const diamondSpan = coinInfo.querySelector('.v2ex-coin-diamond');
                const tipSpan = coinInfo.querySelector('.v2ex-coin-tip');
                if (diamondSpan) {
                    diamondSpan.title = diamondSpan.title + ' (来自缓存)';
                }
                if (tipSpan) {
                    tipSpan.title = tipSpan.title + ' (来自缓存)';
                }
                authorStrong.parentNode.insertBefore(coinInfo, authorStrong.nextSibling);
            }
            return;
        }
        
        if (cacheResult && cacheResult.expired) {
            // 缓存已过期，但先显示旧数据（如果有内容）
            
            // 先显示已回复标识（如果有，在操作按钮之前）
            if (cacheResult.data.hasReplied && itemTitle && !itemTitle.querySelector('.v2ex-replied-badge')) {
                const repliedBadge = createRepliedBadge(cacheResult.data.replyCount);
                const originalTitle = repliedBadge.getAttribute('data-original-title');
                const newTitle = originalTitle + ' (更新中...)';
                repliedBadge.setAttribute('data-original-title', newTitle);
                repliedBadge.title = newTitle;
                
                // 插入到操作按钮之前
                const actionsContainer = itemTitle.querySelector('.v2ex-topic-actions');
                if (actionsContainer) {
                    itemTitle.insertBefore(repliedBadge, actionsContainer);
                } else {
                    itemTitle.appendChild(repliedBadge);
                }
                console.log(`🔄 显示更新中的回复标识: ${newTitle}`);
                
                // 初始化 tippy
                setTimeout(() => initTippy(repliedBadge), 100);
            }
            
            // 显示钻石/打赏信息
            const tempCoinInfo = createCoinInfoElement(cacheResult.data);
            if (tempCoinInfo.children.length > 0) {
                displayedCoinInfo = tempCoinInfo;
                displayedCoinInfo.classList.add('v2ex-coin-cached', 'v2ex-coin-updating');
                const diamondSpan = displayedCoinInfo.querySelector('.v2ex-coin-diamond');
                const tipSpan = displayedCoinInfo.querySelector('.v2ex-coin-tip');
                if (diamondSpan) {
                    diamondSpan.title = diamondSpan.title + ' (更新中...)';
                }
                if (tipSpan) {
                    tipSpan.title = tipSpan.title + ' (更新中...)';
                }
                authorStrong.parentNode.insertBefore(displayedCoinInfo, authorStrong.nextSibling);
            }
        }
        
        if (!displayedCoinInfo) {
            // 没有缓存，显示加载提示
            const loadingSpan = document.createElement('span');
            loadingSpan.className = 'v2ex-coin-loading';
            loadingSpan.textContent = ' (加载中...)';
            authorStrong.parentNode.insertBefore(loadingSpan, authorStrong.nextSibling);
            displayedCoinInfo = loadingSpan;
        }
        
        // 获取新数据
        try {
            const data = await fetchTopicData(topicId, topicLink);
            
            // 保存到缓存
            setCachedData(topicId, data);
            
            // 移除旧的显示元素
            if (displayedCoinInfo && displayedCoinInfo.parentNode) {
                displayedCoinInfo.remove();
            }
            
            // 更新或添加已回复标识
            if (itemTitle) {
                const existingBadge = itemTitle.querySelector('.v2ex-replied-badge');
                if (data.hasReplied) {
                    if (existingBadge) {
                        // 更新现有标识的提示文字
                        const count = parseInt(data.replyCount) || 0;
                        const titleText = count > 0 ? `你已回复 ${count} 条` : `你已回复过此主题`;
                        existingBadge.setAttribute('data-original-title', titleText);
                        existingBadge.title = titleText;
                        console.log(`🔄 更新回复标识，回复数: ${count}, title: ${titleText}`);
                        
                        // 重新初始化 tippy
                        setTimeout(() => initTippy(existingBadge), 100);
                    } else {
                        // 创建新标识（插入到操作按钮之前）
                        const newBadge = createRepliedBadge(data.replyCount);
                        
                        // 插入到操作按钮之前
                        const actionsContainer = itemTitle.querySelector('.v2ex-topic-actions');
                        if (actionsContainer) {
                            itemTitle.insertBefore(newBadge, actionsContainer);
                        } else {
                            itemTitle.appendChild(newBadge);
                        }
                        
                        // 初始化 tippy
                        setTimeout(() => initTippy(newBadge), 100);
                    }
                } else {
                    if (existingBadge) {
                        existingBadge.remove();
                    }
                }
            }
            
            // 显示新的钻石/打赏数据（只有当有内容时）
            const coinInfo = createCoinInfoElement(data);
            if (coinInfo.children.length > 0) {
                authorStrong.parentNode.insertBefore(coinInfo, authorStrong.nextSibling);
            }
        } catch (error) {
            // 如果获取失败，保留旧数据或显示错误
            if (!cacheResult || !cacheResult.expired) {
                // 没有旧数据可显示，显示错误
                if (displayedCoinInfo && displayedCoinInfo.parentNode) {
                    displayedCoinInfo.remove();
                }
                const errorSpan = document.createElement('span');
                errorSpan.className = 'v2ex-coin-error';
                errorSpan.textContent = ' (加载失败)';
                authorStrong.parentNode.insertBefore(errorSpan, authorStrong.nextSibling);
            } else {
                // 有旧数据，更新提示为加载失败但保留数据
                const diamondSpan = displayedCoinInfo.querySelector('.v2ex-coin-diamond');
                const tipSpan = displayedCoinInfo.querySelector('.v2ex-coin-tip');
                if (diamondSpan) {
                    diamondSpan.title = diamondSpan.title.replace(' (更新中...)', ' (更新失败，显示旧数据)');
                }
                if (tipSpan) {
                    tipSpan.title = tipSpan.title.replace(' (更新中...)', ' (更新失败，显示旧数据)');
                }
                displayedCoinInfo.classList.remove('v2ex-coin-updating');
                
                // 更新已回复标识的提示
                if (itemTitle) {
                    const badge = itemTitle.querySelector('.v2ex-replied-badge');
                    if (badge) {
                        badge.title = badge.title.replace(' (更新中...)', ' (更新失败，显示旧数据)');
                    }
                }
            }
            console.error('获取主题数据失败:', error);
        }
    }

    // 并发池控制函数
    async function runWithConcurrency(tasks, concurrency) {
        const results = [];
        const executing = [];
        
        for (const task of tasks) {
            const promise = task().then(result => {
                executing.splice(executing.indexOf(promise), 1);
                return result;
            });
            
            results.push(promise);
            executing.push(promise);
            
            if (executing.length >= concurrency) {
                await Promise.race(executing);
            }
        }
        
        return Promise.all(results);
    }

    // 批量处理，使用并发池控制
    async function processAllTopics() {
        // 检查是否是主题详情页，如果是则不处理
        const isTopicPage = window.location.pathname.match(/^\/t\/\d+/);
        if (isTopicPage) {
            console.log('📄 当前是主题详情页，跳过列表处理');
            return;
        }
        
        let cells = [];
        
        // 尝试节点页面的选择器
        const topicsContainer = document.getElementById('TopicsNode');
        if (topicsContainer) {
            cells = topicsContainer.querySelectorAll('.cell');
        } else {
            // 尝试首页/tab页面的选择器
            // 查找所有包含 .cell.item 的主题
            cells = document.querySelectorAll('.cell.item');
        }
        
        if (cells.length === 0) {
            console.log('⚠️ 未找到主题列表（可能不是列表页）');
            return;
        }
        
        console.log(`找到 ${cells.length} 个主题`);
        
        // 统计缓存命中情况
        let cacheHits = 0;
        let cacheMisses = 0;
        
        // 先统计一下缓存命中率
        const cellsArray = Array.from(cells);
        for (const cell of cellsArray) {
            const topicLinkElement = cell.querySelector('.topic-link');
            if (topicLinkElement) {
                const topicId = topicLinkElement.id.replace('topic-link-', '');
                const cacheResult = getCachedData(topicId, false);
                if (cacheResult && !cacheResult.expired) {
                    cacheHits++;
                } else {
                    cacheMisses++;
                }
            }
        }
        
        console.log(`缓存统计: 命中 ${cacheHits} 个, 需要获取 ${cacheMisses} 个`);
        
        // 创建任务数组
        const tasks = cellsArray.map(cell => () => processTopicCell(cell));
        
        // 使用并发池，始终保持5个并发请求
        const startTime = Date.now();
        await runWithConcurrency(tasks, 5);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`所有主题处理完成，耗时 ${elapsed} 秒`);
    }

    // 从当前主题页面提取并缓存数据
    function extractAndCacheTopicData() {
        // 检查是否是主题详情页
        const topicMatch = window.location.pathname.match(/^\/t\/(\d+)/);
        if (!topicMatch) return;
        
        const topicId = topicMatch[1];
        console.log(`🔍 检测到主题详情页: ${topicId}`);
        
        // 提取钻石数据
        let diamond = null; // null 表示没有数据
        const coinWidget = document.querySelector('.coin-widget-amount');
        if (coinWidget) {
            diamond = coinWidget.textContent.trim();
            console.log(`✓ 找到钻石数据: ${diamond}`);
        } else {
            console.log('⚠️ 未找到钻石数据（作者未设置钱包或页面未登录）');
        }
        
        // 提取打赏数据
        let tipAmount = '0';
        let tipCount = 0;
        
        // 查找所有打赏记录
        const tipBox = document.getElementById('topic-tip-box');
        console.log('topic-tip-box 元素:', tipBox);
        
        if (tipBox) {
            // 方法1：从 patronage 统计人数
            const patronage = tipBox.querySelectorAll('.patronage a');
            tipCount = patronage.length;
            console.log('打赏人数:', tipCount);
            
            // 方法2：从 tip-summary 提取金额
            const tipSummaries = tipBox.querySelectorAll('.tip-summary');
            console.log('找到 tip-summary 数量:', tipSummaries.length);
            
            let totalTip = 0;
            tipSummaries.forEach((summary, index) => {
                const text = summary.textContent;
                console.log(`tip-summary[${index}] 文本:`, text);
                const match = text.match(/(\d+)\s*\$V2EX/);
                if (match) {
                    console.log(`匹配到金额: ${match[1]}`);
                    totalTip += parseInt(match[1]);
                }
            });
            
            console.log('总打赏金额:', totalTip);
            
            if (totalTip > 0) {
                tipAmount = totalTip.toString();
            }
            
            // 方法3：尝试从整个 inner 容器提取（备用方案）
            if (totalTip === 0) {
                const innerDivs = tipBox.querySelectorAll('.inner');
                console.log('找到 inner 容器数量:', innerDivs.length);
                innerDivs.forEach((div, index) => {
                    const text = div.textContent;
                    console.log(`inner[${index}] 文本:`, text);
                    const matches = text.match(/(\d+)\s*\$V2EX/g);
                    if (matches) {
                        matches.forEach(m => {
                            const num = m.match(/(\d+)/);
                            if (num) {
                                console.log(`从 inner 匹配到金额: ${num[1]}`);
                                totalTip += parseInt(num[1]);
                            }
                        });
                    }
                });
                
                if (totalTip > 0) {
                    tipAmount = totalTip.toString();
                    console.log('从 inner 容器获取的总金额:', totalTip);
                }
            }
        } else {
            console.log('未找到 topic-tip-box 元素');
        }
        
        // 检查当前用户是否回复过，并统计回复数量
        let hasReplied = false;
        let replyCount = 0;
        const currentUsername = getCurrentUsername();
        console.log(`🔍 当前用户: ${currentUsername || '未检测到'}`);
        
        if (currentUsername) {
            // 查找所有回复框中的用户链接（回复的 ID 格式为 r_数字）
            const mainDiv = document.getElementById('Main');
            if (mainDiv) {
                const replyCells = mainDiv.querySelectorAll('.cell[id^="r_"]');
                console.log(`🔍 找到 ${replyCells.length} 个回复`);
                
                for (const replyCell of replyCells) {
                    // 在每个回复中查找用户链接（带 .dark 类的是回复者）
                    const userLink = replyCell.querySelector('a[href^="/member/"].dark');
                    if (userLink) {
                        const username = userLink.getAttribute('href').replace('/member/', '');
                        if (username === currentUsername) {
                            hasReplied = true;
                            replyCount++;
                        }
                    }
                }
                
                if (hasReplied) {
                    console.log(`✓ 找到 ${replyCount} 条回复`);
                } else {
                    console.log(`⚠️ 未在回复中找到用户 ${currentUsername}`);
                    // 调试：列出前3个回复的用户
                    for (let i = 0; i < Math.min(3, replyCells.length); i++) {
                        const userLink = replyCells[i].querySelector('a[href^="/member/"].dark');
                        if (userLink) {
                            console.log(`  回复 ${i + 1}: ${userLink.getAttribute('href').replace('/member/', '')}`);
                        }
                    }
                }
            }
        }
        
        const data = {
            diamond: diamond,
            tipAmount: tipAmount,
            tipCount: tipCount,
            hasReplied: hasReplied,
            replyCount: replyCount
        };
        
        console.log('='.repeat(50));
        console.log(`📦 主题 ${topicId} 数据提取结果:`);
        console.log(`  💎 钻石: ${diamond !== null ? diamond : '无'}`);
        console.log(`  🎁 打赏金额: ${tipAmount}`);
        console.log(`  👥 打赏人数: ${tipCount}`);
        console.log(`  ✓ 已回复: ${hasReplied ? `是 (${replyCount} 条)` : '否'}`);
        console.log('='.repeat(50));
        
        // 只有当有实际数据时才保存到缓存
        const hasDiamond = diamond !== null && diamond !== undefined && diamond !== '';
        const hasTip = tipAmount && parseFloat(tipAmount) > 0;
        const hasReply = data.hasReplied === true;
        
        if (hasDiamond || hasTip || hasReply) {
            // 保存到缓存
            setCachedData(topicId, data);
            console.log(`✅ 数据已保存到缓存`);
        } else {
            console.log(`⚠️ 未提取到有效数据，不保存缓存`);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            extractAndCacheTopicData();
            processAllTopics();
        });
    } else {
        extractAndCacheTopicData();
        processAllTopics();
    }
})();


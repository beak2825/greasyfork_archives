// ==UserScript==
// @name         NexusMods - 屏蔽指定 Mod
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在 NexusMods.com 上自动屏蔽指定的 Mod（通过 Mod ID），支持设置界面
// @author       VisJoker
// @match        https://*.nexusmods.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552275/NexusMods%20-%20%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/552275/NexusMods%20-%20%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==============================
    // ⚙️ 屏蔽 Mod ID 配置
    // ==============================
    // 屏蔽列表将从本地存储中加载，格式为 { gameId: [modId1, modId2, ...] }
    let BLOCKED_MODS_BY_GAME = {}; // 从本地存储加载的按游戏分组的屏蔽列表
    
    // 获取当前游戏的ID
    function getCurrentGameId() {
        // 从URL中提取游戏ID，例如 https://www.nexusmods.com/games/stellarblade/mods 中的 stellarblade
        // NexusMods的URL格式可能是 /games/gameid/mods 或直接 /gameid/mods
        const pathMatch = window.location.pathname.match(/^\/(?:games\/)?([^\/]+)/);
        return pathMatch ? pathMatch[1] : null;
    }
    
    // 获取当前游戏的屏蔽列表
    function getCurrentGameBlockedMods() {
        const gameId = getCurrentGameId();
        if (!gameId || !BLOCKED_MODS_BY_GAME[gameId]) {
            return [];
        }
        return BLOCKED_MODS_BY_GAME[gameId];
    }

    // 工具函数：从 URL 中尝试提取 modID（备用，比如当前正在查看的页面就是该 mod）
    function extractModIdFromUrl() {
        const match = window.location.pathname.match(/\/mods\/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    // 检查Mod ID是否在当前游戏的屏蔽列表中
    function isModBlocked(modId) {
        const gameId = getCurrentGameId();
        return gameId && BLOCKED_MODS_BY_GAME[gameId] && BLOCKED_MODS_BY_GAME[gameId].includes(modId);
    }

    // 从本地存储加载屏蔽列表
    function loadBlockedModsFromStorage() {
        try {
            const stored = GM_getValue('nexusmods_blocked_mods_by_game', '{}');
            BLOCKED_MODS_BY_GAME = JSON.parse(stored);
            if (typeof BLOCKED_MODS_BY_GAME !== 'object' || BLOCKED_MODS_BY_GAME === null) {
                BLOCKED_MODS_BY_GAME = {};
            }
            console.log('已加载按游戏分组的屏蔽列表:', BLOCKED_MODS_BY_GAME);
        } catch (e) {
            console.error('加载屏蔽列表失败:', e);
            BLOCKED_MODS_BY_GAME = {};
        }
    }

    // 保存屏蔽列表到本地存储
    function saveBlockedModsToStorage() {
        try {
            GM_setValue('nexusmods_blocked_mods_by_game', JSON.stringify(BLOCKED_MODS_BY_GAME));
            console.log('已保存按游戏分组的屏蔽列表:', BLOCKED_MODS_BY_GAME);
        } catch (e) {
            console.error('保存屏蔽列表失败:', e);
        }
    }

    // 添加Mod ID到当前游戏的屏蔽列表
    function addModToBlockList(modId) {
        const gameId = getCurrentGameId();
        if (!gameId) {
            alert('无法确定当前游戏，请确保在游戏的Mod页面上操作');
            return false;
        }
        
        modId = parseInt(modId, 10);
        if (isNaN(modId)) {
            alert('请输入有效的Mod ID（数字）');
            return false;
        }
        
        // 初始化当前游戏的屏蔽列表（如果不存在）
        if (!BLOCKED_MODS_BY_GAME[gameId]) {
            BLOCKED_MODS_BY_GAME[gameId] = [];
        }
        
        if (BLOCKED_MODS_BY_GAME[gameId].includes(modId)) {
            alert('Mod ID ' + modId + ' 已在当前游戏的屏蔽列表中');
            return false;
        }
        
        BLOCKED_MODS_BY_GAME[gameId].push(modId);
        saveBlockedModsToStorage();
        return true;
    }

    // 从当前游戏的屏蔽列表中移除Mod ID
    function removeModFromBlockList(modId) {
        const gameId = getCurrentGameId();
        if (!gameId || !BLOCKED_MODS_BY_GAME[gameId]) {
            return false;
        }
        
        modId = parseInt(modId, 10);
        if (isNaN(modId)) {
            return false;
        }
        
        const index = BLOCKED_MODS_BY_GAME[gameId].indexOf(modId);
        if (index > -1) {
            BLOCKED_MODS_BY_GAME[gameId].splice(index, 1);
            saveBlockedModsToStorage();
            return true;
        }
        return false;
    }

    // 创建设置界面
    function createSettingsUI() {
        // 获取当前游戏ID
        const gameId = getCurrentGameId();
        const gameName = gameId ? gameId.charAt(0).toUpperCase() + gameId.slice(1) : '未知游戏';
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // 创建设置面板
        const panel = document.createElement('div');
        panel.style.cssText = `
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        // 标题
        const title = document.createElement('h2');
        title.textContent = 'NexusMods Mod 屏蔽设置';
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
            text-align: center;
        `;
        
        // 当前游戏显示
        const gameDisplay = document.createElement('div');
        gameDisplay.textContent = `当前游戏: ${gameName}`;
        gameDisplay.style.cssText = `
            margin-bottom: 20px;
            padding: 8px;
            background-color: #e9ecef;
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
            color: #495057;
        `;
        
        // 当前屏蔽列表
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            margin-bottom: 20px;
        `;
        
        const listTitle = document.createElement('h3');
        listTitle.textContent = '当前游戏的屏蔽列表:';
        listTitle.style.cssText = `
            margin-bottom: 10px;
            font-size: 16px;
            color: #555;
        `;
        
        const modList = document.createElement('div');
        modList.style.cssText = `
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            max-height: 150px;
            overflow-y: auto;
        `;
        
        // 更新屏蔽列表显示
        function updateModListDisplay() {
            modList.innerHTML = '';
            const currentGameMods = getCurrentGameBlockedMods();
            
            if (currentGameMods.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.textContent = '当前游戏暂无屏蔽的 Mod';
                emptyMsg.style.cssText = `
                    color: #999;
                    font-style: italic;
                    text-align: center;
                    padding: 10px 0;
                `;
                modList.appendChild(emptyMsg);
            } else {
                currentGameMods.forEach(modId => {
                    const item = document.createElement('div');
                    item.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 5px 0;
                        border-bottom: 1px solid #eee;
                    `;
                    
                    const idText = document.createElement('span');
                    idText.textContent = modId;
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = '移除';
                    removeBtn.style.cssText = `
                        background-color: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        padding: 2px 8px;
                        cursor: pointer;
                        font-size: 12px;
                    `;
                    
                    removeBtn.addEventListener('click', function() {
                        if (confirm('确定要移除 Mod ID ' + modId + ' 吗？')) {
                            removeModFromBlockList(modId);
                            updateModListDisplay();
                            hideBlockedMod(); // 立即应用更改
                        }
                    });
                    
                    item.appendChild(idText);
                    item.appendChild(removeBtn);
                    modList.appendChild(item);
                });
            }
        }
        
        listContainer.appendChild(listTitle);
        listContainer.appendChild(modList);
        
        // 添加新Mod ID
        const addContainer = document.createElement('div');
        addContainer.style.cssText = `
            margin-bottom: 20px;
        `;
        
        const addTitle = document.createElement('h3');
        addTitle.textContent = '添加新的 Mod ID:';
        addTitle.style.cssText = `
            margin-bottom: 10px;
            font-size: 16px;
            color: #555;
        `;
        
        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
            display: flex;
            gap: 10px;
        `;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '输入 Mod ID';
        input.style.cssText = `
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        `;
        
        const addBtn = document.createElement('button');
        addBtn.textContent = '添加';
        addBtn.style.cssText = `
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
        `;
        
        addBtn.addEventListener('click', function() {
            if (addModToBlockList(input.value)) {
                input.value = '';
                updateModListDisplay();
                hideBlockedMod(); // 立即应用更改
                alert('已添加到当前游戏的屏蔽列表，页面将刷新以应用更改');
                window.location.reload();
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(addBtn);
        
        addContainer.appendChild(addTitle);
        addContainer.appendChild(inputContainer);
        
        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
        `;
        
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        buttonContainer.appendChild(closeBtn);
        
        // 组装面板
        panel.appendChild(title);
        panel.appendChild(gameDisplay);
        panel.appendChild(listContainer);
        panel.appendChild(addContainer);
        panel.appendChild(buttonContainer);
        
        // 点击遮罩层关闭
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        // 初始化列表显示
        updateModListDisplay();
        
        // 聚焦到输入框
        input.focus();
    }

    // 屏蔽当前Mod的函数
    function blockCurrentMod() {
        const currentModId = extractModIdFromUrl();
        if (!currentModId) {
            alert('无法从当前页面获取Mod ID，请确保在Mod详情页面上使用此功能');
            return;
        }
        
        if (isModBlocked(currentModId)) {
            alert('当前Mod已在屏蔽列表中');
            return;
        }
        
        // 获取Mod名称（如果可能）
        let modName = '';
        const modTitleElement = document.querySelector('h1, .mod-title, [data-testid="mod-title"]');
        if (modTitleElement) {
            modName = modTitleElement.textContent.trim();
        }
        
        const confirmMessage = modName ? 
            `确定要屏蔽当前Mod吗？\n\nMod ID: ${currentModId}\nMod名称: ${modName}` : 
            `确定要屏蔽当前Mod吗？\n\nMod ID: ${currentModId}`;
            
        if (confirm(confirmMessage)) {
            if (addModToBlockList(currentModId)) {
                alert(`已屏蔽Mod ID: ${currentModId}`);
                // 可选：返回上一页或跳转到Mod列表页
                // window.history.back();
            }
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        loadBlockedModsFromStorage();
        
        // 注册菜单命令
        GM_registerMenuCommand('⚙️ 屏蔽设置', createSettingsUI);
        
        // 只有在Mod详情页面才注册"屏蔽当前Mod"选项
        const currentModId = extractModIdFromUrl();
        if (currentModId) {
            GM_registerMenuCommand('🚫 屏蔽当前Mod', blockCurrentMod);
        }
        
        // 如果当前正在查看的页面就是被屏蔽的 Mod，则直接跳转或提醒
        if (currentModId && isModBlocked(currentModId)) {
            // 弹窗提醒并跳转到首页
            alert("此 Mod 已被屏蔽: ID " + currentModId);
            window.location.href = "https://www.nexusmods.com/";
            return;
        }
        
        // 执行隐藏被屏蔽的Mod
        hideBlockedMod();
    });

    // 主要逻辑：隐藏列表中或页面中属于被屏蔽 Mod ID 的元素
    function hideBlockedMod() {
        // 获取当前游戏的ID和屏蔽列表
        const gameId = getCurrentGameId();
        if (!gameId) return; // 如果无法确定游戏ID，则不执行任何操作
        
        const currentGameBlockedMods = getCurrentGameBlockedMods();
        if (currentGameBlockedMods.length === 0) return; // 如果当前游戏没有屏蔽列表，则不执行任何操作
        
        console.log(`正在检查游戏 ${gameId} 的屏蔽列表:`, currentGameBlockedMods);
        
        // 方法1：查找所有包含 /mods/ 路径的链接，检查是否包含被屏蔽的Mod ID
        const allModLinks = document.querySelectorAll('a[href*="/mods/"]');
        console.log(`找到 ${allModLinks.length} 个包含 /mods/ 的链接`);
        
        allModLinks.forEach(link => {
            const href = link.getAttribute('href');
            // 匹配两种可能的URL格式：
            // 1. /games/gameId/mods/ID
            // 2. /mods/ID
            const match = href.match(/(?:\/games\/[^\/]+)?\/mods\/(\d+)/);
            if (match) {
                const modId = parseInt(match[1], 10);
                if (currentGameBlockedMods.includes(modId)) {
                    // 尝试找到更上层的卡片容器，确保整个卡片被隐藏
                    // 使用更广泛的选择器列表，尝试找到合适的卡片容器
                    const cardSelectors = [
                        '[data-e2eid*="mod-tile"]',      // 基于网页结构分析的选择器
                        '[data-e2eid*="mod-card"]',      // 基于网页结构分析的选择器
                        '.mod-list__item',           // 常见的列表项
                        '.profile-mod-item',         // 个人资料页面的模组项
                        '.mod-entry',                // 模组条目
                        '[data-testid*="mod"]',      // 测试ID包含mod的元素
                        '.mod-tile',                 // 模组瓦片
                        '.mod-card',                 // 模组卡片
                        '.mod-item',                 // 模组项目
                        '.search-result',            // 搜索结果
                        '.list-item',                // 列表项
                        'li',                        // 列表元素
                        'div'                        // 通用div元素
                    ];
                    
                    // 尝试找到最合适的卡片容器
                    let cardContainer = null;
                    for (const selector of cardSelectors) {
                        const container = link.closest(selector);
                        if (container) {
                            // 检查容器是否足够大，可能是卡片容器
                            const rect = container.getBoundingClientRect();
                            if (rect.width > 50 && rect.height > 50) {
                                cardContainer = container;
                                break;
                            }
                        }
                    }
                    
                    // 如果没找到合适的容器，使用原来的逻辑
                    if (!cardContainer) {
                        cardContainer = link.closest('.mod-list__item, .profile-mod-item, .mod-entry, [data-testid*="mod"], li, div');
                    }
                    
                    if (cardContainer) {
                        // 使用更彻底的隐藏方式
                        cardContainer.style.display = 'none';
                        cardContainer.setAttribute('data-blocked-mod', modId);
                        cardContainer.setAttribute('data-blocked-game', gameId);
                        console.log(`已屏蔽游戏 ${gameId} 的 Mod ID:`, modId, '元素:', cardContainer);
                    }
                }
            }
        });

        // 方法2：有些页面直接使用 data-mod-id 属性（视情况调整）
        const elementsWithModId = document.querySelectorAll('[data-mod-id]');
        console.log(`找到 ${elementsWithModId.length} 个包含 data-mod-id 的元素`);
        
        elementsWithModId.forEach(el => {
            const modId = parseInt(el.getAttribute('data-mod-id'), 10);
            if (currentGameBlockedMods.includes(modId)) {
                // 尝试找到更上层的卡片容器
                const cardSelectors = [
                    '[data-e2eid*="mod-tile"]',      // 基于网页结构分析的选择器
                    '[data-e2eid*="mod-card"]',      // 基于网页结构分析的选择器
                    '.mod-list__item',           // 常见的列表项
                    '.profile-mod-item',         // 个人资料页面的模组项
                    '.mod-entry',                // 模组条目
                    '.mod-tile',                 // 模组瓦片
                    '.mod-card',                 // 模组卡片
                    '.mod-item',                 // 模组项目
                    '.search-result',            // 搜索结果
                    '.list-item',                // 列表项
                    'li',                        // 列表元素
                    'div'                        // 通用div元素
                ];
                
                // 尝试找到最合适的卡片容器
                let cardContainer = null;
                for (const selector of cardSelectors) {
                    const container = el.closest(selector);
                    if (container) {
                        // 检查容器是否足够大，可能是卡片容器
                        const rect = container.getBoundingClientRect();
                        if (rect.width > 50 && rect.height > 50) {
                            cardContainer = container;
                            break;
                        }
                    }
                }
                
                // 如果没找到合适的容器，使用原来的逻辑
                if (!cardContainer) {
                    cardContainer = el.closest('.mod-list__item, .profile-mod-item, li, div, .mod-entry');
                }
                
                if (cardContainer) {
                    // 使用更彻底的隐藏方式
                    cardContainer.style.display = 'none';
                    cardContainer.setAttribute('data-blocked-mod', modId);
                    cardContainer.setAttribute('data-blocked-game', gameId);
                    console.log(`已屏蔽游戏 ${gameId} 的 data-mod-id=`, modId, '元素:', cardContainer);
                }
            }
        });
        
        // 方法3：基于网页结构分析，查找可能的Mod卡片容器
        // 这些选择器基于从网页文件中提取的结构信息
        const possibleModContainers = document.querySelectorAll(
            '[data-e2eid*="mod-tile"], ' +
            '[data-e2eid*="mod-card"], ' +
            '.mod-tile, ' +
            '.mod-card, ' +
            '.mod-item, ' +
            '.mod-entry'
        );
        
        console.log(`找到 ${possibleModContainers.length} 个可能的Mod容器`);
        
        possibleModContainers.forEach(container => {
            // 检查容器内是否包含被屏蔽的Mod ID
            const modLinks = container.querySelectorAll('a[href*="/mods/"]');
            let containsBlockedMod = false;
            let blockedModId = null;
            
            modLinks.forEach(link => {
                const href = link.getAttribute('href');
                // 匹配两种可能的URL格式
                const match = href.match(/(?:\/games\/[^\/]+)?\/mods\/(\d+)/);
                if (match) {
                    const modId = parseInt(match[1], 10);
                    if (currentGameBlockedMods.includes(modId)) {
                        containsBlockedMod = true;
                        blockedModId = modId;
                    }
                }
            });
            
            // 如果容器内包含被屏蔽的Mod，则隐藏整个容器
            if (containsBlockedMod) {
                container.style.display = 'none';
                container.setAttribute('data-blocked-mod', blockedModId);
                container.setAttribute('data-blocked-game', gameId);
                console.log(`已屏蔽游戏 ${gameId} 容器内的Mod ID:`, blockedModId, '容器:', container);
            }
        });
    }

    // 如果页面是动态加载（比如无限滚动），也可以用 MutationObserver 进一步监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        hideBlockedMod();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
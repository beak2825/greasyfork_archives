// ==UserScript==
// @name         NGA论坛WOW封禁检测脚本
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  检测NGA论坛中的WOW角色是否被封禁（基于RMT处罚名单）
// @author       逗逗你德
// @license      GNU GPLv3
// @match        https://ngabbs.com/*
// @match        https://bbs.nga.cn/*
// @match        https://nga.178.com/*
// @match        http://nga.178.com/*
// @match        http://ngabbs.com/*
// @match        http://bbs.nga.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @resource     banList https://cdn.jsdelivr.net/gh/Hans0924/NGA-WOW-RMT-H5/wow-cn-rmt-ban-list.json
// @downloadURL https://update.greasyfork.org/scripts/549119/NGA%E8%AE%BA%E5%9D%9BWOW%E5%B0%81%E7%A6%81%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549119/NGA%E8%AE%BA%E5%9D%9BWOW%E5%B0%81%E7%A6%81%E6%A3%80%E6%B5%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('NGA论坛WOW封禁检测脚本已加载');

    // 封禁名单数据
    let banList = [];
    let isDataLoaded = false;
    
    // 已检测的角色记录（避免重复检测）
    let detectedCharacters = new Set();
    
    // 已知被封禁的角色记录（用于给新回复添加警告）
    let bannedCharacters = new Map(); // 使用Map存储角色ID和封禁记录

    // 检查是否为帖子页面
    function isPostPage() {
        const url = window.location.href;
        return url.includes('read.php?tid=');
    }

    // 初始化函数
    function init() {
        console.log('初始化WOW封禁检测功能...');
        
        // 检查是否为帖子页面，如果不是则退出
        if (!isPostPage()) {
            console.log('当前页面不是帖子页面，脚本退出');
            return;
        }
        
        console.log('检测到帖子页面，开始初始化...');
        
        // 添加自定义样式
        addCustomStyles();
        
        // 加载封禁名单数据
        loadBanList();
        
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startDetection);
        } else {
            startDetection();
        }
    }

    // 添加自定义样式
    function addCustomStyles() {
        GM_addStyle(`
            /* WOW封禁检测样式 */
            .nga-ban-warning {
                background: linear-gradient(135deg, #ff5722 0%, #ff6b6b 50%, #ff5252 100%);
                color: white;
                padding: 12px 16px;
                margin: 8px 0;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
                text-align: left;
                box-shadow: 0 4px 16px rgba(255, 107, 107, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
                overflow: hidden;
            }
            
            .nga-ban-warning:after {
                content: "⚠️";
                position: absolute;
                top: 8px;
                right: 12px;
                font-size: 16px;
                opacity: 0.8;
            }
            
            .nga-ban-warning .ban-title {
                display: block;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 6px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            
            .nga-ban-warning small {
                display: block;
                margin-top: 8px;
                font-size: 11px;
                opacity: 0.9;
                line-height: 1.3;
            }
            
            .nga-ban-warning a {
                color: #ffeb3b !important;
                text-decoration: underline !important;
                font-weight: 500;
            }
            
            .nga-ban-warning a:hover {
                color: #fff176 !important;
                text-shadow: 0 0 4px rgba(255, 235, 59, 0.5);
            }
            
            .nga-loading-status {
                position: fixed;
                top: 10px;
                right: 10px;
                background: #2196F3;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 10000;
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
            }
            
            .nga-detection-stats {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 15px;
                font-size: 11px;
                z-index: 10000;
                max-width: 200px;
            }
            
            .nga-wcl-query-btn {
                background: linear-gradient(135deg, #4CAF50, #66BB6A);
                color: white;
                border: none;
                padding: 8px 16px;
                margin: 8px 0 5px 0;
                border-radius: 18px;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
                display: inline-block;
                min-width: 120px;
                text-align: center;
            }
            
            .nga-wcl-query-btn:hover {
                background: linear-gradient(135deg, #66BB6A, #4CAF50);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
            }
            
            .nga-wcl-query-btn:disabled {
                background: linear-gradient(135deg, #bdbdbd, #9e9e9e);
                cursor: not-allowed;
                transform: none;
                box-shadow: 0 2px 4px rgba(158, 158, 158, 0.2);
                opacity: 0.7;
            }
            
            .nga-wcl-progress {
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(76, 175, 80, 0.15));
                border: 1px solid rgba(76, 175, 80, 0.3);
                border-left: 4px solid #4CAF50;
                padding: 10px 12px;
                margin: 8px 0 5px 0;
                border-radius: 8px;
                font-size: 12px;
                color: white;
                box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
            }
            
            .nga-wcl-progress strong {
                color: white;
                font-size: 13px;
            }
            
            .nga-wcl-loading {
                background: linear-gradient(135deg, rgba(255, 152, 0, 0.08), rgba(255, 152, 0, 0.15));
                border: 1px solid rgba(255, 152, 0, 0.3);
                border-left: 4px solid #ff9800;
                padding: 10px 12px;
                margin: 8px 0 5px 0;
                border-radius: 8px;
                color: white;
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                display: flex;
                align-items: center;
                box-shadow: 0 2px 8px rgba(255, 152, 0, 0.1);
            }
            
            .nga-wcl-loading:before {
                content: "🔄";
                margin-right: 8px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .nga-wcl-error {
                background: linear-gradient(135deg, rgba(244, 67, 54, 0.08), rgba(244, 67, 54, 0.15));
                border: 1px solid rgba(244, 67, 54, 0.3);
                border-left: 4px solid #f44336;
                padding: 10px 12px;
                margin: 8px 0 5px 0;
                border-radius: 8px;
                color: white;
                font-style: normal;
                font-weight: 500;
                font-size: 12px;
                box-shadow: 0 2px 8px rgba(244, 67, 54, 0.1);
            }
            
            .nga-wcl-error strong {
                color: white;
            }
            
            .nga-wcl-progress-container {
                margin-top: 5px;
            }
        `);
    }

    // 加载封禁名单数据
    function loadBanList() {
        showLoadingStatus('正在加载封禁名单...');
        
        try {
            const resourceData = GM_getResourceText('banList');
            if (resourceData) {
                banList = JSON.parse(resourceData);
                isDataLoaded = true;
                console.log(`封禁名单加载成功，共 ${banList.length} 条记录`);
                hideLoadingStatus();
                startDetection();
            } else {
                console.error('无法获取封禁名单资源');
                showLoadingStatus('封禁名单加载失败', true);
            }
        } catch (error) {
            console.error('加载封禁名单失败:', error);
            showLoadingStatus('封禁名单加载失败', true);
        }
    }


    // 显示加载状态
    function showLoadingStatus(message, isError = false) {
        let statusEl = document.getElementById('nga-loading-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'nga-loading-status';
            statusEl.className = 'nga-loading-status';
            document.body.appendChild(statusEl);
        }
        statusEl.textContent = message;
        statusEl.style.background = isError ? '#ff5252' : '#2196F3';
    }

    // 隐藏加载状态
    function hideLoadingStatus() {
        const statusEl = document.getElementById('nga-loading-status');
        if (statusEl) {
            statusEl.remove();
        }
    }

    // 开始检测
    function startDetection() {
        if (!isDataLoaded) {
            console.log('封禁名单未加载，等待中...');
            return;
        }

        console.log('开始检测WOW角色封禁状态...');
        detectBannedPlayers();

        // 设置页面变化监听
        setupPageObserver();
    }

    // 检测被封禁的玩家
    function detectBannedPlayers() {
        const spans = document.querySelectorAll('span.block_txt_c3');
        console.log(`找到 ${spans.length} 个角色信息元素`);

        let checkedCount = 0;
        let bannedCount = 0;
        let newCheckedCount = 0;
        let newBannedCount = 0;

        let hasNewWarnings = false; // 追踪是否有新的警告被添加

        spans.forEach(span => {
            const playerInfo = parsePlayerInfo(span);
            if (playerInfo) {
                const characterId = `${playerInfo.serverName}|${playerInfo.characterName}`;
                
                // 检查是否已经有封禁警告标记
                if (span.closest('.clickextend')?.querySelector('.nga-ban-warning')) {
                    return; // 跳过已经标记过的span
                }
                
                // 如果是已知的被封禁角色，直接添加警告（不重复计入统计）
                if (bannedCharacters.has(characterId)) {
                    const banRecord = bannedCharacters.get(characterId);
                    addBanWarning(span, banRecord, playerInfo);
                    hasNewWarnings = true;
                    console.log(`为已知被封禁角色添加警告: ${characterId}`);
                    return;
                }
                
                // 如果是已检测过但未被封禁的角色，跳过
                if (detectedCharacters.has(characterId)) {
                    return;
                }
                
                // 新角色，进行检测
                detectedCharacters.add(characterId);
                checkedCount++;
                newCheckedCount++;
                
                const isBanned = checkIfBanned(playerInfo);
                if (isBanned) {
                    bannedCount++;
                    newBannedCount++;
                    bannedCharacters.set(characterId, isBanned); // 记录被封禁的角色
                    addBanWarning(span, isBanned, playerInfo);
                    hasNewWarnings = true;
                    console.log(`发现新的被封禁角色: ${characterId}`);
                }
            }
        });

        // 显示检测统计
        if (newCheckedCount > 0 || hasNewWarnings) {
            showDetectionStats(newCheckedCount, newBannedCount);
            if (newCheckedCount > 0) {
                console.log(`检测完成: 新检查了 ${newCheckedCount} 个角色，发现 ${newBannedCount} 个可能被封禁的角色`);
                console.log(`总计: 已检查 ${detectedCharacters.size} 个角色，已知封禁 ${bannedCharacters.size} 个角色`);
            }
            if (hasNewWarnings && newCheckedCount === 0) {
                console.log('为已知被封禁角色的新回复添加了警告标记');
            }
        } else {
            console.log('本次检测未发现新的角色信息或封禁警告');
        }
    }

    // 解析玩家信息
    function parsePlayerInfo(span) {
        const title = span.getAttribute('title');
        if (!title) return null;

        try {
            // 解析title格式："正式服 熊猫酒仙; 暗夜精灵德鲁伊 不夜之心 "艾泽拉斯肝王"; 装备等级714 成就点数25610 史诗钥石3017; https://wow.blizzard.cn/character/#/pandaren/不夜之心"
            const parts = title.split(';');
            if (parts.length < 2) return null;

            // 第一部分：版本和服务器
            const firstPart = parts[0].trim();
            if (!firstPart.startsWith('正式服')) {
                return null; // 只处理正式服
            }
            const serverName = firstPart.replace('正式服', '').trim();

            // 第二部分：职业和角色名
            const secondPart = parts[1].trim();
            const match = secondPart.match(/^(.+?)\s+(.+?)\s+/);
            if (!match) return null;

            const characterName = match[2];

            return {
                serverName: serverName,
                characterName: characterName,
                element: span
            };
        } catch (error) {
            console.error('解析玩家信息失败:', title, error);
            return null;
        }
    }

    // 检查是否被封禁
    function checkIfBanned(playerInfo) {
        const { serverName, characterName } = playerInfo;
        
        // 在封禁名单中查找匹配的记录
        const matches = banList.filter(banRecord => {
            // 服务器名必须完全匹配
            if (banRecord.server_name !== serverName) {
                return false;
            }

            // 角色名匹配：考虑脱敏处理
            return matchCharacterName(characterName, banRecord.character_name);
        });

        return matches.length > 0 ? matches[0] : null;
    }

    // 匹配角色名（考虑脱敏处理）
    function matchCharacterName(actualName, bannedName) {
        if (!actualName || !bannedName) return false;

        // 长度必须相等
        if (actualName.length !== bannedName.length) {
            return false;
        }

        // 如果长度小于3，需要完全匹配
        if (actualName.length < 3) {
            return actualName === bannedName;
        }

        // 检查首尾字符是否匹配，中间字符是否为星号
        const firstChar = actualName.charAt(0);
        const lastChar = actualName.charAt(actualName.length - 1);
        
        const bannedFirstChar = bannedName.charAt(0);
        const bannedLastChar = bannedName.charAt(bannedName.length - 1);

        // 首尾字符必须匹配
        if (firstChar !== bannedFirstChar || lastChar !== bannedLastChar) {
            return false;
        }

        // 检查中间是否都是星号（脱敏处理的特征）
        const middlePart = bannedName.slice(1, -1);
        return /^\*+$/.test(middlePart);
    }

    // 添加封禁警告
    function addBanWarning(span, banRecord, playerInfo) {
        // 找到目标容器：span的父元素的父元素（class为clickextend）
        let targetContainer = span.parentElement?.parentElement;
        
        // 如果没有找到clickextend，向上查找
        if (!targetContainer || !targetContainer.classList.contains('clickextend')) {
            let current = span;
            while (current && current.parentElement) {
                current = current.parentElement;
                if (current.classList && current.classList.contains('clickextend')) {
                    targetContainer = current;
                    break;
                }
            }
        }

        if (!targetContainer) {
            console.warn('未找到目标容器clickextend，使用span的父元素');
            targetContainer = span.parentElement || span;
        }

        // 检查是否已经添加过警告
        if (targetContainer.querySelector('.nga-ban-warning')) {
            return;
        }

        // 创建警告元素
        const warningEl = document.createElement('div');
        warningEl.className = 'nga-ban-warning';
        warningEl.innerHTML = `
            <span class="ban-title">🚫 该玩家可能因RMT被处罚</span>
            <div style="margin: 6px 0; padding: 4px 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; font-size: 12px;">
                <strong>📝 匹配信息:</strong> ${banRecord.character_name} - ${banRecord.server_name}
            </div>
            <small>数据来源: <a href="${banRecord.source_url}" target="_blank">${banRecord.source_url}</a></small>
            <button class="nga-wcl-query-btn">📊 查询WCL团本进度</button>
            <div class="nga-wcl-progress-container" style="display: none;"></div>
        `;
        warningEl.title = `封禁记录：角色名 ${banRecord.character_name}，服务器 ${banRecord.server_name}\n数据来源：${banRecord.source_url}\n`;

        // 添加WCL查询按钮点击事件
        const queryBtn = warningEl.querySelector('.nga-wcl-query-btn');
        const progressContainer = warningEl.querySelector('.nga-wcl-progress-container');
        
        queryBtn.addEventListener('click', function() {
            if (!playerInfo) {
                progressContainer.style.display = 'block';
                progressContainer.innerHTML = '<div class="nga-wcl-error">无法获取角色信息</div>';
                return;
            }
            
            queryBtn.disabled = true;
            queryBtn.textContent = '🔄 查询中...';
            progressContainer.style.display = 'block';
            progressContainer.innerHTML = '<div class="nga-wcl-loading">正在查询WCL团本进度，请稍候...</div>';
            
            queryWCLProgress(playerInfo.serverName, playerInfo.characterName, function(result) {
                queryBtn.disabled = false;
                queryBtn.textContent = '📊 查询WCL团本进度';
                
                if (result.success) {
                    progressContainer.innerHTML = `
                        <div class="nga-wcl-progress">
                            <strong>📊 团本进度</strong><br>
                            <div style="margin: 6px 0; padding: 4px 0; border-top: 1px solid rgba(255, 255, 255, 0.3);">
                                <strong>${result.zoneName}</strong><br>
                                <span style="color: white; font-weight: 500;">${result.progress}</span>
                            </div>
                            <small><a href="${result.url}" target="_blank" style="color: #4CAF50; text-decoration: underline; font-weight: 500;">🔗 查看WCL详情</a></small>
                        </div>
                    `;
                } else {
                    progressContainer.innerHTML = `
                        <div class="nga-wcl-error">
                            <strong>⚠️ 查询失败</strong><br>
                            <div style="margin: 6px 0; color: white; font-weight: 500;">
                                ${result.error}
                            </div>
                            <small><a href="${result.url}" target="_blank" style="color: #f44336; text-decoration: underline; font-weight: 500;">🔗 打开WCL页面</a></small>
                        </div>
                    `;
                }
            });
        });

        // 添加到目标容器
        targetContainer.appendChild(warningEl);
    }

    // 查询WCL团本进度
    function queryWCLProgress(serverName, characterName, callback) {
        const wclUrl = `https://cn.warcraftlogs.com/character/cn/${encodeURIComponent(serverName)}/${encodeURIComponent(characterName)}`;
        
        console.log(`开始查询WCL进度: ${wclUrl}`);
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: wclUrl,
            timeout: 10000,
            onload: function(response) {
                try {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        
                        // 查找团队副本名称
                        const zoneNameEl = doc.querySelector('.header-zone-name');
                        const zoneName = zoneNameEl ? zoneNameEl.textContent.trim() : null;
                        
                        // 查找团队副本进度
                        const progressEl = doc.querySelector('.header-zone-progress-text');
                        const progress = progressEl ? progressEl.textContent.trim() : null;
                        
                        if (zoneName && progress) {
                            callback({
                                success: true,
                                zoneName: zoneName,
                                progress: progress,
                                url: wclUrl
                            });
                        } else if (response.responseText.includes('未找到指定的角色和服务器')) {
                            callback({
                                success: false,
                                error: '角色未在WCL中记录',
                                url: wclUrl
                            });
                        } else {
                            callback({
                                success: false,
                                error: '暂无团本进度记录',
                                url: wclUrl
                            });
                        }
                    } else {
                        callback({
                            success: false,
                            error: `请求失败 (状态码: ${response.status})`,
                            url: wclUrl
                        });
                    }
                } catch (error) {
                    console.error('解析WCL响应失败:', error);
                    callback({
                        success: false,
                        error: '解析响应失败',
                        url: wclUrl
                    });
                }
            },
            onerror: function(error) {
                console.error('WCL请求失败:', error);
                callback({
                    success: false,
                    error: '网络请求失败',
                    url: wclUrl
                });
            },
            ontimeout: function() {
                console.error('WCL请求超时');
                callback({
                    success: false,
                    error: '请求超时',
                    url: wclUrl
                });
            }
        });
    }

    // 显示检测统计
    function showDetectionStats(newChecked, newBanned) {
        let statsEl = document.getElementById('nga-detection-stats');
        if (!statsEl) {
            statsEl = document.createElement('div');
            statsEl.id = 'nga-detection-stats';
            statsEl.className = 'nga-detection-stats';
            document.body.appendChild(statsEl);
        }

        // 计算总被封禁数量
        const totalBanned = document.querySelectorAll('.nga-ban-warning').length;

        statsEl.innerHTML = `
            <div>🛡️ WOW封禁检测</div>
            <div>总检查: ${detectedCharacters.size}</div>
            <div>新检查: ${newChecked}</div>
            <div>封禁角色: ${bannedCharacters.size}</div>
            <div>封禁标记: ${totalBanned}</div>
            <div>名单记录: ${banList.length}</div>
        `;

        // 重新设置透明度为完全可见
        statsEl.style.opacity = '1';

        // 3秒后自动变为半透明
        setTimeout(() => {
            if (statsEl) {
                statsEl.style.opacity = '0.3';
            }
        }, 3000);
    }

    // 设置页面变化监听
    function setupPageObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldRedetect = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的角色信息元素
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('block_txt_c3') || 
                                node.querySelector?.('span.block_txt_c3')) {
                                shouldRedetect = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (shouldRedetect) {
                console.log('检测到页面内容变化，重新执行封禁检测...');
                setTimeout(detectBannedPlayers, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    // 启动脚本
    init();

})();
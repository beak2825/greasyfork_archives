// ==UserScript==
// @name         2-快速创建课程环节
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  【猫厂专用】【谨慎操作】在课程配置页面添加快速配置按钮
// @author       大生
// @match        https://tyca.codemao.cn/tanyue-course-warehouse/course/info?courseId=*&isEdit=true
// @grant        none
// @icon         https://tyca.codemao.cn/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/551117/2-%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%E8%AF%BE%E7%A8%8B%E7%8E%AF%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/551117/2-%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%E8%AF%BE%E7%A8%8B%E7%8E%AF%E8%8A%82.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    // 检查更新功能
    function checkForUpdates() {
        // 获取当前脚本版本
        const currentVersion = typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version ? 
                              GM_info.script.version : '3.0'; // 默认版本
        
        // GitHub raw URL
        const githubRawUrl = 'https://raw.githubusercontent.com/bpjanson/Vibe_Coding/main/web_scripts/2-%E5%88%9B%E5%BB%BA%E8%AF%BE%E7%A8%8B%E7%8E%AF%E8%8A%82.js';
        
        // 使用fetch检查更新
        fetch(githubRawUrl)
            .then(response => response.text())
            .then(data => {
                // 从远程脚本中提取版本号
                const versionMatch = data.match(/@version\s+(\d+\.\d+)/);
                if (versionMatch && versionMatch[1]) {
                    const latestVersion = versionMatch[1];
                    
                    // 比较版本号
                    if (compareVersions(latestVersion, currentVersion) > 0) {
                        // 有新版本，显示更新提示
                        showUpdateNotification(currentVersion, latestVersion, 'https://github.com/bpjanson/Vibe_Coding/blob/main/web_scripts/2-%E5%88%9B%E5%BB%BA%E8%AF%BE%E7%A8%8B%E7%8E%AF%E8%8A%82.js');
                    }
                }
            })
            .catch(error => {
                console.warn('检查更新失败:', error);
            });
    }

    // 版本号比较函数
    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            
            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }
        
        return 0;
    }

    // 显示更新通知
    function showUpdateNotification(currentVersion, newVersion, releaseUrl) {
        // 创建更新提示元素
        const updateNotice = document.createElement('div');
        updateNotice.id = 'scriptUpdateNotice';
        updateNotice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            color: #856404;
            max-width: 300px;
        `;

        updateNotice.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <strong>脚本有新版本可用</strong>
                <button id="closeUpdateNotice" style="background: none; border: none; font-size: 18px; cursor: pointer; padding: 0; line-height: 1;">×</button>
            </div>
            <div style="margin-bottom: 15px;">
                <div>当前版本: ${currentVersion}</div>
                <div>最新版本: ${newVersion}</div>
            </div>
            <div style="display: flex; gap: 10px; flex-direction: column;">
                <button id="updateNowBtn" style="padding: 8px 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">查看更新详情</button>
                <button id="tmUpdateBtn" style="padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">通过Tampermonkey更新</button>
                <button id="laterBtn" style="padding: 8px 12px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">稍后提醒</button>
            </div>
        `;

        document.body.appendChild(updateNotice);

        // 添加事件监听器
        document.getElementById('closeUpdateNotice').addEventListener('click', function() {
            updateNotice.remove();
        });

        document.getElementById('updateNowBtn').addEventListener('click', function() {
            window.open(releaseUrl, '_blank');
            updateNotice.remove();
        });

        document.getElementById('tmUpdateBtn').addEventListener('click', function() {
            // 通过Tampermonkey更新脚本
            const downloadUrl = 'https://raw.githubusercontent.com/bpjanson/Vibe_Coding/main/web_scripts/2-%E5%88%9B%E5%BB%BA%E8%AF%BE%E7%A8%8B%E7%8E%AF%E8%8A%82.js';
            window.open(downloadUrl, '_blank');
            updateNotice.remove();
        });

        document.getElementById('laterBtn').addEventListener('click', function() {
            updateNotice.remove();
        });
    }

    // 等待页面加载完成
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 100);
        }
    }

    // 从URL获取课程ID
    function getCourseId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('courseId');
    }

    // 典型双数课配置
    const TYPICAL_EVEN_CONFIG = [
        {
            "name": "上课",
            "sort": 1,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "https://online-education.codemao.cn/607/1752562541498上课-解锁.png",
            "grayIconUrl": "https://online-education.codemao.cn/607/1752562543966上课-未解锁.png",
            "tag": [],
            "type": 1,
            "complete": 1,
            "unlockCondition": "AFTER_START_COURSE",
            "showComment": 1,
            "pcShowComment": 1,
            "comment": "",
            "direction": 0,
            "url": "",
            "attribute": 0,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": null,
            "remindTimeBeforeUnlock": null,
            "prepareTimeBeforeLiveStart": "0",
            "videoCheckType": 1,
            "unlockLinkId": ""
        },
        {
            "name": "课后练习",
            "sort": 2,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "https://online-education.codemao.cn/607/1752562605815课后练习-已解锁.png",
            "grayIconUrl": "https://online-education.codemao.cn/607/1752562611088课后练习-未解锁.png",
            "tag": [],
            "type": 1,
            "complete": 0,
            "unlockCondition": "AFTER_START_COURSE",
            "showComment": 0,
            "pcShowComment": 0,
            "comment": "",
            "direction": 1,
            "url": "",
            "attribute": 0,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": 0,
            "remindTimeBeforeUnlock": 0,
            "prepareTimeBeforeLiveStart": 0,
            "videoCheckType": 1,
            "unlockLinkId": ""
        },
        {
            "name": "笔记打卡",
            "sort": 3,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "https://online-education.codemao.cn/444/1626267307716视频打卡-正常.png",
            "grayIconUrl": "https://online-education.codemao.cn/444/1626267307957视频打卡-置灰.png",
            "tag": [],
            "type": 3,
            "complete": 0,
            "unlockCondition": "AFTER_COMPLETE_COURSE",
            "showComment": 0,
            "pcShowComment": 0,
            "comment": "",
            "direction": 0,
            "url": "",
            "attribute": 1,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": 0,
            "remindTimeBeforeUnlock": 0,
            "prepareTimeBeforeLiveStart": 0,
            "videoCheckType": 1,
            "unlockLinkId": "",
            "disabled": true
        },
        {
            "name": "电子讲义",
            "sort": 4,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "https://online-education.codemao.cn/444/1626434929848电子讲义-正常.png",
            "grayIconUrl": "https://online-education.codemao.cn/444/1626434930970电子讲义-置灰.png",
            "tag": [],
            "type": 12,
            "complete": 0,
            "unlockCondition": "AFTER_COMPLETE_COURSE",
            "showComment": 0,
            "pcShowComment": 0,
            "comment": "",
            "direction": 1,
            "url": "https://未配置",
            "attribute": 0,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": null,
            "remindTimeBeforeUnlock": null,
            "prepareTimeBeforeLiveStart": "0",
            "videoCheckType": 1,
            "unlockLinkId": ""
        },
        {
            "name": "学习报告",
            "sort": 5,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "",
            "grayIconUrl": "",
            "tag": [],
            "type": 2,
            "complete": 0,
            "unlockCondition": "AFTER_COMPLETE_COURSE",
            "showComment": 0,
            "pcShowComment": 0,
            "comment": "",
            "direction": 1,
            "url": "",
            "attribute": 0,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": 0,
            "remindTimeBeforeUnlock": 0,
            "prepareTimeBeforeLiveStart": 0,
            "videoCheckType": 1,
            "unlockLinkId": ""
        }

    ];

    // 典型单数课配置
    const TYPICAL_ODD_CONFIG = [
        {
            "name": "课前直播",
            "sort": 1,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "https://online-education.codemao.cn/607/1622449053452normalIcon.png",
            "grayIconUrl": "https://online-education.codemao.cn/607/1622449116706grayIcon.png",
            "tag": [],
            "type": 13,
            "complete": 0,
            "unlockCondition": "BEFORE_START_COURSE_BY_SECOND",
            "showComment": 0,
            "pcShowComment": 0,
            "comment": "",
            "direction": 0,
            "url": "",
            "attribute": 0,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": "1200",
            "remindTimeBeforeUnlock": "86400",
            "prepareTimeBeforeLiveStart": "0",
            "videoCheckType": 1,
            "unlockLinkId": ""
        },
        {
            "name": "上课",
            "sort": 2,
            "previewUrl": "",
            "cardUrl": "",
            "normalIconUrl": "https://online-education.codemao.cn/444/1626268171169pytyhon_@3.png",
            "grayIconUrl": "https://online-education.codemao.cn/444/1626268171395pytyhon_@3x.png",
            "tag": [],
            "type": 1,
            "complete": 1,
            "unlockCondition": "AFTER_START_COURSE",
            "showComment": 0,
            "pcShowComment": 0,
            "comment": "",
            "direction": 0,
            "url": "",
            "attribute": 0,
            "linkAnimation": {
                "hasBegin": false,
                "hasFinish": false
            },
            "vwVideoGuideUrl": "",
            "vwBackgroundUrl": "",
            "vwPadBackgroundUrl": "",
            "vwCoverUrl": "",
            "beforeUnlockTime": null,
            "remindTimeBeforeUnlock": null,
            "prepareTimeBeforeLiveStart": "0",
            "videoCheckType": 1,
            "unlockLinkId": ""
        }
    ];

    // 获取当前课程配置
    async function getCurrentConfig(courseId) {
        try {
            console.log(`[获取配置] 开始获取课程配置，课程ID: ${courseId}`);

            const response = await fetch(`https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/link`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(`[获取配置] 响应状态: ${response.status}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[获取配置] 获取成功，响应数据:', data);

            const configData = data.data || [];
            console.log(`[获取配置] 解析到 ${configData.length} 个课程环节`);

            return configData;
        } catch (error) {
            console.error('[获取配置] 获取课程配置失败:', error);
            alert('获取课程配置失败: ' + error.message);
            return null;
        }
    }

    // 删除课程环节
    async function deleteCourseLink(courseId, linkId) {
        try {
            console.log(`[删除环节] 开始删除环节，课程ID: ${courseId}, 环节ID: ${linkId}`);

            const response = await fetch(`https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/link/${linkId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`[删除环节] 删除成功，环节ID: ${linkId}`, data);
            return data;
        } catch (error) {
            console.error(`[删除环节] 删除失败，环节ID: ${linkId}`, error);
            throw error;
        }
    }

    // 更新课程配置
    async function updateConfig(courseId, config) {
        try {
            console.log('[更新配置] 开始更新课程配置:', config);

            const response = await fetch(`https://codecamp-teaching-system.codemao.cn/ty-courses/${courseId}/link`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('[更新配置] 更新成功:', data);
            return data;
        } catch (error) {
            console.error('[更新配置] 更新失败:', error);
            alert('更新课程配置失败: ' + error.message);
            return null;
        }
    }

    // 比较配置并分析差异
    function analyzeConfigDifference(currentConfig, targetConfig) {
        const currentNames = currentConfig.map(item => item.name);
        const targetNames = targetConfig.map(item => item.name);

        // 需要删除的环节（当前有但目标没有）
        const toDelete = currentConfig.filter(item => !targetNames.includes(item.name));

        // 需要添加的环节（目标有但当前没有）
        const toAdd = targetConfig.filter(item => !currentNames.includes(item.name));

        // 已存在的环节（当前和目标都有）
        const existing = currentConfig.filter(item => targetNames.includes(item.name));

        console.log('[配置比较] 需要删除的环节:', toDelete.map(item => ({ id: item.id, name: item.name })));
        console.log('[配置比较] 需要添加的环节:', toAdd.map(item => ({ name: item.name, type: item.type })));
        console.log('[配置比较] 已存在的环节:', existing.map(item => ({ id: item.id, name: item.name })));

        return { toDelete, toAdd, existing };
    }

    // 合并配置：调整已存在环节的顺序，添加新环节到正确位置
    function mergeConfigs(currentConfig, targetConfig, analysis) {
        const { toAdd, existing } = analysis;
        const mergedConfig = [];

        // 按目标配置的顺序处理每个环节
        targetConfig.forEach(targetItem => {
            const existingItem = existing.find(e => e.name === targetItem.name);

            if (existingItem) {
                // 已存在的环节：检查是否需要调整顺序
                if (existingItem.sort !== targetItem.sort) {
                    console.log(`[配置合并] 调整环节顺序: ${existingItem.name} (ID: ${existingItem.id}) 从 sort:${existingItem.sort} 调整为 sort:${targetItem.sort}`);
                    // 只调整sort，保留其他所有配置
                    mergedConfig.push({
                        ...existingItem,
                        sort: targetItem.sort
                    });
                } else {
                    console.log(`[配置合并] 保留已存在环节: ${existingItem.name} (ID: ${existingItem.id})，顺序正确无需调整`);
                    mergedConfig.push(existingItem);
                }
            } else {
                // 新增环节：使用目标配置
                console.log(`[配置合并] 添加新环节: ${targetItem.name} 到位置 sort:${targetItem.sort}`);
                mergedConfig.push({ ...targetItem });
            }
        });

        // 按sort排序确保顺序正确
        mergedConfig.sort((a, b) => a.sort - b.sort);

        console.log('[配置合并] 合并后的配置:', mergedConfig.map(item => {
            const isExisting = existing.some(e => e.id === item.id);
            const isAdjusted = isExisting && existing.find(e => e.id === item.id).sort !== item.sort;
            return {
                id: item.id,
                name: item.name,
                sort: item.sort,
                status: isExisting ? (isAdjusted ? '已存在-调整顺序' : '已存在-保持不变') : '新增'
            };
        }));

        return mergedConfig;
    }

    // 处理单数课配置
    async function handleOddConfig() {
        const courseId = getCourseId();
        if (!courseId) {
            console.error('[单数配置] 无法获取课程ID');
            alert('无法获取课程ID');
            return;
        }

        console.log('[单数配置] 开始处理单数课配置，课程ID:', courseId);

        try {
            // 获取当前配置
            const currentConfig = await getCurrentConfig(courseId);
            if (!currentConfig) {
                console.error('[单数配置] 获取当前配置失败');
                return;
            }

            console.log('[单数配置] 当前配置环节数量:', currentConfig.length);
            console.log('[单数配置] 当前配置详情:', currentConfig.map(item => ({
                id: item.id,
                name: item.name,
                sort: item.sort,
                type: item.type
            })));

            console.log('[单数配置] 目标配置环节数量:', TYPICAL_ODD_CONFIG.length);
            console.log('[单数配置] 目标配置详情:', TYPICAL_ODD_CONFIG.map(item => ({
                name: item.name,
                sort: item.sort,
                type: item.type
            })));

            // 分析配置差异
            const analysis = analyzeConfigDifference(currentConfig, TYPICAL_ODD_CONFIG);
            const { toDelete, toAdd, existing } = analysis;

            // 删除多余的环节
            if (toDelete.length > 0) {
                console.log(`[单数配置] 发现 ${toDelete.length} 个多余环节，开始删除`);

                for (const link of toDelete) {
                    console.log(`[单数配置] 正在删除环节: ${link.name} (ID: ${link.id})`);
                    try {
                        await deleteCourseLink(courseId, link.id);
                        console.log(`[单数配置] 成功删除环节: ${link.name}`);
                    } catch (error) {
                        console.error(`[单数配置] 删除环节失败: ${link.name}`, error);
                        alert(`删除环节"${link.name}"失败: ${error.message}`);
                        return;
                    }
                }

                console.log('[单数配置] 所有多余环节删除完成');
            } else {
                console.log('[单数配置] 没有需要删除的多余环节');
            }

            // 检查是否需要调整顺序或添加新环节
            const needsOrderAdjustment = existing.some(existingItem => {
                const targetItem = TYPICAL_ODD_CONFIG.find(target => target.name === existingItem.name);
                return targetItem && existingItem.sort !== targetItem.sort;
            });

            if (toAdd.length > 0 || needsOrderAdjustment) {
                console.log(`[单数配置] 需要添加 ${toAdd.length} 个环节，保留 ${existing.length} 个已存在环节${needsOrderAdjustment ? '（部分需要调整顺序）' : ''}`);

                // 合并配置：调整顺序，添加缺失的环节
                const mergedConfig = mergeConfigs(currentConfig, TYPICAL_ODD_CONFIG, analysis);

                // 应用合并后的配置
                console.log('[单数配置] 开始应用合并后的配置');
                const result = await updateConfig(courseId, mergedConfig);

                if (result) {
                    console.log('[单数配置] 配置更新成功，准备刷新页面');
                    let message = '单数课配置更新成功！\n';

                    if (toAdd.length > 0) {
                        const addedNames = toAdd.map(item => item.name).join('、');
                        message += `新增环节：${addedNames}\n`;
                    }

                    if (needsOrderAdjustment) {
                        const adjustedItems = existing.filter(existingItem => {
                            const targetItem = TYPICAL_ODD_CONFIG.find(target => target.name === existingItem.name);
                            return targetItem && existingItem.sort !== targetItem.sort;
                        });
                        const adjustedNames = adjustedItems.map(item => item.name).join('、');
                        message += `调整顺序：${adjustedNames}\n`;
                    }

                    message += '页面即将刷新';
                    alert(message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } else {
                console.log('[单数配置] 所有必需环节已存在且顺序正确，无需更新');
                const existingNames = existing.map(item => item.name).join('、');
                alert(`单数课配置检查完成！\n所有必需环节已存在且顺序正确：${existingNames}\n无需更新`);
            }



        } catch (error) {
            console.error('[单数配置] 处理过程中发生错误:', error);
            alert('处理单数课配置时发生错误: ' + error.message);
        }
    }

    // 处理双数课配置
    async function handleEvenConfig() {
        const courseId = getCourseId();
        if (!courseId) {
            console.error('[双数配置] 无法获取课程ID');
            alert('无法获取课程ID');
            return;
        }

        console.log('[双数配置] 开始处理双数课配置，课程ID:', courseId);

        try {
            // 获取当前配置
            const currentConfig = await getCurrentConfig(courseId);
            if (!currentConfig) {
                console.error('[双数配置] 获取当前配置失败');
                return;
            }

            console.log('[双数配置] 当前配置环节数量:', currentConfig.length);
            console.log('[双数配置] 当前配置详情:', currentConfig.map(item => ({
                id: item.id,
                name: item.name,
                sort: item.sort,
                type: item.type
            })));

            console.log('[双数配置] 目标配置环节数量:', TYPICAL_EVEN_CONFIG.length);
            console.log('[双数配置] 目标配置详情:', TYPICAL_EVEN_CONFIG.map(item => ({
                name: item.name,
                sort: item.sort,
                type: item.type
            })));

            // 分析配置差异
            const analysis = analyzeConfigDifference(currentConfig, TYPICAL_EVEN_CONFIG);
            const { toDelete, toAdd, existing } = analysis;

            // 删除多余的环节
            if (toDelete.length > 0) {
                console.log(`[双数配置] 发现 ${toDelete.length} 个多余环节，开始删除`);

                for (const link of toDelete) {
                    console.log(`[双数配置] 正在删除环节: ${link.name} (ID: ${link.id})`);
                    try {
                        await deleteCourseLink(courseId, link.id);
                        console.log(`[双数配置] 成功删除环节: ${link.name}`);
                    } catch (error) {
                        console.error(`[双数配置] 删除环节失败: ${link.name}`, error);
                        alert(`删除环节"${link.name}"失败: ${error.message}`);
                        return;
                    }
                }

                console.log('[双数配置] 所有多余环节删除完成');
            } else {
                console.log('[双数配置] 没有需要删除的多余环节');
            }

            // 检查是否需要调整顺序或添加新环节
            const needsOrderAdjustment = existing.some(existingItem => {
                const targetItem = TYPICAL_EVEN_CONFIG.find(target => target.name === existingItem.name);
                return targetItem && existingItem.sort !== targetItem.sort;
            });

            if (toAdd.length > 0 || needsOrderAdjustment) {
                console.log(`[双数配置] 需要添加 ${toAdd.length} 个环节，保留 ${existing.length} 个已存在环节${needsOrderAdjustment ? '（部分需要调整顺序）' : ''}`);

                // 合并配置：调整顺序，添加缺失的环节
                const mergedConfig = mergeConfigs(currentConfig, TYPICAL_EVEN_CONFIG, analysis);

                // 应用合并后的配置
                console.log('[双数配置] 开始应用合并后的配置');
                const result = await updateConfig(courseId, mergedConfig);

                if (result) {
                    console.log('[双数配置] 配置更新成功，准备刷新页面');
                    let message = '双数课配置更新成功！\n';

                    if (toAdd.length > 0) {
                        const addedNames = toAdd.map(item => item.name).join('、');
                        message += `新增环节：${addedNames}\n`;
                    }

                    if (needsOrderAdjustment) {
                        const adjustedItems = existing.filter(existingItem => {
                            const targetItem = TYPICAL_EVEN_CONFIG.find(target => target.name === existingItem.name);
                            return targetItem && existingItem.sort !== targetItem.sort;
                        });
                        const adjustedNames = adjustedItems.map(item => item.name).join('、');
                        message += `调整顺序：${adjustedNames}\n`;
                    }

                    message += '页面即将刷新';
                    alert(message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } else {
                console.log('[双数配置] 所有必需环节已存在且顺序正确，无需更新');
                const existingNames = existing.map(item => item.name).join('、');
                alert(`双数课配置检查完成！\n所有必需环节已存在且顺序正确：${existingNames}\n无需更新`);
            }

        } catch (error) {
            console.error('[双数配置] 处理过程中发生错误:', error);
            alert('处理双数课配置时发生错误: ' + error.message);
        }
    }

    // 创建快速配置按钮和子按钮
    function createQuickConfigButton() {
        // 创建按钮容器 - 固定在网页右侧、高度1/4位置
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            right: 20px;
            top: 25vh;
            z-index: 9999;
            display: inline-block;
        `;

        // 创建主按钮 - 圆形
        const mainButton = document.createElement('button');
        mainButton.textContent = '快配';
        mainButton.style.cssText = `
            background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 15px;
            font-weight: bold;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 创建子按钮容器
        const subButtonsContainer = document.createElement('div');
        subButtonsContainer.style.cssText = `
            position: absolute;
            right: 50px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border-radius: 6px;
            padding: 8px;
            display: none;
            min-width: 120px;
            z-index: 1000000;
        `;

        // 创建单数按钮
        const oddButton = document.createElement('button');
        oddButton.textContent = '单数课';
        oddButton.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            border: none;
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            min-height: 32px;
            color: white;
            box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
            margin-bottom: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 创建双数按钮
        const evenButton = document.createElement('button');
        evenButton.textContent = '双数课';
        evenButton.style.cssText = `
            width: 100%;
            padding: 10px 16px;
            border: none;
            background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            min-height: 32px;
            color: white;
            box-shadow: 0 2px 6px rgba(250, 140, 22, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 添加悬停效果
        mainButton.addEventListener('mouseenter', () => {
            mainButton.style.background = 'linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%)';
            mainButton.style.transform = 'scale(1.1)';
            mainButton.style.boxShadow = '0 6px 16px rgba(24, 144, 255, 0.4)';
        });

        mainButton.addEventListener('mouseleave', () => {
            mainButton.style.background = 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)';
            mainButton.style.transform = 'scale(1)';
            mainButton.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
        });

        oddButton.addEventListener('mouseenter', () => {
            oddButton.style.background = 'linear-gradient(135deg, #73d13d 0%, #95de64 100%)';
        });

        oddButton.addEventListener('mouseleave', () => {
            oddButton.style.background = 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)';
        });

        evenButton.addEventListener('mouseenter', () => {
            evenButton.style.background = 'linear-gradient(135deg, #ffa940 0%, #ffc069 100%)';
        });

        evenButton.addEventListener('mouseleave', () => {
            evenButton.style.background = 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)';
        });

        // 显示/隐藏子按钮的逻辑
        let hoverTimeout;

        function showSubButtons() {
            clearTimeout(hoverTimeout);
            subButtonsContainer.style.display = 'block';
        }

        function hideSubButtons() {
            hoverTimeout = setTimeout(() => {
                subButtonsContainer.style.display = 'none';
            }, 200);
        }

        // 主按钮悬停事件
        mainButton.addEventListener('mouseenter', showSubButtons);
        mainButton.addEventListener('mouseleave', hideSubButtons);

        // 子按钮容器悬停事件
        subButtonsContainer.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
        });
        subButtonsContainer.addEventListener('mouseleave', hideSubButtons);

        // 按钮点击事件
        oddButton.addEventListener('click', async () => {
            console.log('点击了单数配置');
            // 添加加载状态
            oddButton.textContent = '...';
            oddButton.style.pointerEvents = 'none';

            try {
                await handleOddConfig();
            } finally {
                // 恢复按钮状态
                oddButton.textContent = '单数课';
                oddButton.style.pointerEvents = 'auto';
            }
        });

        evenButton.addEventListener('click', async () => {
            console.log('点击了双数配置');
            // 添加加载状态
            evenButton.textContent = '...';
            evenButton.style.pointerEvents = 'none';

            try {
                await handleEvenConfig();
            } finally {
                // 恢复按钮状态
                evenButton.textContent = '双数课';
                evenButton.style.pointerEvents = 'auto';
            }
        });

        // 组装按钮
        subButtonsContainer.appendChild(oddButton);
        subButtonsContainer.appendChild(evenButton);
        buttonContainer.appendChild(mainButton);
        buttonContainer.appendChild(subButtonsContainer);

        // 将按钮容器添加到页面body中，实现悬浮效果
        document.body.appendChild(buttonContainer);
    }

    // 页面加载完成后执行
    waitForElement('body', () => {
        console.log('页面加载完成，创建快速配置按钮');
        createQuickConfigButton();
        // 检查脚本更新
        checkForUpdates();
    });

})();
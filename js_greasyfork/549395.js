// ==UserScript==
// @name         Sukebei Size and Chinese Name Filter
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  自定义过滤大小和中文字符占比的过滤器，支持面板显示/隐藏切换，新增番号代码过滤功能
// @author       qisexin
// @license      MIT
// @match        https://sukebei.nyaa.si/*
// @grant        GM_registerMenuCommand
// @supportURL   https://github.com/qisexin/sukebei_filter/issues
// @homepageURL  https://github.com/qisexin/sukebei_filter
// @downloadURL https://update.greasyfork.org/scripts/549395/Sukebei%20Size%20and%20Chinese%20Name%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/549395/Sukebei%20Size%20and%20Chinese%20Name%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将大小字符串转换为MB数值
    function convertSizeToMB(sizeStr) {
        try {
            if (!sizeStr || typeof sizeStr !== 'string') return 0;
            
            // 提取数值和单位
            const match = sizeStr.match(/^([\d.]+)\s*([A-Za-z]+)$/);
            if (!match) return 0;
            
            const value = parseFloat(match[1]);
            if (isNaN(value)) return 0;
            
            const unit = match[2].toUpperCase();
            
            // 根据单位转换为MB
            switch(unit) {
                case 'B':
                    return value / (1024 * 1024);
                case 'KIB':
                case 'KB':
                    return value / 1024;
                case 'MIB':
                case 'MB':
                    return value;
                case 'GIB':
                case 'GB':
                    return value * 1024;
                case 'TIB':
                case 'TB':
                    return value * 1024 * 1024;
                default:
                    return 0;
            }
        } catch (e) {
            console.warn('转换大小时出错:', e, 'Input:', sizeStr);
            return 0;
        }
    }

    // 检测字符串中中文字符占比是否超过指定阈值
    function isPredominantlyChinese(str, threshold) {
        // 如果没有提供阈值，使用当前的全局阈值
        if (threshold === undefined) {
            threshold = chineseRatioThreshold;
        }

        // 中文字符范围：基本汉字、扩展A区汉字、兼容汉字
        const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;

        if (!str || str.length === 0) return false;

        let chineseCharCount = 0;

        // 遍历字符串中的每个字符
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (chineseRegex.test(char)) {
                chineseCharCount++;
            }
        }

        // 计算中文字符占比
        const chineseRatio = chineseCharCount / str.length;

        // 如果中文字符占比超过指定阈值，返回true
        return chineseRatio >= threshold;
    }

    // 检测文件名是否包含番号代码格式
    function containsCodePattern(str) {
        if (!str || str.length === 0) return false;

        // 匹配日本成人视频番号的主要模式：
        // 2-6位英文字母 + 连字符 + 2-6位数字
        // 例如：CMC-331, ppv-222, svni-333, CMAV-3335, CMCV-22, MXGS-123, IPTD-999
        const mainPattern = /\b[A-Za-z]{2,6}-\d{2,6}\b/;

        // 也匹配一些特殊格式，如连续多个番号
        const extendedPattern = /[A-Za-z]{2,6}-\d{2,6}.*[A-Za-z]{2,6}-\d{2,6}/;

        // 检查是否包含主要模式或多个番号
        const containsPattern = mainPattern.test(str) || extendedPattern.test(str);

        return containsPattern;
    }

    // 过滤状态
    let sizeFilterActive = true;
    let chineseFilterActive = true;
    let codePatternFilterActive = true; // 代码模式过滤状态

    // 自定义过滤参数
    let minSizeMB = 400; // 默认最小大小400MB
    let chineseRatioThreshold = 0.5; // 默认中文字符占比50%
    
    // 面板显示状态
    let panelVisible = true; // 默认显示面板
    
    // 保存设置到本地存储
    function saveSettings() {
        const settings = {
            minSizeMB: minSizeMB,
            chineseRatioThreshold: chineseRatioThreshold,
            sizeFilterActive: sizeFilterActive,
            chineseFilterActive: chineseFilterActive,
            codePatternFilterActive: codePatternFilterActive,
            panelVisible: panelVisible
        };
        localStorage.setItem('sukebeiFilterSettings', JSON.stringify(settings));
    }
    
    // 从本地存储加载设置
    function loadSettings() {
        const savedSettings = localStorage.getItem('sukebeiFilterSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                minSizeMB = settings.minSizeMB || 400;
                chineseRatioThreshold = settings.chineseRatioThreshold || 0.5;
                sizeFilterActive = settings.sizeFilterActive !== undefined ? settings.sizeFilterActive : true;
                chineseFilterActive = settings.chineseFilterActive !== undefined ? settings.chineseFilterActive : true;
                codePatternFilterActive = settings.codePatternFilterActive !== undefined ? settings.codePatternFilterActive : true;
                panelVisible = settings.panelVisible !== undefined ? settings.panelVisible : true;
                
                // 确保DOM元素存在后再更新它们的值
                if (sizeInput) {
                    sizeInput.value = minSizeMB;
                }
                if (chineseInput) {
                    chineseInput.value = Math.round(chineseRatioThreshold * 100);
                }
                
                // 更新按钮状态
                if (sizeToggleButton) {
                    if (sizeFilterActive) {
                        sizeToggleButton.textContent = '关闭大小过滤';
                        sizeToggleButton.style.backgroundColor = '#4CAF50';
                    } else {
                        sizeToggleButton.textContent = '开启大小过滤';
                        sizeToggleButton.style.backgroundColor = '#9E9E9E';
                    }
                }
                
                if (chineseToggleButton) {
                    if (chineseFilterActive) {
                        chineseToggleButton.textContent = '关闭中文过滤';
                        chineseToggleButton.style.backgroundColor = '#2196F3';
                    } else {
                        chineseToggleButton.textContent = '开启中文过滤';
                        chineseToggleButton.style.backgroundColor = '#9E9E9E';
                    }
                }

                // 更新番号代码模式过滤按钮状态
                if (codePatternToggleButton) {
                    if (codePatternFilterActive) {
                        codePatternToggleButton.textContent = '关闭番号代码过滤';
                        codePatternToggleButton.style.backgroundColor = '#9C27B0';
                    } else {
                        codePatternToggleButton.textContent = '开启番号代码过滤';
                        codePatternToggleButton.style.backgroundColor = '#9E9E9E';
                    }
                }
                
                // 更新面板可见性
                if (controlPanel) {
                    if (panelVisible) {
                        controlPanel.style.display = 'block';
                    } else {
                        controlPanel.style.display = 'none';
                    }
                }
                
                // 更新按钮可见性
                updateButtonVisibility();
                
                // 更新状态显示
                updateFilterStatus();
            } catch (e) {
                console.error('加载设置失败:', e);
            }
        }
    }
    
    // 过滤函数
    function filterResources() {
        try {
            // 获取所有种子行
            const torrentRows = document.querySelectorAll('table.torrent-list tbody tr');
            
            if (!torrentRows || torrentRows.length === 0) {
                return; // 如果没有找到行，直接返回
            }
            
            torrentRows.forEach(row => {
                try {
                    // 查找Name和Size列
                    const nameCell = row.querySelector('td:nth-child(2)');
                    // 根据行中单元格的数量动态确定Size单元格的位置
                    const cells = row.querySelectorAll('td');
                    let sizeCell = null;
                    if (cells.length === 8) { // Name单元格有 colspan="2"
                        sizeCell = cells[3];
                    } else if (cells.length === 9) { // 存在单独的Comments单元格
                        sizeCell = cells[4];
                    } else {
                        // 对于未知结构的行，可以选择跳过
                        return;
                    }

                    // 从单元格中获取文本内容
                    const nameLink = nameCell ? nameCell.querySelector('a[href^="/view/"]') : null;
                    const nameText = nameLink ? nameLink.textContent.trim() : '';
                    
                    let shouldHide = false;
                    
                    // 检查大小过滤
                    if (sizeCell && sizeFilterActive) {
                        const sizeStr = sizeCell.textContent.trim();
                        const sizeInMB = convertSizeToMB(sizeStr);
                        
                        // 如果大小小于自定义最小大小，标记为隐藏
                        if (sizeInMB < minSizeMB) {
                            shouldHide = true;
                        }
                    }
                    
                    // 检查中文字符过滤
                    if (nameText && chineseFilterActive && !isPredominantlyChinese(nameText, chineseRatioThreshold)) {
                        shouldHide = true;
                    }

                    // 检查番号代码模式过滤
                    if (nameText && codePatternFilterActive && containsCodePattern(nameText)) {
                        shouldHide = true;
                    }
                    
                    // 根据过滤结果显示或隐藏行
                    if (shouldHide) {
                        row.style.display = 'none';
                    } else {
                        row.style.display = '';
                    }
                } catch (e) {
                    console.warn('处理单个行时出错:', e);
                    // 继续处理下一行
                }
            });
        } catch (e) {
            console.error('过滤资源时出错:', e);
        }
    }
    

    // 更新过滤状态显示
    function updateFilterStatus() {
        let statusText = '当前过滤: ';
        const activeFilters = [];

        if (sizeFilterActive) {
            activeFilters.push(`>${minSizeMB}MB`);
        }
        if (chineseFilterActive) {
            activeFilters.push(`中文字符>${Math.round(chineseRatioThreshold * 100)}%`);
        }
        if (codePatternFilterActive) {
            activeFilters.push('排除番号代码');
        }

        if (activeFilters.length > 0) {
            statusText += activeFilters.join(' 且 ');
        } else {
            statusText += '无';
        }

        // 确保DOM元素存在后再更新文本
        if (filterStatus) {
            filterStatus.textContent = statusText;
        }
    }
    
    // 创建一个控制面板
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.zIndex = '9999';
    controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    controlPanel.style.color = 'white';
    controlPanel.style.padding = '10px';
    controlPanel.style.borderRadius = '5px';
    controlPanel.style.fontSize = '14px';
    
    // 状态显示
    const filterStatus = document.createElement('div');
    updateFilterStatus();
    filterStatus.style.marginBottom = '10px';
    
    // 大小过滤设置容器
    const sizeSettingsContainer = document.createElement('div');
    sizeSettingsContainer.style.marginBottom = '10px';
    
    // 大小过滤标签
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = '最小大小 (MB): ';
    sizeLabel.style.marginRight = '5px';
    
    // 大小过滤输入框
    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.value = minSizeMB;
    sizeInput.min = '0';
    sizeInput.step = '50';
    sizeInput.style.width = '80px';
    sizeInput.style.marginRight = '5px';
    sizeInput.style.color = 'black';
    
    // 大小过滤应用按钮
    const sizeApplyButton = document.createElement('button');
    sizeApplyButton.textContent = '应用';
    sizeApplyButton.style.padding = '2px 8px';
    sizeApplyButton.style.backgroundColor = '#4CAF50';
    sizeApplyButton.style.color = 'white';
    sizeApplyButton.style.border = 'none';
    sizeApplyButton.style.borderRadius = '3px';
    sizeApplyButton.style.cursor = 'pointer';
    
    // 中文过滤设置容器
    const chineseSettingsContainer = document.createElement('div');
    chineseSettingsContainer.style.marginBottom = '10px';
    
    // 中文过滤标签
    const chineseLabel = document.createElement('label');
    chineseLabel.textContent = '中文字符占比 (%): ';
    chineseLabel.style.marginRight = '5px';
    
    // 中文过滤输入框
    const chineseInput = document.createElement('input');
    chineseInput.type = 'number';
    chineseInput.value = Math.round(chineseRatioThreshold * 100);
    chineseInput.min = '0';
    chineseInput.max = '100';
    chineseInput.step = '5';
    chineseInput.style.width = '80px';
    chineseInput.style.marginRight = '5px';
    chineseInput.style.color = 'black';
    
    // 中文过滤应用按钮
    const chineseApplyButton = document.createElement('button');
    chineseApplyButton.textContent = '应用';
    chineseApplyButton.style.padding = '2px 8px';
    chineseApplyButton.style.backgroundColor = '#2196F3';
    chineseApplyButton.style.color = 'white';
    chineseApplyButton.style.border = 'none';
    chineseApplyButton.style.borderRadius = '3px';
    chineseApplyButton.style.cursor = 'pointer';
    
    // 大小过滤切换按钮
    const sizeToggleButton = document.createElement('button');
    sizeToggleButton.textContent = '关闭大小过滤';
    sizeToggleButton.style.padding = '5px 10px';
    sizeToggleButton.style.backgroundColor = '#4CAF50';
    sizeToggleButton.style.color = 'white';
    sizeToggleButton.style.border = 'none';
    sizeToggleButton.style.borderRadius = '3px';
    sizeToggleButton.style.cursor = 'pointer';
    sizeToggleButton.style.marginRight = '5px';
    sizeToggleButton.style.marginBottom = '5px';
    
    // 中文过滤切换按钮
    const chineseToggleButton = document.createElement('button');
    chineseToggleButton.textContent = '关闭中文过滤';
    chineseToggleButton.style.padding = '5px 10px';
    chineseToggleButton.style.backgroundColor = '#2196F3';
    chineseToggleButton.style.color = 'white';
    chineseToggleButton.style.border = 'none';
    chineseToggleButton.style.borderRadius = '3px';
    chineseToggleButton.style.cursor = 'pointer';
    chineseToggleButton.style.marginBottom = '5px';

    // 番号代码模式过滤切换按钮
    const codePatternToggleButton = document.createElement('button');
    codePatternToggleButton.textContent = '关闭番号代码过滤';
    codePatternToggleButton.style.padding = '5px 10px';
    codePatternToggleButton.style.backgroundColor = '#9C27B0';
    codePatternToggleButton.style.color = 'white';
    codePatternToggleButton.style.border = 'none';
    codePatternToggleButton.style.borderRadius = '3px';
    codePatternToggleButton.style.cursor = 'pointer';
    codePatternToggleButton.style.marginRight = '5px';
    codePatternToggleButton.style.marginBottom = '5px';
    
    // 显示所有资源按钮
    const showAllButton = document.createElement('button');
    showAllButton.textContent = '显示所有资源';
    showAllButton.style.padding = '5px 10px';
    showAllButton.style.backgroundColor = '#f44336';
    showAllButton.style.color = 'white';
    showAllButton.style.border = 'none';
    showAllButton.style.borderRadius = '3px';
    showAllButton.style.cursor = 'pointer';
    showAllButton.style.marginRight = '5px';
    showAllButton.style.marginBottom = '5px';
    
    // 应用所有过滤按钮
    const applyAllButton = document.createElement('button');
    applyAllButton.textContent = '应用所有过滤';
    applyAllButton.style.padding = '5px 10px';
    applyAllButton.style.backgroundColor = '#FF9800';
    applyAllButton.style.color = 'white';
    applyAllButton.style.border = 'none';
    applyAllButton.style.borderRadius = '3px';
    applyAllButton.style.cursor = 'pointer';
    applyAllButton.style.marginBottom = '5px';
    applyAllButton.style.display = 'none';
    
    // 更新按钮可见性
    function updateButtonVisibility() {
        if (!sizeFilterActive || !chineseFilterActive || !codePatternFilterActive) {
            showAllButton.style.display = 'none';
            applyAllButton.style.display = 'inline-block';
        } else {
            showAllButton.style.display = 'inline-block';
            applyAllButton.style.display = 'none';
        }
    }
    
    // 大小过滤切换
    sizeToggleButton.addEventListener('click', function() {
        sizeFilterActive = !sizeFilterActive;
        if (sizeFilterActive) {
            sizeToggleButton.textContent = '关闭大小过滤';
            sizeToggleButton.style.backgroundColor = '#4CAF50';
        } else {
            sizeToggleButton.textContent = '开启大小过滤';
            sizeToggleButton.style.backgroundColor = '#9E9E9E';
        }
        updateFilterStatus();
        filterResources();
        
        // 保存设置到本地存储
        saveSettings();
        
        // 更新显示所有/应用所有按钮的可见性
        updateButtonVisibility();
    });
    
    // 中文过滤切换
    chineseToggleButton.addEventListener('click', function() {
        chineseFilterActive = !chineseFilterActive;
        if (chineseFilterActive) {
            chineseToggleButton.textContent = '关闭中文过滤';
            chineseToggleButton.style.backgroundColor = '#2196F3';
        } else {
            chineseToggleButton.textContent = '开启中文过滤';
            chineseToggleButton.style.backgroundColor = '#9E9E9E';
        }
        updateFilterStatus();
        filterResources();

        // 保存设置到本地存储
        saveSettings();

        // 更新显示所有/应用所有按钮的可见性
        updateButtonVisibility();
    });

    // 番号代码模式过滤切换
    codePatternToggleButton.addEventListener('click', function() {
        codePatternFilterActive = !codePatternFilterActive;
        if (codePatternFilterActive) {
            codePatternToggleButton.textContent = '关闭番号代码过滤';
            codePatternToggleButton.style.backgroundColor = '#9C27B0';
        } else {
            codePatternToggleButton.textContent = '开启番号代码过滤';
            codePatternToggleButton.style.backgroundColor = '#9E9E9E';
        }
        updateFilterStatus();
        filterResources();

        // 保存设置到本地存储
        saveSettings();

        // 更新显示所有/应用所有按钮的可见性
        updateButtonVisibility();
    });
    
    // 显示所有资源
    showAllButton.addEventListener('click', function() {
        const torrentRows = document.querySelectorAll('table.torrent-list tbody tr');
        torrentRows.forEach(row => {
            row.style.display = '';
        });
        
        // 关闭所有过滤
        sizeFilterActive = false;
        chineseFilterActive = false;
        codePatternFilterActive = false;
        updateFilterStatus();
        
        // 更新按钮状态和可见性
        sizeToggleButton.textContent = '开启大小过滤';
        sizeToggleButton.style.backgroundColor = '#9E9E9E';
        chineseToggleButton.textContent = '开启中文过滤';
        chineseToggleButton.style.backgroundColor = '#9E9E9E';
        codePatternToggleButton.textContent = '开启番号代码过滤';
        codePatternToggleButton.style.backgroundColor = '#9E9E9E';
        
        showAllButton.style.display = 'none';
        applyAllButton.style.display = 'inline-block';
        
        // 保存设置到本地存储
        saveSettings();
    });
    
    // 应用所有过滤
    applyAllButton.addEventListener('click', function() {
        // 从本地存储重新加载用户的过滤设置
        const savedSettings = localStorage.getItem('sukebeiFilterSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                sizeFilterActive = settings.sizeFilterActive !== undefined ? settings.sizeFilterActive : true;
                chineseFilterActive = settings.chineseFilterActive !== undefined ? settings.chineseFilterActive : true;
                codePatternFilterActive = settings.codePatternFilterActive !== undefined ? settings.codePatternFilterActive : true;
            } catch (e) {
                // 如果解析失败，使用默认值
                sizeFilterActive = true;
                chineseFilterActive = true;
                codePatternFilterActive = true;
            }
        } else {
            // 如果没有保存的设置，使用默认值
            sizeFilterActive = true;
            chineseFilterActive = true;
            codePatternFilterActive = true;
        }
        
        // 更新按钮状态
        if (sizeFilterActive) {
            sizeToggleButton.textContent = '关闭大小过滤';
            sizeToggleButton.style.backgroundColor = '#4CAF50';
        } else {
            sizeToggleButton.textContent = '开启大小过滤';
            sizeToggleButton.style.backgroundColor = '#9E9E9E';
        }

        if (chineseFilterActive) {
            chineseToggleButton.textContent = '关闭中文过滤';
            chineseToggleButton.style.backgroundColor = '#2196F3';
        } else {
            chineseToggleButton.textContent = '开启中文过滤';
            chineseToggleButton.style.backgroundColor = '#9E9E9E';
        }

        if (codePatternFilterActive) {
            codePatternToggleButton.textContent = '关闭番号代码过滤';
            codePatternToggleButton.style.backgroundColor = '#9C27B0';
        } else {
            codePatternToggleButton.textContent = '开启番号代码过滤';
            codePatternToggleButton.style.backgroundColor = '#9E9E9E';
        }

        // 应用过滤
        updateFilterStatus();
        filterResources();
        
        // 更新按钮可见性
        updateButtonVisibility();
    });
    
    // 大小过滤应用按钮事件
    sizeApplyButton.addEventListener('click', function() {
        const newSize = parseInt(sizeInput.value);
        if (!isNaN(newSize) && newSize >= 0) {
            minSizeMB = newSize;
            updateFilterStatus();
            if (sizeFilterActive) {
                filterResources();
            }
            // 保存设置到本地存储
            saveSettings();
        }
    });
    
    // 中文过滤应用按钮事件
    chineseApplyButton.addEventListener('click', function() {
        const newRatio = parseInt(chineseInput.value);
        if (!isNaN(newRatio) && newRatio >= 0 && newRatio <= 100) {
            chineseRatioThreshold = newRatio / 100;
            updateFilterStatus();
            if (chineseFilterActive) {
                filterResources();
            }
            // 保存设置到本地存储
            saveSettings();
        }
    });
    
    // 添加控件到控制面板
    controlPanel.appendChild(filterStatus);
    controlPanel.appendChild(document.createElement('br'));
    
    // 添加大小过滤设置
    sizeSettingsContainer.appendChild(sizeLabel);
    sizeSettingsContainer.appendChild(sizeInput);
    sizeSettingsContainer.appendChild(sizeApplyButton);
    controlPanel.appendChild(sizeSettingsContainer);
    
    // 添加中文过滤设置
    chineseSettingsContainer.appendChild(chineseLabel);
    chineseSettingsContainer.appendChild(chineseInput);
    chineseSettingsContainer.appendChild(chineseApplyButton);
    controlPanel.appendChild(chineseSettingsContainer);
    
    controlPanel.appendChild(document.createElement('br'));
    controlPanel.appendChild(sizeToggleButton);
    controlPanel.appendChild(chineseToggleButton);
    controlPanel.appendChild(codePatternToggleButton);
    controlPanel.appendChild(document.createElement('br'));
    controlPanel.appendChild(showAllButton);
    controlPanel.appendChild(applyAllButton);
    document.body.appendChild(controlPanel);
    
    // 加载保存的设置（必须在所有DOM元素创建完成后调用）
    loadSettings();
    
    // 初始过滤（确保在设置加载完成后进行）
    filterResources();

    // 定义面板切换函数
    function togglePanel() {
        panelVisible = !panelVisible;
        if (panelVisible) {
            controlPanel.style.display = 'block';
        } else {
            controlPanel.style.display = 'none';
        }
        // 保存设置到本地存储
        saveSettings();
    }

    // 注册菜单命令，用于切换面板显示/隐藏
    GM_registerMenuCommand('切换过滤面板显示状态', togglePanel);

    // 防抖函数，避免频繁触发过滤
    let filterTimeout = null;
    function debounceFilter() {
        if (filterTimeout) {
            clearTimeout(filterTimeout);
        }
        filterTimeout = setTimeout(() => {
            if (sizeFilterActive || chineseFilterActive) {
                filterResources();
            }
        }, 100); // 100ms 防抖延迟
    }

    // 监听页面变化，以便在动态加载内容时重新应用过滤
    const observer = new MutationObserver(function(mutations) {
        // 检查是否有实际的内容变化
        let hasContentChange = false;
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否添加了新的行元素
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.tagName === 'TR' || node.querySelector('tr'))) {
                        hasContentChange = true;
                        break;
                    }
                }
            }
            if (hasContentChange) break;
        }
        
        if (hasContentChange) {
            debounceFilter();
        }
    });

    // 观察表格变化
    const torrentTable = document.querySelector('table.torrent-list');
    if (torrentTable) {
        observer.observe(torrentTable, {
            childList: true,
            subtree: true,
            // 只观察子节点变化，不观察属性和文本变化
            attributes: false,
            characterData: false
        });
    }
})();
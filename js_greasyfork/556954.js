// ==UserScript==
// @name         Steam提取游戏语言和标签
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  提取Steam游戏的热门标签和语言信息，并提供一键复制功能
// @author       WhiteLycoris and DeepSeek, thanks lucianjp
// @match        *://store.steampowered.com/app/*
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556954/Steam%E6%8F%90%E5%8F%96%E6%B8%B8%E6%88%8F%E8%AF%AD%E8%A8%80%E5%92%8C%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/556954/Steam%E6%8F%90%E5%8F%96%E6%B8%B8%E6%88%8F%E8%AF%AD%E8%A8%80%E5%92%8C%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let extractedTags = null;
    let extractedLanguages = null;
    let extractedLanguagesDetailed = null;
    let infoPanelCreated = false;
    let languagesExtracted = false;
    
    // 使用更早的加载时机，不等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startExtraction);
    } else {
        startExtraction();
    }
    
    function startExtraction() {
        // 立即开始尝试提取
        tryExtractInfo();
        
        // 同时设置观察器，以防内容延迟加载
        setupObservers();
        
        // 设置超时检查，确保最终能提取到信息
        setTimeout(finalAttempt, 5000);
    }
    
    function tryExtractInfo() {
        // 尝试提取标签
        if (!extractedTags) {
            extractedTags = extractAllTags();
        }
        
        // 尝试提取语言（包括隐藏的语言）
        if (!languagesExtracted) {
            const languageData = extractAllLanguagesDetailed();
            if (languageData) {
                extractedLanguages = languageData.simple;
                extractedLanguagesDetailed = languageData.detailed;
                languagesExtracted = true;
            }
        }
        
        // 如果已经提取到信息且面板尚未创建，则创建面板
        if ((extractedTags || extractedLanguages) && !infoPanelCreated) {
            createInfoPanel(extractedTags, extractedLanguages, extractedLanguagesDetailed);
            infoPanelCreated = true;
        }
    }
    
    function setupObservers() {
        // 观察整个文档的变化，以便在相关区域加载时立即提取
        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // 检查是否添加了标签或语言相关的元素
                            if (node.querySelector && (
                                node.querySelector('#glanceCtnResponsiveRight .glance_tags.popular_tags') ||
                                node.querySelector('#languageTable table.game_language_options') ||
                                node.id === 'glanceCtnResponsiveRight' ||
                                node.id === 'languageTable'
                            )) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldUpdate) {
                tryExtractInfo();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 特别观察标签和语言区域
        observeSpecificAreas();
    }
    
    function observeSpecificAreas() {
        // 尝试找到标签容器并观察其变化
        const tagsContainer = document.querySelector('#glanceCtnResponsiveRight');
        if (tagsContainer) {
            const tagsObserver = new MutationObserver(tryExtractInfo);
            tagsObserver.observe(tagsContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
        
        // 尝试找到语言容器并观察其变化
        const langContainer = document.querySelector('.block.responsive_apppage_details_right');
        if (langContainer) {
            const langObserver = new MutationObserver(tryExtractInfo);
            langObserver.observe(langContainer, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }
    
    function finalAttempt() {
        // 最终尝试提取信息
        if (!infoPanelCreated) {
            tryExtractInfo();
        }
    }
    
    function extractAllTags() {
        const tagsContainer = document.querySelector('#glanceCtnResponsiveRight .glance_tags.popular_tags');
        if (!tagsContainer) return null;
        
        const tags = [];
        const tagElements = tagsContainer.querySelectorAll('a.app_tag');
        
        tagElements.forEach(tag => {
            // 提取所有标签，包括隐藏的，但排除"+"按钮
            if (tag.textContent.trim() && !tag.classList.contains('add_button')) {
                let tagText = tag.textContent.trim();
                
                // 格式化标签文本
                tagText = formatTagText(tagText);
                
                if (tagText && !tags.includes(tagText)) {
                    tags.push(tagText);
                }
            }
        });
        
        return tags.length > 0 ? tags.join(', ') : null;
    }
    
    function formatTagText(tagText) {
        // 将减号替换为点号
        tagText = tagText.replace(/-/g, '.');
        
        // 将空格替换为点号
        tagText = tagText.replace(/\s+/g, '.');
        
        // 将大写字母转换为小写
        tagText = tagText.toLowerCase();
        
        // 特殊处理：将"rpg"转换为"role.playing.game"
        if (tagText === 'rpg') {
            tagText = 'role.playing.game';
        }
        
        return tagText;
    }
    
    function extractAllLanguagesDetailed() {
        // 尝试多种选择器，因为Steam的HTML结构可能有变化
        const languageTables = [
            document.querySelector('#languageTable table.game_language_options'),
            document.querySelector('.game_language_options'),
            document.querySelector('.block.responsive_apppage_details_right table')
        ];
        
        let languageTable = null;
        for (let table of languageTables) {
            if (table) {
                languageTable = table;
                break;
            }
        }
        
        if (!languageTable) {
            console.log('未找到语言表格');
            return null;
        }
        
        // 一次性获取所有行
        const languageRows = languageTable.rows;
        const rowCount = languageRows.length;
        
        if (rowCount <= 1) return null; // 只有表头行或没有行
        
        const languages = [];
        // 详细语言支持信息 - 合并Interface和Subtitles
        const detailedLanguages = {
            interfaceSubtitles: [],
            fullAudio: []
        };
        
        // 跳过表头行，从索引1开始
        for (let i = 1; i < rowCount; i++) {
            const row = languageRows[i];
            // 使用cells属性而不是querySelector
            const cells = row.cells;
            if (cells.length === 0) continue;
            
            // 第一列是语言名称
            const languageName = cells[0].textContent.trim();
            if (!languageName) continue;
            
            // 直接收集所有语言，不再检查display状态
            if (!languages.includes(languageName)) {
                languages.push(languageName);
            }
            
            // 检查支持类型 - 使用更高效的方法
            // 第二列是界面支持，第四列是字幕支持 - 合并两者
            const hasInterface = cells[1] && cells[1].textContent.includes('✔');
            const hasSubtitles = cells[3] && cells[3].textContent.includes('✔');
            
            if ((hasInterface || hasSubtitles) && !detailedLanguages.interfaceSubtitles.includes(languageName)) {
                detailedLanguages.interfaceSubtitles.push(languageName);
            }
            
            // 第三列是全音频支持
            if (cells[2] && cells[2].textContent.includes('✔')) {
                if (!detailedLanguages.fullAudio.includes(languageName)) {
                    detailedLanguages.fullAudio.push(languageName);
                }
            }
        }
        
        console.log(`提取到 ${languages.length} 种语言:`, languages);
        console.log('详细语言支持信息:', detailedLanguages);
        
        // 格式化详细语言信息 - 使用BBCode格式
        let detailedText = "";
        
        if (detailedLanguages.interfaceSubtitles.length > 0) {
            // 添加BBCode粗体标签
            detailedText += `[b]Interface and Subtitles[/b]: ${detailedLanguages.interfaceSubtitles.join(', ')}`;
        }
        
        if (detailedLanguages.fullAudio.length > 0) {
            // 如果有界面和字幕信息，添加一个空行（两个换行符）
            if (detailedText.length > 0) {
                detailedText += '\n\n'; // 两个换行符 = 一个空行
            }
            // 添加BBCode粗体标签
            detailedText += `[b]Full Audio[/b]: ${detailedLanguages.fullAudio.join(', ')}`;
        }
        
        return {
            simple: languages.length > 0 ? `Languages: ${languages.join(', ')}` : null,
            detailed: detailedText
        };
    }
    
    function createInfoPanel(tags, languages, languagesDetailed) {
        // 如果面板已经存在，先移除
        const existingPanel = document.getElementById('steam-info-extractor-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // 创建信息面板容器
        const panel = document.createElement('div');
        panel.id = 'steam-info-extractor-panel';
        /*
        CSS参数说明（此处是示例区，下方才是代码区）
        position: fixed; - 固定定位，不随页面滚动而移动
        top: 65px; - 距离页面顶部65像素
        right: 35px; - 距离页面右侧35像素
        background: #1b2838; - 背景颜色（深蓝色）
        border: 2px solid #67c1f5; - 边框（2像素宽，浅蓝色）
        border-radius: 8px; - 边框圆角8像素
        padding: 10px; - 内边距10像素
        color: white; - 文字颜色白色
        font-family: Arial, sans-serif; - 字体
        font-size: 12px; - 字体大小12像素
        z-index: 9999; - 层级，确保显示在最前面
        max-width: 300px; - 最大宽度300像素
        max-height: 300px; - 面板整体最大高度300像素
        overflow-y: auto; - 当内容超过最大高度时显示垂直滚动条
        box-shadow: 0 4px 12px rgba(0,0,0,0.5); - 阴影效果
        */
        panel.style.cssText = `
            position: fixed;
            top: 65px;
            right: 35px;
            background: #1b2838;
            border: 2px solid #67c1f5;
            border-radius: 8px;
            padding: 10px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;
        
        // 创建标题
        const title = document.createElement('div');
        title.textContent = 'Steam提取游戏语言和标签';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            color: #67c1f5;
            border-bottom: 1px solid #67c1f5;
            padding-bottom: 5px;
        `;
        panel.appendChild(title);
        
        // 创建信息显示区域
        const infoContent = document.createElement('div');
        infoContent.style.cssText = `
            margin-bottom: 10px;
            line-height: 1.4;
        `;
        
        // 先添加语言信息和复制按钮
        if (languagesDetailed) {
            const langSection = document.createElement('div');
            langSection.style.marginBottom = '15px';
            
            const langHeader = document.createElement('div');
            langHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;';
            
            const langTitle = document.createElement('strong');
            langTitle.textContent = '支持语言:';
            langHeader.appendChild(langTitle);
            
            const copyLangBtn = createCopyButton('复制语言', languagesDetailed);
            langHeader.appendChild(copyLangBtn);
            
            langSection.appendChild(langHeader);
            
            const langText = document.createElement('div');
            langText.textContent = languagesDetailed;
            langText.style.cssText = 'background: rgba(103, 193, 245, 0.1); padding: 8px; border-radius: 4px; font-size: 13px; white-space: pre-line;';
            langSection.appendChild(langText);
            
            infoContent.appendChild(langSection);
        }
        
        // 再添加标签信息和复制按钮
        if (tags) {
            const tagsSection = document.createElement('div');
            
            const tagsHeader = document.createElement('div');
            tagsHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;';
            
            const tagsTitle = document.createElement('strong');
            tagsTitle.textContent = '热门标签:';
            tagsHeader.appendChild(tagsTitle);
            
            const copyTagsBtn = createCopyButton('复制标签', tags);
            tagsHeader.appendChild(copyTagsBtn);
            
            tagsSection.appendChild(tagsHeader);
            
            const tagsText = document.createElement('div');
            tagsText.textContent = tags;
            tagsText.style.cssText = 'background: rgba(103, 193, 245, 0.1); padding: 8px; border-radius: 4px; font-size: 13px;';
            tagsSection.appendChild(tagsText);
            
            infoContent.appendChild(tagsSection);
        }
        
        panel.appendChild(infoContent);
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 8px;
            background: none;
            border: none;
            color: #67c1f5;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        `;
        
        closeButton.addEventListener('click', function() {
            document.body.removeChild(panel);
            infoPanelCreated = false;
        });
        
        panel.appendChild(closeButton);
        
        // 添加到页面
        document.body.appendChild(panel);
    }
    
    function createCopyButton(text, content) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: rgba(103, 193, 245, 0.2);
            color: #67c1f5;
            border: 1px solid #67c1f5;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseover', function() {
            this.style.background = 'rgba(103, 193, 245, 0.4)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.background = 'rgba(103, 193, 245, 0.2)';
        });
        
        button.addEventListener('click', function() {
            GM_setClipboard(content, 'text');
            showCopyFeedback(this, '✓ 已复制!');
        });
        
        return button;
    }
    
    function showCopyFeedback(button, feedbackText) {
        const originalText = button.textContent;
        const originalBackground = button.style.background;
        
        button.textContent = feedbackText;
        button.style.background = '#5cb85c';
        button.style.borderColor = '#5cb85c';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBackground;
            button.style.borderColor = '#67c1f5';
            button.style.color = '#67c1f5';
        }, 2000);
    }
})();
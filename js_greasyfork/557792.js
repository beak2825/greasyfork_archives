// ==UserScript==
// @name         Bangumi 编辑页面增强
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  内容粘贴,标签快速选择
// @author       Accard
// @match        https://bgm.tv/subject/*/edit_detail
// @match        https://bgm.tv/new_subject/*
// @match        https://bgm.tv/subject_search/*
// @match        https://bgm.tv/subject/*
// @match        https://bgm.tv/user/*
// @match        https://bgm.tv/wiki/*
// @match        https://bgm.tv/wiki
// @match        https://bgm.tv
// @license MIT licensed
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557792/Bangumi%20%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557792/Bangumi%20%E7%BC%96%E8%BE%91%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // 添加第一个按钮：在"入门模式"后面
        addPasteButtonAfterElement('a[onclick="WCODEtoNormal()"]', '粘贴Wiki', pasteToInfobox);

        // 添加第二个按钮：在"游戏简介"的textarea后面
        addPasteButtonAfterElement('textarea[name="subject_summary"]', '粘贴简介', pasteToSummary);

        // 添加第三个按钮：在subject_title输入框后面
        addPasteButtonAfterElement('input[name="subject_title"]', '粘贴标题', pasteToTitle);

        // 添加快速选择按钮到标签输入框
        addQuickSelectButton();

        // 初始化标签高亮功能
        initTagHighlight();

        // 添加粘贴搜索按钮
        addPasteSearchButton();

        // 为条目搜索页面添加粘贴搜索按钮
        addPasteSearchButtonForSubjectSearch();
    }

    // 在指定元素后添加按钮的通用函数
    function addPasteButtonAfterElement(selector, buttonText, clickHandler) {
        const element = document.querySelector(selector);
        if (element) {
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.type = 'button';
            button.style.marginLeft = '10px';
            button.style.padding = '2px 8px';
            button.style.fontSize = '12px';
            button.style.cursor = 'pointer';
            button.style.borderRadius = '5px';
            button.style.border = 'none';
            button.style.outline = 'none';
            button.style.background = '#409eff';
            button.style.transition = 'all 0.3s';
            button.addEventListener('click', clickHandler);
            button.addEventListener("mouseover", () => {
            button.style.background = '#79bbff';
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 0 5px #f8f8f8';
            });
            button.addEventListener("mouseout", () => {
            button.style.background = '#409eff';
            button.style.transform = 'scale(1.0)';
            button.style.boxShadow = 'none';
            });

            element.parentNode.insertBefore(button, element.nextSibling);
        }
    }

    // 粘贴到Infobox的函数
    async function pasteToInfobox() {
        try {
            const text = await navigator.clipboard.readText();
            const infoboxTextarea = document.querySelector('textarea[name="subject_infobox"]');
            if (infoboxTextarea) {
                infoboxTextarea.value = text;
                showNotification('内容已粘贴到Wiki');
            }
        } catch (err) {
            console.error('粘贴失败: ', err);
            showNotification('粘贴失败，请检查剪贴板权限');
        }
    }

    // 粘贴到简介的函数
    async function pasteToSummary() {
        try {
            const text = await navigator.clipboard.readText();
            const summaryTextarea = document.querySelector('textarea[name="subject_summary"]');
            if (summaryTextarea) {
                summaryTextarea.value = text;
                showNotification('内容已粘贴到简介');
            }
        } catch (err) {
            console.error('粘贴失败: ', err);
            showNotification('粘贴失败，请检查剪贴板权限');
        }
    }
    // 粘贴到标题的函数
    async function pasteToTitle() {
        try {
            const text = await navigator.clipboard.readText();
            const titleInput = document.querySelector('input[name="subject_title"]');
            if (titleInput) {
                titleInput.value = text;
                showNotification('标题已更新');
            }
        } catch (err) {
            console.error('粘贴失败: ', err);
            showNotification('粘贴失败，请检查剪贴板权限');
        }
    }

    // 添加快速选择按钮
    function addQuickSelectButton() {
        const tagsInput = document.querySelector('input[name="subject_meta_tags"]');
        if (tagsInput) {
            const quickSelectBtn = document.createElement('button');
            quickSelectBtn.textContent = '快速选择';
            quickSelectBtn.type = 'button';
            quickSelectBtn.style.marginLeft = '10px';
            quickSelectBtn.style.padding = '2px 8px';
            quickSelectBtn.style.fontSize = '12px';
            quickSelectBtn.style.cursor = 'pointer';
            quickSelectBtn.style.borderRadius = '5px';
            quickSelectBtn.style.border = 'none';
            quickSelectBtn.style.outline = 'none';
            quickSelectBtn.style.background = '#409eff';
            quickSelectBtn.style.transition = 'all 0.3s';
            quickSelectBtn.addEventListener('click', quickSelectTags);
            quickSelectBtn.addEventListener("mouseover", () => {
            quickSelectBtn.style.background = '#79bbff';
            quickSelectBtn.style.transform = 'scale(1.05)';
            quickSelectBtn.style.boxShadow = '0 0 5px #f8f8f8';
            });
            quickSelectBtn.addEventListener("mouseout", () => {
            quickSelectBtn.style.background = '#409eff';
            quickSelectBtn.style.transform = 'scale(1.0)';
            quickSelectBtn.style.boxShadow = 'none';
            });

            tagsInput.parentNode.insertBefore(quickSelectBtn, tagsInput.nextSibling);
        }
    }

    // 快速选择标签功能
    function quickSelectTags() {
        const infoboxTextarea = document.querySelector('textarea[name="subject_infobox"]');
        const tagsInput = document.querySelector('input[name="subject_meta_tags"]');

        if (!infoboxTextarea || !tagsInput) return;

        const infoboxContent = infoboxTextarea.value;
        const selectedTags = [];

        // 提取平台（可能有多个，用[]包起来）
        const platformMatch = infoboxContent.match(/\|平台=\{([^}]+)\}/);
        if (platformMatch) {
            const platforms = platformMatch[1].match(/\[([^\]]+)\]/g);
            if (platforms) {
                platforms.forEach(platform => {
                    const cleanPlatform = platform.replace(/[\[\]]/g, '').trim();
                    if (cleanPlatform && isValidTag(cleanPlatform)) {
                        selectedTags.push(cleanPlatform);
                    }
                });
            }
        }

        // 提取游戏类型（可能有多个，用、隔开）
        const genreMatch = infoboxContent.match(/\|游戏类型=([^\n|]+)/);
        if (genreMatch) {
            const genres = genreMatch[1].split('、').map(g => g.trim());
            genres.forEach(genre => {
                if (genre && isValidTag(genre)) {
                    selectedTags.push(genre);
                }
            });
        }

        // 检查是否存在DLsite相关信息
        if (infoboxContent.toLowerCase().includes('dlsite')) {
            if (isValidTag('R18')) {
                selectedTags.push('R18');
            }
        }

        // 去重并设置标签
        const uniqueTags = [...new Set(selectedTags)];
        tagsInput.value = uniqueTags.join(' ');

        // 更新标签高亮
        updateTagHighlight();
        showNotification('标签已自动选择');
    }

    // 检查标签是否有效（在页面标签列表中存在）
    function isValidTag(tag) {
        const tagButtons = document.querySelectorAll('.tag_list a.btnGraySmall');
        for (let btn of tagButtons) {
            if (btn.textContent.trim() === tag) {
                return true;
            }
        }
        return false;
    }

    // 初始化标签高亮功能
    function initTagHighlight() {
        const tagsInput = document.querySelector('input[name="subject_meta_tags"]');
        if (!tagsInput) return;

        // 初始高亮
        updateTagHighlight();

        // 监听输入变化
        tagsInput.addEventListener('input', updateTagHighlight);
        tagsInput.addEventListener('change', updateTagHighlight);
    }

    // 处理标签点击事件
    function handleTagClick(e, tagText) {
        e.preventDefault();
        e.stopPropagation();

        const tagsInput = document.querySelector('input[name="subject_meta_tags"]');
        if (!tagsInput) return;

        const currentTags = tagsInput.value.split(' ').filter(tag => tag.trim());
        const isSelected = currentTags.includes(tagText);

        if (isSelected) {
            // 如果已选中，则移除
            const newTags = currentTags.filter(tag => tag !== tagText);
            tagsInput.value = newTags.join(' ');
        } else {
            // 如果未选中，则使用页面原有的添加标签功能
            // 避免使用 eval，直接调用页面的全局函数
            if (typeof window.chiiLib !== 'undefined' &&
                typeof window.chiiLib.subject !== 'undefined' &&
                typeof window.chiiLib.subject.addTag === 'function') {
                window.chiiLib.subject.addTag(tagText);
            } else {
                // 备用方案：手动添加标签
                tagsInput.value = currentTags.concat(tagText).join(' ');
            }
        }

        // 更新高亮状态
        updateTagHighlight();
    }

    // 修改 updateTagHighlight 函数中的事件绑定部分：
    function updateTagHighlight() {
        const tagsInput = document.querySelector('input[name="subject_meta_tags"]');
        if (!tagsInput) return;

        const currentTags = tagsInput.value.split(' ').filter(tag => tag.trim());
        const tagButtons = document.querySelectorAll('.tag_list a.btnGraySmall');

        tagButtons.forEach(btn => {
            const tagText = btn.textContent.trim();
            const isSelected = currentTags.includes(tagText);

            if (isSelected) {
                btn.style.backgroundColor = '#90EE90'; // 淡绿色
                btn.style.color = '#000';
                btn.style.borderColor = '#90EE90';
            } else {
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }

            // 移除所有现有的事件监听器（通过克隆节点）
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            // 添加新的事件监听器
            newBtn.addEventListener('click', function(e) {
                handleTagClick(e, tagText);
            });

            // 移除原有的 onclick 属性，避免冲突
            newBtn.removeAttribute('onclick');
        });
    }

    // 添加粘贴搜索按钮
    function addPasteSearchButton() {
        const headerSearch = document.querySelector('#headerSearch');
        if (headerSearch) {
            // 创建新的按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '-28px';
            buttonContainer.style.marginLeft = '-75px';

            const pasteSearchBtn = document.createElement('input');
            pasteSearchBtn.type = 'button';
            pasteSearchBtn.value = '粘贴搜索';
            pasteSearchBtn.className = 'search';
            pasteSearchBtn.style.padding = '2px 8px';
            pasteSearchBtn.style.marginLeft = '0';
            pasteSearchBtn.style.cursor = 'pointer';
            pasteSearchBtn.style.border = 'none';
            pasteSearchBtn.style.outline = 'none';
            pasteSearchBtn.style.borderRadius = '5px';
            pasteSearchBtn.style.background = '#409eff';
            pasteSearchBtn.style.transition = 'all 0.3s';
            pasteSearchBtn.addEventListener('click', performPasteSearch);
            pasteSearchBtn.addEventListener("mouseover", () => {
            pasteSearchBtn.style.background = '#79bbff';
            pasteSearchBtn.style.transform = 'scale(1.05)';
            pasteSearchBtn.style.boxShadow = '0 0 5px #f8f8f8';
            });
            pasteSearchBtn.addEventListener("mouseout", () => {
            pasteSearchBtn.style.background = '#409eff';
            pasteSearchBtn.style.transform = 'scale(1.0)';
            pasteSearchBtn.style.boxShadow = 'none';
            });

            buttonContainer.appendChild(pasteSearchBtn);

            // 将按钮容器添加到headerSearch后面
            headerSearch.parentNode.insertBefore(buttonContainer, headerSearch.nextSibling);
        }
    }

    // 执行粘贴搜索功能
    async function performPasteSearch() {
        try {
            const searchInput = document.querySelector('#search_text');
            if (!searchInput) return;

            // 尝试使用更兼容的方式读取剪贴板
            let text = '';

            // Clipboard API
            if (navigator.clipboard && navigator.clipboard.readText) {
                try {
                    text = await navigator.clipboard.readText();
                } catch (err) {
                    console.log('粘贴失败');
                }
            }

            if (text.trim()) {
                // 将内容填入搜索框
                searchInput.value = text.trim();

                // 替代方案：模拟点击搜索按钮
                const searchButton = document.querySelector('#headerSearch input[type="submit"]');
                if (searchButton) {
                    searchButton.click();
                }
            } else {
                showNotification('剪贴板为空或内容无效');
            }
        } catch (err) {
            console.error('粘贴搜索失败: ', err);
            // 显示更详细的错误信息
            showNotification('粘贴搜索失败: ' + err.message);
        }
    }

    // 为条目搜索页面添加粘贴搜索按钮
    function addPasteSearchButtonForSubjectSearch() {
        const searchBox = document.querySelector('.searchBox');
        if (searchBox) {
            const searchInput = searchBox.querySelector('input[name="search_text"]');
            const searchButton = searchBox.querySelector('input[type="submit"]');

            if (searchInput && searchButton) {
                const pasteSearchBtn = document.createElement('input');
                pasteSearchBtn.type = 'button';
                pasteSearchBtn.value = '粘贴搜索';
                pasteSearchBtn.className = 'searchBtnL';
                pasteSearchBtn.style.marginLeft = '5px';
                pasteSearchBtn.style.cursor = 'pointer';
                pasteSearchBtn.style.padding = '2px 8px';
                pasteSearchBtn.style.border = 'none';
                pasteSearchBtn.style.outline = 'none';
                pasteSearchBtn.style.borderRadius = '5px';
                pasteSearchBtn.style.background = '#409eff';
                pasteSearchBtn.style.transition = 'all 0.3s';
                pasteSearchBtn.addEventListener('click', performPasteSearchForSubject);
                pasteSearchBtn.addEventListener("mouseover", () => {
                    pasteSearchBtn.style.background = '#79bbff';
                    pasteSearchBtn.style.transform = 'scale(1.05)';
                    pasteSearchBtn.style.boxShadow = '0 0 5px #f8f8f8';
                });
                pasteSearchBtn.addEventListener("mouseout", () => {
                    pasteSearchBtn.style.background = '#409eff';
                    pasteSearchBtn.style.transform = 'scale(1.0)';
                    pasteSearchBtn.style.boxShadow = 'none';
                });

                // 将按钮插入到搜索按钮后面
                searchButton.parentNode.insertBefore(pasteSearchBtn, searchButton.nextSibling);
            }
        }
    }

    // 执行条目搜索页面的粘贴搜索功能
    async function performPasteSearchForSubject() {
        try {
            const searchInput = document.querySelector('.searchBox input[name="search_text"]');
            if (!searchInput) return;

            // 尝试使用更兼容的方式读取剪贴板
            let text = '';

            // Clipboard API
            if (navigator.clipboard && navigator.clipboard.readText) {
                try {
                    text = await navigator.clipboard.readText();
                } catch (err) {
                    console.log('粘贴失败，尝试备用方法');
                    // 备用方法：使用prompt
                    text = prompt('请粘贴您要搜索的内容:');
                    if (!text) return;
                }
            }

            if (text && text.trim()) {
                // 将内容填入搜索框
                searchInput.value = text.trim();

                // 提交表单
                const searchForm = document.querySelector('.searchBox form');
                if (searchForm) {
                    // 使用HTMLFormElement的原型方法来避免命名冲突
                    HTMLFormElement.prototype.submit.call(searchForm);
                }
            } else {
                showNotification('剪贴板为空或内容无效');
            }
        } catch (err) {
            console.error('粘贴搜索失败: ', err);
            showNotification('粘贴搜索失败: ' + err.message);
        }
    }

    // 显示通知的函数
    function showNotification(message) {
        // 移除已存在的通知
        const existingNotification = document.querySelector('.paste-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'paste-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
})();
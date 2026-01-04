// ==UserScript==
// @name         知乎推荐页标签屏蔽器 (Zhihu Tag Blocker)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  以往都是根据标题关键词屏蔽, 效果不好, 经实验, 通过标签来屏蔽, 效果显著, 使用体验大大提升.
// @author       ChatGPT
// @match        https://www.zhihu.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      www.zhihu.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552222/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E9%A1%B5%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD%E5%99%A8%20%28Zhihu%20Tag%20Blocker%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552222/%E7%9F%A5%E4%B9%8E%E6%8E%A8%E8%8D%90%E9%A1%B5%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD%E5%99%A8%20%28Zhihu%20Tag%20Blocker%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_TAGS = 'ZhihuBlockedTags';
    const STORAGE_KEY_FUZZY = 'ZhihuFuzzyMatchEnabled';
    const STORAGE_KEY_BLOCK_ZHUANLAN = 'ZhihuBlockZhuanlan';
    const STORAGE_KEY_CONFIG = 'ZhihuBlockerConfig';
    const LOG_PREFIX = '【知乎标签屏蔽器】';

    const FEED_ITEM_SELECTOR = '.Card.TopstoryItem.TopstoryItem-isRecommend';
    const TITLE_LINK_SELECTOR = '.ContentItem-title a[data-za-detail-view-element_name="Title"]';
    const TAG_CONTENT_SELECTOR = '.QuestionHeader-tags .css-1gomreu';

    const tagCache = new Map();
    let isDarkMode = false;
    let menuCommands = [];

    function loadBlockedTags() {
        const tagsStr = GM_getValue(STORAGE_KEY_TAGS, '');
        return tagsStr ? tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
    }

    function saveBlockedTags(tags) {
        const uniqueTags = Array.from(new Set(tags.map(tag => tag.trim()).filter(tag => tag.length > 0)));
        GM_setValue(STORAGE_KEY_TAGS, uniqueTags.join(', '));
        console.log(`${LOG_PREFIX}已保存屏蔽标签:`, uniqueTags);
    }

    function isFuzzyMatchEnabled() {
        return GM_getValue(STORAGE_KEY_FUZZY, false);
    }

    function setFuzzyMatchEnabled(enabled) {
        GM_setValue(STORAGE_KEY_FUZZY, enabled);
    }

    function isBlockZhuanlanEnabled() {
        return GM_getValue(STORAGE_KEY_BLOCK_ZHUANLAN, false);
    }

    function setBlockZhuanlanEnabled(enabled) {
        GM_setValue(STORAGE_KEY_BLOCK_ZHUANLAN, enabled);
    }

    function detectDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function getMenuStyles() {
        const baseStyles = {
            position: 'absolute',
            border: '1px solid #e1e4e8',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '5px 0',
            zIndex: '2000',
            minWidth: '150px',
            fontSize: '14px'
        };

        if (isDarkMode) {
            return {
                ...baseStyles,
                background: '#1a1a1a',
                borderColor: '#434343',
                color: '#e6e6e6'
            };
        } else {
            return {
                ...baseStyles,
                background: 'white',
                color: '#175199'
            };
        }
    }

    function getMenuItemStyles() {
        const baseStyles = {
            padding: '5px 10px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
        };

        if (isDarkMode) {
            return {
                ...baseStyles,
                hoverBackground: '#2d2d2d'
            };
        } else {
            return {
                ...baseStyles,
                hoverBackground: '#f6f6f6'
            };
        }
    }

    function registerMenuCommands() {
        // 清除之前注册的命令
        menuCommands.forEach(cmd => {
            try {
                // Tampermonkey 没有直接删除命令的API，这里主要是为了重置数组
            } catch (e) {}
        });
        menuCommands = [];

        const isFuzzy = isFuzzyMatchEnabled();
        const blockZhuanlan = isBlockZhuanlanEnabled();

        menuCommands.push(GM_registerMenuCommand("🏷️ 查看/编辑屏蔽标签", editBlockedTags));
        menuCommands.push(GM_registerMenuCommand(`🔍 模糊匹配: ${isFuzzy ? '✅ 开启' : '❌ 关闭'}`, toggleFuzzyMatch));
        menuCommands.push(GM_registerMenuCommand(`📰 屏蔽知乎专栏/文章: ${blockZhuanlan ? '✅ 开启' : '❌ 关闭'}`, toggleBlockZhuanlan));
        menuCommands.push(GM_registerMenuCommand("📤 导出配置", exportConfig));
        menuCommands.push(GM_registerMenuCommand("📥 导入配置", importConfig));
    }

    function editBlockedTags() {
        const currentTags = loadBlockedTags().join(', ');
        const newTagsStr = prompt(
            `${LOG_PREFIX} 请输入要屏蔽的标签，多个标签用逗号分隔：\n\n注意：如果启用了模糊匹配，标签将会作为关键词进行匹配（同时匹配标签和标题）。`,
            currentTags
        );

        if (newTagsStr !== null) {
            const newTags = newTagsStr.split(',').map(tag => tag.trim());
            saveBlockedTags(newTags);
            showStatusMessage(`已更新屏蔽标签: ${newTags.length}个`);
            checkAndHideAllItems();
        }
    }

    function toggleFuzzyMatch() {
        const currentStatus = isFuzzyMatchEnabled();
        const newStatus = !currentStatus;
        setFuzzyMatchEnabled(newStatus);

        showStatusMessage(`模糊匹配 ${newStatus ? '✅ 已开启' : '❌ 已关闭'}`);
        registerMenuCommands(); // 刷新菜单
        checkAndHideAllItems();
    }

    function toggleBlockZhuanlan() {
        const currentStatus = isBlockZhuanlanEnabled();
        const newStatus = !currentStatus;
        setBlockZhuanlanEnabled(newStatus);

        showStatusMessage(`屏蔽知乎专栏/文章 ${newStatus ? '✅ 已开启' : '❌ 已关闭'}`);
        registerMenuCommands(); // 刷新菜单
        checkAndHideAllItems();
    }

    // 添加状态提示函数
    function showStatusMessage(message) {
        // 移除已有的提示
        const existingMsg = document.getElementById('zh-tag-blocker-status');
        if (existingMsg) existingMsg.remove();

        const statusMsg = document.createElement('div');
        statusMsg.id = 'zh-tag-blocker-status';
        statusMsg.textContent = `${LOG_PREFIX}${message}`;
        statusMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isDarkMode ? '#1a1a1a' : '#fff'};
            color: ${isDarkMode ? '#fff' : '#000'};
            border: 1px solid ${isDarkMode ? '#434343' : '#e1e4e8'};
            padding: 10px 15px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(statusMsg);

        // 3秒后自动消失
        setTimeout(() => {
            if (statusMsg.parentNode) {
                statusMsg.parentNode.removeChild(statusMsg);
            }
        }, 3000);
    }

    function exportConfig() {
        const config = {
            blockedTags: loadBlockedTags(),
            fuzzyMatch: isFuzzyMatchEnabled(),
            blockZhuanlan: isBlockZhuanlanEnabled(),
            exportTime: new Date().toISOString()
        };

        const configStr = JSON.stringify(config, null, 2);
        const blob = new Blob([configStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `zhihu-tag-blocker-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showStatusMessage('配置导出成功！');
    }

    function importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const config = JSON.parse(e.target.result);

                    if (!Array.isArray(config.blockedTags) || typeof config.fuzzyMatch !== 'boolean') {
                        throw new Error('无效的配置文件格式');
                    }

                    if (confirm(`${LOG_PREFIX}是否导入配置？\n屏蔽标签: ${config.blockedTags.length}个\n模糊匹配: ${config.fuzzyMatch ? '开启' : '关闭'}\n屏蔽专栏: ${config.blockZhuanlan ? '开启' : '关闭'}`)) {
                        saveBlockedTags(config.blockedTags);
                        setFuzzyMatchEnabled(config.fuzzyMatch);
                        setBlockZhuanlanEnabled(config.blockZhuanlan || false);
                        registerMenuCommands();
                        checkAndHideAllItems();
                        showStatusMessage('配置导入成功！');
                    }
                } catch (error) {
                    alert(`${LOG_PREFIX}配置文件解析失败: ${error.message}`);
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    function checkBlockHit(tags, title, blockedTags, fuzzyEnabled) {
        const matchedTags = [];
        let isBlocked = false;

        if (fuzzyEnabled) {
            // 模糊匹配：同时检查标签和标题
            for (const blockedWord of blockedTags) {
                if (!blockedWord) continue;
                
                // 检查标签
                let tagMatched = false;
                for (const tag of tags) {
                    if (tag.includes(blockedWord)) {
                        tagMatched = true;
                        isBlocked = true;
                        if (!matchedTags.includes(blockedWord)) matchedTags.push(blockedWord);
                        break;
                    }
                }
                
                // 如果标签没匹配到，检查标题
                if (!tagMatched && title && title.includes(blockedWord)) {
                    isBlocked = true;
                    if (!matchedTags.includes(blockedWord)) matchedTags.push(blockedWord);
                }
            }
        } else {
            // 精确匹配：只检查标签
            for (const blockedTag of blockedTags) {
                if (tags.includes(blockedTag)) {
                    isBlocked = true;
                    matchedTags.push(blockedTag);
                }
            }
        }

        return { isBlocked, matchedTags };
    }

    function isZhuanlanLink(link) {
        return link && (link.includes('zhuanlan.zhihu.com') || link.includes('//zhuanlan.zhihu.com/'));
    }

    function isZhuanlanArticle(feedItem) {
        // 方法1: 检查链接是否包含zhuanlan
        const titleLink = feedItem.querySelector(TITLE_LINK_SELECTOR);
        if (titleLink) {
            const href = titleLink.getAttribute('href');
            if (isZhuanlanLink(href)) {
                return true;
            }
        }

        // 方法2: 检查是否有专栏特定的类名或结构
        const articleItem = feedItem.querySelector('.ContentItem.ArticleItem');
        if (articleItem) {
            return true;
        }

        // 方法3: 检查是否有专栏特定的元数据 (可能不准确，但保留作为参考)
        const metaElement = feedItem.querySelector('[data-za-extra-module*="专栏"]');
        if (metaElement) {
            return true;
        }

        return false;
    }

    /**
     * 在标题前添加 [文章] 或 [回答] 标记
     * @param {HTMLElement} feedItem - 整个信息流卡片元素
     * @param {HTMLElement} titleLink - 标题链接元素
     * @param {boolean} isArticle - 是否为专栏文章
     */
    function createTypeTag(feedItem, titleLink, isArticle) {
        const existingTag = feedItem.querySelector('.zh-tag-type');
        if (existingTag) return;

        const tag = document.createElement('span');
        tag.className = 'zh-tag-type';
        const typeText = isArticle ? '文章' : '回答';
        // 专栏文章使用橙色，回答使用知乎默认蓝色 (或深色模式下的白色)
        const bgColor = isArticle ? '#ff9900' : (isDarkMode ? '#2d2d2d' : '#175199');
        const color = isArticle ? 'white' : (isDarkMode ? '#e6e6e6' : 'white');

        tag.textContent = `[${typeText}]`;
        tag.style.cssText = `
            margin-right: 8px;
            padding: 2px 6px;
            background-color: ${bgColor};
            color: ${color};
            border-radius: 4px;
            font-size: 12px;
            font-weight: normal;
            vertical-align: middle;
            display: inline-block;
            white-space: nowrap;
        `;

        const titleWrapper = titleLink.parentElement;
        if (titleWrapper) {
            // 插入到标题链接之前
            titleWrapper.insertBefore(tag, titleLink);
        }
    }

    function fetchQuestionTags(questionUrl) {
        if (tagCache.has(questionUrl)) {
            return Promise.resolve(tagCache.get(questionUrl));
        }

        const fullUrl = questionUrl.startsWith('http') ? questionUrl : `https:${questionUrl}`;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: fullUrl,
                onload: function(response) {
                    if (response.status !== 200) {
                        tagCache.set(questionUrl, []);
                        return resolve([]);
                    }

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const tags = Array.from(doc.querySelectorAll(TAG_CONTENT_SELECTOR))
                        .map(el => el.textContent.trim());
                        tagCache.set(questionUrl, tags);
                        resolve(tags);
                    } catch (e) {
                        tagCache.set(questionUrl, []);
                        resolve([]);
                    }
                },
                onerror: function() {
                    tagCache.set(questionUrl, []);
                    resolve([]);
                }
            });
        });
    }

    async function checkAndHideItem(feedItem) {
        if (feedItem.dataset.zhTagsProcessed === 'true') {
            applyHideRule(feedItem);
            return;
        }

        const titleLink = feedItem.querySelector(TITLE_LINK_SELECTOR);
        if (!titleLink) {
            feedItem.dataset.zhTagsProcessed = 'true';
            return;
        }

        const questionUrl = titleLink.getAttribute('href');
        if (!questionUrl) {
            feedItem.dataset.zhTagsProcessed = 'true';
            return;
        }

        // 1. 检查是否为知乎专栏/文章，并添加标记
        const isArticle = isZhuanlanArticle(feedItem);
        createTypeTag(feedItem, titleLink, isArticle);

        // 2. 检查是否开启了屏蔽专栏并隐藏
        if (isBlockZhuanlanEnabled() && isArticle) {
            if (feedItem.style.display !== 'none') {
                feedItem.style.display = 'none';
                console.log(`${LOG_PREFIX}已隐藏知乎专栏/文章: "${titleLink.textContent}"`);
            }
            feedItem.dataset.zhTagsProcessed = 'true';
            return;
        }

        // 3. 对于非专栏内容或未开启屏蔽专栏时，继续获取标签并根据标签屏蔽
        const tags = await fetchQuestionTags(questionUrl);
        feedItem.dataset.zhQuestionTags = JSON.stringify(tags);
        applyHideRule(feedItem, titleLink, tags);
        createBlockerIcon(feedItem, titleLink, tags);
        feedItem.dataset.zhTagsProcessed = 'true';
    }

    function applyHideRule(feedItem, titleLink = null, tags = null) {
        // 如果内容是文章且未被屏蔽，则确保它显示
        const isArticle = isZhuanlanArticle(feedItem);
        if (isArticle) {
            if (isBlockZhuanlanEnabled()) {
                 // 如果已开启屏蔽，则保持隐藏（理论上在 checkAndHideItem 中已处理，这里是二次保险）
                feedItem.style.display = 'none';
                return;
            } else {
                // 如果未开启屏蔽，则显示
                feedItem.style.display = '';
                return;
            }
        }

        // 非文章内容，按标签规则处理
        if (!tags) {
            try {
                tags = JSON.parse(feedItem.dataset.zhQuestionTags || '[]');
            } catch (e) {
                tags = [];
            }
        }

        if (!titleLink) {
            titleLink = feedItem.querySelector(TITLE_LINK_SELECTOR);
        }

        const titleText = titleLink ? titleLink.textContent : '';

        const blockedTags = loadBlockedTags();
        const fuzzyEnabled = isFuzzyMatchEnabled();
        const { isBlocked, matchedTags } = checkBlockHit(tags, titleText, blockedTags, fuzzyEnabled);

        if (isBlocked && feedItem.style.display !== 'none') {
            feedItem.style.display = 'none';
            console.log(`${LOG_PREFIX}已隐藏问题 "${titleText}" (匹配模式: ${fuzzyEnabled ? '模糊' : '精确'}, 命中词: ${matchedTags.join(', ')})`);
        } else if (!isBlocked) {
            feedItem.style.display = '';
        }
    }

    function createBlockerIcon(feedItem, titleLink, tags) {
        if (feedItem.querySelector('.zh-tag-blocker-icon')) {
            return;
        }

        const icon = document.createElement('span');
        icon.className = 'zh-tag-blocker-icon';
        icon.innerHTML = '🏷️';
        icon.style.cssText = `
            margin-left: 8px;
            cursor: pointer;
            font-size: 14px;
            color: #8590a6;
            vertical-align: top;
            line-height: 1.5;
            z-index: 1000;
        `;
        icon.title = '点击显示/编辑屏蔽标签菜单';

        const titleWrapper = titleLink.parentElement;
        // 确保在类型标记之后，标题链接之后插入
        const referenceNode = titleWrapper.querySelector('.zh-tag-type') ? titleLink.nextSibling : titleLink;
        if (titleWrapper) {
            titleWrapper.appendChild(icon);
        }

        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showTagContextMenu(icon, tags);
        });
    }

    function showTagContextMenu(targetElement, tags) {
        document.querySelectorAll('.zh-tag-blocker-menu').forEach(menu => menu.remove());

        const menu = document.createElement('div');
        menu.className = 'zh-tag-blocker-menu';

        const styles = getMenuStyles();
        Object.assign(menu.style, styles);

        const blockedTags = loadBlockedTags();
        const itemStyles = getMenuItemStyles();

        if (tags.length === 0) {
            const item = document.createElement('div');
            item.textContent = '未找到标签';
            Object.assign(item.style, {
                padding: '5px 10px',
                color: '#8590a6',
                fontSize: '12px'
            });
            menu.appendChild(item);
        } else {
            tags.forEach(tag => {
                const isBlocked = blockedTags.includes(tag);
                const item = document.createElement('div');
                item.textContent = `${isBlocked ? '🚫 (取消屏蔽)' : '➕ (添加屏蔽)'} ${tag}`;
                Object.assign(item.style, itemStyles);
                item.style.color = isBlocked ? 'red' : (isDarkMode ? '#e6e6e6' : '#175199');

                item.addEventListener('mouseover', () => {
                    item.style.backgroundColor = itemStyles.hoverBackground;
                });
                item.addEventListener('mouseout', () => {
                    item.style.backgroundColor = 'transparent';
                });

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let updatedTags = loadBlockedTags();

                    const currentlyBlocked = updatedTags.includes(tag);
                    if (currentlyBlocked) {
                        updatedTags = updatedTags.filter(t => t !== tag);
                    } else {
                        updatedTags.push(tag);
                    }

                    saveBlockedTags(updatedTags);
                    checkAndHideAllItems();

                    showStatusMessage(`${currentlyBlocked ? '取消屏蔽' : '添加屏蔽'}标签: ${tag}`);

                    const newIsBlocked = !currentlyBlocked;
                    item.textContent = `${newIsBlocked ? '🚫 (取消屏蔽)' : '➕ (添加屏蔽)'} ${tag}`;
                    item.style.color = newIsBlocked ? 'red' : (isDarkMode ? '#e6e6e6' : '#175199');
                });

                menu.appendChild(item);
            });
        }

        const rect = targetElement.getBoundingClientRect();
        menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
        menu.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== targetElement) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }

    function checkAndHideAllItems() {
        document.querySelectorAll(FEED_ITEM_SELECTOR).forEach(item => {
            // 强制重新处理所有未处理或需要重新应用规则的项
            item.dataset.zhTagsProcessed = 'false';
            checkAndHideItem(item);
        });
    }

    function initObserver() {
        const targetNode = document.querySelector('#root') || document.body;

        if (!targetNode) return;

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.matches(FEED_ITEM_SELECTOR)) {
                            checkAndHideItem(node);
                        } else if (node.nodeType === 1 && node.querySelector(FEED_ITEM_SELECTOR)) {
                            node.querySelectorAll(FEED_ITEM_SELECTOR).forEach(item => checkAndHideItem(item));
                        }
                    }
                }
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function main() {
        isDarkMode = detectDarkMode();
        registerMenuCommands();
        checkAndHideAllItems();
        initObserver();

        console.log(`${LOG_PREFIX}脚本已加载 - 版本 1.8`);
        console.log(`${LOG_PREFIX}当前设置: 模糊匹配 ${isFuzzyMatchEnabled() ? '开启' : '关闭'}, 屏蔽专栏 ${isBlockZhuanlanEnabled() ? '开启' : '关闭'}`);
    }

    main();
})();
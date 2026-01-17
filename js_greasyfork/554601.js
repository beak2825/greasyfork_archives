// ==UserScript==
// @name         X 翻译姬
// @namespace    https://github.com/sixiaolong1117/Tampermonkey
// @version      0.4
// @description  将推文翻译为简体中文，并在下方显示
// @license      MIT
// @icon         https://x.com/favicon.ico
// @author       SI Xiaolong
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      translate.googleapis.com
// @connect      api.mymemory.translated.net
// @downloadURL https://update.greasyfork.org/scripts/554601/X%20%E7%BF%BB%E8%AF%91%E5%A7%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/554601/X%20%E7%BF%BB%E8%AF%91%E5%A7%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 已翻译的元素集合，避免重复翻译
    const translatedElements = new WeakSet();

    // 默认设置
    const DEFAULT_SETTINGS = {
        translationSource: 'google',
        sourceLang: 'auto',
        targetLang: 'zh-CN'
    };

    // 获取当前设置
    function getSettings() {
        return {
            translationSource: GM_getValue('translationSource', DEFAULT_SETTINGS.translationSource),
            sourceLang: GM_getValue('sourceLang', DEFAULT_SETTINGS.sourceLang),
            targetLang: GM_getValue('targetLang', DEFAULT_SETTINGS.targetLang)
        };
    }

    // 保存设置
    function saveSetting(key, value) {
        GM_setValue(key, value);
        location.reload();
    }

    // 翻译源配置
    const TRANSLATION_SOURCES = {
        google: 'Google 翻译',
        mymemory: 'MyMemory 翻译'
    };

    // 语言配置
    const LANGUAGES = {
        'auto': '自动检测',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
        'en': '英语',
        'ja': '日语',
        'ko': '韩语',
        'es': '西班牙语',
        'fr': '法语',
        'de': '德语',
        'ru': '俄语',
        'ar': '阿拉伯语',
        'pt': '葡萄牙语',
        'it': '意大利语',
        'th': '泰语',
        'vi': '越南语'
    };

    // 检测当前主题（深色或浅色）
    function detectTheme() {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (rgb) {
            const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
            return brightness > 128 ? 'light' : 'dark';
        }
        return 'dark';
    }

    // 获取主题相关的颜色
    function getThemeColors() {
        const theme = detectTheme();

        if (theme === 'light') {
            return {
                background: 'rgba(247, 249, 249, 0.8)',
                loadingText: '#536471',
                translatedText: '#0f1419',
                errorText: '#f4212e',
                headerText: '#536471',
                border: 'rgba(207, 217, 222, 0.3)'
            };
        } else {
            return {
                background: 'rgba(32, 35, 39, 0.8)',
                loadingText: '#8b949e',
                translatedText: '#e7e9ea',
                errorText: '#ff6b6b',
                headerText: '#8b949e',
                border: 'rgba(47, 51, 54, 0.3)'
            };
        }
    }

    // 注册菜单命令
    function registerMenuCommands() {
        const settings = getSettings();

        // 翻译源选择
        GM_registerMenuCommand(`🌐 翻译源: ${TRANSLATION_SOURCES[settings.translationSource]}`, () => {
            const sources = Object.keys(TRANSLATION_SOURCES);
            const currentIndex = sources.indexOf(settings.translationSource);
            const nextIndex = (currentIndex + 1) % sources.length;
            const nextSource = sources[nextIndex];
            saveSetting('translationSource', nextSource);
        });

        // 源语言选择
        GM_registerMenuCommand(`📤 源语言: ${LANGUAGES[settings.sourceLang]}`, () => {
            showLanguageSelector('sourceLang', '选择源语言');
        });

        // 目标语言选择
        GM_registerMenuCommand(`📥 目标语言: ${LANGUAGES[settings.targetLang]}`, () => {
            showLanguageSelector('targetLang', '选择目标语言');
        });

        // 重置设置
        GM_registerMenuCommand('🔄 重置为默认设置', () => {
            if (confirm('确定要重置所有设置为默认值吗？')) {
                saveSetting('translationSource', DEFAULT_SETTINGS.translationSource);
                saveSetting('sourceLang', DEFAULT_SETTINGS.sourceLang);
                saveSetting('targetLang', DEFAULT_SETTINGS.targetLang);
            }
        });
    }

    // 显示语言选择对话框
    function showLanguageSelector(settingKey, title) {
        const languages = Object.keys(LANGUAGES);
        const languageList = languages.map((code, index) =>
            `${index + 1}. ${LANGUAGES[code]} (${code})`
        ).join('\n');

        const input = prompt(`${title}\n\n${languageList}\n\n请输入语言代码（如 zh-CN, en, ja 等）：`);

        if (input && LANGUAGES[input]) {
            saveSetting(settingKey, input);
        } else if (input) {
            alert('无效的语言代码！');
        }
    }

    // Google翻译API
    async function translateWithGoogle(text, sourceLang, targetLang) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        const translatedText = result[0].map(item => item[0]).join('');
                        resolve(translatedText);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    // MyMemory翻译API
    async function translateWithMyMemory(text, sourceLang, targetLang) {
        const langPair = `${sourceLang === 'auto' ? 'en' : sourceLang}|${targetLang}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function (response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.responseStatus === 200) {
                            resolve(result.responseData.translatedText);
                        } else {
                            reject(new Error('Translation failed'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    // 统一翻译接口
    async function translateText(text) {
        const settings = getSettings();
        const { translationSource, sourceLang, targetLang } = settings;

        switch (translationSource) {
            case 'google':
                return await translateWithGoogle(text, sourceLang, targetLang);
            case 'mymemory':
                return await translateWithMyMemory(text, sourceLang, targetLang);
            default:
                return await translateWithGoogle(text, sourceLang, targetLang);
        }
    }

    // 保护文本中的特殊元素（@mentions, #hashtags, URLs）
    function protectSpecialElements(text) {
        const protectedElements = [];
        let protectedText = text;

        // 保护 URL（优先处理，因为URL可能包含其他特殊字符）
        protectedText = protectedText.replace(/https?:\/\/[^\s]+/g, (match) => {
            const placeholder = `__URL_${protectedElements.length}__`;
            protectedElements.push(match);
            return placeholder;
        });

        // 保护 @mentions
        protectedText = protectedText.replace(/@[\w]+/g, (match) => {
            const placeholder = `__MENTION_${protectedElements.length}__`;
            protectedElements.push(match);
            return placeholder;
        });

        // 保护 #hashtags
        protectedText = protectedText.replace(/#[\w\u4e00-\u9fa5]+/g, (match) => {
            const placeholder = `__HASHTAG_${protectedElements.length}__`;
            protectedElements.push(match);
            return placeholder;
        });

        return { protectedText, protectedElements };
    }

    // 恢复保护的特殊元素
    function restoreSpecialElements(text, protectedElements) {
        let restoredText = text;

        protectedElements.forEach((element, index) => {
            if (element.startsWith('@')) {
                restoredText = restoredText.replace(`__MENTION_${index}__`, element);
            } else if (element.startsWith('#')) {
                restoredText = restoredText.replace(`__HASHTAG_${index}__`, element);
            } else if (element.startsWith('http')) {
                restoredText = restoredText.replace(`__URL_${index}__`, element);
            }
        });

        return restoredText;
    }

    // 提取纯文本内容（不提取链接信息）
    function extractPlainText(element) {
        let textParts = [];

        function traverse(node) {
            // 跳过某些不需要翻译的元素（如按钮、SVG等）
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                if (tagName === 'button' || tagName === 'svg' || tagName === 'path') {
                    return;
                }
            }

            for (let child of node.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.textContent.trim();
                    if (text) textParts.push(text);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    // 对于链接元素，直接提取文本内容，保持位置
                    if (child.tagName === 'A') {
                        const linkText = child.textContent.trim();
                        if (linkText) textParts.push(linkText);
                    } else {
                        // 递归处理其他元素
                        traverse(child);
                    }
                }
            }
        }

        traverse(element);
        return textParts.join(' ');
    }

    // 创建占位翻译框
    function createPlaceholderBox() {
        const settings = getSettings();
        const sourceName = TRANSLATION_SOURCES[settings.translationSource];
        const colors = getThemeColors();

        const box = document.createElement('div');
        box.className = 'x-translator-box';
        box.style.cssText = `
            margin-top: 12px;
            padding: 12px 16px;
            background-color: ${colors.background};
            border: 1px solid ${colors.border};
            border-radius: 12px;
            font-size: 15px;
            line-height: 1.5;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        `;

        // 创建标题
        const header = document.createElement('div');
        header.className = 'x-translator-header';
        header.style.cssText = `
            font-size: 13px;
            color: ${colors.headerText};
            margin-bottom: 8px;
            font-weight: 500;
            transition: color 0.2s ease;
        `;
        header.textContent = `📝 ${sourceName}`;

        // 创建加载中的内容容器
        const content = document.createElement('div');
        content.className = 'x-translator-content';
        content.style.cssText = `
            color: ${colors.loadingText};
            white-space: pre-wrap;
            word-wrap: break-word;
            transition: color 0.2s ease;
        `;
        content.textContent = '翻译中...';

        box.appendChild(header);
        box.appendChild(content);

        return box;
    }

    // 更新翻译框内容（成功）
    function updateTranslationBox(box, translatedText) {
        const colors = getThemeColors();
        const content = box.querySelector('.x-translator-content');

        content.style.color = colors.translatedText;
        content.textContent = translatedText;
    }

    // 更新翻译框内容（失败）
    function updateTranslationBoxError(box, errorMessage) {
        const colors = getThemeColors();
        const content = box.querySelector('.x-translator-content');

        content.style.color = colors.errorText;
        content.textContent = `❌ 翻译失败: ${errorMessage}`;
    }

    // 更新所有翻译框的主题
    function updateAllBoxesTheme() {
        const colors = getThemeColors();
        const boxes = document.querySelectorAll('.x-translator-box');

        boxes.forEach(box => {
            box.style.backgroundColor = colors.background;
            box.style.borderColor = colors.border;

            const header = box.querySelector('.x-translator-header');
            if (header) {
                header.style.color = colors.headerText;
            }

            const content = box.querySelector('.x-translator-content');
            if (content) {
                const text = content.textContent;
                if (text === '翻译中...') {
                    content.style.color = colors.loadingText;
                } else if (text.startsWith('❌')) {
                    content.style.color = colors.errorText;
                } else {
                    content.style.color = colors.translatedText;
                }
            }
        });
    }

    // 处理翻译
    async function processTranslation(element, isTrend = false) {
        // 如果已经翻译过，跳过
        if (translatedElements.has(element)) {
            return;
        }

        // 标记为已处理
        translatedElements.add(element);

        // 提取纯文本内容
        const originalText = extractPlainText(element);

        if (originalText.length === 0) {
            return;
        }

        // 对于热搜，进行额外过滤
        if (isTrend) {
            // 排除"xx的趋势"这类描述性文字
            if (originalText.match(/的趋势|条推文|Trending|posts?$/i)) {
                return;
            }
            // 如果文本太短（少于2个字符），也跳过
            if (originalText.length < 2) {
                return;
            }
        }

        // 创建占位框并立即插入到页面
        const placeholderBox = createPlaceholderBox();
        const parentContainer = element.parentElement;
        if (parentContainer) {
            parentContainer.insertBefore(placeholderBox, element.nextSibling);
        }

        try {
            // 保护特殊元素
            const { protectedText, protectedElements } = protectSpecialElements(originalText);

            // 翻译文本
            const rawTranslatedText = await translateText(protectedText);

            // 恢复特殊元素
            const translatedText = restoreSpecialElements(rawTranslatedText, protectedElements);

            // 如果翻译结果与原文相同，说明可能已经是目标语言，移除占位框
            if (translatedText === originalText) {
                if (placeholderBox.parentNode) {
                    placeholderBox.parentNode.removeChild(placeholderBox);
                }
                return;
            }

            // 更新占位框内容为翻译结果
            updateTranslationBox(placeholderBox, translatedText);

        } catch (e) {
            console.error('翻译失败:', e);
            // 更新占位框内容为错误信息
            updateTranslationBoxError(placeholderBox, e.message || '未知错误');
        }
    }

    // 查找并处理所有推文
    function findAndTranslateTweets() {
        const tweetDivs = document.querySelectorAll('[data-testid="tweetText"]');
        tweetDivs.forEach(div => {
            processTranslation(div, false);
        });
    }

    // 查找并处理用户简介
    function findAndTranslateUserDescription() {
        const userDescriptions = document.querySelectorAll('[data-testid="UserDescription"]');
        userDescriptions.forEach(div => {
            processTranslation(div, false);
        });
    }

    // 查找并处理热搜趋势（优化版）
    function findAndTranslateTrends() {
        const trends = document.querySelectorAll('[data-testid="trend"]');
        trends.forEach(trendDiv => {
            const divs = trendDiv.querySelectorAll('div[dir="ltr"]');
            let trendTextElement = null;

            for (let div of divs) {
                const text = div.textContent.trim();
                const classList = div.className || '';

                if (!text) continue;
                if (text.match(/趋势|Trending/i)) continue;
                if (text.match(/条帖子|posts?$/i)) continue;
                if (text.match(/^[\d,]+$/)) continue;

                if (classList.includes('r-b88u0q') ||
                    (!trendTextElement && text.length > 0)) {
                    trendTextElement = div;
                    break;
                }
            }

            if (trendTextElement) {
                processTranslation(trendTextElement, true);
            }
        });
    }

    // 查找并翻译读者背景信息（Community Notes）
    function findAndTranslateCommunityNotes() {
        // 查找所有包含读者背景信息的容器
        const communityNotes = document.querySelectorAll('[data-testid="birdwatch-pivot"]');
        
        communityNotes.forEach(noteContainer => {
            // 查找背景信息的主要文本内容
            // 通常在包含长文本的 div 中
            const noteTextElements = noteContainer.querySelectorAll('div[dir="ltr"]');
            
            noteTextElements.forEach(element => {
                const text = element.textContent.trim();
                
                // 过滤掉标题和按钮文本
                if (text.length < 10) return;
                if (text.includes('读者添加了背景信息') || text.includes('Reader added context')) return;
                if (text.includes('你觉得此信息是否有帮助') || text.includes('Helpful?')) return;
                if (text.includes('请进行评价') || text.includes('Rate it')) return;
                
                // 检查是否包含实质性内容（通常包含链接或较长文本）
                const hasSubstantialContent = text.length > 20 || element.querySelector('a');
                
                if (hasSubstantialContent) {
                    processTranslation(element, false);
                }
            });
        });
    }

    // 查找并翻译所有内容
    function findAndTranslateAll() {
        findAndTranslateTweets();
        findAndTranslateUserDescription();
        findAndTranslateTrends();
        findAndTranslateCommunityNotes();
    }

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        findAndTranslateAll();
    });

    // 监听主题变化
    const themeObserver = new MutationObserver(() => {
        updateAllBoxesTheme();
    });

    // 注册菜单
    registerMenuCommands();

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听body的属性变化（主题切换通常会改变body的class或style）
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // 监听HTML元素的属性变化（有些网站会在html元素上设置主题）
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-theme']
    });

    // 初始翻译
    findAndTranslateAll();

    // 定期检查新内容（作为备用）
    setInterval(findAndTranslateAll, 2000);

    console.log('Twitter翻译脚本已加载，当前设置:', getSettings());

})();
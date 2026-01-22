// ==UserScript==
// @name         维基百科多语言词条名显示
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  在维基百科词条页面顶部显示其他语言版本的词条名称，支持点击跳转和一键复制
// @author       You
// @match        https://*.wikipedia.org/wiki/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/563495/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E5%A4%9A%E8%AF%AD%E8%A8%80%E8%AF%8D%E6%9D%A1%E5%90%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563495/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E5%A4%9A%E8%AF%AD%E8%A8%80%E8%AF%8D%E6%9D%A1%E5%90%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认显示的语言列表（可以通过菜单配置）
    const DEFAULT_LANGUAGES = ['zh', 'en', 'ja', 'ko'];

    // 语言代码到名称的映射
    const LANGUAGE_NAMES = {
        'zh': '中文',
        'zh-yue': '粤语',
        'zh-classical': '文言',
        'en': 'English',
        'ja': '日本語',
        'ko': '한국어',
        'de': 'Deutsch',
        'fr': 'Français',
        'es': 'Español',
        'ru': 'Русский',
        'it': 'Italiano',
        'pt': 'Português',
        'ar': 'العربية',
        'nl': 'Nederlands',
        'pl': 'Polski',
        'sv': 'Svenska',
        'th': 'ไทย',
        'vi': 'Tiếng Việt',
        'tr': 'Türkçe',
        'id': 'Bahasa Indonesia'
    };

    // 获取当前显示的语言列表
    function getDisplayLanguages() {
        const saved = GM_getValue('displayLanguages', null);
        return saved ? JSON.parse(saved) : DEFAULT_LANGUAGES;
    }

    // 保存显示的语言列表
    function setDisplayLanguages(languages) {
        GM_setValue('displayLanguages', JSON.stringify(languages));
    }

    // 获取当前页面的语言代码
    function getCurrentLanguage() {
        const hostname = window.location.hostname;
        const match = hostname.match(/^([a-z-]+)\.wikipedia\.org$/);
        return match ? match[1] : 'en';
    }

    // 从页面获取所有可用的语言链接
    function getLanguageLinks() {
        const links = {};

        // 方法1: 从侧边栏的语言链接获取 (旧版维基界面)
        document.querySelectorAll('.interlanguage-link').forEach(link => {
            const a = link.querySelector('a');
            if (a) {
                const langCode = link.getAttribute('class').match(/interwiki-([a-z-]+)/)?.[1];
                const titleAttr = a.getAttribute('title');
                if (langCode && titleAttr) {
                    // 标题格式: "ロシア帝国 – 日语"，使用 En Dash (–) 分隔
                    // 我们需要提取前半部分（词条名）
                    const title = titleAttr.includes(' – ')
                        ? titleAttr.split(' – ')[0]
                        : titleAttr;
                    links[langCode] = {
                        title: title,
                        url: a.href
                    };
                }
            }
        });

        // 方法2: 从新版界面的语言切换按钮获取 (Vector 2022)
        document.querySelectorAll('.interlanguage-link-target').forEach(link => {
            const langCode = link.getAttribute('lang');
            const titleAttr = link.getAttribute('title');
            if (langCode && link.href && titleAttr) {
                // 同样的格式，使用 En Dash (–) 分隔
                const title = titleAttr.includes(' – ')
                    ? titleAttr.split(' – ')[0]
                    : titleAttr;
                links[langCode] = {
                    title: title,
                    url: link.href
                };
            }
        });

        // 方法3: 从语言下拉菜单中获取 (通用方法，兼容性最好)
        document.querySelectorAll('a[lang]').forEach(link => {
            const langCode = link.getAttribute('lang');
            const titleAttr = link.getAttribute('title');
            const href = link.href;

            // 只处理维基百科链接
            if (langCode && titleAttr && href && href.includes('wikipedia.org/wiki/')) {
                // 避免重复添加
                if (!links[langCode]) {
                    const title = titleAttr.includes(' – ')
                        ? titleAttr.split(' – ')[0]
                        : titleAttr;
                    links[langCode] = {
                        title: title,
                        url: href
                    };
                }
            }
        });

        return links;
    }

    // 获取当前词条的标题
    function getCurrentTitle() {
        const h1 = document.querySelector('#firstHeading') || document.querySelector('.mw-page-title-main');
        return h1 ? h1.textContent.trim() : '';
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        GM_setClipboard(text);
        showNotification('已复制: ' + text);
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            font-family: sans-serif;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // 创建语言标签项
    function createLanguageItem(langCode, title, url) {
        const container = document.createElement('div');
        container.className = 'wiki-lang-item';
        container.style.cssText = `
            display: inline-block;
            margin: 5px 8px 5px 0;
            vertical-align: middle;
        `;

        // 创建词条标题链接（主按钮）
        const titleLink = document.createElement('a');
        titleLink.textContent = title;
        titleLink.href = url;
        titleLink.target = '_blank';
        titleLink.title = `${LANGUAGE_NAMES[langCode]} - 点击跳转`;
        titleLink.style.cssText = `
            display: inline-block;
            box-sizing: border-box;
            height: 26px;
            color: #0645ad;
            text-decoration: none;
            padding: 3px 12px;
            background: #f8f9fa;
            border: 1px solid #a2a9b1;
            border-right: none;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
            line-height: 20px;
            transition: all 0.2s;
            max-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
        `;
        titleLink.addEventListener('mouseenter', () => {
            titleLink.style.background = '#eaecf0';
        });
        titleLink.addEventListener('mouseleave', () => {
            titleLink.style.background = '#f8f9fa';
        });

        // 创建复制按钮（使用SVG图标）
        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = `<span style="display: flex; align-items: center; justify-content: center;"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="9" height="9" rx="1" stroke="white" stroke-width="1.5" fill="none"/>
            <path d="M3 11V3C3 2.44772 3.44772 2 4 2H10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        </svg></span>`;
        copyBtn.title = `复制${LANGUAGE_NAMES[langCode]}词条名`; // 鼠标悬停提示
        copyBtn.style.cssText = `
            display: inline-flex;
            box-sizing: border-box;
            height: 26px;
            align-items: center;
            justify-content: center;
            background: #0645ad;
            color: white;
            border: 1px solid #0645ad;
            border-radius: 0 4px 4px 0;
            padding: 0 8px;
            font-size: 14px;
            line-height: 20px;
            cursor: pointer;
            transition: background 0.2s;
            vertical-align: middle;
        `;
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = '#0b0080';
            copyBtn.style.borderColor = '#0b0080';
        });
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = '#0645ad';
            copyBtn.style.borderColor = '#0645ad';
        });
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyToClipboard(title);
        });

        container.appendChild(titleLink);
        container.appendChild(copyBtn);

        return container;
    }

    // 创建主面板
    function createLanguagePanel() {
        const languageLinks = getLanguageLinks();
        const displayLanguages = getDisplayLanguages();
        const currentLang = getCurrentLanguage();

        // 检查是否有可显示的语言
        const hasLinks = displayLanguages.some(lang => lang !== currentLang && languageLinks[lang]);
        if (!hasLinks) {
            return null;
        }

        const panel = document.createElement('div');
        panel.id = 'wiki-multi-lang-panel';
        panel.style.cssText = `
            margin: 8px 0;
            padding: 0;
            line-height: 1.6;
        `;

        // 直接添加语言项，不需要容器
        displayLanguages.forEach(langCode => {
            if (langCode !== currentLang && languageLinks[langCode]) {
                const item = createLanguageItem(
                    langCode,
                    languageLinks[langCode].title,
                    languageLinks[langCode].url
                );
                panel.appendChild(item);
            }
        });

        return panel;
    }

    // 插入面板到页面
    let insertTimeout = null;
    function insertPanel() {
        // 清除之前的定时器，防止重复执行
        if (insertTimeout) {
            clearTimeout(insertTimeout);
        }

        insertTimeout = setTimeout(() => {
            // 检查是否已经存在面板
            if (document.getElementById('wiki-multi-lang-panel')) {
                return; // 面板已存在，不需要重新插入
            }

            const panel = createLanguagePanel();
            if (!panel) {
                return;
            }

            // 找到词条标题
            const heading = document.querySelector('#firstHeading') || document.querySelector('.mw-page-title-main');
            if (heading && heading.parentElement) {
                // 检查面板是否已经在正确位置
                const existingPanel = heading.parentElement.querySelector('#wiki-multi-lang-panel');
                if (!existingPanel) {
                    // 插入到标题之后（不是之前）
                    if (heading.nextSibling) {
                        heading.parentElement.insertBefore(panel, heading.nextSibling);
                    } else {
                        heading.parentElement.appendChild(panel);
                    }
                }
            }
        }, 100); // 100ms 防抖延迟
    }

    // 添加样式动画
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 配置语言对话框
    function showLanguageConfig() {
        const currentSettings = getDisplayLanguages();
        const allLanguages = Object.keys(LANGUAGE_NAMES);

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 650px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        const titleDiv = document.createElement('h3');
        titleDiv.textContent = '选择要显示的语言';
        titleDiv.style.cssText = 'margin-top: 0; margin-bottom: 15px;';

        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.cssText = `
            margin-bottom: 15px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px 12px;
        `;

        allLanguages.forEach(langCode => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex;
                align-items: center;
                cursor: pointer;
                white-space: nowrap;
            `;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = langCode;
            checkbox.checked = currentSettings.includes(langCode);
            checkbox.style.cssText = 'margin-right: 6px; cursor: pointer;';

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(`${LANGUAGE_NAMES[langCode]} (${langCode})`));
            checkboxContainer.appendChild(label);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px;';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
            padding: 8px 16px;
            background: #0645ad;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveBtn.addEventListener('click', () => {
            const selected = Array.from(checkboxContainer.querySelectorAll('input:checked'))
                .map(cb => cb.value);
            setDisplayLanguages(selected);
            document.body.removeChild(overlay);
            insertPanel();
            showNotification('语言设置已保存');
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            padding: 8px 16px;
            background: #72777d;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(saveBtn);

        dialog.appendChild(titleDiv);
        dialog.appendChild(checkboxContainer);
        dialog.appendChild(buttonContainer);

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        `;
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    // 注册菜单命令
    GM_registerMenuCommand('配置显示语言', showLanguageConfig);
    GM_registerMenuCommand('刷新多语言面板', insertPanel);

    // 初始化
    function init() {
        // 只在词条页面运行（排除特殊页面）
        if (window.location.pathname.startsWith('/wiki/Special:') ||
            window.location.pathname.startsWith('/wiki/特殊:') ||
            window.location.pathname === '/wiki/') {
            return;
        }

        addStyles();

        // 等待页面加载完成后插入面板
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(insertPanel, 500); // 延迟执行，确保页面完全加载
            });
        } else {
            setTimeout(insertPanel, 500);
        }

        // 监听URL变化（用于处理维基百科的单页导航）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                // URL变化时重新插入面板
                setTimeout(() => {
                    const oldPanel = document.getElementById('wiki-multi-lang-panel');
                    if (oldPanel) {
                        oldPanel.remove();
                    }
                    insertPanel();
                }, 500);
            }
        }).observe(document.querySelector('title'), {
            childList: true,
            subtree: true
        });
    }

    init();
})();

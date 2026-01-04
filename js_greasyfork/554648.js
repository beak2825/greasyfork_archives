// ==UserScript==
// @name         Gemini Start Menu
// @namespace    https://greasyfork.org
// @version      1.0.1
// @description  Gemini Logo Replacement with Dropdown
// @description.zh-CN  将 Gemini 界面左上角的 Logo 替换为一个自定义的下拉菜单。
// @author       Wesley King
// @match        *://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554648/Gemini%20Start%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/554648/Gemini%20Start%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定位器：精确定位 "Gemini" 文本所在的元素
    const LOGO_SELECTOR = '[data-test-id="bard-text"]';

    // 2. 自定义下拉菜单的选项配置
    const menuOptions = [
        { label: '🇺🇸 🖼️📄Google AI Std', url: 'https://aistudio.google.com/prompts/new_chat' },
        { label: '🇺🇸 🖼️📄ChatGPT', url: 'https://chatgpt.com/' },
        { label: '🇺🇸 🖼️📄MS Copilot', url: 'https://copilot.microsoft.com/' },
        { label: '🇺🇸 🖼️📄Grok', url: 'https://x.com/i/grok/' },
        { label: '🇨🇳 📄Deepseek', url: 'https://chat.deepseek.com/' },
        { label: '🇨🇳 📄Kimi', url: 'https://www.kimi.com/' },
        { label: '🇨🇳 🖼️📄Qwen(WW)', url: 'https://chat.qwen.ai/' },
        { label: '🇨🇳 🖼️📄Qwen(CN)', url: 'https://www.tongyi.com/qianwen/' },
        { label: '🇨🇳 📽️🖼️📄Doubao AI', url: 'https://www.doubao.com' },
        { label: '🇨🇳 📽️🖼️Hailuo AI(WW)', url: 'https://hailuoai.video/' },
        { label: '🇨🇳 📽️🖼️Hailuo AI(CN)', url: 'https://hailuoai.com/' },
        { label: '🇨🇳 📽️🖼️Jimeng AI', url: 'https://jimeng.jianying.com/ai-tool/home' },
        { label: '🇨🇳 📽️🖼️Kaipai AI', url: 'https://www.kaipai.com/home' }
    ];

    /**
     * 创建自定义下拉菜单的HTML元素
     * @returns {HTMLElement} 下拉菜单的DOM元素
     */
    function createCustomDropdown() {
        const select = document.createElement('select');
        select.id = 'custom-gemini-menu';

        // 基础样式：确保它融入原界面
        select.style.padding = '0 8px';
        select.style.cursor = 'pointer';
        select.style.border = 'none';

        // 关键主题自适应：背景透明以继承父元素颜色
        select.style.backgroundColor = 'transparent';

        // 关键主题自适应：使用 Gemini 界面的文本颜色变量
        // 这个变量会随着主题切换而改变其对应的值
        select.style.color = 'var(--gm-fill-color-dark-on-surface)';

        select.style.fontWeight = 'bold';
        select.style.height = '100%';
        select.style.appearance = 'none';
        select.style.direction = 'rtl';

        // 字体要求
        select.style.fontSize = '20px';
        select.style.fontFamily = 'Google Sans Flex, Google Sans, Helvetica Neue, sans-serif';

        // 定义用于下拉菜单选项的颜色变量（这些变量会随着主题切换）
        const optionTextColor = 'var(--gm-fill-color-dark-on-surface)';
        const optionBackgroundColor = 'var(--gm-surface-background-color)';

        // 辅助函数：创建选项元素并应用主题样式
        const createOption = (label, value, isDefault = false) => {
            const option = document.createElement('option');
            option.textContent = label;
            option.value = value;
            if (isDefault) {
                option.disabled = true;
                option.selected = true;
            }

            // 为选项设置适应主题的背景和文字颜色
            option.style.backgroundColor = optionBackgroundColor;
            option.style.color = optionTextColor;

            // 选项字体样式（通常略小）
            option.style.fontSize = '16px';
            option.style.fontFamily = 'Google Sans Flex, Google Sans, Helvetica Neue, sans-serif';

            return option;
        };

        // 添加默认选项（不跳转，只作标题）
        select.appendChild(createOption('Gemini', '#', true));

        // 添加配置的选项
        menuOptions.forEach(config => {
            select.appendChild(createOption(config.label, config.url));
        });

        // 监听下拉菜单的改变事件
        select.addEventListener('change', (event) => {
            const selectedUrl = event.target.value;
            if (selectedUrl && selectedUrl !== '#') {
                window.open(selectedUrl, '_blank');
                event.target.value = '#'; // 重置选择
            }
        });

        return select;
    }

    /**
     * 查找并替换Logo元素
     */
    function replaceLogoWithDropdown() {
        const logoElement = document.querySelector(LOGO_SELECTOR);

        if (logoElement) {
            console.log("找到Gemini文本元素，开始替换...");
            const dropdown = createCustomDropdown();

            // 清空原有 "Gemini" 文本
            logoElement.innerHTML = '';

            // 插入自定义下拉菜单
            logoElement.appendChild(dropdown);

        } else {
            console.warn("未找到Gemini文本元素，请检查选择器是否正确：", LOGO_SELECTOR);
        }
    }

    // 使用 MutationObserver 来确保元素加载后立即执行替换
    const observer = new MutationObserver((mutationsList, observer) => {
        const logoElement = document.querySelector(LOGO_SELECTOR);
        if (logoElement) {
            observer.disconnect();
            replaceLogoWithDropdown();
        }
    });

    // 开始观察整个文档的子元素变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 增加一个安全网
    if (document.querySelector(LOGO_SELECTOR)) {
        replaceLogoWithDropdown();
    }
})();
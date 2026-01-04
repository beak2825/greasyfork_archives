// ==UserScript==
// @name        e621 搜索框增强
// @namespace   Lecrp.com
// @version     2.5
// @description 在搜索框添加自定义功能按钮
// @author      jcjyids
// @match       https://e621.net/posts*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @license     GPL-3.0-or-later
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/554548/e621%20%E6%90%9C%E7%B4%A2%E6%A1%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554548/e621%20%E6%90%9C%E7%B4%A2%E6%A1%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设备能力检测
    function getDeviceCapabilities() {
        return {
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            isMobile: window.innerWidth < 768,
            hasKeyboard: !('ontouchstart' in window) || window.innerWidth > 1024
        };
    }

    // 标签切换核心功能
    function toggleSearchTerm(term, searchInput) {
        const currentText = searchInput.value.trim();
        let terms = currentText ? currentText.split(/\s+/) : [];

        // 检查是否存在匹配的术语（忽略操作符）
        const matchingIndex = terms.findIndex(unit => {
            const content = unit.replace(/^[-~]/, '');
            return content === term;
        });

        // 执行切换操作
        if (matchingIndex !== -1) {
            // 删除所有匹配的术语
            terms = terms.filter(unit => {
                const content = unit.replace(/^[-~]/, '');
                return content !== term;
            });
        } else {
            // 添加基础术语
            terms.push(term);
        }

        // 重新组合并设置
        searchInput.value = terms.join(' ').trim();

        // 触发输入事件以确保网站搜索逻辑响应
        //searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        //searchInput.focus();
    }

    // 初始化函数
    function initSearchButtons() {
        const searchInput = document.querySelector('#tags');

        if (!searchInput) {
            // 如果搜索框不存在，稍后重试
            setTimeout(initSearchButtons, 500);
            return;
        }

        // 检查按钮容器是否已存在
        if (document.getElementById('st-buttons-container')) {
            return;
        }

        // 获取目标容器
        const caps = getDeviceCapabilities();
        const container = caps.isMobile
        ? document.querySelector('.post-search-form')
        : document.querySelector('.search-controls');

        if (!container) {
            console.log('未找到目标容器');
            return;
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'st-buttons-container';

        // 按钮配置数组 - 可以方便地添加新按钮
        const buttonConfigs = [
            {
                id: 'search-add-donghua',
                title: '动画',
                icon: 'play_circle',
                term: 'animated'
            },
            {
                id: 'search-add-fenshu',
                title: '按分数排序',
                icon: 'arrow_up_dash',
                term: 'order:score'
            },
            {
                id: 'search-add-shoucang',
                title: '按收藏排序',
                icon: 'star',
                term: 'order:favcount'
            },
            // 可以在这里添加更多按钮
            // {
            //     id: 'search-add-custom',
            //     title: '自定义标签',
            //     icon: 'tag',
            //     term: 'your_tag_here'
            // }
        ];

        // 创建所有按钮并添加到按钮容器
        buttonConfigs.forEach(config => {
            createSearchButton(buttonContainer, searchInput, config, caps.isMobile);
        });

        //根据设备设置容器样式
        if (caps.isMobile) {
            Object.assign(buttonContainer.style, {
                display: 'flex',
                gap: '.2rem'
            });
        } else {
            Object.assign(buttonContainer.style, {
                display: 'flex',
                gap: '.5rem'
            });
        }

        // 将按钮容器添加到目标容器
        if (caps.isMobile) {
            container.appendChild(buttonContainer);
        } else {
            container.prepend(buttonContainer);
        }
    }

    /**
     * 创建搜索按钮
     */
    function createSearchButton(buttonContainer, searchInput, config, isMobile) {
        // 检查按钮是否已存在
        if (document.getElementById(config.id)) {
            return;
        }

        const button = document.createElement('button');
        button.id = config.id;
        button.className = 'st-button';
        button.title = config.title;
        button.innerHTML = getButtonIcon(config.icon);

        // 只在移动端应用指定样式
        if (isMobile) {
            applyMobileStyles(button);
        }

        // 添加点击事件 - 使用切换模式
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSearchTerm(config.term, searchInput);
        });

        // 添加到按钮容器
        buttonContainer.appendChild(button);
    }

    /**
     * 应用移动端样式 - 只覆盖指定的样式
     */
    function applyMobileStyles(button) {
        // 按钮样式
        button.style.setProperty('padding', '0', 'important');
        button.style.setProperty('background', 'var(--color-section-lighten-5)', 'important');

        // SVG图标样式
        const svg = button.querySelector('svg');
        if (svg) {
            svg.style.setProperty('margin', 'auto', 'important');
        }

        // 容器样式
        const container = document.querySelector('.post-search-form');
        if (container) {
            container.style.gap = '0.2rem';
        }
    }

    /**
     * 按钮图标SVG
     */
    function getButtonIcon(iconName) {
        const icons = {
            arrow_up_dash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" name="arrow_up_dash"><path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"></path><path d="M9 20h6"></path></svg>`,
            star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" name="star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`,
            play_circle:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" name="play_circle"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`
        };

        return icons[iconName] || icons.thumbs_up;
    }

    // 改进的初始化时机
    function initialize() {
        // 尝试立即初始化
        initSearchButtons();

        // 同时监听DOMContentLoaded和load事件，确保覆盖各种情况
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSearchButtons);
        }
        window.addEventListener('load', initSearchButtons);
    }

    // 启动脚本
    initialize();
})();
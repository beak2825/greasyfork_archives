// ==UserScript==
// @name         App Store 网页版 地区切换器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 App Store 网页版丨可拖动悬浮按钮和菜单丨热门地区丨全球地区按分类展示
// @match        https://apps.apple.com/*/iphone/*
// @match        https://apps.apple.com/*/app/*
// @icon         https://www.apple.com/v/app-store/icons/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554929/App%20Store%20%E7%BD%91%E9%A1%B5%E7%89%88%20%E5%9C%B0%E5%8C%BA%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554929/App%20Store%20%E7%BD%91%E9%A1%B5%E7%89%88%20%E5%9C%B0%E5%8C%BA%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 所有地区配置（优化后：移除无效地区+修正分类+补充高频地区）
    const allRegions = [
        // 热门地区（置顶显示）
        { code: 'cn', name: '🇨🇳 中国大陆', lang: 'zh-CN', hot: true, region: 'eastAsia' },
        { code: 'hk', name: '🇭🇰 中国香港', lang: 'zh-HK', hot: true, region: 'eastAsia' },
        { code: 'tw', name: '🇨🇳 中国台湾', lang: 'zh-TW', hot: true, region: 'eastAsia' },
        { code: 'mo', name: '🇲🇴 中国澳门', lang: 'zh-MO', hot: true, region: 'eastAsia' },
        { code: 'us', name: '🇺🇸 美国', lang: 'en', hot: true, region: 'northAmerica' },
        { code: 'ru', name: '🇷🇺 俄罗斯', lang: 'ru', hot: true, region: 'europe' },

        // 东亚地区（中国、日本、韩国、朝鲜、蒙古）
        { code: 'jp', name: '🇯🇵 日本', lang: 'ja', hot: false, region: 'eastAsia' },
        { code: 'kr', name: '🇰🇷 韩国', lang: 'ko', hot: false, region: 'eastAsia' },

        // 东南亚地区（东盟10国+东帝汶等）
        { code: 'sg', name: '🇸🇬 新加坡', lang: 'en', hot: false, region: 'southeastAsia' },
        { code: 'my', name: '🇲🇾 马来西亚', lang: 'en', hot: false, region: 'southeastAsia' },
        { code: 'th', name: '🇹🇭 泰国', lang: 'th', hot: false, region: 'southeastAsia' },
        { code: 'id', name: '🇮🇩 印度尼西亚', lang: 'id', hot: false, region: 'southeastAsia' },
        { code: 'ph', name: '🇵🇭 菲律宾', lang: 'en', hot: false, region: 'southeastAsia' },
        { code: 'vn', name: '🇻🇳 越南', lang: 'vi', hot: false, region: 'southeastAsia' },
        { code: 'kh', name: '🇰🇭 柬埔寨', lang: 'km', hot: false, region: 'southeastAsia' },
        { code: 'la', name: '🇱🇦 老挝', lang: 'lo', hot: false, region: 'southeastAsia' },
        { code: 'mm', name: '🇲🇲 缅甸', lang: 'my', hot: false, region: 'southeastAsia' },
        { code: 'bn', name: '🇧🇳 文莱', lang: 'ms', hot: false, region: 'southeastAsia' },

        // 南亚地区（印度、巴基斯坦、孟加拉等）
        { code: 'in', name: '🇮🇳 印度', lang: 'en', hot: false, region: 'southAsia' },
        { code: 'pk', name: '🇵🇰 巴基斯坦', lang: 'en', hot: false, region: 'southAsia' },
        { code: 'bd', name: '🇧🇩 孟加拉国', lang: 'bn', hot: false, region: 'southAsia' },
        { code: 'lk', name: '🇱🇰 斯里兰卡', lang: 'si', hot: false, region: 'southAsia' },
        { code: 'np', name: '🇳🇵 尼泊尔', lang: 'ne', hot: false, region: 'southAsia' },
        { code: 'af', name: '🇦🇫 阿富汗', lang: 'ps', hot: false, region: 'southAsia' },

        // 欧洲地区（全欧洲国家）
        { code: 'gb', name: '🇬🇧 英国', lang: 'en', hot: false, region: 'europe' },
        { code: 'de', name: '🇩🇪 德国', lang: 'de', hot: false, region: 'europe' },
        { code: 'fr', name: '🇫🇷 法国', lang: 'fr', hot: false, region: 'europe' },
        { code: 'es', name: '🇪🇸 西班牙', lang: 'es', hot: false, region: 'europe' },
        { code: 'it', name: '🇮🇹 意大利', lang: 'it', hot: false, region: 'europe' },
        { code: 'nl', name: '🇳🇱 荷兰', lang: 'nl', hot: false, region: 'europe' },
        { code: 'be', name: '🇧🇪 比利时', lang: 'nl', hot: false, region: 'europe' },
        { code: 'ch', name: '🇨🇭 瑞士', lang: 'de', hot: false, region: 'europe' },
        { code: 'at', name: '🇦🇹 奥地利', lang: 'de', hot: false, region: 'europe' },
        { code: 'se', name: '🇸🇪 瑞典', lang: 'sv', hot: false, region: 'europe' },
        { code: 'no', name: '🇳🇴 挪威', lang: 'no', hot: false, region: 'europe' },
        { code: 'dk', name: '🇩🇰 丹麦', lang: 'da', hot: false, region: 'europe' },
        { code: 'fi', name: '🇫🇮 芬兰', lang: 'fi', hot: false, region: 'europe' },
        { code: 'pl', name: '🇵🇱 波兰', lang: 'pl', hot: false, region: 'europe' },
        { code: 'cz', name: '🇨🇿 捷克', lang: 'cs', hot: false, region: 'europe' },
        { code: 'ie', name: '🇮🇪 爱尔兰', lang: 'en', hot: false, region: 'europe' },
        { code: 'pt', name: '🇵🇹 葡萄牙', lang: 'pt', hot: false, region: 'europe' },
        { code: 'gr', name: '🇬🇷 希腊', lang: 'el', hot: false, region: 'europe' },
        { code: 'ro', name: '🇷🇴 罗马尼亚', lang: 'ro', hot: false, region: 'europe' },
        { code: 'hu', name: '🇭🇺 匈牙利', lang: 'hu', hot: false, region: 'europe' },
        { code: 'bg', name: '🇧🇬 保加利亚', lang: 'bg', hot: false, region: 'europe' },
        { code: 'ua', name: '🇺🇦 乌克兰', lang: 'uk', hot: false, region: 'europe' },
        { code: 'by', name: '🇧🇾 白俄罗斯', lang: 'ru', hot: false, region: 'europe' },
        { code: 'mc', name: '🇲🇨 摩纳哥', lang: 'fr', hot: false, region: 'europe' }, // 补充
        { code: 'ad', name: '🇦🇩 安道尔', lang: 'ca', hot: false, region: 'europe' }, // 补充
        { code: 'mt', name: '🇲🇹 马耳他', lang: 'en', hot: false, region: 'europe' }, // 修正分类

        // 北美洲地区（美国、加拿大、墨西哥+加勒比海）
        { code: 'ca', name: '🇨🇦 加拿大', lang: 'en', hot: false, region: 'northAmerica' },
        { code: 'mx', name: '🇲🇽 墨西哥', lang: 'es', hot: false, region: 'northAmerica' },
        { code: 'cu', name: '🇨🇺 古巴', lang: 'es', hot: false, region: 'northAmerica' },
        { code: 'jm', name: '🇯🇲 牙买加', lang: 'en', hot: false, region: 'northAmerica' },
        { code: 'cr', name: '🇨🇷 哥斯达黎加', lang: 'es', hot: false, region: 'northAmerica' }, // 补充
        { code: 'pr', name: '🇵🇷 波多黎各', lang: 'es', hot: false, region: 'northAmerica' }, // 补充

        // 南美洲地区（南美12国+圭亚那等）
        { code: 'br', name: '🇧🇷 巴西', lang: 'pt-BR', hot: false, region: 'southAmerica' },
        { code: 'ar', name: '🇦🇷 阿根廷', lang: 'es', hot: false, region: 'southAmerica' },
        { code: 'cl', name: '🇨🇱 智利', lang: 'es', hot: false, region: 'southAmerica' },
        { code: 'co', name: '🇨🇴 哥伦比亚', lang: 'es', hot: false, region: 'southAmerica' },
        { code: 'pe', name: '🇵🇪 秘鲁', lang: 'es', hot: false, region: 'southAmerica' },
        { code: 've', name: '🇻🇪 委内瑞拉', lang: 'es', hot: false, region: 'southAmerica' },
        { code: 'gy', name: '🇬🇾 圭亚那', lang: 'en', hot: false, region: 'southAmerica' },
        { code: 'sr', name: '🇸🇷 苏里南', lang: 'nl', hot: false, region: 'southAmerica' },

        // 中东及中亚地区（中东+中亚5国）
        { code: 'tr', name: '🇹🇷 土耳其', lang: 'tr', hot: false, region: 'middleEastCentralAsia' },
        { code: 'sa', name: '🇸🇦 沙特阿拉伯', lang: 'ar', hot: false, region: 'middleEastCentralAsia' },
        { code: 'ae', name: '🇦🇪 阿联酋', lang: 'ar', hot: false, region: 'middleEastCentralAsia' },
        { code: 'il', name: '🇮🇱 以色列', lang: 'he', hot: false, region: 'middleEastCentralAsia' },
        { code: 'kw', name: '🇰🇼 科威特', lang: 'ar', hot: false, region: 'middleEastCentralAsia' },
        { code: 'kz', name: '🇰🇿 哈萨克斯坦', lang: 'ru', hot: false, region: 'middleEastCentralAsia' },
        { code: 'uz', name: '🇺🇿 乌兹别克斯坦', lang: 'uz', hot: false, region: 'middleEastCentralAsia' },
        { code: 'kg', name: '🇰🇬 吉尔吉斯斯坦', lang: 'ky', hot: false, region: 'middleEastCentralAsia' },
        { code: 'tj', name: '🇹🇯 塔吉克斯坦', lang: 'tg', hot: false, region: 'middleEastCentralAsia' },

        // 非洲地区（全非洲国家及地区）
        { code: 'za', name: '🇿🇦 南非', lang: 'en', hot: false, region: 'africa' },
        { code: 'eg', name: '🇪🇬 埃及', lang: 'ar', hot: false, region: 'africa' },
        { code: 'ng', name: '🇳🇬 尼日利亚', lang: 'en', hot: false, region: 'africa' },
        { code: 'ke', name: '🇰🇪 肯尼亚', lang: 'en', hot: false, region: 'africa' },
        { code: 'ma', name: '🇲🇦 摩洛哥', lang: 'ar', hot: false, region: 'africa' }, // 补充
        { code: 'gh', name: '🇬🇭 加纳', lang: 'en', hot: false, region: 'africa' }, // 补充

        // 大洋洲地区（澳大利亚、新西兰+太平洋岛国）
        { code: 'au', name: '🇦🇺 澳大利亚', lang: 'en', hot: false, region: 'oceania' },
        { code: 'nz', name: '🇳🇿 新西兰', lang: 'en', hot: false, region: 'oceania' },
        { code: 'fj', name: '🇫🇯 斐济', lang: 'fj', hot: false, region: 'oceania' },
        { code: 'pg', name: '🇵🇬 巴布亚新几内亚', lang: 'en', hot: false, region: 'oceania' }
    ];

    // 区域配置（名称+图标+排序权重）
    const regionConfig = {
        hot: { name: '热门地区', icon: '🔥', order: 1 },
        eastAsia: { name: '东亚地区', icon: '🏯', order: 2 },
        southeastAsia: { name: '东南亚地区', icon: '🌴', order: 3 },
        southAsia: { name: '南亚地区', icon: '🐘', order: 4 },
        europe: { name: '欧洲地区', icon: '🗼', order: 5 },
        northAmerica: { name: '北美洲地区', icon: '🦅', order: 6 },
        southAmerica: { name: '南美洲地区', icon: '🌎', order: 7 },
        middleEastCentralAsia: { name: '中东及中亚地区', icon: '🕌', order: 8 },
        africa: { name: '非洲地区', icon: '🌍', order: 9 },
        oceania: { name: '大洋洲地区', icon: '🦘', order: 10 }
    };

    // 添加样式（含搜索框、高亮、响应式优化）
    const style = document.createElement('style');
    style.textContent = `
        /* 基础样式 */
        .region-switcher-btn {
            position: fixed;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            color: white;
            border: none;
            font-size: 24px;
            cursor: move;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            user-select: none;
        }

        .region-switcher-btn.light-mode {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .region-switcher-btn.dark-mode {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        /* 面板样式（优化动画） */
        .region-switcher-panel {
            position: fixed;
            width: 360px;
            max-height: 500px;
            border-radius: 16px;
            z-index: 9998;
            padding: 20px;
            overflow-y: auto;
            opacity: 0;
            transform: translateY(10px);
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .region-switcher-panel.light-mode { background: white; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); }
        .region-switcher-panel.dark-mode { background: #1a202c; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }
        .region-switcher-panel.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        /* 区域样式 */
        .region-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px dashed;
        }

        .region-section:last-child { margin-bottom: 5px; border-bottom: none; }

        .section-title {
            font-size: 16px;
            margin: 0 0 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .button-group { display: flex; flex-wrap: wrap; gap: 8px; }

        /* 地区按钮（增强反馈） */
        .region-btn {
            padding: 7px 12px;
            border: none;
            border-radius: 20px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .region-btn.hot {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            font-weight: 600;
        }

        .region-btn:not(.hot) {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .region-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .region-btn:active {
            transform: translateY(1px);
            box-shadow: none !important;
        }

        /* 主题适配 */
        .light-mode .region-section { border-color: #f0f0f0; }
        .dark-mode .region-section { border-color: #2d3748; }
        .light-mode .section-title { color: #4a5568; }
        .dark-mode .section-title { color: #cbd5e0; }

        /* 面板头部与搜索框 */
        .panel-header { margin-bottom: 15px; }
        .panel-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
            padding-bottom: 10px;
            border-bottom: 1px solid;
        }
        .current-region {
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
        }
        .region-search {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-top: 10px;
            font-size: 14px;
        }
        .dark-mode .region-search {
            background: #2d3748;
            border-color: #4a5568;
            color: white;
        }
        .dark-mode .region-search::placeholder { color: #9ca3af; }

        /* 关闭按钮 */
        .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
        }
        .light-mode .close-btn { color: #999; }
        .light-mode .close-btn:hover { color: #333; }
        .dark-mode .close-btn { color: #718096; }
        .dark-mode .close-btn:hover { color: #e2e8f0; }

        /* 响应式优化 */
        @media (max-width: 480px) {
            .region-switcher-panel {
                width: calc(100% - 40px);
                max-height: 70vh;
            }
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮按钮和面板
    const button = document.createElement('button');
    button.className = 'region-switcher-btn';
    button.innerHTML = '🌍';
    button.title = '切换地区（可拖动）';
    document.body.appendChild(button);

    const panel = document.createElement('div');
    panel.className = 'region-switcher-panel';
    panel.innerHTML = `<button class="close-btn">×</button>`;

    const panelHeader = document.createElement('div');
    panelHeader.className = 'panel-header';
    panelHeader.innerHTML = `
        <div class="panel-title">选择地区</div>
        <div class="current-region"></div>
        <input type="text" class="region-search" placeholder="搜索地区...">
    `;
    panel.appendChild(panelHeader);

    const regionsContainer = document.createElement('div');
    regionsContainer.className = 'regions-container';
    panel.appendChild(regionsContainer);
    document.body.appendChild(panel);

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;
    const STORAGE_KEY = 'regionSwitcherPos';

    function loadButtonPosition() {
        const savedPos = localStorage.getItem(STORAGE_KEY);
        if (savedPos) {
            const { x, y } = JSON.parse(savedPos);
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
        } else {
            button.style.right = '20px';
            button.style.bottom = '20px';
        }
    }

    function saveButtonPosition(x, y) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
    }

    button.addEventListener('mousedown', (e) => {
        if (e.target === button) {
            isDragging = true;
            button.classList.add('dragging');
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        const clampedX = Math.max(10, Math.min(viewportWidth - button.offsetWidth - 10, newX));
        const clampedY = Math.max(10, Math.min(viewportHeight - button.offsetHeight - 10, newY));
        button.style.left = `${clampedX}px`;
        button.style.top = `${clampedY}px`;
        button.style.right = 'auto';
        button.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            button.classList.remove('dragging');
            button.style.cursor = 'move';
            saveButtonPosition(parseInt(button.style.left), parseInt(button.style.top));
        }
    });

    // 触摸设备支持
    button.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true;
        button.classList.add('dragging');
        offsetX = touch.clientX - button.getBoundingClientRect().left;
        offsetY = touch.clientY - button.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const newX = touch.clientX - offsetX;
        const newY = touch.clientY - offsetY;
        const clampedX = Math.max(10, Math.min(window.innerWidth - button.offsetWidth - 10, newX));
        const clampedY = Math.max(10, Math.min(window.innerHeight - button.offsetHeight - 10, newY));
        button.style.left = `${clampedX}px`;
        button.style.top = `${clampedY}px`;
        e.preventDefault();
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            button.classList.remove('dragging');
            saveButtonPosition(parseInt(button.style.left), parseInt(button.style.top));
        }
    });

    // 面板自适应位置
    function adjustPanelPosition() {
        const btnRect = button.getBoundingClientRect();
        const panelWidth = 360;
        const panelHeight = 500;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        panel.style.left = panel.style.right = panel.style.top = panel.style.bottom = '';

        const canShowRight = btnRect.right + panelWidth <= viewportWidth;
        const canShowLeft = btnRect.left - panelWidth >= 0;
        const canShowAbove = btnRect.top - panelHeight >= 0;
        const canShowBelow = btnRect.bottom + panelHeight <= viewportHeight;

        if (canShowRight) panel.style.left = `${btnRect.right + 10}px`;
        else if (canShowLeft) panel.style.right = `${viewportWidth - btnRect.left + 10}px`;
        else panel.style.left = `${Math.max(10, btnRect.left + btnRect.width/2 - panelWidth/2)}px`;

        if (canShowAbove) panel.style.bottom = `${viewportHeight - btnRect.top + 10}px`;
        else if (canShowBelow) panel.style.top = `${btnRect.bottom + 10}px`;
        else panel.style.top = '20px';
    }

    // 深色模式适配
    function setupDarkMode() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                          document.documentElement.classList.contains('dark');

        if (isDarkMode) {
            button.classList.add('dark-mode');
            panel.classList.add('dark-mode');
        } else {
            button.classList.add('light-mode');
            panel.classList.add('light-mode');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                button.classList.replace('light-mode', 'dark-mode');
                panel.classList.replace('light-mode', 'dark-mode');
            } else {
                button.classList.replace('dark-mode', 'light-mode');
                panel.classList.replace('dark-mode', 'light-mode');
            }
        });
    }

    // 显示当前地区并高亮按钮
    function showCurrentRegion() {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/https:\/\/apps\.apple\.com\/([a-z]{2})\//);
        if (match && match[1]) {
            const regionCode = match[1];
            const region = allRegions.find(r => r.code === regionCode);
            panelHeader.querySelector('.current-region').textContent =
                region ? `当前: ${region.name}` : `当前地区: ${regionCode.toUpperCase()}`;

            // 高亮当前地区按钮
            document.querySelectorAll('.region-btn').forEach(btn => {
                const region = allRegions.find(r => r.name === btn.textContent);
                if (region && region.code === regionCode) {
                    btn.style.boxShadow = '0 0 0 2px #ff6b6b';
                    btn.style.transform = 'scale(1.05)';
                } else {
                    btn.style.boxShadow = 'none';
                    btn.style.transform = 'none';
                }
            });
        }
    }

    // 地区搜索功能
    function setupSearch() {
        const searchInput = panel.querySelector('.region-search');
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const allButtons = document.querySelectorAll('.region-btn');
            allButtons.forEach(btn => {
                const text = btn.textContent.toLowerCase();
                btn.style.display = text.includes(keyword) ? 'inline-block' : 'none';
            });
        });
    }

    // 按分区渲染面板
    function renderRegionSections() {
        regionsContainer.innerHTML = '';

        // 热门地区
        const hotRegions = allRegions.filter(r => r.hot);
        if (hotRegions.length > 0) {
            const hotSection = createRegionSection('hot', hotRegions);
            regionsContainer.appendChild(hotSection);
        }

        // 按地理区域分类（按order排序）
        Object.keys(regionConfig)
            .filter(key => key !== 'hot')
            .sort((a, b) => regionConfig[a].order - regionConfig[b].order)
            .forEach(regionKey => {
                const regionItems = allRegions.filter(r =>
                    r.region === regionKey && !r.hot
                );
                if (regionItems.length > 0) {
                    const section = createRegionSection(regionKey, regionItems);
                    regionsContainer.appendChild(section);
                }
            });
    }

    // 创建区域区块
    function createRegionSection(regionKey, regions) {
        const section = document.createElement('div');
        section.className = 'region-section';

        const title = document.createElement('div');
        title.className = 'section-title';
        title.innerHTML = `<span>${regionConfig[regionKey].icon}</span><span>${regionConfig[regionKey].name}</span>`;
        section.appendChild(title);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        regions.forEach(region => {
            const btn = document.createElement('button');
            btn.className = `region-btn${region.hot ? ' hot' : ''}`;
            btn.textContent = region.name;
            btn.onclick = () => goToRegion(region.code);
            buttonGroup.appendChild(btn);
        });
        section.appendChild(buttonGroup);

        return section;
    }

    // 跳转地区（增强兼容性+容错）
    const validCodes = allRegions.map(r => r.code); // 有效地区代码列表
    function goToRegion(regionCode) {
        if (!validCodes.includes(regionCode)) {
            alert(`暂不支持该地区（${regionCode}）的App Store访问`);
            return;
        }
        const currentUrl = window.location.href;
        // 兼容任意路径结构的URL替换
        const newUrl = currentUrl.replace(/(https:\/\/apps\.apple\.com\/)[a-z]{2}\//, `$1${regionCode}/`);
        window.location.href = newUrl;
    }

    // 切换面板显示/隐藏
    function togglePanel() {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            adjustPanelPosition();
            showCurrentRegion();
            // 清空搜索框
            panel.querySelector('.region-search').value = '';
            // 重置按钮显示
            document.querySelectorAll('.region-btn').forEach(btn => {
                btn.style.display = 'inline-block';
            });
        }
    }

    // 事件监听
    button.addEventListener('click', (e) => { if (!isDragging) togglePanel(); });
    panel.querySelector('.close-btn').addEventListener('click', togglePanel);
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== button && panel.classList.contains('active')) {
            togglePanel();
        }
    });
    window.addEventListener('resize', () => { if (panel.classList.contains('active')) adjustPanelPosition(); });

    // 初始化
    loadButtonPosition();
    renderRegionSections();
    setupDarkMode();
    setupSearch();
})();
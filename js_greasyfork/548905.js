// ==UserScript==
// @name         导航面板
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  多功能导航面板，支持侧边栏/顶栏/底栏显示，可自定义位置、颜色、搜索引擎。支持收藏管理、镜像站点数据共享、拖拽排序等功能。默认关闭，可在油猴菜单中为任意网站启用。
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548905/%E5%AF%BC%E8%88%AA%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/548905/%E5%AF%BC%E8%88%AA%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局启用/禁用设置
    const GLOBAL_ENABLE_KEY = 'navigation_panel_global_enable';
    const currentDomain = window.location.hostname;

    // 获取当前域名的启用状态(默认关闭)
    function isEnabledForCurrentSite() {
        const enabledSites = GM_getValue(GLOBAL_ENABLE_KEY, {});
        return enabledSites[currentDomain] === true;
    }

    // 设置当前域名的启用状态
    function setEnabledForCurrentSite(enabled) {
        const enabledSites = GM_getValue(GLOBAL_ENABLE_KEY, {});
        enabledSites[currentDomain] = enabled;
        GM_setValue(GLOBAL_ENABLE_KEY, enabledSites);
    }

    // 注册油猴菜单命令 - 单一动态菜单项
    // 尝试在所有窗口注册，但优先在顶层窗口
    const shouldRegisterMenu = window.self === window.top || !window.frameElement;

    if (shouldRegisterMenu) {
        try {
            const menuText = isEnabledForCurrentSite()
                ? '✅ 当前网站已启用 - 点击禁用'
                : '❌ 当前网站已禁用 - 点击启用';

            GM_registerMenuCommand(menuText, () => {
                const currentStatus = isEnabledForCurrentSite();
                setEnabledForCurrentSite(!currentStatus);
                if (currentStatus) {
                    alert('导航面板已在当前网站禁用,页面将刷新');
                } else {
                    alert('导航面板已在当前网站启用,页面将刷新');
                }
                window.top.location.reload();
            });
        } catch (e) {
            console.error('导航面板: 菜单注册失败', e);
        }

        // 如果当前网站已启用,检查是否有共享域名,添加镜像站切换菜单
        if (isEnabledForCurrentSite()) {
            // 获取当前平台的配置
            const currentPlatformKey = currentDomain.replace(/\./g, '_');
            const platformConfig = GM_getValue(`${currentPlatformKey}_config`, {});

            // 如果配置了共享域名且有多个域名
            if (platformConfig.sharedDomains && platformConfig.sharedDomains.length > 1) {
                // 为每个其他镜像站添加菜单项
                platformConfig.sharedDomains.forEach(domain => {
                    if (domain !== currentDomain) {
                        GM_registerMenuCommand(`🔄 切换到: ${domain}`, () => {
                            // 将当前URL的域名替换为目标域名
                            const currentUrl = window.location.href;
                            const newUrl = currentUrl.replace(currentDomain, domain);
                            window.location.href = newUrl;
                        });
                    }
                });
            }
        }
    }

    // 如果当前网站未启用,则不执行脚本
    const isEnabled = isEnabledForCurrentSite();
    if (!isEnabled) {
        return;
    }

    // 获取当前平台 - 所有网站一视同仁
    const currentHost = window.location.hostname;

    // 提取主域名(去除子域名,保留核心域名)
    // 例如: www.zhihu.com -> zhihu.com, zhuanlan.zhihu.com -> zhihu.com
    function getMainDomain(hostname) {
        const parts = hostname.split('.');
        if (parts.length <= 2) {
            return hostname;
        }
        return parts.slice(-2).join('.');
    }

    const mainDomain = getMainDomain(currentHost);
    const currentPlatform = mainDomain.replace(/\./g, '_'); // 使用主域名作为平台标识

    // 创建平台信息
    const platformInfo = {
        name: mainDomain,
        users: [],
        color: '#4a90e2' // 默认蓝色
    };

    // 构建 platformData（用于导出功能）
    const platformData = {
        [currentPlatform]: platformInfo
    };

    // 获取站点配置（需要先加载配置才能知道共享域名）
    const configKey = `${currentPlatform}_config`;
    const defaultConfig = {
        autoExpand: false,
        position: 'right', // 'left' | 'right' | 'top' | 'bottom'
        searchEngines: [],
        showTitle: true,
        gridColumns: 2,
        searchPosition: 'top',
        panelWidth: 300,
        topBarStyle: 'default', // 'default' | 'compact'
        topBarHeight: 60, // 顶栏/底栏高度（px）
        topBarWidth: 600, // 顶栏/底栏最大宽度（px）
        topBarOffset: 0, // 顶栏/底栏水平偏移量（%）：-80到80，负数左移，正数右移
        sideBarOffset: 0, // 侧边栏垂直偏移量（%）：-80到80，负数上移，正数下移
        openInCurrentTab: false, // 左键当前页打开，中键新页打开
        autoExpandContent: false, // 收藏内容默认展开
        topBarModulesOrder: ['search', 'favorites', 'buttons'], // 顶栏模块顺序
        primaryColor: platformData[currentPlatform].color, // 主题色
        customPanelName: '', // 自定义面板名称
        sharedDomains: [currentHost] // 共享数据的域名列表，默认只包含当前域名
    };
    const siteConfig = GM_getValue(configKey, defaultConfig);

    // 确保配置完整性
    if (siteConfig.showTitle === undefined) siteConfig.showTitle = true;
    if (!siteConfig.gridColumns) siteConfig.gridColumns = 2;
    if (!siteConfig.searchPosition) siteConfig.searchPosition = 'top';
    if (!siteConfig.panelWidth) siteConfig.panelWidth = 300;
    if (!siteConfig.topBarStyle) siteConfig.topBarStyle = 'default';
    if (siteConfig.topBarHeight === undefined || siteConfig.topBarHeight === null) siteConfig.topBarHeight = 60;
    if (!siteConfig.topBarWidth) siteConfig.topBarWidth = 900;
    if (siteConfig.topBarOffset === undefined) siteConfig.topBarOffset = 0;
    if (siteConfig.sideBarOffset === undefined) siteConfig.sideBarOffset = 0;
    if (siteConfig.openInCurrentTab === undefined) siteConfig.openInCurrentTab = false;
    if (siteConfig.autoExpandContent === undefined) siteConfig.autoExpandContent = false;
    if (!siteConfig.topBarModulesOrder) siteConfig.topBarModulesOrder = ['search', 'favorites', 'buttons'];
    if (!siteConfig.primaryColor) siteConfig.primaryColor = platformData[currentPlatform].color;
    if (siteConfig.customPanelName === undefined) siteConfig.customPanelName = '';
    if (!siteConfig.sharedDomains || !Array.isArray(siteConfig.sharedDomains)) siteConfig.sharedDomains = [currentHost];

    // 始终使用当前平台的独立存储键（不再使用共享键）
    const storageKey = `${currentPlatform}_users`;

    // 加载当前站点数据
    const platformUsers = GM_getValue(storageKey, platformData[currentPlatform].users);

    // URL转换函数：将镜像站点的URL转换为当前域名
    function convertUrlToCurrentDomain(url, sourceDomain) {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === sourceDomain) {
                urlObj.hostname = currentHost;
            }
            return urlObj.href;
        } catch (e) {
            return url;
        }
    }

    // 加载并合并所有镜像站点的数据
    function loadMirrorSitesData() {
        if (!siteConfig.sharedDomains || siteConfig.sharedDomains.length <= 1) {
            return platformUsers;
        }

        const allUsers = [...platformUsers];
        const seenUrls = new Set(platformUsers.map(u => u.url));

        // 遍历所有镜像站点
        siteConfig.sharedDomains.forEach(domain => {
            if (domain === currentHost) return; // 跳过当前站点

            const mirrorPlatform = domain.replace(/\./g, '_');
            const mirrorKey = `${mirrorPlatform}_users`;
            const mirrorUsers = GM_getValue(mirrorKey, []);

            // 合并镜像站点的数据，并转换URL
            mirrorUsers.forEach(user => {
                const convertedUrl = convertUrlToCurrentDomain(user.url, domain);
                if (!seenUrls.has(convertedUrl)) {
                    allUsers.push({
                        ...user,
                        url: convertedUrl,
                        _originalDomain: domain // 标记原始域名，用于调试
                    });
                    seenUrls.add(convertedUrl);
                }
            });
        });

        return allUsers;
    }

    // 使用合并后的数据用于显示
    const displayUsers = loadMirrorSitesData();


    function saveSiteConfig() { GM_setValue(configKey, siteConfig); }

    // 安全保存用户数据 - 先读取最新数据，避免多标签页冲突
    function saveUsers() {
        // 从存储中读取最新数据
        const latestUsers = GM_getValue(storageKey, []);

        // 合并本地更改（去重）
        const userMap = new Map();

        // 先添加最新的存储数据
        latestUsers.forEach(user => {
            const key = `${user.name}_${user.url}`;
            userMap.set(key, user);
        });

        // 再添加/更新本地数据
        platformUsers.forEach(user => {
            const key = `${user.name}_${user.url}`;
            userMap.set(key, user);
        });

        // 转换回数组并保存
        const mergedUsers = Array.from(userMap.values());
        GM_setValue(storageKey, mergedUsers);

        // 更新本地引用
        platformUsers.length = 0;
        platformUsers.push(...mergedUsers);
    }

    // 监听存储变化，实现跨标签页同步
    // 注意：由于频繁的自动同步可能导致面板消失，暂时禁用自动同步
    // 用户可以通过刷新页面来获取其他标签页的更新
    /*
    window.addEventListener('storage', (e) => {
        // GM_setValue 不会触发 storage 事件，所以我们需要定期检查
        // 这里我们使用一个更好的方法：监听 focus 事件
    });

    // 当标签页获得焦点时，重新加载数据
    let lastCheckTime = Date.now();
    window.addEventListener('focus', () => {
        // 避免频繁检查，至少间隔2秒
        const now = Date.now();
        if (now - lastCheckTime < 2000) return;
        lastCheckTime = now;

        const latestUsers = GM_getValue(storageKey, []);
        const latestConfig = GM_getValue(configKey, defaultConfig);

        // 检查是否有实质性变化（数量或内容）
        const usersChanged = latestUsers.length !== platformUsers.length ||
            JSON.stringify(latestUsers.map(u => u.url).sort()) !== JSON.stringify(platformUsers.map(u => u.url).sort());
        const configChanged = JSON.stringify(latestConfig.position) !== JSON.stringify(siteConfig.position) ||
            JSON.stringify(latestConfig.searchEngines) !== JSON.stringify(siteConfig.searchEngines);

        if (usersChanged || configChanged) {

            // 更新本地数据而不是刷新页面
            platformUsers.length = 0;
            platformUsers.push(...latestUsers);
            Object.assign(siteConfig, latestConfig);
            renderPanel();
        }
    });
    */

    // 导出数据
    function exportData() {
        const data = {
            version: '1.1',
            timestamp: new Date().toISOString(),
            globalEnableSettings: GM_getValue(GLOBAL_ENABLE_KEY, {}),
            platforms: {}
        };

        // 收集所有平台数据 - 动态从存储中获取
        const allKeys = GM_listValues();
        const platformKeys = new Set();

        // 找出所有平台的配置键
        allKeys.forEach(key => {
            if (key.endsWith('_config')) {
                const platform = key.replace('_config', '');
                platformKeys.add(platform);
            }
        });

        // 为每个平台收集数据
        platformKeys.forEach(platform => {
            const pConfigKey = `${platform}_config`;
            const config = GM_getValue(pConfigKey, {});

            // 确定存储键
            let pStorageKey;
            if (config.sharedDomains && config.sharedDomains.length > 1) {
                const sharedKey = [...config.sharedDomains].sort().join('_').replace(/\./g, '_');
                pStorageKey = `shared_${sharedKey}_users`;
            } else {
                pStorageKey = `${platform}_users`;
            }

            data.platforms[platform] = {
                users: GM_getValue(pStorageKey, []),
                config: config
            };
        });

        // 创建下载
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `navigation-panel-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('数据导出成功！包含所有站点的配置和启用状态。');
    }

    // 导入数据
    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    // 验证数据格式
                    if (!data.platforms) {
                        alert('无效的数据格式');
                        return;
                    }

                    // 询问是否覆盖
                    const overwrite = confirm('是否覆盖现有数据？\n确定=覆盖，取消=合并');

                    // 导入全局启用设置
                    if (data.globalEnableSettings) {
                        if (overwrite) {
                            GM_setValue(GLOBAL_ENABLE_KEY, data.globalEnableSettings);
                        } else {
                            // 合并全局启用设置
                            const existingSettings = GM_getValue(GLOBAL_ENABLE_KEY, {});
                            GM_setValue(GLOBAL_ENABLE_KEY, { ...existingSettings, ...data.globalEnableSettings });
                        }
                    }

                    // 导入平台数据
                    Object.keys(data.platforms).forEach(platform => {
                        if (!platformData[platform]) return;

                        const pStorageKey = platformData[platform].storageKey || `${platform}_users`;
                        const pConfigKey = `${platform}_config`;

                        if (overwrite) {
                            GM_setValue(pStorageKey, data.platforms[platform].users || []);
                            GM_setValue(pConfigKey, data.platforms[platform].config || {});
                        } else {
                            // 合并数据
                            const existingUsers = GM_getValue(pStorageKey, []);
                            const newUsers = data.platforms[platform].users || [];
                            GM_setValue(pStorageKey, [...existingUsers, ...newUsers]);

                            const existingConfig = GM_getValue(pConfigKey, {});
                            const newConfig = data.platforms[platform].config || {};
                            GM_setValue(pConfigKey, { ...existingConfig, ...newConfig });
                        }
                    });

                    alert('导入成功！已恢复所有站点的配置和启用状态。页面将刷新。');
                    location.reload();
                } catch (error) {
                    alert('导入失败：' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function convertUrlForCurrentSite(url) {
        const currentPlatformData = platformData[currentPlatform];
        if (!currentPlatformData.mirrorSite) return url;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === currentPlatformData.mirrorSite) {
                urlObj.hostname = window.location.hostname;
                return urlObj.href;
            }
            return url;
        } catch (e) { return url; }
    }

    function darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt, G = (num >> 8 & 0x00FF) - amt, B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
    }

    function lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R) * 0x10000 + (G > 255 ? 255 : G) * 0x100 + (B > 255 ? 255 : B)).toString(16).slice(1);
    }

    function generateColorPalette(baseColor) {
        return [baseColor, lightenColor(baseColor, 20), darkenColor(baseColor, 20), '#4a90e2', '#e74c3c'];
    }

    const primaryColor = siteConfig.primaryColor;
    const headerColor = lightenColor(primaryColor, 5);
    const buttonColor = darkenColor(primaryColor, 5);
    const actionButtonColor = lightenColor(primaryColor, 5);

    let draggedIndex = null;

    const container = document.createElement('div');
    container.id = 'multi-platform-panel';
    document.body.appendChild(container);

    const sideStyles = siteConfig.position === 'left' ? `
        #expand-button {
            position: fixed; left: 0; top: calc(50% + ${siteConfig.sideBarOffset}%); transform: translateY(-50%); z-index: 9999;
            width: 20px; height: 40px; background-color: ${headerColor}; color: white;
            display: flex; align-items: center; justify-content: center; border-radius: 0 5px 5px 0;
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease;
        }
        #panel-container {
            position: fixed; left: -${siteConfig.panelWidth + 20}px; top: calc(50% + ${siteConfig.sideBarOffset}%); transform: translateY(-50%); z-index: 10000;
            width: ${siteConfig.panelWidth}px; height: 85vh; background-color: rgba(255, 255, 255, 0.98);
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2); border-radius: 0 8px 8px 0;
            transition: left 0.3s ease; display: flex; flex-direction: column; overflow: hidden;
        }
        #panel-container.expanded { left: 0; }
    ` : `
        #expand-button {
            position: fixed; right: 0; top: calc(50% + ${siteConfig.sideBarOffset}%); transform: translateY(-50%); z-index: 9999;
            width: 20px; height: 40px; background-color: ${headerColor}; color: white;
            display: flex; align-items: center; justify-content: center; border-radius: 5px 0 0 5px;
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease;
        }
        #panel-container {
            position: fixed; right: -${siteConfig.panelWidth + 20}px; top: calc(50% + ${siteConfig.sideBarOffset}%); transform: translateY(-50%); z-index: 10000;
            width: ${siteConfig.panelWidth}px; background-color: rgba(255, 255, 255, 0.98); border-radius: 10px 0 0 10px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3); transition: right 0.3s ease; max-height: 85vh;
            overflow: hidden; display: flex; flex-direction: column;
        }
        #panel-container.expanded { right: 0; }
    `;

    const topStyles = `
        #expand-button {
            position: fixed; left: 50%; top: 0; transform: translateX(-50%); z-index: 9999;
            width: 60px; height: 20px; background-color: ${headerColor}; color: white;
            display: flex; align-items: center; justify-content: center; border-radius: 0 0 5px 5px;
            cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease; font-size: 12px;
        }

        #panel-container {
            position: fixed;
            left: 50%;
            top: 0;
            transform: translateX(-50%) translateY(-100%);
            z-index: 10000;
            display: flex;
            flex-direction: row;
            gap: 10px;
            padding: 0 10px;
            transition: transform 0.3s ease;
            pointer-events: none;
            overflow: visible;
        }
        #panel-container.expanded {
            transform: translateX(-50%) translateY(0);
        }

        .close-button-top {
            position: fixed;
            right: 10px;
            top: 5px;
            z-index: 10002;
            width: 24px;
            height: 24px;
            background: ${headerColor};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: auto;
        }
        #panel-container.expanded ~ .close-button-top {
            opacity: 1;
        }

        /* 隐藏标题栏 */
        .panel-header { display: none !important; }

        /* 单一容器：搜索框 + 收藏内容 + 按钮 */
        .favorites-buttons-container {
            flex: 0 0 auto;
            max-width: ${siteConfig.topBarWidth}px;
            height: ${siteConfig.topBarHeight}px;
            min-height: ${siteConfig.topBarHeight}px;
            max-height: ${siteConfig.topBarHeight}px;
            display: flex;
            flex-direction: row;
            gap: 4px;
            background-color: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border-radius: 0 0 8px 8px;
            pointer-events: auto;
            padding: 6px 20px;
            transform: translateX(${siteConfig.topBarOffset}%);
            flex-wrap: nowrap;
            align-items: center;
            margin: 0 20px;
            position: relative;
            overflow: visible;
        }

        /* 搜索框容器 */
        .search-engines-container {
            flex: 0 0 auto;
            width: 300px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: stretch;
            justify-content: center;
        }
        .search-engine-item {
            display: flex;
            gap: 4px;
            align-items: center;
            background: #f0f0f0;
            border-radius: 4px;
            padding: 3px 6px;
            white-space: nowrap;
        }
        .search-engine-item input {
            border: none;
            background: transparent;
            outline: none;
            flex: 1;
            min-width: 80px;
            font-size: 12px;
        }
        .search-engine-item button {
            background: ${primaryColor};
            color: white;
            border: none;
            border-radius: 3px;
            padding: 3px 6px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }
        .search-engine-item button:hover {
            background: ${darkenColor(primaryColor, 10)};
        }
        .search-engine-item.hidden {
            display: none;
        }

        /* 收藏内容区域 */
        #buttons-grid {
            flex: 1;
            min-width: 200px;
            min-height: ${siteConfig.topBarHeight - 8}px;
            display: flex !important;
            flex-direction: row !important;
            gap: 6px;
            overflow: hidden;
            align-items: center;
        }
        #buttons-grid.expanded {
            flex-wrap: wrap;
            overflow-y: auto;
            max-height: 80vh;
            justify-content: flex-start;
            align-content: flex-start;
        }
        /* 展开状态下的容器 */
        .favorites-buttons-container:has(#buttons-grid.expanded) {
            height: auto !important;
            max-height: none !important;
        }
        /* 展开状态下的按钮宽度优化 */
        #buttons-grid.expanded .button-wrapper {
            flex: 1 1 auto;
            min-width: 84px;
            max-width: 200px;
        }
        #buttons-grid.expanded .button-wrapper[data-size="2x"] {
            min-width: 175px;
            max-width: 300px;
        }
        #buttons-grid.expanded .button-wrapper[data-size="3x"] {
            min-width: 266px;
            max-width: 400px;
        }

        .button-wrapper {
            flex: 0 0 auto;
            width: 84px;
            height: auto;
        }
        .button-wrapper[data-size="2x"] { width: 175px; }
        .button-wrapper[data-size="3x"] { width: 266px; }
        .user-button {
            width: 100%;
            height: auto;
            font-size: 12px;
            padding: 6px 4px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
        }

        /* 按钮容器 - 在收藏内容右侧 */
        .button-container {
            flex: 0 0 auto;
            width: 42px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* 顶栏/底栏模式专用按钮容器 */
        .topbar-buttons-container {
            flex: 0 0 auto;
            width: auto;
            display: flex;
            flex-direction: row;
            gap: 6px;
            align-items: center;
            justify-content: center;
        }

        .action-button {
            width: 30px !important;
            height: 30px !important;
            min-width: 30px !important;
            border-radius: 50% !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            flex-shrink: 0 !important;
            transition: opacity 0.3s, transform 0.3s;
        }

        /* 未展开时隐藏其他按钮 */
        .button-container .action-button.hidden {
            display: none !important;
        }

        /* 临时关闭按钮 - 顶栏版本(右下角,面板内部) */
        .temp-close-btn {
            position: absolute;
            right: 4px;
            bottom: 2px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: 1px solid white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s, background 0.3s;
            z-index: 100;
            pointer-events: none;
        }
        #panel-container:hover .temp-close-btn {
            opacity: 1;
            pointer-events: auto;
        }
        .temp-close-btn:hover {
            background: rgba(0, 0, 0, 0.8);
        }

        #panel-container.content-expanded .favorites-buttons-container {
            max-height: 80vh;
            overflow-y: auto;
        }
    `;

    const bottomStyles = `
        #expand-button {
            position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); z-index: 9999;
            width: 60px; height: 20px; background-color: ${headerColor}; color: white;
            display: flex; align-items: center; justify-content: center; border-radius: 5px 5px 0 0;
            cursor: pointer; box-shadow: 0 -2px 5px rgba(0,0,0,0.2); transition: all 0.3s ease; font-size: 12px;
        }

        #panel-container {
            position: fixed;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%) translateY(100%);
            z-index: 10000;
            display: flex;
            flex-direction: row;
            gap: 10px;
            padding: 0 10px;
            transition: transform 0.3s ease;
            pointer-events: none;
            overflow: visible;
        }
        #panel-container.expanded {
            transform: translateX(-50%) translateY(0);
        }

        .close-button-top {
            position: fixed;
            right: 10px;
            bottom: 5px;
            z-index: 10002;
            width: 24px;
            height: 24px;
            background: ${headerColor};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: auto;
        }
        #panel-container.expanded ~ .close-button-top {
            opacity: 1;
        }

        /* 隐藏标题栏 */
        .panel-header { display: none !important; }

        /* 单一容器：搜索框 + 收藏内容 + 按钮 */
        .favorites-buttons-container {
            flex: 0 0 auto;
            max-width: ${siteConfig.topBarWidth}px;
            height: ${siteConfig.topBarHeight}px;
            min-height: ${siteConfig.topBarHeight}px;
            max-height: ${siteConfig.topBarHeight}px;
            display: flex;
            flex-direction: row;
            gap: 4px;
            background-color: rgba(255, 255, 255, 0.98);
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
            border-radius: 8px 8px 0 0;
            pointer-events: auto;
            padding: 6px 20px;
            transform: translateX(${siteConfig.topBarOffset}%);
            flex-wrap: nowrap;
            align-items: center;
            margin: 0 20px;
            position: relative;
            overflow: visible;
        }

        /* 搜索框容器 */
        .search-engines-container {
            flex: 0 0 auto;
            width: 300px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: stretch;
            justify-content: center;
        }
        .search-engine-item {
            display: flex;
            gap: 4px;
            align-items: center;
            background: #f0f0f0;
            border-radius: 4px;
            padding: 3px 6px;
            white-space: nowrap;
        }
        .search-engine-item input {
            border: none;
            background: transparent;
            outline: none;
            flex: 1;
            min-width: 80px;
            font-size: 12px;
        }
        .search-engine-item button {
            background: ${primaryColor};
            color: white;
            border: none;
            border-radius: 3px;
            padding: 3px 6px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s;
        }
        .search-engine-item button:hover {
            background: ${darkenColor(primaryColor, 10)};
        }
        .search-engine-item.hidden {
            display: none;
        }

        /* 收藏内容区域 */
        #buttons-grid {
            flex: 1;
            min-width: 200px;
            min-height: ${siteConfig.topBarHeight - 8}px;
            display: flex !important;
            flex-direction: row !important;
            gap: 6px;
            overflow: hidden;
            align-items: center;
        }
        #buttons-grid.expanded {
            flex-wrap: wrap;
            overflow-y: auto;
            max-height: 80vh;
            justify-content: flex-start;
            align-content: flex-start;
        }
        /* 展开状态下的容器 */
        .favorites-buttons-container:has(#buttons-grid.expanded) {
            height: auto !important;
            max-height: none !important;
        }
        /* 展开状态下的按钮宽度优化 */
        #buttons-grid.expanded .button-wrapper {
            flex: 1 1 auto;
            min-width: 84px;
            max-width: 200px;
        }
        #buttons-grid.expanded .button-wrapper[data-size="2x"] {
            min-width: 175px;
            max-width: 300px;
        }
        #buttons-grid.expanded .button-wrapper[data-size="3x"] {
            min-width: 266px;
            max-width: 400px;
        }

        .button-wrapper {
            flex: 0 0 auto;
            width: 84px;
            height: auto;
        }
        .button-wrapper[data-size="2x"] { width: 175px; }
        .button-wrapper[data-size="3x"] { width: 266px; }
        .user-button {
            width: 100%;
            height: auto;
            font-size: 12px;
            padding: 6px 4px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
        }

        /* 按钮容器 - 在收藏内容右侧 */
        .button-container {
            flex: 0 0 auto;
            width: 42px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* 顶栏/底栏模式专用按钮容器 */
        .topbar-buttons-container {
            flex: 0 0 auto;
            width: auto;
            display: flex;
            flex-direction: row;
            gap: 6px;
            align-items: center;
            justify-content: center;
        }

        .action-button {
            width: 30px !important;
            height: 30px !important;
            min-width: 30px !important;
            border-radius: 50% !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            flex-shrink: 0 !important;
            transition: opacity 0.3s, transform 0.3s;
        }

        /* 未展开时隐藏其他按钮 */
        .button-container .action-button.hidden {
            display: none !important;
        }

        /* 临时关闭按钮 - 底栏版本(右上角,面板内部) */
        .temp-close-btn {
            position: absolute;
            right: 4px;
            top: 2px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: 1px solid white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s, background 0.3s;
            z-index: 100;
            pointer-events: none;
        }
        #panel-container:hover .temp-close-btn {
            opacity: 1;
            pointer-events: auto;
        }
        .temp-close-btn:hover {
            background: rgba(0, 0, 0, 0.8);
        }

        #panel-container.content-expanded .favorites-buttons-container {
            max-height: 80vh;
            overflow-y: auto;
        }
    `;
    GM_addStyle(`
        #multi-platform-panel * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        #multi-platform-panel input, #multi-platform-panel textarea { color: #000 !important; }
        ${siteConfig.position === 'top' ? topStyles : siteConfig.position === 'bottom' ? bottomStyles : sideStyles}
        #expand-button:hover { background-color: ${darkenColor(headerColor, 10)}; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; background-color: ${headerColor}; color: white; flex-shrink: 0; }
        .panel-title { font-weight: bold; font-size: 14px; }
        .header-buttons { display: flex; gap: 10px; align-items: center; }
        .settings-button, .close-button { cursor: pointer; font-size: 18px; line-height: 1; transition: transform 0.2s; padding: 2px 5px; }
        .settings-button:hover, .close-button:hover { transform: scale(1.2); }
        .search-container { padding: 10px 15px; background-color: #f5f5f5; border-bottom: 1px solid #ddd; flex-shrink: 0; }
        .search-box { display: flex; gap: 5px; }
        .search-input { flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 15px; background-color: transparent; }
        .search-button { padding: 8px 15px; background-color: ${actionButtonColor}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s; }
        .search-button:hover { background-color: ${darkenColor(actionButtonColor, 10)}; }
        #buttons-grid { display: grid; grid-template-columns: repeat(${siteConfig.gridColumns || 2}, 1fr); gap: 8px; padding: 15px; overflow-y: auto; flex: 1; scrollbar-width: thin; scrollbar-color: #d0d0d0 #f5f5f5; }
        #buttons-grid::-webkit-scrollbar { width: 6px; height: 6px; }
        #buttons-grid::-webkit-scrollbar-track { background: #f5f5f5; }
        #buttons-grid::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 3px; }
        .button-wrapper { position: relative; }
        .button-wrapper[data-size="1x"] { grid-column: span 1; grid-row: span 1; }
        .button-wrapper[data-size="2x"] { grid-column: span 2; grid-row: span 1; }
        .button-wrapper[data-size="3x"] { grid-column: span 3; grid-row: span 1; }
        .user-button { display: block; padding: 8px 10px; background-color: ${buttonColor}; color: white !important; text-align: center; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 12px; transition: all 0.3s; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 100%; width: 100%; line-height: 1.5; }
        .user-button:hover { background-color: ${darkenColor(buttonColor, 10)}; transform: scale(1.05); }
        .action-button { padding: 8px 12px; color: white; text-align: center; border-radius: 5px; cursor: pointer; font-weight: 500; transition: all 0.3s; font-size: 13px; background-color: ${actionButtonColor}; }
        .action-button:hover { background-color: ${darkenColor(actionButtonColor, 10)}; transform: scale(1.05); }
        .button-container { display: flex; flex-direction: row; gap: 10px; padding: 0 15px 15px; flex-shrink: 0; align-items: center; }
        .button-container-left { flex: 1; display: flex; gap: 8px; }
        .button-container-right { display: flex; gap: 8px; }
        .compact-button { width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        #settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; width: 90%; max-width: 800px; max-height: 85vh; background-color: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); display: none; flex-direction: column; overflow: hidden; }
        #settings-panel.show { display: flex; }
        .settings-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background-color: ${headerColor}; color: white; font-weight: bold; font-size: 16px; }
        .settings-content { padding: 20px; overflow-y: auto; flex: 1; }
        .setting-section { margin-bottom: 25px; }
        .setting-section h3 { margin: 0 0 15px 0; font-size: 16px; color: ${primaryColor}; font-weight: 600; border-bottom: 2px solid ${lightenColor(primaryColor, 30)}; padding-bottom: 8px; text-align: left; }
        .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee; }
        .setting-item:last-child { border-bottom: none; }
        .setting-label { font-size: 14px; color: #000; font-weight: 500; }
        .setting-control { display: flex; gap: 10px; align-items: center; }
        .toggle-switch { position: relative; width: 50px; height: 24px; background-color: #ccc; border-radius: 12px; cursor: pointer; transition: background-color 0.3s; }
        .toggle-switch.active { background-color: ${primaryColor}; }
        .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background-color: white; border-radius: 50%; transition: left 0.3s; }
        .toggle-switch.active::after { left: 28px; }
        .radio-group { display: flex; gap: 10px; }
        .radio-option { padding: 5px 15px; border: 2px solid ${primaryColor}; border-radius: 5px; cursor: pointer; transition: all 0.3s; font-size: 13px; color: #000; background-color: transparent; }
        .radio-option.active { background-color: ${primaryColor}; color: white; }
        .style-list { margin-top: 10px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .style-item { display: flex; align-items: center; gap: 10px; padding: 12px; background-color: #f8f8f8; border-radius: 8px; transition: all 0.3s; }
        .style-item:hover { background-color: #f0f0f0; }
        .style-item.dragging { opacity: 0.5; }
        .style-item.drag-over { border-top: 3px solid ${primaryColor}; }
        .drag-handle { font-size: 18px; color: #999; cursor: grab; padding: 0 5px; }
        .drag-handle:active { cursor: grabbing; }
        .style-item-name { flex: 1; font-size: 14px; font-weight: 500; color: #000; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .shared-domains-list .style-item-name { color: #000; }
        .style-controls { display: flex; gap: 8px; align-items: center; }
        .color-picker-wrapper { position: relative; }
        .color-preview { width: 16px; height: 16px; border-radius: 3px; cursor: pointer; border: none; transition: all 0.3s; }
        .color-preview:hover { border-color: ${primaryColor}; transform: scale(1.1); }
        .color-dropdown { display: none; position: absolute; bottom: 100%; right: 0; margin-bottom: 5px; padding: 10px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 200px; }
        .color-dropdown.show { display: block; }
        .color-palette-mini { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px; }
        .color-swatch-mini { width: 100%; aspect-ratio: 1; border-radius: 4px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
        .color-swatch-mini:hover { transform: scale(1.1); border-color: #333; }
        .color-swatch-mini.custom { background: linear-gradient(45deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .custom-color-input { width: 100%; height: 32px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
        .size-picker-wrapper { position: relative; }
        .size-preview { width: 40px; height: 32px; border-radius: 5px; cursor: pointer; border: 2px solid #ddd; transition: all 0.3s; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; background: white; color: #000; }
        .size-preview:hover { border-color: ${primaryColor}; transform: scale(1.1); }
        .size-dropdown { display: none; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 5px; padding: 6px; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 60px; }
        .size-dropdown.show { display: block; }
        .size-option { padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s; text-align: center; margin-bottom: 4px; border: 2px solid transparent; color: #000; background-color: white; }
        .size-option:last-child { margin-bottom: 0; }
        .size-option:hover { background-color: ${lightenColor(primaryColor, 40)}; border-color: ${primaryColor}; }
        .size-option.active { background-color: ${primaryColor}; color: white; border-color: ${primaryColor}; }
        .delete-btn-mini { padding: 6px 12px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.3s; }
        .delete-btn-mini:hover { background-color: #c0392b; }
        .rename-btn-mini { padding: 6px 12px; background-color: ${primaryColor}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.3s; }
        .rename-btn-mini:hover { background-color: ${darkenColor(primaryColor, 10)}; }
        .search-engine-list { margin-top: 10px; }
        .search-engine-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; background-color: #f5f5f5; border-radius: 5px; margin-bottom: 5px; }
        .search-engine-info { flex: 1; font-size: 13px; }
        .search-engine-name { font-weight: bold; color: #000; }
        .search-engine-url { font-size: 11px; color: #666; margin-top: 2px; }
        .remove-search-btn { padding: 3px 8px; background-color: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; }
        .add-search-btn { padding: 8px 15px; background-color: ${actionButtonColor}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 13px; margin-top: 10px; transition: all 0.3s; }
        .add-search-btn:hover { background-color: ${darkenColor(actionButtonColor, 10)}; }
        .button-order-list { display: flex; gap: 8px; flex-wrap: wrap; }
        .button-order-item { padding: 8px 15px; background-color: #f5f5f5; border-radius: 5px; cursor: move; border: 2px solid #ddd; transition: all 0.3s; }
        .button-order-item:hover { background-color: #e8e8e8; border-color: ${primaryColor}; }
        .button-order-item.dragging { opacity: 0.5; }
        .overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 10000; display: none; }
        .overlay.show { display: block; }
        .module-config-item { display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f8f8f8; border-radius: 8px; margin-bottom: 8px; transition: all 0.3s; border: 2px solid transparent; }
        .module-config-item:hover { background-color: #f0f0f0; }
        .module-config-item.dragging { opacity: 0.5; }
        .module-config-item.drag-over { border-top: 3px solid ${primaryColor}; }
        .module-drag-handle { font-size: 18px; color: #999; cursor: grab; padding: 0 5px; user-select: none; }
        .module-drag-handle:active { cursor: grabbing; }
        .module-name { flex: 0 0 80px; font-size: 14px; font-weight: 500; }
        .module-visible-toggle { flex: 0 0 auto; }
        .module-width-control { flex: 1; display: flex; align-items: center; gap: 8px; }
        .module-width-slider { flex: 1; min-width: 100px; }
        .module-width-value { flex: 0 0 50px; font-size: 13px; color: #666; text-align: right; }
        .shared-domains-list { width: 100%; margin-bottom: 10px; }
        .shared-domains-list .style-item { margin-bottom: 5px; }
    `);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const expandButton = document.createElement('div');
    expandButton.id = 'expand-button';
    expandButton.textContent = siteConfig.position === 'top' ? '▼' : siteConfig.position === 'bottom' ? '▲' : '▶';
    container.appendChild(expandButton);

    function createSettingsPanel() {
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';

        settingsPanel.innerHTML = `
            <div class="settings-header">
                <span>高级设置</span>
                <span class="close-button" style="cursor: pointer;">×</span>
            </div>
            <div class="settings-content">
                <div class="setting-section">
                    <h3>基本设置</h3>
                    <div class="setting-item">
                        <span class="setting-label">面板名称</span>
                        <div class="setting-control">
                            <input type="text" id="custom-panel-name" value="${siteConfig.customPanelName || ''}" placeholder="${platformData[currentPlatform].name}导航" style="width: 200px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background-color: transparent; color: #000;">
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">面板位置</span>
                        <div class="setting-control">
                            <div class="radio-group">
                                <div class="radio-option ${siteConfig.position === 'left' ? 'active' : ''}" data-position="left">左侧</div>
                                <div class="radio-option ${siteConfig.position === 'right' ? 'active' : ''}" data-position="right">右侧</div>
                                <div class="radio-option ${siteConfig.position === 'top' ? 'active' : ''}" data-position="top">顶栏</div>
                                <div class="radio-option ${siteConfig.position === 'bottom' ? 'active' : ''}" data-position="bottom">底栏</div>
                            </div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">默认展开面板</span>
                        <div class="setting-control">
                            <div class="toggle-switch ${siteConfig.autoExpand ? 'active' : ''}" data-setting="autoExpand"></div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">左键当前页打开</span>
                        <div class="setting-control">
                            <div class="toggle-switch ${siteConfig.openInCurrentTab ? 'active' : ''}" data-setting="openInCurrentTab"></div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">主题色</span>
                        <div class="setting-control">
                            <input type="color" id="primary-color-picker" value="${siteConfig.primaryColor}" style="width: 60px; height: 30px; border: none; outline: none; border-radius: 4px; cursor: pointer; padding: 0;">
                            <button class="rename-btn-mini" id="reset-color-btn" style="margin-left: 8px;">恢复默认</button>
                        </div>
                    </div>
                </div>
                <div class="setting-section" style="display: ${siteConfig.position === 'left' || siteConfig.position === 'right' ? 'block' : 'none'};">
                    <h3>侧边栏设置</h3>
                    <div class="setting-item">
                        <span class="setting-label">显示标题栏</span>
                        <div class="setting-control">
                            <div class="toggle-switch ${siteConfig.showTitle ? 'active' : ''}" data-setting="showTitle"></div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">网格列数</span>
                        <div class="setting-control">
                            <div class="radio-group">
                                <div class="radio-option ${siteConfig.gridColumns === 2 ? 'active' : ''}" data-columns="2">2列</div>
                                <div class="radio-option ${siteConfig.gridColumns === 3 ? 'active' : ''}" data-columns="3">3列</div>
                            </div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">搜索框位置</span>
                        <div class="setting-control">
                            <div class="radio-group">
                                <div class="radio-option ${siteConfig.searchPosition === 'top' ? 'active' : ''}" data-search-pos="top">顶部</div>
                                <div class="radio-option ${siteConfig.searchPosition === 'bottom' ? 'active' : ''}" data-search-pos="bottom">底部</div>
                            </div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">面板宽度</span>
                        <div class="setting-control">
                            <input type="range" min="250" max="500" value="${siteConfig.panelWidth}" id="panel-width-slider" style="width: 150px;">
                            <span id="panel-width-value">${siteConfig.panelWidth}px</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">垂直偏移</span>
                        <div class="setting-control">
                            <input type="range" min="-80" max="80" value="${siteConfig.sideBarOffset}" id="sidebar-offset-slider" style="width: 150px;">
                            <span id="sidebar-offset-value">${siteConfig.sideBarOffset}%</span>
                        </div>
                    </div>
                </div>
                <div class="setting-section top-only" style="display: ${siteConfig.position === 'top' || siteConfig.position === 'bottom' ? 'block' : 'none'};">
                    <h3>顶栏/底栏设置</h3>
                    <div class="setting-item">
                        <span class="setting-label">${siteConfig.position === 'bottom' ? '底栏' : '顶栏'}宽度</span>
                        <div class="setting-control">
                            <input type="range" id="topbar-width-slider" min="400" max="1600" value="${siteConfig.topBarWidth}" style="width: 150px;">
                            <span id="topbar-width-value">${siteConfig.topBarWidth}px</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">${siteConfig.position === 'bottom' ? '底栏' : '顶栏'}偏移</span>
                        <div class="setting-control">
                            <input type="range" id="topbar-offset-slider" min="-80" max="80" value="${siteConfig.topBarOffset}" style="width: 150px;">
                            <span id="topbar-offset-value">${siteConfig.topBarOffset}%</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">${siteConfig.position === 'bottom' ? '底栏' : '顶栏'}高度</span>
                        <div class="setting-control">
                            <input type="range" id="topbar-height-slider" min="40" max="120" value="${siteConfig.topBarHeight}" style="width: 150px;">
                            <span id="topbar-height-value">${siteConfig.topBarHeight}px</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">收藏默认展开</span>
                        <div class="setting-control">
                            <div class="toggle-switch ${siteConfig.autoExpandContent ? 'active' : ''}" data-setting="autoExpandContent"></div>
                        </div>
                    </div>
                </div>
                <div class="setting-section">
                    <h3>数据管理</h3>
                    <div class="setting-item">
                        <span class="setting-label">备份与恢复</span>
                        <div class="setting-control" style="gap: 8px;">
                            <button class="rename-btn-mini" id="export-data-btn">导出数据</button>
                            <button class="rename-btn-mini" id="import-data-btn">导入数据</button>
                        </div>
                    </div>
                </div>
                <div class="setting-section">
                    <h3>共享网址管理</h3>
                    <div class="setting-item" style="flex-direction: column; align-items: flex-start;">
                        <span class="setting-label" style="margin-bottom: 8px;">共享数据的域名列表</span>
                        <div class="setting-description" style="font-size: 12px; color: #000; margin-bottom: 10px;">
                            用于镜像网站数据共享。添加镜像域名后,收藏数据将在这些域名间共享,但点击链接时会自动跳转到当前域名对应的页面。
                        </div>
                        <div class="shared-domains-list" id="shared-domains-list"></div>
                        <div style="display: flex; gap: 10px;">
                            <button class="add-search-btn" id="add-shared-domain-btn">+ 添加共享域名</button>
                            <button class="add-search-btn" id="migrate-mirror-data-btn" style="background-color: #e74c3c;">迁移镜像数据到本站</button>
                        </div>
                    </div>
                </div>
                <div class="setting-section">
                    <h3>样式管理</h3>
                    <div class="style-list" id="style-list"></div>
                </div>
                <div class="setting-section">
                    <h3>搜索引擎管理</h3>
                    <div class="search-engine-list" id="search-engine-list"></div>
                    <button class="add-search-btn">+ 添加搜索引擎</button>
                </div>
                <div class="setting-section top-only" style="display: ${siteConfig.position === 'top' || siteConfig.position === 'bottom' ? 'block' : 'none'};">
                    <h3>顶栏底栏模块排序</h3>
                    <div class="style-list" id="topbar-modules-order-list"></div>
                </div>
            </div>
        `;

        document.body.appendChild(settingsPanel);

        // 面板尺寸滑块
        const widthSlider = settingsPanel.querySelector('#panel-width-slider');
        const widthValue = settingsPanel.querySelector('#panel-width-value');
        widthSlider.oninput = () => {
            siteConfig.panelWidth = parseInt(widthSlider.value);
            widthValue.textContent = siteConfig.panelWidth + 'px';
            saveSiteConfig();
        };

        // 侧边栏偏移滑块
        const sidebarOffsetSlider = settingsPanel.querySelector('#sidebar-offset-slider');
        const sidebarOffsetValue = settingsPanel.querySelector('#sidebar-offset-value');
        if (sidebarOffsetSlider) {
            sidebarOffsetSlider.oninput = () => {
                siteConfig.sideBarOffset = parseInt(sidebarOffsetSlider.value);
                sidebarOffsetValue.textContent = siteConfig.sideBarOffset + '%';
                saveSiteConfig();
                // 直接修改DOM样式
                const panelContainer = document.querySelector('#panel-container');
                const expandButton = document.querySelector('#expand-button');
                if (panelContainer) {
                    panelContainer.style.top = `calc(50% + ${siteConfig.sideBarOffset}%)`;
                }
                if (expandButton) {
                    expandButton.style.top = `calc(50% + ${siteConfig.sideBarOffset}%)`;
                }
            };
        }

        // 顶栏宽度滑块（仅top模式）
        const topbarWidthSlider = settingsPanel.querySelector('#topbar-width-slider');
        const topbarWidthValue = settingsPanel.querySelector('#topbar-width-value');
        if (topbarWidthSlider) {
            topbarWidthSlider.oninput = () => {
                siteConfig.topBarWidth = parseInt(topbarWidthSlider.value);
                topbarWidthValue.textContent = siteConfig.topBarWidth + 'px';
                saveSiteConfig();
                // 直接修改DOM样式
                const favContainer = document.querySelector('.favorites-buttons-container');
                if (favContainer) {
                    favContainer.style.maxWidth = siteConfig.topBarWidth + 'px';
                }
            };
        }

        // 顶栏偏移滑块（仅top模式）
        const topbarOffsetSlider = settingsPanel.querySelector('#topbar-offset-slider');
        const topbarOffsetValue = settingsPanel.querySelector('#topbar-offset-value');
        if (topbarOffsetSlider) {
            topbarOffsetSlider.oninput = () => {
                siteConfig.topBarOffset = parseInt(topbarOffsetSlider.value);
                topbarOffsetValue.textContent = siteConfig.topBarOffset + '%';
                saveSiteConfig();
                // 直接修改DOM样式
                const favContainer = document.querySelector('.favorites-buttons-container');
                if (favContainer) {
                    favContainer.style.transform = `translateX(${siteConfig.topBarOffset}%)`;
                }
            };
        }
        // 顶栏高度滑块(仅top/bottom模式)
        const topbarHeightSlider = settingsPanel.querySelector('#topbar-height-slider');
        const topbarHeightValue = settingsPanel.querySelector('#topbar-height-value');
        if (topbarHeightSlider) {
            topbarHeightSlider.oninput = () => {
                const oldValue = siteConfig.topBarHeight;
                siteConfig.topBarHeight = parseInt(topbarHeightSlider.value);
                topbarHeightValue.textContent = siteConfig.topBarHeight + 'px';

                saveSiteConfig();
                // 直接修改DOM样式
                const favContainer = document.querySelector('.favorites-buttons-container');
                const buttonsGrid = document.querySelector('#buttons-grid');
                if (favContainer) {
                    favContainer.style.height = siteConfig.topBarHeight + 'px';
                    favContainer.style.minHeight = siteConfig.topBarHeight + 'px';
                    favContainer.style.maxHeight = siteConfig.topBarHeight + 'px';

                }
                if (buttonsGrid) {
                    buttonsGrid.style.minHeight = (siteConfig.topBarHeight - 12) + 'px';

                }
            };
        }

        // 导入导出按钮
        settingsPanel.querySelector('#export-data-btn').onclick = exportData;
        settingsPanel.querySelector('#import-data-btn').onclick = importData;

        // 顶栏模块配置
        const modulesListContainer = settingsPanel.querySelector('#topbar-modules-list');
        if (modulesListContainer && siteConfig.position === 'top') {
            const moduleNames = {
                'search': '搜索框',
                'favoritesButtons': '收藏夹和按钮'
            };

            // 按order排序显示
            const sortedModules = [...siteConfig.topBarModules].sort((a, b) => a.order - b.order);

            sortedModules.forEach((module, index) => {
                const item = document.createElement('div');
                item.className = 'module-config-item';
                item.draggable = true;
                item.dataset.moduleId = module.id;

                // 拖拽手柄
                const dragHandle = document.createElement('span');
                dragHandle.className = 'module-drag-handle';
                dragHandle.textContent = '☰';
                item.appendChild(dragHandle);

                // 模块名称
                const nameSpan = document.createElement('span');
                nameSpan.className = 'module-name';
                nameSpan.textContent = moduleNames[module.id] || module.id;
                item.appendChild(nameSpan);

                // 可见性开关
                const visibleToggle = document.createElement('div');
                visibleToggle.className = `toggle-switch module-visible-toggle ${module.visible ? 'active' : ''}`;
                visibleToggle.onclick = () => {
                    visibleToggle.classList.toggle('active');
                    module.visible = visibleToggle.classList.contains('active');
                    saveSiteConfig();
                };
                item.appendChild(visibleToggle);

                modulesListContainer.appendChild(item);

                // 拖拽事件
                item.ondragstart = (e) => {
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', item.innerHTML);
                };

                item.ondragend = () => {
                    item.classList.remove('dragging');
                    modulesListContainer.querySelectorAll('.module-config-item').forEach(i => i.classList.remove('drag-over'));
                };

                item.ondragover = (e) => {
                    e.preventDefault();
                    const draggingItem = modulesListContainer.querySelector('.dragging');
                    if (draggingItem && draggingItem !== item) {
                        const rect = item.getBoundingClientRect();
                        const midpoint = rect.top + rect.height / 2;
                        if (e.clientY < midpoint) {
                            modulesListContainer.insertBefore(draggingItem, item);
                        } else {
                            modulesListContainer.insertBefore(draggingItem, item.nextSibling);
                        }
                    }
                };

                item.ondrop = (e) => {
                    e.preventDefault();
                    // 更新order
                    const items = Array.from(modulesListContainer.querySelectorAll('.module-config-item'));
                    items.forEach((itm, idx) => {
                        const moduleId = itm.dataset.moduleId;
                        const moduleConfig = siteConfig.topBarModules.find(m => m.id === moduleId);
                        if (moduleConfig) moduleConfig.order = idx;
                    });
                    saveSiteConfig();
                };
            });
        }

        // Toggle开关事件处理
        settingsPanel.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.onclick = () => {
                const setting = toggle.dataset.setting;
                if (setting) {
                    toggle.classList.toggle('active');
                    siteConfig[setting] = toggle.classList.contains('active');
                    saveSiteConfig();
                    alert(`设置已更新！页面将刷新以应用更改。`);
                    location.reload();
                }
            };
        });

        // 样式列表
        const styleList = settingsPanel.querySelector('#style-list');
        platformUsers.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'style-item';
            item.draggable = true;

            const size = user.size || '1x';
            const color = user.color || buttonColor;

            item.innerHTML = `
                <span class="drag-handle">☰</span>
                <span class="style-item-name" title="${user.name}">${user.name}</span>
            `;

            const controls = document.createElement('div');
            controls.className = 'style-controls';

            // 颜色选择 - 使用原生颜色选择器
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = color;
            colorInput.style.cssText = 'width: 32px; height: 32px; border: none; border-radius: 4px; cursor: pointer;';
            colorInput.title = '选择颜色';
            colorInput.oninput = () => {
                platformUsers[index].color = colorInput.value;
                saveUsers();
                renderPanel();
            };
            controls.appendChild(colorInput);

            // 尺寸选择 - 改为下拉菜单
            const sizeWrapper = document.createElement('div');
            sizeWrapper.className = 'size-picker-wrapper';
            const sizePreview = document.createElement('div');
            sizePreview.className = 'size-preview';
            sizePreview.textContent = size;
            sizeWrapper.appendChild(sizePreview);

            const sizeDropdown = document.createElement('div');
            sizeDropdown.className = 'size-dropdown';
            ['1x', '2x', '3x'].forEach(s => {
                const option = document.createElement('div');
                option.className = 'size-option' + (s === size ? ' active' : '');
                option.textContent = s;
                option.onclick = () => {
                    platformUsers[index].size = s;
                    saveUsers();
                    sizePreview.textContent = s;
                    sizeDropdown.classList.remove('show');
                    sizeDropdown.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    renderPanel();
                };
                sizeDropdown.appendChild(option);
            });
            sizeWrapper.appendChild(sizeDropdown);
            controls.appendChild(sizeWrapper);

            sizePreview.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.size-dropdown').forEach(d => d !== sizeDropdown && d.classList.remove('show'));
                sizeDropdown.classList.toggle('show');
            };

            // 重命名按钮
            const renameBtn = document.createElement('button');
            renameBtn.className = 'rename-btn-mini';
            renameBtn.textContent = '重命名';
            renameBtn.onclick = () => {
                const newName = prompt(`请输入新名称：`, user.name);
                if (newName && newName.trim() && newName !== user.name) {
                    platformUsers[index].name = newName.trim();
                    saveUsers();
                    renderPanel();
                    settingsPanel.remove();
                    openSettings();
                }
            };
            controls.appendChild(renameBtn);

            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn-mini';
            deleteBtn.textContent = '删除';
            deleteBtn.onclick = () => {
                if (confirm(`确定要删除 "${user.name}" 吗？`)) {
                    platformUsers.splice(index, 1);
                    saveUsers();
                    renderPanel();
                    settingsPanel.remove();
                    openSettings();
                }
            };
            controls.appendChild(deleteBtn);

            item.appendChild(controls);
            styleList.appendChild(item);

            // 拖拽排序
            item.ondragstart = () => { draggedIndex = index; item.classList.add('dragging'); };
            item.ondragend = () => { item.classList.remove('dragging'); draggedIndex = null; settingsPanel.remove(); openSettings(); };
            item.ondragover = (e) => { e.preventDefault(); item.classList.add('drag-over'); };
            item.ondragleave = () => item.classList.remove('drag-over');
            item.ondrop = (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                if (draggedIndex !== null && draggedIndex !== index) {
                    const temp = platformUsers[draggedIndex];
                    platformUsers.splice(draggedIndex, 1);
                    const newIndex = draggedIndex < index ? index - 1 : index;
                    platformUsers.splice(newIndex, 0, temp);
                    saveUsers();
                    renderPanel();
                }
            };
        });

        // 搜索引擎列表
        const searchList = settingsPanel.querySelector('#search-engine-list');
        let draggedSearchIndex = null;

        siteConfig.searchEngines.forEach((engine, index) => {
            const item = document.createElement('div');
            item.className = 'style-item'; // 复用样式
            item.draggable = true;

            // 拖拽手柄
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.textContent = '☰';
            item.appendChild(dragHandle);

            // 搜索引擎信息
            const infoDiv = document.createElement('div');
            infoDiv.style.cssText = 'flex: 1; min-width: 0;';
            infoDiv.innerHTML = `
                <div class="search-engine-name" style="font-weight: bold; color: ${primaryColor};">${engine.name}</div>
                <div class="search-engine-url" style="font-size: 11px; color: #666; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${engine.urlTemplate}</div>
            `;
            item.appendChild(infoDiv);

            // 删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn-mini';
            deleteBtn.textContent = '删除';
            deleteBtn.onclick = () => {
                if (confirm(`确定要删除搜索引擎 "${engine.name}" 吗？`)) {
                    siteConfig.searchEngines.splice(index, 1);
                    saveSiteConfig();
                    settingsPanel.remove();
                    openSettings();
                }
            };
            item.appendChild(deleteBtn);

            searchList.appendChild(item);

            // 拖拽排序
            item.ondragstart = () => {
                draggedSearchIndex = index;
                item.classList.add('dragging');
            };
            item.ondragend = () => {
                item.classList.remove('dragging');
                draggedSearchIndex = null;
                settingsPanel.remove();
                openSettings();
            };
            item.ondragover = (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            };
            item.ondragleave = () => item.classList.remove('drag-over');
            item.ondrop = (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                if (draggedSearchIndex !== null && draggedSearchIndex !== index) {
                    const temp = siteConfig.searchEngines[draggedSearchIndex];
                    siteConfig.searchEngines.splice(draggedSearchIndex, 1);
                    const newIndex = draggedSearchIndex < index ? index - 1 : index;
                    siteConfig.searchEngines.splice(newIndex, 0, temp);
                    saveSiteConfig();
                    renderPanel();
                }
            };
        });

        // 共享域名列表
        const sharedDomainsList = settingsPanel.querySelector('#shared-domains-list');
        siteConfig.sharedDomains.forEach((domain, index) => {
            const item = document.createElement('div');
            item.className = 'style-item';

            const domainText = document.createElement('div');
            domainText.style.cssText = 'flex: 1; font-size: 13px; padding: 8px 0; color: #000;';
            domainText.textContent = domain;
            if (domain === currentHost) {
                domainText.innerHTML += ' <span style="color: #999; font-size: 11px;">(当前域名)</span>';
            }
            item.appendChild(domainText);

            // 只有非当前域名才能删除
            if (domain !== currentHost) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn-mini';
                deleteBtn.textContent = '删除';
                deleteBtn.onclick = () => {
                    if (confirm(`确定要删除镜像域名 "${domain}" 吗?\n\n删除后,该域名将使用独立的数据存储。`)) {
                        // 从当前站点删除
                        siteConfig.sharedDomains.splice(index, 1);
                        saveSiteConfig();

                        // 【双向删除】从镜像站点也删除当前域名
                        const mirrorPlatform = domain.replace(/\./g, '_');
                        const mirrorConfigKey = `${mirrorPlatform}_config`;
                        const mirrorConfig = GM_getValue(mirrorConfigKey, {});

                        if (mirrorConfig.sharedDomains) {
                            const idx = mirrorConfig.sharedDomains.indexOf(currentHost);
                            if (idx > -1) {
                                mirrorConfig.sharedDomains.splice(idx, 1);
                                GM_setValue(mirrorConfigKey, mirrorConfig);
                            }
                        }

                        alert('镜像域名已删除，双向关系已解除，页面将刷新。');
                        location.reload();
                    }
                };
                item.appendChild(deleteBtn);
            }

            sharedDomainsList.appendChild(item);
        });

        // 事件监听
        settingsPanel.querySelector('.close-button').onclick = () => {
            settingsPanel.classList.remove('show');
            overlay.classList.remove('show');
        };

        settingsPanel.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.onclick = () => {
                const setting = toggle.dataset.setting;
                siteConfig[setting] = !siteConfig[setting];
                toggle.classList.toggle('active');
                saveSiteConfig();
                alert('设置已保存，刷新页面后生效');
            };
        });

        settingsPanel.querySelectorAll('.radio-option[data-position]').forEach(option => {
            option.onclick = () => {
                siteConfig.position = option.dataset.position;
                saveSiteConfig();
                settingsPanel.querySelectorAll('.radio-option[data-position]').forEach(o => o.classList.remove('active'));
                option.classList.add('active');

                // 显示/隐藏搜索框尺寸滑块
                const searchTopOnlyItems = settingsPanel.querySelectorAll('.search-top-only');
                searchTopOnlyItems.forEach(item => {
                    item.style.display = siteConfig.position === 'search-top' ? 'flex' : 'none';
                });

                // 显示/隐藏顶栏/底栏选项
                const topOnlyItems = settingsPanel.querySelectorAll('.top-only');
                topOnlyItems.forEach(item => {
                    item.style.display = (siteConfig.position === 'top' || siteConfig.position === 'bottom') ? 'flex' : 'none';
                });

                alert('位置设置已保存，刷新页面后生效');
            };
        });

        // 面板位置切换
        const positionOptions = settingsPanel.querySelectorAll('[data-position]');
        positionOptions.forEach(option => {
            option.onclick = () => {
                const position = option.dataset.position;
                siteConfig.position = position;
                saveSiteConfig();

                // 更新active状态
                positionOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                // 显示/隐藏顶栏相关选项
                const topBarOptions = settingsPanel.querySelectorAll('.top-bar-only');
                const sideOptions = settingsPanel.querySelectorAll('.side-only');

                if (position === 'top' || position === 'bottom') {
                    topBarOptions.forEach(el => el.style.display = 'flex');
                    sideOptions.forEach(el => el.style.display = 'none');
                } else {
                    topBarOptions.forEach(el => el.style.display = 'none');
                    sideOptions.forEach(el => el.style.display = 'flex');
                }

                alert('面板位置已更改！页面将刷新。');
                location.reload();
            };
        });

        // 顶栏样式切换
        settingsPanel.querySelectorAll('.radio-option[data-topbar-style]').forEach(option => {
            option.onclick = () => {
                siteConfig.topBarStyle = option.dataset.topbarStyle;
                saveSiteConfig();
                settingsPanel.querySelectorAll('.radio-option[data-topbar-style]').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                alert('顶栏样式已保存，刷新页面后生效');
            };
        });

        // 顶栏宽度切换
        settingsPanel.querySelectorAll('.radio-option[data-topbar-width]').forEach(option => {
            option.onclick = () => {
                siteConfig.topBarWidth = parseInt(option.dataset.topbarWidth);
                saveSiteConfig();
                settingsPanel.querySelectorAll('.radio-option[data-topbar-width]').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                alert('顶栏宽度已保存，刷新页面后生效');
                location.reload();
            };
        });

        settingsPanel.querySelectorAll('.radio-option[data-columns]').forEach(option => {
            option.onclick = () => {
                siteConfig.gridColumns = parseInt(option.dataset.columns);
                saveSiteConfig();
                settingsPanel.querySelectorAll('.radio-option[data-columns]').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                alert('列数设置已保存，刷新页面后生效');
            };
        });

        settingsPanel.querySelectorAll('.radio-option[data-search-pos]').forEach(option => {
            option.onclick = () => {
                siteConfig.searchPosition = option.dataset.searchPos;
                saveSiteConfig();
                settingsPanel.querySelectorAll('.radio-option[data-search-pos]').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                renderPanel();
            };
        });

        settingsPanel.querySelector('.add-search-btn').onclick = () => {
            const name = prompt('请输入搜索引擎名称（例如：Google）：');
            if (!name) return;
            const urlTemplate = prompt('请输入搜索URL模板（使用 {query} 作为搜索词占位符）：\n例如：https://www.google.com/search?q={query}');
            if (!urlTemplate || !urlTemplate.includes('{query}')) {
                alert('URL模板必须包含 {query} 占位符');
                return;
            }
            siteConfig.searchEngines.push({ name, urlTemplate });
            saveSiteConfig();
            settingsPanel.remove();
            openSettings();
        };

        // 添加共享域名
        settingsPanel.querySelector('#add-shared-domain-btn').onclick = () => {
            const domain = prompt('请输入要共享数据的域名:\n\n例如: jable.tv 或 fs1.app\n\n添加后,该域名的数据将与当前网站共享。');
            if (!domain) return;

            // 验证域名格式
            const domainPattern = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
            if (!domainPattern.test(domain)) {
                alert('域名格式不正确,请输入有效的域名(例如: example.com)');
                return;
            }

            // 检查是否已存在
            if (siteConfig.sharedDomains.includes(domain)) {
                alert('该域名已在共享列表中');
                return;
            }

            // 添加到共享列表
            siteConfig.sharedDomains.push(domain);
            saveSiteConfig();
            alert('共享域名已添加,页面将刷新以应用更改。');
            location.reload();
        };

        // 顶栏/底栏模块排序
        const modulesOrderList = settingsPanel.querySelector('#topbar-modules-order-list');
        if (modulesOrderList && (siteConfig.position === 'top' || siteConfig.position === 'bottom')) {
            const moduleNames = {
                'search': '搜索框',
                'favorites': '收藏内容',
                'buttons': '操作按钮'
            };

            let draggedModuleIndex = null;

            siteConfig.topBarModulesOrder.forEach((moduleId, index) => {
                const item = document.createElement('div');
                item.className = 'style-item';
                item.draggable = true;

                const dragHandle = document.createElement('span');
                dragHandle.className = 'drag-handle';
                dragHandle.textContent = '☰';
                item.appendChild(dragHandle);

                const nameSpan = document.createElement('span');
                nameSpan.style.cssText = 'flex: 1; font-weight: bold; color: ' + primaryColor + ';';
                nameSpan.textContent = moduleNames[moduleId] || moduleId;
                item.appendChild(nameSpan);

                modulesOrderList.appendChild(item);

                // 拖拽排序
                item.ondragstart = () => {
                    draggedModuleIndex = index;
                    item.classList.add('dragging');
                };
                item.ondragend = () => {
                    item.classList.remove('dragging');
                    draggedModuleIndex = null;
                };
                item.ondragover = (e) => {
                    e.preventDefault();
                    item.classList.add('drag-over');
                };
                item.ondragleave = () => item.classList.remove('drag-over');
                item.ondrop = (e) => {
                    e.preventDefault();
                    item.classList.remove('drag-over');
                    if (draggedModuleIndex !== null && draggedModuleIndex !== index) {
                        const temp = siteConfig.topBarModulesOrder[draggedModuleIndex];
                        siteConfig.topBarModulesOrder.splice(draggedModuleIndex, 1);
                        const newIndex = draggedModuleIndex < index ? index - 1 : index;
                        siteConfig.topBarModulesOrder.splice(newIndex, 0, temp);
                        saveSiteConfig();
                        renderPanel();
                        settingsPanel.remove();
                        openSettings();
                    }
                };
            });
        }

        document.addEventListener('click', () => {
            settingsPanel.querySelectorAll('.color-dropdown').forEach(d => d.classList.remove('show'));
            settingsPanel.querySelectorAll('.size-dropdown').forEach(d => d.classList.remove('show'));
        });

        // 自定义面板名称
        const customNameInput = settingsPanel.querySelector('#custom-panel-name');
        if (customNameInput) {
            customNameInput.addEventListener('blur', () => {
                siteConfig.customPanelName = customNameInput.value.trim();
                saveSiteConfig();
                renderPanel();
            });
            customNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    customNameInput.blur();
                }
            });
        }

        // 主题色选择器
        const colorPicker = settingsPanel.querySelector('#primary-color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('change', () => {
                siteConfig.primaryColor = colorPicker.value;
                saveSiteConfig();
                alert('主题色已更新，刷新页面后生效');
            });
        }

        // 恢复默认颜色按钮
        const resetColorBtn = settingsPanel.querySelector('#reset-color-btn');
        if (resetColorBtn) {
            resetColorBtn.addEventListener('click', () => {
                siteConfig.primaryColor = platformData[currentPlatform].color;
                saveSiteConfig();
                alert('已恢复默认主题色，刷新页面后生效');
            });
        }

        // 添加共享域名按钮（双向镜像）
        const addSharedDomainBtn = settingsPanel.querySelector('#add-shared-domain-btn');
        if (addSharedDomainBtn) {
            addSharedDomainBtn.addEventListener('click', () => {
                const domain = prompt('请输入要添加的镜像域名:');
                if (!domain || !domain.trim()) return;

                const trimmedDomain = domain.trim();

                // 验证域名格式
                if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmedDomain)) {
                    alert('无效的域名格式');
                    return;
                }

                // 检查是否已存在
                if (siteConfig.sharedDomains.includes(trimmedDomain)) {
                    alert('该域名已在镜像列表中');
                    return;
                }

                // 添加到当前站点的镜像列表
                siteConfig.sharedDomains.push(trimmedDomain);
                saveSiteConfig();

                // 【双向添加】在镜像站点也添加当前域名
                const mirrorPlatform = trimmedDomain.replace(/\./g, '_');
                const mirrorConfigKey = `${mirrorPlatform}_config`;
                const mirrorConfig = GM_getValue(mirrorConfigKey, {
                    sharedDomains: [trimmedDomain]
                });

                if (!mirrorConfig.sharedDomains) {
                    mirrorConfig.sharedDomains = [trimmedDomain];
                }

                if (!mirrorConfig.sharedDomains.includes(currentHost)) {
                    mirrorConfig.sharedDomains.push(currentHost);
                    GM_setValue(mirrorConfigKey, mirrorConfig);
                }

                alert(`已添加镜像域名: ${trimmedDomain}\n双向镜像关系已建立，页面将刷新。`);
                location.reload();
            });
        }

        // 迁移镜像数据按钮
        const migrateMirrorDataBtn = settingsPanel.querySelector('#migrate-mirror-data-btn');
        if (migrateMirrorDataBtn) {
            migrateMirrorDataBtn.addEventListener('click', () => {
                if (!siteConfig.sharedDomains || siteConfig.sharedDomains.length <= 1) {
                    alert('当前没有镜像站点');
                    return;
                }

                const mirrorSites = siteConfig.sharedDomains.filter(d => d !== currentHost);
                const message = `确定要将以下镜像站点的收藏数据迁移到本站吗？\n\n${mirrorSites.join('\n')}\n\n迁移后，这些数据将成为本站的独立收藏，即使删除镜像关系也不会丢失。`;

                if (!confirm(message)) return;

                let migratedCount = 0;
                const currentUsers = GM_getValue(storageKey, []);
                const urlSet = new Set(currentUsers.map(u => u.url));

                mirrorSites.forEach(domain => {
                    const mirrorPlatform = domain.replace(/\./g, '_');
                    const mirrorKey = `${mirrorPlatform}_users`;
                    const mirrorUsers = GM_getValue(mirrorKey, []);

                    mirrorUsers.forEach(user => {
                        const convertedUrl = convertUrlToCurrentDomain(user.url, domain);
                        if (!urlSet.has(convertedUrl)) {
                            currentUsers.push({
                                ...user,
                                url: convertedUrl
                            });
                            urlSet.add(convertedUrl);
                            migratedCount++;
                        }
                    });
                });

                if (migratedCount > 0) {
                    GM_setValue(storageKey, currentUsers);
                    alert(`成功迁移 ${migratedCount} 条收藏数据！页面将刷新。`);
                    location.reload();
                } else {
                    alert('没有新数据需要迁移。');
                }
            });
        }

        return settingsPanel;
    }

    function openSettings() {
        const oldPanel = document.getElementById('settings-panel');
        if (oldPanel) oldPanel.remove();
        const settingsPanel = createSettingsPanel();
        settingsPanel.classList.add('show');
        overlay.classList.add('show');
    }

    overlay.onclick = () => {
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) settingsPanel.classList.remove('show');
        overlay.classList.remove('show');
    };

    function renderPanel() {
        // 清理旧的容器
        const oldPanel = document.getElementById('panel-container');
        const oldSearchTop = document.getElementById('search-top-container');
        const wasExpanded = oldPanel && oldPanel.classList.contains('expanded');
        if (oldPanel) oldPanel.remove();
        if (oldSearchTop) oldSearchTop.remove();

        // search-top模式：搜索框在顶部，内容在侧边
        if (siteConfig.position === 'search-top' && siteConfig.searchEngines.length > 0) {
            // 创建顶部搜索框容器
            const searchTopContainer = document.createElement('div');
            searchTopContainer.id = 'search-top-container';
            searchTopContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: ${siteConfig.searchBoxWidth}px;
                height: ${siteConfig.searchBoxHeight}px;
                z-index: 10001;
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                border-radius: 0 0 8px 8px;
                display: flex;
                align-items: center;
                padding: 0 10px;
            `;

            const searchBox = document.createElement('div');
            searchBox.style.cssText = 'display: flex; width: 100%; gap: 8px;';

            const searchInput = document.createElement('input');
            searchInput.className = 'search-input';
            searchInput.placeholder = '输入搜索内容...';
            searchInput.style.cssText = `
                flex: 1;
                padding: 0 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                height: ${siteConfig.searchBoxHeight - 10}px;
            `;

            let activeEngineIndex = 0;
            const searchButton = document.createElement('button');
            searchButton.className = 'search-button';
            searchButton.textContent = siteConfig.searchEngines[0].name;
            searchButton.style.cssText = `
                padding: 0 16px;
                background-color: ${primaryColor};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                height: ${siteConfig.searchBoxHeight - 10}px;
            `;

            const performSearch = () => {
                const query = searchInput.value.trim();
                if (!query) { alert('请输入搜索内容'); return; }
                const url = siteConfig.searchEngines[activeEngineIndex].urlTemplate.replace('{query}', encodeURIComponent(query));
                window.open(url, '_blank');
            };

            searchButton.onclick = (e) => {
                if (e.shiftKey && siteConfig.searchEngines.length > 1) {
                    activeEngineIndex = (activeEngineIndex + 1) % siteConfig.searchEngines.length;
                    searchButton.textContent = siteConfig.searchEngines[activeEngineIndex].name;
                } else {
                    performSearch();
                }
            };
            searchInput.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };

            searchBox.appendChild(searchInput);
            searchBox.appendChild(searchButton);
            searchTopContainer.appendChild(searchBox);
            document.body.appendChild(searchTopContainer);

            // 主面板使用侧边模式（不包含搜索框）
            const panelContainer = document.createElement('div');
            panelContainer.id = 'panel-container';
            if (wasExpanded || siteConfig.autoExpand) panelContainer.classList.add('expanded');
            container.appendChild(panelContainer);

            // 标题栏
            if (siteConfig.showTitle) {
                const header = document.createElement('div');
                header.className = 'panel-header';
                header.innerHTML = `
                    <div class="panel-title">${platformData[currentPlatform].name}导航</div>
                    <div class="header-buttons">
                        <div class="settings-button" title="高级设置">⚙</div>
                        <div class="close-button">×</div>
                    </div>
                `;
                panelContainer.appendChild(header);
                header.querySelector('.settings-button').onclick = openSettings;
                header.querySelector('.close-button').onclick = () => {
                    panelContainer.classList.remove('expanded');
                    expandButton.style.display = 'flex';
                };
            }

            // 按钮网格
            const buttonsGrid = document.createElement('div');
            buttonsGrid.id = 'buttons-grid';
            platformUsers.forEach((user) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'button-wrapper';
                wrapper.dataset.size = user.size || '1x';
                const button = document.createElement('a');
                button.className = 'user-button';
                button.href = convertUrlForCurrentSite(user.url);
                button.target = '_blank';
                button.textContent = user.name;
                if (user.color) button.style.backgroundColor = user.color;
                wrapper.appendChild(button);
                buttonsGrid.appendChild(wrapper);
            });

            // 搜索引擎列表(根据searchPosition决定位置)
            if (siteConfig.searchEngines.length > 0) {
                const searchContainer = document.createElement('div');
                searchContainer.className = 'search-engines-container';
                searchContainer.style.cssText = 'width: 100%; margin-bottom: 10px;';
                siteConfig.searchEngines.forEach((engine) => {
                    const searchItem = document.createElement('div');
                    searchItem.className = 'search-engine-item';
                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = engine.name;
                    const searchBtn = document.createElement('button');
                    searchBtn.textContent = '搜索';
                    searchBtn.title = engine.name;
                    const performSearch = () => {
                        const query = searchInput.value.trim();
                        if (!query) {
                            alert('请输入搜索内容');
                            return;
                        }
                        const url = engine.urlTemplate.replace('{query}', encodeURIComponent(query));
                        window.open(url, '_blank');
                        searchInput.value = '';
                    };
                    searchBtn.onclick = performSearch;
                    searchInput.onkeypress = (e) => {
                        if (e.key === 'Enter') performSearch();
                    };
                    searchItem.appendChild(searchInput);
                    searchItem.appendChild(searchBtn);
                    searchContainer.appendChild(searchItem);
                });
                if (siteConfig.searchPosition === 'top') {
                    panelContainer.appendChild(searchContainer);
                }
            }

            panelContainer.appendChild(buttonsGrid);

            // 搜索引擎列表(底部)
            if (siteConfig.searchEngines.length > 0 && siteConfig.searchPosition === 'bottom') {
                const searchContainer = document.createElement('div');
                searchContainer.className = 'search-engines-container';
                searchContainer.style.cssText = 'width: 100%; margin-top: 10px;';
                siteConfig.searchEngines.forEach((engine) => {
                    const searchItem = document.createElement('div');
                    searchItem.className = 'search-engine-item';
                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = engine.name;
                    const searchBtn = document.createElement('button');
                    searchBtn.textContent = '搜索';
                    searchBtn.title = engine.name;
                    const performSearch = () => {
                        const query = searchInput.value.trim();
                        if (!query) {
                            alert('请输入搜索内容');
                            return;
                        }
                        const url = engine.urlTemplate.replace('{query}', encodeURIComponent(query));
                        window.open(url, '_blank');
                        searchInput.value = '';
                    };
                    searchBtn.onclick = performSearch;
                    searchInput.onkeypress = (e) => {
                        if (e.key === 'Enter') performSearch();
                    };
                    searchItem.appendChild(searchInput);
                    searchItem.appendChild(searchBtn);
                    searchContainer.appendChild(searchItem);
                });
                panelContainer.appendChild(searchContainer);
            }

            // 操作按钮
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const leftButtons = document.createElement('div');
            leftButtons.className = 'button-container-left';

            const rightButtons = document.createElement('div');
            rightButtons.className = 'button-container-right';

            const collectBtn = document.createElement('div');
            collectBtn.className = 'action-button';
            collectBtn.textContent = '收藏';
            collectBtn.onclick = () => {
                const name = prompt('请输入收藏名称：', document.title);
                if (name) { platformUsers.push({ name, url: window.location.href, size: '1x' }); saveUsers(); renderPanel(); }
            };
            leftButtons.appendChild(collectBtn);

            const addBtn = document.createElement('div');
            addBtn.className = 'action-button compact-button';
            addBtn.textContent = '+';
            addBtn.title = '添加';
            addBtn.onclick = () => {
                const name = prompt('请输入用户名：');
                if (!name) return;
                const url = prompt('请输入用户主页链接：');
                if (url) { platformUsers.push({ name, url, size: '1x' }); saveUsers(); renderPanel(); }
            };
            rightButtons.appendChild(addBtn);

            const settingsBtn = document.createElement('div');
            settingsBtn.className = 'action-button compact-button';
            settingsBtn.textContent = '⚙';
            settingsBtn.title = '高级设置';
            settingsBtn.onclick = openSettings;
            rightButtons.appendChild(settingsBtn);

            buttonContainer.appendChild(leftButtons);
            buttonContainer.appendChild(rightButtons);
            panelContainer.appendChild(buttonContainer);
            return;
        }

        // 顶栏/底栏动态模块模式
        if (siteConfig.position === 'top' || siteConfig.position === 'bottom') {
            const panelContainer = document.createElement('div');
            panelContainer.id = 'panel-container';
            if (wasExpanded || siteConfig.autoExpand) panelContainer.classList.add('expanded');
            container.appendChild(panelContainer);

            // ============================================
            // 重构后的顶栏/底栏模块化渲染代码
            // 替换位置：第1568行到第1738行
            // ============================================
            // 创建各个模块的辅助函数
            let buttonsGridRef = null; // 保存收藏网格的引用，供按钮模块使用
            const createSearchModule = () => {
                if (siteConfig.searchEngines.length === 0) return null;
                const searchContainer = document.createElement('div');
                searchContainer.className = 'search-engines-container';
                siteConfig.searchEngines.forEach((engine, index) => {
                    const searchItem = document.createElement('div');
                    searchItem.className = 'search-engine-item';
                    if (index > 0) {
                        searchItem.classList.add('hidden');
                    }
                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = engine.name;
                    const searchBtn = document.createElement('button');
                    searchBtn.textContent = '搜索';
                    searchBtn.title = engine.name;
                    const performSearch = () => {
                        const query = searchInput.value.trim();
                        if (!query) {
                            alert('请输入搜索内容');
                            return;
                        }
                        const url = engine.urlTemplate.replace('{query}', encodeURIComponent(query));
                        window.open(url, '_blank');
                        searchInput.value = '';
                    };
                    searchBtn.onclick = performSearch;
                    searchInput.onkeypress = (e) => {
                        if (e.key === 'Enter') performSearch();
                    };
                    searchItem.appendChild(searchInput);
                    searchItem.appendChild(searchBtn);
                    searchContainer.appendChild(searchItem);
                });
                return searchContainer;
            };
            const createFavoritesModule = () => {
                const buttonsGrid = document.createElement('div');
                buttonsGrid.id = 'buttons-grid';
                buttonsGridRef = buttonsGrid; // 保存引用
                platformUsers.forEach((user) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'button-wrapper';
                    wrapper.dataset.size = user.size || '1x';
                    const button = document.createElement('a');
                    button.className = 'user-button';
                    button.href = convertUrlForCurrentSite(user.url);
                    button.textContent = user.name;
                    if (user.color) button.style.backgroundColor = user.color;
                    if (siteConfig.openInCurrentTab) {
                        button.target = '_self';
                        button.onmousedown = (e) => {
                            if (e.button === 1) {
                                e.preventDefault();
                                window.open(button.href, '_blank');
                            }
                        };
                    } else {
                        button.target = '_blank';
                    }
                    wrapper.appendChild(button);
                    buttonsGrid.appendChild(wrapper);
                });
                if (siteConfig.autoExpandContent) {
                    buttonsGrid.classList.add('expanded');
                    panelContainer.classList.add('content-expanded');
                }
                return buttonsGrid;
            };
            const createButtonsModule = () => {
                const isBottom = siteConfig.position === 'bottom';
                const expandBtn = document.createElement('div');
                expandBtn.className = 'action-button';
                expandBtn.innerHTML = siteConfig.autoExpandContent ? (isBottom ? '▼' : '▲') : (isBottom ? '▲' : '▼');
                expandBtn.title = siteConfig.autoExpandContent ? '收起' : '展开查看更多';
                expandBtn.onclick = () => {
                    const buttonsGrid = buttonsGridRef;
                    const isExpanded = buttonsGrid.classList.contains('expanded');
                    const searchItems = document.querySelectorAll('.search-engine-item');
                    if (isExpanded) {
                        buttonsGrid.classList.remove('expanded');
                        panelContainer.classList.remove('content-expanded');
                        expandBtn.innerHTML = isBottom ? '▲' : '▼';
                        expandBtn.title = '展开查看更多';
                        searchItems.forEach((item, idx) => {
                            if (idx > 0) item.classList.add('hidden');
                        });
                    } else {
                        buttonsGrid.classList.add('expanded');
                        panelContainer.classList.add('content-expanded');
                        expandBtn.innerHTML = isBottom ? '▼' : '▲';
                        expandBtn.title = '收起';
                        searchItems.forEach(item => item.classList.remove('hidden'));
                    }
                };
                const collectBtn = document.createElement('div');
                collectBtn.className = 'action-button';
                collectBtn.textContent = '★';
                collectBtn.title = '收藏';
                collectBtn.onclick = () => {
                    const name = prompt('请输入收藏名称：', document.title);
                    if (name) { platformUsers.push({ name, url: window.location.href, size: '1x' }); saveUsers(); renderPanel(); }
                };
                const addBtn = document.createElement('div');
                addBtn.className = 'action-button';
                addBtn.textContent = '+';
                addBtn.title = '添加';
                addBtn.onclick = () => {
                    const name = prompt('请输入用户名：');
                    if (!name) return;
                    const url = prompt('请输入用户主页链接：');
                    if (url) { platformUsers.push({ name, url, size: '1x' }); saveUsers(); renderPanel(); }
                };
                const settingsBtn = document.createElement('div');
                settingsBtn.className = 'action-button';
                settingsBtn.textContent = '⚙';
                settingsBtn.title = '高级设置';
                settingsBtn.onclick = openSettings;
                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'topbar-buttons-container';
                buttonsContainer.appendChild(expandBtn);
                buttonsContainer.appendChild(collectBtn);
                buttonsContainer.appendChild(addBtn);
                buttonsContainer.appendChild(settingsBtn);
                return buttonsContainer;
            };
            // 根据配置顺序创建并添加模块
            const mainContainer = document.createElement('div');
            mainContainer.className = 'favorites-buttons-container';
            const moduleCreators = {
                'search': createSearchModule,
                'favorites': createFavoritesModule,
                'buttons': createButtonsModule
            };
            siteConfig.topBarModulesOrder.forEach(moduleId => {
                const creator = moduleCreators[moduleId];
                if (creator) {
                    const moduleElement = creator();
                    if (moduleElement) {
                        mainContainer.appendChild(moduleElement);
                    }
                }
            });

            // 添加临时关闭按钮到mainContainer中
            const tempCloseBtn = document.createElement('button');
            tempCloseBtn.className = 'temp-close-btn';
            tempCloseBtn.innerHTML = '×';
            tempCloseBtn.title = '临时关闭';
            tempCloseBtn.onclick = () => {
                panelContainer.style.display = 'none';
            };
            mainContainer.appendChild(tempCloseBtn);

            panelContainer.appendChild(mainContainer);
            return;
        }

        // 常规模式（side/top）
        const panelContainer = document.createElement('div');
        panelContainer.id = 'panel-container';
        if (wasExpanded || siteConfig.autoExpand) panelContainer.classList.add('expanded');
        container.appendChild(panelContainer);

        // 标题栏（根据showTitle设置显示）
        if (siteConfig.showTitle) {
            const header = document.createElement('div');
            header.className = 'panel-header';
            const panelTitle = siteConfig.customPanelName || `${platformData[currentPlatform].name}导航`;
            header.innerHTML = `
                <div class="panel-title">${panelTitle}</div>
                <div class="header-buttons">
                    <div class="settings-button" title="高级设置">⚙</div>
                    <div class="close-button">×</div>
                </div>
            `;
            panelContainer.appendChild(header);
            header.querySelector('.settings-button').onclick = openSettings;
            header.querySelector('.close-button').onclick = () => {
                panelContainer.classList.remove('expanded');
                expandButton.style.display = 'flex';
            };
        }

        // 创建搜索框（稍后根据位置添加）
        let searchContainer = null;
        if (siteConfig.searchEngines.length > 0) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';

            // 为每个搜索引擎创建一个搜索框
            siteConfig.searchEngines.forEach((engine) => {
                const searchBox = document.createElement('div');
                searchBox.className = 'search-box';
                searchBox.style.marginBottom = '6px';

                const searchInput = document.createElement('input');
                searchInput.className = 'search-input';
                searchInput.placeholder = engine.name;

                const searchButton = document.createElement('button');
                searchButton.className = 'search-button';
                searchButton.textContent = '搜索';

                const performSearch = () => {
                    const query = searchInput.value.trim();
                    if (!query) {
                        alert('请输入搜索内容');
                        return;
                    }
                    const url = engine.urlTemplate.replace('{query}', encodeURIComponent(query));
                    window.open(url, '_blank');
                    searchInput.value = '';
                };

                searchButton.onclick = performSearch;
                searchInput.onkeypress = (e) => {
                    if (e.key === 'Enter') performSearch();
                };

                searchBox.appendChild(searchInput);
                searchBox.appendChild(searchButton);
                searchContainer.appendChild(searchBox);
            });
        }

        // 如果搜索框在顶部，先添加
        if (searchContainer && siteConfig.searchPosition === 'top') {
            panelContainer.appendChild(searchContainer);
        }

        // 按钮网格
        const buttonsGrid = document.createElement('div');
        buttonsGrid.id = 'buttons-grid';
        displayUsers.forEach((user) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'button-wrapper';
            wrapper.dataset.size = user.size || '1x';
            const button = document.createElement('a');
            button.className = 'user-button';
            button.href = convertUrlForCurrentSite(user.url);
            button.textContent = user.name;
            if (user.color) button.style.backgroundColor = user.color;

            // 根据设置控制点击行为
            if (siteConfig.openInCurrentTab) {
                // 左键当前页，中键新页
                button.target = '_self';
                button.onmousedown = (e) => {
                    if (e.button === 1) { // 中键
                        e.preventDefault();
                        window.open(button.href, '_blank');
                    }
                };
            } else {
                // 左键和中键都是新页
                button.target = '_blank';
            }

            wrapper.appendChild(button);
            buttonsGrid.appendChild(wrapper);
        });

        panelContainer.appendChild(buttonsGrid);

        // 操作按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const leftButtons = document.createElement('div');
        leftButtons.className = 'button-container-left';

        const rightButtons = document.createElement('div');
        rightButtons.className = 'button-container-right';

        const buttonDefs = {
            collect: {
                text: '收藏', compact: false, action: () => {
                    const name = prompt('请输入收藏名称：', document.title);
                    if (name) { platformUsers.push({ name, url: window.location.href, size: '1x' }); saveUsers(); renderPanel(); }
                }
            },
            add: {
                text: '+', compact: true, action: () => {
                    const name = prompt('请输入用户名：');
                    if (!name) return;
                    const url = prompt('请输入用户主页链接：');
                    if (url) { platformUsers.push({ name, url, size: '1x' }); saveUsers(); renderPanel(); }
                }
            },
            settings: { text: '⚙', compact: true, action: openSettings }
        };

        // 展开按钮在最左边（仅顶栏模式）
        if (siteConfig.position === 'top') {
            const expandBtn = document.createElement('div');
            expandBtn.className = 'action-button compact-button';
            expandBtn.title = '展开查看更多';

            // 根据autoExpandContent设置初始状态
            if (siteConfig.autoExpandContent) {
                buttonsGrid.classList.add('expanded');
                panelContainer.classList.add('content-expanded');
                expandBtn.innerHTML = '▲';
                expandBtn.title = '收起';
            } else {
                expandBtn.innerHTML = '▼';
            }

            expandBtn.onclick = () => {
                const isExpanded = buttonsGrid.classList.contains('expanded');

                if (isExpanded) {
                    buttonsGrid.classList.remove('expanded');
                    panelContainer.classList.remove('content-expanded');
                    expandBtn.innerHTML = '▼';
                    expandBtn.title = '展开查看更多';
                } else {
                    buttonsGrid.classList.add('expanded');
                    panelContainer.classList.add('content-expanded');
                    expandBtn.innerHTML = '▲';
                    expandBtn.title = '收起';
                }
            };
            rightButtons.appendChild(expandBtn);
        }

        // 收藏按钮（星星图标）
        const collectBtn = document.createElement('div');
        collectBtn.className = 'action-button compact-button';
        collectBtn.textContent = '★';
        collectBtn.title = '收藏';
        collectBtn.onclick = buttonDefs.collect.action;
        rightButtons.appendChild(collectBtn);

        // 添加按钮
        const addBtn = document.createElement('div');
        addBtn.className = 'action-button compact-button';
        addBtn.textContent = '+';
        addBtn.title = '添加';
        addBtn.onclick = buttonDefs.add.action;
        rightButtons.appendChild(addBtn);

        // 设置按钮
        const settingsBtn = document.createElement('div');
        settingsBtn.className = 'action-button compact-button';
        settingsBtn.textContent = '⚙';
        settingsBtn.title = '高级设置';
        settingsBtn.onclick = buttonDefs.settings.action;
        rightButtons.appendChild(settingsBtn);

        buttonContainer.appendChild(leftButtons);
        buttonContainer.appendChild(rightButtons);
        panelContainer.appendChild(buttonContainer);

        // 如果搜索框在底部，最后添加（在所有内容之后）
        if (searchContainer && siteConfig.searchPosition === 'bottom') {
            panelContainer.appendChild(searchContainer);
        }
    }

    expandButton.onclick = () => {
        const panelContainer = document.getElementById('panel-container');
        panelContainer.classList.add('expanded');
        expandButton.style.display = 'none';
    };

    // 顶栏/底栏模式添加关闭按钮
    if (siteConfig.position === 'top' || siteConfig.position === 'bottom') {
        const closeButton = document.createElement('div');
        closeButton.className = 'close-button-top';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => {
            const panelContainer = document.getElementById('panel-container');
            panelContainer.classList.remove('expanded');
            expandButton.style.display = 'flex';
        };
        container.appendChild(closeButton);
    }

    // 等待 DOM 加载完成后再渲染面板
    function initPanel() {
        renderPanel();
        if (siteConfig.autoExpand) expandButton.style.display = 'none';
    }

    // 确保 DOM 已加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPanel);
    } else {
        initPanel();
    }
})();
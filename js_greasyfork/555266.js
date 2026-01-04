// ==UserScript==
// @name        豆瓣影片自定义搜索 (V2 - 菜单管理版)
// @namespace   https://toolsdar.cn/
// @version     2.2.1
// @description 在豆瓣影片页面标题旁添加一个自定义搜索引擎图标，支持通过菜单动态管理搜索引擎。
// @author      Toolsdar
// @match       https://movie.douban.com/subject/*
// @license     MIT
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/555266/%E8%B1%86%E7%93%A3%E5%BD%B1%E7%89%87%E8%87%AA%E5%AE%9A%E4%B9%89%E6%90%9C%E7%B4%A2%20%28V2%20-%20%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555266/%E8%B1%86%E7%93%A3%E5%BD%B1%E7%89%87%E8%87%AA%E5%AE%9A%E4%B9%89%E6%90%9C%E7%B4%A2%20%28V2%20-%20%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86%E7%89%88%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const STORAGE_KEY_ENGINES = 'customSearchEngines';
    const STORAGE_KEY_SELECTED = 'selectedEngineIndex';
 
    // 1. 默认搜索引擎 (仅在首次运行时使用)
    const DEFAULT_ENGINES = [
        {
            name: "Google (搜索夸克网盘)",
            urlTemplate: "https://www.google.com/search?q=%s",
            keyword: "quark.cn"
        },
        {
            name: "Google (搜索阿里云盘)",
            urlTemplate: "https://www.google.com/search?q=%s",
            keyword: "alipan.com"
        },
        {
            name: "奇乐搜 (Qileso)",
            urlTemplate: "https://www.qileso.com/?s=%s",
            keyword: ""
        },
        {
            name: "Bing (搜索夸克网盘)",
            urlTemplate: "https://www.bing.com/search?q=%s",
            keyword: "quark.cn"
        },
        {
            name: "百度 (搜索夸克网盘)",
            urlTemplate: "https://www.baidu.com/s?wd=%s",
            keyword: "quark.cn"
        }
    ];
 
    // 2. 辅助函数：获取所有搜索引擎
    function getEngines() {
        // 从存储中读取，如果不存在，则使用默认值并存入
        let engines = GM_getValue(STORAGE_KEY_ENGINES, DEFAULT_ENGINES);
        if (engines.length === 0) {
            engines = DEFAULT_ENGINES;
            GM_setValue(STORAGE_KEY_ENGINES, engines);
        }
        return engines;
    }
 
    // 3. 辅助函数：获取当前选择的引擎
    function getSelectedEngine() {
        const engines = getEngines();
        const selectedIndex = GM_getValue(STORAGE_KEY_SELECTED, 0);
 
        // 健壮性检查，防止索引越界
        if (selectedIndex < 0 || selectedIndex >= engines.length) {
            GM_setValue(STORAGE_KEY_SELECTED, 0);
            return engines[0];
        }
        return engines[selectedIndex];
    }
 
    // 4. 注册唯一的菜单命令
    GM_registerMenuCommand('⚙️ 搜索引擎设置', showSettingsMenu);
 
    // 5. 菜单管理功能
    function showSettingsMenu() {
        const engines = getEngines();
        const currentIndex = GM_getValue(STORAGE_KEY_SELECTED, 0);
        const currentEngineName = engines[currentIndex]?.name || "无"; // ?. 确保不报错
 
        // 创建主菜单文本
        let menuText = `--- 当前搜索引擎 ---\n【${currentEngineName}】\n\n--- 请选择操作 (输入数字) ---\n`;
        menuText += "1. 切换搜索引擎\n";
        menuText += "2. 添加新搜索引擎\n";
        menuText += "3. 删除搜索引擎\n";
        menuText += "4. 重置为默认设置\n\n";
        menuText += "输入其他或按“取消”退出。";
 
        const choice = prompt(menuText, "1");
 
        switch (choice) {
            case '1':
                switchEngine();
                break;
            case '2':
                addEngine();
                break;
            case '3':
                deleteEngine();
                break;
            case '4':
                resetEngines();
                break;
            default:
                break; // 用户取消或输入无效
        }
    }
 
    // 5.1 切换引擎
    function switchEngine() {
        const engines = getEngines();
        const currentIndex = GM_getValue(STORAGE_KEY_SELECTED, 0);
 
        let promptMessage = "请选择一个搜索引擎 (输入数字):\n\n";
        engines.forEach((engine, index) => {
            promptMessage += `${index + 1}: ${engine.name}${index === currentIndex ? " (当前)" : ""}\n`;
        });
 
        const input = prompt(promptMessage);
        if (input === null) return; // 用户取消
 
        const newIndex = parseInt(input, 10) - 1;
 
        if (newIndex >= 0 && newIndex < engines.length) {
            GM_setValue(STORAGE_KEY_SELECTED, newIndex);
            alert(`搜索引擎已切换为: ${engines[newIndex].name}\n\n页面刷新后生效。`);
            location.reload();
        } else {
            alert("输入无效。");
        }
    }
 
    // 5.2 添加引擎
    function addEngine() {
        alert("请依次输入新搜索引擎的信息：\n1. 名称 (例如: 百度)\n2. 搜索URL (用 %s 代替搜索词)\n3. 绑定的关键词 (无可留空)");
 
        const name = prompt("1. 名称 (例如: 百度)");
        if (!name) return alert("已取消操作。");
 
        const urlTemplate = prompt("2. 搜索URL (例如: https://www.baidu.com/s?wd=%s)\n\n!!! 必须包含 %s 作为搜索词占位符 !!!");
        if (!urlTemplate || !urlTemplate.includes('%s')) {
            return alert("URL模板无效，必须包含 %s。\n已取消操作。");
        }
 
        const keyword = prompt("3. 绑定的关键词 (例如: site:quark.cn)\n(如果不需要，请直接按确定)");
        if (keyword === null) return alert("已取消操作。"); // 检查是否按了取消
 
        const newEngine = {
            name: name,
            urlTemplate: urlTemplate,
            keyword: keyword || "" // 确保是字符串
        };
 
        const engines = getEngines();
        engines.push(newEngine);
        GM_setValue(STORAGE_KEY_ENGINES, engines);
 
        alert(`已成功添加: ${name}\n页面即将刷新以应用。`);
        location.reload();
    }
 
    // 5.3 删除引擎
    function deleteEngine() {
        const engines = getEngines();
        if (engines.length === 0) {
            return alert("当前没有可删除的搜索引擎。");
        }
 
        let promptMessage = "请输入要删除的搜索引擎编号 (输入数字):\n\n";
        engines.forEach((engine, index) => {
            promptMessage += `${index + 1}: ${engine.name}\n`;
        });
 
        const input = prompt(promptMessage);
        if (input === null) return; // 用户取消
 
        const indexToDelete = parseInt(input, 10) - 1;
 
        if (indexToDelete >= 0 && indexToDelete < engines.length) {
            const engineName = engines[indexToDelete].name;
            const confirmDelete = confirm(`你确定要删除 "${engineName}" 吗？`);
 
            if (confirmDelete) {
                engines.splice(indexToDelete, 1); // 从数组中删除
                GM_setValue(STORAGE_KEY_ENGINES, engines);
 
                // 如果删除的是当前选中的，重置选中索引为 0
                const currentIndex = GM_getValue(STORAGE_KEY_SELECTED, 0);
                if (currentIndex === indexToDelete || currentIndex >= engines.length) {
                    GM_setValue(STORAGE_KEY_SELECTED, 0);
                }
 
                alert(`已成功删除: ${engineName}\n页面即将刷新。`);
                location.reload();
            } else {
                alert("已取消删除。");
            }
        } else {
            alert("输入无效。");
        }
    }
 
    // 5.4 重置为默认
    function resetEngines() {
        const confirmReset = confirm("你确定要删除所有自定义设置，恢复为脚本默认的搜索引擎列表吗？");
        if (confirmReset) {
            GM_setValue(STORAGE_KEY_ENGINES, DEFAULT_ENGINES);
            GM_setValue(STORAGE_KEY_SELECTED, 0);
            alert("已重置为默认设置。\n页面即将刷新。");
            location.reload();
        }
    }
 
 
    // 6. 注入CSS样式 (与 V1 相同)
    GM_addStyle(`
        .custom-search-icon {
            margin-left: 10px;
            vertical-align: middle;
            display: inline-block;
            width: 22px; /* 调整大小以匹配豆瓣的UI */
            height: 22px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .custom-search-icon:hover {
            opacity: 1;
        }
        .custom-search-icon svg {
            width: 100%;
            height: 100%;
            fill: #37a; /* 使用豆瓣蓝 */
        }
    `);
 
    // 7. 主执行函数：添加图标 (与 V1 逻辑相同)
    function addSearchIcon() {
        try {
            // 获取标题
            const titleElement = document.querySelector('title');
            if (!titleElement) return;
            const movieTitle = titleElement.innerText.replace(/(^\s*)|(\s*$)/g, '').replace(' (豆瓣)', '');
 
            // 获取插入位置
            const h1 = document.querySelector('h1');
            if (!h1) return;
 
            // 获取当前设置的搜索引擎
            const currentEngine = getSelectedEngine();
            if (!currentEngine) return; // 如果没有引擎（例如全被删除了）
 
            // 构建搜索查询
            const encodedTitle = encodeURIComponent(movieTitle);
            const encodedKeyword = currentEngine.keyword ? encodeURIComponent(currentEngine.keyword.trim()) : "";
            const searchQuery = currentEngine.keyword ? `${encodedTitle} ${encodedKeyword}` : encodedTitle;
 
            // 构建最终URL
            const searchUrl = currentEngine.urlTemplate.replace('%s', searchQuery);
 
            // SVG图标
            const svgIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L500 454.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                </svg>
            `;
 
            // 创建链接元素
            const searchLink = document.createElement('a');
            searchLink.href = searchUrl;
            searchLink.target = '_blank';
            searchLink.title = `使用 ${currentEngine.name} 搜索 "${movieTitle}${currentEngine.keyword ? ' ' + currentEngine.keyword : ''}"`;
            searchLink.className = 'custom-search-icon';
            searchLink.innerHTML = svgIcon;
 
            h1.appendChild(searchLink);
 
        } catch (error) {
            console.error('豆瓣自定义搜索脚本出错:', error);
        }
    }
 
    // 确保DOM加载完毕后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addSearchIcon);
    } else {
        addSearchIcon();
    }
 
})();
// ==UserScript==
// @name         B站Wiki搜索增强工具
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  为B站Wiki添加可配置的搜索功能，支持三种操作模式
// @match        https://wiki.biligame.com/umamusume/*
// @match        https://wiki.biligame.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/562280/B%E7%AB%99Wiki%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/562280/B%E7%AB%99Wiki%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前Wiki的标识
    const getWikiIdentifier = () => {
        const url = new URL(window.location.href);
        const pathParts = url.pathname.split('/').filter(p => p);
        return pathParts.length > 0 ? pathParts[0] : url.hostname;
    };

    // 获取当前Wiki的配置
    const getWikiConfig = () => {
        const wikiId = getWikiIdentifier();
        const configKey = `wiki_search_config_${wikiId}`;
        const savedConfig = GM_getValue(configKey, null);

        const defaultConfig = {
            search: '',
            limit: '500',
            sort: 'create_timestamp_desc',
            offset: '0',
            profile: 'images',
            srnamespace: '6',
            searchmode: 'text',
            redirs: '1'
        };

        return savedConfig ? { ...defaultConfig, ...savedConfig } : defaultConfig;
    };

    // 保存当前Wiki的配置
    const saveWikiConfig = (config) => {
        const wikiId = getWikiIdentifier();
        const configKey = `wiki_search_config_${wikiId}`;
        GM_setValue(configKey, config);
    };

    // 获取所有Wiki的配置列表
    const getAllWikiConfigs = () => {
        const allValues = GM_listValues();
        const configs = {};

        allValues.forEach(key => {
            if (key.startsWith('wiki_search_config_')) {
                const wikiId = key.replace('wiki_search_config_', '');
                configs[wikiId] = GM_getValue(key);
            }
        });

        return configs;
    };

    // 创建浮动按钮
    const createFloatButton = () => {
        // 检查是否已存在按钮
        if (document.getElementById('wiki-search-float-btn')) return;

        const floatBtn = document.createElement('button');
        floatBtn.id = 'wiki-search-float-btn';
        floatBtn.textContent = '高级搜索';
        floatBtn.style.position = 'fixed';
        floatBtn.style.top = '100px';
        floatBtn.style.right = '20px';
        floatBtn.style.zIndex = '9999';
        floatBtn.style.padding = '10px 15px';
        floatBtn.style.backgroundColor = '#00a1d6';
        floatBtn.style.color = 'white';
        floatBtn.style.border = 'none';
        floatBtn.style.borderRadius = '4px';
        floatBtn.style.cursor = 'pointer';
        floatBtn.style.fontSize = '14px';
        floatBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        floatBtn.style.transition = 'all 0.3s ease';

        floatBtn.addEventListener('mouseenter', () => {
            floatBtn.style.transform = 'translateY(-2px)';
            floatBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        floatBtn.addEventListener('mouseleave', () => {
            floatBtn.style.transform = 'translateY(0)';
            floatBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        });

        floatBtn.addEventListener('click', showConfigPanel);

        document.body.appendChild(floatBtn);
    };

    // 显示配置面板
    const showConfigPanel = () => {
        // 如果已经存在面板，先移除
        const existingPanel = document.getElementById('wiki-search-panel');
        if (existingPanel) {
            document.body.removeChild(existingPanel);
            return;
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.id = 'wiki-search-overlay';

        // 创建配置面板
        const panel = document.createElement('div');
        panel.id = 'wiki-search-panel';
        panel.style.backgroundColor = 'white';
        panel.style.padding = '20px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        panel.style.width = '550px';
        panel.style.maxWidth = '90%';
        panel.style.maxHeight = '85vh';
        panel.style.overflowY = 'auto';

        // 面板标题
        const title = document.createElement('h3');
        title.textContent = `高级搜索配置 - ${getWikiIdentifier()} Wiki`;
        title.style.marginTop = '0';
        title.style.color = '#333';
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        panel.appendChild(title);

        // 添加配置状态图标
        const configStatus = document.createElement('span');
        configStatus.textContent = '已加载配置';
        configStatus.style.fontSize = '12px';
        configStatus.style.marginLeft = '10px';
        configStatus.style.padding = '2px 8px';
        configStatus.style.backgroundColor = '#d4edda';
        configStatus.style.color = '#155724';
        configStatus.style.borderRadius = '10px';
        title.appendChild(configStatus);

        // 当前Wiki标识显示
        const wikiInfo = document.createElement('div');
        wikiInfo.textContent = `当前配置将保存到: ${getWikiIdentifier()} Wiki`;
        wikiInfo.style.fontSize = '12px';
        wikiInfo.style.color = '#666';
        wikiInfo.style.marginBottom = '15px';
        wikiInfo.style.paddingBottom = '10px';
        wikiInfo.style.borderBottom = '1px solid #eee';
        panel.appendChild(wikiInfo);

        // 创建配置表单
        const form = document.createElement('form');
        form.id = 'wiki-search-form';

        // 从存储中加载当前Wiki的配置
        const currentConfig = getWikiConfig();

        // 搜索关键词
        form.appendChild(createFormGroup('搜索关键词', 'search', 'text', currentConfig.search, '请输入要搜索的关键词'));

        // 结果数量限制
        const limitOptions = [
            {value: '10', label: '10条'},
            {value: '20', label: '20条'},
            {value: '50', label: '50条'},
            {value: '100', label: '100条'},
            {value: '500', label: '500条'},
            {value: '1000', label: '1000条'}
        ];
        form.appendChild(createSelectGroup('结果数量', 'limit', limitOptions, currentConfig.limit));

        // 排序方式
        const sortOptions = [
            {value: 'relevance', label: '按相关性排序'},
            {value: 'just_match', label: '精确匹配'},
            {value: 'none', label: '无排序'},
            {value: 'incoming_links_asc', label: '入链数升序'},
            {value: 'incoming_links_desc', label: '入链数降序'},
            {value: 'last_edit_asc', label: '最后编辑时间升序'},
            {value: 'last_edit_desc', label: '最后编辑时间降序'},
            {value: 'create_timestamp_asc', label: '创建时间升序'},
            {value: 'create_timestamp_desc', label: '创建时间降序'},
            {value: 'random', label: '随机排序'},
            {value: 'user_random', label: '用户随机排序'}
        ];
        form.appendChild(createSelectGroup('排序方式', 'sort', sortOptions, currentConfig.sort));

        // 偏移量
        form.appendChild(createFormGroup('起始位置', 'offset', 'number', currentConfig.offset, '从第几条结果开始显示'));

        // 搜索模式
        const profileOptions = [
            {value: 'images', label: '仅图片'},
            {value: 'all', label: '全部内容'},
            {value: 'text', label: '仅文本'},
            {value: 'titles', label: '仅标题'}
        ];
        form.appendChild(createSelectGroup('搜索模式', 'profile', profileOptions, currentConfig.profile));

        // 命名空间
        const namespaceOptions = [
            {value: '0', label: '主命名空间'},
            {value: '1', label: '讨论页'},
            {value: '2', label: '用户页'},
            {value: '3', label: '用户讨论页'},
            {value: '4', label: '项目页'},
            {value: '5', label: '项目讨论页'},
            {value: '6', label: '文件页'},
            {value: '7', label: '文件讨论页'},
            {value: '8', label: 'MediaWiki页'},
            {value: '9', label: 'MediaWiki讨论页'},
            {value: '10', label: '模板页'},
            {value: '11', label: '模板讨论页'},
            {value: '12', label: '帮助页'},
            {value: '13', label: '帮助讨论页'},
            {value: '14', label: '分类页'},
            {value: '15', label: '分类讨论页'},
            {value: '-1', label: '特殊页'},
            {value: '-2', label: '媒体文件'}
        ];
        form.appendChild(createSelectGroup('命名空间', 'srnamespace', namespaceOptions, currentConfig.srnamespace));

        // 搜索类型
        const searchmodeOptions = [
            {value: 'text', label: '文本搜索'},
            {value: 'nearmatch', label: '近似匹配'},
            {value: 'prefix', label: '前缀匹配'}
        ];
        form.appendChild(createSelectGroup('搜索类型', 'searchmode', searchmodeOptions, currentConfig.searchmode));

        // 重定向处理
        const redirsOptions = [
            {value: '0', label: '不显示重定向'},
            {value: '1', label: '显示重定向'}
        ];
        form.appendChild(createSelectGroup('重定向处理', 'redirs', redirsOptions, currentConfig.redirs));

        panel.appendChild(form);

        // 按钮容器（三种操作模式）
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'grid';
        buttonContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '20px';

        // 模式1: 仅保存配置
        const saveOnlyBtn = document.createElement('button');
        saveOnlyBtn.type = 'button';
        saveOnlyBtn.style.padding = '10px 5px';
        saveOnlyBtn.style.backgroundColor = '#28a745';
        saveOnlyBtn.style.color = 'white';
        saveOnlyBtn.style.border = 'none';
        saveOnlyBtn.style.borderRadius = '4px';
        saveOnlyBtn.style.cursor = 'pointer';
        saveOnlyBtn.style.fontSize = '13px';
        saveOnlyBtn.style.display = 'flex';
        saveOnlyBtn.style.flexDirection = 'column';
        saveOnlyBtn.style.alignItems = 'center';
        saveOnlyBtn.style.justifyContent = 'center';
        saveOnlyBtn.style.transition = 'all 0.2s ease';

        // 创建按钮内容容器
        const saveOnlyContent = document.createElement('div');
        saveOnlyContent.style.textAlign = 'center';

        const saveOnlyMainText = document.createElement('div');
        saveOnlyMainText.textContent = '仅保存配置';
        saveOnlyMainText.style.fontWeight = 'bold';
        saveOnlyMainText.style.fontSize = '13px';

        const saveOnlyDesc = document.createElement('div');
        saveOnlyDesc.textContent = '保存设置供下次使用';
        saveOnlyDesc.style.fontSize = '10px';
        saveOnlyDesc.style.opacity = '0.8';
        saveOnlyDesc.style.marginTop = '4px';

        saveOnlyContent.appendChild(saveOnlyMainText);
        saveOnlyContent.appendChild(saveOnlyDesc);
        saveOnlyBtn.appendChild(saveOnlyContent);

        saveOnlyBtn.addEventListener('mouseenter', () => {
            saveOnlyBtn.style.transform = 'translateY(-2px)';
            saveOnlyBtn.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
        });

        saveOnlyBtn.addEventListener('mouseleave', () => {
            saveOnlyBtn.style.transform = 'translateY(0)';
            saveOnlyBtn.style.boxShadow = 'none';
        });

        saveOnlyBtn.addEventListener('click', () => {
            const formData = collectFormData();
            saveWikiConfig(formData);
            showToast('配置已保存！', 'success');
        });

        // 模式2: 直接搜索不保存
        const searchOnlyBtn = document.createElement('button');
        searchOnlyBtn.type = 'button';
        searchOnlyBtn.style.padding = '10px 5px';
        searchOnlyBtn.style.backgroundColor = '#17a2b8';
        searchOnlyBtn.style.color = 'white';
        searchOnlyBtn.style.border = 'none';
        searchOnlyBtn.style.borderRadius = '4px';
        searchOnlyBtn.style.cursor = 'pointer';
        searchOnlyBtn.style.fontSize = '13px';
        searchOnlyBtn.style.display = 'flex';
        searchOnlyBtn.style.flexDirection = 'column';
        searchOnlyBtn.style.alignItems = 'center';
        searchOnlyBtn.style.justifyContent = 'center';
        searchOnlyBtn.style.transition = 'all 0.2s ease';

        const searchOnlyContent = document.createElement('div');
        searchOnlyContent.style.textAlign = 'center';

        const searchOnlyMainText = document.createElement('div');
        searchOnlyMainText.textContent = '直接搜索';
        searchOnlyMainText.style.fontWeight = 'bold';
        searchOnlyMainText.style.fontSize = '13px';

        const searchOnlyDesc = document.createElement('div');
        searchOnlyDesc.textContent = '使用当前设置搜索';
        searchOnlyDesc.style.fontSize = '10px';
        searchOnlyDesc.style.opacity = '0.8';
        searchOnlyDesc.style.marginTop = '4px';

        searchOnlyContent.appendChild(searchOnlyMainText);
        searchOnlyContent.appendChild(searchOnlyDesc);
        searchOnlyBtn.appendChild(searchOnlyContent);

        searchOnlyBtn.addEventListener('mouseenter', () => {
            searchOnlyBtn.style.transform = 'translateY(-2px)';
            searchOnlyBtn.style.boxShadow = '0 4px 8px rgba(23, 162, 184, 0.3)';
        });

        searchOnlyBtn.addEventListener('mouseleave', () => {
            searchOnlyBtn.style.transform = 'translateY(0)';
            searchOnlyBtn.style.boxShadow = 'none';
        });

        searchOnlyBtn.addEventListener('click', () => {
            performSearch(false);
        });

        // 模式3: 保存配置并搜索
        const saveAndSearchBtn = document.createElement('button');
        saveAndSearchBtn.type = 'button';
        saveAndSearchBtn.style.padding = '10px 5px';
        saveAndSearchBtn.style.backgroundColor = '#00a1d6';
        saveAndSearchBtn.style.color = 'white';
        saveAndSearchBtn.style.border = 'none';
        saveAndSearchBtn.style.borderRadius = '4px';
        saveAndSearchBtn.style.cursor = 'pointer';
        saveAndSearchBtn.style.fontSize = '13px';
        saveAndSearchBtn.style.display = 'flex';
        saveAndSearchBtn.style.flexDirection = 'column';
        saveAndSearchBtn.style.alignItems = 'center';
        saveAndSearchBtn.style.justifyContent = 'center';
        saveAndSearchBtn.style.transition = 'all 0.2s ease';

        const saveAndSearchContent = document.createElement('div');
        saveAndSearchContent.style.textAlign = 'center';

        const saveAndSearchMainText = document.createElement('div');
        saveAndSearchMainText.textContent = '保存并搜索';
        saveAndSearchMainText.style.fontWeight = 'bold';
        saveAndSearchMainText.style.fontSize = '13px';

        const saveAndSearchDesc = document.createElement('div');
        saveAndSearchDesc.textContent = '保存设置并立即搜索';
        saveAndSearchDesc.style.fontSize = '10px';
        saveAndSearchDesc.style.opacity = '0.8';
        saveAndSearchDesc.style.marginTop = '4px';

        saveAndSearchContent.appendChild(saveAndSearchMainText);
        saveAndSearchContent.appendChild(saveAndSearchDesc);
        saveAndSearchBtn.appendChild(saveAndSearchContent);

        saveAndSearchBtn.addEventListener('mouseenter', () => {
            saveAndSearchBtn.style.transform = 'translateY(-2px)';
            saveAndSearchBtn.style.boxShadow = '0 4px 8px rgba(0, 161, 214, 0.3)';
        });

        saveAndSearchBtn.addEventListener('mouseleave', () => {
            saveAndSearchBtn.style.transform = 'translateY(0)';
            saveAndSearchBtn.style.boxShadow = 'none';
        });

        saveAndSearchBtn.addEventListener('click', () => {
            performSearch(true);
        });

        buttonContainer.appendChild(saveOnlyBtn);
        buttonContainer.appendChild(searchOnlyBtn);
        buttonContainer.appendChild(saveAndSearchBtn);
        panel.appendChild(buttonContainer);

        // 配置管理区域
        const configManagement = document.createElement('div');
        configManagement.style.marginTop = '20px';
        configManagement.style.paddingTop = '15px';
        configManagement.style.borderTop = '1px solid #eee';

        const configTitle = document.createElement('h4');
        configTitle.textContent = '配置管理';
        configTitle.style.marginBottom = '10px';
        configTitle.style.fontSize = '14px';
        configManagement.appendChild(configTitle);

        const managementButtons = document.createElement('div');
        managementButtons.style.display = 'flex';
        managementButtons.style.gap = '10px';
        managementButtons.style.flexWrap = 'wrap';

        // 查看所有配置按钮
        const viewAllConfigsBtn = document.createElement('button');
        viewAllConfigsBtn.type = 'button';
        viewAllConfigsBtn.textContent = '查看所有配置';
        viewAllConfigsBtn.style.padding = '6px 12px';
        viewAllConfigsBtn.style.backgroundColor = '#6c757d';
        viewAllConfigsBtn.style.color = 'white';
        viewAllConfigsBtn.style.border = 'none';
        viewAllConfigsBtn.style.borderRadius = '4px';
        viewAllConfigsBtn.style.cursor = 'pointer';
        viewAllConfigsBtn.style.fontSize = '12px';
        viewAllConfigsBtn.addEventListener('click', showAllConfigsPanel);

        // 重置配置按钮
        const resetConfigBtn = document.createElement('button');
        resetConfigBtn.type = 'button';
        resetConfigBtn.textContent = '重置配置';
        resetConfigBtn.style.padding = '6px 12px';
        resetConfigBtn.style.backgroundColor = '#ffc107';
        resetConfigBtn.style.color = 'black';
        resetConfigBtn.style.border = 'none';
        resetConfigBtn.style.borderRadius = '4px';
        resetConfigBtn.style.cursor = 'pointer';
        resetConfigBtn.style.fontSize = '12px';
        resetConfigBtn.addEventListener('click', () => {
            if (confirm('确定要重置当前Wiki的搜索配置吗？')) {
                const wikiId = getWikiIdentifier();
                const configKey = `wiki_search_config_${wikiId}`;
                GM_deleteValue(configKey);
                showToast('配置已重置，重新加载页面后生效', 'warning');
                document.body.removeChild(overlay);
                setTimeout(showConfigPanel, 100);
            }
        });

        // 导出配置按钮
        const exportConfigBtn = document.createElement('button');
        exportConfigBtn.type = 'button';
        exportConfigBtn.textContent = '导出配置';
        exportConfigBtn.style.padding = '6px 12px';
        exportConfigBtn.style.backgroundColor = '#17a2b8';
        exportConfigBtn.style.color = 'white';
        exportConfigBtn.style.border = 'none';
        exportConfigBtn.style.borderRadius = '4px';
        exportConfigBtn.style.cursor = 'pointer';
        exportConfigBtn.style.fontSize = '12px';
        exportConfigBtn.addEventListener('click', exportConfig);

        // 导入配置按钮
        const importConfigBtn = document.createElement('button');
        importConfigBtn.type = 'button';
        importConfigBtn.textContent = '导入配置';
        importConfigBtn.style.padding = '6px 12px';
        importConfigBtn.style.backgroundColor = '#28a745';
        importConfigBtn.style.color = 'white';
        importConfigBtn.style.border = 'none';
        importConfigBtn.style.borderRadius = '4px';
        importConfigBtn.style.cursor = 'pointer';
        importConfigBtn.style.fontSize = '12px';
        importConfigBtn.addEventListener('click', importConfig);

        managementButtons.appendChild(viewAllConfigsBtn);
        managementButtons.appendChild(resetConfigBtn);
        managementButtons.appendChild(exportConfigBtn);
        managementButtons.appendChild(importConfigBtn);
        configManagement.appendChild(managementButtons);
        panel.appendChild(configManagement);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '关闭面板';
        closeBtn.style.marginTop = '15px';
        closeBtn.style.width = '100%';
        closeBtn.style.padding = '10px';
        closeBtn.style.backgroundColor = '#f0f0f0';
        closeBtn.style.border = '1px solid #ddd';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '14px';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        panel.appendChild(closeBtn);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // 点击遮罩层关闭面板
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // 阻止表单提交
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // 自动聚焦到搜索框
        setTimeout(() => {
            const searchInput = document.getElementById('search');
            if (searchInput) searchInput.focus();
        }, 100);
    };

    // 收集表单数据
    const collectFormData = () => {
        const form = document.getElementById('wiki-search-form');
        if (!form) return {};

        const formData = {};
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value;
            }
        });

        return formData;
    };

    // 创建表单组
    const createFormGroup = (labelText, name, type, value, placeholder) => {
        const group = document.createElement('div');
        group.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';
        label.htmlFor = name;

        const input = document.createElement('input');
        input.type = type;
        input.id = name;
        input.name = name;
        input.value = value || '';
        input.placeholder = placeholder;
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '4px';
        input.style.boxSizing = 'border-box';

        group.appendChild(label);
        group.appendChild(input);

        return group;
    };

    // 创建下拉选择组
    const createSelectGroup = (labelText, name, options, defaultValue) => {
        const group = document.createElement('div');
        group.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';
        label.htmlFor = name;

        const select = document.createElement('select');
        select.id = name;
        select.name = name;
        select.style.width = '100%';
        select.style.padding = '8px';
        select.style.border = '1px solid #ddd';
        select.style.borderRadius = '4px';
        select.style.boxSizing = 'border-box';
        select.style.backgroundColor = 'white';

        options.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            if (option.value === defaultValue) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });

        group.appendChild(label);
        group.appendChild(select);

        return group;
    };

    // 执行搜索
    const performSearch = (saveConfig = false) => {
        const form = document.getElementById('wiki-search-form');
        if (!form) return;

        const formData = collectFormData();

        // 检查搜索关键词是否为空
        if (!formData.search || formData.search.trim() === '') {
            showToast('请输入搜索关键词！', 'error');
            const searchInput = document.getElementById('search');
            if (searchInput) searchInput.focus();
            return;
        }

        // 保存配置（如果请求）
        if (saveConfig) {
            saveWikiConfig(formData);
            showToast('配置已保存，正在搜索...', 'success');
        }

        const params = new URLSearchParams();

        // 收集所有参数
        for (let [key, value] of Object.entries(formData)) {
            if (value !== undefined && value !== null && value.toString().trim() !== '') {
                params.append(key, value);
            }
        }

        // 构建搜索URL
        const currentUrl = new URL(window.location.href);
        const wikiBase = currentUrl.origin + currentUrl.pathname.split('/').slice(0, -1).join('/');

        const searchUrl = `${wikiBase}/index.php?title=特殊:搜索&action=query&${params.toString()}`;

        // 延迟跳转以显示提示
        setTimeout(() => {
            window.location.href = searchUrl;
        }, 500);
    };

    // 显示所有Wiki配置的面板
    const showAllConfigsPanel = () => {
        const allConfigs = getAllWikiConfigs();

        const configPanel = document.createElement('div');
        configPanel.style.position = 'fixed';
        configPanel.style.top = '50%';
        configPanel.style.left = '50%';
        configPanel.style.transform = 'translate(-50%, -50%)';
        configPanel.style.backgroundColor = 'white';
        configPanel.style.padding = '20px';
        configPanel.style.borderRadius = '8px';
        configPanel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        configPanel.style.width = '600px';
        configPanel.style.maxWidth = '90%';
        configPanel.style.maxHeight = '80vh';
        configPanel.style.overflowY = 'auto';
        configPanel.style.zIndex = '10001';

        const title = document.createElement('h3');
        title.textContent = '所有Wiki搜索配置';
        title.style.marginTop = '0';
        configPanel.appendChild(title);

        if (Object.keys(allConfigs).length === 0) {
            const noConfigs = document.createElement('p');
            noConfigs.textContent = '暂无保存的Wiki配置';
            noConfigs.style.textAlign = 'center';
            noConfigs.style.padding = '20px';
            noConfigs.style.color = '#666';
            configPanel.appendChild(noConfigs);
        } else {
            const configList = document.createElement('div');

            Object.entries(allConfigs).forEach(([wikiId, config]) => {
                const configItem = document.createElement('div');
                configItem.style.padding = '10px';
                configItem.style.marginBottom = '10px';
                configItem.style.border = '1px solid #ddd';
                configItem.style.borderRadius = '4px';

                const wikiTitle = document.createElement('h4');
                wikiTitle.textContent = `Wiki: ${wikiId}`;
                wikiTitle.style.marginTop = '0';
                wikiTitle.style.marginBottom = '8px';
                configItem.appendChild(wikiTitle);

                const configDetails = document.createElement('div');
                configDetails.style.fontSize = '12px';
                configDetails.style.color = '#666';

                if (config.search) {
                    const detail = document.createElement('div');
                    detail.textContent = `关键词: ${config.search}`;
                    detail.style.fontWeight = 'bold';
                    configDetails.appendChild(detail);
                }

                if (config.limit) {
                    const detail = document.createElement('div');
                    detail.textContent = `数量: ${config.limit}条`;
                    configDetails.appendChild(detail);
                }

                if (config.sort) {
                    const sortLabels = {
                        'relevance': '相关性排序',
                        'just_match': '精确匹配',
                        'create_timestamp_desc': '创建时间降序',
                        'last_edit_desc': '最后编辑时间降序'
                    };
                    const detail = document.createElement('div');
                    detail.textContent = `排序: ${sortLabels[config.sort] || config.sort}`;
                    configDetails.appendChild(detail);
                }

                const actionButtons = document.createElement('div');
                actionButtons.style.marginTop = '10px';
                actionButtons.style.display = 'flex';
                actionButtons.style.gap = '10px';

                const loadBtn = document.createElement('button');
                loadBtn.textContent = '切换到该Wiki';
                loadBtn.style.padding = '4px 8px';
                loadBtn.style.fontSize = '11px';
                loadBtn.style.backgroundColor = '#17a2b8';
                loadBtn.style.color = 'white';
                loadBtn.style.border = 'none';
                loadBtn.style.borderRadius = '3px';
                loadBtn.style.cursor = 'pointer';
                loadBtn.addEventListener('click', () => {
                    if (getWikiIdentifier() === wikiId) {
                        showToast('已在当前Wiki，请重新打开配置面板', 'info');
                    } else {
                        window.location.href = `https://wiki.biligame.com/${wikiId}/`;
                    }
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '删除配置';
                deleteBtn.style.padding = '4px 8px';
                deleteBtn.style.fontSize = '11px';
                deleteBtn.style.backgroundColor = '#dc3545';
                deleteBtn.style.color = 'white';
                deleteBtn.style.border = 'none';
                deleteBtn.style.borderRadius = '3px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`确定要删除 ${wikiId} Wiki 的搜索配置吗？`)) {
                        const configKey = `wiki_search_config_${wikiId}`;
                        GM_deleteValue(configKey);
                        document.body.removeChild(configPanel);
                        showAllConfigsPanel();
                        showToast('配置已删除', 'success');
                    }
                });

                actionButtons.appendChild(loadBtn);
                actionButtons.appendChild(deleteBtn);

                configItem.appendChild(configDetails);
                configItem.appendChild(actionButtons);
                configList.appendChild(configItem);
            });

            configPanel.appendChild(configList);
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.marginTop = '15px';
        closeBtn.style.width = '100%';
        closeBtn.style.padding = '10px';
        closeBtn.style.backgroundColor = '#f0f0f0';
        closeBtn.style.border = '1px solid #ddd';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(configPanel);
        });

        configPanel.appendChild(closeBtn);
        document.body.appendChild(configPanel);
    };

    // 显示Toast提示
    const showToast = (message, type = 'info') => {
        const existingToast = document.querySelector('.wiki-search-toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }

        const toast = document.createElement('div');
        toast.className = 'wiki-search-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '10002';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.fontSize = '14px';
        toast.style.transition = 'all 0.3s ease';
        toast.style.opacity = '0';

        switch(type) {
            case 'success':
                toast.style.backgroundColor = '#28a745';
                toast.style.color = 'white';
                break;
            case 'error':
                toast.style.backgroundColor = '#dc3545';
                toast.style.color = 'white';
                break;
            case 'warning':
                toast.style.backgroundColor = '#ffc107';
                toast.style.color = 'black';
                break;
            default:
                toast.style.backgroundColor = '#333';
                toast.style.color = 'white';
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.bottom = '30px';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.bottom = '20px';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    };

    // 导出配置
    const exportConfig = () => {
        const wikiId = getWikiIdentifier();
        const configKey = `wiki_search_config_${wikiId}`;
        const config = GM_getValue(configKey, null);

        if (!config) {
            showToast('当前Wiki没有保存的配置', 'warning');
            return;
        }

        const configStr = JSON.stringify(config, null, 2);
        const blob = new Blob([configStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${wikiId}_wiki_search_config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('配置已导出为JSON文件', 'success');
    };

    // 导入配置
    const importConfig = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const config = JSON.parse(event.target.result);

                    if (typeof config !== 'object' || config === null) {
                        throw new Error('无效的配置文件格式');
                    }

                    const wikiId = getWikiIdentifier();
                    const configKey = `wiki_search_config_${wikiId}`;
                    GM_setValue(configKey, config);

                    showToast('配置已导入，请重新打开配置面板查看', 'success');

                    const overlay = document.getElementById('wiki-search-overlay');
                    if (overlay) {
                        document.body.removeChild(overlay);
                        setTimeout(showConfigPanel, 100);
                    }
                } catch (error) {
                    showToast(`导入失败: ${error.message}`, 'error');
                }
            };

            reader.readAsText(file);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    // 初始化
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createFloatButton);
        } else {
            createFloatButton();
        }

        if (window.location.href.includes('title=特殊:搜索')) {
            setTimeout(() => {
                autoFillSearchInput();
            }, 1000);
        }

        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                showConfigPanel();
            }
        });
    };

    // 自动填充搜索输入框
    const autoFillSearchInput = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');

        if (searchParam) {
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput && !searchInput.value) {
                searchInput.value = searchParam;
            }
        }
    };

    // 启动脚本
    init();
})();
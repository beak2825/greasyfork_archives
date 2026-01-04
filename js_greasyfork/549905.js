// ==UserScript==
// @name         基于多维表格的CODE申请 + 达人ACA判断
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  数据源全面迁移至飞书多维表格
// @author       Gemini
// @match        https://ads.tiktok.com/i18n/gmv-max/manage-analyze*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @connect      ads.tiktok.com
// @connect      1170731839.workers.dev
// @connect      feishu-token-proxy.1170731839.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/549905/%E5%9F%BA%E4%BA%8E%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E7%9A%84CODE%E7%94%B3%E8%AF%B7%20%2B%20%E8%BE%BE%E4%BA%BAACA%E5%88%A4%E6%96%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/549905/%E5%9F%BA%E4%BA%8E%E5%A4%9A%E7%BB%B4%E8%A1%A8%E6%A0%BC%E7%9A%84CODE%E7%94%B3%E8%AF%B7%20%2B%20%E8%BE%BE%E4%BA%BAACA%E5%88%A4%E6%96%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------- 配置区 -----------------------------
    // 当只提供了知识库(Wiki)链接时，请填写其token；脚本会自动解析出实际的 bitable obj_token。
    const FEISHU_WIKI_TOKEN = 'Vj2Hws5zpiSkOjkJ1APcZAVWnWc';
    // 若你已确认 bitable app_token，可直接填写；否则留空，脚本会通过 FEISHU_WIKI_TOKEN 自动解析。
    let FEISHU_APP_TOKEN = '';
    // 多表支持：将需要处理的表ID放入列表（字段与类型一致）
    const FEISHU_TABLE_IDS = [
        'tbl250NUuWf8b8EI',
        'tblTfjCGYnHUBW2I'
    ];

    // 电子表格配置 - 支持多张表格（已注释）
    // const FEISHU_SHEET_CONFIGS = [
    //     {
    //         name: '表格1',
    //         wikiToken: 'HCRqwYpUtiJXJwkdC69c8oL4nWh', // 第一个表格的wiki token
    //         sheetId: 'a0MHtl', // 工作表ID
    //         spreadsheetToken: '' // 解析后的电子表格token
    //     },
    //     {
    //         name: '表格2',
    //         wikiToken: 'HCRqwYpUtiJXJwkdC69c8oL4nWh', // 第二个表格的wiki token（相同）
    //         sheetId: '398ba7', // 第二个表格的工作表ID
    //         spreadsheetToken: '' // 解析后的电子表格token
    //     }
    // ];

    // 多维表格配置 - 支持多个表格（每个月一个表格）
    // 每个配置包含：表格名称、app_token（或wiki_token用于解析）、table_id、字段名称
    const FEISHU_BITABLE_CONFIGS = [
        {
            name: '2025年1月',
            wikiToken: '', // 可选：如果提供wiki_token，会自动解析app_token
            appToken: '', // 可选：如果直接提供app_token，优先使用
            tableId: 'tblXXXXXXXXXXXXXX', // 多维表格ID
            fields: {
                boostcode: 'boostcode', // CODE码字段名
                status: '授权状态', // 授权状态字段名（单选字段）
                remark: '备注' // 备注字段名
            }
        }
        // 可以添加更多月份的表格配置
        // {
        //     name: '2025年2月',
        //     wikiToken: '',
        //     appToken: '',
        //     tableId: 'tblYYYYYYYYYYYYYY',
        //     fields: {
        //         boostcode: 'boostcode',
        //         status: '授权状态',
        //         remark: '备注'
        //     }
        // }
    ];

    const CODE_COLUMN = 'N'; // CODE码列
    const STATUS_COLUMN = 'Q'; // 授权状态列（下拉：是/否）
    const REMARK_COLUMN = 'P'; // 备注列
    const BATCH_SIZE = 30; // 批量处理大小

    const TOKEN_PROXY_URL = 'https://feishu-token-proxy.1170731839.workers.dev/';

    // TikTok 查询固定参数（来自页面URL）
    const ADS_PARAMS = {
        aadvid: '7457858571813011457',
        oec_seller_id: '7496000925492218350',
        bc_id: '7102251331783507970'
    };

    // ----------------------------- 状态变量 -----------------------------
    let feishuAccessToken = null;
    const processedUsernames = new Set();
    const STORAGE_KEY_BITABLE_CONFIGS = 'feishu_bitable_configs';

    // ----------------------------- 样式与UI -----------------------------
    GM_addStyle(`
        #aca-checker-button {
            position: fixed;
            bottom: 20px;
            right: 24px;
            z-index: 999999;
            padding: 12px 16px;
            font-size: 14px;
            background-color: #10b981;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
        }
        #aca-checker-button:hover:not([disabled]) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        #aca-checker-button[disabled] { opacity: 0.6; cursor: not-allowed; }

        /* 电子表格按钮样式（已注释）
        #sheet-processor-button {
            position: fixed;
            bottom: 80px;
            right: 24px;
            z-index: 999999;
            padding: 10px 14px;
            font-size: 14px;
            background-color: #3b82f6;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        #sheet-processor-button[disabled] { opacity: 0.6; cursor: not-allowed; }
        */

        #bitable-processor-button {
            position: fixed;
            bottom: 88px;
            right: 24px;
            z-index: 999999;
            padding: 12px 16px;
            font-size: 14px;
            background-color: #8b5cf6;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
        }
        #bitable-processor-button:hover:not([disabled]) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        #bitable-processor-button[disabled] { opacity: 0.6; cursor: not-allowed; }

        #bitable-config-button {
            position: fixed;
            bottom: 156px;
            right: 24px;
            z-index: 999999;
            padding: 12px 16px;
            font-size: 14px;
            background-color: #f59e0b;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
        }
        #bitable-config-button:hover:not([disabled]) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        #aca-table-select-modal,
        #code-table-select-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000001;
            display: none;
            align-items: center;
            justify-content: center;
        }

        #aca-table-select-modal.show,
        #code-table-select-modal.show {
            display: flex;
        }

        #aca-table-select-content,
        #code-table-select-content {
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        #aca-table-select-content h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            color: #333;
        }

        .table-select-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 8px;
            background: #f5f5f5;
            border-radius: 6px;
            border: 2px solid transparent;
            cursor: pointer;
        }

        .table-select-item:hover {
            background: #e5e7eb;
        }

        .table-select-item.selected {
            border-color: #10b981;
            background: #d1fae5;
        }

        .table-select-item input[type="checkbox"] {
            margin-right: 12px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .table-select-item-info {
            flex: 1;
        }

        .table-select-item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }

        .table-select-item-detail {
            font-size: 12px;
            color: #666;
        }

        .aca-select-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            justify-content: flex-end;
        }

        .aca-select-actions button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        #bitable-config-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000000;
            display: none;
            align-items: center;
            justify-content: center;
        }

        #bitable-config-modal.show {
            display: flex;
        }

        #bitable-config-content {
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        #bitable-config-content h3 {
            margin: 0 0 16px 0;
            font-size: 18px;
            color: #333;
        }

        .config-form-group {
            margin-bottom: 16px;
        }

        .config-form-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            color: #555;
            font-weight: 500;
        }

        .config-form-group input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .config-form-group input:focus {
            outline: none;
            border-color: #8b5cf6;
        }

        .config-table-list {
            margin-top: 20px;
        }

        .config-table-item {
            background: #f5f5f5;
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }

        .config-table-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .config-table-item-name {
            font-weight: 600;
            color: #333;
        }

        .config-table-item-actions {
            display: flex;
            gap: 8px;
        }

        .config-table-item-actions button {
            padding: 4px 8px;
            font-size: 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-delete {
            background: #ef4444;
            color: white;
        }

        .btn-delete:hover {
            background: #dc2626;
        }

        .config-table-item-info {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
        }

        .config-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            justify-content: flex-end;
        }

        .config-actions button {
            padding: 8px 16px;
            font-size: 14px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn-primary {
            background: #8b5cf6;
            color: white;
        }

        .btn-primary:hover {
            background: #7c3aed;
        }

        .btn-secondary {
            background: #e5e7eb;
            color: #333;
        }

        .btn-secondary:hover {
            background: #d1d5db;
        }

        .config-help {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
            padding: 8px;
            background: #f0f9ff;
            border-radius: 4px;
        }

    `);

    // ----------------------------- 配置管理：存储和读取 -----------------------------
    function saveBitableConfigs(configs) {
        try {
            localStorage.setItem(STORAGE_KEY_BITABLE_CONFIGS, JSON.stringify(configs));
            logLine(`已保存 ${configs.length} 个多维表格配置`);
        } catch (e) {
            logLine(`保存配置失败：${String(e)}`);
        }
    }

    function loadBitableConfigs() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_BITABLE_CONFIGS);
            if (saved) {
                const configs = JSON.parse(saved);
                logLine(`已加载 ${configs.length} 个多维表格配置`);
                return configs;
            }
        } catch (e) {
            logLine(`加载配置失败：${String(e)}`);
        }
        return [];
    }

    // ----------------------------- 链接解析：从飞书链接提取信息 -----------------------------
    function parseBitableUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(p => p);

            let appToken = '';
            let tableId = urlObj.searchParams.get('table') || '';
            let wikiToken = '';

            // 解析 app_token
            // 格式1: https://xxx.feishu.cn/base/AppToken?table=TableId
            if (pathParts.includes('base') && pathParts.length > 1) {
                const baseIndex = pathParts.indexOf('base');
                if (baseIndex >= 0 && pathParts[baseIndex + 1]) {
                    appToken = pathParts[baseIndex + 1];
                }
            }
            // 格式2: https://xxx.feishu.cn/wiki/WikiToken?table=TableId
            else if (pathParts.includes('wiki')) {
                const wikiIndex = pathParts.indexOf('wiki');
                if (wikiIndex >= 0 && pathParts[wikiIndex + 1]) {
                    // 尝试从路径中提取wiki token
                    wikiToken = pathParts[wikiIndex + 1];
                }
                // wiki链接的app_token需要通过API解析，这里先标记
                appToken = '';
            }

            return {
                appToken: appToken,
                tableId: tableId,
                wikiToken: wikiToken,
                isWikiLink: pathParts.includes('wiki')
            };
        } catch (e) {
            logLine(`解析链接失败：${String(e)}`);
            return { appToken: '', tableId: '', wikiToken: '', isWikiLink: false };
        }
    }

    // ----------------------------- UI：配置管理弹窗 -----------------------------
    function createConfigModal() {
        const modal = document.createElement('div');
        modal.id = 'bitable-config-modal';

        const content = document.createElement('div');
        content.id = 'bitable-config-content';

        content.innerHTML = `
            <h3>多维表格配置管理</h3>
            <div class="config-form-group">
                <label>表格名称（如：2025年1月）</label>
                <input type="text" id="config-table-name" placeholder="例如：2025年1月">
            </div>
            <div class="config-form-group">
                <label>多维表格链接</label>
                <input type="text" id="config-table-url" placeholder="https://xxx.feishu.cn/base/AppToken?table=TableId">
                <div class="config-help">
                    支持两种格式：<br>
                    1. base链接：https://xxx.feishu.cn/base/AppToken?table=TableId<br>
                    2. wiki链接：https://xxx.feishu.cn/wiki/WikiToken?table=TableId（会自动提取wiki token）
                </div>
            </div>
            <div class="config-form-group">
                <label>Wiki Token（可选，仅wiki链接需要）</label>
                <input type="text" id="config-wiki-token" placeholder="wiki链接会自动填充，base链接留空">
            </div>
            <div class="config-form-group">
                <label>字段名称配置</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                    <input type="text" id="config-field-boostcode" placeholder="boostcode字段名" value="boostcode">
                    <input type="text" id="config-field-status" placeholder="授权状态字段名" value="授权状态">
                    <input type="text" id="config-field-remark" placeholder="备注字段名" value="备注">
                </div>
            </div>
            <div class="config-actions">
                <button class="btn-secondary" id="config-cancel-btn">取消</button>
                <button class="btn-primary" id="config-add-btn">添加表格</button>
            </div>
            <div class="config-table-list">
                <h4 style="margin: 20px 0 12px 0; font-size: 16px;">已配置的表格</h4>
                <div id="config-table-list-content"></div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 绑定事件监听器
        const urlInput = content.querySelector('#config-table-url');
        if (urlInput) {
            urlInput.addEventListener('blur', parseBitableUrlInput);
        }

        const cancelBtn = content.querySelector('#config-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeBitableConfigModal);
        }

        const addBtn = content.querySelector('#config-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', addBitableConfig);
        }

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBitableConfigModal();
            }
        });

        refreshConfigList();
    }

    function parseBitableUrlInput() {
        const urlInput = document.getElementById('config-table-url');
        const wikiTokenInput = document.getElementById('config-wiki-token');

        if (!urlInput || !wikiTokenInput) return;

        const url = urlInput.value.trim();
        if (!url) return;

        try {
            const parsed = parseBitableUrl(url);
            // 如果解析到wikiToken且输入框为空，自动填充
            if (parsed.wikiToken && !wikiTokenInput.value.trim()) {
                wikiTokenInput.value = parsed.wikiToken;
                logLine(`已自动填充wiki token: ${parsed.wikiToken.slice(0, 10)}...`);
            }
            // 如果解析到appToken，显示提示
            if (parsed.appToken) {
                logLine(`已解析app token: ${parsed.appToken.slice(0, 10)}...`);
            }
            if (parsed.tableId) {
                logLine(`已解析table ID: ${parsed.tableId}`);
            }
        } catch (e) {
            // 忽略解析错误
        }
    }

    function showBitableConfigModal() {
        const modal = document.getElementById('bitable-config-modal');
        if (modal) {
            modal.classList.add('show');
            refreshConfigList();
        }
    }

    function closeBitableConfigModal() {
        const modal = document.getElementById('bitable-config-modal');
        if (modal) {
            modal.classList.remove('show');
            // 清空输入框
            document.getElementById('config-table-name').value = '';
            document.getElementById('config-table-url').value = '';
            document.getElementById('config-wiki-token').value = '';
            document.getElementById('config-field-boostcode').value = 'boostcode';
            document.getElementById('config-field-status').value = '授权状态';
            document.getElementById('config-field-remark').value = '备注';
        }
    }

    function addBitableConfig() {
        const name = document.getElementById('config-table-name').value.trim();
        const url = document.getElementById('config-table-url').value.trim();
        const wikiToken = document.getElementById('config-wiki-token').value.trim();
        const boostcodeField = document.getElementById('config-field-boostcode').value.trim() || 'boostcode';
        const statusField = document.getElementById('config-field-status').value.trim() || '授权状态';
        const remarkField = document.getElementById('config-field-remark').value.trim() || '备注';

        if (!name) {
            alert('请输入表格名称');
            return;
        }

        if (!url) {
            alert('请输入多维表格链接');
            return;
        }

        const parsed = parseBitableUrl(url);
        if (!parsed.tableId) {
            alert('无法从链接中解析出table ID，请检查链接格式');
            return;
        }

        // 如果用户没有输入wikiToken，尝试从URL中提取
        const finalWikiToken = wikiToken || parsed.wikiToken || '';

        if (parsed.isWikiLink && !parsed.appToken && !finalWikiToken) {
            alert('Wiki链接需要提供wiki token，请在"Wiki Token"输入框中填写');
            return;
        }

        const configs = loadBitableConfigs();

        // 检查是否已存在同名配置
        if (configs.some(c => c.name === name)) {
            if (!confirm(`表格"${name}"已存在，是否覆盖？`)) {
                return;
            }
            // 删除旧配置
            configs.splice(configs.findIndex(c => c.name === name), 1);
        }

        const newConfig = {
            name: name,
            url: url,
            wikiToken: finalWikiToken,
            appToken: parsed.appToken || '',
            tableId: parsed.tableId,
            fields: {
                boostcode: boostcodeField,
                status: statusField,
                remark: remarkField
            }
        };

        configs.push(newConfig);
        saveBitableConfigs(configs);

        logLine(`已添加配置：${name} (tableId=${parsed.tableId})`);

        // 清空输入框
        document.getElementById('config-table-name').value = '';
        document.getElementById('config-table-url').value = '';
        document.getElementById('config-wiki-token').value = '';

        refreshConfigList();
    }

    function deleteBitableConfig(name) {
        if (!confirm(`确定要删除表格"${name}"的配置吗？`)) {
            return;
        }

        const configs = loadBitableConfigs();
        const index = configs.findIndex(c => c.name === name);
        if (index >= 0) {
            configs.splice(index, 1);
            saveBitableConfigs(configs);
            logLine(`已删除配置：${name}`);
            refreshConfigList();
        }
    }

    function refreshConfigList() {
        const container = document.getElementById('config-table-list-content');
        if (!container) return;

        const configs = loadBitableConfigs();

        if (configs.length === 0) {
            container.innerHTML = '<div style="color: #999; padding: 20px; text-align: center;">暂无配置，请添加表格</div>';
            return;
        }

        container.innerHTML = configs.map((config, index) => `
            <div class="config-table-item" data-config-index="${index}">
                <div class="config-table-item-header">
                    <div class="config-table-item-name">${escapeHtml(config.name)}</div>
                    <div class="config-table-item-actions">
                        <button class="btn-delete" data-config-name="${escapeHtml(config.name)}">删除</button>
                    </div>
                </div>
                <div class="config-table-item-info">
                    <div>表格ID: ${escapeHtml(config.tableId)}</div>
                    <div>App Token: ${config.appToken ? escapeHtml(config.appToken.slice(0, 10)) + '...' : '未设置'}</div>
                    <div>字段: boostcode="${escapeHtml(config.fields.boostcode)}", 授权状态="${escapeHtml(config.fields.status)}", 备注="${escapeHtml(config.fields.remark)}"</div>
                </div>
            </div>
        `).join('');

        // 为所有删除按钮绑定事件
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const configName = this.getAttribute('data-config-name');
                deleteBitableConfig(configName);
            });
        });
    }

    // 辅助函数：转义HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function ensureUI() {
        if (!document.getElementById('aca-checker-button')) {
            const btn = document.createElement('button');
            btn.id = 'aca-checker-button';
            btn.textContent = '检查ACA并回写飞书(多表)';
            btn.addEventListener('click', onManualTrigger);
            document.body.appendChild(btn);
        }

        // 电子表格按钮创建（已注释）
        // if (!document.getElementById('sheet-processor-button')) {
        //     const sheetBtn = document.createElement('button');
        //     sheetBtn.id = 'sheet-processor-button';
        //     sheetBtn.textContent = '处理电子表格CODE码(多表)';
        //     sheetBtn.addEventListener('click', onSheetProcessorTrigger);
        //     document.body.appendChild(sheetBtn);
        // }

        if (!document.getElementById('bitable-processor-button')) {
            const bitableBtn = document.createElement('button');
            bitableBtn.id = 'bitable-processor-button';
            bitableBtn.textContent = '处理多维表格CODE码(多表)';
            bitableBtn.addEventListener('click', onBitableProcessorTrigger);
            document.body.appendChild(bitableBtn);
        }

        if (!document.getElementById('bitable-config-button')) {
            const configBtn = document.createElement('button');
            configBtn.id = 'bitable-config-button';
            configBtn.textContent = '配置多维表格';
            configBtn.addEventListener('click', showBitableConfigModal);
            document.body.appendChild(configBtn);
        }

        // 创建配置弹窗
        if (!document.getElementById('bitable-config-modal')) {
            createConfigModal();
        }

        // 创建ACA表格选择弹窗
        if (!document.getElementById('aca-table-select-modal')) {
            createACATableSelectModal();
        }

        // 创建CODE码表格选择弹窗
        if (!document.getElementById('code-table-select-modal')) {
            createCodeTableSelectModal();
        }

    }

    function logLine(message) {
        console.log('[ACA检查器]', message);
    }

    function setBusy(isBusy, progress = '', buttonId = 'aca-checker-button') {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.disabled = isBusy;
            if (isBusy) {
                btn.textContent = progress || '处理中…';
            } else {
                if (buttonId === 'aca-checker-button') {
                    btn.textContent = '检查ACA并回写飞书(多表)';
                }
                // 电子表格按钮文本（已注释）
                // else if (buttonId === 'sheet-processor-button') {
                //     btn.textContent = '处理电子表格CODE码(多表)';
                // }
                else if (buttonId === 'bitable-processor-button') {
                    btn.textContent = '处理多维表格CODE码(多表)';
                }
            }
        }
    }

    // ----------------------------- 公共工具 -----------------------------
    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getLast7DaysRange() {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { st: formatDate(start), et: formatDate(end) };
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    }

    // 统一标准化“用户名”字段为字符串
    function normalizeUsername(raw) {
        try {
            if (raw == null) return '';
            if (typeof raw === 'string') return raw.trim();
            if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw).trim();
            if (Array.isArray(raw)) {
                for (const item of raw) {
                    if (typeof item === 'string') {
                        const s = item.trim();
                        if (s) return s;
                    } else if (item && typeof item === 'object') {
                        const s = item.name ?? item.title ?? item.text ?? item.value ?? '';
                        if (Array.isArray(s)) {
                            const joined = s.map(v => (typeof v === 'string' ? v : (v?.text ?? ''))).join('').trim();
                            if (joined) return joined;
                        } else {
                            const str = String(s || '').trim();
                            if (str) return str;
                        }
                    }
                }
                return String(raw[0] ?? '').trim();
            }
            if (typeof raw === 'object') {
                const first = raw.name ?? raw.title ?? raw.text ?? raw.value ?? '';
                if (Array.isArray(first)) {
                    const joined = first.map(v => (typeof v === 'string' ? v : (v?.text ?? ''))).join('').trim();
                    return joined;
                }
                return String(first || '').trim();
            }
            return String(raw).trim();
        } catch (e) {
            return '';
        }
    }

    function getCsrfToken() {
        const token = getCookie('csrftoken') || getCookie('tt_csrf_token') || getCookie('csrfToken') || '';
        if (!token) {
            logLine('警告：未从Cookie中获取到 x-csrftoken，接口可能被拒绝');
        }
        return token;
    }

    // ----------------------------- 飞书鉴权 -----------------------------
    async function getFeishuToken() {
        if (feishuAccessToken) return feishuAccessToken;
        logLine('获取飞书 Access Token…');
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: TOKEN_PROXY_URL,
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.tenant_access_token) {
                            feishuAccessToken = data.tenant_access_token;
                            logLine('飞书Token获取成功');
                            resolve(feishuAccessToken);
                        } else {
                            logLine(`飞书Token响应异常：HTTP ${response.status}，内容：${text.slice(0,200)}`);
                            reject(new Error('响应中无 tenant_access_token'));
                        }
                    } catch (e) {
                        logLine(`飞书Token解析失败：${String(e)}`);
                        reject(e);
                    }
                },
                onerror: function(err) {
                    logLine(`飞书Token请求失败：${String(err)}`);
                    reject(err);
                }
            });
        });
    }

    // ----------------------------- 通过Wiki节点解析bitable实际token -----------------------------
    async function resolveBitableAppTokenFromWiki() {
        if (FEISHU_APP_TOKEN) return FEISHU_APP_TOKEN;
        if (!FEISHU_WIKI_TOKEN) {
            logLine('未配置 FEISHU_WIKI_TOKEN，无法解析 bitable token');
            return '';
        }
        const token = await getFeishuToken();
        const url = `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(FEISHU_WIKI_TOKEN)}`;
        logLine('调用Wiki get_node解析实际文档token…');
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const node = data.data?.node;
                            const objType = node?.obj_type;
                            const objToken = node?.obj_token || '';
                            logLine(`Wiki解析结果 obj_type=${objType} obj_token=${objToken ? objToken.slice(0,6)+'…' : ''}`);
                            if (objType === 'bitable' && objToken) {
                                FEISHU_APP_TOKEN = objToken; // 作为多维表 app_token 使用
                                resolve(FEISHU_APP_TOKEN);
                            } else {
                                logLine('解析失败：obj_type 非 bitable 或缺少 obj_token');
                                resolve('');
                            }
                        } else {
                            logLine(`Wiki get_node 失败 code=${data.code} http=${response.status}`);
                            resolve('');
                        }
                    } catch (e) {
                        logLine(`Wiki get_node 解析失败：${String(e)}`);
                        resolve('');
                    }
                },
                onerror: function(err) { logLine(`Wiki get_node 请求失败：${String(err)}`); resolve(''); }
            });
        });
    }

    async function ensureFeishuAppToken() {
        if (FEISHU_APP_TOKEN) return FEISHU_APP_TOKEN;
        const appToken = await resolveBitableAppTokenFromWiki();
        if (!appToken) throw new Error('无法获取 bitable app_token');
        return appToken;
    }

    // ----------------------------- 多维表格：解析app_token（按配置） -----------------------------
    async function resolveBitableAppTokenFromWikiForConfig(config) {
        if (config.appToken) return config.appToken;
        if (!config.wikiToken) {
            logLine(`未配置 ${config.name} 的 wikiToken，无法解析 app_token`);
            return '';
        }
        const token = await getFeishuToken();
        const url = `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(config.wikiToken)}`;
        logLine(`调用Wiki get_node解析${config.name}多维表格token…`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const node = data.data?.node;
                            const objType = node?.obj_type;
                            const objToken = node?.obj_token || '';
                            logLine(`${config.name} Wiki解析结果 obj_type=${objType} obj_token=${objToken ? objToken.slice(0,6)+'…' : ''}`);
                            if (objType === 'bitable' && objToken) {
                                config.appToken = objToken;
                                resolve(config.appToken);
                            } else {
                                logLine(`${config.name} 解析失败：obj_type 非 bitable 或缺少 obj_token`);
                                resolve('');
                            }
                        } else {
                            logLine(`${config.name} Wiki get_node 失败 code=${data.code} http=${response.status}`);
                            resolve('');
                        }
                    } catch (e) {
                        logLine(`${config.name} Wiki get_node 解析失败：${String(e)}`);
                        resolve('');
                    }
                },
                onerror: function(err) { logLine(`${config.name} Wiki get_node 请求失败：${String(err)}`); resolve(''); }
            });
        });
    }

    async function ensureBitableAppTokenForConfig(config) {
        if (config.appToken) return config.appToken;
        const appToken = await resolveBitableAppTokenFromWikiForConfig(config);
        if (!appToken) throw new Error(`无法获取 ${config.name} 的 app_token`);
        return appToken;
    }

    // ----------------------------- 电子表格：解析 spreadsheet_token（已注释） -----------------------------
    /*
    async function resolveSpreadsheetTokenFromWiki(config) {
        if (config.spreadsheetToken) return config.spreadsheetToken;
        if (!config.wikiToken) {
            logLine(`未配置 ${config.name} 的 wikiToken，无法解析 spreadsheet_token`);
            return '';
        }
        const token = await getFeishuToken();
        const url = `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(config.wikiToken)}`;
        logLine(`调用Wiki get_node解析${config.name}电子表格token…`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const node = data.data?.node;
                            const objType = node?.obj_type;
                            const objToken = node?.obj_token || '';
                            logLine(`${config.name} Wiki解析结果 obj_type=${objType} obj_token=${objToken ? objToken.slice(0,6)+'…' : ''}`);
                            if (objType === 'sheet' && objToken) {
                                config.spreadsheetToken = objToken; // 作为电子表格 token 使用
                                resolve(config.spreadsheetToken);
                            } else {
                                logLine(`${config.name} 解析失败：obj_type 非 sheet 或缺少 obj_token`);
                                resolve('');
                            }
                        } else {
                            logLine(`${config.name} Wiki get_node 失败 code=${data.code} http=${response.status}`);
                            resolve('');
                        }
                    } catch (e) {
                        logLine(`${config.name} Wiki get_node 解析失败：${String(e)}`);
                        resolve('');
                    }
                },
                onerror: function(err) { logLine(`${config.name} Wiki get_node 请求失败：${String(err)}`); resolve(''); }
            });
        });
    }

    async function ensureSpreadsheetToken(config) {
        if (config.spreadsheetToken) return config.spreadsheetToken;
        const spreadsheetToken = await resolveSpreadsheetTokenFromWiki(config);
        if (!spreadsheetToken) throw new Error(`无法获取 ${config.name} 的 spreadsheet_token`);
        return spreadsheetToken;
    }
    */

    // ----------------------------- 电子表格：创建筛选条件（已注释） -----------------------------
    /*
    async function createSheetFilter() {
        const token = await getFeishuToken();
        const spreadsheetToken = await ensureSpreadsheetToken();
        const url = `https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/${spreadsheetToken}/sheets/${FEISHU_SHEET_ID}/filter`;

        // 创建筛选：N列不为空
        const payload = {
            range: "A1:Z1000", // 具体范围，不包含工作表ID
            col: CODE_COLUMN, // N列
            condition: {
                filter_type: "text",
                compare_type: "isNotEmpty",
                expected: []
            }
        };

        logLine('创建电子表格筛选：N列不为空…');
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            logLine('电子表格筛选创建成功');
                            resolve(true);
                        } else {
                            logLine(`电子表格筛选创建失败 code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                            resolve(false);
                        }
                    } catch (e) {
                        logLine(`电子表格筛选创建解析失败：${String(e)}`);
                        resolve(false);
                    }
                },
                onerror: function(err) { logLine(`电子表格筛选创建请求失败：${String(err)}`); resolve(false); }
            });
        });
    }
    */

    // ----------------------------- 电子表格：读取筛选后的数据（已注释） -----------------------------
    /*
    async function readFilteredSheetData(config) {
        const token = await getFeishuToken();
        const spreadsheetToken = await ensureSpreadsheetToken(config);

        // 先尝试读取一个较大的范围来获取实际数据行数
        const testRange = `${config.sheetId}!${CODE_COLUMN}2:${STATUS_COLUMN}10000`; // 先尝试10000行
        const testUrl = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values/${testRange}`;

        logLine(`动态读取${config.name}电子表格数据: 工作表ID=${config.sheetId}, 测试范围=${testRange}`);
        logLine(`请求URL: ${testUrl}`);

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: testUrl,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        logLine(`电子表格API响应: HTTP=${response.status}, 响应长度=${text.length}`);
                        logLine(`响应内容: ${text.slice(0, 300)}...`);

                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const values = data.data?.valueRange?.values || [];
                            const filteredRows = [];

                            logLine(`电子表格读取到 ${values.length} 行数据`);

                            // 筛选出N列不为空且Q列为空的记录
                            for (let i = 0; i < values.length; i++) {
                                const row = values[i];
                                // 安全地获取和转换值
                                const codeValue = String(row[0] || ''); // N列（CODE码）
                                const statusValue = String(row[3] || ''); // Q列（授权状态）- 注意：row[3]才是Q列


                                // 检查CODE码不为空
                                const hasCode = codeValue.trim() && codeValue.trim() !== '';

                                if (hasCode) {
                                    const status = statusValue.trim();
                                    let processType = '';
                                    let shouldProcess = false;

                                    if (status === '是') {
                                        processType = '已授权';
                                        shouldProcess = false;
                                    } else if (status === '否') {
                                        processType = '已拒绝';
                                        shouldProcess = false;
                                    } else if (status.includes('IF(')) {
                                        // 公式逻辑：如果N列有CODE码，公式应该返回"是"，所以这些记录实际已授权
                                        processType = '公式计算后为已授权';
                                        shouldProcess = false;
                                    } else if (status === '' || status === 'null' || status === 'undefined') {
                                        processType = '需要处理(空值)';
                                        shouldProcess = true;
                                    } else {
                                        processType = '需要处理(其他)';
                                        shouldProcess = true;
                                    }

                                    // 只处理真正需要处理的记录
                                    if (shouldProcess) {
                                        filteredRows.push({
                                            rowIndex: i + 2, // 实际行号（从第2行开始）
                                            code: codeValue.trim(),
                                            status: status
                                        });
                                    }

                                    if (shouldProcess) {
                                        logLine(`需要处理: 第${i+2}行 CODE="${codeValue.trim()}" STATUS="${status}" [${processType}]`);
                                    }
                                }
                            }

                            logLine(`电子表格筛选到 ${filteredRows.length} 条待处理记录`);
                            resolve(filteredRows);
                        } else {
                            logLine(`电子表格读取失败 code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                            resolve([]);
                        }
                    } catch (e) {
                        logLine(`电子表格读取解析失败：${String(e)}`);
                        resolve([]);
                    }
                },
                onerror: function(err) { logLine(`电子表格读取请求失败：${String(err)}`); resolve([]); }
            });
        });
    }
    */

    // ----------------------------- 飞书：查询 ACA授权 为空的记录（按表） -----------------------------
    async function feishuSearchEmptyACA(config, pageSize = 100) {
        const token = await getFeishuToken();
        // 如果传入的是配置对象，使用配置的appToken；否则使用旧的逻辑
        const appToken = config && config.appToken ? await ensureBitableAppTokenForConfig(config) : await ensureFeishuAppToken();
        const tableId = config && config.tableId ? config.tableId : config; // 兼容旧代码：如果config是字符串，就是tableId
        const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`;
        const payload = {
            filter: {
                conjunction: 'and',
                conditions: [
                    { field_name: 'ACA授权', operator: 'isEmpty', value: [] }
                ]
            },
            page_size: pageSize
        };
        logLine(`查询飞书：表=${tableId} ACA授权为空的记录…`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const items = data.data?.items || [];
                            logLine(`飞书表=${tableId} 查询到 ${items.length} 条待检查记录`);
                            resolve(items);
                        } else {
                            logLine(`飞书查询失败 表=${tableId} code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                            resolve([]);
                        }
                    } catch (e) {
                        logLine(`飞书查询解析失败 表=${tableId}：${String(e)}`);
                        resolve([]);
                    }
                },
                onerror: function(err) { logLine(`飞书查询请求失败 表=${tableId}：${String(err)}`); resolve([]); }
            });
        });
    }

    // ----------------------------- 辅助函数：安全提取字符串值 -----------------------------
    function safeExtractString(value) {
        if (!value) return '';
        if (typeof value === 'string') return value.trim();
        if (Array.isArray(value) && value.length > 0) {
            const firstItem = value[0];
            if (typeof firstItem === 'string') return firstItem.trim();
            if (firstItem && typeof firstItem === 'object') {
                return (firstItem.text || firstItem.name || firstItem.value || String(firstItem)).trim();
            }
            return String(firstItem).trim();
        }
        if (typeof value === 'object') {
            return (value.text || value.name || value.value || String(value)).trim();
        }
        return String(value).trim();
    }

    // ----------------------------- 多维表格：获取表格字段信息 -----------------------------
    async function getBitableTableFields(config) {
        const token = await getFeishuToken();
        const appToken = await ensureBitableAppTokenForConfig(config);
        const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${config.tableId}/fields`;

        logLine(`获取${config.name}多维表格字段信息…`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const fields = data.data?.items || [];
                            logLine(`${config.name}多维表格字段信息：${fields.length}个字段`);
                            resolve(fields);
                        } else {
                            logLine(`获取字段信息失败 code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                            resolve([]);
                        }
                    } catch (e) {
                        logLine(`获取字段信息解析失败：${String(e)}`);
                        resolve([]);
                    }
                },
                onerror: function(err) {
                    logLine(`获取字段信息请求失败：${String(err)}`);
                    resolve([]);
                }
            });
        });
    }

    // ----------------------------- 多维表格：查询待处理的CODE码记录 -----------------------------
    async function feishuBitableSearchCodeRecords(config, pageSize = 500) {
        const token = await getFeishuToken();
        const appToken = await ensureBitableAppTokenForConfig(config);
        const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${config.tableId}/records/search`;

        // 先尝试使用筛选条件查询，如果失败则获取所有记录后手动筛选
        // 查询条件：boostcode不为空，且授权状态为空或未设置
        const payload = {
            filter: {
                conjunction: 'and',
                conditions: [
                    { field_name: config.fields.boostcode, operator: 'isNotEmpty', value: [] }
                ]
            },
            page_size: pageSize
        };

        logLine(`查询${config.name}多维表格：boostcode不为空的记录…`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            const items = data.data?.items || [];
                            const records = [];

                            logLine(`${config.name}多维表格查询到 ${items.length} 条boostcode不为空的记录，开始筛选授权状态为空的记录…`);

                            for (const item of items) {
                                const recordId = item.record_id || item.id;
                                const fields = item.fields || {};

                                // 提取boostcode字段值（使用安全提取函数）
                                const boostcodeField = fields[config.fields.boostcode];
                                const boostcode = safeExtractString(boostcodeField);

                                // 提取当前状态和备注
                                const statusField = fields[config.fields.status];
                                const remarkField = fields[config.fields.remark];

                                let currentStatus = '';
                                if (typeof statusField === 'string') {
                                    currentStatus = statusField.trim();
                                } else if (Array.isArray(statusField) && statusField.length > 0) {
                                    // 单选字段返回的是数组，取第一个元素
                                    const firstItem = statusField[0];
                                    if (typeof firstItem === 'string') {
                                        currentStatus = firstItem.trim();
                                    } else if (firstItem && typeof firstItem === 'object') {
                                        // 可能是对象格式，尝试获取text或name属性
                                        currentStatus = (firstItem.text || firstItem.name || String(firstItem)).trim();
                                    } else {
                                        currentStatus = String(firstItem).trim();
                                    }
                                } else if (statusField != null) {
                                    currentStatus = String(statusField).trim();
                                }

                                let currentRemark = '';
                                if (typeof remarkField === 'string') {
                                    currentRemark = remarkField.trim();
                                } else if (Array.isArray(remarkField) && remarkField.length > 0) {
                                    currentRemark = String(remarkField[0]).trim();
                                } else if (remarkField != null) {
                                    currentRemark = String(remarkField).trim();
                                }

                                // 只处理boostcode不为空且授权状态为空的记录
                                // 授权状态为空：空字符串、null、undefined、空数组
                                const isStatusEmpty = !currentStatus ||
                                    currentStatus === '' ||
                                    currentStatus === 'null' ||
                                    currentStatus === 'undefined' ||
                                    (Array.isArray(statusField) && statusField.length === 0);

                                if (boostcode && recordId && isStatusEmpty) {
                                    records.push({
                                        recordId: recordId,
                                        boostcode: boostcode,
                                        status: currentStatus,
                                        remark: currentRemark
                                    });
                                }
                            }

                            logLine(`${config.name}多维表格筛选到 ${records.length} 条待处理记录（boostcode不为空且授权状态为空）`);
                            resolve(records);
                        } else {
                            logLine(`${config.name}多维表格查询失败 code=${data.code} http=${response.status}`);
                            logLine(`错误详情：${text.slice(0, 500)}`);

                            // 如果是字段验证失败，尝试获取字段信息帮助用户排查
                            if (data.code === 99992402 || (data.msg && data.msg.includes('field'))) {
                                logLine(`可能是字段名不匹配，尝试获取表格字段信息…`);
                                getBitableTableFields(config).then(fields => {
                                    if (fields.length > 0) {
                                        logLine(`表格实际字段列表：`);
                                        fields.forEach(field => {
                                            logLine(`  - ${field.field_name} (类型: ${field.type})`);
                                        });
                                        logLine(`配置的字段名：boostcode="${config.fields.boostcode}", status="${config.fields.status}", remark="${config.fields.remark}"`);
                                    }
                                });
                            }

                            resolve([]);
                        }
                    } catch (e) {
                        logLine(`${config.name}多维表格查询解析失败：${String(e)}`);
                        resolve([]);
                    }
                },
                onerror: function(err) {
                    logLine(`${config.name}多维表格查询请求失败：${String(err)}`);
                    resolve([]);
                }
            });
        });
    }

    // ----------------------------- 多维表格：更新记录授权状态和备注 -----------------------------
    async function feishuBitableUpdateCodeRecord(config, recordId, status, remark = '') {
        const token = await getFeishuToken();
        const appToken = await ensureBitableAppTokenForConfig(config);
        const putUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${config.tableId}/records/${recordId}`;
        const batchUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${config.tableId}/records/batch_update`;

        // 构建更新字段
        const fields = {};
        if (status !== undefined && status !== null) {
            fields[config.fields.status] = status; // 单选字段直接赋值
        }
        if (remark !== undefined && remark !== null) {
            fields[config.fields.remark] = remark; // 文本字段
        }

        const fieldsPayload = { fields: fields };

        // 1) 首选单条 PUT
        const putOk = await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'PUT',
                url: putUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(fieldsPayload),
                onload: function(response) {
                    const text = response.responseText || '';
                    try {
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            resolve(true);
                            return;
                        }
                        logLine(`${config.name}多维表格更新(PUT)失败 recordId=${recordId} code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                        resolve(false);
                    } catch {
                        if (response.status >= 200 && response.status < 300) {
                            logLine(`${config.name}多维表格更新(PUT)返回非JSON但HTTP=${response.status} 视为成功`);
                            resolve(true);
                        } else {
                            logLine(`${config.name}多维表格更新(PUT)解析失败且HTTP非成功：http=${response.status}`);
                            resolve(false);
                        }
                    }
                },
                onerror: function(err) {
                    logLine(`${config.name}多维表格更新(PUT)请求失败 recordId=${recordId}：${String(err)}`);
                    resolve(false);
                }
            });
        });
        if (putOk) return true;

        // 2) 失败则回退批量更新 batch_update
        const batchPayload = { records: [{ record_id: recordId, fields: fields }] };
        return await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: batchUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(batchPayload),
                onload: function(response) {
                    const text = response.responseText || '';
                    try {
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            resolve(true);
                            return;
                        }
                        logLine(`${config.name}多维表格更新(批量)失败 recordId=${recordId} code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                        resolve(false);
                    } catch {
                        if (response.status >= 200 && response.status < 300) {
                            logLine(`${config.name}多维表格更新(批量)返回非JSON但HTTP=${response.status} 视为成功`);
                            resolve(true);
                        } else {
                            logLine(`${config.name}多维表格更新(批量)解析失败且HTTP非成功：http=${response.status}`);
                            resolve(false);
                        }
                    }
                },
                onerror: function(err) {
                    logLine(`${config.name}多维表格更新(批量)请求失败 recordId=${recordId}：${String(err)}`);
                    resolve(false);
                }
            });
        });
    }

    // ----------------------------- 飞书：更新记录 ACA授权=是（按表） -----------------------------
    async function feishuUpdateACA(config, recordId) {
        const token = await getFeishuToken();
        // 如果传入的是配置对象，使用配置的appToken；否则使用旧的逻辑
        const appToken = config && config.appToken ? await ensureBitableAppTokenForConfig(config) : await ensureFeishuAppToken();
        const tableId = config && config.tableId ? config.tableId : config; // 兼容旧代码：如果config是字符串，就是tableId
        const putUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`;
        const batchUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_update`;
        const fieldsPayload = { fields: { 'ACA授权': '是' } };

        // 1) 首选单条 PUT
        const putOk = await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'PUT',
                url: putUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(fieldsPayload),
                onload: function(response) {
                    const text = response.responseText || '';
                    try {
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) { resolve(true); return; }
                        logLine(`飞书更新(PUT)失败 表=${tableId} code=${data.code} http=${response.status} url=${putUrl} resp=${text.slice(0,200)}`);
                        resolve(false);
                    } catch {
                        if (response.status >= 200 && response.status < 300) {
                            logLine(`飞书更新(PUT)返回非JSON但HTTP=${response.status} 表=${tableId} 视为成功。url=${putUrl} raw=${text.slice(0,200)}`);
                            resolve(true);
                        } else {
                            logLine(`飞书更新(PUT)解析失败且HTTP非成功：http=${response.status} 表=${tableId} url=${putUrl} raw=${text.slice(0,200)}`);
                            resolve(false);
                        }
                    }
                },
                onerror: function(err) { logLine(`飞书更新(PUT)请求失败 表=${tableId}：${String(err)} url=${putUrl}`); resolve(false); }
            });
        });
        if (putOk) return true;

        // 2) 失败则回退批量更新 batch_update
        const batchPayload = { records: [{ record_id: recordId, fields: { 'ACA授权': '是' } }] };
        return await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: batchUrl,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(batchPayload),
                onload: function(response) {
                    const text = response.responseText || '';
                    try {
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) { resolve(true); return; }
                        logLine(`飞书更新(批量)失败 表=${tableId} code=${data.code} http=${response.status} url=${batchUrl} resp=${text.slice(0,200)}`);
                        resolve(false);
                    } catch {
                        if (response.status >= 200 && response.status < 300) {
                            logLine(`飞书更新(批量)返回非JSON但HTTP=${response.status} 表=${tableId} 视为成功。url=${batchUrl} raw=${text.slice(0,200)}`);
                            resolve(true);
                        } else {
                            logLine(`飞书更新(批量)解析失败且HTTP非成功：http=${response.status} 表=${tableId} url=${batchUrl} raw=${text.slice(0,200)}`);
                            resolve(false);
                        }
                    }
                },
                onerror: function(err) { logLine(`飞书更新(批量)请求失败 表=${tableId}：${String(err)} url=${batchUrl}`); resolve(false); }
            });
        });
    }

    // ----------------------------- TikTok：批量检查CODE码有效性 -----------------------------
    async function validateVideoCodes(videoCodeList) {
        if (!videoCodeList || videoCodeList.length === 0) return [];

        const csrf = getCsrfToken();
        const endpoint = `https://ads.tiktok.com/api/oec_shopping/v1/creation/get_auth_code_videos?locale=en&language=en&oec_seller_id=${ADS_PARAMS.oec_seller_id}&aadvid=${ADS_PARAMS.aadvid}&bc_id=${ADS_PARAMS.bc_id}`;
        const referrer = `https://ads.tiktok.com/i18n/gmv-max/creation/edit?aadvid=${ADS_PARAMS.aadvid}&oec_seller_id=${ADS_PARAMS.oec_seller_id}&bc_id=${ADS_PARAMS.bc_id}&list_start_date=1758274448212&list_end_date=1758274448212&campaign_id=1843434341273665`;

        logLine(`批量检查CODE码有效性：${videoCodeList.length}个`);

        // 验证所有CODE码都是字符串类型
        const validCodeList = videoCodeList.map(code => {
            if (code && typeof code === 'object') {
                logLine(`警告：发现对象类型的CODE码，将转换为字符串：${JSON.stringify(code)}`);
                return safeExtractString(code);
            }
            return String(code || '').trim();
        }).filter(code => code);

        if (validCodeList.length !== videoCodeList.length) {
            logLine(`警告：过滤后CODE码数量从${videoCodeList.length}变为${validCodeList.length}`);
        }

        logLine(`CODE码示例：${validCodeList[0]?.slice(0, 50)}...`);
        logLine(`发送的CODE码列表：${JSON.stringify(validCodeList.slice(0, 5))}...`);

        const body = { video_code_list: validCodeList };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'content-type': 'application/json; charset=UTF-8',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'x-csrftoken': csrf
                },
                referrer: referrer,
                body: JSON.stringify(body)
            });

            logLine(`CODE码有效性检查 HTTP状态：${res.status}`);

            if (!res.ok) {
                const txt = await res.text().catch(()=> '');
                logLine(`CODE码有效性检查失败 HTTP=${res.status}：${txt.slice(0,500)}`);
                return [];
            }

            const data = await res.json();
            logLine(`CODE码有效性检查完整响应：${JSON.stringify(data, null, 2)}`);

            // 检查API是否返回错误
            if (data.code && data.code !== 0) {
                logLine(`API返回错误：code=${data.code}, msg=${data.msg}`);
                if (data.extra && data.extra.error_tag) {
                    logLine(`错误标签：${data.extra.error_tag}`);
                }

                // 对于API错误，为所有CODE码创建失败结果
                const results = [];
                for (const videoCode of videoCodeList) {
                    results.push({
                        video_code: videoCode,
                        status: -1, // 使用-1表示API错误
                        error_info: `API错误: ${data.msg} (${data.code})`
                    });
                }
                logLine(`API错误处理：为${videoCodeList.length}个CODE码创建失败结果`);
                return results;
            }

            logLine(`API响应结构分析：`);
            logLine(`- data字段存在：${!!data.data}`);
            if (data.data) {
                logLine(`- data字段内容：${JSON.stringify(data.data, null, 2)}`);
                logLine(`- auth_code_video_list字段存在：${!!data.data.auth_code_video_list}`);
                if (data.data.auth_code_video_list) {
                    logLine(`- auth_code_video_list长度：${data.data.auth_code_video_list.length}`);
                }
            }

            const authList = data?.data?.auth_code_video_list || [];
            logLine(`CODE码有效性检查解析到auth_code_video_list：${authList.length}个`);

            const results = [];

            for (const item of authList) {
                // 判断CODE是否有效：有status字段且为102表示有效，有error_info表示无效
                const isValid = item.status === 102;
                const status = isValid ? 102 : -1;
                const errorInfo = isValid ? '' : (item.error_info || '未知错误');

                results.push({
                    video_code: item.video_code,
                    status: status,
                    error_info: errorInfo
                });

                if (isValid) {
                    logLine(`CODE码有效性检查通过：${item.video_code} -> status=${status}`);
                } else {
                    logLine(`CODE码有效性检查失败：${item.video_code} -> error=${errorInfo}`);
                }
            }

            logLine(`CODE码有效性检查完成：${results.length}个结果`);
            return results;
        } catch (e) {
            logLine(`CODE码有效性检查异常：${String(e)}`);
            return [];
        }
    }

    // ----------------------------- TikTok：批量获取CODE码授权 -----------------------------
    async function authorizeVideoCodes(videoCodeList) {
        if (!videoCodeList || videoCodeList.length === 0) return [];

        const csrf = getCsrfToken();
        const endpoint = `https://ads.tiktok.com/api/oec_shopping/v1/creation/bulk_authorize_video_code?locale=en&language=en&oec_seller_id=${ADS_PARAMS.oec_seller_id}&aadvid=${ADS_PARAMS.aadvid}&bc_id=${ADS_PARAMS.bc_id}`;
        const referrer = `https://ads.tiktok.com/i18n/gmv-max/creation/edit?aadvid=${ADS_PARAMS.aadvid}&oec_seller_id=${ADS_PARAMS.oec_seller_id}&bc_id=${ADS_PARAMS.bc_id}&list_start_date=1758274448212&list_end_date=1758274448212&campaign_id=1843434341273665`;

        logLine(`批量获取CODE码授权：${videoCodeList.length}个`);

        // 验证所有CODE码都是字符串类型
        const validCodeList = videoCodeList.map(code => {
            if (code && typeof code === 'object') {
                logLine(`警告：发现对象类型的CODE码，将转换为字符串：${JSON.stringify(code)}`);
                return safeExtractString(code);
            }
            return String(code || '').trim();
        }).filter(code => code);

        if (validCodeList.length !== videoCodeList.length) {
            logLine(`警告：过滤后CODE码数量从${videoCodeList.length}变为${validCodeList.length}`);
        }

        logLine(`CODE码示例：${validCodeList[0]?.slice(0, 50)}...`);
        logLine(`发送的CODE码列表：${JSON.stringify(validCodeList.slice(0, 5))}...`);

        const body = { video_code_list: validCodeList };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'content-type': 'application/json; charset=UTF-8',
                    'priority': 'u=1, i',
                    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'x-csrftoken': csrf
                },
                referrer: referrer,
                body: JSON.stringify(body)
            });

            logLine(`CODE码授权 HTTP状态：${res.status}`);

            if (!res.ok) {
                const txt = await res.text().catch(()=> '');
                logLine(`CODE码授权失败 HTTP=${res.status}：${txt.slice(0,500)}`);
                return [];
            }

            const data = await res.json();
            logLine(`CODE码授权响应：${JSON.stringify(data).slice(0, 500)}...`);

            // 检查API是否返回错误
            if (data.code && data.code !== 0) {
                logLine(`API返回错误：code=${data.code}, msg=${data.msg}`);
                if (data.extra && data.extra.error_tag) {
                    logLine(`错误标签：${data.extra.error_tag}`);
                }

                // 对于API错误，为所有CODE码创建失败结果
                const results = [];
                for (const videoCode of videoCodeList) {
                    results.push({
                        video_code: videoCode,
                        status: -1, // 使用-1表示API错误
                        error_info: `API错误: ${data.msg} (${data.code})`
                    });
                }
                logLine(`API错误处理：为${videoCodeList.length}个CODE码创建失败结果`);
                return results;
            }

            const authList = data?.data?.auth_code_video_list || [];
            logLine(`CODE码授权解析到auth_code_video_list：${authList.length}个`);

            const results = [];

            if (authList.length > 0) {
                for (const item of authList) {
                    results.push({
                        video_code: item.video_code,
                        status: item.status,
                        error_info: item.error_info || ''
                    });
                    logLine(`CODE码授权结果：${item.video_code} -> status=${item.status}`);
                }
            } else {
                // 某些情况下接口返回成功但列表为空，视为对传入CODE均授权成功
                logLine('授权接口返回成功但列表为空，按输入列表回填成功状态');
                for (const code of videoCodeList) {
                    results.push({
                        video_code: code,
                        status: 0,
                        error_info: ''
                    });
                    logLine(`CODE码授权结果(回填)：${code} -> status=0`);
                }
            }

            logLine(`CODE码授权完成：${results.length}个结果`);
            return results;
        } catch (e) {
            logLine(`CODE码授权异常：${String(e)}`);
            return [];
        }
    }


    // ----------------------------- TikTok：按用户名查询 is_using_aca -----------------------------
    async function queryTikTokACA(username) {
        if (!username) return null;
        const csrf = getCsrfToken();
        const { st, et } = getLast7DaysRange();
        const endpoint = `https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_creator_list?locale=en&language=en&oec_seller_id=${ADS_PARAMS.oec_seller_id}&aadvid=${ADS_PARAMS.aadvid}&bc_id=${ADS_PARAMS.bc_id}`;
        const referrer = `https://ads.tiktok.com/i18n/gmv-max/manage-analyze?aadvid=${ADS_PARAMS.aadvid}&oec_seller_id=${ADS_PARAMS.oec_seller_id}&bc_id=${ADS_PARAMS.bc_id}&reporting_type=creator`;

        const body = {
            common_req: {
                st,
                et,
                page: 1,
                page_size: 20,
                sort_stat: 'onsite_roi2_shopping_value',
                sort_order: 1,
                filters: [
                    { field: 'creator_user_name', filter_type: 0, in_field_values: [username] }
                ],
                dimensions: ['author_id'],
                metrics: [
                    'creator_nick_name','tt_account_avatar_icon','creator_user_name','total_video_cnt','total_spu_cnt',
                    'onsite_roi2_shopping_value','onsite_roi2_shopping_sku','roi2_show_cnt','roi2_click_cnt',
                    'onsite_roi2_shopping_sku_aov','roi2_ctr','is_using_aca','tt_oec_uid'
                ]
            }
        };

        logLine(`准备请求TikTok：username="${username}", st=${st}, et=${et}`);
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/json; charset=UTF-8',
                    'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                    'x-csrftoken': csrf
                },
                referrer: referrer,
                body: JSON.stringify(body)
            });
            logLine(`TikTok HTTP状态：${res.status} (${username})`);
            if (!res.ok) {
                if (res.status === 403) logLine('可能原因：未携带登录Cookie或CSRF不匹配，请确认已登录且同域请求');
                const txt = await res.text().catch(()=> '');
                if (txt) logLine(`TikTok响应：${txt.slice(0,200)}`);
                return null;
            }
            const data = await res.json();
            const total = data?.data?.pagination?.total_count;
            const table = data?.data?.table || [];
            const firstName = table[0]?.creator_user_name;
            logLine(`TikTok返回 total_count=${total}, first.creator_user_name=${firstName ?? 'N/A'} (${username})`);
            const row = table[0] || null;
            if (!row) return null;
            const value = String(row.is_using_aca ?? '');
            logLine(`TikTok返回 is_using_aca=${value} (${username})`);
            return value || null;
        } catch (e) {
            logLine(`TikTok查询异常：${String(e)}`);
            return null;
        }
    }

    // ----------------------------- 电子表格：批量更新单元格（已注释） -----------------------------
    /*
    async function updateSheetCells(config, updates) {
        if (!updates || updates.length === 0) return true;

        const token = await getFeishuToken();
        const spreadsheetToken = await ensureSpreadsheetToken(config);
        const url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${spreadsheetToken}/values_batch_update`;

        const valueRanges = updates.map(update => ({
            range: `${config.sheetId}!${update.column}${update.row}:${update.column}${update.row}`,
            values: [[update.value]]
        }));

        const payload = { valueRanges: valueRanges };

        logLine(`批量更新${config.name}电子表格：${updates.length}个单元格`);
        logLine(`更新详情：${JSON.stringify(updates, null, 2)}`);
        logLine(`发送的payload：${JSON.stringify(payload, null, 2)}`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify(payload),
                onload: function(response) {
                    try {
                        const text = response.responseText || '';
                        const data = JSON.parse(text || '{}');
                        if (data.code === 0) {
                            logLine(`${config.name}电子表格批量更新成功：${updates.length}个单元格`);
                            resolve(true);
                        } else {
                            logLine(`${config.name}电子表格批量更新失败 code=${data.code} http=${response.status} resp=${text.slice(0,200)}`);
                            resolve(false);
                        }
                    } catch (e) {
                        logLine(`${config.name}电子表格批量更新解析失败：${String(e)}`);
                        resolve(false);
                    }
                },
                onerror: function(err) { logLine(`${config.name}电子表格批量更新请求失败：${String(err)}`); resolve(false); }
            });
        });
    }
    */


    // ----------------------------- 多维表格：处理CODE码授权流程 -----------------------------
    async function processBitableCodeAuthorization() {
        try {
            // 从localStorage加载配置
            const configs = loadBitableConfigs();
            if (configs.length === 0) {
                logLine('未找到多维表格配置，请先点击"配置多维表格"按钮添加配置');
                alert('未找到多维表格配置，请先点击"配置多维表格"按钮添加配置');
                return { processed: 0, authorized: 0, failed: 0 };
            }

            let totalProcessed = 0;
            let totalAuthorized = 0;
            let totalFailed = 0;

            // 处理每个多维表格配置
            for (const config of configs) {
                logLine(`开始处理${config.name}多维表格...`);

                // 1. 读取待处理的记录
                logLine(`读取${config.name}多维表格数据…`);
                const records = await feishuBitableSearchCodeRecords(config);
                if (records.length === 0) {
                    logLine(`${config.name}：无待处理记录`);
                    continue;
                }

                let processed = 0;
                let authorized = 0;
                let failed = 0;

                // 2. 分批处理CODE码
                for (let i = 0; i < records.length; i += BATCH_SIZE) {
                    const batch = records.slice(i, i + BATCH_SIZE);

                    // 3. 去重处理：只保留每个CODE码的第一次出现
                    const seenCodes = new Set();
                    const uniqueBatch = [];
                    const duplicateRecords = [];

                    for (const record of batch) {
                        const boostcodeStr = safeExtractString(record.boostcode);
                        if (seenCodes.has(boostcodeStr)) {
                            // 找到重复的CODE码
                            const firstRecord = uniqueBatch.find(r => safeExtractString(r.boostcode) === boostcodeStr);
                            duplicateRecords.push({
                                ...record,
                                duplicateOf: firstRecord.recordId
                            });
                            logLine(`${config.name} 发现重复CODE码：${boostcodeStr} (recordId=${record.recordId}与recordId=${firstRecord.recordId}重复)`);
                        } else {
                            seenCodes.add(boostcodeStr);
                            uniqueBatch.push(record);
                        }
                    }

                    // 确保所有CODE码都是字符串类型
                    const videoCodes = uniqueBatch.map(record => safeExtractString(record.boostcode)).filter(code => code);

                    setBusy(true, `处理${config.name} 第${Math.floor(i/BATCH_SIZE)+1}批…`, 'bitable-processor-button');

                    // 4. 第一步：检查CODE码有效性
                    logLine(`开始检查${config.name} CODE码有效性：${videoCodes.length}个（去重后）`);
                    const validationResults = await validateVideoCodes(videoCodes);
                    const validCodes = [];
                    const invalidCodes = [];

                    for (const result of validationResults) {
                        if (result.status === 102) {
                            validCodes.push(result.video_code);
                            logLine(`CODE码有效性检查通过：${result.video_code}`);
                        } else {
                            invalidCodes.push({
                                code: result.video_code,
                                error: result.error_info || '有效性检查失败'
                            });
                            logLine(`CODE码有效性检查失败：${result.video_code} - ${result.error_info || '未知错误'}`);
                        }
                    }

                    logLine(`${config.name} 有效性检查结果：通过${validCodes.length}个，失败${invalidCodes.length}个`);

                    // 5. 第二步：对有效性检查通过的CODE码进行授权获取
                    let authResults = [];
                    if (validCodes.length > 0) {
                        logLine(`开始获取${config.name} 授权CODE码：${validCodes.length}个`);
                        authResults = await authorizeVideoCodes(validCodes);
                    }

                    // 6. 更新多维表格记录
                    // 处理授权成功的CODE码
                    for (const result of authResults) {
                        const record = uniqueBatch.find(r => safeExtractString(r.boostcode) === result.video_code);
                        if (record) {
                            const success = await feishuBitableUpdateCodeRecord(
                                config,
                                record.recordId,
                                '是', // 授权状态设为"是"
                                '' // 清空备注（如果需要保留原备注，可以传入record.remark）
                            );
                            if (success) {
                                authorized++;
                                logLine(`${config.name} CODE码授权成功：${result.video_code} -> 更新授权状态为"是"`);
                            } else {
                                failed++;
                                logLine(`${config.name} CODE码授权成功但更新失败：${result.video_code}`);
                            }
                        }
                    }

                    // 处理有效性检查失败的CODE码（与电子表格逻辑一致：只更新备注，不更新状态）
                    for (const invalid of invalidCodes) {
                        const record = uniqueBatch.find(r => safeExtractString(r.boostcode) === invalid.code);
                        if (record) {
                            const success = await feishuBitableUpdateCodeRecord(
                                config,
                                record.recordId,
                                null, // 不更新授权状态（保持原值）
                                invalid.error // 备注写入错误信息
                            );
                            if (success) {
                                failed++;
                                logLine(`${config.name} CODE码有效性检查失败：${invalid.code} -> 更新备注为"${invalid.error}"`);
                            }
                        }
                    }

                    // 处理重复的CODE码（与电子表格逻辑一致：只更新备注，不更新状态）
                    for (const duplicate of duplicateRecords) {
                        const success = await feishuBitableUpdateCodeRecord(
                            config,
                            duplicate.recordId,
                            null, // 不更新授权状态（保持原值）
                            `code码与recordId=${duplicate.duplicateOf}重复` // 备注写入重复信息
                        );
                        if (success) {
                            failed++;
                            logLine(`${config.name} CODE码重复：${safeExtractString(duplicate.boostcode)} (recordId=${duplicate.recordId}) -> 更新备注为"code码与recordId=${duplicate.duplicateOf}重复"`);
                        }
                    }

                    processed += batch.length;
                    logLine(`${config.name} 批次完成：处理${batch.length}条，授权${authResults.length}条，失败${invalidCodes.length}条，重复${duplicateRecords.length}条`);
                }

                totalProcessed += processed;
                totalAuthorized += authorized;
                totalFailed += failed;
                logLine(`${config.name} 完成：处理${processed}条，授权${authorized}条，失败${failed}条`);
            }

            return { processed: totalProcessed, authorized: totalAuthorized, failed: totalFailed };
        } catch (e) {
            logLine(`多维表格处理异常：${String(e)}`);
            return { processed: 0, authorized: 0, failed: 0 };
        }
    }

    // ----------------------------- 电子表格：处理CODE码授权流程（已注释） -----------------------------
    /*
    async function processSheetCodeAuthorization() {
        try {
            let totalProcessed = 0;
            let totalAuthorized = 0;
            let totalFailed = 0;

            // 处理每张电子表格
            for (const config of FEISHU_SHEET_CONFIGS) {
                logLine(`开始处理${config.name}...`);

                // 1. 直接读取数据（跳过筛选创建，直接在后端筛选）
                logLine(`读取${config.name}电子表格数据…`);
                const filteredRows = await readFilteredSheetData(config);
                if (filteredRows.length === 0) {
                    logLine(`${config.name}：无待处理记录`);
                    continue;
                }

                let processed = 0;
                let authorized = 0;
                let failed = 0;

                // 3. 分批处理CODE码
                for (let i = 0; i < filteredRows.length; i += BATCH_SIZE) {
                    const batch = filteredRows.slice(i, i + BATCH_SIZE);

                    // 4. 去重处理：只保留每个CODE码的第一次出现
                    const seenCodes = new Set();
                    const uniqueBatch = [];
                    const duplicateRows = [];

                    for (const row of batch) {
                        if (seenCodes.has(row.code)) {
                            // 找到重复的CODE码，记录为重复
                            const firstRow = uniqueBatch.find(r => r.code === row.code);
                            duplicateRows.push({
                                ...row,
                                duplicateOf: firstRow.rowIndex
                            });
                            logLine(`${config.name} 发现重复CODE码：${row.code} (第${row.rowIndex}行与第${firstRow.rowIndex}行重复)`);
                        } else {
                            // 第一次出现的CODE码
                            seenCodes.add(row.code);
                            uniqueBatch.push(row);
                        }
                    }

                    const videoCodes = uniqueBatch.map(row => row.code);

                    setBusy(true, `处理${config.name} 第${Math.floor(i/BATCH_SIZE)+1}批…`, 'sheet-processor-button');

                    // 5. 第一步：检查CODE码有效性
                    logLine(`开始检查${config.name} CODE码有效性：${videoCodes.length}个（去重后）`);
                    const validationResults = await validateVideoCodes(videoCodes);
                    const validCodes = [];
                    const invalidCodes = [];

                    for (const result of validationResults) {
                        if (result.status === 102) { // 102表示有效性检查通过
                            validCodes.push(result.video_code);
                            logLine(`CODE码有效性检查通过：${result.video_code}`);
                        } else {
                            invalidCodes.push({
                                code: result.video_code,
                                error: result.error_info || '有效性检查失败'
                            });
                            logLine(`CODE码有效性检查失败：${result.video_code} - ${result.error_info || '未知错误'}`);
                        }
                    }

                    logLine(`${config.name} 有效性检查结果：通过${validCodes.length}个，失败${invalidCodes.length}个`);

                    // 5. 第二步：对有效性检查通过的CODE码进行授权获取
                    let authResults = [];
                    if (validCodes.length > 0) {
                        logLine(`开始获取${config.name} 授权CODE码：${validCodes.length}个`);
                        authResults = await authorizeVideoCodes(validCodes);
                    }

                    // 6. 准备更新数据
                    const updates = [];

                    // 处理授权成功的CODE码（只处理去重后的批次）
                    for (const result of authResults) {
                        const row = uniqueBatch.find(r => r.code === result.video_code);
                        if (row) {
                            updates.push({
                                row: row.rowIndex,
                                column: STATUS_COLUMN,
                                value: '是'
                            });
                            authorized++;
                            logLine(`${config.name} CODE码授权成功：${result.video_code} -> 更新Q列为"是"`);
                        }
                    }

                    // 处理有效性检查失败的CODE码（只处理去重后的批次）
                    for (const invalid of invalidCodes) {
                        const row = uniqueBatch.find(r => r.code === invalid.code);
                        if (row) {
                            updates.push({
                                row: row.rowIndex,
                                column: REMARK_COLUMN,
                                value: invalid.error
                            });
                            failed++;
                            logLine(`${config.name} CODE码有效性检查失败：${invalid.code} -> 更新P列为"${invalid.error}"`);
                        }
                    }

                    // 处理重复的CODE码，在P列标注重复信息
                    for (const duplicate of duplicateRows) {
                        updates.push({
                            row: duplicate.rowIndex,
                            column: REMARK_COLUMN,
                            value: `code码与第${duplicate.duplicateOf}行重复`
                        });
                        failed++;
                        logLine(`${config.name} CODE码重复：${duplicate.code} (第${duplicate.rowIndex}行) -> 更新P列为"code码与第${duplicate.duplicateOf}行重复"`);
                    }

                    // 7. 批量更新电子表格
                    if (updates.length > 0) {
                        await updateSheetCells(config, updates);
                    }

                    processed += batch.length;
                    logLine(`${config.name} 批次完成：处理${batch.length}条，授权${authResults.length}条，失败${invalidCodes.length}条，重复${duplicateRows.length}条`);
                }

                totalProcessed += processed;
                totalAuthorized += authorized;
                totalFailed += failed;
                logLine(`${config.name} 完成：处理${processed}条，授权${authorized}条，失败${failed}条`);
            }

            return { processed: totalProcessed, authorized: totalAuthorized, failed: totalFailed };
        } catch (e) {
            logLine(`电子表格处理异常：${String(e)}`);
            return { processed: 0, authorized: 0, failed: 0 };
        }
    }
    */

    // ----------------------------- 电子表格处理：独立触发（已注释） -----------------------------
    /*
    async function onSheetProcessorTrigger() {
        setBusy(true, '初始化中…', 'sheet-processor-button');
        logLine('开始：电子表格CODE码处理流程');
        try {
            const sheetResult = await processSheetCodeAuthorization();
            logLine(`电子表格完成：处理${sheetResult.processed}条，授权${sheetResult.authorized}条，失败${sheetResult.failed}条`);

            setBusy(true, '完成！', 'sheet-processor-button');
            setTimeout(() => setBusy(false, '', 'sheet-processor-button'), 2000);
            logLine('电子表格处理流程完成');
        } catch (e) {
            setBusy(true, '错误！', 'sheet-processor-button');
            setTimeout(() => setBusy(false, '', 'sheet-processor-button'), 3000);
            logLine(`电子表格处理异常结束：${String(e)}`);
        }
    }
    */

    // ----------------------------- CODE码表格选择弹窗 -----------------------------
    function createCodeTableSelectModal() {
        const modal = document.createElement('div');
        modal.id = 'code-table-select-modal';

        const content = document.createElement('div');
        content.id = 'code-table-select-content';

        content.innerHTML = `
            <h3>选择要处理的CODE码授权表格</h3>
            <div id="code-table-select-list"></div>
            <div class="aca-select-actions">
                <button class="btn-secondary" id="code-select-cancel-btn">取消</button>
                <button class="btn-primary" id="code-select-confirm-btn">开始处理</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 绑定事件
        const cancelBtn = content.querySelector('#code-select-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                closeCodeTableSelectModal();
            });
        }

        const confirmBtn = content.querySelector('#code-select-confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const selectedConfigs = getSelectedCodeTables();
                closeCodeTableSelectModal();
                if (selectedConfigs.length > 0) {
                    processBitableCodeAuthorizationWithConfigs(selectedConfigs);
                }
            });
        }

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCodeTableSelectModal();
            }
        });
    }

    function showCodeTableSelectModal() {
        const modal = document.getElementById('code-table-select-modal');
        if (!modal) {
            createCodeTableSelectModal();
        }

        const modal2 = document.getElementById('code-table-select-modal');
        if (modal2) {
            refreshCodeTableSelectList();
            modal2.classList.add('show');
        }
    }

    function closeCodeTableSelectModal() {
        const modal = document.getElementById('code-table-select-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function refreshCodeTableSelectList() {
        const container = document.getElementById('code-table-select-list');
        if (!container) return;

        const configs = loadBitableConfigs();

        if (configs.length === 0) {
            container.innerHTML = '<div style="color: #999; padding: 20px; text-align: center;">暂无配置的多维表格，请先点击"配置多维表格"按钮添加配置</div>';
            return;
        }

        container.innerHTML = configs.map((config, index) => `
            <div class="table-select-item" data-config-index="${index}">
                <input type="checkbox" id="code-table-${index}" data-config-index="${index}">
                <label for="code-table-${index}" class="table-select-item-info">
                    <div class="table-select-item-name">${escapeHtml(config.name)}</div>
                    <div class="table-select-item-detail">表格ID: ${escapeHtml(config.tableId)}</div>
                </label>
            </div>
        `).join('');

        // 绑定点击事件
        container.querySelectorAll('.table-select-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.type !== 'checkbox') {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        this.classList.toggle('selected', checkbox.checked);
                    }
                } else {
                    this.classList.toggle('selected', e.target.checked);
                }
            });
        });

        // 绑定checkbox变化事件
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const item = this.closest('.table-select-item');
                if (item) {
                    item.classList.toggle('selected', this.checked);
                }
            });
        });
    }

    function getSelectedCodeTables() {
        const configs = loadBitableConfigs();
        const selected = [];

        configs.forEach((config, index) => {
            const checkbox = document.getElementById(`code-table-${index}`);
            if (checkbox && checkbox.checked) {
                selected.push(config);
            }
        });

        return selected;
    }

    // ----------------------------- 多维表格：处理CODE码授权流程（带配置列表） -----------------------------
    async function processBitableCodeAuthorizationWithConfigs(selectedConfigs) {
        setBusy(true, '初始化中…', 'bitable-processor-button');
        logLine('开始：多维表格CODE码处理流程');
        try {
            let totalProcessed = 0;
            let totalAuthorized = 0;
            let totalFailed = 0;

            // 处理每个选中的多维表格配置
            for (const config of selectedConfigs) {
                logLine(`开始处理${config.name}多维表格...`);

                // 1. 读取待处理的记录
                logLine(`读取${config.name}多维表格数据…`);
                const records = await feishuBitableSearchCodeRecords(config);
                if (records.length === 0) {
                    logLine(`${config.name}：无待处理记录`);
                    continue;
                }

                let processed = 0;
                let authorized = 0;
                let failed = 0;

                // 2. 分批处理CODE码
                for (let i = 0; i < records.length; i += BATCH_SIZE) {
                    const batch = records.slice(i, i + BATCH_SIZE);

                    // 3. 去重处理：只保留每个CODE码的第一次出现
                    const seenCodes = new Set();
                    const uniqueBatch = [];
                    const duplicateRecords = [];

                    for (const record of batch) {
                        const boostcodeStr = safeExtractString(record.boostcode);
                        if (seenCodes.has(boostcodeStr)) {
                            // 找到重复的CODE码
                            const firstRecord = uniqueBatch.find(r => safeExtractString(r.boostcode) === boostcodeStr);
                            duplicateRecords.push({
                                ...record,
                                duplicateOf: firstRecord.recordId
                            });
                            logLine(`${config.name} 发现重复CODE码：${boostcodeStr} (recordId=${record.recordId}与recordId=${firstRecord.recordId}重复)`);
                        } else {
                            seenCodes.add(boostcodeStr);
                            uniqueBatch.push(record);
                        }
                    }

                    // 确保所有CODE码都是字符串类型
                    const videoCodes = uniqueBatch.map(record => safeExtractString(record.boostcode)).filter(code => code);

                    setBusy(true, `处理${config.name} 第${Math.floor(i/BATCH_SIZE)+1}批…`, 'bitable-processor-button');

                    // 4. 第一步：检查CODE码有效性
                    logLine(`开始检查${config.name} CODE码有效性：${videoCodes.length}个（去重后）`);
                    const validationResults = await validateVideoCodes(videoCodes);
                    const validCodes = [];
                    const invalidCodes = [];

                    for (const result of validationResults) {
                        if (result.status === 102) {
                            validCodes.push(result.video_code);
                            logLine(`CODE码有效性检查通过：${result.video_code}`);
                        } else {
                            invalidCodes.push({
                                code: result.video_code,
                                error: result.error_info || '有效性检查失败'
                            });
                            logLine(`CODE码有效性检查失败：${result.video_code} - ${result.error_info || '未知错误'}`);
                        }
                    }

                    logLine(`${config.name} 有效性检查结果：通过${validCodes.length}个，失败${invalidCodes.length}个`);

                    // 5. 第二步：对有效性检查通过的CODE码进行授权获取
                    let authResults = [];
                    if (validCodes.length > 0) {
                        logLine(`开始获取${config.name} 授权CODE码：${validCodes.length}个`);
                        authResults = await authorizeVideoCodes(validCodes);
                    }

                    // 6. 更新多维表格记录
                    // 处理授权成功的CODE码
                    for (const result of authResults) {
                        const record = uniqueBatch.find(r => safeExtractString(r.boostcode) === result.video_code);
                        if (record) {
                            const success = await feishuBitableUpdateCodeRecord(
                                config,
                                record.recordId,
                                '是', // 授权状态设为"是"
                                '' // 清空备注（如果需要保留原备注，可以传入record.remark）
                            );
                            if (success) {
                                authorized++;
                                logLine(`${config.name} CODE码授权成功：${result.video_code} -> 更新授权状态为"是"`);
                            } else {
                                failed++;
                                logLine(`${config.name} CODE码授权成功但更新失败：${result.video_code}`);
                            }
                        }
                    }

                    // 处理有效性检查失败的CODE码（与电子表格逻辑一致：只更新备注，不更新状态）
                    for (const invalid of invalidCodes) {
                        const record = uniqueBatch.find(r => safeExtractString(r.boostcode) === invalid.code);
                        if (record) {
                            const success = await feishuBitableUpdateCodeRecord(
                                config,
                                record.recordId,
                                null, // 不更新授权状态（保持原值）
                                invalid.error // 备注写入错误信息
                            );
                            if (success) {
                                failed++;
                                logLine(`${config.name} CODE码有效性检查失败：${invalid.code} -> 更新备注为"${invalid.error}"`);
                            }
                        }
                    }

                    // 处理重复的CODE码（与电子表格逻辑一致：只更新备注，不更新状态）
                    for (const duplicate of duplicateRecords) {
                        const success = await feishuBitableUpdateCodeRecord(
                            config,
                            duplicate.recordId,
                            null, // 不更新授权状态（保持原值）
                            `code码与recordId=${duplicate.duplicateOf}重复` // 备注写入重复信息
                        );
                        if (success) {
                            failed++;
                            logLine(`${config.name} CODE码重复：${safeExtractString(duplicate.boostcode)} (recordId=${duplicate.recordId}) -> 更新备注为"code码与recordId=${duplicate.duplicateOf}重复"`);
                        }
                    }

                    processed += batch.length;
                    logLine(`${config.name} 批次完成：处理${batch.length}条，授权${authResults.length}条，失败${invalidCodes.length}条，重复${duplicateRecords.length}条`);
                }

                totalProcessed += processed;
                totalAuthorized += authorized;
                totalFailed += failed;
                logLine(`${config.name} 完成：处理${processed}条，授权${authorized}条，失败${failed}条`);
            }

            setBusy(true, `完成！处理${totalProcessed}条，授权${totalAuthorized}条，失败${totalFailed}条`, 'bitable-processor-button');
            setTimeout(() => setBusy(false, '', 'bitable-processor-button'), 2000);
            logLine(`多维表格处理流程完成：总计处理${totalProcessed}条，授权${totalAuthorized}条，失败${totalFailed}条`);
        } catch (e) {
            setBusy(true, '错误！', 'bitable-processor-button');
            setTimeout(() => setBusy(false, '', 'bitable-processor-button'), 3000);
            logLine(`多维表格处理异常结束：${String(e)}`);
        }
    }

    // ----------------------------- 多维表格处理：独立触发（显示选择界面） -----------------------------
    async function onBitableProcessorTrigger() {
        // 先显示表格选择界面
        showCodeTableSelectModal();
    }



    // ----------------------------- ACA表格选择弹窗 -----------------------------
    function createACATableSelectModal() {
        const modal = document.createElement('div');
        modal.id = 'aca-table-select-modal';

        const content = document.createElement('div');
        content.id = 'aca-table-select-content';

        content.innerHTML = `
            <h3>选择要处理的ACA授权表格</h3>
            <div id="aca-table-select-list"></div>
            <div class="aca-select-actions">
                <button class="btn-secondary" id="aca-select-cancel-btn">取消</button>
                <button class="btn-primary" id="aca-select-confirm-btn">开始处理</button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 绑定事件
        const cancelBtn = content.querySelector('#aca-select-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                closeACATableSelectModal();
            });
        }

        const confirmBtn = content.querySelector('#aca-select-confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                const selectedConfigs = getSelectedACATables();
                closeACATableSelectModal();
                if (selectedConfigs.length > 0) {
                    processACAAuthorization(selectedConfigs);
                }
            });
        }

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeACATableSelectModal();
            }
        });
    }

    function showACATableSelectModal() {
        const modal = document.getElementById('aca-table-select-modal');
        if (!modal) {
            createACATableSelectModal();
        }

        const modal2 = document.getElementById('aca-table-select-modal');
        if (modal2) {
            refreshACATableSelectList();
            modal2.classList.add('show');
        }
    }

    function closeACATableSelectModal() {
        const modal = document.getElementById('aca-table-select-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    function refreshACATableSelectList() {
        const container = document.getElementById('aca-table-select-list');
        if (!container) return;

        const configs = loadBitableConfigs();

        if (configs.length === 0) {
            container.innerHTML = '<div style="color: #999; padding: 20px; text-align: center;">暂无配置的多维表格，请先点击"配置多维表格"按钮添加配置</div>';
            return;
        }

        container.innerHTML = configs.map((config, index) => `
            <div class="table-select-item" data-config-index="${index}">
                <input type="checkbox" id="aca-table-${index}" data-config-index="${index}">
                <label for="aca-table-${index}" class="table-select-item-info">
                    <div class="table-select-item-name">${escapeHtml(config.name)}</div>
                    <div class="table-select-item-detail">表格ID: ${escapeHtml(config.tableId)}</div>
                </label>
            </div>
        `).join('');

        // 绑定点击事件
        container.querySelectorAll('.table-select-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.type !== 'checkbox') {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        this.classList.toggle('selected', checkbox.checked);
                    }
                } else {
                    this.classList.toggle('selected', e.target.checked);
                }
            });
        });

        // 绑定checkbox变化事件
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const item = this.closest('.table-select-item');
                if (item) {
                    item.classList.toggle('selected', this.checked);
                }
            });
        });
    }

    function getSelectedACATables() {
        const configs = loadBitableConfigs();
        const selected = [];

        configs.forEach((config, index) => {
            const checkbox = document.getElementById(`aca-table-${index}`);
            if (checkbox && checkbox.checked) {
                selected.push(config);
            }
        });

        return selected;
    }

    // ----------------------------- 主流程：处理ACA授权 -----------------------------
    async function processACAAuthorization(selectedConfigs) {
        setBusy(true, '初始化中…');
        logLine('开始：飞书多维表→TikTok→回写 流程');
        try {
            let totalProcessed = 0;
            let totalUpdated = 0;

            for (let i = 0; i < selectedConfigs.length; i++) {
                const config = selectedConfigs[i];
                setBusy(true, `处理多维表${i+1}/${selectedConfigs.length}：${config.name}…`);

                const items = await feishuSearchEmptyACA(config, 100);
                let processed = 0;
                let updated = 0;

                for (const item of items) {
                    try {
                        const recordId = item.record_id || item.id;
                        const fields = item.fields || {};
                        const raw = fields['用户名'];
                        const username = normalizeUsername(raw);
                        const rawPreview = (() => { try { return JSON.stringify(raw)?.slice(0,120) || String(raw); } catch { return String(raw); } })();
                        if (!recordId || !username) {
                            logLine(`表=${config.name}(${config.tableId}) 记录缺少record_id或用户名为空，跳过（recordId=${recordId || ''}, rawPreview=${rawPreview})`);
                            continue;
                        }
                        if (processedUsernames.has(username)) {
                            logLine(`表=${config.name}(${config.tableId}) 跳过已处理：${username}`);
                            continue;
                        }
                        processedUsernames.add(username);
                        processed++;
                        setBusy(true, `处理多维表${i+1}/${selectedConfigs.length}：${config.name} 第${processed}条…`);

                        logLine(`表=${config.name}(${config.tableId}) 查询TikTok：${username}`);
                        const isUsingACA = await queryTikTokACA(username);
                        if (isUsingACA === '1') {
                            logLine(`表=${config.name}(${config.tableId}) 命中ACA=1，回写飞书：${username}`);
                            const ok = await feishuUpdateACA(config, recordId);
                            if (ok) updated++;
                            logLine(ok ? `表=${config.name}(${config.tableId}) 回写成功：${username}` : `表=${config.name}(${config.tableId}) 回写失败：${username}`);
                        } else if (isUsingACA === '0') {
                            logLine(`表=${config.name}(${config.tableId}) ACA=0 不回写：${username}`);
                        } else {
                            logLine(`表=${config.name}(${config.tableId}) 未查询到结果或无is_using_aca：${username}`);
                        }
                    } catch (inner) {
                        logLine(`表=${config.name}(${config.tableId}) 处理单条记录异常：${String(inner)}`);
                    }
                }
                totalProcessed += processed;
                totalUpdated += updated;
                logLine(`表=${config.name}(${config.tableId}) 完成：处理${processed}条，更新${updated}条`);
            }

            setBusy(true, `完成！处理${totalProcessed}条，更新${totalUpdated}条`);
            setTimeout(() => setBusy(false), 2000);
            logLine(`多维表处理流程完成：总计处理${totalProcessed}条，更新${totalUpdated}条`);
        } catch (e) {
            setBusy(true, '错误！');
            setTimeout(() => setBusy(false), 3000);
            logLine(`多维表处理异常结束：${String(e)}`);
        }
    }

    // ----------------------------- 主流程：手动触发（显示选择界面） -----------------------------
    async function onManualTrigger() {
        // 先显示表格选择界面
        showACATableSelectModal();
    }

    // ----------------------------- 启动 -----------------------------
    ensureUI();
})();

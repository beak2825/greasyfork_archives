// ==UserScript==
// @name         电子税务局数电发票自动下载工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动提取文本中的20位数电发票号并开始下载发票，支持批量下载
// @author       Herohub
// @match        https://dppt.*.chinatax.gov.cn:8443/invoice-query/invoice-query
// @match        https://dppt.*.chinatax.gov.cn:8443/*
// @match        https://dppt.*.chinatax.gov.cn/*
// @match        https://*.chinatax.gov.cn:8443/invoice-query/invoice-query
// @match        https://*.chinatax.gov.cn:8443/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/564317/%E7%94%B5%E5%AD%90%E7%A8%8E%E5%8A%A1%E5%B1%80%E6%95%B0%E7%94%B5%E5%8F%91%E7%A5%A8%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/564317/%E7%94%B5%E5%AD%90%E7%A8%8E%E5%8A%A1%E5%B1%80%E6%95%B0%E7%94%B5%E5%8F%91%E7%A5%A8%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化函数
    function init() {
        // 检查当前URL是否包含invoice-query/invoice-query
        if (!window.location.href.includes('invoice-query/invoice-query')) {
            console.log('当前页面不是发票查询页面，不显示工具');
            return;
        }
        
        // 添加UI样式
        GM_addStyle(`
            #invoice-downloader {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 600px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 9999;
                font-family: Arial, sans-serif;
            }
            #invoice-downloader .header {
                background: #f5f5f5;
                padding: 15px;
                border-bottom: 1px solid #ddd;
                border-radius: 8px 8px 0 0;
                font-weight: bold;
                font-size: 16px;
            }
            #invoice-downloader .content {
                padding: 15px;
                max-height: 400px;
                overflow-y: auto;
            }
            #invoice-downloader textarea {
                width: 100%;
                height: 100px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                resize: vertical;
                margin-bottom: 10px;
            }
            #invoice-downloader button {
                background: #1890ff;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
            }
            #invoice-downloader button:hover {
                background: #40a9ff;
            }
            #invoice-downloader .result-list {
                margin-top: 15px;
                border-top: 1px solid #eee;
                padding-top: 10px;
            }
            #invoice-downloader .result-item {
                padding: 8px;
                border-bottom: 1px solid #f0f0f0;
                font-size: 14px;
            }
            #invoice-downloader .result-item.success {
                color: #52c41a;
            }
            #invoice-downloader .result-item.error {
                color: #ff4d4f;
            }
            #invoice-downloader .status {
                margin-top: 10px;
                padding: 10px;
                background: #fafafa;
                border-radius: 4px;
                font-size: 12px;
                color: #666;
            }
        `);

        // 创建UI元素
        createUI();
    }

    // 创建UI界面
    function createUI() {
        const container = document.createElement('div');
        container.id = 'invoice-downloader';
        container.innerHTML = `
            <div class="header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>发票自动下载工具</span>
                    <button id="toggle-button" class="toggle-button">收起</button>
                </div>
            </div>
            <div class="content">
                    <textarea id="invoice-text" placeholder="请输入包含发票号码的文本"></textarea>
                    <div style="margin-bottom: 10px;">
                        <label style="margin-right: 10px;">查询类型：</label>
                        <select id="query-type-select">
                            <option value="取得发票">取得发票</option>
                            <option value="开具发票">开具发票</option>
                        </select>
                    </div>
                    <div>
                        <button id="start-download">开始下载</button>
                        <button id="clear-all">清空</button>
                    </div>
                    <div class="status" id="download-status">就绪</div>
                    <div class="result-list" id="result-list">
                        <div>已完成下载的发票：</div>
                    </div>
                </div>
        `;
        document.body.appendChild(container);

        // 绑定事件
        document.getElementById('start-download').addEventListener('click', startDownload);
        document.getElementById('clear-all').addEventListener('click', clearAll);
        
        // 绑定展开收起按钮事件
        const toggleButton = document.getElementById('toggle-button');
        const contentDiv = container.querySelector('.content');
        let isExpanded = true;
        
        toggleButton.addEventListener('click', function() {
            isExpanded = !isExpanded;
            if (isExpanded) {
                contentDiv.style.display = 'block';
                toggleButton.textContent = '收起';
            } else {
                contentDiv.style.display = 'none';
                toggleButton.textContent = '展开';
            }
        });
        
        // 初始状态：如果没有任务，自动收起
        autoCollapse();
    }
    
    // 自动收起功能
    function autoCollapse() {
        const contentDiv = document.querySelector('#invoice-downloader .content');
        const toggleButton = document.getElementById('toggle-button');
        const statusElement = document.getElementById('download-status');
        
        if (contentDiv && toggleButton && statusElement) {
            const status = statusElement.textContent;
            if (status === '就绪' || status === '处理完成，成功 0 张，失败 0 张') {
                contentDiv.style.display = 'none';
                toggleButton.textContent = '展开';
            } else {
                contentDiv.style.display = 'block';
                toggleButton.textContent = '收起';
            }
        }
    }
    
    // 确保任务执行时始终展开
    function ensureExpanded() {
        const contentDiv = document.querySelector('#invoice-downloader .content');
        const toggleButton = document.getElementById('toggle-button');
        if (contentDiv && toggleButton) {
            contentDiv.style.display = 'block';
            toggleButton.textContent = '收起';
        }
    }

    // 从文本中提取20位发票号码
    function extractInvoiceNumbers(text) {
        const regex = /\b\d{20}\b/g;
        const matches = text.match(regex);
        return matches ? [...new Set(matches)] : [];
    }

    // 根据发票号码前两位获取日期范围
    function getDateByInvoicePrefix(prefix) {
        // 提取前两位数字
        const prefixNum = parseInt(prefix);
        
        // 检查是否为有效的年份前缀（20-99之间）
        if (prefixNum >= 20 && prefixNum <= 99) {
            // 动态生成年份：20 + 前缀数字
            const year = `20${prefixNum.toString().padStart(2, '0')}`;
            // 返回该年份的完整日期范围
            return {
                startDate: `${year}-01-01`,
                endDate: `${year}-12-31`
            };
        } else {
            // 默认返回当前年月
            const currentYear = new Date().getFullYear();
            const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
            return {
                startDate: `${currentYear}-${currentMonth}-01`,
                endDate: `${currentYear}-${currentMonth}-31`
            };
        }
    }

    // 开始下载流程
    async function startDownload() {
        // 确保任务执行时始终展开
        ensureExpanded();
        
        const text = document.getElementById('invoice-text').value;
        const invoiceNumbers = extractInvoiceNumbers(text);
        
        if (invoiceNumbers.length === 0) {
            alert('未找到有效的20位发票号码');
            return;
        }

        const statusElement = document.getElementById('download-status');
        const resultList = document.getElementById('result-list');
        
        statusElement.textContent = `开始处理 ${invoiceNumbers.length} 张发票`;
        
        // 清空结果列表
        resultList.innerHTML = '<div>已完成下载的发票：</div>';

        // 按年份分组发票
        const invoicesByYear = {};
        for (const invoiceNumber of invoiceNumbers) {
            const yearPrefix = invoiceNumber.substring(0, 2);
            if (!invoicesByYear[yearPrefix]) {
                invoicesByYear[yearPrefix] = [];
            }
            invoicesByYear[yearPrefix].push(invoiceNumber);
        }
        
        console.log('按年份分组结果：', invoicesByYear);
        
        let totalSuccess = 0;
        let totalError = 0;
        
        // 按年份批量处理发票
        for (const [yearPrefix, yearInvoices] of Object.entries(invoicesByYear)) {
            statusElement.textContent = `处理 ${yearPrefix}年发票：共 ${yearInvoices.length} 张`;
            console.log(`开始处理 ${yearPrefix}年发票，共 ${yearInvoices.length} 张：`, yearInvoices);
            
            // 获取该年份的日期范围 - 使用正确的函数
            const dateRange = getDateByInvoicePrefix(yearPrefix);
            console.log(`${yearPrefix}年日期范围：`, dateRange);
            
            // 批量处理该年份的发票
            for (let i = 0; i < yearInvoices.length; i++) {
                const invoiceNumber = yearInvoices[i];
                statusElement.textContent = `处理 ${yearPrefix}年发票：${invoiceNumber} (${i + 1}/${yearInvoices.length})`;
                
                try {
                    // 填写表单并下载
                    await downloadInvoice(invoiceNumber, dateRange);
                    
                    // 添加成功记录
                    const successItem = document.createElement('div');
                    successItem.className = 'result-item success';
                    successItem.textContent = `✓ ${invoiceNumber} - 下载成功`;
                    resultList.appendChild(successItem);
                    
                    totalSuccess++;
                    
                    // 等待一段时间，避免请求过于频繁
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    // 添加错误记录
                    const errorItem = document.createElement('div');
                    errorItem.className = 'result-item error';
                    errorItem.textContent = `✗ ${invoiceNumber} - 下载失败: ${error.message}`;
                    resultList.appendChild(errorItem);
                    
                    totalError++;
                }
            }
            
            // 处理完一年的发票后，等待一段时间
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        statusElement.textContent = `处理完成，成功 ${totalSuccess} 张，失败 ${totalError} 张`;
        
        // 任务完成后，检查是否需要自动收起
        setTimeout(() => {
            autoCollapse();
        }, 2000);
    }

    // 查找包含特定文本的元素
    function findElementByText(tagName, text) {
        const elements = document.getElementsByTagName(tagName);
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.includes(text)) {
                return elements[i];
            }
        }
        return null;
    }

    // 检查页面状态
    function checkPageStatus() {
        // 检查是否有会话失效的提示
        const errorMessages = document.querySelector('.error-message') || 
                              document.querySelector('.message-error') ||
                              document.querySelector('.t-message__content');
        if (errorMessages && errorMessages.textContent.includes('会话已失效')) {
            throw new Error('会话已失效，请刷新页面');
        }
        
        // 检查是否存在发票查询表单
        const invoiceForm = document.querySelector('.g-filter-wrapper') || 
                           document.querySelector('form');
        if (!invoiceForm) {
            console.warn('未检测到发票查询表单，但继续尝试');
        }
    }

    // 下载单个发票
    async function downloadInvoice(invoiceNumber, dateRange) {
        // 检查页面状态
        checkPageStatus();
        
        // 获取用户选择的查询类型
        const userSelectedQueryType = document.getElementById('query-type-select').value;
        console.log(`下载发票：${invoiceNumber}，日期范围：${dateRange.startDate} 至 ${dateRange.endDate}，查询类型：${userSelectedQueryType}`);
        
        // 1. 选择查询类型 - 增强版（增加当前状态判断）
        let queryTypeSelect = null;
        let queryTypeFound = false;
        
        console.log(`开始选择查询类型：${userSelectedQueryType}...`);
        
        // 方法1：根据类名选择器查找（优先，因为HTML结构中明确有t-form-item__gjbq类）
        queryTypeSelect = document.querySelector('.t-form-item__gjbq .t-select-input');
        if (!queryTypeSelect) {
            // 方法2：根据查询类型标签查找
            const queryTypeLabels = document.querySelectorAll('label');
            for (const label of queryTypeLabels) {
                if (label.textContent.includes('查询类型')) {
                    const parent = label.parentElement;
                    if (parent) {
                        queryTypeSelect = parent.querySelector('.t-select-input, select');
                        if (queryTypeSelect) break;
                    }
                }
            }
        }
        
        // 方法3：根据截图中的查询类型下拉菜单查找
        if (!queryTypeSelect) {
            queryTypeSelect = document.querySelector('select');
        }
        
        // 方法4：根据下拉菜单的外观查找
        if (!queryTypeSelect) {
            const dropdowns = document.querySelectorAll('.t-select-input, select');
            for (const dropdown of dropdowns) {
                const parent = dropdown.closest('div');
                if (parent && parent.textContent.includes('查询类型')) {
                    queryTypeSelect = dropdown;
                    break;
                }
            }
        }
        
        // 方法5：根据t-select__wrap查找
        if (!queryTypeSelect) {
            const selectWraps = document.querySelectorAll('.t-select__wrap');
            for (const wrap of selectWraps) {
                const parent = wrap.closest('.t-form__item');
                if (parent && parent.className.includes('t-form-item__gjbq')) {
                    queryTypeSelect = wrap.querySelector('.t-select-input');
                    if (queryTypeSelect) break;
                }
            }
        }
        
        console.log('查询类型选择器状态:', queryTypeSelect ? '找到' : '未找到');
        
        if (queryTypeSelect) {
            console.log('查询类型选择器详情:', {
                tagName: queryTypeSelect.tagName,
                className: queryTypeSelect.className,
                outerHTML: queryTypeSelect.outerHTML.substring(0, 200) + '...'
            });
            
            // 检查当前是否已经是用户选择的查询类型
            let currentValue = '';
            try {
                // 尝试获取输入框的值（对于自定义下拉选择框）
                const inputElement = queryTypeSelect.querySelector('input');
                if (inputElement) {
                    currentValue = inputElement.value || '';
                } else {
                    currentValue = queryTypeSelect.textContent || queryTypeSelect.value || '';
                }
                console.log('当前查询类型:', currentValue);
                
                if (currentValue.includes(userSelectedQueryType)) {
                    console.log(`✓ 当前已经是${userSelectedQueryType}，不需要重复选择`);
                    queryTypeFound = true;
                } else {
                    console.log(`需要选择${userSelectedQueryType}`);
                    
                    // 滚动到选择器可见
                    queryTypeSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // 点击打开下拉菜单
                    console.log('点击查询类型选择器...');
                    
                    // 尝试点击选择器的不同部分
                    let clicked = false;
                    
                    // 方法1：点击整个选择器
                    try {
                        queryTypeSelect.click();
                        clicked = true;
                        console.log('方法1：点击整个选择器');
                    } catch (e) {
                        console.warn('方法1点击失败:', e.message);
                    }
                    
                    // 方法2：点击输入框
                    if (!clicked) {
                        try {
                            const inputElement = queryTypeSelect.querySelector('input');
                            if (inputElement) {
                                inputElement.click();
                                clicked = true;
                                console.log('方法2：点击输入框');
                            }
                        } catch (e) {
                            console.warn('方法2点击失败:', e.message);
                        }
                    }
                    
                    // 方法3：点击后缀图标
                    if (!clicked) {
                        try {
                            const suffixIcon = queryTypeSelect.querySelector('.t-input__suffix');
                            if (suffixIcon) {
                                suffixIcon.click();
                                clicked = true;
                                console.log('方法3：点击后缀图标');
                            }
                        } catch (e) {
                            console.warn('方法3点击失败:', e.message);
                        }
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 500)); // 调整为500ms
                    
                    // 尝试多种方法查找和选择用户指定的查询类型选项
                    
                    // 方法1：直接查找所有可见的选项元素
                    const allElements = document.querySelectorAll('*');
                    let foundOption = null;
                    
                    for (const element of allElements) {
                        try {
                            if (element.textContent && element.textContent.trim() === userSelectedQueryType && 
                                element.offsetWidth > 0 && 
                                element.offsetHeight > 0 &&
                                // 确保元素是可见的
                                window.getComputedStyle(element).display !== 'none' &&
                                window.getComputedStyle(element).visibility !== 'hidden') {
                                foundOption = element;
                                break;
                            }
                        } catch (e) {
                            // 忽略元素访问错误
                        }
                    }
                    
                    if (foundOption) {
                        console.log(`找到${userSelectedQueryType}选项:`, {
                            tagName: foundOption.tagName,
                            className: foundOption.className,
                            outerHTML: foundOption.outerHTML.substring(0, 200) + '...'
                        });
                        
                        // 滚动到选项可见
                        foundOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(resolve => setTimeout(resolve, 300));
                        
                        // 模拟完整点击
                        try {
                            foundOption.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            foundOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            foundOption.click();
                            await new Promise(resolve => setTimeout(resolve, 800)); // 增加等待时间
                            
                            foundOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                            await new Promise(resolve => setTimeout(resolve, 100));
                            
                            console.log(`已选择查询类型：${userSelectedQueryType}`);
                            queryTypeFound = true;
                        } catch (e) {
                            console.warn('点击选项失败:', e.message);
                            // 尝试直接点击
                            try {
                                foundOption.click();
                                await new Promise(resolve => setTimeout(resolve, 800));
                                console.log(`已直接点击选择${userSelectedQueryType}`);
                                queryTypeFound = true;
                            } catch (e2) {
                                console.error('直接点击也失败:', e2.message);
                            }
                        }
                    } else {
                        // 方法2：尝试通过键盘操作选择
                        console.log(`尝试通过键盘操作选择${userSelectedQueryType}...`);
                        
                        // 模拟按下向下箭头键
                        const downArrowEvent = new KeyboardEvent('keydown', {
                            key: 'ArrowDown',
                            keyCode: 40,
                            bubbles: true
                        });
                        
                        // 模拟按下回车键
                        const enterEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            keyCode: 13,
                            bubbles: true
                        });
                        
                        // 尝试按下几次向下箭头键，然后按回车键
                        for (let i = 0; i < 5; i++) {
                            queryTypeSelect.dispatchEvent(downArrowEvent);
                            await new Promise(resolve => setTimeout(resolve, 200));
                        }
                        
                        queryTypeSelect.dispatchEvent(enterEvent);
                        await new Promise(resolve => setTimeout(resolve, 800));
                        
                        console.log('已尝试通过键盘操作选择查询类型');
                    }
                    
                    // 验证选择是否成功
                    await new Promise(resolve => setTimeout(resolve, 500));
                    let selectedText = '';
                    
                    try {
                        // 再次尝试获取输入框的值
                        const inputElement = queryTypeSelect.querySelector('input');
                        if (inputElement) {
                            selectedText = inputElement.value || '';
                        } else {
                            selectedText = queryTypeSelect.textContent || queryTypeSelect.value || '';
                        }
                        console.log('当前查询类型选择:', selectedText);
                        
                        if (selectedText.includes(userSelectedQueryType)) {
                            console.log(`验证成功：已选择${userSelectedQueryType}`);
                        } else {
                            console.warn(`验证失败：未选择${userSelectedQueryType}，当前选择：`, selectedText);
                            
                            // 再次尝试选择用户指定的查询类型
                            console.log(`再次尝试选择${userSelectedQueryType}...`);
                            
                            // 重新点击打开下拉菜单
                            try {
                                queryTypeSelect.click();
                                await new Promise(resolve => setTimeout(resolve, 800));
                                
                                // 再次查找用户指定的查询类型选项
                                const allElements = document.querySelectorAll('*');
                                let foundOption = null;
                                
                                for (const element of allElements) {
                                    try {
                                        if (element.textContent && element.textContent.trim() === userSelectedQueryType && 
                                            element.offsetWidth > 0 && 
                                            element.offsetHeight > 0) {
                                            foundOption = element;
                                            break;
                                        }
                                    } catch (e) {
                                        // 忽略元素访问错误
                                    }
                                }
                                
                                if (foundOption) {
                                    console.log(`再次找到${userSelectedQueryType}选项，尝试点击...`);
                                    try {
                                        foundOption.click();
                                        await new Promise(resolve => setTimeout(resolve, 800));
                                        console.log(`已再次尝试选择${userSelectedQueryType}`);
                                    } catch (e) {
                                        console.warn('再次点击失败:', e.message);
                                    }
                                }
                            } catch (e) {
                                console.warn('再次打开下拉菜单失败:', e.message);
                            }
                        }
                    } catch (error) {
                        console.error('验证查询类型选择时出错:', error.message);
                    }
                }
            } catch (error) {
                console.error('检查查询类型时出错:', error.message);
            }
        } else {
            console.error('未找到查询类型选择器');
        }
        
        // 等待查询类型选择完成
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 2. 填写发票号码
        const invoiceInput = document.querySelector('input.t-input__inner[placeholder*="请输入"]');
        if (invoiceInput) {
            invoiceInput.value = invoiceNumber;
            // 触发输入事件
            invoiceInput.dispatchEvent(new Event('input', { bubbles: true }));
            invoiceInput.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('已填写发票号码');
        } else {
            throw new Error('未找到发票号码输入框');
        }
        
        // 3. 选择日期范围 - 终极增强版
        let startDateInput = null;
        let endDateInput = null;
        
        console.log('开始选择日期范围：', dateRange);
        
        // 方法1：根据placeholder属性查找日期输入框（优先）
        const allInputs = document.querySelectorAll('input');
        for (const input of allInputs) {
            const placeholder = input.placeholder || '';
            if (placeholder === '开票日期起' && !startDateInput) {
                startDateInput = input;
                console.log('方法1找到开始日期输入框（通过placeholder）');
            } else if (placeholder === '开票日期止' && !endDateInput) {
                endDateInput = input;
                console.log('方法1找到结束日期输入框（通过placeholder）');
            }
        }
        
        // 方法2：根据标签文本查找日期输入框
        if (!startDateInput || !endDateInput) {
            const dateLabels = document.querySelectorAll('label');
            for (const label of dateLabels) {
                if (label.textContent.includes('开票日期') && label.textContent.includes('起')) {
                    const parent = label.closest('div');
                    if (parent) {
                        startDateInput = parent.querySelector('input');
                        console.log('方法2找到开始日期输入框（通过标签）');
                    }
                } else if (label.textContent.includes('开票日期') && label.textContent.includes('止')) {
                    const parent = label.closest('div');
                    if (parent) {
                        endDateInput = parent.querySelector('input');
                        console.log('方法2找到结束日期输入框（通过标签）');
                    }
                }
            }
        }
        
        // 方法3：根据位置查找日期输入框
        if (!startDateInput || !endDateInput) {
            const dateInputs = document.querySelectorAll('input.t-input__inner');
            console.log('找到的输入框数量：', dateInputs.length);
            if (dateInputs.length >= 2) {
                startDateInput = dateInputs[1];
                if (dateInputs.length >= 3) {
                    endDateInput = dateInputs[2];
                }
                console.log('方法3找到日期输入框（通过位置）');
            }
        }
        
        // 方法4：根据placeholder关键词查找日期输入框
        if (!startDateInput || !endDateInput) {
            for (const input of allInputs) {
                const placeholder = input.placeholder || '';
                if ((placeholder.includes('开始') || placeholder.includes('起始') || placeholder.includes('from')) && !startDateInput) {
                    startDateInput = input;
                    console.log('方法4找到开始日期输入框（通过placeholder关键词）');
                } else if ((placeholder.includes('结束') || placeholder.includes('至') || placeholder.includes('to')) && !endDateInput) {
                    endDateInput = input;
                    console.log('方法4找到结束日期输入框（通过placeholder关键词）');
                }
            }
        }
        
        // 方法5：根据值查找日期输入框（如果已有默认值）
        if (!startDateInput || !endDateInput) {
            for (const input of allInputs) {
                const value = input.value || '';
                if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    if (!startDateInput) {
                        startDateInput = input;
                        console.log('方法5找到开始日期输入框（通过默认值）');
                    } else if (!endDateInput) {
                        endDateInput = input;
                        console.log('方法5找到结束日期输入框（通过默认值）');
                    }
                }
            }
        }
        
        console.log('日期输入框状态:', {
            startDateInput: startDateInput ? '找到' : '未找到',
            endDateInput: endDateInput ? '找到' : '未找到'
        });
        
        // 重写日期选择逻辑 - 开始日期
        if (startDateInput) {
            console.log('开始选择开始日期：', dateRange.startDate);
            
            // 1. 直接设置输入框值
            startDateInput.value = dateRange.startDate;
            console.log('直接设置开始日期值：', startDateInput.value);
            
            // 2. 触发必要的事件
            startDateInput.dispatchEvent(new Event('focus', { bubbles: true }));
            startDateInput.dispatchEvent(new Event('input', { bubbles: true }));
            startDateInput.dispatchEvent(new Event('change', { bubbles: true }));
            startDateInput.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // 3. 模拟键盘事件
            startDateInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            startDateInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
            
            // 4. 等待事件处理
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('已设置开始日期:', startDateInput.value);
        }
        
        // 重写日期选择逻辑 - 结束日期
        if (endDateInput) {
            console.log('开始选择结束日期：', dateRange.endDate);
            
            // 1. 直接设置输入框值
            endDateInput.value = dateRange.endDate;
            console.log('直接设置结束日期值：', endDateInput.value);
            
            // 2. 触发必要的事件
            endDateInput.dispatchEvent(new Event('focus', { bubbles: true }));
            endDateInput.dispatchEvent(new Event('input', { bubbles: true }));
            endDateInput.dispatchEvent(new Event('change', { bubbles: true }));
            endDateInput.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // 3. 模拟键盘事件
            endDateInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            endDateInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
            
            // 4. 等待事件处理
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('已设置结束日期:', endDateInput.value);
        }
        
        // 5. 再次验证日期设置
        if (startDateInput && endDateInput) {
            console.log('日期设置验证:', {
                startDate: startDateInput.value,
                endDate: endDateInput.value,
                expectedStart: dateRange.startDate,
                expectedEnd: dateRange.endDate
            });
            
            // 确保日期值正确
            if (startDateInput.value !== dateRange.startDate) {
                console.warn('开始日期设置失败，再次尝试...');
                startDateInput.value = dateRange.startDate;
                startDateInput.dispatchEvent(new Event('change', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            if (endDateInput.value !== dateRange.endDate) {
                console.warn('结束日期设置失败，再次尝试...');
                endDateInput.value = dateRange.endDate;
                endDateInput.dispatchEvent(new Event('change', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            console.log('最终日期设置:', {
                startDate: startDateInput.value,
                endDate: endDateInput.value
            });
        }
        
        // 验证日期设置是否成功
        if (startDateInput && endDateInput) {
            console.log('日期设置验证:', {
                startDate: startDateInput.value,
                endDate: endDateInput.value
            });
            
            if (startDateInput.value !== dateRange.startDate || endDateInput.value !== dateRange.endDate) {
                console.warn('日期设置可能失败，显示当前值:', {
                    startDate: startDateInput.value,
                    endDate: endDateInput.value,
                    expectedStart: dateRange.startDate,
                    expectedEnd: dateRange.endDate
                });
            }
        }
        
        // 4. 点击查询按钮 - 使用多种方法定位
        let queryButton = null;
        
        // 方法1：通过精确的类名选择器
        queryButton = document.querySelector('button.t-button.t-button--variant-base.t-button--theme-primary[type="submit"]');
        console.log('方法1 - 通过类名选择器查找:', queryButton ? '找到' : '未找到');
        
        // 方法2：通过表单内的按钮
        if (!queryButton) {
            const formButtons = document.querySelectorAll('.t-form button');
            for (const button of formButtons) {
                if (button.textContent.includes('查询')) {
                    queryButton = button;
                    console.log('方法2 - 在表单内找到查询按钮');
                    break;
                }
            }
        }
        
        // 方法3：查找包含查询文本的所有按钮
        if (!queryButton) {
            const allButtons = document.querySelectorAll('button');
            for (const button of allButtons) {
                const text = button.textContent.trim();
                if (text === '查询' && button.className.includes('t-button--variant-base')) {
                    queryButton = button;
                    console.log('方法3 - 通过文本找到查询按钮');
                    break;
                }
            }
        }
        
        // 方法4：通过父容器查找
        if (!queryButton) {
            const filterWrapper = document.querySelector('.g-filter-wrapper');
            if (filterWrapper) {
                const wrapperButtons = filterWrapper.querySelectorAll('button');
                for (const button of wrapperButtons) {
                    if (button.textContent.trim() === '查询') {
                        queryButton = button;
                        console.log('方法4 - 在筛选容器中找到查询按钮');
                        break;
                    }
                }
            }
        }
        
        // 方法5：通过span文本查找父按钮
        if (!queryButton) {
            const querySpans = document.querySelectorAll('span.t-button__text');
            for (const span of querySpans) {
                if (span.textContent.trim() === '查询') {
                    queryButton = span.closest('button');
                    console.log('方法5 - 通过span文本找到查询按钮');
                    break;
                }
            }
        }
        
        // 方法6：查找页面中所有包含"查询"文本的按钮
        if (!queryButton) {
            const allButtons = Array.from(document.querySelectorAll('button'));
            for (const button of allButtons) {
                if (button.textContent.trim() === '查询') {
                    queryButton = button;
                    console.log('方法6 - 遍历所有按钮找到查询按钮');
                    break;
                }
            }
        }
        
        if (queryButton) {
            console.log('找到查询按钮:', {
                tagName: queryButton.tagName,
                className: queryButton.className,
                type: queryButton.type,
                textContent: queryButton.textContent.trim()
            });
            
            // 尝试滚动到按钮可见
            queryButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 检查按钮是否可见
            const rect = queryButton.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                rect.width > 0 &&
                rect.height > 0
            );
            console.log('查询按钮是否可见:', isVisible);
            
            // 移除阻止默认行为的代码，允许页面正常提交
            // 模拟更真实的用户点击
            console.log('准备点击查询按钮...');
            
            // 首先触发鼠标移动到按钮上
            queryButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            queryButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 触发鼠标按下
            queryButton.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                button: 0,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }));
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // 触发点击
            queryButton.click();
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // 触发鼠标释放
            queryButton.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                button: 0,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 触发鼠标离开
            queryButton.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, cancelable: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('已点击查询按钮，等待页面响应...');
        } else {
            console.error('未找到查询按钮，尝试列出所有按钮进行调试:');
            const allButtons = document.querySelectorAll('button');
            allButtons.forEach((btn, index) => {
                console.log(`按钮${index}: ${btn.textContent.trim()} - 类名: ${btn.className}`);
            });
            throw new Error('未找到查询按钮');
        }
        
        // 等待查询结果加载 - 优化版
        console.log('等待查询结果...');
        
        // 动态等待查询结果，最多等待5秒
        let hasResults = false;
        let queryAttempts = 0;
        const maxQueryAttempts = 5;
        
        while (!hasResults && queryAttempts < maxQueryAttempts) {
            queryAttempts++;
            
            // 检查是否查询到结果
            const tableRows = document.querySelectorAll('tr.t-table__row, .t-table-row, tr');
            for (const row of tableRows) {
                if (row.textContent.includes(invoiceNumber)) {
                    console.log('找到查询结果行');
                    hasResults = true;
                    break;
                }
            }
            
            // 检查是否有错误信息
            const errorMessages = document.querySelectorAll('.error-message, .t-message__content, .g-error');
            for (const error of errorMessages) {
                if (error.textContent.trim()) {
                    console.warn('查询可能出错:', error.textContent.trim());
                }
            }
            
            if (!hasResults) {
                console.log(`等待查询结果 (${queryAttempts}/${maxQueryAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 500)); // 减少等待时间
            }
        }
        
        console.log('查询结果状态:', { hasResults });
        
        // 5. 点击操作按钮 - 超级增强版，支持更多检测策略
        let actionButton = null;
        let attempts = 0;
        const maxAttempts = 5;
        
        // 根据查询类型确定按钮文本
        const buttonText = userSelectedQueryType === '开具发票' ? '交付' : '下载';
        console.log(`查询类型为${userSelectedQueryType}，需要查找${buttonText}按钮`);
        
        while (!actionButton && attempts < maxAttempts) {
            attempts++;
            console.log(`尝试找到${buttonText}按钮 (${attempts}/${maxAttempts})`);
            
            // 方法1：精确查找用户点击的按钮（根据监控日志）
            const actionSpans = document.querySelectorAll('span.button-text.primary-button__text');
            for (const span of actionSpans) {
                if (span.textContent.trim() === buttonText) {
                    actionButton = span;
                    console.log(`方法1找到${buttonText}按钮`);
                    break;
                }
            }
            
            // 方法2：查找包含发票号码的行中的操作按钮（最可能的位置）
            if (!actionButton) {
                const rows = document.querySelectorAll('tr');
                for (const row of rows) {
                    if (row.textContent.includes(invoiceNumber)) {
                        const actionSpans = row.querySelectorAll('span');
                        for (const span of actionSpans) {
                            if (span.textContent.trim() === buttonText) {
                                actionButton = span;
                                console.log(`方法2找到${buttonText}按钮`);
                                break;
                            }
                        }
                        if (actionButton) break;
                    }
                }
            }
            
            // 方法3：查找表格中的操作按钮
            if (!actionButton) {
                const tableCells = document.querySelectorAll('td.t-table__cell--fixed-right span, span');
                for (const span of tableCells) {
                    if (span.textContent.trim() === buttonText && span.closest('tr')) {
                        actionButton = span;
                        console.log(`方法3找到${buttonText}按钮`);
                        break;
                    }
                }
            }
            
            // 方法4：通用查找所有包含按钮文本的元素
            if (!actionButton) {
                const allElements = document.querySelectorAll('span, button');
                for (const element of allElements) {
                    if (element.textContent.trim() === buttonText && 
                        element.offsetWidth > 0 &&
                        element.offsetHeight > 0) {
                        actionButton = element;
                        console.log(`方法4找到${buttonText}按钮`);
                        break;
                    }
                }
            }
            
            // 记录当前页面状态
            if (!actionButton && attempts === maxAttempts - 1) {
                console.log('当前页面状态:', {
                    hasResults: hasResults,
                    tableRowsCount: document.querySelectorAll('tr').length,
                    spansCount: document.querySelectorAll('span').length,
                    buttonsCount: document.querySelectorAll('button').length
                });
            }
            
            if (!actionButton) {
                console.log(`未找到${buttonText}按钮，等待1秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 减少等待时间
            }
        }
        
        if (actionButton) {
            console.log(`找到${buttonText}按钮:`, {
                tagName: actionButton.tagName,
                className: actionButton.className,
                textContent: actionButton.textContent.trim(),
                offsetWidth: actionButton.offsetWidth,
                offsetHeight: actionButton.offsetHeight
            });
            
            // 滚动到按钮可见
            actionButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 检查按钮是否可见
            const rect = actionButton.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                rect.width > 0 &&
                rect.height > 0
            );
            console.log('按钮是否可见:', isVisible);
            
            // 模拟完整点击
            console.log(`开始模拟点击${buttonText}按钮...`);
            actionButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            actionButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            actionButton.click();
            console.log(`已执行${buttonText}按钮点击`);
            await new Promise(resolve => setTimeout(resolve, 500)); // 调整为500ms
            
            actionButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log(`已完成${buttonText}按钮点击操作，等待弹出窗口...`);
        } else {
            // 列出所有可能的操作按钮供调试
            const allPossibleButtons = document.querySelectorAll('span, button');
            const actionElements = [];
            for (const element of allPossibleButtons) {
                if ((element.textContent.includes(buttonText) || element.textContent.includes('下载') || element.textContent.includes('交付')) && 
                    element.offsetWidth > 0 && 
                    element.offsetHeight > 0) {
                    actionElements.push({
                        tagName: element.tagName,
                        className: element.className,
                        textContent: element.textContent.trim(),
                        outerHTML: element.outerHTML.substring(0, 200) + '...'
                    });
                }
            }
            
            // 列出所有表格行供调试
            const tableRows = document.querySelectorAll('tr');
            const rowInfos = [];
            for (let i = 0; i < Math.min(tableRows.length, 10); i++) {
                const row = tableRows[i];
                rowInfos.push({
                    index: i,
                    hasInvoiceNumber: row.textContent.includes(invoiceNumber),
                    hasActionText: row.textContent.includes(buttonText) || row.textContent.includes('下载') || row.textContent.includes('交付'),
                    textContent: row.textContent.substring(0, 100) + '...'
                });
            }
            
            console.error(`最终未找到${buttonText}按钮，以下是页面信息:`);
            console.error(`1. 包含"${buttonText}"的元素:`, actionElements);
            console.error('2. 表格行信息:', rowInfos);
            console.error('3. 页面状态:', {
                hasResults: hasResults,
                tableRowsCount: tableRows.length,
                actionElementsCount: actionElements.length,
                invoiceNumber: invoiceNumber
            });
            
            // 生成详细的错误信息
            let errorMessage = `未找到${buttonText}按钮`;
            if (actionElements.length > 0) {
                errorMessage += `，但页面中存在 ${actionElements.length} 个包含相关操作的元素`;
            } else if (tableRows.length > 0) {
                errorMessage += `，但页面中存在 ${tableRows.length} 个表格行`;
            } else {
                errorMessage += '，且页面中未检测到表格行';
            }
            
            throw new Error(errorMessage);
        }
        
        // 等待操作对话框出现 - 超级增强版
        console.log(`等待${buttonText}对话框出现...`);
        let dialogVisible = false;
        let dialogAttempts = 0;
        const maxDialogAttempts = 8;

        
        while (!dialogVisible && dialogAttempts < maxDialogAttempts) {
            dialogAttempts++;
            
            // 检测弹出窗口（多种选择器策略）
            let dialog = null;
            
            // 策略1：查找主要对话框容器
            dialog = document.querySelector('.t-dialog, .t-dialog__modal-default');
            if (dialog && dialog.offsetWidth > 0 && dialog.offsetHeight > 0) {
                dialogVisible = true;
                console.log(`策略1检测到对话框，类名:`, dialog.className);
                break;
            }
            
            // 策略2：查找对话框内容区域
            dialog = document.querySelector('.dialog_body__wrap, .t-dialog__body');
            if (dialog && dialog.offsetWidth > 0 && dialog.offsetHeight > 0) {
                dialogVisible = true;
                console.log(`策略2检测到对话框内容，类名:`, dialog.className);
                break;
            }
            
            // 策略3：查找带有特定属性的对话框
            dialog = document.querySelector('[class*="dialog"], [class*="Dialog"]');
            if (dialog && dialog.offsetWidth > 0 && dialog.offsetHeight > 0) {
                dialogVisible = true;
                console.log(`策略3检测到对话框，类名:`, dialog.className);
                break;
            }
            
            // 策略4：检查页面是否有新元素添加
            const allElements = document.querySelectorAll('*');
            console.log(`策略4：页面元素总数:`, allElements.length);
            
            console.log(`等待对话框出现 (${dialogAttempts}/${maxDialogAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 500));

        }
        
        if (!dialogVisible) {
            console.warn('未检测到对话框，但继续尝试查找操作按钮');
            // 尝试列出所有可能的对话框元素
            const possibleDialogs = document.querySelectorAll('.t-dialog, .dialog_body__wrap, .t-dialog__body, [class*="dialog"]');
            console.log('可能的对话框元素:', possibleDialogs.length);
            possibleDialogs.forEach((d, index) => {
                console.log(`对话框${index}:`, d.className, '可见:', d.offsetWidth > 0 && d.offsetHeight > 0);
            });
        }
        
        // 6. 点击操作按钮 - 超级增强版，支持更多按钮检测策略
        let actionDialogButton = null;
        let actionAttempts = 0;
        const maxActionAttempts = 10;
        
        while (!actionDialogButton && actionAttempts < maxActionAttempts) {
            actionAttempts++;
            console.log(`尝试找到操作按钮 (${actionAttempts}/${maxActionAttempts})`);
            
            // 方法1：精确查找PDF下载按钮（根据用户提供的HTML结构）
            const pdfButtons = document.querySelectorAll('button');
            for (const button of pdfButtons) {
                if (button.textContent.includes('发票下载PDF')) {
                    actionDialogButton = button;
                    console.log('方法1找到PDF下载按钮:', button.textContent.trim());
                    break;
                }
            }
            
            // 方法2：查找包含PDF图标的按钮
            if (!actionDialogButton) {
                const pdfIcons = document.querySelectorAll('.t-icon-file-pdf, svg[class*="pdf"]');
                for (const icon of pdfIcons) {
                    const button = icon.closest('button');
                    if (button) {
                        actionDialogButton = button;
                        console.log('方法2找到PDF图标按钮:', button.textContent.trim());
                        break;
                    }
                }
            }
            
            // 方法3：查找对话框中的所有按钮
            if (!actionDialogButton) {
                const dialog = document.querySelector('.t-dialog__body, .dialog_body__wrap');
                if (dialog) {
                    const dialogButtons = dialog.querySelectorAll('button');
                    console.log('方法3：对话框中找到按钮数量:', dialogButtons.length);
                    for (const button of dialogButtons) {
                        if (button.offsetWidth > 0 && button.offsetHeight > 0) {
                            console.log('  按钮文本:', button.textContent.trim());
                            console.log('  按钮类名:', button.className);
                            // 优先选择包含PDF或下载的按钮
                            if (button.textContent.includes('PDF') || button.textContent.includes('下载')) {
                                actionDialogButton = button;
                                console.log('方法3找到操作按钮:', button.textContent.trim());
                                break;
                            }
                        }
                    }
                }
            }
            
            // 方法4：查找所有可见的按钮
            if (!actionDialogButton) {
                const allButtons = document.querySelectorAll('button');
                console.log('方法4：页面中找到按钮数量:', allButtons.length);
                for (const button of allButtons) {
                    if (button.offsetWidth > 0 && button.offsetHeight > 0) {
                        const buttonText = button.textContent.trim();
                        console.log('  可见按钮:', buttonText, '- 类名:', button.className);
                        // 优先选择包含PDF、下载或交付的按钮
                        if (buttonText.includes('PDF') || buttonText.includes('下载') || buttonText.includes('交付')) {
                            actionDialogButton = button;
                            console.log('方法4找到操作按钮:', buttonText);
                            break;
                        }
                    }
                }
            }
            
            // 方法5：查找带有特定类名的按钮
            if (!actionDialogButton) {
                const styledButtons = document.querySelectorAll('.t-button--variant-text.t-button--theme-primary');
                for (const button of styledButtons) {
                    if (button.offsetWidth > 0 && button.offsetHeight > 0) {
                        actionDialogButton = button;
                        console.log('方法5找到样式按钮:', button.textContent.trim());
                        break;
                    }
                }
            }
            
            if (!actionDialogButton) {
                console.log('未找到操作按钮，等待300毫秒后重试...');
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        if (actionDialogButton) {
            console.log('找到操作按钮:', {
                tagName: actionDialogButton.tagName,
                className: actionDialogButton.className,
                textContent: actionDialogButton.textContent.trim(),
                offsetWidth: actionDialogButton.offsetWidth,
                offsetHeight: actionDialogButton.offsetHeight
            });
            
            // 滚动到按钮可见
            console.log('滚动到操作按钮可见位置...');
            actionDialogButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 检查按钮是否可见
            const rect = actionDialogButton.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
                rect.width > 0 &&
                rect.height > 0
            );
            console.log('操作按钮是否可见:', isVisible);
            console.log('按钮位置信息:', {
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right,
                width: rect.width,
                height: rect.height
            });
            
            // 模拟完整点击
            console.log('开始模拟点击操作按钮...');
            actionDialogButton.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 200));
            
            actionDialogButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 200));
            
            actionDialogButton.click();
            console.log('已执行操作按钮点击');
            await new Promise(resolve => setTimeout(resolve, 500)); // 调整为500ms
            
            actionDialogButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log('已完成操作按钮点击，等待下载开始...');
            await new Promise(resolve => setTimeout(resolve, 500)); // 调整为500ms
        } else {
            // 列出所有可能的操作按钮供调试
            const allPossibleButtons = document.querySelectorAll('button');
            const actionElements = [];
            for (const button of allPossibleButtons) {
                if ((button.textContent.includes('PDF') || button.textContent.includes('下载') || button.textContent.includes('交付') || button.textContent.includes('发票')) && 
                    button.offsetWidth > 0 && 
                    button.offsetHeight > 0) {
                    actionElements.push({
                        tagName: button.tagName,
                        className: button.className,
                        textContent: button.textContent.trim(),
                        outerHTML: button.outerHTML.substring(0, 200) + '...'
                    });
                }
            }
            console.error('最终未找到操作按钮，以下是可能的按钮:', actionElements);
            
            // 尝试点击第一个可见按钮
            const firstVisibleButton = document.querySelector('button');
            if (firstVisibleButton) {
                console.log('尝试点击第一个可见按钮:', firstVisibleButton.textContent.trim());
                firstVisibleButton.click();
            } else {
                throw new Error('未找到操作按钮');
            }
        }
        
        // 等待下载完成 - 超级优化版
        console.log('等待下载完成...');
        
        // 检测下载状态
        let downloadComplete = false;
        let downloadAttempts = 0;
        const maxDownloadAttempts = 20;
        
        while (!downloadComplete && downloadAttempts < maxDownloadAttempts) {
            downloadAttempts++;
            
            // 检查是否有新的下载开始
            const activeDownloads = document.querySelectorAll('.download-progress, .t-progress, [class*="progress"]');
            if (activeDownloads.length > 0) {
                console.log('检测到下载进度条，下载正在进行...');
                downloadComplete = true;
                break;
            }
            
            // 检查是否有下载完成的提示
            const successMessages = document.querySelectorAll('.success-message, .t-message__content, .t-message, [class*="message"]');
            for (const message of successMessages) {
                if (message.textContent.includes('成功') || message.textContent.includes('完成') || message.textContent.includes('下载') || message.textContent.includes('已交付')) {
                    console.log('检测到下载成功提示:', message.textContent.trim());
                    downloadComplete = true;
                    break;
                }
            }
            
            // 检查是否有文件保存对话框
            const dialogs = document.querySelectorAll('.t-dialog, .dialog, [class*="dialog"]');
            if (dialogs.length > 0) {
                console.log('检测到可能的文件保存对话框，下载可能已完成...');
                downloadComplete = true;
                break;
            }
            
            if (!downloadComplete) {
                console.log(`等待下载完成 (${downloadAttempts}/${maxDownloadAttempts})`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // 额外的等待时间确保下载完成
        if (downloadComplete) {
            console.log('下载已完成，等待文件保存...');
            await new Promise(resolve => setTimeout(resolve, 500)); // 调整为500ms
        } else {
            console.warn('下载超时，但假设下载已完成');
            await new Promise(resolve => setTimeout(resolve, 500)); // 调整为500ms
        }
        
        console.log('发票下载完成');
        
        // 清理：关闭可能的弹出窗口
        const closeButtons = document.querySelectorAll('.t-dialog__close, .dialog-close');
        for (const closeButton of closeButtons) {
            if (closeButton.offsetWidth > 0 && closeButton.offsetHeight > 0) {
                try {
                    closeButton.click();
                    console.log('已关闭弹出窗口');
                } catch (e) {
                    console.log('关闭窗口时出错:', e.message);
                }
            }
        }
    }

    // 选择日期组件（年、月、日）
    async function selectDateComponent(type, value) {
        console.log(`开始选择${type}：`, value);
        
        try {
            if (type === 'year') {
                // 选择年份
                console.log('尝试选择年份：', value);
                
                // 方法1：找到年份选择器（通用选择器）
                const yearSelectors = document.querySelectorAll('div[class*="year"], div[class*="Year"]');
                console.log('找到年份选择器数量：', yearSelectors.length);
                
                for (const yearSelector of yearSelectors) {
                    try {
                        console.log('尝试年份选择器：', yearSelector.className);
                        yearSelector.click();
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // 找到年份选项
                        const yearOptions = document.querySelectorAll('.t-select-dropdown-menu__item, .t-select-option, li, div[class*="option"]');
                        console.log('找到年份选项数量：', yearOptions.length);
                        
                        for (const option of yearOptions) {
                            try {
                                if (option.textContent && option.textContent.trim() === value.toString()) {
                                    console.log('找到年份选项：', value);
                                    option.click();
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    console.log('已选择年份：', value);
                                    return;
                                }
                            } catch (e) {
                                // 忽略元素访问错误
                            }
                        }
                    } catch (e) {
                        // 忽略元素访问错误
                    }
                }
                
                // 方法2：直接查找并点击包含年份文本的元素
                const allElements = document.querySelectorAll('*');
                for (const element of allElements) {
                    try {
                        if (element.textContent && element.textContent.trim() === value.toString() && 
                            (element.className.includes('date') || element.className.includes('Date'))) {
                            console.log('找到年份元素：', value);
                            element.click();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            console.log('已选择年份：', value);
                            return;
                        }
                    } catch (e) {
                        // 忽略元素访问错误
                    }
                }
            } else if (type === 'month') {
                // 选择月份
                console.log('尝试选择月份：', value);
                
                // 方法1：找到月份选择器（通用选择器）
                const monthSelectors = document.querySelectorAll('div[class*="month"], div[class*="Month"]');
                console.log('找到月份选择器数量：', monthSelectors.length);
                
                for (const monthSelector of monthSelectors) {
                    try {
                        console.log('尝试月份选择器：', monthSelector.className);
                        monthSelector.click();
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        // 找到月份选项
                        const monthOptions = document.querySelectorAll('.t-select-dropdown-menu__item, .t-select-option, li, div[class*="option"]');
                        console.log('找到月份选项数量：', monthOptions.length);
                        
                        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                        const monthName = monthNames[value - 1];
                        console.log('目标月份名称：', monthName);
                        
                        for (const option of monthOptions) {
                            try {
                                if (option.textContent && (option.textContent.trim() === monthName || option.textContent.trim() === value.toString())) {
                                    console.log('找到月份选项：', option.textContent.trim());
                                    option.click();
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    console.log('已选择月份：', monthName);
                                    return;
                                }
                            } catch (e) {
                                // 忽略元素访问错误
                            }
                        }
                    } catch (e) {
                        // 忽略元素访问错误
                    }
                }
            } else if (type === 'day') {
                // 选择日期
                console.log('尝试选择日期：', value);
                
                // 方法1：找到日期单元格（通用选择器）
                const dayCells = document.querySelectorAll('div[class*="cell"], td[class*="cell"]');
                console.log('找到日期单元格数量：', dayCells.length);
                
                for (const cell of dayCells) {
                    try {
                        if (cell.textContent && cell.textContent.trim() === value.toString()) {
                            console.log('找到日期选项：', value);
                            // 直接点击日期单元格
                            cell.click();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            console.log('已选择日期：', value);
                            return;
                        }
                    } catch (e) {
                        // 忽略元素访问错误
                    }
                }
                
                // 方法2：尝试点击包含日期文本的元素
                const allElements = document.querySelectorAll('*');
                for (const element of allElements) {
                    try {
                        if (element.textContent && element.textContent.trim() === value.toString() && 
                            (element.className.includes('date') || element.className.includes('Date'))) {
                            console.log('找到日期元素：', value);
                            element.click();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            console.log('已选择日期：', value);
                            return;
                        }
                    } catch (e) {
                        // 忽略元素访问错误
                    }
                }
            }
        } catch (error) {
            console.error(`选择${type}时出错：`, error.message);
        }
        
        console.warn(`未找到${type}选项：`, value);
    }

    // 清空所有内容
    function clearAll() {
        document.getElementById('invoice-text').value = '';
        document.getElementById('result-list').innerHTML = '<div>已完成下载的发票：</div>';
        document.getElementById('download-status').textContent = '就绪';
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

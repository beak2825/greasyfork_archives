// ==UserScript==
// @name         TikTok Library Advertiser Tracker - 增强版
// @namespace    weixin:eva_mirror
// @version      1.0
// @description  Track and统计 TikTok Library 广告主数据，支持localStorage持久化、数据清除、详情页信息提取
// @author       Sheire
// @match        https://library.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549122/TikTok%20Library%20Advertiser%20Tracker%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/549122/TikTok%20Library%20Advertiser%20Tracker%20-%20%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储广告主数据
    let advertiserData = new Map();
    
    // 存储广告主对应的biz_ids映射
    let advertiserBizIds = new Map();

    // localStorage键名
    const STORAGE_KEY = 'tiktok_advertiser_data';
    const BIZ_IDS_STORAGE_KEY = 'tiktok_advertiser_biz_ids';

    // 从localStorage加载数据
    function loadFromStorage() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                advertiserData = new Map();
                for (const [name, idsArray] of Object.entries(parsedData)) {
                    advertiserData.set(name, new Set(idsArray));
                }
            }
            
            const savedBizIds = localStorage.getItem(BIZ_IDS_STORAGE_KEY);
            if (savedBizIds) {
                advertiserBizIds = new Map(JSON.parse(savedBizIds));
            }
        } catch (e) {
            console.error('从localStorage加载数据失败:', e);
        }
    }

    // 保存数据到localStorage
    function saveToStorage() {
        try {
            // 将Map转换为可序列化的对象
            const serializableData = {};
            advertiserData.forEach((ids, name) => {
                serializableData[name] = Array.from(ids);
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
            
            // 保存biz_ids映射
            localStorage.setItem(BIZ_IDS_STORAGE_KEY, JSON.stringify(Array.from(advertiserBizIds.entries())));
        } catch (e) {
            console.error('保存数据到localStorage失败:', e);
        }
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        // 如果按钮已存在，先移除
        const existingButton = document.getElementById('advertiser-tracker-btn');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('div');
        button.id = 'advertiser-tracker-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            height: 50px;
            background-color: orange;
            color: white;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        button.textContent = '查看广告主 (0)';
        document.body.appendChild(button);

        button.addEventListener('click', showAdvertiserModal);
        console.log('TikTok Advertiser Tracker: 悬浮按钮已创建');
    }

    // 更新按钮文本
    function updateButtonText() {
        const button = document.getElementById('advertiser-tracker-btn');
        if (button) {
            button.textContent = `查看广告主 (${advertiserData.size})`;
        }
        // 每次更新数据时保存到localStorage
        saveToStorage();
    }

    // 显示广告主统计弹窗
    function showAdvertiserModal() {
        // 每次打开弹窗时都获取localStorage最新的数据
        loadFromStorage();
        
        // 如果模态框已存在，先移除
        const existingModal = document.getElementById('advertiser-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'advertiser-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            border-radius: 10px;
            width: 80%;
            max-width: 800px;
            max-height: 80%;
            overflow: auto;
            padding: 20px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            position: sticky;
            top: 0;
            background-color: white;
            z-index: 100;
        `;

        const title = document.createElement('h2');
        title.textContent = '广告主统计';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
        `;

        const clearButton = document.createElement('button');
        clearButton.textContent = '清除数据';
        clearButton.style.cssText = `
            padding: 5px 15px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        clearButton.onclick = clearAllData;

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            padding: 5px 15px;
            background-color: #ccc;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        closeButton.onclick = () => modal.remove();

        buttonContainer.appendChild(clearButton);
        buttonContainer.appendChild(closeButton);

        header.appendChild(title);
        header.appendChild(buttonContainer);

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
        `;

        const tableHeader = document.createElement('thead');
        tableHeader.innerHTML = `
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">广告主名称</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">广告数量</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Biz ID</th>
            </tr>
        `;

        const tableBody = document.createElement('tbody');

        // 按广告主名称统计并排序
        const stats = [];
        advertiserData.forEach((ids, name) => {
            const bizId = advertiserBizIds.get(name) || '-';
            stats.push({name, count: ids.size, bizId});
        });

        // 排序：第一排序，有Biz ID的排在前面；第二排序，按广告数量降序
        stats.sort((a, b) => {
            // 检查是否有Biz ID（不是'-'表示有Biz ID）
            const aHasBizId = a.bizId !== '-';
            const bHasBizId = b.bizId !== '-';
            
            // 如果一个有Biz ID，一个没有，则有Biz ID的排在前面
            if (aHasBizId && !bHasBizId) return -1;
            if (!aHasBizId && bHasBizId) return 1;
            
            // 如果都有或都没有Biz ID，则按广告数量降序排序
            return b.count - a.count;
        });

        // 填充表格数据
        stats.forEach(({name, count, bizId}) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${count}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${bizId}</td>
            `;
            tableBody.appendChild(row);
        });

        table.appendChild(tableHeader);
        table.appendChild(tableBody);

        modalContent.appendChild(header);
        modalContent.appendChild(table);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 点击背景关闭模态框
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 清除所有数据
    function clearAllData() {
        if (confirm('确定要清除所有广告主数据吗？')) {
            advertiserData.clear();
            advertiserBizIds.clear();
            updateButtonText();
            saveToStorage();
            alert('数据已清除');
        }
    }

    // 处理响应数据的函数
    function processResponseData(data) {
        if (data && data.data && Array.isArray(data.data)) {
            let processedCount = 0;
            data.data.forEach(item => {
                const { name, id } = item;
                if (name && id) {
                    if (!advertiserData.has(name)) {
                        advertiserData.set(name, new Set());
                    }
                    if (!advertiserData.get(name).has(id)) {
                        advertiserData.get(name).add(id);
                        processedCount++;
                    }
                }
            });

            if (processedCount > 0) {
                updateButtonText();
            }
        }
    }

    // 从详情页提取广告主信息
    function extractAdvertiserInfoFromDetailPage() {
        // 检查是否是详情页
        if (window.location.pathname === '/ads/detail/' && window.location.search) {
            console.log('检测到详情页，尝试提取广告主信息');
            // 查找广告主名称
            const advertiserNameElement = document.querySelector('.ad_advertiser_value');
            if (advertiserNameElement) {
                const advertiserName = advertiserNameElement.textContent.trim();
                console.log('找到广告主名称:', advertiserName);
                
                // 查找包含biz_id的链接
                const linkElement = document.querySelector('a.item_link[href*="adv_biz_ids"]');
                if (linkElement) {
                    const href = linkElement.getAttribute('href');
                    console.log('找到链接:', href);
                    const urlParams = new URLSearchParams(href.split('?')[1]);
                    const bizId = urlParams.get('adv_biz_ids');
                    console.log('提取到Biz ID:', bizId);
                    
                    if (advertiserName && bizId) {
                        // 保存映射关系
                        advertiserBizIds.set(advertiserName, bizId);
                        saveToStorage();
                        console.log(`提取到广告主信息: ${advertiserName} -> ${bizId}`);
                    }
                } else {
                    console.log('未找到包含biz_id的链接');
                }
            } else {
                console.log('未找到广告主名称元素');
            }
        }
    }

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url, options] = args;

        // 监听搜索API
        if (typeof url === 'string' && url.includes('/api/v1/search')) {
            return originalFetch.apply(this, args).then(response => {
                // 克隆响应以便可以多次读取
                const clone = response.clone();

                // 读取响应内容
                clone.json().then(data => {
                    processResponseData(data);
                }).catch(e => {
                    console.error('解析响应数据时出错:', e);
                });

                return response;
            }).catch(e => {
                console.error('fetch 请求出错:', e);
                throw e;
            });
        }

        // 非搜索API请求，正常处理
        return originalFetch.apply(this, args);
    };

    // 同时拦截 XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes('/api/v1/search')) {
            this.addEventListener('load', function() {
                if (this.status === 200) {
                    try {
                        const data = JSON.parse(this.responseText);
                        processResponseData(data);
                    } catch (e) {
                        console.error('XMLHttpRequest 解析响应数据时出错:', e);
                    }
                }
            });
        }
        originalXhrOpen.apply(this, arguments);
    };

    // 初始化
    window.addEventListener('load', () => {
        // 从localStorage加载数据
        loadFromStorage();
        createFloatingButton();
        updateButtonText();
        
        // 尝试从详情页提取信息
        setTimeout(extractAdvertiserInfoFromDetailPage, 2000);
        
        console.log('TikTok Advertiser Tracker: 脚本初始化完成');
    });

    console.log('TikTok Advertiser Tracker: 脚本已注入');
})();
// ==UserScript==
// @name         Facebook广告库推荐结果收集器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  收集Facebook广告库中输入文案时的推荐结果
// @author       You
// @match        https://www.facebook.com/ads/library/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549807/Facebook%E5%B9%BF%E5%91%8A%E5%BA%93%E6%8E%A8%E8%8D%90%E7%BB%93%E6%9E%9C%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549807/Facebook%E5%B9%BF%E5%91%8A%E5%BA%93%E6%8E%A8%E8%8D%90%E7%BB%93%E6%9E%9C%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储收集到的数据（只保留最后一次请求的结果）
    let collectedData = [];
    
    // 创建显示按钮
    function createDisplayButton() {
        const button = document.createElement('button');
        button.id = 'fb-ad-collector-button';
        button.textContent = 'Facebook 推荐推荐用户（0）';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 40px;
            background: orange;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        button.addEventListener('click', showDataModal);
        document.body.appendChild(button);
    }
    
    // 更新按钮显示
    function updateButton() {
        const button = document.getElementById('fb-ad-collector-button');
        if (button) {
            button.textContent = `Facebook 推荐推荐用户（${collectedData.length}）`;
        }
    }
    
    // 显示数据弹窗
    function showDataModal() {
        // 如果弹窗已存在，先移除
        const existingModal = document.getElementById('fb-ad-collector-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'fb-ad-collector-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        modalContent.innerHTML = `
            <div style="background: #f0f2f5; padding: 12px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px;">广告推荐结果</h3>
                <button id="modal-close-btn" style="padding: 6px 12px; background: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
            <div style="padding: 12px; overflow-y: auto; flex: 1;">
                <table id="data-table" style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f5f5f5;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">
                                <input type="checkbox" id="select-all-checkbox">
                            </th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">头像</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">名称</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">ID</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">类型</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">验证状态</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">搜索词</th>
                        </tr>
                    </thead>
                    <tbody id="table-body"></tbody>
                </table>
            </div>
            <div style="padding: 12px; background: #f0f2f5; border-top: 1px solid #ddd; display: flex; justify-content: space-between;">
                <button id="modal-copy-btn" style="padding: 6px 12px; background: #1877f2; color: white; border: none; border-radius: 4px; cursor: pointer;">复制选中ID</button>
                <button id="modal-export-btn" style="padding: 6px 12px; background: #42b72a; color: white; border: none; border-radius: 4px; cursor: pointer;">导出数据</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 填充表格数据
        populateTable();
        
        // 绑定事件
        document.getElementById('modal-close-btn').addEventListener('click', () => modal.remove());
        document.getElementById('modal-export-btn').addEventListener('click', exportData);
        document.getElementById('modal-copy-btn').addEventListener('click', copySelectedIds);
        
        // 全选/全不选功能
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
        
        // 点击背景关闭弹窗
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'fb-ad-collector-modal') {
                modal.remove();
            }
        });
    }
    
    // 填充表格数据
    function populateTable() {
        const tableBody = document.getElementById('table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        collectedData.forEach((item) => {
            const row = document.createElement('tr');
            row.style.cssText = `height: 50px;`;
            
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <input type="checkbox" class="row-checkbox" data-id="${item.page_id}">
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <img src="${item.image_uri}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;" onerror="this.style.display='none'">
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    <a href="https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=${item.page_id}" target="_blank">${item.page_id}</a>
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.entity_type}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.verification || '无'}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.exact_phrase_results || '无'}</td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // 为每个复选框添加事件监听器，用于控制全选复选框的状态
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllCheckbox);
        });
    }
    
    // 导出数据
    function exportData() {
        if (collectedData.length === 0) {
            alert('没有数据可导出');
            return;
        }
        
        const dataStr = JSON.stringify(collectedData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fb_ad_recommendations_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // 复制选中ID
    function copySelectedIds() {
        const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('请先选择要复制的项');
            return;
        }
        
        const ids = Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.id);
        const idsString = ids.join(',');
        
        // 复制到剪贴板
        navigator.clipboard.writeText(idsString).then(() => {
            alert(`已复制 ${ids.length} 个ID到剪贴板`);
        }).catch(err => {
            console.error('复制失败:', err);
            // 降级方案：显示文本框让用户手动复制
            const textArea = document.createElement('textarea');
            textArea.value = idsString;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(`已复制 ${ids.length} 个ID到剪贴板`);
        });
    }
    
    // 更新全选复选框状态
    function updateSelectAllCheckbox() {
        const allCheckboxes = document.querySelectorAll('.row-checkbox');
        const checkedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        
        // 如果所有复选框都被选中，则选中全选复选框；否则取消选中
        selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length && allCheckboxes.length > 0;
    }
    
    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url, options] = args;
        
        // 检查是否为GraphQL请求
        if (typeof url === 'string' && url === 'https://www.facebook.com/api/graphql/' && options && options.method === 'POST') {
            const originalPromise = originalFetch.apply(this, args);
            
            // 拦截响应
            return originalPromise.then(response => {
                const clonedResponse = response.clone();
                
                clonedResponse.text().then(text => {
                    try {
                        const data = JSON.parse(text);
                        
                        // 检查是否包含推荐结果
                        if (data?.data?.ad_library_main?.typeahead_suggestions) {
                            const suggestions = data.data.ad_library_main.typeahead_suggestions;
                            const pageResults = suggestions.page_results || [];
                            const exactPhrase = suggestions.exact_phrase_results || '';
                            
                            // 只保留最后一次请求的结果
                            collectedData = [];
                            
                            // 处理每个推荐结果
                            pageResults.forEach(page => {
                                collectedData.push({
                                    ...page,
                                    exact_phrase_results: exactPhrase,
                                    collected_at: new Date().toISOString()
                                });
                            });
                            
                            // 更新按钮显示
                            updateButton();
                        }
                    } catch (e) {
                        console.log('解析响应JSON时出错:', e);
                    }
                }).catch(err => {
                    console.log('读取响应文本时出错:', err);
                });
                
                return response;
            }).catch(err => {
                console.log('fetch请求出错:', err);
                throw err;
            });
        }
        
        return originalFetch.apply(this, args);
    };
    
    // 拦截XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && url.includes('graphql')) {
            this._url = url;
        }
        return originalOpen.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.includes('graphql')) {
            // 监听响应
            this.addEventListener('load', function() {
                try {
                    const data = JSON.parse(this.responseText);
                    
                    // 检查是否包含推荐结果
                    if (data?.data?.ad_library_main?.typeahead_suggestions) {
                        const suggestions = data.data.ad_library_main.typeahead_suggestions;
                        const pageResults = suggestions.page_results || [];
                        const exactPhrase = suggestions.exact_phrase_results || '';
                        
                        // 只保留最后一次请求的结果
                        collectedData = [];
                        
                        // 处理每个推荐结果
                        pageResults.forEach(page => {
                            collectedData.push({
                                ...page,
                                exact_phrase_results: exactPhrase,
                                collected_at: new Date().toISOString()
                            });
                        });
                        
                        // 更新按钮显示
                        updateButton();
                    }
                } catch (e) {
                    console.log('解析XMLHttpRequest响应时出错:', e);
                }
            });
        }
        return originalSend.apply(this, arguments);
    };
    
    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createDisplayButton);
        } else {
            createDisplayButton();
        }
        
        console.log('Facebook广告库推荐结果收集器已启动');
    }
    
    // 启动脚本
    init();
})();
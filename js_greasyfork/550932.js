// ==UserScript==
// @name         商品AI分析工具
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  在商品列表中添加AI分析按钮，调用API展示商品详情
// @author       You
// @match        https://zhenghedata.com/product/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      api.tikhub.io
// @connect      generativelanguage.googleapis.com
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550932/%E5%95%86%E5%93%81AI%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/550932/%E5%95%86%E5%93%81AI%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // API 配置
    const API_BASE_URL = 'https://api.tikhub.io/api/v1/tiktok/shop/web/fetch_product_detail_v3';
    const REVIEWS_API_URL = 'https://api.tikhub.io/api/v1/tiktok/shop/web/fetch_product_reviews_v2';
    const REVIEWS_V1_API_URL = 'https://api.tikhub.io/api/v1/tiktok/shop/web/fetch_product_reviews_v1';
    // const GEMINI_API_KEY = ''; // 已改为动态配置
    const GEMINI_MODEL = 'gemini-2.5-pro';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
    const MAX_VOC_REVIEWS = 100;

    // 获取API Token
    function getApiToken() {
        return GM_getValue('api_token', '');
    }

    // 获取Gemini API Key
    function getGeminiApiKey() {
        return GM_getValue('gemini_api_key', '');
    }

    // 显示全局设置弹窗
    function showGlobalSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'global-settings-dialog';
        dialog.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5); z-index: 10020;
            display: flex; align-items: center; justify-content: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #fff; border-radius: 8px; padding: 24px;
            width: 500px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        content.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #262626; border-bottom: 1px solid #e8e8e8; padding-bottom: 12px;">设置 API Token</h3>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">TikHub API Token:</label>
                <input type="text" id="setting-api-token" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;" placeholder="请输入 Tikhub API Token">
                <p style="margin: 4px 0 0; color: #8c8c8c; font-size: 12px;">用于获取商品详情和评论数据</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Gemini API Key:</label>
                <input type="text" id="setting-gemini-key" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;" placeholder="请输入 Google Gemini API Key">
                <p style="margin: 4px 0 0; color: #8c8c8c; font-size: 12px;">用于生成商品分析和VOC报告</p>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px;">
                <button id="setting-cancel" style="padding: 8px 16px; border: 1px solid #d9d9d9; background: #fff; border-radius: 4px; cursor: pointer;">取消</button>
                <button id="setting-save" style="padding: 8px 16px; border: none; background: #1890ff; color: #fff; border-radius: 4px; cursor: pointer;">保存</button>
            </div>
        `;

        dialog.appendChild(content);
        document.body.appendChild(dialog);

        // Fill existing values
        const tokenInput = content.querySelector('#setting-api-token');
        const keyInput = content.querySelector('#setting-gemini-key');

        tokenInput.value = getApiToken();
        keyInput.value = getGeminiApiKey();

        // Events
        const close = () => document.body.removeChild(dialog);

        content.querySelector('#setting-cancel').onclick = close;
        content.querySelector('#setting-save').onclick = () => {
            GM_setValue('api_token', tokenInput.value.trim());
            GM_setValue('gemini_api_key', keyInput.value.trim());
            showToast('设置已保存');
            close();
        };

        dialog.onclick = (e) => { if (e.target === dialog) close(); };
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: #fff; padding: 8px 16px;
            border-radius: 4px; z-index: 10030; font-size: 14px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 2000);
    }

    function initSettings() {
        // Register menu command
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('设置 API Token', showGlobalSettingsDialog);
        }

        // Add floating button
        const fab = document.createElement('div');
        fab.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: #fff;"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        fab.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            width: 48px; height: 48px; border-radius: 50%;
            background: #1890ff; box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 9999;
            transition: transform 0.3s;
        `;
        fab.title = "设置 API Token";
        fab.onmouseover = () => fab.style.transform = 'scale(1.1)';
        fab.onmouseout = () => fab.style.transform = 'scale(1)';
        fab.onclick = showGlobalSettingsDialog;
        document.body.appendChild(fab);
    }

    // 从data-row-key中提取商品ID
    function extractProductId(rowKey) {
        // 格式: "1729583607879862527sales" -> "1729583607879862527"
        if (rowKey && typeof rowKey === 'string') {
            // 先尝试去除常见后缀 "sales"
            let cleaned = rowKey.replace(/sales$/i, '');
            // 如果去除后缀后是纯数字，直接返回
            if (/^\d+$/.test(cleaned) && cleaned.length >= 10) {
                return cleaned;
            }
            // 如果还有非数字字符，尝试提取最长的数字序列
            const match = rowKey.match(/\d{10,}/);
            if (match && match[0].length >= 10) {
                return match[0];
            }
        }
        return null;
    }

    // 创建独立的VOC侧边栏
    function createVocSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'voc-analysis-sidebar';
        sidebar.innerHTML = `
            <div class="voc-sidebar-overlay"></div>
            <div class="voc-sidebar-content">
                <div class="voc-sidebar-header">
                    <h3>VOC 分析</h3>
                    <button class="voc-sidebar-close">&times;</button>
                </div>
                <div class="voc-sidebar-body">
                    <div class="voc-product-info" style="padding: 16px; border-bottom: 1px solid #e8e8e8;">
                        <div style="font-size: 14px; color: #595959; margin-bottom: 8px;">商品ID: <span class="voc-product-id"></span></div>
                        <button class="voc-reanalyze-btn" style="padding: 8px 16px; background: #1890ff; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">重新分析</button>
                    </div>
                    <div class="voc-results-container" style="flex: 1; overflow-y: auto; padding: 16px;">
                        <!-- 分析结果将动态添加到这里 -->
                    </div>
                    <div class="voc-loading-container" style="display: none; padding: 16px;">
                        <div class="voc-loading" style="text-align: center; padding: 20px;">
                            <div class="loading-spinner" style="display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #1890ff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                            <p style="margin-top: 12px; color: #595959;"></p>
                        </div>
                        <div class="voc-stats" style="margin-top: 12px; padding: 8px; background: #f0f7ff; border-radius: 4px; font-size: 13px; color: #1890ff;">
                            <strong>总获取评论数：</strong><span class="voc-total-reviews">0</span> 条
                        </div>
                        <div class="voc-log" style="display:none;font-size:12px;color:#8c8c8c;white-space:pre-wrap;line-height:1.5;margin-top:8px;padding:8px;background:#fafafa;border-radius:4px;"></div>
                    </div>
                    <div class="voc-error-container" style="display: none; padding: 16px;">
                        <div class="voc-error" style="color: #ff4d4f; padding: 12px; background: #fff1f0; border-radius: 4px;"></div>
                    </div>
                </div>
            </div>
        `;

        // 添加VOC侧边栏样式
        const style = document.createElement('style');
        style.textContent += `
            #voc-analysis-sidebar {
                position: fixed;
                top: 0;
                right: 0;
                width: 0;
                height: 100vh;
                z-index: 10002;
                transition: width 0.3s ease;
            }

            #voc-analysis-sidebar.active {
                width: 700px;
            }

            #voc-analysis-sidebar .voc-sidebar-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 10001;
            }

            #voc-analysis-sidebar.active .voc-sidebar-overlay {
                display: block;
            }

            #voc-analysis-sidebar .voc-sidebar-content {
                position: fixed;
                top: 0;
                right: 0;
                width: 700px;
                height: 100vh;
                background: #fff;
                box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 10003;
            }

            #voc-analysis-sidebar.active .voc-sidebar-content {
                transform: translateX(0);
            }

            #voc-analysis-sidebar .voc-sidebar-header {
                padding: 20px;
                border-bottom: 1px solid #e8e8e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }

            #voc-analysis-sidebar .voc-sidebar-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #262626;
            }

            #voc-analysis-sidebar .voc-sidebar-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #8c8c8c;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
            }

            #voc-analysis-sidebar .voc-sidebar-close:hover {
                background: #f5f5f5;
                color: #262626;
            }

            #voc-analysis-sidebar .voc-sidebar-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .voc-result-item {
                margin-bottom: 16px;
                border: 1px solid #e8e8e8;
                border-radius: 4px;
                overflow: hidden;
            }

            .voc-result-header {
                padding: 12px 16px;
                background: #fafafa;
                border-bottom: 1px solid #e8e8e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }

            .voc-result-header:hover {
                background: #f0f0f0;
            }

            .voc-result-title {
                font-size: 14px;
                font-weight: 600;
                color: #262626;
            }

            .voc-result-meta {
                font-size: 12px;
                color: #8c8c8c;
                margin-left: 8px;
            }

            .voc-result-actions {
                display: flex;
                gap: 8px;
            }

            .voc-result-toggle,
            .voc-result-export {
                padding: 4px 8px;
                font-size: 12px;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                background: #fff;
                cursor: pointer;
                color: #595959;
            }

            .voc-result-toggle:hover,
            .voc-result-export:hover {
                background: #f5f5f5;
                border-color: #1890ff;
                color: #1890ff;
            }

            .voc-result-content {
                padding: 16px;
                background: #fff;
                display: block;
            }

            .voc-result-content.collapsed {
                display: none;
            }

            .voc-result-stats {
                margin-bottom: 12px;
                padding: 8px;
                background: #f0f7ff;
                border-radius: 4px;
                font-size: 13px;
                color: #1890ff;
            }

            .voc-result-text {
                line-height: 1.8;
                color: #262626;
                font-size: 14px;
            }

            .voc-result-text h1,
            .voc-result-text h2,
            .voc-result-text h3,
            .voc-result-text h4,
            .voc-result-text h5,
            .voc-result-text h6 {
                margin-top: 24px;
                margin-bottom: 12px;
            }

            .voc-result-text h1:first-child,
            .voc-result-text h2:first-child,
            .voc-result-text h3:first-child {
                margin-top: 0;
            }

            .voc-result-text p {
                margin: 12px 0;
            }

            .voc-result-text ul,
            .voc-result-text ol {
                margin: 12px 0;
                padding-left: 24px;
            }

            .voc-result-text li {
                margin: 6px 0;
            }

            .voc-result-text code {
                background: #f5f5f5;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
            }

            .voc-result-text pre {
                background: #f5f5f5;
                padding: 12px;
                border-radius: 4px;
                overflow-x: auto;
                margin: 12px 0;
            }

            .voc-result-text pre code {
                background: none;
                padding: 0;
            }

            .voc-result-text a {
                color: #1890ff;
                text-decoration: none;
                border-bottom: 1px solid #1890ff;
            }

            .voc-result-text a:hover {
                color: #40a9ff;
                border-bottom-color: #40a9ff;
            }

            .voc-result-text hr {
                border: none;
                border-top: 1px solid #e8e8e8;
                margin: 20px 0;
            }

            .voc-result-text blockquote {
                border-left: 4px solid #1890ff;
                padding-left: 16px;
                margin: 12px 0;
                color: #595959;
                font-style: italic;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(sidebar);

        // 绑定关闭按钮
        sidebar.querySelector('.voc-sidebar-close').addEventListener('click', closeVocSidebar);
        sidebar.querySelector('.voc-sidebar-overlay').addEventListener('click', closeVocSidebar);
    }

    // 打开VOC侧边栏
    function openVocSidebar() {
        const sidebar = document.getElementById('voc-analysis-sidebar');
        if (sidebar) {
            sidebar.classList.add('active');
        }
    }

    // 关闭VOC侧边栏
    function closeVocSidebar() {
        const sidebar = document.getElementById('voc-analysis-sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }

    // 创建侧边弹窗
    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'product-analysis-sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-overlay"></div>
            <div class="sidebar-content">
                <div class="sidebar-header">
                    <h3>商品AI分析</h3>
                    <button class="sidebar-close">&times;</button>
                </div>
                <div class="sidebar-body">
                    <div class="loading" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p>正在加载商品信息...</p>
                    </div>
                    <div class="error" style="display: none;">
                        <p class="error-message"></p>
                    </div>
                    
                    <!-- AI商品分析模块 - 放在产品详情上方 -->
                    <div class="ai-product" style="display: none;">
                        <div class="ai-product-header">
                            <h4>AI 商品分析</h4>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <button class="ai-product-run">生成分析</button>
                                <button class="ai-product-toggle" style="background: #f0f0f0; border: 1px solid #d9d9d9; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">收起</button>
                            </div>
                        </div>
                        <div class="ai-product-content" style="display: block;">
                            <div class="ai-product-loading" style="display:none;">正在整理商品信息并生成分析...</div>
                            <div class="ai-product-error" style="display:none;"></div>
                            <div class="ai-product-log" style="display:none;font-size:12px;color:#8c8c8c;white-space:pre-wrap;line-height:1.5;margin-top:8px;"></div>
                            <div class="ai-product-result" style="display:none; white-space:pre-wrap; line-height:1.6; color:#262626;"></div>
                        </div>
                    </div>
                    
                    <div class="product-info"></div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #product-analysis-sidebar {
                position: fixed;
                top: 0;
                right: 0;
                width: 0;
                height: 100vh;
                z-index: 10000;
                transition: width 0.3s ease;
            }

            #product-analysis-sidebar.active {
                width: 600px;
            }

            #product-analysis-sidebar .sidebar-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                z-index: 9999;
            }

            #product-analysis-sidebar.active .sidebar-overlay {
                display: block;
            }

            #product-analysis-sidebar .sidebar-content {
                position: fixed;
                top: 0;
                right: 0;
                width: 600px;
                height: 100vh;
                background: #fff;
                box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                z-index: 10001;
            }

            #product-analysis-sidebar.active .sidebar-content {
                transform: translateX(0);
            }

            #product-analysis-sidebar .sidebar-header {
                padding: 20px;
                border-bottom: 1px solid #e8e8e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #product-analysis-sidebar .sidebar-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            #product-analysis-sidebar .sidebar-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #product-analysis-sidebar .sidebar-close:hover {
                color: #000;
            }

            #product-analysis-sidebar .sidebar-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            #product-analysis-sidebar .loading {
                text-align: center;
                padding: 40px 20px;
            }

            #product-analysis-sidebar .loading-spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #1890ff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            #product-analysis-sidebar .error {
                padding: 20px;
                background: #fff2f0;
                border: 1px solid #ffccc7;
                border-radius: 4px;
                margin-bottom: 20px;
            }

            #product-analysis-sidebar .error-message {
                color: #ff4d4f;
                margin: 0;
            }

            #product-analysis-sidebar .product-info {
                display: none;
            }

            #product-analysis-sidebar .product-info.active {
                display: block;
            }

            .product-info-section {
                margin-bottom: 24px;
            }

            .product-info-section h4 {
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
                color: #262626;
                border-bottom: 2px solid #1890ff;
                padding-bottom: 8px;
            }

            .product-info-item {
                margin-bottom: 12px;
            }

            .product-info-item label {
                font-weight: 500;
                color: #595959;
                display: inline-block;
                min-width: 100px;
            }

            .product-info-item span {
                color: #262626;
            }

            .product-image {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
                margin: 10px 0;
            }

            .product-images {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }

            .product-image-thumb {
                width: 100px;
                height: 100px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                border: 2px solid transparent;
            }

            .product-image-thumb:hover {
                border-color: #1890ff;
            }

            .ai-analysis-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 6px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s;
                margin-left: 8px;
            }

            .ai-analysis-btn:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            }

            .ai-analysis-btn:active {
                transform: translateY(0);
            }

            .voc-analysis-btn {
                background: #fff;
                color: #5c6ac4;
                border: 1px solid #5c6ac4;
                padding: 6px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s;
                margin-left: 8px;
            }

            .voc-analysis-btn:hover {
                background: #5c6ac4;
                color: #fff;
                box-shadow: 0 2px 8px rgba(92, 106, 196, 0.4);
            }

            .ai-analysis-btn:disabled,
            .voc-analysis-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                box-shadow: none;
            }

            .voc-analysis {
                margin-top: 20px;
                padding: 16px;
                border: 1px solid #e8e8e8;
                border-radius: 4px;
                background: #fafafa;
            }

            .voc-analysis-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
            }

            .voc-analysis-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .voc-analysis-tip {
                margin: 0;
                font-size: 12px;
                color: #8c8c8c;
            }

            .voc-analysis-loading {
                color: #1890ff;
            }

            .voc-analysis-error {
                color: #ff4d4f;
                display: none;
            }

            .voc-analysis-result {
                margin-top: 12px;
                white-space: pre-wrap;
                line-height: 1.6;
                color: #262626;
                display: none;
            }

            .ai-product {
                margin-bottom: 24px;
                padding: 16px;
                border: 1px solid #e8e8e8;
                border-radius: 4px;
                background: #fafafa;
            }

            .ai-product-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
            }

            .ai-product-header h4 { 
                margin: 0; 
                font-size: 16px; 
                font-weight: 600;
                color: #262626;
            }

            .ai-product-run {
                background: #1890ff;
                color: #fff;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
            }
            .ai-product-run:hover {
                background: #40a9ff;
            }
            .ai-product-run:disabled { 
                opacity: 0.6; 
                cursor: not-allowed;
                background: #d9d9d9;
            }

            .ai-product-toggle {
                background: #f0f0f0;
                border: 1px solid #d9d9d9;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                color: #595959;
            }
            .ai-product-toggle:hover {
                background: #e6e6e6;
                border-color: #bfbfbf;
            }

            .ai-product-content {
                margin-top: 12px;
            }

            .ai-product-result {
                margin-top: 12px;
                padding: 16px;
                background: #fafafa;
                border-radius: 4px;
                border: 1px solid #e8e8e8;
            }

            .ai-product-result h2 {
                font-size: 18px;
                font-weight: 600;
                color: #262626;
                margin: 16px 0 12px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #1890ff;
            }

            .ai-product-result h2:first-child {
                margin-top: 0;
            }

            .ai-product-result strong {
                font-weight: 600;
                color: #262626;
            }

            .ai-product-result code {
                background: #f5f5f5;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
            }

            .ai-product-result pre {
                background: #f5f5f5;
                padding: 12px;
                border-radius: 4px;
                overflow-x: auto;
                border: 1px solid #e8e8e8;
            }

            .ai-product-result pre code {
                background: none;
                padding: 0;
            }

            .ai-product-result hr {
                border: none;
                border-top: 1px solid #e8e8e8;
                margin: 16px 0;
            }

            .ai-actions-container {
                margin-top: 8px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                width: 100%;
            }

            .ai-actions-container .ai-analysis-btn,
            .ai-actions-container .voc-analysis-btn {
                margin-left: 0;
                flex: 1 1 0;
                min-width: 120px;
            }

            .specifications-list {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                margin-top: 10px;
            }

            .specification-item {
                padding: 8px;
                background: #f5f5f5;
                border-radius: 4px;
            }

            .specification-name {
                font-weight: 500;
                color: #595959;
                font-size: 12px;
            }

            .specification-value {
                color: #262626;
                margin-top: 4px;
            }

            .price-info {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 10px 0;
            }

            .price-current {
                font-size: 24px;
                font-weight: 600;
                color: #ff4d4f;
            }

            .price-original {
                font-size: 16px;
                color: #8c8c8c;
                text-decoration: line-through;
            }

            .price-discount {
                background: #ff4d4f;
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(sidebar);

        // 绑定关闭事件
        sidebar.querySelector('.sidebar-close').addEventListener('click', closeSidebar);
        sidebar.querySelector('.sidebar-overlay').addEventListener('click', closeSidebar);

        return sidebar;
    }

    // 打开侧边栏
    function openSidebar() {
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (sidebar) {
            sidebar.classList.add('active');
        }
    }

    // 关闭侧边栏
    function closeSidebar() {
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }

    // 显示加载状态
    function showLoading() {
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (sidebar) {
            sidebar.querySelector('.loading').style.display = 'block';
            sidebar.querySelector('.error').style.display = 'none';
            sidebar.querySelector('.product-info').classList.remove('active');
        }
    }

    // 显示错误
    function showError(message) {
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (sidebar) {
            sidebar.querySelector('.loading').style.display = 'none';
            sidebar.querySelector('.error').style.display = 'block';
            sidebar.querySelector('.error-message').textContent = message;
            sidebar.querySelector('.product-info').classList.remove('active');
        }
    }

    // VOC 缓存和侧边栏操作
    function getVocCacheKey(productId) {
        return `voc_analysis_${productId}`;
    }

    // 保存VOC分析结果到缓存
    function saveVocAnalysisCache(productId, analysisData) {
        const cacheKey = getVocCacheKey(productId);
        const existingCache = GM_getValue(cacheKey, []);
        const newResult = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            productId: productId,
            targetValidCount: analysisData.targetValidCount,
            totalReviews: analysisData.totalReviews,
            validReviews: analysisData.validReviews,
            analysis: analysisData.analysis,
            createdAt: new Date().toLocaleString('zh-CN')
        };
        existingCache.unshift(newResult); // 最新的在前面
        GM_setValue(cacheKey, existingCache);
        return newResult;
    }

    // 获取VOC分析缓存
    function getVocAnalysisCache(productId) {
        const cacheKey = getVocCacheKey(productId);
        return GM_getValue(cacheKey, []);
    }

    // 获取VOC侧边栏元素
    function getVocSidebarElements() {
        const sidebar = document.getElementById('voc-analysis-sidebar');
        if (!sidebar) return null;
        return {
            sidebar: sidebar,
            productId: sidebar.querySelector('.voc-product-id'),
            reanalyzeBtn: sidebar.querySelector('.voc-reanalyze-btn'),
            resultsContainer: sidebar.querySelector('.voc-results-container'),
            loadingContainer: sidebar.querySelector('.voc-loading-container'),
            loadingText: sidebar.querySelector('.voc-loading p'),
            stats: sidebar.querySelector('.voc-stats'),
            totalReviews: sidebar.querySelector('.voc-total-reviews'),
            log: sidebar.querySelector('.voc-log'),
            errorContainer: sidebar.querySelector('.voc-error-container'),
            error: sidebar.querySelector('.voc-error')
        };
    }

    // 显示VOC分析结果
    function renderVocAnalysisResults(productId) {
        const els = getVocSidebarElements();
        if (!els) return;

        const cache = getVocAnalysisCache(productId);
        els.resultsContainer.innerHTML = '';

        if (cache.length === 0) {
            els.resultsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #8c8c8c;">暂无分析结果</div>';
            return;
        }

        cache.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'voc-result-item';
            resultItem.dataset.resultId = result.id;

            const isExpanded = index === 0; // 默认展开最新的

            resultItem.innerHTML = `
                <div class="voc-result-header">
                    <div>
                        <span class="voc-result-title">VOC 分析 #${cache.length - index}</span>
                        <span class="voc-result-meta">${result.createdAt}</span>
                    </div>
                    <div class="voc-result-actions">
                        <button class="voc-result-toggle" data-result-id="${result.id}">
                            ${isExpanded ? '收起' : '展开'}
                        </button>
                        <button class="voc-result-export" data-result-id="${result.id}">导出</button>
                    </div>
                </div>
                <div class="voc-result-content ${isExpanded ? '' : 'collapsed'}" data-result-id="${result.id}">
                    <div class="voc-result-stats">
                        <div>目标有效评论数：${result.targetValidCount} 条</div>
                        <div>总获取评论数：${result.totalReviews} 条</div>
                        <div>有效评论数：${result.validReviews} 条</div>
                    </div>
                    <div class="voc-result-text">${markdownToHtml(result.analysis)}</div>
                </div>
            `;

            els.resultsContainer.appendChild(resultItem);
        });

        // 绑定收起/展开按钮
        els.resultsContainer.querySelectorAll('.voc-result-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const resultId = btn.dataset.resultId;
                const content = els.resultsContainer.querySelector(`.voc-result-content[data-result-id="${resultId}"]`);
                if (content) {
                    const isCollapsed = content.classList.contains('collapsed');
                    content.classList.toggle('collapsed');
                    btn.textContent = isCollapsed ? '收起' : '展开';
                }
            });
        });

        // 绑定导出按钮
        els.resultsContainer.querySelectorAll('.voc-result-export').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const resultId = btn.dataset.resultId;
                const result = cache.find(r => r.id === resultId);
                if (result) {
                    exportVocAnalysis(result);
                }
            });
        });

        // 点击标题也可以展开/收起
        els.resultsContainer.querySelectorAll('.voc-result-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.classList.contains('voc-result-toggle') || e.target.classList.contains('voc-result-export')) {
                    return;
                }
                const resultId = header.closest('.voc-result-item').dataset.resultId;
                const toggleBtn = header.querySelector('.voc-result-toggle');
                if (toggleBtn) {
                    toggleBtn.click();
                }
            });
        });
    }

    // 导出VOC分析结果
    function exportVocAnalysis(result) {
        const content = [
            `VOC 分析报告`,
            `商品ID: ${result.productId}`,
            `分析时间: ${result.createdAt}`,
            `目标有效评论数: ${result.targetValidCount} 条`,
            `总获取评论数: ${result.totalReviews} 条`,
            `有效评论数: ${result.validReviews} 条`,
            ``,
            `分析结果:`,
            result.analysis
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VOC分析_${result.productId}_${result.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 显示VOC分析设置弹窗
    function showVocSettingsDialog(productId, region, triggerButton) {
        // 如果VOC侧边栏已打开，先关闭它
        closeVocSidebar();

        // 创建弹窗
        const dialog = document.createElement('div');
        dialog.id = 'voc-settings-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10010;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = `
            background: #fff;
            border-radius: 8px;
            padding: 24px;
            min-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10011;
            position: relative;
        `;

        dialogContent.innerHTML = `
            <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #262626;">VOC 分析设置</h3>
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #595959;">
                    需要获取的有效评论数（有文本内容的评论）：
                </label>
                <input 
                    type="number" 
                    id="voc-target-count-input" 
                    value="100" 
                    min="1" 
                    max="1000" 
                    style="width: 100%; padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 14px;"
                >
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #8c8c8c;">
                    系统将不断爬取评论，直到获取到设定数量的有效评论为止
                </p>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button id="voc-dialog-cancel" style="padding: 8px 16px; border: 1px solid #d9d9d9; border-radius: 4px; background: #fff; cursor: pointer; font-size: 14px;">
                    取消
                </button>
                <button id="voc-dialog-start" style="padding: 8px 16px; border: none; border-radius: 4px; background: #1890ff; color: #fff; cursor: pointer; font-size: 14px;">
                    开始分析
                </button>
            </div>
        `;

        dialog.appendChild(dialogContent);
        document.body.appendChild(dialog);

        // 绑定事件
        const input = dialogContent.querySelector('#voc-target-count-input');
        const cancelBtn = dialogContent.querySelector('#voc-dialog-cancel');
        const startBtn = dialogContent.querySelector('#voc-dialog-start');

        const closeDialog = () => {
            document.body.removeChild(dialog);
        };

        cancelBtn.addEventListener('click', closeDialog);

        startBtn.addEventListener('click', () => {
            const targetCount = parseInt(input.value, 10);
            if (isNaN(targetCount) || targetCount < 1) {
                alert('请输入有效的评论数（1-1000）');
                return;
            }
            closeDialog();
            startVocAnalysis(productId, region, targetCount, triggerButton);
        });

        // 点击背景关闭
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                closeDialog();
            }
        });

        // 回车键确认
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                startBtn.click();
            }
        });

        // 聚焦输入框
        input.focus();
        input.select();
    }

    function getAiProductElements() {
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (!sidebar) return null;
        return {
            container: sidebar.querySelector('.ai-product'),
            btn: sidebar.querySelector('.ai-product-run'),
            toggle: sidebar.querySelector('.ai-product-toggle'),
            content: sidebar.querySelector('.ai-product-content'),
            loading: sidebar.querySelector('.ai-product-loading'),
            error: sidebar.querySelector('.ai-product-error'),
            log: sidebar.querySelector('.ai-product-log'),
            result: sidebar.querySelector('.ai-product-result'),
        };
    }

    function updateVocReviewCount(count, productId = null) {
        if (!isCurrentVocProduct(productId)) return;
        const els = getVocSidebarElements();
        if (!els) return;
        if (count === null || count === undefined) {
            if (els.totalReviews) {
                els.totalReviews.textContent = '0';
            }
            if (els.stats) {
                els.stats.style.display = 'none';
            }
            return;
        }
        if (els.totalReviews) {
            els.totalReviews.textContent = String(count || 0);
        }
        if (els.stats) {
            els.stats.style.display = 'block';
        }
    }

    // 显示VOC加载状态
    function showVocLoading(text = '正在加载...', productId = null) {
        if (!isCurrentVocProduct(productId)) return;
        const els = getVocSidebarElements();
        if (!els) return;
        // 隐藏结果和错误
        if (els.resultsContainer) {
            els.resultsContainer.style.display = 'none';
        }
        if (els.errorContainer) {
            els.errorContainer.style.display = 'none';
        }
        // 显示加载
        if (els.loadingContainer) {
            els.loadingContainer.style.display = 'block';
        }
        if (els.loadingText) {
            els.loadingText.textContent = text;
        }
    }

    // 显示VOC错误
    function showVocError(message, productId = null) {
        if (!isCurrentVocProduct(productId)) return;
        const els = getVocSidebarElements();
        if (!els) return;
        // 隐藏加载和结果
        if (els.loadingContainer) {
            els.loadingContainer.style.display = 'none';
        }
        if (els.resultsContainer) {
            els.resultsContainer.style.display = 'none';
        }
        // 显示错误
        if (els.errorContainer) {
            els.errorContainer.style.display = 'block';
        }
        if (els.error) {
            els.error.textContent = message;
        }
    }

    // 显示VOC结果（调用renderVocAnalysisResults）
    function showVocResults(productId) {
        if (!isCurrentVocProduct(productId)) return;
        const els = getVocSidebarElements();
        if (!els) return;
        // 隐藏加载和错误
        if (els.loadingContainer) {
            els.loadingContainer.style.display = 'none';
        }
        if (els.errorContainer) {
            els.errorContainer.style.display = 'none';
        }
        // 显示结果
        if (els.resultsContainer) {
            els.resultsContainer.style.display = 'block';
        }
        // 渲染结果
        renderVocAnalysisResults(productId);
    }

    // 追加VOC日志
    function appendVocLog(text, productId = null) {
        if (!isCurrentVocProduct(productId)) return;
        const els = getVocSidebarElements();
        if (!els || !els.log) return;
        // 显示日志容器
        els.log.style.display = 'block';
        // 追加日志文本
        const timestamp = new Date().toLocaleTimeString('zh-CN');
        const logText = `[${timestamp}] ${text}`;
        els.log.textContent = (els.log.textContent ? els.log.textContent + '\n' : '') + logText;
        // 自动滚动到底部
        els.log.scrollTop = els.log.scrollHeight;
    }

    function showAiProductSection() {
        const els = getAiProductElements();
        if (!els || !els.container) return;
        els.container.style.display = 'block';
        // 默认展开
        if (els.content) {
            els.content.style.display = 'block';
        }
        if (els.toggle) {
            els.toggle.textContent = '收起';
        }
    }

    function toggleAiProductSection() {
        const els = getAiProductElements();
        if (!els || !els.content || !els.toggle) return;
        const isExpanded = els.content.style.display !== 'none';
        els.content.style.display = isExpanded ? 'none' : 'block';
        els.toggle.textContent = isExpanded ? '展开' : '收起';
    }

    function aiProdSetLoading(isLoading, text = '正在生成分析...', productId = null) {
        if (!isCurrentAiProduct(productId)) return;
        const els = getAiProductElements();
        if (!els) return;
        if (els.loading) {
            els.loading.style.display = isLoading ? 'block' : 'none';
            els.loading.textContent = text;
        }
        if (els.btn) {
            els.btn.disabled = !!isLoading;
            if (!isLoading) {
                els.btn.textContent = '生成分析';
            } else if (text) {
                els.btn.textContent = text;
            }
        }
    }

    function aiProdShowError(message, productId = null) {
        if (!isCurrentAiProduct(productId)) return;
        const els = getAiProductElements();
        if (!els) return;
        if (els.error) { els.error.style.display = 'block'; els.error.textContent = message; }
        if (els.result) { els.result.style.display = 'none'; els.result.textContent = ''; }
        if (els.log) els.log.style.display = 'block';
        aiProdSetLoading(false, '生成分析', productId);
    }

    function aiProdShowResult(text, productId = null) {
        if (!isCurrentAiProduct(productId)) return;
        const els = getAiProductElements();
        if (!els) return;
        if (els.error) { els.error.style.display = 'none'; els.error.textContent = ''; }
        if (els.result) { els.result.style.display = 'block'; els.result.textContent = text; }
        if (els.log) els.log.style.display = 'block';
        aiProdSetLoading(false, '生成分析', productId);
    }

    function aiProdAppendLog(text, productId = null) {
        if (!isCurrentAiProduct(productId)) return;
        const els = getAiProductElements();
        if (!els || !els.log) return;
        els.log.style.display = 'block';
        els.log.textContent = (els.log.textContent ? els.log.textContent + '\n' : '') + String(text);
    }


    // 尝试解析JSON字符串，失败时返回null
    function safeParseJSON(text) {
        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch (err) {
            return null;
        }
    }

    // 从响应载荷中提取可读的错误信息
    function extractErrorMessage(payload) {
        if (!payload || typeof payload !== 'object') {
            return null;
        }
        const detail = payload.detail || payload.error || payload;
        const message = detail.message_zh || detail.message || detail.error || detail.msg;
        const code = detail.code || detail.status || detail.error_code;
        if (message && code) {
            return `错误(${code}): ${message}`;
        }
        if (message) {
            return message;
        }
        if (typeof detail === 'string') {
            return detail;
        }
        return null;
    }

    function isSuccessPayload(payload) {
        if (!payload || typeof payload !== 'object') return false;
        const successCodes = new Set([0, 200]);
        if (successCodes.has(payload.code)) {
            return true;
        }
        const message = (payload.message || payload.message_zh || '').toLowerCase();
        return message.includes('success') || message.includes('请求成功');
    }

    function normalizeApiData(data) {
        if (!data) return null;
        if (typeof data === 'string') {
            const trimmed = data.trim();
            if (!trimmed) return null;
            try {
                return JSON.parse(trimmed);
            } catch (err) {
                console.warn('无法解析嵌套JSON数据:', err);
                return null;
            }
        }
        return data;
    }

    function parseHasMoreFlag(flag) {
        if (flag === 1 || flag === '1' || flag === true) return true;
        if (typeof flag === 'string') {
            const lowered = flag.toLowerCase();
            return lowered === 'true' || lowered === 'yes';
        }
        return false;
    }

    function isReviewLike(item) {
        if (!item || typeof item !== 'object') return false;
        return (
            'review_id' in item ||
            'content' in item ||
            'review_content' in item ||
            'comment' in item ||
            'rating' in item ||
            'stars' in item
        );
    }

    function normalizeV1ReviewItem(item) {
        const r = (item && item.review) ? item.review : (item || {});
        const out = { ...r };
        if (item && typeof item.digg_count === 'number') {
            out.likes_count = item.digg_count;
        }
        if (!out.content) {
            // 优先 display_text
            if (typeof out.display_text === 'string' && out.display_text.trim()) {
                out.content = out.display_text;
            } else if (Array.isArray(out.display_review_text) && out.display_review_text.length) {
                const parts = out.display_review_text.map(p => p?.plain_text || (p?.tag_key && p?.tag_text ? `${p.tag_key}: ${p.tag_text}` : '')).filter(Boolean);
                out.content = parts.join(' ').trim();
            }
        }
        if (!out.create_time && out.review_timestamp) {
            const tsNum = Number(out.review_timestamp);
            if (!Number.isNaN(tsNum)) {
                out.create_time = tsNum > 1e12 ? Math.floor(tsNum / 1000) : tsNum; // 兼容毫秒/秒
            }
        }
        if (!out.medias && (out.images || out.videos)) {
            out.medias = out.images || out.videos;
        }
        return out;
    }

    function findReviewArray(value, depth = 0) {
        if (!value || depth > 5) return null;
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return value;
            }
            if (value.some(isReviewLike)) {
                return value;
            }
            return null;
        }
        if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
                const child = value[key];
                const result = findReviewArray(child, depth + 1);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    function extractReviewsList(container) {
        if (!container || typeof container !== 'object') {
            return [];
        }
        // V1: data.review_items
        if (Array.isArray(container.review_items)) {
            return container.review_items.map(normalizeV1ReviewItem);
        }
        if (Array.isArray(container.reviews)) {
            return container.reviews;
        }
        if (Array.isArray(container.review_list)) {
            return container.review_list;
        }
        if (Array.isArray(container.items)) {
            return container.items;
        }
        if (Array.isArray(container.data)) {
            return container.data;
        }
        if (container.reviews && Array.isArray(container.reviews.reviews)) {
            return container.reviews.reviews;
        }
        if (container.reviews && Array.isArray(container.reviews.items)) {
            return container.reviews.items;
        }
        // 继续向下找 data 节点（V1 结构）
        if (container.data && typeof container.data === 'object') {
            const fromData = extractReviewsList(container.data);
            if (fromData.length) return fromData;
        }
        const fallback = findReviewArray(container);
        if (Array.isArray(fallback)) {
            // 如果数组元素是 {review: {...}} 这种，做一次规范化
            if (fallback.some(it => it && typeof it === 'object' && it.review)) {
                return fallback.map(normalizeV1ReviewItem);
            }
            return fallback;
        }
        return [];
    }

    // 构造最终用于展示的错误文案
    function buildErrorMessage(response, parsedPayload = null, fallback = '获取商品信息失败') {
        const payload = parsedPayload || safeParseJSON(response?.responseText);
        const readable = extractErrorMessage(payload);
        if (readable) {
            return readable;
        }
        if (response?.status) {
            return `${fallback} (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''})`;
        }
        if (response?.error) {
            return `${fallback}: ${response.error}`;
        }
        if (response?.responseText) {
            const text = response.responseText.trim();
            if (text) {
                return `${fallback}: ${text.slice(0, 200)}`;
            }
        }
        return fallback;
    }

    // 请求评论单页数据
    function requestProductReviewsPage(productId, pageStart = 1, region = '') {
        const apiToken = getApiToken();
        if (!apiToken) {
            return Promise.reject(new Error('请先配置API Token'));
        }

        const params = new URLSearchParams({
            product_id: productId,
            page_start: pageStart,
            sort_rule: 2,
            filter_type: 1,
            filter_value: 6
        });

        if (region) {
            params.set('region', region);
        }

        const url = `${REVIEWS_API_URL}?${params.toString()}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000,
                onload: function (response) {
                    let payload = null;
                    try {
                        payload = JSON.parse(response.responseText);
                    } catch (err) {
                        reject(new Error('解析评论数据失败: ' + err.message));
                        return;
                    }

                    const statusOk = response.status >= 200 && response.status < 300;
                    if (statusOk && isSuccessPayload(payload) && payload?.data !== undefined) {
                        let parsedData = normalizeApiData(payload.data);
                        // V1 的 data 里还会再包一层 { code, message, data }
                        if (parsedData && typeof parsedData === 'object' && parsedData.data) {
                            parsedData = normalizeApiData(parsedData.data) || parsedData.data;
                        }
                        if (parsedData) {
                            resolve(parsedData);
                            return;
                        }
                        reject(new Error('评论数据格式异常，无法解析'));
                        return;
                    }

                    const reason = buildErrorMessage(response, payload, '获取评论失败');
                    reject(new Error(reason));
                },
                onerror: function (error) {
                    const reason = buildErrorMessage(error, null, '获取评论失败');
                    reject(new Error(reason));
                },
                ontimeout: function () {
                    reject(new Error('评论请求超时，请稍后重试'));
                }
            });
        });
    }

    async function fetchTopReviewsV2(productId, region = '', maxCount = MAX_VOC_REVIEWS) {
        const reviews = [];
        let pageStart = 1;
        let hasMore = true;
        let pageCount = 0;
        const maxPages = 50; // 防止无限循环
        const seenPages = new Set();

        while (reviews.length < maxCount && hasMore && pageCount < maxPages) {
            pageCount++;
            const pageKey = String(pageStart);
            if (seenPages.has(pageKey)) {
                appendVocLog(`[V2] 检测到重复page=${pageStart}，停止拉取`, productId);
                break;
            }
            seenPages.add(pageKey);

            try {
                const pageData = await requestProductReviewsPage(productId, pageStart, region);

                // 提取评论列表
                const pageReviews = extractReviewsList(pageData);
                if (pageReviews.length === 0) {
                    appendVocLog(`[V2] page=${pageStart} 未获取到评论，停止拉取`, productId);
                    break;
                }

                reviews.push(...pageReviews);
                // 实时更新总评论数显示
                updateVocReviewCount(reviews.length, productId);
                appendVocLog(`[V2] 第${pageCount}页 page_start=${pageStart} 获取${pageReviews.length}条，累计${reviews.length}条`, productId);

                // 检查是否还有更多数据
                hasMore = parseHasMoreFlag(pageData.has_more);

                appendVocLog(`[V2] has_more=${hasMore}`, productId);

                // 如果没有更多数据，停止
                if (!hasMore) {
                    appendVocLog(`[V2] 没有更多数据，停止拉取`, productId);
                    break;
                }

                // 更新pageStart
                // V2 API使用page_start参数，每次递增1
                const currentPage = Number(pageData.page_start) || pageStart;
                const nextPage = currentPage + 1;

                // 防止无限循环
                if (nextPage === pageStart) {
                    appendVocLog(`[V2] 下一页page=${nextPage} 与当前page相同，停止拉取`, productId);
                    break;
                }

                pageStart = nextPage;

            } catch (error) {
                appendVocLog(`[V2] 第${pageCount}页 page=${pageStart} 请求失败: ${error.message || error}`, productId);
                // 如果第一页就失败，抛出错误；否则返回已获取的数据
                if (pageCount === 1) {
                    throw error;
                }
                break;
            }
        }

        if (pageCount >= maxPages) {
            appendVocLog(`[V2] 达到最大页数限制(${maxPages})，停止拉取`, productId);
        }

        appendVocLog(`[V2] 完成，共获取${reviews.length}条评论`, productId);
        const finalReviews = reviews.slice(0, maxCount);
        updateVocReviewCount(finalReviews.length, productId);
        return finalReviews;
    }

    function requestProductReviewsV1(productId, cursor = 1, region = '') {
        const apiToken = getApiToken();
        if (!apiToken) {
            return Promise.reject(new Error('请先配置API Token'));
        }

        const params = new URLSearchParams({
            product_id: productId,
            sort_type: 2
        });

        const cursorValue = cursor ?? 1;
        const cursorStr = String(cursorValue);
        if (cursorValue === undefined || cursorValue === null || cursorStr === '') {
            params.set('offset', '1');
        } else if (/^\d+$/.test(cursorStr)) {
            params.set('offset', cursorStr);
        } else {
            params.set('cursor', cursorStr);
        }

        if (region) {
            params.set('region', region);
        }

        const url = `${REVIEWS_V1_API_URL}?${params.toString()}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000,
                onload: function (response) {
                    let payload = null;
                    try {
                        payload = JSON.parse(response.responseText);
                    } catch (err) {
                        reject(new Error('解析评论数据失败: ' + err.message));
                        return;
                    }

                    const statusOk = response.status >= 200 && response.status < 300;
                    if (statusOk && isSuccessPayload(payload) && payload?.data !== undefined) {
                        // V1 API返回结构：payload.data.data 包含实际的评论数据
                        // payload.data.data = { review_items: [], has_more: true, next_cursor: 2 }
                        let parsedData = normalizeApiData(payload.data);
                        // 如果 parsedData 有嵌套的 data 字段，提取它
                        if (parsedData && parsedData.data && typeof parsedData.data === 'object') {
                            parsedData = parsedData.data;
                        }
                        if (parsedData) {
                            resolve(parsedData);
                            return;
                        }
                        reject(new Error('评论数据格式异常，无法解析'));
                        return;
                    }

                    const reason = buildErrorMessage(response, payload, '获取评论失败');
                    reject(new Error(reason));
                },
                onerror: function (error) {
                    const reason = buildErrorMessage(error, null, '获取评论失败');
                    reject(new Error(reason));
                },
                ontimeout: function () {
                    reject(new Error('评论请求超时，请稍后重试'));
                }
            });
        });
    }

    async function fetchTopReviewsV1(productId, region = '', maxCount = MAX_VOC_REVIEWS) {
        const reviews = [];
        let cursor = 1;
        let hasMore = true;
        const seenCursors = new Set();
        let pageCount = 0;
        const maxPages = 50; // 防止无限循环

        while (reviews.length < maxCount && hasMore && pageCount < maxPages) {
            pageCount++;
            const cursorKey = String(cursor ?? '');
            if (seenCursors.has(cursorKey)) {
                appendVocLog(`[V1] 检测到重复cursor=${cursor}，停止拉取`, productId);
                break;
            }
            seenCursors.add(cursorKey);

            try {
                const pageData = await requestProductReviewsV1(productId, cursor, region);

                // 提取评论列表
                const pageReviews = extractReviewsList(pageData);
                if (pageReviews.length === 0) {
                    appendVocLog(`[V1] cursor=${cursor} 未获取到评论，停止拉取`, productId);
                    break;
                }

                reviews.push(...pageReviews);
                // 实时更新总评论数显示
                updateVocReviewCount(reviews.length, productId);
                appendVocLog(`[V1] 第${pageCount}页 cursor=${cursor} 获取${pageReviews.length}条，累计${reviews.length}条`, productId);

                // 检查是否还有更多数据
                // V1 API返回：has_more 和 next_cursor 在 pageData 的顶层
                hasMore = parseHasMoreFlag(pageData.has_more);

                // 获取下一页的cursor
                // V1 API返回结构：next_cursor 是数字，表示下一页的offset
                const nextCursor = pageData.next_cursor;

                appendVocLog(`[V1] has_more=${hasMore}, next_cursor=${nextCursor}`, productId);

                // 如果没有更多数据，或者next_cursor无效，停止
                if (!hasMore) {
                    appendVocLog(`[V1] 没有更多数据，停止拉取`, productId);
                    break;
                }

                // 检查next_cursor是否有效
                if (nextCursor === undefined || nextCursor === null || nextCursor === '') {
                    appendVocLog(`[V1] next_cursor无效，停止拉取`, productId);
                    break;
                }

                // 检查next_cursor是否与当前cursor相同（防止无限循环）
                const nextCursorNum = Number(nextCursor);
                if (!Number.isNaN(nextCursorNum) && nextCursorNum === cursor) {
                    appendVocLog(`[V1] next_cursor=${nextCursor} 与当前cursor相同，停止拉取`, productId);
                    break;
                }

                // 更新cursor为next_cursor
                cursor = nextCursorNum || nextCursor;

            } catch (error) {
                appendVocLog(`[V1] 第${pageCount}页 cursor=${cursor} 请求失败: ${error.message || error}`, productId);
                // 如果第一页就失败，抛出错误；否则返回已获取的数据
                if (pageCount === 1) {
                    throw error;
                }
                break;
            }
        }

        if (pageCount >= maxPages) {
            appendVocLog(`[V1] 达到最大页数限制(${maxPages})，停止拉取`, productId);
        }

        appendVocLog(`[V1] 完成，共获取${reviews.length}条评论`, productId);
        const finalReviews = reviews.slice(0, maxCount);
        updateVocReviewCount(finalReviews.length, productId);
        return finalReviews;
    }

    async function fetchTopReviews(productId, region = '', maxCount = MAX_VOC_REVIEWS) {
        let lastError = null;
        let v2Result = [];

        try {
            v2Result = await fetchTopReviewsV2(productId, region, maxCount);
            if (v2Result.length > 0) {
                // 确保评论数显示正确
                updateVocReviewCount(v2Result.length, productId);
                return v2Result;
            }
        } catch (error) {
            lastError = error;
            appendVocLog(`[V2] failed: ${error.message || error}`, productId);
        }

        try {
            const v1Result = await fetchTopReviewsV1(productId, region, maxCount);
            // 确保评论数显示正确
            updateVocReviewCount(v1Result.length, productId);
            return v1Result;
        } catch (error) {
            lastError = error;
            appendVocLog(`[V1] failed: ${error.message || error}`, productId);
        }

        if (lastError) {
            throw lastError;
        }

        // 如果都失败了，确保显示0
        updateVocReviewCount(0, productId);
        return v2Result;
    }

    // 爬取评论直到达到目标有效评论数
    async function fetchReviewsUntilValidCount(productId, region, targetValidCount, onProgress) {
        const allReviews = [];
        let pageStart = 1;
        let cursor = 1;
        let hasMore = true;
        let pageCount = 0;
        const maxPages = 200; // 防止无限循环
        const seenPages = new Set();
        const seenCursors = new Set();
        let lastError = null;
        let useV2 = true; // 优先使用V2 API

        while (true) {
            pageCount++;
            if (pageCount > maxPages) {
                appendVocLog(`达到最大页数限制(${maxPages})，停止爬取`, productId);
                break;
            }

            try {
                let pageData = null;
                let pageReviews = [];

                // 尝试使用V2 API
                if (useV2) {
                    try {
                        const pageKey = String(pageStart);
                        if (seenPages.has(pageKey)) {
                            appendVocLog(`[V2] 检测到重复page=${pageStart}，切换到V1`, productId);
                            useV2 = false;
                            continue;
                        }
                        seenPages.add(pageKey);

                        pageData = await requestProductReviewsPage(productId, pageStart, region);
                        pageReviews = extractReviewsList(pageData);

                        if (pageReviews.length === 0) {
                            appendVocLog(`[V2] page=${pageStart} 未获取到评论，切换到V1`, productId);
                            useV2 = false;
                            continue;
                        }

                        allReviews.push(...pageReviews);
                        hasMore = parseHasMoreFlag(pageData.has_more);

                        // 统计有效评论数
                        const validReviews = allReviews.filter(hasValidReviewText);
                        const validCount = validReviews.length;
                        const totalCount = allReviews.length;

                        // 实时更新显示
                        updateVocReviewCount(totalCount, productId);
                        if (onProgress) {
                            onProgress(totalCount, validCount, targetValidCount);
                        }

                        appendVocLog(`[V2] 第${pageCount}页 page=${pageStart} 获取${pageReviews.length}条，累计${totalCount}条，有效${validCount}条`, productId);

                        // 检查是否达到目标
                        if (validCount >= targetValidCount) {
                            appendVocLog(`[V2] 已达到目标有效评论数(${validCount}/${targetValidCount})，停止爬取`, productId);
                            return allReviews;
                        }

                        if (!hasMore) {
                            appendVocLog(`[V2] 没有更多数据，切换到V1`, productId);
                            useV2 = false;
                            continue;
                        }

                        const currentPage = Number(pageData.page_start) || pageStart;
                        pageStart = currentPage + 1;

                    } catch (error) {
                        appendVocLog(`[V2] 第${pageCount}页失败: ${error.message || error}，切换到V1`, productId);
                        useV2 = false;
                        continue;
                    }
                } else {
                    // 使用V1 API
                    try {
                        const cursorKey = String(cursor);
                        if (seenCursors.has(cursorKey)) {
                            appendVocLog(`[V1] 检测到重复cursor=${cursor}，停止爬取`, productId);
                            break;
                        }
                        seenCursors.add(cursorKey);

                        pageData = await requestProductReviewsV1(productId, cursor, region);
                        pageReviews = extractReviewsList(pageData);

                        if (pageReviews.length === 0) {
                            appendVocLog(`[V1] cursor=${cursor} 未获取到评论，停止爬取`, productId);
                            break;
                        }

                        allReviews.push(...pageReviews);
                        hasMore = parseHasMoreFlag(pageData.has_more);

                        // 统计有效评论数
                        const validReviews = allReviews.filter(hasValidReviewText);
                        const validCount = validReviews.length;
                        const totalCount = allReviews.length;

                        // 实时更新显示
                        updateVocReviewCount(totalCount, productId);
                        if (onProgress) {
                            onProgress(totalCount, validCount, targetValidCount);
                        }

                        appendVocLog(`[V1] 第${pageCount}页 cursor=${cursor} 获取${pageReviews.length}条，累计${totalCount}条，有效${validCount}条`, productId);

                        // 检查是否达到目标
                        if (validCount >= targetValidCount) {
                            appendVocLog(`[V1] 已达到目标有效评论数(${validCount}/${targetValidCount})，停止爬取`, productId);
                            return allReviews;
                        }

                        if (!hasMore) {
                            appendVocLog(`[V1] 没有更多数据，停止爬取`, productId);
                            break;
                        }

                        const nextCursor = pageData.next_cursor;
                        if (!nextCursor || nextCursor === cursor) {
                            appendVocLog(`[V1] next_cursor无效，停止爬取`, productId);
                            break;
                        }

                        cursor = Number(nextCursor) || nextCursor;

                    } catch (error) {
                        lastError = error;
                        appendVocLog(`[V1] 第${pageCount}页 cursor=${cursor} 失败: ${error.message || error}`, productId);
                        if (pageCount === 1) {
                            throw error;
                        }
                        break;
                    }
                }

            } catch (error) {
                lastError = error;
                appendVocLog(`第${pageCount}页请求失败: ${error.message || error}`, productId);
                if (pageCount === 1) {
                    throw error;
                }
                break;
            }
        }

        if (lastError && allReviews.length === 0) {
            throw lastError;
        }

        appendVocLog(`爬取完成，共获取${allReviews.length}条评论`, productId);
        return allReviews;
    }

    // 检查评论是否有有效的文本内容
    function hasValidReviewText(review) {
        if (!review) return false;

        // 检查 display_text
        let displayText = review.display_text || '';
        if (typeof displayText === 'string' && displayText.trim()) {
            return true;
        }

        // 检查其他文本字段
        let content = review.content || review.review_content || review.comment || '';
        if (typeof content === 'string' && content.trim()) {
            return true;
        }

        // 检查 display_review_text 数组
        if (Array.isArray(review.display_review_text) && review.display_review_text.length > 0) {
            const hasText = review.display_review_text.some(p => {
                const text = p?.plain_text || (p?.tag_key && p?.tag_text ? `${p.tag_key}: ${p.tag_text}` : '');
                return text && text.trim();
            });
            if (hasText) return true;
        }

        // 检查 contents 数组
        if (Array.isArray(review.contents) && review.contents.length > 0) {
            const hasText = review.contents.some(part => part.text && part.text.trim());
            if (hasText) return true;
        }

        return false;
    }

    function formatReviewForPrompt(review, index) {
        if (!review) return `${index + 1}. 无有效评论`;
        const ratingValue = review.rating ?? review.score ?? review.stars ?? review.star ?? null;
        const rating = typeof ratingValue === 'number' ? `${ratingValue}星` : '未标注星级';
        const likesValue = review.likes_count ?? review.digg_count ?? review.likes ?? review.like_count;
        const likes = typeof likesValue === 'number' ? ` 👍${likesValue}` : '';
        const verifiedFlag = review.verified_purchase ?? review.is_verified_buyer ?? review.verified_buyer ?? false;
        const verified = verifiedFlag ? '已购' : '未购';
        const mediaList = review.medias || review.images || review.videos || [];
        const hasMedia = Array.isArray(mediaList) && mediaList.length ? ' 含多媒体' : '';
        let timestamp = review.create_time ?? review.review_time ?? review.timestamp ?? review.review_timestamp;
        if (timestamp && Number(timestamp) > 1e12) {
            timestamp = Math.floor(Number(timestamp) / 1000);
        }
        const date = timestamp ? new Date(Number(timestamp) * 1000).toISOString().split('T')[0] : '';
        let content = review.content || review.review_content || review.comment || review.display_text || '';
        if (!content && Array.isArray(review.display_review_text)) {
            content = review.display_review_text.map(p => p?.plain_text || (p?.tag_key && p?.tag_text ? `${p.tag_key}: ${p.tag_text}` : '')).filter(Boolean).join(' ');
        }
        if (!content && Array.isArray(review.contents)) {
            content = review.contents.map(part => part.text || '').join(' ');
        }
        content = content.replace(/\s+/g, ' ').trim();
        if (!content) {
            content = '（无文本内容）';
        }
        if (content.length > 400) {
            content = content.slice(0, 400) + '...';
        }
        return `${index + 1}. [${rating}${likes}${date ? ` ${date}` : ''}] ${verified}${hasMedia} - ${content}`;
    }

    function buildVocPrompt(productId, reviews) {
        // 过滤掉display_text为空的评论
        const validReviews = reviews.filter(hasValidReviewText);

        if (validReviews.length === 0) {
            throw new Error('没有有效的评论内容（所有评论的display_text都为空）');
        }

        const reviewLines = validReviews.map((review, idx) => formatReviewForPrompt(review, idx)).join('\n');
        return [
            '你是电商消费者声音（VOC）分析专家，请用中文输出结果。',
            `以下是 TikTok Shop 商品（product_id: ${productId}）最近 ${validReviews.length} 条真实买家评论（已排除无文本内容的评论）。`,
            '要求：',
            '0. 绝不能使用或猜测未在评论里出现的信息，禁止杜撰数据或引用外部资料。',
            '1. 任何结论、标签、洞察都必须给出可量化的原始数据支持：明确涉及的评论编号（按下方列表的序号）以及对应数量、占比（以提供的评论总数为分母，保留1位小数）。若无法计算占比，请说明原因。',
            '2. 在正式洞察前先输出《数据概览》小节，至少包含：总评论数、正向评论数、负向评论数（若无法判断情绪请写“无法判断”并说明原因）、含多媒体评论数等你能从原文准确统计的关键指标；请将该小节按逐行列出（每个指标单独占一行），禁止写在同一行。',
            '3. 关键需求/痛点、正面机会点、风险与负向舆情预警、改进建议等章节，每一条都要引用评论编号和对应原文要点，格式示例：“条目内容（涉及评论：#1、#3，占比：40%）原文要点：xxx”。',
            '4. 改进建议必须显式说明其依据的评论编号，且建议内容要与对应评论指出的问题或需求一一对应。',
            '5. 最终总结需包含总体情绪（必须基于统计）、风险评分（1-10，说明计算理由或参考的评论数量）。',
            '若某些统计或结论无法得出，请直接写“无相关数据，不输出”或“数据不足以判断”，不要编造。',
            '评论原文（请按编号引用）：',
            reviewLines
        ].join('\n');
    }

    function extractGeminiText(payload) {
        if (!payload) return null;
        const candidate = payload.candidates?.find(c => c?.content?.parts?.some(part => part.text));
        if (!candidate) return null;
        return candidate.content.parts.map(part => part.text || '').join('\n').trim();
    }

    function requestGeminiAnalysis(prompt) {
        const apiKey = (getGeminiApiKey() || '').trim();
        if (!apiKey) {
            return Promise.reject(new Error('请先配置Gemini API Key'));
        }

        const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent`;
        const body = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                topP: 0.9,
                maxOutputTokens: 65536  // 增加到8192，支持更详细的VOC分析输出
            }
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                data: JSON.stringify(body),
                timeout: 90000,  // 增加到90秒，VOC分析可能需要更长时间
                onload: function (response) {
                    let payload = null;
                    try {
                        payload = JSON.parse(response.responseText);
                    } catch (err) {
                        reject(new Error('解析Gemini响应失败: ' + err.message));
                        return;
                    }

                    const statusOk = response.status >= 200 && response.status < 300;
                    if (statusOk) {
                        // 检查是否有 finishReason 为 MAX_TOKENS 的情况
                        const candidate = payload?.candidates?.[0];
                        if (candidate?.finishReason === 'MAX_TOKENS') {
                            // 即使被截断，也尝试提取已有内容
                            const text = extractGeminiText(payload);
                            if (text) {
                                // 返回截断的内容，并添加提示
                                resolve(text + '\n\n[注意：响应因达到最大token限制而被截断，部分内容可能不完整]');
                                return;
                            }
                            reject(new Error('响应达到最大token限制，且无法提取有效内容。请尝试减少评论数量或增加maxOutputTokens。'));
                            return;
                        }

                        const text = extractGeminiText(payload);
                        if (text) {
                            resolve(text);
                            return;
                        }

                        // 检查其他 finishReason
                        if (candidate?.finishReason) {
                            reject(new Error(`Gemini响应完成原因: ${candidate.finishReason}。${payload?.error?.message || '未返回有效内容'}`));
                            return;
                        }

                        const reason = payload?.error?.message || 'Gemini未返回有效内容';
                        reject(new Error(reason));
                        return;
                    }

                    const reason = payload?.error?.message || buildErrorMessage(response, payload, 'Gemini分析失败');
                    reject(new Error(reason));
                },
                onerror: function (error) {
                    const reason = buildErrorMessage(error, null, 'Gemini请求失败');
                    reject(new Error(reason));
                },
                ontimeout: function () {
                    reject(new Error('Gemini请求超时，请稍后重试'));
                }
            });
        });
    }

    // 定义商品分析的JSON Schema
    function getProductAnalysisSchema() {
        return {
            type: "object",
            properties: {
                efficacy: {
                    type: "array",
                    description: "功效列表，每个功效必须基于输入内容",
                    items: {
                        type: "object",
                        properties: {
                            name_zh: {
                                type: "string",
                                description: "功效名称（中文）"
                            },
                            name_original: {
                                type: "string",
                                description: "功效名称（原文，即输入内容中的原始表述）"
                            },
                            evidence: {
                                type: "string",
                                description: "证据来源，格式：来自文字：【产品名称】中的\"xxx\"和【详情文本】中的\"xxx\"，或来自图片：xxx"
                            }
                        },
                        required: ["name_zh", "name_original", "evidence"]
                    }
                },
                ingredients: {
                    type: "array",
                    description: "成分列表，每个成分必须基于输入内容",
                    items: {
                        type: "object",
                        properties: {
                            name_zh: {
                                type: "string",
                                description: "成分名称（中文）"
                            },
                            name_original: {
                                type: "string",
                                description: "成分名称（原文，即输入内容中的原始表述）"
                            },
                            evidence: {
                                type: "string",
                                description: "证据来源，格式：来自文字：【产品名称】中的\"xxx\"和【详情文本】中的\"xxx\"，或来自图片：xxx"
                            }
                        },
                        required: ["name_zh", "name_original", "evidence"]
                    }
                },
                sellingPoints: {
                    type: "array",
                    description: "卖点列表，每个卖点必须基于输入内容",
                    items: {
                        type: "object",
                        properties: {
                            point_zh: {
                                type: "string",
                                description: "卖点描述（中文）"
                            },
                            point_original: {
                                type: "string",
                                description: "卖点描述（原文，即输入内容中的原始表述）"
                            },
                            evidence: {
                                type: "string",
                                description: "证据来源，格式：来自文字：【产品名称】中的\"xxx\"和【详情文本】中的\"xxx\"，或来自图片：xxx"
                            }
                        },
                        required: ["point_zh", "point_original", "evidence"]
                    }
                }
            },
            required: ["efficacy", "ingredients", "sellingPoints"]
        };
    }

    function requestGeminiAnalysisWithParts(parts) {
        const apiKey = (getGeminiApiKey() || '').trim();
        if (!apiKey) {
            return Promise.reject(new Error('请先配置Gemini API Key'));
        }
        const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent`;
        const body = {
            contents: [{ parts }],
            generationConfig: {
                temperature: 0.3,
                topP: 0.9,
                maxOutputTokens: 8192  // 增加到8192，支持更大的输出
            }
        };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                data: JSON.stringify(body),
                timeout: 60000,  // 增加超时时间到60秒，因为图片处理可能需要更长时间
                onload: function (response) {
                    let payload = null;
                    try { payload = JSON.parse(response.responseText); } catch (err) {
                        reject(new Error('解析Gemini响应失败: ' + err.message));
                        return;
                    }
                    const statusOk = response.status >= 200 && response.status < 300;
                    if (statusOk) {
                        // 检查是否有 finishReason 为 MAX_TOKENS 的情况
                        const candidate = payload?.candidates?.[0];
                        if (candidate?.finishReason === 'MAX_TOKENS') {
                            // 即使被截断，也尝试提取已有内容
                            const text = extractGeminiText(payload);
                            if (text) {
                                // 返回截断的内容，并添加提示
                                resolve(text + '\n\n[注意：响应因达到最大token限制而被截断，部分内容可能不完整]');
                                return;
                            }
                            reject(new Error('响应达到最大token限制，且无法提取有效内容。请尝试减少输入内容或增加maxOutputTokens。'));
                            return;
                        }

                        const text = extractGeminiText(payload);
                        if (text) { resolve(text); return; }

                        // 检查其他 finishReason
                        if (candidate?.finishReason) {
                            reject(new Error(`Gemini响应完成原因: ${candidate.finishReason}。${payload?.error?.message || '未返回有效内容'}`));
                            return;
                        }

                        reject(new Error(payload?.error?.message || 'Gemini未返回有效内容'));
                        return;
                    }
                    reject(new Error(payload?.error?.message || 'Gemini分析失败'));
                },
                onerror: function (error) { reject(new Error(buildErrorMessage(error, null, 'Gemini请求失败'))); },
                ontimeout: function () { reject(new Error('Gemini请求超时，请稍后重试')); }
            });
        });
    }

    // 使用结构化输出的请求函数
    function requestGeminiStructuredAnalysis(parts, schema) {
        const apiKey = (getGeminiApiKey() || '').trim();
        if (!apiKey) {
            return Promise.reject(new Error('请先配置Gemini API Key'));
        }
        const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent`;
        const body = {
            contents: [{ parts }],
            generationConfig: {
                temperature: 0.3,
                topP: 0.9,
                maxOutputTokens: 8192,  // 增加到8192，支持更大的输出
                responseMimeType: "application/json",
                responseJsonSchema: schema
            }
        };
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                data: JSON.stringify(body),
                timeout: 60000,
                onload: function (response) {
                    let payload = null;
                    try { payload = JSON.parse(response.responseText); } catch (err) {
                        reject(new Error('解析Gemini响应失败: ' + err.message));
                        return;
                    }
                    const statusOk = response.status >= 200 && response.status < 300;
                    if (statusOk) {
                        const candidate = payload?.candidates?.[0];
                        if (candidate?.finishReason === 'MAX_TOKENS') {
                            const text = extractGeminiText(payload);
                            if (text) {
                                try {
                                    const jsonData = JSON.parse(text);
                                    resolve(jsonData);
                                    return;
                                } catch (e) {
                                    reject(new Error('响应被截断且无法解析为有效JSON'));
                                    return;
                                }
                            }
                            reject(new Error('响应达到最大token限制，且无法提取有效内容'));
                            return;
                        }

                        const text = extractGeminiText(payload);
                        if (text) {
                            try {
                                const jsonData = JSON.parse(text);
                                resolve(jsonData);
                                return;
                            } catch (e) {
                                reject(new Error('无法解析为有效JSON: ' + e.message));
                                return;
                            }
                        }

                        if (candidate?.finishReason) {
                            reject(new Error(`Gemini响应完成原因: ${candidate.finishReason}。${payload?.error?.message || '未返回有效内容'}`));
                            return;
                        }

                        reject(new Error(payload?.error?.message || 'Gemini未返回有效内容'));
                        return;
                    }
                    reject(new Error(payload?.error?.message || 'Gemini分析失败'));
                },
                onerror: function (error) { reject(new Error(buildErrorMessage(error, null, 'Gemini请求失败'))); },
                ontimeout: function () { reject(new Error('Gemini请求超时，请稍后重试')); }
            });
        });
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function guessMimeTypeFromHeadersOrUrl(headers, url) {
        const ct = /content-type:\s*([^\r\n]+)/i.exec(headers || '');
        if (ct && ct[1]) return ct[1].trim();
        const lower = (url || '').toLowerCase();
        if (lower.endsWith('.png')) return 'image/png';
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.jfif')) return 'image/jpeg';
        if (lower.endsWith('.webp')) return 'image/webp';
        return 'image/jpeg';
    }

    function fetchImageAsInlinePart(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET', url, responseType: 'arraybuffer', timeout: 20000,
                onload: function (resp) {
                    try {
                        const mime = guessMimeTypeFromHeadersOrUrl(resp.responseHeaders, url);
                        const b64 = arrayBufferToBase64(resp.response);
                        resolve({ inline_data: { mime_type: mime, data: b64 } });
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function () { resolve(null); },
                ontimeout: function () { resolve(null); }
            });
        });
    }

    let lastProductDetail = null; // 缓存最近一次商品详情
    let currentAiProductId = null; // 当前正在展示AI分析的商品ID
    let currentVocProductId = null; // 当前正在展示VOC分析的商品ID

    function isCurrentAiProduct(productId) {
        return !productId || productId === currentAiProductId;
    }

    function resetAiProductPanel(productId) {
        const els = getAiProductElements();
        currentAiProductId = productId || null;
        if (!els) return;
        if (els.container) {
            els.container.dataset.productId = currentAiProductId || '';
        }
        if (els.loading) {
            els.loading.style.display = 'none';
            els.loading.textContent = '正在整理商品信息并生成分析...';
        }
        if (els.error) {
            els.error.style.display = 'none';
            els.error.textContent = '';
        }
        if (els.result) {
            els.result.style.display = 'none';
            els.result.textContent = '';
        }
        if (els.log) {
            els.log.style.display = 'none';
            els.log.textContent = '';
        }
        if (els.btn) {
            els.btn.disabled = false;
            els.btn.textContent = '生成分析';
        }
        if (els.toggle) {
            els.toggle.textContent = '收起';
        }
    }

    function isCurrentVocProduct(productId) {
        return !productId || productId === currentVocProductId;
    }

    function resetVocPanel(productId) {
        const els = getVocSidebarElements();
        currentVocProductId = productId || null;
        if (!els) return;
        if (els.sidebar) {
            els.sidebar.dataset.productId = currentVocProductId || '';
        }
        if (els.loadingContainer) {
            els.loadingContainer.style.display = 'none';
        }
        if (els.loadingText) {
            els.loadingText.textContent = '正在加载...';
        }
        if (els.errorContainer) {
            els.errorContainer.style.display = 'none';
        }
        if (els.error) {
            els.error.textContent = '';
        }
        if (els.resultsContainer) {
            els.resultsContainer.style.display = 'none';
            els.resultsContainer.innerHTML = '';
        }
        if (els.log) {
            els.log.style.display = 'none';
            els.log.textContent = '';
        }
        if (els.productId) {
            els.productId.textContent = productId || '';
        }
        updateVocReviewCount(null, productId);
    }

    function extractProductContext(apiPayload) {
        const product = apiPayload?.data?.productInfo || {};
        const base = product.product_base || {};
        const title = base.title || '';
        const specs = Array.isArray(base.specifications) ? base.specifications.map(s => `${s.name}: ${s.value}`).join('\n') : '';
        // 主图
        const mainImages = Array.isArray(base.images) ? base.images.map(img => (img.url_list && img.url_list[0]) || '').filter(Boolean) : [];
        // 描述文字与图片
        let descText = '';
        let descImages = [];
        try {
            if (base.desc_detail) {
                const parts = typeof base.desc_detail === 'string' ? JSON.parse(base.desc_detail) : base.desc_detail;
                if (Array.isArray(parts)) {
                    descText = parts.filter(p => p.type === 'text' && p.text).map(p => p.text).join('\n');
                    descImages = parts.filter(p => p.type === 'image' && p.image && Array.isArray(p.image.url_list)).map(p => p.image.url_list[0]).filter(Boolean);
                }
            }
        } catch (e) {
            // 忽略解析错误
        }
        return { title, specs, mainImages, descText, descImages };
    }

    async function handleAiProductAnalysis() {
        const productId = currentAiProductId;
        showAiProductSection();
        if (!lastProductDetail || !productId) {
            aiProdShowError('请先加载商品详情，再生成AI商品分析', productId);
            return;
        }
        aiProdSetLoading(true, '收集中...', productId);
        const ctx = extractProductContext(lastProductDetail);
        const parts = [];

        // 限制描述文本长度，避免输入token过多
        let descText = ctx.descText || '';
        if (descText.length > 2000) {
            descText = descText.substring(0, 2000) + '...（已截断）';
        }

        // 严格的提示词：只基于输入内容，不自行揣测
        const intro = [
            '你是商品信息提取专家。请严格基于以下提供的文字和图片内容进行分析，',
            '不要自行揣测、编造或添加任何未在输入内容中明确出现的信息。',
            '',
            '要求：',
            '1. 功效：只提取文字或图片中明确提到的功效。每个功效需要提供：',
            '   - name_zh: 中文名称（如果原文是中文则保持一致，如果是外文则翻译）',
            '   - name_original: 原文中的原始表述（保持原文不变）',
            '   - evidence: 证据来源，格式：来自文字：【产品名称】中的"xxx"和【详情文本】中的"xxx"，或来自图片：描述图片中的内容',
            '',
            '2. 成分：只提取文字或图片中明确提到的成分。每个成分需要提供：',
            '   - name_zh: 中文名称（如果原文是中文则保持一致，如果是外文则翻译）',
            '   - name_original: 原文中的原始表述（保持原文不变）',
            '   - evidence: 证据来源，格式：来自文字：【产品名称】中的"xxx"和【详情文本】中的"xxx"，或来自图片：描述图片中的内容',
            '',
            '3. 卖点：只提取文字或图片中明确提到的卖点。每个卖点需要提供：',
            '   - point_zh: 中文描述（如果原文是中文则保持一致，如果是外文则翻译）',
            '   - point_original: 原文中的原始表述（保持原文不变）',
            '   - evidence: 证据来源，格式：来自文字：【产品名称】中的"xxx"和【详情文本】中的"xxx"，或来自图片：描述图片中的内容',
            '',
            '如果某项在输入内容中没有明确提到，请返回空数组，不要自行推断。',
            '',
            `【产品名称】\n${ctx.title || '无'}`,
            ctx.specs ? `\n【商品规格】\n${ctx.specs.substring(0, 500)}${ctx.specs.length > 500 ? '...' : ''}` : '',
            descText ? `\n【详情文本】\n${descText}` : ''
        ].filter(Boolean).join('\n');
        parts.push({ text: intro });

        // 传入所有图片：所有主图 + 所有详情图
        const imageUrls = [
            ...(ctx.mainImages || []),
            ...(ctx.descImages || [])
        ];

        aiProdAppendLog(`共选择图片 ${imageUrls.length} 张用于分析`, productId);
        let attached = 0;
        for (const url of imageUrls) {
            // 将图片转为 inline_data 供 Gemini 使用
            const part = await fetchImageAsInlinePart(url);
            if (part) {
                parts.push(part);
                attached++;
            } else {
                aiProdAppendLog(`图片附加失败(跳过): ${url}`, productId);
            }
        }
        aiProdAppendLog(`成功附加图片 ${attached} 张`, productId);

        try {
            aiProdSetLoading(true, '分析生成中...', productId);
            const schema = getProductAnalysisSchema();
            const analysis = await requestGeminiStructuredAnalysis(parts, schema);
            // 格式化显示JSON结果
            formatAndShowAnalysisResult(analysis, productId);
        } catch (err) {
            aiProdShowError(err.message || 'AI 商品分析失败', productId);
        }
    }

    // 格式化并显示分析结果
    function formatAndShowAnalysisResult(data, productId = null) {
        if (!isCurrentAiProduct(productId)) return;
        if (!data || typeof data !== 'object') {
            aiProdShowError('分析结果格式错误', productId);
            return;
        }

        let html = '';

        // 功效
        html += '<h2>功效</h2>';
        if (Array.isArray(data.efficacy) && data.efficacy.length > 0) {
            html += '<ul style="list-style: none; padding-left: 0;">';
            data.efficacy.forEach((item, index) => {
                const nameZh = escapeHtml(item.name_zh || '未知');
                const nameOriginal = escapeHtml(item.name_original || '');
                const displayName = nameOriginal ? `${nameZh}(${nameOriginal})` : nameZh;

                html += `<li style="margin-bottom: 12px; padding: 8px; background: #fff; border-left: 3px solid #1890ff;">`;
                html += `<strong>${index + 1}. ${displayName}</strong><br>`;
                html += `<span style="color: #595959; font-size: 13px;">证据：${escapeHtml(item.evidence || '未提供')}</span>`;
                html += '</li>';
            });
            html += '</ul>';
        } else {
            html += '<p style="color: #8c8c8c;">（未在输入内容中找到明确的功效信息）</p>';
        }

        // 成分
        html += '<h2>成分</h2>';
        if (Array.isArray(data.ingredients) && data.ingredients.length > 0) {
            html += '<ul style="list-style: none; padding-left: 0;">';
            data.ingredients.forEach((item, index) => {
                const nameZh = escapeHtml(item.name_zh || '未知');
                const nameOriginal = escapeHtml(item.name_original || '');
                const displayName = nameOriginal ? `${nameZh}(${nameOriginal})` : nameZh;

                html += `<li style="margin-bottom: 12px; padding: 8px; background: #fff; border-left: 3px solid #52c41a;">`;
                html += `<strong>${index + 1}. ${displayName}</strong><br>`;
                html += `<span style="color: #595959; font-size: 13px;">证据：${escapeHtml(item.evidence || '未提供')}</span>`;
                html += '</li>';
            });
            html += '</ul>';
        } else {
            html += '<p style="color: #8c8c8c;">（未在输入内容中找到明确的成分信息）</p>';
        }

        // 卖点
        html += '<h2>卖点</h2>';
        if (Array.isArray(data.sellingPoints) && data.sellingPoints.length > 0) {
            html += '<ul style="list-style: none; padding-left: 0;">';
            data.sellingPoints.forEach((item, index) => {
                const pointZh = escapeHtml(item.point_zh || '未知');
                const pointOriginal = escapeHtml(item.point_original || '');
                const displayPoint = pointOriginal ? `${pointZh}(${pointOriginal})` : pointZh;

                html += `<li style="margin-bottom: 12px; padding: 8px; background: #fff; border-left: 3px solid #fa8c16;">`;
                html += `<strong>${index + 1}. ${displayPoint}</strong><br>`;
                html += `<span style="color: #595959; font-size: 13px;">证据：${escapeHtml(item.evidence || '未提供')}</span>`;
                html += '</li>';
            });
            html += '</ul>';
        } else {
            html += '<p style="color: #8c8c8c;">（未在输入内容中找到明确的卖点信息）</p>';
        }

        // 显示原始JSON（用于调试）
        html += '<hr>';
        html += '<p><strong>原始JSON数据：</strong></p>';
        html += `<pre><code>${escapeHtml(JSON.stringify(data, null, 2))}</code></pre>`;

        const els = getAiProductElements();
        if (!isCurrentAiProduct(productId) || !els) return;
        if (els.result) {
            els.result.innerHTML = html;
            els.result.style.display = 'block';
        }
        if (els.error) {
            els.error.style.display = 'none';
            els.error.textContent = '';
        }
        aiProdSetLoading(false, '生成分析', productId);
    }

    // HTML转义函数
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Markdown转HTML函数（简化版，支持常用语法）
    function markdownToHtml(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        let html = markdown;

        // 转义HTML特殊字符（但保留markdown标记）
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // 代码块 (```...```)
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            const escapedCode = code.trim()
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            return `<pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; margin: 12px 0;"><code style="font-family: 'Courier New', monospace; font-size: 13px;">${escapedCode}</code></pre>`;
        });

        // 行内代码 (`...`)
        html = html.replace(/`([^`]+)`/g, '<code style="background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: \'Courier New\', monospace; font-size: 13px; color: #e83e8c;">$1</code>');

        // 标题 (# ## ### #### ##### ######)
        html = html.replace(/^#######\s+(.+)$/gm, '<h6 style="font-size: 14px; font-weight: 600; margin: 16px 0 8px 0; color: #262626;">$1</h6>');
        html = html.replace(/^######\s+(.+)$/gm, '<h6 style="font-size: 15px; font-weight: 600; margin: 16px 0 8px 0; color: #262626;">$1</h6>');
        html = html.replace(/^#####\s+(.+)$/gm, '<h5 style="font-size: 16px; font-weight: 600; margin: 18px 0 10px 0; color: #262626;">$1</h5>');
        html = html.replace(/^####\s+(.+)$/gm, '<h4 style="font-size: 17px; font-weight: 600; margin: 20px 0 12px 0; color: #262626;">$1</h4>');
        html = html.replace(/^###\s+(.+)$/gm, '<h3 style="font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #262626; border-bottom: 2px solid #e8e8e8; padding-bottom: 8px;">$1</h3>');
        html = html.replace(/^##\s+(.+)$/gm, '<h2 style="font-size: 20px; font-weight: 600; margin: 28px 0 16px 0; color: #262626; border-bottom: 2px solid #d9d9d9; padding-bottom: 10px;">$1</h2>');
        html = html.replace(/^#\s+(.+)$/gm, '<h1 style="font-size: 24px; font-weight: 600; margin: 32px 0 20px 0; color: #262626; border-bottom: 3px solid #1890ff; padding-bottom: 12px;">$1</h1>');

        // 粗体 (**text** 或 __text__)
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600; color: #262626;">$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong style="font-weight: 600; color: #262626;">$1</strong>');

        // 斜体 (*text* 或 _text_)
        html = html.replace(/\*([^*]+)\*/g, '<em style="font-style: italic; color: #595959;">$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em style="font-style: italic; color: #595959;">$1</em>');

        // 处理列表（逐行处理，识别连续列表项）
        const htmlLines = html.split('\n');
        const processedLines = [];
        let inOrderedList = false;
        let inUnorderedList = false;
        let listItems = [];

        const flushList = () => {
            if (listItems.length > 0) {
                if (inOrderedList) {
                    processedLines.push(`<ol style="margin: 12px 0; padding-left: 24px;">${listItems.join('')}</ol>`);
                } else if (inUnorderedList) {
                    processedLines.push(`<ul style="margin: 12px 0; padding-left: 24px;">${listItems.join('')}</ul>`);
                }
                listItems = [];
            }
            inOrderedList = false;
            inUnorderedList = false;
        };

        for (let i = 0; i < htmlLines.length; i++) {
            const line = htmlLines[i];
            const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
            const unorderedMatch = line.match(/^[\*\-\+]\s+(.+)$/);

            if (orderedMatch) {
                if (!inOrderedList) {
                    flushList();
                    inOrderedList = true;
                }
                listItems.push(`<li style="margin: 6px 0; padding-left: 4px;">${orderedMatch[2]}</li>`);
            } else if (unorderedMatch) {
                if (!inUnorderedList) {
                    flushList();
                    inUnorderedList = true;
                }
                listItems.push(`<li style="margin: 6px 0; padding-left: 4px;">${unorderedMatch[1]}</li>`);
            } else {
                flushList();
                processedLines.push(line);
            }
        }
        flushList();

        html = processedLines.join('\n');

        // 链接 [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: none; border-bottom: 1px solid #1890ff;">$1</a>');

        // 水平线 (--- 或 ***)
        html = html.replace(/^---$/gm, '<hr style="border: none; border-top: 1px solid #e8e8e8; margin: 20px 0;">');
        html = html.replace(/^\*\*\*$/gm, '<hr style="border: none; border-top: 1px solid #e8e8e8; margin: 20px 0;">');

        // 段落（将连续的非空行包裹为段落）
        const lines = html.split('\n');
        const paragraphs = [];
        let currentPara = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // 如果是空行，结束当前段落
            if (line === '') {
                if (currentPara.length > 0) {
                    paragraphs.push(currentPara.join(' '));
                    currentPara = [];
                }
                paragraphs.push('');
            }
            // 如果已经是HTML标签（标题、列表、代码块等），直接添加
            else if (line.startsWith('<') && (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<li') || line.startsWith('<pre') || line.startsWith('<hr'))) {
                if (currentPara.length > 0) {
                    paragraphs.push(currentPara.join(' '));
                    currentPara = [];
                }
                paragraphs.push(line);
            }
            // 否则添加到当前段落
            else {
                currentPara.push(line);
            }
        }

        // 处理最后一个段落
        if (currentPara.length > 0) {
            paragraphs.push(currentPara.join(' '));
        }

        // 将段落包裹为 <p> 标签
        html = paragraphs.map(p => {
            if (p === '') {
                return '';
            }
            if (p.startsWith('<')) {
                return p;
            }
            return `<p style="margin: 12px 0; line-height: 1.8; color: #262626;">${p}</p>`;
        }).join('\n');

        // 恢复HTML特殊字符（在代码块和代码中已经处理过）
        html = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

        return html;
    }

    // 显示商品信息
    function showProductInfo(data, productId) {
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (!sidebar) return;

        const productInfo = sidebar.querySelector('.product-info');
        const product = data.data?.productInfo || {};

        if (!product.product_base) {
            showError('商品信息不完整');
            return;
        }

        const productBase = product.product_base;
        const seller = product.seller || {};
        const skus = product.skus || [];
        const firstSku = skus[0] || {};
        const price = firstSku.price || {};
        const logistic = product.logistic || {};
        const review = product.product_detail_review || {};

        // 解析商品描述
        let descDetail = '';
        try {
            if (productBase.desc_detail) {
                const descParts = JSON.parse(productBase.desc_detail);
                descDetail = descParts.map(part => {
                    if (part.type === 'text') {
                        return part.text;
                    } else if (part.type === 'image' && part.image) {
                        return `<img src="${part.image.url_list[0]}" class="product-image" />`;
                    }
                    return '';
                }).join('');
            }
        } catch (e) {
            descDetail = productBase.desc_detail || '';
        }

        // 构建HTML
        let html = '';

        // 商品标题和图片
        html += `
            <div class="product-info-section">
                <h4>商品基本信息</h4>
                <div class="product-info-item">
                    <strong>${productBase.title || '无标题'}</strong>
                </div>
                ${productBase.images && productBase.images.length > 0 ? `
                    <div class="product-images">
                        ${productBase.images.slice(0, 6).map(img => `
                            <img src="${img.url_list[0]}" class="product-image-thumb" 
                                 onclick="window.open('${img.url_list[0]}', '_blank')" />
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        // 价格信息
        if (price.real_price) {
            html += `
                <div class="product-info-section">
                    <h4>价格信息</h4>
                    <div class="price-info">
                        <span class="price-current">${price.real_price.price_str || ''}</span>
                        ${price.original_price && price.original_price !== '-' ? `
                            <span class="price-original">${price.original_price}</span>
                        ` : ''}
                        ${price.discount && price.discount !== '-' ? `
                            <span class="price-discount">${price.discount}</span>
                        ` : ''}
                    </div>
                    ${firstSku.stock !== undefined ? `
                        <div class="product-info-item">
                            <label>库存:</label>
                            <span>${firstSku.stock}</span>
                        </div>
                    ` : ''}
                    ${productBase.sold_count !== undefined ? `
                        <div class="product-info-item">
                            <label>已售:</label>
                            <span>${productBase.sold_count}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // 店铺信息
        html += `
            <div class="product-info-section">
                <h4>店铺信息</h4>
                <div class="product-info-item">
                    <label>店铺名称:</label>
                    <span>${seller.name || '未知'}</span>
                </div>
                ${seller.seller_location ? `
                    <div class="product-info-item">
                        <label>所在地:</label>
                        <span>${seller.seller_location}</span>
                    </div>
                ` : ''}
                ${seller.product_count !== undefined ? `
                    <div class="product-info-item">
                        <label>商品数量:</label>
                        <span>${seller.product_count}</span>
                    </div>
                ` : ''}
            </div>
        `;

        // 商品规格
        if (productBase.specifications && productBase.specifications.length > 0) {
            html += `
                <div class="product-info-section">
                    <h4>商品规格</h4>
                    <div class="specifications-list">
                        ${productBase.specifications.map(spec => `
                            <div class="specification-item">
                                <div class="specification-name">${spec.name}</div>
                                <div class="specification-value">${spec.value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // 评价信息
        if (review.product_rating) {
            html += `
                <div class="product-info-section">
                    <h4>评价信息</h4>
                    <div class="product-info-item">
                        <label>评分:</label>
                        <span>${review.product_rating} / 5.0</span>
                    </div>
                    <div class="product-info-item">
                        <label>评价数量:</label>
                        <span>${review.review_count || 0}</span>
                    </div>
                </div>
            `;
        }

        // 物流信息
        if (logistic.delivery_name) {
            html += `
                <div class="product-info-section">
                    <h4>物流信息</h4>
                    <div class="product-info-item">
                        <label>配送方式:</label>
                        <span>${logistic.delivery_name}</span>
                    </div>
                    ${logistic.shipping_fee ? `
                        <div class="product-info-item">
                            <label>运费:</label>
                            <span>${logistic.shipping_fee.price_str || ''}</span>
                        </div>
                    ` : ''}
                    ${logistic.lead_time ? `
                        <div class="product-info-item">
                            <label>预计送达:</label>
                            <span>${logistic.lead_time}</span>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // 商品描述
        if (descDetail) {
            html += `
                <div class="product-info-section">
                    <h4>商品描述</h4>
                    <div style="line-height: 1.6; color: #595959;">
                        ${descDetail}
                    </div>
                </div>
            `;
        }

        const resolvedProductId = productId || productBase.product_id || productBase.id || product.product_id || data.data?.product_id || '';
        resetAiProductPanel(resolvedProductId);
        showAiProductSection();

        productInfo.innerHTML = html;
        productInfo.classList.add('active');
        sidebar.querySelector('.loading').style.display = 'none';
        sidebar.querySelector('.error').style.display = 'none';
        lastProductDetail = data;
        if (resolvedProductId) {
            currentAiProductId = resolvedProductId;
        }
    }

    // 调用API获取商品详情
    function fetchProductDetail(productId, region = '') {
        const apiToken = getApiToken();
        if (!apiToken) {
            showError('请先配置API Token');
            return;
        }

        showLoading();
        openSidebar();

        const url = `${API_BASE_URL}?product_id=${productId}${region ? `&region=${region}` : ''}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000,
            onload: function (response) {
                const statusOk = response.status >= 200 && response.status < 300;
                let data = null;
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    if (statusOk) {
                        showError('解析响应数据失败: ' + e.message);
                        return;
                    }
                }

                if (statusOk && data?.code === 200 && data.data) {
                    showProductInfo(data, productId);
                    return;
                }

                const reason = buildErrorMessage(response, data, '获取商品信息失败');
                showError(reason);
            },
            onerror: function (error) {
                const reason = buildErrorMessage(error, null, '请求失败');
                showError(reason);
            },
            ontimeout: function () {
                showError('请求超时，请重试');
            }
        });
    }

    // 开始VOC分析
    async function startVocAnalysis(productId, region, targetValidCount, triggerButton) {
        openVocSidebar();
        resetVocPanel(productId);

        // 设置商品ID
        const els = getVocSidebarElements();
        if (els && els.productId) {
            els.productId.textContent = productId;
        }

        // 绑定重新分析按钮
        if (els && els.reanalyzeBtn) {
            els.reanalyzeBtn.onclick = () => {
                showVocSettingsDialog(productId, region, triggerButton);
            };
        }

        showVocLoading(`正在爬取评论，目标：${targetValidCount}条有效评论...`, productId);

        let originalText = '';
        if (triggerButton) {
            originalText = triggerButton.textContent;
            triggerButton.disabled = true;
            triggerButton.textContent = 'VOC分析中...';
        }

        try {
            // 重置评论数显示
            updateVocReviewCount(0, productId);

            // 进度回调
            const onProgress = (totalCount, validCount, targetCount) => {
                showVocLoading(`正在爬取评论... 已获取${totalCount}条，其中${validCount}条有效（目标：${targetCount}条）`, productId);
            };

            // 爬取评论直到达到目标有效评论数
            const reviews = await fetchReviewsUntilValidCount(productId, region, targetValidCount, onProgress);

            if (!reviews.length) {
                showVocError('未获取到评论，无法生成VOC分析', productId);
                updateVocReviewCount(0, productId);
                return;
            }

            // 过滤有效评论
            const validReviews = reviews.filter(hasValidReviewText);
            if (validReviews.length === 0) {
                showVocError('未获取到有效评论（所有评论的display_text都为空），无法生成VOC分析', productId);
                updateVocReviewCount(0, productId);
                return;
            }

            // 显示最终获取的评论数（有效评论数）
            updateVocReviewCount(validReviews.length, productId);
            showVocLoading(`已获取 ${reviews.length} 条评论，其中 ${validReviews.length} 条有效评论，正在生成VOC分析...`, productId);

            // 只使用有效评论进行分析
            const prompt = buildVocPrompt(productId, validReviews);
            const analysis = await requestGeminiAnalysis(prompt);

            // 保存到缓存
            const analysisData = {
                targetValidCount: targetValidCount,
                totalReviews: reviews.length,
                validReviews: validReviews.length,
                analysis: analysis
            };
            saveVocAnalysisCache(productId, analysisData);

            // 显示结果
            showVocResults(productId);
        } catch (error) {
            showVocError(error.message || 'VOC分析失败', productId);
        } finally {
            if (triggerButton) {
                triggerButton.disabled = false;
                triggerButton.textContent = originalText || 'VOC 分析';
            }
        }
    }

    // 处理VOC分析按钮点击
    async function handleVocAnalysis(productId, region = '', triggerButton = null) {
        if (!productId) {
            alert('未识别到商品ID，无法执行VOC分析');
            return;
        }

        // 检查缓存
        const cache = getVocAnalysisCache(productId);

        if (cache.length > 0) {
            // 有缓存，直接打开侧边栏显示
            openVocSidebar();
            resetVocPanel(productId);
            const els = getVocSidebarElements();
            if (els) {
                if (els.productId) {
                    els.productId.textContent = productId;
                }
                // 绑定重新分析按钮
                if (els.reanalyzeBtn) {
                    els.reanalyzeBtn.onclick = () => {
                        showVocSettingsDialog(productId, region, triggerButton);
                    };
                }
                const latest = cache[0];
                if (latest) {
                    updateVocReviewCount(latest.validReviews ?? latest.totalReviews ?? null, productId);
                }
                showVocResults(productId);
            }
        } else {
            // 没有缓存，显示设置弹窗
            showVocSettingsDialog(productId, region, triggerButton);
        }
    }

    // 获取总评论数（排除空评论）
    async function handleGetReviewCount(productId, region = '', triggerButton = null) {
        if (!productId) {
            alert('未识别到商品ID，无法获取评论数');
            return;
        }

        openSidebar();
        const sidebar = document.getElementById('product-analysis-sidebar');
        if (sidebar) {
            sidebar.classList.add('active');
        }

        let originalText = '';
        if (triggerButton) {
            originalText = triggerButton.textContent;
            triggerButton.disabled = true;
            triggerButton.textContent = '获取中...';
        }

        try {
            // 显示加载状态
            const loadingEl = sidebar?.querySelector('.loading');
            const errorEl = sidebar?.querySelector('.error');
            const productInfoEl = sidebar?.querySelector('.product-info');

            if (loadingEl) loadingEl.style.display = 'block';
            if (errorEl) errorEl.style.display = 'none';
            if (productInfoEl) productInfoEl.innerHTML = '<p>正在获取评论总数（最多1000条）...</p>';

            // 获取评论来统计总数
            const reviews = await fetchTopReviews(productId, region, 1000);

            if (!reviews.length) {
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.querySelector('.error-message').textContent = '未获取到评论';
                }
                if (loadingEl) loadingEl.style.display = 'none';
                return;
            }

            // 过滤有效评论（排除display_text为空的）
            const validReviews = reviews.filter(hasValidReviewText);
            const totalCount = reviews.length;
            const validCount = validReviews.length;
            const emptyCount = totalCount - validCount;

            // 显示统计结果
            const resultText = [
                `<h4>评论统计</h4>`,
                `<div class="product-info-item"><label>总评论数（已获取）：</label><span>${totalCount} 条</span></div>`,
                `<div class="product-info-item"><label>有效评论数（有文本内容）：</label><span>${validCount} 条</span></div>`,
                `<div class="product-info-item"><label>空评论数（无文本内容）：</label><span>${emptyCount} 条</span></div>`,
                `<div class="product-info-item"><label>有效评论占比：</label><span>${totalCount > 0 ? ((validCount / totalCount) * 100).toFixed(1) : 0}%</span></div>`
            ].join('');

            if (productInfoEl) {
                productInfoEl.innerHTML = resultText;
                productInfoEl.classList.add('active');
            }
            if (loadingEl) loadingEl.style.display = 'none';

        } catch (error) {
            const errorEl = sidebar?.querySelector('.error');
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.querySelector('.error-message').textContent = error.message || '获取评论数失败';
            }
            const loadingEl = sidebar?.querySelector('.loading');
            if (loadingEl) loadingEl.style.display = 'none';
        } finally {
            if (triggerButton) {
                triggerButton.disabled = false;
                triggerButton.textContent = originalText || '获取总评论数';
            }
        }
    }

    // 添加AI分析按钮
    function addAnalysisButton(row) {

        const rowKey = row.getAttribute('data-row-key');
        if (!rowKey) {
            return;
        }

        const productId = extractProductId(rowKey);
        if (!productId) {
            console.warn('无法提取商品ID:', rowKey);
            return;
        }

        // 找到标签所在的容器（包含 .ant-tag.tag 的 div）
        const tagDivCandidates = Array.from(row.querySelectorAll('div[data-v-d95ddede]'));
        let tagContainer = null;
        for (const div of tagDivCandidates) {
            if (div.querySelector('.ant-tag.tag')) {
                tagContainer = div;
                break;
            }
        }

        // 若未找到标签容器，则退回到操作列
        let actionCell = null;
        if (!tagContainer) {
            actionCell = row.querySelector('td.ant-table-cell-fix-right:last-child');
            if (!actionCell) {
                const allCells = row.querySelectorAll('td');
                actionCell = allCells[allCells.length - 1];
            }
            if (!actionCell) {
                console.warn('找不到操作列');
                return;
            }
        }

        let actionsContainer = row.querySelector('.ai-actions-container');
        if (!actionsContainer) {
            actionsContainer = document.createElement('div');
            actionsContainer.className = 'ai-actions-container';
        }

        if (tagContainer && tagContainer.parentNode) {
            const parent = tagContainer.parentNode;
            if (actionsContainer.parentNode !== parent || actionsContainer.previousElementSibling !== tagContainer) {
                tagContainer.insertAdjacentElement('afterend', actionsContainer);
            }
        } else if (actionCell) {
            const actionDiv = actionCell.querySelector('div[style*="white-space"]') ||
                actionCell.querySelector('div:last-child') ||
                actionCell;
            if (!actionDiv) {
                return;
            }
            if (actionsContainer.parentNode !== actionDiv) {
                actionDiv.appendChild(actionsContainer);
            }
        } else {
            return;
        }

        // 创建商品详情按钮
        if (!actionsContainer.querySelector('.ai-analysis-btn')) {
            const detailButton = document.createElement('button');
            detailButton.className = 'ai-analysis-btn';
            detailButton.textContent = 'AI 分析';
            detailButton.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                fetchProductDetail(productId);
            });
            actionsContainer.appendChild(detailButton);
        }

        // 创建 VOC 分析按钮
        if (!actionsContainer.querySelector('.voc-analysis-btn')) {
            const vocButton = document.createElement('button');
            vocButton.className = 'voc-analysis-btn';
            vocButton.textContent = 'VOC 分析';
            vocButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                await handleVocAnalysis(productId, '', vocButton);
            });
            actionsContainer.appendChild(vocButton);
        }

    }

    // 初始化：创建侧边栏并添加按钮
    function init() {
        initSettings();
        // 创建侧边栏
        createSidebar();

        // 创建VOC独立侧边栏
        createVocSidebar();

        // 绑定 AI 商品分析按钮
        const aiEls = getAiProductElements();
        if (aiEls) {
            if (aiEls.btn) {
                aiEls.btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAiProductAnalysis();
                });
            }
            // 绑定展开/收起按钮
            if (aiEls.toggle) {
                aiEls.toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleAiProductSection();
                });
            }
        }

        // 监听表格变化（用于动态加载的商品）
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        // 检查是否是表格行
                        if (node.tagName === 'TR' && node.hasAttribute('data-row-key')) {
                            addAnalysisButton(node);
                        }
                        // 检查子节点
                        const rows = node.querySelectorAll && node.querySelectorAll('tr[data-row-key]');
                        if (rows) {
                            rows.forEach(row => addAnalysisButton(row));
                        }
                    }
                });
            });
        });

        // 观察表格容器
        const tableContainer = document.querySelector('.ant-table-tbody') || document.body;
        observer.observe(tableContainer, {
            childList: true,
            subtree: true
        });

        // 为现有的行添加按钮
        setTimeout(() => {
            const rows = document.querySelectorAll('tr[data-row-key]');
            rows.forEach(row => addAnalysisButton(row));
        }, 1000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

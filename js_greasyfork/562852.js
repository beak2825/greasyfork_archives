// ==UserScript==
// @name         蝦皮評價擷取器與翻頁測試器合併版 v5.6
// @namespace    http://tampermonkey.net/
// @version      5.6
// @description  整合評價擷取與翻頁測試功能的完整工具。支援真實數據抓取、Excel表格輸出、完整數據預覽，提供下拉式介面和一鍵表格複製功能。【合併版：整合v1.1評價擷取器 + v1.0翻頁測試器】
// @author       BUTTST 
// @license      MIT; https://opensource.org/licenses/MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDFINGMtMS4xIDAtMiAuOS0yIDJ2MTRoMnYtM2gxMnYzYzAgMS4xLjkgMiAyIDJoOFYxMHY0YzAgMS4xLjkgMiAyIDJ2NGMwIDEuMS45IDIgMiAyaDEyYzEuMSAwIDItLjkgMi0yVjN6IiBmaWxsPSIjZmY2YzA3Ii8+CjxwYXRoIGQ9Ik0xNS41IDVjMC0uODMtLjY3LTEuNS0xLjUtMS41cy0xLjUgLjY3LTEuNSAxLjVjMCAuNDMuMjUuODUuNjMgMS4wOEwxMiAxMy4yNWwtLjYzLTEuMTdjLS4zOC0uMjItLjYzLS42NS0uNjMtMS4wOHEwLTEuMDUuNzUtMS41dDEuNzUtLjVjMS4wNSAwIDEuNS42OCAxLjUgMS41IDAgLjQzLS4yNS44NS0uNjMgMS4wOEwxMiAxMy4yNGwuNjMgMS4xN2MuMzguMjIuNjMuNjUuNjMgMS4wOHEwIDEuMDUtLjc1IDIuNS0xLjc1LjVjLTEuMDUgMC0xLjUtLjY4LTEuNS0xLjUgMC0uNDMuMjUtLjg1LjYzLTEuMDhMMTEuNzYgNy43NnoiIGZpbGw9IiNmZjZjMDciLz4KPC9zdmc+
// @match        https://seller.shopee.tw/portal/settings/shop/rating*
// @match        https://seller.shopee.com.tw/portal/settings/shop/rating*
// @match        http://127.0.0.1:5500/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562852/%E8%9D%A6%E7%9A%AE%E8%A9%95%E5%83%B9%E6%93%B7%E5%8F%96%E5%99%A8%E8%88%87%E7%BF%BB%E9%A0%81%E6%B8%AC%E8%A9%A6%E5%99%A8%E5%90%88%E4%BD%B5%E7%89%88%20v56.user.js
// @updateURL https://update.greasyfork.org/scripts/562852/%E8%9D%A6%E7%9A%AE%E8%A9%95%E5%83%B9%E6%93%B7%E5%8F%96%E5%99%A8%E8%88%87%E7%BF%BB%E9%A0%81%E6%B8%AC%E8%A9%A6%E5%99%A8%E5%90%88%E4%BD%B5%E7%89%88%20v56.meta.js
// ==/UserScript==

// ==================== 版本配置 ====================
// 🚨 重要：更新版本時需要修改這裡，其他地方會自動同步
const SCRIPT_VERSION = '5.6';
const SCRIPT_DATE = '2026/01/16 17:30';
// ==================================================

// [日期 買家帳號 訂單編號 星數 文本內容]

/**
 * =======================================================================================
 * 🎯 主要用途與目的:
 * 本腳本專為蝦皮賣家設計，用於快速批量擷取商品評價數據，支援結構化匯出至Google Sheets或其他工具進行數據分析。
 * 通過官方API直接獲取數據，確保數據準確性與完整性，協助賣家進行評價管理、客戶回饋分析與銷售策略優化。
 *
 * 🎯 特色:
 * - 官方API數據直連，獲取完整評價（含空白內容），10個欄位一次到位
 * - 支援精簡5欄TSV與完整10欄JSON格式切換，滿足不同數據需求
 * - 參數即時調整：頁面大小、測試頁數、延遲時間皆可自訂
 * - 智能批量處理，高效率且內建延遲防API限流
 * - 支援一鍵複製TSV/JSON，完美兼容Google Sheets與表格軟體
 * - API測試工具多模式內建，方便驗證資料正確性與效能
 * - 表格即時預覽，可調欄寬、橫向捲動，支援中英文雙語標題
 * - 響應式下拉UI介面，展開時自動調整邊界避免裁切
 * - 視窗可自由拖動、縮放與定位，右上角基準定位，提升使用體驗
 *
 * =======================================================================================
 * 📋 更新日誌 (由最新版永遠置頂)　 每次修改都需要更新本日誌，確保為最新狀態。
 * =======================================================================================
/*
 * 更新日誌（只保留重點版本，已移除表情符號與多餘敘述）
 *
 * v5.6（2026/01/16 17:10）
 * - 🎯 核心功能升級: 新增API測試工具區塊，支援即時參數調整
 * - 🔧 參數動態設定: 頁面大小(1-200)、測試頁數(1-50)、延遲時間(0-5000ms)即時調整
 * - 📊 數據格式切換: 支援精簡5欄TSV與完整10欄API原始資料雙重格式
 * - 🏗️ UI架構優化: API欄位映射區塊預設收起，提升介面清潔度
 * - 📋 複製功能強化: 內建與外部複製按鈕邏輯分離，避免功能衝突
 * - 🎨 表格顯示優化: 可調欄寬、橫向滾動，支援中英雙標題顯示
 * - 🚀 性能調優: 批量抓取時的延遲控制更加精準，避免API限制
 * - 🐛 問題修復: 修正UI尺寸溢位、邊界檢測與視窗行為問題
 *
 * v5.5（2026/01/16 16:35）
 * - 參數全自訂
 * - 內外部複製邏輯分離
 * - 預設精簡結果5欄，完整API欄位切換
 * - 修正尺寸、溢位與UI行為問題
 * - 表格可調欄寬、橫向捲動
 *
 * v5.2（2026/01/16 16:45）
 * - 清理介面顯示，僅保留API映射說明
 * - 加強API實測與批次測試
 * - 移除無效代碼
 *
 * v5.1（2026/01/16 15:00）
 * - 實作API抓取、TSV轉換與一鍵複製
 *
 * v4.6（2026/01/15 20:51）
 * - 自動展開評價、強化時間戳精確度
 * - 異步處理與動態內容支援
 *
 * v3.0~3.9（2026/01/13）
 * - 一鍵複製、視窗停駐/記憶位置、收折操作、視窗尺寸拖拉
 *
 * v2.0~2.4（2025/01/10~01/11）
 * - 合併版、全資料匯出與下拉介面
 * =======================================================================================
 */

(function() {
    'use strict';

    // 常數定義
    const SCRIPT_ID = 'shopee-extractor-tester';

    // 預設設定
    const DEFAULT_SETTINGS = {
        ui: {
            expanded: false,
            position: { x: 1400, y: 60 },
            size: { width: 900, height: 700 },
            draggable: true,
            autoExpandSections: true
        }
    };

    // 全域狀態
    let settings = { ...DEFAULT_SETTINGS };
    let uiState = {
        expanded: false,
        container: null,
        sectionsExpanded: true,
        lastFetchedData: null  // 存儲最後一次抓取的數據
    };

    /**
     * 注入基礎 CSS 樣式 (優化版)
     */
    function injectBaseStyles() {
        const css = `
            /* 蝦皮評價擷取器與測試器合併版 - 優化樣式 */
            #${SCRIPT_ID} {
                position: fixed;
                top: 50px;
                right: 40px;
                z-index: 6700;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 14px;
                line-height: 1.4;
            }

            #${SCRIPT_ID} * {
                box-sizing: border-box;
            }

            /* 收起狀態 - 優化尺寸和視覺，支援複製按鈕 */
            #${SCRIPT_ID}.collapsed {
                width: 200px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: 2px solid #5a67d8;
                border-radius: 8px;
                resize: none; /* 收起狀態禁止調整大小 */
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                padding: 8px 40px 8px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
                position: relative;
            }

            #${SCRIPT_ID}.collapsed:hover {
                background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                transform: translateY(-2px);
            }

            #${SCRIPT_ID}.collapsed .expand-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                transition: background 0.2s;
            }

            #${SCRIPT_ID}.collapsed .expand-btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            #${SCRIPT_ID}.collapsed .status-text {
                flex: 1;
                text-align: center;
                color: white;
                font-size: 10px;
                font-weight: 500;
                line-height: 1.2;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            /* 展開狀態 - 專業配色優化 */
            #${SCRIPT_ID}.expanded {
                width: 900px;
                height: 700px;
                background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
                border: 2px solid #cbd5e0;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                resize: both;
                min-width: 700px;
                min-height: 500px;
                max-width: 1200px;
                max-height: 900px;
                backdrop-filter: blur(10px);
            }

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                border-bottom: 2px solid #a0aec0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 10px 10px 0 0;
                cursor: move;
                user-select: none;
                position: relative;
            }

            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                border-radius: 10px 10px 0 0;
                pointer-events: none;
            }

            .header-title {
                font-weight: 600;
                color: white;
                margin: 0;
                font-size: 16px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                position: relative;
                z-index: 1;
            }

            .header-actions {
                display: flex;
                gap: 8px;
                position: relative;
                z-index: 1;
            }

            /* 下拉區塊樣式 - 優化配色 */
            .section {
                border: 2px solid #cbd5e0;
                border-radius: 8px;
                margin: 12px;
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                transition: all 0.2s ease;
            }

            .section:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                transform: translateY(-1px);
            }

            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 18px;
                background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
                border-radius: 8px 8px 0 0;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
                border-bottom: 1px solid #a0aec0;
            }

            .section-header:hover {
                background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
            }

            .section-title {
                font-weight: 600;
                color: #333;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .section-toggle {
                width: 20px;
                height: 20px;
                border: none;
                background: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 14px;
                transition: transform 0.2s;
            }

            .section-content {
                padding: 18px;
                background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 0 0 8px 8px;
                max-height: 400px;
                overflow-y: auto;
                border-top: 1px solid #e2e8f0;
            }

            .section.collapsed .section-content {
                display: none;
            }

            .section.collapsed .section-toggle {
                transform: rotate(-90deg);
            }

            /* 按鈕樣式優化 - 專業配色 */
            .btn {
                padding: 10px 18px;
                border: 2px solid #a0aec0;
                border-radius: 6px;
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                color: #4a5568;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .btn:hover {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-color: #718096;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-1px);
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-color: #5a67d8;
                color: white;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }

            .btn-primary:hover {
                background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                border-color: #4c51bf;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .btn-success {
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                border-color: #38a169;
                color: white;
                box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
            }

            .btn-success:hover {
                background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
                border-color: #2f855a;
                box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
            }

            /* 結果區域樣式 - 優化配色 */
            .result-area {
                background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
                border: 2px solid #cbd5e0;
                border-radius: 6px;
                padding: 14px;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                font-size: 12px;
                line-height: 1.5;
                max-height: 250px;
                overflow-y: auto;
                white-space: pre-wrap;
                margin: 10px 0;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            /* 通知樣式 */
            .toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 12px 16px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                z-index: 10001;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                max-width: 400px;
            }

            .toast.show {
                opacity: 1;
                pointer-events: auto;
            }

            .toast.success { background: #2ea44f; }
            .toast.error { background: #d73a49; }
            .toast.warning { background: #ffc107; color: #212529; }
        `;

        GM_addStyle(css);
    }

    /**
     * 創建UI容器 - 優化定位：強制顯示在右上方，確保可見性
     */
    function createUIContainer() {
        const container = document.createElement('div');
        container.id = SCRIPT_ID;
        container.className = 'collapsed';

        // 預設定位和尺寸設置
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.right = '40px';
        container.style.zIndex = '6700'; // 位於腳本通知下層
        // height由CSS控制，收起時50px，展開時550px

        // 收起狀態的內容 - 統一展開後的樣式表現
        // 精簡收折內部結構，保持寬高與 CSS 對齊，避免過大 DOM 造成視覺溢出
        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; width:100%; height:100%;">
                <button class="btn expand-btn" title="展開面板" style="background:transparent; border:none; color:white; font-size:18px; padding:0 6px;">🧪</button>
                <div class="status-text" style="display:flex; flex-direction:column; justify-content:center; line-height:1;">
                    <div style="font-weight:600;">蝦皮評價擷取器</div>
                    <div style="font-size:11px;">v${SCRIPT_VERSION}</div>
                </div>
                <button class="quick-copy-btn" title="一鍵抓取並複製評價數據" style="
                    margin-left:auto;
                    background: rgba(255, 255, 255, 0.12);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: background 0.2s;
                ">📋</button>
            </div>
        `;

        document.body.appendChild(container);
        uiState.container = container;

        // 綁定事件
        setupEventListeners();

        return container;
    }

    /**
     * 展開完整UI
     */
    function expandUI() {
        const container = uiState.container;

        // 展開時保持當前位置並設置展開高度
        container.className = 'expanded';
        container.style.height = '550px';

        container.innerHTML = `
            <div class="header" id="drag-handle" title="按住並拖動以移動視窗，邊緣區域可調整大小">
                <h3 class="header-title">🧪 蝦皮評價擷取器與測試器合併版 v${SCRIPT_VERSION}</h3>
                <div class="header-actions">
                    <button class="btn" id="minimize-btn" title="收起面板">−</button>
                </div>
            </div>

            <div style="flex: 1; overflow-y: auto; padding: 8px;">
                <!-- 數據抓取測試區塊 -->
                <div class="section" id="data-extraction-section">
                    <div class="section-header">
                        <h4 class="section-title">
                            <span style="color: #2ea44f;">📊</span>
                            數據抓取測試
                        </h4>
                        <button class="section-toggle">▼</button>
                    </div>
                    <div class="section-content">
                        <div style="margin-bottom: 12px;">
                            <button class="btn btn-primary" id="test-data-extraction">
                                <span>🧪</span>
                                測試數據提取
                            </button>
                            <button class="btn btn-success" id="copy-extraction-results">
                                <span>📋</span>
                                複製結果
                            </button>
                        </div>

                        <div style="margin-top:8px; display:flex; gap:12px; align-items:center;">
                            <label style="font-size:13px;"><input type="radio" name="preview-mode" value="transformed" checked> 轉換後結果表格</label>
                            <label style="font-size:13px;"><input type="radio" name="preview-mode" value="raw"> 完整 API 原始資料</label>
                            <button class="btn" id="download-tsv" style="margin-left:auto;">⬇️ 下載 TSV</button>
                        </div>
                        <div id="preview-table" style="margin-top:12px; display:flex; gap:12px;">
                            <div id="preview-trans-table" class="result-area" style="flex:1; display:none; overflow:auto;"></div>
                            <div id="preview-raw-table" class="result-area" style="flex:1; display:none; overflow:auto;"></div>
                        </div>

                        <div class="result-stats" id="extraction-stats" style="display: none;">
                            <!-- 統計卡片將動態插入 -->
                        </div>

                        <div id="extraction-results" class="result-area" style="display: none;">
                            <!-- 提取結果將動態插入 -->
                        </div>
                    </div>
                </div>

                <!-- API 字段映射顯示區塊 -->
                <div class="section collapsed" id="data-variables-section">
                    <div class="section-header">
                        <h4 class="section-title">
                            <span style="color: #007bff;">🔗</span>
                            API 字段映射
                        </h4>
                        <button class="section-toggle">▼</button>
                    </div>
                    <div class="section-content">
                        <!-- API 端點信息 -->
                        <div style="background: #f8fafc; border: 1px solid #e1e5e9; border-radius: 6px; padding: 16px; margin-bottom: 12px;">
                            <div style="font-weight: bold; margin-bottom: 12px; color: #2d3748;">🌐 API 端點配置</div>
                            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; font-size: 13px;">
                                <div><strong>端點路徑:</strong></div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">/api/v3/settings/search_shop_rating_comments_new/</div>

                                <div><strong>請求方法:</strong></div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">GET (same-origin)</div>

                                <div><strong>身份驗證:</strong></div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">SPC_CDS Cookie</div>

                                <div><strong>分頁參數:</strong></div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">page_number, page_size, cursor</div>
                            </div>
                        </div>

                        <!-- 字段映射 -->
                        <div style="background: #f8fafc; border: 1px solid #e1e5e9; border-radius: 6px; padding: 16px;">
                            <div style="font-weight: bold; margin-bottom: 12px; color: #2d3748;">📋 字段映射表</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 8px; font-size: 13px;">
                                <div><strong>顯示名稱</strong></div>
                                <div><strong>API 字段</strong></div>
                                <div><strong>說明</strong></div>

                                <div>日期</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">ctime/mtime/submit_time</div>
                                <div>評價提交時間戳（秒），轉換為 YYYY/MM/DD HH:MM:SS</div>

                                <div>使用者名稱</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">user_name</div>
                                <div>評價用戶的顯示名稱</div>

                                <div>訂單編號</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">order_sn</div>
                                <div>蝦皮訂單編號，唯一標識</div>

                                <div>星數</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">rating_star</div>
                                <div>評價星級 (1-5)</div>

                                <div>評價內容</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">comment</div>
                                <div>用戶評價文字內容</div>

                                <div>商品名稱</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">product_name</div>
                                <div>被評價的商品名稱</div>

                                <div>商品ID</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">product_id/item_id</div>
                                <div>商品唯一標識符</div>

                                <div>圖片</div>
                                <div style="font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px;">images</div>
                                <div>評價附帶圖片ID數組，以 | 分隔</div>
                            </div>
                        </div>

                        <div style="margin-top: 12px; padding: 12px; background: #e7f3ff; border: 1px solid #b3d7ff; border-radius: 6px;">
                            <div style="font-size: 12px; color: #1e40af;">
                                <strong>ℹ️ 說明:</strong> 系統通過蝦皮官方API直接獲取結構化數據，無需DOM解析。數據準確性高，支援大規模批量抓取。
                            </div>
                        </div>
                    </div>
                </div>

                <!-- API 測試區塊 -->
                <div class="section" id="pagination-test-section">
                    <div class="section-header">
                        <h4 class="section-title">
                            <span style="color: #ff6b35;">🔍</span>
                            API 測試工具
                        </h4>
                        <button class="section-toggle">▼</button>
                    </div>
                    <div class="section-content">
                        <!-- 測試參數設置 -->
                        <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border: 1px solid #e1e5e9; border-radius: 6px;">
                            <div style="font-weight: bold; margin-bottom: 8px; color: #2d3748;">⚙️ 測試參數設定</div>
                            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                                <label style="font-size: 13px;">
                                    頁面大小:
                                    <input type="number" id="test-page-size" value="20" min="1" max="200" step="1"
                                           style="margin-left: 4px; width: 60px; padding: 2px 4px; border: 1px solid #cbd5e0; border-radius: 4px;">
                                </label>
                                <label style="font-size: 13px;">
                                    測試頁數:
                                    <input type="number" id="test-max-pages" value="3" min="1" max="50" step="1"
                                           style="margin-left: 4px; width: 60px; padding: 2px 4px; border: 1px solid #cbd5e0; border-radius: 4px;">
                                </label>
                                <label style="font-size: 13px;">
                                    延遲(ms):
                                    <input type="number" id="test-delay" value="300" min="0" max="5000" step="50"
                                           style="margin-left: 4px; width: 60px; padding: 2px 4px; border: 1px solid #cbd5e0; border-radius: 4px;">
                                </label>
                            </div>
                        </div>

                        <!-- 測試按鈕 -->
                        <div style="margin-bottom: 12px;">
                            <button class="btn" id="test-single-page">
                                <span>📄</span>
                                測試單頁API
                            </button>
                            <button class="btn" id="test-multi-page">
                                <span>📚</span>
                                測試多頁批量
                            </button>
                            <button class="btn" id="test-api-pagination">
                                <span>🔄</span>
                                測試分頁效能
                            </button>
                            <button class="btn btn-primary" id="test-comprehensive">
                                <span>🚀</span>
                                綜合測試
                            </button>
                            <button class="btn btn-success" id="copy-pagination-results">
                                <span>📋</span>
                                複製測試結果
                            </button>
                        </div>

                        <!-- 測試結果顯示 -->
                        <div id="pagination-test-results" class="result-area" style="display: none;">
                            <!-- API測試結果將動態插入 -->
                        </div>
                    </div>
                </div>

            </div>
        `;

        // 重新綁定事件
        setupExpandedEventListeners();

        // 添加視窗控制
        addWindowControls(container, container.querySelector('#drag-handle'));

        // 展開後立即進行邊界檢測，避免超出螢幕 - 適應右上角定位
        setTimeout(() => {
            const rect = container.getBoundingClientRect();
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;
            const margin = 20; // 邊距

            // 檢查右邊界 - 如果容器寬度太大或右邊距不夠
            if (rect.right > window.innerWidth - margin) {
                const newRight = Math.max(margin, window.innerWidth - rect.left - containerWidth);
                container.style.right = newRight + 'px';
                container.style.left = 'auto';
            }

            // 檢查左邊界 - 如果左邊超出螢幕
            if (rect.left < margin) {
                container.style.right = (window.innerWidth - containerWidth - margin) + 'px';
                container.style.left = 'auto';
            }

            // 檢查上邊界 - 如果上邊超出螢幕
            if (rect.top < 0) {
                container.style.top = margin + 'px';
            }

            // 檢查下邊界 - 如果高度超出螢幕
            if (rect.bottom > window.innerHeight) {
                const newTop = Math.max(margin, window.innerHeight - containerHeight - margin);
                container.style.top = newTop + 'px';
            }

            // 設定z-index位於腳本通知下層
            container.style.zIndex = '6700';
        }, 100); // 延遲一點確保DOM已經更新

        // 如果設定為自動展開，則展開所有區塊
        if (settings.ui.autoExpandSections) {
            setTimeout(() => {
                expandAllSections();
            }, 100);
        }
    }

    /**
     * 展開所有區塊
     */
    function expandAllSections() {
        const sections = uiState.container.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('collapsed');
        });
    }

    /**
     * 收起所有區塊
     */
    function collapseAllSections() {
        const sections = uiState.container.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.add('collapsed');
        });
    }

    /**
     * 設定展開狀態的事件監聽器
     */
    function setupExpandedEventListeners() {
        const container = uiState.container;

        // 標題列拖動功能
        const dragHandle = container.querySelector('#drag-handle');
        if (dragHandle) {
            dragHandle.addEventListener('mousedown', startDrag);
        }

        // 收起按鈕
        container.querySelector('#minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // 防止觸發拖動
            toggleExpanded();
        });

        // 區塊折疊/展開
        const sectionHeaders = container.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.closest('.section-toggle') || e.target.classList.contains('section-toggle')) {
                    e.stopPropagation(); // 防止觸發拖動
                    const section = header.closest('.section');
                    section.classList.toggle('collapsed');
                }
            });
        });
        // 綁定測試與複製按鈕事件（實作 fetch + preview + copy 流程）
        const btnTestData = container.querySelector('#test-data-extraction');
        const btnCopy = container.querySelector('#copy-extraction-results');
        const btnQuickCopy = document.querySelector(`#${SCRIPT_ID} .quick-copy-btn`);
        const btnCopyPagination = container.querySelector('#copy-pagination-results');
        const btnTestApiPagination = container.querySelector('#test-api-pagination');
        const btnTestUrlPagination = container.querySelector('#test-url-pagination');
        const btnTestDomPagination = container.querySelector('#test-dom-pagination');
        const btnTestAllPagination = container.querySelector('#test-all-pagination');

        // 綁定radio按鈕切換事件
        const previewModeRadios = container.querySelectorAll('input[name="preview-mode"]');
        previewModeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const mode = radio.value;
                const transTable = container.querySelector('#preview-trans-table');
                const rawTable = container.querySelector('#preview-raw-table');

                if (mode === 'transformed') {
                    if (transTable) transTable.style.display = 'block';
                    if (rawTable) rawTable.style.display = 'none';
                } else {
                    if (transTable) transTable.style.display = 'none';
                    if (rawTable) rawTable.style.display = 'block';
                }
            });
        });

        if (btnTestData) {
            btnTestData.addEventListener('click', async () => {
                try {
                    showToast('開始抓取數據...', 'info');
                    const list = await fetchAllRatings();
                    // 存儲抓取的數據
                    uiState.lastFetchedData = list;
                    // 直接顯示表格而不是純文本
                    renderFullAPITable(list);
                    renderTransformedTable(list);
                    renderFieldMapping();
                    // 根據當前選中的radio按鈕顯示對應表格
                    const currentMode = (uiState.container.querySelector('input[name="preview-mode"]:checked') || {value:'transformed'}).value;
                    if (currentMode === 'transformed') {
                        uiState.container.querySelector('#preview-raw-table').style.display = 'none';
                        uiState.container.querySelector('#preview-trans-table').style.display = 'block';
                    } else {
                        uiState.container.querySelector('#preview-raw-table').style.display = 'block';
                        uiState.container.querySelector('#preview-trans-table').style.display = 'none';
                    }
                    showToast(`抓取完成：${list.length} 筆`, 'success');
                } catch (err) {
                    console.error(err);
                    showToast('抓取失敗，請查看控制台', 'error');
                }
            });
        }


        if (btnCopy) {
            btnCopy.addEventListener('click', async () => {
                try {
                    const mode = (uiState.container.querySelector('input[name="preview-mode"]:checked') || {value:'transformed'}).value;
                    const formatName = mode === 'transformed' ? 'TSV' : 'JSON';

                    // 優先使用已存儲的數據，如果沒有則提示用戶先抓取
                    let list = uiState.lastFetchedData;
                    if (!list || list.length === 0) {
                        showToast('請先點擊"測試數據提取"按鈕抓取數據', 'warning');
                        return;
                    }

                    let content;
                    if (mode === 'transformed') {
                        content = formatRatingsToSimplifiedTSV(list);
                    } else {
                        content = JSON.stringify(list, null, 2);
                    }

                    const ok = await copyToClipboard(content);
                    if (ok) showToast(`已複製 ${list.length} 筆（${formatName}）`, 'success');
                    else showToast('複製失敗（瀏覽器限制）', 'error');
                } catch (err) {
                    console.error(err);
                    showToast('複製失敗，請查看控制台', 'error');
                }
            });
        }

        // 下載 TSV 按鈕（在 preview 區）
        const btnDownload = container.querySelector('#download-tsv');
        if (btnDownload) {
            btnDownload.addEventListener('click', async () => {
                try {
                    showToast('產生 TSV 檔案...', 'info');
                    const list = await fetchAllRatings();
                    const tsv = formatRatingsToCompleteTSV(list);
                    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `shopee_ratings_${Date.now()}.tsv`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    showToast('TSV 下載已開始', 'success');
                } catch (err) {
                    console.error(err);
                    showToast('TSV 產生失敗', 'error');
                }
            });
        }

        // 收折狀態下快速複製：一鍵抓取並複製
        if (btnQuickCopy) {
            btnQuickCopy.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    showToast('快速複製：抓取中...', 'info');
                    const list = await fetchAllRatings();
                    const tsv = formatRatingsToSimplifiedTSV(list);
                    const ok = await copyToClipboard(tsv);
                    if (ok) showToast(`快速複製完成：已複製 ${list.length} 筆（TSV）`, 'success');
                    else showToast('快速複製失敗', 'error');
                } catch (err) {
                    console.error(err);
                    showToast('快速複製失敗', 'error');
                }
            });
        }

        if (btnCopyPagination) {
            btnCopyPagination.addEventListener('click', async () => {
                try {
                    const resultsEl = container.querySelector('#pagination-test-results');
                    if (!resultsEl || resultsEl.style.display === 'none') {
                        showToast('請先執行測試以獲取結果', 'warning');
                        return;
                    }

                    // 提取測試結果的文字內容
                    const testResults = resultsEl.textContent || resultsEl.innerText || '';
                    const timestamp = new Date().toLocaleString('zh-TW');
                    const header = `蝦皮評價擷取器 API 測試結果\n測試時間：${timestamp}\n版本：${SCRIPT_VERSION}\n\n`;
                    const content = header + testResults;

                    const ok = await copyToClipboard(content);
                    if (ok) showToast('測試結果已複製到剪貼簿', 'success');
                    else showToast('複製失敗', 'error');
                } catch (err) {
                    console.error('複製測試結果失敗:', err);
                    showToast('複製測試結果失敗', 'error');
                }
            });
        }

        // API 測試按鈕 - 實現實際測試功能
        const btnTestSinglePage = container.querySelector('#test-single-page');
        const btnTestMultiPage = container.querySelector('#test-multi-page');
        // const btnTestApiPagination = container.querySelector('#test-api-pagination'); // 紅蚯蚓：此行已前面宣告，這行移除避免重複
        const btnTestComprehensive = container.querySelector('#test-comprehensive');
        if (btnTestSinglePage) {
            btnTestSinglePage.addEventListener('click', async () => {
                try {
                    const pageSize = parseInt(container.querySelector('#test-page-size').value);
                    showToast(`測試單頁API（頁面大小：${pageSize}）...`, 'info');

                    const startTime = Date.now();
                    const json = await fetchRatingsPage(1, pageSize, 0);
                    const endTime = Date.now();

                    if (json && json.code === 0 && json.data) {
                        const result = {
                            testType: '單頁API測試',
                            pageSize: pageSize,
                            responseTime: `${endTime - startTime}ms`,
                            totalItems: json.data.list ? json.data.list.length : 0,
                            hasMore: json.data.page_info ? json.data.page_info.has_more : false,
                            success: true
                        };
                        displayTestResults([result]);
                        showToast(`單頁測試完成：${result.totalItems} 筆數據，耗時 ${result.responseTime}`, 'success');
                    } else {
                        throw new Error('API 響應格式異常');
                    }
                } catch (err) {
                    console.error('單頁測試失敗:', err);
                    displayTestResults([{
                        testType: '單頁API測試',
                        error: err.message,
                        success: false
                    }]);
                    showToast('單頁測試失敗', 'error');
                }
            });
        }

        if (btnTestMultiPage) {
            btnTestMultiPage.addEventListener('click', async () => {
                try {
                    const pageSize = parseInt(container.querySelector('#test-page-size').value);
                    const maxPages = parseInt(container.querySelector('#test-max-pages').value);
                    const delay = parseInt(container.querySelector('#test-delay').value);

                    showToast(`測試多頁批量（${maxPages}頁 × ${pageSize}筆/頁）...`, 'info');

                    const results = [];
                    let totalItems = 0;
                    const startTime = Date.now();

                    for (let page = 1; page <= maxPages; page++) {
                        const pageStartTime = Date.now();
                        try {
                            const json = await fetchRatingsPage(page, pageSize, 0);
                            const pageEndTime = Date.now();

                            if (json && json.code === 0 && json.data) {
                                const pageItems = json.data.list ? json.data.list.length : 0;
                                totalItems += pageItems;

                                results.push({
                                    page: page,
                                    items: pageItems,
                                    responseTime: `${pageEndTime - pageStartTime}ms`,
                                    success: true
                                });
                            } else {
                                results.push({
                                    page: page,
                                    error: 'API 響應異常',
                                    success: false
                                });
                            }
                        } catch (pageErr) {
                            results.push({
                                page: page,
                                error: pageErr.message,
                                success: false
                            });
                        }

                        if (page < maxPages) {
                            await new Promise(r => setTimeout(r, delay));
                        }
                    }

                    const endTime = Date.now();
                    results.unshift({
                        testType: '多頁批量測試',
                        totalPages: maxPages,
                        totalItems: totalItems,
                        totalTime: `${endTime - startTime}ms`,
                        avgResponseTime: `${Math.round((endTime - startTime) / maxPages)}ms`,
                        successCount: results.filter(r => r.success).length
                    });

                    displayTestResults(results);
                    showToast(`多頁測試完成：${totalItems} 筆數據，耗時 ${endTime - startTime}ms`, 'success');
                } catch (err) {
                    console.error('多頁測試失敗:', err);
                    showToast('多頁測試失敗', 'error');
                }
            });
        }

        if (btnTestApiPagination) {
            btnTestApiPagination.addEventListener('click', async () => {
                try {
                    const pageSize = parseInt(container.querySelector('#test-page-size').value);
                    const maxPages = parseInt(container.querySelector('#test-max-pages').value);
                    const delay = parseInt(container.querySelector('#test-delay').value);

                    showToast(`測試分頁效能（${maxPages}頁，間隔 ${delay}ms）...`, 'info');

                    const startTime = Date.now();
                    const list = await fetchAllRatings({
                        pageSize: pageSize,
                        maxPages: maxPages,
                        delayMs: delay
                    });
                    const endTime = Date.now();

                    const result = {
                        testType: '分頁效能測試',
                        totalItems: list.length,
                        expectedPages: maxPages,
                        actualPages: Math.ceil(list.length / pageSize),
                        totalTime: `${endTime - startTime}ms`,
                        avgTimePerPage: `${Math.round((endTime - startTime) / Math.ceil(list.length / pageSize))}ms`,
                        itemsPerSecond: Math.round(list.length / ((endTime - startTime) / 1000)),
                        success: true
                    };

                    displayTestResults([result]);
                    showToast(`分頁效能測試完成：${list.length} 筆，${result.itemsPerSecond} 筆/秒`, 'success');
                } catch (err) {
                    console.error('分頁效能測試失敗:', err);
                    displayTestResults([{
                        testType: '分頁效能測試',
                        error: err.message,
                        success: false
                    }]);
                    showToast('分頁效能測試失敗', 'error');
                }
            });
        }

        if (btnTestComprehensive) {
            btnTestComprehensive.addEventListener('click', async () => {
                try {
                    showToast('開始綜合測試...', 'info');

                    const tests = [];
                    const startTime = Date.now();

                    // 測試1: 單頁API
                    try {
                        const singleStart = Date.now();
                        const json = await fetchRatingsPage(1, 20, 0);
                        const singleEnd = Date.now();

                        tests.push({
                            name: '單頁API響應',
                            time: `${singleEnd - singleStart}ms`,
                            items: json.data?.list?.length || 0,
                            success: json.code === 0
                        });
                    } catch (err) {
                        tests.push({
                            name: '單頁API響應',
                            error: err.message,
                            success: false
                        });
                    }

                    // 測試2: 多頁批量
                    try {
                        const multiStart = Date.now();
                        const list = await fetchAllRatings({ pageSize: 10, maxPages: 3, delayMs: 200 });
                        const multiEnd = Date.now();

                        tests.push({
                            name: '多頁批量抓取',
                            time: `${multiEnd - multiStart}ms`,
                            items: list.length,
                            success: true
                        });
                    } catch (err) {
                        tests.push({
                            name: '多頁批量抓取',
                            error: err.message,
                            success: false
                        });
                    }

                    // 測試3: TSV格式化
                    try {
                        const formatStart = Date.now();
                        const list = await fetchAllRatings({ pageSize: 5, maxPages: 1 });
                        const tsv = formatRatingsToSimplifiedTSV(list);
                        const formatEnd = Date.now();

                        tests.push({
                            name: 'TSV格式化',
                            time: `${formatEnd - formatStart}ms`,
                            lines: tsv.split('\n').length,
                            success: true
                        });
                    } catch (err) {
                        tests.push({
                            name: 'TSV格式化',
                            error: err.message,
                            success: false
                        });
                    }

                    const endTime = Date.now();
                    tests.unshift({
                        testType: '綜合測試總結',
                        totalTime: `${endTime - startTime}ms`,
                        testsRun: tests.length,
                        successCount: tests.filter(t => t.success).length
                    });

                    displayTestResults(tests);
                    const successCount = tests.filter(t => t.success).length;
                    showToast(`綜合測試完成：${successCount}/${tests.length} 項通過`, successCount === tests.length ? 'success' : 'warning');
                } catch (err) {
                    console.error('綜合測試失敗:', err);
                    showToast('綜合測試失敗', 'error');
                }
            });
        }
    }

    /**
     * 顯示Toast通知
     */
    function showToast(message, type = 'info', duration = 3000) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * 取得 cookie 值
     */
    function getCookie(name) {
        const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
        return m ? decodeURIComponent(m[1]) : null;
    }

    /**
     * 將 timestamp (秒) 轉成 YYYY/MM/DD HH:MM:SS
     */
    function formatTimestamp(ts) {
        if (!ts) return '';
        const d = new Date(ts * 1000);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    /**
     * 呼叫 Shopee 評價 API 並回傳 parsed JSON
     * 會嘗試從 cookie 取得 SPC_CDS，若無則不帶該參數（通常同源請求會有足夠驗證）
     */
    async function fetchRatingsPage(pageNumber = 1, pageSize = 20, cursor = 0) {
        const originBase = window.location.origin;
        const endpoint = '/api/v3/settings/search_shop_rating_comments_new/';
        const SPC_CDS = getCookie('SPC_CDS') || '';
        const params = new URLSearchParams({
            SPC_CDS,
            SPC_CDS_VER: '2',
            rating_star: '5,4,3,2,1',
            page_number: String(pageNumber),
            page_size: String(pageSize),
            cursor: String(cursor),
            from_page_number: String(pageNumber),
            language: 'zh-Hant'
        });
        const url = `${originBase}${endpoint}?${params.toString()}`;
        const resp = await fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json, text/plain, */*' }});
        if (!resp.ok) {
            throw new Error('Network error ' + resp.status);
        }
        const json = await resp.json();
        return json;
    }

    /**
     * 取得所有分頁的評價（簡單版）
     */
    async function fetchAllRatings({ pageSize = 20, maxPages = 200, delayMs = 300 } = {}) {
        const results = [];
        let page = 1;
        for (; page <= maxPages; page++) {
            try {
                const json = await fetchRatingsPage(page, pageSize, 0);
                if (!json || json.code !== 0 || !json.data) break;
                const list = Array.isArray(json.data.list) ? json.data.list : [];
                results.push(...list);
                const total = json.data.page_info && json.data.page_info.total;
                if (total && results.length >= total) break;
                if (list.length < pageSize) break;
                await new Promise(r => setTimeout(r, delayMs));
            } catch (err) {
                console.error('fetchAllRatings error page', page, err);
                throw err;
            }
        }
        return results;
    }

    /**
     * 將評價陣列格式化成簡化 TSV（無標題列）- 5欄格式
     * 欄位順序：日期 / 買家帳號 / 訂單編號 / 星數 / 文本內容
     */
    function formatRatingsToSimplifiedTSV(list = []) {
        return list.map(it => {
            const date = formatTimestamp(it.ctime || it.submit_time || it.mtime || 0);
            const user_name = it.user_name || '';
            const order_sn = it.order_sn || '';
            const rating_star = String(it.rating_star == null ? '' : it.rating_star);
            const comment = (it.comment || '').replace(/\r?\n|\t/g, ' ').trim();
            // TSV - use tab separator, no header
            return [date, user_name, order_sn, rating_star, comment].join('\t');
        }).join('\n');
    }

    /**
     * 將評價陣列格式化成完整 TSV（無標題列）- 10欄格式
     * 欄位順序：評論ID / 星數 / 評價內容 / 用戶ID / 用戶名稱 / 商品ID / 商品名稱 / 時間戳 / 圖片 / 訂單編號
     */
    function formatRatingsToCompleteTSV(list = []) {
        return list.map(it => {
            const comment_id = String(it.comment_id || '');
            const rating_star = String(it.rating_star == null ? '' : it.rating_star);
            const comment = (it.comment || '').replace(/\r?\n|\t/g, ' ').trim();
            const user_id = String(it.user_id || '');
            const user_name = it.user_name || '';
            const product_id = String(it.product_id || it.item_id || '');
            const product_name = it.product_name || '';
            const ctime = String(it.ctime || it.submit_time || it.mtime || 0);
            const images = Array.isArray(it.images) ? it.images.join('|') : '';
            const order_sn = it.order_sn || '';
            // TSV - use tab separator, no header
            return [comment_id, rating_star, comment, user_id, user_name, product_id, product_name, ctime, images, order_sn].join('\t');
        }).join('\n');
    }

    /**
     * 複製文字到剪貼簿（fallback）
     */
    async function copyToClipboard(text) {
        if (!text) return false;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (e) {
            console.warn('navigator.clipboard failed', e);
        }
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (e) {
            document.body.removeChild(ta);
            console.error('copy fallback failed', e);
            return false;
        }
    }

    /**
     * 渲染預覽面板（TSV 內容）
     */
    function renderPreview(tsvText) {
        const resultsEl = uiState.container.querySelector('#extraction-results');
        const statsEl = uiState.container.querySelector('#extraction-stats');
        if (resultsEl) {
            resultsEl.style.display = 'block';
            resultsEl.textContent = tsvText || '(no data)';
        }
        if (statsEl) {
            statsEl.style.display = 'block';
            const lines = tsvText ? tsvText.split('\\n').length : 0;
            statsEl.innerHTML = `<div style="padding:8px;">抓到 ${lines} 筆資料（TSV）</div>`;
        }
    }

    /**
     * 顯示API測試結果
     */
    function displayTestResults(results) {
        const resultsEl = uiState.container.querySelector('#pagination-test-results');
        if (!resultsEl) return;

        let html = '<div style="font-weight: bold; margin-bottom: 12px; color: #2d3748;">🧪 測試結果</div>';

        results.forEach((result, index) => {
            const statusIcon = result.success ? '✅' : '❌';
            const statusColor = result.success ? '#2ea44f' : '#d73a49';

            html += `<div style="margin-bottom: 8px; padding: 8px; background: #f8fafc; border: 1px solid #e1e5e9; border-radius: 4px;">`;

            if (result.testType || result.name) {
                const title = result.testType || result.name;
                html += `<div style="font-weight: bold; color: ${statusColor}; margin-bottom: 4px;">${statusIcon} ${title}</div>`;
            }

            if (result.error) {
                html += `<div style="color: #d73a49; font-size: 12px;">錯誤：${result.error}</div>`;
            } else {
                const details = [];
                if (result.totalItems !== undefined) details.push(`總項目：${result.totalItems}`);
                if (result.totalPages !== undefined) details.push(`總頁數：${result.totalPages}`);
                if (result.totalTime) details.push(`總耗時：${result.totalTime}`);
                if (result.avgResponseTime) details.push(`平均響應：${result.avgResponseTime}`);
                if (result.avgTimePerPage) details.push(`每頁平均：${result.avgTimePerPage}`);
                if (result.itemsPerSecond !== undefined) details.push(`抓取速度：${result.itemsPerSecond} 筆/秒`);
                if (result.responseTime) details.push(`響應時間：${result.responseTime}`);
                if (result.items !== undefined) details.push(`項目數：${result.items}`);
                if (result.page !== undefined) details.push(`頁碼：${result.page}`);
                if (result.lines !== undefined) details.push(`行數：${result.lines}`);
                if (result.testsRun !== undefined) details.push(`測試項目：${result.testsRun}`);
                if (result.successCount !== undefined) details.push(`成功項目：${result.successCount}`);
                if (result.time) details.push(`耗時：${result.time}`);
                if (result.hasMore !== undefined) details.push(`還有更多：${result.hasMore ? '是' : '否'}`);

                if (details.length > 0) {
                    html += `<div style="font-size: 12px; color: #666;">${details.join(' · ')}</div>`;
                }
            }

            html += `</div>`;
        });

        resultsEl.innerHTML = html;
        resultsEl.style.display = 'block';
    }

    /**
     * 以表格形式顯示完整 API 原始資料（動態表頭）
     */
    function renderFullAPITable(list = []) {
        const el = uiState.container.querySelector('#preview-raw-table');
        if (!el) return;
        el.innerHTML = '';
        if (!list || list.length === 0) {
            el.textContent = '(no data)';
            el.style.display = 'block';
            return;
        }
        // 建立可橫向滾動的表格容器
        const tableContainer = document.createElement('div');
        tableContainer.style.overflowX = 'auto';
        tableContainer.style.overflowY = 'auto';
        tableContainer.style.maxHeight = '400px';

        // 建立表格
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '12px';
        table.style.tableLayout = 'auto'; // 改為auto以支援欄寬調整
        table.style.minWidth = '800px'; // 設定最小寬度確保橫向滾動
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // 取所有 keys（以第一筆為主）
        const keys = Object.keys(list[0]);

        // 字段對應表：英文 -> 中文
        const fieldLabels = {
            'comment_id': '評論ID',
            'rating_star': '星數',
            'comment': '評價內容',
            'user_id': '用戶ID',
            'user_name': '用戶名稱',
            'product_id': '商品ID',
            'product_name': '商品名稱',
            'ctime': '時間戳',
            'images': '圖片',
            'order_sn': '訂單編號',
            'item_id': '商品ID',
            'submit_time': '時間戳',
            'mtime': '時間戳'
        };

        // 第一排：中文標題
        const trh1 = document.createElement('tr');
        keys.forEach(k => {
            const th = document.createElement('th');
            th.textContent = fieldLabels[k] || k;
            th.style.borderBottom = '1px solid #ddd';
            th.style.padding = '4px 6px';
            th.style.textAlign = 'left';
            th.style.background = '#f3f4f6';
            th.style.whiteSpace = 'nowrap';
            th.style.minWidth = '100px';
            th.style.cursor = 'col-resize';
            th.style.fontWeight = 'bold';
            trh1.appendChild(th);
        });
        thead.appendChild(trh1);

        // 第二排：英文標題
        const trh2 = document.createElement('tr');
        keys.forEach(k => {
            const th = document.createElement('th');
            th.textContent = k;
            th.style.borderBottom = '2px solid #cbd5e0';
            th.style.padding = '2px 6px';
            th.style.textAlign = 'left';
            th.style.background = '#f8fafc';
            th.style.whiteSpace = 'nowrap';
            th.style.minWidth = '100px';
            th.style.cursor = 'col-resize';
            th.style.fontSize = '11px';
            th.style.color = '#666';
            trh2.appendChild(th);
        });
        thead.appendChild(trh2);

        list.forEach(item => {
            const tr = document.createElement('tr');
            keys.forEach(k => {
                const td = document.createElement('td');
                let v = item[k];
                if (Array.isArray(v)) v = v.join('|');
                else if (v === null || v === undefined) v = '';
                else if (typeof v === 'object') v = JSON.stringify(v);
                td.textContent = String(v);
                td.style.padding = '6px';
                td.style.borderBottom = '1px solid #f1f5f9';
                td.style.whiteSpace = 'nowrap'; // 保持nowrap但移除overflow hidden
                td.style.maxWidth = '200px'; // 設定最大寬度
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        el.appendChild(tableContainer);
        el.style.display = 'block';
    }

    /**
     * 以表格形式顯示轉換後結果（與 TSV 欄位一致，並加標題列）
     */
    function renderTransformedTable(list = []) {
        const el = uiState.container.querySelector('#preview-trans-table');
        if (!el) return;
        el.innerHTML = '';
        // 顯示用戶要求的5個欄位：[日期 買家帳號 訂單編號 星數 文本內容]
        const headers = ['日期','買家帳號','訂單編號','星數','文本內容'];
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const trh = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h;
            th.style.borderBottom = '1px solid #ddd';
            th.style.padding = '6px';
            th.style.background = '#f8fafc';
            th.style.textAlign = 'left';
            trh.appendChild(th);
        });
        thead.appendChild(trh);

        list.forEach(it => {
            const date = formatTimestamp(it.ctime || it.submit_time || it.mtime || 0);
            const user_name = it.user_name || '';
            const order_sn = it.order_sn || '';
            const rating_star = String(it.rating_star == null ? '' : it.rating_star);
            const comment = (it.comment || '').replace(/\r?\n|\t/g, ' ').trim();

            const tr = document.createElement('tr');
            [date, user_name, order_sn, rating_star, comment].forEach(v => {
                const td = document.createElement('td');
                td.textContent = v;
                td.style.padding = '6px';
                td.style.borderBottom = '1px solid #f1f5f9';
                td.style.overflow = 'hidden';
                td.style.textOverflow = 'ellipsis';
                td.style.whiteSpace = 'nowrap';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        el.appendChild(table);
        el.style.display = 'block';
    }

    /**
     * 顯示 API 欄位與建議選擇器（輔助AI 指示）
     */
    function renderFieldMapping() {
        const varsEl = uiState.container.querySelector('#data-variables-section .section-content');
        if (!varsEl) return;
        let mapWrap = varsEl.querySelector('#api-field-mapping');
        if (!mapWrap) {
            mapWrap = document.createElement('div');
            mapWrap.id = 'api-field-mapping';
            mapWrap.style.marginTop = '12px';
            mapWrap.style.padding = '10px';
            mapWrap.style.background = '#fff7ed';
            mapWrap.style.border = '1px solid #ffe1b5';
            mapWrap.style.borderRadius = '6px';
            varsEl.appendChild(mapWrap);
        }
        const mapping = {
            'comment_id': '評論ID（API）',
            'rating_star': '星數 -> svg 計算或 rating_star',
            'comment': '評價文字 -> span:not(:has(svg)) / aria-hidden',
            'images': 'images (array) -> image ids',
            'ctime/mtime/submit_time': '時間戳記 -> div[class*=\"text-xs\"]',
            'user_id': '使用者ID',
            'user_name': '使用者名稱 -> span[class*=\"text-sm\"]',
            'order_sn': '訂單編號 -> a[href*=\"/order/\"]',
            'product_id': '商品ID',
            'product_name': '商品名稱',
            'product_cover': '商品封面 id',
            'reply': '回覆內容（若有）'
        };
        mapWrap.innerHTML = '<strong>API 欄位與建議對應選擇器（輔助 AI 指示）</strong><br><small>若抓錯可回報欄位名稱與頁面 selector</small>';
        const ul = document.createElement('ul');
        ul.style.margin = '8px 0 0 18px';
        Object.entries(mapping).forEach(([k,v])=>{
            const li = document.createElement('li');
            li.style.marginBottom = '6px';
            li.textContent = `${k}  — ${v}`;
            ul.appendChild(li);
        });
        mapWrap.appendChild(ul);
    }

    /**
     * 通用視窗控制功能 - 拖移和縮放
     */
    function addWindowControls(panel, dragHandle) {
        let isDragging = false;
        let isResizing = false;
        let resizeDirection = '';
        let dragOffset = { x: 0, y: 0 };
        let resizeStart = { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 };

        // 設置面板為可調整大小
        panel.style.resize = 'none'; // 移除CSS resize，我們自己實現

        // 拖移功能
        if (dragHandle) {
            dragHandle.style.cursor = 'move';
            dragHandle.addEventListener('mousedown', startDrag);
        }

        // 縮放功能 - 檢測滑鼠位置
        panel.addEventListener('mousemove', updateCursor);
        panel.addEventListener('mousedown', startResize);

        function updateCursor(e) {
            if (isDragging || isResizing) return;

            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const edgeThreshold = 8; // 邊緣檢測閾值

            let cursor = 'default';

            // 右下角 - 同時調整長寬
            if (x >= rect.width - edgeThreshold && y >= rect.height - edgeThreshold) {
                cursor = 'nw-resize';
            }
            // 右邊框 - 只調整寬度
            else if (x >= rect.width - edgeThreshold) {
                cursor = 'ew-resize';
            }
            // 左邊框 - 只調整寬度和位置
            else if (x <= edgeThreshold) {
                cursor = 'ew-resize';
            }
            // 下邊框 - 只調整高度
            else if (y >= rect.height - edgeThreshold) {
                cursor = 'ns-resize';
            }
            // 上邊框 - 只調整高度和位置
            else if (y <= edgeThreshold) {
                cursor = 'ns-resize';
            }

            panel.style.cursor = cursor;
        }

        function startDrag(e) {
            if (e.target.closest('button') || e.target.closest('input') ||
                e.target.closest('.section-toggle') || e.target.closest('.close-preview-btn') || isResizing) return;

            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            panel.style.cursor = 'grabbing';
            e.preventDefault();
            e.stopPropagation();
        }

        function startResize(e) {
            if (isDragging) return;

            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const edgeThreshold = 8;

            // 確定縮放方向
            if (x >= rect.width - edgeThreshold && y >= rect.height - edgeThreshold) {
                resizeDirection = 'se'; // 右下角 - 同時調整長寬
            } else if (x >= rect.width - edgeThreshold) {
                resizeDirection = 'e'; // 右邊框 - 只調整寬度
            } else if (x <= edgeThreshold) {
                resizeDirection = 'w'; // 左邊框 - 調整寬度和位置
            } else if (y >= rect.height - edgeThreshold) {
                resizeDirection = 's'; // 下邊框 - 只調整高度
            } else if (y <= edgeThreshold) {
                resizeDirection = 'n'; // 上邊框 - 調整高度和位置
            } else {
                return; // 不在邊緣區域
            }

            if (e.target.closest('button') || e.target.closest('input')) return;

            isResizing = true;
            resizeStart.x = e.clientX;
            resizeStart.y = e.clientY;
            resizeStart.width = panel.offsetWidth;
            resizeStart.height = panel.offsetHeight;
            resizeStart.top = panel.offsetTop;
            resizeStart.left = panel.offsetLeft;

            e.preventDefault();
            e.stopPropagation();
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopInteraction);

        function handleMouseMove(e) {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // 限制在視窗內，保持右上角定位邏輯
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;

                const clampedX = Math.max(0, Math.min(newX, maxX));
                const clampedY = Math.max(0, Math.min(newY, maxY));

                // 使用right定位，計算右邊距
                const rightValue = window.innerWidth - clampedX - panel.offsetWidth;
                panel.style.right = Math.max(0, rightValue) + 'px';
                panel.style.top = clampedY + 'px';
                panel.style.left = 'auto'; // 清除left定位

            } else if (isResizing) {
                const deltaX = e.clientX - resizeStart.x;
                const deltaY = e.clientY - resizeStart.y;

                switch (resizeDirection) {
                    case 'se': // 右下角 - 斜角縮放，以左上角為錨點
                        const newWidth = Math.max(400, resizeStart.width + deltaX);
                        const newHeight = Math.max(300, resizeStart.height + deltaY);
                        panel.style.width = newWidth + 'px';
                        panel.style.height = newHeight + 'px';
                        // 左上角固定，不改變位置
                        break;

                    case 'e': // 右邊框 - 單軸調整，以左邊框為固定錨點
                        const newWidthE = Math.max(400, resizeStart.width + deltaX);
                        panel.style.width = newWidthE + 'px';
                        // 左邊框位置不變
                        break;

                    case 'w': // 左邊框 - 單軸調整，以右邊框為固定錨點
                        const newWidthW = Math.max(400, resizeStart.width - deltaX);
                        const newLeftW = resizeStart.left + deltaX;
                        panel.style.width = newWidthW + 'px';
                        panel.style.left = Math.max(0, newLeftW) + 'px';
                        // 右邊框固定，左邊框移動
                        break;

                    case 's': // 下邊框 - 單軸調整，以上邊框為固定錨點
                        const newHeightS = Math.max(300, resizeStart.height + deltaY);
                        panel.style.height = newHeightS + 'px';
                        // 上邊框位置不變
                        break;

                    case 'n': // 上邊框 - 單軸調整，以下邊框為固定錨點
                        const newHeightN = Math.max(300, resizeStart.height - deltaY);
                        const newTop = resizeStart.top + deltaY;
                        panel.style.height = newHeightN + 'px';
                        panel.style.top = Math.max(0, newTop) + 'px';
                        break;
                }
            }
        }

        function stopInteraction() {
            if (isDragging) {
                isDragging = false;
                // 確保停止拖動後使用right定位
                const rect = panel.getBoundingClientRect();
                const rightValue = window.innerWidth - rect.left - panel.offsetWidth;
                panel.style.right = Math.max(0, rightValue) + 'px';
                panel.style.left = 'auto'; // 清除left定位
                updateCursor({ clientX: 0, clientY: 0 }); // 重置游標
            }
            if (isResizing) {
                isResizing = false;
                resizeDirection = '';
                updateCursor({ clientX: 0, clientY: 0 }); // 重置游標
            }
        }
    }

    // 拖動功能 (優化實現)
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let mouseDownTime = 0;
    let mouseDownTimer = null;

    function setupEventListeners() {
        const container = uiState.container;
        const toggleBtn = container.querySelector('.toggle-btn');
        const expandBtn = container.querySelector('.expand-btn');

        // 為toggle按鈕添加點擊事件（向後相容）
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止觸發其他事件
                toggleExpanded();
            });
        }

        // 為expand按鈕添加點擊事件
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止觸發其他事件
                toggleExpanded();
            });
        }

        // 收折狀態下也可以拖動整個容器
        container.addEventListener('mousedown', startDrag);

        // 快速複製按鈕事件處理
        const quickCopyBtn = container.querySelector('.quick-copy-btn');
        if (quickCopyBtn) {
            quickCopyBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    showToast('快速複製：抓取中...', 'info');
                    const list = await fetchAllRatings();
                    const tsv = formatRatingsToTSV(list);
                    const timestamp = new Date().toLocaleString('zh-TW');
                    const header = `蝦皮評價數據 - ${timestamp}\n版本：${SCRIPT_VERSION}\n總筆數：${list.length}\n\n`;
                    const content = header + tsv;
                    const ok = await copyToClipboard(content);
                    if (ok) {
                        showToast(`已複製 ${list.length} 筆評價數據`, 'success');
                    } else {
                        showToast('複製失敗', 'error');
                    }
                } catch (err) {
                    console.error('快速複製失敗:', err);
                    showToast('快速複製失敗，請查看控制台', 'error');
                }
            });
        }

        // 優化點擊事件處理 - 標題列點擊
        const header = container.querySelector('#drag-handle');
        if (header) {
            header.addEventListener('mousedown', handleHeaderMouseDown);
            header.addEventListener('mouseup', handleHeaderMouseUp);
            header.addEventListener('click', handleHeaderClick);
        }

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', endDrag);
    }

    function handleHeaderMouseDown(e) {
        mouseDownTime = Date.now();

        // 清除之前的計時器
        if (mouseDownTimer) {
            clearTimeout(mouseDownTimer);
        }

        // 設置延遲，如果按住超過300ms就開始拖動
        mouseDownTimer = setTimeout(() => {
            if (!isDragging) {
                startDrag(e);
            }
        }, 300);

        e.preventDefault();
    }

    function handleHeaderMouseUp(e) {
        // 清除拖動計時器
        if (mouseDownTimer) {
            clearTimeout(mouseDownTimer);
            mouseDownTimer = null;
        }

        const pressDuration = Date.now() - mouseDownTime;

        // 如果按住時間短於300ms，視為點擊
        if (pressDuration < 300 && !isDragging) {
            // 點擊事件會由handleHeaderClick處理
        }
    }

    function handleHeaderClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const pressDuration = Date.now() - mouseDownTime;

        // 只有在短按且沒有拖動的情況下才執行展開/收折
        if (pressDuration < 300 && !isDragging) {
            toggleExpanded();
        }
    }

    function startDrag(e) {
        // 清除點擊相關的計時器
        if (mouseDownTimer) {
            clearTimeout(mouseDownTimer);
            mouseDownTimer = null;
        }

        // 在收折和展開狀態下都可以拖動
        isDragging = true;
        const container = uiState.container;
        const rect = container.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        container.style.cursor = 'grabbing';
        e.preventDefault(); // 防止文字選擇
    }

    function handleDrag(e) {
        if (dragOffset.x === 0 && dragOffset.y === 0) return;

        const container = uiState.container;
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // 確保視窗不會被拖出螢幕邊界
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;

        container.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        container.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        container.style.right = 'auto'; // 清除right定位
        isDragging = true;
    }

    function endDrag() {
        const container = uiState.container;
        if (container) {
            container.style.cursor = '';
            const rect = container.getBoundingClientRect();
            settings.ui.position.x = rect.left;
            settings.ui.position.y = rect.top;
        }
        dragOffset = { x: 0, y: 0 };
    }

    function toggleExpanded() {
        const container = uiState.container;

        if (uiState.expanded) {
            // 從展開狀態收起到收折狀態 - 始終保持右上角基準點
            container.style.right = '40px';
            container.style.top = '50px';
            container.style.left = 'auto'; // 清除left定位
        } else {
            // 從收折狀態展開到展開狀態 - 計算展開後的右上角位置
            const rect = container.getBoundingClientRect();
            // 響應式寬度：最大不超過視窗寬度的90%，最小700px，預設900px但不超過視窗寬度
            const expandedWidth = Math.min(900, Math.max(700, Math.floor(window.innerWidth * 0.9)));

            // 計算展開後的位置，讓右上角保持在同一個點
            const newRight = Math.max(40, window.innerWidth - rect.right - (expandedWidth - rect.width));

            // 設置展開後的位置
            container.style.right = newRight + 'px';
            container.style.top = '50px';
            container.style.left = 'auto'; // 清除left定位
        }

        uiState.expanded = !uiState.expanded;
        if (uiState.expanded) {
            expandUI();
        } else {
            collapseUI();
        }
    }

    function collapseUI() {
        const container = uiState.container;
        container.className = 'collapsed';
        container.style.height = '50px';
        // 與 createUIContainer 保持一致的精簡收折內容
        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; width:100%; height:100%;">
                <button class="btn expand-btn" title="展開面板" style="background:transparent; border:none; color:white; font-size:18px; padding:0 6px;">🧪</button>
                <div class="status-text" style="display:flex; flex-direction:column; justify-content:center; line-height:1;">
                    <div style="font-weight:600;">蝦皮評價擷取器</div>
                    <div style="font-size:11px;">v${SCRIPT_VERSION}</div>
                </div>
                <button class="quick-copy-btn" title="一鍵抓取並複製評價數據" style="
                    margin-left:auto;
                    background: rgba(255, 255, 255, 0.12);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: background 0.2s;
                ">📋</button>
            </div>
        `;
        setupEventListeners();
    }

    // 初始化
    function init() {
        console.log(`🐱‍👤 [蝦皮評價擷取器與測試器合併版 v${SCRIPT_VERSION}] 初始化開始...`);

        injectBaseStyles();
        createUIContainer();

        console.log(`🐱‍👤 [合併版 v${SCRIPT_VERSION}] 初始化完成！點擊右上角的 🧪 圖示展開控制面板`);

        // 測試基本功能是否正常
        setTimeout(() => {
            const container = uiState.container;
            if (container) {
                console.log('🐱‍👤 UI容器創建成功:', container.className);
                const toggleBtn = container.querySelector('.toggle-btn');
                if (toggleBtn) {
                    console.log('🐱‍👤 展開按鈕找到，事件監聽器已設置');
                } else {
                    console.error('🐱‍👤 展開按鈕未找到！');
                }
            } else {
                console.error('🐱‍👤 UI容器未創建！');
            }
        }, 100);
    }

    // 啟動腳本
    init();

    // 確保複製按鈕事件在初始化後立即可用（綁定快速複製：抓取並複製TSV）
    setTimeout(() => {
        const quickCopyBtn = uiState.container?.querySelector('.quick-copy-btn');
        if (quickCopyBtn) {
            quickCopyBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    showToast('快速複製：抓取中...', 'info');
                    const list = await fetchAllRatings();
                    const tsv = formatRatingsToSimplifiedTSV(list);
                    const ok = await copyToClipboard(tsv);
                    if (ok) showToast(`快速複製完成：已複製 ${list.length} 筆（TSV）`, 'success');
                    else showToast('快速複製失敗', 'error');
                } catch (err) {
                    console.error(err);
                    showToast('快速複製失敗', 'error');
                }
            });
        }
    }, 100);

    })();
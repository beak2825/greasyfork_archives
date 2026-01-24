// ==UserScript==
// @name         蝦皮評價擷取器與測試器合併版 V2-1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  用途：在蝦皮賣家後台批量擷取「評價 / 回評」資料，支援篩選、搜索、日期區間、表格顯示、複製與下載，供報表與客服回覆使用。
// @author       BUTTST <buttst@example.com>
// @license      MIT; https://opensource.org/licenses/MIT
// @match        https://seller.shopee.tw/portal/settings/shop/rating*
// @match        https://seller.shopee.com.tw/portal/settings/shop/rating*
// @match        http://127.0.0.1:5500/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563874/%E8%9D%A6%E7%9A%AE%E8%A9%95%E5%83%B9%E6%93%B7%E5%8F%96%E5%99%A8%E8%88%87%E6%B8%AC%E8%A9%A6%E5%99%A8%E5%90%88%E4%BD%B5%E7%89%88%20V2-13.user.js
// @updateURL https://update.greasyfork.org/scripts/563874/%E8%9D%A6%E7%9A%AE%E8%A9%95%E5%83%B9%E6%93%B7%E5%8F%96%E5%99%A8%E8%88%87%E6%B8%AC%E8%A9%A6%E5%99%A8%E5%90%88%E4%BD%B5%E7%89%88%20V2-13.meta.js
// ==/UserScript==

/*
用途（用於解決的需求）：
- 批量擷取蝦皮賣家後台的評價與回評資料，為客服回覆、品質分析、資料備份與外部報表提供可複製的 TSV/表格輸出。

功能與技術特點細節：
- 使用原生 Fetch 與同站認證（credentials: 'same-origin'）發送 API 請求，並做分頁/延遲控制以避免短時間衝擊後台。
- 資料格式化會清理換行與制表符、格式化時間，輸出易於貼到 Excel/Google Sheets 的 TSV。
- 面板採輕量 DOM 操作（無第三方框架），支援拖曳、折疊與常見互動控件，減少與頁面 React 狀態衝突的查詢策略。
- 提供多種測試模式：單頁、多頁批量、分頁效能、綜合測試、最大值測試，便於驗證 API 與頁面限制。



📋 更新日誌 (由最新版永遠置頂)

## v1.3（2026/01/24 13:00）
* 優化介面佈局：調整展開面板寬度為400px，提升在螢幕上的適應性
* 改善標題顯示：更新腳本名稱為「蝦皮評價擷取器 V2- v1.3」，提升版本識別度
* 修復評分篩選器讀取錯誤：解決querySelectorAll選擇器無效的問題，確保星星數量能正確提取
* 優化代碼效率：改進React組件讀取邏輯，減少重複DOM查詢操作

## v1.2（2026/01/24 14:38）
* 新增表格數據展示：數據以美觀的表格形式顯示，欄位寬度自適應
* 優化複製功能：顯示複製筆數，標題列複製按鈕具備智能提取功能
* 改善介面佈局：增加區塊分隔線，調整各區塊間距為適中距離
* 統一按鈕樣式：所有按鈕採用一致的設計風格和顏色配置

## v1.1（2026/01/24 14:38）
* 創建V2優化版：大幅縮減程式碼體量，移除冗餘除錯機制
* 重構數據處理：統一工具函數，優化事件委派和記憶體管理
* 改善用戶體驗：簡化操作邏輯，提升響應速度和穩定性
* 優化類化架構：使用UIManager類統一管理所有UI邏輯
*/

(function() {
    'use strict';

    // 核心配置
    const CONFIG = {
        VERSION: 'v1.3',
        DATE: '2026/01/24 13:00',
        API_BASE: '/api/v3/settings/search_shop_rating_comments_new/',
        DEFAULTS: {
            pageSize: 20,
            testPages: 3,
            delay: 300,
            maxPageSize: 200,
            maxTestPages: 50,
            maxDelay: 5000
        }
    };

    // 工具函數
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => [...p.querySelectorAll(s)];
    const createEl = (tag, attrs = {}, text = '') => {
        const el = document.createElement(tag);
        Object.assign(el, attrs);
        if (text) el.textContent = text;
        return el;
    };

    // 數據處理
    const formatTime = (ts) => ts ? new Date(ts * 1000).toLocaleString('zh-TW') : '';
    const cleanText = (text) => (text || '').replace(/\t|\n/g, ' ').trim();
    const delay = (ms) => new Promise(r => setTimeout(r, ms + Math.random() * ms * 0.4 - ms * 0.2));

    // API請求
    const fetchAPI = async (params) => {
        const url = new URL(CONFIG.API_BASE, location.origin);
        Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
        const res = await fetch(url, { credentials: 'same-origin' });
        return res.json();
    };

    // 數據格式化
    const formatData = (list, mode) => {
        if (mode === 'raw') return { code: 0, data: { list } };

        const data = list.map(item => ({
            date: formatTime(item.ctime || item.submit_time || item.mtime),
            user: item.user_name || '',
            order: item.order_sn || '',
            stars: String(item.rating_star || ''),
            comment: cleanText(item.comment)
        }));

        return { data, count: list.length };
    };

    // UI組件
    class UIManager {
        constructor() {
            this.panel = null;
            this.isExpanded = false;
            this.currentData = null;
            this.init();
        }

        init() {
            this.createPanel();
            this.bindEvents();
        }

        createPanel() {
            const panel = createEl('div', {
                id: 'shopee-rating-extractor',
                style: `
                    position: fixed; top: 50px; right: 40px; z-index: 9999;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 12px; color: white; overflow: hidden;
                    transition: all 0.3s ease; cursor: move;
                `
            });

            panel.innerHTML = `
                <div class="header" style="padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="toggle-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">🧪</button>
                        <span class="title">蝦皮評價擷取器 V2- ${CONFIG.VERSION}</span>
                    </div>
                    <button class="quick-copy-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">📋</button>
                </div>
                <div class="content" style="display: none; padding: 16px; background: white; color: #333; max-height: 70vh; overflow-y: auto; overflow-x: auto;">
                    ${this.createContent()}
                </div>
            `;

            document.body.appendChild(panel);
            this.panel = panel;
            this.makeDraggable();
        }

        createContent() {
            return `
                <div class="section" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #667eea; color: #333;">數據抓取測試</h3>
                    <div class="controls" style="display: flex; gap: 8px; margin-bottom: 12px;">
                        <button class="extract-btn" style="padding: 6px 12px; border: none; border-radius: 4px; background: #667eea; color: white; cursor: pointer;">🧪 數據提取</button>
                        <button class="copy-btn" style="padding: 6px 12px; border: none; border-radius: 4px; background: #28a745; color: white; cursor: pointer;">📋 複製結果</button>
                        <button class="download-btn" style="padding: 6px 12px; border: none; border-radius: 4px; background: #17a2b8; color: white; cursor: pointer;">⬇️ 下載TSV</button>
                    </div>
                    <div class="preview-mode" style="margin-bottom: 12px;">
                        <label style="margin-right: 16px;"><input type="radio" name="preview" value="table" checked> 轉換後表格</label>
                        <label><input type="radio" name="preview" value="raw"> 原始資料</label>
                    </div>
                    <div class="result" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; max-height: 300px; overflow: auto;"></div>
                </div>

                <div class="section" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #667eea; color: #333;">篩選器控制</h3>
                    <div style="margin-bottom: 12px;">
                        <button class="read-filters-btn" style="padding: 6px 12px; border: none; border-radius: 4px; background: #28a745; color: white; cursor: pointer;">📖 讀取頁面篩選</button>
                    </div>

                    <div class="filter-group" style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: bold;">狀態篩選:</label>
                        <div style="display: flex; gap: 12px;">
                            <label><input type="radio" name="reply_status" value="all" checked> 全部</label>
                            <label><input type="radio" name="reply_status" value="unreplied"> 待回覆</label>
                            <label><input type="radio" name="reply_status" value="replied"> 已回覆</label>
                        </div>
                    </div>

                    <div class="filter-group" style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: bold;">評分篩選:</label>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <label><input type="checkbox" name="rating_filter" value="ALL" checked> 全部</label>
                            ${[5,4,3,2,1].map(n => `<label><input type="checkbox" name="rating_filter" value="${n}"> ${n}⭐</label>`).join('')}
                        </div>
                    </div>

                    <div class="filter-group" style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 6px; font-weight: bold;">搜索條件:</label>
                        <input type="text" id="searchInput" placeholder="商品名稱、訂單編號、買家名稱" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>

                    <div class="filter-group">
                        <label style="display: block; margin-bottom: 6px; font-weight: bold;">日期範圍:</label>
                        <select id="dateRange" style="padding: 6px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 6px;">
                            <option value="">無限制</option>
                            <option value="yesterday">昨天</option>
                            <option value="7days">過去7天</option>
                            <option value="30days">過去30天</option>
                            <option value="custom">自訂範圍</option>
                        </select>
                        <div id="customDate" style="display: none;">
                            <div style="display: flex; gap: 8px; margin-top: 6px;">
                                <input type="date" id="startDate" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                                <input type="date" id="endDate" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section collapsed" style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #667eea; color: #333; cursor: pointer;">API測試工具 <span class="toggle">▼</span></h3>
                    <div class="test-controls" style="display: none;">
                        <div class="params" style="margin-bottom: 12px; display: flex; gap: 12px; flex-wrap: wrap;">
                            <label>頁面大小: <input type="number" id="pageSize" value="20" min="1" max="200" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px; width: 80px;"></label>
                            <label>測試頁數: <input type="number" id="testPages" value="3" min="1" max="50" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px; width: 80px;"></label>
                            <label>延遲(ms): <input type="number" id="delay" value="300" min="0" max="5000" style="padding: 4px; border: 1px solid #ccc; border-radius: 4px; width: 80px;"></label>
                        </div>
                        <div class="test-buttons" style="margin-bottom: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                            <button class="test-btn" data-test="single" style="padding: 6px 12px; border: none; border-radius: 4px; background: #6c757d; color: white; cursor: pointer;">📄 單頁測試</button>
                            <button class="test-btn" data-test="batch" style="padding: 6px 12px; border: none; border-radius: 4px; background: #6c757d; color: white; cursor: pointer;">📚 多頁批量</button>
                            <button class="test-btn" data-test="perf" style="padding: 6px 12px; border: none; border-radius: 4px; background: #6c757d; color: white; cursor: pointer;">🔄 分頁效能</button>
                            <button class="test-btn" data-test="comprehensive" style="padding: 6px 12px; border: none; border-radius: 4px; background: #6c757d; color: white; cursor: pointer;">🚀 綜合測試</button>
                            <button class="test-btn" data-test="max" style="padding: 6px 12px; border: none; border-radius: 4px; background: #6c757d; color: white; cursor: pointer;">🔍 最大值測試</button>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <button class="copy-test-result" style="padding: 6px 12px; border: none; border-radius: 4px; background: #28a745; color: white; cursor: pointer;">📋 複製測試結果</button>
                        </div>
                        <div class="test-result" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 8px; max-height: 150px; overflow: auto; font-family: monospace; font-size: 11px; white-space: pre-wrap;"></div>
                    </div>
                </div>
            `;
        }

        makeDraggable() {
            let isDragging = false, startX, startY, startLeft, startTop;
            const header = $('.header', this.panel);

            header.addEventListener('mousedown', e => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = this.panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
            });

            document.addEventListener('mousemove', e => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                this.panel.style.left = `${startLeft + dx}px`;
                this.panel.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => isDragging = false);
        }

        bindEvents() {
            // 展開/收起
            $('.toggle-btn', this.panel).addEventListener('click', () => this.toggle());
            $('.title', this.panel).addEventListener('click', () => this.toggle());

            // 快速複製
            $('.quick-copy-btn', this.panel).addEventListener('click', () => this.quickCopy());

            // 區塊折疊
            $$('.section h3 .toggle', this.panel).forEach(toggle => {
                toggle.addEventListener('click', e => {
                    const section = e.target.closest('.section');
                    const content = $('div', section);
                    const isCollapsed = section.classList.contains('collapsed');
                    section.classList.toggle('collapsed');
                    content.style.display = isCollapsed ? 'block' : 'none';
                    e.target.textContent = isCollapsed ? '▲' : '▼';
                });
            });

            // 評分篩選互斥邏輯
            $$('input[name="rating_filter"]', this.panel).forEach(cb => {
                cb.addEventListener('change', () => {
                    const checkboxes = $$('input[name="rating_filter"]', this.panel);
                    const allCb = $('input[name="rating_filter"][value="ALL"]', this.panel);
                    if (cb.value === 'ALL' && cb.checked) {
                        checkboxes.forEach(c => c !== cb && (c.checked = false));
                    } else if (cb.checked) {
                        allCb.checked = false;
                    }
                });
            });

            // 日期範圍
            $('#dateRange', this.panel).addEventListener('change', e => {
                const customDiv = $('#customDate', this.panel);
                customDiv.style.display = e.target.value === 'custom' ? 'block' : 'none';
            });

            // 讀取頁面篩選
            $('.read-filters-btn', this.panel).addEventListener('click', () => this.readPageFilters());

            // 數據提取
            $('.extract-btn', this.panel).addEventListener('click', () => this.extractData());

            // 複製結果
            $('.copy-btn', this.panel).addEventListener('click', () => this.copyResult());

            // 下載TSV
            $('.download-btn', this.panel).addEventListener('click', () => this.downloadTSV());

            // 測試按鈕
            $$('.test-btn', this.panel).forEach(btn => {
                btn.addEventListener('click', () => this.runTest(btn.dataset.test));
            });

            // 複製測試結果
            $('.copy-test-result', this.panel).addEventListener('click', () => this.copyTestResult());
        }

        toggle() {
            this.isExpanded = !this.isExpanded;
            const content = $('.content', this.panel);
            content.style.display = this.isExpanded ? 'block' : 'none';
            this.panel.style.width = this.isExpanded ? '700px' : '200px';
            this.panel.style.height = this.isExpanded ? 'auto' : '50px';
        }

        async quickCopy() {
            if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
                // 如果沒有數據，先提取數據
                await this.extractData();
                // 等待一下確保數據處理完成
                await new Promise(r => setTimeout(r, 100));
            }

            if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
                this.showToast('無數據可複製，請先進行數據提取');
                return;
            }

            // 生成TSV格式的文本
            const tsvText = this.currentData.data.map(item => [
                item.date, item.user, item.order, item.stars, item.comment
            ].join('\t')).join('\n') + '\n';

            navigator.clipboard.writeText(tsvText).then(() => {
                this.showToast(`已複製 ${this.currentData.count} 筆數據到剪貼簿`);
            });
        }

        showToast(msg) {
            const toast = createEl('div', {
                style: 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 8px 16px; border-radius: 4px; z-index: 10000;'
            }, msg);
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }

        displayData(result, mode) {
            const resultEl = $('.result', this.panel);
            if (mode === 'raw') {
                resultEl.innerHTML = `<pre style="margin: 0; font-size: 11px;">${JSON.stringify(result, null, 2)}</pre>`;
                return;
            }

            if (!result.data || result.data.length === 0) {
                resultEl.innerHTML = '<div style="text-align: center; color: #6c757d; padding: 20px;">無數據，請先進行數據提取</div>';
                return;
            }

            const table = `
                <table style="width: auto; min-width: 900px; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold; width: 180px; white-space: nowrap;">日期</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold; width: 150px; white-space: nowrap;">買家帳號</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold; width: 150px; white-space: nowrap;">訂單編號</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: center; font-weight: bold; width: 80px; white-space: nowrap;">星數</th>
                            <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold; min-width: 400px; white-space: nowrap;">評價內容</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.data.map(item => `
                            <tr>
                                <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; white-space: nowrap;">${item.date}</td>
                                <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; white-space: nowrap;">${item.user}</td>
                                <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; white-space: nowrap;">${item.order}</td>
                                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center; vertical-align: top; white-space: nowrap;">${item.stars}</td>
                                <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; white-space: nowrap;">${item.comment}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="margin-top: 8px; color: #6c757d; font-size: 11px;">共 ${result.count} 筆數據</div>
            `;
            resultEl.innerHTML = table;
        }

        readPageFilters() {
            try {
                // 讀取回覆狀態
                const replyStatus = this.readReplyStatus();
                if (replyStatus) {
                    $(`input[name="reply_status"][value="${replyStatus}"]`, this.panel).checked = true;
                }

                // 讀取評分篩選
                const ratingFilters = this.readRatingFilters();
                $$('input[name="rating_filter"]', this.panel).forEach(cb => {
                    cb.checked = ratingFilters.includes(cb.value);
                });

                // 讀取搜索條件
                const searchText = this.readSearchFilter();
                if (searchText) {
                    $('#searchInput', this.panel).value = searchText;
                }

                // 讀取日期範圍
                const dateRange = this.readDateRange();
                if (dateRange) {
                    $('#dateRange', this.panel).value = dateRange.type;
                    if (dateRange.type === 'custom') {
                        $('#startDate', this.panel).value = dateRange.start;
                        $('#endDate', this.panel).value = dateRange.end;
                        $('#customDate', this.panel).style.display = 'block';
                    }
                }

                this.showToast('篩選條件已讀取');
            } catch (e) {
                this.showToast('讀取失敗: ' + e.message);
            }
        }

        readReplyStatus() {
            const container = $('.flex.items-center.mt-6');
            if (!container) return 'all';

            const activeElement = $('.activeStatusRadio-0-2-10', container);
            if (!activeElement) return 'all';

            const text = activeElement.textContent?.trim();
            if (text?.includes('待回覆')) return 'unreplied';
            if (text?.includes('已回覆')) return 'replied';
            return 'all';
        }

        readRatingFilters() {
            const container = $('.flex.items-center.my-6');
            if (!container) return ['ALL'];

            // 多策略讀取
            const checkedBoxes = $$('input[type="checkbox"]:checked', container);
            const allCheckboxes = $$('input[type="checkbox"]', container);
            const reactChecked = allCheckboxes.filter(el =>
                el.checked || el.getAttribute('aria-checked') === 'true'
            );

            let selected = [];
            if (checkedBoxes.length > 0) {
                selected = checkedBoxes.map(cb => cb.value);
            } else if (reactChecked.length > 0) {
                selected = reactChecked.map(el => el.value);
            } else {
                // DOM文本分析策略
                const labels = $$('span', container);
                selected = labels.filter(span => {
                    const text = span.textContent?.trim() || '';
                    return text.includes('顆星') && !text.includes('全部');
                }).map(span => {
                    const match = span.textContent.match(/(\d)顆星/);
                    return match ? match[1] : null;
                }).filter(Boolean);
            }

            return selected.length > 0 ? selected : ['ALL'];
        }

        readSearchFilter() {
            const input = $('#searchRequest');
            return input?.value?.trim() || '';
        }

        readDateRange() {
            const input = $('.eds-react-date-picker__input input');
            if (!input || !input.value || input.value === '請設定日期區間') return null;

            const [start, end] = input.value.split(' - ').map(d => d.trim());
            if (!start || !end) return null;

            return {
                type: 'custom',
                start: new Date(start).toISOString().split('T')[0],
                end: new Date(end).toISOString().split('T')[0]
            };
        }

        async extractData() {
            try {
                const filters = this.getFilters();
                const params = this.buildAPIParams(filters);

                this.showToast('正在提取數據...');
                const data = await fetchAPI(params);

                if (data.code !== 0) {
                    throw new Error('API請求失敗: ' + data.code);
                }

                const mode = $('input[name="preview"]:checked', this.panel).value;
                const result = formatData(data.data.list, mode);

                this.currentData = result;
                this.displayData(result, mode);
                this.showToast(`提取完成，共${data.data.list.length}條數據`);
            } catch (e) {
                $('.result', this.panel).innerHTML = '<div style="color: #f44336; padding: 8px;">錯誤: ' + e.message + '</div>';
                this.showToast('提取失敗');
            }
        }

        getFilters() {
            const filters = {};

            // 回覆狀態
            const replyStatus = $('input[name="reply_status"]:checked', this.panel).value;
            if (replyStatus !== 'all') {
                filters.reply_status = replyStatus;
            }

            // 評分篩選
            const ratingBoxes = $$('input[name="rating_filter"]:checked', this.panel);
            const selectedRatings = ratingBoxes.map(cb => cb.value);
            if (selectedRatings.includes('ALL') || selectedRatings.length === 0) {
                filters.rating_star = '5,4,3,2,1';
            } else {
                filters.rating_star = selectedRatings.filter(v => v !== 'ALL')
                    .sort((a,b) => b-a).join(',');
            }

            // 搜索條件
            const searchText = $('#searchInput', this.panel).value.trim();
            if (searchText) {
                filters.search_value = searchText;
            }

            // 日期範圍
            const dateRange = $('#dateRange', this.panel).value;
            if (dateRange) {
                const now = new Date();
                let start, end;

                switch (dateRange) {
                    case 'yesterday':
                        start = new Date(now);
                        start.setDate(start.getDate() - 1);
                        end = new Date(start);
                        end.setHours(23, 59, 59);
                        break;
                    case '7days':
                        start = new Date(now);
                        start.setDate(start.getDate() - 7);
                        end = now;
                        break;
                    case '30days':
                        start = new Date(now);
                        start.setDate(start.getDate() - 30);
                        end = now;
                        break;
                    case 'custom':
                        const startDate = $('#startDate', this.panel).value;
                        const endDate = $('#endDate', this.panel).value;
                        if (startDate && endDate) {
                            start = new Date(startDate);
                            end = new Date(endDate);
                            end.setHours(23, 59, 59);
                        }
                        break;
                }

                if (start && end) {
                    filters.start_time = Math.floor(start.getTime() / 1000);
                    filters.end_time = Math.floor(end.getTime() / 1000);
                }
            }

            return filters;
        }

        buildAPIParams(filters) {
            const params = {
                SPC_CDS_VER: '2',
                page_number: '1',
                page_size: '20',
                cursor: '0',
                from_page_number: '1',
                language: 'zh-Hant'
            };

            // 狀態篩選
            if (filters.reply_status) {
                const statusMap = { unreplied: '1', replied: '2' };
                params.reply_status = statusMap[filters.reply_status];
            }

            // 評分篩選
            if (filters.rating_star && filters.rating_star !== '5,4,3,2,1') {
                params.rating_star = filters.rating_star;
            }

            // 搜索條件
            if (filters.search_value) {
                params.search_request = filters.search_value;
            }

            // 日期範圍
            if (filters.start_time) params.time_start = filters.start_time;
            if (filters.end_time) params.time_end = filters.end_time;

            return params;
        }

        copyResult() {
            if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
                this.showToast('無數據可複製，請先進行數據提取');
                return;
            }

            // 生成TSV格式的文本
            const tsvText = this.currentData.data.map(item => [
                item.date, item.user, item.order, item.stars, item.comment
            ].join('\t')).join('\n') + '\n';

            navigator.clipboard.writeText(tsvText).then(() => {
                this.showToast(`已複製 ${this.currentData.count} 筆數據到剪貼簿`);
            });
        }

        downloadTSV() {
            if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
                this.showToast('沒有數據可下載，請先進行數據提取');
                return;
            }

            // 生成TSV格式的文本
            const tsvText = this.currentData.data.map(item => [
                item.date, item.user, item.order, item.stars, item.comment
            ].join('\t')).join('\n') + '\n';

            const blob = new Blob([tsvText], { type: 'text/tab-separated-values' });
            const url = URL.createObjectURL(blob);
            const a = createEl('a', { href: url, download: `蝦皮評價_${new Date().toISOString().split('T')[0]}.tsv` });
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast(`TSV文件已下載 (${this.currentData.count} 筆數據)`);
        }

        async runTest(testType) {
            const pageSize = parseInt($('#pageSize', this.panel).value) || 20;
            const testPages = parseInt($('#testPages', this.panel).value) || 3;
            const delayMs = parseInt($('#delay', this.panel).value) || 300;

            const resultEl = $('.test-result', this.panel);
            resultEl.textContent = '測試中...';

            try {
                const results = [];
                const startTime = Date.now();

                switch (testType) {
                    case 'single':
                        const singleResult = await fetchAPI({
                            SPC_CDS_VER: '2',
                            page_number: '1',
                            page_size: String(pageSize),
                            cursor: '0',
                            from_page_number: '1',
                            language: 'zh-Hant'
                        });
                        results.push(`單頁測試結果: ${singleResult.code === 0 ? '成功' : '失敗'} (${singleResult.data?.list?.length || 0}條數據)`);
                        break;

                    case 'batch':
                        for (let i = 1; i <= testPages; i++) {
                            const result = await fetchAPI({
                                SPC_CDS_VER: '2',
                                page_number: String(i),
                                page_size: String(pageSize),
                                cursor: '0',
                                from_page_number: String(i),
                                language: 'zh-Hant'
                            });
                            results.push(`頁${i}: ${result.code === 0 ? '成功' : '失敗'} (${result.data?.list?.length || 0}條)`);
                            if (i < testPages) await delay(delayMs);
                        }
                        break;

                    case 'perf':
                        const perfResults = [];
                        for (let size of [10, 50, 100, 200]) {
                            const start = Date.now();
                            const result = await fetchAPI({
                                SPC_CDS_VER: '2',
                                page_number: '1',
                                page_size: String(size),
                                cursor: '0',
                                from_page_number: '1',
                                language: 'zh-Hant'
                            });
                            const time = Date.now() - start;
                            perfResults.push(`page_size=${size}: ${time}ms (${result.data?.list?.length || 0}條)`);
                        }
                        results.push(...perfResults);
                        break;

                    case 'comprehensive':
                        const compResults = [];
                        for (let page = 1; page <= Math.min(testPages, 5); page++) {
                            for (let size of [20, 100]) {
                                const result = await fetchAPI({
                                    SPC_CDS_VER: '2',
                                    page_number: String(page),
                                    page_size: String(size),
                                    cursor: '0',
                                    from_page_number: String(page),
                                    language: 'zh-Hant'
                                });
                                compResults.push(`頁${page} size${size}: ${result.code === 0 ? '成功' : '失敗'}`);
                                await delay(delayMs);
                            }
                        }
                        results.push(...compResults);
                        break;

                    case 'max':
                        const maxResult = await fetchAPI({
                            SPC_CDS_VER: '2',
                            page_number: '1',
                            page_size: '200',
                            cursor: '0',
                            from_page_number: '1',
                            language: 'zh-Hant'
                        });
                        results.push(`最大值測試: ${maxResult.code === 0 ? '成功' : '失敗'} (${maxResult.data?.list?.length || 0}條數據)`);
                        break;
                }

                const totalTime = Date.now() - startTime;
                results.unshift(`測試類型: ${testType.toUpperCase()}`);
                results.push(`總耗時: ${totalTime}ms`);

                resultEl.textContent = results.join('\n');
            } catch (e) {
                resultEl.textContent = `測試失敗: ${e.message}`;
            }
        }

        copyTestResult() {
            const result = $('.test-result', this.panel).textContent;
            navigator.clipboard.writeText(result).then(() => {
                this.showToast('測試結果已複製');
            });
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new UIManager());
    } else {
        new UIManager();
    }

})();
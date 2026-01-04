// ==UserScript==
// @name         Bilibili 观看历史智能分析
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  分析 Bilibili 观看历史，支持筛选和 LLM 智能总结
// @author       B站·忘月沁
// @match        https://www.bilibili.com/history*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.bilibili.com
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js
// @require      https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552046/Bilibili%20%E8%A7%82%E7%9C%8B%E5%8E%86%E5%8F%B2%E6%99%BA%E8%83%BD%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/552046/Bilibili%20%E8%A7%82%E7%9C%8B%E5%8E%86%E5%8F%B2%E6%99%BA%E8%83%BD%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 忘月沁

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    console.log('[Bilibili History Analyzer] 脚本已加载');

    // ==================== 样式定义 ====================
    const mainStyles = `
        .bha-trigger-btn {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            opacity: 0.8;
        }
        .bha-trigger-btn:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.05);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .bha-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            backdrop-filter: blur(4px);
        }
        .bha-modal-overlay.active {
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .bha-modal {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 700px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .bha-modal-header {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #333;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .bha-form-group {
            margin-bottom: 20px;
        }
        .bha-form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
            font-size: 14px;
        }
        .bha-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }
        .bha-input:focus {
            outline: none;
            border-color: #667eea;
        }
        .bha-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .bha-section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
        }
        .bha-section-title .toggle-icon {
            transition: transform 0.3s ease;
        }
        .bha-section-title .toggle-icon.collapsed {
            transform: rotate(-90deg);
        }
        .bha-section-subtitle {
            font-size: 12px;
            color: #888;
            margin-left: auto;
            font-weight: 400;
        }
        .bha-section-hint {
            font-size: 12px;
            color: #888;
            margin-top: -8px;
            margin-bottom: 12px;
        }
        .bha-collapsible-content {
            max-height: 500px;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
            opacity: 1;
        }
        .bha-collapsible-content.collapsed {
            max-height: 0;
            opacity: 0;
            padding-top: 0;
            padding-bottom: 0;
        }

        /* 历史记录收起/展开 */
        .bha-history-list {
            margin-top: 20px;
            max-height: 300px;
            overflow-y: auto;
            transition: max-height 0.3s ease, opacity 0.3s ease;
        }
        .bha-history-list.collapsed {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            margin-top: 0;
        }
        .bha-history-item {
            background: white;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }
        .bha-history-item:hover {
            border-color: #667eea;
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }
        .bha-history-item-content {
            flex: 1;
            min-width: 0;
        }
        .bha-history-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        .bha-history-item-time {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            white-space: nowrap;
        }
        .bha-history-item-filter {
            font-size: 12px;
            color: #888;
            overflow: hidden;
        }
        .bha-history-item-actions {
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }
        .bha-delete-btn {
            background: #ff4757;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        .bha-delete-btn:hover {
            background: #ee5a6f;
            transform: scale(1.05);
        }

        /* 优化的日期选择器 - 修改为单列布局 */
        .bha-date-range {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
            margin-top: 16px;
        }
        .bha-date-input-wrapper {
            position: relative;
        }
        .bha-date-input-wrapper::before {
            content: '📅';
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            pointer-events: none;
            z-index: 1;
        }
        .bha-date-input {
            width: 100%;
            padding: 12px 12px 12px 40px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            background: white;
            color: #333;
        }
        .bha-date-input:hover {
            border-color: #b8b8b8;
        }
        .bha-date-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .bha-date-input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.3s ease;
        }
        .bha-date-input::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
        }
        .bha-date-label {
            font-size: 12px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 6px;
            display: block;
        }
        .bha-date-hint {
            font-size: 12px;
            color: #888;
            margin-top: -8px;
            padding: 8px 12px;
            background: rgba(102, 126, 234, 0.05);
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }
        .bha-date-error {
            color: #ff4757;
            font-size: 12px;
            margin-top: -8px;
            padding: 8px 12px;
            background: rgba(255, 71, 87, 0.05);
            border-radius: 6px;
            border-left: 3px solid #ff4757;
        }

        /* 美化筛选条件 */
        .bha-filter-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }
        .bha-filter-card {
            background: white;
            border-radius: 10px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        .bha-filter-card:hover {
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
            transform: translateY(-2px);
        }
        .bha-filter-card-title {
            font-size: 14px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .bha-radio-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .bha-radio-item {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 10px;
            border-radius: 6px;
            transition: background 0.2s ease;
            font-size: 13px;
        }
        .bha-radio-item:hover {
            background: #f0f0f0;
        }
        .bha-radio-item input {
            margin-right: 8px;
            cursor: pointer;
            accent-color: #667eea;
        }
        .bha-btn-group {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
        .bha-btn {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .bha-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .bha-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .bha-btn-secondary {
            background: #e0e0e0;
            color: #666;
        }
        .bha-btn-secondary:hover {
            background: #d0d0d0;
        }

        /* 加载状态 */
        .bha-loading {
            text-align: center;
            padding: 20px;
        }
        .bha-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .bha-loading-subtitle {
            font-size: 12px;
            color: #888;
            margin-top: 8px;
        }
        .bha-filter-tag {
            display: inline-block;
            background: white;
            padding: 4px 10px;
            border-radius: 4px;
            margin-right: 8px;
            margin-bottom: 4px;
            font-weight: 500;
            border: 1px solid #e0e0e0;
        }

        /* 新增确认对话框样式 */
        .bha-confirm-modal {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
            text-align: center;
        }
        .bha-confirm-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .bha-confirm-title {
            font-size: 24px;
            font-weight: 700;
            color: #333;
            margin-bottom: 16px;
        }
        .bha-confirm-message {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .bha-confirm-warning {
            font-size: 14px;
            color: #ff9800;
            background: #fff3e0;
            padding: 12px;
            border-radius: 8px;
            margin: 16px 0 24px;
            border-left: 4px solid #ff9800;
        }
        .bha-confirm-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .bha-confirm-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
        }
        .bha-confirm-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .bha-confirm-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .bha-confirm-btn-secondary {
            background: #e0e0e0;
            color: #666;
        }
        .bha-confirm-btn-secondary:hover {
            background: #d0d0d0;
        }
    `;

    // 注入样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mainStyles;
    document.head.appendChild(styleSheet);

    // ==================== 工具函数 ====================

    // 获取时间戳范围
    function getTimeRange(type, customStart, customEnd) {
        const now = Date.now();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStart = Math.floor(today.getTime() / 1000);

        switch(type) {
            case 'today':
                return { start: todayStart, end: 0 };
            case 'yesterday':
                return {
                    start: todayStart - 86400,
                    end: todayStart - 1
                };
            case 'beforeYesterday':
                return {
                    start: todayStart - 172800,
                    end: todayStart - 86400 - 1
                };
            case 'custom':
                if (customStart && customEnd) {
                    const startDate = new Date(customStart);
                    startDate.setHours(0, 0, 0, 0);
                    const endDate = new Date(customEnd);
                    endDate.setHours(23, 59, 59, 999);
                    return {
                        start: Math.floor(startDate.getTime() / 1000),
                        end: Math.floor(endDate.getTime() / 1000)
                    };
                }
                return null;
            default:
                return null;
        }
    }

    // 验证日期范围
    function validateDateRange(startDate, endDate) {
        if (!startDate || !endDate) {
            return { valid: false, message: '请选择开始和结束日期' };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return { valid: false, message: '开始日期不能晚于结束日期' };
        }

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 30) {
            return { valid: false, message: '时间跨度不能超过30天' };
        }

        return { valid: true };
    }

    // 获取时长参数
    function getDurationParams(type) {
        switch(type) {
            case 'short':
                return { arc_max_duration: 599 };
            case 'medium':
                return { arc_min_duration: 600, arc_max_duration: 1800 };
            case 'long':
                return { arc_min_duration: 1801, arc_max_duration: 3600 };
            case 'veryLong':
                return { arc_min_duration: 3601 };
            default:
                return {};
        }
    }

    // 格式化时间
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // 格式化筛选条件文本
    function formatFilters(filters) {
        const parts = [];

        const timeRangeMap = {
            'today': '今天',
            'yesterday': '昨天',
            'beforeYesterday': '前天',
            'custom': '自定义'
        };
        const timeRange = getTimeRange(filters.timeRange, filters.customStartDate, filters.customEndDate);
        let timeText = timeRangeMap[filters.timeRange] || '自定义';
        if (timeRange && timeRange.start) {
            const startTime = formatTime(timeRange.start);
            const endTime = timeRange.end ? formatTime(timeRange.end) : formatTime(Math.floor(Date.now() / 1000));
            timeText += ` (${startTime} - ${endTime})`;
        }
        parts.push(`<span class="bha-filter-tag">📅 ${timeText}</span>`);

        const durationMap = {
            'all': '全部时长',
            'short': '10分钟以下',
            'medium': '10-30分钟',
            'long': '30-60分钟',
            'veryLong': '60分钟以上'
        };
        parts.push(`<span class="bha-filter-tag">⏱️ ${durationMap[filters.duration] || '全部时长'}</span>`);

        const deviceMap = {
            'all': '全部设备',
            'pc': '电脑端',
            'mobile': '手机端'
        };
        parts.push(`<span class="bha-filter-tag">💻 ${deviceMap[filters.deviceType] || '全部设备'}</span>`);

        return parts.join('');
    }

    // ==================== 缓存管理 ====================

    function saveAnalysisRecord(filters, stats, videos, llmResult = '尚未生成成功', llmConfig = null) {
        const records = JSON.parse(GM_getValue('analysisRecords', '[]'));
        const record = {
            id: Date.now(),
            timestamp: Date.now(),
            filters: filters,
            stats: stats,
            videoCount: videos.length,
            videos: videos,
            llmResult: llmResult,
            llmConfig: llmConfig
        };
        records.unshift(record);
        if (records.length > 20) {
            records.pop();
        }
        GM_setValue('analysisRecords', JSON.stringify(records));
        return record.id;
    }

    function updateLLMResult(recordId, llmResult) {
        const records = JSON.parse(GM_getValue('analysisRecords', '[]'));
        const record = records.find(r => r.id === recordId);
        if (record) {
            record.llmResult = llmResult;
            GM_setValue('analysisRecords', JSON.stringify(records));
        }
    }

    function deleteAnalysisRecord(recordId) {
        const records = JSON.parse(GM_getValue('analysisRecords', '[]'));
        const filteredRecords = records.filter(r => r.id !== recordId);
        GM_setValue('analysisRecords', JSON.stringify(filteredRecords));
    }

    function getAnalysisRecords() {
        return JSON.parse(GM_getValue('analysisRecords', '[]'));
    }

    // ==================== API 请求 ====================

    function fetchHistoryPage(pn, filters) {
        return new Promise((resolve, reject) => {
            let url = `https://api.bilibili.com/x/web-interface/history/search?keyword=&business=all&ps=20&pn=${pn}`;

            if (filters.deviceType !== 'all') {
                const deviceMap = { pc: 1, mobile: 2 };
                url += `&device_type=${deviceMap[filters.deviceType]}`;
            }

            if (filters.timeRange !== 'all') {
                const timeRange = getTimeRange(filters.timeRange, filters.customStartDate, filters.customEndDate);
                if (timeRange) {
                    url += `&add_time_start=${timeRange.start}&add_time_end=${timeRange.end}`;
                }
            }

            if (filters.duration !== 'all') {
                const durationParams = getDurationParams(filters.duration);
                Object.keys(durationParams).forEach(key => {
                    url += `&${key}=${durationParams[key]}`;
                });
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(result.message || '请求失败'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    async function fetchAllHistory(filters, onProgress) {
        const allVideos = [];
        let currentPage = 1;
        let totalCount = 0;
        let consecutiveErrors = 0;
        const maxConsecutiveErrors = 3;

        try {
            const firstPage = await fetchHistoryPage(currentPage, filters);

            if (!firstPage.list || firstPage.list.length === 0) {
                return allVideos;
            }

            totalCount = firstPage.page?.total || firstPage.list.length;
            allVideos.push(...firstPage.list);
            onProgress?.(allVideos.length, totalCount);

            if (totalCount > 20) {
                const remainingPages = Math.ceil((totalCount - 20) / 20);

                for (let i = 1; i <= remainingPages; i++) {
                    currentPage++;
                    try {
                        const pageData = await fetchHistoryPage(currentPage, filters);
                        if (pageData.list && pageData.list.length > 0) {
                            allVideos.push(...pageData.list);
                            onProgress?.(allVideos.length, totalCount, pageData.list);
                            consecutiveErrors = 0; // 重置连续错误计数
                        } else {
                            break;
                        }
                    } catch (error) {
                        console.error(`第 ${currentPage} 页请求失败:`, error);
                        consecutiveErrors++;

                        if (consecutiveErrors >= maxConsecutiveErrors) {
                            console.error(`连续 ${maxConsecutiveErrors} 次请求失败，停止获取`);
                            throw new Error(`数据获取过程中出现多次错误，已获取 ${allVideos.length}/${totalCount} 条数据`);
                        }

                        // 等待一段时间后重试
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        i--; // 重试当前页
                    }
                }
            }

            return allVideos;
        } catch (error) {
            if (allVideos.length > 0) {
                // 如果已经获取到部分数据，返回已获取的数据而不是完全失败
                console.warn(`获取历史记录时出错，返回已获取的 ${allVideos.length} 条数据`);
                return allVideos;
            }
            throw error;
        }
    }

// 新增：分块处理LLM请求（简化版，不要求JSON输出）
async function callLLMWithChunking(apiUrl, apiToken, model, historyData, filters) {
    const CHUNK_SIZE = 1000;
    const chunks = [];

    // 分块
    for (let i = 0; i < historyData.length; i += CHUNK_SIZE) {
        chunks.push(historyData.slice(i, i + CHUNK_SIZE));
    }

    console.log(`[LLM] 数据量: ${historyData.length}, 分成 ${chunks.length} 个块处理`);

    // 生成时间和筛选条件描述
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = Math.floor(today.getTime() / 1000);

    let timeDesc = '';
    if (filters.timeRange === 'today') {
        timeDesc = `今天（${formatTime(todayStart)} 至 当前时间）`;
    } else if (filters.timeRange === 'yesterday') {
        timeDesc = `昨天（${formatTime(todayStart - 86400)} 至 ${formatTime(todayStart - 1)}）`;
    } else if (filters.timeRange === 'beforeYesterday') {
        timeDesc = `前天（${formatTime(todayStart - 172800)} 至 ${formatTime(todayStart - 86401)}）`;
    } else if (filters.timeRange === 'custom' && filters.customStartDate && filters.customEndDate) {
        const timeRange = getTimeRange('custom', filters.customStartDate, filters.customEndDate);
        const startStr = formatTime(timeRange.start);
        const endStr = formatTime(timeRange.end);
        timeDesc = `自定义（${startStr} 至 ${endStr}）`;
    } else {
        timeDesc = '全部时间';
    }

    const durationTextMap = {
        'all': '全部时长（无限制）',
        'short': '10分钟以下',
        'medium': '10-30分钟',
        'long': '30-60分钟',
        'veryLong': '60分钟以上'
    };
    const durationDesc = durationTextMap[filters.duration] || '全部时长（无限制）';
    let errorData;
    try {
        // 阶段一：并行处理所有块的摘要（只要文本，不要求JSON）
        updateLoadingMessage(`正在进行 AI 分析（阶段 1/2）：处理 ${chunks.length} 个数据块...`);
        const chunkSummaryPromises = chunks.map(async (chunk, index) => {
            const chunkData = chunk.map(v => ({
                标题: v.title,
                时长: `${Math.floor(v.duration / 60)}分钟`,
                进度: v.progress === -1 ? '未观看' : `${Math.floor(v.progress / 60)}分钟`,
                完成度: v.progress === -1 ? '未观看' : `${((v.progress / v.duration) * 100).toFixed(1)}%`,
                分类: v.tag_name || '未知',
                UP主: v.author_name,
                观看时间: formatTime(v.view_at)
            }));

            const chunkPrompt = `请分析以下观看历史数据块（第 ${index + 1}/${chunks.length} 块，共 ${chunk.length} 条），用自然语言总结其观看行为特征。

数据块：
${JSON.stringify(chunkData, null, 2)}

请从以下角度进行简要分析：
- 观看时段分布
- 内容分类偏好
- 观看完成度情况
- 总观看时长估算
- 是否有突出的UP主或内容类型
- 其他值得注意的观看习惯
ps:进度/完成度如果为"-1"则表示未观看
请用清晰、简洁的中文回答。`;

            try {
                const result = await callSingleLLMRequest(apiUrl, apiToken, model, chunkPrompt);
                return result.trim(); // 直接返回原始文本
            } catch (error) {
                errorData = error;
                console.error(`块 ${index + 1} 请求失败:`, error);
                return null;
            }
        });

        const chunkSummaries = await Promise.all(chunkSummaryPromises);
        const validSummaries = chunkSummaries.filter(s => s !== null && s.trim() !== '');

        if (validSummaries.length === 0) {
            throw new Error('所有数据块分析都失败了:'+errorData.message);
        }

        // 阶段二：聚合总结
        updateLoadingMessage('正在进行 AI 分析（阶段 2/2）：生成综合分析报告...');
        const aggregatePrompt = `【分析条件说明】
本次分析基于用户的筛选条件：
- 时间范围：${timeDesc}
- 视频时长：${durationDesc}
- 数据总量：${historyData.length} 条观看记录（分 ${chunks.length} 块处理）

以下是各数据块的分析摘要（每段来自一个数据块）：
${validSummaries.map((s, i) => `--- 块 ${i + 1} ---\n${s}`).join('\n\n')}

请基于以上所有摘要，生成一份**分析报告**。要求：
1. 观看时段偏好（什么时间段观看最多）
2. 内容分类偏好（最喜欢看什么类型的视频）
3. 观看完成度分析（是否倾向于看完视频）
4. UP主偏好（是否有特别关注的UP主）
5. 视频时长偏好
6. 其他有趣的观看习惯

请用中文清晰、有条理地锐评分析报告，语言要生动有趣。请使用 Markdown 格式。。`;

        const finalResult = await callSingleLLMRequest(apiUrl, apiToken, model, aggregatePrompt);
        return finalResult;

    } catch (error) {
        console.error('[LLM] 分块处理失败:', error);
        throw error;
    }
}

    // 单个LLM请求
    function callSingleLLMRequest(apiUrl, apiToken, model, prompt) {
        return new Promise((resolve, reject) => {
            const requestData = {
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        console.log("result",result)
                        if (response.status === 200 && result.choices && result.choices[0]) {
                            resolve(result.choices[0].message.content);
                        } else {
                            const errorMsg = result.message || '未知错误';
                            reject(new Error(errorMsg));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    function callLLM(apiUrl, apiToken, model, historyData, filters) {
        // 如果数据量超过1000条，使用分块处理
        if (historyData.length > 1000) {
            return callLLMWithChunking(apiUrl, apiToken, model, historyData, filters);
        }

        // 原有的简单处理逻辑
        return new Promise((resolve, reject) => {
            const summary = historyData.map(v => ({
                标题: v.title,
                时长: `${Math.floor(v.duration / 60)}分钟`,
                进度: `${Math.floor(v.progress / 60)}分钟`,
                完成度: `${((v.progress / v.duration) * 100).toFixed(1)}%`,
                分类: v.tag_name || '未知',
                UP主: v.author_name,
                观看时间: formatTime(v.view_at)
            })).slice(0, 100);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStart = Math.floor(today.getTime() / 1000);
            let timeDesc = '';
            if (filters.timeRange === 'today') {
                timeDesc = `今天（${formatTime(todayStart)} 至 当前时间）`;
            } else if (filters.timeRange === 'yesterday') {
                timeDesc = `昨天（${formatTime(todayStart - 86400)} 至 ${formatTime(todayStart - 1)}）`;
            } else if (filters.timeRange === 'beforeYesterday') {
                timeDesc = `前天（${formatTime(todayStart - 172800)} 至 ${formatTime(todayStart - 86401)}）`;
            } else if (filters.timeRange === 'custom' && filters.customStartDate && filters.customEndDate) {
                const timeRange = getTimeRange('custom', filters.customStartDate, filters.customEndDate);
                const startStr = formatTime(timeRange.start);
                const endStr = formatTime(timeRange.end);
                timeDesc = `自定义（${startStr} 至 ${endStr}）`;
            } else {
                timeDesc = '全部时间';
            }

            const durationTextMap = {
                'all': '全部时长（无限制）',
                'short': '10分钟以下',
                'medium': '10-30分钟',
                'long': '30-60分钟',
                'veryLong': '60分钟以上'
            };
            const durationDesc = durationTextMap[filters.duration] || '全部时长（无限制）';

            const conditionNote = `【分析条件说明】
本次分析所用的观看历史数据，基于以下用户筛选条件：
- 时间范围：${timeDesc}
- 视频时长：${durationDesc}

`;

            const prompt = `${conditionNote}请分析以下用户的 Bilibili 观看历史数据（共 ${historyData.length} 条记录），总结其观看习惯：

数据：
${JSON.stringify(summary, null, 2)}

请从以下角度进行分析：
1. 观看时段偏好（什么时间段观看最多）
2. 内容分类偏好（最喜欢看什么类型的视频）
3. 观看完成度分析（是否倾向于看完视频）
4. UP主偏好（是否有特别关注的UP主）
5. 视频时长偏好
6. 其他有趣的观看习惯

请用中文清晰、有条理地锐评分析报告，语言要生动有趣。请使用 Markdown 格式。
ps:进度/完成度如果为"-1"则表示未观看`;

            const requestData = {
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (response.status === 200 && result.choices && result.choices[0]) {
                            resolve(result.choices[0].message.content);
                        } else {
                            const errorMsg = result.error?.message || '未知错误';
                            reject(new Error(errorMsg));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // ==================== 数据分析 ====================

    function analyzeHistory(videos) {
        const totalVideos = videos.length;
        const totalWatchTime = videos.reduce((sum, v) => sum + v.progress, 0);
        const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);
        const avgCompletion = totalDuration > 0 ? (totalWatchTime / totalDuration * 100).toFixed(1) : 0;
        const favCount = videos.filter(v => v.is_fav).length;
        const favRate = totalVideos > 0 ? (favCount / totalVideos * 100).toFixed(1) : 0;

        const hourDist = new Array(24).fill(0);
        const hourVideos = new Array(24).fill(null).map(() => []);
        videos.forEach(v => {
            const hour = new Date(v.view_at * 1000).getHours();
            hourDist[hour]++;
            hourVideos[hour].push(v);
        });

        const categoryMap = {};
        videos.forEach(v => {
            const cat = v.tag_name || '未分类';
            if (cat !== '未分类') {
                categoryMap[cat] = (categoryMap[cat] || 0) + 1;
            }
        });
        const topCategories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

        return {
            totalVideos,
            totalWatchTime,
            totalDuration,
            avgCompletion,
            favCount,
            favRate,
            hourDist,
            hourVideos,
            categoryMap,
            topCategories
        };
    }

    // ==================== UI 构建 ====================

    function createTriggerButton() {
        const btn = document.createElement('button');
        btn.className = 'bha-trigger-btn';
        btn.textContent = '📊 历史分析';
        btn.addEventListener('click', showConfigModal);
        document.body.appendChild(btn);
    }

    function showConfigModal() {
        const overlay = document.createElement('div');
        overlay.className = 'bha-modal-overlay active';

        const records = getAnalysisRecords();
        const historySection = records.length > 0 ? `
            <div class="bha-section">
                <div class="bha-section-title" id="history-toggle">
                    <span class="toggle-icon collapsed">▼</span>
                    📜 历史分析记录
                </div>
                <div class="bha-history-list collapsed" id="history-list">
                    ${records.map(record => `
                        <div class="bha-history-item">
                            <div class="bha-history-item-content" data-record-id="${record.id}">
                                <div class="bha-history-item-header">
                                    <div class="bha-history-item-time">${new Date(record.timestamp).toLocaleString('zh-CN')}</div>
                                </div>
                                <div class="bha-history-item-filter">${formatFilters(record.filters)}</div>
                            </div>
                            <div class="bha-history-item-actions">
                                <button class="bha-delete-btn" data-record-id="${record.id}">🗑️ 删除</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        overlay.innerHTML = `
            <div class="bha-modal" onclick="event.stopPropagation()">
                <div class="bha-modal-header">
                    <span>📊</span>
                    <span>观看历史智能分析</span>
                </div>

                ${historySection}

                <div class="bha-section">
                    <div class="bha-section-title" id="llm-toggle">
                        <span class="toggle-icon">▼</span>
                        🤖 AI 配置
                        <span class="bha-section-subtitle">（可选，符合 OpenAI 接口规范）</span>
                    </div>
                    <div class="bha-section-hint">配置 AI 后可获得智能分析锐评</div>
                    <div class="bha-collapsible-content" id="llm-content">
                        <div class="bha-form-group">
                            <label class="bha-form-label">API 地址</label>
                            <input type="text" class="bha-input" id="bha-api-url"
                                   placeholder="https://api.openai.com/v1/chat/completions"
                                   value="${GM_getValue('apiUrl', '')}">
                        </div>
                        <div class="bha-form-group">
                            <label class="bha-form-label">API Token</label>
                            <input type="password" class="bha-input" id="bha-api-token"
                                   placeholder="sk-xxxx"
                                   value="${GM_getValue('apiToken', '')}">
                        </div>
                        <div class="bha-form-group">
                            <label class="bha-form-label">模型名称</label>
                            <input type="text" class="bha-input" id="bha-model"
                                   placeholder="deepseek-ai/DeepSeek-V3.1-Terminus"
                                   value="${GM_getValue('model', '')}">
                        </div>
                    </div>
                </div>

                <div class="bha-section">
                    <div class="bha-section-title">🎯 筛选条件</div>
                    <div class="bha-filter-grid">
                        <div class="bha-filter-card">
                            <div class="bha-filter-card-title">⏱️ 视频时长</div>
                            <div class="bha-radio-group">
                                <label class="bha-radio-item">
                                    <input type="radio" name="duration" value="all" checked>
                                    全部时长
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="duration" value="short">
                                    10分钟以下
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="duration" value="medium">
                                    10-30分钟
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="duration" value="long">
                                    30-60分钟
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="duration" value="veryLong">
                                    60分钟以上
                                </label>
                            </div>
                        </div>

                        <div class="bha-filter-card">
                            <div class="bha-filter-card-title">📅 观看时间</div>
                            <div class="bha-radio-group">
                                <label class="bha-radio-item">
                                    <input type="radio" name="timeRange" value="today" checked>
                                    今天
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="timeRange" value="yesterday">
                                    昨天
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="timeRange" value="beforeYesterday">
                                    前天
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="timeRange" value="custom">
                                    自定义时间段
                                </label>
                            </div>
                            <div class="bha-date-range" id="date-range" style="display: none;">
                                <div class="bha-date-input-wrapper">
                                    <label class="bha-date-label">开始日期</label>
                                    <input type="date" class="bha-date-input" id="start-date">
                                </div>
                                <div class="bha-date-input-wrapper">
                                    <label class="bha-date-label">结束日期</label>
                                    <input type="date" class="bha-date-input" id="end-date">
                                </div>
                                <div class="bha-date-hint">💡 提示：最多可选择30天的时间范围</div>
                                <div class="bha-date-error" id="date-error" style="display: none;"></div>
                            </div>
                        </div>

                        <div class="bha-filter-card">
                            <div class="bha-filter-card-title">💻 设备类型</div>
                            <div class="bha-radio-group">
                                <label class="bha-radio-item">
                                    <input type="radio" name="deviceType" value="all" checked>
                                    全部设备
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="deviceType" value="pc">
                                    电脑端
                                </label>
                                <label class="bha-radio-item">
                                    <input type="radio" name="deviceType" value="mobile">
                                    手机端
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bha-btn-group">
                    <button class="bha-btn bha-btn-secondary" id="bha-cancel">取消</button>
                    <button class="bha-btn bha-btn-primary" id="bha-start">🚀 开始分析</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // LLM配置折叠功能
        const llmToggle = overlay.querySelector('#llm-toggle');
        const llmContent = overlay.querySelector('#llm-content');
        llmToggle.addEventListener('click', () => {
            llmContent.classList.toggle('collapsed');
            llmToggle.querySelector('.toggle-icon').classList.toggle('collapsed');
        });

        const historyToggle = overlay.querySelector('#history-toggle');
        const historyList = overlay.querySelector('#history-list');
        if (historyToggle && historyList) {
            historyToggle.addEventListener('click', () => {
                historyList.classList.toggle('collapsed');
                historyToggle.querySelector('.toggle-icon').classList.toggle('collapsed');
            });
        }

        overlay.querySelectorAll('.bha-history-item-content').forEach(item => {
            item.addEventListener('click', () => {
                const recordId = parseInt(item.dataset.recordId);
                const record = records.find(r => r.id === recordId);
                if (record) {
                    document.body.removeChild(overlay);
                    showResultModalFromCache(record);
                }
            });
        });

        overlay.querySelectorAll('.bha-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recordId = parseInt(btn.dataset.recordId);
                if (confirm('确定要删除这条分析记录吗？')) {
                    deleteAnalysisRecord(recordId);
                    document.body.removeChild(overlay);
                    showConfigModal();
                }
            });
        });

        const timeRangeRadios = overlay.querySelectorAll('input[name="timeRange"]');
        const dateRangeDiv = overlay.querySelector('#date-range');
        const startDateInput = overlay.querySelector('#start-date');
        const endDateInput = overlay.querySelector('#end-date');
        const dateError = overlay.querySelector('#date-error');

        timeRangeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'custom') {
                    dateRangeDiv.style.display = 'grid';
                } else {
                    dateRangeDiv.style.display = 'none';
                    dateError.style.display = 'none';
                }
            });
        });

        function validateDates() {
            const validation = validateDateRange(startDateInput.value, endDateInput.value);
            if (!validation.valid) {
                dateError.textContent = '❌ ' + validation.message;
                dateError.style.display = 'block';
                return false;
            } else {
                dateError.style.display = 'none';
                return true;
            }
        }

        startDateInput.addEventListener('change', validateDates);
        endDateInput.addEventListener('change', validateDates);

        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.querySelector('#bha-cancel').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.querySelector('#bha-start').addEventListener('click', async () => {
            const apiUrl = overlay.querySelector('#bha-api-url').value.trim();
            const apiToken = overlay.querySelector('#bha-api-token').value.trim();
            const model = overlay.querySelector('#bha-model').value.trim();

            // LLM配置为可选
            const hasLLMConfig = apiUrl && apiToken && model;

            if (hasLLMConfig) {
                GM_setValue('apiUrl', apiUrl);
                GM_setValue('apiToken', apiToken);
                GM_setValue('model', model);
            }

            const timeRange = overlay.querySelector('input[name="timeRange"]:checked').value;

            if (timeRange === 'custom') {
                if (!validateDates()) {
                    return;
                }
            }

            const filters = {
                duration: overlay.querySelector('input[name="duration"]:checked').value,
                timeRange: timeRange,
                deviceType: overlay.querySelector('input[name="deviceType"]:checked').value,
                customStartDate: startDateInput.value,
                customEndDate: endDateInput.value
            };

            const llmConfig = hasLLMConfig ? { apiUrl, apiToken, model } : null;

            // 先获取第一页数据以判断总数
            try {
                const firstPage = await fetchHistoryPage(1, filters);
                const totalCount = firstPage.page?.total || firstPage.list?.length || 0;

                if (totalCount === 0) {
                    alert('没有找到符合条件的观看记录！');
                    return;
                }

                // 如果超过1000条，显示确认对话框
                if (totalCount > 1000) {
                    document.body.removeChild(overlay);
                    const shouldContinue = await showConfirmDialog(totalCount, hasLLMConfig);
                    if (!shouldContinue) {
                        showConfigModal(); // 重新显示配置页面
                        return;
                    }
                } else {
                    document.body.removeChild(overlay);
                }

                startAnalysis(llmConfig, filters);
            } catch (error) {
                alert('获取历史记录失败: ' + error.message);
            }
        });
    }

    // 新增：显示确认对话框
    function showConfirmDialog(totalCount, hasLLM) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'bha-modal-overlay active';

            const estimatedTime = Math.ceil(totalCount / 200); // 估算时间（秒）
            const timeText = estimatedTime > 60
                ? `${Math.ceil(estimatedTime / 60)} 分钟`
                : `${estimatedTime} 秒`;

            overlay.innerHTML = `
                <div class="bha-confirm-modal" onclick="event.stopPropagation()">
                    <div class="bha-confirm-icon">⚠️</div>
                    <div class="bha-confirm-title">数据量较大</div>
                    <div class="bha-confirm-message">
                        当前筛选条件下有 <strong>${totalCount.toLocaleString()}</strong> 条历史记录
                    </div>
                    <div class="bha-confirm-warning">
                        📊 获取数据预计需要 ${timeText}<br>
                        ${hasLLM ? '🤖 AI 分析可能需要额外 1-3 分钟<br>' : ''}
                        💡 建议：可以缩小时间范围或筛选条件以减少数据量
                    </div>
                    <div class="bha-confirm-buttons">
                        <button class="bha-confirm-btn bha-confirm-btn-secondary" id="confirm-cancel">返回修改</button>
                        <button class="bha-confirm-btn bha-confirm-btn-primary" id="confirm-continue">继续分析</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            overlay.querySelector('#confirm-cancel').addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });

            overlay.querySelector('#confirm-continue').addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(true);
            });

            overlay.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });
        });
    }

    function showLoadingModal(message, hasLLM = true) {
        const overlay = document.createElement('div');
        overlay.className = 'bha-modal-overlay active';
        overlay.id = 'bha-loading-overlay';
        overlay.innerHTML = `
            <div class="bha-modal" onclick="event.stopPropagation()" style="max-width: 600px;">
                <div class="bha-loading">
                    <div class="bha-spinner"></div>
                    <div id="bha-loading-message">${message}</div>
                    ${!hasLLM ? '<div class="bha-loading-subtitle">未配置 AI 锐评</div>' : ''}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        return overlay;
    }

    function updateLoadingMessage(message) {
        const msgEl = document.querySelector('#bha-loading-message');
        if (msgEl) msgEl.textContent = message;
    }

    function showResultModalFromCache(record) {
        // 动态加载结果展示模块
        loadResultModule().then(resultModule => {
            resultModule.showResultModalFromCache(record, {
                formatFilters: formatFilters,
                formatTime: formatTime
            });
        });
    }

    async function startAnalysis(llmConfig, filters) {
        const hasLLM = llmConfig && llmConfig.apiUrl && llmConfig.apiToken && llmConfig.model;
        let loadingOverlay = showLoadingModal('正在拉取历史记录...', hasLLM);
        let allVideos = [];

        try {
            allVideos = await fetchAllHistory(filters, (current, total) => {
                updateLoadingMessage(`正在拉取历史记录... ${current}/${total}`);
            });

            if (allVideos.length === 0) {
                if (loadingOverlay) {
                    document.body.removeChild(loadingOverlay);
                }
                alert('没有找到符合条件的观看记录！');
                return;
            }

            updateLoadingMessage('正在分析数据...');
            const stats = analyzeHistory(allVideos);

            updateLoadingMessage('分析完成，准备展示结果...');
            await new Promise(resolve => setTimeout(resolve, 500));

            const recordId = saveAnalysisRecord(filters, stats, allVideos, hasLLM ? '尚未生成成功' : null, llmConfig);

            // 动态加载结果展示模块
            const resultModule = await loadResultModule();

            if (loadingOverlay) {
                document.body.removeChild(loadingOverlay);
            }

            // 显示结果
            const resultRecordId = resultModule.showResultModal({
                filters,
                stats,
                allVideos,
                recordId,
                llmConfig,
                formatFilters: formatFilters,
                formatTime: formatTime,
                updateLLMResult: updateLLMResult,
                callLLM: hasLLM ? callLLM : null
            });

        } catch (error) {
            if (loadingOverlay && document.body.contains(loadingOverlay)) {
                document.body.removeChild(loadingOverlay);
            }
            console.error('[Analysis] 分析失败:', error);
            alert('分析失败: ' + error.message);
        }
    }

    // 动态加载结果展示模块
    function loadResultModule() {
        return new Promise((resolve) => {
            // 这里直接包含结果展示模块的代码
            // 在实际使用中，可以通过 @require 或动态加载外部脚本
            resolve(window.BilibiliHistoryResultModule);
        });
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createTriggerButton);
    } else {
        createTriggerButton();
    }

    console.log('[Bilibili History Analyzer] 初始化完成');
})();










var TagJsonListStr = '[{"name":"知识教育","items":["知识","科学科普","社科·法律·心理","人文历史","财经商业","校园学习","职业职场","设计·创意","野生技能协会","公开课"]},{"name":"影视动漫","items":["番剧","连载动画","完结动画","资讯","官方延伸","新番时间表","番剧索引","国创","国产动画","国产原创相关","布袋戏","动态漫·广播剧","国产动画索引","电视剧","电影","动画","MAD·AMV","MMD·3D","短片·手书","配音","手办·模玩","特摄","动漫杂谈","综合"]},{"name":"游戏电竞","items":["游戏","单机游戏","电子竞技","手机游戏","网络游戏","桌游棋牌","GMV","音游","Mugen","游戏赛事"]},{"name":"音乐舞蹈","items":["音乐","原创音乐","翻唱","演奏","VOCALOID·UTAU","音乐现场","MV","乐评盘点","音乐教学","音乐综合","说唱","舞蹈","宅舞","街舞","明星舞蹈","国风舞蹈","手势·网红舞","舞蹈综合","舞蹈教程"]},{"name":"生活兴趣","items":["生活","搞笑","亲子","出行","三农","家居房产","手工","绘画","日常","美食","美食制作","美食侦探","美食测评","田园美食","美食记录","VLOG"]},{"name":"科技数码","items":["科技","数码","软件应用","计算机技术","科工机械","极客DIY"]},{"name":"娱乐文化","items":["综艺","鬼畜","鬼畜调教","音MAD","人力VOCALOID","鬼畜剧场","教程演示","娱乐","综艺","娱乐杂谈","粉丝创作","明星综合","时尚","美妆护肤","仿妆cos","穿搭","时尚潮流","虚拟UP主"]},{"name":"社会资讯","items":["资讯","热点","环球","社会","综合","影视","影视杂谈","影视剪辑","小剧场","短片","预告·资讯","纪录片","公益"]}]';














/**
 * Bilibili 观看历史分析 - 结果展示模块
 * 负责展示分析结果、导出功能等
 */

(function(window) {
    'use strict';

    // 配置 marked.js
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: false,
            mangle: false
        });
    }

    // ==================== 样式定义 ====================
    const resultStyles = `
        /* 视频轮播 */
        .bha-history-carousel {
            margin: 24px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }
        .bha-carousel-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #333;
            text-align: center;
        }
        .bha-carousel-wrapper {
            position: relative;
        }
        .bha-video-cards {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }
        .bha-video-card {
            display: flex;
            gap: 12px;
            background: white;
            border-radius: 12px;
            padding: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: slideInLeft 0.4s ease;
        }
        @keyframes slideInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .bha-video-card:hover {
            background: #e9ecef;
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .bha-video-cover {
            width: 120px;
            height: 75px;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
        }
        .bha-video-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 0;
        }
        .bha-video-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.4;
        }
        .bha-video-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: #888;
        }
        .bha-video-author {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .bha-carousel-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-top: 12px;
        }
        .bha-carousel-btn {
            background: white;
            border: 2px solid #667eea;
            color: #667eea;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        .bha-carousel-btn:hover {
            background: #667eea;
            color: white;
            transform: scale(1.1);
        }
        .bha-carousel-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
        .bha-carousel-dots {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            max-width: 400px;
        }
        .bha-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #d0d0d0;
            transition: all 0.3s ease;
            cursor: pointer;
            flex-shrink: 0;
        }
        .bha-dot.active {
            background: #667eea;
            width: 24px;
            border-radius: 4px;
        }
        .bha-dot.ellipsis {
            width: auto;
            padding: 0 4px;
            background: transparent;
            color: #888;
            cursor: default;
        }

        .bha-result-modal {
            max-width: 1200px;
        }

        /* 筛选条件展示 */
        .bha-filter-info {
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            border-left: 4px solid #667eea;
            padding: 16px 20px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        .bha-filter-info-title {
            font-size: 14px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 8px;
        }
        .bha-filter-info-content {
            font-size: 13px;
            color: #555;
            line-height: 1.6;
        }

        /* 统计卡片增加交互 */
        .bha-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }
        .bha-stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 12px;
            color: white;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .bha-stat-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(255,255,255,0.1);
            transform: rotate(45deg);
            transition: all 0.5s ease;
        }
        .bha-stat-card:hover::before {
            left: 100%;
        }
        .bha-stat-card:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
        .bha-stat-value {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        .bha-stat-label {
            font-size: 14px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        /* 紧凑型图表 */
        .bha-chart {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .bha-chart-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .bha-compact-bars {
            display: grid;
            grid-template-columns: repeat(24, 1fr);
            gap: 4px;
            margin-top: 16px;
        }
        .bha-compact-bar {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
        }
        .bha-compact-bar-wrapper {
            height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
        }
        .bha-compact-bar-fill {
            width: 100%;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px 4px 0 0;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        }
        .bha-compact-bar-fill:hover {
            filter: brightness(1.2);
            transform: scaleY(1.05);
        }
        .bha-compact-bar-label {
            font-size: 10px;
            color: #666;
            text-align: center;
            margin-top: 4px;
        }
        .bha-tooltip {
            position: absolute;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            min-width: 150px;
            text-align: left;
        }
        .bha-compact-bar:hover .bha-tooltip {
            opacity: 1;
        }
        .bha-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.9);
        }

        /* 横向滚动图表 */
        .bha-horizontal-scroll {
            overflow-x: auto;
            padding-bottom: 10px;
        }
        .bha-horizontal-scroll::-webkit-scrollbar {
            height: 8px;
        }
        .bha-horizontal-scroll::-webkit-scrollbar-track {
            background: #e0e0e0;
            border-radius: 4px;
        }
        .bha-horizontal-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 4px;
        }
        .bha-horizontal-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #5568d3 0%, #6a3d8f 100%);
        }
        .bha-bars-container {
            display: flex;
            gap: 12px;
            min-width: max-content;
        }
        .bha-bar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 60px;
        }
        .bha-bar-wrapper {
            height: 150px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 8px;
        }
        .bha-bar-fill {
            width: 40px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px 8px 0 0;
            transition: all 0.5s ease;
            position: relative;
            cursor: pointer;
        }
        .bha-bar-fill:hover {
            filter: brightness(1.2);
            transform: scaleY(1.05);
        }
        .bha-bar-value {
            position: absolute;
            top: -20px;
            font-size: 11px;
            font-weight: 600;
            color: #667eea;
        }
        .bha-bar-label {
            font-size: 12px;
            color: #666;
            text-align: center;
        }

        /* Markdown 样式 - 使用 marked.js 渲染 */
        .bha-llm-result {
            background: #fff;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            line-height: 1.8;
            color: #333;
            min-height: 100px;
        }
        .bha-llm-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #888;
        }
        .bha-llm-loading .bha-spinner {
            margin-bottom: 16px;
        }
        .bha-llm-no-config {
            text-align: center;
            padding: 40px;
            color: #999;
            font-style: italic;
        }
        .bha-llm-result h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 20px 0 12px 0;
            color: #667eea;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 8px;
        }
        .bha-llm-result h2 {
            font-size: 20px;
            font-weight: 600;
            margin: 16px 0 10px 0;
            color: #764ba2;
        }
        .bha-llm-result h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 14px 0 8px 0;
            color: #555;
        }
        .bha-llm-result p {
            margin: 10px 0;
        }
        .bha-llm-result ul, .bha-llm-result ol {
            margin: 10px 0;
            padding-left: 24px;
        }
        .bha-llm-result li {
            margin: 6px 0;
        }
        .bha-llm-result strong {
            color: #667eea;
            font-weight: 600;
        }
        .bha-llm-result code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            color: #e83e8c;
        }
        .bha-llm-result pre {
            background: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 12px 0;
        }
        .bha-llm-result pre code {
            background: none;
            padding: 0;
        }
        .bha-llm-result blockquote {
            border-left: 4px solid #667eea;
            padding-left: 16px;
            margin: 12px 0;
            color: #666;
            font-style: italic;
        }
        .bha-llm-result table {
            border-collapse: collapse;
            width: 100%;
            margin: 12px 0;
        }
        .bha-llm-result table th,
        .bha-llm-result table td {
            border: 1px solid #e0e0e0;
            padding: 8px 12px;
            text-align: left;
        }
        .bha-llm-result table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #667eea;
        }

        .bha-error {
            background: #fff0f0;
            border: 2px solid #ffcccc;
            color: #cc0000;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
        }

        /* 导出按钮 */
        .bha-export-group {
            display: flex;
            gap: 12px;
            margin-top: 12px;
        }
        .bha-export-btn {
            flex: 1;
            padding: 10px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .bha-export-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }

        /* 导出预览 */
        .bha-export-preview {
            position: fixed;
            top: 0;
            left: -99999px;
            background: white;
            width: 1200px;
            padding: 40px;
            box-sizing: border-box;
            visibility: hidden;
        }

        /* 通用样式继承 */
        .bha-modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10000;
            backdrop-filter: blur(4px);
        }
        .bha-modal-overlay.active {
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease;
        }
        .bha-modal {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 700px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        }
        .bha-modal-header {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #333;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .bha-btn-group {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
        .bha-btn {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .bha-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .bha-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .bha-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .bha-loading {
            text-align: center;
            padding: 20px;
        }
        .bha-filter-tag {
            display: inline-block;
            background: white;
            padding: 4px 10px;
            border-radius: 4px;
            margin-right: 8px;
            margin-bottom: 4px;
            font-weight: 500;
            border: 1px solid #e0e0e0;
        }
    `;

    // 注入样式
    const styleSheet = document.createElement('style');
    styleSheet.textContent = resultStyles;
    document.head.appendChild(styleSheet);

    // ==================== 工具函数 ====================

    function formatDuration(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}小时${m}分${s}秒`;
        if (m > 0) return `${m}分${s}秒`;
        return `${s}秒`;
    }

    function formatRelativeTime(timestamp) {
        const now = Date.now() / 1000;
        const diff = now - timestamp;

        if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`;

        const date = new Date(timestamp * 1000);
        return date.toLocaleString('zh-CN');
    }

    function parseMarkdown(text) {
        if (!text) return '';

        if (typeof marked !== 'undefined' && marked.parse) {
            try {
                return marked.parse(text);
            } catch (e) {
                console.error('Markdown 解析失败:', e);
                return text.replace(/\n/g, '<br>');
            }
        } else {
            console.warn('marked.js 未加载，使用纯文本替换');
            return text.replace(/\n/g, '<br>');
        }
    }

// ==================== 新增工具函数 ====================
    function calculateLoginDays(videos) {
        const days = new Set();
        videos.forEach(v => {
            const date = new Date(v.view_at * 1000);
            const dayStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
            days.add(dayStr);
        });
        return days.size;
    }

    // 新增：计算短视频和长视频统计
    function calculateVideoTypeStats(videos) {
        const SHORT_VIDEO_THRESHOLD = 300; // 5分钟（300秒）为短视频阈值

        let shortVideoCount = 0;
        let longVideoCount = 0;
        let shortVideoWatchTime = 0;
        let longVideoWatchTime = 0;

        videos.forEach(v => {
            const watchTime = Math.min(v.progress || 0, v.duration || 0);

            if (v.duration <= SHORT_VIDEO_THRESHOLD) {
                shortVideoCount++;
                shortVideoWatchTime += watchTime;
            } else {
                longVideoCount++;
                longVideoWatchTime += watchTime;
            }
        });

        const totalCount = shortVideoCount + longVideoCount;
        const totalWatchTime = shortVideoWatchTime + longVideoWatchTime;

        return {
            shortVideoCount,
            longVideoCount,
            shortVideoWatchTime,
            longVideoWatchTime,
            shortVideoCountRatio: totalCount > 0 ? ((shortVideoCount / totalCount) * 100).toFixed(1) : '0',
            longVideoCountRatio: totalCount > 0 ? ((longVideoCount / totalCount) * 100).toFixed(1) : '0',
            shortVideoTimeRatio: totalWatchTime > 0 ? ((shortVideoWatchTime / totalWatchTime) * 100).toFixed(1) : '0',
            longVideoTimeRatio: totalWatchTime > 0 ? ((longVideoWatchTime / totalWatchTime) * 100).toFixed(1) : '0'
        };
    }

    function mapToMajorCategories(videos, tagMappingJsonStr) {
        let tagMapping = [];
        try {
            tagMapping = JSON.parse(tagMappingJsonStr || '[]');
        } catch (e) {
            console.warn('TagJsonListStr 解析失败，使用空映射');
        }
        console.log("tagMapping",tagMapping)
        // 初始化大类计数
        const categoryCount = [];
        tagMapping.forEach(cat => {
            categoryCount[cat.name] = 0;
        });
        // 遍历视频，匹配小类到大类
        videos.forEach(v => {
            const tagName = v.tag_name || '未分类';
            let matched = false;
            console.log("tagName",tagName)
            for (const major of tagMapping) {
                if (major.items && major.items.includes(tagName)) {
                    categoryCount[major.name] = (categoryCount[major.name] || 0) + 1;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                // 可选：归入"其他"类，或忽略
                if (categoryCount['其他'] === undefined) categoryCount['其他'] = 0;
                categoryCount['其他']++;
            }
        });

        // 转为数组并按数量降序
        return Object.entries(categoryCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }

    // ==================== 导出功能（修复高度计算） ====================

    function calculateActualHeight(element) {
        // 先让元素完全展开
        const originalHeight = element.style.height;
        const originalMaxHeight = element.style.maxHeight;
        const originalOverflow = element.style.overflow;

        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        element.style.overflow = 'visible';

        // 强制重排
        element.offsetHeight;

        // 获取实际内容高度，使用多种方法确保准确
        const scrollHeight = element.scrollHeight;
        const offsetHeight = element.offsetHeight;
        const clientHeight = element.clientHeight;

        // 获取计算样式
        const computedStyle = window.getComputedStyle(element);
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
        const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

        // 计算所有子元素的实际高度
        let contentHeight = 0;
        const children = element.children;
        if (children.length > 0) {
            const lastChild = children[children.length - 1];
            const lastChildRect = lastChild.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            contentHeight = (lastChildRect.bottom - elementRect.top) + paddingBottom + borderBottom;
        }

        // 恢复原始样式
        element.style.height = originalHeight;
        element.style.maxHeight = originalMaxHeight;
        element.style.overflow = originalOverflow;

        // 取最大值并添加安全边距
        const heights = [scrollHeight, offsetHeight, contentHeight, clientHeight + paddingTop + paddingBottom + borderTop + borderBottom];
        const maxHeight = Math.max(...heights.filter(h => h > 0));

        // 添加额外的安全边距（约5%或至少50px）
        const safetyMargin = Math.max(maxHeight * 0.05, 50);
        const finalHeight = Math.ceil(maxHeight + safetyMargin);

        console.log('高度计算详情:', {
            scrollHeight,
            offsetHeight,
            clientHeight,
            contentHeight,
            maxHeight,
            safetyMargin,
            finalHeight
        });

        return finalHeight;
    }

    function waitForImagesToLoad(element) {
        return new Promise((resolve) => {
            const images = element.querySelectorAll('img');
            if (images.length === 0) {
                resolve();
                return;
            }

            let loadedCount = 0;
            const totalImages = images.length;

            const checkAllLoaded = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    setTimeout(resolve, 200);
                }
            };

            images.forEach(img => {
                if (img.complete) {
                    checkAllLoaded();
                } else {
                    img.addEventListener('load', checkAllLoaded);
                    img.addEventListener('error', checkAllLoaded);
                }
            });
        });
    }

    function showLoadingModal(message) {
        const overlay = document.createElement('div');
        overlay.className = 'bha-modal-overlay active';
        overlay.id = 'bha-export-loading';
        overlay.innerHTML = `
            <div class="bha-modal" onclick="event.stopPropagation()" style="max-width: 600px;">
                <div class="bha-loading">
                    <div class="bha-spinner"></div>
                    <div>${message}</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function exportContent(type) {
        const sourceElement = document.querySelector('.bha-result-modal');
        if (!sourceElement) return;

        const loadingOverlay = showLoadingModal(`正在生成${type === 'pdf' ? 'PDF' : '截图'}，请稍候...`);

        // 创建预览容器
        const previewDiv = document.createElement('div');
        previewDiv.className = 'bha-export-preview';
        document.body.appendChild(previewDiv);

        // 克隆元素
        const clonedElement = sourceElement.cloneNode(true);

        // 移除不需要的元素
        const carousel = clonedElement.querySelector('.bha-history-carousel');
        if (carousel) carousel.remove();

        const exportButtons = clonedElement.querySelector('.bha-export-group');
        if (exportButtons) exportButtons.remove();

        const closeButton = clonedElement.querySelector('#bha-close');
        if (closeButton && closeButton.parentElement) {
            closeButton.parentElement.remove();
        }
        const radarChartContainer = clonedElement.querySelector('#bha-radar-chart');
        if (radarChartContainer && typeof echarts !== 'undefined') {
            const originalRadar = document.getElementById('bha-radar-chart');
            if (originalRadar && echarts.getInstanceByDom(originalRadar)) {
                const chart = echarts.getInstanceByDom(originalRadar);
                const imgData = chart.getDataURL({ type: 'png', backgroundColor: '#ffffff' });
                radarChartContainer.innerHTML = `<img src="${imgData}" style="width:100%; height:500px; object-fit: contain; display:block;">`;
                radarChartContainer.style.height = '500px';
                radarChartContainer.style.minHeight = '500px';
            } else {
                radarChartContainer.style.height = '500px';
                radarChartContainer.style.minHeight = '500px';
                radarChartContainer.style.backgroundColor = '#f8f9fa';
                radarChartContainer.textContent = '雷达图（导出时未加载）';
            }
        } else if (radarChartContainer) {
            radarChartContainer.style.height = '500px';
            radarChartContainer.style.minHeight = '500px';
        }

        // 设置固定宽度和样式
        clonedElement.style.width = '1200px';
        clonedElement.style.maxWidth = '1200px';
        clonedElement.style.boxSizing = 'border-box';
        clonedElement.style.height = 'auto';
        clonedElement.style.maxHeight = 'none';
        clonedElement.style.overflow = 'visible';

        previewDiv.appendChild(clonedElement);

        // 使预览容器可见但在屏幕外
        previewDiv.style.position = 'fixed';
        previewDiv.style.left = '0';
        previewDiv.style.top = '0';
        previewDiv.style.visibility = 'visible';
        previewDiv.style.zIndex = '-1';

        // 等待渲染和图片加载
        waitForImagesToLoad(clonedElement).then(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    // 计算实际高度
                    const actualHeight = calculateActualHeight(clonedElement);

                    // 配置html2canvas选项
                    const canvasOptions = {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff',
                        width: 1200,
                        height: actualHeight,
                        windowWidth: 1200,
                        windowHeight: actualHeight,
                        scrollX: 0,
                        scrollY: 0,
                        x: 0,
                        y: 0,
                        onclone: (clonedDoc) => {
                            const clonedBody = clonedDoc.querySelector('.bha-export-preview .bha-result-modal');
                            if (clonedBody) {
                                clonedBody.style.height = actualHeight + 'px';
                                clonedBody.style.maxHeight = 'none';
                                clonedBody.style.overflow = 'visible';
                            }
                        }
                    };

                    html2canvas(clonedElement, canvasOptions).then(canvas => {
                        if (type === 'pdf') {
                            const imgData = canvas.toDataURL('image/png');
                            const pdf = new jspdf.jsPDF({
                                orientation: 'portrait',
                                unit: 'mm',
                                format: 'a4'
                            });

                            const imgWidth = 210;
                            const pageHeight = 297;
                            const imgHeight = (canvas.height * imgWidth) / canvas.width;
                            let heightLeft = imgHeight;
                            let position = 0;

                            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;

                            while (heightLeft >= 0) {
                                position = heightLeft - imgHeight;
                                pdf.addPage();
                                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                                heightLeft -= pageHeight;
                            }

                            pdf.save(`Bilibili分析报告_${new Date().toLocaleDateString()}.pdf`);
                        } else {
                            canvas.toBlob(blob => {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `Bilibili分析报告_${new Date().toLocaleDateString()}.png`;
                                a.click();
                                URL.revokeObjectURL(url);
                            });
                        }

                        // 清理
                        document.body.removeChild(previewDiv);
                        document.body.removeChild(loadingOverlay);
                    }).catch(error => {
                        console.error('导出失败:', error);
                        document.body.removeChild(previewDiv);
                        document.body.removeChild(loadingOverlay);
                        alert(`${type === 'pdf' ? 'PDF' : '截图'}生成失败，请重试`);
                    });
                }, 500); // 增加等待时间确保渲染完成
            });
        });
    }

    // ==================== 组件构建 ====================

    function createCarouselDots(container, totalPages, currentPage, onPageChange) {
        container.innerHTML = '';

        const maxDots = 7;

        if (totalPages <= maxDots) {
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('div');
                dot.className = 'bha-dot';
                if (i === currentPage) dot.classList.add('active');
                dot.addEventListener('click', () => onPageChange(i));
                container.appendChild(dot);
            }
        } else {
            const createDot = (index, isActive = false) => {
                const dot = document.createElement('div');
                dot.className = 'bha-dot';
                if (isActive) dot.classList.add('active');
                dot.addEventListener('click', () => onPageChange(index));
                return dot;
            };

            const createEllipsis = () => {
                const dot = document.createElement('div');
                dot.className = 'bha-dot ellipsis';
                dot.textContent = '...';
                return dot;
            };

            container.appendChild(createDot(0, currentPage === 0));

            if (currentPage > 2) {
                container.appendChild(createEllipsis());
            }

            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                container.appendChild(createDot(i, i === currentPage));
            }

            if (currentPage < totalPages - 3) {
                container.appendChild(createEllipsis());
            }

            container.appendChild(createDot(totalPages - 1, currentPage === totalPages - 1));
        }
    }

    function createHistoryCarousel(container, allVideos) {
        const carouselDiv = document.createElement('div');
        carouselDiv.className = 'bha-history-carousel';
        carouselDiv.innerHTML = `
            <div class="bha-carousel-title">📺 回顾你看过的精彩内容</div>
            <div class="bha-carousel-wrapper">
                <div class="bha-video-cards" id="bha-video-cards"></div>
                <div class="bha-carousel-controls">
                    <button class="bha-carousel-btn" id="bha-carousel-prev">◀</button>
                    <div class="bha-carousel-dots" id="bha-carousel-dots"></div>
                    <button class="bha-carousel-btn" id="bha-carousel-next">▶</button>
                </div>
            </div>
        `;
        container.appendChild(carouselDiv);

        const cardsContainer = carouselDiv.querySelector('#bha-video-cards');
        const dotsContainer = carouselDiv.querySelector('#bha-carousel-dots');
        const prevBtn = carouselDiv.querySelector('#bha-carousel-prev');
        const nextBtn = carouselDiv.querySelector('#bha-carousel-next');

        let currentPage = 0;
        const pageSize = 3;
        const totalPages = Math.ceil(allVideos.length / pageSize);
        let autoPlayInterval = null;
        let isManual = false;

        function showPage(pageIndex) {
            currentPage = pageIndex % totalPages;
            const start = currentPage * pageSize;
            const pageVideos = allVideos.slice(start, start + pageSize);

            cardsContainer.innerHTML = pageVideos.map(video => {
                const url = video.history?.bvid
                    ? `https://www.bilibili.com/video/${video.history.bvid}`
                    : `https://www.bilibili.com/video/av${video.history?.oid || ''}`;

                return `
                    <div class="bha-video-card" data-url="${url}">
                        <img src="${video.cover}" class="bha-video-cover" alt="封面">
                        <div class="bha-video-info">
                            <div class="bha-video-title">${video.title}</div>
                            <div class="bha-video-meta">
                                <span class="bha-video-author">👤 ${video.author_name}</span>
                                <span>•</span>
                                <span>⏰ ${formatRelativeTime(video.view_at)}</span>
                            </div>
                            <div class="bha-video-meta">
                                <span>📁 ${video.tag_name || '未分类'}</span>
                                <span>•</span>
                                <span>⏱️ ${formatDuration(video.duration)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            createCarouselDots(dotsContainer, totalPages, currentPage, showPage);

            cardsContainer.querySelectorAll('.bha-video-card').forEach(card => {
                card.addEventListener('click', () => {
                    window.open(card.dataset.url, '_blank');
                });
            });
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        function startAutoPlay() {
            if (!isManual) {
                autoPlayInterval = setInterval(() => {
                    showPage(currentPage + 1);
                }, 6000);
            }
        }

        showPage(0);
        startAutoPlay();

        prevBtn.addEventListener('click', () => {
            isManual = true;
            stopAutoPlay();
            showPage(currentPage - 1 < 0 ? totalPages - 1 : currentPage - 1);
        });

        nextBtn.addEventListener('click', () => {
            isManual = true;
            stopAutoPlay();
            showPage(currentPage + 1);
        });

        return () => stopAutoPlay();
    }

    function generateCompactHourChart(hourDist, hourVideos) {
        const maxCount = Math.max(...hourDist);
        return `
            <div class="bha-compact-bars">
                ${hourDist.map((count, hour) => {
                    const height = maxCount > 0 ? (count / maxCount * 80) : 0;

                    const videos = hourVideos[hour] || [];
                    const categoryCount = {};
                    videos.forEach(v => {
                        const cat = v.tag_name || '未分类';
                            if (cat !== '未分类') {
                                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
                            }
                    });
                    const topCats = Object.entries(categoryCount)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([cat, num]) => `${cat}(${num})`)
                        .join('<br>');

                    return `
                        <div class="bha-compact-bar">
                            <div class="bha-tooltip">${count}个视频${topCats ? '<br>' + topCats : ''}</div>
                            <div class="bha-compact-bar-wrapper">
                                <div class="bha-compact-bar-fill" style="height: ${height}px;"></div>
                            </div>
                            <div class="bha-compact-bar-label">${hour}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function generateCategoryChart(categories, total) {
        const maxCount = Math.max(...categories.map(c => c[1]));
        return `
            <div class="bha-bars-container">
                ${categories.map(([name, count]) => {
                    const height = maxCount > 0 ? (count / maxCount * 130) : 0;
                    const percent = ((count / total) * 100).toFixed(1);
                    return `
                        <div class="bha-bar-item">
                            <div class="bha-bar-wrapper">
                                <div class="bha-bar-fill" style="height: ${height}px;">
                                    <div class="bha-bar-value">${count}</div>
                                </div>
                            </div>
                            <div class="bha-bar-label">${name}<br>${percent}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    // ==================== 主要接口 ====================

    function showResultModal(params) {
        const { filters, stats, allVideos, recordId, llmConfig, formatFilters, formatTime, updateLLMResult, callLLM } = params;
        const hasLLM = llmConfig && llmConfig.apiUrl && llmConfig.apiToken && llmConfig.model;

        // === 新增：计算登录天数 ===
        const loginDays = calculateLoginDays(allVideos);
        const timeRangeSeconds = filters.endTime - filters.startTime;
        const showLoginDays = timeRangeSeconds > 86400; // > 1天

        // === 新增：短长视频统计 ===
        const videoTypeStats = calculateVideoTypeStats(allVideos);

        // === 新增：大类映射 ===
        const majorCategories = mapToMajorCategories(allVideos, typeof TagJsonListStr !== 'undefined' ? TagJsonListStr : '[]');
        console.log("majorCategories",majorCategories)
        const radarData = majorCategories.slice(0, 10); // 取前10类（或全部）

        const overlay = document.createElement('div');
        overlay.className = 'bha-modal-overlay active';
        overlay.id = 'bha-result-overlay';

        const llmSection = hasLLM ? `
        <div class="bha-llm-loading">
            <div class="bha-spinner"></div>
            <div>AI 正在深度分析您的观看习惯...</div>
        </div>
    ` : `
        <div class="bha-llm-no-config">
            未配置 AI 锐评
        </div>
    `;

        let statsCardsHTML = `
        <div class="bha-stat-card">
            <div class="bha-stat-value">${stats.totalVideos}</div>
            <div class="bha-stat-label">📹 观看视频数</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${formatDuration(stats.totalWatchTime)}</div>
            <div class="bha-stat-label">⏰ 总观看时长</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${stats.avgCompletion}%</div>
            <div class="bha-stat-label">✅ 平均完成率</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${stats.favRate}%</div>
            <div class="bha-stat-label">⭐ 收藏率</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${videoTypeStats.shortVideoCountRatio}%</div>
            <div class="bha-stat-label">🎬 短视频占比</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${videoTypeStats.shortVideoTimeRatio}%</div>
            <div class="bha-stat-label">⏱️ 短视频时长占比</div>
        </div>
    `;

        if (showLoginDays) {
            statsCardsHTML += `
            <div class="bha-stat-card">
                <div class="bha-stat-value">${loginDays}</div>
                <div class="bha-stat-label">📅 登录天数</div>
            </div>
        `;
        }

        let content = `
        <div class="bha-modal bha-result-modal" onclick="event.stopPropagation()">
            <div class="bha-modal-header">
                <span>📊</span>
                <span>分析结果</span>
            </div>
            <div class="bha-filter-info">
                <div class="bha-filter-info-title">🎯 筛选条件</div>
                <div class="bha-filter-info-content">
                    ${formatFilters(filters)}
                </div>
            </div>
            <div id="bha-carousel-container"></div>
            <div class="bha-stats-grid">
                ${statsCardsHTML}
            </div>
            <div class="bha-chart">
                <div class="bha-chart-title">📈 24小时观看分布</div>
                ${generateCompactHourChart(stats.hourDist, stats.hourVideos)}
            </div>
            <div class="bha-chart">
                <div class="bha-chart-title">🎯 热门分类 TOP 10</div>
                <div class="bha-horizontal-scroll">
                    ${generateCategoryChart(stats.topCategories, stats.totalVideos)}
                </div>
            </div>
            ${radarData.length > 0 ? `
            <div class="bha-chart">
                <div class="bha-chart-title">🧭 内容兴趣雷达图</div>
                <div id="bha-radar-chart" style="width:100%; height:300px;"></div>
            </div>
            ` : ''}
            <div class="bha-chart">
                <div class="bha-chart-title">🤖 AI 智能分析</div>
                <div class="bha-llm-result" id="bha-llm-result">
                    ${llmSection}
                </div>
            </div>
            <div class="bha-btn-group">
                <button class="bha-btn bha-btn-primary" id="bha-close">关闭</button>
            </div>
            <div class="bha-export-group">
                <button class="bha-export-btn" id="bha-export-pdf">📄 导出为 PDF</button>
                <button class="bha-export-btn" id="bha-export-image">🖼️ 导出为长截图</button>
            </div>
        </div>
    `;

        overlay.innerHTML = content;
        document.body.appendChild(overlay);

        // === 渲染雷达图 ===
        if (radarData.length > 0 && typeof echarts !== 'undefined') {
            setTimeout(() => {
                const chartDom = document.getElementById('bha-radar-chart');
                if (chartDom) {
                    const myChart = echarts.init(chartDom);
                    const indicator = radarData.map(item => ({ name: item.name, max: Math.max(...radarData.map(d => d.count), 1) }));
                    const seriesData = radarData.map(item => item.count);
                    myChart.setOption({
                        tooltip: {},
                        radar: {
                            shape: 'circle',
                            indicator: indicator,
                            splitNumber: 4,
                            axisName: {
                                color: '#555',
                                fontSize: 12
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#eee'
                                }
                            },
                            splitArea: {
                                areaStyle: {
                                    color: ['rgba(102,126,234,0.05)', 'rgba(118,75,162,0.05)'],
                                    shadowColor: 'rgba(0,0,0,0.1)',
                                    shadowBlur: 5
                                }
                            }
                        },
                        series: [{
                            type: 'radar',
                            symbolSize: 6,
                            data: [{
                                value: seriesData,
                                name: '兴趣分布',
                                lineStyle: { color: '#667eea' },
                                itemStyle: { color: '#667eea' },
                                areaStyle: { color: 'rgba(102,126,234,0.3)' }
                            }]
                        }]
                    });
                }
            }, 100);
        }

        if (allVideos.length >= 3) {
            const carouselContainer = overlay.querySelector('#bha-carousel-container');
            createHistoryCarousel(carouselContainer, allVideos);
        }

        overlay.querySelector('#bha-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        overlay.querySelector('#bha-export-pdf').addEventListener('click', () => exportContent('pdf'));
        overlay.querySelector('#bha-export-image').addEventListener('click', () => exportContent('image'));
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        if (hasLLM && callLLM) {
            callLLM(llmConfig.apiUrl, llmConfig.apiToken, llmConfig.model, allVideos,filters).then(llmResult => {
                updateLLMResult(recordId, llmResult);
                const llmResultEl = document.querySelector('#bha-llm-result');
                if (llmResultEl) {
                    llmResultEl.innerHTML = parseMarkdown(llmResult);
                }
            }).catch(error => {
                console.error('[LLM] 分析失败:', error);
                const llmResultEl = document.querySelector('#bha-llm-result');
                if (llmResultEl) {
                    llmResultEl.innerHTML = `
                    <div class="bha-error">
                        <strong>❌ AI 分析失败</strong><br>
                        ${error.message}
                    </div>
                `;
                }
                updateLLMResult(recordId, `分析失败：${error.message}`);
            });
        }

        return recordId;
    }

    function showResultModalFromCache(record, utils) {
        const { formatFilters, formatTime } = utils;

        // === 新增：登录天数、短长视频统计 & 雷达图数据 ===
        const loginDays = calculateLoginDays(record.videos || []);
        const timeRangeSeconds = record.filters.endTime - record.filters.startTime;
        const showLoginDays = timeRangeSeconds > 86400;

        const videoTypeStats = calculateVideoTypeStats(record.videos || []);

        const majorCategories = mapToMajorCategories(record.videos || [], typeof TagJsonListStr !== 'undefined' ? TagJsonListStr : '[]');
        const radarData = majorCategories.slice(0, 10);

        const overlay = document.createElement('div');
        overlay.className = 'bha-modal-overlay active';

        let llmContent;
        if (!record.llmResult) {
            llmContent = '<div class="bha-llm-no-config">未配置 AI 锐评</div>';
        } else if (record.llmResult === '尚未生成成功') {
            llmContent = '<div class="bha-error">AI 分析未完成</div>';
        } else {
            llmContent = parseMarkdown(record.llmResult);
        }

        let statsCardsHTML = `
        <div class="bha-stat-card">
            <div class="bha-stat-value">${record.stats.totalVideos}</div>
            <div class="bha-stat-label">📹 观看视频数</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${formatDuration(record.stats.totalWatchTime)}</div>
            <div class="bha-stat-label">⏰ 总观看时长</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${record.stats.avgCompletion}%</div>
            <div class="bha-stat-label">✅ 平均完成率</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${record.stats.favRate}%</div>
            <div class="bha-stat-label">⭐ 收藏率</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${videoTypeStats.shortVideoCountRatio}%</div>
            <div class="bha-stat-label">🎬 短视频占比</div>
        </div>
        <div class="bha-stat-card">
            <div class="bha-stat-value">${videoTypeStats.shortVideoTimeRatio}%</div>
            <div class="bha-stat-label">⏱️ 短视频时长占比</div>
        </div>
    `;

        if (showLoginDays) {
            statsCardsHTML += `
            <div class="bha-stat-card">
                <div class="bha-stat-value">${loginDays}</div>
                <div class="bha-stat-label">📅 登录天数</div>
            </div>
        `;
        }

        let content = `
        <div class="bha-modal bha-result-modal" onclick="event.stopPropagation()">
            <div class="bha-modal-header">
                <span>📊</span>
                <span>分析结果（历史记录）</span>
            </div>
            <div class="bha-filter-info">
                <div class="bha-filter-info-title">🎯 筛选条件</div>
                <div class="bha-filter-info-content">
                    ${formatFilters(record.filters)}
                </div>
            </div>
            <div id="bha-carousel-container"></div>
            <div class="bha-stats-grid">
                ${statsCardsHTML}
            </div>
            <div class="bha-chart">
                <div class="bha-chart-title">📈 24小时观看分布</div>
                ${generateCompactHourChart(record.stats.hourDist, record.stats.hourVideos)}
            </div>
            <div class="bha-chart">
                <div class="bha-chart-title">🎯 热门分类 TOP 10</div>
                <div class="bha-horizontal-scroll">
                    ${generateCategoryChart(record.stats.topCategories, record.stats.totalVideos)}
                </div>
            </div>
            ${radarData.length > 0 ? `
            <div class="bha-chart">
                <div class="bha-chart-title">🧭 内容兴趣雷达图</div>
                <div id="bha-radar-chart" style="width:100%; height:300px;"></div>
            </div>
            ` : ''}
            <div class="bha-chart">
                <div class="bha-chart-title">🤖 AI 智能分析</div>
                <div class="bha-llm-result">${llmContent}</div>
            </div>
            <div class="bha-btn-group">
                <button class="bha-btn bha-btn-primary" id="bha-close">关闭</button>
            </div>
            <div class="bha-export-group">
                <button class="bha-export-btn" id="bha-export-pdf">📄 导出为 PDF</button>
                <button class="bha-export-btn" id="bha-export-image">🖼️ 导出为长截图</button>
            </div>
        </div>
    `;

        overlay.innerHTML = content;
        document.body.appendChild(overlay);

        // === 渲染雷达图 ===
        if (radarData.length > 0 && typeof echarts !== 'undefined') {
            setTimeout(() => {
                const chartDom = document.getElementById('bha-radar-chart');
                if (chartDom) {
                    const myChart = echarts.init(chartDom);
                    const indicator = radarData.map(item => ({ name: item.name, max: Math.max(...radarData.map(d => d.count), 1) }));
                    const seriesData = radarData.map(item => item.count);
                    myChart.setOption({
                        tooltip: {},
                        radar: {
                            shape: 'circle',
                            indicator: indicator,
                            splitNumber: 4,
                            axisName: {
                                color: '#555',
                                fontSize: 12
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#eee'
                                }
                            },
                            splitArea: {
                                areaStyle: {
                                    color: ['rgba(102,126,234,0.05)', 'rgba(118,75,162,0.05)'],
                                    shadowColor: 'rgba(0,0,0,0.1)',
                                    shadowBlur: 5
                                }
                            }
                        },
                        series: [{
                            type: 'radar',
                            symbolSize: 6,
                            data: [{
                                value: seriesData,
                                name: '兴趣分布',
                                lineStyle: { color: '#667eea' },
                                itemStyle: { color: '#667eea' },
                                areaStyle: { color: 'rgba(102,126,234,0.3)' }
                            }]
                        }]
                    });
                }
            }, 100);
        }

        if (record.videos && record.videos.length >= 3) {
            const carouselContainer = overlay.querySelector('#bha-carousel-container');
            createHistoryCarousel(carouselContainer, record.videos);
        }

        overlay.querySelector('#bha-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        overlay.querySelector('#bha-export-pdf').addEventListener('click', () => exportContent('pdf'));
        overlay.querySelector('#bha-export-image').addEventListener('click', () => exportContent('image'));
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }

    // 导出模块接口
    window.BilibiliHistoryResultModule = {
        showResultModal,
        showResultModalFromCache
    };

})(window);
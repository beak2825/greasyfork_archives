// ==UserScript==
// @name         一键复制 Plane Issue
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键复制 Plane Issue，table 格式，可以复制到 notion、docmost 等
// @author       You
// @match        http://192.168.1.111:1090/mms/projects/*/issues/
// @match        http://192.168.1.111:1090/mms/projects/*/views/*/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560726/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%20Plane%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/560726/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%20Plane%20Issue.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 存储结果的变量：只保留最后一次
    window.interceptedIssues = null;
    window.interceptedMembers = null;

    const ORIGIN_FETCH = window.fetch;
    const TARGET_PATTERN_ISSUES = /\/api\/workspaces\/[^/]+\/projects\/[^/]+\/issues\//;
    const TARGET_PATTERN_MEMBERS = /\/api\/workspaces\/[^/]+\/members\//;

    window.fetch = async (...args) => {
        const response = await ORIGIN_FETCH(...args);
        const url = args[0] instanceof Request ? args[0].url : args[0];

        // 拦截 Issues
        if (TARGET_PATTERN_ISSUES.test(url)) {
            const clone = response.clone();
            clone.json().then(data => {
                console.log('[Interceptor] 抓取到 Issues 数据:', url, data);
                window.interceptedIssues = {
                    url: url,
                    data: data,
                    timestamp: new Date().getTime()
                };
            }).catch(err => console.error('[Interceptor] Issues 解析失败', err));
        }

        // 拦截 Members
        if (TARGET_PATTERN_MEMBERS.test(url)) {
            const clone = response.clone();
            clone.json().then(data => {
                console.log('[Interceptor] 抓取到 Members 数据:', url, data);
                window.interceptedMembers = {
                    url: url,
                    data: data,
                    timestamp: new Date().getTime()
                };
            }).catch(err => console.error('[Interceptor] Members 解析失败', err));
        }

        return response;
    };

    const ORIGIN_XHR_OPEN = XMLHttpRequest.prototype.open;
    const ORIGIN_XHR_SEND = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return ORIGIN_XHR_OPEN.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            // XHR 拦截 Issues
            if (TARGET_PATTERN_ISSUES.test(this._url)) {
                try {
                    const data = JSON.parse(this.responseText);
                    console.log('[Interceptor] XHR 抓取 Issues 成功:', this._url);
                    window.interceptedIssues = {
                        url: this._url,
                        data: data,
                        timestamp: new Date().getTime()
                    };
                } catch (e) {}
            }
            // XHR 拦截 Members
            if (TARGET_PATTERN_MEMBERS.test(this._url)) {
                try {
                    const data = JSON.parse(this.responseText);
                    console.log('[Interceptor] XHR 抓取 Members 成功:', this._url);
                    window.interceptedMembers = {
                        url: this._url,
                        data: data,
                        timestamp: new Date().getTime()
                    };
                } catch (e) {}
            }
        });
        return ORIGIN_XHR_SEND.apply(this, arguments);
    };


    // --- 新增 UI 逻辑 ---

    function initButton() {
        const btn = document.createElement('button');
        btn.innerText = '拷贝任务';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px 16px';
        btn.style.backgroundColor = '#212121';
        btn.style.color = '#ffffff';
        btn.style.border = '1px solid #434343';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';

        btn.onclick = function() {
            if (!window.interceptedIssues || !window.interceptedIssues.data || !window.interceptedIssues.data.results) {
                console.warn('[Interceptor] 未获取到 Issues 数据');
                return;
            }

            // 建立 Member 映射表方便查询
            const memberMap = {};
            if (window.interceptedMembers && Array.isArray(window.interceptedMembers.data)) {
                window.interceptedMembers.data.forEach(item => {
                    if (item.member) {
                        memberMap[item.member.id] = item.member.display_name;
                    }
                });
            }

            // 处理数据转换
            const result = window.interceptedIssues.data.results.map(issue => {
                const assigneeNames = (issue.assignee_ids || []).map(id => memberMap[id] || '未知用户');

                return {
                    "display_name": `${issue.sequence_id}-${issue.name}`,
                    "sequence_id": issue.sequence_id,
                    "name": issue.name,
                    "assignee_ids": issue.assignee_ids,
                    "assignee_names": assigneeNames
                };
            });

            window.result = result;
            console.log('[Interceptor] 生成任务数组:', result);

            copyToTableClipboard(result)
        };

        document.body.appendChild(btn);
    }

    // 等待页面加载完成后注入按钮
    if (document.readyState === 'complete') {
        initButton();
    } else {
        window.addEventListener('load', initButton);
    }

    /**
     * 将特定的 JSON Array 转换为 HTML Table 并写入剪贴板
     * @param {Array} data - 目标 JSON 数组
     */
     /**
     * 兼容性方案：将 JSON 数组转换为表格并复制
     * 支持 HTTP/HTTPS 及其它旧版环境
     */
    function copyToTableClipboard(data) {
        if (!Array.isArray(data) || data.length === 0) return;

        // 1. 构建 HTML 表格字符串
        let html = '<table border="1"><thead><tr>';
        html += '<th>任务名称</th>';
        html += '<th>负责人</th>';
        html += '</tr></thead><tbody>';

        data.forEach(item => {
            const assignees = Array.isArray(item.assignee_names)
            ? item.assignee_names.join(', ')
            : (item.assignee_names || '');

            html += '<tr>';
            html += `<td>${item.display_name || ''}</td>`;
            html += `<td>${assignees}</td>`;
            html += '</tr>';
        });
        html += '</tbody></table>';

        // 2. 创建临时隐藏容器
        const container = document.createElement('div');
        container.innerHTML = html;

        // 隐藏元素，防止页面闪烁
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        // 必须确保它在 DOM 中才能被选中
        document.body.appendChild(container);

        // 3. 选中并执行复制
        try {
            const range = document.createRange();
            range.selectNode(container);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            const successful = document.execCommand('copy');
            if (successful) {
                console.log('表格已成功复制到剪贴板');
            } else {
                console.error('复制命令执行失败');
            }
        } catch (err) {
            console.error('复制过程中出错:', err);
        } finally {
            // 4. 清理现场
            document.body.removeChild(container);
            window.getSelection().removeAllRanges();
        }
    }
})();
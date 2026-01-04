// ==UserScript==
// @name         【查询验证码】终极版 v1.1
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @license      There are licenses for that.
// @description  格式：接收时间+验证码，复制后1秒关闭，带关闭按钮
// @author       17630583910@163.com
// @match        https://freechess-manage.leqeegroup.com/*
// @grant        none

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548203/%E3%80%90%E6%9F%A5%E8%AF%A2%E9%AA%8C%E8%AF%81%E7%A0%81%E3%80%91%E7%BB%88%E6%9E%81%E7%89%88%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/548203/%E3%80%90%E6%9F%A5%E8%AF%A2%E9%AA%8C%E8%AF%81%E7%A0%81%E3%80%91%E7%BB%88%E6%9E%81%E7%89%88%20v11.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const QUERY_BTN_CLASS = 'query-code-btn';
    const API_BASE = 'https://ee.leqeegroup.com/ee/proxy/auto-manage/web/phone/manage/verify/code/list';
    const COL_KEY_4 = 'el-table_1_column_4';           // 当日接收短信数量
    const OPERATE_COL_KEY = 'el-table_1_column_8';     // 操作列

    // === 1. 注入样式 ===
    function addCustomStyle() {
        const style = document.createElement('style');
        style.textContent = `
            /* 列宽控制 */
            .${COL_KEY_4}.el-table__cell {
                width: 200px !important;
                min-width: 200px !important;
                max-width: 200px !important;
            }
            .${OPERATE_COL_KEY}.el-table__cell {
                width: 210px !important;
                min-width: 210px !important;
                max-width: 210px !important;
            }

            /* 操作列水平排列 */
            .${OPERATE_COL_KEY} .table-operation,
            .${OPERATE_COL_KEY} .cell {
                display: flex !important;
                align-items: center !important;
                height: 100% !important;
            }

            /* 查询按钮 */
            .${QUERY_BTN_CLASS} {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: #409eff !important;
                color: white !important;
                font-size: 12px;
                font-weight: 500;
                border-radius: 4px;
                padding: 6px 10px;
                margin-left: 8px;
                cursor: pointer;
                user-select: none;
                height: 28px;
                min-width: 80px;
            }
            .${QUERY_BTN_CLASS}:hover {
                background-color: #357ae8 !important;
            }

            /* 弹窗样式 */
            .verify-modal {
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 400px; background: white; border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 99999; font-family: Arial, sans-serif; font-size: 14px;
            }
            .verify-modal-header {
                padding: 16px; border-bottom: 1px solid #eee;
                text-align: center; font-weight: bold;
            }
            .verify-modal-body {
                padding: 16px; max-height: 300px; overflow-y: auto;
            }
            .verify-item {
                display: flex; align-items: center; justify-content: space-between;
                background: #f5f5f5; padding: 8px 10px; margin: 4px 0; border-radius: 4px;
                font-size: 13px; white-space: nowrap;
            }
            .verify-text {
                flex: 1; margin-right: 8px; font-family: Arial, sans-serif;
            }
            .verify-copy-btn {
                font-size: 12px; padding: 2px 6px; background: #409eff;
                color: white; border: none; border-radius: 3px; cursor: pointer;
                min-width: 50px;
            }
            .verify-copy-btn:disabled {
                background: #ccc; cursor: not-allowed;
            }
            .verify-modal-footer {
                padding: 16px; text-align: right; border-top: 1px solid #eee;
            }
            .verify-close-btn {
                padding: 6px 12px; background: #f0f0f0; border: none;
                border-radius: 4px; cursor: pointer; font-size: 13px;
            }
            .no-code-tip {
                text-align: center; color: #666; padding: 20px 0;
            }
        `;
        document.head.appendChild(style);
    }

    // === 2. 同步修改列宽（col + th + td）===
    function syncColumnWidth() {
        const col4 = document.querySelector(`col[name="${COL_KEY_4}"]`);
        if (col4) {
            col4.width = '200';
            col4.style.width = '200px';
        }

        const operateCol = document.querySelector(`col[name="${OPERATE_COL_KEY}"]`);
        if (operateCol) {
            operateCol.width = '210';
            operateCol.style.width = '210px';
        }

        document.querySelectorAll(`th.${COL_KEY_4}, td.${COL_KEY_4}`).forEach(el => {
            el.style.width = '200px';
            el.setAttribute('width', '200');
        });
        document.querySelectorAll(`th.${OPERATE_COL_KEY}, td.${OPERATE_COL_KEY}`).forEach(el => {
            el.style.width = '210px';
            el.setAttribute('width', '210');
        });

        const table = document.querySelector('.el-table__body');
        if (table) {
            table.style.width = table.clientWidth + 'px';
            setTimeout(() => table.style.width = '', 0);
        }
    }

    // === 3. 显示验证码弹窗（新格式：时间 + 验证码，带关闭按钮）===
    function showVerificationModal(phone, rawData) {
        document.querySelectorAll('.verify-modal').forEach(el => el.remove());

        const codes = [];
        if (Array.isArray(rawData)) {
            rawData.forEach(item => {
                if (item.msg) {
                    const match = item.msg.match(/(\d{4,6})/);
                    if (match) {
                        codes.push({
                            code: match[1],
                            time: item.msgReceiveTime || '未知时间'
                        });
                    }
                }
            });
        }

        const modal = document.createElement('div');
        modal.className = 'verify-modal';

        if (codes.length === 0) {
            modal.innerHTML = `
                <div class="verify-modal-header">${phone}</div>
                <div class="verify-modal-body">
                    <div class="no-code-tip">暂无验证码</div>
                </div>
                <div class="verify-modal-footer">
                    <button class="verify-close-btn">关闭</button>
                </div>
            `;
            document.body.appendChild(modal);
            setTimeout(() => modal.remove(), 1000);
            return;
        }

        // 生成每条记录：接收时间 + 验证码 + 复制按钮
        const codeItems = codes.map(item => `
            <div class="verify-item">
                <span class="verify-text">接收时间：${item.time} 验证码：${item.code}</span>
                <button class="verify-copy-btn" data-code="${item.code}">复制</button>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="verify-modal-header">${phone}</div>
            <div class="verify-modal-body">${codeItems}</div>
            <div class="verify-modal-footer">
                <button class="verify-close-btn">关闭</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 绑定复制事件
        modal.querySelectorAll('.verify-copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const code = btn.getAttribute('data-code');
                btn.disabled = true;
                btn.textContent = '已复制！';

                try {
                    await navigator.clipboard.writeText(code);
                    // 1秒后自动关闭弹窗
                    setTimeout(() => {
                        modal.remove();
                    }, 1000);
                } catch (err) {
                    btn.disabled = false;
                    btn.textContent = '失败';
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = '复制';
                    }, 1000);
                }
            });
        });

        // 关闭按钮
        modal.querySelector('.verify-close-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    // === 4. 查询验证码（从按钮所在行获取手机号）===
    async function queryVerificationCode(btn) {
        const row = btn.closest('.el-table__row');
        if (!row) {
            alert('无法定位所在行');
            return;
        }

        const phoneCell = row.querySelector('td.el-table_1_column_1 .cell');
        let phone = '';
        if (phoneCell) {
            phone = (phoneCell.innerText || phoneCell.textContent || '').replace(/\s+/g, '');
            const match = phone.match(/\d{11}/);
            phone = match ? match[0] : '';
        }

        if (!phone || !/^\d{11}$/.test(phone)) {
            alert('未获取到有效手机号');
            console.warn('无效手机号', { raw: phoneCell?.innerText });
            return;
        }

        console.log('正在查询验证码:', phone);

        if (btn.disabled) return;
        btn.disabled = true;
        btn.textContent = '查询中...';

        try {
            const url = `${API_BASE}?phoneNumber=${encodeURIComponent(phone)}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'zh,zh-CN;q=0.9',
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    'origin': 'https://freechess-manage.leqeegroup.com',
                    'pragma': 'no-cache',
                    'referer': 'https://freechess-manage.leqeegroup.com/',
                    'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                    'x-org': 'leqee',
                    'x-org-code': 'leqee',
                    'x-platform': 'freechess-manage',
                    'x-user-origin': 'AA3',
                    'x-request-id': `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
                },
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(res.status === 404 ? '接口未找到' : `HTTP ${res.status}`);
            }

            const data = await res.json();
            if (data.code === 200) {
                showVerificationModal(phone, data.result);
            } else {
                throw new Error(data.message || '接口返回异常');
            }
        } catch (err) {
            console.error('查询失败:', err);
            alert(`查询失败：${err.message}`);
        } finally {
            btn.disabled = false;
            btn.textContent = '查询验证码';
        }
    }

    // === 5. 添加按钮 ===
    function addQueryButton() {
        const rows = document.querySelectorAll('.el-table__body .el-table__row');
        rows.forEach(row => {
            const opContainer = row.querySelector(`.${OPERATE_COL_KEY} .table-operation`);
            if (!opContainer || row.querySelector('.' + QUERY_BTN_CLASS)) return;

            const btn = document.createElement('div');
            btn.className = `icon-button-1 ${QUERY_BTN_CLASS}`;
            btn.textContent = '查询验证码';
            btn.addEventListener('click', () => queryVerificationCode(btn));
            opContainer.appendChild(btn);
        });
    }

    // === 6. 初始化（等待页面加载）===
    function init() {
        addCustomStyle();

        const waitForTable = setInterval(() => {
            const tableBody = document.querySelector('.el-table__body tbody');
            if (tableBody) {
                clearInterval(waitForTable);
                syncColumnWidth();
                addQueryButton();

                const observer = new MutationObserver(() => {
                    syncColumnWidth();
                    addQueryButton();
                });
                observer.observe(tableBody, { childList: true, subtree: true });
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('load', init);
    } else {
        init();
    }

})();
// ==UserScript==
// @name         自动填写日期范围并查询
// @namespace    http://tampermonkey.net/
// @version      3.01
// @description  点击按钮自动填写账单月份范围并点击查询
// @author       You
// @license      MIT
// @match        https://myseller.taobao.com/home.htm/whale-accountant/invoice/applyList*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561342/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%97%A5%E6%9C%9F%E8%8C%83%E5%9B%B4%E5%B9%B6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/561342/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%97%A5%E6%9C%9F%E8%8C%83%E5%9B%B4%E5%B9%B6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区域 ====================
    // 默认日期（格式：YYYY-MM），可在界面上修改
    let START_DATE = '2025-10';  // 起始月份
    let END_DATE = '2025-12';    // 结束月份
    // =================================================

    // 创建统一控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 99999;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            min-width: 280px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 12px; text-align: center;">
                    📋 账单助手
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">起始月份 (YYYY-MM)</label>
                    <input id="start-date-input" type="text" value="${START_DATE}"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">结束月份 (YYYY-MM)</label>
                    <input id="end-date-input" type="text" value="${END_DATE}"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="btn-fill-date"
                        style="width: 100%; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; transition: all 0.3s;">
                    📅 填写日期并查询
                </button>
                <button id="btn-select-business"
                        style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: bold; cursor: pointer; transition: all 0.3s;">
                    🏷️ 勾选业务组
                </button>
            </div>
            <div id="status-message" style="margin-top: 12px; font-size: 12px; color: #999; text-align: center; min-height: 16px;"></div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('btn-fill-date').addEventListener('click', autoFillDate);
        document.getElementById('btn-select-business').addEventListener('click', selectNextBusinessGroup);

        // 监听日期输入变化
        document.getElementById('start-date-input').addEventListener('change', (e) => {
            START_DATE = e.target.value.trim();
            showStatus('起始月份已更新: ' + START_DATE);
        });

        document.getElementById('end-date-input').addEventListener('change', (e) => {
            END_DATE = e.target.value.trim();
            showStatus('结束月份已更新: ' + END_DATE);
        });

        // 按钮悬停效果
        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.onmouseover = () => {
                btn.style.transform = 'scale(1.02)';
                btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            };
            btn.onmouseout = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            };
        });

        console.log('[自动日期] 控制面板已创建');
    }

    // 显示状态信息
    function showStatus(message) {
        const statusEl = document.getElementById('status-message');
        if (statusEl) {
            statusEl.textContent = message;
            setTimeout(() => {
                statusEl.textContent = '';
            }, 1000);
        }
    }

    // 当前选中的业务大类索引
    let currentBusinessIndex = -1;
    let businessGroups = [];

    // 获取所有业务大类
    function getBusinessGroups() {
        const table = document.querySelector('table[role="table"]');
        if (!table) return [];

        const rows = table.querySelectorAll('tbody tr');
        const businessMap = new Map();

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const businessType = cells[2].textContent.trim();
                const checkbox = cells[0].querySelector('input[type="checkbox"]');

                if (businessType && checkbox) {
                    if (!businessMap.has(businessType)) {
                        businessMap.set(businessType, []);
                    }
                    businessMap.get(businessType).push(checkbox);
                }
            }
        });

        return Array.from(businessMap.entries());
    }

    // 选择下一个业务组
    function selectNextBusinessGroup() {
        // 先取消所有已勾选的
        const allCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
        allCheckboxes.forEach(cb => {
            if (cb.checked) {
                cb.click();
            }
        });

        // 重新获取业务分组
        businessGroups = getBusinessGroups();

        if (businessGroups.length === 0) {
            console.log('[业务选择] 未找到业务大类数据！');
            return;
        }

        // 移动到下一个业务组
        currentBusinessIndex++;
        if (currentBusinessIndex >= businessGroups.length) {
            currentBusinessIndex = 0; // 循环
        }

        const [businessName, checkboxes] = businessGroups[currentBusinessIndex];

        // 勾选该业务组的所有复选框
        checkboxes.forEach(cb => {
            if (!cb.checked) {
                cb.click();
            }
        });

        console.log(`[业务选择] 已勾选业务大类: ${businessName}，共 ${checkboxes.length} 条记录`);
        showStatus(`已勾选: ${businessName} (${checkboxes.length}条)`);
    }

    // 原生设置值（绕过某些框架限制）
    function nativeSetValue(element, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(element, value);
    }

    // 触发多种事件
    function triggerEvents(element) {
        const events = [
            'input',
            'change',
            'blur',
            'keyup',
            'keydown',
            'keypress'
        ];

        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            element.dispatchEvent(event);
        });

        // React/Vue 专用
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.value = element.value;
    }

    // 点击查询按钮（精确匹配"查询"，排除"查询开票给支付宝"）
    function clickQueryButton() {
        const queryBtn =
            [...document.querySelectorAll('button')].find(btn => {
                const text = btn.textContent.trim();
                return text === '查询' || (text === '查询' && !text.includes('开票'));
            });

        if (queryBtn) {
            queryBtn.click();
            console.log('[自动日期] 已点击查询按钮');
        } else {
            console.log('[自动日期] 未找到查询按钮');
        }
    }

    // 模拟按键事件
    function simulateEnter(element) {
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(enterEvent);

        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(keyupEvent);
    }

    // 自动填写日期
    function autoFillDate() {
        const startInputs = document.querySelectorAll('input[placeholder="起始月份"]');
        const endInputs = document.querySelectorAll('input[placeholder="结束月份"]');

        if (startInputs.length === 0 || endInputs.length === 0) {
            alert('未找到日期输入框！请确认页面已加载完成。');
            return false;
        }

        const startInput = startInputs[0];
        const endInput = endInputs[0];

        // 填写起始日期
        startInput.focus();
        startInput.click();
        nativeSetValue(startInput, START_DATE);
        triggerEvents(startInput);
        console.log('[自动日期] 起始月份已填写: ' + START_DATE);

        // 填写结束日期
        endInput.focus();
        endInput.click();
        nativeSetValue(endInput, END_DATE);
        triggerEvents(endInput);
        console.log('[自动日期] 结束月份已填写: ' + END_DATE);

        // 按两次回车键触发日期选择
        setTimeout(() => {
            endInput.focus();
            simulateEnter(endInput);
            console.log('[自动日期] 第一下回车');

            setTimeout(() => {
                simulateEnter(endInput);
                console.log('[自动日期] 第二下回车');

                // 点击查询
                setTimeout(() => {
                    clickQueryButton();
                }, 500);
            }, 300);
        }, 500);

        return true;
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        const checkInterval = setInterval(() => {
            if (document.body) {
                clearInterval(checkInterval);
                createControlPanel();
            }
        }, 100);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 控制台手动执行
    window.autoFillAndQuery = autoFillDate;
    console.log('[自动日期] 脚本已加载，配置日期: ' + START_DATE + ' ~ ' + END_DATE);
})();

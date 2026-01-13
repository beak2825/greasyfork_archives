// ==UserScript==
// @name         工行预约助手 
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  支持姓名手机自动填充、日期下拉框自动选择、以及最后一步自动点击确认按钮
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562410/%E5%B7%A5%E8%A1%8C%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562410/%E5%B7%A5%E8%A1%8C%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 样式定义
    GM_addStyle(`
        #icbc-helper-box {
            position: fixed; top: 10px; right: 10px; width: 260px;
            background: #fff; border: 2px solid #d9001b; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 999999; padding: 15px;
            font-family: "Microsoft YaHei", sans-serif; font-size: 13px;
        }
        #icbc-helper-box h3 {
            margin: 0 0 10px 0; color: #d9001b; text-align: center;
            border-bottom: 1px solid #eee; padding-bottom: 5px; font-weight: bold;
        }
        .helper-item { margin-bottom: 8px; }
        .helper-item label { display:block; font-weight:bold; margin-bottom:3px; color: #333; }
        .helper-item input[type="text"], .helper-item input[type="number"] {
            width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;
        }
        .helper-checkbox {
            display: flex; align-items: center; margin-top: 10px; padding-top: 5px; border-top: 1px dashed #eee;
        }
        .helper-checkbox input { margin-right: 5px; }
        .helper-checkbox label { color: #d9001b; font-weight: bold; cursor: pointer; }
        #helper-btn-start {
            width: 100%; background: #d9001b; color: white; border: none;
            padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px;
            font-size: 14px;
        }
        #helper-btn-start:hover { background: #b50017; }
        #helper-status { margin-top: 8px; color: #666; font-size: 12px; line-height: 1.4; word-break: break-all;}
    `);

    // 2. 创建操作面板
    const div = document.createElement('div');
    div.id = 'icbc-helper-box';
    div.innerHTML = `
        <h3>预约助手 v5.0</h3>
        <div class="helper-item"><label>姓名</label><input type="text" id="cfg-name"></div>
        <div class="helper-item"><label>证件号码</label><input type="text" id="cfg-id"></div>
        <div class="helper-item"><label>手机号码</label><input type="text" id="cfg-phone"></div>
        <div class="helper-item"><label>网点关键字</label><input type="text" id="cfg-branch" placeholder="如: 北京分行"></div>
        <div class="helper-item"><label>预约数量</label><input type="number" id="cfg-count"></div>
        <div class="helper-item"><label>兑换日期</label><input type="text" id="cfg-date" placeholder="如: 2026-01-20"></div>

        <div class="helper-checkbox">
            <input type="checkbox" id="cfg-autosubmit">
            <label for="cfg-autosubmit">填写完毕后自动点击“确认预约”</label>
        </div>

        <button id="helper-btn-start">开始自动填写</button>
        <div id="helper-status">就绪</div>
    `;
    document.body.appendChild(div);

    // 3. 读取本地存储的配置
    const keys = ['name', 'id', 'phone', 'branch', 'count', 'date'];
    keys.forEach(k => document.getElementById(`cfg-${k}`).value = GM_getValue(k, ''));
    // 读取复选框状态
    document.getElementById('cfg-autosubmit').checked = GM_getValue('autosubmit', false);

    // --- 工具函数区 ---

    // 随机延时 (模拟人类操作，防风控)
    const sleep = (min, max) => {
        const ms = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // 填充输入框
    function fillInput(placeholderKeyword, value) {
        if (!value) return false;
        // 查找包含特定 placeholder 的 input 元素
        const input = document.querySelector(`input[placeholder*="${placeholderKeyword}"]`);
        if (input) {
            input.focus();
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            return true;
        }
        return false;
    }

    // 选择下拉框 (日期专用)
    async function selectDropdown(placeholderKeyword, targetText) {
        if (!targetText) return;
        const status = document.getElementById('helper-status');
        const input = document.querySelector(`input[placeholder*="${placeholderKeyword}"]`);
        if (!input) return;

        input.click(); // 点击展开
        status.innerText += ` | 展开日期...`;

        let attempts = 0;
        const maxAttempts = 30; // 尝试30次，约3秒

        // 轮询检测下拉弹窗
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                attempts++;
                const options = Array.from(document.querySelectorAll('.el-select-dropdown__item'))
                    .filter(item => item.offsetParent !== null); // 只找可见的选项

                for (let item of options) {
                    if (item.innerText.trim() === targetText.trim()) {
                        item.click();
                        clearInterval(interval);
                        status.innerText += ` | 日期已选`;
                        resolve(true); // 成功选中
                        return;
                    }
                }
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    status.innerText += ` | 日期未找到`;
                    resolve(false); // 超时
                }
            }, 100);
        });
    }

    // --- 核心执行逻辑 ---
    document.getElementById('helper-btn-start').addEventListener('click', async () => {
        // 1. 保存配置
        const cfg = {};
        keys.forEach(k => {
            const val = document.getElementById(`cfg-${k}`).value.trim();
            cfg[k] = val;
            GM_setValue(k, val);
        });
        const autoSubmit = document.getElementById('cfg-autosubmit').checked;
        GM_setValue('autosubmit', autoSubmit);

        const status = document.getElementById('helper-status');
        status.innerText = "运行中...";

        // 2. 逐步填充 (带随机延时)

        // 姓名
        fillInput('姓名', cfg.name);
        await sleep(100, 200);

        // 证件
        fillInput('证件号码', cfg.id);
        await sleep(100, 200);

        // 手机
        fillInput('手机', cfg.phone);
        await sleep(100, 200);

        // 网点搜索
        if (cfg.branch) {
            fillInput('关键字', cfg.branch);
            await sleep(300, 500); // 搜索反应时间
        }

        // 数量
        fillInput('数量', cfg.count);
        await sleep(200, 300);

        // 日期选择 (等待选择完成后再继续)
        await selectDropdown('兑换时间', cfg.date);
        await sleep(200, 400);

        // 协议勾选
        const checkboxes = document.querySelectorAll('.el-checkbox');
        let protocolChecked = false;
        checkboxes.forEach(box => {
            if (box.innerText.includes('阅读') && !box.classList.contains('is-checked')) {
                box.click();
                protocolChecked = true;
            }
        });
        if (protocolChecked) status.innerText += " | 协议√";

        // 3. 自动提交逻辑
        if (autoSubmit) {
            status.innerText += " | 准备提交...";
            await sleep(300, 600); // 最后的停顿，非常重要，防止被判为机器人

            // 根据HTML片段，确认按钮是 class="mybutton" 且文字为 "确认预约"
            // 这里使用更通用的查找方式，防止class变化
            const buttons = document.querySelectorAll('.mybutton');
            let clicked = false;
            buttons.forEach(btn => {
                if (btn.innerText.includes('确认预约') || btn.innerText.includes('提交')) {
                    btn.click();
                    clicked = true;
                }
            });

            if (clicked) {
                status.innerText = "已自动点击确认！请留意验证码。";
                status.style.color = "green";
                status.style.fontWeight = "bold";
            } else {
                status.innerText += " | 未找到提交按钮";
            }
        } else {
            status.innerText += " | 填写完毕，请手动提交";
        }
    });

})();
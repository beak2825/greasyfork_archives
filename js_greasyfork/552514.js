// ==UserScript==
// @name         千川创意标题自动填写（智能输入+保存）
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  自动点击“添加标题”按钮、智能模拟输入、支持localStorage保存输入内容（最多30个）
// @match        https://qianchuan.jinritemai.com/creation/uni-prom-product*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552514/%E5%8D%83%E5%B7%9D%E5%88%9B%E6%84%8F%E6%A0%87%E9%A2%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%88%E6%99%BA%E8%83%BD%E8%BE%93%E5%85%A5%2B%E4%BF%9D%E5%AD%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552514/%E5%8D%83%E5%B7%9D%E5%88%9B%E6%84%8F%E6%A0%87%E9%A2%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%EF%BC%88%E6%99%BA%E8%83%BD%E8%BE%93%E5%85%A5%2B%E4%BF%9D%E5%AD%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WAIT_MS = 1500;

    setTimeout(() => {
        // 创建悬浮面板
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="autoFillPanel" style="
                position: fixed;
                bottom: 30px;
                left: 30px;
                z-index: 99999;
                background: rgba(0,0,0,0.85);
                color: #fff;
                border-radius: 10px;
                padding: 14px 16px;
                width: 280px;
                font-family: sans-serif;
                box-shadow: 0 0 12px rgba(0,0,0,0.4);
            ">
                <div style="margin-bottom:8px;text-align:center;font-size:14px;">创意标题自动填写</div>
                <textarea id="fillTextArea" placeholder="请输入多个标题，每行一个（最多30个）" style="
                    width:100%;
                    height:130px;
                    padding:6px 8px;
                    border-radius:6px;
                    border:none;
                    outline:none;
                    resize:none;
                    font-size:13px;
                    margin-bottom:10px;
                "></textarea>
                <button id="startFillBtn" style="
                    width:100%;
                    background:#4CAF50;
                    color:white;
                    border:none;
                    border-radius:6px;
                    padding:8px 12px;
                    font-size:14px;
                    cursor:pointer;
                ">开始自动填写</button>
            </div>
        `;
        document.body.appendChild(panel);

        const textarea = document.getElementById('fillTextArea');
        const startBtn = document.getElementById('startFillBtn');

        // 🌟 恢复上次输入内容
        textarea.value = localStorage.getItem('qianchuan_titles') || '';

        // 🌟 自动保存输入内容
        textarea.addEventListener('input', () => {
            localStorage.setItem('qianchuan_titles', textarea.value);
        });

        // 点击开始按钮逻辑
        startBtn.addEventListener('click', async () => {
            let rawText = textarea.value.trim();
            if (!rawText) {
                alert("请输入标题内容（每行一个）！");
                return;
            }

            let titles = rawText.split(/\r?\n/).map(t => t.trim()).filter(t => t.length > 0);
            if (titles.length === 0) {
                alert("请输入有效标题！");
                return;
            }

            if (titles.length > 30) {
                alert("标题过多，只会使用前30个。");
                titles = titles.slice(0, 30);
            }

            // ✅ 查找“添加标题”按钮（精准匹配）
            const allButtons = Array.from(document.querySelectorAll('button.ovui-button[data-e2e="button"]'));
            const addButton = allButtons.find(btn => btn.innerText.trim() === '添加标题');

            if (!addButton) {
                alert("未找到‘添加标题’按钮，请确认页面是否加载完成。");
                console.warn("脚本：未找到‘添加标题’按钮。");
                return;
            }

            // 自动点击“添加标题”
            for (let i = 0; i < titles.length - 1; i++) {
                addButton.click();
                console.log(`➕ 已点击添加标题 (${i + 1}/${titles.length - 1})`);
                await new Promise(r => setTimeout(r, 100)); // 速度可调节
            }

            // 等待输入框生成
            await new Promise(r => setTimeout(r, 800));

            // 查找输入框
            const inputSelector = 'div[data-e2e*="uni-prom-product__creativeTitle__ocInput"] input.ovui-input';
            const inputs = document.querySelectorAll(inputSelector);
            if (inputs.length === 0) {
                alert("未找到创意标题输入框！");
                return;
            }

            const fillCount = Math.min(inputs.length, titles.length);

            // ✅ 使用原生 setter 模拟真实输入，绕过检测
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

            for (let i = 0; i < fillCount; i++) {
                const input = inputs[i];
                const text = titles[i];

                input.focus();
                nativeSetter.call(input, text);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.blur();

                console.log(`✅ 第 ${i + 1} 个标题已填写: ${text}`);
                await new Promise(r => setTimeout(r, 80));
            }

            alert(`已成功添加并填写 ${fillCount} 个标题！`);
        });
    }, WAIT_MS);
})();

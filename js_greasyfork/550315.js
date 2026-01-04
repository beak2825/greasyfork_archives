// ==UserScript==
// @name         批量打开链接（提前建窗，延迟跳转）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  点击按钮输入多个链接，先批量打开空白窗口，再每隔1秒依次跳转，避免浏览器拦截弹窗限制。
// @author       You
// @match        *://*/*
// @license      TANGMING

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550315/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%EF%BC%88%E6%8F%90%E5%89%8D%E5%BB%BA%E7%AA%97%EF%BC%8C%E5%BB%B6%E8%BF%9F%E8%B7%B3%E8%BD%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550315/%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%EF%BC%88%E6%8F%90%E5%89%8D%E5%BB%BA%E7%AA%97%EF%BC%8C%E5%BB%B6%E8%BF%9F%E8%B7%B3%E8%BD%AC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 按钮和输入框样式
    GM_addStyle(`
        #openLinksBtn {
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
        }
        #linkInputBox {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 300px;
            height: 220px;
            z-index: 9999;
            display: none;
            flex-direction: column;
            background: white;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            padding: 10px;
        }
        #linkInputBox textarea {
            width: 100%;
            height: 150px;
            margin-bottom: 8px;
        }
        #linkInputBox input {
            width: 80px;
            margin-bottom: 8px;
        }
    `);

    // 创建按钮
    const btn = document.createElement('button');
    btn.id = 'openLinksBtn';
    btn.innerText = '批量打开链接';
    document.body.appendChild(btn);

    // 创建输入框
    const box = document.createElement('div');
    box.id = 'linkInputBox';
    box.innerHTML = `
        <textarea placeholder="请输入多个链接，每行一个"></textarea>
        <label>间隔秒数：<input type="number" id="delayInput" value="1" min="0.5" step="0.5"></label>
        <div>
            <button id="startOpen">开始打开</button>
            <button id="cancelOpen">取消</button>
        </div>
    `;
    document.body.appendChild(box);

    // 显示输入框
    btn.addEventListener('click', () => {
        box.style.display = "flex";
    });

    // 取消
    document.getElementById('cancelOpen').addEventListener('click', () => {
        box.style.display = "none";
    });

    // 开始打开
    document.getElementById('startOpen').addEventListener('click', () => {
        let input = box.querySelector('textarea').value;
        let delay = parseFloat(document.getElementById('delayInput').value) || 1;

        if (!input.trim()) return alert("请输入链接！");

        let links = input.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);

        // 先打开空白窗口（在用户点击事件中，避免拦截）
        let windows = links.map(() => window.open('about:blank', "_blank"));

        // 延迟跳转
        links.forEach((url, i) => {
            setTimeout(() => {
                if (windows[i]) {
                    windows[i].location.href = url;
                }
            }, i * delay * 1000);
        });

        box.style.display = "none";
    });
})();

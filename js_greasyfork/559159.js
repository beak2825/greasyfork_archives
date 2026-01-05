// ==UserScript==
// @name         农场一键填充
// @namespace    local.farm.batch.like
// @version      1.4
// @description  在思齐农场页面添加“编辑常用”和“常用填充”功能，简化每日操作。
// @match        *://*/plant_game.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559159/%E5%86%9C%E5%9C%BA%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/559159/%E5%86%9C%E5%9C%BA%E4%B8%80%E9%94%AE%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 注入样式，放宽一键点赞区域宽度
const style = document.createElement('style');
style.textContent = `
#farm-collapse > div.p-collapse-body:last-child > 
div.farm-batch-like:first-child {
    width: 50%;
    max-width: 50%;
}
`;
document.head.appendChild(style);



    const STORAGE_KEY = 'farm_batch_like_common';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function showEditorDialog(initialValue, onSave) {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.45);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const box = document.createElement('div');
        box.style = `
            background: #fff;
            padding: 16px;
            width: 360px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,.25);
            font-size: 14px;
        `;

        box.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">编辑常用填充</div>
            <div style="color:#666;font-size:12px;margin-bottom:6px;">
                一行一个用户名，最多 3 行，欢迎填写xcheny
            </div>
            <textarea id="common-input" rows="4"
                style="width:100%;box-sizing:border-box;"></textarea>
            <div style="text-align:right;margin-top:10px;">
                <button id="common-cancel">取消</button>
                <button id="common-save" style="margin-left:8px;">保存</button>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        const textarea = box.querySelector('#common-input');
        textarea.value = initialValue || '';
        textarea.focus();

        box.querySelector('#common-cancel').onclick = () => overlay.remove();
        box.querySelector('#common-save').onclick = () => {
            const value = textarea.value
                .split('\n')
                .map(v => v.trim())
                .filter(Boolean)
                .slice(0, 3);

            if (!value.length) {
                alert('请输入至少一个用户名');
                return;
            }

            onSave(value.join('\n'));
            overlay.remove();
        };
    }

    waitForElement('#batch-like-refresh-btn', (refreshBtn) => {
        const actions = refreshBtn.parentElement;
        if (!actions) return;

        // 控制整体布局，不动按钮样式
        actions.style.display = 'flex';
        actions.style.flexWrap = 'nowrap';
        actions.style.gap = '4px';

        if (document.getElementById('batch-like-common-fill')) return;

        // 新按钮
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.id = 'batch-like-common-edit';
        editBtn.textContent = '编辑常用';

        const fillBtn = document.createElement('button');
        fillBtn.type = 'button';
        fillBtn.id = 'batch-like-common-fill';
        fillBtn.textContent = '常用填充';

        // ⭐ 关键：继承“随机填充”按钮的样式
        editBtn.className = refreshBtn.className;
        fillBtn.className = refreshBtn.className;

        actions.insertBefore(editBtn, refreshBtn);
        actions.insertBefore(fillBtn, refreshBtn);

        const textarea = () => document.getElementById('batch-like-usernames');

        fillBtn.onclick = () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                textarea().value = saved;
                textarea().dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                showEditorDialog('', (text) => {
                    localStorage.setItem(STORAGE_KEY, text);
                    textarea().value = text;
                    textarea().dispatchEvent(new Event('input', { bubbles: true }));
                });
            }
        };

        editBtn.onclick = () => {
            const saved = localStorage.getItem(STORAGE_KEY) || '';
            showEditorDialog(saved, (text) => {
                localStorage.setItem(STORAGE_KEY, text);
            });
        };
    });
})();

// ==UserScript==
// @name         115网盘-在新窗口打开
// @namespace    http://tampermonkey.net/
// @version      20.0
// @author       Shane Yang
// @description  为115网盘右键添加“新窗口打开”功能
// @license      MIT
// @match        https://115.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559075/115%E7%BD%91%E7%9B%98-%E5%9C%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/559075/115%E7%BD%91%E7%9B%98-%E5%9C%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[115脚本] v20.0 加载：自然关闭模式');

    // =========================================================
    // 1. 存数据 (公共储物柜)
    // =========================================================
    document.addEventListener('mousedown', function(e) {
        if (e.button !== 2) return; // 只管右键

        const row = e.target.closest('li');
        if (!row) return;

        let cid = row.getAttribute('cate_id') ||
                  row.querySelector('input[type="checkbox"]')?.value ||
                  row.querySelector('a.name')?.getAttribute('cid');

        if (cid) {
            sessionStorage.setItem('tm_115_target_cid', cid);
        }
    }, true);


    // =========================================================
    // 2. 辅助函数：模拟在空白处点击
    // =========================================================
    function triggerPageReset() {
        const body = document.body;
        const eventParams = {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0 // 左键
        };

        // 既然要模拟点击空白处，我们必须让菜单自然关闭
        // 这一套动作发出去，115网页会认为用户点击了外面，自动收起菜单
        body.dispatchEvent(new MouseEvent('mousedown', eventParams));
        body.dispatchEvent(new MouseEvent('mouseup', eventParams));
        body.dispatchEvent(new MouseEvent('click', eventParams));
    }


    // =========================================================
    // 3. 插按钮
    // =========================================================
    function injectBtn() {
        const lis = document.querySelectorAll('li');

        lis.forEach(li => {
            if (li.innerText.includes('刷新') && !li.innerText.includes('窗口') && li.offsetParent) {

                const ul = li.parentNode;
                if (ul.querySelector('#tm-action-btn')) return;

                const btn = document.createElement('li');
                btn.id = 'tm-action-btn';
                btn.className = li.className;
                btn.style.display = 'list-item';

                btn.innerHTML = `
                    <a href="javascript:;" style="color: #06a7ff; font-weight: bold;">
                        <i class="icon-operate ifo-open"></i>
                        <span>在新窗口打开</span>
                    </a>
                `;

                // =========================================================
                // 4. 点击逻辑
                // =========================================================
                btn.onclick = function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    // 1. 获取 ID
                    const cid = sessionStorage.getItem('tm_115_target_cid');

                    // 2. 【核心修复】移除所有 style.display = 'none' 的操作！
                    // 不要手动隐藏菜单，而是调用下面的模拟点击函数

                    // 3. 模拟点击空白处 (这会自然关闭菜单，并刷新页面状态)
                    triggerPageReset();

                    // 4. 打开窗口
                    if (cid) {
                        const url = `https://115.com/?cid=${cid}&offset=0&mode=wangpan`;
                        window.open(url, '_blank');
                    } else {
                        // 兜底提示
                        console.log('CID缺失');
                    }
                };

                ul.insertBefore(btn, ul.firstChild);
            }
        });
    }

    setInterval(injectBtn, 500);

})();
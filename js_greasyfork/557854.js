// ==UserScript==
// @name         信息编号和名称采集工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  采集页面上信息编号和名称，并通过弹窗展示，支持一键复制和关闭。
// @author       你的名字
// @license      MIT
// @match        http://cms-common.lh.ccv/*
// @run-at       document-end
// @grant        none
// @language     javascript
// @downloadURL https://update.greasyfork.org/scripts/557854/%E4%BF%A1%E6%81%AF%E7%BC%96%E5%8F%B7%E5%92%8C%E5%90%8D%E7%A7%B0%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557854/%E4%BF%A1%E6%81%AF%E7%BC%96%E5%8F%B7%E5%92%8C%E5%90%8D%E7%A7%B0%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==== 可配置部分 ====
    const ITEM_SELECTOR = '.listItem';        // 每条信息的容器
    const ID_SELECTOR = '.info .num';         // 编号选择器
    const NAME_SELECTOR = '.info .name';      // 名称选择器（初版猜测）
    const POPUP_ID = 'tm_collect_popup';
    // ====================

    function extractItems() {
        const nodes = Array.from(document.querySelectorAll(ITEM_SELECTOR));
        const arr = nodes.map(node => {
            const idNode = node.querySelector(ID_SELECTOR);
            const nameNode = node.querySelector(NAME_SELECTOR);
            const id = idNode ? idNode.innerText.replace('编号：','').trim() : '';
            const name = nameNode ? nameNode.innerText.trim() : '';
            return {id, name};
        }).filter(x => x.id || x.name);
        return arr;
    }

    function showPopup(items) {
        let oldPopup = document.getElementById(POPUP_ID);
        if(oldPopup) oldPopup.remove();

        const popup = document.createElement('div');
        popup.id = POPUP_ID;
        Object.assign(popup.style, {
            position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '400px', background: '#fff', border: '2px solid #000',
            padding: '10px', zIndex: 9999, overflow: 'auto'
        });

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>编号</th><th>名称</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(it=>`<tr><td>${it.id}</td><td>${it.name}</td></tr>`).join('')}
            </tbody>
        `;
        table.querySelectorAll('td, th').forEach(td => td.style.border = '1px solid #ccc');
        popup.appendChild(table);

        const copyIdBtn = document.createElement('button');
        copyIdBtn.innerText = '复制编号';
        copyIdBtn.onclick = ()=> {
            const text = items.map(it=>it.id).join('\n');
            navigator.clipboard.writeText(text).then(()=>alert('编号已复制'));
        };

        const copyNameBtn = document.createElement('button');
        copyNameBtn.innerText = '复制名称';
        copyNameBtn.onclick = ()=> {
            const text = items.map(it=>it.name).join('\n');
            navigator.clipboard.writeText(text).then(()=>alert('名称已复制'));
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭';
        closeBtn.style.float = 'right';
        closeBtn.onclick = ()=>popup.remove();

        const btnDiv = document.createElement('div');
        btnDiv.style.margin = '10px 0';
        btnDiv.appendChild(copyIdBtn);
        btnDiv.appendChild(copyNameBtn);
        btnDiv.appendChild(closeBtn);
        popup.insertBefore(btnDiv, table);

        document.body.appendChild(popup);
    }

    function createCollectButton() {
        const btn = document.createElement('button');
        btn.innerText = '采集信息';
        Object.assign(btn.style, {
            position: 'fixed', top: '10px', right: '10px', zIndex: 9999, padding: '5px 10px'
        });
        btn.onclick = ()=>{
            const items = extractItems();
            showPopup(items);
        };
        document.body.appendChild(btn);
    }

    // 初始化
    createCollectButton();

})();
// ==UserScript==
// @name         祁诺采集
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  采集页面上信息编号和名称，并通过弹窗展示，支持一键复制和关闭。
// @author       你的名字
// @license      MIT
// @match        *://cms-common.lh.ccv/*
// @run-at       document-end
// @grant        none
// @language     javascript
// @downloadURL https://update.greasyfork.org/scripts/557857/%E7%A5%81%E8%AF%BA%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/557857/%E7%A5%81%E8%AF%BA%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==== 可配置部分 ====
    const ITEM_SELECTOR = '.listItem';        // 每条信息的容器
    const ID_SELECTOR = '.info .num';         // 编号选择器
    const NAME_SELECTOR = '.info .name';      // 名称选择器（初版猜测，可调）
    const POPUP_ID = 'tm_collect_popup';
    // ====================

    // 提取页面条目
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

    // 创建弹窗
    function showPopup(items) {
        let oldPopup = document.getElementById(POPUP_ID);
        if(oldPopup) oldPopup.remove();

        const popup = document.createElement('div');
        popup.id = POPUP_ID;
        Object.assign(popup.style, {
            position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '400px', background: '#fff', border: '2px solid #000',
            padding: '10px', zIndex: 9999, overflow: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.5)'
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

    // 创建采集按钮
    function createCollectButton() {
        // 防止重复创建
        if(document.getElementById('tm_collect_btn')) return;

        const btn = document.createElement('button');
        btn.id = 'tm_collect_btn';
        btn.innerText = '采集信息';
        Object.assign(btn.style, {
            position: 'fixed', top: '10px', right: '10px', zIndex: 9999, padding: '5px 10px',
            backgroundColor: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
        });
        btn.onmouseover = ()=>btn.style.backgroundColor='#e68900';
        btn.onmouseout = ()=>btn.style.backgroundColor='#ff9800';
        btn.onclick = ()=>{
            const items = extractItems();
            if(items.length === 0){
                alert('未找到任何条目，请先点击加载按钮显示数据！');
                return;
            }
            showPopup(items);
        };
        document.body.appendChild(btn);
    }

    // 页面加载完成后注入按钮
    window.addEventListener('load', ()=>{
        createCollectButton();
    });

})();
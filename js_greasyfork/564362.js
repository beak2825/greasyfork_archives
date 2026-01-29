// ==UserScript==
// @name         所有网站可编辑,同时编辑模式下防误点
// @namespace    http://tampermonkey.net/
// @version      2026-01-28
// @description  添加一键切换可编辑按钮
// @author       月不留名
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564362/%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E5%8F%AF%E7%BC%96%E8%BE%91%2C%E5%90%8C%E6%97%B6%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F%E4%B8%8B%E9%98%B2%E8%AF%AF%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/564362/%E6%89%80%E6%9C%89%E7%BD%91%E7%AB%99%E5%8F%AF%E7%BC%96%E8%BE%91%2C%E5%90%8C%E6%97%B6%E7%BC%96%E8%BE%91%E6%A8%A1%E5%BC%8F%E4%B8%8B%E9%98%B2%E8%AF%AF%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //创建按钮
    const editBtn = GM_addElement(document.body,'button',{
        id: 'edit-toggle-btn',
        textContent: '📝切换编辑模式',
        style:`
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 5px 4px;
        background-color: #007bff;
        font-size: 14px;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;      `
    });
    editBtn.addEventListener('click',()=>{
        const isEditing = document.designMode === 'on';
        const nextMode = isEditing?'off':'on';
        document.designMode = nextMode;
        if(nextMode==='on'){
            document.addEventListener('click',blockClicksExceptButton,true);
        }else{
            document.removeEventListener('click',blockClicksExceptButton,true);
        }
        alert(nextMode==='on'?'已开启可编辑模式':'已关闭可编辑模式');
    });

    function blockClicksExceptButton(e){
        const btn = document.getElementById('edit-toggle-btn');
        if(btn&&(e.target===btn||btn.contains(e.target))){
            return;//点击的是按钮本身，允许执行
        }
        e.preventDefault();
        e.stopPropagation();
    }
})();
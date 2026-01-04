// ==UserScript==
// @name         Douyin Live Entry Blocker
// @namespace    https://greasyfork.org/users/815244
// @version      1.0.0
// @description  屏蔽抖音网页推荐直播进入直播间按钮
// @author       ChatGPT
// @match        https://*.douyin.com/*
// @match        https://douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548621/Douyin%20Live%20Entry%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/548621/Douyin%20Live%20Entry%20Blocker.meta.js
// ==/UserScript==
(function(){
    'use strict';

    function hideNode(node){
        if(!node || !node.style || node.__hiddenByScript) return;
        node.__hiddenByScript = true;
        node.style.setProperty('display','none','important');
        node.style.setProperty('pointer-events','none','important');
    }

    function isLiveEntry(el){
        if(!el || !(el instanceof Element)) return false;
        // 匹配特定 class，或者包含 "点击或按" + "进入直播间" 文本
        const text = el.innerText || '';
        if(text.includes('进入直播间')) return true;
        if(el.classList.contains('eUQG8mCR') || el.classList.contains('nJUIPkes')) return true;
        return false;
    }

    function scanAndHide(root){
        if(!root) return;
        if(isLiveEntry(root)) { hideNode(root); return; }
        const candidates = root.querySelectorAll('div,section,aside');
        for(const c of candidates){
            if(isLiveEntry(c)) hideNode(c);
        }
    }

    if(document.readyState !== 'loading'){
        scanAndHide(document.body);
    } else {
        document.addEventListener('DOMContentLoaded', ()=>scanAndHide(document.body));
    }

    // 动态监听新弹出的直播入口
    const mo = new MutationObserver(muts=>{
        for(const m of muts){
            m.addedNodes.forEach(n=>{
                if(n instanceof Element) scanAndHide(n);
            });
        }
    });
    mo.observe(document.documentElement, {childList:true, subtree:true});
})();

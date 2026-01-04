// ==UserScript==
// @name         Douyin Popup Blocker
// @namespace    https://greasyfork.org/users/815244
// @version      1.0.1
// @description  屏蔽抖音网页上的购物/推荐浮层和直播入口弹层，让视频观看更干净。动态生成的浮层也会自动屏蔽。
// @author       ChatGPT
// @match        https://*.douyin.com/*
// @match        https://douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548619/Douyin%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/548619/Douyin%20Popup%20Blocker.meta.js
// ==/UserScript==
(function(){
    'use strict';

    function hideNode(node){
        if(!node || !node.style || node.__hiddenByScript) return;
        node.__hiddenByScript = true;
        node.style.setProperty('display','none','important');
        node.style.setProperty('pointer-events','none','important');
    }

    function isProductPopup(el){
        if(!el || !(el instanceof Element)) return false;

        // 1. 弹窗通常是浮层（fixed/absolute）且小于屏幕一半
        const style = window.getComputedStyle(el);
        const w = el.offsetWidth, h = el.offsetHeight;
        const vw = window.innerWidth, vh = window.innerHeight;
        if((style.position==='fixed' || style.position==='absolute') && (w<vw*0.6 && h<vh*0.6)){
            // 2. 内容匹配购物关键字
            const text = el.innerText || '';
            if(/(大促价|立即购买|去看看|加入购物车|全部商品|¥|￥)/.test(text)){
                // 3. 不含视频元素
                if(!el.querySelector('video,[role="video"],.player-container')) return true;
            }
        }

        // 4. 特定 data-e2e 购物容器
        if(el.matches('[data-e2e="yellowCart-container"]')) return true;

        return false;
    }

    function scanAndHide(root){
        if(!root) return;
        if(isProductPopup(root)) { hideNode(root); return; }
        const candidates = root.querySelectorAll('div,section,aside');
        for(const c of candidates){
            if(isProductPopup(c)) hideNode(c);
        }
    }

    // 初次运行
    if(document.readyState !== 'loading'){
        scanAndHide(document.body);
    } else {
        document.addEventListener('DOMContentLoaded', ()=>scanAndHide(document.body));
    }

    // 动态监听
    const mo = new MutationObserver(muts=>{
        for(const m of muts){
            m.addedNodes.forEach(n=>{
                if(n instanceof Element) scanAndHide(n);
            });
        }
    });
    mo.observe(document.documentElement, {childList:true, subtree:true});
})();

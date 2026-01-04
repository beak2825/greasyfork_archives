// ==UserScript==
// @name         Bilibili 干净链接 + 分享净化
// @namespace    Motoori Kashin
// @version      3.1.0
// @description  清理 B 站链接垃圾参数，点击分享按钮复制干净链接
// @author       ChatGPT
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552974/Bilibili%20%E5%B9%B2%E5%87%80%E9%93%BE%E6%8E%A5%20%2B%20%E5%88%86%E4%BA%AB%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/552974/Bilibili%20%E5%B9%B2%E5%87%80%E9%93%BE%E6%8E%A5%20%2B%20%E5%88%86%E4%BA%AB%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------- URL 清理逻辑 --------------------
    const paramsSet = new Set([
        'spm_id_from','from_source','msource','bsource','seid','source','session_id','visit_id',
        'sourceFrom','from_spmid','share_source','share_medium','share_plat','share_session_id',
        'share_tag','unique_k','csource','vd_source','tab','is_story_h5','share_from','plat_id',
        '-Arouter','spmid'
    ]);

    function cleanURL(str) {
        try {
            const url = new URL(str, location.origin);
            paramsSet.forEach(p => url.searchParams.delete(p));
            return url.toString();
        } catch(e) {
            return str;
        }
    }

    function cleanLocation() {
        const cleanHref = cleanURL(location.href);
        if (location.href !== cleanHref) {
            history.replaceState(history.state, "", cleanHref);
        }
    }

    function cleanAnchors(list) {
        list.forEach(a => {
            if (a.href) {
                a.href = a.href.replace('bilibili.tv', 'bilibili.com'); // tv域名修复
                a.href = cleanURL(a.href);
            }
        });
    }

    function clickHandler(e) {
        let t = e.target;
        while(t && t.tagName !== 'A') t = t.parentNode;
        if (t && t.tagName === 'A') cleanAnchors([t]);
    }

    // -------------------- clipboard 劫持 --------------------
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async function(text) {
        if (typeof text === 'string' && text.includes('bilibili.com')) {
            text = text.replace(/([&?])(share_source|vd_source)=[^&]*/g, (m,p1)=>p1==='?'?'?':'');
            text = text.replace(/&+/g,'&').replace(/\?&/,'?').replace(/[&?]$/,'');
        }
        return originalWriteText(text);
    };

    // -------------------- 分享按钮提示 --------------------
    const boundBtns = new WeakSet();

    function bindShareButton(btn) {
        if (boundBtns.has(btn)) return;
        boundBtns.add(btn);

        btn.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();

            const cleanLink = cleanURL(location.href);

            navigator.clipboard.writeText(cleanLink)
                .then(() => showCopied())
                .catch(() => alert('复制失败'));
        }, true);
    }

    function showCopied() {
        const div = document.createElement('div');
        div.textContent = '✔ 干净链接已复制';
        div.style.cssText =
            'position: fixed; top: 20px; left: 50%; transform: translateX(-50%);' +
            'background: rgba(0,0,0,0.8); color: #fff; padding: 6px 12px;' +
            'border-radius: 6px; z-index: 999999; font-size: 13px; font-weight: bold;';
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 1500);
    }

    function observeShareButtons() {
        document.querySelectorAll('.video-share-icon.video-toolbar-item-icon').forEach(bindShareButton);
    }

    // -------------------- MutationObserver --------------------
    const observer = new MutationObserver(() => {
        cleanLocation();
        cleanAnchors(document.querySelectorAll('a'));
        observeShareButtons();
    });

    observer.observe(document, { childList: true, subtree: true });

    // -------------------- 全局事件绑定 --------------------
    window.addEventListener('click', clickHandler);
    window.addEventListener('contextmenu', clickHandler);

    // 页面加载时处理一次
    window.addEventListener('load', () => {
        cleanLocation();
        cleanAnchors(document.querySelectorAll('a'));
        observeShareButtons();
    });

    console.log('Bilibili 干净链接 + 分享净化脚本已加载');
})();

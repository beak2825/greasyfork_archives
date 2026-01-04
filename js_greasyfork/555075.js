// ==UserScript==
// @name         Kimi宽度优化
// @version      1.1
// @description  Kimi 对话界面优化宽度，包括答复结果与聊天输入框。
// @author       Stuart.Z 
// @match        *://kimi.com/chat/*
// @match        *://*.kimi.com/chat/*
// @match        *://*.kimi.com/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0 License
// @namespace https://greasyfork.org/users/324739
// @downloadURL https://update.greasyfork.org/scripts/555075/Kimi%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/555075/Kimi%E5%AE%BD%E5%BA%A6%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==



(function() {
    'use strict';


    const nukeCustomBg = () => {
       const editorElement = document.querySelector('.chat-editor');
        if (editorElement) {
            editorElement.style.maxWidth = '1024px';
            editorElement.style.width = '100%';
            editorElement.setAttribute('data-style-modified', 'true');
        }

        const showElement = document.querySelector('.chat-content-list');
        if (showElement) {
            showElement.style.maxWidth = '1024px';
            showElement.style.width = '100%';
            showElement.setAttribute('data-style-modified', 'true');
        }


    };

  
    const debouncedNuke = debounce(nukeCustomBg, 100);

   
    const observer = new MutationObserver(debouncedNuke);
    observer.observe(document, {
        childList: true,
        subtree: true
    });

  
    nukeCustomBg();

 
    function debounce(fn, delay) {
        let timer;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, arguments), delay);
        };
    }

 
    const _pushState = history.pushState;
    history.pushState = function() {
        _pushState.apply(this, arguments);
        setTimeout(nukeCustomBg, 50);
    };
})();


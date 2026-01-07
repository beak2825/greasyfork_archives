// ==UserScript==
// @name         学习强国自动静音 (xuexi.cn One-time Mute)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  打开页面时视频自动静音，之后您可以手动开启声音，脚本不会干扰。
// @author       Gemini
// @match        *://*.xuexi.cn/*
// @match        *://www.xuexi.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561692/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%20%28xuexicn%20One-time%20Mute%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561692/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%20%28xuexicn%20One-time%20Mute%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 单次静音函数
     * 给视频打上标记，保证只静音一次，不影响后续手动操作
     */
    function muteOnce(element) {
        if (element.dataset.hasMuted) return; // 如果已经处理过，直接跳过
        
        element.muted = true;
        element.dataset.hasMuted = "true"; // 标记为“已自动静音过”
        // console.log('已执行初始化静音，后续可手动调节');
    }

    // 1. 核心逻辑：使用观察者监听新加入的视频标签
    // 必须保留这个监听，因为 xuexi.cn 的视频是网页打开后几秒才加载出来的
    // 但它现在只处理“新加入”的瞬间，不占用任何后台资源
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                    // 检查直接插入的 video/audio 标签
                    if (node.tagName === 'VIDEO' || node.tagName === 'AUDIO') {
                        muteOnce(node);
                    }
                    // 检查插入的容器内部是否包含 video/audio
                    if (node.querySelectorAll) {
                        const medias = node.querySelectorAll('video, audio');
                        medias.forEach(muteOnce);
                    }
                });
            }
        });
    });

    // 开始监听（只监听节点添加，开销极低）
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();
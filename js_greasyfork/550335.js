// ==UserScript==
// @name         凉山州专业技术人员继续教育刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      2.0
// @description  该油猴脚本用于 凉山州专业技术人员继续教育 的辅助看课，脚本功能如下：解除视频自动暂停限制、视频自动播放、自动切换右侧章节
// @author       脚本喵
// @match        https://lsjjpx.com/*
// @run-at       document-start
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550335/%E5%87%89%E5%B1%B1%E5%B7%9E%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550335/%E5%87%89%E5%B1%B1%E5%B7%9E%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // 存储所有事件监听器的全局对象
    const _eventListeners = new WeakMap();

    // 劫持addEventListener
    const _originalAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (!_eventListeners.has(this)) {
            _eventListeners.set(this, {});
        }
        const listeners = _eventListeners.get(this);
        if (!listeners[type]) {
            listeners[type] = [];
        }
        listeners[type].push({ listener, options });
        return _originalAdd.call(this, type, listener, options);
    };

    // 劫持removeEventListener
    const _originalRemove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
        if (_eventListeners.has(this)) {
            const listeners = _eventListeners.get(this);
            if (listeners[type]) {
                listeners[type] = listeners[type].filter(
                    l => l.listener !== listener || l.options !== options
                );
            }
        }
        return _originalRemove.call(this, type, listener, options);
    };

    // 自定义getEventListeners方法
    window.getEventListeners = function (target) {
        return _eventListeners.get(target) || {};
    };
    setTimeout(function () {
        // 遍历并移除window的blur事件
        const listeners = window.getEventListeners(window).blur;
        console.log(listeners)
        if (listeners) {
            listeners.forEach(listener => {
                window.removeEventListener('blur', listener.listener);
            });
        }
    }, 3000)



    setInterval(function () {
        var video = document.querySelector("video")
        if (video && video.paused && !video.ended) {
            video.play()
        }

        if (video && video.ended) {
            var nowIndex
            for (let i = 0; i < document.querySelectorAll(".chapter-nav .chapter-item").length; i++) {
                var item = document.querySelectorAll(".chapter-nav .chapter-item")[i]
                if (item.innerHTML.indexOf("red-text") != -1) {
                    nowIndex = i
                    break
                }
            }

            if (nowIndex + 1 < document.querySelectorAll(".chapter-nav .chapter-item").length) {
                if (document.querySelectorAll(".chapter-nav .chapter-item")[nowIndex + 1].querySelector("span")) {
                    document.querySelectorAll(".chapter-nav .chapter-item")[nowIndex + 1].querySelector("span").click()
                }
                if (document.querySelectorAll(".chapter-nav .chapter-item")[nowIndex + 1].querySelector("a")) {
                    document.querySelectorAll(".chapter-nav .chapter-item")[nowIndex + 1].querySelector("a").click()
                }
            }
        }
    }, 3000)


})();

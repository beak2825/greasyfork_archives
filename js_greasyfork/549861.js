// ==UserScript==
// @name         山东省教师教育网刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      3.0
// @description  该油猴脚本用于山东省教师教育网的辅助看课，脚本功能如下：解除视频自动暂停的限制
// @author       脚本喵
// @match        https://player.qlteacher.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549861/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549861/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if(window.onblur!==null){
            window.onblur=null;
        }
        if(args.length!==0&&args[0]==='visibilitychange'){
            console.log('劫持visibilitychange成功，奥利给！')
            return;
        }
        if(args.length!==0&&args[0]==='blur'){
            console.log('劫持blur成功，奥利给！')
            return;
        }
        return oldadd.call(this,...args)
    }


    Object.defineProperty(document, 'hidden', {
        get: () => false,
        configurable: false,
        enumerable: true
    });

    // 同时需要修改visibilityState状态
    Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible',
        configurable: false,
        enumerable: true
    });

    // 阻止visibilitychange事件触发
    document.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);

})();
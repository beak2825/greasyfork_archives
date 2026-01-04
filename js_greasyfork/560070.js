// ==UserScript==
// @name         网易登录智能重定向到原生战网登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据fromApp参数值重定向到不同的暴雪登录页面
// @author       七色逆光 使用deepseek创作
// @match        https://oauth.g.mkey.163.com/*
// @grant        none
// @run-at       document-start
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/560070/%E7%BD%91%E6%98%93%E7%99%BB%E5%BD%95%E6%99%BA%E8%83%BD%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E5%8E%9F%E7%94%9F%E6%88%98%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/560070/%E7%BD%91%E6%98%93%E7%99%BB%E5%BD%95%E6%99%BA%E8%83%BD%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E5%8E%9F%E7%94%9F%E6%88%98%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 解析URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const fromAppValue = urlParams.get('fromApp');

    // 根据fromApp参数的值执行不同的重定向
    if (fromAppValue === 'app') {
        // 停止页面加载
        window.stop();

        // 重定向到带app参数的暴雪登录页面
        const targetUrl = 'https://account.battlenet.com.cn/login/zh/?app=apph&showCredentials=true';
        window.location.replace(targetUrl);

        console.log('检测到fromApp=app参数，重定向到带app参数的暴雪登录页面');

    } else if (fromAppValue === 'oauth') {
        // 停止页面加载
        window.stop();

        // 重定向到不带app参数的暴雪登录页面
        const targetUrl = 'https://account.battlenet.com.cn/login/zh/?showCredentials=true';
        window.location.replace(targetUrl);

        console.log('检测到fromApp=oauth参数，重定向到不带app参数的暴雪登录页面');
    }

    // 如果fromApp参数不是上述两个值，则不执行任何操作，让页面正常加载
})();
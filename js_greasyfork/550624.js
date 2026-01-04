// ==UserScript==
// @name         自动填写账号密码(凌波微步和万维专用)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写凌波微步和万维系统的登录表单账号密码
// @author       damu
// @match        http://biaoju.labelvibe.com:8088/*
// @match        https://wanwei.myapp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550624/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%28%E5%87%8C%E6%B3%A2%E5%BE%AE%E6%AD%A5%E5%92%8C%E4%B8%87%E7%BB%B4%E4%B8%93%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550624/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%28%E5%87%8C%E6%B3%A2%E5%BE%AE%E6%AD%A5%E5%92%8C%E4%B8%87%E7%BB%B4%E4%B8%93%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================
    // 用户配置区域 - 请在此修改账号密码
    // ======================
    const LBWB_USERNAME = "dtzhangqingjie"; // 凌波微步账号
    const LBWB_PASSWORD = "12345678"; // 凌波微步密码
    const WW_USERNAME = "lingboweibu(beijing)kejiyouxiangongsi_1124740151769800704"; // 万维账号
    const WW_PASSWORD = "SxHMGPX43zybDQus"; // 万维密码


    // ======================
    // 通用配置
    // ======================
    const config = {
        domainLbwb: "biaoju.labelvibe.com", // 凌波微步域名
        domainWw: "wanwei.myapp.com", // 万维域名
        maxRetry: 1, // 最大重试次数(可修改,默认重试1次,不希望重试可设置为0)
        interval: 300, // 检查间隔(毫秒)
        debug: true // 调试模式
    };

    // ======================
    // 核心功能实现
    // ======================
    // 主填充函数
    function fillForm() {
        const currentUrl = window.location.href;
        // 根据URL选择填充函数
        var accountInput = null;
        var passwordInput = null;
        if (currentUrl.includes(config.domainLbwb)) {
            console.warn('凌波微步');
            accountInput = document.querySelector('input[placeholder="账号"]');
            passwordInput = document.querySelector('input[placeholder="密码"]');
            accountInput.value = LBWB_USERNAME;
            passwordInput.value = LBWB_PASSWORD;
        } else if (currentUrl.includes(config.domainWw)) {
            console.warn('万维');
            accountInput = document.querySelector('input[placeholder="请输入登录名"]');
            passwordInput = document.querySelector('input[placeholder="请输入密码"]');
            accountInput.value = WW_USERNAME;
            passwordInput.value = WW_PASSWORD;
        } else {
            console.warn('无匹配选项');
            return;
        }
        if (!accountInput || !passwordInput) return false;

        // 触发表单验证
        accountInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
    }

    // ======================
    // 页面加载处理
    // ======================
    let retryCount = 0;

    function initAutoFill() {
        if (fillForm()) {
            if (config.debug) console.log('表单自动填写成功');
        } else if (retryCount < config.maxRetry) {
            retryCount++;
            if (config.debug) console.log(`表单未找到，重试中 (${retryCount}/${config.maxRetry})`);
            setTimeout(initAutoFill, config.interval);
        } else {
            if (config.debug) console.warn('无法找到表单元素，请检查页面结构');
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', initAutoFill);
})();
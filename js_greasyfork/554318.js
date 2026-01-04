// ==UserScript==
// @name         Fk Netease Music Web
// @name:zh-CN   网易云 Web端 歌单解锁
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  通过教程修改网易云音乐的 Cookie (os=pc)，强制让其认为在客户端，从而展开完整歌单。推荐 Linux 用户使用。功能开启后，歌单的收藏和创建可能会异常。
// @author       Gemini
// @match        *://music.163.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.163.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554318/Fk%20Netease%20Music%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/554318/Fk%20Netease%20Music%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 开关的键名
    const PROJECT = 'Music163CookiePc';


    /**
     * 设置 os=pc 的 Cookie
     */
    function setPcCookie() {
        // 不长期有效了
        // const expiryDate = new Date();
        // expiryDate.setFullYear(expiryDate.getFullYear() + 10);
        // const cookieString = `os=pc; path=/; domain=.163.com; expires=${expiryDate.toUTCString()}`;
        const cookieString = `os=pc; path=/;`;
        document.cookie = cookieString;
        console.log('Fk Netease: 已成功设置 Cookie "os=pc"');
    }

    /**
     * 切换功能的启用/禁用状态
     */
    function toggleFeature() {
        console.log("Fk Music163 toggle");
        let currentState = GM_getValue(PROJECT, false);
        let newState = !currentState;
        console.log(newState);
        GM_setValue(PROJECT, newState);
        if (newState){
            alert("Fk Music163 已切换为: ✅\n刷新页面生效。");
            console.log("1");
        }else{
            alert("Fk Music163 已切换为: ❌\n可能需要重启浏览器 Cookie 才会失效。");
            console.log("2");
        }
    }

    /**
     * 注册Tampermonkey菜单命令
     */
    function InitMenu() {
        let isEnabled = GM_getValue(PROJECT, false);
        let menuText = `pc=os (当前: ${isEnabled ? '✅' : '❌'})`;
        console.log("Fk Music163 load.");
        // 注册菜单项
        GM_registerMenuCommand(menuText, toggleFeature);
        return isEnabled;
    }

    if (window.self === window.top) {
         InitMenu();
    }

    const isFeatureEnabled = GM_getValue(PROJECT, false);
    if (isFeatureEnabled) {
        setPcCookie();
    } else {
        // console.log('Fk Music163: Off');
    }
})();
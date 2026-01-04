// ==UserScript==
// @name         【水源社区】隐藏个人主页邮箱
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  隐藏个人主页邮箱
// @author       来自深渊
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        unsafeWindow
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/559769/%E3%80%90%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E3%80%91%E9%9A%90%E8%97%8F%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E9%82%AE%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/559769/%E3%80%90%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E3%80%91%E9%9A%90%E8%97%8F%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E9%82%AE%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        function addStyle(styles, element_id) {
            if (document.getElementById(element_id)) {
                return;
            }

            let style = document.createElement("style");
            style.id = element_id;
            style.innerHTML = styles;
            document.head.appendChild(style);
        }

        function injectStyles() {
            addStyle(`
                .user-main .about .email {
                    display: none !important;
                }
            `, 'niko-discourse-hide-email-style');
        }

        if (window.location.pathname.startsWith('/u/')) {
            injectStyles();
        }

        let req;
        try { req = unsafeWindow.require; } catch(e){}
        if (!req) req = window.require;

        if (!req) { console.warn(`require = ${req}`); }
        else if (!req.has) { console.warn(`require.has = ${req.has}`); }
        else if (!req.has('discourse/lib/plugin-api')) { console.warn(`Discoure plugin API is unavailable.`); }
        else {
            console.log("【隐藏个人主页邮箱】已加载。");
            req('discourse/lib/plugin-api').withPluginApi("0.8.0", (api) => {
                api.onPageChange((url, title) => {
                    if (/^\/u\/[^/]+/.test(url)) {
                        injectStyles();
                    }
                });
            });
        }
    }, 1000);
})();
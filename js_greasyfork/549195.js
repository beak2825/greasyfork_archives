// ==UserScript==
// @name         简道云外联赋予名字
// @namespace    zerobiubiu.top
// @version      1.0
// @description  在简道云表单后台快速切换同应用下的不同表单。支持中英文首字母排序和分组。
// @author       zerobiubiu
// @match        https://uecztae7lh.jiandaoyun.com/f/*
// @license      MIT
// @icon         chrome-extension://jpejneelbjckppjapemgfeheifljmaib/_favicon/?pageUrl=https%3A%2F%2Fwww.jiandaoyun.com%2Fdashboard%23%2F&size=32
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/549195/%E7%AE%80%E9%81%93%E4%BA%91%E5%A4%96%E8%81%94%E8%B5%8B%E4%BA%88%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/549195/%E7%AE%80%E9%81%93%E4%BA%91%E5%A4%96%E8%81%94%E8%B5%8B%E4%BA%88%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==
(async function () {
    'use strict';


    GM_registerMenuCommand('挂载名字', async () => {
        if (document.querySelector("#root > div > div > div > div.wx-enhance-content > div > div:nth-child(4)")) {
            alert("名字存在");
            return;
        }
        const newDiv = document.createElement('div');
        newDiv.className = 'desc';
        newDiv.style.fontSize = "xxx-large";
        newDiv.style.color = "red";
        newDiv.textContent = document.title;

        document.querySelector("#root > div > div > div > div.wx-enhance-content > div").appendChild(newDiv);
    });


    // 监听执行锁
    let executed = false;
    // 创建监听事件
    const observer = new MutationObserver(async (mutationsList, observer) => {
        const Instruction_Page = document.querySelector("#root > div > div > div > div.wx-enhance-content > div");

        if (Instruction_Page && !executed) {
            executed = true; // 上锁，防止重复执行
            observer.disconnect(); // 找到后立即停止监听，提高性能
            const newDiv = document.createElement('div');
            newDiv.className = 'desc';
            newDiv.style.fontSize = "xxx-large";
            newDiv.style.color = "red";
            newDiv.textContent = document.title;

            document.querySelector("#root > div > div > div > div.wx-enhance-content > div").appendChild(newDiv);
        }
    });

    // 启动 observer
    observer.observe(document.querySelector("#root"), {
        childList: true,
        subtree: true
    });
})();
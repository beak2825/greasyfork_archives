// ==UserScript==
// @name         城通网盘第三方解析
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在城通网盘文件下载页面添加一个第三方解析按钮，方便快速下载。
// @author       Gemini & kc0ed
// @license      MIT
// @match        https://*.ctfile.com/f/*
// @grant        none
// @icon         https://webapi.ctfile.com/assets/img/illustrations/logo.png
// @downloadURL https://update.greasyfork.org/scripts/549695/%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E7%AC%AC%E4%B8%89%E6%96%B9%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/549695/%E5%9F%8E%E9%80%9A%E7%BD%91%E7%9B%98%E7%AC%AC%E4%B8%89%E6%96%B9%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 第三方解析站点的基础URL
    const thirdPartyBaseUrl = 'https://ctfile.qinlili.bid/';

    /**
     * 解析当前页面的URL，提取文件ID和访问密码
     * @returns {object|null} 包含file和pass的对象，如果解析失败则返回null
     */
    function parseCtfileUrl() {
        const currentUrl = window.location.href;
        // 正则表达式匹配 /f/之后到?之前的内容 (file) 和 p=之后的内容 (pass)
        const regex = /\/f\/([^?]+)\?p=(\d+)/;
        const matches = currentUrl.match(regex);

        if (matches && matches.length === 3) {
            return {
                file: matches[1], // 文件ID
                pass: matches[2]  // 访问密码
            };
        }
        console.warn('CTFile Helper: 未能从当前URL中解析出文件ID和密码。');
        return null;
    }

    /**
     * 创建并添加“第三方解析”按钮
     */
    function addThirdPartyButton() {
        // 定位到“举报”按钮的父容器，这是所有按钮的家
        const buttonContainer = document.querySelector('a.btn.btn-warning.ml-3')?.parentElement;

        if (!buttonContainer) {
            console.warn('CTFile Helper: 未找到按钮容器，无法添加按钮。');
            return;
        }

        // 检查按钮是否已经存在，防止重复添加
        if (document.getElementById('third-party-parse-btn')) {
            return;
        }

        const urlParts = parseCtfileUrl();
        if (!urlParts) {
            return;
        }

        // 构建第三方解析链接
        const newUrl = `${thirdPartyBaseUrl}?file=${urlParts.file}&pass=${urlParts.pass}`;

        // 创建新的按钮元素 (<a> 标签)
        const newButton = document.createElement('a');
        newButton.id = 'third-party-parse-btn'; // 添加ID以便识别
        newButton.href = newUrl;
        newButton.target = '_blank'; // 在新标签页打开
        newButton.textContent = '第三方解析'; // 按钮显示的文字

        // 设置样式，与旁边的按钮保持一致
        // 'btn-primary' 是蓝色，您也可以换成 'btn-success'(绿色), 'btn-info'(青色) 等
        newButton.className = 'btn btn-primary ml-3';

        // 将新按钮添加到容器中
        buttonContainer.appendChild(newButton);

        console.log('CTFile Helper: “第三方解析”按钮已成功添加！');
    }

    // 由于城通网盘的页面元素可能是动态加载的，
    // 我们使用一个定时器来轮询检查目标元素是否出现。
    const checkInterval = setInterval(() => {
        // 检查“举报”按钮是否存在，作为页面加载完成的标志
        if (document.querySelector('a.btn.btn-warning.ml-3')) {
            // 元素已出现，执行添加按钮的函数
            addThirdPartyButton();
            // 清除定时器，避免不必要的性能消耗
            clearInterval(checkInterval);
        }
    }, 500); // 每500毫秒检查一次

})();

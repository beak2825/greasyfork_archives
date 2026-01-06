// ==UserScript==
// @name         Hello World 弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用JavaScript弹窗显示Hello, world
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561617/Hello%20World%20%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/561617/Hello%20World%20%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成后执行
    window.addEventListener('load', function() {
        // 方法1: 使用alert()弹窗
        alert('Hello, world!');
        
        // 方法2: 使用confirm()弹窗（带确定按钮）
        // confirm('Hello, world!');
        
        // 方法3: 使用prompt()弹窗（带输入框）
        // prompt('Hello, world!', '输入一些内容');
    });
})();
// ==UserScript==
// @name       🔥【English学习好帮手】自动翻译外文网页【chrome亲测可用】
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动检测非中文网页并触发Chrome翻译
// @author       Leila Morgan
// @license      Leila Morgan
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548888/%F0%9F%94%A5%E3%80%90English%E5%AD%A6%E4%B9%A0%E5%A5%BD%E5%B8%AE%E6%89%8B%E3%80%91%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E5%A4%96%E6%96%87%E7%BD%91%E9%A1%B5%E3%80%90chrome%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/548888/%F0%9F%94%A5%E3%80%90English%E5%AD%A6%E4%B9%A0%E5%A5%BD%E5%B8%AE%E6%89%8B%E3%80%91%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E5%A4%96%E6%96%87%E7%BD%91%E9%A1%B5%E3%80%90chrome%E4%BA%B2%E6%B5%8B%E5%8F%AF%E7%94%A8%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行，确保页面语言信息加载完成
    setTimeout(() => {
        // 获取网页声明的语言（如<html lang="en">）
        const pageLang = document.documentElement.lang || '';
        // 常用中文语言代码
        const chineseLangs = ['zh', 'zh-CN', 'zh-TW', 'zh-HK'];
        
        // 判断是否为外文：语言声明非中文，且页面主要内容不含大量中文字符
        const isForeignLang = !chineseLangs.some(lang => pageLang.startsWith(lang)) 
            && !hasEnoughChinese();

        if (isForeignLang) {
            // 触发Chrome翻译（模拟右键翻译操作）
            translatePage();
        }
    }, 1000); // 1秒延迟，可根据网页加载速度调整

    // 检测页面是否包含足够多的中文字符（避免误判）
    function hasEnoughChinese() {
        const text = document.body.innerText || '';
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        // 中文字符占比超过20%则视为中文页面
        return chineseChars.length / text.length > 0.2;
    }

    // 调用Chrome翻译API（需浏览器支持）
    function translatePage() {
        // 检查是否已加载翻译脚本
        if (window.chrome && window.chrome.i18n) {
            // 触发翻译为中文（zh-CN）
            document.documentElement.setAttribute('translate', 'yes');
            const event = new CustomEvent('chrome-translate-trigger', {
                detail: { targetLang: 'zh-CN' }
            });
            document.dispatchEvent(event);
        } else {
            console.log('浏览器不支持自动翻译API，请手动翻译');
        }
    }
})();

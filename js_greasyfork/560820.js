// ==UserScript==
// @name         百度日期高亮
// @namespace    http://tampermonkey.net/
// @version      1.0-2025-12-30
// @description  highlight
// @author       tommyChen
// @match        *://*.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/560820/%E7%99%BE%E5%BA%A6%E6%97%A5%E6%9C%9F%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/560820/%E7%99%BE%E5%BA%A6%E6%97%A5%E6%9C%9F%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const notEnd = '个';

    /********************************************
   * 日期改色函数
   ********************************************/
    function runDateHighlight() {

        const hanNum = '(?:一|二|三|四|五|六|七|八|九|十)?(?:一|单|两|二|三|四|两|五|六|七|八|九|十)(?:多)?';
        const liangCi = '(?:亿万|万亿|千亿|百亿|十亿|千万|百万|十万|亿|万|千|百|十|个|\\+)?';
        const qmcEN = '(?:in|to|for|into|of|by|since|at|on|with|from|about|through|over|under|between|among|across|toward|towards|against|beside|before|after|except|including|like|without|year|trends)';
        const kg = '(?: |\\s*)?';
        const noNum = '(?!\\d)';

        const datePatterns = [
            // 每句都有特定不可选的项
            // 🔻 0000.00.00
            noNum + '\\d{4}' + noNum + kg + '(?:-|.|/)' + kg + noNum + '\\d{2}' + noNum + kg + '(?:-|.|/)' + kg + noNum + '\\d{2}' + noNum,

            // 🔻 0000-00-00
            '\\b\\d{4}' + kg + '-' + kg + '\\d{2}' + kg + '-' + kg + '\\d{2}\\b',

            // 🔻 00小时00分00秒
            '(截(?:至|止))?\\d+' + kg + '(?:年|小时|时)' + kg + '\\d+' + kg + '(?:月|分钟|分)' + kg + '\\d+' + kg + '(?:日|秒钟|秒)',

            // 🔻 00年00月~00月
            '\\d+' + kg + '年' + kg + '\\d+' + kg + '(?:月)?' + kg + '(?:-|~)' + kg + '\\d+月',

            // 🔻 0000年00月00日
            '\\d+' + kg + '(?:年|月)' + kg + '\\d+' + kg + '(?:月|日)',

            // 🔻 今年第一季度
            '(?:(\\d+)|(?:上个|最新|春节|连续|今|去|前|明|本)|'+ hanNum + ')' + kg + '(年)?(的)?(整个)?' + kg + '第?' + hanNum + '?个?(?:季度|多月|月份)',

            // 🔻 00-00
            '\\b' + noNum + '\\d{1,2}' + noNum + kg + '-' + kg + noNum + '\\d{1,2}' + kg + '(?=\\s|$)',

            // 🔻 截止0000年
            '(?:(截(?:至|止))|((?:前|今|明|去|后|同)年))?' + kg + '(?:(\\d+)|' + hanNum + ')' + kg + '(?:月份|月)' + kg + '(?:(\\d+)|' + hanNum + ')?' + kg + '(?:日|底|号|初|中|末)?',

            // 🔻 过去0000年-0000年
            '(?:过去|最近|未来|半年|凌晨|那|这|上|下|第)?(的)?' + kg + noNum + '(?:\\d{1,4}|' + hanNum + ')(?:财年|年)?(?:-|~|、|—|to|至|到)(?:\\d{1,4}|' + hanNum + ')' + noNum + '(?:财年|年|个月|月)?' + notEnd,

            // 🔻 今天00:00
            '(?:\\b)?(?:昨天|今天)' + kg + '(?:\\d{1}' + noNum + '|\\d{2}' + noNum + ')' + kg + '(?:(:)|：)' + kg + '(?:\\d{1}' + noNum + '|\\d{2}' + noNum + ')',

        ];

        const dateFormatRegex = new RegExp(datePatterns.join("|"),"gi");

        const style = `
            color: #5bae23 !important;
            text-shadow: none !important;
        `;

        const elements = document.querySelectorAll("*");

        setTimeout(() => {
            elements.forEach((el) => {
                const textNodes = getTextNodes(el);
                textNodes.forEach((node) => {
                    const matches = node.nodeValue.match(dateFormatRegex);
                    if (!matches) return;

                    for (let i = matches.length - 1; i >= 0; i--) {
                        const match = matches[i];
                        const idx = node.nodeValue.indexOf(match);
                        if (idx === -1) continue;

                        const span = document.createElement("dateColor");
                        span.style.cssText = style;
                        span.textContent = match;

                        const range = new Range();
                        range.setStart(node, idx);
                        range.setEnd(node, idx + match.length);
                        range.deleteContents();
                        range.insertNode(span);
                    }
                });
            });
        }, 300);

        function getTextNodes(node) {
            let out = [];
            if (node.nodeType === Node.TEXT_NODE) return [node];
            for (let c of node.childNodes) {
                // 跳过我们自定义的元素，避免再次遍历里面的文本
                if (c.nodeName === 'DATECOLOR') continue;
                out.push(...getTextNodes(c));
            }
            return out;
        }
    }

    // ⬇️ 以下是你的原始逻辑（保持不动，只封装到函数中）
    runDateHighlight();

    // 监听DOM变化
    const observer = new MutationObserver(() => {
        runDateHighlight();
    });

    // 开始监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
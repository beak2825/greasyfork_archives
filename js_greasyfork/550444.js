// ==UserScript==
// @name         蓝白-老王论坛一键复制标题
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  老王论坛详情页一键复制标题，复制时移除前面的“转载搬运”和结尾的“百度盘”
// @author       蓝白社野怪
// @match        https://batmhycyw.com/forum.php?mod=viewthread&tid*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=batmhycyw.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/550444/%E8%93%9D%E7%99%BD-%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/550444/%E8%93%9D%E7%99%BD-%E8%80%81%E7%8E%8B%E8%AE%BA%E5%9D%9B%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        .tm-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tm-toast.show { opacity: 1; }
        .tm-copy-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin: 5px;
        }
    `);

    // 创建Toast元素
    $('body').append('<div class="tm-toast"></div>');

    // 显示Toast函数
    function showToast(msg) {
        $('.tm-toast').text(msg).addClass('show');
        setTimeout(() => $('.tm-toast').removeClass('show'), 1500);
    }

    // 复制文本函数
    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('复制成功');
        } catch (err) {
            // 兼容旧浏览器
            $('<textarea>').val(text).appendTo('body').select();
            document.execCommand('copy');
            $('textarea').last().remove();
            showToast('复制成功');
        }
    }

    // 提取文本的函数
    function extractTextBetweenMarkers(originalText) {
        // 找到第一个]的位置
        const firstCloseBracket = originalText.indexOf(']');
        // 找到最后一个[的位置
        const lastOpenBracket = originalText.lastIndexOf('[');

        // 检查标记是否存在且顺序正确
        if (firstCloseBracket === -1 || lastOpenBracket === -1 || firstCloseBracket >= lastOpenBracket) {
            return "无法找到有效的标记范围";
        }

        // 提取两个标记之间的文本（不包括标记本身）
        return originalText.substring(firstCloseBracket + 1, lastOpenBracket).trim();
    }

    // 添加复制按钮
    $(".vwthd .xg1:eq(1)").after("<button id='fuzhi'>复制标题</button>");
    const title = $("#thread_subject").text();
    const extractedText = extractTextBetweenMarkers(title);

    $("#fuzhi").addClass('tm-copy-btn')
                .click(() => copyText(extractedText))



})(jQuery.noConflict(true));
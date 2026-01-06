// ==UserScript==
// @name         Zhihu 链接转换器
// @name:en      Zhihu URL Converter
// @version      1.1
// @description  自动将知乎搜索引擎的重定向链接（tardis）转换为原始链接，支持专栏文章、问题和回答
// @description:en  Automatically convert Zhihu search engine redirect links (tardis) to original URLs, supports articles, questions and answers
// @author       me & DeepSeek
// @license      MIT
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @match        https://www.zhihu.com/tardis/*
// @match        https://zhihu.com/tardis/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @namespace https://greasyfork.org/users/955739
// @downloadURL https://update.greasyfork.org/scripts/559106/Zhihu%20%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559106/Zhihu%20%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("知乎链接转换器启动...");
    
    // 获取当前页面的 URL
    var currentUrl = window.location.href;
    
    // 检查URL类型并进行相应处理
    if (currentUrl.includes('/art/')) {
        // 专栏文章：/art/数字 → zhuanlan.zhihu.com/p/数字
        var match = currentUrl.match(/\/art\/(\d+)/);
        if (match) {
            var originalUrl = "https://zhuanlan.zhihu.com/p/" + match[1];
            console.log("重定向到专栏文章: " + originalUrl);
            window.location.href = originalUrl;
        }
    } 
    else if (currentUrl.includes('/qus/')) {
        // 问题：/qus/数字 → zhihu.com/question/数字
        var match = currentUrl.match(/\/qus\/(\d+)/);
        if (match) {
            var originalUrl = "https://www.zhihu.com/question/" + match[1];
            console.log("重定向到问题: " + originalUrl);
            window.location.href = originalUrl;
        }
    }
    else if (currentUrl.includes('/ans/')) {
        // 回答：/ans/回答ID → zhihu.com/question/问题ID/answer/回答ID
        var match = currentUrl.match(/\/ans\/(\d+)/);
        if (match) {
            var answerId = match[1];
            fetchQuestionId(answerId);
        }
    }
    else {
        console.log("无法识别的tardis链接类型");
    }
    
    /**
     * 通过知乎API获取问题ID
     */
    function fetchQuestionId(answerId) {
        var apiUrl = 'https://api.zhihu.com/answers/' + answerId;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Referer': 'https://www.zhihu.com/'
            },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        var data = JSON.parse(response.responseText);
                        if (data && data.question && data.question.id) {
                            var questionId = data.question.id;
                            var originalUrl = "https://www.zhihu.com/question/" + questionId + "/answer/" + answerId;
                            console.log("API获取成功，重定向到回答: " + originalUrl);
                            window.location.href = originalUrl;
                            return;
                        }
                    } catch (e) {
                        console.log("API解析失败: " + e);
                    }
                }
                // API失败时，显示简单提示
                console.log("无法获取问题ID，回答ID: " + answerId);
                showSimpleError(answerId);
            },
            onerror: function() {
                console.log("API请求失败，回答ID: " + answerId);
                showSimpleError(answerId);
            },
            timeout: 5000  // 5秒超时
        });
    }
    
    /**
     * 显示简单的错误提示
     */
    function showSimpleError(answerId) {
        // 只在控制台显示错误，不打扰用户
        console.log("请手动访问知乎搜索回答ID: " + answerId);
        
        // 如果需要，可以添加一个简单的页面提示
        var tip = document.createElement('div');
        tip.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
            opacity: 0.9;
        `;
        tip.innerHTML = '知乎链接转换失败<br><small>回答ID: ' + answerId + '</small>';
        document.body.appendChild(tip);
        
        // 10秒后自动消失
        setTimeout(function() {
            if (tip.parentNode) {
                tip.remove();
            }
        }, 10000);
    }
})();
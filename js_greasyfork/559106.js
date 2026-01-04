// ==UserScript==
// @name         Zhihu 链接转换器
// @version      1.0
// @description  自动将知乎搜索引擎的重定向链接转换为原始链接（支持专栏文章、问题、回答）
// @author       You
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

    // 获取当前页面的 URL
    var currentUrl = window.location.href;

    console.log("检测到Zhihu tardis链接: " + currentUrl);

    // 检查URL类型并进行相应处理
    if (currentUrl.includes('/art/')) {
        // 专栏文章
        convertArticle(currentUrl);
    } else if (currentUrl.includes('/ans/')) {
        // 回答
        convertAnswer(currentUrl);
    } else if (currentUrl.includes('/qus/')) {
        // 问题
        convertQuestion(currentUrl);
    } else {
        console.log("无法识别的tardis链接类型");
    }

    function convertArticle(url) {
        var match = url.match(/\/art\/(\d+)/);
        if (match) {
            var articleId = match[1];
            var originalUrl = "https://zhuanlan.zhihu.com/p/" + articleId;
            console.log("重定向专栏文章: " + originalUrl);
            redirectToUrl(originalUrl);
        }
    }

    function convertQuestion(url) {
        var match = url.match(/\/qus\/(\d+)/);
        if (match) {
            var questionId = match[1];
            var originalUrl = "https://www.zhihu.com/question/" + questionId;
            console.log("重定向问题: " + originalUrl);
            redirectToUrl(originalUrl);
        }
    }

    function convertAnswer(url) {
        var match = url.match(/\/ans\/(\d+)/);
        if (match) {
            var answerId = match[1];

            // 尝试从URL参数中获取问题ID
            var questionId = extractQuestionIdFromUrl(url);

            if (questionId) {
                // 如果URL中包含问题ID，直接构建链接
                var originalUrl = "https://www.zhihu.com/question/" + questionId + "/answer/" + answerId;
                console.log("从URL参数重定向回答: " + originalUrl);
                redirectToUrl(originalUrl);
            } else {
                // 否则尝试从API获取
                fetchAnswerInfo(answerId);
            }
        }
    }

    function extractQuestionIdFromUrl(url) {
        // 有些tardis链接可能包含问题ID参数
        var urlObj = new URL(url);
        var questionId = urlObj.searchParams.get('question_id') ||
                        urlObj.searchParams.get('qid');

        // 或者从路径中提取（某些格式）
        var pathMatch = url.match(/\/question\/(\d+)/);
        if (pathMatch) {
            questionId = pathMatch[1];
        }

        return questionId;
    }

    function fetchAnswerInfo(answerId) {
        // 方法1：尝试使用知乎的API
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
                            console.log("通过API重定向回答: " + originalUrl);
                            redirectToUrl(originalUrl);
                            return;
                        }
                    } catch (e) {
                        console.log("API解析失败: " + e);
                    }
                }
                // API失败，尝试备用方法
                extractQuestionFromPage(answerId);
            },
            onerror: function() {
                extractQuestionFromPage(answerId);
            }
        });
    }

    function extractQuestionFromPage(answerId) {
        // 等待页面加载一些内容
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                findQuestionInPage(answerId);
            });
        } else {
            findQuestionInPage(answerId);
        }
    }

    function findQuestionInPage(answerId) {
        // 方法2：从页面中查找问题ID
        var found = false;

        // 检查1：meta标签
        var metaTags = document.querySelectorAll('meta[property="og:url"], meta[name="twitter:url"]');
        for (var i = 0; i < metaTags.length; i++) {
            var content = metaTags[i].getAttribute('content');
            if (content && content.includes('question/')) {
                var match = content.match(/question\/(\d+)/);
                if (match) {
                    redirectToAnswer(match[1], answerId);
                    found = true;
                    return;
                }
            }
        }

        // 检查2：链接
        if (!found) {
            var links = document.querySelectorAll('a[href*="question/"]');
            for (var i = 0; i < links.length && i < 10; i++) { // 检查前10个链接
                var href = links[i].getAttribute('href');
                if (href) {
                    var match = href.match(/question\/(\d+)/);
                    if (match) {
                        redirectToAnswer(match[1], answerId);
                        found = true;
                        return;
                    }
                }
            }
        }

        // 检查3：页面标题或内容中的数字（最后的手段）
        if (!found) {
            var textContent = document.body.innerText || '';
            var questionIdMatch = textContent.match(/question\/(\d+)/);
            if (questionIdMatch) {
                redirectToAnswer(questionIdMatch[1], answerId);
                return;
            }

            // 如果还是找不到，显示提示
            console.log("无法自动找到问题ID，请手动处理");
            showNotification(answerId);
        }
    }

    function redirectToAnswer(questionId, answerId) {
        var originalUrl = "https://www.zhihu.com/question/" + questionId + "/answer/" + answerId;
        console.log("从页面内容重定向回答: " + originalUrl);
        redirectToUrl(originalUrl);
    }

    function redirectToUrl(url) {
        // 避免无限重定向
        if (window.location.href !== url) {
            window.location.href = url;
        }
    }

    function showNotification(answerId) {
        // 创建一个简单的通知
        var notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 99999;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        notification.innerHTML = `
            <strong>知乎链接转换失败</strong><br>
            回答ID: ${answerId}<br>
            <small>请手动访问原始页面</small>
            <br><br>
            <button id="retry-btn" style="padding: 5px 10px; background: white; color: #333; border: none; border-radius: 3px; cursor: pointer;">
                重试
            </button>
        `;

        document.body.appendChild(notification);

        document.getElementById('retry-btn').addEventListener('click', function() {
            notification.remove();
            findQuestionInPage(answerId);
        });

        // 10秒后自动移除
        setTimeout(function() {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
})();
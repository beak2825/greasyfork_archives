// ==UserScript==
// @name         强制替换百度首页
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制清理百度首页
// @author       You
// @match        *://www.baidu.com/
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559651/%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/559651/%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即清理现有内容
    if (document.documentElement) {
        document.documentElement.innerHTML = '';
    }

    // 监控DOM变化，防止百度插入内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 阻止任何新节点的添加
            mutation.addedNodes.forEach((node) => {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 立即构建新页面
    const newHTML = `
<!DOCTYPE html>
<html style="height: 100%; overflow: hidden;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>百度一下，你就知道</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
            font-family: Arial, sans-serif;
        }
        .container {
            text-align: center;
        }
        h1 {
            color: #4285f4;
            font-size: 72px;
            margin-bottom: 40px;
        }
        input {
            width: 500px;
            padding: 15px;
            font-size: 16px;
            border: 1px solid #dfe1e5;
            border-radius: 24px;
            outline: none;
        }
        input:focus {
            box-shadow: 0 1px 6px rgba(32,33,36,0.28);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Baidu</h1>
        <input type="text" id="search" placeholder="" autofocus>
    </div>
    <script>
        document.getElementById('search').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.location.href = 'https://www.baidu.com/s?wd=' + encodeURIComponent(this.value);
            }
        });
    </script>
</body>
</html>
    `;

    // 用新内容替换
    document.open();
    document.write(newHTML);
    document.close();

    // 停止监控
    setTimeout(() => {
        observer.disconnect();
    }, 1000);
})();
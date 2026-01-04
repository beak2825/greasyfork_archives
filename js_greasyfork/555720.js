// ==UserScript==
// @name         福利屋资源解析助手
// @namespace    https://zy.fl5a.com/
// @version      1.1
// @description  一键解析页面中的资源链接（需登录并消耗金币），支持平台：课百万(www.kebaiwan.net)、666php(www.666php.com)、666Root(666root.com)、瑞客论坛IT(www.ruike1.com)、IT教程吧(www.itjc8.com)、三通IT学院(www.santongit.com)、独角兽资源站(www.itdjs.com)、自学成才网(www.zx-cc.net)
// @author       福利屋
// @match        *://www.kebaiwan.net/*
// @match        *://www.666php.com/*
// @match        *://666root.com/*
// @match        *://www.ruike1.com/*
// @match        *://www.itjc8.com/*
// @match        *://www.santongit.com/*
// @match        *://www.itdjs.com/*
// @match        *://www.zx-cc.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555720/%E7%A6%8F%E5%88%A9%E5%B1%8B%E8%B5%84%E6%BA%90%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555720/%E7%A6%8F%E5%88%A9%E5%B1%8B%E8%B5%84%E6%BA%90%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 前端页面地址
    const FRONTEND_BASE_URL = 'https://zy.fl5a.com';

    // 添加样式
    GM_addStyle(`
        .resource-parser-btn {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
            font-weight: bold;
        }
        
        .resource-parser-btn:hover {
            background: #45a049;
        }
        
        .resource-parser-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .resource-parser-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            max-height: 80%;
            overflow-y: auto;
        }
        
        .resource-parser-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
        
        .resource-parser-result {
            margin: 15px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
            word-break: break-all;
        }
        
        .resource-parser-close {
            background: #f44336;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .resource-parser-link {
            color: #2196F3;
            text-decoration: none;
        }
        
        .resource-parser-link:hover {
            text-decoration: underline;
        }
    `);

    // 创建解析按钮
    const parserBtn = document.createElement('button');
    parserBtn.className = 'resource-parser-btn';
    parserBtn.textContent = '解析资源';
    parserBtn.onclick = parseCurrentPage;
    parserBtn.title = '点击后跳转到资源解析页面，需登录并消耗金币';
    document.body.appendChild(parserBtn);

    // 注册菜单命令
    GM_registerMenuCommand('解析当前页面资源', parseCurrentPage);
    GM_registerMenuCommand('解析指定链接', showInputDialog);

    // 解析当前页面
    function parseCurrentPage() {
        const currentUrl = window.location.href;
        parseResource(currentUrl);
    }

    // 显示输入对话框
    function showInputDialog() {
        const url = prompt('请输入资源链接:');
        if (url) {
            parseResource(url);
        }
    }

    // 解析资源 - 跳转到前端资源获取页面
    function parseResource(url) {
        // 构建前端资源获取页面的URL，将当前URL作为参数传递
        const frontendUrl = `${FRONTEND_BASE_URL}/resource?query=${encodeURIComponent(url)}`;
        
        // 在新标签页打开前端资源获取页面
        window.open(frontendUrl, '_blank');
    }
})();
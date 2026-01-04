// ==UserScript==
// @license MIT
// @name         网页关键词拦截器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  拦截包含特定关键词的网页地址，跳转到提示页面
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-start
// @compatible   chrome
// @compatible   firefox
// @compatible   safari iOS (需要 Userscripts 或 Stay 应用)
// @downloadURL https://update.greasyfork.org/scripts/552629/%E7%BD%91%E9%A1%B5%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552629/%E7%BD%91%E9%A1%B5%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const MANAGE_URL = 'keyword-blocker-manage'; // 管理页面的特殊标识
    const BLOCK_PAGE_URL = 'keyword-blocker-warning'; // 拦截页面的特殊标识
    const STORAGE_KEY = 'blocked_keywords';

    // 脚本初始化日志
    console.log('[关键词拦截器] 脚本已加载');
    console.log('[关键词拦截器] 浏览器信息:', navigator.userAgent);
    console.log('[关键词拦截器] 支持 GM_getValue:', typeof GM_getValue !== 'undefined');
    console.log('[关键词拦截器] 支持 localStorage:', typeof localStorage !== 'undefined');

    // 防止重复执行的标志
    if (window.__KEYWORD_BLOCKER_INITIALIZED__) {
        console.log('[关键词拦截器] 脚本已经初始化，跳过');
        return;
    }
    window.__KEYWORD_BLOCKER_INITIALIZED__ = true;

    // 获取当前 URL
    const currentUrl = window.location.href;

    // 检查是否是管理页面
    if (currentUrl.includes(MANAGE_URL)) {
        showManagePage();
        return;
    }

    // 检查是否是拦截提示页面
    if (currentUrl.includes(BLOCK_PAGE_URL)) {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const keyword = params.get('keyword') || '敏感内容';
        showWarningPage(keyword);
        return;
    }

    // 执行关键词检测
    checkAndBlock();

    // ========== 核心功能函数 ==========

    // 检测并拦截
    function checkAndBlock() {
        const keywords = getBlockedKeywords();

        // 调试信息（可选，帮助排查问题）
        console.log('[关键词拦截器] 当前 URL:', currentUrl);
        console.log('[关键词拦截器] 关键词列表:', keywords);

        if (keywords.length === 0) {
            console.log('[关键词拦截器] 没有关键词，跳过检测');
            return;
        }

        // 准备多个版本的URL用于检测
        const urlVersions = [currentUrl]; // 原始URL

        // 解码 URL 以便检测中文（尝试多次解码，因为有些 URL 可能被多次编码）
        try {
            let prevUrl = currentUrl;
            for (let i = 0; i < 5; i++) {
                try {
                    const decoded = decodeURIComponent(prevUrl);
                    if (decoded === prevUrl) break; // 无法再解码
                    urlVersions.push(decoded); // 添加每一次解码的结果
                    prevUrl = decoded;
                } catch(e) {
                    break; // 解码失败，停止尝试
                }
            }
        } catch(e) {
            console.log('[关键词拦截器] URL 解码失败:', e);
        }

        console.log('[关键词拦截器] URL版本数:', urlVersions.length);
        urlVersions.forEach((url, i) => {
            console.log(`[关键词拦截器] URL版本${i}:`, url);
        });

        // 检查是否包含任何关键词
        for (let keyword of keywords) {
            const keywordLower = keyword.toLowerCase();

            // 对每个版本的URL都进行检测
            for (let url of urlVersions) {
                const urlLower = url.toLowerCase();
                if (urlLower.includes(keywordLower)) {
                    console.log('[关键词拦截器] 检测到关键词:', keyword, '在URL版本:', url);
                    // 立即显示警告页面
                    showWarningPage(keyword);
                    return;
                }
            }
        }

        console.log('[关键词拦截器] 未检测到关键词，允许访问');
    }

    // ========== 管理页面 ==========

    function showManagePage() {
        // 防止重复渲染
        if (window.__MANAGE_PAGE_RENDERED__) {
            return;
        }
        window.__MANAGE_PAGE_RENDERED__ = true;

        // 等待 document 准备好再渲染
        function renderWhenReady() {
            if (!document.documentElement) {
                setTimeout(renderWhenReady, 10);
                return;
            }
            doRender();
        }

        function doRender() {
            renderManagePage();
        }

        renderWhenReady();
    }

    function renderManagePage() {
        // 创建管理界面
        const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>关键词拦截器 - 管理面板</title>
</head>
<body>
    <div class="container">
        <h1>🛡️ 关键词拦截器管理</h1>
        <p class="subtitle">添加需要屏蔽的关键词，当网址中包含这些关键词时将自动拦截</p>

        <div class="add-section">
            <input type="text"
                   id="keywordInput"
                   placeholder="输入要屏蔽的关键词..."
                   autocomplete="off"
                   autocapitalize="off"
                   autocorrect="off"
                   spellcheck="false" />
            <button id="addBtn">添加关键词</button>
        </div>

        <div class="keywords-list">
            <h2>已屏蔽的关键词</h2>
            <ul id="keywordsList"></ul>
        </div>

        <div class="footer">
            <p>💡 提示：请在浏览器地址栏输入以下地址来访问此页面</p>
            <p>方式1：直接输入 <code>keyword-blocker-manage</code>（不带协议）</p>
            <p>方式2：访问 <code>about:blank#keyword-blocker-manage</code></p>
            <p>推荐将此页面加入书签，方便下次访问</p>
        </div>
    </div>
</body>
</html>
        `;

        const css = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .container {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 600px;
                width: 100%;
                padding: 40px;
            }

            h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 32px;
            }

            .subtitle {
                color: #666;
                margin-bottom: 30px;
                line-height: 1.6;
                font-size: 15px;
            }

            .add-section {
                display: flex;
                gap: 10px;
                margin-bottom: 40px;
            }

            #keywordInput {
                flex: 1;
                padding: 12px 20px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                font-size: 16px;
                transition: border-color 0.3s;
                min-width: 0;
                -webkit-appearance: none;
                appearance: none;
                background-color: #ffffff;
            }

            #keywordInput:focus {
                outline: none;
                border-color: #667eea;
                -webkit-user-select: text;
                user-select: text;
            }

            #addBtn {
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                white-space: nowrap;
            }

            #addBtn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }

            #addBtn:active {
                transform: translateY(0);
            }

            .keywords-list h2 {
                color: #333;
                margin-bottom: 15px;
                font-size: 20px;
            }

            #keywordsList {
                list-style: none;
                max-height: 400px;
                overflow-y: auto;
            }

            .keyword-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: #f8f9fa;
                border-radius: 10px;
                margin-bottom: 10px;
                transition: background 0.3s;
                gap: 15px;
            }

            .keyword-item:hover {
                background: #e9ecef;
            }

            .keyword-text {
                color: #333;
                font-size: 16px;
                font-weight: 500;
                flex: 1;
                word-break: break-word;
                min-width: 0;
            }

            .delete-btn {
                padding: 6px 15px;
                background: #ff4757;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.3s;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .delete-btn:hover {
                background: #ee5a6f;
            }

            .empty-message {
                text-align: center;
                color: #999;
                padding: 30px;
                font-size: 16px;
            }

            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
            }

            .footer p {
                color: #666;
                font-size: 14px;
                line-height: 1.8;
                margin-bottom: 8px;
            }

            .footer code {
                background: #f1f3f4;
                padding: 2px 8px;
                border-radius: 4px;
                color: #667eea;
                font-family: "Courier New", monospace;
                word-break: break-all;
            }

            /* 手机端适配 */
            @media (max-width: 600px) {
                body {
                    padding: 10px;
                }

                .container {
                    padding: 25px 20px;
                    border-radius: 15px;
                }

                h1 {
                    font-size: 24px;
                    margin-bottom: 8px;
                }

                .subtitle {
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .add-section {
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 30px;
                }

                #keywordInput {
                    width: 100%;
                    padding: 14px 18px;
                    font-size: 16px;
                    -webkit-tap-highlight-color: rgba(102, 126, 234, 0.2);
                    touch-action: manipulation;
                }

                #addBtn {
                    width: 100%;
                    padding: 14px 30px;
                    font-size: 16px;
                }

                .keywords-list h2 {
                    font-size: 18px;
                    margin-bottom: 12px;
                }

                #keywordsList {
                    max-height: 300px;
                }

                .keyword-item {
                    padding: 12px 15px;
                    gap: 10px;
                }

                .keyword-text {
                    font-size: 15px;
                }

                .delete-btn {
                    padding: 8px 16px;
                    font-size: 14px;
                }

                .empty-message {
                    padding: 20px;
                    font-size: 15px;
                }

                .footer {
                    margin-top: 30px;
                    padding-top: 15px;
                }

                .footer p {
                    font-size: 13px;
                    line-height: 1.6;
                }

                .footer code {
                    font-size: 12px;
                    padding: 2px 6px;
                }
            }

            /* 小屏手机优化 */
            @media (max-width: 360px) {
                .container {
                    padding: 20px 15px;
                }

                h1 {
                    font-size: 22px;
                }

                .keyword-item {
                    padding: 10px 12px;
                }

                .delete-btn {
                    padding: 6px 12px;
                    font-size: 13px;
                }
            }
        `;

        // 初始化页面
        function init() {
            // 使用 document.open/write/close 完全替换页面
            document.open();
            document.write(html);
            document.close();

            // 添加样式
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);

            // 等待 DOM 准备好后绑定事件
            setTimeout(function() {
                const addBtn = document.getElementById('addBtn');
                const keywordInput = document.getElementById('keywordInput');

                if (addBtn && keywordInput) {
                    addBtn.addEventListener('click', addKeyword);
                    keywordInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addKeyword();
                        }
                    });

                    // 渲染关键词列表
                    renderKeywords();
                }
            }, 100);
        }

        // 立即执行初始化
        init();
    }

    // 添加关键词
    function addKeyword() {
        const input = document.getElementById('keywordInput');
        const keyword = input.value.trim();

        if (!keyword) {
            alert('请输入关键词！');
            return;
        }

        const keywords = getBlockedKeywords();

        if (keywords.includes(keyword)) {
            alert('该关键词已存在！');
            return;
        }

        keywords.push(keyword);
        saveBlockedKeywords(keywords);
        input.value = '';
        renderKeywords();
    }

    // 删除关键词
    function deleteKeyword(keyword) {
        if (!confirm(`确定要删除关键词 "${keyword}" 吗？`)) return;

        let keywords = getBlockedKeywords();
        keywords = keywords.filter(k => k !== keyword);
        saveBlockedKeywords(keywords);
        renderKeywords();
    }

    // 渲染关键词列表
    function renderKeywords() {
        const list = document.getElementById('keywordsList');
        const keywords = getBlockedKeywords();

        if (keywords.length === 0) {
            list.innerHTML = '<div class="empty-message">暂无屏蔽关键词，请添加</div>';
            return;
        }

        list.innerHTML = keywords.map(keyword => `
            <li class="keyword-item">
                <span class="keyword-text">${escapeHtml(keyword)}</span>
                <button class="delete-btn" data-keyword="${escapeHtml(keyword)}">删除</button>
            </li>
        `).join('');

        // 绑定删除按钮事件
        list.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteKeyword(this.getAttribute('data-keyword'));
            });
        });
    }

    // ========== 警告页面 ==========

    function showWarningPage(keyword) {
        // 防止重复渲染
        if (window.__WARNING_PAGE_RENDERED__) {
            return;
        }
        window.__WARNING_PAGE_RENDERED__ = true;

        // 等待 document 准备好再渲染
        function renderWhenReady() {
            if (!document.documentElement) {
                setTimeout(renderWhenReady, 10);
                return;
            }
            renderWarningPage(keyword);
        }

        renderWhenReady();
    }

    function renderWarningPage(keyword) {
        // 转义关键词以便安全显示
        const safeKeyword = escapeHtml(keyword);

        // 生成完整的 HTML 页面
        const fullPage = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邪淫恶果 - 警示</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }

        .background-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:
                radial-gradient(circle at 20% 50%, rgba(120, 40, 200, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 100, 100, 0.3) 0%, transparent 50%);
            animation: pulse 8s ease-in-out infinite;
            z-index: 0;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
        }

        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            box-shadow: 0 30px 90px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            max-width: 700px;
            width: 100%;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            z-index: 1;
            animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .icon-wrapper {
            margin-bottom: 20px;
        }

        .icon {
            font-size: 100px;
            display: inline-block;
            animation: shake 1s ease-in-out infinite;
            filter: drop-shadow(0 4px 8px rgba(255, 100, 0, 0.3));
        }

        @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
            20%, 40%, 60%, 80% { transform: rotate(5deg); }
        }

        .title {
            color: #d32f2f;
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            letter-spacing: 2px;
        }

        .warning-box {
            background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
            border-left: 6px solid #d32f2f;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: left;
            box-shadow: 0 4px 15px rgba(211, 47, 47, 0.1);
        }

        .intro {
            color: #333;
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .consequences {
            list-style: none;
            padding: 0;
        }

        .consequences li {
            color: #444;
            font-size: 17px;
            line-height: 1.9;
            margin-bottom: 12px;
            padding-left: 30px;
            position: relative;
        }

        .consequences li::before {
            content: "▸";
            position: absolute;
            left: 8px;
            color: #d32f2f;
            font-size: 20px;
            font-weight: bold;
        }

        .footer-note {
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
        }

        .footer-note p {
            color: #666;
            font-size: 15px;
        }

        .trigger-keyword {
            color: #d32f2f;
            font-weight: 700;
            font-size: 17px;
            background: #fff5f5;
            padding: 4px 12px;
            border-radius: 6px;
            display: inline-block;
            margin-top: 5px;
        }

        /* 平板端适配 */
        @media (max-width: 768px) {
            .container {
                padding: 40px 30px;
            }

            .title {
                font-size: 40px;
            }

            .icon {
                font-size: 90px;
            }

            .warning-box {
                padding: 25px;
            }

            .intro {
                font-size: 17px;
            }

            .consequences li {
                font-size: 16px;
            }
        }

        /* 手机端适配 */
        @media (max-width: 600px) {
            body {
                padding: 15px 10px;
            }

            .container {
                padding: 30px 20px;
                border-radius: 20px;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            }

            .icon-wrapper {
                margin-bottom: 15px;
            }

            .icon {
                font-size: 70px;
            }

            .title {
                font-size: 28px;
                margin-bottom: 20px;
                letter-spacing: 1px;
            }

            .warning-box {
                padding: 20px 15px;
                border-radius: 12px;
                margin-bottom: 20px;
            }

            .intro {
                font-size: 15px;
                line-height: 1.7;
                margin-bottom: 15px;
            }

            .consequences li {
                font-size: 14px;
                line-height: 1.7;
                margin-bottom: 10px;
                padding-left: 25px;
            }

            .consequences li::before {
                font-size: 18px;
                left: 5px;
            }

            .footer-note {
                padding-top: 15px;
            }

            .footer-note p {
                font-size: 14px;
            }

            .trigger-keyword {
                font-size: 15px;
                padding: 3px 10px;
                word-break: break-all;
            }
        }

        /* 小屏手机优化 */
        @media (max-width: 400px) {
            body {
                padding: 10px 8px;
            }

            .container {
                padding: 25px 15px;
                border-radius: 15px;
            }

            .icon {
                font-size: 60px;
            }

            .title {
                font-size: 24px;
                margin-bottom: 15px;
            }

            .warning-box {
                padding: 15px 12px;
            }

            .intro {
                font-size: 14px;
            }

            .consequences li {
                font-size: 13px;
                line-height: 1.6;
                margin-bottom: 8px;
                padding-left: 22px;
            }

            .consequences li::before {
                font-size: 16px;
                left: 3px;
            }

            .footer-note p {
                font-size: 13px;
            }

            .trigger-keyword {
                font-size: 14px;
                padding: 2px 8px;
            }
        }
    </style>
</head>
<body>
    <div class="background-overlay"></div>
    <div class="container">
        <div class="icon-wrapper">
            <div class="icon">⚠️</div>
        </div>
        <h1 class="title">邪淫恶果</h1>
        <div class="warning-box">
            <p class="intro">如果你邪淫，你就把福报，转化为性快感，过早的消耗掉了，那么你本来应该享受的好福报，全部降了等级：</p>
            <ul class="consequences">
                <li>本来你能念本科的，最后上了大专；</li>
                <li>本来你能买房的，最后只能租房；</li>
                <li>本来你英俊潇洒美丽动人的，变得形容猥琐；</li>
                <li>本来脑子好好的，变得不会说话，不会做事；</li>
                <li>本来能有好伴侣的，结果找了个品行很差的；</li>
                <li>本来能有好工作的，变成做下等行业；</li>
                <li>本来你身强体壮的，变得身弱多病；</li>
                <li>本来你能堂堂正正做人的，变得不人不鬼。</li>
            </ul>
        </div>
        <div class="footer-note">
            <p>触发关键词：<span class="trigger-keyword">${safeKeyword}</span></p>
        </div>
    </div>
</body>
</html>`;

        // 使用 document.open/write/close 完全替换页面
        document.open();
        document.write(fullPage);
        document.close();
    }

    // ========== 工具函数 ==========

    // 获取屏蔽关键词列表
    function getBlockedKeywords() {
        try {
            // 优先使用 localStorage
            let data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                console.log('[关键词拦截器] 从 localStorage 读取数据');
                return JSON.parse(data);
            }

            // iOS Safari 隐私模式下 localStorage 可能不可用，尝试使用 GM_getValue
            if (typeof GM_getValue !== 'undefined') {
                data = GM_getValue(STORAGE_KEY, '[]');
                console.log('[关键词拦截器] 从 GM_getValue 读取数据');
                return JSON.parse(data);
            }

            console.log('[关键词拦截器] 没有存储的关键词');
            return [];
        } catch (e) {
            console.error('[关键词拦截器] 读取关键词失败:', e);
            return [];
        }
    }

    // 保存屏蔽关键词列表
    function saveBlockedKeywords(keywords) {
        try {
            const jsonData = JSON.stringify(keywords);

            // 同时保存到 localStorage 和 GM_setValue（双重保险）
            try {
                localStorage.setItem(STORAGE_KEY, jsonData);
                console.log('[关键词拦截器] 已保存到 localStorage');
            } catch(e1) {
                console.warn('[关键词拦截器] localStorage 保存失败:', e1);
            }

            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(STORAGE_KEY, jsonData);
                console.log('[关键词拦截器] 已保存到 GM_setValue');
            }
        } catch (e) {
            console.error('[关键词拦截器] 保存失败:', e);
            alert('保存失败：' + e.message);
        }
    }

    // HTML 转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

})();

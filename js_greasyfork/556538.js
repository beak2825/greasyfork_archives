// ==UserScript==
// @name         Android Edge IDM+ Integration / IDM+ 下载调用助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Intercept download links in Android Edge and open them in IDM+ automatically. / 在Android Edge中拦截下载链接并自动调用IDM+。
// @author       Julian Ryder @ GDUT
// @match        *://*/*
// @grant        GM_showNotification
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556538/Android%20Edge%20IDM%2B%20Integration%20%20IDM%2B%20%E4%B8%8B%E8%BD%BD%E8%B0%83%E7%94%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/556538/Android%20Edge%20IDM%2B%20Integration%20%20IDM%2B%20%E4%B8%8B%E8%BD%BD%E8%B0%83%E7%94%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    // [配置区域 / Configuration]
    // ========================================================================

    /**
     * 选择你的IDM版本包名。
     * IDM+ (付费版/Pro): 'idm.internet.download.manager.plus'
     * IDM  (免费版/Free): 'idm.internet.download.manager'
     */
    const IDM_PACKAGE_NAME = 'idm.internet.download.manager.plus';

    /**
     * 需要拦截的文件后缀列表。
     * 只有匹配这些后缀的链接才会被发送到 IDM+。
     * 你可以根据需要添加或删除。
     */
    const TARGET_EXTENSIONS = [
        // Archives
        'zip', 'rar', '7z', 'tar', 'gz', 'iso', 'apk', 'xapk',
        // Video
        'mp4', 'mkv', 'avi', 'mov', 'flv', 'webm', 'wmv', 'mpg', 'mpeg',
        // Audio
        'mp3', 'flac', 'wav', 'm4a', 'aac', 'ogg',
        // Documents (可选，如果不想拦截PDF可注释掉)
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'epub',
        // Executables & Others
        'exe', 'msi', 'bin', 'dat', 'dmg', 'torrent'
    ];

    /**
     * 是否显示Toast提示。
     * true: 拦截时会在屏幕下方显示提示。
     * false: 静默运行。
     */
    const SHOW_TOAST = true;

    // ========================================================================
    // [核心逻辑 / Core Logic]
    // ========================================================================

    /**
     * 构造 Android Intent URL
     * 这是实现浏览器跳转到 App 的关键协议格式
     */
    function buildIntentUrl(downloadUrl, packageName) {
        // 解析原URL协议 (http vs https)
        const schemeMatch = downloadUrl.match(/^(https?):\/\//);
        const scheme = schemeMatch ? schemeMatch[1] : 'http';

        // 移除协议头，因为intent中需要单独指定scheme参数
        // 格式：intent://<host>/<path>#Intent;scheme=<scheme>;package=<pkg>;end
        const cleanUrl = downloadUrl.replace(/^(https?):\/\//, '');

        return `intent://${cleanUrl}#Intent;scheme=${scheme};package=${packageName};action=android.intent.action.VIEW;end`;
    }

    /**
     * 检查URL是否是我们需要拦截的文件类型
     */
    function isDownloadable(url) {
        if (!url) return false;

        // 排除非HTTP链接 (如 javascript:, mailto:, tel:)
        if (!url.startsWith('http')) return false;

        // 获取路径部分，移除查询参数(?xxx)和锚点(#xxx)以免干扰后缀判断
        let path = url.split('?')[0].split('#')[0];

        // 获取扩展名
        let ext = path.split('.').pop().toLowerCase();

        return TARGET_EXTENSIONS.includes(ext);
    }

    /**
     * 简单的Toast提示函数，用于移动端反馈
     */
    function showToast(message) {
        if (!SHOW_TOAST) return;

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            z-index: 999999;
            font-size: 14px;
            font-family: sans-serif;
            pointer-events: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);

        // 强制重绘以触发transition
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    /**
     * 全局点击事件拦截器
     * 使用事件委托处理动态加载的内容
     */
    function handleClick(e) {
        // 1. 查找被点击元素及其父级中是否有 <a> 标签
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
            if (target === document.body || target === null) return; // 未找到链接，退出
        }

        // 2. 获取链接地址
        const url = target.href;

        // 3. 判断是否需要拦截
        if (isDownloadable(url)) {
            // === [修改/拦截点] Interception Point ===
            console.log(`[IDM+ Script] Download link detected: ${url}`);

            // 阻止浏览器默认下载/跳转行为
            e.preventDefault();
            e.stopPropagation();

            // 构造 IDM+ 的 Intent
            const intentUrl = buildIntentUrl(url, IDM_PACKAGE_NAME);

            // 视觉反馈
            showToast('⚡ 已调用 IDM+ 下载');

            // 执行跳转，唤起 App
            window.location.href = intentUrl;
            // =======================================
        }
    }

    // ========================================================================
    // [初始化 / Initialization]
    // ========================================================================

    // 使用 capture 模式监听，确保尽早捕获事件
    document.addEventListener('click', handleClick, true);

    console.log('[IDM+ Script] Loaded successfully. Listening for downloads...');

})();
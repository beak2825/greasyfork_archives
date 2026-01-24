// ==UserScript==
// @name         水源关键词屏蔽插件
// @namespace    https://github.com/why002/
// @version      2.0
// @description  屏蔽水源中包含指定关键词的内容
// @author       why002
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563893/%E6%B0%B4%E6%BA%90%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/563893/%E6%B0%B4%E6%BA%90%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function () {
    'use strict';
    let users = [];
    let keywords = [];
    function getKeywords() {
        // 关键：先确保配置了 @grant GM_getValue 权限（元数据中）
        // 1. 读取 GM_setValue 存储的 blockWords 值
        const storedContent = GM_getValue("blockWords", "");
        const storedUser = GM_getValue("blockUsers", "")

        // 2. 按行分割 + 过滤处理 + 存入 words 数组
        keywords = storedContent
            .split(/\r?\n/) // 步骤1：按行分割
            .map(line => line.trim()) // 步骤2：去除每行首尾空格（包括空格、制表符等）
            .filter(line => line !== ""); // 步骤3：过滤空行（去除分割后为空字符串的元素）
        users = storedUser
            .split(/\r?\n/) // 步骤1：按行分割
            .map(line => line.trim()) // 步骤2：去除每行首尾空格（包括空格、制表符等）
            .filter(line => line !== ""); // 步骤3：过滤空行（去除分割后为空字符串的元素）
        // 打印测试：查看 words 数组内容（仅含有效非空数据）
        console.log("按行读取的 words 数组（优化版）：", keywords, users);
    }
    // --- 配置 ---
    const CONFIG = {
        btnId: 'tm-v10086-btn',
        styleId: 'tm-dynamic-hide-style',
        btnId2: 'tm-v10010-btn',
    };

    const logger = {
        log: (...args) => {
            // 核心：console.log 中 %c 对应后续的样式字符串，参数顺序不可乱
            // 格式：%c[样式前缀] + 原生多参数
            console.log(`%c[Filter]`, 'color: #0aa; font-weight: bold;', ...args);
        },
        info: (...args) => {
            console.log(`%c[Filter]`, 'color: #888;', ...args);
        }
    };

    // --- 状态变量 ---
    let isActive = false;
    let lockedTopicId = null; // 记录开启时的帖子ID

    const hiddenPostIds = new Set();
    const visiblePostIds = new Set();

    // --- 1. 基础样式 ---
    const baseCss = `
        #${CONFIG.btnId}.active {
            background-color: var(--d-hover) !important;
            border-bottom: 2px solid #0088cc !important;
        }
        #${CONFIG.btnId}.active svg {
            color: #0088cc !important;
            fill: #0088cc !important;
        }
    `;
    GM_addStyle(baseCss);

    // --- 2. 动态 CSS (核心屏蔽) ---
    function updateHiddenCSS() {
        let styleTag = document.getElementById(CONFIG.styleId);

        if (!isActive) {
            if (styleTag) styleTag.textContent = '';
            return;
        }

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = CONFIG.styleId;
            document.head.appendChild(styleTag);
        }

        // 屏蔽骨架屏 + 屏蔽无图ID
        let cssRules = `
            /* 隐藏各种占位符，防止回弹 */
            .topic-post.skeleton,
            .d-skeleton, .skeleton-loader,
            article.placeholder, .placeholder-animation,
            .placeholder-text, .placeholder-avatar {
                display: none !important;
                height: 0 !important; margin: 0 !important;
                padding: 0 !important; border: none !important;
            }
        `;

        if (hiddenPostIds.size > 0) {
            const selectors = Array.from(hiddenPostIds).map(id => `#${id}`).join(',\n');
            cssRules += `${selectors} { display: none !important; }`;
        }

        styleTag.textContent = cssRules;
    }

    // --- 3. 关键词判定 ---
    function hasKeyword(node) {
        const userCardElement = node.querySelector('[data-user-card]');
        let userName = '';
        if (userCardElement) {
            // 3. 读取 data-user-card 属性的值
            userName = userCardElement.getAttribute('data-user-card');
        }
        console.log(userName)
        const content = node.querySelector('.cooked');
        for (const user of users) {
            if (user == userName) {
                logger.log("匹配到用户", user)
                return true
            }
        }
        // 2. 提取.cooked容器内的纯文本内容（去除HTML标签）
        const textContent = content.textContent.trim().toLowerCase();

        // 3. 处理关键词参数：支持单个字符串或字符串数组
        let keywordList = [];
        if (typeof keywords === 'string') {
            // 单个关键词转为数组，统一后续处理逻辑
            keywordList = [keywords.trim().toLowerCase()];
        } else if (Array.isArray(keywords)) {
            // 数组关键词去空、转小写，过滤无效值
            keywordList = keywords
                .map(keyword => keyword?.trim().toLowerCase() || '')
                .filter(keyword => keyword !== '');
        } else {
            // 无效的关键词参数，直接返回false
            return false;
        }

        // 4. 关键词匹配核心逻辑：判断是否包含任意一个关键词（触发条件）
        for (const keyword of keywordList) {
            if (textContent.includes(keyword)) {
                logger.log("匹配到", keyword);
                return true; // 匹配到任意一个关键词，立即返回true
            }
        }

        // 5. 未匹配到任何关键词，返回false
        return false;
    }

    // --- 4. 扫描器 ---
    function scan() {
        if (!isActive) return;

        const posts = document.querySelectorAll('.topic-post');
        let newCount = 0;

        posts.forEach(node => {
            // 跳过骨架屏
            if (node.classList.contains('skeleton') || node.classList.contains('placeholder')) return;

            let targetId = node.id;
            const article = node.tagName === 'ARTICLE' ? node : node.querySelector('article');
            if (article && article.id) targetId = article.id;

            if (!targetId || targetId === 'post_1') return;
            // 忽略主楼
            if (node.getAttribute('data-post-number') === '1') return;

            if (hiddenPostIds.has(targetId) || visiblePostIds.has(targetId)) return;

            if (!hasKeyword(node)) {
                visiblePostIds.add(targetId);
            } else {
                hiddenPostIds.add(targetId);
                newCount++;
                logger.info(`[屏蔽] #${targetId}`);
            }
        });

        if (newCount > 0) updateHiddenCSS();
    }

    // --- 5. 智能加载 ---
    function smartLoad() {
        if (!isActive) return;
        const scrollH = document.documentElement.scrollHeight;
        const clientH = document.documentElement.clientHeight;

        // 只有内容极少时才拉取
        if (scrollH < clientH + 400) {
            const spinner = document.querySelector('.spinner');
            if (!spinner || window.getComputedStyle(spinner).display === 'none') {
                window.scrollBy(0, 50);
            }
        }
    }

    // --- 6. 辅助：获取当前 URL 的 Topic ID ---
    // URL格式通常是: /t/topic-slug/12345/6
    function getCurrentTopicId() {
        const match = location.href.match(/\/t\/[^\/]+\/(\d+)/);
        return match ? match[1] : null;
    }

    // --- 7. 开关逻辑 ---
    function toggle(forceState = null) {
        // 如果指定了状态，就用指定的，否则反转
        const nextState = forceState !== null ? forceState : !isActive;

        // 如果状态没变，就不折腾
        if (nextState === isActive) return;

        isActive = nextState;

        const btn = document.getElementById(CONFIG.btnId);
        if (btn) btn.classList.toggle('active', isActive);

        if (isActive) {
            logger.log('开启过滤');
            // 锁定当前 Topic ID
            lockedTopicId = getCurrentTopicId();

            // 开启时，基于当前页面重置数据
            hiddenPostIds.clear();
            visiblePostIds.clear();
            updateHiddenCSS();
            scan();
            smartLoad();
        } else {
            logger.log('关闭过滤 (状态清除)');
            lockedTopicId = null;
            updateHiddenCSS(); // 清空 CSS
        }
        GM_setValue("isActive", isActive)
    }

    // --- 8. 插入按钮 ---
    function addBtn() {
        if (document.getElementById(CONFIG.btnId)) return;
        const bar = document.querySelector('.timeline-footer-controls');
        if (!bar) return;

        const btn = document.createElement('button');
        btn.id = CONFIG.btnId;
        btn.className = 'btn no-text btn-icon btn-default';
        btn.title = '屏蔽关键词回复';
        btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#646464" version="1.1" id="Capa_1" width="16" height="16" viewBox="0 0 468.873 468.873" xml:space="preserve">
<g>
	<path d="M369.992,10.059c-48.285,0-88.48,34.613-97.145,80.381H13.25C5.932,90.439,0,96.375,0,103.691v242.48   c0,7.32,5.932,13.252,13.25,13.252h202.674v86.138c0,5.359,3.227,10.192,8.18,12.244c1.639,0.678,3.361,1.009,5.068,1.009   c3.447,0,6.838-1.348,9.373-3.883l96.172-95.508h56.975c7.32,0,13.252-5.932,13.252-13.252V201.458   c37.361-14.121,63.93-50.215,63.93-92.52C468.875,54.33,424.604,10.059,369.992,10.059z M369.992,35.059   c15.922,0,30.67,5.079,42.746,13.679L310.504,152.688c-9.037-12.257-14.393-27.387-14.393-43.749   C296.113,68.202,329.256,35.059,369.992,35.059z M369.992,182.821c-13.539,0-26.227-3.677-37.148-10.061L433.197,70.719   c6.771,11.158,10.676,24.242,10.676,38.221C443.875,149.679,410.73,182.821,369.992,182.821z"/>
</g>
</svg>
<span aria-hidden="true">&#8203;</span>
        `;

        btn.onclick = (e) => { e.preventDefault(); btn.blur(); toggle(); };

        // 如果当前是激活状态，按钮要亮
        if (isActive) btn.classList.add('active');

        bar.appendChild(btn);
    }
    const overlay = document.createElement('div');
    overlay.id = 'tampermonkey-overlay';
    document.body.appendChild(overlay);
    const style = document.createElement('style');
    style.textContent = `/* 叠加层（遮罩）：核心修改 - 实现页面虚化 + 确保全屏居中容器 */
        #tampermonkey-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,0.5); /* 半透明背景增强虚化层次感 */
            z-index: 10000;
            display: none;
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */
            /* 关键属性：backdrop-filter: blur() 实现页面虚化 */
            backdrop-filter: blur(8px); /* 虚化程度，数值越大虚化越明显（单位：px） */
            -webkit-backdrop-filter: blur(8px); /* 兼容webkit内核浏览器（Chrome、Safari等） */
        }

        /* 叠加层内容容器：强化中央显示，优化视觉 */
        #tampermonkey-overlay-content {
            width: 80%;
            max-width: 500px;
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 4px 30px rgba(0,0,0,0.6);
            transform: translateY(0); /* 可选：优化过渡效果 */
        }
//输入框标题
.tampermonkey-input-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
        padding: 0;
        line-height: 1.4;
    }
        /* 输入框 */
        .tampermonkey-textarea {
            width: 100%;
            height: 150px;
            padding: 12px;
            border: 1px solid #dcdcdc;
            border-radius: 4px;
            resize: vertical;
            font-size: 16px;
            margin-bottom: 16px;
            box-sizing: border-box;
        }

        /* 按钮组 */
        .tampermonkey-btn-group {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .tampermonkey-btn {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }

        #tampermonkey-save-btn {
            background-color: #1677ff;
            color: white;
        }

        #tampermonkey-close-btn {
            background-color: #f5f5f5;
            color: #333;
        }
    `;
    document.head.appendChild(style);
    // 3. 叠加层内容容器
    const overlayContent = document.createElement('div');
    overlayContent.id = 'tampermonkey-overlay-content';
    overlay.appendChild(overlayContent);
    // 用户屏蔽标题
    const inputTitleUser = document.createElement('h3');
    inputTitleUser.id = 'tampermonkey-input-title-user';
    inputTitleUser.classList.add('tampermonkey-input-title')
    inputTitleUser.textContent = '用户屏蔽配置';
    overlayContent.appendChild(inputTitleUser);
    // 4. 文本输入框
    const inputAreaUser = document.createElement('textarea');
    inputAreaUser.id = 'tampermonkey-input-area-user';
    inputAreaUser.classList.add('tampermonkey-textarea');
    inputAreaUser.placeholder = '请逐行输入屏蔽用户名';
    overlayContent.appendChild(inputAreaUser);
    // 新增：创建输入框标题元素并插入
    const inputTitle = document.createElement('h3');
    inputTitle.id = 'tampermonkey-input-title';
    inputTitle.classList.add('tampermonkey-input-title')
    inputTitle.textContent = '屏蔽关键词配置';
    overlayContent.appendChild(inputTitle);
    // 4. 文本输入框
    const inputArea = document.createElement('textarea');
    inputArea.id = 'tampermonkey-input-area';
    inputArea.classList.add('tampermonkey-textarea');
    inputArea.placeholder = '请逐行输入屏蔽词';
    overlayContent.appendChild(inputArea);

    // 5. 按钮组（保存、关闭）
    const btnGroup = document.createElement('div');
    btnGroup.className = 'tampermonkey-btn-group';
    overlayContent.appendChild(btnGroup);

    // 保存按钮
    const saveBtn = document.createElement('button');
    saveBtn.id = 'tampermonkey-save-btn';
    saveBtn.className = 'tampermonkey-btn';
    saveBtn.textContent = '保存内容';
    btnGroup.appendChild(saveBtn);
    saveBtn.addEventListener('click', () => {
        const inputContent = inputArea.value.trim();
        const inputUser = inputAreaUser.value.trim();
        GM_setValue("blockWords", inputContent);
        GM_setValue("blockUsers", inputUser);
        overlay.style.display = 'none';
        setTimeout(() => {
            alert('内容保存成功！');
            getKeywords()
        }, 0);
    });

    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.id = 'tampermonkey-close-btn';
    closeBtn.className = 'tampermonkey-btn';
    closeBtn.textContent = '关闭界面';
    btnGroup.appendChild(closeBtn);
    const closeOverlay = () => {
        overlay.style.display = 'none';
    };
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });
    function setting() {
        // 显示叠加层（flex布局实现居中）
        overlay.style.display = 'flex';
        // 读取本地存储内容，填充到输入框
        const savedContent = GM_getValue("blockWords") || '';
        inputArea.value = savedContent;
        const savedUsers = GM_getValue("blockUsers") || '';
        inputAreaUser.value = savedUsers;
        // 聚焦输入框
        inputArea.focus();

    }

    function settingBtn() {
        if (document.getElementById(CONFIG.btnId2)) return;
        const bar = document.querySelector('.timeline-footer-controls');
        if (!bar) return;

        const btn = document.createElement('button');
        btn.id = CONFIG.btnId2;
        btn.className = 'btn no-text btn-icon btn-default';
        btn.title = '屏蔽关键词设置';
        btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" aria-hiddeb="true" width="16" height="16" viewBox="0 0 20 20">
  <path fill="#646464" d="M11.078035,0 C11.3724371,0 11.6350302,0.183056678 11.7339285,0.457230801 L12.4396543,2.41370379 C12.6930786,2.47650967 12.9108093,2.54030436 13.0942558,2.60592238 C13.2952001,2.67779926 13.5540423,2.78741449 13.8746747,2.93586046 L15.5184936,2.06596774 C15.794148,1.92009416 16.1343396,1.97375545 16.3504064,2.19719235 L17.7960017,3.69209722 C17.98787,3.8905102 18.0422042,4.18265582 17.9342767,4.43557836 L17.162857,6.24336136 C17.2913496,6.47797752 17.3939318,6.67854463 17.4711247,6.84658462 C17.5553742,7.02998593 17.6588292,7.28241713 17.7829588,7.60671302 L19.580333,8.37623211 C19.8497082,8.4915611 20.0170118,8.76152727 19.9986241,9.05119919 L19.8669066,11.126215 C19.8494975,11.4004703 19.668825,11.6382294 19.4072566,11.7310995 L17.7049419,12.3355083 C17.6562729,12.5705675 17.6053791,12.772402 17.551477,12.9424906 C17.4883274,13.1417599 17.389065,13.3979932 17.2526724,13.7155635 L18.1084613,15.6068822 C18.2316885,15.879218 18.1635045,16.1990386 17.9395819,16.3990196 L16.3138559,17.8509252 C16.0957241,18.0457347 15.7773686,18.084139 15.5182641,17.9469002 L13.8421792,17.0591354 C13.5477413,17.2124998 13.2783109,17.3348831 13.0324612,17.4263047 C12.8127426,17.5080092 12.5685018,17.5992352 12.2997543,17.6999771 L11.6499659,19.5002547 C11.5529743,19.7689756 11.2984077,19.9507082 11.0099151,19.9571805 L9.10927684,20 C8.81300029,20.0064684 8.54492708,19.8269822 8.44118272,19.5525044 L7.6751041,17.5256808 C7.3232066,17.4026533 7.06612795,17.3070148 6.89898146,17.2366139 C6.74058527,17.1698987 6.53544077,17.0722593 6.28058727,16.9426265 L4.38190658,17.7549437 C4.12577479,17.8645252 3.82821583,17.812324 3.62584584,17.6223069 L2.22106797,16.3032781 C2.00593124,16.1012735 1.94386481,15.7866753 2.0664447,15.519534 L2.88322205,13.7395109 C2.76017205,13.4979963 2.65957084,13.2838441 2.58116863,13.0959926 C2.49857708,12.8981035 2.39862152,12.628586 2.28009144,12.2848943 L0.491710371,11.7412063 C0.190471763,11.6496264 -0.0110085834,11.3694211 0.000465944291,11.0580168 L0.071249487,9.13703967 C0.0806273232,8.88253689 0.2313194,8.65393727 0.463026654,8.5427144 L2.34096885,7.64127468 C2.42759746,7.32228988 2.50386559,7.07419005 2.57165467,6.89274074 C2.63878533,6.7130538 2.74293335,6.47740464 2.8854431,6.18143219 L2.06997455,4.45996626 C1.94312228,4.19217928 2.00336838,3.87420996 2.21965377,3.66998322 L3.62443163,2.34352648 C3.82439931,2.15470767 4.11840992,2.10075785 4.37358276,2.20606012 L6.27210909,2.98952564 C6.4823493,2.85093927 6.67247185,2.73658268 6.84371422,2.6461118 C7.04934485,2.53747289 7.3225817,2.42318736 7.66837893,2.29976859 L8.32789678,0.458652854 C8.42637398,0.183743082 8.68933933,0 8.98430143,0 L11.078035,0 Z M10.0237083,7.01854658 C8.35715373,7.01854658 7.00614429,8.35435786 7.00614429,10.0021646 C7.00614429,11.6499713 8.35715373,12.9857826 10.0237083,12.9857826 C11.6902629,12.9857826 13.0412723,11.6499713 13.0412723,10.0021646 C13.0412723,8.35435786 11.6902629,7.01854658 10.0237083,7.01854658 Z"/>
</svg>      `;

        btn.onclick = (e) => { e.preventDefault(); btn.blur(); setting(); };
        bar.appendChild(btn);
    }
    // --- 9. 主循环 ---
    function loop() {
        addBtn();
        settingBtn();
        if (isActive) {
            scan();
            smartLoad();
        }
        // --- 核心路由检查 ---
        /*
        if (isActive) {
            const currentId = getCurrentTopicId();

            // 如果 URL 里甚至没有 Topic ID (比如去了主页)，或者 ID 变了
            if (currentId !== lockedTopicId) {
                logger.log(`检测到离开原话题 (${lockedTopicId} -> ${currentId})，自动关闭`);
                toggle(false); // 强制关闭
            } else {
                // 如果还在同一个话题里，继续干活
                scan();
                smartLoad();
            }
        }
*/
        requestAnimationFrame(loop);
    }

    isActive = GM_getValue("isActive")
    logger.log('脚本已加载');
    getKeywords()
    loop();

})();

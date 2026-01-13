// ==UserScript==
// @name         2libra-enhance
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  2libra.com 论坛增强：帖子快速查看、智能返回顶部
// @author       twocold0451
// @homepage     https://github.com/twocold0451/2libra-enhance
// @supportURL   https://github.com/twocold0451/2libra-enhance/issues
// @match        https://2libra.com/*
// @license MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @require https://github.com/PRO-2684/GM_config/releases/download/v1.2.2/config.min.js#md5=c45f9b0d19ba69bb2d44918746c4d7ae
// @downloadURL https://update.greasyfork.org/scripts/562089/2libra-enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/562089/2libra-enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化日志
    console.log('2libra-enhance Script: Loaded and running...');

    // 配置
    const CONFIG = {
        btnText: '快速查看',
        modalId: 'libra-quick-view-modal',
        iframeId: 'libra-quick-view-iframe',
        settingsKey: 'libra-click-title-quick-view',
        settingsModalId: 'libra-settings-modal'
    };

    // 设置管理 - 将在GM_config初始化后设置
    let Settings;

    // 样式注入
    const style = document.createElement('style');
    style.textContent = `
        /* SpinKit CSS */
        @keyframes sk-chase {
          100% { transform: rotate(360deg); }
        }

        .sk-chase {
          width: 40px;
          height: 40px;
          position: relative;
          animation: sk-chase 2.0s infinite linear both;
        }

        .sk-chase-dot {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          animation: sk-chase 2.0s infinite ease-in-out both;
        }

        .sk-chase-dot:before {
          content: '';
          display: block;
          width: 25%;
          height: 25%;
          background-color: var(--color-primary, #4a00ff);
          border-radius: 100%;
          animation: sk-chase-dot 2.0s infinite ease-in-out both;
        }

        .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
        .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
        .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
        .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
        .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
        .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }

        @keyframes sk-chase-dot {
          80%, 100% {
            transform: rotate(360deg);
          }
        }

        /* 脉冲动画 */
        @keyframes sk-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .sk-pulse {
          width: 40px;
          height: 40px;
          background-color: var(--color-primary, #4a00ff);
          border-radius: 50%;
          animation: sk-pulse 1.5s infinite ease-in-out;
        }

        /* 波纹动画 */
        @keyframes sk-ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }

        .sk-ripple {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .sk-ripple:before,
        .sk-ripple:after {
          content: '';
          position: absolute;
          border: 2px solid var(--color-primary, #4a00ff);
          border-radius: 50%;
          animation: sk-ripple 1.5s infinite;
        }

        .sk-ripple:after {
          animation-delay: 0.5s;
        }

        /* 旋转方块 */
        @keyframes sk-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .sk-rotate {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(74, 0, 255, 0.3);
          border-top: 3px solid var(--color-primary, #4a00ff);
          border-radius: 50%;
          animation: sk-rotate 1.2s infinite linear;
        }

        /* 弹跳动画 */
        @keyframes sk-bounce {
          0%, 80%, 100% { transform: scale(0); }
          10% { transform: scale(1.0); }
          50% { transform: scale(1.0); }
        }

        .sk-bounce {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .sk-bounce:before,
        .sk-bounce:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: var(--color-primary, #4a00ff);
          animation: sk-bounce 1.4s infinite ease-in-out both;
        }

        .sk-bounce:after {
          animation-delay: -0.16s;
        }

        /* 波浪动画 */
        @keyframes sk-wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }

        .sk-wave {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .sk-wave:before,
        .sk-wave:after {
          content: '';
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: var(--color-primary, #4a00ff);
          animation: sk-wave 1.3s infinite ease-in-out;
        }

        .sk-wave:after {
          animation-delay: -0.3s;
        }

        /* 方块网格动画 */
        @keyframes sk-cube {
          0%, 70%, 100% { transform: scale3D(1, 1, 1); }
          35% { transform: scale3D(0, 0, 1); }
        }

        .sk-cube-grid {
          width: 40px;
          height: 40px;
        }

        .sk-cube-grid .sk-cube {
          width: 33%;
          height: 33%;
          background-color: var(--color-primary, #4a00ff);
          float: left;
          animation: sk-cube 1.3s infinite ease-in-out;
        }

        .sk-cube-grid .sk-cube:nth-child(1) { animation-delay: 0.2s; }
        .sk-cube-grid .sk-cube:nth-child(2) { animation-delay: 0.3s; }
        .sk-cube-grid .sk-cube:nth-child(3) { animation-delay: 0.4s; }
        .sk-cube-grid .sk-cube:nth-child(4) { animation-delay: 0.1s; }
        .sk-cube-grid .sk-cube:nth-child(5) { animation-delay: 0.2s; }
        .sk-cube-grid .sk-cube:nth-child(6) { animation-delay: 0.3s; }
        .sk-cube-grid .sk-cube:nth-child(7) { animation-delay: 0.0s; }
        .sk-cube-grid .sk-cube:nth-child(8) { animation-delay: 0.1s; }
        .sk-cube-grid .sk-cube:nth-child(9) { animation-delay: 0.2s; }
        .libra-quick-btn {
            position: absolute;
            padding: 2px 8px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 4px;
            background-color: var(--color-primary, #4a00ff);
            color: #fff;
            border: none;
            display: none;
            white-space: nowrap;
            z-index: 10;
            opacity: 0;
            transform: translateY(-50%);
            transition: opacity 0.2s;
        }
        
        .libra-post-item:hover .libra-quick-btn {
            display: block;
            opacity: 1;
        }

        .libra-quick-btn:hover {
            opacity: 0.9;
        }

        /* 自定义返回顶部按钮 */
        #custom-back-to-top {
            position: fixed;
            z-index: 900;
            width: 48px;
            height: 48px;
            border-radius: 14px; /* 更加圆润的矩形，类似 iOS 风格 */
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            color: var(--color-primary, #4a00ff);
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;
            display: none;
            justify-content: center;
            align-items: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px);
        }
        
        #custom-back-to-top.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }

        #custom-back-to-top:hover {
            background: var(--color-primary, #4a00ff);
            color: #fff;
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(74, 0, 255, 0.2);
            border-color: transparent;
        }

        #custom-back-to-top svg {
            width: 24px;
            height: 24px;
            transition: transform 0.3s ease;
        }

        #custom-back-to-top:hover svg {
            transform: translateY(-2px);
        }

        #${CONFIG.modalId} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 900;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        #${CONFIG.modalId}.active {
            opacity: 1;
            pointer-events: auto;
        }
        #${CONFIG.modalId} .modal-content {
            width: 90%;
            max-width: 1000px;
            height: 90%;
            background: var(--base-100, var(--libra-dynamic-bg, #fff));
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }
        #${CONFIG.modalId} .modal-header {
            padding: 10px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--base-100, var(--libra-dynamic-bg, #fff));
        }
        #${CONFIG.modalId} .modal-title {
            font-weight: bold;
            font-size: 16px;
        }
        #${CONFIG.modalId} .modal-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        #${CONFIG.modalId} .btn-go-thread {
            padding: 6px 16px;
            background-color: var(--color-primary, #4a00ff);
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        #${CONFIG.modalId} .btn-go-thread:hover {
            opacity: 0.9;
        }
        #${CONFIG.modalId} .btn-close-large {
            padding: 6px 16px;
            background-color: #e5e7eb;
            color: #374151;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.2s;
        }
        #${CONFIG.modalId} .btn-close-large:hover {
            background-color: #d1d5db;
        }

        /* 加载占位符样式 */
        .modal-loading {
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--libra-dynamic-bg);
            z-index: 1;
        }

        .loading-content {
            text-align: center;
            color: var(--color-primary, #4a00ff);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .loading-content p {
            margin: 20px 0 0 0;
            font-size: 16px;
            font-weight: 500;
        }

        #${CONFIG.modalId} iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            opacity: 0;
            transition: opacity 0.3s;
        }



        /* 标题链接视觉提示 */
        .libra-title-link-quick-view {
            cursor: pointer !important;
        }

        /* Toast通知样式 */
        .libra-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            padding: 12px 20px;
            background: var(--base-100, #fff);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid var(--color-primary, #4a00ff);
            font-size: 14px;
            color: var(--color-primary, #4a00ff);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: none;
            max-width: 300px;
            word-wrap: break-word;
        }

        .libra-toast.show {
            opacity: 1;
            transform: translateX(0);
            pointer-events: auto;
        }

        .libra-toast.success {
            border-left-color: #10b981;
            color: #10b981;
        }

        .libra-toast.info {
            border-left-color: var(--color-primary, #4a00ff);
            color: var(--color-primary, #4a00ff);
        }
    `;
    document.head.appendChild(style);

    // 创建模态框
    function createModal() {
        if (document.getElementById(CONFIG.modalId)) return;

        // 获取随机加载内容
        const { animation, text } = getRandomLoadingContent();

        const modal = document.createElement('div');
        modal.id = CONFIG.modalId;
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title">快速查看</span>
                    <div class="modal-actions">
                        <button class="btn-go-thread">进入帖子 ↗</button>
                        <button class="btn-close-large">关闭</button>
                    </div>
                </div>

                <!-- 加载占位符 -->
                <div class="modal-loading" id="modal-loading">
                    <div class="loading-content">
                        ${animation.html}
                        <p class="loading-text">${text}</p>
                    </div>
                </div>

                <iframe id="${CONFIG.iframeId}" src=""></iframe>
            </div>
        `;
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // 绑定按钮事件
        modal.querySelector('.btn-close-large').addEventListener('click', closeModal);
        
        document.body.appendChild(modal);
    }

    function openModal(url, title) {
        createModal();
        const modal = document.getElementById(CONFIG.modalId);

        // 动态获取网页背景色，解决变量未定义导致的透明问题
        let bg = window.getComputedStyle(document.body).backgroundColor;
        if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
            bg = window.getComputedStyle(document.documentElement).backgroundColor;
        }
        modal.style.setProperty('--libra-dynamic-bg', bg);

        const iframe = document.getElementById(CONFIG.iframeId);
        const titleEl = modal.querySelector('.modal-title');
        const goBtn = modal.querySelector('.btn-go-thread');
        const loadingEl = document.getElementById('modal-loading');

        // 更新随机加载内容
        if (loadingEl) {
            const { animation, text } = getRandomLoadingContent();
            const loadingContent = loadingEl.querySelector('.loading-content');
            if (loadingContent) {
                loadingContent.innerHTML = `${animation.html}<p class="loading-text">${text}</p>`;
            }
        }

        // 显示加载占位符，隐藏iframe
        if (loadingEl) loadingEl.style.display = 'flex';
        iframe.style.backgroundColor = bg;
        iframe.style.opacity = '0';

        iframe.src = url;
        titleEl.textContent = title || '快速查看';
        
        // 绑定跳转事件
        goBtn.onclick = () => {
            window.location.href = url;
        };

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

                iframe.onload = () => {
            try {
                const doc = iframe.contentDocument;
                const css = `
                    header, .navbar, aside:not(.EmojiPickerReact), .menu:not(.dropdown-left), [role="banner"], [role="contentinfo"], footer.footer-center { display: none !important; }
                    div.breadcrumbs.text-sm.overflow-visible { display: none !important; }
                    [data-main-left="true"], .flex-1 {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        z-index: 900 !important;
                        background: var(--base-100, ${bg}) !important;
                        overflow-y: auto !important;
                        padding: 0 20px 20px 20px !important;
                        margin: 0 !important;
                        border: none !important;
                    }
                    .EmojiPickerReact { z-index: 900 !important; }
                    .medium-zoom-overlay { z-index: 900 !important; }
                    body, html { overflow: hidden !important; }
                `;
                const style = doc.createElement('style');
                style.textContent = css;
                doc.head.appendChild(style);

                // 自动滚动到弹窗顶部
                function scrollToTop() {
                    console.log('2libra-enhance: Scrolling to top');
                    const mainContent = doc.querySelector('[data-main-left="true"]') || doc.querySelector('.flex-1');
                    if (mainContent) {
                        mainContent.scrollTop = 0;
                    } else {
                        doc.documentElement.scrollTop = 0;
                    }
                }

                // 监听URL变化，自动滚动到顶部
                const win = iframe.contentWindow;

                // 重写pushState和replaceState
                const originalPushState = win.history.pushState;
                win.history.pushState = function(state, title, url) {
                    console.log('2libra-enhance: pushState triggered, new URL:', url);
                    originalPushState.apply(this, arguments);
                    scrollToTop();
                };

                // 样式注入完成后隐藏加载占位符并显示内容
                if (loadingEl) loadingEl.style.display = 'none';
                iframe.style.opacity = '1';
            } catch (e) {
                // 出错也隐藏加载占位符并显示内容，避免死锁
                if (loadingEl) loadingEl.style.display = 'none';
                iframe.style.opacity = '1';
            }
        };
    }

    function closeModal() {
        const modal = document.getElementById(CONFIG.modalId);
        const iframe = document.getElementById(CONFIG.iframeId);
        if (modal) {
            modal.classList.remove('active');
            iframe.src = '';
            document.body.style.overflow = '';
        }
    }


    // 主逻辑：尝试为单个 LI 元素添加按钮
    function processListItem(li) {
        if (!li) return;

        // 查找这一行中的 time 元素
        const timeEl = li.querySelector('time');
        if (!timeEl) return;

        // 查找帖子标题链接
        const titleLink = timeEl.parentElement.parentElement.querySelector('a.link');
        if (!titleLink || titleLink.tagName !== 'A') return;

        // 查找元数据行 (标题下面的 div flex items-center gap-2)
        const metaRow = timeEl.closest('.flex.items-center.gap-2');
        if (!metaRow) return;

        // 标记为已添加（如果还没有标记），用于CSS hover
        if (!li.classList.contains('libra-post-item')) {
            li.classList.add('libra-post-item');
        }

        // 总是更新设置相关的属性
        if (Settings.clickTitleQuickView) {
            // 添加视觉提示样式和title提示
            titleLink.classList.add('libra-title-link-quick-view');
            titleLink.title = '点击快速查看';

            // 添加点击事件监听器（如果还没有添加）
            if (!titleLink.dataset.libraClickAdded) {
                titleLink.dataset.libraClickAdded = 'true';
                titleLink.addEventListener('click', (e) => {
                    // 首先检查当前设置状态
                    if (!Settings.clickTitleQuickView) return; // 如果设置已禁用，不执行

                    // 检查是否按下了Ctrl键（在新标签页打开）
                    if (e.ctrlKey || e.metaKey) return; // 让浏览器处理新标签页打开

                    e.preventDefault();
                    e.stopPropagation();
                    openModal(titleLink.href, titleLink.textContent);
                });
            }
        } else {
            // 移除视觉提示和title提示
            titleLink.classList.remove('libra-title-link-quick-view');
            if (titleLink.title === '点击快速查看') {
                titleLink.title = '';
            }
        }

        let btn = li.querySelector('.libra-quick-btn');
        // 添加快速查看按钮（如果还没有添加）
        if (!btn) {
            // 确保metaRow的父元素有定位上下文
            if (getComputedStyle(metaRow.parentElement).position === 'static') {
                metaRow.parentElement.style.position = 'relative';
            }

            btn = document.createElement('button');
            btn.className = 'libra-quick-btn';
            btn.textContent = CONFIG.btnText;
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(titleLink.href, titleLink.textContent);
            };
            // 插入到metaRow的父元素中
            metaRow.parentElement.appendChild(btn);
            
            li.dataset.libraQuickBtnAdded = 'true';
        }

        // 计算内容实际宽度：找到最右侧子元素的边缘
        const children = Array.from(metaRow.children).filter(c => getComputedStyle(c).display !== 'none');
        let contentRightEdge = 0;
        if (children.length > 0) {
            // 取所有子元素中最靠右的那个边缘
            children.forEach(child => {
                const right = child.offsetLeft + child.offsetWidth;
                if (right > contentRightEdge) contentRightEdge = right;
            });
        } else {
            contentRightEdge = metaRow.offsetWidth;
        }

        // 按钮位置 = metaRow 的起点 + 内容实际右边缘 + 间距
        const leftPos = metaRow.offsetLeft + contentRightEdge + 8;
        btn.style.left = `${leftPos}px`;
        
        // 垂直居中对齐到 metaRow
        const topPos = metaRow.offsetTop + (metaRow.offsetHeight / 2);
        btn.style.top = `${topPos}px`;
    }

    // 策略1：鼠标移入监听 (Lazy Load)
    document.body.addEventListener('mouseover', (e) => {
        const li = e.target.closest('li');
        if (li) {
            processListItem(li);
        }
    }, { passive: true });


    // --- 自定义返回顶部按钮逻辑 ---

    // 1. 创建按钮元素并添加到页面
    const topButton = document.createElement('button');
    topButton.id = 'custom-back-to-top';
    topButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    document.body.appendChild(topButton);

    // 2. 添加点击事件
    topButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. 核心：更新按钮位置和可见性的函数
    function updateTopButtonPosition() {
        const card = document.querySelector('ul.card') || document.querySelector('[data-main-left="true"]') || document.querySelector('.flex-1');
        
        if (!card) {
            topButton.classList.remove('visible');
            setTimeout(() => { 
                if(!topButton.classList.contains('visible')) topButton.style.display = 'none'; 
            }, 300);
            return;
        }

        const cardRect = card.getBoundingClientRect();
        const requiredWidth = cardRect.width + 60; 
        const hasEnoughSpace = window.innerWidth >= requiredWidth;
        const isScrolledDown = window.scrollY > 100;

        if (!hasEnoughSpace || !isScrolledDown) {
            if (topButton.classList.contains('visible')) {
                topButton.classList.remove('visible');
                setTimeout(() => { 
                    if(!topButton.classList.contains('visible')) topButton.style.display = 'none'; 
                }, 300);
            }
            return;
        }
        
        topButton.style.display = 'flex';
        requestAnimationFrame(() => {
             topButton.classList.add('visible');
        });

        topButton.style.left = `${cardRect.right + 16}px`;
        topButton.style.right = 'auto';
        
        const desiredBottomOffset = 24; 
        const buttonHeight = topButton.offsetHeight;
        const fixedPos = window.innerHeight - buttonHeight - desiredBottomOffset;
        const stickyPos = cardRect.bottom - buttonHeight;

        topButton.style.top = `${Math.min(fixedPos, stickyPos)}px`;
        topButton.style.bottom = 'auto';
    }

    let ticking = false;
    function throttledUpdater() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTopButtonPosition();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', throttledUpdater);
    window.addEventListener('resize', throttledUpdater);
    setTimeout(throttledUpdater, 500);

    // --- 加载动画配置 ---

    // 随机加载动画和文字
    const loadingAnimations = [
        {
            class: 'sk-chase',
            html: `
                <div class="sk-chase">
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                    <div class="sk-chase-dot"></div>
                </div>
            `
        },
        {
            class: 'sk-pulse',
            html: '<div class="sk-pulse"></div>'
        },
        {
            class: 'sk-ripple',
            html: '<div class="sk-ripple"></div>'
        },
        {
            class: 'sk-rotate',
            html: '<div class="sk-rotate"></div>'
        },
        {
            class: 'sk-bounce',
            html: '<div class="sk-bounce"></div>'
        },
        {
            class: 'sk-wave',
            html: '<div class="sk-wave"></div>'
        },
        {
            class: 'sk-cube-grid',
            html: `
                <div class="sk-cube-grid">
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                    <div class="sk-cube"></div>
                </div>
            `
        }
    ];

    const loadingTexts = [
        '正在加载精彩内容...',
        '正在飞速加载中...',
        '正在准备精彩内容...',
        '正在组装像素魔法...',
        '正在穿越网络的海洋...',
        '正在召唤帖子的灵魂...',
        '正在加载宇宙的奥秘...',
        '正在点亮知识的火花...',
        '正在编织信息的网络...',
        '正在唤醒沉睡的数据...',
        '正在绘制数字的画卷...',
        '正在解码比特的秘密...',
        '正在搭建内容的桥梁...',
        '正在收集思维的碎片...'
    ];

    // 获取随机动画和文字
    function getRandomLoadingContent() {
        const animation = loadingAnimations[Math.floor(Math.random() * loadingAnimations.length)];
        const text = loadingTexts[Math.floor(Math.random() * loadingTexts.length)];
        return { animation, text };
    }

    // --- 设置功能 ---

    // 显示toast通知
    function showToast(message, type = 'info') {
        // 移除现有的toast
        const existingToast = document.querySelector('.libra-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = `libra-toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 强制重绘
        toast.offsetHeight;

        // 显示toast
        toast.classList.add('show');

        // 3秒后自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // 全局扫描并处理所有帖子项
    function processAllPostItems() {
        // 找到所有包含time元素的li，这些就是帖子项
        const timeElements = document.querySelectorAll('time');
        timeElements.forEach(timeEl => {
            const li = timeEl.closest('li');
            if (li) {
                processListItem(li);
            }
        });
    }

    // 创建配置描述
    const configDesc = {
        clickTitleQuickView: {
            name: "点击帖子标题开启快速查看",
            type: "bool",
            value: false
        }
    };

    // 注册配置
    const config = new GM_config(configDesc, { immediate: true });

    // 设置Settings对象使用GM_config
    Settings = {
        get clickTitleQuickView() {
            return config.get('clickTitleQuickView');
        },
        set clickTitleQuickView(value) {
            config.set('clickTitleQuickView', value);
        }
    };

    // 监听配置变化，实时生效
    config.addEventListener('set', (e) => {
        const { prop, after } = e.detail;
        if (prop === 'clickTitleQuickView') {
            // 显示状态变化通知
            const message = after ? '✅ 已启用：点击帖子标题开启快速查看' : '⬜ 已禁用：点击帖子标题开启快速查看';
            showToast(message, after ? 'success' : 'info');

            // 实时生效：重新处理所有帖子项
            processAllPostItems();
        }
    });

})();
// ==UserScript==
// @name         2libra-enhance
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  2libra.com 论坛增强：帖子快速预览、智能返回顶部
// @author       twocold0451
// @homepage     https://github.com/twocold0451/2libra-enhance
// @supportURL   https://github.com/twocold0451/2libra-enhance/issues
// @match        https://2libra.com/*
// @license MIT
// @grant        none
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
        iframeId: 'libra-quick-view-iframe'
    };

    // 样式注入
    const style = document.createElement('style');
    style.textContent = `
        .libra-quick-btn {
            position: absolute; /* 绝对定位，脱离文档流，不影响父元素高度 */
            left: 100%; /* 位于父元素右侧 */
            top: 50%;
            transform: translateY(-50%); /* 垂直居中 */
            margin-left: 10px;
            white-space: nowrap;
            
            padding: 2px 8px;
            font-size: 12px;
            cursor: pointer;
            border-radius: 4px;
            background-color: var(--color-primary, #4a00ff);
            color: #fff;
            border: none;
            display: none; /* 默认隐藏 */
            transition: opacity 0.2s;
        }
        
        /* 
           使用自定义类名控制显示 
           当鼠标悬停在被脚本标记为帖子的元素(.libra-post-item)上时，显示按钮
        */
        .libra-post-item:hover .libra-quick-btn {
            display: inline-block;
        }

        .libra-quick-btn:hover {
            opacity: 0.9;
        }

        /* 自定义返回顶部按钮 */
        #custom-back-to-top {
            position: fixed;
            z-index: 9990;
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
            z-index: 9999;
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
            background: var(--base-100, #fff);
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
            background: var(--base-200, #f0f0f0);
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
        #${CONFIG.modalId} iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: var(--base-100, #fff);
        }
    `;
    document.head.appendChild(style);

    // 创建模态框
    function createModal() {
        if (document.getElementById(CONFIG.modalId)) return;

        const modal = document.createElement('div');
        modal.id = CONFIG.modalId;
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title">快速预览</span>
                    <div class="modal-actions">
                        <button class="btn-go-thread">进入帖子 ↗</button>
                        <button class="btn-close-large">关闭</button>
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
        const iframe = document.getElementById(CONFIG.iframeId);
        const titleEl = modal.querySelector('.modal-title');
        const goBtn = modal.querySelector('.btn-go-thread');
        
        iframe.src = url;
        titleEl.textContent = title || '快速预览';
        
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
                        z-index: 2147483640 !important; 
                        background: var(--base-100, #fff) !important;
                        overflow-y: auto !important; 
                        padding: 20px !important;
                        margin: 0 !important;
                        border: none !important;
                    }
                    .EmojiPickerReact { z-index: 2147483647 !important; }
                    body, html { overflow: hidden !important; }
                `;
                const style = doc.createElement('style');
                style.textContent = css;
                doc.head.appendChild(style);
            } catch (e) {
                // Ignore cross-origin errors
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
        if (!li || li.dataset.libraQuickBtnAdded) return;

        // 查找这一行中的 time 元素
        const timeEl = li.querySelector('time');
        if (!timeEl) return;

        // 查找帖子标题链接
        const metaRow = timeEl.parentElement;
        const titleLink = metaRow ? metaRow.previousElementSibling : null;

        if (!titleLink || titleLink.tagName !== 'A') return;

        // 标记为已添加
        li.dataset.libraQuickBtnAdded = 'true';
        li.classList.add('libra-post-item');

        // time 的父元素通常就是"标题下面一行"的容器 (meta row)
        const parent = timeEl.parentElement; 
        if (parent) {
            parent.style.position = 'relative';
            const btn = document.createElement('button');
            btn.className = 'libra-quick-btn';
            btn.textContent = CONFIG.btnText;
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(titleLink.href, titleLink.textContent);
            };
            parent.appendChild(btn);
        }
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

})();
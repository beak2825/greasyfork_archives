// ==UserScript==
// @name         CSDN 阅读模式
// @description  CSDN页面重置, 支持黑暗模式, 无弹窗无广告无任何干扰, 自动展开文章和评论, 自由复制, 外链直达! 同步支持脚本之家, 简书
// @version      1.0.1
// @author       kiwifruit13
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @run-at       document-start
//
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://www.jb51.net/article/*
// @match        *://www.jianshu.com/*
//
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @compatible   Chrome Latest
// @compatible   Safari Latest
// @downloadURL https://update.greasyfork.org/scripts/564239/CSDN%20%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/564239/CSDN%20%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // ==================== 配置管理 ====================
    const config = {
        defaults: {
            darkMode: false,
            focusMode: false,
            asidePin: false,
            customWidth: 1000,
            fontSize: 16,
            lineHeight: 1.6
        },
        storageKey: 'CSDNFocus_Config',
        get(key) {
            try {
                const data = GM_getValue(this.storageKey, {});
                return data[key] !== undefined ? data[key] : this.defaults[key];
            } catch (error) {
                console.error('CSDN Focus: 配置读取失败', error);
                return this.defaults[key];
            }
        },
        set(key, value) {
            try {
                const data = GM_getValue(this.storageKey, {});
                data[key] = value;
                GM_setValue(this.storageKey, data);
                this.applyToDOM(key, value);
            } catch (error) {
                console.error('CSDN Focus: 配置保存失败', error);
            }
        },
        applyToDOM(key, value) {
            const h = document.documentElement;
            switch (key) {
                case 'darkMode':
                    if (value) {
                        h.setAttribute('darkMode', '');
                    } else {
                        h.removeAttribute('darkMode');
                    }
                    break;
                case 'focusMode':
                    if (value) {
                        h.setAttribute('focusMode', '');
                    } else {
                        h.removeAttribute('focusMode');
                    }
                    break;
                case 'asidePin':
                    if (value) {
                        h.setAttribute('asidePin', '');
                    } else {
                        h.removeAttribute('asidePin');
                    }
                    break;
                case 'customWidth':
                    h.style.setProperty('--custom-width', `${value}px`);
                    break;
                case 'fontSize':
                    h.style.setProperty('--font-size', `${value}px`);
                    break;
                case 'lineHeight':
                    h.style.setProperty('--line-height', String(value));
                    break;
                default:
                    break;
            }
        },
        init() {
            Object.keys(this.defaults).forEach((key) => {
                const value = this.get(key);
                this.applyToDOM(key, value);
            });
            // 监听系统主题变化
            if (window.matchMedia) {
                const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleThemeChange = (e) => {
                    if (this.get('darkMode') === 'auto') {
                        this.set('darkMode', e.matches);
                    }
                };
                darkModeQuery.addEventListener('change', handleThemeChange);
                handleThemeChange(darkModeQuery);
            }
        }
    };
    // ==================== 工具函数 ====================
    const utils = {
        safeQuerySelector(selector) {
            try {
                return document.querySelector(selector);
            } catch (error) {
                console.warn(`CSDN Focus: 无效的选择器 "${selector}"`, error);
                return null;
            }
        },
        safeQuerySelectorAll(selector) {
            try {
                return document.querySelectorAll(selector);
            } catch (error) {
                console.warn(`CSDN Focus: 无效的选择器 "${selector}"`, error);
                return [];
            }
        },
        copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text)
                    .catch((error) => {
                        console.warn('CSDN Focus: Clipboard API 失败，尝试降级方案', error);
                        return this.fallbackCopyToClipboard(text);
                    });
            }
            return this.fallbackCopyToClipboard(text);
        },
        fallbackCopyToClipboard(text) {
            return new Promise((resolve, reject) => {
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    if (successful) {
                        resolve();
                    } else {
                        reject(new Error('execCommand 失败'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        },
        animateScroll(element, to, duration) {
            const start = element.scrollTop;
            const change = to - start;
            const startTime = performance.now();
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                element.scrollTop = start + change * easeProgress;
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            requestAnimationFrame(animateScroll);
        }
    };
    // ==================== 文章助手 ====================
    const articleHelper = {
        init() {
            this.expandArticle();
            this.removeCopyRestriction();
            this.cleanCopyFooter();
            this.expandComments();
            this.enhanceCopyButtons();
        },
        expandArticle() {
            // 移除"关注阅读全文"等折叠区域
            const hideElements = utils.safeQuerySelectorAll(
                '.hide-article-box, #btn-readmore, .article-content-hide'
            );
            hideElements.forEach((element) => {
                element.remove();
            });
            // 确保文章内容完全展开
            const contentElements = utils.safeQuerySelectorAll(
                '#content_views, #article_content, .article_content, .blog-content-box'
            );
            contentElements.forEach((element) => {
                element.style.setProperty('height', 'auto', 'important');
                element.style.setProperty('max-height', 'none', 'important');
                element.style.setProperty('overflow', 'visible', 'important');
            });
        },
        removeCopyRestriction() {
            // 移除用户选择限制
            const contentViews = utils.safeQuerySelector('#content_views');
            if (contentViews) {
                contentViews.style.setProperty('user-select', 'auto', 'important');
                contentViews.style.setProperty('-webkit-user-select', 'auto', 'important');
            }
            // 确保代码块可以选择
            const codeBlocks = utils.safeQuerySelectorAll('pre, code');
            codeBlocks.forEach((block) => {
                block.style.setProperty('user-select', 'text', 'important');
                block.style.setProperty('-webkit-user-select', 'text', 'important');
            });
            // 移除复制事件监听器
            document.addEventListener('copy', (e) => {
                e.stopImmediatePropagation();
            }, true);
        },
        cleanCopyFooter() {
            document.addEventListener('copy', (e) => {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                let text = selection.toString();
                // 移除CSDN版权信息
                text = text.replace(/\n\s*—+\s*[\s\S]*?CSDN.*$/, '');
                e.stopImmediatePropagation();
                e.preventDefault();
                e.clipboardData.setData('text/plain', text);
                e.clipboardData.setData('text/html', text);
            }, true);
        },
        expandComments() {
            const commentContainers = utils.safeQuerySelectorAll('.comment-list-container, .comment-box');
            commentContainers.forEach((container) => {
                container.style.setProperty('max-height', 'none', 'important');
                container.style.setProperty('overflow', 'visible', 'important');
            });
            const commentPage = utils.safeQuerySelector('#commentPage');
            if (commentPage) {
                commentPage.style.setProperty('display', 'block', 'important');
            }
        },
        enhanceCopyButtons() {
            // 使用 setTimeout 确保在动态加载内容后也能捕获到按钮
            const processButtons = () => {
                const copyButtons = utils.safeQuerySelectorAll('.hljs-button.signin, .copy-code-btn');
                copyButtons.forEach((button) => {
                    // 防止重复绑定
                    if (button.dataset.csdnFocusProcessed) return;
                    button.dataset.csdnFocusProcessed = 'true';
                    button.setAttribute('data-title', '自由复制');
                    button.classList.remove('signin');
                    const originalOnClick = button.onclick;
                    button.onclick = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        let codeText = '';
                        const codeBlock = button.closest('pre');
                        if (codeBlock) {
                            codeText = codeBlock.innerText || codeBlock.textContent;
                        }
                        if (!codeText) return;
                        utils.copyToClipboard(codeText)
                            .then(() => {
                                const originalTitle = button.getAttribute('data-title');
                                button.setAttribute('data-title', '复制成功');
                                button.style.color = '#67C23A';
                                setTimeout(() => {
                                    button.setAttribute('data-title', originalTitle);
                                    button.style.color = '';
                                }, 2000);
                            })
                            .catch((err) => console.error(err));
                    };
                });
            };
            processButtons();
            // 监听 DOM 变化以处理动态加载的代码块
            const observer = new MutationObserver(processButtons);
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };
    // ==================== 事件助手 ====================
    const eventHelper = {
        init() {
            this.setupWidthAdjustment();
            this.setupBackToTop();
            this.setupExternalLinks();
            this.setupAsidePin();
            this.setupDarkMode();
            this.setupKeyboardShortcuts();
        },
        setupWidthAdjustment() {
            // 延迟绑定，确保 mainBox 已存在
            const initDrag = () => {
                const mainBox = utils.safeQuerySelector('#mainBox');
                if (!mainBox) return;
                const container = document.querySelector('.toolbar-search.onlySearch');
                if (container) {
                    container.style.setProperty('max-width', 'var(--custom-width)', 'important');
                }
                let isDragging = false;
                let startX = 0;
                let startWidth = 0;
                mainBox.addEventListener('mousedown', (e) => {
                    if (e.target !== mainBox) return;
                    isDragging = true;
                    startX = e.clientX;
                    startWidth = mainBox.offsetWidth;
                    mainBox.style.setProperty('user-select', 'none', 'important');
                    e.preventDefault();
                });
                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const deltaX = e.clientX - startX;
                    // 计算逻辑参考原版，保证拖拽手感一致
                    const moveLen = (startX / (window.innerWidth * 0.88) < 0.5) ? startX - e.clientX : e.clientX - startX;
                    const newWidth = Math.max(800, Math.min(startWidth + moveLen * 2 - 20, window.innerWidth * 0.88));
                    config.set('customWidth', newWidth);
                });
                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        mainBox.style.setProperty('user-select', 'auto', 'important');
                    }
                });
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initDrag);
            } else {
                // 如果 mainBox 还没渲染出来，稍后重试
                if (!utils.safeQuerySelector('#mainBox')) {
                    setTimeout(initDrag, 500);
                } else {
                    initDrag();
                }
            }
        },
        setupBackToTop() {
            const topBtn = utils.safeQuerySelector('#FinnTop');
            if (topBtn) {
                topBtn.addEventListener('click', () => {
                    utils.animateScroll(document.documentElement, 0, 300);
                });
            }
        },
        setupExternalLinks() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;
                const href = link.getAttribute('href');
                if (!href) return;
                const linkHost = link.hostname || '';
                if (linkHost && !linkHost.includes('csdn.net')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
            }, true);
        },
        setupAsidePin() {
            const pinBtn = utils.safeQuerySelector('#pinBtn');
            if (pinBtn) {
                pinBtn.addEventListener('click', () => {
                    const currentPin = config.get('asidePin');
                    config.set('asidePin', !currentPin);
                });
            }
        },
        setupDarkMode() {
            const darkBtn = utils.safeQuerySelector('#darkBtn');
            if (darkBtn) {
                darkBtn.addEventListener('click', () => {
                    const currentMode = config.get('darkMode');
                    config.set('darkMode', !currentMode);
                });
            }
        },
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey && (e.key === 'd' || e.key === 'D')) {
                    e.preventDefault();
                    const currentMode = config.get('darkMode');
                    config.set('darkMode', !currentMode);
                }
                if (e.key === 'Escape' && config.get('focusMode')) {
                    config.set('focusMode', false);
                }
            });
        }
    };
    // ==================== 样式注入 ====================
    const styleHelper = {
        templates: {
            csdn(finnWidth) {
                const customWidth = config.get('customWidth') || finnWidth;
                // 合并原版脚本的隐藏规则，确保滚动时不出现原版元素
                return `
<style>
:root {
    --custom-width: ${customWidth}px;
    --font-size: 16px;
    --line-height: 1.6;
    --bg-color: #f6f6f6;
    --text-color: #333;
    --code-bg: #f5f5f5;
}
/* 暗色模式变量 - 使用 filter 方案以保证最强兼容性 */
[darkMode] {
    --bg-color: #ebebeb;
    --text-color: #333;
}
[darkMode] body {
    filter: invert(1) hue-rotate(180deg) !important;
    background: #ebebeb !important;
}
[darkMode] img,
[darkMode] .hljs,
[darkMode] pre,
[darkMode] code {
    filter: invert(1) hue-rotate(180deg) !important;
}
/* 专注模式 */
[focusMode] #csdn-toolbar,
[focusMode] .blog_container_aside,
[focusMode] .recommend-box,
[focusMode] .comment-box,
[focusMode] #FinnTop,
[focusMode] #pinBtn,
[focusMode] #darkBtn {
    display: none !important;
}
[focusMode] #mainBox {
    max-width: 900px !important;
    margin: 20px auto !important;
}
html {
    scroll-behavior: smooth;
}
body {
    background-color: var(--bg-color) !important;
    transition: background 0.3s;
    min-width: 100% !important;
}
#content_views {
    user-select: auto !important;
    -webkit-user-select: auto !important;
    font-size: var(--font-size);
    line-height: var(--line-height);
}
pre, code {
    background-color: var(--code-bg) !important;
    user-select: text !important;
    -webkit-user-select: text !important;
}
/* ==================== 关键修复：补全隐藏规则 ==================== */
/* 以下列表包含原脚本中所有需要隐藏的元素，防止滚动时出现 */
.aside-box-footer,
#asideCategory,
#asideHotArticle,
#asideNewComments,
#asideNewNps,
#asideSearchArticle + .box-shadow.mb8,
#blogColumnPayAdvert,
#csdn-toolbar .toolbar-advert,
#csdn-toolbar .toolbar-container-left,
#csdn-toolbar .toolbar-container-right,
#dmp_ad_58,
#footerRightAds,
#passportbox,
#placeholder,
#rightAside,
#recommendNps,
.blog-footer-bottom,
.csdn-shop-window-common,
.csdn-side-toolbar,
.hide-article-box.hide-article-pos.text-center,
.leftPop,
.login-mark,
.opt-box.text-center,
.template-box,
.toolbar-search-drop-menu.toolbar-search-half,
::-webkit-input-placeholder,
.passport-login-mark,
.passport-login-container,
.hide-preCode-box,
#marketingBox,
.icon-fire,
#toolBarBox .tool-hover-tip + .tool-active-list,
.passport-login-tip-container,
#remuneration,
#asideWriteGuide,
#asideSearchArticle,
#tool-share,
#treeSkill,
#swiper-remuneration-container,
.swiper-slide-box-remuneration,
.ai-abstract-box,
.btn-code-notes.ckeditor {
    display: none !important;
    margin: 0 !important;
    color: transparent !important;
    visibility: hidden !important;
    height: 0 !important;
}
/* 强制显示目录 */
#asidedirectory,
.d-flex {
    display: block !important;
}
/* 目录悬浮与交互 */
.blog_container_aside {
    width: 300px !important;
    height: calc(100% - 100px) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    border: solid #fff !important;
    border-width: 20px 4px 0 4px !important;
    background: #fff !important;
    box-sizing: content-box !important;
    position: fixed !important;
    top: initial !important;
    left: -307px !important;
    transition: all 0.35s !important;
    box-shadow: 2px 0 10px 0 rgba(0,0,0,0.15) !important;
    z-index: 1111 !important;
    cursor: auto;
}
/* 滚动条样式 */
.blog_container_aside::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 15px rgba(0,0,0,0.13);
    background-color: #fefefe;
}
.blog_container_aside::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #eee;
}
.blog_container_aside::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: #cecece;
}
/* 目录交互 */
.blog_container_aside:hover {
    left: 0 !important;
}
[asidePin] .blog_container_aside {
    left: 0 !important;
}
/* 标签指示条 */
aside.blog_container_aside:before {
    width: 14px;
    animation: _l 1s ease-in forwards;
    position: fixed;
    top: 48px;
    left: -3px !important;
    padding: 5px 1px 10px;
    background: #ff4d4d;
    text-align: center;
    color: #fff;
    content: "目录";
    writing-mode: tb-rl;
    font-size: 10px;
    line-height: 1;
    border-radius: 0 0 15px 0;
    transition: all 0.35s ease;
}
@keyframes _l {
    from { left: -20px; }
    to { left: 0; }
}
aside.blog_container_aside:hover:before,
[asidePin] aside.blog_container_aside:before {
    width: 308px;
    height: 18px;
    padding: 4px 2px;
    writing-mode: rl-tb;
    font-size: 14px;
    top: 66px;
    border-radius: 0;
}
/* 关键修复：底部推荐框处理 */
.recommend-box.insert-baidu-box {
    height: 60%;
    overflow: auto !important;
    position: fixed;
    background: #fff;
    box-sizing: content-box;
    transition: all 0.38s;
    box-shadow: 0 -3px 10px 0 rgba(0,0,0,0.25);
    border: 10px solid #fff;
    z-index: 1995;
    top: calc(100% - 7px);
    left: 0;
    right: 0;
    margin: auto;
    width: var(--custom-width);
}
.recommend-box.insert-baidu-box:hover {
    top: calc(39% - 7px);
}
.recommend-box.insert-baidu-box::-webkit-scrollbar-thumb {
    background-color: rgba(153,154,170,0.3);
}
.recommend-box.insert-baidu-box::-webkit-scrollbar {
    width: 5px;
    height: 100px;
}
.recommend-item-box {
    display: none !important;
}
.recommend-item-box.type_blog {
    display: block !important;
}
.recommend-box.insert-baidu-box:before {
    position: fixed;
    bottom: 7px;
    left: 50%;
    margin-left: calc(var(--custom-width) / 2);
    padding: 30px 5px;
    background: #ff4d4d;
    content: "";
    pointer-events: auto !important;
}
/* 主布局与工具栏 */
body #csdn-toolbar {
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.15);
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1993;
}
.toolbar-search.onlySearch {
    transition: all 0.3s ease;
}
.toolbar-search.onlySearch:focus-within {
    max-width: var(--custom-width) !important;
    width: var(--custom-width) !important;
}
#mainBox {
    position: relative !important;
    margin: 10px auto 30px !important;
    width: var(--custom-width) !important;
    padding: 0 10px;
    box-sizing: content-box;
    cursor: e-resize;
    /* 移除原版中的 main 的样式，保留 #mainBox 控制 */
}
/* 评论区域 */
.comment-list-box {
    max-height: none !important;
}
#commentPage,
.toolbar-container-middle {
    display: block !important;
}
.toolbar-container {
    min-width: 100% !important;
}
#article_content {
    height: auto !important;
}
.comment-list-container {
    padding: 4px 0 !important;
}
.article-header-box {
    padding-top: 18px !important;
}
main .comment-box {
    padding: 0;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    margin: 8px 0;
}
/* 隐藏未登录评论提示 */
#pcCommentBox:has(.unlogin-comment-model) {
    display: none !important;
}
/* 优化后的按钮样式 */
#darkBtn {
    position: fixed;
    top: 8px;
    left: 50px;
    width: 32px;
    height: 32px;
    z-index: 9999;
    background: linear-gradient(135deg, #ffa726, #ff7043);
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.5s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
#darkBtn::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    transition: all 0.5s ease;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
}
[darkMode] #darkBtn {
    background: linear-gradient(135deg, #667eea, #764ba2);
}
[darkMode] #darkBtn::before {
    background: #fff;
    border-radius: 0;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 14px;
    height: 14px;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
}
#darkBtn:after {
    content: "深色模式";
    width: 80px;
    position: absolute;
    right: -100px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-weight: 600;
    transition: all 0.5s ease;
    display: none;
    white-space: nowrap;
}
[darkMode] #darkBtn:after {
    content: "浅色模式";
    right: -90px;
    filter: invert(1) hue-rotate(180deg);
}
#darkBtn:hover:after {
    display: block;
}
#darkBtn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
#pinBtn {
    position: fixed;
    left: 18px;
    top: 12px;
    z-index: 9999;
    width: 24px;
    height: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
}
#pinBtn::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 18px;
    background: #999;
    border-radius: 2px 2px 0 0;
    transition: all 0.3s ease;
}
#pinBtn::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 8px;
    background: #999;
    border-radius: 8px 8px 4px 4px;
    transition: all 0.3s ease;
}
[asidePin] #pinBtn::before {
    background: #ff4d4d;
}
[asidePin] #pinBtn::after {
    background: #ff4d4d;
}
#pinBtn:hover::before {
    transform: translateX(-50%) scaleY(1.1);
}
#pinBtn:hover::after {
    transform: translateX(-50%) scale(1.05);
}
#FinnTop {
    width: 36px;
    height: 36px;
    color: #fff;
    font: 600 14px/44px arial;
    text-align: center;
    position: fixed;
    left: 50%;
    margin-left: calc(var(--custom-width) / 2 + 20px);
    bottom: 80px;
    z-index: 999;
    cursor: pointer;
    background: linear-gradient(135deg, #ff4d4d, #ff7043);
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}
#FinnTop::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%) rotate(-45deg);
    width: 14px;
    height: 14px;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    transition: all 0.3s ease;
}
#FinnTop:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}
#FinnTop:hover::before {
    transform: translate(-50%, -60%) rotate(-45deg) scale(1.1);
}
/* 搜索框样式重置 */
#toolbar-search-input, #toolbar-search-button {
    border-radius: 0 !important;
}
/* 打印样式 */
@media print {
    #csdn-toolbar, #pcCommentBox, aside, #toolBarBox, .recommend-box, #FinnTop {
        display: none !important;
    }
}
</style>
<div id="darkBtn"></div>
<div id="pinBtn"></div>
<div id="FinnTop" title="返回顶部"></div>
`;
            },
            jb51(finnWidth) {
                const customWidth = config.get('customWidth') || finnWidth;
                return `
<style>
#container {
    width: ${customWidth}px !important;
    max-width: 95vw !important;
    margin: 0 auto !important;
}
#main .main-right,
#topbar,
#footer,
.pt10,
.lbd,
.xgcomm,
#header,
.lbd_bot,
#ewm,
.subnav,
.art_xg,
.tags,
#comments {
    display: none !important;
}
body #main .main-left {
    padding: 0 !important;
    width: unset !important;
    float: none !important;
}
body #article {
    padding: 15px 20px 20px !important;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.25) !important;
    background: white !important;
}
</style>
`;
            },
            jianshu(finnWidth) {
                const customWidth = config.get('customWidth') || finnWidth;
                return `
<style>
#wrapper,
header,
aside,
iframe,
._13lIbp,
._3Pnjry,
.ouvJEz:not(:first-of-type) {
    display: none !important;
}
._gp-ck {
    width: ${customWidth}px !important;
    max-width: 95vw !important;
    margin: 20px auto !important;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.25) !important;
    padding: 20px !important;
    background: white !important;
}
</style>
`;
            }
        },
        inject() {
            let template = '';
            const finnWidth = 1000;
            if (location.host === 'www.jb51.net') {
                template = this.templates.jb51(finnWidth);
            } else if (location.host === 'www.jianshu.com') {
                template = this.templates.jianshu(finnWidth);
            } else {
                template = this.templates.csdn(finnWidth);
            }
            document.documentElement.insertAdjacentHTML('afterbegin', template);
        }
    };
    // ==================== 初始化流程 ====================
    function init() {
        config.init();
        // 立即注入样式，避免闪烁 (参考原版逻辑)
        styleHelper.inject();
        // DOM加载后绑定事件
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
        } else {
            onDOMContentLoaded();
        }
    }
    function onDOMContentLoaded() {
        articleHelper.init();
        eventHelper.init();
    }
    // 在document-start阶段就开始初始化
    init();
})();
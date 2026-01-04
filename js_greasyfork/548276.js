// ==UserScript==
// @name         AI Chat Auto-Scroll Blocker
// @name:zh-CN   锁定聊天页面滚动 ChatGPT & Gemini & Claude
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Prevents ChatGPT, Gemini, and Claude from auto-scrolling during conversations, giving you full control over your reading experience
// @description:zh-CN  每次在ChatGPT或Gemini提问时，页面总是自动滚动到底部，我还没看完上一个答案就被强制跳到新答案了，非常影响体验
// @author       Efficient Lazy Panda
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/*
// @match        https://bard.google.com/*
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548276/AI%20Chat%20Auto-Scroll%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/548276/AI%20Chat%20Auto-Scroll%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrollBlocked = true; // 默认阻止自动滚动
    let originalScrollIntoView = null;
    let originalScrollTo = null;
    let originalScrollTop = null;

    // 阻止自动滚动
    function blockAutoScroll() {
        // 保存原始函数
        if (!originalScrollIntoView) {
            originalScrollIntoView = Element.prototype.scrollIntoView;
            originalScrollTo = window.scrollTo;
            originalScrollTop = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop') ||
                              Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTop');
        }

        Element.prototype.scrollIntoView = function(options) {
            if (scrollBlocked) {
                console.log('阻止了 scrollIntoView 调用');
                return false;
            }
            return originalScrollIntoView.call(this, options);
        };

        window.scrollTo = function(x, y) {
            if (scrollBlocked) {
                // 只阻止向下滚动
                if (y > window.scrollY) {
                    console.log('阻止了向下 scrollTo 调用:', x, y);
                    return false;
                }
            }
            return originalScrollTo.call(this, x, y);
        };

        if (originalScrollTop) {
            Object.defineProperty(Element.prototype, 'scrollTop', {
                get: function() {
                    return originalScrollTop.get ? originalScrollTop.get.call(this) : 0;
                },
                set: function(value) {
                    if (scrollBlocked && value > this.scrollTop) {
                        console.log('阻止了向下滚动设置 scrollTop:', value);
                        return;
                    }
                    if (originalScrollTop && originalScrollTop.set) {
                        originalScrollTop.set.call(this, value);
                    }
                }
            });
        }
    }

    // 智能滚动阻止系统
    function preventScrollEvents() {
        let lastScrollTime = 0;
        let scrollAttempts = 0;

        // 阻止自动滚动，但允许手动滚动
        document.addEventListener('scroll', function(e) {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTime;

            if (scrollBlocked) {
                // 如果滚动间隔太短（可能是自动滚动）
                if (timeDiff < 50) {
                    scrollAttempts++;
                    if (scrollAttempts > 3) {
                        console.log('检测到连续自动滚动，已阻止');
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                } else {
                    scrollAttempts = 0;
                }
            }

            lastScrollTime = currentTime;
            window.lastScrollY = window.scrollY;
        }, { capture: true, passive: false });

        // 监听页面滚动行为变化
        const originalSetTimeout = window.setTimeout;

        window.setTimeout = function(callback, delay, ...args) {
            if (scrollBlocked && delay > 0 && delay < 1000) {
                // 检查回调函数是否可能执行滚动
                const callbackStr = callback.toString();
                if (callbackStr.includes('scroll') ||
                    callbackStr.includes('scrollIntoView') ||
                    callbackStr.includes('scrollTop')) {
                    console.log('阻止可能的自动滚动定时器');
                    return originalSetTimeout(() => {}, delay);
                }
            }
            return originalSetTimeout.call(this, callback, delay, ...args);
        };
    }

    // ChatGPT 特定的防滚动修复
    function applyChatGPTFix() {
        let lastScrollPosition = 0;

        const observer = new MutationObserver((mutations) => {
            if (scrollBlocked) {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const selectors = [
                                    '[data-testid^="conversation-turn"]',
                                    '[role="presentation"]',
                                    '.group.w-full',
                                    '.flex.w-full.items-center',
                                    'article',
                                    '.prose',
                                    '[data-message-author-role]'
                                ];

                                let foundMessage = false;
                                selectors.forEach(selector => {
                                    if (node.matches && node.matches(selector) ||
                                        node.querySelector && node.querySelector(selector)) {
                                        foundMessage = true;
                                    }
                                });

                                if (foundMessage) {
                                    console.log('检测到 ChatGPT 新消息，阻止自动滚动');

                                    setTimeout(() => {
                                        if (window.scrollY > lastScrollPosition + 50) {
                                            window.scrollTo(0, lastScrollPosition);
                                        }
                                    }, 100);
                                }
                            }
                        });
                    }
                });
            }
            lastScrollPosition = window.scrollY;
        });

        window.addEventListener('scroll', () => {
            if (!scrollBlocked) {
                lastScrollPosition = window.scrollY;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        setInterval(() => {
            if (scrollBlocked) {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScrollPosition + 100) {
                    console.log('ChatGPT: 阻止意外的大幅滚动');
                    window.scrollTo(0, lastScrollPosition);
                }
            }
        }, 200);
    }

    function applyGeminiFix() {
        let lastScrollPosition = 0;

        const observer = new MutationObserver((mutations) => {
            if (scrollBlocked) {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const selectors = [
                                    '[data-message-id]',
                                    '.model-response-container',
                                    '.conversation-container',
                                    '[role="log"]',
                                    '.response-container'
                                ];

                                let foundMessage = false;
                                selectors.forEach(selector => {
                                    if (node.matches && node.matches(selector) ||
                                        node.querySelector && node.querySelector(selector)) {
                                        foundMessage = true;
                                    }
                                });

                                if (foundMessage) {
                                    console.log('检测到 Gemini 新消息，阻止自动滚动');
                                    setTimeout(() => {
                                        if (window.scrollY > lastScrollPosition + 50) {
                                            window.scrollTo(0, lastScrollPosition);
                                        }
                                    }, 100);
                                }
                            }
                        });
                    }
                });
            }
            lastScrollPosition = window.scrollY;
        });

        window.addEventListener('scroll', () => {
            if (!scrollBlocked) {
                lastScrollPosition = window.scrollY;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        setInterval(() => {
            if (scrollBlocked) {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScrollPosition + 100) {
                    console.log('Gemini: 阻止意外的大幅滚动');
                    window.scrollTo(0, lastScrollPosition);
                }
            }
        }, 200);
    }

    // Claude AI 的防滚动修复
    function applyClaudeFix() {
        let lastScrollPosition = 0;

        const observer = new MutationObserver((mutations) => {
            if (scrollBlocked) {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const selectors = [
                                    '[data-testid="message"]',
                                    '.font-user-message',
                                    '.font-claude-message',
                                    '.message',
                                    '.conversation-message'
                                ];

                                let foundMessage = false;
                                selectors.forEach(selector => {
                                    if (node.matches && node.matches(selector) ||
                                        node.querySelector && node.querySelector(selector)) {
                                        foundMessage = true;
                                    }
                                });

                                if (foundMessage) {
                                    console.log('检测到 Claude AI 新消息，阻止自动滚动');
                                    setTimeout(() => {
                                        if (window.scrollY > lastScrollPosition + 50) {
                                            window.scrollTo(0, lastScrollPosition);
                                        }
                                    }, 100);
                                }
                            }
                        });
                    }
                });
            }
            lastScrollPosition = window.scrollY;
        });

        window.addEventListener('scroll', () => {
            if (!scrollBlocked) {
                lastScrollPosition = window.scrollY;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        setInterval(() => {
            if (scrollBlocked) {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScrollPosition + 100) {
                    console.log('Claude AI: 阻止意外的大幅滚动');
                    window.scrollTo(0, lastScrollPosition);
                }
            }
        }, 200);
    }

    // 检测网站类型并应用相应的防滚动策略
    function detectSiteAndApplyFix() {
        const hostname = window.location.hostname;

        if (hostname.includes('chatgpt.com') || hostname.includes('openai.com')) {
            console.log('检测到 ChatGPT 网站，启用防自动滚动');
            applyChatGPTFix();
        } else if (hostname.includes('gemini.google.com') || hostname.includes('bard.google.com')) {
            console.log('检测到 Gemini 网站，启用防自动滚动');
            applyGeminiFix();
        } else if (hostname.includes('claude.ai')) {
            console.log('检测到 Claude AI 网站，启用防自动滚动');
            applyClaudeFix();
        }
    }

    // 初始化脚本
    function init() {
        console.log('ChatGPT & Gemini & Claude 防自动滚动脚本 v1.0 已启动');

        // 应用滚动阻止
        blockAutoScroll();

        // 阻止滚动事件
        preventScrollEvents();

        // 检测并应用网站特定修复
        detectSiteAndApplyFix();
    }

    // 立即运行初始化
    init();

})();
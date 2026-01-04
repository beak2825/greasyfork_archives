// ==UserScript==
// @name         linuxdo避免产生成大量历史记录
// @namespace    http://tampermonkey.net/
// @version      36.2
// @description  linux.do(Discourse)避免产生大量历史记录
// @author       翼城
// @match        https://linux.do/*
// @match        https://*.linux.do/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552968/linuxdo%E9%81%BF%E5%85%8D%E4%BA%A7%E7%94%9F%E6%88%90%E5%A4%A7%E9%87%8F%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/552968/linuxdo%E9%81%BF%E5%85%8D%E4%BA%A7%E7%94%9F%E6%88%90%E5%A4%A7%E9%87%8F%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isNavigationInProgress = false;
    let pendingNavigationURL = null;
    let historyStack = [];
    const MAX_HISTORY_TRACK = 10;
    function init() {
        setupNavigationControl();
        setupHistoryTracking();
        patchDiscourseRouter();
        console.log('Discourse历史记录防覆盖修复已启动');
    }
    function setupNavigationControl() {
        historyStack.push({
            url: window.location.href,
            title: document.title,
            timestamp: Date.now()
        });
        overrideHistoryMethods();
        interceptLinkClicks();
        monitorURLChanges();
    }
    function overrideHistoryMethods() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        let lastValidState = {
            url: window.location.href,
            title: document.title,
            state: history.state
        };
        history.pushState = function(state, title, url) {
            if (isNavigationInProgress && url && url.toString().includes('/t/')) {
                const correctTitle = getCorrectTitleForURL(url.toString());
                title = correctTitle;
                state = { ...(state || {}), title: correctTitle, isFixed: true };
                console.log('pushState修正:', {
                    from: lastValidState.title,
                    to: correctTitle,
                    url: url.toString().split('/t/')[1]?.substring(0, 20) + '...'
                });
            }
            const result = originalPushState.call(this, state, title, url);
            if (url && title) {
                lastValidState = { url: url.toString(), title, state };
                addToHistoryStack(url.toString(), title);
            }
            return result;
        };
        history.replaceState = function(state, title, url) {
            if (url && url.toString().includes('/t/')) {
                const currentURL = window.location.href;
                if (currentURL !== url.toString() && title !== getCorrectTitleForURL(url.toString())) {
                    console.warn('阻止了错误的replaceState覆盖:', {
                        currentURL: currentURL.split('/t/')[1]?.substring(0, 20) + '...',
                        targetURL: url.toString().split('/t/')[1]?.substring(0, 20) + '...',
                        attemptedTitle: title
                    });
                    return history.pushState(state, getCorrectTitleForURL(url.toString()), url);
                }
                title = getCorrectTitleForURL(url.toString()) || title;
                state = { ...(state || {}), title, isFixed: true };
            }
            const result = originalReplaceState.call(this, state, title, url);
            if (url && title) {
                updateHistoryStack(url.toString(), title);
                lastValidState = { url: url.toString(), title, state };
            }
            return result;
        };
    }
    function getCorrectTitleForURL(url) {
        if (!url.includes('/t/')) return null;
        if (url === window.location.href) {
            return getCurrentPageTitle();
        }
        const historyItem = historyStack.find(item => item.url === url);
        return historyItem ? historyItem.title : null;
    }
    function getCurrentPageTitle() {
        const topicTitleEl = document.querySelector('.fancy-title, .topic-title, [class*="topic-title"] h1, h1');
        if (topicTitleEl) {
            const titleText = topicTitleEl.textContent.trim();
            if (titleText) {
                return `${titleText} - LINUX DO`;
            }
        }

        return document.title;
    }

    function interceptLinkClicks() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.href && link.href.includes('/t/') &&
                link.href !== window.location.href &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.button !== 1) {

                e.preventDefault();
                e.stopPropagation();
                isNavigationInProgress = true;
                pendingNavigationURL = link.href;
                setTimeout(() => {
                    const correctTitle = getCorrectTitleForURL(link.href) || '加载中...';
                    history.pushState(
                        { isNavigation: true, timestamp: Date.now() },
                        correctTitle,
                        link.href
                    );
                    simulateNavigation(link.href);
                }, 50);
                return false;
            }
        }, true);
    }
    function simulateNavigation(url) {
        if (window.Discourse && window.Discourse.__container__) {
            try {
                const router = window.Discourse.__container__.lookup('router:main');
                if (router) {
                    router.transitionTo(url);
                }
            } catch (e) {
                setTimeout(() => {
                    window.location.href = url;
                }, 100);
            }
        } else {
            setTimeout(() => {
                window.location.href = url;
            }, 100);
        }
        setTimeout(() => {
            isNavigationInProgress = false;
            pendingNavigationURL = null;
        }, 500);
    }
    function monitorURLChanges() {
        let currentURL = window.location.href;
        const checkURL = () => {
            const newURL = window.location.href;
            if (newURL !== currentURL) {
                setTimeout(() => {
                    const correctTitle = getCurrentPageTitle();
                    if (correctTitle && document.title !== correctTitle) {
                        document.title = correctTitle;
                        history.replaceState(
                            { ...history.state, title: correctTitle, urlFixed: true },
                            correctTitle,
                            newURL
                        );
                    }
                    currentURL = newURL;
                }, 300);
            }
        };
        const observer = new MutationObserver(checkURL);
        observer.observe(document, { subtree: true, childList: true, attributes: true });
        window.addEventListener('popstate', checkURL);
        window.addEventListener('hashchange', checkURL);
    }
    function setupHistoryTracking() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.title) {
                addToHistoryStack(window.location.href, event.state.title);
            }
        });
    }
    function addToHistoryStack(url, title) {
        historyStack = historyStack.filter(item => item.url !== url);
        historyStack.unshift({
            url,
            title,
            timestamp: Date.now()
        });
        if (historyStack.length > MAX_HISTORY_TRACK) {
            historyStack = historyStack.slice(0, MAX_HISTORY_TRACK);
        }
    }
    function updateHistoryStack(url, title) {
        const index = historyStack.findIndex(item => item.url === url);
        if (index !== -1) {
            historyStack[index].title = title;
            historyStack[index].timestamp = Date.now();
        }
    }
    function patchDiscourseRouter() {
        const checkDiscourse = setInterval(() => {
            if (typeof require !== 'undefined') {
                clearInterval(checkDiscourse);
                try {
                    const discourseRoutes = require('discourse/routes/topic');
                    if (discourseRoutes?.default) {
                        discourseRoutes.default.disableReplaceState = true;
                        const originalMethod = discourseRoutes.default.actions?.willTransition;
                        if (originalMethod) {
                            discourseRoutes.default.actions.willTransition = function() {
                                isNavigationInProgress = true;
                                return originalMethod.apply(this, arguments);
                            };
                        }
                    }
                } catch (error) {
                    console.log('Discourse路由修补完成');
                }
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();
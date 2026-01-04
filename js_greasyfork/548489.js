// ==UserScript==
// @name         推特(x.com)网页端清理脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏/删除推特时间线中的推荐内容和侧边栏推荐
// @author       You
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548489/%E6%8E%A8%E7%89%B9%28xcom%29%E7%BD%91%E9%A1%B5%E7%AB%AF%E6%B8%85%E7%90%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548489/%E6%8E%A8%E7%89%B9%28xcom%29%E7%BD%91%E9%A1%B5%E7%AB%AF%E6%B8%85%E7%90%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isExecuting = false;
    let processedElements = new Set();
    let lastScrollTop = 0;
    let scrollCheckInterval = null;

    //匹配 x.com/abc123 个人主页,也匹配了平台主页 x.com/home
    let userPattern = /^\/([^\/?#]+)$/;

    //匹配 x.com/abc123/1234567890 ,不匹配 x.com/abc123/with_replies
    let statusPattern = /^\/[^\/?#]+\/status\/\d+$/;

    function 隐藏status发现更多之后的推荐() {
        console.log('执行/status/页清理操作,隐藏"发现更多"之后的推荐');
        const targetSpan = Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent.includes('发现更多'));
        if (!targetSpan) return false;

        const outerDiv = targetSpan.closest('div[style*="translateY"]');
        if (!outerDiv) return false;

        // 获取目标元素的translateY值作为参考点
        const style = outerDiv.getAttribute('style');
        const translateYMatch = style.match(/translateY\(([^)]+)\)/);
        if (!translateYMatch) return false;

        const targetTranslateY = parseFloat(translateYMatch[1].replace('px', ''));

        // 查找并隐藏所有translateY值大于目标值的div中的推荐内容
        let 隐藏计数 = 0;
        const allDivs = document.querySelectorAll('div[style*="translateY"]');

        allDivs.forEach(div => {
            const divStyle = div.getAttribute('style');
            const divTranslateYMatch = divStyle.match(/translateY\(([^)]+)\)/);
            if (divTranslateYMatch) {
                const divTranslateY = parseFloat(divTranslateYMatch[1].replace('px', ''));
                if (divTranslateY > targetTranslateY) {
                    const targetChild = div.querySelector('div > div > article > div > div > div:nth-child(2)');
                    if (targetChild && targetChild.offsetParent !== null) { // 检查元素是否可见
                        targetChild.style.display = 'none';
                        隐藏计数++;
                    }
                }
            }
        });

        if (隐藏计数 > 0) {
            console.log(`已隐藏 ${隐藏计数} 个推荐内容`);
            return true;
        }

        return false;
    }

    function 隐藏主页时间线中的转发(用户名){
        const tweetContainers = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
        let hiddenCount = 0;

        tweetContainers.forEach(container => {
            const isRetweet = container.querySelector('[data-testid="socialContext"]');
            if (!isRetweet) return;

            const userAvatar = container.querySelector(`[data-testid="UserAvatar-Container-${用户名}"]`);
            if (!userAvatar) {
                // 隐藏而不是删除，避免破坏布局
                container.style.display = 'none';
                container.setAttribute('data-hidden', 'true');
                hiddenCount++;
            }
        });

        if (hiddenCount > 0) {
            console.log(`隐藏了 ${hiddenCount} 个非目标用户转发`);
        }
    }

    function 删除主页时间线中的推荐(){
        const buttons = document.querySelectorAll('button.css-175oi2r.r-1mmae3n.r-3pj75a.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l');
        let modifiedCount = 0;

        buttons.forEach(button => {
            if (processedElements.has(button)) return;

            button.innerHTML = '';
            const span = document.createElement('span');
            span.textContent = '不值得关注';
            button.appendChild(span);

            processedElements.add(button);
            modifiedCount++;
        });

        if (modifiedCount > 0) {
            console.log(`修改了 ${modifiedCount} 个推荐按钮`);
        }
    }

    function 删除主页时间线中的引用() {
        const parentDivs = document.querySelectorAll('div.css-175oi2r.r-9aw3ui.r-1s2bzr4');
        let modifiedCount = 0;

        parentDivs.forEach(parentDiv => {
            if (processedElements.has(parentDiv)) return;

            // 直接操作父div的子节点，避免层级过深的选择器
            // 清空所有子节点
            parentDiv.innerHTML = '';

            // 创建新的提示信息
            const newSpan = document.createElement('span');
            newSpan.textContent = '引用已删除';
            newSpan.style.cssText = 'color: #666; font-style: italic; padding: 8px; display: block;';

            parentDiv.appendChild(newSpan);
            modifiedCount++;
            processedElements.add(parentDiv);
        });

        if (modifiedCount > 0) {
            console.log(`修改了 ${modifiedCount} 个引用节点`);
        }
    }
    function 隐藏主页侧边栏你可能会喜欢() {
        const aside = document.querySelector('aside[aria-label="推荐关注"][role="complementary"]');
        if (aside && !processedElements.has(aside)) {
            // 隐藏而不是删除，避免布局抖动和重新渲染
            //aside.style.opacity = '0.5';
            //aside.style.pointerEvents = 'none';

            // 或者完全隐藏
            aside.style.display = 'none';

            processedElements.add(aside);
            console.log('已隐藏主页侧边栏推荐内容');
        }
    }

    function 执行主页清理操作(用户名) {
        console.log('执行主页清理操作');
        隐藏主页侧边栏你可能会喜欢();
        隐藏主页时间线中的转发(用户名);
        删除主页时间线中的推荐();
        删除主页时间线中的引用();
    }

    function 执行主逻辑() {
        if (isExecuting) return;
        isExecuting = true;

        const currentPath = window.location.pathname;
        console.log('执行主逻辑，当前路径:', currentPath);
        let match;


        if (statusPattern.test(currentPath)) {
            console.log('检测到status路径');
            setTimeout(() => {
                隐藏status发现更多之后的推荐;
                isExecuting = false;
            }, 1000);
        } else if ((match = currentPath.match(userPattern))) {
            console.log('检测到主页路径');
            const 用户名 = match[1];
            console.log('用户名:', 用户名);
            setTimeout(() => {
                执行主页清理操作(用户名);
                isExecuting = false;
            }, 1000);
        } else {
            console.log('检测到普通路径，无动作');
            isExecuting = false;
        }
    }

    function 处理URL变化() {
        console.log('URL发生变化，重新执行主逻辑');
        processedElements.clear();
        执行主逻辑();
    }

    function setup监听URL变化() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(this, args);
            setTimeout(处理URL变化, 100);
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            setTimeout(处理URL变化, 100);
        };

        window.addEventListener('popstate', () => setTimeout(处理URL变化, 100));
        window.addEventListener('hashchange', () => setTimeout(处理URL变化, 100));
    }

    // 新增：滚动检测函数
    function 启动滚动检测() {
        if (scrollCheckInterval) clearInterval(scrollCheckInterval);

        scrollCheckInterval = setInterval(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // 检测到用户滚动并且滚动距离变化较大
            if (Math.abs(currentScrollTop - lastScrollTop) > 100) {
                lastScrollTop = currentScrollTop;

                const currentPath = window.location.pathname;
                const userPattern = /^\/([^\/?#]+)$/;

                if (userPattern.test(currentPath)) {
                    console.log('检测到滚动，执行清理操作');
                    执行主页清理操作();
                }
            }
        }, 1000); // 每秒检查一次
    }

    function init() {
        setup监听URL变化();
        setTimeout(() => {
            执行主逻辑();
            启动滚动检测(); // 启动滚动检测
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 简化MutationObserver，只用于检测主要结构变化
    const observer = new MutationObserver((mutations) => {
        const hasSignificantChanges = mutations.some(mutation => {
            return mutation.addedNodes.length > 0 &&
                   Array.from(mutation.addedNodes).some(node =>
                       node.nodeType === 1 && (
                           node.querySelector('article') ||
                           node.querySelector('[data-testid="tweet"]')
                       )
                   );
        });

        if (hasSignificantChanges) {
            console.log('检测到DOM重大变化，执行清理操作');
            const currentPath = window.location.pathname;
            const userPattern = /^\/([^\/?#]+)$/;

            if (userPattern.test(currentPath)) {
                执行主页清理操作();
            }else if(statusPattern.test(currentPath)){
                隐藏status发现更多之后的推荐();
            }else{console.log(currentPath)}
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
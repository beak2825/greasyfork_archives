// ==UserScript==
// @name         抖音B站自动切换浅色深色模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动跟随浏览器切换浅色深色,懒得手动操作了
// @author       繁花灬海棠
// @match        *://*.douyin.com/*
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552445/%E6%8A%96%E9%9F%B3B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%B5%85%E8%89%B2%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/552445/%E6%8A%96%E9%9F%B3B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%B5%85%E8%89%B2%E6%B7%B1%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================
    // 配置参数（便于维护）
    // ==========================

    // B站选择器配置
    const BILIBILI_SELECTORS = {
        avatarParent: 'header-avatar-wrap',
        avatarPopoverClass: 'avatar-popover',
        linksContainerClass: 'links-item',
        linkItemClass: 'single-link-item',
        themeSwitchClass: 'sub-links-item',
        themeBtnClass: 'sub-link-item',
        // 主题按钮索引
        themeBtnIndex: {
            dark: 0,
            light: 1
        }
    };

    // 抖音选择器配置
    const DOUYIN_SELECTORS = {
        settings: '.pop2P7gf.lcW4lCDj',
        themeContainer: '.PcO1WSeG',
        themeBtnClass: 'ntONQaLl'
    };

    // 运行配置参数
    const CONFIG = {
        checkInterval: 50,
        douyin: {
            initDelay: 2000,
            hoverDelay: 200,
            timeout: 5000
        },
        bilibili: {
            initDelay: 2000,
            avatarHoverDelay: 800,
            themeHoverDelay: 800,
            timeout: 12000
        }
    };

    // ==========================
    // 工具函数
    // ==========================

    /**
     * 抖音元素查找
     */
    function waitForDouyinElement(selector, timeout, step) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (Date.now() - start > timeout) {
                    return reject(new Error(`[抖音${step}] 超时未找到: ${selector}`));
                }

                const elem = document.querySelector(selector);
                if (elem && elem.offsetParent !== null) resolve(elem);
                else setTimeout(check, CONFIG.checkInterval);
            };
            check();
        });
    }

    /**
     * B站元素查找
     */
    function waitForBilibiliElement(className, parent, timeout, step) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (Date.now() - start > timeout) {
                    return reject(new Error(`[B站${step}] 超时未找到.${className}`));
                }

                const container = parent || document;
                const elements = container.getElementsByClassName(className);
                const visibleElem = Array.from(elements).find(elem => elem.offsetParent !== null);

                if (visibleElem) resolve(visibleElem);
                else setTimeout(check, CONFIG.checkInterval);
            };
            check();
        });
    }

    /**
     * 按位置索引查找元素
     * @param {HTMLElement} parent - 父容器
     * @param {string} itemClass - 子元素类名
     * @param {number} index - 要查找的索引位置
     * @param {string} step - 步骤名称
     */
    function waitForElementByIndex(parent, itemClass, index, timeout, step) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (Date.now() - start > timeout) {
                    return reject(new Error(`[${step}] 超时未找到索引${index}的元素`));
                }

                const items = Array.from(parent.getElementsByClassName(itemClass))
                    .filter(item => item.offsetParent !== null);

                if (items.length > index) {
                    resolve(items[index]);
                } else {
                    console.log(`[${step}] 等待中，当前找到${items.length}个元素，需要索引${index}`);
                    setTimeout(check, CONFIG.checkInterval);
                }
            };
            check();
        });
    }

    /**
     * 悬浮触发
     */
    function triggerHover(elem) {
        if (!elem) return;
        const rect = elem.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => {
            document.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                clientX: x,
                clientY: y
            }));

            elem.dispatchEvent(new MouseEvent('mouseover', {
                bubbles: true,
                clientX: x,
                clientY: y
            }));

            setTimeout(() => {
                elem.dispatchEvent(new MouseEvent('mouseenter', {
                    bubbles: false,
                    clientX: x,
                    clientY: y
                }));
            }, 100);
        }, 300);
    }

    /**
     * 关闭悬浮
     */
    function closeHover(elem) {
        if (!elem) return;
        elem.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    }

    /**
     * hover元素并等待特定popover出现
     */
    function hoverAndAwaitPopover(triggerElement, popoverClass) {
        return new Promise((resolve, reject) => {
            let popoverCheckTimer;
            let timeoutTimer;

            timeoutTimer = setTimeout(() => {
                clearInterval(popoverCheckTimer);
                reject(new Error(`超时未找到popover: ${popoverClass}`));
            }, CONFIG.bilibili.timeout);

            const rect = triggerElement.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            triggerElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            const mouseOver = new MouseEvent('mouseover', {
                bubbles: true,
                clientX: x,
                clientY: y
            });

            const mouseEnter = new MouseEvent('mouseenter', {
                bubbles: true,
                clientX: x,
                clientY: y
            });

            triggerElement.dispatchEvent(mouseOver);
            triggerElement.dispatchEvent(mouseEnter);

            popoverCheckTimer = setInterval(() => {
                const popover = document.getElementsByClassName(popoverClass);
                if (popover && popover.length > 0 && popover[0].offsetParent !== null) {
                    clearTimeout(timeoutTimer);
                    clearInterval(popoverCheckTimer);
                    resolve(popover[0]);
                }
            }, CONFIG.checkInterval);
        });
    }

    /**
     * 关闭所有相关悬浮框
     */
    function closeAllPopovers(themeRow, avatarParent) {
        try {
            if (themeRow) {
                themeRow.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                themeRow.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            }

            if (avatarParent) {
                avatarParent.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                avatarParent.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            }

            console.log("悬浮框关闭完成");
        } catch (error) {
            console.log("关闭悬浮框时出现小错误（可忽略）:", error.message);
        }
    }

    /**
     * 检查深色模式
     */
    const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

    // ==========================
    // 平台同步函数
    // ==========================

    /**
     * 抖音同步
     */
    async function syncDouyin() {
        try {
            await new Promise(resolve => setTimeout(resolve, CONFIG.douyin.initDelay));

            const settingsBtn = await waitForDouyinElement(
                DOUYIN_SELECTORS.settings,
                CONFIG.douyin.timeout,
                "设置按钮"
            );

            triggerHover(settingsBtn);
            await new Promise(resolve => setTimeout(resolve, CONFIG.douyin.hoverDelay));

            const themeContainer = await waitForDouyinElement(
                DOUYIN_SELECTORS.themeContainer,
                CONFIG.douyin.timeout,
                "主题容器"
            );

            const targetIndex = isDarkMode() ? 2 : 1;
            const themeBtn = themeContainer.children[targetIndex];

            if (themeBtn && themeBtn.classList.contains(DOUYIN_SELECTORS.themeBtnClass)) {
                themeBtn.click();
                setTimeout(() => closeHover(settingsBtn), 500);
                console.log("抖音主题同步成功");
            } else {
                throw new Error(`未找到主题按钮（索引${targetIndex}`);
            }

        } catch (error) {
            console.warn("抖音同步失败:", error.message);
        }
    }

    /**
     * B站同步
     */
    async function syncBilibili() {
        try {
            await new Promise(resolve => setTimeout(resolve, CONFIG.bilibili.initDelay));
            console.log("开始B站同步");

            // 1. 查找头像父容器
            const avatarParent = await waitForBilibiliElement(
                BILIBILI_SELECTORS.avatarParent,
                null,
                CONFIG.bilibili.timeout,
                "头像父容器"
            );

            // 2. 等待头像弹出菜单出现
            await hoverAndAwaitPopover(avatarParent, BILIBILI_SELECTORS.avatarPopoverClass);

            // 3. 查找头像弹出菜单
            const avatarPopover = await waitForBilibiliElement(
                BILIBILI_SELECTORS.avatarPopoverClass,
                null,
                CONFIG.bilibili.timeout,
                "头像弹出菜单"
            );

            // 4. 查找包含主题设置的 links-item 容器
            const allLinksItems = Array.from(avatarPopover.getElementsByClassName(BILIBILI_SELECTORS.linksContainerClass))
                .filter(item => item.offsetParent !== null);

            const themeLinksContainer = allLinksItems[allLinksItems.length - 1];

            // 5. 在主题链接容器中查找主题行
            const themeRow = await waitForElementByIndex(
                themeLinksContainer,
                BILIBILI_SELECTORS.linkItemClass,
                0,
                CONFIG.bilibili.timeout,
                "B站主题行"
            );
            console.log("找到主题行");

            // 6. 悬浮主题行并等待子菜单出现
            await hoverAndAwaitPopover(themeRow, BILIBILI_SELECTORS.themeSwitchClass);

            // 7. 查找主题切换框
            const switchBox = await waitForBilibiliElement(
                BILIBILI_SELECTORS.themeSwitchClass,
                null,
                CONFIG.bilibili.timeout,
                "主题切换框"
            );

            // 8. 按索引查找主题按钮
            const targetIndex = isDarkMode() ?
                BILIBILI_SELECTORS.themeBtnIndex.dark :
                BILIBILI_SELECTORS.themeBtnIndex.light;

            const themeBtn = await waitForElementByIndex(
                switchBox,
                BILIBILI_SELECTORS.themeBtnClass,
                targetIndex,
                CONFIG.bilibili.timeout,
                `B站主题按钮（索引${targetIndex}）`
            );

            // 9. 切换主题
            themeBtn.click();

            // 10. 延迟关闭所有悬浮框
            setTimeout(() => {
                closeAllPopovers(themeRow, avatarParent);
            }, 500);

            console.log("B站主题同步成功");

        } catch (error) {
            console.warn("B站同步失败:", error.message);
            setTimeout(() => {
                const avatarParent = document.querySelector('.' + BILIBILI_SELECTORS.avatarParent);
                if (avatarParent) {
                    closeAllPopovers(null, avatarParent);
                }
            }, 500);
        }
    }

    // ==========================
    // 入口逻辑
    // ==========================
    const host = window.location.hostname;
    if (host.includes('douyin.com')) {
        syncDouyin();
    } else if (host.includes('bilibili.com')) {
        syncBilibili();
    }

    // 监听主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (host.includes('douyin.com')) syncDouyin();
        else if (host.includes('bilibili.com')) syncBilibili();
    });

})();
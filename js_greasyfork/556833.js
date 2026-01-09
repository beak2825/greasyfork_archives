// ==UserScript==
// @name         纯净抖音直播
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  自动关闭聊天窗口，自动关闭礼物特效，隐藏礼物栏，强制关闭送礼信息，自动关闭 tooltip
// @match        https://live.douyin.com/*
// @author       Augkit
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556833/%E7%BA%AF%E5%87%80%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/556833/%E7%BA%AF%E5%87%80%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************
     * 自动关闭聊天栏
     **********************/
    function elementClassIncludes(el, keyword) {
        if (!el) return false;
        if (el.classList && el.classList.length) {
            for (const cls of el.classList) if (cls && cls.includes(keyword)) return true;
        }
        if (typeof el.className === 'string') return el.className.includes(keyword);
        if (el.className && typeof el.className.baseVal === 'string') return el.className.baseVal.includes(keyword);
        const attr = el.getAttribute && el.getAttribute('class');
        if (typeof attr === 'string') return attr.includes(keyword);
        return false;
    }

    function autoChatRoomClose() {
        let observer = null;

        function startObserver() {
            if (observer) return;

            observer = new MutationObserver(() => {
                const found =
                    document.querySelector('[class*="chatroom_close"]') ||
                    Array.from(document.getElementsByTagName('*')).find(el => elementClassIncludes(el, 'chatroom_close'));

                if (found) {
                    try { found.click(); }
                    catch {
                        found.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
                    }
                    observer.disconnect();
                    observer = null;
                }
            });

            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true,
                attributes: ['class', 'style']
            });
        }

        startObserver();
    }

    document.addEventListener("fullscreenchange", () => {
        autoChatRoomClose();
        applyGiftBarStyle();
    });

    autoChatRoomClose();

    /**********************
     * 隐藏礼物栏
     **********************/
    const styleFullscreen = document.createElement("style");
    styleFullscreen.textContent = `
        .douyin-player-controls > div:nth-child(2) {
            display: none !important;
        }
    `;

    const styleNonFullscreen = document.createElement("style");
    styleNonFullscreen.textContent = `
        #BottomLayout { display: none !important; }
        .xg-inner-controls { bottom: 8px !important; }
    `;

    function applyGiftBarStyle() {
        if (document.fullscreenElement) {
            document.documentElement.appendChild(styleFullscreen);
            styleNonFullscreen.remove();
        } else {
            document.documentElement.appendChild(styleNonFullscreen);
            styleFullscreen.remove();
        }
    }

    applyGiftBarStyle();


    /**********************
     * 自动关闭送礼弹幕 & 屏蔽礼物特效
     **********************/

    /** ---------- 工具函数 ---------- */

    function fireMouseEvent(el, type) {
        if (!el) return;
        el.dispatchEvent(new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    function clickElement(el) {
        if (!el) return;
        fireMouseEvent(el, 'click');
    }

    // 隐藏 settingIcon 父元素下的第二个 div，并在 pop 消失时还原
    function hideSecondDivUntilPopGone(settingIcon, pop) {
        if (!settingIcon || !pop) return;
        const parent = settingIcon.parentElement;
        if (!parent) return;
        const divChildren = Array.from(parent.children).filter(c => c.tagName === 'DIV');
        const target = divChildren[1];
        if (!target) return;

        // 立即隐藏
        const prevDisplay = target.style.display;
        target.style.display = 'none';

        // 监听 pop 是否被移除，移除后还原样式并断开观察器
        const mo = new MutationObserver(() => {
            if (!pop.isConnected) {
                target.style.display = prevDisplay || '';
                mo.disconnect();
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    /** ---------- 核心逻辑 ---------- */

    async function tryCloseGiftDanmaku() {
        // 1. 找到弹幕设置 icon
        const settingIcon = document.querySelector('[data-e2e="danmaku-setting-icon"]');
        if (!settingIcon) return false;

        // 2. 触发 mouseover mouseenter
        fireMouseEvent(settingIcon, 'mouseover');
        fireMouseEvent(settingIcon, 'mouseenter');

        const pop = settingIcon.nextElementSibling;
        if (!pop) {
            // 有时候面板不在 nextElementSibling，尝试附近查找
            const alt = settingIcon.parentElement?.querySelector?.('[role="menu"], .pop, .ant-popover');
            if (alt) {
                // proceed with alt as pop
            }
        }
        if (!pop) return false;

        // 隐藏父 div 下的第二个 div，pop 消失后自动还原
        hideSecondDivUntilPopGone(settingIcon, pop);

        (() => {
            // 找到「送礼信息」label
            const giftLabel = [...pop.querySelectorAll('span')]
                .find(el => el.textContent.trim() === '送礼信息');

            if (!giftLabel) return false;

            // 定位同一行里的 switch（React Switch 外层 div）
            let switchRoot = giftLabel.parentElement;
            if (!switchRoot) return false;

            // 向下找可点击的 switch 容器
            let clickable = switchRoot.querySelector('div');
            if (!clickable) return false;
            clickable = clickable.querySelector('div');
            if (!clickable) return false;

            // 判断当前是否已关闭（避免反复切换）
            if (clickable.className.trim().split(' ').length > 2) {
                // 已开启，才需要点
                clickElement(clickable);
            }
        })();

        (() => {
            // 找到「福袋口令」label
            const giftLabel = [...pop.querySelectorAll('span')]
                .find(el => el.textContent.trim() === '福袋口令');

            if (!giftLabel) return false;

            let switchRoot = giftLabel.parentElement;
            if (!switchRoot) return false;

            let clickable = switchRoot.querySelector('div');
            if (!clickable) return false;
            clickable = clickable.querySelector('div');
            if (!clickable) return false;

            if (clickable.className.trim().split(' ').length > 2) {
                clickElement(clickable);
            }
        })();

        fireMouseEvent(settingIcon, 'mouseout');
        fireMouseEvent(settingIcon, 'mouseleave');

        return true;
    }

    async function tryCloseGiftEffect() {
        // 1. 找到礼物设置 icon
        const settingIcon = document.querySelector('[data-e2e="gift-setting"]');
        if (!settingIcon) return false;

        // 2. 触发 mouseover mouseenter
        fireMouseEvent(settingIcon, 'mouseover');
        fireMouseEvent(settingIcon, 'mouseenter');

        const pop = settingIcon.nextElementSibling;
        if (!pop) return false;

        // 隐藏父 div 下的第二个 div，pop 消失后自动还原
        hideSecondDivUntilPopGone(settingIcon, pop);

        (() => {
            // 找到「屏蔽礼物特效」label
            const giftLabel = [...pop.querySelectorAll('span')]
                .find(el => el.textContent.trim() === '屏蔽礼物特效');

            if (!giftLabel) return false;

            let switchRoot = giftLabel.parentElement;
            if (!switchRoot) return false;

            let clickable = switchRoot.querySelector('div');
            if (!clickable) return false;
            clickable = clickable.querySelector('div');
            if (!clickable) return false;

            // 判断当前是否已关闭（避免反复切换）
            if (clickable.className.trim().split(' ').length <= 2) {
                // 已关闭，才需要点（开启屏蔽）
                clickElement(clickable);
            }
        })();

        (() => {
            // 找到「快捷键送礼」label
            const giftLabel = [...document.querySelectorAll('span')]
                .find(el => el.textContent.trim() === '快捷键送礼');

            if (!giftLabel) return false;

            let switchRoot = giftLabel.parentElement;
            if (!switchRoot) return false;

            let clickable = switchRoot.querySelector('div');
            if (!clickable) return false;
            clickable = clickable.querySelector('div');
            if (!clickable) return false;

            if (clickable.className.trim().split(' ').length > 2) {
                clickElement(clickable);
            }
        })();

        fireMouseEvent(settingIcon, 'mouseout');
        fireMouseEvent(settingIcon, 'mouseleave');

        return true;
    }

    /** ---------- 监听 DOM 生成 ---------- */

    const mergedObserver = new MutationObserver(async () => {
        try {
            const [res1, res2] = await Promise.all([
                tryCloseGiftDanmaku(),
                tryCloseGiftEffect()
            ]);

            if (res1 && res2) {
                mergedObserver.disconnect();
            }
        } catch (e) {
            // ignore errors and keep observing
        }
    });

    mergedObserver.observe(document.body, {
        childList: true,
        subtree: true
    });


    /**********************
     * 隐藏"全部商品"所属的第5层父元素
     **********************/
    function hideAllProductsSection() {
        // 查找所有包含"全部商品"文本的span元素
        const spans = Array.from(document.querySelectorAll('span'));
        const targetSpans = spans.filter(span => span.textContent.trim() === '全部商品');

        targetSpans.forEach(span => {
            // 向上找5层父元素
            let ancestor = span;
            for (let i = 0; i < 5; i++) {
                if (ancestor.parentElement) {
                    ancestor = ancestor.parentElement;
                } else {
                    break;
                }
            }

            // 隐藏该父元素
            if (ancestor && ancestor !== span) {
                ancestor.style.display = 'none';
            }
        });
    }

    // 立即执行一次
    hideAllProductsSection();

    // 监听DOM变化，自动隐藏新出现的"全部商品"区域
    const productObserver = new MutationObserver(() => {
        hideAllProductsSection();
    });

    productObserver.observe(document.body, {
        childList: true,
        subtree: true
    });


    /**********************
     * 自动切换画质
     **********************/
    let qualityObserver = null;
    let hasSwitchedQuality = false;

    function autoSwitchQuality() {
        try {
            // 如果已经切换过，不再执行
            if (hasSwitchedQuality) return false;

            // 1. 获取当前画质
            const currentQualityEl = document.querySelector('[data-e2e="quality"]');
            if (!currentQualityEl) return false;

            const currentQuality = currentQualityEl.textContent.trim();
            if (!currentQuality) return false;

            // 2. 查找画质选择器
            const qualitySelectorEl = document.querySelector('[data-e2e="quality-selector"]');
            if (!qualitySelectorEl) return false;

            // 3. 获取画质选择器下的所有div
            const qualityOptions = Array.from(qualitySelectorEl.querySelectorAll(':scope > div'));
            if (qualityOptions.length === 0) return false;

            // 4. 获取第一个选项的文本
            const firstOption = qualityOptions[0];
            const firstOptionText = firstOption.textContent.trim();

            // 5. 如果第一个选项是"自动"，则点击第二个选项（如果存在）
            let targetOption = firstOption;
            let targetQuality = firstOptionText;

            if (firstOptionText.includes('自动') && qualityOptions.length > 1) {
                targetOption = qualityOptions[1];
                targetQuality = targetOption.textContent.trim();
            }

            // 6. 如果目标选项与当前画质不同，则点击
            if (targetQuality && targetQuality !== currentQuality) {
                clickElement(targetOption);
                console.log(`[自动切换画质] 从 "${currentQuality}" 切换到 "${targetQuality}"`);

                // 标记已切换并断开观察器
                hasSwitchedQuality = true;
                if (qualityObserver) {
                    qualityObserver.disconnect();
                    qualityObserver = null;
                }

                return true;
            }

            return false;
        } catch (e) {
            console.error('[自动切换画质] 出错:', e);
            return false;
        }
    }

    // 监听DOM变化，当画质选择器出现时自动切换（仅执行一次）
    qualityObserver = new MutationObserver(() => {
        if (autoSwitchQuality() && qualityObserver) {
            qualityObserver.disconnect();
            qualityObserver = null;
        }
    });

    qualityObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 立即执行一次
    autoSwitchQuality();

})();

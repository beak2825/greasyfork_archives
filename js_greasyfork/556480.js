// ==UserScript==
// @name         移动端限制弹窗解除
// @namespace    https://viayoo.com/hrgow0
// @version      1.71
// @description  自用脚本，解除滑动禁止、触控禁止，移除弹窗。
// @author       Via
// @match        *://*/*
// @exclude      *://joiplay.net/*
// @icon        data:image/png;base64,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
// @grant        GM_addStyle
// @run-at       document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/556480/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%99%90%E5%88%B6%E5%BC%B9%E7%AA%97%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/556480/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%99%90%E5%88%B6%E5%BC%B9%E7%AA%97%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cleanupCount = 0,
        removeSelectors = [],
        clickSelectors = [],
        stayRules = new Set(),
        hideRules = new Set(),
        userAttemptedScroll = false,
        scrollRestorationAttempted = false;
    const MAX_CLEANUP_COUNT = 10;

    let alertHistory = [];
    const originalAlert = window.alert;
    const MAX_ALERTS_PER_SECOND = 3;

    // 弹窗和元素隐藏规则
    // ##+js(dpopup, 元素名称，是否持续监控)。
    // 例如 ##+js(dpopup, .ad)，点击一次包含.ad的按钮，不隐藏。
    // ##+js(dpopup, .ad，stay)，就是点击后不隐藏，持续监控点击多个.ad。
    // ##+js(dpopup, .ad, hide)，就是点击后隐藏按钮，不持续监控。
    // 其他##就是普通的Adblock规则
    // bing.com###ads_popup就是隐藏#ads_popup元素
    // ###ads_popup就是通用规则
    // *bing.com###ads_popup，就是模糊匹配，例如www.bing.com或者cn.bing.com都会被匹配
    const Adblock_Rules = `
###ads_popup
##.ad-dialog
##.ad-dialog ~ .float-dialog
##.ads-popup
##.g-pop
##.mobile-download-popup
##.modal-mask
##.overlay-mask
##.popup-mask
##.popup-overlay
##.q-dialog
##.top-advert
##.van-overlay
##[data-role="overlay"]
##body.page > .popup
##body.touch > .q-dialog
##script + .p-screen-dialog
##script + div > .p-screen-dialog
##script > .p-screen-dialog
##+js(dpopup, #age-check-yes)
##+js(dpopup, #ageConfirmBtn)
##+js(dpopup, #ageYesBtn)
##+js(dpopup, #unlock-htgpda, stay)
##+js(dpopup, .ad-area-close, stay)
##+js(dpopup, .btn-age-confirm)
##+js(dpopup, #confirmAge)
##+js(dpopup, .gg-close)
##+js(dpopup, .js-adv-close)
##+js(dpopup, .popup-close, stay)
##+js(dpopup, [class*="age"][class*="confirm"])
##+js(dpopup, [id*="age"][id*="Yes"])
##+js(dpopup, [id*="age"][id*="confirm"])
##+js(dpopup, [id*="age"][id*="yes"])
##+js(dpopup, [onclick^="closePopup"], stay)
bing.com##+js(dpopup, #bnp_btn_reject, stay)
bing.com##+js(dpopup, #sacs_close, stay)
bsb.baidu.com##+js(dpopup, #pc_jxfw, stay)
sina.cn##+js(dpopup, #SFA-continue-btn, stay)
sina.cn##+js(dpopup, #SFA_continueBtn, stay)
sina.cn##+js(dpopup, .confirm-cancel)
sina.cn##+js(dpopup, .snp-btn-close-new, stay)
sina.cn##+js(dpopup, .surplus-btn)
sina.cn##+js(dpopup, .unfold-mask)
sina.cn##+js(dpopup, [id*="continue"][id*="Btn"], stay)
sina.cn##+js(dpopup, [id*="continue"][id*="btn"], stay)
tv.sohu.com##+js(dpopup, .mtv-banner-close_btn)
yandex.*##+js(dpopup, .Button_checked)
youwu.lol,yuwusangzhi.cc##+js(dpopup, .van-icon-close, stay)
youwu.lol,yuwusangzhi.cc##div[role="dialog"]
`.trim();

    const log = (msg) => console.log(`%c[弹窗解除] ${msg}`, 'color:#1abc9c;font-weight:bold;background:#000;border-radius:4px;padding:2px 6px;');

    window.alert = function(...args) {
        const now = Date.now();
        alertHistory = alertHistory.filter(time => now - time < 1000);
        alertHistory.push(now);
        if (alertHistory.length > MAX_ALERTS_PER_SECOND) {
            if (window.alert === originalAlert) {
                window.alert = function() {};
                log('alert弹窗已被禁用（1秒内超过3次）');
                setTimeout(() => {
                    window.alert = originalAlert;
                    alertHistory = [];
                    log('alert弹窗限制已解除');
                }, 30000);
            }
            return;
        }
        return originalAlert.apply(this, args);
    };

    function parseAdblockRules() {
        const currentHost = window.location.hostname;
        Adblock_Rules.split('\n').filter(line => line.trim()).forEach(line => {
            if (line.includes('##+js(dpopup,')) {
                const match = line.match(/##\+js\(dpopup,\s*([^,)]+)(?:,\s*(stay|hide))?\)/);
                if (match) {
                    clickSelectors.push(match[1].replace(/['"]/g, '').trim());
                    if (match[2] === 'stay') stayRules.add(match[1]);
                    if (match[2] === 'hide') hideRules.add(match[1]);
                }
            } else if (line.startsWith('##')) {
                removeSelectors.push(line.replace(/^#{2,3}/, '').trim());
            } else if (line.includes('##')) {
                const [domains, rule] = line.split('##'), domainList = domains.split(',');
                const domainMatch = domainList.some(domain => {
                    const cleanDomain = domain.trim().replace(/^[*]+\.?/, '');
                    return !cleanDomain || currentHost === cleanDomain || currentHost.endsWith('.' + cleanDomain) || (cleanDomain.startsWith('*') && currentHost.endsWith(cleanDomain.slice(1)));
                });
                if (domainMatch) {
                    if (rule.includes('+js(dpopup,')) {
                        const match = rule.match(/\+js\(dpopup,\s*([^,)]+)(?:,\s*(stay|hide))?\)/);
                        if (match) {
                            clickSelectors.push(match[1].replace(/['"]/g, '').trim());
                            if (match[2] === 'stay') stayRules.add(match[1]);
                            if (match[2] === 'hide') hideRules.add(match[1]);
                        }
                    } else {
                        removeSelectors.push(rule.trim());
                    }
                }
            }
        });
        removeSelectors = [...new Set(removeSelectors)];
        clickSelectors = [...new Set(clickSelectors)];
        // console.log('解析结果: clickSelectors:', clickSelectors, 'stayRules:', [...stayRules]);
    }

    function removePopups() {
        removeSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                let hit = 0;
                elements.forEach(element => {
                    if (element.offsetParent !== null) {
                        element.style.display = 'none';
                        element.style.visibility = 'hidden';
                        element.style.opacity = '0';
                        if (typeof element.remove === 'function') {
                            element.remove();
                        }
                        hit++;
                    }
                });
                if (hit > 0) {
                    log(`当前网页: ${location.href}\n运行规则: ${selector} ，原因: 匹配到弹窗/遮罩元素 ，状态: 成功 (已移除 ${hit} 个)`);
                }
            } catch (e) {}
        });
    }

    function clickCloseButtons() {
        clickSelectors.forEach(selector => {
            try {
                const buttons = document.querySelectorAll(selector);
                let hit = 0;
                buttons.forEach(button => {
                    if (button.offsetParent !== null && button.getBoundingClientRect().width > 0 && button.getBoundingClientRect().height > 0) {
                        button.click();
                        hit++;
                        if (hideRules.has(selector)) {
                            button.style.display = 'none';
                            button.style.visibility = 'hidden';
                        }
                    }
                });
                if (hit > 0) {
                    log(`当前网页: ${location.href}\n运行规则: ${selector} ，原因: 模拟点击关闭按钮 ，状态: 成功`);
                }
            } catch (e) {}
        });
    }

    function initStayObserver() {
        if (stayRules.size === 0) return;
        const observer = new MutationObserver(mutations => {
            stayRules.forEach(selector => {
                document.querySelectorAll(selector).forEach(button => {
                    if (button.offsetParent !== null && button.getBoundingClientRect().width > 0 && button.getBoundingClientRect().height > 0) {
                        button.click();
                        log(`当前网页: ${location.href}\n[stay监控] 运行规则: ${selector} ，原因: 新出现关闭按钮自动点击 ，状态: 成功`);
                    }
                });
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    function addScrollStyles() {
        const css = `
            html, body {
                -webkit-overflow-scrolling: touch!important;
            }
            body.no-scroll, body.modal-open, body.scroll-locked, body.overflow-hidden, body.touch {
                overflow: auto!important;
                position: relative!important;
            }
            .modal-backdrop, .popup-backdrop, .overlay-mask, .van-overlay, .am-modal-mask {
                display: none!important;
            }
        `;
        if (typeof GM_addStyle !== 'undefined') GM_addStyle(css);
        else {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    function isScrollAbnormal() {

        if (document.querySelector('ons-page, ons-toolbar, .page__content')) {
            return false;
        }

        const bodyStyle = window.getComputedStyle(document.body);
        const htmlStyle = window.getComputedStyle(document.documentElement);

        const hasLockClass = /no-scroll|modal-open|scroll-locked|overflow-hidden|v-modal-open/i.test(document.body.className + ' ' + document.documentElement.className);

        const hasLockStyle = bodyStyle.overflow === 'hidden' ||
            htmlStyle.overflow === 'hidden' ||
            bodyStyle.position === 'fixed' ||
            (parseFloat(bodyStyle.height) <= window.innerHeight && bodyStyle.overflow === 'hidden');

        const contentTallerThanViewport = document.documentElement.scrollHeight > window.innerHeight;

        return (hasLockClass || hasLockStyle) && contentTallerThanViewport;
    }

    function restoreBodyScroll() {
        if (this === window) {
            scrollRestorationAttempted = false;
        }

        if (!this && scrollRestorationAttempted) return;
        if (!this && !userAttemptedScroll && !isScrollAbnormal()) return;

        let changed = false;
        const html = document.documentElement;
        const body = document.body;

        const scrollTop = parseFloat(body.style.top) || parseFloat(html.style.top) || 0;

        const undoLock = (el) => {
            const style = window.getComputedStyle(el);
            if (style.overflow === 'hidden' || style.position === 'fixed') {
                el.style.setProperty('overflow', 'visible', 'important');
                el.style.setProperty('position', 'relative', 'important');

                if (el.style.height) el.style.height = '';
                if (el.style.maxHeight) el.style.maxHeight = '';
                changed = true;
            }
        };

        undoLock(html);
        undoLock(body);

        if (scrollTop < 0) {
            body.style.top = '';
            html.style.top = '';
            window.scrollTo(0, Math.abs(scrollTop));
        }

        if (this === window) {
            html.style.setProperty('overflow', 'visible', 'important');
            body.style.setProperty('overflow', 'visible', 'important');
            window.scrollBy(0, 1);
            window.scrollBy(0, -1);
            window.dispatchEvent(new Event('resize'));
        }

        if (changed || this === window) {
            scrollRestorationAttempted = true;
            log(`手势触发恢复: ${this === window ? '用户手动双击强制解锁' : '自动修复滚动限制'} - ${location.href}`);
        }
    }


    function enableTouchAndScroll() {
        ['touchmove', 'wheel', 'scroll', 'mousewheel'].forEach(eventType => {
            document.addEventListener(eventType, e => {
                if (e.defaultPrevented && e.cancelable) {
                    e.stopImmediatePropagation();
                }
            }, {
                capture: true,
                passive: false
            });
        });
    }

    document.addEventListener('wheel', function(e) {
        userAttemptedScroll = true;
    }, {
        passive: true
    });
    document.addEventListener('touchmove', function(e) {
        userAttemptedScroll = true;
    }, {
        passive: true
    });

    function cleanup() {
        if (cleanupCount >= MAX_CLEANUP_COUNT) return;
        try {
            removePopups();
            clickCloseButtons();
            restoreBodyScroll();
            cleanupCount++;
        } catch (error) {}
    }

    function reInject() {
        log(`手动触发脚本（双击页面）…… 当前网页: ${location.href}`);
        enableTouchAndScroll();
        addScrollStyles();
        removePopups();
        clickCloseButtons();
        restoreBodyScroll.call(window);
    }

    function initObserver() {
        const observer = new MutationObserver(mutations => {
            cleanup();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    function init() {
        enableTouchAndScroll();
        parseAdblockRules();
        addScrollStyles();
        setTimeout(() => {
            cleanup();
            initObserver();
            initStayObserver();
        }, 500);
        document.addEventListener('dblclick', reInject);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else setTimeout(init, 100);
})();
// ==UserScript==
// @name         139邮箱广告去除
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除139邮箱页面广告并自动点击关闭按钮
// @author       You
// @match        https://appmail.mail.10086.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553108/139%E9%82%AE%E7%AE%B1%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/553108/139%E9%82%AE%E7%AE%B1%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击关闭按钮函数
    function clickCloseButton() {
        // 方法1：通过name属性选择器
        const closeButtonByName = document.querySelector('a[name="closeActivities"]');
        if (closeButtonByName) {
            closeButtonByName.click();
            console.log('通过name属性点击关闭按钮');
            return true;
        }

        // 方法2：通过class选择器
        const closeButtonByClass = document.querySelector('a.iconfont2.icon-guanbi');
        if (closeButtonByClass) {
            closeButtonByClass.click();
            console.log('通过class选择器点击关闭按钮');
            return true;
        }

        // 方法3：通过包含关闭图标的元素
        const closeButtons = document.querySelectorAll('a');
        for (let button of closeButtons) {
            if (button.classList.contains('icon-guanbi')) {
                button.click();
                console.log('通过图标class点击关闭按钮');
                return true;
            }
        }

        console.log('未找到关闭按钮');
        return false;
    }

    // 移除广告函数
    function removeAds() {
        let removed = false;

        // 先尝试点击关闭按钮
        if (clickCloseButton()) {
            removed = true;
        }

        // 方法1：通过class选择器移除广告
        const adElements = document.querySelectorAll('.mail_ad, .adv-scroll-box, .adv-scroll-list, .adv-item');
        adElements.forEach(element => {
            if (element && element.parentNode) {
                element.style.display = 'none';
                element.parentNode.removeChild(element);
                console.log('通过class选择器移除广告元素');
                removed = true;
            }
        });

        // 方法2：通过data属性选择器移除广告
        const adElementsByData = document.querySelectorAll('[data-v-7d2f44dc]');
        adElementsByData.forEach(element => {
            if (element && element.classList.contains('mail_ad')) {
                element.style.display = 'none';
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                    console.log('通过data属性移除广告容器');
                    removed = true;
                }
            }
        });

        // 方法3：通过包含"广告"文字的元素
        const adSpans = document.querySelectorAll('span');
        adSpans.forEach(span => {
            if (span.textContent === '广告') {
                let adItem = span.closest('.adv-item');
                if (adItem) {
                    let mailAd = adItem.closest('.mail_ad');
                    if (mailAd) {
                        mailAd.style.display = 'none';
                        if (mailAd.parentNode) {
                            mailAd.parentNode.removeChild(mailAd);
                            console.log('通过广告文字移除广告区域');
                            removed = true;
                        }
                    }
                }
            }
        });

        // 方法4：移除包含ad@139.com的元素
        const adLinks = document.querySelectorAll('a');
        adLinks.forEach(link => {
            if (link.textContent === 'ad@139.com') {
                let adItem = link.closest('.adv-item');
                if (adItem) {
                    let mailAd = adItem.closest('.mail_ad');
                    if (mailAd) {
                        mailAd.style.display = 'none';
                        if (mailAd.parentNode) {
                            mailAd.parentNode.removeChild(mailAd);
                            console.log('通过ad@139.com移除广告区域');
                            removed = true;
                        }
                    }
                }
            }
        });

        return removed;
    }

    // 页面加载完成后立即执行
    window.addEventListener('load', function() {
        console.log('页面加载完成，开始处理广告...');
        // 立即执行一次
        removeAds();

        // 延迟再次执行，确保动态内容加载完成
        setTimeout(removeAds, 1000);
        setTimeout(removeAds, 3000);
    });

    // 使用MutationObserver监控动态加载的广告
    const observer = new MutationObserver(function(mutations) {
        let shouldRemoveAds = false;

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Element node
                        // 检查是否是广告相关元素
                        if (node.classList && (
                            node.classList.contains('mail_ad') ||
                            node.classList.contains('adv-scroll-box') ||
                            node.classList.contains('adv-item') ||
                            node.classList.contains('icon-guanbi')
                        )) {
                            shouldRemoveAds = true;
                            break;
                        }

                        // 检查是否包含广告文字或关闭按钮
                        if (node.textContent && (
                            node.textContent.includes('广告') ||
                            node.textContent.includes('ad@139.com') ||
                            node.textContent.includes('closeActivities')
                        )) {
                            shouldRemoveAds = true;
                            break;
                        }

                        // 检查是否包含关闭按钮的属性
                        if (node.hasAttribute && (
                            node.hasAttribute('name') && node.getAttribute('name') === 'closeActivities'
                        )) {
                            shouldRemoveAds = true;
                            break;
                        }

                        // 检查子元素是否包含广告或关闭按钮
                        if (node.querySelector) {
                            const adChildren = node.querySelectorAll('.mail_ad, .adv-scroll-box, .adv-item, a[name="closeActivities"], .icon-guanbi');
                            if (adChildren.length > 0) {
                                shouldRemoveAds = true;
                                break;
                            }
                        }
                    }
                }
            }
        });

        if (shouldRemoveAds) {
            console.log('检测到动态加载的广告或关闭按钮，正在处理...');
            setTimeout(removeAds, 100);
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定期检查并处理广告（防止漏网之鱼）
    setInterval(removeAds, 2000);

    console.log('139邮箱广告去除及关闭按钮自动点击脚本已启动');
    'use strict';

    // 通过类名选择元素并删除
    const vipElement = document.querySelector('li.upgrade_rights');
    if (vipElement) {
        vipElement.remove();
        console.log('升级VIP元素已删除');
    }
})();
// ==UserScript==
// @name        dmm列表
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  提取DMM作品ID并创建新标签
// @author       cores
// @match        https://video.dmm.co.jp/av/list/*
// @match        https://video.dmm.co.jp/av/list/?actress=*
// @match        http://www.dmm.co.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555919/dmm%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555919/dmm%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';



    function processContentItems() {
        // 查找所有的内容卡片
        const contentCards = document.querySelectorAll('li.-ml-px.-mt-px.border.border-gray-300');

        contentCards.forEach(card => {
            // 检查是否已经处理过
            if (card.getAttribute('data-processed')) {
                return;
            }

            // 标记为已处理
            card.setAttribute('data-processed', 'true');

            // 查找包含作品链接的a标签
            const contentLink = card.querySelector('a[href*="/av/content/?id="]');
            if (!contentLink) return;

            // 提取作品ID
            const href = contentLink.getAttribute('href');
            const idMatch = href.match(/id=([^&]+)/);
            if (!idMatch) return;

            const originalId = idMatch[1];

            // 更通用的ID格式化：将倒数第5-6位的00替换为-
            // 匹配模式：任意前缀 + 任意字符 + 00 + 任意后缀
            let modifiedId = originalId;

            // 方法1：使用正则表达式匹配任意位置的两个连续0并替换为-
            // 这里我们假设需要替换的是在特定位置的两个0，比如第5-6位
            if (originalId.length >= 6) {
                const prefix = originalId.substring(0, originalId.length - 5);
                const middle = originalId.substring(originalId.length - 5, originalId.length - 3);
                const suffix = originalId.substring(originalId.length - 3);

                if (middle === '00') {
                    modifiedId = prefix + '-' + suffix;
                }
            }

            // 方法2：更灵活的替换，查找任意位置的"00"并替换（如果需要）
            // const modifiedId = originalId.replace(/([a-z]+)00(\d+)/i, '$1-$2');

            // 查找女演员链接的父容器
            const actressContainer = card.querySelector('.text-xxs.line-clamp-1');
            if (!actressContainer) return;

           // 创建多个ID显示链接
const linkConfigs = [
    {
        name: '123av',
        url: `https://123av.com/zh/v/${modifiedId}`
    },
    {
        name: 'jable',
        url: `https://jable.tv/videos/${modifiedId}/`
    },
    {
        name: '1cili',
        url: `https://1cili.com/search?q=${modifiedId}`
    }
];

// 创建容器 - 使用更简单的样式
const idContainer = document.createElement('div');
idContainer.style.marginTop = '4px';

// 为每个配置创建链接
linkConfigs.forEach((config) => {
    const idLink = document.createElement('a');
    idLink.href = config.url;
    // ${modifiedId}
    idLink.textContent = `${config.name}`;
    idLink.style.color = '#4d1018'; // 褐色
    idLink.style.display = 'block'; // 关键：块级元素
    idLink.style.marginBottom = '3px';
    idLink.style.fontSize = '14px'; // 小字体
    idLink.style.textDecoration = 'none';
    idLink.target = '_blank';

    // 悬停效果
    idLink.onmouseover = () => idLink.style.textDecoration = 'underline';
    idLink.onmouseout = () => idLink.style.textDecoration = 'none';

    idContainer.appendChild(idLink);
});

// 在女演员容器后插入新的ID容器
actressContainer.parentNode.insertBefore(idContainer, actressContainer.nextSibling);

        });
    }

    // 初始处理
    processContentItems();

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setTimeout(processContentItems, 100);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 也监听URL变化（对于SPA）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(processContentItems, 500);
        }
    }).observe(document, { subtree: true, childList: true });
})();
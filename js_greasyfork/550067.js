// ==UserScript==
// @name         ACG港湾，游戏卡片显示查看、评论、收藏数
// @namespace    http://tampermonkey.net/
// @version      2025-09-19
// @description  还在为找好用的游戏需要一个一个点进去看而发愁吗？快来试试直接查看哪些游戏更受大家欢迎吧！
// @author       Ltc
// @license MIT
// @match        https://www.acggw.me/game*
// @icon         https://www.acggw.me/wp-content/uploads/2021/05/QQ%E6%88%AA%E5%9B%BE20210504225137.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550067/ACG%E6%B8%AF%E6%B9%BE%EF%BC%8C%E6%B8%B8%E6%88%8F%E5%8D%A1%E7%89%87%E6%98%BE%E7%A4%BA%E6%9F%A5%E7%9C%8B%E3%80%81%E8%AF%84%E8%AE%BA%E3%80%81%E6%94%B6%E8%97%8F%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550067/ACG%E6%B8%AF%E6%B9%BE%EF%BC%8C%E6%B8%B8%E6%88%8F%E5%8D%A1%E7%89%87%E6%98%BE%E7%A4%BA%E6%9F%A5%E7%9C%8B%E3%80%81%E8%AF%84%E8%AE%BA%E3%80%81%E6%94%B6%E8%97%8F%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const cardList = document.querySelectorAll('.list-grid');

    for (const card of cardList) {
        const a = card.querySelector('.list-content .list-body a');
        if (!a) continue;
        const href = a.href;

        // 找到要插入的容器：.flex-fill（通常在底部信息行）
        const targetContainer = card.querySelector('.d-flex.flex-fill.align-items-center.text-muted.text-xs .flex-fill');
        if (!targetContainer) {
            console.warn('未找到目标容器', card);
            continue;
        }

        // 创建显示元素（三个带颜色的 span）
        const statsEl = Object.assign(document.createElement('div'), {
            className: 'acg-stats',
            style: `
                margin-left: 12px;
                font-size: 12px;
                display: flex;
                gap: 8px;
            `
        });

        // 初始显示：加载中
        statsEl.innerHTML = '<span style="color: #999;">加载中...</span>';
        targetContainer.appendChild(statsEl);

        // 获取数据函数
        const fetchData = async () => {
            try {
                const res = await fetch(href);
                const text = await res.text();

                const views = text.match(/<span class="views mr-3">[^<]*<i[^>]*><\/i>\s*([\d,]+)<\/span>/)?.[1] || '—';
                const comment = text.match(/<i class="iconfont icon-comment"><\/i>\s*([\d,]+)<\/a>/)?.[1] || '—';
                const like = text.match(/<span class="star-count-\d+">\s*(\d+)<\/span>/)?.[1] || '—';

                const data = { views, comment, like };
                return data;
            } catch (err) {
                console.error('获取数据失败:', href, err);
                return { views: '❌', comment: '❌', like: '❌' };
            }
        };

        // 异步加载数据并更新显示
        fetchData().then(data => {
            if (!data) return;

            statsEl.innerHTML = `
                <span style="color: #1976D2;"><span>👁️</span><span style="margin-left: 4px;">${data.views}</span></span>
                <span style="color: #ED6C02;"><span>💬</span><span style="margin-left: 4px;">${data.comment}</span></span>
                <span style="color: #D32F2F;"><span>❤️</span><span style="margin-left: 4px;">${data.like}</span></span>
            `;
        });
    }
})();
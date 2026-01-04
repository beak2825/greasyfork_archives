// ==UserScript==
// @name         M-Team 高级搜索助手
// @namespace    http://tampermonkey.net/
// @version      4.7.0
// @description  在高级搜索区添加「最近热度」和「X-Y年前热度」按钮，并提供「全部热度」「取消排名」按钮，自动设定时间范围并按种子数降序排序
// @author       Zola
// @match        https://next.m-team.cc/browse*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550786/M-Team%20%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550786/M-Team%20%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
'use strict';

const PARAMS = {
    SORT: 'sort',
    SORT_VALUE: 'seeders:descend',
    START_DATE: 'uploadDateStart',
    END_DATE: 'uploadDateEnd'
};

function waitForElement(selector) {
    return new Promise((resolve) => {
        const hit = document.querySelector(selector);
        if (hit) return resolve(hit);
        const mo = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                mo.disconnect();
                resolve(el);
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    });
}

/**
 * 最近 N 时间热度 (周/月/年)
 * @param {string} text 按钮文本
 * @param {number} amount 时间数量
 * @param {'days'|'months'|'years'} unit 时间单位
 */
function createDateSortButton(text, amount, unit) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    btn.className = 'ant-btn ant-btn-default';
    btn.style.margin = '4px';
    btn.addEventListener('click', () => {
        const today = new Date();
        const past = new Date(today);

        switch (unit) {
            case 'days':
                past.setDate(today.getDate() - amount);
                break;
            case 'months':
                past.setMonth(today.getMonth() - amount);
                break;
            case 'years':
                // 直接设置年份，比按月份计算更精确和稳定
                past.setFullYear(today.getFullYear() - amount);
                break;
        }

        const start = Math.floor(past.getTime() / 1000);
        const end = Math.floor(today.getTime() / 1000);

        const url = new URL(location.href);
        const sp = url.searchParams;
        sp.set(PARAMS.SORT, PARAMS.SORT_VALUE);
        sp.set(PARAMS.START_DATE, String(start));
        sp.set(PARAMS.END_DATE, String(end));
        sp.set('pageNumber', '1');
        location.href = url.toString();
    });
    return btn;
}

// 从 X 年前到 Y 年前的区间热度
function createYearRangeSortButton(text, startYearsAgo, endYearsAgo) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    btn.className = 'ant-btn ant-btn-default';
    btn.style.margin = '4px';
    btn.addEventListener('click', () => {
        const today = new Date();
        const rangeEnd = new Date(today);   // 距今 startYearsAgo（较近）
        const rangeStart = new Date(today); // 距今 endYearsAgo（较远）

        rangeEnd.setFullYear(today.getFullYear() - startYearsAgo);
        rangeStart.setFullYear(today.getFullYear() - endYearsAgo);

        const start = Math.floor(rangeStart.getTime() / 1000);
        const end = Math.floor(rangeEnd.getTime() / 1000);

        const url = new URL(location.href);
        const sp = url.searchParams;
        sp.set(PARAMS.SORT, PARAMS.SORT_VALUE);
        sp.set(PARAMS.START_DATE, String(start));
        sp.set(PARAMS.END_DATE, String(end));
        sp.set('pageNumber', '1');
        location.href = url.toString();
    });
    return btn;
}

// 全部热度：清除时间，仅排序
function createSortOnlyButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '全部热度';
    btn.className = 'ant-btn ant-btn-default';
    btn.style.margin = '4px';
    btn.addEventListener('click', () => {
        const url = new URL(location.href);
        const sp = url.searchParams;
        sp.set(PARAMS.SORT, PARAMS.SORT_VALUE);
        sp.delete(PARAMS.START_DATE);
        sp.delete(PARAMS.END_DATE);
        sp.set('pageNumber', '1');
        location.href = url.toString();
    });
    return btn;
}

// 取消排名：清除排序与时间
function createClearAllButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '取消排名';
    btn.className = 'ant-btn ant-btn-default';
    btn.style.margin = '4px';
    btn.addEventListener('click', () => {
        const url = new URL(location.href);
        const sp = url.searchParams;
        sp.delete(PARAMS.SORT);
        sp.delete(PARAMS.START_DATE);
        sp.delete(PARAMS.END_DATE);
        sp.set('pageNumber', '1');
        location.href = url.toString();
    });
    return btn;
}

async function mountOnce() {
    const form =
        (await waitForElement('form.torrent-search-panel')) ||
        (await waitForElement('form.ant-form[class*="torrent-search-panel"]')) ||
        (await waitForElement('form.ant-form'));

    if (!form || form.dataset.mtBtnsMounted) return;
    form.dataset.mtBtnsMounted = '1';

    if (document.getElementById('custom-search-buttons-container')) return;

    const wrap = document.createElement('div');
    wrap.id = 'custom-search-buttons-container';
    wrap.style.margin = '10px 0';

    // 1. 最近区间热度按钮
    const recentWrap = document.createElement('div');
    recentWrap.className = 'flex flex-wrap items-center';
    recentWrap.style.marginBottom = '5px';
    recentWrap.style.borderBottom = '1px dashed #eee'; // 视觉分隔线
    recentWrap.style.paddingBottom = '5px';
    
    // 最近热度按钮配置 (新增 5年, 10年)
    [
        { text: '最近一周热度', amount: 7, unit: 'days' },
        { text: '最近一个月热度', amount: 1, unit: 'months' },
        { text: '最近半年热度', amount: 6, unit: 'months' },
        { text: '最近一年热度', amount: 12, unit: 'months' },
        { text: '最近三年热度', amount: 3, unit: 'years' },
        { text: '最近五年热度', amount: 5, unit: 'years' },  // 新增
        { text: '最近十年热度', amount: 10, unit: 'years' } // 新增
    ].forEach((cfg) => recentWrap.appendChild(createDateSortButton(cfg.text, cfg.amount, cfg.unit)));
    
    wrap.appendChild(recentWrap);


    // 2. 按年前区间热度按钮
    const yearRangeWrap = document.createElement('div');
    yearRangeWrap.className = 'flex flex-wrap items-center';
    yearRangeWrap.style.marginBottom = '5px';

    // X-Y 年前热度按钮配置 (不变)
    yearRangeWrap.appendChild(createYearRangeSortButton('1-2年前热度', 1, 2));
    yearRangeWrap.appendChild(createYearRangeSortButton('2-3年前热度', 2, 3));
    yearRangeWrap.appendChild(createYearRangeSortButton('3-4年前热度', 3, 4));
    yearRangeWrap.appendChild(createYearRangeSortButton('4-5年前热度', 4, 5));
    yearRangeWrap.appendChild(createYearRangeSortButton('5-10年前热度', 5, 10));
    yearRangeWrap.appendChild(createYearRangeSortButton('10-20年前热度', 10, 20));

    // 全部热度、取消排名 (不变)
    yearRangeWrap.appendChild(createSortOnlyButton());
    yearRangeWrap.appendChild(createClearAllButton());
    
    wrap.appendChild(yearRangeWrap);

    form.insertAdjacentElement('afterend', wrap);
}

mountOnce();

const obs = new MutationObserver(() => mountOnce());
obs.observe(document.body, { childList: true, subtree: true });
})();
// ==UserScript==
// @name         豆瓣读书 - 多按钮图书检测（可配置）
// @namespace    https://github.com/yourname
// @version      4.0
// @description  支持多站点、正则、字段匹配；成功按钮呈绿色可跳转
// @author       you
// @match        https://book.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552172/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%20-%20%E5%A4%9A%E6%8C%89%E9%92%AE%E5%9B%BE%E4%B9%A6%E6%A3%80%E6%B5%8B%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552172/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%20-%20%E5%A4%9A%E6%8C%89%E9%92%AE%E5%9B%BE%E4%B9%A6%E6%A3%80%E6%B5%8B%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========== 静态配置 ========== */
    const BUTTON_CFG = [
        {
            name: 'zlibISBN',
            url: 'https://zlib.by/s/{isbn}',
            reg: /Books&nbsp;\((\d+)\)/i,
            field: 'isbn',        // 可选 isbn | title
            minCount: 1           // 大于等于此值算成功
        },
        {
            name: 'zlibtitle',
            url: 'https://zlib.by/s/{title}',
            reg: /Books&nbsp;\((\d+)\)/i,
            field: 'isbn',
            minCount: 1
        }
        // 继续追加...
    ];

    /* 日志 */
    function log(...args) {
        console.log('[多按钮脚本]', ...args);
    }

    /* 解析书籍信息 */
    function getBookInfo() {
        const info = {};
        const node = document.querySelector('#info');
        if (!node) return info;
        const txt = node.textContent;
        const mIsbn = txt.match(/ISBN:\s*(\d{10,13})/);
        info.isbn = mIsbn ? mIsbn[1] : '';
        info.title = document.querySelector('h1 [property="v:itemreviewed"]')?.textContent?.trim() || '';
        log('解析到', info);
        return info;
    }

    /* 创建单个按钮 */
    function createButton(cfg) {
        const a = document.createElement('a');
        a.href = 'javascript:;';
        a.className = 'j a_show_login colbutt ll colbutt-disabled';
        a.style.marginLeft = '6px';
        a.innerHTML = `<span>${cfg.name}</span>`;
        return a;
    }

    /* 激活按钮（绿色+可跳转） */
    function activeButton(btn, jumpUrl) {
        btn.classList.remove('colbutt-disabled');
        btn.classList.add('colbutt');
        btn.style.backgroundColor = '#42bd56'; // 豆瓣绿
        btn.addEventListener('click', () => {
            log('跳转→', jumpUrl);
            window.open(jumpUrl, '_blank');
        });
    }

    /* 检测单个配置 */
    function check(cfg, btn, bookInfo) {
        const raw = cfg.field === 'isbn' ? bookInfo.isbn : bookInfo.title;
        if (!raw) { log(cfg.name, '缺少字段', cfg.field); return; }

        const targetUrl = cfg.url.replace(/{isbn}/g, bookInfo.isbn).replace(/{title}/g, encodeURIComponent(bookInfo.title));
        log(cfg.name, '请求→', targetUrl);

        GM_xmlhttpRequest({
            method: 'GET',
            url: targetUrl,
            onload(r) {
                log(cfg.name, '返回状态', r.status);
                if (r.status === 200) {
                    const m = r.responseText.match(cfg.reg);
                    const count = m ? parseInt(m[1], 10) : 0;
                    log(cfg.name, '匹配到数量', count);
                    if (count >= cfg.minCount) {
                        activeButton(btn, targetUrl);
                        btn.querySelector('span').textContent = cfg.name; // 保持原名
                        log(cfg.name, '✅有货');
                        return;
                    }
                }
                log(cfg.name, '❌无货或失败');
            },
            onerror(e) {
                log(cfg.name, '网络错误', e);
            }
        });
    }

    /* 主入口 */
    function main() {
        log('脚本开始');
        const bookInfo = getBookInfo();
        if (!bookInfo.isbn && !bookInfo.title) { log('无法获取ISBN或书名'); return; }

        const where = document.querySelector('#interest_sect_level');
        if (!where) { log('未找到插入位置'); return; }

        BUTTON_CFG.forEach(cfg => {
            const btn = createButton(cfg);
            where.appendChild(btn);
            check(cfg, btn, bookInfo);
        });
    }

    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }
    ready(main);
})();
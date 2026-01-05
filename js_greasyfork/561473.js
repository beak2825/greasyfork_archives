// ==UserScript==
// @name         应用宝网页下载
// @namespace    https://viayoo.com/vqu5z0
// @version      1.2
// @description  替换应用宝下载按钮，可以在浏览器下载。
// @author       Aloazny
// @icon        https://sj.qq.com/favicon.ico
// @match        https://sj.qq.com/*
// @match        https://a.app.qq.com/o/simple.jsp?pkgname=*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561473/%E5%BA%94%E7%94%A8%E5%AE%9D%E7%BD%91%E9%A1%B5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561473/%E5%BA%94%E7%94%A8%E5%AE%9D%E7%BD%91%E9%A1%B5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adblockRules = () => {
        const selectors = ['div[component-id="yybn_game_related_game"]', 'div[dt-eid="brand_banner"]', 'div[component-id="YYB_HOME_WECHAT_GAME_RECOMMEND"]'];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (el && el.style) {
                    el.style.display = 'none !important';
                    el.remove();
                }
            });
        });
    };

    adblockRules();
    new MutationObserver(adblockRules).observe(document.body, {
        childList: true,
        subtree: true
    });

    const href = location.href;

    if (!href.includes('/appdetail/') && !href.includes('a.app.qq.com/o/simple.jsp?pkgname=')) {
        const redirectListBtn = el => {
            if (!el || el.tagName === 'A') return;

            const params = el.getAttribute('dt-params');
            if (!params) return;

            const match = params.match(/[?&]pkgname=([^&]+)/);
            if (!match) return;

            const pkgname = match[1];
            const target = `https://sj.qq.com/appdetail/${pkgname}`;
            const a = document.createElement('a');
            a.href = target;
            a.textContent = el.textContent?.trim() || '查看详情';
            a.className = el.className;
            a.style.cssText = el.style.cssText;
            ['dt-eid', 'dt-params'].forEach(attr => {
                if (el.hasAttribute(attr)) a.setAttribute(attr, el.getAttribute(attr));
            });
            el.parentNode.replaceChild(a, el);
        };

        const handleList = () => {
            // const searchContainers = document.querySelectorAll('[class*="SearchBar"], [class*="searchBar"]');
            document.querySelectorAll('[dt-eid*="common_download"], [dt-eid*="safe_download"]').forEach(el => {
                /*    for (const container of searchContainers) {
                        if (container.contains(el)) return;
                    }
                 */
                redirectListBtn(el);
            });
        };

        handleList();
        new MutationObserver(handleList).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['dt-params', 'dt-eid']
        });
    }

    if (href.includes('sj.qq.com/appdetail/')) {
        const pkg = location.pathname.match(/^\/appdetail\/([^/?]+)/)?.[1];
        if (!pkg) return;
        const target = `https://a.app.qq.com/o/simple.jsp?pkgname=${pkg}`;

        const redirectDetailBtn = el => {
            if (!el || el.tagName === 'A') return;
            const a = document.createElement('a');
            a.href = target;
            a.textContent = '浏览器下载';
            a.className = el.className;
            a.style.cssText = el.style.cssText;
            a.target = '_blank';
            ['dt-eid', 'dt-params', 'title'].forEach(attr => {
                if (el.hasAttribute(attr)) a.setAttribute(attr, el.getAttribute(attr));
            });
            el.parentNode.replaceChild(a, el);
        };

        const findDetailBtns = () => {
            const list = [];
            document.querySelectorAll('[dt-eid*="download"], [dt-eid*="safe_download"]').forEach(el => {
                const t = (el.textContent || '').trim();
                if (t.includes('下载') || t.includes('官方') || t.includes('安卓')) {
                    list.push(el);
                }
            });
            return list;
        };

        const handleDetail = () => findDetailBtns().forEach(redirectDetailBtn);
        handleDetail();
        new MutationObserver(handleDetail).observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });

        return;
    }

    if (href.includes('a.app.qq.com/o/simple.jsp?pkgname=')) {
        const main = document.querySelector('.main-download-btn');
        const sub = document.querySelector('.sub-download-btn');
        const nameEl = document.querySelector('.app-vertical-panel .app-detail-bar > span + span[class]');

        if (!main || !sub) return;
        let appsize = nameEl?.textContent?.trim() || '';
        main.textContent = `下载 ${appsize}`;
        main.classList.remove('weaken-display');
        main.style.fontWeight = 'bold';
        sub.style.display = 'none';

        document.getElementById('yyb-safe-text')?.classList.add('hidden');
        document.getElementById('normal-safe-text')?.classList.remove('hidden');

        main.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            sub.click();
        }, true);

        if (!nameEl?.textContent?.trim()) {
            new MutationObserver(() => {
                const el = document.querySelector('.app-vertical-panel h3');
                if (el?.textContent?.trim()) {
                    name = el.textContent.trim();
                    main.textContent = `浏览器下载 ${name}`;
                }
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    function createSearchWidget() {
        const style = document.createElement('style');
        style.textContent = `.search-widget-btn{position:fixed;bottom:100px;right:20px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#ff7eb3,#ff758c);box-shadow:0 8px 32px rgba(255,126,179,0.3);border:none;cursor:pointer;z-index:9999;transition:all 0.3s cubic-bezier(0.68,-0.55,0.265,1.55);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;}.search-widget-btn:hover{transform:scale(1.1);box-shadow:0 12px 40px rgba(255,126,179,0.4);}.search-widget-btn:active{transform:scale(0.95);}.search-widget-icon{width:24px;height:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1));}.search-widget-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(5px);}.search-widget-box{background:rgba(255,255,255,0.95);border-radius:20px;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,0.2);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.3);width:90%;max-width:500px;transform:scale(0.9);opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);}.search-widget-box.active{transform:scale(1);opacity:1;}.search-widget-input{width:100%;padding:15px 20px;border-radius:50px;border:2px solid #ff7eb3;font-size:16px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.8);}.search-widget-input:focus{border-color:#ff4d7e;box-shadow:0 0 0 3px rgba(255,126,179,0.2);}.search-widget-submit{margin-top:20px;width:100%;padding:15px;border-radius:50px;background:linear-gradient(135deg,#ff7eb3,#ff758c);color:white;border:none;font-size:16px;font-weight:bold;cursor:pointer;transition:all 0.3s;}.search-widget-submit:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(255,126,179,0.4);}@media(max-width:768px){.search-widget-btn{width:50px;height:50px;bottom:85px;right:15px;}.search-widget-box{padding:20px;margin:20px;}}`;
        document.head.appendChild(style);
        const btn = document.createElement('button');
        btn.className = 'search-widget-btn';
        btn.innerHTML = `<svg class="search-widget-icon" viewBox="0 0 24 24"><path fill="white" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;
        const modal = document.createElement('div');
        modal.className = 'search-widget-modal';
        modal.innerHTML = `<div class="search-widget-box"><input type="text" class="search-widget-input" placeholder="搜索应用..." autofocus><button class="search-widget-submit">搜索</button></div>`;
        document.body.appendChild(btn);
        document.body.appendChild(modal);
        const box = modal.querySelector('.search-widget-box');
        const input = modal.querySelector('.search-widget-input');
        const submit = modal.querySelector('.search-widget-submit');
        btn.addEventListener('click', () => {
            modal.style.display = 'flex';
            setTimeout(() => box.classList.add('active'), 10);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                box.classList.remove('active');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        });
        const performSearch = () => {
            const query = input.value.trim();
            if (query) {
                window.location.href = `https://sj.qq.com/search?q=${encodeURIComponent(query)}`;
            }
        };
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        submit.addEventListener('click', performSearch);
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                btn.style.bottom = '85px';
                btn.style.right = '15px';
            } else {
                btn.style.bottom = '100px';
                btn.style.right = '20px';
            }
        });
    }
    if (window.location.hostname === 'sj.qq.com') {
        window.addEventListener('load', createSearchWidget);
    }
})();
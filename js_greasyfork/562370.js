// ==UserScript==
// @name         Danryoku搜索框
// @namespace    https://viayoo.com/st7tgk
// @version      1.0
// @description  为 Danryoku 提供黑色风格悬浮搜索与网页加载跳动球动画
// @author       Via
// @match       *://danryoku.com/*
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAADGklEQVRYhcWXT2gdVRTGf+e9N9OQmiCJGMhCCYRUK6ZxI8WNi9SomwciuAiGZiHBZCGKz0eTVtJFTcifCom00BQqQovLgG50IbQlLTRgUCLBYjZKSaEBkRA0fdx7j4uJUfPmzsx7iDlwNjPf/c53v3PvnblwwCH1DtRrs6BSRmhCGZc333f/mwC9NAkN4SRwCgGUBVSHZbBUs4hcPQIoBGWsnsIqGAWrQ1gm9eOPaqaqWYBemn0DyyQG/pWWMo8certWvppaoBdne4BbCI0eiEHplZHSzf9cgM7PNCN8C3SmQDdQnpN3PniQhTd7CyxzGDqrrK/OdiyXdW4uE20mAW5m5hUMg1jIlIaiVir9WbhTW+Cmz4c4uwp0VY+WiEJjd98GjqdzY+WtJP50Byp2CENXnN3S9zJSLPpb4Xg3jT7RATc+HSL8BDwRCzh6BIIAvv/BR/Er8GTubHnbBygkyrMUEU9xgNW7icOBFpR+YMEHSG6B1QHM7mkXlyoRRRLG6oCWp7wlvA640lSI4YR3ZE6Q11+FMEA//xKM9SGPq9JC1I5qGm8BSzeWRu9W6+yA1keh6TAc7UralgWsPO+dh1+AdiZZK8eeimZtLPJsFzhJaIPznp5+AYZm72nX2gLNh8HaKBtCaG9LOh2b63CAitfWtsf2Zr/nwuOtSW3Y8ZXxb0Ojv/heSVCIZv7PCAqR3fHh5fILcKzgMHEY3dxC9q163dyK7I5VzLKvjLcFuU9Hf8NyPdbSu/dhe+fvNbBTgbV7PvtXWH/G60DyQWS4ELuo/jDoN6u7/XfojTXYeuhbgBdyS0VvieSj2OkXqiyjVO/jtQ0IAwjy6MrPPoYfJadXk0qkfo7taxM9wB0gTMPuCwf05hfHrieBUj/H+cWx7zC8l+FPaH+OpxWHtBb8pVK56Jx2oJSy4BGuqDCRDZoxbN8EoNFlJDkWVBgufH060yWlpt9y99IE6vQtlE+Ahn2vDcKoBG4299WHmTnruprZF8/1oHwGdO8+Wkc4mb9x5natXHVfTu0L50KEEaABYT6/dOb3erkONP4E6kan5z8Xsr8AAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562370/Danryoku%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/562370/Danryoku%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            #custom-loading-overlay{position:fixed;inset:0;background:transparent;display:flex;align-items:center;justify-content:center;z-index:999999;transition:opacity .5s ease;pointer-events:none}
            .cute-ball{width:50px;height:50px;background:#333;border-radius:50%;animation:bounce 0.6s infinite alternate;box-shadow:0 20px 20px rgba(0,0,0,0.15);pointer-events:auto;cursor:pointer}
            @keyframes bounce{from{transform:translateY(0) scaleX(1)}to{transform:translateY(-40px) scaleX(0.9)}}
            .search-widget-btn{position:fixed;bottom:100px;right:20px;width:62px;height:62px;border-radius:50%;background:#1a1a1a;box-shadow:0 8px 32px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.1);cursor:pointer;z-index:9999;display:flex !important;align-items:center !important;justify-content:center !important;transition:all 0.3s cubic-bezier(0.68,-0.55,0.265,1.55);backdrop-filter:blur(12px);padding:0 !important;margin:0 !important;outline:none}
            .search-widget-btn:active{transform:scale(0.92)}
            .search-widget-icon{width:36px !important;height:36px !important;display:block !important}
            .search-widget-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(10px)}
            .search-widget-box{background:#181818;border-radius:24px;padding:28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);width:85%;max-width:420px;transform:scale(0.9);opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
            .search-widget-box.active{transform:scale(1);opacity:1}
            .search-widget-input{width:100%;padding:14px 20px;border-radius:12px;border:1px solid #333;font-size:16px;outline:none;background:#0d0d0d;color:#fff;box-sizing:border-box}
            .search-widget-submit{margin-top:20px;width:100%;padding:14px;border-radius:12px;background:#fff;color:#000;border:none;font-size:15px;font-weight:bold;cursor:pointer;transition:opacity 0.3s}@media(max-width:768px){.search-widget-btn{width:56px;height:56px;bottom:85px;right:15px}
            .search-widget-icon{width:30px !important;height:30px !important}}
        `;
        document.head.appendChild(style);
    };

    const loader = document.createElement('div');
    loader.id = 'custom-loading-overlay';
    loader.innerHTML = '<div class="cute-ball"></div>';
    document.documentElement.appendChild(loader);

    const handleLoad = () => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    };

    window.addEventListener('load', handleLoad);
    loader.firstChild.onclick = handleLoad;

    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();

        const btn = document.createElement('button');
        btn.className = 'search-widget-btn';
        btn.innerHTML = `<svg class="search-widget-icon" width="36" height="36" viewBox="0 0 24 24"><path fill="white" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;

        const modal = document.createElement('div');
        modal.className = 'search-widget-modal';
        modal.innerHTML = `
            <div class="search-widget-box">
                <input type="text" class="search-widget-input" placeholder="输入关键词并回车..." autofocus>
                <button class="search-widget-submit">搜索</button>
            </div>`;

        document.body.appendChild(btn);
        document.body.appendChild(modal);

        const box = modal.querySelector('.search-widget-box');
        const input = modal.querySelector('.search-widget-input');
        const submit = modal.querySelector('.search-widget-submit');

        const toggleModal = (show) => {
            if (show) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    box.classList.add('active');
                    input.focus();
                }, 10);
            } else {
                box.classList.remove('active');
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        const performSearch = () => {
            const query = input.value.trim();
            if (query) window.location.href = `https://danryoku.com/?s=${encodeURIComponent(query)}`;
        };

        btn.onclick = (e) => {
            e.preventDefault();
            toggleModal(true);
        };
        modal.onclick = (e) => {
            if (e.target === modal) toggleModal(false);
        };
        submit.onclick = performSearch;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') performSearch();
        };
    });
})();
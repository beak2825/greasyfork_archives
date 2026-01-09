// ==UserScript==
// @name         LZTGIF
// @namespace    https://lolz.live/
// @version      6.0
// @description  Панель с избранными GIF слева от чата
// @author       https://lolz.live/corgi
// @match        https://lolz.live/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/562002/LZTGIF.user.js
// @updateURL https://update.greasyfork.org/scripts/562002/LZTGIF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'lzt_my_gifs';
    const CATEGORIES_KEY = 'lzt_gif_categories';
    const $body = $('body');
    let $sidebar = null;
    let $grid = null;
    const SVG_ICON = `<svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.25 0.75H2.25C1.42157 0.75 0.75 1.42157 0.75 2.25V15.25C0.75 16.0784 1.42157 16.75 2.25 16.75H20.25C21.0784 16.75 21.75 16.0784 21.75 15.25V2.25C21.75 1.42157 21.0784 0.75 20.25 0.75Z" stroke="#8C8C8C" stroke-width="1.5"/><path d="M18.75 5.83301V6.04688H14.668V8.83301H18.1348V8.97266H14.668V11.6582H14.4707V5.83301H18.75Z" fill="black" stroke="#8C8C8C"/><path d="M11.9419 5.83301V11.6582H11.7368V5.83301H11.9419Z" fill="black" stroke="#8C8C8C"/><path d="M6.77344 5.75C6.95581 5.75001 7.13839 5.76166 7.32129 5.78516L7.3291 5.78613C7.51157 5.80673 7.69013 5.8406 7.86523 5.88672H7.86719C8.04404 5.93274 8.21489 5.99129 8.37988 6.0625L8.38867 6.06641C8.40893 6.07473 8.42827 6.08501 8.44824 6.09375L8.35742 6.26562C8.22013 6.20861 8.07718 6.16003 7.92773 6.12207L7.92871 6.12109C7.75636 6.07387 7.57785 6.03884 7.39453 6.01562H7.39551C7.21575 5.99252 7.03467 5.98145 6.85254 5.98145C6.53627 5.98145 6.23576 6.01695 5.9541 6.0918L5.67871 6.17969C5.32871 6.30932 5.02062 6.49738 4.76465 6.74902C4.51012 6.99624 4.31859 7.2921 4.18848 7.62891C4.05819 7.96605 3.99609 8.32825 3.99609 8.70898C3.99615 9.10191 4.06126 9.47469 4.19727 9.82129C4.33185 10.1643 4.52613 10.4667 4.78125 10.7217C5.03654 10.9767 5.34097 11.173 5.6875 11.3125L5.69238 11.3135C6.04787 11.4528 6.43415 11.5185 6.84473 11.5186C7.17163 11.5186 7.48278 11.4771 7.77344 11.3877L7.7793 11.3857C8.06541 11.2942 8.3254 11.1618 8.55273 10.9854C8.77978 10.8091 8.96609 10.5952 9.10938 10.3467L9.11133 10.3438C9.25522 10.0902 9.34721 9.81216 9.39062 9.51465L9.47168 8.95508V9.65039L9.48828 9.62988C9.45919 9.7881 9.41983 9.94024 9.36621 10.0859V10.0879C9.27771 10.3317 9.15539 10.5548 9 10.7588V10.7598C8.8851 10.9106 8.75268 11.046 8.60254 11.167L8.4502 11.2803C8.23676 11.4241 7.98846 11.54 7.70215 11.626C7.42466 11.7064 7.11236 11.75 6.76172 11.75C6.27014 11.75 5.84664 11.6665 5.48242 11.5107H5.4834C5.10962 11.3499 4.79972 11.1347 4.54785 10.8652C4.29308 10.5928 4.0952 10.271 3.95605 9.89648C3.81959 9.52211 3.75003 9.11862 3.75 8.68262C3.75 8.25742 3.81874 7.86849 3.95215 7.5127L3.95312 7.51172C4.08602 7.15486 4.27703 6.85057 4.52637 6.59375C4.77344 6.33927 5.08149 6.13343 5.45898 5.97949L5.45801 5.97852C5.82598 5.82939 6.26188 5.75 6.77344 5.75ZM9.47168 8.80273V8.94238H7.33398V8.80273H9.47168Z" fill="black" stroke="#8C8C8C"/></svg>`;
    let chatTag = '.chat2-floating';
    let userAvatar = '';
    let userId = '';
    let currentCategoryId = null;
    let myGifs = new Set();
    let gifNames = {};
    let currentSearchQuery = '';

    const oldGifs = GM_getValue(STORAGE_KEY, []);
    let categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });

    if (oldGifs.length > 0 && categoriesData.categories.length === 0) {
        getUser();
        categoriesData = {
            categories: [{
                id: userId || 'default',
                avatar: userAvatar || 'https://nztcdn.com/avatar/s/1762619748/5941085.webp',
                gifs: oldGifs,
                pinnedGifs: [],
                gifNames: {}
            }],
            currentCategoryId: userId || 'default'
        };
        GM_setValue(CATEGORIES_KEY, categoriesData);
    }

    currentCategoryId = categoriesData.currentCategoryId || (categoriesData.categories.length > 0 ? categoriesData.categories[0].id : null);
    const currentCategory = categoriesData.categories.find(c => c.id === currentCategoryId);
    myGifs = currentCategory ? new Set(currentCategory.gifs || []) : new Set();
    let pinnedGifs = currentCategory ? new Set(currentCategory.pinnedGifs || []) : new Set();
    gifNames = currentCategory ? (currentCategory.gifNames || {}) : {};

    function saveCategories() {
        const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });
        const category = categoriesData.categories.find(c => c.id === currentCategoryId);
        if (category) {
            category.gifs = Array.from(myGifs);
            category.pinnedGifs = Array.from(pinnedGifs);
            category.gifNames = gifNames;
        }
        categoriesData.currentCategoryId = currentCategoryId;
        GM_setValue(CATEGORIES_KEY, categoriesData);
    }

    function switchCategory(categoryId) {
        saveCategories();
        currentCategoryId = categoryId;
        const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });
        const category = categoriesData.categories.find(c => c.id === categoryId);
        myGifs = category ? new Set(category.gifs || []) : new Set();
        pinnedGifs = category ? new Set(category.pinnedGifs || []) : new Set();
        gifNames = category ? (category.gifNames || {}) : {};
        categoriesData.currentCategoryId = categoryId;
        GM_setValue(CATEGORIES_KEY, categoriesData);
        currentSearchQuery = '';
        if ($sidebar) {
            $sidebar.find('.lzt-gif-search-input').val('');
        }
        renderCategories();
        renderGifs();
    }

    const isChatbox = /^https?:\/\/lolz\.live\/chatbox\/?.*$/.test(window.location.href);
    if (isChatbox) {
        chatTag = '.chat2[type="full"]';
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const dataTransfer = e.originalEvent.dataTransfer;

        let imgUrl = null;

        if (dataTransfer.types.includes('text/html')) {
            const html = dataTransfer.getData('text/html');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const img = tempDiv.querySelector('img');
            if (img && img.src) {
                imgUrl = img.src;
            }
        }

        if (!imgUrl && dataTransfer.types.includes('text/uri-list')) {
            imgUrl = dataTransfer.getData('text/uri-list');
        }

        if (imgUrl) {
            if (myGifs.has(imgUrl)) return;
            myGifs.add(imgUrl);
            saveCategories();
            addGifItem(imgUrl);
        }
        return false;
    }

    function calculateSimilarity(str1, str2) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();

        if (str2.startsWith(str1)) return 1.0;
        if (str2.includes(str1)) return 0.8;

        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        let matches = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) {
                matches++;
            }
        }

        return matches / longer.length;
    }

    function filterAndSortGifs(searchQuery) {
        if (!searchQuery) {
            return {
                pinned: Array.from(pinnedGifs),
                unpinned: Array.from(myGifs).filter(url => !pinnedGifs.has(url))
            };
        }

        const allGifs = Array.from(myGifs).map(url => {
            const name = gifNames[url] || '';
            const similarity = calculateSimilarity(searchQuery, name);
            return { url, name, similarity, isPinned: pinnedGifs.has(url) };
        });

        const filtered = allGifs.filter(gif => gif.similarity >= 0.6);

        filtered.sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
            }
            if (b.similarity !== a.similarity) {
                return b.similarity - a.similarity;
            }
            const aStartsWith = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
            const bStartsWith = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
            if (aStartsWith !== bStartsWith) {
                return aStartsWith ? -1 : 1;
            }
            return 0;
        });

        return {
            pinned: filtered.filter(g => g.isPinned).map(g => g.url),
            unpinned: filtered.filter(g => !g.isPinned).map(g => g.url)
        };
    }

    const css = `.lzt-gif-header,.lzt-gif-title{display:flex;align-items:center}.lzt-gif-category-delete,.lzt-gif-delete,.lzt-gif-pin{cursor:pointer;opacity:0;transition:opacity .2s}#lzt-gif-sidebar{position:absolute;top:-1px;bottom:0;left:-360px;width:360px;z-index:9999;transition:left .35s cubic-bezier(.25,.8,.25,1);border-radius:10px 0 0 10px;display:none}#lzt-gif-sidebar.open{display:block}.lzt-gif-header{height:56px;padding:0 20px;justify-content:space-between;border-top-left-radius:10px}.lzt-gif-title{gap:12px;color:#fff}.lzt-gif-search{padding:8px 12px;border-bottom:1px solid #363636}.lzt-gif-search-input{width:calc(100% - 4px);padding:6px 10px;background:#2a2a2a;border:1px solid #404040;border-radius:6px;color:#fff;font-size:13px;outline:none;transition:border-color .2s;box-sizing:border-box}.lzt-gif-search-input:focus{border-color:#606060}.lzt-gif-search-input::placeholder{color:#666}.lzt-gif-content{height:calc(100% - 128px);overflow-y:auto;padding:12px;border:1px solid #363636;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.lzt-gif-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.lzt-gif-item{position:relative;border-radius:10px;overflow:hidden;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.5)}.lzt-gif-item-wrapper{position:relative}.lzt-gif-item img{width:100%;height:100px;object-fit:contain;display:block;transition:transform .3s;background:#242424}.lzt-gif-item:hover img{transform:scale(1.08)}.lzt-gif-name{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.85);color:#fff;font-size:10px;padding:3px 4px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.lzt-gif-delete{position:absolute;top:6px;right:6px;width:28px;height:28px;background:rgba(0,0,0,.7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;z-index:5}.lzt-gif-pin{position:absolute;top:6px;left:6px;width:28px;height:28px;background:rgba(0,0,0,.7);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:5}.lzt-gif-pin svg{width:16px;height:16px;stroke:currentColor;fill:none}.lzt-gif-pin.pinned{opacity:1;background:rgba(255,193,7,.8)}.lzt-gif-category:hover .lzt-gif-category-delete,.lzt-gif-item:hover .lzt-gif-delete,.lzt-gif-item:hover .lzt-gif-pin{opacity:1}.lzt-gif-empty{text-align:center;padding-top:120px;color:#888;font-size:14px}.lzt-gif-add .Svg-Icon{display:flex;align-items:center;gap:10px}.lzt-gif-add .Svg-Icon svg path{stroke:#505050}.chat2-floating:has(#lzt-gif-sidebar.open){border-top-left-radius:0!important}.chat2-floating:has(#lzt-gif-sidebar.open) .chat2-header{border-top-left-radius:0!important}#lzt-gif-btn{margin-left:8px;cursor:pointer;padding:8px;border-radius:8px;transition:background .2s;display:flex;align-items:center;justify-content:center}#lzt-gif-btn:hover,.lzt-gif-category.active,.lzt-gif-category:hover{background:rgba(255,255,255,.1)}.lzt-gif-header-actions{display:flex;align-items:center;justify-content:center;gap:10px;height:100%}.lzt-gif-header-actions a{display:flex;align-items:center;justify-content:center;width:20px;height:20px}.lzt-gif-content{scrollbar-width:none;-ms-overflow-style:none}.lzt-gif-content::-webkit-scrollbar{display:none;width:10px;height:10px;background:0 0}.lzt-gif-content::-webkit-scrollbar-track{background:0 0;border-radius:10px}.lzt-gif-content::-webkit-scrollbar-thumb{background:rgba(148,148,148,.4);border-radius:10px;border:2px solid transparent;background-clip:content-box}.lzt-gif-content:hover::-webkit-scrollbar-thumb{background:rgba(148,148,148,.7)}.lzt-gif-content::-webkit-scrollbar-thumb:active{background:rgba(148,148,148,.9)}.lzt-gif-content::-webkit-scrollbar-corner{background:0 0}.chat2[type=full] #lzt-gif-sidebar{min-width:320px;position:relative;top:unset;left:unset;right:unset}.chat2[type=full]:has(#lzt-gif-sidebar.open){display:flex}.chat2[type=full]:has(#lzt-gif-sidebar.open) .chat2-full-inner{flex:1}.chat2[type=full] .lzt-gif-header{height:62px}.chat2[type=full] .lzt-gif-content{height:calc(100% - 142px)}.lzt-gif-categories img{width:32px;height:32px;border-radius:32px}.lzt-gif-categories{display:flex;align-items:center;flex-wrap:nowrap;bottom:0;position:absolute;width:100%;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;scrollbar-color:rgba(148,148,148,0.4) transparent}.lzt-gif-categories::-webkit-scrollbar{height:6px;background:0 0}.lzt-gif-categories::-webkit-scrollbar-track{background:0 0}.lzt-gif-categories::-webkit-scrollbar-thumb{background:rgba(148,148,148,.4);border-radius:3px}.lzt-gif-categories::-webkit-scrollbar-thumb:hover{background:rgba(148,148,148,.7)}.lzt-gif-category{width:45px;height:45px;display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0}.lzt-gif-category-delete{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(255,0,0,.8);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;z-index:10}.lzt-settings-container{position:absolute;right:0;top:39px;z-index:2;display:none;flex-direction:column;gap:10px;width:150px;padding:20px;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.lzt-settings-container.open{display:flex}.lzt-gif-rename-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:10000}.lzt-gif-rename-content{background:#2a2a2a;padding:16px;border-radius:10px;width:calc(100vw - 40px);max-width:250px}.lzt-gif-rename-content h3{color:#fff;margin:0 0 12px 0;font-size:14px}.lzt-gif-rename-content input{width:100%;padding:8px;background:#1a1a1a;border:1px solid #404040;border-radius:6px;color:#fff;font-size:13px;outline:none;margin-bottom:12px;box-sizing:border-box}.lzt-gif-rename-content input:focus{border-color:#606060}.lzt-gif-rename-buttons{display:flex;gap:8px;justify-content:flex-end}.lzt-gif-rename-buttons button{padding:6px 12px;border:none;border-radius:6px;cursor:pointer;font-size:13px}.lzt-gif-rename-buttons .btn-save{background:#4CAF50;color:#fff}.lzt-gif-rename-buttons .btn-cancel{background:#666;color:#fff}`;
    $('<style>').text(css).appendTo('head');

    function createSidebar() {
        if ($sidebar) return;

        const $chat = $(chatTag);
        if (!$chat.length) return;

        $('#lzt-gif-sidebar').remove();

        $sidebar = $(`
            <div id="lzt-gif-sidebar" class="lztng-content-background">
                <div class="lzt-gif-header lztng-primary-dark">
                    <div class="lzt-gif-title">
                        ${SVG_ICON}
                        Мои GIF
                    </div>
                    <div class="lzt-gif-header-actions">
                    <div class="lzt-settings lztng-primary-dark">
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="CurrentColor"><path d="M9.39504 19.3711L9.97949 20.6856C10.1532 21.0768 10.4368 21.4093 10.7957 21.6426C11.1547 21.8759 11.5736 22.0001 12.0017 22C12.4298 22.0001 12.8488 21.8759 13.2077 21.6426C13.5667 21.4093 13.8502 21.0768 14.0239 20.6856L14.6084 19.3711C14.8164 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5677 17.8941 17.0784 17.9478L18.5084 18.1C18.934 18.145 19.3636 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8714 16.635 20.9735 16.2103 20.951 15.7829C20.9285 15.3555 20.7825 14.9438 20.5306 14.5978L19.6839 13.4344C19.3825 13.0171 19.2214 12.5148 19.2239 12C19.2238 11.4866 19.3864 10.9864 19.6884 10.5711L20.535 9.40778C20.7869 9.06175 20.933 8.65007 20.9554 8.22267C20.9779 7.79528 20.8759 7.37054 20.6617 7C20.4478 6.62923 20.1309 6.32849 19.7495 6.13423C19.3681 5.93997 18.9385 5.86053 18.5128 5.90556L17.0828 6.05778C16.5722 6.11141 16.0576 6.00212 15.6128 5.74556C15.1699 5.48825 14.8199 5.09736 14.6128 4.62889L14.0239 3.31444C13.8502 2.92317 13.5667 2.59072 13.2077 2.3574C12.8488 2.12408 12.4298 1.99993 12.0017 2C11.5736 1.99993 11.1547 2.12408 10.7957 2.3574C10.4368 2.59072 10.1532 2.92317 9.97949 3.31444L9.39504 4.62889C9.18797 5.09736 8.83792 5.48825 8.39504 5.74556C7.95026 6.00212 7.43571 6.11141 6.92504 6.05778L5.4906 5.90556C5.06493 5.86053 4.63534 5.93997 4.25391 6.13423C3.87249 6.32849 3.55561 6.62923 3.34171 7C3.12753 7.37054 3.02549 7.79528 3.04798 8.22267C3.07046 8.65007 3.2165 9.06175 3.46838 9.40778L4.31504 10.5711C4.61698 10.9864 4.77958 11.4866 4.77949 12C4.77958 12.5134 4.61698 13.0137 4.31504 13.4289L3.46838 14.5922C3.2165 14.9382 3.07046 15.3499 3.04798 15.7773C3.02549 16.2047 3.12753 16.6295 3.34171 17C3.55582 17.3706 3.87274 17.6712 4.25411 17.8654C4.63548 18.0596 5.06496 18.1392 5.4906 18.0944L6.9206 17.9422C7.43127 17.8886 7.94581 17.9979 8.3906 18.2544C8.83513 18.511 9.18681 18.902 9.39504 19.3711Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9999 15C13.6568 15 14.9999 13.6569 14.9999 12C14.9999 10.3431 13.6568 9 11.9999 9C10.3431 9 8.99992 10.3431 8.99992 12C8.99992 13.6569 10.3431 15 11.9999 15Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </a>
                        <div class="lzt-settings-container lztng-primary-dark">
                            <span class="button primary" id="lzt-gif-download">Скачать конфиг</span>
                            <span class="button primary" id="lzt-gif-upload">Загрузить конфиг</span>
                        </div>
                    </div>
                    <div class="lzt-bug-report">
                        <a href="https://lolz.live/corgi" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21" stroke="CurrentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </a>
                    </div>
                    <div class="lzt-gif-close">
                        <a>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640"><path fill="CurrentColor" d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
                        </a>
                    </div>
                    </div>
                </div>
                <div class="lzt-gif-search lztng-content-background">
                    <input type="text" class="lzt-gif-search-input" placeholder="Поиск по названию...">
                </div>
                <div class="lzt-gif-content">
                    ${myGifs.size === 0
                        ? `<div class="lzt-gif-empty">Пока пусто<br><small style="color:#666;">ПКМ → Сохранить GIF</small></div>`
                        : `<div class="lzt-gif-grid"></div>`
                    }
                </div>
                <div class="lzt-gif-categories lztng-primary-dark">
                </div>
            </div>
        `).prependTo($chat);

        $sidebar.find('.lzt-gif-close').on('click', () => $sidebar.removeClass('open'));

        $sidebar.find('.lzt-settings a').on('click', (e) => {
            e.stopPropagation();
            $sidebar.find('.lzt-settings-container').toggleClass('open');
        });

        $(document).on('click', (e) => {
            if (!$sidebar || !$sidebar.hasClass('open')) return;
            const $settingsContainer = $sidebar.find('.lzt-settings-container');
            const $settings = $sidebar.find('.lzt-settings');

            if (!$settingsContainer.is(e.target) &&
                !$settingsContainer.has(e.target).length &&
                !$settings.is(e.target) &&
                !$settings.has(e.target).length) {
                $settingsContainer.removeClass('open');
            }
        });

        $sidebar.find('#lzt-gif-download').on('click', () => downloadConfig());
        $sidebar.find('#lzt-gif-upload').on('click', () => uploadConfig());

        $sidebar.find('.lzt-gif-search-input').on('input', (e) => {
            currentSearchQuery = e.target.value.trim();
            renderGifs();
        });

        $sidebar.find('.lzt-gif-content')
        .on('dragover dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        })
        .on('drop', (e) => handleDrop(e));

        renderCategories();
        renderGifs();
    }

    function renderCategories() {
        if (!$sidebar) return;
        const $categoriesContainer = $sidebar.find('.lzt-gif-categories');
        $categoriesContainer.empty();

        const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });

        if (!userId) {
            getUser();
        }

        categoriesData.categories.forEach(category => {
            const isOwnCategory = category.id === userId;
            const $category = $(`
                <span class="lzt-gif-category ${category.id === currentCategoryId ? 'active' : ''}" data-category-id="${category.id}">
                    <img src="${category.avatar}">
                    ${!isOwnCategory ? '<span class="lzt-gif-category-delete" title="Удалить категорию">×</span>' : ''}
                </span>
            `).appendTo($categoriesContainer);

            $category.on('click', (e) => {
                if ($(e.target).hasClass('lzt-gif-category-delete')) {
                    return;
                }
                $categoriesContainer.find('.lzt-gif-category').removeClass('active');
                $category.addClass('active');
                switchCategory(category.id);
            });

            if (!isOwnCategory) {
                $category.find('.lzt-gif-category-delete').on('click', (e) => {
                    e.stopPropagation();
                    deleteCategory(category.id);
                });
            }
        });
    }

    function deleteCategory(categoryId) {
        if (!userId) {
            getUser();
        }

        if (categoryId === userId) {
            alert('Нельзя удалить свою категорию!');
            return;
        }

        if (!confirm('Удалить эту категорию? Все GIF из неё будут удалены.')) {
            return;
        }

        const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });

        categoriesData.categories = categoriesData.categories.filter(c => c.id !== categoryId);

        if (currentCategoryId === categoryId) {
            if (categoriesData.categories.length > 0) {
                currentCategoryId = categoriesData.categories[0].id;
                categoriesData.currentCategoryId = currentCategoryId;
                const newCategory = categoriesData.categories.find(c => c.id === currentCategoryId);
                myGifs = newCategory ? new Set(newCategory.gifs || []) : new Set();
            } else {
                currentCategoryId = null;
                categoriesData.currentCategoryId = null;
                myGifs = new Set();
            }
        }

        GM_setValue(CATEGORIES_KEY, categoriesData);
        renderCategories();
        renderGifs();
    }

    function renderGifs() {
        if (!$sidebar) return;
        const $content = $sidebar.find('.lzt-gif-content');

        if (myGifs.size === 0) {
            $content.html(`<div class="lzt-gif-empty">Пока пусто<br><small style="color:#666;">ПКМ → Сохранить GIF</small></div>`);
            $grid = null;
        } else {
            $content.html('<div class="lzt-gif-grid"></div>');
            $grid = $sidebar.find('.lzt-gif-grid');

            const { pinned, unpinned } = filterAndSortGifs(currentSearchQuery);

            if (pinned.length === 0 && unpinned.length === 0 && currentSearchQuery) {
                $content.html(`<div class="lzt-gif-empty">Ничего не найдено<br><small style="color:#666;">Попробуйте другой запрос</small></div>`);
                $grid = null;
            } else {
                pinned.forEach(url => addGifItem(url, true));
                unpinned.forEach(url => addGifItem(url, false));
            }
        }
    }

    const PIN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.37658 15.6163L2.71973 21.2732M11.6943 6.64181L10.1334 8.2027C10.0061 8.33003 9.9424 8.39369 9.86986 8.44427C9.80548 8.48917 9.73604 8.52634 9.66297 8.555C9.58065 8.58729 9.49236 8.60495 9.3158 8.64026L5.65133 9.37315C4.69903 9.56361 4.22288 9.65884 4.00012 9.9099C3.80605 10.1286 3.71743 10.4213 3.75758 10.7109C3.80367 11.0434 4.14703 11.3867 4.83375 12.0735L11.9195 19.1592C12.6062 19.8459 12.9496 20.1893 13.282 20.2354C13.5716 20.2755 13.8643 20.1869 14.083 19.9928C14.3341 19.7701 14.4293 19.2939 14.6198 18.3416L15.3527 14.6771C15.388 14.5006 15.4056 14.4123 15.4379 14.33C15.4666 14.2569 15.5038 14.1875 15.5487 14.1231C15.5992 14.0505 15.6629 13.9869 15.7902 13.8596L17.3511 12.2987C17.4325 12.2173 17.4732 12.1766 17.518 12.141C17.5577 12.1095 17.5998 12.081 17.6439 12.0558C17.6935 12.0274 17.7464 12.0048 17.8522 11.9594L20.3466 10.8904C21.0743 10.5785 21.4381 10.4226 21.6034 10.1706C21.7479 9.95025 21.7996 9.68175 21.7473 9.42348C21.6874 9.12813 21.4075 8.84822 20.8477 8.28839L15.7045 3.14526C15.1447 2.58543 14.8648 2.30552 14.5695 2.24565C14.3112 2.19329 14.0427 2.245 13.8223 2.38953C13.5703 2.55481 13.4144 2.91866 13.1025 3.64636L12.0335 6.14071C11.9882 6.24653 11.9655 6.29944 11.9372 6.34905C11.912 6.39313 11.8835 6.43522 11.8519 6.47496C11.8164 6.51971 11.7757 6.56041 11.6943 6.64181Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    function showRenameModal(url) {
        const currentName = gifNames[url] || '';
        const $modal = $(`
            <div class="lzt-gif-rename-modal">
                <div class="lzt-gif-rename-content">
                    <h3>Название GIF</h3>
                    <input type="text" class="rename-input" value="${currentName}" placeholder="Введите название...">
                    <div class="lzt-gif-rename-buttons">
                        <button class="btn-cancel">Отмена</button>
                        <button class="btn-save">Сохранить</button>
                    </div>
                </div>
            </div>
        `).appendTo('body');

        const $input = $modal.find('.rename-input');
        $input.focus().select();

        $modal.find('.btn-save').on('click', () => {
            const newName = $input.val().trim();
            if (newName) {
                gifNames[url] = newName;
            } else {
                delete gifNames[url];
            }
            saveCategories();
            renderGifs();
            $modal.remove();
        });

        $modal.find('.btn-cancel').on('click', () => {
            $modal.remove();
        });

        $input.on('keypress', (e) => {
            if (e.which === 13) {
                $modal.find('.btn-save').trigger('click');
            }
        });

        $modal.on('click', (e) => {
            if ($(e.target).hasClass('lzt-gif-rename-modal')) {
                $modal.remove();
            }
        });
    }

    function addGifItem(url, isPinned = false) {
        if (!$grid) {
            createSidebar();
            if ($sidebar.find('.lzt-gif-empty').length) {
                $sidebar.find('.lzt-gif-content').html('<div class="lzt-gif-grid"></div>');
            }
            $grid = $sidebar.find('.lzt-gif-grid');
        }

        const isCurrentlyPinned = pinnedGifs.has(url);
        const gifName = gifNames[url] || '';
        const $item = $(`
            <div class="lzt-gif-item">
                <div class="lzt-gif-item-wrapper">
                    <img src="${url}" loading="lazy">
                    ${gifName ? `<div class="lzt-gif-name">${gifName}</div>` : ''}
                </div>
                <div class="lzt-gif-pin ${isCurrentlyPinned ? 'pinned' : ''}">${PIN_ICON}</div>
                <div class="lzt-gif-delete">×</div>
            </div>
        `).appendTo($grid);

        $item.find('img').on('click', () => {
            const $input = $(`${chatTag} .editor-box.editor-content p`);
            if ($input.length) {
                $input.text(url);
                setTimeout(() => $(`${chatTag} [aria-label="send-message"]`).trigger('click'), 200);
            }
        });

        $item.on('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showRenameModal(url);
        });

        $item.find('.lzt-gif-pin').on('click', e => {
            e.stopPropagation();
            if (pinnedGifs.has(url)) {
                pinnedGifs.delete(url);
                $item.find('.lzt-gif-pin').removeClass('pinned');
            } else {
                pinnedGifs.add(url);
                $item.find('.lzt-gif-pin').addClass('pinned');
            }
            saveCategories();
            renderGifs();
        });

        $item.find('.lzt-gif-delete').on('click', e => {
            e.stopPropagation();
            myGifs.delete(url);
            pinnedGifs.delete(url);
            delete gifNames[url];
            saveCategories();
            $item.remove();

            if (myGifs.size === 0) {
                $sidebar.find('.lzt-gif-content')
                    .html(`<div class="lzt-gif-empty">Пока пусто<br><small style="color:#666;">ПКМ → Сохранить GIF</small></div>`);
                $grid = null;
            }
        });
    }

    function downloadConfig() {
        if (!userId) {
            getUser();
        }

        if (!userId) {
            alert('Не удалось определить пользователя');
            return;
        }

        const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });
        const category = categoriesData.categories.find(c => c.id === userId);

        if (!category) {
            alert('Не найдена ваша категория');
            return;
        }

        const config = {
            id: category.id,
            avatar: category.avatar,
            gifs: Array.from(category.gifs || []),
            pinnedGifs: Array.from(category.pinnedGifs || []),
            gifNames: category.gifNames || {}
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lzt-gif-config-${category.id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function uploadConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const config = JSON.parse(event.target.result);

                    if (!config.id || !config.avatar || !Array.isArray(config.gifs)) {
                        alert('Неверный формат конфига');
                        return;
                    }

                    const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });
                    const existingIndex = categoriesData.categories.findIndex(c => c.id === config.id);

                    if (existingIndex >= 0) {
                        categoriesData.categories[existingIndex] = {
                            id: config.id,
                            avatar: config.avatar,
                            gifs: config.gifs,
                            pinnedGifs: config.pinnedGifs || [],
                            gifNames: config.gifNames || {}
                        };
                    } else {
                        categoriesData.categories.push({
                            id: config.id,
                            avatar: config.avatar,
                            gifs: config.gifs,
                            pinnedGifs: config.pinnedGifs || [],
                            gifNames: config.gifNames || {}
                        });
                    }

                    GM_setValue(CATEGORIES_KEY, categoriesData);

                    switchCategory(config.id);
                } catch (error) {
                    alert('Ошибка при загрузке конфига: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function getUser() {
        const $avatar = $('[class*="navTab--visitorAvatar"]');
        if ($avatar.length) {
            userAvatar = $avatar.attr('src') || '';
            userId = userAvatar.split('/').pop().split('.')[0] || '';
        } else {
            const $avatar2 = $('img[src*="avatar"]').first();
            if ($avatar2.length) {
                userAvatar = $avatar2.attr('src') || '';
                userId = userAvatar.split('/').pop().split('.')[0] || '';
            }
        }

        const categoriesData = GM_getValue(CATEGORIES_KEY, { categories: [], currentCategoryId: null });
        if (userId && !categoriesData.categories.find(c => c.id === userId)) {
            categoriesData.categories.push({
                id: userId,
                avatar: userAvatar || 'https://nztcdn.com/avatar/s/1762619748/5941085.webp',
                gifs: [],
                pinnedGifs: [],
                gifNames: {}
            });
            if (!currentCategoryId) {
                currentCategoryId = userId;
                categoriesData.currentCategoryId = userId;
                myGifs = new Set();
            }
            GM_setValue(CATEGORIES_KEY, categoriesData);
        }
    }

    function addButton() {
        if ($('#lzt-gif-btn').length) return;

        const $wrapper = $(`${chatTag} .editor-box-wrapper`);
        if (!$wrapper.length) return;

        $('<div>', {
            id: 'lzt-gif-btn',
            title: 'Мои избранные GIF',
            html: SVG_ICON
        }).on('click', e => {
            e.stopPropagation();
            createSidebar();
            $sidebar?.toggleClass('open');
        }).prependTo($wrapper);
    }

    $(document).on('mousedown', '.chat2-message', function (e) {
        if (e.which !== 3) return;
        const $msg = $(this);

        setTimeout(() => {
            const $menu = $(`.message-actions ul:visible`).last();
            if (!$menu.length) return;

            const $img = $msg.find('img[title="[IMG]"]').first();
            if (!$img.length) return;

            let url = $img.closest('a').data('url') || $img.attr('src') || $img.data('url');
            if (!url || url.startsWith('//')) url = 'https:' + url;
            if (myGifs.has(url)) return;

            $menu.find('.lzt-gif-add').remove();

            const $li = $menu.find('li').first().clone().addClass('lzt-gif-add').html(`
                <span class="Svg-Icon">
                    ${SVG_ICON} Сохранить GIF
                </span>
            `).on('click', () => {
                myGifs.add(url);
                saveCategories();
                addGifItem(url);
                $menu.find('.lzt-gif-add').remove();
            });

            $menu.append($li);
        }, 200);
    });

    $('.chat2-button-close').on('click', () => {
        $sidebar = null;
    });

    const observer = new MutationObserver(() => {
        if ($(chatTag).length && !$sidebar) createSidebar();
        if ($(`${chatTag} .editor-box-wrapper`).length && !$('#lzt-gif-btn').length) addButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        getUser();
        createSidebar();
        addButton();
    }, 2000);

})();

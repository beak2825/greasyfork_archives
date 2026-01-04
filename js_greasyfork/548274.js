// ==UserScript==
// @name         Nyaa Linker
// @namespace    https://github.com/po5
// @version      2.3.0
// @description  Adds a button to Anime and Manga database websites that opens a relevant Nyaa search
// @author       Metacor, eva
// @match        *://*.myanimelist.net/*
// @match        *://*.anilist.co/*
// @match        *://*.kitsu.app/*
// @match        *://*.anime-planet.com/*
// @match        *://*.animenewsnetwork.com/encyclopedia/*
// @match        *://*.anidb.net/*
// @match        *://*.livechart.me/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548274/Nyaa%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/548274/Nyaa%20Linker.meta.js
// ==/UserScript==

// GreaseMonkey 4.x shim
let getValue;
if (typeof GM_getValue === 'undefined' && typeof GM !== 'undefined') {
    self.GM_setValue = GM.setValue;
    self.GM_registerMenuCommand = GM.registerMenuCommand;
    getValue = GM.getValue;
} else {
    getValue = function(key, fallback) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(GM_getValue(key, fallback));
            }
            catch(e) {
                reject(e);
            }
        });
    };
}

let settings;

const defaultSettings = {
    filter_setting: '0',
    category_setting: '1_2',
    query_setting: 'default',
    sort_setting: 'seeders',
    order_setting: 'desc',
    hide_button_setting: false,
    focus_setting: false,
    custom_text_toggle_setting: false,
    custom_text_setting: '',
    hotkey_key_setting: '',
    hotkey_modifier_setting: '',
    hotkey_query_setting: 'inherit',
};

if (typeof GM_registerMenuCommand !== 'undefined') {
    GM_registerMenuCommand('Nyaa Linker Settings', () => {
        if (document.getElementById('nyaa-linker-settings')) return;
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'nyaa-linker-settings';
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = '50%';
        settingsPanel.style.left = '50%';
        settingsPanel.style.transform = 'translate(-50%, -50%)';
        settingsPanel.style.backgroundColor = 'var(--clrDark, hsl(0, 0%, 10%))';
        settingsPanel.style.color = 'var(--clrLight, hsl(0, 0%, 87%))';
        settingsPanel.style.padding = '20px';
        settingsPanel.style.border = '1px solid var(--clrAccent, hsl(210, 100%, 60%))';
        settingsPanel.style.zIndex = '10000';
        settingsPanel.style.overflow = 'hidden';
        settingsPanel.style.fontFamily = 'Verdana, Arial';
        settingsPanel.style.fontSize = '11px';
        settingsPanel.style.lineHeight = '16px';

        settingsPanel.innerHTML = `
            <style>
                #nyaa-linker-settings {
                    --clrDark: hsl(0, 0%, 10%);
                    --clrLight: hsl(0, 0%, 87%);
                    --clrAccent: hsl(210, 100%, 60%);
                }
                #nyaa-linker-settings,
                #nyaa-linker-settings::before,
                #nyaa-linker-settings::after,
                #nyaa-linker-settings *,
                #nyaa-linker-settings *::before,
                #nyaa-linker-settings *::after {
                    all: revert;
                }
                #nyaa-linker-settings *,
                #nyaa-linker-settings *::before,
                #nyaa-linker-settings *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    border: none;
                    font-size: 11px;
                }
                #nyaa-linker-settings-parametersPage,
                #nyaa-linker-settings-settingsPage {
                    display: grid;
                    grid-template-columns: auto auto;
                    gap: 2px;
                    padding: 2px 0 2px 2px;
                    text-align: right;
                }
                #nyaa-linker-settings-settingsPage {
                    border: 1px solid var(--clrAccent);
                    border-top: none;
                    padding-left: 25px;
                }
                #nyaa-linker-settings button,
                #nyaa-linker-settings input,
                #nyaa-linker-settings select,
                #nyaa-linker-settings option {
                    cursor: pointer;
                    text-align: center;
                    height: 21px;
                }
                #nyaa-linker-settings select,
                #nyaa-linker-settings-saveButton,
                #nyaa-linker-settings-hotkey_key_select,
                #nyaa-linker-settings-custom_text_select {
                    background: var(--clrAccent);
                    color: var(--clrDark);
                }
                #nyaa-linker-settings option,
                #nyaa-linker-settings-settingsPage {
                    background: var(--clrDark);
                    color: var(--clrAccent);
                }
                #nyaa-linker-settings-bottomButtons {
                    display: flex;
                    gap: 2px;
                }
                #nyaa-linker-settings-saveButton {
                    flex: 11;
                }
                #nyaa-linker-settings-settingsButton {
                    background: var(--clrAccent) url('https://upload.wikimedia.org/wikipedia/commons/5/58/Ic_settings_48px.svg') no-repeat 0 0 / contain;
                    flex: 1;
                }
                #nyaa-linker-settings-hotkey_key_select,
                #nyaa-linker-settings input[type='checkbox'] {
                    width: 21px;
                    justify-self: left;
                }
                #nyaa-linker-settings-hotkey_modifier_select,
                #nyaa-linker-settings-hotkey_query_select,
                #nyaa-linker-settings-custom_text_select {
                    width: 98%;
                }
            </style>
            <div id="nyaa-linker-settings-parametersPage">
                <label for="filter_select">Filter:</label>
                <select id="filter_select">
                    <option value="0">No Filter</option>
                    <option value="1">No Remakes</option>
                    <option value="2">Trusted Only</option>
                </select>
                <label for="category_select">Category:</label>
                <select id="category_select">
                    <option value="0_0">All Categories</option>
                    <option value="1_2">English-Translated</option>
                    <option value="1_3">Non-English-Translated</option>
                    <option value="1_4">Raw</option>
                </select>
                <label for="query_select">Query:</label>
                <select id="query_select">
                    <option value="default" title="Creates a search using both the 'Exact' and 'Base' options">Default</option>
                    <option value="fuzzy" title="Searches for the site's default title only, without quotes — allows fuzzy matching">Fuzzy</option>
                    <option value="exact" title="Japanese and English full titles — searches for exact title names as written">Exact</option>
                    <option value="base" title="Japanese and English base titles — searches with Seasons and Parts removed">Base</option>
                </select>
                <label for="sort_select">Sort:</label>
                <select id="sort_select">
                    <option value="comments">Comments</option>
                    <option value="size">Size</option>
                    <option value="id">Date</option>
                    <option value="seeders">Seeders</option>
                    <option value="leechers">Leechers</option>
                    <option value="downloads">Downloads</option>
                </select>
                <label for="order_select">Order:</label>
                <select id="order_select">
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
            <div id="nyaa-linker-settings-bottomButtons">
                <button id="nyaa-linker-settings-saveButton">Save and Close</button>
            </div>
            <div id="nyaa-linker-settings-settingsPage">
                <label for="hide_button_select">Hide Button:</label>
                <input type="checkbox" id="hide_button_select" title="Stops the 'Search on Nyaa' button from being rendered">
                <label for="focus_select">Maintain Focus:</label>
                <input type="checkbox" id="focus_select" title="Changes Tab Focus behavior when using the Hotkey">
                <label for="custom_text_toggle_select">Include Text:</label>
                <input type="checkbox" id="custom_text_toggle_select" title="Decides if text in 'Custom Query' is included">
                <label for="custom_text_select">Custom Text:</label>
                <input type="text" placeholder="?" id="custom_text_select" title="User defined text to be added at the end of the search query">
                <label for="hotkey_key_select">Hotkey:</label>
                <input type="text" maxlength="1" placeholder="?" id="hotkey_key_select">
                <label for="hotkey_modifier_select">Hotkey Modifier:</label>
                <select id="hotkey_modifier_select">
                    <option value="">None</option>
                    <option value="shiftKey">Shift</option>
                    <option value="ctrlKey">Control</option>
                    <option value="altKey">Alt</option>
                </select>
                <label for="hotkey_query_select">Hotkey Query:</label>
                <select id="hotkey_query_select">
                    <option value="inherit" title="Inherits its behavior from the Query option on the primary settings page">Inherit</option>
                    <option value="default" title="Creates a search using both the 'Exact' and 'Base' options">Default</option>
                    <option value="fuzzy" title="Searches for the site's default title only, without quotes — allows fuzzy matching">Fuzzy</option>
                    <option value="exact" title="Japanese and English full titles — searches for exact title names as written">Exact</option>
                    <option value="base" title="Japanese and English base titles — searches with Seasons and Parts removed">Base</option>
                </select>
            </div>
        `;

        document.body.appendChild(settingsPanel);

        document.getElementById('filter_select').value = settings.filter_setting;
        document.getElementById('category_select').value = settings.category_setting;
        document.getElementById('query_select').value = settings.query_setting;
        document.getElementById('sort_select').value = settings.sort_setting;
        document.getElementById('order_select').value = settings.order_setting;
        document.getElementById('hide_button_select').checked = settings.hide_button_setting;
        document.getElementById('focus_select').checked = settings.focus_setting;
        document.getElementById('custom_text_toggle_select').checked = settings.custom_text_toggle_setting;
        document.getElementById('custom_text_select').value = settings.custom_text_setting;
        document.getElementById('hotkey_key_select').value = settings.hotkey_key_setting;
        document.getElementById('hotkey_modifier_select').value = settings.hotkey_modifier_setting;
        document.getElementById('hotkey_query_select').value = settings.hotkey_query_setting;

        document.getElementById('nyaa-linker-settings-saveButton').onclick = () => {
            const newSettings = {
                filter_setting: document.getElementById('filter_select').value,
                category_setting: document.getElementById('category_select').value,
                query_setting: document.getElementById('query_select').value,
                sort_setting: document.getElementById('sort_select').value,
                order_setting: document.getElementById('order_select').value,
                hide_button_setting: document.getElementById('hide_button_select').checked,
                focus_setting: document.getElementById('focus_select').checked,
                custom_text_toggle_setting: document.getElementById('custom_text_toggle_select').checked,
                custom_text_setting: document.getElementById('custom_text_select').value,
                hotkey_key_setting: document.getElementById('hotkey_key_select').value.toLowerCase(),
                hotkey_modifier_setting: document.getElementById('hotkey_modifier_select').value,
                hotkey_query_setting: document.getElementById('hotkey_query_select').value,
            };
            GM_setValue('settings', newSettings);
            settings = newSettings;
            settingsPanel.remove();
            document.querySelectorAll('.nyaaBtn').forEach((e) => e.remove());
            init();
        };
    });
}

let btn, currentPage, hotkeyListener;

function init() {
    searchNyaa(settings);
}

function searchNyaa(settings) {
    const domain = window.location.href;
    let media = window.location.pathname.includes('manga') ? 'manga' : 'anime';
    let titleJap, titleEng, btnSpace, cardType, cardFlag, isSpicy;
    let categorySetting = settings.category_setting;
    let queryType = settings.query_setting;
    let customQuery = settings.custom_text_toggle_setting ? settings.custom_text_setting : '';

    const setCategory = (cat) => {
        if (media === 'manga') {
            const categories = { '0_0': '3_0', '1_2': '3_1', '1_3': '3_2', '1_4': '3_3' };
            return categories[cat];
        } else {
            return cat;
        }
    };

    categorySetting = setCategory(settings.category_setting);

    function createBtn(btnSpace) {
        !cardFlag && document.querySelector('.nyaaBtn') && document.querySelectorAll('.nyaaBtn').forEach((e) => e.remove()), (cardFlag = true);
        btn = btnSpace.appendChild(document.createElement('a'));
        btn.classList.add('nyaaBtn');
        settings.hide_button_setting && (btn.style.display = 'none');
        !cardType && settings.hotkey_key_setting && startHotkeyListener();
    }

    function createSearch(query) {
        let subDomain, siteText;
        isSpicy
            ? ((subDomain = 'sukebei.'), (siteText = 'Sukebei'), media === 'manga' ? (categorySetting = '0_0') : (categorySetting = '1_1'))
            : ((subDomain = ''), (siteText = 'Nyaa'));

        !btn.title && (btn.textContent = `Search on ${siteText}`);
        (query.includes('&') || query.includes('+')) && (query = query.replace(/&/g, '%26').replace(/\+/g, '%2B'));
        btn.href = `https://${subDomain}nyaa.si/?f=${settings.filter_setting}&c=${categorySetting}&q=${query}${customQuery}&s=${settings.sort_setting}&o=${settings.order_setting}`;
        btn.target = '_blank';
    }

    function startHotkeyListener() {
        hotkeyListener && document.removeEventListener('keydown', hotkeyListener);
        hotkeyListener = (e) => {
            if (
                (btn && e[settings.hotkey_modifier_setting] && e.key.toLowerCase() === settings.hotkey_key_setting) ||
                (btn && settings.hotkey_modifier_setting === '' && !e.ctrlKey && !e.shiftKey && !e.altKey && e.key === settings.hotkey_key_setting)
            ) {
                if (settings.hotkey_query_setting !== 'inherit') {
                    queryType = settings.hotkey_query_setting;
                    createSearch(getQuery(titleJap, titleEng, queryType));
                }
                btn.dispatchEvent(new MouseEvent('click', { ctrlKey: settings.focus_setting }));
                e.preventDefault();
                queryType = settings.query_setting;
                createSearch(getQuery(titleJap, titleEng, queryType));
            }
        };
        document.addEventListener('keydown', hotkeyListener);
    }

    switch (true) {
        case domain.includes(`myanimelist.net`):
            media = window.location.href.split('/')[3];
            categorySetting = setCategory(settings.category_setting);
            const malMain = new RegExp(`myanimelist\\.net/${media}/\\d+`);
            if (malMain.test(domain)) {
                const engCheck = document.querySelector('.title-english');
                engCheck && (titleEng = engCheck.textContent);

                if (media === 'manga') {
                    const titleElm = document.querySelector('[itemprop="name"]');
                    titleJap = titleElm.textContent;
                    if (engCheck) {
                        engCheck.textContent = '';
                        titleJap = titleElm.textContent;
                        engCheck.textContent = titleEng;
                    }
                } else {
                    titleJap = document.querySelector('.title-name').textContent;
                }

                isSpicy = [...document.querySelectorAll('span[itemprop="genre"]')].some((el) => el.textContent.trim().toLowerCase() === 'hentai');

                btnSpace = document.getElementById('broadcast-block') || document.querySelector('.leftside').children[0];
                createBtn(btnSpace);
                btn.style.marginTop = '4px';
                btn.classList.add('left-info-block-broadcast-button');
                createSearch(getQuery(titleJap, titleEng, queryType));
            }

            const cardPaths = ['/genre', '/season', '/magazine', '/adapted'];
            if (cardPaths.some((path) => domain.includes(path))) {
                if (domain.includes('/adapted') && document.querySelector('.list.on')) return;

                for (const card of document.querySelectorAll('.seasonal-anime')) {
                    cardType = true;
                    titleJap = card.querySelector('.title h2').innerText;
                    titleEng = card.querySelector('.title h3')?.innerText;
                    isSpicy = [...card.querySelectorAll('.explicit a')].some((el) => el.title.toLowerCase().includes('hentai'));
                    !isSpicy && (categorySetting = setCategory(settings.category_setting));

                    createBtn(card.querySelector('.broadcast'));
                    btn.title = 'Search on Nyaa';
                    btn.style.background = 'url(https://i.imgur.com/9Fr2BRG.png) center/20px no-repeat';
                    btn.style.padding = '0 11px';
                    isSpicy && ((btn.title = 'Search on Sukebei'), (btn.style.border = '2px solid red'), (btn.style.borderRadius = '50%'));
                    createSearch(getQuery(titleJap, titleEng, queryType));
                }
            }
            break;

        case (domain.includes(`anime-planet.com/anime/`) || domain.includes(`anime-planet.com/manga/`)) && domain.split("/").pop() !== '':
            media = window.location.href.split('/')[3];
            categorySetting = setCategory(settings.category_setting);
            const skipPages = ['all', 'top-', 'recommendations', 'tags'];
            let skipExtra =
                media == 'anime' ? ['seasons', 'watch-online', 'studios'] : ['read-online', 'publishers', 'magazines', 'webtoons', 'light-novels'];

            if (skipPages.some((page) => domain.includes(`/${media}/${page}`)) || skipExtra.some((page) => domain.includes(`/${media}/${page}`))) {
                break;
            }

            setTimeout(() => {
                const titleMain = document.querySelector('[itemprop=name]').textContent;
                const titleAlt = document.getElementsByClassName('aka')[0];
                titleEng = titleMain;
                titleAlt ? (titleJap = titleAlt.innerText.split(': ').pop()) : (titleJap = titleMain);

                createBtn(document.querySelector('.mainEntry'));
                btn.classList.add('button');
                document.querySelectorAll('.mainEntry > .button').forEach((button) => {
                    typeof button === 'object' && (button.style.width = '180px');
                });
                createSearch(getQuery(titleJap, titleEng, queryType));
            }, 50);
            break;

        case domain.includes(`animenewsnetwork.com/encyclopedia/anime.php?id=`) || domain.includes(`animenewsnetwork.com/encyclopedia/manga.php?id=`):
            media = domain.includes(`animenewsnetwork.com/encyclopedia/anime.php?id=`) ? 'anime' : 'manga';
            categorySetting = setCategory(settings.category_setting);
            setTimeout(() => {
                titleEng = document.getElementById('page_header').innerText.split(' (').shift();
                for (const altTitle of document.querySelectorAll('#infotype-2 > .tab')) {
                    altTitle.textContent.includes('Japanese') && !titleJap && (titleJap = altTitle.textContent.split(' (').shift());
                }
                !titleJap && titleEng && (titleJap = titleEng);

                btnSpace = document.querySelector('.fright') ? document.querySelector('.fright') : document.querySelector('#big-video');
                createBtn(btnSpace);
                btn.style.display !== 'none' && (btn.style.display = 'flex');
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.height = '35px';
                btn.style.borderRadius = '3px';
                btn.style.background = '#2d50a7';
                btn.style.color = '#fff';
                btn.style.border = '1px solid black';
                btn.style.textDecoration = 'none';
                btnSpace.children[0].tagName === 'TABLE' && (btn.style.marginTop = '4px');
                createSearch(getQuery(titleJap, titleEng, queryType));
            }, 50);
            break;

        case domain.includes(`anidb.net/anime/`) || domain.includes(`anidb.net/manga/`):
            media = window.location.href.split('/')[3];
            categorySetting = setCategory(settings.category_setting);
            const hasID = /anidb\.net\/\w+\/(\d+)/;
            if (domain.match(hasID)) {
                titleJap = document.querySelector(".value > [itemprop='name']").textContent;
                titleEng = document.querySelector(".value > [itemprop='alternateName']").textContent;

                isSpicy = [...document.querySelectorAll('.tagname')].some((el) => el.textContent.trim().toLowerCase() === '18 restricted');

                btnSpace = document.querySelector('.resources > .value .english').appendChild(document.createElement('div'));
                btnSpace.classList.add('icons');
                createBtn(btnSpace);
                btn.classList.add('i_icon');
                btn.style.backgroundImage = "url('https://i.imgur.com/YG6H2nF.png')";
                btn.style.backgroundSize = 'contain';
                isSpicy ? (btn.title = 'Search on Sukebei') : (btn.title = 'Search on Nyaa');
                createSearch(getQuery(titleJap, titleEng, queryType));
            }
            break;

        case domain.includes(`anilist.co/anime/`) || domain.includes(`anilist.co/manga/`):
            media = window.location.href.split('/')[3];
            categorySetting = setCategory(settings.category_setting);
            awaitLoadOf('.sidebar .type', 'Romaji', () => {
                for (const data of document.getElementsByClassName('type')) {
                    const setTitle = data.parentNode.children[1].textContent;
                    data.textContent.includes('Romaji') && (titleJap = setTitle);
                    data.textContent.includes('English') && (titleEng = setTitle);
                    data.textContent.includes('Genres') ? (isSpicy = setTitle.toLowerCase().includes('hentai')) : null;
                }

                createBtn(document.querySelector('.cover-wrap-inner'));
                btn.style.display !== 'none' && (btn.style.display = 'flex');
                btn.style.alignItems = 'center';
                btn.style.justifyContent = 'center';
                btn.style.height = '35px';
                btn.style.borderRadius = '3px';
                btn.style.marginBottom = '20px';
                btn.style.background = 'rgb(var(--color-blue))';
                btn.style.color = 'rgb(var(--color-white))';
                createSearch(getQuery(titleJap, titleEng, queryType));
            });
            break;

        case domain.includes(`kitsu.app/anime/`) || domain.includes(`kitsu.app/manga/`):
            media = window.location.href.split('/')[3];
            categorySetting = setCategory(settings.category_setting);
            awaitLoadOf('.media--information', 'Status', () => {
                let titleUsa;
                document.querySelector('a.more-link')?.click();
                for (const data of document.querySelectorAll('.media--information > ul > li')) {
                    const usaCheck = data.textContent.includes('English (American)');
                    const setTitle = data.getElementsByTagName('span')[0];
                    data.textContent.includes('Japanese (Romaji)') && (titleJap = setTitle.textContent);
                    data.textContent.includes('English') && !usaCheck && (titleEng = setTitle.textContent);
                    usaCheck && (titleUsa = setTitle.textContent);
                    if (data.textContent.includes('Rating')) {
                        isSpicy = data.querySelector('span')?.textContent.replace(/\s+/g, ' ').trim() === 'R18 - Hentai';
                    }
                }
                document.querySelector('a.more-link')?.click();

                !titleEng && titleUsa && (titleEng = titleUsa);
                !titleJap && titleEng && (titleJap = titleEng);

                createBtn(document.querySelector('.library-state'));
                btn.classList.add('button', 'button--secondary');
                btn.style.background = '#f5725f';
                btn.style.marginTop = '10px';
                createSearch(getQuery(titleJap, titleEng, queryType));
            });
            break;

        case domain.includes('livechart.me'):
            media = "anime";
            categorySetting = setCategory(settings.category_setting);
            if (domain.includes(`livechart.me/${media}/`)) {
                titleJap = document.querySelector('.grow .text-xl').innerText;
                titleEng = document.querySelector('.grow .text-lg').innerText;

                createBtn(document.querySelector('.lc-poster-col'));
                btn.classList.add('lc-btn', 'lc-btn-sm', 'lc-btn-outline');
                createSearch(getQuery(titleJap, titleEng, queryType));
            } else {
                let cardSelector, cardSpace;
                domain.includes('livechart.me/franchises/') ? (cardSelector = '.lc-anime') : (cardSelector = '.anime');
                domain.includes('livechart.me/franchises/') ? (cardSpace = '.lc-anime-card--related-links') : (cardSpace = '.related-links');

                for (const card of document.querySelectorAll(cardSelector)) {
                    cardType = true;
                    titleJap = card.getAttribute('data-romaji');
                    card.getAttribute('data-english') ? (titleEng = card.getAttribute('data-english')) : (titleEng = undefined);

                    createBtn(card.querySelector(cardSpace));
                    btn.style.background = 'url(https://i.imgur.com/9Fr2BRG.png) center/20px no-repeat';
                    btn.style.padding = '15px';
                    btn.style.margin = 0;
                    btn.classList.add('action-button');
                    btn.title = 'Search on Nyaa';
                    createSearch(getQuery(titleJap, titleEng, queryType));
                }
            }
            break;
    }
}

function getQuery(titleJap, titleEng, queryType) {
    !titleJap && !titleEng && init();
    titleJap && (titleJap = titleJap.replace(/["]/g, ''));
    titleEng && (titleEng = titleEng.replace(/["]/g, ''));
    let query = `"${titleJap}"|"${titleEng}"`;

    if (!titleEng || titleJap.toLowerCase() === titleEng.toLowerCase()) {
        query = titleJap;
        return query;
    } else {
        let baseJap = getBaseTitle(titleJap);
        let baseEng = getBaseTitle(titleEng);

        if (queryType == 'default') {
            baseJap == titleJap && baseEng == titleEng ? (query = query) : (query = `"${titleJap}"|"${titleEng}"|"${baseJap}"|"${baseEng}"`);
        }

        if (queryType == 'base') {
            baseJap == baseEng ? (query = query) : (query = `"${baseJap}"|"${baseEng}"`);
        }

        queryType == 'fuzzy' && (query = titleJap);
        return query;
    }
}

function getBaseTitle(baseTitle) {
    const hasSeason = /(?<![\w])(season)(?![\w])/i;
    const hasNum = /(?<![\w])[0-9]+(?:st|[nr]d|th)(?![\w])/i;
    const hasWord = /(?<![\w])(first|second|third|fourth|fifth|(the final|final))(?![\w])/i;
    const hasPart = /(?<![\w])(part )/i;
    const hasEndPunc = /[?!.]$/;

    baseTitle = baseTitle
        .replace(/[\(\)\[\]\{\}][^()\[\]\{\}]*[\)\]\{\}]/g, '')
        .replace(/([♡♥☆★♪∞])(?=\w)/g, ' ')
        .replace(/[♡♥☆★♪∞](?!\w)/g, '')
        .trim();

    baseTitle.includes(': ') && (baseTitle = baseTitle.split(': ').shift());
    baseTitle.includes(' - ') && (baseTitle = baseTitle.split(' - ').pop());
    hasPart.test(baseTitle) && (baseTitle = baseTitle.split(/( part)/i).shift());

    if (hasSeason.test(baseTitle)) {
        if (hasNum.test(baseTitle) || hasWord.test(baseTitle)) {
            let titleNum, titleWord;
            hasNum.test(baseTitle) && (titleNum = baseTitle.match(hasNum)[0]);
            hasWord.test(baseTitle) && (titleWord = baseTitle.match(hasWord)[0]);
            titleNum && (baseTitle = baseTitle.split(` ${titleNum}`).shift());
            titleWord && (baseTitle = baseTitle.split(` ${titleWord}`).shift());
        } else {
            baseTitle = baseTitle.split(/( season)/i).shift();
        }
    }

    while (hasEndPunc.test(baseTitle)) {
        baseTitle = baseTitle.split(baseTitle.match(hasEndPunc)[0]).shift();
    }

    return baseTitle;
}

const awaitLoadOf = (selector, text, func) => {
    return new Promise((resolve) => {
        let found = false;
        const elmspre = document.querySelectorAll(selector);
        elmspre.forEach((elm) => {
            if (found) return;
            if (elm.textContent.includes(text)) {
                found = true;
                resolve(elm);
                func();
            }
        });
        if (found) return;
        const mutObs = new MutationObserver(() => {
            const elms = document.querySelectorAll(selector);
            elms.forEach((elm) => {
                if (found) return;
                if (elm.textContent.includes(text)) {
                    found = true;
                    resolve(elm);
                    mutObs.disconnect();
                    func();
                }
            });
        });
        mutObs.observe(document.body, { childList: true, subtree: true });
    });
};

getValue('settings', defaultSettings).then((v) => {
    settings = v;
    currentPage = window.location.href.split('/')[4];
    init();

    const observer = new MutationObserver(() => {
        if (window.location.href.split('/')[4] !== currentPage) {
            currentPage = window.location.href.split('/')[4];
            document.querySelectorAll('.nyaaBtn').forEach((e) => e.remove());
            init();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});

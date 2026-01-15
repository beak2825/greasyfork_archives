// ==UserScript==
// @name         Anna's Archive Downloader
// @namespace    http://tampermonkey.net/
// @version      2026-01-09
// @description  Download all books in the search result.
// @author       You
// @license      GPL-3.0 License
// @match        https://annas-archive.li/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=annas-archive.li
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/562571/Anna%27s%20Archive%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562571/Anna%27s%20Archive%20Downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const SERVER = 'Slow Partner Server #5';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pause() {
        return sleep(random(1000, 2000));
    }

    const STATE_KEY = 'downloadState';
    let state;
    loadState();

    if (downloadInProgress()) {
        await pause();
        await start();
    } else if (window.location.pathname === '/search') {
        addDownloadButton();
    }

    async function start() {
        const pathname = window.location.pathname;
        if (pathname === '/search') {
            if (!await clickNextBook()) {
                await clickNextPage();
            }
        } else if (pathname.indexOf('/md5/') >= 0) {
            await clickDownloadServer();
        } else if (pathname.indexOf('/slow_download/') >= 0) {
            await clickDownload();
            await navigateToSearch();
        }
    }

    function addDownloadButton() {
        const searchBtn = document.querySelector('.w-full .mb-2 BUTTON[type="submit"]');
        if (!searchBtn || searchBtn.innerText != 'Search') return;

        const downloadBtn = document.createElement('BUTTON');
        downloadBtn.classList = searchBtn.classList;
        downloadBtn.style.marginLeft = '10px';
        downloadBtn.innerText = 'Download All';
        downloadBtn.addEventListener('click', start);
        searchBtn.parentElement.appendChild(downloadBtn);
    }

    function downloadInProgress() {
        return Date.now() - state.lastUpdateTimeMs < 180000;
    }

    function loadState() {
        state = JSON.parse(GM_getValue(STATE_KEY, '{}'));
        if (!downloadInProgress()) {
            state = {processed: []};
        }
    }

    function saveState() {
        state.lastUpdateTimeMs = Date.now();
        GM_setValue(STATE_KEY, JSON.stringify(state));
    }

    async function clickNextBook() {
        const links = document.querySelectorAll('.js-aarecord-list-outer > DIV > DIV > DIV:nth-of-type(1) > A:nth-of-type(1)');
        for (let link of links) {
            if (!state.processed.includes(link.href)) {
                state.processed.push(link.href);
                state.lastSearchPage = window.location.href;
                saveState();
                await pause();
                link.click();
                return true;
            }
        }
        return false;
    }

    async function clickNextPage() {
        const next = document.querySelector('DIV > NAV > A:last-of-type');
        if (!next || next.innerText !== 'Next') return;
        await pause();
        next.click();
    }

    async function clickDownloadServer() {
        const link = Array.from(document.querySelectorAll('#md5-panel-downloads A')).filter(a => a.textContent.indexOf(SERVER) >= 0)[0];
        if (link) {
            await pause();
            link.click();
        }
    }

    async function clickDownload() {
        const link = Array.from(document.querySelectorAll('.main-inner P A')).filter(a => a.textContent.indexOf('Download now') >= 0)[0];
        if (link) {
            await pause();
            link.click();
        }
    }

    async function navigateToSearch() {
        await pause();
        window.location.href = state.lastSearchPage;
    }
})();
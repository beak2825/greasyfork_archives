// ==UserScript==
// @name         A Better Recent Threads for Lost Media Wiki Forums
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  A clean, consolidated view of all recent threads with live search, sorting, and no-flash loading.
// @author       Ghosty-Tongue
// @match        https://forums.lostmediawiki.com/user/*/recent_threads*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562591/A%20Better%20Recent%20Threads%20for%20Lost%20Media%20Wiki%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/562591/A%20Better%20Recent%20Threads%20for%20Lost%20Media%20Wiki%20Forums.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide original content immediately via CSS injection
    const style = document.createElement('style');
    style.innerHTML = `
        td.sidebarr-center-td { visibility: hidden !important; opacity: 0 !important; }
        .custom-loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #4a6a41;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        #main-content-wrapper { transition: opacity 0.5s ease-in-out; opacity: 1; }
        .fade-out { opacity: 0 !important; }
        .fade-in { opacity: 1 !important; }
        .item.thread:hover { background-color: rgba(0,0,0,0.05) !important; cursor: pointer; }
        .item.thread:hover .link.target a { text-decoration: underline !important; }
        .title-bar-flex { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .credit-text { font-size: 10px; opacity: 0.6; padding-right: 10px; font-weight: normal; text-transform: none; }
    `;
    document.documentElement.appendChild(style);

    const observer = new MutationObserver((mutations, obs) => {
        const targetCell = document.querySelector('td.sidebarr-center-td');
        if (targetCell) {
            obs.disconnect(); // Stop looking once found
            init(targetCell);
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    async function init(targetCell) {
        targetCell.innerHTML = `
            <div id="sidebarr-center">
                <div id="content" role="main">
                    <div class="container threads" id="main-content-wrapper">
                        <div class="title-bar">
                            <div class="title-bar-flex">
                                <h1>Recent Threads</h1>
                                <span class="credit-text">Credit: Ghosty-Tongue</span>
                            </div>
                        </div>
                        <div id="loading-area" style="padding: 60px; text-align: center; background: rgba(0,0,0,0.05);">
                            <div class="custom-loader"></div>
                            <div style="font-weight: bold; font-size: 1.2em; color: #333; margin-bottom: 10px;">Loading threads, please wait...</div>
                            <div style="font-size: 1em; color: #666;">
                                Pages: <span id="pages-checked">0</span> / <span id="total-pages">0</span><br>
                                Threads found: <span id="threads-found">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Show the cell now that our loading UI is inside it
        targetCell.style.setProperty('visibility', 'visible', 'important');
        targetCell.style.setProperty('opacity', '1', 'important');

        let allThreads = [];

        function getRelativeTime(timestamp) {
            const now = Math.floor(Date.now() / 1000);
            const diff = now - timestamp;
            if (diff < 60) return 'just now';
            if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
            if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
            if (diff < 2592000) return Math.floor(diff / 86400) + ' days ago';
            if (diff < 31536000) return Math.floor(diff / 2592000) + ' months ago';
            return Math.floor(diff / 31536000) + ' years ago';
        }

        async function fetchData() {
            const totalThreads = pb.data('lm_total') || 0;
            const threadsPerPage = parseInt(pb.data('lm_limit')) || 30;
            const totalPages = Math.ceil(totalThreads / threadsPerPage);
            const baseUrl = window.location.origin + window.location.pathname;

            document.getElementById('total-pages').innerText = totalPages;

            let gathered = [];
            for (let i = 1; i <= totalPages; i++) {
                const response = await fetch(`${baseUrl}?page=${i}`);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const dataScript = Array.from(doc.querySelectorAll('script')).find(s => s.innerText.includes('proboards.thread'));

                if (dataScript) {
                    const match = dataScript.innerText.match(/'proboards\.thread',\s*(\{.*?\})\s*\]\]\);/);
                    if (match) {
                        const pageThreads = JSON.parse(match[1]);
                        gathered = gathered.concat(Object.values(pageThreads));
                    }
                }
                document.getElementById('pages-checked').innerText = i;
                document.getElementById('threads-found').innerText = gathered.length;
            }
            return gathered;
        }

        function renderRows(threads) {
            return threads.map(t => {
                const dateStr = new Date(t.created_on * 1000).toLocaleDateString();
                const relativeStr = getRelativeTime(t.created_on);
                const replyCount = Math.max(0, parseInt(t.posts) - 1);
                return `
                <tr class="item thread" onclick="window.location.href='${t.url}'">
                    <td class="icon" style="width: 1%; padding: 5px 10px; white-space: nowrap;">
                        <img src="//storage.proboards.com/6020674/images/GBbzFzzEPYmXHefdGouM.png" style="vertical-align: middle;">
                    </td>
                    <td class="main clickable" style="padding: 5px 10px;">
                        <span class="link target">
                            <a href="${t.url}" style="font-weight: bold; color: inherit; text-decoration: none;" onclick="event.stopPropagation();">${t.subject}</a>
                        </span>
                    </td>
                    <td class="replies" style="text-align: center; width: 10%;">${replyCount}</td>
                    <td class="views" style="text-align: center; width: 10%;">${parseInt(t.views).toLocaleString()}</td>
                    <td class="latest last" style="text-align: right; padding-right: 15px; width: 25%; white-space: nowrap;">
                        <span>${dateStr}</span>
                        <span style="font-size: 0.85em; opacity: 0.7; margin-left: 8px;">(${relativeStr})</span>
                    </td>
                </tr>`;
            }).join('');
        }

        function updateDisplay() {
            const searchTerm = document.getElementById('threadSearch').value.toLowerCase();
            const sortVal = document.getElementById('threadSort').value;
            let filtered = allThreads.filter(t => t.subject.toLowerCase().includes(searchTerm));
            filtered.sort((a, b) => {
                if (sortVal === 'newest') return b.created_on - a.created_on;
                if (sortVal === 'oldest') return a.created_on - b.created_on;
                if (sortVal === 'replies') return parseInt(b.posts) - parseInt(a.posts);
                if (sortVal === 'views') return parseInt(b.views.toString().replace(/,/g, '')) - parseInt(a.views.toString().replace(/,/g, ''));
                return 0;
            });
            document.getElementById('threadBody').innerHTML = renderRows(filtered);
        }

        allThreads = await fetchData();
        const wrapper = document.getElementById('main-content-wrapper');
        wrapper.classList.add('fade-out');

        setTimeout(() => {
            wrapper.innerHTML = `
                <div class="title-bar">
                    <div class="title-bar-flex">
                        <h1>Recent Threads</h1>
                        <span class="credit-text">Credit: Ghosty-Tongue</span>
                    </div>
                </div>
                <div class="control-bar ui-helper-clearfix" style="padding: 10px; display: flex; gap: 15px; align-items: center; background: rgba(0,0,0,0.1);">
                    <input type="text" id="threadSearch" placeholder="Search subjects..." style="padding: 6px; flex-grow: 1; border: 1px solid #ccc; border-radius: 3px;">
                    <select id="threadSort" style="padding: 6px; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="replies">Most Replies</option>
                        <option value="views">Most Viewed</option>
                    </select>
                </div>
                <div class="content cap-bottom">
                    <table class="list" style="width: 100%; table-layout: auto; border-collapse: collapse;">
                        <thead>
                            <tr class="head">
                                <th class="icon" style="width: 1%;">&nbsp;</th>
                                <th class="main" style="text-align: left;">Subject</th>
                                <th class="replies">Replies</th>
                                <th class="views">Views</th>
                                <th class="latest last">Created</th>
                            </tr>
                        </thead>
                        <tbody id="threadBody"></tbody>
                    </table>
                </div>
            `;
            document.getElementById('threadSearch').addEventListener('input', updateDisplay);
            document.getElementById('threadSort').addEventListener('change', updateDisplay);
            updateDisplay();
            wrapper.classList.remove('fade-out');
            wrapper.classList.add('fade-in');
        }, 500);
    }
})();
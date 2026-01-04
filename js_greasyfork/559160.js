// ==UserScript==
// @name         GitHub Dashboard Explore & Trending
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Restores Explore widget with "k" notation for star counts and robust feed parsing.
// @author       Longlone & Gemini 3
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559160/GitHub%20Dashboard%20Explore%20%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/559160/GitHub%20Dashboard%20Explore%20%20Trending.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WIDGET_ID = 'gemini-dual-explore-widget';

    // 样式：保持大字体，增加一些微调
    GM_addStyle(`
        #${WIDGET_ID} { animation: fadeIn 0.3s ease-in-out; margin-bottom: 16px; }
        #${WIDGET_ID} .tab-btn {
            cursor: pointer; padding-bottom: 6px; border-bottom: 2px solid transparent;
            color: var(--fgColor-muted, #656d76); transition: all 0.2s; font-size: 14px;
        }
        #${WIDGET_ID} .tab-btn:hover { color: var(--fgColor-default, #1f2328); }
        #${WIDGET_ID} .tab-btn.active {
            color: var(--fgColor-default, #1f2328); border-bottom-color: var(--fgColor-accent, #0969da); font-weight: 600;
        }
        #${WIDGET_ID} .repo-link { font-size: 14px !important; line-height: 1.25; font-weight: 600; }
        #${WIDGET_ID} .repo-desc {
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
            margin-top: 4px; margin-bottom: 8px; font-size: 13px !important; line-height: 1.5; color: var(--fgColor-muted, #656d76);
        }
        #${WIDGET_ID} .repo-meta { font-size: 12px !important; color: var(--fgColor-muted, #656d76); white-space: nowrap; display: flex; align-items: center; }
        #${WIDGET_ID} .repo-list-container { min-height: 150px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    `);

    const STATE = {
        activeTab: 'explore',
        cache: { explore: null, trending: null },
        loading: { explore: false, trending: false }
    };

    // --- 工具：数字格式化 (1,234 -> 1.2k) ---
    function formatStars(rawStr) {
        if (!rawStr) return '';
        // 移除逗号和多余空格
        const cleanStr = rawStr.replace(/,/g, '').trim();

        // 如果已经是 k/m 结尾，直接返回
        if (cleanStr.toLowerCase().endsWith('k') || cleanStr.toLowerCase().endsWith('m')) {
            return cleanStr;
        }

        const num = parseFloat(cleanStr);
        if (isNaN(num)) return rawStr; // 解析失败则原样返回

        if (num >= 1000) {
            // 除以1000，保留1位小数，如果小数是.0则去掉
            return (num / 1000).toFixed(1).replace('.0', '') + 'k';
        }
        return num.toString();
    }

    async function init() {
        if (window.location.pathname !== '/' && window.location.pathname !== '/dashboard') return;
        if (document.getElementById(WIDGET_ID)) return;

        // 定位侧边栏
        let rightSidebar = document.querySelector('aside.feed-right-column') ||
                           document.querySelector('aside[aria-label="Explore"]');

        if (!rightSidebar) {
            const changelogHeading = Array.from(document.querySelectorAll('h2, h3')).find(el =>
                el.innerText && el.innerText.toLowerCase().includes('changelog')
            );
            if (changelogHeading) {
                let parent = changelogHeading.closest('div.border');
                if (parent && parent.parentElement) rightSidebar = parent.parentElement;
            }
        }

        if (!rightSidebar) return;

        const container = document.createElement('div');
        container.id = WIDGET_ID;
        container.className = 'color-bg-default color-border-muted border rounded-2 p-3';

        container.innerHTML = `
            <div class="d-flex flex-items-center mb-3 border-bottom color-border-muted pb-1 gap-3">
                <div id="tab-explore" class="tab-btn active">Explore</div>
                <div id="tab-trending" class="tab-btn">Trending</div>
            </div>
            <div id="gemini-list-area" class="repo-list-container d-flex flex-column">
                <p class="text-center color-fg-muted m-4" style="font-size: 14px;">Loading...</p>
            </div>
            <div class="text-right mt-2">
                 <a id="gemini-more-link" href="https://github.com/explore" class="Link--secondary" style="font-size: 13px;">View more →</a>
            </div>
        `;

        rightSidebar.appendChild(container);

        document.getElementById('tab-explore').onclick = () => switchTab('explore');
        document.getElementById('tab-trending').onclick = () => switchTab('trending');

        loadData('explore');
        loadData('trending');
    }

    function switchTab(tabName) {
        STATE.activeTab = tabName;
        document.querySelectorAll(`#${WIDGET_ID} .tab-btn`).forEach(el => el.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');

        const moreLink = document.getElementById('gemini-more-link');
        moreLink.href = tabName === 'explore' ? 'https://github.com/explore' : 'https://github.com/trending';

        renderList();
        if (!STATE.cache[tabName] && !STATE.loading[tabName]) loadData(tabName);
    }

    async function loadData(source) {
        if (STATE.loading[source]) return;
        STATE.loading[source] = true;

        const url = source === 'explore'
            ? 'https://github.com/explore'
            : 'https://github.com/trending?since=daily';

        try {
            const data = await fetchAndParse(url, source);
            STATE.cache[source] = data;
            if (STATE.activeTab === source) renderList();
        } catch (e) {
            console.error(`[GH-Explore] Error loading ${source}:`, e);
            if (STATE.activeTab === source) {
                const area = document.getElementById('gemini-list-area');
                if(area) area.innerHTML = `<p class="color-fg-danger text-center" style="font-size:13px">Load failed.</p>`;
            }
        } finally {
            STATE.loading[source] = false;
        }
    }

    function fetchAndParse(url, source) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    let data = [];

                    if (source === 'trending') {
                        const rows = doc.querySelectorAll('article.Box-row');
                        data = parseTrendingRows(rows);
                    } else {
                        data = parseExploreFeed(doc);
                    }

                    resolve(data.slice(0, 5));
                },
                onerror: reject
            });
        });
    }

    // --- 1. Explore Feed 解析器 ---
    function parseExploreFeed(doc) {
        const data = [];
        const articles = doc.querySelectorAll('article.border');

        articles.forEach(article => {
            const titleLink = article.querySelector('h3 a.text-bold') || article.querySelector('h1 a');
            if (!titleLink) return;

            const href = titleLink.getAttribute('href');
            if (!isValidRepo(href)) return;

            const descEl = article.querySelector('p.color-fg-muted.mb-0') || article.querySelector('p');
            const description = descEl ? descEl.innerText.trim() : '';

            const starCounter = article.querySelector('.Counter.js-social-count');
            let starText = '';

            if (starCounter) {
                starText = starCounter.innerText.trim();
            } else {
                const starBtn = article.querySelector('button[aria-label*="starred"]');
                if (starBtn) {
                    const match = starBtn.getAttribute('aria-label').match(/(\d[\d,.]*[km]?)/i);
                    if (match) starText = match[1];
                }
            }

            data.push({
                name: titleLink.innerText.trim(),
                href: href,
                description: description,
                stars: formatStars(starText) // 应用格式化
            });
        });

        return data;
    }

    // --- 2. Trending 解析器 ---
    function parseTrendingRows(rows) {
        const data = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const titleEl = row.querySelector('h2 a');
            if (!titleEl) continue;

            const descEl = row.querySelector('p.col-9') || row.querySelector('p');
            const starLink = row.querySelector('a[href$="/stargazers"]');

            let starText = '';
            if (starLink) {
                starText = starLink.innerText.trim();
            }

            data.push({
                name: titleEl.innerText.trim().replace(/\s+/g, ''),
                href: titleEl.getAttribute('href'),
                description: descEl ? descEl.innerText.trim() : '',
                stars: formatStars(starText) // 应用格式化
            });
        }
        return data;
    }

    function isValidRepo(href) {
        if (!href) return false;
        const invalidPrefixes = ['/topics/', '/collections/', '/site/', '/features/', '/enterprise', '/login', '/marketplace', '/sponsors'];
        if (invalidPrefixes.some(prefix => href.startsWith(prefix))) return false;
        return /^\/[a-zA-Z0-9-._]+\/[a-zA-Z0-9-._]+$/.test(href.split('?')[0]);
    }

    function renderList() {
        const container = document.getElementById('gemini-list-area');
        if(!container) return;

        const data = STATE.cache[STATE.activeTab];

        if (!data) {
            container.innerHTML = '<p class="text-center color-fg-muted m-4" style="font-size: 14px;">Loading...</p>';
            return;
        }

        if (data.length === 0) {
            container.innerHTML = '<p class="color-fg-muted m-2 text-center" style="font-size: 13px;">No qualified repos found.</p>';
            return;
        }

        let html = '';
        data.forEach((repo, index) => {
            const borderClass = index === 0 ? '' : 'border-top color-border-muted pt-2';
            const marginClass = index === 0 ? '' : 'mt-2';

            let starHtml = '';
            if (repo.stars) {
                starHtml = `<span class="repo-meta ml-2">⭐ ${repo.stars}</span>`;
            }

            html += `
                <div class="${borderClass} ${marginClass}">
                    <div class="d-flex flex-justify-between flex-items-baseline">
                        <a href="${repo.href}" class="Link--primary text-truncate repo-link" title="${repo.name}" style="max-width: 70%;">
                            ${repo.name}
                        </a>
                        ${starHtml}
                    </div>
                    <div class="repo-desc">
                        ${repo.description || 'No description available.'}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Observer
    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById(WIDGET_ID)) init();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('turbo:load', init);
    document.addEventListener('turbo:render', init);

    init();

})();
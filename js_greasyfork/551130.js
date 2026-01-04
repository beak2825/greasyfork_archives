// ==UserScript==
// @name         GitHub Repos Enhanced (Grid Layout + README Preview)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Transform GitHub repositories into beautiful grid cards with README preview on hover
// @author       You
// @match        https://github.com/*?tab=repositories*
// @match        https://github.com/*/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @require      https://code.jquery.com/jquery-3.6.0.min.js

// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551130/GitHub%20Repos%20Enhanced%20%28Grid%20Layout%20%2B%20README%20Preview%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551130/GitHub%20Repos%20Enhanced%20%28Grid%20Layout%20%2B%20README%20Preview%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === GitHub Token 設定（選填，避免 API 限制） ===
    const GITHUB_TOKEN = "";

    // 添加 CSS 樣式
    GM_addStyle(`
        /* Grid Container */
        #repo-grid-container {
            display: grid;
            gap: 20px;
            padding: 20px;
            transition: all 0.3s ease;
        }

        #repo-grid-container.cols-1 { grid-template-columns: repeat(1, 1fr); }
        #repo-grid-container.cols-2 { grid-template-columns: repeat(2, 1fr); }
        #repo-grid-container.cols-3 { grid-template-columns: repeat(3, 1fr); }
        #repo-grid-container.cols-4 { grid-template-columns: repeat(4, 1fr); }

        /* 響應式設計 */
        @media (max-width: 1400px) {
            #repo-grid-container.cols-4 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1024px) {
            #repo-grid-container.cols-4,
            #repo-grid-container.cols-3 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
            #repo-grid-container { grid-template-columns: repeat(1, 1fr) !important; }
        }

        /* Card 樣式 */
        .repo-card {
            background: #ffffff;
            border: 1px solid #d0d7de;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        .repo-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(31, 35, 40, 0.15);
            border-color: #0969da;
        }

        .repo-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #0969da, #1a7f37);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .repo-card:hover::before {
            opacity: 1;
        }

        /* 標題 */
        .repo-card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #0969da;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .repo-card-title:hover {
            text-decoration: underline;
        }

        /* 描述 */
        .repo-card-description {
            color: #57606a;
            font-size: 14px;
            margin-bottom: 16px;
            flex-grow: 1;
            line-height: 1.5;
        }

        /* 底部資訊 */
        .repo-card-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            font-size: 12px;
            color: #57606a;
            padding-top: 12px;
            border-top: 1px solid #d0d7de;
        }

        .repo-card-language {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .language-color {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .repo-card-stars {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Badge 樣式 - 柔和配色 */
        .repo-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            border: 1px solid;
        }

        .repo-badge.public {
            color: #1a7f37;
            border-color: #1a7f37;
            background: #dafbe1;
        }

        .repo-badge.private {
            color: #bf8700;
            border-color: #bf8700;
            background: #fff8c5;
        }

        /* Layout 下拉選單樣式 */
        #grid-layout-dropdown {
            display: inline-block;
            position: relative;
            margin-left: 8px;
        }

        #grid-layout-dropdown summary {
            list-style: none;
            cursor: pointer;
        }

        #grid-layout-dropdown summary::-webkit-details-marker {
            display: none;
        }

        .grid-layout-menu {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            background: #ffffff;
            border: 1px solid #d0d7de;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(31, 35, 40, 0.15);
            min-width: 140px;
            z-index: 1000;
        }

        .grid-layout-menu ul {
            padding: 4px;
        }

        .grid-layout-menu-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.15s ease;
            position: relative;
        }

        .grid-layout-menu-item:hover {
            background: #f6f8fa;
        }

        .grid-layout-menu-item.active {
            background: #ddf4ff;
        }

        .grid-layout-menu-item > svg:first-child {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
            color: #57606a;
        }

        .grid-layout-menu-item.active > svg:first-child {
            color: #0969da;
        }

        .grid-layout-menu-item-text {
            flex: 1;
            font-size: 13px;
            color: #24292f;
            font-weight: 400;
        }

        .grid-layout-menu-item.active .grid-layout-menu-item-text {
            font-weight: 500;
            color: #0969da;
        }

        .grid-layout-menu-item-check {
            width: 14px;
            height: 14px;
            color: #0969da;
            opacity: 0;
            transition: opacity 0.15s ease;
        }

        .grid-layout-menu-item.active .grid-layout-menu-item-check {
            opacity: 1;
        }

        /* 浮動控制面板（備用方案） */
        #grid-control-panel {
            display: none;
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #ffffff;
            border: 1px solid #d0d7de;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(31, 35, 40, 0.15);
            z-index: 10000;
        }

        #grid-control-panel h3 {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #24292f;
            font-weight: 600;
        }

        .grid-buttons {
            display: flex;
            gap: 8px;
        }

        .grid-btn {
            padding: 8px 16px;
            background: #f6f8fa;
            border: 1px solid #d0d7de;
            border-radius: 8px;
            color: #24292f;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
            font-weight: 500;
        }

        .grid-btn:hover {
            background: #ffffff;
            border-color: #0969da;
            color: #0969da;
        }

        .grid-btn.active {
            background: #0969da;
            border-color: #0969da;
            color: white;
        }

        /* ============ README Preview 樣式 ============ */
        .repo-preview {
            position: absolute;
            z-index: 9999;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 16px;
            padding: 24px;
            width: 700px;
            max-height: 500px;
            overflow: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15),
                        0 3px 12px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.9);
            display: none;
            font-size: 13px;
            line-height: 1.7;
            border: 1px solid rgba(0, 0, 0, 0.08);
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
            transition: opacity 0.2s ease, transform 0.2s ease;
            backdrop-filter: blur(10px);
        }

        .repo-preview.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .repo-preview::-webkit-scrollbar {
            width: 8px;
        }

        .repo-preview::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
        }

        .repo-preview::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        }

        .repo-preview::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
        }

        .repo-preview * {
            transform: scale(0.92);
            transform-origin: left top;
        }

        .repo-preview h1 {
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 16px;
            color: #24292f;
            font-weight: 600;
            border-bottom: 2px solid #e1e4e8;
            padding-bottom: 10px;
        }

        .repo-preview h2 {
            font-size: 22px;
            margin-top: 24px;
            margin-bottom: 12px;
            color: #24292f;
            font-weight: 600;
            border-bottom: 1px solid #e1e4e8;
            padding-bottom: 8px;
        }

        .repo-preview h3 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #24292f;
            font-weight: 600;
        }

        .repo-preview p {
            margin: 12px 0;
            color: #57606a;
        }

        .repo-preview pre {
            background: #f6f8fa;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #d0d7de;
            margin: 16px 0;
        }

        .repo-preview code {
            background: #eff1f3;
            padding: 3px 6px;
            border-radius: 6px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
            font-size: 85%;
            color: #24292f;
        }

        .repo-preview pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
            font-size: 13px;
        }

        .repo-preview img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 12px 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .repo-preview a {
            color: #0969da;
            text-decoration: none;
        }

        .repo-preview a:hover {
            text-decoration: underline;
        }

        .repo-preview ul, .repo-preview ol {
            margin: 12px 0;
            padding-left: 24px;
        }

        .repo-preview li {
            margin: 6px 0;
            color: #57606a;
        }

        .repo-preview blockquote {
            border-left: 4px solid #d0d7de;
            padding-left: 16px;
            margin: 16px 0;
            color: #57606a;
            font-style: italic;
        }

        .repo-preview table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }

        .repo-preview th, .repo-preview td {
            border: 1px solid #d0d7de;
            padding: 8px 12px;
            text-align: left;
        }

        .repo-preview th {
            background: #f6f8fa;
            font-weight: 600;
        }

        .repo-preview hr {
            border: none;
            border-top: 2px solid #e1e4e8;
            margin: 24px 0;
        }

        .preview-header {
            font-size: 11px;
            color: #6e7781;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e1e4e8;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    `);

    // 語言顏色映射
    const languageColors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Vue': '#41b883',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Swift': '#ffac45',
        'Kotlin': '#A97BFF',
        'C#': '#178600',
        'Shell': '#89e051',
    };

    function getLanguageColor(lang) {
        return languageColors[lang] || '#8b949e';
    }

    // ============ README Preview 功能 ============
    const preview = document.createElement("div");
    preview.className = "repo-preview";
    document.body.appendChild(preview);

    let hideTimeout;
    let currentLink = null;
    let currentRepo = null;
    let isOverPreview = false;

    async function fetchReadme(owner, repo) {
        const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
        const headers = { "Accept": "application/vnd.github.v3.raw" };
        if (GITHUB_TOKEN) headers["Authorization"] = "token " + GITHUB_TOKEN;

        const res = await fetch(url, { headers });
        if (!res.ok) return "📄 No README found or API limit reached.";
        return res.text();
    }

    function showPreview(x, y, immediate = false) {
        clearTimeout(hideTimeout);

        preview.style.left = (x + 20) + "px";
        preview.style.top = (y + 20) + "px";

        if (preview.style.display === "none") {
            preview.style.display = "block";
            if (immediate) {
                preview.classList.add('show');
            } else {
                setTimeout(() => preview.classList.add('show'), 10);
            }
        }
    }

    function hidePreview(delay = 300) {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!isOverPreview) {
                preview.classList.remove('show');
                setTimeout(() => {
                    if (!isOverPreview) {
                        preview.style.display = "none";
                        currentLink = null;
                        currentRepo = null;
                    }
                }, 200);
            }
        }, delay);
    }

    document.addEventListener("mouseover", async (e) => {
        const link = e.target.closest("a[itemprop='name codeRepository']");

        if (link) {
            const url = new URL(link.href);
            const [owner, repo] = url.pathname.split("/").filter(Boolean);
            const repoKey = `${owner}/${repo}`;

            if (currentRepo === repoKey) {
                showPreview(e.pageX, e.pageY, true);
                return;
            }

            currentLink = link;
            currentRepo = repoKey;

            showPreview(e.pageX, e.pageY, preview.style.display !== "none");
            preview.innerHTML = `<div class="preview-header">📖 README Preview</div><em style="color: #6e7781;">Loading README...</em>`;

            try {
                const readme = await fetchReadme(owner, repo);
                if (currentRepo === repoKey) {
                    preview.innerHTML = `<div class="preview-header">📖 ${owner}/${repo}</div>` + marked.parse(readme);
                }
            } catch(err) {
                if (currentRepo === repoKey) {
                    preview.innerHTML = `<div class="preview-header">❌ Error</div><span style="color: #cf222e;">Error loading README</span>`;
                }
            }
        }
    });

    document.addEventListener("mouseout", (e) => {
        const link = e.target.closest("a[itemprop='name codeRepository']");
        const relatedTarget = e.relatedTarget;

        if (link && !preview.contains(relatedTarget)) {
            const nextLink = relatedTarget?.closest?.("a[itemprop='name codeRepository']");
            if (!nextLink) {
                hidePreview();
            }
        }
    });

    preview.addEventListener("mouseenter", () => {
        isOverPreview = true;
        clearTimeout(hideTimeout);
    });

    preview.addEventListener("mouseleave", () => {
        isOverPreview = false;
        hidePreview();
    });

    // ============ Grid Layout 功能 ============
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve) => {
            if ($(selector).length) {
                resolve($(selector));
                return;
            }

            const observer = new MutationObserver(() => {
                if ($(selector).length) {
                    observer.disconnect();
                    resolve($(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    async function transformRepoList() {
        console.log('🔍 Starting transformation...');
        
        let repoList = await waitForElement('#user-repositories-list');
        
        if (!repoList || repoList.length === 0) {
            repoList = await waitForElement('[data-filterable-for="your-repos-filter"]');
        }
        
        if (!repoList || repoList.length === 0) {
            repoList = $('div[data-hpc] ul').first();
        }
        
        if (!repoList || repoList.length === 0) {
            console.log('❌ Repository list not found');
            return;
        }

        const $gridContainer = $('<div id="repo-grid-container" class="cols-3"></div>');

        let $repos = repoList.find('li');
        
        if ($repos.length === 0) {
            $repos = repoList.children();
        }

        $repos.each(function() {
            const $repo = $(this);

            let $link = $repo.find('a[itemprop="name codeRepository"]');
            if ($link.length === 0) {
                $link = $repo.find('h3 a').first();
            }
            if ($link.length === 0) {
                $link = $repo.find('a').first();
            }
            
            const repoName = $link.text().trim();
            const repoUrl = $link.attr('href');

            if (!repoName) return;

            let description = $repo.find('p[itemprop="description"]').text().trim();
            if (!description) {
                description = $repo.find('p').first().text().trim();
            }
            description = description || '無描述';

            let language = $repo.find('[itemprop="programmingLanguage"]').text().trim();
            if (!language) {
                language = $repo.find('span[class*="color-fg"]').first().text().trim();
            }
            
            const stars = $repo.find('a[href*="/stargazers"]').text().trim();
            const isPublic = $repo.find('span').filter(function() {
                return $(this).text().trim() === 'Public';
            }).length > 0;
            
            let updated = $repo.find('relative-time').attr('datetime');
            if (!updated) {
                updated = $repo.find('relative-time').attr('title') || new Date().toISOString();
            }

            const $card = $(`
                <div class="repo-card">
                    <div>
                        <a href="${repoUrl}" class="repo-card-title" itemprop="name codeRepository">
                            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                            </svg>
                            ${repoName}
                        </a>
                        <span class="repo-badge ${isPublic ? 'public' : 'private'}">
                            ${isPublic ? 'Public' : 'Private'}
                        </span>
                    </div>
                    <div class="repo-card-description">${description}</div>
                    <div class="repo-card-meta">
                        ${language ? `
                            <span class="repo-card-language">
                                <span class="language-color" style="background-color: ${getLanguageColor(language)}"></span>
                                ${language}
                            </span>
                        ` : ''}
                        ${stars ? `
                            <span class="repo-card-stars">
                                <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                                </svg>
                                ${stars}
                            </span>
                        ` : ''}
                        <span>Updated ${new Date(updated).toLocaleDateString()}</span>
                    </div>
                </div>
            `);

            $gridContainer.append($card);
        });

        if (repoList.next().length > 0) {
            repoList.after($gridContainer);
        } else if (repoList.parent().length > 0) {
            repoList.parent().append($gridContainer);
        } else {
            repoList.append($gridContainer);
        }

        repoList.hide();
        createGridControls($gridContainer);
    }

    function createGridControls($gridContainer) {
        let $sortContainer = $('summary[aria-haspopup="menu"]').filter(function() {
            return $(this).find('span').text().includes('Sort');
        }).parent();
        
        if ($sortContainer.length === 0) {
            $sortContainer = $('details').filter(function() {
                return $(this).find('summary').text().includes('Sort');
            }).first();
        }
        
        if ($sortContainer.length === 0) {
            createFallbackControls($gridContainer);
            return;
        }

        const $gridDropdown = $(`
            <details id="grid-layout-dropdown" class="details-reset details-overlay">
                <summary class="btn" aria-haspopup="menu" role="button">
                    <span>Layout</span>
                    <span class="dropdown-caret"></span>
                </summary>
                <div class="grid-layout-menu">
                    <ul style="list-style: none; margin: 0; padding: 0;">
                        <li class="grid-layout-menu-item" data-cols="1">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="4" width="10" height="2" rx="0.5"/>
                                <rect x="3" y="7" width="10" height="2" rx="0.5"/>
                                <rect x="3" y="10" width="10" height="2" rx="0.5"/>
                            </svg>
                            <span class="grid-layout-menu-item-text">列表</span>
                            <svg class="grid-layout-menu-item-check" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                            </svg>
                        </li>
                        <li class="grid-layout-menu-item" data-cols="2">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="4" width="4.5" height="8" rx="0.5"/>
                                <rect x="8.5" y="4" width="4.5" height="8" rx="0.5"/>
                            </svg>
                            <span class="grid-layout-menu-item-text">兩欄</span>
                            <svg class="grid-layout-menu-item-check" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                            </svg>
                        </li>
                        <li class="grid-layout-menu-item active" data-cols="3">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="2.5" y="4" width="3" height="8" rx="0.5"/>
                                <rect x="6.5" y="4" width="3" height="8" rx="0.5"/>
                                <rect x="10.5" y="4" width="3" height="8" rx="0.5"/>
                            </svg>
                            <span class="grid-layout-menu-item-text">三欄</span>
                            <svg class="grid-layout-menu-item-check" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                            </svg>
                        </li>
                        <li class="grid-layout-menu-item" data-cols="4">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="2" y="4" width="2.2" height="8" rx="0.5"/>
                                <rect x="5" y="4" width="2.2" height="8" rx="0.5"/>
                                <rect x="8" y="4" width="2.2" height="8" rx="0.5"/>
                                <rect x="11" y="4" width="2.2" height="8" rx="0.5"/>
                            </svg>
                            <span class="grid-layout-menu-item-text">四欄</span>
                            <svg class="grid-layout-menu-item-check" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
                            </svg>
                        </li>
                    </ul>
                </div>
            </details>
        `);

        $sortContainer.after($gridDropdown);

        $('.grid-layout-menu-item').on('click', function(e) {
            e.preventDefault();
            
            const cols = $(this).data('cols');
            $('.grid-layout-menu-item').removeClass('active');
            $(this).addClass('active');
            $gridContainer.attr('class', `cols-${cols}`);
            window.gridLayoutPreference = cols;
            $('#grid-layout-dropdown').removeAttr('open');
        });

        const savedCols = window.gridLayoutPreference || '3';
        $(`.grid-layout-menu-item[data-cols="${savedCols}"]`).addClass('active').siblings().removeClass('active');
        $gridContainer.attr('class', `cols-${savedCols}`);
    }

    function createFallbackControls($gridContainer) {
        const $controlPanel = $(`
            <div id="grid-control-panel" style="display: block !important;">
                <h3>📐 Grid Layout</h3>
                <div class="grid-buttons">
                    <button class="grid-btn" data-cols="1">1 列</button>
                    <button class="grid-btn" data-cols="2">2 列</button>
                    <button class="grid-btn active" data-cols="3">3 列</button>
                    <button class="grid-btn" data-cols="4">4 列</button>
                </div>
            </div>
        `);

        $('body').append($controlPanel);

        $('#grid-control-panel .grid-btn').on('click', function() {
            const cols = $(this).data('cols');
            $('#grid-control-panel .grid-btn').removeClass('active');
            $(this).addClass('active');
            $gridContainer.attr('class', `cols-${cols}`);
            window.gridLayoutPreference = cols;
        });

        const savedCols = window.gridLayoutPreference || '3';
        $(`#grid-control-panel .grid-btn[data-cols="${savedCols}"]`).click();
    }

    // 頁面載入
    $(document).ready(function() {
        console.log('🚀 GitHub Repos Enhanced loaded');
        
        if (window.location.href.includes('?tab=repositories') || 
            window.location.href.includes('&tab=repositories')) {
            setTimeout(() => {
                transformRepoList();
            }, 1000);
        }
    });

    // 監聽 URL 變化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('?tab=repositories') || url.includes('&tab=repositories')) {
                setTimeout(() => {
                    transformRepoList();
                }, 1500);
            }
        }
    }).observe(document, {subtree: true, childList: true});
})();
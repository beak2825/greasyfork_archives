// ==UserScript==
// @name         GitHub | Releases Full Topic Exporter
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.4
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Adds a floating button to fetch all releases on a multi-page view and download as HTML/TXT with full asset listings (fetches lazy-loaded assets).
// @match        *://github.com/*/*/releases*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562993/GitHub%20%7C%20Releases%20Full%20Topic%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/562993/GitHub%20%7C%20Releases%20Full%20Topic%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    //== GLOBAL STATE & CONFIGURATION ==
    //================================================================================
    let finalHtmlContent = '';
    const CONFIG = {
        postSelector: 'section[aria-labelledby]',
        threadTitleSelector: 'h1.sr-only', // Fallback, document.title is primary
        paginationLinkSelector: '.pagination a:not(.next_page)',
        fetchDelayMs: 300,
    };

    //================================================================================
    //== HELPER FUNCTIONS ==
    //================================================================================

    /**
     * Gathers all CSS <link> and <style> tags from the current page's head.
     * Ensures all stylesheet URLs are absolute.
     * @returns {string} A string of HTML tags to be injected into the new page.
     */
    function getPageStyles() {
        let stylesHtml = '';
        const pageOrigin = window.location.origin;
        document.head.querySelectorAll('link[rel="stylesheet"], style').forEach(elem => {
            if (elem.tagName === 'LINK') {
                const href = new URL(elem.href, pageOrigin).href;
                stylesHtml += `<link rel="stylesheet" href="${href}">\n`;
            } else {
                stylesHtml += elem.outerHTML + '\n';
            }
        });
        return stylesHtml;
    }

    /**
     * Cleans a string to be used as a valid filename.
     * @param {string} name The string to sanitize.
     * @returns {string} A sanitized string safe for use as a filename.
     */
    function sanitizeFilename(name) {
        return name.replace('·', '-').replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, ' ').trim().substring(0, 200) || 'downloaded_page';
    }

    /**
     * Gets the total number of pages in the thread from the pagination elements.
     * @returns {number} The total number of pages, defaults to 1 if no pagination found.
     */
    function getLastPageNumber() {
        const pageLinks = document.querySelectorAll(CONFIG.paginationLinkSelector);
        if (pageLinks.length === 0) return 1;

        const lastPageLink = pageLinks[pageLinks.length - 1];
        const pageNum = parseInt(lastPageLink.textContent, 10);
        return isNaN(pageNum) ? 1 : pageNum;
    }

    /**
     * Extracts the base URL for the thread, removing any page parameters.
     * @returns {string} The clean base URL of the thread.
     */
    function getBaseThreadUrl() {
        const url = new URL(window.location.href);
        url.searchParams.delete('page');
        return url.toString();
    }

    /**
     * Fetches and injects the full asset list for each release on the page.
     * Handles lazy-loaded (<include-fragment>) and truncated lists.
     * @param {Document} doc The parsed HTML document to process.
     */
    async function loadAssetsForPage(doc) {
        const releases = doc.querySelectorAll(CONFIG.postSelector);
        // Extract repo path from current URL (e.g. /User/Repo)
        const pathParts = window.location.pathname.split('/');
        const repoPath = `/${pathParts[1]}/${pathParts[2]}`;

        const promises = Array.from(releases).map(async (release) => {
            // Find the tag name to construct the assets URL
            let tagName = release.querySelector('.octicon-tag + span')?.textContent.trim();

            if (!tagName) {
                // Try extracting from release title link
                const titleLink = release.querySelector('span.f1.text-bold a, .f1 a');
                if (titleLink) {
                    const href = titleLink.getAttribute('href');
                    if (href) {
                        const match = href.match(/\/releases\/tag\/(.+?)(?:\?|$)/);
                        if (match) tagName = match[1];
                    }
                }
            }

            if (!tagName) {
                // Fallback: try any link with /releases/tag/
                const anyTagLink = release.querySelector('a[href*="/releases/tag/"]');
                if (anyTagLink) {
                    const href = anyTagLink.getAttribute('href');
                    const match = href.match(/\/releases\/tag\/(.+?)(?:\?|$)/);
                    if (match) tagName = match[1];
                }
            }

            if (!tagName) return;

            const details = release.querySelector('.Box-footer details');
            if (!details) return;

            // Construct the expanded assets URL (GitHub standard endpoint)
            const assetsUrl = `${window.location.origin}${repoPath}/releases/expanded_assets/${tagName}`;

            try {
                const response = await fetch(assetsUrl);
                if (response.ok) {
                    const html = await response.text();

                    // Keep the summary (the "Assets" header), replace the body
                    const summary = details.querySelector('summary');
                    if (summary) {
                        // Clear existing content (lazy fragments or truncated lists)
                        while (details.lastChild && details.lastChild !== summary) {
                            details.removeChild(details.lastChild);
                        }
                        // Inject the full list from the fetched fragment
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = html;
                        Array.from(wrapper.childNodes).forEach(node => details.appendChild(node));
                    }
                }
            } catch (e) {
                console.warn(`Failed to fetch assets for ${tagName}`, e);
            }
        });

        await Promise.all(promises);
    }

    /**
     * Expands all <details> elements and removes asset truncation buttons.
     * @param {Document} doc The parsed HTML document to process.
     */
    function expandAllDetails(doc) {
        doc.querySelectorAll('details').forEach(details => {
            details.setAttribute('open', '');
        });
        doc.querySelectorAll('.js-release-asset-untruncate-btn').forEach(btn => {
            btn.remove();
        });
    }

    /**
     * Converts relative URLs within the provided document to absolute URLs.
     * @param {Document} doc The parsed HTML document to process.
     */
    function makeUrlsAbsolute(doc) {
        const baseOrigin = window.location.origin;
        doc.querySelectorAll('a[href], img[src], img[srcset]').forEach(el => {
            const processAttribute = (attr) => {
                const url = el.getAttribute(attr);
                if (url && url.startsWith('/') && !url.startsWith('//')) {
                    el.setAttribute(attr, baseOrigin + url);
                }
            };
            if (el.hasAttribute('href')) processAttribute('href');
            if (el.hasAttribute('src')) processAttribute('src');
            if (el.hasAttribute('srcset')) {
                let newSrcset = el.getAttribute('srcset').split(',').map(part => {
                    let [url, descriptor] = part.trim().split(/\s+/);
                    if (url.startsWith('/') && !url.startsWith('//')) {
                        return `${baseOrigin}${url} ${descriptor || ''}`;
                    }
                    return part.trim();
                }).join(', ');
                el.setAttribute('srcset', newSrcset);
            }
        });
    }

    //================================================================================
    //== CORE FETCH & RENDERING FUNCTIONS ==
    //================================================================================

    async function startLoadingProcess() {
        const button = document.getElementById('loadFullTopicBtn');
        button.textContent = 'Loading...';
        button.disabled = true;

        const lastPage = getLastPageNumber();
        const baseUrl = getBaseThreadUrl();
        const threadTitle = document.title;

        let allPostsHtml = '';
        for (let i = 1; i <= lastPage; i++) {
            button.textContent = `Fetching ${i}/${lastPage}...`;
            const pageUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${i}`;
            try {
                const response = await fetch(pageUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                // 1. Fetch lazy/truncated assets
                await loadAssetsForPage(doc);

                // 2. Process URLs and Layout
                makeUrlsAbsolute(doc);
                expandAllDetails(doc);

                if (i > 1) {
                    allPostsHtml += `<div class="userscript-page-break">--- Page ${i} ---</div>`;
                }

                doc.querySelectorAll(CONFIG.postSelector).forEach(post => {
                    allPostsHtml += post.outerHTML;
                });
            } catch (error) {
                console.error(`Failed to load page ${i}:`, error);
                allPostsHtml += `<p style="color: red; font-weight: bold; text-align: center;">Error loading content from page ${i}.</p>`;
            }
            if (i < lastPage) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.fetchDelayMs));
            }
        }

        button.textContent = 'Building Page...';

        const pageStyles = getPageStyles();
        const originalHtmlClass = document.documentElement.className;
        const originalBodyClass = document.body.className;
        const originalHtmlStyle = document.documentElement.getAttribute('style') || '';

        finalHtmlContent = `
            <!DOCTYPE html>
            <html lang="en" class="${originalHtmlClass}" style="${originalHtmlStyle}">
            <head>
                <meta charset="UTF-8">
                <title>Full Thread: ${threadTitle}</title>
                ${pageStyles}
                <style>
                    /* Custom CSS overrides for a clean reading view */
                    .header, .AppHeader, .pagehead, .repository-content > .border-bottom, .footer, .js-header-wrapper { display: none !important; }
                    .container-xl { padding-top: 20px; }
                    .userscript-page-break { text-align: center; font-weight: bold; color: #0969da; border-top: 2px dashed #0969da; padding: 15px; margin: 40px 0; font-size: 1.2em; }
                </style>
            </head>
            <body class="${originalBodyClass}">
                <div class="application-main">
                    <div class="container-xl clearfix px-3 px-md-4 px-lg-5 mt-4">
                        <div class="repository-content">
                            <h1>${threadTitle}</h1>
                            ${allPostsHtml}
                        </div>
                    </div>
                </div>
            </body>
            </html>`;

        showActionButtons();
    }

    //================================================================================
    //== UI AND ACTION FUNCTIONS ==
    //================================================================================

    function createActionButton(id, text, clickHandler) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.className = 'userscript-action-btn';
        button.addEventListener('click', clickHandler);
        return button;
    }

    function showActionButtons() {
        const floatingContainer = document.getElementById('userscript-floating-container');
        floatingContainer.innerHTML = '';

        const title = sanitizeFilename(document.title);

        const downloadHtmlBtn = createActionButton('downloadHtmlBtn', 'Download .html', () => {
            const blob = new Blob([finalHtmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.html`;
            a.click();
            URL.revokeObjectURL(url);
        });

        const downloadTxtBtn = createActionButton('downloadTxtBtn', 'Download .txt', () => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(finalHtmlContent, 'text/html');
            let cleanText = `${doc.querySelector('h1').textContent.trim()}\n\n`;

            doc.querySelectorAll(CONFIG.postSelector).forEach(post => {
                // Extract release title - try multiple selectors
                const releaseTitle =
                    post.querySelector('span.f1.text-bold a')?.textContent.trim() ||
                    post.querySelector('.f1 a')?.textContent.trim() ||
                    post.querySelector('h2.f1 a')?.textContent.trim() ||
                    post.querySelector('h2 a')?.textContent.trim() ||
                    post.querySelector('h1[data-view-component] a')?.textContent.trim() ||
                    'Unknown Release';

                // Extract author
                const author =
                    post.querySelector('[data-hovercard-type="user"]')?.textContent.trim() ||
                    post.querySelector('.avatar + .color-fg-muted')?.textContent.trim() ||
                    post.querySelector('.commit-author')?.textContent.trim() ||
                    'Unknown Author';

                // Extract date - prefer ISO datetime
                const releaseDate =
                    post.querySelector('relative-time')?.getAttribute('datetime') ||
                    post.querySelector('relative-time')?.textContent.trim() ||
                    post.querySelector('time')?.getAttribute('datetime') ||
                    'No Date';

                // Extract tag name
                let tagName = post.querySelector('.octicon-tag + span')?.textContent.trim();
                if (!tagName) {
                    const releaseLink = post.querySelector('span.f1 a, .f1 a, h1 a')?.getAttribute('href');
                    if (releaseLink) {
                        const match = releaseLink.match(/\/releases\/tag\/(.+?)(?:\?|$)/);
                        if (match) tagName = match[1];
                    }
                }
                tagName = tagName || 'No Tag';

                cleanText += `==================================================\n`;
                cleanText += `${releaseTitle} (${tagName}) by ${author} | ${releaseDate}\n`;
                cleanText += `--------------------------------------------------\n`;

                const markdownBody = post.querySelector('.markdown-body');
                if (markdownBody) {
                    const contentClone = markdownBody.cloneNode(true);
                    let extractedText = '';

                    contentClone.querySelectorAll('blockquote').forEach(quote => {
                        extractedText += `\n> ${quote.innerText.trim().replace(/\n/g, '\n> ')}\n\n`;
                        quote.remove();
                    });

                    contentClone.querySelectorAll('pre').forEach(codeBlock => {
                        extractedText += `\n--- CODE ---\n${codeBlock.innerText.trim()}\n--- END CODE ---\n\n`;
                        codeBlock.remove();
                    });

                    extractedText += contentClone.innerText.trim();
                    cleanText += `${extractedText.replace(/(\r\n|\n|\r){3,}/g, '\n\n').trim()}\n\n`;
                }

                // Extract contributors
                const contributorsText = post.querySelector('.Box-footer .mt-2.color-fg-muted')?.textContent.trim();
                if (contributorsText) {
                    cleanText += `Contributors: ${contributorsText}\n`;
                }

                // Extract assets
                const assetsDetails = post.querySelector('.Box-footer details');
                if (assetsDetails) {
                    const assetCount = assetsDetails.querySelector('.Counter')?.textContent.trim() || '';
                    cleanText += `\n--- ASSETS${assetCount ? ` (${assetCount})` : ''} ---\n`;

                    const assetRows = assetsDetails.querySelectorAll('ul li.Box-row');
                    assetRows.forEach(row => {
                        const filenameSpan = row.querySelector('a.Truncate span.Truncate-text.text-bold');
                        const extensionSpan = row.querySelector('a.Truncate span.Truncate-text:not(.text-bold)');
                        const filename = filenameSpan?.textContent.trim() || 'Unknown';
                        const extension = extensionSpan?.textContent.trim() || '';
                        const fullFilename = filename + (extension ? ` ${extension}` : '');

                        const sha256 = row.querySelector('clipboard-copy')?.getAttribute('value') || '';

                        // Find size - skip spans containing relative-time (dates)
                        const sizeSpans = row.querySelectorAll('span.color-fg-muted.text-right.flex-shrink-0');
                        let size = '';
                        for (const span of sizeSpans) {
                            if (span.querySelector('relative-time')) continue;
                            const text = span.textContent.trim();
                            if (text && /^\d/.test(text)) {
                                size = text;
                                break;
                            }
                        }

                        cleanText += `  ${fullFilename}`;
                        if (size) cleanText += ` (${size})`;
                        cleanText += `\n`;
                        if (sha256) cleanText += `    SHA256: ${sha256}\n`;
                    });

                    cleanText += `--- END ASSETS ---\n`;
                }

                cleanText += `\n`;
            });

            const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        });

        floatingContainer.appendChild(downloadHtmlBtn);
        floatingContainer.appendChild(downloadTxtBtn);
    }

    //================================================================================
    //== MAIN EXECUTION & INITIALIZATION ==
    //================================================================================

    function initializeUI() {
        if (document.getElementById('userscript-floating-container')) return;

        const floatingContainer = document.createElement('div');
        floatingContainer.id = 'userscript-floating-container';
        floatingContainer.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;`;

        const mainButton = createActionButton('loadFullTopicBtn', 'Load All Releases', startLoadingProcess);
        mainButton.style.cssText = `padding: 10px 20px; font-size: 16px; background-color: #238636; color: white; border: 1px solid rgba(240, 246, 252, 0.1); border-radius: 6px; cursor: pointer; box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04);`;

        floatingContainer.appendChild(mainButton);
        document.body.appendChild(floatingContainer);

        const actionButtonStyles = document.createElement('style');
        actionButtonStyles.innerHTML = `.userscript-action-btn { padding: 8px 15px; font-size: 14px; background-color: #238636; color: white; border: 1px solid rgba(240, 246, 252, 0.1); border-radius: 6px; cursor: pointer; box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04); }`;
        document.head.appendChild(actionButtonStyles);
    }

    // Use a short timeout to ensure the page is fully interactive before adding the button.
    setTimeout(initializeUI, 1000);

})();
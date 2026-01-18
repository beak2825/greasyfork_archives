// ==UserScript==
// @name         VNDB Site Search Buttons
// @namespace    https://greasyfork.org/users/1071569
// @version      1.5.0
// @description  Adds Google exact-phrase search buttons on VNDB visual novel pages for f95zone.to, www.ryuugames.com, www.anime-sharing.com, and store.steampowered.com. Separate buttons for main title and original title (if different), with original title buttons on the top row and main title on the bottom row for clean alignment.
// @author       FunkyJustin
// @license      MIT
// @match        https://vndb.org/v*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562991/VNDB%20Site%20Search%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/562991/VNDB%20Site%20Search%20Buttons.meta.js
// ==/UserScript==

/*
Update History:
- v1.5.0: Reverted to separate buttons per title; original title buttons now appear on the top row, main title on the bottom row (grid layout for perfect 4-column alignment); improved spacing and responsiveness. Total lines ~318.
- v1.4.0: Reduced to one button per site (4 total); each searched both titles with OR when available; tightened layout for single row. Total lines ~278.
- v1.3.0: Added store.steampowered.com (Steam Store). Total lines ~292.
- v1.2.0: Added automatic light/dark theme detection; buttons and header adapt to VNDB's current theme. Total lines ~282.
- v1.1.1: Redesigned button styling to match VNDB's default light theme. Total lines ~232.
- v1.1.0: Added www.anime-sharing.com to site searches. Total lines ~255.
- v1.0.3: More robust title detection using 'article h1' and 'article .alttitle' selectors. Total lines ~238.
- v1.0.2: Fixed visibility on pages using <h2 class="alttitle">; added prominent header and better container styling. Total lines ~215.
- v1.0.1: Fixed main title detection; wrapped titles in quotes for exact Google searches. Total lines ~168.
- v1.0.0: Initial release. Total lines ~142.
*/

(function () {
    'use strict';

    // Run only on actual VN pages (/v12345)
    if (!/^\/v\d+$/.test(location.pathname)) return;

    // Specific selectors to guarantee correct elements
    const mainTitleEl = document.querySelector('article h1');
    if (!mainTitleEl) return;

    const mainTitle = mainTitleEl.textContent.trim();
    if (!mainTitle) return;

    let originalTitle = '';

    // Primary: .alttitle inside article (covers both <h2> and older <p>)
    const altEl = document.querySelector('article .alttitle');
    if (altEl) {
        originalTitle = altEl.textContent.trim();
    }

    // Fallback: extract original (usually Japanese) from titles table/details
    if (!originalTitle || originalTitle === mainTitle) {
        const titlesTd = document.querySelector('article td.titles');
        if (titlesTd) {
            const details = titlesTd.querySelector('details');
            if (details) {
                const jaSpan = details.querySelector('span[lang="ja"]');
                if (jaSpan) {
                    originalTitle = jaSpan.textContent.trim();
                } else {
                    const jaRow = details.querySelector('abbr.icon-lang-ja')?.closest('tr');
                    if (jaRow) {
                        const titleCell = jaRow.querySelector('td:nth-child(2)');
                        if (titleCell) {
                            originalTitle = titleCell.textContent.trim().split('\n')[0].trim();
                        }
                    }
                }
            }
        }
    }

    // Detect current VNDB theme (light or dark) via background luminance
    function isDarkMode() {
        const style = getComputedStyle(document.body);
        const bg = style.backgroundColor;
        const match = bg.match(/\d+/g);
        if (!match || match.length < 3) return false;
        const [r, g, b] = match.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }

    const dark = isDarkMode();

    // Theme-aware colors
    const headerColor = dark ? '#dddddd' : '#212529';

    const buttonBg = dark ? '#2c3e50' : '#f8f9fa';
    const buttonText = dark ? '#ecf0f1' : '#212529';
    const buttonBorder = dark ? '#34495e' : '#dee2e6';
    const buttonHoverBg = dark ? '#34495e' : '#e9ecef';
    const buttonHoverBorder = dark ? '#3e5c76' : '#ced4da';
    const buttonShadow = dark ? '0 2px 6px rgba(0,0,0,0.4)' : '0 2px 4px rgba(0,0,0,0.05)';

    // Configurable sites
    const sites = [
        { domain: 'f95zone.to',          name: 'F95Zone' },
        { domain: 'www.ryuugames.com',   name: 'RyuuGames' },
        { domain: 'www.anime-sharing.com', name: 'Anime-Sharing' },
        { domain: 'store.steampowered.com', name: 'Steam' }
    ];

    // Main container (column direction for header + grid)
    const container = document.createElement('div');
    container.style.cssText = `
        margin: 24px 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-size: 15px;
    `;

    // Header
    const header = document.createElement('strong');
    header.textContent = 'Quick Site Searches:';
    header.style.cssText = `color: ${headerColor}; align-self: flex-start;`;
    container.appendChild(header);

    // Grid for buttons – 4 columns, perfect alignment
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, minmax(140px, 1fr));
        gap: 12px 16px;
        width: 100%;
    `;

    // Button creator
    function createButton(title, site, labelSuffix) {
        if (!title) return null;

        const query = encodeURIComponent(`"${title}" site:${site.domain}`);
        const url = 'https://www.google.com/search?q=' + query;

        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = `${site.name} ${labelSuffix}`;
        a.title = `Google exact search: "${title}" on ${site.domain}`;
        a.style.cssText = `
            padding: 10px 12px;
            background: ${buttonBg};
            color: ${buttonText};
            text-decoration: none;
            border-radius: 6px;
            border: 1px solid ${buttonBorder};
            font-weight: 600;
            text-align: center;
            transition: all 0.2s ease;
            box-shadow: ${buttonShadow};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        a.onmouseover = () => {
            a.style.background = buttonHoverBg;
            a.style.borderColor = buttonHoverBorder;
            a.style.boxShadow = dark ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 8px rgba(0,0,0,0.1)';
            a.style.transform = 'translateY(-1px)';
        };
        a.onmouseout = () => {
            a.style.background = buttonBg;
            a.style.borderColor = buttonBorder;
            a.style.boxShadow = buttonShadow;
            a.style.transform = 'none';
        };

        return a;
    }

    // Add original title buttons first (top row) if available and different
    if (originalTitle && originalTitle !== mainTitle) {
        sites.forEach(site => {
            const btn = createButton(originalTitle, site, '(Original Title)');
            if (btn) grid.appendChild(btn);
        });
    }

    // Always add main title buttons (bottom row, or only row if no original)
    sites.forEach(site => {
        const btn = createButton(mainTitle, site, '(Main Title)');
        if (btn) grid.appendChild(btn);
    });

    container.appendChild(grid);

    // Insert right after the last visible title element
    const insertPoint = altEl || mainTitleEl;
    if (insertPoint && insertPoint.parentNode) {
        insertPoint.after(container);
    }
})();
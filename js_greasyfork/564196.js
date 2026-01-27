// ==UserScript==
// @name         Torn Honors Pinner
// @version      3.1
// @description  Pin honors you are currently working on!
// @author       dingus
// @match        https://www.torn.com/page.php?sid=awards*
// @grant        GM_getValue
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1338514
// @downloadURL https://update.greasyfork.org/scripts/564196/Torn%20Honors%20Pinner.user.js
// @updateURL https://update.greasyfork.org/scripts/564196/Torn%20Honors%20Pinner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_ID = 'thp-contained-styles';
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            /* Ensure everything calculates width correctly */
            #pinned-section-wrapper,
            #pinned-section-wrapper *,
            li[class*="honor___"] {
                box-sizing: border-box !important;
            }

            .pinned-section {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 5px;
                margin-bottom: 30px;
                padding: 15px;
                border: 1px solid #333;
                display: none;
                width: 100%;
                overflow: hidden;
            }

            .pinned-header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 5px 12px 5px;
                border-bottom: 1px solid #444;
                margin-bottom: 15px;
                width: 100%;
            }

            .pinned-header {
                color: #fff;
                text-transform: uppercase;
                font-size: 13px;
                font-weight: bold;
                letter-spacing: 1px;
            }

            .clear-all-pinned {
                font-size: 11px;
                color: #888;
                cursor: pointer;
                background: none;
                border: none;
                text-decoration: underline;
            }

            /* Contained 3-column grid */
            #pinned-honors-list {
                display: grid !important;
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                gap: 10px !important;
                list-style: none;
                padding: 0;
                margin: 0;
                width: 100%;
            }

            /* Slim Bar Button */
            .flag-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;
                width: 100%;
                background: #333;
                border: none;
                border-top: 1px solid #444;
                cursor: pointer;
                color: #bbb;
                padding: 6px 0;
                margin-top: 8px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                transition: none !important;
            }

            .flag-btn:hover {
                background: #3d3d3d;
                color: #fff;
            }

            .flag-btn.active {
                background: #23374d;
                color: #63b3ed;
                border-top: 1px solid #3182ce;
            }

            /* Native Card Layout with internal containment */
            li[class*="honor___"] {
                display: flex !important;
                flex-direction: column !important;
                height: 100% !important;
                padding: 0 !important;
                overflow: hidden !important;
                position: relative !important;
                background: #222;
                border-radius: 4px;
                width: 100% !important;
            }

            .honorWrap___PO8VW {
                flex-grow: 1;
                padding: 10px;
            }

            /* Kill pesky animations that cause UI flickering */
            * {
                animation: none !important;
                transition: none !important;
            }

            @media screen and (max-width: 784px) {
                #pinned-honors-list { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            }
            @media screen and (max-width: 480px) {
                #pinned-honors-list { grid-template-columns: minmax(0, 1fr) !important; }
            }
        `;
        document.head.appendChild(style);
    }

    const PIN_SVG = (active) => `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="${active ? 'currentColor' : 'none'}" style="pointer-events: none;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

    const getPinned = () => GM_getValue('pinnedHonors', []);

    function refreshUI() {
        const pinnedIds = getPinned();
        const pinnedList = document.getElementById('pinned-honors-list');
        const section = document.getElementById('pinned-section-wrapper');
        // Select all honors that are NOT in our pinned list (clones)
        const allHonors = document.querySelectorAll('li[class*="honor___"]:not([data-clone])');

        if (!section || !pinnedList) return;

        const fragment = document.createDocumentFragment();

        allHonors.forEach(honor => {
            const label = honor.getAttribute('aria-label');
            if (!label) return;

            const isPinned = pinnedIds.includes(label);

            // Re-check for button existence every refresh
            let btn = honor.querySelector('.flag-btn');
            if (!btn) {
                btn = document.createElement('button');
                btn.className = 'flag-btn';
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePin(label);
                };
                honor.appendChild(btn);
            }

            btn.innerHTML = `${PIN_SVG(isPinned)} <span>${isPinned ? 'Pinned' : 'Pin'}</span>`;
            btn.className = isPinned ? 'flag-btn active' : 'flag-btn';

            if (isPinned) {
                const clone = honor.cloneNode(true);
                clone.setAttribute('data-clone', 'true');

                const cloneBtn = clone.querySelector('.flag-btn');
                if (cloneBtn) {
                    cloneBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePin(label);
                    };
                }
                fragment.appendChild(clone);
            }
        });

        pinnedList.innerHTML = '';
        pinnedList.appendChild(fragment);
        section.style.display = pinnedIds.length > 0 ? 'block' : 'none';
    }

    function togglePin(label) {
        let current = getPinned();
        const idx = current.indexOf(label);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(label);
        }
        GM_setValue('pinnedHonors', current);
        refreshUI();
    }

    function updateContainer() {
        const contentArea = document.querySelector('.pageContent___Z54ay');
        if (!contentArea) return;

        let section = document.getElementById('pinned-section-wrapper');
        if (!section) {
            section = document.createElement('div');
            section.id = 'pinned-section-wrapper';
            section.className = 'pinned-section';
            section.innerHTML = `
                <div class="pinned-header-container">
                    <div class="pinned-header">Pinned Tracked Honors</div>
                    <button class="clear-all-pinned" id="thp-clear-all">Unpin All</button>
                </div>
                <ul id="pinned-honors-list" class="honorsList___SegMk"></ul>
            `;

            contentArea.prepend(section);
            document.getElementById('thp-clear-all').onclick = () => {
                if(confirm('Unpin all honors?')) {
                    GM_setValue('pinnedHonors', []);
                    refreshUI();
                }
            };
        }
        refreshUI();
    }

    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }

        if (shouldUpdate) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(updateContainer, 100);
        }
    });

    const root = document.querySelector('.awardsPage___OqFJS') || document.body;
    observer.observe(root, { childList: true, subtree: true });

    updateContainer();
})();
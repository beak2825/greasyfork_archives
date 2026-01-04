// ==UserScript==
// @name         [TMS] ShibariStudy - Category Scraper
// @namespace    https://greasyfork.org/en/users/30331-setcher
// @version      1.0
// @description  Enhanced scraper for ShibariStudy.com with comparison of what you have and what is missing.
// @author       Setcher
// @match        https://shibaristudy.com/categories/*
// @match        https://shibaristudy.com/catalog*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560801/%5BTMS%5D%20ShibariStudy%20-%20Category%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/560801/%5BTMS%5D%20ShibariStudy%20-%20Category%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.pathname.startsWith('/categories/') && !window.location.pathname.startsWith('/catalog')) {
        return;
    }

    const STORAGE_SAFE_KEY = 'safeFilenames';
    const STORAGE_MODULES_KEY = 'savedModuleList';
    const STORAGE_LIVE_KEY = 'savedLiveList';
    const STORAGE_SETTINGS_KEY = 'scrapePanelSettings';

    let safeFilenames = GM_getValue(STORAGE_SAFE_KEY, true);

    const defaultSettings = {
        missingColor: '#ef4444',
        discrepancyColor: '#a855f7',
        zeroVideoColor: '#eab308',
        checkMissing: true,
        checkDiscrepancy: true,
        ignoreLessVideos: false,
        markZeroVideos: false,
        expectSanitized: false,
        panelUnderNavbar: false,
        activeTab: 'settings'
    };
    let settings = GM_getValue(STORAGE_SETTINGS_KEY, defaultSettings);

    const BAD_CHARS = /[\\/:|*?"<>]/g;
    const DIVIDER = '#';

    function sanitizeTitle(title) {
        return title.replace(BAD_CHARS, '-').trim();
    }

    function normalizeForComparison(title) {
        return title
            .replace(/\s*\(FREE\)$/i, '')           // remove (FREE)
            .replace(/['’ʼ]/g, "'")                 // unify apostrophes
            .trim();
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.style.opacity = '1');

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    let countSpan = null;

    function getSavedList(isLive = false) {
        const key = isLive ? STORAGE_LIVE_KEY : STORAGE_MODULES_KEY;
        const saved = GM_getValue(key, '[]');
        return JSON.parse(saved);
    }

    function isLivePage() {
        return window.location.pathname === '/categories/live-classes-replay';
    }

    function pageTypes() {
        const path = window.location.pathname;
        const hasStandardItems = path !== '/categories/live-classes-replay';
        const hasLiveClasses = path.startsWith('/catalog') || path === '/categories/live-classes-replay';
        return { hasStandardItems, hasLiveClasses };
    }

    function getModulesData() {
        const isLive = isLivePage();
        const savedList = getSavedList(isLive);
        const savedMap = new Map();

        savedList.forEach(item => {
            const normalized = normalizeForComparison(item.name);
            const key = (settings.expectSanitized ? sanitizeTitle(normalized) : normalized).toLowerCase();
            savedMap.set(key, item.count);
        });

        const modules = [];
        let extraModules = 0;
        let extraVideos = 0;

        const selector = isLive ? 'swiper-slide[data-card^="video_"]' : 'swiper-slide[data-card^="collection_"]';

        document.querySelectorAll(selector).forEach(slide => {
            const titleLink = slide.querySelector('a.card-title span.line-clamp-2');
            const badgeSpan = slide.querySelector('div.badge span.badge-item');
            const badgeContainer = slide.querySelector('div.badge');

            if (titleLink) {
                const rawTitle = titleLink.textContent.trim();
                let videoCount = 0;

                if (!isLive && badgeSpan) {
                    const badgeText = badgeSpan.textContent.trim();
                    const match = badgeText.match(/^(\d+)/);
                    videoCount = match ? parseInt(match[1], 10) : 0;
                }

                const normalized = normalizeForComparison(rawTitle);
                const key = (settings.expectSanitized ? sanitizeTitle(normalized) : normalized).toLowerCase();

                modules.push({
                    rawTitle,                       // preserved for copying
                    normalizedTitle: normalized,
                    sanitizedTitle: sanitizeTitle(normalized),
                    videoCount,
                    element: slide,
                    badgeElement: badgeContainer,
                    badgeSpan: badgeSpan
                });

                if (!savedMap.has(key)) {
                    extraModules++;
                    extraVideos += videoCount;
                }
            }
        });

        const totalModules = modules.length;
        const totalVideos = modules.reduce((sum, m) => sum + m.videoCount, 0);

        // Use rawTitle for copying to preserve (FREE) and original apostrophes
        const titles = modules.map(m => safeFilenames ? m.sanitizedTitle : m.rawTitle);

        return {
            totalModules,
            totalVideos,
            extraModules,
            extraVideos,
            titles,
            modules,
            savedMap,
            isLive
        };
    }

    function updateCountDisplay() {
        if (!countSpan) return;
        const { totalModules, totalVideos, extraModules, extraVideos } = getModulesData();
        countSpan.textContent = `(${totalModules}/${extraModules} modules, ${totalVideos}/${extraVideos} videos)`;
    }

    function copyList(titles, message) {
        if (titles.length === 0) {
            showToast('No modules to copy.');
            return;
        }
        GM_setClipboard(titles.join('\n'));
        showToast(message);
    }

    function copyPlain(e) {
        e.preventDefault(); e.stopPropagation();
        const { titles } = getModulesData();
        copyList(titles, `Copied ${titles.length} module names${safeFilenames ? ' (safe)' : ''}.`);
    }

    function copyNumbered(e) {
        e.preventDefault(); e.stopPropagation();
        const { titles } = getModulesData();
        const numbered = titles.map((t, i) => `${String(i + 1).padStart(2, '0')}. ${t}`);
        copyList(numbered, `Copied ${titles.length} numbered names${safeFilenames ? ' (safe)' : ''}.`);
    }

    function copyWithVideoCount(e) {
        e.preventDefault(); e.stopPropagation();
        const { modules } = getModulesData();
        const lines = modules.map(m => {
            const name = safeFilenames ? m.sanitizedTitle : m.rawTitle;
            return `${name}${DIVIDER}${m.videoCount}`;
        });
        copyList(lines, `Copied ${modules.length} modules with video counts.`);
    }

    function clearAllHighlights() {
        document.querySelectorAll('swiper-slide').forEach(slide => {
            slide.style.backgroundColor = '';
            const badge = slide.querySelector('div.badge');
            if (badge) badge.style.backgroundColor = '';
            const badgeSpan = slide.querySelector('div.badge span.badge-item');
            if (badgeSpan && badgeSpan.dataset.ssOriginal) {
                badgeSpan.textContent = badgeSpan.dataset.ssOriginal;
                delete badgeSpan.dataset.ssOriginal;
            }
        });
    }

    function performHighlighting() {
        clearAllHighlights();

        const { hasStandardItems, hasLiveClasses } = pageTypes();

        if (hasStandardItems) {
            const data = getModulesData(false);
            processHighlights(data.modules, data.savedMap, false);
        }

        if (hasLiveClasses) {
            const liveData = getModulesData(true);
            processHighlights(liveData.modules, liveData.savedMap, true);
        }
    }

    function processHighlights(modules, savedMap, isLive) {
        modules.forEach(mod => {
            const key = (settings.expectSanitized ? mod.sanitizedTitle : mod.normalizedTitle).toLowerCase();

            if (settings.checkMissing && !savedMap.has(key)) {
                mod.element.style.backgroundColor = settings.missingColor + '80';
                return;
            }

            if (savedMap.has(key) && !isLive) {
                const expectedCount = savedMap.get(key);

                let useZeroColor = false;
                let isDiscrepancy = false;

                if (settings.markZeroVideos && mod.videoCount === 0) {
                    useZeroColor = true;
                }

                if (settings.checkDiscrepancy && typeof expectedCount === 'number' && mod.videoCount !== expectedCount) {
                    if (!settings.ignoreLessVideos || mod.videoCount >= expectedCount) {
                        isDiscrepancy = true;
                    }
                }

                if (useZeroColor || isDiscrepancy) {
                    const color = useZeroColor ? settings.zeroVideoColor : settings.discrepancyColor;
                    mod.element.style.backgroundColor = color + '80';
                    if (mod.badgeElement) {
                        mod.badgeElement.style.backgroundColor = color + 'cc';
                    }
                }

                if (isDiscrepancy) {
                    if (!mod.badgeSpan.dataset.ssOriginal) {
                        mod.badgeSpan.dataset.ssOriginal = mod.badgeSpan.textContent;
                    }
                    mod.badgeSpan.textContent = `${mod.videoCount} vs ${expectedCount}`;
                }
            }
        });
    }

    function refreshAction(e) {
        e.preventDefault(); e.stopPropagation();
        updateCountDisplay();
        performHighlighting();
        showToast('Refreshed & highlights applied');
    }

    function createScrapePanel() {
        const container = document.createElement('div');
        container.className = 'ss-scrape-panel';
        container.style.cssText = 'display:inline-flex;gap:8px;align-items:center;';

        countSpan = document.createElement('span');
        countSpan.style.cssText = 'color:#fff;font-size:14px;font-weight:500;';

        const btnRefresh = document.createElement('button');
        btnRefresh.type = 'button';
        btnRefresh.textContent = '⟳';
        btnRefresh.title = 'Refresh count & apply highlights';
        btnRefresh.style.cssText = 'background:#4b5563;color:white;border:none;border-radius:6px;padding:8px 12px;font-size:18px;cursor:pointer;min-width:44px;min-height:44px;';
        btnRefresh.setAttribute('data-turbo', 'false');
        btnRefresh.addEventListener('click', refreshAction);

        const btnSettings = document.createElement('button');
        btnSettings.type = 'button';
        btnSettings.textContent = '⚙️';
        btnSettings.title = 'Settings & module list';
        btnSettings.style.cssText = 'background:#6d28d9;color:white;border:none;border-radius:6px;padding:8px 12px;font-size:18px;cursor:pointer;min-width:44px;min-height:44px;';
        btnSettings.setAttribute('data-turbo', 'false');
        btnSettings.addEventListener('click', openSettingsModal);

        const btnPlain = document.createElement('button');
        btnPlain.type = 'button';
        btnPlain.textContent = '✂️';
        btnPlain.title = 'Left: Copy All | Right: Options';
        btnPlain.style.cssText = 'background:#2563eb;color:white;border:none;border-radius:6px;padding:8px 12px;font-size:18px;cursor:pointer;min-width:44px;min-height:44px;';
        btnPlain.setAttribute('data-turbo', 'false');
        btnPlain.addEventListener('click', copyPlain);
        createContextMenu(btnPlain, false);

        const btnWithCount = document.createElement('button');
        btnWithCount.type = 'button';
        btnWithCount.textContent = '✂️';
        btnWithCount.title = 'Left: Copy Name#Count | Right: Options';
        btnWithCount.style.cssText = 'background:#0891b2;color:white;border:none;border-radius:6px;padding:8px 12px;font-size:18px;cursor:pointer;min-width:44px;min-height:44px;';
        btnWithCount.setAttribute('data-turbo', 'false');
        btnWithCount.addEventListener('click', copyWithVideoCount);
        createContextMenu(btnWithCount, true);

        const btnNumbered = document.createElement('button');
        btnNumbered.type = 'button';
        btnNumbered.textContent = '✂️';
        btnNumbered.title = 'Copy numbered module names';
        btnNumbered.style.cssText = 'background:#dc2626;color:white;border:none;border-radius:6px;padding:8px 12px;font-size:18px;cursor:pointer;min-width:44px;min-height:44px;';
        btnNumbered.setAttribute('data-turbo', 'false');
        btnNumbered.addEventListener('click', copyNumbered);

        container.appendChild(countSpan);
        container.appendChild(btnRefresh);
        container.appendChild(btnSettings);
        container.appendChild(btnPlain);
        container.appendChild(btnWithCount);
        container.appendChild(btnNumbered);

        return container;
    }

    function createContextMenu(button, isWithCount = false) {
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const { modules, savedMap } = getModulesData();

            const allTitles = modules.map(m => safeFilenames ? m.sanitizedTitle : m.normalizedTitle);
            const allLines = modules.map(m => {
                const name = safeFilenames ? m.sanitizedTitle : m.normalizedTitle;
                return `${name}${DIVIDER}${m.videoCount}`;
            });

            const extraTitles = [];
            const extraLines = [];
            const discrepantTitles = [];
            const discrepantLines = [];

            modules.forEach(mod => {
                const key = (settings.expectSanitized ? mod.sanitizedTitle : mod.normalizedTitle).toLowerCase();
                const title = safeFilenames ? mod.sanitizedTitle : mod.normalizedTitle;
                const line = `${title}${DIVIDER}${mod.videoCount}`;

                if (!savedMap.has(key)) {
                    extraTitles.push(title);
                    extraLines.push(line);
                } else if (savedMap.has(key) && !isLivePage()) {
                    const expectedCount = savedMap.get(key);
                    if (typeof expectedCount === 'number' && mod.videoCount !== expectedCount) {
                        if (!settings.ignoreLessVideos || mod.videoCount >= expectedCount) {
                            discrepantTitles.push(title);
                            discrepantLines.push(line);
                        }
                    }
                }
            });

            const menu = document.createElement('div');
            menu.style.cssText = `
                position: absolute;
                background: #1f2937;
                border: 1px solid #4b5563;
                border-radius: 6px;
                padding: 4px 0;
                z-index: 10020;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                min-width: 200px;
            `;

            const items = isWithCount ? [
                { text: 'Copy All (Name#Count)', data: allLines },
                { text: `Copy Extra (${extraLines.length})`, data: extraLines },
                { text: `Copy Discrepant (${discrepantLines.length})`, data: discrepantLines }
            ] : [
                { text: 'Copy All', data: allTitles },
                { text: `Copy Extra (${extraTitles.length})`, data: extraTitles },
                { text: `Copy Discrepant (${discrepantTitles.length})`, data: discrepantTitles }
            ];

            items.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.textContent = item.text;
                menuItem.style.cssText = `
                    padding: 8px 16px;
                    cursor: pointer;
                    white-space: nowrap;
                    color: white;
                `;
                menuItem.addEventListener('mouseenter', () => menuItem.style.background = '#374151');
                menuItem.addEventListener('mouseleave', () => menuItem.style.background = '');
                menuItem.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    copyList(item.data, `Copied ${item.data.length} items`);
                    document.body.removeChild(menu);
                });
                menu.appendChild(menuItem);
            });

            document.body.appendChild(menu);

            const rect = button.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            let left = rect.left;
            let top = rect.bottom + 4;

            if (left + menuRect.width > window.innerWidth) {
                left = window.innerWidth - menuRect.width - 10;
            }
            if (top + menuRect.height > window.innerHeight) {
                top = rect.top - menuRect.height - 4;
            }

            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;

            const closeMenu = (ev) => {
                if (!menu.contains(ev.target) && ev.target !== button) {
                    document.body.removeChild(menu);
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 0);
        });
    }

    function addLiveCopyButton() {
        const liveCategory = document.querySelector('.category-group[data-category-id="77666"]');
        if (liveCategory) {
            const title = liveCategory.querySelector('.category-title');
            if (title && !liveCategory.querySelector('.ss-live-copy')) {
                const btn = document.createElement('button');
                btn.className = 'ss-live-copy';
                btn.textContent = '✂️';
                btn.title = 'Copy Live Class Replays names';
                btn.style.cssText = 'background:#3b82f6;color:white;border:none;border-radius:6px;padding:4px 8px;font-size:14px;cursor:pointer;margin-left:8px;';
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const liveData = getModulesData(true);
                    const titles = liveData.modules.map(m => safeFilenames ? m.sanitizedTitle : m.normalizedTitle);
                    copyList(titles, `Copied ${titles.length} Live Class Replays names`);
                });
                title.appendChild(btn);
            }
        }
    }

    function tryAddPanels() {
        if (document.querySelector('.ss-scrape-panel')) return;

        const filtersButton = document.querySelector('#catalog_filter_button');
        if (!filtersButton) {
            setTimeout(tryAddPanels, 500);
            return;
        }

        document.querySelectorAll('.ss-scrape-panel').forEach(el => el.remove());

        const panelNextToFilters = createScrapePanel();
        panelNextToFilters.style.marginLeft = '12px';
        filtersButton.parentNode.insertBefore(panelNextToFilters, filtersButton.nextSibling);

        if (settings.panelUnderNavbar) {
            const navbarCollapse = document.querySelector('#navbarResponsive');
            if (navbarCollapse) {
                const panelUnderNavbar = createScrapePanel();
                panelUnderNavbar.style.margin = '0 16px';
                navbarCollapse.appendChild(panelUnderNavbar);
            }
        }

        updateCountDisplay();
        performHighlighting();

        if (window.location.pathname.startsWith('/catalog')) {
            addLiveCopyButton();
        }

        let timeoutId = null;
        const debounced = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                updateCountDisplay();
                performHighlighting();
                if (window.location.pathname.startsWith('/catalog')) {
                    addLiveCopyButton();
                }
                timeoutId = null;
            }, 400);
        };

        const observer = new MutationObserver(debounced);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function openSettingsModal(e) {
        e && e.preventDefault();
        e && e.stopPropagation();

        const existingBackdrop = document.querySelector('#ss-modal-backdrop');
        if (existingBackdrop) existingBackdrop.remove();

        const backdrop = document.createElement('div');
        backdrop.id = 'ss-modal-backdrop';
        backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10001;display:flex;justify-content:center;align-items:center;';
        backdrop.addEventListener('click', (ev) => {
            if (ev.target === backdrop) backdrop.remove();
        });

        const content = document.createElement('div');
        content.style.cssText = 'background:#1f2937;color:white;padding:24px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.6);width:500px;max-width:90vw;position:relative;';
        content.id = 'ss-settings-modal';

        let isDragging = false;
        let currentX = 0;
        let currentY = 0;
        let initialX = 0;
        let initialY = 0;

        const title = document.createElement('h3');
        title.textContent = 'Scrape Panel Settings';
        title.style.margin = '0 0 20px 0';
        title.style.cursor = 'grab';
        content.appendChild(title);

        title.addEventListener('mousedown', e => {
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            title.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                content.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            title.style.cursor = 'grab';
        });

        // Tab bar
        const tabBar = document.createElement('div');
        tabBar.style.cssText = 'display:flex;border-bottom:2px solid #4b5563;margin-bottom:20px;';

        const tabs = [
            { id: 'settings', label: 'Settings' },
            { id: 'modules', label: 'Modules List' },
            { id: 'live', label: 'Live Classes' }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.textContent = tab.label;
            btn.dataset.tab = tab.id;
            btn.style.cssText = `
                padding:12px 24px;
                background:none;
                border:none;
                color:${settings.activeTab === tab.id ? '#60a5fa' : '#9ca3af'};
                border-bottom:${settings.activeTab === tab.id ? '3px solid #60a5fa' : 'none'};
                cursor:pointer;
                font-weight:${settings.activeTab === tab.id ? '600' : 'normal'};
                transition:all 0.2s;
            `;
            btn.addEventListener('click', () => {
                settings.activeTab = tab.id;
                GM_setValue(STORAGE_SETTINGS_KEY, settings);
                openSettingsModal();
            });
            tabBar.appendChild(btn);
        });
        content.appendChild(tabBar);

        // Tab content container
        const tabContainer = document.createElement('div');
        tabContainer.style.minHeight = '300px';
        content.appendChild(tabContainer);

        if (settings.activeTab === 'settings') {
            tabContainer.innerHTML = `
                <h4 style="margin:16px 0 8px;">Highlight Colors</h4>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <label style="flex:1;">Extra module:</label>
                    <input type="color" id="ss-missing-color" value="${settings.missingColor}" style="width:40px;height:40px;padding:0;border:none;cursor:pointer;">
                </div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                    <label style="flex:1;">Video count mismatch:</label>
                    <input type="color" id="ss-discrepancy-color" value="${settings.discrepancyColor}" style="width:40px;height:40px;padding:0;border:none;cursor:pointer;">
                </div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                    <label style="flex:1;">0 videos:</label>
                    <input type="color" id="ss-zero-color" value="${settings.zeroVideoColor}" style="width:40px;height:40px;padding:0;border:none;cursor:pointer;">
                </div>

                <h4 style="margin:16px 0 8px;">Enable Checks</h4>
                <label style="display:block;margin-bottom:8px;">
                    <input type="checkbox" id="ss-check-missing" ${settings.checkMissing ? 'checked' : ''}> Highlight extra modules
                </label>
                <label style="display:block;margin-bottom:8px;">
                    <input type="checkbox" id="ss-check-discrepancy" ${settings.checkDiscrepancy ? 'checked' : ''}> Highlight video count discrepancies
                </label>
                <label style="display:block;margin-bottom:8px;">
                    <input type="checkbox" id="ss-ignore-less" ${settings.ignoreLessVideos ? 'checked' : ''}> Ignore modules with fewer videos
                </label>
                <label style="display:block;margin-bottom:8px;">
                    <input type="checkbox" id="ss-mark-zero" ${settings.markZeroVideos ? 'checked' : ''}> Mark 0 videos
                </label>
                <label style="display:block;margin-bottom:8px;">
                    <input type="checkbox" id="ss-expect-sanitized" ${settings.expectSanitized ? 'checked' : ''}> Expect sanitized names
                </label>
                <label style="display:block;margin-bottom:16px;">
                    <input type="checkbox" id="ss-panel-under-navbar" ${settings.panelUnderNavbar ? 'checked' : ''}> Scrape panel under navbar
                </label>

                <div style="display:flex;justify-content:flex-end;gap:10px;">
                    <button id="ss-save-btn" style="background:#2563eb;color:white;border:none;border-radius:6px;padding:10px 18px;cursor:pointer;">Save Settings</button>
                    <button id="ss-close-btn" style="background:#4b5563;color:white;border:none;border-radius:6px;padding:10px 18px;cursor:pointer;">Close</button>
                </div>
            `;

            content.querySelector('#ss-save-btn').addEventListener('click', (ev) => {
                ev.preventDefault(); ev.stopPropagation();

                settings.missingColor = content.querySelector('#ss-missing-color').value;
                settings.discrepancyColor = content.querySelector('#ss-discrepancy-color').value;
                settings.zeroVideoColor = content.querySelector('#ss-zero-color').value;
                settings.checkMissing = content.querySelector('#ss-check-missing').checked;
                settings.checkDiscrepancy = content.querySelector('#ss-check-discrepancy').checked;
                settings.ignoreLessVideos = content.querySelector('#ss-ignore-less').checked;
                settings.markZeroVideos = content.querySelector('#ss-mark-zero').checked;
                settings.expectSanitized = content.querySelector('#ss-expect-sanitized').checked;
                settings.panelUnderNavbar = content.querySelector('#ss-panel-under-navbar').checked;

                GM_setValue(STORAGE_SETTINGS_KEY, settings);
                showToast('Settings saved');
                backdrop.remove();
                tryAddPanels();
            });

        } else {
            const isLive = settings.activeTab === 'live';
            const list = getSavedList(isLive);
            const displayList = list.map(s => s.count !== undefined ? `${s.name}${DIVIDER}${s.count}` : s.name);

            tabContainer.innerHTML = `
                <h4 style="margin:16px 0 8px;">${isLive ? 'Live Classes' : 'Modules'} List</h4>
                <textarea id="ss-list-textarea" style="width:100%;height:320px;background:#374151;color:white;border:1px solid #4b5563;border-radius:6px;padding:10px;box-sizing:border-box;font-family:monospace;font-size:13px;">${displayList.join('\n')}</textarea>
                <div id="ss-line-count" style="text-align:right;font-size:12px;color:#9ca3af;margin-top:4px;">0 lines</div>

                <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">
                    <button id="ss-save-list" style="background:#2563eb;color:white;border:none;border-radius:6px;padding:10px 18px;cursor:pointer;">Save List</button>
                    <button id="ss-close-btn" style="background:#4b5563;color:white;border:none;border-radius:6px;padding:10px 18px;cursor:pointer;">Close</button>
                </div>
            `;

            const textarea = tabContainer.querySelector('#ss-list-textarea');
            const lineCount = tabContainer.querySelector('#ss-line-count');
            const updateLines = () => {
                const lines = textarea.value.split('\n').filter(l => l.trim() !== '').length;
                lineCount.textContent = `${lines} line${lines === 1 ? '' : 's'}`;
            };
            textarea.addEventListener('input', updateLines);
            updateLines();

            tabContainer.querySelector('#ss-save-list').addEventListener('click', (ev) => {
                ev.preventDefault(); ev.stopPropagation();

                const text = textarea.value.trim();
                const lines = text ? text.split('\n').map(l => l.trim()).filter(l => l) : [];
                const newList = lines.map(line => {
                    if (line.includes(DIVIDER)) {
                        const [name, countStr] = line.split(DIVIDER, 2);
                        const count = parseInt(countStr.trim(), 10);
                        return { name: name.trim(), count: isNaN(count) ? undefined : count };
                    }
                    return { name: line, count: undefined };
                });

                const key = isLive ? STORAGE_LIVE_KEY : STORAGE_MODULES_KEY;
                GM_setValue(key, JSON.stringify(newList));

                showToast('List saved');
                backdrop.remove();
                tryAddPanels();
            });
        }

        content.querySelector('#ss-close-btn').addEventListener('click', () => backdrop.remove());

        backdrop.appendChild(content);
        document.body.appendChild(backdrop);
    }

    tryAddPanels();

})();
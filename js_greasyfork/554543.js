// ==UserScript==
// @name         Better GWB
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  Adds a settings menu, AMOLED dark mode, ad blocking, profile blocking, pinned subreddits, and many QoL features to GWB
// @author       KHROTU
// @match        https://gonewildbrowser.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gonewildbrowser.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @license      Apache License 2.0
// @homepageURL  https://sleazyfork.org/en/scripts/554543-better-gwb
// @supportURL   https://sleazyfork.org/en/scripts/554543-better-gwb/feedback
// @downloadURL https://update.greasyfork.org/scripts/554543/Better%20GWB.user.js
// @updateURL https://update.greasyfork.org/scripts/554543/Better%20GWB.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    function migrateSettings() {
        const oldSettings = GM_getValue('BeterGWB_Settings');
        if (oldSettings && !GM_getValue('BetterGWB_Settings')) {
            console.log('[BetterGWB] Migrating settings from older version...');
            GM_setValue('BetterGWB_Settings', oldSettings);
            const oldBlocked = GM_getValue('BeterGWB_BlockedUsers');
            if (oldBlocked) GM_setValue('BetterGWB_BlockedUsers', oldBlocked);
            const oldPinned = GM_getValue('BeterGWB_PinnedSubreddits');
            if (oldPinned) GM_setValue('BetterGWB_PinnedSubreddits', oldPinned);
            console.log('[BetterGWB] Migration complete.');
        }
    }
    migrateSettings();

    const BLOCKED_USERS_KEY = 'BetterGWB_BlockedUsers';
    const PINNED_SUBREDDITS_KEY = 'BetterGWB_PinnedSubreddits';
    const SETTINGS_KEY = 'BetterGWB_Settings';
    const DEFAULT_SETTINGS = {
        enableAmoledDarkMode: true,
        enableMediaUnloading: true,
        enableCarousel: true,
    };
    let SETTINGS = { ...DEFAULT_SETTINGS };

    function loadSettings() {
        const savedSettings = GM_getValue(SETTINGS_KEY, DEFAULT_SETTINGS);
        SETTINGS = { ...DEFAULT_SETTINGS, ...savedSettings };
    }

    function saveSetting(key, value) {
        SETTINGS[key] = value;
        GM_setValue(SETTINGS_KEY, SETTINGS);
    }

    function exportSettings() {
        const data = {
            settings: GM_getValue(SETTINGS_KEY, DEFAULT_SETTINGS),
            blockedUsers: getBlockedUsers(),
            pinnedSubreddits: getPinnedSubreddits()
        };
        prompt("Copy this string to back up your settings:", JSON.stringify(data));
    }

    function importSettings() {
        const jsonString = prompt("Paste your backup string here:");
        if (!jsonString) return;
        try {
            const data = JSON.parse(jsonString);
            if (data.settings && Array.isArray(data.blockedUsers) && Array.isArray(data.pinnedSubreddits)) {
                GM_setValue(SETTINGS_KEY, data.settings);
                saveBlockedUsers(data.blockedUsers);
                savePinnedSubreddits(data.pinnedSubreddits);
                alert("Settings imported successfully! The page will now reload.");
                location.reload();
            } else {
                alert("Import failed: Invalid data format.");
            }
        } catch (e) {
            alert("Import failed: Could not parse the data.");
            console.error("[BetterGWB] Import Error:", e);
        }
    }

    function applyStyles() {
        GM_addStyle(`
            .bettergwb-panel { background: #424242; padding: 16px; margin: 8px; border-radius: 4px; color: #fff; }
            .bettergwb-panel h3 { font-weight: 500; margin-top: 0; margin-bottom: 12px; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px; }
            .bettergwb-setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .bettergwb-setting-row label { font-size: 14px; cursor: pointer; }
            .bettergwb-setting-io-btns { display: flex; gap: 10px; margin-top: 15px; }
            .bettergwb-io-btn { flex: 1; padding: 8px; border: 1px solid #666; background: #555; color: #eee; border-radius: 4px; cursor: pointer; text-align: center; }
            .bettergwb-io-btn:hover { background: #666; }
            .bettergwb-footer-btn a { display: flex; align-items: center; gap: 4px; }
            .bettergwb-footer-btn:hover a { color: #87CEEB !important; }
            .bettergwb-block-btn:hover a { color: #ff7f7f !important; }
            .bettergwb-pinned-input input { width: 100%; padding: 8px; border: 1px solid #666; background: #555; color: #eee; border-radius: 4px; margin-bottom: 10px; }
            .bettergwb-pinned-list { max-height: 150px; overflow-y: auto; }
            .bettergwb-pinned-chip { display: inline-flex !important; align-items: center; }
            .bettergwb-pinned-chip .bettergwb-unpin-btn { background: transparent; border: none; color: inherit; opacity: 0.6; cursor: pointer; padding: 0; margin-left: 8px; display: inline-flex; align-items: center; justify-content: center; }
            .bettergwb-pinned-chip .bettergwb-unpin-btn:hover { opacity: 1; color: #ff7f7f !important; }
            .bettergwb-unblock-btn { background: #e91e63; color: white; border: none; border-radius: 4px; padding: 3px 8px; cursor: pointer; font-size: 12px; }
            .bettergwb-unblock-btn:hover { background: #c2185b; }
            #bettergwb-back-to-top { position: fixed; bottom: 20px; right: 20px; z-index: 1000; background-color: #fd7fab; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 24px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3); transition: opacity 0.3s, transform 0.3s; display: flex; align-items: center; justify-content: center; }
            #bettergwb-back-to-top:hover { background-color: #fc4994; transform: scale(1.1); }
            .bettergwb-header-btn { background: none; border: none; color: #ccc; margin-left: auto; padding: 0 8px; cursor: pointer; }
            .bettergwb-header-btn:hover { color: #fff; }
            app-post.bettergwb-post-collapsed > mat-card > mat-card-content:not(:last-child):not(.bettergwb-carousel-slide),
            app-post.bettergwb-post-collapsed .bettergwb-carousel { display: none; }
            app-post.bettergwb-post-collapsed > mat-card { padding-bottom: 8px; }
            app-post.bettergwb-post-collapsed > mat-card > mat-card-content:last-of-type { margin-bottom: 0; }
            .bettergwb-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
            .bettergwb-switch input { opacity: 0; width: 0; height: 0; }
            .bettergwb-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 22px; }
            .bettergwb-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .bettergwb-slider { background-color: #fd7fab; }
            input:checked + .bettergwb-slider:before { transform: translateX(18px); }
            .bettergwb-update-notice { background-color: #3a87ad; color: white; padding: 12px; margin: 8px; border-radius: 4px; text-align: center; font-size: 14px; }
            .bettergwb-update-notice a { color: #fff !important; font-weight: bold; text-decoration: underline; }
            .bettergwb-update-notice a:hover { color: #cce5ff !important; }
            .bettergwb-carousel { position: relative; margin: 0 -16px 16px -16px; }
            .bettergwb-carousel-container { overflow: hidden; }
            .bettergwb-carousel-track { display: flex; transition: transform 0.3s ease-in-out; }
            .bettergwb-carousel-slide { flex: 0 0 100%; min-width: 100%; box-sizing: border-box; }
            .bettergwb-carousel-slide.mat-card-content { margin-bottom: 0 !important; }
            .bettergwb-carousel-slide img.mat-card-image { width: 100% !important; max-width: 100% !important; margin: 0 !important; display: block; }
            .bettergwb-carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(30,30,30,0.6); color: white; border: none; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; z-index: 10; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
            .bettergwb-carousel-btn:hover:not(:disabled) { background: rgba(0,0,0,0.8); }
            .bettergwb-carousel-btn:disabled { opacity: 0.2; cursor: not-allowed; }
            .bettergwb-carousel-btn .material-icons { font-size: 32px; }
            .bettergwb-carousel-btn.prev { left: 10px; }
            .bettergwb-carousel-btn.next { right: 10px; }
            .bettergwb-carousel-counter { position: absolute; top: 10px; right: 10px; background: rgba(30,30,30,0.7); color: white; padding: 4px 10px; border-radius: 12px; font-size: 14px; font-weight: 500; z-index: 10; user-select: none; }
            app-ad, app-promo, a[href*="theporndude.com"], a[href*="gonewildarchive.net"], app-sticky-header, button[routerlink="/favorites"] { display: none !important; }
            app-layout > .wrapper { padding-top: 0 !important; }
            .side { top: 0 !important; height: 100vh !important; }
            html.bettergwb-amoled-dark-mode, html.bettergwb-amoled-dark-mode body, html.bettergwb-amoled-dark-mode .wrapper, html.bettergwb-amoled-dark-mode .main-wrapper { background-color: #000000 !important; }
            html.bettergwb-amoled-dark-mode .mat-card, html.bettergwb-amoled-dark-mode app-filter, html.bettergwb-amoled-dark-mode .tag-search, html.bettergwb-amoled-dark-mode .bettergwb-panel { background-color: #121212 !important; color: #e0e0e0 !important; }
            html.bettergwb-amoled-dark-mode .mat-card-title, html.bettergwb-amoled-dark-mode h1, html.bettergwb-amoled-dark-mode .footer-item a { color: #e0e0e0 !important; }
            html.bettergwb-amoled-dark-mode .mat-chip { background-color: #333 !important; color: #ccc !important; }
            html.bettergwb-amoled-dark-mode .mat-chip.mat-chip-selected { background-color: #555 !important; color: #fff !important; }
        `);
        if (SETTINGS.enableAmoledDarkMode) document.documentElement.classList.add('bettergwb-amoled-dark-mode');
    }

    const getBlockedUsers = () => JSON.parse(GM_getValue(BLOCKED_USERS_KEY, '[]'));
    const saveBlockedUsers = (users) => GM_setValue(BLOCKED_USERS_KEY, JSON.stringify(Array.from(new Set(users))));
    const getPinnedSubreddits = () => JSON.parse(GM_getValue(PINNED_SUBREDDITS_KEY, '[]'));
    const savePinnedSubreddits = (subs) => GM_setValue(PINNED_SUBREDDITS_KEY, JSON.stringify(Array.from(new Set(subs))));
    const blockUser = (username) => { if (username) { let b = getBlockedUsers(); if (!b.includes(username)) { b.push(username); saveBlockedUsers(b); applyBlocks(); updateBlocklistManager(); } } };
    const unblockUser = (username) => { let b = getBlockedUsers(); saveBlockedUsers(b.filter(u => u !== username)); applyBlocks(); updateBlocklistManager(); };
    const pinSubreddit = (subName) => { let p = getPinnedSubreddits(); if (!p.includes(subName)) { p.push(subName); savePinnedSubreddits(p); updatePinnedSubreddits(); } };
    const unpinSubreddit = (subName) => { savePinnedSubreddits(getPinnedSubreddits().filter(s => s !== subName)); updatePinnedSubreddits(); };

    function applyBlocks() {
        const blockedUsers = getBlockedUsers();
        document.querySelectorAll('app-post[data-username]').forEach(post => {
            post.style.display = blockedUsers.includes(post.dataset.username) ? 'none' : '';
        });
    }

    function createSettingsPanel(sideFilter) {
        if (document.getElementById('bettergwb-settings-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'bettergwb-settings-panel';
        panel.className = 'bettergwb-panel';
        panel.innerHTML = `<h3>Better GWB Settings</h3>
            <div class="bettergwb-setting-row"><label for="bettergwb-setting-darkmode">AMOLED Dark Mode</label><label class="bettergwb-switch"><input type="checkbox" id="bettergwb-setting-darkmode"><span class="bettergwb-slider"></span></label></div>
            <div class="bettergwb-setting-row"><label for="bettergwb-setting-carousel" title="Group posts with multiple images into a scrollable carousel.">Enable Image Carousel</label><label class="bettergwb-switch"><input type="checkbox" id="bettergwb-setting-carousel"><span class="bettergwb-slider"></span></label></div>
            <div class="bettergwb-setting-row"><label for="bettergwb-setting-mediaunload" title="Pause off-screen videos to save performance.">Pause Off-Screen Videos</label><label class="bettergwb-switch"><input type="checkbox" id="bettergwb-setting-mediaunload"><span class="bettergwb-slider"></span></label></div>
            <div class="bettergwb-setting-io-btns"><button id="bettergwb-export-btn" class="bettergwb-io-btn">Export</button><button id="bettergwb-import-btn" class="bettergwb-io-btn">Import</button></div>`;
        sideFilter.prepend(panel);

        const darkModeToggle = panel.querySelector('#bettergwb-setting-darkmode');
        darkModeToggle.checked = SETTINGS.enableAmoledDarkMode;
        darkModeToggle.addEventListener('change', e => {
            saveSetting('enableAmoledDarkMode', e.target.checked);
            document.documentElement.classList.toggle('bettergwb-amoled-dark-mode', e.target.checked);
        });

        const carouselToggle = panel.querySelector('#bettergwb-setting-carousel');
        carouselToggle.checked = SETTINGS.enableCarousel;
        carouselToggle.addEventListener('change', e => {
            saveSetting('enableCarousel', e.target.checked);
            location.reload();
        });

        const mediaUnloadToggle = panel.querySelector('#bettergwb-setting-mediaunload');
        mediaUnloadToggle.checked = SETTINGS.enableMediaUnloading;
        mediaUnloadToggle.addEventListener('change', e => saveSetting('enableMediaUnloading', e.target.checked));

        panel.querySelector('#bettergwb-export-btn').addEventListener('click', exportSettings);
        panel.querySelector('#bettergwb-import-btn').addEventListener('click', importSettings);
    }

    function createPinnedSubredditsPanel(sideFilter) {
        if (document.getElementById('bettergwb-pinned-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'bettergwb-pinned-panel';
        panel.className = 'bettergwb-panel';
        panel.innerHTML = `<h3>Pinned Subreddits</h3><div class="bettergwb-pinned-input"><input type="text" id="bettergwb-add-pinned" placeholder="Add subreddit & press Enter" /></div><div id="bettergwb-pinned-list" class="bettergwb-pinned-list"></div>`;
        sideFilter.appendChild(panel);
        panel.querySelector('#bettergwb-add-pinned').addEventListener('keypress', e => {
            if (e.key === 'Enter') { const subName = e.target.value.trim().toLowerCase().replace(/^r\//, ''); if (subName) { pinSubreddit(subName); e.target.value = ''; } }
        });
        updatePinnedSubreddits();
    }

    function updatePinnedSubreddits() {
        const container = document.getElementById('bettergwb-pinned-list');
        if (!container) return;
        const pinned = getPinnedSubreddits();
        container.innerHTML = pinned.length === 0 ? '<p style="color: #aaa; font-size: 12px; margin: 0;">No pinned subreddits.</p>' : '';
        if (pinned.length > 0) {
            const chipList = document.createElement('mat-chip-list');
            chipList.style.cssText = 'display: flex; flex-wrap: wrap;';
            pinned.sort().forEach(subName => {
                const chip = document.createElement('mat-chip');
                chip.className = 'bettergwb-pinned-chip mat-chip mat-primary mat-standard-chip';
                const nameSpan = Object.assign(document.createElement('span'), { textContent: subName, style: 'cursor: pointer;' });
                nameSpan.addEventListener('click', () => { window.location.href = `/?tag=${subName}`; });
                const removeBtn = Object.assign(document.createElement('button'), { className: 'bettergwb-unpin-btn', innerHTML: '<i class="material-icons" style="font-size: 16px;">cancel</i>', title: `Unpin ${subName}` });
                removeBtn.addEventListener('click', e => { e.stopPropagation(); unpinSubreddit(subName); });
                chip.append(nameSpan, removeBtn);
                chipList.appendChild(chip);
            });
            container.appendChild(chipList);
        }
    }

    function createBackToTopButton() {
        if (document.getElementById('bettergwb-back-to-top')) return;
        const button = document.createElement('button');
        button.id = 'bettergwb-back-to-top';
        button.innerHTML = '<i class="material-icons">arrow_upward</i>';
        document.body.appendChild(button);
        window.addEventListener('scroll', () => button.style.display = (window.scrollY > 400) ? 'flex' : 'none', { passive: true });
        button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    let mediaObserver;
    function initializeMediaObserver() {
        if (mediaObserver) mediaObserver.disconnect();
        mediaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else if (SETTINGS.enableMediaUnloading && !video.paused) {
                    video.pause();
                }
            });
        }, { rootMargin: '500px 0px' });
    }

    function createCarousel(post) {
        const card = post.querySelector('mat-card');
        if (!card) return;

        const imageContentBlocks = Array.from(card.children)
            .filter(child => child.tagName === 'MAT-CARD-CONTENT' && child.querySelector('img.mat-card-image'));

        if (imageContentBlocks.length <= 1) return;

        let currentIndex = 0;
        const totalSlides = imageContentBlocks.length;

        const carousel = document.createElement('div');
        carousel.className = 'bettergwb-carousel';
        const container = document.createElement('div');
        container.className = 'bettergwb-carousel-container';
        const track = document.createElement('div');
        track.className = 'bettergwb-carousel-track';

        imageContentBlocks[0].parentNode.insertBefore(carousel, imageContentBlocks[0]);
        carousel.appendChild(container);
        container.appendChild(track);

        imageContentBlocks.forEach(block => {
            block.classList.add('bettergwb-carousel-slide');
            track.appendChild(block);
        });

        const counter = document.createElement('div');
        counter.className = 'bettergwb-carousel-counter';
        carousel.appendChild(counter);

        const prevBtn = document.createElement('button');
        prevBtn.className = 'bettergwb-carousel-btn prev';
        prevBtn.innerHTML = '<i class="material-icons">chevron_left</i>';
        carousel.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'bettergwb-carousel-btn next';
        nextBtn.innerHTML = '<i class="material-icons">chevron_right</i>';
        carousel.appendChild(nextBtn);

        const updateCarouselState = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;
        };

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex > 0) {
                currentIndex--;
                updateCarouselState();
            }
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarouselState();
            }
        });

        updateCarouselState();
    }

    function processPosts() {
        document.querySelectorAll('app-post:not([data-bettergwb-processed])').forEach(post => {
            post.setAttribute('data-bettergwb-processed', 'true');
            const profileLink = post.querySelector('a[href*="/profile/"]');
            if (profileLink) {
                const username = profileLink.href.split('/profile/')[1]?.trim().replace(/\/$/, '');
                post.dataset.username = username;
                if (getBlockedUsers().includes(username)) post.style.display = 'none';
                addFooterButtons(post.querySelector('ul.footer'), post, username);
            }
            addHeaderButtons(post);
            enhanceVideos(post);
            if (SETTINGS.enableCarousel) {
                createCarousel(post);
            }
        });
    }

    function enhanceVideos(post) {
        post.querySelectorAll('video').forEach(video => {
            if (!video.hasAttribute('data-bettergwb-enhanced')) {
                video.setAttribute('loop', '');
                video.setAttribute('muted', '');
                video.setAttribute('playsinline', '');
                video.setAttribute('data-bettergwb-enhanced', 'true');
                if (mediaObserver) mediaObserver.observe(video);
            }
        });
    }

    function addHeaderButtons(post) {
        const header = post.querySelector('.mat-card-header');
        if (!header || header.querySelector('.bettergwb-header-btn')) return;
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'bettergwb-header-btn';
        toggleBtn.innerHTML = '<i class="material-icons" style="font-size: 24px;">unfold_less</i>';
        toggleBtn.title = 'Collapse/Expand Media';
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = post.classList.toggle('bettergwb-post-collapsed');
            toggleBtn.querySelector('i').textContent = isCollapsed ? 'unfold_more' : 'unfold_less';
        });
        header.appendChild(toggleBtn);
    }

    function fallbackCopy(textToCopy, onSuccess, onFailure) {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) onSuccess();
            else throw new Error('execCommand returned false');
        } catch (err) {
            console.error('[BetterGWB] Fallback copy method failed:', err);
            onFailure();
        }
        document.body.removeChild(textArea);
    }

    function addFooterButtons(footer, post, username) {
        if (!footer) return;
        createFooterButton(footer, 'block', 'Block', `Block ${username}`, () => {
            if (confirm(`Block all posts from "${username}"?`)) blockUser(username);
        }, 'bettergwb-block-btn');

        const redditLinkEl = footer.querySelector('a[href*="redd.it"]');
        if (redditLinkEl) {
            const redditLink = redditLinkEl.href;
            createFooterButton(footer, 'content_copy', 'Copy', 'Copy Reddit Link', e => {
                const button = e.currentTarget;
                const showSuccess = () => {
                    const icon = button.querySelector('i');
                    const text = button.querySelector('span');
                    if (icon) icon.textContent = 'check';
                    if (text) text.textContent = 'Copied!';
                    setTimeout(() => {
                        if (icon) icon.textContent = 'content_copy';
                        if (text) text.textContent = 'Copy';
                    }, 1500);
                };
                const showError = () => alert('Could not copy link to clipboard.');

                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(redditLink)
                        .then(showSuccess)
                        .catch(err => {
                            console.error('[BetterGWB] Clipboard API failed:', err);
                            fallbackCopy(redditLink, showSuccess, showError);
                        });
                } else {
                    fallbackCopy(redditLink, showSuccess, showError);
                }
            });
        }
    }

    function createFooterButton(footer, icon, text, title, onClick, extraClass = '') {
        const li = document.createElement('li');
        li.className = `footer-item bettergwb-footer-btn ${extraClass}`;
        li.title = title;
        li.innerHTML = `<a><i class="material-icons" style="font-size: 18px;">${icon}</i> <span>${text}</span></a>`;
        li.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); onClick(e); });
        const separator = document.createElement('li');
        separator.className = 'item-separator';
        separator.setAttribute('aria-hidden', 'true');
        footer.append(separator, li);
    }

    function createBlocklistManager(sideFilter) {
        if (document.getElementById('bettergwb-blocklist-manager')) return;
        const managerDiv = document.createElement('div');
        managerDiv.id = 'bettergwb-blocklist-manager';
        managerDiv.className = 'bettergwb-panel';
        managerDiv.innerHTML = `<h3>Blocked Profiles</h3><div id="bettergwb-blocklist-container"></div>`;
        sideFilter.appendChild(managerDiv);
        updateBlocklistManager();
    }

    function updateBlocklistManager() {
        const container = document.getElementById('bettergwb-blocklist-container');
        if (!container) return;
        const blockedUsers = getBlockedUsers();
        container.innerHTML = blockedUsers.length === 0 ? '<p style="color: #aaa; font-size: 12px; margin: 0;">No users blocked.</p>' : '';
        if (blockedUsers.length > 0) {
            const userList = document.createElement('ul');
            userList.style.cssText = 'list-style: none; padding: 0; margin: 0; max-height: 200px; overflow-y: auto;';
            blockedUsers.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).forEach(username => {
                const li = document.createElement('li');
                li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 14px;';
                li.innerHTML = `<span>${username}</span> <button title="Unblock ${username}" class="bettergwb-unblock-btn">Unblock</button>`;
                li.querySelector('button').addEventListener('click', () => unblockUser(username));
                userList.appendChild(li);
            });
            container.appendChild(userList);
        }
    }

    function checkForUpdates() {
        const metaUrl = `${GM_info.script.homepageURL}.meta.js`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: metaUrl,
            onload: function(response) {
                const latestVersionMatch = response.responseText.match(/@version\s+([\d.]+)/);
                if (latestVersionMatch && latestVersionMatch[1]) {
                    const latestVersion = latestVersionMatch[1];
                    if (isNewerVersion(latestVersion, GM_info.script.version)) {
                        displayUpdateNotice(latestVersion);
                    }
                }
            },
            onerror: function(error) { console.error('[BetterGWB] Update check failed:', error); }
        });
    }

    function isNewerVersion(latest, current) {
        const latestParts = latest.split('.').map(Number);
        const currentParts = current.split('.').map(Number);
        for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
            if ((latestParts[i] || 0) > (currentParts[i] || 0)) return true;
            if ((latestParts[i] || 0) < (currentParts[i] || 0)) return false;
        }
        return false;
    }

    function displayUpdateNotice(latestVersion) {
        waitForElement('app-filter', (sideFilter) => {
            if (document.getElementById('bettergwb-update-notice')) return;
            const notice = document.createElement('div');
            notice.id = 'bettergwb-update-notice';
            notice.className = 'bettergwb-update-notice';
            notice.innerHTML = `A new version (${latestVersion}) of Better GWB is available!<br><a href="${GM_info.script.homepageURL}" target="_blank">Click here to update</a>`;
            sideFilter.prepend(notice);
        });
    }

    function initialize(appHome) {
        loadSettings();
        applyStyles();
        checkForUpdates();
        createBackToTopButton();
        initializeMediaObserver();
        waitForElement('app-filter', sideFilter => {
            createSettingsPanel(sideFilter);
            createPinnedSubredditsPanel(sideFilter);
            createBlocklistManager(sideFilter);
        });

        waitForElement('app-posts', (postsContainer) => {
            let debounceTimer;
            const observer = new MutationObserver(() => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(processPosts, 150);
            });
            observer.observe(postsContainer, { childList: true });
            processPosts();
        }, 20000, appHome);
    }

    function waitForElement(selector, callback, timeout = 20000, parentNode = document) {
        let intervalHandle;
        const timeoutHandle = setTimeout(() => {
            clearInterval(intervalHandle);
            console.warn(`[BetterGWB] Timed out waiting for selector: "${selector}"`);
        }, timeout);

        intervalHandle = setInterval(() => {
            const element = parentNode.querySelector(selector);
            if (element) {
                clearInterval(intervalHandle);
                clearTimeout(timeoutHandle);
                callback(element);
            }
        }, 250);
    }

    waitForElement('app-root > app-home', initialize);
})();
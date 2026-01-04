// ==UserScript==
// @name         🪄 NoShorts YouTube UI Enhancer | Remove Shorts from Feed & Customize Layout
// @namespace    https://greasyfork.org/en/users/15128-reaverxai
// @version      2.2.2
// @description  A modified version of Michaelsoft's "YouTube UI Enhancer". Enhances YouTube by showing full video titles on hover, removing ad overlays, and adding quick-access "Not Interested" icons, with all features configurable from a settings menu. All credit for the original script goes to Michaelsoft.
// @author       reaverxai (based on the work of Michaelsoft)
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/feed/you
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552255/%F0%9F%AA%84%20NoShorts%20YouTube%20UI%20Enhancer%20%7C%20Remove%20Shorts%20from%20Feed%20%20Customize%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/552255/%F0%9F%AA%84%20NoShorts%20YouTube%20UI%20Enhancer%20%7C%20Remove%20Shorts%20from%20Feed%20%20Customize%20Layout.meta.js
// ==/UserScript==

/*
 * This script is a modification of the original "YouTube UI Enhancer" script by Michaelsoft.
 * The original script, under the MIT License, can be found at:
 * https://greasyfork.org/en/scripts/533654-youtube-ui-enhancer-resize-thumbnails-modify-layout-more
 */

(function () {
    'use strict';

    // WARNING: Users should update their preferences through UI - values below will be overwritten every time the script is updated.
    const userSettings = {
        videosPerRow: 6,
        shortsPerRow: 12,
        disableShorts: true,
        enableShowMoreFix: true,
        hideUIButton: false,
        hideUIButtonShortcut: true,
        enableCustomTooltips: false,
        enableAdBlocker: true,
        enableInterestIcons: true,
        enableRefreshButton: true,
    };

    const settings = {};
    for (const key in userSettings) {
        settings[key] = GM_getValue(key, userSettings[key]);
    }

    function saveSetting(key, value) {
        GM_setValue(key, value);
        settings[key] = value;
        applyCustomizations();
    }

    function resetSettings() {
        for (const key in userSettings) {
            saveSetting(key, userSettings[key]);
        }
    }

    let customStyle = null;
    let featureObservers = [];

    function applyCustomizations() {
        if (customStyle) customStyle.remove();
        customStyle = GM_addStyle(`
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${settings.videosPerRow} !important;
                --ytd-rich-grid-posts-per-row: ${settings.videosPerRow} !important;
                --ytd-rich-grid-slim-items-per-row: ${settings.shortsPerRow} !important;
                --ytd-rich-grid-game-cards-per-row: 7 !important;
                --ytd-rich-grid-gutter-margin: 0px !important;
            }
            ytd-rich-shelf-renderer {
                --ytd-rich-grid-items-per-row: ${settings.shortsPerRow} !important;
            }
            ${settings.disableShorts ? `
                ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
                    display: none !important;
                }
            ` : ''}
        `);
    }

    function enableShowMoreFix() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('ytd-rich-item-renderer[hidden]').forEach(el => el.removeAttribute('hidden'));
            document.querySelectorAll('ytd-rich-shelf-renderer').forEach(el => el.setAttribute('is-show-more-hidden', ''));
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        featureObservers.push(observer);
    }

    // FEATURE: Show full video titles on hover
    let titleTooltip = null;

    function createTitleTooltip() {
        if (titleTooltip) return;
        titleTooltip = document.createElement('div');
        Object.assign(titleTooltip.style, {
            position: 'fixed', zIndex: '10000', padding: '5px 10px', fontSize: '14px',
            backgroundColor: isDarkTheme() ? 'rgba(40, 40, 40, 0.95)' : 'rgba(240, 240, 240, 0.95)',
            color: isDarkTheme() ? '#eee' : '#000', border: `1px solid ${isDarkTheme() ? '#555' : '#ccc'}`,
            borderRadius: '4px', display: 'none', pointerEvents: 'none', maxWidth: '450px',
            textAlign: 'left', lineHeight: '1.4'
        });
        document.body.appendChild(titleTooltip);
    }

    function showFullTitle(event) {
        if (!titleTooltip) createTitleTooltip();
        const target = event.currentTarget;
        const visibleTitleSpan = target.querySelector('span.yt-core-attributed-string');
        if (!visibleTitleSpan || visibleTitleSpan.scrollWidth <= visibleTitleSpan.clientWidth) return;
        const fullTitle = target.closest('h3')?.getAttribute('title') || visibleTitleSpan.textContent.trim();
        if (!fullTitle) return;
        titleTooltip.textContent = fullTitle;
        titleTooltip.style.display = 'block';
        updateTooltipPosition(event);
    }

    function hideFullTitle() {
        if (titleTooltip) titleTooltip.style.display = 'none';
    }

    function updateTooltipPosition(event) {
        if (titleTooltip && titleTooltip.style.display === 'block') {
            let x = event.clientX + 15;
            let y = event.clientY + 15;
            if (y + titleTooltip.offsetHeight > window.innerHeight) y = event.clientY - titleTooltip.offsetHeight - 15;
            if (x + titleTooltip.offsetWidth > window.innerWidth) x = event.clientX - titleTooltip.offsetWidth - 15;
            titleTooltip.style.left = `${x}px`;
            titleTooltip.style.top = `${y}px`;
        }
    }

    function initTitleHoverFeature() {
        const setupObserver = new MutationObserver(() => {
            document.querySelectorAll('a#video-title:not([data-title-hover-init]), .yt-lockup-metadata-view-model__title:not([data-title-hover-init])').forEach(el => {
                el.setAttribute('data-title-hover-init', 'true');
                el.addEventListener('mouseenter', showFullTitle);
                el.addEventListener('mouseleave', hideFullTitle);
                el.addEventListener('mousemove', updateTooltipPosition);
            });
        });
        setupObserver.observe(document.documentElement, { childList: true, subtree: true });
        featureObservers.push(setupObserver);

        const attrObserver = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === 'attributes' && m.attributeName === 'title') m.target.removeAttribute('title');
                if (m.type === 'childList') m.target.querySelectorAll('a#video-title[title], .yt-lockup-metadata-view-model__title[title]').forEach(el => el.removeAttribute('title'));
            });
        });
        attrObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });
        featureObservers.push(attrObserver);
    }

    // FEATURE: Ad Blocker
    function initAdBlocker() {
        const adObserver = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === 'childList') {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList?.contains('ytmPaidContentOverlayHost')) node.remove();
                    });
                }
            });
        });
        adObserver.observe(document.body, { childList: true, subtree: true });
        featureObservers.push(adObserver);
    }

    // FEATURE: "Not Interested" Icons
    function initInterestIcons() {
        GM_addStyle(`
            .yt-lockup-metadata-view-model__menu-button, #menu { position: relative !important; overflow: visible !important; }
            .interest-icons-container { position: absolute; top: 40%; right: 7%; z-index: 5; display: flex; flex-direction: column; gap: 4px; opacity: 0; transition: opacity 0.1s linear; pointer-events: none; }
            ytd-rich-item-renderer:hover .interest-icons-container, ytd-video-renderer:hover .interest-icons-container, ytd-grid-video-renderer:hover .interest-icons-container { opacity: 1; pointer-events: auto; }
            .interest-icon-button { width: 32px; height: 32px; border: none; background: none; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: var(--yt-spec-background-solid, ${isDarkTheme() ? '#212121' : '#fff'}); }
            .interest-icon-button:hover { background-color: ${isDarkTheme() ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}; }
            .interest-icon-button svg { width: 20px; height: 20px; fill: var(--yt-spec-text-primary, ${isDarkTheme() ? '#fff' : '#030303'}); }
        `);
        const interestObserver = new MutationObserver(mutations => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const renderers = node.matches('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer') ? [node] : node.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer');
                    renderers.forEach(addInterestIcons);
                }
            }));
        });
        interestObserver.observe(document.documentElement, { childList: true, subtree: true });
        featureObservers.push(interestObserver);
    }

    function addInterestIcons(videoRenderer) {
        const menuContainer = videoRenderer.querySelector('.yt-lockup-metadata-view-model__menu-button, #menu');
        if (!menuContainer || menuContainer.querySelector('.interest-icons-container')) return;
        const container = document.createElement('div');
        container.className = 'interest-icons-container';
        const notInterestedBtn = createIconButton('Not interested', '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z" fill-rule="evenodd"></path></svg>');
        const dontRecommendBtn = createIconButton("Don't recommend channel", '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true"><g><path d="M12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm7 11H5v-2h14v2z"></path></g></svg>');
        notInterestedBtn.onclick = e => { e.stopPropagation(); handleInterestClick(videoRenderer, 'Not interested'); };
        dontRecommendBtn.onclick = e => { e.stopPropagation(); handleInterestClick(videoRenderer, "Don't recommend channel"); };
        container.append(notInterestedBtn, dontRecommendBtn);
        menuContainer.prepend(container);
    }

    function scanAndApplyInterestIcons() {
        setTimeout(() => document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer').forEach(addInterestIcons), 500);
    }

    function createIconButton(title, svg) {
        const btn = document.createElement('button');
        btn.className = 'interest-icon-button';
        btn.title = title;
        btn.innerHTML = svg;
        return btn;
    }

    function handleInterestClick(videoRenderer, optionText) {
        const menuButton = videoRenderer.querySelector('button[aria-label="More actions"], button[aria-label="Action menu"]');
        if (menuButton) {
            menuButton.click();
            setTimeout(() => {
                document.querySelectorAll('yt-list-item-view-model .yt-core-attributed-string').forEach(item => {
                    if (item.textContent.trim() === optionText) item.closest('yt-list-item-view-model').click();
                });
            }, 100);
        }
    }

    function isDarkTheme() { return document.querySelector('html')?.getAttribute('dark') !== null; }

    let settingsButton = null, refreshButton = null;

    function refreshFeed() {
        const path = window.location.pathname;
        let targetText = (path === '/') ? 'Home' : (path === '/feed/subscriptions') ? 'Subscriptions' : null;
        if (targetText) {
            for (const entry of document.querySelectorAll('ytd-guide-entry-renderer')) {
                const titleEl = entry.querySelector('yt-formatted-string#title, .title.ytd-guide-entry-renderer');
                if (titleEl?.textContent.trim() === targetText) {
                    entry.querySelector('a#endpoint')?.click();
                    return;
                }
            }
        }
        document.querySelector('ytd-topbar-logo-renderer a, a#logo')?.click();
    }

    function createUiButtons() {
        if (settings.enableRefreshButton) {
            refreshButton = document.createElement('div');
            refreshButton.innerHTML = '⟳';
            refreshButton.title = 'Refresh Feed';
            Object.assign(refreshButton.style, { position: 'fixed', bottom: '70px', left: '20px', zIndex: '9999', width: '40px', height: '40px', fontSize: '24px', lineHeight: '40px', textAlign: 'center', backgroundColor: '#065fd4', color: '#fff', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' });
            refreshButton.onclick = refreshFeed;
            document.body.appendChild(refreshButton);
        }
        settingsButton = document.createElement('div');
        settingsButton.id = 'yt-ui-enhancer-settings-button';
        settingsButton.innerHTML = '🪄';
        settingsButton.title = 'Customize Layout';
        Object.assign(settingsButton.style, { position: 'fixed', bottom: '20px', left: '20px', zIndex: '9999', width: '40px', height: '40px', fontSize: '20px', backgroundColor: '#065fd4', color: '#fff', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', display: settings.hideUIButton ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' });
        settingsButton.onclick = openSettingsMenu;
        document.body.appendChild(settingsButton);
        if (settings.hideUIButtonShortcut) window.addEventListener('keydown', e => { if (e.altKey && e.shiftKey && e.key === 'U') toggleUIButtonVisibility(); });
    }

    function toggleUIButtonVisibility() {
        if (settingsButton) {
            const isHidden = settingsButton.style.display === 'none';
            settingsButton.style.display = isHidden ? 'flex' : 'none';
            saveSetting('hideUIButton', !isHidden);
        }
    }

    function openSettingsMenu() {
        const darkMode = isDarkTheme();
        if (settingsButton) {
            settingsButton.style.pointerEvents = 'none';
            settingsButton.style.opacity = '0.5';
        }
        const overlay = document.createElement('div');
        Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '9998' });
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            if (settingsButton) {
                settingsButton.style.pointerEvents = 'auto';
                settingsButton.style.opacity = '1';
            }
        };
        const menu = document.createElement('div');
        Object.assign(menu.style, { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: darkMode ? '#222' : '#fff', color: darkMode ? '#eee' : '#000', padding: '20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', width: '360px', zIndex: '9999', fontSize: '14px', lineHeight: '1.5', textAlign: 'left' });
        menu.onclick = e => e.stopPropagation();
        menu.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <a href="https://greasyfork.org/en/scripts/533654-youtube-ui-enhancer-resize-thumbnails-modify-layout-more" target="_blank" style="text-decoration:none;color:inherit;font-size:20px;font-weight:bold;">🪄 NoShorts UI Enhancer</a>
                <button id="closeOverlay" style="background:none;border:none;color:${darkMode ? 'white' : 'black'};font-size:26px;line-height:1;cursor:pointer;padding:0;margin-left:10px;padding-bottom:5px;">×</button>
            </div>
            <label style="display:block; margin-bottom:10px;">Videos Per Row: <input id="videosPerRow" type="number" min="1" value="${settings.videosPerRow}" style="width:60px;"/></label>
            <label style="display:block; margin-bottom:20px;">Shorts Per Row: <input id="shortsPerRow" type="number" min="1" value="${settings.shortsPerRow}" style="width:60px;"/></label>
            <label style="display:block; margin-bottom:10px;"><input id="disableShorts" type="checkbox" ${settings.disableShorts ? 'checked' : ''} /> Hide Shorts Section</label>
            <label style="display:block; margin-bottom:10px;"><input id="enableShowMoreFix" type="checkbox" ${settings.enableShowMoreFix ? 'checked' : ''} /> Expand Shorts Automatically</label>
            <div style="margin-top:20px; margin-bottom:20px; border-top:1px solid ${darkMode ? 'white' : 'lightgrey'};"></div>
            <label style="display:block; margin-bottom:10px;"><input id="enableCustomTooltips" type="checkbox" ${settings.enableCustomTooltips ? 'checked' : ''} /> Show Full Titles on Hover</label>
            <label style="display:block; margin-bottom:10px;"><input id="enableAdBlocker" type="checkbox" ${settings.enableAdBlocker ? 'checked' : ''} /> Hide "Paid Promotion" Overlay (on Thumbnails)</label>
            <label style="display:block; margin-bottom:20px;"><input id="enableInterestIcons" type="checkbox" ${settings.enableInterestIcons ? 'checked' : ''} /> Not Interested/ Don't Recommend on Hover</label>
            <div style="margin-top:20px; margin-bottom:20px; border-top:1px solid ${darkMode ? 'white' : 'lightgrey'};"></div>
            <label style="display:block; margin-bottom:10px;"><input id="enableRefreshButton" type="checkbox" ${settings.enableRefreshButton ? 'checked' : ''} /> Feed Refresh Button</label>
            <label style="display:block; margin-bottom:20px;"><input id="hideUIButton" type="checkbox" ${settings.hideUIButton ? 'checked' : ''} /> Hide Script Button (Alt+Shift+U to Show)</label>
            <button id="saveSettingsBtn" style="padding:8px 14px;background:#065fd4;color:white;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">Save Changes</button>
            <button id="resetSettingsBtn" style="margin-left:10px;padding:8px 14px;background:none;color:${darkMode ? 'white' : 'black'};border:1px solid lightgrey;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">Reset to Default</button>
        `;
        overlay.appendChild(menu);
        document.body.appendChild(overlay);
        document.getElementById('closeOverlay').onclick = () => overlay.onclick();
        document.getElementById('saveSettingsBtn').onclick = () => {
            const needsReload = ['enableShowMoreFix', 'enableCustomTooltips', 'enableAdBlocker', 'enableInterestIcons', 'enableRefreshButton'].some(key => settings[key] !== document.getElementById(key).checked);
            saveSetting('videosPerRow', parseInt(document.getElementById('videosPerRow').value, 10));
            saveSetting('shortsPerRow', parseInt(document.getElementById('shortsPerRow').value, 10));
            ['disableShorts', 'enableShowMoreFix', 'hideUIButton', 'enableCustomTooltips', 'enableAdBlocker', 'enableInterestIcons', 'enableRefreshButton'].forEach(key => saveSetting(key, document.getElementById(key).checked));
            if (settingsButton) settingsButton.style.display = settings.hideUIButton ? 'none' : 'flex';
            if (needsReload) location.reload(); else overlay.onclick();
        };
        document.getElementById('resetSettingsBtn').onclick = () => { resetSettings(); location.reload(); };
    }

    function checkPageAndToggleUiButtons() {
        const isFeed = ['/', '/feed/subscriptions'].includes(window.location.pathname);
        if (settingsButton) settingsButton.style.display = (isFeed && !settings.hideUIButton) ? 'flex' : 'none';
        if (refreshButton) refreshButton.style.display = isFeed ? 'flex' : 'none';
    }

    // --- MAIN CONTROL LOGIC ---
    function handlePageChange() {
        featureObservers.forEach(obs => obs.disconnect());
        featureObservers = [];
        if (customStyle) {
            customStyle.remove();
            customStyle = null;
        }
        if (window.location.pathname !== '/feed/you') {
            applyCustomizations();
            if (settings.enableShowMoreFix) enableShowMoreFix();
            if (settings.enableCustomTooltips) initTitleHoverFeature();
            if (settings.enableAdBlocker) initAdBlocker();
            if (settings.enableInterestIcons) {
                initInterestIcons();
                scanAndApplyInterestIcons();
            }
        }
        checkPageAndToggleUiButtons();
    }

    function initializeScript() {
        if (document.getElementById('yt-ui-enhancer-settings-button')) return;
        createUiButtons();
        handlePageChange();
        window.addEventListener('yt-navigate-finish', handlePageChange);
    }

    const initObserver = new MutationObserver((_, obs) => {
        if (document.querySelector('ytd-app')) {
            initializeScript();
            obs.disconnect();
        }
    });
    initObserver.observe(document.documentElement, { childList: true, subtree: true });
})();
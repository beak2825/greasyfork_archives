// ==UserScript==
// @name Universal Link Manager Pro
// @namespace http://tampermonkey.net/
// @version 3.2
// @description A floating bubble to manage and quickly access all your important links, with extensive customization and backup features. Re-written for isolation.
// @author echoZ (Enhanced)
// @license MIT
// @match *://*/*
// @exclude *://*routerlogin.net/*
// @exclude *://*192.168.1.1/*
// @exclude *://*192.168.0.1/*
// @exclude *://*my.bankofamerica.com/*
// @exclude *://*wellsfargo.com/*
// @exclude *://*chase.com/*
// @exclude *://*citibank.com/*
// @exclude *://*online.citi.com/*
// @exclude *://*capitalone.com/*
// @exclude *://*usbank.com/*
// @exclude *://*paypal.com/*
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/564008/Universal%20Link%20Manager%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/564008/Universal%20Link%20Manager%20Pro.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Prevent running in iframes
    if (window.self !== window.top) return;

    // --- SCRIPT EXCLUSION LOGIC ---
    const excludedDomainsStorageKey = 'excludedUniversalDomains';
    const currentUrl = window.location.href;
    const excludedDomains = await GM_getValue(excludedDomainsStorageKey, []);
    const isExcluded = excludedDomains.some(domain => currentUrl.includes(domain));
    if (isExcluded) return;

    // --- Storage Keys ---
    const STORAGE_KEYS = {
        links: 'universalLinkManagerLinks',
        bubbleHidden: 'isBubbleHidden',
        position: 'bubblePosition',
        theme: 'universalLinkManagerTheme',
        customColors: 'universalLinkManagerCustomColors',
        categories: 'universalLinkManagerCategories',
        settings: 'universalLinkManagerSettings',
        excludedDomains: 'excludedUniversalDomains',
        clickStats: 'universalLinkManagerClickStats'
    };

    // --- Default Data ---
    const defaultLinks = [
        { label: 'Google', url: 'https://www.google.com/', category: 'default', shortcut: '' },
        { label: 'Gemini AI', url: 'https://gemini.google.com/', category: 'default', shortcut: '' },
        { label: 'OpenAI', url: 'https://www.openai.com/', category: 'default', shortcut: '' }
    ];
    // Updated: Categories are now objects with name and color
    const defaultCategories = [
        { name: 'default', color: '#888888' },
        { name: 'social', color: '#4287f5' },
        { name: 'work', color: '#2ecc71' },
        { name: 'entertainment', color: '#f542d4' },
        { name: 'tools', color: '#ff6b6b' }
    ];
    const defaultSettings = {
        bubbleIcon: 'λ',
        bubbleSize: 60,
        animationsEnabled: true,
        openInNewTab: true,
        showClickCount: false,
        confirmDelete: true
    };
    const defaultCustomColors = {
        bubbleBackground: '#0ff',
        bubbleText: '#001f3f',
        bubbleGlow: '#0ff',
        menuBackground: '#222',
        menuBorder: '#0ff',
        linkBackground: '#333',
        linkText: '#fff',
        linkHover: '#0ff',
        buttonBackground: '#444',
        buttonText: '#0ff',
        buttonHover: '#0ff'
    };

    // --- State Variables ---
    let isDeleteMode = false;
    let isExcludeDeleteMode = false;
    let currentCategory = 'all';
    let searchQuery = '';
    let draggedItem = null;

    // --- Data Management Functions ---
    async function getData(key, defaultValue) {
        return await GM_getValue(key, defaultValue);
    }
    async function setData(key, value) {
        await GM_setValue(key, value);
    }
    async function getLinks() {
        const links = await getData(STORAGE_KEYS.links, defaultLinks);
        return links.map(link => ({ ...link, category: link.category || 'default', shortcut: link.shortcut || '' }));
    }
    async function saveLinks(links) {
        await setData(STORAGE_KEYS.links, links);
    }
    // Updated: Handle migration from old string array to new object array
    async function getCategories() {
        const saved = await getData(STORAGE_KEYS.categories, null);
        if (!saved) {
            // First time - initialize with defaults
            await saveCategories(defaultCategories);
            return defaultCategories;
        }
        // Check if old format (array of strings) and migrate
        if (saved.length > 0 && typeof saved[0] === 'string') {
            const migrated = saved.map((name, index) => ({
                name: name,
                color: defaultCategories[index]?.color || generateRandomColor()
            }));
            await saveCategories(migrated);
            return migrated;
        }
        return saved;
    }
    async function saveCategories(categories) {
        await setData(STORAGE_KEYS.categories, categories);
    }
    // Helper: Generate random color
    function generateRandomColor() {
        const colors = ['#4287f5', '#2ecc71', '#f542d4', '#ff6b6b', '#ffa500', '#9b59b6', '#1abc9c', '#e74c3c'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    // Helper: Get category by name
    async function getCategoryByName(name) {
        const categories = await getCategories();
        return categories.find(c => c.name === name);
    }
    // Helper: Get category color
    async function getCategoryColor(name) {
        const category = await getCategoryByName(name);
        return category?.color || '#888888';
    }
    async function getSettings() {
        const saved = await getData(STORAGE_KEYS.settings, {});
        return { ...defaultSettings, ...saved };
    }
    async function saveSettings(settings) {
        await setData(STORAGE_KEYS.settings, settings);
    }
    async function getCustomColors() {
        const saved = await getData(STORAGE_KEYS.customColors, {});
        return { ...defaultCustomColors, ...saved };
    }
    async function saveCustomColors(colors) {
        await setData(STORAGE_KEYS.customColors, colors);
    }
    async function getExcludedDomains() {
        return await getData(STORAGE_KEYS.excludedDomains, []);
    }
    async function saveExcludedDomains(domains) {
        await setData(STORAGE_KEYS.excludedDomains, domains);
    }
    async function getBubbleHiddenState() {
        return await getData(STORAGE_KEYS.bubbleHidden, false);
    }
    async function saveBubbleHiddenState(isHidden) {
        await setData(STORAGE_KEYS.bubbleHidden, isHidden);
    }
    async function getButtonPosition() {
        return await getData(STORAGE_KEYS.position, { vertical: 'bottom', horizontal: 'right' });
    }
    async function saveButtonPosition(position) {
        await setData(STORAGE_KEYS.position, position);
    }
    async function getTheme() {
        return await getData(STORAGE_KEYS.theme, 'default');
    }
    async function saveTheme(theme) {
        await setData(STORAGE_KEYS.theme, theme);
    }
    async function getClickStats() {
        return await getData(STORAGE_KEYS.clickStats, {});
    }
    async function incrementClickStat(url) {
        const stats = await getClickStats();
        stats[url] = (stats[url] || 0) + 1;
        await setData(STORAGE_KEYS.clickStats, stats);
    }

    // --- Theme Definitions ---
    const themes = {
        default: { name: 'Cyan Neon', colors: defaultCustomColors },
        highContrast: { name: 'High Contrast', colors: { bubbleBackground: '#ffff00', bubbleText: '#000', bubbleGlow: '#ffff00', menuBackground: '#000', menuBorder: '#ffff00', linkBackground: '#000', linkText: '#ffff00', linkHover: '#ffff00', buttonBackground: '#333', buttonText: '#ffff00', buttonHover: '#ffff00' } },
        ocean: { name: 'Ocean Blue', colors: { bubbleBackground: '#00bcd4', bubbleText: '#fff', bubbleGlow: '#00bcd4', menuBackground: '#0d2137', menuBorder: '#00bcd4', linkBackground: '#1a3a5c', linkText: '#e0f7fa', linkHover: '#00bcd4', buttonBackground: '#1a3a5c', buttonText: '#00bcd4', buttonHover: '#00bcd4' } },
        sunset: { name: 'Sunset', colors: { bubbleBackground: '#ff6b6b', bubbleText: '#fff', bubbleGlow: '#ff6b6b', menuBackground: '#2d1b2e', menuBorder: '#ff6b6b', linkBackground: '#4a2c4a', linkText: '#ffeaa7', linkHover: '#ff6b6b', buttonBackground: '#4a2c4a', buttonText: '#ff6b6b', buttonHover: '#ff6b6b' } },
        forest: { name: 'Forest', colors: { bubbleBackground: '#2ecc71', bubbleText: '#fff', bubbleGlow: '#2ecc71', menuBackground: '#1a2f23', menuBorder: '#2ecc71', linkBackground: '#2d4a3e', linkText: '#a8e6cf', linkHover: '#2ecc71', buttonBackground: '#2d4a3e', buttonText: '#2ecc71', buttonHover: '#2ecc71' } },
        purple: { name: 'Purple Haze', colors: { bubbleBackground: '#a855f7', bubbleText: '#fff', bubbleGlow: '#a855f7', menuBackground: '#1e1033', menuBorder: '#a855f7', linkBackground: '#2d1f4a', linkText: '#e9d5ff', linkHover: '#a855f7', buttonBackground: '#2d1f4a', buttonText: '#a855f7', buttonHover: '#a855f7' } },
        light: { name: 'Light Mode', colors: { bubbleBackground: '#3b82f6', bubbleText: '#fff', bubbleGlow: '#3b82f6', menuBackground: '#ffffff', menuBorder: '#3b82f6', linkBackground: '#f0f4f8', linkText: '#1e293b', linkHover: '#3b82f6', buttonBackground: '#e2e8f0', buttonText: '#3b82f6', buttonHover: '#3b82f6' } },
        custom: { name: 'Custom', colors: null }
    };

    // --- Generate Dynamic Styles (with full reset) ---
    function generateStyles(colors, settings) {
        const bubbleSize = settings.bubbleSize || 60;
        const animationEnabled = settings.animationsEnabled !== false;
        return `
        /* ============================================= */
        /* COMPLETE CSS RESET FOR ALL ELEMENTS           */
        /* ============================================= */
        *, *::before, *::after {
            all: revert;
            box-sizing: border-box !important;
        }

        @keyframes ulm-pulse {
            0% { transform: scale(1); box-shadow: 0 0 15px 3px ${colors.bubbleGlow}, 0 0 30px 10px ${colors.bubbleGlow}; }
            50% { transform: scale(1.05); box-shadow: 0 0 20px 5px ${colors.bubbleGlow}, 0 0 40px 15px ${colors.bubbleGlow}; }
            100% { transform: scale(1); box-shadow: 0 0 15px 3px ${colors.bubbleGlow}, 0 0 30px 10px ${colors.bubbleGlow}; }
        }
        @keyframes ulm-neonGlow {
            0% { box-shadow: 0 0 10px ${colors.menuBorder}aa; }
            50% { box-shadow: 0 0 15px ${colors.menuBorder}ee, 0 0 25px ${colors.menuBorder}99; }
            100% { box-shadow: 0 0 10px ${colors.menuBorder}aa; }
        }
        @keyframes ulm-fadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        :host {
            all: initial !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            color: ${colors.linkText} !important;
        }
        .ulm-bubble {
            position: fixed !important; width: ${bubbleSize}px !important; height: ${bubbleSize}px !important; min-width: ${bubbleSize}px !important; min-height: ${bubbleSize}px !important; max-width: ${bubbleSize}px !important; max-height: ${bubbleSize}px !important;
            background-color: ${colors.bubbleBackground} !important;
            border-radius: 50% !important;
            box-shadow: 0 0 15px 3px ${colors.bubbleGlow}, 0 0 30px 10px ${colors.bubbleGlow} !important;
            cursor: pointer !important; z-index: 2147483647 !important; display: flex !important; justify-content: center !important; align-items: center !important;
            font-size: ${Math.floor(bubbleSize * 0.6)}px !important; font-weight: 900 !important; color: ${colors.bubbleText} !important; user-select: none !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            ${animationEnabled ? 'animation: ulm-pulse 3s infinite ease-in-out !important;' : ''}
            border: none !important; outline: none !important; margin: 0 !important; padding: 0 !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; transform: none !important; float: none !important; clear: none !important;
        }
        .ulm-bubble:hover { transform: scale(1.15) !important; box-shadow: 0 0 20px 5px ${colors.bubbleGlow}, 0 0 40px 15px ${colors.bubbleGlow} !important; }
        .ulm-bubble.hidden { display: none !important; }

        .ulm-show-button {
            position: fixed !important; width: ${bubbleSize}px !important; height: ${bubbleSize}px !important; min-width: ${bubbleSize}px !important; min-height: ${bubbleSize}px !important;
            cursor: pointer !important; z-index: 2147483646 !important; background-color: transparent !important;
            border: 3px dashed ${colors.bubbleBackground}66 !important; border-radius: 50% !important; display: none !important;
            margin: 0 !important; padding: 0 !important; opacity: 1 !important; visibility: visible !important;
        }
        .ulm-show-button:hover { border-color: ${colors.bubbleBackground} !important; }
        .ulm-show-button.visible { display: block !important; }

        .ulm-mini-menu {
            position: fixed !important; z-index: 2147483647 !important; padding: 10px !important; border-radius: 8px !important;
            display: none !important; flex-direction: column !important; gap: 8px !important;
            background-color: ${colors.menuBackground} !important; border: 2px solid ${colors.menuBorder} !important;
            ${animationEnabled ? 'animation: ulm-neonGlow 4s infinite ease-in-out !important;' : ''}
            box-shadow: 0 0 10px ${colors.menuBorder}aa !important;
            width: auto !important; height: auto !important; min-width: 150px !important; opacity: 1 !important; visibility: visible !important;
        }
        .ulm-mini-menu.visible { display: flex !important; }
        .ulm-mini-menu button {
            display: block !important; width: 100% !important; padding: 10px 15px !important; margin: 0 !important; color: ${colors.buttonText} !important;
            border: 1px solid ${colors.menuBorder} !important; background-color: ${colors.buttonBackground} !important; border-radius: 5px !important;
            cursor: pointer !important; font-size: 14px !important; font-family: inherit !important; text-align: center !important;
            transition: background-color 0.2s, color 0.2s !important; line-height: 1.4 !important; opacity: 1 !important; visibility: visible !important;
        }
        .ulm-mini-menu button:hover { background-color: ${colors.buttonHover} !important; color: ${colors.menuBackground} !important; }

        .ulm-main-ui {
            position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important;
            width: 440px !important; max-width: 95vw !important; max-height: 90vh !important;
            background-color: ${colors.menuBackground} !important; border: 2px solid ${colors.menuBorder} !important; border-radius: 12px !important;
            padding: 15px !important; z-index: 2147483647 !important; display: none !important; flex-direction: column !important; gap: 12px !important;
            overflow-y: auto !important; overflow-x: hidden !important;
            ${animationEnabled ? 'animation: ulm-fadeIn 0.3s ease, ulm-neonGlow 4s infinite ease-in-out !important;' : ''}
            box-shadow: 0 0 20px ${colors.menuBorder}aa, 0 0 50px rgba(0,0,0,0.5) !important;
            opacity: 1 !important; visibility: visible !important; margin: 0 !important; float: none !important;
        }
        .ulm-main-ui.visible { display: flex !important; }

        .ulm-header { display: flex !important; justify-content: space-between !important; align-items: center !important; border-bottom: 1px solid #555 !important; padding-bottom: 10px !important; margin: 0 !important; flex-shrink: 0 !important; }
        .ulm-header h2 { margin: 0 !important; padding: 0 !important; color: ${colors.menuBorder} !important; text-shadow: 0 0 5px ${colors.menuBorder} !important; font-size: 18px !important; font-weight: bold !important; line-height: 1.2 !important; }
        .ulm-header-info { font-size: 12px !important; color: ${colors.linkText}aa !important; margin: 0 !important; padding: 0 !important; }
        .ulm-close-btn { background: none !important; border: none !important; color: ${colors.linkText} !important; font-size: 28px !important; cursor: pointer !important; padding: 0 !important; margin: 0 !important; width: 35px !important; height: 35px !important; min-width: 35px !important; min-height: 35px !important; border-radius: 50% !important; transition: all 0.2s ease !important; display: flex !important; align-items: center !important; justify-content: center !important; line-height: 1 !important; }
        .ulm-close-btn:hover { background-color: #f00 !important; color: #fff !important; transform: scale(1.1) !important; }

        .ulm-search-container { display: flex !important; gap: 8px !important; flex-shrink: 0 !important; }
        .ulm-search-input { flex: 1 !important; padding: 10px 14px !important; border: 1px solid ${colors.menuBorder} !important; background-color: ${colors.linkBackground} !important; color: ${colors.linkText} !important; border-radius: 6px !important; font-size: 14px !important; font-family: inherit !important; outline: none !important; margin: 0 !important; height: auto !important; min-height: 40px !important; }
        .ulm-search-input::placeholder { color: ${colors.linkText}88 !important; }
        .ulm-search-input:focus { border-color: ${colors.buttonHover} !important; box-shadow: 0 0 5px ${colors.buttonHover}44 !important; }
        .ulm-clear-search { padding: 10px 14px !important; border: 1px solid ${colors.menuBorder} !important; background-color: ${colors.buttonBackground} !important; color: ${colors.buttonText} !important; border-radius: 6px !important; cursor: pointer !important; font-size: 14px !important; margin: 0 !important; min-width: 40px !important; min-height: 40px !important; }
        .ulm-clear-search:hover { background-color: ${colors.buttonHover} !important; color: ${colors.menuBackground} !important; }

        /* Category Filter Dropdown */
        .ulm-category-filter { display: flex !important; align-items: center !important; gap: 10px !important; padding: 5px 0 !important; flex-shrink: 0 !important; }
        .ulm-category-filter label { font-size: 13px !important; color: ${colors.linkText}cc !important; white-space: nowrap !important; }
        .ulm-category-dropdown { flex: 1 !important; padding: 8px 12px !important; border: 1px solid ${colors.menuBorder} !important; background-color: ${colors.linkBackground} !important; color: ${colors.linkText} !important; border-radius: 6px !important; font-size: 14px !important; font-family: inherit !important; cursor: pointer !important; outline: none !important; }
        .ulm-category-dropdown:focus { border-color: ${colors.buttonHover} !important; }
        .ulm-category-dropdown option { background-color: ${colors.menuBackground} !important; color: ${colors.linkText} !important; }

        .ulm-link-list { display: flex !important; flex-direction: column !important; gap: 6px !important; max-height: 250px !important; min-height: 60px !important; overflow-y: auto !important; overflow-x: hidden !important; padding: 5px !important; margin: 0 !important; flex-shrink: 0 !important; }
        .ulm-link-wrapper { display: flex !important; align-items: center !important; gap: 8px !important; width: 100% !important; margin: 0 !important; padding: 0 !important; opacity: 1 !important; visibility: visible !important; min-height: 42px !important; }
        .ulm-link-wrapper.dragging { opacity: 0.5 !important; }
        .ulm-link-wrapper.drag-over { border-top: 2px solid ${colors.menuBorder} !important; }
        .ulm-drag-handle { cursor: grab !important; padding: 5px !important; color: ${colors.linkText}88 !important; font-size: 16px !important; user-select: none !important; flex-shrink: 0 !important; }
        .ulm-drag-handle:active { cursor: grabbing !important; }

        .ulm-link { flex: 1 !important; padding: 10px 14px !important; text-decoration: none !important; border-radius: 6px !important; font-size: 14px !important; font-family: inherit !important; color: ${colors.linkText} !important; background-color: ${colors.linkBackground} !important; border: 1px solid ${colors.menuBorder} !important; display: flex !important; justify-content: space-between !important; align-items: center !important; transition: background-color 0.2s ease, color 0.2s ease !important; cursor: pointer !important; margin: 0 !important; min-height: 42px !important; opacity: 1 !important; visibility: visible !important; }
        .ulm-link:hover { background-color: ${colors.linkHover} !important; color: ${colors.menuBackground} !important; }
        .ulm-link-label { font-weight: 500 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; max-width: 200px !important; }
        .ulm-link-meta { display: flex !important; align-items: center !important; gap: 6px !important; flex-shrink: 0 !important; }
        .ulm-shortcut-badge { font-size: 10px !important; padding: 3px 7px !important; background-color: ${colors.menuBorder}44 !important; border-radius: 4px !important; font-family: monospace !important; }
        .ulm-click-count { font-size: 10px !important; color: ${colors.linkText}88 !important; }
        .ulm-category-badge { font-size: 10px !important; padding: 3px 7px !important; border-radius: 10px !important; border: 1px solid currentColor !important; }

        .ulm-action-btn { width: 32px !important; height: 32px !important; min-width: 32px !important; min-height: 32px !important; border-radius: 50% !important; cursor: pointer !important; font-weight: bold !important; transition: background-color 0.2s ease !important; display: flex !important; justify-content: center !important; align-items: center !important; padding: 0 !important; margin: 0 !important; font-size: 16px !important; flex-shrink: 0 !important; border: none !important; }
        .ulm-delete-btn { background-color: #a00 !important; border: 1px solid #f00 !important; color: #fff !important; }
        .ulm-delete-btn:hover { background-color: #f00 !important; }
        .ulm-edit-btn { background-color: ${colors.buttonBackground} !important; border: 1px solid ${colors.menuBorder} !important; color: ${colors.buttonText} !important; }
        .ulm-edit-btn:hover { background-color: ${colors.buttonHover} !important; color: ${colors.menuBackground} !important; }

        .ulm-section-tabs { display: flex !important; border-bottom: 1px solid #555 !important; gap: 0 !important; flex-shrink: 0 !important; margin: 0 !important; padding: 0 !important; }
        .ulm-section-tab { flex: 1 !important; padding: 12px 8px !important; border: none !important; background: transparent !important; color: ${colors.linkText} !important; cursor: pointer !important; transition: all 0.2s !important; font-size: 12px !important; font-family: inherit !important; border-bottom: 2px solid transparent !important; margin: 0 !important; text-align: center !important; }
        .ulm-section-tab:hover { background-color: ${colors.linkBackground} !important; }
        .ulm-section-tab.active { color: ${colors.menuBorder} !important; border-bottom-color: ${colors.menuBorder} !important; }
        .ulm-section-content { display: none !important; flex-direction: column !important; gap: 12px !important; padding: 12px 0 0 0 !important; margin: 0 !important; }
        .ulm-section-content.active { display: flex !important; }

        .ulm-form-group { display: flex !important; flex-direction: column !important; gap: 6px !important; margin: 0 !important; }
        .ulm-form-group label { font-size: 12px !important; color: ${colors.linkText}cc !important; margin: 0 !important; padding: 0 !important; }
        .ulm-form-group input, .ulm-form-group select, .ulm-form-group textarea { padding: 10px 12px !important; border: 1px solid ${colors.menuBorder} !important; background-color: ${colors.linkBackground} !important; color: ${colors.linkText} !important; border-radius: 6px !important; font-size: 14px !important; font-family: inherit !important; margin: 0 !important; outline: none !important; min-height: 40px !important; }
        .ulm-form-group input:focus, .ulm-form-group select:focus, .ulm-form-group textarea:focus { border-color: ${colors.buttonHover} !important; }
        .ulm-form-row { display: flex !important; gap: 10px !important; margin: 0 !important; }
        .ulm-form-row .ulm-form-group { flex: 1 !important; }

        .ulm-btn { padding: 10px 18px !important; border: 1px solid ${colors.menuBorder} !important; background-color: ${colors.buttonBackground} !important; color: ${colors.buttonText} !important; border-radius: 6px !important; cursor: pointer !important; font-size: 13px !important; font-family: inherit !important; transition: all 0.2s !important; margin: 0 !important; text-align: center !important; min-height: 40px !important; }
        .ulm-btn:hover { background-color: ${colors.buttonHover} !important; color: ${colors.menuBackground} !important; }
        .ulm-btn.active { background-color: ${colors.buttonHover} !important; color: ${colors.menuBackground} !important; }
        .ulm-btn-primary { background-color: ${colors.menuBorder} !important; color: ${colors.menuBackground} !important; }
        .ulm-btn-primary:hover { background-color: ${colors.buttonHover} !important; filter: brightness(1.1) !important; }
        .ulm-btn-danger { background-color: #a00 !important; border-color: #f00 !important; color: #fff !important; }
        .ulm-btn-danger:hover { background-color: #f00 !important; }
        .ulm-btn-group { display: flex !important; gap: 8px !important; flex-wrap: wrap !important; margin: 0 !important; }
        .ulm-btn-group .ulm-btn { flex: 1 !important; min-width: 100px !important; }

        .ulm-color-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin: 0 !important; }
        .ulm-color-item { display: flex !important; flex-direction: column !important; gap: 4px !important; }
        .ulm-color-item label { font-size: 11px !important; color: ${colors.linkText}aa !important; }
        .ulm-color-item input[type="color"] { width: 100% !important; height: 40px !important; padding: 3px !important; border: 1px solid ${colors.menuBorder} !important; border-radius: 6px !important; cursor: pointer !important; background-color: ${colors.linkBackground} !important; }

        .ulm-settings-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; margin: 0 !important; }
        .ulm-setting-item { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 10px !important; background-color: ${colors.linkBackground} !important; border-radius: 6px !important; min-height: 45px !important; }
        .ulm-setting-item label { font-size: 12px !important; color: ${colors.linkText} !important; }
        .ulm-toggle-switch { position: relative !important; width: 44px !important; height: 24px !important; flex-shrink: 0 !important; }
        .ulm-toggle-switch input { opacity: 0 !important; width: 0 !important; height: 0 !important; position: absolute !important; }
        .ulm-toggle-slider { position: absolute !important; cursor: pointer !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background-color: #555 !important; transition: 0.3s !important; border-radius: 24px !important; }
        .ulm-toggle-slider:before { position: absolute !important; content: "" !important; height: 18px !important; width: 18px !important; left: 3px !important; bottom: 3px !important; background-color: white !important; transition: 0.3s !important; border-radius: 50% !important; }
        .ulm-toggle-switch input:checked + .ulm-toggle-slider { background-color: ${colors.menuBorder} !important; }
        .ulm-toggle-switch input:checked + .ulm-toggle-slider:before { transform: translateX(20px) !important; }

        .ulm-range-container { display: flex !important; align-items: center !important; gap: 12px !important; }
        .ulm-range-container input[type="range"] { flex: 1 !important; height: 8px !important; -webkit-appearance: none !important; appearance: none !important; background: ${colors.linkBackground} !important; border-radius: 4px !important; outline: none !important; border: none !important; padding: 0 !important; margin: 0 !important; }
        .ulm-range-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none !important; appearance: none !important; width: 20px !important; height: 20px !important; background: ${colors.menuBorder} !important; border-radius: 50% !important; cursor: pointer !important; border: none !important; }
        .ulm-range-value { min-width: 45px !important; text-align: center !important; color: ${colors.linkText} !important; font-size: 13px !important; }

        .ulm-theme-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; margin: 0 !important; }
        .ulm-theme-option { padding: 10px 8px !important; border: 2px solid transparent !important; border-radius: 8px !important; cursor: pointer !important; text-align: center !important; font-size: 11px !important; transition: all 0.2s !important; background-color: ${colors.linkBackground} !important; color: ${colors.linkText} !important; }
        .ulm-theme-option:hover { border-color: ${colors.menuBorder}88 !important; }
        .ulm-theme-option.active { border-color: ${colors.menuBorder} !important; }
        .ulm-theme-preview { width: 100% !important; height: 35px !important; border-radius: 5px !important; margin-bottom: 6px !important; }

        .ulm-position-grid { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; margin: 0 !important; }
        .ulm-backup-area { width: 100% !important; height: 120px !important; resize: vertical !important; font-family: monospace !important; font-size: 12px !important; }
        .ulm-no-results { text-align: center !important; color: ${colors.linkText}88 !important; padding: 25px !important; font-size: 14px !important; }
        .ulm-exclude-list { display: flex !important; flex-direction: column !important; gap: 6px !important; max-height: 120px !important; overflow-y: auto !important; margin: 0 !important; padding: 5px !important; }
        .ulm-exclude-wrapper { display: flex !important; align-items: center !important; gap: 8px !important; }
        .ulm-exclude-wrapper span { flex: 1 !important; padding: 8px 12px !important; background-color: ${colors.linkBackground} !important; border: 1px solid ${colors.menuBorder} !important; border-radius: 6px !important; font-size: 13px !important; color: ${colors.linkText} !important; }

        .ulm-modal-overlay { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0,0,0,0.75) !important; z-index: 2147483647 !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        .ulm-modal-content { background: ${colors.menuBackground} !important; border: 2px solid ${colors.menuBorder} !important; border-radius: 12px !important; padding: 20px !important; max-width: 400px !important; width: 90% !important; }
        .ulm-modal-content h3 { color: ${colors.menuBorder} !important; margin: 0 0 15px 0 !important; font-size: 16px !important; }

        /* Category Management Styles */
        .ulm-category-manager { display: flex !important; flex-direction: column !important; gap: 8px !important; max-height: 200px !important; overflow-y: auto !important; padding: 5px !important; margin: 0 !important; }
        .ulm-category-item { display: flex !important; align-items: center !important; gap: 8px !important; padding: 8px 10px !important; background-color: ${colors.linkBackground} !important; border: 1px solid ${colors.menuBorder}66 !important; border-radius: 6px !important; }
        .ulm-category-item .ulm-cat-color { width: 32px !important; height: 32px !important; border: none !important; border-radius: 4px !important; cursor: pointer !important; padding: 0 !important; flex-shrink: 0 !important; }
        .ulm-category-item .ulm-cat-name { flex: 1 !important; font-size: 13px !important; color: ${colors.linkText} !important; padding: 5px 8px !important; background: transparent !important; border: 1px solid transparent !important; border-radius: 4px !important; }
        .ulm-category-item .ulm-cat-name:focus { border-color: ${colors.menuBorder} !important; background: ${colors.menuBackground} !important; outline: none !important; }
        .ulm-category-item .ulm-cat-name.editing { border-color: ${colors.menuBorder} !important; background: ${colors.menuBackground} !important; }
        .ulm-category-item .ulm-cat-count { font-size: 11px !important; color: ${colors.linkText}88 !important; padding: 2px 6px !important; background: ${colors.menuBorder}22 !important; border-radius: 10px !important; }
        .ulm-category-item .ulm-cat-actions { display: flex !important; gap: 4px !important; }
        .ulm-category-item .ulm-cat-btn { width: 28px !important; height: 28px !important; min-width: 28px !important; min-height: 28px !important; border-radius: 4px !important; cursor: pointer !important; font-size: 14px !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 0 !important; margin: 0 !important; border: 1px solid ${colors.menuBorder}66 !important; background: ${colors.buttonBackground} !important; color: ${colors.buttonText} !important; transition: all 0.2s !important; }
        .ulm-category-item .ulm-cat-btn:hover { background: ${colors.buttonHover} !important; color: ${colors.menuBackground} !important; }
        .ulm-category-item .ulm-cat-btn.delete:hover { background: #f00 !important; border-color: #f00 !important; color: #fff !important; }

        /* Scrollbar Styles */
        .ulm-link-list::-webkit-scrollbar, .ulm-exclude-list::-webkit-scrollbar, .ulm-main-ui::-webkit-scrollbar, .ulm-category-manager::-webkit-scrollbar { width: 8px !important; }
        .ulm-link-list::-webkit-scrollbar-track, .ulm-exclude-list::-webkit-scrollbar-track, .ulm-main-ui::-webkit-scrollbar-track, .ulm-category-manager::-webkit-scrollbar-track { background: ${colors.linkBackground} !important; border-radius: 4px !important; }
        .ulm-link-list::-webkit-scrollbar-thumb, .ulm-exclude-list::-webkit-scrollbar-thumb, .ulm-main-ui::-webkit-scrollbar-thumb, .ulm-category-manager::-webkit-scrollbar-thumb { background: ${colors.menuBorder}88 !important; border-radius: 4px !important; }
        .ulm-link-list::-webkit-scrollbar-thumb:hover, .ulm-exclude-list::-webkit-scrollbar-thumb:hover, .ulm-main-ui::-webkit-scrollbar-thumb:hover, .ulm-category-manager::-webkit-scrollbar-thumb:hover { background: ${colors.menuBorder} !important; }
        `;
    }

    // --- Create Shadow DOM Container ---
    function createShadowContainer() {
        const container = document.createElement('div');
        container.id = 'universal-link-manager-container';
        container.style.cssText = 'all: initial !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 0 !important; height: 0 !important; z-index: 2147483647 !important; pointer-events: none !important;';
        document.body.appendChild(container);
        const shadow = container.attachShadow({ mode: 'closed' });
        return shadow;
    }

    // --- UI Elements ---
    let shadowRoot = null;
    let styleElement = null;
    let bubble = null;
    let mainUI = null;
    let showBubbleButton = null;
    let bubbleMenu = null;

    // --- Apply Theme ---
    async function applyTheme(themeName) {
        const settings = await getSettings();
        let colors;
        if (themeName === 'custom') {
            colors = await getCustomColors();
        } else if (themes[themeName]) {
            colors = themes[themeName].colors;
        } else {
            colors = defaultCustomColors;
        }

        if (styleElement) {
            styleElement.textContent = generateStyles(colors, settings);
        }
        if (bubble) {
            bubble.textContent = settings.bubbleIcon;
            bubble.style.width = settings.bubbleSize + 'px';
            bubble.style.height = settings.bubbleSize + 'px';
            bubble.style.fontSize = Math.floor(settings.bubbleSize * 0.6) + 'px';
        }
    }

    // --- Populate Category Dropdown ---
    async function populateCategoryDropdown() {
        const dropdown = shadowRoot.querySelector('.ulm-category-dropdown');
        if (!dropdown) return;

        const categories = await getCategories();
        const links = await getLinks();

        dropdown.innerHTML = '';

        // Add "All Categories" option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = `All Categories (${links.length})`;
        dropdown.appendChild(allOption);

        // Add category options
        categories.forEach(cat => {
            const count = links.filter(l => l.category === cat.name).length;
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = `${cat.name.charAt(0).toUpperCase() + cat.name.slice(1)} (${count})`;
            if (cat.name === currentCategory) option.selected = true;
            dropdown.appendChild(option);
        });

        // Ensure current selection is maintained
        if (currentCategory !== 'all') {
            dropdown.value = currentCategory;
        }
    }

    // --- Populate Link List ---
    async function populateLinkList(links, linkListElement) {
        linkListElement.innerHTML = '';
        const clickStats = await getClickStats();
        const settings = await getSettings();
        const categories = await getCategories();

        let filteredLinks = links;
        if (currentCategory !== 'all') {
            filteredLinks = filteredLinks.filter(link => link.category === currentCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredLinks = filteredLinks.filter(link =>
                link.label.toLowerCase().includes(query) || link.url.toLowerCase().includes(query)
            );
        }

        if (filteredLinks.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'ulm-no-results';
            noResults.textContent = searchQuery ? 'No links found matching your search.' : 'No links in this category.';
            linkListElement.appendChild(noResults);
            return;
        }

        filteredLinks.forEach((linkData) => {
            const originalIndex = links.indexOf(linkData);

            const linkWrapper = document.createElement('div');
            linkWrapper.className = 'ulm-link-wrapper';
            linkWrapper.draggable = true;
            linkWrapper.dataset.index = originalIndex;

            const dragHandle = document.createElement('span');
            dragHandle.className = 'ulm-drag-handle';
            dragHandle.textContent = '⋮⋮';
            linkWrapper.appendChild(dragHandle);

            const link = document.createElement('a');
            link.href = linkData.url;
            link.target = settings.openInNewTab ? '_blank' : '_self';
            link.className = 'ulm-link';

            const labelSpan = document.createElement('span');
            labelSpan.className = 'ulm-link-label';
            labelSpan.textContent = linkData.label;
            link.appendChild(labelSpan);

            const metaSpan = document.createElement('span');
            metaSpan.className = 'ulm-link-meta';

            if (linkData.shortcut) {
                const shortcutBadge = document.createElement('span');
                shortcutBadge.className = 'ulm-shortcut-badge';
                shortcutBadge.textContent = linkData.shortcut;
                metaSpan.appendChild(shortcutBadge);
            }
            if (settings.showClickCount && clickStats[linkData.url]) {
                const clickCount = document.createElement('span');
                clickCount.className = 'ulm-click-count';
                clickCount.textContent = `(${clickStats[linkData.url]})`;
                metaSpan.appendChild(clickCount);
            }
            if (currentCategory === 'all' && linkData.category && linkData.category !== 'default') {
                const cat = categories.find(c => c.name === linkData.category);
                const categoryBadge = document.createElement('span');
                categoryBadge.className = 'ulm-category-badge';
                categoryBadge.textContent = linkData.category;
                if (cat && cat.color) {
                    categoryBadge.style.color = cat.color;
                    categoryBadge.style.borderColor = cat.color;
                }
                metaSpan.appendChild(categoryBadge);
            }
            link.appendChild(metaSpan);

            link.addEventListener('click', async (e) => {
                if (!isDeleteMode) {
                    await incrementClickStat(linkData.url);
                }
            });

            linkWrapper.appendChild(link);

            if (isDeleteMode) {
                const editButton = document.createElement('button');
                editButton.className = 'ulm-action-btn ulm-edit-btn';
                editButton.textContent = '✎';
                editButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    showEditLinkModal(links, originalIndex);
                });
                linkWrapper.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'ulm-action-btn ulm-delete-btn';
                deleteButton.textContent = '×';
                deleteButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const currentSettings = await getSettings();
                    if (currentSettings.confirmDelete) {
                        if (confirm(`Delete "${linkData.label}"?`)) {
                            links.splice(originalIndex, 1);
                            await saveLinks(links);
                            populateLinkList(links, linkListElement);
                            populateCategoryDropdown();
                        }
                    } else {
                        links.splice(originalIndex, 1);
                        await saveLinks(links);
                        populateLinkList(links, linkListElement);
                        populateCategoryDropdown();
                    }
                });
                linkWrapper.appendChild(deleteButton);
            }

            // Drag and drop
            linkWrapper.addEventListener('dragstart', () => {
                draggedItem = linkWrapper;
                linkWrapper.classList.add('dragging');
            });
            linkWrapper.addEventListener('dragend', () => {
                linkWrapper.classList.remove('dragging');
                shadowRoot.querySelectorAll('.ulm-link-wrapper').forEach(item => {
                    item.classList.remove('drag-over');
                });
            });
            linkWrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggedItem !== linkWrapper) {
                    linkWrapper.classList.add('drag-over');
                }
            });
            linkWrapper.addEventListener('dragleave', () => {
                linkWrapper.classList.remove('drag-over');
            });
            linkWrapper.addEventListener('drop', async (e) => {
                e.preventDefault();
                linkWrapper.classList.remove('drag-over');
                if (draggedItem && draggedItem !== linkWrapper) {
                    const fromIndex = parseInt(draggedItem.dataset.index);
                    const toIndex = parseInt(linkWrapper.dataset.index);
                    const [movedItem] = links.splice(fromIndex, 1);
                    links.splice(toIndex, 0, movedItem);
                    await saveLinks(links);
                    populateLinkList(links, linkListElement);
                }
            });

            linkListElement.appendChild(linkWrapper);
        });
    }

    // --- Edit Link Modal ---
    async function showEditLinkModal(links, index) {
        const linkData = links[index];
        const categories = await getCategories();
        const modal = document.createElement('div');
        modal.className = 'ulm-modal-overlay';
        modal.innerHTML = `
            <div class="ulm-modal-content">
                <h3>Edit Link</h3>
                <div class="ulm-form-group">
                    <label>Label</label>
                    <input type="text" class="ulm-edit-label" value="${linkData.label}">
                </div>
                <div class="ulm-form-group">
                    <label>URL</label>
                    <input type="text" class="ulm-edit-url" value="${linkData.url}">
                </div>
                <div class="ulm-form-group">
                    <label>Category</label>
                    <select class="ulm-edit-category"></select>
                </div>
                <div class="ulm-form-group">
                    <label>Keyboard Shortcut</label>
                    <input type="text" class="ulm-edit-shortcut" value="${linkData.shortcut || ''}" placeholder="Alt+1">
                </div>
                <div class="ulm-btn-group" style="margin-top: 15px;">
                    <button class="ulm-btn ulm-btn-primary ulm-save-edit">Save</button>
                    <button class="ulm-btn ulm-cancel-edit">Cancel</button>
                </div>
            </div>
        `;
        shadowRoot.appendChild(modal);

        const select = modal.querySelector('.ulm-edit-category');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
            if (cat.name === linkData.category) option.selected = true;
            select.appendChild(option);
        });

        modal.querySelector('.ulm-save-edit').addEventListener('click', async () => {
            const newLabel = modal.querySelector('.ulm-edit-label').value.trim();
            const newUrl = modal.querySelector('.ulm-edit-url').value.trim();
            const newCategory = modal.querySelector('.ulm-edit-category').value;
            const newShortcut = modal.querySelector('.ulm-edit-shortcut').value.trim();
            if (newLabel && newUrl) {
                links[index] = { label: newLabel, url: newUrl, category: newCategory, shortcut: newShortcut };
                await saveLinks(links);
                populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
                populateCategoryDropdown();
                modal.remove();
            }
        });

        modal.querySelector('.ulm-cancel-edit').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // --- Populate Exclude List ---
    function populateExcludeList(domains, excludeListElement) {
        excludeListElement.innerHTML = '';
        domains.forEach((domain, index) => {
            const domainWrapper = document.createElement('div');
            domainWrapper.className = 'ulm-exclude-wrapper';

            const domainLabel = document.createElement('span');
            domainLabel.textContent = domain;
            domainWrapper.appendChild(domainLabel);

            if (isExcludeDeleteMode) {
                const deleteButton = document.createElement('button');
                deleteButton.className = 'ulm-action-btn ulm-delete-btn';
                deleteButton.textContent = '×';
                deleteButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    domains.splice(index, 1);
                    await saveExcludedDomains(domains);
                    populateExcludeList(domains, excludeListElement);
                });
                domainWrapper.appendChild(deleteButton);
            }
            excludeListElement.appendChild(domainWrapper);
        });

        if (domains.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'ulm-no-results';
            noResults.textContent = 'No excluded domains.';
            excludeListElement.appendChild(noResults);
        }
    }

    // --- Render Category Manager ---
    async function renderCategoryManager() {
        const container = shadowRoot.querySelector('.ulm-category-manager');
        if (!container) return;

        const categories = await getCategories();
        const links = await getLinks();

        container.innerHTML = '';

        categories.forEach((cat, index) => {
            const count = links.filter(l => l.category === cat.name).length;
            const item = document.createElement('div');
            item.className = 'ulm-category-item';
            item.dataset.index = index;

            item.innerHTML = `
                <input type="color" class="ulm-cat-color" value="${cat.color}" title="Change color">
                <input type="text" class="ulm-cat-name" value="${cat.name}" readonly>
                <span class="ulm-cat-count">${count}</span>
                <div class="ulm-cat-actions">
                    <button class="ulm-cat-btn rename" title="Rename">✎</button>
                    <button class="ulm-cat-btn delete" title="Delete">×</button>
                </div>
            `;

            // Color change handler
            const colorInput = item.querySelector('.ulm-cat-color');
            colorInput.addEventListener('change', async (e) => {
                await handleColorChange(index, e.target.value);
            });

            // Rename handler
            const renameBtn = item.querySelector('.ulm-cat-btn.rename');
            const nameInput = item.querySelector('.ulm-cat-name');

            renameBtn.addEventListener('click', () => {
                nameInput.readOnly = false;
                nameInput.classList.add('editing');
                nameInput.focus();
                nameInput.select();
            });

            nameInput.addEventListener('blur', async () => {
                if (!nameInput.readOnly) {
                    await handleRenameCategory(index, nameInput.value.trim());
                    nameInput.readOnly = true;
                    nameInput.classList.remove('editing');
                }
            });

            nameInput.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    nameInput.blur();
                } else if (e.key === 'Escape') {
                    nameInput.value = cat.name;
                    nameInput.readOnly = true;
                    nameInput.classList.remove('editing');
                }
            });

            // Delete handler
            const deleteBtn = item.querySelector('.ulm-cat-btn.delete');
            deleteBtn.addEventListener('click', async () => {
                await handleDeleteCategory(index);
            });

            container.appendChild(item);
        });
    }

    // --- Handle Category Color Change ---
    async function handleColorChange(index, newColor) {
        const categories = await getCategories();
        categories[index].color = newColor;
        await saveCategories(categories);

        // Refresh UI
        const links = await getLinks();
        populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
    }

    // --- Handle Rename Category ---
    async function handleRenameCategory(index, newName) {
        if (!newName) {
            alert('Category name cannot be empty!');
            await renderCategoryManager();
            return;
        }

        const categories = await getCategories();
        const oldName = categories[index].name;

        if (newName === oldName) return;

        // Check for duplicate
        if (categories.some((c, i) => i !== index && c.name.toLowerCase() === newName.toLowerCase())) {
            alert('A category with this name already exists!');
            await renderCategoryManager();
            return;
        }

        // Update category name
        categories[index].name = newName.toLowerCase();
        await saveCategories(categories);

        // Update all links with the old category name
        const links = await getLinks();
        const updatedLinks = links.map(link => {
            if (link.category === oldName) {
                return { ...link, category: newName.toLowerCase() };
            }
            return link;
        });
        await saveLinks(updatedLinks);

        // Update current category filter if needed
        if (currentCategory === oldName) {
            currentCategory = newName.toLowerCase();
        }

        // Refresh UI
        await renderCategoryManager();
        await populateCategoryDropdown();
        populateLinkList(updatedLinks, mainUI.querySelector('.ulm-link-list'));
        await initializeCategorySelect();
    }

    // --- Handle Delete Category ---
    async function handleDeleteCategory(index) {
        const categories = await getCategories();
        const categoryToDelete = categories[index];

        // Prevent deleting 'default' category
        if (categoryToDelete.name === 'default') {
            alert('Cannot delete the default category!');
            return;
        }

        const links = await getLinks();
        const affectedCount = links.filter(l => l.category === categoryToDelete.name).length;

        const confirmMessage = affectedCount > 0
            ? `Are you sure? This will move ${affectedCount} link(s) to "default" category.`
            : `Delete category "${categoryToDelete.name}"?`;

        if (!confirm(confirmMessage)) return;

        // Update links to 'default'
        const updatedLinks = links.map(link => {
            if (link.category === categoryToDelete.name) {
                return { ...link, category: 'default' };
            }
            return link;
        });
        await saveLinks(updatedLinks);

        // Remove category
        categories.splice(index, 1);

        // Ensure 'default' exists
        if (!categories.some(c => c.name === 'default')) {
            categories.unshift({ name: 'default', color: '#888888' });
        }

        await saveCategories(categories);

        // Reset filter if viewing deleted category
        if (currentCategory === categoryToDelete.name) {
            currentCategory = 'all';
        }

        // Refresh UI
        await renderCategoryManager();
        await populateCategoryDropdown();
        populateLinkList(updatedLinks, mainUI.querySelector('.ulm-link-list'));
        await initializeCategorySelect();
    }

    // --- Initialize Category Select (for Add Link form) ---
    async function initializeCategorySelect() {
        const categories = await getCategories();
        const categorySelect = shadowRoot.querySelector('.ulm-link-category-select');
        if (categorySelect) {
            categorySelect.innerHTML = '';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.name;
                option.textContent = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
                categorySelect.appendChild(option);
            });
        }
    }

    // --- Apply Button Position ---
    function applyButtonPosition(position) {
        [bubble, showBubbleButton, bubbleMenu].forEach(el => {
            if (el) {
                el.style.top = 'auto';
                el.style.left = 'auto';
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            }
        });
        if (bubble) {
            bubble.style[position.vertical] = '30px';
            bubble.style[position.horizontal] = '30px';
        }
        if (showBubbleButton) {
            showBubbleButton.style[position.vertical] = '30px';
            showBubbleButton.style[position.horizontal] = '30px';
        }
        if (bubbleMenu) {
            bubbleMenu.style[position.vertical === 'top' ? 'top' : 'bottom'] = '100px';
            bubbleMenu.style[position.horizontal] = '30px';
        }

        shadowRoot.querySelectorAll('.ulm-position-grid .ulm-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = shadowRoot.querySelector(`#position-${position.vertical}-${position.horizontal}`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // --- Create Main UI HTML ---
    function createMainUIHTML() {
        return `
            <div class="ulm-header">
                <div>
                    <h2>Universal Links Pro</h2>
                    <span class="ulm-header-info ulm-link-count"></span>
                </div>
                <button class="ulm-close-btn">×</button>
            </div>
            <div class="ulm-search-container">
                <input type="text" class="ulm-search-input" placeholder="Search links...">
                <button class="ulm-clear-search">✕</button>
            </div>
            <!-- Category Filter Dropdown -->
            <div class="ulm-category-filter">
                <label>Filter by:</label>
                <select class="ulm-category-dropdown"></select>
            </div>
            <div class="ulm-link-list"></div>
            <div class="ulm-section-tabs">
                <button class="ulm-section-tab active" data-section="addLink">Add Link</button>
                <button class="ulm-section-tab" data-section="appearance">Appearance</button>
                <button class="ulm-section-tab" data-section="settings">Settings</button>
                <button class="ulm-section-tab" data-section="backup">Backup</button>
            </div>
            <div class="ulm-section-contents">
                <!-- Add Link Section -->
                <div class="ulm-section-content active" data-content="addLink">
                    <div class="ulm-form-row">
                        <div class="ulm-form-group">
                            <label>Label</label>
                            <input type="text" class="ulm-link-label-input" placeholder="My Site">
                        </div>
                        <div class="ulm-form-group">
                            <label>Category</label>
                            <select class="ulm-link-category-select"></select>
                        </div>
                    </div>
                    <div class="ulm-form-group">
                        <label>URL</label>
                        <input type="text" class="ulm-link-url-input" placeholder="https://example.com">
                    </div>
                     <div class="ulm-form-group">
                        <label>Keyboard Shortcut (optional)</label>
                        <input type="text" class="ulm-link-shortcut-input" placeholder="Alt+1">
                    </div>
                    <div class="ulm-btn-group">
                        <button class="ulm-btn ulm-btn-primary ulm-save-link-btn">Save Link</button>
                        <button class="ulm-btn ulm-delete-links-btn">Edit Mode</button>
                    </div>
                    <div class="ulm-form-group" style="margin-top: 10px;">
                        <label>Add New Category</label>
                        <div class="ulm-form-row">
                            <input type="text" class="ulm-new-category-input" placeholder="New category name" style="flex: 2;">
                            <button class="ulm-btn ulm-add-category-btn" style="flex: 1;">Add</button>
                        </div>
                    </div>
                </div>
                <!-- Appearance Section -->
                <div class="ulm-section-content" data-content="appearance">
                    <div class="ulm-form-group">
                        <label>Theme</label>
                        <div class="ulm-theme-grid"></div>
                    </div>
                    <div class="ulm-custom-color-section" style="display: none;">
                        <div class="ulm-form-group">
                            <label>Custom Colors</label>
                            <div class="ulm-color-grid"></div>
                        </div>
                    </div>
                    <div class="ulm-form-group">
                        <label>Bubble Icon</label>
                        <input type="text" class="ulm-bubble-icon-input" maxlength="2" style="width: 70px; text-align: center; font-size: 24px;">
                    </div>
                    <div class="ulm-form-group">
                        <label>Bubble Size: <span class="ulm-bubble-size-value">60</span>px</label>
                        <div class="ulm-range-container">
                            <input type="range" class="ulm-bubble-size-slider" min="40" max="100" value="60">
                        </div>
                    </div>
                    <div class="ulm-form-group">
                        <label>Button Position</label>
                        <div class="ulm-position-grid">
                            <button id="position-top-left" class="ulm-btn">↖ Top-Left</button>
                            <button id="position-top-right" class="ulm-btn">↗ Top-Right</button>
                            <button id="position-bottom-left" class="ulm-btn">↙ Bottom-Left</button>
                            <button id="position-bottom-right" class="ulm-btn">↘ Bottom-Right</button>
                        </div>
                    </div>
                </div>
                <!-- Settings Section -->
                <div class="ulm-section-content" data-content="settings">
                    <div class="ulm-settings-grid">
                        <div class="ulm-setting-item">
                            <label>Animations</label>
                            <label class="ulm-toggle-switch">
                                <input type="checkbox" class="ulm-toggle-animations">
                                <span class="ulm-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="ulm-setting-item">
                            <label>Open in New Tab</label>
                            <label class="ulm-toggle-switch">
                                <input type="checkbox" class="ulm-toggle-new-tab">
                                <span class="ulm-toggle-slider"></span>
                            </label>
                        </div>
                         <div class="ulm-setting-item">
                            <label>Show Click Count</label>
                            <label class="ulm-toggle-switch">
                                <input type="checkbox" class="ulm-toggle-click-count">
                                <span class="ulm-toggle-slider"></span>
                            </label>
                        </div>
                        <div class="ulm-setting-item">
                            <label>Confirm Delete</label>
                            <label class="ulm-toggle-switch">
                                <input type="checkbox" class="ulm-toggle-confirm-delete">
                                <span class="ulm-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <!-- Category Management Panel -->
                    <div class="ulm-form-group" style="margin-top: 15px;">
                        <label>Manage Categories</label>
                        <div class="ulm-category-manager"></div>
                    </div>
                    <div class="ulm-form-group" style="margin-top: 15px;">
                        <label>Excluded Domains</label>
                        <div class="ulm-exclude-list"></div>
                        <div class="ulm-form-row" style="margin-top: 5px;">
                            <input type="text" class="ulm-exclude-url-input" placeholder="example.com" style="flex: 2;">
                            <button class="ulm-btn ulm-save-exclude-btn" style="flex: 1;">Add</button>
                        </div>
                        <button class="ulm-btn ulm-delete-exclude-btn" style="margin-top: 5px; width: 100%;">Manage Excludes</button>
                    </div>
                    <div class="ulm-btn-group" style="margin-top: 15px;">
                        <button class="ulm-btn ulm-hide-btn">Hide Bubble</button>
                        <button class="ulm-btn ulm-btn-danger ulm-reset-btn">Reset All</button>
                    </div>
                </div>
                <!-- Backup Section -->
                <div class="ulm-section-content" data-content="backup">
                    <div class="ulm-form-group">
                        <label>Export All Data</label>
                        <p style="font-size: 12px; color: #888; margin: 5px 0;">Includes links, settings, themes, and categories.</p>
                        <button class="ulm-btn ulm-btn-primary ulm-export-all-btn" style="width: 100%;">Export All Data</button>
                        <textarea class="ulm-export-area ulm-backup-area" style="display: none; margin-top: 10px;" readonly></textarea>
                        <button class="ulm-btn ulm-copy-export-btn" style="display: none; width: 100%; margin-top: 5px;">Copy to Clipboard</button>
                    </div>
                    <div class="ulm-form-group" style="margin-top: 15px;">
                        <label>Import Data</label>
                        <textarea class="ulm-import-area ulm-backup-area" placeholder="Paste your backup data here..."></textarea>
                        <div class="ulm-btn-group" style="margin-top: 5px;">
                             <button class="ulm-btn ulm-import-links-btn">Import Links Only</button>
                             <button class="ulm-btn ulm-btn-primary ulm-import-all-btn">Import All</button>
                        </div>
                    </div>
                    <div class="ulm-form-group" style="margin-top: 15px;">
                        <label>Quick Actions</label>
                        <div class="ulm-btn-group">
                            <button class="ulm-btn ulm-export-links-only-btn">Export Links Only</button>
                            <button class="ulm-btn ulm-clear-stats-btn">Clear Click Stats</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Initialize UI Components ---
    async function initializeUIComponents() {
        const links = await getLinks();
        const categories = await getCategories();
        const settings = await getSettings();
        const currentTheme = await getTheme();
        const customColors = await getCustomColors();
        const excluded = await getExcludedDomains();

        // Update link count
        const linkCountEl = shadowRoot.querySelector('.ulm-link-count');
        if (linkCountEl) linkCountEl.textContent = `${links.length} links`;

        // Populate category select for Add Link form
        await initializeCategorySelect();

        // Populate category filter dropdown
        await populateCategoryDropdown();

        // Populate links
        await populateLinkList(links, mainUI.querySelector('.ulm-link-list'));

        // Render category manager
        await renderCategoryManager();

        // Populate exclude list
        populateExcludeList(excluded, mainUI.querySelector('.ulm-exclude-list'));

        // Populate theme grid
        const themeGrid = shadowRoot.querySelector('.ulm-theme-grid');
        if (themeGrid) {
            themeGrid.innerHTML = '';
            Object.entries(themes).forEach(([key, theme]) => {
                const themeOption = document.createElement('div');
                themeOption.className = `ulm-theme-option ${currentTheme === key ? 'active' : ''}`;
                themeOption.dataset.theme = key;
                const colors = key === 'custom' ? customColors : theme.colors;
                themeOption.innerHTML = `
                    <div class="ulm-theme-preview" style="background: linear-gradient(135deg, ${colors.bubbleBackground} 0%, ${colors.menuBackground} 100%); border: 1px solid ${colors.menuBorder};"></div>
                    <span>${theme.name}</span>
                `;
                themeGrid.appendChild(themeOption);
            });
        }

        // Populate custom color grid
        const colorGrid = shadowRoot.querySelector('.ulm-color-grid');
        if (colorGrid) {
            colorGrid.innerHTML = '';
            const colorLabels = {
                bubbleBackground: 'Bubble BG', bubbleText: 'Bubble Text', bubbleGlow: 'Bubble Glow',
                menuBackground: 'Menu BG', menuBorder: 'Menu Border',
                linkBackground: 'Link BG', linkText: 'Link Text', linkHover: 'Link Hover',
                buttonBackground: 'Button BG', buttonText: 'Button Text'
            };
            Object.entries(customColors).forEach(([key, value]) => {
                if (colorLabels[key]) {
                    const colorItem = document.createElement('div');
                    colorItem.className = 'ulm-color-item';
                    colorItem.innerHTML = `
                        <label>${colorLabels[key]}</label>
                        <input type="color" data-color-key="${key}" value="${value}">
                    `;
                    colorGrid.appendChild(colorItem);
                }
            });
        }

        // Show/hide custom color section
        const customColorSection = shadowRoot.querySelector('.ulm-custom-color-section');
        if (customColorSection) {
            customColorSection.style.display = currentTheme === 'custom' ? 'block' : 'none';
        }

        // Set values
        const bubbleIconInput = shadowRoot.querySelector('.ulm-bubble-icon-input');
        if (bubbleIconInput) bubbleIconInput.value = settings.bubbleIcon;

        const bubbleSizeSlider = shadowRoot.querySelector('.ulm-bubble-size-slider');
        const bubbleSizeValue = shadowRoot.querySelector('.ulm-bubble-size-value');
        if (bubbleSizeSlider) bubbleSizeSlider.value = settings.bubbleSize;
        if (bubbleSizeValue) bubbleSizeValue.textContent = settings.bubbleSize;

        // Set toggles
        const toggleAnimations = shadowRoot.querySelector('.ulm-toggle-animations');
        const toggleNewTab = shadowRoot.querySelector('.ulm-toggle-new-tab');
        const toggleClickCount = shadowRoot.querySelector('.ulm-toggle-click-count');
        const toggleConfirmDelete = shadowRoot.querySelector('.ulm-toggle-confirm-delete');
        if (toggleAnimations) toggleAnimations.checked = settings.animationsEnabled;
        if (toggleNewTab) toggleNewTab.checked = settings.openInNewTab;
        if (toggleClickCount) toggleClickCount.checked = settings.showClickCount;
        if (toggleConfirmDelete) toggleConfirmDelete.checked = settings.confirmDelete;
    }

    // --- Refresh UI ---
    async function refreshUI() {
        const links = await getLinks();
        const excluded = await getExcludedDomains();

        const linkCountEl = shadowRoot.querySelector('.ulm-link-count');
        if (linkCountEl) linkCountEl.textContent = `${links.length} links`;

        await populateCategoryDropdown();
        await populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
        await renderCategoryManager();
        populateExcludeList(excluded, shadowRoot.querySelector('.ulm-exclude-list'));
    }

    // --- Setup Event Listeners ---
    function setupEventListeners() {
        // Keyboard shortcut
        document.addEventListener('keydown', async (event) => {
            if (event.ctrlKey && event.altKey && (event.key === 'u' || event.key === 'U')) {
                event.preventDefault();
                const isVisible = mainUI.classList.contains('visible');
                if (isVisible) {
                    mainUI.classList.remove('visible');
                } else {
                    await refreshUI();
                    mainUI.classList.add('visible');
                }
            }
             // Check for link shortcuts
            const links = await getLinks();
            const settings = await getSettings();
            links.forEach(link => {
                if (link.shortcut) {
                    const parts = link.shortcut.toLowerCase().split('+');
                    const hasAlt = parts.includes('alt');
                    const hasCtrl = parts.includes('ctrl');
                    const hasShift = parts.includes('shift');
                    const key = parts[parts.length - 1];

                    if (
                        event.altKey === hasAlt &&
                        event.ctrlKey === hasCtrl &&
                        event.shiftKey === hasShift &&
                        event.key.toLowerCase() === key
                    ) {
                        event.preventDefault();
                        if (settings.openInNewTab) {
                            window.open(link.url, '_blank');
                        } else {
                            window.location.href = link.url;
                        }
                        incrementClickStat(link.url);
                    }
                }
            });
        });

        // Bubble click
        bubble.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = bubbleMenu.classList.contains('visible');
            bubbleMenu.classList.toggle('visible', !isVisible);
        });

        // Triple-click bubble to hide
        let bubbleClickCount = 0;
        let bubbleClickTimer = null;
        bubble.addEventListener('click', () => {
            bubbleClickCount++;
            if (bubbleClickTimer) clearTimeout(bubbleClickTimer);
            bubbleClickTimer = setTimeout(() => bubbleClickCount = 0, 300);
            if (bubbleClickCount === 3) {
                clearTimeout(bubbleClickTimer);
                bubble.classList.add('hidden');
                showBubbleButton.classList.add('visible');
                mainUI.classList.remove('visible');
                bubbleMenu.classList.remove('visible');
                saveBubbleHiddenState(true);
                bubbleClickCount = 0;
            }
        });

        // Triple-click restore
        let restoreClickCount = 0;
        let restoreClickTimer = null;
        showBubbleButton.addEventListener('click', () => {
            restoreClickCount++;
            if (restoreClickTimer) clearTimeout(restoreClickTimer);
            restoreClickTimer = setTimeout(() => restoreClickCount = 0, 400);
            if (restoreClickCount === 3) {
                clearTimeout(restoreClickTimer);
                bubble.classList.remove('hidden');
                showBubbleButton.classList.remove('visible');
                saveBubbleHiddenState(false);
                restoreClickCount = 0;
            }
        });

        // Instant Add Button
        shadowRoot.querySelector('.ulm-instant-add-btn').addEventListener('click', async () => {
            const links = await getLinks();
            const url = window.location.href;
            if (links.some(l => l.url === url)) {
                alert('This page is already in your links!');
                return;
            }
            links.push({ label: document.title || 'Untitled', url: url, category: 'default', shortcut: '' });
            await saveLinks(links);
            bubbleMenu.classList.remove('visible');
            await refreshUI();
            mainUI.classList.add('visible');
        });

        // Show Full Menu
        shadowRoot.querySelector('.ulm-show-menu-btn').addEventListener('click', async () => {
            bubbleMenu.classList.remove('visible');
            await refreshUI();
            mainUI.classList.add('visible');
        });

        // Close UI
        shadowRoot.querySelector('.ulm-close-btn').addEventListener('click', () => {
            mainUI.classList.remove('visible');
        });

        // Search
        const searchInput = shadowRoot.querySelector('.ulm-search-input');
        searchInput.addEventListener('input', async () => {
            searchQuery = searchInput.value;
            const links = await getLinks();
            populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
        });
        shadowRoot.querySelector('.ulm-clear-search').addEventListener('click', async () => {
            searchInput.value = '';
            searchQuery = '';
            const links = await getLinks();
            populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
        });

        // Category Filter Dropdown
        shadowRoot.querySelector('.ulm-category-dropdown').addEventListener('change', async (e) => {
            currentCategory = e.target.value;
            const links = await getLinks();
            populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
        });

        // Section Tabs
        shadowRoot.querySelectorAll('.ulm-section-tab').forEach(tab => {
            tab.addEventListener('click', async () => {
                shadowRoot.querySelectorAll('.ulm-section-tab').forEach(t => t.classList.remove('active'));
                shadowRoot.querySelectorAll('.ulm-section-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                shadowRoot.querySelector(`.ulm-section-content[data-content="${tab.dataset.section}"]`).classList.add('active');

                // Refresh category manager when settings tab is opened
                if (tab.dataset.section === 'settings') {
                    await renderCategoryManager();
                }
            });
        });

        // Save Link
        shadowRoot.querySelector('.ulm-save-link-btn').addEventListener('click', async () => {
            const label = shadowRoot.querySelector('.ulm-link-label-input').value.trim();
            const url = shadowRoot.querySelector('.ulm-link-url-input').value.trim();
            const category = shadowRoot.querySelector('.ulm-link-category-select').value;
            const shortcut = shadowRoot.querySelector('.ulm-link-shortcut-input').value.trim();
            if (!label || !url) {
                alert('Please enter both a label and URL.');
                return;
            }
            try { new URL(url); } catch (e) { alert('Please enter a valid URL.'); return; }

            const links = await getLinks();
            if (links.some(l => l.url === url)) {
                 if (!confirm('This URL already exists. Add anyway?')) return;
            }
            links.push({ label, url, category, shortcut });
            await saveLinks(links);
            shadowRoot.querySelector('.ulm-link-label-input').value = '';
            shadowRoot.querySelector('.ulm-link-url-input').value = '';
            shadowRoot.querySelector('.ulm-link-shortcut-input').value = '';
            await refreshUI();
        });

        // Delete Links Mode
        shadowRoot.querySelector('.ulm-delete-links-btn').addEventListener('click', async () => {
            isDeleteMode = !isDeleteMode;
            shadowRoot.querySelector('.ulm-delete-links-btn').textContent = isDeleteMode ? 'Exit Edit Mode' : 'Edit Mode';
            shadowRoot.querySelector('.ulm-delete-links-btn').classList.toggle('active', isDeleteMode);
            const links = await getLinks();
            populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
        });

        // Add Category
        shadowRoot.querySelector('.ulm-add-category-btn').addEventListener('click', async () => {
            const newCatName = shadowRoot.querySelector('.ulm-new-category-input').value.trim().toLowerCase();
            if (!newCatName) return;

            const categories = await getCategories();
            if (categories.some(c => c.name === newCatName)) {
                alert('Category already exists!');
                return;
            }

            categories.push({ name: newCatName, color: generateRandomColor() });
            await saveCategories(categories);
            shadowRoot.querySelector('.ulm-new-category-input').value = '';
            await initializeUIComponents();
        });

        // Theme Selection
        shadowRoot.querySelector('.ulm-theme-grid').addEventListener('click', async (e) => {
            const themeOption = e.target.closest('.ulm-theme-option');
            if (!themeOption) return;
            const themeName = themeOption.dataset.theme;
            await saveTheme(themeName);
            await applyTheme(themeName);
            shadowRoot.querySelectorAll('.ulm-theme-option').forEach(t => t.classList.remove('active'));
            themeOption.classList.add('active');
            shadowRoot.querySelector('.ulm-custom-color-section').style.display = themeName === 'custom' ? 'block' : 'none';
        });

        // Custom Colors
        shadowRoot.querySelector('.ulm-color-grid').addEventListener('input', async (e) => {
            if (e.target.type !== 'color') return;
            const key = e.target.dataset.colorKey;
            const value = e.target.value;
            const colors = await getCustomColors();
            colors[key] = value;
            await saveCustomColors(colors);
            const currentTheme = await getTheme();
            if (currentTheme === 'custom') {
                await applyTheme('custom');
            }
        });

        // Bubble Icon
        shadowRoot.querySelector('.ulm-bubble-icon-input').addEventListener('input', async (e) => {
            const settings = await getSettings();
            settings.bubbleIcon = e.target.value || 'λ';
            await saveSettings(settings);
            bubble.textContent = settings.bubbleIcon;
        });

        // Bubble Size
        shadowRoot.querySelector('.ulm-bubble-size-slider').addEventListener('input', async (e) => {
            const size = parseInt(e.target.value);
            shadowRoot.querySelector('.ulm-bubble-size-value').textContent = size;
            const settings = await getSettings();
            settings.bubbleSize = size;
            await saveSettings(settings);
            const currentTheme = await getTheme();
            await applyTheme(currentTheme);
        });

        // Position Buttons
        shadowRoot.querySelectorAll('.ulm-position-grid .ulm-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.id;
                const parts = id.split('-');
                const newPosition = { vertical: parts[1], horizontal: parts[2] };
                await saveButtonPosition(newPosition);
                applyButtonPosition(newPosition);
            });
        });

        // Toggle Settings
        shadowRoot.querySelector('.ulm-toggle-animations').addEventListener('change', async (e) => {
            const settings = await getSettings();
            settings.animationsEnabled = e.target.checked;
            await saveSettings(settings);
            const currentTheme = await getTheme();
            await applyTheme(currentTheme);
        });
        shadowRoot.querySelector('.ulm-toggle-new-tab').addEventListener('change', async (e) => {
            const settings = await getSettings();
            settings.openInNewTab = e.target.checked;
            await saveSettings(settings);
        });
        shadowRoot.querySelector('.ulm-toggle-click-count').addEventListener('change', async (e) => {
            const settings = await getSettings();
            settings.showClickCount = e.target.checked;
            await saveSettings(settings);
            const links = await getLinks();
            populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
        });
        shadowRoot.querySelector('.ulm-toggle-confirm-delete').addEventListener('change', async (e) => {
            const settings = await getSettings();
            settings.confirmDelete = e.target.checked;
            await saveSettings(settings);
        });

        // Exclude Domains
        shadowRoot.querySelector('.ulm-save-exclude-btn').addEventListener('click', async () => {
            const domain = shadowRoot.querySelector('.ulm-exclude-url-input').value.trim();
            if (!domain) return;
            const excluded = await getExcludedDomains();
            if (excluded.includes(domain)) {
                alert('Domain already excluded!');
                return;
            }
            excluded.push(domain);
            await saveExcludedDomains(excluded);
            shadowRoot.querySelector('.ulm-exclude-url-input').value = '';
            populateExcludeList(excluded, shadowRoot.querySelector('.ulm-exclude-list'));
        });
        shadowRoot.querySelector('.ulm-delete-exclude-btn').addEventListener('click', async () => {
            isExcludeDeleteMode = !isExcludeDeleteMode;
            shadowRoot.querySelector('.ulm-delete-exclude-btn').textContent = isExcludeDeleteMode ? 'Done' : 'Manage Excludes';
            const excluded = await getExcludedDomains();
            populateExcludeList(excluded, shadowRoot.querySelector('.ulm-exclude-list'));
        });

        // Hide Button
        shadowRoot.querySelector('.ulm-hide-btn').addEventListener('click', () => {
            bubble.classList.add('hidden');
            showBubbleButton.classList.add('visible');
            mainUI.classList.remove('visible');
            bubbleMenu.classList.remove('visible');
            saveBubbleHiddenState(true);
        });

        // Reset All
        shadowRoot.querySelector('.ulm-reset-btn').addEventListener('click', async () => {
            if (confirm('This will reset ALL data. Are you sure?')) {
                if (confirm('This cannot be undone! Continue?')) {
                    await saveLinks(defaultLinks);
                    await saveCategories(defaultCategories);
                    await saveSettings(defaultSettings);
                    await saveCustomColors(defaultCustomColors);
                    await saveTheme('default');
                    await saveExcludedDomains([]);
                    await setData(STORAGE_KEYS.clickStats, {});
                    location.reload();
                }
            }
        });

        // Export All
        shadowRoot.querySelector('.ulm-export-all-btn').addEventListener('click', async () => {
            const exportData = {
                version: '3.2',
                links: await getLinks(),
                categories: await getCategories(),
                settings: await getSettings(),
                customColors: await getCustomColors(),
                theme: await getTheme(),
                excludedDomains: await getExcludedDomains(),
                clickStats: await getClickStats()
            };
            const exportArea = shadowRoot.querySelector('.ulm-export-area');
            const copyBtn = shadowRoot.querySelector('.ulm-copy-export-btn');
            exportArea.value = JSON.stringify(exportData, null, 2);
            exportArea.style.display = 'block';
            copyBtn.style.display = 'block';
        });

        // Copy to Clipboard Button
        shadowRoot.querySelector('.ulm-copy-export-btn').addEventListener('click', async () => {
            const exportArea = shadowRoot.querySelector('.ulm-export-area');
            const textToCopy = exportArea.value;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    alert('Copied to clipboard!');
                    return;
                } catch (err) {
                    console.warn('Clipboard API failed, falling back to legacy method.', err);
                }
            }

            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = textToCopy;
            tempTextArea.style.position = 'absolute';
            tempTextArea.style.left = '-9999px';
            tempTextArea.style.top = '0';

            document.body.appendChild(tempTextArea);
            tempTextArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('Copied to clipboard!');
                } else {
                    alert('Copy failed. Your browser may not support this feature. Please copy the text manually.');
                }
            } catch (err) {
                console.error('Fallback copy method failed:', err);
                alert('An error occurred during copy. Please copy the text manually.');
            } finally {
                document.body.removeChild(tempTextArea);
            }
        });

        // Import Links Only
        shadowRoot.querySelector('.ulm-import-links-btn').addEventListener('click', async () => {
            const data = shadowRoot.querySelector('.ulm-import-area').value.trim();
            if (!data) { alert('Please paste data first.'); return; }
            try {
                const parsed = JSON.parse(data);
                let links = Array.isArray(parsed) ? parsed : (parsed.links || null);
                if (!links) throw new Error('Invalid format');
                await saveLinks(links);
                shadowRoot.querySelector('.ulm-import-area').value = '';
                alert('Links imported successfully!');
                await refreshUI();
            } catch (e) {
                alert('Invalid data format: ' + e.message);
            }
        });

        // Import All
        shadowRoot.querySelector('.ulm-import-all-btn').addEventListener('click', async () => {
            const data = shadowRoot.querySelector('.ulm-import-area').value.trim();
            if (!data) { alert('Please paste data first.'); return; }
            try {
                const parsed = JSON.parse(data);
                if (parsed.links) await saveLinks(parsed.links);
                if (parsed.categories) await saveCategories(parsed.categories);
                if (parsed.settings) await saveSettings(parsed.settings);
                if (parsed.customColors) await saveCustomColors(parsed.customColors);
                if (parsed.theme) await saveTheme(parsed.theme);
                if (parsed.excludedDomains) await saveExcludedDomains(parsed.excludedDomains);
                if (parsed.clickStats) await setData(STORAGE_KEYS.clickStats, parsed.clickStats);
                shadowRoot.querySelector('.ulm-import-area').value = '';
                alert('All data imported successfully!');
                location.reload();
            } catch (e) {
                alert('Invalid data format: ' + e.message);
            }
        });

        // Export Links Only
        shadowRoot.querySelector('.ulm-export-links-only-btn').addEventListener('click', async () => {
            const links = await getLinks();
            const exportArea = shadowRoot.querySelector('.ulm-export-area');
            const copyBtn = shadowRoot.querySelector('.ulm-copy-export-btn');
            exportArea.value = JSON.stringify(links, null, 2);
            exportArea.style.display = 'block';
            copyBtn.style.display = 'block';
        });

        // Clear Stats
        shadowRoot.querySelector('.ulm-clear-stats-btn').addEventListener('click', async () => {
            if (confirm('Clear all click statistics?')) {
                await setData(STORAGE_KEYS.clickStats, {});
                const links = await getLinks();
                populateLinkList(links, mainUI.querySelector('.ulm-link-list'));
                alert('Click stats cleared!');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!shadowRoot.contains(e.target) && e.target !== bubble) {
                bubbleMenu.classList.remove('visible');
            }
        });
    }

    // --- Initialize Script ---
    async function initializeScript() {
        // Check if already initialized
        if (document.getElementById('universal-link-manager-container')) return;

        // Wait for body
        while (!document.body) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        const buttonPosition = await getButtonPosition();
        const currentTheme = await getTheme();
        const settings = await getSettings();

        // Create shadow DOM
        shadowRoot = createShadowContainer();

        // Create style element
        styleElement = document.createElement('style');
        shadowRoot.appendChild(styleElement);
        await applyTheme(currentTheme);

        // Create bubble
        bubble = document.createElement('div');
        bubble.className = 'ulm-bubble';
        bubble.textContent = settings.bubbleIcon;
        bubble.style.pointerEvents = 'auto';
        shadowRoot.appendChild(bubble);

        // Create show bubble button
        showBubbleButton = document.createElement('div');
        showBubbleButton.className = 'ulm-show-button';
        showBubbleButton.style.pointerEvents = 'auto';
        shadowRoot.appendChild(showBubbleButton);

        // Create bubble menu
        bubbleMenu = document.createElement('div');
        bubbleMenu.className = 'ulm-mini-menu';
        bubbleMenu.style.pointerEvents = 'auto';
        bubbleMenu.innerHTML = `
            <button class="ulm-instant-add-btn">⚡ Add This Site</button>
            <button class="ulm-show-menu-btn">⚙ Open Menu</button>
        `;
        shadowRoot.appendChild(bubbleMenu);

        // Create main UI
        mainUI = document.createElement('div');
        mainUI.className = 'ulm-main-ui';
        mainUI.style.pointerEvents = 'auto';
        mainUI.innerHTML = createMainUIHTML();
        shadowRoot.appendChild(mainUI);

        // Apply position
        applyButtonPosition(buttonPosition);

        // Load initial state
        const isHidden = await getBubbleHiddenState();
        if (isHidden) {
            bubble.classList.add('hidden');
            showBubbleButton.classList.add('visible');
        }

        // Initialize components and events
        await initializeUIComponents();
        setupEventListeners();

        console.log('Universal Link Manager Pro v3.2 initialized');
    }

    // Start
    initializeScript();

})();
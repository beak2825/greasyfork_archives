// ==UserScript==
// @name         TeaBag - Threads Filter
// @namespace    https://www.threads.com
// @version      2.0
// @description  Filter out unwanted content on threads: hide verified users with optional whitelist, block users, and filter specific words.
// @author       artificialsweetener.ai, https://artificialsweetener.ai
// @match        https://www.threads.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552340/TeaBag%20-%20Threads%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/552340/TeaBag%20-%20Threads%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Script State ---
    let settings = {};
    const processedPostIds = new Set();
    let filteredCount = 0;
    let normalUserPostCount = 0;
    let verifiedUserPostCount = 0;
    let counterDisplay = null;
    let lastUrl = location.href;
    let debounceTimer;

    // --- Settings Management ---
    function loadSettings() {
        const defaults = {
            enableFilterCount: true,
            enableHideCheckmarks: true,
            enableNoFilterOnProfiles: true,
            hideSuggestions: true,
            verifiedFilterMode: 'filter_all',
            whitelist: '',
            blacklist: '',
            textFilterList: ''
        };
        settings = GM_getValue('teabag_settings', defaults);
        delete settings.ratioValue;

        for (const key in defaults) {
            if (typeof settings[key] === 'undefined') {
                settings[key] = defaults[key];
            }
        }
    }

    function textToSet(text) {
        if (!text) return new Set();
        return new Set(text.split('\n').map(u => u.trim().toLowerCase()).filter(Boolean));
    }

    // --- Core Filtering Logic ---
    function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

    function toggleGlobalCheckmarkHiding() {
        if (settings.enableHideCheckmarks) {
            document.body.classList.add('teabag-hide-checkmarks');
        } else {
            document.body.classList.remove('teabag-hide-checkmarks');
        }
    }

    function hideSuggestionBox() {
        const previouslyHidden = document.querySelector('[data-teabag-hidden-suggestion]');
        if (previouslyHidden) {
            previouslyHidden.style.display = '';
            delete previouslyHidden.dataset.teabagHiddenSuggestion;
        }
        if (!settings.hideSuggestions) return;

        const allSpans = document.querySelectorAll('span');
        for (const span of allSpans) {
            if (span.textContent.trim() === 'Suggested for you') {
                const titleContainer = span.closest('div > div > div > div');
                if (titleContainer && titleContainer.parentElement) {
                    const moduleContainer = titleContainer.parentElement;
                    moduleContainer.style.display = 'none';
                    moduleContainer.dataset.teabagHiddenSuggestion = 'true';
                    return;
                }
            }
        }
    }

    function processPost(post) {
        const timeLink = post.querySelector('a time');
        if (!timeLink) return;
        const postLink = timeLink.closest('a');
        if (!postLink || !postLink.href.includes('/post/')) return;
        const postId = postLink.href.substring(postLink.href.lastIndexOf('/') + 1);

        if (processedPostIds.has(postId)) return;
        processedPostIds.add(postId);

        const userLink = post.querySelector('a[href^="/@"]');
        if (!userLink) return;

        const username = userLink.getAttribute('href').substring(2).toLowerCase();
        const verifiedBadge = post.querySelector('svg[aria-label="Verified"]');
        const isOnProfilePage = settings.enableNoFilterOnProfiles && location.pathname.startsWith('/@');

        if (verifiedBadge) verifiedUserPostCount++; else normalUserPostCount++;

        let shouldHide = false;
        const whitelistSet = textToSet(settings.whitelist);
        const blacklistSet = textToSet(settings.blacklist);
        const textFilterSet = textToSet(settings.textFilterList);

        if (isOnProfilePage) {
            // No post hiding on profiles.
        } else if (blacklistSet.has(username)) {
            shouldHide = true;
        } else {
            const postText = post.innerText.toLowerCase();
            for (const filterText of textFilterSet) {
                if (postText.includes(filterText)) { shouldHide = true; break; }
            }
        }

        const isVerified = verifiedBadge && !whitelistSet.has(username);
        if (!shouldHide && !isOnProfilePage) {
            if (settings.verifiedFilterMode === 'filter_all' && isVerified) {
                shouldHide = true;
            }
        }

        if (shouldHide) {
            if (post.style.display !== 'none') {
                post.style.display = 'none';
                filteredCount++;
            }
        } else {
            if (post.style.display === 'none') {
                 post.style.display = '';
            }
        }
    }

    function runFilter(forceClear = false) {
        if (forceClear) {
            document.querySelectorAll('div[data-pressable-container="true"], article[role="article"]').forEach(el => el.style.display = '');
            filteredCount = 0;
            normalUserPostCount = 0;
            verifiedUserPostCount = 0;
            processedPostIds.clear();
        }
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (!location.pathname.startsWith('/@')) runFilter(true);
        }

        hideSuggestionBox();
        toggleGlobalCheckmarkHiding();

        const postSelector = 'div[data-pressable-container="true"], article[role="article"]';
        document.querySelectorAll(postSelector).forEach(processPost);
        updateCounterDisplay();
    }

    const debouncedRunFilter = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => runFilter(false), 150); };

    // --- UI & Initialization ---
    function injectGlobalCSS() {
        const css = `
            /* --- Global Filter Styles --- */
            .teabag-hide-checkmarks svg[aria-label="Verified"] { display: none !important; }

            /* --- Fluent Design Settings Panel --- */
            #teabag-settings-panel-overlay {
                --accent-color: #007AFF; --bg-color: rgba(28, 28, 28, 0.7); --border-color: rgba(255, 255, 255, 0.15);
                --text-color-primary: #FFFFFF; --text-color-secondary: #c0c0c0; --input-bg-color: rgba(55, 55, 55, 0.8);
                --hover-bg-color: rgba(70, 70, 70, 0.9); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                color: var(--text-color-primary); position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center;
                background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(16px) saturate(180%); opacity: 0; animation: teabagFadeIn 0.3s ease forwards;
            }
            @keyframes teabagFadeIn { to { opacity: 1; } }
            .teabag-form {
                background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                width: 650px; max-height: 90vh; overflow-y: auto; padding: 24px; transform: scale(0.95); animation: teabagScaleUp 0.3s ease forwards;
            }
            @keyframes teabagScaleUp { to { transform: scale(1); } }
            .teabag-form h2 { margin: 0 0 20px 0; text-align: center; font-size: 22px; font-weight: 600; color: var(--text-color-primary) !important; }
            .teabag-form fieldset { border: none; padding: 0; margin: 0 0 20px 0; }
            .teabag-form legend { font-size: 15px; font-weight: 600; margin-bottom: 12px; color: var(--text-color-primary) !important; }
            .teabag-form .description { font-size: 12px; color: var(--text-color-secondary); margin-top: -6px; margin-left: 28px; }
            .teabag-form .radio-label, .teabag-form .checkbox-label {
                display: flex; align-items: center; padding: 10px; border-radius: 8px; cursor: pointer;
                transition: background-color 0.2s ease; margin-bottom: 4px; color: var(--text-color-primary);
            }
            .teabag-form .radio-label:hover, .teabag-form .checkbox-label:hover { background: var(--hover-bg-color); }
            .teabag-form input[type="radio"], .teabag-form input[type="checkbox"] { margin-right: 12px; accent-color: var(--accent-color); width: 16px; height: 16px; }
            .teabag-form textarea { width: 100%; background: var(--input-bg-color); color: var(--text-color-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; font-family: "SF Mono", "Consolas", monospace; box-sizing: border-box; resize: vertical; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
            .teabag-form textarea:focus { outline: none; border-color: var(--accent-color); box-shadow: 0 0 0 2px var(--accent-color); }
            .teabag-form .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
            .teabag-form button { border-radius: 8px; font-weight: 600; font-size: 14px; padding: 10px 20px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s ease; }
            .teabag-form button#teabag-cancel { background: var(--input-bg-color); border-color: var(--border-color); color: var(--text-color-primary); }
            .teabag-form button#teabag-cancel:hover { background: var(--hover-bg-color); }
            .teabag-form button#teabag-save { background: var(--accent-color); color: white; }
            .teabag-form button#teabag-save:hover { filter: brightness(1.1); }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    function createSettingsPanel() {
        if (document.getElementById('teabag-settings-panel-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'teabag-settings-panel-overlay';
        const form = document.createElement('div');
        form.className = 'teabag-form';
        overlay.appendChild(form);

        const createElement = (tag, { className = '', textContent = '', ...props }, children = []) => {
            const el = document.createElement(tag);
            if (className) el.className = className;
            if (textContent) el.textContent = textContent;
            Object.assign(el, props);
            children.forEach(child => el.appendChild(child));
            return el;
        };

        const createFieldset = (legend, children) => createElement('fieldset', {}, [createElement('legend', { textContent: legend }), ...children]);
        const createTextareaGroup = (id, label, rows) => createElement('div', {}, [
            createElement('label', { htmlFor: id, textContent: label, style: { display: 'block', marginBottom: '8px' } }),
            createElement('textarea', { id, rows, value: settings[id.replace('teabag-', '')] })
        ]);
        const createInput = (type, name, { id, value, label, description, checked }) => {
            const input = createElement('input', { type, name, id, value, checked });
            const labelEl = createElement('label', { className: `${type}-label`, htmlFor: id }, [input]);
            const textWrapper = createElement('div', {});
            textWrapper.appendChild(createElement('span', { textContent: label }));
            if (description) {
                textWrapper.appendChild(createElement('p', { className: 'description', textContent: description }));
            }
            labelEl.appendChild(textWrapper);
            return labelEl;
        };

        const generalOptions = createFieldset('General Options', [
            createInput('checkbox', '', { id: 'teabag-enableFilterCount', label: 'Enable Filter Counter', checked: settings.enableFilterCount }),
            createInput('checkbox', '', { id: 'teabag-enableHideCheckmarks', label: 'Hide All Verified Checkmarks', checked: settings.enableHideCheckmarks }),
            createInput('checkbox', '', { id: 'teabag-enableNoFilterOnProfiles', label: 'Disable Filtering on Profile Pages', checked: settings.enableNoFilterOnProfiles }),
            createInput('checkbox', '', { id: 'teabag-hideSuggestions', label: 'Hide \'Suggested for you\' Box', checked: settings.hideSuggestions })
        ]);

        const verifiedModeOptions = createFieldset('Verified User Filtering', [
            createInput('radio', 'verifiedFilterMode', { id: 'teabag-mode-filter', value: 'filter_all', label: 'Filter All', description: 'Hide all posts from verified users not on your whitelist.', checked: settings.verifiedFilterMode === 'filter_all' }),
            createInput('radio', 'verifiedFilterMode', { id: 'teabag-mode-show', value: 'show_all', label: 'Show All', description: 'Do not filter users based on their verified status.', checked: settings.verifiedFilterMode === 'show_all' })
        ]);

        const listsContainer = createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' } }, [
            createTextareaGroup('teabag-whitelist', 'Whitelist (one per line)', 10),
            createTextareaGroup('teabag-blacklist', 'Blacklist (one per line)', 10)
        ]);
        const wordFilter = createTextareaGroup('teabag-textFilterList', 'Filtered Words (one per line)', 5);

        const saveButton = createElement('button', { id: 'teabag-save', textContent: 'Save & Apply' });
        const cancelButton = createElement('button', { id: 'teabag-cancel', textContent: 'Cancel' });
        const actions = createElement('div', { className: 'form-actions' }, [cancelButton, saveButton]);

        form.append(createElement('h2', { textContent: 'TeaBag Filter Settings' }), generalOptions, verifiedModeOptions, listsContainer, wordFilter, actions);
        document.body.appendChild(overlay);

        saveButton.onclick = () => {
            settings = {
                enableFilterCount: form.querySelector('#teabag-enableFilterCount').checked,
                enableHideCheckmarks: form.querySelector('#teabag-enableHideCheckmarks').checked,
                enableNoFilterOnProfiles: form.querySelector('#teabag-enableNoFilterOnProfiles').checked,
                hideSuggestions: form.querySelector('#teabag-hideSuggestions').checked,
                verifiedFilterMode: form.querySelector('input[name="verifiedFilterMode"]:checked').value,
                whitelist: form.querySelector('#teabag-whitelist').value,
                blacklist: form.querySelector('#teabag-blacklist').value,
                textFilterList: form.querySelector('#teabag-textFilterList').value
            };
            GM_setValue('teabag_settings', settings);
            overlay.remove();
            runFilter(true);
        };
        cancelButton.onclick = () => overlay.remove();
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    }

    function updateCounterDisplay() {
        if (!settings.enableFilterCount) { if (counterDisplay) counterDisplay.style.display = 'none'; return; }
        if (!counterDisplay) {
            counterDisplay = document.createElement('div');
            Object.assign(counterDisplay.style, {
                position: 'fixed', top: '10px', right: '10px', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white',
                padding: '5px 10px', borderRadius: '5px', zIndex: '100001', fontSize: '14px', fontFamily: 'sans-serif'
            });
            document.body.appendChild(counterDisplay);
        }
        counterDisplay.style.display = 'block';
        const isOnProfilePage = location.pathname.startsWith('/@');
        if (settings.enableNoFilterOnProfiles && isOnProfilePage) {
            counterDisplay.innerText = `[Filter paused on profiles]`;
        } else {
            let ratioText = '0:0';
            if (normalUserPostCount > 0 || verifiedUserPostCount > 0) {
                const divisor = gcd(normalUserPostCount, verifiedUserPostCount);
                ratioText = `${(normalUserPostCount / divisor)}:${(verifiedUserPostCount / divisor)}`;
            }
            counterDisplay.innerText = `[Filtered: ${filteredCount} | Ratio (N:V): ${ratioText}]`;
        }
    }

    // --- Initial Load ---
    loadSettings();
    GM_registerMenuCommand('TeaBag Filter Settings', createSettingsPanel);

    window.addEventListener('DOMContentLoaded', () => {
        injectGlobalCSS();
        const observer = new MutationObserver(debouncedRunFilter);
        observer.observe(document.body, { childList: true, subtree: true });
        runFilter();
    });

})();

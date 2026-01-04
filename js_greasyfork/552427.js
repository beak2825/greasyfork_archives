// ==UserScript==
// @name         Cambridge Dictionary Filter
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.2
// @description  Filter Cambridge Dictionary to show only content related to the searched word with user controls
// @author       Ethan
// @match        https://dictionary.cambridge.org/dictionary/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552427/Cambridge%20Dictionary%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/552427/Cambridge%20Dictionary%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration options with default settings
    const config = {
        hideAds: true,
        hideExtraContent: true,
        hideNavigation: true,
        showIdioms: false,
        showTranslations: true,
        showExamples: true,
        darkMode: false,
        fontSize: 'medium' // small, medium, large
    };

    // Add custom CSS for the control panel and styling
    const addStyles = () => {
        const css = `
            /* Control panel styles - Modern UI */
            #cd-filter-panel {
                position: fixed;
                top: 15px;
                right: 15px;
                background: #ffffff;
                border: none;
                border-radius: 12px;
                padding: 16px;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                font-size: 14px;
                transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
                max-width: 320px;
                opacity: 0.97;
            }

            #cd-filter-panel:hover {
                opacity: 1;
                box-shadow: 0 5px 25px rgba(0,0,0,0.15);
            }

            #cd-filter-panel.collapsed {
                width: 48px;
                height: 48px;
                overflow: hidden;
                border-radius: 24px;
                box-shadow: 0 3px 15px rgba(0,0,0,0.08);
                padding: 0;
            }

            #cd-filter-panel h3 {
                margin: 0 0 16px 0;
                font-size: 18px;
                border-bottom: 1px solid rgba(0,0,0,0.06);
                padding-bottom: 10px;
                color: #1a73e8;
                font-weight: 500;
                letter-spacing: 0.3px;
            }

            .cd-filter-toggle {
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                opacity: 0.9;
                transition: opacity 0.2s ease;
            }

            .cd-filter-toggle:hover {
                opacity: 1;
            }

            .cd-filter-toggle label {
                cursor: pointer;
                user-select: none;
                flex-grow: 1;
                color: #333;
                font-size: 14px;
                font-weight: 400;
                padding: 2px 0;
            }

            .cd-filter-toggle input {
                margin-right: 10px;
                cursor: pointer;
                width: 16px;
                height: 16px;
                accent-color: #1a73e8;
            }

            #cd-filter-panel button {
                background: #1a73e8;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 16px;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s ease, transform 0.1s ease;
                width: 100%;
                letter-spacing: 0.3px;
            }

            #cd-filter-panel button:hover {
                background: #1765cc;
                transform: translateY(-1px);
            }

            #cd-filter-panel button:active {
                transform: translateY(1px);
            }

            #cd-filter-panel select {
                width: 100%;
                margin-bottom: 10px;
                padding: 8px 10px;
                border-radius: 6px;
                border: 1px solid rgba(0,0,0,0.12);
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                color: #333;
                background-color: #fff;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath fill='%23666' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 10px center;
                appearance: none;
            }

            #cd-filter-panel-toggle {
                position: absolute;
                top: 0;
                right: 0;
                background: #1a73e8;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 22px;
                padding: 0;
                margin: 0;
                width: 48px;
                height: 48px;
                border-radius: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background 0.2s ease;
            }

            #cd-filter-panel-toggle:hover {
                background: #1765cc;
            }

            .cd-filter-panel-section {
                margin-bottom: 16px;
                border-bottom: 1px solid rgba(0,0,0,0.06);
                padding-bottom: 12px;
            }

            .cd-filter-panel-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            /* Custom search bar - Modern UI */
            #cd-search-container {
                position: fixed;
                top: 15px;
                left: 15px;
                z-index: 9998;
                background: #ffffff;
                padding: 15px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                width: 300px;
                display: none;
                font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
                opacity: 0.97;
            }

            #cd-search-container:hover {
                opacity: 1;
                box-shadow: 0 5px 25px rgba(0,0,0,0.15);
            }

            #cd-search-container.active {
                display: block;
                animation: fadeInUp 0.4s ease forwards;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 0.97;
                    transform: translateY(0);
                }
            }

            #cd-search-form {
                position: relative;
            }

            #cd-search-input {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid rgba(0,0,0,0.12);
                border-radius: 8px;
                font-size: 14px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                transition: all 0.2s ease;
                font-family: inherit;
                color: #333;
            }

            #cd-search-input:focus {
                outline: none;
                border-color: #1a73e8;
                box-shadow: 0 1px 5px rgba(26,115,232,0.2);
            }

            #cd-search-input::placeholder {
                color: #999;
            }

            #cd-search-button {
                background: #1a73e8;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 10px;
                width: 100%;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s ease, transform 0.1s ease;
                letter-spacing: 0.3px;
            }

            #cd-search-button:hover {
                background: #1765cc;
                transform: translateY(-1px);
            }

            #cd-search-button:active {
                transform: translateY(1px);
            }

            /* Hide all ads and unrelated content */
            .hide-ads #ad_topslot, .hide-ads #ad_leftslot, .hide-ads #ad_leftslot2, .hide-ads #ad_leftslot3,
            .hide-ads #ad_contentslot_1, .hide-ads #ad_contentslot_2, .hide-ads #ad_contentslot_3,
            .hide-ads #ad_btmslot, .hide-ads #ad_houseslot_a, .hide-ads #ad_houseslot_b,
            .hide-ads #ad_mpuslot, .hide-ads #ad_rightslot, .hide-ads #ad_rightslot2, .hide-ads #ad_rightslot3,
            .hide-ads #ad_ringlinkslot, .hide-ads #ad_stickyslot, .hide-ads #stickyslot_container,
            .hide-ads div[id^="google_ads_iframe"],
            .hide-ads div[id^="ad_"],
            .hide-ads div[id*="slot"],
            .hide-ads .am-default_moreslots,
            .hide-ads .bw.lmb-25.pr.htc[amp-access-template],
            .hide-ads div[amp-access],
            .hide-ads .bw.lmb-25.pr.htc,
            .hide-ads .hfr-s.lt2s.lmt-10,
            .hide-ads .cdo-more-results,
            .hide-ads aside.lmt-10,
            .hide-ads aside.lmb-20 {
                display: none !important;
            }

            /* Hide extra content */
            .hide-extra .pr.lcs.bh, .hide-extra .hax.lc.lc1.lc-m5-12, .hide-extra .lmt-10.hax, .hide-extra .lmt-10.lmb-10.hax,
            .hide-extra .lmb-20, .hide-extra .bw.hbss.x.lmb-25, .hide-extra .bw.hbss.lp-5.lpl-10.lpr-10.lp-m_l-15.lp-m_r-15,
            .hide-extra .ccn.bh.hax.lp-5.lpl-10.lpr-10.lp-m_l-15.lp-m_r-15,
            .hide-extra .iwc.bhb.pf.ctop.hp, .hide-extra .test-your-vocab,
            .hide-extra .cdo-notifications, .hide-extra .dbrowse,
            .hide-extra .pr.x.lbb.lb-cm, .hide-extra footer, .hide-extra .pf, .hide-extra .py,
            .hide-extra .hao.hbtn.hbtn-tab.hbtn-b.hbtn-tl.bh.tc-w.tb.pr,
            .hide-extra .bw,
            .hide-extra .feature-w-big,
            .hide-extra .wotd-hw,
            .hide-extra [class*="word-of-the-day"],
            .hide-extra amp-accordion,
            .hide-extra .pr.bw.hbss.x.lmb-25 {
                display: none !important;
            }

            /* Hide navigation but keep search functionality */
            .hide-nav header, .hide-nav .ccn {
                display: none !important;
            }

            /* Preserve original search form elements if found on the page */
            .hide-nav #searchbar,
            .hide-nav #cdo-search,
            .hide-nav .cdo-search-form-container,
            .hide-nav .search-input,
            .hide-nav .search-button,
            .hide-nav form[action*="search"] {
                display: none !important; /* Hide original as we'll use our custom one */
            }

            /* Show/hide idioms based on setting */
            .xref.idioms {
                display: var(--idioms-display, none) !important;
            }

            /* Show/hide examples based on setting */
            .eg.deg, .daccord {
                display: var(--examples-display, block) !important;
            }

            /* Show/hide translations based on setting */
            #translations {
                display: var(--translations-display, block) !important;
            }

            /* Content Styling - Respect Original Structure */
            .cdfilter-active {
                background-color: #fafafa !important;
            }

            /* Keep the original structure but enhance styling */
            .cdfilter-active .x.lpl-10.lpr-10.lpt-10.lpb-25.lmax.lp-m_l-20.lp-m_r-20,
            .cdfilter-active article,
            .cdfilter-active .di-body,
            .cdfilter-active #page-content {
                width: auto !important;
                max-width: none !important;
                padding: inherit !important;
                margin-top: 60px !important;
            }

            /* Make sure content fills width properly */
            .cdfilter-active .cc.fon {
                width: auto !important;
                max-width: none !important;
            }

            /* Fix word title display to prevent awkward breaks */
            .cdfilter-active .hw {
                font-size: 2.2em !important;
                font-weight: 700 !important;
                color: #1a73e8 !important;
                display: inline-block !important;
                white-space: nowrap !important;
            }

            /* Main dictionary styles */
            .cdfilter-active .entry-body {
                padding: 0 !important;
                margin-top: 20px !important;
            }

            /* Improved styling for definitions */
            .cdfilter-active .ddef_h {
                padding: 8px 12px !important;
                margin: 10px 0 !important;
                background-color: #f5f9ff !important;
                border-left: 3px solid #1a73e8 !important;
                border-radius: 3px !important;
            }

            .cdfilter-active .def.ddef_d.db {
                font-size: 1.1em !important;
                line-height: 1.5 !important;
                color: #333 !important;
                margin: 8px 0 !important;
            }

            /* Example sentences */
            .cdfilter-active .eg.deg {
                font-style: italic !important;
                color: #555 !important;
                padding: 5px 10px !important;
                margin: 8px 0 !important;
                line-height: 1.5 !important;
                border-left: 2px solid rgba(26,115,232,0.3) !important;
            }

            /* Chinese translation styling */
            .cdfilter-active .trans.dtrans {
                font-size: 1.15em !important;
                line-height: 1.5 !important;
                color: #e91e63 !important;
                font-weight: 500 !important;
                margin: 8px 0 !important;
                padding: 3px 8px !important;
                background-color: rgba(233, 30, 99, 0.05) !important;
                border-radius: 3px !important;
            }

            /* Section separators */
            .cdfilter-active .dsense {
                margin-bottom: 20px !important;
                padding-bottom: 15px !important;
                border-bottom: 1px solid #eaeaea !important;
            }

            .cdfilter-active .dsense:last-child {
                border-bottom: none !important;
            }

            .cdfilter-active .dsense_h {
                margin: 15px 0 10px 0 !important;
                padding-top: 10px !important;
            }

            /* Entry headers */
            .cdfilter-active .di-head {
                margin-bottom: 15px !important;
                padding-bottom: 10px !important;
                border-bottom: 1px solid #e0e0e0 !important;
            }

            /* Better font for translations */
            .cdfilter-active .break-cj {
                font-family: 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif !important;
            }

            /* Dark mode styling */
            .dark-mode {
                background-color: #202124 !important;
                color: #e8eaed !important;
            }

            /* Dark mode content */
            .dark-mode.cdfilter-active {
                background-color: #202124 !important;
            }

            .dark-mode .cdfilter-active article,
            .dark-mode .cdfilter-active .di-body,
            .dark-mode .cdfilter-active .entry-body,
            .dark-mode .cdfilter-active .entry {
                background-color: #292a2d !important;
                color: #e8eaed !important;
            }

            .dark-mode .cdfilter-active .hw {
                color: #8ab4f8 !important;
            }

            .dark-mode .cdfilter-active .ddef_h {
                background-color: #3c4043 !important;
                border-left-color: #8ab4f8 !important;
            }

            .dark-mode .cdfilter-active .def.ddef_d.db {
                color: #e8eaed !important;
            }

            .dark-mode .cdfilter-active .eg.deg {
                color: #bdc1c6 !important;
                border-left-color: rgba(138, 180, 248, 0.3) !important;
            }

            .dark-mode .cdfilter-active .trans.dtrans {
                color: #f48fb1 !important;
                background-color: rgba(244, 143, 177, 0.1) !important;
            }

            .dark-mode .cdfilter-active .dsense {
                border-bottom-color: #3c4043 !important;
            }

            .dark-mode .cdfilter-active .di-head {
                border-bottom-color: #3c4043 !important;
            }

            /* Dark mode UI elements */
            .dark-mode #cd-search-container,
            .dark-mode #cd-filter-panel {
                background-color: #2c2c2e !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            }

            .dark-mode #cd-search-input {
                background-color: #3c4043 !important;
                color: #e8eaed !important;
                border-color: #5f6368 !important;
            }

            .dark-mode #cd-filter-panel h3 {
                color: #8ab4f8 !important;
                border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            }

            .dark-mode .cd-filter-toggle label {
                color: #e8eaed !important;
            }

            .dark-mode #cd-filter-panel select {
                background-color: #3c4043 !important;
                color: #e8eaed !important;
                border-color: #5f6368 !important;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath fill='%23bbb' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E") !important;
            }

            .dark-mode .cd-filter-panel-section {
                border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            }

            .dark-mode #cd-filter-panel-toggle {
                background: #8ab4f8 !important;
                color: #202124 !important;
            }

            .dark-mode #cd-filter-panel-toggle:hover {
                background: #aecbfa !important;
            }

            .dark-mode #cd-search-button,
            .dark-mode #cd-filter-panel button {
                background: #8ab4f8 !important;
                color: #202124 !important;
            }

            .dark-mode #cd-search-button:hover,
            .dark-mode #cd-filter-panel button:hover {
                background: #aecbfa !important;
            }

            /* Font size options */
            .font-small .def.ddef_d.db, .font-small .eg.deg, .font-small .trans.dtrans {
                font-size: 0.9em !important;
            }

            .font-medium .def.ddef_d.db, .font-medium .eg.deg, .font-medium .trans.dtrans {
                font-size: 1.1em !important;
            }

            .font-large .def.ddef_d.db, .font-large .eg.deg, .font-large .trans.dtrans {
                font-size: 1.3em !important;
            }

            /* Hide cookie notices and popups */
            .cdfilter-active .i-amphtml-consent-ui,
            .cdfilter-active .i-amphtml-consent-ui-mask,
            .cdfilter-active #onetrust-consent-sdk,
            .cdfilter-active .privacy-message {
                display: none !important;
            }
        `;

        // Add the styles to the document
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // Create a simple search box
    const createSearchBox = () => {
        const searchContainer = document.createElement('div');
        searchContainer.id = 'cd-search-container';
        searchContainer.className = 'active';
        searchContainer.innerHTML = `
            <form id="cd-search-form">
                <input type="text" id="cd-search-input" placeholder="Search Cambridge Dictionary..." />
                <button type="submit" id="cd-search-button">Search</button>
            </form>
        `;

        document.body.appendChild(searchContainer);

        // Add event listener to the form
        document.getElementById('cd-search-form').addEventListener('submit', e => {
            e.preventDefault();
            const searchTerm = document.getElementById('cd-search-input').value.trim();
            if (searchTerm) {
                const baseUrl = 'https://dictionary.cambridge.org/dictionary/english-chinese-simplified/';
                window.location.href = baseUrl + encodeURIComponent(searchTerm);
            }
        });
    };

    // Create the control panel
    const createControlPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'cd-filter-panel';
        panel.innerHTML = `
            <button id="cd-filter-panel-toggle" title="Toggle Panel">≡</button>
            <h3>Cambridge Dictionary Filter</h3>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-ads" ${config.hideAds ? 'checked' : ''}> Hide Advertisements</label>
            </div>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-extra" ${config.hideExtraContent ? 'checked' : ''}> Hide Extra Content</label>
            </div>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-nav" ${config.hideNavigation ? 'checked' : ''}> Hide Navigation</label>
            </div>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-idioms" ${config.showIdioms ? 'checked' : ''}> Show Idioms</label>
            </div>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-translations" ${config.showTranslations ? 'checked' : ''}> Show Translations</label>
            </div>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-examples" ${config.showExamples ? 'checked' : ''}> Show Examples</label>
            </div>

            <div class="cd-filter-toggle">
                <label><input type="checkbox" id="toggle-dark" ${config.darkMode ? 'checked' : ''}> Dark Mode</label>
            </div>

            <div class="cd-filter-toggle">
                <label>Font Size:</label>
                <select id="font-size">
                    <option value="small" ${config.fontSize === 'small' ? 'selected' : ''}>Small</option>
                    <option value="medium" ${config.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="large" ${config.fontSize === 'large' ? 'selected' : ''}>Large</option>
                </select>
            </div>

            <button id="reset-settings">Reset to Defaults</button>
        `;

        document.body.appendChild(panel);

        // Add event listeners to the control panel elements
        document.getElementById('toggle-ads').addEventListener('change', e => {
            config.hideAds = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('toggle-extra').addEventListener('change', e => {
            config.hideExtraContent = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('toggle-nav').addEventListener('change', e => {
            config.hideNavigation = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('toggle-idioms').addEventListener('change', e => {
            config.showIdioms = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('toggle-translations').addEventListener('change', e => {
            config.showTranslations = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('toggle-examples').addEventListener('change', e => {
            config.showExamples = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('toggle-dark').addEventListener('change', e => {
            config.darkMode = e.target.checked;
            applySettings();
            saveSettings();
        });

        document.getElementById('font-size').addEventListener('change', e => {
            config.fontSize = e.target.value;
            applySettings();
            saveSettings();
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            config.hideAds = true;
            config.hideExtraContent = true;
            config.hideNavigation = true;
            config.showIdioms = false;
            config.showTranslations = true;
            config.showExamples = true;
            config.darkMode = false;
            config.fontSize = 'medium';

            // Update the UI controls
            document.getElementById('toggle-ads').checked = true;
            document.getElementById('toggle-extra').checked = true;
            document.getElementById('toggle-nav').checked = true;
            document.getElementById('toggle-idioms').checked = false;
            document.getElementById('toggle-translations').checked = true;
            document.getElementById('toggle-examples').checked = true;
            document.getElementById('toggle-dark').checked = false;
            document.getElementById('font-size').value = 'medium';

            applySettings();
            saveSettings();
        });

        // Toggle the panel expand/collapse
        document.getElementById('cd-filter-panel-toggle').addEventListener('click', () => {
            panel.classList.toggle('collapsed');
        });
    };

    // Apply the current settings to the page
    const applySettings = () => {
        document.body.classList.add('cdfilter-active');

        document.body.classList.toggle('hide-ads', config.hideAds);
        document.body.classList.toggle('hide-extra', config.hideExtraContent);
        document.body.classList.toggle('hide-nav', config.hideNavigation);
        document.body.classList.toggle('dark-mode', config.darkMode);
        document.body.classList.toggle('font-small', config.fontSize === 'small');
        document.body.classList.toggle('font-medium', config.fontSize === 'medium');
        document.body.classList.toggle('font-large', config.fontSize === 'large');

        // Set custom properties for show/hide elements
        document.documentElement.style.setProperty('--idioms-display', config.showIdioms ? 'block' : 'none');
        document.documentElement.style.setProperty('--translations-display', config.showTranslations ? 'block' : 'none');
        document.documentElement.style.setProperty('--examples-display', config.showExamples ? 'block' : 'none');
    };

    // Save settings to localStorage
    const saveSettings = () => {
        localStorage.setItem('cambridge-dictionary-filter', JSON.stringify(config));
    };

    // Load settings from localStorage
    const loadSettings = () => {
        const savedSettings = localStorage.getItem('cambridge-dictionary-filter');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            Object.assign(config, parsed);
        }
    };

    // Initialize the script
    const init = () => {
        // Load saved settings
        loadSettings();

        // Add styles
        addStyles();

        // Create search box
        createSearchBox();

        // Create control panel
        createControlPanel();

        // Apply the settings
        applySettings();

        // Extract current word for search box default value
        try {
            const path = window.location.pathname;
            const matches = path.match(/\/dictionary\/[^\/]+\/([^\/]+)/);
            if (matches && matches[1]) {
                const currentWord = decodeURIComponent(matches[1]);
                document.getElementById('cd-search-input').value = currentWord;
            }
        } catch (e) {
            console.error('Error extracting current word:', e);
        }

        // Hide cookie consent dialogs and other popups
        const hidePopups = () => {
            const elements = document.querySelectorAll('.i-amphtml-consent-ui, .i-amphtml-consent-ui-mask, #onetrust-consent-sdk, .privacy-message');
            elements.forEach(el => {
                el.style.display = 'none';
            });
        };

        // Run on page load and periodically
        hidePopups();
        setInterval(hidePopups, 1000);

        console.log('Cambridge Dictionary Filter: Initialized');
    };

    // Wait for the page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

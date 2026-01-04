// ==UserScript==
// @name         PDFHouse Editor Experiment Toggle
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Toggle editor variation on staging.pdfhouse.com with minimal UI
// @author       You
// @match        https://staging.pdfhouse.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550042/PDFHouse%20Editor%20Experiment%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/550042/PDFHouse%20Editor%20Experiment%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_NAME = 'combined_editors_experiment_variation';
    const UI_VISIBLE_KEY = 'ph_editor_ui_visible';
    const OPTIONS = [
        'APRYSE_ONLY',
        'NUTRIENT_ONLY',
        'NUTRIENT_EDIT',
        'EDITORS_TOGGLE'
    ];

    let panel = null;
    let toggleBtn = null;

    function createPanel() {
        panel = document.createElement('div');
        panel.id = 'ph-editor-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '70px'; // Above toggle button
        panel.style.left = '10px';
        panel.style.zIndex = '9999';
        panel.style.width = '240px';
        panel.style.background = '#ffffff';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '6px';
        panel.style.padding = '12px';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        panel.style.fontFamily = 'system-ui, sans-serif';
        panel.style.fontSize = '13px';
        panel.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        panel.style.transform = 'translateX(-260px)'; // Start off-screen
        panel.style.opacity = '0';

        const title = document.createElement('div');
        title.innerText = 'Editor Mode';
        title.style.fontSize = '14px';
        title.style.fontWeight = '600';
        title.style.marginBottom = '8px';
        title.style.color = '#333';
        panel.appendChild(title);

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '6px';
        select.style.marginBottom = '10px';
        select.style.border = '1px solid #ddd';
        select.style.borderRadius = '4px';
        select.style.background = '#fff';

        OPTIONS.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.innerText = option;
            if (localStorage.getItem(KEY_NAME) === option) {
                opt.selected = true;
            }
            select.appendChild(opt);
        });

        select.addEventListener('change', function() {
            localStorage.setItem(KEY_NAME, this.value);
            alert('Editor mode changed. Reloading...');
            location.reload();
        });

        panel.appendChild(select);

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Close';
        closeBtn.style.width = '100%';
        closeBtn.style.padding = '6px';
        closeBtn.style.border = '1px solid #ccc';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.background = '#f8f8f8';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '12px';

        closeBtn.addEventListener('click', togglePanel);

        panel.appendChild(closeBtn);
        document.body.appendChild(panel);
    }

    function createToggleBtn() {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'ph-editor-toggle';
        toggleBtn.innerText = 'Editors';
        toggleBtn.title = 'Toggle Editor Selector';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '10px';
        toggleBtn.style.left = '10px';
        toggleBtn.style.zIndex = '10000';
        toggleBtn.style.padding = '6px 12px';
        toggleBtn.style.border = '1px solid #aaa';
        toggleBtn.style.borderRadius = '4px';
        toggleBtn.style.background = '#f0f0f0';
        toggleBtn.style.color = '#333';
        toggleBtn.style.fontSize = '12px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

        toggleBtn.addEventListener('click', togglePanel);

        document.body.appendChild(toggleBtn);
    }

    function togglePanel() {
        const isVisible = panel.style.transform === 'translateX(0px)';
        if (isVisible) {
            panel.style.transform = 'translateX(-260px)';
            panel.style.opacity = '0';
            toggleBtn.innerText = 'Editors';
        } else {
            panel.style.transform = 'translateX(0px)';
            panel.style.opacity = '1';
            toggleBtn.innerText = 'Close';
        }
        localStorage.setItem(UI_VISIBLE_KEY, (!isVisible).toString());
    }

    function ensureKeyExists() {
        if (!localStorage.getItem(KEY_NAME)) {
            localStorage.setItem(KEY_NAME, OPTIONS[0]);
            console.log('[PDFHouse Editor Toggle] Initialized with default: ' + OPTIONS[0]);
        }
    }

    function init() {
        ensureKeyExists();
        createPanel();
        createToggleBtn();

        // Restore panel state
        const wasVisible = localStorage.getItem(UI_VISIBLE_KEY) === 'true';
        if (wasVisible) {
            setTimeout(togglePanel, 300); // Slight delay for smoothness after render
        }
    }

    if (window.location.hostname === 'staging.pdfhouse.com') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

})();
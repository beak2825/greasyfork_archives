// ==UserScript==
// @name         artificialanalysis.ai - UI improvements
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides dropdowns, adds a full-screen modal to filter models via URL, and expands the main content area to full width.
// @author       LetMeFixIt
// @match        https://artificialanalysis.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artificialanalysis.ai
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552329/artificialanalysisai%20-%20UI%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/552329/artificialanalysisai%20-%20UI%20improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Global State ---
    const state = {
        selectedModels: new Set(),
        nameToSlugMap: new Map(), // Maps Full Name -> correct-url-slug
        slugToNameMap: new Map(), // Maps correct-url-slug -> Full Name
    };

    // --- 2. Initialization ---
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('tbody tr td:first-child a[href^="/models/"]')) {
            runScript();
            obs.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- 3. Main Script Logic ---
    function runScript() {
        // Hide original UI elements
        document.querySelectorAll('div[class*="lg:w-1/3"]').forEach(el => el.style.display = 'none');
        document.querySelectorAll('div.mt-2.font-sans').forEach(el => el.remove());

        // Expand graph containers that were previously 2/3 width
        document.querySelectorAll('div[id^="graph-content-"]').forEach(container => {
            if (container.classList.contains('lg:w-2/3')) {
                container.classList.remove('lg:w-2/3');
                container.classList.add('lg:w-full');
            }
        });

        createCentralController();
        extractAndInitialize();
    }

    // --- 4. UI Creation ---
    function createCentralController() {
        const controllerButton = document.createElement('div');
        controllerButton.id = 'central-model-controller';
        controllerButton.textContent = 'Select & Filter Models';
        document.body.appendChild(controllerButton);

        const modalContainer = document.createElement('div');
        modalContainer.id = 'filter-modal-overlay';
        modalContainer.innerHTML = `
            <div id="filter-modal-content">
                <div id="filter-modal-header">
                    <h2>Select Models to Display</h2>
                    <span id="filter-modal-close">&times;</span>
                </div>
                <div id="filter-modal-search-container">
                    <input type="text" id="filter-modal-search" placeholder="Search for models...">
                </div>
                <div id="filter-modal-body">
                    <div id="filter-modal-list">
                        <p>Loading models...</p>
                    </div>
                    <div id="selected-models-sidebar">
                        <h3>Selected Models</h3>
                        <div id="selected-models-list">
                            <p>No models selected.</p>
                        </div>
                    </div>
                </div>
                <div id="filter-modal-footer">
                    <button id="unselect-all-button">Unselect All</button>
                    <button id="apply-filters-button">Apply Filters</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);

        GM_addStyle(`
            /* --- Injected UI Styles --- */
            #central-model-controller {
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                z-index: 9998; background-color: #4C6EF5; color: white; padding: 12px 25px;
                border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2); transition: background-color 0.2s;
            }
            #central-model-controller:hover { background-color: #3B5BDB; }
            #filter-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6); z-index: 10000;
                display: none; justify-content: center; align-items: center;
            }
            #filter-modal-content {
                background-color: #fff; width: 80%; max-width: 1400px; height: 90vh;
                border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: flex; flex-direction: column; overflow: hidden;
            }
            #filter-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; border-bottom: 1px solid #dee2e6; }
            #filter-modal-header h2 { font-size: 20px; font-weight: 600; margin: 0; }
            #filter-modal-close { font-size: 30px; cursor: pointer; color: #868e96; }
            #filter-modal-search-container { padding: 10px 25px; border-bottom: 1px solid #dee2e6; }
            #filter-modal-search { width: 100%; padding: 10px; font-size: 16px; border-radius: 5px; border: 1px solid #ced4da; }
            #filter-modal-body { display: flex; flex-grow: 1; overflow: hidden; }
            #filter-modal-list {
                flex-grow: 1; overflow-y: auto; padding: 25px;
                display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-content: start;
            }
            .modal-list-item label { display: flex; align-items: center; cursor: pointer; font-size: 14px; }
            .modal-list-item input { margin-right: 10px; width: 16px; height: 16px; }
            #selected-models-sidebar { width: 30%; min-width: 250px; border-left: 1px solid #dee2e6; display: flex; flex-direction: column; }
            #selected-models-sidebar h3 { margin: 0; padding: 15px 20px; font-size: 16px; border-bottom: 1px solid #e9ecef; color: #495057; }
            #selected-models-list { flex-grow: 1; overflow-y: auto; padding: 15px 20px; }
            .selected-item { padding: 4px 0; font-size: 14px; }
            #filter-modal-footer { padding: 15px 25px; border-top: 1px solid #dee2e6; display: flex; justify-content: flex-end; align-items: center; }
            #unselect-all-button {
                background-color: #f1f3f4; color: #495057; border: 1px solid #dee2e6;
                padding: 11px 20px; font-size: 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;
            }
            #unselect-all-button:hover { background-color: #e9ecef; }
            #apply-filters-button {
                background-color: #4C6EF5; color: white; border: none; padding: 12px 30px;
                font-size: 16px; font-weight: bold; border-radius: 5px; cursor: pointer;
            }
            #apply-filters-button:hover { background-color: #3B5BDB; }

            /* --- NEW: Page Layout Expansion --- */
            .container.mx-auto {
                max-width: 98% !important;
                padding-left: 10px !important;
                padding-right: 10px !important;
            }
        `);

        controllerButton.addEventListener('click', () => modalContainer.style.display = 'flex');
        document.getElementById('filter-modal-close').addEventListener('click', () => modalContainer.style.display = 'none');
        document.getElementById('apply-filters-button').addEventListener('click', applyFilters);
        document.getElementById('unselect-all-button').addEventListener('click', unselectAll);
    }

    // --- 5. Data & State Management ---
    function extractAndInitialize() {
        const modelLinks = document.querySelectorAll('tbody tr td:first-child a[href^="/models/"]');

        modelLinks.forEach(a => {
            const name = a.textContent.trim();
            const slug = a.getAttribute('href').split('/')[2];
            if (name && slug) {
                state.nameToSlugMap.set(name, slug);
                state.slugToNameMap.set(slug, name);
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        const modelsFromUrl = urlParams.get('models');

        if (modelsFromUrl) {
            modelsFromUrl.split(',').forEach(slug => {
                if (state.slugToNameMap.has(slug)) {
                    state.selectedModels.add(state.slugToNameMap.get(slug));
                }
            });
        }
        buildModalUI();
    }

    function buildModalUI() {
        const listContainer = document.getElementById('filter-modal-list');
        let listHtml = '';
        const sortedModels = [...state.nameToSlugMap.keys()].sort();

        sortedModels.forEach(name => {
            const isChecked = state.selectedModels.has(name) ? 'checked' : '';
            listHtml += `
                <div class="modal-list-item">
                    <label>
                        <input type="checkbox" data-model-name="${name}" ${isChecked}>
                        <span>${name}</span>
                    </label>
                </div>`;
        });
        listContainer.innerHTML = listHtml;

        listContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const modelName = e.target.dataset.modelName;
                if (e.target.checked) {
                    state.selectedModels.add(modelName);
                } else {
                    state.selectedModels.delete(modelName);
                }
                updateSelectedModelsSidebar();
            });
        });

        document.getElementById('filter-modal-search').addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            listContainer.querySelectorAll('.modal-list-item').forEach(item => {
                const modelName = item.querySelector('span').textContent.toLowerCase();
                item.style.display = modelName.includes(searchTerm) ? 'block' : 'none';
            });
        });

        updateSelectedModelsSidebar();
    }

    function updateSelectedModelsSidebar() {
        const sidebarList = document.getElementById('selected-models-list');
        if (state.selectedModels.size === 0) {
            sidebarList.innerHTML = '<p>No models selected.</p>';
            return;
        }
        const sortedSelections = [...state.selectedModels].sort();
        sidebarList.innerHTML = sortedSelections.map(name => `<div class="selected-item">${name}</div>`).join('');
    }

    function unselectAll() {
        state.selectedModels.clear();
        document.querySelectorAll('#filter-modal-list input[type="checkbox"]').forEach(cb => cb.checked = false);
        updateSelectedModelsSidebar();
    }

    function applyFilters() {
        if (state.selectedModels.size === 0) {
             window.location.href = `${window.location.origin}${window.location.pathname}`;
             return;
        }

        const modelSlugs = Array.from(state.selectedModels)
            .map(name => state.nameToSlugMap.get(name))
            .filter(slug => slug);

        const newUrl = `${window.location.origin}${window.location.pathname}?models=${modelSlugs.join(',')}`;
        window.location.href = newUrl;
    }

})();
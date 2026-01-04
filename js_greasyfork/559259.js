// ==UserScript==
// @name        Fast Farming Checkbox Everywhere
// @namespace   https://github.com/raphaelwdrf/ffcheckboxew
// @description Adds checkbox everywhere on Fast-farming site.
// @version     1.4
// @supportURL  https://github.com/raphaelwdrf/ffcheckboxew/issues
// @match       https://fast.farming-community.eu/*
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/559259/Fast%20Farming%20Checkbox%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/559259/Fast%20Farming%20Checkbox%20Everywhere.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //Start: Disable native checkbox
    function disableCheckboxTable(gridRoot) {
        // Detect real AG Grid checkbox presence
        if (!gridRoot.querySelector('.ag-selection-checkbox')) return;

        gridRoot.querySelectorAll('input.ag-checkbox-input').forEach(el => {
            if (el.dataset.ffCustom) return; // ← protects your script
            el.checked = false;
            el.disabled = true;
            el.style.pointerEvents = 'none';
            el.closest('.ag-selection-checkbox')?.remove();
        });

        /* 1️⃣ Remove checkbox column interaction */
        gridRoot.querySelectorAll(
            '.ag-selection-checkbox input.ag-checkbox-input'
        ).forEach(el => {
            el.checked = false;
            el.disabled = true;
            el.style.pointerEvents = 'none';
            el.style.display = 'none';
        });

        /* 2️⃣ Kill row selection state */
        gridRoot.querySelectorAll('.ag-row').forEach(row => {
            row.classList.remove('ag-row-selected');
            row.setAttribute('aria-selected', 'false');
        });

        /* 3️⃣ Block future selection (capture phase) */
        gridRoot.addEventListener('mousedown', e => {
            if (
                e.target.closest('.ag-selection-checkbox') ||
                e.target.closest('.ag-row')
            ) {
                e.stopImmediatePropagation();
            }
        }, true);

        gridRoot.addEventListener('mousedown', e => {
            if (e.target.closest('.ag-selection-checkbox')) {
                e.stopImmediatePropagation();
            }
        }, true);

        /* 4️⃣ Defensive cleanup (AG Grid re-applies state) */
        const observer = new MutationObserver(() => {
            gridRoot.querySelectorAll('.ag-row-selected').forEach(row => {
                row.classList.remove('ag-row-selected');
                row.setAttribute('aria-selected', 'false');
            });
        });

        observer.observe(gridRoot, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'aria-selected']
        });
    }

    function scan() {
        document.querySelectorAll('.ag-root').forEach(disableCheckboxTable);
    }

    scan();

    const globalObserver = new MutationObserver(scan);
    globalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });


    //Start: Create checkboxes
    const STORAGE_KEY = 'fast_aggrid_checklist_name';
    const PRIORITY_KEY = 'fast_aggrid_priority_name';

    function injectCheckboxes() {
        const state = GM_getValue(STORAGE_KEY, {});
        const priorityState = GM_getValue(PRIORITY_KEY, {});

        document
            .querySelectorAll('.ag-cell[col-id="Name"] .ag-cell-wrapper')
            .forEach(wrapper => {

                if (wrapper.querySelector('.ff-checkbox')) return;

                const cell = wrapper.querySelector('.ag-cell-value');
                if (!cell) return;

                const name = cell.textContent.trim();
                if (!name) return;

                const pageKey = location.pathname; // current page URL
                if (!pageKey) return;

                const nameKey = `${name}||${pageKey}`;
                if (!nameKey) return;

                const row = wrapper.closest('.ag-row');

                // Done Checkbox
                const checkbox = document.createElement('input');
                checkbox.dataset.ffCustom = 'true';
                checkbox.type = 'checkbox';
                checkbox.className = 'ff-checkbox';
                checkbox.checked = !!state[nameKey];

                checkbox.style.marginRight = '6px';
                checkbox.style.cursor = 'pointer';
                checkbox.style.accentColor = 'rgba(0, 255, 0)';

                // Restore visual state Done Checkbox
                if (row && checkbox.checked) {
                    row.style.opacity = '0.5';
                    row.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                }

                checkbox.addEventListener('change', () => {
                    state[nameKey] = checkbox.checked;
                    GM_setValue(STORAGE_KEY, state);

                    if (row) {
                        row.style.opacity = checkbox.checked ? '0.5' : '';
                        row.style.backgroundColor = checkbox.checked ? 'rgba(0, 255, 0, 0.1)' : '';
                    }
                });

                //Priority Checkbox
                const priorityCheckbox = document.createElement('input');
                priorityCheckbox.dataset.ffCustom = 'true';
                priorityCheckbox.type = 'checkbox';
                priorityCheckbox.className = 'ff-priority-checkbox';
                priorityCheckbox.checked = !!priorityState[nameKey];

                priorityCheckbox.style.marginRight = '6px';
                priorityCheckbox.style.cursor = 'pointer';
                priorityCheckbox.style.accentColor = 'orange';

                // Restore visual state Priority Checkbox
                if (row && priorityCheckbox.checked) {
                    row.style.boxShadow = 'inset 8px 0 0 orange';
                    row.style.textShadow = '0 0 10px orange';
                }
                priorityCheckbox.addEventListener('change', () => {
                    priorityState[nameKey] = priorityCheckbox.checked;
                    GM_setValue(PRIORITY_KEY, priorityState);

                    if (row) {
                        row.style.boxShadow = priorityCheckbox.checked ? 'inset 8px 0 0 orange' : '';
                        row.style.textShadow = priorityCheckbox.checked ? '0 0 10px orange' : '';
                    }
                });

                wrapper.prepend(checkbox);
                wrapper.prepend(priorityCheckbox);
            });
    }

    const observer = new MutationObserver(injectCheckboxes);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Reset done checklist page
    function addResetButtonPageDone() {

        const btn = document.createElement('button');
        btn.textContent = '🗑';

        btn.style.background = 'green';

        btn.style.position = 'fixed';
        btn.style.bottom = '50px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';

        btn.ondblclick = () => {
            if (!confirm(
                'This will uncheck all done items on this page only.\n' +
                'This action cannot be undone.\n' +
                'Continue?'
            )) return;

            const state = GM_getValue(STORAGE_KEY, {});
            const pageKey = location.pathname;

            Object.keys(state).forEach(key => {
                if (key.endsWith(`||${pageKey}`)) {
                    delete state[key];
                }
            });

            GM_setValue(STORAGE_KEY, state);

            // Visually uncheck checkboxes on this page
            document
                .querySelectorAll('input[type="checkbox"].ff-checkbox')
                .forEach(cb => {
                    cb.checked = false;

                const row = cb.closest('.ag-row');
                if (row) {
                    row.style.opacity = '';
                    row.style.backgroundColor = '';
                    //row.style.textShadow = '';
                    //row.style.boxShadow = '';
                }
            })

        };

        document.body.appendChild(btn);
    }


    // Reset priority checklist page
    function addResetButtonPagePriority() {

        const btn = document.createElement('button');
        btn.textContent = '🗑';

        btn.style.background = 'orange';

        btn.style.position = 'fixed';
        btn.style.bottom = '50px';
        btn.style.right = '50px';
        btn.style.zIndex = '9999';

        btn.ondblclick = () => {
            if (!confirm(
                'This will uncheck all priority items on this page only.\n' +
                'This action cannot be undone.\n' +
                'Continue?'
            )) return;

            const state = GM_getValue(PRIORITY_KEY, {});
            const pageKey = location.pathname;

            Object.keys(state).forEach(key => {
                if (key.endsWith(`||${pageKey}`)) {
                    delete state[key];
                }
            });

            GM_setValue(PRIORITY_KEY, state);

            // Visually uncheck checkboxes on this page
            document
                .querySelectorAll('input[type="checkbox"].ff-priority-checkbox')
                .forEach(cb => {
                    cb.checked = false;

                const row = cb.closest('.ag-row');
                if (row) {
                    //row.style.opacity = '';
                    //row.style.backgroundColor = '';
                    row.style.textShadow = '';
                    row.style.boxShadow = '';
                }
            })

        };

        document.body.appendChild(btn);
    }

    // Reset checklist site
    function addResetButtonSite() {

        const btn = document.createElement('button');
        btn.textContent = '🗑';

        btn.style.background = 'red';

        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';

        btn.ondblclick = () => {
            if (!confirm(
                'This will uncheck all items on the ENTIRE SITE.\n' +
                'This action cannot be undone.\n' +
                'Continue?'
            )) return;

            GM_setValue(STORAGE_KEY, {});
            GM_setValue(PRIORITY_KEY, {});

            // Visually uncheck checkboxes on this page
            document
                .querySelectorAll('input[type="checkbox"].ff-checkbox, input[type="checkbox"].ff-priority-checkbox')
                .forEach(cb => {
                    cb.checked = false;

                const row = cb.closest('.ag-row');
                if (row) {
                    row.style.opacity = '';
                    row.style.backgroundColor = '';
                    row.style.textShadow = '';
                    row.style.boxShadow = '';
                }
            })

        };

        document.body.appendChild(btn);
    }

    addResetButtonPageDone();
    addResetButtonPagePriority();
    addResetButtonSite();

})();
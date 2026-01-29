// ==UserScript==
// @name         MyDramaList Quick Watch Status Updater
// @namespace    https://greasyfork.org/en/users/1466117
// @version      1.0
// @description  Embeds a watch status updater in the sidebar of show/movie pages
// @author       Mocha
// @match        https://mydramalist.com/*-*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564373/MyDramaList%20Quick%20Watch%20Status%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/564373/MyDramaList%20Quick%20Watch%20Status%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== INITIALIZATION ====================

    const urlMatch = window.location.pathname.match(/\/(\d+)-/);
    if (!urlMatch) return;

    const dramaId = urlMatch[1];
    let isScriptControlled = false;

    // ==================== MODAL HIDING ====================

    // Inject hiding CSS immediately - before anything else
    function injectHidingCSS() {
        const style = document.createElement('style');
        style.id = 'qsu-modal-hide';
        style.textContent = `
            body.qsu-hide-modal #mdl-manage-modal .el-dialog__wrapper,
            body.qsu-hide-modal .v-modal {
                opacity: 0 !important;
                pointer-events: none !important;
                visibility: hidden !important;
                position: fixed !important;
                top: -10000px !important;
                left: -10000px !important;
            }
        `;
        document.head.appendChild(style);
    }

    function setupModalObserver() {
        const observer = new MutationObserver((mutations) => {
            if (!isScriptControlled) return;

            mutations.forEach(mutation => {
                // Hide modal wrapper when it appears
                if (mutation.target.matches?.('#mdl-manage-modal .el-dialog__wrapper')) {
                    if (mutation.attributeName === 'style' && mutation.target.style.display !== 'none') {
                        document.body.classList.add('qsu-hide-modal');
                    }
                }

                // Hide backdrop when it's added to DOM
                mutation.addedNodes.forEach(node => {
                    if (node.classList?.contains('v-modal')) {
                        document.body.classList.add('qsu-hide-modal');
                    }
                });
            });
        });

        // Observe modal container and body
        const modalContainer = document.querySelector('#mdl-manage-modal');
        if (modalContainer) {
            observer.observe(modalContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        }

        observer.observe(document.body, { childList: true });
    }

    function hideModal() {
        document.body.classList.add('qsu-hide-modal');
    }

    function showModal() {
        document.body.classList.remove('qsu-hide-modal');
        isScriptControlled = false;
    }

    // ==================== MODAL INTERACTION ====================

    async function openModalSilently() {
        const mainButton = document.querySelector('.btn-manage-list.main');
        if (!mainButton) return null;

        isScriptControlled = true;
        hideModal(); // Pre-hide before click

        mainButton.click();

        // Wait for modal to be ready
        await waitFor(() => {
            const modal = document.querySelector('#mdl-manage-modal .el-dialog__wrapper');
            return modal && modal.style.display !== 'none';
        }, 1000);

        return document.querySelector('#mdl-manage-modal');
    }

    function closeModalSilently() {
        const closeButton = document.querySelector('#mdl-manage-modal .el-dialog__headerbtn');
        if (closeButton) closeButton.click();

        setTimeout(() => showModal(), 200);
    }

    async function getModalValues() {
        const modal = await openModalSilently();
        if (!modal) {
            return { status: '1', episodes: '0', maxEpisodes: '10', rating: '0' };
        }

        const statusSelect = modal.querySelector('.select-watch-status');
        const episodeInput = modal.querySelector('.episode-input input');
        const ratingSelect = modal.querySelector('.select-rating');

        const values = {
            status: statusSelect?.value || '1',
            episodes: episodeInput?.value || '0',
            maxEpisodes: episodeInput?.getAttribute('max') || '10',
            rating: ratingSelect?.value || '0'
        };

        closeModalSilently();
        return values;
    }

    async function updateModalValues(status, episodes, rating) {
        const modal = await openModalSilently();
        if (!modal) return false;

        // Update form fields
        const statusSelect = modal.querySelector('.select-watch-status');
        const episodeInput = modal.querySelector('.episode-input input');
        const ratingSelect = modal.querySelector('.select-rating');

        if (statusSelect) {
            statusSelect.value = status;
            statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (episodeInput) {
            episodeInput.value = episodes;
            episodeInput.dispatchEvent(new Event('input', { bubbles: true }));
            episodeInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (ratingSelect) {
            ratingSelect.value = rating;
            ratingSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        await sleep(300);

        // Submit
        const submitBtn = modal.querySelector('.el-dialog__footer .el-button--primary');
        if (!submitBtn) {
            closeModalSilently();
            return false;
        }

        submitBtn.click();
        await sleep(1000);
        closeModalSilently();

        return true;
    }

    // ==================== UI CREATION ====================

    async function createQuickUpdater() {
        const sidebar = document.querySelector('.content-side.hidden-sm-down');
        if (!sidebar) return;

        // Get current values from modal
        const currentValues = await getModalValues();

        // Create updater widget
        const updater = createUpdaterElement(currentValues);

        // Insert into sidebar
        const insertPoint = sidebar.firstElementChild?.nextElementSibling || sidebar.firstElementChild;
        if (insertPoint) {
            insertPoint.insertAdjacentElement('beforebegin', updater);
        } else {
            sidebar.insertAdjacentElement('afterbegin', updater);
        }

        // Setup event handlers
        setupUpdaterEvents(updater, currentValues);
    }

    function createUpdaterElement(values) {
        const div = document.createElement('div');
        div.className = 'box clear';
        div.id = 'quick-status-updater';
        div.style.marginTop = '20px';

        div.innerHTML = `
            <div class="box-header primary">
                <h3>Quick Update</h3>
            </div>
            <div class="box-body light-b" style="padding: 15px;">
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 12px;">Status</label>
                    <select class="form-control qsu-status" style="font-size: 13px;">
                        <option value="1">Currently watching</option>
                        <option value="2">Completed</option>
                        <option value="3">Plan to watch</option>
                        <option value="4">On-hold</option>
                        <option value="5">Dropped</option>
                        <option value="7">Undecided</option>
                        <option value="6">Not Interested</option>
                    </select>
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 12px;">Episodes Watched</label>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="number" class="form-control qsu-episodes" min="0" max="${values.maxEpisodes}"
                               value="${values.episodes}" style="width: 60px; font-size: 13px; padding: 4px 8px;">
                        <button class="btn btn-sm white qsu-increment" style="padding: 4px 10px; font-size: 13px;">+</button>
                        <span style="font-size: 13px; color: #666;">/ ${values.maxEpisodes}</span>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 12px;">Rating</label>
                    <select class="form-control qsu-rating" style="font-size: 13px;">
                        <option value="0">--</option>
                        ${generateRatingOptions()}
                    </select>
                </div>

                <button class="btn btn-primary btn-block qsu-save" disabled
                        style="font-size: 13px; opacity: 0.5; cursor: not-allowed;">
                    Save Changes
                </button>
            </div>
        `;

        // Set initial values
        div.querySelector('.qsu-status').value = values.status;
        div.querySelector('.qsu-rating').value = values.rating;

        return div;
    }

    function generateRatingOptions() {
        const ratings = [];
        for (let i = 10; i >= 1; i -= 0.5) {
            const value = i === Math.floor(i) ? `${i}.0` : i;
            ratings.push(`<option value="${i}">${value}</option>`);
        }
        return ratings.join('');
    }

    function setupUpdaterEvents(updater, initialValues) {
        const statusSelect = updater.querySelector('.qsu-status');
        const episodeInput = updater.querySelector('.qsu-episodes');
        const ratingSelect = updater.querySelector('.qsu-rating');
        const saveBtn = updater.querySelector('.qsu-save');
        const incrementBtn = updater.querySelector('.qsu-increment');

        const state = { ...initialValues };

        // Check for changes
        function checkChanges() {
            const hasChanges =
                statusSelect.value !== state.status ||
                episodeInput.value !== state.episodes ||
                ratingSelect.value !== state.rating;

            saveBtn.disabled = !hasChanges;
            saveBtn.style.opacity = hasChanges ? '1' : '0.5';
            saveBtn.style.cursor = hasChanges ? 'pointer' : 'not-allowed';
        }

        // Status change: auto-complete episodes
        statusSelect.addEventListener('change', () => {
            if (statusSelect.value === '2') {
                episodeInput.value = episodeInput.getAttribute('max');
            }
            checkChanges();
        });

        episodeInput.addEventListener('input', checkChanges);
        ratingSelect.addEventListener('change', checkChanges);

        // Increment button: auto-save
        incrementBtn.addEventListener('click', async () => {
            const current = parseInt(episodeInput.value) || 0;
            const max = parseInt(episodeInput.getAttribute('max'));

            if (current >= max) return;

            episodeInput.value = current + 1;

            if (await saveChanges(updater, saveBtn)) {
                state.episodes = episodeInput.value;
                checkChanges();
            }
        });

        // Save button
        saveBtn.addEventListener('click', async () => {
            if (saveBtn.disabled) return;

            if (await saveChanges(updater, saveBtn)) {
                state.status = statusSelect.value;
                state.episodes = episodeInput.value;
                state.rating = ratingSelect.value;
                checkChanges();
            }
        });
    }

    async function saveChanges(updater, saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        const status = updater.querySelector('.qsu-status').value;
        const episodes = updater.querySelector('.qsu-episodes').value;
        const rating = updater.querySelector('.qsu-rating').value;

        const success = await updateModalValues(status, episodes, rating);

        if (success) {
            saveBtn.textContent = 'Saved!';
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }, 1000);
        } else {
            saveBtn.textContent = 'Error';
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }, 2000);
        }

        return success;
    }

    // ==================== UTILITIES ====================

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitFor(condition, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (condition()) return true;
            await sleep(50);
        }
        return false;
    }

    function waitForElement(selector, callback, interval = 100) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback, interval), interval);
        }
    }

    // ==================== MAIN EXECUTION ====================

    // Inject CSS immediately to prevent flash
    injectHidingCSS();

    // Setup modal observer
    setupModalObserver();

    // Wait for sidebar and create updater
    waitForElement('.content-side.hidden-sm-down', createQuickUpdater);

})();
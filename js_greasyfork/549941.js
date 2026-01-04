// ==UserScript==
// @name         enhanced property
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.2.0
// @description  Alle öffnen | Alle schließen | Alle speichern | value-editor mit cat-parameter-Links (schnellere Suche)
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/property*
// @noframes
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/549941/enhanced%20property.user.js
// @updateURL https://update.greasyfork.org/scripts/549941/enhanced%20property.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Nicht in iframes ausführen - verhindert mehrfache Skript-Instanzen
    try {
        if (window.self !== window.top) return;
    } catch (e) {
        // Cross-origin iframe - auch nicht ausführen
        return;
    }

    // Zusätzliche Prüfung: Nur auf der erwarteten Seite ausführen
    if (!window.location.pathname.startsWith('/kalif/artikel/property')) return;

    // Verhindere mehrfache Initialisierung im selben Fenster
    if (window.__enhancedPropertyInitialized) return;
    window.__enhancedPropertyInitialized = true;

    let updateTimeout = null;
    let isInitialized = false;
    let isOperationRunning = false;

    function getCatParameterFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('cat');
    }

    function modifyArtikelLinks() {
        const catValue = getCatParameterFromUrl();

        if (!catValue) {
            return;
        }

        const links = document.querySelectorAll('a[href^="/pv-edit/such.pl?ids="]');

        links.forEach(link => {
            const href = link.getAttribute('href');
            const newHref = href.replace('/pv-edit/such.pl?ids=', `/pv-edit/such.pl?kat=${catValue}&ids=`);
            link.setAttribute('href', newHref);
        });
    }

    function getEnabledSaveButtons() {
        return Array.from(document.querySelectorAll('button.btn-success')).filter(btn =>
            btn.textContent.includes('Speichern') && !btn.disabled
        );
    }

    function getCollapsedEditButtons() {
        return Array.from(document.querySelectorAll('button.btn.btn-primary.btn-sm')).filter(btn => {
            const svg = btn.querySelector('svg.bi-pencil-fill');
            return svg !== null && !btn.classList.contains('btn-outline-primary');
        });
    }

    function getOpenedEditButtons() {
        return Array.from(document.querySelectorAll('button.btn.btn-outline-primary.btn-sm')).filter(btn => {
            const svg = btn.querySelector('svg.bi-x');
            return svg !== null;
        });
    }

    function getButtonContainer() {
        const allStrong = document.querySelectorAll('strong.me-2');

        const targetElements = Array.from(allStrong).filter(el =>
            el.textContent.trim() === 'Datensätze:'
        );

        if (targetElements.length === 0) {
            return null;
        }

        const targetElement = targetElements[0];
        return targetElement.parentElement;
    }

    function createAllOpenButton() {
        const container = getButtonContainer();
        if (!container) {
            return false;
        }

        let allOpenBtn = document.getElementById('all-open-btn');
        if (!allOpenBtn) {
            allOpenBtn = document.createElement('button');
            allOpenBtn.id = 'all-open-btn';
            allOpenBtn.className = 'btn btn-secondary btn-sm me-2';
            allOpenBtn.style.fontWeight = 'bold';
            allOpenBtn.style.fontSize = '0.85rem';
            container.insertBefore(allOpenBtn, container.firstChild);
            allOpenBtn.addEventListener('click', executeAllOpen);
        }

        const collapsedCount = getCollapsedEditButtons().length;
        allOpenBtn.textContent = `Alle öffnen (${collapsedCount})`;
        allOpenBtn.disabled = collapsedCount === 0;
        return true;
    }

    function createAllCloseButton() {
        const container = getButtonContainer();
        if (!container) {
            return false;
        }

        let allCloseBtn = document.getElementById('all-close-btn');
        if (!allCloseBtn) {
            allCloseBtn = document.createElement('button');
            allCloseBtn.id = 'all-close-btn';
            allCloseBtn.className = 'btn btn-secondary btn-sm me-2';
            allCloseBtn.style.fontWeight = 'bold';
            allCloseBtn.style.fontSize = '0.85rem';

            const allOpenBtn = document.getElementById('all-open-btn');
            if (allOpenBtn && allOpenBtn.nextSibling) {
                container.insertBefore(allCloseBtn, allOpenBtn.nextSibling);
            } else {
                container.insertBefore(allCloseBtn, container.firstChild);
            }

            allCloseBtn.addEventListener('click', executeAllClose);
        }

        const openedCount = getOpenedEditButtons().length;
        allCloseBtn.textContent = `Alle schließen (${openedCount})`;
        allCloseBtn.disabled = openedCount === 0;
        return true;
    }

    function createAllSaveButton() {
        const container = getButtonContainer();
        if (!container) {
            return false;
        }

        let allSaveBtn = document.getElementById('all-save-btn');
        if (!allSaveBtn) {
            allSaveBtn = document.createElement('button');
            allSaveBtn.id = 'all-save-btn';
            allSaveBtn.className = 'btn btn-primary btn-sm me-2';
            allSaveBtn.style.fontWeight = 'bold';
            allSaveBtn.style.fontSize = '0.85rem';

            const allCloseBtn = document.getElementById('all-close-btn');
            if (allCloseBtn && allCloseBtn.nextSibling) {
                container.insertBefore(allSaveBtn, allCloseBtn.nextSibling);
            } else {
                container.insertBefore(allSaveBtn, container.firstChild);
            }

            allSaveBtn.addEventListener('click', executeAllSave);
        }

        const enabledCount = getEnabledSaveButtons().length;
        allSaveBtn.textContent = `Alle speichern (${enabledCount})`;
        allSaveBtn.disabled = enabledCount === 0;
        return true;
    }

    function showLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'multi-loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
        overlay.style.zIndex = '9998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const spinner = document.createElement('div');
        spinner.style.width = '60px';
        spinner.style.height = '60px';
        spinner.style.border = '6px solid #f3f3f3';
        spinner.style.borderTop = '6px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.zIndex = '9999';

        if (!document.getElementById('multi-spin-style')) {
            const style = document.createElement('style');
            style.id = 'multi-spin-style';
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }

        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
        return overlay;
    }

    function hideLoadingOverlay() {
        const overlay = document.getElementById('multi-loading-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    function updateSaveButtonProgress(current, total) {
        const allSaveBtn = document.getElementById('all-save-btn');
        if (allSaveBtn) {
            allSaveBtn.textContent = `Speichern... (${current}/${total})`;
        }
    }

    function updateOpenButtonProgress(current, total) {
        const allOpenBtn = document.getElementById('all-open-btn');
        if (allOpenBtn) {
            allOpenBtn.textContent = `Öffnen... (${current}/${total})`;
        }
    }

    function updateCloseButtonProgress(current, total) {
        const allCloseBtn = document.getElementById('all-close-btn');
        if (allCloseBtn) {
            allCloseBtn.textContent = `Schließen... (${current}/${total})`;
        }
    }

    async function executeAllSave() {
        const buttons = getEnabledSaveButtons();
        if (buttons.length === 0) {
            return;
        }

        if (!confirm(`${buttons.length} Keys speichern?`)) {
            return;
        }

        isOperationRunning = true;
        const totalCount = buttons.length;

        showLoadingOverlay();

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            updateSaveButtonProgress(i + 1, totalCount);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        hideLoadingOverlay();
        isOperationRunning = false;
        scheduleUpdate();
    }

    async function executeAllOpen() {
        const buttons = getCollapsedEditButtons();
        if (buttons.length === 0) {
            return;
        }

        isOperationRunning = true;
        const totalCount = buttons.length;

        showLoadingOverlay();

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            updateOpenButtonProgress(i + 1, totalCount);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);

            await waitForButtonToOpen(button, 5000);

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        hideLoadingOverlay();
        isOperationRunning = false;
        scheduleUpdate();
    }

    async function executeAllClose() {
        const buttons = getOpenedEditButtons();
        if (buttons.length === 0) {
            return;
        }

        isOperationRunning = true;
        const totalCount = buttons.length;

        showLoadingOverlay();

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];

            updateCloseButtonProgress(i + 1, totalCount);

            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            button.dispatchEvent(clickEvent);

            await waitForButtonToClose(button, 5000);

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        hideLoadingOverlay();
        isOperationRunning = false;
        scheduleUpdate();
    }

    function waitForButtonToOpen(button, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkButton = () => {
                if (button.classList.contains('btn-outline-primary') ||
                    !button.classList.contains('btn-primary') ||
                    !button.querySelector('svg.bi-pencil-fill')) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    resolve(false);
                    return;
                }

                setTimeout(checkButton, 50);
            };

            checkButton();
        });
    }

    function waitForButtonToClose(button, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkButton = () => {
                if (button.classList.contains('btn-primary') &&
                    !button.classList.contains('btn-outline-primary') &&
                    button.querySelector('svg.bi-pencil-fill')) {
                    resolve(true);
                    return;
                }

                if (!document.contains(button)) {
                    resolve(true);
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    resolve(false);
                    return;
                }

                setTimeout(checkButton, 50);
            };

            checkButton();
        });
    }

    function scheduleUpdate() {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(() => {
            if (isOperationRunning) {
                return;
            }

            modifyArtikelLinks();

            const allOpenBtn = document.getElementById('all-open-btn');
            if (allOpenBtn) {
                const collapsedCount = getCollapsedEditButtons().length;
                allOpenBtn.textContent = `Alle öffnen (${collapsedCount})`;
                allOpenBtn.disabled = collapsedCount === 0;
            } else {
                createAllOpenButton();
            }

            const allCloseBtn = document.getElementById('all-close-btn');
            if (allCloseBtn) {
                const openedCount = getOpenedEditButtons().length;
                allCloseBtn.textContent = `Alle schließen (${openedCount})`;
                allCloseBtn.disabled = openedCount === 0;
            } else {
                createAllCloseButton();
            }

            const allSaveBtn = document.getElementById('all-save-btn');
            if (allSaveBtn) {
                const enabledCount = getEnabledSaveButtons().length;
                allSaveBtn.textContent = `Alle speichern (${enabledCount})`;
                allSaveBtn.disabled = enabledCount === 0;
            } else {
                createAllSaveButton();
            }
        }, 100);
    }

    function observeDomChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.target.classList.contains('btn-success') &&
                    mutation.attributeName === 'disabled') {
                    scheduleUpdate();
                    return;
                }

                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target.tagName === 'BUTTON') {
                    scheduleUpdate();
                    return;
                }

                if (mutation.type === 'childList' &&
                    mutation.target !== document.getElementById('all-open-btn') &&
                    mutation.target !== document.getElementById('all-close-btn') &&
                    mutation.target !== document.getElementById('all-save-btn')) {
                    scheduleUpdate();
                    return;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'class']
        });
    }

    function tryCreateButtons() {
        const openCreated = createAllOpenButton();
        const closeCreated = createAllCloseButton();
        const saveCreated = createAllSaveButton();
        if (!openCreated || !closeCreated || !saveCreated) {
            setTimeout(tryCreateButtons, 500);
        }
    }

    function onHashChange() {
        setTimeout(() => {
            modifyArtikelLinks();
            tryCreateButtons();
        }, 500);
    }

    function init() {
        if (isInitialized) {
            return;
        }
        isInitialized = true;

        setTimeout(() => {
            modifyArtikelLinks();
            createAllOpenButton();
            createAllCloseButton();
            createAllSaveButton();
            observeDomChanges();
        }, 1000);

        window.addEventListener('hashchange', onHashChange);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
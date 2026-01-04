// ==UserScript==
// @name         ABWL
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Uses the site's API to quickly add multiple videos to the Watch Later list.
// @author       nmttl
// @license MIT
// @match        https://*.xvideos.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560769/ABWL.user.js
// @updateURL https://update.greasyfork.org/scripts/560769/ABWL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const SELECTORS = {
        targetElements: '.mozaique .thumb-block',
        videoLink: '.thumb-inside .thumb a',
    };

    let isScriptActive = false;
    // New DB Structure: Map<videoId, {title: string, url: string}>
    let processedLinks = new Map();
    let selectedElements = new Set();
    let areSelectedHidden = false;

    // --- UI Elements ---
    let uiContainer, statsPanel, onOffButton, runButton, addToDbButton, downloadDbButton, selectAllButton, deselectAllButton,
        selectInWLButton, selectNotInWLButton, toggleSelectedButton, selectedCounter, reportModal, progressOverlay;

    // --- Main Initialization ---
    function init() {
        loadProcessedLinks();
        createUI();
        addStyles();
    }

    function getVideoIdFromElement(element) {
        if (element && element.id && element.id.startsWith('video_')) {
            return element.id.replace('video_', '');
        }
        return null;
    }

    function getPageTitleFromUrl(url) {
        try {
            const urlObject = new URL(url);
            const pathParts = urlObject.pathname.split('/').filter(part => part.length > 0);
            const rawTitle = pathParts[pathParts.length - 1] || '';
            // Replace underscores with spaces for better readability
            return rawTitle.replace(/_/g, ' ');
        } catch (e) {
            console.error("Could not parse URL:", url, e);
            return '';
        }
    }

    function loadProcessedLinks() {
        const storedData = GM_getValue('processedVideoLinks_API_v2', '[]');
        try {
            const parsedData = JSON.parse(storedData);
            processedLinks = new Map(parsedData);
        } catch (e) {
            console.warn("Could not parse stored data, starting fresh.", e);
            processedLinks = new Map();
        }
    }

    function saveProcessedLinks() {
        const dataToStore = JSON.stringify(Array.from(processedLinks.entries()), null, 2);
        GM_setValue('processedVideoLinks_API_v2', dataToStore);
    }

    // --- UI Creation and Management ---
    function createUI() {
        uiContainer = document.createElement('div');
        uiContainer.id = 'video-manager-ui';

        const controlsContainer = createControls();
        statsPanel = document.createElement('div');
        statsPanel.id = 'vm-stats-panel';
        onOffButton = createButton('Enable Script', toggleScript, { id: 'vm-on-off-button' });

        const mainActions = document.createElement('div');
        mainActions.className = 'vm-actions-main';
        runButton = createButton('Bulk to WL', () => runProcess(Array.from(selectedElements)), { id: 'vm-run-button', disabled: true });
        addToDbButton = createButton('Only Add to DB', () => runAddToDbOnly(Array.from(selectedElements)), { id: 'vm-add-db-button', disabled: true });
        mainActions.appendChild(runButton);
        mainActions.appendChild(addToDbButton);

        const selectActions = document.createElement('div');
        selectActions.className = 'vm-actions-group';
        selectActions.innerHTML = '<div class="vm-group-title">Selection</div>';
        selectAllButton = createButton('All', selectAll, {title: 'Select All'});
        deselectAllButton = createButton('None', deselectAll, {title: 'Deselect All'});
        selectInWLButton = createButton('in WL', selectInWL, {title: 'Select in Watch Later'});
        selectNotInWLButton = createButton('not in WL', selectNotInWL, {title: 'Select not in Watch Later'});
        [selectAllButton, deselectAllButton, selectInWLButton, selectNotInWLButton].forEach(btn => selectActions.appendChild(btn));

        const utilityActions = document.createElement('div');
        utilityActions.className = 'vm-actions-group';
        utilityActions.innerHTML = '<div class="vm-group-title">Utilities</div>';
        toggleSelectedButton = createButton('Hide/Show Selected', toggleSelectedVisibility);
        downloadDbButton = createButton('Download DB', downloadDatabase, { id: 'vm-download-db-button', title: 'Download Database as .txt' });
        utilityActions.appendChild(toggleSelectedButton);
        utilityActions.appendChild(downloadDbButton);


        selectedCounter = document.createElement('div');
        selectedCounter.id = 'vm-selected-counter';

        const mainContent = document.createElement('div');
        mainContent.id = 'vm-main-content';
        [statsPanel, onOffButton, mainActions, selectActions, utilityActions, selectedCounter].forEach(el => mainContent.appendChild(el));

        uiContainer.appendChild(controlsContainer);
        uiContainer.appendChild(mainContent);
        document.body.appendChild(uiContainer);

        [statsPanel, mainActions, selectActions, utilityActions, selectedCounter].forEach(el => el.style.display = 'none');
    }

    function createControls() {
        const controls = document.createElement('div');
        controls.id = 'vm-controls';
        const moveLeftBtn = createButton('«', () => moveMenu('left'), { title: 'Move Left' });
        const moveRightBtn = createButton('»', () => moveMenu('right'), { title: 'Move Right' });
        const minimizeBtn = createButton('-', toggleMinimize, { title: 'Minimize', id: 'vm-minimize-btn' });
        controls.append(moveLeftBtn, moveRightBtn, minimizeBtn);
        return controls;
    }

    function createButton(text, onClick, options = {}) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.addEventListener('click', onClick);
        if (options.id) button.id = options.id;
        if (options.title) button.title = options.title;
        if (options.disabled) button.disabled = true;
        return button;
    }

    function addStyles() {
        GM_addStyle(`
            #video-manager-ui { position: fixed; top: 20px; left: 20px; z-index: 99999; background: rgba(10, 20, 30, 0.9); backdrop-filter: blur(8px); border: 1px solid #455a64; border-radius: 8px; padding: 10px; font-family: sans-serif; color: white; display: flex; flex-direction: column; transition: all 0.3s ease; min-width: 240px; }
            #video-manager-ui.minimized { padding: 0; width: 45px; height: 45px; overflow: hidden; min-width: 45px; }
            #video-manager-ui.minimized #vm-main-content { display: none !important; }
            #video-manager-ui.minimized #vm-controls { justify-content: center; margin-bottom: 0; }
            #video-manager-ui.minimized #vm-controls button:not(#vm-minimize-btn) { display: none; }
            #vm-controls { display: flex; justify-content: flex-end; gap: 5px; margin-bottom: 10px; }
            #vm-controls button { background: #37474f; padding: 4px 10px; font-weight: bold; font-size: 14px; line-height: 1; }
            #vm-main-content { display: flex; flex-direction: column; gap: 12px; }
            #video-manager-ui button { background-color: #546e7a; color: white; border: 1px solid #78909c; padding: 8px 12px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s; }
            #video-manager-ui button:hover { background-color: #607d8b; }
            #video-manager-ui button:disabled { background-color: #263238; color: #666; cursor: not-allowed; }
            #vm-on-off-button.active { background-color: #d32f2f; }
            .vm-actions-main { display: flex; flex-direction: column; gap: 5px; }
            #vm-run-button { background-color: #f5b025; color: #111; font-weight: bold; width: 100%; padding: 12px; font-size: 14px; }
            #vm-run-button:hover { background-color: #ffc107; }
            #vm-add-db-button { background-color: #0288d1; color: white; font-weight: bold; width: 100%; padding: 10px; font-size: 14px; }
            #vm-add-db-button:hover { background-color: #03a9f4; }
            #vm-download-db-button { font-size: 12px; padding: 6px; background-color: #455a64; }
            #vm-stats-panel { display: flex; flex-direction: column; gap: 5px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-size: 12px; text-align: left; }
            #vm-selected-counter { background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-size: 12px; text-align: center; }
            .vm-actions-group { border: 1px solid #444; border-radius: 5px; padding: 8px; display: flex; flex-direction: column; gap: 8px; }
            .vm-group-title { font-size: 10px; text-transform: uppercase; color: #bbb; margin-bottom: 4px; text-align: center; }
            .vm-actions-group:not(.vm-actions-main) { display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 5px; }
            .vm-target-element { position: relative; transition: all 0.2s ease; cursor: pointer; }
            .vm-target-element.selected { border: 3px solid #ffeb3b !important; box-shadow: 0 0 15px #ffeb3b; }
            .vm-in-wl { background-color: #2e7d32 !important; }
            .vm-not-in-wl { background-color: #c62828 !important; }
            .vm-hidden { display: none !important; }
            .vm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
            .vm-modal-content { background: #212121; padding: 25px; border-radius: 8px; color: white; border: 1px solid #666; text-align: center; max-width: 400px; }
            .vm-modal-content h3 { margin-top: 0; }
            .vm-modal-content .buttons { margin-top: 20px; display: flex; gap: 10px; justify-content: center; }
            #vm-progress-bar-container { width: 100%; background: #555; border-radius: 5px; overflow: hidden; margin: 10px 0; }
            #vm-progress-bar { width: 0%; height: 20px; background: #4caf50; transition: width 0.3s ease; }
        `);
    }

    // --- UI Controls ---
    function moveMenu(direction) { uiContainer.style.left = (direction === 'left') ? '20px' : 'auto'; uiContainer.style.right = (direction === 'right') ? '20px' : 'auto'; }
    function toggleMinimize() {
        uiContainer.classList.toggle('minimized');
        const btn = document.getElementById('vm-minimize-btn');
        const isMinimized = uiContainer.classList.contains('minimized');
        btn.textContent = isMinimized ? '□' : '-';
        btn.title = isMinimized ? 'Maximize' : 'Minimize';
    }

    // --- Script Activation/Deactivation ---
    function toggleScript() {
        isScriptActive = !isScriptActive;
        isScriptActive ? activateScript() : deactivateScript();
    }

    function activateScript() {
        onOffButton.textContent = 'Disable Script';
        onOffButton.classList.add('active');
        document.querySelectorAll('#vm-main-content > div').forEach(el => {
            el.style.display = 'flex';
            if (el.classList.contains('vm-actions-group')) {
                el.style.display = 'grid';
            }
        });
        styleAllElements();
        updateStats();
        updateSelectedCount();
    }

    function deactivateScript() {
        onOffButton.textContent = 'Enable Script';
        onOffButton.classList.remove('active');
        document.querySelectorAll('#vm-main-content > div').forEach(el => el.style.display = 'none');
        document.querySelectorAll(SELECTORS.targetElements).forEach(el => {
            el.className = el.className.split(' ').filter(c => !c.startsWith('vm-')).join(' ');
            el.style.cssText = '';
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
        });
        selectedElements.clear();
    }

    // --- Element Styling and Selection ---
    function styleAllElements() {
        document.querySelectorAll(SELECTORS.targetElements).forEach(el => {
            const videoId = getVideoIdFromElement(el);
            // Only process elements that are valid videos (have a video_ ID)
            if (videoId) {
                el.classList.add('vm-target-element');
                el.classList.toggle('vm-in-wl', processedLinks.has(videoId));
                el.classList.toggle('vm-not-in-wl', !processedLinks.has(videoId));
                el.addEventListener('click', handleElementClick);
            }
        });
    }

    function handleElementClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const target = event.currentTarget;
        selectedElements.has(target) ? deselectElement(target) : selectElement(target);
        updateSelectedCount();
    }

    function selectElement(element) { selectedElements.add(element); element.classList.add('selected'); }
    function deselectElement(element) { selectedElements.delete(element); element.classList.remove('selected'); }

    // --- UI Actions ---
    function selectAll() { document.querySelectorAll('.vm-target-element:not(.vm-hidden)').forEach(el => selectElement(el)); updateSelectedCount(); }
    function deselectAll() { selectedElements.forEach(el => deselectElement(el)); updateSelectedCount(); }
    function selectInWL() { document.querySelectorAll('.vm-in-wl:not(.vm-hidden)').forEach(el => selectElement(el)); updateSelectedCount(); }
    function selectNotInWL() { document.querySelectorAll('.vm-not-in-wl:not(.vm-hidden)').forEach(el => selectElement(el)); updateSelectedCount(); }
    function toggleSelectedVisibility() {
        areSelectedHidden = !areSelectedHidden;
        selectedElements.forEach(el => el.classList.toggle('vm-hidden', areSelectedHidden));
        toggleSelectedButton.textContent = areSelectedHidden ? 'Show Selected' : 'Hide Selected';
    }

    function updateStats() {
        const allElements = document.querySelectorAll(SELECTORS.targetElements);
        const inWLElements = document.querySelectorAll('.vm-in-wl');
        statsPanel.innerHTML = `
            <div>Total on page: ${allElements.length}</div>
            <div>In WL on page: ${inWLElements.length}</div>
            <div>Total in memory: ${processedLinks.size}</div>
        `;
    }

    function updateSelectedCount() {
        const count = selectedElements.size;
        selectedCounter.textContent = `Selected: ${count}`;
        runButton.disabled = count === 0;
        addToDbButton.disabled = count === 0;
    }

    // --- Core "Run" Process & Reporting ---
    const delay = ms => new Promise(res => setTimeout(res, ms));

    function runAddToDbOnly(elementsToProcess) {
        if (elementsToProcess.length === 0) return;

        let addedCount = 0;
        elementsToProcess.forEach(element => {
            const linkElement = element.querySelector(SELECTORS.videoLink);
            const videoId = getVideoIdFromElement(element);

            if (linkElement && videoId) {
                const url = linkElement.href;
                const title = getPageTitleFromUrl(url);
                processedLinks.set(videoId, { title, url });

                deselectElement(element);
                element.classList.remove('vm-not-in-wl');
                element.classList.add('vm-in-wl');
                addedCount++;
            }
        });

        if (addedCount > 0) {
            saveProcessedLinks();
        }

        showSimpleReport('Add to DB Complete', `${addedCount} items were successfully added to the local database.`);
        updateStats();
        updateSelectedCount();
    }

    async function runProcess(elementsToProcess) {
        if (elementsToProcess.length === 0) return;

        let csrfToken;
        try {
            csrfToken = unsafeWindow.xv.conf.dyn.wl.put;
            if (!csrfToken) throw new Error("CSRF token not found at unsafeWindow.xv.conf.dyn.wl.put");
        } catch (e) {
            alert("Error: Could not find the necessary CSRF token on the page. The script cannot continue.");
            console.error("CSRF Token Error:", e);
            return;
        }

        const total = elementsToProcess.length;
        showProgressOverlay(total);

        let successfulElements = [], failedElements = [];
        let processedCount = 0;
        const startTime = Date.now();

        for (const element of elementsToProcess) {
            const videoId = getVideoIdFromElement(element);
            if (!videoId) {
                console.warn("Could not get video ID for element:", element);
                failedElements.push(element);
                processedCount++;
                updateProgressOverlay(processedCount, total, startTime);
                continue;
            }

            const result = await addVideoToWatchLaterAPI(videoId, csrfToken);

            if (result.success) {
                successfulElements.push(element);
                csrfToken = result.newToken; // IMPORTANT: Update token for the next request
            } else {
                failedElements.push(element);
            }

            processedCount++;
            updateProgressOverlay(processedCount, total, startTime);
            await delay(250); // A small delay to be polite to the server
        }

        successfulElements.forEach(element => {
            deselectElement(element);
            const linkElement = element.querySelector(SELECTORS.videoLink);
            const videoId = getVideoIdFromElement(element);
            if (linkElement && videoId) {
                const url = linkElement.href;
                const title = getPageTitleFromUrl(url);
                processedLinks.set(videoId, { title, url });
            }
            element.classList.remove('vm-not-in-wl');
            element.classList.add('vm-in-wl');
        });

        if (successfulElements.length > 0) {
            saveProcessedLinks();
        }

        showRunReport(successfulElements.length, failedElements);
    }

    function addVideoToWatchLaterAPI(videoId, csrfToken) {
        return new Promise(resolve => {
            $.post({
                url: "/api/playlists/watch-later/add/" + videoId,
                data: { csrf: csrfToken },
                dataType: "json"
            }).done(function(response) {
                if (response.result === true) {
                    console.log(`Success for video ${videoId}`);
                    const newToken = response.list?.csrf?.add;
                    if (newToken) {
                        unsafeWindow.xv.conf.dyn.wl.put = newToken;
                        resolve({ success: true, newToken: newToken });
                    } else {
                        console.warn(`Server response for ${videoId} was successful but missing new CSRF token.`);
                        resolve({ success: true, newToken: csrfToken }); // Fallback to old token
                    }
                } else {
                    console.warn(`Server returned non-true result for video ${videoId}:`, response);
                    resolve({ success: false, newToken: null });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error(`API request failed for video ${videoId}:`, textStatus, errorThrown);
                resolve({ success: false, newToken: null });
            });
        });
    }

    // --- Modal and Progress Functions ---
    function downloadDatabase() {
        const dataStr = JSON.stringify(Array.from(processedLinks.entries()), null, 2);
        const dataBlob = new Blob([dataStr], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'watch_later_database.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function showProgressOverlay(total) {
        if (progressOverlay) progressOverlay.remove();
        progressOverlay = document.createElement('div');
        progressOverlay.className = 'vm-modal-overlay';
        progressOverlay.innerHTML = `
            <div class="vm-modal-content">
                <h3>Processing...</h3>
                <div id="vm-progress-bar-container"><div id="vm-progress-bar"></div></div>
                <div id="vm-progress-status">Starting...</div>
                <div id="vm-progress-timer"></div>
            </div>
        `;
        document.body.appendChild(progressOverlay);
    }
    function updateProgressOverlay(processed, total, startTime) {
        const progressBar = document.getElementById('vm-progress-bar');
        const progressStatus = document.getElementById('vm-progress-status');
        const progressTimer = document.getElementById('vm-progress-timer');
        if (!progressBar || !progressStatus || !progressTimer) return;
        const percent = (processed / total) * 100;
        progressBar.style.width = `${percent}%`;
        progressStatus.textContent = `Processed: ${processed} / ${total}`;
        const elapsedTime = (Date.now() - startTime) / 1000;
        const timePerItem = elapsedTime / processed;
        const remainingItems = total - processed;
        const estimatedTime = Math.round(remainingItems * timePerItem);
        progressTimer.textContent = `Est. time remaining: ${estimatedTime}s`;
    }
    function showRunReport(successCount, failures) {
        if (progressOverlay) progressOverlay.remove();
        if (reportModal) reportModal.remove();
        reportModal = document.createElement('div');
        reportModal.className = 'vm-modal-overlay';
        const content = document.createElement('div');
        content.className = 'vm-modal-content';
        content.innerHTML = `<h3>Bulk to WL Complete</h3><p>Successful: ${successCount}</p><p>Failed: ${failures.length}</p>`;
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        const closeButton = createButton('Close', () => {
            reportModal.remove();
            updateStats();
            updateSelectedCount();
        });
        buttonContainer.appendChild(closeButton);
        if (failures.length > 0) {
            const retryButton = createButton(`Retry ${failures.length} Failed`, () => {
                reportModal.remove();
                runProcess(failures);
            });
            buttonContainer.appendChild(retryButton);
        }
        content.appendChild(buttonContainer);
        reportModal.appendChild(content);
        document.body.appendChild(reportModal);
    }
    function showSimpleReport(title, message) {
        if (reportModal) reportModal.remove();
        reportModal = document.createElement('div');
        reportModal.className = 'vm-modal-overlay';
        const content = document.createElement('div');
        content.className = 'vm-modal-content';
        content.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'buttons';
        const closeButton = createButton('Close', () => {
            reportModal.remove();
        });
        buttonContainer.appendChild(closeButton);
        content.appendChild(buttonContainer);
        reportModal.appendChild(content);
        document.body.appendChild(reportModal);
    }

    // --- Start the script ---
    init();

})();

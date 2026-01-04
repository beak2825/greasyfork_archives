// ==UserScript==
// @name         NHentai Doujinshi Tracker
// @namespace    http://tampermonkey.net/
// @version      2.8.6
// @description  Tracks doujinshis on NHentai with Plan to Read, Reading, and Finished statuses, similar to MyAnimeList. 
// @match        https://nhentai.net/*
// @exclude      https://nhentai.net/g/*/*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548208/NHentai%20Doujinshi%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/548208/NHentai%20Doujinshi%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Toastify.js and Fonts dynamically
    const loadDependencies = () => {
        try {
            const toastifyLink = document.createElement('link');
            toastifyLink.rel = 'stylesheet';
            toastifyLink.href = 'https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css';
            document.head.appendChild(toastifyLink);

            const toastifyScript = document.createElement('script');
            toastifyScript.src = 'https://cdn.jsdelivr.net/npm/toastify-js';
            toastifyScript.onload = () => console.log('Toastify loaded');
            toastifyScript.onerror = () => console.error('Failed to load Toastify');
            document.head.appendChild(toastifyScript);

            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(faLink);

            const robotoLink = document.createElement('link');
            robotoLink.rel = 'stylesheet';
            robotoLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
            document.head.appendChild(robotoLink);
        } catch (e) {
            console.error('Error loading dependencies:', e);
        }
    };
    loadDependencies();

    // CSS styles
    const styles = `
        .status-buttons-container { display: block; margin-top: 5px; }
        .tracker-btn { display: inline-block; vertical-align: middle; margin-left: 5px; margin-top: 5px; font-size: 14px; padding: 6px 12px; border-radius: 4px; border: none; transition: background-color 0.3s, transform 0.1s; cursor: pointer; line-height: 1.5; font-family: 'Roboto', sans-serif; }
        .plan-to-read { background-color: #3498db; color: white; }
        .plan-to-read.active { background-color: #2980b9; }
        .reading { background-color: #f1c40f; color: black; }
        .reading.active { background-color: #d4ac0d; }
        .finished { background-color: #2ecc71; color: white; }
        .finished.active { background-color: #27ae60; }
        .remove-entry { background-color: #e74c3c; color: white; }
        .remove-entry:hover { background-color: #c0392b; }
        .import-export-container { display: block; margin-top: 10px; }
        .import-export-btn { display: inline-block; vertical-align: middle; background-color: #95a5a6; color: white; margin-left: 5px; margin-top: 5px; font-size: 14px; padding: 6px 12px; border-radius: 4px; border: none; transition: background-color 0.3s, transform 0.1s; cursor: pointer; line-height: 1.5; font-family: 'Roboto', sans-serif; }
        .list-btn { background-color: #95a5a6; color: white; margin-left: 10px; font-size: 14px; padding: 6px 12px; border-radius: 4px; border: none; transition: background-color 0.3s, transform 0.1s; cursor: pointer; }
        .status-display { margin-top: 10px; padding: 8px 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); font-size: 16px; font-weight: 500; font-family: 'Roboto', sans-serif; color: #fff; background: linear-gradient(90deg, #4b6cb7, #182848); display: inline-block; }
        .tracker-btn:hover, .import-export-btn:hover, .list-btn:hover { transform: scale(1.05); }
        .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1a1a1a; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 1000; width: 90%; max-width: 900px; max-height: 90vh; overflow: hidden; font-family: 'Roboto', sans-serif; color: #ffffff; display: flex; flex-direction: column; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 999; }
        .modal-header { background: linear-gradient(90deg, #2d2d2d, #1a1a1a); padding: 15px 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        .modal-header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
        .modal-content { display: flex; flex: 1; overflow: hidden; }
        .modal-sidebar { width: 200px; background: #2d2d2d; padding: 15px; overflow-y: auto; border-right: 1px solid #3e3e3e; }
        .modal-sidebar h3 { font-size: 16px; font-weight: 500; color: #aaaaaa; margin: 0 0 10px 0; }
        .modal-sidebar .control-group { margin-bottom: 15px; }
        .modal-sidebar label { display: block; font-size: 14px; font-weight: 500; color: #aaaaaa; margin-bottom: 5px; }
        .modal-sidebar input, .modal-sidebar select { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #3e3e3e; background: #1a1a1a; color: #ffffff; font-size: 14px; font-family: 'Roboto', sans-serif; }
        .modal-sidebar input::placeholder { color: #666666; }
        .modal-main { flex: 1; padding: 15px; overflow-y: auto; background: #1a1a1a; }
        .modal-table { width: 100%; background: #1a1a1a; }
        .modal-table table { width: 100%; border-collapse: collapse; }
        .modal-table th, .modal-table td { border: 1px solid #3e3e3e; padding: 10px; text-align: left; color: #ffffff; }
        .modal-table th { background: #2d2d2d; position: sticky; top: 0; cursor: pointer; font-weight: 500; }
        .modal-table th:hover { background: #3e3e3e; }
        .modal-table .sort-arrow { margin-left: 5px; font-size: 12px; }
        .modal-table .thumbnail { width: 50px; height: 70px; object-fit: cover; cursor: pointer; border: 1px solid #3e3e3e; border-radius: 4px; }
        .modal-table .thumbnail:hover { opacity: 0.8; }
        .modal-table .progress-bar { width: 100%; background: #333333; height: 10px; border-radius: 5px; overflow: hidden; }
        .modal-table .progress-bar div { height: 100%; background: #f1c40f; transition: width 0.3s; }
        .modal-actions { display: flex; gap: 8px; padding: 10px 15px; background: #2d2d2d; border-top: 1px solid #3e3e3e; border-radius: 0 0 12px 12px; flex-wrap: nowrap; overflow-x: auto; }
        .modal-actions button, .modal-actions select { padding: 8px 12px; border-radius: 4px; border: none; cursor: pointer; transition: background 0.2s, transform 0.1s; font-family: 'Roboto', sans-serif; font-size: 14px; flex-shrink: 0; }
        .modal-actions button:hover, .modal-actions select:hover { transform: scale(1.05); }
        .modal-actions select { background: #1a1a1a; color: #ffffff; border: 1px solid #3e3e3e; }
        .modal-actions .action-group { display: flex; align-items: center; gap: 8px; }
        .modal-actions .action-group label { font-size: 14px; color: #aaaaaa; margin-right: 5px; }
        .delete-selected { background: #e74c3c; color: white; }
        .delete-selected:hover { background: #c0392b; }
        .pagination-toggle { background: #3498db; color: white; }
        .pagination-toggle:hover { background: #2980b9; }
        .clear-all { background: #e67e22; color: white; }
        .clear-all:hover { background: #d35400; }
        .batch-update { background: #2ecc71; color: white; }
        .batch-update:hover { background: #27ae60; }
        .restore-backup { background: #9b59b6; color: white; }
        .restore-backup:hover { background: #8e44ad; }
        .image-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 2000; display: flex; justify-content: center; align-items: center; }
        .image-modal img { max-width: 90%; max-height: 90vh; border: 2px solid #ffffff; border-radius: 4px; }
        .image-modal .close-btn { position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: transform 0.1s; }
        .image-modal .close-btn:hover { transform: scale(1.05); }
        .delete-btn { background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
        .retry-btn { background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px; }
        @media (max-width: 768px) { .modal-content { flex-direction: column; } .modal-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #3e3e3e; } .modal-main { padding: 10px; } }
        @media (max-width: 600px) { .modal { width: 95%; padding: 5px; } .modal-table table { display: block; } .modal-table thead { display: none; } .modal-table tr { display: flex; flex-direction: column; margin-bottom: 10px; border: 1px solid #3e3e3e; padding: 10px; background: #2d2d2d; border-radius: 4px; } .modal-table td { display: flex; align-items: center; text-align: left; padding: 5px 0; border: none; } .modal-table td:before { content: attr(data-label); font-weight: 500; margin-right: 10px; color: #aaaaaa; width: 100px; } .modal-table .thumbnail { margin: 0 auto; } .modal-table .progress-bar { width: 100%; } }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Initialize localStorage
    if (!localStorage.getItem('nhentaiTracker')) localStorage.setItem('nhentaiTracker', JSON.stringify({}));
    if (!localStorage.getItem('nhentaiTheme')) localStorage.setItem('nhentaiTheme', 'dark');
    if (!localStorage.getItem('nhentaiTrackerBackup')) localStorage.setItem('nhentaiTrackerBackup', JSON.stringify({}));

    let trackerCache = JSON.parse(localStorage.getItem('nhentaiTracker') || '{}');

    const backupInterval = setInterval(() => {
        try {
            localStorage.setItem('nhentaiTrackerBackup', JSON.stringify(trackerCache));
            console.log('Tracker data backed up');
        } catch (e) {
            console.error('Error during periodic backup:', e);
        }
    }, 10 * 60 * 1000);

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    let modalOpen = false;
    const handleStorageChange = (e) => {
        if (e.key !== 'nhentaiTracker') return;
        const newData = JSON.parse(e.newValue || '{}');
        if (JSON.stringify(newData) === JSON.stringify(trackerCache)) return;
        trackerCache = newData;
        console.log('Tracker data synchronized across tabs');
        const url = getCurrentDoujinshiUrl();
        const buttonsDiv = document.querySelector('.buttons');
        if (url && buttonsDiv) updateUI(buttonsDiv, url);
        if (modalOpen) {
            const modal = document.querySelector('.modal');
            if (modal) {
                const updateTable = modal.__updateTable;
                if (updateTable) updateTable();
            }
        }
    };
    window.addEventListener('storage', handleStorageChange);

    const getCurrentDoujinshiUrl = () => {
        const url = window.location.href;
        if (url.match(/^https:\/\/nhentai\.net\/g\/\d+\/?$/)) return url.replace(/\/$/, '');
        return null;
    };

    const getTotalPages = (url) => {
        if (trackerCache[url]?.totalPages) return trackerCache[url].totalPages;
        const pagination = document.querySelector('.pagination .last');
        if (pagination) {
            const total = parseInt(pagination.textContent) || 100;
            trackerCache[url] = { ...trackerCache[url], totalPages: total };
            saveTrackerData();
            return total;
        }
        return 100;
    };

    const getDoujinshiName = async (url) => {
        if (trackerCache[url]?.name) return trackerCache[url].name;
        if (url !== getCurrentDoujinshiUrl()) return "Loading...";

        return new Promise((resolve) => {
            const checkElements = () => {
                const titleElement = document.querySelector('h1.title .pretty');
                const coverImg = document.querySelector('#cover img');
                const galleryIdElement = document.querySelector('#gallery_id');
                let galleryId = trackerCache[url]?.galleryId;

                if (titleElement && coverImg) {
                    const title = titleElement.textContent.trim();
                    const src = coverImg.getAttribute('src') || coverImg.getAttribute('data-src');
                    galleryId = galleryIdElement ? galleryIdElement.textContent.replace('#', '') : url.match(/\/g\/(\d+)/)[1];
                    if (title && src) {
                        trackerCache[url] = { ...trackerCache[url], name: title, galleryId: galleryId, thumbnailUrl: src };
                        saveTrackerData();
                        resolve(title);
                        return;
                    }
                }
                setTimeout(checkElements, 1000); // Retry after 1 second if not found
            };

            checkElements();
            setTimeout(() => {
                const fallbackTitleElement = document.querySelector('h1.title .pretty');
                const fallbackCoverImg = document.querySelector('#cover img');
                const fallbackGalleryId = document.querySelector('#gallery_id')?.textContent.replace('#', '') || url.match(/\/g\/(\d+)/)[1];
                if (fallbackTitleElement) {
                    const title = fallbackTitleElement.textContent.trim() || "Unknown";
                    const src = fallbackCoverImg ? (fallbackCoverImg.getAttribute('src') || fallbackCoverImg.getAttribute('data-src') || '') : '';
                    trackerCache[url] = { ...trackerCache[url], name: title, galleryId: fallbackGalleryId, thumbnailUrl: src || `https://via.placeholder.com/50x70?text=Thumbnail+Unavailable` };
                    saveTrackerData();
                    resolve(title);
                } else {
                    trackerCache[url] = { ...trackerCache[url], name: "Unknown", galleryId: fallbackGalleryId, thumbnailUrl: `https://via.placeholder.com/50x70?text=Thumbnail+Unavailable` };
                    saveTrackerData();
                    resolve("Unknown");
                }
            }, 5000); // Fallback after 5 seconds
        });
    };

    const getThumbnailUrl = (url) => {
        return trackerCache[url]?.thumbnailUrl || `https://via.placeholder.com/50x70?text=Thumbnail+Unavailable`;
    };

    const setupLazyLoading = (container) => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (!img.dataset.loaded) {
                        const url = img.dataset.url;
                        img.src = getThumbnailUrl(url);
                        img.dataset.loaded = 'true';
                        obs.unobserve(img);
                    }
                }
            });
        }, { root: container, rootMargin: '100px' });
        return observer;
    };

    const showImageModal = (imgSrc) => {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <img src="${imgSrc}" alt="Cover Image">
            <button class="close-btn" title="Close the image preview">Close</button>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    };

    const saveTrackerData = () => {
        localStorage.setItem('nhentaiTracker', JSON.stringify(trackerCache));
    };

    const showToast = (message, type = 'info') => {
        if (window.Toastify) {
            window.Toastify({
                text: message,
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: { background: type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db' },
                stopOnFocus: true
            }).showToast();
        } else {
            alert(message);
        }
    };

    const updateUI = (buttonsDiv, url) => {
        if (!buttonsDiv || !url) return;
        const status = trackerCache[url]?.status || 'None';
        const lastPage = trackerCache[url]?.lastPage || 0;

        const statusDisplay = buttonsDiv.querySelector('.status-display') || document.createElement('div');
        statusDisplay.className = 'status-display';
        statusDisplay.textContent = `Status: ${status !== 'None' ? status : 'Not tracked'}${lastPage ? ` | Last Page: ${lastPage}` : ''}`;
        if (!buttonsDiv.contains(statusDisplay)) buttonsDiv.appendChild(statusDisplay);

        const buttons = buttonsDiv.querySelectorAll('.tracker-btn');
        buttons.forEach(button => {
            const buttonStatus = button.dataset.status;
            button.classList.toggle('active', status === buttonStatus);
        });
    };

    const handleStatusClick = (url, status, buttonsDiv) => {
        if (!url || !buttonsDiv) return;
        if (trackerCache[url]?.status === status) {
            showToast('No changes made', 'info');
            return;
        }
        if (confirm(`Set status to "${status}"?`)) {
            trackerCache[url] = { status, lastPage: trackerCache[url]?.lastPage || 0 };
            getDoujinshiName(url).then(name => {
                if (name === "Unknown") console.warn(`Failed to fetch title for ${url}`);
            });
            saveTrackerData();
            updateUI(buttonsDiv, url);
            showToast(`Status set to ${status}`, 'success');
        }
    };

    const handleRemoveEntry = (url, buttonsDiv) => {
        if (!url || !buttonsDiv) return;
        if (!trackerCache[url]) {
            showToast('Entry not in tracker', 'info');
            return;
        }
        if (confirm(`Remove this doujinshi from the tracker?`)) {
            delete trackerCache[url];
            saveTrackerData();
            updateUI(buttonsDiv, url);
            showToast('Entry removed from tracker', 'success');
        }
    };

    const handleExport = () => {
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        const dataStr = JSON.stringify(trackerCache, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nhentai_tracker_${timestamp}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Tracker list exported', 'success');
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        const validData = {};
                        for (const [url, data] of Object.entries(importedData)) {
                            if (url.match(/^https:\/\/nhentai\.net\/g\/\d+$/) && data.status && ['Plan to Read', 'Reading', 'Finished'].includes(data.status)) {
                                validData[url] = {
                                    status: data.status,
                                    lastPage: Number.isInteger(data.lastPage) ? data.lastPage : 0,
                                    name: data.name || "Unknown",
                                    galleryId: data.galleryId || url.match(/\/g\/(\d+)/)[1],
                                    totalPages: Number.isInteger(data.totalPages) ? data.totalPages : undefined,
                                    thumbnailUrl: data.thumbnailUrl || `https://via.placeholder.com/50x70?text=Thumbnail+Unavailable`
                                };
                            }
                        }
                        if (Object.keys(validData).length === 0) {
                            showToast('No valid NHentai URLs found in file', 'error');
                            return;
                        }
                        if (confirm('Import this tracker data? This will merge with existing data.')) {
                            trackerCache = { ...trackerCache, ...validData };
                            saveTrackerData();
                            const url = getCurrentDoujinshiUrl();
                            const buttonsDiv = document.querySelector('.buttons');
                            if (url && buttonsDiv) updateUI(buttonsDiv, url);
                            showToast('Tracker data imported successfully', 'success');
                        }
                    } catch (err) {
                        console.error('Error importing file:', err);
                        showToast('Error importing file: Invalid JSON format', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleRestoreBackup = () => {
        const backupData = JSON.parse(localStorage.getItem('nhentaiTrackerBackup') || '{}');
        if (Object.keys(backupData).length === 0) {
            showToast('No backup data available', 'info');
            return;
        }
        if (confirm('Restore from backup? This will overwrite the current tracker data.')) {
            trackerCache = backupData;
            saveTrackerData();
            showToast('Backup restored successfully', 'success');
            const url = getCurrentDoujinshiUrl();
            const buttonsDiv = document.querySelector('.buttons');
            if (url && buttonsDiv) updateUI(buttonsDiv, url);
        }
    };

    const trackReadProgress = () => {
        const url = getCurrentDoujinshiUrl();
        if (!url) {
            console.log('Not on a doujinshi page, skipping read progress tracking');
            return;
        }

        const readButton = document.querySelector('#comicReadMode');
        if (!readButton) {
            console.log('Read button not found');
            return;
        }

        readButton.addEventListener('click', () => {
            const tryUpdatePage = (attempts = 5, delay = 2000) => {
                setTimeout(() => {
                    const url = getCurrentDoujinshiUrl();
                    if (!url) return;

                    const pageElement = document.querySelector('.pagination .current, .current-page, [data-page]');
                    let page = 0;
                    if (pageElement) {
                        page = parseInt(pageElement.textContent || pageElement.dataset.page) || 0;
                        console.log(`Page number found: ${page}`);
                    } else {
                        console.log('Page element not found');
                    }

                    if (page > 0 && trackerCache[url]?.lastPage !== page) {
                        trackerCache[url] = { ...trackerCache[url], lastPage: page };
                        saveTrackerData();
                        const buttonsDiv = document.querySelector('.buttons');
                        if (buttonsDiv) updateUI(buttonsDiv, url);
                        console.log(`Updated last page for ${url} to ${page}`);
                    } else if (attempts > 1) {
                        console.log(`Retrying page update, attempts left: ${attempts - 1}`);
                        tryUpdatePage(attempts - 1, delay);
                    }
                }, delay);
            };
            tryUpdatePage();
        });
    };

    const fuzzySearch = (query, text) => {
        query = query.toLowerCase().trim();
        text = text.toLowerCase();
        let score = 0;
        let j = 0;
        for (let i = 0; i < query.length; i++) {
            while (j < text.length && text[j] !== query[i]) j++;
            if (j < text.length) {
                score++;
                j++;
            }
        }
        return score / query.length;
    };

    const showTrackerList = (title = 'Tracker List') => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-label', `${title} Modal`);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        let filteredEntries = Object.entries(trackerCache);
        let usePagination = false;
        let currentPage = 1;
        const ITEMS_PER_PAGE = 10;
        const selectedItems = new Set();
        let sortColumn = 'url';
        let sortDirection = 'asc';

        modalOpen = true;

        const renderModalContent = () => {
            modal.innerHTML = `
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="close-btn" title="Close the tracker list modal">Close</button>
                </div>
                <div class="modal-content">
                    <div class="modal-sidebar">
                        <div class="control-group">
                            <h3>Filter & Search</h3>
                            <label for="search-input">Search</label>
                            <input type="text" id="search-input" class="search-input" placeholder="Search by URL or title" title="Enter a URL or title to search your tracker list" aria-label="Search tracker list">
                        </div>
                        <div class="control-group">
                            <label for="status-filter">Status Filter</label>
                            <select id="status-filter" class="status-filter" title="Filter entries by their status" aria-label="Filter by status">
                                <option value="">All Statuses</option>
                                <option value="Plan to Read">Plan to Read</option>
                                <option value="Reading">Reading</option>
                                <option value="Finished">Finished</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-main">
                        <div class="modal-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th data-sort="select"><input type="checkbox" id="select-all" title="Select all entries in the current view" aria-label="Select all"></th>
                                        <th data-sort="thumbnail">Thumbnail</th>
                                        <th data-sort="title">Title<span class="sort-arrow"></span></th>
                                        <th data-sort="url">URL<span class="sort-arrow"></span></th>
                                        <th data-sort="status">Status<span class="sort-arrow"></span></th>
                                        <th data-sort="action">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="tracker-table-body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="delete-selected" title="Delete all selected entries from the tracker"><i class="fas fa-trash"></i> Delete Selected</button>
                    <div class="action-group">
                        <label for="batch-status">Batch Update:</label>
                        <select id="batch-status" class="batch-status" title="Select a status to apply to all selected entries" aria-label="Batch update status">
                            <option value="" disabled selected>Select Status</option>
                            <option value="Plan to Read">Plan to Read</option>
                            <option value="Reading">Reading</option>
                            <option value="Finished">Finished</option>
                        </select>
                        <button class="batch-update" title="Apply the selected status to all selected entries"><i class="fas fa-sync"></i> Apply</button>
                    </div>
                    <button class="pagination-toggle" title="Toggle between paginated view and virtual scroll"><i class="fas fa-pager"></i> Toggle Pagination</button>
                    <button class="clear-all" title="Clear all entries from the tracker (this action cannot be undone)"><i class="fas fa-eraser"></i> Clear All</button>
                    <button class="restore-backup" title="Restore the tracker list from a backup saved in localStorage under 'nhentaiTrackerBackup'. Backups include all tracked doujinshi URLs and statuses. Backups occur every 10 minutes, with the last potential backup at 02:14 AM PST on May 22, 2025, if the script was running. This will overwrite current data."><i class="fas fa-undo"></i> Restore Backup</button>
                </div>
            `;

            const tableContainer = modal.querySelector('.modal-table');
            const lazyLoadObserver = setupLazyLoading(tableContainer);

            const updateTable = () => {
                const searchInput = modal.querySelector('.search-input').value.toLowerCase();
                const statusFilter = modal.querySelector('.status-filter').value;
                const tbody = modal.querySelector('.tracker-table-body');
                tbody.innerHTML = '';

                filteredEntries = Object.entries(trackerCache).filter(([url, data]) => {
                    const matchesSearch = url.toLowerCase().includes(searchInput) || (data.name && data.name.toLowerCase().includes(searchInput));
                    const matchesStatus = !statusFilter || data.status === statusFilter;
                    return matchesSearch && matchesStatus;
                });

                filteredEntries.sort((a, b) => {
                    const [urlA, dataA] = a;
                    const [urlB, dataB] = b;
                    let valA, valB;
                    if (sortColumn === 'title') {
                        valA = dataA.name || '';
                        valB = dataB.name || '';
                    } else if (sortColumn === 'url') {
                        valA = urlA;
                        valB = urlB;
                    } else if (sortColumn === 'status') {
                        valA = dataA.status || 'None';
                        valB = dataB.status || 'None';
                    }
                    return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                });

                const headers = modal.querySelectorAll('th[data-sort]');
                headers.forEach(header => {
                    const arrow = header.querySelector('.sort-arrow');
                    if (arrow) arrow.textContent = header.dataset.sort === sortColumn ? (sortDirection === 'asc' ? '↑' : '↓') : '';
                });

                let displayEntries;
                if (usePagination) {
                    const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);
                    currentPage = Math.min(currentPage, totalPages || 1);
                    const start = (currentPage - 1) * ITEMS_PER_PAGE;
                    const end = start + ITEMS_PER_PAGE;
                    displayEntries = filteredEntries.slice(start, end);
                } else {
                    displayEntries = filteredEntries;
                }

                displayEntries.forEach(([url, data]) => {
                    const thumbnailUrl = getThumbnailUrl(url);
                    const progress = data.status === 'Reading' && data.lastPage ? (data.lastPage / (data.totalPages || getTotalPages(url))) * 100 : 0;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td data-label="Select"><input type="checkbox" class="select-item" data-url="${url}" title="Select this entry for batch actions" aria-label="Select ${url}"></td>
                        <td data-label="Thumbnail"><img src="${thumbnailUrl}" alt="Thumbnail" class="thumbnail" data-url="${url}" title="Click to view the cover image for ${data.name || 'this doujinshi'}"></td>
                        <td data-label="Title">${data.name || 'Loading...'}</td>
                        <td data-label="URL"><a href="${url}" target="_blank">${url}</a></td>
                        <td data-label="Status">${data.status || 'None'}${data.status === 'Reading' && data.lastPage ? `<div class="progress-bar" title="Progress: ${Math.round(progress)}%"><div style="width: ${progress}%"></div></div>` : ''}</td>
                        <td data-label="Action"><button class="delete-btn" data-url="${url}" title="Delete this entry from the tracker" aria-label="Delete ${url}">Delete</button></td>
                    `;
                    tbody.appendChild(row);
                    if (!data.name) {
                        getDoujinshiName(url).then(name => {
                            if (row.querySelector('td:nth-child(3)')) {
                                data.name = name;
                                saveTrackerData();
                                row.querySelector('td:nth-child(3)').textContent = name;
                                const img = row.querySelector('.thumbnail');
                                if (img) img.title = `Click to view the cover image for ${name}`;
                            }
                        }).catch(err => console.error(`Failed to fetch name for ${url}:`, err));
                    }
                    const imgElement = row.querySelector('.thumbnail');
                    imgElement.addEventListener('click', () => {
                        if (thumbnailUrl) showImageModal(thumbnailUrl);
                    });
                });

                const existingPagination = modal.querySelector('.pagination-controls');
                if (existingPagination) existingPagination.remove();

                if (usePagination) {
                    const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE) || 1;
                    const paginationControls = document.createElement('div');
                    paginationControls.className = 'pagination-controls';
                    paginationControls.style.padding = '10px';
                    paginationControls.style.textAlign = 'center';
                    paginationControls.style.background = '#2d2d2d';
                    paginationControls.innerHTML = `
                        <button class="prev-page" ${currentPage === 1 ? 'disabled' : ''} style="background: #3498db; color: white; padding: 5px 10px; border-radius: 4px; border: none; cursor: pointer;" title="Go to the previous page"><i class="fas fa-chevron-left"></i> Previous</button>
                        <span style="margin: 0 10px;">Page</span>
                        <input type="number" min="1" max="${totalPages}" value="${currentPage}" class="page-input" style="width: 60px; padding: 5px; margin: 0 5px; background: #1a1a1a; color: #ffffff; border: 1px solid #3e3e3e; border-radius: 4px;" title="Enter a page number to jump to">
                        <span style="margin: 0 10px;">of ${totalPages}</span>
                        <button class="go-page" style="background: #3498db; color: white; padding: 5px 10px; border-radius: 4px; border: none; cursor: pointer;" title="Jump to the entered page number">Go</button>
                        <button class="next-page" ${currentPage === totalPages ? 'disabled' : ''} style="background: #3498db; color: white; padding: 5px 10px; border-radius: 4px; border: none; cursor: pointer;" title="Go to the next page">Next <i class="fas fa-chevron-right"></i></button>
                    `;
                    modal.querySelector('.modal-main').appendChild(paginationControls);

                    const prevButton = paginationControls.querySelector('.prev-page');
                    const nextButton = paginationControls.querySelector('.next-page');
                    const pageInput = paginationControls.querySelector('.page-input');
                    const goButton = paginationControls.querySelector('.go-page');

                    prevButton.addEventListener('click', () => {
                        if (currentPage > 1) {
                            currentPage--;
                            updateTable();
                        }
                    });
                    nextButton.addEventListener('click', () => {
                        if (currentPage < totalPages) {
                            currentPage++;
                            updateTable();
                        }
                    });
                    goButton.addEventListener('click', () => {
                        const page = parseInt(pageInput.value);
                        if (page >= 1 && page <= totalPages) {
                            currentPage = page;
                            updateTable();
                        }
                    });
                    pageInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            const page = parseInt(pageInput.value);
                            if (page >= 1 && page <= totalPages) {
                                currentPage = page;
                                updateTable();
                            }
                        }
                    });
                }
            };

            modal.__updateTable = updateTable;
            const debouncedUpdateTable = debounce(updateTable, 300);
            modal.querySelector('.search-input').addEventListener('input', debouncedUpdateTable);
            modal.querySelector('.status-filter').addEventListener('change', updateTable);

            modal.querySelector('.close-btn').addEventListener('click', () => {
                modalOpen = false;
                if (lazyLoadObserver) lazyLoadObserver.disconnect();
                modal.remove();
                overlay.remove();
            });

            const selectAll = modal.querySelector('#select-all');
            selectAll.addEventListener('change', (e) => {
                const checkboxes = modal.querySelectorAll('.select-item');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                    if (e.target.checked) selectedItems.add(checkbox.dataset.url);
                    else selectedItems.delete(checkbox.dataset.url);
                });
            });

            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    const url = e.target.dataset.url;
                    if (confirm(`Delete ${url} from tracker?`)) {
                        delete trackerCache[url];
                        saveTrackerData();
                        updateTable();
                        showToast('Entry deleted', 'success');
                        const currentUrl = getCurrentDoujinshiUrl();
                        const buttonsDiv = document.querySelector('.buttons');
                        if (currentUrl && buttonsDiv && currentUrl === url) updateUI(buttonsDiv, currentUrl);
                    }
                } else if (e.target.classList.contains('select-item')) {
                    const url = e.target.dataset.url;
                    if (e.target.checked) selectedItems.add(url);
                    else selectedItems.delete(url);
                } else if (e.target.tagName === 'TH' && e.target.dataset.sort && ['title', 'url', 'status'].includes(e.target.dataset.sort)) {
                    const column = e.target.dataset.sort;
                    if (sortColumn === column) sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                    else {
                        sortColumn = column;
                        sortDirection = 'asc';
                    }
                    updateTable();
                }
            });

            const deleteSelected = modal.querySelector('.delete-selected');
            deleteSelected.addEventListener('click', () => {
                if (selectedItems.size === 0) {
                    showToast('No items selected', 'info');
                    return;
                }
                if (confirm(`Delete ${selectedItems.size} selected items?`)) {
                    selectedItems.forEach(url => delete trackerCache[url]);
                    selectedItems.clear();
                    saveTrackerData();
                    updateTable();
                    showToast('Selected items deleted', 'success');
                    const currentUrl = getCurrentDoujinshiUrl();
                    const buttonsDiv = document.querySelector('.buttons');
                    if (currentUrl && buttonsDiv) updateUI(buttonsDiv, currentUrl);
                }
            });

            const batchUpdate = modal.querySelector('.batch-update');
            const batchStatus = modal.querySelector('.batch-status');
            batchUpdate.addEventListener('click', () => {
                const newStatus = batchStatus.value;
                if (!newStatus) {
                    showToast('Please select a status for batch update', 'info');
                    return;
                }
                if (selectedItems.size === 0) {
                    showToast('No items selected for batch update', 'info');
                    return;
                }
                if (confirm(`Update ${selectedItems.size} items to "${newStatus}"?`)) {
                    selectedItems.forEach(url => {
                        trackerCache[url] = { ...trackerCache[url], status: newStatus };
                    });
                    saveTrackerData();
                    updateTable();
                    showToast('Batch update applied', 'success');
                    const currentUrl = getCurrentDoujinshiUrl();
                    const buttonsDiv = document.querySelector('.buttons');
                    if (currentUrl && buttonsDiv) updateUI(buttonsDiv, currentUrl);
                }
            });

            const paginationToggle = modal.querySelector('.pagination-toggle');
            paginationToggle.addEventListener('click', () => {
                usePagination = !usePagination;
                paginationToggle.innerHTML = usePagination ? '<i class="fas fa-pager"></i> Switch to Virtual Scroll' : '<i class="fas fa-pager"></i> Toggle Pagination';
                currentPage = 1;
                updateTable();
            });

            const clearAll = modal.querySelector('.clear-all');
            clearAll.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the entire tracker list? This action cannot be undone.')) {
                    trackerCache = {};
                    saveTrackerData();
                    updateTable();
                    showToast('Tracker list cleared', 'success');
                    const currentUrl = getCurrentDoujinshiUrl();
                    const buttonsDiv = document.querySelector('.buttons');
                    if (currentUrl && buttonsDiv) updateUI(buttonsDiv, currentUrl);
                }
            });

            const restoreBackup = modal.querySelector('.restore-backup');
            restoreBackup.addEventListener('click', () => {
                handleRestoreBackup();
                updateTable();
            });

            updateTable();
        };

        renderModalContent();
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    };

    const addTrackerButtons = () => {
        const buttonsDiv = document.querySelector('.buttons');
        if (!buttonsDiv || buttonsDiv.querySelector('.tracker-btn')) return;

        const url = getCurrentDoujinshiUrl();
        if (!url) return;

        const statusButtonsContainer = document.createElement('div');
        statusButtonsContainer.className = 'status-buttons-container';

        const statuses = [
            { name: 'Plan to Read', class: 'plan-to-read', status: 'Plan to Read' },
            { name: 'Reading', class: 'reading', status: 'Reading' },
            { name: 'Finished', class: 'finished', status: 'Finished' }
        ];

        statuses.forEach(({ name, class: btnClass, status }) => {
            const button = document.createElement('button');
            button.className = `tracker-btn ${btnClass}`;
            button.dataset.status = status;
            button.innerHTML = `<i class="fas fa-book"></i> ${name}`;
            button.title = `Mark this doujinshi as "${name}"`;
            button.setAttribute('aria-label', `Mark as ${name}`);
            button.addEventListener('click', () => handleStatusClick(url, status, buttonsDiv));
            statusButtonsContainer.appendChild(button);
        });

        const removeBtn = document.createElement('button');
        removeBtn.className = 'tracker-btn remove-entry';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove Entry';
        removeBtn.title = 'Remove this doujinshi from the tracker';
        removeBtn.setAttribute('aria-label', 'Remove this doujinshi from the tracker');
        removeBtn.addEventListener('click', () => handleRemoveEntry(url, buttonsDiv));
        statusButtonsContainer.appendChild(removeBtn);

        const quickListBtn = document.createElement('button');
        quickListBtn.className = 'tracker-btn quick-list';
        quickListBtn.innerHTML = '<i class="fas fa-list"></i> View Quick List';
        quickListBtn.title = 'View a quick list of tracked doujinshis';
        quickListBtn.setAttribute('aria-label', 'View quick list of tracked doujinshis');
        quickListBtn.addEventListener('click', () => showTrackerList('Quick Tracker List'));
        statusButtonsContainer.appendChild(quickListBtn);

        buttonsDiv.appendChild(statusButtonsContainer);

        const importExportContainer = document.createElement('div');
        importExportContainer.className = 'import-export-container';

        const exportBtn = document.createElement('button');
        exportBtn.className = 'import-export-btn';
        exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export List';
        exportBtn.title = 'Export your tracker list as a JSON file';
        exportBtn.setAttribute('aria-label', 'Export tracker list');
        exportBtn.addEventListener('click', handleExport);
        importExportContainer.appendChild(exportBtn);

        const importBtn = document.createElement('button');
        importBtn.className = 'import-export-btn';
        importBtn.innerHTML = '<i class="fas fa-file-import"></i> Import List';
        importBtn.title = 'Import a tracker list from a JSON file';
        importBtn.setAttribute('aria-label', 'Import tracker list');
        importBtn.addEventListener('click', handleImport);
        importExportContainer.appendChild(importBtn);

        buttonsDiv.appendChild(importExportContainer);

        updateUI(buttonsDiv, url);
        trackReadProgress();
    };

    const addListButton = () => {
        if (window.location.pathname !== '/') return;
        const container = document.querySelector('body');
        if (!container || container.querySelector('.list-btn')) return;

        const listBtn = document.createElement('button');
        listBtn.className = 'list-btn';
        listBtn.innerHTML = '<i class="fas fa-list"></i> View Tracker List';
        listBtn.title = 'View all tracked doujinshis';
        listBtn.setAttribute('aria-label', 'View tracker list');
        listBtn.style.position = 'fixed';
        listBtn.style.top = '50px';
        listBtn.style.right = '10px';
        listBtn.style.zIndex = '1000';
        listBtn.addEventListener('click', () => showTrackerList('Tracker List'));
        container.appendChild(listBtn);
    };

    const observer = new MutationObserver(() => {
        addTrackerButtons();
        addListButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addTrackerButtons();
    addListButton();

    window.addEventListener('unload', () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(backupInterval);
    });
})();
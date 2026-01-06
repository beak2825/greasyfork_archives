// ==UserScript==
// @name         Grok Favorites Batch Download
// @namespace    https://greasyfork.org/pt-BR/users/1556138-marcos-monteiro
// @version      2026.01.05.8
// @description  Batch download videos and images from Grok 'imagine' collections, supporting history tracking to prevent duplicate downloads
// @author       mcm. Based on a script under MIT License (Grok 收藏批量下载 - https://greasyfork.org/pt-BR/scripts/556281-grok-%E6%94%B6%E8%97%8F%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD) authored by 3989364 https://greasyfork.org/zh-CN/users/309232-3989364
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561435/Grok%20Favorites%20Batch%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/561435/Grok%20Favorites%20Batch%20Download.meta.js
// ==/UserScript==

function createDownloadPanel(onDownloadCallback) {
    // 1. Constants and Tools
    const MIN_DATE = '2025-01-01';
    // Get current date and format as YYYY-MM-DD (local time)
    const getTodayStr = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
        ;
    const MAX_DATE = getTodayStr();

    const SETTINGS_KEY = 'GROK_DOWNLOAD_SETTINGS';
    const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    const saveSetting = (key, value) => {
        const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        settings[key] = value;
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    };

    // 2. Create Container Panel
    const panel = document.createElement('div');
    panel.style.cssText = `
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        background-color: #000000ff;
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        gap: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        max-width: 500px;
        position: fixed;
        left: 5rem;
        top: 3rem;
        opacity: 0.9;
        z-index: 2147483647;
    `;

    // 2.1 Create Header Row
    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #333;';

    const headerTitle = document.createElement('div');
    headerTitle.style.cssText = 'display: flex; align-items: baseline; gap: 6px;';

    const titleText = document.createElement('span');
    titleText.innerText = 'Grok Downloader';
    titleText.style.cssText = 'font-weight: bold; font-size: 16px; color: #e0e0e0;';

    const versionText = document.createElement('span');
    versionText.innerText = typeof GM_info !== 'undefined' ? `v${GM_info.script.version}` : '';
    versionText.style.cssText = 'font-size: 11px; color: #888; font-weight: normal;';

    headerTitle.appendChild(titleText);
    headerTitle.appendChild(versionText);

    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&#10005;';
    closeBtn.style.cssText = 'cursor: pointer; color: #aaa; font-size: 18px; padding: 0 5px;';
    closeBtn.onmouseover = () => closeBtn.style.color = '#fff';
    closeBtn.onmouseout = () => closeBtn.style.color = '#aaa';

    headerRow.appendChild(headerTitle);
    headerRow.appendChild(closeBtn);

    // 3. Create Date Row (Row 1)
    const dateRow = document.createElement('div');
    dateRow.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #333;';

    const createDateInput = (labelText, id, initialValue) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.innerText = labelText;
        label.style.fontSize = '12px';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'date';
        input.min = MIN_DATE;
        input.max = MAX_DATE;
        input.value = initialValue || MAX_DATE;
        input.style.padding = '5px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ddd';

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return {
            wrapper,
            input
        };
    }
        ;

    const createNumberInput = (labelText, defaultValue) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.innerText = labelText;
        label.style.fontSize = '12px';
        label.style.marginBottom = '4px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = '10';
        input.value = defaultValue;
        input.style.padding = '5px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ddd';
        input.style.width = '60px';

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return {
            wrapper,
            input
        };
    };

    const startDateObj = createDateInput('Start Date', 'start-date', savedSettings.startDate);
    const endDateObj = createDateInput('End Date', 'end-date');
    const concurrencyObj = createNumberInput('Concurrency', savedSettings.concurrency || 3);

    startDateObj.input.addEventListener('change', (e) => saveSetting('startDate', e.target.value));
    concurrencyObj.input.addEventListener('change', (e) => saveSetting('concurrency', parseInt(e.target.value, 10)));

    dateRow.appendChild(startDateObj.wrapper);
    dateRow.appendChild(endDateObj.wrapper);
    dateRow.appendChild(concurrencyObj.wrapper);

    const mediaTypeRow = document.createElement('div');
    mediaTypeRow.style.cssText = 'display: flex; gap: 20px; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #333;';

    const createCheckbox = (labelText, defaultChecked, settingKey) => {
        const label = document.createElement('label');
        label.style.cssText = 'display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = defaultChecked;

        if (settingKey) {
            input.addEventListener('change', (e) => saveSetting(settingKey, e.target.checked));
        }

        const span = document.createElement('span');
        span.innerText = labelText;

        label.appendChild(input);
        label.appendChild(span);
        return {
            label,
            input
        };
    }
        ;

    const videoCheckObj = createCheckbox('Video', savedSettings.includeVideo !== undefined ? savedSettings.includeVideo : true, 'includeVideo');
    const saveImgFilesCheckObj = createCheckbox('Images', savedSettings.saveImgFiles !== undefined ? savedSettings.saveImgFiles : true, 'saveImgFiles');
    const saveMetadataCheckObj = createCheckbox('Metadata', savedSettings.saveMetadata !== undefined ? savedSettings.saveMetadata : false, 'saveMetadata');
    const includeCredentialsCheckObj = createCheckbox('Download with credentials', true);
    const urlOnlyCheckObj = createCheckbox('URL Only', false);

    mediaTypeRow.appendChild(videoCheckObj.label);
    mediaTypeRow.appendChild(saveImgFilesCheckObj.label);
    mediaTypeRow.appendChild(saveMetadataCheckObj.label);

    // 5. Create Button Rows
    const historyBtnRow = document.createElement('div');
    historyBtnRow.style.cssText = 'display: flex; flex-direction: column; gap: 5px; padding-bottom: 10px; border-bottom: 1px solid #333; align-items: center;';

    const historyLabel = document.createElement('span');
    historyLabel.innerText = 'Download History:';
    historyLabel.style.color = '#ccc';
    historyLabel.style.fontSize = '12px';

    const actionBtnRow = document.createElement('div');
    actionBtnRow.style.cssText = 'display: flex; flex-direction: column; gap: 5px; align-items: center;';

    const executeLabel = document.createElement('span');
    executeLabel.innerText = 'Execute:';
    executeLabel.style.color = '#ccc';
    executeLabel.style.fontSize = '12px';

    const actionButtonsContainer = document.createElement('div');
    actionButtonsContainer.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;';

    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = 'Download';
    downloadBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    `;
    downloadBtn.onmouseover = () => downloadBtn.style.backgroundColor = '#0056b3';
    downloadBtn.onmouseout = () => downloadBtn.style.backgroundColor = '#007bff';

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancel';
    cancelBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
        display: none;
    `;
    cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = '#c82333';
    cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = '#dc3545';

    const clearHistoryBtn = document.createElement('button');
    clearHistoryBtn.innerText = 'Clear';
    clearHistoryBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    `;
    clearHistoryBtn.onmouseover = () => clearHistoryBtn.style.backgroundColor = '#5a6268';
    clearHistoryBtn.onmouseout = () => clearHistoryBtn.style.backgroundColor = '#6c757d';
    clearHistoryBtn.onclick = () => {
        if (confirm('Are you sure you want to clear the download history? This will cause previously downloaded files to be downloaded again.')) {
            DownloadRecordStore.clear();
            alert('Download history cleared.');
        }
    };

    const exportHistoryBtn = document.createElement('button');
    exportHistoryBtn.innerText = 'Export';
    exportHistoryBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #17a2b8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    `;
    exportHistoryBtn.onmouseover = () => exportHistoryBtn.style.backgroundColor = '#138496';
    exportHistoryBtn.onmouseout = () => exportHistoryBtn.style.backgroundColor = '#17a2b8';
    exportHistoryBtn.onclick = () => DownloadRecordStore.export();

    const importHistoryBtn = document.createElement('button');
    importHistoryBtn.innerText = 'Import';
    importHistoryBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    `;
    importHistoryBtn.onmouseover = () => importHistoryBtn.style.backgroundColor = '#218838';
    importHistoryBtn.onmouseout = () => importHistoryBtn.style.backgroundColor = '#28a745';

    const dryRunBtn = document.createElement('button');
    dryRunBtn.innerText = 'Dry Run';
    dryRunBtn.style.cssText = `
        padding: 8px 16px;
        background-color: #fd7e14;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background 0.2s;
    `;
    dryRunBtn.onmouseover = () => dryRunBtn.style.backgroundColor = '#e96b02';
    dryRunBtn.onmouseout = () => dryRunBtn.style.backgroundColor = '#fd7e14';

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.style.display = 'none';

    importHistoryBtn.onclick = () => importInput.click();

    importInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (Array.isArray(json)) {
                    const addedCount = DownloadRecordStore.import(json);
                    alert(`Import successful! Added ${addedCount} new records. Total records: ${DownloadRecordStore.urls.length}`);
                } else {
                    alert('Invalid JSON format. Expected an array of URLs.');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to parse JSON file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const historyButtonsContainer = document.createElement('div');
    historyButtonsContainer.style.cssText = 'display: flex; gap: 10px;';

    historyBtnRow.appendChild(historyLabel);
    historyButtonsContainer.appendChild(exportHistoryBtn);
    historyButtonsContainer.appendChild(importHistoryBtn);
    historyButtonsContainer.appendChild(clearHistoryBtn);
    historyBtnRow.appendChild(historyButtonsContainer);

    actionBtnRow.appendChild(executeLabel);
    actionButtonsContainer.appendChild(downloadBtn);
    actionButtonsContainer.appendChild(dryRunBtn);
    actionButtonsContainer.appendChild(cancelBtn);
    actionBtnRow.appendChild(actionButtonsContainer);

    // 6. Progress Bar
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = 'display: none; width: 100%; margin-top: 10px;';

    const progressBarBg = document.createElement('div');
    progressBarBg.style.cssText = 'width: 100%; background: #444; height: 8px; border-radius: 4px; overflow: hidden;';

    const progressBarFill = document.createElement('div');
    progressBarFill.style.cssText = 'width: 0%; background: #28a745; height: 100%; transition: width 0.2s;';

    const progressText = document.createElement('div');
    progressText.style.cssText = 'color: #ccc; font-size: 12px; text-align: center; margin-top: 4px; font-family: monospace;';

    progressBarBg.appendChild(progressBarFill);
    progressContainer.appendChild(progressBarBg);
    progressContainer.appendChild(progressText);

    // 7. Log Container
    const logContainer = document.createElement('div');
    logContainer.style.cssText = 'width: 100%; height: 150px; background: #222; color: #0f0; font-family: monospace; font-size: 11px; overflow-y: auto; padding: 5px; border: 1px solid #444; border-radius: 4px; margin-top: 10px; white-space: pre-wrap; box-sizing: border-box; display: none;';

    const downloadLogBtn = document.createElement('button');
    downloadLogBtn.innerText = 'Download Log';
    downloadLogBtn.style.cssText = `
        padding: 5px 10px;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin-top: 5px;
        align-self: flex-end;
        display: none;
    `;
    downloadLogBtn.onmouseover = () => downloadLogBtn.style.backgroundColor = '#5a6268';
    downloadLogBtn.onmouseout = () => downloadLogBtn.style.backgroundColor = '#6c757d';
    downloadLogBtn.onclick = () => panelManager.saveLog();

    // 8. Assemble DOM
    panel.appendChild(headerRow);
    panel.appendChild(dateRow);
    panel.appendChild(mediaTypeRow);
    // Natural line break
    panel.appendChild(historyBtnRow);
    panel.appendChild(actionBtnRow);
    panel.appendChild(importInput);
    panel.appendChild(progressContainer);
    panel.appendChild(logContainer);
    panel.appendChild(downloadLogBtn);
    // Natural line break

    // 9. Logic Validation and Callback Handling
    const validateDates = () => {
        const start = startDateObj.input.value;
        const end = endDateObj.input.value;

        if (!start || !end) {
            alert("Please select a complete date range.");
            return false;
        }
        if (start < MIN_DATE) {
            alert(`Start date cannot be earlier than ${MIN_DATE}`);
            return false;
        }
        if (end > MAX_DATE) {
            alert("End date cannot be later than today.");
            return false;
        }
        if (start > end) {
            alert("Start date cannot be later than the end date.");
            return false;
        }
        return true;
    }
        ;

    // Listen for input changes, assist with correction (Optional UX: auto-limit range)
    startDateObj.input.addEventListener('change', (e) => {
        endDateObj.input.min = e.target.value;
        // End date cannot be earlier than start date
    }
    );

    const panelManager = {
        panel,
        isShow: false,
        abortController: null,
        show() {
            if (!this.panel.isConnected) {
                document.body.appendChild(this.panel);
            }
            downloadBtn.innerText = 'Download'
            this.panel.style.display = 'flex'
            logContainer.style.display = 'block'
            downloadLogBtn.style.display = 'block'
            this.resetProgress()
            this.isShow = true
        },
        hide() {
            this.panel.style.display = 'none'
            this.isShow = false
        },
        toggle() {
            this.isShow ? this.hide() : this.show()
        },
        init() {
            document.body.appendChild(this.panel);

            closeBtn.onclick = () => this.hide();

            cancelBtn.onclick = () => {
                if (this.abortController) {
                    this.abortController.abort();
                }
            };

            const startProcess = async (isDryRun) => {
                if (!validateDates()) {
                    return;
                }

                this.clearLog();
                this.log(`Starting ${isDryRun ? 'Dry Run' : 'Download'}...`);

                const data = {
                    startDate: new Date(startDateObj.input.value + 'T00:00:00'),
                    endDate: new Date(endDateObj.input.value + 'T23:59:59.999'),
                    includeVideo: videoCheckObj.input.checked,
                    saveImgFiles: saveImgFilesCheckObj.input.checked,
                    saveMetadata: saveMetadataCheckObj.input.checked,
                    includeCredentials: includeCredentialsCheckObj.input.checked,
                    urlOnly: urlOnlyCheckObj.checked,
                    maxConcurrency: parseInt(concurrencyObj.input.value, 10) || 3,
                    isDryRun: isDryRun
                };

                downloadBtn.style.display = 'none';
                dryRunBtn.style.display = 'none';
                cancelBtn.style.display = 'inline-block';
                this.abortController = new AbortController();

                try {
                    // Execute user callback
                    if (typeof onDownloadCallback === 'function') {
                        await onDownloadCallback(data, this);
                    } else {
                        console.warn('No callback provided');
                    }
                } catch (err) {
                    if (err.name === 'AbortError' || err.message === 'Cancelled') {
                        this.updateStatus('Cancelled');
                    } else {
                        console.error(err);
                        this.updateStatus('Error');
                    }
                } finally {
                    downloadBtn.style.display = 'inline-block';
                    dryRunBtn.style.display = 'inline-block';
                    cancelBtn.style.display = 'none';
                    this.abortController = null;
                }
            }

            downloadBtn.onclick = () => startProcess(false);
            dryRunBtn.onclick = () => startProcess(true);
        },
        destory() {
            this.panel.remove()
        },
        updateStatus(msg) {
            this.log(msg)
        },
        updateProgress(current, total) {
            progressContainer.style.display = 'block';
            const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
            progressBarFill.style.width = `${percentage}%`;
            progressText.innerText = `Downloading ${current}/${total}`;
        },
        resetProgress() {
            progressContainer.style.display = 'none';
            progressBarFill.style.width = '0%';
            progressText.innerText = '';
        },
        log(msg, type = 'info') {
            const line = document.createElement('div');
            const time = new Date().toLocaleTimeString();
            line.textContent = `[${time}] ${msg}`;
            if (type === 'error') line.style.color = '#ff4444';
            if (type === 'success') line.style.color = '#00cc00';
            if (type === 'warning') line.style.color = '#ffcc00';
            logContainer.appendChild(line);
            logContainer.scrollTop = logContainer.scrollHeight;
        },
        clearLog() {
            logContainer.innerHTML = '';
        },
        saveLog() {
            const content = logContainer.innerText;
            if (content && content.trim()) {
                const blob = new Blob([content], { type: 'text/plain' });
                const d = new Date();
                const pad = (n) => String(n).padStart(2, '0');
                const timestamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
                downloadFile(`grok-log-${timestamp}.txt`, blob);
            }
        },
        get signal() {
            return this.abortController ? this.abortController.signal : null;
        }
    };

    panelManager.hide()

    return panelManager
}

async function get_media_list(cursor, signal) {
    const body = {
        "limit": 100,
        "filter": {
            // Only get liked videos/media
            "source": "MEDIA_POST_SOURCE_LIKED"
        },
        cursor
    }

    const resp = await fetch("https://grok.com/rest/media/post/list", {
        "referrer": "https://grok.com/imagine",
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "include",
        signal
    });

    const data = await resp.json()

    return data
}

function downloadFile(filename, blob) {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
}

async function downloadFileFromURL(filename, url, includeCredentials, signal) {
    const performFetch = async (creds) => {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: creds,
            signal,
        });

        if (!response.ok) {
            throw new Error(`Download failed, HTTP status: ${response.status} ${response.statusText}`);
        }
        return await response.blob();
    };

    // Try downloading with the specified credential mode    
    try {
        const blob = await performFetch(includeCredentials ? 'include' : 'omit');
        downloadFile(filename, blob)
    } catch (err) {
        if (err.name == 'AbortError') throw err;
        // Try downloading with opposite specified credential mode    
        try {
            const blob = await performFetch(!includeCredentials ? 'include' : 'omit');
            downloadFile(filename, blob);
            return;
        } catch (e) {
            console.error('Error trying downloading again with' + (includeCredentials ? '' : 'out') + ' and with' + (!includeCredentials ? 'out' : '') + ' credentials:', err);
            throw e;
        }
    }
}

const DownloadRecordStore = {
    key: 'GROK_DOWNLOAD_FILES',
    urls: null,
    add(url) {
        if (!this.has(url)) {
            this.urls.push(url)
            localStorage.setItem(this.key, JSON.stringify(this.urls))
        }
    },
    load() {
        this.urls = JSON.parse(localStorage.getItem(this.key) || '[]')
    },
    has(url) {
        if (this.urls == null) {
            this.load()
        }

        return this.urls.indexOf(url) > -1
    },
    clear() {
        this.urls = []
        localStorage.removeItem(this.key)
    },
    export() {
        if (this.urls == null) {
            this.load()
        }
        const blob = new Blob([JSON.stringify(this.urls, null, 2)], { type: 'application/json' })
        const d = new Date();
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        downloadFile(`grok-download-history-${dateStr}.json`, blob)
    },
    import(urlList) {
        if (this.urls == null) {
            this.load()
        }
        let count = 0
        urlList.forEach(url => {
            if (this.urls.indexOf(url) === -1) {
                this.urls.push(url)
                count++
            }
        })
        if (count > 0) {
            localStorage.setItem(this.key, JSON.stringify(this.urls))
        }
        return count
    }
}

const handleDownloadMedias = async (mediaList, { includeVideo, saveImgFiles, saveMetadata, includeCredentials, isDryRun, maxConcurrency }, signal, onProgress, onLog, stats) => {
    const downloadedFileUrls = []
    const MAX_CONCURRENCY = maxConcurrency || 3;

    const totalDownloads = mediaList.reduce((count, media) => {
        const { mimeType: type } = media;
        const isImage = type.startsWith('image');
        const shouldDownloadMedia = isImage ? saveImgFiles : includeVideo;

        let inc = 0;
        if (shouldDownloadMedia) inc++;
        if (saveMetadata) inc++;
        return count + inc;
    }, 0);
    let currentDownload = 0;

    const tasks = [];

    for (const media of mediaList) {
        const { mimeType: type, mediaUrl: url } = media
        const isImage = type.startsWith('image');

        const shouldDownloadMedia = isImage ? saveImgFiles : includeVideo;

        if (shouldDownloadMedia || saveMetadata) {
            let filename = ""
            let useCredentials = includeCredentials;
            if (url.includes('imagine-public.x.ai')) {
                // https://imagine-public.x.ai/imagine-public/images/xxx_filename_xxx.xxx
                filename = (url.split('/').slice(-1)[0]).split('.').slice(0, -1).join('.')
                useCredentials = false
            } else {
                // https://assets.grok.com/users/xxx_user_xxx/generated/xxx_filename_xxx/generated_video.mp4
                // https://assets.grok.com/users/xxx_user_xxx/generated/xxx_filename_xxx/image.jpg
                filename = url.split('/').slice(-2)[0]
                useCredentials = true
            }
            const ext = type.split('/')[1]

            if (saveMetadata) {
                const metadataBlob = new Blob([JSON.stringify(media, null, 2)], { type: 'application/json' });
                tasks.push({
                    blob: metadataBlob,
                    filename: `${filename}.json`,
                    useCredentials: false,
                    isImage: false,
                    isMetadata: true
                });
            }

            if (shouldDownloadMedia) {
                tasks.push({
                    url,
                    filename: `${filename}.${ext}`,
                    useCredentials,
                    isImage
                });
            }
        }
    }

    const activePromises = [];

    for (const task of tasks) {
        if (signal && signal.aborted) throw new Error('Cancelled');

        const taskPromise = (async () => {
            const { url, filename, useCredentials, isImage, isMetadata, blob } = task;
            try {
                if (!isDryRun) {
                    if (isMetadata && blob) {
                        await new Promise(r => setTimeout(r, 250)); // Throttling for UI responsiveness
                        downloadFile(filename, blob);
                    } else {
                        await downloadFileFromURL(filename, url, useCredentials, signal)
                    }
                } else {
                    if (onLog) onLog(`[Dry Run] Processed: ${filename}`, 'warning');
                }
                if (!isMetadata) {
                    downloadedFileUrls.push(url)
                    DownloadRecordStore.add(url)
                }
                currentDownload++;
                if (onProgress) onProgress(currentDownload, totalDownloads);
                if (stats) {
                    if (isMetadata) stats.metadata.success++;
                    else if (isImage) stats.images.success++;
                    else stats.videos.success++;
                }
            } catch (e) {
                if (e.name === 'AbortError' || e.message === 'AbortError') throw e;
                if (onLog) onLog(`Error downloading ${filename}: ${e.message}\nURL: ${url}`, 'error');
                if (stats) {
                    if (isMetadata) stats.metadata.error++;
                    else if (isImage) stats.images.error++;
                    else stats.videos.error++;
                }
            }
        })();

        const p = taskPromise.then(() => {
            activePromises.splice(activePromises.indexOf(p), 1);
        });
        activePromises.push(p);

        if (activePromises.length >= MAX_CONCURRENCY) {
            await Promise.race(activePromises);
        }
    }

    await Promise.all(activePromises);

    return [...downloadedFileUrls]
}

const handleDownloadBtnClick = async (options, panel) => {
    panel.log("Executing download operation...");
    panel.log(`Start Date: ${options.startDate}`);
    panel.log(`End Date: ${options.endDate}`);
    panel.log(`Include Video: ${options.includeVideo}`);
    panel.log(`Save Img Files: ${options.saveImgFiles}`);
    panel.log(`Save Metadata: ${options.saveMetadata}`);
    panel.log(`Include Credentials: ${options.includeCredentials}`);
    panel.log(`Max Concurrency: ${options.maxConcurrency}`);
    panel.log(`Dry Run: ${options.isDryRun}`);

    const signal = panel.signal;
    const stats = {
        images: { success: 0, error: 0 },
        videos: { success: 0, error: 0 },
        metadata: { success: 0, error: 0 }
    };

    const flattenMediaList = (_data) => {
        const mediaList = []

        const helper = (data) => {
            for (const item of data) {
                const childPosts = [...item.childPosts]
                delete item.childPosts

                mediaList.push(item)

                helper(childPosts)
            }
        }

        helper(_data)

        return mediaList
    }

    const filterMediaListByDate = (mediaList, startDate, endDate) => {
        return mediaList.filter(({ createTime }) => {
            const time = new Date(createTime)
            return time >= startDate && time <= endDate
        })
    }

    let cursor, posts, mediaList = []

    try {
        do {
            if (signal && signal.aborted) throw new Error('Cancelled');
            try {
                ({ posts, nextCursor: cursor } = await get_media_list(cursor, signal));
            } catch (e) {
                if (e.name === 'AbortError') throw new Error('Cancelled');
                throw e;
            }
            const { startDate, endDate } = options

            const filteredPosts = filterMediaListByDate(flattenMediaList(posts), startDate, endDate)

            if (!filteredPosts.length) {
                break
            }

            mediaList.push(...filteredPosts)
            panel.updateStatus(`Fetching list (${mediaList.length})`)
        } while (posts && posts.length && cursor)

        if (signal && signal.aborted) throw new Error('Cancelled');

        panel.updateStatus(`Downloading`)
        // Exclude downloaded files

        const downloadedFileUrls = await handleDownloadMedias(
            mediaList.filter(({ mediaUrl }) => !DownloadRecordStore.has(mediaUrl)),
            options,
            signal,
            (curr, total) => panel.updateProgress(curr, total),
            (msg, type) => panel.log(msg, type),
            stats
        )

        panel.updateStatus(`Done`)
    } finally {
        panel.log('===========================');
        panel.log('     DOWNLOAD SUMMARY      ');
        panel.log('===========================');
        panel.log(`Images: ${stats.images.success} Success, ${stats.images.error} Failed`);
        panel.log(`Videos: ${stats.videos.success} Success, ${stats.videos.error} Failed`);
        panel.log(`Metadata: ${stats.metadata.success} Success, ${stats.metadata.error} Failed`);
        panel.log('===========================');
    }
};


/**
 * Wait for a specific element to appear in the DOM
 * @param {string} selector - CSS selector
 * @param {number} [timeout=0] - Timeout in ms, 0 means infinite wait
 * @returns {Promise<HTMLElement>}
 */
function waitForElement(selector, timeout = 0) {
    return new Promise((resolve, reject) => {
        // 1. If element already exists, resolve immediately
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }

        // 2. Define observer
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                observer.disconnect(); // Stop observing after finding
            }
        });

        // 3. Start observing document.body child nodes
        observer.observe(document.body, {
            childList: true, // Watch for child node additions/removals
            subtree: true    // Watch all descendants, not just direct children
        });

        // 4. (Optional) Timeout handling
        if (timeout > 0) {
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: Element '${selector}' not found within ${timeout}ms`));
            }, timeout);
        }
    });
}

const createDownloadIcon = () => {
    const container = document.createElement('div');
    container.classList.add('grok-download-icon');
    Object.assign(container.style, {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        marginLeft: '15px',
        cursor: 'pointer',
        backgroundColor: '#1d9bf0',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        verticalAlign: 'middle'
    });
    container.onmouseover = () => container.style.backgroundColor = '#1a8cd8';
    container.onmouseout = () => container.style.backgroundColor = '#1d9bf0';

    const text = document.createElement('span');
    text.innerText = 'Grok Downloader';

    const icon = document.createElement('div');
    icon.style.display = 'flex';
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`;

    container.appendChild(text);
    container.appendChild(icon);

    return container;
}

/**
 * Universal solution for listening to SPA URL changes
 * @param {Function} callback - Callback function when URL changes
 */
function onUrlChange(callback) {
    // 1. Listen for browser Back/Forward (natively supported)
    window.addEventListener('popstate', () => {
        callback(location.href);
    });

    // 2. Intercept pushState (Standard routing navigation)
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
        // Execute original pushState
        originalPushState.apply(this, args);
        // Trigger callback
        callback(location.href);
    };

    // 3. Intercept replaceState (Route replacement, no history record)
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        callback(location.href);
    };
}

async function nextTick() { }

(async function () {
    'use strict';

    const dlPanel = createDownloadPanel(handleDownloadBtnClick);
    dlPanel.init()

    // Initialize download panel
    onUrlChange(async (currentUrl) => {
        dlPanel.hide()

        if (!currentUrl.includes('/imagine/favorites')) {
            return
        }

        await nextTick()

        const mountEl = await waitForElement('div > h1')
        const icon = createDownloadIcon()

        if (mountEl.querySelector('.grok-download-icon')) {
            return
        }

        mountEl.appendChild(icon)
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            dlPanel.toggle()
        })
    })
})();
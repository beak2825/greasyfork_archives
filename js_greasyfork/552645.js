// ==UserScript==
// @name         LangLink Argos XLIFF 导出工具
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  从 Argos Multilingual Web Editor 捕获句段并导出标准 XLIFF 文件
// @author       LL-Floyd
// @match        https://editor.argosmultilingual.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @connect      update.greasyfork.org
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552645/LangLink%20Argos%20XLIFF%20%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552645/LangLink%20Argos%20XLIFF%20%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WRAPPER_ID = 'll-argos-control-wrapper';
    const PANEL_ID = 'll-argos-control-panel';
    const ICON_ID = 'll-argos-control-icon';
    const MAIN_BUTTON_ID = 'll-argos-generate-btn';
    const COMBINED_BUTTON_ID = 'll-argos-combined-btn';
    const ZIP_BUTTON_ID = 'll-argos-zip-btn';
    const STATUS_ID = 'll-argos-status';
    const RESULTS_ID = 'll-argos-results';
    const STYLE_ID = 'll-argos-style';
    const SCRIPT_PAGE_URL = 'https://greasyfork.org/en/scripts/552645-langlink-argos-xliff-%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7';
    const UPDATE_META_URL = 'https://update.greasyfork.org/scripts/552645/LangLink%20Argos%20XLIFF%20%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js';
    const SCRIPT_VERSION = '1.4.0';
    const CURRENT_VERSION = (typeof GM_info !== 'undefined' && GM_info?.script?.version) ? GM_info.script.version : SCRIPT_VERSION;

    const state = {
        assignmentId: null,
        assignment: null,
        authToken: null,
        pageData: null,
        segments: new Map(),
        pageSegments: new Map(),
        latestFiles: [],
        combinedFile: null,
        docNames: new Map(),
        isFetching: false,
        zipInProgress: false,
        ui: null,
        isPanelMinimized: false,
        panelPosition: null,
        dragging: false
    };

    const PAGE_WINDOW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    let nativeFetch = PAGE_WINDOW.fetch.bind(PAGE_WINDOW);

    function log(...args) {
        console.log('[ArgosXLIFF]', ...args);
    }

    function isVersionNewer(latest, current) {
        if (!latest || !current) return false;
        const latestParts = latest.split('.').map(part => parseInt(part, 10) || 0);
        const currentParts = current.split('.').map(part => parseInt(part, 10) || 0);
        const length = Math.max(latestParts.length, currentParts.length);
        for (let i = 0; i < length; i++) {
            const l = latestParts[i] ?? 0;
            const c = currentParts[i] ?? 0;
            if (l > c) return true;
            if (l < c) return false;
        }
        return false;
    }

    function checkForUpdates() {
        if (typeof GM_xmlhttpRequest !== 'function') {
            return;
        }
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: UPDATE_META_URL,
                onload: function (response) {
                    try {
                        const match = /@version\s+([0-9.]+)/.exec(response.responseText || '');
                        const latestVersion = match ? match[1] : null;
                        const currentVersion = CURRENT_VERSION;
                        if (latestVersion && isVersionNewer(latestVersion, currentVersion)) {
                            const message = `检测到 LangLink Argos XLIFF 导出工具 新版本：${latestVersion}\n当前版本：${currentVersion}\n是否前往更新？`;
                            if (PAGE_WINDOW.confirm(message)) {
                                PAGE_WINDOW.open(SCRIPT_PAGE_URL, '_blank');
                            }
                        }
                    } catch (error) {
                        log('处理更新信息时出错', error);
                    }
                },
                onerror: function (error) {
                    log('检查更新失败', error);
                }
            });
        } catch (error) {
            log('初始化更新检查失败', error);
        }
    }

    function setupFetchInterceptor() {
        if (PAGE_WINDOW.__LL_ARGOS_FETCH_INTERCEPTOR__) {
            return;
        }
        PAGE_WINDOW.__LL_ARGOS_FETCH_INTERCEPTOR__ = true;

        nativeFetch = PAGE_WINDOW.fetch.bind(PAGE_WINDOW);

        PAGE_WINDOW.fetch = function interceptedFetch(input, init) {
            let url = '';
            if (typeof input === 'string') {
                url = input;
            } else if (input && typeof input === 'object' && 'url' in input) {
                url = input.url;
            }

            try {
                const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
                const auth = headers.get('authorization');
                if (auth && auth.startsWith('Bearer ') && state.authToken !== auth) {
                    state.authToken = auth;
                    updateButtonState({ keepStatus: true });
                }
            } catch (error) {
                log('读取请求头失败', error);
            }

            const fetchPromise = nativeFetch(input, init);

            fetchPromise.then(response => {
                try {
                    processResponse(url, response);
                } catch (error) {
                    log('处理响应失败', error);
                }
            }).catch(error => {
                log('fetch 调用失败', error);
            });

            return fetchPromise;
        };
    }

    function processResponse(requestUrl, response) {
        if (!response || typeof response.clone !== 'function') {
            return;
        }

        let fullUrl;
        try {
            fullUrl = new URL(requestUrl, PAGE_WINDOW.location.origin);
        } catch (error) {
            return;
        }

        const pathParts = fullUrl.pathname.split('/').filter(Boolean);
        if (pathParts.length < 3 || pathParts[0] !== 'dr' || pathParts[1] !== 'assignments') {
            return;
        }

        const assignmentId = pathParts[2];
        const resource = pathParts[3] || '';

        if (!state.assignmentId && assignmentId) {
            state.assignmentId = assignmentId;
            updateButtonState({ keepStatus: true });
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return;
        }

        response.clone().json().then(data => {
            if (!data) return;

            if (resource.startsWith('segments')) {
                const assignmentPosParam = fullUrl.searchParams.get('assignmentPos');
                const assignmentPos = assignmentPosParam !== null ? Number(assignmentPosParam) : null;
                handleSegmentsData(data, assignmentPos);
            } else if (resource.startsWith('pages')) {
                handlePagesData(data);
            } else {
                handleAssignmentData(data, assignmentId);
            }

            updateButtonState({ keepStatus: true });
        }).catch(() => {});
    }

    function handleAssignmentData(data, assignmentId) {
        if (!data || typeof data !== 'object') {
            return;
        }
        const id = assignmentId || data?.id;
        if (id && !state.assignmentId) {
            state.assignmentId = id;
        }
        if (!state.assignment || !state.assignment.id) {
            state.assignment = data;
            state.latestFiles = [];
            state.combinedFile = null;
            state.docNames = new Map();
        } else if (state.assignment.id && data.id && data.id !== state.assignment.id) {
            state.assignment = data;
            state.latestFiles = [];
            state.combinedFile = null;
            state.docNames = new Map();
        } else {
            const merged = { ...state.assignment, ...data };
            if (state.assignment.bundle || data.bundle) {
                merged.bundle = { ...state.assignment.bundle, ...data.bundle };
                if (data.bundle?.docEntries) {
                    merged.bundle.docEntries = data.bundle.docEntries;
                } else if (state.assignment.bundle?.docEntries) {
                    merged.bundle.docEntries = state.assignment.bundle.docEntries;
                }
            }
            if (data.docEntries) {
                merged.docEntries = data.docEntries;
            } else if (merged.bundle?.docEntries && !merged.docEntries) {
                merged.docEntries = merged.bundle.docEntries;
            }
            state.assignment = merged;
        }

        if (data.docEntries) {
            state.assignment.docEntries = data.docEntries;
        }
        if (!state.assignment.docEntries && state.assignment.bundle?.docEntries) {
            state.assignment.docEntries = state.assignment.bundle.docEntries;
        }

        const entries = state.assignment.docEntries || state.assignment.bundle?.docEntries;
        if (Array.isArray(entries)) {
            for (const entry of entries) {
                if (entry?.documentSig) {
                    const name = entry.relativePath || entry.name;
                    if (name) {
                        state.docNames.set(entry.documentSig, name);
                    }
                }
            }
        }
    }

    function handlePagesData(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        state.pageData = data;
    }

    function handleSegmentsData(data, assignmentPos) {
        if (!data || !Array.isArray(data.segments)) {
            return;
        }
        for (const segment of data.segments) {
            if (segment && segment.segmentSig) {
                state.segments.set(segment.segmentSig, segment);
            }
        }
        if (assignmentPos !== null && Number.isFinite(assignmentPos)) {
            state.pageSegments.set(assignmentPos, data.segments.map(seg => seg.segmentSig));
        }
    }

    function guessAssignmentIdFromUrl() {
        if (state.assignmentId) {
            return state.assignmentId;
        }
        const match = PAGE_WINDOW.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        if (match) {
            state.assignmentId = match[0];
            updateButtonState({ keepStatus: true });
        }
        return state.assignmentId;
    }

    function initUi() {
        injectStyle();
        createPanel();
    }

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
#${WRAPPER_ID} {
    position: fixed;
    top: 120px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}
#${PANEL_ID} {
    min-width: 280px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.6);
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: #1f2937;
    transition: max-height 0.28s ease, opacity 0.22s ease, transform 0.28s ease, padding 0.28s ease, margin 0.28s ease, border-width 0.28s ease;
}
#${PANEL_ID}.ll-argos-panel-hidden {
    max-height: 0;
    opacity: 0;
    transform: translateY(-12px);
    padding-top: 0;
    padding-bottom: 0;
    margin: 0;
    border-width: 0;
    pointer-events: none;
}
#${PANEL_ID} .ll-argos-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    cursor: move;
    user-select: none;
}
#${PANEL_ID} .ll-argos-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
}
#${PANEL_ID} .ll-argos-version {
    font-size: 11px;
    color: #64748b;
    background: rgba(148, 163, 184, 0.16);
    border-radius: 999px;
    padding: 2px 8px;
}
#${PANEL_ID} .ll-argos-header-button {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: none;
    background: rgba(148, 163, 184, 0.25);
    color: #475569;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, background-color 0.2s ease;
}
#${PANEL_ID} .ll-argos-header-button:hover {
    background: rgba(100, 116, 139, 0.35);
    transform: translateY(-1px);
}
#${PANEL_ID} .ll-argos-header-button:active {
    transform: scale(0.95);
}
#${PANEL_ID} .ll-argos-button-group {
    display: grid;
    gap: 8px;
}
#${PANEL_ID} .ll-argos-button {
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    color: #fff;
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.16);
}
#${PANEL_ID} .ll-argos-button-primary {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
}
#${PANEL_ID} .ll-argos-button-secondary {
    background: linear-gradient(135deg, #0f766e, #14b8a6);
}
#${PANEL_ID} .ll-argos-button-tertiary {
    background: linear-gradient(135deg, #7c3aed, #c084fc);
}
#${PANEL_ID} .ll-argos-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
}
#${PANEL_ID} .ll-argos-button:not(:disabled):hover {
    transform: translateY(-1px);
    cursor: pointer;
    box-shadow: 0 12px 26px rgba(37, 99, 235, 0.25);
}
#${PANEL_ID} .ll-argos-status {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    padding-top: 6px;
    border-top: 1px solid rgba(148, 163, 184, 0.35);
}
#${PANEL_ID} .ll-argos-status[data-type="info"] {
    color: #475569;
}
#${PANEL_ID} .ll-argos-status[data-type="success"] {
    color: #0f766e;
}
#${PANEL_ID} .ll-argos-status[data-type="error"] {
    color: #b91c1c;
}
#${PANEL_ID} .ll-argos-status[data-type="progress"] {
    color: #2563eb;
}
#${PANEL_ID} .ll-argos-files {
    margin-top: 4px;
    max-height: 280px;
    overflow-y: auto;
    display: none;
    border: 1px solid rgba(148, 163, 184, 0.3);
    border-radius: 10px;
    padding: 10px;
    background: rgba(248, 250, 252, 0.75);
}
#${PANEL_ID} .ll-argos-file {
    background: #ffffff;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 10px;
    box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.18);
    display: flex;
    flex-direction: column;
    gap: 6px;
}
#${PANEL_ID} .ll-argos-file-name {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    word-break: break-word;
}
#${PANEL_ID} .ll-argos-file-meta {
    font-size: 12px;
    color: #64748b;
    word-break: break-word;
}
#${PANEL_ID} .ll-argos-file-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
#${PANEL_ID} .ll-argos-file-button {
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: #fff;
    border: none;
    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.2);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease;
}
#${PANEL_ID} .ll-argos-file-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
}
#${PANEL_ID} .ll-argos-file-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
#${ICON_ID} {
    position: fixed;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(29, 78, 216, 0.86), rgba(14, 165, 233, 0.86));
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    letter-spacing: 0.6px;
    cursor: pointer;
    box-shadow: 0 16px 36px rgba(37, 99, 235, 0.45);
    right: 20px;
    bottom: 20px;
    z-index: 9999;
    transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    user-select: none;
}
#${ICON_ID}:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(37, 99, 235, 0.55);
}
#${ICON_ID}.ll-argos-icon-hidden {
    display: none;
}
`;
        document.head.appendChild(style);
    }

    function createPanel() {
        let wrapper = document.getElementById(WRAPPER_ID);
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = WRAPPER_ID;
            document.body.appendChild(wrapper);
        }

        let panel = document.getElementById(PANEL_ID);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = PANEL_ID;

            const header = document.createElement('div');
            header.className = 'll-argos-panel-header';
            header.dataset.dragHandle = 'true';

            const title = document.createElement('span');
            title.textContent = 'Argos XLIFF 工具';
            header.appendChild(title);

            const headerActions = document.createElement('div');
            headerActions.className = 'll-argos-header-actions';

            const version = document.createElement('span');
            version.className = 'll-argos-version';
            version.textContent = `v${CURRENT_VERSION}`;
            headerActions.appendChild(version);

            const minimizeBtn = document.createElement('button');
            minimizeBtn.type = 'button';
            minimizeBtn.className = 'll-argos-header-button';
            minimizeBtn.title = '最小化';
            minimizeBtn.textContent = '—';
            minimizeBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                minimizePanel();
            });
            headerActions.appendChild(minimizeBtn);

            header.appendChild(headerActions);
            panel.appendChild(header);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'll-argos-button-group';

            const mainButton = document.createElement('button');
            mainButton.id = MAIN_BUTTON_ID;
            mainButton.className = 'll-argos-button ll-argos-button-primary';
            mainButton.type = 'button';
            mainButton.textContent = '等待数据...';
            mainButton.disabled = true;
            mainButton.addEventListener('click', handleGenerateClick);
            buttonGroup.appendChild(mainButton);

            const combinedButton = document.createElement('button');
            combinedButton.id = COMBINED_BUTTON_ID;
            combinedButton.className = 'll-argos-button ll-argos-button-tertiary';
            combinedButton.type = 'button';
            combinedButton.textContent = '下载合并XLIFF';
            combinedButton.disabled = true;
            combinedButton.addEventListener('click', handleCombinedDownload);
            buttonGroup.appendChild(combinedButton);

            const zipButton = document.createElement('button');
            zipButton.id = ZIP_BUTTON_ID;
            zipButton.className = 'll-argos-button ll-argos-button-secondary';
            zipButton.type = 'button';
            zipButton.textContent = '下载ZIP';
            zipButton.disabled = true;
            zipButton.addEventListener('click', handleZipClick);
            buttonGroup.appendChild(zipButton);

            panel.appendChild(buttonGroup);

            const status = document.createElement('div');
            status.id = STATUS_ID;
            status.className = 'll-argos-status';
            status.dataset.type = 'info';
            status.textContent = '正在初始化…';
            panel.appendChild(status);

            const results = document.createElement('div');
            results.id = RESULTS_ID;
            results.className = 'll-argos-files';
            panel.appendChild(results);

            wrapper.appendChild(panel);

            state.ui = { wrapper, panel, mainButton, combinedButton, zipButton, status, results };

            ensureControlIcon();
            enableDrag(wrapper, header);

            const rect = wrapper.getBoundingClientRect();
            state.panelPosition = { top: rect.top, left: rect.left };
        } else {
            state.ui = {
                wrapper,
                panel,
                mainButton: panel.querySelector(`#${MAIN_BUTTON_ID}`),
                combinedButton: panel.querySelector(`#${COMBINED_BUTTON_ID}`),
                zipButton: panel.querySelector(`#${ZIP_BUTTON_ID}`),
                status: panel.querySelector(`#${STATUS_ID}`),
                results: panel.querySelector(`#${RESULTS_ID}`),
                icon: document.getElementById(ICON_ID)
            };
            const header = panel.querySelector('.ll-argos-panel-header');
            ensureControlIcon();
            enableDrag(wrapper, header);

            const rect = wrapper.getBoundingClientRect();
            state.panelPosition = { top: rect.top, left: rect.left };
        }
    }

    function setStatus(text, type = 'info') {
        if (!state.ui?.status) return;
        state.ui.status.textContent = text;
        state.ui.status.dataset.type = type;
    }

    function updateButtonState({ keepStatus = false } = {}) {
        if (!state.ui) {
            return;
        }
        const ready = Boolean(state.authToken && (state.assignment || state.assignmentId));
        const hasFiles = state.latestFiles.length > 0;

        if (state.ui.mainButton) {
            state.ui.mainButton.disabled = !ready || state.isFetching;
            if (state.isFetching) {
                state.ui.mainButton.textContent = '生成中...';
            } else if (ready) {
                state.ui.mainButton.textContent = '生成XLIFF';
            } else {
                state.ui.mainButton.textContent = '等待数据...';
            }
        }

        if (state.ui.combinedButton) {
            state.ui.combinedButton.disabled = !state.combinedFile || state.isFetching;
        }

        if (state.ui.zipButton) {
            state.ui.zipButton.disabled = !hasFiles || state.isFetching || state.zipInProgress;
            state.ui.zipButton.textContent = state.zipInProgress ? '压缩中...' : '下载ZIP';
        }

        if (!keepStatus) {
            if (state.isFetching) {
                setStatus('正在收集数据并生成 XLIFF…', 'progress');
            } else if (!ready) {
                if (!state.authToken) {
                    setStatus('等待捕获授权信息，请在页面内操作。', 'info');
                } else if (!state.assignment && state.assignmentId) {
                    setStatus('等待加载项目信息…', 'info');
                } else {
                    setStatus('等待页面加载数据…', 'info');
                }
            } else if (!hasFiles) {
                setStatus('准备就绪，点击生成 XLIFF。', 'info');
            } else {
                setStatus(`已生成 ${state.latestFiles.length} 个文档，可单独下载、合并导出或打包 ZIP。`, 'info');
            }
        }
    }

    async function handleGenerateClick(event) {
        event.preventDefault();
        if (state.isFetching) {
            return;
        }
        if (!state.authToken) {
            guessAssignmentIdFromUrl();
        }

        clearPreviousResults();
        state.isFetching = true;
        updateButtonState({ keepStatus: true });
        setStatus('正在收集数据并生成 XLIFF…', 'progress');

        try {
            await ensureAssignmentData();
            const segments = await collectSegments();
            if (!segments.length) {
                throw new Error('未获取到任何句段数据');
            }
            const { files, combinedFile } = prepareDocumentFiles(state.assignment, segments);
            if (!files.length) {
                throw new Error('未找到需要导出的文档');
            }
            state.latestFiles = files;
            state.combinedFile = combinedFile;
            renderFileList();
            const combinedMsg = combinedFile ? '已生成合并 XLIFF。' : '';
            setStatus(`生成完成：${files.length} 个文档，${segments.length} 条句段。${combinedMsg}`, 'success');
        } catch (error) {
            log('导出失败', error);
            clearPreviousResults();
            setStatus(`导出失败：${error.message || error}`, 'error');
        } finally {
            state.isFetching = false;
            updateButtonState({ keepStatus: true });
        }
    }

    function clearPreviousResults() {
        state.latestFiles = [];
        state.combinedFile = null;
        state.zipInProgress = false;
        state.segments.clear();
        state.pageSegments.clear();
        if (state.ui?.results) {
            state.ui.results.innerHTML = '';
            state.ui.results.style.display = 'none';
        }
    }

    async function ensureAssignmentData() {
        if (state.assignment) {
            return state.assignment;
        }
        if (!state.assignmentId) {
            guessAssignmentIdFromUrl();
        }
        if (!state.assignmentId) {
            throw new Error('缺少 assignmentId');
        }
        const data = await fetchJson(assignmentEndpoint(''));
        handleAssignmentData(data, state.assignmentId);
        return state.assignment;
    }

    async function ensurePages() {
        if (state.pageData?.pageStarts?.length) {
            return state.pageData.pageStarts;
        }
        const data = await fetchJson(assignmentEndpoint('/pages?max=100&minScore=0&maxScore=100'));
        handlePagesData(data);
        return state.pageData?.pageStarts ?? [];
    }

    async function collectSegments() {
        const pageStarts = await ensurePages();
        const positions = pageStarts
            .map(item => Number(item.assignmentPos))
            .filter(pos => Number.isFinite(pos));

        if (!positions.includes(1)) {
            positions.unshift(1);
        }
        positions.sort((a, b) => a - b);

        const missingPositions = positions.filter(pos => !state.pageSegments.has(pos));
        for (const pos of missingPositions) {
            const search = new URLSearchParams({
                max: '100',
                minScore: '0',
                maxScore: '100',
                assignmentPos: String(pos)
            });
            const data = await fetchJson(assignmentEndpoint(`/segments?${search.toString()}`));
            handleSegmentsData(data, pos);
        }

        if (state.assignment?.segmentCount && state.segments.size < state.assignment.segmentCount) {
            const fetchedPositions = new Set(state.pageSegments.keys());
            let nextPos = 1;
            const maxPos = state.assignment.segmentCount + 100;
            while (state.segments.size < state.assignment.segmentCount && nextPos <= maxPos) {
                if (!fetchedPositions.has(nextPos)) {
                    const search = new URLSearchParams({
                        max: '100',
                        minScore: '0',
                        maxScore: '100',
                        assignmentPos: String(nextPos)
                    });
                    const data = await fetchJson(assignmentEndpoint(`/segments?${search.toString()}`));
                    handleSegmentsData(data, nextPos);
                    fetchedPositions.add(nextPos);
                }
                nextPos += 100;
            }
        }

        return Array.from(state.segments.values());
    }

    function prepareDocumentFiles(assignment, segments) {
        if (!assignment || !Array.isArray(segments) || !segments.length) {
            return { files: [], combinedFile: null };
        }
        const docEntries = assignment?.bundle?.docEntries ?? assignment?.docEntries ?? [];
        const docMap = new Map(docEntries.map(doc => [doc.documentSig, doc]));
        const grouped = new Map();

        for (const segment of segments) {
            const docSig = segment.documentSig || 'default';
            if (!grouped.has(docSig)) {
                grouped.set(docSig, []);
            }
            grouped.get(docSig).push(segment);
        }

        const orderedSigs = [];
        for (const entry of docEntries) {
            if (grouped.has(entry.documentSig)) {
                orderedSigs.push(entry.documentSig);
            }
        }
        for (const sig of grouped.keys()) {
            if (!orderedSigs.includes(sig)) {
                orderedSigs.push(sig);
            }
        }

        const sourceLang = (assignment?.bundle?.sourceLang || assignment?.sourceLang || 'en-US').replace('_', '-');
        const targetLang = (assignment?.bundle?.targetLang || assignment?.targetLang || 'en-US').replace('_', '-');

        const files = [];
        const fileElements = [];
        for (const docSig of orderedSigs) {
            const docSegments = grouped.get(docSig) || [];
            if (!docSegments.length) {
                continue;
            }
            docSegments.sort((a, b) => {
                if (typeof a.sequence === 'number' && typeof b.sequence === 'number') {
                    return a.sequence - b.sequence;
                }
                const idA = Number(a.originalId);
                const idB = Number(b.originalId);
                if (!Number.isNaN(idA) && !Number.isNaN(idB)) {
                    return idA - idB;
                }
                return (a.segmentSig || '').localeCompare(b.segmentSig || '');
            });

            let docEntry = docMap.get(docSig);
            if (!docEntry && docEntries.length) {
                docEntry = docEntries.find(entry => docSig.includes(entry.documentSig));
            }
            if (!docEntry && docEntries[files.length]) {
                docEntry = docEntries[files.length];
            }
            const mappedName = state.docNames.get(docSig);
            const original = docEntry?.relativePath || mappedName || docSig;
            const readableName = buildDocumentReadableName(docEntry, docSig, files.length + 1, mappedName);
            const fileElement = buildXliffFileElement(docSegments, original, sourceLang, targetLang);
            fileElements.push(fileElement);
            const content = buildXliffDocument([fileElement]);
            const filename = buildDocumentFilename(original, targetLang);
            const size = new Blob([content]).size;

            files.push({
                docSig,
                readableName,
                filename,
                content,
                size,
                segmentCount: docSegments.length,
                order: files.length + 1
            });
        }

        const combinedFile = fileElements.length
            ? buildCombinedFile(fileElements, segments.length, targetLang)
            : null;

        return { files, combinedFile };
    }
    function buildDocumentXliff(segments, original, sourceLang, targetLang) {
        const fileElement = buildXliffFileElement(segments, original, sourceLang, targetLang);
        return buildXliffDocument([fileElement]);
    }

    function buildXliffFileElement(segments, original, sourceLang, targetLang) {
        const lines = [];
        lines.push(`<file original="${escapeXmlAttribute(original)}" source-language="${escapeXmlAttribute(sourceLang)}" target-language="${escapeXmlAttribute(targetLang)}" datatype="plaintext">`);
        lines.push('<body>');

        for (const segment of segments) {
            const tuId = segment.segmentSig || `${original}.${segment.sequence ?? ''}`;
            const resname = segment.originalId || String(segment.sequence ?? '');
            const sourceText = runsToText(segment.source?.content);
            const targetRecord = selectTarget(segment);
            const targetText = targetRecord ? runsToText(targetRecord.content) : '';
            const targetAttrs = [];

            if (targetRecord) {
                targetAttrs.push(`state="translated"`);
            }
            if (targetRecord?.locked) {
                targetAttrs.push('locked="true"');
            }

            lines.push(`<trans-unit id="${escapeXmlAttribute(tuId)}"${resname ? ` resname="${escapeXmlAttribute(resname)}"` : ''}>`);
            lines.push(`<source>${sourceText}</source>`);
            if (targetRecord) {
                lines.push(`<target${targetAttrs.length ? ' ' + targetAttrs.join(' ') : ''}>${targetText}</target>`);
            } else {
                lines.push('<target/>');
            }

            const noteParts = [];
            if (targetRecord?.matchType) noteParts.push(`matchType=${targetRecord.matchType}`);
            if (typeof targetRecord?.score === 'number') noteParts.push(`score=${targetRecord.score}`);
            if (targetRecord?.provider) noteParts.push(`provider=${targetRecord.provider}`);
            if (noteParts.length > 0) {
                lines.push(`<note>${escapeXmlText(noteParts.join(' | '))}</note>`);
            }

            lines.push('</trans-unit>');
        }

        lines.push('</body>');
        lines.push('</file>');
        return lines.join('\n');
    }

    function buildXliffDocument(fileElements) {
        const lines = [];
        lines.push('<?xml version="1.0" encoding="utf-8"?>');
        lines.push('<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">');
        for (const element of fileElements) {
            lines.push(element);
        }
        lines.push('</xliff>');
        return lines.join('\n');
    }

    function buildCombinedFile(fileElements, totalSegments, targetLang) {
        const content = buildXliffDocument(fileElements);
        const filename = buildCombinedFilename(targetLang);
        return {
            filename,
            content,
            size: new Blob([content]).size,
            segmentCount: totalSegments
        };
    }

    function buildDocumentReadableName(docEntry, docSig, fallbackIndex, mappedName) {
        const raw = docEntry?.relativePath || docEntry?.name || mappedName || docSig || '';
        if (!raw) {
            return `文档 ${fallbackIndex}`;
        }
        const decoded = safeDecodeURIComponent(String(raw));
        const normalized = decoded.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '').trim();
        if (normalized) {
            return normalized;
        }
        return `文档 ${fallbackIndex}`;
    }

    function buildDocumentFilename(original, targetLang) {
        const decoded = safeDecodeURIComponent(original || '');
        const normalized = decoded
            .replace(/\\/g, '/')
            .replace(/\/+/g, '/')
            .replace(/^\/+/, '');
        const baseSource = normalized || 'argos_document';
        const flattened = baseSource.replace(/\//g, '_');
        let base = sanitizeFilename(flattened);
        if (!base) base = 'argos_document';
        const langSuffix = targetLang ? `_${targetLang}` : '';
        return `${base}${langSuffix}.xliff`;
    }

    function safeDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }
    }

    function renderFileList() {
        if (!state.ui?.results) {
            return;
        }
        state.ui.results.innerHTML = '';
        if (!state.latestFiles.length) {
            state.ui.results.style.display = 'none';
            updateButtonState({ keepStatus: true });
            return;
        }
        state.ui.results.style.display = 'block';
        for (const file of state.latestFiles) {
            state.ui.results.appendChild(createFileRow(file));
        }
        state.ui.results.scrollTop = 0;
        updateButtonState({ keepStatus: true });
    }

    function createFileRow(file) {
        const row = document.createElement('div');
        row.className = 'll-argos-file';

        const name = document.createElement('div');
        name.className = 'll-argos-file-name';
        name.textContent = file.readableName || file.filename;
        row.appendChild(name);

        const filename = document.createElement('div');
        filename.className = 'll-argos-file-meta';
        filename.textContent = `导出文件：${file.filename}`;
        row.appendChild(filename);

        const footer = document.createElement('div');
        footer.className = 'll-argos-file-footer';

        const meta = document.createElement('div');
        meta.className = 'll-argos-file-meta';
        meta.textContent = `文档 ${file.order} · ${file.segmentCount} 段 · ${formatSize(file.size)}`;
        footer.appendChild(meta);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'll-argos-file-button';
        button.textContent = '下载';
        button.addEventListener('click', () => {
            downloadSingleFile(file);
        });
        footer.appendChild(button);

        row.appendChild(footer);
        return row;
    }

    function formatSize(bytes) {
        if (!Number.isFinite(bytes)) {
            return '';
        }
        if (bytes < 1024) {
            return `${bytes} B`;
        }
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / 1048576).toFixed(1)} MB`;
    }

    function downloadSingleFile(file) {
        if (!file) return;
        downloadTextFile(file.filename, file.content);
        setStatus(`已下载 ${file.filename}`, 'success');
    }

    function handleCombinedDownload(event) {
        event.preventDefault();
        if (!state.combinedFile) {
            setStatus('请先生成 XLIFF 后再下载合并文件。', 'error');
            return;
        }
        downloadTextFile(state.combinedFile.filename, state.combinedFile.content);
        setStatus(`已下载合并文件：${state.combinedFile.filename}`, 'success');
    }

    async function downloadZip() {
        if (!state.latestFiles.length) {
            return;
        }
        if (!PAGE_WINDOW.JSZip) {
            throw new Error('JSZip 未加载');
        }
        state.zipInProgress = true;
        updateButtonState({ keepStatus: true });
        setStatus('正在打包 ZIP…', 'progress');

        try {
            const zip = new PAGE_WINDOW.JSZip();
            const folder = zip.folder('xliff') || zip;
            for (const file of state.latestFiles) {
                folder.file(file.filename, file.content);
            }
            if (state.combinedFile) {
                zip.file(state.combinedFile.filename, state.combinedFile.content);
            }
            const blob = await zip.generateAsync({ type: 'blob' });
            const zipName = buildZipFilename();
            triggerDownloadBlob(zipName, blob);
            setStatus(`ZIP 下载完成：${zipName}`, 'success');
        } catch (error) {
            setStatus(`ZIP 生成失败：${error.message || error}`, 'error');
            throw error;
        } finally {
            state.zipInProgress = false;
            updateButtonState({ keepStatus: true });
        }
    }

    function getTargetLanguageTag() {
        const tag = state.assignment?.bundle?.targetLang || state.assignment?.targetLang || '';
        return tag ? tag.replace('_', '-') : '';
    }

    function getAssignmentBaseName() {
        const title = state.assignment?.title || state.assignment?.bundle?.title || state.assignmentId || 'argos_assignment';
        const sanitized = sanitizeFilename((title || '').trim());
        return sanitized || 'argos_assignment';
    }

    function buildCombinedFilename(targetLang) {
        const base = getAssignmentBaseName();
        return targetLang ? `${base}_${targetLang}_all.xliff` : `${base}_all.xliff`;
    }

    function buildZipFilename() {
        const base = getAssignmentBaseName();
        const targetLang = getTargetLanguageTag();
        const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
        return targetLang ? `${base}_${targetLang}_${timestamp}.zip` : `${base}_${timestamp}.zip`;
    }

    function handleZipClick(event) {
        event.preventDefault();
        downloadZip().catch(error => {
            log('ZIP 下载失败', error);
        });
    }

    function downloadTextFile(filename, content) {
        const blob = new Blob([content], { type: 'application/xml;charset=utf-8' });
        triggerDownloadBlob(filename, blob);
    }

    function triggerDownloadBlob(filename, blob) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }

    function assignmentEndpoint(path) {
        if (!state.assignmentId) {
            throw new Error('缺少 assignmentId');
        }
        return `${PAGE_WINDOW.location.origin}/dr/assignments/${state.assignmentId}${path}`;
    }

    async function fetchJson(url) {
        const headers = new Headers();
        headers.set('accept', 'application/json');
        if (state.authToken) {
            headers.set('authorization', state.authToken);
        }

        const response = await nativeFetch(url, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`请求失败: ${response.status}`);
        }

        return response.json();
    }

    function runsToText(content) {
        const runs = content?.runs;
        if (!Array.isArray(runs) || !runs.length) {
            return '';
        }
        return runs.map(run => {
            if (!run || typeof run !== 'object') return '';
            switch (run.kind) {
                case 'TextRun':
                    return escapeXmlText(run.text || '');
                case 'BreakRun':
                    return '\n';
                default:
                    if (typeof run.text === 'string') {
                        return escapeXmlText(run.text);
                    }
                    return '';
            }
        }).join('');
    }

    function selectTarget(segment) {
        if (!segment || !Array.isArray(segment.targets)) {
            return null;
        }
        const desiredTask = state.assignment?.taskType;
        if (desiredTask) {
            const match = segment.targets.find(t => t.taskType === desiredTask);
            if (match) return match;
        }
        const qaLastId = segment.qaInfo?.lastTargetId;
        if (qaLastId) {
            const match = segment.targets.find(t => t.id === qaLastId);
            if (match) return match;
        }
        const unlocked = segment.targets.find(t => !t.locked);
        if (unlocked) {
            return unlocked;
        }
        return segment.targets[segment.targets.length - 1] || null;
    }

    function escapeXmlText(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function escapeXmlAttribute(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function sanitizeFilename(name) {
        return (name || 'argos')
            .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_')
            .replace(/\s+/g, '_');
    }

    function ensureControlIcon() {
        let icon = document.getElementById(ICON_ID);
        if (!icon) {
            icon = document.createElement('div');
            icon.id = ICON_ID;
            icon.className = 'll-argos-icon ll-argos-icon-hidden';
            icon.textContent = 'ARG';
            icon.title = '显示 Argos 工具';
            icon.addEventListener('click', () => {
                restorePanel();
            });
            document.body.appendChild(icon);
        }
        state.ui = state.ui || {};
        state.ui.icon = icon;
        if (!state.isPanelMinimized) {
            icon.classList.add('ll-argos-icon-hidden');
        }
    }

    function minimizePanel() {
        if (!state.ui?.panel) return;
        state.isPanelMinimized = true;
        state.ui.panel.classList.add('ll-argos-panel-hidden');
        if (state.ui.icon) {
            const rect = state.ui.wrapper.getBoundingClientRect();
            state.panelPosition = { top: rect.top, left: rect.left };
            const iconTop = clamp(rect.top, 10, PAGE_WINDOW.innerHeight - 68);
            const iconLeft = clamp(rect.left, 10, PAGE_WINDOW.innerWidth - 68);
            state.ui.icon.style.top = `${iconTop}px`;
            state.ui.icon.style.left = `${iconLeft}px`;
            state.ui.icon.style.right = 'auto';
            state.ui.icon.style.bottom = 'auto';
            state.ui.icon.classList.remove('ll-argos-icon-hidden');
        }
    }

    function restorePanel() {
        if (!state.ui?.panel) return;
        state.isPanelMinimized = false;
        state.ui.panel.classList.remove('ll-argos-panel-hidden');
        if (state.ui.icon) {
            state.ui.icon.classList.add('ll-argos-icon-hidden');
        }
        if (state.panelPosition) {
            applyPanelPosition(state.panelPosition.top, state.panelPosition.left);
        }
    }

    function enableDrag(wrapper, handle) {
        if (!wrapper || !handle || handle.dataset.dragEnabled === 'true') {
            return;
        }
        handle.dataset.dragEnabled = 'true';
        handle.style.cursor = 'move';

        const startDrag = (event) => {
            if (event.type === 'mousedown' && event.button !== 0) return;
            if (event.target.closest('button') && event.target !== handle) return;
            state.dragging = true;

            const origin = getPoint(event);
            const rect = wrapper.getBoundingClientRect();
            wrapper.style.top = `${rect.top}px`;
            wrapper.style.left = `${rect.left}px`;
            wrapper.style.bottom = 'auto';
            wrapper.style.right = 'auto';

            state.panelPosition = { top: rect.top, left: rect.left };

            const moveHandler = (ev) => {
                if (!state.dragging) return;
                const point = getPoint(ev);
                const deltaX = point.x - origin.x;
                const deltaY = point.y - origin.y;
                const newLeft = clamp(rect.left + deltaX, 10 - wrapper.offsetWidth / 2, PAGE_WINDOW.innerWidth - wrapper.offsetWidth - 10);
                const newTop = clamp(rect.top + deltaY, 10, PAGE_WINDOW.innerHeight - wrapper.offsetHeight - 10);
                applyPanelPosition(newTop, newLeft);
                if (ev.cancelable) {
                    ev.preventDefault();
                }
            };

            const endHandler = () => {
                state.dragging = false;
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', endHandler);
                document.removeEventListener('touchmove', moveHandler);
                document.removeEventListener('touchend', endHandler);
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', endHandler);
            document.addEventListener('touchmove', moveHandler, { passive: false });
            document.addEventListener('touchend', endHandler);

            if (event.cancelable) {
                event.preventDefault();
            }
        };

        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });
    }

    function applyPanelPosition(top, left) {
        const panelHeight = state.ui?.panel?.offsetHeight || 220;
        const panelWidth = state.ui?.panel?.offsetWidth || 280;
        const clampedTop = clamp(top, 10, PAGE_WINDOW.innerHeight - panelHeight - 10);
        const clampedLeft = clamp(left, 10 - panelWidth / 2, PAGE_WINDOW.innerWidth - panelWidth - 10);
        if (state.ui?.wrapper) {
            state.ui.wrapper.style.top = `${clampedTop}px`;
            state.ui.wrapper.style.left = `${clampedLeft}px`;
            state.ui.wrapper.style.right = 'auto';
            state.ui.wrapper.style.bottom = 'auto';
        }
        state.panelPosition = { top: clampedTop, left: clampedLeft };
        if (state.ui?.icon && state.isPanelMinimized) {
            state.ui.icon.style.top = `${clampedTop}px`;
            state.ui.icon.style.left = `${clampedLeft}px`;
        }
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getPoint(event) {
        if (event.touches && event.touches.length > 0) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
        return { x: event.clientX, y: event.clientY };
    }

    checkForUpdates();
    setupFetchInterceptor();
    guessAssignmentIdFromUrl();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initUi();
            updateButtonState();
        }, { once: true });
    } else {
        initUi();
        updateButtonState();
    }
})();

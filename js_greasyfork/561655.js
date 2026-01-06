// ==UserScript==
// @name         Gilmore Ebook Page Collector v5
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Collect ebook pages with auto-scroll, deduplication, and high-res PDF/image export
// @match        https://evantage.gilmoreglobal.com/reader/books/*
// @match        https://jigsaw.gilmoreglobal.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @connect      jigsaw.gilmoreglobal.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561655/Gilmore%20Ebook%20Page%20Collector%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/561655/Gilmore%20Ebook%20Page%20Collector%20v5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== CONFIGURATION ==========
    const DEBUG = true;
    const SCRIPT_ID = Math.random().toString(36).substring(2, 8);
    const STORAGE_KEY = 'gilmore_collected_pages_v3';
    const LOG_STORAGE_KEY = 'gilmore_logs';
    const MAX_LOGS = 100;

    // ========== LOGGING ==========
    function addLog(type, message) {
        const entry = {
            time: new Date().toLocaleTimeString(),
            type,
            message: typeof message === 'string' ? message : JSON.stringify(message),
            scriptId: SCRIPT_ID
        };

        try {
            const existing = GM_getValue(LOG_STORAGE_KEY, '[]');
            const logs = JSON.parse(existing);
            logs.push(entry);
            if (logs.length > MAX_LOGS) logs.shift();
            GM_setValue(LOG_STORAGE_KEY, JSON.stringify(logs));
        } catch (e) {
            // Ignore logging errors
        }
    }

    const log = (...args) => {
        if (DEBUG) console.log(`%c[Collector-${SCRIPT_ID}]`, 'color: #4a90d9; font-weight: bold;', ...args);
        addLog('info', args.join(' '));
    };
    const logWarn = (...args) => {
        if (DEBUG) console.warn(`%c[Collector-${SCRIPT_ID}]`, 'color: #f0ad4e; font-weight: bold;', ...args);
        addLog('warn', args.join(' '));
    };
    const logError = (...args) => {
        console.error(`%c[Collector-${SCRIPT_ID}]`, 'color: #d9534f; font-weight: bold;', ...args);
        addLog('error', args.join(' '));
    };
    const logSuccess = (...args) => {
        if (DEBUG) console.log(`%c[Collector-${SCRIPT_ID}]`, 'color: #5cb85c; font-weight: bold;', ...args);
        addLog('success', args.join(' '));
    };

    log('🚀 Script starting...');
    log('Current URL:', window.location.href);

    // ========== CONTEXT DETECTION ==========
    const isMainPage = window.location.hostname === 'evantage.gilmoreglobal.com';
    const isContentPage = window.location.href.includes('/pages/') && window.location.href.includes('/content');
    const isImageHost = window.location.hostname === 'jigsaw.gilmoreglobal.com';

    log('Context:', { isMainPage, isContentPage, isImageHost });

    // ========== STORAGE FUNCTIONS ==========
    function getStoredPages() {
        try {
            const data = GM_getValue(STORAGE_KEY, '{}');
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
            logError('Storage read error:', e);
            return {};
        }
    }

    function savePages(pages) {
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify(pages));
        } catch (e) {
            logError('Storage save error:', e);
        }
    }

    function addPage(pageNum, imageUrl) {
        const pages = getStoredPages();
        const key = `page_${pageNum}`;

        // Always update - later loads are usually higher resolution
        const isNew = !pages[key];
        const isUpdate = pages[key] && pages[key].imageUrl !== imageUrl;

        if (isNew || isUpdate) {
            pages[key] = {
                pageNum: pageNum,
                imageUrl: imageUrl,
                timestamp: Date.now()
            };
            savePages(pages);
            if (isNew) {
                logSuccess(`✅ Stored page ${pageNum}`);
            } else {
                logSuccess(`🔄 Updated page ${pageNum} (higher res)`);
            }
            broadcastUpdate();
            return true;
        } else {
            log(`[SKIP] Page ${pageNum} same URL`);
            return false;
        }
    }

    function clearPages() {
        GM_setValue(STORAGE_KEY, '{}');
        GM_setValue(LOG_STORAGE_KEY, '[]');
        log('Cleared all pages and logs');
    }

    function broadcastUpdate() {
        GM_setValue('gilmore_update_trigger', Date.now());
    }

    // ========== PAGE NUMBER EXTRACTION ==========
    function extractPageNumber() {
        // Try to get from URL: /pages/864698277/content
        const urlMatch = window.location.href.match(/\/pages\/(\d+)\/content/);
        if (urlMatch) {
            return parseInt(urlMatch[1], 10);
        }
        return null;
    }

    // ========== URL CAPTURE LOGIC ==========
    let isCapturing = true;

    function checkAndCaptureUrl(url, source = 'unknown') {
        if (!url || !isCapturing) return;
        if (!url.includes('jigsaw.gilmoreglobal.com') || !url.includes('/images/')) return;

        const pageNum = extractPageNumber();
        if (!pageNum) {
            log('[SKIP] Could not determine page number');
            return;
        }

        const pattern = /jigsaw\.gilmoreglobal\.com\/books\/([^/]+)\/images\/([a-zA-Z0-9]+)/;
        const match = url.match(pattern);

        if (match) {
            log(`[CAPTURE] Page ${pageNum} from ${source}`);
            addPage(pageNum, url);
        }
    }

    // ========== INTERCEPTORS (only on jigsaw domain) ==========
    if (isImageHost) {
        log('Setting up interceptors...');

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0]?.url || args[0];
            if (typeof url === 'string') {
                checkAndCaptureUrl(url, 'fetch');
            }
            return originalFetch.apply(this, args);
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._capturedUrl = url;
            return originalXHROpen.apply(this, [method, url, ...rest]);
        };

        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...args) {
            const xhr = this;
            this.addEventListener('load', () => {
                if (xhr._capturedUrl) checkAndCaptureUrl(xhr._capturedUrl, 'xhr');
            });
            return originalXHRSend.apply(this, args);
        };

        log('✓ Interceptors installed');
    }

    // ========== IMAGE OBSERVER ==========
    function observeImages() {
        function scanImages() {
            document.querySelectorAll('img').forEach((img) => {
                if (img.src && !img._scanned && img.src.includes('jigsaw.gilmoreglobal.com')) {
                    img._scanned = true;
                    checkAndCaptureUrl(img.src, 'img');
                }
            });
        }

        scanImages();

        const observer = new MutationObserver(() => scanImages());
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        setInterval(scanImages, 3000);
        log('✓ Image observer started');
    }

    // ========== AUTO-SCROLL FUNCTIONALITY ==========
    let autoScrollActive = false;
    let autoScrollInterval = null;
    let autoScrollDelay = 1500;

    function startAutoScroll() {
        if (autoScrollActive) return;
        autoScrollActive = true;
        log('🚀 Auto-scroll started');
        GM_setValue('gilmore_autoscroll', true);
        broadcastUpdate();

        autoScrollInterval = setInterval(() => {
            goToNextPage();
        }, autoScrollDelay);
    }

    function stopAutoScroll() {
        autoScrollActive = false;
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        log('⏹️ Auto-scroll stopped');
        GM_setValue('gilmore_autoscroll', false);
        broadcastUpdate();
    }

    function goToNextPage() {
        // Use exact selectors from the Gilmore reader HTML
        const nextSelectors = [
            'button[aria-label="Next"]',
            'button[aria-label="next"]',
            '[aria-label="Next"]',
            '[aria-label="next"]'
        ];

        for (const selector of nextSelectors) {
            try {
                const btn = document.querySelector(selector);
                if (btn && !btn.disabled && btn.offsetParent !== null) {
                    btn.click();
                    log('→ Next page clicked');
                    return true;
                }
            } catch (e) {
                log('Next button error:', e.message);
            }
        }

        log('⚠️ Next button not found');
        return false;
    }

    function goToPrevPage() {
        // Use exact selectors from the Gilmore reader HTML
        const prevSelectors = [
            'button[aria-label="Previous"]',
            'button[aria-label="previous"]',
            '[aria-label="Previous"]',
            '[aria-label="previous"]'
        ];

        for (const selector of prevSelectors) {
            try {
                const btn = document.querySelector(selector);
                if (btn && !btn.disabled && btn.offsetParent !== null) {
                    btn.click();
                    log('← Prev page clicked');
                    return true;
                }
            } catch (e) {
                log('Prev button error:', e.message);
            }
        }

        log('⚠️ Prev button not found');
        return false;
    }

    // ========== PANEL UI (Main page only) ==========
    let panel = null;

    function createPanel() {
        if (!isMainPage) return;

        GM_addStyle(`
            #ebook-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 380px;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #4a90d9;
                border-radius: 12px;
                color: #fff;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                z-index: 2147483647;
                box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            #ebook-panel .header {
                background: linear-gradient(90deg, #4a90d9, #7b68ee);
                padding: 12px 15px;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                flex-shrink: 0;
            }
            #ebook-panel .content {
                padding: 12px;
                overflow-y: auto;
                flex: 1;
            }
            #ebook-panel .stats-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(74, 144, 217, 0.15);
                padding: 10px 12px;
                border-radius: 8px;
                margin-bottom: 10px;
            }
            #ebook-panel .stat-box { text-align: center; }
            #ebook-panel .stat-value { font-size: 22px; font-weight: bold; color: #4a90d9; }
            #ebook-panel .stat-label { font-size: 10px; color: #888; text-transform: uppercase; }
            #ebook-panel .btn {
                padding: 8px 14px;
                margin: 3px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                transition: all 0.2s;
                text-transform: uppercase;
            }
            #ebook-panel .btn-primary { background: linear-gradient(90deg, #4a90d9, #5a9de9); color: white; }
            #ebook-panel .btn-success { background: linear-gradient(90deg, #28a745, #34ce57); color: white; }
            #ebook-panel .btn-warning { background: linear-gradient(90deg, #ffc107, #ffcd39); color: #333; }
            #ebook-panel .btn-danger { background: linear-gradient(90deg, #dc3545, #e4606d); color: white; }
            #ebook-panel .btn-secondary { background: #444; color: white; }
            #ebook-panel .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
            #ebook-panel .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            #ebook-panel .btn-group { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin: 8px 0; }
            #ebook-panel .section { margin: 10px 0; }
            #ebook-panel .section-title { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 6px; }
            #ebook-panel .toggle-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 10px;
                background: rgba(0,0,0,0.2);
                border-radius: 6px;
                margin: 4px 0;
            }
            #ebook-panel .toggle-switch {
                width: 40px;
                height: 20px;
                background: #555;
                border-radius: 10px;
                position: relative;
                cursor: pointer;
                transition: background 0.3s;
            }
            #ebook-panel .toggle-switch.active { background: #4a90d9; }
            #ebook-panel .toggle-switch::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: left 0.3s;
            }
            #ebook-panel .toggle-switch.active::after { left: 22px; }
            #ebook-panel .speed-control {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                background: rgba(0,0,0,0.2);
                border-radius: 6px;
            }
            #ebook-panel .speed-control input { flex: 1; accent-color: #4a90d9; }
            #ebook-panel .speed-control span { min-width: 40px; text-align: right; font-size: 11px; color: #4a90d9; }
            #ebook-panel .page-list {
                max-height: 120px;
                overflow-y: auto;
                background: rgba(0,0,0,0.3);
                border-radius: 6px;
                font-size: 11px;
            }
            #ebook-panel .page-item {
                padding: 6px 10px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                display: flex;
                justify-content: space-between;
                gap: 8px;
            }
            #ebook-panel .page-item:hover { background: rgba(255,255,255,0.05); }
            #ebook-panel .page-num { color: #4a90d9; font-weight: 600; min-width: 80px; }
            #ebook-panel .page-url { color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; font-size: 9px; }
            #ebook-panel .log-panel {
                max-height: 150px;
                overflow-y: auto;
                background: #0a0a15;
                border-radius: 6px;
                font-family: 'Monaco', 'Consolas', monospace;
                font-size: 10px;
                padding: 8px;
            }
            #ebook-panel .log-entry { padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
            #ebook-panel .log-entry.info { color: #4a90d9; }
            #ebook-panel .log-entry.success { color: #5cb85c; }
            #ebook-panel .log-entry.warn { color: #f0ad4e; }
            #ebook-panel .log-entry.error { color: #d9534f; }
            #ebook-panel .log-time { color: #555; margin-right: 6px; }
            #ebook-panel .progress-bar {
                height: 20px;
                background: rgba(0,0,0,0.3);
                border-radius: 10px;
                overflow: hidden;
                margin: 8px 0;
            }
            #ebook-panel .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4a90d9, #7b68ee);
                transition: width 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
            }
            #ebook-panel .status-indicator {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 6px;
            }
            #ebook-panel .status-indicator.active { background: #28a745; animation: pulse 2s infinite; }
            #ebook-panel .status-indicator.paused { background: #ffc107; }
            #ebook-panel .status-indicator.scrolling { background: #17a2b8; animation: pulse 0.5s infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            #ebook-panel.minimized .content { display: none; }
            #ebook-panel .tab-bar {
                display: flex;
                background: rgba(0,0,0,0.2);
                border-radius: 6px;
                margin-bottom: 10px;
                overflow: hidden;
            }
            #ebook-panel .tab {
                flex: 1;
                padding: 8px;
                text-align: center;
                cursor: pointer;
                font-size: 11px;
                transition: background 0.2s;
            }
            #ebook-panel .tab.active { background: rgba(74, 144, 217, 0.3); }
            #ebook-panel .tab-content { display: none; }
            #ebook-panel .tab-content.active { display: block; }
        `);

        panel = document.createElement('div');
        panel.id = 'ebook-panel';
        panel.innerHTML = `
            <div class="header">
                <span>📚 Ebook Collector v3</span>
                <div style="display:flex;align-items:center;gap:8px;">
                    <span class="status-indicator active" id="status-dot"></span>
                    <span style="cursor:pointer;font-size:18px;" class="minimize-btn">−</span>
                </div>
            </div>
            <div class="content">
                <div class="stats-row">
                    <div class="stat-box">
                        <div class="stat-value" id="page-count">0</div>
                        <div class="stat-label">Pages</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value" id="current-page">-</div>
                        <div class="stat-label">Current</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-value" id="total-pages">-</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>

                <div class="tab-bar">
                    <div class="tab active" data-tab="controls">Controls</div>
                    <div class="tab" data-tab="pages">Pages</div>
                    <div class="tab" data-tab="logs">Logs</div>
                </div>

                <div class="tab-content active" id="tab-controls">
                    <div class="section">
                        <div class="section-title">Capture</div>
                        <div class="toggle-row">
                            <span>Auto-capture images</span>
                            <div class="toggle-switch active" id="capture-toggle"></div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Auto-Scroll</div>
                        <div class="btn-group">
                            <button class="btn btn-success" id="start-scroll-btn">▶ Start</button>
                            <button class="btn btn-danger" id="stop-scroll-btn" disabled>⏹ Stop</button>
                            <button class="btn btn-secondary" id="prev-btn">◀ Prev</button>
                            <button class="btn btn-secondary" id="next-btn">Next ▶</button>
                        </div>
                        <div class="speed-control">
                            <span style="color:#888;">Speed:</span>
                            <input type="range" id="speed-slider" min="500" max="5000" value="1500" step="100">
                            <span id="speed-value">1.5s</span>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Export</div>
                        <div class="btn-group">
                            <button class="btn btn-primary" id="download-pdf-btn">📄 PDF</button>
                            <button class="btn btn-primary" id="download-images-btn">🖼️ Images</button>
                            <button class="btn btn-warning" id="refresh-btn">🔄 Refresh</button>
                            <button class="btn btn-danger" id="clear-btn">🗑️ Clear</button>
                        </div>
                    </div>

                    <div class="progress-bar" style="display:none;" id="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width:0%">
                            <span id="progress-text"></span>
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="tab-pages">
                    <div class="page-list" id="page-list">
                        <div style="color:#666;text-align:center;padding:20px;">No pages captured yet</div>
                    </div>
                </div>

                <div class="tab-content" id="tab-logs">
                    <div class="log-panel" id="log-panel">
                        <div style="color:#666;">Logs will appear here...</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        log('✓ Panel created');

        // Tab switching
        panel.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
            });
        });

        // Event listeners
        panel.querySelector('#download-pdf-btn').addEventListener('click', downloadAsPDF);
        panel.querySelector('#download-images-btn').addEventListener('click', downloadAsImages);
        panel.querySelector('#clear-btn').addEventListener('click', () => {
            if (confirm('Clear all collected pages?')) {
                clearPages();
                updatePanel();
            }
        });
        panel.querySelector('#refresh-btn').addEventListener('click', updatePanel);

        panel.querySelector('#capture-toggle').addEventListener('click', function() {
            isCapturing = !isCapturing;
            this.classList.toggle('active', isCapturing);
            updateStatusIndicator();
        });

        panel.querySelector('#start-scroll-btn').addEventListener('click', () => {
            startAutoScroll();
            panel.querySelector('#start-scroll-btn').disabled = true;
            panel.querySelector('#stop-scroll-btn').disabled = false;
            updateStatusIndicator();
        });

        panel.querySelector('#stop-scroll-btn').addEventListener('click', () => {
            stopAutoScroll();
            panel.querySelector('#start-scroll-btn').disabled = false;
            panel.querySelector('#stop-scroll-btn').disabled = true;
            updateStatusIndicator();
        });

        panel.querySelector('#prev-btn').addEventListener('click', goToPrevPage);
        panel.querySelector('#next-btn').addEventListener('click', goToNextPage);

        panel.querySelector('#speed-slider').addEventListener('input', function() {
            autoScrollDelay = parseInt(this.value);
            panel.querySelector('#speed-value').textContent = (autoScrollDelay / 1000).toFixed(1) + 's';
            if (autoScrollActive) {
                stopAutoScroll();
                startAutoScroll();
            }
        });

        panel.querySelector('.minimize-btn').addEventListener('click', function() {
            panel.classList.toggle('minimized');
            this.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });

        makeDraggable(panel, panel.querySelector('.header'));

        // Listen for updates from other frames
        GM_addValueChangeListener('gilmore_update_trigger', (name, oldVal, newVal, remote) => {
            if (remote) updatePanel();
        });

        // Initial update and auto-refresh
        updatePanel();
        setInterval(updatePanel, 2000);
        setInterval(updateLogs, 1000);
    }

    function updateStatusIndicator() {
        const dot = document.getElementById('status-dot');
        if (!dot) return;

        dot.classList.remove('active', 'paused', 'scrolling');
        if (autoScrollActive) {
            dot.classList.add('scrolling');
        } else if (isCapturing) {
            dot.classList.add('active');
        } else {
            dot.classList.add('paused');
        }
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = function(e) {
            if (e.target.closest('.toggle-switch, .minimize-btn')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = function(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.right = 'auto';
            };
        };
    }

    function updatePanel() {
        if (!panel) return;

        const pages = getStoredPages();
        const pageArray = Object.values(pages).sort((a, b) => a.pageNum - b.pageNum);

        // Stats
        document.getElementById('page-count').textContent = pageArray.length;

        // Get current page from URL
        const pageMatch = window.location.href.match(/\/pageid\/(\d+)/);
        if (pageMatch) {
            document.getElementById('current-page').textContent = pageMatch[1];
        }

        // Get total pages - look for the page indicator pattern "X / Y"
        const allText = document.body.innerText;
        const pageIndicator = allText.match(/(\d+)\s*\/\s*(\d+)/);
        if (pageIndicator) {
            document.getElementById('current-page').textContent = pageIndicator[1];
            document.getElementById('total-pages').textContent = pageIndicator[2];
        }

        // Page list
        const listEl = document.getElementById('page-list');
        if (pageArray.length === 0) {
            listEl.innerHTML = '<div style="color:#666;text-align:center;padding:20px;">Navigate through the book to capture pages</div>';
        } else {
            listEl.innerHTML = pageArray.map(page => {
                const imageId = page.imageUrl.split('/images/')[1] || 'captured';
                return `
                    <div class="page-item" title="${page.imageUrl}">
                        <span class="page-num">Page ${page.pageNum}</span>
                        <span class="page-url">${imageId}</span>
                    </div>
                `;
            }).join('');
        }
    }

    function updateLogs() {
        if (!panel) return;
        const logPanel = document.getElementById('log-panel');
        if (!logPanel) return;

        try {
            const logs = JSON.parse(GM_getValue(LOG_STORAGE_KEY, '[]'));
            const recentLogs = logs.slice(-50);

            if (recentLogs.length === 0) {
                logPanel.innerHTML = '<div style="color:#666;">No logs yet</div>';
                return;
            }

            logPanel.innerHTML = recentLogs.map(entry => `
                <div class="log-entry ${entry.type}">
                    <span class="log-time">${entry.time}</span>
                    ${entry.message}
                </div>
            `).join('');

            logPanel.scrollTop = logPanel.scrollHeight;
        } catch (e) {}
    }

    function showProgress(current, total, text) {
        if (!panel) return;
        const bar = document.getElementById('progress-bar');
        const fill = document.getElementById('progress-fill');
        const textEl = document.getElementById('progress-text');
        bar.style.display = 'block';
        fill.style.width = `${(current / total) * 100}%`;
        textEl.textContent = text || `${current}/${total}`;
    }

    function hideProgress() {
        if (!panel) return;
        document.getElementById('progress-bar').style.display = 'none';
    }

    // ========== DOWNLOAD FUNCTIONS ==========
    function getHighResUrl(url) {
        // Convert /encrypted/800 to /encrypted/2000 for highest resolution
        return url.replace(/\/encrypted\/\d+$/, '/encrypted/2000');
    }

    function fetchImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: { 'Accept': 'image/*' },
                onload: (response) => response.status === 200 ? resolve(response.response) : reject(new Error(`HTTP ${response.status}`)),
                onerror: reject
            });
        });
    }

    async function downloadAsPDF() {
        const pages = getStoredPages();
        const pageArray = Object.values(pages).sort((a, b) => a.pageNum - b.pageNum);

        if (pageArray.length === 0) {
            alert('No pages collected yet.');
            return;
        }

        const btn = document.getElementById('download-pdf-btn');
        btn.disabled = true;
        btn.textContent = '⏳...';

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            let successCount = 0;
            for (let i = 0; i < pageArray.length; i++) {
                const page = pageArray[i];
                const highResUrl = getHighResUrl(page.imageUrl);
                showProgress(i + 1, pageArray.length, `Fetching page ${page.pageNum}`);
                log(`[PDF] Fetching page ${page.pageNum} @ 2000px`);

                try {
                    const blob = await fetchImage(highResUrl);
                    const dataUrl = await blobToDataUrl(blob);

                    if (successCount > 0) pdf.addPage();

                    const img = await loadImage(dataUrl);
                    const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
                    const imgWidth = img.width * ratio;
                    const imgHeight = img.height * ratio;
                    const x = (pageWidth - imgWidth) / 2;
                    const y = (pageHeight - imgHeight) / 2;

                    pdf.addImage(dataUrl, 'JPEG', x, y, imgWidth, imgHeight);
                    successCount++;
                    logSuccess(`[PDF] Added page ${page.pageNum}`);
                } catch (err) {
                    logError(`[PDF] Failed page ${page.pageNum}: ${err.message}`);
                }

                await sleep(150);
            }

            if (successCount === 0) {
                alert('Failed to fetch any pages.');
                return;
            }

            showProgress(pageArray.length, pageArray.length, 'Generating PDF...');
            pdf.save(`ebook_${new Date().toISOString().slice(0,10)}_${successCount}pages.pdf`);
            logSuccess(`[PDF] Saved ${successCount} pages`);

        } catch (err) {
            logError('[PDF] Generation failed:', err.message);
            alert('PDF generation failed: ' + err.message);
        } finally {
            btn.disabled = false;
            btn.textContent = '📄 PDF';
            hideProgress();
        }
    }

    async function downloadAsImages() {
        const pages = getStoredPages();
        const pageArray = Object.values(pages).sort((a, b) => a.pageNum - b.pageNum);

        if (pageArray.length === 0) {
            alert('No pages collected yet.');
            return;
        }

        const btn = document.getElementById('download-images-btn');
        btn.disabled = true;
        btn.textContent = '⏳...';

        try {
            for (let i = 0; i < pageArray.length; i++) {
                const page = pageArray[i];
                const highResUrl = getHighResUrl(page.imageUrl);
                showProgress(i + 1, pageArray.length, `Downloading ${page.pageNum}`);

                try {
                    const blob = await fetchImage(highResUrl);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `page_${String(page.pageNum).padStart(4, '0')}.jpg`;
                    a.click();
                    URL.revokeObjectURL(url);
                    logSuccess(`[DL] Page ${page.pageNum}`);
                } catch (err) {
                    logError(`[DL] Failed ${page.pageNum}: ${err.message}`);
                }

                await sleep(400);
            }
        } finally {
            btn.disabled = false;
            btn.textContent = '🖼️ Images';
            hideProgress();
        }
    }

    function blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ========== INITIALIZATION ==========
    function init() {
        log('========================================');
        log('INITIALIZING EBOOK COLLECTOR v3.3');
        log('========================================');

        if (isMainPage) {
            createPanel();
        }

        if (isImageHost) {
            observeImages();
        }

        // Console helpers
        window.ebookCollector = {
            status: () => ({ capturing: isCapturing, scrolling: autoScrollActive, pages: Object.keys(getStoredPages()).length }),
            listPages: () => { console.table(Object.values(getStoredPages()).sort((a,b) => a.pageNum - b.pageNum)); },
            getUrls: () => Object.values(getStoredPages()).map(p => p.imageUrl),
            clear: () => { clearPages(); return 'Cleared'; },
            startScroll: () => { startAutoScroll(); return 'Started'; },
            stopScroll: () => { stopAutoScroll(); return 'Stopped'; }
        };

        log('✓ Ready');
        log('========================================');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
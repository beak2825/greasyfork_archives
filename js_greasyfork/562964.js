// ==UserScript==
// @name         FetLife Video Length Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Filter and hide FetLife videos by duration/length
// @author       YourName
// @match        https://fetlife.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562964/FetLife%20Video%20Length%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/562964/FetLife%20Video%20Length%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        minLength: 0,        // Minimum duration in seconds (0 = no minimum)
        maxLength: 0,        // Maximum duration in seconds (0 = no maximum)
        hideMode: 'blur',    // 'hide', 'blur', 'dim'
        showControls: true,
        autoApply: true,
        persistSettings: true
    };

    // State
    let filteredVideos = new Set();
    let controlPanel = null;

    /**
     * Parse duration string to seconds
     * Examples: "0:31" → 31, "1:45" → 105, "2:30:15" → 9015
     */
    function parseDuration(durationText) {
        if (!durationText) return 0;

        // Remove any non-digit/colon characters
        const cleanText = durationText.replace(/[^\d:]/g, '');

        if (!cleanText) return 0;

        const parts = cleanText.split(':').map(Number);

        if (parts.length === 1) {
            // Just seconds (e.g., "31")
            return parts[0];
        } else if (parts.length === 2) {
            // Minutes:Seconds (e.g., "1:45")
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            // Hours:Minutes:Seconds (e.g., "2:30:15")
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }

        return 0;
    }

    /**
     * Format seconds to human-readable duration
     */
    function formatDuration(seconds) {
        if (seconds === 0) return 'No limit';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes} minutes`;
        }
        return `${seconds} seconds`;
    }

    /**
     * Find video duration element
     */
    function findVideoDuration(videoElement) {
        // Look for duration display in various locations
        const selectors = [
            '.ipp',                          // The class you provided
            '[class*="duration"]',
            '[class*="time"]',
            '[aria-label*="duration"]',
            '[aria-label*="time"]',
            '.video-duration',
            '.duration-display',
            'time'
        ];

        for (const selector of selectors) {
            const element = videoElement.querySelector(selector);
            if (element) {
                const text = element.textContent.trim();
                if (text && text.includes(':')) {
                    return { element, text };
                }
            }
        }

        // Check siblings and parents
        const siblings = videoElement.querySelectorAll('*');
        for (const sibling of siblings) {
            const text = sibling.textContent.trim();
            if (text && /^[\d:]+$/.test(text)) {
                return { element: sibling, text };
            }
        }

        return null;
    }

    /**
     * Get all video elements on page
     */
    function getAllVideoElements() {
        // Try multiple selectors for video containers
        const videoSelectors = [
            'video',
            '[class*="video"]',
            '[class*="Video"]',
            '[data-video]',
            'a[href*="/videos/"]',
            '.gallery-item'
        ];

        const videoElements = new Set();

        for (const selector of videoSelectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => videoElements.add(el));
        }

        return Array.from(videoElements);
    }

    /**
     * Check if video matches filter criteria
     */
    function shouldFilterVideo(videoElement) {
        const durationInfo = findVideoDuration(videoElement);

        if (!durationInfo) {
            return false; // Can't determine duration, don't filter
        }

        const duration = parseDuration(durationInfo.text);

        // Check minimum
        if (CONFIG.minLength > 0 && duration < CONFIG.minLength) {
            return true;
        }

        // Check maximum
        if (CONFIG.maxLength > 0 && duration > CONFIG.maxLength) {
            return true;
        }

        return false;
    }

    /**
     * Apply filter to a single video
     */
    function applyFilterToVideo(videoElement) {
        if (!videoElement) return;

        if (shouldFilterVideo(videoElement)) {
            filteredVideos.add(videoElement);

            switch (CONFIG.hideMode) {
                case 'hide':
                    videoElement.style.display = 'none';
                    break;
                case 'blur':
                    videoElement.style.filter = 'blur(20px)';
                    videoElement.style.transition = 'filter 0.3s';
                    videoElement.setAttribute('data-blurred', 'true');
                    break;
                case 'dim':
                    videoElement.style.opacity = '0.2';
                    videoElement.style.transition = 'opacity 0.3s';
                    videoElement.setAttribute('data-dimmed', 'true');
                    break;
            }
        } else {
            // Remove any applied filters
            videoElement.style.display = '';
            videoElement.style.filter = '';
            videoElement.style.opacity = '';
            videoElement.removeAttribute('data-blurred');
            videoElement.removeAttribute('data-dimmed');
            filteredVideos.delete(videoElement);
        }
    }

    /**
     * Apply filter to all videos
     */
    function applyFilter() {
        const videos = getAllVideoElements();

        videos.forEach(video => {
            applyFilterToVideo(video);
        });

        console.log(`[FetLife Video Filter] Filtered ${filteredVideos.size} of ${videos.length} videos`);
    }

    /**
     * Create control panel
     */
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'fetlife-video-filter-panel';
        panel.innerHTML = `
            <div class="fvf-panel-header">
                <span class="fvf-title">🎬 Video Length Filter</span>
                <button class="fvf-close" onclick="document.getElementById('fetlife-video-filter-panel').style.display='none'">×</button>
            </div>
            <div class="fvf-content">
                <div class="fvf-section">
                    <label class="fvf-label">
                        Minimum Duration:
                        <input type="number" id="fvf-min-duration" min="0" value="${CONFIG.minLength}" class="fvf-input">
                        <span class="fvf-unit">seconds</span>
                    </label>
                    <div class="fvf-preset">
                        <button class="fvf-preset-btn" data-value="0">Any</button>
                        <button class="fvf-preset-btn" data-value="60">1m+</button>
                        <button class="fvf-preset-btn" data-value="300">5m+</button>
                        <button class="fvf-preset-btn" data-value="600">10m+</button>
                    </div>
                </div>

                <div class="fvf-section">
                    <label class="fvf-label">
                        Maximum Duration:
                        <input type="number" id="fvf-max-duration" min="0" value="${CONFIG.maxLength}" class="fvf-input">
                        <span class="fvf-unit">seconds</span>
                    </label>
                    <div class="fvf-preset">
                        <button class="fvf-preset-btn" data-max="true" data-value="0">Any</button>
                        <button class="fvf-preset-btn" data-max="true" data-value="60">≤1m</button>
                        <button class="fvf-preset-btn" data-max="true" data-value="300">≤5m</button>
                        <button class="fvf-preset-btn" data-max="true" data-value="600">≤10m</button>
                    </div>
                </div>

                <div class="fvf-section">
                    <label class="fvf-label">Filter Mode:</label>
                    <div class="fvf-mode-buttons">
                        <button class="fvf-mode-btn" data-mode="hide">Hide</button>
                        <button class="fvf-mode-btn" data-mode="blur">Blur</button>
                        <button class="fvf-mode-btn" data-mode="dim">Dim</button>
                    </div>
                </div>

                <div class="fvf-section">
                    <label class="fvf-checkbox">
                        <input type="checkbox" id="fvf-auto-apply" ${CONFIG.autoApply ? 'checked' : ''}>
                        Auto-apply filter
                    </label>
                    <label class="fvf-checkbox">
                        <input type="checkbox" id="fvf-persist" ${CONFIG.persistSettings ? 'checked' : ''}>
                        Remember settings
                    </label>
                </div>

                <div class="fvf-actions">
                    <button id="fvf-apply" class="fvf-btn fvf-apply">Apply Filter</button>
                    <button id="fvf-reset" class="fvf-btn fvf-reset">Reset</button>
                </div>

                <div class="fvf-stats">
                    Filtered: <span id="fvf-count">0</span> videos
                </div>
            </div>
        `;

        // Add styles
        const styles = `
            #fetlife-video-filter-panel {
                position: fixed;
                top: 80px;
                right: 20px;
                width: 320px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .fvf-panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .fvf-title {
                font-weight: bold;
                font-size: 16px;
            }

            .fvf-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                line-height: 1;
            }

            .fvf-content {
                padding: 16px;
            }

            .fvf-section {
                margin-bottom: 16px;
            }

            .fvf-label {
                display: block;
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 14px;
                color: #333;
            }

            .fvf-input {
                width: 80px;
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .fvf-unit {
                margin-left: 8px;
                color: #666;
                font-size: 13px;
            }

            .fvf-preset {
                display: flex;
                gap: 6px;
                margin-top: 8px;
                flex-wrap: wrap;
            }

            .fvf-preset-btn {
                padding: 6px 12px;
                background: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }

            .fvf-preset-btn:hover {
                background: #e0e0e0;
            }

            .fvf-preset-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .fvf-mode-buttons {
                display: flex;
                gap: 8px;
            }

            .fvf-mode-btn {
                flex: 1;
                padding: 8px;
                background: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }

            .fvf-mode-btn.active {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .fvf-checkbox {
                display: block;
                margin-bottom: 8px;
                font-size: 13px;
                color: #555;
                cursor: pointer;
            }

            .fvf-checkbox input {
                margin-right: 8px;
            }

            .fvf-actions {
                display: flex;
                gap: 8px;
                margin-top: 20px;
            }

            .fvf-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .fvf-btn:hover {
                transform: translateY(-2px);
            }

            .fvf-apply {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .fvf-reset {
                background: #f0f0f0;
                color: #333;
            }

            .fvf-stats {
                margin-top: 16px;
                padding-top: 12px;
                border-top: 1px solid #eee;
                font-size: 13px;
                color: #666;
                text-align: center;
            }

            #fvf-count {
                font-weight: bold;
                color: #667eea;
            }
        `;

        // Add styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        return panel;
    }

    /**
     * Setup control panel event listeners
     */
    function setupControlPanel() {
        const minInput = document.getElementById('fvf-min-duration');
        const maxInput = document.getElementById('fvf-max-duration');
        const autoApply = document.getElementById('fvf-auto-apply');
        const persist = document.getElementById('fvf-persist');
        const applyBtn = document.getElementById('fvf-apply');
        const resetBtn = document.getElementById('fvf-reset');

        // Preset buttons
        document.querySelectorAll('.fvf-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = parseInt(btn.dataset.value);
                const isMax = btn.dataset.max === 'true';

                if (isMax) {
                    maxInput.value = value;
                    updateActivePreset(btn, '.fvf-preset-btn[data-max="true"]');
                } else {
                    minInput.value = value;
                    updateActivePreset(btn, '.fvf-preset-btn:not([data-max="true"])');
                }

                if (autoApply.checked) {
                    applyFilter();
                }
            });
        });

        // Mode buttons
        document.querySelectorAll('.fvf-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                CONFIG.hideMode = btn.dataset.mode;
                updateActiveMode(btn);

                if (autoApply.checked) {
                    applyFilter();
                }
            });
        });

        // Apply button
        applyBtn.addEventListener('click', () => {
            CONFIG.minLength = parseInt(minInput.value) || 0;
            CONFIG.maxLength = parseInt(maxInput.value) || 0;
            CONFIG.autoApply = autoApply.checked;
            CONFIG.persistSettings = persist.checked;

            applyFilter();
            saveSettings();
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            minInput.value = 0;
            maxInput.value = 0;
            CONFIG.minLength = 0;
            CONFIG.maxLength = 0;
            CONFIG.hideMode = 'blur';

            applyFilter();
            loadSettings();
        });

        // Set initial active states
        updateActiveMode(document.querySelector(`.fvf-mode-btn[data-mode="${CONFIG.hideMode}"]`));
    }

    /**
     * Update active preset button
     */
    function updateActivePreset(activeBtn, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    /**
     * Update active mode button
     */
    function updateActiveMode(activeBtn) {
        document.querySelectorAll('.fvf-mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * Save settings to localStorage
     */
    function saveSettings() {
        if (!CONFIG.persistSettings) return;

        const settings = {
            minLength: CONFIG.minLength,
            maxLength: CONFIG.maxLength,
            hideMode: CONFIG.hideMode,
            autoApply: CONFIG.autoApply
        };

        localStorage.setItem('fetlifeVideoFilterSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    function loadSettings() {
        const saved = localStorage.getItem('fetlifeVideoFilterSettings');
        if (!saved) return;

        try {
            const settings = JSON.parse(saved);
            CONFIG.minLength = settings.minLength || 0;
            CONFIG.maxLength = settings.maxLength || 0;
            CONFIG.hideMode = settings.hideMode || 'blur';
            CONFIG.autoApply = settings.autoApply !== false;

            // Update UI
            const minInput = document.getElementById('fvf-min-duration');
            const maxInput = document.getElementById('fvf-max-duration');
            const autoApply = document.getElementById('fvf-auto-apply');

            if (minInput) minInput.value = CONFIG.minLength;
            if (maxInput) maxInput.value = CONFIG.maxLength;
            if (autoApply) autoApply.checked = CONFIG.autoApply;

            updateActiveMode(document.querySelector(`.fvf-mode-btn[data-mode="${CONFIG.hideMode}"]`));
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
    }

    /**
     * Create toggle button
     */
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'fetlife-filter-toggle';
        button.innerHTML = '🎬';
        button.title = 'Toggle Video Filter';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 80px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 999998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        `;

        button.addEventListener('click', () => {
            const panel = document.getElementById('fetlife-video-filter-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        return button;
    }

    /**
     * Initialize the script
     */
    function init() {
        console.log('[FetLife Video Filter] Initializing...');

        // Create control panel
        controlPanel = createControlPanel();
        document.body.appendChild(controlPanel);

        // Create toggle button
        const toggleButton = createToggleButton();
        document.body.appendChild(toggleButton);

        // Setup event listeners
        setupControlPanel();

        // Load saved settings
        loadSettings();

        // Apply filter if auto-apply is enabled
        if (CONFIG.autoApply) {
            setTimeout(applyFilter, 1000);
        }

        // Monitor for new videos
        const observer = new MutationObserver(() => {
            if (CONFIG.autoApply) {
                applyFilter();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[FetLife Video Filter] Initialized');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
// ==UserScript==
// @name Performance Booster Pro
// @namespace http://tampermonkey.net/
// @version 2.0
// @description Advanced client-side performance optimization with modern UI, real-time monitoring, and intelligent optimizations
// @author Gugu8
// @match *://*/*
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_notification
// @run-at document-start
// @sandbox raw
// @downloadURL https://update.greasyfork.org/scripts/549600/Performance%20Booster%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/549600/Performance%20Booster%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enhanced CSS with modern design and animations
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        #performance-booster {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            color: #ffffff;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(148, 163, 184, 0.1);
            border-radius: 16px;
            box-shadow:
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
            padding: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            width: 320px;
            max-height: 600px;
            overflow: hidden;
            user-select: none;
        }

        #performance-booster.dragging {
            transform: scale(1.05);
            box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.4);
        }

        .booster-header {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            border-radius: 16px 16px 0 0;
            position: relative;
            overflow: hidden;
        }

        .booster-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
            transform: translateX(-100%);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .booster-header.grabbing {
            cursor: grabbing;
        }

        .header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 16px;
            position: relative;
            z-index: 1;
        }

        .header-title .icon {
            font-size: 20px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        .header-controls {
            display: flex;
            gap: 8px;
            position: relative;
            z-index: 1;
        }

        .header-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-size: 14px;
            backdrop-filter: blur(10px);
        }

        .header-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
        }

        .header-btn:active {
            transform: translateY(0);
        }

        .booster-content {
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }

        .booster-content::-webkit-scrollbar {
            width: 6px;
        }

        .booster-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .booster-content::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.3);
            border-radius: 3px;
        }

        .performance-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(148, 163, 184, 0.1);
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .stat-card:hover::before {
            transform: scaleX(1);
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 4px;
            display: block;
        }

        .stat-label {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }

        .real-time-metrics {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
            border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .metrics-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #e2e8f0;
        }

        .metric-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .metric-row:last-child {
            margin-bottom: 0;
        }

        .metric-name {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
        }

        .metric-value {
            font-size: 12px;
            font-weight: 600;
            color: #10b981;
        }

        .settings-section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #e2e8f0;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .setting-item:last-child {
            border-bottom: none;
        }

        .setting-info {
            flex: 1;
        }

        .setting-name {
            font-size: 13px;
            color: #e2e8f0;
            margin-bottom: 2px;
        }

        .setting-desc {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
        }

        .toggle-switch {
            width: 44px;
            height: 24px;
            background: rgba(71, 85, 105, 0.8);
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .toggle-switch.active {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .toggle-handle {
            width: 18px;
            height: 18px;
            background: #ffffff;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 3px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-handle {
            left: 21px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .boost-button {
            width: 100%;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            border: none;
            color: #ffffff;
            padding: 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 20px;
        }

        .boost-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .boost-button:hover::before {
            left: 100%;
        }

        .boost-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .boost-button:active {
            transform: translateY(0);
        }

        .boost-button.boosting {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            cursor: not-allowed;
        }

        .boost-progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            transition: width 0.3s ease;
            border-radius: 12px;
        }

        .boost-content {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            z-index: 2147483647;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }

        .notification.error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        }

        .minimized-content {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            font-size: 24px;
            cursor: pointer;
        }

        .tab-navigation {
            display: flex;
            background: rgba(15, 23, 42, 0.5);
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 16px;
        }

        .tab-btn {
            flex: 1;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 12px;
            font-weight: 500;
        }

        .tab-btn.active {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: #ffffff;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .progress-ring {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: conic-gradient(from 0deg, #3b82f6 0deg, #e5e7eb 0deg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: #3b82f6;
        }

        .performance-chart {
            height: 60px;
            background: rgba(15, 23, 42, 0.3);
            border-radius: 8px;
            margin-top: 8px;
            position: relative;
            overflow: hidden;
        }

        .chart-line {
            position: absolute;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to top, #3b82f6, #8b5cf6);
            transition: height 0.3s ease;
        }

        @media (max-width: 768px) {
            #performance-booster {
                width: 280px;
                bottom: 10px;
                right: 10px;
            }
        }
    `);

    // --- Main script logic wrapped in DOMContentLoaded listener ---
    document.addEventListener('DOMContentLoaded', () => {
        class PerformanceBoosterPro {
            constructor() {
                this.config = this.loadConfig();
                this.metrics = {
                    imagesOptimized: 0,
                    linksPrefetched: 0,
                    adsBlocked: 0,
                    scriptsOptimized: 0,
                    cssOptimized: 0,
                    domCleaned: 0
                };
                this.realTimeMetrics = {
                    fps: 0,
                    memory: 0,
                    loadTime: 0,
                    domNodes: 0
                };
                this.isVisible = GM_getValue('isVisible', true);
                this.activeTab = 'overview';
                this.performanceHistory = [];
                this.isInitialized = false;
                this.isDragging = false;
                this.dragOffset = { x: 0, y: 0 };
                this.lastFrameTime = performance.now();
                this.rafId = null;

                this.init();
            }

            async init() {
                this.setupUI();
                this.setupEventListeners();
                this.setupOptimizations();
                this.setupMutationObserver();
                this.setupPerformanceMonitoring();
                this.startRealTimeUpdates();
                this.log('Performance Booster Pro initialized', 'info');
                this.isInitialized = true;
            }

            waitForDOM() {
                return Promise.resolve();
            }

            loadConfig() {
                // Modified default settings
                const defaultConfig = {
                    lazyLoadEnabled: true,
                    imageOptimization: true,
                    adBlocking: false, // Changed to false
                    prefetchLinks: true,
                    cssOptimization: true,
                    scriptOptimization: true,
                    domCleaning: true,
                    realTimeMonitoring: true,
                    maxPrefetchLinks: 10,
                    aggressiveMode: false // Changed to false
                };

                try {
                    const stored = GM_getValue('performanceBoosterConfig');
                    return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
                } catch (e) {
                    this.log('Failed to load config, using defaults', 'warn');
                    return defaultConfig;
                }
            }

            saveConfig() {
                try {
                    GM_setValue('performanceBoosterConfig', JSON.stringify(this.config));
                } catch (e) {
                    this.log('Failed to save config', 'error');
                }
            }

            log(message, level = 'info') {
                const timestamp = new Date().toLocaleTimeString();
                const styles = {
                    info: 'color: #3b82f6',
                    warn: 'color: #f59e0b',
                    error: 'color: #ef4444',
                    success: 'color: #10b981'
                };
                console[level](`%c[PerformanceBooster Pro] [${timestamp}] ${message}`, styles[level] || styles.info);
            }

            setupUI() {
                if (this.container) return;

                this.container = document.createElement('div');
                this.container.id = 'performance-booster';

                // Set initial display based on GM_getValue
                this.container.style.display = this.isVisible ? 'block' : 'none';

                this.container.innerHTML = this.getFullHTML();

                document.body.appendChild(this.container);
                this.updateUI();
            }

            getFullHTML() {
                return `
                    <div class="booster-header">
                        <div class="header-title">
                            <span class="icon">🚀</span>
                            <span>Booster Pro</span>
                        </div>
                        <div class="header-controls">
                            <button class="header-btn" id="close-btn" title="Close">×</button>
                        </div>
                    </div>
                    <div class="booster-content">
                        <div class="tab-navigation">
                            <button class="tab-btn active" data-tab="overview">Overview</button>
                            <button class="tab-btn" data-tab="settings">Settings</button>
                            <button class="tab-btn" data-tab="monitor">Monitor</button>
                        </div>

                        <div class="tab-content active" id="overview-tab">
                            <div class="performance-stats">
                                <div class="stat-card">
                                    <span class="stat-value" id="images-count">0</span>
                                    <span class="stat-label">Images</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="ads-count">0</span>
                                    <span class="stat-label">Ads Blocked</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="links-count">0</span>
                                    <span class="stat-label">Links</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value" id="scripts-count">0</span>
                                    <span class="stat-label">Scripts</span>
                                </div>
                            </div>

                            <button class="boost-button" id="boost-btn">
                                <div class="boost-progress" id="boost-progress"></div>
                                <div class="boost-content">
                                    <span>🚀</span>
                                    <span id="boost-text">Boost Performance</span>
                                </div>
                            </button>
                        </div>

                        <div class="tab-content" id="settings-tab">
                            <div class="settings-section">
                                <div class="section-title">
                                    <span>⚙️</span>
                                    <span>Optimization Settings</span>
                                </div>
                                ${this.generateSettingsHTML()}
                            </div>
                        </div>

                        <div class="tab-content" id="monitor-tab">
                            <div class="real-time-metrics">
                                <div class="metrics-title">Real-time Performance</div>
                                <div class="metric-row">
                                    <span class="metric-name">FPS</span>
                                    <span class="metric-value" id="fps-value">0</span>
                                </div>
                                <div class="metric-row">
                                    <span class="metric-name">Memory Usage</span>
                                    <span class="metric-value" id="memory-value">0 MB</span>
                                </div>
                                <div class="metric-row">
                                    <span class="metric-name">DOM Nodes</span>
                                    <span class="metric-value" id="dom-nodes">0</span>
                                </div>
                                <div class="metric-row">
                                    <span class="metric-name">Load Time</span>
                                    <span class="metric-value" id="load-time">0ms</span>
                                </div>
                                <div class="performance-chart" id="performance-chart"></div>
                            </div>
                        </div>
                    </div>
                `;
            }

            generateSettingsHTML() {
                const settings = [
                    { key: 'lazyLoadEnabled', name: 'Lazy Loading', desc: 'Load images when they come into view' },
                    { key: 'imageOptimization', name: 'Image Optimization', desc: 'Optimize image loading and compression' },
                    { key: 'adBlocking', name: 'Ad Blocking', desc: 'Block advertisements and trackers' },
                    { key: 'prefetchLinks', name: 'Link Prefetching', desc: 'Preload links for faster navigation' },
                    { key: 'cssOptimization', name: 'CSS Optimization', desc: 'Optimize and compress CSS' },
                    { key: 'scriptOptimization', name: 'Script Optimization', desc: 'Optimize JavaScript execution' },
                    { key: 'domCleaning', name: 'DOM Cleaning', desc: 'Remove unnecessary DOM elements' },
                    { key: 'realTimeMonitoring', name: 'Real-time Monitoring', desc: 'Monitor performance metrics' },
                    { key: 'aggressiveMode', name: 'Aggressive Mode', desc: 'More aggressive optimizations' }
                ];

                return settings.map(setting => `
                    <div class="setting-item">
                        <div class="setting-info">
                            <div class="setting-name">${setting.name}</div>
                            <div class="setting-desc">${setting.desc}</div>
                        </div>
                        <div class="toggle-switch ${this.config[setting.key] ? 'active' : ''}" data-setting="${setting.key}">
                            <div class="toggle-handle"></div>
                        </div>
                    </div>
                `).join('');
            }

            setupEventListeners() {
                // Tab navigation
                this.container.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const tab = e.target.dataset.tab;
                        this.switchTab(tab);
                    });
                });

                // Settings toggles
                this.container.querySelectorAll('.toggle-switch').forEach(toggle => {
                    toggle.addEventListener('click', () => {
                        const setting = toggle.dataset.setting;
                        this.toggleSetting(setting);
                    });
                });

                // Header buttons
                const closeBtn = this.container.querySelector('#close-btn');
                const boostBtn = this.container.querySelector('#boost-btn');

                if (closeBtn) closeBtn.addEventListener('click', () => this.toggleVisibility());
                if (boostBtn) boostBtn.addEventListener('click', () => this.performBoost());

                // Dragging functionality
                const header = this.container.querySelector('.booster-header');
                if (header) {
                    header.addEventListener('mousedown', (e) => this.startDrag(e));
                }

                // Global drag events
                document.addEventListener('mousemove', (e) => this.drag(e));
                document.addEventListener('mouseup', () => this.stopDrag());
            }

            startDrag(e) {
                this.isDragging = true;
                this.container.classList.add('dragging');
                const rect = this.container.getBoundingClientRect();
                this.dragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                e.preventDefault();
            }

            drag(e) {
                if (!this.isDragging) return;

                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;

                const maxX = window.innerWidth - this.container.offsetWidth;
                const maxY = window.innerHeight - this.container.offsetHeight;

                const clampedX = Math.max(0, Math.min(x, maxX));
                const clampedY = Math.max(0, Math.min(y, maxY));

                this.container.style.left = clampedX + 'px';
                this.container.style.top = clampedY + 'px';
                this.container.style.right = 'auto';
                this.container.style.bottom = 'auto';
            }

            stopDrag() {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.container.classList.remove('dragging');
                }
            }

            switchTab(tabName) {
                this.activeTab = tabName;

                // Update tab buttons
                this.container.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.tab === tabName);
                });

                // Update tab content
                this.container.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.toggle('active', content.id === `${tabName}-tab`);
                });
            }

            toggleSetting(settingName) {
                this.config[settingName] = !this.config[settingName];
                this.saveConfig();

                const toggle = this.container.querySelector(`[data-setting="${settingName}"]`);
                if (toggle) {
                    toggle.classList.toggle('active', this.config[settingName]);
                }

                this.setupOptimizations();
                this.log(`${settingName}: ${this.config[settingName] ? 'enabled' : 'disabled'}`, 'info');
            }

            toggleVisibility() {
                this.isVisible = !this.isVisible;
                GM_setValue('isVisible', this.isVisible);
                this.container.style.display = this.isVisible ? 'block' : 'none';
            }

            setupOptimizations() {
                this.log('Applying optimizations...', 'info');

                if (this.config.lazyLoadEnabled) this.setupLazyLoading();
                if (this.config.imageOptimization) this.setupImageOptimization();
                if (this.config.adBlocking) this.setupAdBlocking();
                if (this.config.prefetchLinks) this.setupPrefetching();
                if (this.config.cssOptimization) this.setupCSSOptimization();
                if (this.config.scriptOptimization) this.setupScriptOptimization();
                if (this.config.domCleaning) this.setupDOMCleaning();

                this.updateUI();
            }

            setupLazyLoading() {
                if (this.intersectionObserver) {
                    this.intersectionObserver.disconnect();
                }

                this.intersectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const element = entry.target;

                            if (element.tagName === 'IMG') {
                                const src = element.dataset.src || element.dataset.lazySrc;
                                if (src) {
                                    element.src = src;
                                    element.removeAttribute('data-src');
                                    element.removeAttribute('data-lazy-src');
                                    this.metrics.imagesOptimized++;
                                }
                            } else if (element.tagName === 'IFRAME') {
                                const src = element.dataset.src;
                                if (src) {
                                    element.src = src;
                                    element.removeAttribute('data-src');
                                }
                            }

                            this.intersectionObserver.unobserve(element);
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });

                const lazyElements = document.querySelectorAll('img[data-src], img[data-lazy-src], iframe[data-src]');
                lazyElements.forEach(el => this.intersectionObserver.observe(el));

                const regularImages = document.querySelectorAll('img:not([data-src]):not([data-lazy-src])');
                regularImages.forEach(img => {
                    if (img.src && !img.complete) {
                        img.dataset.src = img.src;
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                        this.intersectionObserver.observe(img);
                    }
                });
            }

            setupImageOptimization() {
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (!img.dataset.optimized) {
                        img.classList.add('pbp-optimized-image');
                        img.dataset.optimized = 'true';
                    }
                });
                this.log(`Attempted to optimize ${images.length} images.`, 'info');
            }

            setupAdBlocking() {
                const adKeywords = ['ad', 'ads', 'tracker', 'banner', 'doubleclick', 'googleadservices', 'analytics', 'googlesyndication'];
                const elements = document.querySelectorAll('script, iframe, div, span, a');

                elements.forEach(el => {
                    if (adKeywords.some(keyword => el.outerHTML.toLowerCase().includes(keyword))) {
                        if (this.config.aggressiveMode) {
                            el.remove();
                            this.metrics.adsBlocked++;
                        } else {
                            el.style.display = 'none';
                            el.style.visibility = 'hidden';
                            el.style.width = '0';
                            el.style.height = '0';
                            el.style.position = 'absolute';
                            el.style.zIndex = '-9999';
                            this.metrics.adsBlocked++;
                        }
                    }
                });
                this.log(`Blocked ${this.metrics.adsBlocked} potential ads.`, 'success');
            }

            setupPrefetching() {
                if (!this.config.prefetchLinks) return;

                const links = Array.from(document.querySelectorAll('a[href]:not([rel="nofollow"])'));
                const uniqueLinks = [...new Set(links.map(a => a.href)) || []];

                const prefetchCount = Math.min(uniqueLinks.length, this.config.maxPrefetchLinks);

                for (let i = 0; i < prefetchCount; i++) {
                    const link = uniqueLinks[i];
                    if (link && link.startsWith('http') && !link.includes(window.location.hostname)) {
                        const prefetchLink = document.createElement('link');
                        prefetchLink.rel = 'prefetch';
                        prefetchLink.href = link;
                        document.head.appendChild(prefetchLink);
                        this.metrics.linksPrefetched++;
                    }
                }
                this.log(`Prefetched ${this.metrics.linksPrefetched} links.`, 'success');
            }

            setupCSSOptimization() {
                const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
                styles.forEach(style => {
                    // Simplified example: removing empty styles
                    if (style.tagName === 'STYLE' && style.innerHTML.trim() === '') {
                        style.remove();
                        this.metrics.cssOptimized++;
                    }
                });
            }

            setupScriptOptimization() {
                const scripts = document.querySelectorAll('script:not([src])');
                scripts.forEach(script => {
                    // Simplified example: moving inline scripts to bottom
                    document.body.appendChild(script);
                    this.metrics.scriptsOptimized++;
                });
            }

            setupDOMCleaning() {
                const comments = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_COMMENT);
                while (comments.nextNode()) {
                    comments.currentNode.remove();
                    this.metrics.domCleaned++;
                }
                this.log(`Cleaned up ${this.metrics.domCleaned} DOM elements.`, 'success');
            }

            setupMutationObserver() {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1) {
                                    if (this.config.lazyLoadEnabled) {
                                        const lazyElements = node.querySelectorAll('img[data-src], img[data-lazy-src], iframe[data-src]');
                                        lazyElements.forEach(el => this.intersectionObserver.observe(el));
                                    }
                                    if (this.config.adBlocking) this.setupAdBlocking();
                                    if (this.config.imageOptimization) this.setupImageOptimization();
                                }
                            });
                        }
                    });
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }

            setupPerformanceMonitoring() {
                if (this.config.realTimeMonitoring && window.performance && window.performance.memory) {
                    this.log('Real-time monitoring enabled.', 'info');
                } else {
                    this.log('Real-time monitoring not supported or disabled.', 'warn');
                }

                // Record initial load time
                if (window.performance && window.performance.timing) {
                    const navTiming = window.performance.timing;
                    this.realTimeMetrics.loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
                }
            }

            startRealTimeUpdates() {
                if (!this.config.realTimeMonitoring) return;

                const updateMetrics = (timestamp) => {
                    // FPS calculation
                    const frameTime = timestamp - this.lastFrameTime;
                    this.realTimeMetrics.fps = Math.round(1000 / frameTime);
                    this.lastFrameTime = timestamp;

                    // Memory calculation
                    if (window.performance && window.performance.memory) {
                        this.realTimeMetrics.memory = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
                    }

                    // DOM nodes count
                    this.realTimeMetrics.domNodes = document.querySelectorAll('*').length;

                    this.updateUI();
                    this.rafId = requestAnimationFrame(updateMetrics);
                };

                this.rafId = requestAnimationFrame(updateMetrics);
            }

            stopRealTimeUpdates() {
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                }
            }

            updateUI() {
                if (!this.container) return;

                // Update overview stats
                this.container.querySelector('#images-count').textContent = this.metrics.imagesOptimized;
                this.container.querySelector('#ads-count').textContent = this.metrics.adsBlocked;
                this.container.querySelector('#links-count').textContent = this.metrics.linksPrefetched;
                this.container.querySelector('#scripts-count').textContent = this.metrics.scriptsOptimized;

                // Update monitor tab
                if (this.config.realTimeMonitoring && this.container.querySelector('#fps-value')) {
                    this.container.querySelector('#fps-value').textContent = this.realTimeMetrics.fps;
                    this.container.querySelector('#memory-value').textContent = `${this.realTimeMetrics.memory} MB`;
                    this.container.querySelector('#dom-nodes').textContent = this.realTimeMetrics.domNodes;
                    this.container.querySelector('#load-time').textContent = `${this.realTimeMetrics.loadTime}ms`;
                }

                // Update settings toggles
                this.container.querySelectorAll('.toggle-switch').forEach(toggle => {
                    const setting = toggle.dataset.setting;
                    toggle.classList.toggle('active', this.config[setting]);
                });
            }

            performBoost() {
                const boostBtn = this.container.querySelector('#boost-btn');
                const boostText = this.container.querySelector('#boost-text');
                const boostProgress = this.container.querySelector('#boost-progress');

                if (boostBtn.classList.contains('boosting')) {
                    this.log('Boost is already in progress.', 'warn');
                    return;
                }

                boostBtn.classList.add('boosting');
                boostText.textContent = 'Boosting...';

                let progress = 0;
                const interval = setInterval(() => {
                    progress += 5;
                    if (progress >= 100) {
                        clearInterval(interval);
                        boostProgress.style.width = '100%';
                        boostText.textContent = 'Boost Complete! 🎉';
                        setTimeout(() => {
                            boostBtn.classList.remove('boosting');
                            boostProgress.style.width = '0';
                            boostText.textContent = 'Boost Performance';
                            this.showNotification('Performance boost complete!', 'success');
                        }, 1000);
                    } else {
                        boostProgress.style.width = `${progress}%`;
                    }
                }, 50);

                // Trigger a full re-scan and re-apply of all optimizations
                this.setupOptimizations();
                this.updateUI();
            }

            showNotification(message, type = 'info') {
                GM_notification({
                    text: message,
                    title: 'Performance Booster Pro',
                    timeout: 3000,
                    onclick: () => this.show()
                });
            }
        }

        // --- Hotkey Listener (outside the class) ---
        // This listener will always be active to show/hide the UI
        document.addEventListener('keydown', (e) => {
            // Check if the key pressed is the hyphen/minus key '-'
            if (e.key === '-' || e.key === '–') {
                // Prevent default browser actions
                e.preventDefault();
                // Get the UI element
                const ui = document.getElementById('performance-booster');
                if (ui) {
                    // Toggle the UI's visibility
                    const isVisible = ui.style.display !== 'none';
                    ui.style.display = isVisible ? 'none' : 'block';
                    // Save the new state to local storage
                    GM_setValue('isVisible', !isVisible);
                } else {
                    // If the UI doesn't exist yet, create it
                    if (!window.PerformanceBoosterProInstance) {
                        window.PerformanceBoosterProInstance = new PerformanceBoosterPro();
                    } else {
                        window.PerformanceBoosterProInstance.toggleVisibility();
                    }
                }
            }
        });

        // Check if the script has already been initialized on the page
        if (!window.PerformanceBoosterProInstance) {
            window.PerformanceBoosterProInstance = new PerformanceBoosterPro();
        }
    });
})();
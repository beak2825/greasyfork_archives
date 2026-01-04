// ==UserScript==
// @name         SEMrush Rankings Tracker 
// @namespace    http://tampermonkey.net/
// @version      7.8
// @description  Track SEMrush rankings with compact AMOLED theme (Optimized & Fixed)
// @author       quantavil
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @connect      semrush.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551887/SEMrush%20Rankings%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/551887/SEMrush%20Rankings%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============ CONFIGURATION ============
    const CONFIG = {
        CACHE_DAYS: 15,
        CACHE_KEY: 'semrush_cache_v4',
        SHORTCUT_KEY: 'KeyS',
        SHORTCUT_ALT: true,
        SHORTCUT_CTRL: false,
        SHORTCUT_SHIFT: false
    };
    // =======================================

    // Compact AMOLED Dark Theme
    GM_addStyle(`
        #sr-widget {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 14px;
            width: 340px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.9);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #e8e8e8;
            display: none;
        }

        @media (prefers-reduced-motion: reduce) {
            #sr-widget {
                backdrop-filter: none;
                background: rgba(0, 0, 0, 0.98);
            }
        }

        #sr-widget.visible {
            display: block;
        }

        .sr-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 14px 14px 0 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            cursor: move;
            user-select: none;
        }

        .sr-title {
            font-weight: 700;
            font-size: 13px;
            color: #a0b0ff;
            letter-spacing: 0.3px;
        }

        .sr-controls {
            display: flex;
            gap: 6px;
        }

        .sr-btn {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 4px 8px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            color: #e8e8e8;
            transition: all 0.2s ease;
            line-height: 1;
        }

        .sr-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: scale(1.05);
        }

        .sr-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.4);
            padding: 3px;
            margin: 6px 8px;
            border-radius: 10px;
            gap: 3px;
        }

        .sr-tab {
            flex: 1;
            padding: 6px 4px;
            text-align: center;
            cursor: pointer;
            border: none;
            background: transparent;
            color: rgba(255, 255, 255, 0.5);
            font-size: 11px;
            font-weight: 600;
            border-radius: 7px;
            transition: all 0.2s ease;
        }

        .sr-tab.active {
            background: rgba(160, 176, 255, 0.2);
            color: #a0b0ff;
        }

        .sr-content {
            padding: 0 10px 10px;
            overflow: hidden;
        }

        .sr-tab-content {
            display: none;
        }

        .sr-tab-content.active {
            display: block;
        }

        .sr-domain {
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 8px;
            color: #ffffff;
            word-break: break-word;
            text-align: center;
        }

        .sr-carousel {
            position: relative;
            min-height: 260px;
        }

        .sr-carousel-nav {
            display: flex;
            gap: 6px;
            margin-bottom: 8px;
            justify-content: center;
        }

        .sr-carousel-btn {
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 7px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .sr-carousel-btn.active {
            background: rgba(160, 176, 255, 0.25);
            color: #a0b0ff;
            border-color: rgba(160, 176, 255, 0.4);
        }

        .sr-carousel-slide {
            display: none;
        }

        .sr-carousel-slide.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .sr-stat {
            display: flex;
            justify-content: space-between;
            padding: 6px 10px;
            margin: 4px 0;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            transition: background 0.2s ease;
        }

        .sr-stat:hover {
            background: rgba(255, 255, 255, 0.07);
        }

        .sr-stat-label {
            color: rgba(255, 255, 255, 0.75);
            font-size: 13px;
            font-weight: 700;
        }

        .sr-stat-value {
            color: #ffffff;
            font-weight: 500;
            font-size: 12px;
        }

        .sr-loading, .sr-error, .sr-no-data {
            text-align: center;
            padding: 40px 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 12px;
            font-weight: 600;
        }

        .sr-error {
            color: #ff6b6b;
        }

        .sr-chart-container {
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 10px;
            margin-bottom: 0;
        }

        .sr-chart-title {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 10px;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .sr-table-wrapper {
            max-height: 320px;
            overflow-y: auto;
            margin-bottom: 8px;
        }

        .sr-table-wrapper::-webkit-scrollbar {
            width: 8px;
        }

        .sr-table-wrapper::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
        }

        .sr-table-wrapper::-webkit-scrollbar-thumb {
            background: rgba(160, 176, 255, 0.3);
            border-radius: 4px;
        }

        .sr-table-wrapper::-webkit-scrollbar-thumb:hover {
            background: rgba(160, 176, 255, 0.5);
        }

        .sr-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 3px;
            font-size: 11px;
        }

        .sr-table th {
            background: rgba(255, 255, 255, 0.06);
            padding: 7px 5px;
            text-align: left;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.8);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .sr-table td {
            padding: 7px 5px;
            background: rgba(255, 255, 255, 0.03);
            color: #e8e8e8;
            font-weight: 600;
        }

        .sr-table tr:hover td {
            background: rgba(255, 255, 255, 0.06);
        }

        .sr-link {
            color: #a0b0ff;
            text-decoration: none;
            font-weight: 600;
        }

        .sr-link:hover {
            text-decoration: underline;
        }

        .sr-cache-info {
            font-size: 9px;
            color: rgba(255, 255, 255, 0.4);
            text-align: center;
            margin-top: 4px;
            margin-bottom: 0;
            font-weight: 600;
        }

        .sr-clear-cache {
            width: 100%;
            padding: 8px;
            background: rgba(160, 176, 255, 0.2);
            color: #a0b0ff;
            border: 1px solid rgba(160, 176, 255, 0.3);
            border-radius: 8px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 700;
            margin-top: 8px;
            transition: all 0.2s ease;
        }

        .sr-clear-cache:hover {
            background: rgba(160, 176, 255, 0.3);
        }

        /* Chartist.js Styles */
        #sr-widget canvas {
            max-height: 180px;
        }

        #sr-widget .ct-chart {
            max-height: 180px;
        }

        #sr-widget .ct-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 10px;
            font-weight: 600;
            fill: rgba(255, 255, 255, 0.7);
        }

        #sr-widget .ct-grid {
            stroke: rgba(255, 255, 255, 0.1);
            stroke-width: 1px;
        }

        #sr-widget .ct-series-a .ct-bar,
        #sr-widget .ct-series-a .ct-line,
        #sr-widget .ct-series-a .ct-point {
            stroke: rgba(180, 190, 255, 0.95);
        }

        #sr-widget .ct-bar {
            stroke-width: 20px;
        }

        #sr-widget .ct-series-a .ct-slice-donut {
            stroke: rgba(180, 190, 255, 0.95);
        }

        /* Chartist Tooltip Styles */
        .chartist-tooltip {
            position: absolute;
            display: inline-block;
            opacity: 0;
            min-width: 60px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.95);
            color: #a0b0ff;
            font-weight: 700;
            font-size: 12px;
            text-align: center;
            pointer-events: none;
            z-index: 1000000;
            transition: opacity 0.2s ease;
            border: 1px solid rgba(160, 176, 255, 0.4);
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .chartist-tooltip:before {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            width: 0;
            height: 0;
            margin-left: -5px;
            border: 5px solid transparent;
            border-top-color: rgba(0, 0, 0, 0.95);
        }

        .chartist-tooltip.tooltip-show {
            opacity: 1;
        }

        .ct-bar {
            cursor: pointer;
        }
    `);

    // Chartist.js Dynamic Loader
    const ChartsLoader = {
        loaded: false,
        loading: null,

        load() {
            if (this.loaded) return Promise.resolve();
            if (this.loading) return this.loading;

            this.loading = new Promise((resolve, reject) => {
                // Load Chartist CSS
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.css';
                document.head.appendChild(css);

                // Load Chartist JS
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js';
                script.onload = () => {
                    // Load Tooltip Plugin
                    const tooltipScript = document.createElement('script');
                    tooltipScript.src = 'https://cdn.jsdelivr.net/npm/chartist-plugin-tooltips@0.0.17/dist/chartist-plugin-tooltip.min.js';
                    tooltipScript.onload = () => {
                        this.loaded = true;
                        this.loading = null;
                        resolve();
                    };
                    tooltipScript.onerror = () => {
                        // Fallback: continue without tooltips
                        this.loaded = true;
                        this.loading = null;
                        resolve();
                    };
                    document.head.appendChild(tooltipScript);
                };
                script.onerror = () => {
                    this.loading = null;
                    reject(new Error('Failed to load Chartist.js'));
                };
                document.head.appendChild(script);
            });

            return this.loading;
        }
    };

    // Utility Functions
    const Utils = {
        getRootDomain(url) {
            try {
                const hostname = new URL(url).hostname;
                const parts = hostname.split('.');
                const cleanParts = parts[0] === 'www' ? parts.slice(1) : parts;

                if (cleanParts.length > 2) {
                    const tld = cleanParts.slice(-2).join('.');
                    if (['co.uk', 'com.au', 'co.in', 'co.jp'].includes(tld)) {
                        return cleanParts.slice(-3).join('.');
                    }
                    return cleanParts.slice(-2).join('.');
                }
                return cleanParts.join('.');
            } catch (e) {
                return null;
            }
        },

        formatNumber(num) {
            if (num == null) return 'N/A';
            if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
            if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
            if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
            return num.toLocaleString();
        },

        parseNumber(str) {
            if (!str) return null;
            str = str.replace(/,/g, '').trim();
            const multipliers = { B: 1e9, M: 1e6, K: 1e3 };
            for (let [suffix, mult] of Object.entries(multipliers)) {
                if (str.includes(suffix)) {
                    return parseFloat(str) * mult;
                }
            }
            return parseFloat(str);
        },

        parseDuration(timeStr) {
            if (!timeStr) return null;
            const parts = timeStr.split(':');
            if (parts.length !== 2) return null;
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        },

        formatDuration(seconds) {
            if (seconds == null) return 'N/A';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        parsePercentage(str) {
            if (!str) return null;
            return parseFloat(str.replace('%', ''));
        },

        getDaysAgo(timestamp) {
            return Math.floor((Date.now() - timestamp) / 86400000);
        }
    };

    // Cache Manager using GM API
    const Cache = {
        get() {
            try {
                const data = GM_getValue(CONFIG.CACHE_KEY, '{}');
                return JSON.parse(data);
            } catch (e) {
                console.error('Cache GET error:', e);
                return {};
            }
        },

        set(cache) {
            try {
                GM_setValue(CONFIG.CACHE_KEY, JSON.stringify(cache));
            } catch (e) {
                console.error('Cache SET error:', e);
            }
        },

        addDomain(domain, data) {
            const cache = this.get();
            cache[domain] = data;
            this.set(cache);
        },

        isValid(entry) {
            if (!entry?.timestamp) return false;
            return Utils.getDaysAgo(entry.timestamp) < CONFIG.CACHE_DAYS;
        },

        clear() {
            GM_deleteValue(CONFIG.CACHE_KEY);
        }
    };

    // SEMrush Scraper
    const SEMrush = {
        fetch(domain, callback) {
            const url = `https://www.semrush.com/website/${domain}/overview/`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status === 403 || response.status === 429) {
                        callback(new Error('SEMrush blocked the request. Try opening semrush.com in a tab first to authenticate, then refresh.'), null);
                        return;
                    }

                    if (response.status !== 200) {
                        callback(new Error(`Failed to fetch (HTTP ${response.status})`), null);
                        return;
                    }

                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                        const data = this.parse(doc, domain);
                        callback(null, data);
                    } catch (e) {
                        callback(e, null);
                    }
                },
                onerror: (error) => callback(new Error('Network error occurred'), null)
            });
        },

        parse(doc, domain) {
            const data = {
                domain,
                globalRank: null,
                countryRank: null,
                country: null,
                categoryRank: null,
                category: null,
                visits: null,
                avgDuration: null,
                trafficTrend: [],
                trafficByCountry: [],
                timestamp: Date.now()
            };

            // Extract ranks
            doc.querySelectorAll('[data-test="RankStats"]').forEach(stat => {
                const label = stat.querySelector('.textStyle_small')?.textContent || '';
                const value = stat.querySelector('.textStyle_h5')?.textContent || '';
                const categoryElement = stat.querySelector('.fw_600.white-space_wrap');
                const countryElement = stat.querySelector('.fw_600.white-space_wrap');

                if (label.includes('Global Rank')) {
                    data.globalRank = parseInt(value.replace(/,/g, ''));
                } else if (label.includes('Country Rank')) {
                    data.countryRank = parseInt(value.replace(/,/g, ''));
                    if (countryElement) {
                        data.country = countryElement.textContent.trim();
                    }
                } else if (label.includes('Category Rank')) {
                    data.categoryRank = parseInt(value.replace(/,/g, ''));
                    if (categoryElement) {
                        data.category = categoryElement.textContent.trim();
                    }
                }
            });

            // Extract metrics
            doc.querySelectorAll('[data-test="MetricsCard"]').forEach(card => {
                const label = card.querySelector('.textStyle_small')?.textContent || '';
                const value = card.querySelector('.textStyle_h5')?.textContent || '';

                if (label.includes('Visits') && !label.includes('Duration')) {
                    data.visits = Utils.parseNumber(value);
                } else if (label.includes('Avg. Visit Duration')) {
                    data.avgDuration = Utils.parseDuration(value);
                }
            });

            // Extract traffic trend
            const trendSection = doc.querySelector('.d_flex.flex-d_column.flex-g_1');
            if (trendSection) {
                const trend = [];

                // Look for the parent container that has the bars
                const barsContainer = trendSection.querySelector('.d_flex.flex-d_column.mt_8');

                if (barsContainer) {
                    // Get all direct children that are flex containers with bars
                    const bars = barsContainer.querySelectorAll(':scope > .d_flex');

                    bars.forEach(bar => {
                        // Find month and value within the bar's label section
                        const labelSection = bar.querySelector('.d_flex.flex-d_column.jc_center');

                        if (labelSection) {
                            const monthEl = labelSection.querySelector('.textStyle_small:not(.fw_600)');
                            const valueEl = labelSection.querySelector('.textStyle_small.fw_600');

                            if (monthEl && valueEl) {
                                const month = monthEl.textContent.trim();
                                const visits = Utils.parseNumber(valueEl.textContent);

                                if (month && visits) {
                                    trend.push({ month, visits });
                                }
                            }
                        }
                    });
                }

                // Reverse to show oldest to newest (Jun -> Jul -> Aug)
                if (trend.length > 0) {
                    data.trafficTrend = trend.reverse();
                }
            }

            // Extract traffic by country
            const countryTable = doc.querySelector('[data-test="TrafficByCountryTable"]');
            if (countryTable) {
                const rows = countryTable.querySelectorAll('tbody tr');
                const countries = [];

                rows.forEach((row, index) => {
                    if (index < 5) {
                        const countryName = row.querySelector('.fw_600')?.textContent.trim();
                        const percentCell = row.querySelectorAll('td')[1];
                        const percent = percentCell ? Utils.parsePercentage(percentCell.textContent) : null;

                        if (countryName && percent != null) {
                            countries.push({
                                country: countryName,
                                percentage: parseFloat(percent.toFixed(2))
                            });
                        }
                    }
                });

                // Calculate "Other" with proper rounding
                if (countries.length > 0) {
                    const totalShown = countries.reduce((sum, c) => sum + c.percentage, 0);
                    const remaining = Math.max(0, +(100 - totalShown).toFixed(2));

                    // Only add "Other" if it's significant
                    if (remaining >= 0.5) {
                        countries.push({
                            country: 'Other',
                            percentage: remaining
                        });
                    }
                }

                data.trafficByCountry = countries;
            }

            return data;
        }
    };

    // UI Components
    const UI = {
        widget: null,
        chartInstances: {},
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,

        create() {
            this.widget = document.createElement('div');
            this.widget.id = 'sr-widget';
            this.widget.innerHTML = `
                <div class="sr-header" id="sr-drag-handle">
                    <div class="sr-title">SEMrush Tracker</div>
                    <div class="sr-controls">
                        <button class="sr-btn" id="sr-refresh" title="Refresh data" aria-label="Refresh data">⟳</button>
                        <button class="sr-btn" id="sr-close" title="Toggle widget (${this.getShortcutText()})" aria-label="Toggle widget visibility">✕</button>
                    </div>
                </div>
                <div class="sr-tabs">
                    <button class="sr-tab active" data-tab="current">Current</button>
                    <button class="sr-tab" data-tab="all">All Sites</button>
                </div>
                <div class="sr-content">
                    <div class="sr-tab-content active" id="tab-current">
                        <div class="sr-loading">Loading...</div>
                    </div>
                    <div class="sr-tab-content" id="tab-all">
                        <div class="sr-loading">Loading...</div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.widget);
            this.bindEvents();
            this.makeDraggable();
        },

        getShortcutText() {
            let keys = [];
            if (CONFIG.SHORTCUT_ALT) keys.push('Alt');
            if (CONFIG.SHORTCUT_CTRL) keys.push('Ctrl');
            if (CONFIG.SHORTCUT_SHIFT) keys.push('Shift');
            keys.push(CONFIG.SHORTCUT_KEY.replace('Key', ''));
            return keys.join('+');
        },

        makeDraggable() {
            const header = document.getElementById('sr-drag-handle');

            header.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                this.isDragging = true;
                const rect = this.widget.getBoundingClientRect();
                this.initialX = e.clientX - rect.left;
                this.initialY = e.clientY - rect.top;
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.isDragging) return;
                e.preventDefault();

                let newX = e.clientX - this.initialX;
                let newY = e.clientY - this.initialY;

                // Keep within viewport
                newX = Math.max(0, Math.min(newX, window.innerWidth - this.widget.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - this.widget.offsetHeight));

                this.widget.style.left = newX + 'px';
                this.widget.style.top = newY + 'px';
                this.widget.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                this.isDragging = false;
            });
        },

        bindEvents() {
            this.widget.querySelectorAll('.sr-tab').forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
            });

            document.getElementById('sr-close').addEventListener('click', () => {
                this.toggle();
            });

            document.getElementById('sr-refresh').addEventListener('click', () => {
                const domain = Utils.getRootDomain(window.location.href);
                if (domain) {
                    const cache = Cache.get();
                    delete cache[domain];
                    Cache.set(cache);
                    App.loadCurrent(domain);
                }
            });
        },

        switchTab(tabName) {
            this.widget.querySelectorAll('.sr-tab').forEach(t => t.classList.remove('active'));
            this.widget.querySelectorAll('.sr-tab-content').forEach(c => c.classList.remove('active'));

            this.widget.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');

            if (tabName === 'all') App.loadAll();
        },

        toggle() {
            this.widget.classList.toggle('visible');
        },

        show() {
            this.widget.classList.add('visible');
        },

        destroyChart(id) {
            const container = document.getElementById(`sr-${id}-chart`);
            if (container) {
                container.innerHTML = '';
            }
            if (this.chartInstances[id]) {
                if (this.chartInstances[id].detach) {
                    this.chartInstances[id].detach();
                }
                delete this.chartInstances[id];
            }
        },

        renderCurrent(data) {
            const container = document.getElementById('tab-current');

            if (!data) {
                container.innerHTML = '<div class="sr-error">No data available</div>';
                return;
            }

            const hasCountryData = data.trafficByCountry?.length > 0;
            const hasTrendData = data.trafficTrend?.length > 0;

            let html = `
                <div class="sr-domain">${data.domain}</div>
                <div class="sr-carousel">
                    <div class="sr-carousel-nav">
                        <button class="sr-carousel-btn active" data-slide="stats">📊 Stats</button>
                        ${hasTrendData ? '<button class="sr-carousel-btn" data-slide="trend">📈 Trend</button>' : ''}
                        ${hasCountryData ? '<button class="sr-carousel-btn" data-slide="country">🌍 Country</button>' : ''}
                    </div>

                    <!-- Main Stats Slide -->
                    <div class="sr-carousel-slide active" data-slide="stats">
                        <div class="sr-stat">
                            <span class="sr-stat-label">Global Rank</span>
                            <span class="sr-stat-value">${data.globalRank ? '#' + Utils.formatNumber(data.globalRank) : 'N/A'}</span>
                        </div>
                        <div class="sr-stat">
                            <span class="sr-stat-label">Country Rank</span>
                            <span class="sr-stat-value">${data.countryRank ? '#' + Utils.formatNumber(data.countryRank) : 'N/A'} ${data.country ? '(' + data.country + ')' : ''}</span>
                        </div>
                        <div class="sr-stat">
                            <span class="sr-stat-label">Category Rank</span>
                            <span class="sr-stat-value">${data.categoryRank ? '#' + Utils.formatNumber(data.categoryRank) : 'N/A'} ${data.category ? '(' + data.category + ')' : ''}</span>
                        </div>
                        <div class="sr-stat">
                            <span class="sr-stat-label">Monthly Visits</span>
                            <span class="sr-stat-value">${Utils.formatNumber(data.visits)}</span>
                        </div>
                        <div class="sr-stat">
                            <span class="sr-stat-label">Avg Duration</span>
                            <span class="sr-stat-value">${Utils.formatDuration(data.avgDuration)}</span>
                        </div>
                    </div>

                    <!-- Trend Slide -->
                    ${hasTrendData ? `
                        <div class="sr-carousel-slide" data-slide="trend">
                            <div class="sr-chart-container">
                                <div class="sr-chart-title">Monthly Traffic Trend</div>
                                <div class="ct-chart ct-perfect-fourth" id="sr-trend-chart"></div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Country Slide -->
                    ${hasCountryData ? `
                        <div class="sr-carousel-slide" data-slide="country">
                            <div class="sr-chart-container">
                                <div class="sr-chart-title">Traffic by Country</div>
                                <div class="ct-chart ct-perfect-fourth" id="sr-country-chart"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="sr-cache-info">Cached ${Utils.getDaysAgo(data.timestamp)}d ago</div>
            `;

            container.innerHTML = html;

            // Bind carousel navigation
            container.querySelectorAll('.sr-carousel-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.sr-carousel-btn').forEach(b => b.classList.remove('active'));
                    container.querySelectorAll('.sr-carousel-slide').forEach(s => s.classList.remove('active'));

                    btn.classList.add('active');
                    const slide = container.querySelector(`.sr-carousel-slide[data-slide="${btn.dataset.slide}"]`);
                    slide.classList.add('active');

                    // Load charts on-demand when switching to chart slides
                    if (btn.dataset.slide === 'trend' && hasTrendData) {
                        ChartsLoader.load().then(() => this.renderTrendChart(data.trafficTrend));
                    } else if (btn.dataset.slide === 'country' && hasCountryData) {
                        ChartsLoader.load().then(() => this.renderCountryChart(data.trafficByCountry));
                    }
                });
            });
        },

        renderCountryChart(countries) {
            this.destroyChart('country');

            if (typeof Chartist === 'undefined') {
                console.error('Chartist not loaded');
                return;
            }

            // Filter out "Other" and sort by percentage (ascending - reverse order)
            const filtered = countries.filter(c => c.country !== 'Other');
            const sorted = filtered.sort((a, b) => a.percentage - b.percentage); // Ascending

            const data = {
                labels: sorted.map(c => c.country),
                series: [sorted.map(c => c.percentage)]
            };

            const options = {
                seriesBarDistance: 10,
                reverseData: false,
                horizontalBars: true,
                axisX: {
                    labelInterpolationFnc: (value) => value.toFixed(1) + '%',
                    offset: 30
                },
                axisY: {
                    offset: 70
                },
                height: 180,
                plugins: []
            };

            // Add tooltip plugin if available
            if (typeof Chartist.plugins !== 'undefined' && Chartist.plugins.tooltip) {
                options.plugins.push(
                    Chartist.plugins.tooltip({
                        tooltipFnc: (meta, value) => {
                            return `${meta} ${parseFloat(value).toFixed(2)}%`;
                        }
                    })
                );
            }

            this.chartInstances.country = new Chartist.Bar('#sr-country-chart', data, options);
        },

        renderTrendChart(trend) {
            this.destroyChart('trend');

            if (typeof Chartist === 'undefined') {
                console.error('Chartist not loaded');
                return;
            }

            const data = {
                labels: trend.map(t => t.month),
                series: [trend.map(t => t.visits)]
            };

            const options = {
                axisY: {
                    labelInterpolationFnc: (value) => Utils.formatNumber(value),
                    offset: 40
                },
                axisX: {
                    offset: 30
                },
                height: 160,
                plugins: []
            };

            // Add tooltip plugin if available
            if (typeof Chartist.plugins !== 'undefined' && Chartist.plugins.tooltip) {
                options.plugins.push(
                    Chartist.plugins.tooltip({
                        tooltipFnc: (meta, value) => {
                            return `${meta} ${Utils.formatNumber(value)} visits`;
                        }
                    })
                );
            }

            this.chartInstances.trend = new Chartist.Bar('#sr-trend-chart', data, options);
        },

        renderAll() {
            const container = document.getElementById('tab-all');
            const cache = Cache.get();
            const domains = Object.keys(cache);

            if (domains.length === 0) {
                container.innerHTML = '<div class="sr-no-data">No cached sites yet</div>';
                return;
            }

            const sorted = domains.sort((a, b) => {
                const rankA = cache[a].globalRank || Infinity;
                const rankB = cache[b].globalRank || Infinity;
                return rankA - rankB;
            });

            let html = `
                <div class="sr-table-wrapper">
                    <table class="sr-table">
                        <thead>
                            <tr>
                                <th>Domain</th>
                                <th>Rank</th>
                                <th>Visits</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            sorted.forEach(domain => {
                const d = cache[domain];
                html += `
                    <tr>
                        <td><a href="https://${domain}" class="sr-link" target="_blank">${domain}</a></td>
                        <td>${d.globalRank ? '#' + Utils.formatNumber(d.globalRank) : 'N/A'}</td>
                        <td>${Utils.formatNumber(d.visits)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
                <button class="sr-clear-cache" id="sr-clear-all">🗑️ Clear Cache (${domains.length})</button>
            `;

            container.innerHTML = html;

            document.getElementById('sr-clear-all')?.addEventListener('click', () => {
                if (confirm(`Clear all ${domains.length} cached sites?`)) {
                    Cache.clear();
                    this.renderAll();
                }
            });
        }
    };

    // Main App
    const App = {
        init() {
            // Don't run on SEMrush itself
            if (window.location.hostname.includes('semrush.com')) return;
            const domain = Utils.getRootDomain(window.location.href);
            if (!domain) return;

            UI.create();
            const observer = new MutationObserver(() => {
                if (!document.body.contains(UI.widget)) {
                    document.body.appendChild(UI.widget);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            this.setupShortcut();
            this.observeURLChanges();
            this.loadCurrent(domain);
        },

        setupShortcut() {
            const handleShortcut = (e) => {
                const altMatch = CONFIG.SHORTCUT_ALT ? e.altKey : !e.altKey;
                const ctrlMatch = CONFIG.SHORTCUT_CTRL ? e.ctrlKey : !e.ctrlKey;
                const shiftMatch = CONFIG.SHORTCUT_SHIFT ? e.shiftKey : !e.shiftKey;
                if (e.code === CONFIG.SHORTCUT_KEY && altMatch && ctrlMatch && shiftMatch) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    UI.toggle();
                }
            };
            window.addEventListener('keydown', handleShortcut, { capture: true });
        },

        observeURLChanges() {
            let lastUrl = location.href;

            const checkURL = () => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    const newDomain = Utils.getRootDomain(location.href);
                    if (newDomain) {
                        this.loadCurrent(newDomain);
                    }
                }
            };

            // Listen to history changes (SPA navigation)
            window.addEventListener('popstate', checkURL);

            // Intercept pushState/replaceState
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function () {
                originalPushState.apply(this, arguments);
                checkURL();
            };

            history.replaceState = function () {
                originalReplaceState.apply(this, arguments);
                checkURL();
            };
        },

        loadCurrent(domain) {
            const cache = Cache.get();
            const cached = cache[domain];

            if (cached && Cache.isValid(cached)) {
                UI.renderCurrent(cached);
                return;
            }

            const container = document.getElementById('tab-current');
            container.innerHTML = '<div class="sr-loading">Fetching data...</div>';

            SEMrush.fetch(domain, (error, data) => {
                if (error) {
                    container.innerHTML = `<div class="sr-error">${error.message || 'Failed to fetch data'}</div>`;
                    return;
                }

                Cache.addDomain(domain, data);
                UI.renderCurrent(data);
            });
        },

        loadAll() {
            UI.renderAll();
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();
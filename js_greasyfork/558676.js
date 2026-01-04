// ==UserScript==
// @name         Stimulation Clicker Enhancer Pro
// @namespace    kaizenclickerenhancer
// @license      MIT
// @version      3.0
// @author       01 dev 
// @description  Advanced test mode with UI controls, presets, and stats tracking
// @match        https://neal.fun/stimulation-clicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558676/Stimulation%20Clicker%20Enhancer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/558676/Stimulation%20Clicker%20Enhancer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        clickInterval: 50,
        stimMultiplier: 100,
        autoClickEnabled: false,
        intervalId: null,
        clickCount: 0,
        startTime: null
    };

    let vueState = null;

    // Preset configurations
    const PRESETS = {
        slow: { interval: 200, multiplier: 10, name: 'Slow Grind' },
        normal: { interval: 50, multiplier: 100, name: 'Normal Test' },
        fast: { interval: 20, multiplier: 500, name: 'Fast Mode' },
        turbo: { interval: 10, multiplier: 1000, name: 'Turbo Boost' }
    };

    // Create enhanced UI Control Panel
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'stim-enhancer-panel';
        panel.innerHTML = `
            <style>
                #stim-enhancer-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
                    border: 2px solid #4a9eff;
                    border-radius: 16px;
                    padding: 20px;
                    z-index: 10000;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
                    min-width: 280px;
                    backdrop-filter: blur(10px);
                }
                #stim-enhancer-panel * {
                    box-sizing: border-box;
                }
                .stim-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .stim-header h3 {
                    margin: 0;
                    color: #4a9eff;
                    font-size: 18px;
                    font-weight: 600;
                }
                .stim-footer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    margin-top: 16px;
                    padding-top: 12px;
                    border-top: 1px solid #333;
                }
                .stim-discord-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #7289da;
                    text-decoration: none;
                    font-size: 11px;
                    transition: color 0.2s;
                    font-weight: 500;
                }
                .stim-discord-link:hover {
                    color: #5b6eae;
                }
                .stim-discord-link svg {
                    width: 14px;
                    height: 14px;
                }
                .stim-footer-divider {
                    color: #666;
                    font-size: 11px;
                }
                .stim-dev-credit {
                    color: #888;
                    font-size: 11px;
                    font-weight: 500;
                }
                .stim-minimize-btn {
                    background: transparent;
                    border: none;
                    color: #888;
                    cursor: pointer;
                    font-size: 20px;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    transition: color 0.2s;
                }
                .stim-minimize-btn:hover {
                    color: #4a9eff;
                }
                .stim-content {
                    transition: all 0.3s;
                }
                .stim-content.minimized {
                    display: none;
                }
                .stim-presets {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                    margin-bottom: 16px;
                }
                .stim-preset-btn {
                    padding: 8px;
                    background: #2a2a3e;
                    border: 1px solid #444;
                    border-radius: 6px;
                    color: #aaa;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .stim-preset-btn:hover {
                    background: #3a3a4e;
                    border-color: #4a9eff;
                    color: #4a9eff;
                }
                .stim-preset-btn.active {
                    background: #4a9eff;
                    border-color: #4a9eff;
                    color: white;
                }
                .stim-control-group {
                    margin-bottom: 14px;
                }
                .stim-control-group label {
                    display: flex;
                    justify-content: space-between;
                    color: #aaa;
                    font-size: 11px;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    font-weight: 500;
                }
                .stim-control-group input[type="number"] {
                    width: 100%;
                    background: #1a1a24;
                    border: 1px solid #333;
                    border-radius: 6px;
                    padding: 8px;
                    color: #fff;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }
                .stim-control-group input[type="number"]:focus {
                    outline: none;
                    border-color: #4a9eff;
                }
                .stim-control-group input[type="range"] {
                    width: 100%;
                    height: 6px;
                    background: #1a1a24;
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                }
                .stim-control-group input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #4a9eff;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: transform 0.2s;
                }
                .stim-control-group input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }
                .stim-value-display {
                    color: #4a9eff;
                    font-weight: bold;
                    font-size: 13px;
                }
                .stim-button-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-top: 16px;
                }
                #stim-toggle-btn {
                    grid-column: 1 / -1;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                #stim-toggle-btn.stopped {
                    background: linear-gradient(135deg, #4a9eff 0%, #3a7edf 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
                }
                #stim-toggle-btn.stopped:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(74, 158, 255, 0.4);
                }
                #stim-toggle-btn.running {
                    background: linear-gradient(135deg, #ff4a4a 0%, #df3a3a 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(255, 74, 74, 0.3);
                }
                #stim-toggle-btn.running:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(255, 74, 74, 0.4);
                }
                .stim-secondary-btn {
                    padding: 8px;
                    background: #2a2a3e;
                    border: 1px solid #444;
                    border-radius: 6px;
                    color: #aaa;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .stim-secondary-btn:hover {
                    background: #3a3a4e;
                    border-color: #4a9eff;
                    color: #4a9eff;
                }
                .stim-stats {
                    background: #1a1a24;
                    border-radius: 8px;
                    padding: 12px;
                    margin-top: 16px;
                }
                .stim-stats-title {
                    color: #4a9eff;
                    font-size: 11px;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    font-weight: 600;
                }
                .stim-stat-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 6px;
                    font-size: 12px;
                }
                .stim-stat-label {
                    color: #888;
                }
                .stim-stat-value {
                    color: #4aff4a;
                    font-weight: bold;
                }
                .stim-status {
                    text-align: center;
                    margin-top: 12px;
                    font-size: 11px;
                    color: #888;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .stim-status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #888;
                    transition: background 0.3s;
                }
                .stim-status-dot.running {
                    background: #4aff4a;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
            
            <div class="stim-header">
                <h3>⚡ Click Enhancer Pro</h3>
                <button class="stim-minimize-btn" id="stim-minimize">−</button>
            </div>
            
            <div class="stim-footer">
                <span class="stim-dev-credit">by</span>
                <a href="https://discord.gg/YTeRSG8kER" target="_blank" class="stim-discord-link">
                    <svg width="16" height="16" viewBox="0 0 71 55" fill="currentColor">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                    </svg>
                </a>
                <span class="stim-footer-divider">|</span>
                <span class="stim-dev-credit">01 dev</span>
            </div>
            
            <div class="stim-content">
                <div class="stim-presets">
                    <button class="stim-preset-btn" data-preset="slow">🐌 Slow</button>
                    <button class="stim-preset-btn" data-preset="normal">⚡ Normal</button>
                    <button class="stim-preset-btn" data-preset="fast">🚀 Fast</button>
                    <button class="stim-preset-btn" data-preset="turbo">💥 Turbo</button>
                </div>
                
                <div class="stim-control-group">
                    <label>
                        <span>Click Speed</span>
                        <span class="stim-value-display" id="cps-display">20/sec</span>
                    </label>
                    <input type="number" id="stim-interval" min="1" max="1000" value="${CONFIG.clickInterval}">
                </div>
                
                <div class="stim-control-group">
                    <label>
                        <span>Multiplier</span>
                        <span class="stim-value-display" id="mult-display">×${CONFIG.stimMultiplier}</span>
                    </label>
                    <input type="range" id="stim-multiplier" min="1" max="1000" value="${CONFIG.stimMultiplier}">
                </div>
                
                <button id="stim-toggle-btn" class="stopped">▶ Start Auto-Click</button>
                
                <div class="stim-button-group">
                    <button class="stim-secondary-btn" id="stim-reset">Reset Stats</button>
                    <button class="stim-secondary-btn" id="stim-single">Single Click</button>
                </div>
                
                <div class="stim-stats">
                    <div class="stim-stats-title">📊 Statistics</div>
                    <div class="stim-stat-row">
                        <span class="stim-stat-label">Total Clicks:</span>
                        <span class="stim-stat-value" id="stat-clicks">0</span>
                    </div>
                    <div class="stim-stat-row">
                        <span class="stim-stat-label">Runtime:</span>
                        <span class="stim-stat-value" id="stat-runtime">0s</span>
                    </div>
                    <div class="stim-stat-row">
                        <span class="stim-stat-label">Avg CPS:</span>
                        <span class="stim-stat-value" id="stat-avg-cps">0.0</span>
                    </div>
                </div>
                
                <div class="stim-status">
                    <div class="stim-status-dot" id="stim-status-dot"></div>
                    <span id="stim-status-text">Ready</span>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        setupEventListeners();
    }

    // Setup all event listeners
    function setupEventListeners() {
        const toggleBtn = document.getElementById('stim-toggle-btn');
        const intervalInput = document.getElementById('stim-interval');
        const multiplierInput = document.getElementById('stim-multiplier');
        const minimizeBtn = document.getElementById('stim-minimize');
        const resetBtn = document.getElementById('stim-reset');
        const singleBtn = document.getElementById('stim-single');
        const presetButtons = document.querySelectorAll('.stim-preset-btn');

        // Minimize toggle
        minimizeBtn.addEventListener('click', () => {
            const content = document.querySelector('.stim-content');
            const isMinimized = content.classList.toggle('minimized');
            minimizeBtn.textContent = isMinimized ? '+' : '−';
        });

        // Preset buttons
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = PRESETS[btn.dataset.preset];
                intervalInput.value = preset.interval;
                multiplierInput.value = preset.multiplier;
                updateDisplays();
                
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                updateStatus(`Preset: ${preset.name}`, false);
            });
        });

        // Update displays
        intervalInput.addEventListener('input', updateDisplays);
        multiplierInput.addEventListener('input', updateDisplays);

        // Toggle button
        toggleBtn.addEventListener('click', toggleAutoClick);

        // Reset stats
        resetBtn.addEventListener('click', resetStats);

        // Single click
        singleBtn.addEventListener('click', () => {
            if (vueState && typeof vueState.onMainClick === 'function') {
                vueState.onMainClick();
                CONFIG.clickCount++;
                updateStats();
            }
        });
    }

    // Update value displays
    function updateDisplays() {
        const interval = parseInt(document.getElementById('stim-interval').value) || 50;
        const multiplier = parseInt(document.getElementById('stim-multiplier').value) || 100;
        
        const cps = (1000 / interval).toFixed(1);
        document.getElementById('cps-display').textContent = `${cps}/sec`;
        document.getElementById('mult-display').textContent = `×${multiplier}`;
    }

    // Toggle auto-click
    function toggleAutoClick() {
        CONFIG.autoClickEnabled = !CONFIG.autoClickEnabled;
        
        const toggleBtn = document.getElementById('stim-toggle-btn');
        
        if (CONFIG.autoClickEnabled) {
            CONFIG.clickInterval = parseInt(document.getElementById('stim-interval').value) || 50;
            CONFIG.stimMultiplier = parseInt(document.getElementById('stim-multiplier').value) || 100;
            CONFIG.startTime = Date.now();
            startAutoClick();
            toggleBtn.textContent = '⏸ Stop Auto-Click';
            toggleBtn.className = 'running';
            updateStatus('Running...', true);
        } else {
            stopAutoClick();
            toggleBtn.textContent = '▶ Start Auto-Click';
            toggleBtn.className = 'stopped';
            updateStatus('Stopped', false);
        }
    }

    // Update status
    function updateStatus(text, running) {
        document.getElementById('stim-status-text').textContent = text;
        const dot = document.getElementById('stim-status-dot');
        if (running) {
            dot.classList.add('running');
        } else {
            dot.classList.remove('running');
        }
    }

    // Reset statistics
    function resetStats() {
        CONFIG.clickCount = 0;
        CONFIG.startTime = null;
        updateStats();
        updateStatus('Stats Reset', false);
    }

    // Update statistics display
    function updateStats() {
        document.getElementById('stat-clicks').textContent = CONFIG.clickCount.toLocaleString();
        
        if (CONFIG.startTime && CONFIG.autoClickEnabled) {
            const runtime = Math.floor((Date.now() - CONFIG.startTime) / 1000);
            document.getElementById('stat-runtime').textContent = `${runtime}s`;
            
            const avgCps = runtime > 0 ? (CONFIG.clickCount / runtime).toFixed(1) : '0.0';
            document.getElementById('stat-avg-cps').textContent = avgCps;
        }
    }

    // Hook into Vue instance
    function tryHook() {
        const container = document.querySelector('.container');
        if (!container || !container.__vue__) return false;

        vueState = container.__vue__.stimulation === undefined
            ? container.__vue__.$children.find(child => child.stimulation !== undefined)
            : container.__vue__;

        if (!vueState || typeof vueState.addStimulation !== 'function') return false;

        const originalAddStim = vueState.addStimulation;

        vueState.addStimulation = function(amount) {
            return originalAddStim.call(this, amount * CONFIG.stimMultiplier);
        };

        console.log('[StimClick] Enhancement hooked successfully!');
        createUI();
        return true;
    }

    // Start auto-clicking
    function startAutoClick() {
        if (CONFIG.intervalId) clearInterval(CONFIG.intervalId);
        
        CONFIG.intervalId = setInterval(() => {
            if (vueState && typeof vueState.onMainClick === 'function') {
                vueState.onMainClick();
                CONFIG.clickCount++;
                
                if (CONFIG.clickCount % 10 === 0) {
                    updateStats();
                }
            }
        }, CONFIG.clickInterval);
        
        updateStats();
    }

    // Stop auto-clicking
    function stopAutoClick() {
        if (CONFIG.intervalId) {
            clearInterval(CONFIG.intervalId);
            CONFIG.intervalId = null;
        }
        updateStats();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                document.getElementById('stim-toggle-btn')?.click();
                break;
            case 'KeyR':
                if (e.ctrlKey) {
                    e.preventDefault();
                    document.getElementById('stim-reset')?.click();
                }
                break;
            case 'KeyC':
                document.getElementById('stim-single')?.click();
                break;
        }
    });

    // Initialize
    const waitVue = setInterval(() => {
        if (tryHook()) clearInterval(waitVue);
    }, 500);

})();
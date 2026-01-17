// ==UserScript==
// @name         NIGGA CLIENT +
// @description  debug mod for deadshot.io have fun
// @author       levifrsn63
// @match        *://*deadshot.io/*
// @license      Nigga University
// @run-at       document-start
// @version      2.67
// @namespace https://greasyfork.org/users/
// @downloadURL https://update.greasyfork.org/scripts/560838/NIGGA%20CLIENT%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/560838/NIGGA%20CLIENT%20%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================
    // DISABLE AUTO-FULLSCREEN
    // ====================================
    const blockFullscreen = () => {
        const wrap = (proto, prop) => {
            try {
                if (proto && proto[prop]) {
                    proto[prop] = function() {
                        console.log(`[Anti-Fullscreen] Blocked ${prop}`);
                        return Promise.reject(new Error('Fullscreen blocked by client'));
                    };
                }
            } catch (e) {}
        };
        wrap(Element.prototype, 'requestFullscreen');
        wrap(Element.prototype, 'webkitRequestFullscreen');
        wrap(Element.prototype, 'mozRequestFullScreen');
        wrap(Element.prototype, 'msRequestFullscreen');

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                try { document.exitFullscreen(); } catch (e) {}
            }
        }, true);
    };

    blockFullscreen();

    // ====================================
    // CONFIG & STATE
    // ====================================
    const defaultConfig = {
        espEnabled: true,
        showBoxes: true,
        showDistance: true,
        showTracers: true,
        espThickness: 2,
        espColor: "#3645B5",
        boxOpacity: 0.8,
        tracerOpacity: 0.4,
        wireframe: false,
        showCrosshair: true,
        crosshairColor: "#3645B5",
        crosshairSize: 6,
        rgbCrosshair: false,
        mobile: false,
        vertexThreshold: 300,
        menuVisible: true,
        targetInfoVisible: true,
        showPressH: true,
        menuScale: 1.0,
        x: 20,
        y: 20
    };

    let config = { ...defaultConfig };

    const saved = localStorage.getItem("esp_eclipse_config");
    if (saved) {
        try { config = { ...config, ...JSON.parse(saved) }; } catch (e) {}
    }

    function save() {
        localStorage.setItem("esp_eclipse_config", JSON.stringify(config));
    }

    const state = {
        targetID: -1,
        programCounter: 0,
        modelMatrices: [],
        vpMatrix: null,
        totalTargets: 0,
        canvas: null,
        autoFinder: {
            scanning: false,
            results: [],
            currentScanID: -50,
            filterIndex: 0,
            scanData: {}
        }
    };

    // ====================================
    // MOBILE SPOOF
    // ====================================
    if (config.mobile) {
        const userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
        Object.defineProperties(navigator, {
            userAgent: { get: () => userAgent },
            platform: { get: () => "iPhone" },
            maxTouchPoints: { get: () => 5 },
            vendor: { get: () => "Apple Computer, Inc." },
        });
        window.ontouchstart = () => {};
    }

    // ====================================
    // ECLIPSE UI SYSTEM
    // ====================================
    let leftPanel, contentArea, highlight, tabBar, arrow, clientText, featureList;
    let minimized = false;
    let activeTab = 'ESP';
    let selectedIndex = 0;

    const options = {
        ESP: [
            { label: 'ESP [E]', type: 'checkbox', key: 'espEnabled' },
            { label: 'Show Boxes', type: 'checkbox', key: 'showBoxes' },
            { label: 'Show Distance', type: 'checkbox', key: 'showDistance' },
            { label: 'Show Tracers', type: 'checkbox', key: 'showTracers' },
            { label: 'Wireframe [Q]', type: 'checkbox', key: 'wireframe' },
            { label: 'ESP Color', type: 'color', key: 'espColor' }
        ],
        Crosshair: [
            { label: 'Show Crosshair [O]', type: 'checkbox', key: 'showCrosshair' },
            { label: 'RGB Crosshair', type: 'checkbox', key: 'rgbCrosshair' },
            { label: 'Crosshair Color', type: 'color', key: 'crosshairColor' }
        ],
        Target: [
            {
                label: 'Auto vs Manual Info',
                type: 'custom',
                render: (row) => {
                    if (!config.targetInfoVisible) return;
                    Object.assign(row.style, {
                        background: 'rgba(54, 69, 181, 0.05)',
                        border: '1px solid rgba(54, 69, 181, 0.2)',
                        padding: '12px',
                        marginBottom: '15px',
                        fontSize: '11px',
                        position: 'relative',
                        display: 'block',
                        borderRadius: '4px'
                    });
                    const closeBtn = document.createElement('div');
                    closeBtn.textContent = '×';
                    Object.assign(closeBtn.style, {
                        position: 'absolute',
                        top: '4px',
                        right: '8px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#3645B5',
                        opacity: '0.6'
                    });
                    closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
                    closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.6';
                    closeBtn.onclick = (e) => {
                        e.stopPropagation();
                        config.targetInfoVisible = false;
                        save();
                        renderContent();
                    };
                    row.appendChild(closeBtn);
                    const text = document.createElement('div');
                    text.innerHTML = '<b style="color:#3645B5">PRO TIP:</b> Use <b style="color:#ddd">Auto-Finder</b> for zero misses. Tweak ID with <b style="color:#ddd">Arrow Keys</b> (<b style="color:#ddd">↑↓</b> for Auto, <b style="color:#ddd">←→</b> for Manual) until enemies turn <b style="color:#ff4444">red</b>.';
                    text.style.color = '#888';
                    text.style.lineHeight = '1.4';
                    row.appendChild(text);
                }
            },
            {
                label: 'Status',
                type: 'custom',
                render: (row) => {
                    Object.assign(row.style, {
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 6px',
                        borderBottom: '1px solid #333',
                        marginBottom: '10px'
                    });
                    row.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:2px">
                            <span style="color:#555; font-size:10px; text-transform:uppercase">Target ID</span>
                            <span style="color:#ddd; font-weight:bold">${state.targetID}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:2px; text-align:right">
                            <span style="color:#555; font-size:10px; text-transform:uppercase">Active</span>
                            <span style="color:#3645B5; font-weight:bold">${state.totalTargets}</span>
                        </div>
                    `;
                }
            },
            {
                label: 'Manual Control',
                type: 'custom',
                render: (row) => {
                    Object.assign(row.style, {
                        display: 'flex',
                        gap: '2px',
                        marginBottom: '15px'
                    });
                    const btnStyle = {
                        flex: '1',
                        background: '#232323',
                        border: '1px solid #3a3a3a',
                        color: '#888',
                        padding: '6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontSize: '11px',
                        borderRadius: '2px'
                    };
                    const prev = document.createElement('div');
                    prev.textContent = 'PREV';
                    Object.assign(prev.style, btnStyle);
                    prev.onclick = () => { state.targetID--; updateID(); renderContent(); };

                    const next = document.createElement('div');
                    next.textContent = 'NEXT';
                    Object.assign(next.style, btnStyle);
                    next.onclick = () => { state.targetID++; updateID(); renderContent(); };

                    [prev, next].forEach(b => {
                        b.onmouseenter = () => { b.style.background = '#2a2a2a'; b.style.color = '#ddd'; };
                        b.onmouseleave = () => { b.style.background = '#232323'; b.style.color = '#888'; };
                    });

                    row.appendChild(prev);
                    row.appendChild(next);
                }
            },
            { label: 'Auto Nigga Finder', type: 'header' },
            {
                label: 'Scan Controls',
                type: 'custom',
                render: (row) => {
                    Object.assign(row.style, {
                        display: 'flex',
                        gap: '2px',
                        marginBottom: '10px'
                    });
                    const start = document.createElement('div');
                    start.textContent = state.autoFinder.scanning ? 'SCANNING...' : 'START SCAN';
                    Object.assign(start.style, {
                        flex: '2',
                        background: state.autoFinder.scanning ? '#3645B5' : '#232323',
                        border: '1px solid #3a3a3a',
                        color: state.autoFinder.scanning ? '#fff' : '#888',
                        padding: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        borderRadius: '2px'
                    });
                    start.onclick = state.autoFinder.scanning ? stopAutoScan : startAutoScan;

                    row.appendChild(start);
                }
            },
            { label: 'Scan Results', type: 'scanResults' }
        ],
        Settings: [
            { label: 'Mobile Mode [M]', type: 'checkbox', key: 'mobile' },
            { label: 'ESP Thickness', type: 'slider', key: 'espThickness', min: 1, max: 5, step: 0.5 },
            { label: 'Box Opacity', type: 'slider', key: 'boxOpacity', min: 0, max: 100, step: 5, scale: 0.01 },
            { label: 'Tracer Opacity', type: 'slider', key: 'tracerOpacity', min: 0, max: 100, step: 5, scale: 0.01 },
            { label: 'Crosshair Size', type: 'slider', key: 'crosshairSize', min: 1, max: 20, step: 1 },
            { label: 'Vertex Threshold', type: 'slider', key: 'vertexThreshold', min: 10, max: 15000, step: 10 }
        ]
    };

    // ====================================
    // AUTO-FINDER FUNCTIONS
    // ====================================
    let scanInterval = null;
    let scanFrameCount = 0;

    function startAutoScan() {
        if (state.autoFinder.scanning) return;

        state.autoFinder.scanning = true;
        state.autoFinder.results = [];
        state.autoFinder.currentScanID = -50;
        state.autoFinder.scanData = {};
        state.autoFinder.filterIndex = 0;
        scanFrameCount = 0;

        console.log('[Auto-Finder] Starting scan from -50 to +50...');

        scanInterval = setInterval(() => {
            if (state.autoFinder.currentScanID > 50) {
                stopAutoScan();
                processResults();
                return;
            }

            state.targetID = state.autoFinder.currentScanID;

            scanFrameCount++;

            if (scanFrameCount >= 2) {
                if (state.totalTargets > 0) {
                    if (!state.autoFinder.scanData[state.targetID]) {
                        state.autoFinder.scanData[state.targetID] = [];
                    }
                    state.autoFinder.scanData[state.targetID].push(state.totalTargets);
                }

                state.autoFinder.currentScanID++;
                scanFrameCount = 0;
            }

            updateID();
            renderContent();
        }, 30);
    }

    function stopAutoScan() {
        if (scanInterval) {
            clearInterval(scanInterval);
            scanInterval = null;
        }
        state.autoFinder.scanning = false;
        console.log('[Auto-Finder] Scan stopped.');
        renderContent();
    }

    function processResults() {
        state.autoFinder.results = [];

        for (let id in state.autoFinder.scanData) {
            const samples = state.autoFinder.scanData[id];
            const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
            const max = Math.max(...samples);

            if (avg > 0) {
                state.autoFinder.results.push({
                    id: parseInt(id),
                    avgTargets: avg,
                    maxTargets: max,
                    samples: samples.length
                });
            }
        }

        state.autoFinder.results.sort((a, b) => b.avgTargets - a.avgTargets);

        console.log('[Auto-Finder] Scan complete! Found', state.autoFinder.results.length, 'IDs with targets');
        console.log('[Auto-Finder] Results:', state.autoFinder.results);

        if (state.autoFinder.results.length > 0) {
            state.targetID = state.autoFinder.results[0].id;
            updateID();
        }

        renderContent();
    }

    function getBestGuess() {
        if (state.autoFinder.results.length === 0) return 'N/A';

        const best = state.autoFinder.results[0];
        return `ID ${best.id} (${best.avgTargets.toFixed(1)} avg)`;
    }

    function selectScanResult(index) {
        if (index >= 0 && index < state.autoFinder.results.length) {
            state.autoFinder.filterIndex = index;
            state.targetID = state.autoFinder.results[index].id;
            updateID();
            renderContent();
        }
    }

    function createUI() {
        if (document.getElementById('esp-eclipse-ui')) return;

        leftPanel = document.createElement('div');
        leftPanel.id = 'esp-eclipse-ui';
        Object.assign(leftPanel.style, {
            position: 'fixed',
            top: config.y + 'px',
            left: config.x + 'px',
            width: (320 * config.menuScale) + 'px',
            background: '#2b2b2b',
            color: '#f1f1f1',
            fontFamily: 'Consolas, "Courier New", monospace',
            zIndex: 99999,
            border: '1px solid #3a3a3a',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            padding: '0px',
            userSelect: 'none',
            transition: 'width 0.2s ease, transform 0.1s ease',
            display: config.menuVisible ? 'block' : 'none',
            transform: `scale(${config.menuScale})`,
            transformOrigin: 'top left'
        });
        document.body.appendChild(leftPanel);

        clientText = document.createElement('div');
        clientText.textContent = 'ninja client';
        Object.assign(clientText.style, {
            position: 'absolute',
            bottom: '-25px',
            left: '0px',
            color: '#888',
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: '15px',
            fontStyle: 'italic',
            userSelect: 'none',
            transition: 'opacity 0.2s ease',
            opacity: config.menuVisible ? '1' : '0',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
        });
        leftPanel.appendChild(clientText);

        arrow = document.createElement('div');
        arrow.textContent = '◀';
        Object.assign(arrow.style, {
            position: 'absolute',
            bottom: '-25px',
            left: '85px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            userSelect: 'none',
            color: '#888',
            padding: '2px 4px',
            transition: 'left 0.2s ease',
            fontFamily: 'Consolas, "Courier New", monospace'
        });

        arrow.addEventListener('mouseenter', () => arrow.style.color = '#aaa');
        arrow.addEventListener('mouseleave', () => arrow.style.color = '#888');
        arrow.addEventListener('click', () => {
            minimized = !minimized;
            config.menuVisible = !minimized;
            leftPanel.style.width = minimized ? '30px' : '320px';
            arrow.style.left = minimized ? '35px' : '85px';
            arrow.textContent = minimized ? '⚙' : '◀';
            arrow.style.fontSize = minimized ? '16px' : '14px';
            contentArea.style.display = minimized ? 'none' : 'block';
            tabBar.style.display = minimized ? 'none' : 'flex';
            clientText.style.opacity = minimized ? '0' : '1';
            save();
        });
        leftPanel.appendChild(arrow);

        tabBar = document.createElement('div');
        Object.assign(tabBar.style, {
            display: 'flex',
            borderBottom: '1px solid #3a3a3a',
            background: '#232323',
            height: '35px',
            boxSizing: 'border-box'
        });
        leftPanel.appendChild(tabBar);

        const tabs = ['ESP', 'Crosshair', 'Target', 'Settings'];

        tabs.forEach(name => {
            const btn = document.createElement('div');
            btn.textContent = name;
            Object.assign(btn.style, {
                flex: '1',
                padding: '8px 0',
                textAlign: 'center',
                cursor: 'pointer',
                background: name === activeTab ? '#2b2b2b' : '#232323',
                borderRight: '1px solid #3a3a3a',
                fontSize: '12px',
                fontWeight: '500',
                color: name === activeTab ? '#ddd' : '#888'
            });
            btn.addEventListener('mouseenter', () => {
                if (name !== activeTab) btn.style.color = '#aaa';
            });
            btn.addEventListener('mouseleave', () => {
                if (name !== activeTab) btn.style.color = '#888';
            });
            btn.addEventListener('click', () => {
                activeTab = name;
                renderContent();
                updateTabStyles();
            });
            tabBar.appendChild(btn);

            function updateTabStyles() {
                Array.from(tabBar.children).forEach(c => {
                    const isActive = c.textContent === activeTab;
                    c.style.background = isActive ? '#2b2b2b' : '#232323';
                    c.style.color = isActive ? '#ddd' : '#888';
                });
            }
        });

        contentArea = document.createElement('div');
        Object.assign(contentArea.style, {
            padding: '10px',
            fontSize: '12px',
            lineHeight: '1.4',
            background: '#2b2b2b',
            position: 'relative',
            overflow: 'hidden',
            maxHeight: '500px',
            overflowY: 'auto'
        });
        leftPanel.appendChild(contentArea);

        highlight = document.createElement('div');
        Object.assign(highlight.style, {
            position: 'absolute',
            left: '6px',
            width: 'calc(100% - 12px)',
            height: '28px',
            background: 'rgba(54, 69, 181, 0.2)',
            transition: 'top 0.2s ease',
            pointerEvents: 'none'
        });
        contentArea.appendChild(highlight);

        const rightPanel = document.createElement('div');
        Object.assign(rightPanel.style, {
            position: 'fixed',
            top: config.y + 'px',
            right: '20px',
            width: '180px',
            color: '#f1f1f1',
            fontFamily: 'Consolas, "Courier New", monospace',
            zIndex: 99999,
            padding: '0',
            display: config.menuVisible ? 'block' : 'none'
        });
        document.body.appendChild(rightPanel);

        featureList = document.createElement('div');
        Object.assign(featureList.style, {
            padding: '0',
            textAlign: 'right'
        });
        rightPanel.appendChild(featureList);

        renderContent();
        updateRightPanel();
        updateHHint();
        makeDraggable();
        makeResizable();
    }

    function makeResizable() {
        const handle = document.createElement('div');
        Object.assign(handle.style, {
            position: 'absolute',
            right: '0',
            bottom: '0',
            width: '15px',
            height: '15px',
            cursor: 'nwse-resize',
            background: 'linear-gradient(135deg, transparent 50%, #3645B5 50%)',
            zIndex: 100000
        });
        leftPanel.appendChild(handle);

        let startX, startScale;

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startX = e.clientX;
            startScale = config.menuScale;

            const onMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                // Fine control: 320px base width means deltaX / 320 is the scale change
                const newScale = Math.max(0.5, Math.min(2.5, startScale + (deltaX / 320)));
                config.menuScale = newScale;
                leftPanel.style.transform = `scale(${config.menuScale})`;
                leftPanel.style.width = (320 * config.menuScale) + 'px';
            };

            const onMouseUp = () => {
                save();
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };

            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
    }

    let hHint;
    function updateHHint() {
        if (!config.showPressH) {
            if (hHint) hHint.remove();
            return;
        }
        if (!hHint) {
            hHint = document.createElement('div');
            Object.assign(hHint.style, {
                position: 'fixed',
                bottom: '10px',
                left: '20px',
                background: '#2b2b2b',
                color: '#888',
                padding: '5px 10px',
                fontSize: '12px',
                fontFamily: 'Consolas, monospace',
                border: '1px solid #3a3a3a',
                zIndex: 99998,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            });
            document.body.appendChild(hHint);
        }
        hHint.innerHTML = 'PRESS H TO HIDE UI <span style="cursor:pointer;color:#3645B5;font-weight:bold;font-size:14px;" onclick="window.closeHHint()">×</span>';
        window.closeHHint = () => {
            config.showPressH = false;
            save();
            hHint.remove();
        };
    }

    function renderContent() {
        contentArea.innerHTML = '';
        contentArea.appendChild(highlight);

        const currentOptions = options[activeTab];

        currentOptions.forEach((opt, i) => {
            const row = document.createElement('div');

            if (opt.type === 'divider') {
                Object.assign(row.style, {
                    height: '1px',
                    background: '#3a3a3a',
                    margin: '8px 0',
                    pointerEvents: 'none'
                });
                contentArea.appendChild(row);
                return;
            }

            if (opt.type === 'header') {
                Object.assign(row.style, {
                    marginTop: '8px',
                    marginBottom: '4px',
                    padding: '4px 6px',
                    color: '#3645B5',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    pointerEvents: 'none'
                });
                row.textContent = opt.label;
                contentArea.appendChild(row);
                return;
            }

            if (opt.type === 'scanResults') {
                if (state.autoFinder.results.length === 0) {
                    Object.assign(row.style, {
                        padding: '4px 6px',
                        color: '#666',
                        fontSize: '11px',
                        fontStyle: 'italic'
                    });
                    row.textContent = 'No results yet. Start a scan.';
                    contentArea.appendChild(row);
                    return;
                }

                const resultsContainer = document.createElement('div');
                Object.assign(resultsContainer.style, {
                    maxHeight: '150px',
                    overflowY: 'auto',
                    border: '1px solid #3a3a3a',
                    padding: '4px',
                    background: '#232323',
                    marginTop: '4px'
                });

                state.autoFinder.results.forEach((result, idx) => {
                    const resultRow = document.createElement('div');
                    const isSelected = idx === state.autoFinder.filterIndex;

                    Object.assign(resultRow.style, {
                        padding: '4px 6px',
                        cursor: 'pointer',
                        background: isSelected ? '#3645B5' : 'transparent',
                        color: isSelected ? '#fff' : '#ddd',
                        fontSize: '11px',
                        marginBottom: '2px',
                        borderRadius: '2px',
                        transition: 'background 0.2s ease'
                    });

                    resultRow.innerHTML = `
                        <span style="color: ${isSelected ? '#fff' : '#3645B5'}; font-weight: bold;">ID ${result.id}</span> -
                        Avg: ${result.avgTargets.toFixed(1)} |
                        Max: ${result.maxTargets}
                    `;

                    resultRow.addEventListener('mouseenter', () => {
                        if (!isSelected) resultRow.style.background = '#333';
                    });
                    resultRow.addEventListener('mouseleave', () => {
                        if (!isSelected) resultRow.style.background = 'transparent';
                    });
                    resultRow.addEventListener('click', () => selectScanResult(idx));

                    resultsContainer.appendChild(resultRow);
                });

                row.appendChild(resultsContainer);
                contentArea.appendChild(row);
                return;
            }

            if (opt.type === 'custom') {
                opt.render(row);
                contentArea.appendChild(row);
                return;
            }

            Object.assign(row.style, {
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                padding: '4px 6px',
                position: 'relative',
                cursor: opt.type !== 'info' ? 'pointer' : 'default',
                minHeight: '28px',
                borderLeft: '2px solid transparent',
                paddingLeft: '8px',
                transition: 'border-left 0.2s ease'
            });

            if (opt.type === 'checkbox') {
                const isChecked = config[opt.key];

                if (isChecked) {
                    row.style.borderLeft = '2px solid #A5ACE4';
                }

                const checkbox = document.createElement('div');
                Object.assign(checkbox.style, {
                    width: '12px',
                    height: '12px',
                    border: '1px solid #666',
                    marginRight: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isChecked ? '#3645B5' : 'transparent',
                    flexShrink: '0'
                });

                if (isChecked) {
                    const check = document.createElement('span');
                    check.textContent = '✓';
                    Object.assign(check.style, {
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 'bold'
                    });
                    checkbox.appendChild(check);
                }

                row.appendChild(checkbox);

                const label = document.createElement('span');
                label.textContent = opt.label;
                Object.assign(label.style, {
                    color: isChecked ? '#A5ACE4' : '#ddd',
                    fontSize: '12px',
                    fontWeight: isChecked ? 'bold' : 'normal',
                    transition: 'color 0.2s ease, font-weight 0.2s ease'
                });
                row.appendChild(label);

                row.addEventListener('click', () => {
                    config[opt.key] = !config[opt.key];
                    save();

                    if (opt.key === 'showCrosshair' || opt.key === 'rgbCrosshair' || opt.key === 'crosshairColor') {
                        updateCrosshairVisibility();
                    }

                    if (opt.key === 'mobile') {
                        if (confirm('Reload page to apply mobile mode?')) location.reload();
                    }

                    renderContent();
                    updateRightPanel();
                });
            }
            else if (opt.type === 'slider') {
                const label = document.createElement('span');
                label.textContent = opt.label;
                Object.assign(label.style, {
                    color: '#ddd',
                    fontSize: '12px'
                });
                row.appendChild(label);

                const sliderContainer = document.createElement('div');
                Object.assign(sliderContainer.style, {
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                });

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = opt.min;
                slider.max = opt.max;
                slider.step = opt.step || 1;
                const scale = opt.scale || 1;
                slider.value = config[opt.key] / scale;
                Object.assign(slider.style, {
                    width: '80px',
                    height: '6px',
                    webkitAppearance: 'none',
                    appearance: 'none',
                    background: '#3a3a3a',
                    outline: 'none',
                    borderRadius: '0px',
                    cursor: 'pointer',
                    border: 'none'
                });

                if (!document.getElementById('slider-styles')) {
                    const style = document.createElement('style');
                    style.id = 'slider-styles';
                    style.innerHTML = `
                        input[type=range]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 14px;
                            height: 14px;
                            background: #3645B5;
                            cursor: pointer;
                            border-radius: 0px;
                            border: 1px solid #1a1a1a;
                            box-shadow: inset 1px 1px 0px rgba(255,255,255,0.2);
                        }
                        input[type=range]::-moz-range-thumb {
                            width: 14px;
                            height: 14px;
                            background: #3645B5;
                            cursor: pointer;
                            border-radius: 0px;
                            border: 1px solid #1a1a1a;
                            box-shadow: inset 1px 1px 0px rgba(255,255,255,0.2);
                        }
                    `;
                    document.head.appendChild(style);
                }

                const valueLabel = document.createElement('span');
                valueLabel.textContent = Math.round(config[opt.key] * 100) / 100;
                Object.assign(valueLabel.style, {
                    minWidth: '30px',
                    fontSize: '11px',
                    color: '#aaa'
                });

                slider.addEventListener('input', () => {
                    config[opt.key] = parseFloat(slider.value) * scale;
                    valueLabel.textContent = Math.round(config[opt.key] * 100) / 100;
                    save();

                    if (opt.key === 'crosshairSize') {
                        updateCrosshairVisibility();
                    }
                    if (opt.key === 'menuScale') {
                        if (leftPanel) {
                            leftPanel.style.transform = `scale(${config.menuScale})`;
                            leftPanel.style.width = (320 * config.menuScale) + 'px';
                        }
                    }
                });

                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(valueLabel);
                row.appendChild(sliderContainer);
            }
            else if (opt.type === 'color') {
                const label = document.createElement('span');
                label.textContent = opt.label;
                Object.assign(label.style, {
                    color: '#ddd',
                    fontSize: '12px'
                });
                row.appendChild(label);

                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = config[opt.key];
                Object.assign(colorInput.style, {
                    marginLeft: 'auto',
                    border: 'none',
                    width: '30px',
                    height: '20px',
                    background: 'none',
                    cursor: 'pointer'
                });
                colorInput.addEventListener('change', () => {
                    config[opt.key] = colorInput.value;
                    save();

                    if (opt.key === 'crosshairColor') {
                        updateCrosshairVisibility();
                    }
                });
                row.appendChild(colorInput);
            }
            else if (opt.type === 'button') {
                const btn = document.createElement('button');
                btn.textContent = opt.label;
                Object.assign(btn.style, {
                    width: '100%',
                    padding: '6px',
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                });
                btn.addEventListener('mouseenter', () => btn.style.background = '#444');
                btn.addEventListener('mouseleave', () => btn.style.background = '#333');
                btn.addEventListener('click', opt.action);
                row.appendChild(btn);
            }
            else if (opt.type === 'info') {
                const label = document.createElement('span');
                label.textContent = opt.label;
                Object.assign(label.style, {
                    color: '#888',
                    fontSize: '12px'
                });
                row.appendChild(label);

                const value = document.createElement('span');
                value.textContent = opt.getter();
                Object.assign(value.style, {
                    marginLeft: 'auto',
                    color: '#3645B5',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace'
                });
                row.appendChild(value);

                if (opt.label === 'Active Targets') {
                    row.dataset.targetCount = 'true';
                } else if (opt.label === 'Target ID') {
                    row.dataset.targetId = 'true';
                } else if (opt.label === 'Scan Status') {
                    row.dataset.scanStatus = 'true';
                } else if (opt.label === 'Best Guess') {
                    row.dataset.bestGuess = 'true';
                }
            }

            row.addEventListener('mouseenter', () => {
                selectedIndex = i;
                moveHighlight();
            });

            contentArea.appendChild(row);
        });

        selectedIndex = 0;
        moveHighlight();
    }

    function moveHighlight() {
        const rows = Array.from(contentArea.children).filter(c => c !== highlight);
        if (rows[selectedIndex]) {
            highlight.style.top = rows[selectedIndex].offsetTop + 'px';
            highlight.style.height = rows[selectedIndex].offsetHeight + 'px';
        }
    }

    function updateRightPanel() {
        const activeFeatures = [];

        Object.entries(options).forEach(([tab, opts]) => {
            opts.forEach(opt => {
                if (opt.type === 'checkbox' && config[opt.key]) {
                    activeFeatures.push(opt.label.replace(/\s*\[.*?\]\s*/g, ''));
                }
            });
        });

        const existingItems = Array.from(featureList.children);
        const existingLabels = existingItems.map(item => item.textContent);

        existingItems.forEach(item => {
            if (!activeFeatures.includes(item.textContent)) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    if (item.parentNode) item.remove();
                }, 300);
            }
        });

        activeFeatures.forEach(feature => {
            if (!existingLabels.includes(feature)) {
                const item = document.createElement('div');
                Object.assign(item.style, {
                    padding: '2px 0',
                    marginBottom: '1px',
                    color: '#3645B5',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: '0',
                    transform: 'translateY(-10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease'
                });

                item.textContent = feature;

                if (featureList.firstChild) {
                    featureList.insertBefore(item, featureList.firstChild);
                } else {
                    featureList.appendChild(item);
                }

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            }
        });
    }

    function makeDraggable() {
        let isDragging = false;
        let offsetX, offsetY;

        const startDrag = (e) => {
            isDragging = true;
            offsetX = e.clientX - leftPanel.offsetLeft;
            offsetY = e.clientY - leftPanel.offsetTop;
            e.preventDefault();
        };

        tabBar.addEventListener('mousedown', startDrag);

        leftPanel.addEventListener('mousedown', (e) => {
            if (minimized && e.target === leftPanel) {
                startDrag(e);
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                leftPanel.style.left = x + 'px';
                leftPanel.style.top = y + 'px';
                config.x = x;
                config.y = y;
                save();
            }
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function updateID() {
        state.modelMatrices = [];
        const idRow = contentArea.querySelector('[data-target-id]');
        if (idRow) {
            const valueSpan = idRow.querySelector('span:last-child');
            if (valueSpan) valueSpan.textContent = state.targetID;
        }
    }

    // ====================================
    // CROSSHAIR SYSTEM
    // ====================================
    const createCrosshair = () => {
        const dot = document.createElement("div");
        dot.id = "esp-crosshair-dot";
        dot.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            width: ${config.crosshairSize}px;
            height: ${config.crosshairSize}px;
            border-radius: 50%;
            z-index: 1000000;
            transform: translate(-50%, -50%);
            background: ${config.rgbCrosshair ? "none" : config.crosshairColor};
            animation: ${config.rgbCrosshair ? "rgbRotate 3s linear infinite" : "none"};
            pointer-events: none;
        `;

        if (!document.querySelector("#rgb-crosshair-style")) {
            const style = document.createElement("style");
            style.id = "rgb-crosshair-style";
            style.textContent = `
                @keyframes rgbRotate {
                    0% { background: #ff0000; }
                    17% { background: #ffff00; }
                    33% { background: #00ff00; }
                    50% { background: #00ffff; }
                    66% { background: #0000ff; }
                    83% { background: #ff00ff; }
                    100% { background: #ff0000; }
                }
            `;
            document.head.appendChild(style);
        }

        return dot;
    };

    const crosshairElement = createCrosshair();

    const updateCrosshairVisibility = () => {
        const exists = document.getElementById("esp-crosshair-dot");
        if (config.showCrosshair && !exists) {
            document.body.appendChild(crosshairElement);
        } else if (!config.showCrosshair && exists) {
            crosshairElement.remove();
        }

        if (exists) {
            exists.style.width = config.crosshairSize + 'px';
            exists.style.height = config.crosshairSize + 'px';
            exists.style.background = config.rgbCrosshair ? "none" : config.crosshairColor;
            exists.style.animation = config.rgbCrosshair ? "rgbRotate 3s linear infinite" : "none";
        }
    };

    // ====================================
    // KEYBOARD CONTROLS
    // ====================================
    window.addEventListener('keydown', (e) => {
        if (document.activeElement?.tagName === 'INPUT') return;

        if (e.code === 'Insert' || e.code === 'Delete' || e.code === 'KeyP') {
            config.menuVisible = !config.menuVisible;
            leftPanel.style.display = config.menuVisible ? 'block' : 'none';
            const rightPanel = document.querySelector('[style*="right: 20px"]');
            if (rightPanel) rightPanel.style.display = config.menuVisible ? 'block' : 'none';
            clientText.style.opacity = config.menuVisible ? '1' : '0';
            save();
            e.preventDefault();
            e.stopPropagation();
        }
        if (e.code === 'ArrowRight') { state.targetID++; updateID(); }
        if (e.code === 'ArrowLeft') { state.targetID--; updateID(); }
        if (e.code === 'KeyE') {
            config.espEnabled = !config.espEnabled;
            save();
            renderContent();
            updateRightPanel();
        }
        if (e.code === 'KeyQ') {
            config.wireframe = !config.wireframe;
            save();
            renderContent();
            updateRightPanel();
        }
        if (e.code === 'KeyO') {
            config.showCrosshair = !config.showCrosshair;
            save();
            renderContent();
            updateRightPanel();
            updateCrosshairVisibility();
        }
        if (e.code === 'KeyM') {
            config.mobile = !config.mobile;
            save();
            if(confirm('Reload page to apply mobile mode?')) location.reload();
        }
    }, true);

    // ====================================
    // WEBGL HOOKS
    // ====================================
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const proxyCache = new WeakMap();
    const programMap = new WeakMap();

    const WebGL = WebGL2RenderingContext.prototype;

    HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
        apply(target, thisArgs, args) {
            if (args[1]) {
                args[1].preserveDrawingBuffer = false;
            }
            const ctx = Reflect.apply(target, thisArgs, args);

            if (!ctx || (args[0] !== 'webgl' && args[0] !== 'webgl2')) return ctx;
            if (proxyCache.has(ctx)) return proxyCache.get(ctx);

        const handler = {
            get(target, prop) {
                const val = target[prop];
                if (typeof val === 'function') {
                    if (prop === 'uniformMatrix4fv') {
                        return function(location, transpose, value) {
                            if (value && value.length === 16) {
                                // Optimized: Extract matrices immediately and only keep what's needed for the current frame
                                if (Math.abs(value[11] + 1) < 0.1 && Math.abs(value[15]) < 0.1) {
                                    state.vpMatrix = new Float32Array(value);
                                    // Trigger render immediately on camera update for lowest possible latency
                                    if (state.canvas) render(state.canvas);
                                }
                                const gl = target;
                                const pid = programMap.get(gl.getParameter(gl.CURRENT_PROGRAM));
                                if (pid === state.targetID) {
                                    if (Math.abs(value[3]) < 1e-6 &&
                                        Math.abs(value[7]) < 1e-6 &&
                                        Math.abs(value[15] - 1) < 1e-6) {
                                        state.modelMatrices.push(new Float32Array(value));
                                    }
                                }
                            }
                            return val.apply(target, arguments);
                        }
                    }
                        if (prop === 'useProgram') {
                            return function(program) {
                                if (program && !programMap.has(program)) programMap.set(program, state.programCounter++);
                                return val.apply(target, arguments);
                            }
                        }
                        if (prop === 'drawElements') {
                            return function(mode, count, type, offset) {
                                const gl = target;
                                const program = gl.getParameter(gl.CURRENT_PROGRAM);
                                const pid = programMap.get(program);

                                const originalMode = mode;
                                if (config.wireframe && !program.isUIProgram && count > config.vertexThreshold) {
                                    mode = gl.LINES;
                                }

                                if (config.espEnabled && pid === state.targetID) gl.disable(gl.DEPTH_TEST);

                                try {
                                    const res = val.apply(target, [mode, count, type, offset]);
                                    if (config.espEnabled && pid === state.targetID) gl.enable(gl.DEPTH_TEST);
                                    return res;
                                } catch (error) {
                                    console.error('Drawing elements failed:', error);
                                    if (config.espEnabled && pid === state.targetID) gl.enable(gl.DEPTH_TEST);
                                }
                            }
                        }
                        if (prop === 'drawElementsInstanced') {
                            return function(mode, count, type, offset, instanceCount) {
                                const gl = target;
                                const program = gl.getParameter(gl.CURRENT_PROGRAM);

                                if (config.wireframe && !program.isUIProgram && count > config.vertexThreshold) {
                                    mode = gl.LINES;
                                }

                                try {
                                    return val.apply(target, [mode, count, type, offset, instanceCount]);
                                } catch (error) {
                                    console.error('Drawing instanced elements failed:', error);
                                }
                            }
                        }
                        return val.bind(target);
                    }
                    return val;
                }
            };
            const proxied = new Proxy(ctx, handler);
            proxyCache.set(ctx, proxied);
            return proxied;
        }
    });

    // ====================================
    // ESP CANVAS & RENDERING
    // ====================================
    function setupCanvas() {
        const canvas = document.createElement('canvas');
        state.canvas = canvas;
        canvas.id = 'esp-overlay-canvas';
        canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483645;pointer-events:none;";
        document.documentElement.appendChild(canvas);

        function updateCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();

        function loop() {
            // Only render if we have new matrices to avoid flickering or redundant work
            // But keep the loop for general updates
            requestAnimationFrame(loop);
        }
        loop();

        setInterval(() => {
            createUI();
            updateCrosshairVisibility();

            const statusRow = contentArea?.querySelector('[data-scan-status]');
            if (statusRow) {
                const valueSpan = statusRow.querySelector('span:last-child');
                if (valueSpan) valueSpan.textContent = state.autoFinder.scanning ? 'Scanning...' : 'Idle';
            }

            const guessRow = contentArea?.querySelector('[data-best-guess]');
            if (guessRow) {
                const valueSpan = guessRow.querySelector('span:last-child');
                if (valueSpan) valueSpan.textContent = getBestGuess();
            }
        }, 2000);
    }

    function render(canvas) {
        const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        if (state.modelMatrices.length === 0 || !state.vpMatrix) {
            state.totalTargets = 0;
            return;
        }

        const vp = state.vpMatrix;
        state.totalTargets = 0;

        const processedPositions = [];
        const MIN_DISTANCE = 0.5;

        // Optimized: pre-calculated values for stroke/fill to avoid repeated string concatenation
        const boxStrokeStyle = config.espColor + Math.round(config.boxOpacity * 255).toString(16).padStart(2, '0');
        const tracerStrokeStyle = config.espColor + Math.round(config.tracerOpacity * 255).toString(16).padStart(2, '0');

        for (let i = 0; i < state.modelMatrices.length; i++) {
            const mat = state.modelMatrices[i];
            const wx = mat[12], wy = mat[13], wz = mat[14];

            let isDuplicate = false;
            // Limit duplicate check to speed up processing
            const checkLimit = Math.min(processedPositions.length, 15);
            for (let j = 0; j < checkLimit; j++) {
                const pos = processedPositions[j];
                const dx = wx - pos.x;
                const dy = wy - pos.y;
                const dz = wz - pos.z;
                const distSq = dx*dx + dy*dy + dz*dz;
                if (distSq < MIN_DISTANCE * MIN_DISTANCE) {
                    isDuplicate = true;
                    break;
                }
            }
            if (isDuplicate) continue;

            if (processedPositions.length < 20) {
                processedPositions.push({x: wx, y: wy, z: wz});
            }

            const head = project(vp, wx, wy + 2.15, wz, w, h);
            const foot = project(vp, wx, wy, wz, w, h);

            if (!head || !foot) continue;
            const boxH = foot.y - head.y;
            const boxW = boxH * 0.6;

            if (boxH < 30 || boxH > 400 || boxW < 15 || boxW > 250) continue;

            const aspectRatio = boxW / boxH;
            if (aspectRatio < 0.3 || aspectRatio > 1.0) continue;

            if (head.x < -100 || head.x > w + 100 || head.y < -100 || head.y > h + 100) continue;

            state.totalTargets++;

            if (config.espEnabled) {
                if (config.showBoxes) {
                    ctx.strokeStyle = boxStrokeStyle;
                    ctx.lineWidth = config.espThickness;
                    ctx.strokeRect(head.x - boxW/2, head.y, boxW, boxH);
                }

                if (config.showDistance) {
                    const dist3D = Math.sqrt(wx*wx + wy*wy + wz*wz);
                    ctx.font = 'bold 12px monospace';
                    ctx.fillStyle = config.espColor;
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.strokeText(`${Math.round(dist3D)}m`, head.x - 15, head.y - 8);
                    ctx.fillText(`${Math.round(dist3D)}m`, head.x - 15, head.y - 8);
                }

                if (config.showTracers) {
                    ctx.beginPath();
                    ctx.moveTo(cx, h);
                    ctx.lineTo(foot.x, foot.y);
                    ctx.strokeStyle = tracerStrokeStyle;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
        }

        const countRow = contentArea?.querySelector('[data-target-count]');
        if (countRow) {
            const valueSpan = countRow.querySelector('span:last-child');
            if (valueSpan) valueSpan.textContent = state.totalTargets;
        }

        state.modelMatrices.length = 0;
    }

    function project(vp, x, y, z, w, h) {
        const X = x*vp[0] + y*vp[4] + z*vp[8] + vp[12];
        const Y = x*vp[1] + y*vp[5] + z*vp[9] + vp[13];
        const W = x*vp[3] + y*vp[7] + z*vp[11] + vp[15];
        if (W < 0.1) return null;
        return { x: (X/W + 1) * w * 0.5, y: (-Y/W + 1) * h * 0.5, w: W };
    }

    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'y') {
            if (confirm('Wipe all stored data for mod? This will reset all settings and reload the page.')) {
                localStorage.removeItem("esp_eclipse_config");
                location.reload();
            }
        }
        if (e.key.toLowerCase() === 'h') {
            minimized = !minimized;
            config.menuVisible = !minimized;
            leftPanel.style.width = minimized ? '30px' : '320px';
            arrow.style.left = minimized ? '35px' : '85px';
            arrow.textContent = minimized ? '⚙' : '◀';
            arrow.style.fontSize = minimized ? '16px' : '14px';
            contentArea.style.display = minimized ? 'none' : 'block';
            tabBar.style.display = minimized ? 'none' : 'flex';
            clientText.style.opacity = minimized ? '0' : '1';
            save();
        }
        if (e.key === 'ArrowLeft') {
            state.targetID--;
            updateID();
            renderContent();
        }
        if (e.key === 'ArrowRight') {
            state.targetID++;
            updateID();
            renderContent();
        }
        if (e.key === 'ArrowUp') {
            if (state.autoFinder.results.length > 0) {
                let nextIdx = state.autoFinder.filterIndex - 1;
                if (nextIdx < 0) nextIdx = state.autoFinder.results.length - 1;
                selectScanResult(nextIdx);
            }
        }
        if (e.key === 'ArrowDown') {
            if (state.autoFinder.results.length > 0) {
                let nextIdx = state.autoFinder.filterIndex + 1;
                if (nextIdx >= state.autoFinder.results.length) nextIdx = 0;
                selectScanResult(nextIdx);
            }
        }
    });

    // ====================================
    // INITIALIZE
    // ====================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCanvas);
    } else {
        setTimeout(setupCanvas, 100);
    }

})();
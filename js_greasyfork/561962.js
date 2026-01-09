// ==UserScript==
// @name         AFK Game Data Scanner Pro
// @namespace    https://animeafk.xyz/
// @version      2.0
// @description  Advanced scanner for game data on animeafk.xyz
// @author       Support
// @match        *://animeafk.xyz/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561962/AFK%20Game%20Data%20Scanner%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/561962/AFK%20Game%20Data%20Scanner%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS
    GM_addStyle(`
        #game-scanner-btn {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-size: 20px;
            color: white;
            transition: all 0.3s;
        }
        
        #game-scanner-btn:hover {
            transform: scale(1.1);
        }
        
        #game-scanner-panel {
            position: fixed;
            bottom: 140px;
            right: 20px;
            width: 500px;
            max-height: 600px;
            background: rgba(20, 20, 35, 0.98);
            border-radius: 15px;
            border: 2px solid #e74c3c;
            box-shadow: 0 10px 40px rgba(0,0,0,0.7);
            backdrop-filter: blur(10px);
            display: none;
            overflow: hidden;
            z-index: 9999;
        }
        
        .scanner-content {
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
            color: #fff;
            font-family: 'Consolas', monospace;
            font-size: 13px;
        }
        
        .data-section {
            margin-bottom: 25px;
            padding: 15px;
            background: rgba(231, 76, 60, 0.08);
            border-radius: 10px;
            border-left: 4px solid #e74c3c;
        }
        
        .section-title {
            color: #e74c3c;
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .data-item {
            padding: 8px 10px;
            margin: 5px 0;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            word-break: break-all;
            font-size: 12px;
        }
        
        .data-key {
            color: #3498db;
            font-weight: bold;
        }
        
        .data-value {
            color: #2ecc71;
        }
        
        .action-buttons {
            display: flex;
            gap: 10px;
            padding: 15px;
            background: rgba(30, 30, 50, 0.95);
            border-top: 1px solid rgba(231, 76, 60, 0.3);
        }
        
        .action-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .scan-btn { background: #e74c3c; }
        .copy-btn { background: #27ae60; display: none; }
        .deep-btn { background: #9b59b6; }
        
        .action-btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
        
        .error-msg { color: #ff6b6b; padding: 10px; }
        .success-msg { color: #27ae60; padding: 10px; }
    `);

    // Tạo nút scanner
    const scannerBtn = document.createElement('div');
    scannerBtn.id = 'game-scanner-btn';
    scannerBtn.innerHTML = '🔍';
    scannerBtn.title = 'Game Data Scanner';
    document.body.appendChild(scannerBtn);

    // Tạo panel
    const panel = document.createElement('div');
    panel.id = 'game-scanner-panel';
    panel.innerHTML = `
        <div class="scanner-content" id="scanner-output">
            <div style="text-align: center; padding: 30px; color: #aaa;">
                <div style="font-size: 32px; margin-bottom: 10px;">🎮</div>
                <div>AFK Game Data Scanner</div>
                <div style="font-size: 11px; margin-top: 5px;">Click "Deep Scan" to find game data</div>
            </div>
        </div>
        <div class="action-buttons">
            <button class="action-btn scan-btn" id="quick-scan">Quick Scan</button>
            <button class="action-btn deep-btn" id="deep-scan">Deep Scan</button>
            <button class="action-btn copy-btn" id="copy-data">Copy All</button>
        </div>
    `;
    document.body.appendChild(panel);

    // Biến lưu dữ liệu
    let scanResults = {
        globalObjects: {},
        localStorage: {},
        priceElements: [],
        networkPatterns: [],
        gameEngine: null
    };

    // ================== SCAN FUNCTIONS ==================

    // Tìm game engine
    function detectGameEngine() {
        const engines = [
            { name: 'Unity', check: () => window.unityInstance || document.querySelector('canvas[data-engine="unity"]') },
            { name: 'Phaser', check: () => window.Phaser || window.PHASER },
            { name: 'PixiJS', check: () => window.PIXI || window.pixi },
            { name: 'CreateJS', check: () => window.createjs },
            { name: 'Cocos2d', check: () => window.cc || window.Cocos2d },
            { name: 'ThreeJS', check: () => window.THREE },
            { name: 'WebGL', check: () => document.querySelector('canvas').getContext('webgl') }
        ];

        for (const engine of engines) {
            try {
                if (engine.check()) return engine.name;
            } catch(e) {}
        }
        return 'Unknown/HTML5';
    }

    // Tìm object game trong window
    function findGameObjects() {
        const objects = {};
        const keywords = ['game', 'app', 'player', 'user', 'data', 'config', 'shop', 'store', 'item', 'inventory'];
        
        // Tìm trong window
        for (const key in window) {
            try {
                if (keywords.some(k => key.toLowerCase().includes(k))) {
                    const val = window[key];
                    if (val && typeof val === 'object') {
                        objects[key] = {
                            type: typeof val,
                            keys: Object.keys(val).slice(0, 10)
                        };
                    }
                }
            } catch(e) {}
        }
        
        return objects;
    }

    // Tìm tất cả số có thể là giá tiền
    function findPriceElements() {
        const prices = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            // Tìm số lớn hơn 100 (có thể là giá)
            const matches = text.match(/\b\d{3,}(?:,\d{3})*\b/g);
            if (matches) {
                matches.forEach(num => {
                    if (!num.includes('px') && !num.includes('%')) {
                        const parent = node.parentElement;
                        prices.push({
                            value: num,
                            context: parent.tagName + (parent.className ? '.' + parent.className : ''),
                            text: text.substring(0, 50)
                        });
                    }
                });
            }
        }
        
        return prices.slice(0, 20); // Giới hạn 20 kết quả
    }

    // Tìm dữ liệu trong localStorage
    function scanLocalStorage() {
        const data = {};
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                
                // Tìm key liên quan đến game
                if (key.includes('game') || key.includes('player') || 
                    key.includes('data') || key.includes('save') ||
                    key.includes('shop') || key.includes('item')) {
                    
                    data[key] = {
                        length: value.length,
                        isJSON: isJSON(value),
                        preview: value.substring(0, 100)
                    };
                }
            }
        } catch(e) {}
        return data;
    }

    // Tìm các file được load
    function scanLoadedFiles() {
        const files = {
            scripts: [],
            styles: [],
            images: [],
            others: []
        };
        
        // Scripts
        document.querySelectorAll('script[src]').forEach(s => {
            files.scripts.push(s.src.split('/').pop());
        });
        
        // Styles
        document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
            files.styles.push(l.href.split('/').pop());
        });
        
        // Images
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.src;
            if (src.includes('.png') || src.includes('.jpg')) {
                files.images.push(src.split('/').pop());
            }
        });
        
        return files;
    }

    // Kiểm tra có phải JSON
    function isJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch(e) {
            return false;
        }
    }

    // ================== DISPLAY FUNCTIONS ==================

    function displayResults() {
        const output = document.getElementById('scanner-output');
        let html = '';
        
        // Game Engine
        html += `
            <div class="data-section">
                <div class="section-title">🎮 Game Engine</div>
                <div class="data-item">
                    <span class="data-key">Detected:</span>
                    <span class="data-value">${scanResults.gameEngine}</span>
                </div>
            </div>
        `;
        
        // Global Objects
        if (Object.keys(scanResults.globalObjects).length > 0) {
            html += `
                <div class="data-section">
                    <div class="section-title">🌍 Global Objects (${Object.keys(scanResults.globalObjects).length})</div>
            `;
            
            for (const [key, obj] of Object.entries(scanResults.globalObjects)) {
                html += `
                    <div class="data-item">
                        <span class="data-key">window.${key}:</span>
                        <span class="data-value">${obj.type} [${obj.keys.join(', ')}]</span>
                    </div>
                `;
            }
            
            html += `</div>`;
        }
        
        // LocalStorage
        if (Object.keys(scanResults.localStorage).length > 0) {
            html += `
                <div class="data-section">
                    <div class="section-title">💾 LocalStorage (${Object.keys(scanResults.localStorage).length})</div>
            `;
            
            for (const [key, data] of Object.entries(scanResults.localStorage)) {
                html += `
                    <div class="data-item">
                        <span class="data-key">${key}:</span>
                        <span class="data-value">${data.preview} ${data.isJSON ? '(JSON)' : ''}</span>
                    </div>
                `;
            }
            
            html += `</div>`;
        }
        
        // Price Elements
        if (scanResults.priceElements.length > 0) {
            html += `
                <div class="data-section">
                    <div class="section-title">💰 Price Elements (${scanResults.priceElements.length})</div>
            `;
            
            scanResults.priceElements.forEach(price => {
                html += `
                    <div class="data-item">
                        <span class="data-key">${price.value}:</span>
                        <span class="data-value">${price.context}</span>
                        <div style="font-size: 11px; color: #aaa; margin-top: 3px;">${price.text}</div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        // Files
        const files = scanLoadedFiles();
        html += `
            <div class="data-section">
                <div class="section-title">📁 Loaded Files</div>
                <div class="data-item">
                    <span class="data-key">Scripts:</span>
                    <span class="data-value">${files.scripts.length} files</span>
                </div>
                <div class="data-item">
                    <span class="data-key">Styles:</span>
                    <span class="data-value">${files.styles.length} files</span>
                </div>
                <div class="data-item">
                    <span class="data-key">Images:</span>
                    <span class="data-value">${files.images.length} files</span>
                </div>
            </div>
        `;
        
        output.innerHTML = html;
        document.getElementById('copy-data').style.display = 'block';
    }

    // ================== SCAN ACTIONS ==================

    // Quick Scan
    document.getElementById('quick-scan').addEventListener('click', () => {
        const output = document.getElementById('scanner-output');
        output.innerHTML = '<div style="padding: 20px; color: #e74c3c;">🔄 Quick Scanning...</div>';
        
        setTimeout(() => {
            scanResults = {
                gameEngine: detectGameEngine(),
                globalObjects: findGameObjects(),
                localStorage: scanLocalStorage(),
                priceElements: findPriceElements()
            };
            
            displayResults();
        }, 500);
    });

    // Deep Scan
    document.getElementById('deep-scan').addEventListener('click', () => {
        const output = document.getElementById('scanner-output');
        output.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 32px; margin-bottom: 15px;">🔬</div>
                <div style="color: #e74c3c; font-weight: bold;">Deep Scanning...</div>
                <div style="color: #aaa; font-size: 12px; margin-top: 10px;">
                    Checking memory, network, and game data...
                </div>
            </div>
        `;
        
        setTimeout(() => {
            // Thực hiện deep scan
            scanResults = {
                gameEngine: detectGameEngine(),
                globalObjects: findGameObjects(),
                localStorage: scanLocalStorage(),
                priceElements: findPriceElements(),
                canvas: document.querySelectorAll('canvas').length,
                iframes: document.querySelectorAll('iframe').length,
                totalElements: document.querySelectorAll('*').length
            };
            
            // Thêm hook để bắt network requests
            hookNetworkRequests();
            
            displayResults();
            
            // Thêm hướng dẫn
            output.innerHTML += `
                <div class="data-section" style="background: rgba(52, 152, 219, 0.1); border-left-color: #3498db;">
                    <div class="section-title">💡 Next Steps</div>
                    <div class="data-item">
                        1. Open <strong>DevTools (F12)</strong>
                    </div>
                    <div class="data-item">
                        2. Go to <strong>Network tab</strong>
                    </div>
                    <div class="data-item">
                        3. Refresh page and look for:
                        <div style="margin-left: 15px; margin-top: 5px;">
                            • .json files<br>
                            • API calls to /api/<br>
                            • WebSocket connections
                        </div>
                    </div>
                </div>
            `;
        }, 1000);
    });

    // Copy Data
    document.getElementById('copy-data').addEventListener('click', () => {
        const text = `
=== AFK GAME DATA SCAN ===
URL: ${window.location.href}
Time: ${new Date().toLocaleString()}
Game Engine: ${scanResults.gameEngine}

GLOBAL OBJECTS:
${Object.entries(scanResults.globalObjects).map(([k,v]) => `  ${k}: ${v.type} [${v.keys.join(', ')}]`).join('\n')}

LOCALSTORAGE:
${Object.entries(scanResults.localStorage).map(([k,v]) => `  ${k}: ${v.preview}`).join('\n')}

PRICE ELEMENTS (${scanResults.priceElements.length}):
${scanResults.priceElements.map(p => `  ${p.value} in ${p.context}`).join('\n')}

STATS:
- Canvas elements: ${scanResults.canvas || 0}
- Iframes: ${scanResults.iframes || 0}
- Total DOM elements: ${scanResults.totalElements || 0}
=== END SCAN ===
        `.trim();
        
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('copy-data');
            const original = btn.textContent;
            btn.textContent = '✅ Copied!';
            btn.style.background = '#27ae60';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.background = '';
            }, 2000);
        });
    });

    // Hook network requests
    function hookNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('animeafk.xyz')) {
                console.log('🌐 Fetch:', url);
            }
            return originalFetch.apply(this, args);
        };
        
        console.log('🔗 Network monitoring enabled');
    }

    // ================== PANEL CONTROLS ==================

    // Toggle panel
    scannerBtn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== scannerBtn) {
            panel.style.display = 'none';
        }
    });

    // Auto quick scan on load
    setTimeout(() => {
        console.log('🎮 AFK Game Scanner loaded - Click red button to scan');
    }, 2000);

})();
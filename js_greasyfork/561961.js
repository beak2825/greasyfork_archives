// ==UserScript==
// @name         AFK Shop File Scanner
// @namespace    https://animeafk.xyz/
// @version      1.2
// @description  Scan and copy shop files from animeafk.xyz
// @author       Support
// @match        *://animeafk.xyz/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561961/AFK%20Shop%20File%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/561961/AFK%20Shop%20File%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Thêm CSS
    GM_addStyle(`
        #shop-scanner-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            font-size: 24px;
            color: white;
            user-select: none;
            transition: all 0.3s;
        }
        
        #shop-scanner-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        
        #shop-scanner-btn.copied {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            animation: pulse 0.5s;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        #shop-scanner-panel {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 450px;
            max-height: 600px;
            background: rgba(26, 26, 46, 0.98);
            border-radius: 15px;
            z-index: 9998;
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            border: 2px solid #667eea;
            backdrop-filter: blur(10px);
            display: none;
            overflow: hidden;
        }
        
        .scanner-header {
            padding: 15px;
            background: rgba(22, 33, 62, 0.9);
            border-bottom: 1px solid rgba(102, 126, 234, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .scanner-title {
            font-weight: bold;
            color: white;
            font-size: 16px;
        }
        
        .scanner-subtitle {
            font-size: 12px;
            color: #8892b0;
        }
        
        .scanner-results {
            padding: 15px;
            max-height: 450px;
            overflow-y: auto;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            color: #cbd5e0;
            background: rgba(15, 23, 42, 0.9);
            line-height: 1.4;
        }
        
        .scanner-footer {
            padding: 12px 15px;
            background: rgba(22, 33, 62, 0.9);
            border-top: 1px solid rgba(102, 126, 234, 0.3);
            display: flex;
            gap: 10px;
        }
        
        .scanner-action-btn {
            padding: 10px 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            color: white;
            transition: all 0.2s;
            flex: 1;
            font-size: 13px;
        }
        
        .scanner-action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .scan-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .copy-btn {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            display: none;
        }
        
        .copy-all-btn {
            background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
            display: none;
        }
        
        .result-item {
            padding: 8px 10px;
            margin-bottom: 6px;
            background: rgba(102, 126, 234, 0.08);
            border-radius: 6px;
            border-left: 3px solid #667eea;
            word-break: break-all;
            transition: background 0.2s;
        }
        
        .result-item:hover {
            background: rgba(102, 126, 234, 0.15);
        }
        
        .result-category {
            color: #667eea;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid rgba(102, 126, 234, 0.3);
        }
        
        .result-count {
            color: #27ae60;
            font-weight: bold;
        }
        
        .result-error {
            color: #e74c3c;
            padding: 10px;
            text-align: center;
            background: rgba(231, 76, 60, 0.1);
            border-radius: 6px;
            border: 1px solid rgba(231, 76, 60, 0.3);
        }
        
        .result-success {
            color: #27ae60;
            padding: 10px;
            text-align: center;
        }
        
        .copy-indicator {
            display: none;
            position: absolute;
            top: -10px;
            right: -10px;
            background: #27ae60;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounce 0.5s;
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
    `);

    // Tạo nút menu
    const createMenu = () => {
        const btn = document.createElement('div');
        btn.id = 'shop-scanner-btn';
        btn.innerHTML = '🔍';
        btn.title = 'Shop File Scanner';
        document.body.appendChild(btn);
        return btn;
    };

    // Tạo panel
    const createPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'shop-scanner-panel';
        
        panel.innerHTML = `
            <div class="scanner-header">
                <div>
                    <div class="scanner-title">🛒 Shop File Scanner</div>
                    <div class="scanner-subtitle">animeafk.xyz • Ready</div>
                </div>
                <button id="close-scanner" style="background: none; border: none; color: #8892b0; cursor: pointer; font-size: 20px; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
            <div id="scanner-results" class="scanner-results">
                <div style="text-align: center; color: #8892b0; padding: 30px;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🔍</div>
                    Click "Scan Now" to find shop files
                </div>
            </div>
            <div class="scanner-footer">
                <button id="start-scan" class="scanner-action-btn scan-btn">Scan Now</button>
                <button id="copy-results" class="scanner-action-btn copy-btn">Copy All</button>
                <button id="copy-json" class="scanner-action-btn copy-all-btn">Copy JSON</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        return panel;
    };

    // Hàm scan chính
    const performScan = () => {
        const resultsDiv = document.getElementById('scanner-results');
        const copyBtn = document.getElementById('copy-results');
        const copyJsonBtn = document.getElementById('copy-json');
        
        // Reset
        resultsDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #667eea;">🔄 Scanning... Please wait</div>';
        copyBtn.style.display = 'none';
        copyJsonBtn.style.display = 'none';
        
        // Object chứa tất cả kết quả
        const scanData = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            files: {
                javascript: [],
                images: [],
                stylesheets: [],
                json: [],
                localStorage: [],
                elements: []
            }
        };
        
        let allTextResults = []; // Để copy text
        
        // 1. Scan JavaScript files
        const scanJS = () => {
            const shopKeywords = ['shop', 'store', 'buy', 'purchase', 'price', 'cost', 'item', 'mall', 'market', 'gold', 'diamond', 'coin'];
            
            document.querySelectorAll('script[src]').forEach(script => {
                const src = script.src;
                if (src && (src.includes('animeafk.xyz') || src.includes('.js'))) {
                    const filename = src.split('/').pop().toLowerCase();
                    const isShopFile = shopKeywords.some(keyword => filename.includes(keyword));
                    
                    if (isShopFile || src.includes('shop') || src.includes('store')) {
                        const item = `📜 ${filename}\n   ${src}`;
                        scanData.files.javascript.push({ filename, url: src });
                        allTextResults.push(item);
                    }
                }
            });
        };
        
        // 2. Scan Images
        const scanImages = () => {
            document.querySelectorAll('img').forEach(img => {
                const src = img.src || img.getAttribute('data-src') || '';
                if (src.includes('animeafk.xyz')) {
                    const filename = src.split('/').pop().toLowerCase();
                    if (filename.includes('shop') || filename.includes('store') || 
                        filename.includes('item') || filename.includes('price')) {
                        const item = `🖼️ ${filename}\n   ${src}`;
                        scanData.files.images.push({ filename, url: src });
                        allTextResults.push(item);
                    }
                }
            });
        };
        
        // 3. Scan CSS
        const scanCSS = () => {
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.href;
                if (href.includes('animeafk.xyz')) {
                    const filename = href.split('/').pop().toLowerCase();
                    if (filename.includes('shop') || filename.includes('ui') || filename.includes('style')) {
                        const item = `🎨 ${filename}\n   ${href}`;
                        scanData.files.stylesheets.push({ filename, url: href });
                        allTextResults.push(item);
                    }
                }
            });
        };
        
        // 4. Scan JSON files (trong script tags)
        const scanJSON = () => {
            document.querySelectorAll('script').forEach(script => {
                if (!script.src && script.textContent) {
                    const content = script.textContent;
                    if (content.includes('shop') || content.includes('price') || content.includes('item')) {
                        try {
                            JSON.parse(content); // Thử parse để xác nhận là JSON
                            scanData.files.json.push({
                                type: 'inline',
                                contentPreview: content.substring(0, 100) + '...'
                            });
                            allTextResults.push('📊 Inline JSON (contains shop data)');
                        } catch(e) {}
                    }
                }
            });
        };
        
        // 5. Scan localStorage
        const scanStorage = () => {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.toLowerCase().includes('shop') || 
                        key.toLowerCase().includes('item') ||
                        key.toLowerCase().includes('price')) {
                        
                        const value = localStorage.getItem(key);
                        const preview = value.length > 50 ? value.substring(0, 50) + '...' : value;
                        
                        scanData.files.localStorage.push({ key, valuePreview: preview });
                        allTextResults.push(`💾 ${key}\n   ${preview}`);
                    }
                }
            } catch(e) {
                allTextResults.push('⚠️ Cannot access localStorage');
            }
        };
        
        // 6. Scan DOM Elements
        const scanDOM = () => {
            const elements = [];
            const keywords = ['shop', 'store', 'buy', 'price', 'cost', 'item'];
            
            keywords.forEach(keyword => {
                // Tìm theo class
                document.querySelectorAll(`[class*="${keyword}"]`).forEach(el => {
                    if (elements.length < 20) { // Giới hạn
                        elements.push({
                            type: 'class',
                            selector: `.${el.className.split(' ')[0]}`,
                            tag: el.tagName
                        });
                        allTextResults.push(`🏷️ ${el.tagName}.${el.className.split(' ')[0]}`);
                    }
                });
                
                // Tìm theo id
                document.querySelectorAll(`[id*="${keyword}"]`).forEach(el => {
                    if (elements.length < 20) {
                        elements.push({
                            type: 'id',
                            selector: `#${el.id}`,
                            tag: el.tagName
                        });
                        allTextResults.push(`#️⃣ ${el.tagName}#${el.id}`);
                    }
                });
            });
            
            scanData.files.elements = elements;
        };
        
        // Chạy tất cả scan functions
        setTimeout(() => {
            try {
                scanJS();
                scanImages();
                scanCSS();
                scanJSON();
                scanStorage();
                scanDOM();
                
                // Hiển thị kết quả
                displayResults(scanData, allTextResults);
                
            } catch(error) {
                resultsDiv.innerHTML = `
                    <div class="result-error">
                        ❌ Scan Error: ${error.message}
                        <div style="margin-top: 10px; font-size: 11px;">
                            Try refreshing the page and scanning again
                        </div>
                    </div>
                `;
            }
        }, 100);
        
        // Hiển thị kết quả
        function displayResults(data, textResults) {
            const totalItems = textResults.length;
            
            if (totalItems === 0) {
                resultsDiv.innerHTML = `
                    <div class="result-error">
                        ❌ No shop files found
                        <div style="margin-top: 10px; font-size: 11px;">
                            Try checking Network tab in DevTools
                        </div>
                    </div>
                `;
                return;
            }
            
            let html = `<div class="result-success">✅ Found <span class="result-count">${totalItems}</span> shop-related items</div>`;
            
            // Nhóm theo category
            const categories = [
                { name: 'JavaScript Files', key: 'javascript', icon: '📜' },
                { name: 'Image Files', key: 'images', icon: '🖼️' },
                { name: 'CSS Files', key: 'stylesheets', icon: '🎨' },
                { name: 'JSON Data', key: 'json', icon: '📊' },
                { name: 'Local Storage', key: 'localStorage', icon: '💾' },
                { name: 'DOM Elements', key: 'elements', icon: '🏷️' }
            ];
            
            categories.forEach(category => {
                const items = data.files[category.key];
                if (items.length > 0) {
                    html += `<div class="result-category">${category.icon} ${category.name} (${items.length})</div>`;
                    
                    items.forEach((item, index) => {
                        if (category.key === 'javascript' || category.key === 'images' || category.key === 'stylesheets') {
                            html += `<div class="result-item">${item.filename}<br><small style="color: #8892b0;">${item.url}</small></div>`;
                        } else if (category.key === 'localStorage') {
                            html += `<div class="result-item">${item.key}<br><small style="color: #8892b0;">${item.valuePreview}</small></div>`;
                        } else if (category.key === 'elements') {
                            html += `<div class="result-item">${item.tag}${item.selector}</div>`;
                        } else {
                            html += `<div class="result-item">${item.contentPreview || 'Data found'}</div>`;
                        }
                    });
                }
            });
            
            resultsDiv.innerHTML = html;
            
            // Hiển thị nút copy
            copyBtn.style.display = 'block';
            copyJsonBtn.style.display = 'block';
            
            // Sự kiện copy text
            copyBtn.onclick = () => {
                const textToCopy = [
                    `=== Shop Files Scan Results ===`,
                    `URL: ${data.url}`,
                    `Time: ${new Date().toLocaleString()}`,
                    `Total Items: ${totalItems}`,
                    ``,
                    ...textResults,
                    ``,
                    `=== End of Results ===`
                ].join('\n');
                
                GM_setClipboard(textToCopy, 'text').then(() => {
                    showCopyFeedback(copyBtn);
                }).catch(() => {
                    // Fallback
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showCopyFeedback(copyBtn);
                    });
                });
            };
            
            // Sự kiện copy JSON
            copyJsonBtn.onclick = () => {
                const jsonToCopy = JSON.stringify(data, null, 2);
                GM_setClipboard(jsonToCopy, 'text').then(() => {
                    showCopyFeedback(copyJsonBtn);
                }).catch(() => {
                    navigator.clipboard.writeText(jsonToCopy).then(() => {
                        showCopyFeedback(copyJsonBtn);
                    });
                });
            };
        }
        
        // Hiệu ứng khi copy thành công
        function showCopyFeedback(button) {
            const originalText = button.textContent;
            const originalBg = button.style.background;
            
            button.textContent = '✅ Copied!';
            button.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
            
            // Feedback trên nút menu chính
            const menuBtn = document.getElementById('shop-scanner-btn');
            menuBtn.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = originalBg;
                menuBtn.classList.remove('copied');
            }, 2000);
        }
    };

    // Khởi tạo
    const init = () => {
        const btn = createMenu();
        const panel = createPanel();
        
        // Sự kiện nút menu
        btn.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
        
        // Sự kiện đóng panel
        document.getElementById('close-scanner').onclick = () => {
            panel.style.display = 'none';
        };
        
        // Sự kiện scan
        document.getElementById('start-scan').onclick = performScan;
        
        // Đóng khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== btn) {
                panel.style.display = 'none';
            }
        });
        
        // Hotkey: Ctrl+Shift+S để mở scanner
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
    };

    // Chạy khi page ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
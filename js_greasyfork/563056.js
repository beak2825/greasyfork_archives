// ==UserScript==
// @name         Kakao Page Comic Downloader
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Download Kakao Page chapters - Click graphql request or paste JSON
// @author       ozler365
// @license      MIT
// @match        https://page.kakao.com/*
// @match        https://*.kakao.com/*
// @icon         https://t1.kakaocdn.net/kakaopageWeb/real/logo/kakaopageLogo.png
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563056/Kakao%20Page%20Comic%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563056/Kakao%20Page%20Comic%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Kakao] Hybrid downloader loaded!');

    let isDownloading = false;
    const DELAY_BETWEEN_IMAGES = 200;
    const MAX_RETRIES = 3;
    const RETRY_WAIT = 2000;

    // Create floating button
    const btn = document.createElement('button');
    btn.id = 'kakao-dl-btn';
    btn.innerHTML = '📥 Kakao Downloader';
    Object.assign(btn.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '99999',
        padding: '14px 24px', background: '#FEE500', color: '#000',
        border: 'none', borderRadius: '10px', cursor: 'pointer',
        fontWeight: 'bold', fontSize: '15px', fontFamily: 'sans-serif',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)', transition: 'all 0.3s'
    });
    
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

    // Create popup panel
    const panel = document.createElement('div');
    panel.id = 'kakao-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.4);
                    width: 500px; max-width: 90vw; z-index: 999999; font-family: sans-serif;">
            <div style="background: #FEE500; padding: 20px; border-radius: 15px 15px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; color: #000; font-size: 18px;">📥 Kakao Page Downloader</h2>
                <button id="kakao-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #000;">×</button>
            </div>
            
            <div style="padding: 20px;">
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-size: 13px;">
                    <strong>📋 Two Ways to Download:</strong><br><br>
                    
                    <strong>Method 1 - Copy/Paste (Easiest):</strong><br>
                    1. Open DevTools (F12) → Network → XHR<br>
                    2. Find "graphql" request (200-900KB)<br>
                    3. Click it → Response tab<br>
                    4. Right-click → Copy → Copy all as JSON<br>
                    5. Paste below ↓<br><br>
                    
                    <strong>Method 2 - Direct extraction:</strong><br>
                    Search in Response for "secureUrl" and copy all URLs
                </div>
                
                <textarea id="kakao-input" placeholder="Paste full GraphQL JSON OR just the secureUrl links (one per line)..."
                    style="width: 100%; height: 150px; padding: 12px; border: 2px solid #ddd; 
                           border-radius: 8px; font-family: monospace; font-size: 12px; resize: vertical;"></textarea>
                
                <input type="text" id="kakao-folder" placeholder="Folder name (optional)" 
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; 
                              margin: 10px 0; font-size: 14px;">
                
                <button id="kakao-start" style="width: 100%; padding: 15px; background: #FEE500; 
                        color: #000; border: none; border-radius: 8px; font-size: 16px; 
                        font-weight: bold; cursor: pointer; transition: all 0.2s;">
                    🚀 Start Download
                </button>
                
                <div id="kakao-status" style="margin-top: 15px; text-align: center; 
                     font-size: 14px; min-height: 25px; padding: 10px; border-radius: 8px;"></div>
            </div>
        </div>
        
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.5); z-index: 999998;" id="kakao-overlay"></div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // Event handlers
    btn.onclick = () => {
        panel.style.display = 'block';
        document.getElementById('kakao-input').focus();
    };

    document.getElementById('kakao-close').onclick = () => panel.style.display = 'none';
    document.getElementById('kakao-overlay').onclick = () => panel.style.display = 'none';

    document.getElementById('kakao-start').onclick = processInput;

    // Process input
    function processInput() {
        const input = document.getElementById('kakao-input').value.trim();
        const folder = document.getElementById('kakao-folder').value.trim();
        const status = document.getElementById('kakao-status');

        if (!input) {
            status.innerHTML = '<span style="color: red; font-weight: bold;">❌ Please paste data!</span>';
            return;
        }

        status.innerHTML = '<span style="color: #666;">⏳ Processing...</span>';
        
        setTimeout(() => {
            const result = extractData(input);
            
            if (!result || result.length === 0) {
                status.innerHTML = '<span style="color: red; font-weight: bold;">❌ No images found! Check the data.</span>';
                status.style.background = '#ffebee';
                return;
            }

            status.innerHTML = `<span style="color: green; font-weight: bold;">✓ Found ${result.length} images!</span>`;
            status.style.background = '#e8f5e9';
            
            setTimeout(() => {
                startDownload(result, folder || 'Kakao_Chapter');
            }, 800);
        }, 100);
    }

    // Extract image data
    function extractData(input) {
        const urls = [];

        try {
            // Method 1: Try as JSON
            const data = JSON.parse(input);
            
            // Search for files array
            const findFiles = (obj, depth = 0) => {
                if (depth > 15 || !obj || typeof obj !== 'object') return null;
                
                if (obj.files && Array.isArray(obj.files)) {
                    const first = obj.files[0];
                    if (first?.secureUrl || first?.url) return obj.files;
                }
                
                for (let key in obj) {
                    const result = findFiles(obj[key], depth + 1);
                    if (result) return result;
                }
                return null;
            };
            
            const files = findFiles(data);
            
            if (files) {
                console.log('[Kakao] Found', files.length, 'files in JSON');
                return files.map((f, i) => ({
                    url: f.secureUrl || f.url,
                    no: f.no || i + 1
                })).filter(f => f.url);
            }
        } catch (e) {
            console.log('[Kakao] Not JSON, trying URL extraction...');
        }

        // Method 2: Extract URLs from text
        const lines = input.split('\n');
        for (let line of lines) {
            line = line.trim();
            
            // Find URLs
            const urlMatch = line.match(/https?:\/\/[^\s"',]+/);
            if (urlMatch) {
                const url = urlMatch[0];
                if (url.includes('page-edge.kakao.com') || url.includes('sdownload')) {
                    urls.push({ url: url, no: urls.length + 1 });
                }
            }
        }

        if (urls.length > 0) {
            console.log('[Kakao] Extracted', urls.length, 'URLs from text');
        }

        return urls;
    }

    // Download function
    function startDownload(images, folderName) {
        if (isDownloading) return;
        
        isDownloading = true;
        folderName = sanitizeFilename(folderName);
        
        const status = document.getElementById('kakao-status');
        const startBtn = document.getElementById('kakao-start');
        
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        startBtn.style.background = '#ccc';

        console.log('[Kakao] Downloading', images.length, 'images to', folderName);

        let completed = 0;
        let failed = 0;
        let currentIndex = 0;
        let currentRetries = 0;

        function downloadNext() {
            if (currentIndex >= images.length) {
                isDownloading = false;
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
                startBtn.style.background = '#FEE500';
                
                const percent = ((completed / images.length) * 100).toFixed(0);
                status.innerHTML = `<span style="color: green; font-weight: bold;">✅ Complete! ${completed}/${images.length} (${percent}%)</span>`;
                status.style.background = '#e8f5e9';
                
                if (failed > 0) {
                    status.innerHTML += `<br><span style="color: orange; font-size: 12px;">${failed} failed</span>`;
                }
                
                console.log('[Kakao] Done!', completed, 'succeeded,', failed, 'failed');
                return;
            }

            const item = images[currentIndex];
            const url = item.url;

            if (!url) {
                failed++;
                currentIndex++;
                downloadNext();
                return;
            }

            let ext = 'jpg';
            if (url.includes('.jpeg')) ext = 'jpeg';
            else if (url.includes('.png')) ext = 'png';
            else if (url.includes('.webp')) ext = 'webp';

            const pageNum = item.no || (currentIndex + 1);
            const filename = `${String(pageNum).padStart(3, '0')}.${ext}`;
            const fullPath = `${folderName}/${filename}`;

            const progress = ((currentIndex / images.length) * 100).toFixed(0);
            status.innerHTML = `⏬ Downloading ${currentIndex + 1}/${images.length} (${progress}%)...`;
            status.style.background = '#fff3e0';

            const handleFailure = (reason) => {
                if (currentRetries < MAX_RETRIES) {
                    currentRetries++;
                    status.innerHTML = `🔄 Retry ${currentRetries}/${MAX_RETRIES} for #${pageNum}...`;
                    setTimeout(downloadNext, RETRY_WAIT);
                } else {
                    failed++;
                    currentIndex++;
                    currentRetries = 0;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                }
            };

            GM_download({
                url: url,
                name: fullPath,
                timeout: 15000,
                onload: function() {
                    completed++;
                    currentIndex++;
                    currentRetries = 0;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                },
                onerror: function(err) {
                    console.error('[Kakao] Error downloading', filename, err);
                    handleFailure('Error');
                },
                ontimeout: function() {
                    handleFailure('Timeout');
                }
            });
        }

        downloadNext();
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').trim().substring(0, 100);
    }

    console.log('[Kakao] Ready! Click the yellow button to start.');

})();
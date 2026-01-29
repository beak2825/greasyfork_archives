// ==UserScript==
// @name         Toonily Image Page Downloader
// @namespace    toonilyDownloader
// @version      1.0
// @description  Easily download pages from toonily
// @author       Runterya
// @match        https://toonily.com/serie/*/*/
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564365/Toonily%20Image%20Page%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/564365/Toonily%20Image%20Page%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS Styles ---
    GM_addStyle(`
        #toonily-dl-toggle {
            position: fixed; top: 80px; right: 20px; z-index: 99999;
            padding: 12px 20px; background: #ff585d; color: white;
            border: 2px solid white; border-radius: 50px; cursor: pointer; font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4); font-family: sans-serif;
        }
        #toonily-dl-panel {
            position: fixed; top: 140px; right: 20px; z-index: 99998;
            width: 440px; height: 75vh; background: #ffffff;
            border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            display: none; flex-direction: column; font-family: sans-serif;
            border: 1px solid #ddd; overflow: hidden;
        }
        .dl-panel-header {
            padding: 20px; border-bottom: 2px solid #f0f0f0; background: #fafafa; position: relative;
        }
        #dl-close-btn {
            position: absolute; top: 10px; right: 10px; background: none; border: none;
            font-size: 20px; cursor: pointer; color: #888;
        }
        .dl-control-group {
            display: flex; gap: 10px; margin-bottom: 12px; align-items: center;
        }
        .dl-control-group label { flex: 1; font-size: 13px; color: #444; font-weight: 600; }
        .dl-control-group input[type=text] {
            flex: 3; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;
        }
        #dl-btn-start {
            width: 100%; padding: 12px; background: #28a745; color: white;
            border: none; border-radius: 6px; cursor: pointer; font-weight: bold;
            font-size: 14px; text-transform: uppercase;
        }
        #dl-btn-start:hover { background: #218838; }
        #dl-btn-start:disabled { background: #6c757d; cursor: not-allowed; }
        .dl-panel-body {
            flex: 1; overflow-y: auto; padding: 15px; background: #f4f4f9;
        }
        .dl-grid-item {
            background: white; padding: 12px; border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative;
            border: 1px solid #eee; display: flex; flex-direction: column; margin-bottom: 20px;
        }
        .dl-img-container {
            width: 100%; height: 200px; overflow: hidden; border-radius: 4px;
            background: #eee; position: relative; transition: height 0.3s ease-in-out;
            margin: 8px 0;
        }
        .dl-img-container.expanded { height: auto; max-height: none; }
        .dl-grid-item img { width: 100%; height: auto; display: block; }
        .img-select {
            position: absolute; top: 15px; left: 15px; z-index: 10;
            width: 22px; height: 22px; cursor: pointer;
        }
        .item-header, .item-footer { display: flex; justify-content: space-between; align-items: center; }
        .expand-btn {
            padding: 5px 12px; font-size: 11px; background: #007bff; color: white;
            border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
        }
    `);

    let allImageData = [];
    let isInitialized = false;

    // --- Core Functions ---

    function fetchImageBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "Referer": "https://toonily.com/", "Origin": "https://toonily.com" },
                responseType: "blob",
                onload: (r) => r.status === 200 ? resolve(r.response) : reject(r.status),
                onerror: (e) => reject(e)
            });
        });
    }

    function scanImages() {
        const selectors = ['.reading-content .page-break img', '.reading-content img', '.wp-manga-chapter-img'];
        let foundNodes = [];
        for (const selector of selectors) {
            const nodes = document.querySelectorAll(selector);
            if (nodes.length > 0) {
                foundNodes = Array.from(nodes);
                break;
            }
        }
        // filter to avoid data urls and ads
        return foundNodes.map((img, index) => ({
            url: (img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.src || '').trim(),
            index: index
        })).filter(item => item.url && !item.url.includes('data:image') && !item.url.includes('ads'));
    }

    function createUI() {
        if (isInitialized) return;
        allImageData = scanImages();
        if (allImageData.length === 0) return;
        isInitialized = true;

        // Grab heading text for naming
        const heading = document.getElementById('chapter-heading');
        const defaultName = heading ? heading.innerText.trim() : "Manga_Chapter";

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toonily-dl-toggle';
        toggleBtn.innerHTML = '📂 Download Panel';
        document.body.appendChild(toggleBtn);

        const panel = document.createElement('div');
        panel.id = 'toonily-dl-panel';
        panel.innerHTML = `
            <div class="dl-panel-header">
                <button id="dl-close-btn">&times;</button>
                <div class="dl-control-group">
                    <label><input type="checkbox" id="dl-master-check" checked> Select All (${allImageData.length})</label>
                </div>
                <div class="dl-control-group">
                    <label>Folder Name:</label>
                    <input type="text" id="dl-folder-input" value="${defaultName}">
                </div>
                <button id="dl-btn-start">Download All Images</button>
            </div>
            <div class="dl-panel-body">
                <div class="dl-image-grid" id="dl-grid-container"></div>
            </div>
        `;
        document.body.appendChild(panel);

        const grid = document.getElementById('dl-grid-container');

        allImageData.forEach((data, i) => {
            const div = document.createElement('div');
            div.className = 'dl-grid-item';
            div.innerHTML = `
                <input type="checkbox" class="img-select" data-idx="${i}" checked>
                <div class="item-header">
                    <span style="margin-left:35px; font-weight:bold; font-size:12px; color:#888;">Page ${String(i+1).padStart(2, '0')}</span>
                    <button class="expand-btn" data-target="cont-${i}">Expand</button>
                </div>
                <div class="dl-img-container" id="cont-${i}">
                    <img id="thumb-${i}" src="" alt="Loading...">
                </div>
                <div class="item-footer">
                    <span></span>
                    <button class="expand-btn" data-target="cont-${i}">Expand</button>
                </div>
            `;
            grid.appendChild(div);

            fetchImageBlob(data.url).then(blob => {
                document.getElementById(`thumb-${i}`).src = URL.createObjectURL(blob);
            });
        });

        // Event Handlers
        toggleBtn.onclick = () => panel.style.display = 'flex';
        document.getElementById('dl-close-btn').onclick = () => panel.style.display = 'none';

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('expand-btn')) {
                const tid = e.target.getAttribute('data-target');
                const cont = document.getElementById(tid);
                const isExp = cont.classList.toggle('expanded');
                grid.querySelectorAll(`button[data-target="${tid}"]`).forEach(b => b.innerText = isExp ? 'Collapse' : 'Expand');
            }
        });

        document.getElementById('dl-master-check').onchange = (e) => {
            document.querySelectorAll('.img-select').forEach(cb => cb.checked = e.target.checked);
        };

        // SEQUENTIAL DOWNLOAD LOGIC
        document.getElementById('dl-btn-start').onclick = async function() {
            const selected = Array.from(document.querySelectorAll('.img-select:checked'));
            if (selected.length === 0) return alert("Select images first!");

            const folderName = document.getElementById('dl-folder-input').value.trim() || "Manga";
            this.disabled = true;
            const originalText = this.innerText;

            for (let i = 0; i < selected.length; i++) {
                const idx = selected[i].getAttribute('data-idx');
                const item = allImageData[idx];
                this.innerText = `Proc ${i+1}/${selected.length}...`;

                try {
                    const blob = await fetchImageBlob(item.url);
                    const ext = item.url.split('.').pop().split(/[?#]/)[0] || 'jpg';
                    // Naming convention mimics folder grouping in OS downloads
                    const filename = `${folderName}_page_${String(parseInt(idx)+1).padStart(3, '0')}.${ext}`;

                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();

                    setTimeout(() => {
                        URL.revokeObjectURL(a.href);
                        document.body.removeChild(a);
                    }, 100);

                    // Gap to avoid browser throttling
                    await new Promise(r => setTimeout(r, 450));
                } catch (e) {
                    console.error("Failed:", item.url);
                }
            }

            this.disabled = false;
            this.innerText = originalText;
            alert("Sequential download finished.");
        };
    }

    const observer = new MutationObserver(() => { if (!isInitialized) createUI(); });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(createUI, 3000);
})();
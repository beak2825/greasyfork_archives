// ==UserScript==
// @name         Universal Image Downloader
// @namespace    https://greasyfork.org/en/users/1553223-ozler365
// @version      7.2
// @description  Professional UI, Smart Source Scan (No Scroll), and Strict Reader Isolation
// @author       ozler365
// @license      MIT
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-end
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/561884/Universal%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561884/Universal%20Image%20Downloader.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* eslint-env es6 */

(function () {
    'use strict';

    // 1. Configuration & Localization
    const isZh = (navigator.language || 'en').toLowerCase().includes("zh");
    const i18n = {
        subFolder: isZh ? "文件夹名称" : "Folder Name",
        selectAll: isZh ? "全选" : "Select All",
        download: isZh ? "批量下载" : "Download All",
        zip: isZh ? "打包下载" : "ZIP Pack",
        selected: isZh ? "已选择" : "Selected",
        source: isZh ? "来源" : "Source",
        menuOpen: isZh ? "启动下载器" : "Open Downloader",
        sourceScan: isZh ? "⚡ 源码扫描" : "⚡ Source Scan",
        processing: isZh ? "分析中..." : "Analyzing...",
    };

    // 2. Helper Functions
    function getAbsUrl(url) {
        if (!url || typeof url !== 'string' || url.startsWith('blob:') || url.startsWith('data:')) return url;
        try { return new URL(url, document.baseURI).href; } catch(e) { return url; }
    }

    async function getImageBlob(url) {
        return new Promise((resolve, reject) => {
            if (url.startsWith('data:') || url.startsWith('blob:')) {
                fetch(url).then(res => res.blob()).then(resolve).catch(reject);
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                anonymous: false,
                headers: {
                    "Referer": window.location.href,
                    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
                },
                onload: (res) => {
                    if (res.status === 200 && res.response.size > 512) resolve(res.response);
                    else fetch(url).then(r => r.blob()).then(resolve).catch(reject);
                },
                onerror: () => fetch(url).then(r => r.blob()).then(resolve).catch(reject)
            });
        });
    }

    async function convertToJpeg(blob) {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#FFF'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(b => { URL.revokeObjectURL(url); resolve(b || blob); }, 'image/jpeg', 0.9);
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
            img.src = url;
        });
    }

    // 3. Main UI Logic
    function openUI() {
        if (document.querySelector(".tyc-overlay")) return;

        // --- UI STYLES ---
        const styles = `
            .tyc-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); z-index:2147483640; display:flex; justify-content:center; align-items:center; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            .tyc-modal { width:90vw; height:85vh; background:#fcfcfc; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; resize:both; min-width:800px; box-shadow: 0 10px 40px rgba(0,0,0,0.4); border: 1px solid #444; }
            .tyc-header { padding:15px 25px; background:#fff; border-bottom:1px solid #e0e0e0; display:flex; align-items:center; gap:15px; flex-wrap:wrap; box-shadow: 0 2px 5px rgba(0,0,0,0.03); z-index: 10; }
            .tyc-input { padding:8px 12px; border:2px solid #ccc !important; border-radius:6px; font-weight:600; width:140px; background-color: #ffffff !important; color: #222 !important; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05); font-size: 14px; }
            .tyc-input:focus { border-color: #007bff !important; outline: none; }
            .tyc-btn { padding:8px 16px; border-radius:6px; border:none; cursor:pointer; font-weight:700; font-size:13px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: white; }
            .tyc-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); filter: brightness(110%); }
            .tyc-btn:active { transform: translateY(0); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
            .tyc-btn-blue { background: linear-gradient(135deg, #007bff, #0062cc); }
            .tyc-btn-green { background: linear-gradient(135deg, #28a745, #218838); }
            .tyc-btn-orange { background: linear-gradient(135deg, #fd7e14, #e67e22); }
            .tyc-btn-gray { background: #f8f9fa; color: #333; border: 1px solid #ddd; }
            .tyc-btn-gray:hover { background: #e2e6ea; }
            .tyc-badge { background:#333; color:#fff; padding:6px 12px; border-radius:20px; font-weight:700; font-size: 12px; white-space: nowrap; }
            .tyc-label { display:flex; align-items:center; gap:8px; cursor:pointer; font-weight: 600; color: #444; user-select: none; }
            .tyc-grid { flex:1; overflow-y:auto; padding:20px; display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); grid-auto-rows: 260px; gap:15px; background:#f0f2f5; }
            .tyc-card { background:#fff; border-radius:8px; border:3px solid transparent; cursor:pointer; overflow:hidden; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.06); transition: transform 0.1s; position: relative; }
            .tyc-card:hover { transform: scale(1.02); }
            .tyc-card.selected { border-color:#007bff; background:#edf5ff; }
            .tyc-card.selected::after { content:"✓"; position:absolute; top:5px; right:5px; background:#007bff; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px; }
            .tyc-card img { max-width:95%; max-height:95%; object-fit:contain; pointer-events:none; }
        `;

        const html = `
            <div class="tyc-overlay">
                <style>${styles}</style>
                <div class="tyc-modal">
                    <div class="tyc-header">
                        <label class="tyc-label">
                            <input type="checkbox" id="tyc-select-all" style="width:18px; height:18px;"> 
                            <span>${i18n.selectAll}</span>
                        </label>
                        <div style="height:25px; border-left:1px solid #ddd; margin:0 5px;"></div>
                        <input type="text" id="tyc-folder" class="tyc-input" placeholder="${i18n.subFolder}">
                        <span class="tyc-badge" id="tyc-count">0</span>
                        <div style="flex:1;"></div>
                        
                        <button class="tyc-btn tyc-btn-orange" id="tyc-source-scan">${i18n.sourceScan}</button>
                        <button class="tyc-btn tyc-btn-blue" id="tyc-download">${i18n.download}</button>
                        <button class="tyc-btn tyc-btn-green" id="tyc-zip">${i18n.zip}</button>
                        <button class="tyc-btn tyc-btn-gray" onclick="this.closest('.tyc-overlay').remove()" style="padding: 8px 12px; font-size: 16px;">✕</button>
                    </div>
                    <div class="tyc-grid" id="tyc-grid"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", html);
        
        // --- VARIABLES ---
        const grid = document.getElementById("tyc-grid");
        const countBadge = document.getElementById("tyc-count");
        let selectedIndices = new Set();
        let imgUrls = [];

        // --- 1. DOM SCANNER ---
        const scanDOM = () => {
            const urlSet = new Set();
            const imgRegex = /\.(jpg|jpeg|png|webp|avif|bmp|gif)($|\?)/i;
            const hostname = window.location.hostname;

            const mainSelectors = [
                '#_imageList', '.viewer_lst', '#readerarea', '.reading-content', 
                '.chapter-images', '.entry-content', '#chapter-container', 
                '#images-container', '.viewer-container', '.ts-main-image'
            ];

            let scope = document.body;
            for (let s of mainSelectors) {
                let found = document.querySelector(s);
                if (found) { scope = found; break; }
            }

            let noiseClasses = ['.listupd', '.widget', '.sidebar', 'header', 'footer', 'nav', '.related', '.comments', '.recommend', '.menu', '.dropdown', '.select-chapter', '.chapter-select', '#chapter-selector'];
            if (!hostname.includes('webtoons.com')) {
                noiseClasses.push('.hidden', '.invisible', '.d-none', '[style*="display: none"]', '[style*="display:none"]');
            }

            const ignoredTags = ['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEXTAREA', 'OPTION', 'SELECT', 'INPUT', 'BUTTON', 'SVG', 'PATH', 'USE'];

            scope.querySelectorAll("*").forEach(el => {
                if (!el.tagName) return;
                if (ignoredTags.includes(el.tagName.toUpperCase())) return;
                if (el.closest(noiseClasses.join(','))) return;
                
                const attrs = [el.src, el.getAttribute('data-src'), el.getAttribute('data-url'), el.getAttribute('data-original')];
                
                attrs.forEach(val => {
                    if (val && typeof val === 'string') {
                        if (val.includes('previous') || val.includes('next') || val.includes('thumb')) {
                             if (!hostname.includes('webtoons.com') && (val.includes('150x150') || val.includes('300x300'))) return;
                        }
                        if (imgRegex.test(val) || val.startsWith('blob:') || val.startsWith('data:image/')) {
                            urlSet.add(getAbsUrl(val));
                        }
                    }
                });

                const bg = window.getComputedStyle(el).backgroundImage;
                if (bg && bg !== 'none') {
                    const match = bg.match(/url\("?(.+?)"?\)/);
                    if (match) urlSet.add(getAbsUrl(match[1]));
                }
            });

            return Array.from(urlSet).filter(u => u && !u.startsWith('data:image/svg'));
        };

        // --- 2. SOURCE CODE SCANNER ---
        const scanSourceCode = () => {
            const html = document.documentElement.innerHTML;
            const regex = /(https?:\\?\/\\?\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp|avif))/gi;
            const matches = html.match(regex) || [];
            const cleanUrls = new Set();
            
            matches.forEach(match => {
                let clean = match.replace(/\\/g, '');
                if (clean.includes('avatar') || clean.includes('logo') || clean.includes('icon') || clean.includes('thumb')) return;
                if (clean.includes('.js') || clean.includes('.css')) return;
                cleanUrls.add(getAbsUrl(clean));
            });

            return Array.from(cleanUrls);
        };

        const render = () => {
            grid.innerHTML = "";
            imgUrls.forEach((url, index) => {
                const card = document.createElement("div");
                card.className = "tyc-card";
                if (selectedIndices.has(index)) card.classList.add("selected");
                card.innerHTML = `<img src="${url}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.remove()">`;
                card.onclick = () => {
                    if (selectedIndices.has(index)) {
                        selectedIndices.delete(index);
                        card.classList.remove("selected");
                    } else {
                        selectedIndices.add(index);
                        card.classList.add("selected");
                    }
                    countBadge.innerText = `${i18n.selected}: ${selectedIndices.size}`;
                };
                grid.appendChild(card);
            });
            countBadge.innerText = `${i18n.selected}: ${selectedIndices.size}`;
        };

        imgUrls = scanDOM();
        render();

        document.getElementById("tyc-select-all").onchange = (e) => {
            const isChecked = e.target.checked;
            selectedIndices.clear();
            document.querySelectorAll(".tyc-card").forEach((card, idx) => {
                if (isChecked) { selectedIndices.add(idx); card.classList.add("selected"); }
                else { card.classList.remove("selected"); }
            });
            countBadge.innerText = `${i18n.selected}: ${selectedIndices.size}`;
        };

        const sourceScanBtn = document.getElementById("tyc-source-scan");
        sourceScanBtn.onclick = () => {
            sourceScanBtn.innerText = i18n.processing;
            sourceScanBtn.disabled = true;
            
            setTimeout(() => {
                const sourceUrls = scanSourceCode();
                const currentSet = new Set(imgUrls);
                let addedCount = 0;
                
                sourceUrls.forEach(u => {
                    if (!currentSet.has(u)) {
                        imgUrls.push(u);
                        currentSet.add(u);
                        addedCount++;
                    }
                });

                render();
                sourceScanBtn.innerText = `Found +${addedCount}`;
                sourceScanBtn.classList.remove('tyc-btn-orange');
                sourceScanBtn.classList.add('tyc-btn-green');
                
                setTimeout(() => {
                    sourceScanBtn.innerText = i18n.sourceScan;
                    sourceScanBtn.disabled = false;
                }, 2000);
            }, 500);
        };

        document.getElementById("tyc-download").onclick = async function() {
            const selected = Array.from(selectedIndices).sort((a,b)=>a-b);
            const btn = this;
            const folder = document.getElementById("tyc-folder").value || "Chapter";
            btn.disabled = true;
            for (let i = 0; i < selected.length; i++) {
                btn.innerText = `${i+1}/${selected.length}`;
                try {
                    const blob = await getImageBlob(imgUrls[selected[i]]);
                    const jpeg = await convertToJpeg(blob);
                    if (typeof GM_download === 'function') {
                        const bUrl = URL.createObjectURL(jpeg);
                        GM_download({
                            url: bUrl,
                            name: `${folder}/image${i+1}.jpg`,
                            onload: () => URL.revokeObjectURL(bUrl)
                        });
                    } else {
                        saveAs(jpeg, `image${i+1}.jpg`);
                    }
                } catch(e) { console.error(e); }
                await new Promise(r => setTimeout(r, 400));
            }
            btn.innerText = i18n.download;
            btn.disabled = false;
        };

        document.getElementById("tyc-zip").onclick = async function() {
            const selected = Array.from(selectedIndices).sort((a,b)=>a-b);
            const btn = this;
            const zip = new JSZip();
            const title = document.title.replace(/[\\/:*?"<>|]/g, "_");
            btn.disabled = true;
            for (let i = 0; i < selected.length; i++) {
                btn.innerText = `ZIP ${Math.round(((i+1)/selected.length)*100)}%`;
                try {
                    const blob = await getImageBlob(imgUrls[selected[i]]);
                    const jpeg = await convertToJpeg(blob);
                    zip.file(`image${i+1}.jpg`, jpeg);
                } catch(e) { console.error(e); }
            }
            zip.generateAsync({type:"blob"}).then(c => {
                saveAs(c, `${title}.zip`);
                btn.innerText = i18n.zip;
                btn.disabled = false;
            });
        };
    }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.code === 'KeyW') {
            e.preventDefault();
            const existing = document.querySelector(".tyc-overlay");
            if (existing) existing.remove(); else openUI();
        }
    }, true);

    if (typeof GM_registerMenuCommand === "function") {
        GM_registerMenuCommand(i18n.menuOpen, openUI);
    }
})();

// ==UserScript==
// @name         Universal Image Downloader
// @namespace    https://greasyfork.org/en/users/1553223-ozler365
// @version      8.4.2
// @description  Professional UI, Smart Source Scan, Strict Reader Isolation, High Performance
// @author       ozler365
// @license      MIT
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/js2dzcgf26keoaqoaqssapdpzr4z
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @run-at       document-end
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/561884/Universal%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561884/Universal%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const C = {
        zh: (navigator.language || 'en').toLowerCase().includes("zh"),
        mob: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
    };

    const i18n = {
        subFolder: C.zh ? "文件夹名称" : "Folder Name",
        selectAll: C.zh ? "全选" : "Select All",
        download: C.zh ? "批量下载" : "Download All",
        zip: C.zh ? "打包下载" : "ZIP Pack",
        selected: C.zh ? "已选择" : "Selected",
        rename: C.zh ? "重命名" : "Rename",
        original: C.zh ? "原名" : "Original",
        menuOpen: C.zh ? "启动下载器" : "Open Downloader",
    };

    const getAbsUrl = (url) => {
        if (!url || typeof url !== 'string' || url.startsWith('blob:') || url.startsWith('data:')) return url;
        try { return new URL(url, document.baseURI).href; } catch(e) { return url; }
    };

    const getFilename = (url) => {
        try {
            const u = new URL(url, document.baseURI);
            let name = u.pathname.split('/').pop() || u.hostname.replace(/\./g, '_');
            return decodeURIComponent(name).replace(/[\\/:*?"<>|]/g, '_');
        } catch(e) { return 'image_' + Date.now(); }
    };

    const getImageBlob = (url) => new Promise((resolve, reject) => {
        if (url.startsWith('data:') || url.startsWith('blob:')) {
            fetch(url).then(r => r.blob()).then(resolve).catch(reject);
            return;
        }
        GM_xmlhttpRequest({
            method: "GET", url: url, responseType: "blob", anonymous: false,
            headers: { "Referer": window.location.href, "Accept": "image/*,*/*;q=0.8" },
            onload: (res) => (res.status === 200 && res.response.size > 512) ? resolve(res.response) : fetch(url).then(r => r.blob()).then(resolve).catch(reject),
            onerror: () => fetch(url).then(r => r.blob()).then(resolve).catch(reject)
        });
    });

    const convertToJpeg = (blob) => new Promise((resolve) => {
        if (blob.type === 'image/jpeg') return resolve(blob);
        const img = new Image(), url = URL.createObjectURL(blob);
        img.onload = () => {
            const cvs = document.createElement('canvas');
            cvs.width = img.width; cvs.height = img.height;
            const ctx = cvs.getContext('2d');
            ctx.fillStyle = '#FFF'; ctx.fillRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0);
            cvs.toBlob(b => { URL.revokeObjectURL(url); resolve(b || blob); }, 'image/jpeg', 0.9);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
        img.src = url;
    });

    const getImageDimensions = (url) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.width, h: img.height, ok: true });
        img.onerror = () => resolve({ w: 0, h: 0, ok: false });
        img.src = url;
        setTimeout(() => resolve({ w: 0, h: 0, ok: false }), 3000);
    });

    const getPos = (el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + (window.pageYOffset || document.documentElement.scrollTop), left: r.left + (window.pageXOffset || document.documentElement.scrollLeft) };
    };

    function openUI() {
        if (document.querySelector(".tyc-overlay")) return;
        
        const css = `.tyc-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483640;display:flex;justify-content:center;align-items:center;font-family:sans-serif;pointer-events:none}.tyc-modal{width:90vw;height:85vh;background:#fcfcfc;border-radius:12px;display:flex;flex-direction:column;overflow:hidden;resize:both;min-width:600px;box-shadow:0 10px 40px rgba(0,0,0,.4);border:1px solid #444;pointer-events:auto}.tyc-header{padding:15px 25px;background:#fff;border-bottom:1px solid #e0e0e0;display:flex;align-items:center;gap:15px;flex-wrap:wrap;cursor:move;user-select:none}.tyc-input{padding:8px 12px;border:2px solid #ccc;border-radius:6px;width:140px;font-size:14px;cursor:text!important}.tyc-btn{padding:8px 16px;border-radius:6px;border:none;cursor:pointer!important;font-weight:700;font-size:13px;color:#fff;min-width:80px;transition:.2s}.tyc-btn-blue{background:#007bff}.tyc-btn-green{background:#28a745}.tyc-btn-gray{background:#f8f9fa;color:#333;border:1px solid #ddd}.tyc-btn:hover{filter:brightness(1.1)}.tyc-badge{background:#333;color:#fff;padding:6px 12px;border-radius:20px;font-weight:700;font-size:12px}.tyc-grid{flex:1;overflow-y:auto;padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));grid-auto-rows:260px;gap:15px;background:#f0f2f5}.tyc-card{background:#fff;border-radius:8px;border:3px solid transparent;cursor:pointer!important;overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;transition:.1s}.tyc-card:hover{transform:scale(1.02)}.tyc-card.selected{border-color:#007bff;background:#edf5ff}.tyc-card.selected::after{content:"✓";position:absolute;top:5px;right:5px;background:#007bff;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700}.tyc-card img{max-width:95%;max-height:95%;object-fit:contain}@media(max-width:768px){.tyc-modal{width:95vw;height:80vh;min-width:unset}.tyc-header{padding:8px;gap:6px}.tyc-input{width:70px;font-size:12px}.tyc-grid{padding:8px;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));grid-auto-rows:140px}}`;
        
        const html = `<div class="tyc-overlay"><style>${css}</style><div class="tyc-modal" id="tyc-modal"><div class="tyc-header" id="tyc-drag"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" id="tyc-all" checked><span>${i18n.selectAll}</span></label><div style="height:25px;border-left:1px solid #ddd;margin:0 5px"></div><input type="text" id="tyc-fold" class="tyc-input" placeholder="${i18n.subFolder}"><button class="tyc-btn tyc-btn-gray" id="tyc-ren">${i18n.rename}</button><span class="tyc-badge" id="tyc-cnt">0</span><div style="flex:1"></div><button class="tyc-btn tyc-btn-blue" id="tyc-dl">${i18n.download}</button><button class="tyc-btn tyc-btn-green" id="tyc-zip">${i18n.zip}</button><button class="tyc-btn tyc-btn-gray" id="tyc-cls" style="min-width:40px">✕</button></div><div class="tyc-grid" id="tyc-grid"></div></div></div>`;
        document.body.insertAdjacentHTML("beforeend", html);

        const modal = document.getElementById("tyc-modal"), drag = document.getElementById("tyc-drag");
        let isDrag = false, oX = 0, oY = 0;
        
        drag.onmousedown = (e) => {
            if (/INPUT|BUTTON|LABEL/.test(e.target.tagName)) return;
            isDrag = true; const r = modal.getBoundingClientRect();
            oX = e.clientX - r.left; oY = e.clientY - r.top; drag.style.cursor = 'grabbing';
            e.preventDefault();
        };
        document.onmousemove = (e) => {
            if (!isDrag) return;
            modal.style.position = 'fixed'; modal.style.left = (e.clientX - oX) + 'px'; modal.style.top = (e.clientY - oY) + 'px'; modal.style.margin = '0';
        };
        document.onmouseup = () => { isDrag = false; drag.style.cursor = 'move'; };

        const grid = document.getElementById("tyc-grid"), cntBadge = document.getElementById("tyc-cnt");
        let selIdx = new Set(), imgUrls = [], seen = new Set(), timer, isScan = false;

        const scanDOM = async () => {
            if (isScan || document.hidden) return [];
            isScan = true;
            const tmp = [], loc = window.location.href;
            
            // Phase 1: Fast Image Tag Scan
            for (const img of document.images) {
                if (img.naturalWidth < 50 || img.naturalHeight < 50) continue;
                const src = getAbsUrl(img.currentSrc || img.src || img.dataset.src || img.dataset.original);
                if (src && !seen.has(src) && !src.startsWith('data:image/svg')) {
                    seen.add(src);
                    tmp.push({ url: src, pos: getPos(img), s: 3 });
                }
            }

            // Phase 2: Deep Scan (Throttled by nature of loop)
            const els = document.querySelectorAll('div, span, a, section, header, main, article, figure, li');
            for (const el of els) {
                if (el.offsetWidth < 50 && el.offsetHeight < 50) continue;
                const bg = window.getComputedStyle(el).backgroundImage;
                if (bg && bg.startsWith('url(')) {
                    const m = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
                    if (m && m[1]) {
                        const src = getAbsUrl(m[1]);
                        if (!seen.has(src) && !src.startsWith('data:image/svg')) {
                             const d = await getImageDimensions(src);
                             if (d.ok && d.w > 50 && d.h > 50) {
                                 seen.add(src);
                                 tmp.push({ url: src, pos: getPos(el), s: 1 });
                             }
                        }
                    }
                }
            }
            
            tmp.sort((a,b) => (Math.abs(a.pos.top - b.pos.top) > 10) ? a.pos.top - b.pos.top : a.pos.left - b.pos.left);
            isScan = false;
            return tmp.map(t => t.url);
        };

        const render = () => {
            const frag = document.createDocumentFragment();
            const allChk = document.getElementById("tyc-all")?.checked;
            let added = false;
            
            for (let i = grid.children.length; i < imgUrls.length; i++) {
                if (allChk) selIdx.add(i);
                const u = imgUrls[i], div = document.createElement("div");
                div.className = "tyc-card" + (selIdx.has(i) ? " selected" : "");
                div.innerHTML = `<img src="${u}" loading="lazy" onerror="this.parentElement.remove()">`;
                div.onclick = () => {
                    selIdx.has(i) ? selIdx.delete(i) : selIdx.add(i);
                    div.classList.toggle("selected");
                    cntBadge.innerText = `${i18n.selected}: ${selIdx.size}`;
                };
                frag.appendChild(div);
                added = true;
            }
            if (added) {
                grid.appendChild(frag);
                cntBadge.innerText = `${i18n.selected}: ${selIdx.size}`;
            }
        };

        const loop = async () => {
            const newU = await scanDOM();
            if (newU.length) { imgUrls.push(...newU); render(); }
            timer = setTimeout(loop, 3000);
        };
        loop();

        document.getElementById("tyc-ren").onclick = function() { this.innerText = (this.innerText === i18n.rename) ? i18n.original : i18n.rename; };
        
        document.getElementById("tyc-all").onchange = (e) => {
            selIdx.clear();
            const chk = e.target.checked, cards = grid.children;
            for(let i=0; i<cards.length; i++) {
                if(chk) { selIdx.add(i); cards[i].classList.add("selected"); }
                else cards[i].classList.remove("selected");
            }
            cntBadge.innerText = `${i18n.selected}: ${selIdx.size}`;
        };

        document.getElementById("tyc-cls").onclick = () => { clearTimeout(timer); document.querySelector(".tyc-overlay").remove(); };

        const processDL = async (isZip) => {
            const idxs = Array.from(selIdx).sort((a,b)=>a-b);
            if (!idxs.length) return;
            const btn = document.getElementById(isZip ? "tyc-zip" : "tyc-dl");
            const ren = document.getElementById("tyc-ren").innerText === i18n.rename;
            const pre = (document.getElementById("tyc-fold").value.trim() || "") + (isZip ? "" : "/");
            const zip = isZip ? new JSZip() : null;
            const used = new Set();
            
            btn.disabled = true;
            for (let i = 0; i < idxs.length; i++) {
                btn.innerText = `${Math.round(((i+1)/idxs.length)*100)}%`;
                try {
                    const u = imgUrls[idxs[i]], b = await convertToJpeg(await getImageBlob(u));
                    let n = ren ? `image${idxs[i]+1}.jpg` : getFilename(u);
                    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(n)) n += '.jpg';
                    let base = n, c = 1;
                    while(used.has(n)) {
                        const dot = base.lastIndexOf('.');
                        n = (dot > -1 ? base.slice(0, dot) : base) + `_${c++}` + (dot > -1 ? base.slice(dot) : '');
                    }
                    used.add(n);
                    
                    if (isZip) zip.file(n, b);
                    else if (!C.mob && GM_download) {
                        const bu = URL.createObjectURL(b);
                        GM_download({ url: bu, name: pre + n, onload: () => URL.revokeObjectURL(bu) });
                        await new Promise(r => setTimeout(r, 200));
                    } else saveAs(b, n);
                } catch(e) { console.error(e); }
            }
            
            if (isZip) zip.generateAsync({type:"blob"}).then(c => saveAs(c, document.title.replace(/[\\/:*?"<>|]/g,"_")+".zip"));
            btn.innerText = isZip ? i18n.zip : i18n.download;
            btn.disabled = false;
        };

        document.getElementById("tyc-dl").onclick = () => processDL(false);
        document.getElementById("tyc-zip").onclick = () => processDL(true);
    }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.code === 'KeyW') { e.preventDefault(); document.querySelector(".tyc-overlay") ? document.querySelector(".tyc-overlay").remove() : openUI(); }
    }, true);
    if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand(i18n.menuOpen, openUI);
})();

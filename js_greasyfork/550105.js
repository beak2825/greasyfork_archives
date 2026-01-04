// ==UserScript==
// @name         SGL Downloader
// @namespace    local.tools
// @version      7.14 (Prescan & Clear)
// @author       tofuwarrior
// @description  A streamlined version of the SGL Downloader with corrected logging and downloads.
// @match        https://*/threads/*
// @match        http://*/threads/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550105/SGL%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550105/SGL%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- helpers ---------- */
    const SEL_PIC_WRAPPER = '.js-lbImage, a[href*="/attachments/"]';
    const SEL_VID = 'a[href*="/data/video/"],video[src*="/data/video/"],source[src*="/data/video/"]';
    const SEL_POST_CONTAINER = 'article.message, .message-cell--main';
    const PAGE_RE = /\/page-(\d+)(?:#|$)/;
    const DEF = { includePictures: 1, includeVideos: 1, includeZips: 1, startPost: '', endPost: '', delayMs: 650, filenameMode: 'title', customBase: '', darkMode: 0, logOpen: 1, optsOpen: 1, numberingOverride: '', addLocation: false, saveLogFile: true };
    const G = (k) => GM_getValue(k, DEF[k]); const S = (k, v) => GM_setValue(k, v);

    function strip(s) { return (s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, ''); }
    function clean(s) { return strip((s || '').trim()).replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').replace(/^\.+/, '').slice(0, 120) || 'file'; }
    function title() { const h = document.querySelector('h1.p-title-value'); if (!h) return clean(document.title || 'thread'); const c = h.cloneNode(true); c.querySelectorAll('.label,.label-append,.username,.u-concealed,.p-title-pageAction').forEach(el => el.remove()); return clean(c.textContent || ''); }
    function abs(u) { try { return new URL(u, location.href).toString(); } catch { return null; } }
    function getMainTag() { return document.querySelector('h1.p-title-value span.label')?.textContent.trim() || null; }

    function getFullSizeUrl(mediaEl) {
        if (!mediaEl) return null;
        const lightboxWrapper = mediaEl.closest('.js-lbImage');
        if (lightboxWrapper && lightboxWrapper.dataset.src) { return abs(lightboxWrapper.dataset.src); }
        if (mediaEl.tagName === 'A' && mediaEl.href) { return abs(mediaEl.href); }
        if (mediaEl.src) { return abs(mediaEl.src); }
        const nestedImg = mediaEl.querySelector('img.bbImage');
        if (nestedImg && nestedImg.src) return abs(nestedImg.src);
        return null;
    }

    function extractCustomFields(doc) {
        const fields = [];
        const container = doc.querySelector('.blockStatus-message');
        if (!container) return '';

        container.querySelectorAll('dl.pairs--customField').forEach(dl => {
            const keyElement = dl.querySelector('dt');
            const valueElement = dl.querySelector('dd');
            if (keyElement && valueElement) {
                const key = keyElement.textContent.trim();
                const linkInValue = valueElement.querySelector('a');
                const value = linkInValue ? linkInValue.href : valueElement.textContent.trim();
                if (key && value) {
                    fields.push(`${key}: ${value}`);
                }
            }
        });
        return fields.join('\n');
    }

    function collect(doc, includePics, includeVids, includeZips) {
        const items = [];
        const postContainers = doc.querySelectorAll(SEL_POST_CONTAINER);
        postContainers.forEach(container => {
            const postLinks = container.querySelectorAll('a[href*="/post-"]');
            const postLinkEl = Array.from(postLinks).find(a => a.textContent.trim().startsWith('#'));
            const postNumber = postLinkEl ? parseInt(postLinkEl.textContent.trim().replace('#', ''), 10) : null;
            const processedWrappers = new WeakSet();

            container.querySelectorAll(SEL_PIC_WRAPPER).forEach(el => {
                const wrapper = el.closest(SEL_PIC_WRAPPER);
                if (wrapper && !processedWrappers.has(wrapper)) {
                    const url = getFullSizeUrl(wrapper);
                    if (!url) return;

                    const isArchive = /\b(zip|rar|7z)\b/i.test(url);
                    if (isArchive) {
                        if (includeZips) items.push({ url, postNumber, type: 'zip' });
                    } else {
                        if (includePics) items.push({ url, postNumber, type: 'image' });
                    }
                    processedWrappers.add(wrapper);
                }
            });

            if (includeVids) {
                container.querySelectorAll(SEL_VID).forEach(el => {
                    const url = getFullSizeUrl(el);
                    if (url) items.push({ url, postNumber, type: 'video' });
                });
            }
        });
        return items;
    }

    function collectWeblinks(doc) {
        const weblinks = [];
        const messages = doc.querySelectorAll(SEL_POST_CONTAINER);
        messages.forEach(message => {
            const postLinks = message.querySelectorAll('a[href*="/post-"]');
            const postLinkEl = Array.from(postLinks).find(a => a.textContent.trim().startsWith('#'));
            const postNumber = postLinkEl ? parseInt(postLinkEl.textContent.trim().replace('#', ''), 10) : null;
            if (!postNumber) return;
            const contentArea = message.querySelector('.message-body, .bbWrapper');
            if (contentArea) {
                contentArea.querySelectorAll('a[href]').forEach(link => {
                    if (link.protocol.startsWith('http') && !link.href.includes('/attachments/')) {
                        weblinks.push({ postNumber, url: abs(link.href) });
                    }
                });
            }
        });
        return weblinks;
    }

    function lastPage(d) { let m = 1; [...d.querySelectorAll('a[href*="/page-"]')].forEach(a => { const t = a.href.match(PAGE_RE); if (t) m = Math.max(m, +t[1]); }); [...d.querySelectorAll('[data-page],.pageNav-page,[data-xf-init="page-nav"] [data-page]')].forEach(el => { const n = parseInt(el.getAttribute('data-page') || el.textContent, 10); if (!Number.isNaN(n)) m = Math.max(m, n); }); return m; }

    function infer(u) { try { const seg = decodeURIComponent(new URL(u).pathname.split('/').filter(Boolean).pop() || 'file'); return clean(seg.replace(/\.[^/.]+$/, "")); } catch { return 'file'; } }

    function generateBaseName({ i, b, m, t, c, loc }) {
        if (m === 'server') { return clean(b); }
        let base = clean(m === 'custom' ? (c || 'file') : (t || 'thread'));
        if (loc) { base = `${base} [${loc}]`; }
        return `${base} - ${String(i + 1).padStart(3, '0')}`;
    }

    function saveTextAsFile(text, filename) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        GM_download({ url: url, name: filename, onload: () => URL.revokeObjectURL(url) });
    }

    function formatBytes(bytes, decimals = 2) {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function getExtFromMime(mimeType = '') {
        const mimeMap = {
            'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif', 'image/webp': '.webp',
            'video/mp4': '.mp4', 'video/quicktime': '.mov', 'video/x-ms-wmv': '.wmv', 'video/x-matroska': '.mkv',
            'application/zip': '.zip', 'application/x-rar-compressed': '.rar', 'application/x-7z-compressed': '.7z',
            'application/octet-stream': ''
        };
        return mimeMap[mimeType] ?? '';
    }

    function getExtFromUrlHint(url) {
        if (/\bzip\b/i.test(url)) return '.zip';
        if (/\brar\b/i.test(url)) return '.rar';
        if (/\b7z\b/i.test(url)) return '.7z';
        return '';
    }

    /* ---------- styles & UI ---------- */
    const addCss = () => { if (document.getElementById('bad-styles')) return; const s = document.createElement('style'); s.id = 'bad-styles'; s.textContent = `
        #bad-root.dark .panel{background:#141414 !important;color:#e6e6e6 !important;border-color:#333 !important;}
        #bad-root.dark .hdr{border-color:#2a2a2a !important;}
        #bad-root.dark input,#bad-root.dark select,#bad-root.dark button{background:#1e1e1e !important;color:#e6e6e6 !important;border:1px solid #333 !important;}
        #bad-root.dark select option{background:#1e1e1e;color:#e6e6e6;}
        #bad-root.dark .logbox{background:#0f0f0f !important;border-color:#2a2a2a !important;color:#e6e6e6 !important;}
        #bad-root.dark .barbg{background:#242424 !important;}
        #bad-root.dark .bardl{background:#2ea043 !important;}
        #bad-root .ctrls button[disabled]{opacity:.6;cursor:not-allowed;}
    `; document.head.appendChild(s); };

    const LAUNCH = 'bad-launch';
    const launcher = () => { if (document.getElementById('bad-root') || document.getElementById(LAUNCH) || !document.body) return; const b = document.createElement('button'); b.id = LAUNCH; b.textContent = 'Download attachments'; Object.assign(b.style, { position: 'fixed', bottom: '20px', right: '20px', zIndex: 2147483647, padding: '8px 10px', fontSize: '13px', cursor: 'pointer' }); b.onclick = () => { createPanel(); b.remove(); }; document.body.appendChild(b); };

    const createPanel = () => {
        addCss();
        const r = document.createElement('div'); r.id = 'bad-root'; if (G('darkMode')) r.className = 'dark';
        r.innerHTML = `
          <div class="panel" style="all:initial;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;position:fixed;bottom:20px;right:20px;z-index:2147483646;width:560px;background:#fff;color:#111;border:1px solid #ccc;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.18);">
            <div class="hdr" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #eee;">
              <strong>SGL Downloader</strong>
              <div style="display:flex;align-items:center;gap:10px;">
                <label style="all:unset;display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                  <input type="checkbox" id="bad-dark" ${G('darkMode') ? 'checked' : ''} style="all:unset;width:14px;height:14px;border:1px solid #999;">
                  <span>Dark</span>
                </label>
                <button id="bad-close" style="all:unset;cursor:pointer;padding:4px 6px;">â</button>
              </div>
            </div>
            <div style="padding:10px;font-size:12px;">
              <details id="bad-opts" ${G('optsOpen') ? 'open' : ''}>
                <summary style="cursor:pointer;">Options</summary>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:10px;margin-top:10px;">
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="bad-pics"><span>Include pictures</span></label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="bad-vids"><span>Include videos</span></label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="bad-zips"><span>Include zips</span></label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="bad-add-loc"><span>Add Main Tag in []</span></label>
                  <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" id="bad-save-log"><span>Save log file</span></label>
                  <label style="grid-column: 1 / -1;">Post from <input id="bad-start-post" type="number" min="1" placeholder="1" style="width:100%;"></label>
                  <label style="grid-column: 1 / -1;">Post to <input id="bad-end-post" type="number" min="1" placeholder="Last" style="width:100%;"></label>
                  <label style="grid-column: 1 / -1;">Numbering Override <input id="bad-num-override" type="number" min="1" placeholder="Auto" style="width:100%;"></label>
                  <label style="grid-column: 1 / -1;">Delay (ms) <input id="bad-delay" type="number" min="0" step="50" style="width:100%;"></label>
                  <label style="grid-column: 1 / -1;">Filename mode
                    <select id="bad-mode" style="width:100%;">
                      <option value="server">Server-provided</option>
                      <option value="custom">Custom base + numbered</option>
                      <option value="title">Thread title + numbered</option>
                    </select>
                  </label>
                  <label style="grid-column:1/-1;">Custom base <input id="bad-custom" type="text" style="width:100%;"></label>
                </div>
              </details>

              <div style="margin-top:10px;">Overall progress</div>
              <div class="barbg" style="height:8px;background:#f2f2f2;border-radius:4px;overflow:hidden;">
                <div id="bad-bar" class="bardl" style="height:8px;width:0%;background:#35aa53;"></div>
              </div>
              <div id="bad-txt" style="font-size:11px;color:#555;margin-top:2px;">0 / 0</div>

              <div class="ctrls" style="display:flex;justify-content:center;gap:8px;margin-top:12px;">
                <button id="bad-prescan" style="all:unset;cursor:pointer;padding:6px 12px;border:1px solid #ccc;border-radius:6px;">Prescan</button>
                <button id="bad-start"   style="all:unset;cursor:pointer;padding:6px 12px;border:1px solid #ccc;border-radius:6px;">Start</button>
                <button id="bad-pause"   style="all:unset;cursor:pointer;padding:6px 12px;border:1px solid #ccc;border-radius:6px;" disabled>Pause</button>
                <button id="bad-resume"  style="all:unset;cursor:pointer;padding:6px 12px;border:1px solid #ccc;border-radius:6px;" disabled>Resume</button>
                <button id="bad-stop"    style="all:unset;cursor:pointer;padding:6px 12px;border:1px solid #ccc;border-radius:6px;" disabled>Stop</button>
                <button id="bad-clear"   style="all:unset;cursor:pointer;padding:6px 12px;border:1px solid #ccc;border-radius:6px;">Clear</button>
              </div>

              <details id="bad-log-det" ${G('logOpen') ? 'open' : ''} style="margin-top:8px;">
                <summary style="cursor:pointer;">Log</summary>
                <div id="bad-log" class="logbox" style="height:220px;overflow:auto;border:1px solid #eee;border-radius:6px;padding:6px;font-family:ui-monospace,Consolas,monospace;font-size:11px;background:#fafafa;margin-top:6px;"></div>
              </details>
            </div>
          </div>
        `;
        document.body.appendChild(r);
        const $ = s => r.querySelector(s);

        const ui = { pics: $('#bad-pics'), vids: $('#bad-vids'), zips: $('#bad-zips'), addLoc: $('#bad-add-loc'), saveLog: $('#bad-save-log'), startPost: $('#bad-start-post'), endPost: $('#bad-end-post'), delay: $('#bad-delay'), mode: $('#bad-mode'), custom: $('#bad-custom'), start: $('#bad-start'), pause: $('#bad-pause'), resume: $('#bad-resume'), stop: $('#bad-stop'), prescan: $('#bad-prescan'), clear: $('#bad-clear'), bar: $('#bad-bar'), txt: $('#bad-txt'), log: $('#bad-log'), dark: $('#bad-dark'), logDet: $('#bad-log-det'), optsDet: $('#bad-opts'), numOverride: $('#bad-num-override') };

        ui.pics.checked = G('includePictures'); ui.vids.checked = G('includeVideos'); ui.zips.checked = G('includeZips'); ui.addLoc.checked = G('addLocation'); ui.saveLog.checked = G('saveLogFile'); ui.delay.value = G('delayMs'); ui.mode.value = G('filenameMode'); ui.custom.value = G('customBase'); ui.startPost.value = G('startPost'); ui.endPost.value = G('endPost'); ui.numOverride.value = G('numberingOverride');

        ui.pics.onchange = e => S('includePictures', e.target.checked);
        ui.vids.onchange = e => S('includeVideos', e.target.checked);
        ui.zips.onchange = e => S('includeZips', e.target.checked);
        ui.addLoc.onchange = e => S('addLocation', e.target.checked);
        ui.saveLog.onchange = e => S('saveLogFile', e.target.checked);
        ui.delay.onchange = e => S('delayMs', Math.max(0, +e.target.value || 50));
        ui.mode.onchange = e => S('filenameMode', e.target.value);
        ui.custom.onchange = e => S('customBase', e.target.value || '');
        ui.logDet.addEventListener('toggle', () => S('logOpen', ui.logDet.open));
        ui.optsDet.addEventListener('toggle', () => S('optsOpen', ui.optsDet.open));
        ui.dark.onchange = () => { S('darkMode', ui.dark.checked); r.classList.toggle('dark', ui.dark.checked); };
        ui.startPost.onchange = e => S('startPost', e.target.value);
        ui.endPost.onchange = e => S('endPost', e.target.value);
        ui.numOverride.onchange = e => S('numberingOverride', e.target.value);
        r.querySelector('#bad-close').onclick = () => { r.remove(); launcher(); };

        let logMessages = [];
        const log = m => {
            const message = `[${new Date().toLocaleTimeString()}] ${m}`;
            logMessages.push(message);
            const d = document.createElement('div');
            d.innerHTML = message.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
            ui.log.appendChild(d);
            ui.log.scrollTop = ui.log.scrollHeight;
        };

        const bar = (c, t) => { ui.bar.style.width = t ? Math.round(c / t * 100) + '%' : '0%'; ui.txt.textContent = `${c} / ${t}`; };
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        const fetchAndDownload = async (item, nameWithoutExt) => {
            const url = item.u;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 20000);

                const resp = await fetch(url, { credentials: 'include', signal: controller.signal });
                clearTimeout(timeoutId);

                const contentType = resp.headers.get('content-type') || '';
                if (contentType.startsWith('text/html')) {
                    return { success: false, size: 0, extension: '', finalFilename: '' };
                }

                const blob = await resp.blob();
                let extension = getExtFromMime(blob.type);
                if (!extension) { extension = getExtFromUrlHint(url); }
                const finalFilename = `${nameWithoutExt}${extension}`;

                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = finalFilename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

                return { success: true, size: blob.size, extension, finalFilename };
            } catch (err) {
                if (err.name === 'AbortError') { throw new Error('Fetch timed out'); }
                throw err;
            }
        };

        const performScan = async (opts) => {
            log(`Scanning all thread pages (1 to ${opts.lastPageNum})...`);
            const baseUrl = new URL(location.href);
            const tpl = (() => { const p = baseUrl.pathname.replace(/\/page-\d+/, '').replace(/\/+$/, ''); return `${baseUrl.origin}${p}/page-{n}#posts`; })();
            const docs = [];
            for (let p = 1; p <= opts.lastPageNum; p++) {
                log(`Fetching page ${p}...`);
                try {
                     const t = await fetch(tpl.replace('{n}', p), { credentials: 'include' }).then(r => r.text());
                     docs.push(new DOMParser().parseFromString(t, 'text/html'));
                } catch {
                     docs.push(null);
                }
            }

            let totalPostsScanned = 0;
            docs.forEach(doc => { if(doc) totalPostsScanned += doc.querySelectorAll(SEL_POST_CONTAINER).length; });

            let allItems = docs.flatMap(d => d ? collect(d, opts.pics, opts.vids, opts.zips) : []);

            const uniqueItems = new Map();
            allItems.forEach(item => { if (!uniqueItems.has(item.url)) { uniqueItems.set(item.url, item); } });
            let allUniqueItems = Array.from(uniqueItems.values());
            allUniqueItems.sort((a, b) => (a.postNumber || 0) - (b.postNumber || 0));

            let filteredItems = allUniqueItems.filter(item => {
                if (!item.postNumber) return false;
                return item.postNumber >= opts.startPost && item.postNumber <= opts.endPost;
            });
            log(`Found ${allUniqueItems.length} unique media items total.`);
            log(`Filtering to posts between #${opts.startPost} and #${opts.endPost === Infinity ? 'Last' : opts.endPost}: ${filteredItems.length} items to download.`);

            return { docs, filteredItems, totalPostsScanned, postsWithMedia: new Set(allUniqueItems.map(item => item.postNumber).filter(Boolean)) };
        };

        const getMediaSize = (url) => new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: url,
                onload: (resp) => {
                    const size = parseInt(resp.responseHeaders.match(/content-length:\s*(\d+)/i)?.[1] || '0', 10);
                    const mime = resp.responseHeaders.match(/content-type:\s*([^\s;]+)/i)?.[1] || '';
                    resolve({ size, mime });
                },
                onerror: () => resolve({ size: 0, mime: '' })
            });
        });

        let RUN = null;

        ui.clear.onclick = () => {
            ui.custom.value = ''; S('customBase', '');
            ui.startPost.value = ''; S('startPost', '');
            ui.endPost.value = ''; S('endPost', '');
            ui.numOverride.value = ''; S('numberingOverride', '');
            ui.delay.value = DEF.delayMs; S('delayMs', DEF.delayMs);
            ui.log.innerHTML = '';
            logMessages.length = 0;
            log('Cleared settings and log.');
        };

        ui.prescan.onclick = async () => {
            log('Starting prescan...');
            const scanOpts = {
                pics: ui.pics.checked, vids: ui.vids.checked, zips: ui.zips.checked,
                startPost: parseInt(ui.startPost.value, 10) || 1,
                endPost: parseInt(ui.endPost.value, 10) || Infinity,
                lastPageNum: lastPage(document)
            };
            const { filteredItems, totalPostsScanned, postsWithMedia } = await performScan(scanOpts);

            log('Prescan complete. Fetching file sizes...');
            bar(0, filteredItems.length);
            const savedFilesData = [];
            for (let i = 0; i < filteredItems.length; i++) {
                const item = filteredItems[i];
                const { size, mime } = await getMediaSize(item.url);
                let extension = getExtFromMime(mime);
                if (!extension) extension = getExtFromUrlHint(item.url);
                savedFilesData.push({ type: item.type, size, extension });
                bar(i + 1, filteredItems.length);
                await sleep(50); // Small delay between HEAD requests
            }

            const imageItems = savedFilesData.filter(i => i.type === 'image');
            const videoItems = savedFilesData.filter(i => i.type === 'video');
            const zipItems = savedFilesData.filter(i => i.type === 'zip');
            let totalImageSize = imageItems.reduce((sum, i) => sum + i.size, 0);
            let totalVideoSize = videoItems.reduce((sum, i) => sum + i.size, 0);
            let totalZipSize = zipItems.reduce((sum, i) => sum + i.size, 0);

            const countExtensions = (list) => {
                const counts = list.reduce((acc, item) => {
                    const ext = item.extension.replace('.', '') || 'unknown';
                    acc[ext] = (acc[ext] || 0) + 1; return acc;
                }, {});
                return Object.entries(counts).map(([ext, count]) => `${count} ${ext}`).join(', ');
            };
            const imageBreakdown = imageItems.length > 0 ? ` (${countExtensions(imageItems)})` : '';
            const videoBreakdown = videoItems.length > 0 ? ` (${countExtensions(videoItems)})` : '';
            const zipBreakdown = zipItems.length > 0 ? ` (${countExtensions(zipItems)})` : '';

            const prescanSummary = `
Prescan Summary:
- Total Posts Scanned: ${totalPostsScanned}.
- Posts with Media Found: ${postsWithMedia.size}.
- Media Count: ${imageItems.length} Images${imageBreakdown}, ${videoItems.length} Videos${videoBreakdown}, ${zipItems.length} Archives${zipBreakdown}.
- Total Download Size: ${formatBytes(totalImageSize + totalVideoSize + totalZipSize)} (${formatBytes(totalImageSize)} Images, ${formatBytes(totalVideoSize)} Videos, ${formatBytes(totalZipSize)} Archives).
            `.trim().replace(/^\s+/gm, '');
            log(prescanSummary);
        };

        ui.start.onclick = async () => {
            if (RUN && RUN.run) return;

            const state = { run: true, stop: false, pause: false };
            RUN = state;
            ui.pause.disabled = false; ui.stop.disabled = false; ui.resume.disabled = true;
            ui.pause.onclick = () => { state.pause = true; ui.pause.disabled = true; ui.resume.disabled = false; log('Paused'); };
            ui.resume.onclick = () => { state.pause = false; ui.pause.disabled = false; ui.resume.disabled = true; log('Resumed'); };
            ui.stop.onclick = () => { state.stop = true; log('Stopping'); };

            const pics = ui.pics.checked, vids = ui.vids.checked, zips = ui.zips.checked, delay = Math.max(0, +ui.delay.value || 650);
            const mode = ui.mode.value, custom = ui.custom.value, th = title();
            const startPostFilter = parseInt(ui.startPost.value, 10) || 1;
            const endPostFilter = parseInt(ui.endPost.value, 10) || Infinity;
            const numberingOverride = parseInt(ui.numOverride.value, 10);
            const addLocation = ui.addLoc.checked;
            const saveLog = ui.saveLog.checked;
            const locTag = addLocation ? getMainTag() : null;
            const customFieldsInfo = extractCustomFields(document);

            log(`Thread: ${th}`);
            if (locTag) log(`Main tag found: [${locTag}]`);

            const scanOpts = { pics, vids, zips, startPost: startPostFilter, endPost: endPostFilter, lastPageNum: lastPage(document) };
            const { docs, filteredItems, totalPostsScanned, postsWithMedia } = await performScan(scanOpts);

            const allUniqueItems = [...new Map(filteredItems.map(item => [item.url, item])).values()];

            let startNumber = 1;
            if (numberingOverride) {
                startNumber = numberingOverride;
                log(`Using numbering override. Starting at: ${startNumber}`);
            } else if (startPostFilter > 1) {
                const preScanOpts = { ...scanOpts, startPost: 1, endPost: startPostFilter - 1 };
                const { filteredItems: preItems } = await performScan(preScanOpts);
                startNumber = preItems.length + 1;
                log(`Auto-calculated start number. Found ${preItems.length} files before post #${startPostFilter}. Starting at: ${startNumber}`);
            }

            const items = filteredItems.map((item, index) => ({ u: item.url, b: infer(item.u), i: index, type: item.type, filenameHint: item.filenameHint }));
            bar(0, items.length);

            let done = 0, ok = 0, fail = 0;
            let totalFiles = items.length;
            const savedFilesData = [];
            let totalImageSize = 0, totalVideoSize = 0, totalZipSize = 0;

            for (let i = 0; i < items.length; i++) {
                const it = items[i];
                if (state.stop) break; while (state.pause && !state.stop) await sleep(150);

                const finalIndex = startNumber + i - 1;
                const nameWithoutExt = generateBaseName({ i: finalIndex, b: it.b, m: mode, t: th, c: custom, loc: locTag });

                try {
                    const result = await fetchAndDownload(it, nameWithoutExt);
                    if (result.success) {
                        ok++;
                        savedFilesData.push({ type: it.type, extension: result.extension, size: result.size });
                        log(`Saved: ${result.finalFilename}\n    â³ Source: ${it.u}`);
                        if (it.type === 'image') totalImageSize += result.size;
                        else if (it.type === 'video') totalVideoSize += result.size;
                        else if (it.type === 'zip') totalZipSize += result.size;
                    } else {
                        totalFiles--;
                        log(`Skipped HTML: ${it.u}`);
                    }
                } catch(err) {
                    fail++;
                    totalFiles--;
                    log(`Failed: ${it.u} - ${err.message}`);
                }
                done++;
                bar(ok, totalFiles);
                if (delay && done < items.length) {
                    const e = Date.now() + delay; while (Date.now() < e && !state.stop) { while (state.pause && !state.stop) await sleep(150); await sleep(50); }
                }
            }

            const imageItems = savedFilesData.filter(i => i.type === 'image');
            const videoItems = savedFilesData.filter(i => i.type === 'video');
            const zipItems = savedFilesData.filter(i => i.type === 'zip');
            const countExtensions = (list) => {
                const counts = list.reduce((acc, item) => {
                    const ext = item.extension.replace('.', '') || 'unknown';
                    acc[ext] = (acc[ext] || 0) + 1; return acc;
                }, {});
                return Object.entries(counts).map(([ext, count]) => `${count} ${ext}`).join(', ');
            };
            const imageBreakdown = imageItems.length > 0 ? ` (${countExtensions(imageItems)})` : '';
            const videoBreakdown = videoItems.length > 0 ? ` (${countExtensions(videoItems)})` : '';
            const zipBreakdown = zipItems.length > 0 ? ` (${countExtensions(zipItems)})` : '';

            const finalSummary = `
Finished.
- Downloads: ${ok} OK, ${fail} Failed, ${totalFiles - ok} Skipped.
- Total Posts Scanned: ${totalPostsScanned}.
- Posts with Media Found: ${postsWithMedia.size}.
- Media Count: ${imageItems.length} Images${imageBreakdown}, ${videoItems.length} Videos${videoBreakdown}, ${zipItems.length} Archives${zipBreakdown}.
- Total Download Size: ${formatBytes(totalImageSize + totalVideoSize + totalZipSize)} (${formatBytes(totalImageSize)} Images, ${formatBytes(totalVideoSize)} Videos, ${formatBytes(totalZipSize)} Archives).
            `.trim().replace(/^\s+/gm, '');
            log(finalSummary);

            if (saveLog) {
                let lastPostInfo = 'Could not determine last post information.';
                const lastDoc = docs[docs.length - 1];
                if (lastDoc) {
                    const postsOnLastPage = Array.from(lastDoc.querySelectorAll(SEL_POST_CONTAINER)).reverse();
                    for (const postEl of postsOnLastPage) {
                        const lastPostLinkEl = Array.from(postEl.querySelectorAll('a[href*="/post-"]')).find(a => a.textContent.trim().startsWith('#'));
                        if (lastPostLinkEl) {
                            const lastPostNumber = lastPostLinkEl.textContent.trim();
                            const timeEl = postEl.querySelector('time.u-dt[title]');
                            const lastPostTimestamp = timeEl ? timeEl.title : 'N/A';
                            lastPostInfo = `The last post number was ${lastPostNumber} and posted on: ${lastPostTimestamp}`;
                            break;
                        }
                    }
                }

                const settingsLines = [
                    'Download Session Log',
                    '--------------------',
                    `Thread Title: ${th}`,
                    `URL: ${location.href}`
                ];
                if (customFieldsInfo) { settingsLines.push(customFieldsInfo); }
                settingsLines.push(`Date: ${new Date().toLocaleString()}`);
                settingsLines.push('');
                settingsLines.push('Settings Used:');
                settingsLines.push(`- Pictures: ${pics ? 'Yes' : 'No'}`);
                settingsLines.push(`- Videos: ${vids ? 'Yes' : 'No'}`);
                settingsLines.push(`- Archives: ${zips ? 'Yes' : 'No'}`);
                settingsLines.push(`- Post Range: #${startPostFilter} to #${endPostFilter === Infinity ? 'Last' : endPostFilter}`);
                settingsLines.push(`- Filename mode: ${mode}`);
                if (mode === 'custom') { settingsLines.push(`- Custom Base: ${custom || 'Not specified'}`); }
                settingsLines.push(`- Add Main Tag: ${addLocation ? `Yes (${locTag || 'Not found'})` : 'No'}`);
                settingsLines.push(`- Numbering Override: ${numberingOverride || 'Auto'}`);
                settingsLines.push(`- Delay: ${delay}ms`);
                const settingsSummary = settingsLines.join('\n');

                const allWeblinks = docs.flatMap(d => d ? collectWeblinks(d) : []);
                const uniqueWeblinksMap = new Map();
                allWeblinks.forEach(link => { const key = `${link.postNumber}-${link.url}`; if (!uniqueWeblinksMap.has(key)) { uniqueWeblinksMap.set(key, link); } });
                const allUniqueWeblinks = Array.from(uniqueWeblinksMap.values()).sort((a, b) => (a.postNumber || 0) - (b.postNumber || 0));
                const filteredWeblinks = allUniqueWeblinks.filter(link => !link.url.startsWith('https://shesgotleaks.com/goto'));
                const weblinksList = filteredWeblinks.length > 0 ? filteredWeblinks.map(link => `Post #${link.postNumber}: ${link.url}`).join('\n') : 'None.';

                const fullLogText = logMessages.join('\n');
                const logFileContent = `${settingsSummary}\n\nSummary:\n${finalSummary.replace(/^- /gm, '  - ')}\n\nWeblinks Found:\n--------------------\n${weblinksList}\n\nFull Event Log:\n--------------------\n${fullLogText}\n\n${lastPostInfo}`;

                let logBaseName = clean(th);
                if (mode === 'custom' && custom) { logBaseName = clean(custom); }
                const locationPart = locTag ? ` [${clean(locTag)}]` : '';
                const logFilename = `${logBaseName}${locationPart} [log].txt`;

                saveTextAsFile(logFileContent, logFilename);
            }

            state.run = false; ui.pause.disabled = true; ui.resume.disabled = true; ui.stop.disabled = true;
        };
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', launcher, { once: true }); else launcher();
    window.addEventListener('pageshow', launcher);
    new MutationObserver(launcher).observe(document.documentElement, { childList: true, subtree: true });
    setInterval(launcher, 3000);
})();
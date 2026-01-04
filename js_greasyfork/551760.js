// ==UserScript==
// @name         Pixeldrain Download Bypass Enhanced
// @description  Bypass Pixeldrain Download Limit - enhanced, gallery,Albums ZIP support
// @version      1.0.1
// @author       GameDrive.Org
// @homepageURL  https://greasyfork.org/users/1290286
// @match        https://pixeldrain.com/*
// @match        https://pixeldrain.net/*
// @match        https://pixeldrain.dev/*
// @match        https://pixeldra.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixeldrain.com
// @grant        GM_openInTab
// @license      MIT

// @namespace https://greasyfork.org/users/1290286
// @downloadURL https://update.greasyfork.org/scripts/551760/Pixeldrain%20Download%20Bypass%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/551760/Pixeldrain%20Download%20Bypass%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROXY_JSON_URL = 'https://pixeldrain-bypass.cybar.to/api/proxy.json';
    const PROXY_LIST_KEY = 'pd_proxy_list_v3';
    const PROXY_TS_KEY = 'pd_proxy_list_ts_v3';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    const idRegex = /\/api\/file\/(\w+)\//;

    function nowMs(){ return Date.now(); }

    function normalizeProxyEntry(entry){
        if(!entry || typeof entry !== 'string') return null;
        entry = entry.trim();
        if(/^https?:\/\//i.test(entry)) return entry.endsWith('/') ? entry : entry + '/';
        return 'https://' + (entry.endsWith('/') ? entry : entry + '/');
    }

    async function loadProxyListCached(){
        const ts = parseInt(localStorage.getItem(PROXY_TS_KEY) || '0', 10);
        const cached = localStorage.getItem(PROXY_LIST_KEY);
        if(cached && (nowMs() - ts) < CACHE_TTL_MS){
            try {
                const parsed = JSON.parse(cached);
                if(Array.isArray(parsed) && parsed.length) return parsed;
            } catch(e){}
        }
        try {
            const resp = await fetch(PROXY_JSON_URL, { cache: 'no-store' });
            if(!resp.ok) throw new Error('fetch failed ' + resp.status);
            const json = await resp.json();
            let list = [];
            if(json && Array.isArray(json.proxies)) list = json.proxies.slice();
            else if(json && typeof json.proxy === 'string') list = [json.proxy];
            else if(Array.isArray(json)) list = json.slice();
            const normalized = list.map(normalizeProxyEntry).filter(Boolean);
            if(normalized.length){
                localStorage.setItem(PROXY_LIST_KEY, JSON.stringify(normalized));
                localStorage.setItem(PROXY_TS_KEY, String(nowMs()));
                return normalized;
            }
            if(cached){
                try { const parsed = JSON.parse(cached); if(Array.isArray(parsed) && parsed.length) return parsed; } catch(e){}
            }
            return [];
        } catch(e){
            if(cached){
                try { const parsed = JSON.parse(cached); if(Array.isArray(parsed) && parsed.length) return parsed; } catch(err){}
            }
            return [];
        }
    }

    function chooseRandom(list){
        if(!Array.isArray(list) || list.length === 0) return null;
        if(list.length === 1) return list[0];
        return list[Math.floor(Math.random() * list.length)];
    }

    async function getOneProxy(){
        const list = await loadProxyListCached();
        return chooseRandom(list);
    }

    function shouldIgnoreFile(filename){
        if(!filename) return false;
        return filename === '.search_index.gz' || filename.endsWith('.search_index.gz');
    }

    function readInitialNode(){
        try {
            if(window.initial_node && typeof window.initial_node === 'object') return window.initial_node;
        } catch(e){}
        const scripts = document.querySelectorAll('script');
        for(const s of scripts){
            const t = s.textContent || '';
            const idx = t.indexOf('window.initial_node =');
            if(idx !== -1){
                try{
                    const after = t.slice(idx + 'window.initial_node ='.length);
                    const sem = after.indexOf(';');
                    const jsonStr = sem !== -1 ? after.slice(0, sem) : after;
                    const parsed = JSON.parse(jsonStr.trim());
                    if(parsed && typeof parsed === 'object') return parsed;
                }catch(e){
                    const braceIdx = t.indexOf('{', idx);
                    if(braceIdx !== -1){
                        let depth = 0;
                        let end = -1;
                        for(let i = braceIdx; i < t.length; i++){
                            if(t[i] === '{') depth++;
                            else if(t[i] === '}') depth--;
                            if(depth === 0){ end = i; break; }
                        }
                        if(end !== -1){
                            const candidate = t.slice(braceIdx, end + 1);
                            try { const p = JSON.parse(candidate); if(p) return p; } catch(e2){}
                        }
                    }
                }
            }
        }
        return null;
    }

    function countValidFiles(){
        const init = readInitialNode();
        if(!init) return 0;

        if(Array.isArray(init.path) && init.path.length > 0 && init.path[0].type === 'file'){
            if(!Array.isArray(init.children) || init.children.length === 0){
                return 1;
            }
        }

        if(Array.isArray(init.children)){
            const validFiles = init.children.filter(c => {
                return c && c.type === 'file' && !shouldIgnoreFile(c.name);
            });
            return validFiles.length;
        }

        return 0;
    }

    function getSingleFileFromDir(){
        const init = readInitialNode();
        if(!init) return null;

        if(Array.isArray(init.path) && init.path.length > 0 && init.path[0].type === 'file'){
            if(!Array.isArray(init.children) || init.children.length === 0){
                return {
                    name: init.path[0].name,
                    id: init.path[0].id
                };
            }
        }

        if(Array.isArray(init.children)){
            const validFiles = init.children.filter(c => {
                return c && c.type === 'file' && !shouldIgnoreFile(c.name);
            });
            if(validFiles.length === 1){
                return {
                    name: validFiles[0].name,
                    id: validFiles[0].id
                };
            }
        }

        return null;
    }

    async function buildDirBypassUrls(proxyBase){
        const init = readInitialNode();
        if(!init) return { bypassUrlList: [], bypassUrlNames: [], dirId: null };
        let dirId = null;
        if(Array.isArray(init.path) && init.path.length && init.path[0] && init.path[0].id) dirId = init.path[0].id;
        if(!dirId){
            const m = window.location.pathname.match(/\/d\/([^\/\?#]+)/);
            if(m && m[1]) dirId = m[1];
        }
        const files = Array.isArray(init.children) ? init.children.filter(c=>c && c.type === 'file') : [];
        const bypassUrlList = [];
        const bypassUrlNames = [];
        for(const f of files){
            if(!f || !f.name) continue;
            if(shouldIgnoreFile(f.name)) continue;
            const encoded = encodeURIComponent(f.name).replace(/%2F/g, '/');
            const url = (proxyBase || '') + 'd/' + (dirId || '') + '/' + encoded;
            bypassUrlList.push(url);
            bypassUrlNames.push(f.name);
        }
        return { bypassUrlList, bypassUrlNames, dirId };
    }

    async function getBypassUrls(urlType){
        const proxyBase = await getOneProxy();
        if(!proxyBase) return null;
        const currentUrl = window.location.href;
        if(urlType === 'file'){
            const id = currentUrl.replace(`${location.origin}/u/`, '');
            return proxyBase + id;
        }
        if(urlType === 'gallery'){
            const links = document.querySelectorAll('a.file');
            const bypassUrlList = [];
            const bypassUrlNames = [];
            links.forEach(link => {
                const childDiv = link.querySelector('div');
                const backgroundUrl = childDiv ? childDiv.style.backgroundImage : '';
                const match = backgroundUrl.match(idRegex);
                if(match && match[1]){
                    bypassUrlList.push(proxyBase + match[1]);
                    bypassUrlNames.push((link.textContent || '').trim());
                }
            });
            return { bypassUrlList, bypassUrlNames };
        }
        if(urlType === 'dir'){
            return await buildDirBypassUrls(proxyBase);
        }
        if(urlType === 'dir-single'){
            const dirIdMatch = window.location.pathname.match(/\/d\/([^\/\?#]+)/);

            if(dirIdMatch && dirIdMatch[1]){
                const dirId = dirIdMatch[1];
                return proxyBase + 'ds/' + dirId;
            }
            return null;
        }
        return null;
    }

    function openInNewTab(url){
        if(!url) return;
        if(typeof GM_openInTab === 'function'){
            try { GM_openInTab(url, { active: true, insert: true }); return; } catch(e){}
        }
        window.open(url, '_blank');
    }

    async function handleButtonClick(){
        const currentUrl = window.location.href;
        if(currentUrl.includes(`${location.origin}/u/`)){
            const alteredUrl = await getBypassUrls('file');
            if(alteredUrl) openInNewTab(alteredUrl);
            return;
        }
        if(currentUrl.includes(`${location.origin}/l/`)){
            const data = await getBypassUrls('gallery');
            if(data && data.bypassUrlList){
                for(const link of data.bypassUrlList){
                    openInNewTab(link);
                    await new Promise(r => setTimeout(r, 150));
                }
            }
            return;
        }
        if(currentUrl.includes(`${location.origin}/d/`)){
            const fileCount = countValidFiles();
            if(fileCount === 1){
                const alteredUrl = await getBypassUrls('dir-single');
                if(alteredUrl) openInNewTab(alteredUrl);
            } else {
                const result = await getBypassUrls('dir');
                if(result && result.bypassUrlList){
                    for(const link of result.bypassUrlList){
                        openInNewTab(link);
                        await new Promise(r => setTimeout(r, 150));
                    }
                }
            }
            return;
        }
    }

    function createPopupIfNeeded(){
        let popupBox = document.getElementById('popupBox');
        if(popupBox) return popupBox;
        popupBox = document.createElement('div');
        popupBox.id = 'popupBox';
        popupBox.style.position = 'fixed';
        popupBox.style.top = '50%';
        popupBox.style.left = '50%';
        popupBox.style.transform = 'translate(-50%, -50%)';
        popupBox.style.padding = '20px';
        popupBox.style.background = '#2f3541';
        popupBox.style.border = '2px solid #a4be8c';
        popupBox.style.color = '#d7dde8';
        popupBox.style.borderRadius = '10px';
        popupBox.style.zIndex = 2147483646;
        popupBox.style.overflow = 'hidden';
        popupBox.style.whiteSpace = 'pre-line';
        popupBox.style.display = 'none';
        popupBox.style.width = '34%';
        popupBox.style.height = '80%';
        popupBox.style.maxWidth = '700px';
        popupBox.style.boxSizing = 'border-box';
        document.body.appendChild(popupBox);
        return popupBox;
    }

    async function handleLinksButtonClick(){
        const popupBox = createPopupIfNeeded();
        popupBox.innerHTML = '';
        const popupClose = document.createElement('span');
        popupClose.innerHTML = '&times;';
        popupClose.style.position = 'absolute';
        popupClose.style.top = '8px';
        popupClose.style.right = '12px';
        popupClose.style.cursor = 'pointer';
        popupClose.style.fontSize = '20px';
        popupClose.onclick = () => popupBox.style.display = 'none';
        popupBox.appendChild(popupClose);

        const currentUrl = window.location.href;
        if(currentUrl.includes(`${location.origin}/u/`)){
            const alteredUrl = await getBypassUrls('file');
            const urlEl = document.createElement('a');
            urlEl.href = alteredUrl;
            urlEl.textContent = alteredUrl;
            urlEl.style.display = 'block';
            urlEl.style.wordBreak = 'break-all';
            urlEl.style.marginTop = '28px';
            popupBox.appendChild(urlEl);
            popupBox.style.display = 'block';
            return;
        }

        if(currentUrl.includes(`${location.origin}/l/`)){
            const result = await getBypassUrls('gallery') || { bypassUrlList: [], bypassUrlNames: [] };
            const bypassLinks = result.bypassUrlList;
            const bypassNames = result.bypassUrlNames;

            const linksContainer = document.createElement('div');
            linksContainer.style.maxHeight = 'calc(100% - 120px)';
            linksContainer.style.overflowY = 'auto';
            linksContainer.style.paddingBottom = '10px';
            linksContainer.style.marginTop = '28px';

            bypassLinks.forEach((link, idx) => {
                const urlElement = document.createElement('a');
                urlElement.href = link;
                urlElement.textContent = (bypassNames[idx] ? bypassNames[idx] + ' — ' : '') + link;
                urlElement.style.display = 'block';
                urlElement.style.wordBreak = 'break-all';
                urlElement.style.marginBottom = '6px';
                linksContainer.appendChild(urlElement);
            });

            popupBox.appendChild(linksContainer);

            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.flexDirection = 'column';
            btnContainer.style.alignItems = 'center';
            btnContainer.style.marginTop = '10px';
            btnContainer.style.gap = '8px';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '🔗 Copy URLs';
            copyBtn.style.padding = '6px 10px';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(bypassLinks.join('\n')).then(() => {
                    copyBtn.textContent = '✔️ Copied';
                    setTimeout(() => copyBtn.textContent = '🔗 Copy URLs', 1500);
                }).catch(() => {});
            };
            btnContainer.appendChild(copyBtn);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = '📄 Save as Text File';
            saveBtn.style.padding = '6px 10px';
            saveBtn.onclick = () => {
                if(!bypassLinks || bypassLinks.length === 0) return;
                const fileIdMatch = currentUrl.match(/\/l\/([^\/#?]+)/);
                const fileId = (fileIdMatch && fileIdMatch[1]) ? fileIdMatch[1] : 'gallery';
                const fileName = fileId + '.txt';
                const blob = new Blob([bypassLinks.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
            btnContainer.appendChild(saveBtn);

            const openFirstBtn = document.createElement('button');
            openFirstBtn.textContent = '↗️ Open first';
            openFirstBtn.style.padding = '6px 10px';
            openFirstBtn.onclick = () => openInNewTab(bypassLinks[0] || '');
            btnContainer.appendChild(openFirstBtn);

            popupBox.appendChild(btnContainer);
            popupBox.style.display = 'block';
            return;
        }

        if(currentUrl.includes(`${location.origin}/d/`)){
            const fileCount = countValidFiles();

            if(fileCount === 1){
                const alteredUrl = await getBypassUrls('dir-single');
                if(alteredUrl){
                    const urlEl = document.createElement('a');
                    urlEl.href = alteredUrl;
                    urlEl.textContent = alteredUrl;
                    urlEl.style.display = 'block';
                    urlEl.style.wordBreak = 'break-all';
                    urlEl.style.marginTop = '28px';
                    popupBox.appendChild(urlEl);
                    popupBox.style.display = 'block';
                }
                return;
            }

            const result = await getBypassUrls('dir') || { bypassUrlList: [], bypassUrlNames: [], dirId: null };
            const bypassLinks = result.bypassUrlList;
            const bypassNames = result.bypassUrlNames;
            const dirId = result.dirId || (window.location.pathname.match(/\/d\/([^\/\?#]+)/) || [])[1] || 'dir';

            const linksContainer = document.createElement('div');
            linksContainer.style.maxHeight = 'calc(100% - 120px)';
            linksContainer.style.overflowY = 'auto';
            linksContainer.style.paddingBottom = '10px';
            linksContainer.style.marginTop = '28px';

            bypassLinks.forEach((link, idx) => {
                const urlElement = document.createElement('a');
                urlElement.href = link;
                urlElement.textContent = (bypassNames[idx] ? bypassNames[idx] + ' — ' : '') + link;
                urlElement.style.display = 'block';
                urlElement.style.wordBreak = 'break-all';
                urlElement.style.marginBottom = '6px';
                linksContainer.appendChild(urlElement);
            });

            popupBox.appendChild(linksContainer);

            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.flexDirection = 'column';
            btnContainer.style.alignItems = 'center';
            btnContainer.style.marginTop = '10px';
            btnContainer.style.gap = '8px';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '🔗 Copy URLs';
            copyBtn.style.padding = '6px 10px';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(bypassLinks.join('\n')).then(()=> {
                    copyBtn.textContent = '✔️ Copied';
                    setTimeout(()=> copyBtn.textContent = '🔗 Copy URLs', 1500);
                }).catch(()=>{});
            };
            btnContainer.appendChild(copyBtn);

            const saveBtn = document.createElement('button');
            saveBtn.textContent = '📄 Save as Text File';
            saveBtn.style.padding = '6px 10px';
            saveBtn.onclick = () => {
                if(!bypassLinks || bypassLinks.length === 0) return;
                const fileName = (dirId || 'directory') + '.txt';
                const blob = new Blob([bypassLinks.join('\n')], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
            btnContainer.appendChild(saveBtn);

            const openFirstBtn = document.createElement('button');
            openFirstBtn.textContent = '↗️ Open first';
            openFirstBtn.style.padding = '6px 10px';
            openFirstBtn.onclick = () => openInNewTab(bypassLinks[0] || '');
            btnContainer.appendChild(openFirstBtn);

            const zipUrl = (await getOneProxy()) + 'dzip/' + dirId;
            const zipEl = document.createElement('a');
            zipEl.href = zipUrl;
            zipEl.textContent = '⬇️ Download all files ZIP - ' + zipUrl;
            zipEl.style.display = 'block';
            zipEl.style.marginTop = '12px';
            zipEl.style.wordBreak = 'break-all';

            popupBox.appendChild(btnContainer);
            popupBox.appendChild(zipEl);
            popupBox.style.display = 'block';
            return;
        }
    }

    async function insertAboveSiteDlButton(){
        const currentUrl = window.location.href;
        if(!currentUrl.includes(`${location.origin}/l/`) && !currentUrl.includes(`${location.origin}/d/`)) return;

        let id = null;
        let zipEndpoint = '';

        if(currentUrl.includes(`${location.origin}/l/`)){
            const galleryIdMatch = currentUrl.match(/\/l\/([^\/#?]+)/);
            if(galleryIdMatch && galleryIdMatch[1]) {
                id = galleryIdMatch[1];
                zipEndpoint = 'zip/';
            }
        }

        if(currentUrl.includes(`${location.origin}/d/`)){
            const dirIdMatch = currentUrl.match(/\/d\/([^\/#?]+)/);
            if(dirIdMatch && dirIdMatch[1]) {
                id = dirIdMatch[1];
                zipEndpoint = 'dzip/';
            }
        }

        if(!id) return;

        const proxyBase = await getOneProxy();
        if(!proxyBase) return;
        const zipUrl = proxyBase + zipEndpoint + id;

        if(document.querySelector('.bypass-dl-all-wrapper') || document.querySelector('.bypass-grid-buttons')) return;

        const fileCount = countValidFiles();

        if(currentUrl.includes(`${location.origin}/d/`)){
            const toolbar = document.querySelector('.toolbar.svelte-1nlv5t7');
            const grid = toolbar ? toolbar.querySelector('.grid.svelte-1nlv5t7') : null;


            if(fileCount === 1 && grid){
                const separator = document.createElement('div');
                separator.className = 'separator hidden_horizontal svelte-1nlv5t7 bypass-grid-buttons';

                const bypassBtn = document.createElement('button');
                bypassBtn.className = 'bypass-grid-buttons';
                bypassBtn.innerHTML = '<i class="icon">download</i> <span>Download Bypass</span>';
                bypassBtn.onclick = handleButtonClick;

                const linksBtn = document.createElement('button');
                linksBtn.className = 'bypass-grid-buttons';
                linksBtn.innerHTML = '<i class="icon">link</i> <span>Show Bypass Links</span>';
                linksBtn.onclick = handleLinksButtonClick;


                const separators = grid.querySelectorAll('.separator.hidden_horizontal');
                const lastSeparator = separators[separators.length - 1];

                if(lastSeparator && lastSeparator.nextSibling){
                    grid.insertBefore(separator, lastSeparator.nextSibling);
                    grid.insertBefore(bypassBtn, separator.nextSibling);
                    grid.insertBefore(linksBtn, bypassBtn.nextSibling);
                } else {
                    grid.appendChild(separator);
                    grid.appendChild(bypassBtn);
                    grid.appendChild(linksBtn);
                }
                return;
            }

            if(fileCount >= 2 && toolbar){
                const statsContainer = toolbar.querySelector('.stats_container');
                if(statsContainer){
                    const separator = document.createElement('div');
                    separator.className = 'separator svelte-1nlv5t7';

                    const wrapper = document.createElement('div');
                    wrapper.className = 'bypass-dl-all-wrapper';
                    wrapper.style.display = 'flex';
                    wrapper.style.flexDirection = 'column';
                    wrapper.style.gap = '8px';
                    wrapper.style.padding = '0 12px';

                    const bypassBtn = document.createElement('button');
                    bypassBtn.innerHTML = '<i class="icon">download</i> <span>Download Bypass</span>';
                    bypassBtn.style.cursor = 'pointer';
                    bypassBtn.onclick = handleButtonClick;

                    const linksBtn = document.createElement('button');
                    linksBtn.innerHTML = '<i class="icon">link</i> <span>Show Bypass Links</span>';
                    linksBtn.style.cursor = 'pointer';
                    linksBtn.onclick = handleLinksButtonClick;

                    const downloadBtn = document.createElement('button');
                    downloadBtn.innerHTML = '<i class="icon">folder_zip</i> <span>Download DL all files</span>';
                    downloadBtn.style.cursor = 'pointer';
                    downloadBtn.onclick = () => openInNewTab(zipUrl);

                    const showBtn = document.createElement('button');
                    showBtn.innerHTML = '<i class="icon">description</i> <span>Show DL all files</span>';
                    showBtn.style.cursor = 'pointer';
                    showBtn.onclick = () => {
                        const popupBox = createPopupIfNeeded();
                        popupBox.innerHTML = '';
                        const popupClose = document.createElement('span');
                        popupClose.innerHTML = '&times;';
                        popupClose.style.position = 'absolute';
                        popupClose.style.top = '8px';
                        popupClose.style.right = '12px';
                        popupClose.style.cursor = 'pointer';
                        popupClose.style.fontSize = '20px';
                        popupClose.onclick = () => popupBox.style.display = 'none';
                        popupBox.appendChild(popupClose);
                        const urlEl = document.createElement('a');
                        urlEl.href = zipUrl;
                        urlEl.textContent = zipUrl;
                        urlEl.style.display = 'block';
                        urlEl.style.wordBreak = 'break-all';
                        urlEl.style.marginTop = '28px';
                        popupBox.appendChild(urlEl);

                        const btnContainer = document.createElement('div');
                        btnContainer.style.display = 'flex';
                        btnContainer.style.gap = '8px';
                        btnContainer.style.marginTop = '12px';
                        btnContainer.style.justifyContent = 'center';

                        const copyBtn = document.createElement('button');
                        copyBtn.textContent = '🔗 Copy URL';
                        copyBtn.onclick = () => {
                            navigator.clipboard.writeText(zipUrl).then(()=> {
                                copyBtn.textContent = '✔️ Copied';
                                setTimeout(()=> copyBtn.textContent = '🔗 Copy URL', 1500);
                            }).catch(()=>{});
                        };

                        const openBtn = document.createElement('button');
                        openBtn.textContent = '↗️ Open';
                        openBtn.onclick = () => openInNewTab(zipUrl);

                        btnContainer.appendChild(copyBtn);
                        btnContainer.appendChild(openBtn);
                        popupBox.appendChild(btnContainer);

                        popupBox.style.display = 'block';
                    };

                    wrapper.appendChild(bypassBtn);
                    wrapper.appendChild(linksBtn);
                    wrapper.appendChild(downloadBtn);
                    wrapper.appendChild(showBtn);

                    if(statsContainer.nextSibling){
                        toolbar.insertBefore(separator, statsContainer.nextSibling);
                        toolbar.insertBefore(wrapper, separator.nextSibling);
                    } else {
                        toolbar.appendChild(separator);
                        toolbar.appendChild(wrapper);
                    }
                    return;
                }
            }
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'bypass-dl-all-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '6px';
        wrapper.style.marginBottom = '10px';

        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '⬇️ Download DL all files';
        downloadBtn.style.cursor = 'pointer';
        downloadBtn.style.padding = '6px 10px';
        downloadBtn.onclick = () => openInNewTab(zipUrl);

        const showBtn = document.createElement('button');
        showBtn.innerHTML = '🔗 Show DL all files';
        showBtn.style.cursor = 'pointer';
        showBtn.style.padding = '6px 10px';
        showBtn.onclick = () => {
            const popupBox = createPopupIfNeeded();
            popupBox.innerHTML = '';
            const popupClose = document.createElement('span');
            popupClose.innerHTML = '&times;';
            popupClose.style.position = 'absolute';
            popupClose.style.top = '8px';
            popupClose.style.right = '12px';
            popupClose.style.cursor = 'pointer';
            popupClose.style.fontSize = '20px';
            popupClose.onclick = () => popupBox.style.display = 'none';
            popupBox.appendChild(popupClose);
            const urlEl = document.createElement('a');
            urlEl.href = zipUrl;
            urlEl.textContent = zipUrl;
            urlEl.style.display = 'block';
            urlEl.style.wordBreak = 'break-all';
            urlEl.style.marginTop = '28px';
            popupBox.appendChild(urlEl);

            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '8px';
            btnContainer.style.marginTop = '12px';
            btnContainer.style.justifyContent = 'center';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '🔗 Copy URL';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(zipUrl).then(()=> {
                    copyBtn.textContent = '✔️ Copied';
                    setTimeout(()=> copyBtn.textContent = '🔗 Copy URL', 1500);
                }).catch(()=>{});
            };

            const openBtn = document.createElement('button');
            openBtn.textContent = '↗️ Open';
            openBtn.onclick = () => openInNewTab(zipUrl);

            btnContainer.appendChild(copyBtn);
            btnContainer.appendChild(openBtn);
            popupBox.appendChild(btnContainer);

            popupBox.style.display = 'block';
        };

        wrapper.appendChild(downloadBtn);
        wrapper.appendChild(showBtn);

        const dlButton = Array.from(document.querySelectorAll('button, a'))
            .find(el => el.textContent && el.textContent.toLowerCase().includes('dl all files'));

        if(dlButton && dlButton.parentElement){
            dlButton.parentElement.insertBefore(wrapper, dlButton);
        } else {
            const labels = document.querySelectorAll('div.label');
            for(const label of labels){
                if(label.textContent && label.textContent.trim() === 'Size'){
                    const nextElement = label.nextElementSibling;
                    if(nextElement && nextElement.parentElement){
                        nextElement.parentElement.insertBefore(wrapper, nextElement.nextSibling);
                        return;
                    }
                }
            }
            wrapper.style.position = 'fixed';
            wrapper.style.top = '12px';
            wrapper.style.left = '12px';
            wrapper.style.zIndex = 2147483647;
            document.body.appendChild(wrapper);
        }
    }

    function insertOriginalButtons(){
        if(document.querySelector('.bypass-original-main')) return;
        const button = document.createElement('button');
        button.className = 'bypass-original-main';
        button.textContent = 'Download Bypass';
        button.style.marginRight = '6px';
        button.onclick = handleButtonClick;

        const linksButton = document.createElement('button');
        linksButton.className = 'bypass-original-links';
        linksButton.textContent = 'Show Bypass Links';
        linksButton.onclick = handleLinksButtonClick;

        const labels = document.querySelectorAll('div.label');
        labels.forEach(label => {
            if(label.textContent && label.textContent.trim() === 'Size'){
                const nextElement = label.nextElementSibling;
                if(nextElement && nextElement.parentElement){
                    nextElement.parentElement.insertBefore(linksButton, nextElement.nextSibling);
                    nextElement.parentElement.insertBefore(button, linksButton);
                }
            }
        });
        createPopupIfNeeded();
    }

    async function init(){
        insertOriginalButtons();
        await insertAboveSiteDlButton();
        setTimeout(() => { insertOriginalButtons(); insertAboveSiteDlButton(); }, 800);
        setTimeout(() => { insertOriginalButtons(); insertAboveSiteDlButton(); }, 2500);
    }

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();

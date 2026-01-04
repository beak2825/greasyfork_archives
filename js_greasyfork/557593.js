// ==UserScript==
// @name        Rule34 Gallery Mode V3
// @namespace   R34_Gallery_Mode
// @version     3.0
// @description Full-screen gallery. Batch API + Carousel. Settings Menu. Custom Flip Controls.
// @author      hawkslool
// @match       https://rule34.xxx/index.php?page=post&s=list*
// @connect     api.rule34.xxx
// @connect     rule34.xxx
// @connect     wimg.rule34.xxx
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/557593/Rule34%20Gallery%20Mode%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/557593/Rule34%20Gallery%20Mode%20V3.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // --- USER CONFIGURATION ---
    const API_KEY = 'API';
    const USER_ID = 'ID';

    // --- CONFIG ---
    const BUFFER_AHEAD = 5;
    const API_LIMIT = 100;

    // --- SETTINGS DEFAULTS ---
    const DEFAULT_SETTINGS = {
        middleClick: 'tab', // 'tab', 'download', 'none'
        pageFlip: 'auto'    // 'auto', 'manual'
    };

    // --- STATE ---
    let settings = { ...DEFAULT_SETTINGS };
    let postCache = new Map();
    let failedCache = new Set();
    let domList = [];
    let active = false;
    let currentIndex = 0;
    let ui = {};
    let preloadContainer = null;
    let apiFetchDone = false;
    let scrollLock = false;
    let userBlacklist = [];
    let manualFlipPending = false;

    // --- INIT ---
    const init = () => {
        const links = document.querySelectorAll('span.thumb a');
        if (links.length === 0) return;

        links.forEach((a, i) => {
            const id = a.id.replace('p', '');
            const img = a.querySelector('img');
            domList.push({
                index: i,
                id: id,
                thumbUrl: img ? img.src : '',
                viewUrl: a.href,
                scraping: false
            });
        });

        loadSettings();
        loadBlacklist();
        createButton();

        if (sessionStorage.getItem('r34_gallery_autostart') === 'true') {
            sessionStorage.removeItem('r34_gallery_autostart');
            startGallery();
        }
    };

    // --- SETTINGS ENGINE ---
    const loadSettings = () => {
        const saved = localStorage.getItem('r34_gallery_settings');
        if (saved) {
            try {
                settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            } catch (e) { console.warn("Settings Parse Error"); }
        }
    };

    const saveSettings = () => {
        localStorage.setItem('r34_gallery_settings', JSON.stringify(settings));
    };

    // --- BLACKLIST ENGINE ---
    const loadBlacklist = () => {
        let tags = new Set();
        let raw = localStorage.getItem('blacklisted_tags');
        if (raw) {
            try {
                let cleanRaw = decodeURIComponent(raw);
                if (cleanRaw.startsWith('[')) {
                    JSON.parse(cleanRaw).forEach(entry => {
                        entry.split(/[\s,]+/).forEach(t => tags.add(t.toLowerCase().trim()));
                    });
                } else {
                    cleanRaw.split(/[\s,]+/).forEach(t => tags.add(t.toLowerCase().trim()));
                }
            } catch(e) { console.warn("Blacklist Parse Error", e); }
        }

        document.cookie.split(';').forEach(c => {
            if (c.trim().startsWith('tag_blacklist=')) {
                decodeURIComponent(c.split('=')[1]).split(/[\s,]+/).forEach(t => tags.add(t.toLowerCase().trim()));
            }
        });

        userBlacklist = Array.from(tags).filter(t => t.length > 0);
    };

    const isBlacklisted = (postTags) => {
        if (!userBlacklist.length || !postTags) return false;
        const pTags = postTags.toLowerCase().split(' ');
        return userBlacklist.some(blocked => pTags.includes(blocked));
    };

    // --- ENGINE: DUAL BATCH FETCHER ---
    const performBatchFetch = (callback) => {
        if (apiFetchDone) { callback(); return; }

        const btn = document.getElementById('r34-gallery-btn');
        if (btn) btn.textContent = 'FETCHING API...';

        const urlParams = new URLSearchParams(window.location.search);
        const tags = urlParams.get('tags') || '';
        const pid = parseInt(urlParams.get('pid') || 0);
        const baseApiPage = Math.floor(pid / API_LIMIT);

        console.log(`[R34 Gallery] Fetching API Pages ${baseApiPage} and ${baseApiPage + 1}`);

        let requestsFinished = 0;

        const handleData = (res) => {
            try {
                const data = JSON.parse(res.responseText);
                if (Array.isArray(data)) {
                    data.forEach(post => {
                        if (isBlacklisted(post.tags)) return;
                        let url = post.file_url;
                        let type = 'image';
                        if (url.endsWith('.mp4') || url.endsWith('.webm')) type = 'video';
                        postCache.set(String(post.id), { url, type });
                    });
                }
            } catch (e) { console.warn("API Parse Error"); }

            requestsFinished++;
            if (requestsFinished >= 2) {
                apiFetchDone = true;
                callback();
            }
        };

        const fetchPage = (p) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&limit=${API_LIMIT}&pid=${p}&tags=${encodeURIComponent(tags)}&api_key=${API_KEY}&user_id=${USER_ID}`,
                onload: handleData,
                onerror: () => { requestsFinished++; if(requestsFinished >= 2) callback(); }
            });
        };

        fetchPage(baseApiPage);
        fetchPage(baseApiPage + 1);
    };

    // --- NATIVE SCRAPER ---
    const scrapeSinglePost = (domItem, callback) => {
        if (domItem.scraping) return;
        domItem.scraping = true;

        fetch(domItem.viewUrl)
            .then(response => response.text())
            .then(html => {
                const doc = new DOMParser().parseFromString(html, "text/html");
                let foundUrl = null;
                let type = 'image';

                const vid = doc.querySelector('#gelcomVideoPlayer source');
                if (vid) { foundUrl = vid.src; type = 'video'; }
                else {
                    const links = Array.from(doc.querySelectorAll('li > a'));
                    const origLink = links.find(a => a.textContent.includes('Original image'));
                    if (origLink) { foundUrl = origLink.href; }
                    else {
                        const img = doc.querySelector('#image');
                        if (img) foundUrl = img.src;
                        else {
                            const resize = links.find(a => a.textContent.includes('Resize image'));
                            if (resize) foundUrl = resize.href;
                        }
                    }
                }

                domItem.scraping = false;

                if (foundUrl) {
                    postCache.set(domItem.id, { url: foundUrl, type: type });
                    failedCache.delete(domItem.id);
                    if (callback) callback(true);
                } else {
                    failedCache.add(domItem.id);
                    if (callback) callback(false);
                }
            })
            .catch(err => {
                domItem.scraping = false;
                failedCache.add(domItem.id);
                if (callback) callback(false);
            });
    };

    // --- DOWNLOADER ---
    const downloadImage = (url, filename) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: (res) => {
                const blob = res.response;
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename || url.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    };

    // --- VISUAL FEEDBACK ---
    const showDownloadFeedback = (x, y) => {
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 0px 3px rgba(0,0,0,0.8));">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
        `;
        overlay.style.position = 'fixed';
        overlay.style.left = x + 'px';
        overlay.style.top = y + 'px';
        overlay.style.zIndex = '2147483647';
        overlay.style.pointerEvents = 'none';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.transition = 'all 0.8s ease-out';
        overlay.style.opacity = '1';

        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.offsetHeight;
            overlay.style.transform = 'translate(-50%, -150%) scale(1.1)';
            overlay.style.opacity = '0';
        });

        setTimeout(() => { overlay.remove(); }, 800);
    };

    // --- LOGIC ---
    const startGallery = () => {
        if (active) return;

        if (!preloadContainer) {
            preloadContainer = document.createElement('div');
            preloadContainer.style = 'position:fixed; top:-9999px; width:1px; height:1px; visibility:hidden; overflow:hidden;';
            document.body.appendChild(preloadContainer);
        }

        performBatchFetch(() => {
            active = true;
            document.body.style.overflow = 'hidden';
            updateButtonState(true);
            buildUI();
            renderCarousel();
        });
    };

    const manageBuffer = () => {
        const maxIdx = Math.min(domList.length - 1, currentIndex + BUFFER_AHEAD);

        for (let i = currentIndex + 1; i <= maxIdx; i++) {
            const item = domList[i];
            if (failedCache.has(item.id)) continue;
            const cached = postCache.get(item.id);
            if (cached && !document.getElementById(`preload-${item.id}`)) {
                let el;
                if (cached.type === 'video') {
                    el = document.createElement('video');
                    el.src = cached.url;
                    el.preload = 'auto';
                } else {
                    el = new Image();
                    el.src = cached.url;
                }
                el.id = `preload-${item.id}`;
                preloadContainer.appendChild(el);
            } else if (!cached && !item.scraping) {
                scrapeSinglePost(item, () => manageBuffer());
            }
        }
        while(preloadContainer.childNodes.length > 20) {
            preloadContainer.removeChild(preloadContainer.firstChild);
        }
    };

    const triggerPageFlip = () => {
        const nextBtn = document.querySelector('a[alt="next"]');
        if (nextBtn) {
            sessionStorage.setItem('r34_gallery_autostart', 'true');
            window.location.href = nextBtn.href;
        } else {
            alert("End of results");
        }
    };

    // --- UI ---
    const buildUI = () => {
        const d = document.createElement('div');
        d.id = 'r34-viewer-root';
        d.style = 'position:fixed;inset:0;background:#000;z-index:9999999;display:flex;justify-content:center;align-items:center;outline:none;';
        d.tabIndex = 0;

        const c = document.createElement('div');
        c.style = 'width:100%;height:100%;position:relative;display:flex;justify-content:center;align-items:center;';
        d.appendChild(c);

        const count = document.createElement('div');
        count.style = 'position:absolute;bottom:20px;right:20px;color:#fff;font:bold 24px monospace;text-shadow:1px 1px 2px #000;pointer-events:none;z-index:20;';
        d.appendChild(count);

        // TOP BUTTONS
        const topBar = document.createElement('div');
        topBar.style = 'position:absolute;top:0;left:0;width:100%;height:60px;display:flex;justify-content:space-between;align-items:center;padding:0 20px;box-sizing:border-box;z-index:30;pointer-events:none;';
        d.appendChild(topBar);

        const close = document.createElement('div');
        close.textContent = '×';
        close.style = 'font-size:60px;color:#fff;cursor:pointer;opacity:0.5;pointer-events:auto;line-height:0.8;';
        close.onmouseover = () => close.style.opacity = 1;
        close.onmouseout = () => close.style.opacity = 0.5;
        close.onclick = (e) => { e.stopPropagation(); closeGallery(); };
        topBar.appendChild(close);

        const viewPost = document.createElement('div');
        viewPost.textContent = 'VIEW POST ↗';
        viewPost.style = 'font:bold 18px monospace;color:#fff;border:2px solid #fff;padding:8px 15px;border-radius:5px;cursor:pointer;background:rgba(0,0,0,0.5);pointer-events:auto;';
        viewPost.onmouseover = () => { viewPost.style.background = '#fff'; viewPost.style.color = '#000'; };
        viewPost.onmouseout = () => { viewPost.style.background = 'rgba(0,0,0,0.5)'; viewPost.style.color = '#fff'; };
        viewPost.onclick = (e) => {
            e.stopPropagation();
            window.open(domList[currentIndex].viewUrl, '_blank');
        };
        topBar.appendChild(viewPost);

        // SETTINGS GEAR
        const gear = document.createElement('div');
        gear.innerHTML = '⚙️';
        gear.title = "Click to view Settings";
        gear.style = 'position:absolute;bottom:20px;left:20px;font-size:30px;cursor:pointer;z-index:40;text-shadow:0 0 5px #000;';
        gear.onclick = (e) => { e.stopPropagation(); toggleSettingsMenu(); };
        d.appendChild(gear);

        // --- INPUT HANDLING ---
        d.onkeydown = (e) => {
            if (manualFlipPending) {
                if (e.key === 'ArrowDown') triggerPageFlip();
                if (e.key === 'Escape') closeGallery();
                return;
            }

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nav(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nav(-1);
            if (e.key === 'Escape') closeGallery();
        };

        d.onwheel = (e) => {
            e.preventDefault();
            if (manualFlipPending) {
                if (e.deltaY > 0) triggerPageFlip();
                return;
            }

            if (scrollLock) return;
            scrollLock = true;
            setTimeout(() => scrollLock = false, 100);
            if (e.deltaY > 0) nav(1);
            else if (e.deltaY < 0) nav(-1);
        };

        d.onmousedown = (e) => {
            if (manualFlipPending) {
                if (e.button === 0) triggerPageFlip(); // Left click only for flip
                return;
            }

            if (e.button === 1) { // Middle Click
                e.preventDefault();
                const item = domList[currentIndex];
                const cached = postCache.get(item.id);
                const url = cached ? cached.url : item.viewUrl;

                if (settings.middleClick === 'tab') {
                    window.open(url, '_blank');
                } else if (settings.middleClick === 'download') {
                    downloadImage(url);
                    showDownloadFeedback(e.clientX, e.clientY);
                }
            }
        };

        ui = { root: d, content: c, counter: count };
        document.body.appendChild(d);
        d.focus();
    };

    // --- SETTINGS MENU UI ---
    const toggleSettingsMenu = () => {
        if (document.getElementById('r34-settings-modal')) {
            document.getElementById('r34-settings-modal').remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'r34-settings-modal';
        modal.style = `
            position:absolute; bottom:60px; left:20px; width:300px;
            background:rgba(0,0,0,0.9); border:2px solid #0f0; border-radius:10px;
            padding:20px; z-index:50; color:#fff; font-family:monospace;
            display:flex; flex-direction:column; gap:15px; box-shadow:0 0 20px #000;
        `;
        modal.onclick = (e) => e.stopPropagation();

        const title = document.createElement('div');
        title.textContent = 'SETTINGS';
        title.style = 'font-weight:bold; font-size:20px; text-align:center; color:#0f0; border-bottom:1px solid #333; padding-bottom:10px;';
        modal.appendChild(title);

        const createOption = (label, key, options) => {
            const row = document.createElement('div');
            row.style = 'display:flex; flex-direction:column; gap:5px;';

            const lbl = document.createElement('label');
            lbl.textContent = label;
            lbl.style = 'font-size:14px; color:#aaa;';

            const sel = document.createElement('select');
            sel.style = 'background:#222; color:#fff; border:1px solid #555; padding:5px;';

            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.val;
                o.textContent = opt.txt;
                if (settings[key] === opt.val) o.selected = true;
                sel.appendChild(o);
            });

            sel.onchange = () => {
                settings[key] = sel.value;
                saveSettings();
            };

            row.appendChild(lbl);
            row.appendChild(sel);
            return row;
        };

        modal.appendChild(createOption('Middle Click Action:', 'middleClick', [
            {val: 'tab', txt: 'Open in New Tab'},
            {val: 'download', txt: 'Download Image'},
            {val: 'none', txt: 'Do Nothing'}
        ]));

        modal.appendChild(createOption('Page Flip Logic:', 'pageFlip', [
            {val: 'auto', txt: 'Automatic (Seamless)'},
            {val: 'manual', txt: 'Manual (Input Required)'}
        ]));

        ui.root.appendChild(modal);
    };

    const renderCarousel = () => {
        ui.counter.textContent = `${currentIndex + 1} / ${domList.length}`;
        ui.content.innerHTML = '';

        const track = document.createElement('div');
        track.style = `display:flex;align-items:center;justify-content:center;width:100%;height:100%;gap:15px;`;
        ui.content.appendChild(track);

        [-1, 0, 1].forEach(offset => {
            const idx = currentIndex + offset;

            if (idx < 0 || idx >= domList.length) {
                const placeholder = document.createElement('div');
                placeholder.style = 'flex: 0 0 10%; height:100%';
                track.appendChild(placeholder);
                return;
            }

            const item = domList[idx];
            const cached = postCache.get(item.id);
            const isCenter = (offset === 0);

            const wrapper = document.createElement('div');
            wrapper.style = `
                flex: 0 0 ${isCenter ? '80%' : '8%'};
                height: 100%;
                display: flex; align-items: center; justify-content: center;
                opacity: ${isCenter ? '1' : '0.4'};
                transition: opacity 0.3s;
                position: relative;
            `;

            if (!isCenter) {
                wrapper.style.cursor = 'pointer';
                wrapper.onclick = (e) => { e.stopPropagation(); nav(offset); };
            }

            if (failedCache.has(item.id)) {
                const btn = document.createElement('div');
                btn.innerHTML = '⚠️ FAILED<br><span style="font-size:16px;">Click to Open Post</span>';
                btn.style = 'color:#f00;font:bold 24px monospace;text-align:center;border:2px solid #f00;padding:20px;background:rgba(0,0,0,0.8);cursor:pointer;';
                btn.onclick = (e) => { e.stopPropagation(); window.open(item.viewUrl, '_blank'); };
                wrapper.appendChild(btn);
            }
            else if (cached) {
                const el = createMediaElement(cached.url, cached.type, isCenter);
                wrapper.appendChild(el);
            }
            else {
                const loading = document.createElement('div');
                loading.textContent = '...';
                loading.style = 'color:#666; font-size:30px;';
                wrapper.appendChild(loading);

                if (!item.scraping) {
                    scrapeSinglePost(item, (success) => {
                        if (active && (currentIndex + offset === idx)) renderCarousel();
                    });
                }
            }
            track.appendChild(wrapper);
        });

        manageBuffer();
    };

    const createMediaElement = (url, type, isCenter) => {
        let el;
        if (type === 'video') {
            el = document.createElement('video');
            el.src = url;
            el.loop = true;
            el.muted = !isCenter;
            if (isCenter) { el.controls = true; el.autoplay = true; }
            else { el.pause(); el.preload = 'metadata'; }
        } else {
            el = document.createElement('img');
            el.src = url;
        }
        el.style = 'max-width:100%; max-height:100%; object-fit:contain; box-shadow:0 0 20px #000;';
        el.onerror = () => { el.style.display = 'none'; };
        return el;
    };

    const nav = (dir) => {
        if (manualFlipPending) return;

        const next = currentIndex + dir;
        if (next >= domList.length) {
            // CHECK SETTINGS FOR MANUAL FLIP
            if (settings.pageFlip === 'manual') {
                manualFlipPending = true;
                // NO ANIMATION, SPECIFIC INSTRUCTIONS
                ui.content.innerHTML = `
                    <div style="text-align:center; color:#fff; font-family:monospace;">
                        <h1 style="font-size:40px; color:#0f0;">END OF PAGE</h1>
                        <div style="font-size:20px; margin-top:20px; color:#ccc;">
                            To flip page:<br><br>
                            <span style="color:#fff;">Left Click</span> &bull;
                            <span style="color:#fff;">Scroll Down</span> &bull;
                            <span style="color:#fff;">Arrow Down</span>
                        </div>
                    </div>
                `;
                return;
            }

            triggerPageFlip();
            return;
        }
        if (next < 0) return;
        currentIndex = next;
        renderCarousel();
    };

    const closeGallery = () => {
        manualFlipPending = false;
        active = false;
        document.body.style.overflow = '';
        if (ui.root) ui.root.remove();
        updateButtonState(false);
    };

    const createButton = () => {
        const btn = document.createElement('div');
        btn.id = 'r34-gallery-btn';
        btn.textContent = 'GALLERY MODE';
        btn.style = `position:fixed;top:10px;right:10px;background:#000;color:#0f0;border:2px solid #0f0;padding:10px 20px;font:bold 16px monospace;cursor:pointer;z-index:999999;border-radius:5px;`;
        btn.onclick = startGallery;
        document.body.appendChild(btn);
    };

    const updateButtonState = (isOn) => {
        const btn = document.getElementById('r34-gallery-btn');
        if(!btn) return;
        btn.textContent = isOn ? 'ACTIVE' : 'GALLERY MODE';
        btn.style.color = isOn ? '#000' : '#0f0';
        btn.style.background = isOn ? '#0f0' : '#000';
    };

    init();
})();
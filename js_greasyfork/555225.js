// ==UserScript==
// @name         YouTube Channel Blocker v6
// @namespace    http://tampermonkey.net/
// @version      6
// @description  Block YouTube channels with gold borders, fullscreen protection, import/export. Optimized & cleaner.
// @author       Solomon
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555225/YouTube%20Channel%20Blocker%20v6.user.js
// @updateURL https://update.greasyfork.org/scripts/555225/YouTube%20Channel%20Blocker%20v6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    const VIDEO_SELECTORS = [
        'ytd-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-rich-item-renderer',
        'ytd-playlist-video-renderer',
        'ytd-reel-item-renderer'
    ].join(',');

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE
    // ═══════════════════════════════════════════════════════════════════════════

    const state = {
        blocked: GM_getValue('blockedChannels', []),
        cache: new Map(),
        isFullscreen: false,
        lastUrl: location.href
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* Blocked video styling */
        [data-blocked="true"] {
            position: relative;
            border: 3px solid #ffd700 !important;
            border-radius: 8px !important;
            background: rgba(255,215,0,0.05) !important;
        }
        [data-blocked="true"] ytd-thumbnail {
            border: 4px solid #ffd700 !important;
            border-radius: 12px !important;
            opacity: 0.6 !important;
            pointer-events: none !important;
        }
        [data-blocked="true"] ytd-thumbnail video,
        [data-blocked="true"] #mouseover-overlay,
        [data-blocked="true"] #hover-overlays { display: none !important; }

        /* Block button */
        .ycb-btn {
            background: #c00; color: white; border: none;
            padding: 4px 10px; border-radius: 12px; cursor: pointer;
            font-size: 11px; font-weight: 500; margin: 4px 0 4px 8px;
            transition: all 0.2s;
        }
        .ycb-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .ycb-btn.blocked { background: #ffd700; color: #000; font-weight: bold; }

        /* Toggle button */
        #ycb-toggle {
            position: fixed; top: 70px; right: 20px;
            background: #c00; color: white; border: none;
            padding: 8px 12px; border-radius: 50%; cursor: grab;
            z-index: 9999; font-weight: 600; font-size: 16px;
            width: 44px; height: 44px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 10px rgba(204,0,0,0.5);
            transition: all 0.2s;
        }
        #ycb-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(204,0,0,0.7);
        }

        /* Panel */
        #ycb-panel {
            position: fixed; top: 150px; right: 20px;
            background: #282828; border: 2px solid #c00;
            border-radius: 12px; padding: 20px; z-index: 10000;
            max-width: 350px; max-height: 500px; overflow-y: auto;
            display: none; color: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        #ycb-panel h3 {
            margin: 0 0 12px; font-size: 16px;
            border-bottom: 2px solid #c00; padding-bottom: 8px;
        }
        .ycb-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px; margin-bottom: 4px; background: #3a3a3a; border-radius: 6px;
        }
        .ycb-item span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ycb-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
        .ycb-actions button {
            padding: 8px; border: none; border-radius: 6px; cursor: pointer; color: white;
        }

        /* Fullscreen hide */
        .ytp-fullscreen ~ #ycb-toggle,
        :fullscreen #ycb-toggle { display: none !important; }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════

    const save = () => {
        GM_setValue('blockedChannels', state.blocked);
        state.cache.clear();
    };

    const isBlocked = (name, id) => {
        const key = `${name}:${id}`;
        if (state.cache.has(key)) return state.cache.get(key);

        const blocked = state.blocked.some(b => {
            const lower = b.toLowerCase();
            return name.toLowerCase().includes(lower) || (id && id.toLowerCase() === lower);
        });

        state.cache.set(key, blocked);
        return blocked;
    };

    const getChannelInfo = (video) => {
        const richMedia = video.querySelector('ytd-rich-grid-media');
        const link = (richMedia || video).querySelector('a[href*="/@"], a[href*="/channel/"], ytd-channel-name a');
        if (!link) return null;

        const href = link.getAttribute('href') || '';
        return {
            name: link.textContent.trim(),
            id: href.split('/').pop().split('?')[0],
            link
        };
    };

    const getInsertTarget = (video) => {
        const richMedia = video.querySelector('ytd-rich-grid-media');
        return (richMedia || video).querySelector('#details, #metadata, #meta, ytd-channel-name');
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎛️ CHANNEL MANAGER
    // ═══════════════════════════════════════════════════════════════════════════

    const block = (name, id) => {
        const identifier = id || name;
        if (state.blocked.includes(identifier)) {
            alert(`"${name}" is already blocked.`);
            return;
        }
        state.blocked.push(identifier);
        save();
        alert(`✅ Blocked: ${name}\n\nRefresh to see changes.`);
        updateUI();
    };

    const unblock = (identifier) => {
        const idx = state.blocked.indexOf(identifier);
        if (idx === -1) return false;
        state.blocked.splice(idx, 1);
        save();
        updateUI();
        return true;
    };

    const exportList = () => {
        const blob = new Blob([JSON.stringify(state.blocked, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `youtube-blocked-${Date.now()}.json`;
        a.click();
    };

    const importList = (json) => {
        try {
            const imported = JSON.parse(json);
            if (Array.isArray(imported)) {
                const newItems = imported.filter(ch => !state.blocked.includes(ch));
                state.blocked.push(...newItems);
                save();
                alert(`✅ Imported ${newItems.length} channels.\nTotal: ${state.blocked.length}`);
                updateUI();
                renderList();
            }
        } catch {
            alert('❌ Invalid JSON file');
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎬 FULLSCREEN HANDLER
    // ═══════════════════════════════════════════════════════════════════════════

    const preventScroll = e => {
        if (state.isFullscreen) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const handleFullscreen = () => {
        state.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.querySelector('.html5-video-player.ytp-fullscreen')
        );

        const toggle = document.getElementById('ycb-toggle');
        const panel = document.getElementById('ycb-panel');

        if (toggle) toggle.style.display = state.isFullscreen ? 'none' : 'flex';
        if (panel && state.isFullscreen) panel.style.display = 'none';

        if (state.isFullscreen) {
            document.addEventListener('wheel', preventScroll, { passive: false, capture: true });
            document.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
        } else {
            document.removeEventListener('wheel', preventScroll, { capture: true });
            document.removeEventListener('touchmove', preventScroll, { capture: true });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎯 VIDEO PROCESSOR
    // ═══════════════════════════════════════════════════════════════════════════

    const processVideos = () => {
        document.querySelectorAll(`${VIDEO_SELECTORS}:not([data-ycb])`).forEach(video => {
            video.dataset.ycb = '1';

            const info = getChannelInfo(video);
            if (!info) return;

            const blocked = isBlocked(info.name, info.id);
            if (blocked) video.dataset.blocked = 'true';

            // Add button
            const target = getInsertTarget(video);
            if (target && !video.dataset.blocked) {
                const btn = document.createElement('button');
                btn.className = 'ycb-btn';
                btn.textContent = '🚫 Block';
                btn.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    block(info.name, info.id);
                };
                target.appendChild(btn);
            }

            // Add badge for blocked
            if (blocked && target) {
                const badge = document.createElement('button');
                badge.className = 'ycb-btn blocked';
                badge.textContent = '✓ Blocked';
                badge.onclick = e => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm(`Unblock "${info.name}"?`)) {
                        unblock(info.id || info.name);
                        location.reload();
                    }
                };
                target.appendChild(badge);
            }
        });
    };

    // Channel page button
    const addChannelPageButton = () => {
        if (!location.pathname.match(/\/@|\/channel\//)) return;
        if (document.getElementById('ycb-channel-btn')) return;

        const nameEl = document.querySelector('yt-dynamic-text-view-model h1 span[role="text"]');
        const handleEl = document.querySelector('yt-content-metadata-view-model span[role="text"]');

        const name = nameEl?.textContent.trim().split('\n')[0] || '';
        let id = handleEl?.textContent.trim() || '';
        if (!id.startsWith('@')) {
            id = '@' + (location.pathname.split('/@')[1] || location.pathname.split('/channel/')[1] || '').split('/')[0];
        }

        if (!name && !id) return;

        const actions = document.querySelector('yt-flexible-actions-view-model');
        if (!actions) return;

        const blocked = isBlocked(name, id);
        const wrapper = document.createElement('div');
        wrapper.id = 'ycb-channel-btn';
        wrapper.className = 'ytFlexibleActionsViewModelAction';

        const btn = document.createElement('button');
        btn.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
        if (blocked) btn.style.cssText = 'background:#ffd700!important;color:#000!important;border:2px solid #000!important;font-weight:bold!important;';
        btn.innerHTML = `<div class="yt-spec-button-shape-next__button-text-content">${blocked ? '✓ Blocked' : '🚫 Block'}</div>`;
        btn.onclick = () => {
            if (blocked) {
                if (confirm(`Unblock "${name}"?`)) { unblock(id || name); location.reload(); }
            } else {
                if (confirm(`Block "${name}"?`)) block(name, id);
            }
        };

        wrapper.appendChild(btn);
        actions.appendChild(wrapper);
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 UI
    // ═══════════════════════════════════════════════════════════════════════════

    const updateUI = () => {
        const toggle = document.getElementById('ycb-toggle');
        if (toggle) toggle.textContent = `🚫 ${state.blocked.length}`;
    };

    const renderList = () => {
        const list = document.getElementById('ycb-list');
        const count = document.getElementById('ycb-count');
        if (!list) return;

        if (count) count.textContent = `Total: ${state.blocked.length}`;

        list.innerHTML = state.blocked.length === 0
            ? '<p style="color:#aaa;text-align:center;padding:20px;">No blocked channels</p>'
            : state.blocked.map(ch => `
                <div class="ycb-item">
                    <span title="${ch}">${ch}</span>
                    <button onclick="window._ycbUnblock('${ch.replace(/'/g, "\\'")}')" style="background:#065fd4;padding:4px 10px;border-radius:4px;font-size:11px;">Unblock</button>
                </div>
            `).join('');
    };

    const createUI = () => {
        // Toggle button
        const toggle = document.createElement('button');
        toggle.id = 'ycb-toggle';
        toggle.textContent = `🚫 ${state.blocked.length}`;
        toggle.title = 'Manage Blocked Channels';
        toggle.onclick = () => {
            const panel = document.getElementById('ycb-panel');
            if (panel.style.display === 'none') {
                renderList();
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        };
        document.body.appendChild(toggle);

        // Make draggable
        let dragging = false, startX, startY, initLeft, initTop;
        toggle.addEventListener('mousedown', e => {
            dragging = true;
            toggle.style.cursor = 'grabbing';
            initLeft = toggle.offsetLeft;
            initTop = toggle.offsetTop;
            startX = e.clientX;
            startY = e.clientY;
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            toggle.style.left = (initLeft + e.clientX - startX) + 'px';
            toggle.style.top = (initTop + e.clientY - startY) + 'px';
            toggle.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
            dragging = false;
            toggle.style.cursor = 'grab';
        });

        // Panel
        const panel = document.createElement('div');
        panel.id = 'ycb-panel';
        panel.innerHTML = `
            <h3>🚫 Blocked Channels</h3>
            <div id="ycb-count" style="color:#aaa;font-size:12px;margin-bottom:10px;">Total: ${state.blocked.length}</div>
            <div id="ycb-list"></div>
            <div class="ycb-actions">
                <button style="background:#065fd4;" onclick="document.getElementById('ycb-panel').style.display='none'">Close</button>
                <button style="background:#c00;" onclick="if(confirm('Clear all?')){window._ycbClearAll()}">Clear All</button>
                <button style="background:#0a8a0a;" onclick="window._ycbExport()">Export</button>
                <button style="background:#f59e0b;" onclick="document.getElementById('ycb-import').click()">Import</button>
            </div>
            <input type="file" id="ycb-import" accept=".json" style="display:none">
        `;
        document.body.appendChild(panel);

        document.getElementById('ycb-import').onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = ev => importList(ev.target.result);
                reader.readAsText(file);
            }
        };
    };

    // Global functions for panel
    window._ycbUnblock = ch => { if (unblock(ch)) { alert(`✅ Unblocked: ${ch}`); renderList(); location.reload(); } };
    window._ycbClearAll = () => { state.blocked = []; save(); renderList(); location.reload(); };
    window._ycbExport = exportList;

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    const process = () => {
        processVideos();
        addChannelPageButton();
    };

    const detectUrlChange = () => {
        if (location.href !== state.lastUrl) {
            state.lastUrl = location.href;
            setTimeout(process, 400);
        }
    };

    setTimeout(() => {
        console.log('[YT Blocker v6] 🚀 Initializing...');
        console.log(`[YT Blocker v6] 📊 Blocking ${state.blocked.length} channels`);

        createUI();
        process();
        handleFullscreen();

        // Intervals
        setInterval(process, 1500);
        setInterval(detectUrlChange, 800);

        // Fullscreen listeners
        ['fullscreenchange', 'webkitfullscreenchange'].forEach(e => {
            document.addEventListener(e, handleFullscreen);
        });

        // Observer for YouTube's custom fullscreen
        setTimeout(() => {
            const player = document.querySelector('.html5-video-player');
            if (player) {
                new MutationObserver(handleFullscreen).observe(player, { attributes: true, attributeFilter: ['class'] });
            }
        }, 1000);

        console.log('[YT Blocker v6] ✅ Ready!');
    }, 400);

})();
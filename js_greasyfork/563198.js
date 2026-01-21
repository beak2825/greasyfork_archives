// ==UserScript==
// @name         Marte - itch.io Power Suite
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Silent pages, fix images, block users/games/tags. Includes Import/Export & Manager.
// @author       Armando Cornaglia
// @license      MIT
// @match        https://itch.io/*
// @match        https://*.itch.io/*
// @match        http://itch.io/*
// @match        http://*.itch.io/*
// @icon         https://itch.io/favicon.ico
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563198/Marte%20-%20itchio%20Power%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/563198/Marte%20-%20itchio%20Power%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Marte v2.0: Tag Filtering Engine Online.");

    const STORAGE_KEY = 'marte_data_v2';

    let state;
    try {
        const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('marte_data_v1') || '{"games":[], "users":[], "comments":[], "tags":[]}';
        state = JSON.parse(raw);
        if (!state.tags) state.tags = [];
    } catch (e) {
        state = {games: [], users: [], comments: [], tags: []};
    }

    let isLoading = false;
    let silentLoadPage = 2;
    let stopLoading = false;
    let isPanelOpen = false;

    const style = document.createElement('style');
    style.textContent = `
        .marte-hidden { display: none !important; }

        #marte-heart {
            position: fixed; bottom: 20px; right: 20px;
            width: 40px; height: 40px;
            background: #fa5c5c; color: white;
            border-radius: 50%; text-align: center; line-height: 42px;
            font-size: 20px; cursor: pointer; z-index: 2147483647;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            transition: transform 0.2s, background 0.2s;
            user-select: none; font-family: sans-serif;
        }
        #marte-heart:hover { transform: scale(1.1); background: #ff7070; }
        #marte-heart.active { transform: rotate(45deg); background: #333; }

        #marte-panel {
            position: fixed; bottom: 70px; right: 20px; width: 250px;
            background: #1a1a1a; border: 1px solid #333; color: #ccc;
            border-radius: 8px; font-family: sans-serif;
            font-size: 13px; z-index: 2147483646;
            box-shadow: 0 8px 20px rgba(0,0,0,0.6);
            display: none; flex-direction: column; overflow: hidden;
        }
        #marte-panel.open { display: flex; }

        .marte-header {
            background: #222; padding: 10px 15px; border-bottom: 1px solid #333;
            font-weight: 900; color: #fa5c5c; text-transform: uppercase; letter-spacing: 1px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .marte-body { padding: 15px; }
        .marte-row { display: flex; justify-content: space-between; margin-bottom: 6px; color: #888; font-size: 12px; }
        .marte-val { color: #fff; font-family: monospace; font-weight: bold; }

        .marte-input-group { display: flex; gap: 5px; margin-bottom: 10px; margin-top: 10px; border-top: 1px solid #333; padding-top: 10px; }
        #marte-tag-input {
            flex: 1; background: #333; border: 1px solid #444; color: #fff;
            padding: 5px; border-radius: 4px; font-size: 12px;
        }
        #marte-add-tag-btn {
            background: #fa5c5c; color: white; border: none; padding: 0 10px;
            border-radius: 4px; cursor: pointer; font-weight: bold;
        }

        .marte-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .marte-btn {
            background: #333; color: #ccc; border: none; padding: 8px;
            border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;
            transition: background 0.2s; text-align: center;
        }
        .marte-btn:hover { background: #444; color: #fff; }
        .marte-btn.primary { background: #fa5c5c; color: white; grid-column: span 2; }
        .marte-btn.primary:hover { background: #ff7070; }
        .marte-btn.loading { animation: marte-pulse 1.5s infinite; }

        #marte-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 2147483647;
            display: none; align-items: center; justify-content: center;
            backdrop-filter: blur(2px);
        }
        #marte-modal {
            background: #1a1a1a; width: 500px; max-height: 80vh;
            border-radius: 8px; border: 1px solid #444;
            display: flex; flex-direction: column;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8); color: #ccc; font-family: sans-serif;
        }
        .marte-modal-header {
            padding: 15px; border-bottom: 1px solid #333;
            font-weight: bold; font-size: 16px; color: #fa5c5c;
            display: flex; justify-content: space-between;
        }
        .marte-close { cursor: pointer; font-size: 20px; line-height: 1; }
        .marte-modal-tabs { display: flex; background: #222; }
        .marte-tab {
            flex: 1; padding: 10px; text-align: center; cursor: pointer;
            border-bottom: 2px solid transparent; color: #888;
        }
        .marte-tab.active { border-bottom-color: #fa5c5c; color: #fff; background: #2a2a2a; }
        .marte-list { padding: 0; margin: 0; overflow-y: auto; list-style: none; flex: 1; }
        .marte-item {
            padding: 10px 15px; border-bottom: 1px solid #333; display: flex;
            justify-content: space-between; align-items: center; font-size: 13px;
        }
        .marte-item:hover { background: #222; }
        .marte-item-name { color: #ddd; font-weight: bold; }
        .marte-item-meta { color: #666; font-size: 11px; margin-left: 10px; }
        .marte-unhide { color: #fa5c5c; cursor: pointer; font-weight: bold; font-size: 18px; }
        .marte-unhide:hover { color: #fff; }

        .marte-tools { display: flex; gap: 4px; margin-bottom: 4px; }
        .marte-inject-btn {
            display: inline-block; font-size: 10px; font-weight: bold; border-radius: 3px;
            cursor: pointer; padding: 2px 5px; text-transform: uppercase;
            pointer-events: auto; border: 1px solid;
        }
        .marte-hide-game { background: rgba(0,0,0,0.8); color: #ff9999; border-color: #ff9999; }
        .marte-hide-game:hover { background: #ff4d4d; color: white; }
        .marte-block-user { background: rgba(0,0,0,0.8); color: #ffcc00; border-color: #ffcc00; }
        .marte-block-user:hover { background: #e6b800; color: black; }

        .marte-comment-action { cursor: pointer; margin-left: 12px; font-size: 12px; font-weight: bold; }
        .marte-text-red { color: #ff9999 !important; }
        .marte-text-yellow { color: #ffcc00 !important; }

        @keyframes marte-pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
    `;
    document.head.appendChild(style);

    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        updateStats();
        scanPage();
    }

    function updateStats() {
        const elGames = document.getElementById('marte-stat-games');
        if(elGames) elGames.innerText = state.games.length;

        const elUsers = document.getElementById('marte-stat-users');
        if(elUsers) elUsers.innerText = state.users.length;

        const elComments = document.getElementById('marte-stat-comments');
        if(elComments) elComments.innerText = state.comments.length;

        const elTags = document.getElementById('marte-stat-tags');
        if(elTags) elTags.innerText = state.tags.length;
    }

    const refreshManagerList = (tab) => {
        const listEl = document.getElementById('marte-manager-list');
        if (!listEl) return;

        listEl.innerHTML = '';
        let data = [];

        if (tab === 'games') data = state.games;
        else if (tab === 'users') data = state.users;
        else if (tab === 'comments') data = state.comments;
        else if (tab === 'tags') data = state.tags;

        if (data.length === 0) {
            listEl.innerHTML = '<li class="marte-item" style="justify-content:center; color:#666;">List is empty</li>';
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'marte-item';

            let label = '';
            let meta = '';
            let idToRemove = '';

            if (tab === 'games') {
                label = item.title || 'Unknown Game';
                meta = `ID: ${item.id}`;
                idToRemove = item.id;
            } else if (tab === 'users') {
                label = item.slug;
                idToRemove = item.slug;
            } else if (tab === 'tags') {
                label = item;
                meta = 'Filtered Tag';
                idToRemove = item;
            } else {
                label = `Comment #${item}`;
                idToRemove = item;
            }

            li.innerHTML = `
                <div><span class="marte-item-name">${label}</span> <span class="marte-item-meta">${meta}</span></div>
                <div class="marte-unhide" title="Unhide">✕</div>
            `;

            li.querySelector('.marte-unhide').onclick = () => {
                if (tab === 'games') unhideGame(idToRemove);
                else if (tab === 'users') unblockUser(idToRemove);
                else if (tab === 'tags') unblockTag(idToRemove);
                else unhideComment(idToRemove);
            };

            listEl.appendChild(li);
        });
    };

    function hideGame(id, title) {
        if (!state.games.some(g => g.id === id)) {
            state.games.push({ id, title: title || 'Unknown Game', date: Date.now() });
            saveState();
        }
    }
    function unhideGame(id) {
        state.games = state.games.filter(g => g.id !== id);
        saveState();
        refreshManagerList('games');
    }

    function blockUser(slug) {
        if (!state.users.some(u => u.slug === slug)) {
            state.users.push({ slug, date: Date.now() });
            saveState();
        }
    }
    function unblockUser(slug) {
        state.users = state.users.filter(u => u.slug !== slug);
        saveState();
        refreshManagerList('users');
    }

    function hideComment(id) {
        if (!state.comments.includes(id)) {
            state.comments.push(id);
            saveState();
        }
    }
    function unhideComment(id) {
        state.comments = state.comments.filter(c => c !== id);
        saveState();
        refreshManagerList('comments');
    }

    function blockTag(tag) {
        const t = tag.toLowerCase().trim();
        if(t && !state.tags.includes(t)) {
            state.tags.push(t);
            saveState();
        }
    }
    function unblockTag(tag) {
        state.tags = state.tags.filter(t => t !== tag);
        saveState();
        refreshManagerList('tags');
    }

    function exportSettings() {
        const dateStr = new Date().toISOString().split('T')[0];
        const header = `# Marte Blocklist Export (${dateStr})\n\n`;
        const humanReadable =
            `### Users Blocked (${state.users.length})\n` + state.users.map(u => `- ${u.slug}`).join('\n') +
            `\n\n### Tags Blocked (${state.tags.length})\n` + state.tags.map(t => `- ${t}`).join('\n') +
            `\n\n### Games Hidden (${state.games.length})\n` + state.games.map(g => `- ${g.title} (ID: ${g.id})`).join('\n');

        const rawData = `\n\n---\n\n${JSON.stringify(state)}\n`;

        const blob = new Blob([header + humanReadable + rawData], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marte_backup_${dateStr}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const startMarker = '';
            const endMarker = '';
            const startIndex = text.indexOf(startMarker);
            const endIndex = text.indexOf(endMarker);

            if (startIndex !== -1 && endIndex !== -1) {
                try {
                    const jsonStr = text.substring(startIndex + startMarker.length, endIndex).trim();
                    const importedState = JSON.parse(jsonStr);
                    importedState.users.forEach(u => blockUser(u.slug));
                    importedState.games.forEach(g => hideGame(g.id, g.title));
                    importedState.comments.forEach(c => hideComment(c));
                    if(importedState.tags) importedState.tags.forEach(t => blockTag(t));

                    alert('Marte: Import Successful!');
                    location.reload();
                } catch (err) {
                    alert('Marte: Error parsing import file.');
                }
            } else {
                alert('Marte: Invalid file format.');
            }
        };
        reader.readAsText(file);
    }

    function getAuthor(node, type) {
        if (type === 'game') {
            const link = node.querySelector('.user_link') || node.querySelector('a.game_thumb') || node.querySelector('.game_author a');
            if (link) {
                try {
                    const url = new URL(link.href);
                    if (url.hostname.endsWith('.itch.io')) {
                        const parts = url.hostname.split('.');
                        if (parts.length >= 3) return parts[0];
                    }
                } catch(e) {}
            }
        } else if (type === 'comment') {
            const link = node.querySelector('.avatar_container');
            if(link && link.href.includes('/profile/')) return link.href.split('/profile/')[1].split('/')[0];
        }
        return null;
    }

    function getGameTags(node) {
        let tags = [];
        const tagLinks = node.querySelectorAll('.cell_tags a');
        tagLinks.forEach(a => tags.push(a.innerText.toLowerCase().replace('#', '').trim()));

        const genre = node.querySelector('.game_genre');
        if (genre) tags.push(genre.innerText.toLowerCase().trim());

        return tags;
    }

    function processGame(node) {
        const id = node.getAttribute('data-game_id');
        const author = getAuthor(node, 'game');
        const titleEl = node.querySelector('.title');
        const title = titleEl ? titleEl.innerText : 'Unknown';
        const gameTags = getGameTags(node);

        const isGameBlocked = state.games.some(g => g.id === id);
        const isUserBlocked = author && state.users.some(u => u.slug === author);
        const isTagBlocked = gameTags.some(t => state.tags.includes(t));

        if (isGameBlocked || isUserBlocked || isTagBlocked) node.classList.add('marte-hidden');
        else node.classList.remove('marte-hidden');

        const tools = node.querySelector('.cell_tools, .game_cell_tools');
        if (tools && !node.querySelector('.marte-tools')) {
            const div = document.createElement('div');
            div.className = 'marte-tools';

            if (id) {
                const btn = document.createElement('span');
                btn.className = 'marte-inject-btn marte-hide-game';
                btn.innerText = '✕ Game';
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if(confirm('Hide this game?')) hideGame(id, title);
                };
                div.appendChild(btn);
            }

            if (author) {
                const btn = document.createElement('span');
                btn.className = 'marte-inject-btn marte-block-user';
                btn.innerText = '🚫 User';
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if(confirm(`Block user ${author}?`)) blockUser(author);
                };
                div.appendChild(btn);
            }
            tools.insertBefore(div, tools.firstChild);
        }
    }

    function processComment(node) {
        const fullId = node.id;
        if(!fullId || !fullId.startsWith('post-')) return;
        const id = fullId.replace('post-', '');
        const author = getAuthor(node, 'comment');

        const isHidden = state.comments.includes(id) || (author && state.users.some(u => u.slug === author));

        const elementsToToggle = [node];
        if (node.nextElementSibling?.classList.contains('community_post_replies')) {
            elementsToToggle.push(node.nextElementSibling);
        }

        elementsToToggle.forEach(el => isHidden ? el.classList.add('marte-hidden') : el.classList.remove('marte-hidden'));

        const footer = node.querySelector('.post_footer');
        if (footer && !node.querySelector('.marte-hide-comment')) {
            const btnHide = document.createElement('span');
            btnHide.className = 'marte-comment-action marte-text-red marte-hide-comment';
            btnHide.innerText = 'Hide';
            btnHide.onclick = () => { if(confirm('Hide this comment?')) hideComment(id); };
            footer.appendChild(btnHide);

            if(author) {
                const btnBlock = document.createElement('span');
                btnBlock.className = 'marte-comment-action marte-text-yellow';
                btnBlock.innerText = 'Block User';
                btnBlock.onclick = () => { if(confirm(`Block ${author}?`)) blockUser(author); };
                footer.appendChild(btnBlock);
            }
        }
    }

    function scanPage() {
        document.querySelectorAll('.game_cell').forEach(processGame);
        document.querySelectorAll('.community_post').forEach(processComment);
    }

    function findMainGrid() {
        const allCells = document.querySelectorAll('.game_cell');
        if (allCells.length === 0) return null;
        const parentCounts = new Map();
        allCells.forEach(cell => {
            const p = cell.parentElement;
            parentCounts.set(p, (parentCounts.get(p) || 0) + 1);
        });
        let best = null; let max = 0;
        for (let [p, c] of parentCounts.entries()) { if (c > max) { max = c; best = p; } }
        return best;
    }

    async function fetchNext() {
        if (stopLoading) return;
        const btn = document.getElementById('marte-load-btn');
        btn.innerText = `Fetching Page ${silentLoadPage}...`;

        try {
            const url = new URL(window.location.href);
            url.searchParams.set('page', silentLoadPage);
            const res = await fetch(url.toString());
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const newGames = doc.querySelectorAll('.game_cell');

            if (newGames.length === 0) {
                stopLoading = true;
                isLoading = false;
                btn.innerText = 'End of Results';
                btn.classList.remove('loading');
                return;
            }

            const grid = findMainGrid();
            if (grid) {
                newGames.forEach(g => {
                    const nid = g.getAttribute('data-game_id');
                    if (nid && document.querySelector(`.game_cell[data-game_id="${nid}"]`)) return;

                    g.querySelectorAll('img[data-lazy_src]').forEach(img => {
                        img.src = img.getAttribute('data-lazy_src');
                        img.classList.add('lazy_loaded');
                    });

                    grid.appendChild(document.importNode(g, true));
                });
                scanPage();
                silentLoadPage++;
                setTimeout(fetchNext, 1000);
            }
        } catch (e) {
            stopLoading = true;
            btn.innerText = 'Error (Retry)';
            isLoading = false;
            btn.classList.remove('loading');
        }
    }

    function toggleLoader() {
        const btn = document.getElementById('marte-load-btn');
        if (isLoading) {
            stopLoading = true; isLoading = false;
            btn.innerText = 'Start Silent Load';
            btn.classList.remove('loading');
        } else {
            stopLoading = false; isLoading = true;
            btn.innerText = 'Stop Loading';
            btn.classList.add('loading');
            fetchNext();
        }
    }

    const heart = document.createElement('div');
    heart.id = 'marte-heart';
    heart.innerHTML = '❤';
    heart.title = 'Marte Controls';
    document.body.appendChild(heart);

    const panel = document.createElement('div');
    panel.id = 'marte-panel';
    panel.innerHTML = `
        <div class="marte-header">Marte <span style="font-size:10px; color:#666">v2.0</span></div>
        <div class="marte-body">
            <div class="marte-row"><span>Hidden Games</span> <span id="marte-stat-games" class="marte-val">0</span></div>
            <div class="marte-row"><span>Blocked Users</span> <span id="marte-stat-users" class="marte-val">0</span></div>
            <div class="marte-row"><span>Hidden Comments</span> <span id="marte-stat-comments" class="marte-val">0</span></div>
            <div class="marte-row"><span>Filtered Tags</span> <span id="marte-stat-tags" class="marte-val">0</span></div>

            <div class="marte-input-group">
                <input type="text" id="marte-tag-input" placeholder="Tag to block (e.g. horror)">
                <button id="marte-add-tag-btn">+</button>
            </div>

            <div class="marte-actions">
                <button id="marte-load-btn" class="marte-btn primary">Start Silent Load</button>
                <button id="marte-manage-btn" class="marte-btn">Manage Hidden</button>
                <button id="marte-export-btn" class="marte-btn">Export .md</button>
                <button id="marte-import-btn" class="marte-btn">Import .md</button>
            </div>
            <input type="file" id="marte-file-input" style="display:none" accept=".md,.txt">
        </div>
    `;
    document.body.appendChild(panel);

    const modalHTML = `
    <div id="marte-modal-overlay">
        <div id="marte-modal">
            <div class="marte-modal-header">
                <span>Manage Hidden Content</span>
                <span class="marte-close" id="marte-modal-close">✕</span>
            </div>
            <div class="marte-modal-tabs">
                <div class="marte-tab active" data-tab="games">Games</div>
                <div class="marte-tab" data-tab="users">Users</div>
                <div class="marte-tab" data-tab="tags">Tags</div>
                <div class="marte-tab" data-tab="comments">Comments</div>
            </div>
            <ul class="marte-list" id="marte-manager-list"></ul>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    heart.onclick = () => {
        isPanelOpen = !isPanelOpen;
        if (isPanelOpen) {
            panel.classList.add('open');
            heart.classList.add('active');
            heart.innerHTML = '✕';
        } else {
            panel.classList.remove('open');
            heart.classList.remove('active');
            heart.innerHTML = '❤';
        }
    };

    document.getElementById('marte-load-btn').onclick = toggleLoader;
    document.getElementById('marte-export-btn').onclick = exportSettings;
    document.getElementById('marte-import-btn').onclick = () => document.getElementById('marte-file-input').click();
    document.getElementById('marte-file-input').onchange = (e) => importSettings(e.target.files[0]);

    const tagInput = document.getElementById('marte-tag-input');
    const tagBtn = document.getElementById('marte-add-tag-btn');
    tagBtn.onclick = () => {
        const val = tagInput.value;
        if(val) { blockTag(val); tagInput.value = ''; }
    };
    tagInput.onkeypress = (e) => {
        if(e.key === 'Enter') { blockTag(tagInput.value); tagInput.value = ''; }
    };

    const modalOverlay = document.getElementById('marte-modal-overlay');
    document.getElementById('marte-manage-btn').onclick = () => {
        modalOverlay.style.display = 'flex';
        refreshManagerList('games');
    };
    document.getElementById('marte-modal-close').onclick = () => { modalOverlay.style.display = 'none'; };

    document.querySelectorAll('.marte-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.marte-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            refreshManagerList(tab.getAttribute('data-tab'));
        };
    });

    updateStats();
    scanPage();
    const observer = new MutationObserver(() => scanPage());
    observer.observe(document.body, { childList: true, subtree: true });

    console.log("Marte: Loaded Successfully.");

})();
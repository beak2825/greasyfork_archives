// ==UserScript==
// @name         FV - Wishlist Public and Private
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      7.2
// @description  Wishlists in Furvilla. Search other users and update your own.
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560426/FV%20-%20Wishlist%20Public%20and%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/560426/FV%20-%20Wishlist%20Public%20and%20Private.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const STORAGE_KEY = 'fv_local_wishlist';
    const GOOGLE_CSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRyuYHRZatst3_lK8ty54R_sQnrHtjWAavzxBz0tcrMeSNZA-aN3-w-8k1XBtXK_U-jeodW_8QJL5H6/pub?gid=1853087050&single=true&output=csv';

    const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
    const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    /* ======================
       PANEL
    ====================== */
    function createWishlistPanel() {
        const wrapper = document.createElement('div');
        wrapper.className = 'fv-wishlist-collapsed';
        wrapper.style.marginTop = '10px';
        wrapper.innerHTML = `
            <hr>
            <h4 class="align-center fv-wishlist-header" style="cursor:pointer;">
                Wishlist
                <i class="fa-solid fa-chevron-down fv-wishlist-chevron"></i>
            </h4>
            <div class="fv-wishlist-body" style="display:none; padding:5px;">
                <ul class="fv-quick-links fv-wishlist-list"></ul>
            </div>
        `;

        const header = wrapper.querySelector('.fv-wishlist-header');
        const body = wrapper.querySelector('.fv-wishlist-body');
        const chevron = wrapper.querySelector('.fv-wishlist-chevron');
        const listEl = wrapper.querySelector('.fv-wishlist-list');

        header.addEventListener('click', () => {
            const open = body.style.display === 'block';
            body.style.display = open ? 'none' : 'block';
            chevron.classList.toggle('fa-chevron-down', open);
            chevron.classList.toggle('fa-chevron-up', !open);
        });

        let dragIndex = null;

        function render() {
            const items = load();
            listEl.innerHTML = '';
            if (!items.length) {
                listEl.innerHTML = `<li style="opacity:.6;pointer-events:none;"><span style="flex:1;">No wishlist items</span></li>`;
                return;
            }

            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.draggable = true;
                li.dataset.index = index;
                li.className = 'fv-quick-links-item';

                // List
                li.innerHTML = `
                    <span class="fv-ql-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></span>
                    <a href="${item.url}" style="flex:1;">${item.name}</a>
                    <span class="fv-wishlist-icons">
                        <i class="fa-solid fa-pencil" title="Edit"></i>
                        <i class="fa-solid fa-trash" title="Delete"></i>
                    </span>
                `;
                listEl.appendChild(li);

                // Delete
                const deleteIcon = li.querySelector('.fa-trash');
                deleteIcon.onclick = () => {
                    const data = load();
                    data.splice(index, 1);
                    save(data);
                    render();
                };

                // Edit
                const editIcon = li.querySelector('.fa-pencil');
                editIcon.onclick = () => {
                    if (li.nextSibling?.classList?.contains('fv-wishlist-editor')) return;
                    const editor = document.createElement('li');
                    editor.className = 'fv-wishlist-editor';
                    editor.style.paddingLeft = '28px';
                    editor.innerHTML = `
                        <div style="display:flex;flex-direction:column;gap:4px;">
                            <input class="input" type="text" value="${item.name}">
                            <input class="input" type="text" placeholder="Hover note (optional)" value="${item.note || ''}">
                            <div style="display:flex;gap:6px;">
                                <button class="btn btn-sm btn-primary">Save</button>
                                <button class="btn btn-sm">Cancel</button>
                            </div>
                        </div>
                    `;
                    li.after(editor);
                    const [nameInputEdit, noteInputEdit] = editor.querySelectorAll('input');
                    const [saveBtn, cancelBtn] = editor.querySelectorAll('button');
                    cancelBtn.onclick = () => editor.remove();
                    saveBtn.onclick = () => {
                        const data = load();
                        data[index] = { ...data[index], name: nameInputEdit.value.trim() || data[index].name, note: noteInputEdit.value.trim() };
                        save(data);
                        render();
                        editor.remove();
                    };
                };

                // Drag drop
                li.addEventListener('dragstart', () => { dragIndex = index; li.style.opacity = '0.5'; });
                li.addEventListener('dragend', () => { li.style.opacity = ''; });
                li.addEventListener('dragover', e => e.preventDefault());
                li.addEventListener('drop', () => {
                    if (dragIndex === null || dragIndex === index) return;
                    const data = load();
                    const [moved] = data.splice(dragIndex, 1);
                    data.splice(index, 0, moved);
                    save(data);
                    dragIndex = null;
                    render();
                });
            });
        }

        render();
        wrapper.renderWishlist = render;
        return wrapper;
    }

    function injectWishlistPanel() {
        if (document.querySelector('.fv-wishlist-collapsed')) return;
        const widget = document.querySelector('.widget .user-info');
        if (widget) widget.after(createWishlistPanel());
    }

    function injectAddButton() {
        const h1 = document.querySelector('h1');
        if (!h1 || !h1.textContent.startsWith('Item - ') || h1.dataset.wl) return;
        h1.dataset.wl = '1';

        const name = h1.textContent.replace('Item - ', '').trim();
        const url = location.href;
        const btn = document.createElement('button');
        btn.className = 'btn btn-sm btn-primary';
        btn.style.marginLeft = '10px';
        const exists = load().some(i => i.url === url);
        btn.textContent = exists ? '✓ Added' : '+ Add to Wishlist';
        btn.disabled = exists;
        btn.onclick = () => {
            const data = load();
            if (data.some(i => i.url === url)) return;
            data.push({ name, url, note: '' });
            save(data);
            btn.textContent = '✓ Added';
            btn.disabled = true;
            document.querySelector('.fv-wishlist-collapsed')?.renderWishlist?.();
        };
        h1.appendChild(btn);
    }

    function createPublicPanel() {
        const wrapper = document.createElement('div');
        wrapper.className = 'fv-wishlist-public';
        wrapper.style.marginTop = '10px';
        wrapper.innerHTML = `
            <hr>
            <h4 class="align-center fv-wishlist-header" style="cursor:pointer;">
                Public Wishlist
                <i class="fa-solid fa-chevron-down fv-wishlist-chevron"></i>
            </h4>
            <div class="fv-wishlist-body" style="display:none; padding:5px;">
                <div class="fv-ql-form" style="margin-bottom:6px;">
                    <input class="input" id="fv-search-username" type="text" placeholder="Search username">
                    <button class="btn btn-primary" id="fv-search-btn" style="margin-top:4px;">Search</button>
                </div>
                <div id="fv-search-results" class="fv-wishlist-list"></div>
                <button class="btn btn-primary" id="fv-publish-btn" style="width:100%; margin-top:6px;">Publish My Wishlist</button>
                <p id="fv-publish-status" style="margin-top:4px;"></p>
            </div>
        `;

        const header = wrapper.querySelector('.fv-wishlist-header');
        const body = wrapper.querySelector('.fv-wishlist-body');
        const chevron = wrapper.querySelector('.fv-wishlist-chevron');
        header.addEventListener('click', () => {
            const open = body.style.display === 'block';
            body.style.display = open ? 'none' : 'block';
            chevron.classList.toggle('fa-chevron-down', open);
            chevron.classList.toggle('fa-chevron-up', !open);
        });

        const searchBtn = wrapper.querySelector('#fv-search-btn');
        const searchInput = wrapper.querySelector('#fv-search-username');
        const resultsDiv = wrapper.querySelector('#fv-search-results');

        // parse
        function parseWishlistJson(rawJson, username) {
            if (!rawJson) return [];
            rawJson = rawJson.trim();
            if (rawJson.startsWith('"') && rawJson.endsWith('"')) {
                rawJson = rawJson.slice(1, -1);
            }
            rawJson = rawJson.replace(/""/g, '"').trim();
            try {
                return JSON.parse(rawJson);
            } catch (e) {
                console.error('Failed to parse wishlist JSON for user:', username, rawJson, e);
                return [];
            }
        }

        searchBtn.onclick = async () => {
            const username = searchInput.value.trim();
            if (!username) return;
            resultsDiv.innerHTML = 'Loading...';
            try {
                const res = await fetch(GOOGLE_CSV);
                const csv = await res.text();
                const rows = csv.split('\n').slice(1);
                const matches = [];
                const searchName = username.toLowerCase();

                for (let r of rows) {
                    if (!r.trim()) continue;
                    const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    const userField = (cols[1] || '').replace(/^"|"$/g, '').trim();
                    const userLower = userField.toLowerCase();

                    console.log(`Parsed username: "${userField}" from row: ${r}`);

                    if (userLower === searchName) {
                        matches.push(cols);
                    }
                }

                if (!matches.length) {
                    resultsDiv.innerHTML = 'No wishlist found.';
                    return;
                }

                matches.sort((a, b) => Number(b[3] || 0) - Number(a[3] || 0));

                let rawJson = matches[0][4] || '[]';

                const items = parseWishlistJson(rawJson, username);

                if (!items.length) {
                    resultsDiv.innerHTML = 'Wishlist is empty.';
                    return;
                }

                resultsDiv.innerHTML = '';
                const ul = document.createElement('ul');
                ul.className = 'fv-quick-links';
                items.forEach(i => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${i.url}" target="_blank" style="flex:1;">${i.name}</a>`;
                    if (i.note) li.querySelector('a').title = i.note;
                    ul.appendChild(li);
                });
                resultsDiv.appendChild(ul);

            } catch (err) {
                console.error(err);
                resultsDiv.innerHTML = 'Error fetching wishlist.';
            }
        };

        const publishBtn = wrapper.querySelector('#fv-publish-btn');
        const statusP = wrapper.querySelector('#fv-publish-status');
        publishBtn.onclick = () => {
            const usernameEl = document.querySelector('.user-info h4 a');
            const username = usernameEl?.textContent.trim();
            const user_id = usernameEl?.href.match(/profile\/(\d+)/)?.[1];
            if (!username || !user_id) {
                statusP.textContent = 'Cannot detect username/user ID.';
                return;
            }
            const wishlist = load();
            if (!wishlist.length) {
                statusP.textContent = 'Wishlist is empty.';
                return;
            }
            const formData = new FormData();
            formData.append('entry.66130900', username);
            formData.append('entry.2449843', user_id);
            formData.append('entry.923863430', Date.now());
            formData.append('entry.1579615506', JSON.stringify(wishlist));
            fetch('https://docs.google.com/forms/d/e/1FAIpQLSfuEXQboDh_dncYGA2lpJsE7cmOdrrAPV8HkR-A6I0Dfvfv0g/formResponse', {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            }).then(() => {
                statusP.textContent = 'Wishlist published!';
            }).catch(err => {
                console.error(err);
                statusP.textContent = 'Error publishing wishlist.';
            });
        };

        return wrapper;
    }

    function injectPublicPanel() {
        if (document.querySelector('.fv-wishlist-public')) return;
        const widget = document.querySelector('.widget .user-info');
        if (widget) widget.after(createPublicPanel());
    }

    /* ======================
       INIT
    ====================== */
    const init = () => {
        const style = document.createElement('style');
        style.innerHTML = `
        /* Style for wishlist drag handle icon */
        .fv-wishlist-collapsed .fa-grip-vertical {
            color: #5a4d3b; /* match your provided color */
            font-size: 20px;
            padding: 2px;
            transition: color 0.3s, transform 0.3s;
        }
        .fv-wishlist-collapsed .fa-grip-vertical:hover {
            color: #d17f4d; /* optional hover color */
            transform: scale(1.2);
        }

        /* Style for icons on the right side of wishlist items (edit/delete icons) */
        .fv-wishlist-collapsed .fv-wishlist-icons {
            display: flex;
            gap: 8px;
            margin-left: auto; /* push to the right */
            align-items: center;
            font-size: 14px; /* overall size for icons container */
        }

        /* Smaller font size for individual icons and same color as provided */
        .fv-wishlist-collapsed .fv-wishlist-icons i {
            font-size: 12px; /* smaller icons */
            color: #5a4d3b; /* same as provided color */
            transition: color 0.3s, transform 0.3s;
        }
        .fv-wishlist-collapsed .fv-wishlist-icons i:hover {
            color: #d17f4d; /* hover color */
            transform: scale(1.2);
        }

        .fv-quick-links {
            padding-left: 0;
            list-style: none;
        }

        .fv-quick-links-item {
            display: flex;
            align-items: center;
            padding-left: 0; /* No indentation */
        }
        `;
        document.head.appendChild(style);

        injectWishlistPanel();
        injectAddButton();
        injectPublicPanel();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
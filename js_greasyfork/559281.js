// ==UserScript==
// @name         FV - Quick Links
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      5.4
// @description  Quick Links for all your Furvilla needs! Adds collapsible links, you may add/remove/rename and organize links that you may need on the go!
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559281/FV%20-%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/559281/FV%20-%20Quick%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'fv_quick_links';
    const COLLAPSE_KEY = 'fv_quick_links_collapsed';

    const loadLinks = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const saveLinks = links => localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    const isCollapsed = () => localStorage.getItem(COLLAPSE_KEY) === 'true';
    const setCollapsed = val => localStorage.setItem(COLLAPSE_KEY, val);
    const normalizeURL = url => /^https?:\/\//i.test(url) ? url : 'https://' + url;

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fv-quick-links { list-style:none; padding:0; margin:0; position: relative; }
            .fv-quick-links li {
                display:flex;
                align-items:center;
                padding:6px 4px;
                border-radius:4px;
                transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
                position: relative;
            }
            .fv-quick-links li.dragging {
                opacity:.9;
                transform:scale(1.03);
                z-index:1000;
                position:absolute;
                width: calc(100% - 8px);
                pointer-events: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            }
            .fv-quick-links li.editing { background:rgba(0,0,0,0.15); }
            .fv-quick-links li.placeholder {
                background: rgba(255,255,255,0.1);
                border: 1px dashed rgba(255,255,255,0.3);
                height: 0;
                margin: 0;
                overflow: hidden;
                transition: height 0.2s ease, margin 0.2s ease;
            }
            .fv-ql-handle { cursor:grab; color:#777; padding:0 6px; }
            .fv-ql-handle:hover { color:#aaa; }
            .fv-ql-btn { background:none; border:none; cursor:pointer; padding:0 6px; font-size:14px; }
            .fv-ql-edit { color:#9bbdc7; }
            .fv-ql-delete { color:#c77; }
            .fv-ql-save { color:#7c7; }
            .fv-ql-cancel { color:#c77; }
            .fv-ql-body { overflow: hidden; transition: max-height 0.3s ease, opacity 0.25s ease; max-height:1000px; opacity:1; }
            .fv-ql-collapsed .fv-ql-body { max-height:0; opacity:0; }
            .fv-ql-header { cursor:pointer; user-select:none; }
            .fv-ql-chevron { float:right; transition:transform 0.25s ease; font-size: 0.5em; }
            .fv-ql-collapsed .fv-ql-chevron { transform:rotate(-90deg); }
            .fv-ql-form .input { width:100%; margin-bottom:4px; }
            .fv-quick-links li.empty-state {
                text-align:center;
                opacity:0.6;
                font-style:italic;
            }
        `;
        document.head.appendChild(style);
    }

    function renderLinks() {
        const list = document.getElementById('fv-quick-links');
        if (!list) return;
        list.innerHTML = '';

        const links = loadLinks();
        if (!links.length) {
            const empty = document.createElement('li');
            empty.textContent = "No Quick Links yet. Add one!";
            empty.className = 'empty-state';
            list.appendChild(empty);
            return;
        }

        links.forEach((link, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            li.innerHTML = `
                <span class="fv-ql-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></span>
                <a href="${link.url}" style="flex:1;">${link.name}</a>
                <button class="fv-ql-btn fv-ql-edit" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                <button class="fv-ql-btn fv-ql-delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
            `;
            list.appendChild(li);
        });

        enableDelete();
        enableEdit();
        enableDragAndDrop();
    }

    function enableDelete() {
        document.querySelectorAll('.fv-ql-delete').forEach((btn, i) => {
            btn.onclick = () => {
                const links = loadLinks();
                links.splice(i, 1);
                saveLinks(links);
                renderLinks();
            };
        });
    }

    function enableEdit() {
        document.querySelectorAll('.fv-ql-edit').forEach((btn, i) => {
            btn.onclick = () => startEdit(i);
        });
    }

    function startEdit(index) {
        const list = document.getElementById('fv-quick-links');
        const li = list.children[index];
        const links = loadLinks();
        const link = links[index];

        li.classList.add('editing');
        li.innerHTML = `
            <span class="fv-ql-handle"><i class="fa-solid fa-grip-vertical"></i></span>
            <div style="flex:1;">
                <input class="input" id="edit-name" type="text" value="${link.name}">
                <input class="input" id="edit-url" type="text" value="${link.url}">
            </div>
            <button class="fv-ql-btn fv-ql-save" title="Save"><i class="fa-solid fa-check"></i></button>
            <button class="fv-ql-btn fv-ql-cancel" title="Cancel"><i class="fa-solid fa-xmark"></i></button>
        `;

        const nameInput = li.querySelector('#edit-name');
        const urlInput = li.querySelector('#edit-url');

        const saveEdit = () => {
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            if (!name || !url) return;
            links[index] = { name, url: normalizeURL(url) };
            saveLinks(links);
            renderLinks();
        };

        const cancelEdit = () => renderLinks();

        li.querySelector('.fv-ql-save').onclick = saveEdit;
        li.querySelector('.fv-ql-cancel').onclick = cancelEdit;

        [nameInput, urlInput].forEach(input => {
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
            });
        });

        nameInput.focus();
    }

    function enableDragAndDrop() {
    const list = document.getElementById('fv-quick-links');
    let draggedLi = null;
    let draggedIndex = null;
    let placeholder = null;
    let offsetY = 0;

    const listRect = list.getBoundingClientRect();

    list.querySelectorAll('.fv-ql-handle').forEach(handle => {
        handle.onmousedown = e => {
            const li = handle.closest('li');
            draggedLi = li;
            draggedIndex = +li.dataset.index;

            const liRect = li.getBoundingClientRect();
            offsetY = e.clientY - liRect.top;

            placeholder = document.createElement('li');
            placeholder.className = 'placeholder';
            placeholder.style.height = li.offsetHeight + 'px';
            list.insertBefore(placeholder, li.nextSibling);

            li.classList.add('dragging');
            li.style.width = liRect.width + 'px';
            li.style.position = 'absolute';
            li.style.left = (liRect.left - listRect.left) + 'px';
            li.style.top = (liRect.top - listRect.top) + 'px';

            function onMouseMove(ev) {
                if (!draggedLi) return;
                draggedLi.style.top = (ev.clientY - listRect.top - offsetY) + 'px';

                // Determine placeholder position
                const items = [...list.children].filter(
                    child => child !== draggedLi && !child.classList.contains('placeholder')
                );

                for (const item of items) {
                    const rect = item.getBoundingClientRect();
                    const middleY = rect.top + rect.height / 2;
                    if (ev.clientY < middleY) {
                        if (placeholder.nextSibling !== item) {
                            list.insertBefore(placeholder, item);
                        }
                        break;
                    }
                    if (item === items[items.length - 1]) {
                        list.appendChild(placeholder);
                    }
                }
            }

            function onMouseUp() {
                if (!draggedLi) return;

                const newIndex = [...list.children].indexOf(placeholder);
                const oldIndex = draggedIndex;

                draggedLi.style.position = '';
                draggedLi.style.top = '';
                draggedLi.style.left = '';
                draggedLi.style.width = '';
                draggedLi.classList.remove('dragging');

                if (oldIndex !== newIndex) {
                    const links = loadLinks();
                    const [moved] = links.splice(oldIndex, 1);
                    links.splice(newIndex, 0, moved);
                    saveLinks(links);
                    renderLinks();
                } else {
                    renderLinks();
                }

                placeholder.remove();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                draggedLi = null;
                placeholder = null;
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };
    });
}


    function toggleCollapse(container) {
        const collapsed = container.classList.toggle('fv-ql-collapsed');
        setCollapsed(collapsed);
    }

    function createPanel() {
        const onlineP = document.querySelector('.user-info p a[href*="/online"]')?.parentElement;
        if (!onlineP || document.getElementById('fv-quick-links')) return;

        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.innerHTML = `
            <hr>
            <h4 class="align-center fv-ql-header">
                Quick Links
                <i class="fa-solid fa-chevron-down fv-ql-chevron"></i>
            </h4>

            <div id="fv-ql-body" class="fv-ql-body">
                <ul id="fv-quick-links" class="fv-quick-links"></ul>

                <div class="fv-ql-form">
                    <div><input class="input" id="fv-link-name" type="text" placeholder="Link name"></div>
                    <div><input class="input" id="fv-link-url" type="text" placeholder="Link URL"></div>
                    <button id="fv-add-link" class="btn btn-primary" style="width:100%;">Add Link</button>
                </div>
            </div>
        `;

        onlineP.after(container);

        if (isCollapsed()) container.classList.add('fv-ql-collapsed');

        container.querySelector('.fv-ql-header').onclick = () => toggleCollapse(container);

        const nameInput = document.getElementById('fv-link-name');
        const urlInput = document.getElementById('fv-link-url');

        const addLink = () => {
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            if (!name || !url) return;

            const links = loadLinks();
            links.push({ name, url: normalizeURL(url) });
            saveLinks(links);

            nameInput.value = '';
            urlInput.value = '';
            renderLinks();
        };

        document.getElementById('fv-add-link').onclick = addLink;

        [nameInput, urlInput].forEach(input => {
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') addLink();
                if (e.key === 'Escape') {
                    nameInput.value = '';
                    urlInput.value = '';
                }
            });
        });

        renderLinks();
    }

    injectStyles();
    createPanel();
})();

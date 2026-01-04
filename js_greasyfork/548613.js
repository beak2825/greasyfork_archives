// ==UserScript==
// @name         LOLZ: drag, hide, add custom menu items
// @namespace    https://lolz.live/
// @version      1.0
// @description  Редактирование пунктов меню
// @author       MisterLis
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548613/LOLZ%3A%20drag%2C%20hide%2C%20add%20custom%20menu%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/548613/LOLZ%3A%20drag%2C%20hide%2C%20add%20custom%20menu%20items.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'manageItemsData_vFinal';

    function qs(sel, ctx = document) { return ctx.querySelector(sel); }
    function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

    function normalizeHref(href) {
        try {
            const url = new URL(href, location.origin);
            url.searchParams.delete('_xfToken');
            return url.href;
        } catch { return href; }
    }

    function loadData() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { order: [], hidden: [], custom: [] };
        } catch { return { order: [], hidden: [], custom: [] }; }
    }
    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function rebuildContainer() {
        const container = qs('.manageItems');
        if (!container) return;
        const data = loadData();

        const native = qsa('.manageItem', container)
            .filter(el => !el.dataset.custom)
            .map(el => ({ el, href: normalizeHref(el.href), isCustom: false }))
            .filter(it => !data.hidden.includes(it.href));

        const customs = data.custom.map(c => {
            const a = document.createElement('a');
            a.className = 'manageItem';
            a.href = c.href;
            a.dataset.custom = '1';
            a.innerHTML = `
                <div class="SvgIcon duotone">
                  <svg width="20" height="20" fill="currentColor"><path d="${c.icon}"/></svg>
                </div>
                <span>${c.text}</span>`;
            return { el: a, href: c.href, isCustom: true };
        });

        const all = [...native, ...customs];
        const orderMap = {};
        data.order.forEach((h, i) => orderMap[h] = i);
        all.sort((a, b) => (orderMap[a.href] ?? 999) - (orderMap[b.href] ?? 999));

        container.innerHTML = '';
        all.forEach(it => container.appendChild(it.el));

        initDragAndDrop(container);
    }

    function initDragAndDrop(container) {
        const items = qsa('.manageItem', container);
        items.forEach(it => {
            it.draggable = true;
            it.style.cursor = 'grab';
        });

        let dragged = null;

        function onStart(e) {
            dragged = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', normalizeHref(this.href));
            this.classList.add('dragging');
        }
        function onEnd() { this.classList.remove('dragging'); }
        function onOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const after = getDragAfterElement(container, e.clientY);
            if (after == null) container.appendChild(dragged);
            else container.insertBefore(dragged, after);
        }
        function onDrop(e) {
            e.preventDefault();
            saveOrder();
        }
        items.forEach(it => {
            it.addEventListener('dragstart', onStart);
            it.addEventListener('dragend', onEnd);
            it.addEventListener('dragover', onOver);
            it.addEventListener('drop', onDrop);
        });
    }
    function getDragAfterElement(container, y) {
        const els = [...qsa('.manageItem', container).filter(it => !it.classList.contains('dragging'))];
        return els.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    function saveOrder() {
        const data = loadData();
        data.order = qsa('.manageItem').map(el => normalizeHref(el.href));
        saveData(data);
    }

    function createEditTrigger() {
        const cont = qs('.manageItems');
        if (!cont) return;

        const bar = document.createElement('div');
        bar.className = 'editTriggerBar';
        bar.innerHTML = `<svg width="24" height="24" fill="#888"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.97 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg>`;
        bar.title = 'Редактировать пункты';
        bar.style.cssText = 'text-align:center;padding:6px 0;cursor:pointer;opacity:.6;transition:opacity .2s';
        bar.onmouseenter = () => bar.style.opacity = 1;
        bar.onmouseleave = () => bar.style.opacity = .6;
        bar.onclick = () => toggleEditMode();
        cont.parentElement.insertBefore(bar, cont.nextSibling);

        const plus = document.createElement('a');
        plus.className = 'manageItem addCustomItem';
        plus.id = 'addCustomItemBtn';
        plus.href = 'javascript:;';
        plus.innerHTML = `
        <div class="SvgIcon duotone">
            <svg width="24" height="24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"/>
            </svg>
        </div>
        <span>Добавить свой пункт</span>`;
        plus.style.display = 'none';
        cont.parentElement.insertBefore(plus, cont.nextSibling);
        plus.addEventListener('click', showAddDialog);
    }

    function toggleEditMode() {
        const cont = qs('.manageItems');
        const isEdit = cont.classList.toggle('editMode');
        isEdit ? enterEditMode(cont) : exitEditMode(cont);
    }

    function enterEditMode(container) {
        qsa('.manageItem', container).forEach(a => {
            if (a.dataset.custom) return;
            const close = document.createElement('span');
            close.innerHTML = '×';
            close.className = 'itemCloser';
            close.onclick = e => { e.preventDefault(); removeItem(a.href); };
            a.style.position = 'relative';
            a.appendChild(close);
        });
        qsa('.manageItem[data-custom]', container).forEach(a => {
            const close = document.createElement('span');
            close.innerHTML = '×';
            close.className = 'itemCloser';
            close.onclick = e => { e.preventDefault(); removeCustomItem(a.href); };
            a.appendChild(close);
        });
        qs('#addCustomItemBtn').style.display = 'flex';
    }

    function exitEditMode(container) {
        qsa('.itemCloser').forEach(x => x.remove());
        qs('#addCustomItemBtn').style.display = 'none';
    }

    function rebuildAndRestoreEdit() {
        rebuildContainer();
        const cont = qs('.manageItems');
        if (cont && cont.classList.contains('editMode')) {
            cont.classList.remove('editMode');
            cont.classList.add('editMode');
            enterEditMode(cont);
        }
    }

    function removeItem(href) {
        const key = normalizeHref(href);
        const data = loadData();
        if (!data.hidden.includes(key)) data.hidden.push(key);
        saveData(data);
        rebuildAndRestoreEdit();
    }

    function removeCustomItem(href) {
        const key = normalizeHref(href);
        const data = loadData();
        data.custom = data.custom.filter(c => c.href !== key);
        saveData(data);
        rebuildAndRestoreEdit();
    }

    function showAddDialog() {
        if (qs('#customItemOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'customItemOverlay';
        overlay.className = 'xenOverlay formOverlay';
        overlay.style.display = 'block';

        const form = document.createElement('form');
        form.className = 'xenForm';
        form.id = 'customItemForm';

        const fieldset = document.createElement('fieldset');

        function createInputRow(labelText, id, type = 'text', placeholder = '') {
            const dl = document.createElement('dl');
            dl.className = 'ctrlUnit';

            const dt = document.createElement('dt');
            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.textContent = labelText;
            dt.appendChild(label);

            const dd = document.createElement('dd');
            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.className = 'textCtrl OptOut';
            input.placeholder = placeholder;
            dd.appendChild(input);

            dl.appendChild(dt);
            dl.appendChild(dd);
            return dl;
        }

        fieldset.appendChild(createInputRow('Адрес:', 'ctrl_custom_url', 'text', 'forums/585/'));
        fieldset.appendChild(createInputRow('Название:', 'ctrl_custom_text', 'text', 'Мой пункт'));
        fieldset.appendChild(createInputRow('SVG-иконка:', 'ctrl_custom_icon', 'text', 'M4 6h16M4 12h16M4 18h16'));

        form.appendChild(fieldset);

        const footer = document.createElement('div');
        footer.className = 'sectionFooter';

        const saveBtn = document.createElement('input');
        saveBtn.type = 'submit';
        saveBtn.value = 'Сохранить';
        saveBtn.className = 'button primary';

        const cancelBtn = document.createElement('input');
        cancelBtn.type = 'button';
        cancelBtn.value = 'Отмена';
        cancelBtn.className = 'button';
        cancelBtn.id = 'cancelCustomItem';

        footer.appendChild(saveBtn);
        footer.appendChild(cancelBtn);

        form.appendChild(footer);
        overlay.appendChild(form);
        document.body.appendChild(overlay);

        function closeOverlay() { overlay.remove(); }
        cancelBtn.onclick = closeOverlay;

        form.onsubmit = e => {
            e.preventDefault();
            const url = qs('#ctrl_custom_url').value.trim();
            const text = qs('#ctrl_custom_text').value.trim();
            const icon = qs('#ctrl_custom_icon').value.trim();
            if (!url || !text) return alert('Заполни адрес и название!');

            const absHref = normalizeHref(
                url.startsWith('http') ? url : location.origin + '/' + url.replace(/^\/+/, '')
            );

            const data = loadData();
            const exist = data.custom.findIndex(c => c.href === absHref);
            if (exist !== -1) {
                data.custom[exist].text = text;
                data.custom[exist].icon = icon;
            } else {
                data.custom.push({ href: absHref, text, icon });
            }
            saveData(data);
            rebuildAndRestoreEdit();
            closeOverlay();
        };
    }

    function init() {
        if (!qs('.manageItems')) return;
        rebuildContainer();
        createEditTrigger();
    }

    new MutationObserver((_, ob) => {
        if (qs('.manageItems')) { init(); ob.disconnect(); }
    }).observe(document, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.textContent = `
    .manageItems.editMode .manageItem{position:relative}
    .itemCloser{position:absolute;top:2px;right:6px;font-size:18px;color:#e00;cursor:pointer;line-height:1}
    #addCustomItemBtn.manageItem{display:none;align-items:center;padding:8px 12px;gap:12px;
        height:52px;box-sizing:border-box;border-radius:8px;
        background-color:#2d2d2d;color:#aaa;text-decoration:none;
        transition:background-color .2s,color .2s}
    #addCustomItemBtn.manageItem:hover{background-color:#303030;text-decoration:none}
    #addCustomItemBtn.manageItem:hover span{color:#37D38D}
    #addCustomItemBtn.manageItem .SvgIcon svg{fill:#888;transition:fill .2s}
    #addCustomItemBtn.manageItem:hover .SvgIcon svg{fill:#37D38D}

    #customItemOverlay {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        background: #2d2d2d;
        color: #ccc;
        padding: 20px;
        border-radius: 8px;
        z-index: 9999;
        min-width: 460px;
        box-shadow: 0 0 15px rgba(0,0,0,.6);
    }
    #customItemOverlay fieldset { border: none; margin: 0; padding: 0; }
    #customItemOverlay .ctrlUnit { display: flex; align-items: center; margin-bottom: 12px; }
    #customItemOverlay .ctrlUnit dt { width: 120px; margin: 0; font-weight: 500; color: #aaa; }
    #customItemOverlay .ctrlUnit dd { flex: 1; margin: 0; }
    #customItemOverlay .textCtrl {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #444;
        border-radius: 4px;
        background: #1f1f1f;
        color: #ddd;
    }
    #customItemOverlay .textCtrl:focus { border-color: #37D38D; outline: none; }
    #customItemOverlay .sectionFooter { margin-top: 15px; text-align: right; }
    #customItemOverlay .button { margin-left: 8px; }
`;
    document.head.appendChild(style);
})();

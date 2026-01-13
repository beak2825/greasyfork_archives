// ==UserScript==
// @name         Таблички для Лолзтим
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Генератор таблиц
// @author       Forest
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562291/%D0%A2%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%BB%D0%B7%D1%82%D0%B8%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/562291/%D0%A2%D0%B0%D0%B1%D0%BB%D0%B8%D1%87%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%9B%D0%BE%D0%BB%D0%B7%D1%82%D0%B8%D0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const win = window.unsafeWindow || window;

    const LIMITS = {
        HEADER_LEN: 500,
        CELL_LEN: 1500,
        MAX_ROWS: 20,
        MAX_COLS: 10
    };

    const style = document.createElement('style');
    style.textContent = `
        .lzt-table-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: 20000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); opacity: 0; animation: lztFadeIn 0.2s forwards; }
        @keyframes lztFadeIn { to { opacity: 1; } }
        .lzt-table-modal { background: #222; width: 900px; max-width: 95%; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.9); border: 1px solid #333; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; max-height: 90vh; }
        .lzt-tm-header { padding: 15px 20px; border-bottom: 1px solid #333; background: #1a1a1a; font-weight: 600; color: #eee; font-size: 16px; display: flex; justify-content: space-between; }
        .lzt-tm-body { padding: 20px; overflow-y: auto; flex: 1; background: #2b2b2b; }
        .lzt-settings-grid { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 15px; margin-bottom: 20px; }
        .lzt-tm-label { display: block; margin-bottom: 5px; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; }
        .lzt-tm-input, .lzt-tm-select { width: 100%; box-sizing: border-box; background: #181818; border: 1px solid #444; color: white; padding: 8px 12px; border-radius: 4px; font-size: 14px; outline: none; }
        .lzt-tm-input:focus, .lzt-tm-select:focus { border-color: #228e5d; }
        .lzt-preview-area { background: #181818; padding: 30px; border-radius: 4px; border: 1px dashed #444; overflow-x: auto; display: flex; justify-content: center; align-items: flex-start; min-height: 150px; }
        .lzt-visual-table { border-collapse: collapse; min-width: 300px; font-variant-numeric: tabular-nums; }
        .lzt-visual-table th, .lzt-visual-table td { padding: 10px 15px; min-width: 80px; max-width: 300px; outline: none; font-size: 14px; word-wrap: break-word; vertical-align: top; }
        .lzt-visual-table th { font-weight: bold; text-align: center; }
        .lzt-theme-dark { background: #2d2d2d; color: #e0e0e0; }
        .lzt-theme-dark th, .lzt-theme-dark td { border: 1px solid #444; }
        .lzt-theme-dark th { background: #222; color: #fff; border-bottom: 2px solid #228e5d; }
        .lzt-theme-dark .lzt-editable:focus { background: #3a3a3a; box-shadow: inset 0 0 0 1px #228e5d; }
        .lzt-theme-light { background: #fff; color: #000; }
        .lzt-theme-light th, .lzt-theme-light td { border: 1px solid #999; }
        .lzt-theme-light th { background: #f3f3f3; border-bottom: 2px solid #999; }
        .lzt-theme-light .lzt-editable:focus { background: #e8f0fe; }
        .lzt-theme-minimal { background: #fff; color: #333; }
        .lzt-theme-minimal th, .lzt-theme-minimal td { border-bottom: 1px solid #ddd; border-top: none; border-left: none; border-right: none; }
        .lzt-theme-minimal th { border-bottom: 2px solid #333; color: #000; }
        .lzt-theme-minimal .lzt-editable:focus { background: #f9f9f9; }
        .lzt-limit-error { background: rgba(255, 0, 0, 0.2) !important; transition: background 0.3s; }
        .lzt-tm-footer { padding: 15px 20px; border-top: 1px solid #333; background: #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
        .lzt-status-container { display: flex; flex-direction: column; gap: 4px; }
        .lzt-status-main { color: #888; font-size: 13px; }
        .lzt-status-sub { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; }
        .lzt-btn { padding: 10px 20px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .lzt-btn-cancel { background: transparent; color: #888; }
        .lzt-btn-cancel:hover { color: #fff; }
        .lzt-btn-primary { background: #228e5d; color: #fff; }
        .lzt-btn-primary:hover { background: #1e7e52; transform: translateY(-1px); }
        .lzt-btn-regen { background: #333; color: #ccc; margin-right: 10px; border: 1px solid #444; }
        .lzt-btn-regen:hover { background: #444; color: #fff; }
        .lzt-menu-icon { width: 20px; text-align: center; display: inline-block; margin-right: 5px; color: #aaa; }
        .lzt-toast { position: fixed; bottom: 30px; right: 30px; background: #228e5d; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.5); z-index: 21000; font-family: 'Segoe UI', sans-serif; font-weight: 600; display: flex; align-items: center; gap: 10px; transform: translateY(100px); opacity: 0; transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .lzt-toast.error { background: #e04f4f; }
        .lzt-toast.show { transform: translateY(0); opacity: 1; }
    `;
    document.head.appendChild(style);

    function showToast(text, isError = false) {
        const toast = document.createElement('div');
        toast.className = `lzt-toast ${isError ? 'error' : ''}`;
        toast.innerHTML = `<i class="fa ${isError ? 'fa-times-circle' : 'fa-check-circle'}"></i> ${text}`;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function renderVisualTable(rows, cols, theme) {
        let html = `<table class="lzt-visual-table lzt-theme-${theme}" id="lzt-render-target"><thead><tr>`;
        for(let c=0; c<cols; c++) html += `<th contenteditable="true" class="lzt-editable" data-type="header">Заголовок ${c+1}</th>`;
        html += `</tr></thead><tbody>`;
        for(let r=0; r<rows; r++) {
            html += `<tr>`;
            for(let c=0; c<cols; c++) html += `<td contenteditable="true" class="lzt-editable" data-type="cell">Текст</td>`;
            html += `</tr>`;
        }
        html += `</tbody></table>`;
        return html;
    }

    function sanitizeInput(node) {
        if (node.nodeType === 1) {
            if (node.tagName === 'BR') return;
            const text = document.createTextNode(node.innerText);
            node.replaceWith(text);
        }
    }

    function attachHandlers() {
        const container = document.getElementById('lzt-render-target');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (['IMG', 'VIDEO', 'DIV', 'SPAN', 'TABLE'].includes(node.nodeName)) {
                        sanitizeInput(node);
                    }
                });
            });
        });

        observer.observe(container, { childList: true, subtree: true });

        const cells = document.querySelectorAll('.lzt-editable');
        cells.forEach(cell => {
            cell.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); });
            cell.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); });

            cell.addEventListener('paste', function(e) {
                e.preventDefault();
                const limit = this.dataset.type === 'header' ? LIMITS.HEADER_LEN : LIMITS.CELL_LEN;
                const pasteData = (e.clipboardData || window.clipboardData).getData('text/plain');

                if ((this.innerText.length + pasteData.length) > limit) {
                    this.classList.add('lzt-limit-error');
                    setTimeout(() => this.classList.remove('lzt-limit-error'), 500);
                    showToast('Слишком много текста!', true);
                    return;
                }
                document.execCommand('insertText', false, pasteData);
            });

            cell.addEventListener('input', function() {
                const limit = this.dataset.type === 'header' ? LIMITS.HEADER_LEN : LIMITS.CELL_LEN;
                if (this.innerText.length > limit) {
                    this.innerText = this.innerText.substring(0, limit);
                    this.classList.add('lzt-limit-error');
                    setTimeout(() => this.classList.remove('lzt-limit-error'), 300);

                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(this);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
        });
    }

    async function copyTableAsImage(closeCallback) {
        const tableElement = document.getElementById('lzt-render-target');
        const statusEl = document.getElementById('lzt-status-text');

        statusEl.textContent = '📸 Рендеринг...';
        statusEl.style.color = '#ebdb34';

        try {
            const canvas = await window.html2canvas(tableElement, { backgroundColor: null, scale: 2 });
            canvas.toBlob(async (blob) => {
                try {
                    const item = new ClipboardItem({ 'image/png': blob });
                    await navigator.clipboard.write([item]);
                    showToast('Скопировано! Жми Ctrl+V');
                    setTimeout(closeCallback, 300);
                } catch (err) {
                    statusEl.textContent = '❌ Ошибка';
                    statusEl.style.color = 'red';
                    showToast('Нет доступа к буферу!', true);
                }
            });
        } catch (e) {
            statusEl.textContent = '❌ Ошибка рендера';
            showToast('Ошибка html2canvas', true);
        }
    }

    function showModal() {
        if (document.querySelector('.lzt-table-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'lzt-table-modal-overlay';

        overlay.innerHTML = `
            <div class="lzt-table-modal">
                <div class="lzt-tm-header"><span>📊 Конструктор таблиц</span><button class="lzt-btn-cancel" id="lzt-close-x" style="padding:0; font-size:20px;">×</button></div>
                <div class="lzt-tm-body">
                    <div class="lzt-settings-grid">
                        <div><label class="lzt-tm-label">Строк</label><input type="number" id="lzt-rows" class="lzt-tm-input" value="3" min="1" max="${LIMITS.MAX_ROWS}"></div>
                        <div><label class="lzt-tm-label">Столбцов</label><input type="number" id="lzt-cols" class="lzt-tm-input" value="3" min="1" max="${LIMITS.MAX_COLS}"></div>
                        <div>
                            <label class="lzt-tm-label">Стиль (Тема)</label>
                            <select id="lzt-theme" class="lzt-tm-select">
                                <option value="dark" selected>Lolz Dark (Темная)</option>
                                <option value="light">Excel (Светлая)</option>
                                <option value="minimal">Minimalist (Чистая)</option>
                            </select>
                        </div>
                    </div>
                    <label class="lzt-tm-label">Предпросмотр (Редактируй здесь)</label>
                    <div class="lzt-preview-area" id="lzt-preview-container"></div>
                </div>
                <div class="lzt-tm-footer">
                    <div class="lzt-status-container">
                        <div id="lzt-status-text" class="lzt-status-main">Лимит: Заголовки ${LIMITS.HEADER_LEN}, Ячейки ${LIMITS.CELL_LEN}</div>
                        <div class="lzt-status-sub">Максимум: ${LIMITS.MAX_ROWS} строк, ${LIMITS.MAX_COLS} столбцов</div>
                    </div>
                    <div>
                        <button class="lzt-btn lzt-btn-regen" id="lzt-update">Пересоздать</button>
                        <button class="lzt-btn lzt-btn-primary" id="lzt-copy"><i class="fa fa-camera"></i> Скопировать</button>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(overlay);
        const previewContainer = document.getElementById('lzt-preview-container');
        const rowInput = document.getElementById('lzt-rows');
        const colInput = document.getElementById('lzt-cols');
        const themeInput = document.getElementById('lzt-theme');
        const close = () => overlay.remove();

        const clampValues = () => {
            if (rowInput.value > LIMITS.MAX_ROWS) rowInput.value = LIMITS.MAX_ROWS;
            if (colInput.value > LIMITS.MAX_COLS) colInput.value = LIMITS.MAX_COLS;
            if (rowInput.value < 1) rowInput.value = 1;
            if (colInput.value < 1) colInput.value = 1;
        };

        rowInput.onchange = clampValues;
        colInput.onchange = clampValues;

        const updateGrid = () => {
            clampValues();
            const r = parseInt(rowInput.value) || 3;
            const c = parseInt(colInput.value) || 3;
            const t = themeInput.value;
            previewContainer.innerHTML = renderVisualTable(r, c, t);
            attachHandlers();
        };
        updateGrid();

        document.getElementById('lzt-close-x').onclick = close;
        overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });

        document.getElementById('lzt-update').onclick = updateGrid;
        themeInput.onchange = () => {
            const table = document.getElementById('lzt-render-target');
            if(table) table.className = `lzt-visual-table lzt-theme-${themeInput.value}`;
            else updateGrid();
        };

        document.getElementById('lzt-copy').onclick = () => copyTableAsImage(close);
    }

    function injectMenuItem(list) {
        if (list.querySelector('.lzt-table-li')) return;
        const isInsertMenu = list.querySelector('[data-cmd="xfQuote"]') || list.querySelector('[data-cmd="xfSpoiler"]') || list.querySelector('[data-cmd="xfCode"]');
        if (!isInsertMenu) return;

        const li = document.createElement('li');
        li.className = 'lzt-table-li';
        li.setAttribute('role', 'presentation');
        const a = document.createElement('a');
        a.className = 'fr-command';
        a.setAttribute('tabindex', '-1');
        a.setAttribute('role', 'option');
        a.title = 'Вставить таблицу';
        a.innerHTML = `<span class="lzt-menu-icon"><i class="fa fa-table" aria-hidden="true"></i></span> Таблица`;

        a.addEventListener('mousedown', (e) => {
            e.preventDefault(); e.stopPropagation();
            showModal();
        });
        li.appendChild(a);
        const userItem = list.querySelector('[data-cmd="lztVisitor"]');
        if (userItem) { userItem.parentElement.before(li); } else { list.appendChild(li); }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.classList.contains('fr-dropdown-list')) injectMenuItem(node);
                else if (node.querySelectorAll) {
                    const lists = node.querySelectorAll('.fr-dropdown-list');
                    lists.forEach(list => injectMenuItem(list));
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
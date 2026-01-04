// ==UserScript==
// @name         Platesmania Upload Enhancements and fixes
// @namespace    https://platesmania.com/
// @version      1.1
// @description  Country-specific upload enhancements + global tweaks for platesmania.com/*/add*
// @match        https://platesmania.com/*/add*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace    https://greasyfork.org/users/976031
// @downloadURL https://update.greasyfork.org/scripts/555559/Platesmania%20Upload%20Enhancements%20and%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/555559/Platesmania%20Upload%20Enhancements%20and%20fixes.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const onReady = (fn) => { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true }); else fn(); };
    const countryFromPath = () => { const p = location.pathname.split('/').filter(Boolean); return p[0] || ''; };
    const ensureOption = (select, value, text, beforeValue = null) => {
        if (!select) return;
        if ([...select.options].some(o => o.value === value)) return;
        const opt = document.createElement('option'); opt.value = value; opt.textContent = text;
        if (beforeValue) { const before = [...select.options].find(o => o.value === beforeValue); if (before && before.parentElement === select) { select.insertBefore(opt, before); return; } }
        select.appendChild(opt);
    };
    const renameOption = (select, value, newText) => { if (!select) return; const opt = [...select.options].find(o => o.value === value); if (opt) opt.textContent = newText; };

    GM_addStyle(`
    .pm-btn{cursor:pointer;border:1px solid #999;background:#f7f7f7;padding:6px 10px;border-radius:4px;font-size:12px}
    .pm-btn:hover{background:#eee}
    .pm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9999;display:flex;align-items:center;justify-content:center}
    .pm-panel{background:#fff;color:#222;width:min(900px,96vw);max-height:85vh;overflow:auto;border-radius:8px;box-shadow:0 10px 35px rgba(0,0,0,.35);padding:16px 18px}
    .pm-panel h3{margin:0 0 8px;font-size:18px}
    .pm-panel .pm-close{float:right;cursor:pointer;border:none;background:transparent;font-size:18px;line-height:1}
    .pm-panel pre{white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:#fafafa;padding:10px;border-radius:6px;border:1px solid #eee}
    .pm-eurobands-grid{display:flex;flex-wrap:nowrap;gap:8px;align-items:flex-start;transform-origin:left top}
    .pm-eurobands-item{display:flex;flex-direction:column;align-items:center;border:1px solid #ddd;border-radius:6px;padding:6px;background:#fff;flex:0 0 auto}
    .pm-eurobands-item input[type="radio"]{margin-top:6px;transform:scale(1.15)}
    .pm-crop{width:25px;overflow:hidden}
    .pm-eurobands-item img{display:block;height:auto;max-width:none}
    .pm-hidden{display:none!important}
    .pm-force-open{display:block!important;height:auto!important;overflow:visible!important;visibility:visible!important}
    #pm-tagcloud-wrapper{margin-top:14px}
    #pm-tagcloud-wrapper .inline-group label{margin-right:10px;margin-bottom:8px}
    .pm-help-link{margin-left:6px;font-size:12px;text-decoration:underline;cursor:pointer}

    /* Figures in BK help */
    .pm-figures{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px}
    .pm-figure{flex:1 1 260px;max-width:100%}
    .pm-figure img{display:block;max-width:200px;height:auto;border:1px solid #eee;border-radius:6px}
    .pm-figure figcaption{text-align:center;font-size:12px;color:#555;margin-top:6px}

    /* Floating Upload Button */
    .pm-floating-upload {
      position: fixed;
      left: 20px;
      right: 20px;
      bottom: 20px;
      height: 60px;
      line-height: 40px;
      z-index: 10000;
      border: none;
      border-radius: 6px;
      box-shadow: 0 6px 18px rgba(0,0,0,.2);
      font-size: 32px;
      font-weight: 600;
      text-transform: none;
      cursor: pointer;
    }
  `);

    function handleGlobal() {
        const TAG_ALWAYS_KEY = 'pm_always_expand_tagcloud';
        const TAG_MOVE_KEY = 'pm_expand_tagcloud_below';
        const MAX_KEY = 'pm_remove_filesize_limit';
        const FLOAT_KEY = 'pm_floating_upload_button';
        const MAX_BYTES = 500 * 1024 * 1024;
        const controlsRoot = $(`.col-sm-6.col-xs-12[style*="padding-left:30px"]`);
        const form = $('#frm');

        const addCheckbox = (id, labelText, storedKey, onToggle, withHelp = null) => {
            if (!controlsRoot) return null;
            const wrap = document.createElement('label');
            wrap.className = 'checkbox';
            wrap.style.display = 'block';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = id;
            input.checked = !!GM_getValue(storedKey, false);
            const i = document.createElement('i');
            const text = document.createTextNode(' ' + labelText);
            wrap.appendChild(input);
            wrap.appendChild(i);
            wrap.appendChild(text);
            if (withHelp) {
                const a = document.createElement('a');
                a.href = 'javascript:void(0)';
                a.className = 'pm-help-link';
                a.textContent = '(?)';
                a.addEventListener('click', () => {
                    const overlay = document.createElement('div');
                    overlay.className = 'pm-overlay';
                    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
                    const panel = document.createElement('div');
                    panel.className = 'pm-panel';
                    const close = document.createElement('button');
                    close.className = 'pm-close';
                    close.setAttribute('aria-label', 'Close');
                    close.innerHTML = '&times;';
                    close.addEventListener('click', () => overlay.remove());
                    const title = document.createElement('h3');
                    title.textContent = withHelp.title || 'Info';
                    const content = document.createElement('pre');
                    content.textContent = withHelp.text || '';
                    panel.appendChild(close); panel.appendChild(title); panel.appendChild(content);
                    overlay.appendChild(panel); document.body.appendChild(overlay);
                });
                wrap.appendChild(a);
            }
            controlsRoot.appendChild(wrap);
            input.addEventListener('change', () => {
                GM_setValue(storedKey, input.checked);
                onToggle(input.checked);
            });
            onToggle(input.checked);
            return input;
        };

        const accordion = $('#accordion-1');
        const collapse = accordion ? $('#collapse-One', accordion) : null;
        const collapseBody = collapse ? $('.panel-body', collapse) : null;
        let accordionPlaceholder = null;
        let tagcloudWrapper = null;

        const ensureTagCollapsedState = (expanded) => {
            if (!collapse) return;
            if (expanded) {
                collapse.classList.add('in', 'show');
                collapse.style.height = 'auto';
                collapse.style.display = 'block';
                collapse.setAttribute('aria-expanded', 'true');
            }
        };

        const moveTagCloud = (moveDown) => {
            if (!form || !accordion || !collapse || !collapseBody) return;
            const existingWrapper = $('#pm-tagcloud-wrapper');
            if (moveDown) {
                if (existingWrapper) return;
                accordionPlaceholder = document.createElement('div');
                accordion.parentElement.insertBefore(accordionPlaceholder, accordion);
                const wrapper = document.createElement('section');
                wrapper.id = 'pm-tagcloud-wrapper';
                wrapper.appendChild(collapseBody);
                tagcloudWrapper = wrapper;
                accordion.remove();
                form.appendChild(wrapper);
            } else {
                if (!existingWrapper || !accordionPlaceholder) return;
                collapse.appendChild(collapseBody);
                accordionPlaceholder.replaceWith(accordion);
                accordionPlaceholder = null;
                existingWrapper.remove();
                tagcloudWrapper = null;
            }
        };

        const applyMaxFileSize = (enabled) => {
            const hiddenMax = $('input[type="hidden"][name="MAX_FILE_SIZE"]');
            const fileInput = $('#filename');
            const section = fileInput ? fileInput.closest('section') : null;
            const label = section ? $('label', section) : null;
            if (enabled) {
                if (hiddenMax) hiddenMax.value = String(MAX_BYTES);
                if (label) label.textContent = 'Photo (file size not exceeding ∞Mb!):';
            }
        };

        // --- Floating upload button logic ---
        let originalUploadSection = null;
        let originalUploadButton = null;

        const locateOriginalUpload = () => {
            if (originalUploadButton && originalUploadSection) return;
            // Prefer the upload button inside the form
            originalUploadButton = form ? $('button.btn-u[type="submit"]', form) : null;
            if (!originalUploadButton) originalUploadButton = $('button.btn-u[type="submit"]'); // fallback
            if (originalUploadButton) originalUploadSection = originalUploadButton.closest('section');
        };

        const createFloatingButton = () => {
            if ($('#pmFloatingUploadBtn')) return;
            const btn = document.createElement('button');
            btn.id = 'pmFloatingUploadBtn';
            btn.type = 'button';
            btn.className = 'pm-floating-upload btn-u'; // keep site styling + our layout
            btn.textContent = 'Upload';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Prefer native form submission for validations
                if (form) {
                    // trigger the form's submit in a way consistent with a real button
                    const hiddenSubmit = document.createElement('input');
                    hiddenSubmit.type = 'submit';
                    hiddenSubmit.style.display = 'none';
                    form.appendChild(hiddenSubmit);
                    hiddenSubmit.click();
                    hiddenSubmit.remove();
                }
            });
            document.body.appendChild(btn);
        };

        const removeFloatingButton = () => {
            const btn = $('#pmFloatingUploadBtn');
            if (btn) btn.remove();
        };

        const setOriginalVisible = (visible) => {
            locateOriginalUpload();
            if (!originalUploadSection && !originalUploadButton) return;
            const el = originalUploadSection || originalUploadButton;
            if (el) el.style.display = visible ? '' : 'none';
        };

        const applyFloatingUpload = (enabled) => {
            if (enabled) {
                createFloatingButton();
                setOriginalVisible(false);
            } else {
                removeFloatingButton();
                setOriginalVisible(true);
            }
        };
        // --- end floating upload button logic ---

        const alwaysExpandInput = addCheckbox(
            'pmExpandTagCloudAlways',
            'Always expand tag cloud',
            TAG_ALWAYS_KEY,
            (enabled) => {
                ensureTagCollapsedState(enabled);
                const moveEnabled = !!GM_getValue(TAG_MOVE_KEY, false);
                const secondary = $('#pmExpandTagCloudMove')?.closest('label');
                if (secondary) secondary.style.display = enabled ? 'block' : 'none';
                if (!enabled) moveTagCloud(false);
                else moveTagCloud(moveEnabled);
            }
        );

        const moveBelowInput = addCheckbox(
            'pmExpandTagCloudMove',
            'Expanded tag cloud below Upload button',
            TAG_MOVE_KEY,
            (enabled) => {
                if (!GM_getValue(TAG_ALWAYS_KEY, false)) return;
                moveTagCloud(enabled);
            }
        );
        if (moveBelowInput) moveBelowInput.closest('label').style.display = GM_getValue(TAG_ALWAYS_KEY, false) ? 'block' : 'none';

        addCheckbox(
            'pmRemoveFilesizeLimit',
            'Remove file size limitation',
            MAX_KEY,
            applyMaxFileSize,
            {
                title: 'Remove file size limitation',
                text: 'Experimental & on your own responsibility. Only lifts the file size limit, not resolution limits'
            }
        );

        // Add new checkbox for floating upload button
        addCheckbox(
            'pmFloatingUploadCheckbox',
            'Floating upload button',
            FLOAT_KEY,
            applyFloatingUpload
        );
    }

    function handleDE() {
        const region = $('#region');
        if (!region) return;
        ensureOption(region, 'L1', 'L (Lahn-Dill, former)');
        ensureOption(region, 'BK1', 'BK (Backnang)');
        ensureOption(region, 'HZ1', 'HZ (Herzberg, former)');
        renameOption(region, 'L', 'L (Leipzig)');
        renameOption(region, 'BK', 'BK (Börde)');
        renameOption(region, 'HZ', 'HZ (Harz)');
        [...region.options].sort((a, b) => a.text.localeCompare(b.text)).forEach(opt => region.appendChild(opt));
        let btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'pm-btn'; btn.textContent = '(?) BK Help';
        btn.style.marginRight = '8px'; btn.style.display = 'none';
        region.parentElement?.insertBefore(btn, region);
        const toggleBtn = () => {
            btn.style.display = (region.value === 'BK' || region.value === 'BK1') ? '' : 'none';
        };
        region.addEventListener('change', toggleBtn); toggleBtn();
        btn.addEventListener('click', () => {
            const overlay = document.createElement('div'); overlay.className = 'pm-overlay';
            overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
            const panel = document.createElement('div'); panel.className = 'pm-panel';
            const close = document.createElement('button'); close.className = 'pm-close'; close.setAttribute('aria-label', 'Close'); close.innerHTML = '&times;';
            close.addEventListener('click', () => overlay.remove());
            const title = document.createElement('h3'); title.textContent = 'BK: Which one to choose?';
            const content = document.createElement('pre');
            content.textContent =
`Bördekreis:
One letter, one numeral -> Only combinations using B,F,G,I,O and Q.
One letter, two numerals -> Only combinations using B,F,G,I,O and Q.
One letter three numerals -> Only combinations using B,F,G,I,O and Q.
One letter, four numerals -> Not available since October 2013.
Two letters, one numeral -> Only combinations using B,F,G,I,O and Q.
Two letters, two numerals -> Only combinations using B,F,G,I,O and Q.
Two letters, three numerals -> All combinations possible.
Two letters, four numerals -> All combinations possible except (BK-NA1000 - BK-SZ9999).

Rems-Murr-Kreis (Backnang):
One letter, one numeral -> Only used on special request but without B,F,G,I,O and Q.
One letter, two numerals -> (BK-N 10 - BK-Z 99) without B,F,G,I,O and Q.
One letter three numerals -> (BK-A 100 - BK-Z 999) without B,F,G,I,O and Q.
One letter, four numerals -> All combinations possible.
Two letters, one numeral -> (BK-AA 1 - BK-PZ 9) without B,F,G,I,O and Q.
Two letters, two numerals -> (BK-AA 10 - BK-PZ 99) without B,F,G,I,O and Q.
Two letters, three numerals -> Not available.
Two letters, four numerals -> (BK-NA1000 - BK-SZ9999)`;
            // Figures wrapper + figures
            const figures = document.createElement('div');
            figures.className = 'pm-figures';
            const makeFigure = (src, caption) => {
                const fig = document.createElement('figure');
                fig.className = 'pm-figure';
                const img = new Image();
                img.src = src;
                img.alt = caption;
                fig.appendChild(img);
                const cap = document.createElement('figcaption');
                cap.textContent = caption;
                fig.appendChild(cap);
                return fig;
            };
            figures.appendChild(makeFigure('https://i.imgur.com/6i8Ur2j.png', 'Backnang'));
            figures.appendChild(makeFigure('https://i.imgur.com/MrV9l8Z.png', 'Börde'));

            panel.appendChild(close);
            panel.appendChild(title);
            panel.appendChild(content);
            panel.appendChild(figures);

            overlay.appendChild(panel); document.body.appendChild(overlay);
        });
    }

    function handleDK() {
        const sel = $('#fon');
        if (!sel) return;
        ensureOption(sel, '101', 'Single-row plate with euroband / Repeater plates');
        ensureOption(sel, '102', 'Single-row plate without euroband / Repeater plates');
        ensureOption(sel, '103', 'Two-row plate with euroband / Repeater plates');
        ensureOption(sel, '104', 'Two-row plate without euroband / Repeater plates');
    }

    function handleUK() {
        const alwaysKey = 'pm_uk_always_expand_eurobands';
        const controlsRoot = $(`.col-sm-6.col-xs-12[style*="padding-left:30px"]`);
        if (controlsRoot) {
            let wrap = document.createElement('label'); wrap.className = 'checkbox'; wrap.style.display = 'block';
            const input = document.createElement('input'); input.type = 'checkbox'; input.id = 'pmAlwaysExpandEurobands'; input.checked = !!GM_getValue(alwaysKey, false);
            const i = document.createElement('i'); const text = document.createTextNode(' Always show Eurobands expanded (reload page after changing)');
            wrap.appendChild(input); wrap.appendChild(i); wrap.appendChild(text); controlsRoot.appendChild(wrap);
            input.addEventListener('change', () => { GM_setValue(alwaysKey, input.checked); alert('Setting saved. Reload the page to apply.'); });
        }
        const collapse = $('#collapse-Logo');
        const header = collapse ? collapse.previousElementSibling : null;
        const always = !!GM_getValue('pm_uk_always_expand_eurobands', false);
        if (collapse) {
            if (always) {
                collapse.classList.remove('collapse', 'collapsing');
                collapse.classList.add('pm-force-open');
                collapse.style.height = 'auto';
                collapse.style.display = 'block';
                collapse.setAttribute('aria-expanded', 'true');
                if (header) header.classList.add('pm-hidden');
            } else {
                if (!collapse.classList.contains('collapse')) collapse.classList.add('collapse');
                collapse.classList.remove('pm-force-open');
                if (header) header.classList.remove('pm-hidden');
            }
        }
        const logoTable = $('#logoTable');
        if (!logoTable) return;
        const pairs = [];
        $$('#logoTable tr').forEach(tr => {
            const tds = $$('td', tr);
            for (let i = 0; i < tds.length; i++) {
                const td = tds[i];
                const input = $('input[type="radio"]', td);
                const label = input ? document.getElementById('L' + input.value) : null;
                if (input && label) pairs.push({ input, label });
            }
        });
        if (pairs.length === 0) return;
        const grid = document.createElement('div');
        grid.className = 'pm-eurobands-grid';
        pairs.forEach(({ input, label }) => {
            const item = document.createElement('div');
            item.className = 'pm-eurobands-item';
            const img = $('img', label);
            let imgClone = null;
            if (img) { imgClone = img.cloneNode(true); imgClone.classList.remove('img-responsive'); }
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', input.id);
            const crop = document.createElement('div');
            crop.className = 'pm-crop';
            if (imgClone) crop.appendChild(imgClone);
            newLabel.appendChild(crop);
            item.appendChild(newLabel);
            item.appendChild(input);
            grid.appendChild(item);
            label.remove();
        });
        const tableWrapper = logoTable.parentElement;
        tableWrapper.innerHTML = '';
        tableWrapper.appendChild(grid);
        const fitRow = () => {
            const container = collapse || document.body;
            const available = container.clientWidth || window.innerWidth;
            const count = grid.children.length;
            const itemWidth = 25 + 12 + 2 + 2;
            const gap = 8;
            const total = count * itemWidth + (count - 1) * gap + 12;
            grid.style.transform = '';
            if (total > available && total > 0) {
                const scale = Math.max(0.5, Math.min(1, available / total));
                grid.style.transform = `scale(${scale})`;
            }
        };
        const ensureOneRow = () => {
            grid.style.flexWrap = 'nowrap';
            fitRow();
        };
        ensureOneRow();
        window.addEventListener('resize', fitRow);
    }

    onReady(() => {
        handleGlobal();
        const cc = countryFromPath().toLowerCase();
        if (cc === 'de') handleDE();
        if (cc === 'dk') handleDK();
        if (cc === 'uk') handleUK();
    });
})();

// ==UserScript==
// @name         Optimiseur du Chat de la Foret - V1.95 (Balise Code)
// @namespace    https://greasyfork.org/users/1555347
// @version      1.95
// @description  Ajout URL / IMG / CODE / Quote / @.
// @author       Jukop22
// @match        https://www.sharewood.tv/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561183/Optimiseur%20du%20Chat%20de%20la%20Foret%20-%20V195%20%28Balise%20Code%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561183/Optimiseur%20du%20Chat%20de%20la%20Foret%20-%20V195%20%28Balise%20Code%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = { INPUT: '#chat-message', EDITOR: '.wysibb-text-editor', TOOLBAR: '.wysibb-toolbar-container' };
    let savedRange = null;

    // --- Utilitaires ---
    const qs = (s, p = document) => p.querySelector(s);
    const ce = (t) => document.createElement(t);
    const kill = (e) => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };

    function isAllowed() {
        const p = window.location.pathname;
        return p === '/' || ['/index', '/home', '/shout'].some(s => p.includes(s));
    }

    function rgbToHex(c) {
        if (!c || c.startsWith('#')) return c || '#22b598';
        const ctx = ce("canvas").getContext("2d");
        ctx.fillStyle = c;
        return ctx.fillStyle;
    }

    function syncVue(text = null) {
        const input = qs(SELECTORS.INPUT);
        if (!input) return;
        if (text !== null) input.value = text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // --- Gestion Curseur & Insertion ---
    function saveSel() {
        const ed = qs(SELECTORS.EDITOR);
        const sel = window.getSelection();
        if (ed && sel.rangeCount > 0 && ed.contains(sel.anchorNode)) {
            savedRange = sel.getRangeAt(0).cloneRange();
        }
    }

    function insert(text, forceBreak = false) {
        const ed = qs(SELECTORS.EDITOR);
        if (ed && savedRange) {
            ed.focus();
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }

        const $txt = window.$ ? window.$(SELECTORS.INPUT) : null;
        if ($txt && $txt.data("wbb")) {
            const wbb = $txt.data("wbb");
            wbb.insertAtCursor(text);
            wbb.sync();
        } else {
            document.execCommand('insertText', false, text);
        }

        if (forceBreak && ed) {
            ed.focus();
            document.execCommand('insertHTML', false, '<br><br>\u200B');
        }
        syncVue();
    }

    // --- Interface Prompt ---
    function getPrompt() {
        let box = document.getElementById('sw-prompt');
        if (box) return box;

        box = ce('div');
        box.id = 'sw-prompt';
        box.style.cssText = "display:none;flex-direction:row;align-items:flex-start;gap:15px;padding:15px;background:#fff!important;border:2px solid #3498db;border-radius:6px;margin:5px 0;z-index:2147483647;width:100%;box-sizing:border-box;box-shadow:0 4px 15px rgba(0,0,0,.4);";

        // Ajout du textarea caché par défaut dans le HTML
        box.innerHTML = `
            <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
                <div id="sw-confirm" style="display:none;font-weight:bold;color:#e74c3c;font-size:14px;">⚠️ Voulez-vous tout effacer ?</div>
                <div id="sw-inputs">
                    <div id="sw-row-txt">
                        <label style="font-size:11px;font-weight:bold;color:#555;display:block;margin-bottom:2px;">Texte :</label>
                        <input type="text" id="sw-in-txt" style="width:100%;padding:5px;border:1px solid #ccc;border-radius:3px;color:#000;background:#fff!important;">
                    </div>
                    <div style="margin-top:5px;">
                        <label id="sw-lbl-url" style="font-size:11px;font-weight:bold;color:#555;display:block;margin-bottom:2px;">URL :</label>
                        <input type="text" id="sw-in-url" style="width:100%;padding:5px;border:1px solid #ccc;border-radius:3px;color:#000;background:#fff!important;">
                        <textarea id="sw-in-code" style="display:none;width:100%;height:100px;padding:5px;border:1px solid #ccc;border-radius:3px;color:#000;background:#fff!important;font-family:monospace;resize:vertical;box-sizing:border-box;"></textarea>
                    </div>
                </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;min-width:80px;">
                <button id="sw-ok" class="btn btn-xs btn-primary" style="padding:6px 10px;font-weight:bold;color:#fff!important;margin-bottom:0;">VALIDER</button>
                <button id="sw-close" class="btn btn-xs btn-default" style="font-weight:bold;">Annuler</button>
            </div>`;

        const tb = qs('.wysibb-toolbar');
        if (tb) tb.parentNode.insertBefore(box, tb.nextSibling);

        const close = () => {
            box.style.display = 'none';
            qs('#sw-in-url').value = qs('#sw-in-txt').value = qs('#sw-in-code').value = '';
            const em = qs('.emojionepicker-picker'); if(em) em.style.display = "block";
        };

        qs('#sw-close', box).onclick = (e) => { e.preventDefault(); close();
            const ed = qs(SELECTORS.EDITOR); if(ed && savedRange) { ed.focus(); window.getSelection().addRange(savedRange); }
        };

        qs('#sw-ok', box).onclick = (e) => {
            e.preventDefault();
            const mode = box.getAttribute('data-mode');

            if (mode === 'CLEAR') {
                const ed = qs(SELECTORS.EDITOR);
                if (ed) { ed.innerHTML = ""; const wbb = window.$(SELECTORS.INPUT).data("wbb"); if(wbb) wbb.sync(); }
                syncVue("");
            } else {
                const txt = qs('#sw-in-txt').value.trim();
                let mainInput = "";
                let bb = "";

                if (mode === 'CODE') {
                    // Pour le code, on récupère le contenu du textarea
                    mainInput = qs('#sw-in-code').value.trim();
                    if (mainInput) bb = `[code]${mainInput}[/code] `;
                } else {
                    // Pour IMG et URL, on récupère l'input text normal
                    mainInput = qs('#sw-in-url').value.trim();
                    if (mainInput) {
                        if (mode === 'IMG') bb = `[img]${mainInput}[/img] `;
                        else bb = txt ? `[url=${mainInput}][color=#6fa8dc][u][b]${txt}[/b][/u][/color][/url] ` : `[url=${mainInput}][color=#6fa8dc][u][b]${mainInput}[/b][/u][/color][/url] `;
                    }
                }
                if (bb) insert(bb);
            }
            close();
        };
        return box;
    }

    // --- Init Boutons Toolbar ---
    function initButtons() {
        if (!isAllowed() || qs('#sw-btn-url')) return;
        const toolbar = qs(SELECTORS.TOOLBAR);
        if (!toolbar) return;

        const tools = [
            { id: 'sw-btn-url', l: '🔗', m: 'URL', t: 'Lien' },
            { id: 'sw-btn-img', l: '🖼️', m: 'IMG', t: 'Image' },
            { id: 'sw-btn-code', l: '💻', m: 'CODE', t: 'Code' },
            { id: 'sw-btn-clear', l: '🗑️', m: 'CLEAR', t: 'Effacer' }
        ];

        tools.forEach(tool => {
            const btn = ce('div');
            btn.id = tool.id;
            btn.className = "wysibb-toolbar-btn";
            btn.style.cursor = "pointer";
            btn.innerHTML = `<span class="btn-inner" style="line-height:24px;font-size:16px;display:block;text-align:center;">${tool.l}</span><span class="btn-tooltip">${tool.t}<ins></ins></span>`;

            btn.onmousedown = (e) => { if (tool.m !== 'CLEAR') saveSel(); };
            btn.onclick = (e) => {
                kill(e);
                const box = getPrompt();
                if (!box) return;

                box.setAttribute('data-mode', tool.m);
                const isClear = tool.m === 'CLEAR';
                const isImg = tool.m === 'IMG';
                const isCode = tool.m === 'CODE';

                // Gestion affichage Confirmation vs Inputs
                qs('#sw-confirm').style.display = isClear ? 'block' : 'none';
                qs('#sw-inputs').style.display = isClear ? 'none' : 'block';
                // Gestion champ "Texte" (seulement pour URL)
                qs('#sw-row-txt').style.display = (isClear || isImg || isCode) ? 'none' : 'block';

                // Gestion switch Input simple vs Textarea pour le Code
                const inputUrl = qs('#sw-in-url');
                const inputCode = qs('#sw-in-code');
                const lbl = qs('#sw-lbl-url');

                if (isCode) {
                    inputUrl.style.display = 'none';
                    inputCode.style.display = 'block';
                    lbl.textContent = "Collez votre code ici :";
                } else {
                    inputUrl.style.display = 'block';
                    inputCode.style.display = 'none';
                    lbl.textContent = isImg ? "URL de l'image :" : "URL du lien :";
                }

                // Boutons
                const btnOk = qs('#sw-ok', box);
                btnOk.textContent = isClear ? "Oui, effacer !" : "VALIDER";
                btnOk.className = isClear ? "btn btn-xs btn-danger" : "btn btn-xs btn-primary";

                box.style.display = 'flex';
                const em = qs('.emojionepicker-picker'); if(em) em.style.display = "none";

                if (!isClear) {
                    setTimeout(() => {
                        if (isCode) inputCode.focus();
                        else if (isImg) inputUrl.focus();
                        else qs('#sw-in-txt').focus();
                    }, 50);
                }
            };
            toolbar.appendChild(btn);
        });
    }

    // --- Init Actions (@/Quote) ---
    function initActions() {
        if (!isAllowed()) return;
        document.querySelectorAll('.badge-user').forEach(badge => {
            if (qs('.sw-actions', badge)) return;
            const link = qs('a', badge);
            if (!link) return;

            const wrap = ce('span');
            wrap.className = 'sw-actions';
            wrap.style.cssText = "margin-left:8px;display:inline-flex;gap:5px;";

            const mkBtn = (icon, color, cb) => {
                const b = ce('span');
                b.innerHTML = `<i class='fal fa-${icon}'></i>`;
                b.style.cssText = `color:${color};cursor:pointer;font-size:14px;`;
                b.onmousedown = (e) => { kill(e); saveSel(); };
                b.onclick = (e) => { kill(e); cb(); };
                return b;
            };

            // Bouton @
            wrap.appendChild(mkBtn('at', '#2ECC40', () => {
                insert(`[color=${rgbToHex(getComputedStyle(link).color)}]@${link.innerText.trim()} [/color] `);
            }));

            // Bouton Quote
            wrap.appendChild(mkBtn('quote-right', '#4682B4', () => {
                const li = badge.closest('li');
                let msg = "";
                if (li) {
                    const d = qs('.align-left', li);
                    if(d) {
                        msg = d.innerText.trim();
                        msg = msg.replace(/^>>\s+.*?\s+:\s+"[\s\S]*?"\s*/, "");
                        msg = msg.replace(/^(@\S+\s*)+/, "").trim();
                    }
                }
                const col = rgbToHex(getComputedStyle(link).color);
                insert(`[size=16][color=${col}]>> [b]${link.innerText.trim()}[/b][/color][b] [/b]: "[i][color=#999999]${msg}[/color][/i]"[/size]`, true);
            }));

            badge.appendChild(wrap);
        });
    }

    // --- Surveillance ---
    const obs = new MutationObserver(() => {
        if (isAllowed() && qs('.wysibb-toolbar')) { initButtons(); initActions(); }
    });
    obs.observe(document.body, { childList: true, subtree: true });

})();
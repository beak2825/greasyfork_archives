// ==UserScript==
// @name         XL Widget Open
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Changing the parameters for opening XL-Widget
// @author       Nikitin
// @match        *://tngadmin.triplenext.net/Admin/CompareBag/EditBag/*
// @match        *://cdn.tangiblee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555206/XL%20Widget%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/555206/XL%20Widget%20Open.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CFG = {
        DEBUG: false,
        PARAMS: { availableGalleryWidget: '1' },
        XL_IFRAME_WIDTH: 1200,
        BASE_IFRAME_WIDTH: 480,
        BASE_IFRAME_HEIGHT: 610,
        DIALOG_SELECTOR: '.ui-dialog',
        CONTENT_ID: 'live-preview-dialog',
        INNER_FRAME_PATH: '/Admin/CompareBag/LiveViewPreviewNewUx',
        WIDGET_PATH: '/widget/index.html',
        CLICK_DEBOUNCE_MS: 350,
        POLL_MS: 900,
    };

    const TAG = '[XLW]';
    const log   = (...a) => { if (CFG.DEBUG) console.log(TAG, ...a); };
    const info  = (...a) => { if (CFG.DEBUG) console.info(TAG, ...a); };
    const warn  = (...a) => { if (CFG.DEBUG) console.warn(TAG, ...a); };
    const error = (...a) => console.error(TAG, ...a);

    // ========================================================================
    // STORAGE (SCOPE-BASED)
    // ========================================================================

    function computeScope() {
        const parts = location.pathname.split("/").filter(Boolean);
        if (parts.length >= 3 && parts[0].toLowerCase() === "admin" && parts[1].toLowerCase() === "comparebag") {
            return "/Admin/CompareBag/" + (parts[2] ? parts[2] : "EditBag");
        }
        return "/" + parts.slice(0, 3).join("/");
    }

    const SCOPE = computeScope();
    const storageKey = (suffix) => `XLW:${SCOPE}:${suffix}`;

    const LS_ENABLED_KEY  = storageKey('enabled');
    const LS_CATEGORY_KEY = storageKey('category');
    const GM_ENABLED_KEY  = 'xlw_enabled';
    const GM_CID_KEY      = 'xlw_cid';

    // Migration from old per-page keys
    (function migrateOldKeys() {
        const oldEnabledKey = `XLW:${location.pathname}:enabled`;
        const oldCategoryKey = `XLW:${location.pathname}:category`;
        try {
            const oldEn = localStorage.getItem(oldEnabledKey);
            const oldCat = localStorage.getItem(oldCategoryKey);
            if (oldEn !== null && localStorage.getItem(LS_ENABLED_KEY) === null) {
                localStorage.setItem(LS_ENABLED_KEY, oldEn);
                localStorage.removeItem(oldEnabledKey);
            }
            if (oldCat !== null && localStorage.getItem(LS_CATEGORY_KEY) === null) {
                localStorage.setItem(LS_CATEGORY_KEY, oldCat);
                localStorage.removeItem(oldCategoryKey);
            }
        } catch (e) { }
    })();

    function safeGetLS(k) { try { return localStorage.getItem(k); } catch { return null; } }

    function readEnabledFromLS() { return safeGetLS(LS_ENABLED_KEY) === 'true'; }

    function readCategoryFromLS() {
        const raw = safeGetLS(LS_CATEGORY_KEY);
        if (!raw) return null;
        try {
            const o = JSON.parse(raw);
            return (o && typeof o.id === 'string' && o.id.trim()) ? { id: o.id.trim(), name: String(o.name || '') } : null;
        } catch { return null; }
    }

    function saveEnabled(val) { localStorage.setItem(LS_ENABLED_KEY, JSON.stringify(!!val)); }

    function saveCategory(cat) {
        if (!cat) {
            localStorage.removeItem(LS_CATEGORY_KEY);
            return;
        }
        localStorage.setItem(LS_CATEGORY_KEY, JSON.stringify({ id: String(cat.id), name: String(cat.name) }));
    }

    // ========================================================================
    // UI (only on admin page)
    // ========================================================================

    function initUI() {
        const CSS = `
            :root{ --xlw-h:32px; --xlw-radius:8px; --xlw-border:#d6e2f2; --xlw-shadow:0 1px 2px rgba(16,24,40,.05); --xlw-z:9999; }
            .xlw-wrap{ display:flex; align-items:center; gap:10px; margin-top:12px; position:relative; }
            .xlw-check-label{ display:inline-flex; align-items:center; cursor:pointer; user-select:none; font-weight:400; color:#0f1e2e; }
            .xlw-check-label input{ width:16px; height:16px; margin-top:-1px; }
            .xlw-check-label span{ display:inline-block; margin-left:6px; }
            .xlw-input-wrap{ position:relative; margin-left:auto; display:inline-block; }
            .xlw-search{
                height:var(--xlw-h); min-width:240px; width:360px; max-width:520px;
                padding:0 76px 0 12px; border:1px solid var(--xlw-border); border-radius:var(--xlw-radius);
                box-shadow:var(--xlw-shadow); outline:none !important; transition:border-color .15s ease;
            }
            .xlw-search:focus{ border-color:var(--xlw-border); }
            .xlw-id-badge{
                position:absolute; right:28px; top:50%; transform:translateY(-50%);
                max-width:140px; padding:2px 6px; font-family:ui-monospace, Menlo, monospace; font-size:12px; color:#6b7a90;
                background:#eef5ff; border-radius:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:none; pointer-events:none;
            }
            .xlw-clear{
                position:absolute; right:8px; top:50%; transform:translateY(-50%);
                width:18px; height:18px; line-height:18px; text-align:center; border:none; background:transparent; cursor:pointer; padding:0; color:#8a97a6; border-radius:50%;
            }
            .xlw-clear:hover{ background:#f1f5fb; }
            .xlw-dd{
                position:absolute; top:calc(100% + 6px); right:0; max-height:320px; overflow:auto; background:#fff; border:1px solid var(--xlw-border);
                border-radius:10px; box-shadow:0 8px 20px rgba(16,24,40,.12),0 2px 8px rgba(16,24,40,.06); display:none; z-index:var(--xlw-z);
            }
            .xlw-dd.open{ display:block; }
            .xlw-dd-item{
                padding:7px 12px; font-size:13px; cursor:pointer; border-bottom:1px solid #f1f5fb; display:flex; justify-content:space-between; gap:12px;
            }
            .xlw-dd-item:last-child{ border-bottom:none; }
            .xlw-dd-item:hover{ background:#f6fbff; }
            .xlw-dd-item[aria-disabled="true"]{ opacity:.45; cursor:not-allowed; }
            .xlw-dd-id{ font-family:ui-monospace,Menlo,monospace; font-size:12px; color:#6b7a90; }
        `;

        if (typeof GM_addStyle === "function") {
            GM_addStyle(CSS);
        } else {
            const style = document.createElement("style");
            style.textContent = CSS;
            document.head.appendChild(style);
        }

        const waitFor = (sel, { root = document, timeout = 15000 } = {}) =>
            new Promise((res, rej) => {
                const hit = root.querySelector(sel);
                if (hit) return res(hit);
                const mo = new MutationObserver(() => {
                    const el = root.querySelector(sel);
                    if (el) {
                        mo.disconnect();
                        res(el);
                    }
                });
                mo.observe(root, { childList: true, subtree: true });
                if (timeout) setTimeout(() => {
                    mo.disconnect();
                    rej(new Error("Timeout " + sel));
                }, timeout);
            });

        const norm = s => (s ?? "").toLowerCase().trim();
        const isNum = s => /^[0-9]+$/.test((s ?? "").trim());

        async function buildUI() {
            const buttons = await waitFor(".buttons");
            if (document.getElementById("xlw-wrap")) return;

            const select = document.querySelector("#CategoryId");
            const cats = [];
            if (select) {
                select.querySelectorAll("option").forEach(o => {
                    const id = (o.value || "").trim();
                    const name = (o.textContent || "").trim();
                    if (!id || !name) return;
                    const disabled = o.disabled || o.getAttribute("disabled") === "disabled";
                    cats.push({ id, name, disabled });
                });
            }

            const wrap = document.createElement("div");
            wrap.className = "xlw-wrap";
            wrap.id = "xlw-wrap";

            const lbl = document.createElement("label");
            lbl.className = "xlw-check-label";
            lbl.setAttribute("for", "xlw-check");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.id = "xlw-check";
            const lblText = document.createElement("span");
            lblText.textContent = "XL Widget";
            lbl.append(cb, lblText);

            const inputWrap = document.createElement("div");
            inputWrap.className = "xlw-input-wrap";
            const input = document.createElement("input");
            input.type = "text";
            input.className = "xlw-search";
            input.id = "xlw-search";
            input.placeholder = "Категория или ID…";
            const idBadge = document.createElement("span");
            idBadge.className = "xlw-id-badge";
            idBadge.id = "xlw-id-badge";
            const clearBtn = document.createElement("button");
            clearBtn.type = "button";
            clearBtn.className = "xlw-clear";
            clearBtn.id = "xlw-clear";
            clearBtn.textContent = "×";
            clearBtn.title = "Очистить";
            clearBtn.setAttribute("aria-label", "Очистить");
            inputWrap.append(input, idBadge, clearBtn);

            const dd = document.createElement("div");
            dd.className = "xlw-dd";
            dd.id = "xlw-dd";

            wrap.append(lbl, inputWrap, dd);
            buttons.insertAdjacentElement("afterend", wrap);

            const syncDDWidth = () => {
                dd.style.width = input.offsetWidth + "px";
            };
            syncDDWidth();
            new ResizeObserver(syncDDWidth).observe(input);

            let opened = false, view = [], selectedId = null;

            const open = () => {
                dd.classList.add("open");
                opened = true;
            };
            const close = () => {
                dd.classList.remove("open");
                opened = false;
            };

            const refreshBadge = () => {
                if (selectedId && input.value) {
                    idBadge.style.display = "inline-block";
                } else {
                    idBadge.style.display = "none";
                }
            };

            const render = () => {
                dd.innerHTML = "";
                if (!view.length) {
                    const n = document.createElement("div");
                    n.className = "xlw-dd-item";
                    n.setAttribute("aria-disabled", "true");
                    n.textContent = "Ничего не найдено";
                    dd.append(n);
                    return;
                }
                view.forEach(c => {
                    const row = document.createElement("div");
                    row.className = "xlw-dd-item";
                    if (c.disabled) row.setAttribute("aria-disabled", "true");
                    const name = document.createElement("div");
                    name.textContent = c.name;
                    const id = document.createElement("div");
                    id.className = "xlw-dd-id";
                    id.textContent = c.id;
                    row.append(name, id);
                    if (!c.disabled) row.addEventListener("click", () => choose(c));
                    dd.append(row);
                });
            };

            const filter = (q) => {
                const s = norm(q);
                if (!s) view = cats.slice(0, 200);
                else if (isNum(s)) view = cats.filter(c => c.id.includes(s));
                else view = cats.filter(c => norm(c.name).includes(s));
                render();
            };

            const deselect = () => {
                selectedId = null;
                input.removeAttribute("data-id");
                saveCategory(null);
                // ВАЖНО: НЕ трогаем оригинальный select! Только читаем из него категории
                refreshBadge();
            };

            const choose = (c, { fromRestore = false } = {}) => {
                selectedId = c.id;
                input.value = c.name;
                input.setAttribute("data-id", c.id);
                idBadge.textContent = c.id;
                // ВАЖНО: НЕ трогаем оригинальный select! Только читаем из него категории
                if (!fromRestore) saveCategory({ id: c.id, name: c.name });
                refreshBadge();
                close();
            };

            const ensureOpenAndFilter = () => {
                if (selectedId !== null) deselect();
                filter(input.value);
                if (!opened) open();
                updateClearVisibility();
            };

            const updateClearVisibility = () => {
                clearBtn.style.visibility = input.value ? "visible" : "hidden";
            };

            cb.addEventListener("change", () => saveEnabled(cb.checked));
            input.addEventListener("focus", () => {
                filter(input.value);
                open();
                updateClearVisibility();
            });
            input.addEventListener("click", () => {
                filter(input.value);
                open();
                updateClearVisibility();
            });
            input.addEventListener("input", () => {
                ensureOpenAndFilter();
            });

            clearBtn.addEventListener("click", (e) => {
                e.preventDefault();
                input.value = "";
                deselect();
                filter("");
                open();
                input.focus();
                updateClearVisibility();
            });

            document.addEventListener("click", (e) => {
                if (!wrap.contains(e.target)) close();
            });

            try {
                cb.checked = readEnabledFromLS();
                const savedCat = readCategoryFromLS();
                if (savedCat) {
                    const match = cats.find(c => c.id === String(savedCat.id));
                    if (match && !match.disabled) choose(match, { fromRestore: true });
                }
            } catch (e) {
                console.warn("[XLW] restore failed:", e);
            }

            filter("");
            updateClearVisibility();
            refreshBadge();
        }

        buildUI().catch(err => console.warn("[XLW] UI init error:", err));
    }

    // ========================================================================
    // PATCHER (only on admin page)
    // ========================================================================

    function initPatcher() {
        let CURRENT = { enabled: null, cid: null };

        let rootObserver = null;
        let dialogObservers = new Map();
        let resizeHandler = null;
        let clickHandler = null;

        let origSetAttribute = null;
        let origSrcDescriptor = null;
        let iframeInterceptorsInstalled = false;

        let patchedIframes = new WeakSet();
        const resetPatchedIframes = () => { patchedIframes = new WeakSet(); };

        function isWidgetUrlStr(u) { try { return new URL(u, location.origin).pathname.endsWith(CFG.WIDGET_PATH); } catch { return String(u).includes(CFG.WIDGET_PATH); } }
        function isInnerAdminPreview(u) { try { return new URL(u, location.origin).pathname.endsWith(CFG.INNER_FRAME_PATH); } catch { return String(u).includes(CFG.INNER_FRAME_PATH); } }

        function normalizeWidgetURLStr(rawUrl, cid) {
            const url = new URL(rawUrl, location.origin);
            if (!cid) return url.toString();
            if (url.searchParams.has('id')) url.searchParams.delete('id');
            url.searchParams.set('cid', cid);
            Object.entries(CFG.PARAMS).forEach(([k, v]) => url.searchParams.set(k, v));
            return url.toString();
        }

        function syncAdminToGM() {
            const enabled = readEnabledFromLS();
            const category = readCategoryFromLS();
            const cid = category?.id || null;
            try { GM_setValue(GM_ENABLED_KEY, !!enabled); } catch { }
            try { cid ? GM_setValue(GM_CID_KEY, cid) : GM_deleteValue(GM_CID_KEY); } catch { }
            CURRENT = { enabled: !!enabled, cid };
            info('SYNC LS→GM', { enabled: CURRENT.enabled, cid: CURRENT.cid });
            return { ...CURRENT };
        }

        function getDialogContent() { return document.getElementById(CFG.CONTENT_ID) || null; }
        function getOuterDialog() {
            const content = getDialogContent();
            return content?.closest(CFG.DIALOG_SELECTOR) || null;
        }

        // === Размеры ===
        function applyBaseDialogSizing() {
            const content = getDialogContent();
            if (!content) return;

            const iframe = content.querySelector('iframe');
            if (iframe) {
                iframe.style.width = '';
                try { iframe.setAttribute('width', String(CFG.BASE_IFRAME_WIDTH)); } catch { }
                try { iframe.setAttribute('height', String(CFG.BASE_IFRAME_HEIGHT)); } catch { }
            }

            const dialog = getOuterDialog();
            if (dialog) {
                dialog.style.width = '';
                dialog.style.maxWidth = '';
                dialog.style.left = '';
                dialog.style.top = '';
                dialog.removeAttribute('data-tlpp-centered');

                // Удаляем индикатор
                const indicator = dialog.querySelector('.xlw-category-indicator');
                if (indicator) indicator.remove();
            }

            content.style.width = '';
            content.style.overflow = '';
        }

        function applyXLDialogSizing() {
            if (!CURRENT.enabled || !CURRENT.cid) return;

            const content = getDialogContent();
            if (!content) return;

            const dialog = getOuterDialog();
            if (!dialog) return;

            // КРИТИЧНО: Проверяем что диалог видим и имеет размеры
            const isVisible = dialog.offsetWidth > 0 && dialog.offsetHeight > 0;
            if (!isVisible) {
                log('[applyXLDialogSizing] Dialog not visible yet, w=' + dialog.offsetWidth + ', h=' + dialog.offsetHeight + ', will retry');
                // Ждём когда станет видимым
                setTimeout(() => applyXLDialogSizing(), 50);
                return;
            }

            content.style.width = 'auto';
            content.style.overflow = 'hidden';

            const iframe = content.querySelector('iframe');
            if (iframe) {
                try { iframe.setAttribute('width', String(CFG.XL_IFRAME_WIDTH)); } catch { }
                iframe.style.width = `${CFG.XL_IFRAME_WIDTH}px`;
            }

            dialog.style.width = '';
            dialog.style.maxWidth = '';

            // === ИНДИКАТОР КАТЕГОРИИ ===
            let indicator = dialog.querySelector('.xlw-category-indicator');
            if (!indicator) {
                const buttonPane = dialog.querySelector('.ui-dialog-buttonpane');
                if (buttonPane) {
                    indicator = document.createElement('div');
                    indicator.className = 'xlw-category-indicator';
                    indicator.style.cssText = 'display: inline-block; padding: 8px 12px; background: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
                    // Вставляем ВНУТРЬ buttonPane, в начало
                    buttonPane.insertBefore(indicator, buttonPane.firstChild);
                }
            }
            if (indicator) {
                const category = readCategoryFromLS();
                if (category) {
                    indicator.innerHTML = `<span style="color: #6b7280;">XL Widget:</span> <span style="color: #111827; font-weight: 600;">${category.name}</span> <span style="color: #6b7280;">CID:</span> <span style="color: #111827; font-weight: 600; font-family: ui-monospace, monospace;">${category.id}</span>`;
                }
            }

            requestAnimationFrame(() => {
                if (!CURRENT.enabled || !CURRENT.cid) return;
                const w = dialog.offsetWidth;
                const h = dialog.offsetHeight;

                // Ещё одна проверка на случай если размеры не готовы
                if (w === 0 || h === 0) {
                    log('[applyXLDialogSizing] Dialog still has no size in RAF, retrying...');
                    setTimeout(() => applyXLDialogSizing(), 50);
                    return;
                }

                const left = Math.max((window.innerWidth - w) / 2, 0);
                const top = Math.max((window.innerHeight - h) / 2, 0);
                dialog.style.left = `${left}px`;
                dialog.style.top = `${top}px`;
                dialog.setAttribute('data-tlpp-centered', '1');
                log('[center]', { w, h, left, top });
            });
        }

        function applySizingByState() {
            if (CURRENT.enabled && CURRENT.cid) {
                applyXLDialogSizing();
            } else {
                applyBaseDialogSizing();
            }
        }

        // === Патчинг ===
        function patchWidgetIframe(iframe, cid, force = false) {
            if (!CURRENT.enabled || !CURRENT.cid) return false;
            if (!iframe || !iframe.getAttribute) return false;
            const src = iframe.getAttribute('src') || '';
            if (!isWidgetUrlStr(src)) return false;
            if (!cid) return false;
            if (!force && patchedIframes.has(iframe)) return false;

            let newSrc = normalizeWidgetURLStr(src, cid);
            if (force) {
                const u = new URL(newSrc, location.origin);
                u.searchParams.set('__tlpp_ts', Date.now().toString());
                newSrc = u.toString();
            }
            if (newSrc !== src) {
                iframe.setAttribute('src', newSrc);
                patchedIframes.add(iframe);
                log(`widget patched ${force ? '(forced)' : ''}:`, newSrc);
                return true;
            }
            return false;
        }

        function patchAllWidgetIframes(root, cid, force = false) {
            if (!CURRENT.enabled || !CURRENT.cid) return 0;
            let n = 0;
            root.querySelectorAll('iframe[src]').forEach(ifr => {
                if (patchWidgetIframe(ifr, cid, force)) n++;
            });
            if (n) log(`patched ${n} widget iframe(s)`);
            return n;
        }

        function injectObserverIntoInnerFrame(innerIframe, cid) {
            if (!CURRENT.enabled || !CURRENT.cid) return;
            const setup = () => {
                try {
                    if (!CURRENT.enabled || !CURRENT.cid) return;
                    const doc = innerIframe.contentDocument;
                    const win = innerIframe.contentWindow;
                    if (!doc || !win) return;

                    // КРИТИЧНО: Перехватываем setAttribute ВНУТРИ inner iframe
                    const origSetAttr = win.HTMLIFrameElement.prototype.setAttribute;
                    win.HTMLIFrameElement.prototype.setAttribute = function(name, value) {
                        if (name === 'src' && value && isWidgetUrlStr(value)) {
                            const patched = normalizeWidgetURLStr(value, cid);
                            log('Widget src intercepted and patched:', patched);
                            return origSetAttr.call(this, name, patched);
                        }
                        return origSetAttr.call(this, name, value);
                    };

                    log('setAttribute interceptor installed in inner frame');

                    // Патчим уже существующие
                    patchAllWidgetIframes(doc, cid);

                    const mo = new win.MutationObserver(muts => {
                        if (!CURRENT.enabled || !CURRENT.cid) { mo.disconnect(); return; }
                        muts.forEach(m => {
                            m.addedNodes.forEach(node => {
                                if (!(node instanceof win.Element)) return;
                                if (node.tagName === 'IFRAME') {
                                    const src = node.getAttribute('src');
                                    if (src && isWidgetUrlStr(src)) {
                                        const patched = normalizeWidgetURLStr(src, cid);
                                        if (patched !== src) {
                                            node.setAttribute('src', patched);
                                            log('Widget patched via MutationObserver:', patched);
                                        }
                                    }
                                }
                                if (node.querySelectorAll) {
                                    node.querySelectorAll('iframe[src]').forEach(ifr => {
                                        const src = ifr.getAttribute('src');
                                        if (src && isWidgetUrlStr(src)) {
                                            const patched = normalizeWidgetURLStr(src, cid);
                                            if (patched !== src) {
                                                ifr.setAttribute('src', patched);
                                                log('Widget patched via querySelectorAll:', patched);
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    });
                    mo.observe(doc.documentElement, { childList: true, subtree: true });
                    log('observer injected successfully');
                } catch (e) { warn('inject observer failed', e); }
            };
            const rd = innerIframe.contentDocument?.readyState;
            if (rd === 'complete' || rd === 'interactive') setup();
            else innerIframe.addEventListener('load', setup, { once: true });
        }

        function getInnerFrames() {
            return Array.from(document.querySelectorAll(`iframe[src*="${CFG.INNER_FRAME_PATH}"]`));
        }

        function forcePatchAllOpenWidgets(newCid) {
            if (!CURRENT.enabled || !CURRENT.cid) return;
            getInnerFrames().forEach(inner => {
                const doc = inner?.contentDocument;
                if (!doc) return;
                patchAllWidgetIframes(doc, newCid, true);
            });
        }

        // === Наблюдатели/перехватчики ===
        function armDialogObserver() {
            if (rootObserver) return;
            rootObserver = new MutationObserver(muts => {
                muts.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (!(node instanceof Element)) return;

                        const dialog = node.matches?.(CFG.DIALOG_SELECTOR) ? node : node.querySelector?.(CFG.DIALOG_SELECTOR);
                        const content = node.id === CFG.CONTENT_ID ? node : node.querySelector?.(`#${CFG.CONTENT_ID}`);

                        if (dialog || content) {
                            applySizingByState();

                            const target = dialog || content;
                            if (CURRENT.enabled && CURRENT.cid) {
                                target.querySelectorAll?.('iframe[src]').forEach((ifr) => {
                                    const src = ifr.getAttribute('src') || '';
                                    if (isInnerAdminPreview(src)) {
                                        injectObserverIntoInnerFrame(ifr, CURRENT.cid);
                                    }
                                });
                            }

                            if (dialog && !dialogObservers.has(dialog)) {
                                const mo = new MutationObserver(() => {
                                    const style = getComputedStyle(dialog);
                                    if (style.display !== 'none') {
                                        applySizingByState();
                                        if (CURRENT.enabled && CURRENT.cid) {
                                            const inner = dialog.querySelector(`iframe[src*="${CFG.INNER_FRAME_PATH}"]`);
                                            if (inner?.contentDocument) {
                                                patchAllWidgetIframes(inner.contentDocument, CURRENT.cid, true);
                                            }
                                        }
                                    }
                                });
                                mo.observe(dialog, { attributes: true, attributeFilter: ['style', 'class'] });
                                dialogObservers.set(dialog, mo);
                            }
                        }
                    });
                });
            });
            rootObserver.observe(document.documentElement, { childList: true, subtree: true });
        }

        function disarmDialogObserver() {
            if (rootObserver) { try { rootObserver.disconnect(); } catch { } rootObserver = null; }
            dialogObservers.forEach((mo) => { try { mo.disconnect(); } catch { } });
            dialogObservers.clear();
        }

        function armIframeInterceptors() {
            if (iframeInterceptorsInstalled) return;
            const proto = HTMLIFrameElement.prototype;
            origSetAttribute = origSetAttribute || proto.setAttribute;
            const desc = Object.getOwnPropertyDescriptor(proto, 'src');
            origSrcDescriptor = origSrcDescriptor || desc;

            proto.setAttribute = function (name, value) {
                // КРИТИЧНО: Патчим inner iframe ДО загрузки
                if (name === 'src' && value && isInnerAdminPreview(value)) {
                    if (CURRENT.enabled && CURRENT.cid) {
                        // Добавляем параметры для виджета прямо в URL inner iframe
                        try {
                            const url = new URL(value, location.origin);
                            url.searchParams.set('xlw_cid', CURRENT.cid);
                            url.searchParams.set('xlw_enabled', '1');
                            const modifiedValue = url.toString();
                            info('Inner iframe URL modified:', modifiedValue);
                            const res = origSetAttribute.call(this, name, modifiedValue);
                            this.addEventListener('load', () => injectObserverIntoInnerFrame(this, CURRENT.cid), { once: true });
                            return res;
                        } catch (e) {
                            warn('Failed to modify inner iframe URL:', e);
                        }
                    }
                }

                const res = origSetAttribute.call(this, name, value);
                if (CURRENT.enabled && CURRENT.cid && name === 'src' && value && isInnerAdminPreview(value)) {
                    this.addEventListener('load', () => injectObserverIntoInnerFrame(this, CURRENT.cid), { once: true });
                }
                return res;
            };

            if (desc && desc.set) {
                Object.defineProperty(proto, 'src', {
                    configurable: true,
                    enumerable: desc.enumerable,
                    get: desc.get,
                    set: function (value) {
                        // КРИТИЧНО: Патчим inner iframe ДО загрузки
                        if (value && isInnerAdminPreview(value)) {
                            if (CURRENT.enabled && CURRENT.cid) {
                                try {
                                    const url = new URL(value, location.origin);
                                    url.searchParams.set('xlw_cid', CURRENT.cid);
                                    url.searchParams.set('xlw_enabled', '1');
                                    const modifiedValue = url.toString();
                                    info('Inner iframe URL modified (via setter):', modifiedValue);
                                    const r = desc.set.call(this, modifiedValue);
                                    this.addEventListener('load', () => injectObserverIntoInnerFrame(this, CURRENT.cid), { once: true });
                                    return r;
                                } catch (e) {
                                    warn('Failed to modify inner iframe URL:', e);
                                }
                            }
                        }

                        const r = desc.set.call(this, value);
                        if (CURRENT.enabled && CURRENT.cid && value && isInnerAdminPreview(value)) {
                            this.addEventListener('load', () => injectObserverIntoInnerFrame(this, CURRENT.cid), { once: true });
                        }
                        return r;
                    }
                });
            }
            iframeInterceptorsInstalled = true;
            info('iframe interceptors installed (admin)');
        }

        function disarmIframeInterceptors() {
            if (!iframeInterceptorsInstalled) return;
            try {
                if (origSetAttribute) HTMLIFrameElement.prototype.setAttribute = origSetAttribute;
                if (origSrcDescriptor) {
                    Object.defineProperty(HTMLIFrameElement.prototype, 'src', origSrcDescriptor);
                }
            } catch (e) { warn('restore iframe interceptors fail', e); }
            iframeInterceptorsInstalled = false;
        }

        function armClickWatcher() {
            if (clickHandler) return;
            let t = null;
            clickHandler = (e) => {
                const btn = e.target.closest('button, .ui-button');
                if (!btn) return;

                if (t) clearTimeout(t);
                t = setTimeout(() => {
                    applySizingByState();

                    if (CURRENT.enabled && CURRENT.cid) {
                        const inner = document.querySelector(`iframe[src*="${CFG.INNER_FRAME_PATH}"]`);
                        if (inner?.contentDocument) {
                            patchAllWidgetIframes(inner.contentDocument, CURRENT.cid, true);
                        }
                    }
                }, CFG.CLICK_DEBOUNCE_MS);
            };
            document.addEventListener('click', clickHandler, true);
        }

        function disarmClickWatcher() {
            if (clickHandler) {
                try { document.removeEventListener('click', clickHandler, true); } catch { }
                clickHandler = null;
            }
        }

        function armResizeRecenter() {
            if (resizeHandler) return;
            let rafId = null;
            resizeHandler = () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(applySizingByState);
            };
            window.addEventListener('resize', resizeHandler);
        }

        function disarmResizeRecenter() {
            if (resizeHandler) {
                try { window.removeEventListener('resize', resizeHandler); } catch { }
                resizeHandler = null;
            }
        }

        // === Реалтайм-мост LS → GM + реакции ===
        function installRealtimeLsBridge() {
            try {
                const LS = window.localStorage;
                const origSet = LS.setItem.bind(LS);
                const origRem = LS.removeItem.bind(LS);
                const origClr = LS.clear.bind(LS);
                const dispatch = (key, newValue) => window.dispatchEvent(new CustomEvent('xlw:ls-change', { detail: { key, newValue } }));

                LS.setItem = function (key, value) { const prev = LS.getItem(key); const r = origSet(key, value); if (prev !== value) dispatch(key, value); return r; };
                LS.removeItem = function (key) { const had = LS.getItem(key); const r = origRem(key); if (had !== null) dispatch(key, null); return r; };
                LS.clear = function () { const r = origClr(); dispatch('*', null); return r; };

                info('LS shim installed');
            } catch (e) { warn('LS shim failed', e); }

            const onLsChange = (key) => {
                if (key !== LS_ENABLED_KEY && key !== LS_CATEGORY_KEY && key !== '*') return;
                const before = { ...CURRENT };
                const after = syncAdminToGM();
                handleEnableStateChange(before, after);
            };
            window.addEventListener('xlw:ls-change', e => onLsChange(e.detail?.key || null));
            window.addEventListener('storage', e => { if (e?.key) onLsChange(e.key); });

            let last = {
                [LS_ENABLED_KEY]: safeGetLS(LS_ENABLED_KEY),
                [LS_CATEGORY_KEY]: safeGetLS(LS_CATEGORY_KEY),
            };
            setInterval(() => {
                const en = safeGetLS(LS_ENABLED_KEY);
                const ct = safeGetLS(LS_CATEGORY_KEY);
                if (en !== last[LS_ENABLED_KEY]) { last[LS_ENABLED_KEY] = en; onLsChange(LS_ENABLED_KEY); }
                if (ct !== last[LS_CATEGORY_KEY]) { last[LS_CATEGORY_KEY] = ct; onLsChange(LS_CATEGORY_KEY); }
            }, CFG.POLL_MS);
        }

        function armAll() {
            armResizeRecenter();
            armDialogObserver();
            armIframeInterceptors();
            armClickWatcher();

            if (CURRENT.cid) {
                applyXLDialogSizing();
                getInnerFrames().forEach(ifr => injectObserverIntoInnerFrame(ifr, CURRENT.cid));
            } else {
                applyBaseDialogSizing();
            }
        }

        function disarmAll() {
            disarmResizeRecenter();
            disarmDialogObserver();
            disarmIframeInterceptors();
            disarmClickWatcher();
            applyBaseDialogSizing();
        }

        function handleEnableStateChange(before, after) {
            const cidChangedWhileEnabled = after.enabled && before.cid !== after.cid;

            if (before.enabled === after.enabled) {
                if (cidChangedWhileEnabled && after.cid) {
                    resetPatchedIframes();
                    forcePatchAllOpenWidgets(after.cid);
                    applyXLDialogSizing();
                }
                if (after.enabled && !after.cid && before.cid) {
                    applyBaseDialogSizing();
                }
                if (after.enabled && after.cid && !before.cid) {
                    resetPatchedIframes();
                    forcePatchAllOpenWidgets(after.cid);
                    applyXLDialogSizing();
                }
                return;
            }

            function waitForDialogAndApplyXL(retries = 25) {
                const dialog = getOuterDialog();
                const content = getDialogContent();
                if (dialog && content && dialog.offsetWidth > 0) {
                    applySizingByState();
                    if (after.cid) forcePatchAllOpenWidgets(after.cid);
                    log('[waitForDialogAndApplyXL] applied');
                    return;
                }
                if (retries > 0) {
                    setTimeout(() => waitForDialogAndApplyXL(retries - 1), 200);
                } else {
                    warn('[waitForDialogAndApplyXL] dialog not found, giving up');
                }
            }

            if (after.enabled) {
                resetPatchedIframes();
                armAll();
                if (after.cid) {
                    forcePatchAllOpenWidgets(after.cid);
                    waitForDialogAndApplyXL();
                } else {
                    applyBaseDialogSizing();
                }
            } else {
                disarmAll();
                resetPatchedIframes();
            }
        }

        // === INIT ===
        info('INIT patcher (admin):', location.href);
        syncAdminToGM();
        installRealtimeLsBridge();

        if (CURRENT.enabled && CURRENT.cid) {
            resetPatchedIframes();
            armAll();
            forcePatchAllOpenWidgets(CURRENT.cid);
        } else {
            applyBaseDialogSizing();
        }

        window.XLW = {
            debug: (v = true) => { CFG.DEBUG = !!v; console.log(TAG, 'debug=', CFG.DEBUG); },
            status: () => ({ ...CURRENT })
        };
    }

    // ========================================================================
    // CDN PATCHER (only on CDN in iframe)
    // ========================================================================

    function initCDNPatcher() {
        info('INIT cdn:', location.href);

        // Проверяем что мы внутри iframe
        if (window.self === window.top) {
            warn('CDN: opened directly (not in iframe), skipping to avoid breaking things');
            return;
        }

        // Проверяем есть ли уже наши параметры в URL (значит уже патчили)
        const url = new URL(location.href);
        const hasCid = url.searchParams.has('cid');
        const hasGallery = url.searchParams.has('availableGalleryWidget');

        if (hasCid && hasGallery) {
            log('CDN: already patched (has cid and gallery params), skipping');
            return;
        }

        // Проверяем referrer (откуда загрузили виджет)
        const referrer = document.referrer;
        info('CDN: referrer =', referrer);

        if (!referrer) {
            warn('CDN: no referrer, assuming direct open, skipping');
            return;
        }

        // Проверяем что referrer с админки ИЛИ с самого CDN (после редиректа)
        try {
            const referrerUrl = new URL(referrer);
            const isFromAdmin = referrerUrl.hostname === 'tngadmin.triplenext.net';
            const isFromCDN = referrerUrl.hostname === 'cdn.tangiblee.com';

            if (!isFromAdmin && !isFromCDN) {
                warn('CDN: referrer is not admin or CDN domain, skipping');
                return;
            }

            if (isFromAdmin) {
                info('CDN: referrer is admin domain, proceeding with patch');
            } else {
                info('CDN: referrer is CDN (after redirect), proceeding with patch');
            }
        } catch (e) {
            warn('CDN: invalid referrer, skipping');
            return;
        }

        let gmEnabled = false, gmCid = null;
        try { gmEnabled = !!GM_getValue(GM_ENABLED_KEY); } catch { }
        try { gmCid = GM_getValue(GM_CID_KEY) || null; } catch { }
        info('WIDGET MODE (CDN in iframe)');
        if (!gmEnabled || !gmCid) {
            warn('CDN: disabled or no cid — no normalization');
            return;
        }

        function normalizeWidgetURLStr(rawUrl, cid) {
            const url = new URL(rawUrl, location.origin);
            if (!cid) return url.toString();
            if (url.searchParams.has('id')) url.searchParams.delete('id');
            url.searchParams.set('cid', cid);
            Object.entries(CFG.PARAMS).forEach(([k, v]) => url.searchParams.set(k, v));
            return url.toString();
        }

        const before = location.href;
        const after = normalizeWidgetURLStr(before, gmCid);
        if (after !== before) {
            info('CDN redirect →', after);
            location.replace(after);
        } else {
            log('CDN: already normalized');
        }
    }

    // ========================================================================
    // MAIN ROUTER
    // ========================================================================

    const onAdmin = location.hostname === 'tngadmin.triplenext.net';
    const onCDN = location.hostname === 'cdn.tangiblee.com' &&
        location.pathname.endsWith(CFG.WIDGET_PATH) &&
        window.self !== window.top;

    if (onAdmin) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initUI();
                initPatcher();
            });
        } else {
            initUI();
            initPatcher();
        }
    } else if (onCDN) {
        initCDNPatcher();
    } else {
        info('INIT other:', location.href);
    }

})();
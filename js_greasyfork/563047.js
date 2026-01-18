// ==UserScript==
// @name         Platesmania Gallery Moderator Mode Toolbox
// @version      1.0
// @description  Couple enhancements for moderator workflow.
// @match        https://platesmania.com/*gallery*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      opendata.rdw.nl
// @connect      motonet.fi
// @connect      trodo.it
// @license      MIT
// @namespace https://greasyfork.org/users/976031
// @downloadURL https://update.greasyfork.org/scripts/563047/Platesmania%20Gallery%20Moderator%20Mode%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/563047/Platesmania%20Gallery%20Moderator%20Mode%20Toolbox.meta.js
// ==/UserScript==

(() => {
    "use strict";

    GM_addStyle(`
  .pmx-infobtn {
    margin-right: 6px;
  }
    .row > .col-xs-6.vcenter:first-child {
    width: 45%;
  }

  .row > .col-xs-6.vcenter:last-child {
    width: 55%;
  }
  i.sprite.pull-right {
  margin-left: 8px;
}

`);

    // ---------- Storage ----------
    const MODERATOR_KEY = "pm_moderator_mode_enabled"; // renamed
    const ZOOM_KEY = "pm_zoom_enabled";

    const gmGet = (key, fallback) => {
        try {
            if (typeof GM_getValue === "function") return GM_getValue(key, fallback);
        } catch {}
        return fallback;
    };
    const gmSet = (key, val) => {
        try {
            if (typeof GM_setValue === "function") GM_setValue(key, val);
        } catch {}
    };

    // ---------- Small helpers ----------
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function safeOpen(url) {
        // keep it synchronous in the click handler (popup blockers)
        window.open(url, "_blank", "noopener,noreferrer");
    }

    function normalizePlateForQuery(plate) {
        return String(plate || "").trim().replace(/\s+/g, " ");
    }

    function normalizePlateCompact(plate) {
        return String(plate || "").trim().replace(/[\s-]+/g, "");
    }

    function frWithHyphensFromCompact(compact) {
        const s = String(compact || "").toUpperCase();
        if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(s)) return s.replace(/^([A-Z]{2})(\d{3})([A-Z]{2})$/, "$1-$2-$3");
        return s;
    }

    function httpGetJson(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    headers: { Accept: "application/json" },
                    onload: (res) => {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject,
                });
            } else {
                fetch(url).then((r) => r.json()).then(resolve).catch(reject);
            }
        });
    }

    function httpGetText(url, accept = "*/*") {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    headers: { Accept: accept },
                    onload: (res) => resolve(res.responseText),
                    onerror: reject,
                });
            } else {
                fetch(url, { headers: { Accept: accept } })
                    .then((r) => r.text())
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    function escHtml(s) {
        return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    // ---------- UI: Moderator mode toggle (+ Zoom toggle) ----------
    function injectModeratorToggle() {
        if (qs("#pmx-moderator-toggle"))
            return { moderatorEnabled: !!gmGet(MODERATOR_KEY, false), zoomEnabled: !!gmGet(ZOOM_KEY, false) };

        const candidateAnchors = [qs(".breadcrumb"), qs(".navbar"), qs(".nav"), qs(".container .row"), qs("header"), qs("body")].filter(Boolean);
        const anchor = candidateAnchors[0] || document.body;

        const wrap = document.createElement("div");
        wrap.id = "pmx-moderator-toggle";
        wrap.style.display = "inline-flex";
        wrap.style.flex = "0 0 auto";
        wrap.style.width = "fit-content";
        wrap.style.whiteSpace = "nowrap";
        wrap.style.alignItems = "center";
        wrap.style.gap = "10px";
        wrap.style.padding = "4px 8px";
        wrap.style.margin = "8px 10px";
        wrap.style.border = "1px solid rgba(0,0,0,0.12)";
        wrap.style.borderRadius = "8px";
        wrap.style.background = "rgba(255,255,255,0.9)";
        wrap.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
        wrap.style.fontSize = "14px";

        const labelMod = document.createElement("label");
        labelMod.style.display = "inline-flex";
        labelMod.style.alignItems = "center";
        labelMod.style.gap = "8px";
        labelMod.style.margin = "0";

        const cbMod = document.createElement("input");
        cbMod.type = "checkbox";
        cbMod.id = "pmx-moderator-checkbox";

        const textMod = document.createElement("span");
        textMod.textContent = "Moderator mode";

        labelMod.appendChild(cbMod);
        labelMod.appendChild(textMod);
        wrap.appendChild(labelMod);

        // Zoom toggle (only visible when Moderator mode is enabled)
        const labelZoom = document.createElement("label");
        labelZoom.id = "pmx-zoom-toggle";
        labelZoom.style.display = "inline-flex";
        labelZoom.style.alignItems = "center";
        labelZoom.style.gap = "8px";
        labelZoom.style.margin = "0";

        const cbZoom = document.createElement("input");
        cbZoom.type = "checkbox";
        cbZoom.id = "pmx-zoom-checkbox";

        const textZoom = document.createElement("span");
        textZoom.textContent = "Zoom";

        labelZoom.appendChild(cbZoom);
        labelZoom.appendChild(textZoom);
        wrap.appendChild(labelZoom);

        // Insert
        if (anchor === document.body) {
            document.body.insertBefore(wrap, document.body.firstChild);
        } else if (anchor.parentNode) {
            anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
        } else {
            document.body.insertBefore(wrap, document.body.firstChild);
        }

        const moderatorEnabled = !!gmGet(MODERATOR_KEY, false);
        const zoomEnabled = !!gmGet(ZOOM_KEY, false);

        cbMod.checked = moderatorEnabled;
        cbZoom.checked = zoomEnabled;

        const setZoomVisible = (visible) => {
            labelZoom.style.display = visible ? "inline-flex" : "none";
        };
        setZoomVisible(moderatorEnabled);

        cbMod.addEventListener("change", () => {
            gmSet(MODERATOR_KEY, cbMod.checked);

            // Zoom toggle should appear/disappear immediately
            setZoomVisible(cbMod.checked);

            if (cbMod.checked) {
                runModeratorPass();
                applyZoomToAllTiles(!!gmGet(ZOOM_KEY, false));
            } else {
                teardownModeratorPass();
            }
        });

        cbZoom.addEventListener("change", () => {
            gmSet(ZOOM_KEY, cbZoom.checked);
            // Apply instantly (no reload)
            if (gmGet(MODERATOR_KEY, false)) applyZoomToAllTiles(cbZoom.checked);
        });

        return { moderatorEnabled, zoomEnabled };
    }

    // ---------- Moderator edit: floating iframe + popup ----------
    const EDIT_IFRAME_ID = "pmx-edit-overlay";
    const EDIT_IFRAME_NAME = "pmx_edit_iframe_target";
    const EDIT_POPUP_NAME = "pmx_edit_popup_target";

    function closeEditOverlay() {
        const el = qs("#" + EDIT_IFRAME_ID);
        if (el) el.remove();
    }

    function ensureEditOverlay() {
        let overlay = qs("#" + EDIT_IFRAME_ID);
        if (overlay) return overlay;

        overlay = document.createElement("div");
        overlay.id = EDIT_IFRAME_ID;
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "999999";
        overlay.style.background = "rgba(0,0,0,0.35)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.addEventListener("mousedown", (e) => {
            // click outside closes
            if (e.target === overlay) closeEditOverlay();
        });

        const panel = document.createElement("div");
        panel.style.width = "70vw";
        panel.style.height = "90vh";
        panel.style.background = "#fff";
        panel.style.borderRadius = "12px";
        panel.style.boxShadow = "0 16px 44px rgba(0,0,0,0.30)";
        panel.style.overflow = "hidden";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";

        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";
        header.style.padding = "10px 12px";
        header.style.borderBottom = "1px solid rgba(0,0,0,0.08)";
        header.style.background = "#f8f9fa";
        header.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

        const title = document.createElement("div");
        title.textContent = "Moderator edit";
        title.style.fontWeight = "700";
        title.style.fontSize = "14px";

        const close = document.createElement("button");
        close.type = "button";
        close.textContent = "×";
        close.title = "Close";
        close.style.border = "0";
        close.style.background = "transparent";
        close.style.cursor = "pointer";
        close.style.fontSize = "22px";
        close.style.lineHeight = "22px";
        close.style.padding = "0 4px";
        close.addEventListener("click", closeEditOverlay);

        header.appendChild(title);
        header.appendChild(close);

        const iframe = document.createElement("iframe");
        iframe.name = EDIT_IFRAME_NAME;
        iframe.style.border = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.flex = "1 1 auto";
        iframe.setAttribute("referrerpolicy", "no-referrer");

        // auto-close when URL changes (user clicked a link in the iframe)
        let baselineHref = null;
        let baselineSet = false;
        iframe.addEventListener("load", () => {
            try {
                const href = iframe.contentWindow?.location?.href || "";
                if (!href) return;

                if (!baselineSet) {
                    baselineHref = href;
                    baselineSet = true;
                    return;
                }

                if (href !== baselineHref) closeEditOverlay();
            } catch {
                closeEditOverlay();
            }
        });

        panel.appendChild(header);
        panel.appendChild(iframe);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        return overlay;
    }

    function submitFormToTarget(form, targetName) {
        const prevTarget = form.getAttribute("target");
        form.setAttribute("target", targetName);
        try {
            // IMPORTANT: submit() bypasses submit event handlers (so our iframe handler won't interfere)
            form.submit();
        } catch {
            const btn = qs('button[type="submit"], input[type="submit"]', form);
            btn?.click();
        } finally {
            setTimeout(() => {
                if (prevTarget == null) form.removeAttribute("target");
                else form.setAttribute("target", prevTarget);
            }, 0);
        }
    }

    function openEditInIframe(form) {
        ensureEditOverlay();
        submitFormToTarget(form, EDIT_IFRAME_NAME);
    }

    function openEditInPopup(form) {
        // NOTE: Do NOT use noopener/noreferrer here, it can break targeting in Firefox.
        const features = [
            "popup=1",
            "width=980",
            "height=760",
            "left=120",
            "top=80",
            "resizable=1",
            "scrollbars=1",
            "menubar=0",
            "toolbar=0",
            "location=0",
            "status=0",
        ].join(",");

        const w = window.open("about:blank", EDIT_POPUP_NAME, features);
        if (!w) return; // popup blocked

        try {
            w.focus();
        } catch {}

        // Target by the stable name we opened with (not w.name), then POST into it.
        submitFormToTarget(form, EDIT_POPUP_NAME);
    }

    function enhanceModeratorEditForm(form) {
        if (!form || form.dataset.pmxEditEnhanced === "1") return;

        const btn = qs('button[type="submit"], input[type="submit"]', form);
        if (!btn) {
            form.dataset.pmxEditEnhanced = "1";
            return;
        }

        // Intercept normal submit (keyboard / enter, etc.)
        form.addEventListener(
            "submit",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditInIframe(form);
            },
            true
        );

        // Intercept the original pencil click explicitly too
        btn.addEventListener(
            "click",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditInIframe(form);
            },
            true
        );

        // Duplicate button: pencil + "arrow to top right" (fa-external-link)
        const dup = document.createElement("button");
        dup.type = "button";
        dup.className = btn.className; // keep styling identical
        dup.style.marginRight = "6px";
        dup.title = "Open moderator edit in a popup window";
        dup.innerHTML = `${btn.innerHTML} <i class="fa fa-external-link" aria-hidden="true" style="margin-left:4px;"></i>`;

        dup.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openEditInPopup(form);
        });

        btn.insertAdjacentElement("afterend", dup);

        form.dataset.pmxEditEnhanced = "1";
    }

    // ---------- Moderator mode: core parsing ----------
    function parseTile(tile) {
        const nomerA = qs('a[href^="/"][href*="/nomer"]', tile) || qs('a[href*="/nomer"]', tile);
        const href = nomerA?.getAttribute("href") || "";
        const m = href.match(/^\/([a-z]{2,4})\/nomer(\d+)/i);
        const country = m ? m[1].toLowerCase() : "";
        const photoId = m ? m[2] : "";

        const userA = qs('a[href^="/user"]', tile);
        const userHref = userA?.getAttribute("href") || "";
        const userId = (userHref.match(/^\/user(\d+)/) || [])[1] || "";
        const username = (userA?.textContent || "").trim();

        const plateImg =
              qs('img[alt][src*="/inf/"]', tile) ||
              qs('img[alt][src*="/inf"]', tile) ||
              qsa("img[alt]", tile).find((img) => (img.getAttribute("alt") || "").trim().length > 0) ||
              null;
        const plate = (plateImg?.getAttribute("alt") || "").trim();

        // IMPORTANT: zoom applies only to /m/ images (NOT /s/)
        const mImg = qs('img[src*="/m/"]', tile) || qs("img.img-responsive", tile);
        const mImgUrl = mImg?.getAttribute("src") || "";
        const oImgUrl = mImgUrl && /\/m\//.test(mImgUrl) ? mImgUrl.replace(/\/m\//, "/o/") : "";

        const editForm = qs('form[action="/admin/edit_new.php"]', tile);

        return { tile, href, country, photoId, username, userId, plate, mImg, mImgUrl, oImgUrl, editForm };
    }

    // ---------- Buttons: insertion ----------
    function makeBtn(opts) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = opts.className || "btn-u btn-u-blue btn-u-xs pull-right";
        btn.style.marginLeft = "6px";
        btn.title = opts.title || "";
        btn.innerHTML = opts.html || "";
        if (opts.onClick) btn.addEventListener("click", opts.onClick);
        return btn;
    }

    function injectForumWarningButton(tileInfo) {
        if (!tileInfo.userId) return;
        if (!tileInfo.tile || tileInfo.tile.querySelector(".pmx-forumwarn")) return;

        const userA = qs('a[href^="/user"]', tileInfo.tile);
        if (!userA) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pmx-forumwarn";
        btn.title = "Show warnings for this user";
        btn.style.marginLeft = "8px";
        btn.style.display = "inline-flex";
        btn.style.alignItems = "center";
        btn.style.verticalAlign = "middle";
        btn.style.color = "#d9534f";
        btn.style.border = "0";
        btn.style.background = "transparent";
        btn.style.padding = "0";
        btn.style.cursor = "pointer";
        btn.innerHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            safeOpen(`https://platesmania.com/newforum/index.php?app=core&module=system&controller=warnings&id=${encodeURIComponent(tileInfo.userId)}`);
        });

        userA.insertAdjacentElement("afterend", btn);
    }

    // ---------- Dropdown menu ----------
    let activeMenuCleanup = null;

    function closeAllMenus() {
        if (typeof activeMenuCleanup === "function") {
            try {
                activeMenuCleanup();
            } catch {}
            activeMenuCleanup = null;
        }
        qsa(".pmx-menu").forEach((m) => m.remove());
    }

    function showMenuNearButton(btn, items) {
        closeAllMenus();

        const menu = document.createElement("div");
        menu.className = "pmx-menu";
        menu.style.position = "absolute";
        menu.style.zIndex = "999999";
        menu.style.minWidth = "230px";
        menu.style.maxWidth = "360px";
        menu.style.background = "#fff";
        menu.style.border = "1px solid rgba(0,0,0,0.18)";
        menu.style.borderRadius = "10px";
        menu.style.boxShadow = "0 10px 28px rgba(0,0,0,0.18)";
        menu.style.padding = "6px";
        menu.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
        menu.style.fontSize = "13px";

        const title = document.createElement("div");
        title.style.padding = "6px 8px";
        title.style.fontWeight = "600";
        title.style.borderBottom = "1px solid rgba(0,0,0,0.08)";
        title.textContent = "Lookup / Tools";
        menu.appendChild(title);

        for (const it of items) {
            const row = document.createElement("button");
            row.type = "button";
            row.style.width = "100%";
            row.style.textAlign = "left";
            row.style.border = "0";
            row.style.background = "transparent";
            row.style.padding = "8px 10px";
            row.style.borderRadius = "8px";
            row.style.cursor = it.disabled ? "not-allowed" : "pointer";
            row.style.opacity = it.disabled ? "0.55" : "1";
            row.innerHTML = `${it.iconHtml ? `<span style="display:inline-block;width:18px;margin-right:8px;opacity:.9">${it.iconHtml}</span>` : ""}${escHtml(it.label)}`;

            row.addEventListener("mouseenter", () => (row.style.background = "rgba(0,0,0,0.05)"));
            row.addEventListener("mouseleave", () => (row.style.background = "transparent"));

            if (!it.disabled) {
                row.addEventListener("click", (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    closeAllMenus();
                    it.onSelect?.();
                });
            }
            menu.appendChild(row);
        }

        document.body.appendChild(menu);

        const r = btn.getBoundingClientRect();
        const menuW = menu.offsetWidth || 260;
        const top = window.scrollY + r.bottom + 6;
        const left = window.scrollX + Math.max(8, Math.min(window.innerWidth - menuW - 8, r.right - menuW));

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;

        const onDoc = (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                closeAllMenus();
            }
        };
        const onEsc = (e) => {
            if (e.key === "Escape") closeAllMenus();
        };

        document.addEventListener("mousedown", onDoc, true);
        document.addEventListener("keydown", onEsc, true);

        activeMenuCleanup = () => {
            document.removeEventListener("mousedown", onDoc, true);
            document.removeEventListener("keydown", onEsc, true);
            try {
                menu.remove();
            } catch {}
        };
    }

    // ---------- Floating info windows for API lookups ----------
    function makeFloatWindow(id, titleHtml, rows) {
        const existing = qs("#" + id);
        if (existing) existing.remove();

        const wrap = document.createElement("div");
        wrap.id = id;
        wrap.style.position = "fixed";
        wrap.style.top = "80px";
        wrap.style.right = "40px";
        wrap.style.zIndex = "999999";
        wrap.style.background = "#fff";
        wrap.style.border = "1px solid rgba(0,0,0,0.2)";
        wrap.style.borderRadius = "10px";
        wrap.style.boxShadow = "0 10px 28px rgba(0,0,0,0.22)";
        wrap.style.minWidth = "280px";
        wrap.style.maxWidth = "420px";
        wrap.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
        wrap.style.overflow = "hidden";

        const header = document.createElement("div");
        header.style.padding = "10px 12px";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";
        header.style.background = "#f8f9fa";
        header.style.borderBottom = "1px solid rgba(0,0,0,0.08)";
        header.style.cursor = "move";

        const t = document.createElement("div");
        t.innerHTML = titleHtml;
        t.style.fontWeight = "700";
        t.style.fontSize = "14px";

        const close = document.createElement("div");
        close.textContent = "×";
        close.title = "Close";
        close.style.cursor = "pointer";
        close.style.fontSize = "18px";
        close.style.lineHeight = "18px";
        close.addEventListener("click", () => wrap.remove());

        header.appendChild(t);
        header.appendChild(close);

        const body = document.createElement("div");
        body.style.padding = "10px 12px";
        body.style.fontSize = "13px";

        const copyToClipboard = (text) => {
            const s = String(text ?? "");
            const fallback = () => {
                const ta = document.createElement("textarea");
                ta.value = s;
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand("copy");
                } catch {}
                ta.remove();
            };
            if (navigator.clipboard?.writeText) navigator.clipboard.writeText(s).catch(fallback);
            else fallback();
        };

        for (const [label, value] of rows.filter(([, v]) => String(v ?? "").trim() !== "")) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.gap = "10px";
            row.style.margin = "6px 0";

            const txt = document.createElement("div");
            txt.style.flex = "1 1 auto";
            txt.textContent = `${label}: ${value}`;

            const copy = document.createElement("button");
            copy.type = "button";
            copy.title = "Copy";
            copy.textContent = "⧉";
            copy.style.border = "0";
            copy.style.background = "rgba(0,0,0,0.06)";
            copy.style.borderRadius = "6px";
            copy.style.padding = "4px 8px";
            copy.style.cursor = "pointer";
            copy.addEventListener("click", () => copyToClipboard(value));

            row.appendChild(txt);
            row.appendChild(copy);
            body.appendChild(row);
        }

        wrap.appendChild(header);
        wrap.appendChild(body);
        document.body.appendChild(wrap);

        let dragging = false,
            ox = 0,
            oy = 0;
        header.addEventListener("mousedown", (e) => {
            dragging = true;
            const rect = wrap.getBoundingClientRect();
            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
            wrap.style.left = rect.left + "px";
            wrap.style.top = rect.top + "px";
            wrap.style.right = "auto";
            const move = (ev) => {
                if (!dragging) return;
                wrap.style.left = ev.clientX - ox + "px";
                wrap.style.top = ev.clientY - oy + "px";
            };
            const up = () => {
                dragging = false;
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            };
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
            e.preventDefault();
        });
    }

    async function fetchRDW(plate) {
        const compact = normalizePlateCompact(plate).toUpperCase();
        const baseUrl = "https://opendata.rdw.nl/resource/m9d7-ebf2.json";
        const fuelUrl = "https://opendata.rdw.nl/resource/8ys7-d773.json";
        const qBase = `${baseUrl}?kenteken=${encodeURIComponent(compact)}`;
        const qFuel = `${fuelUrl}?kenteken=${encodeURIComponent(compact)}`;
        const [base, fuel] = await Promise.all([httpGetJson(qBase).catch(() => []), httpGetJson(qFuel).catch(() => [])]);

        const primary = Array.isArray(base) && base.length ? base[0] : {};
        const fuelTypes = (Array.isArray(fuel) ? fuel : [])
            .map((x) => x.brandstof_omschrijving || x.brandstof_omschrijving_ || x.brandstof || "")
            .filter(Boolean);

        const onlyYear = (yyyymmdd) => {
            if (!yyyymmdd || typeof yyyymmdd !== "string") return "unknown";
            if (/^\d{8}$/.test(yyyymmdd)) return yyyymmdd.slice(0, 4);
            return "unknown";
        };

        return {
            make: primary.merk || "unknown",
            model: primary.handelsbenaming || "unknown",
            variant: primary.variant || "unknown",
            yFirst: onlyYear(primary.datum_eerste_toelating),
            yNL: onlyYear(primary.datum_eerste_tenaamstelling_in_nederland),
            fuel: fuelTypes.length ? fuelTypes.join(" / ") : "unknown",
            doors: primary.aantal_deuren || "unknown",
            color: primary.eerste_kleur || "unknown",
        };
    }

    async function fetchMotonetFI(plate) {
        const p = normalizePlateCompact(plate).toUpperCase();
        const url = `https://www.motonet.fi/api/vehicleInfo/registrationNumber/FI?locale=fi&registrationNumber=${encodeURIComponent(p)}`;
        const data = await httpGetJson(url).catch(() => ({}));
        return data && typeof data === "object" ? data : {};
    }

    async function fetchTrodoIT(plate) {
        const p = normalizePlateCompact(plate).toUpperCase();
        const url = `https://www.trodo.it/rest/V1/partfinder/search/IT/${encodeURIComponent(p)}/1`;
        const xmlText = await httpGetText(url, "application/xml").catch(() => "");
        if (!xmlText) throw new Error("EMPTY");
        if (xmlText.includes("Just a moment")) throw new Error("CAPTCHA_REQUIRED");

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const values = xml.querySelectorAll("values item");

        const info = { manufacturer: "", model: "", variant: "", year: "", fuel: "", engine: "", power: "", vin: "" };

        const vin = xml.querySelector("attributes vin");
        if (vin) info.vin = vin.textContent || "";

        for (const item of values) {
            const labelNode = item.querySelector("label name MagentoFrameworkPhrasetext");
            const dropdownId = item.querySelector("dropdown_id")?.textContent || "";
            if (labelNode) {
                const txt = (labelNode.textContent || "").trim();
                if (dropdownId === "1" && !info.manufacturer) info.manufacturer = txt;
                if (dropdownId === "2" && !info.model) info.model = txt;
                if (dropdownId === "3" && !info.variant) info.variant = txt;
            }
            const yearFrom = item.querySelector("label year_from");
            if (yearFrom && !info.year) info.year = (yearFrom.textContent || "").trim();

            const fuel = item.querySelector("label engine_fuel MagentoFrameworkPhrasetext");
            if (fuel && !info.fuel) info.fuel = (fuel.textContent || "").trim();

            const engine = item.querySelector("label engine");
            if (engine && !info.engine) {
                const engineItems = Array.from(engine.querySelectorAll("item"))
                    .map((n) => (n.textContent || "").trim())
                    .filter(Boolean);
                if (engineItems.length) info.engine = engineItems.join(", ");
            }

            const power = item.querySelector("label kw_ps");
            if (power && !info.power) info.power = (power.textContent || "").trim();
        }
        return info;
    }

    // ---------- Lookup mapping ----------
    const lookupSites = {
        nl: [
            { name: "Finnik", base: "https://finnik.nl/kenteken/" },
            { name: "Finnik (app)", base: "https://app.finnik.nl/home/vehicle_report?license-plate-number=" },
            { name: "Finnik (Centraal Beheer)", base: "https://centraalbeheer.finnik.nl/kenteken/" },
            { name: "Autoweek", base: "https://www.autoweek.nl/kentekencheck/" },
            { name: "voertuig.net", base: "https://voertuig.net/kenteken/" },
            { name: "Kentekencheck.info", base: "https://www.kentekencheck.info/kenteken/" },
            { name: "Kentekencheck.nu", base: "https://www.kentekencheck.nu/kenteken/" },
            { name: "Qenteken", base: "https://www.qenteken.nl/kentekencheck/" },
            { name: "RDW (site)", base: "https://www.rdwdata.nl/kenteken/" },
        ],
        se: [
            { name: "car.info", base: "https://www.car.info/?s=" },
            { name: "biluppgifter.se", base: "https://biluppgifter.se/fordon/" },
            { name: "transportstyrelsen", base: "https://fordon-fu-regnr.transportstyrelsen.se/?ts-regnr-sok=" },
        ],
        ua: [
            { name: "carplates.app", base: "https://ua.carplates.app/en/number/" },
            { name: "baza-gai.com.ua", base: "https://baza-gai.com.ua/nomer/" },
            { name: "auto-inform.com.ua", base: "https://auto-inform.com.ua/search/" },
        ],
        uk: [
            { name: "checkcardetails", base: "https://www.checkcardetails.co.uk/cardetails/" },
            { name: "totalcarcheck", base: "https://totalcarcheck.co.uk/FreeCheck?regno=" },
            { name: "checkhistory", base: "https://checkhistory.uk/vehicle/" },
            { name: "carcheck", base: "https://www.carcheck.co.uk/sendnudes/" },
            { name: "carhistorycheck", base: "https://carhistorycheck.co.uk/confirm-vehicle/?vrm=" },
        ],
        dk: [
            { name: "digitalservicebog.dk", base: "https://app.digitalservicebog.dk/search?country=dk&Registration=" },
            { name: "esyn.dk", base: "https://findsynsrapport.esyn.dk/result?registration=" },
        ],
        no: [
            { name: "vegvesen.no", base: "https://www.vegvesen.no/en/vehicles/buy-and-sell/vehicle-information/check-vehicle-information/?registreringsnummer=" },
            { name: "regnr.info", base: "https://regnr.info/" },
        ],
        fr: [
            { name: "immatriculation-auto.info", base: "https://immatriculation-auto.info/vehicle/" },
            { name: "carter-cash.com", base: "https://www.carter-cash.com/pieces-auto/?plate=", needsHyphen: true },
        ],
        es: [{ name: "carter-cash.es", base: "https://www.carter-cash.es/piezas-auto/?plate=" }],
        fi: [
            { name: "Biltema", base: "https://www.biltema.fi/sv-fi/rekosok-bil/" },
            { name: "Motonet (link)", base: "https://www.motonet.fi/api/vehicleInfo/registrationNumber/FI?locale=fi&registrationNumber=" },
        ],
        cz: [{ name: "uniqa.cz", base: "https://www.uniqa.cz/online/pojisteni-vozidla/#ecvId=" }],
        sk: [
            { name: "overenie.digital", base: "https://overenie.digital/over/sk/ecv/" },
            { name: "stkonline", base: "https://www.stkonline.sk/spz/" },
        ],
        ie: [
            { name: "cartell.ie", base: "https://www.cartell.ie/ssl/servlet/beginStarLookup?registration=" },
            { name: "motorcheck.ie", base: "https://www.motorcheck.ie/free-car-check/?vrm=" },
        ],
        is: [{ name: "island.is", base: "https://island.is/uppfletting-i-oekutaekjaskra?vq=" }],
        it: [{ name: "carter-cash.it", base: "https://www.carter-cash.it/ricambi-auto/?plate=" }],
    };

    function buildMenuItems(info) {
        const country = info.country || "";
        const plateQ = normalizePlateForQuery(info.plate);
        const plateCompact = normalizePlateCompact(info.plate);
        const imgO = info.oImgUrl || "";

        const items = [];

        if (plateQ) {
            items.push({
                label: "Google Images",
                iconHtml: '<i class="fa fa-google"></i>',
                onSelect: () => safeOpen(`https://www.google.com/search?q=%22${encodeURIComponent(plateQ)}%22&udm=2`),
            });
            items.push({
                label: "Autogespot",
                iconHtml: '<i class="fa fa-car"></i>',
                onSelect: () => safeOpen(`https://www.autogespot.com/spots?licenseplate=${encodeURIComponent(plateQ)}`),
            });
        }
        if (imgO) {
            items.push({
                label: "Google Lens",
                iconHtml: '<i class="fa fa-camera"></i>',
                onSelect: () => safeOpen(`https://lens.google.com/upload?ep=fcm&url=${encodeURIComponent(imgO)}`),
            });
        }

        items.push({ label: "— Country lookups —", disabled: true });

        const sites = lookupSites[country] || [];
        for (const s of sites) {
            items.push({
                label: s.name,
                iconHtml: '<i class="fa fa-external-link"></i>',
                disabled: !plateCompact,
                onSelect: () => {
                    let finalPlate = plateCompact;
                    if (country === "fr" && s.needsHyphen) finalPlate = frWithHyphensFromCompact(finalPlate);
                    safeOpen(s.base + encodeURIComponent(finalPlate));
                },
            });
        }

        if (country === "nl") {
            items.push({
                label: "RDW (API)",
                iconHtml: '<i class="fa fa-database"></i>',
                disabled: !plateCompact,
                onSelect: async () => {
                    const infoR = await fetchRDW(info.plate).catch(() => null);
                    const title = `<span>RDW (API): <span style="opacity:.75">${escHtml(plateCompact)}</span></span>`;
                    if (!infoR) {
                        makeFloatWindow("pmx-rdw-win", title, [["Error", "No data"]]);
                        return;
                    }
                    makeFloatWindow("pmx-rdw-win", title, [
                        ["Make", infoR.make],
                        ["Model", infoR.model],
                        ["Variant", infoR.variant],
                        ["First registration", infoR.yFirst],
                        ["First registration in NL", infoR.yNL],
                        ["Fuel", infoR.fuel],
                        ["Doors", infoR.doors],
                        ["Color", infoR.color],
                    ]);
                },
            });
        }

        if (country === "fi") {
            items.push({
                label: "Motonet (API)",
                iconHtml: '<i class="fa fa-database"></i>',
                disabled: !plateCompact,
                onSelect: async () => {
                    const data = await fetchMotonetFI(info.plate).catch(() => ({}));
                    const title = `<span>Motonet (API): <span style="opacity:.75">${escHtml(plateCompact)}</span></span>`;
                    const makeModel = `${data.manufacturerName || ""} ${data.model || ""}`.trim() || "unknown";
                    makeFloatWindow("pmx-fi-win", title, [
                        ["Make/Model", makeModel],
                        ["Type", data.type || ""],
                        ["VIN", data.VIN || ""],
                        ["Registration date", data.registrationDate || ""],
                        ["Fuel", data.fuel || ""],
                        [
                            "Power",
                            (data.powerKw || data.powerHp)
                                ? `${data.powerKw ?? ""}${data.powerKw ? " kW" : ""}${data.powerKw && data.powerHp ? " / " : ""}${data.powerHp ?? ""}${data.powerHp ? " hp" : ""}`
                                : "",
                        ],
                    ]);
                },
            });
        }

        if (country === "it") {
            items.push({
                label: "Trodo (API)",
                iconHtml: '<i class="fa fa-database"></i>',
                disabled: !plateCompact,
                onSelect: async () => {
                    try {
                        const data = await fetchTrodoIT(info.plate);
                        const title = `<span>Trodo (API): <span style="opacity:.75">${escHtml(plateCompact)}</span></span>`;
                        const makeModel = `${data.manufacturer || ""} ${data.model || ""}`.trim() || "unknown";
                        makeFloatWindow("pmx-trodo-win", title, [
                            ["Make/Model", makeModel],
                            ["Variant", data.variant || ""],
                            ["Year", data.year || ""],
                            ["Fuel", data.fuel || ""],
                            ["Engine", data.engine || ""],
                            ["Power", data.power || ""],
                            ["VIN", data.vin || ""],
                        ]);
                    } catch (e) {
                        if (String(e?.message || "") === "CAPTCHA_REQUIRED") {
                            makeFloatWindow("pmx-trodo-win", "Trodo (API)", [["Blocked", "Cloudflare captcha — use Trodo (link) instead."]]);
                        } else {
                            makeFloatWindow("pmx-trodo-win", "Trodo (API)", [["Error", "No data"]]);
                        }
                    }
                },
            });
            items.push({
                label: "Trodo (link)",
                iconHtml: '<i class="fa fa-external-link"></i>',
                disabled: !plateCompact,
                onSelect: () => safeOpen(`https://www.trodo.it/rest/V1/partfinder/search/IT/${encodeURIComponent(plateCompact)}/1`),
            });
        }

        if (imgO) items.push({ label: "Open hi-res image", iconHtml: '<i class="fa fa-image"></i>', onSelect: () => safeOpen(imgO) });

        return items;
    }

    // ---------- Zoom lens (per tile, now controlled globally) ----------
    const zoomState = new WeakMap();

    function ensureImageWrapper(img) {
        const parent = img.parentElement;
        if (!parent) return null;
        if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
        return parent;
    }

    function enableLens(tileInfo) {
        if (!tileInfo.mImg || !tileInfo.mImgUrl || !/\/m\//.test(tileInfo.mImgUrl)) return;
        if (!tileInfo.oImgUrl) return;

        const tile = tileInfo.tile;
        const current = zoomState.get(tile) || {};
        if (current.enabled) return;

        const img = tileInfo.mImg;
        const wrap = ensureImageWrapper(img);
        if (!wrap) return;

        const lens = document.createElement("div");
        lens.className = "pmx-lens";
        lens.style.position = "absolute";
        lens.style.width = "140px";
        lens.style.height = "140px";
        lens.style.borderRadius = "50%";
        lens.style.border = "2px solid rgba(0,0,0,0.35)";
        lens.style.boxShadow = "0 10px 22px rgba(0,0,0,0.25)";
        lens.style.pointerEvents = "none";
        lens.style.display = "none";
        lens.style.backgroundImage = `url("${tileInfo.oImgUrl}")`;
        lens.style.backgroundRepeat = "no-repeat";
        lens.style.backgroundColor = "#fff";

        wrap.appendChild(lens);

        const zoom = 3;

        function move(e) {
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const cx = Math.max(0, Math.min(x, rect.width));
            const cy = Math.max(0, Math.min(y, rect.height));

            const lw = lens.offsetWidth || 140;
            const lh = lens.offsetHeight || 140;

            const wrapRect = wrap.getBoundingClientRect();
            const left = e.clientX - wrapRect.left - lw / 2;
            const top = e.clientY - wrapRect.top - lh / 2;

            lens.style.left = `${left}px`;
            lens.style.top = `${top}px`;

            const bgW = rect.width * zoom;
            const bgH = rect.height * zoom;
            lens.style.backgroundSize = `${bgW}px ${bgH}px`;

            const bx = -(cx * zoom - lw / 2);
            const by = -(cy * zoom - lh / 2);
            lens.style.backgroundPosition = `${bx}px ${by}px`;
        }

        function enter() {
            lens.style.display = "block";
        }
        function leave() {
            lens.style.display = "none";
        }

        img.addEventListener("mousemove", move);
        img.addEventListener("mouseenter", enter);
        img.addEventListener("mouseleave", leave);

        zoomState.set(tile, { enabled: true, img, lens, move, enter, leave });
    }

    function disableLens(tile) {
        const st = zoomState.get(tile);
        if (!st?.enabled) return;
        try {
            st.img.removeEventListener("mousemove", st.move);
            st.img.removeEventListener("mouseenter", st.enter);
            st.img.removeEventListener("mouseleave", st.leave);
        } catch {}
        try {
            st.lens?.remove();
        } catch {}
        zoomState.set(tile, { enabled: false });
    }

    function applyZoomToAllTiles(enabled) {
        const tiles = qsa(".col-sm-6.col-xs-12");
        for (const tile of tiles) {
            const info = parseTile(tile);
            if (enabled) enableLens(info);
            else disableLens(tile);
        }
    }

    // ---------- Inject per-tile controls ----------
    function processTile(tile) {
        if (tile.dataset.pmxDone === "1") {
            const zoomOn = !!gmGet(ZOOM_KEY, false);
            const info = parseTile(tile);
            if (zoomOn) enableLens(info);
            else disableLens(tile);

            if (info.editForm) enhanceModeratorEditForm(info.editForm);
            return;
        }

        const info = parseTile(tile);

        injectForumWarningButton(info);

        if (!info.editForm) {
            tile.dataset.pmxDone = "1";
            return;
        }

        enhanceModeratorEditForm(info.editForm);

        const infoBtn = makeBtn({
            className: "btn-u btn-u-dark btn-u-xs pull-right pmx-infobtn",
            title: "Lookup / info",
            html: "Tools",
            onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                const items = buildMenuItems(info);
                showMenuNearButton(infoBtn, items);
            },
        });

        info.editForm.after(infoBtn);
        const zoomOn = !!gmGet(ZOOM_KEY, false);
        if (zoomOn) enableLens(info);

        tile.dataset.pmxDone = "1";
    }

    function runModeratorPass() {
        const tiles = qsa(".col-sm-6.col-xs-12").slice(0, 10);
        for (const t of tiles) processTile(t);
    }

    function teardownModeratorPass() {
        closeAllMenus();
        closeEditOverlay();

        qsa(".pmx-infobtn").forEach((b) => b.remove());
        qsa(".pmx-forumwarn").forEach((a) => a.remove());

        qsa(".col-sm-6.col-xs-12").forEach((tile) => {
            disableLens(tile);
            delete tile.dataset.pmxDone;
        });

        ["pmx-rdw-win", "pmx-fi-win", "pmx-trodo-win"].forEach((id) => qs("#" + id)?.remove());
    }

    // ---------- Boot ----------
    const { moderatorEnabled } = injectModeratorToggle();
    if (!moderatorEnabled) return;

    runModeratorPass();
    applyZoomToAllTiles(!!gmGet(ZOOM_KEY, false));

    const mo = new MutationObserver(() => {
        if (!gmGet(MODERATOR_KEY, false)) return;
        runModeratorPass();
        if (gmGet(ZOOM_KEY, false)) applyZoomToAllTiles(true);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener("scroll", () => closeAllMenus(), { passive: true });
})();

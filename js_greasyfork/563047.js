// ==UserScript==
// @name         Platesmania Gallery Moderator Mode Toolbox
// @version      2.3.3
// @description  Couple enhancements for moderator workflow.
// @match        https://platesmania.com/*gallery*
// @match        https://platesmania.com/*/nomer*
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


// known Issues:
// - Brand/model selection on /nomer pages not working correctly.


(() => {
    "use strict";

    GM_addStyle(`
  .pmx-infobtn {
    margin-right: 6px;
  }
    .row > .col-xs-6.vcenter:first-child {
    width: 30%;
  }

  .row > .col-xs-6.vcenter:last-child {
    width: 70%;
  }
  i.sprite.pull-right {
  margin-left: 8px;
}
.pmx-edit-popup {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}
.pmx-edit-popup-content {
  width: 70vw;
  max-height: 90vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 16px 44px rgba(0,0,0,0.30);
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.pmx-edit-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  background: #f8f9fa;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
.pmx-edit-popup-title {
  font-weight: 700;
  font-size: 14px;
}
.pmx-edit-popup-close {
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  line-height: 22px;
  padding: 0 4px;
}
.pmx-edit-popup-body {
  padding: 20px;
  flex: 1 1 auto;
  overflow: auto;
}
.ui-autocomplete,
.ui-menu,
.ui-widget-content.ui-autocomplete {
  z-index: 1000001 !important;
}
.ui-autocomplete-input {
  z-index: 1000000 !important;
}
.pmx-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #fff;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
.pmx-loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: pmx-spin 1s linear infinite;
  margin-bottom: 15px;
}
@keyframes pmx-spin {
  to { transform: rotate(360deg); }
}
.pmx-loading-text {
  font-size: 16px;
  font-weight: 500;
}
`);

    const MODERATOR_KEY = "pm_moderator_mode_enabled";
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

    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function getCurrentPageInfo() {
        const href = window.location.href || "";
        const pathname = window.location.pathname || "";
        const nomerMatch = pathname.match(/^\/([a-z]{2,4})\/nomer(\d+)/i);
        if (nomerMatch) {
            return {
                isNomerPage: true,
                id: nomerMatch[2],
                param: pathname,
                country: nomerMatch[1].toLowerCase()
            };
        }
        return {
            isNomerPage: false,
            id: "",
            param: "",
            country: ""
        };
    }

    function safeOpen(url) {
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

    function httpPost(url, data) {
        return new Promise((resolve, reject) => {
            const formData = new URLSearchParams();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest({
                    method: "POST",
                    url,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data: formData.toString(),
                    onload: (res) => resolve(res.responseText),
                    onerror: reject,
                });
            } else {
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData.toString(),
                })
                    .then((r) => r.text())
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    function escHtml(s) {
        return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

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
            setZoomVisible(cbMod.checked);

            if (cbMod.checked) {
                const pageInfo = getCurrentPageInfo();
                if (pageInfo.isNomerPage) {
                    processNomerPage();
                } else {
                    runModeratorPass();
                    applyZoomToAllTiles(!!gmGet(ZOOM_KEY, false));
                }
            } else {
                if (getCurrentPageInfo().isNomerPage) {
                    teardownNomerPage();
                } else {
                    teardownModeratorPass();
                }
            }
        });

        cbZoom.addEventListener("change", () => {
            gmSet(ZOOM_KEY, cbZoom.checked);
            if (gmGet(MODERATOR_KEY, false)) {
                const pageInfo = getCurrentPageInfo();
                if (pageInfo.isNomerPage) {
                    applyZoomToNomerPage(cbZoom.checked);
                } else {
                    applyZoomToAllTiles(cbZoom.checked);
                }
            }
        });

        return { moderatorEnabled, zoomEnabled };
    }

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

        const ADMIN_PREFIX = "https://platesmania.com/admin/";

        let baselineSet = false;

        iframe.addEventListener("load", () => {
            try {
                const href = iframe.contentWindow?.location?.href || "";
                if (!href) return;

                if (!baselineSet) {
                    if (href === "about:blank") return;
                    baselineSet = true;
                    return;
                }

                if (!href.startsWith(ADMIN_PREFIX)) {
                    closeEditOverlay();
                }
            } catch {}
        });

        panel.appendChild(header);
        panel.appendChild(iframe);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        return overlay;
    }

    const SEARCH_IFRAME_ID = "pmx-search-overlay";
    const SEARCH_IFRAME_NAME = "pmx_search_iframe_target";

    function closeSearchOverlay() {
        const el = qs("#" + SEARCH_IFRAME_ID);
        if (el) el.remove();
    }

    function ensureSearchOverlay() {
        let overlay = qs("#" + SEARCH_IFRAME_ID);
        if (overlay) return overlay;

        overlay = document.createElement("div");
        overlay.id = SEARCH_IFRAME_ID;
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "999999";
        overlay.style.background = "rgba(0,0,0,0.35)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.addEventListener("mousedown", (e) => {
            if (e.target === overlay) closeSearchOverlay();
        });

        const panel = document.createElement("div");
        panel.style.width = "80vw";
        panel.style.height = "80vh";
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
        title.textContent = "Double spots";
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
        close.addEventListener("click", closeSearchOverlay);

        header.appendChild(title);
        header.appendChild(close);

        const iframe = document.createElement("iframe");
        iframe.name = SEARCH_IFRAME_NAME;
        iframe.style.border = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.flex = "1 1 auto";

        // Hide annoying elements inside the iframe after every load
        iframe.addEventListener("load", () => {
            try {
                const doc = iframe.contentDocument;
                if (!doc) return;

                // Option 1: Inject CSS (fast + persistent-ish)
                const style = doc.createElement("style");
                style.textContent = `
        .bg-info.text-center[style*="width: 100%"] { display: none !important; }
        .header { display: none !important; }
        div[style*="height: 112px"][style*="clear: both"] { display: none !important; }
        .breadcrumbs { display: none !important; }

        /* new stuff */
        .col-md-3 { display: none !important; }
        .row.no-margin { display: none !important; }
        .text-center > ul.pagination { display: none !important; }
        .footer-v1 { display: none !important; }

        small span.text-highlights.text-highlights-blue { display: none !important; }

        /* hide the whole <small> block that contains that span */
        small:has(span.text-highlights.text-highlights-blue) { display: none !important; }

        /* optional: remove top padding gaps */
        body { padding-top: 0 !important; }
        `;
                doc.head?.appendChild(style);

                // Option 2: Also brute-force hide by querying
                const kill = (el) => { if (el) el.style.setProperty("display", "none", "important"); };

                kill(doc.querySelector('.bg-info.text-center[style*="width: 100%"]'));
                kill(doc.querySelector(".header"));
                kill(doc.querySelector('div[style*="height: 112px"][style*="clear: both"]'));
                kill(doc.querySelector(".breadcrumbs"));

                // new stuff
                kill(doc.querySelector(".col-md-3"));
                kill(doc.querySelector(".row.no-margin"));
                kill(doc.querySelector(".text-center ul.pagination"));
                kill(doc.querySelector(".footer-v1"));

                const lastBadge = doc.querySelector('small span.text-highlights.text-highlights-blue');
                if (lastBadge) kill(lastBadge.closest("small"));
            } catch {
                // silently fail on cross-origin
            }
        });


        panel.appendChild(header);
        panel.appendChild(iframe);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        return overlay;
    }

    function openSearchInIframe(url) {
        ensureSearchOverlay();
        const iframe = qs(`#${SEARCH_IFRAME_ID} iframe[name="${SEARCH_IFRAME_NAME}"]`);
        if (iframe) iframe.src = url;
    }


    function submitFormToTarget(form, targetName) {
        const prevTarget = form.getAttribute("target");
        form.setAttribute("target", targetName);
        try {
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
        if (!w) return;

        try {
            w.focus();
        } catch {}

        submitFormToTarget(form, EDIT_POPUP_NAME);
    }

    function enhanceModeratorEditForm(form) {
        if (!form || form.dataset.pmxEditEnhanced === "1") return;

        const btn = qs('button[type="submit"], input[type="submit"]', form);
        if (!btn) {
            form.dataset.pmxEditEnhanced = "1";
            return;
        }

        form.addEventListener(
            "submit",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditInIframe(form);
            },
            true
        );

        btn.addEventListener(
            "click",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                openEditInIframe(form);
            },
            true
        );

        const dup = document.createElement("button");
        dup.type = "button";
        dup.className = btn.className;
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

        const mImg = qs('img[src*="/m/"]', tile) || qs("img.img-responsive", tile);
        const mImgUrl = mImg?.getAttribute("src") || "";
        const oImgUrl = mImgUrl && /\/m\//.test(mImgUrl) ? mImgUrl.replace(/\/m\//, "/o/") : "";

        const editForm = qs('form[action="/admin/edit_new.php"]', tile);

        const tagsLi = qs('li.pull-right > i.fa.fa-tags.tooltips', tile);
        const tagsTitle = tagsLi?.getAttribute("data-original-title") || tagsLi?.getAttribute("title") || "";
        const hasNewLetterTag = tagsTitle.toLowerCase().includes("new letter combination");

        return { tile, href, country, photoId, username, userId, plate, mImg, mImgUrl, oImgUrl, editForm, tagsLi, hasNewLetterTag };
    }

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

    // New letter combination check functions
    function isGermanOrDutchPage() {
        const pathname = window.location.pathname || "";
        const search = window.location.search || "";

        const deNlMatch = pathname.match(/^\/(de|nl)\//i);
        if (deNlMatch) return deNlMatch[1].toLowerCase();

        const countryMatch = search.match(/country(?:\[0\]|%5B0%5D)=([0-9]+)/i);
        if (countryMatch) {
            const countryId = countryMatch[1];
            if (countryId === "6") return "de";
            if (countryId === "24") return "nl";
        }

        try {
            const searchParams = new URLSearchParams(search);
            const countryParam = searchParams.get("country[0]");
            if (countryParam === "6") return "de";
            if (countryParam === "24") return "nl";
        } catch (e) {}

        return null;
    }

    function extractPlateFromNomerPage() {
        const h1 = qs("h1.pull-left");
        if (!h1) return null;
        return (h1.textContent || "").trim();
    }

    async function checkNewLetterCombination(nomerUrl) {
        if (!nomerUrl) {
            console.log("[New Letter Check] No nomer URL provided");
            return null;
        }

        const isCurrentPage = window.location.href === nomerUrl || window.location.href.replace(/\/$/, '') === nomerUrl.replace(/\/$/, '');
        let nomerDoc;

        if (isCurrentPage) {
            console.log("[New Letter Check] Using current page document (already on nomer page)");
            nomerDoc = document;
        } else {
            console.log("[New Letter Check] Fetching nomer page:", nomerUrl);
            try {
                const nomerHtml = await httpGetText(nomerUrl);
                console.log("[New Letter Check] Nomer page fetched, length:", nomerHtml.length);

                const nomerParser = new DOMParser();
                nomerDoc = nomerParser.parseFromString(nomerHtml, "text/html");
            } catch (e) {
                console.error("[New Letter Check] Error fetching nomer page:", e);
                return null;
            }
        }

        try {
            const allTableIcons = nomerDoc.querySelectorAll('i.fa-table, i.fa.fa-table, i[class*="fa-table"]');

            if (allTableIcons.length === 0) {
                console.log("[New Letter Check] No fa-table icon found on nomer page");
                const fallbackLink = nomerDoc.querySelector('a[href*="result_"]');
                if (fallbackLink) {
                    console.log("[New Letter Check] Found fallback result link:", fallbackLink.getAttribute("href"));
                    const tableHref = fallbackLink.getAttribute("href");
                    const tableUrl = new URL(tableHref, nomerUrl).href;
                    console.log("[New Letter Check] Using fallback table URL:", tableUrl);
                    const tableHtml = await httpGetText(tableUrl);
                    console.log("[New Letter Check] Table page fetched, length:", tableHtml.length);
                    const tableParser = new DOMParser();
                    const tableDoc = tableParser.parseFromString(tableHtml, "text/html");
                    const numberElement = tableDoc.querySelector("span.text-highlights.text-highlights-light-green");
                    const photoCount = numberElement ? parseInt(numberElement.textContent) : null;
                    console.log("[New Letter Check] Photo count found:", photoCount);
                    const isNewCombination = photoCount === 1;
                    console.log("[New Letter Check] Is new combination:", isNewCombination);
                    const fallbackTableName = (fallbackLink.textContent || "").trim().replace(/^Table of\s+/i, "").trim();
                    return { isNewCombination, tableUrl, tableName: fallbackTableName };
                }
                return { error: "no_table" };
            }

            console.log("[New Letter Check] Found", allTableIcons.length, "fa-table icon(s)");

            let tableLink = null;

            for (const tableIcon of allTableIcons) {
                let candidateLink = null;

                const parent = tableIcon.parentElement;
                if (parent) {
                    candidateLink = parent.querySelector('a[href*="result"]');
                }

                if (!candidateLink) {
                    let next = tableIcon.nextElementSibling;
                    while (next && (next.nodeType !== 1 || next.tagName !== 'A')) {
                        if (next.tagName === 'A') {
                            candidateLink = next;
                            break;
                        }
                        next = next.nextElementSibling;
                    }
                    if (next && next.tagName === 'A') {
                        candidateLink = next;
                    }
                }

                if (!candidateLink) {
                    candidateLink = tableIcon.closest('a');
                }

                if (candidateLink && candidateLink.tagName === 'A') {
                    const href = candidateLink.getAttribute("href") || "";
                    const hrefLower = href.toLowerCase();

                    if (href.includes("result") ||
                        (href.includes("series-") && !href.includes("series.php")) ||
                        (href.match(/^[^\/]*-[^\/]+$/) && !href.includes("series.php"))) {
                        tableLink = candidateLink;
                        console.log("[New Letter Check] Found specific table link:", href);
                        break;
                    } else if (!tableLink && !href.includes("series.php")) {
                        tableLink = candidateLink;
                        console.log("[New Letter Check] Found potential table link:", href);
                    }
                }
            }

            if (!tableLink || tableLink.tagName !== 'A') {
                console.log("[New Letter Check] No valid table link found");
                return { error: "no_table" };
            }

            console.log("[New Letter Check] Found table link element:", tableLink.outerHTML?.substring(0, 200));

            const tableHref = tableLink.getAttribute("href");
            if (!tableHref) {
                console.log("[New Letter Check] Table link found but no href attribute");
                return { error: "no_table" };
            }

            console.log("[New Letter Check] Found table link href:", tableHref);

            const tableUrl = new URL(tableHref, nomerUrl).href;
            console.log("[New Letter Check] Resolved table URL:", tableUrl);

            console.log("[New Letter Check] Fetching table page:", tableUrl);
            const tableHtml = await httpGetText(tableUrl);
            console.log("[New Letter Check] Table page fetched, length:", tableHtml.length);

            const tableParser = new DOMParser();
            const tableDoc = tableParser.parseFromString(tableHtml, "text/html");

            const numberElement = tableDoc.querySelector("span.text-highlights.text-highlights-light-green");
            const photoCount = numberElement ? parseInt(numberElement.textContent) : null;

            console.log("[New Letter Check] Photo count found:", photoCount);

            const isNewCombination = photoCount === 1;
            console.log("[New Letter Check] Is new combination:", isNewCombination);

            const tableLinkText = (tableLink.textContent || "").trim();
            const tableName = tableLinkText.replace(/^Table of\s+/i, "").trim();

            return { isNewCombination, tableUrl, tableName };
        } catch (e) {
            console.error("[New Letter Check] Error checking letter combination:", e);
            console.error("[New Letter Check] Error stack:", e.stack);
            return null;
        }
    }

    function getUserInfo() {
        const loginbar = qs("ul.loginbar");
        if (!loginbar) return null;

        const userLink = qs('a[href^="/user"]', loginbar);
        if (!userLink) return null;

        const userHref = userLink.getAttribute("href") || "";
        const userId = (userHref.match(/^\/user(\d+)/) || [])[1] || "";
        const username = (userLink.textContent || "").trim();

        return { username, userId };
    }

    function getTagsFromNomerPage() {
        const tags = qsa('span.label.rounded.label-light > a[href*="tags="]');
        const tagTexts = Array.from(tags).map(a => (a.textContent || "").trim().toLowerCase());
        const hasInLabels = tagTexts.some(t => t.includes("new letter combination"));

        const tagsIcon = qs('i.fa.fa-tags.tooltips');
        if (tagsIcon) {
            const tooltip = (tagsIcon.getAttribute("data-original-title") || tagsIcon.getAttribute("title") || "").toLowerCase();
            if (tooltip.includes("new letter combination")) return true;
        }

        return hasInLabels;
    }

    async function updateTag(nomer, table, user, userid, shouldHaveTag) {
        const url = "https://platesmania.com/admin/tags_edit_1b.php";
        const data = {
            nomer: nomer,
            table: table,
            user: user,
            userid: userid
        };

        // Fetch the edit form to get existing checked tags
        const param = `/${table}/nomer${nomer}`;
        const html = await fetchEditForm(nomer, param);

        if (html) {
            // Parse the HTML to extract all checked checkboxes
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Find all checked checkboxes in the tags section
            const checkedCheckboxes = doc.querySelectorAll('input[type="checkbox"][name^="CheckBox"]:checked');
            checkedCheckboxes.forEach((checkbox) => {
                const name = checkbox.getAttribute("name");
                if (name) {
                    data[name] = "on";
                }
            });
        } else {
            console.warn("Could not fetch edit form to preserve existing tags. Existing tags may be removed.");
        }

        // If shouldHaveTag is true, ensure CheckBox[13] is included
        if (shouldHaveTag) {
            data["CheckBox[13]"] = "on";
        } else {
            // If shouldHaveTag is false, remove CheckBox[13] if it was included from existing tags
            delete data["CheckBox[13]"];
        }

        try {
            const response = await httpPost(url, data);
            return true;
        } catch (e) {
            console.error("Error updating tag:", e);
            return false;
        }
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

    let activeMenuCleanup = null;

    function injectDoubleSpotSearchLink(tileInfo) {
        const tile = tileInfo.tile;
        if (!tile) return;

        // Find the "double spot" indicator icon inside THIS tile only
        const icon = Array.from(tile.querySelectorAll('li.pull-right > i.fa.fa-automobile.tooltips'))
        .find(i => (i.getAttribute("data-original-title") || i.getAttribute("title") || "").toLowerCase().includes("plate"))
        || tile.querySelector('li.pull-right > i.fa.fa-automobile.tooltips');
        if (!icon) return;

        // If it's already wrapped in a link, do nothing
        if (icon.closest("a")) return;

        const country = (tileInfo.country || "").trim();
        const plate = (tileInfo.plate || "").trim();
        if (!country || !plate) return;

        const url = `https://platesmania.com/${encodeURIComponent(country)}/gallery.php?fastsearch=${encodeURIComponent(plate)}`;

        const a = document.createElement("a");
        a.href = "#";
        a.style.color = "inherit";
        a.style.textDecoration = "none";
        a.title = icon.getAttribute("data-original-title") || "Show double spots";

        a.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSearchInIframe(url);
        });

        icon.parentNode.insertBefore(a, icon);
        a.appendChild(icon);

    }

    function injectNewLetterCombinationCheckGallery(tileInfo) {
        const tile = tileInfo.tile;
        if (!tile) return;

        // Check if icon already exists
        if (tile.querySelector(".pmx-newletter-check")) return;

        const listInline = qs("ul.list-inline", tile);
        if (!listInline) return;

        const imgLink = qs('a[href*="/nomer"] > img.img-responsive.center-block', tile)?.closest('a[href*="/nomer"]');
        if (!imgLink) {
            console.log("[New Letter Check] No image link found in tile");
            return;
        }

        const nomerHref = imgLink.getAttribute("href");
        if (!nomerHref) {
            console.log("[New Letter Check] Image link found but no href attribute");
            return;
        }

        // Resolve to full URL
        const nomerUrl = new URL(nomerHref, window.location.origin).href;
        console.log("[New Letter Check] Extracted nomer URL from gallery tile:", nomerUrl);

        const photoId = tileInfo.photoId;
        if (!photoId) return;

        const country = tileInfo.country;

        const li = document.createElement("li");
        li.className = "pmx-newletter-check";

        const icon = document.createElement("i");
        icon.className = "fa fa-check-circle tooltips";
        icon.setAttribute("data-toggle", "tooltip");
        icon.setAttribute("data-placement", "left");
        icon.setAttribute("data-original-title", "Check if first in table");
        icon.style.cursor = "pointer";
        icon.style.color = "#999";

        const statusSpan = document.createElement("span");
        statusSpan.className = "pmx-newletter-status";
        statusSpan.style.marginLeft = "5px";
        statusSpan.style.fontSize = "12px";

        let isChecking = false;

        icon.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isChecking) return;
            isChecking = true;

            console.log("[New Letter Check] Starting check for gallery tile, nomerUrl:", nomerUrl);

            icon.style.color = "#999";
            statusSpan.textContent = "Checking...";
            statusSpan.style.color = "#999";

            const result = await checkNewLetterCombination(nomerUrl);
            isChecking = false;

            if (result === null) {
                statusSpan.textContent = "Error";
                statusSpan.style.color = "#d9534f";
                const existingFix = li.querySelector(".pmx-newletter-fix");
                if (existingFix) existingFix.remove();
                const existingTableLink = li.querySelector(".pmx-newletter-table-link");
                if (existingTableLink) existingTableLink.remove();
                return;
            }

            if (result.error === "no_table") {
                icon.style.color = "#d9534f";
                statusSpan.textContent = "No letter combination table found.";
                statusSpan.style.color = "#d9534f";
                const existingFix = li.querySelector(".pmx-newletter-fix");
                if (existingFix) existingFix.remove();
                const existingTableLink = li.querySelector(".pmx-newletter-table-link");
                if (existingTableLink) existingTableLink.remove();
                return;
            }

            const isNew = result.isNewCombination;
            const tableUrl = result.tableUrl;
            const tableName = result.tableName || "table";
            const hasTag = tileInfo.hasNewLetterTag;

            if (isNew) {
                icon.style.color = "#5cb85c";
                statusSpan.textContent = `First in ${tableName} table`;
                statusSpan.style.color = "#5cb85c";
            } else {
                icon.style.color = "#d9534f";
                statusSpan.textContent = `Not first in ${tableName} table`;
                statusSpan.style.color = "#d9534f";
            }

            const existingFix = li.querySelector(".pmx-newletter-fix");
            if (existingFix) existingFix.remove();
            const existingTableLink = li.querySelector(".pmx-newletter-table-link");
            if (existingTableLink) existingTableLink.remove();

            if (tableUrl) {
                const tableLink = document.createElement("a");
                tableLink.className = "pmx-newletter-table-link";
                tableLink.href = tableUrl;
                tableLink.target = "_blank";
                tableLink.style.marginLeft = "8px";
                tableLink.style.color = "#337ab7";
                tableLink.style.textDecoration = "underline";
                tableLink.style.cursor = "pointer";
                tableLink.textContent = "⎘ Letter combination table";
                li.appendChild(tableLink);
            }

            if (isNew && !hasTag) {
                const fixLink = document.createElement("a");
                fixLink.className = "pmx-newletter-fix";
                fixLink.href = "#";
                fixLink.style.marginLeft = "8px";
                fixLink.style.color = "#337ab7";
                fixLink.style.textDecoration = "underline";
                fixLink.style.cursor = "pointer";
                fixLink.textContent = "Add new letter combination tag";

                fixLink.addEventListener("click", async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const userInfo = getUserInfo();
                    if (!userInfo) {
                        alert("Could not get user information");
                        return;
                    }

                    fixLink.textContent = "Updating...";
                    fixLink.style.pointerEvents = "none";

                    const success = await updateTag(photoId, country, userInfo.username, userInfo.userId, true);

                    if (success) {
                        fixLink.textContent = "Updated!";
                        fixLink.style.color = "#5cb85c";
                        // Update the tag status in the tile info
                        tileInfo.hasNewLetterTag = true;
                        // Hide the fix link after a short delay
                        setTimeout(() => {
                            fixLink.style.display = "none";
                        }, 2000);
                    } else {
                        fixLink.textContent = "Error";
                        fixLink.style.color = "#d9534f";
                        fixLink.style.pointerEvents = "auto";
                    }
                });

                li.appendChild(fixLink);
            } else if (!isNew && hasTag) {
                const messageSpan = document.createElement("span");
                messageSpan.className = "pmx-newletter-fix";
                messageSpan.style.marginLeft = "8px";
                messageSpan.style.color = "#d9534f";
                messageSpan.style.fontStyle = "italic";
                messageSpan.textContent = `Not first in ${tableName} table, but tag has been set. Please manually check if this was the first photo of the table.`;
                li.appendChild(messageSpan);
            }
        });

        li.appendChild(icon);
        li.appendChild(statusSpan);
        listInline.appendChild(li);
    }

    function injectNewLetterCombinationCheckNomer() {
        const pageInfo = getCurrentPageInfo();
        if (!pageInfo.isNomerPage || !pageInfo.id) return;

        const buttonContainer = qs("div.col-xs-8.no-padding");
        if (!buttonContainer) return;

        if (buttonContainer.querySelector(".pmx-newletter-check-btn")) return;

        const nomerUrl = window.location.href;

        const button = document.createElement("button");
        button.className = "btn-u pmx-newletter-check-btn";
        button.type = "button";
        button.innerHTML = '<i data-toggle="tooltip" class="fa fa-check-circle tooltips" data-original-title="Check if first in table"></i>';

        const statusSpan = document.createElement("span");
        statusSpan.className = "pmx-newletter-status";
        statusSpan.style.marginLeft = "8px";
        statusSpan.style.fontSize = "12px";

        let isChecking = false;

        button.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isChecking) return;
            isChecking = true;

            console.log("[New Letter Check] Starting check for nomer page, nomerUrl:", nomerUrl);

            statusSpan.textContent = "Checking...";
            statusSpan.style.color = "#999";

            const result = await checkNewLetterCombination(nomerUrl);
            isChecking = false;

            if (result === null) {
                statusSpan.textContent = "Error";
                statusSpan.style.color = "#d9534f";
                const existingFix = buttonContainer.querySelector(".pmx-newletter-fix");
                if (existingFix) existingFix.remove();
                const existingTableLink = buttonContainer.querySelector(".pmx-newletter-table-link");
                if (existingTableLink) existingTableLink.remove();
                return;
            }

            if (result.error === "no_table") {
                statusSpan.textContent = "No letter combination table found.";
                statusSpan.style.color = "#d9534f";
                const existingFix = buttonContainer.querySelector(".pmx-newletter-fix");
                if (existingFix) existingFix.remove();
                const existingTableLink = buttonContainer.querySelector(".pmx-newletter-table-link");
                if (existingTableLink) existingTableLink.remove();
                return;
            }

            const isNew = result.isNewCombination;
            const tableUrl = result.tableUrl;
            const tableName = result.tableName || "table";
            const hasTag = getTagsFromNomerPage();

            if (isNew) {
                statusSpan.textContent = `First in ${tableName} table`;
                statusSpan.style.color = "#5cb85c";
            } else {
                statusSpan.textContent = `Not first in ${tableName} table`;
                statusSpan.style.color = "#d9534f";
            }

            const existingFix = buttonContainer.querySelector(".pmx-newletter-fix");
            if (existingFix) existingFix.remove();
            const existingTableLink = buttonContainer.querySelector(".pmx-newletter-table-link");
            if (existingTableLink) existingTableLink.remove();

            if (tableUrl) {
                const tableLink = document.createElement("a");
                tableLink.className = "pmx-newletter-table-link";
                tableLink.href = tableUrl;
                tableLink.target = "_blank";
                tableLink.style.marginLeft = "8px";
                tableLink.style.color = "#337ab7";
                tableLink.style.textDecoration = "underline";
                tableLink.style.cursor = "pointer";
                tableLink.textContent = "⎘ Letter combination table";
                buttonContainer.appendChild(tableLink);
            }

            if (isNew && !hasTag) {
                const fixLink = document.createElement("a");
                fixLink.className = "pmx-newletter-fix";
                fixLink.href = "#";
                fixLink.style.marginLeft = "8px";
                fixLink.style.color = "#337ab7";
                fixLink.style.textDecoration = "underline";
                fixLink.style.cursor = "pointer";
                fixLink.textContent = "Add new letter combination tag";

                fixLink.addEventListener("click", async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const userInfo = getUserInfo();
                    if (!userInfo) {
                        alert("Could not get user information");
                        return;
                    }

                    fixLink.textContent = "Updating...";
                    fixLink.style.pointerEvents = "none";

                    const success = await updateTag(pageInfo.id, pageInfo.country, userInfo.username, userInfo.userId, true);

                    if (success) {
                        fixLink.textContent = "Updated!";
                        fixLink.style.color = "#5cb85c";
                        setTimeout(() => {
                            fixLink.style.display = "none";
                        }, 2000);
                    } else {
                        fixLink.textContent = "Error";
                        fixLink.style.color = "#d9534f";
                        fixLink.style.pointerEvents = "auto";
                    }
                });

                buttonContainer.appendChild(fixLink);
            } else if (!isNew && hasTag) {
                const messageSpan = document.createElement("span");
                messageSpan.className = "pmx-newletter-fix";
                messageSpan.style.marginLeft = "8px";
                messageSpan.style.color = "#d9534f";
                messageSpan.style.fontStyle = "italic";
                messageSpan.textContent = `Not first in ${tableName} table, but tag has been set. Please manually check if this was the first photo of the table.`;
                buttonContainer.appendChild(messageSpan);
            }
        });

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(statusSpan);
    }


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

    function processTile(tile) {
        if (tile.dataset.pmxDone === "1") {
            const zoomOn = !!gmGet(ZOOM_KEY, false);
            const info = parseTile(tile);
            if (zoomOn) enableLens(info);
            else disableLens(tile);

            if (info.editForm) enhanceModeratorEditForm(info.editForm);
            injectDoubleSpotSearchLink(info);
            injectNewLetterCombinationCheckGallery(info);
            return;
        }

        const info = parseTile(tile);

        injectForumWarningButton(info);
        injectDoubleSpotSearchLink(info);
        injectNewLetterCombinationCheckGallery(info);

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

    function showLoadingOverlay() {
        const existing = qs(".pmx-loading-overlay");
        if (existing) existing.remove();

        const overlay = document.createElement("div");
        overlay.className = "pmx-loading-overlay";

        const spinner = document.createElement("div");
        spinner.className = "pmx-loading-spinner";

        const text = document.createElement("div");
        text.className = "pmx-loading-text";
        text.textContent = "Loading...";

        overlay.appendChild(spinner);
        overlay.appendChild(text);
        document.body.appendChild(overlay);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            hideLoadingOverlay();
        }, 10000);

        return overlay;
    }

    function hideLoadingOverlay() {
        const overlay = qs(".pmx-loading-overlay");
        if (overlay) overlay.remove();
    }

    function closeEditPopup() {
        const popup = qs(".pmx-edit-popup");
        if (popup) popup.remove();
        hideLoadingOverlay();
    }

    function showEditPopup(title, contentHtml) {
        closeEditPopup();

        const popup = document.createElement("div");
        popup.className = "pmx-edit-popup";
        popup.addEventListener("mousedown", (e) => {
            if (e.target === popup) closeEditPopup();
        });

        const content = document.createElement("div");
        content.className = "pmx-edit-popup-content";

        const header = document.createElement("div");
        header.className = "pmx-edit-popup-header";

        const titleEl = document.createElement("div");
        titleEl.className = "pmx-edit-popup-title";
        titleEl.textContent = title;

        const closeBtn = document.createElement("button");
        closeBtn.className = "pmx-edit-popup-close";
        closeBtn.textContent = "×";
        closeBtn.title = "Close";
        closeBtn.addEventListener("click", closeEditPopup);

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        const body = document.createElement("div");
        body.className = "pmx-edit-popup-body";
        body.innerHTML = contentHtml;

        content.appendChild(header);
        content.appendChild(body);
        popup.appendChild(content);
        document.body.appendChild(popup);

        // Execute scripts properly
        const scripts = body.querySelectorAll("script");
        scripts.forEach((script) => {
            const newScript = document.createElement("script");
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            script.parentNode.replaceChild(newScript, script);
        });

        const form = body.querySelector("form");
        if (form) {
            form.action = "https://platesmania.com/admin/index_new.php?start=";
            form.method = "post";
            form.enctype = "application/x-www-form-urlencoded";

            // Wait for scripts to execute and jQuery to be available
            const initAutocompleteAndSelects = () => {
                if (typeof jQuery === "undefined") {
                    setTimeout(initAutocompleteAndSelects, 100);
                    return;
                }

                // Fix select dropdowns - ensure changeBrand and changeModel work
                const markaSelect = body.querySelector('select[name="markaavto"]');
                const modelSelect = body.querySelector('select[name="model"]');
                const modgenSelect = body.querySelector('select[name="modgen"]');

                if (markaSelect) {
                    // Remove existing listeners and add new one
                    const newMarkaSelect = markaSelect.cloneNode(true);
                    markaSelect.parentNode.replaceChild(newMarkaSelect, markaSelect);

                    if (typeof window.changeBrand === "function") {
                        newMarkaSelect.addEventListener("change", function() {
                            window.changeBrand(this.value);
                        });
                    }
                }

                if (modelSelect) {
                    // Remove existing listeners and add new one
                    const newModelSelect = modelSelect.cloneNode(true);
                    modelSelect.parentNode.replaceChild(newModelSelect, modelSelect);

                    if (typeof window.changeModel === "function") {
                        newModelSelect.addEventListener("change", function() {
                            window.changeModel(this.value);
                        });
                    }
                }

                // Initialize autocomplete properly
                const markamodtypeInput = body.querySelector("#markamodtype");
                if (markamodtypeInput) {
                    const $input = jQuery(markamodtypeInput);

                    // Check if autocomplete is already initialized
                    if ($input.autocomplete && $input.autocomplete("instance")) {
                        const autocompleteInstance = $input.autocomplete("instance");

                        // Fix menu positioning
                        autocompleteInstance._appendTo = jQuery(popup);
                        if (autocompleteInstance.menu && autocompleteInstance.menu.element) {
                            jQuery(autocompleteInstance.menu.element).appendTo(popup);
                            jQuery(autocompleteInstance.menu.element).css("z-index", "1000001");
                        }

                        // Ensure click events work on autocomplete items
                        $input.off("autocompleteselect").on("autocompleteselect", function(event, ui) {
                            event.preventDefault();
                            if (ui && ui.item) {
                                const value = ui.item.value || ui.item.label || "";
                                $input.val(value);
                                // Trigger change event to ensure form recognizes the value
                                $input.trigger("change");
                            }
                        });

                        // Also handle click events on menu items directly
                        setTimeout(() => {
                            const menu = autocompleteInstance.menu;
                            if (menu && menu.element) {
                                jQuery(menu.element).off("click").on("click", "li", function() {
                                    const item = jQuery(this).data("ui-autocomplete-item");
                                    if (item) {
                                        $input.val(item.value || item.label || "");
                                        $input.trigger("change");
                                        menu.close();
                                    }
                                });
                            }
                        }, 200);
                    } else {
                        // Autocomplete might not be initialized yet, try again later
                        setTimeout(initAutocompleteAndSelects, 200);
                    }
                }
            };

            // Try to initialize immediately, then retry if needed
            setTimeout(initAutocompleteAndSelects, 100);
            setTimeout(initAutocompleteAndSelects, 500);
            setTimeout(initAutocompleteAndSelects, 1000);


            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const formData = new FormData(form);
                const formBody = new URLSearchParams();
                for (const [key, value] of formData.entries()) {
                    formBody.append(key, value);
                }

                try {
                    const response = await fetch(form.action, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        credentials: "include",
                        body: formBody.toString(),
                        redirect: "follow"
                    });

                    await response.text();

                    setTimeout(() => {
                        closeEditPopup();
                        window.location.reload();
                    }, 500);
                } catch (err) {
                    console.error("Form submission error:", err);
                    alert("Failed to save changes. Please try again.");
                }
            }, false);
        }

        const submitBtn = body.querySelector('input[type="submit"][name="Submit"]');
        if (submitBtn && form) {
            submitBtn.addEventListener("click", (e) => {
                if (form.checkValidity && !form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    form.reportValidity();
                    return;
                }
            });
        }
    }

    async function fetchEditForm(id, param) {
        try {
            const html = await httpPost("https://platesmania.com/admin/edit_new.php", {
                id: id,
                from: "ind",
                param: param
            });
            return html;
        } catch (e) {
            return null;
        }
    }

    function extractMakeModelSection(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const originalForm = doc.querySelector("form");
        if (!originalForm) return null;

        const makeModelRow = doc.querySelector('select[name="markaavto"]')?.closest(".row.margin-bottom-20");
        const autocompleteSection = doc.querySelector("#markamodtype")?.closest(".col-sm-12");
        const saveSection = doc.querySelector(".col-xs-12.bg-light");
        if (!makeModelRow || !saveSection) return null;

        const scripts = doc.querySelectorAll("script");
        let scriptContent = "";
        scripts.forEach((script) => {
            if (script.textContent && (script.textContent.includes("bmObject") || script.textContent.includes("changeBrand") || script.textContent.includes("changeModel") || script.textContent.includes("markamodtype"))) {
                scriptContent += script.outerHTML;
            }
        });

        const form = document.createElement("form");
        form.method = originalForm.method || "post";
        if (originalForm.name) form.name = originalForm.name;
        if (originalForm.id) form.id = originalForm.id;
        form.action = "https://platesmania.com/admin/index_new.php?start=";
        form.enctype = originalForm.enctype || "application/x-www-form-urlencoded";

        const allInputs = originalForm.querySelectorAll("input, select, textarea");
        const fieldsToShow = new Set(["markaavto", "model", "modgen", "markamodtype", "posted1", "id", "date", "param", "reason1", "Submit"]);

        allInputs.forEach((input) => {
            if (input.name && !fieldsToShow.has(input.name) && input.type !== "submit") {
                if (input.type === "checkbox") {
                    if (input.checked) {
                        const hidden = document.createElement("input");
                        hidden.type = "hidden";
                        hidden.name = input.name;
                        hidden.value = input.value || "1";
                        form.appendChild(hidden);
                    }
                } else if (input.type === "radio") {
                    if (input.checked) {
                        const hidden = document.createElement("input");
                        hidden.type = "hidden";
                        hidden.name = input.name;
                        hidden.value = input.value || "";
                        form.appendChild(hidden);
                    }
                } else {
                    const hidden = document.createElement("input");
                    hidden.type = "hidden";
                    hidden.name = input.name;
                    if (input.tagName === "TEXTAREA") {
                        hidden.value = input.value || "";
                    } else if (input.tagName === "SELECT") {
                        hidden.value = input.value || "";
                    } else {
                        hidden.value = input.value || "";
                    }
                    form.appendChild(hidden);
                }
            }
        });

        const clonedMakeModelRow = makeModelRow.cloneNode(true);
        const hasAutocompleteInRow = clonedMakeModelRow.querySelector("#markamodtype");

        form.appendChild(clonedMakeModelRow);

        if (autocompleteSection && !hasAutocompleteInRow) {
            const autocompleteParent = autocompleteSection.parentElement;
            if (autocompleteParent && autocompleteParent.classList.contains("row") && autocompleteParent !== makeModelRow) {
                form.appendChild(autocompleteParent.cloneNode(true));
            } else {
                const autocompleteRow = document.createElement("div");
                autocompleteRow.className = "row margin-bottom-20";
                autocompleteRow.appendChild(autocompleteSection.cloneNode(true));
                form.appendChild(autocompleteRow);
            }
        }

        form.appendChild(saveSection.cloneNode(true));

        const container = document.createElement("div");
        container.appendChild(form);
        if (scriptContent) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = scriptContent;
            while (tempDiv.firstChild) {
                container.appendChild(tempDiv.firstChild);
            }
        }
        return container.innerHTML;
    }

    function extractPlateSection(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const originalForm = doc.querySelector("form");
        if (!originalForm) return null;

        const plateRow = doc.querySelector('input[name="nomer"]')?.closest(".row.margin-bottom-10");
        const plateTypeRow = doc.querySelector('select[name="type"]')?.closest(".row.margin-bottom-20");
        const saveSection = doc.querySelector(".col-xs-12.bg-light");
        if (!plateRow || !plateTypeRow || !saveSection) return null;

        const form = document.createElement("form");
        form.method = originalForm.method || "post";
        if (originalForm.name) form.name = originalForm.name;
        if (originalForm.id) form.id = originalForm.id;
        form.action = "https://platesmania.com/admin/index_new.php?start=";
        form.enctype = originalForm.enctype || "application/x-www-form-urlencoded";

        const allInputs = originalForm.querySelectorAll("input, select, textarea");
        const fieldsToShow = new Set(["nomer", "glr", "type", "fon", "color", "region", "posted1", "id", "date", "param", "reason1", "Submit"]);

        allInputs.forEach((input) => {
            if (input.name && !fieldsToShow.has(input.name) && input.type !== "submit") {
                if (input.type === "checkbox") {
                    if (input.checked) {
                        const hidden = document.createElement("input");
                        hidden.type = "hidden";
                        hidden.name = input.name;
                        hidden.value = input.value || "1";
                        form.appendChild(hidden);
                    }
                } else if (input.type === "radio") {
                    if (input.checked) {
                        const hidden = document.createElement("input");
                        hidden.type = "hidden";
                        hidden.name = input.name;
                        hidden.value = input.value || "";
                        form.appendChild(hidden);
                    }
                } else {
                    const hidden = document.createElement("input");
                    hidden.type = "hidden";
                    hidden.name = input.name;
                    if (input.tagName === "TEXTAREA") {
                        hidden.value = input.value || "";
                    } else if (input.tagName === "SELECT") {
                        hidden.value = input.value || "";
                    } else {
                        hidden.value = input.value || "";
                    }
                    form.appendChild(hidden);
                }
            }
        });

        form.appendChild(plateRow.cloneNode(true));
        form.appendChild(plateTypeRow.cloneNode(true));
        form.appendChild(saveSection.cloneNode(true));

        const container = document.createElement("div");
        container.appendChild(form);
        return container.innerHTML;
    }

    function injectMakeModelEditButton() {
        const makeModelH3 = qs("h3.text-center.margin-bottom-10");
        if (!makeModelH3 || makeModelH3.dataset.pmxMakeModelBtn) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-u btn-u-green btn-u-xs";
        btn.style.marginLeft = "10px";
        btn.innerHTML = '<i class="fa fa-pencil"></i> Edit';
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pageInfo = getCurrentPageInfo();
            if (!pageInfo.id || !pageInfo.param) return;

            const loadingOverlay = showLoadingOverlay();
            try {
                const html = await fetchEditForm(pageInfo.id, pageInfo.param);
                hideLoadingOverlay();
                if (!html) {
                    alert("Failed to load edit form");
                    return;
                }

                const content = extractMakeModelSection(html);
                if (!content) {
                    alert("Failed to extract make/model section");
                    return;
                }

                showEditPopup("Edit Make/Model", content);
            } catch (err) {
                hideLoadingOverlay();
                alert("Failed to load edit form");
            }
        });

        makeModelH3.appendChild(btn);
        makeModelH3.dataset.pmxMakeModelBtn = "1";
    }

    function injectPlateEditButton() {
        const genSmall = qs("small p.text-center");
        if (!genSmall) return;

        const panelBody = genSmall.closest(".panel-body");
        if (!panelBody) return;

        const plateImg = panelBody.querySelector('img[src*="/inf/"]');
        if (!plateImg || plateImg.dataset.pmxPlateBtn) return;

        const btnContainer = document.createElement("div");
        btnContainer.style.textAlign = "center";
        btnContainer.style.marginTop = "10px";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-u btn-u-green btn-u-xs";
        btn.innerHTML = '<i class="fa fa-pencil"></i> Edit';
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pageInfo = getCurrentPageInfo();
            if (!pageInfo.id || !pageInfo.param) return;

            const loadingOverlay = showLoadingOverlay();
            try {
                const html = await fetchEditForm(pageInfo.id, pageInfo.param);
                hideLoadingOverlay();
                if (!html) {
                    alert("Failed to load edit form");
                    return;
                }

                const content = extractPlateSection(html);
                if (!content) {
                    alert("Failed to extract plate section");
                    return;
                }

                showEditPopup("Edit Plate", content);
            } catch (err) {
                hideLoadingOverlay();
                alert("Failed to load edit form");
            }
        });

        btnContainer.appendChild(btn);
        plateImg.parentNode.insertBefore(btnContainer, plateImg.nextSibling);
        plateImg.dataset.pmxPlateBtn = "1";
    }

    function applyZoomToNomerPage(enabled) {
        const mainImg = qs('img[src*="/m/"]');
        if (!mainImg) return;

        const oImgUrl = mainImg.src.replace(/\/m\//, "/o/");
        if (!oImgUrl || oImgUrl === mainImg.src) return;

        if (enabled) {
            const wrap = ensureImageWrapper(mainImg);
            if (!wrap) return;

            if (zoomState.get(mainImg)?.enabled) return;

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
            lens.style.backgroundImage = `url("${oImgUrl}")`;
            lens.style.backgroundRepeat = "no-repeat";
            lens.style.backgroundColor = "#fff";

            wrap.appendChild(lens);

            const zoom = 3;

            function move(e) {
                const imgRect = mainImg.getBoundingClientRect();
                const wrapRect = wrap.getBoundingClientRect();

                let cx = (typeof e.offsetX === "number") ? e.offsetX : (e.clientX - imgRect.left);
                let cy = (typeof e.offsetY === "number") ? e.offsetY : (e.clientY - imgRect.top);

                cx = Math.max(0, Math.min(cx, imgRect.width));
                cy = Math.max(0, Math.min(cy, imgRect.height));

                const lw = lens.offsetWidth || 140;
                const lh = lens.offsetHeight || 140;

                const imgOffsetX = imgRect.left - wrapRect.left;
                const imgOffsetY = imgRect.top - wrapRect.top;

                const gap = 14;
                const left = imgOffsetX + cx + gap;
                const top  = imgOffsetY + cy - lh / 2;

                lens.style.left = `${left}px`;
                lens.style.top  = `${top}px`;

                const naturalWidth  = mainImg.naturalWidth  || imgRect.width;
                const naturalHeight = mainImg.naturalHeight || imgRect.height;
                const scaleX = naturalWidth / imgRect.width;
                const scaleY = naturalHeight / imgRect.height;

                const zoom = 3;
                lens.style.backgroundSize = `${naturalWidth * zoom}px ${naturalHeight * zoom}px`;

                const bx = -(cx * scaleX * zoom - lw / 2);
                const by = -(cy * scaleY * zoom - lh / 2);
                lens.style.backgroundPosition = `${bx}px ${by}px`;
            }


            function enter() {
                lens.style.display = "block";
            }
            function leave() {
                lens.style.display = "none";
            }

            mainImg.addEventListener("mousemove", move);
            mainImg.addEventListener("mouseenter", enter);
            mainImg.addEventListener("mouseleave", leave);

            zoomState.set(mainImg, { enabled: true, img: mainImg, lens, move, enter, leave });
        } else {
            const st = zoomState.get(mainImg);
            if (st?.enabled) {
                try {
                    mainImg.removeEventListener("mousemove", st.move);
                    mainImg.removeEventListener("mouseenter", st.enter);
                    mainImg.removeEventListener("mouseleave", st.leave);
                } catch {}
                try {
                    st.lens?.remove();
                } catch {}
                zoomState.set(mainImg, { enabled: false });
            }
        }
    }

    function processNomerPage() {
        if (!gmGet(MODERATOR_KEY, false)) return;
        injectMakeModelEditButton();
        injectPlateEditButton();
        applyZoomToNomerPage(!!gmGet(ZOOM_KEY, false));
        injectNewLetterCombinationCheckNomer();
    }

    function teardownNomerPage() {
        closeEditPopup();
        qsa(".btn-u-green.btn-u-xs").forEach((btn) => {
            if (btn.textContent.includes("Edit")) btn.remove();
        });
        const mainImg = qs('img[src*="/m/"]');
        if (mainImg) {
            const st = zoomState.get(mainImg);
            if (st?.enabled) {
                try {
                    mainImg.removeEventListener("mousemove", st.move);
                    mainImg.removeEventListener("mouseenter", st.enter);
                    mainImg.removeEventListener("mouseleave", st.leave);
                } catch {}
                try {
                    st.lens?.remove();
                } catch {}
                zoomState.set(mainImg, { enabled: false });
            }
        }
    }

    const { moderatorEnabled } = injectModeratorToggle();
    const pageInfo = getCurrentPageInfo();

    if (pageInfo.isNomerPage) {
        // Always inject new letter combination check on nomer pages
        injectNewLetterCombinationCheckNomer();
        if (moderatorEnabled) {
            processNomerPage();
        }
    } else {
        // For gallery pages, inject new letter combination check even without moderator mode
        // Check each tile individually (they might be from different countries)
        const tiles = qsa(".col-sm-6.col-xs-12");
        for (const tile of tiles) {
            const info = parseTile(tile);
            injectNewLetterCombinationCheckGallery(info);
        }

        // Also watch for new tiles
        const moGallery = new MutationObserver(() => {
            const tiles = qsa(".col-sm-6.col-xs-12");
            for (const tile of tiles) {
                if (!tile.querySelector(".pmx-newletter-check")) {
                    const info = parseTile(tile);
                    injectNewLetterCombinationCheckGallery(info);
                }
            }
        });
        moGallery.observe(document.documentElement, { childList: true, subtree: true });

        if (!moderatorEnabled) return;

        runModeratorPass();
        applyZoomToAllTiles(!!gmGet(ZOOM_KEY, false));

        const mo = new MutationObserver(() => {
            if (!gmGet(MODERATOR_KEY, false)) return;
            runModeratorPass();
            if (gmGet(ZOOM_KEY, false)) applyZoomToAllTiles(true);
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    window.addEventListener("scroll", () => closeAllMenus(), { passive: true });
})();
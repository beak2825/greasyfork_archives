// ==UserScript==
// @name         WME Merge Alternate Addresses
// @namespace    https://waze.com/
// @version      0.3.0
// @author       GreekCaptain
// @description  Applies alternate addresses to selected segments
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @grant        unsafeWindow
// @license      MIT
// @homepageURL  https://github.com/Snapmatics/wme-scripts
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/563088/WME%20Merge%20Alternate%20Addresses.user.js
// @updateURL https://update.greasyfork.org/scripts/563088/WME%20Merge%20Alternate%20Addresses.meta.js
// ==/UserScript==
(() => {
    "use strict";

    const UW = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

    const SCRIPT_ID = "wme-merge-alternate-addresses-v191";
    const SCRIPT_NAME = "Merge Alternate Addresses";

    const ROOT_ID = "wmeMergeAltAddrRoot_v191";
    const STYLE_ID = "wmeMergeAltAddrStyle_v191";
    const STORAGE_KEY = "WME_MERGE_ALT_ADDR_STATE_V191";


    const LAUNCHER_LOGO_DATA_URI = "data:image/png;base64,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";
    function launcherLogoMarkup() {
        // Use the script logo for the minimized launcher icon
        return `<img class="waa-launcherLogo" src="${LAUNCHER_LOGO_DATA_URI}" alt="MA" />`;
    }

    // Lean-mode knobs
    const EXPAND_CAP = 60; // render only first N rows unless "Show all"

    let sdk = null;

    const state = {
        mounted: false,
        minimized: false,
        dragging: false,
        dragPointerId: null,
        dragDx: 0,
        dragDy: 0,

        dragStartX: 0,
        dragStartY: 0,
        dragMoved: false,


        dragFromLauncher: false,
        scheduled: false,
        lastRender: 0,
        sizeScheduled: false,

        selSig: "",
        selSet: new Set(),
        dataVer: 0,
        dirtyData: true,

        unionCache: { sig: "", dataVer: -1, items: [] },
        labelCache: new Map(),

        segListCache: new Map(), // `${sig}::${altId}::present|missing` -> list
        expandedMode: new Map(), // altId -> "present"|"missing"
        expandedShowAll: new Map(), // altId -> bool

        feedbackUntil: new Map(),

        // Last operation safety net
        lastOp: null, // { type, altId, count, ts }

        savedPos: null,
        cardMap: new Map(),

        selCache: {
            sig: "",
            altBySeg: new Map(),
            primaryIdBySeg: new Map(),
            primaryNameBySeg: new Map(),
        },
    };

    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const raf = (fn) => requestAnimationFrame(fn);

    const uniqNums = (arr) => {
        if (!arr || !arr.length) return [];
        const s = new Set();
        for (const x of arr) {
            const n = Number(x);
            if (Number.isFinite(n)) s.add(n);
        }
        return [...s];
    };

    function saveUIState() {
        try {
            const root = document.getElementById(ROOT_ID);
            if (!root) return;
            const rect = root.getBoundingClientRect();
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    minimized: !!state.minimized,
                    pos: {
                        left: root.style.left || null,
                        top: root.style.top || null,
                        right: root.style.right || null,
                        rect: { left: rect.left, top: rect.top },
                    },
                })
            );
        } catch {}
    }

    function loadUIState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const payload = JSON.parse(raw);
            if (!payload || typeof payload !== "object") return;
            state.minimized = !!payload.minimized;
            state.savedPos = payload.pos || null;
        } catch {}
    }

    function scheduleRender() {
        if (state.scheduled) return;
        state.scheduled = true;
        setTimeout(() => {
            state.scheduled = false;
            render();
        }, 90);
    }

    function scheduleAutoSize() {
        if (state.sizeScheduled) return;
        state.sizeScheduled = true;
        raf(() => {
            state.sizeScheduled = false;
            autoSizePanel();
        });
    }

    function autoSizePanel() {
        const root = document.getElementById(ROOT_ID);
        if (!root) return;

        const top = root.querySelector(".waa-top");
        const body = root.querySelector(".waa-body");
        if (!top || !body) return;

        if (state.minimized) {
            // keep a true compact icon footprint
            root.style.height = "56px";
            body.style.maxHeight = "0px";
            body.style.overflow = "hidden";
            return;
        }

        body.style.maxHeight = "none";
        body.style.overflow = "auto";

        const topH = top.getBoundingClientRect().height || 60;
        const bodyScrollH = body.scrollHeight || 0;

        const maxH = Math.floor(window.innerHeight * 0.78);
        const minH = 120;
        const desired = clamp(Math.ceil(topH + bodyScrollH), minH, maxH);

        root.style.height = `${desired}px`;

        const bodyMax = clamp(desired - topH, 70, maxH - topH);
        body.style.maxHeight = `${bodyMax}px`;
        body.style.overflow = bodyScrollH > bodyMax + 8 ? "auto" : "hidden";
    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (!a || !b || a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
    }

    function getSelectionSegmentIds() {
        try {
            const sel = sdk.Editing.getSelection();
            if (!sel) return [];
            const ids = sel.ids ?? sel.objectIds ?? sel.selection?.ids ?? [];
            const t = String(sel.objectType ?? sel.type ?? sel.objectTypeName ?? sel.typeName ?? "").toLowerCase();
            if (t && !t.includes("segment") && !t.includes("road")) return [];
            return Array.isArray(ids) ? ids.map(Number).filter(Number.isFinite) : [];
        } catch {
            return [];
        }
    }

    function resetSelectionCaches(sig, ids) {
        state.selSig = sig;
        state.selSet = new Set(ids);

        state.expandedMode.clear();
        state.expandedShowAll.clear();

        state.unionCache.sig = "";
        state.segListCache.clear();

        state.dirtyData = true;

        state.selCache.sig = sig;
        state.selCache.altBySeg.clear();
        state.selCache.primaryIdBySeg.clear();
        state.selCache.primaryNameBySeg.clear();
    }

    function canEditSegment(segId) {
        try {
            return !!sdk.DataModel.Segments.hasPermissions({ segmentId: segId });
        } catch {
            return false;
        }
    }

    function getAltIdsForSegmentRaw(segId) {
        const { DataModel } = sdk;

        const seg = DataModel.Segments.getById({ segmentId: segId });
        if (seg && Array.isArray(seg.alternateStreetIds)) return uniqNums(seg.alternateStreetIds);

        const addr = DataModel.Segments.getAddress?.({ segmentId: segId });
        const alt = addr?.altStreets;
        if (!Array.isArray(alt) || !alt.length) return [];

        return uniqNums(
            alt
            .map((a) => a?.street?.id ?? a?.streetId ?? a?.id)
            .map(Number)
            .filter(Number.isFinite)
        );
    }

    function getAltIdsForSegment(segId) {
        const id = Number(segId);
        if (!Number.isFinite(id)) return [];
        if (state.selCache.sig === state.selSig && state.selSet.has(id)) {
            const hit = state.selCache.altBySeg.get(id);
            if (hit) return hit;
            const val = getAltIdsForSegmentRaw(id);
            state.selCache.altBySeg.set(id, val);
            return val;
        }
        return getAltIdsForSegmentRaw(id);
    }

    function getPrimaryStreetIdRaw(segId) {
        const { DataModel } = sdk;

        const seg = DataModel.Segments.getById({ segmentId: segId });
        if (seg && Number.isFinite(Number(seg.primaryStreetId))) return Number(seg.primaryStreetId);

        const addr = DataModel.Segments.getAddress?.({ segmentId: segId });
        const id = addr?.street?.id ?? addr?.streetId ?? addr?.id;
        return Number.isFinite(Number(id)) ? Number(id) : null;
    }

    function getPrimaryStreetId(segId) {
        const id = Number(segId);
        if (!Number.isFinite(id)) return null;

        if (state.selCache.sig === state.selSig && state.selSet.has(id)) {
            if (state.selCache.primaryIdBySeg.has(id)) return state.selCache.primaryIdBySeg.get(id);
            const v = getPrimaryStreetIdRaw(id);
            state.selCache.primaryIdBySeg.set(id, v);
            return v;
        }
        return getPrimaryStreetIdRaw(id);
    }

    function getStreetMeta(streetId) {
        const sid = Number(streetId);
        if (!Number.isFinite(sid)) return { name: `#${streetId}` };

        const cached = state.labelCache.get(sid);
        if (cached) return cached;

        const st = sdk.DataModel.Streets.getById({ streetId: sid });
        const name = (st?.name ?? "").trim() || "(Unnamed)";

        // Try to resolve a city name for this street (if any).
        const rawCityId =
              st?.cityId ?? st?.cityID ?? st?.city?.id ?? st?.city?.cityId ?? st?.city?.cityID ?? null;
        const cityId = Number(rawCityId);
        let cityName = "";
        if (Number.isFinite(cityId) && cityId > 0) {
            try {
                const c = sdk.DataModel.Cities.getById({ cityId });
                cityName = (c?.name ?? "").trim();
            } catch {}
        }
        if (!cityName) cityName = "No City";

        const meta = { name, cityName };

        state.labelCache.set(sid, meta);
        return meta;
    }

    function getPrimaryName(segId) {
        const id = Number(segId);
        if (!Number.isFinite(id)) return "(No primary)";

        if (state.selCache.sig === state.selSig && state.selSet.has(id)) {
            const hit = state.selCache.primaryNameBySeg.get(id);
            if (hit) return hit;
            const primaryId = getPrimaryStreetId(id);
            const name = Number.isFinite(primaryId) ? getStreetMeta(primaryId).name : "(No primary)";
            state.selCache.primaryNameBySeg.set(id, name);
            return name;
        }

        const primaryId = getPrimaryStreetId(id);
        return Number.isFinite(primaryId) ? getStreetMeta(primaryId).name : "(No primary)";
    }

    function computeAltUnionSummary(segmentIds) {
        const ids = segmentIds || [];
        const map = new Map();

        for (const segId of ids) {
            const altIds = getAltIdsForSegment(segId);
            if (!altIds.length) continue;

            const uniq = new Set(altIds);
            for (const streetId of uniq) {
                const sid = Number(streetId);
                if (!Number.isFinite(sid)) continue;
                map.set(sid, (map.get(sid) || 0) + 1);
            }
        }

        const total = ids.length;
        const out = [];
        for (const [streetId, present] of map.entries()) {
            out.push({
                streetId,
                countPresent: present,
                countMissing: Math.max(0, total - present),
                meta: getStreetMeta(streetId),
            });
        }

        out.sort((a, b) => {
            if (b.countPresent !== a.countPresent) return b.countPresent - a.countPresent;
            return (a.meta?.name ?? "").localeCompare((b.meta?.name ?? ""), undefined, { sensitivity: "base" });
        });

        return out;
    }

    function getAltUnionCached(segmentIds, sig) {
        if (!state.dirtyData && state.unionCache.sig === sig && state.unionCache.dataVer === state.dataVer) {
            return state.unionCache.items;
        }
        const items = computeAltUnionSummary(segmentIds);
        state.unionCache = { sig, dataVer: state.dataVer, items };
        state.dirtyData = false;
        return items;
    }

    function getSegListForAlt(mode, altId, selectionIds) {
        const sid = Number(altId);
        if (!Number.isFinite(sid)) return [];

        const sig = state.selSig || selectionIds.join(",");
        const key = `${sig}::${sid}::${mode}`;
        const cached = state.segListCache.get(key);
        if (cached) return cached;

        const list = [];
        for (let i = 0; i < selectionIds.length; i++) {
            const segId = selectionIds[i];
            const altIds = getAltIdsForSegment(segId);
            const has = altIds.includes(sid);

            if (mode === "present" && !has) continue;
            if (mode === "missing" && has) continue;

            list.push({ order: i + 1, segId, primaryName: getPrimaryName(segId) });
        }

        state.segListCache.set(key, list);
        return list;
    }

    function setExpandMode(altId, modeOrNull) {
        const sid = Number(altId);
        if (!Number.isFinite(sid)) return;

        if (!modeOrNull) {
            state.expandedMode.delete(sid);
            state.expandedShowAll.delete(sid);
        } else {
            const prev = state.expandedMode.get(sid) || null;
            if (prev === modeOrNull) {
                state.expandedMode.delete(sid);
                state.expandedShowAll.delete(sid);
            } else {
                state.expandedMode.set(sid, modeOrNull);
                state.expandedShowAll.set(sid, false);
            }
        }

        scheduleRender();
        scheduleAutoSize();
    }

    function toggleShowAll(altId) {
        const sid = Number(altId);
        if (!Number.isFinite(sid)) return;
        const cur = !!state.expandedShowAll.get(sid);
        state.expandedShowAll.set(sid, !cur);
        scheduleRender();
        scheduleAutoSize();
    }

    function markDataDirty() {
        state.dataVer++;
        state.dirtyData = true;

        state.segListCache.clear();
        state.labelCache.clear();

        state.selCache.altBySeg.clear();
        state.selCache.primaryIdBySeg.clear();
        state.selCache.primaryNameBySeg.clear();
    }

    function setAltFeedback(altId, type) {
        const sid = Number(altId);
        if (!Number.isFinite(sid)) return;

        const now = Date.now();
        const entry = state.feedbackUntil.get(sid) || { addedUntil: 0, removedUntil: 0 };
        if (type === "added") entry.addedUntil = now + 1300;
        if (type === "removed") entry.removedUntil = now + 1300;
        state.feedbackUntil.set(sid, entry);
    }

    function getAltButtonLabel(altId, kind, fallback) {
        const sid = Number(altId);
        const entry = state.feedbackUntil.get(sid);
        const now = Date.now();
        if (!entry) return fallback;
        if (kind === "add" && entry.addedUntil > now) return "Added";
        if (kind === "remove" && entry.removedUntil > now) return "Removed";
        return fallback;
    }


    function recordLastOp(type, altId, count, segIds) {
        const n = Number(count);
        const sid = Number(altId);
        if (!Number.isFinite(n) || n <= 0) return;
        if (!Number.isFinite(sid)) return;

        const ids = Array.isArray(segIds) ? segIds.map(Number).filter(Number.isFinite) : [];
        const meta = getStreetMeta(sid);

        state.lastOp = { type, altId: sid, count: n, ts: Date.now() };
    }


    async function addToMissing(altId) {
        if (!sdk.Editing.isEditingAllowed()) return;

        const ids = getSelectionSegmentIds();
        if (!ids.length) return;

        const sid = Number(altId);
        if (!Number.isFinite(sid)) return;

        let changed = 0;
        const changedSegs = [];

        for (const segId of ids) {
            if (!canEditSegment(segId)) continue;

            const primaryId = getPrimaryStreetId(segId);
            if (Number.isFinite(primaryId) && Number(primaryId) === sid) continue;

            const currentAlt = getAltIdsForSegment(segId);
            if (currentAlt.includes(sid)) continue;

            sdk.DataModel.Segments.updateAddress({
                segmentId: segId,
                alternateStreetIds: [...currentAlt, sid],
            });
            changed++;
            changedSegs.push(segId);
        }

        recordLastOp("add", sid, changed, changedSegs);

        setAltFeedback(sid, "added");
        markDataDirty();
        scheduleRender();
    }


    async function removeAlternate(altId) {
        if (!sdk.Editing.isEditingAllowed()) return;

        const ids = getSelectionSegmentIds();
        if (!ids.length) return;

        const sid = Number(altId);
        if (!Number.isFinite(sid)) return;

        let changed = 0;
        const changedSegs = [];

        for (const segId of ids) {
            if (!canEditSegment(segId)) continue;

            const currentAlt = getAltIdsForSegment(segId);
            if (!currentAlt.includes(sid)) continue;

            sdk.DataModel.Segments.updateAddress({
                segmentId: segId,
                alternateStreetIds: currentAlt.filter((x) => x !== sid),
            });
            changed++;
            changedSegs.push(segId);
        }

        recordLastOp("remove", sid, changed, changedSegs);

        setAltFeedback(sid, "removed");
        markDataDirty();
        scheduleRender();
    }


    async function removeAlternateFromOneSegment(altId, segId) {
        if (!sdk.Editing.isEditingAllowed()) return;

        const sid = Number(altId);
        const id = Number(segId);
        if (!Number.isFinite(sid) || !Number.isFinite(id)) return;
        if (!canEditSegment(id)) return;

        const currentAlt = getAltIdsForSegment(id);
        if (!currentAlt.includes(sid)) return;

        sdk.DataModel.Segments.updateAddress({
            segmentId: id,
            alternateStreetIds: currentAlt.filter((x) => x !== sid),
        });

        recordLastOp("remove-one", sid, 1, [id]);

        markDataDirty();
        scheduleRender();
    }


    function zoomToSegment(segId) {
        const id = Number(segId);
        if (!Number.isFinite(id)) return;

        let coords = null;
        try {
            const seg = sdk.DataModel.Segments.getById({ segmentId: id });
            coords = seg?.geometry?.coordinates || null;
        } catch {}

        if (!Array.isArray(coords) || coords.length < 2) return;

        let minLon = Infinity,
            minLat = Infinity,
            maxLon = -Infinity,
            maxLat = -Infinity;

        for (const c of coords) {
            const lon = Number(c?.[0]);
            const lat = Number(c?.[1]);
            if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
            if (lon < minLon) minLon = lon;
            if (lat < minLat) minLat = lat;
            if (lon > maxLon) maxLon = lon;
            if (lat > maxLat) maxLat = lat;
        }

        if (!Number.isFinite(minLon)) return;

        try {
            const W = UW.W;
            const OL = UW.OpenLayers;
            const olMap = W?.map?.getOLMap?.();
            if (!W || !OL || !olMap) return;

            const bounds = new OL.Bounds(minLon, minLat, maxLon, maxLat);
            const from = new OL.Projection("EPSG:4326");
            const to = olMap.getProjectionObject ? olMap.getProjectionObject() : null;

            if (to && bounds.transform) bounds.transform(from, to);
            if (bounds.scale) bounds.scale(1.6);

            olMap.zoomToExtent(bounds, true);
        } catch {}
    }

    function ensureStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const st = document.createElement("style");
        st.id = STYLE_ID;
        st.textContent = `
#${ROOT_ID}{
  position: fixed;
  top: 84px;
  right: 18px;
  width: 396px;
  z-index: 999999;

  font-family: ui-sans-serif, system-ui, "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif;
  font-size: 13.1px;
  line-height: 1.30;
  letter-spacing: .08px;
  font-feature-settings: "ss01" 1, "ss02" 1, "cv10" 1, "liga" 1, "kern" 1;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: rgba(18,24,38,.92);

  --waa-shadow: rgba(0,0,0,.14);
  --waa-shadow-blue: rgba(0,0,0,.06);

  --waa-orange-stroke: rgba(255,140,0,.28);
  --waa-orange-bg: rgba(255,140,0,.12);
  --waa-orange-ink: rgba(155,78,0,.96);

  --waa-red-stroke: rgba(255,70,70,.30);
  --waa-red-bg: rgba(255,70,70,.14);
  --waa-red-ink: rgba(165,20,20,.96);

  --waa-blue-stroke: rgba(40,140,255,.34);
  --waa-blue-bg: rgba(40,140,255,.16);
  --waa-blue-ink: rgba(10,84,176,.95);

  --waa-ease: cubic-bezier(.22,.9,.18,1);
}

#${ROOT_ID} *{ box-sizing:border-box; }

/* Minimized launcher mode */
#${ROOT_ID}.minimized{
  width: 56px !important;
  height: 56px !important;
}
.waa-launcher{
  width:56px;
  height:56px;
  border-radius:999px;
  display:grid;
  place-items:center;
  cursor:pointer;
  user-select:none;

  position:absolute;
  top:0;
  left:0;
  z-index:2;

  /* neutral glass (no blue gradient) */
  background:
    radial-gradient(120% 140% at 12% -10%,
      rgba(255,255,255,.52) 0%,
      rgba(255,255,255,.34) 52%,
      rgba(255,255,255,.22) 100%
    ),
    linear-gradient(135deg, rgba(255,255,255,.30), rgba(255,255,255,.18));

  box-shadow: 0 18px 44px var(--waa-shadow), 0 12px 36px rgba(0,0,0,.05);
  backdrop-filter: blur(28px) saturate(1.35);
  -webkit-backdrop-filter: blur(28px) saturate(1.35);

  transform: translateZ(0);
}
.waa-launcher svg, .waa-launcher img{ width:34px; height:34px; opacity:.95; }
.waa-launcherLogo{ display:block; border-radius:7px; }

.waa-notifBadge {
    position: absolute;
    top: 5px;
    left: 30px;
    transform: translate(50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 999px;
    box-sizing: border-box;
    background: rgb(249 96 87 / 98%);
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    font-weight: 650;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif;
    letter-spacing: 0px;
    display: grid;
    place-items: center;
    line-height: 1.4;
    text-align: center;
    box-shadow: 0 10px 22px rgba(0, 0, 0, .18);
    pointer-events: none;
}

.waa-notifBadge.waa-notifBadge--wide{
  width:auto;
  min-width:20px;
  padding:0 6px;
}

@keyframes waaLauncherPop{
  0%{ opacity:0; transform: scale(.92); filter: blur(3px); }
  100%{ opacity:1; transform: scale(1); filter: blur(0); }
}
.waa-launcher.waa-pop{ animation: waaLauncherPop .22s var(--waa-ease) both; }

@keyframes waaLauncherShrink{
  0%{ opacity:1; transform: scale(1); }
  100%{ opacity:0; transform: scale(.92); }
}
.waa-launcher.waa-shrink{ animation: waaLauncherShrink .16s var(--waa-ease) both; }


/* Mount animation */
#${ROOT_ID}{ opacity:0; transform: translateY(10px) scale(.985); }
#${ROOT_ID}.waa-in{
  opacity:1; transform: translateY(0) scale(1);
  transition: opacity .45s var(--waa-ease), transform .45s var(--waa-ease);
}

.waa-panel{
  width:100%;
  border-radius:20px;
  overflow:hidden;
  display:flex;
  flex-direction:column;

  /* Glassy + readable (neutral, more see-through) */
  background:
    radial-gradient(120% 140% at 12% -10%,
      rgba(255,255,255,.50) 0%,
      rgba(255,255,255,.30) 52%,
      rgba(255,255,255,.18) 100%),
    linear-gradient(135deg,
      rgba(255,255,255,.26),
      rgba(255,255,255,.14));

  /* no solid border around the panel */
  border: none;

  /* shadow biased left so it won't clip on the right edge */
  box-shadow: -10px 22px 58px var(--waa-shadow), -8px 14px 46px rgba(0,0,0,.06);

  /* blur */
  backdrop-filter: blur(20px) saturate(1.18);
  -webkit-backdrop-filter: blur(20px) saturate(1.18);

  position:relative;
  transform: translateZ(0);
  will-change: transform;

  /* blur seam reducers (Chrome) */
  isolation: isolate;
  background-clip: padding-box;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  clip-path: inset(0 round 20px);
}

@keyframes waaPanelOpen{0%{opacity:0;transform:translateY(10px) scale(.985);}100%{opacity:1;transform:translateY(0) scale(1);}}
.waa-panel.waa-open{animation: waaPanelOpen .26s var(--waa-ease) both;}

/* Sheen animation */
.waa-panel::before{
  content:"";
  position:absolute; inset:0;
  pointer-events:none;

  /* softer sheen to avoid right-edge banding */
  background: radial-gradient(140% 70% at 25% 0%,
    rgba(255,255,255,.42) 0%,
    rgba(255,255,255,.12) 32%,
    rgba(255,255,255,.08) 52%,
    rgba(255,255,255,0) 72%);
  opacity:.32;
  mix-blend-mode: normal;
}

.waa-panel::after{
  content:"";
  position:absolute;
  top:0; right:0; bottom:0;
  width:14px;
  pointer-events:none;

  /* hides Chrome backdrop-filter seam near the right edge */
  background: linear-gradient(to left,
    rgba(255,255,255,.22) 0%,
    rgba(255,255,255,.08) 45%,
    rgba(255,255,255,0) 100%);
}
@keyframes waaSheen{ 0%,100%{transform:translateX(-18%);opacity:.48} 50%{transform:translateX(8%);opacity:.64} }

@media (prefers-reduced-motion: reduce){
  #${ROOT_ID}, #${ROOT_ID}.waa-in{ transition:none!important; }
  .waa-panel::before{ animation:none!important; }
  .waa-card, .waa-act, .waa-chip, .waa-mini{ transition:none!important; }
  .waa-rowIn{ animation:none!important; opacity:1!important; transform:none!important; }
}

.waa-top {
    padding: 0 12px;
    height: 60px;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, .10);
    cursor: grab;
}
#${ROOT_ID}.dragging .waa-top{ cursor:grabbing; }
.waa-toprow{ width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.waa-script{
  font-weight: 900;
  font-size: 13.4px;
  letter-spacing: .25px;
  color: rgba(18,24,38,.86);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.waa-actions{ display:flex; align-items:center; gap:8px; }
.waa-iconTop{
  width:34px; height:34px; border-radius:999px;
  border:1px solid rgba(40,140,255,.18);
  background: rgba(255,255,255,.70);
  cursor:pointer;
  font-weight:850;
  color: rgba(18,24,38,.72);
  display:inline-flex; align-items:center; justify-content:center;
  transition: transform .22s var(--waa-ease), background .22s var(--waa-ease), box-shadow .22s var(--waa-ease);
  box-shadow: 0 10px 22px rgba(0,0,0,.06);
}
.waa-iconTop:hover{
  background:rgba(255,255,255,.90);
  box-shadow:0 14px 28px rgba(0,0,0,.08), 0 14px 34px rgba(40,140,255,.10);
  transform: translateY(-1px);
}
.waa-iconTop:active{ transform: translateY(1px) scale(.985); }

.waa-body {
    padding: 12px 12px 10px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(18, 24, 38, .28) rgba(255, 255, 255, 0);
}
.waa-body::-webkit-scrollbar{ width: 10px; }
.waa-body::-webkit-scrollbar-track{
  background: rgba(255,255,255,0);
  margin: 10px 0;
}
.waa-body::-webkit-scrollbar-thumb{
  background: rgba(18,24,38,.22);
  border-radius: 999px;
  border: 3px solid rgba(255,255,255,.72);
}
.waa-body::-webkit-scrollbar-thumb:hover{
  background: rgba(18,24,38,.30);
}
.waa-body::-webkit-scrollbar-thumb:active{
  background: rgba(18,24,38,.36);
}

.waa-empty{ height:46px; display:flex; align-items:center; padding:0 2px; margin:0; font-size:12px; color: rgba(18,24,38,.56); }



.waa-section-title{
  font-weight: 820;
  font-size: 11.2px;
  letter-spacing: .70px;
  text-transform: uppercase;
  color: rgba(18,24,38,.58);
  margin:4px 0 4px; padding-top:2px;
}
.waa-section-meta{
  font-weight: 740;
  font-size: 11.6px;
  letter-spacing: .08px;
  color: rgba(18,24,38,.72);
  margin: 0 0 12px;
}

.waa-card{
  border:1px solid rgba(40,140,255,.14);
  border-radius:14px;
  background: rgba(255,255,255,.78);
  box-shadow: 0 10px 22px rgba(0,0,0,.06), 0 10px 26px rgba(40,140,255,.10);
  overflow:hidden;
  transition: transform .26s var(--waa-ease), box-shadow .26s var(--waa-ease);
}
.waa-card:hover{
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(0,0,0,.08), 0 16px 34px rgba(40,140,255,.12);
}
.waa-card + .waa-card{ margin-top:10px; }
.waa-cardMain{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:12px; }
.waa-rowtext{ min-width:0; display:flex; flex-direction:column; gap:7px; }

\.waa-street{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:2px;
}

.waa-streetName{
  font-weight: 860;
  font-size: 13.6px;
  letter-spacing: .18px;
  color: rgba(18,24,38,.86);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

\.waa-city{
  font-weight: 760;
  font-size: 11.2px;
  letter-spacing: .12px;
  color: rgba(18,24,38,.58);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  line-height: 1.05;
}

.waa-chips{ display:flex; gap:8px; flex-wrap:wrap; }
.waa-chip{
  font-weight: 780;
  font-size: 10.9px;
  letter-spacing: .38px;
  padding:4px 9px;
  border-radius:999px;
  user-select:none;
  transition: transform .20s var(--waa-ease), box-shadow .20s var(--waa-ease), filter .20s var(--waa-ease);
}
.waa-chip.clickable{ cursor:pointer; }
.waa-chip.clickable:hover{ transform: translateY(-1px); filter: brightness(1.02); }

.waa-chip.present{
  border:1px solid var(--waa-blue-stroke);
  background: rgba(255,255,255,.72);
  color: var(--waa-blue-ink);
  box-shadow: 0 10px 18px rgba(40,140,255,.10);
}
.waa-chip.miss{
  border:1px solid var(--waa-orange-stroke);
  background: var(--waa-orange-bg);
  color: var(--waa-orange-ink);
  box-shadow: 0 10px 18px rgba(255,140,0,.10);
}

.waa-btnCol{ display:flex; flex-direction:column; gap:8px; flex:0 0 auto; padding-top:2px; }

.waa-act{
  padding:9px 12px;
  border-radius:12px;
  cursor:pointer;
  font-weight: 820;
  font-size:12px;
  letter-spacing: .14px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:146px;
  border:1px solid rgba(0,0,0,.08);
  background: rgba(255,255,255,.72);
  color: rgba(18,24,38,.82);
  box-shadow: 0 10px 22px rgba(0,0,0,.06), 0 14px 28px rgba(40,140,255,.10);
  transition: transform .24s var(--waa-ease), box-shadow .24s var(--waa-ease), background .24s var(--waa-ease);
  position:relative;
  overflow:hidden;
}
.waa-act:hover{
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(0,0,0,.08), 0 18px 34px rgba(40,140,255,.12);
}
.waa-act:active{ transform: translateY(0) scale(.99); }
.waa-act[disabled]{ opacity:.35; cursor:not-allowed; transform:none; box-shadow: 0 10px 22px rgba(0,0,0,.04); }

.waa-act.add{
  border-color: var(--waa-blue-stroke);
  background: var(--waa-blue-bg);
  color: var(--waa-blue-ink);
  box-shadow: 0 10px 22px rgba(0,0,0,.06), 0 14px 28px rgba(40,140,255,.12);
}
.waa-act.add:hover{
  background: rgba(40,140,255,.20);
  box-shadow: 0 14px 28px rgba(0,0,0,.08), 0 18px 34px rgba(40,140,255,.16);
}

.waa-remove{
  border-color: var(--waa-red-stroke);
  background: rgba(255,255,255,.72);
  color: var(--waa-red-ink);
  box-shadow: 0 10px 22px rgba(0,0,0,.06), 0 14px 28px rgba(255,70,70,.10);
}
.waa-remove:hover{
  background: var(--waa-red-bg);
  box-shadow: 0 14px 28px rgba(0,0,0,.08), 0 18px 34px rgba(255,70,70,.16);
}

/* Button sweep animation */
.waa-act::after{
  content:"";
  position:absolute;
  top:-40%;
  left:-70%;
  width:52%;
  height:180%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent);
  transform: rotate(18deg);
  opacity:0;
}
.waa-act:hover::after{ opacity:.32; animation: waaBtnSweep 1.05s var(--waa-ease); }
@keyframes waaBtnSweep{ 0%{left:-75%} 100%{left:150%} }

/* ✅ Expand sections: NO gradient (flat tinted) */
.waa-expandAttached{
  border-top:1px solid rgba(40,140,255,.14);
  background: rgba(255,255,255,.54);
}
.waa-expandAttached.waa-expand-missing{
  border-top-color: var(--waa-orange-stroke);
  background: rgba(255,140,0,.12);
}
.waa-expandAttached.waa-expand-present{
  border-top-color: var(--waa-blue-stroke);
  background: rgba(40,140,255,.12);
}

.waa-expandHead{ padding:10px 12px 8px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.waa-expandHeadTitle{ min-width:0; font-weight: 820; letter-spacing:.12px; color: rgba(18,24,38,.74); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.waa-expandHeadBtns{ display:flex; align-items:center; gap:8px; flex:0 0 auto; }

.waa-expandBtn{
  border:1px solid rgba(40,140,255,.18);
  background: rgba(255,255,255,.70);
  border-radius:999px;
  padding:5px 11px;
  font-weight: 820;
  letter-spacing:.10px;
  font-size:12px;
  cursor:pointer;
  color: rgba(18,24,38,.76);
  transition: transform .22s var(--waa-ease), background .22s var(--waa-ease), box-shadow .22s var(--waa-ease);
}
.waa-expandBtn:hover{
  background: rgba(255,255,255,.92);
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(40,140,255,.10);
}
.waa-expandBtn:active{ transform: translateY(0) scale(.99); }

.waa-row{
  padding:9px 12px;
  border-top:1px solid rgba(0,0,0,.06);
  display:flex;
  align-items:center;
  gap:10px;
  background: rgba(255,255,255,.58);
}
.waa-rowIn{
  opacity:0;
  transform: translateY(-4px);
  animation: waaRowIn .28s var(--waa-ease) forwards;
}
@keyframes waaRowIn{ to{ opacity:1; transform: translateY(0); } }

.waa-badge{
  flex:0 0 auto;
  font-weight: 860;
  font-size:11px;
  letter-spacing:.25px;
  color: rgba(18,24,38,.72);
  border:1px solid rgba(40,140,255,.14);
  background: rgba(255,255,255,.72);
  padding:4px 9px;
  border-radius:999px;
}
.waa-primary{
  min-width:0;
  font-weight: 780;
  letter-spacing:.10px;
  color: rgba(18,24,38,.78);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  flex: 1 1 auto;
}

.waa-rowBtns{ display:flex; gap:8px; flex:0 0 auto; }

.waa-mini{
  width:30px; height:30px;
  border-radius:10px;
  border:1px solid rgba(40,140,255,.18);
  background: rgba(255,255,255,.74);
  box-shadow: 0 10px 18px rgba(0,0,0,.06);
  cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center;
  padding:0;
  transition: transform .20s var(--waa-ease), box-shadow .20s var(--waa-ease), background .20s var(--waa-ease);
}
.waa-mini:hover{
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 24px rgba(0,0,0,.08), 0 14px 28px rgba(40,140,255,.10);
  transform: translateY(-1px);
}
.waa-mini:active{ transform: translateY(0) scale(.99); }
.waa-mini.danger{
  border-color: rgba(255,70,70,.30);
  color: var(--waa-red-ink);
}
.waa-mini svg{ width:16px; height:16px; opacity:.86; }

`;
        document.head.appendChild(st);
    }

    function applySavedPosition(root) {
        const pos = state.savedPos;
        if (!pos) return;
        if (pos.left) {
            root.style.left = pos.left;
            root.style.top = pos.top || "84px";
            root.style.right = "auto";
            return;
        }
        if (pos.right) root.style.right = pos.right;
        if (pos.top) root.style.top = pos.top;
    }

    function iconTargetSvg() {
        return `
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="M11 2h2v2.06a8.01 8.01 0 0 1 6.94 6.94H22v2h-2.06A8.01 8.01 0 0 1 13 19.94V22h-2v-2.06A8.01 8.01 0 0 1 4.06 13H2v-2h2.06A8.01 8.01 0 0 1 11 4.06V2Zm1 4a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm0 3a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"/>
</svg>`;
    }

    function iconRemoveSvg() {
        return `
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v10h-2V9Zm4 0h2v10h-2V9ZM7 9h2v10H7V9Z"/>
</svg>`;
    }

    function renderExpanded(cardRefs, altId, mode, selectionIds) {
        const fullList = getSegListForAlt(mode, altId, selectionIds);
        const total = fullList.length;

        const showAll = !!state.expandedShowAll.get(Number(altId));
        const capped = !showAll && total > EXPAND_CAP;
        const list = capped ? fullList.slice(0, EXPAND_CAP) : fullList;

        const titlePrefix =
              mode === "present"
        ? `Present on ${total} segment${total === 1 ? "" : "s"}`
        : `Missing on ${total} segment${total === 1 ? "" : "s"}`;
        const title = capped ? `${titlePrefix} (showing ${EXPAND_CAP})` : titlePrefix;

        let wrap = cardRefs.expandWrap;
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "waa-expandAttached";

            const head = document.createElement("div");
            head.className = "waa-expandHead";

            const t = document.createElement("div");
            t.className = "waa-expandHeadTitle";

            const btns = document.createElement("div");
            btns.className = "waa-expandHeadBtns";

            const showBtn = document.createElement("button");
            showBtn.type = "button";
            showBtn.className = "waa-expandBtn";
            showBtn.setAttribute("data-action", "toggle-showall");
            showBtn.setAttribute("data-alt-id", String(Number(altId)));

            const close = document.createElement("button");
            close.type = "button";
            close.className = "waa-expandBtn";
            close.textContent = "Close";
            close.setAttribute("data-action", "close-expand");
            close.setAttribute("data-alt-id", String(Number(altId)));

            btns.append(showBtn, close);
            head.append(t, btns);
            wrap.append(head);

            cardRefs.expandWrap = wrap;
            cardRefs.expandTitle = t;
            cardRefs.expandShowBtn = showBtn;
        }

        wrap.className = "waa-expandAttached " + (mode === "missing" ? "waa-expand-missing" : "waa-expand-present");

        cardRefs.expandTitle.textContent = title;

        if (total > EXPAND_CAP) {
            cardRefs.expandShowBtn.style.display = "inline-flex";
            cardRefs.expandShowBtn.textContent = showAll ? "Show less" : "Show all";
        } else {
            cardRefs.expandShowBtn.style.display = "none";
        }

        while (wrap.children.length > 1) wrap.removeChild(wrap.lastChild);

        const isPresentMode = mode === "present";
        const targetSvg = iconTargetSvg();
        const removeSvg = iconRemoveSvg();

        for (let idx = 0; idx < list.length; idx++) {
            const it = list[idx];

            const row = document.createElement("div");
            row.className = "waa-row waa-rowIn";
            row.style.animationDelay = `${Math.min(160, idx * 14)}ms`;

            const badge = document.createElement("span");
            badge.className = "waa-badge";
            badge.textContent = `#${it.order}`;

            const prim = document.createElement("div");
            prim.className = "waa-primary";
            prim.textContent = it.primaryName || "(No primary)";

            row.append(badge, prim);

            if (isPresentMode) {
                const btns = document.createElement("div");
                btns.className = "waa-rowBtns";

                const zoomBtn = document.createElement("button");
                zoomBtn.type = "button";
                zoomBtn.className = "waa-mini";
                zoomBtn.title = "Zoom to this segment";
                zoomBtn.setAttribute("data-action", "zoom-seg");
                zoomBtn.setAttribute("data-seg-id", String(it.segId));
                zoomBtn.innerHTML = targetSvg;

                const rmBtn = document.createElement("button");
                rmBtn.type = "button";
                rmBtn.className = "waa-mini danger";
                rmBtn.title = "Remove this alternate from this segment only";
                rmBtn.setAttribute("data-action", "remove-one");
                rmBtn.setAttribute("data-alt-id", String(Number(altId)));
                rmBtn.setAttribute("data-seg-id", String(it.segId));
                rmBtn.innerHTML = removeSvg;

                btns.append(zoomBtn, rmBtn);
                row.append(btns);
            }

            wrap.append(row);
        }

        return wrap;
    }

    function createCard(item, n) {
        const altId = Number(item.streetId);

        const card = document.createElement("div");
        card.className = "waa-card";
        card.setAttribute("data-alt-id", String(altId));

        const main = document.createElement("div");
        main.className = "waa-cardMain";

        const textWrap = document.createElement("div");
        textWrap.className = "waa-rowtext";

        const street = document.createElement("div");
        street.className = "waa-street";

        const chips = document.createElement("div");
        chips.className = "waa-chips";

        const present = document.createElement("span");
        present.className = "waa-chip present clickable";
        present.setAttribute("data-action", "toggle-present");
        present.setAttribute("data-alt-id", String(altId));

        const miss = document.createElement("span");
        miss.className = "waa-chip miss clickable";
        miss.setAttribute("data-action", "toggle-missing");
        miss.setAttribute("data-alt-id", String(altId));

        chips.append(present, miss);
        textWrap.append(street, chips);

        const btnCol = document.createElement("div");
        btnCol.className = "waa-btnCol";

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "waa-act add";
        addBtn.setAttribute("data-action", "add");
        addBtn.setAttribute("data-alt-id", String(altId));

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "waa-act waa-remove";
        removeBtn.setAttribute("data-action", "remove");
        removeBtn.setAttribute("data-alt-id", String(altId));

        btnCol.append(addBtn, removeBtn);

        main.append(textWrap, btnCol);
        card.append(main);

        card._refs = {
            street,
            present,
            miss,
            addBtn,
            removeBtn,
            expandWrap: null,
            expandTitle: null,
            expandShowBtn: null,
        };

        updateCard(card, item, n, null);
        return card;
    }

    function updateCard(card, item, n, selectionIds) {
        const altId = Number(item.streetId);
        const r = card._refs;
        const meta = item.meta || { name: `#${altId}` };

        // Street label: two lines (city smaller/less visible)
        while (r.street.firstChild) r.street.removeChild(r.street.firstChild);

        const line1 = document.createElement("div");
        line1.className = "waa-streetName";
        line1.textContent = (meta.name ?? "").trim();
        r.street.appendChild(line1);

        const line2 = document.createElement("div");
        line2.className = "waa-city";
        const cityText = (meta.cityName ?? "").trim() || "No City";
        line2.textContent = cityText;
        r.street.appendChild(line2);

        r.present.textContent = `Present in ${item.countPresent}/${n}`;
        r.present.setAttribute("data-present", String(item.countPresent));
        r.present.title = item.countPresent > 0 ? "Click to list segments where this alternate is present" : "None present";
        r.present.style.opacity = item.countPresent > 0 ? "1" : ".55";
        r.present.style.cursor = item.countPresent > 0 ? "pointer" : "default";

        r.miss.textContent = `Missing in ${item.countMissing}`;
        r.miss.setAttribute("data-missing", String(item.countMissing));
        r.miss.title = item.countMissing > 0 ? "Click to list segments where this alternate is missing" : "Nothing missing";
        r.miss.style.opacity = item.countMissing > 0 ? "1" : ".55";
        r.miss.style.cursor = item.countMissing > 0 ? "pointer" : "default";

        const addLabel = getAltButtonLabel(altId, "add", "Add to missing");
        const remLabel = getAltButtonLabel(altId, "remove", "Remove alternate");

        r.addBtn.textContent = addLabel;
        r.removeBtn.textContent = remLabel;

        r.addBtn.disabled = addLabel === "Added" || item.countMissing === 0;
        r.removeBtn.disabled = remLabel === "Removed" || item.countPresent === 0;

        const mode = state.expandedMode.get(altId) || null;
        const shouldExpand =
              mode === "present" ? item.countPresent > 0 : mode === "missing" ? item.countMissing > 0 : false;

        if (!shouldExpand) {
            if (r.expandWrap && r.expandWrap.parentNode === card) card.removeChild(r.expandWrap);
            return;
        }

        if (!selectionIds) return;

        const wrap = renderExpanded(r, altId, mode, selectionIds);
        if (wrap.parentNode !== card) card.append(wrap);
    }

    function mount() {
        document.getElementById(ROOT_ID)?.remove();
        ensureStyle();

        const root = document.createElement("div");
        root.id = ROOT_ID;

        const panel = document.createElement("div");
        panel.className = "waa-panel";

        const top = document.createElement("div");
        top.className = "waa-top";

        const topRow = document.createElement("div");
        topRow.className = "waa-toprow";

        const scriptNameEl = document.createElement("div");
        scriptNameEl.className = "waa-script";
        scriptNameEl.textContent = SCRIPT_NAME;

        const actions = document.createElement("div");
        actions.className = "waa-actions";

        const minimizeBtn = document.createElement("button");
        minimizeBtn.className = "waa-iconTop";
        minimizeBtn.type = "button";
        minimizeBtn.title = "Minimize / Restore";
        minimizeBtn.textContent = "—";
        minimizeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            state.minimized = !state.minimized;
            root.classList.toggle("minimized", state.minimized);
            minimizeBtn.textContent = state.minimized ? "▢" : "—";
            // switch views
            panel.style.display = state.minimized ? "none" : "flex";
            launcher.style.display = state.minimized ? "grid" : "none";
            if (state.minimized) {
                launcher.classList.remove("waa-shrink");
                launcher.classList.remove("waa-pop");
                void launcher.offsetWidth;
                launcher.classList.add("waa-pop");
            } else {
                launcher.classList.remove("waa-pop");
                launcher.classList.remove("waa-shrink");
                scheduleRender();
            }
            saveUIState();
            scheduleAutoSize();
        });

        actions.append(minimizeBtn);
        topRow.append(scriptNameEl, actions);
        top.appendChild(topRow);

        const body = document.createElement("div");
        body.className = "waa-body";

        const empty = document.createElement("div");
        empty.className = "waa-empty";
        empty.style.display = "none";

        const secTitle = document.createElement("div");
        secTitle.className = "waa-section-title";
        secTitle.style.display = "none";

        const secMeta = document.createElement("div");
        secMeta.className = "waa-section-meta";
        secMeta.style.display = "none";

        const list = document.createElement("div");
        list.className = "waa-list";
        list.style.display = "none";

        const launcher = document.createElement("div");
        launcher.className = "waa-launcher";
        launcher.title = "Expand";
        launcher.innerHTML = launcherLogoMarkup();
        const badge = document.createElement("div");
        badge.className = "waa-notifBadge";
        badge.style.display = "none";
        launcher.appendChild(badge);
        body.append(empty, secTitle, secMeta, list);
        root._refs = { body, minimizeBtn, empty, secTitle, secMeta, list, panel, launcher, badge };

        panel.append(top, body);
        root.append(panel, launcher);

        // initial minimized visibility
        panel.style.display = state.minimized ? "none" : "flex";
        launcher.style.display = state.minimized ? "grid" : "none";
        if (state.minimized) {
            launcher.classList.remove("waa-pop");
            void launcher.offsetWidth;
            launcher.classList.add("waa-pop");
        }
        document.body.appendChild(root);

        applySavedPosition(root);
        root.classList.toggle("minimized", !!state.minimized);
        minimizeBtn.textContent = state.minimized ? "▢" : "—";

        raf(() => root.classList.add("waa-in"));

        launcher.addEventListener("pointerdown", (e) => {
            // drag the icon without expanding
            const rect = root.getBoundingClientRect();
            state.dragging = true;
            state.dragPointerId = e.pointerId;
            state.dragDx = e.clientX - rect.left;
            state.dragDy = e.clientY - rect.top;
            state.dragStartX = e.clientX;
            state.dragStartY = e.clientY;
            state.dragMoved = false;
            state.dragFromLauncher = true;
            root.classList.add("dragging");
            root.setPointerCapture?.(e.pointerId);
            e.preventDefault();
        });

        top.addEventListener("pointerdown", (e) => {
            if (e.target.closest("button")) return;
            const rect = root.getBoundingClientRect();
            state.dragging = true;
            state.dragPointerId = e.pointerId;
            state.dragDx = e.clientX - rect.left;
            state.dragDy = e.clientY - rect.top;
            root.classList.add("dragging");
            root.setPointerCapture?.(e.pointerId);
            e.preventDefault();
        });

        root.addEventListener("pointermove", (e) => {
            if (!state.dragging || e.pointerId !== state.dragPointerId) return;
            if (!state.dragMoved) {
                const dxm = e.clientX - state.dragStartX;
                const dym = e.clientY - state.dragStartY;
                if ((dxm*dxm + dym*dym) > 36) state.dragMoved = true; // 6px
            }
            const rect = root.getBoundingClientRect();
            const w = rect.width || 396;
            const h = rect.height || 240;

            let leftPx = e.clientX - state.dragDx;
            let topPx = e.clientY - state.dragDy;

            leftPx = clamp(leftPx, 8, window.innerWidth - w - 8);
            topPx = clamp(topPx, 8, window.innerHeight - h - 8);

            root.style.left = `${leftPx}px`;
            root.style.top = `${topPx}px`;
            root.style.right = "auto";
            e.preventDefault();
        });

        root.addEventListener("pointerup", (e) => {
            if (state.dragging && e.pointerId === state.dragPointerId) {
                const wasClick = !state.dragMoved;
                const fromLauncher = !!state.dragFromLauncher;

                state.dragging = false;
                state.dragPointerId = null;
                root.classList.remove("dragging");

                // If we were minimized and this was a click (not a drag), expand.
                if (state.minimized && fromLauncher && wasClick) {
                    launcher.classList.remove("waa-pop");
                    launcher.classList.add("waa-shrink");
                    setTimeout(() => {
                        state.minimized = false;
                        state.dragMoved = false;
                        state.dragFromLauncher = false;

                        root.classList.remove("minimized");
                        panel.style.display = "flex";
                        launcher.style.display = "none";
                        minimizeBtn.textContent = "—";

                        // Smooth open animation
                        panel.classList.remove("waa-open");
                        void panel.offsetWidth;
                        panel.classList.add("waa-open");

                        saveUIState();
                        scheduleRender();
                        scheduleAutoSize();
                    }, 140);
                } else {
                    state.dragMoved = false;
                    state.dragFromLauncher = false;
                    saveUIState();
                }
            }
        });


        root.addEventListener("pointercancel", () => {
            state.dragging = false;
            state.dragPointerId = null;
            root.classList.remove("dragging");
            saveUIState();
        });

        body.addEventListener("click", (e) => {
            const el = e.target.closest("[data-action]");
            if (!el) return;

            const action = el.getAttribute("data-action");
            const altId = el.getAttribute("data-alt-id");
            const segId = el.getAttribute("data-seg-id");

            if (action === "toggle-missing") {
                const missing = Number(el.getAttribute("data-missing") || "0");
                if (missing > 0) setExpandMode(altId, "missing");
                return;
            }
            if (action === "toggle-present") {
                const present = Number(el.getAttribute("data-present") || "0");
                if (present > 0) setExpandMode(altId, "present");
                return;
            }
            if (action === "toggle-showall") return void toggleShowAll(altId);
            if (action === "close-expand") return void setExpandMode(altId, null);

            if (action === "add") return void addToMissing(altId);
            if (action === "remove") return void removeAlternate(altId);

            if (action === "zoom-seg") return void zoomToSegment(segId);
            if (action === "remove-one") return void removeAlternateFromOneSegment(altId, segId);
        });

        window.addEventListener("resize", scheduleAutoSize, { passive: true });

        state.mounted = true;
        render();
    }

    function render() {
        if (!state.mounted) return;

        const root = document.getElementById(ROOT_ID);
        if (!root || !root._refs) return;

        const now = Date.now();
        if (now - state.lastRender < 50) return;
        state.lastRender = now;

        const { empty, undoText, secTitle, secMeta, list } = root._refs;

        const ids = getSelectionSegmentIds();
        const n = ids.length;

        const sig = ids.join(",");
        if (sig !== state.selSig) resetSelectionCaches(sig, ids);
        // When minimized: never auto-open. Instead, show an iOS-like badge when
        // 2+ selected segments already have alternate addresses.
        if (state.minimized) {
            const { launcher, badge } = root._refs;
            let withAlts = 0;
            if (n >= 2) {
                for (const segId of ids) {
                    const alts = getAltIdsForSegment(segId);
                    if (alts && alts.length) withAlts++;
                    if (withAlts >= 99) break;
                }
            }
            if (badge) {
                if (n >= 2 && withAlts >= 2) {
                    const t = withAlts > 99 ? "99+" : String(withAlts);
                    badge.textContent = t;
                    badge.classList.toggle("waa-notifBadge--wide", t.length > 1);
                    badge.style.display = "grid";
                } else {
                    badge.style.display = "none";
                    badge.classList.remove("waa-notifBadge--wide");
                }
            }
            if (launcher) launcher.style.display = "grid";
            return;
        }

        if (n < 1) {
            empty.textContent = "Select at least 2 segments to merge alternate addresses.";
            empty.style.display = "flex";
            secTitle.style.display = "none";
            secMeta.style.display = "none";
            list.style.display = "none";

            for (const card of state.cardMap.values()) card.remove();
            state.cardMap.clear();

            scheduleAutoSize();
            return;
        }

        const union = getAltUnionCached(ids, sig);

        if (!union.length) {
            empty.textContent = "No alternate addresses found in the selected segments.";
            empty.style.display = "flex";
            secTitle.style.display = "none";
            secMeta.style.display = "none";
            list.style.display = "none";

            for (const card of state.cardMap.values()) card.remove();
            state.cardMap.clear();

            scheduleAutoSize();
            return;
        }

        empty.style.display = "none";
        secTitle.style.display = "block";
        secTitle.textContent = "Alternate addresses in selection";
        secMeta.style.display = "block";
        secMeta.textContent = `${n} Segments Selected`;
        list.style.display = "block";

        const desiredOrder = [];
        const desiredSet = new Set();

        for (const item of union) {
            const altId = Number(item.streetId);
            desiredOrder.push(altId);
            desiredSet.add(altId);

            let card = state.cardMap.get(altId);
            if (!card) {
                card = createCard(item, n);
                state.cardMap.set(altId, card);
            } else {
                updateCard(card, item, n, ids);
            }
        }

        for (const [altId, card] of [...state.cardMap.entries()]) {
            if (!desiredSet.has(altId)) {
                card.remove();
                state.cardMap.delete(altId);
            }
        }

        const currentOrder = [];
        for (const el of list.children) {
            const id = Number(el.getAttribute("data-alt-id"));
            if (Number.isFinite(id)) currentOrder.push(id);
        }

        if (currentOrder.length !== desiredOrder.length || !arraysEqual(currentOrder, desiredOrder)) {
            const frag = document.createDocumentFragment();
            for (const altId of desiredOrder) frag.append(state.cardMap.get(altId));
            list.replaceChildren(frag);
        }

        scheduleAutoSize();
    }

    function boot() {
        if (sdk) return;

        sdk = getWmeSdk({ scriptId: SCRIPT_ID, scriptName: SCRIPT_NAME });

        sdk.Events.once({ eventName: "wme-ready" }).then(() => {
            loadUIState();
            mount();

            // Lean: selection change is the only global refresh trigger
            try {
                sdk.Events.on({
                    eventName: "wme-selection-changed",
                    eventHandler: () => scheduleRender(),
                });
            } catch {}

            scheduleAutoSize();
        });
    }

    function waitForSdk() {
        if (typeof SDK_INITIALIZED === "undefined") return setTimeout(waitForSdk, 450);
        UW.SDK_INITIALIZED.then(boot);
    }

    waitForSdk();
})();

// ==UserScript==
// @name         Watch Later Manager — checkboxes, filters, bulk delete (v1.3.1)
// @namespace    WLManager
// @version      1.3.1
// @description  Add a simple GUI to the Watch Later playlist to help manage, including filters (channel/progress) and bulk removal.
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550699/Watch%20Later%20Manager%20%E2%80%94%20checkboxes%2C%20filters%2C%20bulk%20delete%20%28v131%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550699/Watch%20Later%20Manager%20%E2%80%94%20checkboxes%2C%20filters%2C%20bulk%20delete%20%28v131%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const onWL = () => new URL(location.href).searchParams.get("list") === "WL";

  // ---------- UI bar ----------
  let uiInjected = false;
  function createControlBar() {
    if (uiInjected) return;
    const header = document.querySelector("ytd-playlist-header-renderer");
    const contents = document.querySelector("#contents");
    const anchor = header || contents;
    if (!anchor || !anchor.parentElement) return;

    const bar = document.createElement("div");
    bar.id = "wl-manager-bar";
    bar.style.cssText = [
      "position:sticky","top:0","z-index:9000",
      "background:var(--yt-spec-general-background-a)",
      "padding:12px","margin:8px 0",
      "border:1px solid var(--yt-spec-10-percent-layer)","border-radius:12px",
      "display:flex","flex-wrap:wrap","gap:8px","align-items:center"
    ].join(";");

    bar.innerHTML = `
      <strong style="margin-right:8px;">Watch Later Manager</strong>
      <label>Channel:
        <input id="wl-filter-channel" type="text" placeholder="contains…" style="padding:6px;border-radius:8px;border:1px solid var(--yt-spec-10-percent-layer)">
      </label>
      <button id="wl-select-channel" class="wl-btn">Select channel</button>
      <label>Progress:
        <select id="wl-filter-progress" style="padding:6px;border-radius:8px;border:1px solid var(--yt-spec-10-percent-layer)">
          <option value="any">Any</option>
          <option value="unwatched">Unwatched</option>
          <option value="partial">Partially watched</option>
          <option value="watched">Watched</option>
        </select>
      </label>
      <button id="wl-select-filtered" class="wl-btn">Select filtered</button>
      <button id="wl-clear-selection" class="wl-btn">Clear selection</button>
      <button id="wl-remove-selected" class="wl-btn" style="background:#bb1a1a;color:white;">Remove selected</button>
      <span id="wl-status" style="margin-left:auto; opacity:.8;"></span>
      <style>
        .wl-btn { padding:8px 10px; border-radius:10px; border:1px solid var(--yt-spec-10-percent-layer);
                  background: var(--yt-spec-10-percent-layer); cursor:pointer; }
        .wl-btn:hover { filter: brightness(0.95); }
        .wl-checked { outline:2px solid #3ea6ff; border-radius:8px; }
        .wl-pill { font-size:12px; padding:2px 6px; border-radius:9999px;
                   border:1px solid var(--yt-spec-10-percent-layer); margin-left:6px; }
      </style>
    `;

    anchor.parentElement.insertBefore(bar, anchor.nextSibling);
    uiInjected = true;

    byId("wl-select-channel").addEventListener("click", () => {
      const needle = (byId("wl-filter-channel").value || "").toLowerCase();
      getAllItems().forEach((it) => {
        const match = (getChannelName(it) || "").toLowerCase().includes(needle);
        setChecked(it, !!needle && match);
      });
      updateStatus();
    });

    byId("wl-select-filtered").addEventListener("click", () => {
      getItemsByFilter().forEach((it) => setChecked(it, true));
      updateStatus();
    });
    byId("wl-clear-selection").addEventListener("click", () => {
      getAllItems().forEach((it) => setChecked(it, false));
      updateStatus();
    });
    byId("wl-remove-selected").addEventListener("click", removeSelected);

    setInterval(() => {
      if (!document.contains(bar)) uiInjected = false; // watchdog will re-inject
      updateStatus();
    }, 800);
  }

  function byId(id){ return document.getElementById(id); }
  function statusEl(){ return byId("wl-status"); }
  function updateStatus() {
    const all = getAllItems().length;
    const sel = getAllItems().filter(isChecked).length;
    const s = statusEl();
    if (s) s.textContent = `${sel} selected • ${all} total`;
  }

  // ---------- Items & checkboxes ----------
  function getAllItems() {
    return Array.from(document.querySelectorAll("ytd-playlist-video-renderer")).filter(n => n.isConnected);
  }

  function ensureCheckbox(item) {
    if (item.querySelector(".wl-checkbox")) return;

    const wrap = document.createElement("div");
    wrap.className = "wl-checkbox-wrap";
    wrap.style.cssText = "display:flex; align-items:center; gap:6px; margin-bottom:6px;";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.className = "wl-checkbox";
    box.style.cssText = "transform:scale(1.2); cursor:pointer;";
    // Don’t navigate; do allow default checkbox toggle
    ["click","mousedown","mouseup","pointerdown","pointerup","touchstart","touchend"]
      .forEach(ev => box.addEventListener(ev, e => e.stopPropagation(), { capture:true }));

    const pillChannel = document.createElement("span");
    pillChannel.className = "wl-pill wl-pill-channel";
    const pillProg = document.createElement("span");
    pillProg.className = "wl-pill wl-pill-progress";

    wrap.appendChild(box); wrap.appendChild(pillChannel); wrap.appendChild(pillProg);
    (item.querySelector("#meta") || item).prepend(wrap);

    box.addEventListener("change", () => {
      item.classList.toggle("wl-checked", box.checked);
      updateStatus();
    });

    pillChannel.textContent = getChannelName(item) || "—";
    pillProg.textContent = progressLabel(getProgress(item));
  }

  function setChecked(item, val) {
    const ch = item.querySelector(".wl-checkbox");
    if (!ch) return;
    ch.checked = val;
    item.classList.toggle("wl-checked", val);
  }
  function isChecked(item) {
    const ch = item.querySelector(".wl-checkbox");
    return !!(ch && ch.checked);
  }

  function getChannelName(item) {
    const n = item.querySelector("ytd-channel-name a, #channel-name a, a.yt-simple-endpoint.style-scope.yt-formatted-string");
    return n ? n.textContent.trim() : "";
  }

  function getVideoId(item) {
    const a = item.querySelector("a#thumbnail[href*='watch'], a#video-title[href*='watch']");
    if (a) { try { return new URL(a.href, location.origin).searchParams.get("v") || ""; } catch{} }
    return item.getAttribute("data-video-id") || "";
  }

  // ---------- Progress detection (robust) ----------
  function getProgress(item) {
    // 1) Explicit "Watched" overlay wins
    if (isWatchedOverlayVisible(item)) return "watched";

    // 2) Percent from the resume bar (several fallbacks)
    const pct = getResumePercent(item);
    if (pct != null) {
      if (pct >= 98) return "watched";
      if (pct >= 2)  return "partial";
      return "unwatched";
    }

    // 3) Badge that explicitly says "Unwatched"
    if (hasUnwatchedBadge(item)) return "unwatched";

    // 4) Fallback
    return "unwatched";
  }

  function isWatchedOverlayVisible(item) {
    const el = item.querySelector("ytd-thumbnail-overlay-playback-status-renderer");
    if (!el) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && el.offsetParent !== null;
  }

  function hasUnwatchedBadge(item) {
    const b = item.querySelector("#badges ytd-badge-supported-renderer, ytd-badge-supported-renderer");
    return !!(b && /unwatched/i.test(b.textContent || ""));
  }

  function getResumePercent(item) {
    // Typical progress element(s)
    const bar = item.querySelector(
      "ytd-thumbnail-overlay-resume-playback-renderer #progress, " +
      "ytd-playlist-thumbnail #progress, " +
      "ytd-thumbnail #progress"
    );
    if (!bar) return null;

    // A) If inline style uses %, read it
    const w = (bar.style && bar.style.width) || "";
    const m = w.match(/([\d.]+)\s*%/);
    if (m) {
      const pct = parseFloat(m[1]);
      return isFinite(pct) ? pct : null;
    }

    // B) aria-valuenow on a progressbar ancestor
    const pb = bar.closest('[role="progressbar"]');
    if (pb && pb.hasAttribute("aria-valuenow")) {
      const pct = parseFloat(pb.getAttribute("aria-valuenow"));
      if (isFinite(pct)) return pct;
    }

    // C) Compute from pixels
    const rect = bar.getBoundingClientRect();
    const parent = bar.parentElement || bar.closest("#progress") || bar.parentElement;
    const parentRect = parent ? parent.getBoundingClientRect() : null;
    if (rect && parentRect && parentRect.width > 0) {
      const pct = (rect.width / parentRect.width) * 100;
      return Math.max(0, Math.min(100, pct));
    }

    // D) Last resort: non-trivial width -> treat as partial
    if (rect && rect.width > 2) return 50;
    return 0;
  }

  function progressLabel(k){ return k === "watched" ? "Watched" : k === "partial" ? "Partial" : "Unwatched"; }

  function getItemsByFilter() {
    const channelNeedle = (byId("wl-filter-channel")?.value || "").toLowerCase();
    const prog = byId("wl-filter-progress")?.value || "any";
    return getAllItems().filter((item) => {
      const ch = (getChannelName(item) || "").toLowerCase();
      const p = getProgress(item);
      return (!channelNeedle || ch.includes(channelNeedle)) && (prog === "any" || p === prog);
    });
  }

  // ---------- Popup helpers ----------
  function allPopups(){ return Array.from(document.querySelectorAll("ytd-menu-popup-renderer")); }
  function latestPopup(){
    const pops = allPopups().filter(visible);
    return pops.length ? pops[pops.length - 1] : null;
  }
  function visible(el){
    if (!el) return false;
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && el.offsetHeight > 0 && el.offsetWidth > 0;
  }
  function closeAnyPopup() {
    document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
    document.body.click();
  }

  // ---------- Bulk removal ----------
  async function removeSelected() {
    const selected = getAllItems().filter(isChecked);
    if (!selected.length) return alert("No videos selected.");

    const jobs = selected.map((el) => ({ el, vid: getVideoId(el) }));
    for (let i = 0; i < jobs.length; i++) {
      await removeOne(jobs[i], i + 1, jobs.length);
    }
  }

  async function removeOne(job, index, total) {
    const { el: itemNode, vid } = job;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        closeAnyPopup();
        await sleep(120);

        itemNode.scrollIntoView({ block: "center", inline: "nearest" });
        await sleep(80);

        const menuBtn = itemNode.querySelector("#menu #button, button[aria-label*='Action']");
        if (!menuBtn) throw new Error("Menu button not found");
        menuBtn.click();

        const popup = await waitFor(() => {
          const p = latestPopup();
          return p && visible(p) ? p : null;
        }, 3000);
        if (!popup) throw new Error("Popup not found");

        const options = Array.from(popup.querySelectorAll("ytd-menu-service-item-renderer tp-yt-paper-item, tp-yt-paper-item"));
        let target = options.find((el) => /remove/i.test(el.textContent || "") && /watch\s*later/i.test(el.textContent || ""));
        if (!target) target = options.find((el) => /remove/i.test(el.textContent || ""));
        if (!target) throw new Error("Remove item not found in popup");

        target.click();

        const ok = await waitFor(() => {
          if (!document.body.contains(itemNode)) return true;
          if (vid) return !findItemByVideoId(vid);
          return false;
        }, 7000);

        if (!ok) throw new Error("Item still present after removal click");

        closeAnyPopup();
        status(`${index}/${total} removed`);
        await sleep(120);
        return;
      } catch (e) {
        console.warn(`Remove attempt ${attempt} failed:`, e);
        closeAnyPopup();
        await sleep(250);
      }
    }
    status(`Skipped 1 after 3 attempts`);
  }

  function findItemByVideoId(vid) {
    return Array.from(document.querySelectorAll("ytd-playlist-video-renderer a#thumbnail[href*='watch'], ytd-playlist-video-renderer a#video-title[href*='watch']"))
      .find(a => { try { return new URL(a.href, location.origin).searchParams.get("v") === vid; } catch { return false; } })
      ?.closest("ytd-playlist-video-renderer") || null;
  }

  async function waitFor(predicate, timeoutMs = 3000, interval = 50) {
    const t0 = performance.now();
    while (performance.now() - t0 < timeoutMs) {
      const v = predicate();
      if (v) return v;
      await sleep(interval);
    }
    return null;
  }

  function status(msg) {
    const s = statusEl();
    if (s) s.textContent = `${msg} • ${s.textContent.replace(/^[^•]+•\s*/,"")}`;
  }

  // ---------- Boot / watchdog ----------
  function processAllItems() {
    if (!onWL()) return;
    if (!uiInjected) createControlBar();
    getAllItems().forEach(ensureCheckbox);
  }

  new MutationObserver(() => { if (onWL()) processAllItems(); })
    .observe(document.documentElement, { childList:true, subtree:true });

  setInterval(() => { if (onWL() && !document.getElementById("wl-manager-bar")) uiInjected = false; }, 1500);

  window.addEventListener("yt-navigate-finish", processAllItems);
  processAllItems();
})();

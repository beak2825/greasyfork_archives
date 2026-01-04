// ==UserScript==
// @name         Torn F1x Users Fetch
// @namespace    torn.com
// @version      3.2
// @description  UserList → export users.txt (collect userIDs from the current UserList pages you browse)
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/page.php*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560528/Torn%20F1x%20Users%20Fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/560528/Torn%20F1x%20Users%20Fetch.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const url = new URL(location.href);
  const isUserList = url.pathname === "/page.php" && url.searchParams.get("sid") === "UserList";
  if (!isUserList) return;

  const KEY_IDS = "SG_F1xUsersFetch_ids";
  const KEY_POS = "SG_F1xUsersFetch_pos";
  const KEY_HIDDEN = "SG_F1xUsersFetch_hidden";

  let ids = new Set();
  let running = false;
  let observer = null;
  let scanDebounce = null;

  const saved = String(GM_getValue(KEY_IDS, "") || "");
  saved
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((id) => ids.add(id));

  GM_addStyle(`
    #sg-f1x-panel{position:fixed;top:120px;left:20px;width:360px;z-index:999999;background:rgba(20,20,20,.92);border:1px solid rgba(255,255,255,.18);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);color:#eaeaea;font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;backdrop-filter:blur(6px);overflow:hidden;user-select:none}
    #sg-f1x-header{padding:10px 10px 8px;cursor:move;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.10);display:flex;align-items:center;justify-content:space-between;gap:10px}
    #sg-f1x-title{font-weight:700;letter-spacing:.2px;font-size:12px;opacity:.95;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #sg-f1x-mini{display:flex;align-items:center;gap:6px}
    #sg-f1x-hide{cursor:pointer;padding:2px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#eaeaea}
    #sg-f1x-body{padding:10px;user-select:text}
    #sg-f1x-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}
    .sg-f1x-btn{flex:1 1 auto;min-width:80px;padding:7px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#eaeaea;cursor:pointer;text-align:center;user-select:none}
    .sg-f1x-btn:hover{background:rgba(255,255,255,.10)}
    .sg-f1x-btn:disabled{opacity:.45;cursor:not-allowed}
    #sg-f1x-stats{display:flex;justify-content:space-between;gap:10px;opacity:.9;margin:6px 0 8px;user-select:text}
    #sg-f1x-status{margin-top:8px;opacity:.85;color:#cfcfcf;user-select:text;min-height:16px}
    #sg-f1x-text{width:100%;height:170px;resize:vertical;border-radius:10px;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.25);color:#eaeaea;padding:8px;outline:none;font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;box-sizing:border-box}
    #sg-f1x-hint{margin-top:6px;opacity:.75;font-size:11px;user-select:text}
  `);

  const panel = document.createElement("div");
  panel.id = "sg-f1x-panel";

  const header = document.createElement("div");
  header.id = "sg-f1x-header";

  const title = document.createElement("div");
  title.id = "sg-f1x-title";
  title.textContent = "F1x Users Fetch (IDs → users.txt)";

  const mini = document.createElement("div");
  mini.id = "sg-f1x-mini";

  const hideBtn = document.createElement("button");
  hideBtn.id = "sg-f1x-hide";
  hideBtn.type = "button";
  hideBtn.textContent = "Hide";

  mini.appendChild(hideBtn);
  header.appendChild(title);
  header.appendChild(mini);

  const body = document.createElement("div");
  body.id = "sg-f1x-body";

  const row = document.createElement("div");
  row.id = "sg-f1x-row";

  const btnStart = makeBtn("Start", onStart);
  const btnStop = makeBtn("Stop", onStop);
  const btnClear = makeBtn("Clear List", onClear);
  const btnDownload = makeBtn("Download list", onDownload);

  row.appendChild(btnStart);
  row.appendChild(btnStop);
  row.appendChild(btnClear);
  row.appendChild(btnDownload);

  const stats = document.createElement("div");
  stats.id = "sg-f1x-stats";
  const statCount = document.createElement("div");
  const statLast = document.createElement("div");
  stats.appendChild(statCount);
  stats.appendChild(statLast);

  const textarea = document.createElement("textarea");
  textarea.id = "sg-f1x-text";
  textarea.spellcheck = false;

  const status = document.createElement("div");
  status.id = "sg-f1x-status";

  const hint = document.createElement("div");
  hint.id = "sg-f1x-hint";
  hint.textContent = "Safe: no auto-navigation, no requests. It only collects IDs from the UserList pages you manually browse.";

  body.appendChild(row);
  body.appendChild(stats);
  body.appendChild(textarea);
  body.appendChild(status);
  body.appendChild(hint);

  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  restorePosition();
  GM_registerMenuCommand("Toggle F1x Users Fetch panel", togglePanel);

  hideBtn.addEventListener("click", () => {
    setHidden(true);
    panel.style.display = "none";
  });

  makeDraggable(panel, header);

  syncTextarea();
  updateStats(0, "Ready. Click Start.");
  updateButtons();

  function extractUserIdsFromPage() {
    const wrap = document.querySelector(".user-info-list-wrap");
    if (!wrap) return [];
    const found = new Set();
    wrap.querySelectorAll("li").forEach((li) => {
      for (const cls of li.classList) {
        const m = /^user(\d+)$/.exec(cls);
        if (m) found.add(m[1]);
      }
    });
    return Array.from(found);
  }

  function scanNow(reason = "") {
    const pageIds = extractUserIdsFromPage();
    let added = 0;
    for (const id of pageIds) {
      if (!ids.has(id)) {
        ids.add(id);
        added++;
      }
    }
    if (added > 0) saveIds();
    syncTextarea();

    const now = new Date();
    const stamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    updateStats(added, `Scanned: ${pageIds.length}${reason ? " (" + reason + ")" : ""} @ ${stamp}`);
    status.textContent = running ? "Running." : "Stopped.";
    updateButtons();
  }

  function scheduleScan(reason = "") {
    clearTimeout(scanDebounce);
    scanDebounce = setTimeout(() => scanNow(reason), 250);
  }

  function onStart() {
    if (running) return;
    running = true;

    scanNow("start");

    const target = document.querySelector(".user-info-list-wrap") || document.body;
    observer = new MutationObserver(() => {
      if (!running) return;
      scheduleScan("update");
    });
    observer.observe(target, { childList: true, subtree: true });

    window.addEventListener("hashchange", onNav, { passive: true });
    window.addEventListener("popstate", onNav, { passive: true });

    status.textContent = "Running. Browse pages (Next) to collect IDs.";
    updateButtons();
  }

  function onStop() {
    running = false;

    if (observer) {
      observer.disconnect();
      observer = null;
    }
    window.removeEventListener("hashchange", onNav);
    window.removeEventListener("popstate", onNav);

    status.textContent = "Stopped.";
    updateButtons();
  }

  function onNav() {
    if (!running) return;
    scheduleScan("nav");
  }

  function onClear() {
    ids = new Set();
    saveIds();
    syncTextarea();
    updateStats(0, "Cleared list.");
    status.textContent = "Cleared.";
    updateButtons();
  }

  function onDownload() {
    const sorted = Array.from(ids).sort((a, b) => Number(a) - Number(b));
    const text = sorted.join("\n") + (sorted.length ? "\n" : "");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    status.textContent = `Downloaded users.txt (${sorted.length} IDs).`;
    updateButtons();
  }

  function saveIds() {
    GM_setValue(KEY_IDS, Array.from(ids).join("\n"));
  }

  function makeBtn(label, onClick) {
    const b = document.createElement("button");
    b.className = "sg-f1x-btn";
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function syncTextarea() {
    const sorted = Array.from(ids).sort((a, b) => Number(a) - Number(b));
    textarea.value = sorted.join("\n");
  }

  function updateStats(added, lastMsg) {
    statCount.textContent = `Total IDs: ${ids.size}` + (added ? ` (+${added})` : "");
    statLast.textContent = lastMsg || "";
  }

  function updateButtons() {
    btnStart.disabled = running;
    btnStop.disabled = !running;
    btnDownload.disabled = ids.size === 0;
  }

  textarea.addEventListener("blur", () => syncTextarea());

  function setHidden(hidden) {
    GM_setValue(KEY_HIDDEN, !!hidden);
  }

  function getHidden() {
    return !!GM_getValue(KEY_HIDDEN, false);
  }

  function togglePanel() {
    const hidden = getHidden();
    setHidden(!hidden);
    panel.style.display = hidden ? "block" : "none";
  }

  if (getHidden()) panel.style.display = "none";

  function restorePosition() {
    const pos = GM_getValue(KEY_POS, null);
    if (!pos || typeof pos !== "object") return;
    const { left, top } = pos;
    if (Number.isFinite(left) && Number.isFinite(top)) {
      panel.style.left = `${Math.max(0, left)}px`;
      panel.style.top = `${Math.max(0, top)}px`;
    }
  }

  function makeDraggable(el, handle) {
    let dragging = false;
    let startX = 0,
      startY = 0;
    let startLeft = 0,
      startTop = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      dragging = true;
      const rect = el.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startLeft = rect.left;
      startTop = rect.top;
      e.preventDefault();
    });

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const left = Math.max(0, startLeft + dx);
        const top = Math.max(0, startTop + dy);
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      },
      { passive: true }
    );

    window.addEventListener(
      "mouseup",
      () => {
        if (!dragging) return;
        dragging = false;
        const rect = el.getBoundingClientRect();
        GM_setValue(KEY_POS, { left: Math.round(rect.left), top: Math.round(rect.top) });
      },
      { passive: true }
    );
  }

  setInterval(updateButtons, 400);
})();

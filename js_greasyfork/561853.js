// ==UserScript==
// @name         Torn Quick Items + Armoury Quick Items (Standalone)
// @namespace    https://torn.com/
// @version      1.2.0
// @description  Combines Inventory & Armoury Quick Items. Glassmorphism design. Fixes JSON, timers, and Close buttons.
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561853/Torn%20Quick%20Items%20%2B%20Armoury%20Quick%20Items%20%28Standalone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561853/Torn%20Quick%20Items%20%2B%20Armoury%20Quick%20Items%20%28Standalone%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ITEMS_TRACKED_TIMER_CLASS = "tt-qi-modified";
  const ITEMS_STORAGE_KEY = "tt_quick_items_v1";
  const ARM_STORAGE_KEY = "tt_armoury_quick_items_v1";
  const PENDING_ARM_ACTION_KEY = "tt_qi_pending_arm_action";

  // --- Helper Functions ---
  function gmGet(key) {
    try { return GM_getValue(key, ""); } catch { return localStorage.getItem(key) || ""; }
  }
  function gmSet(key, value) {
    try { GM_setValue(key, value); } catch { localStorage.setItem(key, value); }
  }

  function itemsFormatTimer(totalSeconds) {
    totalSeconds = Math.max(0, totalSeconds | 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) return `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function activateTimers(container) {
    container.querySelectorAll(".counter-wrap").forEach((el) => {
      if (el.classList.contains(ITEMS_TRACKED_TIMER_CLASS)) return;
      let seconds = parseInt(el.getAttribute("data-time") || el.getAttribute("data-seconds-left"));
      if (!isNaN(seconds)) {
        el.classList.add(ITEMS_TRACKED_TIMER_CLASS);
        el.setAttribute("data-seconds-left", seconds);
        el.textContent = itemsFormatTimer(seconds);
      }
    });
  }

  setInterval(() => {
    document.querySelectorAll(`.${ITEMS_TRACKED_TIMER_CLASS}`).forEach((el) => {
      let s = parseInt(el.getAttribute("data-seconds-left"));
      if (isNaN(s) || s <= 0) return;
      s--;
      el.setAttribute("data-seconds-left", s);
      el.textContent = itemsFormatTimer(s);
    });
  }, 1000);

  // --- State & Shared Logic ---
  let itemsState = JSON.parse(gmGet(ITEMS_STORAGE_KEY) || '{"items":[]}');
  let armState = JSON.parse(gmGet(ARM_STORAGE_KEY) || '{"items":[]}');
  let itemsEditing = false;
  let armEditing = false;

  // --- Inventory Usage ---
  async function itemsUse(id, responseWrap) {
    responseWrap.style.display = "block";
    responseWrap.innerHTML = `<div class="tt-qi-response-inner"><p>Working…</p></div>`;

    try {
      const res = await fetch("/item.php", {
        method: "POST",
        body: new URLSearchParams({ step: "useItem", id: id, itemID: id }),
        headers: { "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" }
      });

      const rawText = await res.text();
      let htmlContent = "";

      if (rawText.trim().startsWith("{")) {
        try {
          const json = JSON.parse(rawText);
          htmlContent = json.text || json.msg || json.message || "Done.";
        } catch { htmlContent = rawText; }
      } else { htmlContent = rawText; }

      htmlContent = htmlContent.replace(/<\\\//g, "</").replace(/\\"/g, '"');

      responseWrap.innerHTML = `
        <div class="tt-qi-response-inner">
          <div class="tt-qi-response-head" style="margin-bottom:8px;">
            <a href="#" class="tt-qi-close-btn t-blue h">Close</a>
            <a href="#" class="tt-qi-armoury-btn t-blue h" style="margin-left:15px;">Use from Armory</a>
          </div>
          <div class="tt-qi-response-body">${htmlContent}</div>
        </div>`;

      responseWrap.querySelector(".tt-qi-close-btn").onclick = (e) => {
        e.preventDefault();
        responseWrap.style.display = "none";
      };

      responseWrap.querySelector(".tt-qi-armoury-btn").onclick = (e) => {
        e.preventDefault();
        sessionStorage.setItem(PENDING_ARM_ACTION_KEY, JSON.stringify({ id, ts: Date.now() }));
        location.assign("/factions.php?step=your#/tab=armoury");
      };

      activateTimers(responseWrap);
    } catch (e) { responseWrap.innerHTML = "Request failed."; }
  }

  // --- Armoury Jump & Action ---
  function armJumpToAction(id) {
    const row = document.querySelector(`[data-item="${id}"], [data-id="${id}"]`) ||
                Array.from(document.querySelectorAll('img')).find(i => i.src.includes(`/${id}/`))?.closest('li, tr');
    if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        row.style.outline = "2px solid #75a832";
        setTimeout(() => {
            const btn = Array.from(row.querySelectorAll('button, a')).find(el => /use|withdraw|take/i.test(el.textContent));
            if (btn) btn.click(); else row.click();
            setTimeout(() => row.style.outline = "none", 2000);
        }, 600);
    }
  }

  function checkPendingArmoury() {
    const raw = sessionStorage.getItem(PENDING_ARM_ACTION_KEY);
    if (!raw) return;
    const pending = JSON.parse(raw);
    sessionStorage.removeItem(PENDING_ARM_ACTION_KEY);
    if (Date.now() - pending.ts < 30000) {
        let attempts = 0;
        const interval = setInterval(() => {
            if (document.querySelector(`img[src*="/${pending.id}/"]`)) {
                clearInterval(interval);
                armJumpToAction(pending.id);
            }
            if (attempts++ > 20) clearInterval(interval);
        }, 500);
    }
  }

  // --- Rendering ---
  function render(type) {
    const isItems = type === 'items';
    const panelId = isItems ? "tt-quick-items-panel" : "tt-armoury-quick-items-panel";
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const inner = panel.querySelector(".tt-qi-inner");
    const data = isItems ? itemsState.items : armState.items;
    const editing = isItems ? itemsEditing : armEditing;

    inner.innerHTML = data.length === 0 ? `<div style="font-size:12px;opacity:0.6;">No items. Click Edit to add.</div>` : "";

    data.forEach(it => {
      const box = document.createElement("div");
      box.className = `tt-qi-item ${editing ? 'tt-qi-editing' : ''}`;
      box.innerHTML = `
        <div class="tt-qi-pic" style="background-image:url(/images/items/${it.id}/medium.png)"></div>
        <div class="tt-qi-text">${it.name}</div>
        <button class="tt-qi-remove">×</button>
      `;
      box.onclick = () => {
        if (editing) {
            if (isItems) itemsState.items = itemsState.items.filter(i => i.id !== it.id);
            else armState.items = armState.items.filter(i => i.id !== it.id);
            gmSet(isItems ? ITEMS_STORAGE_KEY : ARM_STORAGE_KEY, JSON.stringify(isItems ? itemsState : armState));
            render(type);
        } else {
            if (isItems) itemsUse(it.id, panel.querySelector(".tt-qi-response-wrap"));
            else armJumpToAction(it.id);
        }
      };
      inner.appendChild(box);
    });
  }

  // --- Mounting ---
  function mount() {
    const invAnchor = document.querySelector(".equipped-items-wrap");
    const armAnchor = document.querySelector("#faction-armoury, .armoury-wrap");

    if (invAnchor && !document.getElementById("tt-quick-items-panel")) {
        injectPanel(invAnchor, "tt-quick-items-panel", "Quick Items", 'items');
    }
    if (armAnchor && !document.getElementById("tt-armoury-quick-items-panel")) {
        injectPanel(armAnchor, "tt-armoury-quick-items-panel", "Armoury Quick Items", 'arm');
        checkPendingArmoury();
    }
  }

  function injectPanel(anchor, id, title, type) {
    const panel = document.createElement("section");
    panel.id = id;
    panel.className = "tt-qi-card";
    panel.innerHTML = `
      <div class="tt-qi-header">
        <div class="tt-qi-title">${title}</div>
        <button class="tt-qi-btn">${type === 'items' ? (itemsEditing ? 'Done' : 'Edit') : (armEditing ? 'Done' : 'Edit')}</button>
      </div>
      <div class="tt-qi-inner"></div>
      <div class="tt-qi-response-wrap" style="display:none;"></div>
    `;
    panel.querySelector(".tt-qi-btn").onclick = (e) => {
        if (type === 'items') itemsEditing = !itemsEditing; else armEditing = !armEditing;
        e.target.textContent = (type === 'items' ? itemsEditing : armEditing) ? 'Done' : 'Edit';
        render(type);
    };
    anchor.parentNode.insertBefore(panel, anchor);
    render(type);
  }

  // Styles
  const style = document.createElement("style");
  style.textContent = `
    .tt-qi-card { margin-top: 8px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); backdrop-filter: blur(6px); padding: 10px; color: #fff; font-family: Arial, sans-serif; }
    .tt-qi-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .tt-qi-title { font-weight: 800; font-size: 14px; }
    .tt-qi-btn { border-radius: 10px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: #fff; padding: 6px 10px; cursor: pointer; font-size: 12px; }
    .tt-qi-inner { display: grid; grid-template-columns: repeat(auto-fill, minmax(58px, 1fr)); gap: 6px; }
    .tt-qi-item { position: relative; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); padding: 6px; cursor: pointer; text-align: center; }
    .tt-qi-pic { height: 52px; background-size: contain; background-repeat: no-repeat; background-position: center; margin-bottom: 4px; }
    .tt-qi-text { font-size: 11px; font-weight: 700; height: 2.4em; overflow: hidden; line-height: 1.2; }
    .tt-qi-remove { position: absolute; top: -5px; right: -5px; width: 18px; height: 18px; border-radius: 50%; background: #c00; color: #fff; border: none; font-size: 12px; display: none; }
    .tt-qi-editing .tt-qi-remove { display: block; }
    .tt-qi-response-wrap { margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 3px solid #75a832; font-size: 13px; }
  `;
  document.head.appendChild(style);

  // Global Add Item
  document.addEventListener("click", (e) => {
    if (!itemsEditing && !armEditing) return;
    const li = e.target.closest("li[data-item], tr[data-item], .armoury-item");
    if (!li) return;

    const isArmouryPage = location.hash.includes('armoury');
    const id = parseInt(li.dataset.item || li.querySelector('img')?.src.match(/\/(\d+)\//)?.[1]);
    let name = li.querySelector(".title, .name")?.textContent || `Item #${id}`;
    if (name.toLowerCase().includes("items | torn")) name = `Item #${id}`;

    if (itemsEditing && !isArmouryPage) {
        if (!itemsState.items.find(i => i.id === id)) {
            itemsState.items.push({ id, name });
            gmSet(ITEMS_STORAGE_KEY, JSON.stringify(itemsState));
            render('items');
        }
    } else if (armEditing && isArmouryPage) {
        if (!armState.items.find(i => i.id === id)) {
            armState.items.push({ id, name });
            gmSet(ARM_STORAGE_KEY, JSON.stringify(armState));
            render('arm');
        }
    }
  }, true);

  setInterval(mount, 1000);
})();
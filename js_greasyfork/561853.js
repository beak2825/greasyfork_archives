// ==UserScript==
// @name         Torn Quick Items + Armoury Quick Items (Standalone)
// @namespace    https://torn.com/
// @version      1.1.5
// @description  Adds a Quick Items panel on the Items page AND a separate Quick Items panel on the Faction Armoury tab (same userscript, separate storage).
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

  const TT_QI_DEBUG = false;

  function debugLog(...args) {
    try {
      if (typeof TT_QI_DEBUG !== "undefined" && TT_QI_DEBUG) console.log("[TT-QI]", ...args);
    } catch {}
  }



  if (window.top !== window.self) return;

  // Single-instance guard
  const ROOT = document.documentElement;
  const MARKER_ATTR = "data-tt-quick-items-combined-loaded";
  if (ROOT && ROOT.hasAttribute(MARKER_ATTR)) return;
  if (ROOT) ROOT.setAttribute(MARKER_ATTR, "1");

  // -------------------------
  // Shared helpers + storage
  // -------------------------
  function gmGet(key) {
    try { if (typeof GM_getValue === "function") return GM_getValue(key, ""); } catch {}
    try { return localStorage.getItem(key) || ""; } catch { return ""; }
  }

  function gmSet(key, value) {
    try { if (typeof GM_setValue === "function") return GM_setValue(key, value); } catch {}
    try { localStorage.setItem(key, value); } catch {}
  }

  function requireElement(selector, timeoutMs) {
    const el = document.querySelector(selector);
    if (el) return Promise.resolve(el);

    const start = Date.now();
    return new Promise((resolve, reject) => {
      const obs = new MutationObserver(() => {
        const node = document.querySelector(selector);
        if (node) {
          obs.disconnect();
          resolve(node);
        } else if (Date.now() - start > timeoutMs) {
          obs.disconnect();
          reject(new Error("Timeout waiting for " + selector));
        }
      });

      obs.observe(document.documentElement, { childList: true, subtree: true });

      const t = setInterval(() => {
        const node = document.querySelector(selector);
        if (node) {
          clearInterval(t);
          obs.disconnect();
          resolve(node);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(t);
          obs.disconnect();
          reject(new Error("Timeout waiting for " + selector));
        }
      }, 250);
    });
  }

  function requireElementAny(selectors, timeoutMs) {
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) return Promise.resolve(el);
    }

    const start = Date.now();
    return new Promise((resolve, reject) => {
      const obs = new MutationObserver(() => {
        for (const s of selectors) {
          const node = document.querySelector(s);
          if (node) {
            obs.disconnect();
            resolve(node);
            return;
          }
        }
        if (Date.now() - start > timeoutMs) {
          obs.disconnect();
          reject(new Error("Timeout waiting for selectors"));
        }
      });

      obs.observe(document.documentElement, { childList: true, subtree: true });

      const t = setInterval(() => {
        for (const s of selectors) {
          const node = document.querySelector(s);
          if (node) {
            clearInterval(t);
            obs.disconnect();
            resolve(node);
            return;
          }
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(t);
          obs.disconnect();
          reject(new Error("Timeout waiting for selectors"));
        }
      }, 250);
    });
  }

  function tryParseJson(text) {
    if (typeof text !== "string") return null;
    const t = text.trim();
    if (!t) return null;
    if (!(t.startsWith("{") && t.endsWith("}")) && !(t.startsWith("[") && t.endsWith("]"))) return null;
    try { return JSON.parse(t); } catch { return null; }
  }

  
  const TT_ITEM_NAME_CACHE_KEY = "tt_qi_item_name_cache";

  function readNameCache() {
    try {
      const raw = localStorage.getItem(TT_ITEM_NAME_CACHE_KEY);
      if (!raw) return {};
      const obj = JSON.parse(raw);
      return obj && typeof obj === "object" ? obj : {};
    } catch {
      return {};
    }
  }

  function writeNameCache(cache) {
    try { localStorage.setItem(TT_ITEM_NAME_CACHE_KEY, JSON.stringify(cache)); } catch {}
  }

  async function fetchItemNameNoApi(id) {
    const cache = readNameCache();
    if (cache[id]) return cache[id];

    // Best-effort: fetch the item page and scrape a likely title/name element.
    try {
      const res = await fetch(`/item.php?itemID=${encodeURIComponent(String(id))}`, { credentials: "include" });
      const html = await res.text();

      // Quick regex/meta passes (works even if the page is JS-heavy)
      const rx = [
        /property=["']og:title["']\s+content=["']([^"']+)["']/i,
        /name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
        /data-item-name=["']([^"']+)["']/i,
        /"itemName"\s*:\s*"([^"]+)"/i,
      ];
      for (const r of rx) {
        const mm = html.match(r);
        if (mm && mm[1]) {
          const t = normalizeNameFromText(mm[1].replace(/^Torn\s*-\s*/i, ""));
          if (t && /[a-z]/i.test(t)) {
            cache[id] = t;
            writeNameCache(cache);
            return t;
          }
        }
      }
      const doc = new DOMParser().parseFromString(html, "text/html");

      const sels = [
        ".item-name",
        ".info-wrap .title",
        ".title",
        "h4",
        "h3",
        "h2",
      ];

      let name = "";
      for (const s of sels) {
        const el = doc.querySelector(s);
        if (el && el.textContent) {
          const t = normalizeNameFromText(el.textContent);
          if (t && /[a-z]/i.test(t)) { name = t; break; }
        }
      }

      if (!name) {
        const title = doc.querySelector("title")?.textContent || "";
        const t = normalizeNameFromText(title.replace(/^Torn\s*-\s*/i, ""));
        if (t && /[a-z]/i.test(t)) name = t;
      }

      if (name) {
        cache[id] = name;
        writeNameCache(cache);
        return name;
      }
    } catch {}

    return "";
  }

function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function normalizeNameFromText(raw) {
    const s = String(raw || "").replace(/\u00a0/g, " ").trim();
    if (!s) return "";
    const lines = s.split(/\r?\n/).map((x) => x.trim()).filter((x) => x);

    // Drop pure quantity lines
    const filteredLines = lines.filter((x) => !/^x?\d+\s*x?$/i.test(x));

    let joined = (filteredLines.length ? filteredLines : lines).join(" ").replace(/\s+/g, " ").trim();
    if (!joined) return "";

    // Remove leading/trailing quantity tokens like "x1156" or "1156x"
    joined = joined.replace(/^(?:x?\d+\s+|\d+\s*x\s+)+/i, "").trim();
    joined = joined.replace(/\s+(?:x?\d+|\d+\s*x)\s*$/i, "").trim();

    // If any qty tokens still appear, strip them
    joined = joined
      .split(" ")
      .filter((tok) => !/^x\d+$/i.test(tok) && !/^\d+$/.test(tok))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return joined;
  }


  function extractItemsListName(li) {
    const titleWrap = li.querySelector(".title-wrap");
    const title = li.querySelector(".title");
    const preferred = (titleWrap && titleWrap.innerText) || (title && title.textContent) || "";
    const cleaned = normalizeNameFromText(preferred);
    if (cleaned) return cleaned;
    const t = li.querySelector("[title]")?.getAttribute("title") || "";
    return normalizeNameFromText(t);
  }

  function extractArmouryItemName(el) {
    if (!(el instanceof Element)) return "";

    const candidates = [];

    // direct attributes
    const add = (s) => {
      const v = String(s || "").replace(/\u00a0/g, " ").trim();
      if (!v) return;
      if (/^\d+$/.test(v)) return;
      // ignore obvious UI words
      if (/^(withdraw|take|use|close|cancel|amount)$/i.test(v)) return;
      candidates.push(v);
    };

    add(el.getAttribute("title"));
    add(el.getAttribute("aria-label"));

    // descendants: titles / aria-labels / alt
    el.querySelectorAll("[title],[aria-label],img[alt]").forEach((n) => {
      if (!(n instanceof Element)) return;
      add(n.getAttribute("title"));
      add(n.getAttribute("aria-label"));
      if (n.tagName === "IMG") add(n.getAttribute("alt"));
    });

    // visible text (often empty on mobile, but try anyway)
    const text = normalizeNameFromText(el.textContent || "");
    add(text);

    if (!candidates.length) return "";

    // pick the longest candidate with letters
    candidates.sort((a, b) => b.length - a.length);
    const best = candidates.find((x) => /[a-z]/i.test(x)) || candidates[0];
    return normalizeNameFromText(best);
  }


  function extractItemIdFromAny(el) {
    if (!(el instanceof Element)) return null;

    const attrs = ["data-item", "data-itemid", "data-item-id", "data-id", "data-uid", "data-item_id", "itemid", "item-id"];
    for (const a of attrs) {
      const v = el.getAttribute(a);
      if (v && /^\d+$/.test(v)) return parseInt(v, 10);
    }
    if (el instanceof HTMLElement) {
      for (const k of ["item", "itemid", "itemId", "id", "uid"]) {
        const v = el.dataset && el.dataset[k];
        if (v && /^\d+$/.test(v)) return parseInt(v, 10);
      }
    }

    // Try to extract from image src/background
    const candidates = [];
    const img = el.querySelector("img");
    if (img && img.getAttribute("src")) candidates.push(img.getAttribute("src"));
    if (img && img.getAttribute("data-src")) candidates.push(img.getAttribute("data-src"));
    if (el instanceof HTMLElement && el.style && el.style.backgroundImage) candidates.push(el.style.backgroundImage);

    const nodes = Array.from(el.querySelectorAll("*"));
    for (const n of nodes) {
      if (!(n instanceof HTMLElement)) continue;
      if (n.style && n.style.backgroundImage) candidates.push(n.style.backgroundImage);
      const s = n.getAttribute("src") || n.getAttribute("data-src");
      if (s) candidates.push(s);
    }

    for (const s of candidates) {
      if (!s) continue;
      const m = String(s).match(/\/images\/items\/(\d+)\//);
      if (m) return parseInt(m[1], 10);
    }

    // Last resort: scan outerHTML for items path
    const html = el.outerHTML || "";
    const m2 = html.match(/\/images\/items\/(\d+)\//);
    if (m2) return parseInt(m2[1], 10);

    return null;
  }


  // -------------------------
  // Items Quick Items module
  // -------------------------
  const ITEMS_STORAGE_KEY = "tt_quick_items_v1";
  const ITEMS_PANEL_ID = "tt-quick-items-panel";
  const ITEMS_STYLE_ID = "tt-quick-items-style";
  const ITEMS_TRACKED_TIMER_CLASS = "tt-qi-modified";

  const ITEMS_ALLOWED_CATEGORIES = ["Temporary", "Medical", "Drug", "Energy Drink", "Alcohol", "Candy", "Booster"];
  const ITEMS_TEMP_IDS = new Set([
    220, 221, 222, 226, 229, 239, 242, 246, 256, 257, 392, 394, 581, 611, 616, 742, 833, 840, 1042, 1205,
    1078, 1079, 1080, 1081, 1082, 1083,
    403,
  ]);

  let itemsState = loadItemsState();
  migrateItemsNames();
  let itemsMounted = false;
  let itemsEditing = false;
  let itemsMovingEl = null;
  let itemsRenderTick = null;

  function isOnItemsPage() {
    const href = location.href;
    const sidOk = /[?&#]sid=items\b/i.test(href) || /\bsid=items\b/i.test(href);
    const domHints = !!document.querySelector(".equipped-items-wrap") && !!document.querySelector("ul.items-cont");
    return sidOk || domHints;
  }

  function mountItems() {
    document.querySelectorAll(`#${ITEMS_PANEL_ID}`).forEach((p, i) => { if (i > 0) p.remove(); });
    const existing = document.getElementById(ITEMS_PANEL_ID);
    if (existing) {
      itemsMounted = true;
      return;
    }

    const anchor = document.querySelector(".equipped-items-wrap");
    if (!anchor || !anchor.parentNode) return;

    const panel = buildItemsPanel();
    anchor.parentNode.insertBefore(panel, anchor);

    itemsMounted = true;
    scheduleItemsRender();
  }

  function unmountItems() {
    itemsMounted = false;
    itemsEditing = false;

    const panel = document.getElementById(ITEMS_PANEL_ID);
    if (panel) panel.remove();

    setItemsOverlay(false);
  }

  function buildItemsPanel() {
    const wrap = document.createElement("section");
    wrap.id = ITEMS_PANEL_ID;
    wrap.className = "tt-qi-card";

    const header = document.createElement("div");
    header.className = "tt-qi-header";

    const title = document.createElement("div");
    title.className = "tt-qi-title";
    title.textContent = "Quick Items";

    const options = document.createElement("div");
    options.className = "tt-qi-options";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "tt-qi-btn";
    editBtn.id = "tt-qi-edit";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      itemsEditing = !itemsEditing;
      editBtn.classList.toggle("tt-qi-active", itemsEditing);
      setItemsOverlay(itemsEditing);
      scheduleItemsRender();
    });

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "tt-qi-btn";
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      itemsState.items = [];
      saveItemsState(itemsState);
      scheduleItemsRender();
    });

    options.appendChild(editBtn);
    options.appendChild(clearBtn);

    header.appendChild(title);
    header.appendChild(options);

    const body = document.createElement("div");
    body.className = "tt-qi-body";

    const inner = document.createElement("div");
    inner.className = "tt-qi-inner";
    inner.setAttribute("aria-label", "Quick items list");

    const response = document.createElement("div");
    response.className = "tt-qi-response-wrap";
    response.style.display = "none";

    body.appendChild(inner);
    body.appendChild(response);

    wrap.appendChild(header);
    wrap.appendChild(body);

    return wrap;
  }

  function scheduleItemsRender() {
    if (itemsRenderTick) clearTimeout(itemsRenderTick);
    itemsRenderTick = setTimeout(renderItems, 80);
  }

  function renderItems() {
    const panel = document.getElementById(ITEMS_PANEL_ID);
    if (!panel) return;

    const inner = panel.querySelector(".tt-qi-inner");
    const response = panel.querySelector(".tt-qi-response-wrap");
    if (!(inner instanceof HTMLElement) || !(response instanceof HTMLElement)) return;

    inner.textContent = "";

    for (const item of itemsState.items) {
      inner.appendChild(buildItemsQuickEl(item, response));
    }

    if (!itemsState.items.length) {
      const empty = document.createElement("div");
      empty.className = "tt-qi-empty";
      empty.innerHTML = itemsEditing
        ? "Edit mode: open any category and tap an item to add/remove it here."
        : "No quick items yet. Click <strong>Edit</strong> to add.";
      inner.appendChild(empty);
    }
  }

  function buildItemsQuickEl(item, responseWrap) {
    const id = item.id;
    const xid = item.xid;
    const name = item.name || String(id);

    const box = document.createElement("div");
    box.className = "tt-qi-item";
    box.dataset.id = String(id);
    box.setAttribute("draggable", "true");

    const pic = document.createElement("div");
    pic.className = "tt-qi-pic";
    pic.style.backgroundImage = `url(/images/items/${id}/medium.png)`;
    pic.title = (/^\d+$/.test(String(name)) && typeof TORN_ITEMS !== "undefined" && TORN_ITEMS && TORN_ITEMS[id] && TORN_ITEMS[id].name) ? TORN_ITEMS[id].name : name;

    const label = document.createElement("div");
    label.className = "tt-qi-text";
    label.textContent = (/^\d+$/.test(String(name)) && typeof TORN_ITEMS !== "undefined" && TORN_ITEMS && TORN_ITEMS[id] && TORN_ITEMS[id].name) ? TORN_ITEMS[id].name : name;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "tt-qi-remove";
    remove.title = "Remove";
    remove.textContent = "×";
    remove.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      itemsRemove(id);
    });

    if (itemsEditing) box.classList.add("tt-qi-editing");
    else box.classList.remove("tt-qi-editing");

    box.appendChild(pic);
    box.appendChild(label);
    box.appendChild(remove);

    box.addEventListener("click", async (e) => {
      if (itemsEditing) return;
      e.preventDefault();
      e.stopPropagation();
      if ((item.category || "").toLowerCase() === "temporary" && xid != null && Number.isFinite(xid)) {
      await itemsEquip(id, xid, responseWrap);
    } else {
      await itemsUse(id, responseWrap);
    }
    });

    box.addEventListener("dragstart", (e) => {
      if (!(e.currentTarget instanceof Element)) return;
      itemsMovingEl = e.currentTarget;
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", String(id)); } catch {}
      try { e.dataTransfer.setDragImage(e.currentTarget, 0, 0); } catch {}
      box.classList.add("tt-qi-dragging");
    });

    box.addEventListener("dragend", async () => {
      box.classList.remove("tt-qi-dragging");
      itemsMovingEl = null;
      await itemsPersistOrder();
    });

    box.addEventListener("dragover", (e) => e.preventDefault());

    box.addEventListener("dragenter", (e) => {
      if (!itemsMovingEl) return;
      if (!(e.currentTarget instanceof Element)) return;
      if (itemsMovingEl === e.currentTarget) return;

      const parent = e.currentTarget.parentElement;
      if (!parent) return;

      const children = Array.from(parent.children);
      const movingIdx = children.indexOf(itemsMovingEl);
      const targetIdx = children.indexOf(e.currentTarget);

      if (movingIdx === -1 || targetIdx === -1) return;

      if (movingIdx > targetIdx) parent.insertBefore(itemsMovingEl, e.currentTarget);
      else parent.insertBefore(itemsMovingEl, e.currentTarget.nextElementSibling);
    });

    return box;
  }

  async function itemsPersistOrder() {
    const panel = document.getElementById(ITEMS_PANEL_ID);
    if (!panel) return;
    const inner = panel.querySelector(".tt-qi-inner");
    if (!(inner instanceof HTMLElement)) return;

    const ids = Array.from(inner.querySelectorAll(".tt-qi-item"))
      .map((x) => parseInt(x.dataset.id || "", 10))
      .filter((n) => Number.isFinite(n));

    if (!ids.length) return;

    const map = new Map(itemsState.items.map((x) => [x.id, x]));
    const next = [];
    for (const id of ids) {
      const found = map.get(id);
      if (found) next.push(found);
    }
    itemsState.items = next;
    saveItemsState(itemsState);
  }

  function itemsAllow(id, category) {
    if (ITEMS_ALLOWED_CATEGORIES.includes(category)) return true;
    if (ITEMS_TEMP_IDS.has(id)) return true;
    return false;
  }

  function itemsToggle(item) {
    if (!item || !Number.isFinite(item.id)) return;

    if (itemsState.items.some((x) => x.id === item.id)) {
      itemsRemove(item.id);
      return;
    }

    itemsState.items.push({ id: item.id, xid: item.xid != null && Number.isFinite(item.xid) ? item.xid : undefined, name: normalizeNameFromText(item.name || String(item.id)) || (item.name || String(item.id)), category: item.category || "" });
    saveItemsState(itemsState);
    scheduleItemsRender();
  }

  function itemsRemove(id) {
    itemsState.items = itemsState.items.filter((x) => x.id !== id);
    saveItemsState(itemsState);
    scheduleItemsRender();
  }

  
  function itemsExtractMessage(htmlText) {
    try {
      const doc = new DOMParser().parseFromString(String(htmlText || ""), "text/html");

      const pick =
        doc.querySelector(".use-act, .use-action, .action-wrap, .response-wrap, .item-use, .msg, .message") ||
        doc.querySelector("body");

      const text = (pick ? pick.textContent : "") || "";
      return text.replace(/\s+/g, " ").trim();
    } catch {
      return String(htmlText || "").replace(/\s+/g, " ").trim();
    }
  }

  function itemsRenderResponse(responseWrap, id, messageText) {
    const safe = escapeHtml(String(messageText || ""))
      .replace(/\n+/g, "\n")
      .replace(/\n/g, "<br>");

    responseWrap.style.display = "block";
    responseWrap.innerHTML = `
      <div class="tt-qi-response-inner">
        <div class="tt-qi-response-head">
          <a href="#" class="tt-qi-close close-act t-blue h">Close</a>
        </div>
        <div class="tt-qi-response-body">
          <div class="tt-qi-response-msg">${safe || "Done."}</div>
          <div class="tt-qi-response-actions">
            <button type="button" class="tt-qi-action tt-qi-action-use-again" data-id="${escapeHtml(String(id))}">Use another</button>
            <button type="button" class="tt-qi-action tt-qi-action-armoury" data-id="${escapeHtml(String(id))}">Use from armory</button>
          </div>
        </div>
      </div>
    `;

    const btnAgain = responseWrap.querySelector(".tt-qi-action-use-again");
    if (btnAgain) {
      btnAgain.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await itemsUse(id, responseWrap);
      });
    }

    const btnArm = responseWrap.querySelector(".tt-qi-action-armoury");
    if (btnArm) {
      btnArm.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPendingArmouryAction(id, "use");
        location.assign("/factions.php?step=your#/tab=armoury");
      });
    }

    responseWrap.querySelectorAll(".counter-wrap").forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      el.classList.add(ITEMS_TRACKED_TIMER_CLASS);
      const t = el.dataset.secondsLeft ? parseInt(el.dataset.secondsLeft, 10) : parseInt(el.dataset.time || "0", 10);
      el.textContent = itemsFormatTimer(Number.isFinite(t) ? t : 0);
      el.dataset.secondsLeft = String(Number.isFinite(t) ? t : 0);
    });
  }

  async function itemsUse(id, responseWrap) {
    responseWrap.style.display = "block";
    responseWrap.innerHTML = `<div class="tt-qi-response-inner"><div class="tt-qi-response-head">Using item ${escapeHtml(String(id))}…</div></div>`;

    const body = new URLSearchParams();
    body.set("step", "useItem");
    body.set("id", String(id));
    body.set("itemID", String(id));

    let text = "";
    try {
      const res = await fetch("/item.php", {
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "text/html, application/json, */*",
        },
      });
      text = await res.text();
    } catch (e) {
      text = "Request failed.";
    }

    const msg = itemsExtractMessage(text) || "Done.";
    itemsRenderResponse(responseWrap, id, msg);
  }

  async function itemsEquip(id, xid, responseWrap) {
    responseWrap.style.display = "block";
    responseWrap.innerHTML = `<div class="tt-qi-response-inner"><div class="tt-qi-response-head">Equipping item ${escapeHtml(String(id))}…</div></div>`;

    const body = new URLSearchParams();
    body.set("step", "actionForm");
    body.set("confirm", "1");
    body.set("action", "equip");
    body.set("id", String(xid));

    let text = "";
    try {
      const res = await fetch("/item.php", {
        method: "POST",
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "Accept": "text/html, application/json, */*",
        },
      });
      text = await res.text();
    } catch (e) {
      text = "Request failed.";
    }

    const msg = itemsExtractMessage(text) || "Done.";
    itemsRenderResponse(responseWrap, id, msg);
  }

function itemsFormatTimer(totalSeconds) {
    totalSeconds = Math.max(0, totalSeconds | 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
    if (mins > 0) return `${mins}m ${String(secs).padStart(2, "0")}s`;
    return `${secs}s`;
  }

  function itemsTimerTickerStart() {
    setInterval(() => {
      document.querySelectorAll(`.counter-wrap.${ITEMS_TRACKED_TIMER_CLASS}`).forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        let secondsLeft = 0;
        if (el.dataset.secondsLeft) secondsLeft = parseInt(el.dataset.secondsLeft, 10);
        else secondsLeft = parseInt(el.dataset.time || "0", 10);

        if (!Number.isFinite(secondsLeft)) secondsLeft = 0;
        secondsLeft = Math.max(0, secondsLeft - 1);

        el.textContent = itemsFormatTimer(secondsLeft);
        el.dataset.secondsLeft = String(secondsLeft);
      });
    }, 1000);
  }

  function setItemsOverlay(enabled) {
    let overlay = document.getElementById("tt-qi-overlay");
    if (enabled) {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "tt-qi-overlay";
        overlay.className = "tt-qi-overlay";
        document.body.appendChild(overlay);
      }
      overlay.classList.remove("tt-qi-hidden");
      document.body.classList.add("tt-qi-overlay-on");
    } else {
      if (overlay) overlay.classList.add("tt-qi-hidden");
      document.body.classList.remove("tt-qi-overlay-on");
    }
  }

  function migrateItemsNames() {
    let changed = false;
    for (const it of itemsState.items) {
      const cleaned = normalizeNameFromText(it.name);
      if (cleaned && cleaned !== it.name) {
        it.name = cleaned;
        changed = true;
      }
    }
    if (changed) saveItemsState(itemsState);
  }

  function loadItemsState() {
    try {
      const raw = gmGet(ITEMS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      return {
        items: items
          .map((x) => ({
            id: parseInt(String(x.id), 10),
            xid: x && x.xid != null && String(x.xid).match(/^\d+$/) ? parseInt(String(x.xid), 10) : undefined,
            name: typeof x.name === "string" ? x.name : "",
            category: typeof x.category === "string" ? x.category : "",
          }))
          .filter((x) => Number.isFinite(x.id)),
      };
    } catch {
      return { items: [] };
    }
  }

  function saveItemsState(next) {
    try { gmSet(ITEMS_STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function injectItemsStylesOnce() {
    if (document.getElementById(ITEMS_STYLE_ID)) return;

    const css = `
      .tt-qi-card { margin-top: 8px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); backdrop-filter: blur(6px); overflow: hidden; }
      .tt-qi-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,0.10); }
      .tt-qi-title { font-weight: 800; letter-spacing: 0.2px; font-size: 14px; }
      .tt-qi-options { display: flex; gap: 8px; }
      .tt-qi-btn { border-radius: 10px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: inherit; padding: 6px 10px; font-weight: 700; cursor: pointer; font-size: 13px; }
      .tt-qi-btn.tt-qi-active { background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.22); }
      .tt-qi-body { padding: 10px; display: grid; gap: 10px; }
      .tt-qi-inner { display: grid; grid-template-columns: repeat(auto-fill, minmax(58px, 1fr)); gap: 6px; align-items: stretch; }
      .tt-qi-empty { grid-column: 1 / -1; padding: 10px; border-radius: 10px; border: 1px dashed rgba(255,255,255,0.16); opacity: 0.85; font-size: 13px; }
      .tt-qi-item { position: relative; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); padding: 6px; cursor: pointer; user-select: none; overflow: hidden; }
      .tt-qi-item.tt-qi-dragging { opacity: 0.55; }
      .tt-qi-pic { width: 100% !important; height: 52px !important; max-height: 52px !important; border-radius: 10px; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; border: 1px solid rgba(255,255,255,0.10); }
      .tt-qi-text { margin-top: 6px; font-size: 11px; line-height: 1.2; font-weight: 700; opacity: 0.92; height: 2.4em; overflow: hidden; }
      .tt-qi-remove { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.35); color: inherit; cursor: pointer; display: none; font-weight: 900; line-height: 18px; }
      .tt-qi-item.tt-qi-editing .tt-qi-remove { display: inline-flex; align-items: center; justify-content: center; }
      .tt-qi-response-wrap { border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.22); padding: 10px; }
      .tt-qi-response-actions { display: flex; gap: 10px; margin-bottom: 8px; font-weight: 700; font-size: 13px; }
      .tt-qi-response-body { font-size: 13px; opacity: 0.95; }
      .tt-qi-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9998; pointer-events: none; }
      .tt-qi-hidden { display: none !important; }
      body.tt-qi-overlay-on #tt-quick-items-panel { position: relative; z-index: 9999; }
      body.tt-qi-overlay-on ul.items-cont > li[data-item] { outline: 2px solid rgba(255,255,255,0.12); outline-offset: -2px; }
    `.trim();

    const style = document.createElement("style");
    style.id = ITEMS_STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // -------------------------
  // Armoury Quick Items module
  // -------------------------
  const ARM_STORAGE_KEY = "tt_armoury_quick_items_v1";
  const ARM_PANEL_ID = "tt-armoury-quick-items-panel";
  const ARM_STYLE_ID = "tt-armoury-quick-items-style";

  let armState = loadArmState();
  let armAutomationActive = false;
let armMounted = false;
  let armEditing = false;
  let armMovingEl = null;
  let armRenderTick = null;

  function isOnArmouryTab() {
    const href = location.href;
    const hash = location.hash || "";
    return /factions\.php/i.test(href) && /tab=armoury/i.test(hash);
  }

  function findArmouryAnchor() {
    return (
      document.querySelector("#faction-armoury") ||
      document.querySelector(".faction-armoury") ||
      document.querySelector(".armoury-wrap") ||
      document.querySelector(".armoury") ||
      document.querySelector(".faction-content") ||
      document.querySelector(".content-wrapper[role='main']") ||
      document.body
    );
  }

  function mountArm() {
    document.querySelectorAll(`#${ARM_PANEL_ID}`).forEach((p, i) => { if (i > 0) p.remove(); });
    const existing = document.getElementById(ARM_PANEL_ID);
    if (existing) {
      armMounted = true;
      return;
    }

    const anchor = findArmouryAnchor();
    if (!anchor || !anchor.parentNode) return;

    const panel = buildArmPanel();
    anchor.parentNode.insertBefore(panel, anchor);

    armMounted = true;
    scheduleArmRender();
    armConsumePendingAction();
  }

  function unmountArm() {
    armMounted = false;
    armEditing = false;

    const panel = document.getElementById(ARM_PANEL_ID);
    if (panel) panel.remove();

    setArmOverlay(false);
    clearArmHighlights();
  }

  
  function armConsumePendingAction() {
    if (!isOnArmouryTab()) return;
    const pending = getPendingArmouryAction();
    if (!pending) return;

    // only keep pending for a short time window
    if (pending.ts && Date.now() - pending.ts > 2 * 60 * 1000) {
      clearPendingArmouryAction();
      return;
    }

    clearPendingArmouryAction();

    // try after a short delay so the list can render
    setTimeout(() => {
      armQuickAction(pending.id, pending.mode === "use");
    }, 450);
  }

function buildArmPanel() {
    const wrap = document.createElement("section");
    wrap.id = ARM_PANEL_ID;
    wrap.className = "tt-aqi-card";

    const header = document.createElement("div");
    header.className = "tt-aqi-header";

    const title = document.createElement("div");
    title.className = "tt-aqi-title";
    title.textContent = "Armoury Quick Items";

    const options = document.createElement("div");
    options.className = "tt-aqi-options";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "tt-aqi-btn";
    editBtn.id = "tt-aqi-edit";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      armEditing = !armEditing;
      editBtn.classList.toggle("tt-aqi-active", armEditing);
      setArmOverlay(armEditing);
      scheduleArmRender();
    });

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "tt-aqi-btn";
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      armState.items = [];
      saveArmState(armState);
      scheduleArmRender();
    });

    options.appendChild(editBtn);
    options.appendChild(clearBtn);

    header.appendChild(title);
    header.appendChild(options);

    const body = document.createElement("div");
    body.className = "tt-aqi-body";

    const inner = document.createElement("div");
    inner.className = "tt-aqi-inner";

    const hint = document.createElement("div");
    hint.className = "tt-aqi-hint";
    hint.innerHTML = "Edit mode: click an item in the armoury to add/remove it here. Normal mode: click a quick item to jump to it.";

    body.appendChild(inner);
    body.appendChild(hint);

    wrap.appendChild(header);
    wrap.appendChild(body);

    return wrap;
  }

  function scheduleArmRender() {
    if (armRenderTick) clearTimeout(armRenderTick);
    armRenderTick = setTimeout(renderArm, 80);
  }

  function renderArm() {
    const panel = document.getElementById(ARM_PANEL_ID);
    if (!panel) return;

    const inner = panel.querySelector(".tt-aqi-inner");
    if (!(inner instanceof HTMLElement)) return;

    inner.textContent = "";

    for (const item of armState.items) {
      inner.appendChild(buildArmQuickEl(item));
    }

    if (!armState.items.length) {
      const empty = document.createElement("div");
      empty.className = "tt-aqi-empty";
      empty.textContent = armEditing ? "Click items in the armoury to add them." : "No armoury quick items yet. Click Edit to add.";
      inner.appendChild(empty);
    }
  }

  function buildArmQuickEl(item) {
    const id = item.id;
    const xid = item.xid;
    const name = item.name || String(id);

    const box = document.createElement("div");
    box.className = "tt-aqi-item";
    box.dataset.id = String(id);
    box.setAttribute("draggable", "true");

    const pic = document.createElement("div");
    pic.className = "tt-aqi-pic";
    pic.style.backgroundImage = `url(/images/items/${id}/medium.png)`;
    pic.title = (/^\d+$/.test(String(name)) && typeof TORN_ITEMS !== "undefined" && TORN_ITEMS && TORN_ITEMS[id] && TORN_ITEMS[id].name) ? TORN_ITEMS[id].name : name;

    const label = document.createElement("div");
    label.className = "tt-aqi-text";
    label.textContent = (/^\d+$/.test(String(name)) && typeof TORN_ITEMS !== "undefined" && TORN_ITEMS && TORN_ITEMS[id] && TORN_ITEMS[id].name) ? TORN_ITEMS[id].name : name;

    if (/^\d+$/.test(String(label.textContent))) {
      fetchItemNameNoApi(id).then((n) => {
        if (n && box.isConnected) {
          label.textContent = n;
          pic.title = n;
          const it = armState.items.find((x) => x.id === id);
          if (it) {
            it.name = n;
            saveArmState(armState);
          }
        }
      });
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "tt-aqi-remove";
    remove.title = "Remove";
    remove.textContent = "×";
    remove.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      armRemove(id);
    });

    if (armEditing) box.classList.add("tt-aqi-editing");
    else box.classList.remove("tt-aqi-editing");

    box.appendChild(pic);
    box.appendChild(label);
    box.appendChild(remove);

    box.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (armEditing) return;
      armQuickAction(id, true);
    });

    box.addEventListener("dragstart", (e) => {
      if (!(e.currentTarget instanceof Element)) return;
      armMovingEl = e.currentTarget;
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", String(id)); } catch {}
      try { e.dataTransfer.setDragImage(e.currentTarget, 0, 0); } catch {}
      box.classList.add("tt-aqi-dragging");
    });

    box.addEventListener("dragend", async () => {
      box.classList.remove("tt-aqi-dragging");
      armMovingEl = null;
      await armPersistOrder();
    });

    box.addEventListener("dragover", (e) => e.preventDefault());

    box.addEventListener("dragenter", (e) => {
      if (!armMovingEl) return;
      if (!(e.currentTarget instanceof Element)) return;
      if (armMovingEl === e.currentTarget) return;

      const parent = e.currentTarget.parentElement;
      if (!parent) return;

      const children = Array.from(parent.children);
      const movingIdx = children.indexOf(armMovingEl);
      const targetIdx = children.indexOf(e.currentTarget);

      if (movingIdx === -1 || targetIdx === -1) return;

      if (movingIdx > targetIdx) parent.insertBefore(armMovingEl, e.currentTarget);
      else parent.insertBefore(armMovingEl, e.currentTarget.nextElementSibling);
    });

    return box;
  }

  async function armPersistOrder() {
    const panel = document.getElementById(ARM_PANEL_ID);
    if (!panel) return;
    const inner = panel.querySelector(".tt-aqi-inner");
    if (!(inner instanceof HTMLElement)) return;

    const ids = Array.from(inner.querySelectorAll(".tt-aqi-item"))
      .map((x) => parseInt(x.dataset.id || "", 10))
      .filter((n) => Number.isFinite(n));

    if (!ids.length) return;

    const map = new Map(armState.items.map((x) => [x.id, x]));
    const next = [];
    for (const id of ids) {
      const found = map.get(id);
      if (found) next.push(found);
    }
    armState.items = next;
    saveArmState(armState);
  }

  function armToggle(item) {
    if (!item || !Number.isFinite(item.id)) return;

    if (armState.items.some((x) => x.id === item.id)) {
      armRemove(item.id);
      return;
    }

    armState.items.push({ id: item.id, name: normalizeNameFromText(item.name || String(item.id)) || (item.name || String(item.id)) });


    const added = armState.items.find((x) => x.id === item.id);
    if (added && (!added.name || /^\d+$/.test(String(added.name)))) {
      fetchItemNameNoApi(item.id).then((n) => {
        if (!n) return;
        added.name = n;
        saveArmState(armState);
        scheduleArmRender();
      });
    }
    saveArmState(armState);
    scheduleArmRender();
  }

  function armRemove(id) {
    armState.items = armState.items.filter((x) => x.id !== id);
    saveArmState(armState);
    scheduleArmRender();
  }

  function clearArmHighlights() {
    try {
      document.querySelectorAll(".tt-aqi-highlight").forEach((x) => x.classList.remove("tt-aqi-highlight"));
    } catch {}
  }

  function armFindRowById(id) {
    const selectors = [
      `[data-item="${id}"]`,
      `[data-id="${id}"]`,
      `[data-itemid="${id}"]`,
      `[data-item-id="${id}"]`,
      `li[data-item="${id}"]`,
      `div[data-item="${id}"]`,
      `tr[data-item="${id}"]`,
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el instanceof HTMLElement) {
        return el.closest("tr, li, .item, .armoury-item, [data-item], [data-id]") || el;
      }
    }

    // Look for images using the items CDN path
    const imgSel = `img[src*="/images/items/${id}/"], img[data-src*="/images/items/${id}/"]`;
    for (const img of Array.from(document.querySelectorAll(imgSel))) {
      if (!(img instanceof HTMLElement)) continue;
      const row = img.closest("tr, li, .item, .armoury-item, [data-item], [data-id], [class*='armour']") || img.parentElement;
      if (row instanceof HTMLElement) return row;
    }

    // Look for background-image nodes
    const bgNodes = Array.from(document.querySelectorAll(`[style*="/images/items/${id}/"]`));
    for (const node of bgNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const row = node.closest("tr, li, .item, .armoury-item, [data-item], [data-id], [class*='armour']") || node;
      if (row instanceof HTMLElement) return row;
    }

    return null;
  }

  function armIsVisible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    return true;
  }

  function armClickBestAction(container, preferUse) {
    if (!(container instanceof Element)) return false;

    const candidates = Array.from(container.querySelectorAll("button, a, input[type='button'], input[type='submit'], [role='button'], .btn, .button, .torn-btn, .action, [onclick], [data-action]"))
      .filter((x) => x instanceof HTMLElement)
      .filter(armIsVisible);

    if (!candidates.length) return false;

    const score = (el) => {
      const t = ((el.getAttribute("aria-label") || "") + " " + (el.getAttribute("title") || "") + " " + (el.textContent || "")).trim().toLowerCase();
      const c = (el.className || "").toString().toLowerCase();
      let s = 0;

      const hasUse = t.includes("use from armory") || t.includes("use from armoury") || t === "use" || t.includes(" use ");
      const hasWithdraw = t.includes("withdraw") || t.includes("take");

      if (hasUse) s += preferUse ? 140 : 80;
      if (hasWithdraw) s += preferUse ? 90 : 130;

      if (c.includes("withdraw")) s += preferUse ? 60 : 90;
      if (c.includes("take")) s += preferUse ? 55 : 85;
      if (c.includes("use")) s += preferUse ? 70 : 40;

      if (t.includes("remove")) s += 20;
      if (c.includes("action")) s += 10;

      if (t.includes("close") || t.includes("cancel")) s -= 100;
      return s;
    };

    candidates.sort((a, b) => score(b) - score(a));
    const best = candidates[0];
    if (score(best) <= 0) return false;

    try {
      best.click();
      return true;
    } catch {
      return false;
    }
  }

  
  function armQuickAction(id, preferUse) {
    // preferUse=true means try "use from armory" first, else withdraw/take
    armJumpToAndWithdraw(id, !!preferUse);
  }

function armJumpToAndWithdraw(id, preferUse) {
    let clicked = false;
    if (armAutomationActive) return;
    armAutomationActive = true;

    try {
      clearArmHighlights();

      const row = armFindRowById(id);
      if (!(row instanceof HTMLElement)) return;

      const root =
        row.closest('[id*="armoury"], [class*="armoury"], [id*="faction"], [class*="faction"], .content-wrapper, [role="main"]') ||
        document.body;

      row.classList.add("tt-aqi-highlight");
      row.scrollIntoView({ behavior: "smooth", block: "center" });

      const clickBest = (container) => armClickBestAction(container, !!preferUse);

      // 1) If an action is already visible, click it immediately.
      if (clickBest(row)) { clicked = true; return; }

      // 2) Click the row / picture to reveal actions.
      const clickTarget =
        row.querySelector("img") ||
        row.querySelector('[style*="/images/items/"], [style*="background-image"]') ||
        row.querySelector(".title, .name") ||
        row;

      try { clickTarget.click(); } catch {}

      // 3) Retry a few times (actions often render after animation/XHR).
      const delays = [250, 650, 1100, 1600];
      for (const d of delays) {
        setTimeout(() => {
          if (clickBest(row)) { clicked = true; return; }
          const parent = row.parentElement;
          if (parent && clickBest(parent)) { clicked = true; return; }
          if (root && clickBest(root)) { clicked = true; return; }
          if (clickBest(document.body)) { clicked = true; return; }
        }, d);
      }
    } finally {
      setTimeout(() => {
        armAutomationActive = false;
        clearArmHighlights();
        if (!clicked && TT_QI_DEBUG) console.warn('[TT-QI] Armoury quick action: no matching action button found for item', id);
      }, 2200);
    }
  }

  function setArmOverlay(enabled) {
    let overlay = document.getElementById("tt-aqi-overlay");
    if (enabled) {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "tt-aqi-overlay";
        overlay.className = "tt-aqi-overlay";
        document.body.appendChild(overlay);
      }
      overlay.classList.remove("tt-aqi-hidden");
      document.body.classList.add("tt-aqi-overlay-on");
    } else {
      if (overlay) overlay.classList.add("tt-aqi-hidden");
      document.body.classList.remove("tt-aqi-overlay-on");
    }
  }

  function loadArmState() {
    try {
      const raw = gmGet(ARM_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      return {
        items: items
          .map((x) => ({
            id: parseInt(String(x.id), 10),
            name: typeof x.name === "string" ? x.name : "",
          }))
          .filter((x) => Number.isFinite(x.id)),
      };
    } catch {
      return { items: [] };
    }
  }

  function saveArmState(next) {
    try { gmSet(ARM_STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function injectArmStylesOnce() {
    if (document.getElementById(ARM_STYLE_ID)) return;

    const css = `
      .tt-aqi-card { margin-top: 8px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); backdrop-filter: blur(6px); overflow: hidden; }
      .tt-aqi-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,0.10); }
      .tt-aqi-title { font-weight: 800; letter-spacing: 0.2px; font-size: 14px; }
      .tt-aqi-options { display: flex; gap: 8px; }
      .tt-aqi-btn { border-radius: 10px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: inherit; padding: 6px 10px; font-weight: 700; cursor: pointer; font-size: 13px; }
      .tt-aqi-btn.tt-aqi-active { background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.22); }
      .tt-aqi-body { padding: 10px; display: grid; gap: 10px; }
      .tt-aqi-inner { display: grid; grid-template-columns: repeat(auto-fill, minmax(58px, 1fr)); gap: 6px; align-items: stretch; }
      .tt-aqi-empty { grid-column: 1 / -1; padding: 10px; border-radius: 10px; border: 1px dashed rgba(255,255,255,0.16); opacity: 0.85; font-size: 13px; }
      .tt-aqi-item { position: relative; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); padding: 6px; cursor: pointer; user-select: none; overflow: hidden; }
      .tt-aqi-item.tt-aqi-dragging { opacity: 0.55; }
      .tt-aqi-pic { width: 100% !important; height: 52px !important; max-height: 52px !important; border-radius: 10px; background-size: contain !important; background-repeat: no-repeat !important; background-position: center !important; border: 1px solid rgba(255,255,255,0.10); }
      .tt-aqi-text { margin-top: 6px; font-size: 11px; line-height: 1.2; font-weight: 700; opacity: 0.92; height: 2.4em; overflow: hidden; }
      .tt-aqi-remove { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.35); color: inherit; cursor: pointer; display: none; font-weight: 900; line-height: 18px; }
      .tt-aqi-item.tt-aqi-editing .tt-aqi-remove { display: inline-flex; align-items: center; justify-content: center; }
      .tt-aqi-hint { font-size: 12px; opacity: 0.78; }
      .tt-aqi-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 9998; pointer-events: none; }
      .tt-aqi-hidden { display: none !important; }
      body.tt-aqi-overlay-on #tt-armoury-quick-items-panel { position: relative; z-index: 9999; }
      .tt-aqi-highlight { outline: 3px solid rgba(255,255,255,0.28); outline-offset: 2px; }
    `.trim();

    const style = document.createElement("style");
    style.id = ARM_STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // -------------------------
  // Global click handler
  // -------------------------
  document.addEventListener("click", onGlobalClick, true);

  function onGlobalClick(event) {
    if (armAutomationActive) return;
    const t = event.target;
    if (!(t instanceof Element)) return;

    // Items response close
    if (t.classList.contains("tt-qi-close-act")) {
      event.preventDefault();
      event.stopPropagation();
      const wrap = t.closest(".tt-qi-response-wrap");
      if (wrap) wrap.style.display = "none";
      return;
    }

    // Items edit mode: click items list rows (delegated)
    if (itemsMounted && itemsEditing && isOnItemsPage()) {
      const li = t.closest("ul.items-cont li[data-item]");
      if (li instanceof HTMLElement) {
        const id = parseInt(li.dataset.item || "", 10);
        const category = li.dataset.category || "";
        if (Number.isFinite(id) && itemsAllow(id, category)) {
          event.preventDefault();
          event.stopPropagation();
          const name = extractItemsListName(li) || String(id);
          let xid;
          const act = li.querySelector('.actions[xid]');
          if (act) {
            const v = act.getAttribute('xid');
            if (v && /^\d+$/.test(v)) xid = parseInt(v, 10);
          }
          itemsToggle({ id, xid, name, category });
          return;
        }
      }
    }

    // Armoury edit mode: click armoury item elements (delegated)
    if (armMounted && armEditing && isOnArmouryTab()) {
      const itemEl =
        t.closest("[data-item]") ||
        t.closest("[data-itemid]") ||
        t.closest("[data-item-id]") ||
        t.closest("[data-id]") ||
        t.closest("[data-uid]") ||
        t.closest("li") ||
        t.closest("div");

      if (itemEl instanceof HTMLElement) {
        const id = extractItemIdFromAny(itemEl);

        if (id != null && Number.isFinite(id)) {
          event.preventDefault();
          event.stopPropagation();
          const name = extractArmouryItemName(itemEl) || String(id);
          armToggle({ id, name });
          return;
        }
      }
    }
  }

  // -------------------------
  // Route watcher (single)
  // -------------------------
  injectItemsStylesOnce();
  injectArmStylesOnce();
  itemsTimerTickerStart();

  function onRouteChange() {
    handleItemsRoute().catch(() => {});
    handleArmRoute().catch(() => {});
  }

  async function handleItemsRoute() {
    if (!isOnItemsPage()) {
      if (itemsMounted) unmountItems();
      return;
    }

    await requireElement(".equipped-items-wrap", 20000).catch(() => null);

    if (!isOnItemsPage()) {
      if (itemsMounted) unmountItems();
      return;
    }

    if (!itemsMounted) mountItems();
    scheduleItemsRender();
  }

  async function handleArmRoute() {
    if (!isOnArmouryTab()) {
      if (armMounted) unmountArm();
      return;
    }

    await requireElementAny(
      [
        "#faction-armoury",
        ".faction-armoury",
        ".armoury",
        ".armoury-wrap",
        ".faction-content",
        ".content-wrapper[role='main']",
      ],
      20000
    ).catch(() => null);

    if (!isOnArmouryTab()) {
      if (armMounted) unmountArm();
      return;
    }

    if (!armMounted) mountArm();
    scheduleArmRender();
  }

  // Patch history once (to catch Torn route changes)
  if (!window.__ttCombinedHistoryPatched) {
    window.__ttCombinedHistoryPatched = true;

    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function () {
      origPushState.apply(this, arguments);
      onRouteChange();
    };
    history.replaceState = function () {
      origReplaceState.apply(this, arguments);
      onRouteChange();
    };

    window.addEventListener("popstate", onRouteChange);
    window.addEventListener("hashchange", onRouteChange);
  }

  setInterval(onRouteChange, 700);
  onRouteChange();
})();

  const PENDING_ARM_ACTION_KEY = "tt_qi_pending_arm_action";

  function setPendingArmouryAction(id, mode) {
    try {
      sessionStorage.setItem(PENDING_ARM_ACTION_KEY, JSON.stringify({ id: Number(id), mode: String(mode || "use"), ts: Date.now() }));
    } catch {}
  }

  function getPendingArmouryAction() {
    try {
      const raw = sessionStorage.getItem(PENDING_ARM_ACTION_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !Number.isFinite(Number(obj.id))) return null;
      return { id: Number(obj.id), mode: String(obj.mode || "use"), ts: Number(obj.ts || 0) };
    } catch {
      return null;
    }
  }

  function clearPendingArmouryAction() {
    try { sessionStorage.removeItem(PENDING_ARM_ACTION_KEY); } catch {}
  }
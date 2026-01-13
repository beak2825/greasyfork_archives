// ==UserScript==
// @name         Torn Inventory Exporter 
// @namespace    https://torn.com/
// @version      0.4.1
// @description  Export Torn inventory items to clipboard (TSV) or download as CSV. script captures items while you scroll (no autoscroll).
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/bazaar.php*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562420/Torn%20Inventory%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/562420/Torn%20Inventory%20Exporter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const FLOAT_ID = "ttItemExporterFloatBtn";
  const STYLE_ID = "ttItemExporterStyle";

  // -------------------- utils --------------------
  function normInt(s) {
    if (!s) return 0;
    const m = String(s).replace(/[^\d]/g, "");
    return m ? parseInt(m, 10) : 0;
  }

 function normMoney(s) {
  if (!s) return 0;
  const text = String(s);

  // Match a real integer amount (comma-grouped correctly or plain digits)
  const AMT = /(\d{1,3}(?:,\d{3})+|\d+)/;

  // Prefer first $-prefixed amount
  const m = text.match(new RegExp("\\$\\s*" + AMT.source));
  if (m && m[1]) return parseInt(m[1].replace(/,/g, ""), 10);

  // Fallback: first valid integer anywhere
  const m2 = text.match(AMT);
  if (m2 && m2[1]) return parseInt(m2[1].replace(/,/g, ""), 10);

  return 0;
}


  function toTSV(rows) {
    return rows.map(r => r.map(v => String(v ?? "")).join("\t")).join("\n");
  }

  function toCSV(rows) {
    const esc = (v) => {
      const s = String(v ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    return rows.map(r => r.map(esc).join(",")).join("\n");
  }

  async function copyText(text) {
    try {
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(text, { type: "text", mimetype: "text/plain" });
        return true;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {}
    return false;
  }

  function downloadFile(filename, content, mime = "text/csv;charset=utf-8") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "ttItemExporterToast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${FLOAT_ID}{
        position: fixed;
        right: 16px;
        top: 110px;
        z-index: 2147483647;
        padding: 9px 10px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(0,0,0,0.72);
        color: #fff;
        cursor: pointer;
        font: 13px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        user-select: none;
      }
      #${FLOAT_ID}:hover{ background: rgba(0,0,0,0.86); }
      .ttItemExporterToast{
        position: fixed;
        right: 16px;
        top: 165px;
        z-index: 2147483647;
        padding: 10px 12px;
        border-radius: 10px;
        background: rgba(0,0,0,0.85);
        color: white;
        font: 13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        box-shadow: 0 6px 20px rgba(0,0,0,0.35);
      }
    `;
    document.documentElement.appendChild(style);
  }

  function currentMode() {
    if (location.pathname.includes("/item.php")) return "inventory";
    if (location.pathname.includes("/bazaar.php")) return "bazaar";
    return "unknown";
  }

  // -------------------- INVENTORY --------------------
  function safeText(el) {
    return (el?.textContent || "").trim();
  }

  function isBorrowedFromFaction(itemLi) {
    return Boolean(
      itemLi.querySelector('button.option-return-to-faction, li[data-action="return"][data-type="armoury"]')
    );
  }

  function scrapeInventoryRows() {
    const lis = Array.from(document.querySelectorAll("ul.itemsList > li[data-item]"));
    const rows = [];
    rows.push(["source", "item_id", "name", "quantity"]);

    const seen = new Set();

    for (const li of lis) {
      if (li.closest(".view-item-info")) continue;

      const item_id = li.getAttribute("data-item") || "";
      if (!item_id) continue;

      if (isBorrowedFromFaction(li)) continue;

      const name =
        safeText(li.querySelector(".title-wrap .name")) ||
        safeText(li.querySelector(".name")) ||
        "";

      if (!name) continue; // ghost nodes

      const qtyAttr = li.getAttribute("data-qty") || "";
      const qtyVisible = safeText(li.querySelector(".item-amount.qty"));
      const qty = normInt(qtyAttr || qtyVisible);

      if (seen.has(item_id)) continue;
      seen.add(item_id);

      rows.push(["inventory", item_id, name, qty]);
    }

    return rows;
  }

  // -------------------- BAZAAR (capture while user scrolls; no autoscroll) --------------------
  // Goal: one row per item_id, total qty correct for non-stack items.
  // We dedupe *per listing slot*, not per (item_id, price). Bazaar rows have translateY positioning; use that + column index.

  const bazaarListingCache = new Map(); // listingKey -> { item_id, name, priceEach, qty }
  const bazaarAgg = new Map();          // item_id -> { name, totalQty, totalPriceQty }
  let bazaarObserverStarted = false;

  function guessItemIdFromImg(imgEl) {
    if (!imgEl) return "";
    const srcset = imgEl.getAttribute("srcset") || "";
    const src = imgEl.getAttribute("src") || "";
    const blob = srcset || src;
    const m = blob.match(/\/images\/items\/(\d+)\//);
    return m ? m[1] : "";
  }

  function getRowTranslateY(rowEl) {
    if (!rowEl) return "";
    const t = rowEl.style?.transform || "";
    const m = t.match(/translateY\(([-\d.]+)px\)/);
    return m ? m[1] : "";
  }

  function getListingKey(cardEl) {
    // Prefer stable identity based on virtualization slot:
    // row translateY + index within row (so multiple same-item cards at same price count separately)
    const row = cardEl.closest('[data-testid="bazaar-items-row"]');
    const y = getRowTranslateY(row);
    const rowItems = row ? row.querySelector('[data-testid="row-items"]') : null;

    if (rowItems) {
      const children = Array.from(rowItems.querySelectorAll('[data-testid="item"]'));
      const idx = Math.max(0, children.indexOf(cardEl));
      if (y !== "") return `y:${y}::i:${idx}`;
    }

    // Fallback (less ideal, but keeps script functioning if DOM changes)
    const img = cardEl.querySelector('img[alt]');
    const item_id = guessItemIdFromImg(img);
    const name = (img?.getAttribute("alt") || "").trim();
    const priceEach = normMoney(cardEl.querySelector('[data-testid="price"]')?.textContent || "");
    return item_id ? `fallback:${item_id}::p:${priceEach}` : `fallbackname:${name}::p:${priceEach}`;
  }

  function applyListingToAgg(listingKey, listing) {
    const prev = bazaarListingCache.get(listingKey);

    // First time seeing this listing slot
    if (!prev) {
      bazaarListingCache.set(listingKey, { ...listing });

      const id = listing.item_id;
      if (!bazaarAgg.has(id)) {
        bazaarAgg.set(id, { name: listing.name || "", totalQty: 0, totalPriceQty: 0 });
      }
      const agg = bazaarAgg.get(id);
      if (listing.name && !agg.name) agg.name = listing.name;

      agg.totalQty += listing.qty;
      agg.totalPriceQty += listing.priceEach * listing.qty;
      return true;
    }

    // Slot seen before: update if something changed (qty/price)
    let changed = false;

    if (listing.name && !prev.name) { prev.name = listing.name; changed = true; }

    // If price changes for a listing slot (rare), adjust aggregates
    if (listing.priceEach !== prev.priceEach || listing.qty !== prev.qty) {
      const agg = bazaarAgg.get(prev.item_id);
      if (agg) {
        // remove old contribution
        agg.totalQty -= prev.qty;
        agg.totalPriceQty -= prev.priceEach * prev.qty;

        // add new contribution
        agg.totalQty += listing.qty;
        agg.totalPriceQty += listing.priceEach * listing.qty;

        if (listing.name && !agg.name) agg.name = listing.name;
      }

      prev.priceEach = listing.priceEach;
      prev.qty = listing.qty;
      prev.item_id = listing.item_id || prev.item_id;

      changed = true;
    }

    return changed;
  }

  function captureBazaarVisible() {
    let cards = [];
    const root = document.querySelector('[data-testid="bazaar-items"]');
    if (root) cards = Array.from(root.querySelectorAll('[data-testid="item"]'));
    if (!cards.length) cards = Array.from(document.querySelectorAll('[data-testid="item"]'));

    let changed = false;

    for (const card of cards) {
      const img = card.querySelector('img[alt]');
      const name = (img?.getAttribute("alt") || "").trim();
      const item_id = guessItemIdFromImg(img);
      if (!item_id) continue; // required for one-row-per-item_id export

      const priceEach = normMoney(card.querySelector('[data-testid="price"]')?.textContent || "");
      const qty = normInt(card.querySelector('[data-testid="amount-value"]')?.textContent || "");

      // NOTE: for non-stack items, qty is often "1" per listing card. :contentReference[oaicite:2]{index=2}
      // The fix is counting multiple listing slots, not trusting "price point" buckets.
      const listingKey = getListingKey(card);

      const didChange = applyListingToAgg(listingKey, { item_id, name, priceEach, qty: qty || 0 });
      if (didChange) changed = true;
    }

    return changed;
  }

  function startBazaarObserver(onUpdate) {
    if (bazaarObserverStarted) return;
    bazaarObserverStarted = true;

    captureBazaarVisible();
    if (typeof onUpdate === "function") onUpdate();

    const obs = new MutationObserver(() => {
      const changed = captureBazaarVisible();
      if (changed && typeof onUpdate === "function") onUpdate();
    });

    obs.observe(document.body, { childList: true, subtree: true });
  }

  function bazaarCapturedCount() {
    return bazaarAgg.size;
  }

  function scrapeBazaarRowsFromCache() {
    const rows = [];
    rows.push(["source", "item_id", "name", "quantity", "avg_price_each"]);

    const items = Array.from(bazaarAgg.entries()).map(([item_id, agg]) => {
      const avg = (agg.totalQty > 0) ? Math.round(agg.totalPriceQty / agg.totalQty) : 0;
      return { item_id, name: agg.name || "", qty: Math.max(0, agg.totalQty || 0), avg_price_each: avg };
    });

    items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    for (const it of items) {
      rows.push(["bazaar", it.item_id, it.name, it.qty, it.avg_price_each]);
    }

    return rows;
  }

  // -------------------- UI + export --------------------
  function updateButtonLabel(btn) {
    if (!btn) return;
    const mode = currentMode();
    if (mode === "bazaar") {
      btn.textContent = `Export items (captured: ${bazaarCapturedCount()})`;
      btn.title = "Scroll through your bazaar list first so items are captured, then click to copy TSV (Sheets-friendly).";
    } else if (mode === "inventory") {
      btn.textContent = "Export items";
      btn.title = "Scroll to load everything, then click to copy TSV (Sheets-friendly).";
    } else {
      btn.textContent = "Export items";
      btn.title = "Unsupported page";
    }
  }

  async function exportNow({ copy = true, download = false } = {}) {
    const mode = currentMode();

    try {
      let rows;

      if (mode === "inventory") {
        rows = scrapeInventoryRows();
      } else if (mode === "bazaar") {
        // Capture current viewport too, then export cache.
        captureBazaarVisible();
        rows = scrapeBazaarRowsFromCache();
      } else {
        toast("Unsupported page.");
        return;
      }

      const count = (rows?.length || 0) - 1;
      if (!rows || rows.length <= 1) {
        if (mode === "bazaar") toast("0 bazaar items captured yet — scroll your bazaar list first.");
        else toast("0 items found. Scroll to load everything, then try again.");
        return;
      }

      const tsv = toTSV(rows);
      const csv = toCSV(rows);

      if (copy) {
        const ok = await copyText(tsv);
        toast(ok ? `Copied ${count} rows (paste into Sheets)` : "Clipboard copy failed");
      }
      if (download) {
        downloadFile(`torn-${mode}-${nowStamp()}.csv`, csv);
        toast(`Downloaded CSV (${count} rows)`);
      }

      console.log(`[Torn Export] ${mode} rows:`, rows);
    } catch (err) {
      console.error("[Torn Export] Error:", err);
      toast("Export failed — check console (F12) for error.");
    }
  }

  function addFloatingButton() {
    if (document.getElementById(FLOAT_ID)) return;

    injectStyle();

    const btn = document.createElement("button");
    btn.id = FLOAT_ID;
    btn.type = "button";
    btn.addEventListener("click", () => exportNow({ copy: true, download: false }));

    document.body.appendChild(btn);
    updateButtonLabel(btn);

    if (currentMode() === "bazaar") {
      startBazaarObserver(() => updateButtonLabel(btn));
      // keep label fresh if bazaar route changes
      setInterval(() => updateButtonLabel(btn), 1500);
    }
  }

  // Menu commands
  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("Export (copy TSV to clipboard)", () => exportNow({ copy: true, download: false }));
    GM_registerMenuCommand("Export (download CSV)", () => exportNow({ copy: false, download: true }));
    GM_registerMenuCommand("Export (copy TSV + download CSV)", () => exportNow({ copy: true, download: true }));
  }

  addFloatingButton();
})();

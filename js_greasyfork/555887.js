// ==UserScript==
// @name         Weapon & Armor UIDs — Armory + Items (Owner Lookup)
// @namespace    https://torn.report/userscripts/
// @version      1.5
// @description  Crawl armory pages and show owner name (from Google Sheet WebApp) beside items.
// @author       Skeletron [318855] + IAMAPEX [2523988]
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/555887/Weapon%20%20Armor%20UIDs%20%E2%80%94%20Armory%20%2B%20Items%20%28Owner%20Lookup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555887/Weapon%20%20Armor%20UIDs%20%E2%80%94%20Armory%20%2B%20Items%20%28Owner%20Lookup%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PATH = location.pathname;

  const SHEET_API_URL =
    "https://script.google.com/macros/s/AKfycbwqFofNkV8DaZzgOD96LkzQUYL_-okwsnghGP6phia4tPz39HxrmiWpHWYdOENYWBq19A/exec";
  const SECRET_KEY = "Mayhem4lyfeinitbru";
  const CACHE_KEY = "rw_uid_owner_map_v1";
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  function downloadCsv(filenameBase, rows) {
    const lines = rows.map((r) => r.map((c) => (c == null ? "" : String(c))).join(","));
    if (!lines.length) {
      alert("No UIDs found to export.");
      return;
    }
    const csvContent = ["WeaponUID,ArmorUID", ...lines].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `${filenameBase}_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function uniquePushSet(set, arr) {
    arr.forEach((v) => {
      if (v) set.add(String(v));
    });
  }

  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async function waitFor(selector, timeout = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(100);
    }
    return null;
  }

  async function waitUntil(predicate, timeout = 10000, interval = 150) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        if (predicate()) return true;
      } catch (e) {}
      await sleep(interval);
    }
    return false;
  }

  function itemHasBonus(liNode, isArmor = false) {
    if (!liNode) return false;
    const bonusIcons = Array.from(liNode.querySelectorAll(".bonuses i"));
    if (!bonusIcons.length) return false;
    for (const icon of bonusIcons) {
      const cls = icon.className || "";
      if (!/blank-bonus/.test(cls)) return true;
    }
    return false;
  }

  function gmFetchJson(url) {
    return new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          onload(res) {
            try {
              const text = res.responseText;
              const json = JSON.parse(text);
              resolve(json);
            } catch (err) {
              reject(new Error("Failed to parse JSON response: " + err.message));
            }
          },
          onerror(err) {
            reject(new Error("GM_xmlhttpRequest error: " + (err && err.status)));
          },
          ontimeout() {
            reject(new Error("GM_xmlhttpRequest timeout"));
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function fetchOwnerMap(options = {}) {
    try {
      const force = options.force === true;
      if (!force) {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            if (Date.now() - cached.ts < CACHE_TTL_MS) {
              return cached.data;
            }
          } catch (e) {
          }
        }
      }

      const cacheBuster = options.force ? `&cb=${Date.now()}` : "";
      const url = `${SHEET_API_URL}?key=${encodeURIComponent(SECRET_KEY)}&tabs=RWeapon,RWArmor${cacheBuster}`;

      const json = await gmFetchJson(url);

      const merged = {};
      if (json && json.data) {
        for (const tab of Object.keys(json.data)) {
          const tabObj = json.data[tab] || {};
          for (const uid of Object.keys(tabObj)) {
            merged[String(uid).trim()] = Object.assign({ sheet: tab }, tabObj[uid]);
          }
        }
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: merged }));
      return merged;
    } catch (err) {
      console.error("UID lookup: exception", err);
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          return cached.data || {};
        }
      } catch (e) {}
      return {};
    }
  }

  async function forceRefreshOwnerMap() {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {}
    const map = await fetchOwnerMap({ force: true });
    console.log("Owner map refreshed (forced). Entries:", Object.keys(map).length);
    return map;
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }

  function getOwnerForUid(map, uid) {
    if (!uid) return null;
    return map[String(uid).trim()] || null;
  }

  function injectRefreshButtonTopBar(onClick) {
    try {
      const container = document.getElementById("top-page-links-list");
      if (!container) return;
      if (container.querySelector(".tm-refresh-owners-btn")) return;

      const link = document.createElement("a");
      link.className = "t-clear h c-pointer line-h24 right tm-refresh-owners-btn";
      link.href = "#";
      const inner = document.createElement("div");
      inner.className = "TDup_button";
      inner.textContent = "Refresh owners";
      link.appendChild(inner);
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        inner.textContent = "Refreshing...";
        inner.style.opacity = "0.7";
        try {
          await onClick();
        } finally {
          inner.textContent = "Refresh owners";
          inner.style.opacity = "";
        }
      });
      container.appendChild(link);
    } catch (e) {
      console.warn("Failed to inject topbar refresh button", e);
    }
  }

  function injectRefreshButtonItemPage(onClick) {
    try {
      const contAnchor = document.querySelector(".tutorial-desc") || document.getElementById("category-wrap");
      if (!contAnchor) return;
      if (contAnchor.querySelector(".tm-refresh-owners-btn")) return;

      const btn = document.createElement("div");
      btn.className = "torn-btn tm-refresh-owners-btn";
      btn.style.marginLeft = "8px";
      btn.style.display = "inline-flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.cursor = "pointer";
      btn.textContent = "Refresh owners";
      btn.addEventListener("click", async () => {
        btn.textContent = "Refreshing...";
        btn.style.opacity = "0.7";
        try {
          await onClick();
        } finally {
          btn.textContent = "Refresh owners";
          btn.style.opacity = "";
        }
      });

      const btnWrap = document.querySelector(".tutorial-desc")?.querySelector("div[style*='display: flex']") || contAnchor;
      btnWrap.appendChild(btn);
    } catch (e) {
      console.warn("Failed to inject item page refresh button", e);
    }
  }

  function rescanItemListingsWithMap(ownerMap) {
    document
      .querySelectorAll("ul#primary-items li, ul#secondary-items li, ul#melee-items li, ul#armour-items li")
      .forEach((listing) => {
        const UID = listing.getAttribute("data-armoryid");
        const nameEl = listing.querySelector(".name");
        const itemName = listing.querySelector("div.thumbnail-wrap")?.getAttribute("aria-label") || (nameEl?.textContent || "");
        if (UID && nameEl) {
          nameEl.classList.remove("uid-added");
          const owner = getOwnerForUid(ownerMap, UID);
          if (owner && owner.ownerName) {
            const safeName = escapeHtml(itemName.trim());
            nameEl.innerHTML = `${safeName} — <a class="tm-uid-owner-link" href="https://www.torn.com/profiles.php?XID=${encodeURIComponent(
              owner.ownerId || ""
            )}" target="_blank" rel="noreferrer noopener">${escapeHtml(owner.ownerName)}</a>`;
          } else {
            nameEl.innerHTML = `${escapeHtml(itemName.trim())} [${escapeHtml(UID)}]`;
          }
          nameEl.classList.add("uid-added");
        }
      });
  }

  if (PATH === "/factions.php") {
    const ARMORY_SELECTOR = "#faction-armoury";

    const WEAPONS_TAB_ANCHOR = 'a[href="#armoury-weapons"]';
    const ARMOR_TAB_ANCHOR = 'a[href="#armoury-armour"]';

    const WEAPONS_PANEL = "#armoury-weapons";
    const ARMOR_PANEL = "#armoury-armour";

    function collectRWUIDsFromPanel(panelSelector) {
      const panel = document.querySelector(panelSelector);
      if (!panel) return [];
      const lis = Array.from(panel.querySelectorAll("li"));
      const uids = [];
      lis.forEach((li) => {
        const wrap = li.querySelector(".img-wrap[data-armoryid]");
        const uid = wrap ? wrap.getAttribute("data-armoryid") : null;
        if (!uid) return;
        if (itemHasBonus(li)) {
          uids.push(uid);
        }
      });
      return uids;
    }

    function findNextAnchorInPanel(panelSelector) {
      const panel = document.querySelector(panelSelector);
      if (!panel) return null;
      const anchors = Array.from(panel.querySelectorAll("a.page-show"));
      for (const a of anchors) {
        if (a.classList.contains("disable")) continue;
        if (a.querySelector(".pagination-right")) return a;
      }
      const i = panel.querySelector(".pagination-right");
      if (i) {
        const anc = i.closest("a");
        if (anc && !anc.classList.contains("disable")) return anc;
      }
      return null;
    }

    async function openTab(anchorSelector, panelSelector) {
      const anchor = document.querySelector(anchorSelector);
      if (!anchor) return false;
      const panel = document.querySelector(panelSelector);
      const panelVisible = panel && panel.style.display !== "none" && panel.offsetParent !== null;
      if (!panelVisible) {
        anchor.scrollIntoView({ block: "center", behavior: "auto" });
        anchor.click();
        const success = await waitFor(panelSelector, 8000);
        if (!success) {
          try {
            if (panelSelector === WEAPONS_PANEL) location.hash = "#/tab=armoury&start=0&sub=weapons";
            else if (panelSelector === ARMOR_PANEL) location.hash = "#/tab=armoury&start=0&sub=armour";
          } catch (e) {}
          await waitFor(panelSelector, 8000);
        }
      }
      await sleep(250);
      return true;
    }

    async function crawlAllPagesForPanel(panelSelector, maxPages = 200) {
      const uidsSet = new Set();
      await sleep(150);
      uniquePushSet(uidsSet, collectRWUIDsFromPanel(panelSelector));

      let pages = 0;
      while (pages < maxPages) {
        pages++;
        const nextAnchor = findNextAnchorInPanel(panelSelector);
        if (!nextAnchor) break;

        try {
          nextAnchor.scrollIntoView({ block: "center", behavior: "auto" });
          nextAnchor.click();
        } catch (e) {
          nextAnchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        }

        const changed = await waitUntil(
          () => {
            const found = collectRWUIDsFromPanel(panelSelector) || [];
            return found.some((u) => !uidsSet.has(String(u)));
          },
          10000,
          200
        );

        uniquePushSet(uidsSet, collectRWUIDsFromPanel(panelSelector));

        if (!changed) break;
        await sleep(200);
      }

      return Array.from(uidsSet);
    }

    async function downloadArmoryAllPagesCsv() {
      const armory = document.querySelector(ARMORY_SELECTOR);
      if (!armory) {
        alert("Armory container not found on this page.");
        return;
      }

      try {
        await openTab(WEAPONS_TAB_ANCHOR, WEAPONS_PANEL);
        await sleep(300);
        const weaponsUids = await crawlAllPagesForPanel(WEAPONS_PANEL);

        await openTab(ARMOR_TAB_ANCHOR, ARMOR_PANEL);
        await sleep(300);
        const armorUids = await crawlAllPagesForPanel(ARMOR_PANEL);

        const maxLen = Math.max(weaponsUids.length, armorUids.length);
        const rows = [];
        for (let i = 0; i < maxLen; i++) {
          rows.push([weaponsUids[i] || "", armorUids[i] || ""]);
        }

        downloadCsv("torn_armory_uids_rw_only", rows);

        alert(
          `Download ready.\nWeapons (RW) collected: ${weaponsUids.length}\nArmor (RW) collected: ${armorUids.length}`
        );
      } catch (err) {
        console.error("Armory UID download error:", err);
        alert("An error occurred while collecting armory UIDs. See console for details.");
      }
    }

    function createTopBarButton() {
      const container = document.getElementById("top-page-links-list");
      if (!container) return false;
      if (container.querySelector(".ArmoryUIDCsvBtn")) return true;

      const link = document.createElement("a");
      link.className = "t-clear h c-pointer  line-h24 right ArmoryUIDCsvBtn";
      link.href = "#";

      const innerDiv = document.createElement("div");
      innerDiv.className = "TDup_button";
      innerDiv.textContent = "Download Armory UIDs (RW)";

      link.appendChild(innerDiv);
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        innerDiv.textContent = "Collecting...";
        innerDiv.style.opacity = "0.8";
        try {
          await downloadArmoryAllPagesCsv();
        } finally {
          innerDiv.textContent = "Download Armory UIDs (RW)";
          innerDiv.style.opacity = "";
        }
      });

      container.appendChild(link);
      return true;
    }

    async function processArmoryListsWithOwners(ownerMap, parent) {
      if (!parent) return;
      const weaponItems = parent.querySelectorAll("#armoury-weapons li");
      weaponItems.forEach((li) => {
        const wrap = li.querySelector(".img-wrap[data-armoryid]");
        const uid = wrap ? wrap.getAttribute("data-armoryid") : null;
        const name = li.querySelector(".name");
        if (uid && name && !name.classList.contains("uid-added") && itemHasBonus(li)) {
          const owner = getOwnerForUid(ownerMap, uid);
          if (owner && owner.ownerName) {
            const safeItemName = escapeHtml(name.textContent.trim());
            const ownerLinkHtml = `<a class="tm-uid-owner-link" href="https://www.torn.com/profiles.php?XID=${encodeURIComponent(
              owner.ownerId || ""
            )}" target="_blank" rel="noreferrer noopener">${escapeHtml(owner.ownerName)}</a>`;
            name.innerHTML = `${safeItemName} — ${ownerLinkHtml}`;
          } else {
            name.innerHTML = `${escapeHtml(name.textContent.trim())} [${escapeHtml(uid)}]`;
          }
          name.classList.add("uid-added");
        }
      });

      const armourItems = parent.querySelectorAll("#armoury-armour li");
      armourItems.forEach((li) => {
        const wrap = li.querySelector(".img-wrap[data-armoryid]");
        const uid = wrap ? wrap.getAttribute("data-armoryid") : null;
        const name = li.querySelector(".name");
        if (uid && name && !name.classList.contains("uid-added") && itemHasBonus(li)) {
          const owner = getOwnerForUid(ownerMap, uid);
          if (owner && owner.ownerName) {
            const safeItemName = escapeHtml(name.textContent.trim());
            const ownerLinkHtml = `<a class="tm-uid-owner-link" href="https://www.torn.com/profiles.php?XID=${encodeURIComponent(
              owner.ownerId || ""
            )}" target="_blank" rel="noreferrer noopener">${escapeHtml(owner.ownerName)}</a>`;
            name.innerHTML = `${safeItemName} — ${ownerLinkHtml}`;
          } else {
            name.innerHTML = `${escapeHtml(name.textContent.trim())} [${escapeHtml(uid)}]`;
          }
          name.classList.add("uid-added");
        }
      });
    }

    (async () => {
      const armoryParent = document.querySelector(ARMORY_SELECTOR);

      if (!createTopBarButton()) {
        const headerObserver = new MutationObserver(() => {
          if (createTopBarButton()) headerObserver.disconnect();
        });
        headerObserver.observe(document.body, { childList: true, subtree: true });
      }

      let ownerMap = {};
      try {
        ownerMap = await fetchOwnerMap();
      } catch (e) {
        console.warn("Failed to fetch owner map, continuing without it.", e);
      }

      injectRefreshButtonTopBar(async () => {
        ownerMap = await forceRefreshOwnerMap();
        if (armoryParent) processArmoryListsWithOwners(ownerMap, armoryParent);
      });

      if (armoryParent) {
        try {
          await processArmoryListsWithOwners(ownerMap, armoryParent);
        } catch (e) {
          console.error("Error in initial armory processing:", e);
        }

        const armoryObserver = new MutationObserver(async () => {
          const nowCached = localStorage.getItem(CACHE_KEY);
          try {
            const parsed = nowCached ? JSON.parse(nowCached) : null;
            if (!parsed || Date.now() - parsed.ts > CACHE_TTL_MS) {
              ownerMap = await fetchOwnerMap();
            }
          } catch (e) {
            ownerMap = await fetchOwnerMap();
          }
          processArmoryListsWithOwners(ownerMap, armoryParent);
        });
        armoryObserver.observe(armoryParent, { childList: true, subtree: true });
      }
    })();
  }

  if (PATH === "/item.php") {
    const cont = document.createElement("div");
    cont.className = "tutorial-cont";

    const titleCont = document.createElement("div");
    titleCont.className = "title-gray top-round";
    titleCont.setAttribute("role", "heading");
    titleCont.setAttribute("aria-level", "5");

    const title = document.createElement("span");
    title.className = "tutorial-title";
    title.innerHTML = "torn.report - Weapons & Armor Details";

    titleCont.appendChild(title);
    cont.appendChild(titleCont);

    const desc = document.createElement("div");
    desc.className = "tutorial-desc bottom-round cont-gray p10";
    desc.innerHTML = `
      <p>Export your weapons and armor details here to have them on the Item Stats page!</p>
      <p>Scroll to load all items on each category, then use the buttons below.</p>
      <p>JSON (clipboard) is for the Item Stats page paste icon; CSV is a single-column of UIDs for your own use.</p>`;

    const btnWrap = document.createElement("div");
    btnWrap.style.display = "flex";
    btnWrap.style.justifyContent = "start";
    btnWrap.style.gap = "8px";
    btnWrap.style.marginTop = "10px";

    const btnCopy = document.createElement("div");
    btnCopy.className = "torn-btn";
    btnCopy.innerHTML = "Copy JSON to Clipboard";
    btnCopy.style.width = "190px";
    btnCopy.style.display = "flex";
    btnCopy.style.alignItems = "center";
    btnCopy.style.justifyContent = "center";

    const btnCsv = document.createElement("div");
    btnCsv.className = "torn-btn";
    btnCsv.innerHTML = "Download UIDs CSV";
    btnCsv.style.width = "170px";
    btnCsv.style.display = "flex";
    btnCsv.style.alignItems = "center";
    btnCsv.style.justifyContent = "center";

    btnWrap.appendChild(btnCopy);
    btnWrap.appendChild(btnCsv);
    desc.appendChild(btnWrap);
    cont.appendChild(desc);

    const delim = document.createElement("hr");
    delim.className = "delimiter-999 m-top10 m-bottom10";

    const bonusTypes = {
      Bloodlust: (bonus) => bonus.title.split(" of")[0].split("by ")[1],
      Disarm: (bonus) => bonus.title.split(" turns")[0].split("for ")[1],
      Eviscerate: (bonus) => bonus.title.split(" extra")[0].split("them ")[1],
      Execute: (bonus) => bonus.title.split(" life")[0].split("below ")[1],
      Irradiate: () => "",
      Penetrate: (bonus) => bonus.title.split(" of")[0].split("Ignores ")[1],
      Radiation: () => "",
      Smash: () => "",
    };

    const items = {};

    const targetNodes = document.querySelectorAll(
      "ul#primary-items, ul#secondary-items, ul#melee-items, ul#armour-items"
    );

    const config = { childList: true };

    let itemPageOwnerMap = null;
    let lastOwnerMapFetch = 0;

    const callback = async (mutations) => {
      if (!itemPageOwnerMap || Date.now() - lastOwnerMapFetch > CACHE_TTL_MS) {
        try {
          itemPageOwnerMap = await fetchOwnerMap();
          lastOwnerMapFetch = Date.now();
        } catch (e) {
          console.warn("Failed loading owner map for item.php:", e);
          itemPageOwnerMap = itemPageOwnerMap || {};
        }
      }

      mutations.forEach((mutation) => {
        if (mutation.type !== "childList") return;

        Array.from(mutation.target.children).forEach((listing) => {
          let color;
          const UID = listing.getAttribute("data-armoryid");
          const ID = listing.getAttribute("data-item");
          const type = listing.getAttribute("data-category");
          const nameEl = listing.querySelector(".name");
          const itemName = listing.querySelector("div.thumbnail-wrap")?.getAttribute("aria-label");

          const glow = listing.querySelector('[class*="glow-"]');
          if (glow) {
            for (const className of glow.classList) {
              if (className.startsWith("glow-")) {
                color = className.slice(5).charAt(0).toUpperCase() + className.slice(6);
              }
            }
          }

          if (UID && nameEl && !nameEl.classList.contains("uid-added")) {
            nameEl.classList.add("uid-added");

            // lookup owner
            const owner = getOwnerForUid(itemPageOwnerMap || {}, UID);
            if (owner && owner.ownerName) {
              const safeName = escapeHtml(itemName || nameEl.textContent.trim());
              nameEl.innerHTML = `${safeName} — <a class="tm-uid-owner-link" href="https://www.torn.com/profiles.php?XID=${encodeURIComponent(
                owner.ownerId || ""
              )}" target="_blank" rel="noreferrer noopener">${escapeHtml(owner.ownerName)}</a>`;
            } else {
              nameEl.innerHTML = `${escapeHtml(itemName || nameEl.textContent.trim())} [${escapeHtml(UID)}]`;
            }

            const item = { ID, UID, type, name: itemName };
            if (color) item.rarity = color;

            const details = listing.querySelectorAll("li.left");
            let bonuses;

            if (mutation.target.getAttribute("id") !== "armour-items") {
              // Weapons
              item.damage = parseFloat(details[0]?.querySelector("span")?.innerHTML || "") || "";
              item.accuracy = parseFloat(details[1]?.querySelector("span")?.innerHTML || "") || "";
              bonuses = details[3]?.querySelectorAll("i") || [];
            } else {
              // Armor
              item.armor = parseFloat(details[0]?.querySelector("span")?.innerHTML || "") || "";
              bonuses = details[2]?.querySelectorAll("i") || [];
            }

            bonuses.forEach((bonus) => {
              if (!bonus.title) return;
              const name = bonus.title.split(">")[1].split("<")[0];
              let value = bonus.title.split("%")[0].split(">")[3];
              const tooltip = bonus.title;
              const icon = bonus.className;
              if (name in bonusTypes) value = bonusTypes[name](bonus);
              const entry = { name, value: parseInt(value), tooltip, icon };
              if (item.bonuses) item.bonuses.push(entry);
              else item.bonuses = [entry];
            });

            items[UID] = item;
          }
        });
      });
    };

    const observer = new MutationObserver(callback);
    targetNodes.forEach((node) => observer.observe(node, config));

    injectRefreshButtonItemPage(async () => {
      try {
        itemPageOwnerMap = await forceRefreshOwnerMap();
      } catch (e) {
        console.warn("Failed to refresh owner map from item page button", e);
      }
      document.querySelectorAll("ul#primary-items li, ul#secondary-items li, ul#melee-items li, ul#armour-items li").forEach((listing) => {
        const nameEl = listing.querySelector(".name");
        if (nameEl) nameEl.classList.remove("uid-added");
      });
      rescanItemListingsWithMap(itemPageOwnerMap || {});
    });

    const catWrap = document.getElementById("category-wrap");
    if (catWrap) {
      catWrap.insertAdjacentElement("afterend", delim);
      delim.insertAdjacentElement("afterend", cont);
    }

    injectRefreshButtonTopBar(async () => {
      const map = await forceRefreshOwnerMap();
      rescanItemListingsWithMap(map || {});
    });

    btnCopy.addEventListener("click", () => {
      const json = JSON.stringify(items);
      navigator.clipboard
        .writeText(json)
        .then(() => {
          btnCopy.innerHTML = "Done!";
          setTimeout(() => (btnCopy.innerHTML = "Copy JSON to Clipboard"), 1500);
        })
        .catch(() => {
          btnCopy.innerHTML = "Error Copying!";
          setTimeout(() => (btnCopy.innerHTML = "Copy JSON to Clipboard"), 1500);
        });
    });

    btnCsv.addEventListener("click", () => {
      const uids = Object.keys(items);
      if (!uids.length) {
        btnCsv.innerHTML = "No items!";
        setTimeout(() => (btnCsv.innerHTML = "Download UIDs CSV"), 1500);
        return;
      }
      const rows = uids.map((u) => [u]);
      const csvContent = rows.map((r) => r.join(",")).join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `torn_items_uids_${date}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      btnCsv.innerHTML = "Downloaded!";
      setTimeout(() => (btnCsv.innerHTML = "Download UIDs CSV"), 1500);
    });
  }
})();

// ==UserScript==
// @name        Show account names + auto translate to english
// @namespace   io.inp
// @match       https://*.esologs.com/*
// @grant       none
// @version     3.5
// @author      Xandaros (tweaked by Kwiebe-Kwibus)
// @license     BSD-2-Clause
// @run-at      document-idle
// @description Redirects ru.esologs.com to www.esologs.com, then (after the page is fully loaded + delay) replaces character names with account IDs using throttled, batched, text-node-only passes and stores a char→account map in localStorage. NO reload loops, NO locale/cookie changes, NO auto-translate.
// @downloadURL https://update.greasyfork.org/scripts/552706/Show%20account%20names%20%2B%20auto%20translate%20to%20english.user.js
// @updateURL https://update.greasyfork.org/scripts/552706/Show%20account%20names%20%2B%20auto%20translate%20to%20english.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------------- Config ----------------
  const NAME_REPLACEMENT_DELAY_MS = 2500; // start 2.5s after full load
  const MAX_TEXT_NODES_PER_BATCH = 1200;  // upper bound per initial pass
  const OBSERVER_DEBOUNCE_PER_FRAME = true;
  const LS_KEY_CHAR_MAP = "esologs_char_to_account_v1";
  const LS_MAX_ENTRIES = 3000;
  // ----------------------------------------

  // 0) Redirect ru.esologs.com → www.esologs.com
  (function redirectRuToMain() {
    try {
      const host = location.hostname; // e.g. ru.esologs.com
      if (/^ru\.esologs\.com$/i.test(host)) {
        const newUrl =
          location.protocol +
          "//www.esologs.com" +
          location.pathname +
          location.search +
          location.hash;
        // No cookie/locale changes, just a host switch
        location.replace(newUrl);
      }
    } catch (_) {}
  })();

  // Polyfills for idle / frame scheduling
  const raf =
    (window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) ||
    function (cb) {
      return setTimeout(cb, 16);
    };

  const ric =
    window.requestIdleCallback ||
    function (cb) {
      return setTimeout(
        () =>
          cb({
            didTimeout: false,
            timeRemaining: () => 50,
          }),
        1
      );
    };

  // --- localStorage helpers: persist char → @account map ---

  function saveCharAccountMappings(entries) {
    if (!window.localStorage) return;
    try {
      const existing = JSON.parse(localStorage.getItem(LS_KEY_CHAR_MAP) || "{}");
      let changed = false;
      for (const e of entries) {
        if (!e || !e.name || !e.displayName) continue;
        const name = String(e.name);
        const displayName = String(e.displayName);
        if (!displayName || !/^@/.test(displayName)) continue;
        if (existing[name] !== displayName) {
          existing[name] = displayName;
          changed = true;
        }
      }
      if (!changed) return;

      const keys = Object.keys(existing);
      if (keys.length > LS_MAX_ENTRIES) {
        keys.sort();
        const toRemove = keys.length - LS_MAX_ENTRIES;
        for (let i = 0; i < toRemove; i++) {
          delete existing[keys[i]];
        }
      }

      localStorage.setItem(LS_KEY_CHAR_MAP, JSON.stringify(existing));
    } catch (_) {}
  }

  function loadStoredCharAccountMappings() {
    if (!window.localStorage) return [];
    try {
      const raw = localStorage.getItem(LS_KEY_CHAR_MAP);
      if (!raw) return [];
      const obj = JSON.parse(raw);
      const out = [];
      for (const name in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, name)) continue;
        const displayName = obj[name];
        if (!displayName) continue;
        out.push({
          name,
          displayName,
          type: null,
          anonymous: false,
        });
      }
      return out;
    } catch (_) {
      return [];
    }
  }

  // --- Helpers to discover player entries (reports, guilds, attendance) ---

  function looksLikeAccount(str) {
    return typeof str === "string" && /^@/.test(str);
  }

  function pickDisplayName(obj) {
    const candidates = [
      obj.displayName,
      obj.account,
      obj.userID,
      obj.owner,
      obj.id,
      obj.user,
      obj.handle,
    ].filter(Boolean);
    for (const v of candidates) {
      if (looksLikeAccount(v)) return v;
    }
    if (typeof obj.displayName === "string") return obj.displayName;
    return null;
  }

  function normalizeEntry(p) {
    if (!p || typeof p !== "object") return null;
    const name =
      p.name ||
      p.characterName ||
      p.charName ||
      p.character ||
      p.char ||
      null;
    const displayName = pickDisplayName(p);
    const type = p.type || p.kind || p.entityType || p.category || null;
    const anonymous = !!p.anonymous;
    return { name, displayName, type, anonymous };
  }

  function tryParseNextDataPlayers() {
    try {
      const script = document.querySelector("script#__NEXT_DATA__");
      if (!script?.textContent) return [];
      const data = JSON.parse(script.textContent);

      const buckets = [
        "players",
        "playerList",
        "friendlyPlayers",
        "enemies",
        "enemyPlayers",
        "combatants",
        "participants",
        "units",
        "characters",
        "characterList",
        "attendance",
        "attendanceCharacters",
        "attendanceRows",
        "rows",
        "tableData",
        "raiders",
        "members",
        "guildMembers",
        "roster",
      ];

      const out = [];
      const crawl = (node) => {
        if (!node || typeof node !== "object") return;
        for (const k of Object.keys(node)) {
          const v = node[k];
          if (Array.isArray(v) && buckets.includes(k)) {
            for (const raw of v) {
              const e = normalizeEntry(raw);
              if (e) out.push(e);
            }
          } else if (v && typeof v === "object") {
            crawl(v);
          }
        }
      };
      crawl(data);
      return out;
    } catch (_) {
      return [];
    }
  }

  function getAllPlayerEntries() {
    const out = [];

    const buckets = [
      "players",
      "playerList",
      "friendlyPlayers",
      "enemies",
      "enemyPlayers",
      "opponents",
      "combatants",
      "participants",
      "units",
      "characters",
      "characterList",
      "attendance",
      "attendanceCharacters",
      "attendanceRows",
      "rows",
      "tableData",
      "raiders",
      "members",
      "guildMembers",
      "roster",
    ];

    // Top-level globals
    for (const key of buckets) {
      try {
        const arr = window[key];
        if (Array.isArray(arr)) {
          for (const raw of arr) {
            const e = normalizeEntry(raw);
            if (e) out.push(e);
          }
        }
      } catch (_) {}
    }

    // Nested structures on report/guild objects
    try {
      const candidates = [
        window.report,
        window.currentReport,
        window.data,
        window.guild,
        window.guildAttendance,
        window.attendance,
        window.guildData,
      ];

      for (const maybe of candidates) {
        if (!maybe || typeof maybe !== "object") continue;
        for (const k of buckets) {
          const arr = maybe[k];
          if (Array.isArray(arr)) {
            for (const raw of arr) {
              const e = normalizeEntry(raw);
              if (e) out.push(e);
            }
          }
        }
      }
    } catch (_) {}

    // Next.js payload
    try {
      out.push(...tryParseNextDataPlayers());
    } catch (_) {}

    // Filter + dedupe
    const filtered = out.filter(
      (e) =>
        e &&
        e.name &&
        e.displayName &&
        !e.anonymous &&
        String(e.type || "").toUpperCase() !== "NPC"
    );

    const seen = new Set();
    const unique = [];
    for (const e of filtered) {
      const k = e.name + "→" + e.displayName;
      if (!seen.has(k)) {
        seen.add(k);
        unique.push(e);
      }
    }
    return unique;
  }

  // --- Text replacement ---

  const processedNodes = new WeakSet();

  function buildReplacers(players) {
    const out = [];
    for (const p of players) {
      try {
        if (!p.name || !p.displayName || p.name === p.displayName) continue;
        const esc = String(p.name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(
          `(^|[^\\p{L}\\p{N}_])(${esc})(?=$|[^\\p{L}\\p{N}_])`,
          "gu"
        );
        out.push({ re, to: `$1${p.displayName}` });
      } catch (_) {}
    }
    return out;
  }

  function processTextNode(node, replacers) {
    try {
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      const parent = node.parentElement;
      if (!parent) return;
      const tag = parent.tagName;
      if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(tag)) return;

      const txt = node.textContent;
      if (!txt || processedNodes.has(node)) return;

      let out = txt;
      let changed = false;
      for (const { re, to } of replacers) {
        const newOut = out.replace(re, to);
        if (newOut !== out) {
          out = newOut;
          changed = true;
        }
      }
      if (changed) {
        node.textContent = out;
        processedNodes.add(node);
      }
    } catch (_) {}
  }

  function initialPass(root, replacers) {
    try {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (n) => {
            if (!n || processedNodes.has(n)) return NodeFilter.FILTER_REJECT;
            const p = n.parentElement;
            if (!p) return NodeFilter.FILTER_REJECT;
            const tag = p.tagName;
            if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(tag))
              return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let count = 0;
      const work = () => {
        ric(() => {
          let n;
          while ((n = walker.nextNode())) {
            processTextNode(n, replacers);
            count++;
            if (count >= MAX_TEXT_NODES_PER_BATCH) {
              count = 0;
              raf(work);
              return;
            }
          }
        });
      };
      work();
    } catch (_) {}
  }

  function observeMutations(root, replacers) {
    let scheduled = false;
    const queue = new Set();

    const run = () => {
      scheduled = false;
      const nodes = Array.from(queue);
      queue.clear();
      for (const n of nodes) {
        if (!n) continue;
        if (n.nodeType === Node.TEXT_NODE) {
          processTextNode(n, replacers);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          try {
            const walker = document.createTreeWalker(
              n,
              NodeFilter.SHOW_TEXT
            );
            let t;
            let processed = 0;
            while ((t = walker.nextNode())) {
              processTextNode(t, replacers);
              processed++;
              if (processed > 1500) break;
            }
          } catch (_) {}
        }
      }
    };

    const obs = new MutationObserver((mutations) => {
      try {
        for (const m of mutations) {
          if (m.type === "characterData") {
            queue.add(m.target);
          } else if (m.type === "childList") {
            m.addedNodes.forEach((n) => queue.add(n));
          }
        }
        if (OBSERVER_DEBOUNCE_PER_FRAME) {
          if (!scheduled) {
            scheduled = true;
            raf(run);
          }
        } else {
          run();
        }
      } catch (_) {}
    });

    obs.observe(root, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    return obs;
  }

  function startNameReplacement() {
    try {
      let players = getAllPlayerEntries();

      if (players.length) {
        saveCharAccountMappings(players);
      } else {
        const stored = loadStoredCharAccountMappings();
        if (stored.length) {
          players = stored;
        }
      }

      if (!players.length) return false;

      const replacers = buildReplacers(players);
      if (!replacers.length) return false;

      const root =
        document.getElementById("__next") ||
        document.querySelector("main") ||
        document.body ||
        document.documentElement;

      if (!root) return false;

      initialPass(root, replacers);
      observeMutations(root, replacers);
      return true;
    } catch (_) {
      return false;
    }
  }

  // --- Boot (VERY LATE) ---

  function boot() {
    setTimeout(() => {
      let tries = 0;
      const maxTries = 8;
      const tryOnce = () => {
        if (startNameReplacement() || ++tries >= maxTries) return;
        setTimeout(tryOnce, 800);
      };
      tryOnce();
    }, NAME_REPLACEMENT_DELAY_MS);
  }

  if (document.readyState === "complete") {
    boot();
  } else {
    window.addEventListener("load", boot, { once: true });
  }
})();

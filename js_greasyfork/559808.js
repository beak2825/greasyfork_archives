// ==UserScript==
// @name         Gemini DumpChat
// @namespace    https://github.com/miniyu157/gemini-dumpchat
// @version      1.0.0
// @description  Export Gemini chat history to TXT/JSON with precise element injection.
// @author       Yumeka
// @license      MIT
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559808/Gemini%20DumpChat.user.js
// @updateURL https://update.greasyfork.org/scripts/559808/Gemini%20DumpChat.meta.js
// ==/UserScript==

/**
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * Yumeka <miniyu157@163.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return. Yumeka
 * ----------------------------------------------------------------------------
 * * [ Attribution ]
 * This script includes core scrolling logic derived from:
 * "gemini_chat_export" by Sxuan-Coder (https://github.com/Sxuan-Coder/gemini_chat_export)
 * Licensed under Apache License 2.0.
 * ----------------------------------------------------------------------------
 */

(function () {
  "use strict";

  // --- Configuration ---
  const META = {
    repo: "https://github.com/miniyu157/gemini-dumpchat",
    licenseUrl:
      "https://github.com/miniyu157/gemini-dumpchat/blob/main/LICENSE",
    newlineToken: " <\\n> ",
  };

  const SELECTORS = {
    disclaimer: 'p[data-test-id="disclaimer"]',
    userQuery: "user-query .query-text",
    modelResponse: "model-response",
    responseParts: ".model-response-text, .markdown",
  };

  // --- Elegant Styles (Dark/Glass) ---
  GM_addStyle(`
        :root {
            --dump-bg: rgba(20, 20, 20, 0.9);
            --dump-border: rgba(255, 255, 255, 0.15);
            --dump-text: #e3e3e3;
            --dump-accent: #a8c7fa;
        }
        .dump-link {
            margin-left: 12px; cursor: pointer; text-decoration: none;
            color: inherit; opacity: 0.6; font-size: 0.9em; vertical-align: baseline;
            transition: opacity 0.2s;
        }
        .dump-link:hover { opacity: 1; }
        
        .dump-menu {
            position: fixed; z-index: 10000;
            background: var(--dump-bg); border: 1px solid var(--dump-border);
            border-radius: 6px; padding: 4px; display: none; flex-direction: column;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(8px);
            font-family: 'JetBrains Mono', Consolas, monospace; min-width: 100px;
        }
        .dump-menu.active { display: flex; animation: dumpFadeIn 0.15s ease-out; }
        
        .dump-item {
            padding: 8px 12px; cursor: pointer; color: var(--dump-text);
            font-size: 12px; text-align: left; border-radius: 4px;
            transition: background 0.1s; user-select: none;
        }
        .dump-item:hover { background: rgba(255,255,255,0.1); }
        .dump-item.meta { color: #888; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 4px; }
        
        .dump-status {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #1a1a1a; color: var(--dump-accent);
            border: 1px solid var(--dump-border); padding: 8px 16px;
            border-radius: 20px; font-size: 12px; font-family: monospace;
            pointer-events: none; opacity: 0; transition: 0.3s; z-index: 10001;
        }
        .dump-status.show { opacity: 1; top: 30px; }
        
        @keyframes dumpFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    `);

  // --- Core Logic: State & Processing ---
  const State = {
    isProcessing: false,
    collected: new Map(),
    menuRef: null,
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function showStatus(msg) {
    let el = document.querySelector(".dump-status");
    if (!el) {
      el = document.createElement("div");
      el.className = "dump-status";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el.timer);
    el.timer = setTimeout(() => el.classList.remove("show"), 3000);
  }

  function cleanTextForTxt(text) {
    if (!text) return "";
    return text.trim().replace(/\n/g, META.newlineToken);
  }

  function parseVisibleNodes() {
    const containers = document.querySelectorAll(".conversation-container");
    containers.forEach((container, idx) => {
      const userNode = container.querySelector(SELECTORS.userQuery);
      if (userNode) {
        const text = userNode.textContent;
        const key = `user|${text.substring(0, 32)}|${text.length}`;
        if (!State.collected.has(key)) {
          State.collected.set(key, {
            role: "User",
            content: text,
            order: idx * 2,
          });
        }
      }

      const modelNode = container.querySelector(SELECTORS.modelResponse);
      if (modelNode) {
        const parts = modelNode.querySelectorAll(SELECTORS.responseParts);
        let fullText = Array.from(parts)
          .map((p) => p.textContent)
          .join("\n");
        if (fullText.trim()) {
          const key = `gemini|${fullText.substring(0, 32)}|${fullText.length}`;
          if (!State.collected.has(key)) {
            State.collected.set(key, {
              role: "Gemini",
              content: fullText.trim(),
              order: idx * 2 + 1,
            });
          }
        }
      }
    });
  }

  async function executeDump(format) {
    if (State.isProcessing) return;
    State.isProcessing = true;
    State.collected.clear();
    showStatus("Scrolling & Capturing...");

    window.scrollTo(0, 0);
    await sleep(600);

    let lastHeight = 0,
      noChange = 0;

    while (true) {
      parseVisibleNodes();
      window.scrollBy(0, window.innerHeight * 0.85);
      await sleep(600);

      let h = document.body.scrollHeight;
      if (h === lastHeight) {
        if (++noChange >= 3) break;
      } else {
        noChange = 0;
        lastHeight = h;
      }
    }

    parseVisibleNodes();

    const rawData = Array.from(State.collected.values());

    const titleEl = document.querySelector(".conversation-title, h1");
    const title = (titleEl ? titleEl.textContent : "Gemini_Dump")
      .trim()
      .replace(/[\\/:*?"<>|]/g, "_")
      .substring(0, 50);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${title}_${date}`;

    if (format === "json") {
      const jsonStr = JSON.stringify(
        rawData.map((d) => ({
          role: d.role,
          content: d.content,
        })),
        null,
        2
      );
      download(jsonStr, "application/json", `${filename}.json`);
    } else {
      const txtStr = rawData
        .map((d) => `[${d.role}] ${cleanTextForTxt(d.content)}`)
        .join("\n");
      download(txtStr, "text/plain", `${filename}.txt`);
    }

    showStatus(`Done. Captured ${rawData.length} messages.`);
    State.isProcessing = false;
  }

  function download(content, mime, name) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- UI Construction ---
  function createMenu() {
    const menu = document.createElement("div");
    menu.className = "dump-menu";

    const addOption = (text, action, isMeta = false) => {
      const item = document.createElement("div");
      item.className = "dump-item" + (isMeta ? " meta" : "");
      item.textContent = text;
      item.onclick = (e) => {
        e.stopPropagation();
        menu.classList.remove("active");
        action();
      };
      menu.appendChild(item);
    };

    addOption("Export as TXT", () => executeDump("txt"));
    addOption("Export as JSON", () => executeDump("json"));
    addOption("[LICENSE]", () => window.open(META.licenseUrl, "_blank"), true);
    addOption("[Github]", () => window.open(META.repo, "_blank"), true);

    document.body.appendChild(menu);
    return menu;
  }

  // --- Injection ---
  function inject() {
    const disclaimer = document.querySelector(SELECTORS.disclaimer);
    if (!disclaimer || disclaimer.querySelector("#y-dump-link")) return;

    if (!State.menuRef) State.menuRef = createMenu();

    const link = document.createElement("a");
    link.id = "y-dump-link";
    link.className = "dump-link";
    link.textContent = "DumpChat";

    link.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = link.getBoundingClientRect();
      const menu = State.menuRef;

      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
      } else {
        menu.style.bottom = window.innerHeight - rect.top + 10 + "px";
        menu.style.left = rect.left - 20 + "px";
        menu.classList.add("active");
      }
    };

    disclaimer.appendChild(link);
  }

  document.addEventListener("click", (e) => {
    if (
      State.menuRef &&
      State.menuRef.classList.contains("active") &&
      !e.target.closest(".dump-menu")
    ) {
      State.menuRef.classList.remove("active");
    }
  });

  const observer = new MutationObserver((mutations) => {
    if (!document.getElementById("y-dump-link")) inject();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  inject();
})();

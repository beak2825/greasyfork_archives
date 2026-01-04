// ==UserScript==
// @name         Notebook Utility Panel
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Notebook with paging + dark mode on the entire webpage (but notes stay white) + focus/adblock
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551275/Notebook%20Utility%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/551275/Notebook%20Utility%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- STYLES ---
    GM_addStyle(`
      #tm-utility-btn {
        position: fixed; top: 50%; right: 0;
        transform: translateY(-50%);
        background: rgba(30,30,30,0.9);
        color: white; border: none;
        padding: 10px 14px;
        border-radius: 12px 0 0 12px;
        cursor: pointer;
        z-index: 999999;
        transition: background 0.3s ease, right 0.3s ease;
      }
      #tm-utility-btn:hover { background: rgba(50,50,50,0.95); }

      #tm-utility-panel {
        position: fixed; top: 50%; right: -380px;
        transform: translateY(-50%);
        width: 360px; height: 500px;
        background: white !important;  /* always white */
        box-shadow: -4px 0 20px rgba(0,0,0,0.2);
        border-radius: 12px 0 0 12px;
        display: flex; flex-direction: column;
        transition: right 0.4s ease;
        z-index: 999999;
        font-family: "Comic Sans MS", cursive, sans-serif;
        color: black !important;       /* always black text */
      }
      #tm-utility-panel.open { right: 0; }

      #tm-titlebar {
        display: flex; align-items: center;
        padding: 6px 8px;
        background: #f2f2f2;
        border-bottom: 1px solid #ccc;
        font-weight: bold;
        font-size: 15px;
        color: black !important;
      }
      #tm-close {
        margin-right: 8px;
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        color: black !important;
      }

      #tm-controls {
        display: flex; gap: 6px;
        padding: 8px;
        background: #f8f8f8;
        border-bottom: 1px solid #ddd;
      }
      #tm-controls button {
        flex: 1;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 4px 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
        color: black !important;
      }
      #tm-controls button:hover { background: #eee; }

      #tm-editor {
        flex: 1; padding: 12px;
        border: none; outline: none;
        font-size: 16px;
        overflow-y: auto;
        color: black !important;       /* always black text */
        background: white !important;  /* always white background */
      }

      /* Dark mode for entire page EXCEPT notes */
      .tm-dark body, .tm-dark {
        background: #121212 !important;
        color: #e0e0e0 !important;
      }
      .tm-dark * {
        background-color: transparent !important;
        color: #e0e0e0 !important;
        border-color: #333 !important;
      }
      .tm-dark a { color: #80bfff !important; }
      .tm-dark img, .tm-dark video { opacity: 0.9; }

      /* Reset dark mode styles for the notes panel */
      .tm-dark #tm-utility-panel,
      .tm-dark #tm-utility-panel * {
        background: white !important;
        color: black !important;
        border-color: #ccc !important;
      }

      #tm-paging {
        display: flex; justify-content: space-between;
        padding: 6px 8px;
        background: #f8f8f8;
        border-top: 1px solid #ddd;
      }
      #tm-paging button {
        background: #fff;
        border: 1px solid #aaa;
        border-radius: 6px;
        padding: 4px 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
        color: black !important;
      }
      #tm-paging button:hover { background: #eee; }

      #tm-actions {
        display: flex; gap: 6px;
        padding: 8px;
        border-top: 1px solid #ddd;
        background: #fafafa;
      }
      #tm-actions button {
        flex: 1;
        background: #0078d7; color: white !important;
        border: none; border-radius: 6px;
        padding: 6px 8px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.2s;
      }
      #tm-actions button:hover { background: #005ea6; }

      /* Focus mode hides sidebars, headers, footers, ads */
      .tm-focus aside, .tm-focus header, .tm-focus footer,
      .tm-focus nav, .tm-focus [class*="sidebar"], .tm-focus [id*="sidebar"],
      .tm-focus [id*="ad"], .tm-focus [class*="ad"], .tm-focus iframe[src*="ad"],
      .tm-focus .ytp-ad-module {
        display: none !important;
      }
    `);

    // --- BUTTON + PANEL ---
    const btn = document.createElement("button");
    btn.id = "tm-utility-btn";
    btn.textContent = "Notes";
    document.body.appendChild(btn);

    const panel = document.createElement("div");
    panel.id = "tm-utility-panel";
    panel.innerHTML = `
      <div id="tm-titlebar">
        <button id="tm-close">X</button>
        Notebook
      </div>
      <div id="tm-controls">
        <button id="bold">Bold</button>
        <button id="underline">Underline</button>
        <button id="link">Link</button>
        <button id="dark">Dark</button>
        <button id="focus">Focus</button>
      </div>
      <div id="tm-editor" contenteditable="true"></div>
      <div id="tm-paging">
        <button id="prev-page">Prev</button>
        <button id="next-page">Next</button>
      </div>
      <div id="tm-actions">
        <button id="save">Save</button>
        <button id="open">Open</button>
        <button id="clear">Delete</button>
      </div>
    `;
    document.body.appendChild(panel);

    const editor = panel.querySelector("#tm-editor");
    const closeBtn = panel.querySelector("#tm-close");

    // Notebook persistence
    const STORAGE_KEY = "tm-notebook-pages";
    let pages = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (pages.length === 0) pages.push("");
    let currentPage = 0;

    function loadPage() {
      editor.innerHTML = pages[currentPage] || "";
    }
    function savePage() {
      pages[currentPage] = editor.innerHTML;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    }

    panel.querySelector("#next-page").onclick = () => {
      savePage();
      if (currentPage === pages.length - 1) pages.push("");
      currentPage++;
      loadPage();
    };
    panel.querySelector("#prev-page").onclick = () => {
      savePage();
      if (currentPage > 0) currentPage--;
      loadPage();
    };

    loadPage();

    btn.onclick = () => panel.classList.toggle("open");
    closeBtn.onclick = () => panel.classList.remove("open");

    // formatting
    panel.querySelector("#bold").onclick = () => document.execCommand("bold");
    panel.querySelector("#underline").onclick = () => document.execCommand("underline");
    panel.querySelector("#link").onclick = () => {
      const url = prompt("Enter link URL:");
      if (url) document.execCommand("createLink", false, url);
    };

    // dark/focus
    panel.querySelector("#dark").onclick = () => {
      document.documentElement.classList.toggle("tm-dark");
    };
    panel.querySelector("#focus").onclick = () => {
      document.documentElement.classList.toggle("tm-focus");
    };

    // save/load/delete
    panel.querySelector("#save").onclick = () => {
      savePage();
      alert("Current page saved");
    };
    panel.querySelector("#open").onclick = () => {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (all.length > 0) {
        pages = all; currentPage = 0; loadPage();
      }
    };
    panel.querySelector("#clear").onclick = () => {
      if (confirm("Delete all pages?")) {
        pages = [""];
        currentPage = 0;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
        loadPage();
      }
    };

    window.addEventListener("beforeunload", () => savePage());
})();

// ==UserScript==
// @name         YouTube Keyboard Shortcut Guide
// @author       Setnour6
// @namespace    https://youtube.com
// @version      0.2
// @description  Add a button to YouTube's player controls to show all youtube video hotkeys in a modal
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548734/YouTube%20Keyboard%20Shortcut%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/548734/YouTube%20Keyboard%20Shortcut%20Guide.meta.js
// ==/UserScript==


"use strict";

const OPEN_KEY = "h";
const HOTKEYS = [
  ["H", "Hotkey Guide"],
  ["Space / K", "Play / Pause"],
  ["J", "Rewind 10 seconds"],
  ["L", "Fast forward 10 seconds"],
  ["← / →", "Seek 5 seconds"],
  ["↑ / ↓", "Volume up / down"],
  ["M", "Mute / Unmute"],
  ["0–9", "Jump to 0–90% of the video"],
  ["F", "Fullscreen"],
  ["T", "Theater mode"],
  ["I", "Miniplayer"],
  ["C", "Captions on/off"],
  ["Shift + N", "Next video"],
  ["Shift + P", "Previous video"],
  ["/", "Search focus"],
  ["Esc", "Exit dialogs/fullscreen"]
];

GM_addStyle(`
.hotkey-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20000;
  background: rgba(0,0,0,0.0);
  opacity: 0;
  display:flex;
  justify-content:center;
  align-items:center;
  pointer-events:none;
  transition:opacity .15s;
}
.hotkey-modal-backdrop.open {
  pointer-events:auto;
  background:rgba(0,0,0,.65);
  opacity:1;
}

.hotkey-panel {
  background:#181818;
  color:#fff;
  padding:18px;
  width:min(700px,90vw);
  max-height:80vh;
  overflow:auto;
  border-radius:8px;
  opacity:0;
  transform:translateY(-5px);
  transition:opacity .15s,transform .15s;
  font-family:Roboto,Arial,sans-serif;
}
.hotkey-panel.open {
  opacity:1;
  transform:translateY(0);
}

.hotkey-panel h2 {
  margin:0 0 12px;
}

.hotkey-table {
  width:100%;
  border-collapse:collapse;
}

.hotkey-table td {
  padding:6px 8px;
  border-bottom:1px solid rgba(255,255,255,.08)
}

.hotkey-key {
  width:35%;
  font-weight:bold;
}

.hotkey-kbd {
  background:rgba(255,255,255,.06);
  padding:4px 9px;
  border-radius:4px;
  font-size:13px;
}

.hotkey-close {
  margin-top:14px;
  background:#ff0000;
  padding:8px 14px;
  border-radius:99px;
  cursor:pointer;
  border:none;
  font-weight:bold;
  color:#fff;
}
`);

function waitFor(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) return resolve(document.querySelector(selector));

    const o = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        o.disconnect();
        resolve(el);
      }
    });

    o.observe(document.body,{subtree:true,childList:true});
  });
}

function createButton() {
  const btn = document.createElement("button");
  btn.id = "hotkeyGuideBtn";
  btn.classList.add("ytp-button");
  btn.title = "Keyboard Shortcuts (H)";
  btn.setAttribute("aria-label", "Keyboard shortcuts");

  btn.innerHTML = `
    <svg version="1.1" viewBox="0 0 36 36" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-5 -1.4)">
    <path d="M9 10C9 9.40666 9.17595 8.82664 9.50559 8.33329C9.83524 7.83994 10.3038 7.45543 10.852 7.22836C11.4001 7.0013 12.0033 6.94189 12.5853 7.05765C13.1672 7.1734 13.7018 7.45912 14.1213 7.87868C14.5409 8.29824 14.8266 8.83279 14.9424 9.41473C15.0581 9.99667 14.9987 10.5999 14.7716 11.1481C14.5446 11.6962 14.1601 12.1648 13.6667 12.4944C13.1734 12.8241 12.5933 13 12 13V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <circle cx="12" cy="17" r="1.2" fill="currentColor" />
  </g>
</svg>`;

  btn.onclick = openModal;
  return btn;
}

function injectButton() {
  const btn = document.getElementById("hotkeyGuideBtn");
  if (btn) return;

  const controls =
    document.querySelector(".ytp-right-controls-left") ||
    document.querySelector(".ytp-right-controls");

  if (!controls) return;

  controls.prepend(createButton());
}

function buildModal() {
  const backdrop = document.createElement("div");
  backdrop.className = "hotkey-modal-backdrop";
  backdrop.onclick = e => { if (e.target === backdrop) closeModal(); };

  const panel = document.createElement("div");
  panel.className = "hotkey-panel";
  panel.tabIndex = -1;

  panel.innerHTML = `<h2>YouTube Keyboard Shortcuts</h2>`;

  const table = document.createElement("table");
  table.className = "hotkey-table";

  HOTKEYS.forEach(([key,desc]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="hotkey-key"><span class="hotkey-kbd">${key}</span></td>
      <td>${desc}</td>
    `;
    table.appendChild(row);
  });

  panel.appendChild(table);

  const btn = document.createElement("button");
  btn.className = "hotkey-close";
  btn.textContent = "Close";
  btn.onclick = closeModal;

  panel.appendChild(btn);
  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);

  requestAnimationFrame(()=>{
    backdrop.classList.add("open");
    panel.classList.add("open");
    panel.focus();
  });
}

function openModal() {
  if (!document.querySelector(".hotkey-modal-backdrop")) buildModal();
}

function closeModal() {
  const m = document.querySelector(".hotkey-modal-backdrop");
  if (!m) return;
  m.classList.remove("open");
  setTimeout(()=>m.remove(),150);
}

window.addEventListener("keydown", e => {
  if (document.activeElement.contentEditable === "true") return;
  if (e.target.tagName === "INPUT") return;
  if (e.target.tagName === "TEXTAREA") return;

  if (e.key.toLowerCase() === OPEN_KEY) {
    e.preventDefault();
    openModal();
  }
});

new MutationObserver(injectButton)
.observe(document.body,{childList:true,subtree:true});

(async()=>{
  await waitFor(".html5-main-video");
  await waitFor(".ytp-right-controls-left, .ytp-right-controls");
  injectButton();
})();
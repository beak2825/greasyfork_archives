// ==UserScript==
// @name         Talkomatic Binary & Morse — per-key multiline
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Per-key converter that turns your typed chars into binary OR morse. Preserves newlines, paste, backspace/delete. SPA-safe. Toggle modes in UI. 🔢 ·-
// @author       DeepFriedChip
// @match        https://classic.talkomatic.co/*
// @grant        none
// @run-at       document-idle     
// @downloadURL https://update.greasyfork.org/scripts/554348/Talkomatic%20Binary%20%20Morse%20%E2%80%94%20per-key%20multiline.user.js
// @updateURL https://update.greasyfork.org/scripts/554348/Talkomatic%20Binary%20%20Morse%20%E2%80%94%20per-key%20multiline.meta.js
// ==/UserScript==

(() => {
  "use strict";
  const VER = "1.6 (binary + morse)";

  console.log("Per-key Binary & Morse loaded", VER);

  // ---------- UI ----------
  const css = `
    #bin-ui { position: fixed; right: 12px; bottom: 12px; z-index:2147483647; font-family: monospace; user-select:none;}
    #bin-ui .card { background:#111; color:#fff; padding:8px; border-radius:8px; border:1px solid #333; }
    #bin-ui button{ margin:4px 6px 4px 0; padding:6px 8px; border-radius:6px; background:#222; color:#fff; cursor:pointer; border:1px solid #333;}
    .bspan { white-space: pre; display:inline-block; }
    .bspan[title] { cursor: default; }
    .chat-input br { display:block; content:""; line-height: 1em; }
    #bin-ui .small { font-size:12px; color:#aaa; margin-top:6px; }
    #bin-ui select, #bin-ui input { background:#111; color:#fff; border:1px solid #333; padding:4px; border-radius:6px; margin-left:6px; }
  `;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);

  const ui = document.createElement("div");
  ui.id = "bin-ui";
  ui.innerHTML = `
    <div class="card">
      <div style="font-weight:700">Per-key Converter • ${VER}</div>
      <div style="margin-top:6px;">
        <button id="bin-start">🟢 Start</button>
        <button id="bin-stop">⛔ Stop</button>
        <button id="bin-restore">⤴ Restore</button>
        <button id="bin-copy">📋 Copy</button>
      </div>
      <div style="margin-top:8px;">
        mode:
        <select id="bin-mode">
          <option value="binary">Binary</option>
          <option value="morse">Morse</option>
        </select>
        bits: <select id="bin-bits"><option>8</option><option>16</option><option>32</option></select>
        sep: <select id="bin-sep"><option value=" ">space</option><option value="">none</option><option value="/">slash</option></select>
      </div>
      <div class="small">
        Ctrl+Enter to send original if "send original on Enter" checked.
        <div><label><input id="bin-sendorig" type="checkbox"> send original on Enter</label></div>
      </div>
    </div>
  `;
  document.body.appendChild(ui);

  const btnStart = ui.querySelector("#bin-start");
  const btnStop = ui.querySelector("#bin-stop");
  const btnRestore = ui.querySelector("#bin-restore");
  const btnCopy = ui.querySelector("#bin-copy");
  const selMode = ui.querySelector("#bin-mode");
  const selBits = ui.querySelector("#bin-bits");
  const selSep = ui.querySelector("#bin-sep");
  const chkSendOrig = ui.querySelector("#bin-sendorig");

  // ---------- Morse map ----------
  const MORSE_MAP = {
    "A": ".-",    "B": "-...",  "C": "-.-.",  "D": "-..",
    "E": ".",     "F": "..-.",  "G": "--.",   "H": "....",
    "I": "..",    "J": ".---",  "K": "-.-",   "L": ".-..",
    "M": "--",    "N": "-.",    "O": "---",   "P": ".--.",
    "Q": "--.-",  "R": ".-.",   "S": "...",   "T": "-",
    "U": "..-",   "V": "...-",  "W": ".--",   "X": "-..-",
    "Y": "-.--",  "Z": "--..",
    "0": "-----", "1": ".----", "2": "..---", "3": "...--",
    "4": "....-", "5": ".....", "6": "-....", "7": "--...",
    "8": "---..", "9": "----.",
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
    "!": "-.-.--", "/": "-..-.",  "(": "-.--.",  ")": "-.--.-",
    "&": ".-...",  ":": "---...", ";": "-.-.-.", "=": "-...-",
    "+": ".-.-.",  "-": "-....-", "_": "..--.-", "\"": ".-..-.",
    "$": "...-..-", "@": ".--.-."
  };

  // ---------- helpers ----------
  const DOT_MAP = [1, 8, 2, 16, 4, 32, 64, 128];
  const bitsToBin = (codePoint, bits) => {
    let b = codePoint.toString(2);
    if (b.length > bits) b = b.slice(-bits);
    else if (b.length < bits) b = "0".repeat(bits - b.length) + b;
    return b;
  };
  function getMorseForChar(ch) {
    // uppercase letter mapping, fallback to '?' for unknown or use space for ' '
    if (ch === " ") return "/";
    const up = ch.toUpperCase();
    if (MORSE_MAP[up]) return MORSE_MAP[up];
    // if char is newline, handle elsewhere
    return "?";
  }

  function charToBinaryOrMorseNode(ch, mode, bits, sep) {
    if (ch === "\n") {
      const br = document.createElement("br");
      br.dataset.orig = "\n";
      return br;
    }

    const span = document.createElement("span");
    span.className = "bspan";
    span.dataset.orig = ch;
    span.title = ch;

    if (mode === "binary") {
      const cp = ch.codePointAt(0);
      const bin = bitsToBin(cp, bits);
      span.textContent = sep ? bin + sep : bin;
    } else { // morse
      const morse = getMorseForChar(ch);
      // represent space between letters with a single space by default (user sep can modify)
      const out = (morse === "/") ? "/" : morse;
      // choose dot/dash characters: use '.' and '-' for compatibility
      span.textContent = sep ? out + sep : out;
    }
    return span;
  }

  function getChatInputEl() {
    return document.querySelector(".chat-input[contenteditable='true']");
  }

  function focusAndPlaceCaretAfter(node) {
    const range = document.createRange();
    const sel = window.getSelection();
    try {
      if (!node) {
        const el = getChatInputEl();
        if (!el) return;
        range.selectNodeContents(el);
        range.collapse(false);
      } else {
        range.setStartAfter(node);
        range.collapse(true);
      }
      sel.removeAllRanges();
      sel.addRange(range);
      const parent = getChatInputEl();
      if (parent) parent.focus();
    } catch (e) {}
  }

  // compute caret location relative to childNodes
  function computeCaretLocation(el) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return { spanIndex: el.childNodes.length, insideSpan: false, offset: 0, node: null };
    const range = sel.getRangeAt(0);
    let node = range.startContainer;
    let offset = range.startOffset;

    if (node === el) {
      return { spanIndex: offset, insideSpan: false, offset, node };
    }

    let child = node;
    while (child && child.parentNode !== el) {
      child = child.parentNode;
      if (!child) break;
    }
    if (!child || child.parentNode !== el) {
      return { spanIndex: el.childNodes.length, insideSpan: false, offset: 0, node: null };
    }

    let idx = 0;
    for (let i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i] === child) { idx = i; break; }
    }

    let inside = false, txtOff = 0;
    if (range.startContainer.nodeType === 3) {
      inside = true;
      txtOff = range.startOffset;
    }

    return { spanIndex: idx, insideSpan: inside, textOffsetInSpan: txtOff, node: child };
  }

  function reconstructOriginalFromSpans(el) {
    if (!el) return "";
    const arr = [];
    for (const node of el.childNodes) {
      if (node.nodeType === 1 && node.classList && node.classList.contains("bspan")) {
        arr.push(node.dataset.orig || "");
      } else if (node.nodeType === 1 && node.tagName === "BR") {
        arr.push("\n");
      } else if (node.nodeType === 3) {
        arr.push(node.nodeValue || "");
      } else {
        arr.push(node.textContent || "");
      }
    }
    return arr.join("");
  }

  function renderFromOriginalString(el, originalStr) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    const mode = selMode.value;
    const bits = parseInt(selBits.value, 10);
    const sep = selSep.value;

    for (const ch of Array.from(originalStr)) {
      const node = charToBinaryOrMorseNode(ch, mode, bits, sep);
      el.appendChild(node);
    }
  }

  // ---------- event handlers ----------
  let enabled = false;
  let observer = null;
  let lastKnownOriginal = ""; // includes \n

  function onKeyDown(e) {
    const el = getChatInputEl();
    if (!el) return;

    // handle ctrl/meta combos
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if ((e.key === "Enter" || e.key === "Return") && chkSendOrig.checked) {
        e.preventDefault();
        const orig = lastKnownOriginal;
        el.textContent = orig;
        el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
        const ev = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true });
        el.dispatchEvent(ev);
        setTimeout(() => {
          renderFromOriginalString(el, orig);
          focusAndPlaceCaretAfter(el.lastChild || el);
        }, 40);
        return;
      }
      return;
    }

    // printable char
    if (e.key && e.key.length === 1 && !e.isComposing) {
      e.preventDefault();
      const ch = e.key;
      const mode = selMode.value;
      const bits = parseInt(selBits.value, 10);
      const sep = selSep.value;
      const loc = computeCaretLocation(el);
      const insertIndex = loc.spanIndex;

      const node = charToBinaryOrMorseNode(ch, mode, bits, sep);

      if (loc.insideSpan && loc.node) {
        const parent = loc.node.parentNode;
        if (loc.textOffsetInSpan === 0) parent.insertBefore(node, loc.node);
        else parent.insertBefore(node, loc.node.nextSibling);
      } else {
        const ref = el.childNodes[insertIndex] || null;
        el.insertBefore(node, ref);
      }

      // update original
      let origIndex = 0;
      for (let i = 0; i < el.childNodes.length; i++) {
        const n = el.childNodes[i];
        if (n === node) break;
        if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
        else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
        else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
      }
      const before = lastKnownOriginal.slice(0, origIndex);
      const after = lastKnownOriginal.slice(origIndex);
      lastKnownOriginal = before + ch + after;

      focusAndPlaceCaretAfter(node);
      el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      return;
    }

    // Enter -> newline
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const el = getChatInputEl();
      if (!el) return;
      const loc = computeCaretLocation(el);
      const insertIndex = loc.spanIndex;
      const br = document.createElement("br");
      br.dataset.orig = "\n";
      const ref = el.childNodes[insertIndex] || null;
      el.insertBefore(br, ref);

      let origIndex = 0;
      for (let i = 0; i < insertIndex; i++) {
        const n = el.childNodes[i];
        if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
        else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
        else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
      }
      const before = lastKnownOriginal.slice(0, origIndex);
      const after = lastKnownOriginal.slice(origIndex);
      lastKnownOriginal = before + "\n" + after;

      focusAndPlaceCaretAfter(br);
      el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      return;
    }

    // Backspace/Delete
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const el = getChatInputEl();
      if (!el) return;
      const loc = computeCaretLocation(el);

      if (e.key === "Backspace") {
        let idx = loc.spanIndex;
        const toRemoveIndex = Math.max(0, idx - 1);
        const nodeToRemove = el.childNodes[toRemoveIndex] || null;
        if (!nodeToRemove) return;

        if (nodeToRemove.nodeType === 1 && nodeToRemove.classList && nodeToRemove.classList.contains("bspan")) {
          let origIndex = 0;
          for (let i = 0; i < toRemoveIndex; i++) {
            const n = el.childNodes[i];
            if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
            else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
            else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
          }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 1 && nodeToRemove.tagName === "BR") {
          let origIndex = 0;
          for (let i = 0; i < toRemoveIndex; i++) {
            const n = el.childNodes[i];
            if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
            else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
            else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
          }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 3) {
          const txt = nodeToRemove.nodeValue || "";
          if (txt.length > 0) {
            nodeToRemove.nodeValue = txt.slice(0, -1);
            lastKnownOriginal = lastKnownOriginal.slice(0, -1);
          } else {
            nodeToRemove.remove();
            lastKnownOriginal = lastKnownOriginal.slice(0, -1);
          }
        } else {
          nodeToRemove.remove();
        }

        const ref = el.childNodes[toRemoveIndex] || el;
        const range = document.createRange();
        const sel = window.getSelection();
        if (ref === el) {
          range.selectNodeContents(el);
          range.collapse(false);
        } else {
          range.setStartBefore(ref);
          range.collapse(true);
        }
        sel.removeAllRanges();
        sel.addRange(range);
        el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      } else {
        // Delete key
        const idx = loc.spanIndex;
        const nodeToRemove = el.childNodes[idx] || null;
        if (!nodeToRemove) return;
        if (nodeToRemove.nodeType === 1 && nodeToRemove.classList && nodeToRemove.classList.contains("bspan")) {
          let origIndex = 0;
          for (let i = 0; i < idx; i++) {
            const n = el.childNodes[i];
            if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
            else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
            else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
          }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 1 && nodeToRemove.tagName === "BR") {
          let origIndex = 0;
          for (let i = 0; i < idx; i++) {
            const n = el.childNodes[i];
            if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
            else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
            else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
          }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 3) {
          const txt = nodeToRemove.nodeValue || "";
          if (txt.length > 1) nodeToRemove.nodeValue = txt.slice(1);
          else nodeToRemove.remove();
          lastKnownOriginal = lastKnownOriginal.slice(0, -1);
        } else {
          nodeToRemove.remove();
        }
        el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      }
      return;
    }

    // let arrow keys, tab, etc behave normally
  }

  function onPaste(e) {
    const el = getChatInputEl();
    if (!el) return;
    e.preventDefault();
    const txt = (e.clipboardData || window.clipboardData).getData("text") || "";
    if (!txt) return;
    const loc = computeCaretLocation(el);
    const insertIndex = loc.spanIndex;
    const mode = selMode.value;
    const bits = parseInt(selBits.value, 10);
    const sep = selSep.value;

    let ref = el.childNodes[insertIndex] || null;
    for (const ch of Array.from(txt)) {
      if (ch === "\n") {
        const br = document.createElement("br");
        br.dataset.orig = "\n";
        el.insertBefore(br, ref);
      } else {
        const node = charToBinaryOrMorseNode(ch, mode, bits, sep);
        el.insertBefore(node, ref);
      }
    }

    let origIndex = 0;
    for (let i = 0; i < insertIndex; i++) {
      const n = el.childNodes[i];
      if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
      else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
      else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
    }
    const before = lastKnownOriginal.slice(0, origIndex);
    const after = lastKnownOriginal.slice(origIndex);
    lastKnownOriginal = before + txt + after;

    const afterNode = ref ? ref.previousSibling : el.lastChild;
    if (afterNode) focusAndPlaceCaretAfter(afterNode);
    el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
  }

  function onKeyUp(e) {
    const el = getChatInputEl();
    if (!el) return;
    if (e.key === "Enter" && chkSendOrig.checked && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const orig = lastKnownOriginal;
      el.textContent = orig;
      el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      const ev = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true });
      el.dispatchEvent(ev);
      setTimeout(() => {
        renderFromOriginalString(el, orig);
        focusAndPlaceCaretAfter(el.lastChild || el);
      }, 40);
    }
  }

  // ---------- lifecycle ----------
  function enable() {
    if (enabled) return;
    const chat = getChatInputEl();
    if (!chat) return alert("No chat input found — open a room page first.");

    if (chat.querySelector && chat.querySelector(".bspan")) {
      lastKnownOriginal = reconstructOriginalFromSpans(chat);
    } else {
      lastKnownOriginal = chat.textContent || "";
      renderFromOriginalString(chat, lastKnownOriginal);
    }

    chat.addEventListener("keydown", onKeyDown, true);
    chat.addEventListener("keyup", onKeyUp, true);
    chat.addEventListener("paste", onPaste, true);

    observer = new MutationObserver(() => {
      const newChat = getChatInputEl();
      if (newChat && newChat !== chat) {
        try { chat.removeEventListener("keydown", onKeyDown, true); } catch (e) {}
        try { chat.removeEventListener("keyup", onKeyUp, true); } catch (e) {}
        try { chat.removeEventListener("paste", onPaste, true); } catch (e) {}
        const curOrig = lastKnownOriginal;
        renderFromOriginalString(newChat, curOrig);
        newChat.addEventListener("keydown", onKeyDown, true);
        newChat.addEventListener("keyup", onKeyUp, true);
        newChat.addEventListener("paste", onPaste, true);
      }
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    enabled = true;
    btnStart.disabled = true;
    btnStop.disabled = false;
    console.log("Converter enabled");
  }

  function disable() {
    if (!enabled) return;
    const chat = getChatInputEl();
    if (chat) {
      try { chat.removeEventListener("keydown", onKeyDown, true); } catch (e) {}
      try { chat.removeEventListener("keyup", onKeyUp, true); } catch (e) {}
      try { chat.removeEventListener("paste", onPaste, true); } catch (e) {}
    }
    if (observer) { observer.disconnect(); observer = null; }
    enabled = false;
    btnStart.disabled = false;
    btnStop.disabled = true;
    console.log("Converter disabled");
  }

  function restoreOriginal() {
    const el = getChatInputEl();
    if (!el) return alert("chat input not found");
    const orig = lastKnownOriginal || reconstructOriginalFromSpans(el);
    el.textContent = "";
    const parts = orig.split("\n");
    for (let i = 0; i < parts.length; i++) {
      el.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) {
        const br = document.createElement("br");
        br.dataset.orig = "\n";
        el.appendChild(br);
      }
    }
    el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
    lastKnownOriginal = orig;
    alert("Restored original text (with newlines) into textbox.");
  }

  async function copyConverted() {
    const el = getChatInputEl();
    if (!el) return alert("chat input not found");
    let out = "";
    for (const node of el.childNodes) {
      if (node.nodeType === 1 && node.classList && node.classList.contains("bspan")) out += node.textContent || "";
      else if (node.nodeType === 1 && node.tagName === "BR") out += "\n";
      else if (node.nodeType === 3) out += node.nodeValue || "";
      else out += node.textContent || "";
    }
    try {
      await navigator.clipboard.writeText(out);
      alert("Converted text copied to clipboard.");
    } catch (e) {
      prompt("Converted text (copy):", out);
    }
  }

  // when mode changes, re-render current content from lastKnownOriginal
  selMode.addEventListener("change", () => {
    const el = getChatInputEl();
    if (!el) return;
    renderFromOriginalString(el, lastKnownOriginal || reconstructOriginalFromSpans(el));
    // toggle UI bits/sep availability: bits only for binary
    if (selMode.value === "morse") {
      selBits.disabled = true;
      // default morse separator to single space for readability
      if (!selSep.value) selSep.value = " ";
    } else {
      selBits.disabled = false;
    }
  });

  // UI hookups
  btnStart.addEventListener("click", () => enable());
  btnStop.addEventListener("click", () => disable());
  btnRestore.addEventListener("click", () => restoreOriginal());
  btnCopy.addEventListener("click", () => copyConverted());

  btnStop.disabled = true;

  // keep UI alive on SPA
  const keepUiObs = new MutationObserver(() => {
    if (!document.body.contains(ui)) document.body.appendChild(ui);
  });
  keepUiObs.observe(document.documentElement || document.body, { childList: true, subtree: true });

  // export helper
  window.__PerKeyConverter = { enable, disable, restoreOriginal, copyConverted, version: VER };

  console.log("Per-key Binary & Morse ready. Click Start.");
})();

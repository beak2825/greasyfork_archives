// ==UserScript==
// @name         Talkomatic Converter — Binary, Morse, Live-Translate (LIVE + Wingdings option)
// @namespace    http://tampermonkey.net/
// @version      1.7.6
// @description  Per-key converter (binary/morse) + true LIVE morse translation for everyone's messages. Now adds a translation target: Plaintext or Wingdings-style symbols (fun mapping). STRICT: never translates your active textbox. Drop into Tampermonkey/Violentmonkey and run on Talkomatic room pages. 🔢·-🛰️
// @author       DeepFriedChip
// @match        https://classic.talkomatic.co/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554445/Talkomatic%20Converter%20%E2%80%94%20Binary%2C%20Morse%2C%20Live-Translate%20%28LIVE%20%2B%20Wingdings%20option%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554445/Talkomatic%20Converter%20%E2%80%94%20Binary%2C%20Morse%2C%20Live-Translate%20%28LIVE%20%2B%20Wingdings%20option%29.meta.js
// ==/UserScript==

(() => {
  "use strict";
  const VER = "1.7.6 (live + wingdings)";

  console.log("Per-key Converter + LIVE Morse Translate (wingdings) loaded", VER);

  /* ------------------- UI ------------------- */
  const css = `
    #bin-ui { position: fixed; right: 12px; bottom: 12px; z-index:2147483647; font-family: monospace; user-select:none;}
    #bin-ui .card { background:#111; color:#fff; padding:8px; border-radius:8px; border:1px solid #333; max-width:380px; }
    #bin-ui button{ margin:4px 6px 4px 0; padding:6px 8px; border-radius:6px; background:#222; color:#fff; cursor:pointer; border:1px solid #333;}
    .bspan { white-space: pre; display:inline-block; }
    .bspan[title] { cursor: default; }
    .chat-input br { display:block; content:""; line-height: 1em; }
    #bin-ui .small { font-size:12px; color:#aaa; margin-top:6px; }
    #bin-ui select, #bin-ui input { background:#111; color:#fff; border:1px solid #333; padding:4px; border-radius:6px; margin-left:6px; }
    .morse-translation { margin-top:4px; font-size:12px; color:#b6f7c4; background: rgba(0,0,0,0.25); padding:4px 6px; border-radius:6px; display:inline-block; max-width:100%; word-break:break-word; }
    .morse-translation-container { display:block; margin-top:6px; width:100%; text-align:left; pointer-events:auto; }
    .morse-copy-btn { margin-left:8px; font-size:11px; padding:2px 6px; border-radius:6px; background:#2b2b2b; color:#fff; border:1px solid #444; cursor:pointer; }
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
      <div style="margin-top:8px;">
        Translate target:
        <select id="bin-target">
          <option value="plain">Plaintext</option>
          <option value="wing">Wingdings-style</option>
        </select>
      </div>
      <div class="small">
        <label><input id="bin-sendorig" type="checkbox"> send original on Ctrl+Enter</label><br>
        <label><input id="bin-live-translate" type="checkbox" checked> Live-translate morse from everyone (NOT your textbox)</label>
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
  const selTarget = ui.querySelector("#bin-target");
  const chkSendOrig = ui.querySelector("#bin-sendorig");
  const chkLiveTranslate = ui.querySelector("#bin-live-translate");

  /* ------------------- Morse maps ------------------- */
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
  const REVERSE_MORSE = {};
  for (const k in MORSE_MAP) if (Object.prototype.hasOwnProperty.call(MORSE_MAP, k)) REVERSE_MORSE[MORSE_MAP[k]] = k;

  /* ------------------- Wingdings-style mapping ------------------- */
  // Not real Wingdings font mapping (can't embed that), but a fun symbol substitution.
  // Maps A-Z and 0-9 + some punctuation to dingbat-like Unicode characters.
  const WING_MAP = {
    "A":"✿","B":"✦","C":"☯","D":"✪","E":"★","F":"✶","G":"✵","H":"✺",
    "I":"☼","J":"☾","K":"☽","L":"☁","M":"☂","N":"✈","O":"✉","P":"✆",
    "Q":"♢","R":"♦","S":"♣","T":"♠","U":"♤","V":"♡","W":"♥","X":"✖",
    "Y":"✚","Z":"✜",
    "0":"⓪","1":"①","2":"②","3":"③","4":"④","5":"⑤","6":"⑥","7":"⑦","8":"⑧","9":"⑨",
    ".":"•",",":"‚","?":"¿","!":"¡","/":"／","-":"-",":":"∶",";":"؛",
    " ":" " // keep spaces
  };

  /* ------------------- helpers ------------------- */
  function bitsToBin(codePoint, bits) {
    let b = codePoint.toString(2);
    if (b.length > bits) b = b.slice(-bits);
    else if (b.length < bits) b = "0".repeat(bits - b.length) + b;
    return b;
  }
  function getMorseForChar(ch) {
    if (ch === " ") return "/";
    const up = ch.toUpperCase();
    if (MORSE_MAP[up]) return MORSE_MAP[up];
    return "?";
  }
  function charToBinaryOrMorseNode(ch, mode, bits, sep) {
    if (ch === "\n") {
      const br = document.createElement("br"); br.dataset.orig = "\n"; return br;
    }
    const span = document.createElement("span");
    span.className = "bspan"; span.dataset.orig = ch; span.title = ch;
    if (mode === "binary") {
      const cp = ch.codePointAt(0);
      const bin = bitsToBin(cp, bits);
      span.textContent = sep ? bin + sep : bin;
    } else {
      const morse = getMorseForChar(ch);
      const out = (morse === "/") ? "/" : morse;
      span.textContent = sep ? out + sep : out;
    }
    return span;
  }

  function getChatInputEl() {
    const el = document.querySelector('.chat-input[contenteditable="true"]');
    if (el) return el;
    const candidates = document.querySelectorAll('[contenteditable="true"]');
    if (candidates && candidates.length) {
      if (document.activeElement && document.activeElement.contentEditable === "true") return document.activeElement;
      for (const c of candidates) if (c.classList.contains('chat-input') || c.classList.contains('input') || c.classList.contains('message-input')) return c;
      return candidates[0];
    }
    return null;
  }

  function focusAndPlaceCaretAfter(node) {
    const range = document.createRange(); const sel = window.getSelection();
    try {
      if (!node) {
        const el = getChatInputEl(); if (!el) return;
        range.selectNodeContents(el); range.collapse(false);
      } else { range.setStartAfter(node); range.collapse(true); }
      sel.removeAllRanges(); sel.addRange(range); const parent = getChatInputEl(); if (parent) parent.focus();
    } catch (e) {}
  }

  function computeCaretLocation(el) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return { spanIndex: el.childNodes.length, insideSpan: false, offset: 0, node: null };
    const range = sel.getRangeAt(0);
    let node = range.startContainer;
    if (node === el) return { spanIndex: range.startOffset, insideSpan: false, offset: range.startOffset, node };
    let child = node;
    while (child && child.parentNode !== el) { child = child.parentNode; if (!child) break; }
    if (!child || child.parentNode !== el) return { spanIndex: el.childNodes.length, insideSpan: false, offset: 0, node: null };
    let idx = 0;
    for (let i = 0; i < el.childNodes.length; i++) if (el.childNodes[i] === child) { idx = i; break; }
    let inside = false, txtOff = 0;
    if (range.startContainer.nodeType === 3) { inside = true; txtOff = range.startOffset; }
    return { spanIndex: idx, insideSpan: inside, textOffsetInSpan: txtOff, node: child };
  }

  function reconstructOriginalFromSpans(el) {
    if (!el) return "";
    const arr = [];
    for (const node of el.childNodes) {
      if (node.nodeType === 1 && node.classList && node.classList.contains("bspan")) arr.push(node.dataset.orig || "");
      else if (node.nodeType === 1 && node.tagName === "BR") arr.push("\n");
      else if (node.nodeType === 3) arr.push(node.nodeValue || "");
      else arr.push(node.textContent || "");
    }
    return arr.join("");
  }

  function renderFromOriginalString(el, originalStr) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    const mode = selMode.value;
    const bits = parseInt(selBits.value, 10);
    const sep = selSep.value;
    for (const ch of Array.from(originalStr)) el.appendChild(charToBinaryOrMorseNode(ch, mode, bits, sep));
  }

  /* ------------------- per-key handlers ------------------- */
  let enabled = false; let observer = null; let lastKnownOriginal = "";

  function onKeyDown(e) {
    const el = getChatInputEl(); if (!el) return;
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if ((e.key === "Enter" || e.key === "Return") && chkSendOrig.checked) {
        e.preventDefault();
        const orig = lastKnownOriginal; el.textContent = orig;
        el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
        const ev = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true });
        el.dispatchEvent(ev);
        setTimeout(() => { renderFromOriginalString(el, orig); focusAndPlaceCaretAfter(el.lastChild || el); }, 40);
        return;
      }
      return;
    }

    // printable char
    if (e.key && e.key.length === 1 && !e.isComposing) {
      e.preventDefault();
      const ch = e.key; const mode = selMode.value; const bits = parseInt(selBits.value, 10); const sep = selSep.value;
      const loc = computeCaretLocation(el); const insertIndex = loc.spanIndex;
      const node = charToBinaryOrMorseNode(ch, mode, bits, sep);
      if (loc.insideSpan && loc.node) {
        const parent = loc.node.parentNode;
        if (loc.textOffsetInSpan === 0) parent.insertBefore(node, loc.node);
        else parent.insertBefore(node, loc.node.nextSibling);
      } else {
        const ref = el.childNodes[insertIndex] || null; el.insertBefore(node, ref);
      }
      let origIndex = 0;
      for (let i = 0; i < el.childNodes.length; i++) {
        const n = el.childNodes[i]; if (n === node) break;
        if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
        else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
        else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
      }
      const before = lastKnownOriginal.slice(0, origIndex); const after = lastKnownOriginal.slice(origIndex);
      lastKnownOriginal = before + ch + after; focusAndPlaceCaretAfter(node);
      el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      return;
    }

    // Enter newline
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const el2 = getChatInputEl(); if (!el2) return;
      const loc = computeCaretLocation(el2); const insertIndex = loc.spanIndex;
      const br = document.createElement("br"); br.dataset.orig = "\n";
      const ref = el2.childNodes[insertIndex] || null; el2.insertBefore(br, ref);
      let origIndex = 0;
      for (let i = 0; i < insertIndex; i++) {
        const n = el2.childNodes[i];
        if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
        else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
        else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
      }
      lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + "\n" + lastKnownOriginal.slice(origIndex);
      focusAndPlaceCaretAfter(br); el2.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      return;
    }

    // Backspace/Delete
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const el3 = getChatInputEl(); if (!el3) return;
      const loc = computeCaretLocation(el3);
      if (e.key === "Backspace") {
        const toRemoveIndex = Math.max(0, loc.spanIndex - 1); const nodeToRemove = el3.childNodes[toRemoveIndex] || null;
        if (!nodeToRemove) return;
        if (nodeToRemove.nodeType === 1 && nodeToRemove.classList && nodeToRemove.classList.contains("bspan")) {
          let origIndex = 0;
          for (let i = 0; i < toRemoveIndex; i++) {
            const n = el3.childNodes[i];
            if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
            else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
            else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
          }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 1 && nodeToRemove.tagName === "BR") {
          let origIndex = 0;
          for (let i=0;i<toRemoveIndex;i++){ const n=el3.childNodes[i]; if(n.nodeType===1&&n.classList&&n.classList.contains("bspan")) origIndex++; else if(n.nodeType===1&&n.tagName==="BR") origIndex++; else if(n.nodeType===3) origIndex+=(n.nodeValue||"").length; }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 3) {
          const txt = nodeToRemove.nodeValue || "";
          if (txt.length > 0) { nodeToRemove.nodeValue = txt.slice(0, -1); lastKnownOriginal = lastKnownOriginal.slice(0, -1); }
          else { nodeToRemove.remove(); lastKnownOriginal = lastKnownOriginal.slice(0, -1); }
        } else nodeToRemove.remove();
        const ref = el3.childNodes[toRemoveIndex] || el3; const range = document.createRange(); const sel = window.getSelection();
        if (ref === el3) { range.selectNodeContents(el3); range.collapse(false); } else { range.setStartBefore(ref); range.collapse(true); }
        sel.removeAllRanges(); sel.addRange(range); el3.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      } else {
        const nodeToRemove = el3.childNodes[loc.spanIndex] || null;
        if (!nodeToRemove) return;
        if (nodeToRemove.nodeType === 1 && nodeToRemove.classList && nodeToRemove.classList.contains("bspan")) {
          let origIndex = 0;
          for (let i=0;i<loc.spanIndex;i++){ const n=el3.childNodes[i]; if(n.nodeType===1&&n.classList&&n.classList.contains("bspan")) origIndex++; else if(n.nodeType===1&&n.tagName==="BR") origIndex++; else if(n.nodeType===3) origIndex+=(n.nodeValue||"").length; }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 1 && nodeToRemove.tagName === "BR") {
          let origIndex = 0;
          for (let i=0;i<loc.spanIndex;i++){ const n=el3.childNodes[i]; if(n.nodeType===1&&n.classList&&n.classList.contains("bspan")) origIndex++; else if(n.nodeType===1&&n.tagName==="BR") origIndex++; else if(n.nodeType===3) origIndex+=(n.nodeValue||"").length; }
          lastKnownOriginal = lastKnownOriginal.slice(0, origIndex) + lastKnownOriginal.slice(origIndex + 1);
          nodeToRemove.remove();
        } else if (nodeToRemove.nodeType === 3) {
          const txt = nodeToRemove.nodeValue || "";
          if (txt.length > 1) nodeToRemove.nodeValue = txt.slice(1);
          else nodeToRemove.remove();
          lastKnownOriginal = lastKnownOriginal.slice(0, -1);
        } else nodeToRemove.remove();
        el3.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      }
      return;
    }
  }

  function onPaste(e) {
    const el = getChatInputEl(); if (!el) return;
    e.preventDefault();
    const txt = (e.clipboardData || window.clipboardData).getData("text") || ""; if (!txt) return;
    const loc = computeCaretLocation(el); const insertIndex = loc.spanIndex;
    const mode = selMode.value; const bits = parseInt(selBits.value, 10); const sep = selSep.value;
    let ref = el.childNodes[insertIndex] || null;
    for (const ch of Array.from(txt)) {
      if (ch === "\n") { const br = document.createElement("br"); br.dataset.orig = "\n"; el.insertBefore(br, ref); }
      else { const node = charToBinaryOrMorseNode(ch, mode, bits, sep); el.insertBefore(node, ref); }
    }
    let origIndex = 0;
    for (let i = 0; i < insertIndex; i++) {
      const n = el.childNodes[i];
      if (n.nodeType === 1 && n.classList && n.classList.contains("bspan")) origIndex++;
      else if (n.nodeType === 1 && n.tagName === "BR") origIndex++;
      else if (n.nodeType === 3) origIndex += (n.nodeValue || "").length;
    }
    const before = lastKnownOriginal.slice(0, origIndex); const after = lastKnownOriginal.slice(origIndex);
    lastKnownOriginal = before + txt + after;
    const afterNode = ref ? ref.previousSibling : el.lastChild; if (afterNode) focusAndPlaceCaretAfter(afterNode);
    el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
  }

  function onKeyUp(e) {
    const el = getChatInputEl(); if (!el) return;
    if (e.key === "Enter" && chkSendOrig.checked && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const orig = lastKnownOriginal; el.textContent = orig;
      el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
      const ev = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true });
      el.dispatchEvent(ev);
      setTimeout(() => { renderFromOriginalString(el, orig); focusAndPlaceCaretAfter(el.lastChild || el); }, 40);
    }
  }

  /* ------------------- Live morse translation logic (realtime) ------------------- */

  function normalizeMorseChars(s) {
    if (!s) return "";
    return s.replace(/[·•]/g, ".").replace(/[–—−]/g, "-").replace(/\u00A0/g, " ").replace(/\r/g, "\n");
  }

  function findMorseSequences(text) {
    const out = [];
    if (!text || text.length < 2) return out;
    const morseCharRe = /[.\-·•–—\/\s]/;
    let i = 0;
    while (i < text.length) {
      if (morseCharRe.test(text[i])) {
        let j = i;
        while (j < text.length && morseCharRe.test(text[j])) j++;
        const seg = text.slice(i, j);
        const pureCount = (seg.match(/[.\-·•–—]/g) || []).length;
        if (pureCount >= 1) out.push({ start: i, end: j, raw: seg });
        i = j;
      } else i++;
    }
    return out;
  }

  function decodeMorseSegmentToText(raw) {
    if (!raw) return "";
    const norm = normalizeMorseChars(raw).trim();
    if (!norm) return "";
    const words = norm.split(/\s*\/\s*|\s{2,}/g).map(w => w.trim()).filter(Boolean);
    const decodedWords = words.map(word => {
      const letters = word.split(/\s+/).filter(Boolean);
      const decodedLetters = letters.map(code => REVERSE_MORSE[code] || "?");
      return decodedLetters.join("");
    });
    if (decodedWords.length === 0) {
      let s = norm.replace(/\s+/g, "");
      const letters = [];
      while (s.length > 0) {
        let matched = null;
        for (let len = Math.min(6, s.length); len >= 1; len--) {
          const part = s.slice(0, len);
          if (REVERSE_MORSE[part]) { matched = REVERSE_MORSE[part]; s = s.slice(len); letters.push(matched); break; }
        }
        if (!matched) { letters.push("?"); s = s.slice(1); }
      }
      return letters.join("");
    }
    return decodedWords.join(" ");
  }

  function findTextInChatRow(row) {
    const trySelectors = [ ".chat-input", ".chat-text", ".message", ".text", ".content", ".msg", ".bubble" ];
    for (const sel of trySelectors) {
      const el = row.querySelector(sel);
      if (el && el.textContent && el.textContent.trim().length) return { el, selector: sel };
    }
    if (row.textContent && row.textContent.trim().length) return { el: row, selector: "row" };
    return null;
  }

  function mapToWing(text) {
    if (!text) return "";
    let out = "";
    for (const ch of text) {
      const up = ch.toUpperCase();
      if (WING_MAP.hasOwnProperty(up)) out += WING_MAP[up];
      else out += ch;
    }
    return out;
  }

  function attachTranslationToRow(row, translatedText) {
    if (!row) return;
    let container = row.querySelector('.morse-translation-container');
    if (!translatedText || translatedText === "") {
      if (container && container.parentNode) container.parentNode.removeChild(container);
      return;
    }
    if (!container) {
      container = document.createElement('div'); container.className = 'morse-translation-container';
      Object.assign(container.style, { display: 'block', marginTop: '6px', width: '100%', textAlign: 'left', pointerEvents: 'auto' });
      const inner = document.createElement('div'); inner.className = 'morse-translation';
      Object.assign(inner.style, { fontSize: '12px', color: '#b6f7c4', background: 'rgba(0,0,0,0.25)', padding: '4px 6px', borderRadius: '6px', display: 'inline-block' });
      container.appendChild(inner);
      row.appendChild(container);
    }
    const inner = container.querySelector('.morse-translation') || (() => { const n = document.createElement('div'); n.className = 'morse-translation'; container.appendChild(n); return n; })();
    inner.textContent = `Translation: ${translatedText}`;

    // add tiny copy button if not present
    if (!container.querySelector('.morse-copy-btn')) {
      const btn = document.createElement('button'); btn.className = 'morse-copy-btn'; btn.textContent = 'Copy'; btn.title = 'Copy translation';
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try { await navigator.clipboard.writeText(translatedText); btn.textContent = 'Copied!'; setTimeout(()=>btn.textContent='Copy',900); }
        catch (err) { const fallback = prompt('Copy translation:', translatedText); if (fallback !== null) { btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy',900); } }
      });
      container.appendChild(btn);
    }
    if (container.parentNode) container.parentNode.appendChild(container);
  }

  function rowIsUserActiveInput(row) {
    try {
      const activeInput = getChatInputEl(); if (!activeInput) return false;
      if (row.contains(activeInput)) return true;
      if (row === activeInput) return true;
      const ce = row.querySelector('[contenteditable="true"]'); if (ce && (ce === activeInput)) return true;
      if (document.activeElement && row.contains(document.activeElement)) return true;
    } catch (e) { return false; }
    return false;
  }

  // scheduler
  const rowSchedule = new WeakMap();
  function scheduleProcessRow(row, immediate = false) {
    if (!row || !(row instanceof Element)) return;
    const existing = rowSchedule.get(row); if (existing) clearTimeout(existing);
    if (immediate) {
      const id = setTimeout(() => { rowSchedule.delete(row); processChatRowForMorse(row); }, 20);
      rowSchedule.set(row, id);
    } else {
      const id = setTimeout(() => { rowSchedule.delete(row); processChatRowForMorse(row); }, 80);
      rowSchedule.set(row, id);
    }
  }

  function processChatRowForMorse(row) {
    if (!chkLiveTranslate.checked) { const ex = row.querySelector(".morse-translation-container"); if (ex) ex.remove(); return; }
    if (rowIsUserActiveInput(row)) return; // never translate user's input row
    const found = findTextInChatRow(row); if (!found) return;
    const text = found.el.textContent || "";
    const sequences = findMorseSequences(text);
    if (!sequences || sequences.length === 0) { attachTranslationToRow(row, ""); return; }

    // replace morse segments with decoded plaintext
    let result = ""; let lastIdx = 0;
    for (const seq of sequences) {
      result += text.slice(lastIdx, seq.start);
      const decoded = decodeMorseSegmentToText(seq.raw);
      result += decoded;
      lastIdx = seq.end;
    }
    result += text.slice(lastIdx);
    const finalPlain = result.replace(/\s{2,}/g, " ").trim();

    // if target is wing, map the plaintext result into wing symbols
    const target = selTarget.value;
    const final = (target === "wing") ? mapToWing(finalPlain) : finalPlain;
    attachTranslationToRow(row, final);
  }

  function scanAllChatRows() {
    const rows = document.querySelectorAll(".chat-row");
    if (!rows || rows.length === 0) {
      const alt = document.querySelectorAll("[data-user-id]");
      for (const el of alt) scheduleProcessRow(el, true);
      return;
    }
    for (const row of rows) scheduleProcessRow(row, true);
  }

  let liveObserver = null;
  function startLiveTranslateObserver() {
    if (liveObserver) return;
    liveObserver = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          for (const n of m.addedNodes) {
            if (n.nodeType !== 1) continue;
            const activeInput = getChatInputEl(); if (activeInput && n.contains(activeInput)) continue;
            if (n.matches && n.matches(".chat-row")) scheduleProcessRow(n, true);
            else {
              const rows = n.querySelectorAll && n.querySelectorAll(".chat-row");
              if (rows && rows.length) for (const r of rows) { if (!rowIsUserActiveInput(r)) scheduleProcessRow(r, true); }
              else if (n.classList && n.classList.contains("chat-row")) { if (!rowIsUserActiveInput(n)) scheduleProcessRow(n, true); }
            }
          }
        }
        if (m.type === "characterData" && m.target) {
          let parent = m.target.parentNode; while (parent && !parent.classList.contains("chat-row")) parent = parent.parentNode;
          if (parent && !rowIsUserActiveInput(parent)) scheduleProcessRow(parent, false);
        }
        if (m.type === "childList" && m.target) {
          let parent = m.target; while (parent && !parent.classList.contains("chat-row")) parent = parent.parentNode;
          if (parent && !rowIsUserActiveInput(parent)) scheduleProcessRow(parent, false);
        }
      }
    });
    liveObserver.observe(document.documentElement || document.body, { childList: true, subtree: true, characterData: true });
    const fallbackInterval = setInterval(() => { if (!liveObserver) { clearInterval(fallbackInterval); return; } scanAllChatRows(); }, 2000);
    setTimeout(scanAllChatRows, 80);
  }

  function stopLiveTranslateObserver() {
    if (!liveObserver) return;
    try { liveObserver.disconnect(); } catch (e) {}
    liveObserver = null;
    const existing = document.querySelectorAll(".morse-translation-container");
    for (const el of existing) el.remove();
  }

  chkLiveTranslate.addEventListener("change", () => {
    if (chkLiveTranslate.checked) startLiveTranslateObserver(); else stopLiveTranslateObserver();
  });

  /* ------------------- lifecycle glue (per-key) ------------------- */
  btnStart.addEventListener("click", () => enable());
  btnStop.addEventListener("click", () => disable());
  btnRestore.addEventListener("click", () => {
    const el = getChatInputEl(); if (!el) return alert("chat input not found");
    const orig = lastKnownOriginal || reconstructOriginalFromSpans(el);
    el.textContent = "";
    const parts = orig.split("\n");
    for (let i = 0; i < parts.length; i++) {
      el.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) {
        const br = document.createElement("br"); br.dataset.orig = "\n"; el.appendChild(br);
      }
    }
    el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, composed: true }));
    lastKnownOriginal = orig; alert("Restored original text (with newlines) into textbox.");
  });

  btnCopy.addEventListener("click", async () => {
    const el = getChatInputEl(); if (!el) return alert("chat input not found");
    let out = "";
    for (const node of el.childNodes) {
      if (node.nodeType === 1 && node.classList && node.classList.contains("bspan")) out += node.textContent || "";
      else if (node.nodeType === 1 && node.tagName === "BR") out += "\n";
      else if (node.nodeType === 3) out += node.nodeValue || "";
      else out += node.textContent || "";
    }
    try { await navigator.clipboard.writeText(out); alert("Converted text copied to clipboard."); } catch (e) { prompt("Converted text (copy):", out); }
  });

  function enable() {
    if (enabled) return;
    const chat = getChatInputEl(); if (!chat) return alert("No chat input found — open a room page first.");
    if (chat.querySelector && chat.querySelector(".bspan")) lastKnownOriginal = reconstructOriginalFromSpans(chat);
    else { lastKnownOriginal = chat.textContent || ""; renderFromOriginalString(chat, lastKnownOriginal); }
    chat.addEventListener("keydown", onKeyDown, true); chat.addEventListener("keyup", onKeyUp, true); chat.addEventListener("paste", onPaste, true);
    observer = new MutationObserver(() => {
      const newChat = getChatInputEl();
      if (newChat && newChat !== chat) {
        try { chat.removeEventListener("keydown", onKeyDown, true); } catch (e) {}
        try { chat.removeEventListener("keyup", onKeyUp, true); } catch (e) {}
        try { chat.removeEventListener("paste", onPaste, true); } catch (e) {}
        const curOrig = lastKnownOriginal; renderFromOriginalString(newChat, curOrig);
        newChat.addEventListener("keydown", onKeyDown, true); newChat.addEventListener("keyup", onKeyUp, true); newChat.addEventListener("paste", onPaste, true);
      }
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    enabled = true; btnStart.disabled = true; btnStop.disabled = false; if (chkLiveTranslate.checked) startLiveTranslateObserver();
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
    enabled = false; btnStart.disabled = false; btnStop.disabled = true; stopLiveTranslateObserver();
    console.log("Converter disabled");
  }

  // keep UI alive on SPA
  const keepUiObs = new MutationObserver(() => { if (!document.body.contains(ui)) document.body.appendChild(ui); });
  keepUiObs.observe(document.documentElement || document.body, { childList: true, subtree: true });

  window.__PerKeyConverter = { enable, disable, restoreOriginal: () => btnRestore.click(), copyConverted: () => btnCopy.click(), version: VER };

  // auto-start live translate observer if checked (doesn't enable per-key conversion)
  if (chkLiveTranslate.checked) startLiveTranslateObserver();

  console.log("Per-key Converter + LIVE Morse Translate (wingdings) ready. Click Start to enable typing conversion. Live-translate toggle available in the UI.");
})();

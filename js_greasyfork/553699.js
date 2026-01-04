// ==UserScript==
// @name        NYT + Spellbee Spelling Bee Solver (Humanized)
// @namespace   Violentmonkey Scripts
// @match       https://spellbee.org/*
// @match       https://www.nytimes.com/puzzles/spelling-bee*
// @grant       GM_setValue
// @grant       GM_getValue
// @connect     raw.githubusercontent.com
// @version     1.6
// @license     GPL-3.0
// @author      Zach Kosove
// @description Fetch wordlist, grab letters, filter valid words, type them in humanized pace
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/553699/NYT%20%2B%20Spellbee%20Spelling%20Bee%20Solver%20%28Humanized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553699/NYT%20%2B%20Spellbee%20Spelling%20Bee%20Solver%20%28Humanized%29.meta.js
// ==/UserScript==

// ---------------- wordlist ----------------
// improve hit-rate
async function fetchWordlist() {
  const cached = GM_getValue("words", []);
  if (cached.length) return cached;

  const res = await fetch("https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_alpha.txt");
  if (!res.ok || !res.body) return [];

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  const out = [];
  let carry = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    carry += dec.decode(value, { stream: true });

    let start = 0, nl;
    while ((nl = carry.indexOf("\n", start)) !== -1) {
      const end = (nl > start && carry.charCodeAt(nl - 1) === 13) ? nl - 1 : nl;
      if (end - start >= 4) out.push(carry.slice(start, end));
      start = nl + 1;
    }
    carry = carry.slice(start);
  }

  carry += dec.decode();
  const line = carry.endsWith("\r") ? carry.slice(0, -1) : carry;
  if (line.length >= 4) out.push(line);

  GM_setValue("words", out);
  return out;
}

// ---------------- letters ----------------
async function getLetters() {
  // spellbee.org
  const target = document.querySelector("#hexGrid");
  if (target) {
    return new Promise(resolve => {
      const check = () => {
        const letters = Array.from(target.querySelectorAll(".hexLink > p"))
          .map(p => p.textContent);
        if (letters.length === 7) resolve(letters);
      };
      const obs = new MutationObserver(() => check() && obs.disconnect());
      obs.observe(target, { childList: true, subtree: true });
      check();
    });
  }

  // NYT
  return Array.from(document.querySelectorAll(".hive-cell .cell-letter"))
    .map(el => el.textContent)
    .filter(Boolean);
}

function filterWords(words, letters) {
  // NYT: center is first element (index 0)
  // Spellbee: center is 4th element (index 3)
  const required = location.hostname.includes("nytimes.com") ? letters[0] : letters[3];
  const allowed = new Set(letters);

  return words.filter(
    w => w.includes(required) && [...w].every(ch => allowed.has(ch))
  );
}

// ---------------- utils ----------------
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd   = (a, b) => a + Math.random() * (b - a);
const dispatch = (t, type, init) =>
  t.dispatchEvent(new (type.startsWith("key") ? KeyboardEvent : MouseEvent)(type, {
    bubbles: true, cancelable: true, ...init
  }));

function keyData(ch) {
  if (!ch) return null;

  // lookup for special/control keys
  const special = {
    "Enter":  { key: "Enter", code: "Enter", keyCode: 13 },
    "Tab":    { key: "Tab",   code: "Tab",   keyCode: 9 },
    "Escape": { key: "Escape",code: "Escape",keyCode: 27 },
    "Backspace": { key: "Backspace", code: "Backspace", keyCode: 8 },
    " ":      { key: " ",     code: "Space", keyCode: 32 },
    "ArrowLeft":  { key: "ArrowLeft",  code: "ArrowLeft",  keyCode: 37 },
    "ArrowUp":    { key: "ArrowUp",    code: "ArrowUp",    keyCode: 38 },
    "ArrowRight": { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
    "ArrowDown":  { key: "ArrowDown",  code: "ArrowDown",  keyCode: 40 },
  };
  if (special[ch]) return special[ch];

  // letters
  if (/^[A-Za-z]$/.test(ch)) {
    const up = ch.toUpperCase();
    const low = ch.toLowerCase();
    return {
      key: low,
      code: "Key" + up,
      keyCode: up.charCodeAt(0),
      shiftKey: ch === up
    };
  }

  // digits
  if (/^[0-9]$/.test(ch)) {
    return {
      key: ch,
      code: "Digit" + ch,
      keyCode: 48 + +ch,
      shiftKey: false
    };
  }

  // punctuation & symbols (fallback)
  return {
    key: ch,
    code: "Key" + ch,
    keyCode: ch.charCodeAt(0),
    shiftKey: /[~!@#$%^&*()_+{}|:"<>?]/.test(ch) // crude shift guess
  };
}


// ---------------- typing ----------------
async function humanKey(ch) {
  const kd = keyData(ch); if (!kd) return;
  const ev = { ...kd, which: kd.keyCode };
  dispatch(document, "keydown", ev);
  // dispatch(document, "keypress", ev);
  await sleep(rnd(15, 40));
  dispatch(document, "keyup", ev);
}

async function humanTypeWord(word) {
  // type each character
  for (const ch of word) {
    await humanKey(ch);
    await sleep(rnd(60, 150));
  }

  // submit with Enter
  await humanKey("Enter");

  // pause before next word
  await sleep(rnd(500, 1200));
}


async function simulateTyping(words) {
  const nytInput = document.querySelector("[data-testid='sb-hive-input-content-is-accepting']");
  const sbInput  = document.getElementById("testword-value");
  const target   = nytInput || sbInput;
  if (!target) return console.warn("No input found");

  target.focus();
  for (const w of words) {
    await humanTypeWord(w);
  }
}

// ---------------- spellbee.org random load ----------------
function loadRandomSpellbee() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  let letters = "";
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(Math.random() * alphabet.length);
    letters += alphabet.splice(idx, 1)[0];
  }
  window.location.href = `https://spellbee.org/unlimited?id=${letters}`;
}

// ---------------- main ----------------
(async function main() {
  const [wordlist, letters] = await Promise.all([fetchWordlist(), getLetters()]);
  const validWords = filterWords(wordlist, letters);

  await simulateTyping(validWords);

  // only cycle on spellbee.org
  if (location.hostname.includes("spellbee.org")) {
    loadRandomSpellbee();
  }
})();

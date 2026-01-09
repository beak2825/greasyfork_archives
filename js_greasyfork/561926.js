// ==UserScript==
// @name         Flatline Core (Strict + Submit Guard)
// @namespace    https://flatline.local
// @version      1.1
// @description  Strict on-page redaction + leak-surface scrubbing + form submit guard (console-only).
// @author       Flatline
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561926/Flatline%20Core%20%28Strict%20%2B%20Submit%20Guard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561926/Flatline%20Core%20%28Strict%20%2B%20Submit%20Guard%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -----------------------
  // CONFIG (strict defaults)
  // -----------------------
  const CFG = {
    enabled: true,
    debug: true,
    redactToken: '[REDACTED]',
    scanIntervalMs: 3500,
    maxLogs: 120,
    hotkeyToggle: { altKey: true, key: 'l' }, // Alt+L toggles enabled

    scrubStorage: true,
    scrubURL: true,
    scrubAttributes: true,
    scrubInputs: true,
    scrubMeta: true,
    scrubTextNodes: true,

    aggressiveHeuristics: true,

    // --- NEW: Submit Guard ---
    blockFormSubmit: true,          // prevent submit if risky tokens found
    redactFormOnBlock: true,        // redact the field values when blocking submit
    blockEnterToSubmit: true,       // if focused field is risky, block Enter key
  };

  // -----------------------
  // TARGETS (tune as needed)
  // -----------------------
  const locationWords = [
    "illinois", "california", "texas", "new york", "japan", "kyoto", "tokyo",
    "latitude", "longitude", "timezone", "zip", "zipcode", "postal", "postcode",
    "area code", "hometown", "based in", "your location", "gps", "geoip", "isp"
  ];

  const ipRegexes = [
    /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\b/g, // IPv4
    /\b([a-f0-9:]{2,}:[a-f0-9:]{2,})\b/gi // loose IPv6-ish
  ];

  const coordRegexes = [
    /\b(lat(?:itude)?)[^\d-]*(-?\d{1,2}\.\d{3,})\b/gi,
    /\b(lon(?:gitude)?|long)[^\d-]*(-?\d{1,3}\.\d{3,})\b/gi,
    /\b-?\d{1,2}\.\d{4,}\s*,\s*-?\d{1,3}\.\d{4,}\b/g
  ];

  const ATTRS = [
    "value", "placeholder", "title", "alt", "aria-label", "aria-valuetext",
    "data-tooltip", "data-title", "data-value", "data-label", "content", "href"
  ];

  const SUSPICIOUS_KEYS = [
    "location", "geo", "geolocation", "latitude", "longitude", "lat", "lon", "long",
    "timezone", "tz", "zip", "postal", "postcode", "city", "state", "region", "country",
    "isp", "ip"
  ];

  // -----------------------
  // INTERNAL HELPERS
  // -----------------------
  const logs = [];
  function log(type, msg, extra) {
    if (!CFG.debug) return;
    const line = `[FlatlineCore] ${type}: ${msg}`;
    logs.push({ t: Date.now(), type, msg, extra });
    if (logs.length > CFG.maxLogs) logs.shift();
    console.log(line, extra ?? "");
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const wordPatterns = locationWords
    .filter(Boolean)
    .map(w => new RegExp(`\\b${escapeRegExp(w)}\\b`, 'gi'));

  function redactString(input) {
    if (typeof input !== 'string' || !input) return { out: input, changed: false, hits: [] };

    let out = input;
    const hits = [];

    for (const re of wordPatterns) {
      if (re.test(out)) {
        hits.push(`WORD:${re.source}`);
        out = out.replace(re, CFG.redactToken);
      }
    }

    for (const re of ipRegexes) {
      if (re.test(out)) {
        hits.push('IP');
        out = out.replace(re, CFG.redactToken);
      }
    }

    for (const re of coordRegexes) {
      if (re.test(out)) {
        hits.push('COORD');
        out = out.replace(re, CFG.redactToken);
      }
    }

    if (CFG.aggressiveHeuristics) {
      const lower = out.toLowerCase();
      const keyish = SUSPICIOUS_KEYS.some(k => lower.includes(k));
      const hasDigits = /\d/.test(out);
      if (keyish && hasDigits) {
        hits.push('HEURISTIC');
        out = CFG.redactToken;
      }
    }

    const changed = out !== input;
    return { out, changed, hits };
  }

  function scrubTextNode(node) {
    const before = node.textContent || "";
    const { out, changed, hits } = redactString(before);
    if (changed) {
      node.textContent = out;
      log("REDACT", "Text node", { hits, before, after: out });
    }
  }

  function scrubElementAttrs(el) {
    for (const a of ATTRS) {
      if (!el.hasAttribute?.(a)) continue;
      const before = el.getAttribute(a);
      if (!before) continue;

      if (a === 'href') {
        const { changed } = redactString(before);
        if (!changed) continue;
      }

      const { out, changed, hits } = redactString(before);
      if (changed) {
        el.setAttribute(a, out);
        log("REDACT", `Attr:${a}`, { hits, before, after: out, el });
      }
    }
  }

  function scrubInputs(el) {
    if (!CFG.scrubInputs) return;
    const tag = (el.tagName || "").toLowerCase();
    if (tag !== 'input' && tag !== 'textarea') return;

    const before = el.value;
    if (!before) return;

    const { out, changed, hits } = redactString(before);
    if (changed) {
      el.value = out;
      log("REDACT", `${tag}.value`, { hits, before, after: out, name: el.name, id: el.id });
    }
  }

  function scrubMetaTags() {
    if (!CFG.scrubMeta) return;
    const metas = document.querySelectorAll?.('meta[name], meta[property]');
    metas?.forEach(m => scrubElementAttrs(m));
  }

  function scrubNode(node) {
    if (!CFG.enabled) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (CFG.scrubTextNodes) scrubTextNode(node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (CFG.scrubAttributes) scrubElementAttrs(node);
      scrubInputs(node);
      node.childNodes?.forEach(scrubNode);
    }
  }

  function scanPage() {
    if (!document.body) return;
    scrubNode(document.body);
    scrubMetaTags();
  }

  // -----------------------
  // STORAGE SCRUB
  // -----------------------
  function scrubStorageObj(storage, label) {
    if (!CFG.scrubStorage) return;
    try {
      for (let i = storage.length - 1; i >= 0; i--) {
        const k = storage.key(i);
        if (!k) continue;

        const keyLower = k.toLowerCase();
        const isSuspiciousKey = SUSPICIOUS_KEYS.some(s => keyLower.includes(s));
        if (!isSuspiciousKey) continue;

        const v = storage.getItem(k);
        if (!v) continue;

        const { out, changed, hits } = redactString(v);
        if (changed) {
          storage.setItem(k, out);
          log("REDACT", `${label}.${k}`, { hits, before: v, after: out });
        }
      }
    } catch (e) {
      log("WARN", `Storage scrub failed (${label})`, e);
    }
  }

  // -----------------------
  // URL SCRUB (soft)
  // -----------------------
  function scrubURL() {
    if (!CFG.scrubURL) return;
    try {
      const url = new URL(window.location.href);
      let changed = false;

      for (const key of Array.from(url.searchParams.keys())) {
        const keyLower = key.toLowerCase();
        if (SUSPICIOUS_KEYS.some(s => keyLower.includes(s))) {
          url.searchParams.set(key, CFG.redactToken);
          changed = true;
        }
      }

      if (changed) {
        history.replaceState(history.state, document.title, url.toString());
        log("REDACT", "URL query params", url.toString());
      }
    } catch {}
  }

  // -----------------------
  // NEW: FORM SUBMIT GUARD
  // -----------------------
  function getFieldLabel(el) {
    const parts = [];
    if (el.name) parts.push(`name="${el.name}"`);
    if (el.id) parts.push(`id="${el.id}"`);
    if (el.type) parts.push(`type="${el.type}"`);
    return parts.join(' ') || el.tagName.toLowerCase();
  }

  function scanFormFields(form) {
    const fields = Array.from(form.querySelectorAll('input, textarea, select'));
    const findings = [];

    for (const el of fields) {
      if (el.disabled) continue;

      const tag = (el.tagName || "").toLowerCase();
      let val = "";

      if (tag === 'select') {
        val = el.value || "";
      } else {
        val = (el.value ?? "").toString();
      }

      if (!val) continue;

      const res = redactString(val);
      if (res.changed) {
        findings.push({
          field: getFieldLabel(el),
          hits: res.hits,
          before: val,
          after: res.out,
          el
        });
      }
    }

    return findings;
  }

  function installSubmitGuard() {
    if (!CFG.blockFormSubmit) return;

    // Capture phase so we run before site handlers
    document.addEventListener('submit', (e) => {
      if (!CFG.enabled) return;

      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      const findings = scanFormFields(form);
      if (findings.length === 0) return;

      // BLOCK
      e.preventDefault();
      e.stopPropagation();

      log("BLOCK", "Form submit blocked (risky tokens detected)", {
        action: form.action,
        method: form.method,
        findings: findings.map(f => ({ field: f.field, hits: f.hits, before: f.before, after: f.after }))
      });

      // Optional: redact fields so the user sees it instantly
      if (CFG.redactFormOnBlock) {
        for (const f of findings) {
          try {
            f.el.value = f.after;
          } catch {}
        }
      }
    }, true);

    // Optional: block Enter-to-submit if focused field is risky
    if (CFG.blockEnterToSubmit) {
      document.addEventListener('keydown', (e) => {
        if (!CFG.enabled) return;
        if (e.key !== 'Enter') return;

        const el = document.activeElement;
        if (!el) return;
        if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;

        const val = (el.value ?? "").toString();
        if (!val) return;

        const res = redactString(val);
        if (!res.changed) return;

        e.preventDefault();
        e.stopPropagation();

        log("BLOCK", "Enter-to-submit blocked (focused field risky)", {
          field: getFieldLabel(el),
          hits: res.hits,
          before: val,
          after: res.out
        });

        if (CFG.redactFormOnBlock) {
          el.value = res.out;
        }
      }, true);
    }

    log("INFO", "Submit Guard installed (capture phase).");
  }

  // -----------------------
  // OBSERVER
  // -----------------------
  const observer = new MutationObserver(mutations => {
    if (!CFG.enabled) return;

    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes?.forEach(n => scrubNode(n));
      } else if (m.type === 'attributes' && m.target) {
        scrubElementAttrs(m.target);
        scrubInputs(m.target);
      } else if (m.type === 'characterData' && m.target) {
        scrubNode(m.target);
      }
    }
  });

  // -----------------------
  // HOTKEY TOGGLE
  // -----------------------
  window.addEventListener('keydown', (e) => {
    if (e.altKey !== CFG.hotkeyToggle.altKey) return;
    if ((e.key || "").toLowerCase() !== CFG.hotkeyToggle.key) return;

    CFG.enabled = !CFG.enabled;
    log("TOGGLE", `enabled=${CFG.enabled}`);
  });

  // -----------------------
  // INIT
  // -----------------------
  function start() {
    scrubStorageObj(localStorage, 'localStorage');
    scrubStorageObj(sessionStorage, 'sessionStorage');
    scrubURL();
    installSubmitGuard();

    const waitBody = () => {
      if (!document.body) return setTimeout(waitBody, 50);

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });

      log("INFO", `Started (enabled=${CFG.enabled}, debug=${CFG.debug}). Alt+L toggles.`);
      scanPage();

      setInterval(() => {
        scrubStorageObj(localStorage, 'localStorage');
        scrubStorageObj(sessionStorage, 'sessionStorage');
        scrubURL();
        scanPage();
      }, CFG.scanIntervalMs);
    };

    waitBody();
  }

  start();
})();
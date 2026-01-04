// ==UserScript==
// @name         SWViewer Vandalism Check
// @namespace    https://swviewer.toolforge.org/
// @version      1.0
// @description  Detect vandalism for Wikipedia diffs using DeepSeek; floating panel UI; frame-aware diff collection; configurable answer language
// @match        https://swviewer.toolforge.org/*
// @all-frames   true
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      api.deepseek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554068/SWViewer%20Vandalism%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/554068/SWViewer%20Vandalism%20Check.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* -----------------------------------------------------------
   SWViewer Vandalism Check
   (c) 2025 기나ㅏㄴ
   Released under the MIT License

   Permission is hereby granted, free of charge, to any person obtaining
   a copy of this software and associated documentation files (the
   "Software"), to deal in the Software without restriction, including
   without limitation the rights to use, copy, modify, merge, publish,
   distribute, sublicense, and/or sell copies of the Software, and to
   permit persons to whom the Software is furnished to do so, subject
   to the following conditions:

   The above copyright notice and this permission notice shall be
   included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
   IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
   CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
   TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
   SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
----------------------------------------------------------- */

  // styles
  GM_addStyle(`
    .ds-toolbar { display:flex; align-items:center; gap:6px; margin:8px 0; flex-wrap: wrap; }
    .ds-btn-primary, .ds-btn-ghost {
      appearance: none; border: 1px solid #d1d5db; cursor: pointer; padding: 6px 10px; border-radius: 6px;
      font-size: 12px; line-height: 1;
    }
    .ds-btn-primary { background:#1f6feb; color:#fff; border-color:#1f6feb; }
    .ds-btn-primary:disabled { opacity:.6; cursor: progress; }
    .ds-btn-ghost { background:#f6f8fa; color:#24292f; }

    .ds-badge {
      display:inline-block; padding:2px 8px; border-radius: 999px; font-size:11px; margin-left:8px;
    }
    .ds-badge.ok { background:#e8f5e9; color:#1b5e20; }
    .ds-badge.warn { background:#fff3e0; color:#e65100; }
    .ds-badge.danger { background:#ffebee; color:#b71c1c; }

    .ds-kv { font-size:12px; color:#374151; margin: 8px 0 12px; }
    .ds-kv b { color:#111827; }
    .ds-section { margin-bottom:12px; }
    .ds-section h4 { margin:0 0 6px; font-size:13px; }
    .ds-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; white-space: pre-wrap; background:#f8fafc; border:1px solid #e5e7eb; border-radius:6px; padding:8px; font-size:12px; }

    /* 위젯 start */
    .ds-panel {
      position: fixed; right: 16px; bottom: 16px; z-index: 99999;
      width: 520px; max-height: 75vh; overflow: hidden;
      background: #fff; color: #111; border:1px solid #e5e7eb; border-radius:12px;
      box-shadow: 0 12px 28px rgba(0,0,0,.18); display: none;
    }
    .ds-panel-header {
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 12px; background:#0b1020; color:#fff; font-weight:600;
    }
    .ds-panel-actions button {
      appearance:none; border:1px solid #e5e7eb; background:#f6f8fa; color:#24292f;
      border-radius:6px; padding:6px 8px; font-size:12px; margin-left:6px; cursor:pointer;
    }
    .ds-panel-body { padding:12px; overflow:auto; max-height: calc(75vh - 48px); }
  `);

  // utilities
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const getText = (el) => (el ? el.textContent.trim() : "");
  const escapeHtml = (s) =>
    String(s || "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );

  // frame-aware helpers
  function getSameOriginFrames(win = window) {
    const frames = [];
    const iframes = win.document.querySelectorAll("iframe");
    for (const f of iframes) {
      try {
        const doc = f.contentWindow?.document;
        if (doc) {
          frames.push(f.contentWindow);
          frames.push(...getSameOriginFrames(f.contentWindow));
        }
      } catch (e) {
        /* skip */
      }
    }
    return frames;
  }
  function findFirstAllFrames(selector) {
    const here = document.querySelector(selector);
    if (here) return { el: here, root: document };
    for (const fwin of getSameOriginFrames()) {
      const el = fwin.document.querySelector(selector);
      if (el) return { el, root: fwin.document };
    }
    return { el: null, root: document };
  }

  // globals
  let toolbarContainer;
  let panelEl;

  // settings helpers
  const getApiKey = () => GM_getValue("deepseek_api_key", "");
  const setApiKey = (key) => GM_setValue("deepseek_api_key", key);
  const getLang = () => GM_getValue("ds_lang", "en") || "en"; // 영어 디폴트로
  const setLang = (lang) =>
    GM_setValue("ds_lang", (lang || "en").trim().toLowerCase());

  // panel
  function ensurePanel() {
    if (panelEl && document.contains(panelEl)) return panelEl;
    panelEl = document.createElement("div");
    panelEl.className = "ds-panel";
    panelEl.innerHTML = `
      <div class="ds-panel-header">
        <div>SWViewer Vandalism Check <span class="ds-badge ok" id="dsStatus">Idle</span></div>
        <div class="ds-panel-actions">
          <button id="dsCopyBtn">Copy</button>
          <button id="dsCollapseBtn">Collapse</button>
          <button id="dsCloseBtn">Close</button>
        </div>
      </div>
      <div class="ds-panel-body" id="dsWidgetBody">
        <div class="ds-kv" id="dsContext"></div>
        <div class="ds-section">
          <h4>Vandalism?</h4>
          <div class="ds-mono" id="dsVandal"></div>
        </div>
        <div class="ds-section">
          <h4>Diff Analysis</h4>
          <div class="ds-mono" id="dsDiff"></div>
        </div>
        <div class="ds-section">
          <h4>Review & Conclusion</h4>
          <div class="ds-mono" id="dsFinal"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panelEl);

    // actions
    panelEl.querySelector("#dsCloseBtn").addEventListener("click", () => {
      panelEl.style.display = "none";
    });
    panelEl.querySelector("#dsCollapseBtn").addEventListener("click", () => {
      const body = panelEl.querySelector("#dsWidgetBody");
      const collapsed = body.style.display === "none";
      body.style.display = collapsed ? "block" : "none";
      panelEl.querySelector("#dsCollapseBtn").textContent = collapsed
        ? "Collapse"
        : "Expand";
    });
    panelEl.querySelector("#dsCopyBtn").addEventListener("click", () => {
      const vandal = panelEl.querySelector("#dsVandal").innerText;
      const diff = panelEl.querySelector("#dsDiff").innerText;
      const finalR = panelEl.querySelector("#dsFinal").innerText;
      const text = `Vandalism?\n${vandal}\n\nDiff Analysis\n${diff}\n\nReview & Conclusion\n${finalR}`;
      navigator.clipboard.writeText(text).then(() => {
        setStatus("Copied", "ok");
        setTimeout(() => setStatus("Done", "ok"), 900);
      });
    });
    return panelEl;
  }
  function showPanel() {
    const el = ensurePanel();
    if (!el) return;
    el.style.display = "block";
  }
  function setStatus(text, level = "ok") {
    const host = ensurePanel();
    if (!host) return;
    const el = host.querySelector("#dsStatus");
    el.textContent = text;
    el.className = `ds-badge ${level}`;
  }

  // toolbar
  function insertToolbar() {
    const { el: diffTable, root } = findFirstAllFrames("#diffTable");
    const fallbackParent =
      document.querySelector("#description-container") || document.body;

    let container =
      toolbarContainer && document.contains(toolbarContainer)
        ? toolbarContainer
        : null;

    if (!container) {
      if (diffTable && root === document) {
        const sibling = diffTable.previousElementSibling;
        container = sibling || document.createElement("div");
        if (!sibling) {
          container.style.margin = "8px 0";
          diffTable.parentNode.insertBefore(container, diffTable);
        }
      } else {
        container = document.createElement("div");
        container.style.margin = "8px 0";
        (
          document.querySelector("#description-container") || fallbackParent
        ).appendChild(container);
      }
      toolbarContainer = container;
    }

    if (
      diffTable &&
      root === document &&
      toolbarContainer &&
      toolbarContainer.nextElementSibling !== diffTable
    ) {
      toolbarContainer.style.margin = "8px 0";
      diffTable.parentNode.insertBefore(toolbarContainer, diffTable);
    }

    if (!container.querySelector(".ds-toolbar")) {
      const toolbar = document.createElement("div");
      toolbar.className = "ds-toolbar";

      const runBtn = document.createElement("button");
      runBtn.className = "ds-btn-primary";
      runBtn.textContent = "Is it Vandal?";
      runBtn.addEventListener("click", onCheckClick);

      const keyBtn = document.createElement("button");
      keyBtn.className = "ds-btn-ghost";
      keyBtn.textContent = "Settings";
      keyBtn.addEventListener("click", openSettings);

      toolbar.appendChild(runBtn);
      toolbar.appendChild(keyBtn);
      container.appendChild(toolbar);
    }
  }

  // collect page info
  function collectBasics() {
    const root = qs("#description-container") || document;
    const user = getText(qs("#userLinkSpec", root));
    const wiki = getText(qs("#wiki", root));
    const title = getText(qs("#pageLinkSpec", root));
    const summary = getText(qs("#com", root));
    return { user, wiki, title, summary };
  }

  // strong diff collector frame-aware
  function collectDiffs() {
    const { el: diffTable, root } = findFirstAllFrames("#diffTable");
    if (!diffTable) {
      console.debug("[DS Vandal] #diffTable not found in any accessible frame");
      return {
        beforeText: "",
        afterText: "",
        beforeList: [],
        afterList: [],
        pairs: [],
      };
    }

    const $$ = (sel, r = root) => Array.from(r.querySelectorAll(sel));
    const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

    // 임시1
    const rows = $$("#diffTable tbody tr", root);
    const beforeChunks = [];
    const afterChunks = [];

    if (rows.length) {
      rows.forEach((tr) => {
        const tds = Array.from(tr.querySelectorAll("td")).filter((td) => {
          const c = td.className || "";
          return /diff-/.test(c) && !/diff-marker/.test(c);
        });
        if (tds.length === 2) {
          beforeChunks.push(norm(tds[0].textContent));
          afterChunks.push(norm(tds[1].textContent));
        } else if (tds.length === 1) {
          const c = tds[0].className;
          const text = norm(tds[0].textContent);
          if (/deleted|old|side-deleted/.test(c)) beforeChunks.push(text);
          else if (/added|new|side-added/.test(c)) afterChunks.push(text);
          else beforeChunks.push(text); // 애매하면 이전
        }
      });
    }

    // 임시2
    if (beforeChunks.length === 0 && afterChunks.length === 0) {
      const beforeNodes = [
        ...$$("td.diff-context.diff-side-deleted div", root),
        ...$$("td.diff-deletedline", root),
        ...$$("td.diff-content del", root),
        ...$$("del.mw-diff-deletedline", root),
        ...$$("span.mw-diff-del", root),
      ];
      const afterNodes = [
        ...$$("td.diff-context.diff-side-added div", root),
        ...$$("td.diff-addedline", root),
        ...$$("td.diff-content ins", root),
        ...$$("ins.mw-diff-addedline", root),
        ...$$("span.mw-diff-ins", root),
      ];
      beforeChunks.push(...beforeNodes.map((n) => norm(n.textContent)));
      afterChunks.push(...afterNodes.map((n) => norm(n.textContent)));
    }

    // 임시3
    const MAX_TOTAL = 300000; // 최대
    const joinClean = (arr) =>
      arr.filter(Boolean).join("\n").slice(0, MAX_TOTAL);
    const beforeText = joinClean(beforeChunks);
    const afterText = joinClean(afterChunks);

    console.debug("[DS Vandal] whole-text stats:", {
      rows: rows.length,
      beforeLen: beforeText.length,
      afterLen: afterText.length,
    });

    return {
      beforeText,
      afterText,
      beforeList: beforeChunks,
      afterList: afterChunks,
      pairs: [],
    };
  }

  // DeepSeek API
  const API_ENDPOINT = "https://api.deepseek.com/chat/completions";
  function buildPrompt(basics, diffs) {
    const lang = getLang();
    const nowIso = new Date().toISOString();

    const hasRefLike = /<ref|http[s]?:\/\/|www\./i.test(diffs.afterText);
    const hasDateLike =
      /\b20\d{2}[-/\.](0?[1-9]|1[0-2])([-/\.](0?[1-9]|[12]\d|3[01]))?\b/.test(
        diffs.afterText
      );

    return `
You are a rigorous assistant for detecting vandalism in Wikipedia diffs. Output JSON only (json).
All natural-language text in the JSON **must be written in ${lang}f** (use fluent ${lang}); keep JSON keys/booleans in English.

ROLE & GOAL:
- Decide if the edit is vandalism by comparing the whole previous revision vs the whole latest revision.
- Prefer precision over recall: only mark "is_vandalism": true when the evidence is **clear and strong**.
- Time-sensitive but plausible updates (e.g., winner/awarded/score/announcement) should NOT be labeled vandalism by default; advise verification instead.

INPUT CONTEXT:
- current_time_utc: ${nowIso}
- wiki: ${basics.wiki || "(unknown)"}
- page_title: ${basics.title || "(unknown)"}
- editor: ${basics.user || "(unknown)"}
- edit_summary: ${basics.summary || "(none)"}
- heuristic_flags: { has_ref_like: ${hasRefLike}, has_date_like: ${hasDateLike} }

TEXT BEFORE (previous revision, whole):
<<<BEFORE_FULL
${diffs.beforeText || "(empty)"}
BEFORE_FULL

TEXT AFTER (latest revision, whole):
<<<AFTER_FULL
${diffs.afterText || "(empty)"}
AFTER_FULL

TASK:
- Compare BEFORE_FULL vs AFTER_FULL as entire documents.
- Extract the **key semantic changes** you detect (additions/removals/alterations).
- Judge vandalism vs non-vandalism accordingly.

OUTPUT — JSON only:
{
  "is_vandalism": boolean,     // true only if clear intentional harm
  "confidence": number,        // 0..1 (lower when evidence is weak/time-sensitive without sources)
  "diff_analysis": [           // concise bullet points in ${lang}; no need for indices
    {"summary": string}
  ],
  "final_review": string       // in ${lang}; overall reasoning and what to verify if needed
}
  `.trim();
  }

  function callDeepSeek(prompt) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API_KEY_MISSING");

    const req = (useJsonMode = true) =>
      new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: API_ENDPOINT,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          data: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content:
                  "You are a concise and careful Wikipedia vandalism detection assistant. Prefer precision over recall.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.35,
            max_tokens: 5000,
            ...(useJsonMode
              ? { response_format: { type: "json_object" } }
              : {}),
          }),
          onload: function (res) {
            try {
              if (res.status === 401)
                return reject(new Error("API_UNAUTHORIZED"));
              if (res.status === 429)
                return reject(new Error("API_RATE_LIMIT"));
              if (res.status < 200 || res.status >= 300)
                return reject(new Error(`API_HTTP_${res.status}`));
              const data = JSON.parse(res.responseText);
              const msg = data?.choices?.[0]?.message?.content;
              console.debug("[DeepSeek raw response]", data);
              if (typeof msg !== "string" || msg.trim() === "")
                return reject(new Error("API_EMPTY_RESPONSE"));
              const parsed = JSON.parse(msg);
              resolve(parsed);
            } catch (e) {
              reject(e);
            }
          },
          onerror: () => reject(new Error("API_NETWORK_ERROR")),
          ontimeout: () => reject(new Error("API_TIMEOUT")),
          timeout: 30000,
        });
      });

    return req(true).catch((err) => {
      if (
        String(err.message) === "API_EMPTY_RESPONSE" ||
        String(err.message).includes("SyntaxError")
      ) {
        console.warn(
          "[DeepSeek] JSON mode failed, retrying without response_format …"
        );
        return req(false);
      }
      throw err;
    });
  }

  // render
  function renderResult(basics, result) {
    const host = ensurePanel();
    if (!host) return;
    showPanel();

    // 배지
    const isV = !!result?.is_vandalism;
    const conf = Number.isFinite(result?.confidence) ? result.confidence : 0;
    const level = isV ? (conf >= 0.7 ? "danger" : "warn") : "ok";
    setStatus(isV ? "Suspected" : "Normal", level);

    // 컨텍스트
    const ctx = host.querySelector("#dsContext");
    ctx.innerHTML = `
  <b>wiki</b>: ${escapeHtml(basics.wiki)} &nbsp; | &nbsp;
  <b>page</b>: ${escapeHtml(basics.title)} &nbsp; | &nbsp;
  <b>editor</b>: ${escapeHtml(basics.user)} &nbsp; | &nbsp;
  <b>lang</b>: ${escapeHtml(getLang())} &nbsp; | &nbsp;
  <b>confidence</b>: ${conf.toFixed(2)}
`;

    // 요약 배너
    host.querySelector("#dsVandal").textContent = isV
      ? "Yes (suspected)"
      : "No (likely normal)";

    const items = Array.isArray(result?.diff_analysis)
      ? result.diff_analysis
      : [];
    const lines =
      items
        .map((it, idx) => {
          if (typeof it === "string") return `#${idx + 1}: ${it}`;
          const i =
            typeof it.index === "number" && isFinite(it.index)
              ? it.index
              : idx + 1;
          const s =
            typeof it.summary === "string" && it.summary.trim()
              ? it.summary
              : "No summary";
          return `#${i}: ${s}`;
        })
        .join("\n") || "(no analysis)";

    host.querySelector("#dsDiff").textContent = lines;

    host.querySelector("#dsFinal").textContent =
      typeof result?.final_review === "string" && result.final_review.trim()
        ? result.final_review
        : "(no review)";
  }

  // settings 2
  let settingsModal, settingsMask, keyInput, langInput;
  function openSettings() {
    ensureSettings();
    settingsMask.style.display = "block";
    settingsModal.style.display = "block";
    keyInput.value = getApiKey();
    langInput.value = getLang();
  }
  function closeSettings() {
    settingsMask.style.display = "none";
    settingsModal.style.display = "none";
  }
  function ensureSettings() {
    if (settingsModal) return;
    settingsMask = document.createElement("div");
    settingsMask.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:99998;display:none;";
    document.body.appendChild(settingsMask);

    settingsModal = document.createElement("div");
    settingsModal.style.cssText =
      "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:520px;background:#fff;border-radius:10px;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:99999;display:none;";
    settingsModal.innerHTML = `
      <div style="padding:10px 12px;background:#111827;color:#fff;font-weight:600;border-top-left-radius:10px;border-top-right-radius:10px;">Settings</div>
      <div style="padding:12px;">
        <label style="font-size:12px;color:#374151;display:block;margin-bottom:6px;">DeepSeek API Key (kept locally):</label>
        <input id="dsKeyInput" type="password" placeholder="sk-..." style="width:100%;box-sizing:border-box;padding:8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin-bottom:10px;">
        <label style="font-size:12px;color:#374151;display:block;margin-bottom:6px;">Answer language (e.g., English, Korean, Japanese):</label>
        <input id="dsLangInput" type="text" placeholder="en" style="width:120px;box-sizing:border-box;padding:8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;">
      </div>
      <div style="padding:10px 12px;display:flex;justify-content:flex-end;gap:8px;">
        <button class="ds-btn" id="dsCancelBtn" style="appearance:none;border:1px solid #e5e7eb;background:#f6f8fa;color:#24292f;border-radius:6px;padding:6px 10px;font-size:13px;cursor:pointer;">Cancel</button>
        <button class="ds-btn primary" id="dsSaveBtn" style="appearance:none;border:1px solid #1f6feb;background:#1f6feb;color:#fff;border-radius:6px;padding:6px 10px;font-size:13px;cursor:pointer;">Save</button>
      </div>
    `;
    document.body.appendChild(settingsModal);

    keyInput = settingsModal.querySelector("#dsKeyInput");
    langInput = settingsModal.querySelector("#dsLangInput");

    settingsModal.querySelector("#dsSaveBtn").addEventListener("click", () => {
      setApiKey(keyInput.value.trim());
      setLang(langInput.value.trim() || "en");
      closeSettings();
      alert("Saved settings.");
    });
    settingsModal
      .querySelector("#dsCancelBtn")
      .addEventListener("click", closeSettings);
    settingsMask.addEventListener("click", closeSettings);
  }
  GM_registerMenuCommand("Settings (API Key & Language)", openSettings);

  // main click handler
  async function onCheckClick(e) {
    const btn = e.currentTarget;
    try {
      btn.disabled = true;
      insertToolbar();
      showPanel();
      setStatus("Collecting…", "ok");

      const basics = collectBasics();
      const diffs = collectDiffs();
      if (!diffs.beforeText && !diffs.afterText) {
        setStatus("No content to compare", "warn");
      } else {
        setStatus("Analyzing…", "warn");
      }

      const prompt = buildPrompt(basics, diffs);
      const result = await callDeepSeek(prompt);
      setStatus("Done", "ok");
      renderResult(basics, result);
    } catch (err) {
      console.error(err);
      showPanel();
      if (String(err.message) === "API_KEY_MISSING") {
        setStatus("Missing Key", "danger");
        alert("DeepSeek API key is not set. Open Settings to add it.");
        openSettings();
      } else if (String(err.message) === "API_UNAUTHORIZED") {
        setStatus("Unauthorized", "danger");
        alert(
          "DeepSeek authentication failed (401). Please verify your API key."
        );
      } else if (String(err.message) === "API_RATE_LIMIT") {
        setStatus("Rate Limited", "warn");
        alert("Too many requests to DeepSeek (429). Please try again later.");
      } else if (String(err.message).startsWith("API_HTTP_")) {
        setStatus("Error", "danger");
        alert("DeepSeek error: " + err.message);
      } else if (String(err.message) === "API_TIMEOUT") {
        setStatus("Timeout", "warn");
        alert("DeepSeek request timed out.");
      } else if (
        String(err.message).includes("SyntaxError") ||
        String(err.message) === "API_EMPTY_RESPONSE"
      ) {
        setStatus("Retrying…", "warn");
        alert(
          "Got an empty/invalid JSON response. Retrying once without JSON mode…"
        );
        try {
          const basics2 = collectBasics();
          const diffs2 = collectDiffs();
          const prompt2 = buildPrompt(basics2, diffs2);
          const result2 = await callDeepSeek(prompt2);
          setStatus("Done", "ok");
          renderResult(basics2, result2);
        } catch (e2) {
          setStatus("Error", "danger");
          alert("Retry failed. See console for details.");
        }
      } else {
        setStatus("Network/Error", "danger");
        alert("An error occurred during analysis. See console for details.");
      }
    } finally {
      btn.disabled = false;
    }
  }

  // boot
  function boot() {
    insertToolbar();
    const observer = new MutationObserver(() => insertToolbar());
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("[DS Vandal] booted, lang:", getLang());
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

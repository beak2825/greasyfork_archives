// ==UserScript==
// @name         Ultimate Grok AI Prompt Manager - Save, Edit, Insert Custom Prompts 🚀💬
// @namespace    grok.prompt.manager
// @version      1.0
// @description  4 prompt slots for Grok's Custom Instructions.
// @author       Mr005K
// @match        https://grok.com/*
// @match        https://*.grok.com/*
// @match        https://x.ai/*
// @match        https://*.x.ai/*
// @license      MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550433/Ultimate%20Grok%20AI%20Prompt%20Manager%20-%20Save%2C%20Edit%2C%20Insert%20Custom%20Prompts%20%F0%9F%9A%80%F0%9F%92%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550433/Ultimate%20Grok%20AI%20Prompt%20Manager%20-%20Save%2C%20Edit%2C%20Insert%20Custom%20Prompts%20%F0%9F%9A%80%F0%9F%92%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "grok-prompt-manager-v1";
  const UI_ATTR = "data-grok-prompt-manager";
  const DIALOG_ATTR = "data-gpm-installed";
  const TA_ATTR = "data-gpm-bound";
  const DEBUG = false;

  const log = (...a) => DEBUG && console.log("[GrokPM]", ...a);

  const DEFAULT_SLOTS = [
    { name: "Slot 1", text: "" },
    { name: "Slot 2", text: "" },
    { name: "Slot 3", text: "" },
    { name: "Slot 4", text: "" },
  ];

  function loadSlots() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [...DEFAULT_SLOTS];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length !== 4) return [...DEFAULT_SLOTS];
      return parsed.map((s, i) => ({
        name: typeof s?.name === "string" && s.name.trim() ? s.name : `Slot ${i + 1}`,
        text: typeof s?.text === "string" ? s.text : "",
      }));
    } catch {
      return [...DEFAULT_SLOTS];
    }
  }
  function saveSlots(slots) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    } catch {
      alert("Could not save slots (localStorage is blocked).");
    }
  }

  function findByText(root, selector, text) {
    const els = root.querySelectorAll(selector);
    text = (text || "").trim().toLowerCase();
    for (const el of els) {
      const t = (el.textContent || "").trim().toLowerCase();
      if (t.includes(text)) return el;
    }
    return null;
  }

  function getCustomTextarea(root = document) {
    // Primary: the known placeholder
    let ta = root.querySelector('textarea[placeholder="How should Grok behave?"]');
    if (ta) return ta;
    // Fallback: under "Custom Instructions"
    const label = findByText(root, "label, div, p", "custom instructions");
    if (label) {
      const container = label.closest("div")?.parentElement || label.parentElement;
      if (container) {
        ta = container.querySelector("textarea");
        if (ta) return ta;
      }
    }
    // Last resort: first visible textarea in the dialog
    const dialog = root.closest('[role="dialog"]') || root.querySelector('[role="dialog"]');
    if (dialog) {
      const candidates = [...dialog.querySelectorAll("textarea")].filter(isVisible);
      if (candidates.length) return candidates[0];
    }
    return null;
  }

  function isCustomizeDialog(root) {
    const header = findByText(root, "p, h2, h3, div", "customize grok's response");
    const label = findByText(root, "label, div, p", "custom instructions");
    return !!(header && label);
  }

  function isVisible(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
  }

  function setTextareaValue(textarea, value) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
    if (setter) setter.call(textarea, value);
    else textarea.value = value;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function buildUI(textarea) {
    const slots = loadSlots();
    const ui = document.createElement("div");
    ui.setAttribute(UI_ATTR, "1");
    ui.className =
      "flex flex-col gap-2 p-2 rounded-2xl ring-1 ring-inset ring-toggle-border hover:ring-card-border-focus bg-button-ghost-hover";
    ui.style.marginBottom = "8px";
    ui.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="text-sm font-semibold">Prompt Manager</div>
        <div class="text-xs text-secondary">Insert into the box below. Use Grok’s own <b>Save</b> after.</div>
      </div>
      <div class="flex flex-wrap gap-2" role="tablist" aria-label="Prompt Slots">
        ${slots
          .map(
            (s, i) => `
          <button data-slot="${i}" data-role="slot-btn"
            class="inline-flex items-center justify-start gap-2 text-sm rounded-2xl px-3 py-2 ring-1 ring-inset ring-toggle-border hover:bg-card-hover text-primary">
            <span class="truncate max-w-[9rem]">${escapeHtml(s.name || `Slot ${i + 1}`)}</span>
          </button>`
          )
          .join("")}
      </div>
      <div data-role="editor" class="flex flex-col gap-2 hidden mt-2 rounded-xl border border-border-l2 p-2">
        <div class="flex items-center gap-2">
          <label class="text-xs text-secondary">Name</label>
          <input data-role="name" class="flex-1 text-sm bg-transparent rounded-xl border border-border-l2 px-2 py-1" placeholder="Slot name">
        </div>
        <textarea data-role="text" class="w-full text-sm bg-transparent rounded-xl border border-border-l2 p-2" style="min-height: 120px;" placeholder="Saved prompt here..."></textarea>
        <div class="flex flex-wrap gap-2 justify-end">
          <button data-action="import" class="text-xs rounded-xl px-3 py-2 ring-1 ring-inset ring-toggle-border hover:bg-card-hover">Import Current</button>
          <button data-action="clear"  class="text-xs rounded-xl px-3 py-2 ring-1 ring-inset ring-toggle-border hover:bg-card-hover">Clear</button>
          <div class="flex-1"></div>
          <button data-action="save"   class="text-xs rounded-xl px-3 py-2 bg-button-filled text-fg-invert hover:bg-button-filled-hover">Save Slot</button>
          <button data-action="insert" class="text-xs rounded-xl px-3 py-2 bg-button-filled text-fg-invert hover:bg-button-filled-hover">Insert into Custom</button>
        </div>
      </div>
    `;

    // Wire up editor
    const editor = ui.querySelector('[data-role="editor"]');
    const nameInput = editor.querySelector('[data-role="name"]');
    const textInput = editor.querySelector('[data-role="text"]');
    let currentSlots = slots;
    let openIndex = null;

    ui.addEventListener("click", (e) => {
      const slotBtn = e.target.closest("[data-role='slot-btn']");
      if (slotBtn) {
        openIndex = Number(slotBtn.getAttribute("data-slot"));
        const s = currentSlots[openIndex] || {};
        nameInput.value = s.name || `Slot ${openIndex + 1}`;
        textInput.value = s.text || "";
        editor.classList.remove("hidden");
        ui.querySelectorAll("[data-role='slot-btn']").forEach((b) => {
          const active = Number(b.getAttribute("data-slot")) === openIndex;
          b.classList.toggle("bg-button-ghost-hover", active);
          b.classList.toggle("ring-card-border-focus", active);
        });
        return;
      }

      const act = e.target.closest("[data-action]");
      if (!act) return;
      const action = act.getAttribute("data-action");

      if (action === "import") {
        textInput.value = textarea.value || "";
      } else if (action === "clear") {
        nameInput.value = currentSlots[openIndex]?.name || `Slot ${openIndex + 1}`;
        textInput.value = "";
      } else if (action === "save") {
        if (openIndex == null) return;
        const n = (nameInput.value || "").trim() || `Slot ${openIndex + 1}`;
        currentSlots[openIndex] = { name: n, text: textInput.value || "" };
        saveSlots(currentSlots);
        const labelSpan = ui.querySelector(`[data-role='slot-btn'][data-slot='${openIndex}'] span`);
        if (labelSpan) labelSpan.textContent = n;
        flash(act);
      } else if (action === "insert") {
        if (openIndex == null) return;
        setTextareaValue(textarea, textInput.value || "");
        flash(act);
      }
    });

    function flash(btn) {
      btn.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
    }

    return ui;
  }

  // Debounced attach routine
  let rafToken = null;
  function scheduleAttach() {
    if (rafToken) cancelAnimationFrame(rafToken);
    rafToken = requestAnimationFrame(tryAttach);
  }

  let pollTimer = setInterval(scheduleAttach, 1200);
  const observer = new MutationObserver(scheduleAttach);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  function tryAttach() {
    rafToken = null;

    // Find visible dialogs
    const dialogs = [...document.querySelectorAll('[role="dialog"]')].filter(isVisible);
    let installedAny = false;

    for (const dlg of dialogs) {
      if (!isCustomizeDialog(dlg)) continue;

      // If already installed in this dialog, skip
      if (dlg.hasAttribute(DIALOG_ATTR) || dlg.querySelector(`[${UI_ATTR}]`)) {
        continue;
      }

      const ta = getCustomTextarea(dlg);
      if (!ta || !isVisible(ta)) continue;

      // Guard on the textarea as well
      if (ta.hasAttribute(TA_ATTR)) continue;

      // Build & insert UI directly before the textarea (lowest-risk spot).
      const ui = buildUI(ta);
      const parent = ta.parentElement || dlg;
      parent.insertBefore(ui, ta);

      // Mark installed
      dlg.setAttribute(DIALOG_ATTR, "1");
      ta.setAttribute(TA_ATTR, "1");
      installedAny = true;
      log("Installed Prompt Manager.");
    }

    // If we successfully installed at least once, stop the poller (observer remains).
    if (installedAny && pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  // First run
  scheduleAttach();
})();

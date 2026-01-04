// ==UserScript==
// @name         ChatGPT Insight Tracker
// @namespace    https://greasyfork.org/en/users/1019658-aayush-dutt
// @version      1.0
// @description  Extract insights from your ChatGPT usage and export them
// @author       aayushdutt
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @all-frames   true
// @license      MIT
// @link
// @downloadURL https://update.greasyfork.org/scripts/552509/ChatGPT%20Insight%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/552509/ChatGPT%20Insight%20Tracker.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Prevent multi-frame double injection; only run in top window
  if (unsafeWindow.top !== unsafeWindow.self) {
    return;
  }

  class Config {
    static STORAGE_KEY = "chatgpt_usage_logs";
    static SETTINGS_KEY = "chatgpt_tracker_settings";
    static TARGET_URL = "https://chatgpt.com/backend-api/f/conversation";
    static DEFAULT_SETTINGS = {
      truncatePrompt: true,
      truncatePromptLen: 160,
      anonymizePrompt: false,
      retention: { maxCount: null, maxDays: null },
    };
    static HEADER_BUTTON_ID = "usage-logs-header-button";
  }

  class SettingsService {
    async get() {
      const s = await GM_getValue(Config.SETTINGS_KEY, Config.DEFAULT_SETTINGS);
      return {
        ...Config.DEFAULT_SETTINGS,
        ...(s || {}),
        retention: {
          ...Config.DEFAULT_SETTINGS.retention,
          ...(s?.retention || {}),
        },
      };
    }
    async set(next) {
      await GM_setValue(Config.SETTINGS_KEY, next);
    }
  }

  class LogsService {
    constructor(settings) {
      this.settings = settings;
    }
    async getAll() {
      const logs = await GM_getValue(Config.STORAGE_KEY, []);
      return (Array.isArray(logs) ? logs : []).map((l) => ({
        timestamp: l.timestamp || new Date().toISOString(),
        model: l.model ?? null,
        prompt: l.prompt ?? "",
        conversationId: l.conversationId ?? null,
        durations: l.durations ?? { msToFirstToken: null, msTotal: null },
      }));
    }
    async save(entry) {
      const logs = await this.getAll();
      logs.push(entry);
      const settings = await this.settings.get();
      const rawMaxDays = settings.retention?.maxDays;
      const maxDays =
        rawMaxDays == null || rawMaxDays === "" ? null : Number(rawMaxDays);
      const byAge = (() => {
        if (!maxDays || isNaN(maxDays) || maxDays <= 0) return logs;
        const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
        return logs.filter((l) => {
          const t = Date.parse(l.timestamp);
          return isNaN(t) ? true : t >= cutoff;
        });
      })();
      const rawMaxCount = settings.retention?.maxCount;
      const maxCount =
        rawMaxCount == null || rawMaxCount === "" ? null : Number(rawMaxCount);
      const trimmed =
        !maxCount || isNaN(maxCount) || maxCount <= 0
          ? byAge
          : byAge.slice(-maxCount);
      await GM_setValue(Config.STORAGE_KEY, trimmed);
    }
    async clearAndRefreshUI() {
      await GM_setValue(Config.STORAGE_KEY, []);
      const existingModal = document.getElementById("usage-modal-container");
      if (existingModal) existingModal.remove();
      // UI will re-open via handler
    }
  }

  function csvEscape(val) {
    const s = String(val ?? "");
    if (s.includes("\n") || s.includes(",") || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }
  function safeStr(v) {
    return v == null ? "" : String(v);
  }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  class StreamProcessor {
    constructor(settings, logs) {
      this.settings = settings;
      this.logs = logs;
    }
    async process(response, requestMeta) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let lineBuffer = "";
      let userPrompt = null;
      let modelSlug = null;
      let defaultModelSlug = null;
      let conversationId = null;
      let serverMeta = null;
      let tFirstToken = null;
      let tDone = null;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          lineBuffer += chunk;
          const lines = lineBuffer.split("\n");
          lineBuffer = lines.pop() || "";
          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line || !line.startsWith("data:")) continue;
            const dataStr = line.slice(5).trim();
            if (dataStr === "[DONE]") {
              tDone = tDone || Date.now();
              continue;
            }
            try {
              const data = JSON.parse(dataStr);
              if (data.type === "input_message") {
                conversationId = conversationId || data.conversation_id || null;
                const parts0 = data.input_message?.content?.parts?.[0];
                if (
                  !userPrompt &&
                  typeof parts0 === "string" &&
                  parts0.length
                ) {
                  userPrompt = parts0;
                }
              } else if (data.type === "server_ste_metadata") {
                conversationId = conversationId || data.conversation_id || null;
                serverMeta = data.metadata || serverMeta;
                if (serverMeta) {
                  modelSlug = modelSlug || serverMeta.model_slug || null;
                  defaultModelSlug =
                    defaultModelSlug || serverMeta.default_model_slug || null;
                }
              } else if (data.type === "message_marker") {
                if (
                  data.marker === "user_visible_token" &&
                  data.event === "first"
                ) {
                  tFirstToken = tFirstToken || Date.now();
                }
              } else if (data.type === "message_stream_complete") {
                tDone = tDone || Date.now();
              }
              if (data.v) {
                conversationId = conversationId || data.conversation_id || null;
                const vMsg = data.v.message;
                if (vMsg && !modelSlug && vMsg.metadata?.model_slug) {
                  modelSlug = vMsg.metadata.model_slug;
                }
              }
            } catch (_) {}
          }
        }

        const tRequest = requestMeta?.requestStartTs || Date.now();
        const msToFirstToken = tFirstToken ? tFirstToken - tRequest : null;
        const msTotal = (tDone || Date.now()) - tRequest;

        const settings = await this.settings.get();
        let promptForLog = (userPrompt || "").trim();
        const twoLines = promptForLog.split(/\r?\n/).slice(0, 2).join("\n");
        promptForLog = twoLines;
        if (settings.anonymizePrompt) {
          promptForLog = "[anonymized]";
        } else if (
          settings.truncatePrompt &&
          promptForLog.length > settings.truncatePromptLen
        ) {
          promptForLog = `${promptForLog.slice(
            0,
            settings.truncatePromptLen
          )}...`;
        }

        const resolvedModel = modelSlug || defaultModelSlug || null;
        if (!promptForLog || !resolvedModel) {
          return;
        }

        const logEntry = {
          timestamp: new Date().toISOString(),
          model: resolvedModel,
          prompt: promptForLog,
          conversationId,
          durations: { msToFirstToken, msTotal },
        };

        await this.logs.save(logEntry);
      } catch (error) {
        console.error("ChatGPT Tracker: Error processing stream:", error);
        try {
          reader.cancel();
        } catch (_) {}
      }
    }
  }

  class FetchInterceptor {
    constructor(streamProcessor) {
      this.streamProcessor = streamProcessor;
      this._installed = false;
      this._originalFetch = null;
    }
    install() {
      if (this._installed) return;
      this._installed = true;
      this._originalFetch = unsafeWindow.fetch;
      const self = this;
      unsafeWindow.fetch = async function (...args) {
        const url = typeof args[0] === "string" ? args[0] : args[0].url;
        if (!url || !String(url).startsWith(Config.TARGET_URL)) {
          return self._originalFetch.apply(this, args);
        }
        console.log("ChatGPT Tracker: Intercepted conversation request.");
        try {
          const requestStartTs = Date.now();
          const response = await self._originalFetch.apply(this, args);
          const cloned = response.clone();
          self.streamProcessor.process(cloned, { requestStartTs });
          return response;
        } catch (err) {
          console.error(
            "ChatGPT Tracker: Error intercepting fetch request:",
            err
          );
          return self._originalFetch.apply(this, args);
        }
      };
    }
  }

  function injectStyles() {
    GM_addStyle(`
        #usage-modal-container {
            position: fixed;
            z-index: 99999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --color-bg: #202123;
            --color-surface: #2a2b32;
            --color-border: #3a3b44;
            --color-chip-border: rgba(255,255,255,0.35);
            --color-text: #e6e6e7;
            --color-muted: #b2b3b8;
            --color-primary: #e6e6e7;
            --color-primary-hover: #d4d4d8;
            --color-danger: #ef4444;
            --color-button-bg: #2d2f33;
            --color-button-hover: #3a3d42;
            --color-input-bg: #202123;
            --color-input-border: #3f4145;
            --color-focus-ring: rgba(230, 230, 231, 0.35);
        }

        #usage-modal-content {
            background-color: var(--color-surface);
            color: var(--color-text);
            margin: auto;
            padding: 24px;
            border: 1px solid var(--color-border);
            border-radius: 12px;
            width: 80%;
            max-width: 900px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--color-border);
        }
        .modal-actions { display: inline-flex; gap: 8px; align-items: center; margin-left: auto; }
        .modal-button, .dropdown > .modal-button { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .modal-button svg { flex: 0 0 auto; }
        .dropdown > .modal-button svg { margin-left: 0; }

        .modal-header h2 {
            margin: 0;
            font-size: 20px;
        }

        .modal-button {
            border: none;
            background-color: var(--color-button-bg);
            color: var(--color-text);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
            border: 1px solid var(--color-border);
        }

        .modal-button.primary {
            background-color: var(--color-primary);
            border-color: transparent;
            color: #0b1613;
        }

        .modal-button.primary:hover {
            background-color: var(--color-primary-hover);
        }

        .modal-button.clear {
            background-color: transparent;
            color: var(--color-danger);
            border: 1px solid var(--color-danger);
        }

        .modal-button.clear:hover {
            background-color: transparent;
            color: #f87171;
            border-color: #f87171;
        }

        .modal-button.close {
            font-size: 24px;
            font-weight: bold;
            line-height: 1;
            padding: 4px 10px;
            background: transparent;
            color: var(--color-muted);
            border: none;
        }

        .modal-button:hover {
            background-color: var(--color-button-hover);
        }

        .modal-button:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px var(--color-focus-ring);
        }

        .modal-button.active {
            background: rgba(255, 255, 255, 0.12);
            border-color: #6b7280;
        }

        .dropdown { position: relative; }
        .dropdown-menu {
            position: absolute;
            top: calc(100% + 6px);
            right: 0;
            min-width: 140px;
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 6px;
            display: none;
            box-shadow: 0 8px 20px rgba(0,0,0,0.35);
            z-index: 100000;
        }
        .dropdown-menu.open { display: block; }
        .dropdown-item {
            background: transparent;
            color: var(--color-text);
            border: none;
            border-radius: 6px;
            padding: 8px 10px;
            width: 100%;
            text-align: left;
            cursor: pointer;
        }
        .dropdown-item:hover { background: var(--color-button-hover); }

        #usage-logs-header-button {
            border: 1px solid rgba(255, 255, 255, 0.15);
        }
        #usage-logs-header-button:hover,
        #usage-logs-header-button:focus-visible {
            border-color: rgba(255, 255, 255, 0.4);
        }

        .table-container { margin-top: 16px; overflow: auto; min-height: 0; flex: 1 1 auto; }
        .table-controls { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
        .model-filter { min-width: 150px; padding-right: 34px; background-position: right 8px center; }
        .summary { margin-top: 12px; }
        .tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .tabs .tab { background: var(--color-button-bg); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 999px; padding: 4px 9px; cursor: pointer; transition: background-color 0.15s, border-color 0.15s; }
        .tabs .tab:hover { background: rgba(255, 255, 255, 0.08); border-color: #6b7280; }
        .tabs .tab.active { background: rgba(255, 255, 255, 0.12); border-color: #6b7280; color: var(--color-text); }
        .summary-content { margin-top: 10px; }
        .summary-content .cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .summary-content .card { background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 10px; padding: 10px 12px; box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset; }
        .summary-content .card .label { color: var(--color-muted); font-size: 12px; margin-bottom: 4px; }
        .summary-content .card .value { font-size: 18px; font-weight: 600; }
        .sparkline { margin-top: 10px; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 8px; padding: 6px; }
        .sparkline canvas { width: 100%; height: 60px; display: block; }
        .view-tabs { margin-top: 12px; }
        .model-cards { display: grid; grid-template-columns: repeat( auto-fit, minmax(220px, 1fr) ); gap: 12px; margin-top: 8px; }
        .model-card .model-title { margin-bottom: 8px; }
        .model-card .model-metrics { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .modal-input, .modal-select { background-color: var(--color-input-bg); color: var(--color-text); border: 1px solid var(--color-input-border); border-radius: 8px; padding: 8px 10px; transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s; }
        .input-w-80 { width: 80px; }
        .input-w-100 { width: 100px; }
        .modal-input::placeholder { color: var(--color-muted); }
        .modal-input:focus, .modal-select:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-focus-ring); }
        #usage-modal-content table { width: 100%; border-collapse: collapse; }
        .logs-view { display: flex; flex-direction: column; min-height: 0; flex: 1 1 auto; }
        #usage-modal-content th, #usage-modal-content td { border-bottom: 1px solid var(--color-border); padding: 12px 8px; text-align: left; vertical-align: top; }
        #usage-modal-content th { font-weight: 600; position: sticky; top: 0; background-color: var(--color-surface); }
        #usage-modal-content td { font-size: 14px; }
        .model-slug { background-color: rgba(255, 255, 255, 0.08); color: var(--color-text); padding: 4px 8px; border-radius: 12px; font-family: monospace; font-size: 0.9em; white-space: nowrap; border: 1px solid var(--color-chip-border); box-shadow: 0 0 0 1px rgba(255,255,255,0.06) inset; }
        .prompt-cell { white-space: pre-wrap; word-break: break-word; max-width: 450px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .conv-cell { font-family: monospace; font-size: 12px; color: var(--color-muted); max-width: 200px; word-break: break-all; }
        .conv-link { color: var(--color-muted); text-decoration: underline dotted; text-underline-offset: 2px; cursor: pointer; }
        .conv-link:hover, .conv-link:focus-visible { text-decoration: underline; color: var(--color-text); }
        .conv-link:focus-visible { outline: none; }
        #usage-modal-content tbody tr:hover { background-color: rgba(255, 255, 255, 0.03); }
        #usage-modal-content, #usage-modal-content .table-container, #usage-modal-content .dropdown-menu { scrollbar-width: thin; scrollbar-color: rgba(255, 255, 255, 0.25) transparent; }
        #usage-modal-content::-webkit-scrollbar, #usage-modal-content .table-container::-webkit-scrollbar, #usage-modal-content .dropdown-menu::-webkit-scrollbar { width: 10px; height: 10px; }
        #usage-modal-content::-webkit-scrollbar-track, #usage-modal-content .table-container::-webkit-scrollbar-track, #usage-modal-content .dropdown-menu::-webkit-scrollbar-track { background: transparent; }
        #usage-modal-content::-webkit-scrollbar-thumb, #usage-modal-content .table-container::-webkit-scrollbar-thumb, #usage-modal-content .dropdown-menu::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25); border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
        #usage-modal-content::-webkit-scrollbar-thumb:hover, #usage-modal-content .table-container::-webkit-scrollbar-thumb:hover, #usage-modal-content .dropdown-menu::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.35); }
        .settings-panel { margin: 8px 0 0 0; padding: 16px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-bg); display: flex; flex-direction: column; gap: 12px; }
        .settings-row { display: flex; gap: 12px; align-items: center; margin: 0; flex-wrap: wrap; }
        .settings-row label { display: flex; gap: 6px; align-items: center; color: var(--color-text); }
        .settings-panel input[type="number"] { background: var(--color-input-bg); color: var(--color-text); border: 1px solid var(--color-input-border); border-radius: 8px; padding: 6px 8px; }
        .settings-panel input[type="number"]:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-focus-ring); }
        .settings-panel input[type="checkbox"] { accent-color: var(--color-primary); }
      `);
  }

  class UiManager {
    constructor(settings, logs) {
      this.settings = settings;
      this.logs = logs;
    }
    async showModal() {
      const existingModal = document.getElementById("usage-modal-container");
      if (existingModal) existingModal.remove();
      const logs = await this.logs.getAll();
      const container = document.createElement("div");
      container.id = "usage-modal-container";
      const modal = document.createElement("div");
      modal.id = "usage-modal-content";
      const header = document.createElement("div");
      header.className = "modal-header";
      const title = document.createElement("h2");
      title.textContent = "ChatGPT Usage Logs";
      const clearButton = document.createElement("button");
      clearButton.className = "modal-button clear";
      clearButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4h6a1 1 0 011 1v1h4a1 1 0 110 2h-1.08l-1.3 11.05A2 2 0 0115.63 21H8.37a2 2 0 01-1.99-1.95L5.08 8H4a1 1 0 110-2h4V5a1 1 0 011-1zm2 0v1h2V4h-2zM7.1 8l1.2 10h7.4l1.2-10H7.1z"/>
        </svg>
        Clear All Logs`;
      clearButton.onclick = async () => {
        if (
          confirm(
            "Are you sure you want to delete all usage logs? This cannot be undone."
          )
        ) {
          await this.logs.clearAndRefreshUI();
          container.remove();
          await this.showModal();
        }
      };
      const exportWrap = document.createElement("div");
      exportWrap.className = "dropdown";
      const exportBtn = document.createElement("button");
      exportBtn.className = "modal-button";
      exportBtn.innerHTML = `
        <span>Export</span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.126l3.71-3.896a.75.75 0 011.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
        </svg>
      `;
      const exportMenu = document.createElement("div");
      exportMenu.className = "dropdown-menu";
      const exportJsonItem = document.createElement("button");
      exportJsonItem.className = "dropdown-item";
      exportJsonItem.textContent = "JSON";
      exportJsonItem.onclick = async () => this.exportLogs("json");
      const exportCsvItem = document.createElement("button");
      exportCsvItem.className = "dropdown-item";
      exportCsvItem.textContent = "CSV";
      exportCsvItem.onclick = async () => this.exportLogs("csv");
      exportMenu.appendChild(exportJsonItem);
      exportMenu.appendChild(exportCsvItem);
      exportWrap.appendChild(exportBtn);
      exportWrap.appendChild(exportMenu);
      let onExportDocClick = null;
      exportBtn.onclick = (e) => {
        e.stopPropagation();
        const isOpen = exportMenu.classList.toggle("open");
        if (isOpen) {
          onExportDocClick = (evt) => {
            if (!exportWrap.contains(evt.target)) {
              exportMenu.classList.remove("open");
              document.removeEventListener("click", onExportDocClick, true);
              onExportDocClick = null;
            }
          };
          setTimeout(
            () => document.addEventListener("click", onExportDocClick, true),
            0
          );
        } else if (onExportDocClick) {
          document.removeEventListener("click", onExportDocClick, true);
          onExportDocClick = null;
        }
      };
      const settingsBtn = document.createElement("button");
      settingsBtn.textContent = "Settings";
      settingsBtn.className = "modal-button";
      settingsBtn.id = "usage-settings-btn";
      settingsBtn.onclick = () => this.toggleSettingsPanel();
      const closeButton = document.createElement("button");
      closeButton.innerHTML = "&times;";
      closeButton.className = "modal-button close";
      closeButton.onclick = () => container.remove();
      header.appendChild(title);
      const actions = document.createElement("div");
      actions.className = "modal-actions";
      actions.appendChild(clearButton);
      actions.appendChild(exportWrap);
      actions.appendChild(settingsBtn);
      actions.appendChild(closeButton);
      header.appendChild(actions);
      const controls = document.createElement("div");
      controls.className = "table-controls";
      const modelSelect = document.createElement("select");
      modelSelect.className = "modal-select model-filter";
      const models = Array.from(
        new Set(logs.map((l) => l.model).filter(Boolean))
      );
      const allOpt = document.createElement("option");
      allOpt.value = "";
      allOpt.textContent = "All models";
      modelSelect.appendChild(allOpt);
      models.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        modelSelect.appendChild(opt);
      });
      const searchInput = document.createElement("input");
      searchInput.type = "search";
      searchInput.placeholder = "Search prompt...";
      searchInput.className = "modal-input";
      controls.appendChild(modelSelect);
      controls.appendChild(searchInput);
      const summary = document.createElement("div");
      summary.className = "summary";
      summary.innerHTML = `
        <div class="tabs summary-tabs" role="tablist">
          <button class="tab active" data-range="hour" role="tab">Last hour</button>
          <button class="tab" data-range="today" role="tab">Today</button>
          <button class="tab" data-range="week" role="tab">This week</button>
          <button class="tab" data-range="month" role="tab">This month</button>
          <button class="tab" data-range="all" role="tab">All time</button>
        </div>
        <div class="summary-content">
          <div class="cards">
            <div class="card"><div class="label">Prompts</div><div class="value" id="sum-prompts">0</div></div>
            <div class="card"><div class="label">Avg first token (ms)</div><div class="value" id="sum-first">-</div></div>
            <div class="card"><div class="label">Avg total (s)</div><div class="value" id="sum-total">-</div></div>
          </div>
          <div class="sparkline"><canvas id="sum-sparkline"></canvas></div>
          <div class="model-cards" id="sum-model-cards"></div>
        </div>
      `;
      const tabContainer = summary.querySelector(".summary-tabs");
      const promptsEl = summary.querySelector("#sum-prompts");
      const avgFirstEl = summary.querySelector("#sum-first");
      const avgTotalEl = summary.querySelector("#sum-total");
      const modelCards = summary.querySelector("#sum-model-cards");
      const sparkCanvas = summary.querySelector("#sum-sparkline");
      const drawSparkline = (rows) => {
        if (!sparkCanvas) return;
        const dpr = Math.max(1, Math.floor(unsafeWindow.devicePixelRatio || 1));
        const cssHeight = 60;
        const cssWidth = sparkCanvas.clientWidth || 600;
        const w = Math.max(150, cssWidth);
        const h = cssHeight;
        if (sparkCanvas.width !== w * dpr) sparkCanvas.width = w * dpr;
        if (sparkCanvas.height !== h * dpr) sparkCanvas.height = h * dpr;
        const ctx = sparkCanvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        // Baseline
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, h - 12);
        ctx.lineTo(w, h - 12);
        ctx.stroke();
        const times = rows
          .map((l) => Date.parse(l.timestamp))
          .filter((t) => !isNaN(t))
          .sort((a, b) => a - b);
        if (times.length === 0) return;
        const minT = times[0];
        const maxT =
          times[times.length - 1] === minT ? minT + 1 : times[times.length - 1];
        const bins = Math.min(60, Math.max(10, Math.round(w / 12)));
        const counts = new Array(bins).fill(0);
        const span = maxT - minT;
        for (const t of times) {
          const r = (t - minT) / span;
          let idx = Math.floor(r * bins);
          if (idx >= bins) idx = bins - 1;
          if (idx < 0) idx = 0;
          counts[idx] += 1;
        }
        const maxC = counts.reduce((m, v) => (v > m ? v : m), 0) || 1;
        const padX = 6;
        const padY = 12;
        const innerW = w - padX * 2;
        const innerH = h - padY * 2;
        ctx.strokeStyle = "#e6e6e7";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < bins; i++) {
          const x =
            padX + (bins === 1 ? innerW / 2 : (innerW * i) / (bins - 1));
          const y = padY + (1 - counts[i] / maxC) * innerH;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      const tableContainer = document.createElement("div");
      tableContainer.className = "table-container";
      const table = document.createElement("table");
      table.innerHTML = `
              <thead>
                  <tr>
                      <th>Timestamp</th>
                      <th>Model Used</th>
                      <th>First Token (ms)</th>
                      <th>Total (s)</th>
                      <th>Conversation</th>
                      <th>Prompt</th>
                  </tr>
              </thead>
          `;
      const tbody = document.createElement("tbody");
      const getFilteredLogs = () => {
        const q = (searchInput.value || "").toLowerCase();
        const mf = modelSelect.value || "";
        return logs
          .slice()
          .reverse()
          .filter((log) => (mf ? log.model === mf : true))
          .filter((log) =>
            q ? (log.prompt || "").toLowerCase().includes(q) : true
          );
      };
      const startOfToday = () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
      };
      const startOfWeekMonday = () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        const day = (d.getDay() + 6) % 7;
        d.setDate(d.getDate() - day);
        return d;
      };
      const startOfMonth = () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(1);
        return d;
      };
      const startOfHour = () => {
        const d = new Date();
        d.setMinutes(0, 0, 0);
        return d;
      };
      const summarizeLogs = (rows) => {
        if (!rows.length) {
          return { count: 0, avgFirstMs: null, avgTotalSec: null, byModel: {} };
        }
        let count = 0;
        let sumFirst = 0;
        let sumTotalSec = 0;
        const byModel = {};
        for (const log of rows) {
          count++;
          const first =
            typeof log.durations?.msToFirstToken === "number"
              ? log.durations.msToFirstToken
              : null;
          const totalSec =
            typeof log.durations?.msTotal === "number"
              ? log.durations.msTotal / 1000
              : null;
          if (first != null) sumFirst += first;
          if (totalSec != null) sumTotalSec += totalSec;
          const m = log.model || "(unknown)";
          const mStat = byModel[m] || {
            count: 0,
            sumFirst: 0,
            sumTotalSec: 0,
            haveFirst: 0,
            haveTotal: 0,
          };
          mStat.count++;
          if (first != null) {
            mStat.sumFirst += first;
            mStat.haveFirst++;
          }
          if (totalSec != null) {
            mStat.sumTotalSec += totalSec;
            mStat.haveTotal++;
          }
          byModel[m] = mStat;
        }
        const avgFirstMs = count ? Math.round(sumFirst / count) : null;
        const avgTotalSec = count
          ? Number((sumTotalSec / count).toFixed(2))
          : null;
        return { count, avgFirstMs, avgTotalSec, byModel };
      };
      const filterByRange = (rows, range) => {
        if (range === "all") return rows;
        const now = Date.now();
        let t0;
        if (range === "hour") t0 = +startOfHour();
        else if (range === "today") t0 = +startOfToday();
        else if (range === "week") t0 = +startOfWeekMonday();
        else if (range === "month") t0 = +startOfMonth();
        else return rows;
        return rows.filter((log) => {
          const t = Date.parse(log.timestamp);
          return !isNaN(t) && t >= t0 && t <= now;
        });
      };
      let activeRange = "hour";
      const renderSummary = () => {
        const rows = logs.slice().reverse();
        const inRange = filterByRange(rows, activeRange);
        const stats = summarizeLogs(inRange);
        promptsEl.textContent = String(stats.count);
        avgFirstEl.textContent =
          stats.avgFirstMs == null ? "-" : String(stats.avgFirstMs);
        avgTotalEl.textContent =
          stats.avgTotalSec == null ? "-" : String(stats.avgTotalSec);
        modelCards.innerHTML = "";
        const allModelKeys = Array.from(
          new Set(rows.map((l) => l.model || "(unknown)").filter(Boolean))
        );
        const entries = allModelKeys.map((model) => {
          const m = stats.byModel[model] || {
            count: 0,
            sumFirst: 0,
            sumTotalSec: 0,
            haveFirst: 0,
            haveTotal: 0,
          };
          return [model, m];
        });
        drawSparkline(inRange);
        if (!entries.length) {
          const empty = document.createElement("div");
          empty.className = "card";
          empty.textContent = "No data";
          modelCards.appendChild(empty);
          return;
        }
        for (const [model, m] of entries) {
          const avgF = m.haveFirst ? Math.round(m.sumFirst / m.haveFirst) : "-";
          const avgT = m.haveTotal
            ? (m.sumTotalSec / m.haveTotal).toFixed(2)
            : "-";
          const card = document.createElement("div");
          card.className = "card model-card";
          card.innerHTML = `
            <div class="model-title"><span class="model-slug">${model}</span></div>
            <div class="model-metrics">
              <div><span class="label">Prompts</span><div class="value">${m.count}</div></div>
              <div><span class="label">Avg first (ms)</span><div class="value">${avgF}</div></div>
              <div><span class="label">Avg total (s)</span><div class="value">${avgT}</div></div>
            </div>
          `;
          modelCards.appendChild(card);
        }
      };
      const renderRows = () => {
        tbody.innerHTML = "";
        const rows = getFilteredLogs();
        if (rows.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6">No matching logs.</td></tr>';
          renderSummary();
          return;
        }
        renderSummary();
        rows.forEach((log) => {
          const tr = document.createElement("tr");
          const formattedDate = new Date(log.timestamp).toLocaleString();
          const firstMs = log.durations?.msToFirstToken ?? "-";
          const totalSec =
            typeof log.durations?.msTotal === "number"
              ? (log.durations.msTotal / 1000).toFixed(2)
              : "-";
          const conv = log.conversationId || "-";
          const convCell =
            conv !== "-"
              ? `<a href="https://chatgpt.com/c/${conv}" target="_blank" rel="noopener" class="conv-link">${conv}</a>`
              : "-";
          tr.innerHTML = `
                      <td>${formattedDate}</td>
                      <td><span class="model-slug">${
                        log.model ?? "-"
                      }</span></td>
                      <td>${firstMs}</td>
                      <td>${totalSec}</td>
                      <td class="conv-cell">${convCell}</td>
                      <td class="prompt-cell">${log.prompt || ""}</td>
                  `;
          tbody.appendChild(tr);
        });
      };
      if (logs.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="6">No usage data recorded yet. Start a new chat to begin tracking.</td></tr>';
        renderSummary();
      } else {
        renderRows();
      }
      table.appendChild(tbody);
      tableContainer.appendChild(table);
      controls.oninput = renderRows;
      modelSelect.onchange = renderRows;
      searchInput.oninput = renderRows;
      tabContainer.onclick = (e) => {
        const btn = e.target.closest(".tab");
        if (!btn) return;
        tabContainer
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        activeRange = btn.getAttribute("data-range");
        renderRows();
      };
      const viewTabs = document.createElement("div");
      viewTabs.className = "tabs view-tabs";
      viewTabs.innerHTML = `
        <button class="tab active" data-view="summary">Summary</button>
        <button class="tab" data-view="logs">All logs</button>
      `;
      const logsView = document.createElement("div");
      logsView.className = "logs-view";
      logsView.appendChild(controls);
      logsView.appendChild(tableContainer);
      logsView.style.display = "none";
      viewTabs.onclick = (e) => {
        const btn = e.target.closest(".tab");
        if (!btn) return;
        viewTabs
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        const view = btn.getAttribute("data-view");
        if (view === "summary") {
          summary.style.display = "";
          logsView.style.display = "none";
          renderSummary();
        } else {
          summary.style.display = "none";
          logsView.style.display = "";
          renderRows();
        }
      };
      modal.appendChild(header);
      modal.appendChild(viewTabs);
      modal.appendChild(summary);
      modal.appendChild(logsView);
      container.appendChild(modal);
      container.onclick = (e) => {
        if (e.target === container) container.remove();
      };
      document.body.appendChild(container);
    }
    async toggleSettingsPanel() {
      let panel = document.getElementById("usage-settings-panel");
      if (panel) {
        const btn = document.getElementById("usage-settings-btn");
        if (btn) btn.classList.remove("active");
        panel.remove();
        return;
      }
      const modal = document.getElementById("usage-modal-content");
      if (!modal) return;
      const s = await this.settings.get();
      panel = document.createElement("div");
      panel.id = "usage-settings-panel";
      panel.className = "settings-panel";
      panel.innerHTML = `
        <div class="settings-row">
          <label><input type="checkbox" id="set-truncate"> Truncate prompts</label>
          <input type="number" id="set-truncate-len" min="10" max="5000" class="input-w-80" />
        </div>
        <div class="settings-row">
          <label><input type="checkbox" id="set-anon"> Anonymize prompts</label>
        </div>
        <div class="settings-row">
          <label>Retention days <input type="number" id="set-days" min="1" max="365" class="input-w-80" /></label>
          <label>Max logs <input type="number" id="set-count" min="10" max="100000" class="input-w-100" /></label>
          <button class="modal-button" id="set-save">Save</button>
        </div>
      `;
      modal.insertBefore(panel, modal.children[1]);
      panel.querySelector("#set-truncate").checked = !!s.truncatePrompt;
      panel.querySelector("#set-truncate-len").value = s.truncatePromptLen;
      panel.querySelector("#set-anon").checked = !!s.anonymizePrompt;
      panel.querySelector("#set-days").value = s.retention?.maxDays ?? "";
      panel.querySelector("#set-count").value = s.retention?.maxCount ?? "";
      panel.querySelector("#set-save").onclick = async () => {
        const next = {
          truncatePrompt: panel.querySelector("#set-truncate").checked,
          truncatePromptLen:
            parseInt(panel.querySelector("#set-truncate-len").value, 10) ||
            Config.DEFAULT_SETTINGS.truncatePromptLen,
          anonymizePrompt: panel.querySelector("#set-anon").checked,
          retention: {
            maxDays: (() => {
              const v = panel.querySelector("#set-days").value;
              const n = Number(v);
              return !v || isNaN(n) || n <= 0 ? null : n;
            })(),
            maxCount: (() => {
              const v = panel.querySelector("#set-count").value;
              const n = Number(v);
              return !v || isNaN(n) || n <= 0 ? null : n;
            })(),
          },
        };
        await this.settings.set(next);
        alert("Settings saved. New logs will use updated settings.");
      };
      const btn = document.getElementById("usage-settings-btn");
      if (btn) btn.classList.add("active");
    }
    async exportLogs(kind) {
      const logs = await this.logs.getAll();
      if (kind === "json") {
        const blob = new Blob([JSON.stringify(logs, null, 2)], {
          type: "application/json",
        });
        downloadBlob(
          blob,
          `chatgpt-usage-logs-${new Date().toISOString()}.json`
        );
      } else if (kind === "csv") {
        const header = [
          "timestamp",
          "model",
          "msToFirstToken",
          "totalSeconds",
          "conversationId",
          "prompt",
        ];
        const rows = logs.map((l) =>
          [
            l.timestamp,
            safeStr(l.model),
            l.durations?.msToFirstToken ?? "",
            typeof l.durations?.msTotal === "number"
              ? (l.durations.msTotal / 1000).toFixed(2)
              : "",
            safeStr(l.conversationId),
            safeStr(l.prompt),
          ]
            .map(csvEscape)
            .join(",")
        );
        const csv = header.join(",") + "\n" + rows.join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        downloadBlob(
          blob,
          `chatgpt-usage-logs-${new Date().toISOString()}.csv`
        );
      }
    }
  }

  function createHeaderButton(ui) {
    const btn = document.createElement("button");
    btn.id = Config.HEADER_BUTTON_ID;
    btn.type = "button";
    btn.setAttribute("aria-label", "View usage logs");
    btn.className = "btn relative btn-ghost text-token-text-primary mx-2";
    btn.innerHTML = `
      <div class="flex w-full items-center justify-center gap-1.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="-ms-0.5 icon">
          <path d="M3 4.75C3 4.33579 3.33579 4 3.75 4H16.25C16.6642 4 17 4.33579 17 4.75C17 5.16421 16.6642 5.5 16.25 5.5H3.75C3.33579 5.5 3 5.16421 3 4.75Z"></path>
          <path d="M3 10C3 9.58579 3.33579 9.25 3.75 9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.4142 16.6642 10.75 16.25 10.75H3.75C3.33579 10.75 3 10.4142 3 10Z"></path>
          <path d="M3.75 14.5C3.33579 14.5 3 14.8358 3 15.25C3 15.6642 3.33579 16 3.75 16H12.25C12.6642 16 13 15.6642 13 15.25C13 14.8358 12.6642 14.5 12.25 14.5H3.75Z"></path>
        </svg>
        Usage Logs
      </div>`;
    btn.onclick = () => ui.showModal();
    return btn;
  }
  function injectHeaderButton(ui) {
    const actionsContainer = document.getElementById(
      "conversation-header-actions"
    );
    if (!actionsContainer) return false;
    if (document.getElementById(Config.HEADER_BUTTON_ID)) return true;
    const btn = createHeaderButton(ui);
    if (actionsContainer.firstChild) {
      actionsContainer.insertBefore(btn, actionsContainer.firstChild);
    } else {
      actionsContainer.appendChild(btn);
    }
    return true;
  }
  function observeHeader(ui) {
    injectHeaderButton(ui);
    const root = document.body || document.documentElement;
    if (!root) return;
    let lastInject = 0;
    const observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastInject < 300) return;
      lastInject = now;
      injectHeaderButton(ui);
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  class App {
    constructor() {
      this.settings = new SettingsService();
      this.logs = new LogsService(this.settings);
      this.ui = new UiManager(this.settings, this.logs);
      this.streamProcessor = new StreamProcessor(this.settings, this.logs);
      this.fetchInterceptor = new FetchInterceptor(this.streamProcessor);
    }
    bootstrap() {
      this.fetchInterceptor.install();
      injectStyles();
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          observeHeader(this.ui)
        );
      } else {
        observeHeader(this.ui);
      }
      GM_registerMenuCommand("View Usage Logs", () => this.ui.showModal());
    }
  }

  const app = new App();
  app.bootstrap();
})();

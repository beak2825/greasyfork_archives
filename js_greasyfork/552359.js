// ==UserScript==
// @name         Word Status
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Per-deck target/sentence word status with CSV export Copy buttons.
// @author       Foxzea
// @match        https://study.migaku.com/*
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.21/vue.global.min.js
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/552359/Word%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/552359/Word%20Status.meta.js
// ==/UserScript==

/* global pako, initSqlJs, Vue */

(function () {
  "use strict";

  // ---------- Config / constants ----------
  const DEBUG = true;
  const log = (...a) => DEBUG && console.log("[WordStatus]", ...a);

  const DB_CONFIG = {
    DB_NAME: "srs",
    OBJECT_STORE: "data",
    SQL_CDN_PATH: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/",
  };

  const WORD_STATUS = {
    KNOWN: "KNOWN",
    LEARNING: "LEARNING",
    UNKNOWN: "UNKNOWN",
    IGNORED: "IGNORED",
  };

  const ALL_DECK_ID = "all";

  // scope: 0=Target only, 1=Target + Sentence, 2=Sentence only
  const SCOPE = {
    TARGET_ONLY: 0,
    BOTH: 1,
    SENTENCE_ONLY: 2,
  };

  const ScopeLabels = {
    [SCOPE.TARGET_ONLY]: "Target Word",
    [SCOPE.BOTH]: "Target Word + Sentence Words",
    [SCOPE.SENTENCE_ONLY]: "Sentence Words",
  };

  // ---------- Styles ----------
  GM_addStyle(`
    .UiPageLayout { max-width: 1200px !important; }
    #ws-vue-container { grid-column: 1 / -1 !important; }
    #WS-container { margin: 24px 0; }
    #WS-container .Statistic__card { max-width: 100% !important; width: 100% !important; box-sizing: border-box; padding-bottom: 24px !important; }
    .WS__card { width: 100% !important; box-sizing: border-box; padding: 24px !important; }

    .WS__controls { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin: 6px 0 12px; }
    .WS__search { flex: 1; min-width: 220px; }
    .WS__search .UiInput { width: 100%; }

    .WS__exportFlags { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin: 4px 0 6px; }
    .WS__flag { display: inline-flex; align-items: center; gap: 8px; }
    .WS__summary { margin-top: 6px; opacity: 0.85; }

    .WS__statusGrid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px; margin-top: 16px; width: 100%;
    }
    @media (max-width: 1200px) { .WS__statusGrid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 700px)  { .WS__statusGrid { grid-template-columns: 1fr; } }

    .WS__column h4 { margin: 0 0 8px; display:flex; justify-content:space-between; align-items:center; gap:8px; }
    .WS__wordGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 8px; padding: 10px; max-height: 600px; overflow-y: auto;
      box-sizing: border-box; width: 100%; background-color: rgba(0,0,0,0.08); border-radius: 8px;
    }
    .WS__word { padding: 8px; font-size: 0.95rem; border-radius: 8px; text-align: center;
                user-select: text; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
    .WS__word.-known    { background-color: #00c7a4; color: #002222; }
    .WS__word.-learning { background-color: #ff9345; color: #2b1400; }
    .WS__word.-ignored  { background-color: #888888; color: #ffffff; }
    .WS__word.-unknown  { background-color: #fe4670; color: #ffffff; }

    #WS-container .Statistic__card__header { display: flex; justify-content: center; }

    .WS__btn {
      padding: 10px 14px; border-radius: 9999px; border: 2px solid #00c7a4; background: transparent; color: #00c7a4;
      cursor: pointer; font-weight: 600; transition: transform .02s ease, background .15s ease;
    }
    .WS__btn:hover { background: rgba(0,199,164,0.12); }
    .WS__btn:active { transform: translateY(1px); }

    .WS__btn.-sm { padding: 4px 10px; border-width: 1.5px; font-size: 12px; }
  `);

  // ---------- Migaku-style Dropdown ----------
  const DropdownMenu = {
    props: {
      items: { type: Array, required: true },
      modelValue: { type: [String, Number, Object], default: null },
      itemKey: { type: String, default: "id" },
      itemLabel: { type: [String, Function], default: "label" },
      placeholder: { type: String, default: "Select an option" },
      width: { type: Number, default: 250 },
      componentHash: String,
    },
    emits: ["update:modelValue"],
    data() { return { isDropdownOpen: false }; },
    computed: {
      selectedItemLabel() {
        const sel = this.items.find(it => this.getItemKey(it) === this.modelValue);
        return sel ? this.getItemLabel(sel) : this.placeholder;
      },
    },
    methods: {
      toggleDropdown(e){ e.stopPropagation(); this.isDropdownOpen = !this.isDropdownOpen; },
      selectItem(item,e){ e.stopPropagation(); const k=this.getItemKey(item);
        if (this.modelValue !== k) this.$emit("update:modelValue", k);
        this.isDropdownOpen = false;
      },
      closeDropdown(){ this.isDropdownOpen = false; },
      getItemKey(it){ return it[this.itemKey]; },
      getItemLabel(it){ return typeof this.itemLabel==="function" ? this.itemLabel(it) : it[this.itemLabel]; },
    },
    mounted(){ document.addEventListener("click", this.closeDropdown); },
    beforeUnmount(){ document.removeEventListener("click", this.closeDropdown); },
    template: `
      <div v-bind:[componentHash]="true" tabindex="0"
           class="multiselect multiselect--right"
           :class="{ '-has-value': modelValue !== null, 'multiselect--active': isDropdownOpen }"
           role="combobox" :style="{ width: width + 'px' }" @click="toggleDropdown">
        <div class="UiIcon multiselect__caret" style="width: 24px;">
          <div class="UiIcon__inner">
            <div class="UiSvg UiIcon__svg" name="ChevronDownSmall"><div class="UiSvg__inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="img">
                <path fill="currentColor" fill-rule="evenodd" d="M7.116 10.116a1.25 1.25 0 0 1 1.768 0L12 13.232l3.116-3.116a1.25 1.25 0 0 1 1.768 1.768l-4 4a1.25 1.25 0 0 1-1.768 0l-4-4a1.25 1.25 0 0 1 0-1.768" clip-rule="evenodd"></path>
              </svg>
            </div></div>
          </div>
        </div>
        <div class="multiselect__tags">
          <slot name="trigger" :selectedLabel="selectedItemLabel">
            <span class="multiselect__single">
              <span class="UiTypo UiTypo__caption -no-wrap multiselect__single__text">{{ selectedItemLabel }}</span>
            </span>
          </slot>
        </div>
        <div class="multiselect__content-wrapper" tabindex="-1" style="max-height: 300px;" :style="{display: isDropdownOpen ? 'block' : 'none'}">
          <ul class="multiselect__content" role="listbox" style="display: inline-block;">
            <li class="multiselect__element" role="option" v-for="item in items" :key="getItemKey(item)">
              <span class="multiselect__option"
                    :class="{ 'multiselect__option--highlight multiselect__option--selected': getItemKey(item) === modelValue }"
                    @click="selectItem(item, $event)">
                <div class="multiselect__optionWrapper" :style="{ width: width - 40 + 'px' }" >
                  <span class="UiTypo UiTypo__caption"
                        :class="{ '-emphasis': getItemKey(item) === modelValue }"
                        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ getItemLabel(item) }}
                  </span>
                  <div class="UiIcon multiselect__checkIcon" style="width: 24px;">
                    <div v-if="getItemKey(item) === modelValue" class="UiIcon__inner">
                      <div class="UiSvg UiIcon__svg" name="Check" gradient="true">
                        <div class="UiSvg__inner UiIcon__gradient">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="img"></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>
    `,
  };

  // ---------- SQL helpers ----------
  const dbState = { migakuDB: null };

  function initIDB() {
    return new Promise((resolve, reject) => {
      if (dbState.migakuDB) return resolve(dbState.migakuDB);
      const request = indexedDB.open(DB_CONFIG.DB_NAME);
      request.onerror = e => reject(new Error(`IndexedDB open error: ${e.target.errorCode}`));
      request.onsuccess = e => { dbState.migakuDB = e.target.result; resolve(dbState.migakuDB); };
    });
  }

  async function readCompressedSqliteBlob() {
    const idb = await initIDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction([DB_CONFIG.OBJECT_STORE], "readonly");
      const store = tx.objectStore(DB_CONFIG.OBJECT_STORE);
      const req = store.getAll();
      req.onerror = e => reject(e.target.error);
      req.onsuccess = e => {
        const rows = e.target.result || [];
        const data = rows.length && rows[0].data instanceof Uint8Array ? rows[0].data : null;
        resolve(data);
      };
    });
  }

  async function openSqlite() {
    const gz = await readCompressedSqliteBlob();
    if (!gz) { log("No SQLite blob found in IndexedDB."); return null; }
    let bytes;
    try { bytes = pako.inflate(gz); }
    catch (e) { log("Decompression failed:", e); return null; }
    const SQL = await initSqlJs({ locateFile: f => `${DB_CONFIG.SQL_CDN_PATH}${f}` });
    return new SQL.Database(bytes);
  }

  function execToObjects(result) {
    if (!result || !result.length) return [];
    const { columns, values } = result[0];
    return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
  }

  async function waitForElement(selector, timeout = 15000) {
    return new Promise((resolve) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) { obs.disconnect(); resolve(found); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); resolve(null); }, timeout);
    });
  }

  // ---------- SQL builders ----------
  function buildWordsQuery({ language, deckId, scope }) {
    const params = [language];
    const where = [
      "w.language = ?",
      "w.del = 0",
      "c.del = 0",
      "d.del = 0",
      "cwr.del = 0",
    ];

    if (scope === SCOPE.TARGET_ONLY) {
      where.push("cwr.isTargetWord = 1");
    } else if (scope === SCOPE.SENTENCE_ONLY) {
      where.push("cwr.isTargetWord = 0");
    }

    if (deckId && deckId !== ALL_DECK_ID) {
      where.push("d.id = ?");
      params.push(deckId);
    }

    const sql = `
      SELECT DISTINCT
        d.id   AS deckId,
        d.name AS deckName,
        w.dictForm,
        w.knownStatus
      FROM WordList w
      JOIN CardWordRelation cwr
        ON w.dictForm = cwr.dictForm AND w.language = cwr.language
      JOIN card c
        ON cwr.cardId = c.id
      JOIN deck d
        ON c.deckId = d.id
      WHERE ${where.join(" AND ")}
      ORDER BY w.dictForm ASC;
    `;
    return { sql, params };
  }

  // ---------- Vue App ----------
  const App = {
    components: { DropdownMenu },
    data() {
      return {
        loading: true,
        error: "",
        language: "ja",
        decks: [{ id: ALL_DECK_ID, name: "All Decks" }],
        selectedDeckId: ALL_DECK_ID,
        scope: SCOPE.TARGET_ONLY,
        search: "",
        known: [],
        learning: [],
        unknown: [],
        ignored: [],
        exportFlags: { known: true, learning: true, ignored: false, unknown: false },
        _langObs: null,
        _reloadDebounce: null,
      };
    },
    computed: {
      selectedDeckName() {
        const d = this.decks.find(x => String(x.id) === String(this.selectedDeckId));
        return d ? d.name : "";
      },
      fKnown()    { return this.filterBySearch(this.known); },
      fLearning() { return this.filterBySearch(this.learning); },
      fUnknown()  { return this.filterBySearch(this.unknown); },
      fIgnored()  { return this.filterBySearch(this.ignored); },
      summaryText() {
        const total = this.fKnown.length + this.fLearning.length + this.fUnknown.length + this.fIgnored.length;
        return `${total.toLocaleString()} • ${this.selectedDeckName} • ${ScopeLabels[this.scope]}`;
      },
      scopeItems() {
        return [
          { id: SCOPE.TARGET_ONLY,  label: ScopeLabels[SCOPE.TARGET_ONLY] },
          { id: SCOPE.BOTH,         label: ScopeLabels[SCOPE.BOTH] },
          { id: SCOPE.SENTENCE_ONLY,label: ScopeLabels[SCOPE.SENTENCE_ONLY] },
        ];
      },
    },
    watch: { scope() { this.reloadForCurrentSelection(); } },
    methods: {
      filterBySearch(list) {
        const q = (this.search || "").trim().toLowerCase();
        if (!q) return list;
        return list.filter(w => w.toLowerCase().includes(q));
      },
      async bootstrap() {
        this.loading = true; this.error = "";
        try {
          const main = document.querySelector(".MIGAKU-SRS[data-mgk-lang-selected]");
          if (main) this.language = main.getAttribute("data-mgk-lang-selected") || "ja";

          const db = await openSqlite();
          if (!db) throw new Error("Could not open embedded SQLite DB.");

          try {
            const decks = execToObjects(db.exec(
              `SELECT id, name FROM deck WHERE lang = ? AND del = 0 ORDER BY name;`,
              [this.language]
            ));
            this.decks = [{ id: ALL_DECK_ID, name: "All Decks" }, ...decks.map(d => ({ id: String(d.id), name: d.name }))];

            await this.loadWords(db);
          } finally {
            db.close();
          }

          this.observeLanguageChanges();
        } catch (e) {
          log("bootstrap error:", e);
          this.error = (e && e.message) ? e.message : String(e);
        } finally {
          this.loading = false;
        }
      },
      async loadWords(db) {
        this.known.length = 0; this.learning.length = 0; this.unknown.length = 0; this.ignored.length = 0;

        const { sql, params } = buildWordsQuery({
          language: this.language,
          deckId: this.selectedDeckId,
          scope: this.scope,
        });

        let rows = [];
        try { rows = execToObjects(db.exec(sql, params)); }
        catch (e) { log("SQL exec failed:", e); throw new Error("SQL execution failed. See console for details."); }

        const seen = new Map();
        const rank = { KNOWN: 3, LEARNING: 2, UNKNOWN: 1, IGNORED: 0 };

        for (const r of rows) {
          const df = r.dictForm;
          const st = r.knownStatus;
          if (!seen.has(df) || (rank[st] ?? -1) > (rank[seen.get(df)] ?? -1)) {
            seen.set(df, st);
          }
        }

        for (const [df, st] of seen.entries()) {
          if (st === WORD_STATUS.KNOWN) this.known.push(df);
          else if (st === WORD_STATUS.LEARNING) this.learning.push(df);
          else if (st === WORD_STATUS.UNKNOWN) this.unknown.push(df);
          else if (st === WORD_STATUS.IGNORED) this.ignored.push(df);
        }

        this.known.sort(); this.learning.sort(); this.unknown.sort(); this.ignored.sort();
      },
      async onDeckChanged(newId) {
        if (this.selectedDeckId === newId) return;
        this.selectedDeckId = newId;
        this.search = "";
        await this.reloadForCurrentSelection();
      },
      async onScopeChanged(newScope) {
        this.scope = Number(newScope);
      },
      async reloadForCurrentSelection() {
        clearTimeout(this._reloadDebounce);
        this._reloadDebounce = setTimeout(async () => {
          this.loading = true; this.error = "";
          try {
            const db = await openSqlite();
            if (!db) throw new Error("Could not open embedded SQLite DB.");
            try { await this.loadWords(db); }
            finally { db.close(); }
          } catch (e) {
            log("reload error:", e);
            this.error = (e && e.message) ? e.message : String(e);
          } finally {
            this.loading = false;
          }
        }, 50);
      },

      // ---------- COPY buttons ----------
      copyBucket(which) {
        const map = {
          known: this.fKnown,
          learning: this.fLearning,
          ignored: this.fIgnored,
          unknown: this.fUnknown,
        };
        const list = map[which] || [];

        const textPlain = list.join("\n");
        const html = '<div>' + list.map(this._escapeHtml).join('</div><div>') + '</div>';

        if (navigator.clipboard && window.ClipboardItem) {
          const blobHtml  = new Blob(['<meta charset="utf-8">' + html], { type: 'text/html' });
          const blobPlain = new Blob([textPlain], { type: 'text/plain' });
          const item = new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobPlain });
          navigator.clipboard.write([item]).catch(() => this._legacyCopyHtml(html, textPlain));
        } else {
          this._legacyCopyHtml(html, textPlain);
        }
      },
      copyPlain(text) {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(text).catch(() => this._legacyCopyPlain(text));
        } else {
          this._legacyCopyPlain(text);
        }
      },
      _legacyCopyHtml(html, plainFallback) {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        div.style.position = 'fixed';
        div.style.left = '-9999px';
        div.innerHTML = html;
        document.body.appendChild(div);

        const range = document.createRange();
        range.selectNodeContents(div);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        let ok = false;
        try { ok = document.execCommand('copy'); } catch(_) {}
        sel.removeAllRanges();
        document.body.removeChild(div);

        if (!ok) this._legacyCopyPlain(plainFallback);
      },
      _legacyCopyPlain(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
      },
      _escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({
          '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
        }[c]));
      },

      // ---------- CSV export ----------
      exportCsv() {
        const deckName = this.selectedDeckName || "All Decks";
        const scopeName = ScopeLabels[this.scope];
        const ORDER = ["KNOWN","LEARNING","IGNORED","UNKNOWN"];
        const flags = this.exportFlags;
        const include = {
          KNOWN: !!flags.known,
          LEARNING: !!flags.learning,
          IGNORED: !!flags.ignored,
          UNKNOWN: !!flags.unknown,
        };
        const cols = ORDER.filter(k => include[k]);
        if (cols.length === 0) cols.push(...ORDER); // redundanancy

        const buckets = {
          KNOWN:    this.fKnown,
          LEARNING: this.fLearning,
          IGNORED:  this.fIgnored,
          UNKNOWN:  this.fUnknown,
        };

        const safe = (s) => String(s ?? "").replace(/\r?\n/g, " ");
        const csvCell = (s) => {
          const v = safe(s);
          return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
        };

        const lines = [];
        lines.push(["Deck", deckName, "Field", scopeName].map(csvCell).join(","));
        lines.push(cols.map(c => csvCell(
          c === "KNOWN" ? "Known" :
          c === "LEARNING" ? "Learning" :
          c === "IGNORED" ? "Ignored" : "Unknown"
        )).join(","));

        const maxLen = Math.max(...cols.map(c => (buckets[c] || []).length), 0);
        for (let i = 0; i < maxLen; i++) {
          const row = cols.map(c => csvCell((buckets[c] && buckets[c][i]) || ""));
          lines.push(row.join(","));
        }

        const now = new Date();
        const parts = Object.fromEntries(
          new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).formatToParts(now).map(p => [p.type, p.value])
        );
        const timestamp = `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}`;
        const slug = deckName.replace(/[^A-Za-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
        const filename = `${slug || "Deck"}_${timestamp}.csv`;

        const blob = new Blob([lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
      },

      observeLanguageChanges() {
        if (this._langObs) { this._langObs.disconnect(); this._langObs = null; }
        const main = document.querySelector(".MIGAKU-SRS[data-mgk-lang-selected]");
        if (!main) return;
        let t = null;
        const obs = new MutationObserver(() => {
          clearTimeout(t);
          t = setTimeout(async () => {
            const newLang = main.getAttribute("data-mgk-lang-selected") || "ja";
            if (newLang !== this.language) {
              this.language = newLang;
              this.selectedDeckId = ALL_DECK_ID;
              await this.bootstrap();
            }
          }, 50);
        });
        obs.observe(main, { attributes: true, attributeFilter: ["data-mgk-lang-selected"] });
        this._langObs = obs;
      }
    },
    async mounted() {
      await this.bootstrap();
    },
    template: `
      <div id="WS-container">
        <div class="UiCard -lesson Statistic__card WS__card">
          <div class="Statistic__card__header">
            <h3 class="UiTypo UiTypo__heading3 -heading">Word Status</h3>
          </div>

          <div v-if="loading"><p class="UiTypo UiTypo__body2">Loading…</p></div>
          <div v-else-if="error"><p class="UiTypo UiTypo__body2">Error: {{ error }}</p></div>

          <template v-else>
            <div class="WS__controls">
              <dropdown-menu
                :items="decks"
                item-key="id"
                item-label="name"
                :modelValue="selectedDeckId"
                :width="260"
                @update:modelValue="onDeckChanged"
              />
              <dropdown-menu
                :items="scopeItems"
                item-key="id"
                item-label="label"
                :modelValue="scope"
                :width="260"
                @update:modelValue="onScopeChanged"
              />
              <div class="WS__search">
                <input class="UiInput" type="text" v-model.trim="search" placeholder="Filter words...">
              </div>
              <button class="WS__btn" @click="exportCsv" title="Export current view to CSV">Export CSV</button>
            </div>

            <div class="WS__exportFlags">
              <label class="WS__flag"><input type="checkbox" v-model="exportFlags.known"> <span>Known</span></label>
              <label class="WS__flag"><input type="checkbox" v-model="exportFlags.learning"> <span>Learning</span></label>
              <label class="WS__flag"><input type="checkbox" v-model="exportFlags.ignored"> <span>Ignored</span></label>
              <label class="WS__flag"><input type="checkbox" v-model="exportFlags.unknown"> <span>Unknown</span></label>
            </div>

            <div class="WS__summary UiTypo UiTypo__caption">{{ summaryText }}</div>

            <div class="WS__statusGrid">
              <div class="WS__column">
                <h4 class="UiTypo UiTypo__heading4 -heading">
                  <span>Known ({{ fKnown.length }})</span>
                  <button class="WS__btn -sm" @click="copyBucket('known')" title="Copy Known">Copy</button>
                </h4>
                <div class="WS__wordGrid">
                  <div v-for="w in fKnown" :key="'k-'+w" class="WS__word -known" :title="w">{{ w }}</div>
                </div>
              </div>

              <div class="WS__column">
                <h4 class="UiTypo UiTypo__heading4 -heading">
                  <span>Learning ({{ fLearning.length }})</span>
                  <button class="WS__btn -sm" @click="copyBucket('learning')" title="Copy Learning">Copy</button>
                </h4>
                <div class="WS__wordGrid">
                  <div v-for="w in fLearning" :key="'l-'+w" class="WS__word -learning" :title="w">{{ w }}</div>
                </div>
              </div>

              <!-- Ignored before Unknown so Unknown is far right -->
              <div class="WS__column">
                <h4 class="UiTypo UiTypo__heading4 -heading">
                  <span>Ignored ({{ fIgnored.length }})</span>
                  <button class="WS__btn -sm" @click="copyBucket('ignored')" title="Copy Ignored">Copy</button>
                </h4>
                <div class="WS__wordGrid">
                  <div v-for="w in fIgnored" :key="'i-'+w" class="WS__word -ignored" :title="w">{{ w }}</div>
                </div>
              </div>

              <div class="WS__column">
                <h4 class="UiTypo UiTypo__heading4 -heading">
                  <span>Unknown ({{ fUnknown.length }})</span>
                  <button class="WS__btn -sm" @click="copyBucket('unknown')" title="Copy Unknown">Copy</button>
                </h4>
                <div class="WS__wordGrid">
                  <div v-for="w in fUnknown" :key="'u-'+w" class="WS__word -unknown" :title="w">{{ w }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    `
  };

  // ---------- SPA-aware mount ----------
  let mounted = false;

  function isOnStatistic() {
    return location.pathname.replace(/\/+$/, "") === "/statistic";
  }

  function debounce(fn, ms = 80) {
    let t = 0;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  async function ensureMounted() {
    if (!isOnStatistic()) return teardown();
    const layout = document.querySelector(".UiPageLayout") || await waitForElement(".UiPageLayout");
    if (!layout) return;

    let container = document.getElementById("ws-vue-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "ws-vue-container";
      layout.insertBefore(container, layout.firstChild || null); 
    }

    if (!container.__ws_app) {
      const vue = (unsafeWindow && unsafeWindow.Vue) ? unsafeWindow.Vue : Vue;
      if (!vue) { log("Vue not available."); return; }
      const app = vue.createApp(App);
      app.component("dropdown-menu", DropdownMenu);
      app.mount(container);
      container.__ws_app = app;
      mounted = true;
      log("Vue app mounted (ensureMounted).");
    }
  }

  function teardown() {
    const container = document.getElementById("ws-vue-container");
    if (container?.__ws_app) {
      try { container.__ws_app.unmount(); } catch {}
      delete container.__ws_app;
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    mounted = false;
    log("Vue app unmounted (teardown).");
  }

  function installRouteObserver() {
    if (window.__ws_route_observer_installed) return;
    window.__ws_route_observer_installed = true;
    const fire = () => window.dispatchEvent(new Event("ws:locationchange"));
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) { const ret = origPush.apply(this, args); fire(); return ret; };
    history.replaceState = function (...args) { const ret = origReplace.apply(this, args); fire(); return ret; };
    window.addEventListener("popstate", fire);
    const onChange = debounce(() => {
      log("Route/DOM change detected:", location.href);
      if (isOnStatistic()) ensureMounted(); else teardown();
    }, 120);
    window.addEventListener("ws:locationchange", onChange);

    // Watch for page change
    const mo = new MutationObserver(onChange);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Kickoff
  installRouteObserver();
  ensureMounted();

})();

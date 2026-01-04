// ==UserScript==
// @name         Word Browser Export
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Wor export from the Word Browser
// @author       Foxzea
// @match        https://study.migaku.com/word-browser
// @run-at       document-idle
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557344/Word%20Browser%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/557344/Word%20Browser%20Export.meta.js
// ==/UserScript==

/* global pako, initSqlJs */

(function () {
  "use strict";

  const DB_CONFIG = {
    DB_NAME: "srs",
    OBJECT_STORE: "data",
    SQL_CDN_PATH: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/",
  };

  const WORD_STATUS = {
    KNOWN: "KNOWN",
    LEARNING: "LEARNING",
    IGNORED: "IGNORED",
  };

  const CARD_FILTER = {
    HAS_CARD: 'HAS_CARD',
    NO_CARD: 'NO_CARD',
    ANY: 'ANY'
  };

  GM_addStyle(`
    #WBE-export-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .WBE__btn {
      padding: 5px 12px;
      border-radius: 7px;
      border: 1px solid #000000ff;
      background: linear-gradient(
        180deg,
        color(display-p3 1 0.576 0.271) 1.5%,
        color(display-p3 0.996 0.275 0.439) 97.75%
      );
      color: #000000ef;
      cursor: pointer;
      font-weight: 500;
      font-size: 10px;
      transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
      box-shadow: 0 1px 2px rgba(255, 150, 33, 0.33);
      white-space: nowrap;
    }

    .WBE__btn:hover:not(:disabled) {
      transform: translateY(-0.5px);
      box-shadow: 0 1px 2px rgba(255, 150, 33, 0.4);
      filter: brightness(1.1);
    }

    .WBE__btn:active:not(:disabled) {
      transform: translateY(0px);
    }

    .WBE__btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(0.3);
    }

    .WBE__notification {
      position: fixed;
      top: 96px;
      right: 24px;
      padding: 8px 18px;
      background: linear-gradient(
        180deg,
        color(display-p3 1 0.576 0.271) 1.5%,
        color(display-p3 0.996 0.275 0.439) 97.75%
      );
      color: #22001fff;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(150, 25, 190, 0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `);

  const dbState = { migakuDB: null };

  function initIDB() {
    return new Promise((resolve, reject) => {
      if (dbState.migakuDB) return resolve(dbState.migakuDB);
      const request = indexedDB.open(DB_CONFIG.DB_NAME);
      request.onerror = (e) => reject(new Error(`IndexedDB open error: ${e.target.errorCode}`));
      request.onsuccess = (e) => {
        dbState.migakuDB = e.target.result;
        resolve(dbState.migakuDB);
      };
    });
  }

  async function readCompressedSqliteBlob() {
    const idb = await initIDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction([DB_CONFIG.OBJECT_STORE], "readonly");
      const store = tx.objectStore(DB_CONFIG.OBJECT_STORE);
      const req = store.getAll();
      req.onerror = (e) => reject(e.target.error);
      req.onsuccess = (e) => {
        const rows = e.target.result || [];
        const data = rows.length && rows[0].data instanceof Uint8Array ? rows[0].data : null;
        resolve(data);
      };
    });
  }

  async function openSqlite() {
    const gz = await readCompressedSqliteBlob();
    if (!gz) return null;

    let bytes;
    try {
      bytes = pako.inflate(gz);
    } catch (e) {
      return null;
    }

    const SQL = await initSqlJs({ locateFile: (f) => `${DB_CONFIG.SQL_CDN_PATH}${f}` });
    return new SQL.Database(bytes);
  }

  function execToObjects(result) {
    if (!result || !result.length) return [];
    const { columns, values } = result[0];
    return values.map((row) => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
  }

  function getCurrentLanguage() {
    const main = document.querySelector(".MIGAKU-SRS[data-mgk-lang-selected]");
    return main ? main.getAttribute("data-mgk-lang-selected") || "ja" : "ja";
  }

  function getActiveFilters() {
    const filters = {
      KNOWN: false,
      LEARNING: false,
      IGNORED: false,
      HAS_CARD: CARD_FILTER.ANY
    };

    const knownCheckbox = document.querySelector('input#KNOWN.UiCheckbox__input__element');
    const learningCheckbox = document.querySelector('input#LEARNING.UiCheckbox__input__element');
    const ignoredCheckbox = document.querySelector('input#IGNORED.UiCheckbox__input__element');

    if (knownCheckbox) filters.KNOWN = knownCheckbox.checked;
    if (learningCheckbox) filters.LEARNING = learningCheckbox.checked;
    if (ignoredCheckbox) filters.IGNORED = ignoredCheckbox.checked;

    const allActionSheets = document.querySelectorAll('.UiActionSheet');
    let cardFilterActionSheet = null;

    for (const sheet of allActionSheets) {
      const sheetText = sheet.textContent?.toLowerCase() || '';
      if (sheetText.includes('card status') || sheetText.includes('card filter')) {
        cardFilterActionSheet = sheet;
        break;
      }
    }

    if (!cardFilterActionSheet) {
      for (const sheet of allActionSheets) {
        const items = Array.from(sheet.querySelectorAll('.UiActionSheet__item'));
        const hasCardOptions = items.some(item => {
          const text = item.textContent?.toLowerCase() || '';
          return text.includes('has a card') || text.includes('doesn\'t have') || text.includes('no card');
        });
        if (hasCardOptions) {
          cardFilterActionSheet = sheet;
          break;
        }
      }
    }

    if (cardFilterActionSheet) {
      const items = cardFilterActionSheet.querySelectorAll('.UiActionSheet__item');
      items.forEach(item => {
        const text = item.textContent?.trim() || '';
        const checkbox = item.querySelector('.UiCheckbox');
        const isActive = checkbox?.classList.contains('-toggled') || false;

        if (!isActive || !text) return;
        if (text.toLowerCase().includes('status') || text.toLowerCase().includes('filter')) return;

        const normalizedText = text.toLowerCase().trim().replace(/[\u2018\u2019\u201C\u201D]/g, "'");

        if (normalizedText.includes("doesn't have a card") || normalizedText.includes("does not have a card") ||
            normalizedText.includes("don't have a card") || normalizedText.includes("do not have a card") ||
            normalizedText.includes('no card') || normalizedText.includes('without card')) {
          filters.HAS_CARD = CARD_FILTER.NO_CARD;
        } else if (normalizedText.includes('has a card') &&
                   !normalizedText.includes("doesn't") && !normalizedText.includes("does not")) {
          filters.HAS_CARD = CARD_FILTER.HAS_CARD;
        }
      });
    }

    return filters;
  }

  async function fetchAllWords(language, filters) {
    const db = await openSqlite();
    if (!db) throw new Error("Could not open database");

    let sql = '';
    
    try {
      const statuses = [];
      if (filters.KNOWN) statuses.push(`'${WORD_STATUS.KNOWN}'`);
      if (filters.LEARNING) statuses.push(`'${WORD_STATUS.LEARNING}'`);
      if (filters.IGNORED) statuses.push(`'${WORD_STATUS.IGNORED}'`);

      if (statuses.length === 0) {
        return { known: [], learning: [], ignored: [] };
      }
      
      const statusFilter = `AND w.knownStatus IN (${statuses.join(', ')})`;

      const tableInfo = db.exec("PRAGMA table_info(WordList)");
      const columns = tableInfo[0]?.values || [];
      const columnNames = columns.map(col => col[1]);
      const hasCardColumn = columnNames.includes('hasCard');
      
      let cardFilter = '';
      if (filters.HAS_CARD === CARD_FILTER.HAS_CARD) {
        cardFilter = hasCardColumn ? 'AND w.hasCard = 1' : 'AND c.id IS NOT NULL';
      } else if (filters.HAS_CARD === CARD_FILTER.NO_CARD) {
        cardFilter = hasCardColumn ? 'AND w.hasCard = 0' : 'AND c.id IS NULL';
      }
      
      if (hasCardColumn) {
        sql = `
          SELECT DISTINCT w.dictForm, w.knownStatus, w.hasCard
          FROM WordList w
          WHERE w.language = ? AND w.del = 0 ${statusFilter} ${cardFilter}
          ORDER BY w.dictForm ASC
        `;
      } else {
        sql = `
          SELECT DISTINCT w.dictForm, w.knownStatus,
            CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END as hasCard
          FROM WordList w
          LEFT JOIN Card c ON w.id = c.words AND c.deleted = 0
          WHERE w.language = ? AND w.del = 0 ${statusFilter} ${cardFilter}
          ORDER BY w.dictForm ASC
        `;
      }

      const queryResult = db.exec(sql, [language]);
      const rows = execToObjects(queryResult);
      
      const seen = new Map();
      const deduplicatedRows = [];
      rows.forEach((row) => {
        const word = row.dictForm;
        if (!seen.has(word)) {
          seen.set(word, row);
          deduplicatedRows.push(row);
        }
      });

      const wordGroups = {
        known: new Set(),
        learning: new Set(),
        ignored: new Set(),
      };

      deduplicatedRows.forEach((row) => {
        const word = row.dictForm;
        if (!word) return;
        
        switch (row.knownStatus) {
          case WORD_STATUS.KNOWN:
            wordGroups.known.add(word);
            break;
          case WORD_STATUS.LEARNING:
            wordGroups.learning.add(word);
            break;
          case WORD_STATUS.IGNORED:
            wordGroups.ignored.add(word);
            break;
        }
      });

      return {
        known: Array.from(wordGroups.known).sort(),
        learning: Array.from(wordGroups.learning).sort(),
        ignored: Array.from(wordGroups.ignored).sort(),
      };
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    } finally {
      db.close();
    }
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "WBE__notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideIn 0.3s ease reverse";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showNotification("✓ Copied to clipboard!"))
        .catch(() => legacyCopy(text));
    } else {
      legacyCopy(text);
    }
  }

  function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showNotification("✓ Copied to clipboard!");
    } catch (e) {
      showNotification("✗ Copy failed");
    } finally {
      document.body.removeChild(ta);
    }
  }

  function getAllWordsArray(words) {
    return [...words.known, ...words.learning, ...words.ignored];
  }

  function exportAsText(words) {
    return getAllWordsArray(words).join("\n");
  }

  function exportAsCSV(words) {
    const lines = ["Status,Word"];
    words.known.forEach(word => lines.push(`Known,${word}`));
    words.learning.forEach(word => lines.push(`Learning,${word}`));
    words.ignored.forEach(word => lines.push(`Ignored,${word}`));
    return lines.join("\n");
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`✓ Downloaded ${filename}`);
  }

  async function handleExport(format) {
    const buttons = document.querySelectorAll(".WBE__btn");
    buttons.forEach((btn) => (btn.disabled = true));

    try {
      const language = getCurrentLanguage();
      const filters = getActiveFilters();
      const words = await fetchAllWords(language, filters);

      const total = words.known.length + words.learning.length + words.ignored.length;

      if (total === 0) {
        showNotification("No words to export!");
        return;
      }

      let filterInfo = "";
      if (filters.HAS_CARD === CARD_FILTER.HAS_CARD) {
        filterInfo = " (with cards)";
      } else if (filters.HAS_CARD === CARD_FILTER.NO_CARD) {
        filterInfo = " (without cards)";
      }

      switch (format) {
        case "clipboard":
          copyToClipboard(exportAsText(words));
          showNotification(`✓ Copied ${total} words${filterInfo}!`);
          break;
        case "csv":
          downloadFile(exportAsCSV(words), `migaku-words-${Date.now()}.csv`, "text/csv;charset=utf-8");
          break;
        case "txt":
          downloadFile(exportAsText(words), `migaku-words-${Date.now()}.txt`, "text/plain;charset=utf-8");
          break;
      }
    } catch (e) {
      showNotification("✗ Export failed: " + e.message);
    } finally {
      buttons.forEach((btn) => (btn.disabled = false));
    }
  }

  function injectExportButtons() {
    if (document.getElementById("WBE-export-container")) return;

    const container = document.createElement("div");
    container.id = "WBE-export-container";

    const clipboardBtn = document.createElement("button");
    clipboardBtn.className = "WBE__btn";
    clipboardBtn.textContent = "Copy Words";
    clipboardBtn.onclick = () => handleExport("clipboard");

    const csvBtn = document.createElement("button");
    csvBtn.className = "WBE__btn";
    csvBtn.textContent = "Export CSV";
    csvBtn.onclick = () => handleExport("csv");

    const txtBtn = document.createElement("button");
    txtBtn.className = "WBE__btn";
    txtBtn.textContent = "Export TXT";
    txtBtn.onclick = () => handleExport("txt");

    container.appendChild(clipboardBtn);
    container.appendChild(csvBtn);
    container.appendChild(txtBtn);

    document.body.appendChild(container);
  }

  function isOnWordBrowser() {
    return location.pathname.replace(/\/+$/, "") === "/word-browser";
  }

  async function init() {
    if (!isOnWordBrowser()) return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    injectExportButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
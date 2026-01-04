// ==UserScript==
// @name         ニコニ広告者集計ツール
// @namespace    https://greasyfork.org/users/prozent55
// @version      0.0.1
// @description  ニコニ広告支援者リストを取得・整形して表示
// @match        https://www.nicovideo.jp/watch*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550644/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%E8%80%85%E9%9B%86%E8%A8%88%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/550644/%E3%83%8B%E3%82%B3%E3%83%8B%E5%BA%83%E5%91%8A%E8%80%85%E9%9B%86%E8%A8%88%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ------------------------------
  // UI
  // ------------------------------
  const panelHTML = `
    <details id="ad-supporter-panel">
      <summary>📊 広告支援者</summary>
      <div class="asp-body">
        <div class="asp-left">
          <div class="asp-row">
            <label class="asp-label"><input type="checkbox" id="asp-honorific"> 敬称</label>
            <input type="text" id="asp-honorific-text" value="さん">
          </div>
          <div class="asp-row">
            <label class="asp-label">リストの作り方:</label>
            <select id="asp-list-type">
              <option value="raw">01_未加工</option>
              <option value="merge">02_同名を統合</option>
              <option value="merge_rev">03_同名を統合(逆順)</option>
              <option value="reverse">04_逆順</option>
            </select>
          </div>
          <div class="asp-row">
            <label class="asp-label">リストの表示:</label>
            <select id="asp-view-type">
              <option value="default">01_デフォルト</option>
              <option value="count">02_名前×回数</option>
            </select>
          </div>
          <div class="asp-row">
            <label class="asp-label">テキストの表示:</label>
            <select id="asp-text-type">
              <option value="name">01_名前</option>
              <option value="name_count">02_名前×回数</option>
              <option value="wrap30">03_30文字折返し</option>
              <option value="wrap45">04_45文字・3列</option>
              <option value="wrap60">05_60文字・4列</option>
            </select>
          </div>
          <div class="asp-row asp-buttons">
            <button id="asp-fetch">取得</button>
            <button id="asp-format">表示変更</button>
          </div>
        </div>
        <div class="asp-right">
          <textarea id="asp-output" rows="8"></textarea>
          <div class="asp-row" style="margin-top:6px; justify-content: flex-end;">
            <button id="asp-copy">コピー</button>
          </div>
        </div>
      </div>
      <div class="asp-footer">
        <div id="asp-api-log">APIログ: 待機中</div>
      </div>
    </details>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #ad-supporter-panel {
      position: fixed;
      right: 10px;
      bottom: 10px;
      width: 640px;
      max-height: 70vh;
      overflow: auto;
      z-index: 999999;
      font-family: sans-serif;
      border: 1px solid #ccc;
      background: #fafafa;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    #ad-supporter-panel summary {
      cursor: pointer;
      background: #444;
      color: #fff;
      padding: 6px;
      font-weight: bold;
      list-style: none;
    }
    .asp-body { display: flex; padding: 10px; }
    .asp-left { flex: 1; margin-right: 10px; border-right: 1px solid #ccc; padding-right: 10px; font-size: 0.9em; }
    .asp-row { display: flex; align-items: center; margin: 4px 0; gap: 6px; }
    .asp-label { display: inline-block; width: 100px; }
    .asp-buttons { margin-top: 10px; }
    #ad-supporter-panel select,
    #ad-supporter-panel input[type="text"] {
      width: 140px;
      background: #fff;
      border: 1px solid #bbb;
      padding: 3px;
    }
    #asp-output {
      width: 100%;
      min-height: 140px;
      resize: vertical;
      font-family: monospace;
      background: #fff;
      border: 1px solid #bbb;
    }
    #ad-supporter-panel button {
      padding: 4px 8px;
      border: 1px solid #888;
      background: #eee;
      cursor: pointer;
    }
    #ad-supporter-panel button:hover { background: #ddd; }
    #ad-supporter-panel button:disabled {
      background: #ccc !important;
      color: #666 !important;
      cursor: not-allowed !important;
    }
    .asp-right { flex: 2; padding-left: 10px; }
    .asp-footer { margin: 5px 10px; border-top: 1px solid #ccc; padding-top: 4px; font-size: 0.9em; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', panelHTML);

  const logEl = document.getElementById("asp-api-log");
  const outputEl = document.getElementById("asp-output");

  let fetchedHistories = [];
  let fetching = false;

  const log = (msg) => { logEl.textContent = `APIログ: ${msg}`; };

  function setButtonsDisabled(disabled) {
    document.getElementById("asp-fetch").disabled = disabled;
    document.getElementById("asp-format").disabled = disabled;
  }

  // ------------------------------
  // API取得
  // ------------------------------
  async function fetchAllHistories(videoId) {
    let offset = 0;
    const limit = 100;
    let allHistories = [];

    while (true) {
      const url = `https://api.nicoad.nicovideo.jp/v1/contents/video/${videoId}/histories?offset=${offset}&limit=${limit}`;
      log(`取得中 offset=${offset}`);
      const res = await fetch(url);
      const json = await res.json();

      if (json.meta.status === 200) {
        const histories = json.data.histories;
        if (!histories || histories.length === 0) break;
        allHistories = allHistories.concat(histories);
        log(`${histories.length}件取得 (合計 ${allHistories.length})`);
        offset += limit;
      } else if (json.meta.status === 400) {
        log("status=400 → 取得終了");
        break;
      } else {
        log(`status=${json.meta.status} → 終了`);
        break;
      }
    }
    return allHistories;
  }

  // ------------------------------
  // 幅計算（全角=2, 半角=1）
  // ------------------------------
  function strWidth(str) {
    let width = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if ((code >= 0x20 && code <= 0x7E) || (code >= 0xFF61 && code <= 0xFF9F)) {
        width += 1; // 半角
      } else {
        width += 2; // 全角
      }
    }
    return width;
  }

  function padWidth(str, targetWidth) {
    const w = strWidth(str);
    if (w >= targetWidth) return str;
    return str + " ".repeat(targetWidth - w);
  }

  // ------------------------------
  // 列整形
  // ------------------------------
  function formatColumnsAdaptive(names, baseCols = 3, colWidth = 30) {
    const result = [];
    let row = [];
    let usedCols = 0;

    const flush = () => {
      if (row.length) {
        result.push(row.join(""));
        row = [];
        usedCols = 0;
      }
    };

    for (const name of names) {
      const w = strWidth(name);
      let cellCols, cellWidth;

      if (w > colWidth * 2) {
        flush();
        result.push(name); // 全角31文字以上 → 単独行
        continue;
      } else if (w > colWidth) {
        cellCols = 2;             // 全角16〜30文字 → 2セル
        cellWidth = colWidth * 2;
      } else {
        cellCols = 1;             // 全角15文字以内 → 1セル
        cellWidth = colWidth;
      }

      if (usedCols + cellCols > baseCols) flush();

      row.push(padWidth(name, cellWidth));
      usedCols += cellCols;

      if (usedCols >= baseCols) flush();
    }

    flush();
    return result.join("\n");
  }

  // ------------------------------
  // 整形ロジック
  // ------------------------------
  function formatHistories(histories) {
    const honorific = document.getElementById("asp-honorific").checked ? document.getElementById("asp-honorific-text").value : "";
    const listType = document.getElementById("asp-list-type").value;
    const viewType = document.getElementById("asp-view-type").value;
    const textType = document.getElementById("asp-text-type").value;

    let list = [...histories];

    if (listType === "reverse") {
      list = list.slice().reverse();
    }
    if (listType === "merge" || listType === "merge_rev") {
      const map = {};
      list.forEach(h => {
        const key = h.advertiserName || "不明";
        if (!map[key]) map[key] = { count: 0, adPoint: 0 };
        map[key].count++;
        map[key].adPoint += h.adPoint || 0;
      });
      list = Object.entries(map).map(([name, v]) => ({
        advertiserName: name,
        count: v.count,
        adPoint: v.adPoint
      }));
      if (listType === "merge_rev") list = list.reverse();
    }

    let lines = list.map(h => {
      const name = (h.advertiserName || "不明") + honorific;
      if (viewType === "count" || textType === "name_count") {
        const cnt = h.count || 1;
        return `${name}×${cnt}`;
      } else {
        return name;
      }
    });

    if (textType === "wrap30") {
      lines = lines.join(" ").match(/.{1,30}/g) || [];
      return lines.join("\n");
    } else if (textType === "wrap45") {
      return formatColumnsAdaptive(lines, 3, 30);
    } else if (textType === "wrap60") {
      return formatColumnsAdaptive(lines, 4, 30);
    }

    return lines.join("\n");
  }

  // ------------------------------
  // イベント
  // ------------------------------
  document.getElementById("asp-fetch").addEventListener("click", async () => {
    if (fetching) {
      log("既に取得中です…");
      return;
    }
    fetching = true;
    setButtonsDisabled(true);

    try {
      const videoIdMatch = location.pathname.match(/\/watch\/((?:sm|nm)\d+)/);
      if (!videoIdMatch) { log("動画IDが取得できません"); return; }
      const videoId = videoIdMatch[1];
      log(`動画ID: ${videoId}`);

      fetchedHistories = await fetchAllHistories(videoId);
      outputEl.value = formatHistories(fetchedHistories);
      log(`完了: ${fetchedHistories.length}件`);
    } finally {
      fetching = false;
      setButtonsDisabled(false);
    }
  });

  document.getElementById("asp-format").addEventListener("click", () => {
    if (fetchedHistories.length === 0) {
      log("データ未取得");
      return;
    }
    outputEl.value = formatHistories(fetchedHistories);
    log("表示形式を適用");
  });

  document.getElementById("asp-copy").addEventListener("click", () => {
    navigator.clipboard.writeText(outputEl.value);
    log("コピー完了");
  });

})();

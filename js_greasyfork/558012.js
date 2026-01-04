// ==UserScript==
// @name         ホロライブ公式ショップ：ライブラリ内検索＋一括DL
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  ライブラリ内ポップアップ検索・キーワード完全対応・壁紙手動推奨
// @author       demupe3
// @match        https://shop.hololivepro.com/apps/downloads*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558012/%E3%83%9B%E3%83%AD%E3%83%A9%E3%82%A4%E3%83%96%E5%85%AC%E5%BC%8F%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%EF%BC%9A%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E5%86%85%E6%A4%9C%E7%B4%A2%EF%BC%8B%E4%B8%80%E6%8B%ACDL.user.js
// @updateURL https://update.greasyfork.org/scripts/558012/%E3%83%9B%E3%83%AD%E3%83%A9%E3%82%A4%E3%83%96%E5%85%AC%E5%BC%8F%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%EF%BC%9A%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E5%86%85%E6%A4%9C%E7%B4%A2%EF%BC%8B%E4%B8%80%E6%8B%ACDL.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_KEYWORDS = [
    "指定なし", "ASMR", "記念ボイス", "録り下ろし",
    "ときのそら", "ロボ子さん", "さくらみこ", "星街すいせい", "AZKi",
    "白上フブキ", "夏色まつり", "赤井はあと", "アキ・ローゼンタール",
    "湊あくあ", "紫咲シオン", "百鬼あやめ", "癒月ちょこ", "大空スバル",
    "大神ミオ", "猫又おかゆ", "戌神ころね", "兎田ぺこら", "不知火フレア",
    "白銀ノエル", "宝鐘マリン", "天音かなた", "角巻わため", "常闇トワ",
    "姫森ルーナ", "雪花ラミィ", "桃鈴ねね", "獅白ぼたん", "尾丸ポルカ",
    "ラプラス・ダークネス", "鷹嶺ルイ", "博衣こより", "沙花叉クロヱ",
    "風真いろは", "火威青", "音乃瀬奏", "一条莉々華", "儒烏風亭らでん",
    "轟はじめ", "響咲リオナ", "虎金妃笑虎", "水宮枢", "輪堂千速", "綺々羅々ヴィヴィ"
  ];

  const STORAGE_KEY_DATA = "holo_shop_library_data_v2";
  const STORAGE_KEY_CONFIG = "holo_shop_keyword_config_v2";
  const STORAGE_KEY_HISTORY = "holo_shop_download_history_v2";

  let cachedItems = null;
  let cachedKeywords = null;

  function loadKeywords() {
    if (cachedKeywords) return cachedKeywords;
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    cachedKeywords = saved ? JSON.parse(saved) : [...DEFAULT_KEYWORDS];
    return cachedKeywords;
  }

  function saveKeywords(list) {
    cachedKeywords = list;
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(list));
  }

  function loadItems() {
    if (cachedItems !== null) return cachedItems;
    const saved = localStorage.getItem(STORAGE_KEY_DATA);
    cachedItems = saved ? JSON.parse(saved) : null;
    return cachedItems;
  }

  function saveItems(items) {
    cachedItems = items;
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(items));
  }

  function getDownloadHistory() {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    return saved ? JSON.parse(saved) : [];
  }

  function addToHistory(filename) {
    const safe = filename.replace(/[\/\\]/g, '／');
    const hist = getDownloadHistory();
    if (!hist.includes(safe)) {
      hist.push(safe);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(hist));
    }
  }

  // フローティングボタン（右下）
  function createFloatingButton() {
    if (document.getElementById("sp-tool-container")) return;

    const isDetailPage = !!document.querySelector(".skypilot-track-container");
    const hasData = !!loadItems();

    const btn = document.createElement("div");
    btn.id = "sp-tool-container";
    btn.style.cssText = `
      position:fixed; bottom:20px; right:20px; z-index:99999;
      width:70px; height:70px; border-radius:50%;
      background:${isDetailPage ? '#e42c64' : '#2ccce4'};
      box-shadow:0 6px 20px rgba(0,0,0,0.3);
      display:flex; flex-direction:column; justify-content:center; align-items:center;
      color:white; font-family:-apple-system,sans-serif; cursor:pointer;
      user-select:none; transition:all 0.3s;
    `;
    btn.innerHTML = `
      <div style="font-size:34px;">${isDetailPage ? '⬇️' : (hasData ? '🔍' : '📥')}</div>
      <div style="font-size:10px; margin-top:2px;">${isDetailPage ? '一括DL' : (hasData ? '検索' : '取得')}</div>
    `;

    btn.onclick = () => {
      if (isDetailPage) openBulkDownloadModal();
      else if (hasData) showSearchModalInLibrary(loadItems());
      else if (confirm("購入データをすべて読み込みますか？\n（通常1〜2分で完了）")) startCrawling();
    };

    document.body.appendChild(btn);
  }

  // ライブラリ内ポップアップ検索モーダル
  function showSearchModalInLibrary(items) {
    const existing = document.getElementById("sp-results-modal");
    if (existing) existing.remove();

    const libraryContainer = document.querySelector(".sky-pilot-files-list");
    if (!libraryContainer) return;

    let sortDescending = true;

    const modal = document.createElement("div");
    modal.id = "sp-results-modal";
    modal.style.cssText = `
      margin:20px 0; background:white; border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,0.2); overflow:hidden;
      font-family:-apple-system,sans-serif; position:relative; z-index:100;
    `;

    const header = document.createElement("div");
    header.style.cssText = "background:#f8f9fa; padding:16px; border-bottom:1px solid #ddd; position:relative;";

    const listContainer = document.createElement("div");
    listContainer.style.cssText = "max-height:70vh; overflow-y:auto; padding:0 16px; -webkit-overflow-scrolling:touch;";

    // ヘッダー再描画関数（イベント再登録を防ぐため分離）
    const renderHeader = () => {
      const keywords = loadKeywords();
      const valid = keywords.filter(k => k === "指定なし" || items.some(i => i.title.toLowerCase().includes(k.toLowerCase())));
      const options = valid.map(k => `<option value="${k}">${k}</option>`).join("");

      header.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="margin:0; font-size:17px; font-weight:600;">商品検索 (${items.length}件)</h3>
          <button id="sp-close" style="background:none; border:none; font-size:24px; cursor:pointer; color:#666;">×</button>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <div style="flex:1; min-width:180px; position:relative;">
            <select id="sp-select" style="width:100%; padding:11px; font-size:16px; border:1px solid #ccc; border-radius:8px; background:white; appearance:none;">
              ${options}
            </select>
            <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%); pointer-events:none; color:#888;">▼</span>
          </div>
          <button id="sp-config" style="width:48px; height:48px; background:white; border:1px solid #ccc; border-radius:8px; font-size:22px;">⚙️</button>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px;">
          <input id="sp-text" type="text" placeholder="追加キーワード（例: 2024）" style="flex:1; padding:11px; font-size:16px; border:2px solid #2ccce4; border-radius:8px;">
          <button id="sp-sort" style="padding:0 16px; background:white; border:2px solid #2ccce4; color:#2ccce4; border-radius:8px; font-weight:bold; white-space:nowrap;">新着順</button>
          <button id="sp-refresh" style="padding:0 16px; background:#2ccce4; color:white; border:none; border-radius:8px; font-weight:bold;">更新</button>
        </div>
      `;

      // イベントリスナは一度だけ登録（再描画されても上書きされない）
      header.querySelector("#sp-close").onclick = () => modal.remove();
      header.querySelector("#sp-text").addEventListener("input", renderList);
      header.querySelector("#sp-select").addEventListener("change", renderList);
      header.querySelector("#sp-sort").onclick = () => {
        sortDescending = !sortDescending;
        header.querySelector("#sp-sort").textContent = sortDescending ? "新着順" : "古い順";
        renderList();
      };
      header.querySelector("#sp-refresh").onclick = () => {
        if (confirm("最新データを再取得しますか？")) {
          modal.remove();
          localStorage.removeItem(STORAGE_KEY_DATA);
          cachedItems = null;
          startCrawling();
        }
      };
      header.querySelector("#sp-config").onclick = () => {
        openKeywordSettings(() => {
          renderHeader();  // キーワード更新後に再描画（イベントは維持される）
          renderList();
        });
      };
    };

    const renderList = () => {
      const selectVal = header.querySelector("#sp-select")?.value || "指定なし";
      const inputVal = header.querySelector("#sp-text")?.value.trim() || "";
      const extra = inputVal.toLowerCase().split(/\s+/).filter(Boolean);

      let filtered = items.filter(item => {
        const t = item.title.toLowerCase();
        if (selectVal !== "指定なし" && !t.includes(selectVal.toLowerCase())) return false;
        return extra.every(k => t.includes(k));
      });

      filtered.sort((a, b) => sortDescending ? (b.orderId - a.orderId) : (a.orderId - b.orderId));

      listContainer.innerHTML = "";
      if (filtered.length === 0) {
        listContainer.innerHTML = '<div style="padding:80px 20px; text-align:center; color:#888; font-size:16px;">該当する商品がありません</div>';
        return;
      }

      const frag = document.createDocumentFragment();
      filtered.forEach(item => {
        const a = document.createElement("a");
        a.href = item.link;
        a.style.cssText = "display:flex; padding:14px 0; border-bottom:1px solid #eee; text-decoration:none; color:inherit;";
        a.innerHTML = `
          <div style="width:64px; height:64px; background:#f0f0f0; border-radius:10px; margin-right:16px; flex-shrink:0; overflow:hidden;">
            ${item.imgSrc ? `<img src="${item.imgSrc}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">` : ''}
          </div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:15px; line-height:1.4;">${item.title}</div>
            <div style="font-size:13px; color:#2ccce4; margin-top:6px;">開く →</div>
          </div>
        `;
        frag.appendChild(a);
      });
      listContainer.appendChild(frag);
    };

    renderHeader();
    modal.appendChild(header);
    modal.appendChild(listContainer);
    renderList();

    // ライブラリの上に挿入
    libraryContainer.parentNode.insertBefore(modal, libraryContainer);
  }

  // ==================== 修正版クローリング（line_items_page対応） ====================
  async function startCrawling() {
    const container = document.getElementById("sp-tool-container");
    const statusEl = container.querySelector("div:last-child");
    container.style.opacity = "0.6";
    statusEl.textContent = "読み込み中";

    // 初回ページから注文IDと顧客IDを抽出
    const currentUrl = window.location.href;
    const urlMatch = currentUrl.match(/\/orders\/(\d+)(?:\?logged_in_customer_id=(\d+))?/);
    if (!urlMatch) {
      alert("ページ構造が認識できません。URLを確認してください。");
      container.style.opacity = "1";
      return;
    }
    const orderId = urlMatch[1];
    const customerId = urlMatch[2] || orderId; // 顧客IDがorderIdと同じ場合を考慮
    const baseUrl = `https://shop.hololivepro.com/apps/downloads/orders/${orderId}?logged_in_customer_id=${customerId}`;

    let allItems = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const pageUrl = `${baseUrl}&line_items_page=${page}`;
      statusEl.textContent = `P.${page}`;
      console.log(`Fetching: ${pageUrl}`); // デバッグ用

      let html;
      try {
        const res = await fetch(pageUrl, {
          credentials: "include",
          headers: {
            Accept: "text/html",
            "X-Requested-With": "XMLHttpRequest"
          }
        });
        if (!res.ok) {
          console.error(`HTTP ${res.status} for page ${page}`);
          break;
        }
        html = await res.text();
      } catch (e) {
        console.error("Fetch error:", e);
        break;
      }

      const doc = new DOMParser().parseFromString(html, "text/html");
      const items = extractItems(doc);
      console.log(`Page ${page}: ${items.length} items extracted`); // デバッグ用

      if (items.length === 0) {
        // 次リンクを確認して最終判定
        const nextLinkEl = doc.querySelector(".sky-pilot-pagination .next a");
        if (!nextLinkEl) {
          hasNext = false;
        } else {
          // 次リンクをfetchしてフォールバック
          const nextUrl = nextLinkEl.href;
          await new Promise(r => setTimeout(r, 500));
          const nextRes = await fetch(nextUrl, { credentials: "include" });
          if (!nextRes.ok) break;
          const nextHtml = await nextRes.text();
          const nextDoc = new DOMParser().parseFromString(nextHtml, "text/html");
          const nextItems = extractItems(nextDoc);
          if (nextItems.length === 0) break;
          allItems.push(...nextItems);
          hasNext = false; // フォールバック後終了
        }
      } else {
        allItems.push(...items);
        page++;
        await new Promise(r => setTimeout(r, 500));
      }
    }

    console.log(`Crawling completed: Total ${allItems.length} items`); // デバッグ用
    if (allItems.length === 0) {
      alert("商品が検出されませんでした。ログイン状態やページ構造を確認の上、再試行してください。");
      container.style.opacity = "1";
      statusEl.textContent = "エラー";
      return;
    }

    saveItems(allItems);
    container.style.opacity = "1";
    statusEl.textContent = "検索";
    container.querySelector("div:first-child").textContent = "🔍";

    alert(`取得完了！\n合計 ${allItems.length} 件の商品を検出しました。`);
    showSearchModal(allItems);
  }

  function extractItems(doc) {
    const items = [];
    doc.querySelectorAll("a.sky-pilot-list-item").forEach(el => {
      const titleEl = el.querySelector(".sky-pilot-file-heading");
      const title = titleEl?.innerText.trim() || "名称不明";
      const link = el.href;
      let imgSrc = "";
      const imgEl = el.querySelector("img.sky-pilot-product-thumbnail");
      if (imgEl) {
        imgSrc = imgEl.src || imgEl.getAttribute("data-src") || "";
        // 相対URLを絶対URLに変換
        if (imgSrc && !imgSrc.startsWith("http")) {
          imgSrc = new URL(imgSrc, window.location.origin).href;
        }
      }
      const orderId = link.match(/\/orders\/(\d+)/)?.[1] ? parseInt(link.match(/\/orders\/(\d+)/)[1], 10) : 0;
      items.push({ title, link, imgSrc, orderId });
    });
    return items;
  }

  // ==================== 一括ダウンロード（詳細ページ） ====================
  async function openBulkDownloadModal() {
    const tracks = document.querySelectorAll(".skypilot-track-container .track");
    if (tracks.length === 0) {
      alert("このページにはダウンロード可能なオーディオファイルがありません。\n\n壁紙・PDFなどはページ下部のファイル名を直接クリックして手動で保存してください。");
      return;
    }

    const allFiles = [];

    for (let track of tracks) {
      const actionIcon = track.querySelector(".action-icon");
      if (!actionIcon) continue;

      const baseName = (track.querySelector(".track-name a, .track-name span")?.innerText || "track").trim().replace(/[\\/:*?"<>|]/g, "_");

      actionIcon.click();
      await new Promise(r => setTimeout(r, 300));

      const menu = document.querySelector('ul.rc-menu[data-menu-list="true"]');
      if (menu) {
        menu.querySelectorAll("a.menu-type").forEach(a => {
          const url = a.href;
          const text = a.innerText.trim();
          let ext = null;
          if (text.includes("MP3")) ext = "mp3";
          else if (text.includes("WAV")) ext = "wav";
          else if (text.includes("ZIP")) ext = "zip";
          else if (text.includes("PDF")) ext = "pdf";

          if (ext && url.startsWith("http")) {
            const filename = `${baseName}.${ext}`;
            const safeName = filename.replace(/[\/\\]/g, '／');
            allFiles.push({ url, filename, ext, downloaded: getDownloadHistory().includes(safeName) });
          }
        });
        document.body.click(); // メニュー閉じる
      }
    }

    if (allFiles.length === 0) {
      alert("ダウンロード可能なオーディオファイルが見つかりませんでした。\n\n壁紙・PDFなどはページ下部のファイル名を直接クリックして保存してください。");
      return;
    }

    const uniqueFiles = [];
    const seen = new Set();
    allFiles.forEach(f => {
      if (!seen.has(`${f.url}|${f.filename}`)) {
        seen.add(`${f.url}|${f.filename}`);
        uniqueFiles.push(f);
      }
    });

    const extensions = [...new Set(uniqueFiles.map(f => f.ext))].sort();
    const downloadedCount = uniqueFiles.filter(f => f.downloaded).length;

    const modal = document.createElement("div");
    modal.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:100002; display:flex; align-items:center; justify-content:center; font-family:-apple-system,sans-serif;`;
    modal.innerHTML = `
      <div style="background:white; border-radius:16px; width:90%; max-width:420px; max-height:90%; overflow-y:auto; padding:24px;">
        <h3 style="margin:0 0 16px; font-size:19px; font-weight:600; text-align:center;">一括ダウンロード</h3>
        <div style="background:#f0f8ff; padding:12px; border-radius:8px; margin-bottom:16px; font-size:14px; line-height:1.5;">
          <strong>※ 壁紙・PDF・特典画像について</strong><br>
          ページ下部のファイル名を直接タップ／クリックしてください。<br>
          自動取得はできません（クリック＝即ダウンロードのため）
        </div>
        <div style="margin-bottom:20px;">
          ${extensions.map(ext => {
            const count = uniqueFiles.filter(f => f.ext === ext).length;
            return `<label style="display:flex; align-items:center; margin:10px 0;">
              <input type="checkbox" class="ext-cb" value="${ext}" checked style="width:22px;height:22px;margin-right:12px;">
              <span style="font-weight:600;">.${ext.toUpperCase()}</span>
              <span style="color:#666; margin-left:6px;">(${count}個)</span>
            </label>`;
          }).join("")}
        </div>
        <label style="display:flex; align-items:center; margin:20px 0; font-size:15px;">
          <input type="checkbox" id="skip-dl" ${downloadedCount > 0 ? "checked" : ""} style="width:20px;height:20px;margin-right:12px;">
          <span>ダウンロード済みを除外</span>
          <span style="color:#888; font-size:13px; margin-left:8px;">（${downloadedCount}個）</span>
        </label>
        <div style="display:flex; gap:16px; margin-top:24px;">
          <button id="cancel-btn" style="flex:1; padding:14px; background:#f0f0f0; border-radius:12px; font-weight:600;">キャンセル</button>
          <button id="start-btn" style="flex:1; padding:14px; background:#e42c64; color:white; border-radius:12px; font-weight:600;">開始（${uniqueFiles.length}ファイル）</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector("#cancel-btn").onclick = () => modal.remove();
    modal.querySelector("#start-btn").onclick = () => {
      const selected = [...modal.querySelectorAll(".ext-cb:checked")].map(c => c.value);
      const skip = modal.querySelector("#skip-dl").checked;
      const targets = uniqueFiles.filter(f => selected.includes(f.ext) && !(skip && f.downloaded));

      if (targets.length === 0) {
        alert("選択された条件でダウンロード対象がありません");
        return;
      }
      modal.remove();
      startBulkDownload(targets);
    };
  }

  async function startBulkDownload(files) {
    if (!confirm(`${files.length}ファイルをダウンロードしますか？`)) return;

    const statusEl = document.getElementById("sp-tool-container")?.querySelector("div:last-child");
    if (statusEl) statusEl.textContent = "DL中";

    let success = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (statusEl) statusEl.textContent = `${i + 1}/${files.length}`;
      try {
        await new Promise((resolve, reject) => {
          GM_download({ url: f.url, name: f.filename, onload: resolve, onerror: reject });
        });
        addToHistory(f.filename);
        success++;
      } catch (e) { console.error("DL failed:", f.filename); }
      if (i < files.length - 1) await new Promise(r => setTimeout(r, 1800));
    }

    if (statusEl) statusEl.textContent = "完了";
    alert(`ダウンロード完了！ ${success}/${files.length} 件`);
  }

  // ==================== キーワード設定モーダル ====================
  function openKeywordSettings(onClose) {
    const modal = document.createElement("div");
    modal.style.cssText = `position:fixed; inset:0; background:#f2f2f7; z-index:100003; display:flex; flex-direction:column; font-family:-apple-system,sans-serif;`;

    let keywords = loadKeywords();

    const render = () => {
      modal.innerHTML = `
        <div style="padding:15px 15px 10px; background:white; border-bottom:1px solid #c6c6c8; padding-top:50px; display:flex; justify-content:space-between; align-items:center;">
          <h2 style="margin:0; font-size:17px; font-weight:600;">キーワード設定</h2>
          <button id="done" style="font-size:17px; color:#007aff; background:none; border:none; font-weight:600;">完了</button>
        </div>
        <div style="padding:15px; background:white;">
          <div style="display:flex; gap:10px;">
            <input id="new-kw" type="text" placeholder="新しいキーワード" style="flex:1; padding:10px; border:1px solid #ccc; border-radius:8px; font-size:16px;">
            <button id="add" style="padding:0 16px; background:#007aff; color:white; border:none; border-radius:8px; font-weight:600;">追加</button>
          </div>
        </div>
        <div style="flex:1; overflow-y:auto; padding:15px 15px 80px; -webkit-overflow-scrolling:touch;">
          <div id="list" style="background:white; border-radius:10px; overflow:hidden;"></div>
        </div>
        <div style="padding:20px; text-align:center; background:white; border-top:1px solid #ddd;">
          <button id="reset" style="color:#ff3b30; background:none; border:none; font-size:15px;">初期設定に戻す</button>
        </div>
      `;

      const list = modal.querySelector("#list");
      list.innerHTML = "";
      const frag = document.createDocumentFragment();

      keywords.slice(1).forEach((kw, i) => {
        const div = document.createElement("div");
        div.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid #e5e5ea;";
        div.innerHTML = `
          <span style="font-size:16px;">${kw}</span>
          <button data-idx="${i + 1}" style="width:32px; height:32px; background:#ff3b30; color:white; border:none; border-radius:50%; font-size:14px;">−</button>
        `;
        div.querySelector("button").onclick = e => {
          e.stopPropagation();
          keywords.splice(parseInt(e.target.dataset.idx), 1);
          render();
        };
        frag.appendChild(div);
      });
      list.appendChild(frag);

      modal.querySelector("#done").onclick = () => {
        saveKeywords(keywords);
        modal.remove();
        onClose?.();
      };

      modal.querySelector("#add").onclick = () => {
        const val = modal.querySelector("#new-kw").value.trim();
        if (val && !keywords.includes(val)) {
          keywords.push(val);
          modal.querySelector("#new-kw").value = "";
          render();
        }
      };

      modal.querySelector("#reset").onclick = () => {
        if (confirm("キーワードを初期状態に戻しますか？")) {
          keywords = [...DEFAULT_KEYWORDS];
          render();
        }
      };
    };

    render();
    document.body.appendChild(modal);
  }

  // ==================== 検索モーダル ====================
  function showSearchModal(items) {
    if (document.getElementById("sp-results-modal")) return;

    let sortDescending = true;

    const modal = document.createElement("div");
    modal.id = "sp-results-modal";
    modal.style.cssText = `
      position:fixed; top:0; left:0; width:100%; height:100%; background:white;
      z-index:100001; display:flex; flex-direction:column; font-family:-apple-system,sans-serif;
    `;

    const header = document.createElement("div");
    header.style.cssText = "background:#f8f9fa; border-bottom:1px solid #ddd; padding:15px; padding-top:50px;";

    const renderHeader = () => {
      const keywords = loadKeywords();
      const valid = keywords.filter(k => k === "指定なし" || items.some(i => i.title.toLowerCase().includes(k.toLowerCase())));
      const options = valid.map(k => `<option value="${k}">${k}</option>`).join("");

      header.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="margin:0; font-size:17px; font-weight:600;">商品検索 (${items.length}件)</h3>
          <button id="close" style="padding:8px 16px; background:white; border:1px solid #ccc; border-radius:8px; font-weight:600;">閉じる</button>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <div style="flex:1; position:relative;">
            <select id="select" style="width:100%; padding:11px; font-size:16px; border:1px solid #ccc; border-radius:8px; background:white; appearance:none;">${options}</select>
            <span style="position:absolute; right:12px; top:50%; transform:translateY(-50%); pointer-events:none; color:#888;">▼</span>
          </div>
          <button id="config" style="width:48px; height:48px; background:white; border:1px solid #ccc; border-radius:8px; font-size:22px;">⚙️</button>
        </div>
        <div style="display:flex; gap:8px;">
          <input id="text" type="text" placeholder="追加キーワード（例: 2024）" style="flex:1; padding:11px; font-size:16px; border:2px solid #2ccce4; border-radius:8px;">
          <button id="sort" style="padding:0 16px; background:white; border:2px solid #2ccce4; color:#2ccce4; border-radius:8px; font-weight:bold;">新着順</button>
        </div>
        <div style="text-align:right; margin-top:8px;">
          <button id="refresh" style="font-size:13px; color:#2ccce4; background:none; border:none;">データを再取得</button>
        </div>
      `;
    };

    const listContainer = document.createElement("div");
    listContainer.style.cssText = "flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch;";

    const renderList = () => {
      const selectVal = header.querySelector("#select").value;
      const inputVal = header.querySelector("#text").value.trim();
      const extra = inputVal.toLowerCase().split(/\s+/).filter(Boolean);

      let filtered = items.filter(item => {
        const t = item.title.toLowerCase();
        if (selectVal !== "指定なし" && !t.includes(selectVal.toLowerCase())) return false;
        return extra.every(k => t.includes(k));
      });

      filtered.sort((a, b) => sortDescending ? (b.orderId - a.orderId) : (a.orderId - b.orderId));

      listContainer.innerHTML = "";
      if (filtered.length === 0) {
        listContainer.innerHTML = '<div style="padding:80px 20px; text-align:center; color:#888; font-size:16px;">該当する商品がありません</div>';
        return;
      }

      const frag = document.createDocumentFragment();
      filtered.forEach(item => {
        const a = document.createElement("a");
        a.href = item.link;
        a.style.cssText = "display:flex; padding:14px 16px; border-bottom:1px solid #eee; text-decoration:none; color:inherit;";
        a.innerHTML = `
          <div style="width:64px; height:64px; background:#f0f0f0; border-radius:10px; margin-right:16px; flex-shrink:0; overflow:hidden;">
            ${item.imgSrc ? `<img src="${item.imgSrc}" style="width:100%; height:100%; object-fit:cover; loading:lazy;" onerror="this.style.display='none'; this.parentNode.style.background='#ddd';">` : '<div style="width:100%; height:100%; background:#ddd;"></div>'}
          </div>
          <div style="flex:1;">
            <div style="font-weight:600; font-size:15px; line-height:1.4; color:#333;">${item.title}</div>
            <div style="font-size:13px; color:#2ccce4; margin-top:6px;">開く →</div>
          </div>
        `;
        frag.appendChild(a);
      });
      listContainer.appendChild(frag);
    };

    renderHeader();
    modal.appendChild(header);
    modal.appendChild(listContainer);
    renderList();

    const bind = () => {
      header.querySelector("#text").addEventListener("input", renderList);
      header.querySelector("#select").addEventListener("change", renderList);
      header.querySelector("#close").addEventListener("click", () => modal.remove());
      header.querySelector("#sort").addEventListener("click", () => {
        sortDescending = !sortDescending;
        header.querySelector("#sort").textContent = sortDescending ? "新着順" : "古い順";
        renderList();
      });
      header.querySelector("#refresh").addEventListener("click", () => {
        if (confirm("最新データを再取得しますか？")) {
          modal.remove();
          localStorage.removeItem(STORAGE_KEY_DATA);
          cachedItems = null;
          startCrawling();
        }
      });
      header.querySelector("#config").addEventListener("click", () => {
        openKeywordSettings(() => {
          renderHeader();
          bind();
          renderList();
        });
      });
    };
    bind();

    document.body.appendChild(modal);
  }

  // ==================== 初期化 ====================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createFloatingButton);
  } else {
    createFloatingButton();
  }
})();
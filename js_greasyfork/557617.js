// ==UserScript==
// @name         Trello Card UI Customizer
// @name:ja      TrelloカードUIカスタマイザー
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Trello's cards to full width (98%), adds a toggle switch for Main/Split/Comments views. Includes keyboard shortcuts.
// @description:ja  Trelloのカードを画面幅まで広げ、MAIN/SPLIT/COMMENTSの表示をトグルとショートカット(u / i / o)で制御します。
// @author       You
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557617/Trello%20Card%20UI%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/557617/Trello%20Card%20UI%20Customizer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ==========================================
  // 定数・設定
  // ==========================================
  const CLASS_TOGGLE_CONTAINER = "tm-toggle-container";
  const DATA_ATTR_LAYOUT = "data-tm-layout"; // レイアウト状態を管理する属性

  // ==========================================
  // CSS スタイル定義
  // ==========================================
  GM_addStyle(`
        /* ----------------------------------------
           1. モーダルとコンテナの幅拡張
           ---------------------------------------- */
        /* ダイアログ本体の幅を画面の98%にする */
        div[role="dialog"] {
            width: 98vw !important;
            max-width: 98vw !important;
        }

        /* ダイアログ内のカラムラッパーの幅制限を解除 */
        div[role="dialog"] div[class*="window-main-col"],
        div[role="dialog"] .window-main-col,
        div[role="dialog"] main {
            width: 100% !important;
            max-width: none !important;
            flex-basis: auto !important;
        }

        /* 内部コンテンツの最大幅制限も解除 */
        div[role="dialog"] main > div,
        div[role="dialog"] aside > div,
        div[role="dialog"] hgroup {
            max-width: none !important;
            width: 100% !important;
        }

        /* ----------------------------------------
           2. 2カラムレイアウト (main と aside の制御)
           ---------------------------------------- */
        /* レイアウトコンテナ（mainとasideの親要素） */
        div[${DATA_ATTR_LAYOUT}] {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            gap: 24px !important;
            width: 100% !important;
            overflow: hidden !important;
        }

        /* 共通: 各カラムのスクロール設定 */
        div[${DATA_ATTR_LAYOUT}] > main,
        div[${DATA_ATTR_LAYOUT}] > aside {
            overflow-y: auto !important;
            max-height: calc(90vh - 120px) !important; /* ヘッダー分を引いてスクロールさせる */
        }

        /* --- モード: SPLIT (both) --- */
        div[${DATA_ATTR_LAYOUT}="both"] > main {
            flex: 1 1 50% !important;
            width: 50% !important;
            display: block !important;
        }
        div[${DATA_ATTR_LAYOUT}="both"] > aside {
            flex: 1 1 50% !important;
            width: 50% !important;
            display: block !important;
            border-left: 1px solid var(--ds-border, #091e4224) !important;
            padding-left: 24px !important;
        }

        /* --- モード: MAINのみ (desc) --- */
        div[${DATA_ATTR_LAYOUT}="desc"] > main {
            flex: 1 1 100% !important;
            width: 100% !important;
            display: block !important;
        }
        div[${DATA_ATTR_LAYOUT}="desc"] > aside {
            display: none !important;
        }

        /* --- モード: COMMENTSのみ (act) --- */
        div[${DATA_ATTR_LAYOUT}="act"] > main {
            display: none !important;
        }
        div[${DATA_ATTR_LAYOUT}="act"] > aside {
            flex: 1 1 100% !important;
            width: 100% !important;
            display: block !important;
            border-left: none !important;
        }

        /* ----------------------------------------
           3. トグルスイッチのデザイン
           ---------------------------------------- */
        .${CLASS_TOGGLE_CONTAINER} {
            display: inline-flex;
            align-items: center;
            background-color: rgba(9, 30, 66, 0.04);
            border-radius: 3px;
            height: 32px;
            padding: 0 2px;
            margin-right: 8px;
            white-space: nowrap;
        }
        [data-color-mode="dark"] .${CLASS_TOGGLE_CONTAINER} {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .tm-toggle-label {
            position: relative; /* ツールチップ配置の基準 */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
            height: 28px;
            cursor: pointer;
            border-radius: 3px;
            color: var(--ds-text-subtle, #5e6c84);
            font-size: 12px;
            font-weight: 700;
            user-select: none;
            transition: all 0.2s;
            margin: 0 2px;
        }

        .tm-toggle-label:hover {
            background-color: rgba(9, 30, 66, 0.08);
        }
        [data-color-mode="dark"] .tm-toggle-label:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        /* 選択中のスタイル */
        .tm-toggle-label:has(input:checked) {
            background-color: var(--ds-background-brand-bold, #0079bf);
            color: var(--ds-text-inverse, #ffffff);
        }

        .tm-toggle-label input {
            display: none;
        }

        /* ----------------------------------------
           4. 不要なUIの非表示
           ---------------------------------------- */
        /* MAINのスティッキーヘッダーを表示しない */
        [data-testid="card-back-sticky-header"] {
            display: none !important;
        }

        /* ----------------------------------------
           5. ツールチップ (HTML要素で実装)
           ---------------------------------------- */
        /* ツールチップ本体 */
        .tm-tooltip {
            position: absolute;
            top: 100%; /* 親要素の下端 */
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px; /* ラベルとの距離 */
            padding: 6px 10px;
            background-color: #172b4d; /* Trello Dark Blue */
            color: #ffffff;
            font-size: 11px;
            font-weight: normal;
            border-radius: 3px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s, visibility 0.2s;
            z-index: 9999;
            box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.08);
            pointer-events: none;
            line-height: 1.2;
        }

        /* ダークモード対応 */
        [data-color-mode="dark"] .tm-tooltip {
            background-color: #ffffff;
            color: #172b4d;
        }

        /* ホバー時に表示 */
        .tm-toggle-label:hover .tm-tooltip {
            opacity: 1;
            visibility: visible;
            transition-delay: 0.4s;
        }

        /* インラインコード風の装飾 */
        .tm-tooltip-key {
            font-family: "SF Mono", "Segoe UI Mono", "Roboto Mono", "Ubuntu Mono", Menlo, Courier, monospace;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 1px 5px;
            border-radius: 3px;
            margin-left: 4px;
            font-weight: bold;
            border: 1px solid rgba(255, 255, 255, 0.3);
            display: inline-block;
        }

        /* ダークモード時のインラインコード */
        [data-color-mode="dark"] .tm-tooltip-key {
            background-color: rgba(9, 30, 66, 0.1);
            border: 1px solid rgba(9, 30, 66, 0.2);
        }
  `);

  // ==========================================
  // DOM監視・初期化
  // ==========================================

  // カードダイアログが開かれたか監視
  const observer = new MutationObserver((mutations) => {
    const dialog = document.querySelector('div[role="dialog"]');
    // ダイアログがあり、まだスイッチがない、またはレイアウト未適用の場合に実行
    if (
      dialog &&
      (!dialog.querySelector(`.${CLASS_TOGGLE_CONTAINER}`) ||
        !dialog.querySelector(`[${DATA_ATTR_LAYOUT}]`))
    ) {
      initCardFeatures(dialog);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function initCardFeatures(dialog) {
    // レイアウト対象となるコンテナを特定
    const mainEl = dialog.querySelector("main");
    const asideEl = dialog.querySelector("aside");

    if (mainEl && asideEl && mainEl.parentElement === asideEl.parentElement) {
      const container = mainEl.parentElement;

      // コンテナに属性がなければ初期化
      if (!container.hasAttribute(DATA_ATTR_LAYOUT)) {
        // デフォルトは「SPLIT」
        container.setAttribute(DATA_ATTR_LAYOUT, "both");
      }

      insertToggleSwitch(dialog, container);
    }
  }

  // ==========================================
  // ビュー変更ロジック
  // ==========================================
  function changeViewMode(dialog, mode) {
    const layoutContainer = dialog.querySelector(`[${DATA_ATTR_LAYOUT}]`);
    if (!layoutContainer) return;

    layoutContainer.setAttribute(DATA_ATTR_LAYOUT, mode);

    const radio = dialog.querySelector(
      `input[name="tm-view"][value="${mode}"]`
    );
    if (radio) {
      radio.checked = true;
    }
  }

  // ==========================================
  // ショートカットキー設定
  // ==========================================
  document.addEventListener("keydown", (e) => {
    const dialog = document.querySelector('div[role="dialog"]');
    if (!dialog) return;

    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable)
    ) {
      return;
    }

    if (!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      let mode = null;
      switch (e.key.toLowerCase()) {
        case "u":
          mode = "desc"; // MAIN
          break;
        case "i":
          mode = "both"; // SPLIT
          break;
        case "o":
          mode = "act"; // COMMENTS
          break;
      }

      if (mode) {
        e.preventDefault();
        e.stopPropagation();
        changeViewMode(dialog, mode);
      }
    }
  });

  // ==========================================
  // トグルスイッチ設置
  // ==========================================

  function insertToggleSwitch(dialog, layoutContainer) {
    if (dialog.querySelector(`.${CLASS_TOGGLE_CONTAINER}`)) return;

    let targetBtn = null;
    const closeIcon = dialog.querySelector('[data-testid="CloseIcon"]');
    if (closeIcon) {
      const closeBtn = closeIcon.closest("button");
      if (closeBtn) {
        targetBtn = closeBtn.parentElement;
      }
    }

    if (!targetBtn) return;

    const container = document.createElement("div");
    container.className = CLASS_TOGGLE_CONTAINER;

    // HTML要素としてツールチップを実装
    container.innerHTML = `
            <label class="tm-toggle-label">
                <input type="radio" name="tm-view" value="desc">MAIN
                <span class="tm-tooltip">MAIN View: <span class="tm-tooltip-key">u</span></span>
            </label>
            <label class="tm-toggle-label">
                <input type="radio" name="tm-view" value="both" checked>SPLIT
                <span class="tm-tooltip">SPLIT View: <span class="tm-tooltip-key">i</span></span>
            </label>
            <label class="tm-toggle-label">
                <input type="radio" name="tm-view" value="act">COMMENTS
                <span class="tm-tooltip">COMMENTS View: <span class="tm-tooltip-key">o</span></span>
            </label>
        `;

    const radios = container.querySelectorAll('input[name="tm-view"]');
    radios.forEach((r) => {
      r.addEventListener("change", (e) => {
        changeViewMode(dialog, e.target.value);
      });
    });

    const wrapper = targetBtn.closest('div[role="presentation"]') || targetBtn;
    if (wrapper.parentElement) {
      wrapper.parentElement.insertBefore(container, wrapper);
    }
  }
})();

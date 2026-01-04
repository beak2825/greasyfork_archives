// ==UserScript==
// @name         Amazon.co.jp URL Cleaner 🔗🧹
// @name:ja      Amazon.co.jp URLクリーナー 🔗🧹
// @name:en      Amazon.co.jp URL Cleaner 🔗🧹
// @name:zh-CN   Amazon.co.jp 链接清理器 🔗🧹
// @name:zh-TW   Amazon.co.jp 連結清理器 🔗🧹
// @name:ko      Amazon.co.jp URL 클리너 🔗🧹
// @name:fr      Nettoyeur d’URL Amazon.co.jp 🔗🧹
// @name:es      Limpiador de URL de Amazon.co.jp 🔗🧹
// @name:de      Amazon.co.jp-URL-Cleaner 🔗🧹
// @name:pt-BR   Limpador de URL da Amazon.co.jp 🔗🧹
// @name:ru      Очистка URL Amazon.co.jp 🔗🧹
// @namespace    https://github.com/koyasi777/amazon-jp-url-cleaner
// @version      2.0.2
// @description  Amazon.co.jp 用URLクリーナー。パス中の /ref= や一般的なトラッキング用パラメータを削除します。商品ページは /dp/ASIN に正規化し、それ以外は既知の追跡要素のみ除去して他のパラメータは保持（フィルタ等を維持）。History/Location・クリック・SPA遷移をフックし、URLを常に読みやすくプライバシー配慮に保ちます。
// @description:ja   Amazon.co.jp 用URLクリーナー。パス中の /ref= や一般的なトラッキング用パラメータを削除します。商品ページは /dp/ASIN に正規化し、それ以外は既知の追跡要素のみ除去して他のパラメータは保持（フィルタ等を維持）。History/Location・クリック・SPA遷移をフックし、URLを常に読みやすくプライバシー配慮に保ちます。
// @description:en   Amazon.co.jp URL cleaner userscript. Removes /ref= path segments and common tracking params. Product pages normalize to /dp/ASIN; other pages remove known tracking while keeping other params so filters work. Hooks History/Location, link clicks, and SPA navigation to keep URLs readable and privacy-friendly.
// @description:zh-CN  Amazon.co.jp URL 清理脚本：移除路径中的 /ref= 片段与常见跟踪参数。商品页规范为 /dp/ASIN；非商品页仅删已知跟踪参数并保留其它参数以确保筛选等功能可用。拦截 History/Location、链接点击与 SPA 路由，让 URL 始终更易读、更注重隐私。
// @description:zh-TW  Amazon.co.jp URL 清理腳本：移除路徑中的 /ref= 段落與常見追蹤參數。商品頁正規化為 /dp/ASIN；非商品頁僅刪已知追蹤參數並保留其它參數以維持篩選等功能。攔截 History/Location、連結點擊與 SPA 導覽，讓 URL 一直更易讀、更重視隱私。
// @description:ko    Amazon.co.jp URL 클리너 유저스크립트. 경로의 /ref= 구간과 일반적인 추적 파라미터를 제거합니다. 상품 페이지는 /dp/ASIN으로 정리하고, 비상품 페이지는 알려진 추적만 제거하며 나머지는 유지해 필터 등이 동작하게 합니다. History/Location·클릭·SPA 내비게이션을 후킹해 URL을 항상 읽기 쉽고 프라이버시 친화적으로 유지합니다.
// @description:fr    Userscript de nettoyage d’URL Amazon.co.jp. Supprime /ref= (chemin) et les paramètres de suivi courants. Pages produit → /dp/ASIN ; autres pages : retire le tracking connu en gardant les autres paramètres (filtres OK). Intercepte History/Location, clics et navigation SPA pour garder des URL lisibles et respectueuses de la vie privée.
// @description:es    Userscript limpiador de URL para Amazon.co.jp. Elimina /ref= (ruta) y parámetros de seguimiento comunes. Páginas de producto → /dp/ASIN; otras páginas: quita tracking conocido y conserva el resto (filtros OK). Engancha History/Location, clics y navegación SPA para mantener URLs legibles y más privadas.
// @description:de    Amazon.co.jp-URL-Cleaner-Userscript. Entfernt /ref= im Pfad und gängige Tracking-Parameter. Produktseiten → /dp/ASIN; andere Seiten: entfernt nur bekanntes Tracking und behält übrige Parameter (Filter ok). Hookt History/Location, Link-Klicks und SPA-Navigation, damit URLs lesbar und datenschutzfreundlich bleiben.
// @description:pt-BR Userscript limpador de URL para Amazon.co.jp. Remove /ref= no caminho e parâmetros comuns de rastreamento. Páginas de produto → /dp/ASIN; demais páginas: remove tracking conhecido e mantém o restante (filtros OK). Intercepta History/Location, cliques e navegação SPA para manter URLs legíveis e mais privadas.
// @description:ru    Скрипт очистки URL для Amazon.co.jp. Удаляет /ref= в пути и типичные трекинговые параметры. Товарные страницы → /dp/ASIN; остальные: убирает известный трекинг, сохраняя прочие параметры (фильтры работают). Перехватывает History/Location, клики и SPA-навигацию, чтобы URL оставались читаемыми и более приватными.
// @author       koyasi777
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-jp-url-cleaner
// @supportURL   https://github.com/koyasi777/amazon-jp-url-cleaner/issues
// @icon         https://www.amazon.co.jp/favicon.ico
// @match        https://www.amazon.co.jp/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/548611/Amazoncojp%20URL%20Cleaner%20%F0%9F%94%97%F0%9F%A7%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/548611/Amazoncojp%20URL%20Cleaner%20%F0%9F%94%97%F0%9F%A7%B9.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Configuration -----------------------------------------

  // 【Mode A: 商品ページ用】許可するクエリキー（ホワイトリスト）
  // 必要なパラメータ（アフィリエイトのtagや言語設定など）のみをここに定義。
  // 空配列 [] なら、/dp/ASIN だけの最もクリーンなURLになります。
  const PRODUCT_ALLOW_KEYS = [];

  // 【Mode B: その他ページ用】削除対象パラメータ（ブラックリスト）
  // 検索結果やトップページ等で「機能は壊さずにトラッキングだけ消す」ためのリスト。
  const TRACKING_BLACKLIST = new Set([
    'ref', 'ref_', 'pf_rd_r', 'pf_rd_p', 'pf_rd_m', 'pf_rd_s', 'pf_rd_t', 'pf_rd_i',
    'pd_rd_r', 'pd_rd_w', 'pd_rd_wg', 'qid', 'sr', 'keywords', // keywordsは検索維持のため例外判定あり
    'dchild', 'crid', 'sprefix', 'field-keywords', 'hvpos', 'hvexid', 'hvnetw',
    'hvrand', 'hvqmt', 'hvbmt', 'hvdev', 'hvdvcmdl', 'hvlocint', 'hvlocphy',
    'hvtargid', 'hydadcr', '_encoding','ie',
  ]);

  // 上記ブラックリストに含まれていても、検索結果ページ等で機能維持のために残すべきキー
  const FUNCTIONAL_KEYS_ON_SEARCH = new Set(['keywords', 'k', 'rh', 'page', 'sort', 'node']);

  // --- Helpers ---------------------------------------------------------------

  /**
   * 安全なURLオブジェクト生成
   * URL.canParse が使えない環境への配慮も含め、パース不可なら例外を投げるかnullを返す
   */
  function toURL(input) {
    const s = String(input);
    // ベースURL解決を厳密に行う
    try {
      return new URL(s, location.href);
    } catch {
      throw new TypeError(`Unparsable URL: ${s}`);
    }
  }

  /**
   * パスからASINを抽出
   * /dp/, /gp/product/, /gp/aw/d/ に対応
   */
  function extractASIN(pathname) {
    const m = pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i);
    return m ? m[1].toUpperCase() : null;
  }

  // --- Core Logic: The Dual-Mode Canonicalizer -------------------------------

  function canonicalize(input) {
    let url;
    try {
      url = toURL(input);
    } catch {
      // パース不能な文字列は触らず返す（安全性優先）
      return String(input);
    }

    // Safety check: amazon.co.jp 以外は絶対に触らない
    if (!/\.amazon\.co\.jp$/i.test(url.hostname)) return url.href;

    const asin = extractASIN(url.pathname);

    // -------------------------------------------------------------------------
    // Strategy A: 商品ページ (Strict Reconstruction)
    // -------------------------------------------------------------------------
    if (asin) {
      // 言語プレフィックス（/-/en/ や /-/es/ 等）があれば保持
      const langPrefixMatch = url.pathname.match(/^\/-\/[^/]+\//);
      const prefix = langPrefixMatch ? langPrefixMatch[0].slice(0, -1) : '';

      // 許可されたクエリだけをホワイトリスト方式で再構築
      const keptParams = new URLSearchParams();
      if (PRODUCT_ALLOW_KEYS.length) {
        const allow = new Set(PRODUCT_ALLOW_KEYS.map(k => k.toLowerCase()));
        for (const [k, v] of url.searchParams) {
          if (allow.has(k.toLowerCase())) keptParams.append(k, v);
        }
      }
      const qs = keptParams.toString();

      // フラグメント(#)は維持しつつ、正規化URLを返す
      return `${url.origin}${prefix}/dp/${asin}${qs ? `?${qs}` : ''}${url.hash}`;
    }

    // -------------------------------------------------------------------------
    // Strategy B: その他ページ (General Cleaning)
    // -------------------------------------------------------------------------
    // 検索結果、トップページ、アカウントサービス等は、ブラックリストにあるゴミだけを除去する。

    // 1. Path Cleaning: URLパス内の /ref=... をカット
    if (url.pathname.includes('/ref=')) {
      url.pathname = url.pathname.split('/ref=')[0];
      if (url.pathname === '') url.pathname = '/';
    }

    // 2. Query Cleaning: トラッキングパラメータの除去
    const isSearchPage = url.pathname.startsWith('/s');

    // /stores/ 系だけ lp_asin を落とす（流入元ASINの文脈/計測用途になりがち）
    const isStorePage = url.pathname.startsWith('/stores/');
    if (isStorePage) {
      url.searchParams.delete('lp_asin');
    }

    // 検索ページの旧パラメータを正規形へ寄せる（検索語が消えるのを防ぐ）
    if (isSearchPage) {
      // field-keywords を k に正規化（k が無いときだけ）
      if (!url.searchParams.has('k') && url.searchParams.has('field-keywords')) {
        url.searchParams.set('k', url.searchParams.get('field-keywords') || '');
        url.searchParams.delete('field-keywords');
      }
    }

    const keys = Array.from(url.searchParams.keys());

    for (const key of keys) {
      const lowerKey = key.toLowerCase();

      // ref=... は全ページで無条件削除
      if (lowerKey === 'ref' || lowerKey.startsWith('ref_')) {
        url.searchParams.delete(key);
        continue;
      }

      // ブラックリスト判定
      if (
        lowerKey.startsWith('pf_rd_') ||
        lowerKey.startsWith('pd_rd_') ||
        TRACKING_BLACKLIST.has(lowerKey)
      ) {
        // 例外: 検索ページで機能的に必要なキーなら維持 (例: keywords)
        if (isSearchPage && FUNCTIONAL_KEYS_ON_SEARCH.has(lowerKey)) continue;

        url.searchParams.delete(key);
      }
    }

    return url.href;
  }

  // --- Execution & Hooks: Robustness ---------------------------------

  function normalizeHere() {
    const target = canonicalize(location.href);
    if (target !== location.href) {
      try {
        // history.state を維持しつつ URL のみ置換
        history.replaceState(history.state, document.title, target);
      } catch {
        // フォールバック
        history.replaceState(null, '', target);
      }
      return true; // 変更あり
    }
    return false; // 変更なし
  }

  // 1) 初期実行（最速タイミング）
  normalizeHere();

  // 2) History API Hook
  (function hookHistory() {
    const _push = history.pushState;
    const _replace = history.replaceState;

    history.pushState = function (state, title, url) {
      if (url !== undefined && url !== null) {
        try { url = canonicalize(url); } catch {}
        return _push.call(this, state, title, url);
      }
      return _push.call(this, state, title);
    };

    history.replaceState = function (state, title, url) {
      if (url !== undefined && url !== null) {
        try { url = canonicalize(url); } catch {}
        return _replace.call(this, state, title, url);
      } else {
        // 引数なしreplaceでも現在地を浄化
        const target = canonicalize(location.href);
        if (target !== location.href) {
          return _replace.call(this, state, title, target);
        }
        return _replace.call(this, state, title);
      }
    };

    // SPAバック/フォワード時の再正規化
    window.addEventListener('popstate', normalizeHere, { capture: true });
  })();

  // 3) Location API Hook
  (function hookLocation() {
    // ユーティリティ: 同一URLならリロードを防ぐ
    function safeCallAssignReplace(fn, urlLike) {
      try {
        const c = canonicalize(urlLike);
        if (c === location.href) return; // no-op
        return fn.call(this, c);
      } catch {
        return fn.call(this, urlLike);
      }
    }

    try {
      const L = Location.prototype;
      // assignフック
      try {
        const descA = Object.getOwnPropertyDescriptor(L, 'assign');
        if (!descA || descA.writable) {
          const _assign = L.assign;
          L.assign = function (url) {
            return safeCallAssignReplace.call(this, _assign, url);
          };
        }
      } catch {}

      // replaceフック
      try {
        const descR = Object.getOwnPropertyDescriptor(L, 'replace');
        if (!descR || descR.writable) {
          const _replace = L.replace;
          L.replace = function (url) {
            return safeCallAssignReplace.call(this, _replace, url);
          };
        }
      } catch {}

    } catch {
      // prototype操作がブロックされた場合のインスタンス直接書き換え
      try {
        const loc = window.location;
        const _assign2 = loc.assign.bind(loc);
        const _replace2 = loc.replace.bind(loc);
        Object.defineProperty(loc, 'assign', {
          value: (url) => safeCallAssignReplace.call(loc, _assign2, url)
        });
        Object.defineProperty(loc, 'replace', {
          value: (url) => safeCallAssignReplace.call(loc, _replace2, url)
        });
      } catch {}
    }
  })();

  // 3.5) Click Event Hook
  (function preNormalizeAnchorClicks() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // 左クリックのみ
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a) return;

      // 除外: ダウンロード、別タブ、外部リンク属性
      if (a.hasAttribute('download')) return;
      if (a.target === '_blank') return;
      if (/\bexternal\b/i.test(a.rel || '')) return;

      try {
        const u = new URL(a.href, location.href);
        // http/https 以外は無視
        if (!/^https?:$/i.test(u.protocol)) return;
        // Amazon以外は無視
        if (!/\.amazon\.co\.jp$/i.test(u.hostname)) return;

        const c = canonicalize(u);
        // クリーンなURLに書き換えてから遷移させる
        if (c !== a.href) a.href = c;
      } catch {}
    }, { capture: true });
  })();

  // 4) Watchdog
  // Amazonの遅延ロードによるURL再汚染に対抗するため、変更が止まるまで監視する。
  (function watchdog() {
    let ticks = 0;
    let stable = 0; // 連続して変更がなかった回数

    const id = setInterval(() => {
      const changed = normalizeHere();
      // 変更があったらstableカウントをリセット、なければ加算
      stable = changed ? 0 : (stable + 1);

      // 終了条件:
      // 1. 8回連続(約2秒)変更がない = 安定したとみなす
      // 2. または合計40回(約10秒)経過しても終わらない = 強制終了
      if (stable >= 8 || (++ticks > 40 && !changed)) {
        clearInterval(id);
      }
    }, 250);

    // 補助トリガー
    document.addEventListener('DOMContentLoaded', normalizeHere, { once: true });
    window.addEventListener('load', normalizeHere, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') normalizeHere();
    });
  })();

})();

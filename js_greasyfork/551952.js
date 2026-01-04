// ==UserScript==
// @name         Google productID link for FANZA & FC2 (改)
// @version      0.2.7
// @description  FANZAの「配信品番/メーカー品番」とFC2の「商品ID」を青下線のGoogle動画検索リンクに変換
// @author       NOSTD
// @match        https://video.dmm.co.jp/av/content/*
// @match        https://video.dmm.co.jp/amateur/content/*
// @match        https://www.dmm.co.jp/*/-/detail/*
// @match        https://adult.contents.fc2.com/article/*
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/1196626
// @allFrames    true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551952/Google%20productID%20link%20for%20FANZA%20%20FC2%20%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551952/Google%20productID%20link%20for%20FANZA%20%20FC2%20%28%E6%94%B9%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 見た目（青＋下線、既訪問は紫）
  GM_addStyle(`
    a[data-glinked="1"]{
      color:#0645AD !important;
      text-decoration:underline !important;
      cursor:pointer;
    }
    a[data-glinked="1"]:visited{ color:#551A8B !important; }
  `);

  const IS_FANZA = location.host.includes('dmm.co.jp');
  const IS_FC2   = location.host.includes('adult.contents.fc2.com');

  // 検索クエリに付ける追加語（公式や不要サイトを除外）
  const additionalWords =
    ' jav -site:www.dmm.co.jp -site:video.dmm.co.jp -site:javtrailers.com -site:adult.contents.fc2.com -site:twitter.com -site:www.mgstage.com -site:duga.jp -site:javfilms.com -site:www.jav24.com -site:javfilms.com -site:javcv.com -site:javsubtitled.com';

  // ===== 起動：初回＆復元＆SPA遷移を確実に拾う =====
  (function bootstrap() {
    const kick = () => { try { run(); } catch (_) {} };

    // 0) 直ちに＆短時間に数回（SSR/CSRの揺れ吸収）
    kick(); setTimeout(kick, 0); setTimeout(kick, 400); setTimeout(kick, 1200);

    // 1) 通常ロード
    document.addEventListener('DOMContentLoaded', kick, { once: true });
    window.addEventListener('load', kick, { once: true });

    // 2) bfcache 復元やSPA再表示
    window.addEventListener('pageshow', () => { kick(); });

    // 3) SPA 遷移（Next.js 等）をフック
    (function hookHistory(){
      const { pushState, replaceState } = history;
      const fire = () => { setTimeout(kick, 0); setTimeout(kick, 300); setTimeout(kick, 1000); };
      history.pushState = function(){ const r = pushState.apply(this, arguments); fire(); return r; };
      history.replaceState = function(){ const r = replaceState.apply(this, arguments); fire(); return r; };
      window.addEventListener('popstate', fire);
    })();

    // 4) アイドル時にも一回
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => kick(), { timeout: 1500 });
    }

    // 5) 監視（最大180秒）＋ 1秒ポーリング
    const mo = new MutationObserver(kick);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    const iv = setInterval(kick, 1000);
    setTimeout(() => { mo.disconnect(); clearInterval(iv); }, 180000);
  })();

  function run(){
    try{
      if (IS_FANZA) handleFanza();
      if (IS_FC2)   handleFc2();
    }catch(_){}
  }

  // ===== 共通ユーティリティ =====
  function createLink(query, txt){
    const a = document.createElement('a');
    const q = `${query} ${additionalWords}`.trim();
    a.textContent = txt;
    a.href = `https://www.google.co.jp/search?nfpr=1&q=${encodeURIComponent(q)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.dataset.glinked = '1';
    return a;
  }

  // 例: sone00628 / 1sdmm00201 / SONE-628 → 正規化
  function parseCode(raw){
    if (!raw) return null;
    const r = String(raw).replace(/-/g, '');
    const m = r.match(/^(\d+)?([a-zA-Z]+)(\d+)([a-zA-Z]*)$/);
    if (!m) return null;
    const prefix = m[2].toUpperCase();
    const num    = m[3];
    const suffix = (m[4] || '');
    return {
      prefix,
      numNoPad: String(parseInt(num, 10)),
      numPad5 : num.padStart(5, '0'),
      suffix
    };
  }

  // テキスト正規化（全空白・コロン類除去）
  const norm = (s) => (s || '').replace(/[\s\u00A0:：]/g, '');

  // ===== FANZA：厳密 → フォールバック =====
  function handleFanza(){
    const url = new URL(location.href);
    const rawFromURL = url.searchParams.get('id') || url.searchParams.get('cid') || '';

    // ラベル候補（アマチュアで「商品番号」「品番」等の表記も拾う）
    const LABELS = ['配信品番', 'メーカー品番', '商品番号', '品番'];

    // 1) 厳密：th > span.inline-flex/素のth のラベル → 同じ tr の td > span/td を置換
    const labels = document.querySelectorAll('tr > th > span.inline-flex, tr > th');
    let touched = false;
    for (const lab of labels){
      const t = norm(lab.textContent);
      if (!t) continue;

      // どのラベルに該当するか
      const found = LABELS.find(L => t.includes(norm(L)));
      if (!found) continue;

      const tr = lab.closest('tr');
      if (!tr) continue;

      // 値はなるべく td > span 。無ければ td
      let valueSpan = tr.querySelector('td > span');
      const td = tr.querySelector('td');
      if (!valueSpan && td) valueSpan = td;
      if (!valueSpan) continue;

      if (valueSpan.querySelector && valueSpan.querySelector('a[data-glinked="1"]')) continue;

      const cellText = (valueSpan.textContent || '').trim();
      if (!cellText && !rawFromURL) continue;

      const preferPad5 = (found !== 'メーカー品番'); // メーカー品番以外は 5桁ゼロ埋めで表示
      const spec = buildSearchSpec(cellText, rawFromURL, preferPad5);
      if (!spec) continue;

      // 要素は残し、中身だけ入れ替え
      valueSpan.textContent = '';
      valueSpan.appendChild(createLink(spec.query, spec.display));
      touched = true;
    }

    // 2) フォールバック：tr 全体テキストで判定 → 最後の td を置換
    if (!touched){
      const rows = document.querySelectorAll('tr');
      for (const tr of rows){
        const txt = norm(tr.textContent || '');
        const found = LABELS.find(L => txt.includes(norm(L)));
        if (!found) continue;

        const tds = tr.querySelectorAll('td');
        if (!tds.length) continue;
        const valueHost = tds[tds.length - 1];
        if (valueHost.querySelector('a[data-glinked="1"]')) continue;

        const cellText = (valueHost.textContent || '').trim();
        if (!cellText && !rawFromURL) continue;

        const preferPad5 = (found !== 'メーカー品番');
        const spec = buildSearchSpec(cellText, rawFromURL, preferPad5);
        if (!spec) continue;

        valueHost.textContent = '';
        valueHost.appendChild(createLink(spec.query, spec.display));
      }
    }
  }

  function buildSearchSpec(cellText, rawFromURL, preferPad5){
    const cell = (cellText || '').trim();
    const parsedFromCell = cell ? parseCode(cell.replace('-', '')) : null;
    const parsedFromURL  = rawFromURL ? parseCode(rawFromURL.replace('-', '')) : null;

    let display;
    if (preferPad5){
      const p = parsedFromCell || parsedFromURL;
      if (!p) return null;
      display = `${p.prefix}-${p.numPad5}${p.suffix}`;
    }else{
      if (cell){
        display = cell; // メーカーはセル表記優先（桁短いことがある）
      }else if (parsedFromURL){
        display = `${parsedFromURL.prefix}-${parsedFromURL.numNoPad}${parsedFromURL.suffix}`;
      }else{
        return null;
      }
    }

    const variants = [];
    if (cell) variants.push(`"${cell}"`);
    const p = parsedFromCell || parsedFromURL;
    if (p){
      variants.push(`"${p.prefix}-${p.numPad5}${p.suffix}"`);
      variants.push(`"${p.prefix}-${p.numNoPad}${p.suffix}"`);
      variants.push(`"${p.prefix}${p.numPad5}${p.suffix}"`); // ハイフン無し
    }
    if (rawFromURL) variants.push(`"${rawFromURL}"`);

    const query = variants.filter(Boolean).join(' OR ');
    return { display, query };
  }

  // ===== FC2：ページ内の「商品ID : FC2 PPV 4772880」をその場でリンク化 =====
  function handleFc2(){
    // 既にリンク化済みならスキップ
    if (document.querySelector('.items_article_softDevice p a[data-glinked="1"]')) return;

    const candidates = document.querySelectorAll('.items_article_softDevice p, .items_article_headerInfo p, p');
    let linked = false;

    for (const p of candidates){
      const text = (p.textContent || '').trim();
      if (!/商品ID/i.test(text)) continue;

      // 例: "商品ID : FC2 PPV 4772880" / "商品ID: FC2-PPV-4772880" / "商品ID：FC2PPV4772880"
      const m = text.match(/商品ID\s*[:：]?\s*(FC2)\s*[-\s]*\s*(PPV)\s*[-\s]*\s*(\d{3,9})/i);
      if (!m) continue;

      const num = m[3];
      const display = `FC2-PPV-${num}`;
      const query   = `"${num}" OR "${display}"`;

      if (p.querySelector('a[data-glinked="1"]')) { linked = true; break; }

      // ラベル部（「商品ID : 」）を保って置換
      const prefix = (text.match(/^.*?[:：]\s*/) || ['商品ID : '])[0];
      const label  = document.createElement('span'); label.textContent = prefix;
      const a      = createLink(query, display);

      p.textContent = '';
      p.appendChild(label);
      p.appendChild(a);

      linked = true;
      break;
    }

    // 見つからない場合のフォールバック：URL末尾数値で 1 本だけ表示
    if (!linked) {
      const pathLast = location.pathname.split('/').filter(Boolean).pop() || '';
      const numericId = pathLast.match(/\d+/)?.[0];
      if (!numericId) return;

      const display = `FC2-PPV-${numericId}`;
      const query   = `"${numericId}" OR "${display}"`;

      if (document.getElementById('ftz-fc2-code')) return;
      const header = document.querySelector('.items_article_headerInfo h3')
                   || document.querySelector('.items_article_headerInfo')
                   || document.querySelector('h1')
                   || document.body;

      const row = document.createElement('div');
      row.id = 'ftz-fc2-code';
      row.style.margin = '6px 0 12px';
      row.style.fontSize = '14px';

      const label = document.createElement('span');
      label.textContent = '商品ID : ';

      const a = createLink(query, display);
      row.appendChild(label);
      row.appendChild(a);

      if (header && header.insertAdjacentElement){
        header.insertAdjacentElement('afterend', row);
      }else if (header && header.appendChild){
        header.appendChild(row);
      }else{
        (document.body || document.documentElement).insertBefore(row, (document.body || document.documentElement).firstChild);
      }
    }
  }
})();
// ==UserScript==
// @name         X to Anki Qui2 Importer
// @namespace    https://greasyfork.org/users/570127
// @version      1.0.20
// @description  Import #Qui2_* posts into Anki with tweetID deduplication
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/564060/X%20to%20Anki%20Qui2%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/564060/X%20to%20Anki%20Qui2%20Importer.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const version = GM_info.script.version;
  console.log(version);

  /**********************************************************
   * 設定
   **********************************************************/
  const ANKI_URL = 'http://127.0.0.1:8765';
  const NOTE_TYPE = 'Future_X';

  /**********************************************************
   * Toast
   **********************************************************/
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;

    const colors = {
      success: '#2e7d32',
      warn: '#ed6c02',
      error: '#d32f2f',
      info: '#455a64',
    };

    Object.assign(toast.style, {
      position: 'fixed',
      top: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 16px',
      color: '#fff',
      background: colors[type] || colors.info,
      borderRadius: '6px',
      zIndex: 99999,
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    });

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1000);

    const remove = () => toast.remove();
    window.addEventListener('keydown', remove, { once: true });
    window.addEventListener('click', remove, { once: true });
  }

  /**********************************************************
   * AnkiConnect
   **********************************************************/
  function ankiInvoke(action, params = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: ANKI_URL,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ action, version: 6, params }),
        onload: res => {
          const json = JSON.parse(res.responseText);
          if (json.error) reject(json.error);
          else resolve(json.result);
        },
        onerror: err => reject(err),
      });
    });
  }

  async function isDuplicate(tweetID) {
    const notes = await ankiInvoke('findNotes', {
      query: `tweetID:${tweetID}`,
    });
    return notes.length > 0;
  }

  /**********************************************************
   * 文字処理
   **********************************************************/
  const FRONT_PREFIX = /^([［【]?(Ｑ|Q|問題?)[\.．::：。→・】］]?)\s*/;
  const BACK_PREFIX  = /^([［【]?(正解|A|Ａ|答え?)[\.．:：・,。→＞】］]?)\s*/;

  function extractFBM(rawText) {
    if (!rawText) {
      return { front: '', back: '', memo: '' };
    }

    /* 1 - ハッシュタグ除去 */
    const text = rawText
      // #Qui2_YYMMDD 等を除去（行中・行末も含む）
      .replace(/#Qui2?_\d{4,8}\b/gi, '\n')
      .trim();

   console.log(text)

    /* 2 - 行分割・空行除去 */
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l !== '');

    console.log(lines);

    if (lines.length === 0) {
      return { front: '', back: '', memo: '' };
    }

    /* 3 - BACK_PREFIX の位置を探す */
    const backIndex = lines.findIndex(line => BACK_PREFIX.test(line));
    console.log(backIndex);

    let front = '';
    let back = '';
    let memoLines = [];

    if (backIndex !== -1) {
      /* 3 - A) BACK_PREFIX がある場合 */
      // Front = BACK_PREFIX より前のすべて（複数行OK）
      const frontLines = lines.slice(0, backIndex);
      front = frontLines
        .join('\n')
        .replace(FRONT_PREFIX, '')
        .trim();

      // Back = BACK_PREFIX 行の 1 行目
      back = lines[backIndex]
        .replace(BACK_PREFIX, '')
        .trim();

      // memo = BACK_PREFIX 行の次以降
      memoLines = lines.slice(backIndex + 1);
      console.log(memoLines);
    } else {
      /* 3 - B) BACK_PREFIX がない場合 */
      // 1行目 = 問題
      front = lines[0]
        .replace(FRONT_PREFIX, '')
        .trim();

      // 2行目 = 答え（あれば）
      back = (lines[1] || '')
        .replace(BACK_PREFIX, '')
       .trim();

      // 3行目以降 = memo
      memoLines = lines.slice(2);
    }

    const memoFromBody = memoLines.join('\n');
    console.log(memoFromBody);
    return { front, back, memoFromBody };
  }

  function findQuoteRoot(article) {
    // 「引用」というラベルを持つブロックを探す
    const quoteLabel = [...article.querySelectorAll('span')]
      .find(s => s.textContent.trim() === '引用');

    if (!quoteLabel) return null;

    // 「引用」ラベルの親から、role="link" を探す
    return quoteLabel.closest('div[aria-labelledby]')
                   ?.querySelector('div[role="link"]') || null;
  }


  function extractQuotedMemo(article) {
    // console.log(article);
    // 引用ブロック（存在しない場合あり）
    const quoteRoot = findQuoteRoot(article);
    // console.log(quoteRoot);
    if (!quoteRoot) return '';
    // console.log(quoteRoot);
    // 引用ポストのユーザーID（@_Qui2 かどうか判定）
    const userSpans = [...quoteRoot.querySelectorAll('[data-testid="User-Name"] span')]
      .map(s => s.textContent.trim());
    const quotedUserID = userSpans.find(t => t.startsWith('@')) || '';

    // 引用ポスト本文
    const quotedTextEl = quoteRoot.querySelector('[data-testid="tweetText"]');
    const quotedText = quotedTextEl?.innerText?.trim() || '';
    if (!quotedText) return '';

    // console.log(quotedUserID);

    // @_Qui2 以外 → 引用全文を memo
    if (quotedUserID !== '@_Qui2') {
      return quotedText;
    }

    // --- @_Qui2 の場合：お題のみ抽出 ---
    // お題本文
    // 例: 1月23日のお題「答が漢字の『鉄』『鐵』を含む言葉」
    const odaiMatch = quotedText.match(/お題「(.+?)」/);
    // console.log(odaiMatch);
    if (!odaiMatch) return '';

    const odai = odaiMatch[1];

    // #Qui2_YYMMDD を本文からそのまま取得
    const tagMatch = quotedText.match(/#Qui2_\d{6}/);
    if (!tagMatch) return '';

    const tag = tagMatch[0];

    return `お題「<span class="odai">${odai}</span>」(<span class="qui2_tag">${tag}</span>)`;
  }

  /**********************************************************
   * 日付
   **********************************************************/
  function formatJPDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}年${m}月${d}日`;
  }

  function deckByYear(year) {
    if (year <= 2024) return '_Qui2::2024以前';
    return `_Qui2::${year}`;
  }

  /**********************************************************
   * メイン処理
   **********************************************************/
  async function handlePost(article) {
    try {
      const timeEl = article.querySelector('time');
      const postedDate = new Date(timeEl.dateTime);
      const jpDate = new Date(postedDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
      const year = jpDate.getFullYear();

      const tweetURL = article.querySelector('a[href*="/status/"]').href;
      const tweetID = tweetURL.split('/status/')[1].split(/[?/]/)[0];

      if (await isDuplicate(tweetID)) {
        showToast('既に登録済みです', 'warn');
        return;
      }

      const tweetTextEl = article.querySelector('[data-testid="tweetText"]');
      if (!tweetTextEl) {
        showToast('本文が取得できません', 'error');
        return;
      }

      const text = tweetTextEl.innerText;
      const { front, back, memoFromBody } = extractFBM(text);
      const quotedMemo = extractQuotedMemo(article);

      console.log(memoFromBody, quotedMemo);

      // ★ memo を合成
      const memo = [memoFromBody, quotedMemo]
        .filter(v => v && v.trim() !== '')
        .join('<br>');

      console.log(memo);


      const authorElement = article.querySelector('div[data-testid="User-Name"] div:first-child span > span:last-child');
      const author = authorElement ? authorElement.textContent : '';

      const userIDElement = article.querySelector('div[data-testid="User-Name"] a[tabindex="-1"] span');
      const userID = userIDElement ? userIDElement.textContent : '';

      const hashtags = [...text.matchAll(/#(\S+)/g)]
        .map(m => `_Qui2::${m[1]}`);

      // 特定ユーザーの場合、地下タグを付与
      if (userID === '@tkzwgrs' || userID === '@daiku_iyasikey') {
        hashtags.push('地下');
      } else if (userID === '@oshirishiribu') {
        hashtags.push('尻');
        hashtags.push('半地下');
      }

      const note = {
        deckName: deckByYear(year),
        modelName: NOTE_TYPE,
        fields: {
          Front: front,
          Back: back,
          memo: memo, // Corrected variable name
          author,
          userID,
          tweetID,
          postedAt: formatJPDate(jpDate),
        },
        tags: hashtags,
      };

      await ankiInvoke('addNote', { note });
      showToast('Ankiに登録しました', 'success');
    } catch (e) {
      console.error(e);
      showToast('登録に失敗しました', 'error');
    }
  }

  /**********************************************************
   * ボタン注入
   **********************************************************/
  function injectBulkButton() {
    if (document.getElementById('anki-bulk-import')) return;

    const btn = document.createElement('button');
    btn.id = 'anki-bulk-import';
    btn.textContent = '画面内を一括 Anki 登録';

    Object.assign(btn.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: 100000,
      padding: '8px 12px',
      fontSize: '13px',
      background: '#1d9bf0',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    });

    btn.onclick = bulkImportVisiblePosts;
    document.body.appendChild(btn);
  }

 async function bulkImportVisiblePosts() {
  const articles = [...document.querySelectorAll('article')];

  let success = 0;
  let duplicated = 0;
  let failed = 0;

  showToast(`一括登録開始（${articles.length}件）`, 'info');

  for (const article of articles) {
    try {
      const tweetURL = article.querySelector('a[href*="/status/"]')?.href;
      if (!tweetURL) continue;

      const tweetID = tweetURL.split('/status/')[1]?.split(/[?/]/)[0];
      if (!tweetID) continue;

      if (await isDuplicate(tweetID)) {
        duplicated++;
        continue;
      }

      await handlePost(article);
      success++;

      // 連続アクセス回避（軽いウェイト）
      await new Promise(r => setTimeout(r, 250));
    } catch (e) {
      console.error(e);
      failed++;
    }
  }

  showToast(
    `完了：成功 ${success} / 重複 ${duplicated} / 失敗 ${failed}`,
    failed ? 'warn' : 'success'
  );
 }


function injectButtons() {
  document.querySelectorAll('article').forEach(article => {
    if (article.dataset.ankiInjected) return;
    article.dataset.ankiInjected = 'true';

    const actionBar = article.querySelector('div[role="group"]');
    if (!actionBar) return;

    const btn = document.createElement('button');
    btn.textContent = 'Anki登録';

    Object.assign(btn.style, {
      marginLeft: '8px',
      fontSize: '12px',
      background: 'none',
      border: 'none',
      color: '#1d9bf0',
      cursor: 'pointer',
    });

    btn.onclick = () => handlePost(article);

    actionBar.appendChild(btn);
  });
}


  setInterval(() => {
    injectButtons();     // 各ポスト用
    injectBulkButton();  // 一括登録
  }, 1500);

})();

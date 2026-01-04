// ==UserScript==
// @name         ゲンリプwiki記法コピーちゃん
// @namespace    https://w.atwiki.jp/genlip/
// @version      0.3
// @description  右クリックで「wiki記法としてコピー」（リンク付き画像アイコン対応・デバッグログ付き）
// @match        https://w.atwiki.jp/genlip/pages/*
// @run-at       document-end
// @grant        GM_setClipboard
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/558242/%E3%82%B2%E3%83%B3%E3%83%AA%E3%83%97wiki%E8%A8%98%E6%B3%95%E3%82%B3%E3%83%94%E3%83%BC%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/558242/%E3%82%B2%E3%83%B3%E3%83%AA%E3%83%97wiki%E8%A8%98%E6%B3%95%E3%82%B3%E3%83%94%E3%83%BC%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TITLE_SUFFIX = ' - 東方幻想エクリプス（ゲンリプ）攻略wiki @ ウィキ - atwiki（アットウィキ）';

  console.log('[AtwikiWikiCopy] userscript loaded');

  const CUT_MARK = ' - 東方幻想エクリプス（ゲンリプ）攻略wiki';

  async function fetchPageTitle(url) {
    console.log('[AtwikiWikiCopy] fetchPageTitle:', url);
    const res = await fetch(url, { credentials: 'include' });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');
    let title = doc.title || '';
    console.log('[AtwikiWikiCopy] raw title:', title);

    // まずは「 - 東方幻想エクリプス（ゲンリプ）攻略wiki」より前だけを使う
    const cutIndex = title.indexOf(CUT_MARK);
    if (cutIndex !== -1) {
      title = title.slice(0, cutIndex);
    } else {
      // 保険：従来どおり " - atwiki" で切るフォールバック
      const idx2 = title.indexOf(' - atwiki');
      if (idx2 !== -1) {
        title = title.slice(0, idx2);
      }
    }

    title = title.trim();
    console.log('[AtwikiWikiCopy] trimmed title:', title);
    return title;
  }


  function showToast(msg) {
    console.log('[AtwikiWikiCopy] toast:', msg);
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 14px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 999999,
      maxWidth: '80%',
      textAlign: 'center',
      pointerEvents: 'none'
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  let menuEl = null;
  let currentAnchor = null;

  function createMenu() {
    const menu = document.createElement('div');
    menu.textContent = 'wiki記法としてコピー';
    Object.assign(menu.style, {
      position: 'fixed',
      background: 'white',
      border: '1px solid #ccc',
      padding: '4px 10px',
      fontSize: '12px',
      cursor: 'pointer',
      zIndex: 999999,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      whiteSpace: 'nowrap'
    });

    menu.addEventListener('click', async (e) => {
      e.stopPropagation();
      console.log('[AtwikiWikiCopy] menu clicked');
      const anchor = currentAnchor; // ← 先に退避してから hide
      hideMenu();
      if (!anchor) {
        console.warn('[AtwikiWikiCopy] currentAnchor is null');
        return;
      }

      try {
        await handleCopyForAnchor(anchor);
      } catch (err) {
        console.error('[AtwikiWikiCopy] handleCopyForAnchor error', err);
        alert('エラー: ' + err.message);
        showToast('取得に失敗しました');
      }
    });

    document.body.appendChild(menu);
    return menu;
  }

  function showMenu(x, y, anchor) {
    console.log('[AtwikiWikiCopy] showMenu at', x, y, 'anchor:', anchor);
    currentAnchor = anchor;
    if (!menuEl) menuEl = createMenu();
    menuEl.style.left = x + 'px';
    menuEl.style.top = y + 'px';
    menuEl.style.display = 'block';
  }

  function hideMenu() {
    if (menuEl) menuEl.style.display = 'none';
    // currentAnchor はここでは消さない（クリック処理で使うため）
  }

  document.addEventListener('click', () => hideMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideMenu();
  });

  document.addEventListener(
    'contextmenu',
    function (e) {
      const a = e.target.closest('a[href^="/genlip/pages/"]');
      if (!a) return;

      const icon = a.querySelector('.atwiki-link-img-icon');
      const img = a.querySelector('img.atwiki_plugin_image');
      if (!icon || !img) return;

      console.log('[AtwikiWikiCopy] contextmenu on target anchor', a);

      e.preventDefault();
      showMenu(e.clientX, e.clientY, a);
    },
    true
  );

  async function handleCopyForAnchor(a) {
    console.log('[AtwikiWikiCopy] handleCopyForAnchor start', a);

    // ① linkpage
    const href = a.getAttribute('href');
    console.log('[AtwikiWikiCopy] anchor href:', href);
    const linkUrl = new URL(href, location.origin).href;
    const linkpage = await fetchPageTitle(linkUrl);
    console.log('[AtwikiWikiCopy] linkpage:', linkpage);

    // ② 画像URL
    let imgUrl = null;
    const picture = a.querySelector('picture');
    if (picture) {
      const sources = Array.from(picture.querySelectorAll('source[srcset]'));
      if (sources.length > 0) {
        const candidate = sources
          .map((s) => s.getAttribute('srcset').trim().split(/\s+/)[0])
          .find((u) => /\/m\//.test(u));
        imgUrl = candidate || sources[0].getAttribute('srcset').trim().split(/\s+/)[0];
      }
    }
    if (!imgUrl) {
      const img = a.querySelector('img.atwiki_plugin_image');
      if (img) {
        imgUrl = img.getAttribute('src') || img.src;
      }
    }
    if (!imgUrl) {
      throw new Error('画像URLが取得できませんでした');
    }
    imgUrl = new URL(imgUrl, location.href).href;
    console.log('[AtwikiWikiCopy] imgUrl:', imgUrl);

    const urlObj = new URL(imgUrl);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    console.log('[AtwikiWikiCopy] path parts:', parts);

    const attachIndex = parts.indexOf('attach');
    if (attachIndex === -1 || attachIndex + 1 >= parts.length) {
      throw new Error('attach パスからページIDが取得できませんでした');
    }
    const hoge1 = parts[attachIndex + 1];

      let filename = parts[parts.length - 1];

      // 日本語・ひらがな・漢字ファイル名を復元
      try {
          filename = decodeURIComponent(filename);
      } catch(e) {
          console.warn("[AtwikiWikiCopy] decode filename failed:", filename, e);
      }

      console.log('[AtwikiWikiCopy] hoge1:', hoge1, 'decoded filename:', filename);



    const pageUrl = new URL(`/genlip/pages/${hoge1}.html`, location.origin).href;
    const page = await fetchPageTitle(pageUrl);
    console.log('[AtwikiWikiCopy] page:', page);

    // ③ width
    const imgEl = a.querySelector('img.atwiki_plugin_image');
    let W = null;
    if (imgEl) {
      W = imgEl.getAttribute('width');
      if (!W) {
        const cs = getComputedStyle(imgEl);
        if (cs.width && cs.width.endsWith('px')) {
          W = parseFloat(cs.width);
        } else if (imgEl.width) {
          W = imgEl.width;
        }
      }
    }
    if (!W) {
      throw new Error('画像の width が取得できませんでした');
    }
    W = Math.round(Number(W));
    console.log('[AtwikiWikiCopy] width:', W);

    // ④ wiki記法
    const wikiStr = `&image(${filename},width${W}px,page=${page},linkpage=${linkpage})`;
    console.log('[AtwikiWikiCopy] wikiStr:', wikiStr);

    copyToClipboard(wikiStr);
    showToast('wiki記法をコピーしました');
  }

  function copyToClipboard(text) {
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
        console.log('[AtwikiWikiCopy] GM_setClipboard success');
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        console.log('[AtwikiWikiCopy] fallback copy success');
      }
    } catch (e) {
      console.error('[AtwikiWikiCopy] copyToClipboard error', e);
      alert('クリップボードコピーに失敗しました: ' + e.message);
    }
  }
})();

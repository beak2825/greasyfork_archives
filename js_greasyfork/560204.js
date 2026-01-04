// ==UserScript==
// @name         Qiita記事マークダウンリンク生成
// @version      2025.12.25.0
// @namespace    https://greasyfork.org/ja/users/570127
// @description  Qiita記事へのリンクをMarkdown記法で生成する
// @author       universato
// @match        https://qiita.com/*/items/*
// @match        https://qiita.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qiita.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560204/Qiita%E8%A8%98%E4%BA%8B%E3%83%9E%E3%83%BC%E3%82%AF%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AA%E3%83%B3%E3%82%AF%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560204/Qiita%E8%A8%98%E4%BA%8B%E3%83%9E%E3%83%BC%E3%82%AF%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AA%E3%83%B3%E3%82%AF%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

// fukuchan-sanの動かなくなっていたユーザースクリプトと同じアイディア。
// 何も表示されないのが最大の欠点だけど、わかってる分には使いやすそう。
// Create Linkを使えば良さそうだけど。

// Qiita記事リンク生成 https://greasyfork.org/ja/scripts/397378-qiita記事リンク生成

// JavaScriptでクリップボードにテキストをコピーする - arms inc. Engineers' Blog https://tech.arms-soft.co.jp/entry/2022/07/27/090000
// JavaScriptでクリップボードにテキストをコピーする(Codepen) https://codepen.io/takayo-nakamura/pen/qBoaVza

// さらにキーショートカットでコピーしたり移動できるようにした。
// ログインユーザー名が取得しにくくなってた。

console.log('[Qiita MD] script loaded');

(function () {
  'use strict';

  const ID = 'qiita-md-button';

  function copyMarkdown() {
    const markdown = `[${document.title}](${location.href})`;
    navigator.clipboard.writeText(markdown);
    console.log('[Qiita MD] copied:', markdown);
  }

  function injectMD() {
    // 記事ページのみ
    if (!location.pathname.includes('/items/')) return;

    // 二重挿入防止
    if (document.getElementById(ID)) return;

    // はてなブックマークの <a>
    const hatenaLink = document.querySelector(
      'a[href^="https://b.hatena.ne.jp/entry/"]'
    );
    if (!hatenaLink) return;

    // はてブを包んでいる div.style-3fim88
    const hatenaItem = hatenaLink.closest('div.style-3fim88');
    if (!hatenaItem) return;

    // ===== MD 用の「同列 div」を作る =====
    const mdItem = document.createElement('div');
    mdItem.className = hatenaItem.className; // ← ★完全に同列にする決定打

    const mdButton = document.createElement('button');
    mdButton.id = ID;
    mdButton.textContent = 'MD';

    // Qiita 既存 UI と干渉しない最小スタイル
    mdButton.style.fontSize = '12px';
    mdButton.style.padding = '4px';
    mdButton.style.cursor = 'pointer';

    mdButton.addEventListener('click', copyMarkdown);

    mdItem.appendChild(mdButton);

    // はてブの「直下」に挿入
    hatenaItem.after(mdItem);

    console.log('[Qiita MD] injected under hatena');
  }

  // SPA / React 対策
  const observer = new MutationObserver(injectMD);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectMD();
})();


// Shortcuts to switch version by key
(function() {
  document.addEventListener('keydown', function (event) {
      const paths = location.pathname.split('/');

      const activeTagName = document.activeElement.tagName;
      const in_textarea = ['TEXTAREA', 'INPUT'].includes(activeTagName);
      const invalid_input = event.key.match(/[^mdnps]/);
      if(in_textarea || invalid_input){ return false; }
      if(event.ctrlKey || event.metaKey){ return false; }
      if(paths[2] === 'new' || paths[3] === 'edit'){ return false; }

      if(event.key === 'n'){
        location.href = 'https://qiita.com/drafts/new';
      }else if(event.key.match(/[ds]/)){
          // drafts, 下書き(shitagaki)
          location.href = "https://qiita.com/drafts";
      }else if(event.key.match(/[p]/)){
          // private, 限定公開(gentei kokai)
          // const user_id = document.querySelector('[TODO]');
          // location.href = `https://qiita.com/${user_id}/private`;
      }else if(event.key === 'm'){
        const md_link = `[${document.title}](${location.href})`;
        navigator.clipboard.writeText(md_link);
      }
  }, false);
})();

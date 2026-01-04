// ==UserScript==
// @name         Open2ch 簡易スレタイNG
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  NGワード（コード内に直接表記する）を含むスレッドを非表示に
// @match        https://hayabusa.open2ch.net/livejupiter/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548063/Open2ch%20%E7%B0%A1%E6%98%93%E3%82%B9%E3%83%AC%E3%82%BF%E3%82%A4NG.user.js
// @updateURL https://update.greasyfork.org/scripts/548063/Open2ch%20%E7%B0%A1%E6%98%93%E3%82%B9%E3%83%AC%E3%82%BF%E3%82%A4NG.meta.js
// ==/UserScript==

/*コードはchatgptに書いてもらいました*/



(function () {
  const ngWords = ['NGワード1', 'NGワード2', 'NGワード3'];
    /*      　　　　↑ここに入れたいNGワードを追加する*/

  const MAX_THREADS = 24;

  function cleanThreads() {
    const threads = document.querySelectorAll('div.tlist.thread');
    for (let i = 0; i < Math.min(threads.length, MAX_THREADS); i++) {
      const thread = threads[i];
      const title = thread.getAttribute('title') || '';
      for (const word of ngWords) {
        if (title.includes(word)) {
          thread.style.display = 'none';
          break;
        }
      }
    }
  }

  // 初回ロード時に実行
  cleanThreads();

  // 1. 更新ボタンが押されたときに再実行
  const updateButton = document.querySelector('.threadListUpdateBt');
  if (updateButton) {
    updateButton.addEventListener('click', () => {
      // DOM更新まで少し待ってから再実行
      setTimeout(cleanThreads, 500); // 0.5秒後に再フィルタリング
    });
  }

  // 2. 定期的に実行（念のため）→ 重複を防ぎたいなら外してもOK
  const observer = new MutationObserver(() => {
    cleanThreads();
  });

  const listArea = document.querySelector('#threadList') || document.body;
  if (listArea) {
    observer.observe(listArea, { childList: true, subtree: true });
  }
})();

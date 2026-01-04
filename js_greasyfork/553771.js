// ==UserScript==
// @name          自レス表示変更
// @version       1.0.2
// @description   「自分」バッジの置き換え
// @match         https://mebuki.moe/app
// @match         https://mebuki.moe/app/*
// @grant         none
// @license       MIT
// @namespace     https://greasyfork.org/users/1530927
// @downloadURL https://update.greasyfork.org/scripts/553771/%E8%87%AA%E3%83%AC%E3%82%B9%E8%A1%A8%E7%A4%BA%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/553771/%E8%87%AA%E3%83%AC%E3%82%B9%E8%A1%A8%E7%A4%BA%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 好きな名前を入れてね！
  const MyRessponse = '★俺'; //2B風

  const badgeClass = 'text-destructive font-bold';

  const apply = () => document.querySelectorAll('.message-container').forEach(msg => {
    const originalBadge = msg.querySelector('[data-slot="badge"]');
    const resban = msg.querySelector('.text-destructive');

    //バッジ表示時のみ処理を実行
    if (originalBadge?.textContent.trim() === '自分' && !msg.hasAttribute('data-self-modified')) {

      //追加するレス番の定義
      const newBadge = document.createElement('span');
      newBadge.textContent = MyRessponse;
      newBadge.setAttribute('data-slot', 'badge');
      newBadge.className = badgeClass;

      //挿入位置の分岐
      if (resban) {
        resban.parentNode.insertBefore(newBadge, resban);
      } else {
        originalBadge.parentNode.insertBefore(newBadge, originalBadge);
      }

      //元バッジ削除＋処理済みフラグ
      originalBadge.remove();
      msg.setAttribute('data-self-modified', 'true');
    }
  });

  apply();
  new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
})();

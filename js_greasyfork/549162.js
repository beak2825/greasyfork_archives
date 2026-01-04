// ==UserScript==
// @name              Mortal Mahjong Review Classic UI
// @name:zh-CN        古法 Mortal 麻将牌谱 Classic UI
// @name:zh-TW        古法 Mortal 牌譜 Classic UI
// @description       Automatically switch to Classic UI and enable the "show rating" option in advanced options.
// @description:zh-CN 进入 Mortal 牌谱页面时，自动切换到 Classic UI，并在高级选项中勾选“显示 rating”。
// @description:zh-TW 進入 Mortal 牌譜頁面時，自動切換到 Classic UI，並在高級選項中勾選“顯示 rating”。
// @author            https://greasyfork.org/users/1513976
// @namespace         https://greasyfork.org/users/1513976
// @version           0.1
// @icon              https://mjai.ekyu.moe/favicon-32x32.png
// @match             https://mjai.ekyu.moe/*
// @exclude           *report*
// @run-at            document-idle
// @grant             none
// @license           GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/549162/Mortal%20Mahjong%20Review%20Classic%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/549162/Mortal%20Mahjong%20Review%20Classic%20UI.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX_ATTEMPTS = 60;
  let attempts = 0;
  let doneClassic = false;
  let doneRating = false;

  function setSelectToClassic() {
    const sel = document.querySelector('span#ui select, select[name="ui"]');
    if (!sel) {
      console.log('[mortal] ❌ classic ui');
      return false;
    }

    if (sel.value !== 'classic') {

      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(sel), 'value')?.set;
      if (setter) {
        setter.call(sel, 'classic');
      } else {
        sel.value = 'classic';
      }

      for (const opt of sel.options) {
        opt.selected = (opt.value === 'classic');
      }
    }

    console.log('[mortal] ✅ classic ui');
    return sel.value === 'classic';
  }

  function checkRatingOption() {
    const input = document.querySelector('input[type="checkbox"][name="show-rating"]');
    if (input) {
      if (!input.checked) {
        input.checked = true;
        console.log('[mortal] ✅ show rating');
      }
      return input.checked;
    }
    console.log('[mortal] ❌ show rating');
    return false;
  }

  function attempt() {
    if (attempts++ > MAX_ATTEMPTS) return;

    if (!doneClassic) {
      doneClassic = setSelectToClassic();
    }

    if (!doneRating) {
      doneRating = checkRatingOption();
    }
  }

  // init
  attempt();

  const poll = setInterval(() => {
    attempt();
    if (doneClassic && doneRating) clearInterval(poll);
  }, 500);

  const mo = new MutationObserver(() => {
    attempt();
    if (doneClassic && doneRating) {
      mo.disconnect();
      clearInterval(poll);
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();

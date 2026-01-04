// ==UserScript==
// @name         蛇王争霸：随机选择20人并包含自己
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在/game页面进入时，随机选择20条蛇，并保证包含自己(AAA建材张哥, id=2024201540)
// @author       You
// @match        https://snake.ruc.astralis.icu/game*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548012/%E8%9B%87%E7%8E%8B%E4%BA%89%E9%9C%B8%EF%BC%9A%E9%9A%8F%E6%9C%BA%E9%80%89%E6%8B%A920%E4%BA%BA%E5%B9%B6%E5%8C%85%E5%90%AB%E8%87%AA%E5%B7%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/548012/%E8%9B%87%E7%8E%8B%E4%BA%89%E9%9C%B8%EF%BC%9A%E9%9A%8F%E6%9C%BA%E9%80%89%E6%8B%A920%E4%BA%BA%E5%B9%B6%E5%8C%85%E5%90%AB%E8%87%AA%E5%B7%B1.meta.js
// ==/UserScript==

(function () {
  const SELF_ID = '2024201540';   // 你的蛇id
  const MAX_COUNT = 20;
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  function getOptions() {
    return [...document.querySelectorAll('.snake-option')];
  }
  function isSelected(option) {
    return option.classList.contains('snake-selected');
  }
  function toggle(option) {
    const checkbox = option.querySelector('.select-checkbox');
    if (checkbox) checkbox.click();
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function applySelection() {
    const options = getOptions();
    if (!options.length) return;

    // 找到自己
    const selfOption = options.find(o => o.textContent.includes(SELF_ID));
    if (!selfOption) return;

    // 确保自己选中
    if (!isSelected(selfOption)) {
      toggle(selfOption);
      await wait(100);
    }

    // 随机选择剩余
    const others = options.filter(o => o !== selfOption);
    const shuffled = shuffle([...others]);

    let selected = getOptions().filter(isSelected);

    for (const opt of shuffled) {
      if (selected.length >= MAX_COUNT) break;
      if (!isSelected(opt)) {
        toggle(opt);
        await wait(50);
        selected = getOptions().filter(isSelected);
      }
    }

    // 如果超过20，随机取消多余的（不取消自己）
    selected = getOptions().filter(isSelected);
    while (selected.length > MAX_COUNT) {
      const extra = shuffle(selected.filter(o => !o.textContent.includes(SELF_ID)))[0];
      if (extra) {
        toggle(extra);
        await wait(50);
        selected = getOptions().filter(isSelected);
      } else break;
    }

    console.log(`[AutoSelect-Random] 已随机选择 ${selected.length} 条蛇 (包含自己)`);
  }

  // 多次尝试，保证渲染后执行
  (async () => {
    for (let i = 0; i < 10; i++) {
      await wait(400);
      applySelection();
    }
  })();

  // 监听DOM变化
  const obs = new MutationObserver(() => applySelection());
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();

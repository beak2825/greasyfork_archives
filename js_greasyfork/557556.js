// ==UserScript==
// @name         什么值得买自动取消所有已关注达人
// @namespace    https://zhiyou.smzdm.com/
// @version      1.0
// @description  自动取消所有已关注达人，每页完成后自动刷新继续
// @author       wuzf
// @match        https://zhiyou.smzdm.com/guanzhu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557556/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E6%89%80%E6%9C%89%E5%B7%B2%E5%85%B3%E6%B3%A8%E8%BE%BE%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557556/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E8%87%AA%E5%8A%A8%E5%8F%96%E6%B6%88%E6%89%80%E6%9C%89%E5%B7%B2%E5%85%B3%E6%B3%A8%E8%BE%BE%E4%BA%BA.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const delay = ms => new Promise(r => setTimeout(r, ms));

  console.log("💡 等待“已关注”按钮加载...");

  // 等待按钮加载
  async function waitForButtons() {
    for (let i = 0; i < 40; i++) {
      const btns = [...document.querySelectorAll('span.focus-btn.J_user_focus')];
      if (btns.length > 0) return btns;
      await delay(500);
    }
    return [];
  }

  let buttons = await waitForButtons();
  buttons = buttons.filter(btn => btn.innerText.includes('已关注') || btn.dataset.follow === '2');

  if (buttons.length === 0) {
    console.log('⚠️ 没检测到“已关注”按钮，可能当前页已全部取消。');
    return;
  }

  console.log(`✅ 找到 ${buttons.length} 个已关注达人，开始取消...`);

  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(800);
    btn.click(); // 触发 onclick 逻辑
    console.log(`🧹 已取消关注 ${i + 1}/${buttons.length}`);
    await delay(1500);
  }

  console.log(`🎉 已取消 ${buttons.length} 个达人关注，页面将自动刷新继续...`);

  // 自动刷新当前页面（间隔 3 秒后刷新）
  await delay(3000);
  location.reload();

})();

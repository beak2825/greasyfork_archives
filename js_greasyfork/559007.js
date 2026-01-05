// ==UserScript==
// @name         雲科問卷調查自動隨機填寫（正向選項）
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  頁面載入後，自動為雲科大教學問卷每一題隨機勾選「非常滿意 / 滿意 / 尚可」或「非常同意 / 同意 / 尚可」，並排除所有負向選項
// @author       ChatGPT (OpenAI)
// @match        https://webapp.yuntech.edu.tw/*
// @run-at       document-idle
// @grant        none
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/559007/%E9%9B%B2%E7%A7%91%E5%95%8F%E5%8D%B7%E8%AA%BF%E6%9F%A5%E8%87%AA%E5%8B%95%E9%9A%A8%E6%A9%9F%E5%A1%AB%E5%AF%AB%EF%BC%88%E6%AD%A3%E5%90%91%E9%81%B8%E9%A0%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559007/%E9%9B%B2%E7%A7%91%E5%95%8F%E5%8D%B7%E8%AA%BF%E6%9F%A5%E8%87%AA%E5%8B%95%E9%9A%A8%E6%A9%9F%E5%A1%AB%E5%AF%AB%EF%BC%88%E6%AD%A3%E5%90%91%E9%81%B8%E9%A0%85%EF%BC%89.meta.js
// ==/UserScript==

/*
────────────────────────────────────────────────────────
📌 功能說明
────────────────────────────────────────────────────────
1. 適用於「webapp.yuntech.edu.tw」之教學問卷頁面
2. 自動偵測以下兩個表格：
   - 教學滿意度（Survey_GridView）
   - 學習提升同意度／核心能力（CourCore_GridView）
3. 每一題僅會勾選一個 radio（依 name 分組）
4. 僅隨機選擇「正向／中立」選項：
   ✔ 非常滿意 / 滿意 / 尚可
   ✔ 非常同意 / 同意 / 尚可
5. 明確排除：
   ✘ 不滿意 / 非常不滿意
   ✘ 不同意 / 非常不同意
6. 使用 click() + change 事件，行為接近真人操作
7. 支援 ASP.NET 頁面延遲載入（自動重試）

────────────────────────────────────────────────────────
⚠ 聲明
────────────────────────────────────────────────────────
- 本腳本僅供個人學術研究與技術學習用途
- 請自行評估是否符合校方規定
- 作者不對使用後果負任何責任

────────────────────────────────────────────────────────
📜 授權
────────────────────────────────────────────────────────
Creative Commons Attribution-NonCommercial 4.0
(CC BY-NC 4.0)
https://creativecommons.org/licenses/by-nc/4.0/
────────────────────────────────────────────────────────
*/

(function () {
  'use strict';

  /* 隨機取一個元素 */
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* 勾選 radio（模擬真人） */
  function clickRadio(input) {
    input.click();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* 判斷是否為允許的選項文字 */
  function isAllowedLabel(text) {
    const t = (text || '').trim();

    // 排除負向選項（避免「不滿意」誤中「滿意」）
    if (t.includes('不滿意') || t.includes('不同意')) return false;

    // 允許：滿意 / 同意 / 尚可
    return (
      t.includes('滿意') ||
      t.includes('同意') ||
      t.includes('尚可')
    );
  }

  /* 處理單一表格 */
  function randomFill(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return 0;

    const radios = Array.from(
      table.querySelectorAll('input[type="radio"]')
    );

    // 依 name 分組（一題一組）
    const groups = {};
    for (const r of radios) {
      if (!r.name) continue;
      groups[r.name] ??= [];
      groups[r.name].push(r);
    }

    let filled = 0;

    for (const name in groups) {
      const group = groups[name];

      const candidates = group.filter(r => {
        const label = table.querySelector(
          `label[for="${CSS.escape(r.id)}"]`
        );
        return isAllowedLabel(label?.textContent);
      });

      if (candidates.length === 0) continue;

      clickRadio(pickRandom(candidates));
      filled++;
    }

    return filled;
  }

  /* 主流程 */
  function run() {
    const survey = randomFill('ctl00_MainContent_Survey_GridView');
    const core   = randomFill('ctl00_MainContent_CourCore_GridView');

    console.log(
      `[TM] 問卷已自動填寫：教學滿意度 ${survey} 題，核心能力 ${core} 題`
    );
  }

  /* ASP.NET 頁面延遲載入，最多重試 20 次 */
  let retry = 0;
  const timer = setInterval(() => {
    retry++;
    if (
      document.getElementById('ctl00_MainContent_Survey_GridView') ||
      document.getElementById('ctl00_MainContent_CourCore_GridView') ||
      retry >= 20
    ) {
      clearInterval(timer);
      run();
    }
  }, 300);

})();

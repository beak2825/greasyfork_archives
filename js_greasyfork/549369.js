// ==UserScript==
// @name         AF显示订单每Q收益
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://test.aerospacefever.com/*
// @grant        none
// @description  我也不知道描述写什么
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549369/AF%E6%98%BE%E7%A4%BA%E8%AE%A2%E5%8D%95%E6%AF%8FQ%E6%94%B6%E7%9B%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/549369/AF%E6%98%BE%E7%A4%BA%E8%AE%A2%E5%8D%95%E6%AF%8FQ%E6%94%B6%E7%9B%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function checkAndInsert() {
    const targets = document.querySelectorAll('div.shrink-0.w-64');

    targets.forEach(target => {
                   // 找内部 h1
            const h1 = target.querySelector('h1');
            if (!h1) return;

            const text = h1.textContent.trim();
            if (text === "交付") {
                console.log("跳过: h1=交付");
                return;
            }
            if (text !== "采购") return;


        // 选中所有 li
        const listItems = target.querySelectorAll('ul.w-full.flex.flex-col.gap-2 > li');

        // 获取第一个 li
        const firstLi = listItems[0];
        const firstName = firstLi.querySelector('span:first-child').textContent.trim();
        const firstAmountText = firstLi.querySelector('span.text-primary').textContent.trim();
        const firstAmount = parseInt(firstAmountText.replace(/[^\d]/g, ''), 10);

        console.log(firstName, firstAmount);
        // 输出: "大型运载火箭" 1260768

        // 获取第二个 li
        const secondLi = listItems[1];
        const secondName = secondLi.querySelector('span:first-child').textContent.trim();
        const secondAmountText = secondLi.querySelector('span.text-primary').textContent.trim();
        const secondAmount = parseInt(secondAmountText.replace(/[^\d]/g, ''), 10);

        console.log(secondName, secondAmount);
        // 输出: "重型运载火箭" 1708887


        const spanReward = target.querySelector('span.text-accent');
        const rewardText = spanReward.textContent.trim(); // "$1,260,768"

        // 方法 1：去掉非数字字符
        const reward = parseInt(rewardText.replace(/[^\d]/g, ''), 10);
        console.log(reward); // 1260768

// 方法 2：保留小数点（如果有小数）
// const numberWithDecimal = parseFloat(text.replace(/[^0-9.]/g, ''));
// console.log(numberWithDecimal);

      // 数 li 个数
      const lis = target.querySelectorAll('li.flex.justify-between.items-center.gap-1');
      console.log("当前容器 li 数量:", lis.length);

      // 举例：只有在 li 数量 >= 3 时才插入
      if (lis.length == 2 && !target.querySelector('.tm-added')) {
        const new1Div = document.createElement('div');
        new1Div.className = "w-full flex justify-between items-center tm-added";
        new1Div.innerHTML = `<span>品质奖励</span><span class="text-accent">${firstName} $${parseInt(firstAmount*reward/10000)}/Q</span>`;
        target.insertAdjacentElement("beforeend", new1Div);
        const new2Div = document.createElement('div');
        new2Div.className = "w-full flex justify-between items-center tm-added";
        new2Div.innerHTML = `<span>品质奖励</span><span class="text-accent">${secondName} $${parseInt(secondAmount*reward/10000)}/Q</span>`;
        target.insertAdjacentElement("beforeend", new2Div);
      }

        if (lis.length == 1 && !target.querySelector('.tm-added')) {
        const new1Div = document.createElement('div');
        new1Div.className = "w-full flex justify-between items-center tm-added";
        new1Div.innerHTML = `<span>品质奖励</span><span class="text-accent">${firstName} $${parseInt(firstAmount*reward/10000)}/Q</span>`;
        target.insertAdjacentElement("beforeend", new1Div);

      }
    });
  }

  checkAndInsert();

  const obs = new MutationObserver(() => checkAndInsert());
  obs.observe(document.body, { childList: true, subtree: true });
})();



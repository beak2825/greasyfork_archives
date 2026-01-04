// ==UserScript==
// @name         黑沙成本計算網站翻譯
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  bdoworkshop 網站英文內容漢化
// @author       XIAYUE
// @match        https://bdoworkshop.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bdoworkshop.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560367/%E9%BB%91%E6%B2%99%E6%88%90%E6%9C%AC%E8%A8%88%E7%AE%97%E7%B6%B2%E7%AB%99%E7%BF%BB%E8%AD%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/560367/%E9%BB%91%E6%B2%99%E6%88%90%E6%9C%AC%E8%A8%88%E7%AE%97%E7%B6%B2%E7%AB%99%E7%BF%BB%E8%AD%AF.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const mainKeys = {
    'Sovereign': '君王',
    'Kharazad': '卡拉札德',
    'Fallen God': '死神防具',
    'Blackstar': '黑星',
    'Tuvala weapons/armors': '圖巴拉武器/防具',
    'Preonne accessories': '普利奧納',
    'Manos accessories': '摩諾斯飾品',
    'Manos armors': '摩諾斯衣服',
    'Manos tools': '摩諾斯工具',
    'Edana armor': '艾達尼亞',
    'Deboreka': '德柏雷卡',
  }

  const subKeys = {
    'Mainhand': '主手',
    'Awakening': '覺醒',
    'Offhand': '副手',
  }

  const formKeys = {
    'Cron stone:': '克羅恩種類',
    'Valks fs bonus:': '呼喊數量',
    'Permanent fs bonus:': '基礎層數',
    'Remove fs cost:': '移除層數成本',
    'Starting level': '起始等級',
    'Goal level': '目標等級',
    'Use recommended fs': '使用推薦層數'
  }

  const tableKeys = {
    'Level': '等級',
    'Click': '保護',
    'FS': '層數',
    'Valks': '呼喊',
    '1 click crons': '單次克羅恩',
    'Chance': '幾率',
    'Avg. clicks': '平均突破次數',
    'Pity': '保底次數',
    'Avg. 1 level upgrade cost': '突破1級的成本',
    'Avg. total cost': '平均總花費',
    'Odds to spend more than avg': '超過平均突破次數的機率',
    'Odds to pity': '保底幾率',
  }

  function translateMainSub() {
    const doms = document.querySelectorAll('.items-center .w-60 button');
    if (!doms || doms.length === 0) {
      return;
    }
    const main = [doms[0]];
    replaceExactText(main, mainKeys);
    if (doms.length > 1) {
      const sub = [doms[1]];
      replaceExactText(sub, subKeys);
    }
  }

  function translateForm() {
    let doms = document.querySelectorAll('form .mr-4.w-42.flex-1');
    if (!doms || doms.length === 0) {
      return;
    }
    const fsDom = document.querySelector('form .cursor-pointer.text-blue-500');
    if (fsDom) {
      doms = [...doms, fsDom];
    }
    replaceExactText(doms, formKeys);
  }

  function translateTable() {
    const doms = document.querySelectorAll('table th');
    if (!doms || doms.length === 0) {
      return;
    }
    const realDoms = []
    doms.forEach(item => {
      const span = item.querySelector('span');
      if (span) {
        realDoms.push(span)
      } else {
        realDoms.push(item);
      }
    })
    replaceExactText(realDoms, tableKeys);
  }

  function replaceExactText(doms, replacements) {
    if (!doms || doms.length === 0) return;

    doms.forEach(item => {
      const originalText = item.textContent.trim();

      // 检查是否完全匹配要替换的文本
      if (replacements.hasOwnProperty(originalText)) {
        item.textContent = replacements[originalText];
      }
    });
  }

  function observerFn(dom, func, config1) {
    // 创建观察器实例
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // console.log('变化类型:', mutation.type);
        // console.log('变化的节点:', mutation.target);
        // console.log('新增的节点:', mutation.addedNodes);
        // console.log('移除的节点:', mutation.removedNodes);
        // console.log('属性变化:', mutation.attributeName);
        // console.log('旧值:', mutation.oldValue);
        func(mutation);
      });
    });

    // 配置观察选项
    const config = {
      childList: true,     // 观察子节点的添加/删除
      subtree: true,       // 观察所有后代节点
      attributes: true,    // 观察属性变化
      attributeOldValue: true, // 记录属性旧值
      characterData: true, // 观察文本内容变化
      characterDataOldValue: true, // 记录文本旧值
      attributeFilter: ['class', 'style'], // 只观察特定属性
      ...config1
    };

    // 开始观察
    observer.observe(dom, config);

    // 停止观察
    // observer.disconnect();
  }

  function init() {
    translateMainSub();
    translateForm();
    translateTable();
    observerSelect();
  }

  function observerBody() {
    observerFn(document.querySelector('#app'), () => {
      init()
    }, { subtree: true })
  }

  function observerSelect() {
    const doms = document.querySelectorAll('.items-center .w-60');
    if (!doms || doms.length === 0) {
      return;
    }
    const main = doms[0];
    observerFn(main, (mutation) => {
      if (mutation.addedNodes.length !== 0) {
        const selectDiv = mutation.addedNodes[0];
        const doms = selectDiv.querySelectorAll('.flex-1.text-left');
        replaceExactText(doms, mainKeys);
      }
    }, { subtree: false })
    if (doms.length > 1) {
      const sub = doms[1];
      observerFn(sub, (mutation) => {
        if (mutation.addedNodes.length !== 0) {
          const selectDiv = mutation.addedNodes[0];
          const doms = selectDiv.querySelectorAll('.flex-1.text-left');
          replaceExactText(doms, subKeys);
        }
      }, { subtree: false })
    }
  }

  function checkUrl() {
    let flag = false;
    const currentUrl = new URL(window.location.href);
    if (currentUrl.hostname === 'bdoworkshop.com') {
      if (currentUrl.pathname.includes('/enhancement') || currentUrl.pathname === '/')
        console.log('匹配');
      flag = true;
    }
    return flag;
  }

  if (checkUrl()) {
    setTimeout(() => {
      init();
      observerBody();
    }, 1000);
  }

})();
// ==UserScript==
// @name         おんJ バツポチ修正
// @namespace    onj-ignore-display-fix-preemptive
// @version      2.1
// @license	CC0-1.0
// @description  はよ直せさとる
// @match        https://*.open2ch.net/test/read.cgi/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563746/%E3%81%8A%E3%82%93J%20%E3%83%90%E3%83%84%E3%83%9D%E3%83%81%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/563746/%E3%81%8A%E3%82%93J%20%E3%83%90%E3%83%84%E3%83%9D%E3%83%81%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    dl[ignored="1"] {
      display: none !important;
    }
  `;
  function injectStyle() {
    const target = document.head || document.documentElement;
    if (target && !target.querySelector('style[data-ignore-fix]')) {
      style.setAttribute('data-ignore-fix', 'true');
      target.appendChild(style);
    }
  }
  injectStyle();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyle);
  }
  function applyIgnoreFixSync(root = document) {
    const ignoredElements = root.querySelectorAll('dl[ignored="1"]');
    ignoredElements.forEach(dl => {
      dl.style.display = 'none';
    });
    return ignoredElements.length;
  } 
  function initIgnoreFix() {
    const count = applyIgnoreFixSync();
    console.log(`バツポチ初期処理: ${count}件のレスを非表示化`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIgnoreFix);
  } else {
    initIgnoreFix();
  }
  function startObserver() {
    const targetNode = document.querySelector('.thread') || document.body;
    
    const observer = new MutationObserver(mutations => {
      let fixedCount = 0;
      
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.matches && node.matches('dl[ignored="1"]')) {
            node.style.display = 'none';
            fixedCount++;
          }
          if (node.querySelectorAll) {
            const ignoredChildren = node.querySelectorAll('dl[ignored="1"]');
            ignoredChildren.forEach(dl => {
              dl.style.display = 'none';
              fixedCount++;
            });
          }
        }
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'ignored' &&
            mutation.target.getAttribute('ignored') === '1') {
          mutation.target.style.display = 'none';
          fixedCount++;
        }
      }
      
      if (fixedCount > 0) {
        console.log(`バツポチ動的処理: ${fixedCount}件のレスを非表示化`);
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['ignored'] 
    });

    console.log('バツポチMutationObserver 開始');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
  setInterval(() => {
    const count = applyIgnoreFixSync();
    if (count > 0) {
      console.log(`バツポチ定期補正: ${count}件のレスを非表示化`);
    }
  }, 1000);

  console.log('バツポチ初期化完了（表示前抑制モード）');
})();
 
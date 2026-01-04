// ==UserScript==
// @name         解鎖圖片右鍵與選取（全站版，可 per-domain 關閉）
// @namespace    https://greasyfork.org/users/1237813-abc0922001
// @version      1.1.0
// @description  解除各站 IMG 的 oncontextmenu/onmousedown/onselectstart/ondragstart 等攔截，恢復右鍵、選取、拖曳；支援 per-domain 開關與 file://。
// @author       abc0922001
// @match        *://*/*
// @match        file:///*
// @run-at       document-start
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552362/%E8%A7%A3%E9%8E%96%E5%9C%96%E7%89%87%E5%8F%B3%E9%8D%B5%E8%88%87%E9%81%B8%E5%8F%96%EF%BC%88%E5%85%A8%E7%AB%99%E7%89%88%EF%BC%8C%E5%8F%AF%20per-domain%20%E9%97%9C%E9%96%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552362/%E8%A7%A3%E9%8E%96%E5%9C%96%E7%89%87%E5%8F%B3%E9%8D%B5%E8%88%87%E9%81%B8%E5%8F%96%EF%BC%88%E5%85%A8%E7%AB%99%E7%89%88%EF%BC%8C%E5%8F%AF%20per-domain%20%E9%97%9C%E9%96%89%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEY = 'unlock_img_rightclick.disabled_domains';
  const ATTRS = ['oncontextmenu','onmousedown','onselectstart','ondragstart'];
  const domain = location.hostname || 'file';

  const getSet = async () => new Set(JSON.parse(await GM_getValue(KEY, '[]')));
  const saveSet = async (set) => GM_setValue(KEY, JSON.stringify([...set]));

  // Menu: toggle current domain
  (async () => {
    const disabled = await getSet();
    const isDisabled = disabled.has(domain);
    GM_registerMenuCommand(
      `${isDisabled ? '啟用' : '停用'} 此網域：${domain}`,
      async () => {
        if (isDisabled) disabled.delete(domain);
        else disabled.add(domain);
        await saveSet(disabled);
        location.reload();
      }
    );
    GM_registerMenuCommand('查看已停用網域', async () => {
      const list = [...await getSet()].sort().join('\n') || '(無)';
      alert(list);
    });
    GM_registerMenuCommand('清空停用清單', async () => {
      if (confirm('確定清空所有停用網域？')) await saveSet(new Set());
      location.reload();
    });
    if (isDisabled) return; // do nothing on disabled domains
    init();
  })();

  function init() {
    // CSS：恢復拖曳/選取與指針事件
    GM_addStyle(`
      img { -webkit-user-drag: auto !important; user-select: auto !important; }
      img, picture, figure { pointer-events: auto !important; }
    `);

    // 捕獲階段阻擋站方攔截器（不阻止預設行為）
    ['contextmenu','mousedown','selectstart','dragstart'].forEach(type => {
      document.addEventListener(type, ev => {
        if (ev.target instanceof HTMLImageElement) {
          ev.stopImmediatePropagation(); // 擋站方處理器
          // 不呼叫 preventDefault()，保留瀏覽器右鍵
        }
      }, true);
    });

    const cleanNode = (node) => {
      if (!(node instanceof Element)) return;
      if (node instanceof HTMLImageElement || ATTRS.some(a => node.hasAttribute(a))) {
        for (const a of ATTRS) {
          if (node.hasAttribute(a)) node.removeAttribute(a);
          try { node[a] = null; } catch {}
        }
        if (node instanceof HTMLImageElement) {
          node.style.userSelect = 'auto';
          node.style.webkitUserDrag = 'auto';
        }
      }
    };

    const scan = (root) => {
      cleanNode(root);
      root.querySelectorAll?.('img,[oncontextmenu],[onmousedown],[onselectstart],[ondragstart]')
        .forEach(cleanNode);
    };

    const mo = new MutationObserver(muts => {
      for (const m of muts) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(scan);
        } else if (m.type === 'attributes') {
          cleanNode(m.target);
        }
      }
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ATTRS
    });

    if (document.readyState !== 'loading') scan(document);
    else document.addEventListener('DOMContentLoaded', () => scan(document));
  }
})();

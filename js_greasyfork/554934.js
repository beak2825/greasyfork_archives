// ==UserScript==
// @name         网页查找替换增强
// @namespace    http://tampermonkey.local/
// @version      1.6
// @description  Ctrl+F 呼出查找替换面板，支持高亮、逐项替换、全部替换、撤回上一次替换操作（单个或全部）、快捷键Enter替换全部、Ctrl+Enter替换当前、Ctrl+Z撤回
// @author       akers
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554934/%E7%BD%91%E9%A1%B5%E6%9F%A5%E6%89%BE%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554934/%E7%BD%91%E9%A1%B5%E6%9F%A5%E6%89%BE%E6%9B%BF%E6%8D%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- 配置 ----
  const HIGH_LIGHT_CLASS = 'tm-text-replace-hit';
  const PANEL_ID = 'tmTextReplacePanel';

  // ---- 样式 ----
  const style = document.createElement('style');
  style.textContent = `
    .${HIGH_LIGHT_CLASS} {
      background: yellow;
      color: black;
      border-radius: 2px;
      padding: 0 2px;
    }
    .${HIGH_LIGHT_CLASS}.tr-current {
      outline: 2px solid orange;
      box-shadow: 0 0 6px rgba(255,165,0,0.6);
    }
    #${PANEL_ID} input, #${PANEL_ID} button { font-size:12px; }
  `;
  document.head.appendChild(style);

  // ---- 工具 ----
  function isInEditable(evt) {
    const active = document.activeElement;
    if (!active) return false;
    const tag = active.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    if (active.isContentEditable) return true;
    return false;
  }

  // ---- 全局状态 ----
  let hits = [];
  let currentIndex = -1;
  let ignoreObserver = false;
  let undoStack = []; // 每次替换操作存一条记录（单个或全部）

  // ---- UI ----
  function createPanel() {
    if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
    const container = document.createElement('div');
    container.id = PANEL_ID;
    container.style = `
      position: fixed;
      top: 1%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      background: #fff;
      color: #000;
      border: 1px solid #ddd;
      padding: 10px;
      width: 360px;
      font-family: Arial, sans-serif;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    `;
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
        <strong>查找替换</strong>
        <div>
          <label style="font-size:12px;margin-right:6px;"><input type="checkbox" id="trCase"> 区分大小写</label>
          <button id="trClose" title="关闭" style="margin-left:6px;">✖</button>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:6px;">
        <input id="trFind" placeholder="查找内容" style="flex:1;padding:6px;">
        <input id="trReplace" placeholder="替换为" style="width:120px;padding:6px;">
      </div>
      <div style="display:flex;gap:6px;justify-content:flex-end;">
        <button id="trPrev">上一个</button>
        <button id="trNext">下一个</button>
        <button id="trReplaceOne">替换</button>
        <button id="trReplaceAll">全部替换</button>
        <button id="trUndo">撤回</button>
      </div>
      <div style="margin-top:6px;font-size:12px;color:#666;display:flex;justify-content:space-between;align-items:center;">
        <span id="trStatus">匹配: 0</span>
      </div>
    `;
    document.body.appendChild(container);

    container.querySelector('#trClose').onclick = () => { container.remove(); removeHighlights(); };

    return container;
  }

  // ---- 清理高亮 ----
  function removeHighlights() {
    if (!hits.length) return;
    ignoreObserver = true;
    for (const el of hits) {
      const parent = el.parentNode;
      if (!parent) continue;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize && parent.normalize();
    }
    hits = [];
    currentIndex = -1;
    ignoreObserver = false;
    updateStatus();
  }

  // ---- 单节点高亮 ----
  function highlightInTextNode(textNode, regex) {
    const text = textNode.nodeValue;
    let match, lastIndex = 0;
    const docFrag = document.createDocumentFragment();
    let any = false;

    while ((match = regex.exec(text)) !== null) {
      any = true;
      const start = match.index;
      const end = start + match[0].length;
      if (start > lastIndex) docFrag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      const sp = document.createElement('span');
      sp.className = HIGH_LIGHT_CLASS;
      sp.textContent = text.slice(start, end);
      sp.setAttribute('title', '查找匹配');
      docFrag.appendChild(sp);
      lastIndex = end;
      if (regex.lastIndex === match.index) regex.lastIndex++;
    }
    if (!any) return null;
    if (lastIndex < text.length) docFrag.appendChild(document.createTextNode(text.slice(lastIndex)));
    return docFrag;
  }

  // ---- 遍历并高亮 ----
  function doHighlight(findText, caseSensitive = false) {
    removeHighlights();
    if (!findText) return;
    const esc = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(esc, flags);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (!tag) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (parent.isContentEditable) return NodeFilter.FILTER_REJECT;
        if (parent.closest && parent.closest('input,textarea')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodesToReplace = [];
    while (walker.nextNode()) nodesToReplace.push(walker.currentNode);

    ignoreObserver = true;
    try {
      for (const tnode of nodesToReplace) {
        const frag = highlightInTextNode(tnode, regex);
        if (frag) tnode.parentNode.replaceChild(frag, tnode);
      }
      hits = Array.from(document.querySelectorAll('span.' + HIGH_LIGHT_CLASS));
      hits.forEach((el, idx) => { el.onclick = (e) => { e.stopPropagation(); setCurrent(idx, true); }; });
    } finally { ignoreObserver = false; }

    if (hits.length) setCurrent(0, true);
    updateStatus();
  }

  function updateStatus() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const stat = panel.querySelector('#trStatus');
    stat.textContent = `匹配: ${hits.length}  当前: ${currentIndex >= 0 ? (currentIndex + 1) : 0}`;
  }

  function setCurrent(index, scroll = true) {
    if (!hits.length) { currentIndex = -1; updateStatus(); return; }
    if (index < 0) index = hits.length - 1;
    if (index >= hits.length) index = 0;
    if (currentIndex >= 0 && hits[currentIndex]) hits[currentIndex].classList.remove('tr-current');
    currentIndex = index;
    const el = hits[currentIndex];
    if (!el) return;
    el.classList.add('tr-current');
    if (scroll) try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){el.scrollIntoView();}
    updateStatus();
  }

  // ---- 替换 ----
  function replaceCurrent(replaceText) {
    if (!hits.length || currentIndex < 0) return;
    const cur = hits[currentIndex];
    const parent = cur.parentNode;
    if (!parent) return;
    ignoreObserver = true;
    undoStack.push({ type:'replaceOne', items:[{ parent, originalText: cur.textContent, index: Array.prototype.indexOf.call(parent.childNodes, cur) }] });
    parent.replaceChild(document.createTextNode(replaceText), cur);
    parent.normalize && parent.normalize();
    ignoreObserver = false;
    doHighlight(document.getElementById(PANEL_ID).querySelector('#trFind').value, document.getElementById(PANEL_ID).querySelector('#trCase').checked);
  }

  function replaceAll(replaceText) {
    if (!hits.length) return;
    ignoreObserver = true;
    const items = hits.map(el => ({ parent: el.parentNode, originalText: el.textContent, index: Array.prototype.indexOf.call(el.parentNode.childNodes, el) }));
    undoStack.push({ type:'replaceAll', items });
    for (let i = hits.length - 1; i >= 0; i--) {
      const el = hits[i];
      const parent = el.parentNode;
      if (!parent) continue;
      parent.replaceChild(document.createTextNode(replaceText), el);
      parent.normalize && parent.normalize();
    }
    ignoreObserver = false;
    hits = [];
    currentIndex = -1;
    updateStatus();
  }

  function undoLast() {
    if (!undoStack.length) return;
    ignoreObserver = true;
    const op = undoStack.pop();
    for (const it of op.items) {
      const textNode = document.createTextNode(it.originalText);
      const parent = it.parent;
      if (parent.childNodes[it.index]) parent.insertBefore(textNode, parent.childNodes[it.index]);
      else parent.appendChild(textNode);
      parent.normalize && parent.normalize();
    }
    ignoreObserver = false;
    const panel = document.getElementById(PANEL_ID);
    if (panel && panel.querySelector('#trFind').value) {
      doHighlight(panel.querySelector('#trFind').value, panel.querySelector('#trCase').checked);
    }
  }

  function bindPanelEvents(panel) {
    const findInput = panel.querySelector('#trFind');
    const replaceInput = panel.querySelector('#trReplace');
    const nextBtn = panel.querySelector('#trNext');
    const prevBtn = panel.querySelector('#trPrev');
    const repOneBtn = panel.querySelector('#trReplaceOne');
    const repAllBtn = panel.querySelector('#trReplaceAll');
    const undoBtn = panel.querySelector('#trUndo');
    const caseChk = panel.querySelector('#trCase');

    let tmr = null;
    findInput.addEventListener('input', () => {
      clearTimeout(tmr);
      tmr = setTimeout(() => doHighlight(findInput.value, caseChk.checked), 250);
    });

    findInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.ctrlKey) replaceCurrent(replaceInput.value); // Ctrl+Enter 替换当前
        else replaceAll(replaceInput.value);              // Enter 替换全部
      }
    });
    replaceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.ctrlKey) replaceCurrent(replaceInput.value);
        else replaceAll(replaceInput.value);
      }
    });

    nextBtn.onclick = () => { if (hits.length) setCurrent(currentIndex+1); };
    prevBtn.onclick = () => { if (hits.length) setCurrent(currentIndex-1); };
    repOneBtn.onclick = () => replaceCurrent(replaceInput.value);
    repAllBtn.onclick = () => replaceAll(replaceInput.value);
    undoBtn.onclick = () => undoLast();
  }

  function openPanelAndFocus() {
    const panel = createPanel();
    const findInput = panel.querySelector('#trFind');
    findInput.focus();
    return panel;
  }

  // ---- 全局快捷键 ----
  window.addEventListener('keydown', function(e){
    const panel = document.getElementById(PANEL_ID);
    // Esc 关闭面板
    if (e.key==='Escape' && panel){
        e.preventDefault();
        panel.remove();
        removeHighlights();
        return;
    }

    // Ctrl+F 打开面板
    if (!isInEditable(e) && e.ctrlKey && e.key.toLowerCase()==='f'){
        e.preventDefault();
        if (panel) panel.querySelector('#trFind').focus();
        else {
            const newPanel = openPanelAndFocus();
            bindPanelEvents(newPanel);
        }
    }

    // Ctrl+Z 撤回
    if (!isInEditable(e) && e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undoLast();
    }
  });

  // ---- 页面变动监控 ----
  const observer = new MutationObserver(mutations => {
    if (ignoreObserver) return;
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const findInput = panel.querySelector('#trFind');
    if (findInput && findInput.value) {
      if (window.__tm_tr_debounce) clearTimeout(window.__tm_tr_debounce);
      window.__tm_tr_debounce = setTimeout(() => doHighlight(findInput.value, panel.querySelector('#trCase').checked), 300);
    }
  });
  observer.observe(document.body, { childList:true, subtree:true, characterData:true });
  window.addEventListener('beforeunload', ()=>removeHighlights());
})();

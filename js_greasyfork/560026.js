// ==UserScript==
// @name         Bloomberg Latest 高亮+智能隐藏（改进版）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在 Bloomberg /latest 页面高亮关键词（红底白字），并能智能隐藏不含关键词的条目（不依赖固定类名）
// @match        https://www.bloomberg.com/latest*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560026/Bloomberg%20Latest%20%E9%AB%98%E4%BA%AE%2B%E6%99%BA%E8%83%BD%E9%9A%90%E8%97%8F%EF%BC%88%E6%94%B9%E8%BF%9B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560026/Bloomberg%20Latest%20%E9%AB%98%E4%BA%AE%2B%E6%99%BA%E8%83%BD%E9%9A%90%E8%97%8F%EF%BC%88%E6%94%B9%E8%BF%9B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ================= 配置 =================
  const DEFAULT_KEYWORDS = [
  "China", "Chinese", "PRC", "Beijing", "Shanghai", "Shenzhen", "Hong Kong", "Macau",
  "PBOC", "yuan", "renminbi", "RMB", "CNY", "Chinese economy", "Chinese stocks",
  "Alibaba", "Tencent", "Baidu", "JD.com", "ByteDance", "TikTok", "Douyin", "Huawei",
  "Xiaomi", "BYD", "NIO", "Xpeng", "Li Auto", "Geely", "CATL",
  "US-China", "Sino-US", "Sino-Japan", "Sino-Europe", "Belt and Road", "BRI", "Silk Road",
  "Taiwan", "South China Sea"
];;
  const DEFAULT_CASE_SENSITIVE = false;
  const DEFAULT_WHOLE_WORD = false;
  const DEBUG = false; // 设为 true 可在控制台看到检测信息

  // ================ 样式（红底白字） =================
  GM_addStyle(`
    mark.tm-bloom-hl {
      background-color: red !important;
      color: white !important;
      font-weight: bold;
      padding: 0 .08em;
      border-radius: .12em;
    }
    .tm-bloom-panel {
      position: fixed; right: 16px; bottom: 16px; z-index: 9999999;
      font: 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial;
      background: rgba(0,0,0,.65); color: #fff; padding: 8px 10px; border-radius: 10px;
      backdrop-filter: saturate(150%) blur(4px);
      cursor: default; user-select: none;
    }
    .tm-bloom-panel button.btn{
      all: unset; background: rgba(255,255,255,.12); padding: 4px 8px; border-radius: 8px; margin-top:4px;
    }
    .tm-bloom-panel button.btn:hover{ background: rgba(255,255,255,.22); }
  `);

  // ================ 存储辅助 =================
  const read = (k, d) => GM_getValue(k, d);
  const write = (k, v) => GM_setValue(k, v);
  const state = {
    get keywords() { return read('keywords', DEFAULT_KEYWORDS); },
    set keywords(v) { write('keywords', v); },
    get caseSensitive() { return read('caseSensitive', DEFAULT_CASE_SENSITIVE); },
    set caseSensitive(v) { write('caseSensitive', v); },
    get wholeWord() { return read('wholeWord', DEFAULT_WHOLE_WORD); },
    set wholeWord(v) { write('wholeWord', v); },
  };

  // ================ 高亮逻辑 =================
  const escapeReg = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function buildRegex(words, whole, caseSensitive) {
    const valid = (words || []).map(w => w && String(w).trim()).filter(Boolean);
    if (!valid.length) return null;
    const body = valid.map(escapeReg).join('|');
    const boundary = whole ? '(?<!\\w)(' + body + ')(?!\\w)' : '(' + body + ')';
    try {
      return new RegExp(boundary, caseSensitive ? 'g' : 'gi');
    } catch (e) {
      console.error('构建关键词正则失败', e);
      return null;
    }
  }

  function shouldSkipElement(el) {
    if (!el || !(el instanceof Element)) return true;
    const SKIP = new Set(['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA','INPUT','SELECT','META','LINK']);
    if (SKIP.has(el.tagName)) return true;
    if (el.closest && el.closest('mark.tm-bloom-hl')) return true;
    const cs = getComputedStyle(el);
    if (!cs || cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return true;
    return false;
  }

  function highlightInTextNode(textNode, regex) {
    const text = textNode.nodeValue;
    if (!text || !regex.test(text)) return;
    regex.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const mark = document.createElement('mark');
      mark.className = 'tm-bloom-hl';
      mark.textContent = m[0];
      frag.appendChild(mark);
      last = regex.lastIndex;
      if (regex.lastIndex === m.index) regex.lastIndex++;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
  }

  function walkAndHighlight(root, regex) {
    if (!root || !regex) return;
    const walkerFilter = {
      acceptNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;
          if (shouldSkipElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    };
    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, walkerFilter, false);
      let n;
      while ((n = walker.nextNode())) {
        if (n.nodeType === Node.TEXT_NODE) highlightInTextNode(n, regex);
      }
    } catch (e) {
      // 兜底：如果 TreeWalker 出错，使用简单遍历
      const textNodes = Array.from(root.querySelectorAll('*')).flatMap(el => Array.from(el.childNodes).filter(nd => nd.nodeType === Node.TEXT_NODE));
      textNodes.forEach(tn => {
        if (tn.parentElement && !shouldSkipElement(tn.parentElement) && regex.test(tn.nodeValue)) highlightInTextNode(tn, regex);
      });
    }
  }

  let compiled = null;
  function compile() { compiled = buildRegex(state.keywords, state.wholeWord, state.caseSensitive); }

  function getMainRoot() {
    return document.querySelector('main, [role="main"]') || document.body;
  }

  function clearHighlights() {
    document.querySelectorAll('mark.tm-bloom-hl').forEach(m => {
      const p = m.parentNode;
      if (!p) return;
      p.replaceChild(document.createTextNode(m.textContent || ''), m);
      p.normalize();
    });
  }

  // ================ 智能识别条目 & 隐藏逻辑 =================
  let hideMode = false;
  let lastDetectedCount = 0;

  // heuristics: 在 main 内寻找可能的“条目”元素（含链接、文本量大、有重复的同种兄弟）
  function findStoryCandidates(root) {
    root = root || getMainRoot();
    const all = Array.from(root.querySelectorAll('*'));
    const candidates = [];
    for (const el of all) {
      try {
        if (shouldSkipElement(el)) continue;
        // 必须包含至少一个链接（新闻条目通常包含跳转）
        if (el.querySelectorAll('a').length === 0) continue;
        const txt = (el.innerText || '').trim();
        if (txt.length < 30) continue; // 文本太短的不是完整条目
        // 父容器中需存在多个相似标签（表示这是个列表项结构）
        const parent = el.parentElement;
        if (!parent) continue;
        const siblings = Array.from(parent.children).filter(c => c.tagName === el.tagName);
        if (siblings.length < 2) continue;
        // 过滤掉过深/过大的容器（一般条目不会占满整页）
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        candidates.push(el);
      } catch (e) { /* ignore */ }
    }
    // 去重并返回
    return candidates.filter((v,i,a)=>a.indexOf(v)===i);
  }

  // 应用隐藏（基于自动识别到的候选节点集合）
  function applyHide() {
    const root = getMainRoot();
    if (!root) return;
    const candidates = findStoryCandidates(root);
    if (DEBUG) console.log('[tm-bloom] detect candidates:', candidates.length);
    lastDetectedCount = candidates.length;

    // 如果检测到候选项数量较少，尝试一个更宽松的检测（直接使用 root 的直接子项）
    let items = candidates;
    if (items.length < 3) {
      items = Array.from(root.children).filter(ch => (ch.querySelector && ch.querySelector('a')) || (ch.innerText && ch.innerText.length > 120));
    }

    // 最终若还是太少，作为最后手段：在 root 中查找所有包含链接并且文本长度>60的元素，且排除过小元素
    if (items.length < 3) {
      items = Array.from(root.querySelectorAll('*')).filter(el => {
        try {
          if (shouldSkipElement(el)) return false;
          if ((el.querySelectorAll && el.querySelectorAll('a').length === 0)) return false;
          const txt = (el.innerText||'').trim();
          if (txt.length < 60) return false;
          const rect = el.getBoundingClientRect();
          if (!rect || (rect.width < 20 && rect.height < 20)) return false;
          return true;
        } catch (e) { return false; }
      });
    }

    // 最后去重与限制数量（避免把 body 全部当作条目）
    const filtered = items.filter((v,i,a)=>a.indexOf(v)===i).slice(0, 500);

    // 执行显示/隐藏
    filtered.forEach(item => {
      try {
        if (hideMode) {
          // 若该条目内没有高亮元素，则隐藏
          if (!item.querySelector('mark.tm-bloom-hl')) item.style.display = 'none';
          else item.style.display = '';
        } else {
          // 恢复显示（清理 style.display）
          if (item.style && item.style.display === 'none') item.style.display = '';
        }
      } catch (e) {}
    });

    if (DEBUG) console.log('[tm-bloom] applyHide done. items checked:', filtered.length, 'hideMode=', hideMode);
  }

  function toggleHideNonMatch() {
    hideMode = !hideMode;
    if (DEBUG) console.log('[tm-bloom] hideMode toggled ->', hideMode);
    if (hideMode) {
      // 先确保已有高亮，再隐藏
      process();
      setTimeout(applyHide, 150);
    } else {
      // 取消隐藏：恢复 display 并再处理高亮（以防某些节点被替换）
      const root = getMainRoot();
      Array.from(root.querySelectorAll('*')).forEach(el => {
        if (el.style && el.style.display === 'none') el.style.display = '';
      });
      // 重新高亮（可选）
      clearHighlights();
      compile();
      process();
    }
    updatePanel();
  }

  // ================ 主流程调度（节流） =================
  let compiledRegex = null;
  function process() {
    if (!compiled) compile();
    compiledRegex = compiled;
    const root = getMainRoot();
    if (!compiledRegex || !root) return;
    walkAndHighlight(root, compiledRegex);
    if (hideMode) {
      // 延迟隐藏以确保高亮元素被插入 DOM
      setTimeout(applyHide, 120);
    }
  }

  // 节流的mutation observer
  let scheduled = false;
  const scheduleProcess = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => { scheduled = false; process(); }, 160);
  };
  const mo = new MutationObserver(scheduleProcess);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 滚动也触发一次（防止懒加载）
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScroll > 700) {
      lastScroll = now;
      scheduleProcess();
    }
  }, { passive: true });

  // ================ 面板与交互 =================
  const panel = document.createElement('div');
  panel.className = 'tm-bloom-panel';
  document.documentElement.appendChild(panel);

  function updatePanel() {
    panel.innerHTML = `
      <div><b>Bloomberg 高亮</b></div>
      <div style="max-width:240px;word-break:break-word;">关键词：${state.keywords.length ? state.keywords.join(', ') : '(无)'}</div>
      <div>大小写敏感：${state.caseSensitive ? '开' : '关'} | 整词匹配：${state.wholeWord ? '开' : '关'}</div>
      <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn" data-act="edit">编辑</button>
        <button class="btn" data-act="case">大小写</button>
        <button class="btn" data-act="whole">整词</button>
        <button class="btn" data-act="clear">清除</button>
        <button class="btn" data-act="hide">${hideMode ? '显示全部' : '隐藏非关键词'}</button>
        <button class="btn" data-act="recheck">重新检测</button>
      </div>
    `;
  }

  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('button.btn');
    if (!btn) return;
    const act = btn.getAttribute('data-act');
    if (act === 'edit') {
      const current = state.keywords.join(', ');
      const input = prompt('请输入关键词（逗号分隔）:', current);
      if (input !== null) {
        state.keywords = input.split(',').map(s => s.trim()).filter(Boolean);
        compile(); clearHighlights(); process(); updatePanel();
      }
    } else if (act === 'case') {
      state.caseSensitive = !state.caseSensitive;
      compile(); clearHighlights(); process(); updatePanel();
    } else if (act === 'whole') {
      state.wholeWord = !state.wholeWord;
      compile(); clearHighlights(); process(); updatePanel();
    } else if (act === 'clear') {
      clearHighlights(); updatePanel();
    } else if (act === 'hide') {
      toggleHideNonMatch();
    } else if (act === 'recheck') {
      // 手动强制重新运行识别 & 隐藏
      clearHighlights(); compile(); process(); if (hideMode) applyHide(); updatePanel();
      alert('已重新检测页面结构并应用隐藏（若启用）');
    }
  });

  GM_registerMenuCommand('编辑关键词', () => {
    const current = state.keywords.join(', ');
    const input = prompt('请输入关键词（逗号分隔）:', current);
    if (input !== null) { state.keywords = input.split(',').map(s => s.trim()).filter(Boolean); compile(); clearHighlights(); process(); updatePanel(); }
  });

  // ================ 启动 =================
  compile();
  process();
  updatePanel();
  // 兜底再次运行
  setTimeout(process, 500);
  setTimeout(process, 1500);

  if (DEBUG) console.log('[tm-bloom] script started');
})();

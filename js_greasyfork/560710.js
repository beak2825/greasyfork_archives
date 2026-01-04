// ==UserScript==
// @name         Auto Magnet Linker + Copy + Trackers
// @namespace    https://www.hacg.icu
// @version      1.1.1
// @description  把页面中 40 位十六进制哈希识别为 magnet:?xt=urn:btih:HASH，并提供可选 tracker 和复制按钮（支持动态加载）
// @author       you
// @match        *://*.hacg.icu/*
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560710/Auto%20Magnet%20Linker%20%2B%20Copy%20%2B%20Trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/560710/Auto%20Magnet%20Linker%20%2B%20Copy%20%2B%20Trackers.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 配置区 ==========
  // 白名单域名（留空表示全站生效）。示例: ['greasyfork.org','example.com']
  const WHITELIST_DOMAINS = []; // [] 代表不限制

  // 可选 trackers（如果不想用可留空数组）
  const TRACKERS = [
    // 示例 trackers：
    // 'udp://tracker.openbittorrent.com:80/announce',
    // 'udp://tracker.opentrackr.org:1337/announce'
  ];

  // 是否在生成的链接里把 hash 转成大写（多数客户端兼容）
  const UPPERCASE_HASH = true;

  // 匹配 SHA-1（40 hex）

    const HEX40_RE = /(?<![a-fA-F0-9])([a-fA-F0-9]{40})(?![a-fA-F0-9])/g;
    const B32_32_RE = /(?<![A-Z2-7])([A-Z2-7]{32})(?![A-Z2-7])/gi;

  // 跳过这些标签中的文本
  const SKIP_TAGS = new Set(['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED']);

  // 防止重复处理的标记属性
  const MARK_ATTR = 'data-magnetified-v1';

  // ========== 内部函数 ==========
  function domainAllowed() {
    if (!WHITELIST_DOMAINS || WHITELIST_DOMAINS.length === 0) return true;
    const host = location.hostname || '';
    return WHITELIST_DOMAINS.some(d => host.endsWith(d));
  }

    function buildMagnet(id) {
        // id 可能是 40hex 或 32base32
        const raw = (id || '').trim();
        const h = UPPERCASE_HASH ? raw.toUpperCase() : raw;

        let magnet = `magnet:?xt=urn:btih:${h}`;
        if (TRACKERS && TRACKERS.length) {
            for (const tr of TRACKERS) magnet += `&tr=${encodeURIComponent(tr)}`;
        }
        return magnet;
    }

  function makeCopyButton(magnetLink) {
    // small inline button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '📋';
    btn.title = '复制磁力链接';
    btn.style.marginLeft = '6px';
    btn.style.border = 'none';
    btn.style.background = 'transparent';
    btn.style.cursor = 'pointer';
    btn.style.padding = '0';
    btn.style.fontSize = '0.9em';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      copyToClipboard(magnetLink);
      // 简单反馈（局部）
      const old = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => btn.textContent = old, 900);
    });
    return btn;
  }

  async function copyToClipboard(text) {
    // 优先 GM_setClipboard（Tampermonkey/Greasemonkey），否则 navigator.clipboard
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text);
        return;
      }
    } catch (_) { /* ignore */ }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (_) { /* fallthrough */ }
    }

    // fallback: create temporary textarea
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.warn('复制失败', e);
    }
    document.body.removeChild(ta);
  }

function processTextNode(textNode) {
  const text = textNode.nodeValue;
  if (!text) return;

  // 快速判定：两种都不命中就返回
  HEX40_RE.lastIndex = 0;
  B32_32_RE.lastIndex = 0;
  if (!HEX40_RE.test(text) && !B32_32_RE.test(text)) return;

  const parent = textNode.parentNode;
  if (!parent || parent.nodeType !== 1) return;
  if (SKIP_TAGS.has(parent.tagName)) return;
  if (parent.closest(`[${MARK_ATTR}]`)) return;
  if (parent.isContentEditable) return;

  // 收集所有命中（按位置排序），再做一次性替换
  const hits = [];
  HEX40_RE.lastIndex = 0;
  B32_32_RE.lastIndex = 0;

  let m;
  while ((m = HEX40_RE.exec(text)) !== null) {
    hits.push({ start: m.index, end: m.index + m[0].length, id: m[1] });
  }
  while ((m = B32_32_RE.exec(text)) !== null) {
    hits.push({ start: m.index, end: m.index + m[0].length, id: m[1] });
  }
  if (!hits.length) return;

  hits.sort((a, b) => a.start - b.start);

  const frag = document.createDocumentFragment();
  let lastIndex = 0;

  for (const h of hits) {
    if (h.start < lastIndex) continue; // 防重叠/重复命中

    if (h.start > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, h.start)));
    }

    const magnet = buildMagnet(h.id);

    const anchor = document.createElement('a');
    anchor.href = magnet;
    anchor.textContent = h.id;
    anchor.rel = 'noreferrer noopener';
    anchor.target = '_blank';
    anchor.style.textDecoration = 'underline';
    anchor.style.wordBreak = 'break-all';

    const wrapper = document.createElement('span');
    wrapper.appendChild(anchor);
    wrapper.appendChild(makeCopyButton(magnet));

    frag.appendChild(wrapper);
    lastIndex = h.end;
  }

  if (lastIndex < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  const outer = document.createElement('span');
  outer.setAttribute(MARK_ATTR, '1');
  outer.appendChild(frag);
  parent.replaceChild(outer, textNode);
}

  function walkAndProcess(root) {
    if (!root || !root.querySelectorAll) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentNode;
        if (!p || p.nodeType !== 1) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest(`[${MARK_ATTR}]`)) return NodeFilter.FILTER_REJECT;
        if (p.isContentEditable) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.length < 32) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(processTextNode);
  }

  // ========== 主流程 ==========
  if (!domainAllowed()) {
    return;
  }

  // 初次扫描
  walkAndProcess(document.body);

  // 监听动态更新
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => {
          if (!domainAllowed()) return;
          if (n.nodeType === 3) {
            processTextNode(n);
          } else if (n.nodeType === 1) {
            if (!SKIP_TAGS.has(n.tagName)) walkAndProcess(n);
          }
        });
      } else if (m.type === 'characterData') {
        processTextNode(m.target);
      }
    }
  });

  mo.observe(document.body, { subtree: true, childList: true, characterData: true });

})();

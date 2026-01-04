// ==UserScript==
// @name         Copy As Markdown
// @namespace    https://github.com/baicai99 or https://www.zhengjiyuan.top
// @version      0.3.0
// @description  Drag-select partial content; Ctrl+C copies Markdown with list markers/headings; also shows a copy button.按 Ctrl+C 会将其以 Markdown 形式复制（包含列表标记/标题）；同时还会显示一个复制按钮。
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559854/Copy%20As%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/559854/Copy%20As%20Markdown.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ===================== 配置 =====================
  const CONFIG = {
    enableButton: true,          // 是否显示“复制Markdown”按钮
    indentSpaces: 2,             // 嵌套列表每层缩进空格数（Markdown 常用 2 或 4）
    toast: true,                 // 是否显示角落提示
    toastMs: 700,
    // 什么时候接管 Ctrl+C：选区内命中 h1~h6 / li / ul/ol 才接管，否则走默认复制
    handleWhenMatch: true
  };

  // ===================== Toast =====================
  let toastEl = null;
  function showToast(msg) {
    if (!CONFIG.toast) return;
    if (!toastEl) {
      toastEl = document.createElement('div');
      Object.assign(toastEl.style, {
        position: 'fixed',
        zIndex: 2147483647,
        right: '12px',
        bottom: '12px',
        padding: '8px 10px',
        fontSize: '12px',
        borderRadius: '10px',
        background: 'rgba(30,30,30,0.92)',
        color: '#fff',
        boxShadow: '0 8px 22px rgba(0,0,0,0.28)',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 120ms ease'
      });
      document.documentElement.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    setTimeout(() => { if (toastEl) toastEl.style.opacity = '0'; }, CONFIG.toastMs);
  }

  // ===================== UI Button =====================
  const btn = document.createElement('button');
  btn.textContent = '复制Markdown';
  Object.assign(btn.style, {
    position: 'fixed',
    zIndex: 2147483647,
    display: 'none',
    padding: '6px 10px',
    fontSize: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.15)',
    background: 'rgba(30,30,30,0.92)',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
    userSelect: 'none'
  });

  let lastRange = null;
  let lastMouse = { x: 20, y: 20 };

  function mountBtn() {
    if (!CONFIG.enableButton) return;
    if (!btn.isConnected) document.documentElement.appendChild(btn);
  }

  function hideBtn() {
    btn.style.display = 'none';
  }

  function showBtn(range) {
    if (!CONFIG.enableButton) return;

    // 优先用选区 rect 定位；失败就用鼠标位置兜底
    let x = lastMouse.x + 12;
    let y = lastMouse.y + 12;

    try {
      const rects = range.getClientRects ? Array.from(range.getClientRects()) : [];
      // 选最后一个有效 rect
      const good = rects.reverse().find(r => r && r.width > 0 && r.height > 0) || null;
      const r = good || (range.getBoundingClientRect ? range.getBoundingClientRect() : null);
      if (r && r.width >= 0 && r.height >= 0 && isFinite(r.left) && isFinite(r.top)) {
        x = (good ? good.right : r.right) + 8;
        y = (good ? good.top : r.top) - 28;
      }
    } catch (_) {}

    // clamp 到视口
    x = Math.max(8, Math.min(window.innerWidth - 120, x));
    y = Math.max(8, Math.min(window.innerHeight - 40, y));

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.display = 'block';
  }

  // ===================== DOM Helper =====================
  function closestEl(node, selector) {
    const el = node && node.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    return el ? el.closest(selector) : null;
  }
  function closestLi(node) { return closestEl(node, 'li'); }
  function closestList(node) { return closestEl(node, 'ol,ul'); }

  function intersectsNode(range, node) {
    if (typeof range.intersectsNode === 'function') return range.intersectsNode(node);
    const nr = document.createRange();
    nr.selectNodeContents(node);
    return !(
      range.compareBoundaryPoints(Range.END_TO_START, nr) <= 0 ||
      range.compareBoundaryPoints(Range.START_TO_END, nr) >= 0
    );
  }

  function intersectRanges(a, b) {
    const r = a.cloneRange();

    // start = max(start)
    if (r.compareBoundaryPoints(Range.START_TO_START, b) < 0) {
      r.setStart(b.startContainer, b.startOffset);
    }
    // end = min(end)
    if (r.compareBoundaryPoints(Range.END_TO_END, b) > 0) {
      r.setEnd(b.endContainer, b.endOffset);
    }
    if (r.collapsed) return null;
    return r;
  }

  function normalizeText(s) {
    return (s || '').replace(/\r/g, '').trim();
  }

  // ===================== List numbering =====================
  function getOlNumberForLi(li, ol) {
    const v = li.getAttribute('value');
    if (v && !Number.isNaN(parseInt(v, 10))) return parseInt(v, 10);

    const reversed = ol.hasAttribute('reversed');
    const items = Array.from(ol.children).filter(e => e.tagName === 'LI');
    const idx = items.indexOf(li);

    const startAttr = ol.getAttribute('start');
    let start = startAttr && !Number.isNaN(parseInt(startAttr, 10)) ? parseInt(startAttr, 10) : null;

    if (!reversed) {
      if (start == null) start = 1;
      return start + idx;
    } else {
      if (start == null) start = items.length;
      return start - idx;
    }
  }

  function getListDepth(li) {
    let depth = 0;
    for (let p = li.parentElement; p; p = p.parentElement) {
      if (p.tagName === 'OL' || p.tagName === 'UL') depth++;
    }
    return Math.max(0, depth - 1);
  }

  // 父 li 只取“自身正文”，不重复包含子列表正文
  function getLiOwnTextRange(li) {
    const r = document.createRange();
    r.selectNodeContents(li);
    const sub = li.querySelector(':scope > ol, :scope > ul');
    if (sub) r.setEndBefore(sub);
    return r;
  }

  // ===================== Markdown builder =====================
  function collectCandidates(range) {
    const root = (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE)
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;

    if (!root) return [];

    // 候选：标题 / 列表项 / 段落（段落用于补全非列表内容）
    const selector = 'h1,h2,h3,h4,h5,h6,li,p,pre,blockquote';
    const nodes = [];

    if (root.matches && root.matches(selector)) nodes.push(root);
    if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach(n => nodes.push(n));
    }

    // 过滤：必须与选区相交
    const filtered = nodes.filter(n => intersectsNode(range, n));

    // 文档顺序排序
    filtered.sort((a, b) => {
      if (a === b) return 0;
      const pos = a.compareDocumentPosition(b);
      return (pos & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
    });

    // 去重
    return Array.from(new Set(filtered));
  }

  function shouldHandle(range) {
    // 快路径：起点/终点落在 li 或 heading 或 list 内，就认为需要接管
    const startHit = closestEl(range.startContainer, 'li,h1,h2,h3,h4,h5,h6,ol,ul');
    const endHit = closestEl(range.endContainer, 'li,h1,h2,h3,h4,h5,h6,ol,ul');
    if (startHit || endHit) return true;

    // 慢路径：在 commonAncestor 内找相交的结构节点
    const candidates = collectCandidates(range);
    return candidates.some(n => n.matches('li,h1,h2,h3,h4,h5,h6,ol,ul'));
  }

  function mdForHeading(h, range) {
    const level = parseInt(h.tagName.slice(1), 10);
    const r = document.createRange();
    r.selectNodeContents(h);
    const ir = intersectRanges(range, r);
    const text = normalizeText(ir ? ir.toString() : h.innerText);
    if (!text) return null;
    return `${'#'.repeat(level)} ${text}`;
  }

  function mdForLi(li, range) {
    const list = li.parentElement;
    if (!list || (list.tagName !== 'OL' && list.tagName !== 'UL')) return null;

    const depth = getListDepth(li);
    const indent = ' '.repeat(depth * CONFIG.indentSpaces);

    const own = getLiOwnTextRange(li);
    const ir = intersectRanges(range, own);
    const raw = normalizeText(ir ? ir.toString() : '');
    if (!raw) return null;

    const marker = (list.tagName === 'OL')
      ? `${getOlNumberForLi(li, list)}.`
      : '-';

    const lines = raw.split('\n');
    const first = `${indent}${marker} ${lines[0]}`.trimEnd();
    const pad = ' '.repeat(marker.length + 1);
    const rest = lines.slice(1).map(x => `${indent}${pad}${x}`.trimEnd());

    return [first, ...rest].join('\n');
  }

  function mdForParagraph(p, range) {
    // 如果段落在 li 内，交给 li 处理，避免重复
    if (p.closest('li')) return null;

    const r = document.createRange();
    r.selectNodeContents(p);
    const ir = intersectRanges(range, r);
    const text = normalizeText(ir ? ir.toString() : '');
    if (!text) return null;
    return text;
  }

  function mdForPre(pre, range) {
    // code block（可选增强）
    const r = document.createRange();
    r.selectNodeContents(pre);
    const ir = intersectRanges(range, r);
    const text = (ir ? ir.toString() : '').replace(/\r/g, '');
    if (!text.trim()) return null;
    return `\`\`\`\n${text.replace(/\n+$/,'')}\n\`\`\``;
  }

  function mdForBlockquote(bq, range) {
    if (bq.closest('li')) return null;
    const r = document.createRange();
    r.selectNodeContents(bq);
    const ir = intersectRanges(range, r);
    const text = normalizeText(ir ? ir.toString() : '');
    if (!text) return null;
    return text.split('\n').map(line => `> ${line}`).join('\n');
  }

  function buildMarkdownFromRange(range) {
    const candidates = collectCandidates(range);
    if (!candidates.length) return null;

    // 过滤嵌套：如果某节点在已选中的 LI / PRE / BLOCKQUOTE 内，就跳过（避免重复）
    const kept = [];
    for (const n of candidates) {
      const insideKept = kept.some(k => k.contains(n) && /^(LI|PRE|BLOCKQUOTE)$/.test(k.tagName));
      if (insideKept) continue;
      kept.push(n);
    }

    const chunks = [];
    for (const n of kept) {
      let md = null;

      if (/^H[1-6]$/.test(n.tagName)) md = mdForHeading(n, range);
      else if (n.tagName === 'LI') md = mdForLi(n, range);
      else if (n.tagName === 'P') md = mdForParagraph(n, range);
      else if (n.tagName === 'PRE') md = mdForPre(n, range);
      else if (n.tagName === 'BLOCKQUOTE') md = mdForBlockquote(n, range);

      if (md) chunks.push(md);
    }

    // 如果没命中结构节点，就回退为纯文本（但通常 shouldHandle 已经挡住）
    if (!chunks.length) {
      const fallback = normalizeText(range.toString());
      return fallback || null;
    }

    // 组装：列表项保持紧凑，其它块之间用空行分隔更像 Markdown
    const out = [];
    for (let i = 0; i < chunks.length; i++) {
      const cur = chunks[i];
      const prev = out[out.length - 1];

      const curIsList = /^\s*(-|\d+\.)\s+/.test(cur);
      const prevIsList = prev ? /^\s*(-|\d+\.)\s+/.test(prev) : false;

      if (i > 0 && !(curIsList && prevIsList)) out.push(''); // 空行
      out.push(cur);
    }

    return out.join('\n').trim();
  }

  // ===================== Copy intercept (Ctrl+C / 右键复制) =====================
  document.addEventListener('copy', (e) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    if (CONFIG.handleWhenMatch && !shouldHandle(range)) return;

    const md = buildMarkdownFromRange(range);
    if (!md) return;

    // 同步接管剪贴板（不要写 text/html，避免富文本粘贴）
    e.preventDefault();
    e.stopImmediatePropagation();

    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', md);
      try { e.clipboardData.setData('text/markdown', md); } catch (_) {}
    }

    showToast('已复制 Markdown');
  }, true);

  // ===================== Button show/hide =====================
  function updateButtonVisibility() {
    if (!CONFIG.enableButton) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) { hideBtn(); return; }

    const range = sel.getRangeAt(0);
    if (range.collapsed) { hideBtn(); return; }

    if (CONFIG.handleWhenMatch && !shouldHandle(range)) { hideBtn(); return; }

    lastRange = range.cloneRange();
    showBtn(range);
  }

  // 记录鼠标位置兜底（解决长选区/复杂结构 rect 不可靠导致按钮不出现）
  document.addEventListener('mouseup', (ev) => {
    lastMouse = { x: ev.clientX, y: ev.clientY };
    // selection 更新可能晚一拍
    setTimeout(updateButtonVisibility, 0);
  }, true);

  document.addEventListener('selectionchange', () => {
    // selectionchange 频繁触发，稍微延迟合并
    setTimeout(updateButtonVisibility, 0);
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideBtn();
  }, true);

  mountBtn();

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const sel = window.getSelection();
    const range = (sel && sel.rangeCount) ? sel.getRangeAt(0) : lastRange;
    if (!range || range.collapsed) { hideBtn(); return; }

    const md = buildMarkdownFromRange(range);
    if (!md) { hideBtn(); return; }

    // 按钮点击属于用户手势，可以用 async clipboard API
    try {
      await navigator.clipboard.writeText(md);
      btn.textContent = '已复制';
      showToast('已复制 Markdown');
    } catch (_) {
      // 兜底：触发一次 copy，让 copy handler 写入
      try {
        document.execCommand('copy');
        btn.textContent = '已复制';
      } catch (_) {
        btn.textContent = '复制失败';
      }
    } finally {
      setTimeout(() => { btn.textContent = '复制Markdown'; hideBtn(); }, 900);
    }
  }, true);

})();

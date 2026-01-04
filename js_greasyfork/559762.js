// ==UserScript==
// @name         Gemini Enterprise Inline Math Fix
// @namespace    https://github.com/lueluelue2006
// @version      1.0.0
// @license      MIT
// @description  Render inline and block math that appears as raw delimiters in Gemini Enterprise.
// @match        https://business.gemini.google/*
// @run-at       document-idle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559762/Gemini%20Enterprise%20Inline%20Math%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559762/Gemini%20Enterprise%20Inline%20Math%20Fix.meta.js
// ==/UserScript==

(() => {
  'use strict';

  try {
    if (typeof unsafeWindow !== 'undefined') {
      unsafeWindow.__geminiInlineMathFix = { version: '1.0.0' };
    }
  } catch (e) {
    // Ignore if unsafeWindow is blocked.
  }

  const mathRegex = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  const PATCH_SKIP_WINDOW_MS = 800;

  const getKatex = () => {
    if (window.katex) return window.katex;
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.katex) return unsafeWindow.katex;
    return null;
  };

  const isSkippable = (node) => {
    const el = node.parentElement;
    if (!el) return true;
    return !!el.closest('code, pre, textarea, script, style, .katex, .katex-display, .math-block');
  };

  const renderLatex = (latex, displayMode, katex) => {
    const el = document.createElement(displayMode ? 'div' : 'span');
    try {
      katex.render(latex, el, {
        displayMode,
        throwOnError: false,
        strict: 'ignore'
      });
      el.setAttribute('data-gemini-inline-math-fix', '1');
      return el;
    } catch (e) {
      return null;
    }
  };

  const replacePipesInLatex = (latex) => {
    let out = '';
    for (let i = 0; i < latex.length; i += 1) {
      const ch = latex[i];
      if (ch === '|' && latex[i - 1] !== '\\') {
        out += '\\mid';
      } else {
        out += ch;
      }
    }
    return out;
  };

  const patchTableLine = (line) => {
    if (!line.includes('|') || !line.includes('$')) return line;
    let out = line;
    out = out.replace(/\$\$([\s\S]+?)\$\$/g, (m, latex) => `$$${replacePipesInLatex(latex)}$$`);
    out = out.replace(/\\\(([\\s\S]+?)\\\)/g, (m, latex) => `\\(${replacePipesInLatex(latex)}\\)`);
    out = out.replace(/\\\[([\\s\S]+?)\\\]/g, (m, latex) => `\\[${replacePipesInLatex(latex)}\\]`);
    out = out.replace(/\$([^$\n]+?)\$/g, (m, latex) => `$${replacePipesInLatex(latex)}$`);
    return out;
  };

  const patchMarkdownTables = (markdown) => {
    if (!markdown || !markdown.includes('|') || !markdown.includes('$')) return markdown;
    const lines = markdown.split('\n');
    let inFence = false;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (/^```/.test(line) || /^~~~/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      const pipeCount = (line.match(/\|/g) || []).length;
      if (pipeCount >= 2 && line.includes('$')) {
        lines[i] = patchTableLine(line);
      }
    }
    return lines.join('\n');
  };

  const findRealSegment = (segments, startIndex, direction) => {
    for (let i = startIndex; i >= 0 && i < segments.length; i += direction) {
      if (segments[i].node) return segments[i];
    }
    return null;
  };

  const locate = (segments, index, preferNext) => {
    for (let i = 0; i < segments.length; i += 1) {
      const seg = segments[i];
      const start = seg.start;
      const end = seg.start + seg.length;
      if (index < start) return null;
      if (index === end) {
        if (preferNext && i + 1 < segments.length) {
          const next = findRealSegment(segments, i + 1, 1);
          if (!next) return null;
          return { node: next.node, offset: 0 };
        }
        if (!seg.node) {
          const prev = findRealSegment(segments, i - 1, -1);
          if (!prev) return null;
          return { node: prev.node, offset: prev.length };
        }
        return { node: seg.node, offset: seg.length };
      }
      if (index >= start && index < end) {
        if (seg.node) {
          return { node: seg.node, offset: index - start };
        }
        const target = preferNext
          ? findRealSegment(segments, i + 1, 1)
          : findRealSegment(segments, i - 1, -1);
        if (!target) return null;
        return { node: target.node, offset: preferNext ? 0 : target.length };
      }
    }
    return null;
  };

  const processSequence = (text, segments, katex) => {
    if (!text || !segments.length) return;
    mathRegex.lastIndex = 0;
    const matches = [];
    let match;
    while ((match = mathRegex.exec(text)) !== null) {
      const latex = match[1] || match[2] || match[3] || match[4];
      if (!latex) continue;
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        latex,
        displayMode: !!(match[1] || match[3])
      });
    }
    if (!matches.length) return;

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const m = matches[i];
      const startLoc = locate(segments, m.start, true);
      const endLoc = locate(segments, m.end, false);
      if (!startLoc || !endLoc) continue;
      const range = document.createRange();
      range.setStart(startLoc.node, startLoc.offset);
      range.setEnd(endLoc.node, endLoc.offset);
      const rendered = renderLatex(m.latex, m.displayMode, katex);
      if (!rendered) continue;
      range.deleteContents();
      range.insertNode(rendered);
    }
  };

  const getLeafBlocks = (root) => {
    const blockSelector = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, div';
    const blocks = Array.from(root.querySelectorAll(blockSelector)).filter((el) => {
      if (el.closest('code, pre, textarea, script, style, .katex, .katex-display, .math-block')) return false;
      return !el.querySelector(blockSelector);
    });
    if (!blocks.length) return [root];
    return blocks;
  };

  const processBlock = (block, katex) => {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    let node;
    let text = '';
    let segments = [];

    const flush = () => {
      processSequence(text, segments, katex);
      text = '';
      segments = [];
    };

    while ((node = walker.nextNode())) {
      if (!node.nodeValue) continue;
      if (isSkippable(node)) {
        flush();
        continue;
      }
      segments.push({ node, start: text.length, length: node.nodeValue.length });
      text += node.nodeValue;
    }
    flush();
  };

  const processRoot = (root, katex) => {
    const blocks = getLeafBlocks(root);
    for (const block of blocks) {
      processBlock(block, katex);
    }
  };

  const collectRowSegments = (row) => {
    const cells = Array.from(row.querySelectorAll('td, th'));
    const segments = [];
    let text = '';
    const addNode = (node) => {
      segments.push({ node, start: text.length, length: node.nodeValue.length });
      text += node.nodeValue;
    };
    for (let ci = 0; ci < cells.length; ci += 1) {
      const walker = document.createTreeWalker(cells[ci], NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.nodeValue) continue;
        if (isSkippable(node)) continue;
        addNode(node);
      }
      if (ci < cells.length - 1) {
        segments.push({ node: null, start: text.length, length: 1 });
        text += '|';
      }
    }
    return { text, segments };
  };

  const countUnescaped = (text, char) => {
    let count = 0;
    for (let i = 0; i < text.length; i += 1) {
      if (text[i] === char && text[i - 1] !== '\\') count += 1;
    }
    return count;
  };

  const hasUnbalancedMath = (text) => {
    if (!text) return false;
    const dollarCount = countUnescaped(text, '$');
    if (dollarCount % 2 === 1) return true;
    const openParen = (text.match(/\\\(/g) || []).length;
    const closeParen = (text.match(/\\\)/g) || []).length;
    if (openParen !== closeParen) return true;
    const openBracket = (text.match(/\\\[/g) || []).length;
    const closeBracket = (text.match(/\\\]/g) || []).length;
    if (openBracket !== closeBracket) return true;
    return false;
  };

  const processTableRows = (root, katex) => {
    const rows = Array.from(root.querySelectorAll('tr'));
    for (const row of rows) {
      const getCells = () => Array.from(row.querySelectorAll('td, th'));
      const initialCells = getCells();
      if (!initialCells.length) continue;
      const table = row.closest('table');
      const headerRow = table ? table.querySelector('tr') : null;
      const headerCells = headerRow ? headerRow.querySelectorAll('td, th') : null;
      const desiredCols = headerCells && headerCells.length ? headerCells.length : initialCells.length;

      const moveLooseKatexIntoCells = () => {
        const cells = getCells();
        if (!cells.length) return;
        const children = Array.from(row.childNodes);
        for (const child of children) {
          if (child.nodeType !== Node.ELEMENT_NODE) continue;
          const tag = child.tagName;
          if (tag === 'TD' || tag === 'TH') continue;
          if (!child.classList?.contains('katex') && !child.querySelector?.('.katex, .katex-display')) continue;

          let target = child.previousElementSibling;
          while (target && target.tagName !== 'TD' && target.tagName !== 'TH') {
            target = target.previousElementSibling;
          }
          if (!target) {
            target = child.nextElementSibling;
            while (target && target.tagName !== 'TD' && target.tagName !== 'TH') {
              target = target.nextElementSibling;
            }
          }
          if (!target) target = cells[0];

          target.appendChild(child);
        }
      };

      const cleanupRowMarkers = () => {
        const cells = getCells();
        for (const cell of cells) {
          const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
          const toRemove = [];
          let node;
          while ((node = walker.nextNode())) {
            const t = node.nodeValue ? node.nodeValue.trim() : '';
            if (!t) continue;
            if (/^(\*{1,3}|_{1,3})$/.test(t)) toRemove.push(node);
          }
          for (const n of toRemove) {
            n.nodeValue = '';
          }
        }
      };

      const splitSpanningCell = () => {
        if (desiredCols <= 1) return;
        const cells = getCells();
        if (cells.length !== 1) return;
        const cell = cells[0];
        if (cell.colSpan <= 1) return;
        const annotation = cell.querySelector('.katex-mathml annotation');
        if (!annotation || !annotation.textContent) return;
        const latex = annotation.textContent;
        const pipeIdx = latex.indexOf('|');
        if (pipeIdx < 0) return;

        const leftLatex = `${latex.slice(0, pipeIdx)}|`;
        const rightLatex = latex.slice(pipeIdx + 1);
        if (!leftLatex || !rightLatex) return;

        const makeCell = () => {
          const c = cell.cloneNode(false);
          c.removeAttribute('colspan');
          c.textContent = '';
          return c;
        };

        const leftCell = makeCell();
        const rightCell = makeCell();
        const leftRendered = renderLatex(leftLatex, false, katex);
        const rightRendered = renderLatex(rightLatex, false, katex);
        if (leftRendered) leftCell.appendChild(leftRendered);
        if (rightRendered) rightCell.appendChild(rightRendered);

        cell.replaceWith(leftCell, rightCell);
        for (let i = 2; i < desiredCols; i += 1) {
          row.appendChild(makeCell());
        }
      };

      const mergeIfSingleCell = () => {
        if (desiredCols > 1) return;
        const cells = getCells();
        const meaningful = cells.filter((cell) => {
          const text = cell.innerText.replace(/[\s*\u200b_]/g, '').trim();
          if (text) return true;
          return !!cell.querySelector('.katex, .katex-display');
        });
        if (meaningful.length !== 1 || cells.length <= 1) return;
        const keep = meaningful[0];
        keep.colSpan = cells.length;
        for (const cell of cells) {
          if (cell !== keep) cell.remove();
        }
      };

      const cellsForBalance = getCells();
      const needsCrossCell = cellsForBalance.some((cell) => hasUnbalancedMath(cell.textContent || ''));
      if (!needsCrossCell) {
        cleanupRowMarkers();
        moveLooseKatexIntoCells();
        splitSpanningCell();
        mergeIfSingleCell();
        continue;
      }

      moveLooseKatexIntoCells();

      if (!row.textContent || (!row.textContent.includes('$') && !row.textContent.includes('\\(') && !row.textContent.includes('\\['))) {
        cleanupRowMarkers();
        moveLooseKatexIntoCells();
        splitSpanningCell();
        mergeIfSingleCell();
        continue;
      }
      const { text, segments } = collectRowSegments(row);
      if (!text.includes('$') && !text.includes('\\(') && !text.includes('\\[')) {
        cleanupRowMarkers();
        moveLooseKatexIntoCells();
        splitSpanningCell();
        mergeIfSingleCell();
        continue;
      }

      let rowText = text;
      const rowSegments = segments.slice();
      const dollarCount = (rowText.match(/\$/g) || []).length;
      if (dollarCount % 2 === 1) {
        rowSegments.push({ node: null, start: rowText.length, length: 1 });
        rowText += '$';
      }

      processSequence(rowText, rowSegments, katex);
      cleanupRowMarkers();
      moveLooseKatexIntoCells();
      splitSpanningCell();
      mergeIfSingleCell();
    }
  };

  const patchedMarkdownCache = new WeakMap();
  const patchedMarkdownAt = new WeakMap();

  const getMarkdownHost = (node) => {
    if (!node) return null;
    if (node.closest) {
      const direct = node.closest('ucs-fast-markdown, ucs-markdown, ucs-response-markdown');
      if (direct) return direct;
    }
    const root = node.getRootNode ? node.getRootNode() : null;
    if (root && root.host && root.host.matches && root.host.matches('ucs-fast-markdown, ucs-markdown, ucs-response-markdown')) {
      return root.host;
    }
    return null;
  };

  const patchMarkdownHosts = (root) => {
    const hosts = root.querySelectorAll('ucs-fast-markdown, ucs-markdown, ucs-response-markdown');
    for (const host of hosts) {
      if (!host || typeof host.markdown !== 'string') continue;
      const current = host.markdown;
      if (patchedMarkdownCache.get(host) === current) continue;
      const patched = patchMarkdownTables(current);
      patchedMarkdownCache.set(host, patched);
      if (patched !== current) {
        try {
          const hostRoot = host.shadowRoot || host;
          hostRoot.querySelectorAll('[data-gemini-inline-math-fix]').forEach((el) => el.remove());
          host.markdown = patched;
          if (typeof host.requestUpdate === 'function') host.requestUpdate();
          if (typeof host.scheduleRender === 'function') host.scheduleRender();
          patchedMarkdownAt.set(host, Date.now());
        } catch (e) {
          // Ignore readonly markdown or render errors.
        }
      }
    }
  };

  const observedRoots = new WeakSet();
  const observeRoot = (root) => {
    if (!root || observedRoots.has(root)) return;
    observedRoots.add(root);
    const observer = new MutationObserver(schedule);
    observer.observe(root, { subtree: true, childList: true, characterData: true });
  };

  const collectShadowRoots = (root, out) => {
    if (!root) return;
    out.push(root);
    observeRoot(root);
    const els = root.querySelectorAll('*');
    for (const el of els) {
      if (el.shadowRoot) collectShadowRoots(el.shadowRoot, out);
    }
  };

  const processAll = () => {
    const katex = getKatex();
    if (!katex) return;

    const app = document.querySelector('ucs-standalone-app');
    if (!app || !app.shadowRoot) return;

    const roots = [];
    collectShadowRoots(app.shadowRoot, roots);

    for (const r of roots) {
      patchMarkdownHosts(r);
      const docs = r.querySelectorAll('.markdown-document');
      for (const doc of docs) {
        const host = getMarkdownHost(doc);
        if (host) {
          const patchedAt = patchedMarkdownAt.get(host);
          if (patchedAt && Date.now() - patchedAt < PATCH_SKIP_WINDOW_MS) continue;
        }
        processRoot(doc, katex);
        processTableRows(doc, katex);
      }

      const markdowns = r.querySelectorAll('ucs-fast-markdown, ucs-markdown, ucs-response-markdown');
      for (const fm of markdowns) {
        if (fm.shadowRoot) {
          const patchedAt = patchedMarkdownAt.get(fm);
          if (patchedAt && Date.now() - patchedAt < PATCH_SKIP_WINDOW_MS) continue;
          processRoot(fm.shadowRoot, katex);
          processTableRows(fm.shadowRoot, katex);
        }
      }
    }
  };

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      processAll();
    }, 200);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });

  schedule();
})();

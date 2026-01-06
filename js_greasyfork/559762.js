// ==UserScript==
// @name         Gemini Enterprise Inline Math Fix
// @namespace    https://github.com/lueluelue2006
// @author       schweigen
// @version      1.2.0
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
      unsafeWindow.__geminiInlineMathFix = { version: '1.2.0' };
    }
  } catch (e) {
    // Ignore if unsafeWindow is blocked.
  }

  const mathRegex = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  const bareMathRegex =
    /\\implies\s*(?:\\\{[^}]{1,200}\\\}|\{[^}]{1,200}\})(?:_(?:\{[^}]{1,40}\}|[a-zA-Z0-9]+))?|\\square\b|\{(?=[^}\n]*[\\_^0-9,+=|\\-])[^\n}]{1,200}\}(?:_(?:\{[^}]{1,40}\}|[a-zA-Z0-9]+))?/g;
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

  const isKatexError = (el) => {
    if (!el) return true;
    if (el.classList && el.classList.contains('katex-error')) return true;
    return !!el.querySelector?.('.katex-error');
  };

  const repairMarkdownBold = (root) => {
    const boldRegex = /\*\*([^\n*]{1,200}?)\*\*/g;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;

    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !node.nodeValue.includes('**')) continue;
      if (isSkippable(node)) continue;
      const parent = node.parentElement;
      if (!parent) continue;
      if (parent.closest('strong, b')) continue;
      nodes.push(node);
    }

    for (const n of nodes) {
      const text = n.nodeValue;
      if (!text) continue;

      boldRegex.lastIndex = 0;
      let match;
      let last = 0;
      let changed = false;
      const frag = document.createDocumentFragment();

      while ((match = boldRegex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const before = text.slice(last, start);
        if (before) frag.appendChild(document.createTextNode(before));

        const content = match[1] || '';
        if (content.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = content;
          frag.appendChild(strong);
        } else {
          frag.appendChild(document.createTextNode(match[0]));
        }

        last = end;
        changed = true;
      }

      if (!changed) continue;
      const after = text.slice(last);
      if (after) frag.appendChild(document.createTextNode(after));

      const parent = n.parentNode;
      if (!parent) continue;
      parent.replaceChild(frag, n);
    }
  };

  const isProbablyPlainTextMath = (latex) => {
    if (!latex) return false;
    const t = latex.trim();
    if (t.length < 12) return false;
    if (!/\s/.test(t)) return false;
    if (/\\[a-zA-Z]+|[0-9]|[_^{}]|[=<>+*/-]/.test(t)) return false;

    try {
      return /^[\p{L}\s.,;:!?'"()–—-]+$/u.test(t);
    } catch (e) {
      // Fallback for environments without Unicode property escapes.
      return /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s.,;:!?'"()–—-]+$/.test(t);
    }
  };

  const restoreOuterSetBraces = (latex) => {
    if (!latex || latex.includes('\\{') || latex.includes('\\}')) return latex;

    const start = latex.search(/\S/);
    if (start < 0) return latex;
    let end = latex.length - 1;
    while (end >= 0 && /\s/.test(latex[end])) end -= 1;

    if (latex[start] !== '{' || latex[end] !== '}') return latex;

    let depth = 0;
    for (let i = start; i <= end; i += 1) {
      const ch = latex[i];
      if (ch === '{' && latex[i - 1] !== '\\') depth += 1;
      if (ch === '}' && latex[i - 1] !== '\\') depth -= 1;
      if (depth === 0) {
        if (i === end) {
          return `${latex.slice(0, start)}\\{${latex.slice(start + 1, end)}\\}${latex.slice(end + 1)}`;
        }
        return latex;
      }
    }

    return latex;
  };

  const restoreSetBracesAfterEquals = (latex) => {
    if (!latex || !latex.includes('{') || !latex.includes('}')) return latex;

    const findPrevNonSpace = (s, idx) => {
      for (let i = idx - 1; i >= 0; i -= 1) {
        if (!/\s/.test(s[i])) return i;
      }
      return -1;
    };

    const findMatchingBrace = (s, start) => {
      let depth = 0;
      for (let i = start; i < s.length; i += 1) {
        const ch = s[i];
        if (ch === '{' && s[i - 1] !== '\\') depth += 1;
        if (ch === '}' && s[i - 1] !== '\\') depth -= 1;
        if (depth === 0) return i;
      }
      return -1;
    };

    let out = '';
    let depth = 0;

    for (let i = 0; i < latex.length; i += 1) {
      const ch = latex[i];
      const escaped = i > 0 && latex[i - 1] === '\\';

      if (ch === '{' && !escaped) {
        if (depth === 0) {
          const prevIdx = findPrevNonSpace(latex, i);
          const prevCh = prevIdx >= 0 ? latex[prevIdx] : '';
          if (prevCh === '=') {
            const end = findMatchingBrace(latex, i);
            if (end > i) {
              out += `\\{${latex.slice(i + 1, end)}\\}`;
              i = end;
              continue;
            }
          }
        }
        depth += 1;
      } else if (ch === '}' && !escaped) {
        depth = Math.max(0, depth - 1);
      }

      out += ch;
    }

    return out;
  };

  const repairLatex = (latex) => {
    let out = latex;

    // Gemini sometimes leaves a dangling underscore that KaTeX treats as a parse error.
    // Fix the common pattern seen in linear combinations: "... \\lambda_i v_".
    if (/\\lambda_i\s*v_\s*$/.test(out)) {
      out = out.replace(/v_\s*$/, 'v_i');
    }

    // Fix the common truncated fragment: "\\implies (-u_".
    if (/\\implies\s*\(-u_\s*$/.test(out)) {
      out = out.replace(/\(-u_\s*$/, '(-u_1');
    }

    // Generic: make trailing sub/sup syntactically valid.
    out = out.replace(/_(\s*)$/, '_{}$1');
    out = out.replace(/\^(\s*)$/, '^{}$1');

    return out;
  };

  const normalizeBareLatex = (latex) => {
    let out = latex;

    // If Gemini stripped the surrounding $...$ but kept the TeX command, Markdown may have
    // consumed \\{ and \\} into literal braces. Restore set braces for KaTeX.
    if (/\\implies/.test(out) && !out.includes('\\{') && out.includes('{') && out.includes('}')) {
      out = out.replace(/\{([^}]*)\}/g, '\\{$1\\}');
    }

    return out;
  };

  const renderLatex = (latex, displayMode, katex) => {
    const el = document.createElement(displayMode ? 'div' : 'span');
    const opts = {
      displayMode,
      throwOnError: false,
      strict: 'ignore'
    };

    const doRender = (tex) => {
      while (el.firstChild) el.removeChild(el.firstChild);
      el.className = '';
      katex.render(tex, el, opts);
    };

    try {
      doRender(latex);
      if (isKatexError(el)) {
        const repaired = repairLatex(latex);
        if (repaired !== latex) doRender(repaired);
      }
      if (isKatexError(el)) return null;
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
        out += '\\vert{}';
      } else {
        out += ch;
      }
    }
    return out;
  };

  const patchTableLine = (line) => {
    if (!line.includes('|')) return line;
    if (!line.includes('$') && !line.includes('\\(') && !line.includes('\\[')) return line;
    let out = line;
    const wrapInline = (latex) => {
      const inner = replacePipesInLatex(latex);
      const spaced = inner && inner.startsWith(' ') ? inner : ` ${inner}`;
      // Gemini's table renderer sometimes fails when \\( is immediately followed by [ or \\\\.
      return `\\(${spaced}\\)`;
    };
    const wrapDisplay = (latex) => {
      const inner = replacePipesInLatex(latex);
      const spaced = inner && inner.startsWith(' ') ? inner : ` ${inner}`;
      return `\\[${spaced}\\]`;
    };

    out = out.replace(/\$\$([\s\S]+?)\$\$/g, (m, latex) => wrapDisplay(latex));
    out = out.replace(/\\\(([\\s\S]+?)\\\)/g, (m, latex) => wrapInline(latex));
    out = out.replace(/\\\[([\\s\S]+?)\\\]/g, (m, latex) => wrapDisplay(latex));
    out = out.replace(/\$([^$\n]+?)\$/g, (m, latex) => wrapInline(latex));
    return out;
  };

  const patchMarkdownTables = (markdown) => {
    if (!markdown || !markdown.includes('|')) return markdown;
    if (!markdown.includes('$') && !markdown.includes('\\(') && !markdown.includes('\\[')) return markdown;

    const countPipesOutsideMathAndCode = (line) => {
      if (!line || !line.includes('|')) return 0;
      let inBackticks = false;
      let inMath = false;
      let mathMode = null;
      let count = 0;

      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];

        if (ch === '`' && line[i - 1] !== '\\') {
          inBackticks = !inBackticks;
          continue;
        }
        if (inBackticks) continue;

        if (ch === '\\') {
          const next = line[i + 1];
          if (!inMath && next === '(') {
            inMath = true;
            mathMode = '\\(';
            i += 1;
            continue;
          }
          if (inMath && mathMode === '\\(' && next === ')') {
            inMath = false;
            mathMode = null;
            i += 1;
            continue;
          }
          if (!inMath && next === '[') {
            inMath = true;
            mathMode = '\\[';
            i += 1;
            continue;
          }
          if (inMath && mathMode === '\\[' && next === ']') {
            inMath = false;
            mathMode = null;
            i += 1;
            continue;
          }
        }

        if (ch === '$' && line[i - 1] !== '\\') {
          if (line[i + 1] === '$') {
            if (!inMath) {
              inMath = true;
              mathMode = '$$';
            } else if (mathMode === '$$') {
              inMath = false;
              mathMode = null;
            }
            i += 1;
            continue;
          }
          if (!inMath) {
            inMath = true;
            mathMode = '$';
            continue;
          }
          if (mathMode === '$') {
            inMath = false;
            mathMode = null;
          }
          continue;
        }

        if (ch === '|' && !inMath) count += 1;
      }
      return count;
    };

    const lines = markdown.split('\n');
    let inFence = false;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (/^```/.test(line) || /^~~~/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      const pipeCountOutside = countPipesOutsideMathAndCode(line);
      if (pipeCountOutside >= 2 && (line.includes('$') || line.includes('\\(') || line.includes('\\['))) {
        lines[i] = patchTableLine(line);
      }
    }
    return lines.join('\n');
  };

  const patchMarkdownBold = (markdown) => {
    if (!markdown || !markdown.includes('**')) return markdown;

    const patchBoldText = (text) => {
      if (!text || !text.includes('**')) return text;
      let out = text;

      out = out.replace(/\*\*“([^”\n*]{1,200}?)”\*\*/g, '“**$1**”');
      out = out.replace(/\*\*‘([^’\n*]{1,200}?)’\*\*/g, '‘**$1**’');
      out = out.replace(/\*\*《([^》\n*]{1,200}?)》\*\*/g, '《**$1**》');
      out = out.replace(/\*\*「([^」\n*]{1,200}?)」\*\*/g, '「**$1**」');
      out = out.replace(/\*\*（([^）\n*]{1,200}?)）\*\*/g, '（**$1**）');
      out = out.replace(/\*\*\(([^)\n*]{1,200}?)\)\*\*/g, '(**$1**)');

      const moveTrailingPunctuationOut = (regex) => {
        out = out.replace(regex, (m, body, punct) => {
          const first = (body || '').trimStart()[0];
          if (!first) return m;
          if (/^[“‘"'(（《「]/.test(first)) return m;
          return `**${body}**${punct}`;
        });
      };

      try {
        moveTrailingPunctuationOut(/\*\*([^\n*]{1,200}?)([”’"'）)\]}】》」])\*\*(?=[\p{L}\p{N}])/gu);
      } catch (e) {
        moveTrailingPunctuationOut(
          /\*\*([^\n*]{1,200}?)([”’"'）)\]}】》」])\*\*(?=[A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF\u4E00-\u9FFF])/g
        );
      }

      return out;
    };

    const lines = markdown.split('\n');
    let inFence = false;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (/^```/.test(line) || /^~~~/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      if (!line.includes('**')) continue;

      const parts = line.split('`');
      for (let pi = 0; pi < parts.length; pi += 2) {
        parts[pi] = patchBoldText(parts[pi]);
      }
      lines[i] = parts.join('`');
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
        const target = preferNext ? findRealSegment(segments, i + 1, 1) : findRealSegment(segments, i - 1, -1);
        if (!target) return null;
        return { node: target.node, offset: preferNext ? 0 : target.length };
      }
    }
    return null;
  };

  const collectMatches = (text) => {
    const matches = [];

    mathRegex.lastIndex = 0;
    let match;
    while ((match = mathRegex.exec(text)) !== null) {
      const latex = match[1] || match[2] || match[3] || match[4];
      if (!latex) continue;
      matches.push({
        kind: 'delimited',
        start: match.index,
        end: match.index + match[0].length,
        latex,
        displayMode: !!(match[1] || match[3])
      });
    }

    bareMathRegex.lastIndex = 0;
    while ((match = bareMathRegex.exec(text)) !== null) {
      matches.push({
        kind: 'bare',
        start: match.index,
        end: match.index + match[0].length,
        latex: match[0],
        displayMode: false
      });
    }

    if (!matches.length) return matches;

    matches.sort((a, b) => a.start - b.start || b.end - a.end);
    const filtered = [];
    let cursor = -1;
    for (const m of matches) {
      if (m.start < cursor) continue;
      filtered.push(m);
      cursor = m.end;
    }
    return filtered;
  };

  const processSequence = (text, segments, katex) => {
    if (!text || !segments.length) return;
    const matches = collectMatches(text);
    if (!matches.length) return;

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const m = matches[i];
      let start = m.start;
      let end = m.end;
      if (m.kind === 'bare') {
        if (start > 0 && text[start - 1] === '$') start -= 1;
        if (end < text.length && text[end] === '$') end += 1;
      }

      const startLoc = locate(segments, start, true);
      const endLoc = locate(segments, end, false);
      if (!startLoc || !endLoc) continue;

      let latex = m.latex;
      if (m.kind === 'delimited' && !m.displayMode && isProbablyPlainTextMath(latex)) {
        const range = document.createRange();
        range.setStart(startLoc.node, startLoc.offset);
        range.setEnd(endLoc.node, endLoc.offset);
        range.deleteContents();
        range.insertNode(document.createTextNode(latex));
        continue;
      }

      latex = restoreSetBracesAfterEquals(latex);
      latex = restoreOuterSetBraces(latex);
      latex = normalizeBareLatex(latex);

      const rendered = renderLatex(latex, m.displayMode, katex);
      if (!rendered) continue;

      const range = document.createRange();
      range.setStart(startLoc.node, startLoc.offset);
      range.setEnd(endLoc.node, endLoc.offset);
      range.deleteContents();
      range.insertNode(rendered);
    }
  };

  const getLeafBlocks = (root) => {
    const blockSelector = 'p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th';
    const divSelector = 'div:not(.math-block)';
    const selector = `${blockSelector}, ${divSelector}`;

    const blocks = Array.from(root.querySelectorAll(selector)).filter((el) => {
      if (el.closest('code, pre, textarea, script, style, .katex, .katex-display, .math-block')) return false;
      const nestedSelector = el.tagName === 'DIV' ? selector : blockSelector;
      return !el.querySelector(nestedSelector);
    });
    if (!blocks.length) return [root];
    return blocks;
  };

  const processBlock = (block, katex) => {
    repairMarkdownBold(block);

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
      const patched = patchMarkdownBold(patchMarkdownTables(current));
      patchedMarkdownCache.set(host, patched);
      if (patched !== current) {
        try {
          const hostRoot = host.shadowRoot || host;
          hostRoot.querySelectorAll('[data-gemini-inline-math-fix]').forEach((el) => el.remove());
          host.markdown = patched;
          if (typeof host.requestUpdate === 'function') host.requestUpdate();
          if (typeof host.scheduleRender === 'function') host.scheduleRender();
          patchedMarkdownAt.set(host, Date.now());
          setTimeout(schedule, PATCH_SKIP_WINDOW_MS + 50);
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

  const ROOT_STYLE_ID = 'gemini-inline-math-fix-style';
  const ensureRootStyles = (root) => {
    if (!root || typeof root.querySelector !== 'function') return;
    if (root.querySelector(`#${ROOT_STYLE_ID}`)) return;
    const style = document.createElement('style');
    style.id = ROOT_STYLE_ID;
    style.textContent = `
      .disclaimer { display: none !important; }
      .main.chat-mode.omnibar { padding-bottom: 0 !important; }
      .main.chat-mode.omnibar form.omnibar { margin-bottom: 0 !important; }
    `;
    root.appendChild(style);
  };

  const collectShadowRoots = (root, out) => {
    if (!root) return;
    out.push(root);
    observeRoot(root);
    ensureRootStyles(root);
    const els = root.querySelectorAll('*');
    for (const el of els) {
      if (el.shadowRoot) collectShadowRoots(el.shadowRoot, out);
    }
  };

  const REFRESH_BUTTON_ID = 'gemini-inline-math-fix-refresh';
  const ensureRefreshButton = () => {
    if (document.getElementById(REFRESH_BUTTON_ID)) return;
    const btn = document.createElement('button');
    btn.id = REFRESH_BUTTON_ID;
    btn.type = 'button';
    btn.textContent = '↻';
    btn.title = '刷新公式渲染';
    btn.setAttribute('aria-label', '刷新公式渲染');
    btn.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:110px',
      'z-index:2147483647',
      'width:40px',
      'height:40px',
      'border-radius:20px',
      'border:1px solid rgba(255,255,255,0.14)',
      'background:rgba(32,33,36,0.86)',
      'color:#fff',
      'font-size:18px',
      'line-height:40px',
      'text-align:center',
      'cursor:pointer',
      'box-shadow:0 6px 18px rgba(0,0,0,0.35)',
      'backdrop-filter:blur(6px)'
    ].join(';');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      schedule();
    });
    (document.body || document.documentElement).appendChild(btn);
  };

  let katexWaitAttempts = 0;
  const KATEX_WAIT_MAX_ATTEMPTS = 30;
  const KATEX_WAIT_MS = 600;

  const processAll = () => {
    ensureRefreshButton();

    const katex = getKatex();
    if (!katex) {
      if (katexWaitAttempts < KATEX_WAIT_MAX_ATTEMPTS) {
        katexWaitAttempts += 1;
        setTimeout(schedule, KATEX_WAIT_MS);
      }
      return;
    }
    katexWaitAttempts = 0;

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

  try {
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.__geminiInlineMathFix) {
      unsafeWindow.__geminiInlineMathFix.refresh = () => schedule();
    }
  } catch (e) {
    // Ignore if unsafeWindow is blocked.
  }

  schedule();
})();

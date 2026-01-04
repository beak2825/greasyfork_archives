// ==UserScript==
// @name         Cogito Ergo Loot导出文字/图片版
// @namespace    https://github.com/lueluelue2006
// @version      1.0.0
// @description  Export puzzle grids (0-9), generate a single composite image, and paste an AI answer matrix to auto-fill (supports Cogito Ergo Loot + ARC Prize Play).
// @match        https://cogito-ergo-loot.h-e.top/*
// @match        https://arcprize.org/play*
// @license      MIT
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560493/Cogito%20Ergo%20Loot%E5%AF%BC%E5%87%BA%E6%96%87%E5%AD%97%E5%9B%BE%E7%89%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560493/Cogito%20Ergo%20Loot%E5%AF%BC%E5%87%BA%E6%96%87%E5%AD%97%E5%9B%BE%E7%89%87%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_ID = 'agh-helper-panel';
  const STYLE_ID = 'agh-helper-style';
  const CMD_S_DOUBLE_PRESS_MS = 450;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function copyText(text) {
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text);
        return true;
      }
    } catch (_) {}

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch (_) {}

    return false;
  }

  function parseLineDigits(line) {
    const trimmed = String(line || '').trim();
    if (!trimmed) return [];

    if (/^[0-9]+$/.test(trimmed)) return trimmed.split('').map((c) => Number(c));

    const matches = trimmed.match(/-?\d+/g) || [];
    return matches.map((s) => Number(s)).filter((n) => Number.isFinite(n) && n >= 0 && n <= 9);
  }

  function extractCodeBlocks(text) {
    const blocks = [];
    const re = /```[^\n]*\n([\s\S]*?)```/g;
    let match;
    while ((match = re.exec(String(text || ''))) !== null) blocks.push(match[1] || '');
    return blocks;
  }

  function findMatrixInText(text, targetRows, targetCols) {
    const lines = String(text || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < targetRows) return null;

    for (let i = 0; i <= lines.length - targetRows; i++) {
      const data = [];
      let ok = true;
      for (let r = 0; r < targetRows; r++) {
        let nums = parseLineDigits(lines[i + r]);
        if (nums.length < targetCols) {
          ok = false;
          break;
        }
        if (nums.length > targetCols) nums = nums.slice(nums.length - targetCols);
        if (nums.length !== targetCols) {
          ok = false;
          break;
        }
        data.push(nums);
      }
      if (ok) return { rows: targetRows, cols: targetCols, data };
    }

    return null;
  }

  function parseAnswerMatrixFromText(text, targetRows, targetCols) {
    const raw = String(text || '');
    const blocks = extractCodeBlocks(raw);
    const candidates = blocks.length ? blocks : [raw];

    for (let i = candidates.length - 1; i >= 0; i--) {
      const found = findMatrixInText(candidates[i], targetRows, targetCols);
      if (found) return found;
    }

    const flat = raw
      .split(/\r?\n/)
      .flatMap((line) => parseLineDigits(line))
      .filter((n) => n >= 0 && n <= 9);
    const need = targetRows * targetCols;
    if (flat.length < need) {
      throw new Error(`解析失败：需要 ${targetRows} 行、每行 ${targetCols} 个 0-9 数字（当前只找到 ${flat.length} 个）`);
    }
    const tail = flat.slice(flat.length - need);
    const data = Array.from({ length: targetRows }, (_, r) => tail.slice(r * targetCols, (r + 1) * targetCols));
    return { rows: targetRows, cols: targetCols, data };
  }

  function wrapCodeBlock(text, info = '') {
    const suffix = info ? String(info) : '';
    return `\`\`\`${suffix}\n${text}\n\`\`\``;
  }

  function formatMatrixWithSpaces(matrix) {
    return matrix.data.map((row) => row.join(' ')).join('\n');
  }

  function chooseCellSizeForImage(examplePairs, taskInput, answerSize) {
    const betweenGap = 80;
    const padding = 28;
    const maxWidthPx = 2200;

    const pairCols = [];
    for (let i = 0; i < (examplePairs?.length || 0); i++) {
      pairCols.push(examplePairs[i].input.cols + examplePairs[i].output.cols);
    }
    pairCols.push(taskInput.cols + (answerSize?.cols || 0));
    const maxColsInRow = Math.max(...pairCols.filter((n) => Number.isFinite(n) && n > 0));

    let cellSize = 32;
    const widthAt32 = maxColsInRow * cellSize + betweenGap + padding * 2;
    if (widthAt32 > maxWidthPx) {
      cellSize = Math.max(10, Math.floor((maxWidthPx - betweenGap - padding * 2) / maxColsInRow));
    }
    return cellSize;
  }

  function drawMatrix(ctx, matrix, x, y, cellSize, colorMap, lineStyle) {
    const rows = matrix.rows;
    const cols = matrix.cols;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = matrix.data[r][c];
        ctx.fillStyle = colorMap.get(v) || '#000000';
        ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize, cellSize);
      }
    }

    const w = cols * cellSize;
    const h = rows * cellSize;
    const ox = x + 0.5;
    const oy = y + 0.5;

    ctx.beginPath();
    for (let c = 1; c < cols; c++) {
      const px = ox + c * cellSize;
      ctx.moveTo(px, y);
      ctx.lineTo(px, y + h);
    }
    for (let r = 1; r < rows; r++) {
      const py = oy + r * cellSize;
      ctx.moveTo(x, py);
      ctx.lineTo(x + w, py);
    }
    const inner = lineStyle?.inner || [];
    for (const stroke of inner) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.stroke();
    }

    const border = lineStyle?.border || [];
    for (const stroke of border) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.strokeRect(ox, oy, w - 1, h - 1);
    }
  }

  function getCoordLabelMetrics(matrix, cellSize) {
    const maxIndex = Math.max(matrix.rows, matrix.cols);
    const digits = String(maxIndex).length;
    const fontSize = Math.max(9, Math.min(14, Math.round(cellSize * 0.6)));
    const pad = Math.max(10, Math.round(fontSize * 0.7));
    const left = Math.max(24, Math.round(fontSize * (digits + 1.4)) + pad);
    const top = Math.max(22, fontSize + pad);
    return { left, top, fontSize };
  }

  function drawMatrixWithCoords(ctx, matrix, x, y, cellSize, colorMap, metrics, lineStyle) {
    const { left, top, fontSize } = metrics;
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';

    ctx.save();
    ctx.font = `650 ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'rgba(17,24,39,0.75)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let c = 0; c < matrix.cols; c++) {
      const label = String(c + 1);
      const cx = x + left + c * cellSize + cellSize / 2;
      const cy = y + top / 2;
      ctx.fillText(label, cx, cy);
    }
    for (let r = 0; r < matrix.rows; r++) {
      const label = String(r + 1);
      const cx = x + left / 2;
      const cy = y + top + r * cellSize + cellSize / 2;
      ctx.fillText(label, cx, cy);
    }
    ctx.restore();

    drawMatrix(ctx, matrix, x + left, y + top, cellSize, colorMap, lineStyle);
  }

  function renderCompositeImageCanvas(examplePairs, taskInput, answerSize, colorMap, lineStyle, opts) {
    const fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    const padding = 28;
    const betweenGap = 80;
    const rowGap = 28;
    const labelFontSize = 18;
    const labelHeight = labelFontSize + 8;
    const labelGap = 10;

    const taskLabelPrefix = opts?.taskLabelPrefix || '题目输入';
    const answerLabelPrefix = opts?.answerLabelPrefix || '你的答案';

    const cellSize = chooseCellSizeForImage(examplePairs, taskInput, answerSize);

    const rows = [];
    for (let i = 0; i < examplePairs.length; i++) {
      const idx = i + 1;
      rows.push({
        left: { label: `示例${idx} 输入 (${examplePairs[i].input.rows}×${examplePairs[i].input.cols})`, matrix: examplePairs[i].input },
        right: { label: `示例${idx} 输出 (${examplePairs[i].output.rows}×${examplePairs[i].output.cols})`, matrix: examplePairs[i].output },
      });
    }
    rows.push({
      left: { label: `${taskLabelPrefix} (${taskInput.rows}×${taskInput.cols})`, matrix: taskInput },
      right: { label: `${answerLabelPrefix} (${answerSize.rows}×${answerSize.cols})`, matrix: null, blankSize: answerSize },
    });

    let canvasWidth = 0;
    let canvasHeight = padding * 2 + Math.max(0, rows.length - 1) * rowGap;

    for (const row of rows) {
      const leftMetrics = row.left.matrix ? getCoordLabelMetrics(row.left.matrix, cellSize) : { left: 0, top: 0 };
      const leftW = row.left.matrix ? leftMetrics.left + row.left.matrix.cols * cellSize : 0;
      const leftH = row.left.matrix ? leftMetrics.top + row.left.matrix.rows * cellSize : 0;

      const rightW = row.right.matrix
        ? getCoordLabelMetrics(row.right.matrix, cellSize).left + row.right.matrix.cols * cellSize
        : (row.right.blankSize?.cols || 0) * cellSize;
      const rightH = row.right.matrix
        ? getCoordLabelMetrics(row.right.matrix, cellSize).top + row.right.matrix.rows * cellSize
        : (row.right.blankSize?.rows || 0) * cellSize;

      canvasWidth = Math.max(canvasWidth, leftW + betweenGap + rightW);
      canvasHeight += labelHeight + labelGap + Math.max(leftH, rightH);
    }

    canvasWidth += padding * 2;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(canvasWidth * dpr);
    canvas.height = Math.ceil(canvasHeight * dpr);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let y = padding;
    for (const row of rows) {
      const leftMetrics = row.left.matrix ? getCoordLabelMetrics(row.left.matrix, cellSize) : { left: 0, top: 0 };
      const leftW = row.left.matrix ? leftMetrics.left + row.left.matrix.cols * cellSize : 0;
      const leftH = row.left.matrix ? leftMetrics.top + row.left.matrix.rows * cellSize : 0;

      const rightW = row.right.matrix
        ? getCoordLabelMetrics(row.right.matrix, cellSize).left + row.right.matrix.cols * cellSize
        : (row.right.blankSize?.cols || 0) * cellSize;
      const rightH = row.right.matrix
        ? getCoordLabelMetrics(row.right.matrix, cellSize).top + row.right.matrix.rows * cellSize
        : (row.right.blankSize?.rows || 0) * cellSize;

      const blockH = Math.max(leftH, rightH);
      const matrixTop = y + labelHeight + labelGap;
      const xLeft = padding;
      const xRight = xLeft + leftW + betweenGap;

      ctx.font = `650 ${labelFontSize}px ${fontFamily}`;
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(row.left.label, xLeft, y);
      ctx.fillText(row.right.label, xRight, y);

      if (row.left.matrix) drawMatrixWithCoords(ctx, row.left.matrix, xLeft, matrixTop, cellSize, colorMap, leftMetrics, lineStyle);
      if (row.right.matrix) {
        const rightMetrics = getCoordLabelMetrics(row.right.matrix, cellSize);
        drawMatrixWithCoords(ctx, row.right.matrix, xRight, matrixTop, cellSize, colorMap, rightMetrics, lineStyle);
      }

      ctx.font = `700 ${Math.max(16, Math.round(cellSize * 0.9))}px ${fontFamily}`;
      ctx.fillStyle = 'rgba(17,24,39,0.55)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('→', xLeft + leftW + betweenGap / 2, matrixTop + blockH / 2);

      y += labelHeight + labelGap + blockH + rowGap;
    }

    return canvas;
  }

  function canvasToPngBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('生成图片失败：canvas.toBlob 返回空'));
      }, 'image/png');
    });
  }

  async function copyPngBlobToClipboard(blob) {
    if (!navigator.clipboard?.write) throw new Error('Clipboard API 不可用（无法写入图片）');
    if (typeof window.ClipboardItem !== 'function') throw new Error('ClipboardItem 不可用（无法写入图片）');
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID}{
        position:fixed;
        right:16px;
        bottom:16px;
        z-index:999999;
        font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        color:#e5e7eb;
        background: rgba(17, 24, 39, 0.92);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 10px;
        padding: 10px;
        width: 332px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        backdrop-filter: blur(8px);
      }
      #${PANEL_ID} .agh-row{ display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; }
      #${PANEL_ID} .agh-btn{
        appearance:none;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.06);
        color: inherit;
        border-radius: 8px;
        padding: 6px 8px;
        cursor:pointer;
      }
      #${PANEL_ID} .agh-btn:hover{ background: rgba(255,255,255,0.10); }
      #${PANEL_ID} .agh-btn[data-on="true"]{
        border-color: rgba(147, 197, 253, 0.75);
        box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.15);
      }
      #${PANEL_ID} .agh-ta{
        width:100%;
        min-height: 110px;
        resize: vertical;
        margin-top:8px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.06);
        color: inherit;
        border-radius: 8px;
        padding: 8px;
        outline: none;
      }
      #${PANEL_ID} .agh-ta:focus{
        border-color: rgba(147, 197, 253, 0.6);
        box-shadow: 0 0 0 2px rgba(147, 197, 253, 0.15);
      }
      #${PANEL_ID} .agh-title{ font-weight: 650; letter-spacing: 0.2px; }
      #${PANEL_ID} .agh-status{ margin-top:8px; color:#93c5fd; white-space: pre-wrap; }
      #${PANEL_ID} .agh-status.err{ color:#fca5a5; }
    `;
    document.documentElement.appendChild(style);
  }

  function detectSite() {
    if (location.hostname === 'cogito-ergo-loot.h-e.top') return 'cogito';
    if (location.hostname === 'arcprize.org' && location.pathname.startsWith('/play')) return 'arcprize';
    return null;
  }

  function createCogitoAdapter() {
    function parseArcCellValue(cellEl) {
      for (const cls of cellEl.classList) {
        const match = /^arc-cell-(\d+)$/.exec(cls);
        if (match) return Number(match[1]);
      }
      return 0;
    }

    function countGridTracks(trackValue) {
      const normalized = String(trackValue || '').trim();
      if (!normalized || normalized === 'none') return 0;
      return normalized.split(/\s+/).filter(Boolean).length;
    }

    function parseGrid(gridEl) {
      const style = getComputedStyle(gridEl);
      const cols = countGridTracks(style.gridTemplateColumns);
      const rows = countGridTracks(style.gridTemplateRows);
      const flat = Array.from(gridEl.children).map(parseArcCellValue);
      if (rows * cols !== flat.length) throw new Error(`grid size mismatch: rows=${rows} cols=${cols} cells=${flat.length}`);
      const data = Array.from({ length: rows }, (_, r) => flat.slice(r * cols, (r + 1) * cols));
      return { rows, cols, data };
    }

    function parseGridSize(gridEl) {
      const style = getComputedStyle(gridEl);
      const cols = countGridTracks(style.gridTemplateColumns);
      const rows = countGridTracks(style.gridTemplateRows);
      return { rows, cols };
    }

    function findSectionByIncludes(...snippets) {
      const sections = Array.from(document.querySelectorAll('section'));
      return sections.find((s) => snippets.every((t) => s.innerText.includes(t))) || null;
    }

    function findExamplePairs() {
      const exampleSection = findSectionByIncludes('示例', '输入 1', '输出 1');
      if (!exampleSection) return null;
      const grids = Array.from(exampleSection.querySelectorAll('div.inline-grid'));
      if (grids.length < 2) return null;
      const pairs = [];
      for (let i = 0; i + 1 < grids.length; i += 2) pairs.push({ input: parseGrid(grids[i]), output: parseGrid(grids[i + 1]) });
      return pairs.length ? pairs : null;
    }

    function findTaskGrids() {
      const section =
        findSectionByIncludes('测试输入', '你的答案') ||
        findSectionByIncludes('题目输入', '你的答案') ||
        findSectionByIncludes('测试', '你的答案') ||
        findSectionByIncludes('题目', '你的答案');
      if (!section) return null;

      const grids = Array.from(section.querySelectorAll('div.inline-grid'));
      if (grids.length < 2) return null;

      const answerEl = grids.find((g) => g.className.includes('cursor-pointer')) || grids[1];
      const inputEl = grids.find((g) => g !== answerEl) || grids[0];
      return { inputEl, answerEl };
    }

    function clickButtonByText(text) {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text);
      if (!btn) return false;
      btn.click();
      return true;
    }

    function selectPaletteColor(color) {
      const btn = Array.from(document.querySelectorAll('button[role="radio"]')).find((b) => b.textContent.trim() === String(color));
      if (!btn) return false;
      btn.click();
      return true;
    }

    async function paintAnswerGrid(answerEl, desiredMatrix) {
      const size = parseGridSize(answerEl);
      if (size.rows !== desiredMatrix.rows || size.cols !== desiredMatrix.cols) {
        throw new Error(`答案尺寸不匹配：页面是 ${size.rows}×${size.cols}，输入是 ${desiredMatrix.rows}×${desiredMatrix.cols}`);
      }

      clickButtonByText('涂抹');
      await sleep(25);

      const cells = Array.from(answerEl.children);
      const desiredFlat = desiredMatrix.data.flat();
      if (cells.length !== desiredFlat.length) throw new Error(`答案格子数量不匹配：页面是 ${cells.length}，输入是 ${desiredFlat.length}`);

      const byColor = new Map();
      for (let i = 0; i < desiredFlat.length; i++) {
        const want = desiredFlat[i];
        const have = parseArcCellValue(cells[i]);
        if (have === want) continue;
        if (!byColor.has(want)) byColor.set(want, []);
        byColor.get(want).push(i);
      }

      const colors = Array.from(byColor.keys()).sort((a, b) => a - b);
      for (const color of colors) {
        if (!selectPaletteColor(color)) throw new Error(`找不到调色板颜色：${color}`);
        await sleep(10);
        const indices = byColor.get(color) || [];
        for (let j = 0; j < indices.length; j++) {
          cells[indices[j]].click();
          if (j % 200 === 199) await sleep(0);
        }
        await sleep(10);
      }
    }

    function getDigitColorMapForImage(sampleGridEl) {
      const map = new Map();
      if (sampleGridEl) {
        const style = getComputedStyle(sampleGridEl);
        for (let d = 0; d <= 9; d++) {
          const v = style.getPropertyValue(`--arc-${d}`).trim();
          if (v) map.set(d, v);
        }
        if (map.size >= 6) return map;
      }

      for (let d = 0; d <= 9; d++) {
        const cell = document.querySelector(`div.inline-grid .arc-cell-${d}`);
        if (!cell) continue;
        const bg = getComputedStyle(cell).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)') map.set(d, bg);
      }

      const fallback = ['#000000', '#0074D9', '#FF4136', '#2ECC40', '#FFDC00', '#AAAAAA', '#F012BE', '#FF851B', '#7FDBFF', '#870C25'];
      for (let d = 0; d <= 9; d++) if (!map.has(d)) map.set(d, fallback[d]);
      return map;
    }

    function isPuzzlePage() {
      return Boolean(findTaskGrids()) && Boolean(document.querySelector('button[role="radio"]'));
    }

    return {
      title: 'CEL 助手',
      isPuzzlePage,
      findExamplePairs,
      findTaskGrids,
      parseGrid,
      parseGridSize,
      paintAnswerGrid,
      getDigitColorMapForImage,
      taskNotFoundMessage: '找不到题目区（“题目输入/你的答案”）',
      lineStyle: {
        inner: [
          { color: 'rgba(255,255,255,0.22)', width: 2 },
          { color: 'rgba(0,0,0,0.28)', width: 1 },
        ],
        border: [
          { color: 'rgba(255,255,255,0.30)', width: 3 },
          { color: 'rgba(0,0,0,0.55)', width: 2 },
        ],
      },
      enableCmdSDoubleSkip: true,
      skipCurrentPuzzle: () => clickButtonByText('跳过此题'),
    };
  }

  function createArcPrizeAdapter() {
    function parseCellValue(cellEl) {
      if (!cellEl) return 0;
      for (const cls of cellEl.classList) {
        const m = /^symbol_(\d+)$/.exec(cls);
        if (m) return Number(m[1]);
      }
      return 0;
    }

    function parseGrid(gridEl) {
      if (!gridEl) throw new Error('grid element is null');
      const rows = Array.from(gridEl.querySelectorAll(':scope > .grid-row'));
      const rowEls = rows.length ? rows : Array.from(gridEl.querySelectorAll('.grid-row'));
      const rowCount = rowEls.length;
      const colCount = rowEls[0]?.children?.length || 0;
      if (!rowCount || !colCount) throw new Error('grid has zero rows/cols');

      const data = rowEls.map((rowEl) => {
        const cells = Array.from(rowEl.children);
        if (cells.length !== colCount) throw new Error(`grid row has inconsistent cols: expected ${colCount}, got ${cells.length}`);
        return cells.map(parseCellValue);
      });
      return { rows: rowCount, cols: colCount, data };
    }

    function parseGridSize(gridEl) {
      const rows = Array.from(gridEl?.querySelectorAll?.(':scope > .grid-row') || []);
      const rowCount = rows.length ? rows.length : Array.from(gridEl?.querySelectorAll?.('.grid-row') || []).length;
      const firstRow = rows.length ? rows[0] : gridEl?.querySelector?.('.grid-row');
      const colCount = firstRow?.children?.length || 0;
      return { rows: rowCount, cols: colCount };
    }

    function findExamplePairs() {
      const train = document.getElementById('task_train');
      if (!train) return null;
      const pairEls = Array.from(train.querySelectorAll('.pair-preview'));
      if (!pairEls.length) return null;
      return pairEls
        .map((pairEl) => {
          const inputEl = pairEl.querySelector('.input_preview');
          const outputEl = pairEl.querySelector('.output_preview');
          if (!inputEl || !outputEl) return null;
          return { input: parseGrid(inputEl), output: parseGrid(outputEl) };
        })
        .filter(Boolean);
    }

    function findTaskGrids() {
      const test = document.getElementById('task_test');
      if (!test) return null;
      const inputEl = test.querySelector('.input_preview');
      const answerEl =
        document.querySelector('#output_grid .output_preview') ||
        test.querySelector('.output_preview.edition_grid') ||
        test.querySelector('.output_preview');
      if (!inputEl || !answerEl) return null;
      return { inputEl, answerEl };
    }

    function ensureEditMode() {
      const editInput = document.getElementById('tool_edit');
      if (editInput && editInput.checked) return true;
      const label = document.querySelector('label[for="tool_edit"]');
      if (label) {
        label.click();
        return true;
      }
      if (editInput) {
        editInput.click();
        return true;
      }
      return false;
    }

    function selectPaletteColor(color) {
      const picker = document.getElementById('symbol_picker');
      if (!picker) return false;
      const el = picker.querySelector(`.symbol_preview.symbol_${color}`);
      if (!el) return false;
      el.click();
      return true;
    }

    async function paintAnswerGrid(answerEl, desiredMatrix) {
      const size = parseGridSize(answerEl);
      if (size.rows !== desiredMatrix.rows || size.cols !== desiredMatrix.cols) {
        throw new Error(`答案尺寸不匹配：页面是 ${size.rows}×${size.cols}，输入是 ${desiredMatrix.rows}×${desiredMatrix.cols}`);
      }

      ensureEditMode();
      await sleep(10);

      const cells = Array.from(answerEl.querySelectorAll('.grid-row > .cell'));
      const desiredFlat = desiredMatrix.data.flat();
      if (cells.length !== desiredFlat.length) throw new Error(`答案格子数量不匹配：页面是 ${cells.length}，输入是 ${desiredFlat.length}`);

      const byColor = new Map();
      for (let i = 0; i < desiredFlat.length; i++) {
        const want = desiredFlat[i];
        const have = parseCellValue(cells[i]);
        if (have === want) continue;
        if (!byColor.has(want)) byColor.set(want, []);
        byColor.get(want).push(i);
      }

      const colors = Array.from(byColor.keys()).sort((a, b) => a - b);
      for (const color of colors) {
        if (!selectPaletteColor(color)) throw new Error(`找不到调色板颜色：${color}`);
        await sleep(5);
        const indices = byColor.get(color) || [];
        for (let j = 0; j < indices.length; j++) {
          cells[indices[j]].click();
          if (j % 250 === 249) await sleep(0);
        }
        await sleep(5);
      }
    }

    function getDigitColorMapForImage() {
      const picker = document.getElementById('symbol_picker');
      const map = new Map();
      if (picker) {
        for (const el of Array.from(picker.querySelectorAll('.symbol_preview'))) {
          const m = /symbol_(\d+)/.exec(el.className);
          if (!m) continue;
          const d = Number(m[1]);
          const bg = getComputedStyle(el).backgroundColor;
          map.set(d, bg && bg !== 'rgba(0, 0, 0, 0)' ? bg : '#000000');
        }
      }

      const fallback = ['#000000', '#1E93FF', '#F93C31', '#4FCC30', '#FFDC00', '#999999', '#E53AA3', '#FF851B', '#87D8F1', '#921231'];
      for (let d = 0; d <= 9; d++) if (!map.has(d)) map.set(d, fallback[d]);
      return map;
    }

    function isPuzzlePage() {
      return Boolean(findTaskGrids()) && Boolean(document.getElementById('symbol_picker'));
    }

    return {
      title: 'ARC 助手',
      isPuzzlePage,
      findExamplePairs,
      findTaskGrids,
      parseGrid,
      parseGridSize,
      paintAnswerGrid,
      getDigitColorMapForImage,
      taskNotFoundMessage: '找不到题目区（Input/Output）',
      lineStyle: {
        inner: [
          { color: 'rgba(124,58,237,0.62)', width: 2 },
          { color: 'rgba(255,255,255,0.34)', width: 1 },
        ],
        border: [
          { color: 'rgba(124,58,237,0.78)', width: 3 },
          { color: 'rgba(255,255,255,0.38)', width: 2 },
        ],
      },
      enableCmdSDoubleSkip: false,
    };
  }

  function setStatus(panelEl, msg, isErr = false) {
    const el = panelEl?.querySelector?.('.agh-status');
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle('err', Boolean(isErr));
  }

  function mountPanel(adapter) {
    if (document.getElementById(PANEL_ID)) return;
    ensureStyles();

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="agh-title">${adapter.title}</div>
      <div class="agh-row">
        <button class="agh-btn" type="button" data-action="export-json">复制题目 JSON</button>
        <button class="agh-btn" type="button" data-action="export-code">复制题目 代码块</button>
        <button class="agh-btn" type="button" data-action="export-image">下载+复制 图片</button>
      </div>
      <textarea class="agh-ta" data-el="answer-input" placeholder="粘贴 AI 的答案矩阵（数字 + 空格分隔，换行分行）。粘贴后会自动填写，也可点“填写答案”。"></textarea>
      <div class="agh-row">
        <button class="agh-btn" type="button" data-action="fill-answer">填写答案</button>
        <button class="agh-btn" type="button" data-action="clear-answer">清空</button>
        <button class="agh-btn" type="button" data-action="toggle-live" data-on="false">实时渲染：关</button>
      </div>
      <div class="agh-status"></div>
    `;

    const answerTa = panel.querySelector('textarea[data-el="answer-input"]');
    const fillBtn = panel.querySelector('button[data-action="fill-answer"]');
    const liveBtn = panel.querySelector('button[data-action="toggle-live"]');
    let liveEnabled = false;
    let liveTimer = null;
    let applyInProgress = false;
    let applyPending = false;

    const setLiveEnabled = (enabled) => {
      liveEnabled = Boolean(enabled);
      if (liveBtn) {
        liveBtn.setAttribute('data-on', String(liveEnabled));
        liveBtn.textContent = `实时渲染：${liveEnabled ? '开' : '关'}`;
      }
      if (!liveEnabled && liveTimer) {
        clearTimeout(liveTimer);
        liveTimer = null;
      }
    };

    const scheduleLiveApply = (delayMs = 400) => {
      if (!liveEnabled) return;
      if (!answerTa) return;
      if (liveTimer) clearTimeout(liveTimer);
      liveTimer = setTimeout(() => {
        liveTimer = null;
        if (!liveEnabled) return;
        if (!answerTa.value.trim()) {
          setStatus(panel, '实时渲染：等待粘贴答案矩阵');
          return;
        }
        fillBtn?.click();
      }, delayMs);
    };

    if (answerTa && fillBtn) {
      answerTa.addEventListener('paste', () => setTimeout(() => fillBtn.click(), 0));
      answerTa.addEventListener('input', () => scheduleLiveApply());
      answerTa.addEventListener('keydown', (e) => {
        const isSubmit = (e.ctrlKey || e.metaKey) && e.key === 'Enter';
        if (!isSubmit) return;
        e.preventDefault();
        fillBtn.click();
      });
    }

    if (adapter.enableCmdSDoubleSkip) {
      let lastCmdSTs = 0;
      window.addEventListener(
        'keydown',
        (e) => {
          try {
            if (!e || e.defaultPrevented) return;
            if (e.isComposing || e.repeat) return;

            const isKeyS = e.code === 'KeyS' || String(e.key || '').toLowerCase() === 's';
            const isCmdS = Boolean(isKeyS && e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey);
            if (!isCmdS) return;
            if (!adapter.isPuzzlePage()) return;

            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();

            const now = Date.now();
            if (now - lastCmdSTs <= CMD_S_DOUBLE_PRESS_MS) {
              lastCmdSTs = 0;
              const ok = adapter.skipCurrentPuzzle?.();
              if (!ok) setStatus(panel, '未找到“跳过此题”按钮', true);
              else setStatus(panel, '已触发：跳过此题');
              return;
            }
            lastCmdSTs = now;
            setStatus(panel, '已拦截 Cmd+S（再按一次 Cmd+S 跳过此题）');
          } catch (_) {}
        },
        true,
      );
    }

    panel.addEventListener('click', async (e) => {
      const btn = e.target?.closest?.('button[data-action]');
      const action = btn?.getAttribute?.('data-action');
      if (!action) return;

      try {
        const task = adapter.findTaskGrids();
        if (!task) throw new Error(adapter.taskNotFoundMessage || '找不到题目区');
        const answerSize = adapter.parseGridSize(task.answerEl);
        if (!answerSize.rows || !answerSize.cols) throw new Error('读取答案区尺寸失败（可能还没加载完成）');

        if (action === 'toggle-live') {
          setLiveEnabled(!liveEnabled);
          setStatus(panel, `实时渲染：已${liveEnabled ? '开启' : '关闭'}`);
          if (liveEnabled) scheduleLiveApply(0);
          return;
        }

        if (action === 'clear-answer') {
          if (answerTa) answerTa.value = '';
          setStatus(panel, '已清空输入框');
          return;
        }

        if (action === 'fill-answer') {
          if (applyInProgress) {
            applyPending = true;
            return;
          }
          const raw = answerTa?.value || '';
          if (!raw.trim()) throw new Error('请输入/粘贴答案矩阵');

          applyInProgress = true;
          try {
            const desired = parseAnswerMatrixFromText(raw, answerSize.rows, answerSize.cols);
            setStatus(panel, `正在填写 ${answerSize.rows}×${answerSize.cols}...`);
            await adapter.paintAnswerGrid(task.answerEl, desired);
            setStatus(panel, `已填写 ${answerSize.rows}×${answerSize.cols} ✅`);
            return;
          } finally {
            applyInProgress = false;
            if (applyPending) {
              applyPending = false;
              scheduleLiveApply(0);
            }
          }
        }

        const pairs = adapter.findExamplePairs();
        if (!pairs || !pairs.length) throw new Error('找不到示例区');
        const taskInput = adapter.parseGrid(task.inputEl);

        if (action === 'export-code') {
          const sizeTag = (m) => `${m.rows}x${m.cols}`;
          const answerTag = `${answerSize.rows}x${answerSize.cols}`;
          const answerDims = `${answerSize.rows}×${answerSize.cols}`;
          const parts = [];
          for (let i = 0; i < pairs.length; i++) {
            const idx = i + 1;
            parts.push(`示例${idx} 输入\n${wrapCodeBlock(formatMatrixWithSpaces(pairs[i].input), sizeTag(pairs[i].input))}`);
            parts.push(`示例${idx} 输出\n${wrapCodeBlock(formatMatrixWithSpaces(pairs[i].output), sizeTag(pairs[i].output))}`);
          }
          parts.push(`题目输入\n${wrapCodeBlock(formatMatrixWithSpaces(taskInput), sizeTag(taskInput))}`);
          parts.push(`你的答案：${answerDims}\n${wrapCodeBlock('', answerTag)}`);
          const ok = await copyText(parts.join('\n\n'));
          if (!ok) throw new Error('复制失败（剪贴板权限？）');
          setStatus(panel, '已复制 代码块格式到剪贴板');
          return;
        }

        if (action === 'export-json') {
          const payload = {
            examples: pairs.map((p) => ({ input: p.input.data, output: p.output.data, size: { rows: p.input.rows, cols: p.input.cols } })),
            task: { input: taskInput.data, answerSize, size: { rows: taskInput.rows, cols: taskInput.cols } },
          };
          const ok = await copyText(JSON.stringify(payload));
          if (!ok) throw new Error('复制失败（剪贴板权限？）');
          setStatus(panel, '已复制 JSON 到剪贴板');
          return;
        }

        if (action === 'export-image') {
          setStatus(panel, '正在生成高清图片...');
          const colorMap = adapter.getDigitColorMapForImage(task.answerEl);
          const canvas = renderCompositeImageCanvas(pairs, taskInput, answerSize, colorMap, adapter.lineStyle, {
            taskLabelPrefix: '题目输入',
            answerLabelPrefix: '你的答案',
          });
          const blob = await canvasToPngBlob(canvas);
          const filename = `${detectSite()}_${taskInput.rows}x${taskInput.cols}.png`;

          let copied = false;
          try {
            await copyPngBlobToClipboard(blob);
            copied = true;
          } catch (err) {
            setStatus(panel, `图片已生成并下载；复制到剪贴板失败：${String(err?.message || err)}`, true);
          }

          downloadBlob(blob, filename);
          if (copied) setStatus(panel, '图片已复制到剪贴板，并已开始下载');
          return;
        }
      } catch (err) {
        setStatus(panel, String(err?.message || err), true);
      }
    });

    document.documentElement.appendChild(panel);
    setStatus(panel, '就绪：支持复制题目，也支持粘贴答案矩阵并填写');
  }

  function main() {
    const site = detectSite();
    if (!site) return;

    const adapter = site === 'cogito' ? createCogitoAdapter() : createArcPrizeAdapter();

    const ensureMounted = () => {
      if (document.getElementById(PANEL_ID)) return;
      if (!adapter.isPuzzlePage()) return;
      mountPanel(adapter);
    };

    const obs = new MutationObserver(() => ensureMounted());
    obs.observe(document.documentElement, { childList: true, subtree: true });
    ensureMounted();
  }

  main();
})();

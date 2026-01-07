// ==UserScript==
// @author       frtyf
// @license      MIT
// @name         Gemini 批量发送提示词（支持导入XLS/CSV/TSV + 生成完成检测）
// @namespace    https://example.com/
// @version      2.2.0
// @description  在 gemini.google.com 批量输入并发送多条提示词；支持从 xls/xlsx/csv/tsv 导入两列(产品/提示词)；更稳发送按钮查找 + 生成完成检测（含 Enter/Ctrl+Enter 兜底）
// @match        https://gemini.google.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/561706/Gemini%20%E6%89%B9%E9%87%8F%E5%8F%91%E9%80%81%E6%8F%90%E7%A4%BA%E8%AF%8D%EF%BC%88%E6%94%AF%E6%8C%81%E5%AF%BC%E5%85%A5XLSCSVTSV%20%2B%20%E7%94%9F%E6%88%90%E5%AE%8C%E6%88%90%E6%A3%80%E6%B5%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561706/Gemini%20%E6%89%B9%E9%87%8F%E5%8F%91%E9%80%81%E6%8F%90%E7%A4%BA%E8%AF%8D%EF%BC%88%E6%94%AF%E6%8C%81%E5%AF%BC%E5%85%A5XLSCSVTSV%20%2B%20%E7%94%9F%E6%88%90%E5%AE%8C%E6%88%90%E6%A3%80%E6%B5%8B%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INPUT_XPATH =
    '/html/body/chat-app/main/side-navigation-v2/mat-sidenav-container/mat-sidenav-content/div/div[2]/chat-window/div/input-container/div/input-area-v2/div/div/div[1]/div/div/rich-textarea/div[1]/p';

  const SEND_BUTTON_XPATH =
    '//*[@aria-label="Send message" or @aria-label="Send" or @aria-label="发送" or @aria-label="发送消息" or @title="Send message" or @title="Send" or @title="发送" or @title="发送消息"]';

  const PANEL_ID = 'gemini-batch-panel';

  // ====== 运行时队列（来自 textarea 或文件）======
  let loadedRows = [];     // [{product, prompt, raw}]
  let loadedPrompts = [];  // ["...prompt...", ...]
  let stopFlag = false;

  function initPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.zIndex = '9999';
    panel.style.background = 'rgba(255, 255, 255, 0.95)';
    panel.style.border = '1px solid #ccc';
    panel.style.padding = '12px';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    panel.style.width = '340px';
    panel.style.borderRadius = '6px';
    panel.style.fontFamily = 'Arial, sans-serif';

    const title = document.createElement('h4');
    title.innerText = 'Gemini 批量发送（支持导入表格）';
    title.style.margin = '0 0 10px';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    panel.appendChild(title);

    // ===== 文件导入区 =====
    const fileWrap = document.createElement('div');
    fileWrap.style.display = 'flex';
    fileWrap.style.flexDirection = 'column';
    fileWrap.style.gap = '6px';
    fileWrap.style.marginBottom = '10px';

    const fileRow = document.createElement('div');
    fileRow.style.display = 'flex';
    fileRow.style.gap = '8px';
    fileRow.style.alignItems = 'center';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv,.tsv,.txt';
    fileInput.style.flex = '1';

    const loadBtn = document.createElement('button');
    loadBtn.innerText = '导入文件';
    loadBtn.style.padding = '6px 10px';
    loadBtn.style.cursor = 'pointer';

    fileRow.appendChild(fileInput);
    fileRow.appendChild(loadBtn);
    fileWrap.appendChild(fileRow);

    const fileHint = document.createElement('div');
    fileHint.style.fontSize = '12px';
    fileHint.style.color = '#666';
    fileHint.innerText = '模板：两列【产品】【提示词】，每行一条。支持 xlsx / xls / csv / tsv / txt。';
    fileWrap.appendChild(fileHint);

    // 选项：发送时是否把产品名拼到提示词前面
    const optRow = document.createElement('label');
    optRow.style.display = 'flex';
    optRow.style.alignItems = 'center';
    optRow.style.gap = '6px';
    optRow.style.fontSize = '12px';
    optRow.style.color = '#333';

    const chkPrefix = document.createElement('input');
    chkPrefix.type = 'checkbox';
    chkPrefix.checked = false;

    const chkText = document.createElement('span');
    chkText.innerText = '发送时在提示词前加产品名（例如：产品：xxx）';

    optRow.appendChild(chkPrefix);
    optRow.appendChild(chkText);
    fileWrap.appendChild(optRow);

    panel.appendChild(fileWrap);

    // ===== 旧的 textarea 仍保留（可手动）=====
    const textarea = document.createElement('textarea');
    textarea.id = 'gemini-batch-textarea';
    textarea.placeholder =
      '手动模式：每行一条提示词\n或导入文件后自动填充到这里（你也可以再编辑）';
    textarea.style.width = '100%';
    textarea.style.height = '140px';
    textarea.style.boxSizing = 'border-box';
    textarea.style.padding = '8px';
    textarea.style.border = '1px solid #ddd';
    textarea.style.borderRadius = '4px';
    textarea.style.fontSize = '13px';
    textarea.style.resize = 'vertical';
    panel.appendChild(textarea);

    // ===== delay/maxWait =====
    const delayContainer = document.createElement('div');
    delayContainer.style.marginTop = '10px';
    delayContainer.style.display = 'flex';
    delayContainer.style.alignItems = 'center';
    delayContainer.style.gap = '8px';

    const delayLabel = document.createElement('label');
    delayLabel.innerText = '每条间隔(s):';
    delayLabel.style.fontSize = '13px';
    delayContainer.appendChild(delayLabel);

    const delayInput = document.createElement('input');
    delayInput.id = 'gemini-batch-delay';
    delayInput.type = 'number';
    delayInput.value = '3';
    delayInput.style.width = '90px';
    delayInput.style.padding = '4px';
    delayInput.style.border = '1px solid #ddd';
    delayInput.style.borderRadius = '4px';
    delayContainer.appendChild(delayInput);

    panel.appendChild(delayContainer);

    const maxWaitContainer = document.createElement('div');
    maxWaitContainer.style.marginTop = '8px';
    maxWaitContainer.style.display = 'flex';
    maxWaitContainer.style.alignItems = 'center';
    maxWaitContainer.style.gap = '8px';

    const maxWaitLabel = document.createElement('label');
    maxWaitLabel.innerText = '单条最长等待(s):';
    maxWaitLabel.style.fontSize = '13px';
    maxWaitContainer.appendChild(maxWaitLabel);

    const maxWaitInput = document.createElement('input');
    maxWaitInput.id = 'gemini-batch-maxwait';
    maxWaitInput.type = 'number';
    maxWaitInput.value = '90';
    maxWaitInput.style.width = '90px';
    maxWaitInput.style.padding = '4px';
    maxWaitInput.style.border = '1px solid #ddd';
    maxWaitInput.style.borderRadius = '4px';
    maxWaitContainer.appendChild(maxWaitInput);

    panel.appendChild(maxWaitContainer);

    // ===== start/stop/status =====
    const startBtn = document.createElement('button');
    startBtn.id = 'gemini-batch-start';
    startBtn.innerText = '开始发送';
    startBtn.style.marginTop = '10px';
    startBtn.style.padding = '8px 16px';
    startBtn.style.cursor = 'pointer';
    startBtn.style.backgroundColor = '#4285f4';
    startBtn.style.color = 'white';
    startBtn.style.border = 'none';
    startBtn.style.borderRadius = '4px';
    startBtn.style.fontSize = '14px';
    startBtn.style.fontWeight = 'bold';
    startBtn.style.width = '100%';
    panel.appendChild(startBtn);

    const stopBtn = document.createElement('button');
    stopBtn.id = 'gemini-batch-stop';
    stopBtn.innerText = '停止';
    stopBtn.style.marginTop = '8px';
    stopBtn.style.padding = '8px 16px';
    stopBtn.style.cursor = 'pointer';
    stopBtn.style.backgroundColor = '#d93025';
    stopBtn.style.color = 'white';
    stopBtn.style.border = 'none';
    stopBtn.style.borderRadius = '4px';
    stopBtn.style.fontSize = '14px';
    stopBtn.style.fontWeight = 'bold';
    stopBtn.style.width = '100%';
    stopBtn.disabled = true;
    panel.appendChild(stopBtn);

    const status = document.createElement('div');
    status.id = 'gemini-batch-status';
    status.style.marginTop = '10px';
    status.style.fontSize = '12px';
    status.style.color = '#666';
    status.style.padding = '6px';
    status.style.backgroundColor = '#f5f5f5';
    status.style.borderRadius = '4px';
    status.style.minHeight = '40px';
    status.style.whiteSpace = 'pre-wrap';
    panel.appendChild(status);

    document.body.appendChild(panel);

    // ===== 事件：停止 =====
    stopBtn.addEventListener('click', () => {
      stopFlag = true;
      status.innerText = '已请求停止：将于当前条结束后停止。';
    });

    // ===== 事件：导入文件 =====
    loadBtn.addEventListener('click', async () => {
      const f = fileInput.files && fileInput.files[0];
      if (!f) {
        alert('请先选择一个文件');
        return;
      }
      status.innerText = `正在导入：${f.name} ...`;
      try {
        const { rows, prompts } = await parseFileToPrompts(f);
        loadedRows = rows;
        loadedPrompts = prompts;

        // 同步填充到 textarea（方便你手动修订）
        textarea.value = prompts.join('\n');

        const preview = rows.slice(0, 3).map((r, idx) => {
          const p = (r.prompt || '').replace(/\s+/g, ' ').slice(0, 120);
          return `${idx + 1}) 产品=${r.product || ''} | 提示词=${p}${p.length >= 120 ? '...' : ''}`;
        }).join('\n');

        status.innerText = `导入成功：${prompts.length} 条\n预览(前3条)：\n${preview}`;
      } catch (e) {
        console.error(e);
        alert('导入失败：' + (e && e.message ? e.message : e));
        status.innerText = '导入失败（控制台可看详细错误）';
      }
    });

    // ===== 事件：开始发送 =====
    startBtn.addEventListener('click', async () => {
      // 以 textarea 为准（因为导入后也会写入 textarea，且你可能修改过）
      const prompts = textarea.value
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      if (!prompts.length) {
        alert('请先输入提示词或导入文件');
        return;
      }

      const delaySec = parseFloat(delayInput.value) || 3;
      const delay = Math.max(0, delaySec) * 1000;
      const maxWaitSec = parseInt(maxWaitInput.value, 10) || 90;

      stopFlag = false;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      startBtn.style.backgroundColor = '#ccc';

      try {
        // 如果勾选“加产品名”，我们用 loadedRows 对齐补前缀；对齐不上就只发送原提示词
        const finalPrompts = buildFinalPrompts(prompts, loadedRows, chkPrefix.checked);
        await runBatch(finalPrompts, delay, maxWaitSec, status, () => stopFlag);
      } finally {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        startBtn.style.backgroundColor = '#4285f4';
      }
    });
  }

  function buildFinalPrompts(textareaPrompts, rows, addPrefix) {
    if (!addPrefix) return textareaPrompts;

    // 尝试按行数对齐 rows
    if (rows && rows.length === textareaPrompts.length) {
      return textareaPrompts.map((p, i) => {
        const prod = rows[i].product ? String(rows[i].product).trim() : '';
        if (!prod) return p;
        return `产品：${prod}\n${p}`;
      });
    }

    // 对齐不上就不加，避免错位
    return textareaPrompts;
  }

  async function runBatch(prompts, delay, maxWaitSec, statusEl, shouldStop) {
    statusEl.innerText = '开始发送...';

    for (let i = 0; i < prompts.length; i++) {
      if (shouldStop()) {
        statusEl.innerText = `已停止。进度：${i} / ${prompts.length}`;
        return;
      }

      const prompt = prompts[i];
      statusEl.innerText = `发送第 ${i + 1} / ${prompts.length} 条...\n${prompt}`;

      const filled = fillPrompt(prompt);
      if (!filled) {
        alert('未找到输入框，终止。');
        statusEl.innerText = '终止：未找到输入框';
        return;
      }

      await wait(250);

      const sent = clickSend();
      if (!sent) {
        alert('未找到发送按钮/键盘发送失败，终止。');
        statusEl.innerText = '终止：发送失败';
        return;
      }

      statusEl.innerText = `等待第 ${i + 1} 条生成完成...\n（最长 ${maxWaitSec}s）`;
      await waitForGeneration(maxWaitSec, shouldStop);

      if (shouldStop()) {
        statusEl.innerText = `已停止。进度：${i + 1} / ${prompts.length}`;
        return;
      }

      if (i < prompts.length - 1) {
        statusEl.innerText = `第 ${i + 1} 条完成。\n等待 ${delay}s 后发送下一条...`;
        await wait(delay);
      }
    }

    statusEl.innerText = '全部提示词发送完成！';
  }

  function fillPrompt(text) {
    const inputNode = findInputNode();
    if (!inputNode) return false;

    inputNode.focus();

    try {
      inputNode.textContent = '';
      inputNode.dispatchEvent(new InputEvent('input', { bubbles: true }));
    } catch {}

    let ok = false;
    try {
      ok = document.execCommand && document.execCommand('insertText', false, text);
    } catch {
      ok = false;
    }
    if (!ok) inputNode.textContent = text;

    try {
      inputNode.dispatchEvent(new InputEvent('input', { bubbles: true }));
    } catch {}

    return true;
  }

  function clickSend() {
    const btn = findSendButton();
    if (btn) {
      btn.click();
      return true;
    }

    // Enter 兜底（有些情况下 Enter 只是换行）
    const inputNode = findInputNode();
    if (inputNode) {
      inputNode.focus();

      // 1) 普通 Enter
      if (dispatchEnter(inputNode, false)) return true;

      // 2) Ctrl+Enter 再试一次
      if (dispatchEnter(inputNode, true)) return true;

      // 3) form submit
      const form = inputNode.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return true;
      }
    }
    return false;
  }

  function dispatchEnter(target, ctrl) {
    try {
      const evDown = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        ctrlKey: !!ctrl,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      });
      const evUp = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        ctrlKey: !!ctrl,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      });
      target.dispatchEvent(evDown);
      target.dispatchEvent(evUp);
      return true;
    } catch {
      return false;
    }
  }

  function findInputNode() {
    const viaXPath = evaluateXPath(INPUT_XPATH);
    if (viaXPath) return viaXPath;

    const richTextarea = document.querySelector('rich-textarea');
    if (richTextarea) {
      const candidate =
        richTextarea.querySelector('div[contenteditable="true"]') ||
        richTextarea.querySelector('p') ||
        richTextarea.querySelector('[contenteditable="true"]');
      if (candidate) return candidate;
    }

    const allCE = Array.from(document.querySelectorAll('div[contenteditable="true"], [contenteditable="true"]'));
    const visible = allCE.find(el => el && el.offsetParent !== null);
    return visible || null;
  }

  function findSendButton() {
    const viaXPath = evaluateXPath(SEND_BUTTON_XPATH);
    if (viaXPath) {
      const b = viaXPath.closest('button') || viaXPath;
      if (isClickableButton(b)) return b;
    }

    const ariaCandidates = [
      'button[aria-label="Send message"]',
      'button[aria-label="Send"]',
      'button[aria-label="发送"]',
      'button[aria-label="发送消息"]',
      'button[title="Send message"]',
      'button[title="Send"]',
      'button[title="发送"]',
      'button[title="发送消息"]',
    ];
    for (const sel of ariaCandidates) {
      const el = document.querySelector(sel);
      if (isClickableButton(el)) return el;
    }

    const buttons = Array.from(document.querySelectorAll('button'));
    const scored = buttons
      .map(b => ({ b, score: scoreSendButton(b) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const x of scored) {
      if (isClickableButton(x.b)) return x.b;
    }

    const inputNode = findInputNode();
    if (inputNode) {
      const area = inputNode.closest('input-container, input-area-v2, form, chat-window, main') || document;
      const localButtons = Array.from(area.querySelectorAll('button'));
      const localScored = localButtons
        .map(b => ({ b, score: scoreSendButton(b) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score);

      for (const x of localScored) {
        if (isClickableButton(x.b)) return x.b;
      }
    }

    return null;
  }

  function isClickableButton(btn) {
    if (!btn) return false;
    if (!(btn instanceof HTMLElement)) return false;
    const disabled = btn.disabled || btn.getAttribute('aria-disabled') === 'true';
    if (disabled) return false;
    if (btn.offsetParent === null) return false;
    return true;
  }

  function scoreSendButton(btn) {
    if (!btn) return 0;

    const aria = ((btn.getAttribute('aria-label') || '') + '').trim().toLowerCase();
    const title = ((btn.getAttribute('title') || '') + '').trim().toLowerCase();
    const text = ((btn.innerText || btn.textContent || '') + '').trim().toLowerCase();

    let score = 0;

    if (/(send message|send|发送消息|发送)/i.test(aria)) score += 50;
    if (/(send message|send|发送消息|发送)/i.test(title)) score += 30;
    if (/(send|发送)/i.test(text)) score += 20;

    const hasSendIcon =
      (btn.querySelector('mat-icon')?.textContent || '').toLowerCase().includes('send') ||
      btn.querySelector('svg') != null ||
      /send|paper-plane|submit/i.test(btn.className || '');

    if (hasSendIcon) score += 10;

    const inputNode = findInputNode();
    if (inputNode) {
      const area = inputNode.closest('input-container, input-area-v2, form');
      if (area && area.contains(btn)) score += 30;
    }

    return score;
  }

  function evaluateXPath(xpath) {
    try {
      const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return result.singleNodeValue;
    } catch {
      return null;
    }
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitForGeneration(maxWaitSec, shouldStop) {
    const chatWindow = document.querySelector('chat-window') || document.body;

    const maxMs = Math.max(10, maxWaitSec) * 1000;
    const start = Date.now();

    const stableNeed = 6; // 约 3 秒稳定
    let stableCount = 0;

    let lastMutatedAt = Date.now();
    const obs = new MutationObserver(() => {
      lastMutatedAt = Date.now();
    });
    obs.observe(chatWindow, { childList: true, subtree: true, attributes: true, characterData: true });

    try {
      while (Date.now() - start < maxMs) {
        if (shouldStop()) return;

        await wait(500);

        const loadingEls = findLoadingIndicators(chatWindow);
        const idleFor = Date.now() - lastMutatedAt;
        const seemsStable = idleFor > 800;

        if (loadingEls.length === 0 && seemsStable) {
          stableCount++;
        } else {
          stableCount = 0;
        }

        if (stableCount >= stableNeed) {
          await wait(800);
          return;
        }
      }
      console.warn('等待超时，继续下一条');
    } finally {
      obs.disconnect();
    }
  }

  function findLoadingIndicators(root) {
    const indicators = [];

    const busy = root.querySelectorAll('[aria-busy="true"]');
    busy.forEach(el => {
      if (el instanceof HTMLElement && el.offsetParent !== null) indicators.push(el);
    });

    const spinners = root.querySelectorAll('.loading, .spinner, [class*="load"], [class*="spin"]');
    spinners.forEach(el => {
      if (el instanceof HTMLElement && el.offsetParent !== null) indicators.push(el);
    });

    const textNodes = root.querySelectorAll('span, div');
    textNodes.forEach(el => {
      const txt = (el.textContent || '').trim();
      if (!txt) return;
      if (/加载|loading|生成中|generating|thinking|请稍候|处理中/i.test(txt)) {
        if (el instanceof HTMLElement && el.offsetParent !== null) indicators.push(el);
      }
    });

    return indicators;
  }

  // ========= 文件解析（xlsx/xls + csv/tsv/txt） =========
  async function parseFileToPrompts(file) {
    const name = (file.name || '').toLowerCase();

    // 先读一份 ArrayBuffer 做格式判断
    const buf = await file.arrayBuffer();
    const u8 = new Uint8Array(buf);

    const isXlsxZip = u8.length >= 2 && u8[0] === 0x50 && u8[1] === 0x4b; // PK
    const isOldXls = u8.length >= 8 && u8[0] === 0xd0 && u8[1] === 0xcf && u8[2] === 0x11 && u8[3] === 0xe0;

    // 1) 真 Excel：走 SheetJS（@require 已引入）
    if (isXlsxZip || isOldXls || name.endsWith('.xlsx')) {
      if (typeof XLSX === 'undefined') {
        throw new Error('缺少 XLSX 库（SheetJS）。请检查 @require 是否加载成功。');
      }
      const wb = XLSX.read(buf, { type: 'array' });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false }); // [{列名: 值}]
      const { rows, prompts } = mapRows(json);
      if (!prompts.length) throw new Error('未读到任何提示词（检查列名是否为“提示词”或“prompt”）');
      return { rows, prompts };
    }

    // 2) 文本：csv/tsv/txt（你的“伪xls”也能走这里）
    const text = decodeLikelyChinese(u8);
    const delimiter = guessDelimiter(text); // '\t' or ','
    const table = parseDelimitedText(text, delimiter); // [ [cell, ...], ...]
    if (!table.length) throw new Error('文本解析为空');

    // 第一行当表头
    const headers = table[0].map(h => String(h || '').trim());
    const body = table.slice(1).filter(r => r.some(c => String(c || '').trim() !== ''));

    const objects = body.map(r => {
      const o = {};
      headers.forEach((h, i) => o[h] = r[i] == null ? '' : r[i]);
      return o;
    });

    const { rows, prompts } = mapRows(objects);
    if (!prompts.length) throw new Error('未读到任何提示词（检查表头列名）');
    return { rows, prompts };
  }

  function mapRows(objects) {
    // 允许多种列名
    const norm = s => String(s || '').trim().toLowerCase();
    const keyOf = (obj, candidates) => {
      const keys = Object.keys(obj || {});
      for (const c of candidates) {
        const hit = keys.find(k => norm(k) === norm(c));
        if (hit) return hit;
      }
      // 再做“包含”匹配
      for (const c of candidates) {
        const hit = keys.find(k => norm(k).includes(norm(c)));
        if (hit) return hit;
      }
      return null;
    };

    const rows = [];
    const prompts = [];

    for (const o of objects) {
      const kPrompt = keyOf(o, ['提示词', 'prompt', 'prompts', 'Prompt', 'PROMPT']);
      const kProd = keyOf(o, ['产品', '产品名', 'product', 'name', '品名']);

      const normalizePrompt = (p) => String(p || '')
      .replace(/\r\n/g, '\n').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

const prompt = kPrompt ? normalizePrompt(o[kPrompt]) : '';
      if (!prompt) continue;

      const product = kProd ? String(o[kProd] || '').trim() : '';
      rows.push({ product, prompt, raw: o });
      prompts.push(prompt);
    }
    return { rows, prompts };
  }

  function guessDelimiter(text) {
    const head = text.slice(0, 4000);
    const tabCount = (head.match(/\t/g) || []).length;
    const commaCount = (head.match(/,/g) || []).length;
    return tabCount >= commaCount ? '\t' : ',';
  }

  // 解析 CSV/TSV：支持引号、支持引号内换行
  function parseDelimitedText(text, delimiter) {
    const rows = [];
    let row = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch === '"') {
        // 双引号转义 ""
        const next = text[i + 1];
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (!inQuotes && (ch === '\n' || ch === '\r')) {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cur);
        rows.push(row);
        row = [];
        cur = '';
        continue;
      }

      if (!inQuotes && ch === delimiter) {
        row.push(cur);
        cur = '';
        continue;
      }

      cur += ch;
    }

    // tail
    row.push(cur);
    rows.push(row);

    // 去掉末尾空行
    return rows.filter(r => r.some(c => String(c || '').trim() !== ''));
  }

  function decodeLikelyChinese(u8) {
    // 尽量：utf-8 -> gb18030
    try {
      const t = new TextDecoder('utf-8', { fatal: true }).decode(u8);
      // 如果乱码比例太高，再换 gb
      if (looksGarbled(t)) throw new Error('utf8 garbled');
      return t;
    } catch {
      try {
        return new TextDecoder('gb18030').decode(u8);
      } catch {
        // 最后兜底
        return new TextDecoder().decode(u8);
      }
    }
  }

  function looksGarbled(s) {
    // 简单判断：大量 � 或控制字符
    const repl = (s.match(/\uFFFD/g) || []).length;
    if (repl > 3) return true;
    return false;
  }

  // 初始化
  window.addEventListener('load', () => setTimeout(() => initPanel(), 2000));
  if (document.readyState === 'complete') setTimeout(() => initPanel(), 2000);
})();

// ==UserScript==
// @icon         data:image/png;base64,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
// @name         Gemini to Notion DB
// @license      All Rights Reserved
// @namespace    https://your.domain.example
// @version      19.0.4
// @description  Pure DB Version: 移除 To Page，采用 DOM 解析技术实现 100% Markdown 语法保留。(白色磨砂面板 + 适配 + 说明书/咖啡双按钮)
// @author       Stephen / ScriptDev
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559209/Gemini%20to%20Notion%20DB.user.js
// @updateURL https://update.greasyfork.org/scripts/559209/Gemini%20to%20Notion%20DB.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /********************* 0. GM_xmlhttpRequest 封装 *********************/

  function gmFetch(url, options) {
    return new Promise((resolve, reject) => {
        const details = {
            method: options.method || 'GET',
            url: url,
            headers: options.headers || {},
            data: options.body,
            responseType: 'json',
            onload: function(response) {
                const res = {
                    status: response.status,
                    statusText: response.statusText,
                    ok: response.status >= 200 && response.status < 300,
                    json: () => Promise.resolve(response.response),
                    text: () => Promise.resolve(response.responseText)
                };
                resolve(res);
            },
            onerror: function(error) {
                reject(new Error(`GM_xmlhttpRequest Network Error`));
            },
            ontimeout: function() {
                reject(new Error('GM_xmlhttpRequest Timeout'));
            }
        };
        GM_xmlhttpRequest(details);
    });
  }

  /********************* 1. 常量与默认值 *********************/

  const NOTION_VERSION = '2022-06-28';
  const STORE_KEYS = {
    token: 'gm_notion_token',
    dbId: 'gm_notion_db_id'
  };

  /********************* 2. 样式 (白色磨砂 + 适配 + 底部工具栏) *********************/

  GM_addStyle(`
    /* 1. Sync 按钮样式 (适配深浅色) */
    .gm-notion-btn {
      display: inline-flex; align-items: center; justify-content: center; margin-left: 6px; padding: 0 10px;
      height: 32px; border-radius: 999px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      background: rgba(0, 0, 0, 0.05);
      color: #444746;
      font-size: 12px; font-weight: 500; cursor: pointer; outline: none; white-space: nowrap;
      transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); z-index: 2147483647;
    }
    .gm-notion-btn:hover {
      background: rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .gm-notion-btn[disabled] { opacity: 0.5; cursor: default; box-shadow: none; }

    @media (prefers-color-scheme: dark) {
      .gm-notion-btn {
        border: 1px solid rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.08);
        color: #e3f2fd;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }
      .gm-notion-btn:hover {
        background: rgba(144, 202, 249, 0.18);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
      }
    }
    body[data-theme="dark"] .gm-notion-btn, body.dark-theme .gm-notion-btn {
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        background: rgba(255, 255, 255, 0.08) !important;
        color: #e3f2fd !important;
    }

    /* 2. Toast */
    .gm-notion-toast {
      position: fixed; top: 16px; right: 16px; min-width: 200px; max-width: 320px; padding: 10px 14px;
      border-radius: 14px; background: rgba(40, 40, 40, 0.88); color: #f5f5f5; font-size: 13px; line-height: 1.4;
      z-index: 2147483647; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45); backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px); display: flex; align-items: center; gap: 8px; opacity: 0;
      transform: translateY(-10px); transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .gm-notion-toast-show { opacity: 1; transform: translateY(0); }
    .gm-notion-toast-icon { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; }
    .gm-notion-toast-icon.success { background: radial-gradient(circle at 30% 30%, #b9f6ca, #00c853); }
    .gm-notion-toast-icon.error { background: radial-gradient(circle at 30% 30%, #ff8a80, #d50000); }
    .gm-notion-toast-message { flex: 1; word-break: break-all; }

    /* 3. 面板样式 (白色磨砂) */
    .gm-notion-settings-toggle {
      position: fixed; right: 16px; bottom: 16px; width: 40px; height: 40px; border-radius: 999px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      color: #333;
      font-size: 20px; display: flex; align-items: center;
      justify-content: center; cursor: pointer; z-index: 2147483647;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    .gm-notion-settings-toggle:hover {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .gm-notion-settings-panel {
      position: fixed; right: 16px; bottom: 70px; width: 320px; max-width: 90vw; padding: 16px 18px 14px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      color: #333; font-size: 12px; z-index: 2147483647;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
      display: none; flex-direction: column; gap: 10px;
    }

    .gm-notion-settings-panel-header {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;
    }
    .gm-notion-settings-panel-title { font-size: 14px; font-weight: 700; color: #111; }

    .gm-notion-settings-panel-close {
      cursor: pointer; font-size: 18px; line-height: 1; padding: 2px 6px; border-radius: 999px;
      color: #666; transition: background 0.2s ease, color 0.2s ease;
    }
    .gm-notion-settings-panel-close:hover { background: rgba(0, 0, 0, 0.08); color: #000; }

    .gm-notion-settings-field { display: flex; flex-direction: column; gap: 4px; }
    .gm-notion-settings-label { font-size: 11px; font-weight: 600; color: #555; margin-left: 2px; }

    .gm-notion-settings-input {
      width: 100%; box-sizing: border-box; padding: 6px 10px; border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.6);
      color: #111; font-size: 12px; outline: none; transition: all 0.2s ease;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
    }
    .gm-notion-settings-input:focus {
      border-color: #42a5f5; background: #fff;
      box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.15);
    }
    .gm-notion-settings-input::placeholder { color: #999; }

    .gm-notion-settings-helper { font-size: 10px; color: #888; margin-left: 2px; }

    .gm-notion-settings-footer { display: flex; align-items: center; margin-top: 6px; }

    .gm-notion-settings-btn {
      padding: 6px 14px; border-radius: 999px; border: none; cursor: pointer;
      font-size: 11px; font-weight: 600; outline: none;
      transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
    }

    .gm-notion-settings-btn-save {
      background: linear-gradient(135deg, #42a5f5, #7e57c2); color: #fff;
      box-shadow: 0 4px 10px rgba(66, 165, 245, 0.3);
      margin-left: 8px;
    }
    .gm-notion-settings-btn-save:hover {
      transform: translateY(-0.5px); box-shadow: 0 6px 14px rgba(66, 165, 245, 0.4);
    }

    .gm-notion-settings-btn-cancel {
      background: rgba(0, 0, 0, 0.06); color: #555;
      margin-left: auto; /* 关键：将右侧按钮推到右边 */
    }
    .gm-notion-settings-btn-cancel:hover {
      background: rgba(0, 0, 0, 0.12); color: #111;
    }

    /* 左侧图标按钮通用样式 */
    .gm-notion-settings-icon-btn {
        text-decoration: none;
        display: flex; align-items: center; justify-content: center;
        padding: 6px;
        border-radius: 50%; /* 圆形按钮 */
        width: 24px; height: 24px;
        margin-right: 6px;
        font-size: 14px;
        transition: all 0.2s ease;
    }
    .gm-notion-settings-btn-coffee {
        background: rgba(255, 152, 0, 0.1); color: #f57c00;
    }
    .gm-notion-settings-btn-coffee:hover {
        background: rgba(255, 152, 0, 0.25); transform: translateY(-1px);
    }
    .gm-notion-settings-btn-book {
        background: rgba(33, 150, 243, 0.1); color: #1976d2;
    }
    .gm-notion-settings-btn-book:hover {
        background: rgba(33, 150, 243, 0.25); transform: translateY(-1px);
    }
  `);

  /********************* 3. Toast 工具 *********************/

  function showToast(type, msg) {
    const toast = document.createElement('div');
    toast.className = 'gm-notion-toast';
    const icon = document.createElement('div');
    icon.className = `gm-notion-toast-icon ${type}`;
    const msgEl = document.createElement('div');
    msgEl.className = 'gm-notion-toast-message';
    msgEl.textContent = msg;
    toast.appendChild(icon);
    toast.appendChild(msgEl);
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add('gm-notion-toast-show');
    });
    setTimeout(() => {
      toast.classList.remove('gm-notion-toast-show');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  /********************* 4. GM 存储封装 *********************/

  function getStoredConfig() {
    return {
      token: GM_getValue(STORE_KEYS.token, ''),
      dbId: GM_getValue(STORE_KEYS.dbId, ''),
    };
  }

  function saveConfig({ token, dbId }) {
    GM_setValue(STORE_KEYS.token, token || '');
    GM_setValue(STORE_KEYS.dbId, dbId || '');
  }

  /********************* 5. 设置面板 UI *********************/

  function createSettingsUI() {
    const toggle = document.createElement('div');
    toggle.className = 'gm-notion-settings-toggle';
    toggle.title = 'Notion 设置';
    toggle.textContent = 'N';

    const panel = document.createElement('div');
    panel.className = 'gm-notion-settings-panel';

    const header = document.createElement('div');
    header.className = 'gm-notion-settings-panel-header';
    const title = document.createElement('div');
    title.className = 'gm-notion-settings-panel-title';
    title.textContent = 'Notion DB 配置';
    const closeBtn = document.createElement('div');
    closeBtn.className = 'gm-notion-settings-panel-close';
    closeBtn.textContent = '×';
    header.appendChild(title);
    header.appendChild(closeBtn);

    const config = getStoredConfig();
    const fieldToken = document.createElement('div');
    fieldToken.className = 'gm-notion-settings-field';
    const labelToken = document.createElement('label');
    labelToken.className = 'gm-notion-settings-label';
    labelToken.textContent = 'Notion Token';
    const inputToken = document.createElement('input');
    inputToken.className = 'gm-notion-settings-input';
    inputToken.type = 'password';
    inputToken.placeholder = 'secret_xxx...';
    inputToken.value = config.token || '';
    fieldToken.appendChild(labelToken);
    fieldToken.appendChild(inputToken);

    const fieldDB = document.createElement('div');
    fieldDB.className = 'gm-notion-settings-field';
    const labelDB = document.createElement('label');
    labelDB.className = 'gm-notion-settings-label';
    labelDB.textContent = 'Database ID';
    const inputDB = document.createElement('input');
    inputDB.className = 'gm-notion-settings-input';
    inputDB.placeholder = '32位 ID';
    inputDB.value = config.dbId || '';
    fieldDB.appendChild(labelDB);
    fieldDB.appendChild(inputDB);

    const helper = document.createElement('div');
    helper.className = 'gm-notion-settings-helper';
    helper.textContent = '说明：内容将自动保存到指定的 Database。';

    // Footer & Buttons
    const footer = document.createElement('div');
    footer.className = 'gm-notion-settings-footer';

    // 1. Instruction Button (Book)
    const btnBook = document.createElement('a');
    btnBook.className = 'gm-notion-settings-icon-btn gm-notion-settings-btn-book';
    btnBook.textContent = '📖';
    btnBook.href = 'https://www.notion.so/Instruction-2c7a07b26988802a9f2edf5a99841c35?source=copy_link';
    btnBook.target = '_blank';
    btnBook.title = '使用说明书';

    // 2. Coffee Button
    const btnCoffee = document.createElement('a');
    btnCoffee.className = 'gm-notion-settings-icon-btn gm-notion-settings-btn-coffee';
    btnCoffee.textContent = '☕';
    btnCoffee.href = 'https://www.notion.so/Buy-me-a-coffee-2c7a07b26988807abcf1dc94ed3c29c3?source=copy_link';
    btnCoffee.target = '_blank';
    btnCoffee.title = 'Buy me a coffee';

    // 3. Action Buttons
    const btnCancel = document.createElement('button');
    btnCancel.className = 'gm-notion-settings-btn gm-notion-settings-btn-cancel';
    btnCancel.textContent = '取消';
    const btnSave = document.createElement('button');
    btnSave.className = 'gm-notion-settings-btn gm-notion-settings-btn-save';
    btnSave.textContent = '保存';

    // 组装 Footer (Book & Coffee 在左, Cancel 靠 margin-left: auto 推到右边)
    footer.appendChild(btnBook);
    footer.appendChild(btnCoffee);
    footer.appendChild(btnCancel);
    footer.appendChild(btnSave);

    panel.appendChild(header);
    panel.appendChild(fieldToken);
    panel.appendChild(fieldDB);
    panel.appendChild(helper);
    panel.appendChild(footer);

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    const openPanel = () => {
      const latest = getStoredConfig();
      inputToken.value = latest.token || '';
      inputDB.value = latest.dbId || '';
      panel.style.display = 'flex';
    };
    const closePanel = () => {
      panel.style.display = 'none';
    };
    toggle.addEventListener('click', () => {
      if (panel.style.display === 'flex') { closePanel(); } else { openPanel(); }
    });
    closeBtn.addEventListener('click', closePanel);
    btnCancel.addEventListener('click', closePanel);

    btnSave.addEventListener('click', () => {
      const token = inputToken.value.trim();
      const dbId = inputDB.value.trim();
      saveConfig({ token, dbId });
      showToast('success', 'Notion 配置已保存');
      closePanel();
    });
  }

  /********************* 6. 等待元素工具 *********************/

  function waitForElement(selector, root = document, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const existing = root.querySelector(selector);
      if (existing) { return resolve(existing); }
      const observer = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) { observer.disconnect(); resolve(el); }
      });
      observer.observe(root === document ? document.documentElement : root, { childList: true, subtree: true });
      if (timeoutMs > 0) {
        setTimeout(() => { observer.disconnect(); reject(new Error(`waitForElement timeout: ${selector}`)); }, timeoutMs);
      }
    });
  }

  /********************* 7. DOM 清洗与 Markdown 转换 (Pro 版逻辑) *********************/

  function cleanElement(originalElement) {
      if (!originalElement) return document.createElement('div');
      const clone = originalElement.cloneNode(true);

      const trashSelector = [
          'svg', 'img',
          'button', '[role="button"]',
          '.thinking-indicator',
          '.avatar', '.logo',
          '[aria-label="Gemini"]',
          '.buttons-container-v2'
      ].join(',');

      clone.querySelectorAll(trashSelector).forEach(el => el.remove());

      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      const nodesToRemove = [];
      while(walker.nextNode()) {
          const node = walker.currentNode;
          const text = node.textContent.trim();
          if (['显示思路', 'Show thinking', 'Thinking Process'].includes(text)) {
              if (node.parentElement) nodesToRemove.push(node.parentElement);
          }
      }
      nodesToRemove.forEach(el => { try { el.remove(); } catch(e) {} });

      let hasChanges = true;
      while (hasChanges) {
          hasChanges = false;
          const emptyCandidates = clone.querySelectorAll('div, span, p, section, aside, footer, header');
          emptyCandidates.forEach(el => {
              if (el.innerHTML.trim() === '' && el.children.length === 0) {
                  el.remove();
                  hasChanges = true;
              }
          });
      }

      return clone;
  }

  function htmlToMarkdownPro(element) {
      let clone = cleanElement(element);

      clone.querySelectorAll('code-block').forEach(block => {
          const lang = block.getAttribute('language') || '';
          const code = block.querySelector('code')?.textContent || '';
          block.replaceWith(`\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
      });

      ['h1', 'h2', 'h3'].forEach((tag, idx) => {
          clone.querySelectorAll(tag).forEach(el => {
              const prefix = '#'.repeat(idx + 1);
              el.replaceWith(`\n${prefix} ${el.textContent}\n`);
          });
      });

      clone.querySelectorAll('strong, b').forEach(e => e.replaceWith(`**${e.textContent}**`));
      clone.querySelectorAll('em, i').forEach(e => e.replaceWith(`*${e.textContent}*`));

      clone.querySelectorAll('a').forEach(a => {
          const href = a.getAttribute('href');
          const text = a.textContent;
          if(href) a.replaceWith(`[${text}](${href})`);
      });

      clone.querySelectorAll('li').forEach(li => {
          const parent = li.parentElement;
          const prefix = parent && parent.tagName === 'OL' ? '1. ' : '- ';
          li.replaceWith(`${prefix}${li.textContent}\n`);
      });
      clone.querySelectorAll('ul, ol').forEach(list => {
          list.replaceWith(`${list.textContent}\n`);
      });

      clone.querySelectorAll('table').forEach(table => {
          let mdTable = '\n';
          const rows = table.querySelectorAll('tr');
          rows.forEach((row, rowIndex) => {
              const cells = row.querySelectorAll('th, td');
              const rowText = Array.from(cells).map(cell => cell.textContent.trim()).join(' | ');
              mdTable += `| ${rowText} |\n`;

              if (rowIndex === 0) {
                  const separator = Array.from(cells).map(() => '---').join(' | ');
                  mdTable += `| ${separator} |\n`;
              }
          });
          table.replaceWith(mdTable);
      });

      clone.querySelectorAll('p').forEach(p => p.replaceWith(`${p.textContent}\n\n`));
      clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));

      return clone.textContent.trim().replace(/\n{3,}/g, '\n\n');
  }

  /********************* 8. Notion API 块解析 (字符串 -> Block) *********************/

  function parseRichText(text) {
      const parts = [];
      const regex = /(\*\*.*?\*\*|`[^`]+`|\[.*?\]\(.*?\))/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
              parts.push({ type: 'text', text: { content: text.slice(lastIndex, match.index) } });
          }
          const token = match[0];
          if (token.startsWith('**')) {
              parts.push({
                  type: 'text', text: { content: token.slice(2, -2) }, annotations: { bold: true }
              });
          } else if (token.startsWith('`')) {
              parts.push({
                  type: 'text', text: { content: token.slice(1, -1) }, annotations: { code: true }
              });
          } else if (token.startsWith('[')) {
              const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
              if (linkMatch) {
                  parts.push({
                      type: 'text', text: { content: linkMatch[1], link: { url: linkMatch[2] } }
                  });
              } else {
                  parts.push({ type: 'text', text: { content: token } });
              }
          }
          lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) {
          parts.push({ type: 'text', text: { content: text.slice(lastIndex) } });
      }
      if (parts.length === 0) return [{ type: 'text', text: { content: text } }];
      return parts;
  }

  function parseMarkdownToNotionBlocks(markdownText) {
      const children = [];
      const lines = markdownText.split('\n');
      let inCodeBlock = false;
      let currentCodeLines = [];
      let codeLanguage = 'plain text';
      let inTable = false;
      let currentTableLines = [];

      const pushCodeBlocks = (linesArray, lang) => {
          const fullContent = linesArray.join('\n').trimEnd();
          if (!fullContent) return;
          const MAX_CHUNK = 1950;
          let start = 0;
          while (start < fullContent.length) {
              let end = start + MAX_CHUNK;
              if (end > fullContent.length) end = fullContent.length;
              if (end < fullContent.length) {
                  const lastNewline = fullContent.lastIndexOf('\n', end);
                  if (lastNewline > start) end = lastNewline;
              }
              const chunk = fullContent.substring(start, end).trimStart();
              if (chunk) {
                  children.push({
                      object: 'block', type: 'code',
                      code: {
                          language: start === 0 ? lang : 'plain text',
                          rich_text: [{ type: 'text', text: { content: chunk } }]
                      }
                  });
              }
              start = end;
          }
      };

      for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          if (trimmed.startsWith('```')) {
              if (inTable) {
                  pushCodeBlocks(currentTableLines, 'plain text');
                  currentTableLines = [];
                  inTable = false;
              }
              if (inCodeBlock) {
                  pushCodeBlocks(currentCodeLines, codeLanguage);
                  currentCodeLines = [];
                  inCodeBlock = false;
              } else {
                  inCodeBlock = true;
                  const langMatch = trimmed.match(/```(\w+)/);
                  codeLanguage = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : 'plain text';
              }
              continue;
          }

          if (inCodeBlock) {
              currentCodeLines.push(line);
              continue;
          }

          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
              inTable = true;
              currentTableLines.push(line);
              continue;
          } else if (inTable) {
              pushCodeBlocks(currentTableLines, 'markdown');
              currentTableLines = [];
              inTable = false;
          }

          const rLine = line.replace(/\r/g, '').trimEnd();

          if (/^#\s+/.test(rLine)) {
              children.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: parseRichText(rLine.replace(/^#\s+/, "")) } });
          } else if (/^##\s+/.test(rLine)) {
              children.push({ object: 'block', type: 'heading_2', heading_2: { rich_text: parseRichText(rLine.replace(/^##\s+/, "")) } });
          } else if (/^###\s+/.test(rLine)) {
              children.push({ object: 'block', type: 'heading_3', heading_3: { rich_text: parseRichText(rLine.replace(/^###\s+/, "")) } });
          } else if (/^[-*+]\s+/.test(rLine)) {
               children.push({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: parseRichText(rLine.replace(/^[-*+]\s+/, "")) } });
          } else if (/^\d+\.\s+/.test(rLine)) {
               children.push({ object: 'block', type: 'numbered_list_item', numbered_list_item: { rich_text: parseRichText(rLine.replace(/^\d+\.\s+/, "")) } });
          } else if (/^>\s+/.test(rLine)) {
               children.push({ object: 'block', type: 'quote', quote: { rich_text: parseRichText(rLine.replace(/^>\s+/, "")) } });
          } else {
              const contentText = rLine.length ? rLine : "";
              const richTextContent = contentText ? parseRichText(contentText) : [];
              if (richTextContent.length > 0) {
                 children.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: richTextContent } });
              }
          }
      }

      if (inCodeBlock && currentCodeLines.length > 0) pushCodeBlocks(currentCodeLines, codeLanguage);
      if (inTable && currentTableLines.length > 0) pushCodeBlocks(currentTableLines, 'markdown');

      return children;
  }

  /********************* 9. Notion API 调用 *********************/

  async function createNotionPage(payload) {
    const cfg = getStoredConfig();
    const token = cfg.token;
    const dbId = cfg.dbId;

    if (!token) throw new Error('Notion Token 未配置');
    if (!dbId) throw new Error("Database ID 未配置");

    const { content, sourceUrl } = payload;

    const nameText = content.substring(0, 15) + (content.length > 15 ? '...' : '');
    const descText = content.substring(0, 50).replace(/[\n\r]/g, ' ') + '...';
    const dateValue = new Date().toISOString();

    let properties = {
      "Name": {
        title: [{ text: { content: nameText } }]
      },
      "Description": {
        rich_text: [{ text: { content: descText } }]
      },
      "Date": {
        date: { start: dateValue }
      }
    };

    const children = parseMarkdownToNotionBlocks(content);

    if (sourceUrl) {
      children.push({
        object: 'block', type: 'paragraph', paragraph: {
          rich_text: [{ type: 'text', text: { content: `Source URL: ${sourceUrl}` } }]
        },
      });
    }

    const body = {
        parent: { database_id: dbId },
        properties,
        children
    };

    const res = await gmFetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const t = await res.text().catch(() => 'No response body');
      throw new Error(`Notion API Error: ${res.status}. ${t}`);
    }

    return res;
  }

  /********************* 10. 核心：从 DOM 抓取内容 (替代剪贴板) *********************/

  function getMessageContentHtml(buttonsContainer) {
      const modelResponse = buttonsContainer.closest('model-response');
      if (modelResponse) {
          return modelResponse;
      }

      const parent = buttonsContainer.parentElement;
      if (parent) {
          const content = parent.querySelector('.message-content, [data-message-content]');
          if (content) return content;
      }

      return null;
  }

  /********************* 11. 按钮注入 *********************/

  function enhanceButtonsContainer(buttonsContainer) {
    if (!buttonsContainer || buttonsContainer.dataset.gmNotionBound === '1') return;
    buttonsContainer.dataset.gmNotionBound = '1';

    const copyBtn = buttonsContainer.querySelector('button[data-test-id="copy-button"]');
    if (!copyBtn) return;
    const injectTarget = copyBtn.parentElement;
    if (!injectTarget) return;

    const btnDB = document.createElement('button');
    btnDB.className = 'gm-notion-btn';
    btnDB.textContent = 'Sync to Notion';
    btnDB.title = '发送到 Database';

    injectTarget.insertAdjacentElement('afterend', btnDB);

    btnDB.addEventListener('click', async () => {
      await handleSend(buttonsContainer, btnDB);
    });
  }

  /********************* 12. 发送处理 *********************/

  async function handleSend(buttonsContainer, btn) {
    try {
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Syncing...';

      const contentEl = getMessageContentHtml(buttonsContainer);
      if (!contentEl) throw new Error("无法定位对话内容元素，Gemini 结构可能已变更");

      const fullMarkdown = htmlToMarkdownPro(contentEl);

      if (!fullMarkdown) throw new Error("内容为空");

      const payload = {
        content: fullMarkdown,
        sourceUrl: location.href,
      };

      await createNotionPage(payload);

      btn.textContent = 'Done';
      showToast('success', '已同步到 Notion DB');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.textContent = 'Err';
      showToast('error', err.message);
    }
  }

  /********************* 13. 观察者 *********************/

  function observeGeminiAnswers() {
    document.querySelectorAll('.buttons-container-v2').forEach(enhanceButtonsContainer);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (!m.addedNodes) continue;
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList && node.classList.contains('buttons-container-v2')) {
            enhanceButtonsContainer(node);
          }
          const nested = node.querySelectorAll ? node.querySelectorAll('.buttons-container-v2') : [];
          nested.forEach(enhanceButtonsContainer);
        });
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  /********************* 14. 入口 *********************/

  waitForElement('body').then(() => {
      createSettingsUI();
      observeGeminiAnswers();
  });
})();
// ==UserScript==
// @name         JSON Viewer
// @namespace    https://github.com/EastSun5566
// @version      0.0.2
// @description  Beautify JSON display in browser
// @author       Michael Wang
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554125/JSON%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/554125/JSON%20Viewer.meta.js
// ==/UserScript==

// @ts-check
/* eslint-disable no-alert */

/** @param {string} text  */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** @param {unknown} data */
function renderJson(data, indent = 0) {
  const indentStr = '  '.repeat(indent);
  let html = '';

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return '<span class="json-bracket">[]</span>';
    }

    const id = `arr_${Math.random().toString(36).slice(2, 9)}`;
    html += `<span class="json-toggle" data-target="${id}">▼</span>`;
    html += '<span class="json-bracket">[</span>\n';
    html += `<div id="${id}" class="json-collapsible">`;

    data.forEach((item, i) => {
      html += `${indentStr}  `;
      html += renderJson(item, indent + 1);
      if (i < data.length - 1) {
        html += '<span class="json-comma">,</span>';
      }
      html += '\n';
    });

    html += '</div>';
    html += `${indentStr}<span class="json-bracket">]</span>`;
  } else if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return '<span class="json-bracket">{}</span>';
    }

    const id = `obj_${Math.random().toString(36).slice(2, 9)}`;
    html += `<span class="json-toggle" data-target="${id}">▼</span>`;
    html += '<span class="json-bracket">{</span>\n';
    html += `<div id="${id}" class="json-collapsible">`;

    keys.forEach((key, i) => {
      html += `${indentStr}  `;
      html += `<span class="json-key">"${escapeHtml(key)}"</span>: `;
      html += renderJson(data[key], indent + 1);
      if (i < keys.length - 1) {
        html += '<span class="json-comma">,</span>';
      }
      html += '\n';
    });

    html += '</div>';
    html += `${indentStr}<span class="json-bracket">}</span>`;
  } else if (typeof data === 'string') {
    html += `<span class="json-string">"${escapeHtml(data)}"</span>`;
  } else if (typeof data === 'number') {
    html += `<span class="json-number">${data}</span>`;
  } else if (typeof data === 'boolean') {
    html += `<span class="json-boolean">${data}</span>`;
  } else if (data === null) {
    html += '<span class="json-null">null</span>';
  }

  return html;
}

(function () {
  const contentType = document.contentType || '';
  const isJSONContentType = contentType.includes('application/json');

  /** @type {HTMLPreElement | null} */
  const pre = document.querySelector('body > pre');
  const bodyText = document.body?.innerText?.trim();
  if (!pre && !isJSONContentType) return;

  const jsonText = pre?.innerText || bodyText || '';
  if (!jsonText) return;

  let jsonData;
  try {
    jsonData = JSON.parse(jsonText);
  } catch (e) {
    return;
  }

  document.body.innerHTML = '';

  // @ts-ignore
  // eslint-disable-next-line no-undef
  GM_addStyle(`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      background: #fff;
      padding: 20px;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background: #1e1e1e;
        color: #d4d4d4;
      }
      .json-key { color: #9cdcfe !important; }
      .json-string { color: #ce9178 !important; }
      .json-number { color: #b5cea8 !important; }
      .json-boolean { color: #569cd6 !important; }
      .json-null { color: #569cd6 !important; }
      .json-toggle { color: #d4d4d4 !important; }
      .toolbar { background: #252526 !important; border-color: #3e3e42 !important; }
      .toolbar button {
        background: #3e3e42 !important;
        color: #d4d4d4 !important;
        border-color: #555 !important;
      }
      .toolbar button:hover { background: #505050 !important; }
    }

    .toolbar {
      position: sticky;
      top: 0;
      background: #f5f5f5;
      padding: 10px;
      border-bottom: 1px solid #ddd;
      margin: -20px -20px 20px -20px;
      display: flex;
      gap: 10px;
      align-items: center;
      z-index: 1000;
    }

    .toolbar button {
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      font-size: 13px;
    }

    .toolbar button:hover {
      background: #e9e9e9;
    }

    .json-container {
      font-family: "Monaco", "Menlo", "Consolas", monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .json-line {
      padding-left: 20px;
    }

    .json-key {
      color: #881391;
      font-weight: 500;
    }

    .json-string {
      color: #c41a16;
    }

    .json-number {
      color: #1c00cf;
    }

    .json-boolean {
      color: #0d22aa;
      font-weight: bold;
    }

    .json-null {
      color: #808080;
      font-style: italic;
    }

    .json-toggle {
      cursor: pointer;
      user-select: none;
      color: #666;
      display: inline-block;
      width: 16px;
      font-weight: bold;
    }

    .json-toggle:hover {
      color: #000;
    }

    .json-collapsed {
      display: none;
    }

    .json-bracket {
      color: #666;
      font-weight: bold;
    }

    .json-comma {
      color: #666;
    }
  `);

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.innerHTML = `
    <button id="expandAll">Expand All</button>
    <button id="collapseAll">Collapse All</button>
    <button id="copyJson">Copy JSON</button>
    <button id="downloadJson">Download</button>
    <span style="margin-left: auto; font-size: 12px; color: #666;">
      ${Object.keys(jsonData).length} keys
    </span>
  `;

  const container = document.createElement('div');
  container.className = 'json-container';

  document.body.appendChild(toolbar);
  document.body.appendChild(container);

  container.innerHTML = renderJson(jsonData);

  // collapse/expand
  container.addEventListener('click', (e) => {
    const toggle = e.target.closest('.json-toggle');
    if (!toggle) return;

    const targetId = toggle.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;

    if (target.classList.contains('json-collapsed')) {
      target.classList.remove('json-collapsed');
      toggle.textContent = '▼';
    } else {
      target.classList.add('json-collapsed');
      toggle.textContent = '▶';
    }
  });

  // toolbar buttons
  document.getElementById('expandAll')?.addEventListener('click', () => {
    document.querySelectorAll('.json-collapsible').forEach((el) => {
      el.classList.remove('json-collapsed');
    });
    document.querySelectorAll('.json-toggle').forEach((el) => {
      el.textContent = '▼';
    });
  });

  document.getElementById('collapseAll')?.addEventListener('click', () => {
    document.querySelectorAll('.json-collapsible').forEach((el) => {
      el.classList.add('json-collapsed');
    });
    document.querySelectorAll('.json-toggle').forEach((el) => {
      el.textContent = '▶';
    });
  });

  document.getElementById('copyJson')?.addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
      .then(() => alert('JSON copied to clipboard!'))
      .catch((error) => alert(`Failed to copy: ${error}`));
  });

  document.getElementById('downloadJson')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    let filename = window.location.pathname.split('/').pop() || 'download';
    if (!/\.json$/.test(filename)) {
      filename += '.json';
    }

    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}());

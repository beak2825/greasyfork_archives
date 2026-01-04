// ==UserScript==
// @name         Markdown Viewer
// @namespace    https://docs.scriptcat.org/
// @version      0.2.3
// @description  Render raw .md pages with a pleasant, GitHub-like preview
// @author       You
// @match        *://*/*/*.md
// @match        *://*/*/*.mkd
// @match        *://*/*/*.mdwn
// @match        *://*/*/*.mdown
// @match        *://*/*/*.mdtxt
// @match        *://*/*/*.mdtext
// @match        *://*/*/*.markdown
// @match        *://*/*/*.text
// @inject-into  content
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/npm/marked@16.4.0/lib/marked.umd.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552037/Markdown%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/552037/Markdown%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 僅在頁面內容是單一 <pre>（常見的純文字 .md 顯示）時啟動
  const pre = document.querySelector('body>pre:only-child');
  if (!pre) return;

  const text = pre.textContent || '';
  if (!text.trim()) return;

  // 產出容器
  const wrapper = document.createElement('main');
  wrapper.id = 'mdv-wrapper';
  const body = document.body;

  // 產出渲染區
  const render = document.createElement('article');
  render.id = 'markdown-render';
  render.className = 'markdown-body';
  render.innerHTML = marked.parse(text);

  wrapper.appendChild(render);
  pre.replaceWith(wrapper);

  // ===== 風格樣式：接近 GitHub，含淺/深色 =====
  // 色票（同時支援 prefers-color-scheme）
  GM_addStyle(`
    :root {
      color-scheme: light dark;
      --mdv-bg: #ffffff;
      --mdv-fg: #24292f;
      --mdv-muted: #57606a;
      --mdv-border: #d0d7de;
      --mdv-link: #0969da;
      --mdv-code-bg: #f6f8fa;
      --mdv-kbd-bg: #f6f8fa;
      --mdv-kbd-border: #d0d7de;
      --mdv-quote: #d0d7de;
      --mdv-table-stripe: #f6f8fa;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --mdv-bg: #0d1117;
        --mdv-fg: #c9d1d9;
        --mdv-muted: #8b949e;
        --mdv-border: #30363d;
        --mdv-link: #58a6ff;
        --mdv-code-bg: #161b22;
        --mdv-kbd-bg: #161b22;
        --mdv-kbd-border: #30363d;
        --mdv-quote: #30363d;
        --mdv-table-stripe: #161b22;
      }
    }

    /* 基礎排版（避免 all: unset 破壞 UA 樣式與可用性） */
    html, body {
      margin: 0;
      padding: 0;
      background: var(--mdv-bg);
      color: var(--mdv-fg);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      line-height: 1.6;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* 置中內容區；窄邊欄視窗也好讀 */
    #mdv-wrapper {
      display: block;
      box-sizing: border-box;
      padding: 24px 16px;
    }
    .markdown-body {
      box-sizing: border-box;
      max-width: 860px;
      margin: 0 auto;
      background: transparent;
      padding: 32px 24px;
    }

    /* 標題階層與間距（接近 GitHub） */
    .markdown-body h1,
    .markdown-body h2,
    .markdown-body h3,
    .markdown-body h4,
    .markdown-body h5,
    .markdown-body h6 {
      font-weight: 600;
      line-height: 1.25;
      margin-top: 1.6em;
      margin-bottom: .8em;
    }
    .markdown-body h1 { font-size: 2em; border-bottom: 1px solid var(--mdv-border); padding-bottom: .3em; }
    .markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid var(--mdv-border); padding-bottom: .3em; }
    .markdown-body h3 { font-size: 1.25em; }
    .markdown-body h4 { font-size: 1em; }
    .markdown-body h5 { font-size: .875em; }
    .markdown-body h6 { font-size: .85em; color: var(--mdv-muted); }

    /* 文字與段落 */
    .markdown-body p { margin: 0 0 1em 0; }
    .markdown-body strong { font-weight: 600; }
    .markdown-body em { font-style: italic; }
    .markdown-body small { font-size: 0.875em; color: var(--mdv-muted); }

    /* 連結 */
    .markdown-body a {
      color: var(--mdv-link);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .markdown-body a:hover { text-decoration-thickness: 2px; }

    /* 圖片與影片 */
    .markdown-body img, .markdown-body video, .markdown-body canvas, .markdown-body svg {
      max-width: 100%;
      height: auto;
    }

    /* 清單 */
    .markdown-body ul, .markdown-body ol { padding-left: 2em; margin: 0 0 1em 0; }
    .markdown-body li + li { margin-top: .25em; }
    .markdown-body li > p { margin-top: .25em; margin-bottom: .25em; }

    /* 代辦清單 (task list) */
    .markdown-body input[type="checkbox"] {
      margin: 0 .4em 0 -1.3em;
      vertical-align: middle;
    }

    /* 引言 */
    .markdown-body blockquote {
      margin: 0 0 1em 0;
      padding: .5em 1em;
      color: var(--mdv-muted);
      border-left: .25em solid var(--mdv-quote);
      background: transparent;
    }

    /* 分隔線 */
    .markdown-body hr {
      height: 1px;
      border: 0;
      background: var(--mdv-border);
      margin: 1.5em 0;
    }

    /* 程式碼（inline / block） */
    .markdown-body code,
    .markdown-body tt {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: .95em;
      background: var(--mdv-code-bg);
      padding: .2em .4em;
      border-radius: 6px;
    }
    .markdown-body pre {
      background: var(--mdv-code-bg);
      padding: 1em;
      border: 1px solid var(--mdv-border);
      border-radius: 8px;
      overflow: auto;
      line-height: 1.45;
      margin: 0 0 1em 0;
    }
    .markdown-body pre code {
      background: transparent;
      padding: 0;
      font-size: .95em;
    }

    /* 表格 */
    .markdown-body table {
      border-collapse: collapse;
      width: 100%;
      margin: 0 0 1em 0;
      display: block;
      overflow: auto;
      border: 1px solid var(--mdv-border);
      border-radius: 8px;
    }
    .markdown-body th, .markdown-body td {
      border: 1px solid var(--mdv-border);
      padding: .6em .8em;
    }
    .markdown-body thead th {
      background: var(--mdv-code-bg);
      text-align: left;
    }
    .markdown-body tbody tr:nth-child(2n) {
      background: var(--mdv-table-stripe);
    }

    /* 行內鍵位標記 */
    .markdown-body kbd {
      background: var(--mdv-kbd-bg);
      border: 1px solid var(--mdv-kbd-border);
      border-bottom-width: 2px;
      border-radius: 6px;
      padding: .15em .35em;
      font-size: .85em;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }

    /* 摺疊區/詳情 */
    .markdown-body details { margin-bottom: 1em; }
    .markdown-body summary { cursor: pointer; font-weight: 600; }

    /* 讓超長單字換行避免溢出 */
    .markdown-body { overflow-wrap: anywhere; }

    /* 讓最外層也能捲動（圖片很多時） */
    html, body { height: 100%; }
  `);

  // 可選：若你之後想用 highlight.js，自行加上 @require 與主題 CSS，再在這裡呼叫 hljs.highlightAll();
})();

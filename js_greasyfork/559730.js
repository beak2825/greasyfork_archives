// ==UserScript==
// @name         VS Code Full IDE - Monaco Edition (CSS)
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Tarayıcıyı tam donanımlı bir VS Code IDE'sine dönüştürür.
// @author       Bilgi Uzmanı
// @match        *://*/*.css
// @match        *://*/*.css?*
// @grant        none
// @run-at       document-start
// @license none
// @downloadURL https://update.greasyfork.org/scripts/559730/VS%20Code%20Full%20IDE%20-%20Monaco%20Edition%20%28CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559730/VS%20Code%20Full%20IDE%20-%20Monaco%20Edition%20%28CSS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rawCode = document.documentElement.innerText;
    const fileName = window.location.pathname.split('/').pop() || 'style.css';

    function buildIDE() {
        document.documentElement.innerHTML = `
            <head>
                <title>${fileName} — Visual Studio Code</title>
                <style>
                    :root {
                        --bg: #1e1e1e;
                        --sidebar: #333333;
                        --activity-bar: #333333;
                        --status-bar: #007acc;
                        --tab-active: #1e1e1e;
                        --tab-inactive: #2d2d2d;
                        --border: #252526;
                    }
                    body, html { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                    .wrapper { display: flex; flex-direction: column; height: 100vh; background: var(--bg); }

                    /* Layout */
                    .main { display: flex; flex: 1; overflow: hidden; }
                    .activity-bar { width: 48px; background: var(--activity-bar); display: flex; flex-direction: column; align-items: center; padding-top: 12px; gap: 18px; }
                    .activity-icon { width: 24px; height: 24px; opacity: 0.6; cursor: pointer; }
                    .activity-icon:hover { opacity: 1; }

                    .editor-group { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
                    .tabs { height: 35px; background: #252526; display: flex; align-items: flex-end; }
                    .tab { background: var(--tab-active); color: #969696; padding: 8px 20px; font-size: 12px; border-right: 1px solid #252526; display: flex; align-items: center; gap: 8px; border-top: 1px solid #007acc; color: white; }

                    #container { flex: 1; width: 100%; height: 100%; }

                    .status-bar { height: 22px; background: var(--status-bar); color: white; display: flex; justify-content: space-between; align-items: center; padding: 0 10px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="main">
                        <div class="activity-bar">
                            <div class="activity-icon" style="border: 2px solid #fff; border-radius: 2px;"></div>
                            <div class="activity-icon" style="background: #858585; height: 2px; width: 20px;"></div>
                            <div class="activity-icon" style="background: #858585; height: 2px; width: 15px;"></div>
                        </div>
                        <div class="editor-group">
                            <div class="tabs">
                                <div class="tab">CSS ${fileName}</div>
                            </div>
                            <div id="container"></div>
                        </div>
                    </div>
                    <div class="status-bar">
                        <div>Ready</div>
                        <div>UTF-8 | CSS | Prettier</div>
                    </div>
                </div>
            </body>
        `;
    }

    function injectMonaco() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs/loader.min.js';
        script.onload = () => {
            require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
            require(['vs/editor/editor.main'], function() {
                const editor = monaco.editor.create(document.getElementById('container'), {
                    value: rawCode,
                    language: 'css',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    fontFamily: 'Consolas, monospace',
                    colorDecorators: true,
                    minimap: { enabled: true },
                    bracketPairColorization: { enabled: true },
                    cursorSmoothCaretAnimation: "on",
                    smoothScrolling: true,
                    contextmenu: true
                });

                // Otomatik Format (Beautify)
                setTimeout(() => {
                    editor.getAction('editor.action.formatDocument').run();
                }, 400);
            });
        };
        document.head.appendChild(script);
    }

    if (document.readyState === 'complete') {
        buildIDE(); injectMonaco();
    } else {
        window.addEventListener('load', () => { buildIDE(); injectMonaco(); });
    }
})();
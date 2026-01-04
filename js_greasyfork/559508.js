// ==UserScript==
// @name         OvaGames Links Extractor
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Helper script to show downlaod links for ovagames.com
// @author       pandamoon21
//
// @match        https://www.ovagames.com/*
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ovagames.com
//
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559508/OvaGames%20Links%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/559508/OvaGames%20Links%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS STYLES ---
    GM_addStyle(`
        #ova-panel {
            position: fixed; top: 10px; right: 10px; width: 400px; max-height: 90vh;
            background: #1e1e2e; color: #cdd6f4; z-index: 100000;
            border: 2px solid #a6e3a1; border-radius: 8px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: none;
            display: flex; flex-direction: column;
            animation: ovaSlideIn 0.3s ease-out;
        }
        @keyframes ovaSlideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        #ova-header {
            padding: 12px 15px; background: #11111b; border-bottom: 1px solid #313244;
            display: flex; justify-content: space-between; align-items: center;
            border-radius: 6px 6px 0 0;
            flex-shrink: 0;
        }
        .ova-header-title { font-weight:bold; color:#fff; font-size: 14px; }

        #ova-content { overflow-y: auto; padding: 10px; flex-grow: 1; scrollbar-width: thin; position: relative; }

        /* Footer for Global Actions */
        #ova-footer {
            padding: 10px; background: #11111b; border-top: 1px solid #313244;
            display: flex; justify-content: center; gap: 10px;
            border-radius: 0 0 6px 6px;
            flex-shrink: 0;
        }

        .ova-section { margin-bottom: 15px; background: #313244; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; }
        .ova-section-title { font-weight: bold; color: #f9e2af; font-size: 13px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #45475a; }

        .ova-link-row {
            display: flex; justify-content: space-between; align-items: center;
            padding: 6px; background: #1e1e2e; margin-bottom: 4px; border-radius: 4px;
            transition: background 0.2s;
        }
        .ova-link-row:hover { background: #28283d; }
        .ova-link-name { font-size: 12px; font-weight: bold; color: #a6e3a1; }

        /* Section Footer (Show/Copy Section) */
        .ova-section-footer {
            margin-top: 8px; padding-top: 8px; border-top: 1px dashed #45475a;
            display: flex; justify-content: flex-end; gap: 8px;
        }

        /* Buttons */
        .ova-actions { display: flex; gap: 5px; }
        button { cursor: pointer; border: none; font-family: sans-serif; }

        .btn-sm { padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; }
        .btn-blue { background: #89b4fa; color: #111; }
        .btn-blue:hover { background: #b4befe; }
        .btn-green { background: #a6e3a1; color: #111; }
        .btn-green:hover { background: #94e2d5; }

        .btn-action {
            padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: bold;
            background: #45475a; color: #cdd6f4; border: 1px solid #585b70;
        }
        .btn-action:hover { background: #585b70; color: #fff; }

        .btn-global { background: #f38ba8; color: #111; border: none; font-size: 12px; padding: 8px 16px; }
        .btn-global:hover { background: #eba0ac; }

        /* Text Viewer Overlay */
        #ova-viewer {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: #1e1e2e; z-index: 10; display: none; flex-direction: column;
            padding: 10px;
        }
        #ova-viewer textarea {
            flex-grow: 1; background: #11111b; color: #a6e3a1; border: 1px solid #45475a;
            padding: 10px; font-family: monospace; font-size: 11px; resize: none; margin-bottom: 10px;
            white-space: pre; overflow-wrap: normal; overflow-x: scroll;
        }
        .viewer-controls { display: flex; gap: 10px; }
        .viewer-controls button { flex: 1; padding: 8px; border-radius: 4px; font-weight: bold; }

        #ova-float-btn {
            position: fixed; bottom: 20px; right: 20px;
            background: #a6e3a1; color: #111; padding: 12px 20px;
            border-radius: 50px; cursor: pointer; font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 99999;
            border: none; transition: transform 0.2s;
            font-family: sans-serif; font-size: 14px;
        }
        #ova-float-btn:hover { transform: scale(1.05); }
    `);

    // --- HELPER FUNCTIONS ---

    function cleanName(text) {
        return text.replace(/^[•\-\s]+/, '').replace(/[•]/g, '').trim().toUpperCase();
    }

    // --- MAIN LOGIC ---

    function fetchAndExtract() {
        const btn = document.getElementById('ova-float-btn');
        if(btn) btn.textContent = '⏳ Fetching...';

        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const groups = doc.querySelectorAll('.dl-wraps-item');
                const extractedData = [];

                groups.forEach(group => {
                    const titleElement = group.querySelector('b');
                    const sectionTitle = titleElement ? titleElement.textContent.trim() : "Download Section";
                    const links = group.querySelectorAll('a[href]');
                    const linkItems = [];

                    links.forEach(link => {
                        const formattedName = cleanName(link.textContent);
                        if (formattedName && link.href) {
                            linkItems.push({ name: formattedName, url: link.href });
                        }
                    });

                    if (linkItems.length > 0) {
                        extractedData.push({ title: sectionTitle, links: linkItems });
                    }
                });

                renderPanel(extractedData);
                if(btn) btn.textContent = '🔗 Show Links';
            }
        });
    }

    function renderPanel(data) {
        let panel = document.getElementById('ova-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'ova-panel';
            document.body.appendChild(panel);
        }

        let contentHtml = '';
        let totalLinks = 0;

        if (data.length === 0) {
            contentHtml = '<div style="padding:20px; text-align:center; color:#fab387;">No links found.<br><small>Make sure you are on a game post page.</small></div>';
        } else {
            data.forEach((section, index) => {
                totalLinks += section.links.length;
                let linksHtml = '';
                section.links.forEach(link => {
                    linksHtml += `
                        <div class="ova-link-row">
                            <span class="ova-link-name">${link.name}</span>
                            <div class="ova-actions">
                                <button class="btn-sm btn-blue" onclick="window.open('${link.url}', '_blank')">OPEN</button>
                                <button class="btn-sm btn-green copy-single-btn" data-url="${link.url}">COPY</button>
                            </div>
                        </div>`;
                });

                // Section structure with footer buttons
                contentHtml += `
                    <div class="ova-section">
                        <div class="ova-section-title">${section.title}</div>
                        ${linksHtml}
                        <div class="ova-section-footer">
                            <button class="btn-action copy-section-btn" data-index="${index}">Copy Section</button>
                            <button class="btn-action show-section-btn" data-index="${index}">Show Links</button>
                        </div>
                    </div>`;
            });
        }

        panel.innerHTML = `
            <div id="ova-header">
                <div class="ova-header-title">Extracted Links (${totalLinks})</div>
                <button id="ova-close" style="background:transparent;border:none;color:#fff;cursor:pointer;font-size:16px;">✕</button>
            </div>
            <div id="ova-content">
                ${contentHtml}
                <div id="ova-viewer">
                    <textarea id="ova-viewer-text" readonly></textarea>
                    <div class="viewer-controls">
                        <button id="ova-viewer-copy" class="btn-green">Copy Text</button>
                        <button id="ova-viewer-close" class="btn-action">Close</button>
                    </div>
                </div>
            </div>
            <div id="ova-footer">
                <button id="ova-copy-all" class="btn-global">COPY ALL</button>
                <button id="ova-show-all" class="btn-global" style="background:#89b4fa;">SHOW ALL LINKS</button>
            </div>
        `;

        // --- Event Listeners ---

        document.getElementById('ova-close').onclick = () => panel.style.display = 'none';

        // Helper to show the Text Viewer
        const showViewer = (text) => {
            const viewer = document.getElementById('ova-viewer');
            const textArea = document.getElementById('ova-viewer-text');
            textArea.value = text;
            viewer.style.display = 'flex';
        };

        // Viewer Controls
        document.getElementById('ova-viewer-close').onclick = () => {
            document.getElementById('ova-viewer').style.display = 'none';
        };
        document.getElementById('ova-viewer-copy').onclick = function() {
            const text = document.getElementById('ova-viewer-text');
            text.select();
            GM_setClipboard(text.value);
            flashButton(this, 'Copied!');
        };

        // 1. Single Copy Buttons
        panel.querySelectorAll('.copy-single-btn').forEach(btn => {
            btn.onclick = function() {
                GM_setClipboard(this.dataset.url);
                flashButton(this, '✓');
            };
        });

        // 2. Section Actions
        panel.querySelectorAll('.copy-section-btn').forEach(btn => {
            btn.onclick = function() {
                const idx = this.dataset.index;
                const txt = data[idx].links.map(l => l.url).join('\n');
                GM_setClipboard(txt);
                flashButton(this, 'Copied!');
            };
        });

        panel.querySelectorAll('.show-section-btn').forEach(btn => {
            btn.onclick = function() {
                const idx = this.dataset.index;
                const txt = data[idx].links.map(l => l.url).join('\n');
                showViewer(txt);
            };
        });

        // 3. Global Actions
        const copyAllBtn = document.getElementById('ova-copy-all');
        const showAllBtn = document.getElementById('ova-show-all');

        if (data.length > 0) {
            const allLinksText = data.flatMap(section => section.links.map(l => l.url)).join('\n');

            copyAllBtn.onclick = function() {
                GM_setClipboard(allLinksText);
                flashButton(this, 'DONE!');
            };

            showAllBtn.onclick = function() {
                showViewer(allLinksText);
            };
        } else {
            copyAllBtn.style.display = 'none';
            showAllBtn.style.display = 'none';
        }

        panel.style.display = 'flex';
    }

    function flashButton(btn, text) {
        const originalText = btn.textContent;
        btn.textContent = text;
        btn.style.opacity = '0.8';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.opacity = '1';
        }, 1000);
    }

    function init() {
        const btn = document.createElement('button');
        btn.id = 'ova-float-btn';
        btn.textContent = '🔗 Extract Links';
        btn.onclick = function() {
            const panel = document.getElementById('ova-panel');
            if (panel && panel.innerHTML !== '') {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            } else {
                fetchAndExtract();
            }
        };
        document.body.appendChild(btn);
    }

    init();

})();
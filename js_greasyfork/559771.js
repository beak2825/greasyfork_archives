// ==UserScript==
// @name         Tab Layout Organizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Organize suas abas em layouts dentro de um painel lateral
// @author       Emerson
// @licence MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/559771/Tab%20Layout%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/559771/Tab%20Layout%20Organizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cria painel lateral
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.right = '0';
    panel.style.width = '250px';
    panel.style.height = '100%';
    panel.style.background = '#f0f0f0';
    panel.style.borderLeft = '2px solid #ccc';
    panel.style.overflowY = 'auto';
    panel.style.zIndex = '9999';
    panel.style.padding = '10px';
    panel.innerHTML = `
        <h3>Meus Layouts</h3>
        <button id="saveTab">Salvar aba</button>
        <button id="clearTabs">Limpar</button>
        <select id="layoutMode">
            <option value="list">Lista</option>
            <option value="grid">Grade</option>
        </select>
        <div id="tabContainer"></div>
        <hr>
        <small id="doomSignature" style="
            display:block;
            text-align:center;
            margin-top:10px;
            font-weight:bold;
            color:#0ff;
            text-shadow: 
                0 0 5px #0ff,
                0 0 10px #0ff,
                0 0 20px #0ff,
                0 0 40px #0ff;
        ">
            criado por DOOM_
        </small>
    `;
    document.body.appendChild(panel);

    const tabContainer = document.getElementById('tabContainer');
    let tabs = GM_getValue('tabs', []);

    function renderTabs() {
        const mode = document.getElementById('layoutMode').value;
        tabContainer.innerHTML = '';
        tabContainer.style.display = mode === 'grid' ? 'grid' : 'block';
        tabContainer.style.gridTemplateColumns = mode === 'grid' ? '1fr 1fr' : 'none';

        tabs.forEach((tab) => {
            const link = document.createElement('a');
            link.href = tab.url;
            link.textContent = tab.title;
            link.target = '_blank';
            link.style.display = 'block';
            link.style.margin = '5px';
            link.style.padding = '5px';
            link.style.background = '#fff';
            link.style.border = '1px solid #ccc';
            tabContainer.appendChild(link);
        });
    }

    document.getElementById('saveTab').onclick = () => {
        tabs.push({ title: document.title, url: window.location.href });
        GM_setValue('tabs', tabs);
        renderTabs();
    };

    document.getElementById('clearTabs').onclick = () => {
        tabs = [];
        GM_setValue('tabs', tabs);
        renderTabs();
    };

    document.getElementById('layoutMode').onchange = renderTabs;

    renderTabs();
})();
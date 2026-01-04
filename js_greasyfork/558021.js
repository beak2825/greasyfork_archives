// ==UserScript==
// @name         Add Button for Create Acceptance Tests
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add a button to Jira tickets to create acceptance tests via an n8n workflow.
// @author       Jérémy STEPHAN
// @match        https://obat.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558021/Add%20Button%20for%20Create%20Acceptance%20Tests.user.js
// @updateURL https://update.greasyfork.org/scripts/558021/Add%20Button%20for%20Create%20Acceptance%20Tests.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POST_URL = 'https://n8n-ops.obat.fr/webhook/f813d08c-8c56-4f32-b7e8-6906404574c2';

    function getStoryKey() {
        const url = new URL(window.location.href);
        const selectedIssue = url.searchParams.get('selectedIssue');
        if (selectedIssue) return selectedIssue;
        const pathParts = url.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        if (/^[A-Z]+-\d+$/.test(lastPart)) return lastPart;
        return '';
    }

    function handleCreateXrayTestsClick(event) {
        const storyKey = getStoryKey();

        const container = document.querySelector('div[data-testid="issue.views.field.rich-text.customfield_10085"]');
        if (!container) {
            alert("Aucun champ 'Tests d'acceptance' trouvé !");
            return;
        }

        const table = container.querySelector('table');
        if (!table) {
            alert("Aucun tableau de tests d'acceptation trouvé !");
            return;
        }

        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const tests = rows.map(tr => {
            const cells = tr.querySelectorAll('td');
            const text = Array.from(cells)
            .map(td => td.innerText.trim())
            .join('\n');
            return { content: text };
        });

        // Supprime ancienne modale si elle existe
        const oldModal = document.getElementById('xrayTestsModal');
        if (oldModal) oldModal.remove();

        // Création modale principale
        const overlay = document.createElement('div');
        overlay.id = 'xrayTestsModal';
        overlay.style = `
            position: fixed; top:0; left:0; width:100vw; height:100vh;
            background-color: rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background-color: #fff; padding: 20px;
            border-radius: 10px; min-width: 400px;
            max-height: 80vh; overflow-y: auto;
            box-shadow: 0 0 15px rgba(0,0,0,0.25);
            position: relative;
        `;

        modal.innerHTML = `
            <button id="closeXrayModal" style="position:absolute;top:5px;right:10px;border:none;background:none;font-size:18px;cursor:pointer;">🗙</button>
            <h3 style="margin-top:0;">Tests d'acceptation pour la Story ${storyKey}</h3>
            <p>Nombre de tests détectés : ${tests.length}</p>
            <div style="text-align:center; margin-top:15px;">
                <button id="sendXrayTests" class="aui-button aui-button-primary" style="width:100%;">Envoyer au webhook</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeBtn = document.getElementById('closeXrayModal');
        closeBtn.addEventListener('click', () => overlay.remove());

        document.getElementById('sendXrayTests').addEventListener('click', () => {
            const btn = document.getElementById('sendXrayTests');
            btn.disabled = true;

            // Remplace le contenu de la modale par le message final directement
            modal.innerHTML = `
                <button id="closeXrayModal" style="position:absolute;top:5px;right:10px;border:none;background:none;font-size:18px;cursor:pointer;">🗙</button>
                <p id="waitingMessage">
                    ✅ La génération des tests est en cours.<br>
                    Cela peut prendre plusieurs minutes.<br>
                    Un message sera visible dans le canal Slack <a href="https://obat.slack.com/archives/C094Z9B0KRV" target="_blank">#ia-qa-tests-generator</a>.
                </p>
            `;
            document.getElementById('closeXrayModal').addEventListener('click', () => overlay.remove());

            // Envoi au webhook
            const payload = { issue: storyKey };
            fetch(POST_URL, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            })
                .catch(err => {
                const msg = document.getElementById('waitingMessage');
                msg.innerText = `❌ Une erreur est survenue : ${err.message}`;
            });
        });
    }

    function addButton() {
        const h2List = document.querySelectorAll('h2');
        h2List.forEach(h2 => {
            if (!h2.textContent.includes("Tests d'acceptance")) return;

            const closestBlock = h2.closest('div');
            const topBlock = closestBlock?.parentElement;
            if (!topBlock) return;

            if (!document.getElementById('btn-create-xray-tests')) {
                const reference = document.getElementById('btn-generate-acceptance');
                if (reference) {
                    const createBtn = document.createElement('button');
                    createBtn.id = 'btn-create-xray-tests';
                    createBtn.textContent="Créer les tests d'acceptation (JIRA/XRAY)";
                    createBtn.className='aui-button aui-button-secondary';
                    createBtn.style='margin-left:8px; margin-top:10px;';
                    createBtn.addEventListener('click', handleCreateXrayTestsClick);
                    reference.insertAdjacentElement('afterend', createBtn);
                }
            }
        });
    }

    const observer = new MutationObserver(addButton);
    observer.observe(document.body, { childList:true, subtree:true });
    window.addEventListener('load', addButton);

})();

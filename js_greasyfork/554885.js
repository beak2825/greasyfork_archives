// ==UserScript==
// @name         Add Button for generating Functional Tests in Story from Epic
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add a button to Jira Epic tickets to generate Functional tests in Story via an n8n workflow.
// @author       Jérémy STEPHAN
// @match        https://obat.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554885/Add%20Button%20for%20generating%20Functional%20Tests%20in%20Story%20from%20Epic.user.js
// @updateURL https://update.greasyfork.org/scripts/554885/Add%20Button%20for%20generating%20Functional%20Tests%20in%20Story%20from%20Epic.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POST_URL = 'https://n8n-ops.obat.fr/webhook/3d81a6f9-7883-422f-83bf-1f446bb14082';

    // Vérifie si le ticket courant est un EPIC
    function isEpicPage() {
        const typeButton = document.querySelector('[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]');
        if (!typeButton) return false;
        const label = typeButton.getAttribute('aria-label') || '';
        const isEpic = label.toLowerCase().includes('epic');
        console.log(`[Tampermonkey] Ticket type détecté: "${label}" -> isEpic: ${isEpic}`);
        return isEpic;
    }

    function getIssueKey() {
        const url = new URL(window.location.href);
        const selectedIssue = url.searchParams.get('selectedIssue');
        if (selectedIssue) return selectedIssue;
        const pathParts = url.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        if (/^[A-Z]+-\d+$/.test(lastPart)) return lastPart;
        return '';
    }

    function showModal(issueKey) {
        // Supprime l'ancienne modale
        const oldModal = document.getElementById('generateEpicTestsModal');
        if (oldModal) oldModal.remove();

        const overlay = document.createElement('div');
        overlay.id = 'generateEpicTestsModal';
        overlay.style = `
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            background-color: rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background-color: #fff; padding: 20px;
            border-radius: 10px; min-width: 350px;
            box-shadow: 0 0 10px rgba(0,0,0,0.25);
            position: relative;
        `;

        modal.innerHTML = `
            <button id="closeEpicModal" style="
                position: absolute; top: 5px; right: 10px;
                border: none; background: none; font-size: 18px; cursor: pointer;">🗙</button>
            <h3 style="margin-top:0;">Générer les tests fonctionnels</h3>
            <p>Les tests seront générés pour toutes les US liées à l'EPIC <b>${issueKey}</b>.</p>
            <div style="text-align:right;">
                <button id="generateEpicTestsBtn">Générer</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Fermeture de la modale
        document.getElementById('closeEpicModal').addEventListener('click', () => overlay.remove());

        // Action du bouton "Générer"
        document.getElementById('generateEpicTestsBtn').addEventListener('click', () => {
            const btn = document.getElementById('generateEpicTestsBtn');
            overlay.querySelector('p').innerText = 'Envoi de la demande au webhook...';

            fetch(POST_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ epic: issueKey })
            })
                .then(res => {
                if (res.ok) {
                    // Génération réussie : supprime le bouton
                    btn.remove();

                    overlay.querySelector('p').innerHTML = `
                ✅ Les tests sont en cours de génération.<br>
                Cela peut prendre plusieurs minutes.<br>
                Un message sera visible dans le canal Slack <a href="https://obat.slack.com/archives/C094Z9B0KRV" target="_blank">#ia-qa-tests-generator</a>.
            `;
                } else {
                    // Erreur HTTP : supprime le bouton
                    overlay.querySelector('p').innerText = '⚠️ Erreur lors de l’envoi: ' + res.status;
                    btn.remove();
                }
            })
                .catch(err => {
                // Erreur réseau ou autre : supprime le bouton
                overlay.querySelector('p').innerText = '❌ Erreur : ' + err.message;
                btn.remove();
            });
        });
    }

    function addButton() {
        if (!isEpicPage()) return;
        if (document.getElementById('btn-generate-epic-tests')) return;

        const referenceNode = document.querySelector('.css-6cu6fo');
        if (!referenceNode) return;

        const btn = document.createElement('button');
        btn.id = 'btn-generate-epic-tests';
        btn.textContent = '⚡ Générer tests US de l’EPIC';
        btn.className = 'aui-button aui-button-primary';
        btn.style.marginTop = '10px';
        btn.addEventListener('click', () => showModal(getIssueKey()));

        referenceNode.insertAdjacentElement('afterend', btn);
        console.log('[Tampermonkey] Bouton de génération EPIC ajouté');
    }

    const observer = new MutationObserver(() => addButton());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => addButton());

})();
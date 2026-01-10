// ==UserScript==
// @name         Sharewood Torrent Download Buttons in List
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Ajoute un bouton "télécharger" directement sur la page de recherche sur sharewood.tv
// @author       UptoPol 
// @match        https://www.sharewood.tv/torrents
// @icon         https://www.sharewood.tv/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562063/Sharewood%20Torrent%20Download%20Buttons%20in%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/562063/Sharewood%20Torrent%20Download%20Buttons%20in%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processPage);
    } else {
        processPage();
    }

    function processPage() {
        // Sélectionner toutes les lignes de torrents dans la liste
        const torrentRows = document.querySelectorAll('.table-responsive-line');

        torrentRows.forEach(row => {
            // Vérifier si cette ligne a déjà été traitée
            if (row.hasAttribute('data-download-processed')) {
                return;
            }

            // Trouver le lien du torrent dans cette ligne
            const torrentLink = row.querySelector('a[href*="/torrents/"][data-id]');
            if (!torrentLink) return;

            // Extraire l'ID et le slug du torrent
            const torrentId = torrentLink.getAttribute('data-id');
            const torrentSlug = torrentLink.getAttribute('data-slug');

            // Trouver la dernière colonne (celle avec S/L/C)
            const lastColumn = row.querySelector('.col-md-2.col-detail:last-child');
            if (!lastColumn) return;

            // Trouver la div .row à l'intérieur de cette colonne
            const innerRow = lastColumn.querySelector('.row');
            if (!innerRow) return;

            // Vérifier si le bouton existe déjà
            if (innerRow.querySelector('.custom-download-btn-container')) {
                return;
            }

            // Créer un conteneur pour le bouton (col-xs-4 comme les autres)
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'col-xs-4 col-padding custom-download-btn-container';
            buttonContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
            `;

            // Créer le bouton de téléchargement
            const downloadBtn = document.createElement('a');
            downloadBtn.href = `https://www.sharewood.tv/download/${torrentSlug}.${torrentId}`;
            downloadBtn.className = 'btn btn-primary btn-xs custom-download-btn';
            downloadBtn.innerHTML = '<i class="fa fa-download"></i>';
            downloadBtn.style.cssText = `
                white-space: nowrap;
                padding: 3px 8px;
                font-size: 11px;
                margin: 0;
                width: 100%;
                text-align: center;
                background: linear-gradient(135deg, #2196F3 0%, #0D47A1 100%) !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                text-decoration: none !important;
                transition: all 0.3s ease !important;
                box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3) !important;
                display: inline-block !important;
            `;

            // Effet hover
            downloadBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.4)';
                this.style.background = 'linear-gradient(135deg, #0D47A1 0%, #2196F3 100%)';
            });

            downloadBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.3)';
                this.style.background = 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)';
            });

            // Ajouter le bouton au conteneur
            buttonContainer.appendChild(downloadBtn);

            // Ajouter le conteneur à la ligne
            innerRow.appendChild(buttonContainer);

            // Marquer cette ligne comme traitée
            row.setAttribute('data-download-processed', 'true');
        });
    }

    // Observer les changements dynamiques de la page (pour la pagination/infinite scroll)
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // Vérifier si des nouvelles lignes de torrents ont été ajoutées
                        if (node.classList && node.classList.contains('table-responsive-line')) {
                            shouldProcess = true;
                        } else if (node.querySelector && node.querySelector('.table-responsive-line')) {
                            shouldProcess = true;
                        }
                    }
                });
            }
        });

        if (shouldProcess) {
            // Attendre un peu pour que le DOM soit complètement mis à jour
            setTimeout(processPage, 100);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Ré-exécuter après les chargements AJAX
    let oldAjax = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            if (this.responseURL && this.responseURL.includes('sharewood.tv')) {
                setTimeout(processPage, 500);
            }
        });
        return oldAjax.apply(this, arguments);
    };
})();
// ==UserScript==
// @name         Auto Faucet Claimer - Futuriste
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatise le processus de claim sur les faucets crypto avec interface futuriste
// @author       VotreNom
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/549523/Auto%20Faucet%20Claimer%20-%20Futuriste.user.js
// @updateURL https://update.greasyfork.org/scripts/549523/Auto%20Faucet%20Claimer%20-%20Futuriste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration des faucets
    const faucets = [
        {
            name: "Trump",
            url: "https://freetrump.in?ref=ppJFnf3MN7",
            claimSelector: "button#claim-button, input[type='submit'][value*='Claim'], .claim-button",
            timer: 10000
        },
        {
            name: "Bitcoin",
            url: "https://freebitco.in/?r=895981",
            claimSelector: "button#free_play_form_button, .claim-button, .btn-claim",
            timer: 10000
        },
        {
            name: "XRP",
            url: "https://freexrp.in?ref=UkpS7X35hO",
            claimSelector: "button.claim-btn, .claim-button, .btn-claim",
            timer: 10000
        },
        {
            name: "Shiba Inu",
            url: "https://freeshib.in?ref=OpxzVbgF1x",
            claimSelector: "#claim, .claim-button, button[onclick*='claim']",
            timer: 10000
        },
        {
            name: "Sui",
            url: "https://freesui.in?ref=h61ChGeVEj",
            claimSelector: ".faucet-claim-btn, .claim-button, .btn-primary",
            timer: 10000
        },
        {
            name: "USD Stablecoin",
            url: "https://usdpick.io?ref=S6L5FjWLfZ",
            claimSelector: "#claim_btn, .claim-button, .btn-success",
            timer: 10000
        },
        {
            name: "Arbitrum",
            url: "https://freearb.in?ref=HJ9z1FwNXK",
            claimSelector: ".claim-rewards, .claim-button, .btn-claim",
            timer: 10000
        },
        {
            name: "Tron",
            url: "https://freetron.in?ref=vkkIZZNK47",
            claimSelector: "#claimButton, .claim-button, .btn-claim",
            timer: 10000
        },
        {
            name: "Binance Coin",
            url: "https://freebnb.in?ref=es0DFLc16v",
            claimSelector: ".faucet-button, .claim-button, .btn-claim",
            timer: 10000
        },
        {
            name: "Toncoin",
            url: "https://freetoncoin.in?ref=YMUTSnsOIW",
            claimSelector: "#claim_btn, .claim-button, .btn-claim",
            timer: 10000
        }
    ];

    // Variables globales
    let isRunning = false;
    let currentFaucetIndex = 0;
    let countdownInterval;
    let nextClaimTime = GM_getValue("nextClaimTime", 0);
    let currentTab = null;
    let autoClickEnabled = GM_getValue("autoClickEnabled", true);
    let autoCloseEnabled = GM_getValue("autoCloseEnabled", true);

    // Créer l'interface utilisateur
    function createUI() {
        // Style de l'interface
        const style = `
            <style>
                #autoFaucetContainer {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 350px;
                    background: linear-gradient(135deg, #0a0a1a, #050510);
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    border-radius: 15px;
                    padding: 15px;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
                    z-index: 10000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #f0f0ff;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }
                #autoFaucetHeader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(0, 255, 136, 0.3);
                }
                #autoFaucetTitle {
                    font-size: 16px;
                    font-weight: bold;
                    background: linear-gradient(45deg, #00ff88, #0099ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }
                #autoFaucetToggle {
                    background: linear-gradient(45deg, #00ff88, #0099ff);
                    border: none;
                    border-radius: 20px;
                    padding: 5px 15px;
                    color: #0a0a1a;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                #autoFaucetToggle:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                }
                #autoFaucetStatus {
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                #autoFaucetCountdown {
                    font-size: 18px;
                    font-weight: bold;
                    text-align: center;
                    margin: 10px 0;
                    font-family: 'Courier New', monospace;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                #autoFaucetProgress {
                    height: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                    margin: 10px 0;
                    overflow: hidden;
                }
                #autoFaucetProgressBar {
                    height: 100%;
                    background: linear-gradient(45deg, #00ff88, #0099ff);
                    border-radius: 5px;
                    width: 0%;
                    transition: width 0.5s ease;
                }
                #autoFaucetCurrent {
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                #autoFaucetNext {
                    font-size: 12px;
                    opacity: 0.8;
                }
                .faucet-list {
                    max-height: 200px;
                    overflow-y: auto;
                    margin-top: 10px;
                }
                .faucet-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    margin: 5px 0;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    border-left: 3px solid #00ff88;
                }
                .faucet-name {
                    font-size: 14px;
                }
                .faucet-status {
                    font-size: 12px;
                }
                .status-completed {
                    color: #00ff88;
                }
                .status-active {
                    color: #0099ff;
                    font-weight: bold;
                }
                .status-pending {
                    color: rgba(255, 255, 255, 0.5);
                }
                .settings-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 10px 0;
                }
                .settings-label {
                    font-size: 14px;
                }
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(255, 255, 255, 0.1);
                    transition: .4s;
                    border-radius: 24px;
                }
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .slider {
                    background: linear-gradient(45deg, #00ff88, #0099ff);
                }
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                #autoFaucetMinimize {
                    position: absolute;
                    top: 10px;
                    right: 40px;
                    background: none;
                    border: none;
                    color: #f0f0ff;
                    cursor: pointer;
                    font-size: 16px;
                }
                .minimized {
                    transform: translateX(330px);
                }
                .minimized #autoFaucetHeader,
                .minimized #autoFaucetStatus,
                .minimized #autoFaucetCountdown,
                .minimized #autoFaucetProgress,
                .minimized #autoFaucetCurrent,
                .minimized #autoFaucetNext,
                .minimized .faucet-list,
                .minimized .settings-row {
                    display: none;
                }
                .minimized #autoFaucetMinimize {
                    right: 10px;
                }
            </style>
        `;

        // HTML de l'interface
        const html = `
            <div id="autoFaucetContainer">
                <button id="autoFaucetMinimize"><i class="fas fa-chevron-right"></i></button>
                <div id="autoFaucetHeader">
                    <div id="autoFaucetTitle">Auto Faucet Claimer</div>
                    <button id="autoFaucetToggle">Démarrer</button>
                </div>
                <div id="autoFaucetStatus">Prêt à commencer</div>
                <div id="autoFaucetCountdown">60:00</div>
                <div id="autoFaucetProgress">
                    <div id="autoFaucetProgressBar"></div>
                </div>
                <div id="autoFaucetCurrent">Prochain faucet: -</div>
                <div id="autoFaucetNext">Prochain claim: -</div>

                <div class="settings-row">
                    <span class="settings-label">Clic automatique</span>
                    <label class="switch">
                        <input type="checkbox" id="autoClickToggle" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="settings-row">
                    <span class="settings-label">Fermeture auto</span>
                    <label class="switch">
                        <input type="checkbox" id="autoCloseToggle" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="faucet-list" id="faucetList"></div>
            </div>
        `;

        // Ajouter le style et le HTML à la page
        $('body').append(style + html);

        // Initialiser la liste des faucets
        updateFaucetList();

        // Gérer le clic sur le bouton de démarrage/arrêt
        $('#autoFaucetToggle').click(toggleAutoClaim);

        // Gérer la minimisation
        $('#autoFaucetMinimize').click(function() {
            $('#autoFaucetContainer').toggleClass('minimized');
            const icon = $(this).find('i');
            icon.toggleClass('fa-chevron-right fa-chevron-left');
        });

        // Gérer les paramètres
        $('#autoClickToggle').prop('checked', autoClickEnabled).change(function() {
            autoClickEnabled = $(this).is(':checked');
            GM_setValue("autoClickEnabled", autoClickEnabled);
        });

        $('#autoCloseToggle').prop('checked', autoCloseEnabled).change(function() {
            autoCloseEnabled = $(this).is(':checked');
            GM_setValue("autoCloseEnabled", autoCloseEnabled);
        });

        // Mettre à jour le compte à rebours
        updateCountdown();
    }

    // Mettre à jour la liste des faucets dans l'UI
    function updateFaucetList() {
        const faucetList = $('#faucetList');
        faucetList.empty();

        faucets.forEach((faucet, index) => {
            let status, statusClass;
            if (index < currentFaucetIndex) {
                status = 'Terminé';
                statusClass = 'status-completed';
            } else if (index === currentFaucetIndex && isRunning) {
                status = 'En cours...';
                statusClass = 'status-active';
            } else {
                status = 'En attente';
                statusClass = 'status-pending';
            }

            faucetList.append(`
                <div class="faucet-item">
                    <span class="faucet-name">${faucet.name}</span>
                    <span class="faucet-status ${statusClass}">${status}</span>
                </div>
            `);
        });
    }

    // Basculer entre démarrage et arrêt
    function toggleAutoClaim() {
        if (isRunning) {
            stopAutoClaim();
        } else {
            startAutoClaim();
        }
    }

    // Démarrer le processus automatique
    function startAutoClaim() {
        if (isRunning) return;

        isRunning = true;
        $('#autoFaucetToggle').text('Arrêter');
        $('#autoFaucetStatus').text('Démarrage en cours...');

        // Réinitialiser l'index si on a déjà terminé tous les faucets
        if (currentFaucetIndex >= faucets.length) {
            currentFaucetIndex = 0;
            updateFaucetList();
        }

        // Commencer le processus
        processNextFaucet();
    }

    // Arrêter le processus automatique
    function stopAutoClaim() {
        isRunning = false;
        $('#autoFaucetToggle').text('Démarrer');
        $('#autoFaucetStatus').text('Processus arrêté');
        clearTimeout(countdownInterval);

        // Fermer l'onglet actuel s'il existe
        if (currentTab && !currentTab.closed) {
            try {
                currentTab.close();
            } catch (e) {
                console.log("Impossible de fermer l'onglet:", e);
            }
        }
    }

    // Traiter le prochain faucet
    function processNextFaucet() {
        if (!isRunning || currentFaucetIndex >= faucets.length) {
            // Tous les faucets ont été traités
            finishCycle();
            return;
        }

        const faucet = faucets[currentFaucetIndex];
        $('#autoFaucetStatus').html(`Traitement de <strong>${faucet.name}</strong>...`);
        $('#autoFaucetCurrent').text(`Faucet actuel: ${faucet.name}`);

        // Mettre à jour la liste des faucets
        updateFaucetList();

        // Ouvrir le faucet dans un nouvel onglet
        currentTab = window.open(faucet.url, '_blank');

        if (!currentTab) {
            $('#autoFaucetStatus').html('Popup bloqué! Veuillez autoriser les popups pour ce site.');
            setTimeout(() => {
                currentFaucetIndex++;
                processNextFaucet();
            }, 3000);
            return;
        }

        // Attendre que la page se charge puis essayer de cliquer automatiquement
        setTimeout(() => {
            if (autoClickEnabled) {
                try {
                    // Injecter un script pour trouver et cliquer sur le bouton de claim
                    const clickScript = `
                        (function() {
                            // Trouver le bouton de claim
                            const claimSelectors = ${JSON.stringify(faucet.claimSelector.split(', '))};
                            let claimButton = null;

                            for (const selector of claimSelectors) {
                                claimButton = document.querySelector(selector);
                                if (claimButton) break;
                            }

                            // Cliquer sur le bouton s'il existe
                            if (claimButton) {
                                claimButton.click();
                                return true;
                            }
                            return false;
                        })();
                    `;

                    // Exécuter le script dans l'onglet
                    const success = currentTab.eval(clickScript);

                    if (success) {
                        $('#autoFaucetStatus').html(`Clic automatique sur <strong>${faucet.name}</strong> réussi!`);
                    } else {
                        $('#autoFaucetStatus').html(`Bouton de claim non trouvé sur <strong>${faucet.name}</strong>. Veuillez cliquer manuellement.`);
                    }
                } catch (e) {
                    $('#autoFaucetStatus').html(`Impossible d'automatiser le clic sur <strong>${faucet.name}</strong>. Veuillez cliquer manuellement.`);
                }
            } else {
                $('#autoFaucetStatus').html(`Veuillez cliquer manuellement sur le bouton de claim sur <strong>${faucet.name}</strong>.`);
            }

            // Attendre que l'utilisateur termine puis passer au suivant
            setTimeout(() => {
                if (autoCloseEnabled && currentTab && !currentTab.closed) {
                    try {
                        currentTab.close();
                    } catch (e) {
                        console.log("Impossible de fermer l'onglet:", e);
                    }
                }

                currentFaucetIndex++;
                processNextFaucet();
            }, faucet.timer);
        }, 3000);
    }

    // Terminer un cycle complet
    function finishCycle() {
        isRunning = false;
        $('#autoFaucetToggle').text('Démarrer');
        $('#autoFaucetStatus').html('Cycle terminé! Prochain cycle dans 60 minutes.');

        // Définir l'heure du prochain claim
        const nextTime = Date.now() + 60 * 60 * 1000; // 60 minutes
        GM_setValue("nextClaimTime", nextTime);
        nextClaimTime = nextTime;

        // Réinitialiser l'index pour le prochain cycle
        currentFaucetIndex = 0;
        updateFaucetList();

        // Mettre à jour le compte à rebours
        updateCountdown();

        // Notification
        if (Notification.permission === 'granted') {
            new Notification('Cycle de claims terminé', {
                body: 'Le prochain cycle commencera dans 60 minutes',
                icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Cycle de claims terminé', {
                        body: 'Le prochain cycle commencera dans 60 minutes',
                        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
                    });
                }
            });
        }
    }

    // Mettre à jour le compte à rebours
    function updateCountdown() {
        clearInterval(countdownInterval);

        function update() {
            const now = Date.now();
            let timeLeft;

            if (nextClaimTime > now) {
                timeLeft = nextClaimTime - now;
            } else {
                timeLeft = 0;
            }

            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);

            $('#autoFaucetCountdown').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            // Mettre à jour la barre de progression
            const progress = 100 - (timeLeft / (60 * 60 * 1000) * 100);
            $('#autoFaucetProgressBar').css('width', `${progress}%`);

            // Mettre à jour le texte du prochain claim
            if (timeLeft > 0) {
                const nextDate = new Date(nextClaimTime);
                $('#autoFaucetNext').text(`Prochain claim: ${nextDate.toLocaleTimeString()}`);
            } else {
                $('#autoFaucetNext').text('Prêt pour un nouveau cycle');
            }
        }

        update();
        countdownInterval = setInterval(update, 1000);
    }

    // Initialiser l'interface
    $(document).ready(function() {
        // Vérifier si l'interface n'existe pas déjà
        if ($('#autoFaucetContainer').length === 0) {
            createUI();
        }

        // Vérifier s'il y a un cycle en cours
        const savedNextClaim = GM_getValue("nextClaimTime", 0);
        if (savedNextClaim > Date.now()) {
            nextClaimTime = savedNextClaim;
            $('#autoFaucetStatus').text('En attente du prochain cycle...');
        }

        // Demander la permission pour les notifications
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    });

})();
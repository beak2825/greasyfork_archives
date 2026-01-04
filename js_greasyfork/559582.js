// ==UserScript==
// @name         BetFury Christmas Master V51.5 - Premium Edition
// @namespace    http://tampermonkey.net/
// @version      51.5.12
// @description  Bot BetFury avec interface de contrôle + Système de Licence Cloud Firestore
// @author       Gemini & Vous
// @match        *://*.betfury.com/*
// @match        *://*.betfury.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559582/BetFury%20Christmas%20Master%20V515%20-%20Premium%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/559582/BetFury%20Christmas%20Master%20V515%20-%20Premium%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================
    // CONFIGURATION LICENCE (FIREBASE RÉELLE)
    // ========================================================
    const AUTH_CONFIG = {
        apiKey: "AIzaSyAcLfR1B0U3Um4tSnjx0BLxxJMK9p2usYQ", 
        projectId: "diccebot"
    };

    // ========================================================
    // LOGIQUE DE VÉRIFICATION CLOUD
    // ========================================================
    async function verifierLicence(cle) {
        return new Promise((resolve) => {
            // Utilisation de l'API REST v1 de Google Cloud Firestore
            const url = `https://firestore.googleapis.com/v1/projects/${AUTH_CONFIG.projectId}/databases/(default)/documents/licenses/${cle}?key=${AUTH_CONFIG.apiKey}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const fields = data.fields;

                            // Extraction des données selon le format JSON Firestore REST
                            const estActive = fields.active ? fields.active.booleanValue : false;
                            
                            // Firestore renvoie les dates au format ISO 8601 dans timestampValue
                            const expirationStr = fields.expiry ? fields.expiry.timestampValue : null;
                            const dateExpiration = expirationStr ? new Date(expirationStr) : new Date(0);
                            const maintenant = new Date();

                            if (estActive && dateExpiration > maintenant) {
                                console.log("%c✅ Licence Validée", "color: green; font-weight: bold;");
                                resolve({ valide: true, expiration: dateExpiration });
                            } else {
                                resolve({ valide: false, raison: "Licence expirée ou désactivée" });
                            }
                        } catch (e) {
                            console.error("Erreur parsing:", e);
                            resolve({ valide: false, raison: "Erreur de format base de données" });
                        }
                    } else if (response.status === 404) {
                        resolve({ valide: false, raison: "Clé de licence inconnue" });
                    } else {
                        resolve({ valide: false, raison: "Erreur serveur Firestore (" + response.status + ")" });
                    }
                },
                onerror: () => resolve({ valide: false, raison: "Erreur de connexion réseau" }),
                ontimeout: () => resolve({ valide: false, raison: "Délai de connexion dépassé" })
            });
        });
    }

    // ========================================================
    // INITIALISATION ET ÉCRAN DE CONNEXION
    // ========================================================
    async function init() {
        // Vérification si une clé est déjà enregistrée localement
        const cleSauvegardee = GM_getValue('bf_license_key', null);

        if (cleSauvegardee) {
            const status = await verifierLicence(cleSauvegardee);
            if (status.valide) {
                lancerBotPrincipal();
                return;
            } else {
                // Si la clé sauvée n'est plus valide, on la supprime
                GM_setValue('bf_license_key', null);
            }
        }

        // Demande de clé si aucune clé valide n'est trouvée
        const userKey = prompt("🔑 BETFURY PREMIUM ACTIVATION\n\nVeuillez entrer votre clé de licence :");
        
        if (userKey && userKey.trim() !== "") {
            const status = await verifierLicence(userKey.trim());
            if (status.valide) {
                GM_setValue('bf_license_key', userKey.trim());
                alert("✅ Activation réussie !\nExpire le : " + status.expiration.toLocaleDateString());
                lancerBotPrincipal();
            } else {
                alert("❌ ACCÈS REFUSÉ : " + status.raison);
                location.reload();
            }
        } else {
            document.body.innerHTML = "<div style='color:white; background:red; padding:20px; text-align:center; font-size:20px;'>Clé de licence requise pour utiliser le bot.</div>";
        }
    }

    // ========================================================
    // LE BOT (CODE ORIGINAL BETFURY)
    // ========================================================
    function lancerBotPrincipal() {
        // ... (Le reste de ton code UI et logique de jeu reste identique) ...
        console.log("Bot démarré avec succès.");
        
        // On insère ici ton code de lancerBotPrincipal que tu avais déjà
        // (Interface, setInterval(scan, 1000), etc.)
        
        // Note: Pour garder la réponse concise, j'ai omis la répétition de la logique UI 
        // mais elle doit être présente ici dans ton script final.
    }

    init();
})();

// ==UserScript==
// @name         MH2 - Bouton Ma Vue + Envoi Auto
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Bouton sur Ma vue + envoi auto troll/mission (compatible GreasyFork bloquant ou non)
// @author       Vous + Grok
// @match        https://mh2.mh.raistlin.fr/mountyhall/MH_Play/Play.php*
// @match        https://mh2.mh.raistlin.fr/mountyhall/MH_Play/Play2.php*
// @match        https://mh2.mh.raistlin.fr/mountyhall/MH_Play/Play_*.php*
// @match        https://mh2.mh.raistlin.fr/mountyhall/MH_Play/TurnStart.php*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        none
// @connect      mh.percolouco.com
// @downloadURL https://update.greasyfork.org/scripts/556260/MH2%20-%20Bouton%20Ma%20Vue%20%2B%20Envoi%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/556260/MH2%20-%20Bouton%20Ma%20Vue%20%2B%20Envoi%20Auto.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // INTERCEPTION GLOBALE DÈS LE DÉBUT - AVANT TOUT CHARGEMENT
  const capturedData = {};

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;
    this._method = method;
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (data) {
    const xhr = this;

    xhr.addEventListener('load', function () {
      if (
        xhr._url &&
        xhr._url.includes('json_vue.php') &&
        xhr._url.includes('w=') &&
        !xhr._url.includes('c&w=')
      ) {
        const match = xhr._url.match(/w=([^&]+)/);
        if (match) {
          const type = match[1];
          try {
            const data = JSON.parse(xhr.responseText);
            capturedData[type] = data;
            console.log(
              `[MH2] 📡 CAPTURÉ ${type.toUpperCase()}: ${Array.isArray(data) ? data.length : 'N/A'} éléments`
            );
            if (Array.isArray(data) && data.length > 0) {
              console.log(`[MH2]   Premier élément:`, data[0]);
            }
          } catch (e) {
            console.log(`[MH2] Erreur capture ${type}:`, e.message);
          }
        }
      }
    });

    return originalSend.apply(this, arguments);
  };

  console.log('[MH2] ✓✓✓ INTERCEPTEUR GLOBAL INSTALLÉ DÈS LE DÉBUT ✓✓✓');

  console.log(
    '[MH2] Script démarré - Frame:',
    window.name,
    '- URL:',
    window.location.href
  );

  // Si on est dans la page principale Play.php, ignorer
  if (window.name === '' && window.location.href.includes('Play.php')) {
    console.log(
      '[MH2] Dans la page principale, script ignoré (on attendra Play2.php)'
    );
    return;
  }

  // Si on est dans la frame Main (Play2.php) ou directement dans Contenu ou sur TurnStart.php
  const isMain =
    window.name === 'Main' || window.location.href.includes('Play2.php');
  const isContenu =
    window.name === 'Contenu' || window.location.href.includes('Play_a_Action');
  const isTurnStart = window.location.href.includes('TurnStart.php');

  if (isMain || isContenu || isTurnStart) {
    console.log(
      `[MH2] ✓ Dans la frame ${window.name || 'inconnue'} ! Installation intercepteur XHR...`
    );

    // INTERCEPTER XMLHttpRequest IMMÉDIATEMENT, avant tout chargement
    installerIntercepteurXHR();

    // Puis démarrer la surveillance
    demarrerSurveillance();
  } else {
    console.log('[MH2] ⚠ Frame non reconnue, script ne démarre pas');
    console.log('[MH2] Détails:', {
      windowName: window.name,
      href: window.location.href,
      isMain: isMain,
      isContenu: isContenu,
      isTurnStart: isTurnStart,
    });
  }

  function installerIntercepteurXHR() {
    console.log('[MH2] Installation intercepteur XMLHttpRequest...');

    // Intercepter XMLHttpRequest dans la fenêtre actuelle (Main)
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._url = url;
      this._method = method;
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (data) {
      const xhr = this;

      xhr.addEventListener('load', function () {
        // Vérifier si c'est une requête json_vue.php
        if (xhr._url && xhr._url.includes('json_vue.php')) {
          console.log('[MH2] 📡 Requête JSON interceptée !');
          console.log('[MH2]   URL:', xhr._url);
          console.log('[MH2]   Status:', xhr.status);

          try {
            const data = JSON.parse(xhr.responseText);
            console.log('[MH2]   Données:', data);

            // Extraire le type (monstres, trolls, etc.)
            const match = xhr._url.match(/w=([^&]+)/);
            if (match) {
              const type = match[1];
              console.log(
                `[MH2]   ✓ Type: ${type}, ${Array.isArray(data) ? data.length : 'N/A'} éléments`
              );
            }
          } catch (e) {
            console.log('[MH2]   (Pas du JSON ou erreur)');
          }
        }
      });

      return originalSend.apply(this, arguments);
    };

    console.log('[MH2] ✓ Intercepteur XHR installé dans Main !');
  }

  function installerIntercepteurDansFrame(targetFrame) {
    try {
      const XHR = targetFrame.XMLHttpRequest;
      const originalOpen = XHR.prototype.open;
      const originalSend = XHR.prototype.send;

      XHR.prototype.open = function (method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
      };

      XHR.prototype.send = function (data) {
        const xhr = this;

        xhr.addEventListener('load', function () {
          if (xhr._url && xhr._url.includes('json_vue.php')) {
            console.log('[MH2] 📡📡📡 Requête JSON interceptée dans Contenu !');
            console.log('[MH2]   URL:', xhr._url);
            console.log('[MH2]   Status:', xhr.status);

            try {
              const data = JSON.parse(xhr.responseText);
              console.log('[MH2]   Données:', data);

              const match = xhr._url.match(/w=([^&]+)/);
              if (match) {
                const type = match[1];
                console.log(
                  `[MH2]   ✓✓✓ Type: ${type}, ${Array.isArray(data) ? data.length : 'N/A'} éléments`
                );
              }
            } catch (e) {
              console.log('[MH2]   (Erreur parsing)');
            }
          }
        });

        return originalSend.apply(this, arguments);
      };

      console.log('[MH2] ✓✓✓ Intercepteur XHR installé dans frame Contenu !');
    } catch (e) {
      console.log(
        '[MH2] Erreur installation intercepteur dans Contenu:',
        e.message
      );
    }
  }

  function demarrerSurveillance() {
    let dernierURL = '';
    let dernierTitre = '';

    // Détecter si on est directement dans la frame Contenu ou sur TurnStart.php
    const estDansContenu =
      window.name === 'Contenu' ||
      window.location.href.includes('Play_a_Action') ||
      window.location.href.includes('TurnStart.php');

    // Intercepter les requêtes JSON dans la frame Contenu
    intercepterRequetesJSON();

    // Debug : lister toutes les frames disponibles
    if (!estDansContenu) {
      console.log('[MH2] === DEBUG: Liste des frames dans Main ===');
      console.log('[MH2] Nombre de frames:', window.frames.length);
      for (let i = 0; i < window.frames.length; i++) {
        try {
          const frame = window.frames[i];
          console.log(`[MH2] Frame ${i}:`, {
            name: frame.name,
            url: frame.location.href,
            titre: frame.document?.title || 'inaccessible',
          });
        } catch (e) {
          console.log(`[MH2] Frame ${i}: accès refusé (${e.message})`);
        }
      }
      console.log('[MH2] === FIN DEBUG ===');
    } else {
      console.log(
        '[MH2] === Script exécuté directement dans la frame Contenu ==='
      );
    }

    function surveiller() {
      try {
        let frameContenu;

        if (estDansContenu) {
          // Si on est directement dans Contenu, utiliser la fenêtre actuelle
          frameContenu = window;
        } else {
          // Sinon, chercher la frame Contenu dans les sous-frames
          frameContenu = window.frames['Contenu'] || window.frames[0];
        }

        if (!frameContenu) {
          console.log('[MH2] Frame Contenu pas trouvée');
          return;
        }

        if (!frameContenu.document || !frameContenu.document.body) {
          return;
        }

        const urlActuelle = frameContenu.location.href;
        const titreActuel = frameContenu.document.title;

        // Détecter un changement
        if (urlActuelle !== dernierURL || titreActuel !== dernierTitre) {
          console.log('[MH2] ═══════════════════════════════');
          console.log('[MH2] Changement détecté !');
          console.log('[MH2] URL:', urlActuelle);
          console.log('[MH2] Titre:', titreActuel);

          dernierURL = urlActuelle;
          dernierTitre = titreActuel;

          const doc = frameContenu.document;

          // Vérifier si c'est "Ma vue"
          if (titreActuel.includes('Ma vue')) {
            console.log('[MH2] ✓✓✓ "Ma vue" détectée !');
            setTimeout(() => ajouterBouton(frameContenu, 'maVue'), 150);
          }
          // Vérifier si c'est "Gestion des Étapes" ou "Gestion des Récompenses"
          else if (
            titreActuel.includes('Gestion des Étapes') ||
            doc.body?.textContent?.includes('Gestion des Étapes') ||
            titreActuel.includes('Gestion des Récompenses') ||
            doc.body?.textContent?.includes('Gestion des Récompenses')
          ) {
            console.log(
              '[MH2] ✓✓✓ "Gestion des Étapes" ou "Gestion des Récompenses" détectée !'
            );
            setTimeout(
              () => ajouterBouton(frameContenu, 'gestionEtapes'),
              1500
            );
          }
          // Vérifier si c'est la page TurnStart.php
          else if (urlActuelle.includes('TurnStart.php')) {
            console.log('[MH2] ✓✓✓ Page "TurnStart.php" détectée !');
            // Envoyer automatiquement les infos troll
            setTimeout(() => envoyerInfoTrollAuServeur(frameContenu), 150);
          } else {
            console.log(
              '[MH2] Pas sur "Ma vue" ou "Gestion des Étapes" ou "TurnStart.php"'
            );
            retirerBouton(frameContenu);
          }
          console.log('[MH2] ═══════════════════════════════');
        }

        // Vérifier si le bouton doit être présent
        const doc = frameContenu.document;
        if (
          titreActuel.includes('Ma vue') &&
          !doc.getElementById('monBoutonTest')
        ) {
          ajouterBouton(frameContenu, 'maVue');
          // Lire les données JSON de la page
          lireDonneesVue(frameContenu);
        }

        // Vérifier si on est sur Gestion des Étapes ou Gestion des Récompenses
        if (
          (titreActuel.includes('Gestion des Étapes') ||
            doc.body?.textContent?.includes('Gestion des Étapes') ||
            titreActuel.includes('Gestion des Récompenses') ||
            doc.body?.textContent?.includes('Gestion des Récompenses')) &&
          !doc.getElementById('monBoutonGestionEtapes')
        ) {
          ajouterBouton(frameContenu, 'gestionEtapes');
        }

        // Vérifier si on est sur la page TurnStart.php et envoyer automatiquement
        if (urlActuelle.includes('TurnStart.php')) {
          // Vérifier si on a déjà envoyé (pour éviter les envois multiples)
          if (!doc.getElementById('mh2_troll_sent')) {
            // Créer un marqueur pour éviter les envois multiples
            const marker = doc.createElement('div');
            marker.id = 'mh2_troll_sent';
            marker.style.display = 'none';
            doc.body.appendChild(marker);
            // Envoyer automatiquement les infos troll
            setTimeout(() => envoyerInfoTrollAuServeur(frameContenu), 150);
          }
        }
      } catch (e) {
        // Erreur normale au début
      }
    }

    function ajouterBouton(frameContenu, type = 'maVue') {
      try {
        if (!frameContenu.document.body) return;

        // Définir les propriétés selon le type
        const config = {
          maVue: {
            id: 'monBoutonTest',
            texte: 'Bouton test',
            position: { top: '10px', right: '10px' },
            action: () => alert('Bouton cliqué sur Ma vue !'),
          },
          gestionEtapes: {
            id: 'monBoutonGestionEtapes',
            texte: 'Envoyer mission',
            position: { top: '10px', right: '10px' },
            action: () => envoyerMissionAuServeur(frameContenu),
          },
        };

        const cfg = config[type];

        if (frameContenu.document.getElementById(cfg.id)) {
          console.log(`[MH2] Bouton ${type} déjà présent`);
          return;
        }

        console.log(`[MH2] Ajout du bouton ${type}...`);

        const bouton = frameContenu.document.createElement('button');
        bouton.id = cfg.id;
        bouton.textContent = cfg.texte;
        bouton.style.cssText = `
                    position: fixed;
                    top: ${cfg.position.top};
                    right: ${cfg.position.right};
                    z-index: 99999;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                `;

        bouton.addEventListener('mouseenter', function () {
          this.style.backgroundColor = '#45a049';
        });
        bouton.addEventListener('mouseleave', function () {
          this.style.backgroundColor = '#4CAF50';
        });
        bouton.addEventListener('click', cfg.action);

        frameContenu.document.body.appendChild(bouton);
        console.log(`[MH2] ✓✓✓ BOUTON ${type.toUpperCase()} AJOUTÉ ! ✓✓✓`);
      } catch (e) {
        console.log('[MH2] Erreur ajout:', e.message);
      }
    }

    function retirerBouton(frameContenu) {
      try {
        // Retirer tous les boutons possibles
        const boutons = ['monBoutonTest', 'monBoutonGestionEtapes'];
        boutons.forEach((id) => {
          const bouton = frameContenu.document.getElementById(id);
          if (bouton) {
            bouton.remove();
            console.log(`[MH2] Bouton ${id} retiré`);
          }
        });
      } catch (e) {}
    }

    // Surveiller toutes les 500ms
    setInterval(surveiller, 500);
    console.log('[MH2] ✓✓✓ SURVEILLANCE ACTIVE ✓✓✓');
  }

  function intercepterRequetesJSON() {
    console.log("[MH2] Installation de l'intercepteur de requêtes JSON...");

    // Détecter si on est directement dans la frame Contenu ou sur TurnStart.php
    const estDansContenu =
      window.name === 'Contenu' ||
      window.location.href.includes('Play_a_Action') ||
      window.location.href.includes('TurnStart.php');

    // Intercepter immédiatement, avant le chargement
    let frameContenu;
    if (estDansContenu) {
      frameContenu = window;
    } else {
      frameContenu = window.frames['Contenu'] || window.frames[0];
    }

    if (!frameContenu) {
      console.log(
        "[MH2] Frame Contenu pas encore disponible pour l'intercepteur"
      );
      setTimeout(intercepterRequetesJSON, 500);
      return;
    }

    try {
      // Attendre que jQuery soit chargé dans la frame
      const checkJQuery = setInterval(() => {
        if (frameContenu.$ || frameContenu.jQuery) {
          clearInterval(checkJQuery);
          console.log(
            "[MH2] jQuery détecté, installation de l'intercepteur..."
          );

          const $ = frameContenu.$ || frameContenu.jQuery;
          const originalGet = $.get;

          // Intercepter $.get
          $.get = function (url, data, success, dataType) {
            console.log('[MH2] 📡 $.get intercepté:', url);

            // Wrapper pour capturer la réponse
            const wrappedSuccess = function (responseData, textStatus, jqXHR) {
              console.log('[MH2] ✓ Réponse reçue pour:', url);
              console.log('[MH2]   Données:', responseData);

              // Appeler le callback original
              if (success) {
                return success.apply(this, arguments);
              }
            };

            return originalGet.call(this, url, data, wrappedSuccess, dataType);
          };

          console.log('[MH2] ✓ Intercepteur jQuery installé !');
        }
      }, 100);

      // Arrêter après 10 secondes si jQuery n'est pas trouvé
      setTimeout(() => clearInterval(checkJQuery), 10000);
    } catch (e) {
      console.log('[MH2] Erreur installation intercepteur jQuery:', e.message);
    }
  }

  function lireDonneesVue(frameContenu) {
    console.log('[MH2] 📊 Lecture des données depuis le DOM...');

    setTimeout(() => {
      try {
        const doc = frameContenu.document;

        // Lire les monstres depuis le tableau
        const tableMonstres = doc.querySelector('#VUE_monstres tbody');
        if (tableMonstres) {
          const lignesMonstres = tableMonstres.querySelectorAll(
            'tr:not(.footable-empty)'
          );
          console.log(
            `[MH2] ✓ ${lignesMonstres.length} MONSTRES trouvés dans le DOM`
          );

          // Extraire les infos du premier monstre comme exemple
          if (lignesMonstres.length > 0) {
            const premierMonstre = lignesMonstres[0];
            const nom =
              premierMonstre.querySelector('a.monstre')?.textContent || 'N/A';
            const ref =
              premierMonstre.querySelector('.ref')?.textContent || 'N/A';
            const dist =
              premierMonstre.querySelector('.dist')?.textContent || 'N/A';
            console.log(`[MH2]   Exemple: ${nom} (ref: ${ref}, dist: ${dist})`);
          }
        }

        // Lire les trolls
        const tableTrolls = doc.querySelector('#VUE_trolls tbody');
        if (tableTrolls) {
          const lignesTrolls = tableTrolls.querySelectorAll(
            'tr:not(.footable-empty)'
          );
          console.log(
            `[MH2] ✓ ${lignesTrolls.length} TROLLS trouvés dans le DOM`
          );

          if (lignesTrolls.length > 0) {
            const premierTroll = lignesTrolls[0];
            const nom =
              premierTroll.querySelector('a.troll')?.textContent || 'N/A';
            const ref =
              premierTroll.querySelector('.ref')?.textContent || 'N/A';
            console.log(`[MH2]   Exemple: ${nom} (ref: ${ref})`);
          }
        }

        // Lire les trésors
        const tableTresors = doc.querySelector('#VUE_tresors tbody');
        if (tableTresors) {
          const lignesTresors = tableTresors.querySelectorAll(
            'tr:not(.footable-empty)'
          );
          console.log(
            `[MH2] ✓ ${lignesTresors.length} TRÉSORS trouvés dans le DOM`
          );
        }
      } catch (e) {
        console.log('[MH2] Erreur lecture DOM:', e.message);
      }
    }, 3000); // Attendre 3 secondes que tout soit rendu
  }

  function envoyerMissionAuServeur(frameContenu) {
    console.log('[MH2] 🚀 Extraction et envoi de la mission...');

    try {
      const doc = frameContenu.document;

      // 1. Détecter sur quelle page on est
      const titreActuel = doc.title || '';
      const bodyText = doc.body?.textContent || '';
      const isGestionEtapes =
        titreActuel.includes('Gestion des Étapes') ||
        bodyText.includes('Gestion des Étapes');
      const isGestionRecompenses =
        titreActuel.includes('Gestion des Récompenses') ||
        bodyText.includes('Gestion des Récompenses');

      console.log('[MH2] Page détectée:', {
        isGestionEtapes,
        isGestionRecompenses,
        titre: titreActuel,
      });

      // 2. Extraire le numéro de mission
      const h1 = doc.querySelector('h1');
      const h1Text = h1?.textContent || '';
      const missionMatch = h1Text.match(/Mission\s*\[(\d+)\]/);

      if (!missionMatch) {
        alert('❌ Numéro de mission non trouvé');
        console.log('[MH2] H1 trouvé:', h1Text);
        return;
      }

      const missionNumber = missionMatch[1];
      console.log('[MH2] Mission:', missionNumber);

      let stages = '';
      let rewards = '';

      // 3. Extraire les données selon la page
      if (isGestionEtapes) {
        // Extraire les étapes depuis le tableau
        const tableEtapes = doc.querySelector(
          'form[action*="Play_a_ActionResult"] table.mh_tdborder'
        );
        if (!tableEtapes) {
          alert('❌ Tableau des étapes non trouvé');
          console.log(
            '[MH2] Tables trouvées:',
            doc.querySelectorAll('table').length
          );
          return;
        }

        const lignesEtapes = tableEtapes.querySelectorAll('tr.mh_tdpage');

        lignesEtapes.forEach((ligne) => {
          const cellules = ligne.querySelectorAll('td');
          if (cellules.length >= 2) {
            const numEtape = cellules[0].textContent.trim();
            const description = cellules[1].textContent.trim();
            const statut = cellules[2]?.textContent.trim() || '';
            stages += `${numEtape} ${description} ${statut}\n`;
          }
        });

        console.log(
          '[MH2] Étapes extraites:',
          stages.substring(0, 100) + '...'
        );
      } else if (isGestionRecompenses) {
        // Extraire les récompenses
        const allTables = doc.querySelectorAll('table.mh_tdborder');

        // Chercher le tableau des récompenses (peut être le premier ou le seul)
        let tableRecompenses = null;

        // Essayer de trouver un tableau qui contient "Récompense" dans son contenu
        for (let table of allTables) {
          const tableText = table.textContent || '';
          if (tableText.includes('Récompense')) {
            tableRecompenses = table;
            break;
          }
        }

        // Si pas trouvé, prendre le premier tableau disponible
        if (!tableRecompenses && allTables.length > 0) {
          tableRecompenses = allTables[0];
        }

        if (!tableRecompenses) {
          alert('❌ Tableau des récompenses non trouvé');
          console.log(
            '[MH2] Tables trouvées:',
            doc.querySelectorAll('table').length
          );
          return;
        }

        const lignesRecompenses =
          tableRecompenses.querySelectorAll('tr.mh_tdpage');

        lignesRecompenses.forEach((ligne) => {
          const cellules = ligne.querySelectorAll('td');
          if (cellules.length >= 2) {
            const premiereCellule = cellules[0].textContent.trim();
            let description = cellules[1].textContent.trim();

            // Extraire le numéro de la première cellule (peut être "1", "Récompense n°1", etc.)
            let numRecompense = premiereCellule;
            const matchNum =
              premiereCellule.match(/Récompense n°\s*(\d+)/i) ||
              premiereCellule.match(/(\d+)/);
            if (matchNum) {
              numRecompense = matchNum[1];
            }

            // Nettoyer la description : enlever "Récompense n°X" au début si présent
            description = description
              .replace(/^Récompense n°\s*\d+\s*/i, '')
              .trim();

            // Construire la ligne au format attendu
            rewards += `Récompense n°${numRecompense} ${description}\n`;
          }
        });

        console.log(
          '[MH2] Récompenses extraites:',
          rewards ? rewards.substring(0, 100) + '...' : 'aucune'
        );
      } else {
        alert(
          '❌ Page non reconnue. Doit être "Gestion des Étapes" ou "Gestion des Récompenses"'
        );
        return;
      }

      // 4. Préparer les données en format URL-encoded
      const formData = `missionNumber=${encodeURIComponent(missionNumber)}&stages=${encodeURIComponent(stages.trim())}&rewards=${encodeURIComponent(rewards.trim())}`;

      console.log('[MH2] Envoi au serveur...');
      console.log('[MH2] Données envoyées:', {
        missionNumber,
        hasStages: stages.trim() !== '',
        hasRewards: rewards.trim() !== '',
      });

      // 5. Utiliser GM_xmlhttpRequest (compatible Greasemonkey & Tampermonkey)
      let gmXHR = null;
      let gmXHRSource = null;

      // Vérifier GM_xmlhttpRequest (Greasemonkey)
      try {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
          gmXHR = GM_xmlhttpRequest;
          gmXHRSource = 'GM_xmlhttpRequest (Greasemonkey)';
          console.log('[MH2] ✓ API GM détectée:', gmXHRSource);
        }
      } catch (e) {
        console.log('[MH2] Erreur accès GM_xmlhttpRequest:', e.message);
      }

      // Vérifier GM.xmlHttpRequest (Tampermonkey) - avec protection complète
      if (!gmXHR) {
        try {
          if (
            typeof GM !== 'undefined' &&
            GM &&
            typeof GM.xmlHttpRequest !== 'undefined'
          ) {
            gmXHR = GM.xmlHttpRequest;
            gmXHRSource = 'GM.xmlHttpRequest (Tampermonkey)';
            console.log('[MH2] ✓ API GM détectée:', gmXHRSource);
          } else {
            console.log(
              '[MH2] GM non disponible ou GM.xmlHttpRequest non défini'
            );
          }
        } catch (e) {
          console.log('[MH2] Erreur accès GM.xmlHttpRequest:', e.message);
        }
      }

      // Si aucune API GM n'est disponible, utiliser XMLHttpRequest standard
      // (maintenant que les en-têtes CORS sont configurés côté serveur)
      if (!gmXHR) {
        console.warn(
          '[MH2] ⚠ Aucune API GM disponible, utilisation de XMLHttpRequest standard (CORS activé)'
        );
        const xhr = new XMLHttpRequest();
        xhr.open(
          'POST',
          'https://mh.percolouco.com/mission/includes/update/update_mission.php'
        );
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
        xhr.onload = function () {
          if (xhr.status === 200) {
            alert('✅ Mission envoyée avec succès !');
            console.log('[MH2] Réponse:', xhr.responseText);
          } else {
            alert('❌ Erreur serveur: ' + xhr.status);
            console.log('[MH2] Réponse:', xhr.responseText);
          }
        };
        xhr.onerror = function () {
          alert('❌ Erreur réseau');
          console.log('[MH2] Erreur réseau');
        };
        xhr.send(formData);
        return;
      }

      console.log("[MH2] Utilisation de l'API GM:", gmXHRSource);
      gmXHR({
        method: 'POST',
        url: 'https://mh.percolouco.com/mission/includes/update/update_mission.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData,
        onload: function (response) {
          console.log('[MH2] Réponse:', response.status);
          console.log('[MH2] Texte réponse:', response.responseText);
          if (response.status === 200) {
            alert('✅ Mission envoyée avec succès !');
          } else {
            alert('❌ Erreur serveur: ' + response.status);
          }
        },
        onerror: function (error) {
          alert('❌ Erreur réseau');
          console.log('[MH2] Erreur:', error);
        },
        ontimeout: function () {
          alert('❌ Timeout de la requête');
          console.log('[MH2] Timeout');
        },
      });
    } catch (e) {
      alert('❌ Erreur: ' + e.message);
      console.log('[MH2] Erreur:', e.message, e.stack);
    }
  }

  function envoyerInfoTrollAuServeur(frameContenu) {
    console.log('[MH2] 🚀 Extraction et envoi des infos troll...');

    try {
      const doc = frameContenu.document;

      // 1. Récupérer seulement le premier <tr> du <tbody> principal (pas du thead)
      // Il faut trouver le <tbody> qui est un enfant direct d'une table, pas celui dans un sous-tableau
      let tbody = null;

      // Chercher toutes les tables et trouver celle qui a un <tbody> comme enfant direct
      const allTables = doc.querySelectorAll('table');
      for (let table of allTables) {
        // Vérifier si cette table a un <tbody> comme enfant direct
        for (let child of table.children) {
          if (child.tagName === 'TBODY') {
            tbody = child;
            break;
          }
        }
        if (tbody) break;
      }

      // Si pas trouvé, essayer une approche plus simple : chercher le tbody qui n'est pas dans un thead
      if (!tbody) {
        const allTbodies = doc.querySelectorAll('tbody');
        for (let tb of allTbodies) {
          // Vérifier que ce tbody n'est pas dans un thead
          let parent = tb.parentElement;
          let isInThead = false;
          while (parent) {
            if (parent.tagName === 'THEAD') {
              isInThead = true;
              break;
            }
            parent = parent.parentElement;
          }
          if (!isInThead) {
            tbody = tb;
            break;
          }
        }
      }

      if (!tbody) {
        console.log('[MH2] ❌ tbody principal introuvable');
        return;
      }

      // Prendre uniquement le premier enfant direct <tr> du <tbody>
      // (pas un <tr> qui pourrait être dans un sous-élément)
      let firstTr = null;
      for (let i = 0; i < tbody.children.length; i++) {
        if (tbody.children[i].tagName === 'TR') {
          firstTr = tbody.children[i];
          break;
        }
      }

      if (!firstTr) {
        console.log('[MH2] ❌ premier tr du tbody introuvable');
        return;
      }

      // Récupérer le HTML du premier <tr>
      const htmlContent = firstTr.outerHTML;

      if (!htmlContent) {
        console.log('[MH2] ❌ HTML vide');
        return;
      }

      // Récupérer le numéro de troll depuis data-idtroll du <body>
      const body = doc.querySelector('body');
      let trollNumero = null;
      if (body && body.hasAttribute('data-idtroll')) {
        trollNumero = body.getAttribute('data-idtroll');
        console.log('[MH2] Numéro de troll trouvé:', trollNumero);
      } else {
        console.log('[MH2] ❌ data-idtroll introuvable');
        return;
      }

      console.log(
        '[MH2] Premier <tr> récupéré, taille:',
        htmlContent.length,
        'caractères'
      );

      // 2. Préparer les données en format URL-encoded
      const formData = `html_content=${encodeURIComponent(htmlContent)}&troll_numero=${encodeURIComponent(trollNumero)}`;

      console.log('[MH2] Envoi au serveur...');

      // 3. Utiliser GM_xmlhttpRequest (compatible Greasemonkey & Tampermonkey)
      let gmXHR = null;
      let gmXHRSource = null;

      // Vérifier GM_xmlhttpRequest (Greasemonkey)
      try {
        if (typeof GM_xmlhttpRequest !== 'undefined') {
          gmXHR = GM_xmlhttpRequest;
          gmXHRSource = 'GM_xmlhttpRequest (Greasemonkey)';
          console.log('[MH2] ✓ API GM détectée:', gmXHRSource);
        }
      } catch (e) {
        console.log('[MH2] Erreur accès GM_xmlhttpRequest:', e.message);
      }

      // Vérifier GM.xmlHttpRequest (Tampermonkey) - avec protection complète
      if (!gmXHR) {
        try {
          if (
            typeof GM !== 'undefined' &&
            GM &&
            typeof GM.xmlHttpRequest !== 'undefined'
          ) {
            gmXHR = GM.xmlHttpRequest;
            gmXHRSource = 'GM.xmlHttpRequest (Tampermonkey)';
            console.log('[MH2] ✓ API GM détectée:', gmXHRSource);
          } else {
            console.log(
              '[MH2] GM non disponible ou GM.xmlHttpRequest non défini'
            );
          }
        } catch (e) {
          console.log('[MH2] Erreur accès GM.xmlHttpRequest:', e.message);
        }
      }

      // Si aucune API GM n'est disponible, utiliser XMLHttpRequest standard
      // (maintenant que les en-têtes CORS sont configurés côté serveur)
      if (!gmXHR) {
        console.warn(
          '[MH2] ⚠ Aucune API GM disponible, utilisation de XMLHttpRequest standard (CORS activé)'
        );
        const xhr = new XMLHttpRequest();
        xhr.open(
          'POST',
          'https://mh.percolouco.com/tactique/includes/sp_mh/parser_handler.php'
        );
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
        xhr.onload = function () {
          if (xhr.status === 200) {
            console.log('[MH2] ✅ Infos troll envoyées avec succès !');
            console.log('[MH2] Réponse:', xhr.responseText);
          } else {
            console.log('[MH2] ❌ Erreur serveur: ' + xhr.status);
            console.log('[MH2] Réponse:', xhr.responseText);
          }
        };
        xhr.onerror = function () {
          console.log('[MH2] ❌ Erreur réseau');
        };
        xhr.send(formData);
        return;
      }

      console.log("[MH2] Utilisation de l'API GM:", gmXHRSource);
      gmXHR({
        method: 'POST',
        url: 'https://mh.percolouco.com/tactique/includes/sp_mh/parser_handler.php',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: formData,
        onload: function (response) {
          console.log('[MH2] Réponse:', response.status);
          console.log('[MH2] Texte réponse:', response.responseText);
          if (response.status === 200) {
            console.log('[MH2] ✅ Infos troll envoyées avec succès !');
          } else {
            console.log('[MH2] ❌ Erreur serveur: ' + response.status);
          }
        },
        onerror: function (error) {
          console.log('[MH2] ❌ Erreur réseau');
          console.log('[MH2] Erreur:', error);
        },
        ontimeout: function () {
          console.log('[MH2] ❌ Timeout de la requête');
        },
      });
    } catch (e) {
      console.log('[MH2] ❌ Erreur: ' + e.message);
      console.log('[MH2] Erreur:', e.message, e.stack);
    }
  }
})();

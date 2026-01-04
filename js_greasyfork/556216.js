// ==UserScript==
// @name         Click&Fit
// @namespace    https://precilens.com/
// @version      5.1.1
// @description  Module Click&Fit avec upload topographies et autres fonctionnalités
// @author       Precilens
// @match        https://click-fit.precilens.com/*
// @icon         https://www.precilens.fr/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @license      MIT
// DEV MODE: Auto-update désactivé temporairement
// @downloadURL https://update.greasyfork.org/scripts/556216/ClickFit.user.js
// @updateURL https://update.greasyfork.org/scripts/556216/ClickFit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Utilitaires pour les délais
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const delay = (fn, ms) => setTimeout(fn, ms);

  // Constantes pour les délais courants
  const DELAYS = {
    SHORT: 100,
    MEDIUM: 500,
    LONG: 1000,
    TOAST: 3000,
    RETRY: 2000
  };

  // Système de gestion des observers
  // Optimise la performance en nettoyant automatiquement
  // les observers et intervals quand nécessaire
  const ObserverManager = {
    observers: new Map(),
    intervals: new Map(),
    currentPage: '',

    // Créer et tracker un MutationObserver
    createObserver(name, callback, target, options, persistent = false) {
      // Nettoyer l'ancien observer s'il existe
      if (this.observers.has(name)) {
        this.observers.get(name).observer.disconnect();
      }

      const observer = new MutationObserver(callback);
      observer.observe(target, options);

      this.observers.set(name, {
        observer,
        persistent, // Si true, ne sera pas nettoyé lors du changement de page
        target,
        options
      });

      return observer;
    },

    // Créer et tracker un setInterval
    createInterval(name, callback, delay, persistent = false) {
      // Nettoyer l'ancien interval s'il existe
      if (this.intervals.has(name)) {
        clearInterval(this.intervals.get(name).id);
      }

      const id = setInterval(callback, delay);

      this.intervals.set(name, {
        id,
        persistent,
        callback,
        delay
      });

      return id;
    },

    // Nettoyer les observers non-persistants
    cleanupObservers() {
      let cleaned = 0;
      this.observers.forEach((data, name) => {
        if (!data.persistent) {
          data.observer.disconnect();
          this.observers.delete(name);
          cleaned++;
        }
      });
      return cleaned;
    },

    // Nettoyer les intervals non-persistants
    cleanupIntervals() {
      let cleaned = 0;
      this.intervals.forEach((data, name) => {
        if (!data.persistent) {
          clearInterval(data.id);
          this.intervals.delete(name);
          cleaned++;
        }
      });
      return cleaned;
    },

    // Nettoyer tout lors du changement de page
    cleanupOnPageChange() {
      this.cleanupObservers();
      this.cleanupIntervals();
    },

    // Nettoyer un observer spécifique
    disconnect(name) {
      if (this.observers.has(name)) {
        this.observers.get(name).observer.disconnect();
        this.observers.delete(name);
      }
    },

    // Nettoyer un interval spécifique
    clearInterval(name) {
      if (this.intervals.has(name)) {
        clearInterval(this.intervals.get(name).id);
        this.intervals.delete(name);
      }
    },

    // Stats de performance (debug)
    getStats() {
      return {
        observers: this.observers.size,
        intervals: this.intervals.size,
        persistent: {
          observers: Array.from(this.observers.values()).filter(d => d.persistent).length,
          intervals: Array.from(this.intervals.values()).filter(d => d.persistent).length
        }
      };
    }
  };

  // Détection automatique du changement de page pour cleanup
  let lastUrl = window.location.href;
  ObserverManager.createInterval('urlWatcher', () => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      ObserverManager.cleanupOnPageChange();
    }
  }, 1000, true); // persistent: surveille toujours les changements d'URL

  // Double clique sur la consultation
  document.addEventListener('dblclick', function(e) {
    let el = e.target;
    while (el && el !== document && (!el.id || !el.id.startsWith('file-'))) {
      el = el.parentElement;
    }
    if (el && el.id && el.id.startsWith('file-')) {
          const openBtn = document.querySelector(
            '#wrapper > main > app-home > div > div:nth-child(3) > app-file-preview > div > div > amds-button.file-open-btn.hydrated > button'
          );
          if (openBtn) {
            openBtn.click();
          }
        }
      });

  // Style CSS du fichier
  function injectStyles() {
    const styleId = 'click-fit-custom-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .modal textarea#input-content {
        min-height: 150px !important;
      }

      /* Agrandir la zone d'édition des notes existantes */
      textarea#input-editContent {
        min-height: 200px !important;
        max-height: 500px !important;
        resize: vertical !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        padding: 12px !important;
        border: 2px solid #e0e0e0 !important;
        border-radius: 8px !important;
        transition: border-color 0.3s ease, height 0.2s ease !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }

      textarea#input-editContent:focus {
        border-color: #2196f3 !important;
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1) !important;
      }

      /* Centrage du modal  */
      .modal.modal--size-medium {
        position: fixed !important;
        margin: 0 !important;
        z-index: 1050 !important;
        transform: none !important;
      }

      /* Bouton flottant + Menu */
      .clickfit-fab {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #1e4b92 0%, #245aa8 100%);
        border-radius: 50%;
        box-shadow: 0 4px 15px rgba(30, 75, 146, 0.35);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .clickfit-fab:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(30, 75, 146, 0.55);
      }

      .clickfit-fab.active {
        transform: rotate(45deg);
        background: linear-gradient(135deg, #1a3d7c 0%, #1e4b92 100%);
      }

      .clickfit-fab-icon {
        color: white;
        font-size: 28px;
        font-weight: bold;
        transition: transform 0.3s ease;
      }

      .clickfit-fab-menu {
        position: fixed;
        bottom: 90px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .clickfit-fab-menu.active {
        opacity: 1;
        visibility: visible;
      }

      .clickfit-fab-option {
        background: white;
        border-radius: 30px;
        padding: 12px 20px;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        white-space: nowrap;
        transform: translateX(20px);
        opacity: 0;
        transition: all 0.3s ease;
      }

      .clickfit-fab-menu.active .clickfit-fab-option {
        transform: translateX(0);
        opacity: 1;
      }

      .clickfit-fab-menu.active .clickfit-fab-option:nth-child(1) {
        transition-delay: 0.1s;
      }

      .clickfit-fab-menu.active .clickfit-fab-option:nth-child(2) {
        transition-delay: 0.15s;
      }

      .clickfit-fab-menu.active .clickfit-fab-option:nth-child(3) {
        transition-delay: 0.2s;
      }

      .clickfit-fab-menu.active .clickfit-fab-option:nth-child(4) {
        transition-delay: 0.25s;
      }

      .clickfit-fab-menu.active .clickfit-fab-option:nth-child(5) {
        transition-delay: 0.3s;
      }

      .clickfit-fab-menu.active .clickfit-fab-option:nth-child(6) {
        transition-delay: 0.35s;
      }

      .clickfit-fab-option:hover {
        transform: translateX(-5px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      }

      .clickfit-fab-option-icon {
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
      }

      .clickfit-fab-option-text {
        color: #333;
        font-size: 14px;
        font-weight: 500;
        font-family: "Fira Sans", -apple-system, BlinkMacSystemFont;
      }

      /* notifications */
      .clickfit-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
      }

      .clickfit-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      /* INDICATEUR TOPOGRAPHIES */
      .topo-indicator {
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #17a2b8;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
        z-index: 9998;
      }

      .topo-indicator:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(23, 162, 184, 0.5);
      }

      .topo-indicator.has-files {
        background: #28a745;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% { box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4); }
        50% { box-shadow: 0 4px 25px rgba(40, 167, 69, 0.6); }
        100% { box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4); }
      }

      .topo-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #dc3545;
        color: white;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }

      .topo-indicator.has-files .topo-badge {
        display: flex;
      }

      /* Boite de dialog topos */
      .topo-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 15px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        min-width: 500px;
        max-width: 90vw;
        max-height: 80vh;
        overflow: hidden;
        display: none;
      }

      .topo-dialog.show {
        display: block;
        animation: dialogSlideIn 0.3s ease;
      }

      @keyframes dialogSlideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -45%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }

      .topo-dialog-header {
        background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .topo-dialog-header h3 {
        margin: 0;
        font-size: 20px;
      }

      .topo-dialog-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s;
      }

      .topo-dialog-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .topo-dialog-body {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .topo-file-list {
        margin: 15px 0;
      }

      .topo-file-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 15px;
        margin: 8px 0;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #dee2e6;
        transition: all 0.3s;
      }

      .topo-file-item:hover {
        background: #e9ecef;
        border-color: #17a2b8;
      }

      .topo-file-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .topo-file-icon {
        font-size: 24px;
      }

      .topo-file-details {
        display: flex;
        flex-direction: column;
      }

      .topo-file-name {
        font-weight: 600;
        color: #333;
      }

      .topo-file-meta {
        font-size: 12px;
        color: #6c757d;
      }

      .topo-file-status {
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 500;
      }

      .topo-file-status.pending {
        background: #fff3cd;
        color: #856404;
      }

      .topo-file-status.processing {
        background: #cce5ff;
        color: #004085;
      }

      .topo-file-status.success {
        background: #d4edda;
        color: #155724;
      }

      .topo-file-status.error {
        background: #f8d7da;
        color: #721c24;
      }

      .topo-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #dee2e6;
      }

      .topo-actions-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .topo-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
      }

      .topo-btn-primary {
        background: #17a2b8;
        color: white;
      }

      .topo-btn-primary:hover {
        background: #138496;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
      }

      .topo-btn-secondary {
        background: #6c757d;
        color: white;
      }

      .topo-btn-secondary:hover {
        background: #5a6268;
      }

      .topo-connection-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #6c757d;
      }

      .topo-connection-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #dc3545;
      }

      .topo-connection-dot.connected {
        background: #28a745;
      }

      /* Modal medium: resize and overflow */
      .modal.modal--size-medium {
        resize: both !important;
        overflow: auto !important;
        min-width: 400px;
        min-height: 200px;
        max-width: 95vw !important;
        max-height: 90vh !important;
      }

      /* Indicateur d'œil détecté */
.topo-file-item[data-eye="od"] {
  border-left: 4px solid #17a2b8;
}

.topo-file-item[data-eye="og"] {
  border-left: 4px solid #28a745;
}

.topo-file-item[data-eye="both"] {
  border-left: 4px solid #ffc107;
}

.eye-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
}

.eye-badge.od {
  background: #e3f2fd;
  color: #1976d2;
}

.eye-badge.og {
  background: #e8f5e9;
  color: #388e3c;
}

.eye-badge.both {
  background: #fff3e0;
  color: #f57c00;
}
    `;
    document.head.appendChild(style);
  }
  // État de l'auto-save
  let autoSaveEnabled = true;

  // Afficher une notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'clickfit-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

// Fonction pour rendre le Header fixe, et avoir accès au boutons en permanence
function makeHeaderPermanentlyFixed() {
  // Injecter le CSS pour le header fixe
  const style = document.createElement('style');
  style.id = 'permanent-sticky-header';
  style.textContent = `
    /* Header toujours fixe */
    header[_ngcontent-jib-c63],
    header {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 1000 !important;
      background: white !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    /* Compenser la hauteur du header pour le contenu principal */
    #wrapper > main,
    main {
      margin-top: 70px !important; /* Ajustez selon la hauteur réelle de votre header */
    }

    /* S'assurer que le header reste au-dessus */
    .header__nav,
    .header__team-selector,
    .header__actions {
      position: relative;
      z-index: 1001;
    }
  `;

  // Ajouter le style au document
  if (!document.getElementById('permanent-sticky-header')) {
    document.head.appendChild(style);
  }

  // Calculer et ajuster dynamiquement la hauteur si nécessaire
  setTimeout(() => {
    const header = document.querySelector('header');
    if (header) {
      const headerHeight = header.offsetHeight;
      const main = document.querySelector('main') || document.querySelector('#wrapper > main');

      if (main) {
        main.style.marginTop = `${headerHeight}px`;
      }
    }
  }, 100);
}
// Lancer immédiatement
makeHeaderPermanentlyFixed();

// Lancer aussi immédiatement les boutons de calcul
setTimeout(() => {
  addCalculationButtonsToHeader();
}, 2000);

// Système de retry périodique pour les boutons de calcul
ObserverManager.createInterval('calcButtonsRetry', () => {
  if (window.location.href.includes('/file/') && !document.querySelector('.calc-buttons-container')) {
    addCalculationButtonsToHeader();
  }
}, 5000, true);

// Détecter les changements d'URL pour les SPA
let currentUrl = window.location.href;
ObserverManager.createInterval('urlChangeDetector', () => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;

    // Attendre un peu que la page se charge puis essayer d'ajouter les boutons
    setTimeout(() => {
      if (currentUrl.includes('/file/')) {
        addCalculationButtonsToHeader();
      }
    }, 1000);
  }
}, 1000, true);

//  Boutons de calcul Ortho K et LRPG
function addCalculationButtonsToHeader() {
  // Vérifier qu'on est sur une page de dossier pour les boutons de calcul
  const isFilePage = window.location.href.includes('/file/');
  if (!isFilePage) {
  }

  // Debug: Lister tous les éléments du header
  const allElements = document.querySelectorAll('header *, .header *');
  allElements.forEach((el, index) => {
    if (index < 20) { // Limiter à 20 éléments pour éviter le spam
    }
  });

  // Styles pour les boutons
  const style = document.createElement('style');
  style.id = 'calc-buttons-styles';
  style.textContent = `
    .calc-buttons-container {
      display: flex;
      gap: 10px;
      margin-left: 20px;
      padding-left: 20px;
      border-left: 2px solid #e0e0e0;
    }

    .calc-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #1e4b92 0%, #245aa8 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', sans-serif;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(30, 75, 146, 0.2);
    }

    .calc-button:hover {
      background: #163a73;
      transform: translateY(-1px);
    }

    .calc-button:active {
      transform: translateY(0);
    }

    .calc-button.processing {
      opacity: 0.7;
      pointer-events: none;
    }
  `;

  if (!document.getElementById('calc-buttons-styles')) {
    document.head.appendChild(style);
  }

  // Fonction simple et directe pour sauvegarder
  async function quickSave() {
    // Forcer le blur sur l'élément actif pour valider
    if (document.activeElement) {
      document.activeElement.blur();
    }

    // Cliquer sur TOUS les boutons Enregistrer trouvés (visibles ou non)
    const buttons = document.querySelectorAll('button');
    let clickCount = 0;

    for (const btn of buttons) {
      if (btn.textContent?.includes('Enregistrer') && !btn.disabled) {
        btn.click();
        clickCount++;
      }
    }

    if (clickCount > 0) {
    }

    // Attendre juste un peu pour la sauvegarde
    await wait(500);
  }

  // Fonction LRPG simplifiée
  async function performLRPGCalculation(button) {
    button.classList.add('processing');
    button.textContent = '⏳ Calcul...';

    try {
      // Sauvegarde rapide
      await quickSave();

      // Aller sur l'onglet lentille
      const lensTab = document.querySelector('[class*="lens-0-tab"]');
      if (lensTab) {
        lensTab.click();
        await wait(500);
      }

      // Sélectionner LRPG pour les deux yeux
      const rightType = document.querySelector('#input-righttype');
      const leftType = document.querySelector('#input-lefttype');

      if (rightType) {
        rightType.value = 'lens:type:rigid';
        rightType.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (leftType) {
        leftType.value = 'lens:type:rigid';
        leftType.dispatchEvent(new Event('change', { bubbles: true }));
      }

      showToast('LRPG sélectionné !');

    } catch (error) {
      showToast('Erreur');
    }

    button.classList.remove('processing');
    button.innerHTML = 'LRPG';
  }

  // Toast simple
  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(135deg, #1e4b92 0%, #245aa8 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    delay(() => toast.remove(), 2000);
  }

  // Créer les boutons
  function createButtons() {
    if (document.querySelector('.calc-buttons-container')) return;
    if (!isFilePage) return; // Ne créer les boutons de calcul que sur les pages de dossier

    // Essayer plusieurs sélecteurs pour trouver le header
    const headerSelectors = [
      '.header__actions',
      'header .actions',
      'header .header-actions',
      '.header-actions',
      'header',
      '.header',
      '[role="banner"]'
    ];

    let headerActions = null;
    for (const selector of headerSelectors) {
      headerActions = document.querySelector(selector);
      if (headerActions) {
        break;
      }
    }

    if (!headerActions) {
      setTimeout(createButtons, 1000);
      return;
    }

    const container = document.createElement('div');
    container.className = 'calc-buttons-container';

    // Bouton LRPG
    const lrpgBtn = document.createElement('button');
    lrpgBtn.className = 'calc-button';
    lrpgBtn.innerHTML = 'LRPG';
    lrpgBtn.onclick = () => performLRPGCalculation(lrpgBtn);

    // Bouton Ortho-K
    const orthoKBtn = document.createElement('button');
    orthoKBtn.className = 'calc-button';
    orthoKBtn.innerHTML = 'Ortho-K';
    orthoKBtn.onclick = () => performOrthoKCalculation();

    container.appendChild(lrpgBtn);
    container.appendChild(orthoKBtn);
    headerActions.insertBefore(container, headerActions.firstChild);

  }

  // Créer le bouton SplitView dans la navigation
  function createSplitViewButton() {
    if (document.querySelector('.splitview-button')) return;

    // Chercher la navigation
    const nav = document.querySelector('nav ul');
    if (!nav) {
      setTimeout(createSplitViewButton, 1000);
      return;
    }

    // Créer le bouton SplitView
    const splitViewLi = document.createElement('li');
    splitViewLi.className = 'ng-star-inserted';

    // Reproduire exactement la structure du bouton Accueil
    const amdsButton = document.createElement('amds-button');
    amdsButton.setAttribute('size', 'small');
    amdsButton.setAttribute('shape', 'ghost');
    amdsButton.setAttribute('color', 'primary-500');
    amdsButton.setAttribute('elevation', 'elevation0');
    amdsButton.setAttribute('type', 'button');
    amdsButton.className = 'hydrated splitview-button';

    const button = document.createElement('button');
    button.className = 'amds-button amds-button-size-small amds-button-shape-ghost amds-elevation0 amds-color-primary-500';
    button.type = 'button';

    // Icône avec la même structure que Accueil
    const icon = document.createElement('amds-icon');
    icon.setAttribute('size', '24');
    icon.setAttribute('color', 'primary-500');
    icon.className = 'hydrated';
    icon.innerHTML = '<i class="ri-sidebar-unfold-fill amds-icon amds-icon-size-24 amds-color-primary-500"></i>';

    // Texte avec la même structure que Accueil
    const text = document.createElement('amds-text');
    text.setAttribute('font', 'button-large');
    text.setAttribute('color', 'primary-500');
    text.className = 'hydrated';
    text.innerHTML = '<div class="amds-text amds-font-button-large amds-color-primary-500"> SplitView </div>';

    button.appendChild(icon);
    button.appendChild(text);
    amdsButton.appendChild(button);
    splitViewLi.appendChild(amdsButton);

    // Insérer après le bouton Accueil
    nav.appendChild(splitViewLi);

    // Event listener sur le bouton interne ET sur le composant amds-button
    function handleSplitViewClick(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Vérifier si la fonction existe

      // Appeler la fonction SplitView existante
      if (typeof activateSplitView === 'function') {
        try {
          activateSplitView();
        } catch (error) {
          console.error('Erreur lors de l\'activation SplitView:', error);
        }
      } else {

        // Chercher la fonction dans window
        if (typeof window.activateSplitView === 'function') {
          window.activateSplitView();
        } else {
          // Toast de fallback
          const toast = document.createElement('div');
          toast.textContent = 'SplitView non disponible';
          toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          `;
          document.body.appendChild(toast);
          delay(() => toast.remove(), DELAYS.TOAST);
        }
      }
    }

    // Ajouter l'event listener sur le bouton interne
    button.addEventListener('click', handleSplitViewClick, true);

    // Ajouter aussi l'event listener sur le composant amds-button au cas où
    amdsButton.addEventListener('click', handleSplitViewClick, true);

    // Ajouter l'event listener sur l'élément li aussi
    splitViewLi.addEventListener('click', handleSplitViewClick, true);

  }

  // Démarrage
  createButtons();
  createSplitViewButton();

  // Observer pour recréer si nécessaire
  ObserverManager.createObserver(
    'calcButtonsRecreate',
    () => {
      if (!document.querySelector('.calc-buttons-container') && window.location.href.includes('/file/')) {
        createButtons();
      }
      if (!document.querySelector('.splitview-button')) {
        createSplitViewButton();
      }
    },
    document.body,
    { childList: true, subtree: true },
    true // persistent: toujours actif
  );
}

// Animation CSS
const styleAnimation = document.createElement('style');
styleAnimation.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(styleAnimation);

// Auto-démarrage
delay(addCalculationButtonsToHeader, DELAYS.LONG);

  // --- Gestion de navigation SPA: supprimer/ajouter les boutons selon l'URL ---
  function removeCalculationButtonsFromHeader() {
    const container = document.querySelector('.calc-buttons-container');
    if (container) container.remove();
    const styleEl = document.getElementById('calc-buttons-styles');
    if (styleEl) styleEl.remove();
  }

  function syncHeaderButtonsWithRoute() {
    const onFile = window.location.href.includes('/file/');
    const hasButtons = !!document.querySelector('.calc-buttons-container');
    if (onFile && !hasButtons) {
      addCalculationButtonsToHeader();
    } else if (!onFile && hasButtons) {
      removeCalculationButtonsFromHeader();
    }
  }

  // Hooker les changements d'historique (SPA)
  if (!window.__cfRouteHooked) {
    window.__cfRouteHooked = true;
    const _pushState = history.pushState;
    history.pushState = function() {
      const r = _pushState.apply(this, arguments);
      setTimeout(syncHeaderButtonsWithRoute, 0);
      return r;
    };
    const _replaceState = history.replaceState;
    history.replaceState = function() {
      const r = _replaceState.apply(this, arguments);
      setTimeout(syncHeaderButtonsWithRoute, 0);
      return r;
    };
    window.addEventListener('popstate', syncHeaderButtonsWithRoute);
    window.addEventListener('hashchange', syncHeaderButtonsWithRoute);
  }

  // File d'attente périodique au cas où (sécurité)
  ObserverManager.createInterval('syncHeaderButtons', syncHeaderButtonsWithRoute, 1500, true);

  // Passage de l'astigmatisme en rouge si > 1,00 Dioptrie
   function recolorAstigmatisme() {
  // Chercher tous les éléments contenant "Astigmatisme interne"
  const allElements = document.querySelectorAll('amds-text div, .amds-text div');

  allElements.forEach(el => {
    const txt = el.textContent.trim();

    // Vérifier que c'est bien l'astigmatisme interne
    if (!/Astigmatisme interne/i.test(txt)) return;

    // Accepte différents formats : "1.25", "1,25", "+1.25", "-1.25", "1.25 /", etc.
    const patterns = [
      /Astigmatisme interne\s*[:：]?\s*([-+−]?\d+[.,]\d+)/i,
      /Astigmatisme interne\s*[:：]?\s*([-+−]?\d+)/i,
      /([-+−]?\d+[.,]\d+)\s*(?:D|dioptries)?/i
    ];

    let value = null;
    for (let pattern of patterns) {
      const match = txt.match(pattern);
      if (match) {
        value = parseFloat(match[1].replace(',', '.').replace('−', '-'));
        break;
      }
    }

    if (value !== null && Math.abs(value) > 1.00) {
      el.style.color = 'red';
      el.style.fontWeight = 'bold';
    } else {
      el.style.color = '';
      el.style.fontWeight = '';
    }
  });
}

// Observer avec debounce
let debounceTimer;
ObserverManager.createObserver(
  'astigmatismeRecolor',
  () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      recolorAstigmatisme();
    }, 100);
  },
  document.body,
  {
    childList: true,
    subtree: true,
    characterData: true
  },
  true // persistent: toujours actif
);

// Exécution
recolorAstigmatisme();
ObserverManager.createInterval('astigmatismeInterval', recolorAstigmatisme, 2000, true);

  // Bouton flottant - Import Topographie direct
  function createFloatingButton() {
    if (document.querySelector('.clickfit-fab')) return;

    const fab = document.createElement('div');
    fab.className = 'clickfit-fab';
    fab.innerHTML = '<span class="clickfit-fab-icon">📁</span>';
    fab.title = 'Import Topographies';

    document.body.appendChild(fab);

    // Clic direct sur le bouton flottant = Import Topographies
    fab.addEventListener('click', async () => {

      // Protection contre les doublons
      if (window.DesktopImportModule && window.DesktopImportModule.isModalOpen) {
        return;
      }

      // Attendre que le module soit initialisé
      let attempts = 0;
      while (!window.DesktopImportModule && attempts < 10) {
        await wait(500);
        attempts++;
      }

          if (window.DesktopImportModule) {
        try {
          await window.DesktopImportModule.showDesktopImportModal();
        } catch (error) {
          console.error('Erreur ouverture modal:', error);
          // Toast d'erreur
          const toast = document.createElement('div');
          toast.textContent = 'Erreur ouverture modal d\'import';
          toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          `;
          document.body.appendChild(toast);
          delay(() => toast.remove(), DELAYS.TOAST);
        }
      } else {
        // Toast de fallback
        const toast = document.createElement('div');
        toast.textContent = 'Module d\'import non chargé - Rechargez la page';
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #dc3545;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          z-index: 10000;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(toast);
        delay(() => toast.remove(), 5000);
      }
    });
  }

  (function setupAutoConsultationClick() {
    function waitAndClick(selector, maxWait = 4000) {
      return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
          const el = document.querySelector(selector);
          if (el) {
            el.click();
            clearInterval(interval);
            resolve(true);
          } else if (Date.now() - start > maxWait) {
            clearInterval(interval);
            reject(`Timeout: ${selector} non trouvé`);
          }
        }, 100);
      });
    }

    document.body.addEventListener('click', function(e) {
      const tr = e.target.closest('#wearer-list-table tr.selectable');
      if (!tr) return;

      // Éviter double-trigger
      if (tr.dataset.autoConsulting) return;
      tr.dataset.autoConsulting = "1";

      // Attendre Angular
      setTimeout(async () => {
        // Vérifier sélection
        if (!tr.classList.contains('selected')) {
          delete tr.dataset.autoConsulting;
          return;
        }

        try {
          await waitAndClick(
            '#wrapper > main > app-home > div > div:nth-child(2) > app-files-list > div.files.hide-scrollbars.ng-star-inserted > app-file-card:nth-child(1)'
          );
          // showToast('Consultation ouverte !');
        } catch (err) {
        } finally {
          // Reset
          delete tr.dataset.autoConsulting;
        }
      }, 400);
    }, true);

  })();

  // Module Import Topographies
  const DesktopImportModule = {
      apiUrl: 'http://localhost:8765/api',
      currentGroups: [],

      init() {
      },

        // Parser SaveIndex pour TMS5
        async parseSaveIndexFile(filePath) {
            try {

                const response = await fetch(`${this.apiUrl}/file/${filePath}`);
                if (!response.ok) {
                    console.error(`SaveIndex non trouvé: ${filePath}`);
                    return null;
                }

                const text = await response.text();
                const lines = text.split('\n');

                const eyes = {};
                const infos = {};

                // Parser les lignes de données (skip header - lignes 0, 1, 2)
                for (let i = 3; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const columns = line.split(',');

                    if (columns.length < 10) continue;

                    const eye = columns[3].trim(); // Eye column
                    const lastName = columns[1] || '';
                    const firstName = columns[2] || '';
                    const date = columns[4] || '';

                    if (eye === 'OD' || eye === 'OS') {
                        // Stocker les informations patient
                        infos[eye] = {
                            lastName: lastName,
                            firstName: firstName,
                            date: date,
                            fullName: `${lastName} ${firstName}`.trim()
                        };

                        // Parser les valeurs kératométriques (format TMS5)
                        try {
                            // Ks (colonne 10) - en dioptries
                            if (columns.length > 10 && columns[10] && columns[10].trim()) {
                                infos[eye].ks = parseFloat(columns[10]);
                            }

                            // Ks Axis (colonne 11)
                            if (columns.length > 11 && columns[11] && columns[11].trim()) {
                                infos[eye].ksAxis = parseFloat(columns[11]);
                            }

                            // Kf (colonne 12) - en dioptries
                            if (columns.length > 12 && columns[12] && columns[12].trim()) {
                                infos[eye].kf = parseFloat(columns[12]);
                            }

                            // Kf Axis (colonne 13)
                            if (columns.length > 13 && columns[13] && columns[13].trim()) {
                                infos[eye].kfAxis = parseFloat(columns[13]);
                            }

                            // CYL (colonne 17) - en dioptries
                            if (columns.length > 17 && columns[17] && columns[17].trim()) {
                                infos[eye].cyl = parseFloat(columns[17]);
                            }

                            // Es (colonne 18)
                            if (columns.length > 18 && columns[18] && columns[18].trim()) {
                                infos[eye].es = parseFloat(columns[18]);
                            }

                            // Em (colonne 19)
                            if (columns.length > 19 && columns[19] && columns[19].trim()) {
                                infos[eye].em = parseFloat(columns[19]);
                            }

                        } catch (e) {
                        }
                    }
                }

                return { eyes, infos };

            } catch (error) {
                console.error(`Erreur parsing SaveIndex:`, error);
                return null;
            }
        },

        // Parser XREF pour TMS-4
        async parseXrefFile(filePath) {
          try {

              const response = await fetch(`${this.apiUrl}/file/${filePath}`);
              if (!response.ok) {
                  console.error(`XREF non trouvé: ${filePath}`);
                  return null;
              }

              const text = await response.text();
              const lines = text.split('\n');

              const eyes = {};
              const infos = {};

              // Parser chaque ligne (skip header - ligne 0 et 1)
              for (let i = 2; i < lines.length; i++) {
                  const line = lines[i].trim();
                  if (!line) continue;

                  const columns = line.split(',');

                  if (columns.length < 8) continue;

                  const eye = columns[6].trim();
                  const filename = columns[7].trim();

                  // Extraire l'ID du fichier
                  let fileId;
                  if (filename.includes('\\')) {
                      fileId = filename.split('\\').pop().replace(/\.TMS$/i, '').replace(/\.tms$/i, '');
                  } else {
                      fileId = filename.replace(/\.TMS$/i, '').replace(/\.tms$/i, '');
                  }

                  if (eye === 'OD' || eye === 'OS') {
                      eyes[eye] = fileId;

                      // Stocker les informations patient (basé sur le format réel du XREF)
                      infos[eye] = {
                          lastName: columns[1] || '',
                          firstName: columns[2] || '',
                          date: columns[5] || '',
                          fullName: `${columns[1] || ''} ${columns[2] || ''}`.trim()
                      };

                      // Parser les valeurs SimK si disponibles (format réel du XREF)
                      try {
                          // SimK1 (colonne 8) - en mm, convertir en dioptries
                          if (columns.length > 8 && columns[8] && columns[8].trim()) {
                              const simk1Val = parseFloat(columns[8]);
                              if (simk1Val > 0) {
                                  infos[eye].simk1 = Math.round(337.5 / simk1Val * 100) / 100;
                              }
                          }

                          // SimK1 Angle (colonne 9)
                          if (columns.length > 9 && columns[9] && columns[9].trim()) {
                              infos[eye].simk1Angle = parseFloat(columns[9]);
                          }

                          // SimK2 (colonne 10) - en mm, convertir en dioptries
                          if (columns.length > 10 && columns[10] && columns[10].trim()) {
                              const simk2Val = parseFloat(columns[10]);
                              if (simk2Val > 0) {
                                  infos[eye].simk2 = Math.round(337.5 / simk2Val * 100) / 100;
                              }
                          }

                          // SimK2 Angle (colonne 11)
                          if (columns.length > 11 && columns[11] && columns[11].trim()) {
                              infos[eye].simk2Angle = parseFloat(columns[11]);
                          }

                          // MinK (colonne 12) - en mm, convertir en dioptries
                          if (columns.length > 12 && columns[12] && columns[12].trim()) {
                              const minkVal = parseFloat(columns[12]);
                              if (minkVal > 0) {
                                  infos[eye].mink = Math.round(337.5 / minkVal * 100) / 100;
                              }
                          }

                          // CYL (colonne 14) - déjà en dioptries
                          if (columns.length > 14 && columns[14] && columns[14].trim()) {
                              infos[eye].cyl = parseFloat(columns[14]);
                          }

                          // Excentricités (colonnes 40 et 41)
                          if (columns.length > 40 && columns[40] && columns[40].trim()) {
                              infos[eye].es = parseFloat(columns[40]);
                          }

                          if (columns.length > 41 && columns[41] && columns[41].trim()) {
                              infos[eye].em = parseFloat(columns[41]);
                          }

                      } catch (e) {
                      }
                  }
              }

              return { eyes, infos };

          } catch (error) {
              console.error(`Erreur parsing XREF:`, error);
              return null;
          }
      },

      // Parsing du nom du fichier Pentacam pour extraire les informations patient
      parsePentacamFilename(filePath) {
          try {

              const filename = filePath.split('/').pop().split('\\').pop();

              // Format attendu: Nom_Prenom_OD/OS_Date_Heure.extension
              // Exemple: Adam_Constantin_OD_28012020_084018.CUR
              const pentacamPattern = /^(.+)_(.+)_(OD|OS)_(\d{8})_(\d{6})\.(cur|ele)$/i;
              const match = filename.match(pentacamPattern);

              if (!match) {
                  return null;
              }

              const [, lastName, firstName, eye, dateStr, timeStr] = match;

              // Convertir la date (format DDMMYYYY)
              const day = dateStr.substring(0, 2);
              const month = dateStr.substring(2, 4);
              const year = dateStr.substring(4, 8);
              const date = `${day}/${month}/${year}`;

              // Convertir l'heure (format HHMMSS)
              const hours = timeStr.substring(0, 2);
              const minutes = timeStr.substring(2, 4);
              const seconds = timeStr.substring(4, 6);
              const time = `${hours}:${minutes}:${seconds}`;

              const fullName = `${lastName} ${firstName}`;
              const fullDateTime = `${date} ${time}`;

              const result = {
                  eyes: {
                      [eye.toLowerCase()]: {
                          lastName: lastName,
                          firstName: firstName,
                          date: fullDateTime,
                          fullName: fullName,
                          eye: eye,
                          filename: filename
                      }
                  },
                  infos: {
                      [eye.toLowerCase()]: {
                          lastName: lastName,
                          firstName: firstName,
                          date: fullDateTime,
                          fullName: fullName,
                          eye: eye,
                          filename: filename
                      }
                  }
              };

              return result;

          } catch (error) {
              console.error(`Erreur parsing Pentacam:`, error);
              return null;
          }
      },

      injectModalStyles() {

            const oldStyle = document.getElementById('desktop-import-styles');
            if (oldStyle) {
                oldStyle.remove();
            }

          const style = document.createElement('style');
          style.id = 'desktop-import-styles';
          style.textContent = `
                /* Overlay simple */
              .dim-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100vw;
                  height: 100vh;
                  background: rgba(0, 0, 0, 0.5);
                    z-index: 9999999;
              }

              .dim-modal {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    z-index: 10000000;
                  min-width: 800px;
                  max-width: 90vw;
                  max-height: 85vh;
                  overflow: hidden;
                    font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              }

              .dim-header {
                    background: #1e4b92;
                  color: white;
                    padding: 16px 20px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                    font-weight: 500;
                }

                .dim-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 500;
              }

              .dim-close {
                  background: none;
                  border: none;
                  color: white;
                    font-size: 20px;
                  cursor: pointer;
                    padding: 4px;
                    width: 28px;
                    height: 28px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dim-close:hover {
                    background: rgba(255, 255, 255, 0.1);
              }

              .dim-body {
                  padding: 20px;
                  max-height: 60vh;
                  overflow-y: auto;
                    background: #fafafa;
                }

                .dim-body::-webkit-scrollbar {
                    width: 6px;
                }

                .dim-body::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                .dim-body::-webkit-scrollbar-thumb {
                    background: #1e4b92;
                    border-radius: 3px;
              }

              .dim-group {
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    padding: 16px;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                }

              .dim-group:hover {
                    border-color: #ccc;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .dim-group strong {
                    font-weight: 500;
                    color: #333;
                    display: block;
                    margin-bottom: 8px;
              }

              .dim-group.selected-od {
                    border-color: rgba(186, 85, 211, 0.4);
                    background: rgba(186, 85, 211, 0.2);
                    box-shadow: 0 2px 8px rgba(186, 85, 211, 0.3);
              }

              .dim-group.selected-og {
                    border-color: rgba(135, 206, 250, 0.5);
                    background: rgba(135, 206, 250, 0.3);
                    box-shadow: 0 2px 8px rgba(135, 206, 250, 0.3);
              }

              .dim-group.selected-od * {
                    color: #333 !important;
              }

              .dim-group.selected-og * {
                    color: #333 !important;
              }

              .dim-buttons {
                  display: flex;
                    gap: 8px;
                    margin-top: 12px;
              }

              .dim-btn {
                  flex: 1;
                    padding: 8px 16px;
                    border: 1px solid #1e4b92;
                  border-radius: 4px;
                  cursor: pointer;
                    font-size: 13px;
                    font-weight: 400;
                    transition: all 0.2s ease;
                    background: white;
                    color: #1e4b92;
              }

              .dim-btn:hover {
                    background: #1e4b92;
                  color: white;
              }

                .dim-btn.active-od {
                    background: rgba(186, 85, 211, 0.2);
                    color: #333;
                    border-color: rgba(186, 85, 211, 0.4);
              }

              .dim-btn.active-og {
                    background: rgba(135, 206, 250, 0.3);
                    color: #333;
                    border-color: rgba(135, 206, 250, 0.5);
              }

              .dim-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #e0e0e0;
                  text-align: center;
                    background: white;
              }

              .dim-import-btn {
                  background: #1e4b92;
                  color: white;
                  border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 500;
                  cursor: pointer;
                    transition: background 0.2s ease;
                }

                .dim-import-btn:hover {
                    background: #163a73;
              }

              .dim-import-btn:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
              }
          `;
          document.head.appendChild(style);
      },

      async showDesktopImportModal() {
          // Protection contre les doublons
          if (this.isModalOpen) {
              return;
          }

          this.isModalOpen = true;

          try {
              // Test connexion
              const testResponse = await fetch(`${this.apiUrl}/status`);
              if (!testResponse.ok) {
                  throw new Error('Scanner non accessible');
              }

              // Scanner tous les dossiers configurés dans l'application desktop
              const response = await fetch(`${this.apiUrl}/scan-desktop`);
              const data = await response.json();

              if (!data.success) {
                  throw new Error(data.error || 'Erreur scan');
              }

              if (!data.groups || data.groups.length === 0) {
                  alert('Aucune topographie trouvée dans les dossiers configurés');
                  this.isModalOpen = false; // Réinitialiser le flag
                  return;
              }
              // Stocker groupes
              this.currentGroups = data.groups;

              // Créer modal
              this.createSimpleModal();

          } catch (error) {
              alert('Erreur: Vérifiez que le scanner Python est lancé\n\n' + error.message);
              this.isModalOpen = false; // Réinitialiser le flag en cas d'erreur
          }
      },

      createSimpleModal() {
          // Nettoyer modal
          this.closeModal();

          // S'assurer que les styles sont injectés
          this.injectModalStyles();

          // Overlay
          const overlay = document.createElement('div');
          overlay.className = 'dim-overlay';
          overlay.id = 'dim-overlay';

          // Modal
          const modal = document.createElement('div');
          modal.className = 'dim-modal';
          modal.id = 'dim-modal';

          // HTML
          let groupsHtml = '';
          this.currentGroups.forEach((group, index) => {
              // Chercher le fichier XREF pour TMS4
              const xrefFile = group.files.find(f => f.toLowerCase().includes('xref'));

              // Chercher le fichier SaveIndex pour TMS5
              const saveIndexFile = group.files.find(f => f.toLowerCase().includes('saveindex'));

              // Pour TMS4 avec XREF, afficher seulement la carte des détails
              if (xrefFile && group.topographer === 'tms4') {
              groupsHtml += `
                  <div class="dim-group" data-index="${index}">
                      <strong>${group.icon} ${group.topographer_name}</strong>
                          <div class="dim-xref-info" data-xref="${xrefFile}" style="
                              background: transparent;
                              border: none;
                              border-radius: 6px;
                              padding: 12px;
                              margin: 12px 0;
                              font-size: 13px;
                          ">
                              <div style="color: #1e4b92; font-weight: 500; margin-bottom: 8px;">
                                  📋 Données XREF TMS-4 détectées
                              </div>
                              <div class="dim-patient-info" style="color: #333;">
                                  Chargement des informations patient...
                              </div>
                          </div>
                          <div class="dim-buttons">
                              <button class="dim-btn dim-select-od" data-index="${index}" data-eye="od">
                                  OD
                              </button>
                              <button class="dim-btn dim-select-og" data-index="${index}" data-eye="og">
                                  OG
                              </button>
                              <button class="dim-btn dim-select-skip" data-index="${index}" data-eye="skip">
                                  Ignorer
                              </button>
                          </div>
                      </div>
                  `;
              } else if (saveIndexFile && group.topographer === 'tms5') {
                  // Pour TMS5 avec SaveIndex, afficher seulement la carte des détails
                  groupsHtml += `
                      <div class="dim-group" data-index="${index}">
                          <strong>${group.icon} ${group.topographer_name}</strong>
                          <div class="dim-saveindex-info" data-saveindex="${saveIndexFile}" style="
                              background: transparent;
                              border: none;
                              border-radius: 6px;
                              padding: 12px;
                              margin: 12px 0;
                              font-size: 13px;
                          ">
                              <div style="color: #1e4b92; font-weight: 500; margin-bottom: 8px;">
                                  📋 Données TMS-5 détectées
                              </div>
                              <div class="dim-patient-info" style="color: #333;">
                                  Chargement des informations patient...
                              </div>
                          </div>
                          <div class="dim-buttons">
                              <button class="dim-btn dim-select-od" data-index="${index}" data-eye="od">
                                  OD
                              </button>
                              <button class="dim-btn dim-select-og" data-index="${index}" data-eye="og">
                                  OG
                              </button>
                              <button class="dim-btn dim-select-skip" data-index="${index}" data-eye="skip">
                                  Ignorer
                              </button>
                          </div>
                      </div>
                  `;
              } else if (group.topographer === 'pentacam') {
                  // Pour Pentacam, parser le nom de fichier pour extraire les infos patient
                  const pentacamFile = group.files[0]; // Prendre le premier fichier

                  groupsHtml += `
                      <div class="dim-group" data-index="${index}">
                          <strong>${group.icon} ${group.topographer_name}</strong>
                          <div class="dim-pentacam-info" data-pentacam="${pentacamFile}" style="
                              background: transparent;
                              border: none;
                              border-radius: 6px;
                              padding: 12px;
                              margin: 12px 0;
                              font-size: 13px;
                          ">
                              <div style="color: #1e4b92; font-weight: 500; margin-bottom: 8px;">
                                  📋 Données Pentacam détectées
                              </div>
                              <div class="dim-patient-info" style="color: #333;">
                                  Chargement des informations patient...
                              </div>
                          </div>
                          <div class="dim-buttons">
                              <button class="dim-btn dim-select-od" data-index="${index}" data-eye="od">
                                  OD
                              </button>
                              <button class="dim-btn dim-select-og" data-index="${index}" data-eye="og">
                                  OG
                              </button>
                              <button class="dim-btn dim-select-skip" data-index="${index}" data-eye="skip">
                                  Ignorer
                              </button>
                          </div>
                      </div>
                  `;
              } else {
                  // Pour les autres topographes, afficher la liste des fichiers
                  groupsHtml += `
                      <div class="dim-group" data-index="${index}">
                          <strong>${group.icon} ${group.topographer_name}</strong>
                      <div style="font-size: 12px; color: #666; margin: 5px 0;">
                          ${group.files.map(f => '• ' + f.split('\\').pop()).join('<br>')}
                      </div>
                      <div class="dim-buttons">
                          <button class="dim-btn dim-select-od" data-index="${index}" data-eye="od">
                              OD
                          </button>
                          <button class="dim-btn dim-select-og" data-index="${index}" data-eye="og">
                              OG
                          </button>
                          <button class="dim-btn dim-select-skip" data-index="${index}" data-eye="skip">
                              Ignorer
                          </button>
                      </div>
                  </div>
              `;
              }
          });

          modal.innerHTML = `
              <div class="dim-header">
                  <h3>Import depuis le bureau (${this.currentGroups.length} groupes)</h3>
                  <button class="dim-close" id="dim-close">×</button>
              </div>
              <div class="dim-body">

                  ${groupsHtml}
              </div>
              <div class="dim-footer">
                  <button class="dim-import-btn" id="dim-import">
                      Lancer l'import
                  </button>
              </div>
          `;

          // Ajouter DOM
          document.body.appendChild(overlay);
          document.body.appendChild(modal);

          // Forcer l'affichage du modal
          setTimeout(() => {
              const modal = document.querySelector('.dim-modal');
              const overlay = document.querySelector('.dim-overlay');
              if (modal) {
                  modal.style.display = 'block';
                  modal.style.visibility = 'visible';
                  modal.style.opacity = '1';
              }
              if (overlay) {
                  overlay.style.display = 'block';
                  overlay.style.visibility = 'visible';
              }
          }, 100);

          // Attacher événements
          this.attachEvents();
          // Parser et afficher les informations XREF
          this.loadXrefData();

      },

        // Charger les données XREF et SaveIndex pour tous les groupes
        async loadXrefData() {
            // Charger les données XREF pour TMS4
            const xrefElements = document.querySelectorAll('.dim-xref-info');

            for (const element of xrefElements) {
              const xrefFile = element.dataset.xref;
              const patientInfoEl = element.querySelector('.dim-patient-info');

              if (xrefFile && patientInfoEl) {
                  try {
                      // Parser le fichier XREF
                      const xrefData = await this.parseXrefFile(xrefFile);

                      if (xrefData && xrefData.infos) {

                          // Stocker les données dans le groupe correspondant
                          const groupIndex = parseInt(element.closest('.dim-group').dataset.index);

                          if (groupIndex !== undefined && this.currentGroups[groupIndex]) {
                              const currentGroup = this.currentGroups[groupIndex];
                              const xrefNumber = currentGroup.xref_number;

                              // Trouver l'œil correspondant
                              let matchedInfo = null;
                              for (const [eye, fileId] of Object.entries(xrefData.eyes)) {
                                  if (fileId === xrefNumber) {
                                      matchedInfo = xrefData.infos[eye];
                                      break;
                                  }
                              }
                              if (matchedInfo) {
                                  this.currentGroups[groupIndex].parsedData = matchedInfo;
                              }
                          }

                          // Afficher uniquement les informations de l'œil correspondant à ce groupe
                          const groupIndex2 = parseInt(element.closest('.dim-group').dataset.index);
                          const currentGroup = this.currentGroups[groupIndex2];
                          const xrefNumber = currentGroup?.xref_number;

                          let patientHtml = '';

                          // Trouver l'œil correspondant au xref_number
                          let matchedEye = null;
                          let matchedInfo = null;

                          for (const [eye, fileId] of Object.entries(xrefData.eyes)) {
                              if (fileId === xrefNumber) {
                                  matchedEye = eye;
                                  matchedInfo = xrefData.infos[eye];
                                  break;
                              }
                          }

                          if (matchedEye && matchedInfo) {
                              const eyeIcon = matchedEye === 'OD' ? '👁️' : '👁️';
                              const eyeLabel = matchedEye === 'OD' ? 'Œil Droit' : 'Œil Gauche';

                              patientHtml = `
                                  <div style="
                                      margin-bottom: 12px;
                                      padding: 10px;
                                      background: ${matchedEye === 'OD' ? 'rgba(186, 85, 211, 0.2)' : 'rgba(135, 206, 250, 0.3)'};
                                      border-radius: 6px;
                                      border-left: none;
                                  ">
                                      <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                          <span style="font-size: 16px; margin-right: 8px;">${eyeIcon}</span>
                                          <strong style="color: ${matchedEye === 'OD' ? '#663399' : '#2196f3'}; font-size: 14px;">
                                              ${eyeLabel} (${matchedEye}) - XREF #${xrefNumber}
                                          </strong>
                                      </div>

                                      <div style="margin-bottom: 4px;">
                                          <strong style="color: #333;">👤 Nom:</strong> <span style="color: #555;">${matchedInfo.lastName || 'N/A'}</span>
                                      </div>

                                      <div style="margin-bottom: 4px;">
                                          <strong style="color: #333;">👤 Prénom:</strong> <span style="color: #555;">${matchedInfo.firstName || 'N/A'}</span>
                                      </div>
                                  </div>
                              `;
                          } else {
                              patientHtml = `<span style="color: #dc3545;">Œil non trouvé pour XREF #${xrefNumber}</span>`;
                          }

                          patientInfoEl.innerHTML = patientHtml;
                      } else {
                          patientInfoEl.innerHTML = '<span style="color: #666;">Aucune donnée patient trouvée</span>';
                      }
                  } catch (error) {
                      console.error('Erreur chargement XREF:', error);
                      patientInfoEl.innerHTML = '<span style="color: #dc3545;">Erreur de chargement</span>';
                  }
              }
          }

          // Charger les données SaveIndex pour TMS5
          const saveIndexElements = document.querySelectorAll('.dim-saveindex-info');

          for (const element of saveIndexElements) {
              const saveIndexFile = element.dataset.saveindex;
              const patientInfoEl = element.querySelector('.dim-patient-info');

              if (saveIndexFile && patientInfoEl) {
                  try {
                      // Parser le fichier SaveIndex
                      const saveIndexData = await this.parseSaveIndexFile(saveIndexFile);

                      if (saveIndexData && saveIndexData.infos) {

                          // Stocker les données dans le groupe correspondant
                          const groupIndex = parseInt(element.closest('.dim-group').dataset.index);

                          if (groupIndex !== undefined && this.currentGroups[groupIndex]) {
                              // Prendre les données du premier œil trouvé (OD ou OS)
                              const firstEyeData = Object.values(saveIndexData.infos)[0];
                              if (firstEyeData) {
                                  this.currentGroups[groupIndex].parsedData = firstEyeData;
                              }
                          }

                          // Afficher les informations patient
                          let patientHtml = '';

                          Object.entries(saveIndexData.infos).forEach(([eye, info]) => {
                              const eyeIcon = eye === 'OD' ? '👁️' : '👁️';
                              const eyeLabel = eye === 'OD' ? 'Œil Droit' : 'Œil Gauche';

                              patientHtml += `
                                  <div style="
                                      margin-bottom: 12px;
                                      padding: 10px;
                                      background: ${eye === 'OD' ? 'rgba(186, 85, 211, 0.2)' : 'rgba(135, 206, 250, 0.3)'};
                                      border-radius: 6px;
                                      border-left: none;
                                  ">
                                      <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                          <span style="font-size: 16px; margin-right: 8px;">${eyeIcon}</span>
                                          <strong style="color: ${eye === 'OD' ? '#663399' : '#2196f3'}; font-size: 14px;">
                                              ${eyeLabel} (${eye})
                                          </strong>
                                      </div>

                                      <div style="margin-bottom: 4px;">
                                          <strong>👤 Nom:</strong> ${info.lastName || 'N/A'}
                                      </div>

                                      <div style="margin-bottom: 4px;">
                                          <strong>👤 Prénom:</strong> ${info.firstName || 'N/A'}
                                      </div>
                                  </div>
                              `;
                          });

                          patientInfoEl.innerHTML = patientHtml;
                      } else {
                          patientInfoEl.innerHTML = '<span style="color: #666;">Aucune donnée patient trouvée</span>';
                      }
                  } catch (error) {
                      console.error('Erreur chargement SaveIndex:', error);
                      patientInfoEl.innerHTML = '<span style="color: #dc3545;">Erreur de chargement</span>';
                  }
              }
          }

          // Charger les données Pentacam pour tous les groupes
          const pentacamElements = document.querySelectorAll('.dim-pentacam-info');

          for (const element of pentacamElements) {
              const pentacamFile = element.dataset.pentacam;
              const patientInfoEl = element.querySelector('.dim-patient-info');

              if (pentacamFile && patientInfoEl) {
                  try {
                      // Parser le nom de fichier Pentacam
                      const pentacamData = await this.parsePentacamFilename(pentacamFile);

                      if (pentacamData && pentacamData.infos) {

                          // Stocker les données dans le groupe correspondant
                          const groupIndex = parseInt(element.closest('.dim-group').dataset.index);

                          if (groupIndex !== undefined && this.currentGroups[groupIndex]) {
                              const firstEyeData = Object.values(pentacamData.infos)[0];
                              if (firstEyeData) {
                                  this.currentGroups[groupIndex].parsedData = firstEyeData;
                              }
                          }

                          // Afficher les informations patient
                          let patientHtml = '';

                          Object.entries(pentacamData.infos).forEach(([eye, info]) => {
                              const eyeIcon = '👁️';
                              const eyeLabel = eye === 'od' ? 'Œil Droit' : 'Œil Gauche';

                              patientHtml += `
                                  <div style="
                                      margin-bottom: 12px;
                                      padding: 10px;
                                      background: ${eye === 'od' ? 'rgba(186, 85, 211, 0.2)' : 'rgba(135, 206, 250, 0.3)'};
                                      border-radius: 6px;
                                      border-left: none;
                                  ">
                                      <div style="display: flex; align-items: center; margin-bottom: 6px;">
                                          <span style="font-size: 16px; margin-right: 8px;">${eyeIcon}</span>
                                          <strong style="color: ${eye === 'od' ? '#663399' : '#2196f3'}; font-size: 14px;">
                                              ${eyeLabel} (${eye.toUpperCase()})
                                          </strong>
                                      </div>

                                      <div style="margin-bottom: 4px;">
                                          <strong>👤 Nom:</strong> ${info.lastName || 'N/A'}
                                      </div>

                                      <div style="margin-bottom: 4px;">
                                          <strong>👤 Prénom:</strong> ${info.firstName || 'N/A'}
                                      </div>
                                  </div>
                              `;
                          });

                          patientInfoEl.innerHTML = patientHtml;
                      } else {
                          patientInfoEl.innerHTML = '<span style="color: #666;">Aucune donnée patient trouvée</span>';
                      }
                  } catch (error) {
                      console.error('Erreur chargement Pentacam:', error);
                      patientInfoEl.innerHTML = '<span style="color: #dc3545;">Erreur de chargement</span>';
                  }
              }
          }
      },

      attachEvents() {
          const modal = document.getElementById('dim-modal');
          if (!modal) {
              console.error('Modal non trouvé !');
              return;
          }

          // Fermer modal
          document.getElementById('dim-close')?.addEventListener('click', () => {
              this.closeModal();
          });

          document.getElementById('dim-overlay')?.addEventListener('click', () => {
              this.closeModal();
          });

          // Sélection
          modal.querySelectorAll('.dim-btn').forEach(btn => {
              btn.addEventListener('click', (e) => {
                  const index = parseInt(btn.dataset.index);
                  const eye = btn.dataset.eye;
                  this.selectGroupEye(index, eye);
              });
          });

          // Tout OD
          document.getElementById('dim-all-od')?.addEventListener('click', () => {
              this.currentGroups.forEach((g, i) => this.selectGroupEye(i, 'od'));
          });

          // Tout OG
          document.getElementById('dim-all-og')?.addEventListener('click', () => {
              this.currentGroups.forEach((g, i) => this.selectGroupEye(i, 'og'));
          });

          // Import
          document.getElementById('dim-import')?.addEventListener('click', () => {
              this.startImport();
          });

          // ESC
          document.addEventListener('keydown', this.escHandler = (e) => {
              if (e.key === 'Escape') this.closeModal();
          });
      },

      selectGroupEye(index, eye) {
          const group = this.currentGroups[index];
          if (!group) return;

          // Mettre à jour
          group.selectedEye = eye;

          // UI
          const groupEl = document.querySelector(`.dim-group[data-index="${index}"]`);
          if (groupEl) {
              // Reset
              groupEl.classList.remove('selected-od', 'selected-og');
              groupEl.querySelectorAll('.dim-btn').forEach(b => {
                  b.classList.remove('active-od', 'active-og');
              });

              // Classes
              if (eye === 'od') {
                  groupEl.classList.add('selected-od');
                  groupEl.querySelector('.dim-select-od').classList.add('active-od');
              } else if (eye === 'og') {
                  groupEl.classList.add('selected-og');
                  groupEl.querySelector('.dim-select-og').classList.add('active-og');
              }
          }

      },

      closeModal() {
          document.getElementById('dim-modal')?.remove();
          document.getElementById('dim-overlay')?.remove();
          if (this.escHandler) {
              document.removeEventListener('keydown', this.escHandler);
          }
          // Réinitialiser le flag de modal ouvert
          this.isModalOpen = false;
      },

    async startImport() {
        const toImport = this.currentGroups.filter(g => g.selectedEye && g.selectedEye !== 'skip');

        if (toImport.length === 0) {
            alert('Sélectionnez au moins un œil pour l\'import');
            return;
        }

        // Fermer modal
        this.closeModal();

        // Toast
        if (window.showToast) {
            window.showToast(`🚀 Import de ${toImport.length} groupe(s) en cours...`);
        }

        let successCount = 0;
        let errorCount = 0;

        // Import séquentiel
        for (let i = 0; i < toImport.length; i++) {
            const group = toImport[i];

            try {

                // Progression
                if (window.showToast) {
                    window.showToast(`Import ${i + 1}/${toImport.length}: ${group.topographer_name} → ${group.selectedEye.toUpperCase()}`);
                }

                // Attendre import
                await this.performRealImport(group, group.selectedEye);

                successCount++;

                // Pause
                if (i < toImport.length - 1) {
                    await wait(2000);
                }

            } catch (error) {
                console.error(`Erreur import ${group.topographer_name}:`, error);
                errorCount++;
            }
        }

        // Rafraîchir
        if (window.TopographyModule) {
            window.TopographyModule.checkForFiles();
        }
    },

    async performRealImport(group, eye) {

      if (window.location.href === 'https://click-fit.precilens.com/' ||
          window.location.href === 'https://click-fit.precilens.com') {
          await this.autoCreateWearerAndFile(group);
          return; // Sortir APRÈS la création automatique - IMPORTANT !
                  } else {
      }

      try {
          // Bouton download
          let uploadButton;

          if (eye === 'od') {
              uploadButton = document.querySelector('app-file-information-eye:nth-child(1) button i.ri-download-2-fill')?.parentElement?.parentElement;
              if (!uploadButton) {
                  uploadButton = document.querySelector('app-file-information-eye:nth-child(1) button:has(i.ri-download-2-fill)');
                          }
                      } else {
              uploadButton = document.querySelector('app-file-information-eye:nth-child(2) button i.ri-download-2-fill')?.parentElement?.parentElement;
              if (!uploadButton) {
                  uploadButton = document.querySelector('app-file-information-eye:nth-child(2) button:has(i.ri-download-2-fill)');
              }
          }

          if (!uploadButton) {
              const allButtons = document.querySelectorAll('button');
              const downloadButtons = Array.from(allButtons).filter(b =>
                  b.querySelector('i.ri-download-2-fill')
              );

              if (eye === 'od' && downloadButtons[0]) {
                  uploadButton = downloadButtons[0];
              } else if (eye === 'og' && downloadButtons[1]) {
                  uploadButton = downloadButtons[1];
              }
          }

          if (!uploadButton) {
              console.error(`Bouton ${eye} non trouvé`);
              alert(`Bouton d'import ${eye.toUpperCase()} non trouvé`);
              return;
          }

          uploadButton.click();

          // Attendre modal
          await wait(1500);

          // Sélection topographe
          const topographerSelect = document.querySelector('#input-topographer');
          if (topographerSelect) {

              const topographerMapping = {
                  'tms4': 'tms_4',
                  'tms5': 'tms_5',
                  'medmont': 'medmont_6',
                  'pentacam': 'oculus_pentacam',
                  'keratron': 'keratron_scout',
                  'atlas': 'atlas9000',
                  'phoenix': 'sirius_phoenix',
                  'ca200': 'ca200',
                  'opd_scan': 'opdscan',
                  'orbscan': 'orbscan',
                  'keratograph': 'oculus_keratograph',
                  'easygraph': 'oculus_easygraph'
              };

              const selectValue = topographerMapping[group.topographer];

              if (selectValue) {
                  topographerSelect.value = selectValue;
                  topographerSelect.dispatchEvent(new Event('change', { bubbles: true }));
                  topographerSelect.dispatchEvent(new Event('input', { bubbles: true }));
                  await new Promise(r => setTimeout(r, 500));
              } else {

                  // Recherche par nom
                  const options = topographerSelect.querySelectorAll('option');
                  options.forEach(option => {
                      const optionText = option.textContent.trim().toLowerCase();
                      const groupName = group.topographer_name.toLowerCase();

                      if (optionText.includes(groupName) || groupName.includes(optionText)) {
                          topographerSelect.value = option.value;
                          topographerSelect.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                  });
              }
          }

          // Input file
          const fileInput = document.querySelector('input[type="file"]');
          if (!fileInput) {
              console.error('Input file non trouvé');
              return;
          }

          // Charger fichiers
          const files = [];
          for (const filepath of group.files) {
              const filename = filepath.split('/').pop().split('\\').pop();

              try {
                  const response = await fetch(`${this.apiUrl}/file/${filename}`);

                  if (!response.ok) {
                      console.error(`Fichier non trouvé: ${filename}`);
                      continue;
                  }

                  const blob = await response.blob();

                  // PATCH XREF POUR AMILTON : Filtrer pour ne garder que la ligne de l'œil uploadé
                  // Problème : Amilton lit toujours la première ligne du XREF, donc OD et OG ont les mêmes valeurs
                  // Solution : Créer un XREF filtré avec seulement la ligne correspondant à cet œil
                  if (filename.toUpperCase() === 'XREF.DAT' && group.topographer === 'tms4' && group.xref_number) {
                      try {
                          const text = await blob.text();
                          const lines = text.split('\n');

                          // Garder les headers (lignes 0 et 1)
                          const filteredLines = [];
                          if (lines[0]) filteredLines.push(lines[0]);
                          if (lines[1]) filteredLines.push(lines[1]);

                          // Filtrer pour ne garder QUE la ligne correspondant à ce groupe
                          for (let i = 2; i < lines.length; i++) {
                              const line = lines[i].trim();
                              if (!line) continue;

                              const columns = line.split(',');
                              if (columns.length < 8) continue;

                              // Extraire l'ID du fichier (colonne 7)
                              const filenameCol = columns[7].trim();
                              let fileId = filenameCol;
                              if (filenameCol.includes('\\')) {
                                  fileId = filenameCol.split('\\').pop();
                              }
                              fileId = fileId.replace(/\.TMS$/i, '').replace(/\.tms$/i, '');

                              // Ne garder QUE la ligne correspondant au xref_number de ce groupe
                              if (fileId === group.xref_number) {
                                  filteredLines.push(line);
                                  break; // Une seule ligne suffit
                              }
                          }

                          // Créer le nouveau XREF filtré
                          const filteredText = filteredLines.join('\n');
                          const filteredBlob = new Blob([filteredText], { type: 'text/plain' });

                          const file = new File([filteredBlob], filename, {
                              type: 'text/plain',
                              lastModified: Date.now()
                          });

                          files.push(file);
                          continue; // Skip le push normal ci-dessous
                      } catch (xrefError) {
                          console.error('Erreur filtrage XREF, utilisation du fichier original:', xrefError);
                          // En cas d'erreur, on continue avec le fichier original
                      }
                  }

                  // Fichier normal (ou XREF en cas d'erreur)
                  const file = new File([blob], filename, {
                      type: blob.type || 'application/octet-stream',
                      lastModified: Date.now()
                  });

                  files.push(file);

              } catch (error) {
                  console.error(`Erreur téléchargement ${filename}:`, error);
              }
          }

          if (files.length === 0) {
              console.error('Aucun fichier chargé');
              return;
          }

          // Assigner fichiers
          const dt = new DataTransfer();
          files.forEach(file => dt.items.add(file));

          try {
              fileInput.files = dt.files;
          } catch(e) {
              Object.defineProperty(fileInput, 'files', {
                  value: dt.files,
                  writable: false,
                  configurable: true
              });
          }

          fileInput.dispatchEvent(new Event('change', { bubbles: true }));

          // Attendre un peu
          await wait(800);

          // Bouton Importer
          const importBtn = Array.from(document.querySelectorAll('button')).find(btn =>
              btn.textContent.includes('Importer') && !btn.disabled
          );

          if (importBtn) {
              importBtn.click();

              // Marquer importé
              await this.markAsImported(group.files, group);

              // Marquer serveur
              await this.markAsImported(group.files);

              await wait(2000);
          } else {
              console.error(' Bouton Importer non trouvé dans le modal');
          }

      } catch (error) {
          console.error(' Erreur import:', error);
      }
    },

    async loadFilesFromServer(group) {
          const files = [];

          for (const filepath of group.files) {
              try {
                  // Extraire nom fichier
                  const filename = filepath.split('/').pop().split('\\').pop();

                  // Appeler API
                  const response = await fetch(`${this.apiUrl}/file/${encodeURIComponent(filename)}`);

                  if (!response.ok) {
                      console.error(` Erreur chargement ${filename}: ${response.status}`);
                      continue;
                  }

                  const blob = await response.blob();

                  // Créer File
                  const file = new File([blob], filename, {
                      type: this.getMimeType(filename)
                  });

                  files.push(file);

              } catch (error) {
                  console.error(` Erreur chargement fichier:`, error);
              }
          }

          return files;
    },

    getMimeType(filename) {
          const ext = filename.split('.').pop().toLowerCase();
          const mimeTypes = {
              'tgl': 'application/octet-stream',
              'hgt': 'application/octet-stream',
              'dst': 'application/octet-stream',
              'csv': 'text/csv',
              'txt': 'text/plain',
              'xml': 'text/xml',
              'dat': 'application/octet-stream'
          };
          return mimeTypes[ext] || 'application/octet-stream';
      },

    async waitForUploadModal(maxWait = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWait) {
            const modal = document.querySelector('.modal, app-modal, [role="dialog"]');
            if (modal) {
                await new Promise(r => setTimeout(r, 500));
                return modal;
            }
            await wait(100);
        }

        throw new Error('Timeout: Modal non trouvée');
    },

    async findDropzone() {
        // Sélecteurs
        const selectors = [
            '.dropzone.visible',
            '.dropzone',
            'app-files-dropzone .dropzone',
            '[class*="drop"][class*="zone"]',
            '.modal input[type="file"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }

        // Input file parent
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            return fileInput.parentElement;
        }

        return null;
    },

    async findValidateButton() {
        // Sélecteurs bouton
        const selectors = [
            '.modal__footer button[type="submit"]',
            '.modal__footer button.modal-submit-btn',
            '.modal button:last-child',
            'button[class*="submit"]',
            'button[class*="import"]'
        ];

        for (const selector of selectors) {
            const button = document.querySelector(selector);
            if (button && !button.disabled) {
                // Vérifier bouton
                const text = button.textContent.toLowerCase();
                if (text.includes('import') || text.includes('valid') || text.includes('ok')) {
                    return button;
                }
            }
        }

        // Recherche texte
        const allButtons = document.querySelectorAll('.modal button, app-modal button');
        for (const button of allButtons) {
            const text = button.textContent.toLowerCase();
            if ((text.includes('import') || text.includes('valid')) && !button.disabled) {
                return button;
            }
        }

        return null;
    },

    async waitForModalClose(maxWait = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWait) {
            const modal = document.querySelector('.modal, app-modal');
            if (!modal) {
                return;
            }
            await wait(100);
        }
    },

    async markAsImported(files, groupInfo = null) {
    try {
        // Vérifier TMS-4
        const keepXref = groupInfo && groupInfo.topographer === 'tms4' && groupInfo.multiple_eyes;

        await fetch(`${this.apiUrl}/mark-imported`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                files: files,
                move: true,
                keep_xref: keepXref
            })
        });
    } catch (error) {
        console.error('Erreur marquage:', error);
    }
    },

    async autoCreateWearerAndFile(group) {

        let patientData = group?.parsedData || null;

      try {
                 // Ouvrir le modal "Ajouter porteur"

                 // Essayer plusieurs sélecteurs pour le bouton "Ajouter porteur"
                 let addWearerBtn = null;
                 const wearerSelectors = [
                     '#wrapper > main > app-home > div > div:nth-child(1) > app-wearers-list > div.card__header.wearers-list > div > amds-button.wearers-add-btn.hydrated > button',
                     'amds-button.wearers-add-btn button',
                     'button[class*="wearers-add"]',
                     'button[class*="add-wearer"]'
                 ];

                 for (const selector of wearerSelectors) {
                     addWearerBtn = document.querySelector(selector);
                     if (addWearerBtn) {
                         break;
                     }
                 }

                 // Si pas trouvé, chercher par texte
                 if (!addWearerBtn) {
                     const allButtons = document.querySelectorAll('button');
                     for (const btn of allButtons) {
                         const text = btn.textContent.trim();
                         if (text.includes('Ajouter') && text.includes('porteur')) {
                             addWearerBtn = btn;
                             break;
                         }
                     }
                 }

                 if (!addWearerBtn) {
                     console.error('Bouton "Ajouter porteur" non trouvé');
                     throw new Error('Bouton "Ajouter porteur" non trouvé');
                 }

                 try {
                     addWearerBtn.click();
                 } catch (error) {
                     console.error('Erreur lors du clic sur "Ajouter porteur":', error);
                     throw error;
                 }

                 // Attendre l'ouverture du modal
                 await wait(500);

                 // Remplir le nom
                 if (patientData?.lastName) {
                     const lastNameInput = document.querySelector('#input-lastName');
                     if (lastNameInput) {
                         lastNameInput.value = patientData.lastName;
                         lastNameInput.dispatchEvent(new Event('input', { bubbles: true }));
                         lastNameInput.dispatchEvent(new Event('change', { bubbles: true }));
                         lastNameInput.dispatchEvent(new Event('blur', { bubbles: true }));
                     }
                 }

                 // Remplir le prénom
                 if (patientData?.firstName) {
                     const firstNameInput = document.querySelector('#input-firstName');
                     if (firstNameInput) {
                         firstNameInput.value = patientData.firstName;
                         firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));
                         firstNameInput.dispatchEvent(new Event('change', { bubbles: true }));
                         firstNameInput.dispatchEvent(new Event('blur', { bubbles: true }));
                     }
                 }

                 // Attendre clic utilisateur sur "Ajouter" puis auto-clic sur "Confirmer"
                 await new Promise((resolve) => {
                     console.log('[ClickFit] Attente clic sur Ajouter...');

                     const checkInterval = setInterval(() => {
                         // Chercher le bouton "Confirmer" avec plusieurs méthodes
                         let confirmBtn = null;

                         // Méthode 1: Sélecteur spécifique
                         let candidate = document.querySelector('#wrapper > app-modals-injector > div > div > app-modal > div.modal-container > div > div.modal__footer > div > div:nth-child(2) > amds-button.modal-submit-btn.ng-star-inserted.hydrated > button');
                        const isValidConfirm = (btn) => { if (!btn) return false; const t = (btn.textContent||'').trim().toLowerCase(); if (t.includes('ajouter') || t.includes('add')) return false; return ['confirmer','confirm','valider','ok'].some(v => t === v || t.includes(v)); };
                        if (candidate && isValidConfirm(candidate)) { confirmBtn = candidate; }

                         // Méthode 2: Sélecteur plus générique
                         if (!confirmBtn) {
                             candidate = document.querySelector('app-modal .modal__footer amds-button.modal-submit-btn button');
                             if (candidate && isValidConfirm(candidate)) { confirmBtn = candidate; } // Corrigé
                         }

                         // Méthode 3: Recherche par texte dans tous les boutons du modal
                         if (!confirmBtn) {
                             const modalButtons = document.querySelectorAll('app-modal button, .modal button, [role="dialog"] button');
                             for (const btn of modalButtons) {
                                 const text = (btn.textContent || '').trim().toLowerCase();
                                 if (text === 'confirmer' || text === 'confirm' || text === 'valider' || text === 'ok') {
                                     confirmBtn = btn;
                                     // Bouton trouvé
                                     break;
                                 }
                             }
                         }

                         // Si le bouton "Confirmer" existe et est actif, cliquer dessus
                         if (confirmBtn && !confirmBtn.disabled) {
                             // Auto-clic Confirmer

                             try {
                                 confirmBtn.click();
                                 // OK

                                 // Attendre que le modal se ferme
                                 setTimeout(() => {
                                     clearInterval(checkInterval);
                                     // next step
                                     resolve();
                                 }, 1500);
                             } catch (error) {
                                 console.error('[ClickFit] Erreur clic Confirmer:', error);
                                 clearInterval(checkInterval);
                                 resolve();
                             }
                             return;
                         }

                         // Vérifier si le modal est fermé (annulation ou autre)
                         const modal = document.querySelector('app-modal, .modal, [role="dialog"]');
                         const modalVisible = modal && window.getComputedStyle(modal).display !== 'none';

                         if (!modalVisible) {
                             // Modal fermé
                             clearInterval(checkInterval);
                             resolve();
                         }
                     }, 300); // Vérification toutes les 300ms

                     // Timeout de sécurité (60 secondes)
                     setTimeout(() => {
                         // Timeout 60s
                         clearInterval(checkInterval);
                         resolve();
                     }, 60000);
                 });

          // 4. Attendre que le porteur soit créé et que le bouton apparaisse
          await wait(1000); // Augmenté à 1s pour les connexions lentes

                 // Fonction pour chercher le bouton avec plusieurs méthodes
                 async function findAddFileButton(maxAttempts = 5, delayBetween = 500) {
                     const selectors = [
                         '#wrapper > main > app-home > div > div:nth-child(2) > app-files-list > div.header-buttons.ng-star-inserted > amds-button.add-file-btn.ng-star-inserted.hydrated > button',
                         'amds-button.add-file-btn button',
                         'button[class*="add-file"]',
                         'button[class*="addFile"]',
                         'app-files-list button',
                         'div.header-buttons button'
                     ];

                     // Textes possibles pour le bouton (français/anglais)
                     const buttonTexts = [
                         'ajouter', 'nouveau', 'créer', 'add', 'new', 'create'
                     ];
                     const contextTexts = [
                         'dossier', 'fichier', 'file', 'folder', 'consultation'
                     ];

                     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                         // Tentative ${attempt}/${maxAttempts}

                         // Méthode 1: Sélecteurs CSS
                         for (const selector of selectors) {
                             const btn = document.querySelector(selector);
                             if (btn && !btn.disabled) {
                                 // found
                                 return btn;
                             }
                         }

                         // Méthode 2: Recherche par texte (plus flexible)
                         const allButtons = document.querySelectorAll('button');
                         for (const btn of allButtons) {
                             const text = (btn.textContent || '').toLowerCase().trim();
                             const hasAction = buttonTexts.some(t => text.includes(t));
                             const hasContext = contextTexts.some(t => text.includes(t));

                             if (hasAction && hasContext && !btn.disabled) {
                                 // found by text
                                 return btn;
                             }
                         }

                         // Debug: lister les boutons disponibles à la dernière tentative
                         if (attempt === maxAttempts) {
                             // Debug: buttons not found
                             allButtons.forEach((btn, i) => {
                                 if (i < 15) console.log(`  ${i}: "${btn.textContent?.trim().substring(0, 50)}"`);
                             });
                         }

                         if (attempt < maxAttempts) {
                             await wait(delayBetween);
                         }
                     }
                     return null;
                 }

                 const addFileBtn = await findAddFileButton(5, 800); // 5 tentatives, 800ms entre chaque

                 if (!addFileBtn) {
                     console.error('❌ Bouton "Ajouter fichier" non trouvé après 5 tentatives');
                     showToast('Bouton "Ajouter fichier" non trouvé - Vérifiez que le porteur a été créé');
                     throw new Error('Bouton "Ajouter fichier" non trouvé');
                 }

                 try {
                     addFileBtn.click();
                 } catch (error) {
                     console.error('Erreur lors du clic sur "Ajouter fichier":', error);
                     throw error;
                 }

          // 5. Attendre le changement d'URL et déclencher l'import topographie

                 // Observer les changements d'URL
                 const currentUrl = window.location.href;
                 const urlCheckInterval = setInterval(() => {
                     if (window.location.href !== currentUrl && window.location.href.includes('/file/')) {
                         clearInterval(urlCheckInterval);

                         // Attendre 1 seconde puis déclencher l'import topographie
                         setTimeout(async () => {

                             // Protection contre les doublons
                             if (window.DesktopImportModule && window.DesktopImportModule.isImporting) {
                                 return;
                             }

                             window.DesktopImportModule.isImporting = true;

                             try {
                                 await this.triggerDirectImport(group);
                             } finally {
                                 window.DesktopImportModule.isImporting = false;
                             }
                         }, 1000);
                     }
                 }, 100);

                 // Attendre que l'import topographie soit terminé
                 await new Promise((resolve) => {
                     // Timeout de sécurité (30 secondes)
                     setTimeout(() => {
                         clearInterval(urlCheckInterval);
                         resolve();
                     }, 30000);
                 });

      } catch (error) {
          console.error('Erreur lors de l\'auto-création porteur + fichier:', error);
          showToast('Erreur lors de la création automatique');
      }
    },

    async triggerDirectImport(group) {

        try {
            // Déterminer l'œil à partir des données parsées
            let targetEye = 'OD'; // Par défaut

            if (group.parsedData) {
                // Pour l'instant, on prend OD par défaut
                targetEye = 'OD';
            }

            // Sélecteurs des boutons d'upload selon l'œil
            const uploadSelectors = {
                'OD': '#wrapper > main > app-file-layout > div > app-file-tab-information > div.eyes-container > div > app-file-information-eye:nth-child(1) > div > div.content > app-file-information-eye-keratometry > app-accordion > div > div.content > div > app-file-information-eye-keratometry-topography > div.actions > amds-button > button',
                'OG': '#wrapper > main > app-file-layout > div > app-file-tab-information > div.eyes-container > div > app-file-information-eye:nth-child(2) > div > div.content > app-file-information-eye-keratometry > app-accordion > div > div.content > div > app-file-information-eye-keratometry-topography > div.actions > amds-button > button'
            };

            const uploadButton = document.querySelector(uploadSelectors[targetEye]);

            // Utiliser directement performRealImport qui fonctionne bien
            await this.performRealImport(group, targetEye.toLowerCase());

        } catch (error) {
            console.error('Erreur lors du déclenchement import direct:', error);
            showToast('Erreur lors de l\'import direct');
        }
    }

  };

  // Global
  window.DesktopImportModule = DesktopImportModule;

  // Auto-init
  setTimeout(() => {
      if (window.DesktopImportModule) {
          window.DesktopImportModule.init();
      }
  }, 2000);

  // Dupliquer OD vers OG
  function duplicateODtoOG() {
    const mappings = [
      {
        from: '#input-rightsphere',
        to: '#input-leftsphere',
        name: 'Sphère'
      },
      {
        from: '#input-rightcylinder',
        to: '#input-leftcylinder',
        name: 'Cylindre'
      },
      {
        from: '#input-rightrefractionAxis',
        to: '#input-leftrefractionAxis',
        name: 'Axe'
      }
    ];

    let copiedCount = 0;
    let errorMessages = [];

    mappings.forEach(mapping => {
      const fromInput = document.querySelector(mapping.from);
      const toInput = document.querySelector(mapping.to);

      if (fromInput && toInput) {
        const value = fromInput.value;

        if (value && value !== '') {
          toInput.value = value;
          toInput.dispatchEvent(new Event('input', { bubbles: true }));
          toInput.dispatchEvent(new Event('change', { bubbles: true }));

          if (mapping.name === 'Sphère' || mapping.name === 'Cylindre') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              toInput.value = numValue.toFixed(2);
            }
          }

          copiedCount++;
        }
      } else {
        if (!fromInput) {
          errorMessages.push(`Input source ${mapping.from} introuvable`);
        }
        if (!toInput) {
          errorMessages.push(`Input destination ${mapping.to} introuvable`);
        }
      }
    });

    if (copiedCount > 0) {
      showToast(` ${copiedCount} valeur(s) copiée(s) de OD vers OG`);
    } else if (errorMessages.length > 0) {
      showToast(' Erreur lors de la duplication');
      console.error('Erreurs de duplication:', errorMessages);
    } else {
      showToast(' Aucune valeur à copier');
    }
  }

  // Calcul LRPG
  async function performLRPGCalculation() {
    showToast('Démarrage du calcul LRPG...');

    try {
      commitActiveField();
      await forceAutoSaveAllEyes();
      const lensTab = document.querySelector('#wrapper > main > app-file-layout > div > app-tabs-list > div.tabs-container.has-actions > div.tabs.theme--classic.has-separators > div.tab.lens-0-tab.clickable.ng-star-inserted');

      if (!lensTab) {
        showToast('Onglet lentille introuvable');
        console.error('Onglet lentille non trouvé');
        return;
      }

      lensTab.click();

      await wait(1000);

      const rightTypeSelect = document.querySelector('#input-righttype');
      if (rightTypeSelect) {
        rightTypeSelect.value = 'lens:type:rigid';
        rightTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.error('Select OD non trouvé');
      }

      await wait(500);

      const leftTypeSelect = document.querySelector('#input-lefttype');
      if (leftTypeSelect) {
        leftTypeSelect.value = 'lens:type:rigid';
        leftTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        console.error(' Select OG non trouvé');
      }

      await wait(500);

      showToast(' Calcul LRPG terminé avec succès !');

    } catch (error) {
      console.error(' Erreur lors du calcul LRPG:', error);
      showToast(' Erreur lors du calcul LRPG');
    }
  }

  const selectors = [
    "#wrapper > main > app-file-layout > div > app-file-tab-information > div.eyes-container > div > app-file-information-eye:nth-child(1) > div > div.header > div.header__actions > amds-button > button", // OD
    "#wrapper > main > app-file-layout > div > app-file-tab-information > div.eyes-container > div > app-file-information-eye:nth-child(2) > div > div.header > div.header__actions > amds-button > button", // OG
    "#wrapper > main > app-file-layout > div > app-file-tab-first-lens > div.lens-container > form > div > amds-button > button", // Prescripteur
    "#wrapper > main > app-file-layout > div > app-file-tab-first-lens > div.lens-container > div > app-file-first-lens:nth-child(1) > div > div.header > div.header__actions > amds-button > button", // Lentille OD
    "#wrapper > main > app-file-layout > div > app-file-tab-first-lens > div.lens-container > div > app-file-first-lens:nth-child(2) > div > div.header > div.header__actions > amds-button > button" // Lentille OG
  ];

  const alreadyObserved = new WeakSet();

  // Raccourci Double Alt
  function setupDoubleAltShortcut() {

    let lastAltTime = 0;
    const doubleAltDelay = 500;

    document.addEventListener('keydown', (e) => {
      // Vérifier Alt
      if (e.key === 'Alt') {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastAltTime;

        // Double Alt
        if (timeDiff < doubleAltDelay) {

          // Empêcher défaut
          e.preventDefault();
          e.stopPropagation();

          // Enregistrer

          // Boutons enregistrement
          const saveButtons = document.querySelectorAll('amds-button button');
          let savedCount = 0;

          saveButtons.forEach((btn, index) => {
            if (!btn.disabled && btn.textContent && btn.textContent.includes('Enregistr')) {

              // Montrer bouton
              const wasHidden = btn.style.display === 'none';
              if (wasHidden) {
                btn.style.display = '';
              }

              btn.click();
              savedCount++;

              // Re-cacher si nécessaire
              if (wasHidden) {
                setTimeout(() => {
                  btn.style.display = 'none';
                }, 100);
              }
            }
          });

          // Attendre
          setTimeout(() => {

            // Bouton Notes
            const notesButtons = document.querySelectorAll('button');
            let notesButton = null;

            notesButtons.forEach(btn => {
              if (btn.textContent && btn.textContent.includes('Notes') &&
                  btn.closest('.header__actions')) {
                notesButton = btn;
              }
            });

            if (notesButton) {
              notesButton.click();
            } else {
              showToast('Bouton Notes non trouvé');
            }
          }, 300);
        } else {
          // Premier Alt
          lastAltTime = currentTime;
        }
      }
    });
  }
  // Init raccourci
  setupDoubleAltShortcut();

  // Agrandir zone notes
  function setupNotesEditAreaEnlargement() {

    // Observer textarea avec ObserverManager
    ObserverManager.createObserver(
      'notesTextareaEnlargement',
      (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Chercher textarea
              const textarea = node.querySelector ?
                node.querySelector('textarea#input-editContent') : null;

              // Vérifier nœud
              const isEditTextarea = node.tagName === 'TEXTAREA' && node.id === 'input-editContent';

              if (textarea || isEditTextarea) {
                const targetTextarea = textarea || node;

                // Appliquer styles
                targetTextarea.style.minHeight = '200px';
                targetTextarea.style.resize = 'vertical';
                targetTextarea.style.fontSize = '14px';
                targetTextarea.style.lineHeight = '1.4';
                targetTextarea.style.padding = '12px';
                targetTextarea.style.border = '2px solid #e0e0e0';
                targetTextarea.style.borderRadius = '8px';
                targetTextarea.style.transition = 'border-color 0.3s ease';
                targetTextarea.style.overflow = 'hidden';

                // Ajuster hauteur
                function autoResizeTextarea(textarea) {
                  // Réinitialiser hauteur
                  textarea.style.height = 'auto';

                  // Calculer hauteur
                  const scrollHeight = textarea.scrollHeight;
                  const minHeight = 200;
                  const maxHeight = 500;

                  // Appliquer hauteur
                  const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
                  textarea.style.height = newHeight + 'px';

                }

                // Hauteur initiale
                autoResizeTextarea(targetTextarea);

                // Ajuster contenu
                targetTextarea.addEventListener('input', () => {
                  autoResizeTextarea(targetTextarea);
                });

                // Ajuster focus
                targetTextarea.addEventListener('focus', () => {
                  autoResizeTextarea(targetTextarea);
                });
              }
            }
          });
        });
      },
      document.body,
      {
        childList: true,
        subtree: true
      },
      true // persistent: les notes peuvent apparaître sur toutes les pages
    );
  }
  // Init agrandissement
  setupNotesEditAreaEnlargement();

  // Centrage et déplacement modals
  function setupModalCentering() {

    // Centrer modal
    function centerModal(modal) {
      if (!modal || !modal.classList.contains('modal--size-medium')) return;

      // Centrage CSS
      modal.style.position = 'fixed';
      modal.style.margin = '0';
      modal.style.zIndex = '1050';

      // Largeur
      if (!modal.dataset.cfDefaultWidthSet) {
        modal.style.width = '70vw';
        modal.dataset.cfDefaultWidthSet = 'true';
      }

      // Centrer position
      const rect = modal.getBoundingClientRect();
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      modal.style.left = Math.max(0, (winW - rect.width) / 2) + 'px';
      modal.style.top = Math.max(0, (winH - rect.height) / 2) + 'px';
      modal.style.transform = 'none';
    }

    // Rendre déplaçable
    function makeModalDraggable(modal) {
      if (!modal || modal.dataset.cfDraggable === 'true') return;

      const header = modal.querySelector('.modal__header');
      if (!header) return;

      modal.dataset.cfDraggable = 'true';

      let isDragging = false;
      let startX, startY, startLeft, startTop;

      // Style header
      header.style.cursor = 'move';
      header.style.userSelect = 'none';

      // Drag events
      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.cf-modal-grip')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Récupérer la position actuelle
        const rect = modal.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        // S'assurer qu'il n'y a pas de transform
        modal.style.transform = 'none';

        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newLeft = Math.max(0, Math.min(window.innerWidth - modal.offsetWidth, startLeft + deltaX));
        const newTop = Math.max(0, Math.min(window.innerHeight - modal.offsetHeight, startTop + deltaY));

        modal.style.left = newLeft + 'px';
        modal.style.top = newTop + 'px';
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    // Observer pour détecter l'ouverture de nouveaux modals avec ObserverManager
    ObserverManager.createObserver(
      'modalCenteringAndDragging',
      (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Chercher les modals dans le nouveau nœud
              let modals = [];
              if (node.querySelectorAll) {
                modals = Array.from(node.querySelectorAll('.modal.modal--size-medium'));
              }

              // Ou vérifier si le nœud lui-même est un modal
              if (node.classList && node.classList.contains('modal') &&
                  node.classList.contains('modal--size-medium')) {
                modals.push(node);
              }

              modals.forEach(modal => {
                if (!modal.dataset.cfCentered) {
                  modal.dataset.cfCentered = 'true';

                  // Attendre que le modal soit complètement rendu
                  setTimeout(() => {
                    centerModal(modal);
                    makeModalDraggable(modal);
                  }, 100);
                }
              });
            }
          });
        });
      },
      document.body,
      {
        childList: true,
        subtree: true
      },
      true // persistent: les modals peuvent apparaître partout
    );

    // Centrer et rendre déplaçables les modals existants
    document.querySelectorAll('.modal.modal--size-medium').forEach(modal => {
      if (!modal.dataset.cfCentered) {
        modal.dataset.cfCentered = 'true';
        centerModal(modal);
        makeModalDraggable(modal);
      }
    });

    // Re-centrer lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      document.querySelectorAll('.modal.modal--size-medium').forEach(modal => {
        centerModal(modal);
      });
    });

    // Gestionnaire global unique pour fermer les modals avec Échap
    let escapeHandlerAdded = false;

    function addEscapeHandler() {
      if (escapeHandlerAdded) return;
      escapeHandlerAdded = true;

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          // Trouver tous les modals visibles
          const visibleModals = Array.from(document.querySelectorAll('.modal.modal--size-medium')).filter(modal => {
            const rect = modal.getBoundingClientRect();
            return modal.offsetParent !== null &&
                   modal.style.display !== 'none' &&
                   rect.width > 0 &&
                   rect.height > 0;
          });

          if (visibleModals.length > 0) {
            const modal = visibleModals[visibleModals.length - 1]; // Le plus récent

            // Essayer de fermer le modal
            const closeButton = modal.querySelector('amds-button button[type="button"]');
            const closeIcon = modal.querySelector('[name="ri-close-fill"], .ri-close-fill');
            const overlay = modal.querySelector('.modal-overlay, .modal__overlay');

            if (closeButton) {
              closeButton.click();
            } else if (closeIcon) {
              closeIcon.click();
            } else if (overlay) {
              overlay.click();
            } else {
              modal.style.display = 'none';
            }

            e.preventDefault();
            e.stopPropagation();
          }
        }
      });

    }

    // Activer le gestionnaire
    addEscapeHandler();
  }
  // Initialiser le centrage des modals
  setupModalCentering();

  // Observation des boutons
  function observeAndAutoClick(selector, buttonLabel) {
    const btn = document.querySelector(selector);
    if (!btn || alreadyObserved.has(btn)) return;
    btn.style.display = "none";

    // Délai spécifique pour les boutons "Lentille OD" et "Lentille OG"
    const needsDelay = buttonLabel.includes("Lentille");
    const clickDelay = needsDelay ? 1500 : 0; // 1.5 secondes pour les lentilles

    // Observer avec ObserverManager - nom unique par bouton
    const observerName = `autoClickButton_${buttonLabel.replace(/\s+/g, '_')}`;
    ObserverManager.createObserver(
      observerName,
      (mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            if (!btn.disabled && autoSaveEnabled) { // Vérifier si auto-save est activé
              if (clickDelay > 0) {

                // Vérifier si le canvas existe et attendre qu'il soit prêt
                const checkCanvasAndClick = () => {
                  const canvas = document.querySelector('#webgl-canvas');
                  if (canvas) {
                    // Attendre un peu plus pour être sûr que le rendu est fait
                    setTimeout(() => {
                      btn.click();
                    }, clickDelay);
                  } else {
                    // Si pas de canvas, cliquer quand même après le délai
                    setTimeout(() => {
                      btn.click();
                    }, clickDelay);
                  }
                };

                checkCanvasAndClick();
              } else {
                btn.click();
              }
            }
          }
        });
      },
      btn,
      { attributes: true },
      false // non-persistent: spécifique à un bouton qui peut disparaître
    );
    alreadyObserved.add(btn);
  }

  // Fonction pour scanner et observer tous les boutons
  function scanAndObserveButtons() {
    const labels = ["OD", "OG", "Prescripteur", "Lentille OD", "Lentille OG"];

    selectors.forEach((sel, i) => {
      const btn = document.querySelector(sel);
      if (btn && !alreadyObserved.has(btn)) {
        observeAndAutoClick(sel, labels[i]);
      }
    });
  }

  // Observation pour détecter l'apparition de nouveaux boutons
  function setupButtonObserver() {

    // Observer seulement les zones où les boutons peuvent apparaître
    const targetZones = [
      document.querySelector('#wrapper > main'),
      document.querySelector('.eyes-container'),
      document.querySelector('.lens-container')
    ].filter(el => el !== null);

    // Target principal pour l'observer
    const observerTarget = targetZones.length > 0 ? targetZones[0] : document.body;

    // Observer spécifique pour les boutons avec ObserverManager
    ObserverManager.createObserver(
      'buttonAppearanceDetection',
      (mutations) => {
        let shouldScan = false;

        mutations.forEach((mutation) => {
          // Vérifier si des boutons ont pu être ajoutés
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                // Vérifier si c'est un bouton ou contient des boutons
                if (node.tagName === 'BUTTON' ||
                    node.querySelector && node.querySelector('button')) {
                  shouldScan = true;
                }
              }
            });
          }
        });

        if (shouldScan) {
          scanAndObserveButtons();
        }
      },
      observerTarget,
      {
        childList: true,
        subtree: true
      },
      false // non-persistent: observer spécifique à la page courante
    );

    // Observer les autres zones si elles existent
    if (targetZones.length > 1) {
      targetZones.slice(1).forEach((zone, index) => {
        ObserverManager.createObserver(
          `buttonAppearanceDetection_zone${index + 2}`,
          (mutations) => {
            let shouldScan = false;
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                  if (node.nodeType === 1 && (node.tagName === 'BUTTON' ||
                      node.querySelector && node.querySelector('button'))) {
                    shouldScan = true;
                  }
                });
              }
            });
            if (shouldScan) {
              scanAndObserveButtons();
            }
          },
          zone,
          { childList: true, subtree: true },
          false
        );
      });
    }
  }

  function setupLensPageObserver() {

  const targetZones = [
    document.querySelector('#wrapper > main'),
    document.querySelector('.lens-container'),
    document.querySelector('[class*="lens"]')
  ].filter(el => el !== null);

  // Déterminer la cible d'observation
  let observerTarget;
  if (targetZones.length > 0) {
    observerTarget = targetZones[0];
  } else if (document.querySelector('main')) {
    observerTarget = document.querySelector('main');
  } else {
    return; // Pas de cible disponible
  }

  // Observer avec ObserverManager
  ObserverManager.createObserver(
    'lensPageRefractionDisplay',
    (mutations) => {
      let shouldCheckForLensPage = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (node.textContent &&
                  (node.textContent.includes('Œil droit') ||
                   node.textContent.includes('Œil gauche') ||
                   node.textContent.includes('Oeil droit') ||
                   node.textContent.includes('Oeil gauche'))) {
                shouldCheckForLensPage = true;
              }

              if (node.querySelector &&
                  (node.querySelector('div.amds-text.amds-font-headline-h6') ||
                   node.querySelector('[class*="lens"]'))) {
                shouldCheckForLensPage = true;
              }
            }
          });
        }
      });

      if (shouldCheckForLensPage) {
        setTimeout(() => {
          if (window.displayRefractionOnLensPage) {
            window.displayRefractionOnLensPage();
          }
        }, 500);
      }
    },
    observerTarget,
    {
      childList: true,
      subtree: true
    },
    false // non-persistent: spécifique à la page lentilles
  );

  // Observer les zones additionnelles si elles existent
  if (targetZones.length > 1) {
    targetZones.slice(1).forEach((zone, index) => {
      ObserverManager.createObserver(
        `lensPageRefractionDisplay_zone${index + 2}`,
        (mutations) => {
          let shouldCheckForLensPage = false;
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  if (node.textContent &&
                      (node.textContent.includes('Œil droit') ||
                       node.textContent.includes('Œil gauche') ||
                       node.textContent.includes('Oeil droit') ||
                       node.textContent.includes('Oeil gauche'))) {
                    shouldCheckForLensPage = true;
                  }
                  if (node.querySelector &&
                      (node.querySelector('div.amds-text.amds-font-headline-h6') ||
                       node.querySelector('[class*="lens"]'))) {
                    shouldCheckForLensPage = true;
                  }
                }
              });
            }
          });
          if (shouldCheckForLensPage) {
            setTimeout(() => {
              if (window.displayRefractionOnLensPage) {
                window.displayRefractionOnLensPage();
              }
            }, 500);
          }
        },
        zone,
        { childList: true, subtree: true },
        false
      );
    });
  }

  }

  // Force le step à 0.25 sur un input donné
  function forceCustomStep(inputSelector, inputName) {
    const input = document.querySelector(inputSelector);
    if (!input || input.dataset.customStepApplied === 'true') return;

    // Fonction helper pour vérifier si un input doit avoir le step 0.25
    function shouldHaveCustomStep(inputElement) {
      const stepInputs = [
        '#input-rightsphere',
        '#input-rightcylinder',
        '#input-leftsphere',
        '#input-leftcylinder',
        '#input-rightaddition',
        '#input-leftaddition'
      ];

      return stepInputs.some(selector => {
        return inputElement.matches(selector) || inputElement.id === selector.replace('#', '');
      });
    }

    // Vérifier si cet input doit avoir le comportement personnalisé
    if (!shouldHaveCustomStep(input)) {
      return;
    }

    // Marquer comme traité
    input.dataset.customStepApplied = 'true';

    // Forcer les attributs
    input.setAttribute('step', '0.25');

    // Fonction pour arrondir au multiple de 0.25 le plus proche
    function roundToStep(value, step = 0.25) {
      return Math.round(value / step) * step;
    }

    // Fonction pour mettre à jour la valeur
    function updateValue(newValue, keepFocus = false) {
      const rounded = roundToStep(newValue, 0.25);
      const formatted = rounded.toFixed(2);

      // Sauvegarder l'état du focus et la position du curseur
      const hasFocus = document.activeElement === input;
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      // Forcer la mise à jour de plusieurs façons
      input.value = formatted;
      input.setAttribute('value', formatted);

      // Déclencher tous les événements possibles
      ['input', 'change'].forEach(eventType => {
        input.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
      });

      // Forcer si comp Angular utilsé
      if (input._valueTracker) {
        input._valueTracker.setValue(formatted);
      }

      // Restaurer le focus si nécessaire
      if ((hasFocus || keepFocus) && document.activeElement !== input) {
        input.focus();
        // Restaurer la position du curseur
        if (selectionStart !== null && selectionEnd !== null) {
          input.setSelectionRange(selectionStart, selectionEnd);
        }
      }
    }

    // Intercepter et modifier le step natif
    let isUpdating = false;

    // Observer les changements de valeur avec ObserverManager
    // Nom unique basé sur l'ID de l'input
    const observerName = `inputValueStep_${input.id || inputSelector.replace(/[^a-zA-Z0-9]/g, '_')}`;
    ObserverManager.createObserver(
      observerName,
      (mutations) => {
        if (isUpdating) return;

        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            const currentValue = parseFloat(input.value) || 0;
            const roundedValue = roundToStep(currentValue, 0.25);

            if (Math.abs(currentValue - roundedValue) > 0.001) {
              isUpdating = true;
              updateValue(roundedValue);
              setTimeout(() => { isUpdating = false; }, 100);
            }
          }
        });
      },
      input,
      {
        attributes: true,
        attributeFilter: ['value']
      },
      false // non-persistent: spécifique à l'input de la page courante
    );

    // Intercepter les événements de changement
    input.addEventListener('change', (e) => {
      if (isUpdating) return;
      const currentValue = parseFloat(e.target.value) || 0;
      const roundedValue = roundToStep(currentValue, 0.25);

      if (Math.abs(currentValue - roundedValue) > 0.001) {
        e.preventDefault();
        e.stopPropagation();
        isUpdating = true;
        updateValue(roundedValue);
        setTimeout(() => { isUpdating = false; }, 100);
      }
    }, true);

    // Gérer la molette
    input.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const current = parseFloat(input.value) || 0;
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      updateValue(current + delta, true);
    }, { passive: false, capture: true });

    // Gérer les flèches du clavier
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        const current = parseFloat(input.value) || 0;
        const delta = e.key === 'ArrowUp' ? 0.25 : -0.25;
        updateValue(current + delta, true);
      }
    }, true);

    // Intercepter le clic sur les boutons de step natifs (si présents)
    const interceptStepButtons = () => {
      const parent = input.parentElement;
      if (!parent) return;

      parent.addEventListener('click', (e) => {
        // Si c'est un clic sur un bouton de step
        if (e.target.matches('button, [role="button"]') && e.target !== input) {
          e.preventDefault();
          e.stopPropagation();

          // Déterminer la direction
          const rect = input.getBoundingClientRect();
          const isUp = e.clientY < rect.top + rect.height / 2;
          const current = parseFloat(input.value) || 0;
          const delta = isUp ? 0.25 : -0.25;
          updateValue(current + delta, true);
        }
      }, true);

      setTimeout(() => {
        // Chercher la div .arrows qui contient les boutons
        const arrowsContainer = parent.querySelector('.arrows');
        if (arrowsContainer) {

          const buttons = arrowsContainer.querySelectorAll('button');
          buttons.forEach((button, index) => {
            // Remplacer complètement le comportement du bouton
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();

              const current = parseFloat(input.value) || 0;
              // Index 0 = bouton du haut (augmenter), Index 1 = bouton du bas (diminuer)
              const delta = index === 0 ? 0.25 : -0.25;
              updateValue(current + delta, true);

            });
          });
        }
      }, 100);

      // Observer avec ObserverManager - nom unique par input
      const arrowObserverName = `inputArrowButtons_${input.id || inputSelector.replace(/[^a-zA-Z0-9]/g, '_')}`;
      ObserverManager.createObserver(
        arrowObserverName,
        (mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.classList && node.classList.contains('arrows')) {
                const buttons = node.querySelectorAll('button');
                buttons.forEach((button, index) => {
                  button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const current = parseFloat(input.value) || 0;
                    const delta = index === 0 ? 0.25 : -0.25;
                    updateValue(current + delta, true);
                  }, true);
                });
              }
            });
          });
        },
        parent,
        {
          childList: true,
          subtree: true
        },
        false // non-persistent: spécifique à l'input de la page courante
      );
    };

    interceptStepButtons();

    // Vérification périodiquement que le step est toujours à 0.25 avec ObserverManager
    const stepCheckIntervalName = `inputStepCheck_${input.id || inputSelector.replace(/[^a-zA-Z0-9]/g, '_')}`;
    ObserverManager.createInterval(
      stepCheckIntervalName,
      () => {
        if (input.getAttribute('step') !== '0.25') {
          input.setAttribute('step', '0.25');
        }
      },
      1000,
      false // non-persistent: spécifique à l'input de la page courante
    );

  }

  // Liste des inputs qui doivent avoir le step 0.25
  const stepInputs = [
    '#input-rightsphere',
    '#input-rightcylinder',
    '#input-leftsphere',
    '#input-leftcylinder',
    '#input-rightaddition',
    '#input-leftaddition'
  ];

  // Appliquer le step custom à tous les inputs
  function applyCustomStepToAll() {
    const inputNames = {
      '#input-rightsphere': 'Sphère OD',
      '#input-rightcylinder': 'Cylindre OD',
      '#input-leftsphere': 'Sphère OG',
      '#input-leftcylinder': 'Cylindre OG'
    };

    stepInputs.forEach(selector => {
      forceCustomStep(selector, inputNames[selector] || selector);
    });
  }

  // Fonction pour réorganiser les champs de kératométrie
  function reorderKeratometryFields() {

    // Sélectionner les deux sections de kératométrie (OD et OG)
    const eyeContainers = document.querySelectorAll('app-file-information-eye');

    eyeContainers.forEach((eyeContainer, eyeIndex) => {
      const eyeName = eyeIndex === 0 ? 'OD' : 'OG';

      // Trouver la section kératométrie
      const keratometrySection = eyeContainer.querySelector('app-file-information-eye-keratometry');
      if (!keratometrySection) {
        return;
      }

      // Trouver le conteneur des champs (.fields ou app-file-form-group selon la structure)
      const fieldsContainer = keratometrySection.querySelector('.fields app-file-form-group') ||
                            keratometrySection.querySelector('app-file-form-group:last-of-type') ||
                            keratometrySection.querySelector('.form app-file-form-group:last-of-type');

      if (!fieldsContainer) {
        return;
      }

      // Identifier les champs par leur data-field ou leur ID
      const fieldMapping = {
        kFlat: fieldsContainer.querySelector('[data-field="kParameter"], [id*="kParameter"]:not([id*="steep"])')?.closest('app-store-field'),
        excFlat: fieldsContainer.querySelector('[data-field="eccentricity"], [id*="eccentricity"]:not([id*="steep"])')?.closest('app-store-field'),
        axisFlat: fieldsContainer.querySelector('[data-field="keratometryAxis"], [id*="keratometryAxis"]')?.closest('app-store-field'),
        kSteep: fieldsContainer.querySelector('[data-field="steepKParameter"], [id*="steepKParameter"]')?.closest('app-store-field'),
        excSteep: fieldsContainer.querySelector('[data-field="steepEccentricity"], [id*="steepEccentricity"]')?.closest('app-store-field'),
        div30: fieldsContainer.querySelector('[data-field="visibleIrisDiameterAt30"], [id*="visibleIrisDiameterAt30"]')?.closest('app-store-field')
      };

      // Vérifier que tous les champs sont trouvés
      const foundFields = Object.entries(fieldMapping).filter(([key, el]) => el !== null);

      if (foundFields.length === 0) {
        return;
      }

      // Ordre  : Ligne 1: K plat, K serré, Axe | Ligne 2: Exc plat, Exc serré, DIV 30
      const desiredOrder = ['kFlat', 'kSteep', 'axisFlat', 'excFlat', 'excSteep', 'div30'];

      // Créer un fragment pour réorganiser
      const fragment = document.createDocumentFragment();

      // Ajout des champs dans le nouvel ordre
      desiredOrder.forEach(fieldName => {
        const field = fieldMapping[fieldName];
        if (field) {
          fragment.appendChild(field);
        }
      });

      // Vider et remplir le conteneur
      while (fieldsContainer.firstChild) {
        fieldsContainer.removeChild(fieldsContainer.firstChild);
      }
      fieldsContainer.appendChild(fragment);

    });

    // Ajuster le style pour une meilleure présentation
    injectKeratometryStyles();
  }

  // Styles pour améliorer la présentation
  function injectKeratometryStyles() {
    if (document.getElementById('keratometry-reorder-styles')) return;

    const styles = `
      <style id="keratometry-reorder-styles">
        /* Améliorer l'espacement des champs de kératométrie */
        app-file-information-eye-keratometry .fields app-file-form-group,
        app-file-information-eye-keratometry .form > app-file-form-group:last-of-type {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 0.8rem !important;
        }

        /* LIGNE 1 : K plat, K serré, Axe */
        app-file-information-eye-keratometry [data-field="kParameter"] {
          grid-column: 1;
          grid-row: 1;
        }

        app-file-information-eye-keratometry [data-field="steepKParameter"] {
          grid-column: 2;
          grid-row: 1;
        }

        app-file-information-eye-keratometry [data-field="keratometryAxis"] {
          grid-column: 3;
          grid-row: 1;
        }

        /* LIGNE 2 : Exc plat, Exc serré, DIV 30 */
        app-file-information-eye-keratometry [data-field="eccentricity"] {
          grid-column: 1;
          grid-row: 2;
        }

        app-file-information-eye-keratometry [data-field="steepEccentricity"] {
          grid-column: 2;
          grid-row: 2;
        }

        app-file-information-eye-keratometry [data-field="visibleIrisDiameterAt30"] {
          grid-column: 3;
          grid-row: 2;
        }

        /* Couleurs douces pour différencier plat et serré */
        /* Bleu doux pour les champs "plat" */
        app-file-information-eye-keratometry [data-field="kParameter"] .amds-input,
        app-file-information-eye-keratometry [data-field="eccentricity"] .amds-input {
          background-color: rgba(59, 130, 246, 0.05) !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
        }

        app-file-information-eye-keratometry [data-field="kParameter"] .amds-input:hover,
        app-file-information-eye-keratometry [data-field="eccentricity"] .amds-input:hover {
          background-color: rgba(59, 130, 246, 0.08) !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
        }

        app-file-information-eye-keratometry [data-field="kParameter"] .amds-input:focus,
        app-file-information-eye-keratometry [data-field="eccentricity"] .amds-input:focus {
          background-color: rgba(59, 130, 246, 0.1) !important;
          border-color: rgba(59, 130, 246, 0.4) !important;
        }

        /* Rouge doux pour les champs "serré" */
        app-file-information-eye-keratometry [data-field="steepKParameter"] .amds-input,
        app-file-information-eye-keratometry [data-field="steepEccentricity"] .amds-input {
          background-color: rgba(239, 68, 68, 0.05) !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
        }

        app-file-information-eye-keratometry [data-field="steepKParameter"] .amds-input:hover,
        app-file-information-eye-keratometry [data-field="steepEccentricity"] .amds-input:hover {
          background-color: rgba(239, 68, 68, 0.08) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
        }

        app-file-information-eye-keratometry [data-field="steepKParameter"] .amds-input:focus,
        app-file-information-eye-keratometry [data-field="steepEccentricity"] .amds-input:focus {
          background-color: rgba(239, 68, 68, 0.1) !important;
          border-color: rgba(239, 68, 68, 0.4) !important;
        }

        /* Style neutre pour l'axe */
        app-file-information-eye-keratometry [data-field="keratometryAxis"] .amds-input {
          background-color: rgba(107, 114, 128, 0.05) !important;
          border: 1px solid rgba(107, 114, 128, 0.2) !important;
        }

        app-file-information-eye-keratometry [data-field="keratometryAxis"] .amds-input:hover {
          background-color: rgba(107, 114, 128, 0.08) !important;
          border-color: rgba(107, 114, 128, 0.3) !important;
        }

        app-file-information-eye-keratometry [data-field="keratometryAxis"] .amds-input:focus {
          background-color: rgba(107, 114, 128, 0.1) !important;
          border-color: rgba(107, 114, 128, 0.4) !important;
        }

        /* Style vert doux pour DIV 30 */
        app-file-information-eye-keratometry [data-field="visibleIrisDiameterAt30"] .amds-input {
          background-color: rgba(34, 197, 94, 0.05) !important;
          border: 1px solid rgba(34, 197, 94, 0.2) !important;
        }

        app-file-information-eye-keratometry [data-field="visibleIrisDiameterAt30"] .amds-input:hover {
          background-color: rgba(34, 197, 94, 0.08) !important;
          border-color: rgba(34, 197, 94, 0.3) !important;
        }

        app-file-information-eye-keratometry [data-field="visibleIrisDiameterAt30"] .amds-input:focus {
          background-color: rgba(34, 197, 94, 0.1) !important;
          border-color: rgba(34, 197, 94, 0.4) !important;
        }

        /* Améliorer la lisibilité des labels */
        app-file-information-eye-keratometry .amds-form-element label {
          font-weight: 500;
        }

        /* Transition douce sur tous les inputs */
        app-file-information-eye-keratometry .amds-input {
          transition: all 0.2s ease;
        }

        /* S'assurer que les inputs ont la même hauteur */
        app-file-information-eye-keratometry .amds-input input {
          height: 38px;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  // Fonction de raccourcis clavier
  function setupKeyboardShortcuts() {

    document.addEventListener('keydown', async (event) => {
      // F1 - Coller réfraction depuis le presse-papier
        if (event.key === 'F2') {
        event.preventDefault();
        event.stopPropagation();

        // Vérifier qu'on est sur une page avec les champs
        const odSphere = document.querySelector('#input-rightsphere');
        const ogSphere = document.querySelector('#input-leftsphere');

        if (odSphere && ogSphere) {
          duplicateODtoOG();
        } else {
          showToast('Champs de réfraction non disponibles');
        }
      }

      // F3 - Calcul OrthoK
      else if (event.key === 'F3') {
        event.preventDefault();
        event.stopPropagation();
        await performOrthoKCalculation();
      }

      // F4 - Calcul LRPG
      else if (event.key === 'F4') {
        event.preventDefault();
        event.stopPropagation();
        await performLRPGCalculation();
      }

    }, true); // Capture phase pour intercepter avant tout autre handler

    }

  // Fonction pour capturer et mémoriser les données de réfraction/kératométrie
  function captureRefractionData() {

    const data = {
      od: {
        sphere: null,
        cylinder: null,
        axis: null,
        kerato: {
          kFlat: null,
          kSteep: null,
          axisFlat: null
        }
      },
      og: {
        sphere: null,
        cylinder: null,
        axis: null,
        kerato: {
          kFlat: null,
          kSteep: null,
          axisFlat: null
        }
      }
    };

    // Capturer les valeurs de réfraction OD
    const odSphere = document.querySelector('#input-rightsphere');
    const odCylinder = document.querySelector('#input-rightcylinder');
    const odAxis = document.querySelector('#input-rightrefractionAxis');

    if (odSphere && odSphere.value) data.od.sphere = odSphere.value;
    if (odCylinder && odCylinder.value) data.od.cylinder = odCylinder.value;
    if (odAxis && odAxis.value) data.od.axis = odAxis.value;

    // Capturer les valeurs de kératométrie OD
    const odKFlat = document.querySelector('#input-rightkParameter');
    const odKSteep = document.querySelector('#input-rightsteepKParameter');
    const odAxisFlat = document.querySelector('#input-rightkeratometryAxis');

    if (odKFlat && odKFlat.value) data.od.kerato.kFlat = odKFlat.value;
    if (odKSteep && odKSteep.value) data.od.kerato.kSteep = odKSteep.value;
    if (odAxisFlat && odAxisFlat.value) data.od.kerato.axisFlat = odAxisFlat.value;

    // Capturer les valeurs de réfraction OG
    const ogSphere = document.querySelector('#input-leftsphere');
    const ogCylinder = document.querySelector('#input-leftcylinder');
    const ogAxis = document.querySelector('#input-leftrefractionAxis');

    if (ogSphere && ogSphere.value) data.og.sphere = ogSphere.value;
    if (ogCylinder && ogCylinder.value) data.og.cylinder = ogCylinder.value;
    if (ogAxis && ogAxis.value) data.og.axis = ogAxis.value;

    // Capturer les valeurs de kératométrie OG
    const ogKFlat = document.querySelector('#input-leftkParameter');
    const ogKSteep = document.querySelector('#input-leftsteepKParameter');
    const ogAxisFlat = document.querySelector('#input-leftkeratometryAxis');

    if (ogKFlat && ogKFlat.value) data.og.kerato.kFlat = ogKFlat.value;
    if (ogKSteep && ogKSteep.value) data.og.kerato.kSteep = ogKSteep.value;
    if (ogAxisFlat && ogAxisFlat.value) data.og.kerato.axisFlat = ogAxisFlat.value;

    // Stocker dans sessionStorage
    sessionStorage.setItem('clickfit_refraction_data', JSON.stringify(data));

    return data;
  }

  // Injecte un mini bouton rond bleu avec flèche à côté de l'entête réfraction de OD, pour déclencher duplicateODtoOG()
  function injectRefractionDuplicateButton() {
    try {
      const selector = 'app-file-information-eye:nth-child(1) app-file-information-eye-refraction app-accordion .header';
      const headerEl = document.querySelector(selector);

      if (!headerEl) {
        return;
      }

      if (headerEl.querySelector('.cf-dup-refraction-btn')) return;

      // Création outon rond bleu avec flèche blanche
      const btn = document.createElement('button');
      btn.className = 'cf-dup-refraction-btn';
      btn.title = 'Dupliquer OD → OG (F2)';
      btn.type = 'button';
      btn.style.cssText = `
        margin-left: 8px;
        cursor: pointer;
        background: #1e4b92;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;

      // Flèche blanche vers la droite
      btn.innerHTML = '<span style="color: white; font-size: 12px; font-weight: bold;">→</span>';

      // Effet hover
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof duplicateODtoOG === 'function') {
          duplicateODtoOG();
        }
      });

      // Insérer à la fin de l'entête
      headerEl.appendChild(btn);

      // Observer les changements du DOM pour réinjecter si la section est rerendue
      if (!window.__cfDupRefractionObserver) {
        ObserverManager.createObserver(
          'refractionDuplicateButtonReinject',
          () => {
            setTimeout(() => {
              const missing = document.querySelector(selector);
              if (missing && !missing.querySelector('.cf-dup-refraction-btn')) {
                injectRefractionDuplicateButton();
              }
            }, 500);
          },
          document.body,
          { childList: true, subtree: true },
          false // non-persistent: spécifique à la page courante
        );
        window.__cfDupRefractionObserver = true;
      }
    } catch (e) {
    }
  }

  // Fonction pour afficher les données sur la page des lentilles avec encadré et légende
  function displayRefractionOnLensPage() {
    // Récupérer les données depuis sessionStorage
    const storedData = sessionStorage.getItem('clickfit_refraction_data');
    if (!storedData) {
      return;
    }

    const data = JSON.parse(storedData);

    // Chercher les divs contenant "Œil droit" et "Œil gauche"
    const findEyeContainers = () => {
      // Chercher par classe spécifique
      const allDivs = document.querySelectorAll('div.amds-text.amds-font-headline-h6.amds-color-basic-900');

      let odContainer = null;
      let ogContainer = null;

      for (let div of allDivs) {
        // Nettoyage du texte
        const text = div.textContent.replace(/\s+/g, ' ').trim();

        if (text === 'Œil droit' || text === 'Oeil droit') {
          odContainer = div;
        } else if (text === 'Œil gauche' || text === 'Oeil gauche') {
          ogContainer = div;
        }
      }
      return { odContainer, ogContainer };
    };

    const { odContainer, ogContainer } = findEyeContainers();

    // Fonction pour créer un encadré formaté avec légende (version horizontale)
    const createInfoBox = (data, eye) => {
      const eyeData = eye === 'od' ? data.od : data.og;
      const isOD = eye === 'od';

      // Couleurs différenciées OD (violet) / OG (bleu)
      const colors = isOD ? {
        background: '#faf8ff',  // Violet très clair
        border: '#d4c5e8',      // Bordure violet doux
        shadow: 'rgba(146, 75, 146, 0.08)',  // Ombre violette douce
        textPrimary: '#4a1e7c', // Texte violet foncé
        textSecondary: '#6c4a8d', // Violet moyen pour les labels
        separator: '#e4d5f0'    // Séparateur violet clair
      } : {
        background: '#f8fbff',  // Bleu clair (actuel pour OG)
        border: '#d0d7e5',      // Bordure bleue
        shadow: 'rgba(30, 75, 146, 0.08)',  // Ombre bleue
        textPrimary: '#1a3d7c', // Texte bleu foncé
        textSecondary: '#1e4b92', // Bleu moyen pour les labels
        separator: '#d0d7e5'    // Séparateur bleu clair
      };

      // Formater la réfraction
      let refractionText = '';
      if (eyeData.sphere || eyeData.cylinder) {
        // Sphère
        if (eyeData.sphere) {
          const sphere = parseFloat(eyeData.sphere);
          refractionText += sphere > 0 ? '+' : '';
          refractionText += sphere.toFixed(2).replace('.', ',');
        } else {
          refractionText += 'Plan';
        }

        // Cylindre et axe
        if (eyeData.cylinder && parseFloat(eyeData.cylinder) !== 0) {
          const cylinder = parseFloat(eyeData.cylinder);
          refractionText += ' (';
          refractionText += cylinder > 0 ? '+' : '';
          refractionText += cylinder.toFixed(2).replace('.', ',');
          refractionText += ')';

          if (eyeData.axis) {
            refractionText += ' ' + parseInt(eyeData.axis) + '°';
          }
        }
      } else {
        refractionText = 'Non renseignée';
      }

      // Formater la kératométrie
      let keratoText = '';
      if (eyeData.kerato.kFlat && eyeData.kerato.kSteep) {
        keratoText = eyeData.kerato.kFlat.replace('.', ',') + ' × ' + eyeData.kerato.kSteep.replace('.', ',');
        if (eyeData.kerato.axisFlat) {
          keratoText += ' @ ' + eyeData.kerato.axisFlat + '°';
        }
      } else {
        keratoText = 'Non renseignée';
      }

      // Créer l'élément encadré
      const infoBox = document.createElement('div');
      infoBox.className = `refraction-info refraction-info-${eye}`;
      infoBox.style.cssText = `
        border: 1px solid ${colors.border};
        border-radius: 6px;
        padding: 10px 14px;
        margin: 8px 15px 8px 0;
        background-color: ${colors.background};
        box-shadow: 0 1px 3px ${colors.shadow};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 700px;
      `;

      infoBox.innerHTML = `
        <div style="
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <span>📋</span>
          <span>Données initiales</span>
        </div>

        <div style="
          color: ${colors.textSecondary};
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        ">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-weight: 500;">Réfraction :</span>
            <span style="font-weight: 600; color: ${colors.textPrimary};">${refractionText}</span>
          </div>

          <span style="color: ${colors.separator}; font-weight: 300;">|</span>

          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-weight: 500;">Kératométrie :</span>
            <span style="font-weight: 600; color: ${colors.textPrimary};">${keratoText}</span>
          </div>
        </div>
      `;

      return infoBox;
    };

    // Ajouter les informations pour OD
    if (odContainer) {
      // Chercher si l'info existe déjà dans le parent ou à côté
      const parent = odContainer.parentElement;
      let existingInfo = null;

      // Chercher plus largement dans le parent du parent
      const grandParent = parent ? parent.parentElement : null;
      if (grandParent) {
        existingInfo = grandParent.querySelector('.refraction-info-od');
      }

      if (!existingInfo) {
        const odInfoBox = createInfoBox(data, 'od');

        // Insérer après le parent du titre pour que ce soit bien en dessous
        if (parent && parent.parentElement) {
          parent.parentElement.insertBefore(odInfoBox, parent.nextSibling);
        } else if (odContainer.nextSibling) {
          odContainer.parentNode.insertBefore(odInfoBox, odContainer.nextSibling);
        } else {
          odContainer.appendChild(odInfoBox);
        }

      } else {
        // Remplacer complètement l'info existante
        const newInfoBox = createInfoBox(data, 'od');
        existingInfo.replaceWith(newInfoBox);
      }
    } else {
    }

    // Ajouter les informations pour OG
    if (ogContainer) {
      // Chercher si l'info existe déjà dans le parent ou à côté
      const parent = ogContainer.parentElement;
      let existingInfo = null;

      // Chercher plus largement dans le parent du parent
      const grandParent = parent ? parent.parentElement : null;
      if (grandParent) {
        existingInfo = grandParent.querySelector('.refraction-info-og');
      }

      if (!existingInfo) {
        const ogInfoBox = createInfoBox(data, 'og');

        // Insérer après le parent du titre pour que ce soit bien en dessous
        if (parent && parent.parentElement) {
          parent.parentElement.insertBefore(ogInfoBox, parent.nextSibling);
        } else if (ogContainer.nextSibling) {
          ogContainer.parentNode.insertBefore(ogInfoBox, ogContainer.nextSibling);
        } else {
          ogContainer.appendChild(ogInfoBox);
        }

      } else {
        // Remplacer complètement l'info existante
        const newInfoBox = createInfoBox(data, 'og');
        existingInfo.replaceWith(newInfoBox);
      }
    } else {
    }
  }

  function setupRefractionPolling() {
  window.captureRefractionData = captureRefractionData;
  window.displayRefractionOnLensPage = displayRefractionOnLensPage;

  // Reset à chaque changement de fiche patient (via l'URL) avec ObserverManager
  let lastPatientId = null;
  ObserverManager.createInterval(
    'refractionDataPatientReset',
    () => {
      const match = location.pathname.match(/\/file\/([A-Za-z0-9]+)/);
      const patientId = match ? match[1] : null;
      if (patientId !== lastPatientId) {
        sessionStorage.removeItem('clickfit_refraction_data');
        lastPatientId = patientId;
      }
    },
    500,
    true // persistent: surveille les changements de patient globalement
  );

  // Polling toutes les 500ms sur la page info patient pour capture avec ObserverManager
  ObserverManager.createInterval(
    'refractionDataCapture',
    () => {
      // Teste la présence de TOUS les champs nécessaires (OD + OG)
      const odSphere = document.querySelector('#input-rightsphere');
      const odCyl = document.querySelector('#input-rightcylinder');
      const odAxis = document.querySelector('#input-rightrefractionAxis');
      const ogSphere = document.querySelector('#input-leftsphere');
      const ogCyl = document.querySelector('#input-leftcylinder');
      const ogAxis = document.querySelector('#input-leftrefractionAxis');

      if (odSphere && odCyl && odAxis && ogSphere && ogCyl && ogAxis) {

        const hasAnyValue = [odSphere.value, odCyl.value, odAxis.value, ogSphere.value, ogCyl.value, ogAxis.value]
          .some(val => val && val.trim() !== '');

        if (hasAnyValue) {
          // Capture et sauvegarde si changement
          const data = captureRefractionData();
          const oldData = sessionStorage.getItem('clickfit_refraction_data');
          if (JSON.stringify(data) !== oldData) {
            sessionStorage.setItem('clickfit_refraction_data', JSON.stringify(data));
          }
        }
      }
    },
    500,
    true // persistent: capture les données sur toutes les pages patient
  );

  // Affichage automatique sur la page lentilles avec ObserverManager
  ObserverManager.createInterval(
    'refractionDataDisplayOnLensPage',
    () => {
      if (typeof window.displayRefractionOnLensPage === 'function') {
        window.displayRefractionOnLensPage();
      }
    },
    1500,
    true // persistent: affichage sur toutes les pages lentilles
  );
  }

  function fixLensPageAutoSaveAndTab() {

    // Variables globales pour le module
    let currentFocusedElement = null;
    let shouldMaintainFocus = false;
    let focusProtectionActive = false;

    // Fonction pour détecter si on est sur la page lentilles
    function isLensPage() {
      const indicators = [
        document.querySelector('.tab.lens-0-tab.active'),
        document.querySelector('app-file-first-lens'),
        document.querySelector('#input-righttype'),
        document.querySelector('.lenses')
      ];
      return indicators.some(el => el !== null);
    }

    if (!isLensPage()) {
      return;
    }

    // Éviter la double activation
    if (window.lensAutoSaveFixActive) {
      return;
    }

    window.lensAutoSaveFixActive = true;

    // ========================================
    // PARTIE 1: NEUTRALISATION DE L'AUTO-SAVE
    // ========================================

    // Intercepter et bloquer les blur causés par l'auto-save
    function protectFocus() {
      if (focusProtectionActive) return;
      focusProtectionActive = true;

      // Sauvegarder les méthodes originales
      const originalBlur = HTMLElement.prototype.blur;
      const originalFocus = HTMLElement.prototype.focus;

      // Override de blur pour empêcher le défocus non désiré
      HTMLElement.prototype.blur = function() {
        try {
          // Si on est dans un input de la page lentilles et qu'on veut maintenir le focus
          if (shouldMaintainFocus && this === currentFocusedElement) {
            // Ne pas exécuter le blur
            return;
          }
          // Sinon, exécuter normalement
          return originalBlur.apply(this, arguments);
        } catch (error) {
          return originalBlur.apply(this, arguments);
        }
      };

      // Intercepter les événements blur au niveau document
      document.addEventListener('blur', function(e) {
        try {
          if (!shouldMaintainFocus) return;

          const target = e.target;

          // Vérifier si c'est un input de la page lentilles
          if (target && target === currentFocusedElement &&
              (target.tagName === 'INPUT' || target.tagName === 'SELECT')) {

            // Vérifier si le nouveau focus est sur un autre élément interactif
            setTimeout(() => {
              const newFocus = document.activeElement;

              // Si l'utilisateur a cliqué sur autre chose (bouton, lien, autre input), désactiver la protection
              if (newFocus && newFocus !== target &&
                  (newFocus.tagName === 'BUTTON' ||
                   newFocus.tagName === 'A' ||
                   newFocus.tagName === 'INPUT' ||
                   newFocus.tagName === 'SELECT' ||
                   newFocus.closest('button') ||
                   newFocus.closest('[role="button"]'))) {

                shouldMaintainFocus = false;
                currentFocusedElement = null;
                return;
              }

              // Sinon, restaurer le focus comme avant
              if (currentFocusedElement && currentFocusedElement !== document.activeElement) {

                // Restaurer le focus immédiatement
                currentFocusedElement.focus();

                // Pour les inputs numériques, resélectionner le contenu
                if (currentFocusedElement.type === 'number' || currentFocusedElement.type === 'text') {
                  currentFocusedElement.select();
                }
              }
            }, 50); // Petit délai pour laisser le nouveau focus se stabiliser
          }
        } catch (error) {
        }
      }, true); // Capture phase

      // Détecter les clics sur des éléments non-interactifs pour désactiver la protection
      document.addEventListener('click', function(e) {
        try {
          const target = e.target;

          // Si l'utilisateur clique sur du texte, une div, ou autre élément non-interactif
          if (shouldMaintainFocus && currentFocusedElement &&
              (target.tagName === 'DIV' ||
               target.tagName === 'SPAN' ||
               target.tagName === 'P' ||
               target.tagName === 'H1' ||
               target.tagName === 'H2' ||
               target.tagName === 'H3' ||
               target.tagName === 'BODY' ||
               target.tagName === 'MAIN' ||
               target.closest('.content') ||
               target.closest('.container'))) {

            shouldMaintainFocus = false;
            currentFocusedElement = null;
          }
        } catch (error) {
        }
      }, false);

      // Exception pour les modals - désactiver la protection lors des clics sur boutons
      document.addEventListener('click', function(e) {
        try {
          const target = e.target;

          // Si c'est un bouton qui peut ouvrir un modal, désactiver temporairement la protection
          if (target.tagName === 'BUTTON' ||
              target.closest('button') ||
              target.closest('[role="button"]') ||
              target.textContent?.includes('Commencer') ||
              target.textContent?.includes('commencer')) {

            shouldMaintainFocus = false;

            setTimeout(() => {
              try {
              } catch (error) {
              }
            }, 2000);
          }
        } catch (error) {
        }
      }, false);

      // Observer les modals qui s'ouvrent pour désactiver complètement la protection avec ObserverManager
      ObserverManager.createObserver(
        'lensFocusProtectionModalDetection',
        (mutations) => {
          try {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  // Détecter l'ouverture d'un modal
                  if (node.classList?.contains('modal') ||
                      node.querySelector?.('.modal') ||
                      node.classList?.contains('overlay') ||
                      node.querySelector?.('.overlay')) {

                    shouldMaintainFocus = false;
                    focusProtectionActive = false;

                    // Ne pas réactiver automatiquement après fermeture du modal
                    // L'utilisateur doit cliquer manuellement pour réactiver la protection
                  }
                }
              });
            });
          } catch (error) {
          }
        },
        document.body,
        {
          childList: true,
          subtree: true
        },
        false // non-persistent: spécifique au contexte de la page lentilles
      );

    }

    // Tracker le focus actuel
    function trackFocus() {
      document.addEventListener('focusin', function(e) {
        const target = e.target;

        // Si c'est un input/select de la page lentilles
        if (isLensPage() &&
            (target.tagName === 'INPUT' || target.tagName === 'SELECT')) {

          currentFocusedElement = target;
          shouldMaintainFocus = true;

          // Désactiver la protection après un délai (pour permettre la navigation normale)
          clearTimeout(window.focusProtectionTimeout);
          window.focusProtectionTimeout = setTimeout(() => {
            shouldMaintainFocus = false;
          }, 5000); // 5 secondes de protection
        }
      }, true);

      // Réactiver la protection sur input
      document.addEventListener('input', function(e) {
        if (isLensPage() && e.target === currentFocusedElement) {
          shouldMaintainFocus = true;
          clearTimeout(window.focusProtectionTimeout);
          window.focusProtectionTimeout = setTimeout(() => {
            shouldMaintainFocus = false;
          }, 2000);
        }
      }, true);
    }

    // ========================================
    // PARTIE 2: AMÉLIORATION DE LA NAVIGATION TAB
    // ========================================

    function enhanceTabNavigation() {
      document.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab' || !isLensPage()) return;

        const activeElement = document.activeElement;
        if (!activeElement || activeElement.tagName === 'BODY') return;

        shouldMaintainFocus = false;

        const allInputs = getAllNavigableElements();
        const currentIndex = allInputs.indexOf(activeElement);
        if (currentIndex === -1) return;

        e.preventDefault();
        e.stopPropagation();

        // Calculer l'index suivant
        let nextIndex;
        if (e.shiftKey) {
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) nextIndex = allInputs.length - 1;
        } else {
          nextIndex = currentIndex + 1;
          if (nextIndex >= allInputs.length) nextIndex = 0;
        }

        // Naviguer vers le prochain élément
        const nextElement = allInputs[nextIndex];
        if (nextElement) {

          // Désactiver temporairement la protection
          shouldMaintainFocus = false;

          setTimeout(() => {
            nextElement.focus();

            // Réactiver la protection sur le nouvel élément
            currentFocusedElement = nextElement;
            shouldMaintainFocus = true;

            // Sélectionner le contenu pour les inputs
            if (nextElement.tagName === 'INPUT' &&
                (nextElement.type === 'text' || nextElement.type === 'number')) {
              nextElement.select();
            }

            // Protection pendant 3 secondes
            clearTimeout(window.focusProtectionTimeout);
            window.focusProtectionTimeout = setTimeout(() => {
              shouldMaintainFocus = false;
            }, 3000);
          }, 10);
        }
      }, true);
    }

    // Obtenir tous les éléments navigables dans l'ordre
    function getAllNavigableElements() {
      const allElements = [];

      // IMPORTANT: D'abord TOUS les inputs OD, puis TOUS les inputs OG

      // 1. Récupérer TOUS les inputs OD (pas les selects)
      const odContainer = document.querySelector('app-file-first-lens:nth-child(1)');
      if (odContainer) {
        const odInputs = odContainer.querySelectorAll(`
          input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([disabled]):not([readonly])
        `);

        const visibleOdInputs = [];
        odInputs.forEach(input => {
          if (input.offsetParent !== null && input.tabIndex !== -1) {
            visibleOdInputs.push(input);
          }
        });

        // Trier par position verticale puis horizontale
        visibleOdInputs.sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();

          // D'abord par position verticale
          if (Math.abs(rectA.top - rectB.top) > 10) {
            return rectA.top - rectB.top;
          }
          // Puis par position horizontale
          return rectA.left - rectB.left;
        });

        allElements.push(...visibleOdInputs);

        // Log pour debug
        visibleOdInputs.forEach((el, index) => {
          const label = el.getAttribute('aria-label') || el.id || el.placeholder || 'inconnu';
        });
      }

      // 2. Récupérer TOUS les inputs OG (pas les selects)
      const ogContainer = document.querySelector('app-file-first-lens:nth-child(2)');
      if (ogContainer) {
        const ogInputs = ogContainer.querySelectorAll(`
          input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([disabled]):not([readonly])
        `);

        const visibleOgInputs = [];
        ogInputs.forEach(input => {
          if (input.offsetParent !== null && input.tabIndex !== -1) {
            visibleOgInputs.push(input);
          }
        });

        // Trier par position verticale puis horizontale
        visibleOgInputs.sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();

          // D'abord par position verticale
          if (Math.abs(rectA.top - rectB.top) > 10) {
            return rectA.top - rectB.top;
          }
          // Puis par position horizontale
          return rectA.left - rectB.left;
        });

        allElements.push(...visibleOgInputs);

        // Log pour debug
        visibleOgInputs.forEach((el, index) => {
          const label = el.getAttribute('aria-label') || el.id || el.placeholder || 'inconnu';
        });
      }

      return allElements;
    }

    // ========================================
    // PARTIE 3: INTERCEPTION DES SAVES ANGULAR
    // ========================================

    function interceptAngularSaves() {
      // Intercepter les requêtes XHR pour détecter les saves
      const originalXHRSend = XMLHttpRequest.prototype.send;

      XMLHttpRequest.prototype.send = function() {
        // Si c'est une requête de save sur la page lentilles
        if (this.responseURL && this.responseURL.includes('/api/') && isLensPage()) {

          // Sauvegarder l'élément actuellement focus
          const elementToRestore = currentFocusedElement;

          this.addEventListener('loadend', function() {
            // Après la requête, restaurer le focus
            if (elementToRestore && shouldMaintainFocus) {
              setTimeout(() => {
                if (elementToRestore !== document.activeElement) {
                  elementToRestore.focus();
                  if (elementToRestore.type === 'number' || elementToRestore.type === 'text') {
                    elementToRestore.select();
                  }
                }
              }, 100);
            }
          });
        }

        return originalXHRSend.apply(this, arguments);
      };
    }

    // ========================================
    // PARTIE 4: OBSERVER POUR RÉACTIVATION
    // ========================================

    function observePageChanges() {
      ObserverManager.createObserver(
        'lensPageActivationDetection',
        () => {
          // Vérifier si on a changé de page
          if (!isLensPage() && window.lensAutoSaveFixActive) {
            window.lensAutoSaveFixActive = false;
            shouldMaintainFocus = false;
            currentFocusedElement = null;
          } else if (isLensPage() && !window.lensAutoSaveFixActive) {
            fixLensPageAutoSaveAndTab();
          }
        },
        document.body,
        {
          childList: true,
          subtree: true
        },
        false // non-persistent: spécifique au contexte lentilles
      );
    }

    // ========================================
    // INITIALISATION
    // ========================================

    protectFocus();
    trackFocus();
    enhanceTabNavigation();
    interceptAngularSaves();
    observePageChanges();

  }
  // Vérifier et activer toutes les secondes avec ObserverManager
  ObserverManager.createInterval(
    'lensTabActivationCheck',
    () => {
      const lensTab = document.querySelector('.tab.lens-0-tab.active');
      if (lensTab && !window.lensAutoSaveFixActive) {
        fixLensPageAutoSaveAndTab();
      }
    },
    1000,
    true // persistent: vérification globale pour activer le fix lentilles
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(fixLensPageAutoSaveAndTab, 1000);
    });
  } else {
    setTimeout(fixLensPageAutoSaveAndTab, 1000);
  }

  // Moduile video explicative
  const VideoExplanationModule = {
    // Configuration des vidéos par modèle
    videos: {
      'expert prog': {
        url: 'https://www.youtube.com/embed/P9Kmm2fg6wk?si=YTkBsPOXq50fzJAI',
        title: 'Guide Expert Prog'
      }
      // Ajout d'autres modèles/vidéos ici si besoin
    },

    // État du module
    currentButtons: new Map(),
    modalOpen: false,

    // Initialisation
    init() {
      this.injectStyles();
      this.setupObservers();
      this.checkExistingSelects();
    },

    // Injection des styles CSS
    injectStyles() {
      if (document.getElementById('video-explanation-styles')) return;

      const styles = `
        /* Bouton vidéo */
        .video-help-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 12px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #1e4b92 0%, #245aa8 100%);
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          vertical-align: middle;
        }

        .video-help-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .video-help-button.pulse {
          animation: pulse-video 2s infinite;
        }

        @keyframes pulse-video {
          0% { box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 2px 16px rgba(102, 126, 234, 0.6); }
          100% { box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
        }

        /* Modal vidéo */
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100000;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .video-modal-overlay.show {
          opacity: 1;
        }

        .video-modal-container {
          position: relative;
          width: 90%;
          max-width: 900px;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }

        .video-modal-overlay.show .video-modal-container {
          transform: scale(1);
        }

        .video-modal-header {
          background: linear-gradient(135deg, #1e4b92 0%, #245aa8 100%);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .video-modal-title {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .video-modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }

        .video-modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .video-modal-body {
          position: relative;
          padding-bottom: 56.25%; /* Ratio 16:9 */
          height: 0;
          background: #000;
        }

        .video-modal-body iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `;

      const styleEl = document.createElement('style');
      styleEl.id = 'video-explanation-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    },

    // Vérifier si un modèle nécessite une vidéo
    needsVideo(modelText) {
      if (!modelText) return null;

      const lowerText = modelText.toLowerCase();

      // Chercher dans la config des vidéos
      for (const [key, videoData] of Object.entries(this.videos)) {
        if (lowerText.includes(key)) {
          return videoData;
        }
      }

      return null;
    },

    // Créer le bouton vidéo
    createVideoButton(videoData) {
      const button = document.createElement('button');
      button.className = 'video-help-button pulse';
      button.innerHTML = `
        <span>📹</span>
        <span>Aide vidéo</span>
      `;

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openVideoModal(videoData);
        button.classList.remove('pulse');
      });

      return button;
    },

    // Ouvrir le modal vidéo
    openVideoModal(videoData) {
      if (this.modalOpen) return;

      this.modalOpen = true;

      // Créer l'overlay et le modal
      const overlay = document.createElement('div');
      overlay.className = 'video-modal-overlay';

      overlay.innerHTML = `
        <div class="video-modal-container">
          <div class="video-modal-header">
            <h3 class="video-modal-title">${videoData.title}</h3>
            <button class="video-modal-close">×</button>
          </div>
          <div class="video-modal-body">
            <iframe
              src="${videoData.url}"
              title="${videoData.title}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Animation d'ouverture
      setTimeout(() => overlay.classList.add('show'), 10);

      // Fermeture
      const closeModal = () => {
        overlay.classList.remove('show');
        setTimeout(() => {
          overlay.remove();
          this.modalOpen = false;
        }, 300);
      };

      // Event listeners pour fermer
      overlay.querySelector('.video-modal-close').addEventListener('click', closeModal);

      // Fermer en cliquant en dehors
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });

      // Fermer avec Echap
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);

    },

    // Gérer l'ajout/suppression du bouton
    handleSelectChange(selectElement) {
      const selectId = selectElement.id;
      const selectedOption = selectElement.options[selectElement.selectedIndex];
      const modelText = selectedOption ? selectedOption.textContent : '';

      // Retirer l'ancien bouton s'il existe
      const existingButton = this.currentButtons.get(selectId);
      if (existingButton) {
        existingButton.remove();
        this.currentButtons.delete(selectId);
      }

      // Vérifier si on doit ajouter un bouton
      const videoData = this.needsVideo(modelText);
      if (videoData) {
        // Créer et ajouter le nouveau bouton
        const button = this.createVideoButton(videoData);

        // Trouver où insérer le bouton (après le select ou son conteneur)
        const container = selectElement.closest('.amds-form-element') ||
                        selectElement.closest('.form-group') ||
                        selectElement.parentElement;

        if (container) {
          container.appendChild(button);
          this.currentButtons.set(selectId, button);

          // Retirer l'animation après 5 secondes
          setTimeout(() => button.classList.remove('pulse'), 5000);
        }
      }
    },

    // Observer les changements sur les selects
    setupObservers() {
      // Observer les changements de valeur
      const observeSelect = (selectId) => {
        const select = document.querySelector(selectId);
        if (select && !select.dataset.videoObserved) {
          select.dataset.videoObserved = 'true';

          // Écouter les changements
          select.addEventListener('change', () => {
            this.handleSelectChange(select);
          });

          // Vérification initiale
          this.handleSelectChange(select);
        }
      };

      // Observer les deux selects avec ObserverManager
      ObserverManager.createInterval(
        'lensModelSelectObserver',
        () => {
          observeSelect('#input-rightmodel');
          observeSelect('#input-leftmodel');
        },
        1000,
        false // non-persistent: spécifique à la page lentilles courante
      );
    },

    // Vérifier les selects existants au chargement
    checkExistingSelects() {
      setTimeout(() => {
        const rightSelect = document.querySelector('#input-rightmodel');
        const leftSelect = document.querySelector('#input-leftmodel');

        if (rightSelect) this.handleSelectChange(rightSelect);
        if (leftSelect) this.handleSelectChange(leftSelect);
      }, 2000);
    }
  };

  // Barre d'espace pour navigation "Suivant"
  function setupSpaceNext() {

      document.addEventListener('keydown', (e) => {
        // Si c'est la barre espace
        if (e.key === ' ' || e.code === 'Space') {

          // Si on est dans un input, on ne fait rien
          if (document.activeElement.tagName === 'INPUT' ||
              document.activeElement.tagName === 'TEXTAREA') {
            return;
          }

          // Chercher le bouton suivant
          const nextButton = document.querySelector('#input-nextstep > button');

          if (nextButton) {
            e.preventDefault(); // Empêcher le scroll
            nextButton.click();
          }
        }
      });
  }

  // Système de fix pour la navigation tab avec auto-save
  function fixTabNavigationWithAutoSave() {
    // Variables pour tracker le focus
    let lastFocusedElement = null;
    let lastFocusedSelector = null;
    let isAutoSaving = false;
    let tabQueue = [];

    const fieldsOrder = [
      // Réfraction OD
      '#input-rightsphere',
      '#input-rightcylinder',
      '#input-rightrefractionAxis',
      '#input-rightaddition',
      // Réfraction OG
      '#input-leftsphere',
      '#input-leftcylinder',
      '#input-leftrefractionAxis',
      '#input-leftaddition',
      // Kératométrie OD
      '#input-rightkParameter',
      '#input-rightsteepKParameter',
      '#input-rightkeratometryAxis',
      '#input-righteccentricity',
      '#input-rightsteepEccentricity',
      '#input-rightvisibleIrisDiameterAt30',
      // Kératométrie OG
      '#input-leftkParameter',
      '#input-leftsteepKParameter',
      '#input-leftkeratometryAxis',
      '#input-lefteccentricity',
      '#input-leftsteepEccentricity',
      '#input-leftvisibleIrisDiameterAt30'
    ];

    // Vérifier si on est sur la page information
    function isOnInformationPage() {
      return !!document.querySelector('#wrapper > main > app-file-layout > div > app-file-tab-information');
    }

    // Vérifier si on est sur la page first-lens
    function isOnFirstLensPage() {
      return !!document.querySelector('#wrapper > main > app-file-layout > div > app-file-tab-first-lens');
    }

    // Fonctions helper existantes
    function getElementSelector(element) {
      if (element.id) return `#${element.id}`;
      let selector = element.tagName.toLowerCase();
      if (element.className) {
        selector += '.' + element.className.split(' ').join('.');
      }
      const siblings = element.parentElement?.querySelectorAll(selector);
      if (siblings && siblings.length > 1) {
        const index = Array.from(siblings).indexOf(element);
        selector += `:nth-of-type(${index + 1})`;
      }
      return selector;
    }

    function saveCurrentFocus() {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        lastFocusedElement = activeElement;
        lastFocusedSelector = getElementSelector(activeElement);
        if (activeElement.selectionStart !== undefined) {
          lastFocusedElement.dataset.lastCursorPos = activeElement.selectionStart;
        }
      }
    }

    function restoreFocus() {
      if (lastFocusedSelector) {
        const element = document.querySelector(lastFocusedSelector);
        if (element && element !== document.activeElement) {
          setTimeout(() => {
            element.focus();
            if (element.dataset.lastCursorPos) {
              const pos = parseInt(element.dataset.lastCursorPos);
              element.setSelectionRange(pos, pos);
              delete element.dataset.lastCursorPos;
            }
          }, 50);
        }
      }
    }

    // Override de la navigation Tab
    function overrideTabNavigation() {
      document.addEventListener('keydown', (e) => {
        // Vérifier qu'on est sur la page information
        if (isOnFirstLensPage()) {
          // Sur la page first-lens, ne PAS intercepter Tab
          return;
        }

        if (!isOnInformationPage()) {
          // Si on n'est pas sur la page information, ne rien faire
          return;
        }

        // Ne traiter que Tab sans Shift (navigation avant)
        if (e.key === 'Tab' && !e.shiftKey) {
          const activeElement = document.activeElement;

          // Vérifier si on est dans un champ de notre liste
          const currentIndex = fieldsOrder.findIndex(selector =>
            activeElement === document.querySelector(selector)
          );

          if (currentIndex !== -1) {
            // On est dans un champ géré
            e.preventDefault();
            e.stopPropagation();

            saveCurrentFocus();

            // Trouver le prochain champ
            let nextIndex = currentIndex + 1;
            let nextElement = null;

            // Chercher le prochain élément disponible
            while (nextIndex < fieldsOrder.length && !nextElement) {
              nextElement = document.querySelector(fieldsOrder[nextIndex]);
              if (!nextElement || nextElement.disabled || nextElement.readOnly) {
                nextElement = null;
                nextIndex++;
              }
            }

            // Si on est à la fin, boucler au début
            if (!nextElement && nextIndex >= fieldsOrder.length) {
              nextIndex = 0;
              while (nextIndex < currentIndex && !nextElement) {
                nextElement = document.querySelector(fieldsOrder[nextIndex]);
                if (!nextElement || nextElement.disabled || nextElement.readOnly) {
                  nextElement = null;
                  nextIndex++;
                }
              }
            }

            if (nextElement) {
              setTimeout(() => {
                nextElement.focus();
                nextElement.select();
              }, isAutoSaving ? 100 : 0);
            }
          }
        }
        // Gérer aussi Shift+Tab (navigation arrière)
        else if (e.key === 'Tab' && e.shiftKey) {
          // Même vérification pour Shift+Tab
          if (isOnFirstLensPage() || !isOnInformationPage()) {
            return;
          }

          const activeElement = document.activeElement;
          const currentIndex = fieldsOrder.findIndex(selector =>
            activeElement === document.querySelector(selector)
          );

          if (currentIndex !== -1) {
            e.preventDefault();
            e.stopPropagation();

            // Navigation arrière
            let prevIndex = currentIndex - 1;
            let prevElement = null;

            while (prevIndex >= 0 && !prevElement) {
              prevElement = document.querySelector(fieldsOrder[prevIndex]);
              if (!prevElement || prevElement.disabled || prevElement.readOnly) {
                prevElement = null;
                prevIndex--;
              }
            }

            if (!prevElement && prevIndex < 0) {
              prevIndex = fieldsOrder.length - 1;
              while (prevIndex > currentIndex && !prevElement) {
                prevElement = document.querySelector(fieldsOrder[prevIndex]);
                if (!prevElement || prevElement.disabled || prevElement.readOnly) {
                  prevElement = null;
                  prevIndex--;
                }
              }
            }

            if (prevElement) {
              setTimeout(() => {
                prevElement.focus();
                prevElement.select();
              }, isAutoSaving ? 100 : 0);
            }
          }
        }
      }, true);
    }

    // Détection de l'autoSave
    function detectAutoSave() {
      ObserverManager.createObserver(
        'autoSaveDetectionForFocus',
        (mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.target.tagName === 'BUTTON') {
              const button = mutation.target;
              if (button.textContent?.includes('Enregistrer') ||
                  button.className?.includes('save')) {
                isAutoSaving = true;
                saveCurrentFocus();
                setTimeout(() => {
                  isAutoSaving = false;
                  restoreFocus();
                }, 500);
              }
            }
          });
        },
        document.body,
        {
          attributes: true,
          subtree: true,
          attributeFilter: ['disabled', 'class']
        },
        false // non-persistent: spécifique au contexte de la page
      );
    }

    // Initialisation
    detectAutoSave();
    overrideTabNavigation();

  }
  function commitActiveField() {
    const activeEl = document.activeElement;
    if (!activeEl) return;

    const tagName = activeEl.tagName;
    const isInputLike = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
    const isEditable = activeEl.isContentEditable;

    if (!isInputLike && !isEditable) return;

    try {
      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      activeEl.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {
    }

    if (typeof activeEl.blur === 'function') {
      activeEl.blur();
    }
  }

  async function waitForEnabledSaveButton(selector, { timeout = 2000, pollInterval = 100 } = {}) {
    const start = performance.now();
    while (performance.now() - start < timeout) {
      const btn = document.querySelector(selector);
      if (btn && !btn.disabled) {
        return btn;
      }
      await wait(pollInterval);
    }
    const fallback = document.querySelector(selector);
    return fallback && !fallback.disabled ? fallback : null;
  }

  // Fonction pour forcer l'enregistrement de tous les yeux
  async function forceAutoSaveAllEyes(options = {}) {
      const {
        timeoutPerButton = 2000,
        pollInterval = 100,
        preserveFocus = false
      } = options;

      commitActiveField();

      // Sélecteurs des boutons d'enregistrement
      const saveButtonSelectors = [
          "#wrapper > main > app-file-layout > div > app-file-tab-information > div.eyes-container > div > app-file-information-eye:nth-child(1) > div > div.header > div.header__actions > amds-button > button",
          "#wrapper > main > app-file-layout > div > app-file-tab-information > div.eyes-container > div > app-file-information-eye:nth-child(2) > div > div.header > div.header__actions > amds-button > button"
      ];

      const activeElement = preserveFocus ? document.activeElement : null;
      const selection =
        preserveFocus &&
        activeElement &&
        typeof activeElement.selectionStart === 'number'
          ? {
              start: activeElement.selectionStart,
              end: activeElement.selectionEnd
            }
          : null;

      let savedCount = 0;

      for (const selector of saveButtonSelectors) {
          const btn = await waitForEnabledSaveButton(selector, {
            timeout: timeoutPerButton,
            pollInterval
          });
          if (btn) {

              const previousInlineDisplay = btn.style.display;
              const computedDisplay = window.getComputedStyle(btn).display;
              const shouldReveal = computedDisplay === 'none';

              if (shouldReveal) {
                btn.style.display = previousInlineDisplay && previousInlineDisplay !== 'none'
                  ? previousInlineDisplay
                  : 'inline-flex';
              }

              btn.click();

              if (shouldReveal) {
                  setTimeout(() => {
                    btn.style.display = previousInlineDisplay;
                  }, 50);
              }

              savedCount++;

              await wait(400);
          }
      }

      if (preserveFocus && activeElement && typeof activeElement.focus === 'function') {
        setTimeout(() => {
          if (!document.body.contains(activeElement)) return;
          activeElement.focus();
          if (selection && typeof activeElement.setSelectionRange === 'function') {
            try {
              activeElement.setSelectionRange(selection.start, selection.end);
            } catch (err) {
            }
          }
        }, 0);
      }

      if (savedCount > 0) {
          await wait(600);
      }

      return savedCount;
  }

  // Modifier les fonctions de calcul OrthoK et LRPG
  async function performOrthoKCalculation() {
        showToast('🔬 Démarrage du calcul OrthoK...');

        try {
            commitActiveField();
            // Forcer l'enregistrement d'abord
            await forceAutoSaveAllEyes();

            // Aller sur l'onglet lentille
            const lensTab = document.querySelector('#wrapper > main > app-file-layout > div > app-tabs-list > div.tabs-container.has-actions > div.tabs.theme--classic.has-separators > div.tab.lens-0-tab.clickable.ng-star-inserted');
            if (lensTab) {
                lensTab.click();
                await wait(1000);
            }

            // Sélection OrthoK pour OD
            const rightTypeSelect = document.querySelector('#input-righttype');
            if (rightTypeSelect) {
                rightTypeSelect.value = 'lens:type:orthok';
                rightTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                rightTypeSelect.dispatchEvent(new Event('input', { bubbles: true }));
            }

            await wait(500);

            // Sélection OrthoK pour OG
            const leftTypeSelect = document.querySelector('#input-lefttype');
            if (leftTypeSelect) {
                leftTypeSelect.value = 'lens:type:orthok';
                leftTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                leftTypeSelect.dispatchEvent(new Event('input', { bubbles: true }));
            }

            await wait(500);

            showToast('Calcul OrthoK terminé avec succès !');

            // Désactiver temporairement la protection du focus après calcul
            if (typeof shouldMaintainFocus !== 'undefined') {
              shouldMaintainFocus = false;
              setTimeout(() => {
                if (isLensPage()) {
                  shouldMaintainFocus = true;
                }
              }, 3000);
            }

        } catch (error) {
            console.error('Erreur lors du calcul OrthoK:', error);
            showToast('Erreur lors du calcul OrthoK');
        }
    }
  // Ajout styles split view
  function injectSplitViewStyles() {
    if (document.getElementById('clickfit-splitview-styles')) return;
    const style = document.createElement('style');
    style.id = 'clickfit-splitview-styles';
    style.textContent = `
      .clickfit-splitview-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100000;
        background: #181a1b;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        transition: opacity 0.3s;
      }
      .clickfit-splitview-iframe {
        flex: 1 1 0;
        border: none;
        width: 50vw;
        height: 100vh;
        min-width: 0;
        min-height: 0;
        background: white;
      }
      .clickfit-splitview-close {
        position: absolute;
        top: 14px;
        right: 18px;
        z-index: 100001;
        background: rgba(255,255,255,0.8);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 24px;
        color: #181a1b;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        transition: background 0.2s;
        opacity: 0.8;
      }
      .clickfit-splitview-close:hover {
        background: #fff;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }
  // Cache le body sauf split view
  let splitViewHiddenNodes = [];
  function activateSplitView() {
    if (document.querySelector('.clickfit-splitview-overlay')) return;
    injectSplitViewStyles();

    // Masquer tout le contenu du body sauf split view
    splitViewHiddenNodes = [];
    Array.from(document.body.children).forEach(node => {
      if (
        node.classList &&
        node.classList.contains('clickfit-splitview-overlay')
      ) {
        // ne rien faire
      } else if (
        node.tagName === 'SCRIPT' ||
        node.tagName === 'STYLE' ||
        node.id === 'clickfit-splitview-styles'
      ) {
        // laisser styles/scripts
      } else {
        // masquer
        splitViewHiddenNodes.push({
          node: node,
          prevDisplay: node.style.display
        });
        node.style.display = 'none';
      }
    });

    // Créer le panneau split view
    const overlay = document.createElement('div');
    overlay.className = 'clickfit-splitview-overlay';

    // Bouton fermer
    const closeBtn = document.createElement('button');
    closeBtn.className = 'clickfit-splitview-close';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Fermer Split View';
    closeBtn.addEventListener('click', deactivateSplitView);
    overlay.appendChild(closeBtn);

    // 2 iframes côte à côte
    const url = window.location.href;
    const iframe1 = document.createElement('iframe');
    iframe1.className = 'clickfit-splitview-iframe';
    iframe1.src = url;
    iframe1.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-modals');
    const iframe2 = document.createElement('iframe');
    iframe2.className = 'clickfit-splitview-iframe';
    iframe2.src = url;
    iframe2.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-modals');
    overlay.appendChild(iframe1);
    overlay.appendChild(iframe2);

    document.body.appendChild(overlay);
  }
  // Desactiver le SplitView
  function deactivateSplitView() {
    // Supprimer split view
    const overlay = document.querySelector('.clickfit-splitview-overlay');
    if (overlay) overlay.remove();
    // Restaurer le body
    if (splitViewHiddenNodes && splitViewHiddenNodes.length > 0) {
      splitViewHiddenNodes.forEach(({node, prevDisplay}) => {
        node.style.display = prevDisplay || '';
      });
      splitViewHiddenNodes = [];
    }
  }

  function autoCheckObservanceDefaults() {

    // Garde-fou : vérifier qu'on est sur la bonne page
    const observanceTitle = document.querySelector('h1, h2, h3, .title');
    const isObservancePage = observanceTitle && observanceTitle.textContent.includes('Commun aux 2 yeux');

    // Vérifier aussi la présence du composant observance
    const observanceComponent = document.querySelector('app-observance');

    if (!isObservancePage && !observanceComponent) {
      return;
    }

    // Définir les options par défaut à cocher
    const defaultSelections = [
      {
        name: 'Oxydant',
        selector: 'app-store-field:nth-child(1) .input-radio-group > div:nth-child(1) input[type="radio"]'
      },
      {
        name: 'Hebdomadaire',
        selector: 'app-store-field:nth-child(2) .input-radio-group > div:nth-child(1) input[type="radio"]'
      },
      {
        name: 'Aquadrop',
        selector: 'app-store-field:nth-child(3) .input-radio-group > div:nth-child(1) input[type="radio"]'
      },
      {
        name: 'Ventouse',
        selector: 'app-store-field:nth-child(4) .input-radio-group > div:nth-child(2) input[type="radio"]'
      }
    ];

    // Pour chaque option par défaut
    defaultSelections.forEach(selection => {
      const radioButton = document.querySelector(`app-observance ${selection.selector}`);

      if (radioButton && !radioButton.checked) {
        // Cocher uniquement si pas déjà coché
        radioButton.checked = true;
        radioButton.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

// Observer pour détecter l'apparition de la page avec ObserverManager
ObserverManager.createObserver(
  'observancePageDetection',
  () => {
    // Vérifier si on trouve le texte caractéristique
    const hasObservanceText = Array.from(document.querySelectorAll('*')).some(el =>
      el.textContent && el.textContent.includes('Commun aux 2 yeux') &&
      el.textContent.includes('Produit utilisé')
    );

    if (hasObservanceText) {
      // Attendre un peu que tous les éléments soient chargés
      setTimeout(() => {
        autoCheckObservanceDefaults();
      }, 500);
    }
  },
  document.body,
  {
    childList: true,
    subtree: true
  },
  false // non-persistent: spécifique à cette page
);

// Vérifier aussi immédiatement au cas où la page est déjà chargée
autoCheckObservanceDefaults();

//Sauvagarde dans la page Calcule lentilles
function interceptNextButton() {
    // Observer pour détecter quand le bouton Suivant apparaît avec ObserverManager
    ObserverManager.createObserver(
      'lensNextButtonDetection',
      () => {
        const nextButton = document.querySelector('#wrapper > main > app-file-layout > div > app-tabs-list > div.tabs-container.has-actions > div.actions.ng-star-inserted > amds-button > button');

        if (nextButton && !nextButton.dataset.intercepted) {
          setupNextButtonInterceptor(nextButton);
        }
      },
      document.body,
      {
        childList: true,
        subtree: true
      },
      false // non-persistent: spécifique à la page de calcul lentilles
    );

    // Vérifier aussi immédiatement
    const nextButton = document.querySelector('#wrapper > main > app-file-layout > div > app-tabs-list > div.tabs-container.has-actions > div.actions.ng-star-inserted > amds-button > button');
    if (nextButton) {
      setupNextButtonInterceptor(nextButton);
    }
  }

function setupNextButtonInterceptor(nextButton) {
    // Marquer comme déjà intercepté
    nextButton.dataset.intercepted = 'true';

    // Sauvegarder la fonction click originale
    const originalClick = nextButton.onclick;

    // Créer notre propre handler
    const interceptedClick = async function(event) {

      // Ne pas empêcher l'action par défaut - laisser le modal s'ouvrir

      // Chercher et cliquer sur les boutons Enregistrer des lentilles
      const saveButtons = await findAndClickLensSaveButtons();

      if (saveButtons.length > 0) {

        // Attendre un peu que les sauvegardes se fassent
        await wait(1000);

        // Vérifier que les boutons sont redevenus disabled (signe que c'est sauvegardé)
        let allSaved = false;
        let attempts = 0;

        while (!allSaved && attempts < 10) {
          allSaved = saveButtons.every(btn => btn.disabled);
          if (!allSaved) {
            await wait(500);
            attempts++;
          }
        }

      }
      // Retirer temporairement notre intercepteur pour éviter la boucle
      nextButton.removeEventListener('click', interceptedClick, true);

      //nextButton.click();

      
      setTimeout(() => {
        nextButton.addEventListener('click', interceptedClick, true);
      }, 100);
    };

    
    nextButton.addEventListener('click', interceptedClick, true);

    
    nextButton.title = 'Enregistrera automatiquement les lentilles avant de continuer';
}

async function findAndClickLensSaveButtons() {

    const saveButtons = [];

    // Méthode 1 : Chercher par structure (page lentilles)
    const lensContainers = document.querySelectorAll('.lens-container .header__actions amds-button');

    lensContainers.forEach(amdsBtn => {
      const btn = amdsBtn.querySelector('button');
      if (btn && !btn.disabled) {
        // Vérifier que c'est bien un bouton Enregistrer
        const text = btn.textContent?.toLowerCase() || '';
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';

        if (text.includes('enregistr') || ariaLabel.includes('save') || ariaLabel.includes('enregistr')) {
          saveButtons.push(btn);
        }
      }
    });

    // Méthode 2 : Chercher par texte si méthode 1 ne trouve rien
    if (saveButtons.length === 0) {
      document.querySelectorAll('amds-button button').forEach(btn => {
        if (!btn.disabled) {
          const text = btn.textContent?.toLowerCase() || '';
          if (text.includes('enregistr')) {
            // Vérifier que c'est dans un contexte de lentille
            const container = btn.closest('.lens-container, [class*="lens"]');
            if (container) {
              saveButtons.push(btn);
            }
          }
        }
      });
    }

    // Cliquer sur tous les boutons trouvés
    saveButtons.forEach((btn, index) => {

      // Montrer temporairement le bouton s'il est caché
      const wasHidden = btn.style.display === 'none';
      if (wasHidden) {
        btn.style.display = '';
      }

      btn.click();

      // Re-cacher si nécessaire
      if (wasHidden) {
        setTimeout(() => {
          btn.style.display = 'none';
        }, 100);
      }
    });

    return saveButtons;
  }

// Fonction pour réorganiser les sections
function reorderSectionsOnly() {

  // Attendre que les sections soient chargées
  const eyeContainers = document.querySelectorAll('app-file-information-eye');

  if (eyeContainers.length < 2) {
    return;
  }

  // Pour chaque œil
  eyeContainers.forEach((eyeContainer, eyeIndex) => {
    const eyeName = eyeIndex === 0 ? 'OD' : 'OG';

    // Trouver le conteneur principal des sections
    const contentContainer = eyeContainer.querySelector('.eye > .content');
    if (!contentContainer) {
      return;
    }

    // Identifier toutes les sections
    const sections = {
      refraction: contentContainer.querySelector('app-file-information-eye-refraction'),
      keratometry: contentContainer.querySelector('app-file-information-eye-keratometry'),
      visualAcuity: contentContainer.querySelector('app-file-information-eye-visual-acuity'),
      biometry: contentContainer.querySelector('app-file-information-eye-biometry')
    };

    // Vérifier que toutes les sections sont présentes
    const foundSections = Object.entries(sections).filter(([key, el]) => el !== null);

    if (foundSections.length === 0) {
      return;
    }

    // Créer un fragment pour réorganiser
    const fragment = document.createDocumentFragment();

    if (eyeIndex === 0) {
      // OD : Réfraction, Kératométrie, Acuité visuelle, Biométrie
      if (sections.refraction) fragment.appendChild(sections.refraction);
      if (sections.keratometry) fragment.appendChild(sections.keratometry);
      if (sections.visualAcuity) fragment.appendChild(sections.visualAcuity);
      if (sections.biometry) fragment.appendChild(sections.biometry);
    } else {
      // OG : Kératométrie, Réfraction, Biométrie, Acuité visuelle
      if (sections.keratometry) fragment.appendChild(sections.keratometry);
      if (sections.refraction) fragment.appendChild(sections.refraction);
      if (sections.biometry) fragment.appendChild(sections.biometry);
      if (sections.visualAcuity) fragment.appendChild(sections.visualAcuity);
    }

    // Vider et remplir le conteneur
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(fragment);

  });

  
  if (!document.getElementById('simple-grid-fix')) {
    const style = document.createElement('style');
    style.id = 'simple-grid-fix';
    style.textContent = `
      /* Fix simple pour la grille sans changer le design */
      app-file-information-eye > .eye > .content {
        display: grid !important;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 16px;
      }

      /* Position dans la grille pour OD */
      app-file-information-eye:nth-child(1) app-file-information-eye-refraction {
        grid-column: 1;
        grid-row: 1;
        order: 1;
      }

      app-file-information-eye:nth-child(1) app-file-information-eye-keratometry {
        grid-column: 2;
        grid-row: 1;
        order: 2;
      }

      app-file-information-eye:nth-child(1) app-file-information-eye-visual-acuity {
        grid-column: 1;
        grid-row: 2;
        order: 3;
      }

      app-file-information-eye:nth-child(1) app-file-information-eye-biometry {
        grid-column: 2;
        grid-row: 2;
        order: 4;
      }

      /* Position dans la grille pour OG */
      app-file-information-eye:nth-child(2) app-file-information-eye-keratometry {
        grid-column: 1;
        grid-row: 1;
        order: 1;
      }

      app-file-information-eye:nth-child(2) app-file-information-eye-refraction {
        grid-column: 2;
        grid-row: 1;
        order: 2;
      }

      app-file-information-eye:nth-child(2) app-file-information-eye-biometry {
        grid-column: 1;
        grid-row: 2;
        order: 3;
      }

      app-file-information-eye:nth-child(2) app-file-information-eye-visual-acuity {
        grid-column: 2;
        grid-row: 2;
        order: 4;
      }

      /* Responsive : quand la fenêtre est réduite */
      @media (max-width: 1800px) {
        app-file-information-eye > .eye > .content {
          display: flex !important;
          flex-direction: column !important;
          gap: 16px;
        }

        /* Pour OD en mode mobile : Réfraction, Kératométrie, Biométrie, Acuité visuelle */
        app-file-information-eye:nth-child(1) app-file-information-eye-refraction {
          order: 1 !important;
        }

        app-file-information-eye:nth-child(1) app-file-information-eye-keratometry {
          order: 2 !important;
        }

        app-file-information-eye:nth-child(1) app-file-information-eye-biometry {
          order: 3 !important;
        }

        app-file-information-eye:nth-child(1) app-file-information-eye-visual-acuity {
          order: 4 !important;
        }

        /* Pour OG en mode mobile : même ordre que OD pour la cohérence */
        app-file-information-eye:nth-child(2) app-file-information-eye-refraction {
          order: 1 !important;
        }

        app-file-information-eye:nth-child(2) app-file-information-eye-keratometry {
          order: 2 !important;
        }

        app-file-information-eye:nth-child(2) app-file-information-eye-biometry {
          order: 3 !important;
        }

        app-file-information-eye:nth-child(2) app-file-information-eye-visual-acuity {
          order: 4 !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
// Fonction pour réorganiser les champs de kératométrie
function setupSimpleSectionReorderSafe() {
  let currentPatientId = null;

  function getCurrentPatientId() {
    const match = location.pathname.match(/\/file\/([A-Za-z0-9]+)/);
    return match ? match[1] : null;
  }

  // Fonction de réorganisation robuste
  async function performReorganization() {

    // Attendre que TOUTES les 8 sections soient présentes (4 par œil)
    let attempts = 0;
    const maxAttempts = 50; // 5 secondes max

    while (attempts < maxAttempts) {
      const sections = {
        odRefraction: document.querySelector('app-file-information-eye:nth-child(1) app-file-information-eye-refraction'),
        odKeratometry: document.querySelector('app-file-information-eye:nth-child(1) app-file-information-eye-keratometry'),
        odVisualAcuity: document.querySelector('app-file-information-eye:nth-child(1) app-file-information-eye-visual-acuity'),
        odBiometry: document.querySelector('app-file-information-eye:nth-child(1) app-file-information-eye-biometry'),
        ogRefraction: document.querySelector('app-file-information-eye:nth-child(2) app-file-information-eye-refraction'),
        ogKeratometry: document.querySelector('app-file-information-eye:nth-child(2) app-file-information-eye-keratometry'),
        ogVisualAcuity: document.querySelector('app-file-information-eye:nth-child(2) app-file-information-eye-visual-acuity'),
        ogBiometry: document.querySelector('app-file-information-eye:nth-child(2) app-file-information-eye-biometry')
      };

      const allSectionsLoaded = Object.values(sections).every(section => section !== null);

      if (allSectionsLoaded) {

        // Attendre un tout petit peu que Angular finisse le rendu
        await wait(200);

        // Réorganiser
        reorderSectionsOnly();

        // Puis réorganiser les champs de kératométrie
        setTimeout(() => {
          reorderKeratometryFields();
        }, 100);

        return true;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
  }

  // Surveiller les changements d'URL (navigation SPA) avec ObserverManager
  ObserverManager.createInterval(
    'patientUrlChangeMonitoring',
    async () => {
      const newPatientId = getCurrentPatientId();

      // Si on a changé de patient ou qu'on arrive sur un patient
      if (newPatientId && newPatientId !== currentPatientId) {
        currentPatientId = newPatientId;

        // Lancer la réorganisation
        await performReorganization();
      }
    },
    250,
    true // persistent: surveillance globale des changements de patient
  );

  // Observer pour les changements dynamiques (au cas où) avec ObserverManager
  const container = document.querySelector('#wrapper');
  if (container) {
    ObserverManager.createObserver(
      'patientFileReorganization',
      () => {
        // Si on est sur une fiche patient et qu'on n'a pas encore réorganisé
        const patientId = getCurrentPatientId();
        if (patientId && patientId === currentPatientId) {
          // Ne rien faire, déjà traité
        } else if (patientId) {
          currentPatientId = patientId;
          performReorganization();
        }
      },
      container,
      {
        childList: true,
        subtree: true
      },
      false // non-persistent: spécifique au contexte de réorganisation
    );
  }

  // Tentative initiale si déjà sur une fiche
  if (getCurrentPatientId()) {
    currentPatientId = getCurrentPatientId();
    setTimeout(() => performReorganization(), 500);
  }
}

function makeSpecificSectionsCollapsible() {

  // CSS pour les sections rétractables
  const styleId = 'simple-collapsible-patch';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .collapsible-header {
        cursor: pointer !important;
        user-select: none !important;
        position: relative !important;
      }
      .section-chevron {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        transition: transform 0.3s ease;
        font-size: 14px;
        color: #666;
        pointer-events: none;
      }
      .collapsed-section .section-chevron {
        transform: translateY(-50%) rotate(-90deg);
      }
      .collapsed-section .accordion > .content {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function makeCollapsible(sectionElement, sectionName, eyeName) {
    const accordion = sectionElement.querySelector('.accordion');
    if (!accordion) {
      return;
    }
    const header = accordion.querySelector('.header');
    if (!header || header.dataset.collapsible === 'true') {
      // log seulement si header absent
      return;
    }
    header.dataset.collapsible = 'true';
    header.classList.add('collapsible-header');
    const oldChevron = header.querySelector('.section-chevron');
    if (oldChevron) oldChevron.remove();
    const chevron = document.createElement('span');
    chevron.className = 'section-chevron';
    chevron.innerHTML = '▼';
    header.appendChild(chevron);

    const isCollapsed = GM_getValue(`${sectionName}_${eyeName}_collapsed`, false);
    if (isCollapsed) accordion.classList.add('collapsed-section');
    else accordion.classList.remove('collapsed-section');

    header.onclick = function(e) {
      e.stopPropagation();
      const wasCollapsed = accordion.classList.contains('collapsed-section');
      if (wasCollapsed) {
        accordion.classList.remove('collapsed-section');
      } else {
        accordion.classList.add('collapsed-section');
      }
      GM_setValue(`${sectionName}_${eyeName}_collapsed`, !wasCollapsed);
    };
  }

  function applyToSpecificSections() {
    // Vérifier qu'on est sur une page de dossier avec des informations d'yeux
    if (!window.location.href.includes('/file/')) {
      return; // Pas sur une page de dossier, pas besoin de sections rétractables
    }

    const eyeContainers = document.querySelectorAll('app-file-information-eye');
    if (eyeContainers.length === 0) {
      // Ne pas afficher d'erreur, juste retourner silencieusement
      return;
    }

    eyeContainers.forEach((container, index) => {
      const eyeName = index === 0 ? 'OD' : 'OG';
      const biometry = container.querySelector('app-file-information-eye-biometry');
      if (biometry) makeCollapsible(biometry, 'biometry', eyeName);
      const visualAcuity = container.querySelector('app-file-information-eye-visual-acuity');
      if (visualAcuity) makeCollapsible(visualAcuity, 'visual-acuity', eyeName);
    });
  }

  // Appliquer maintenant
  applyToSpecificSections();

  // Observer les changements dynamiques avec ObserverManager
  if (!window._cfCollapsibleObserver) {
    ObserverManager.createObserver(
      'collapsibleSectionsReapply',
      () => {
        // Seulement sur les pages de dossier
        if (window.location.href.includes('/file/')) {
          // Si aucune section rétractable n'est présente, réappliquer
          if (document.querySelectorAll('.collapsible-header').length === 0) {
            setTimeout(applyToSpecificSections, 300);
          }
        }
      },
      document.body,
      {
        childList: true,
        subtree: true
      },
      false // non-persistent: spécifique au contexte des sections
    );
    window._cfCollapsibleObserver = true;
  }
}

// Variable pour éviter les lancements multiples
let isLaunched = false;

// Lancement global
function launch() {

  if (isLaunched) return;
  isLaunched = true;

  // Boutons de calcul LRPG et Ortho-K - Priorité haute avec retry
  setTimeout(() => {
    addCalculationButtonsToHeader();

    // Retry après 3 secondes si les boutons ne sont pas encore là
    setTimeout(() => {
      if (!document.querySelector('.calc-buttons-container') && window.location.href.includes('/file/')) {
        addCalculationButtonsToHeader();
      }
    }, 3000);
  }, 1000);

  // Module navigation patients
  setTimeout(() => {
    if (typeof SimplePatientNav !== 'undefined') {
      SimplePatientNav.init();
    }
  }, 2000);

  //Eléments rétractables
  setTimeout(() => {
      makeSpecificSectionsCollapsible();

      // Réappliquer périodiquement pour les changements de page avec ObserverManager
      ObserverManager.createInterval(
        'collapsibleSectionsPeriodicReapply',
        () => {
          const needsReapply = document.querySelectorAll('.collapsible-header').length === 0;
          if (needsReapply && window.location.pathname.includes('/file/')) {
            makeSpecificSectionsCollapsible();
          }
        },
        2000,
        true // persistent: réapplication globale sur toutes les pages de dossier
      );
    }, 2000); // Attendre 2s au lieu de 500ms

  // Module de réorganisation des sections
  setTimeout(() => {
    // setupSectionReorganizer(); // Fonction supprimée
  }, 2000);

  // Injecter les styles CSS
  if (typeof injectStyles === 'function') {
    injectStyles();
  }
  // Module Video
  if (typeof VideoExplanationModule !== 'undefined') {
    setTimeout(() => {
      VideoExplanationModule.init();
    }, 2000);
  }

  // Autres initialisations
  if (typeof interceptNextButton === 'function') interceptNextButton();
  if (typeof setupRefractionPolling === 'function') setupRefractionPolling();
  if (typeof setupSpaceNext === 'function') setupSpaceNext();
  if (typeof createFloatingButton === 'function') createFloatingButton();
  if (typeof setupKeyboardShortcuts === 'function') setupKeyboardShortcuts();
  if (typeof setupSimpleSectionReorderSafe === 'function') setupSimpleSectionReorderSafe();
  if (typeof fixTabNavigationWithAutoSave === 'function') fixTabNavigationWithAutoSave();
  if (typeof autoCheckObservanceDefaults === 'function') autoCheckObservanceDefaults();
  if (typeof injectRefractionDuplicateButton === 'function') {
    // Délai pour laisser le temps aux sections de se charger
    setTimeout(() => {
      injectRefractionDuplicateButton();
    }, 2000);

    // Retry après 5 secondes au cas où
    setTimeout(() => {
      injectRefractionDuplicateButton();
    }, 5000);
  }
  if (typeof scanAndObserveButtons === 'function') {
    scanAndObserveButtons();
    ObserverManager.createInterval(
      'scanAndObserveButtonsPeriodic',
      () => {
        scanAndObserveButtons();
      },
      2000,
      true // persistent: scan périodique global
    );
  }
  if (typeof setupButtonObserver === 'function') setupButtonObserver();
  if (typeof setupLensPageObserver === 'function') setupLensPageObserver();
  if (typeof applyCustomStepToAll === 'function') {
    setTimeout(() => {
      applyCustomStepToAll();
      ObserverManager.createInterval(
        'applyCustomStepPeriodic',
        () => {
          applyCustomStepToAll();
        },
        2000,
        true // persistent: application périodique globale du custom step
      );
    }, 1000);
  }

  if (typeof patchColorAutoChange === 'function') patchColorAutoChange();

}

// Démarrage initial
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", launch);
} else {
  delay(launch, DELAYS.LONG);
}
})();

// ==UserScript==
// @name         Dreadcast - PimpMyPion - Testing v 0.6.3
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  Remplace les pions bleus par les avatars des joueurs et ajoute des paramètres de personnalisation
// @author       Darlene + Claude IA /  
// @match        https://www.dreadcast.net/*
// @match        http://www.dreadcast.net/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/556334/Dreadcast%20-%20PimpMyPion%20-%20Testing%20v%20063.user.js
// @updateURL https://update.greasyfork.org/scripts/556334/Dreadcast%20-%20PimpMyPion%20-%20Testing%20v%20063.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURATION & CONSTANTES
  // ==========================================================================

  const VERSION = "0.6.3";

  /**
   * Configuration globale de l'application
   * @const {Object} CONFIG - Configuration immutable
   */
  const CONFIG = Object.freeze({
    // Storage keys
    STORAGE_KEYS: Object.freeze({
      AVATAR_SIZE: 'dreadcast_avatar_size',
      AVATAR_ENABLED: 'dreadcast_avatar_enabled',
      EMOJI_ENABLED: 'dreadcast_emoji_enabled',
      EMOJI_SIZE: 'dreadcast_emoji_size',
      CUSTOM_COLORS: 'dreadcast_custom_colors',
      COLOR_OPACITY: 'dreadcast_color_opacity'
    }),

    // Paramètrage de la taille de l'avatar (%)
    SIZE: Object.freeze({
      DEFAULT: 100,
      MIN: 75,
      MAX: 150
    }),

    // Paramètrage de la taille des emojis d'action (px)
    EMOJI: Object.freeze({
      DEFAULT_SIZE: 12,
      MIN_SIZE: 12,
      MAX_SIZE: 28
    }),

    // Paramètrage de l'opacité des avatars(%)
    OPACITY: Object.freeze({
      DEFAULT: 100,
      MIN: 0,
      MAX: 100
    }),

    // Paramétrage des groupes de pions aka "PIE CHARTS" (2 pions ou plus sur même case)
    PIE_CHART: Object.freeze({
      SIZE: 30, // px
      RADIUS: 50,
      CENTER_X: 50,
      CENTER_Y: 50,
      CENTER_RADIUS: 15,
      BORDER_WIDTH: 2
    }),

    // URLs
    URLS: Object.freeze({
      AVATAR_BASE: 'https://www.dreadcast.net/images/avatars/'
    }),

    // Timing (ms)
    TIMING: Object.freeze({
      REAPPLY_INTERVAL: 50,
      RAF_THROTTLE: 0,
      INIT_DELAY: 2000,
      SECONDARY_DELAY: 5000,
      MENU_CHECK_INTERVAL: 500,
      MENU_CHECK_TIMEOUT: 10000,
      EVENT_ATTACH_DELAY: 100,
      COMBAT_CHECK_INTERVAL: 200,
      ACTION_CACHE_TTL: 500,
      HOVER_DELAY: 300,
      POPUP_TRANSITION: 200
    }),

    // Z-indices
    Z_INDEX: Object.freeze({
      AVATAR: 999,
      EMOJI: 1001,
      OVERLAY: 999999,
      PANEL: 1000000
    }),

    // Sélecteurs CSS
    SELECTORS: Object.freeze({
      PIONS: '.personnages .icon_perso',
      ICON: '.le_icon_perso',
      INFO: '.info_a_afficher',
      SETTINGS_MENU: '.parametres ul',
      COMBAT: '#combat_carte',
      PLAYER_ACTION: '#icon_action'
    }),

    // Classes CSS
    CLASSES: Object.freeze({
      AVATAR_IMG: 'custom-avatar-img',
      CONNECTED: 'connecte',
      ACTION_EMOJI: 'action-emoji',
      PIE_CHART: 'pie-chart-svg',
      PIE_CHART_CENTER: 'pie-chart-center',
      PIE_CHART_COUNT: 'pie-chart-count',
      PIE_CHART_POPUP: 'pie-chart-popup'
    }),

    // Data attributes
    ATTRIBUTES: Object.freeze({
      AVATAR_STATUS: 'data-avatar-applied',
      PLAYER_NAME: 'data-player-name',
      CURRENT_ACTION: 'data-current-action',
      PIE_CHART_APPLIED: 'data-pie-chart-applied'
    }),

    // Status
    STATUS: Object.freeze({
      SUCCESS: 'success',
      FAILED: 'failed'
    }),

    // Couleur des actions (OBSOLETE)
    // ACTION_COLORS: Object.freeze({
    //   'en_combat': '#ef4444',
    //   'encombat': '#ef4444',
    //   'aucune': '#9ca3af',
    //   'noaction': '#9ca3af',
    //   'repos': '#06b6d4',
    //   'recherche': '#f59e0b',
    //   'cacher': '#8b5cf6',
    //   'scruter': '#f97316',
    //   'soin': '#10b981',
    //   'travail': '#92400e',
    //   'ko': '#1f2937',
    //   'destruction': '#ef4444',
    //   'reparation': '#ef4444'
    // }),

    // Icônes d'action
    ACTION_EMOJIS: Object.freeze({
      'en_combat': '⚔️',
      'encombat': '⚔️',
      // 'aucune': '⏸️',
      // 'noaction': '⏸️',
      'repos': '😴',
      'recherche': '⛏️',
      'cacher': '🫣',
      'scruter': '👀',
      'soin': '💊',
      'travail': '⚙️',
      'ko': '💀',
      'destruction': '💥',
      'reparation': '🔧',
      'deplacement': '🗺️'
    }),

    // Classes des action à détecter
    ACTION_CLASSES: Object.freeze([
      'en_combat', 'encombat',
      'recherche', 'fouille',
      'repos',
      'cacher',
      'scruter',
      'soin',
      'travail',
      'destruction',
      'reparation',
      'aucune', 'noaction',
      'ko',
      'deplacement'
    ]),

    // Couleurs par défaut
    COLORS: Object.freeze({
      CONNECTED: '#00ff4cff',
      DISCONNECTED: '#000000ff'
    }),

    // Configuration mode furtif
    STEALTH: Object.freeze({
      BLUR_AMOUNT: 5,
      ENABLE_BLUR: true,
      HOVER_BLUR_AMOUNT: 2
    }),

    // Debug Mode
    DEBUG_MODE: false
  });

  // ==========================================================================
  // STATE MANAGEMENT (Immutable)
  // ==========================================================================

  /**
   * Crée un état initial vide
   * @returns {Object} - État initial
   */
  const createInitialState = () => ({
    avatarCache: new Map(),
    avatarUrlCache: new Map(),
    actionCache: new Map(),
    previousStealthStates: new Map(),
    reapplyIntervalId: null,
    reapplyAnimationFrameId: null,
    lastReapplyTime: 0,
    // État du module CombatDetection
    combatCheckInterval: null,
    isInCombat: false,
    savedSize: null
  });

  /**
   * État global de l'application
   */
  let state = createInitialState();

  /**
   * Met à jour l'état de manière immutable
   * @param {Object} updates - Mises à jour à appliquer
   * @returns {Object} - Nouvel état
   */
  const updateState = (updates) => {
    state = { ...state, ...updates };
    return state;
  };

  /**
   * Réinitialise l'état
   * @returns {Object} - État réinitialisé
   */
  const resetState = () => {
    if (state.reapplyIntervalId) clearInterval(state.reapplyIntervalId);
    if (state.reapplyAnimationFrameId) cancelAnimationFrame(state.reapplyAnimationFrameId);
    if (state.combatCheckInterval) clearInterval(state.combatCheckInterval);

    state.avatarCache?.clear();
    state.avatarUrlCache?.clear();
    state.actionCache?.clear();
    state.previousStealthStates?.clear();
    Utils.debugLog('🧹 États furtifs nettoyés');

    state = createInitialState();
    return state;
  };

  // ==========================================================================
  // FONCTIONS UTILITAIRES
  // ==========================================================================

  /**
   * Module utilitaire contenant des fonctions pures
   * @namespace Utils
   */
  const Utils = Object.freeze({
    /**
     * Log de debug conditionnel
     * @param {string} message - Message à logger
     * @param {...*} args - Arguments additionnels
     */
    debugLog: (message, ...args) => {
      if (CONFIG.DEBUG_MODE) {
        console.log(`[PimpMyPion] ${message}`, ...args);
      }
    },

    /**
     * Encode un nom de joueur pour URL
     * @param {string} name - Nom du joueur
     * @returns {string} - Nom encodé
     */
    encodePlayerName: (name) => encodeURIComponent(name),

    /**
     * Construit l'URL d'un avatar
     * @param {string} playerName - Nom du joueur
     * @returns {string} - URL complète de l'avatar
     */
    buildAvatarUrl: (playerName) =>
      `${CONFIG.URLS.AVATAR_BASE}${Utils.encodePlayerName(playerName)}.png`,

    /**
     * Convertit une couleur hexadécimale en rgba
     * @param {string} hex - Couleur hex (#rrggbb)
     * @param {number} opacity - Opacité de 0 à 1
     * @returns {string} - Couleur rgba
     */
    hexToRgba: (hex, opacity) => {
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },

    /**
     * Convertit des degrés en radians
     * @param {number} degrees - Angle en degrés
     * @returns {number} - Angle en radians
     */
    degreesToRadians: (degrees) => degrees * (Math.PI / 180),

    /**
     * Calcule les coordonnées d'un point sur un cercle
     * @param {number} angle - Angle en radians
     * @param {number} radius - Rayon du cercle
     * @param {number} cx - Centre X
     * @param {number} cy - Centre Y
     * @returns {Object} - {x, y}
     */
    pointOnCircle: (angle, radius, cx = 50, cy = 50) => ({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    }),

    /**
     * Parse les noms des joueurs depuis HTML
     * @param {string} html - HTML contenant les noms séparés par <br>
     * @returns {Array<string>} - Liste des noms
     */
    parsePlayerNames: (html) =>
      html
        .split(/<br\s*\/?>/i)
        .map(name => name.trim())
        .filter(name => name.length > 0),

    /**
     * Vérifie si un élément est visible
     * @param {HTMLElement} element - Élément à vérifier
     * @returns {boolean} - true si visible
     */
    isElementVisible: (element) => {
      if (!element) return false;
      const style = window.getComputedStyle(element);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        element.offsetParent !== null
      );
    },

    /**
     * Limite l'appel d'une fonction dans le temps
     * @param {Function} fn - Fonction à throttler
     * @param {number} delay - Délai minimum entre appels (ms)
     * @returns {Function} - Fonction throttlée
     */
    throttle: (fn, delay) => {
      let lastCall = 0;
      return function (...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        return fn.apply(this, args);
      };
    },

    /**
     * Clamp une valeur entre min et max
     * @param {number} value - Valeur à clamper
     * @param {number} min - Minimum
     * @param {number} max - Maximum
     * @returns {number} - Valeur clampée
     */
    clamp: (value, min, max) => Math.max(min, Math.min(value, max))
  });

  // ==========================================================================
  // MODULE DE STOCKAGE
  // ==========================================================================

  /**
   * Module de gestion du stockage persistant
   * @namespace Storage
   */
  const Storage = Object.freeze({
    /**
     * Charge une valeur depuis localStorage
     * @param {string} key - Clé de stockage
     * @param {*} defaultValue - Valeur par défaut
     * @returns {*} - Valeur chargée ou défaut
     */
    load: (key, defaultValue) => {
      const saved = localStorage.getItem(key);
      if (saved === null) return defaultValue;
      try {
        return JSON.parse(saved);
      } catch {
        return saved;
      }
    },

    /**
     * Sauvegarde une valeur dans localStorage
     * @param {string} key - Clé de stockage
     * @param {*} value - Valeur à sauvegarder
     */
    save: (key, value) => {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    },

    /**
     * Charge la taille des avatars
     * @returns {number} - Taille en %
     */
    loadAvatarSize: () =>
      parseInt(Storage.load(CONFIG.STORAGE_KEYS.AVATAR_SIZE, CONFIG.SIZE.DEFAULT), 10),

    /**
     * Sauvegarde la taille des avatars
     * @param {number} size - Taille en %
     */
    saveAvatarSize: (size) =>
      Storage.save(CONFIG.STORAGE_KEYS.AVATAR_SIZE, String(size)),

    /**
     * Charge l'état d'activation des avatars
     * @returns {boolean} - true si activé
     */
    loadAvatarEnabled: () =>
      Storage.load(CONFIG.STORAGE_KEYS.AVATAR_ENABLED, true),

    /**
     * Sauvegarde l'état d'activation des avatars
     * @param {boolean} enabled - État à sauvegarder
     */
    saveAvatarEnabled: (enabled) =>
      Storage.save(CONFIG.STORAGE_KEYS.AVATAR_ENABLED, enabled),

    /**
     * Charge l'état d'activation des icônes d'action
     * @returns {boolean} - true si activé
     */
    loadEmojiEnabled: () =>
      Storage.load(CONFIG.STORAGE_KEYS.EMOJI_ENABLED, true),

    /**
     * Sauvegarde l'état d'activation des icônes d'action
     * @param {boolean} enabled - État à sauvegarder
     */
    saveEmojiEnabled: (enabled) =>
      Storage.save(CONFIG.STORAGE_KEYS.EMOJI_ENABLED, enabled),

    /**
     * Charge la taille des icônes d'action
     * @returns {number} - Taille en px
     */
    loadEmojiSize: () =>
      parseInt(Storage.load(CONFIG.STORAGE_KEYS.EMOJI_SIZE, CONFIG.EMOJI.DEFAULT_SIZE), 10),

    /**
     * Sauvegarde la taille des icônes d'action
     * @param {number} size - Taille en px
     */
    saveEmojiSize: (size) =>
      Storage.save(CONFIG.STORAGE_KEYS.EMOJI_SIZE, String(size)),

    /**
     * Charge les couleurs personnalisées
     * @returns {Object} - Map des couleurs personnalisées
     */
    loadCustomColors: () =>
      Storage.load(CONFIG.STORAGE_KEYS.CUSTOM_COLORS, {}),

    /**
     * Sauvegarde les couleurs personnalisées
     * @param {Object} colors - Map des couleurs
     */
    saveCustomColors: (colors) =>
      Storage.save(CONFIG.STORAGE_KEYS.CUSTOM_COLORS, colors),

    /**
     * Charge l'opacité des couleurs
     * @returns {number} - Opacité en %
     */
    loadColorOpacity: () =>
      parseInt(Storage.load(CONFIG.STORAGE_KEYS.COLOR_OPACITY, CONFIG.OPACITY.DEFAULT), 10),

    /**
     * Sauvegarde l'opacité des couleurs
     * @param {number} opacity - Opacité en %
     */
    saveColorOpacity: (opacity) =>
      Storage.save(CONFIG.STORAGE_KEYS.COLOR_OPACITY, String(opacity)),

    // /**
    //  * Récupère la couleur pour une action avec opacité () // OBSOLETE
    //  * @param {string} action - Nom de l'action
    //  * @returns {string} - Couleur rgba
    //  */
    // getColorForAction: (action) => {
    //   const customColors = Storage.loadCustomColors();
    //   const opacity = Storage.loadColorOpacity() / 100;
    //   const hexColor = customColors[action] || CONFIG.ACTION_COLORS[action] || CONFIG.COLORS.CONNECTED;
    //   return Utils.hexToRgba(hexColor, opacity);
    // },

    /**
     * Récupère la couleur pour un statut de connexion
     * @param {boolean} isConnected - true si connecté
     * @returns {string} - Couleur rgba
     */
    getColorForStatus: (isConnected) => {
      const customColors = Storage.loadCustomColors();
      const opacity = Storage.loadColorOpacity() / 100;
      const key = isConnected ? 'connected' : 'disconnected';
      const hexColor = customColors[key] || (isConnected ? CONFIG.COLORS.CONNECTED : CONFIG.COLORS.DISCONNECTED);
      return Utils.hexToRgba(hexColor, opacity);
    }
  });

  // ==========================================================================
  // MODULE DE MANIPULATION DU DOM
  // ==========================================================================

  /**
   * Module de manipulation du DOM
   * @namespace DOM
   */
  const DOM = Object.freeze({
    /**
     * Récupère tous les pions
     * @returns {NodeList} - Liste des éléments .icon_perso
     */
    getAllPions: () => document.querySelectorAll(CONFIG.SELECTORS.PIONS),

    /**
     * Récupère le nom d'un joueur depuis un pion
     * @param {HTMLElement} pionElement - Élément pion
     * @returns {string|null} - Nom du joueur ou null
     */
    getPlayerName: (pionElement) => {
      const cached = pionElement.getAttribute(CONFIG.ATTRIBUTES.PLAYER_NAME);
      if (cached) return cached;

      const infoElement = pionElement.querySelector(CONFIG.SELECTORS.INFO);
      if (!infoElement?.textContent) return null;

      const playerName = infoElement.textContent.trim();
      pionElement.setAttribute(CONFIG.ATTRIBUTES.PLAYER_NAME, playerName);
      return playerName;
    },

    /**
     * Récupère l'élément .le_icon_perso d'un pion
     * @param {HTMLElement} pionElement - Élément pion
     * @returns {HTMLElement|null} - Élément icon ou null
     */
    getIconElement: (pionElement) =>
      pionElement.querySelector(CONFIG.SELECTORS.ICON),

    /**
     * Vérifie si un avatar est valide sur un pion
     * @param {HTMLElement} pionElement - Élément pion
     * @returns {boolean} - true si avatar valide
     */
    isAvatarValid: (pionElement) => {
      const iconElement = DOM.getIconElement(pionElement);
      if (!iconElement) return false;

      const avatarImg = iconElement.querySelector(`.${CONFIG.CLASSES.AVATAR_IMG}`);
      if (!avatarImg) return false;

      return (
        avatarImg.parentElement !== null &&
        avatarImg.style.display !== 'none' &&
        avatarImg.style.visibility !== 'hidden' &&
        avatarImg.style.opacity !== '0'
      );
    },

    /**
     * Crée un élément image pour avatar
     * @param {string} src - URL de l'image
     * @param {string} alt - Texte alternatif
     * @returns {HTMLImageElement} - Élément img créé
     */
    createAvatarImage: (src, alt) => {
      const img = document.createElement('img');
      img.className = CONFIG.CLASSES.AVATAR_IMG;
      img.src = src;
      img.alt = alt;
      img.setAttribute('loading', 'eager');
      img.setAttribute('decoding', 'sync');
      return img;
    },

    /**
     * Applique les styles CSS à un avatar
     * @param {HTMLImageElement} img - Image de l'avatar
     * @param {string} borderColor - Couleur de la bordure
     */
    applyAvatarStyles: (img, borderColor) => {
      const styles = {
        width: '20px',
        height: '20px',
        'object-fit': 'cover',
        'border-radius': '50%',
        border: `2px solid ${borderColor}`,
        'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        'z-index': String(CONFIG.Z_INDEX.AVATAR),
        'pointer-events': 'none',
        display: 'block',
        visibility: 'visible',
        opacity: '1',
        transition: 'border-color 0.3s ease'
      };

      Object.entries(styles).forEach(([property, value]) => {
        img.style.setProperty(property, value, 'important');
      });
    },

    /**
     * Supprime tous les avatars personnalisés
     */
    removeAllAvatars: () => {
      document.querySelectorAll(`.${CONFIG.CLASSES.AVATAR_IMG}`).forEach(img => img.remove());
      document.querySelectorAll(`.${CONFIG.CLASSES.ACTION_EMOJI}`).forEach(emoji => emoji.remove());
      document.querySelectorAll(`.${CONFIG.CLASSES.PIE_CHART}`).forEach(chart => chart.remove());

      DOM.getAllPions().forEach(pion => {
        pion.removeAttribute(CONFIG.ATTRIBUTES.AVATAR_STATUS);
        pion.removeAttribute(CONFIG.ATTRIBUTES.PLAYER_NAME);
        pion.removeAttribute(CONFIG.ATTRIBUTES.CURRENT_ACTION);
        pion.removeAttribute(CONFIG.ATTRIBUTES.PIE_CHART_APPLIED);
      });
    },

    /**
     * Vérifie si l'élément combat est actif
     * @returns {boolean} - true si en combat
     */
    isInCombat: () => document.querySelector(CONFIG.SELECTORS.COMBAT) !== null,

    /**
     * Récupère le menu des paramètres
     * @returns {HTMLElement|null} - Menu ou null
     */
    getSettingsMenu: () => document.querySelector(CONFIG.SELECTORS.SETTINGS_MENU),

    /**
     * Sauvegarde les styles originaux d'un élément
     * @param {HTMLElement} element - Élément dont sauvegarder les styles
     */
    saveOriginalStyles: (element) => {
      // Ne sauvegarder qu'une seule fois
      if (element.dataset.pmpStylesSaved === 'true') return;

      // Sauvegarder les styles inline
      element.dataset.pmpOriginalStyle = element.getAttribute('style') || '';

      // Marquer comme sauvegardé
      element.dataset.pmpStylesSaved = 'true';

      Utils.debugLog('🔧 Styles originaux sauvegardés pour:', element);
    },

    /**
     * Restaure les styles originaux d'un élément
     * @param {HTMLElement} element - Élément dont restaurer les styles
     */
    restoreOriginalStyles: (element) => {
      // Vérifier si les styles ont été sauvegardés
      if (element.dataset.pmpStylesSaved !== 'true') {
        Utils.debugLog('⚠️ Pas de styles sauvegardés pour:', element);
        return;
      }

      Utils.debugLog('🔧 Restauration des styles pour:', element);
      Utils.debugLog('  - Style actuel:', element.getAttribute('style'));

      // Restaurer les styles inline originaux
      const originalStyle = element.dataset.pmpOriginalStyle;
      if (originalStyle) {
        element.setAttribute('style', originalStyle);
      } else {
        element.removeAttribute('style');
      }

      // Supprimer les attributs de sauvegarde
      delete element.dataset.pmpStylesSaved;
      delete element.dataset.pmpOriginalStyle;

      Utils.debugLog('  - Style restauré:', element.getAttribute('style'));
      Utils.debugLog('✅ Styles restaurés');
    },

    /**
     * Supprime le style global du <head>
     * @returns {boolean} - true si supprimé
     */
    removeGlobalStyle: () => {
      const styleElement = document.getElementById('dreadcast-avatar-resize-style');
      if (styleElement) {
        styleElement.remove();
        Utils.debugLog('🔧 Style global supprimé du <head>');
        return true;
      }
      Utils.debugLog('⚠️ Style global non trouvé');
      return false;
    },

    /**
     * Recrée le style global dans le <head>
     */
    recreateGlobalStyle: () => {
      // Vérifier s'il existe déjà
      if (document.getElementById('dreadcast-avatar-resize-style')) {
        Utils.debugLog('⚠️ Style global déjà présent');
        return;
      }

      // Recréer le style
      SizingSystem.injectStyles();
      Utils.debugLog('🔧 Style global recréé');
    }
  });

  // ==========================================================================
  // MODULE DE DETECTION DES ACTIONS
  // ==========================================================================

  /**
   * Module de détection des actions des joueurs
   * @namespace ActionDetection
   */
  const ActionDetection = Object.freeze({
    /**
     * Détecte l'action d'un joueur depuis son pion
     * @param {HTMLElement} pionElement - Élément pion
     * @returns {string|null} - Nom de l'action ou null
     */
    detectAction: (pionElement) => {
      // Vérifier le cache
      const cached = state.actionCache.get(pionElement);
      if (cached && Date.now() - cached.timestamp < CONFIG.TIMING.ACTION_CACHE_TTL) {
        return cached.action;
      }

      const iconElement = DOM.getIconElement(pionElement);
      if (!iconElement) return null;

      // Trouver l'action active
      const action = CONFIG.ACTION_CLASSES.find(cls =>
        iconElement.classList.contains(cls)
      ) || null;

      // Mettre en cache
      state.actionCache.set(pionElement, {
        action,
        timestamp: Date.now()
      });

      return action;
    },

    /**
     * Récupère l'icône d'action correspondant à une action
     * @param {string} action - Nom de l'action
     * @returns {string|null} - Emoji ou null
     */
    getActionEmoji: (action) =>
      action ? (CONFIG.ACTION_EMOJIS[action.toLowerCase()] || null) : null,

    /**
     * Crée ou met à jour l'élément emoji sur un avatar
     * @param {HTMLElement} iconElement - Élément .le_icon_perso
     * @param {string} action - Nom de l'action
     */
    updateActionEmoji: (iconElement, action) => {
      if (!Storage.loadEmojiEnabled()) {
        const existing = iconElement.querySelector(`.${CONFIG.CLASSES.ACTION_EMOJI}`);
        existing?.remove();
        return;
      }

      const emoji = ActionDetection.getActionEmoji(action);
      if (!emoji) {
        const existing = iconElement.querySelector(`.${CONFIG.CLASSES.ACTION_EMOJI}`);
        existing?.remove();
        return;
      }

      let emojiElement = iconElement.querySelector(`.${CONFIG.CLASSES.ACTION_EMOJI}`);
      if (!emojiElement) {
        emojiElement = document.createElement('span');
        emojiElement.className = CONFIG.CLASSES.ACTION_EMOJI;
        iconElement.appendChild(emojiElement);
      }

      if (emojiElement.textContent !== emoji) {
        emojiElement.textContent = emoji;
      }
    },

    /**
     * Récupère la couleur de bordure pour un pion
     * @param {HTMLElement} pionElement - Élément pion
     * @returns {string} - Couleur rgba
     */
    getBorderColor: (pionElement) => {
      const iconElement = DOM.getIconElement(pionElement);
      if (!iconElement) return Storage.getColorForStatus(false);

      const isConnected = iconElement.classList.contains(CONFIG.CLASSES.CONNECTED);
      return Storage.getColorForStatus(isConnected);
    },

    /**
     * Détecte si un joueur est en mode furtif
     * @param {string} playerName - Nom du joueur
     * @returns {boolean} - true si en mode furtif
     */
    detectStealthMode: (playerName) => {
      try {
        // Trouver l'élément du pion dans le DOM
        const pionElement = document.querySelector(`[data-player-name="${playerName}"]`);

        if (!pionElement) {
          Utils.debugLog('🔍 Pion non trouvé pour détection furtif:', playerName);
          return false;
        }

        const iconElement = DOM.getIconElement(pionElement);
        if (!iconElement) {
          Utils.debugLog('🔍 IconElement non trouvé pour:', playerName);
          return false;
        }

        // Chercher indicateurs de mode furtif dans les classes d'action
        const stealthIndicators = ['cacher', 'stealth', 'furtif', 'discrétion'];

        const hasStealthClass = stealthIndicators.some(indicator =>
          iconElement.classList.contains(indicator)
        );

        // Log des classes pour diagnostic
        if (hasStealthClass) {
          const foundIndicators = stealthIndicators.filter(indicator =>
            iconElement.classList.contains(indicator)
          );
          Utils.debugLog('🔍 Mode furtif détecté:', playerName, 'Classes:', foundIndicators.join(', '));
        }

        return hasStealthClass;
      } catch (error) {
        Utils.debugLog('❌ Erreur détection furtif:', playerName, error);
        return false;
      }
    }
  });

  // ==========================================================================
  // MODULE DE CHARGEMENT D'IMAGE
  // ==========================================================================

  /**
   * Module de chargement d'images
   * @namespace ImageLoader
   */
  const ImageLoader = Object.freeze({
    /**
     * Vérifie si une image existe
     * @param {string} url - URL de l'image
     * @param {string} playerName - Nom du joueur
     * @returns {Promise<boolean>} - true si l'image existe
     */
    checkImageExists: async (url, playerName) => {
      const cached = state.avatarUrlCache.get(playerName);
      if (cached !== undefined) return cached.exists;

      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          state.avatarUrlCache.set(playerName, { url, exists: true });
          resolve(true);
        };

        img.onerror = () => {
          state.avatarUrlCache.set(playerName, { url, exists: false });
          resolve(false);
        };

        img.src = url;
      });
    }
  });

  // ==========================================================================
  // FONCTIONS HELPER POUR LE MODE FURTIF
  // ==========================================================================

  /**
   * Applique le flou sur un avatar (TOUJOURS) et log si l'état a changé
   * @param {string} playerName - Nom du joueur
   * @param {boolean} isStealth - true si en mode furtif
   */
  const applyStealthBlurIfChanged = (playerName, isStealth) => {
    const previousState = state.previousStealthStates.get(playerName);

    // TOUJOURS appliquer le flou, même si l'état n'a pas changé
    // Cela garantit que le flou est maintenu même si l'avatar est recréé
    Avatar.applyStealthBlur(playerName, isStealth);

    // Logger uniquement si l'état a changé
    if (isStealth !== previousState) {
      state.previousStealthStates.set(playerName, isStealth);
      Utils.debugLog('🥷 État furtif changé:', playerName, isStealth ? 'FURTIF' : 'VISIBLE');
    }
  };

  // ==========================================================================
  // MODULE DE GESTION DES AVATARS
  // ==========================================================================

  /**
   * Module de gestion des avatars
   * @namespace Avatar
   */
  const Avatar = Object.freeze({
    /**
     * Applique un avatar personnalisé sur un pion
     * @param {HTMLElement} pionElement - Élément pion
     * @param {boolean} force - Forcer la réapplication
     * @returns {Promise<void>}
     */
    apply: async (pionElement, force = false) => {
      if (!Storage.loadAvatarEnabled()) return;

      // TEST FIX v0.5.4 - Correction concaténation des noms
      // Ne pas appliquer d'avatar simple sur les pions multiples (2+ joueurs)
      const iconElements = pionElement.querySelectorAll(CONFIG.SELECTORS.ICON);
      if (iconElements.length >= 2) {
        return; // Ce pion aura un pie chart à la place
      }

      const cachedStatus = state.avatarCache.get(pionElement);

      // Si déjà appliqué et valide, mettre à jour uniquement la bordure
      if (!force && cachedStatus === CONFIG.STATUS.SUCCESS && DOM.isAvatarValid(pionElement)) {
        Avatar.updateBorder(pionElement);
        return;
      }

      // Si échec précédent et pas de force, skip
      if (!force && cachedStatus === CONFIG.STATUS.FAILED) return;

      const playerName = DOM.getPlayerName(pionElement);
      if (!playerName) {
        state.avatarCache.set(pionElement, CONFIG.STATUS.FAILED);
        return;
      }

      const avatarUrl = Utils.buildAvatarUrl(playerName);

      // Vérifier l'existence de l'image
      if (!state.avatarUrlCache.has(playerName) || force) {
        const exists = await ImageLoader.checkImageExists(avatarUrl, playerName);
        if (!exists) {
          state.avatarCache.set(pionElement, CONFIG.STATUS.FAILED);
          pionElement.setAttribute(CONFIG.ATTRIBUTES.AVATAR_STATUS, CONFIG.STATUS.FAILED);
          return;
        }
      } else if (!state.avatarUrlCache.get(playerName).exists) {
        return;
      }

      const iconElement = DOM.getIconElement(pionElement);
      if (!iconElement) return;

      let avatarImg = iconElement.querySelector(`.${CONFIG.CLASSES.AVATAR_IMG}`);

      if (!avatarImg) {
        avatarImg = DOM.createAvatarImage(avatarUrl, playerName);
        if (iconElement.firstChild) {
          iconElement.insertBefore(avatarImg, iconElement.firstChild);
        } else {
          iconElement.appendChild(avatarImg);
        }
      } else if (!DOM.isAvatarValid(pionElement)) {
        avatarImg.src = avatarUrl;
        avatarImg.alt = playerName;
      }

      const borderColor = ActionDetection.getBorderColor(pionElement);
      DOM.applyAvatarStyles(avatarImg, borderColor);

      if (!avatarImg.complete || avatarImg.naturalHeight === 0) {
        avatarImg.src = avatarImg.src;
      }

      pionElement.setAttribute(CONFIG.ATTRIBUTES.AVATAR_STATUS, CONFIG.STATUS.SUCCESS);
      pionElement.setAttribute(CONFIG.ATTRIBUTES.PLAYER_NAME, playerName);
      state.avatarCache.set(pionElement, CONFIG.STATUS.SUCCESS);

      // Gérer l'emoji d'action
      const action = ActionDetection.detectAction(pionElement);
      const currentAction = pionElement.getAttribute(CONFIG.ATTRIBUTES.CURRENT_ACTION);

      if (force || action !== currentAction) {
        ActionDetection.updateActionEmoji(iconElement, action);
        pionElement.setAttribute(CONFIG.ATTRIBUTES.CURRENT_ACTION, action || '');
      }

      // Vérifier et appliquer le mode furtif
      const isStealth = ActionDetection.detectStealthMode(playerName);
      applyStealthBlurIfChanged(playerName, isStealth);
    },

    /**
     * Met à jour uniquement la bordure d'un avatar
     * @param {HTMLElement} pionElement - Élément pion
     */
    updateBorder: (pionElement) => {
      const iconElement = DOM.getIconElement(pionElement);
      const avatarImg = iconElement?.querySelector(`.${CONFIG.CLASSES.AVATAR_IMG}`);

      if (avatarImg) {
        const borderColor = ActionDetection.getBorderColor(pionElement);
        avatarImg.style.setProperty('border', `2px solid ${borderColor}`, 'important');

        // Vérifier et appliquer le mode furtif
        const playerName = DOM.getPlayerName(pionElement);
        if (playerName) {
          const isStealth = ActionDetection.detectStealthMode(playerName);
          applyStealthBlurIfChanged(playerName, isStealth);
        }
      }
    },

    /**
     * Applique ou retire le flou sur un avatar en mode furtif
     * @param {string} playerName - Nom du joueur
     * @param {boolean} isStealth - true si en mode furtif
     */
    applyStealthBlur: (playerName, isStealth) => {
      try {
        if (!CONFIG.STEALTH.ENABLE_BLUR) {
          Utils.debugLog('🔧 Flou désactivé dans CONFIG');
          return;
        }

        const pionElement = document.querySelector(`[data-player-name="${playerName}"]`);
        if (!pionElement) {
          Utils.debugLog('⚠️ Pion non trouvé pour:', playerName);
          return;
        }

        const iconElement = DOM.getIconElement(pionElement);
        const avatarImg = iconElement?.querySelector(`.${CONFIG.CLASSES.AVATAR_IMG}`);

        if (!avatarImg) {
          Utils.debugLog('⚠️ Avatar non trouvé pour:', playerName);
          return;
        }

        const hadBlurBefore = avatarImg.classList.contains('pmp-avatar-blur');

        if (isStealth) {
          avatarImg.classList.add('pmp-avatar-blur');
          if (!hadBlurBefore) {
            Utils.debugLog('🥷 Flou appliqué:', playerName);
          } else {
            Utils.debugLog('🔄 Flou maintenu:', playerName);
          }
        } else {
          avatarImg.classList.remove('pmp-avatar-blur');
          if (hadBlurBefore) {
            Utils.debugLog('👁️ Flou retiré:', playerName);
          }
        }
      } catch (error) {
        Utils.debugLog('❌ Erreur application flou:', playerName, error);
      }
    },

    /**
     * Applique les avatars à tous les pions
     * @param {boolean} force - Forcer la réapplication
     * @returns {Promise<void>}
     */
    applyToAll: async (force = false) => {
      if (!Storage.loadAvatarEnabled()) {
        DOM.removeAllAvatars();
        return;
      }

      const pions = Array.from(DOM.getAllPions());

      for (const pion of pions) {
        if (!force && DOM.isAvatarValid(pion)) {
          Avatar.updateBorder(pion);
          continue;
        }
        await Avatar.apply(pion, force);
      }

      // Appliquer les pie charts après les avatars
      await PieChartManager.applyAll();
    },

    /**
     * Réapplique les avatars de manière synchrone
     * @param {boolean} force - Forcer la réapplication
     */
    reapplySync: (force = false) => {
      if (!Storage.loadAvatarEnabled()) return;

      DOM.getAllPions().forEach(pion => {
        if (!force && DOM.isAvatarValid(pion)) {
          Avatar.updateBorder(pion);
          return;
        }
        Avatar.apply(pion, force);
      });

      PieChartManager.applyAll();
    },

    /**
     * Rafraîchit tous les avatars (force update des bordures)
     */
    refreshAll: () => {
      DOM.getAllPions().forEach(pion => {
        const iconElement = DOM.getIconElement(pion);
        const avatarImg = iconElement?.querySelector(`.${CONFIG.CLASSES.AVATAR_IMG}`);

        if (avatarImg) {
          const borderColor = ActionDetection.getBorderColor(pion);
          avatarImg.style.setProperty('border', `3px solid ${borderColor}`, 'important');
          avatarImg.style.setProperty('box-shadow', `0 2px 8px ${borderColor}`, 'important');
        }
      });
    }
  });

  // ==========================================================================
  // MODULE DE GESTION DES PIE CHARTS (GROUPES DE PIONS)
  // ==========================================================================

  /**
   * Module de gestion des pie charts pour pions multiples
   * @namespace PieChartManager
   */
  const PieChartManager = Object.freeze({
    /**
     * Détecte les pions multiples (plusieurs joueurs sur une case)
     * @returns {Array<Object>} - Liste des pions multiples
     */
    detectMultiplePions: () => {
      const allPions = Array.from(DOM.getAllPions());

      return allPions
        .filter(Utils.isElementVisible)
        .map(container => ({
          container,
          iconElements: Array.from(container.querySelectorAll(CONFIG.SELECTORS.ICON)),
          count: container.querySelectorAll(CONFIG.SELECTORS.ICON).length
        }))
        .filter(data => data.count >= 2)
        .map(data => {
          const infoElement = data.container.querySelector(CONFIG.SELECTORS.INFO);
          const playerNames = infoElement
            ? Utils.parsePlayerNames(infoElement.innerHTML)
            : [];

          return { ...data, playerNames };
        });
    },

    /**
     * Extrait et trie les données des joueurs par priorité
     * @param {Object} pionData - Données du pion multiple
     * @returns {Array<Object>} - Joueurs triés par priorité
     */
    extractAndSortPlayers: (pionData) => {
      const { iconElements, playerNames } = pionData;

      const playersData = iconElements.map((iconElement, index) => {
        const playerName = playerNames[index] || `Joueur ${index + 1}`;

        const action = CONFIG.ACTION_CLASSES.find(cls =>
          iconElement.classList.contains(cls)
        ) || null;

        const isConnected = iconElement.classList.contains(CONFIG.CLASSES.CONNECTED);
        const emoji = ActionDetection.getActionEmoji(action) || '';
        const avatarUrl = Utils.buildAvatarUrl(playerName);

        // Calculer la priorité
        let priority = 0;
        if (action === 'en_combat' || action === 'encombat') {
          priority = 3;
        } else if (isConnected) {
          priority = 2;
        } else {
          priority = 1;
        }

        return { iconElement, playerName, action, isConnected, emoji, avatarUrl, priority };
      });

      return playersData.sort((a, b) => b.priority - a.priority);
    },

    /**
     * Calcule les angles pour les portions du pie chart
     * @param {number} count - Nombre de joueurs
     * @returns {Array<Object>} - [{startAngle, endAngle}, ...]
     */
    calculateAngles: (count) => {
      const anglePerSlice = 360 / count;
      return Array.from({ length: count }, (_, i) => ({
        startAngle: i * anglePerSlice - 90,
        endAngle: (i + 1) * anglePerSlice - 90
      }));
    },

    /**
     * Génère le path SVG pour une portion de pie chart
     * @param {number} startAngle - Angle de début (degrés)
     * @param {number} endAngle - Angle de fin (degrés)
     * @returns {string} - Path SVG
     */
    generatePiePath: (startAngle, endAngle) => {
      const { RADIUS, CENTER_X, CENTER_Y } = CONFIG.PIE_CHART;

      const startRad = Utils.degreesToRadians(startAngle);
      const endRad = Utils.degreesToRadians(endAngle);

      const start = Utils.pointOnCircle(startRad, RADIUS, CENTER_X, CENTER_Y);
      const end = Utils.pointOnCircle(endRad, RADIUS, CENTER_X, CENTER_Y);

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      return `M ${CENTER_X},${CENTER_Y} L ${start.x},${start.y} A ${RADIUS},${RADIUS} 0 ${largeArcFlag},1 ${end.x},${end.y} Z`;
    },

    /**
     * Crée le SVG du pie chart
     * @param {Array<Object>} playersData - Données des joueurs triés
     * @param {HTMLElement} container - Conteneur où insérer le pie chart
     * @returns {SVGElement} - Élément SVG créé
     */
    createPieChart: (playersData, container) => {
      const count = playersData.length;
      const angles = PieChartManager.calculateAngles(count);

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 100 100');
      svg.setAttribute('class', CONFIG.CLASSES.PIE_CHART);
      svg.style.cssText = `
        width: ${CONFIG.PIE_CHART.SIZE}px;
        height: ${CONFIG.PIE_CHART.SIZE}px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: ${CONFIG.Z_INDEX.AVATAR};
        pointer-events: none;
      `;

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);

      // Créer chaque portion avec son avatar
      playersData.forEach((player, index) => {
        const { startAngle, endAngle } = angles[index];
        const sliceId = `slice-${Date.now()}-${index}`;

        // ClipPath
        const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
        clipPath.setAttribute('id', sliceId);

        const clipPathPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        clipPathPath.setAttribute('d', PieChartManager.generatePiePath(startAngle, endAngle));
        clipPath.appendChild(clipPathPath);
        defs.appendChild(clipPath);

        // Image avec clipPath
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', player.avatarUrl);
        image.setAttribute('x', '0');
        image.setAttribute('y', '0');
        image.setAttribute('width', '100');
        image.setAttribute('height', '100');
        image.setAttribute('clip-path', `url(#${sliceId})`);
        image.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        svg.appendChild(image);

        // Bordure blanche
        const borderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        borderPath.setAttribute('d', PieChartManager.generatePiePath(startAngle, endAngle));
        borderPath.setAttribute('fill', 'none');
        borderPath.setAttribute('stroke', 'white');
        borderPath.setAttribute('stroke-width', String(CONFIG.PIE_CHART.BORDER_WIDTH));
        svg.appendChild(borderPath);
      });

      // Cercle central
      const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerCircle.setAttribute('cx', String(CONFIG.PIE_CHART.CENTER_X));
      centerCircle.setAttribute('cy', String(CONFIG.PIE_CHART.CENTER_Y));
      centerCircle.setAttribute('r', String(CONFIG.PIE_CHART.CENTER_RADIUS));
      centerCircle.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
      centerCircle.setAttribute('class', CONFIG.CLASSES.PIE_CHART_CENTER);
      centerCircle.style.pointerEvents = 'auto';
      centerCircle.style.cursor = 'pointer';
      svg.appendChild(centerCircle);

      // Texte au centre (nombre de joueurs)
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(CONFIG.PIE_CHART.CENTER_X));
      text.setAttribute('y', String(CONFIG.PIE_CHART.CENTER_Y));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', 'rgba(0, 255, 13, 1)');
      text.setAttribute('font-size', '20');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('class', CONFIG.CLASSES.PIE_CHART_COUNT);
      text.textContent = String(count);
      text.style.pointerEvents = 'none';
      svg.appendChild(text);

      // Attacher la pop up liste joueur au survol (NE MARCHE PAS ENCORE)
      PieChartManager.attachHoverEvents(centerCircle, playersData, container);

      return svg;
    },

    /**
     * Crée le popup avec la liste des joueurs
     * @param {Array<Object>} playersData - Données des joueurs
     * @returns {HTMLElement} - Élément popup
     */
    createPopup: (playersData) => {
      const popup = document.createElement('div');
      popup.className = CONFIG.CLASSES.PIE_CHART_POPUP;
      popup.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        background: rgba(26, 26, 26, 0.98);
        border: 1px solid #4a9eff;
        border-radius: 8px;
        padding: 12px;
        min-width: 200px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        z-index: ${CONFIG.Z_INDEX.PANEL};
        opacity: 0;
        transition: opacity ${CONFIG.TIMING.POPUP_TRANSITION}ms ease, transform ${CONFIG.TIMING.POPUP_TRANSITION}ms ease;
        pointer-events: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      // Header
      const header = document.createElement('div');
      header.style.cssText = `
        color: #4a9eff;
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(74, 158, 255, 0.3);
      `;
      header.textContent = `👥 ${playersData.length} joueurs sur la case`;
      popup.appendChild(header);

      // Liste des joueurs
      playersData.forEach(player => {
        const playerRow = document.createElement('div');
        playerRow.style.cssText = `
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          margin: 4px 0;
          background: rgba(42, 42, 42, 0.5);
          border-radius: 4px;
        `;

        const avatar = document.createElement('img');
        avatar.src = player.avatarUrl;
        avatar.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid ${player.isConnected ? '#4ade80' : '#ffffff'};
          object-fit: cover;
        `;
        playerRow.appendChild(avatar);

        const name = document.createElement('span');
        name.textContent = player.playerName;
        name.style.cssText = `
          flex: 1;
          color: #ffffff;
          font-size: 13px;
          font-weight: 500;
        `;
        playerRow.appendChild(name);

        if (player.emoji) {
          const emoji = document.createElement('span');
          emoji.textContent = player.emoji;
          emoji.style.fontSize = '16px';
          playerRow.appendChild(emoji);
        }

        popup.appendChild(playerRow);
      });

      return popup;
    },

    /**
     * Attache les événements de survol au pie chart
     * @param {SVGElement} centerCircle - Cercle central du pie chart
     * @param {Array<Object>} playersData - Données des joueurs
     * @param {HTMLElement} container - Conteneur du pie chart
     */
    attachHoverEvents: (centerCircle, playersData, container) => {
      let popup = null;
      let hoverTimeout = null;

      centerCircle.addEventListener('mouseenter', () => {
        hoverTimeout = setTimeout(() => {
          popup = PieChartManager.createPopup(playersData);
          container.appendChild(popup);

          setTimeout(() => {
            if (popup) {
              popup.style.opacity = '1';
              popup.style.transform = 'translateX(-50%) translateY(-5px)';
            }
          }, 10);
        }, CONFIG.TIMING.HOVER_DELAY);
      });

      centerCircle.addEventListener('mouseleave', () => {
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }

        if (popup) {
          popup.style.opacity = '0';
          popup.style.transform = 'translateX(-50%) translateY(-10px)';
          setTimeout(() => {
            popup?.remove();
            popup = null;
          }, CONFIG.TIMING.POPUP_TRANSITION);
        }
      });
    },

    /**
     * Applique les pie charts à tous les pions multiples
     */
    applyAll: () => {
      const multiplePions = PieChartManager.detectMultiplePions();

      if (multiplePions.length === 0) return;

      multiplePions.forEach(pionData => {
        const { container, iconElements } = pionData;

        // TEST FIX v0.5.4 - Correction clignotement
        // Si le pie chart est déjà appliqué, ne rien faire
        if (container.getAttribute(CONFIG.ATTRIBUTES.PIE_CHART_APPLIED) === 'true') {
          return; // Pie chart déjà appliqué, pas de recréation
        }

        // Extraire et trier les joueurs
        const sortedPlayers = PieChartManager.extractAndSortPlayers(pionData);

        // Supprimer les avatars existants sur tous les .le_icon_perso
        iconElements.forEach(iconEl => {
          iconEl.querySelector(`.${CONFIG.CLASSES.AVATAR_IMG}`)?.remove();
          iconEl.querySelector(`.${CONFIG.CLASSES.PIE_CHART}`)?.remove();
        });

        // Créer le pie chart sur le premier .le_icon_perso
        const mainIconElement = iconElements[0];

        // Sauvegarder les styles originaux AVANT modification
        DOM.saveOriginalStyles(mainIconElement);

        // Forcer position pour le centrage
        const computedStyle = window.getComputedStyle(mainIconElement);
        if (computedStyle.position === 'static') {
          mainIconElement.style.position = 'relative';
        }

        const pieChart = PieChartManager.createPieChart(sortedPlayers, mainIconElement);
        mainIconElement.appendChild(pieChart);

        // Cacher les autres pions vanilla
        iconElements.forEach((iconEl, idx) => {
          if (idx > 0) {
            // Sauvegarder les styles originaux AVANT modification
            DOM.saveOriginalStyles(iconEl);
            iconEl.style.setProperty('display', 'none', 'important');
          }
        });

        container.setAttribute(CONFIG.ATTRIBUTES.PIE_CHART_APPLIED, 'true');
      });
    }
  });

  // ==========================================================================
  // MODULE DE DETACTION DU MODE COMBAT
  // ==========================================================================

  /**
   * Module de détection du mode combat
   * @namespace CombatDetection
   */
  const CombatDetection = Object.freeze({
    /**
     * Démarre la détection du combat
     */
    start: () => {
      const intervalId = setInterval(() => {
        const inCombat = DOM.isInCombat();

        if (inCombat && !state.isInCombat) {
          CombatDetection.onEnterCombat();
        } else if (!inCombat && state.isInCombat) {
          CombatDetection.onExitCombat();
        }
      }, CONFIG.TIMING.COMBAT_CHECK_INTERVAL);

      updateState({ combatCheckInterval: intervalId });
    },

    /**
     * Callback lors de l'entrée en combat
     */
    onEnterCombat: () => {
      Utils.debugLog('🚨 ENTRÉE EN COMBAT - Désactivation du script');
      updateState({ isInCombat: true });

      // 1. Arrêter le ReapplicationSystem
      ReapplicationSystem.stop();
      Utils.debugLog('🔧 ReapplicationSystem arrêté');

      // 2. Restaurer les styles originaux de tous les .le_icon_perso
      const allIconElements = document.querySelectorAll('.le_icon_perso');
      Utils.debugLog('🔧 Restauration des styles pour', allIconElements.length, 'éléments .le_icon_perso');
      allIconElements.forEach(iconEl => {
        DOM.restoreOriginalStyles(iconEl);
      });

      // 3. Supprimer le <style> global du <head>
      DOM.removeGlobalStyle();

      // 4. Supprimer tous les éléments créés par le script
      DOM.removeAllAvatars();

      Utils.debugLog('✅ Tous les éléments du script ont été supprimés - Interface vanilla restaurée');
    },

    /**
     * Callback lors de la sortie du combat
     */
    onExitCombat: () => {
      Utils.debugLog('✅ SORTIE DE COMBAT - Réactivation du script');
      updateState({ isInCombat: false });

      // 1. Recréer le <style> global dans le <head>
      DOM.recreateGlobalStyle();

      // 2. Réappliquer tous les avatars
      Avatar.applyToAll(true);
      Utils.debugLog('🔧 Avatars réappliqués');

      // 3. Redémarrer le ReapplicationSystem
      ReapplicationSystem.start();
      Utils.debugLog('🔧 ReapplicationSystem redémarré');

      Utils.debugLog('✅ Tous les avatars ont été réappliqués');
    },

    /**
     * Désactive le slider de taille (A VIRER)
     */
    disableSlider: () => {
      const slider = document.getElementById('avatar-size-slider');
      const valueDisplay = document.getElementById('avatar-size-value');

      if (slider) {
        slider.disabled = true;
        slider.style.opacity = '0.5';
        slider.style.cursor = 'not-allowed';
      }

      if (valueDisplay) {
        valueDisplay.textContent = '100% ⚔️';
        valueDisplay.style.color = '#ef4444';
      }
    },

    /**
     * Réactive le slider de taille (A VIRER)
     */
    enableSlider: () => {
      const slider = document.getElementById('avatar-size-slider');
      const valueDisplay = document.getElementById('avatar-size-value');

      if (slider) {
        slider.disabled = false;
        slider.style.opacity = '1';
        slider.style.cursor = 'pointer';

        const currentSize = Storage.loadAvatarSize();
        slider.value = String(currentSize);

        if (valueDisplay) {
          valueDisplay.textContent = `${currentSize}%`;
          valueDisplay.style.color = '#667eea';
        }
      }
    },

    /**
     * Arrête la détection du combat
     */
    stop: () => {
      if (state.combatCheckInterval) {
        clearInterval(state.combatCheckInterval);
        updateState({ combatCheckInterval: null });
      }
    }
  });

  // ==========================================================================
  // MODULE DE REAPPLICATION DES AVATARS
  // ==========================================================================

  /**
   * Module de réapplication continue des avatars
   * @namespace ReapplicationSystem
   */
  const ReapplicationSystem = Object.freeze({
    /**
     * Réapplication rapide via requestAnimationFrame
     */
    ultraFastReapplication: () => {
      const now = Date.now();

      if (now - state.lastReapplyTime < CONFIG.TIMING.RAF_THROTTLE) {
        updateState({
          reapplyAnimationFrameId: requestAnimationFrame(ReapplicationSystem.ultraFastReapplication)
        });
        return;
      }

      updateState({ lastReapplyTime: now });

      if (Storage.loadAvatarEnabled()) {
        Avatar.reapplySync(false);
      }

      updateState({
        reapplyAnimationFrameId: requestAnimationFrame(ReapplicationSystem.ultraFastReapplication)
      });
    },

    /**
     * Démarre le système de réapplication
     */
    start: () => {
      ReapplicationSystem.stop();

      const intervalId = setInterval(() => {
        if (Storage.loadAvatarEnabled()) {
          Avatar.reapplySync(false);
        }
      }, CONFIG.TIMING.REAPPLY_INTERVAL);

      updateState({ reapplyIntervalId: intervalId });
      ReapplicationSystem.ultraFastReapplication();
    },

    /**
     * Arrête le système de réapplication
     */
    stop: () => {
      if (state.reapplyIntervalId) {
        clearInterval(state.reapplyIntervalId);
      }
      if (state.reapplyAnimationFrameId) {
        cancelAnimationFrame(state.reapplyAnimationFrameId);
      }
      updateState({
        reapplyIntervalId: null,
        reapplyAnimationFrameId: null
      });
    }
  });

  // ==========================================================================
  // MODULE DE GESTION DES TAILLES
  // ==========================================================================

  /**
   * Module de gestion des tailles (avatars et emojis)
   * @namespace SizingSystem
   */
  const SizingSystem = Object.freeze({
    /**
     * Applique la taille des avatars et emojis via CSS
     * @param {number} size - Taille des avatars en %
     */
    applyAvatarSize: (size) => {
      const scale = size / 100;
      const emojiSize = Storage.loadEmojiSize();

      let styleElement = document.getElementById('dreadcast-avatar-resize-style');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dreadcast-avatar-resize-style';
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = `
        .personnages .icon_perso {
          transform: scale(${scale}) !important;
          transform-origin: center center !important;
        }

        .personnages .icon_perso .le_icon_perso {
          transform: scale(1) !important;
          position: relative !important;
        }

        .${CONFIG.CLASSES.AVATAR_IMG} {
          pointer-events: none !important;
          width: 70px !important;
          height: 70px !important;
          object-fit: cover !important;
          border-radius: 50% !important;
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: ${CONFIG.Z_INDEX.AVATAR} !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          transition: border-color 0.3s ease !important;
        }

        .personnages .icon_perso .le_icon_perso > * {
          position: relative !important;
        }

        .personnages .icon_perso .le_icon_perso > .${CONFIG.CLASSES.AVATAR_IMG} {
          z-index: ${CONFIG.Z_INDEX.AVATAR} !important;
        }

        .personnages .icon_perso .le_icon_perso > svg,
        .personnages .icon_perso .le_icon_perso > use {
          z-index: 1 !important;
        }

        .${CONFIG.CLASSES.ACTION_EMOJI} {
          position: absolute !important;
          top: -5px !important;
          right: -15px !important;
          font-size: ${emojiSize}px !important;
          border-radius: 50% !important;
          width: ${emojiSize * 0.56}px !important;
          height: ${emojiSize * 0.56}px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
          z-index: ${CONFIG.Z_INDEX.EMOJI} !important;
          pointer-events: none !important;
          border: 2px solid rgba(0, 0, 0, 0.1) !important;
          transition: opacity 0.2s ease !important;
        }

        /* Mode furtif - Flou de l'avatar */
        .pmp-avatar-blur {
          filter: blur(${CONFIG.STEALTH.BLUR_AMOUNT}px) !important;
          -webkit-filter: blur(${CONFIG.STEALTH.BLUR_AMOUNT}px) !important;
          transition: filter 0.3s ease !important;
        }

        .pmp-avatar-blur:hover {
          filter: blur(${CONFIG.STEALTH.HOVER_BLUR_AMOUNT}px) !important;
          -webkit-filter: blur(${CONFIG.STEALTH.HOVER_BLUR_AMOUNT}px) !important;
        }
      `;
    },

    /**
     * Applique la taille des emojis uniquement
     * @param {number} size - Taille des emojis en px
     */
    applyEmojiSize: (size) => {
      const currentAvatarSize = Storage.loadAvatarSize();
      SizingSystem.applyAvatarSize(currentAvatarSize);
    },

    /**
     * Injecte les styles globaux dans le <head>
     */
    injectStyles: () => {
      const currentAvatarSize = Storage.loadAvatarSize();
      SizingSystem.applyAvatarSize(currentAvatarSize);
    }
  });

  // ==========================================================================
  // MODULE DES COMPOSANTS UI
  // ==========================================================================

  /**
   * Module de composants d'interface utilisateur
   * @namespace UIComponents
   */
  const UIComponents = Object.freeze({
    /**
     * Crée le comportement draggable pour un élément
     * @param {HTMLElement} element - Élément à rendre draggable
     * @param {HTMLElement} handle - Élément servant de poignée
     */
    createDraggableBehavior: (element, handle) => {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      let isDragging = false;

      const elementDrag = (e) => {
        if (!isDragging) return;

        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const newTop = element.offsetTop - pos2;
        const newLeft = element.offsetLeft - pos1;

        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;

        element.style.top = `${Utils.clamp(newTop, 0, maxY)}px`;
        element.style.left = `${Utils.clamp(newLeft, 0, maxX)}px`;
      };

      const closeDrag = (e) => {
        if (e) e.stopPropagation();
        isDragging = false;
        handle.style.cursor = 'move';
        document.body.style.userSelect = '';
        document.onmouseup = null;
        document.onmousemove = null;
      };

      handle.onmousedown = (e) => {
        e.preventDefault();
        e.stopPropagation();

        isDragging = true;
        handle.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';

        const rect = element.getBoundingClientRect();
        element.style.transform = 'none';
        element.style.top = `${rect.top}px`;
        element.style.left = `${rect.left}px`;

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDrag;
        document.onmousemove = elementDrag;
      };
    },

    /**
     * Crée le panneau de configuration HTML
     * @returns {HTMLElement} - Panneau de configuration créé
     */
    createConfigPanel: () => {
      const overlay = document.createElement('div');
      overlay.id = 'dreadcast-avatar-config-panel';
      // overlay.style.cssText = `
      //   display: none !important;
      //   position: fixed !important;
      //   top: 0 !important;
      //   left: 0 !important;
      //   width: 100% !important;
      //   height: 100% !important;
      //   background: rgba(0, 0, 0, 0.6) !important;
      //   z-index: ${CONFIG.Z_INDEX.OVERLAY} !important;
      // `;

      const panel = document.createElement('div');
      panel.id = 'pmp-settings-menu';
      panel.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: ${CONFIG.Z_INDEX.PANEL} !important;
        width: 480px !important;
        max-height: 90vh !important;
        background: #1a1a1a !important;
        border: 1px solid #3a3a3a !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        color: #ffffff !important;
        display: flex !important;
        flex-direction: column !important;
        animation: fadeIn 0.2s ease !important;
      `;

      panel.innerHTML = UIComponents.getPanelHTML();
      overlay.appendChild(panel);
      document.body.appendChild(overlay);

      UIComponents.attachPanelEvents();
      return overlay;
    },

    /**
     * Génère le HTML du panneau de configuration
     * @returns {string} - HTML du panneau
     */
    getPanelHTML: () => `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }

        #pmp-settings-menu .pmp-content::-webkit-scrollbar {
          width: 8px !important;
        }
        #pmp-settings-menu .pmp-content::-webkit-scrollbar-track {
          background: transparent !important;
        }
        #pmp-settings-menu .pmp-content::-webkit-scrollbar-thumb {
          background: #333333 !important;
          border-radius: 4px !important;
        }
        #pmp-settings-menu .pmp-content::-webkit-scrollbar-thumb:hover {
          background: #4a9eff !important;
        }

        #pmp-settings-menu .pmp-slider::-webkit-slider-thumb {
          -webkit-appearance: none !important;
          width: 18px !important;
          height: 18px !important;
          background: #4a9eff !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        #pmp-settings-menu .pmp-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2) !important;
          box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.2) !important;
        }
        #pmp-settings-menu .pmp-slider::-moz-range-thumb {
          width: 18px !important;
          height: 18px !important;
          background: #4a9eff !important;
          border: none !important;
          border-radius: 50% !important;
          cursor: pointer !important;
        }

        @media (max-width: 600px) {
          #pmp-settings-menu {
            width: 90vw !important;
            max-width: 400px !important;
          }
          #pmp-settings-menu .pmp-option {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
        }
      </style>

      <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 20px 24px !important; border-bottom: 1px solid #3a3a3a !important; cursor: move !important; user-select: none !important;" class="pmp-header-drag">
        <div>
          <span style="margin: 0 !important; font-size: 20px !important; font-weight: 600 !important;">⚙️ PimpMyPion</span>
          <span style="margin-left: 8px !important; padding: 4px 8px !important; background: #2a2a2a !important; border-radius: 6px !important; font-size: 12px !important; font-weight: 500 !important; color: #a0a0a0 !important;">v ${VERSION}</span>
        </div>
        <button id="avatar-close-btn" style="width: 32px !important; height: 32px !important; padding: 0 !important; background: transparent !important; border: none !important; border-radius: 6px !important; font-size: 20px !important; color: #a0a0a0 !important; cursor: pointer !important; transition: all 0.2s ease !important;">✕</button>
      </div>

      <div class="pmp-content" style="flex: 1 !important; overflow-y: auto !important; padding: 8px !important;">

        <!-- Section Affichage -->
        <div style="margin-bottom: 8px !important; background: #2a2a2a !important; border-radius: 10px !important; overflow: hidden !important;">
          <h3 style="margin: 0 !important; padding: 16px 20px !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: #a0a0a0 !important; background: #1a1a1a !important;">Affichage</h3>
          <div style="padding: 8px !important;">

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; margin-bottom: 4px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">🖼️</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Avatars</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Afficher les avatars des joueurs</span>
                </div>
              </div>
              <label style="position: relative !important; display: inline-block !important; width: 48px !important; height: 28px !important; cursor: pointer !important;">
                <input type="checkbox" id="avatar-enabled-checkbox" checked style="opacity: 0 !important; width: 0 !important; height: 0 !important;">
                <span class="pmp-toggle-slider" style="position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background: #333333 !important; border-radius: 14px !important; transition: all 0.3s ease !important;"></span>
              </label>
            </div>

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">🔨</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Icônes d'action</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Afficher les icônes d'action</span>
                </div>
              </div>
              <label style="position: relative !important; display: inline-block !important; width: 48px !important; height: 28px !important; cursor: pointer !important;">
                <input type="checkbox" id="emoji-enabled-checkbox" checked style="opacity: 0 !important; width: 0 !important; height: 0 !important;">
                <span class="pmp-toggle-slider" style="position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background: #333333 !important; border-radius: 14px !important; transition: all 0.3s ease !important;"></span>
              </label>
            </div>

          </div>
        </div>

        <!-- Section Couleurs -->
        <div style="margin-bottom: 8px !important; background: #2a2a2a !important; border-radius: 10px !important; overflow: hidden !important;">
          <h3 style="margin: 0 !important; padding: 16px 20px !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: #a0a0a0 !important; background: #1a1a1a !important;">Couleur des bordures</h3>
          <div style="padding: 8px !important;">

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; margin-bottom: 4px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">🟢</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Connecté</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Couleur des joueurs connectés</span>
                </div>
              </div>
              <input type="color" id="color-connected" value="#4ade80" style="width: 48px !important; height: 48px !important; padding: 0 !important; border: 2px solid #3a3a3a !important; border-radius: 8px !important; cursor: pointer !important; transition: all 0.2s ease !important;">
            </div>

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; margin-bottom: 4px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">⚪</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Déconnecté</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Couleur des joueurs déconnectés</span>
                </div>
              </div>
              <input type="color" id="color-disconnected" value="#ffffff" style="width: 48px !important; height: 48px !important; padding: 0 !important; border: 2px solid #3a3a3a !important; border-radius: 8px !important; cursor: pointer !important; transition: all 0.2s ease !important;">
            </div>

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">👁️</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Opacité</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Transparence des couleurs</span>
                </div>
              </div>
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; min-width: 180px !important;">
                <input type="range" id="color-opacity-slider" min="0" max="100" value="100" class="pmp-slider" style="flex: 1 !important; height: 6px !important; background: #333333 !important; border-radius: 3px !important; outline: none !important; -webkit-appearance: none !important; cursor: pointer !important;">
                <span id="color-opacity-value" style="min-width: 50px !important; text-align: right !important; font-size: 14px !important; font-weight: 500 !important;">100%</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Section Tailles -->
        <div style="margin-bottom: 8px !important; background: #2a2a2a !important; border-radius: 10px !important; overflow: hidden !important;">
          <h3 style="margin: 0 !important; padding: 16px 20px !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: #a0a0a0 !important; background: #1a1a1a !important;">Tailles</h3>
          <div style="padding: 8px !important;">

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; margin-bottom: 4px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">📏</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Pions</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Taille des avatars</span>
                </div>
              </div>
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; min-width: 180px !important;">
                <input type="range" id="avatar-size-slider" min="${CONFIG.SIZE.MIN}" max="${CONFIG.SIZE.MAX}" value="100" class="pmp-slider" style="flex: 1 !important; height: 6px !important; background: #333333 !important; border-radius: 3px !important; outline: none !important; -webkit-appearance: none !important; cursor: pointer !important;">
                <span id="avatar-size-value" style="min-width: 50px !important; text-align: right !important; font-size: 14px !important; font-weight: 500 !important;">100%</span>
              </div>
            </div>

            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px !important; background: #1a1a1a !important; border-radius: 8px !important;">
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; flex: 1 !important;">
                <span style="font-size: 24px !important;">🎯</span>
                <div style="display: flex !important; flex-direction: column !important; gap: 4px !important;">
                  <span style="font-size: 15px !important; font-weight: 500 !important;">Icônes</span>
                  <span style="font-size: 13px !important; color: #a0a0a0 !important;">Taille des icônes d'action</span>
                </div>
              </div>
              <div style="display: flex !important; align-items: center !important; gap: 12px !important; min-width: 180px !important;">
                <input type="range" id="emoji-size-slider" min="12" max="28" value="18" class="pmp-slider" style="flex: 1 !important; height: 6px !important; background: #333333 !important; border-radius: 3px !important; outline: none !important; -webkit-appearance: none !important; cursor: pointer !important;">
                <span id="emoji-size-value" style="min-width: 50px !important; text-align: right !important; font-size: 14px !important; font-weight: 500 !important;">18px</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    `,

    /**
     * Attache les événements au panneau de configuration
     */
    attachPanelEvents: () => {
      const panel = document.getElementById('dreadcast-avatar-config-panel');
      if (!panel) return;

      const menuPanel = document.getElementById('pmp-settings-menu');
      const headDiv = panel.querySelector('.pmp-header-drag');

      if (menuPanel && headDiv) {
        UIComponents.createDraggableBehavior(menuPanel, headDiv);
      }

      // Fermeture du panneau
      const closeBtn = document.getElementById('avatar-close-btn');
      closeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        panel.style.display = 'none';
      });

      panel.addEventListener('click', (e) => {
        if (e.target === panel) {
          panel.style.display = 'none';
        }
      });

      // Toggle des avatars
      const avatarCheckbox = document.getElementById('avatar-enabled-checkbox');
      if (avatarCheckbox) {
        avatarCheckbox.checked = Storage.loadAvatarEnabled();
        avatarCheckbox.addEventListener('change', () => {
          Storage.saveAvatarEnabled(avatarCheckbox.checked);
          if (avatarCheckbox.checked) {
            Avatar.applyToAll(true);
          } else {
            DOM.removeAllAvatars();
          }
        });
      }

      // Toggle des emojis
      const emojiCheckbox = document.getElementById('emoji-enabled-checkbox');
      if (emojiCheckbox) {
        emojiCheckbox.checked = Storage.loadEmojiEnabled();
        emojiCheckbox.addEventListener('change', () => {
          Storage.saveEmojiEnabled(emojiCheckbox.checked);
          Avatar.applyToAll(true);
        });
      }

      // Slider taille avatars
      const sizeSlider = document.getElementById('avatar-size-slider');
      const sizeValue = document.getElementById('avatar-size-value');
      if (sizeSlider && sizeValue) {
        const currentSize = Storage.loadAvatarSize();
        sizeSlider.value = String(currentSize);
        sizeValue.textContent = `${currentSize}%`;

        sizeSlider.addEventListener('input', () => {
          const size = parseInt(sizeSlider.value, 10);
          sizeValue.textContent = `${size}%`;
          Storage.saveAvatarSize(size);
          SizingSystem.applyAvatarSize(size);
        });
      }

      // Slider taille emojis
      const emojiSizeSlider = document.getElementById('emoji-size-slider');
      const emojiSizeValue = document.getElementById('emoji-size-value');
      if (emojiSizeSlider && emojiSizeValue) {
        const currentEmojiSize = Storage.loadEmojiSize();
        emojiSizeSlider.value = String(currentEmojiSize);
        emojiSizeValue.textContent = `${currentEmojiSize}px`;

        emojiSizeSlider.addEventListener('input', () => {
          const size = parseInt(emojiSizeSlider.value, 10);
          emojiSizeValue.textContent = `${size}px`;
          Storage.saveEmojiSize(size);
          SizingSystem.applyEmojiSize(size);
        });
      }

      // Color pickers
      const colorConnected = document.getElementById('color-connected');
      const colorDisconnected = document.getElementById('color-disconnected');
      const colorOpacitySlider = document.getElementById('color-opacity-slider');
      const colorOpacityValue = document.getElementById('color-opacity-value');

      const customColors = Storage.loadCustomColors();
      if (colorConnected) colorConnected.value = customColors.connected || CONFIG.COLORS.CONNECTED;
      if (colorDisconnected) colorDisconnected.value = customColors.disconnected || CONFIG.COLORS.DISCONNECTED;

      if (colorOpacitySlider && colorOpacityValue) {
        const currentOpacity = Storage.loadColorOpacity();
        colorOpacitySlider.value = String(currentOpacity);
        colorOpacityValue.textContent = `${currentOpacity}%`;

        colorOpacitySlider.addEventListener('input', () => {
          const opacity = parseInt(colorOpacitySlider.value, 10);
          colorOpacityValue.textContent = `${opacity}%`;
          Storage.saveColorOpacity(opacity);
          Avatar.refreshAll();
        });
      }

      colorConnected?.addEventListener('input', () => {
        const colors = Storage.loadCustomColors();
        colors.connected = colorConnected.value;
        Storage.saveCustomColors(colors);
        Avatar.refreshAll();
      });

      colorDisconnected?.addEventListener('input', () => {
        const colors = Storage.loadCustomColors();
        colors.disconnected = colorDisconnected.value;
        Storage.saveCustomColors(colors);
        Avatar.refreshAll();
      });

      // Ajout du CSS pour les toggles
      UIComponents.addToggleCSS();
    },

    /**
     * Ajoute le CSS pour les toggles
     */
    addToggleCSS: () => {
      const style = document.createElement('style');
      style.textContent = `
        #pmp-settings-menu input[type="checkbox"]:checked + .pmp-toggle-slider {
          background: #4a9eff !important;
        }
        #pmp-settings-menu .pmp-toggle-slider::before {
          content: '' !important;
          position: absolute !important;
          height: 20px !important;
          width: 20px !important;
          left: 4px !important;
          bottom: 4px !important;
          background: white !important;
          border-radius: 50% !important;
          transition: transform 0.3s ease !important;
        }
        #pmp-settings-menu input[type="checkbox"]:checked + .pmp-toggle-slider::before {
          transform: translateX(20px) !important;
        }
      `;
      document.head.appendChild(style);
    },

    /**
     * Ouvre le panneau de configuration
     */
    openConfigPanel: () => {
      let panel = document.getElementById('dreadcast-avatar-config-panel');
      if (!panel) {
        panel = UIComponents.createConfigPanel();
      }
      if (panel) {
        panel.style.display = 'block';
      }
    }
  });

  // ==========================================================================
  // MODULE INTEGRATION DU MENU PARAMETRES
  // ==========================================================================

  /**
   * Module d'intégration au menu Dreadcast
   * @namespace MenuIntegration
   */
  const MenuIntegration = Object.freeze({
    /**
     * Ajoute l'option de menu PimpMyPion
     */
    addMenuOption: () => {
      const checkMenu = setInterval(() => {
        const parametresMenu = DOM.getSettingsMenu();

        if (parametresMenu) {
          clearInterval(checkMenu);

          if (document.getElementById('avatar-resize-menu-option')) {
            return;
          }

          const menuOption = document.createElement('li');
          menuOption.id = 'avatar-resize-menu-option';
          menuOption.className = 'link couleur2';
          menuOption.textContent = `🎀 PmP v ${VERSION}`;
          menuOption.style.cursor = 'pointer';

          menuOption.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            UIComponents.openConfigPanel();
          }, true);

          const lastSeparator = parametresMenu.querySelector('.separator:last-of-type');
          if (lastSeparator) {
            parametresMenu.insertBefore(menuOption, lastSeparator);
          } else {
            parametresMenu.appendChild(menuOption);
          }
        }
      }, CONFIG.TIMING.MENU_CHECK_INTERVAL);

      setTimeout(() => {
        clearInterval(checkMenu);
      }, CONFIG.TIMING.MENU_CHECK_TIMEOUT);
    }
  });

  // ==========================================================================
  // MODULE APPLICATIF PRINCIPAL
  // ==========================================================================

  /**
   * Module principal de l'application
   * @namespace App
   */
  const App = Object.freeze({
    /**
     * Initialise l'application
     */
    init: async () => {
      Utils.debugLog(`🚀 Initialisation de PimpMyPion v ${VERSION}`);

      // Appliquer la taille initiale des avatars
      const savedSize = Storage.loadAvatarSize();
      SizingSystem.applyAvatarSize(savedSize);

      // Intégrer le menu
      MenuIntegration.addMenuOption();

      // Première application des avatars (avec délai)
      await new Promise(resolve => setTimeout(resolve, CONFIG.TIMING.INIT_DELAY));
      await Avatar.applyToAll(false);

      // Démarrer le système de réapplication
      ReapplicationSystem.start();

      // Démarrer la détection de combat
      CombatDetection.start();

      // Application secondaire après délai
      await new Promise(resolve => setTimeout(resolve, CONFIG.TIMING.SECONDARY_DELAY));
      await Avatar.applyToAll(false);

      Utils.debugLog(`--> PimpMyPion v${VERSION} prêt !`);
    }
  });

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  // Démarrer l'application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }

})();
